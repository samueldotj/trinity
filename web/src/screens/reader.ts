import { api } from '../api';
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

const prefs = { size: 20, tone: 'light' };
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
  const paras = section.p.map((t, i) => `<div class="para${i === focus ? ' focus' : ''}" id="para-${i}"><span class="pn">¶${i + 1}</span><p>${paragraph(t, i === focus ? mark : '')}</p></div>`).join('');
  const notes = section.n.length ? `<footer class="notes"><span class="small-caps">Notes</span>${section.n.map(([n, t]) => `<p id="fn-${esc(n)}"><strong>${esc(n)}</strong> ${esc(t)}</p>`).join('')}</footer>` : '';
  const about = [toc.translator ? `Translated by ${toc.translator}.` : '', toc.edition ? `${toc.edition}.` : '', 'Public domain.'].filter(Boolean).join(' ');
  const goSec = (i: number) => navigate('reader', { work, sec: i }, true);

  root.innerHTML = `<div class="reader">
    <div class="toolbar"><div class="bar">
      <div class="row" style="gap: 10px 16px">
        <a class="btn" href="${href('writings')}" style="border: 0; padding: 0">${icon.left}All early writings</a>
        <label class="field" style="flex-direction: row; align-items: center; flex: 0 1 auto">Book
          <select id="rd-book">${BOOKS.map(([id, label]) => `<option value="${id}"${id === work ? ' selected' : ''}>${esc(label)}</option>`).join('')}</select></label>
      </div>
      <div class="row" style="gap: 16px">
        <div class="row" role="group" aria-label="Text size"><span class="small-caps">Text</span>
          <button type="button" class="btn" data-size="-2" aria-label="Smaller text">A−</button>
          <button type="button" class="btn" data-size="2" aria-label="Larger text">A+</button></div>
        <div class="row" role="group" aria-label="Page tone"><span class="small-caps">Page</span>
          ${['light', 'sepia', 'dark'].map((t) => `<button type="button" class="pill" data-tone="${t}" aria-pressed="${prefs.tone === t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div>
      </div>
    </div></div>
    <div class="page" style="flex-direction: row; flex-wrap: wrap; align-items: flex-start; gap: 28px">
      <nav class="side" aria-label="Contents" style="display: flex; flex-direction: column; gap: 14px">
        <details class="card" open><summary class="small-caps" style="min-height: 40px; display: flex; align-items: center; padding: 0 10px; cursor: pointer">Contents · ${toc.toc.length} sections</summary><div class="toc">${contents}</div></details>
        <div class="card" style="padding: 14px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--muted)">
          <b style="color: var(--ink)">About this edition</b><span>${esc(about)}</span>
          ${toc.source ? `<a href="${esc(toc.source)}" target="_blank" rel="noopener">Source text</a>` : ''}
        </div>
      </nav>
      <article class="reader-page tone-${esc(prefs.tone)}" style="font-size: ${prefs.size}px">
        <header>
          <span class="sans small-caps" style="color: inherit; opacity: .75">${esc(toc.author)} · ${esc(toc.date)}</span>
          <span style="font-size: 18px; font-style: italic; opacity: .8">${esc(toc.title)}</span>
          ${(section.c || []).map((c) => `<span class="sans" style="font-size: 13px; opacity: .7">${esc(short(c, 140))}</span>`).join('')}
          <h1>${esc(section.t)}</h1>
          ${section.r === 'editorial' ? `<span class="sans chip small" style="align-self: flex-start">Editor’s or translator’s introduction</span>` : ''}
        </header>
        ${focus !== null ? `<div class="banner sans" style="background: var(--accent)"><span>The quoted passage is highlighted in ¶${focus + 1}.</span><a href="#para-${focus}" data-jump="${focus}" style="color: #fff; font-weight: 600">Go to it</a></div>` : ''}
        ${paras}
        ${notes}
        <div class="row sans" style="justify-content: space-between">
          ${sec > 0 ? `<button type="button" class="btn" data-sec="${sec - 1}">← ${esc(short(toc.toc[sec - 1].t || '', 48))}</button>` : '<span></span>'}
          ${sec < toc.toc.length - 1 ? `<button type="button" class="btn primary" data-sec="${sec + 1}">${esc(short(toc.toc[sec + 1].t || '', 48))} →</button>` : ''}
        </div>
      </article>
    </div>
  </div>`;

  // In-page anchors (footnotes, "Go to it") must not change the route.
  root.querySelectorAll<HTMLAnchorElement>('[data-fn], [data-jump]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.dataset.fn ? `fn-${a.dataset.fn}` : `para-${a.dataset.jump}`;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  root.querySelectorAll<HTMLButtonElement>('[data-sec]').forEach((b) => b.addEventListener('click', () => goSec(Number(b.dataset.sec))));
  root.querySelector<HTMLSelectElement>('#rd-book')!.addEventListener('change', (e) => navigate('reader', { work: (e.target as HTMLSelectElement).value }));
  root.querySelectorAll<HTMLButtonElement>('[data-size]').forEach((b) => b.addEventListener('click', () => {
    prefs.size = Math.min(26, Math.max(16, prefs.size + Number(b.dataset.size)));
    savePrefs();
    void renderReader(root, params);
  }));
  root.querySelectorAll<HTMLButtonElement>('[data-tone]').forEach((b) => b.addEventListener('click', () => {
    prefs.tone = b.dataset.tone!;
    savePrefs();
    void renderReader(root, params);
  }));
  if (focus !== null) document.getElementById(`para-${focus}`)?.scrollIntoView({ block: 'center' });
}
