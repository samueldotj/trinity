"""Turn eBible's Tamil Indian Revised Version (tam2017) into corpus/bible/irv.txt, laid out like bsb.txt.

    python scripts/build_irv.py path/to/tam2017_vpl.zip

Get the zip from https://ebible.org/Scriptures/tam2017_vpl.zip. The IRV is © 2017, 2019 Bridge Connectivity
Solutions, licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/); the site credits it
wherever Tamil verses are shown. Each output line is "<English book> <chapter>:<verse>\t<text>", with the
same English book names as bsb.txt, so the site scripts can look verses up the same way in both.
"""
import re
import sys
import zipfile
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "corpus" / "bible" / "irv.txt"

# eBible's BibleWorks book codes, in canonical order, and the names bsb.txt uses.
BOOKS = [
    ("GEN", "Genesis"), ("EXO", "Exodus"), ("LEV", "Leviticus"), ("NUM", "Numbers"), ("DEU", "Deuteronomy"),
    ("JOS", "Joshua"), ("JDG", "Judges"), ("RUT", "Ruth"), ("1SA", "1 Samuel"), ("2SA", "2 Samuel"),
    ("1KI", "1 Kings"), ("2KI", "2 Kings"), ("1CH", "1 Chronicles"), ("2CH", "2 Chronicles"), ("EZR", "Ezra"),
    ("NEH", "Nehemiah"), ("EST", "Esther"), ("JOB", "Job"), ("PSA", "Psalm"), ("PRO", "Proverbs"),
    ("ECC", "Ecclesiastes"), ("SOL", "Song of Solomon"), ("ISA", "Isaiah"), ("JER", "Jeremiah"),
    ("LAM", "Lamentations"), ("EZE", "Ezekiel"), ("DAN", "Daniel"), ("HOS", "Hosea"), ("JOE", "Joel"),
    ("AMO", "Amos"), ("OBA", "Obadiah"), ("JON", "Jonah"), ("MIC", "Micah"), ("NAH", "Nahum"),
    ("HAB", "Habakkuk"), ("ZEP", "Zephaniah"), ("HAG", "Haggai"), ("ZEC", "Zechariah"), ("MAL", "Malachi"),
    ("MAT", "Matthew"), ("MAR", "Mark"), ("LUK", "Luke"), ("JOH", "John"), ("ACT", "Acts"), ("ROM", "Romans"),
    ("1CO", "1 Corinthians"), ("2CO", "2 Corinthians"), ("GAL", "Galatians"), ("EPH", "Ephesians"),
    ("PHI", "Philippians"), ("COL", "Colossians"), ("1TH", "1 Thessalonians"), ("2TH", "2 Thessalonians"),
    ("1TI", "1 Timothy"), ("2TI", "2 Timothy"), ("TIT", "Titus"), ("PHM", "Philemon"), ("HEB", "Hebrews"),
    ("JAM", "James"), ("1PE", "1 Peter"), ("2PE", "2 Peter"), ("1JO", "1 John"), ("2JO", "2 John"),
    ("3JO", "3 John"), ("JUD", "Jude"), ("REV", "Revelation"),
]

HEADER = ("The Holy Bible, Indian Revised Version (IRV), Tamil. © 2017, 2019 Bridge Connectivity Solutions. "
          "Licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). From https://ebible.org/details.php?id=tam2017\n"
          "Converted to this layout by scripts/build_irv.py; the text is unchanged.\n"
          "Verse\tIndian Revised Version (Tamil)\n")


def main(zip_path):
    names = dict(BOOKS)
    lines = zipfile.ZipFile(zip_path).read("tam2017_vpl.txt").decode("utf-8-sig").splitlines()
    out, unknown = [], set()
    for line in lines:
        m = re.match(r"^(\w{3}) (\d+:\d+) (.*)$", line.strip())
        if not m:
            continue
        code, cv, text = m.groups()
        if code not in names:
            unknown.add(code)
            continue
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            out.append(f"{names[code]} {cv}\t{text}")
    if unknown:
        sys.exit(f"Unknown book codes {sorted(unknown)}; nothing written.")
    OUT.write_text(HEADER + "\n".join(out) + "\n", encoding="utf8", newline="\n")
    print(f"Wrote {len(out)} verses to {OUT}")


if __name__ == "__main__":
    main(sys.argv[1])
