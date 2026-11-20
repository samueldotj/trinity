//! Data and queries for the Trinity Explained app.
//!
//! The data files in `data/` (built by `scripts/site/build_all.py`) are compiled into the
//! binary and parsed on first use. [`handle`] answers every request the front end makes, so
//! the Vercel function and the Tauri desktop command share one implementation.

use serde_json::{Map, Value, json};
use std::collections::HashMap;
use std::sync::OnceLock;

pub mod edits;
pub use edits::{Field, Key, edits_json};

/// Query parameters of one request (already URL-decoded).
pub type Params = HashMap<String, String>;

/// Answer one API request. `route` names the query; `params` are its arguments.
pub fn handle(route: &str, params: &Params) -> Result<Value, String> {
    match route {
        "teachings" => Ok(teachings_with_edits()),
        "themes" => Ok(themes()),
        "theme" => theme(arg(params, "key")?),
        "topic" => find_topic(params),
        "verses" => Ok(verses(params)),
        "questions" => Ok(questions(params)),
        "question" => question(arg(params, "id")?),
        "books" => Ok(books()),
        "book" => book_toc(arg(params, "id")?),
        "section" => section(arg(params, "id")?, num(params, "sec", 0)),
        "find" => find_quote(arg(params, "id")?, params.get("quote").map(String::as_str).unwrap_or("")),
        // Deployed builds are read-only; the local dev server answers this route itself.
        "editing" => Ok(json!({ "enabled": false, "edits": edits::count() })),
        "" => Err("missing route".into()),
        other => Err(format!("unknown route: {other}")),
    }
}

fn arg<'a>(p: &'a Params, k: &str) -> Result<&'a str, String> {
    p.get(k).map(String::as_str).filter(|v| !v.is_empty()).ok_or_else(|| format!("missing parameter: {k}"))
}

fn num(p: &Params, k: &str, default: usize) -> usize {
    p.get(k).and_then(|v| v.parse().ok()).unwrap_or(default)
}

fn s(v: &Value) -> &str {
    v.as_str().unwrap_or("")
}

fn parse(bytes: &[u8]) -> Value {
    serde_json::from_slice(bytes).expect("embedded data is valid JSON")
}

/// Lowercase, drop footnote markers, keep only letters and digits separated by single spaces.
pub fn normalize(text: &str) -> String {
    let mut out = String::with_capacity(text.len());
    let mut chars = text.chars().peekable();
    let mut space = true;
    while let Some(c) = chars.next() {
        if c == '[' && chars.peek() == Some(&'^') {
            for d in chars.by_ref() {
                if d == ']' {
                    break;
                }
            }
            continue;
        }
        if c.is_alphanumeric() {
            out.extend(c.to_lowercase());
            space = false;
        } else if !space {
            out.push(' ');
            space = true;
        }
    }
    out.trim_end().to_string()
}

// ---------- embedded data ----------

macro_rules! dataset {
    ($name:ident, $path:literal) => {
        fn $name() -> &'static Value {
            static CELL: OnceLock<Value> = OnceLock::new();
            CELL.get_or_init(|| parse(include_bytes!(concat!("../../../data/", $path))))
        }
    };
}

dataset!(teachings, "teachings.json");
dataset!(topics_data, "topics.json");
dataset!(verses_data, "verses.json");
dataset!(questions_data, "questions.json");

