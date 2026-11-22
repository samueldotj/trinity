"""Pack questions_run4.json into one questions.json for the app: an index plus per-question details."""
import json, os, re, sys

qs_path, kb_path, out_path = sys.argv[1:4]
# Optional: {"<question id>": 1-10}, how thought-provoking each question is; the app lists the highest first.
scores = json.load(open(sys.argv[4], encoding='utf8')) if len(sys.argv) > 4 and sys.argv[4] else {}
CHUNKS = 1
qs = json.load(open(qs_path, encoding='utf8'))
kb = json.load(open(kb_path, encoding='utf8'))

SHORT = {
    'irenaeus-against-heresies': 'Against Heresies',
    'hippolytus-against-noetus': 'Against Noetus',
    'novatian-on-the-trinity': 'On the Trinity',
    'athanasius-against-arians': 'Against the Arians',
    'basil-on-the-holy-spirit': 'On the Holy Spirit',
    'gregory-nyssa-not-three-gods': 'On “Not Three Gods”',
    'gregory-nyssa-against-eunomius': 'Against Eunomius',
    'hilary-on-the-trinity': 'On the Trinity',
    'ambrose-on-the-holy-spirit': 'On the Holy Spirit',
    'augustine-on-the-trinity': 'On the Holy Trinity',
    'owen-communion-with-god': 'Communion with God',
    'owen-brief-declaration-trinity': 'Brief Declaration',
    'waterland-vindication': 'Vindication of Christ’s Divinity',
    'edwards-essay-on-the-trinity': 'Essay on the Trinity',
    'bickersteth-rock-of-ages': 'The Rock of Ages',
    'warfield-biblical-doctrine-trinity': 'Biblical Doctrine of the Trinity',
}
MARK = re.compile(r'^(Book|Discourse|Chapter|Part|Query|Section|Letter|Oration)\b[^.]*', re.I)
SINGLE = re.compile(r'^(Chapter|Query|Book)\s+[0-9IVXLC]+', re.I)
WHOLE = {'The Biblical Doctrine of the Trinity', 'An Unpublished Essay on the Trinity',
         'Against the Heresy of One Noetus.', "On 'Not Three Gods.'"}


def short(s, n=60):
    return s if len(s) <= n else s[:n - 3].rsplit(' ', 1)[0] + '…'


def place(section):
    if ' > ' not in section:
        s = section.strip()
        if s in WHOLE:
            return ''
        m = SINGLE.match(s)
        return m.group(0) if m else short(s.rstrip('.'))
    segs = [s.strip() for s in section.split(' > ')][1:]
    hits = [MARK.match(s).group(0).rstrip(' .') for s in segs if MARK.match(s)]
    if hits:
        return ', '.join(hits[:2])
    return short(segs[-1]) if segs else ''


def fix(s):
    return (s or '').replace('�', '’')


themes = [th['title'] for th in kb]
q_theme, q_topic, topics = {}, {}, []
for i, th in enumerate(kb):
    for t in th['topics']:
        topics.append(fix(t['title']))
        for q in t['questions']:
            q_theme[q['id']] = i
            q_topic[q['id']] = len(topics) - 1

cats = ['theological', 'exegetical', 'philosophical', 'logical']
authors, author_idx = [], {}


def aidx(a):
    if a not in author_idx:
        author_idx[a] = len(authors)
        authors.append(a)
    return author_idx[a]


index, chunks = [], [dict() for _ in range(CHUNKS)]
for n, q in enumerate(qs):
    srcs = q['sources']
    a = sorted({aidx(s['author']) for s in srcs})
    index.append([q['id'], fix(q['question']), cats.index(q['category']) if q['category'] in cats else 0,
                  q_theme.get(q['id'], -1), q_topic.get(q['id'], -1), a, n % CHUNKS, scores.get(str(q['id']), 0)])
    chunks[n % CHUNKS][str(q['id'])] = {
        's': fix(q.get('synthesis')),
        'a': [[aidx(s['author']), SHORT.get(s['work_id'], s['work']), place(s['section']), fix(s['answer']),
               fix(s['quote']), s.get('scripture') or [], s['work_id']] for s in srcs]
    }

json.dump({'themes': themes, 'topics': topics, 'cats': cats, 'authors': authors, 'q': index, 'details': chunks[0]},
          open(out_path, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
# Tamil (corpus/qa/questions.ta.json, from scripts/translate_questions.py) goes to its own file beside this one,
# keeping only translations made from the English as it stands, so a changed question or answer stays English.
ta = json.load(open(sys.argv[5], encoding='utf8')) if len(sys.argv) > 5 else {}
details = chunks[0]
qtext = {str(x[0]): x[1] for x in index}
ta_out = {k: {'q': v['q'], 'a': v['a']} for k, v in ta.items()
          if k in details and v['en'] == {'q': qtext[k],
                                          'a': [a[3] for a in details[k]['a']]}}
json.dump(ta_out, open(os.path.join(os.path.dirname(out_path), 'questions.ta.json'), 'w', encoding='utf8'),
          ensure_ascii=False, separators=(',', ':'))
print('questions', len(index), 'tamil', len(ta_out), 'no theme', sum(1 for x in index if x[3] < 0), 'size', os.path.getsize(out_path))
