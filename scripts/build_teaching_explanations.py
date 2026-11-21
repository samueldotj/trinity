"""Write the explanations for the 46 Explanations teachings, and the glossary of theological words they use.

Each teaching gets "What does this mean?" (3-4 sentences), "How do these passages support it?"
(2-3 sentences) and the glossary words it relies on. Uses the standard API: 47 requests in all.

    python scripts/build_teaching_explanations.py glossary [--ids procession,person]
                                                                       # writes corpus/qa/glossary.json
    python scripts/build_teaching_explanations.py teachings [--ids 21,23,25]
                                                                       # writes corpus/qa/teaching_explanations.json
    python scripts/build_teaching_explanations.py translate [--ids person,trinity]
                                                                       # writes corpus/qa/glossary.ta.json (Tamil)
    python scripts/build_teaching_explanations.py translate-teachings [--ids 1,24] [--dry-run]
                                                                       # writes corpus/qa/teaching_explanations.ta.json (Tamil)
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
    "procession": ("Procession", "the Spirit's eternal coming forth from the Father and the Son, as from one source; different from begetting; not the same as the Spirit being sent at Pentecost"),
    "relations-of-origin": ("Relations of origin", "how the Persons are distinguished: the Father begets and is unbegotten, the Son is begotten of the Father, the Spirit proceeds from the Father and the Son; these relations, not different natures or ranks, are what distinguish them"),
    "inseparable-operations": ("Inseparable operations", "every work of God outside Himself is done by all three Persons together, as one act"),
    "appropriation": ("Appropriation", "attributing a shared work especially to one Person, e.g. creation to the Father, redemption to the Son, sanctification to the Spirit, without denying the others act too"),
    "incarnation": ("Incarnation", "the Son of God becoming man, taking a full human nature, body and soul"),
    "hypostatic-union": ("Hypostatic union", "the union of divine and human natures in the one Person of the Son, without mixing, changing, dividing or separating them"),
}

STYLE = """You write for a website that explains the Trinity to ordinary Christians: churchgoers of any denomination, with no training in theology. You present the core, historic teaching of the Christian church, as confessed from the early creeds onward, in plain words.

- Plain words, short sentences. Explain, do not just restate. Where a word is technical, say what it means.
- Do not name theologians, church fathers, confessions, catechisms, denominations or traditions.
- Teach the Holy Spirit’s procession as the church’s doctrine: the Spirit proceeds eternally from the Father and the Son, as from one source. Never present it as one tradition’s view, and do not mention Eastern or Western churches or any disagreement about it.
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
    15: "Where you say how the Son and the Spirit are distinguished, say that the Spirit proceeds from the Father and the Son.",
    16: "Where you say how the Father and the Spirit are related, say that the Spirit proceeds from the Father and the Son.",
    24: "Explain procession and how it differs from the Son’s being begotten. Teach plainly that the Spirit proceeds eternally from the Father and the Son, as from one source (the creed’s “and the Son”), and that the Son has this from the Father. In support, show how the passages together teach it: the Spirit proceeds from the Father, the Son sends the Spirit, the Spirit receives from what is the Son’s because all the Father has is the Son’s, and He is called the Spirit of the Son.",
    25: "Explain the phrase “relations of origin” itself: the Father is from no one, the Son is begotten of the Father, the Spirit proceeds from the Father and the Son; these relations are the only thing that distinguishes the Persons, since they share the one nature completely.",
    30: "Where you mention procession, say that the Spirit proceeds from the Father and the Son.",
    28: "The page also notes that the incarnate Son has a human will as well as the one divine will; do not contradict this.",
    29: "Explain that particular works are still attributed to particular Persons (appropriation) without the others being absent.",
    35: "The page also notes that Jesus’ prayer in Gethsemane expresses His human will’s obedience to the Father, not disagreement within the one divine will; keep consistent with this.",
    43: "Explain what “nature” and “Person” mean in this teaching, and that the natures are neither mixed nor separated.",
}


