"""Write one plain-language answer per knowledge-base topic, grounded in Scripture and the corpus.

Uses the Message Batches API (half price, asynchronous).

    python scripts/build_topic_answers.py submit [--run 4] [--max-cost 12] [--limit N]
    python scripts/build_topic_answers.py collect [--run 4]     # waits for the batch, then writes the file
    python scripts/build_topic_answers.py redo --ids 1032,995   # rewrites those answers now (standard API)

Output: corpus/qa/topic_answers_run<N>.json  {topic_id: {answer, scripture}}
"""
import argparse
import json
import sys
import time
from pathlib import Path

import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

sys.path.insert(0, str(Path(__file__).resolve().parent))
from qa_common import MODEL, PRICES, ROOT, cost  # noqa: E402

QA_DIR = ROOT / "qa"
MAX_SOURCE_CHARS = 14000

SYSTEM = """You write the answers for a website that explains the Trinity to ordinary Christians: churchgoers of any denomination, with no training in theology.

For each topic you are given the topic's question, a short description, and background notes: questions that classical Christian writers raised about it, with a summary of each writer's answer. Use the notes to understand the question and the arguments, but write for the reader, not about the writers.

Answer the question with the core, historic teaching of the Christian church, as Christians have confessed it from the early creeds onward, explained in everyday words and grounded in the Bible.

Writing:
- Begin with a direct answer to the question in the first sentence, phrased for this question. Vary how answers open from one topic to the next; avoid stock phrases.
- Explain the teaching the way a good pastor would to a thoughtful member of the congregation: plain words, short sentences, everyday comparisons where they truly help. If a word like "essence" or "begotten" is needed, say what it means.
- Show where the teaching comes from in the Bible, referring to passages in the text where it helps (e.g. "Jesus says in John 10:30 ...").
- Do not name theologians, church fathers, confessions, catechisms, denominations or traditions, and do not appeal to anyone's authority. The reader will not know the names, so make the case from Scripture and clear reasoning instead.
- Teach the doctrine of the historic Western church as the church's teaching, plainly and with confidence. Do not present rival views, say that other Christians disagree, or mention Eastern or Western churches. In particular: the Holy Spirit proceeds eternally from the Father and the Son, as from one source; and God is simple, so His attributes are identical with His one essence (do not teach a distinction between God's essence and His "energies").
- Address common misunderstandings the question invites, gently, without long lists of ancient errors.
- Take the length the question needs; there is no word limit. Use short paragraphs, no headings or lists.
- Write in your own words; do not quote any writer. Short quotations of Bible verses are fine.
- Quote the Bible in the wording of the Berean Standard Bible (BSB), the translation the rest of the site uses. Where you are not sure of the BSB's exact words, give the sense in your own words instead of a quotation.
- In "scripture", give up to five key passages as references such as "John 10:30"."""

