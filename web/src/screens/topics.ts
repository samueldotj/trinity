import { api } from '../api';
import { editable, editingOn, wireEditing } from '../edit';
import { mdParas } from '../markdown';
import { type Lang, langSwitch, pickLang, tamilCredit } from '../lang';
import { esc, failure, href, icon, loading } from '../util';

interface ThemeSummary { key: string; title: string; short: string; desc: string; n: number; q: number; title_ta?: string | null; short_ta?: string | null }
interface Ref { author: string; work: string; workId: string; place: string; quote: string; quote_ta?: string }
interface Topic {
  id: number; title: string; q: number; cmp: string; refs: Ref[]; title_ta?: string;
  ans?: { text: string; scripture: string[]; text_ta?: string };
  edited?: { answer: boolean; cmp: boolean };
}
interface Theme {
  key: string; title: string; short: string; desc: string; topics: Topic[]; edited?: { desc: boolean; short: boolean };
  title_ta?: string; desc_ta?: string;
}
interface Teachings { teachings: { n: number; short: string; title_ta?: string; topic: { theme: string } }[] }

// The page's own words in each language.
const UI: Record<Lang, {
  loading: string; eyebrow: string; heading: string; filter: (n: number) => string; filterLabel: string;
  themes: string; theme: string; topics: string; questions: string; nQuestions: (n: number) => string;
  start: (n: number, label: string) => string; writers: string; similar: (n: number) => string; none: string;
}> = {
  en: {
    loading: 'Loading topics…', eyebrow: 'Topics', heading: 'Themes and topics on the Trinity',
    filter: (n) => `Filter ${n} topics in this theme`, filterLabel: 'Filter topics in this theme',
    themes: 'Themes', theme: 'Theme', topics: 'topics', questions: 'questions', nQuestions: (n) => `${n} questions`,
    start: (n, label) => `Start with teaching ${n} · ${label} →`, writers: 'What earlier Christian writers thought',
    similar: (n) => `Similar ${n} questions asked for thousands of years, and answers from early Christians →`,
    none: 'No topics in this theme match.',
  },
  ta: {
    loading: 'தலைப்புகள் ஏற்றப்படுகின்றன…', eyebrow: 'தலைப்புகள்', heading: 'திரித்துவம் பற்றிய கருப்பொருள்களும் தலைப்புகளும்',
    filter: (n) => `இந்தக் கருப்பொருளின் ${n} தலைப்புகளில் தேடுங்கள்`, filterLabel: 'இந்தக் கருப்பொருளின் தலைப்புகளில் தேடுங்கள்',
    themes: 'கருப்பொருள்கள்', theme: 'கருப்பொருள்', topics: 'தலைப்புகள்', questions: 'கேள்விகள்',
    nQuestions: (n) => `${n} கேள்விகள்`, start: (n, label) => `போதனை ${n}-இலிருந்து தொடங்குங்கள் · ${label} →`,
    writers: 'ஆரம்பகால கிறிஸ்தவ எழுத்தாளர்கள் என்ன நினைத்தார்கள்',
    similar: (n) => `ஆயிரக்கணக்கான ஆண்டுகளாகக் கேட்கப்பட்ட இதுபோன்ற ${n} கேள்விகளும், ஆரம்பகால கிறிஸ்தவர்களின் பதில்களும் →`,
    none: 'இந்தக் கருப்பொருளில் பொருந்தும் தலைப்புகள் இல்லை.',
  },
};

const DEFAULT_THEME = 'one-god-three-persons';
const toggled = new Map<number, boolean>();
let filter = '';
let lastKey = '';

