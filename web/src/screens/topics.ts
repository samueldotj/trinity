import { api } from '../api';
import { esc, failure, href, icon, loading, navigate } from '../util';

interface ThemeSummary { key: string; title: string; short: string; desc: string; n: number; q: number }
interface Ref { author: string; work: string; workId: string; place: string; quote: string }
interface Topic { id: number; title: string; q: number; cmp: string; refs: Ref[]; ans?: { text: string; scripture: string[] } }
interface Theme { key: string; title: string; desc: string; topics: Topic[] }

const DEFAULT_THEME = 'one-god-three-persons';
const toggled = new Map<number, boolean>();

export async function renderTopics(root: HTMLElement, params: URLSearchParams): Promise<void> {
  if (!root.querySelector('.topics')) root.innerHTML = loading('Loading topics…');
  let themes: ThemeSummary[];
  let key = params.get('theme') || '';
  let focus = 0;
  try {
    themes = await api<ThemeSummary[]>('themes');
    const topicId = params.get('topic');
    const title = params.get('title');
    if (topicId || title) {
      const hit = await api<{ theme: string; topic: number }>('topic', { id: topicId, title });
      key = hit.theme;
      focus = hit.topic;
    }
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }
  if (!themes.some((t) => t.key === key)) key = DEFAULT_THEME;
  let theme: Theme;
  try {
    theme = await api<Theme>('theme', { key });
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }
  const cur = themes.find((t) => t.key === key)!;

  const side = themes.map((t) => `<button type="button" class="theme-btn" data-theme="${esc(t.key)}" aria-pressed="${t.key === key}" title="${esc(t.title)}"><span>${esc(t.short || t.title)}</span><small>${t.n}</small></button>`).join('');

  const cards = theme.topics.map((tp) => {
    const open = toggled.has(tp.id) ? toggled.get(tp.id)! : tp.id === focus;
    const verses = (tp.ans?.scripture || []).map((r) => `<a class="chip" href="${href('reference', { exact: r })}">${esc(r)}</a>`).join('');
    const refs = tp.refs.map((r) => `<a class="ref-row" href="${href('reader', { work: r.workId, quote: r.quote })}">
        <span class="who"><b>${esc(r.author)}</b><span>${esc(r.place ? `${r.work} · ${r.place}` : r.work)}</span></span>
        <span class="quote">“${esc(r.quote)}”</span></a>`).join('');
    const body = open ? `<div class="topic-body">
        ${tp.ans ? `<div style="display: flex; flex-direction: column; gap: 10px">
          <span class="small-caps" style="color: var(--accent)">Answer</span>
          <p class="serif-text">${esc(tp.ans.text)}</p>
          <div class="row">${verses}</div>
        </div>` : ''}
        <div class="soft"><span class="small-caps">What earlier Christian writers thought</span><p style="font-size: 15px; color: #2A2E37">${esc(tp.cmp)}</p></div>
        <div class="refs"><span class="small-caps" style="padding-bottom: 6px">Where they say it</span>${refs}</div>
      </div>` : '';
    return `<article class="card topic${tp.id === focus ? ' focus' : ''}" id="topic-${tp.id}">
      <div class="topic-head">
        <button type="button" class="topic-toggle" data-topic="${tp.id}" aria-expanded="${open}"><span class="round${open ? ' open' : ''}">${icon.chevron}</span><span>${esc(tp.title)}</span></button>
        <a href="${href('qa', { topic: tp.title })}" style="font-size: 14px; font-weight: 600; white-space: nowrap">${tp.q} questions →</a>
      </div>
      ${body}
    </article>`;
  }).join('');

  root.innerHTML = `<div class="page topics">
    <div class="intro">
      <span class="eyebrow">Topics</span>
      <h1>Themes and topics on the Trinity</h1>
      <p>Open a question to read the answer, what earlier Christian writers thought, and the exact places they say it.</p>
    </div>
    <div class="cols">
      <nav class="side card themes" aria-label="Themes"><span class="small-caps" style="padding: 8px 10px">Themes</span>${side}</nav>
      <section class="content" aria-label="Topics in theme">
        <div style="display: flex; flex-direction: column; gap: 6px">
          <span style="font-size: 13px; font-weight: 600; color: var(--faint)">Theme · ${cur.n} topics · ${cur.q} questions</span>
          <h2 style="font-size: 32px; line-height: 1.15">${esc(theme.title)}</h2>
          <p style="color: var(--ink-2)">${esc(theme.desc)}</p>
        </div>
        ${cards}
      </section>
    </div>
  </div>`;

  root.querySelectorAll<HTMLButtonElement>('[data-theme]').forEach((b) => b.addEventListener('click', () => navigate('topics', { theme: b.dataset.theme })));
  root.querySelectorAll<HTMLButtonElement>('[data-topic]').forEach((b) => b.addEventListener('click', () => {
    const id = Number(b.dataset.topic);
    toggled.set(id, b.getAttribute('aria-expanded') !== 'true');
    void renderTopics(root, params);
  }));
  if (focus && !toggled.has(focus)) document.getElementById(`topic-${focus}`)?.scrollIntoView({ block: 'start' });
}
