import { api } from '../api';
import { editable, wireEditing } from '../edit';
import { esc, failure, href, icon, loading } from '../util';

interface ThemeSummary { key: string; title: string; short: string; desc: string; n: number; q: number }
interface Ref { author: string; work: string; workId: string; place: string; quote: string }
interface Topic {
  id: number; title: string; q: number; cmp: string; refs: Ref[];
  ans?: { text: string; scripture: string[] };
  edited?: { answer: boolean; cmp: boolean };
}
interface Theme { key: string; title: string; desc: string; topics: Topic[]; edited?: { desc: boolean } }
interface Teachings { teachings: { n: number; short: string; topic: { theme: string } }[] }

const DEFAULT_THEME = 'one-god-three-persons';
const toggled = new Map<number, boolean>();
let filter = '';
let lastKey = '';

export async function renderTopics(root: HTMLElement, params: URLSearchParams): Promise<void> {
  if (!root.querySelector('.topics-page')) root.innerHTML = loading('Loading topics…');
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

  const pills = themes.map((t) => `<a class="pill" href="${href('topics', { theme: t.key })}" aria-pressed="${t.key === key}" title="${esc(t.title)}">${esc(t.short || t.title)}${t.key === key ? ` · ${t.n}` : ''}</a>`).join('');

  const card = (tp: Topic) => {
    const open = toggled.has(tp.id) ? toggled.get(tp.id)! : tp.id === focus;
    const verses = (tp.ans?.scripture || []).map((r) => `<a class="chip" href="${href('reference', { exact: r })}">${esc(r)}</a>`).join('');
    const refs = tp.refs.map((r) => `<a class="ref-row" href="${href('reader', { work: r.workId, quote: r.quote })}">
        <span class="who"><b>${esc(r.author)}</b><span>${esc(r.place ? `${r.work} · ${r.place}` : r.work)}</span></span>
        <span class="quote">“${esc(r.quote)}”</span></a>`).join('');
    const body = open ? `<div class="topic-body">
        ${tp.ans ? editable(`topic:${tp.id}:answer`, `<p class="read-text">${esc(tp.ans.text)}</p>`, { text: tp.ans.text, edited: tp.edited?.answer, label: 'answer' }) + `<div class="row">${verses}</div>` : ''}
        <div class="soft">
          <span class="small-caps">What earlier Christian writers thought</span>
          ${editable(`topic:${tp.id}:cmp`, `<p style="font-size: 15px; color: var(--ink-2)">${esc(tp.cmp)}</p>`, { text: tp.cmp, edited: tp.edited?.cmp, label: 'summary of the earlier writers' })}
          ${refs}
          <a href="${href('qa', { topic: tp.title })}" style="font-weight: 600">${tp.q} questions answered by the writers →</a>
        </div>
      </div>` : '';
    return `<article class="card topic${tp.id === focus ? ' focus' : ''}" id="topic-${tp.id}" data-title="${esc(tp.title.toLowerCase())}">
      <button type="button" class="topic-toggle" data-topic="${tp.id}" aria-expanded="${open}">
        <span class="t">${esc(tp.title)}</span>${open ? '' : `<span class="n">${tp.q} questions</span>`}<span class="round">${icon.chevron}</span>
      </button>${body}
    </article>`;
  };

  root.innerHTML = `<div class="page topics-page">
    <div class="topics-head">
      <div class="intro">
        <span class="eyebrow">Topics</span>
        <h1>Themes and topics on the Trinity</h1>
      </div>
      <label class="search"><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m13.5 13.5 3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        <span class="sr-only">Filter topics in this theme</span><input id="topic-filter" type="search" value="${esc(filter)}" placeholder="Filter ${cur.n} topics in this theme"></label>
    </div>
    <nav class="pills" aria-label="Themes">${pills}</nav>
    <div class="cols">
      <section class="content" aria-label="Topics in ${esc(theme.title)}">
        ${theme.topics.map(card).join('')}
        <p class="status" id="topic-none" hidden>No topics in this theme match.</p>
      </section>
      <aside class="side" aria-label="About this theme">
        <div class="card dark theme-panel">
          <span class="small-caps">Theme</span>
          <h2>${esc(theme.title)}</h2>
          ${editable(`theme:${key}:desc`, `<p>${esc(theme.desc)}</p>`, { text: theme.desc, edited: theme.edited?.desc, label: 'theme description' })}
          <div class="stats"><span><b>${cur.n}</b>topics</span><span><b>${cur.q}</b>questions</span></div>
        </div>
        ${start ? `<a class="card start-card" href="${href('explanations', { t: start.n })}"><span class="small-caps">Start with the teaching</span><span>${start.n} · ${esc(start.short)}</span><span>Open in Explanations →</span></a>` : ''}
      </aside>
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
  root.querySelector('.pills [aria-pressed="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  if (focus && !toggled.has(focus)) document.getElementById(`topic-${focus}`)?.scrollIntoView({ block: 'start' });
}
