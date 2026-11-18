"""Stage 1: extract the questions each passage raises and answers, using Claude.

    python scripts/extract_questions.py --sample pilot                  # ~50 chunks, direct API calls
    python scripts/extract_questions.py --sample all --mode batch       # full corpus via Batch API (50% off)
    python scripts/extract_questions.py --collect <run_id>              # fetch results of a batch run
    python scripts/extract_questions.py --works augustine-on-the-trinity --limit 20

Results go to corpus/questions.db (runs, chunk_results, raw_questions).
Each question carries a verbatim quote; the quote is checked against the chunk text and the
match level is stored in raw_questions.quote_match ('exact', 'fuzzy' or 'missing').
"""
import argparse
import json
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request
from rapidfuzz import fuzz

sys.path.insert(0, str(Path(__file__).parent))
from qa_common import MODEL, corpus_db, cost, norm, qa_db  # noqa: E402

# (work_id, number of primary-text chunks to take from the start) for the pilot run
PILOT = [("gregory-nyssa-not-three-gods", 7), ("athanasius-against-arians", 10),
         ("augustine-on-the-trinity", 8), ("waterland-vindication", 8), ("bickersteth-rock-of-ages", 6),
         ("owen-brief-declaration-trinity", 6), ("edwards-essay-on-the-trinity", 8)]

SYSTEM = """You are a careful scholar of historical theology and philosophy building a question-and-answer \
knowledge base about the doctrine of the Trinity from classical sources.

You will receive one passage (a chunk of a longer work) together with its author, work and section, plus \
the end of the preceding chunk and the start of the following chunk as context. Identify every substantive \
philosophical, logical, theological or exegetical question that the passage raises AND answers, whether the \
question is asked outright or is only implicit in the argument (for example an objection the author is \
refuting, or a claim the author is defending).

Use the context only to understand the passage and to finish questions it leaves open: if the passage \
raises a question or objection that is answered in the following context, include it. Do not extract \
questions that are raised and answered entirely within the context; the neighbouring chunks are processed \
separately.

For each question:
- question: write it as a self-contained question a modern reader could ask, understandable without the \
passage. Name the persons and terms explicitly ("Does the Son's being begotten imply he had a beginning?", \
not "Does this imply that?"). Phrase it neutrally, not as the author's conclusion. One idea per question.
- answer: the AUTHOR's own answer in 2-5 sentences. Begin with the direct answer ("Yes.", "No.", or a one-line \
statement), then give the author's main reason or proof. The answer is always the position the author holds, \
never the opponent's: when the passage reports an opponent's claim (for example quoting Arius), the question \
is whether that claim is true and the answer is the author's verdict and reason. If the passage only reports \
the opposing view and the author's reply is in neither the passage nor the context, skip the question. Do \
not add your own view or later theology.
- category: "philosophical" (metaphysics, being, substance, causation, knowledge of God), "logical" \
(consistency, contradiction, number, inference), "theological" (doctrine of God, Christ, Spirit, worship, \
salvation), or "exegetical" (what a specific Bible text means or proves).
- raised_by: who poses the question or objection, from the fixed list: "the author" (the author asks or \
argues it himself), "Arians" (including semi-Arians and Dr. Clarke's school), "Eunomians", \
"Sabellians/modalists" (including Noetus, Praxeas, Patripassians), "Socinians/Unitarians", "Jews or pagans", \
"other heretics", "unnamed objector".
- raised_by_detail: the specific person or party named in the passage (e.g. "Arius", "Dr. Clarke", \
"Eunomius", "Ablabius"), or an empty string.
- explicit: true if the passage states the question or objection outright; false if it is implied.
- importance: "core" if the question bears directly on the Trinity (unity, distinction, equality, \
relations, processions, deity of Son or Spirit); "supporting" if it is a step in such an argument; \
"minor" otherwise.
- quote: copy, character for character, one short span (10-60 words) from the passage (or, for a question \
answered in the following context, from that context) that best supports the answer. Do not paraphrase, \
join separate sentences, or fix spelling; it will be checked by exact match.
- scripture: Bible references the argument relies on, in the form "John 10:30" (convert Roman-numeral \
chapter references such as "John x. 30" to this form). Empty list if none.

Skip, even if the author argues them at length: narrative, biography, church politics and councils, \
what heretics or parties should be called, whether opponents count as Christians, the motives or character \
of opponents, the conduct of controversy, clerical subscription and church discipline, insults, purely \
textual or historical remarks, and questions the passage raises without answering. Keep a question only if \
its answer teaches something about God, the Persons of the Trinity, Christ, the Spirit, or how Scripture or \
reason bears on these. Do not invent questions the passage does not address. A passage may \
yield zero questions; most yield between 1 and 8. If two candidate questions are really the same, keep one."""

