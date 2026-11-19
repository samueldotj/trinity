# Trinity Explained — web and desktop app

An HTML5 app that explains the Trinity: 46 teachings with diagrams, 4,500+ Bible passages (BSB), 26 themes and 272 topics with plain-language answers, 6,613 questions answered by the classical writers, and a reader for the 16 public-domain works in `corpus/`.

## Layout

| Path | What it is |
|---|---|
| `crates/trinity-core/` | Rust library: the data in `data/` compiled in, and every query the screens make (`handle(route, params)`). |
| `api/handler.rs` | Vercel Rust function: `GET /api/handler?route=…` → `trinity_core::handle`. |
| `crates/dev-server/` | Local server with the same API, and it can also serve the built site. |
| `web/` | Front end: Vite + TypeScript, no UI framework. Hash routes `#/explanations`, `#/reference`, `#/topics`, `#/qa`, `#/writings`, `#/reader`. |
| `web/src-tauri/` | Tauri 2 desktop shell. The front end calls the Rust core through the `api` command, so it works offline. |
| `data/` | Data the app embeds, built from the corpus by `scripts/site/build_all.py`. |
| `scripts/site/` | Scripts that build `data/`. |
| `design/canvas/` | The design canvas the app was built from. |

## Run locally

```
cargo run -p dev-server --release            # API on http://localhost:3001
cd web && npm install && npm run dev         # site on http://localhost:5173, /api proxied to 3001
```

Or build the site and let the Rust server serve everything on one port:

```
cd web && npm run build && cd ..
cargo run -p dev-server --release -- web/dist   # http://localhost:3001
```

## Desktop app (Tauri)

```
cd web
npm run tauri dev       # development window
npm run tauri build     # installers in web/src-tauri/target/release/bundle
```

Needs the Tauri prerequisites for your OS (on Windows: WebView2 and the MSVC build tools).

## Deploy to Vercel

The repository deploys as-is: `vercel.json` builds `web/` into `web/dist`, and Vercel's Rust runtime (beta) builds `api/handler.rs` from the root `Cargo.toml`.

```
npx vercel        # preview
npx vercel --prod
```

API responses are cached at the edge for a day (`vercel.json` headers), since the data only changes when you redeploy.

## Changing the data

1. Rebuild the corpus outputs if needed (`scripts/…`, see `corpus/README.md`).
2. Regenerate topic answers if topics changed: `python scripts/build_topic_answers.py submit` then `collect` (uses the Anthropic Batch API).
3. `python scripts/site/build_all.py` to rewrite `data/`.
4. `cargo test -p trinity-core` and rebuild or redeploy. The data is compiled into the binaries, so a rebuild picks up the change.

Scripture quotations are from the Berean Standard Bible (BSB), which is in the public domain. The classical texts are public-domain editions.
