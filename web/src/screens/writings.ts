import { esc, href } from '../util';
import { writer } from '../writers';

// The library: [era, id, title, author, date, tradition, words, Bible references].
const BOOKS: [string, string, string, string, string, string, string, string][] = [
  ['pre-nicene', 'irenaeus-against-heresies', 'Against Heresies', 'Irenaeus of Lyons', 'c. 180', 'Patristic (East/West)', '219,161', '1,594'],
  ['pre-nicene', 'hippolytus-against-noetus', 'Against the Heresy of One Noetus', 'Hippolytus of Rome', 'c. 200–210', 'Patristic (West)', '6,350', '60'],
  ['pre-nicene', 'novatian-on-the-trinity', 'A Treatise Concerning the Trinity', 'Novatian', 'c. 250', 'Patristic (West)', '32,708', '251'],
  ['nicene', 'athanasius-against-arians', 'Four Discourses Against the Arians', 'Athanasius of Alexandria', 'c. 339–359', 'Patristic (East)', '118,621', '1,020'],
  ['nicene', 'hilary-on-the-trinity', 'On the Trinity (De Trinitate)', 'Hilary of Poitiers', 'c. 356–360', 'Patristic (West)', '181,355', '803'],
  ['nicene', 'basil-on-the-holy-spirit', 'On the Holy Spirit (De Spiritu Sancto)', 'Basil of Caesarea', 'c. 375', 'Patristic (East)', '35,891', '607'],
  ['nicene', 'gregory-nyssa-not-three-gods', 'On “Not Three Gods” (To Ablabius)', 'Gregory of Nyssa', 'c. 375–390', 'Patristic (East)', '5,521', '12'],
  ['nicene', 'gregory-nyssa-against-eunomius', 'Against Eunomius', 'Gregory of Nyssa', 'c. 380–383', 'Patristic (East)', '250,017', '844'],
  ['nicene', 'ambrose-on-the-holy-spirit', 'On the Holy Spirit', 'Ambrose of Milan', '381', 'Patristic (West)', '57,162', '658'],
  ['nicene', 'augustine-on-the-trinity', 'On the Holy Trinity (De Trinitate)', 'Augustine of Hippo', 'c. 400–416', 'Patristic (West)', '191,849', '1,029'],
  ['post-reformation', 'owen-communion-with-god', 'Of Communion with God the Father, Son, and Holy Ghost', 'John Owen', '1657', 'Reformed (Puritan)', '137,285', '2,285'],
  ['post-reformation', 'owen-brief-declaration-trinity', 'A Brief Declaration and Vindication of the Doctrine of the Trinity', 'John Owen', '1669', 'Reformed (Puritan)', '43,624', '413'],
  ['post-reformation', 'waterland-vindication', 'A Vindication of Christ’s Divinity', 'Daniel Waterland', '1719', 'Anglican', '130,992', '208'],
  ['post-reformation', 'edwards-essay-on-the-trinity', 'An Unpublished Essay on the Trinity', 'Jonathan Edwards', 'c. 1730s', 'Reformed (New England)', '7,822', '68'],
  ['modern', 'bickersteth-rock-of-ages', 'The Rock of Ages', 'Edward Henry Bickersteth', '1859', 'Anglican (Evangelical)', '49,485', '1,029'],
  ['modern', 'warfield-biblical-doctrine-trinity', 'The Biblical Doctrine of the Trinity', 'Benjamin B. Warfield', '1915', 'Reformed (Princeton)', '15,314', '125'],
];
const ERAS: [string, string, string, string][] = [
  ['pre-nicene', 'Before Nicaea', 'c. 180–250', '#2E5AAC'],
  ['nicene', 'The Nicene Fathers', 'c. 339–416', '#7E3A10'],
  ['post-reformation', 'After the Reformation', '1657–1730s', '#11514A'],
  ['modern', 'Modern', '1859–1915', '#33373F'],
];

export function renderWritings(root: HTMLElement, params: URLSearchParams): void {
  const era = params.get('era') || 'all';
  const pills = [['all', 'All eras'], ...ERAS.map((e) => [e[0], e[1]])]
    .map(([id, label]) => `<a class="pill" role="button" href="${href('writings', { era: id === 'all' ? '' : id })}" aria-pressed="${id === era}" style="display: inline-flex; align-items: center; text-decoration: none">${esc(label)}</a>`).join('');
  const groups = ERAS.filter((e) => era === 'all' || e[0] === era).map(([id, label, range, color]) => {
    const cards = BOOKS.filter((b) => b[0] === id).map(([, bid, title, author, date, trad, words, refs]) => `
      <a class="card book" href="${href('reader', { work: bid })}">
        <div class="cover" style="background: ${color}"><small>${esc(date)}</small><b>${esc(title)}</b></div>
        <div class="info"><b>${esc(writer(author))}</b><span>${esc(trad)}</span><span>${words} words · ${refs} Bible references</span><span class="go">Read the book →</span></div>
      </a>`).join('');
    return `<section class="era" style="display: flex; flex-direction: column; gap: 14px">
      <div class="row" style="align-items: baseline; gap: 12px"><h2>${esc(label)}</h2><span style="font-size: 14px; color: var(--faint)">${esc(range)}</span></div>
      <div class="book-grid">${cards}</div></section>`;
  }).join('');

  root.innerHTML = `<div class="page writings">
    <div class="intro">
      <span class="eyebrow">Early Writings</span>
      <h1>Early Christian writings</h1>
      <p>The public-domain texts behind every answer on this site. Read any of them here, chapter by chapter, with footnotes and Scripture references.</p>
    </div>
    <div class="row" role="group" aria-label="Era">${pills}</div>
    ${groups}
  </div>`;
}
