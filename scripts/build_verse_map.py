"""Stage 5: map Bible verses to the topics and themes they are used for, and back.

    python scripts/build_verse_map.py --run 4

No API calls. Two kinds of link are recorded for every verse:
  direct   - the verse is listed in an extracted question's Scripture references, so we know what the
             author used it for (that question's topic and theme).
  context  - the verse is cited in the author's text (CCEL-tagged or detected reference, footnotes and
             editorial sections excluded) but no question lists it; it is linked to the topics of the
             questions drawn from the same passage, and marked as context.

Outputs in corpus/qa/:
  verse_map_run<N>.json / .md     verse (Genesis -> Revelation, then deuterocanonical) -> themes -> topics
  topic_verses_run<N>.json / .md  theme -> topic -> verses, most used first
and table verse_uses in corpus/questions.db.
"""
import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from qa_common import ROOT, corpus_db, qa_db  # noqa: E402
from scripture import _BOOKS, _LOOKUP  # noqa: E402

DEUTERO = {"Tob": ["Tobit", "Tob"], "Jdt": ["Judith", "Jdt"], "Wis": ["Wisdom of Solomon", "Wisdom", "Wis"],
           "Sir": ["Sirach", "Ecclesiasticus", "Sir", "Ecclus"], "Bar": ["Baruch", "Bar"],
           "1Macc": ["1 Maccabees", "1 Macc"], "2Macc": ["2 Maccabees", "2 Macc"],
           "Sus": ["Susanna", "Sus"], "Bel": ["Bel and the Dragon", "Bel"]}
BOOK_ORDER = list(_BOOKS) + list(DEUTERO)
BOOK_NAME = {k: v[0] for k, v in {**_BOOKS, **DEUTERO}.items()}
NAMES = dict(_LOOKUP)
for osis, names in DEUTERO.items():
    for n in names:
        NAMES[n.lower()] = osis
NAMES.update({"song of songs": "Song", "song": "Song", "psalms": "Ps", "psalm": "Ps", "revelations": "Rev",
              "apocalypse": "Rev", "qoheleth": "Eccl"})
MAX_RANGE = 30  # expand verse ranges up to this many verses

REF_RE = re.compile(r"^\s*((?:[1-3]|I{1,3})?\s?[A-Za-z][A-Za-z .]*?)\.?\s+(\d+)(?::(\d+)(?:\s*[-–]\s*(\d+)"
                    r"(?::(\d+))?)?)?\s*$")

SCHEMA = """
DROP TABLE IF EXISTS verse_uses;
CREATE TABLE verse_uses (id INTEGER PRIMARY KEY, run_id INTEGER, book TEXT, chapter INTEGER, verse INTEGER,
    ref TEXT, link TEXT, author TEXT, work_id TEXT, raw_question_id INTEGER, canonical_id INTEGER,
    topic_id INTEGER, theme_id INTEGER);
CREATE INDEX ix_verse_uses_ref ON verse_uses(run_id, book, chapter, verse);
CREATE INDEX ix_verse_uses_topic ON verse_uses(run_id, topic_id);
"""


def parse_ref(text):
    """'John 10:30' / 'Rom. 8:9-11' / 'Proverbs 8' -> (book, chapter, [verses]) or None.
    A chapter-only reference gives verses == [None]."""
    out = []
    for part in re.split(r"\s*;\s*", text):
        m = REF_RE.match(part)
        if not m:
            continue
        book = NAMES.get(re.sub(r"\s+", " ", m.group(1)).strip().lower()) or NAMES.get(
            m.group(1).replace(" ", "").lower())
        if not book:
            continue
        ch = int(m.group(2))
        if not m.group(3):
            out.append((book, ch, [None]))
            continue
        v1 = int(m.group(3))
        if m.group(5):  # cross-chapter range: keep the starting verse only
            out.append((book, ch, [v1]))
        elif m.group(4) and int(m.group(4)) > v1:
            out.append((book, ch, list(range(v1, min(int(m.group(4)), v1 + MAX_RANGE - 1) + 1))))
        else:
            out.append((book, ch, [v1]))
    return out


def osis_parse(osis):
    """CCEL/OSIS 'John.10.30' or 'John.10.30-John.10.32' -> (book, chapter, [verses])."""
    m = re.match(r"([1-3]?[A-Za-z]+)\.(\d+)(?:\.(\d+))?(?:-\1\.(\d+)\.(\d+))?$", osis)
    if not m or m.group(1) not in BOOK_NAME:
        return None
    ch, v1 = int(m.group(2)), (int(m.group(3)) if m.group(3) else None)
    if v1 and m.group(4) and int(m.group(4)) == ch and int(m.group(5)) > v1:
        return m.group(1), ch, list(range(v1, min(int(m.group(5)), v1 + MAX_RANGE - 1) + 1))
    return m.group(1), ch, [v1]


def label(book, ch, v):
    return f"{BOOK_NAME[book]} {ch}" + (f":{v}" if v else "")


