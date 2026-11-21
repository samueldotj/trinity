"""Build the 46 Explanations teachings: user's list + BSB verse text + a matched writers' topic and quote."""
import json, re, sys
from pathlib import Path

bsb_path, topics_path, out_path = sys.argv[1:4]

bsb = {}
for line in open(bsb_path, encoding='utf-8-sig'):
    m = re.match(r'^(.+? \d+:\d+)\t(.*?)\s*$', line)
    if m:
        bsb[m.group(1)] = m.group(2)

ABBR = {'Gen.': 'Genesis', 'Deut.': 'Deuteronomy', 'Ps.': 'Psalm', 'Isa.': 'Isaiah', 'Jer.': 'Jeremiah',
        'Mal.': 'Malachi', 'Matt.': 'Matthew', 'Luke': 'Luke', 'John': 'John', 'Acts': 'Acts',
        '1 Cor.': '1 Corinthians', '2 Cor.': '2 Corinthians', 'Gal.': 'Galatians', 'Eph.': 'Ephesians',
        'Phil.': 'Philippians', 'Col.': 'Colossians', '1 Tim.': '1 Timothy', 'Heb.': 'Hebrews',
        'James': 'James', '1 Pet.': '1 Peter', 'Rev.': 'Revelation'}
MAP_BOOK = {'Psalm': 'Psalms'}  # verse map spelling
MAX_VERSES = 5


def parse_refs(s):
    out, book = [], None
    for piece in [p.strip() for p in s.split(';')]:
        m = re.match(r'^((?:\d )?[A-Z][a-z]+\.?)\s+(.*)$', piece)
        if m and m.group(1) in ABBR:
            book, rest = ABBR[m.group(1)], m.group(2)
        else:
            rest = piece
        label_book = book
        verses, chapter = [], None
        for part in [p.strip() for p in rest.split(',')]:
            if ':' in part:
                chapter, vs = part.split(':')
            else:
                vs = part
            a, _, b = vs.partition('–')
            a, b = int(a), int(b or a)
            verses += [(int(chapter), v) for v in range(a, b + 1)]
        texts = [bsb.get('%s %d:%d' % (book, c, v), '') for c, v in verses]
        missing = [f'{book} {c}:{v}' for (c, v), t in zip(verses, texts) if not t]
        text = ' '.join(texts[:MAX_VERSES]) + (' …' if len(texts) > MAX_VERSES else '')
        out.append({'label': f'{label_book} {rest}', 'text': text,
                    'ref': f'{MAP_BOOK.get(book, book)} {verses[0][0]}:{verses[0][1]}', 'missing': missing})
    return out


GROUPS = [
    ('The Nature of God', ''),
    ('The Three Divine Persons', ''),
    ('Relationships Within the Trinity', 'The terms eternal generation, procession, perichoresis, and inseparable operations are theological formulations that explain the combined biblical witness.'),
    ('How God Reveals Himself', ''),
    ('The Incarnation and the Trinity', ''),
]

