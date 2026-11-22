import { api } from '../api';
import { writer } from '../writers';
import { esc, failure, href, icon, loading, navigate } from '../util';

interface Toc { id: string; title: string; author: string; date: string; translator: string; edition: string; source: string; toc: { t: string; d: number; r: string }[] }
interface Section { sec: number; t: string; c: string[]; r: string; p: string[]; n: [string, string][] }
interface Found { found: boolean; sec: number; para: number | null }

const BOOKS: [string, string][] = [
  ['irenaeus-against-heresies', 'Irenaeus — Against Heresies'],
  ['hippolytus-against-noetus', 'Hippolytus — Against Noetus'],
  ['novatian-on-the-trinity', 'Novatian — On the Trinity'],
  ['athanasius-against-arians', 'Athanasius — Against the Arians'],
  ['hilary-on-the-trinity', 'Hilary — On the Trinity'],
  ['basil-on-the-holy-spirit', 'Basil — On the Holy Spirit'],
  ['gregory-nyssa-not-three-gods', 'Gregory of Nyssa — On “Not Three Gods”'],
  ['gregory-nyssa-against-eunomius', 'Gregory of Nyssa — Against Eunomius'],
  ['ambrose-on-the-holy-spirit', 'Ambrose — On the Holy Spirit'],
  ['augustine-on-the-trinity', 'Augustine — On the Holy Trinity'],
  ['owen-communion-with-god', 'Owen — Communion with God'],
  ['owen-brief-declaration-trinity', 'Owen — Brief Declaration of the Trinity'],
  ['waterland-vindication', 'Waterland — Vindication of Christ’s Divinity'],
  ['edwards-essay-on-the-trinity', 'Edwards — Essay on the Trinity'],
  ['bickersteth-rock-of-ages', 'Bickersteth — The Rock of Ages'],
  ['warfield-biblical-doctrine-trinity', 'Warfield — Biblical Doctrine of the Trinity'],
];

const prefs = { size: 21, tone: 'light' };
let tocOpen = false;
try {
  Object.assign(prefs, JSON.parse(localStorage.getItem('reader-prefs') || '{}'));
} catch { /* private mode: defaults */ }
const savePrefs = () => { try { localStorage.setItem('reader-prefs', JSON.stringify(prefs)); } catch { /* ignore */ } };

const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

/** Paragraph text to HTML: footnote markers become links; the quoted words, if found, are marked. */
function paragraph(text: string, mark: string): string {
  const parts = text.split(/\[\^([^\]]+)\]/);
  return parts.map((part, i) => {
    if (i % 2 === 1) return `<sup><a href="#fn-${esc(part)}" data-fn="${esc(part)}">${esc(part)}</a></sup>`;
    const at = mark ? part.indexOf(mark) : -1;
    if (at < 0) return esc(part);
    return esc(part.slice(0, at)) + `<mark>${esc(mark)}</mark>` + esc(part.slice(at + mark.length));
  }).join('');
}