RAISED_BY = ["the author", "Arians", "Eunomians", "Sabellians/modalists", "Socinians/Unitarians", "Jews or pagans",
             "other heretics", "unnamed objector"]
CONTEXT_WORDS = (150, 250)  # words of preceding / following chunk sent as context

OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {"type": "string"},
                    "answer": {"type": "string"},
                    "category": {"type": "string", "enum": ["philosophical", "logical", "theological", "exegetical"]},
                    "raised_by": {"type": "string", "enum": RAISED_BY},
                    "raised_by_detail": {"type": "string"},
                    "explicit": {"type": "boolean"},
                    "importance": {"type": "string", "enum": ["core", "supporting", "minor"]},
                    "quote": {"type": "string"},
                    "scripture": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["question", "answer", "category", "raised_by", "raised_by_detail", "explicit",
                             "importance", "quote", "scripture"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["questions"],
    "additionalProperties": False,
}


def select_chunks(args):
    db = corpus_db()
    base = ("SELECT c.id, c.work_id, c.seq AS chunk_seq, c.text, s.path, w.author, w.title, w.date "
            "FROM chunks c JOIN sections s ON s.id = c.section_id JOIN works w ON w.id = c.work_id "
            "WHERE s.role = 'primary' AND c.word_count >= 60 ")
    order = " ORDER BY s.seq, c.seq"
    if args.sample == "pilot":
        rows = []
        for work_id, n in PILOT:
            rows += db.execute(base + "AND c.work_id = ?" + order + " LIMIT ?", (work_id, n)).fetchall()
        return add_context(db, rows)
    if args.works:
        ids = args.works.split(",")
        q = base + f"AND c.work_id IN ({','.join('?' * len(ids))})" + order
        rows = db.execute(q, ids).fetchall()
    else:
        rows = db.execute(base + " ORDER BY c.work_id, s.seq, c.seq").fetchall()
    rows = rows[: args.limit] if args.limit else rows
    return add_context(db, rows)


def add_context(db, rows):
    """Attach the tail of the previous chunk and the head of the next chunk (same work, primary text)."""
    out, neighbours = [], {}
    for work_id in {r["work_id"] for r in rows}:
        order = [r["id"] for r in db.execute(
            "SELECT c.id FROM chunks c JOIN sections s ON s.id = c.section_id WHERE c.work_id = ?"
            " AND s.role = 'primary' ORDER BY s.seq, c.seq", (work_id,))]
        for i, cid in enumerate(order):
            neighbours[cid] = (order[i - 1] if i else None, order[i + 1] if i + 1 < len(order) else None)
    texts = {}
    wanted = {n for r in rows for n in neighbours.get(r["id"], ()) if n}
    for i in range(0, len(wanted), 500):
        part = list(wanted)[i:i + 500]
        texts.update({r[0]: r[1] for r in db.execute(
            f"SELECT id, text FROM chunks WHERE id IN ({','.join('?' * len(part))})", part)})
    for r in rows:
        prev_id, next_id = neighbours.get(r["id"], (None, None))
        d = dict(r)
        d["before"] = " ".join(texts[prev_id].split()[-CONTEXT_WORDS[0]:]) if prev_id else ""
        d["after"] = " ".join(texts[next_id].split()[:CONTEXT_WORDS[1]]) if next_id else ""
        out.append(d)
    return out


