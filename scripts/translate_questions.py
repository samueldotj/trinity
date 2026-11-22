"""Translate the Q&A page into Tamil: each question's wording and every writer's answer (the quotes stay English).

Uses the Message Batches API (half price, asynchronous), with the fixed Tamil terms and IRV wording of the
teachings' translation. Questions go a few at a time per request, grouped by topic.

    python scripts/translate_questions.py submit [--ids 505,608] [--max-cost 80]
    python scripts/translate_questions.py collect          # waits for the batch, then writes the file
    python scripts/translate_questions.py dry-run [--ids 505]

Output: corpus/qa/questions.ta.json   {id: {q, a: [answer, ...], en: {q, a}}}
Each entry keeps the English it was made from under "en", so a later change to the English shows up as stale.
"""
import argparse
import json
import sys
import time
from pathlib import Path

import anthropic
from anthropic.types.messages.batch_create_params import Request

sys.path.insert(0, str(Path(__file__).resolve().parent))
from qa_common import PRICES, ROOT, cost  # noqa: E402
from translate_topics import DATA, REF, SYSTEM as TOPICS_SYSTEM, fixed_terms, irv, params  # noqa: E402
from build_teaching_explanations import GLOSSARY  # noqa: E402

QA_DIR = ROOT / "qa"
OUT = QA_DIR / "questions.ta.json"
STATE = QA_DIR / "questions.ta.batch.json"
PER_REQUEST = 8

# Lifetimes of the writers, as the site shows them (web/src/writers.ts).
LIVED = {
    "Irenaeus": "c. 130–c. 202", "Hippolytus": "c. 170–c. 235", "Novatian": "c. 200–c. 258",
    "Athanasius": "c. 296–373", "Hilary": "c. 310–c. 367", "Basil": "c. 330–379", "Gregory of Nyssa": "c. 335–c. 395",
    "Ambrose": "c. 340–397", "Augustine": "354–430", "John Owen": "1616–1683", "Waterland": "1683–1740",
    "Jonathan Edwards": "1703–1758", "Bickersteth": "1825–1906", "Warfield": "1851–1921",
}

SYSTEM = TOPICS_SYSTEM.replace(
    "You translate the Topics page of the site: theme names, topic questions, plain-language answers, and short quotations from early and classical Christian writers,",
    "You translate the Q&A page of the site: questions that classical Christian writers raised about the Trinity, and a short summary of each writer's answer,",
) + """

For this page:
- Each question is a question: translate it as a natural Tamil question. Keep any Bible reference in it.
- Each answer summarises what one writer argued. Keep its claims, its reasoning, and any view it attributes to the writer or to his opponents; do not soften or correct the writer.
- The writer's own words in English are given for context only: do not translate them or quote them.
- Names of people (writers, heretics, emperors) go in Tamil script, as Tamil Christian writing spells them. When one of the writers below is named, follow his name with his lifetime in brackets the first time he appears in that answer, written as given with "c." as "சுமார்", e.g. "அகஸ்டின் (354–430)", "அத்தனாசியுஸ் (சுமார் 296–373)":
""" + "\n".join(f"  - {k}: {v}" for k, v in LIVED.items()) + """
- When a book is named in the text, keep its title translated into Tamil, followed by the English title in brackets.
- Return one item per question, with its id and its answers in the order given, one Tamil string for each."""

SCHEMA = {
    "type": "object",
    "properties": {"items": {"type": "array", "items": {
        "type": "object",
        "properties": {"id": {"type": "integer"}, "q": {"type": "string"},
                       "a": {"type": "array", "items": {"type": "string"}}},
        "required": ["id", "q", "a"], "additionalProperties": False,
    }}},
    "required": ["items"], "additionalProperties": False,
}


def english(d, x):
    return {"q": x[1], "a": [a[3] for a in d["details"][str(x[0])]["a"]]}


def irv_for(refs, verses):
    out = []
    for m in REF.finditer(" ".join(refs)):
        book, ch, v1, v2 = m.group(1), m.group(2), int(m.group(3)), int(m.group(4) or m.group(3))
        if v2 - v1 > 4:
            continue
        words = [verses.get(f"{book} {ch}:{v}") for v in range(v1, v2 + 1)]
        if all(words):
            out.append(f"{m.group(0)}: {' '.join(words)}")
    return out


def prompt(d, group, gl, verses):
    authors = d["authors"]
    parts = [fixed_terms(gl)]
    for x in group:
        det = d["details"][str(x[0])]
        lines = [f"=== Question id {x[0]}\nq: {x[1]}"]
        for n, a in enumerate(det["a"]):
            lines.append(f"\nAnswer {n + 1} — {authors[a[0]]}, {a[1]}{f' ({a[2]})' if a[2] else ''}:\n{a[3]}")
            lines.append(f"(His own words, for context only: {a[4]})")
            bible = irv_for(a[5], verses)
            if bible:
                lines.append("IRV wording of passages this answer cites (quote from these if the English quotes them):\n"
                             + "\n".join(f"- {b}" for b in bible))
        parts.append("\n".join(lines))
    parts.append(f"Translate the {len(group)} question(s) above and every answer to each.")
    return "\n\n".join(parts)