def glossary_prompt(keys):
    lines = ["Write a short glossary entry (one to three sentences) for each of these words, for the site’s Key words page. "
             "Each entry must make sense on its own. Return every key exactly as given.\n"]
    for k in keys:
        word, cover = TERMS[k]
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


def glossary(args):
    """Write every entry, or with --ids only those keys (the others are kept)."""
    keys = args.ids.split(",") if args.ids else list(TERMS)
    data, c = call(anthropic.Anthropic(), STYLE, glossary_prompt(keys), GLOSSARY_SCHEMA)
    got = {e["key"]: e["def"] for e in data["terms"]}
    missing = [k for k in keys if k not in got]
    if missing:
        sys.exit(f"Glossary is missing {missing}; nothing written.")
    old = json.loads(GLOSSARY.read_text(encoding="utf8")) if GLOSSARY.exists() else {}
    out = {k: {"term": TERMS[k][0], "def": got[k] if k in keys else old[k]["def"]} for k in TERMS}
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


# ---------- Tamil ----------
GLOSSARY_TA = QA_DIR / "glossary.ta.json"

# The Tamil word for each key word, fixed here so every definition uses the same one. Bible words follow
# the Tamil Indian Revised Version (IRV, eBible "tam2017", © 2017, 2019 Bridge Connectivity Solutions,
# CC BY-SA 4.0): தேவன், பிதா, குமாரன், பரிசுத்த ஆவியானவர், வார்த்தை, ஒரேபேறான (John 1:14, 18),
# புறப்படு (John 15:26), தேவத்துவம் (Col 2:9). Theological terms follow established Tamil church usage.
TERMS_TA = {
    "essence": "சாராம்சம்",
    "nature": "சுபாவம்",
    "person": "ஆள்தத்துவம்",
    "trinity": "திரித்துவம்",
    "eternal": "நித்தியம்",
    "immutable": "மாறாத்தன்மை",
    "omnipresent": "சர்வவியாபி",
    "indivisible": "பிரிக்கமுடியாத்தன்மை",
    "coeternal": "சம நித்தியம்",
    "coequal": "சமத்துவம்",
    "perichoresis": "பரஸ்பர உள்ளுறைதல் (பெரிகொரேசிஸ்)",
    "eternal-generation": "நித்திய ஜெனிப்பித்தல்",
    "procession": "புறப்படுதல்",
    "relations-of-origin": "தோற்ற உறவுகள்",
    "inseparable-operations": "பிரிக்கமுடியாத செயல்பாடுகள்",
    "appropriation": "உரித்தாக்குதல்",
    "incarnation": "மனுவுருவாதல்",
    "hypostatic-union": "ஆள்தத்துவ ஐக்கியம்",
}