# (group, short label, statement, detail, refs, topic id, diagram mode, notes [Father, Son, Spirit, centre])
T = [
    (0, 'God is One', 'God is One', 'There is only one true God, not three Gods.', 'Deut. 6:4; Isa. 45:5; 1 Cor. 8:4', 1003, 'one', ['is God', 'is God', 'is God', 'one']),
    (0, 'God is Spirit', 'God is Spirit', 'God is not inherently a material or bodily being.', 'John 4:24; Luke 24:39', 538, 'one', ['', '', '', 'Spirit']),
    (0, 'Eternal', 'God is Eternal', 'God has no beginning or end.', 'Ps. 90:2; Rev. 1:8', 232, 'one', ['', '', '', 'eternal']),
    (0, 'Uncreated', 'God is Uncreated', 'God exists independently of creation.', 'Acts 17:24–25; John 1:3', 183, 'one', ['', '', '', 'uncreated']),
    (0, 'Immutable', 'God is Immutable', 'God’s divine nature does not change.', 'Mal. 3:6; James 1:17', 228, 'one', ['', '', '', 'unchanging']),
    (0, 'Invisible', 'God is Invisible', 'The divine essence cannot be seen by physical eyes.', '1 Tim. 1:17; John 1:18', 1054, 'one', ['', '', '', 'invisible']),
    (0, 'Omnipresent', 'God is Omnipresent', 'God is not limited by physical space.', 'Ps. 139:7–10; Jer. 23:24', 729, 'one', ['', '', '', 'everywhere']),
    (0, 'Indivisible', 'God is Indivisible', 'God’s essence is not divided into parts.', 'Deut. 6:4; John 10:30', 995, 'one', ['', '', '', 'no parts']),
    (0, 'One essence', 'God has one divine essence', 'The three Persons possess the same undivided divine being.', 'John 10:30; Heb. 1:3', 284, 'notthree', ['Person', 'Person', 'Person', 'one being']),
    (1, 'The Father is God', 'The Father is God', '', 'John 6:27; 1 Cor. 8:6', 338, 'father', ['is God', '', '', '']),
    (1, 'The Son is God', 'The Son is God', '', 'John 1:1; John 20:28; Heb. 1:8', 1027, 'son', ['', 'is God', '', '']),
    (1, 'The Spirit is God', 'The Holy Spirit is God', '', 'Acts 5:3–4; 1 Cor. 3:16; 6:19', 1006, 'holy', ['', '', 'is God', '']),
    (1, 'Distinct Persons', 'The Father, Son, and Holy Spirit are distinct Persons', '', 'Matt. 3:16–17; John 14:16–17', 1002, 'three', ['Person', 'Person', 'Person', '']),
    (1, 'Father ≠ Son', 'The Father is not the Son', '', 'John 17:1–5; John 8:17–18', 1020, 'fs', ['not the Son', 'not the Father', '', '']),
    (1, 'Son ≠ Spirit', 'The Son is not the Holy Spirit', '', 'John 14:16; 15:26', 546, 'sp', ['', 'not the Spirit', 'not the Son', '']),
    (1, 'Spirit ≠ Father', 'The Holy Spirit is not the Father', '', 'John 14:16–17, 26', 214, 'pf', ['not the Spirit', '', 'not the Father', '']),
    (1, 'Fully God', 'Each Person is fully God', 'Each Person is fully God, not one-third of God.', 'Col. 2:9; Heb. 1:3; Acts 5:3–4', 158, 'one', ['fully God', 'fully God', 'fully God', '']),
    (1, 'Coeternal', 'The three Persons are coeternal', 'None came into existence after another.', 'John 1:1–3; 17:5; Heb. 9:14', 980, 'all', ['eternal', 'eternal', 'eternal', '']),
    (1, 'Coequal', 'The three Persons are coequal in deity', 'None is inferior in divine nature.', 'John 5:23; Phil. 2:6; Matt. 28:19', 1005, 'all', ['equal', 'equal', 'equal', '']),
    (1, 'Exactly three', 'There are exactly three divine Persons', 'Not three manifestations of one Person.', 'Matt. 28:19; 2 Cor. 13:14', 246, 'three', ['1', '2', '3', '']),
    (2, 'In one another', 'The Persons mutually indwell one another', 'This is called perichoresis.', 'John 14:10–11; 17:21', 215, 'indwell', ['in Son, Spirit', 'in Father', 'in Father, Son', '']),
    (2, 'Eternally Father', 'The Father is eternally Father', 'Fatherhood is not a temporary role.', 'John 17:5, 24', 1014, 'father', ['always Father', '', '', '']),
    (2, 'Eternally begotten', 'The Son is eternally begotten of the Father', 'Begotten, not created.', 'John 1:14, 18; 5:26', 984, 'fsline', ['begets', 'begotten', '', '']),
    (2, 'The Spirit proceeds', 'The Holy Spirit eternally proceeds from the Father and the Son', 'The Spirit proceeds from the Father and the Son together, as from one source.', 'John 15:26; 16:14–15; Gal. 4:6', 1032, 'fpline', ['', '', 'proceeds', '']),
    (2, 'Relations of origin', 'The Persons are distinguished by eternal relations of origin', 'Not by different divine natures.', 'John 1:18; 15:26', 510, 'three', ['unbegotten', 'begotten', 'proceeds', 'one nature']),
    (2, 'The Father loves the Son', 'The Father loves the Son eternally', '', 'John 17:24', 60, 'fsline', ['loves', 'loved', '', '']),
    (2, 'Shared glory', 'The Son eternally shares the Father’s glory', '', 'John 17:5', 1107, 'fsline', ['glory', 'glory', '', '']),
    (2, 'One will', 'The three Persons have one divine will', 'Not three competing divine wills.', 'John 5:19; 10:30', 553, 'one', ['', '', '', 'one will']),
    (2, 'Working as one', 'The three Persons act inseparably in divine works', 'Particular works are still attributed to particular Persons.', 'John 5:19; 1 Cor. 12:4–6', 1011, 'works', ['from', 'through', 'in', 'one work']),
    (2, 'None more divine', 'No Person is more divine than another', 'The Father is not a greater God than the Son or Spirit.', 'John 5:23; Phil. 2:6', 286, 'all', ['equal', 'equal', 'equal', '']),
    (3, 'Father sends Son', 'The Father sends the Son', '', 'John 3:17; Gal. 4:4', 1055, 'fsline', ['sends', 'sent', '', '']),
    (3, 'Sending the Spirit', 'The Father and Son send the Holy Spirit', '', 'John 14:26; 15:26; 16:7', 1009, 'sends', ['sends', 'sends', 'sent', '']),
    (3, 'Son reveals Father', 'The Son reveals the Father', '', 'John 1:18; 14:9', 558, 'fsline', ['revealed', 'reveals', '', '']),
    (3, 'Spirit glorifies Son', 'The Holy Spirit glorifies the Son', '', 'John 16:13–14', 57, 'spline', ['', 'glorified', 'glorifies', '']),
    (3, 'Son prays', 'The Son prays to the Father', 'Their personal distinction is real.', 'John 17:1–5; Luke 22:42', 296, 'fsline', ['hears', 'prays', '', '']),
    (3, 'Father speaks', 'The Father speaks to the Son', '', 'Matt. 3:17; John 12:28', 433, 'fsline', ['speaks', 'beloved Son', '', '']),
    (3, 'Spirit is personal', 'The Holy Spirit speaks, teaches, and wills', 'He is not merely an impersonal force.', 'Acts 13:2; John 14:26; 1 Cor. 12:11', 348, 'holy', ['', '', 'speaks, wills', '']),
    (3, 'Creation', 'Creation is the work of the one Triune God', '', 'Gen. 1:1–2; John 1:3; Col. 1:16', 562, 'works', ['', '', '', 'creates']),
    (3, 'Salvation', 'Salvation is the work of the Father, Son, and Holy Spirit', '', 'Eph. 1:3–14; 1 Pet. 1:2', 1012, 'works', ['chooses', 'redeems', 'seals', 'saves']),
    (3, 'Baptism', 'Baptism identifies believers with the Father, Son, and Holy Spirit', '', 'Matt. 28:19', 556, 'all', ['the name', 'the name', 'the name', '']),
    (4, 'Only the Son', 'Only the Son became incarnate', 'Not the Father or the Holy Spirit.', 'John 1:14; Gal. 4:4', 1010, 'son', ['', 'became man', '', '']),
    (4, 'Still fully God', 'The Son remained fully God when He became man', '', 'Col. 2:9; Phil. 2:6–8', 505, 'son', ['', 'God and man', '', '']),
    (4, 'Two natures', 'Jesus Christ has two natures, divine and human, united in one Person', '', 'John 1:14; Heb. 2:14–17', 1024, 'son', ['', 'two natures', '', '']),
    (4, 'Created and eternal', 'The Son’s human nature is created, but His divine nature is eternal', '', 'Luke 1:35; John 1:1–3', 559, 'son', ['', 'eternal + human', '', '']),
    (4, 'Who suffered', 'The Father did not suffer or die on the cross', 'The incarnate Son suffered and died according to His humanity.', '1 Pet. 3:18; John 19:30', 987, 'son', ['', 'suffered as man', '', '']),
    (4, 'Nature unchanged', 'The incarnation did not change the divine nature', '', 'Heb. 13:8; Phil. 2:6–8', 1023, 'son', ['', 'unchanged', '', '']),
]