def load(args):
    d = json.load(open(DATA / "questions.json", encoding="utf8"))
    gl = json.loads(GLOSSARY.read_text(encoding="utf8"))
    done = json.loads(OUT.read_text(encoding="utf8")) if OUT.exists() else {}
    want = set(args.ids.split(",")) if args.ids else None
    todo = [x for x in d["q"] if (str(x[0]) in want if want else done.get(str(x[0]), {}).get("en") != english(d, x))]
    # Group by topic, a few questions per request, so the long instructions are paid for once per group.
    todo.sort(key=lambda x: (x[4], x[0]))
    groups, cur = [], []
    for x in todo:
        if cur and (len(cur) == args.per or cur[-1][4] != x[4]):
            groups.append(cur)
            cur = []
        cur.append(x)
    if cur:
        groups.append(cur)
    return d, gl, groups


def submit(args):
    d, gl, groups = load(args)
    verses = irv()
    reqs, chars = [], 0
    for g in groups:
        p = prompt(d, g, gl, verses)
        chars += sum(len(x[1]) + sum(len(a) for a in english(d, x)["a"]) for x in g)
        reqs.append(Request(custom_id=f"q-{g[0][0]}-{len(g)}", params=params(p, SCHEMA)))
        reqs[-1]["params"]["system"][0]["text"] = SYSTEM
    est = ((sum(len(r["params"]["messages"][0]["content"]) for r in reqs) / 3 + 3000 * len(reqs)) * PRICES["input"]
           + (chars / 4 * 3.5 + 1500 * len(reqs)) * PRICES["output"]) / 1e6 / 2
    print(f"{sum(map(len, groups))} questions in {len(reqs)} requests, estimated ${est:.2f} at batch prices")
    if est > args.max_cost:
        sys.exit(f"Estimate is above --max-cost {args.max_cost}; nothing submitted.")
    batch = anthropic.Anthropic().messages.batches.create(requests=reqs)
    STATE.write_text(json.dumps({"batch_id": batch.id, "n": len(reqs)}), encoding="utf8")
    print(f"Submitted batch {batch.id}; state saved to {STATE}")


def collect(args):
    state = json.loads(STATE.read_text(encoding="utf8"))
    client = anthropic.Anthropic()
    while True:
        batch = client.messages.batches.retrieve(state["batch_id"])
        if batch.processing_status == "ended":
            break
        c = batch.request_counts
        print(f"{batch.processing_status}: {c.succeeded} done, {c.errored} errored, {c.processing} processing", flush=True)
        time.sleep(60)
    d = json.load(open(DATA / "questions.json", encoding="utf8"))
    by_id = {str(x[0]): x for x in d["q"]}
    out = json.loads(OUT.read_text(encoding="utf8")) if OUT.exists() else {}
    total, failed = 0.0, []
    for r in client.messages.batches.results(state["batch_id"]):
        if r.result.type != "succeeded":
            failed.append((r.custom_id, r.result.type))
            continue
        msg = r.result.message
        total += cost(msg.usage, batch=True)
        if msg.stop_reason != "end_turn":
            failed.append((r.custom_id, msg.stop_reason))
            continue
        for it in json.loads(next(b.text for b in msg.content if b.type == "text"))["items"]:
            x = by_id.get(str(it["id"]))
            if not x:
                failed.append((r.custom_id, f"unknown id {it['id']}"))
                continue
            en = english(d, x)
            if len(it["a"]) != len(en["a"]):
                failed.append((it["id"], f"{len(it['a'])} answers for {len(en['a'])}"))
                continue
            out[str(it["id"])] = {"q": it["q"], "a": it["a"], "en": en}
    out = dict(sorted(out.items(), key=lambda kv: int(kv[0])))
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf8")
    missing = [x[0] for x in d["q"] if str(x[0]) not in out]
    print(f"Wrote {len(out)} questions to {OUT}; cost ${total:.2f}; failed: {failed[:20]}; still missing: {len(missing)}")


def dry_run(args):
    d, gl, groups = load(args)
    print(SYSTEM, "\n\n=====\n\n", prompt(d, groups[0], gl, irv()), sep="")
    print(f"\n[dry run: {sum(map(len, groups))} question(s) in {len(groups)} request(s)]")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["submit", "collect", "dry-run"])
    ap.add_argument("--ids", help="comma-separated question ids (default: all not yet translated)")
    ap.add_argument("--max-cost", type=float, default=80)
    ap.add_argument("--per", type=int, default=PER_REQUEST, help="questions per request")
    a = ap.parse_args()
    {"submit": submit, "collect": collect, "dry-run": dry_run}[a.cmd](a)
