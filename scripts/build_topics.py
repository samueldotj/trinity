"""Stage 3: organise canonical questions into browsable topics.

    python scripts/build_topics.py --run 2

1. Embed canonical questions and group related ones loosely (cosine >= 0.70).
2. For each group, Claude sorts the questions into topics (a broad question such as "One God or three?")
   and orders them from foundational to detailed.
3. One final call merges topics from different groups that are really the same.
4. Writes topics / topic_members in corpus/questions.db and exports the full knowledge base as
   corpus/qa/kb_run<N>.json (topics -> questions -> source answers) and a readable kb_run<N>.md.
"""
import argparse
import json
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import anthropic
import numpy as np
from fastembed import TextEmbedding

sys.path.insert(0, str(Path(__file__).parent))
from dedupe_questions import components  # noqa: E402
from qa_common import MODEL, ROOT, cost, qa_db  # noqa: E402

GROUP_THRESHOLD = 0.70
PACK = 40  # lone questions sent together per topic-naming call
MERGE_LIMIT = 150  # most topic headings sent in one merge call
TOPIC_CLUSTER_THRESHOLD = 0.65  # similarity for clustering headings before merging

TOPIC_SYSTEM = """You organise a question-and-answer knowledge base about the doctrine of the Trinity, built \
from classical Christian sources, into topics that a reader can browse and that can later be drawn as \
flowcharts. You receive a group of related questions, each with an id.

Sort the questions into topics. A topic is the broad question a reader would come with, phrased as a question \
("Are the Father, Son and Holy Spirit one God or three?", "Is the Son eternal?", "What does John 10:30 \
prove?"). Put a question in the topic it most directly answers. A topic may hold a single question; do not \
force unrelated questions together. Every id must appear in exactly one topic.

For each topic give a title (the broad question), a one or two sentence description of what the topic covers, \
and the ids ordered for reading: the central question first, then the reasoning and proofs, then objections \
and replies, then finer points."""

TOPIC_SCHEMA = {
    "type": "object",
    "properties": {"topics": {"type": "array", "items": {
        "type": "object",
        "properties": {"title": {"type": "string"}, "description": {"type": "string"},
                       "ids": {"type": "array", "items": {"type": "integer"}}},
        "required": ["title", "description", "ids"], "additionalProperties": False}}},
    "required": ["topics"], "additionalProperties": False,
}

MERGE_SYSTEM = """You consolidate topic headings in a knowledge base about the doctrine of the Trinity. The \
topics were made separately for different groups of questions, so some are duplicates or near-duplicates. \
Merge topics that a reader would expect to find under one heading; keep distinct topics separate. Every \
topic id must appear in exactly one merged topic. For each merged topic give the best title (a broad \
question), a one or two sentence description, and the topic ids in reading order."""

MERGE_SCHEMA = {
    "type": "object",
    "properties": {"merged": {"type": "array", "items": {
        "type": "object",
        "properties": {"title": {"type": "string"}, "description": {"type": "string"},
                       "topic_ids": {"type": "array", "items": {"type": "integer"}}},
        "required": ["title", "description", "topic_ids"], "additionalProperties": False}}},
    "required": ["merged"], "additionalProperties": False,
}


COMPARE_SYSTEM = """You write the comparison note for one topic in a knowledge base about the doctrine of the \
Trinity, built from classical Christian sources. You receive the topic and, for each question under it, the \
answers given by different authors.

In 2-5 sentences, say how the authors' answers on this topic agree and where they differ: in their \
conclusions, in the grounds or arguments they rely on (Scripture, analogy, philosophical reasoning, the \
Fathers), and in emphasis. Name the authors. If they differ, say so plainly; do not smooth over real \
differences. Describe only what the answers given say, without adding your own view or later theology."""

COMPARE_SCHEMA = {
    "type": "object",
    "properties": {"comparison": {"type": "string"}},
    "required": ["comparison"], "additionalProperties": False,
}


COMPARE_BUDGET = 40_000  # max characters of questions/answers per comparison call (~10k tokens)


