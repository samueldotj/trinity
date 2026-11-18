"""Catalog of source works for the Trinity knowledge base.

Each work says where its raw file comes from and how to extract it.
`parts` for ThML (CCEL) sources are div ids inside the volume; role is
"primary" (the author's text) or "editorial" (19th-c. editor/translator intro).
"""

CCEL = "https://ccel.org/ccel"

# raw file name -> download URL
DOWNLOADS = {
    "ccel/schaff_anf01.xml": f"{CCEL}/schaff/anf01.xml",
    "ccel/schaff_anf05.xml": f"{CCEL}/schaff/anf05.xml",
    "ccel/schaff_npnf103.xml": f"{CCEL}/schaff/npnf103.xml",
    "ccel/schaff_npnf204.xml": f"{CCEL}/schaff/npnf204.xml",
    "ccel/schaff_npnf205.xml": f"{CCEL}/schaff/npnf205.xml",
    "ccel/schaff_npnf208.xml": f"{CCEL}/schaff/npnf208.xml",
    "ccel/schaff_npnf209.xml": f"{CCEL}/schaff/npnf209.xml",
    "ccel/schaff_npnf210.xml": f"{CCEL}/schaff/npnf210.xml",
    "ccel/edwards_trinity.xml": f"{CCEL}/edwards/trinity.xml",
    "ccel/owen_trinity.xml": f"{CCEL}/owen/trinity.xml",
    "ccel/owen_communion.xml": f"{CCEL}/owen/communion.xml",
    "web/bickersteth_rock_of_ages.htm":
        "https://newscriptorium.com/assets/books/anglican/miscellany/Bickersteth_Rock_of_Ages_Trinity.htm",
    "web/warfield_trinity_apuritansmind.html":
        "https://www.apuritansmind.com/the-christian-walk/the-biblical-doctrine-of-the-trinity-by-dr-benjamin-b-warfield/",
    "archive/worksofrevdaniel01wateuoft.txt":
        "https://archive.org/download/worksofrevdaniel01wateuoft/worksofrevdaniel01wateuoft_djvu.txt",
}

