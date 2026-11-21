import { api } from '../api';
import { mdParas } from '../markdown';
import { esc, failure, href, icon, loading, navigate } from '../util';

interface Denied { n: number; short: string; title: string }
interface Heresy {
  id: string; era: number; kind: string; name: string;
  year: string; place: string; founder: string; summary: string;
  denies: Denied[];
}
interface Data {
  intro: string;
  kinds: Record<string, string>;
  eras: { title: string; note: string }[];
  heresies: Heresy[];
}

/**
 * Heresies: teachings and movements that deny the doctrine of the Trinity or of Christ, by period.
 * `?h=<id>` scrolls to one entry; `?t=<n>` shows only those that deny teaching n; `?kind=` filters by kind.
 */
export async function renderHeresies(root: HTMLElement, params: URLSearchParams): Promise<void> {
  if (!root.querySelector('.heresies')) root.innerHTML = loading('Loading the heresies…');
  let data: Data;
  try {
    data = await api<Data>('heresies');
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }
  const want = params.get('h') || '';
  const kind = params.get('kind') || '';
  const teaching = Number(params.get('t')) || 0;
  const deniedTitle = data.heresies.flatMap((h) => h.denies).find((d) => d.n === teaching);
  const shown = data.heresies.filter((h) =>
    (!kind || h.kind === kind) && (!teaching || h.denies.some((d) => d.n === teaching)));

  const entry = (h: Heresy) => `<article class="card heresy${h.id === want ? ' is-target' : ''}" id="heresy-${esc(h.id)}" aria-labelledby="hh-${esc(h.id)}" tabindex="-1">
      <header class="heresy-head">
        <span class="small-caps heresy-kind">${esc(data.kinds[h.kind] || h.kind)}</span>
        <h3 id="hh-${esc(h.id)}">${esc(h.name)}</h3>
        <dl class="heresy-facts">
          <div><dt>Origin</dt><dd>${esc(h.year)}</dd></div>
          <div><dt>Place</dt><dd>${esc(h.place)}</dd></div>
          <div><dt>Founder</dt><dd>${esc(h.founder)}</dd></div>
        </dl>
      </header>
      ${mdParas(h.summary, 'heresy-text')}
      ${h.denies.length ? `<p class="heresy-denies"><span class="small-caps">Denies</span> ${h.denies.map((d) =>
        `<a href="${href('explanations', { t: d.n })}"${d.n === teaching ? ' aria-current="true"' : ''}>${d.n} · ${esc(d.short)}</a>`).join('')}</p>` : ''}
    </article>`;

  const sections = data.eras.map((era, i) => {
    const list = shown.filter((h) => h.era === i);
    if (!list.length) return '';
    return `<section class="heresy-era" aria-labelledby="era-${i}">
        <div class="heresy-era-head"><h2 id="era-${i}">${esc(era.title)}</h2><p>${esc(era.note)}</p></div>
        ${list.map(entry).join('')}
      </section>`;
  }).join('');

  const index = shown.map((h) => `<a href="${href('heresies', { h: h.id, t: teaching || undefined, kind: kind || undefined })}">${esc(h.name)}</a>`).join('');
  const kinds = Object.entries(data.kinds).map(([k, label]) => `<option value="${esc(k)}"${k === kind ? ' selected' : ''}>${esc(label)}</option>`).join('');

  root.innerHTML = `<div class="page heresies">
    <header class="kw-head">
      ${teaching ? `<a class="btn" href="${href('explanations', { t: teaching })}">${icon.left}Back to teaching ${teaching}${deniedTitle ? ` · ${esc(deniedTitle.short)}` : ''}</a>` : ''}
      <h1>Heresies</h1>
      <p class="detail">${esc(data.intro)}</p>
      <div class="heresy-filters">
        <label class="field">Kind<select id="heresy-kind"><option value="">All kinds</option>${kinds}</select></label>
      </div>
    </header>
    ${teaching && deniedTitle ? `<div class="banner"><span>Showing the ${shown.length} that deny teaching ${teaching}: <strong>${esc(deniedTitle.title)}</strong></span><button type="button" id="heresy-all">Show all</button></div>` : ''}
    <nav class="kw-index" aria-label="Heresies">${index}</nav>
    ${sections || '<p class="status">Nothing matches.</p>'}
  </div>`;

  root.querySelector<HTMLSelectElement>('#heresy-kind')!.addEventListener('change', (e) =>
    navigate('heresies', { kind: (e.target as HTMLSelectElement).value, t: teaching || undefined }, true));
  root.querySelector('#heresy-all')?.addEventListener('click', () => navigate('heresies', { kind: kind || undefined }, true));
  if (want) {
    const target = root.querySelector<HTMLElement>(`#heresy-${CSS.escape(want)}`);
    if (target) {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    }
  }
}
