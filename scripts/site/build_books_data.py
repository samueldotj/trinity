"""Pack each work in trinity.db into one JSON file for the Reader screen."""
import json, os, sqlite3, sys

db_path, out_dir = sys.argv[1:3]
db = sqlite3.connect(db_path)
os.makedirs(out_dir, exist_ok=True)

works = db.execute('select id, author, title, date, translator, edition, source_url from works').fetchall()
summary = []
for wid, author, title, date, translator, edition, url in works:
    secs = []
    for sid, path, stitle, depth, role, text in db.execute(
            'select id, path, title, depth, role, text from sections where work_id=? order by seq', (wid,)):
        paras = [p.strip() for p in (text or '').split('\n\n') if p.strip()]
        notes = [[n, t] for n, t in db.execute('select n, text from footnotes where section_id=? order by id', (sid,))]
        crumbs = [c.strip() for c in (path or '').split(' > ')][1:]
        secs.append({'t': stitle or path, 'c': crumbs[:-1], 'd': depth, 'r': role, 'p': paras, 'n': notes})
    data = {'id': wid, 'author': author, 'title': title, 'date': date, 'translator': translator,
            'edition': edition, 'source': url, 'sections': secs}
    f = os.path.join(out_dir, wid + '.json')
    json.dump(data, open(f, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
    summary.append((wid, len(secs), os.path.getsize(f)))
for s in summary:
    print(*s)