/// Short one- or two-word labels for the 26 themes, keyed by theme key.
const SHORT_LABELS: &[(&str, &str)] = &[
    ("method-faith-reason", "Faith & Reason"),
    ("knowing-god", "Knowing God"),
    ("divine-names-language", "Divine Names"),
    ("divine-nature-attributes", "God’s Nature"),
    ("one-god-three-persons", "One God"),
    ("persons-and-essence", "Three Persons"),
    ("the-father", "The Father"),
    ("eternal-generation", "Begotten Son"),
    ("son-eternity", "Eternal Son"),
    ("son-deity", "Son’s Deity"),
    ("son-equality", "Son’s Equality"),
    ("son-titles-images", "Word & Wisdom"),
    ("son-creator", "Creator Son"),
    ("spirit-deity-personhood", "Spirit’s Deity"),
    ("spirit-procession-mission", "Spirit’s Procession"),
    ("inseparable-operations", "One Work"),
    ("old-testament-revelation", "Old Testament"),
    ("incarnation-person-of-christ", "Incarnation"),
    ("redemption-mediation", "Redemption"),
    ("worship-and-honour", "Worship"),
    ("communion-with-god", "Communion"),
    ("image-of-trinity-in-mind", "God’s Image"),
    ("key-new-testament-texts", "New Testament"),
    ("controversies-and-fathers", "Early Church"),
    ("one-creator-against-gnostics", "One Creator"),
    ("related-questions", "Related"),
];
const RELATED_KEY: &str = "related-questions";

fn builtin_label(key: &str) -> Option<&'static str> {
    SHORT_LABELS.iter().find(|(k, _)| *k == key).map(|(_, v)| *v)
}

/// The label to show for a theme: your edit if you made one, else the built-in label.
fn short_label(key: &str) -> String {
    edits::get(&format!("theme:{key}:short")).unwrap_or_else(|| builtin_label(key).unwrap_or("").to_string())
}

fn theme_list() -> &'static [Value] {
    topics_data().as_array().map(Vec::as_slice).unwrap_or(&[])
}

// ---------- topics ----------

fn themes() -> Value {
    let list: Vec<Value> = theme_list()
        .iter()
        .map(|th| {
            let topics = th["topics"].as_array().map(Vec::as_slice).unwrap_or(&[]);
            let q: u64 = topics.iter().map(|t| t["q"].as_u64().unwrap_or(0)).sum();
            let key = s(&th["key"]);
            let (desc, _) = overlay(format!("theme:{key}:desc"), &th["desc"]);
            json!({
                "key": key, "title": th["title"], "short": short_label(key),
                "desc": desc, "n": topics.len(), "q": q,
            })
        })
        .collect();
    Value::Array(list)
}

fn theme(key: &str) -> Result<Value, String> {
    let th = theme_list().iter().find(|t| s(&t["key"]) == key).ok_or("no such theme")?;
    let mut out = th.clone();
    out["short"] = json!(short_label(key));
    let (desc, desc_edited) = overlay(format!("theme:{key}:desc"), &th["desc"]);
    out["desc"] = desc;
    out["edited"] = json!({ "desc": desc_edited, "short": edits::get(&format!("theme:{key}:short")).is_some() });
    for t in out["topics"].as_array_mut().into_iter().flatten() {
        let id = t["id"].as_u64().unwrap_or(0);
        let mut answer_edited = false;
        if t["ans"].is_object() {
            let (text, e) = overlay(format!("topic:{id}:answer"), &t["ans"]["text"]);
            t["ans"]["text"] = text;
            answer_edited = e;
        }
        let (cmp, cmp_edited) = overlay(format!("topic:{id}:cmp"), &t["cmp"]);
        t["cmp"] = cmp;
        t["edited"] = json!({ "answer": answer_edited, "cmp": cmp_edited });
    }
    Ok(out)
}

fn find_topic(p: &Params) -> Result<Value, String> {
    let id: Option<u64> = p.get("id").and_then(|v| v.parse().ok());
    let title = p.get("title").map(|t| normalize(t)).unwrap_or_default();
    for th in theme_list() {
        for t in th["topics"].as_array().into_iter().flatten() {
            let hit = id.is_some_and(|i| t["id"].as_u64() == Some(i))
                || (!title.is_empty() && normalize(s(&t["title"])) == title);
            if hit {
                return Ok(json!({ "theme": th["key"], "topic": t["id"] }));
            }
        }
    }
    Err("no such topic".into())
}

// ---------- Bible passages ----------