WORKS = [
    # ---------------- Pre-Nicene ----------------
    dict(id="irenaeus-against-heresies", author="Irenaeus of Lyons", title="Against Heresies",
         date="c. 180", era="pre-nicene", tradition="patristic (East/West)", language="Greek (Latin)",
         translator="Alexander Roberts & W. H. Rambaut", edition="Ante-Nicene Fathers vol. 1 (1885)",
         kind="thml", raw="ccel/schaff_anf01.xml",
         parts=[("ix.i", "editorial"), ("ix.ii", "primary"), ("ix.iii", "primary"), ("ix.iv", "primary"),
                ("ix.v", "editorial"), ("ix.vi", "primary"), ("ix.vii", "primary")]),
    dict(id="hippolytus-against-noetus", author="Hippolytus of Rome", title="Against the Heresy of One Noetus",
         date="c. 200-210", era="pre-nicene", tradition="patristic (West)", language="Greek",
         translator="S. D. F. Salmond", edition="Ante-Nicene Fathers vol. 5 (1886)",
         kind="thml", raw="ccel/schaff_anf05.xml", parts=[("iii.iv.ii.iv", "primary")]),
    dict(id="novatian-on-the-trinity", author="Novatian", title="A Treatise Concerning the Trinity",
         date="c. 250", era="pre-nicene", tradition="patristic (West)", language="Latin",
         translator="Robert Ernest Wallis", edition="Ante-Nicene Fathers vol. 5 (1886)",
         kind="thml", raw="ccel/schaff_anf05.xml", parts=[("vi.ii", "editorial"), ("vi.iii", "primary")]),
    # ---------------- Nicene / Post-Nicene ----------------
    dict(id="athanasius-against-arians", author="Athanasius of Alexandria", title="Four Discourses Against the Arians",
         date="c. 339-359", era="nicene", tradition="patristic (East)", language="Greek",
         translator="J. H. Newman, rev. Archibald Robertson", edition="Nicene and Post-Nicene Fathers II vol. 4 (1892)",
         kind="thml", raw="ccel/schaff_npnf204.xml", parts=[("xxi.i", "editorial"), ("xxi.ii", "primary")]),
    dict(id="basil-on-the-holy-spirit", author="Basil of Caesarea", title="On the Holy Spirit (De Spiritu Sancto)",
         date="c. 375", era="nicene", tradition="patristic (East)", language="Greek",
         translator="Blomfield Jackson", edition="Nicene and Post-Nicene Fathers II vol. 8 (1895)",
         kind="thml", raw="ccel/schaff_npnf208.xml", parts=[("vii", "primary")]),
    dict(id="gregory-nyssa-not-three-gods", author="Gregory of Nyssa", title="On \"Not Three Gods\" (To Ablabius)",
         date="c. 375-390", era="nicene", tradition="patristic (East)", language="Greek",
         translator="H. A. Wilson", edition="Nicene and Post-Nicene Fathers II vol. 5 (1893)",
         kind="thml", raw="ccel/schaff_npnf205.xml", parts=[("viii.v", "primary")]),
    dict(id="gregory-nyssa-against-eunomius", author="Gregory of Nyssa", title="Against Eunomius",
         date="c. 380-383", era="nicene", tradition="patristic (East)", language="Greek",
         translator="William Moore & H. A. Wilson", edition="Nicene and Post-Nicene Fathers II vol. 5 (1893)",
         kind="thml", raw="ccel/schaff_npnf205.xml", parts=[("viii.i", "primary"), ("viii.ii", "primary")]),
    dict(id="hilary-on-the-trinity", author="Hilary of Poitiers", title="On the Trinity (De Trinitate)",
         date="c. 356-360", era="nicene", tradition="patristic (West)", language="Latin",
         translator="E. W. Watson, L. Pullan et al.", edition="Nicene and Post-Nicene Fathers II vol. 9 (1899)",
         kind="thml", raw="ccel/schaff_npnf209.xml", parts=[("ii.v", "primary")]),
    dict(id="ambrose-on-the-holy-spirit", author="Ambrose of Milan", title="On the Holy Spirit",
         date="381", era="nicene", tradition="patristic (West)", language="Latin",
         translator="H. de Romestin", edition="Nicene and Post-Nicene Fathers II vol. 10 (1896)",
         kind="thml", raw="ccel/schaff_npnf210.xml", parts=[("iv.ii", "primary")]),
    dict(id="augustine-on-the-trinity", author="Augustine of Hippo", title="On the Holy Trinity (De Trinitate)",
         date="c. 400-416", era="nicene", tradition="patristic (West)", language="Latin",
         translator="Arthur West Haddan, rev. W. G. T. Shedd", edition="Nicene and Post-Nicene Fathers I vol. 3 (1887)",
         kind="thml", raw="ccel/schaff_npnf103.xml", parts=[("iv.i", "primary")]),
    # ---------------- Post-Reformation ----------------
    dict(id="owen-communion-with-god", author="John Owen", title="Of Communion with God the Father, Son, and Holy Ghost",
         date="1657", era="post-reformation", tradition="Reformed (Puritan)", language="English",
         translator=None, edition="Works of John Owen, ed. W. H. Goold, vol. 2 (1850-53)",
         kind="thml", raw="ccel/owen_communion.xml",
         parts=[("i.ii", "editorial"), ("i.iii", "primary"), ("i.iv", "primary"), ("i.vi", "primary"),
                ("i.vii", "primary"), ("i.viii", "primary")]),
    dict(id="owen-brief-declaration-trinity", author="John Owen",
         title="A Brief Declaration and Vindication of the Doctrine of the Trinity",
         date="1669", era="post-reformation", tradition="Reformed (Puritan)", language="English",
         translator=None, edition="Works of John Owen, ed. W. H. Goold, vol. 2 (1850-53)",
         kind="thml", raw="ccel/owen_trinity.xml",
         parts=[("ii", "editorial"), ("iii", "primary"), ("iv", "primary"), ("v", "primary"),
                ("vi", "primary"), ("vii", "primary"), ("viii", "primary")]),
    dict(id="waterland-vindication", author="Daniel Waterland", title="A Vindication of Christ's Divinity",
         date="1719", era="post-reformation", tradition="Anglican", language="English",
         translator=None, edition="Works of Daniel Waterland, ed. W. Van Mildert, vol. 1 (1856); archive.org OCR",
         kind="waterland", raw="archive/worksofrevdaniel01wateuoft.txt"),
    dict(id="edwards-essay-on-the-trinity", author="Jonathan Edwards", title="An Unpublished Essay on the Trinity",
         date="c. 1730s (publ. 1903)", era="post-reformation", tradition="Reformed (Puritan/New England)",
         language="English", translator=None, edition="ed. George P. Fisher (1903)",
         kind="thml", raw="ccel/edwards_trinity.xml", parts=[("i", "primary")]),
    # ---------------- 19th / early 20th c. ----------------
    dict(id="bickersteth-rock-of-ages", author="Edward Henry Bickersteth",
         title="The Rock of Ages; or, Scripture Testimony to the One Eternal Godhead (later: The Trinity)",
         date="1859", era="modern", tradition="Anglican (Evangelical)", language="English",
         translator=None,
         edition="Simpkin, Marshall 1859 (newscriptorium.com transcription; spelling selectively modernized)",
         kind="bickersteth", raw="web/bickersteth_rock_of_ages.htm"),
    dict(id="warfield-biblical-doctrine-trinity", author="Benjamin B. Warfield",
         title="The Biblical Doctrine of the Trinity",
         date="1915", era="modern", tradition="Reformed (Princeton)", language="English",
         translator=None, edition="International Standard Bible Encyclopaedia (1915), art. \"Trinity\"",
         kind="warfield", raw="web/warfield_trinity_apuritansmind.html"),
]