export async function renderTopics(root: HTMLElement, params: URLSearchParams): Promise<void> {
  const lang = pickLang(params);
  const ui = UI[lang];
  // In Tamil, each part shows its translation where it has one, else its English. Editing is of the English only.
  const ta = lang === 'ta';
  const tr = (en: string, t?: string | null) => (ta && t ? t : en);
  if (!root.querySelector('.topics-page')) root.innerHTML = loading(ui.loading);
  let themes: ThemeSummary[];
  let theme: Theme;
  let teachings: Teachings;
  let key = params.get('theme') || '';
  let focus = 0;
  try {
    [themes, teachings] = await Promise.all([api<ThemeSummary[]>('themes'), api<Teachings>('teachings')]);
    const topicId = params.get('topic');
    const title = params.get('title');
    if (topicId || title) {
      const hit = await api<{ theme: string; topic: number }>('topic', { id: topicId, title });
      key = hit.theme;
      focus = hit.topic;
    }
    if (!themes.some((t) => t.key === key)) key = DEFAULT_THEME;
    theme = await api<Theme>('theme', { key });
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }
  if (key !== lastKey) filter = '';
  lastKey = key;
  const cur = themes.find((t) => t.key === key)!;
  const start = teachings.teachings.find((t) => t.topic.theme === theme.title);

  const pills = themes.map((t) => `<a class="theme-link" href="${href('topics', { theme: t.key, lang })}"${t.key === key ? ' aria-current="page"' : ''} title="${esc(tr(t.title, t.title_ta))}"><span>${esc(tr(t.short || t.title, t.short_ta))}</span><small>${t.n}</small></a>`).join('');
  const translated = ta && theme.topics.some((tp) => tp.title_ta);

  const card = (tp: Topic) => {
    const open = toggled.has(tp.id) ? toggled.get(tp.id)! : tp.id === focus;
    const verses = (tp.ans?.scripture || []).map((r) => `<a class="chip" href="${href('reference', { exact: r })}">${esc(r)}</a>`).join('');
    const refs = tp.refs.map((r) => `<a class="ref-row" href="${href('reader', { work: r.workId, quote: r.quote })}">
        <span class="who"><b>${esc(r.author)}</b><span>${esc(r.place ? `${r.work} · ${r.place}` : r.work)}</span></span>
        <span class="quote">“${esc(tr(r.quote, r.quote_ta))}”</span></a>`).join('');
    const answer = ta && tp.ans?.text_ta ? mdParas(tp.ans.text_ta, 'read-text')
      : tp.ans ? editable(`topic:${tp.id}:answer`, mdParas(tp.ans.text, 'read-text'), { text: tp.ans.text, edited: tp.edited?.answer, label: 'answer' }) : '';
    const body = open ? `<div class="topic-body">
        ${tp.ans ? answer + `<div class="row">${verses}</div>` : ''}
        <div class="soft">
          <span class="small-caps">${ui.writers}</span>
          ${refs}
          <a href="${href('qa', { topic: tp.title })}" style="font-weight: 600">${ui.similar(tp.q)}</a>
        </div>
      </div>` : '';
    return `<article class="card topic${tp.id === focus ? ' focus' : ''}" id="topic-${tp.id}" data-title="${esc(`${tp.title} ${tp.title_ta || ''}`.toLowerCase())}">
      <button type="button" class="topic-toggle" data-topic="${tp.id}" aria-expanded="${open}">
        <span class="t">${esc(tr(tp.title, tp.title_ta))}</span>${open ? '' : `<span class="n">${ui.nQuestions(tp.q)}</span>`}<span class="round">${icon.chevron}</span>
      </button>${body}
    </article>`;
  };

  root.innerHTML = `<div class="page topics-page" lang="${lang}">
    <div class="topics-head">
      <div class="intro">
        <span class="eyebrow">${ui.eyebrow}</span>
        <h1>${ui.heading}</h1>
        ${langSwitch(lang, (l) => href('topics', { theme: key, lang: l }))}
      </div>
      <label class="search"><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m13.5 13.5 3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        <span class="sr-only">${ui.filterLabel}</span><input id="topic-filter" type="search" value="${esc(filter)}" placeholder="${esc(ui.filter(cur.n))}"></label>
    </div>
    <div class="cols topics-cols">
      <nav class="card theme-rail" aria-label="${ui.themes}"><span class="small-caps">${ui.themes}</span>${pills}</nav>
      <section class="content" aria-label="${esc(tr(theme.title, theme.title_ta))}">
        <div class="card dark theme-panel">
          <span class="small-caps">${ui.theme}</span>
          <h2>${esc(tr(theme.title, theme.title_ta))}</h2>
          ${ta && theme.desc_ta ? mdParas(theme.desc_ta, '') : editable(`theme:${key}:desc`, mdParas(theme.desc, ''), { text: theme.desc, edited: theme.edited?.desc, label: 'theme description' })}
          ${editingOn() && !ta ? editable(`theme:${key}:short`, `<span class="small-caps">Label in menus and on passages</span><p style="color: #fff; font-weight: 600">${esc(theme.short)}</p>`, { text: theme.short, edited: theme.edited?.short, label: 'theme label' }) : ''}
          <div class="theme-panel-foot">
            <div class="stats"><span><b>${cur.n}</b>${ui.topics}</span><span><b>${cur.q}</b>${ui.questions}</span></div>
            ${start ? `<a class="start-link" href="${href('explanations', { t: start.n, lang })}">${esc(ui.start(start.n, tr(start.short, start.title_ta)))}</a>` : ''}
          </div>
        </div>
        ${theme.topics.map(card).join('')}
        <p class="status" id="topic-none" hidden>${ui.none}</p>
        ${translated ? tamilCredit('The topics, answers and quotes are') : ''}
      </section>
    </div>
  </div>`;

  const applyFilter = () => {
    const words = filter.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    root.querySelectorAll<HTMLElement>('.topic').forEach((el) => {
      const ok = words.every((w) => el.dataset.title!.includes(w));
      el.hidden = !ok;
      if (ok) shown++;
    });
    root.querySelector<HTMLElement>('#topic-none')!.hidden = shown > 0;
  };
  applyFilter();
  wireEditing(root, () => void renderTopics(root, params));
  root.querySelector<HTMLInputElement>('#topic-filter')!.addEventListener('input', (e) => {
    filter = (e.target as HTMLInputElement).value;
    applyFilter();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-topic]').forEach((b) => b.addEventListener('click', () => {
    toggled.set(Number(b.dataset.topic), b.getAttribute('aria-expanded') !== 'true');
    void renderTopics(root, params).then(() => document.querySelector<HTMLButtonElement>(`[data-topic="${b.dataset.topic}"]`)?.focus());
  }));
  const curLink = root.querySelector<HTMLElement>('.theme-rail [aria-current="page"]');
  const rail = root.querySelector<HTMLElement>('.theme-rail');
  if (curLink && rail) {
    // Bring the current theme into view inside the list without scrolling the page.
    if (rail.scrollHeight > rail.clientHeight) rail.scrollTop = curLink.offsetTop - rail.clientHeight / 2;
    else rail.scrollLeft = curLink.offsetLeft - rail.clientWidth / 2;
  }
  if (focus && !toggled.has(focus)) document.getElementById(`topic-${focus}`)?.scrollIntoView({ block: 'start' });
}