fn verses(p: &Params) -> Value {
    let d = verses_data();
    let books = d["books"].as_array().map(Vec::as_slice).unwrap_or(&[]);
    let testament = d["testament"].as_array().map(Vec::as_slice).unwrap_or(&[]);
    let themes = d["themes"].as_array().map(Vec::as_slice).unwrap_or(&[]);
    let topics = &d["topics"];
    let keys: Vec<&str> = theme_list().iter().map(|t| s(&t["key"])).collect();
    let related = keys.iter().position(|k| *k == RELATED_KEY);

    let f = p.get("testament").map(String::as_str).unwrap_or("all");
    let book = p.get("book").map(String::as_str).unwrap_or("");
    let needle = p.get("q").map(|q| q.trim().to_lowercase()).unwrap_or_default();
    let exact = p.get("exact").map(|e| normalize_ref(e)).unwrap_or_default();
    let sort = p.get("sort").map(String::as_str).unwrap_or("uses");
    let offset = num(p, "offset", 0);
    let limit = num(p, "limit", 30).min(200);

    let book_of = |v: &Value| v[1].as_u64().unwrap_or(0) as usize;
    let test_of = |i: usize| testament.get(i).map(s).unwrap_or("ot");
    let all: Vec<&Value> = d["verses"]
        .as_array()
        .into_iter()
        .flatten()
        .filter(|v| test_of(book_of(v)) != "ap")
        .collect();

    let mut list: Vec<&Value> = if !exact.is_empty() {
        let hits: Vec<&Value> = all.iter().copied().filter(|v| s(&v[0]) == exact).collect();
        if hits.is_empty() { all.iter().copied().filter(|v| s(&v[0]).starts_with(&exact)).collect() } else { hits }
    } else {
        all.iter()
            .copied()
            .filter(|v| f == "all" || test_of(book_of(v)) == f)
            .filter(|v| book.is_empty() || books.get(book_of(v)).map(s) == Some(book))
            .filter(|v| needle.is_empty() || s(&v[0]).to_lowercase().starts_with(&needle))
            .collect()
    };
    if sort == "uses" {
        list.sort_by_key(|v| (std::cmp::Reverse(v[2].as_u64().unwrap_or(0)), v[5].as_u64().unwrap_or(0)));
    }

    let items: Vec<Value> = list
        .iter()
        .skip(offset)
        .take(limit)
        .map(|v| {
            let ids: Vec<String> = v[4]
                .as_array()
                .into_iter()
                .flatten()
                .map(|i| i.as_u64().map(|n| n.to_string()).unwrap_or_default())
                .collect();
            let mut theme_ix: Vec<usize> = Vec::new();
            let topic_list: Vec<Value> = ids
                .iter()
                .filter_map(|id| {
                    let t = &topics[id.as_str()];
                    let th = t[1].as_u64()? as usize;
                    if Some(th) != related && !theme_ix.contains(&th) {
                        theme_ix.push(th);
                    }
                    Some(json!({ "id": id.parse::<u64>().unwrap_or(0), "title": t[0] }))
                })
                .collect();
            let theme_tags: Vec<Value> = theme_ix
                .iter()
                .map(|&i| {
                    let key = keys.get(i).copied().unwrap_or("");
                    json!({ "key": key, "label": short_label(key), "full": themes.get(i).cloned().unwrap_or(Value::Null) })
                })
                .collect();
            json!({ "ref": v[0], "uses": v[2], "text": v[6], "themes": theme_tags, "topics": topic_list })
        })
        .collect();

    let book_names: Vec<&Value> = books
        .iter()
        .enumerate()
        .filter(|(i, _)| test_of(*i) != "ap" && (f == "all" || test_of(*i) == f))
        .map(|(_, b)| b)
        .collect();
    json!({ "total": list.len(), "offset": offset, "items": items, "books": book_names })
}

/// Map common reference spellings onto the verse list's ("Psalm 2:7" -> "Psalms 2:7"); drop ranges.
fn normalize_ref(r: &str) -> String {
    let r = r.split(['-', '–']).next().unwrap_or("").trim();
    if let Some(rest) = r.strip_prefix("Psalm ") {
        return format!("Psalms {rest}");
    }
    if let Some(rest) = r.strip_prefix("Song of Songs ") {
        return format!("Song of Solomon {rest}");
    }
    r.to_string()
}

