//! Local development server.
//!
//!     cargo run -p dev-server --release            # API on http://localhost:3001/api/handler
//!     cargo run -p dev-server --release -- web/dist # also serve the built web app
//!
//! It answers /api/handler exactly as the Vercel function does, so `npm run dev` in web/
//! (which proxies /api here) and the deployed site behave the same.

use std::path::{Path, PathBuf};
use tiny_http::{Header, Response, Server};

fn main() {
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let root: Option<PathBuf> = std::env::args().nth(1).map(PathBuf::from);
    let server = Server::http(format!("127.0.0.1:{port}")).expect("port is free");
    println!("dev-server on http://localhost:{port}");
    for req in server.incoming_requests() {
        let url = req.url().to_string();
        let (path, query) = url.split_once('?').unwrap_or((url.as_str(), ""));
        let response = if path == "/api/handler" {
            let params: trinity_core::Params = form_urlencoded::parse(query.as_bytes()).into_owned().collect();
            let route = params.get("route").cloned().unwrap_or_default();
            let body = match trinity_core::handle(&route, &params) {
                Ok(v) => v,
                Err(e) => serde_json::json!({ "error": e }),
            };
            Response::from_string(body.to_string()).with_header(header("Content-Type", "application/json"))
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

fn static_file(root: &Path, path: &str) -> Response<std::io::Cursor<Vec<u8>>> {
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
