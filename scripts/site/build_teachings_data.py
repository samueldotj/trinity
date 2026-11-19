"""Build the 46 Explanations teachings: user's list + BSB verse text + a matched writers' topic and quote."""
import json, re, sys

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
    ('The Nature of God', 'Indivisibility and one divine essence are theological conclusions drawn from Scripture rather than statements expressed in those exact technical terms.'),
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
    (2, 'The Spirit proceeds', 'The Holy Spirit eternally proceeds from the Father', 'Western Christianity also affirms procession from the Son.', 'John 15:26; Gal. 4:6', 1032, 'fpline', ['', '', 'proceeds', '']),
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

topics = {}
for th_i, th in enumerate(json.load(open(topics_path, encoding='utf8'))):
    for t in th['topics']:
        topics[t['id']] = (th['title'], t)


def first_sentence(s):
    m = re.match(r'^(.+?[.!?])(\s|$)', s)
    return m.group(1) if m else s


out, problems = [], []
for i, (g, short, title, detail, refs, tid, mode, notes) in enumerate(T):
    theme, tp = topics[tid]
    ref = tp['refs'][0] if tp['refs'] else None
    verses = parse_refs(refs)
    for v in verses:
        if v['missing']:
            problems.append((i + 1, v['missing']))
        del v['missing']
    out.append({'n': i + 1, 'g': g, 'short': short, 'title': title, 'detail': detail, 'refs': refs,
                'verses': verses, 'mode': mode, 'notes': notes,
                'topic': {'id': tid, 'title': tp['title'], 'theme': theme, 'q': tp['q'], 'cmp': first_sentence(tp['cmp'])},
                'quote': ref and {'author': ref['author'], 'work': ref['work'], 'workId': ref['workId'],
                                  'place': ref['place'], 'text': ref['quote']}})

json.dump({'groups': [{'title': t, 'note': n} for t, n in GROUPS], 'teachings': out},
          open(out_path, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print('teachings', len(out), 'problems', problems)