# Short descriptions for teachings whose list entry had none (editable in the app).
DETAILS = {
    10: 'The Father is fully God, the source of all things and the one to whom Jesus prays.',
    11: 'Jesus, the Son, is fully God, not a created being or a lesser god.',
    12: 'The Holy Spirit is fully God, not just a force or influence coming from God.',
    13: 'Father, Son and Spirit are three real Persons, each distinct from the others, yet one God.',
    14: 'The Father and the Son are two different Persons, not one Person with two names.',
    15: 'The Son and the Holy Spirit are distinct Persons; Jesus calls the Spirit another Helper.',
    16: 'The Holy Spirit is a different Person from the Father, sent by Him and speaking of Him.',
    26: 'The love between the Father and the Son did not begin at creation; it has always been.',
    27: 'Before the world began, the Son shared the Father’s glory as one equal with Him.',
    31: 'Out of love, the Father sent the Son into the world to save it.',
    32: 'The Spirit is sent to believers by the Father and by the Son together.',
    33: 'To see Jesus is to see what the Father is like; the Son makes the unseen God known.',
    34: 'The Spirit points people to Jesus and makes Him known, rather than drawing attention to Himself.',
    36: 'At Jesus’ baptism and afterwards, the Father speaks to the Son from heaven: two Persons, not one.',
    38: 'The Father, Son and Spirit made all things together; creation is one work of the one God.',
    39: 'The Father chooses, the Son redeems and the Spirit makes us holy: one salvation from the one God.',
    40: 'Christians are baptised into the one name of the Father, the Son and the Holy Spirit.',
    42: 'When the Son became man He did not stop being God; He added humanity without losing His deity.',
    43: 'Jesus is one Person who is truly God and truly man, without the two natures being mixed.',
    44: 'The Son has always existed as God, but His human body and soul began when He was conceived.',
    46: 'Becoming man did not change God; the Son stayed fully what He always was.',
}

