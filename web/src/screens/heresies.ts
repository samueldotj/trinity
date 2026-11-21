import { api } from '../api';
import { type Lang, langSwitch, pickLang } from '../lang';
import { mdParas } from '../markdown';
import { esc, failure, href, icon, loading, navigate } from '../util';

interface Denied { n: number; short: string; title: string; title_ta?: string }
interface Heresy {
  id: string; era: number; kind: string; name: string;
  year: string; place: string; founder: string; summary: string;
  /** The same, translated into Tamil. */
  name_ta?: string; year_ta?: string; place_ta?: string; founder_ta?: string; summary_ta?: string;
  denies: Denied[];
}
interface Data {
  intro: string;
  kinds: Record<string, string>;
  eras: { title: string; note: string; title_ta?: string; note_ta?: string }[];
  heresies: Heresy[];
  intro_ta?: string;
  kinds_ta?: Record<string, string>;
}

// The page's own words in each language.
const UI: Record<Lang, {
  title: string; loading: string; origin: string; place: string; founder: string; denies: string;
  kind: string; allKinds: string; back: (n: number) => string; showing: (k: number, n: number) => string;
  showAll: string; none: string; index: string;
}> = {
  en: {
    title: 'Heresies', loading: 'Loading the heresies…', origin: 'Origin', place: 'Place', founder: 'Founder',
    denies: 'Denies', kind: 'Kind', allKinds: 'All kinds', back: (n) => `Back to teaching ${n}`,
    showing: (k, n) => `Showing the ${k} that deny teaching ${n}:`, showAll: 'Show all', none: 'Nothing matches.',
    index: 'Heresies',
  },
  ta: {
    title: 'வேதப்புரட்டுகள்', loading: 'வேதப்புரட்டுகள் ஏற்றப்படுகின்றன…', origin: 'தோற்றம்', place: 'இடம்',
    founder: 'தோற்றுவித்தவர்', denies: 'மறுப்பவை', kind: 'வகை', allKinds: 'எல்லா வகைகளும்',
    back: (n) => `போதனை ${n}-க்குத் திரும்பு`,
    showing: (k, n) => `போதனை ${n}-ஐ மறுக்கும் ${k} வேதப்புரட்டுகள்:`, showAll: 'எல்லாவற்றையும் காட்டு',
    none: 'எதுவும் பொருந்தவில்லை.', index: 'வேதப்புரட்டுகள்',
  },
};

/**
 * Heresies: teachings and movements that deny the doctrine of the Trinity or of Christ, by period.
 * `?h=<id>` scrolls to one entry; `?t=<n>` shows only those that deny teaching n; `?kind=` filters by kind.
 */
