"""Download, extract and store the Trinity source corpus.

    python scripts/build_corpus.py            # download missing raw files, rebuild everything
    python scripts/build_corpus.py --offline  # rebuild from raw files only

Outputs (under corpus/):
    text/<work-id>.md   readable full text with headings and footnotes per section
    trinity.db          SQLite: works, sections, footnotes, scripture_refs, chunks (+ FTS5 index)
    manifest.json       per-work stats
"""
import argparse, json, re, sqlite3, sys, time, unicodedata
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from lxml import etree

sys.path.insert(0, str(Path(__file__).parent))
from catalog import DOWNLOADS, WORKS  # noqa: E402
from scripture import find_refs  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent / "corpus"
RAW, TEXT, DB = ROOT / "raw", ROOT / "text", ROOT / "trinity.db"
CHUNK_WORDS = 900  # target size of AI-ready chunks


# ---------------------------------------------------------------- helpers
def clean(s):
    s = unicodedata.normalize("NFC", s).replace(" ", " ").replace("­", "")
    return re.sub(r"\s+", " ", s).strip()


def download(missing_only=True):
    for rel, url in DOWNLOADS.items():
        dest = RAW / rel
        if missing_only and dest.exists() and dest.stat().st_size > 10_000:
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        print(f"  downloading {url}")
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (corpus builder)"}, timeout=120)
        r.raise_for_status()
        dest.write_bytes(r.content)
        time.sleep(1)


class Section:
    def __init__(self, path, role, source_id=None):
        self.path, self.role, self.source_id = path, role, source_id
        self.paras, self.notes, self.refs = [], [], []  # refs: (osis, label, in_note)

    @property
    def text(self):
        return "\n\n".join(self.paras)


# ---------------------------------------------------------------- ThML (CCEL)
DIV_RE = re.compile(r"div[1-6]$")
SKIP_TAGS = {"pb", "insertIndex", "index", "added", "deleted"}
_thml_cache = {}


def thml_tree(rel):
    if rel not in _thml_cache:
        _thml_cache[rel] = etree.parse(str(RAW / rel), etree.XMLParser(recover=True, huge_tree=True))
    return _thml_cache[rel]


def _inline(el, sec, in_note):
    """Text of an element; footnotes become [^n] markers and go to sec.notes."""
    out = [el.text or ""]
    for ch in el:
        tag = ch.tag if isinstance(ch.tag, str) else None
        if tag == "note":
            n = ch.get("n") or str(len(sec.notes) + 1)
            body = clean(" ".join(_inline(p, sec, True) for p in ch) or (ch.text or ""))
            if body:
                sec.notes.append((n, body))
                out.append(f"[^{n}]")
        elif tag == "scripRef":
            label = clean("".join(ch.itertext()))
            osis = ch.get("osisRef") or ""
            for one in filter(None, osis.replace("Bible:", "").split()):
                sec.refs.append((one, label, in_note))
            out.append(label)
        elif tag in SKIP_TAGS or tag is None:
            pass
        elif tag == "br":
            out.append(" ")
        else:
            out.append(_inline(ch, sec, in_note))
        out.append(ch.tail or "")
    return "".join(out)


EDITORIAL_TITLES = {"introduction", "introductory essay", "translator's preface", "translators preface",
                    "translator’s preface", "introductory note", "introductory notice", "prefatory note",
                    "elucidation", "title page"}


def _walk_div(div, path, role, sections):
    title = clean(div.get("title") or "")
    if title and (not path or path[-1] != title):
        path = path + [title]
    sec_role = "editorial" if title.rstrip(".").lower() in EDITORIAL_TITLES else role
    sec = Section(path, sec_role, div.get("id"))
    for ch in div:
        tag = ch.tag if isinstance(ch.tag, str) else None
        if tag and DIV_RE.match(tag):
            continue
        if tag in SKIP_TAGS or tag is None:
            continue
        txt = clean(_inline(ch, sec, False))
        if txt and not (len(sec.paras) == 0 and txt.rstrip(".") == title.rstrip(".")):
            sec.paras.append(txt)
    if sec.paras:
        sections.append(sec)
    for ch in div:
        if isinstance(ch.tag, str) and DIV_RE.match(ch.tag):
            _walk_div(ch, path, role, sections)


