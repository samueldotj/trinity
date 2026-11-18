"""Print the div hierarchy of a CCEL ThML file: python toc.py file.xml [maxdepth]"""
import sys, re
from lxml import etree
t = etree.parse(sys.argv[1], etree.XMLParser(recover=True, huge_tree=True))
depth = int(sys.argv[2]) if len(sys.argv) > 2 else 2
for el in t.iter():
    if isinstance(el.tag, str) and re.fullmatch(r'div[1-%d]' % depth, el.tag):
        n = int(el.tag[3])
        print('  ' * (n - 1) + f"{el.tag} id={el.get('id')} title={el.get('title')!r} chars={len(''.join(el.itertext()))}")