# IRV wording the translation may quote (verbatim fragments from eBible tam2017).
IRV = """John 1:1: ஆரம்பத்திலே வார்த்தை இருந்தது, அந்த வார்த்தை தேவனிடம் இருந்தது, அந்த வார்த்தை தேவனாக இருந்தது.
John 1:14: அந்த வார்த்தை சரீரமாகி … பிதாவிற்கு ஒரே பேறானவருடைய மகிமைக்கு ஏற்ற மகிமையாகவே இருந்தது.
John 1:18: … பிதாவின் மடியில் இருக்கிற ஒரேபேறான குமாரனே அவரை வெளிப்படுத்தினார்.
John 4:24: தேவன் ஆவியாக இருக்கிறார்
John 10:30: நானும் பிதாவும் ஒன்றாக இருக்கிறோம்
John 14:10: நான் பிதாவிலும், பிதா என்னிலும் இருக்கிறதை நீ விசுவாசிக்கிறதில்லையா?
John 15:26: … பிதாவினிடத்திலிருந்து புறப்படுகிறவருமாகிய சத்திய ஆவியான தேற்றரவாளன் …
Matthew 28:19: … பிதா குமாரன் பரிசுத்த ஆவியின் நாமத்தினாலே அவர்களுக்கு ஞானஸ்நானங்கொடுத்து …
Colossians 2:9: தேவத்துவத்தின் பரிபூரணமெல்லாம் சரீரப்பிரகாரமாக அவருக்குள் குடிகொண்டிருக்கிறது.
Philippians 2:6: அவர் தேவனுடைய உருவமாக இருந்தும் … தேவனுக்குச் சமமாக இருப்பதைக் கொள்ளையாடின பொருளாக நினைக்காமல்
Hebrews 1:3: இவர் பிதாவுடைய மகிமையின் பிரகாசமும், அவருடைய குணத்தின் சாயலாகவும் இருந்து
1 John 4:8: தேவன் அன்பாகவே இருக்கிறார்.
Galatians 4:6: … தேவன் தமது குமாரனுடைய ஆவியை உங்களுடைய இருதயங்களில் அனுப்பினார்.
James 1:17: நன்மையான எந்த ஈவும் பூரணமான எந்த வரமும் பரலோகத்திலிருந்து உண்டாகி"""

TRANSLATE = f"""You translate a glossary of Christian theological words from English into Tamil for a website that explains the Trinity to ordinary Tamil-speaking Christians of any church, with no training in theology.

- Translate faithfully: keep every claim and nuance of the English, add nothing and leave nothing out. This is doctrine, so precision matters more than elegance. In particular: “Person” in the Trinity never means a separate being; the Holy Spirit proceeds from the Father and the Son as from one source; eternal generation has no beginning in time, nothing bodily, and does not divide God.
- Write natural, clear, everyday Tamil in short sentences, in the respectful register Tamil churches use. Refer to God and the divine Persons with respectful forms (அவர், -ார் endings).
- Use the Bible vocabulary of the Tamil Indian Revised Version (IRV): தேவன் (God), பிதா (Father), குமாரன் (Son), பரிசுத்த ஆவியானவர் (Holy Spirit), வார்த்தை (the Word), ஒரேபேறான (only begotten), புறப்படு (proceed), தேவத்துவம் (Deity).
- Each key word has a fixed Tamil term, given with the entry. Use that exact term whenever the word appears, in its own definition and in any other.
- Quote the Bible only in the exact IRV words below; otherwise give the sense in your own words. Keep any Bible references (e.g. John 15:26) in the form “யோவான் 15:26”.
- Use Tamil script throughout, except a Latin or Greek word that is itself the term (e.g. perichoresis), which may follow in brackets.

IRV wording you may quote:
{IRV}"""

TA_SCHEMA = {
    "type": "object",
    "properties": {"terms": {"type": "array", "items": {
        "type": "object",
        "properties": {"key": {"type": "string"}, "def": {"type": "string"}},
        "required": ["key", "def"], "additionalProperties": False}}},
    "required": ["terms"], "additionalProperties": False,
}


