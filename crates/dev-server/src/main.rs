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

use std::io::Read;
use std::path::{Path, PathBuf};
use tiny_http::{Header, Method, Request, Response, Server};

type Reply = Response<std::io::Cursor<Vec<u8>>>;

fn main() {
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let root: Option<PathBuf> = std::env::args().nth(1).map(PathBuf::from);
    let edits_path = PathBuf::from(std::env::var("TRINITY_EDITS").unwrap_or_else(|_| "data/edits.json".into()));
    let server = Server::http(format!("127.0.0.1:{port}")).expect("port is free");
    println!("dev-server on http://localhost:{port}  (edits save to {})", edits_path.display());
    for mut req in server.incoming_requests() {
        let url = req.url().to_string();
        let (path, query) = url.split_once('?').unwrap_or((url.as_str(), ""));
        let response = if path == "/api/edit" {
            save_edit(&mut req, &edits_path)
        } else if path == "/api/handler" {
            let params: trinity_core::Params = form_urlencoded::parse(query.as_bytes()).into_owned().collect();
            let route = params.get("route").cloned().unwrap_or_default();
            let body = if route == "editing" {
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
    let rel = path.trim_start_matches('/');
    let mut file = root.join(if rel.is_empty() { "index.html" } else { rel });
    if rel.contains("..") || !file.is_file() {
        file = root.join("index.html");
    }
    let kind = match file.extension().and_then(|e| e.to_str()) {
        Some("html") => "text/html; charset=utf-8",
        Some("js") => "text/javascript",
        Some("css") => "text/css",
        Some("svg") => "image/svg+xml",
        Some("png") => "image/png",
        Some("ico") => "image/x-icon",
        _ => "application/octet-stream",
    };
    match std::fs::read(&file) {
        Ok(bytes) => Response::from_data(bytes).with_header(header("Content-Type", kind)),
        Err(_) => Response::from_data(b"not found".to_vec()).with_status_code(404),
    }
}
