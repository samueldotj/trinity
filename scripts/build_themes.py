"""Stage 4: group topics under top-level themes and fold duplicate or tiny topics together.

    python scripts/build_themes.py --run 4               # full theme stage
    python scripts/build_themes.py --run 4 --max-cost 10 # skip comparison refresh if it would cost more

1. Claude proposes 20-30 themes from the full list of topic headings.
2. Every topic is assigned to one theme (150 headings per call).
3. Within each theme, Claude merges duplicate topics, folds one- or two-question topics into the best
   larger topic where they clearly belong, and orders the topics for reading.
4. Comparison notes are rewritten only for merged topics that gained new authors (cost-capped).
5. Rewrites topics/topic_members for the run, writes themes/theme_topics, and exports
   corpus/qa/kb_run<N>.json as themes -> topics -> questions -> source answers (and a .md).
Back up corpus/questions.db first; this stage edits the run's topics in place.
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
from build_topics import (COMPARE_SCHEMA, COMPARE_SYSTEM, call_json, compare_prompt, partition,  # noqa: E402
                          topic_entry, topic_markdown)
from dedupe_questions import components  # noqa: E402
from qa_common import PRICES, ROOT, qa_db  # noqa: E402

SLICE = 150  # topic headings per call

TAXONOMY_SYSTEM = """You design the top-level navigation for a question-and-answer knowledge base on the \
doctrine of the Trinity, built from classical Christian sources (Irenaeus, Athanasius, the Cappadocians, \
Hilary, Ambrose, Augustine, Owen, Waterland, Edwards, Bickersteth, Warfield and others). You receive every \
topic heading with its number of questions.

Propose 20 to 30 themes that together cover every topic, ordered the way a learner would read them: \
foundations and method first, then the unity of God, the Father, the Son, the Holy Spirit, the relations and \
processions, the Incarnation, worship and salvation, and particular Scripture texts. Include one final theme \
for related questions that are not about the Trinity itself (for example anthropology, ethics, creation, \
or other heresies). Themes should be distinct and of useful size; do not make a theme for a handful of topics \
unless it is clearly separate. For each give a short key (lowercase, hyphens), a title, and a one-sentence \
description."""

TAXONOMY_SCHEMA = {
    "type": "object",
    "properties": {"themes": {"type": "array", "items": {
        "type": "object",
        "properties": {"key": {"type": "string"}, "title": {"type": "string"}, "description": {"type": "string"}},
        "required": ["key", "title", "description"], "additionalProperties": False}}},
    "required": ["themes"], "additionalProperties": False,
}

ASSIGN_SYSTEM = """You file topic headings from a knowledge base on the doctrine of the Trinity under themes. \
You receive the list of themes and a list of topics. Put each topic under the single theme it most directly \
belongs to. Use the final "related questions" theme only for topics that are not about the Trinity, God, \
Christ or the Spirit. Every topic id must be assigned exactly once."""

ASSIGN_SCHEMA = {
    "type": "object",
    "properties": {"assignments": {"type": "array", "items": {
        "type": "object",
        "properties": {"topic_id": {"type": "integer"}, "theme_key": {"type": "string"}},
        "required": ["topic_id", "theme_key"], "additionalProperties": False}}},
    "required": ["assignments"], "additionalProperties": False,
}

CONSOLIDATE_SYSTEM = """You tidy one theme of a knowledge base on the doctrine of the Trinity. You receive the \
theme and its topics, each with an id, heading, description and number of questions.

