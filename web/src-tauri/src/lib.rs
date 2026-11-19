//! Desktop shell. The front end calls `invoke("api", { route, params })`, which runs the same
//! `trinity_core::handle` the Vercel function uses, so the app works offline with no server.

use std::collections::HashMap;

#[tauri::command]
fn api(route: String, params: HashMap<String, String>) -> Result<serde_json::Value, String> {
    trinity_core::handle(&route, &params)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![api])
        .run(tauri::generate_context!())
        .expect("error while running Trinity Explained");
}
