"""Stage 2: deduplicate extracted questions into canonical questions with per-source answers.

    python scripts/dedupe_questions.py --run 1             # dedupe one extraction run
    python scripts/dedupe_questions.py --run 1 --threshold 0.84

1. Embed every verified question locally (fastembed, BAAI/bge-small-en-v1.5; no API cost).
2. Group questions whose cosine similarity >= threshold (connected components; oversized
   groups are re-split at a stricter threshold).
3. For each group of 2+, Claude decides which really ask the same thing, writes one canonical
   wording, and notes where the sources agree or differ.
4. Writes canonical_questions / canonical_members in corpus/questions.db and exports
   corpus/qa/questions_run<N>.json plus a readable corpus/qa/questions_run<N>.md.
"""
import argparse
import json
import sys
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import anthropic
import numpy as np
from fastembed import TextEmbedding

sys.path.insert(0, str(Path(__file__).parent))
from qa_common import MODEL, ROOT, cost, qa_db  # noqa: E402

MAX_GROUP = 30

MERGE_SYSTEM = """You deduplicate questions in a knowledge base about the doctrine of the Trinity, built from \
classical Christian sources. You receive a group of candidate questions that a similarity search found close \
together; each comes with the source's author and a short form of that source's answer.

Partition the questions into sets that ask the same CENTRAL question, meaning one canonical question could \
stand for all of them and each source's answer would still be a direct answer to it. Judge by what is being \
asked, not by how it is framed: questions put through different analogies, examples, objections or \
occasions still belong together when they turn on the same point. For example, "If the Father is God and \
the Son is God, why are they not two Gods?", "Are Father, Son and Holy Spirit three Gods or one God?" and \
"If Peter, James and John are three men, why are the three Persons not three Gods?" all ask whether the \
Persons are one God or three, and belong in one set. Merging questions from different authors matters most: \
it lets readers compare how each author answers the same question.

Keep questions in separate sets when they concern a different Person (the Son versus the Spirit), a \
different Bible text, or a distinct sub-question whose answer would not answer the other (for example "Is \
the Son eternal?" versus "Does 'begotten' imply a beginning?"). Every id must appear in exactly one set; a \
set may have a single id.

For each set give:
- canonical_question: one clear, neutral, self-contained wording (prefer the clearest member's wording).
- category: philosophical, logical, theological or exegetical.
- synthesis: if the set includes more than one author, 1-3 sentences on how their answers agree or differ, \
naming the authors (say so plainly if they differ, and say how their grounds or arguments differ even when \
their conclusions agree). Otherwise an empty string. Describe only what the answers given say."""

