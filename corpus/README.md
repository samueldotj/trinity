# Trinity source corpus

Public-domain texts on the Trinity, extracted into Markdown and SQLite as input for the AI summarization stage.

Rebuild everything (downloads any missing raw files):

```
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python scripts\build_corpus.py            # add --offline to skip downloads
```

## Layout

| Path | Contents |
|---|---|
| `raw/` | Original downloads (CCEL ThML XML, HTML transcriptions, archive.org OCR). Not committed. Rebuildable. |
| `text/<work-id>.md` | One readable file per work: headings per section, footnotes after each section |
| `trinity.db` | SQLite database (schema below) |
| `manifest.json` | Section, word, footnote, reference and chunk counts per work |

## Database

- `works`: author, title, date, era, tradition, translator, edition, source URL
- `sections`: one row per chapter or section; `path` is the heading hierarchy (`Book I > Chapter 3`); `role` is `primary` (the author) or `editorial` (19th-century editor or translator introductions)
- `footnotes`: footnotes per section. In the text they appear as `[^n]` markers.
- `scripture_refs`: Bible references as OSIS (`John.10.30`), plus `book`/`chapter`/`verse` and whether the reference is in a footnote. `method='thml'` means tagged by CCEL editors; `regex` means detected automatically.
- `chunks`: sections split at paragraph boundaries into pieces of about 900 words, ready to send to an LLM
- `chunks_fts`: FTS5 full-text index over chunks

Example queries:

```sql
-- Every author's use of John 10:30
SELECT w.author, s.path FROM scripture_refs r JOIN sections s ON s.id=r.section_id
JOIN works w ON w.id=r.work_id WHERE r.book='John' AND r.chapter=10 AND r.verse=30;

-- Full-text search
SELECT c.work_id, snippet(chunks_fts,0,'[',']','…',12) FROM chunks_fts
JOIN chunks c ON c.id=chunks_fts.rowid WHERE chunks_fts MATCH 'consubstantial';
```

## Sources and quality notes

- **Church Fathers** (Irenaeus, Hippolytus, Novatian, Athanasius, Basil, Gregory of Nyssa, Hilary, Ambrose, Augustine): Schaff's *Ante-Nicene* / *Nicene and Post-Nicene Fathers* translations (1885–1900), from CCEL ThML. Clean text, with footnotes and editor-tagged Scripture references.
- **Owen** (both works) and **Edwards**: CCEL ThML. Clean.
- **Bickersteth**: the 1859 first edition, *The Rock of Ages*, from a newscriptorium.com transcription. Spelling is selectively modernized and footnotes are inline. The later expanded edition was titled *The Trinity*.
- **Warfield**: the 1915 ISBE article "Trinity", from an apuritansmind.com copy, as one section. Some section headings and the bibliography from the original are not present.
- **Waterland**: *Works*, vol. 1 (1856), archive.org OCR. Running headers and garbled lines have been removed, but OCR errors remain (e.g. "Olarke" for "Clarke", broken Greek). Treat quotes from it with care. The corrected section titles come from the Query statements.
