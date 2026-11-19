import json, sys

import re

vm_path, kb_path, out_path = sys.argv[1:4]
bsb_path = sys.argv[4] if len(sys.argv) > 4 else None
vm = json.load(open(vm_path, encoding='utf8'))

# Berean Standard Bible (public domain): "Book C:V<TAB>text" per line
bsb = {}
if bsb_path:
    for line in open(bsb_path, encoding='utf-8-sig'):
        m = re.match(r'^(.+? \d+:\d+)\t(.*?)\s*$', line)
        if m:
            bsb[m.group(1)] = m.group(2)
BSB_BOOK = {'Psalms': 'Psalm'}


def bsb_text(book, chapter, verse):
    if verse is None:
        return ''
    return bsb.get('%s %s:%s' % (BSB_BOOK.get(book, book), chapter, verse), '')
kb = json.load(open(kb_path, encoding='utf8'))

themes = [th['title'] for th in kb]
theme_idx = {t: i for i, t in enumerate(themes)}
topics = {}
for i, th in enumerate(kb):
    for t in th['topics']:
        topics[t['id']] = [t['title'].replace('�', '’'), i]

NT = ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
      'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
      'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation']
AP = ['Tobit', 'Judith', 'Wisdom of Solomon', 'Sirach', 'Baruch', '1 Maccabees', '2 Maccabees', 'Susanna',
      'Bel and the Dragon', 'Prayer of Azariah', '1 Esdras', '2 Esdras']

books, authors = [], []
book_idx, author_idx = {}, {}


def idx(table, index, key):
    if key not in index:
        index[key] = len(table)
        table.append(key)
    return index[key]


verses = []
for order, v in enumerate(vm):
    b = idx(books, book_idx, v['book'])
    a = [idx(authors, author_idx, x) for x in v['authors']]
    tops = []
    for th in v['themes']:
        for t in th['topics']:
            if t['topic_id'] in topics:
                tops.append((t['direct'], t['context'], t['topic_id']))
    tops.sort(key=lambda x: (-x[0], -x[1]))
    verses.append([v['ref'], b, v['direct_uses'], a, [t[2] for t in tops], order,
                   bsb_text(v['book'], v['chapter'], v['verse'])])

testament = ['nt' if bk in NT else ('ap' if bk in AP else 'ot') for bk in books]
out = {'themes': themes, 'topics': topics, 'books': books, 'testament': testament,
       'authors': authors, 'verses': verses}
json.dump(out, open(out_path, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print('verses', len(verses), 'books', len(books), 'authors', len(authors),
      'ap books', [b for b, t in zip(books, testament) if t == 'ap'],
      'with text', sum(1 for v in verses if v[6]),
      'missing', [v[0] for v in verses if not v[6] and testament[v[1]] != 'ap'][:40])
