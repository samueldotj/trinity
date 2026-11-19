//! Vercel function: GET /api/handler?route=<name>&... answers every data request of the web app.
//! The work is done by `trinity_core::handle`, which the Tauri desktop app calls directly.

use serde_json::{Value, json};
use vercel_runtime::{Error, Request, run, service_fn};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(service_fn(handler)).await
}

async fn handler(req: Request) -> Result<Value, Error> {
    let params: trinity_core::Params = form_urlencoded::parse(req.uri().query().unwrap_or("").as_bytes())
        .into_owned()
        .collect();
    let route = params.get("route").cloned().unwrap_or_default();
    Ok(match trinity_core::handle(&route, &params) {
        Ok(value) => value,
        Err(message) => json!({ "error": message }),
    })
}
