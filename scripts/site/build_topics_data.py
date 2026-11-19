import json, re, sys

kb_path, out_path = sys.argv[1], sys.argv[2]
kb = json.load(open(kb_path, encoding='utf8'))
answers = json.load(open(sys.argv[3], encoding='utf8')) if len(sys.argv) > 3 else {}

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


def place(section):
    if ' > ' not in section:
        s = section.strip()
        if s in WHOLE:
            return ''
        m = SINGLE.match(s)
        if m:
            return m.group(0)
        s = s.rstrip('.')
        return s if len(s) <= 60 else s[:57].rsplit(' ', 1)[0] + '…'
    segs = [s.strip() for s in section.split(' > ')][1:]
    hits = [MARK.match(s).group(0).rstrip(' .') for s in segs if MARK.match(s)]
    if hits:
        return ', '.join(hits[:2])
    if not segs:
        return ''
    s = segs[-1]
    return s if len(s) <= 60 else s[:57].rsplit(' ', 1)[0] + '…'


def fix(s):
    return s.replace('�', '’')


out = []
for th in kb:
    topics = []
    for t in th['topics']:
        refs, seen = [], set()
        cands = []
        for q in t['questions']:
            for s in q['sources']:
                if s.get('quote_match') != 'exact':
                    continue
                L = len(s['quote'])
                if not (50 <= L <= 300):
                    continue
                rank = 0 if s.get('importance') == 'core' else 1
                cands.append((rank, s))
        cands.sort(key=lambda x: x[0])
        for _, s in cands:
            if s['author'] in seen:
                continue
            seen.add(s['author'])
            refs.append({'author': s['author'], 'work': SHORT.get(s['work_id'], s['work']),
                         'workId': s['work_id'], 'place': place(s['section']), 'quote': fix(s['quote'])})
            if len(refs) == 3:
                break
        entry = {'id': t['id'], 'title': fix(t['title']), 'q': len(t['questions']),
                 'cmp': fix(t.get('comparison') or t.get('description') or ''), 'refs': refs}
        a = answers.get(str(t['id']))
        if a:
            entry['ans'] = {'text': a['answer'], 'scripture': a['scripture']}
        topics.append(entry)
    out.append({'key': th['key'], 'title': fix(th['title']), 'desc': fix(th['description']), 'topics': topics})

json.dump(out, open(out_path, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
n = sum(len(x['topics']) for x in out)
noref = sum(1 for x in out for t in x['topics'] if not t['refs'])
print('themes', len(out), 'topics', n, 'without refs', noref)