def extract_thml(work):
    tree = thml_tree(work["raw"])
    sections = []
    for div_id, role in work["parts"]:
        hits = tree.xpath(f"//*[@id='{div_id}']")
        if not hits:
            raise ValueError(f"{work['id']}: div {div_id} not found")
        _walk_div(hits[0], [], role, sections)
    return sections


# ---------------------------------------------------------------- plain sources
def _add_regex_refs(sections):
    for s in sections:
        for p in s.paras:
            for osis, label in find_refs(p):
                s.refs.append((osis, label, False))
        for _, body in s.notes:
            for osis, label in find_refs(body):
                s.refs.append((osis, label, True))
    return sections


def extract_bickersteth(work):
    html = (RAW / work["raw"]).read_bytes().decode("cp1252", errors="replace")
    soup = BeautifulSoup(html, "lxml")
    paras = [clean(p.get_text("").replace("Â", "")) for p in soup.find_all("p")]
    paras = [p for p in paras if p]
    # contents list gives chapter titles: "Chapter 1. – Introduction. ..."
    titles = {}
    for p in paras[:30]:
        m = re.match(r"Chapter (\d+)\.\s*[–-]\s*(.+)", p)
        if m:
            titles[m.group(1)] = f"Chapter {m.group(1)}. {m.group(2)}"
    start = next(i for i, p in enumerate(paras) if i > 8 and p.rstrip(".") == "Preface")
    sections = [Section(["Front matter"], "editorial")]
    sections[0].paras = paras[:7]
    cur = Section(["Preface"], "primary")
    sections.append(cur)
    for p in paras[start + 1:]:
        m = re.fullmatch(r"Chapter (\d+)\.", p)
        if m:
            cur = Section([titles.get(m.group(1), p)], "primary")
            sections.append(cur)
        else:
            cur.paras.append(p)
    return _add_regex_refs(sections)


def extract_warfield(work):
    html = (RAW / work["raw"]).read_bytes().decode("utf-8", errors="replace")
    soup = BeautifulSoup(html, "lxml")
    box = soup.find(string=lambda x: x and "is not a Biblical term" in x).parent.parent
    paras = [clean(p.get_text("")) for p in box.find_all("p")]
    paras = [p for p in paras if p and not p.startswith("BB Warfield explains")]
    sec = Section(["The Biblical Doctrine of the Trinity"], "primary")
    sec.paras = paras
    return _add_regex_refs([sec])


_GARBAGE = re.compile(r"[^A-Za-zͰ-Ͽἀ-῿]")


def _is_noise(line):
    s = line.strip()
    if not s:
        return False
    if re.match(r"^\d+\s+A DEFENCE\b", s) or re.match(r"^A DEFENCE\b.*\d+\s*$", s):
        return True  # running page headers
    if re.fullmatch(r"Qu\.\s*[\w.]*\s*\d*\.?", s):
        return True
    if re.match(r"^QUERY\s", s):
        return False
    if len(s) < 40:
        letters = len(s) - len(_GARBAGE.findall(s))
        latin = len(re.findall(r"[A-Za-z]", s))
        if letters < len(s) * 0.6 or (latin < 3 and not re.search(r"[Ͱ-Ͽἀ-῿]{3,}", s)):
            return True
    return False


def _join_ocr(lines):
    """Join OCR lines into paragraphs, repairing end-of-line hyphenation."""
    paras, buf = [], ""
    for line in lines + [""]:
        s = line.strip()
        if not s:
            if buf:
                paras.append(clean(buf))
                buf = ""
            continue
        if buf.endswith("-") and not buf.endswith("--"):
            buf = buf[:-1] + s
        else:
            buf = (buf + " " + s) if buf else s
    return paras