SCHEMA = {
    "type": "object",
    "properties": {
        "answer": {"type": "string"},
        "scripture": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["answer", "scripture"],
    "additionalProperties": False,
}


def topic_prompt(theme, t):
    lines = [f"Theme: {theme['title']}", f"Topic question: {t['title']}", f"Description: {t.get('description') or ''}",
             "", "Background notes:"]
    used = 0
    qs = sorted(t["questions"], key=lambda q: -len(q["sources"]))
    for q in qs:
        block = [f"\nQ: {q['question']}"]
        for s in q["sources"]:
            where = s["section"].split(" > ")[-1][:80]
            block.append(f"- {s['author']}, {s['work']} ({where}): {s['answer']}")
        text = "\n".join(block)
        if used + len(text) > MAX_SOURCE_CHARS:
            break
        lines.append(text)
        used += len(text)
    return "\n".join(lines)


def load_topics(run):
    kb = json.load(open(QA_DIR / f"kb_run{run}.json", encoding="utf8"))
    return [(th, t) for th in kb for t in th["topics"]]


def submit(args):
    pairs = load_topics(args.run)
    if args.limit:
        pairs = pairs[: args.limit]
    prompts = [(t["id"], topic_prompt(th, t)) for th, t in pairs]
    # estimate at batch prices: input by characters, output allows for adaptive thinking
    est = sum(len(p) / 4 * PRICES["input"] + 5000 * PRICES["output"] for _, p in prompts) / 1e6 / 2
    print(f"{len(prompts)} topics, estimated ${est:.2f} at batch prices")
    if est > args.max_cost:
        sys.exit(f"Estimate is above --max-cost {args.max_cost}; nothing submitted.")
    client = anthropic.Anthropic()
    batch = client.messages.batches.create(requests=[
        Request(custom_id=f"topic-{tid}", params=MessageCreateParamsNonStreaming(
            model=MODEL, max_tokens=16000,
            system=[{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": prompt}],
            output_config={"effort": "medium", "format": {"type": "json_schema", "schema": SCHEMA}},
        )) for tid, prompt in prompts
    ])
    state = QA_DIR / f"topic_answers_run{args.run}.batch.json"
    state.write_text(json.dumps({"batch_id": batch.id, "n": len(prompts)}), encoding="utf8")
    print(f"Submitted batch {batch.id}; state saved to {state}")


def collect(args):
    state = json.loads((QA_DIR / f"topic_answers_run{args.run}.batch.json").read_text(encoding="utf8"))
    client = anthropic.Anthropic()
    while True:
        batch = client.messages.batches.retrieve(state["batch_id"])
        if batch.processing_status == "ended":
            break
        c = batch.request_counts
        print(f"{batch.processing_status}: {c.succeeded} done, {c.processing} processing", flush=True)
        time.sleep(60)
    out_path = QA_DIR / f"topic_answers_run{args.run}.json"
    out = json.loads(out_path.read_text(encoding="utf8")) if out_path.exists() else {}
    total, failed = 0.0, []
    for r in client.messages.batches.results(state["batch_id"]):
        tid = r.custom_id.removeprefix("topic-")
        if r.result.type != "succeeded":
            failed.append((tid, r.result.type))
            continue
        msg = r.result.message
        total += cost(msg.usage, batch=True)
        if msg.stop_reason != "end_turn":
            failed.append((tid, msg.stop_reason))
            continue
        out[tid] = json.loads(next(b.text for b in msg.content if b.type == "text"))
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf8")
    print(f"Wrote {len(out)} answers to {out_path}; cost ${total:.2f}; failed: {failed}")


def cancel(args):
    state = json.loads((QA_DIR / f"topic_answers_run{args.run}.batch.json").read_text(encoding="utf8"))
    b = anthropic.Anthropic().messages.batches.cancel(state["batch_id"])
    print(f"Batch {b.id}: {b.processing_status}; succeeded so far {b.request_counts.succeeded}")


def sample(args):
    """Answer a few topics right away (standard API) to check the style."""
    want = {int(x) for x in args.ids.split(",")}
    client = anthropic.Anthropic()
    total = 0.0
    for th, t in load_topics(args.run):
        if t["id"] not in want:
            continue
        msg = client.messages.create(
            model=MODEL, max_tokens=16000,
            system=[{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": topic_prompt(th, t)}],
            output_config={"effort": "medium", "format": {"type": "json_schema", "schema": SCHEMA}},
        )
        total += cost(msg.usage)
        data = json.loads(next(b.text for b in msg.content if b.type == "text")) if msg.stop_reason == "end_turn" else None
        print(json.dumps({"id": t["id"], "topic": t["title"], "stop": msg.stop_reason, **(data or {})}, ensure_ascii=False, indent=1))
    print(f"cost ${total:.2f}")


def redo(args):
    """Rewrite the answers for --ids right away (standard API) and save them into the answers file."""
    want = {int(x) for x in args.ids.split(",")}
    out_path = QA_DIR / f"topic_answers_run{args.run}.json"
    out = json.loads(out_path.read_text(encoding="utf8"))
    client = anthropic.Anthropic()
    total, failed = 0.0, []
    for th, t in load_topics(args.run):
        if t["id"] not in want:
            continue
        msg = client.beta.messages.create(
            model=MODEL, max_tokens=16000,
            betas=["server-side-fallback-2026-07-01"], fallbacks="default",
            system=[{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": topic_prompt(th, t)}],
            output_config={"effort": "medium", "format": {"type": "json_schema", "schema": SCHEMA}},
        )
        total += cost(msg.usage)
        if msg.stop_reason != "end_turn":
            failed.append((t["id"], msg.stop_reason))
            continue
        out[str(t["id"])] = json.loads(next(b.text for b in msg.content if b.type == "text"))
        print(f"{t['id']}: ok", flush=True)
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf8")
    print(f"Saved to {out_path}; cost ${total:.2f}; failed: {failed}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["submit", "collect", "sample", "redo", "cancel"])
    ap.add_argument("--ids", default="1003,1032,980,1024")
    ap.add_argument("--run", type=int, default=4)
    ap.add_argument("--max-cost", type=float, default=12.0)
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()
    {"submit": submit, "collect": collect, "sample": sample, "redo": redo, "cancel": cancel}[args.cmd](args)