def compare_prompt(qdb, topic_id, title):
    """Prompt for a topic's comparison note. Big topics are trimmed to COMPARE_BUDGET characters, keeping
    first the questions answered by the most authors and making sure every author appears."""
    blocks = []  # (seq, authors, text)
    for seq, cq in enumerate(qdb.execute("SELECT c.id, c.question FROM topic_members m JOIN canonical_questions c"
                                         " ON c.id = m.canonical_id WHERE m.topic_id = ? ORDER BY m.seq",
                                         (topic_id,)).fetchall()):
        rows = qdb.execute("SELECT q.author, q.answer FROM canonical_members m JOIN raw_questions q ON q.id ="
                           " m.raw_question_id WHERE m.canonical_id = ?", (cq["id"],)).fetchall()
        text = "\n".join([f"Q: {cq['question']}"] + [f"  - {r['author']}: {r['answer'][:400]}" for r in rows])
        blocks.append((seq, {r["author"] for r in rows}, text))
    chosen, seen_authors, size = set(), set(), 0
    # pass 1: one block per author not yet represented; pass 2: most-authors-first until the budget is used
    for pass_no in (1, 2):
        for seq, authors, text in sorted(blocks, key=lambda b: -len(b[1])):
            if seq in chosen or size + len(text) > COMPARE_BUDGET:
                continue
            if pass_no == 1 and authors <= seen_authors:
                continue
            chosen.add(seq)
            seen_authors |= authors
            size += len(text)
    kept = [text for seq, _, text in blocks if seq in chosen]
    note = f"(showing {len(kept)} of {len(blocks)} questions)\n" if len(kept) < len(blocks) else ""
    return "\n".join([f"Topic: {title}", note] + kept)