Group the topics into final topics:
- Merge topics that are duplicates or near-duplicates (for example several topics all asking whether the Holy \
Spirit is God).
- Fold a topic with only one or two questions into a larger topic when it clearly belongs there; otherwise \
keep it on its own.
- Keep genuinely different topics apart.
Every topic id must appear in exactly one group. For each group give the heading (a broad question), a one or \
two sentence description, and the topic ids. List the groups in the order a reader should take them: the \
central questions of the theme first, then proofs and Scripture, then objections, then finer points."""

CONSOLIDATE_SCHEMA = {
    "type": "object",
    "properties": {"groups": {"type": "array", "items": {
        "type": "object",
        "properties": {"title": {"type": "string"}, "description": {"type": "string"},
                       "topic_ids": {"type": "array", "items": {"type": "integer"}}},
        "required": ["title", "description", "topic_ids"], "additionalProperties": False}}},
    "required": ["groups"], "additionalProperties": False,
}


def listing(topics):
    return "\n".join(f"[{t['id']}] {t['title']} ({t['n_questions']} questions) - {t['description']}"
                     for t in topics)


def consolidate(client, theme, topics):
    user = f"Theme: {theme['title']} - {theme['description']}\n\nTopics:\n{listing(topics)}"
    data, c = call_json(client, CONSOLIDATE_SYSTEM, user, CONSOLIDATE_SCHEMA)
    want = [t["id"] for t in topics]
    groups, missing = partition(data["groups"], "topic_ids", want) if data else ([], want)
    by_id = {t["id"]: t for t in topics}
    groups += [{"title": by_id[i]["title"], "description": by_id[i]["description"], "topic_ids": [i]}
               for i in missing]
    return groups, c


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", type=int, required=True)
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--max-cost", type=float, default=10.0, help="cap for refreshing comparison notes (USD)")
    ap.add_argument("--refresh-only", action="store_true",
                    help="only rewrite stale comparison notes and re-export (keeps themes and topics)")
    ap.add_argument("--before", help="with --refresh-only: database copy from before build_themes, used to "
                                     "find stale notes when none are flagged")
    args = ap.parse_args()

    qdb = qa_db()
    if args.refresh_only:
        stale = [r[0] for r in qdb.execute("SELECT id FROM topics WHERE run_id = ? AND comparison_stale = 1",
                                           (args.run,))]
        if not stale and args.before:
            stale = stale_from_backup(qdb, args.run, args.before)
            qdb.executemany("UPDATE topics SET comparison_stale = 1 WHERE id = ?", [(t,) for t in stale])
            qdb.commit()
        refresh_comparisons(anthropic.Anthropic(), qdb, stale, args.max_cost, args.workers)
        export_themes(qdb, args.run)
        return
    topics = [dict(r) for r in qdb.execute("SELECT * FROM topics WHERE run_id = ? ORDER BY n_questions DESC",
                                           (args.run,))]
    if not topics:
        sys.exit(f"no topics for run {args.run}; run build_topics.py first")
    client = anthropic.Anthropic()
    total = 0.0

    # 1. taxonomy
    data, c = call_json(client, TAXONOMY_SYSTEM, listing(topics), TAXONOMY_SCHEMA)
    total += c
    themes = data["themes"]
    keys = [t["key"] for t in themes]
    print(f"{len(themes)} themes proposed (${c:.2f}):")
    for t in themes:
        print(f"  - {t['title']}")

    # 2. assign topics to themes
    theme_list = "\n".join(f"{t['key']}: {t['title']} - {t['description']}" for t in themes)
    slices = [topics[i:i + SLICE] for i in range(0, len(topics), SLICE)]

    def assign(sl):
        return call_json(client, ASSIGN_SYSTEM, f"Themes:\n{theme_list}\n\nTopics:\n{listing(sl)}", ASSIGN_SCHEMA)

    theme_of = {}
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for d, c in pool.map(assign, slices):
            total += c
            for a in (d or {}).get("assignments", []):
                if a["theme_key"] in keys:
                    theme_of.setdefault(a["topic_id"], a["theme_key"])
    fallback = keys[-1]
    unassigned = [t["id"] for t in topics if t["id"] not in theme_of]
    for tid in unassigned:
        theme_of[tid] = fallback
    print(f"assigned {len(topics)} topics ({len(unassigned)} unassigned -> '{fallback}')")

    # 3. consolidate within each theme (big themes split into clusters of similar headings)
    model = TextEmbedding("BAAI/bge-small-en-v1.5", cache_dir=str(ROOT.parent / ".cache" / "fastembed"))
    jobs = []  # (theme, topics)
    for th in themes:
        members = [t for t in topics if theme_of[t["id"]] == th["key"]]
        if len(members) <= SLICE:
            if members:
                jobs.append((th, members))
            continue
        emb = np.array(list(model.embed([f"{t['title']} {t['description']}" for t in members])))
        emb /= np.linalg.norm(emb, axis=1, keepdims=True)
        clusters = components(emb @ emb.T, list(range(len(members))), 0.6, max_size=SLICE)
        # pack small clusters together so each call has a useful amount of context
        packed, cur = [], []
        for cl in sorted(clusters, key=len, reverse=True):
            if cur and len(cur) + len(cl) > SLICE:
                packed.append(cur)
                cur = []
            cur += cl
        packed.append(cur)
        jobs += [(th, [members[i] for i in p]) for p in packed if p]
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        results = list(pool.map(lambda j: consolidate(client, j[0], j[1]), jobs))
    by_id = {t["id"]: t for t in topics}
    final = {th["key"]: [] for th in themes}  # theme key -> list of groups in reading order
    for (th, _), (groups, c) in zip(jobs, results):
        total += c
        final[th["key"]] += groups
    n_final = sum(len(g) for g in final.values())
    print(f"consolidated {len(topics)} topics -> {n_final}; cost so far ${total:.2f}")

    # 4. apply: keeper = largest member topic; absorb the others' questions
    works_of = {}
    for r in qdb.execute("SELECT m.canonical_id, q.work_id FROM canonical_members m JOIN raw_questions q"
                         " ON q.id = m.raw_question_id"):
        works_of.setdefault(r["canonical_id"], set()).add(r["work_id"])
    members_of = {}
    for r in qdb.execute("SELECT topic_id, canonical_id FROM topic_members WHERE topic_id IN"
                         " (SELECT id FROM topics WHERE run_id = ?) ORDER BY topic_id, seq", (args.run,)):
        members_of.setdefault(r["topic_id"], []).append(r["canonical_id"])
    refresh = []
    qdb.execute("DELETE FROM theme_topics WHERE theme_id IN (SELECT id FROM themes WHERE run_id = ?)", (args.run,))
    qdb.execute("DELETE FROM themes WHERE run_id = ?", (args.run,))
    for seq, th in enumerate(themes):
        groups = final[th["key"]]
        theme_id = qdb.execute("INSERT INTO themes (run_id, seq, key, title, description) VALUES (?,?,?,?,?)",
                               (args.run, seq, th["key"], th["title"], th["description"])).lastrowid
        n_q = 0
        for tseq, g in enumerate(groups):
            ids = sorted(g["topic_ids"], key=lambda i: -by_id[i]["n_questions"])
            keeper, absorbed = ids[0], ids[1:]
            cids, seen = [], set()
            for tid in ids:
                for cid in members_of.get(tid, []):
                    if cid not in seen:
                        seen.add(cid)
                        cids.append(cid)
            works = set().union(*(works_of.get(cid, set()) for cid in cids)) if cids else set()
            keeper_works = set().union(*(works_of.get(cid, set()) for cid in members_of.get(keeper, [])))
            qdb.execute("DELETE FROM topic_members WHERE topic_id IN (%s)" % ",".join("?" * len(ids)), ids)
            qdb.executemany("INSERT INTO topic_members VALUES (?,?,?)", [(keeper, cid, k) for k, cid in enumerate(cids)])
            if absorbed:
                qdb.execute("DELETE FROM topics WHERE id IN (%s)" % ",".join("?" * len(absorbed)), absorbed)
            qdb.execute("UPDATE topics SET title = ?, description = ?, n_questions = ?, n_works = ? WHERE id = ?",
                        (g["title"], g["description"], len(cids), len(works), keeper))
            if len(works) >= 2 and (works - keeper_works or not by_id[keeper]["comparison"]):
                refresh.append(keeper)
            qdb.execute("INSERT INTO theme_topics VALUES (?,?,?)", (theme_id, keeper, tseq))
            n_q += len(cids)
        qdb.execute("UPDATE themes SET n_topics = ?, n_questions = ? WHERE id = ?", (len(groups), n_q, theme_id))
    qdb.commit()

    # 5. refresh comparison notes where merging added authors (estimate first, cap the spend)
    qdb.executemany("UPDATE topics SET comparison_stale = 1 WHERE id = ?", [(t,) for t in refresh])
    qdb.commit()
    total += refresh_comparisons(client, qdb, refresh, args.max_cost, args.workers)

    # 6. export themes -> topics -> questions -> sources
    export_themes(qdb, args.run)
    print(f"theme stage cost ${total:.2f}")


def refresh_comparisons(client, qdb, topic_ids, max_cost, workers):
    """Rewrite comparison notes for topic_ids if the estimated cost is within max_cost. Returns cost."""
    prompts = [(tid, compare_prompt(qdb, tid, qdb.execute("SELECT title FROM topics WHERE id = ?",
                                                          (tid,)).fetchone()["title"])) for tid in topic_ids]
    est = sum(len(p) / 4 * PRICES["input"] + 3000 * PRICES["output"] for _, p in prompts) / 1e6
    print(f"{len(prompts)} merged topics need a new comparison note (estimated ${est:.2f})")
    if not prompts:
        return 0.0
    if est > max_cost:
        print(f"  skipped: above --max-cost {max_cost}; existing notes kept (rerun with --refresh-only)")
        return 0.0
    with ThreadPoolExecutor(max_workers=workers) as pool:
        res = list(pool.map(lambda p: call_json(client, COMPARE_SYSTEM, p[1], COMPARE_SCHEMA), prompts))
    total, done = 0.0, 0
    for (tid, _), (d, c) in zip(prompts, res):
        total += c
        if d:
            qdb.execute("UPDATE topics SET comparison = ?, comparison_stale = 0 WHERE id = ?", (d["comparison"], tid))
            done += 1
    qdb.commit()
    print(f"  refreshed {done} of {len(prompts)} notes for ${total:.2f}")
    return total


def stale_from_backup(qdb, run_id, backup):
    """Topics whose merge added authors, judged against a copy of the database from before build_themes."""
    import sqlite3
    old = sqlite3.connect(backup)
    old_members = {}
    for tid, cid in old.execute("SELECT m.topic_id, m.canonical_id FROM topic_members m JOIN topics t"
                                " ON t.id = m.topic_id WHERE t.run_id = ?", (run_id,)):
        old_members.setdefault(tid, []).append(cid)
    old_comp = {r[0]: r[1] for r in old.execute("SELECT id, comparison FROM topics WHERE run_id = ?", (run_id,))}
    works_of = {}
    for r in qdb.execute("SELECT m.canonical_id, q.work_id FROM canonical_members m JOIN raw_questions q"
                         " ON q.id = m.raw_question_id"):
        works_of.setdefault(r["canonical_id"], set()).add(r["work_id"])
    stale = []
    for t in qdb.execute("SELECT id, n_works FROM topics WHERE run_id = ? AND n_works >= 2", (run_id,)).fetchall():
        now = set().union(*(works_of.get(c, set()) for c in [r[0] for r in qdb.execute(
            "SELECT canonical_id FROM topic_members WHERE topic_id = ?", (t["id"],))]))
        before = set().union(*(works_of.get(c, set()) for c in old_members.get(t["id"], []))) \
            if old_members.get(t["id"]) else set()
        if now - before or not old_comp.get(t["id"]):
            stale.append(t["id"])
    return stale


def export_themes(qdb, run_id):
    out_dir = ROOT / "qa"
    out_dir.mkdir(exist_ok=True)
    kb, lines = [], [f"# Trinity knowledge base (extraction run {run_id})", ""]
    toc = ["## Contents", ""]
    body = []
    for th in qdb.execute("SELECT * FROM themes WHERE run_id = ? ORDER BY seq", (run_id,)).fetchall():
        trows = qdb.execute("SELECT t.* FROM theme_topics x JOIN topics t ON t.id = x.topic_id WHERE x.theme_id = ?"
                            " ORDER BY x.seq", (th["id"],)).fetchall()
        entries = [topic_entry(qdb, t) for t in trows]
        kb.append(dict(id=th["id"], key=th["key"], title=th["title"], description=th["description"],
                       topics=entries))
        toc.append(f"- **{th['title']}** ({len(entries)} topics, {th['n_questions']} questions)")
        body += [f"## {th['title']}", "", f"*{th['description']}*", ""]
        for e in entries:
            body += topic_markdown(e, level=3)
    n_topics = sum(len(t["topics"]) for t in kb)
    n_qs = sum(len(e["questions"]) for t in kb for e in t["topics"])
    lines += [f"{len(kb)} themes, {n_topics} topics, {n_qs} questions.", ""] + toc + [""] + body
    (out_dir / f"kb_run{run_id}.json").write_text(json.dumps(kb, indent=2, ensure_ascii=False), encoding="utf-8")
    path = out_dir / f"kb_run{run_id}.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"{len(kb)} themes, {n_topics} topics, {n_qs} questions")
    print(f"review: {path}")


if __name__ == "__main__":
    main()