# Notes for teachings that could seem to contradict one another: (heading, text, related teaching).
TWO_WILLS = ('Father, Son, and Holy Spirit share one divine will. In becoming human, the Son also assumed a human will. '
             'Jesus’ prayer in Gethsemane expresses His human obedience to the Father, not disagreement within God’s divine will.')
TEACHING_NOTES = {
    28: ('One divine will, and Jesus’ human will', TWO_WILLS, 35),
    35: ('One divine will, and Jesus’ human will', TWO_WILLS, 28),
}

# Diagram captions, one per teaching: how to read the picture (editable in the app).
CAPTIONS = {
    1: 'Each Person is God, and all three are the one God at the centre. There are not three Gods.',
    2: 'God is Spirit. The dotted circle holds no body and no material parts.',
    3: 'The unbroken circle: God has no beginning and no end.',
    4: 'The arrow runs one way. Creation depends on God, and God depends on nothing He made.',
    5: 'The double circle stands for a nature that does not change.',
    6: 'The divine essence cannot be seen with physical eyes. The Son makes the Father known.',
    7: 'The circles spread outward: God fills every place and no place contains Him.',
    8: 'One undivided being. The Persons are not three pieces of God.',
    9: 'Solid lines: each Person is God. Dashed lines: no Person is another. One being, three Persons.',
    10: 'The Father is God: the line joins the Father to the one God.',
    11: 'The Son is God: the line joins the Son to the one God.',
    12: 'The Holy Spirit is God: the line joins the Spirit to the one God.',
    13: 'Three distinct Persons. Every dashed line reads “is not”.',
    14: 'The Father is not the Son.',
    15: 'The Son is not the Holy Spirit.',
    16: 'The Holy Spirit is not the Father.',
    17: 'Each line carries the whole of God. No Person is a third of God.',
    18: 'No Person came first. All three have always been.',
    19: 'Every side is equal: none is lesser in divine nature.',
    20: 'Three real Persons, counted one, two, three. Not one Person appearing in three ways.',
    21: 'Arrows both ways: each Person dwells in the others.',
    22: 'The Father has always been Father of the Son. It is not a role He took up.',
    23: 'The arrow runs from the Father to the Son: eternally begotten, not created.',
    24: 'The Spirit proceeds eternally from the Father and the Son, as from one source.',
    25: 'Only these relations tell the Persons apart. The nature in the centre is one and the same.',
    26: 'The Father has loved the Son from before the world began.',
    27: 'The glory runs both ways: the Son shared it with the Father before the world existed.',
    28: 'All three share the one will at the centre, not three wills side by side.',
    29: 'Every work is from the Father, through the Son, in the Spirit, and it is one act of the one God.',
    30: 'Each is God to the same degree. The Father is not a greater God.',
    31: 'The Father sends the Son into the world.',
    32: 'The Father and the Son send the Spirit to the Church.',
    33: 'Whoever has seen the Son has seen the Father.',
    34: 'The arrow runs from the Spirit to the Son: the Spirit glorifies Him.',
    35: 'The Son speaks to the Father in prayer: one Person to another.',
    36: 'The Father’s voice speaks to the Son, another Person.',
    37: 'The Spirit speaks, teaches and chooses, as only a Person can.',
    38: 'One Creator: all things come from the Father, through the Son, by the Spirit.',
    39: 'The Father chooses, the Son redeems, the Spirit seals. One salvation.',
    40: 'Believers are baptised into one name: of the Father, and of the Son, and of the Holy Spirit.',
    41: 'Only the Son took on human nature.',
    42: 'The Son took on humanity and never stopped being God.',
    43: 'One Person, two natures: the divine and the human, united.',
    44: 'His divine nature is eternal. His human nature was created when He became man.',
    45: 'The Son suffered and died in His human nature. The Father did not suffer.',
    46: 'Nothing was taken from His deity. Humanity was added.',
}