def build_params(chunk, effort):
    before = f"<context_before>\n…{chunk['before']}\n</context_before>\n\n" if chunk["before"] else ""
    after = f"\n\n<context_after>\n{chunk['after']}…\n</context_after>" if chunk["after"] else ""
    user = (f"Author: {chunk['author']}\nWork: {chunk['title']} ({chunk['date']})\n"
            f"Section: {chunk['path']}\n\n{before}<passage>\n{chunk['text']}\n</passage>{after}")
    return dict(
        model=MODEL,
        max_tokens=16000,
        system=[{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": user}],
        output_config={"effort": effort, "format": {"type": "json_schema", "schema": OUTPUT_SCHEMA}},
    )


def check_quote(quote, text):
    q, t = norm(quote), norm(text)
    if q and q in t:
        return "exact", 100.0
    score = fuzz.partial_ratio(q, t) if q else 0.0
    return ("fuzzy" if score >= 90 else "missing"), score


def store(qdb, run_id, chunk, message, batch):
    usage = message.usage
    c = cost(usage, batch)
    common = (run_id, chunk["id"], chunk["work_id"], chunk["path"], chunk["chunk_seq"])
    if message.stop_reason != "end_turn":
        qdb.execute("INSERT OR REPLACE INTO chunk_results VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    common + ("failed", 0, usage.input_tokens, usage.output_tokens,
                              usage.cache_read_input_tokens or 0, usage.cache_creation_input_tokens or 0, c,
                              f"stop_reason={message.stop_reason}"))
        return 0, c
    text = next(b.text for b in message.content if b.type == "text")
    questions = json.loads(text)["questions"]
    for q in questions:
        match, score = check_quote(q["quote"], chunk["text"])
        if match == "missing" and chunk["after"]:  # questions finished in the following context
            m2, s2 = check_quote(q["quote"], chunk["after"])
            if m2 != "missing":
                match, score = m2 + "-context", s2
        qdb.execute(
            "INSERT INTO raw_questions (run_id, chunk_id, work_id, author, work_title, section_path, chunk_seq,"
            " question, answer, category, raised_by, raised_by_detail, explicit, importance, quote, quote_match,"
            " quote_score, scripture) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (run_id, chunk["id"], chunk["work_id"], chunk["author"], chunk["title"], chunk["path"],
             chunk["chunk_seq"], q["question"], q["answer"], q["category"], q["raised_by"],
             q["raised_by_detail"], int(q["explicit"]), q["importance"], q["quote"], match, score,
             json.dumps(q["scripture"])))
    qdb.execute("INSERT OR REPLACE INTO chunk_results VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                common + ("ok", len(questions), usage.input_tokens, usage.output_tokens,
                          usage.cache_read_input_tokens or 0, usage.cache_creation_input_tokens or 0, c, None))
    return len(questions), c


def run_direct(client, qdb, run_id, chunks, effort, workers):
    def call(chunk):
        # Server-side fallback: if Opus 5.5 declines a passage, the API retries it on a fallback model.
        return chunk, client.beta.messages.create(
            betas=["server-side-fallback-2026-07-01"], fallbacks="default", **build_params(chunk, effort))

    total_q = total_cost = 0
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(call, ch) for ch in chunks]
        for i, fut in enumerate(as_completed(futures), 1):
            try:
                chunk, msg = fut.result()
            except anthropic.APIError as e:
                print(f"  [{i}/{len(chunks)}] API error: {e}")
                continue
            n, c = store(qdb, run_id, chunk, msg, batch=False)
            qdb.commit()
            total_q += n
            total_cost += c
            print(f"  [{i}/{len(chunks)}] {chunk['work_id']} #{chunk['id']}: {n} questions (${c:.3f})")
    return total_q, total_cost