// ---------- questions and answers ----------

fn question_texts() -> &'static Vec<String> {
    static CELL: OnceLock<Vec<String>> = OnceLock::new();
    CELL.get_or_init(|| {
        questions_data()["q"].as_array().into_iter().flatten().map(|x| s(&x[1]).to_lowercase()).collect()
    })
}

fn questions(p: &Params) -> Value {
    let d = questions_data();
    let authors = d["authors"].as_array().map(Vec::as_slice).unwrap_or(&[]);
    let themes = d["themes"].as_array().map(Vec::as_slice).unwrap_or(&[]);
    let topics = d["topics"].as_array().map(Vec::as_slice).unwrap_or(&[]);
    let cats = d["cats"].as_array().map(Vec::as_slice).unwrap_or(&[]);
    let index = d["q"].as_array().map(Vec::as_slice).unwrap_or(&[]);
    let texts = question_texts();

    let words: Vec<String> = p.get("q").map(|q| q.to_lowercase()).unwrap_or_default()
        .split_whitespace().map(String::from).collect();
    let opt = |k: &str| p.get(k).and_then(|v| v.parse::<u64>().ok());
    let (theme, writer, cat) = (opt("theme"), opt("writer"), opt("cat"));
    let topic_ix = p.get("topic").filter(|t| !t.is_empty()).and_then(|t| {
        let want = normalize(t);
        topics.iter().position(|x| normalize(s(x)) == want)
    });
    let sort = p.get("sort").map(String::as_str).unwrap_or("many");
    let offset = num(p, "offset", 0);
    let limit = num(p, "limit", 25).min(200);

    let mut list: Vec<(usize, &Value)> = index
        .iter()
        .enumerate()
        .filter(|(_, x)| topic_ix.is_none_or(|t| x[4].as_u64() == Some(t as u64)))
        .filter(|(_, x)| theme.is_none_or(|t| x[3].as_u64() == Some(t)))
        .filter(|(_, x)| cat.is_none_or(|c| x[2].as_u64() == Some(c)))
        .filter(|(_, x)| writer.is_none_or(|w| x[5].as_array().is_some_and(|a| a.iter().any(|i| i.as_u64() == Some(w)))))
        .filter(|(i, _)| words.iter().all(|w| texts[*i].contains(w.as_str())))
        .collect();
    let nwriters = |x: &Value| x[5].as_array().map_or(0, Vec::len);
    if sort == "many" {
        list.sort_by_key(|(_, x)| (std::cmp::Reverse(nwriters(x)), x[3].as_u64(), x[4].as_u64()));
    } else {
        list.sort_by_key(|(_, x)| (x[3].as_u64(), x[4].as_u64()));
    }

    let name = |v: &[Value], i: &Value| i.as_u64().and_then(|n| v.get(n as usize)).cloned().unwrap_or(Value::Null);
    let items: Vec<Value> = list
        .iter()
        .skip(offset)
        .take(limit)
        .map(|(_, x)| {
            let writers: Vec<Value> = x[5].as_array().into_iter().flatten().map(|i| name(authors, i)).collect();
            let (text, _) = overlay(format!("question:{}:text", x[0]), &x[1]);
            json!({
                "id": x[0], "question": text, "cat": name(cats, &x[2]), "theme": name(themes, &x[3]),
                "topic": name(topics, &x[4]), "writers": writers,
            })
        })
        .collect();
    let mut writers: Vec<(usize, &str)> = authors.iter().enumerate().map(|(i, a)| (i, s(a))).collect();
    writers.sort_by_key(|(_, a)| *a);
    json!({
        "total": list.len(), "offset": offset, "items": items,
        "topicName": topic_ix.map(|t| topics[t].clone()),
        "themes": themes, "cats": cats,
        "writers": writers.iter().map(|(i, a)| json!({ "id": i, "name": a })).collect::<Vec<_>>(),
    })
}