export async function renderReader(root: HTMLElement, params: URLSearchParams): Promise<void> {
  const work = params.get('work') || 'gregory-nyssa-not-three-gods';
  const quote = params.get('quote') || '';
  let sec = params.has('sec') ? Number(params.get('sec')) : -1;
  let focus: number | null = null;
  if (!root.querySelector('.reader')) root.innerHTML = loading('Opening the book…');
  let toc: Toc, section: Section;
  try {
    toc = await api<Toc>('book', { id: work });
    if (sec < 0) {
      const f = await api<Found>('find', { id: work, quote });
      sec = f.sec;
      focus = quote ? f.para : null;
    }
    section = await api<Section>('section', { id: work, sec });
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }

  let mark = '';
  if (focus !== null && quote) {
    const raw = (section.p[focus] || '').replace(/\[\^[^\]]*\]/g, '');
    for (const len of [quote.length, 120, 60]) {
      const probe = quote.slice(0, len);
      if (probe.length >= 20 && raw.includes(probe)) { mark = probe; break; }
    }
  }

  const contents = toc.toc.map((s, i) => `<button type="button" data-sec="${i}" class="${s.r === 'editorial' ? 'ed' : ''}" aria-current="${i === sec}" style="padding-left: ${10 + Math.max(0, (s.d || 1) - 1) * 12}px">${esc(short(s.t || `Section ${i + 1}`, 90))}</button>`).join('');
  const paras = section.p.map((t, i) => `<div class="para${i === focus ? ' focus' : ''}" id="para-${i}"><span class="pn">${i + 1}</span><p>${paragraph(t, i === focus ? mark : '')}</p></div>`).join('');
  const notes = section.n.map(([n, t]) => `<p id="fn-${esc(n)}"><strong>${esc(n)}</strong> ${esc(t)}</p>`).join('');
  const about = [toc.translator ? `Translated by ${toc.translator}` : '', toc.edition || '', 'Public domain'].filter(Boolean).join(' · ');
  const goSec = (i: number) => navigate('reader', { work, sec: i }, true);
  const pct = Math.round(((sec + 1) / toc.toc.length) * 100);
  const canGoBack = history.length > 1;

  root.innerHTML = `<div class="reader tone-${esc(prefs.tone)}">
    <header class="reader-bar">
      <div class="inner">
        <div class="row" style="gap: 10px 20px">
          <a class="back" href="${href('writings')}" id="rd-back">${icon.left}${canGoBack ? 'Back' : 'All early writings'}</a>
          <span class="reader-title"><b>${esc(toc.title)}</b><small>${esc(writer(toc.author))} · ${esc(toc.date)}</small></span>
        </div>
        <div class="row" style="gap: 8px">
          <button type="button" class="bar-btn" id="rd-toc" aria-expanded="${tocOpen}" aria-controls="rd-toc-panel"><svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14 M3 10h14 M3 15h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>Contents</button>
          <label><span class="sr-only">Book</span><select id="rd-book">${BOOKS.map(([id, label]) => `<option value="${id}"${id === work ? ' selected' : ''}>${esc(label)}</option>`).join('')}</select></label>
          <button type="button" class="bar-btn circle" data-size="-2" aria-label="Smaller text" style="font-size: 14px">A</button>
          <button type="button" class="bar-btn circle" data-size="2" aria-label="Larger text" style="font-size: 19px">A</button>
          <span class="row" role="group" aria-label="Page tone" style="gap: 6px; padding-left: 4px">
            <button type="button" class="swatch" data-tone="light" aria-label="Light page" aria-pressed="${prefs.tone === 'light'}" style="background: #FBFAF7"></button>
            <button type="button" class="swatch" data-tone="sepia" aria-label="Sepia page" aria-pressed="${prefs.tone === 'sepia'}" style="background: #EFE3CC"></button>
            <button type="button" class="swatch" data-tone="dark" aria-label="Dark page" aria-pressed="${prefs.tone === 'dark'}" style="background: #0B0F1C"></button>
          </span>
        </div>
      </div>
      <div class="progress" role="progressbar" aria-label="Position in book" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div style="width: ${pct}%"></div></div>
    </header>
    <nav class="toc-panel" id="rd-toc-panel" aria-label="Contents"${tocOpen ? '' : ' hidden'}><div class="toc">${contents}</div></nav>
    <main class="reader-main">
      <article class="reader-page" style="font-size: ${prefs.size}px">
        <header>
          ${(section.c || []).map((c) => `<span class="sans small-caps" style="color: inherit; opacity: .75">${esc(short(c, 140))}</span>`).join('')}
          <h1>${esc(section.t)}</h1>
          <span class="sans" style="font-size: 14px; opacity: .75">${esc(about)}</span>
          ${section.r === 'editorial' ? `<span class="sans chip small" style="align-self: flex-start">Editor’s or translator’s introduction</span>` : ''}
        </header>
        ${focus !== null ? `<div class="focus-banner"><span>The quoted passage is highlighted in paragraph ${focus + 1}.</span><a href="#para-${focus}" data-jump="${focus}">Go to it</a></div>` : ''}
        ${paras}
        <nav class="row sans" aria-label="Sections" style="justify-content: space-between; padding-top: 12px">
          ${sec > 0 ? `<button type="button" class="btn" data-sec="${sec - 1}">← ${esc(short(toc.toc[sec - 1].t || '', 40))}</button>` : '<span></span>'}
          ${sec < toc.toc.length - 1 ? `<button type="button" class="btn primary" data-sec="${sec + 1}">${esc(short(toc.toc[sec + 1].t || '', 40))} →</button>` : ''}
        </nav>
      </article>
      <aside class="reader-aside" aria-label="Notes and edition">
        ${notes ? `<div class="card"><span class="small-caps">Notes</span>${notes}</div>` : ''}
        <div class="card"><span class="small-caps">Your place</span><span>Section ${sec + 1} of ${toc.toc.length}</span>
          ${toc.source ? `<a href="${esc(toc.source)}" target="_blank" rel="noopener">Source text</a>` : ''}</div>
      </aside>
    </main>
  </div>`;

  // In-page anchors (footnotes, "Go to it") must not change the route.
  root.querySelectorAll<HTMLAnchorElement>('[data-fn], [data-jump]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.dataset.fn ? `fn-${a.dataset.fn}` : `para-${a.dataset.jump}`;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  root.querySelector<HTMLAnchorElement>('#rd-back')!.addEventListener('click', (e) => {
    if (canGoBack) { e.preventDefault(); history.back(); }
  });
  root.querySelector('#rd-toc')!.addEventListener('click', () => {
    tocOpen = !tocOpen;
    root.querySelector('#rd-toc')!.setAttribute('aria-expanded', String(tocOpen));
    root.querySelector<HTMLElement>('#rd-toc-panel')!.hidden = !tocOpen;
  });
  root.querySelectorAll<HTMLButtonElement>('[data-sec]').forEach((b) => b.addEventListener('click', () => { tocOpen = false; goSec(Number(b.dataset.sec)); }));
  root.querySelector<HTMLSelectElement>('#rd-book')!.addEventListener('change', (e) => navigate('reader', { work: (e.target as HTMLSelectElement).value }));
  root.querySelectorAll<HTMLButtonElement>('[data-size]').forEach((b) => b.addEventListener('click', () => {
    prefs.size = Math.min(26, Math.max(16, prefs.size + Number(b.dataset.size)));
    savePrefs();
    root.querySelector<HTMLElement>('.reader-page')!.style.fontSize = `${prefs.size}px`;
  }));
  root.querySelectorAll<HTMLButtonElement>('[data-tone]').forEach((b) => b.addEventListener('click', () => {
    prefs.tone = b.dataset.tone!;
    savePrefs();
    root.querySelector<HTMLElement>('.reader')!.className = `reader tone-${prefs.tone}`;
    root.querySelectorAll<HTMLElement>('[data-tone]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.tone === prefs.tone)));
  }));
  if (focus !== null) document.getElementById(`para-${focus}`)?.scrollIntoView({ block: 'center' });
}
