# Trinity Explained — web and desktop app

An HTML5 app that explains the Trinity: 46 teachings with diagrams, 4,500+ Bible passages (BSB), 26 themes and 272 topics with plain-language answers, 6,613 questions answered by the classical writers, and a reader for the 16 public-domain works in `corpus/`.

## Layout

| Path | What it is |
|---|---|
| `crates/trinity-core/` | Rust library: the data in `data/` compiled in, and every query the screens make (`handle(route, params)`). |
| `api/handler.rs` | Vercel Rust function: `GET /api/handler?route=…` → `trinity_core::handle`. |
| `crates/dev-server/` | Local server with the same API, and it can also serve the built site. |
| `web/` | Front end: Vite + TypeScript, no UI framework. Hash routes `#/explanations`, `#/reference`, `#/topics`, `#/qa`, `#/writings`, `#/reader`, `#/heresies`. |
| `web/src-tauri/` | Tauri 2 desktop shell. The front end calls the Rust core through the `api` command, so it works offline. |
| `data/` | Data the app embeds, built from the corpus by `scripts/site/build_all.py`. |
| `data/heresies.json` | The Heresies page, written by hand (not built from the corpus): each entry's origin, founder, summary, and the teaching numbers it denies. |
| `corpus/qa/topics.ta.json` | Tamil for the Topics page (theme names and descriptions, topic titles, answers, quotes), made by `scripts/translate_topics.py` (Batch API) and merged into `data/topics.json` as `*_ta` fields by `build_all.py`. A translation is used only while its stored English matches. |
| `corpus/qa/questions.ta.json` | Tamil for the Q&A page (each question and every writer's answer; quotes stay English), made by `scripts/translate_questions.py` (Batch API). `build_questions_data.py` writes the ones still matching the English to `data/questions.ta.json`. |
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

## Editing the AI-written text (local only)

1. Build the site and run the local server from the repo root: `cd web && npm run build && cd ..`, then `cargo run -p dev-server --release -- web/dist`.
2. Open http://localhost:3001. The rail shows **Edit mode: on** (click to hide the pencils while you read).
3. On Topics and Q&A, every AI-written block has an **Edit** button: topic answers, "What earlier Christian writers thought", theme descriptions, question wording, "Across the sources" and each writer's answer summary. Save, Cancel (Esc), Save with Ctrl+Enter, or **Restore original**.
4. Edits are written to `data/edits.json` at once. Review them with `git diff data/edits.json`, commit, and deploy: the Rust core compiles the edits in, so the published site shows your text.

Bible verses, quotations from the books and the books themselves have no edit key, and the server refuses any key that is not an AI-written field. The deployed Vercel function and the desktop app have no save route, so they are read-only. The save endpoint only accepts requests from pages on this computer.

Edits live apart from the generated files, so regenerating the answers keeps them; if the generated text changes, compare it with your edit before deploying.

## Changing the data

1. Rebuild the corpus outputs if needed (`scripts/…`, see `corpus/README.md`).
2. Regenerate topic answers if topics changed: `python scripts/build_topic_answers.py submit` then `collect` (uses the Anthropic Batch API).
3. `python scripts/site/build_all.py` to rewrite `data/`.
4. `cargo test -p trinity-core` and rebuild or redeploy. The data is compiled into the binaries, so a rebuild picks up the change.

Scripture quotations are from the Berean Standard Bible (BSB), which is in the public domain. The classical texts are public-domain editions.