def submit_batch(client, qdb, run_id, chunks, effort):
    requests = [Request(custom_id=str(ch["id"]), params=MessageCreateParamsNonStreaming(**build_params(ch, effort)))
                for ch in chunks]
    batch = client.messages.batches.create(requests=requests)
    qdb.execute("UPDATE runs SET batch_id = ?, status = 'submitted' WHERE id = ?", (batch.id, run_id))
    qdb.commit()
    print(f"submitted batch {batch.id} with {len(requests)} requests (run {run_id}).")
    print(f"collect later with: python scripts/extract_questions.py --collect {run_id}")


def collect(client, qdb, run_id):
    run = qdb.execute("SELECT * FROM runs WHERE id = ?", (run_id,)).fetchone()
    batch = client.messages.batches.retrieve(run["batch_id"])
    if batch.processing_status != "ended":
        print(f"batch {batch.id} still {batch.processing_status}: {batch.request_counts}")
        return
    chunks = {str(r["id"]): r for r in select_chunks(argparse.Namespace(sample="all", works=None, limit=None))}
    total_q = total_cost = 0
    for result in client.messages.batches.results(batch.id):
        chunk = chunks[result.custom_id]
        if result.result.type == "succeeded":
            n, c = store(qdb, run_id, chunk, result.result.message, batch=True)
            total_q += n
            total_cost += c
        else:
            qdb.execute("INSERT OR REPLACE INTO chunk_results (run_id, chunk_id, work_id, status, error)"
                        " VALUES (?,?,?,?,?)", (run_id, chunk["id"], chunk["work_id"], "failed",
                                                result.result.type))
    qdb.execute("UPDATE runs SET status = 'done', cost_usd = ? WHERE id = ?", (total_cost, run_id))
    qdb.commit()
    print(f"run {run_id}: {total_q} questions, ${total_cost:.2f}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", choices=["pilot", "all"], default=None)
    ap.add_argument("--works", help="comma-separated work ids")
    ap.add_argument("--limit", type=int)
    ap.add_argument("--mode", choices=["direct", "batch"], default="direct")
    ap.add_argument("--effort", default="medium", choices=["low", "medium", "high", "xhigh", "max"])
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--label")
    ap.add_argument("--collect", type=int, metavar="RUN_ID")
    args = ap.parse_args()

    client = anthropic.Anthropic()
    qdb = qa_db()
    if args.collect:
        return collect(client, qdb, args.collect)
    if not (args.sample or args.works):
        ap.error("choose --sample pilot|all or --works")
    try:  # free call that fails fast on a bad or missing API key
        client.models.retrieve(MODEL)
    except (anthropic.AuthenticationError, anthropic.PermissionDeniedError) as e:
        sys.exit(f"API key rejected ({e.status_code}); nothing was sent. Check ANTHROPIC_API_KEY.")
    chunks = select_chunks(args)
    words = sum(len(c["text"].split()) for c in chunks)
    print(f"{len(chunks)} chunks, {words:,} words, mode={args.mode}, model={MODEL}, effort={args.effort}")
    cur = qdb.execute("INSERT INTO runs (label, mode, model, effort, status) VALUES (?,?,?,?,?)",
                      (args.label or args.sample or args.works, args.mode, MODEL, args.effort, "running"))
    run_id = cur.lastrowid
    qdb.commit()
    if args.mode == "batch":
        return submit_batch(client, qdb, run_id, chunks, args.effort)
    total_q, total_cost = run_direct(client, qdb, run_id, chunks, args.effort, args.workers)
    qdb.execute("UPDATE runs SET status = 'done', cost_usd = ? WHERE id = ?", (total_cost, run_id))
    qdb.commit()
    full = total_cost / max(words, 1) * 1_480_000 / 2
    print(f"run {run_id}: {total_q} questions from {len(chunks)} chunks, ${total_cost:.2f}")
    print(f"projected full-corpus extraction via Batch API: ~${full:.0f}")


if __name__ == "__main__":
    main()