fn question(id: &str) -> Result<Value, String> {
    let d = questions_data();
    let det = d["details"].get(id).ok_or("no such question")?;
    let authors = d["authors"].as_array().map(Vec::as_slice).unwrap_or(&[]);
    let mut answers_edited = Vec::new();
    let answers: Vec<Value> = det["a"]
        .as_array()
        .into_iter()
        .flatten()
        .enumerate()
        .map(|(n, a)| {
            let author = a[0].as_u64().and_then(|i| authors.get(i as usize)).cloned().unwrap_or(Value::Null);
            let (answer, e) = overlay(format!("question:{id}:answer:{n}"), &a[3]);
            answers_edited.push(e);
            json!({ "author": author, "work": a[1], "place": a[2], "answer": answer, "quote": a[4], "scripture": a[5], "workId": a[6] })
        })
        .collect();
    let text = d["q"].as_array().and_then(|q| q.iter().find(|x| x[0].to_string() == id)).map(|x| x[1].clone()).unwrap_or(Value::Null);
    let (text, text_edited) = overlay(format!("question:{id}:text"), &text);
    let (synthesis, syn_edited) = overlay(format!("question:{id}:synthesis"), &det["s"]);
    Ok(json!({ "id": id, "question": text, "synthesis": synthesis, "answers": answers,
               "edited": { "text": text_edited, "synthesis": syn_edited, "answers": answers_edited } }))
}

// ---------- edits ----------

/// The teachings and glossary, with your edits laid over the generated text.
fn teachings_with_edits() -> Value {
    let mut out = teachings().clone();
    for t in out["teachings"].as_array_mut().into_iter().flatten() {
        let n = t["n"].as_u64().unwrap_or(0);
        let mut edited = serde_json::Map::new();
        for (field, name) in [("cap", "caption"), ("detail", "detail"), ("meaning", "meaning"), ("support", "support")] {
            if t.get(field).is_none() {
                continue;
            }
            let (text, was_edited) = overlay(format!("teaching:{n}:{name}"), &t[field]);
            t[field] = text;
            edited.insert(name.to_string(), json!(was_edited));
        }
        t["edited"] = Value::Object(edited);
    }
    if let Some(gl) = out.get_mut("glossary").and_then(Value::as_object_mut) {
        for (key, entry) in gl.iter_mut() {
            let (def, was_edited) = overlay(format!("term:{key}:def"), &entry["def"]);
            entry["def"] = def;
            entry["edited"] = json!(was_edited);
        }
    }
    out
}

/// The text to show for `key`: your edit if there is one, else the original. The flag says which.
fn overlay(key: String, original: &Value) -> (Value, bool) {
    match edits::get(&key) {
        Some(text) => (json!(text), true),
        None => (original.clone(), false),
    }
}

fn topic_by_id(id: u64) -> Option<&'static Value> {
    theme_list().iter().flat_map(|th| th["topics"].as_array().into_iter().flatten()).find(|t| t["id"].as_u64() == Some(id))
}

/// The generated (unedited) text for an edit key, or `None` if the key names nothing editable.
pub fn original(key: &str) -> Option<String> {
    let k = Key::parse(key)?;
    let text = match k.field {
        Field::ThemeDesc => theme_list().iter().find(|t| s(&t["key"]) == k.item)?["desc"].clone(),
        Field::ThemeShort => json!(builtin_label(&k.item)?),
        Field::TeachingCaption | Field::TeachingDetail | Field::TeachingMeaning | Field::TeachingSupport => {
            let n: u64 = k.item.parse().ok()?;
            let field = match k.field {
                Field::TeachingCaption => "cap",
                Field::TeachingDetail => "detail",
                Field::TeachingMeaning => "meaning",
                _ => "support",
            };
            teachings()["teachings"].as_array()?.iter().find(|t| t["n"].as_u64() == Some(n))?.get(field)?.clone()
        }
        Field::TermDef => teachings()["glossary"].get(&k.item)?["def"].clone(),
        Field::TopicAnswer => topic_by_id(k.item.parse().ok()?)?["ans"].get("text")?.clone(),
        Field::TopicCompare => topic_by_id(k.item.parse().ok()?)?["cmp"].clone(),
        Field::QuestionText => questions_data()["q"].as_array()?.iter().find(|x| x[0].to_string() == k.item)?[1].clone(),
        Field::QuestionSynthesis => questions_data()["details"].get(&k.item)?["s"].clone(),
        Field::QuestionAnswer(n) => questions_data()["details"].get(&k.item)?["a"].get(n)?[3].clone(),
    };
    text.as_str().map(String::from)
}

