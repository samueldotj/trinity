// Years shown in brackets beside a writer's or a book's name, wherever the site names one.

/** Each writer's lifetime. */
const LIVED: Record<string, string> = {
  'Irenaeus of Lyons': 'c. 130–c. 202',
  'Hippolytus of Rome': 'c. 170–c. 235',
  'Novatian': 'c. 200–c. 258',
  'Athanasius of Alexandria': 'c. 296–373',
  'Hilary of Poitiers': 'c. 310–c. 367',
  'Basil of Caesarea': 'c. 330–379',
  'Gregory of Nyssa': 'c. 335–c. 395',
  'Ambrose of Milan': 'c. 340–397',
  'Augustine of Hippo': '354–430',
  'John Owen': '1616–1683',
  'Daniel Waterland': '1683–1740',
  'Jonathan Edwards': '1703–1758',
  'Edward Henry Bickersteth': '1825–1906',
  'Benjamin B. Warfield': '1851–1921',
};

/** When each book was written, by work id (the same dates as the Early Writings page). */
const WRITTEN: Record<string, string> = {
  'irenaeus-against-heresies': 'c. 180',
  'hippolytus-against-noetus': 'c. 200–210',
  'novatian-on-the-trinity': 'c. 250',
  'athanasius-against-arians': 'c. 339–359',
  'hilary-on-the-trinity': 'c. 356–360',
  'basil-on-the-holy-spirit': 'c. 375',
  'gregory-nyssa-not-three-gods': 'c. 375–390',
  'gregory-nyssa-against-eunomius': 'c. 380–383',
  'ambrose-on-the-holy-spirit': '381',
  'augustine-on-the-trinity': 'c. 400–416',
  'owen-communion-with-god': '1657',
  'owen-brief-declaration-trinity': '1669',
  'waterland-vindication': '1719',
  'edwards-essay-on-the-trinity': 'c. 1730s',
  'bickersteth-rock-of-ages': '1859',
  'warfield-biblical-doctrine-trinity': '1915',
};

/** "Augustine of Hippo (354–430)"; the name alone if its years are not known. Plain text: escape it. */
export function writer(name: string): string {
  return LIVED[name] ? `${name} (${LIVED[name]})` : name;
}

/** "On the Holy Trinity (c. 400–416)", from the work's title and id. Plain text: escape it. */
export function book(title: string, workId: string): string {
  return WRITTEN[workId] ? `${title} (${WRITTEN[workId]})` : title;
}