MERGE_SCHEMA = {
    "type": "object",
    "properties": {
        "sets": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "ids": {"type": "array", "items": {"type": "integer"}},
                    "canonical_question": {"type": "string"},
                    "category": {"type": "string",
                                 "enum": ["philosophical", "logical", "theological", "exegetical"]},
                    "synthesis": {"type": "string"},
                },
                "required": ["ids", "canonical_question", "category", "synthesis"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["sets"],
    "additionalProperties": False,
}


def components(sim, idx, threshold, max_size=MAX_GROUP):
    """Connected components among idx (indices into sim) at the given threshold; splits big ones."""
    parent = {i: i for i in idx}

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    arr = np.array(idx)
    for pos, a in enumerate(idx[:-1]):
        later = arr[pos + 1:]
        for b in later[sim[a, later] >= threshold]:  # vectorised row scan
            parent[find(a)] = find(int(b))
    groups = defaultdict(list)
    for i in idx:
        groups[find(i)].append(i)
    out = []
    for g in groups.values():
        if len(g) > max_size and threshold < 0.98:
            out += components(sim, g, threshold + 0.02, max_size)
        else:
            out.append(g)
    return out


def merge_group(client, rows):
    listing = "\n".join(
        f"[{r['id']}] {r['question']}\n    source: {r['author']}, {r['work_title']}\n"
        f"    answer: {r['answer'][:400]}" for r in rows)
    msg = client.beta.messages.create(
        betas=["server-side-fallback-2026-07-01"], fallbacks="default",
        model=MODEL, max_tokens=16000,
        system=[{"type": "text", "text": MERGE_SYSTEM, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": listing}],
        output_config={"effort": "medium", "format": {"type": "json_schema", "schema": MERGE_SCHEMA}},
    )
    c = cost(msg.usage)
    if msg.stop_reason != "end_turn":
        return None, c
    sets = json.loads(next(b.text for b in msg.content if b.type == "text"))["sets"]
    # validate the partition: drop unknown/duplicate ids, put missing ids in their own sets
    want, seen, clean = {r["id"] for r in rows}, set(), []
    for s in sets:
        ids = [i for i in s["ids"] if i in want and i not in seen]
        seen.update(ids)
        if ids:
            clean.append({**s, "ids": ids})
    by_id = {r["id"]: r for r in rows}
    for i in want - seen:
        clean.append({"ids": [i], "canonical_question": by_id[i]["question"], "category": by_id[i]["category"],
                      "synthesis": ""})
    return clean, c


def export(qdb, run_id):
    out_dir = ROOT / "qa"
    out_dir.mkdir(exist_ok=True)
    items = []
    for cq in qdb.execute("SELECT * FROM canonical_questions WHERE run_id = ? ORDER BY n_works DESC, n_sources DESC,"
                          " id", (run_id,)):
        sources = [dict(author=r["author"], work=r["work_title"], work_id=r["work_id"], section=r["section_path"],
                        answer=r["answer"], quote=r["quote"], quote_match=r["quote_match"],
                        raised_by=r["raised_by"], raised_by_detail=r["raised_by_detail"] or "",
                        importance=r["importance"],
                        scripture=json.loads(r["scripture"]), raw_question=r["question"])
                   for r in qdb.execute("SELECT q.* FROM canonical_members m JOIN raw_questions q"
                                        " ON q.id = m.raw_question_id WHERE m.canonical_id = ? ORDER BY q.id",
                                        (cq["id"],))]
        items.append(dict(id=cq["id"], question=cq["question"], category=cq["category"],
                          synthesis=cq["synthesis"], sources=sources))
    (out_dir / f"questions_run{run_id}.json").write_text(json.dumps(items, indent=2, ensure_ascii=False),
                                                         encoding="utf-8")
    lines = [f"# Questions and answers (extraction run {run_id})", "",
             f"{len(items)} canonical questions from {sum(len(i['sources']) for i in items)} extracted questions.",
             ""]
    for it in items:
        lines += [f"## {it['id']}. {it['question']}", "", f"*{it['category']}*", ""]
        if it["synthesis"]:
            lines += [f"**Across sources:** {it['synthesis']}", ""]
        for s in it["sources"]:
            refs = f" Scripture: {', '.join(s['scripture'])}." if s["scripture"] else ""
            lines += [f"- **{s['author']}, *{s['work']}*** ({s['section']}): {s['answer']}{refs}",
                      f"  > \"{s['quote']}\" *[quote {s['quote_match']}]*"]
        lines.append("")
    (out_dir / f"questions_run{run_id}.md").write_text("\n".join(lines), encoding="utf-8")
    return out_dir / f"questions_run{run_id}.md"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", type=int, required=True, help="extraction run id")
    ap.add_argument("--threshold", type=float, default=0.78)
    ap.add_argument("--include-unverified", action="store_true", help="keep questions whose quote was not found")
    ap.add_argument("--workers", type=int, default=6)
    args = ap.parse_args()

    qdb = qa_db()
    cond = "" if args.include_unverified else " AND quote_match != 'missing'"
    rows = [dict(r) for r in qdb.execute(f"SELECT * FROM raw_questions WHERE run_id = ?{cond} ORDER BY id",
                                         (args.run,))]
    if not rows:
        sys.exit(f"no questions for run {args.run}")
    print(f"{len(rows)} questions; embedding...")
    model = TextEmbedding("BAAI/bge-small-en-v1.5", cache_dir=str(ROOT.parent / ".cache" / "fastembed"))
    emb = np.array(list(model.embed([r["question"] for r in rows])))
    emb /= np.linalg.norm(emb, axis=1, keepdims=True)
    sim = emb @ emb.T
    groups = components(sim, list(range(len(rows))), args.threshold)
    multi = [g for g in groups if len(g) > 1]
    print(f"{len(groups)} groups ({len(multi)} with 2+ questions, largest {max(map(len, groups))}); merging...")

    client = anthropic.Anthropic()
    results, total_cost = [], 0.0
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for g, (sets, c) in zip(multi, pool.map(lambda g: merge_group(client, [rows[i] for i in g]), multi)):
            total_cost += c
            if sets is None:  # model declined; keep the group's questions separate
                sets = [{"ids": [rows[i]["id"]], "canonical_question": rows[i]["question"],
                         "category": rows[i]["category"], "synthesis": ""} for i in g]
            results += sets
    for g in groups:
        if len(g) == 1:
            r = rows[g[0]]
            results.append({"ids": [r["id"]], "canonical_question": r["question"], "category": r["category"],
                            "synthesis": ""})

    by_id = {r["id"]: r for r in rows}
    qdb.execute("DELETE FROM canonical_members WHERE canonical_id IN"
                " (SELECT id FROM canonical_questions WHERE run_id = ?)", (args.run,))
    qdb.execute("DELETE FROM canonical_questions WHERE run_id = ?", (args.run,))
    for s in results:
        n_works = len({by_id[i]["work_id"] for i in s["ids"]})
        cid = qdb.execute("INSERT INTO canonical_questions (run_id, question, category, synthesis, n_sources,"
                          " n_works) VALUES (?,?,?,?,?,?)",
                          (args.run, s["canonical_question"], s["category"], s["synthesis"], len(s["ids"]),
                           n_works)).lastrowid
        qdb.executemany("INSERT INTO canonical_members VALUES (?,?)", [(cid, i) for i in s["ids"]])
    qdb.commit()
    path = export(qdb, args.run)
    print(f"{len(rows)} questions -> {len(results)} canonical questions; merge cost ${total_cost:.2f}")
    print(f"review: {path}")


if __name__ == "__main__":
    main()
