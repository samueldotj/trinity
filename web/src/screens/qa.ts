import { api } from '../api';
import { editable, editingOn, wireEditing } from '../edit';
import { mdParas } from '../markdown';
import { debounce, esc, failure, href, icon, loading, navigate } from '../util';

interface Item { id: number; question: string; cat: string; theme: string; topic: string; writers: string[] }
interface Result {
  total: number; items: Item[]; topicName: string | null;
  themes: string[]; cats: string[]; writers: { id: number; name: string }[];
}
interface Detail {
  question: string;
  edited?: { text: boolean; synthesis: boolean; answers: boolean[] };
  synthesis: string;
  answers: { author: string; work: string; place: string; answer: string; quote: string; scripture: string[]; workId: string }[];
}

const PAGE = 25;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
/** "1 answer", "3 answers", or "9 answers from 7 writers" when some writers answer more than once. */
const answersLabel = (answers: number, writers: number) =>
  answers === writers ? plural(answers, 'answer') : `${plural(answers, 'answer')} from ${plural(writers, 'writer')}`;

export async function renderQA(root: HTMLElement, params: URLSearchParams): Promise<void> {
  const state = {
    q: params.get('q') || '', theme: params.get('theme') || '', writer: params.get('writer') || '',
    cat: params.get('cat') || '', sort: params.get('sort') || 'deep', topic: params.get('topic') || '',
    open: params.get('open') || '', shown: Number(params.get('shown') || PAGE),
  };
  const set = (patch: Partial<typeof state>) => navigate('qa', { ...state, shown: PAGE, open: '', ...patch }, true);

  const keepFocus = document.activeElement?.id;
  if (!root.querySelector('.qa-page')) root.innerHTML = loading('Loading questions…');
  let res: Result;
  let detail: Detail | null = null;
  try {
    res = await api<Result>('questions', { q: state.q, theme: state.theme, writer: state.writer, cat: state.cat, sort: state.sort, topic: state.topic, offset: 0, limit: state.shown });
    if (state.open) detail = await api<Detail>('question', { id: state.open });
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }

  const opt = (list: { v: string; label: string }[], cur: string, all: string) =>
    `<option value="">${all}</option>` + list.map((o) => `<option value="${esc(o.v)}"${o.v === cur ? ' selected' : ''}>${esc(o.label)}</option>`).join('');

  const items = res.items.map((x) => {
    const isOpen = String(x.id) === state.open;
    const writers = (x.writers.length === 1 ? 'Answered by ' : `${x.writers.length} writers: `) + x.writers.join(', ');
    let body = '';
    if (isOpen && detail) {
      const d = detail;
      const answers = d.answers.map((a, n) => `<li class="answer">
          <span class="a-badge" aria-hidden="true">A</span>
          <div class="answer-main">
            <div class="answer-head"><b>${esc(a.author)}</b>
              <a href="${href('reader', { work: a.workId, quote: a.quote })}">${esc(a.place ? `${a.work} · ${a.place}` : a.work)} →</a></div>
            ${editable(`question:${x.id}:answer:${n}`, mdParas(a.answer, 'answer-text'), { text: a.answer, edited: d.edited?.answers[n], label: `${a.author}’s answer` })}
            <blockquote class="quote">“${esc(a.quote)}”</blockquote>
            ${a.scripture.length ? `<div class="row">${a.scripture.map((r) => `<a class="chip" href="${href('reference', { exact: r })}">${esc(r)}</a>`).join('')}</div>` : ''}
          </div>
        </li>`).join('');
      body = `<div class="qa-body">
        ${editingOn() ? editable(`question:${x.id}:text`, `<span class="small-caps">Question wording</span><p class="q" style="font-family: var(--display); font-size: 19px">${esc(d.question)}</p>`, { text: d.question, edited: d.edited?.text, label: 'question wording' }) : ''}
        <span class="small-caps answers-label">${answersLabel(d.answers.length, new Set(d.answers.map((a) => a.author)).size)}</span>
        <ol class="answers" aria-label="Answers">${answers}</ol>
        <div class="qa-foot"><a class="chip dark" href="${href('topics', { title: x.topic })}">Topic: ${esc(x.topic)}</a>
          <button type="button" class="linkish" data-q="${x.id}">Close this question</button></div>
      </div>`;
    }
    return `<article class="card qa${isOpen ? ' open' : ''}">
      <button type="button" class="qa-toggle" data-q="${x.id}" aria-expanded="${isOpen}">
        <span class="q-badge" aria-hidden="true">Q</span>
        <span class="txt"><span class="meta"><span class="q-num">Q${x.id}</span> · ${esc(cap(x.cat))} · ${esc(x.theme)}</span><span class="q">${esc(x.question)}</span><span class="who">${esc(writers)}</span></span>
        <span class="round">${icon.chevron}</span>
      </button>${body}
    </article>`;
  }).join('');

  const status = res.total === 0 ? 'No questions match.' : `Showing ${Math.min(state.shown, res.total)} of ${res.total.toLocaleString('en')} questions`;
  root.innerHTML = `<div class="page narrow qa-page">
    <div class="intro">
      <span class="eyebrow">Q&amp;A</span>
      <h1>Questions answered by early Christian writers on the Trinity</h1>
      <p>Open a question to see each writer’s answer, his own words, and where to find them.</p>
    </div>
    <div class="card filters">
      <label class="field wide">Search questions<input id="qa-q" type="search" value="${esc(state.q)}" placeholder="Ask about the Son, the Spirit, a verse, or a number like Q505…"></label>
      <label class="field">Theme<select id="qa-theme">${opt(res.themes.map((t, i) => ({ v: String(i), label: t })), state.theme, 'All themes')}</select></label>
      <label class="field">Writer<select id="qa-writer">${opt(res.writers.map((w) => ({ v: String(w.id), label: w.name })), state.writer, 'All writers')}</select></label>
      <label class="field">Kind<select id="qa-cat">${opt(res.cats.map((c, i) => ({ v: String(i), label: cap(c) })), state.cat, 'All kinds')}</select></label>
      <label class="field">Order<select id="qa-sort"><option value="deep"${state.sort === 'deep' ? ' selected' : ''}>Most thought-provoking first</option><option value="many"${state.sort === 'many' ? ' selected' : ''}>Most writers first</option><option value="theme"${state.sort === 'theme' ? ' selected' : ''}>By theme</option></select></label>
    </div>
    ${res.topicName ? `<div class="banner"><span>Questions on the topic <strong>${esc(res.topicName)}</strong></span><button type="button" id="qa-clear">Show all questions</button></div>` : ''}
    <p class="status" role="status">${status}</p>
    <div class="qa-list">${items}</div>
    ${res.total > state.shown ? `<div class="more"><button type="button" class="btn" id="qa-more">Show ${PAGE} more questions</button></div>` : ''}
  </div>`;

  if (keepFocus === 'qa-q') {
    const input = root.querySelector<HTMLInputElement>('#qa-q')!;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
  wireEditing(root, () => void renderQA(root, params));
  root.querySelector<HTMLInputElement>('#qa-q')!.addEventListener('input', debounce((e: Event) => set({ q: (e.target as HTMLInputElement).value })));
  for (const k of ['theme', 'writer', 'cat', 'sort'] as const) {
    root.querySelector<HTMLSelectElement>(`#qa-${k}`)!.addEventListener('change', (e) => set({ [k]: (e.target as HTMLSelectElement).value }));
  }
  root.querySelector('#qa-clear')?.addEventListener('click', () => set({ topic: '' }));
  root.querySelector('#qa-more')?.addEventListener('click', () => navigate('qa', { ...state, shown: state.shown + PAGE }, true));
  root.querySelectorAll<HTMLButtonElement>('[data-q]').forEach((b) => b.addEventListener('click', () =>
    navigate('qa', { ...state, open: b.dataset.q === state.open ? '' : b.dataset.q }, true)));
}