def extract_waterland(work):
    lines = (RAW / work["raw"]).read_text(encoding="utf-8", errors="replace").splitlines()
    start = next(i for i, l in enumerate(lines) if i > 13000 and l.strip() == "PREFACE,")
    end = next(i for i, l in enumerate(lines) if i > start and l.strip().startswith("END OF VOL. I"))
    body = [l for l in lines[start:end] if not _is_noise(l)]
    sections, cur, buf = [], Section(["Preface"], "primary"), []
    query_re = re.compile(r"^QUERY\s+\S{1,8}\s*$")  # OCR mangles numerals (VIU, Greek ΧΧΙ, XXIIL)
    for l in body:
        m = query_re.match(l.strip())
        if m:
            cur.paras = _join_ocr(buf)
            sections.append(cur)
            cur, buf = Section([f"Query {len(sections)}"], "primary"), []
        else:
            buf.append(l)
    cur.paras = _join_ocr(buf)
    sections.append(cur)
    # Query headings are OCR-damaged (e.g. "VIU"); number them sequentially instead.
    for s in sections[1:]:
        first = s.paras[0] if s.paras else ""
        s.path = [s.path[0] + (": " + first[:160] if first.startswith("Whether") else "")]
    return _add_regex_refs(sections)


EXTRACTORS = {"thml": extract_thml, "bickersteth": extract_bickersteth,
              "warfield": extract_warfield, "waterland": extract_waterland}


# ---------------------------------------------------------------- chunking
def make_chunks(text, target=CHUNK_WORDS):
    pieces = []
    for p in text.split("\n\n"):
        if len(p.split()) <= target:
            pieces.append(p)
            continue
        cur, cn = [], 0  # very long paragraph: split at sentence boundaries
        for s in re.split(r"(?<=[.!?])\s+", p):
            if cur and cn + len(s.split()) > target:
                pieces.append(" ".join(cur))
                cur, cn = [], 0
            cur.append(s)
            cn += len(s.split())
        if cur:
            pieces.append(" ".join(cur))
    chunks, buf, n = [], [], 0
    for p in pieces:
        w = len(p.split())
        if buf and n + w > target * 1.2:
            chunks.append("\n\n".join(buf))
            buf, n = [], 0
        buf.append(p)
        n += w
    if buf:
        chunks.append("\n\n".join(buf))
    return chunks


# ---------------------------------------------------------------- storage
SCHEMA = """
CREATE TABLE works (id TEXT PRIMARY KEY, author TEXT, title TEXT, date TEXT, era TEXT, tradition TEXT,
    language TEXT, translator TEXT, edition TEXT, source_url TEXT, source_file TEXT, word_count INTEGER);
CREATE TABLE sections (id INTEGER PRIMARY KEY, work_id TEXT REFERENCES works(id), seq INTEGER,
    path TEXT, title TEXT, depth INTEGER, role TEXT, source_div TEXT, text TEXT, word_count INTEGER);
CREATE TABLE footnotes (id INTEGER PRIMARY KEY, section_id INTEGER REFERENCES sections(id), n TEXT, text TEXT);
CREATE TABLE scripture_refs (id INTEGER PRIMARY KEY, section_id INTEGER REFERENCES sections(id),
    work_id TEXT, osis TEXT, book TEXT, chapter INTEGER, verse INTEGER, label TEXT, in_footnote INTEGER,
    method TEXT);
CREATE TABLE chunks (id INTEGER PRIMARY KEY, section_id INTEGER REFERENCES sections(id), work_id TEXT,
    seq INTEGER, text TEXT, word_count INTEGER);
CREATE VIRTUAL TABLE chunks_fts USING fts5(text, content='chunks', content_rowid='id', tokenize='porter unicode61');
CREATE INDEX ix_sections_work ON sections(work_id, seq);
CREATE INDEX ix_refs_osis ON scripture_refs(book, chapter, verse);
CREATE INDEX ix_chunks_section ON chunks(section_id);
"""


