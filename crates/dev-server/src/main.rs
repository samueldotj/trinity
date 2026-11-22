//! Local development server.
//!
//!     cargo run -p dev-server --release             # API on http://localhost:3001/api/handler
//!     cargo run -p dev-server --release -- web/dist  # also serve the built web app
//!
//! It answers /api/handler exactly as the Vercel function does, so `npm run dev` in web/
//! (which proxies /api here) and the deployed site behave the same.
//!
//! It also turns on edit mode: `POST /api/edit` with `{"key": "...", "value": "..." | null}`
//! changes one AI-written field and saves all edits to `data/edits.json` (or `$TRINITY_EDITS`).
//! The Vercel function has no such route, so the deployed site is read-only.
//!
//!     cargo run -p dev-server --release -- path/to/site --read-only
//!
//! `--read-only` turns edit mode off, as on Vercel. Use it when serving a site that embeds the
//! app (one that has its own `data/` folder, say), so nothing is saved there.
//!
//! Static files are served the way Vercel serves them: a folder URL loads its `index.html`
//! (`/trinity` redirects to `/trinity/`), and a missing file is a 404 (`404.html` if present).

use std::io::Read;
use std::path::{Component, Path, PathBuf};
use tiny_http::{Header, Method, Request, Response, Server};

type Reply = Response<std::io::Cursor<Vec<u8>>>;

fn main() {
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let args: Vec<String> = std::env::args().skip(1).collect();
    let read_only = args.iter().any(|a| a == "--read-only");
    let root: Option<PathBuf> = args.iter().find(|a| !a.starts_with("--")).map(PathBuf::from);
    let edits_path = PathBuf::from(std::env::var("TRINITY_EDITS").unwrap_or_else(|_| "data/edits.json".into()));
    let server = Server::http(format!("127.0.0.1:{port}")).expect("port is free");
    if read_only {
        println!("dev-server on http://localhost:{port}  (read-only)");
    } else {
        println!("dev-server on http://localhost:{port}  (edits save to {})", edits_path.display());
    }
    for mut req in server.incoming_requests() {
        let url = req.url().to_string();
        let (path, query) = url.split_once('?').unwrap_or((url.as_str(), ""));
        let response = if path == "/api/edit" && !read_only {
            save_edit(&mut req, &edits_path)
        } else if path == "/api/handler" {
            let params: trinity_core::Params = form_urlencoded::parse(query.as_bytes()).into_owned().collect();
            let route = params.get("route").cloned().unwrap_or_default();
            let body = if route == "editing" && !read_only {
                serde_json::json!({ "enabled": true, "edits": trinity_core::edits::count() })
            } else {
                trinity_core::handle(&route, &params).unwrap_or_else(|e| serde_json::json!({ "error": e }))
            };
            json(&body, 200)
        } else if let Some(root) = &root {
            static_file(root, path)
        } else {
            Response::from_string("not found").with_status_code(404)
        };
        let _ = req.respond(response);
    }
}

fn header(k: &str, v: &str) -> Header {
    Header::from_bytes(k.as_bytes(), v.as_bytes()).expect("valid header")
}

fn json(body: &serde_json::Value, status: u16) -> Reply {
    Response::from_string(body.to_string())
        .with_status_code(status)
        .with_header(header("Content-Type", "application/json"))
}

fn req_header<'a>(req: &'a Request, name: &'static str) -> Option<&'a str> {
    req.headers().iter().find(|h| h.field.equiv(name)).map(|h| h.value.as_str())
}

/// Only pages served from this machine may save: a website open in another tab cannot.
fn local_origin(req: &Request) -> bool {
    let ok = |v: &str| {
        let host = v.trim_start_matches("http://").split('/').next().unwrap_or("");
        let name = host.split(':').next().unwrap_or("");
        name == "localhost" || name == "127.0.0.1"
    };
    req_header(req, "Host").is_some_and(ok) && req_header(req, "Origin").is_none_or(ok)
}

fn save_edit(req: &mut Request, edits_path: &Path) -> Reply {
    if *req.method() != Method::Post {
        return json(&serde_json::json!({ "error": "use POST" }), 405);
    }
    if !local_origin(req) || !req_header(req, "Content-Type").is_some_and(|c| c.starts_with("application/json")) {
        return json(&serde_json::json!({ "error": "edits are accepted only from this computer" }), 403);
    }
    let mut body = String::new();
    if req.as_reader().take(200_000).read_to_string(&mut body).is_err() {
        return json(&serde_json::json!({ "error": "could not read the request" }), 400);
    }
    let parsed: serde_json::Value = match serde_json::from_str(&body) {
        Ok(v) => v,
        Err(_) => return json(&serde_json::json!({ "error": "the request is not JSON" }), 400),
    };
    let key = parsed["key"].as_str().unwrap_or("");
    let value = parsed["value"].as_str();
    if let Err(e) = trinity_core::set_edit(key, value) {
        return json(&serde_json::json!({ "error": e }), 400);
    }
    if let Err(e) = std::fs::write(edits_path, trinity_core::edits_json()) {
        return json(&serde_json::json!({ "error": format!("saved in memory but could not write {}: {e}", edits_path.display()) }), 500);
    }
    println!("edit saved: {key}{}", if value.is_none() { " (restored original)" } else { "" });
    json(&serde_json::json!({ "ok": true, "edits": trinity_core::edits::count() }), 200)
}

fn static_file(root: &Path, path: &str) -> Reply {
    // Percent-decode the path (`+` stays a plus, as in a URL path).
    let decoded = form_urlencoded::parse(format!("p={}", path.replace('+', "%2B")).as_bytes())
        .next()
        .map(|(_, v)| v.into_owned())
        .unwrap_or_default();
    let rel = Path::new(decoded.trim_start_matches('/'));
    if rel.components().any(|c| !matches!(c, Component::Normal(_))) {
        return not_found(root);
    }
    let mut file = root.join(rel);
    if file.is_dir() {
        if !path.ends_with('/') {
            return Response::from_data(Vec::new())
                .with_status_code(308)
                .with_header(header("Location", &format!("{path}/")));
        }
        file = file.join("index.html");
    }
    match std::fs::read(&file) {
        Ok(bytes) => Response::from_data(bytes).with_header(header("Content-Type", content_type(&file))),
        Err(_) => not_found(root),
    }
}

fn not_found(root: &Path) -> Reply {
    let page = std::fs::read(root.join("404.html")).unwrap_or_else(|_| b"not found".to_vec());
    Response::from_data(page)
        .with_status_code(404)
        .with_header(header("Content-Type", "text/html; charset=utf-8"))
}

fn content_type(file: &Path) -> &'static str {
    match file.extension().and_then(|e| e.to_str()).unwrap_or("") {
        "html" => "text/html; charset=utf-8",
        "js" | "mjs" => "text/javascript",
        "css" => "text/css",
        "json" => "application/json",
        "xml" => "application/xml",
        "txt" => "text/plain; charset=utf-8",
        "svg" => "image/svg+xml",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "webp" => "image/webp",
        "avif" => "image/avif",
        "ico" => "image/x-icon",
        "woff2" => "font/woff2",
        _ => "application/octet-stream",
    }
}
