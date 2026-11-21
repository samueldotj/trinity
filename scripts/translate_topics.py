"""Translate the Topics page into Tamil: theme names and descriptions, topic titles, answers and writers' quotes.

Uses the Message Batches API (half price, asynchronous), with the fixed Tamil terms and IRV wording that
the teachings' translation uses (scripts/build_teaching_explanations.py).

    python scripts/translate_topics.py submit [--ids 1043,995] [--max-cost 40]
    python scripts/translate_topics.py collect            # waits for the batch, then writes the file
    python scripts/translate_topics.py dry-run [--ids 1043]

Output: corpus/qa/topics.ta.json
    {"themes": {key: {title, desc, short}}, "topics": {id: {title, answer, quotes: [...], en: {...}}}}
Each entry keeps the English it was made from under "en", so a later change to the English shows up as stale.
"""
import argparse
import json
import re
import sys
import time
from pathlib import Path

import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

sys.path.insert(0, str(Path(__file__).resolve().parent))
from qa_common import MODEL, PRICES, ROOT, cost  # noqa: E402
from build_teaching_explanations import BOOKS_TA, GLOSSARY, TERMS, TERMS_TA, TRANSLATE  # noqa: E402

QA_DIR = ROOT / "qa"
REPO = ROOT.parent
DATA = REPO / "data"
OUT = QA_DIR / "topics.ta.json"
STATE = QA_DIR / "topics.ta.batch.json"
IRV_TXT = ROOT / "bible" / "irv.txt"

SYSTEM = TRANSLATE.replace(
    "You translate a glossary of Christian theological words",
    "You translate the Topics page of the site: theme names, topic questions, plain-language answers, and short quotations from early and classical Christian writers,",
) + """

- Bible book names: use the names of the Tamil IRV (e.g. """ + ", ".join(f"{k} → {v}" for k, v in list(BOOKS_TA.items())[:8]) + """), keeping chapter and verse numbers as they are (e.g. “யோவான் 10:30”).
- Where the English quotes a Bible verse, quote the IRV wording given with the topic if it is there; otherwise give the verse's sense in your own words without quotation marks. Never make up a Tamil Bible quotation.
- Topic titles are questions: translate each as a natural Tamil question.
- Answers: keep the paragraphs (blank lines between them) and any **bold** markers exactly where the English has them. Keep every sentence's point and every Bible reference.
- Quotes are a writer's own words, translated from Greek or Latin into older English. Translate each faithfully into clear, slightly formal Tamil, keeping its meaning, its first person and its rhetoric. Do not add quotation marks, the writer's name, or explanations. Give the quotes in the same order as given, one Tamil string for each English one."""

TOPIC_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "answer": {"type": "string"},
        "quotes": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["title", "answer", "quotes"], "additionalProperties": False,
}
THEMES_SCHEMA = {
    "type": "object",
    "properties": {"themes": {"type": "array", "items": {
        "type": "object",
        "properties": {"key": {"type": "string"}, "title": {"type": "string"}, "desc": {"type": "string"},
                       "short": {"type": "string"}},
        "required": ["key", "title", "desc", "short"], "additionalProperties": False,
    }}},
    "required": ["themes"], "additionalProperties": False,
}

REF = re.compile(r"\b((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d+):(\d+)(?:[–-](\d+))?")


def irv():
    verses = {}
    for line in IRV_TXT.read_text(encoding="utf8").splitlines()[3:]:
        ref, _, text = line.partition("\t")
        verses[ref] = text
    return verses


def short_labels():
    src = (REPO / "crates" / "trinity-core" / "src" / "lib.rs").read_text(encoding="utf8")
    block = src.split("const SHORT_LABELS", 1)[1].split("];", 1)[0]
    return dict(re.findall(r'\("([^"]+)",\s*"([^"]+)"\)', block))


def topic_english(t):
    return {"title": t["title"], "answer": (t.get("ans") or {}).get("text", ""),
            "quotes": [r["quote"] for r in t["refs"]]}


def irv_lines(text, scripture, verses):
    """IRV wording for the passages an answer refers to, so the translation can quote the Tamil Bible."""
    seen, out = set(), []
    for m in list(REF.finditer(" ".join(scripture))) + list(REF.finditer(text)):
        book, ch, v1, v2 = m.group(1), m.group(2), int(m.group(3)), int(m.group(4) or m.group(3))
        label = f"{book} {ch}:{v1}" + (f"-{v2}" if v2 != v1 else "")
        if label in seen or v2 - v1 > 6:
            continue
        words = [verses.get(f"{book} {ch}:{v}") for v in range(v1, v2 + 1)]
        if all(words):
            seen.add(label)
            out.append(f"- {label}: {' '.join(words)}")
        if len(out) >= 30:
            break
    return out


def fixed_terms(gl):
    return ("Fixed Tamil terms for the key words (use these exact terms whenever the idea appears):\n"
            + "\n".join(f"- {gl[k]['term']}: {TERMS_TA[k]}" for k in TERMS))


