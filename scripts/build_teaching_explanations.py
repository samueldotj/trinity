"""Write the explanations for the 46 Explanations teachings, and the glossary of theological words they use.

Each teaching gets "What does this mean?" (3-4 sentences), "How do these passages support it?"
(2-3 sentences) and the glossary words it relies on. Uses the standard API: 47 requests in all.

    python scripts/build_teaching_explanations.py glossary            # writes corpus/qa/glossary.json
    python scripts/build_teaching_explanations.py teachings [--ids 21,23,25]
                                                                       # writes corpus/qa/teaching_explanations.json
Then rebuild the site data:  python scripts/site/build_teachings_data.py ...  (or scripts/site/build_all.py)

Reads data/teachings.json for each teaching's statement and its Bible passages (BSB text).
"""
import argparse
import json
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import anthropic

sys.path.insert(0, str(Path(__file__).resolve().parent))
from qa_common import MODEL, ROOT, cost  # noqa: E402

QA_DIR = ROOT / "qa"
DATA = ROOT.parent / "data"
GLOSSARY = QA_DIR / "glossary.json"
OUT = QA_DIR / "teaching_explanations.json"

# The words to define, in the order a reader meets them. key: (word as shown, what to cover)
TERMS = {
    "essence": ("Essence", "what God is; also called God's being or substance; there is one divine essence"),
    "nature": ("Nature", "the kind of thing something is and what belongs to it; divine nature and human nature; how it relates to essence"),
    "person": ("Person", "who someone is, as distinct from what they are. Take particular care: in the Trinity, three Persons are NOT three separate beings or three individuals the way three humans are; each Person is the whole one God, distinct from the others only by how they are related. Say plainly what the word does and does not mean"),
    "trinity": ("Trinity", "one God in three Persons; the word is not in the Bible but sums up its teaching"),
    "eternal": ("Eternal", "without beginning or end, not bound by time"),
    "immutable": ("Immutable", "unchanging in nature and character"),
    "omnipresent": ("Omnipresent", "present everywhere, not limited by space, without being spread out in parts"),
    "indivisible": ("Indivisible", "God has no parts and cannot be divided; sometimes called divine simplicity"),
    "coeternal": ("Coeternal", "equally eternal: none of the Persons existed before another"),
    "coequal": ("Coequal", "equal in deity, power and glory"),
    "perichoresis": ("Perichoresis", "the mutual indwelling of the Persons: each is fully in the others, without merging"),
    "eternal-generation": ("Eternal generation", "the Son being 'begotten' of the Father. Say explicitly that it has no beginning in time, involves no bodily reproduction, and does not divide God or make a second God; the Son receives the whole divine essence from the Father eternally"),
    "procession": ("Procession", "the Spirit's eternal coming forth from the Father; different from begetting; not the same as the Spirit being sent at Pentecost"),
    "filioque": ("Filioque", "Latin 'and the Son': the Western creed's addition that the Spirit proceeds from the Father and the Son; the East confesses 'from the Father'"),
    "relations-of-origin": ("Relations of origin", "how the Persons are distinguished: the Father begets and is unbegotten, the Son is begotten, the Spirit proceeds; these relations, not different natures or ranks, are what distinguish them"),
    "inseparable-operations": ("Inseparable operations", "every work of God outside Himself is done by all three Persons together, as one act"),
    "appropriation": ("Appropriation", "attributing a shared work especially to one Person, e.g. creation to the Father, redemption to the Son, sanctification to the Spirit, without denying the others act too"),
    "incarnation": ("Incarnation", "the Son of God becoming man, taking a full human nature, body and soul"),
    "hypostatic-union": ("Hypostatic union", "the union of divine and human natures in the one Person of the Son, without mixing, changing, dividing or separating them"),
}

STYLE = """You write for a website that explains the Trinity to ordinary Christians: churchgoers of any denomination, with no training in theology. You present the core, historic teaching of the Christian church, as confessed from the early creeds onward, in plain words.

- Plain words, short sentences. Explain, do not just restate. Where a word is technical, say what it means.
- Do not name theologians, church fathers, confessions, catechisms, denominations or traditions, except that the Eastern and Western churches may be named where they differ (the filioque).
- Write in your own words; do not quote any writer. Quote the Bible only in the exact words of the Berean Standard Bible (BSB) text you are given; otherwise give the sense in your own words.
- Use curly apostrophes and quotation marks (’ “ ”). Capitalise pronouns for God (He, His, Him) and "Person" when it means a divine Person."""

GLOSSARY_SCHEMA = {
    "type": "object",
    "properties": {"terms": {"type": "array", "items": {
        "type": "object",
        "properties": {"key": {"type": "string"}, "def": {"type": "string"}},
        "required": ["key", "def"], "additionalProperties": False}}},
    "required": ["terms"], "additionalProperties": False,
}

TEACHING_SCHEMA = {
    "type": "object",
    "properties": {
        "meaning": {"type": "string"},
        "support": {"type": "string"},
        "terms": {"type": "array", "items": {"type": "string", "enum": list(TERMS)}},
    },
    "required": ["meaning", "support", "terms"], "additionalProperties": False,
}