topics = {}
for th_i, th in enumerate(json.load(open(topics_path, encoding='utf8'))):
    for t in th['topics']:
        topics[t['id']] = (th['title'], t)


def first_sentence(s):
    m = re.match(r'^(.+?[.!?])(\s|$)', s)
    return m.group(1) if m else s


# AI-written explanations and glossary, from scripts/build_teaching_explanations.py (optional).
QA = Path(__file__).resolve().parents[2] / 'corpus' / 'qa'
EXPLAIN = json.load(open(QA / 'teaching_explanations.json', encoding='utf8')) if (QA / 'teaching_explanations.json').exists() else {}
GLOSSARY = json.load(open(QA / 'glossary.json', encoding='utf8')) if (QA / 'glossary.json').exists() else {}
GLOSSARY_TA = json.load(open(QA / 'glossary.ta.json', encoding='utf8')) if (QA / 'glossary.ta.json').exists() else {}  # Tamil
EXPLAIN_TA = json.load(open(QA / 'teaching_explanations.ta.json', encoding='utf8')) if (QA / 'teaching_explanations.ta.json').exists() else {}  # Tamil

out, problems = [], []
for i, (g, short, title, detail, refs, tid, mode, notes) in enumerate(T):
    theme, tp = topics[tid]
    ref = tp['refs'][0] if tp['refs'] else None
    verses = parse_refs(refs)
    for v in verses:
        if v['missing']:
            problems.append((i + 1, v['missing']))
        del v['missing']
    out.append({'n': i + 1, 'g': g, 'short': short, 'title': title, 'detail': detail or DETAILS.get(i + 1, ''),
                'refs': refs, 'cap': CAPTIONS[i + 1],
                **({'note': dict(zip(('title', 'text', 'see'), TEACHING_NOTES[i + 1]))} if i + 1 in TEACHING_NOTES else {}),
                **({'meaning': EXPLAIN[str(i + 1)]['meaning'], 'support': EXPLAIN[str(i + 1)]['support']} if str(i + 1) in EXPLAIN else {}),
                **({'meaning_ta': EXPLAIN_TA[str(i + 1)]['meaning'], 'support_ta': EXPLAIN_TA[str(i + 1)]['support']} if str(i + 1) in EXPLAIN_TA else {}),
                'verses': verses, 'mode': mode, 'notes': notes,
                'topic': {'id': tid, 'title': tp['title'], 'theme': theme, 'q': tp['q'], 'cmp': first_sentence(tp['cmp'])},
                'quote': ref and {'author': ref['author'], 'work': ref['work'], 'workId': ref['workId'],
                                  'place': ref['place'], 'text': ref['quote']}})

json.dump({'groups': [{'title': t, 'note': n} for t, n in GROUPS], 'glossary': GLOSSARY, 'glossary_ta': GLOSSARY_TA, 'teachings': out},
          open(out_path, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print('teachings', len(out), 'problems', problems)