def topic_prompt(th, t, gl, verses):
    e = topic_english(t)
    parts = [f"Theme: {th['title']}", fixed_terms(gl)]
    lines = irv_lines(e["answer"], (t.get("ans") or {}).get("scripture", []), verses)
    if lines:
        parts.append("IRV wording of passages the answer refers to (quote from these when the English quotes the verse):\n"
                     + "\n".join(lines))
    quotes = "\n".join(f"{i + 1}. ({r['author']}, {r['work']}) {r['quote']}" for i, r in enumerate(t["refs"]))
    parts.append(f"Translate the topic title, the answer and the {len(t['refs'])} quote(s).\n\n"
                 f"title:\n{e['title']}\n\nanswer:\n{e['answer']}\n\nquotes:\n{quotes or '(none)'}")
    return "\n\n".join(parts)


def themes_prompt(kb, gl, labels):
    items = "\n\n".join(f"key: {th['key']}\ntitle: {th['title']}\nshort (a menu label, keep it as short as the English): "
                        f"{labels.get(th['key'], '')}\ndesc: {th['desc']}" for th in kb)
    return f"{fixed_terms(gl)}\n\nTranslate each theme's title, short label and description; return them with their keys.\n\n{items}"


def load(args):
    kb = json.load(open(DATA / "topics.json", encoding="utf8"))
    gl = json.loads(GLOSSARY.read_text(encoding="utf8"))
    want = {x for x in args.ids.split(",")} if args.ids else None
    done = json.loads(OUT.read_text(encoding="utf8"))["topics"] if OUT.exists() else {}
    # Without --ids, skip topics already translated from the English as it stands.
    todo = [(th, t) for th in kb for t in th["topics"]
            if (str(t["id"]) in want if want else done.get(str(t["id"]), {}).get("en") != topic_english(t))]
    return kb, gl, todo


def params(prompt, schema, max_tokens=32000):
    return MessageCreateParamsNonStreaming(
        model=MODEL, max_tokens=max_tokens,
        system=[{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": prompt}],
        output_config={"effort": "medium", "format": {"type": "json_schema", "schema": schema}},
    )


def submit(args):
    kb, gl, todo = load(args)
    verses = irv()
    reqs = [Request(custom_id=f"topic-{t['id']}", params=params(topic_prompt(th, t, gl, verses), TOPIC_SCHEMA))
            for th, t in todo]
    if not args.ids:
        reqs.append(Request(custom_id="themes", params=params(themes_prompt(kb, gl, short_labels()), THEMES_SCHEMA)))
    # Tamil takes about 3.5 times the tokens of the English; allow for thinking on top.
    chars = sum(len(json.dumps(topic_english(t), ensure_ascii=False)) for _, t in todo)
    est = ((chars / 4 + 3000 * len(reqs)) * PRICES["input"] + (chars / 4 * 3.5 + 1500 * len(reqs)) * PRICES["output"]) / 1e6 / 2
    print(f"{len(reqs)} requests, estimated ${est:.2f} at batch prices")
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
    kb = json.load(open(DATA / "topics.json", encoding="utf8"))
    topics = {str(t["id"]): t for th in kb for t in th["topics"]}
    labels = short_labels()
    out = json.loads(OUT.read_text(encoding="utf8")) if OUT.exists() else {"themes": {}, "topics": {}}
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
        res = json.loads(next(b.text for b in msg.content if b.type == "text"))
        if r.custom_id == "themes":
            for th in kb:
                hit = next((x for x in res["themes"] if x["key"] == th["key"]), None)
                if hit:
                    out["themes"][th["key"]] = {"title": hit["title"], "desc": hit["desc"], "short": hit["short"],
                                                "en": {"title": th["title"], "desc": th["desc"], "short": labels.get(th["key"], "")}}
                else:
                    failed.append((f"theme {th['key']}", "missing"))
            continue
        tid = r.custom_id.removeprefix("topic-")
        en = topic_english(topics[tid])
        if len(res["quotes"]) != len(en["quotes"]):
            failed.append((tid, f"{len(res['quotes'])} quotes for {len(en['quotes'])}"))
            continue
        res["en"] = en
        out["topics"][tid] = res
    out["topics"] = dict(sorted(out["topics"].items(), key=lambda kv: int(kv[0])))
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf8")
    print(f"Wrote {len(out['themes'])} themes and {len(out['topics'])} topics to {OUT}; cost ${total:.2f}; failed: {failed}")


def dry_run(args):
    kb, gl, todo = load(args)
    th, t = todo[0]
    print(SYSTEM, "\n\n=====\n\n", topic_prompt(th, t, gl, irv()), sep="")
    print(f"\n[dry run: {len(todo)} topic(s)]")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["submit", "collect", "dry-run"])
    ap.add_argument("--ids", help="comma-separated topic ids (default: all, plus the themes)")
    ap.add_argument("--max-cost", type=float, default=40)
    a = ap.parse_args()
    {"submit": submit, "collect": collect, "dry-run": dry_run}[a.cmd](a)