export async function renderHeresies(root: HTMLElement, params: URLSearchParams): Promise<void> {
  const lang = pickLang(params);
  const ui = UI[lang];
  if (!root.querySelector('.heresies')) root.innerHTML = loading(ui.loading);
  let data: Data;
  try {
    data = await api<Data>('heresies');
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }
  // In Tamil, each part shows its translation where it has one, else its English.
  const ta = lang === 'ta';
  const tr = (en: string, t?: string) => (ta && t ? t : en);
  const kindLabel = (k: string) => tr(data.kinds[k] || k, data.kinds_ta?.[k]);
  const deniedLabel = (d: Denied) => (ta && d.title_ta ? d.title_ta : d.short);
  const want = params.get('h') || '';
  const kind = params.get('kind') || '';
  const teaching = Number(params.get('t')) || 0;
  const deniedTitle = data.heresies.flatMap((h) => h.denies).find((d) => d.n === teaching);
  const shown = data.heresies.filter((h) =>
    (!kind || h.kind === kind) && (!teaching || h.denies.some((d) => d.n === teaching)));

  const entry = (h: Heresy) => `<article class="card heresy${h.id === want ? ' is-target' : ''}" id="heresy-${esc(h.id)}" aria-labelledby="hh-${esc(h.id)}" tabindex="-1">
      <header class="heresy-head">
        <span class="small-caps heresy-kind">${esc(kindLabel(h.kind))}</span>
        <h3 id="hh-${esc(h.id)}">${esc(tr(h.name, h.name_ta))}</h3>
        ${ta && h.name_ta ? `<p class="kw-en" lang="en">${esc(h.name)}</p>` : ''}
        <dl class="heresy-facts">
          <div><dt>${esc(ui.origin)}</dt><dd>${esc(tr(h.year, h.year_ta))}</dd></div>
          <div><dt>${esc(ui.place)}</dt><dd>${esc(tr(h.place, h.place_ta))}</dd></div>
          <div><dt>${esc(ui.founder)}</dt><dd>${esc(tr(h.founder, h.founder_ta))}</dd></div>
        </dl>
      </header>
      ${ta && h.summary_ta ? mdParas(h.summary_ta, 'heresy-text') : mdParas(h.summary, 'heresy-text')}
      ${h.denies.length ? `<p class="heresy-denies"><span class="small-caps">${esc(ui.denies)}</span> ${h.denies.map((d) =>
        `<a href="${href('explanations', { t: d.n })}"${d.n === teaching ? ' aria-current="true"' : ''}>${d.n} · ${esc(deniedLabel(d))}</a>`).join('')}</p>` : ''}
    </article>`;

  const sections = data.eras.map((era, i) => {
    const list = shown.filter((h) => h.era === i);
    if (!list.length) return '';
    return `<section class="heresy-era" aria-labelledby="era-${i}">
        <div class="heresy-era-head"><h2 id="era-${i}">${esc(tr(era.title, era.title_ta))}</h2><p>${esc(tr(era.note, era.note_ta))}</p></div>
        ${list.map(entry).join('')}
      </section>`;
  }).join('');

  const index = shown.map((h) => `<a href="${href('heresies', { h: h.id, t: teaching || undefined, kind: kind || undefined, lang })}">${esc(tr(h.name, h.name_ta))}</a>`).join('');
  const kinds = Object.keys(data.kinds).map((k) => `<option value="${esc(k)}"${k === kind ? ' selected' : ''}>${esc(kindLabel(k))}</option>`).join('');
  const switcher = langSwitch(lang, (l) => href('heresies', { h: want || undefined, t: teaching || undefined, kind: kind || undefined, lang: l }));
  const bannerTitle = deniedTitle && (ta && deniedTitle.title_ta ? deniedTitle.title_ta : deniedTitle.title);

  root.innerHTML = `<div class="page heresies" lang="${lang}">
    <header class="kw-head">
      <div class="kw-top">
        ${teaching ? `<a class="btn" href="${href('explanations', { t: teaching })}">${icon.left}${esc(ui.back(teaching))}${deniedTitle ? ` · ${esc(deniedLabel(deniedTitle))}` : ''}</a>` : ''}
        ${switcher}
      </div>
      <h1>${esc(ui.title)}</h1>
      <p class="detail">${esc(tr(data.intro, data.intro_ta))}</p>
      <div class="heresy-filters">
        <label class="field">${esc(ui.kind)}<select id="heresy-kind"><option value="">${esc(ui.allKinds)}</option>${kinds}</select></label>
      </div>
    </header>
    ${teaching && deniedTitle ? `<div class="banner"><span>${esc(ui.showing(shown.length, teaching))} <strong>${esc(bannerTitle!)}</strong></span><button type="button" id="heresy-all">${esc(ui.showAll)}</button></div>` : ''}
    <nav class="kw-index" aria-label="${esc(ui.index)}">${index}</nav>
    ${sections || `<p class="status">${esc(ui.none)}</p>`}
  </div>`;

  root.querySelector<HTMLSelectElement>('#heresy-kind')!.addEventListener('change', (e) =>
    navigate('heresies', { kind: (e.target as HTMLSelectElement).value, t: teaching || undefined, lang }, true));
  root.querySelector('#heresy-all')?.addEventListener('click', () => navigate('heresies', { kind: kind || undefined, lang }, true));
  if (want) {
    const target = root.querySelector<HTMLElement>(`#heresy-${CSS.escape(want)}`);
    if (target) {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    }
  }
}
