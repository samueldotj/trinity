"""Find Bible references in plain text (for sources without ThML markup).

Handles "John 1:1", "Rev. 19:3-5", "Isa. xlv. 5", "John i. 1", "1 Cor. viii. 6".
Returns OSIS-style refs such as "John.1.1" or "Rev.19.3-Rev.19.5".
"""
import re

_BOOKS = {
    "Gen": ["Genesis", "Gen"], "Exod": ["Exodus", "Exod", "Ex"], "Lev": ["Leviticus", "Lev"],
    "Num": ["Numbers", "Num"], "Deut": ["Deuteronomy", "Deut", "Dt"], "Josh": ["Joshua", "Josh"],
    "Judg": ["Judges", "Judg"], "Ruth": ["Ruth"], "1Sam": ["1 Samuel", "1 Sam"], "2Sam": ["2 Samuel", "2 Sam"],
    "1Kgs": ["1 Kings", "1 Kgs", "1 Kin"], "2Kgs": ["2 Kings", "2 Kgs", "2 Kin"],
    "1Chr": ["1 Chronicles", "1 Chron", "1 Chr"], "2Chr": ["2 Chronicles", "2 Chron", "2 Chr"],
    "Ezra": ["Ezra"], "Neh": ["Nehemiah", "Neh"], "Esth": ["Esther", "Esth"], "Job": ["Job"],
    "Ps": ["Psalms", "Psalm", "Psa", "Ps"], "Prov": ["Proverbs", "Prov"], "Eccl": ["Ecclesiastes", "Eccles", "Eccl"],
    "Song": ["Song of Solomon", "Canticles", "Cant"], "Isa": ["Isaiah", "Isa"], "Jer": ["Jeremiah", "Jer"],
    "Lam": ["Lamentations", "Lam"], "Ezek": ["Ezekiel", "Ezek"], "Dan": ["Daniel", "Dan"], "Hos": ["Hosea", "Hos"],
    "Joel": ["Joel"], "Amos": ["Amos"], "Obad": ["Obadiah", "Obad"], "Jonah": ["Jonah"], "Mic": ["Micah", "Mic"],
    "Nah": ["Nahum", "Nah"], "Hab": ["Habakkuk", "Hab"], "Zeph": ["Zephaniah", "Zeph"], "Hag": ["Haggai", "Hag"],
    "Zech": ["Zechariah", "Zech"], "Mal": ["Malachi", "Mal"],
    "Matt": ["Matthew", "Matt", "Mat", "Mt"], "Mark": ["Mark", "Mk"], "Luke": ["Luke", "Lk"], "John": ["John", "Jn"],
    "Acts": ["Acts"], "Rom": ["Romans", "Rom"], "1Cor": ["1 Corinthians", "1 Cor"], "2Cor": ["2 Corinthians", "2 Cor"],
    "Gal": ["Galatians", "Gal"], "Eph": ["Ephesians", "Eph"], "Phil": ["Philippians", "Phil"],
    "Col": ["Colossians", "Col"], "1Thess": ["1 Thessalonians", "1 Thess"], "2Thess": ["2 Thessalonians", "2 Thess"],
    "1Tim": ["1 Timothy", "1 Tim"], "2Tim": ["2 Timothy", "2 Tim"], "Titus": ["Titus", "Tit"],
    "Phlm": ["Philemon", "Philem"], "Heb": ["Hebrews", "Heb"], "Jas": ["James", "Jas"],
    "1Pet": ["1 Peter", "1 Pet"], "2Pet": ["2 Peter", "2 Pet"], "1John": ["1 John", "1 Jn"], "2John": ["2 John"],
    "3John": ["3 John"], "Jude": ["Jude"], "Rev": ["Revelation", "Rev", "Apoc"],
}
_LOOKUP = {}
for osis, names in _BOOKS.items():
    for n in names:
        _LOOKUP[n.lower()] = osis
        if n[0] in "123":  # also "I Cor", "II Cor", "1Cor"
            roman = {"1": "I", "2": "II", "3": "III"}[n[0]]
            _LOOKUP[(roman + n[1:]).lower()] = osis
            _LOOKUP[n.replace(" ", "").lower()] = osis

_names = sorted(_LOOKUP, key=len, reverse=True)
_book_re = "|".join(re.escape(n).replace(r"\ ", r"\s?") for n in _names)
_ROMAN = r"[ivxlc]+"
REF_RE = re.compile(
    rf"\b(?P<book>{_book_re})\.?\s+"
    rf"(?:(?P<ch>\d{{1,3}})\s*[:.]\s*(?P<v>\d{{1,3}})|(?P<rch>{_ROMAN})\.\s*(?P<rv>\d{{1,3}}))"
    rf"(?:\s*[-–]\s*(?P<v2>\d{{1,3}})\b)?",
    re.IGNORECASE,
)


def _roman_to_int(s):
    vals = {"i": 1, "v": 5, "x": 10, "l": 50, "c": 100}
    total, prev = 0, 0
    for ch in reversed(s.lower()):
        v = vals[ch]
        total += -v if v < prev else v
        prev = max(prev, v)
    return total


def find_refs(text):
    """Yield (osis, matched_text) for each Bible reference found."""
    for m in REF_RE.finditer(text):
        book_txt = m.group("book")
        if not book_txt[0].isupper() and not book_txt[0].isdigit():
            continue  # avoid matching ordinary words like "job", "acts"
        osis_book = _LOOKUP.get(re.sub(r"\s+", " ", book_txt).lower()) or _LOOKUP.get(
            book_txt.replace(" ", "").lower())
        if not osis_book:
            continue
        if m.group("ch"):
            ch, v = int(m.group("ch")), int(m.group("v"))
        else:
            ch, v = _roman_to_int(m.group("rch")), int(m.group("rv"))
        if ch == 0 or ch > 150 or v == 0 or v > 176:
            continue
        osis = f"{osis_book}.{ch}.{v}"
        if m.group("v2") and int(m.group("v2")) > v:
            osis += f"-{osis_book}.{ch}.{int(m.group('v2'))}"
        yield osis, m.group(0)