/// Change the text for `key`, or restore the original with `None`. Saving text equal to the
/// original also restores it. Refuses keys that do not name an editable AI-written field.
pub fn set_edit(key: &str, value: Option<&str>) -> Result<(), String> {
    let orig = original(key).ok_or_else(|| format!("not an editable field: {key}"))?;
    match value.map(str::trim) {
        Some("") => Err("the text cannot be empty; use Restore original instead".into()),
        Some(v) if v.chars().count() > 30_000 => Err("the text is too long".into()),
        Some(v) if matches!(Key::parse(key).map(|k| k.field), Some(Field::ThemeShort)) && v.chars().count() > 30 => {
            Err("a theme label must be at most 30 characters".into())
        }
        Some(v) if v == orig.trim() => {
            edits::put(key, None);
            Ok(())
        }
        Some(v) => {
            edits::put(key, Some(v.to_string()));
            Ok(())
        }
        None => {
            edits::put(key, None);
            Ok(())
        }
    }
}

// ---------- books ----------

const BOOK_IDS: &[&str] = &[
    "irenaeus-against-heresies", "hippolytus-against-noetus", "novatian-on-the-trinity",
    "athanasius-against-arians", "hilary-on-the-trinity", "basil-on-the-holy-spirit",
    "gregory-nyssa-not-three-gods", "gregory-nyssa-against-eunomius", "ambrose-on-the-holy-spirit",
    "augustine-on-the-trinity", "owen-communion-with-god", "owen-brief-declaration-trinity",
    "waterland-vindication", "edwards-essay-on-the-trinity", "bickersteth-rock-of-ages",
    "warfield-biblical-doctrine-trinity",
];

fn book_bytes(id: &str) -> Option<&'static [u8]> {
    macro_rules! books {
        ($($id:literal),*) => {
            match id { $($id => Some(include_bytes!(concat!("../../../data/books/", $id, ".json")) as &[u8]),)* _ => None }
        };
    }
    books!(
        "irenaeus-against-heresies", "hippolytus-against-noetus", "novatian-on-the-trinity",
        "athanasius-against-arians", "hilary-on-the-trinity", "basil-on-the-holy-spirit",
        "gregory-nyssa-not-three-gods", "gregory-nyssa-against-eunomius", "ambrose-on-the-holy-spirit",
        "augustine-on-the-trinity", "owen-communion-with-god", "owen-brief-declaration-trinity",
        "waterland-vindication", "edwards-essay-on-the-trinity", "bickersteth-rock-of-ages",
        "warfield-biblical-doctrine-trinity"
    )
}

struct Book {
    data: Value,
    norms: Vec<Vec<String>>,
}

fn book(id: &str) -> Option<&'static Book> {
    static CELLS: OnceLock<Vec<OnceLock<Book>>> = OnceLock::new();
    let cells = CELLS.get_or_init(|| BOOK_IDS.iter().map(|_| OnceLock::new()).collect());
    let ix = BOOK_IDS.iter().position(|b| *b == id)?;
    Some(cells[ix].get_or_init(|| {
        let data = parse(book_bytes(id).expect("book is embedded"));
        let norms = data["sections"]
            .as_array()
            .into_iter()
            .flatten()
            .map(|sec| sec["p"].as_array().into_iter().flatten().map(|p| normalize(s(p))).collect())
            .collect();
        Book { data, norms }
    }))
}

fn books() -> Value {
    let list: Vec<Value> = BOOK_IDS
        .iter()
        .filter_map(|id| book(id))
        .map(|b| {
            let d = &b.data;
            json!({ "id": d["id"], "title": d["title"], "author": d["author"], "date": d["date"],
                    "sections": d["sections"].as_array().map_or(0, Vec::len) })
        })
        .collect();
    Value::Array(list)
}