# Points particular teachings must make, beyond the general instructions.
MUST = {
    1: "This is the first teaching. Make plain early that God is one in essence (what God is) and three in Person (who God is), so the reader has the words essence, nature and person from the start; include all three in terms.",
    9: "Distinguish essence/being (one) from Person (three) carefully, and say that three Persons does not mean three beings.",
    13: "Say clearly what “Person” means here and that it does not mean three separate beings or three Gods.",
    20: "Contrast this with the idea that one Person merely appears in three roles or modes.",
    21: "Explain mutual indwelling concretely: each Person is wholly in the others, they are never apart, yet they do not merge into one Person. Name the term perichoresis and say what it means.",
    23: "Explain what eternal generation means and say explicitly that it has no beginning in time (there was never a time when the Son was not), involves no bodily reproduction, and does not divide God or produce a second God. Contrast begetting (the Son shares the Father’s own nature) with creating (making something of a different, lesser kind).",
    24: "Explain procession, distinguish it from the Son’s being begotten, and present the Western addition “and the Son” fairly alongside the Eastern view, briefly.",
    25: "Explain the phrase “relations of origin” itself: the Father is from no one, the Son is begotten of the Father, the Spirit proceeds; these relations are the only thing that distinguishes the Persons, since they share the one nature completely.",
    28: "The page also notes that the incarnate Son has a human will as well as the one divine will; do not contradict this.",
    29: "Explain that particular works are still attributed to particular Persons (appropriation) without the others being absent.",
    35: "The page also notes that Jesus’ prayer in Gethsemane expresses His human will’s obedience to the Father, not disagreement within the one divine will; keep consistent with this.",
    43: "Explain what “nature” and “Person” mean in this teaching, and that the natures are neither mixed nor separated.",
}


def glossary_prompt():
    lines = ["Write a short glossary entry (one to three sentences) for each of these words, for the site’s “Key words” boxes. "
             "Each entry must make sense on its own. Return every key exactly as given.\n"]
    for k, (word, cover) in TERMS.items():
        lines.append(f"- key: {k}; word: {word}; cover: {cover}")
    return "\n".join(lines)


def teaching_prompt(t, groups):
    verses = "\n".join(f"- {v['label']}: {v['text']}" for v in t["verses"])
    note = groups[t["g"]]["note"]
    parts = [
        f"Teaching {t['n']} of 46, in part “{groups[t['g']]['title']}”.",
        f"Statement: {t['title']}",
        f"One-line description already on the page: {t['detail']}",
        f"Bible passages shown on the page (BSB):\n{verses}",
    ]
    if note:
        parts.append(f"A note already on the page for this part: {note}")
    if t["n"] in MUST:
        parts.append(f"This teaching in particular: {MUST[t['n']]}")
    parts.append("""Write:
- meaning: three or four sentences answering “What does this mean?”. Explain the teaching; do not repeat the statement or the description. Say what it rules out where that helps.
- support: two or three sentences answering “How do these passages support it?”, referring to the passages above by reference (e.g. “In John 1:14 …”). Show the link from the passage to the teaching. Where the teaching is a conclusion drawn from several passages together rather than stated in one, say so honestly.
- terms: the glossary keys (from the list in the system prompt) for the technical words the reader needs for this teaching, most important first; at most four; may be empty.""")
    return "\n\n".join(parts)


def call(client, system, prompt, schema):
    msg = client.beta.messages.create(
        model=MODEL, max_tokens=16000,
        betas=["server-side-fallback-2026-07-01"], fallbacks="default",
        system=[{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": prompt}],
        output_config={"effort": "high", "format": {"type": "json_schema", "schema": schema}},
    )
    if msg.stop_reason != "end_turn":
        raise RuntimeError(f"stopped: {msg.stop_reason}")
    return json.loads(next(b.text for b in msg.content if b.type == "text")), cost(msg.usage)


def glossary(_args):
    data, c = call(anthropic.Anthropic(), STYLE, glossary_prompt(), GLOSSARY_SCHEMA)
    got = {e["key"]: e["def"] for e in data["terms"]}
    missing = [k for k in TERMS if k not in got]
    if missing:
        sys.exit(f"Glossary is missing {missing}; nothing written.")
    out = {k: {"term": TERMS[k][0], "def": got[k]} for k in TERMS}
    GLOSSARY.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf8")
    print(f"Wrote {len(out)} terms to {GLOSSARY}; cost ${c:.2f}")


def teachings(args):
    gl = json.loads(GLOSSARY.read_text(encoding="utf8"))
    system = STYLE + "\n\nGlossary used on the site (keep consistent with it; use these keys in “terms”):\n" + \
        "\n".join(f"- {k} ({g['term']}): {g['def']}" for k, g in gl.items())
    data = json.load(open(DATA / "teachings.json", encoding="utf8"))
    want = {int(x) for x in args.ids.split(",")} if args.ids else None
    todo = [t for t in data["teachings"] if not want or t["n"] in want]
    client = anthropic.Anthropic()
    out = json.loads(OUT.read_text(encoding="utf8")) if OUT.exists() else {}

    def one(t):
        try:
            return t["n"], *call(client, system, teaching_prompt(t, data["groups"]), TEACHING_SCHEMA), None
        except Exception as e:  # report and carry on; rerun with --ids for the failures
            return t["n"], None, 0.0, repr(e)

    total, failed = 0.0, []
    with ThreadPoolExecutor(max_workers=6) as pool:
        for n, res, c, err in pool.map(one, todo):
            total += c
            if err:
                failed.append((n, err))
            else:
                out[str(n)] = res
                print(f"{n}: ok", flush=True)
    out = dict(sorted(out.items(), key=lambda kv: int(kv[0])))
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf8")
    print(f"Wrote {len(out)} explanations to {OUT}; cost ${total:.2f}; failed: {failed}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["glossary", "teachings"])
    ap.add_argument("--ids", default="")
    args = ap.parse_args()
    {"glossary": glossary, "teachings": teachings}[args.cmd](args)