def sort_key(book, ch, v):
    return (BOOK_ORDER.index(book), ch, v or 0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", type=int, required=True)
    args = ap.parse_args()
    qdb, cdb = qa_db(), corpus_db()
    qdb.executescript(SCHEMA)

    # question -> canonical -> topic -> theme
    topic_of_canon = {r[0]: r[1] for r in qdb.execute(
        "SELECT m.canonical_id, m.topic_id FROM topic_members m JOIN topics t ON t.id = m.topic_id"
        " WHERE t.run_id = ?", (args.run,))}
    theme_of_topic = {r[0]: r[1] for r in qdb.execute(
        "SELECT x.topic_id, x.theme_id FROM theme_topics x JOIN themes h ON h.id = x.theme_id WHERE h.run_id = ?",
        (args.run,))}
    canon_of_raw = {r[0]: r[1] for r in qdb.execute(
        "SELECT m.raw_question_id, m.canonical_id FROM canonical_members m JOIN canonical_questions c"
        " ON c.id = m.canonical_id WHERE c.run_id = ?", (args.run,))}
    topics = {r["id"]: dict(r) for r in qdb.execute("SELECT * FROM topics WHERE run_id = ?", (args.run,))}
    themes = {r["id"]: dict(r) for r in qdb.execute("SELECT * FROM themes WHERE run_id = ?", (args.run,))}
    if not themes:
        sys.exit(f"no themes for run {args.run}; run build_themes.py first")

    rows, unparsed = [], []
    direct_keys = set()  # (chunk_id, book, ch, verse) already covered by a question
    by_chunk = defaultdict(list)  # chunk_id -> [(raw_id, canon, topic, theme, author, work)]
    for q in qdb.execute("SELECT id, chunk_id, author, work_id, scripture FROM raw_questions WHERE run_id = ?",
                         (args.run,)).fetchall():
        canon = canon_of_raw.get(q["id"])
        if canon is None:  # unverified quote, excluded at dedupe
            continue
        topic = topic_of_canon.get(canon)
        theme = theme_of_topic.get(topic)
        by_chunk[q["chunk_id"]].append((q["id"], canon, topic, theme, q["author"], q["work_id"]))
        for ref in json.loads(q["scripture"]):
            parsed = parse_ref(ref)
            if not parsed:
                unparsed.append(ref)
            for book, ch, verses in parsed:
                for v in verses:
                    direct_keys.add((q["chunk_id"], book, ch, v))
                    rows.append((args.run, book, ch, v, label(book, ch, v), "direct", q["author"], q["work_id"],
                                 q["id"], canon, topic, theme))
    n_direct = len(rows)

    # passage-level citations not covered by a question: link to the topics drawn from that passage
    authors = {r[0]: r[1] for r in cdb.execute("SELECT id, author FROM works")}
    chunks_of_section = defaultdict(list)
    for r in cdb.execute("SELECT id, section_id, text FROM chunks"):
        chunks_of_section[r[1]].append((r[0], r[2]))
    for r in cdb.execute("SELECT r.section_id, r.work_id, r.osis, r.label FROM scripture_refs r JOIN sections s"
                         " ON s.id = r.section_id WHERE r.in_footnote = 0 AND s.role = 'primary'"):
        parsed = osis_parse(r["osis"])
        if not parsed:
            continue
        book, ch, verses = parsed
        hits = [cid for cid, text in chunks_of_section[r["section_id"]] if r["label"] and r["label"] in text]
        for cid in hits[:1]:
            for v in verses:
                if (cid, book, ch, v) in direct_keys:
                    continue
                qs = by_chunk.get(cid, [])
                if not qs:  # nothing extracted from that passage: keep the citation without a topic
                    rows.append((args.run, book, ch, v, label(book, ch, v), "context", authors[r["work_id"]],
                                 r["work_id"], None, None, None, None))
                for topic in {t for _, _, t, _, _, _ in qs}:
                    raw_id, canon, _, theme, author, work = next(x for x in qs if x[2] == topic)
                    rows.append((args.run, book, ch, v, label(book, ch, v), "context", author, work, raw_id, canon,
                                 topic, theme))
                direct_keys.add((cid, book, ch, v))
    qdb.executemany("INSERT INTO verse_uses (run_id, book, chapter, verse, ref, link, author, work_id,"
                    " raw_question_id, canonical_id, topic_id, theme_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", rows)
    qdb.commit()
    print(f"{n_direct} direct uses, {len(rows) - n_direct} context links, {len(unparsed)} unparsed references")

    # ---- verse -> themes -> topics
    canon_q = {r[0]: r[1] for r in qdb.execute("SELECT id, question FROM canonical_questions WHERE run_id = ?",
                                               (args.run,))}
    verses = defaultdict(lambda: defaultdict(lambda: {"direct": 0, "context": 0, "authors": set(), "questions": set()}))
    for (_, book, ch, v, ref, link, author, work, raw_id, canon, topic, theme) in rows:
        e = verses[(book, ch, v)][topic]
        e[link] += 1
        e["authors"].add(author)
        if link == "direct" and canon:
            e["questions"].add(canon)
    verse_json, md = [], [f"# Bible verses and what the authors used them for (run {args.run})", "",
                          "**direct** = the verse supports an extracted question; **context** = cited in the same "
                          "passage as the topic's questions.", ""]
    cur_book = None
    for key in sorted(verses, key=lambda k: sort_key(*k)):
        book, ch, v = key
        topics_here = verses[key]
        all_authors = sorted(set().union(*(e["authors"] for e in topics_here.values())))
        by_theme = defaultdict(list)
        for tid, e in sorted(topics_here.items(), key=lambda kv: -(kv[1]["direct"] * 3 + kv[1]["context"])):
            th = themes[theme_of_topic[tid]]["title"] if tid in theme_of_topic else "(no topic)"
            by_theme[th].append(dict(topic_id=tid, topic=topics[tid]["title"] if tid in topics else "(cited only)",
                                     direct=e["direct"], context=e["context"], authors=sorted(e["authors"]),
                                     questions=[canon_q[c] for c in sorted(e["questions"])][:5]))
        n_direct_v = sum(e["direct"] for e in topics_here.values())
        verse_json.append(dict(ref=label(book, ch, v), book=BOOK_NAME[book], osis_book=book, chapter=ch, verse=v,
                               direct_uses=n_direct_v, authors=all_authors,
                               themes=[dict(theme=t, topics=ts) for t, ts in by_theme.items()]))
        if book != cur_book:
            md += ["", f"## {BOOK_NAME[book]}", ""]
            cur_book = book
        md.append(f"**{label(book, ch, v)}** - {n_direct_v} direct use(s); {', '.join(all_authors)}")
        for t, ts in by_theme.items():
            parts = [f"{x['topic']} ({x['direct']}{'+' + str(x['context']) + ' ctx' if x['context'] else ''}; "
                     f"{', '.join(a.split(' of ')[0] for a in x['authors'])})" for x in ts]
            md.append(f"- *{t}:* " + "; ".join(parts))
        md.append("")
    out = ROOT / "qa"
    (out / f"verse_map_run{args.run}.json").write_text(json.dumps(verse_json, indent=1, ensure_ascii=False),
                                                       encoding="utf-8")
    (out / f"verse_map_run{args.run}.md").write_text("\n".join(md), encoding="utf-8")

    # ---- theme -> topic -> verses (reverse map)
    per_topic = defaultdict(lambda: defaultdict(lambda: {"direct": 0, "context": 0, "authors": set()}))
    for (_, book, ch, v, ref, link, author, work, raw_id, canon, topic, theme) in rows:
        if topic is None:
            continue
        e = per_topic[topic][(book, ch, v)]
        e[link] += 1
        e["authors"].add(author)
    rev_json, rmd = [], [f"# Topics and the Bible verses used for them (run {args.run})", ""]
    for th in sorted(themes.values(), key=lambda t: t["seq"]):
        tids = [r[0] for r in qdb.execute("SELECT topic_id FROM theme_topics WHERE theme_id = ? ORDER BY seq",
                                          (th["id"],))]
        theme_verses = defaultdict(int)
        tlist = []
        for tid in tids:
            vs = per_topic.get(tid, {})
            ranked = sorted(vs.items(), key=lambda kv: (-(kv[1]["direct"] * 3 + kv[1]["context"]),
                                                        sort_key(*kv[0])))
            for k, e in ranked:
                theme_verses[k] += e["direct"]
            tlist.append(dict(topic_id=tid, topic=topics[tid]["title"], verses=[
                dict(ref=label(*k), direct=e["direct"], context=e["context"], authors=sorted(e["authors"]))
                for k, e in ranked]))
        top = sorted(theme_verses.items(), key=lambda kv: -kv[1])[:15]
        rev_json.append(dict(theme=th["title"], key=th["key"],
                             top_verses=[dict(ref=label(*k), direct=n) for k, n in top if n], topics=tlist))
        rmd += [f"## {th['title']}", "", "Most used: " + ", ".join(f"{label(*k)} ({n})" for k, n in top if n), ""]
        for t in tlist:
            if not t["verses"]:
                continue
            shown = t["verses"][:25]
            more = f" ... and {len(t['verses']) - 25} more" if len(t["verses"]) > 25 else ""
            rmd.append(f"- **{t['topic']}**: " + ", ".join(
                f"{x['ref']} ({x['direct']}{'+' + str(x['context']) if x['context'] else ''})" for x in shown) + more)
        rmd.append("")
    (out / f"topic_verses_run{args.run}.json").write_text(json.dumps(rev_json, indent=1, ensure_ascii=False),
                                                          encoding="utf-8")
    (out / f"topic_verses_run{args.run}.md").write_text("\n".join(rmd), encoding="utf-8")
    n_verses = len(verses)
    n_direct_verses = sum(1 for k in verses if any(e["direct"] for e in verses[k].values()))
    print(f"{n_verses} distinct verses/chapters ({n_direct_verses} with a direct use) across "
          f"{len({k[0] for k in verses})} books")
    if unparsed:
        print("unparsed examples:", unparsed[:10])
    print(f"wrote {out / f'verse_map_run{args.run}.md'} and {out / f'topic_verses_run{args.run}.md'}")


if __name__ == "__main__":
    main()
