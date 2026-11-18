"""Shared settings and storage for the question-extraction pipeline."""
import re
import sqlite3
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "corpus"
CORPUS_DB = ROOT / "trinity.db"
QA_DB = ROOT / "questions.db"  # separate file so rebuilding the corpus never wipes AI output

MODEL = "claude-opus-5-5"
# USD per million tokens (standard API). Batch API is half of these.
PRICES = {"input": 4.00, "output": 20.00, "cache_write": 5.00, "cache_read": 0.20}

QA_SCHEMA = """
CREATE TABLE IF NOT EXISTS runs (id INTEGER PRIMARY KEY, created TEXT DEFAULT CURRENT_TIMESTAMP,
    label TEXT, mode TEXT, model TEXT, effort TEXT, batch_id TEXT, status TEXT, cost_usd REAL);
CREATE TABLE IF NOT EXISTS chunk_results (run_id INTEGER, chunk_id INTEGER, work_id TEXT, section_path TEXT,
    chunk_seq INTEGER, status TEXT, n_questions INTEGER, input_tokens INTEGER, output_tokens INTEGER,
    cache_read_tokens INTEGER, cache_write_tokens INTEGER, cost_usd REAL, error TEXT,
    PRIMARY KEY (run_id, chunk_id));
CREATE TABLE IF NOT EXISTS raw_questions (id INTEGER PRIMARY KEY, run_id INTEGER, chunk_id INTEGER,
    work_id TEXT, author TEXT, work_title TEXT, section_path TEXT, chunk_seq INTEGER,
    question TEXT, answer TEXT, category TEXT, raised_by TEXT, explicit INTEGER, importance TEXT,
    quote TEXT, quote_match TEXT, quote_score REAL, scripture TEXT);
CREATE TABLE IF NOT EXISTS canonical_questions (id INTEGER PRIMARY KEY, run_id INTEGER, question TEXT,
    category TEXT, synthesis TEXT, n_sources INTEGER, n_works INTEGER);
CREATE TABLE IF NOT EXISTS canonical_members (canonical_id INTEGER, raw_question_id INTEGER,
    PRIMARY KEY (canonical_id, raw_question_id));
CREATE TABLE IF NOT EXISTS topics (id INTEGER PRIMARY KEY, run_id INTEGER, title TEXT, description TEXT,
    n_questions INTEGER, n_works INTEGER);
CREATE TABLE IF NOT EXISTS topic_members (topic_id INTEGER, canonical_id INTEGER, seq INTEGER,
    PRIMARY KEY (topic_id, canonical_id));
CREATE TABLE IF NOT EXISTS themes (id INTEGER PRIMARY KEY, run_id INTEGER, seq INTEGER, key TEXT, title TEXT,
    description TEXT, n_topics INTEGER, n_questions INTEGER);
CREATE TABLE IF NOT EXISTS theme_topics (theme_id INTEGER, topic_id INTEGER, seq INTEGER,
    PRIMARY KEY (theme_id, topic_id));
"""


def qa_db():
    db = sqlite3.connect(QA_DB)
    db.row_factory = sqlite3.Row
    db.executescript(QA_SCHEMA)
    cols = {r[1] for r in db.execute("PRAGMA table_info(raw_questions)")}
    if "raised_by_detail" not in cols:  # added after the first pilot run
        db.execute("ALTER TABLE raw_questions ADD COLUMN raised_by_detail TEXT")
    topic_cols = {r[1] for r in db.execute("PRAGMA table_info(topics)")}
    if "comparison" not in topic_cols:
        db.execute("ALTER TABLE topics ADD COLUMN comparison TEXT")
    if "comparison_stale" not in topic_cols:  # 1 = merge added authors the note does not cover
        db.execute("ALTER TABLE topics ADD COLUMN comparison_stale INTEGER DEFAULT 0")
    return db


def corpus_db():
    db = sqlite3.connect(CORPUS_DB)
    db.row_factory = sqlite3.Row
    return db


def cost(usage, batch=False):
    """Dollar cost of one response's usage object."""
    c = (usage.input_tokens * PRICES["input"]
         + usage.output_tokens * PRICES["output"]
         + (usage.cache_creation_input_tokens or 0) * PRICES["cache_write"]
         + (usage.cache_read_input_tokens or 0) * PRICES["cache_read"]) / 1e6
    return c / 2 if batch else c


_QUOTES = str.maketrans({"‘": "'", "’": "'", "“": '"', "”": '"', "–": "-",
                         "—": "-", "…": "..."})


def norm(s):
    s = unicodedata.normalize("NFKC", s).translate(_QUOTES).lower()
    s = re.sub(r"\[\^\d+\]", "", s)  # footnote markers
    return re.sub(r"[^\w']+", " ", s).strip()