fn book_toc(id: &str) -> Result<Value, String> {
    let b = book(id).ok_or("no such book")?;
    let d = &b.data;
    let toc: Vec<Value> = d["sections"]
        .as_array()
        .into_iter()
        .flatten()
        .map(|sec| json!({ "t": sec["t"], "d": sec["d"], "r": sec["r"] }))
        .collect();
    let mut meta = Map::new();
    for k in ["id", "title", "author", "date", "translator", "edition", "source"] {
        meta.insert(k.into(), d[k].clone());
    }
    meta.insert("toc".into(), Value::Array(toc));
    Ok(Value::Object(meta))
}

fn section(id: &str, sec: usize) -> Result<Value, String> {
    let b = book(id).ok_or("no such book")?;
    let s = b.data["sections"].get(sec).ok_or("no such section")?;
    Ok(json!({ "id": id, "sec": sec, "t": s["t"], "c": s["c"], "d": s["d"], "r": s["r"], "p": s["p"], "n": s["n"] }))
}

/// Find the section and paragraph holding a quotation, trying shorter openings of it in turn.
fn find_quote(id: &str, quote: &str) -> Result<Value, String> {
    let b = book(id).ok_or("no such book")?;
    let q = normalize(quote);
    for len in [80usize, 40, 24] {
        let probe: String = q.chars().take(len).collect();
        let probe = probe.trim();
        if probe.chars().count() < 12 {
            continue;
        }
        for (si, sec) in b.norms.iter().enumerate() {
            if let Some(pi) = sec.iter().position(|p| p.contains(probe)) {
                return Ok(json!({ "found": true, "sec": si, "para": pi }));
            }
        }
    }
    let first = b.data["sections"]
        .as_array()
        .and_then(|a| a.iter().position(|s| s["r"] == "primary" && s["p"].as_array().is_some_and(|p| !p.is_empty())))
        .unwrap_or(0);
    Ok(json!({ "found": false, "sec": first, "para": Value::Null }))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn p(pairs: &[(&str, &str)]) -> Params {
        pairs.iter().map(|(k, v)| (k.to_string(), v.to_string())).collect()
    }

    #[test]
    fn every_route_answers() {
        assert_eq!(handle("teachings", &p(&[])).unwrap()["teachings"].as_array().unwrap().len(), 46);
        assert_eq!(handle("themes", &p(&[])).unwrap().as_array().unwrap().len(), 26);
        assert!(handle("theme", &p(&[("key", "one-god-three-persons")])).unwrap()["topics"].is_array());
        assert_eq!(handle("topic", &p(&[("id", "1003")])).unwrap()["theme"], "one-god-three-persons");
        let v = handle("verses", &p(&[("exact", "John 10:30")])).unwrap();
        assert_eq!(v["items"][0]["ref"], "John 10:30");
        assert_eq!(handle("verses", &p(&[("exact", "Psalm 2:7")])).unwrap()["items"][0]["ref"], "Psalms 2:7");
        let q = handle("questions", &p(&[("q", "Father one"), ("limit", "3")])).unwrap();
        assert!(q["total"].as_u64().unwrap() > 0);
        assert!(handle("question", &p(&[("id", "505")])).unwrap()["answers"].is_array());
        assert_eq!(handle("books", &p(&[])).unwrap().as_array().unwrap().len(), 16);
        let f = handle("find", &p(&[("id", "gregory-nyssa-not-three-gods"),
            ("quote", "issuing from the Father as from a spring")])).unwrap();
        assert_eq!(f["found"], true);
        assert!(handle("section", &p(&[("id", "augustine-on-the-trinity"), ("sec", "4")])).unwrap()["p"].is_array());
        assert!(handle("nope", &p(&[])).is_err());
    }

    #[test]
    fn deuterocanon_and_related_are_hidden() {
        let v = handle("verses", &p(&[("limit", "200")])).unwrap();
        assert!(!v["books"].as_array().unwrap().iter().any(|b| b == "Sirach"));
        for item in v["items"].as_array().unwrap() {
            assert!(!item["themes"].as_array().unwrap().iter().any(|t| t["key"] == RELATED_KEY));
        }
    }

    #[test]
    fn edits_only_touch_ai_text() {
        assert!(set_edit("topic:1003:answer", Some("My own answer.")).is_ok());
        let th = handle("theme", &p(&[("key", "one-god-three-persons")])).unwrap();
        let t = th["topics"].as_array().unwrap().iter().find(|t| t["id"] == 1003).unwrap();
        assert_eq!(t["ans"]["text"], "My own answer.");
        assert_eq!(t["edited"]["answer"], true);
        assert!(edits_json().contains("topic:1003:answer"));
        assert!(set_edit("topic:1003:answer", None).is_ok());
        assert!(!edits_json().contains("topic:1003:answer"));
        // Text equal to the original restores it.
        let orig = original("question:505:synthesis").unwrap();
        set_edit("question:505:synthesis", Some(&orig)).unwrap();
        assert!(!edits_json().contains("question:505"));
        // Bible text, quotations, books and unknown items have no key.
        for bad in ["verse:John 1:1:text", "topic:1003:quote", "book:augustine:text", "topic:999999:answer",
                    "question:505:answer:99", "theme:../x:desc", "topic:1003:answer:extra"] {
            assert!(set_edit(bad, Some("x")).is_err(), "{bad} should be refused");
        }
        assert!(set_edit("topic:1003:cmp", Some("  ")).is_err());

        // Theme labels and diagram captions.
        set_edit("theme:one-god-three-persons:short", Some("The One God")).unwrap();
        let themes = handle("themes", &p(&[])).unwrap();
        assert!(themes.as_array().unwrap().iter().any(|t| t["short"] == "The One God"));
        assert!(set_edit("theme:one-god-three-persons:short", Some("a label that is far too long to fit")).is_err());
        set_edit("theme:one-god-three-persons:short", None).unwrap();
        set_edit("teaching:23:caption", Some("My caption.")).unwrap();
        let t = handle("teachings", &p(&[])).unwrap();
        assert_eq!(t["teachings"][22]["cap"], "My caption.");
        assert_eq!(t["teachings"][22]["edited"]["caption"], true);
        set_edit("teaching:23:caption", None).unwrap();
        set_edit("teaching:10:detail", Some("My description.")).unwrap();
        let t = handle("teachings", &p(&[])).unwrap();
        assert_eq!(t["teachings"][9]["detail"], "My description.");
        assert_eq!(t["teachings"][9]["edited"]["detail"], true);
        set_edit("teaching:10:detail", None).unwrap();
        assert!(handle("teachings", &p(&[])).unwrap()["teachings"].as_array().unwrap().iter().all(|t| t["detail"] != ""));
        assert!(set_edit("teaching:99:caption", Some("x")).is_err());
        set_edit("teaching:21:meaning", Some("My meaning.")).unwrap();
        set_edit("teaching:21:support", Some("My support.")).unwrap();
        set_edit("term:person:def", Some("My definition.")).unwrap();
        let t = handle("teachings", &p(&[])).unwrap();
        assert_eq!(t["teachings"][20]["meaning"], "My meaning.");
        assert_eq!(t["teachings"][20]["edited"]["support"], true);
        assert_eq!(t["glossary"]["person"]["def"], "My definition.");
        assert_eq!(t["glossary"]["person"]["edited"], true);
        set_edit("teaching:21:meaning", None).unwrap();
        set_edit("teaching:21:support", None).unwrap();
        set_edit("term:person:def", None).unwrap();
        assert!(handle("teachings", &p(&[])).unwrap()["teachings"].as_array().unwrap().iter().all(|t| t["meaning"] != ""));
        assert!(set_edit("term:no-such-term:def", Some("x")).is_err());
        assert!(set_edit("theme:no-such-theme:short", Some("x")).is_err());
    }

    #[test]
    fn normalize_strips_markers() {
        assert_eq!(normalize("God’s Word[^12], “one”!"), "god s word one");
    }
}