def call_json(client, system, user, schema, max_tokens=32000):
    """Structured-output call; streams so large outputs do not hit request timeouts."""
    with client.beta.messages.stream(
        betas=["server-side-fallback-2026-07-01"], fallbacks="default",
        model=MODEL, max_tokens=max_tokens,
        system=[{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": user}],
        output_config={"effort": "medium", "format": {"type": "json_schema", "schema": schema}},
    ) as stream:
        msg = stream.get_final_message()
    if msg.stop_reason != "end_turn":
        return None, cost(msg.usage)
    return json.loads(next(b.text for b in msg.content if b.type == "text")), cost(msg.usage)


def partition(items, key, want):
    """Keep each id once, in the order given; return (clean items, ids that were never placed)."""
    seen, clean = set(), []
    for it in items:
        ids = [i for i in it[key] if i in want and i not in seen]
        seen.update(ids)
        if ids:
            clean.append({**it, key: ids})
    return clean, [i for i in want if i not in seen]


def topics_for_group(client, qs):
    listing = "\n".join(f"[{q['id']}] {q['question']}" for q in qs)
    data, c = call_json(client, TOPIC_SYSTEM, listing, TOPIC_SCHEMA)
    want = [q["id"] for q in qs]
    if data is None:
        return [{"title": q["question"], "description": "", "ids": [q["id"]]} for q in qs], c
    topics, missing = partition(data["topics"], "ids", want)
    by_id = {q["id"]: q for q in qs}
    topics += [{"title": by_id[i]["question"], "description": "", "ids": [i]} for i in missing]
    return topics, c


def merge_once(client, items):
    """One merge call over items [{title, description, topic_ids}]; returns merged items, cost."""
    listing = "\n".join(f"[{k}] {it['title']} - {it['description']}" for k, it in enumerate(items))
    data, c = call_json(client, MERGE_SYSTEM, listing, MERGE_SCHEMA, max_tokens=64000)
    want = list(range(len(items)))
    sets, missing = partition(data["merged"], "topic_ids", want) if data else ([], want)
    out = [{"title": s["title"], "description": s["description"],
            "topic_ids": [leaf for k in s["topic_ids"] for leaf in items[k]["topic_ids"]]} for s in sets]
    return out + [items[k] for k in missing], c


def merge_topics(client, model, topics, workers):
    """Merge duplicate topic headings. Small lists go in one call; large lists are first merged within
    clusters of similar headings (at most MERGE_LIMIT per call), repeating until one final call fits."""
    items = [{"title": t["title"], "description": t["description"], "topic_ids": [t["tid"]]} for t in topics]
    total = 0.0
    for round_no in range(1, 5):
        if len(items) <= MERGE_LIMIT:
            merged, c = merge_once(client, items)
            return merged, total + c
        emb = np.array(list(model.embed([f"{it['title']} {it['description']}" for it in items])))
        emb /= np.linalg.norm(emb, axis=1, keepdims=True)
        clusters = components(emb @ emb.T, list(range(len(items))), TOPIC_CLUSTER_THRESHOLD, max_size=MERGE_LIMIT)
        multi = [cl for cl in clusters if len(cl) > 1]
        kept = [items[cl[0]] for cl in clusters if len(cl) == 1]
        with ThreadPoolExecutor(max_workers=workers) as pool:
            results = list(pool.map(lambda cl: merge_once(client, [items[k] for k in cl]), multi))
        new_items = kept + [m for ms, _ in results for m in ms]
        total += sum(c for _, c in results)
        print(f"  merge round {round_no}: {len(items)} -> {len(new_items)} topics")
        if len(new_items) >= len(items) * 0.97:  # no real progress: stop rather than loop
            return new_items, total
        items = new_items
    return items, total


def topic_entry(qdb, t):
    """One topic row -> dict with its questions and every source answer (the knowledge-base format)."""
    questions = []
    for cq in qdb.execute("SELECT c.* FROM topic_members m JOIN canonical_questions c ON c.id = m.canonical_id"
                          " WHERE m.topic_id = ? ORDER BY m.seq", (t["id"],)).fetchall():
        sources = [dict(author=r["author"], work=r["work_title"], work_id=r["work_id"], section=r["section_path"],
                        answer=r["answer"], quote=r["quote"], quote_match=r["quote_match"],
                        raised_by=r["raised_by"], raised_by_detail=r["raised_by_detail"] or "",
                        importance=r["importance"], scripture=json.loads(r["scripture"]))
                   for r in qdb.execute("SELECT q.* FROM canonical_members m JOIN raw_questions q"
                                        " ON q.id = m.raw_question_id WHERE m.canonical_id = ? ORDER BY q.id",
                                        (cq["id"],))]
        questions.append(dict(id=cq["id"], question=cq["question"], category=cq["category"],
                              synthesis=cq["synthesis"], sources=sources))
    return dict(id=t["id"], title=t["title"], description=t["description"],
                comparison=t["comparison"] or "", questions=questions)


def topic_markdown(t, level=2):
    h = "#" * level
    lines = [f"{h} {t['title']}", "", f"*{t['description']}*", ""]
    if t["comparison"]:
        lines += [f"**How the authors compare:** {t['comparison']}", ""]
    for q in t["questions"]:
        lines += [f"{h}# {q['question']}", "", f"*{q['category']}*", ""]
        if q["synthesis"]:
            lines += [f"**Across sources:** {q['synthesis']}", ""]
        for s in q["sources"]:
            who = s["raised_by"] + (f" ({s['raised_by_detail']})" if s["raised_by_detail"] else "")
            refs = f" Scripture: {', '.join(s['scripture'])}." if s["scripture"] else ""
            lines += [f"- **{s['author']}, *{s['work']}*** ({s['section']}; raised by {who}): "
                      f"{s['answer']}{refs}",
                      f"  > \"{s['quote']}\" *[quote {s['quote_match']}]*"]
        lines.append("")
    return lines


def export(qdb, run_id):
    out_dir = ROOT / "qa"
    out_dir.mkdir(exist_ok=True)
    kb = [topic_entry(qdb, t) for t in qdb.execute(
        "SELECT * FROM topics WHERE run_id = ? ORDER BY n_works DESC, n_questions DESC", (run_id,)).fetchall()]
    (out_dir / f"kb_run{run_id}.json").write_text(json.dumps(kb, indent=2, ensure_ascii=False), encoding="utf-8")
    n_q = sum(len(t["questions"]) for t in kb)
    lines = [f"# Trinity knowledge base (extraction run {run_id})", "",
             f"{len(kb)} topics, {n_q} questions.", "", "## Contents", ""]
    lines += [f"- {t['title']} ({len(t['questions'])})" for t in kb] + [""]
    for t in kb:
        lines += topic_markdown(t)
    path = out_dir / f"kb_run{run_id}.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    return path, len(kb), n_q


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", type=int, required=True)
    ap.add_argument("--workers", type=int, default=6)
    args = ap.parse_args()

    qdb = qa_db()
    qs = [dict(r) for r in qdb.execute("SELECT * FROM canonical_questions WHERE run_id = ? ORDER BY id", (args.run,))]
    if not qs:
        sys.exit(f"no canonical questions for run {args.run}; run dedupe_questions.py first")
    model = TextEmbedding("BAAI/bge-small-en-v1.5", cache_dir=str(ROOT.parent / ".cache" / "fastembed"))
    emb = np.array(list(model.embed([q["question"] for q in qs])))
    emb /= np.linalg.norm(emb, axis=1, keepdims=True)
    groups = components(emb @ emb.T, list(range(len(qs))), GROUP_THRESHOLD)
    # lone questions are packed together so each gets a topic without one API call apiece
    singles = [g[0] for g in groups if len(g) == 1]
    groups = [g for g in groups if len(g) > 1] + [singles[i:i + PACK] for i in range(0, len(singles), PACK)]
    print(f"{len(qs)} questions in {len(groups)} groups; naming topics...")

    client = anthropic.Anthropic()
    total, topics = 0.0, []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for ts, c in pool.map(lambda g: topics_for_group(client, [qs[i] for i in g]), groups):
            topics += ts
            total += c
    for i, t in enumerate(topics):
        t["tid"] = i

    merged, c = merge_topics(client, model, topics, args.workers)
    total += c
    print(f"{len(topics)} topics -> {len(merged)} after merging")

    works_of = {}
    for r in qdb.execute("SELECT m.canonical_id, q.work_id FROM canonical_members m JOIN raw_questions q"
                         " ON q.id = m.raw_question_id"):
        works_of.setdefault(r["canonical_id"], set()).add(r["work_id"])
    qdb.execute("DELETE FROM topic_members WHERE topic_id IN (SELECT id FROM topics WHERE run_id = ?)", (args.run,))
    qdb.execute("DELETE FROM topics WHERE run_id = ?", (args.run,))
    for m in merged:
        ids = [cid for tid in m["topic_ids"] for cid in topics[tid]["ids"]]
        n_works = len(set().union(*(works_of.get(cid, set()) for cid in ids)))
        tid = qdb.execute("INSERT INTO topics (run_id, title, description, n_questions, n_works) VALUES (?,?,?,?,?)",
                          (args.run, m["title"], m["description"], len(ids), n_works)).lastrowid
        qdb.executemany("INSERT INTO topic_members VALUES (?,?,?)", [(tid, cid, k) for k, cid in enumerate(ids)])
    qdb.commit()

    # cross-author comparison for every topic that draws on two or more works
    multi = [(r["id"], compare_prompt(qdb, r["id"], r["title"]))
             for r in qdb.execute("SELECT id, title FROM topics WHERE run_id = ? AND n_works >= 2", (args.run,))]
    print(f"writing comparisons for {len(multi)} multi-author topics...")
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        results = list(pool.map(lambda p: call_json(client, COMPARE_SYSTEM, p[1], COMPARE_SCHEMA), multi))
    for (tid, _), (data, c) in zip(multi, results):
        total += c
        qdb.execute("UPDATE topics SET comparison = ? WHERE id = ?", (data["comparison"] if data else "", tid))
    qdb.commit()
    path, n_topics, n_q = export(qdb, args.run)
    print(f"{n_topics} topics, {n_q} questions; topic cost ${total:.2f}")
    print(f"review: {path}")


if __name__ == "__main__":
    main()