def write_markdown(work, sections):
    lines = [f"# {work['title']}", "",
             f"**Author:** {work['author']}  ", f"**Date:** {work['date']}  ",
             f"**Translator:** {work['translator'] or '—'}  ", f"**Edition:** {work['edition']}  ",
             f"**Source:** {DOWNLOADS[work['raw']]}", ""]
    for s in sections:
        depth = min(len(s.path), 4)
        tag = " *(editorial)*" if s.role == "editorial" else ""
        lines += [f"{'#' * (depth + 1)} {s.path[-1] if s.path else work['title']}{tag}", "", s.text, ""]
        if s.notes:
            lines += [f"[^{n}]: {t}" for n, t in s.notes] + [""]
    (TEXT / f"{work['id']}.md").write_text("\n".join(lines), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--offline", action="store_true")
    ap.add_argument("--refetch", action="store_true")
    args = ap.parse_args()
    if not args.offline:
        download(missing_only=not args.refetch)
    TEXT.mkdir(parents=True, exist_ok=True)
    if DB.exists():
        DB.unlink()
    db = sqlite3.connect(DB)
    db.executescript(SCHEMA)
    manifest = []
    for work in WORKS:
        sections = EXTRACTORS[work["kind"]](work)
        method = "thml" if work["kind"] == "thml" else "regex"
        total = sum(len(s.text.split()) for s in sections)
        db.execute("INSERT INTO works VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                   (work["id"], work["author"], work["title"], work["date"], work["era"], work["tradition"],
                    work["language"], work["translator"], work["edition"], DOWNLOADS[work["raw"]],
                    f"raw/{work['raw']}", total))
        nrefs = nchunks = 0
        for seq, s in enumerate(sections):
            cur = db.execute(
                "INSERT INTO sections (work_id, seq, path, title, depth, role, source_div, text, word_count)"
                " VALUES (?,?,?,?,?,?,?,?,?)",
                (work["id"], seq, " > ".join(s.path), s.path[-1] if s.path else "", len(s.path), s.role,
                 s.source_id, s.text, len(s.text.split())))
            sid = cur.lastrowid
            db.executemany("INSERT INTO footnotes (section_id, n, text) VALUES (?,?,?)",
                           [(sid, n, t) for n, t in s.notes])
            for osis, label, in_note in s.refs:
                m = re.match(r"([1-3]?[A-Za-z]+)\.(\d+)(?:\.(\d+))?", osis)
                book, ch, v = (m.group(1), int(m.group(2)), int(m.group(3)) if m.group(3) else None) if m \
                    else (None, None, None)
                db.execute("INSERT INTO scripture_refs (section_id, work_id, osis, book, chapter, verse, label,"
                           " in_footnote, method) VALUES (?,?,?,?,?,?,?,?,?)",
                           (sid, work["id"], osis, book, ch, v, label, int(in_note), method))
                nrefs += 1
            for cseq, ctext in enumerate(make_chunks(s.text)):
                db.execute("INSERT INTO chunks (section_id, work_id, seq, text, word_count) VALUES (?,?,?,?,?)",
                           (sid, work["id"], cseq, ctext, len(ctext.split())))
                nchunks += 1
        write_markdown(work, sections)
        stats = dict(id=work["id"], sections=len(sections), words=total, footnotes=sum(len(s.notes) for s in sections),
                     scripture_refs=nrefs, chunks=nchunks)
        manifest.append(stats)
        print(f"  {work['id']:<38} {len(sections):>4} sections {total:>8} words {nrefs:>5} refs {nchunks:>4} chunks")
    db.execute("INSERT INTO chunks_fts(rowid, text) SELECT id, text FROM chunks")
    db.commit()
    db.close()
    (ROOT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"done: {DB}")


if __name__ == "__main__":
    main()