def translate(args):
    """Translate the glossary into Tamil (all entries, or --ids only), keeping the fixed terms."""
    gl = json.loads(GLOSSARY.read_text(encoding="utf8"))
    keys = args.ids.split(",") if args.ids else list(TERMS)
    # Tamil script costs many tokens, so translate a few entries per request, in parallel. Every
    # request lists all the fixed terms, so the definitions stay consistent with one another.
    fixed = "Fixed Tamil terms for all the key words:\n" + "\n".join(f"- {gl[k]['term']}: {TERMS_TA[k]}" for k in TERMS)
    client = anthropic.Anthropic()

    def batch(ks):
        prompt = fixed + "\n\nTranslate each definition below. Return every key exactly as given.\n\n" + "\n\n".join(
            f"key: {k}\nEnglish word: {gl[k]['term']}\nTamil term to use: {TERMS_TA[k]}\nDefinition: {gl[k]['def']}" for k in ks)
        return call(client, TRANSLATE, prompt, TA_SCHEMA)

    got, c = {}, 0.0
    with ThreadPoolExecutor(max_workers=4) as pool:
        for data, cost_ in pool.map(batch, [keys[i:i + 5] for i in range(0, len(keys), 5)]):
            got.update({e["key"]: e["def"] for e in data["terms"]})
            c += cost_
    missing = [k for k in keys if k not in got]
    if missing:
        sys.exit(f"Translation is missing {missing}; nothing written.")
    old = json.loads(GLOSSARY_TA.read_text(encoding="utf8")) if GLOSSARY_TA.exists() else {}
    out = {k: {"term": TERMS_TA[k], "def": got[k] if k in keys else old[k]["def"]} for k in TERMS}
    GLOSSARY_TA.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf8")
    print(f"Wrote {len(out)} Tamil terms to {GLOSSARY_TA}; cost ${c:.2f}")


OUT_TA = QA_DIR / "teaching_explanations.ta.json"

# Bible book names as the Tamil IRV spells them, for references in the translated "support" text.
BOOKS_TA = {
    "Genesis": "ஆதியாகமம்", "Deuteronomy": "உபாகமம்", "Psalm": "சங்கீதம்", "Psalms": "சங்கீதம்",
    "Isaiah": "ஏசாயா", "Jeremiah": "எரேமியா", "Malachi": "மல்கியா", "Matthew": "மத்தேயு", "Luke": "லூக்கா",
    "John": "யோவான்", "Acts": "அப்போஸ்தலர்", "1 Corinthians": "1 கொரிந்தியர்", "2 Corinthians": "2 கொரிந்தியர்",
    "Galatians": "கலாத்தியர்", "Ephesians": "எபேசியர்", "Philippians": "பிலிப்பியர்", "Colossians": "கொலோசெயர்",
    "1 Timothy": "1 தீமோத்தேயு", "Hebrews": "எபிரெயர்", "James": "யாக்கோபு", "1 Peter": "1 பேதுரு",
    "Revelation": "வெளிப்படுத்தின விசேஷம்",
}

TRANSLATE_TEACHING = TRANSLATE.replace(
    "You translate a glossary of Christian theological words",
    "You translate short explanations of the church’s teaching on the Trinity",
) + """

- Bible book names: use the IRV names given with each explanation, keeping chapter and verse numbers as they are (e.g. “யோவான் 15:26”).
- Where the English quotes a Bible passage in words not found in the IRV wording above, do not make up a Tamil quotation: give its sense in your own words without quotation marks.
- Keep the same number of sentences as the English where natural Tamil allows, and keep every reference the English makes."""

TA_TEACHING_SCHEMA = {
    "type": "object",
    "properties": {"meaning": {"type": "string"}, "support": {"type": "string"}},
    "required": ["meaning", "support"], "additionalProperties": False,
}


def english_explanations():
    """The English explanations as the site shows them: the AI text with any edits from data/edits.json on top."""
    ex = json.loads(OUT.read_text(encoding="utf8"))
    edits_path = DATA / "edits.json"
    edits = json.loads(edits_path.read_text(encoding="utf8")) if edits_path.exists() else {}
    for n, e in ex.items():
        for field in ("meaning", "support"):
            v = edits.get(f"teaching:{n}:{field}")
            if isinstance(v, dict):  # tolerate {"text": ...} style values
                v = v.get("text") or v.get("value")
            if isinstance(v, str) and v.strip():
                e[field] = v
    return ex


