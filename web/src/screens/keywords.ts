import { api } from '../api';
import { editable, wireEditing } from '../edit';
import { type Glossary, termsIn } from '../glossary';
import { esc, failure, href, icon, loading } from '../util';

interface Teaching { n: number; short: string; title: string; meaning?: string; support?: string }
interface Data { glossary?: Glossary; glossary_ta?: Glossary; teachings: Teaching[] }

type Lang = 'en' | 'ta';

// The page's own words in each language. The teachings themselves are in English only for now,
// so their titles in "Used in" stay English (marked lang="en").
const UI: Record<Lang, { title: string; intro: string; used: string; back: (n: number) => string; index: string; loading: string }> = {
  en: {
    title: 'Key words',
    intro: 'The theological words used in the teachings, from A to Z. In each teaching’s explanation, these words link here.',
    used: 'Used in',
    back: (n) => `Back to teaching ${n}`,
    index: 'Key words',
    loading: 'Loading the key words…',
  },
  ta: {
    title: 'முக்கியச் சொற்கள்',
    intro: 'போதனைகளில் பயன்படுத்தப்படும் இறையியல் சொற்கள். ஒவ்வொரு போதனையின் விளக்கத்திலும் இந்தச் சொற்கள் இந்தப் பக்கத்துடன் இணைக்கப்பட்டுள்ளன. போதனைகள் தற்போது ஆங்கிலத்தில் மட்டுமே உள்ளன.',
    used: 'இவற்றில் வருகிறது',
    back: (n) => `போதனை ${n}-க்குத் திரும்பு`,
    index: 'முக்கியச் சொற்கள்',
    loading: 'முக்கியச் சொற்கள் ஏற்றப்படுகின்றன…',
  },
};

const LANG_KEY = 'keywords-lang';

/** The language to show: the address says, else the reader's last choice, else English. */
function pickLang(params: URLSearchParams): Lang {
  const asked = params.get('lang');
  if (asked === 'en' || asked === 'ta') {
    try { localStorage.setItem(LANG_KEY, asked); } catch { /* ignore */ }
    return asked;
  }
  try { return localStorage.getItem(LANG_KEY) === 'ta' ? 'ta' : 'en'; } catch { return 'en'; }
}

/** Key words: every theological word the teachings use, defined, with the teachings that use it. */
export async function renderKeywords(root: HTMLElement, params: URLSearchParams): Promise<void> {
  const lang = pickLang(params);
  const ui = UI[lang];
  if (!root.querySelector('.keywords')) root.innerHTML = loading(ui.loading);
  let data: Data;
  try {
    data = await api<Data>('teachings');
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }
  const en = data.glossary || {};
  const gl = lang === 'ta' && data.glossary_ta ? data.glossary_ta : en;
  const want = params.get('term') || '';
  const from = Number(params.get('from')) || 0;
  const back = data.teachings.find((t) => t.n === from);
  const here = (p: Record<string, string | number | undefined>) => href('keywords', { term: want || undefined, from: from || undefined, lang, ...p });

  // Which teachings mention each word, worked out the same way the explanations link them.
  const usedIn: Record<string, Teaching[]> = {};
  for (const t of data.teachings) {
    for (const k of termsIn(`${t.title} ${t.meaning || ''} ${t.support || ''}`, en)) (usedIn[k] ||= []).push(t);
  }

  const sorted = Object.entries(gl).sort(([, a], [, b]) => a.term.localeCompare(b.term, lang));
  const entries = sorted.map(([k, g]) => {
    const used = usedIn[k] || [];
    const editKey = lang === 'ta' ? `term:${k}:def:ta` : `term:${k}:def`;
    return `<section class="card kw-entry${k === want ? ' is-target' : ''}" id="term-${esc(k)}" aria-labelledby="h-${esc(k)}" tabindex="-1">
      <h2 id="h-${esc(k)}">${esc(g.term)}</h2>
      ${lang === 'ta' && en[k] ? `<p class="kw-en" lang="en">${esc(en[k].term)}</p>` : ''}
      ${editable(editKey, `<p class="kw-def">${esc(g.def)}</p>`, { text: g.def, edited: g.edited, label: `definition of ${en[k]?.term || g.term}${lang === 'ta' ? ' (Tamil)' : ''}` })}
      ${used.length ? `<p class="kw-used"><span class="small-caps">${esc(ui.used)}</span> ${used.map((t) =>
        `<a href="${href('explanations', { t: t.n })}" lang="en">${t.n} · ${esc(t.short)}</a>`).join('')}</p>` : ''}
    </section>`;
  }).join('');

  const index = sorted.map(([k, g]) => `<a href="${here({ term: k })}">${esc(g.term)}</a>`).join('');
  const switcher = `<nav class="lang-switch" aria-label="Language / மொழி">
      <a href="${here({ lang: 'en' })}" lang="en"${lang === 'en' ? ' aria-current="true"' : ''}>English</a>
      <a href="${here({ lang: 'ta' })}" lang="ta"${lang === 'ta' ? ' aria-current="true"' : ''}>தமிழ்</a>
    </nav>`;
  const credit = lang === 'ta' ? `<p class="kw-credit" lang="en">Tamil Bible wording follows the
      <a href="https://ebible.org/details.php?id=tam2017">Tamil Indian Revised Version (IRV)</a>,
      © 2017, 2019 Bridge Connectivity Solutions, licensed
      <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. The definitions are translated from the English.</p>` : '';

  root.innerHTML = `<div class="page keywords" lang="${lang}">
    <header class="kw-head">
      <div class="kw-top">
        ${back ? `<a class="btn" href="${href('explanations', { t: back.n })}">${icon.left}${esc(ui.back(back.n))} · <span lang="en">${esc(back.short)}</span></a>` : ''}
        ${switcher}
      </div>
      <h1>${esc(ui.title)}</h1>
      <p class="detail">${esc(ui.intro)}</p>
      <nav class="kw-index" aria-label="${esc(ui.index)}">${index}</nav>
    </header>
    <div class="kw-list">${entries}</div>
    ${credit}
  </div>`;

  wireEditing(root, () => void renderKeywords(root, params));
  if (want) {
    const target = root.querySelector<HTMLElement>(`#term-${CSS.escape(want)}`);
    if (target) {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    }
  }
}
