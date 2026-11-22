"""Rebuild every data file the web app embeds, from the corpus.

    python scripts/site/build_all.py

Writes data/: topics.json, verses.json, questions.json, teachings.json, books/<work-id>.json.
The Rust core crate embeds these files at compile time, so run this before building the app
whenever the corpus, the knowledge base or the topic answers change.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "scripts" / "site"
QA = ROOT / "corpus" / "qa"
DATA = ROOT / "data"
BSB = ROOT / "corpus" / "bible" / "bsb.txt"
RUN = 4


def run(script, *args):
    print(f"> {script}", flush=True)
    subprocess.run([sys.executable, "-I", str(SITE / script), *map(str, args)], check=True)


def main():
    DATA.mkdir(exist_ok=True)
    answers = QA / f"topic_answers_run{RUN}.json"
    tamil = QA / "topics.ta.json"
    run("build_topics_data.py", QA / f"kb_run{RUN}.json", DATA / "topics.json",
        answers if answers.exists() else "", *([tamil] if tamil.exists() else []))
    run("build_verses_data.py", QA / f"verse_map_run{RUN}.json", QA / f"kb_run{RUN}.json", DATA / "verses.json", BSB)
    scores = QA / f"question_scores_run{RUN}.json"
    run("build_questions_data.py", QA / f"questions_run{RUN}.json", QA / f"kb_run{RUN}.json", DATA / "questions.json",
        scores if scores.exists() else "", *([QA / "questions.ta.json"] if (QA / "questions.ta.json").exists() else []))
    run("build_books_data.py", ROOT / "corpus" / "trinity.db", DATA / "books")
    run("build_teachings_data.py", BSB, DATA / "topics.json", DATA / "teachings.json")


if __name__ == "__main__":
    main()