def teaching_translate_prompt(t, e, gl):
    books = sorted({b for b in BOOKS_TA if any(v["label"].startswith(b + " ") for v in t["verses"])
                    or b + " " in e["support"]}, key=len, reverse=True)
    used = [k for k in TERMS if k in e.get("terms", [])]
    parts = [
        f"Teaching {t['n']} of 46. Statement (stays in English on the page, for context only): {t['title']}",
        "Fixed Tamil terms for all the key words (use these exact terms whenever the idea appears):\n"
        + "\n".join(f"- {gl[k]['term']}: {TERMS_TA[k]}" for k in TERMS),
    ]
    if used:
        parts.append("Key words this teaching relies on: " + ", ".join(f"{gl[k]['term']} = {TERMS_TA[k]}" for k in used))
    if books:
        parts.append("IRV book names for the references here:\n" + "\n".join(f"- {b} → {BOOKS_TA[b]}" for b in books))
    parts.append("Bible passages on the page (BSB, for context; do not quote these English words in Tamil):\n"
                 + "\n".join(f"- {v['label']}: {v['text']}" for v in t["verses"]))
    parts.append(f"Translate both fields.\n\nmeaning (“What does this mean?”):\n{e['meaning']}\n\n"
                 f"support (“How do these passages support it?”):\n{e['support']}")
    return "\n\n".join(parts)


def translate_teachings(args):
    """Translate every teaching's meaning and support into Tamil (or only --ids), keeping the others."""
    gl = json.loads(GLOSSARY.read_text(encoding="utf8"))
    ex = english_explanations()
    data = json.load(open(DATA / "teachings.json", encoding="utf8"))
    want = {int(x) for x in args.ids.split(",")} if args.ids else None
    todo = [t for t in data["teachings"] if str(t["n"]) in ex and (not want or t["n"] in want)]
    if args.dry_run:
        t = todo[0]
        print(TRANSLATE_TEACHING, "\n\n=====\n\n", teaching_translate_prompt(t, ex[str(t["n"])], gl), sep="")
        print(f"\n[dry run: {len(todo)} teaching(s) would be translated into {OUT_TA}]")
        return
    client = anthropic.Anthropic()
    out = json.loads(OUT_TA.read_text(encoding="utf8")) if OUT_TA.exists() else {}

    def one(t):
        e = ex[str(t["n"])]
        try:
            res, c = call(client, TRANSLATE_TEACHING, teaching_translate_prompt(t, e, gl), TA_TEACHING_SCHEMA)
            # Keep the English this was made from, so a later edit to the English shows up as stale.
            res["en"] = {"meaning": e["meaning"], "support": e["support"]}
            return t["n"], res, c, None
        except Exception as err:  # report and carry on; rerun with --ids for the failures
            return t["n"], None, 0.0, repr(err)

    total, failed = 0.0, []
    with ThreadPoolExecutor(max_workers=6) as pool:
        for n, res, c, err in pool.map(one, todo):
            total += c
            if err:
                failed.append((n, err))
                print(f"{n}: FAILED {err}", flush=True)
            else:
                out[str(n)] = res
                print(f"{n}: ok (${c:.2f})", flush=True)
                # Write as we go, so an interrupted run keeps what it has done.
                OUT_TA.write_text(json.dumps(dict(sorted(out.items(), key=lambda kv: int(kv[0]))),
                                             ensure_ascii=False, indent=1), encoding="utf8")
    stale = [n for n, r in out.items() if n in ex and r.get("en") != {"meaning": ex[n]["meaning"], "support": ex[n]["support"]}]
    print(f"Wrote {len(out)} Tamil explanations to {OUT_TA}; cost ${total:.2f}; failed: {failed}")
    if stale:
        print(f"Out of date with the English (rerun with --ids {','.join(stale)}): {stale}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["glossary", "teachings", "translate", "translate-teachings"])
    ap.add_argument("--ids", default="")
    ap.add_argument("--dry-run", action="store_true", help="translate-teachings: print the prompt, call nothing")
    args = ap.parse_args()
    {"glossary": glossary, "teachings": teachings, "translate": translate,
     "translate-teachings": translate_teachings}[args.cmd](args)
