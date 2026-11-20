//! Your edits to the AI-written text.
//!
//! `data/edits.json` maps a key such as `topic:1003:answer` to replacement text. It is compiled
//! in like the rest of the data, so a deployed build shows the edited text and cannot change it.
//! The local dev server calls [`set_edit`] to change an edit while you browse and then writes the
//! file back with [`edits_json`]. Only the fields named in [`Field`] can be edited: Bible text,
//! quotations and the books have no key at all.

use std::collections::BTreeMap;
use std::sync::{OnceLock, RwLock};

/// The AI-written fields that may be edited.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Field {
    /// A theme's description: `theme:<key>:desc`.
    ThemeDesc,
    /// A theme's one- or two-word label: `theme:<key>:short`.
    ThemeShort,
    /// The caption under a teaching's diagram: `teaching:<n>:caption`.
    TeachingCaption,
    /// The one- or two-line description under a teaching's title: `teaching:<n>:detail`.
    TeachingDetail,
    /// "What does this mean?" under a teaching: `teaching:<n>:meaning`.
    TeachingMeaning,
    /// "How these passages support it", above a teaching's verses: `teaching:<n>:support`.
    TeachingSupport,
    /// A glossary definition shown in the teachings' key words: `term:<key>:def`.
    TermDef,
    /// A topic's plain-language answer: `topic:<id>:answer`.
    TopicAnswer,
    /// "What earlier Christian writers thought": `topic:<id>:cmp`.
    TopicCompare,
    /// A question's wording: `question:<id>:text`.
    QuestionText,
    /// "Across the sources": `question:<id>:synthesis`.
    QuestionSynthesis,
    /// The summary of one writer's answer: `question:<id>:answer:<n>`.
    QuestionAnswer(usize),
}

/// A parsed edit key: which field of which item.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Key {
    pub item: String,
    pub field: Field,
}

impl Key {
    pub fn parse(key: &str) -> Option<Key> {
        let parts: Vec<&str> = key.split(':').collect();
        let field = match parts.as_slice() {
            ["theme", _, "desc"] => Field::ThemeDesc,
            ["theme", _, "short"] => Field::ThemeShort,
            ["teaching", _, "caption"] => Field::TeachingCaption,
            ["teaching", _, "detail"] => Field::TeachingDetail,
            ["teaching", _, "meaning"] => Field::TeachingMeaning,
            ["teaching", _, "support"] => Field::TeachingSupport,
            ["term", _, "def"] => Field::TermDef,
            ["topic", _, "answer"] => Field::TopicAnswer,
            ["topic", _, "cmp"] => Field::TopicCompare,
            ["question", _, "text"] => Field::QuestionText,
            ["question", _, "synthesis"] => Field::QuestionSynthesis,
            ["question", _, "answer", n] => Field::QuestionAnswer(n.parse().ok()?),
            _ => return None,
        };
        let item = parts[1];
        if item.is_empty() || !item.chars().all(|c| c.is_ascii_alphanumeric() || c == '-') {
            return None;
        }
        Some(Key { item: item.to_string(), field })
    }
}

fn store() -> &'static RwLock<BTreeMap<String, String>> {
    static CELL: OnceLock<RwLock<BTreeMap<String, String>>> = OnceLock::new();
    CELL.get_or_init(|| {
        let map = serde_json::from_slice(include_bytes!("../../../data/edits.json")).expect("data/edits.json is a JSON object of strings");
        RwLock::new(map)
    })
}

/// The edited text for `key`, if you have edited it.
pub fn get(key: &str) -> Option<String> {
    store().read().ok()?.get(key).cloned()
}

/// Replace `key`'s text (`Some`) or restore the original (`None`). The caller checks that the
/// key names something that exists (see `crate::set_edit`).
pub(crate) fn put(key: &str, value: Option<String>) {
    let mut map = store().write().expect("edits lock");
    match value {
        Some(v) => {
            map.insert(key.to_string(), v);
        }
        None => {
            map.remove(key);
        }
    }
}

/// All edits as the pretty-printed text of `data/edits.json`, keys sorted so diffs stay small.
pub fn edits_json() -> String {
    let map = store().read().expect("edits lock");
    let mut s = serde_json::to_string_pretty(&*map).expect("edits serialize");
    s.push('\n');
    s
}

/// How many edits there are.
pub fn count() -> usize {
    store().read().map(|m| m.len()).unwrap_or(0)
}
