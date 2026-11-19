import { api } from '../api';
import { debounce, esc, failure, href, icon, loading, navigate } from '../util';

interface Passage {
  ref: string; uses: number; text: string;
  themes: { key: string; label: string; full: string }[];
  topics: { id: number; title: string }[];
}
interface Result { total: number; offset: number; items: Passage[]; books: string[] }

const PAGE = 30;
const FILTERS: [string, string][] = [['all', 'All passages'], ['ot', 'Old Testament'], ['nt', 'New Testament']];
const opened = new Set<string>();

export async function renderReference(root: HTMLElement, params: URLSearchParams): Promise<void> {
  const state = {
    testament: params.get('testament') || 'all',
    book: params.get('book') || '',
    q: params.get('q') || '',
    sort: params.get('sort') || 'uses',
    exact: params.get('exact') || '',
    shown: Number(params.get('shown') || PAGE),
  };
  const set = (patch: Partial<typeof state>) => navigate('reference', { ...state, shown: PAGE, ...patch }, true);

  const keepFocus = document.activeElement?.id;
  if (!root.querySelector('.reference')) root.innerHTML = loading('Loading passages…');
  let res: Result;
  try {
    res = await api<Result>('verses', { testament: state.testament, book: state.book, q: state.q, sort: state.sort, exact: state.exact, offset: 0, limit: state.shown });
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }

  const cards = res.items.map((v) => {
    const open = opened.has(v.ref);
    const themes = (open ? v.themes : v.themes.slice(0, 6)).map((t) =>
      `<a class="chip small" href="${href('topics', { theme: t.key })}" title="${esc(t.full)}">${esc(t.label)}${icon.small}</a>`).join('');
    const topics = (open ? v.topics : v.topics.slice(0, 3)).map((t) =>
      `<li><a href="${href('topics', { topic: t.id })}">${esc(t.title)}</a></li>`).join('');
    const extra = v.topics.length - 3;
    return `<article class="card passage">
      <header><h2>${esc(v.ref)}</h2><span class="uses">${v.uses === 1 ? '1 use' : `${v.uses} uses`}</span></header>
      ${v.text ? `<p class="verse-text">${esc(v.text)} <span style="font-family: var(--sans); font-size: 12px; color: var(--faint)">BSB</span></p>` : ''}
      <div style="display: flex; flex-direction: column; gap: 8px">
        <span class="small-caps">Explains</span>
        <div class="row">${themes}</div>
        <ul class="topic-list">${topics}</ul>
        ${extra > 0 ? `<button type="button" class="linkish" data-more="${esc(v.ref)}" aria-expanded="${open}">${open ? 'Show fewer topics' : `+ ${extra} more topic${extra === 1 ? '' : 's'}`}</button>` : ''}
      </div>
    </article>`;
  }).join('');

  const status = res.total === 0 ? 'No passages match.' : `Showing ${Math.min(state.shown, res.total)} of ${res.total.toLocaleString('en')} passages`;
  root.innerHTML = `<div class="page reference">
    <div class="intro">
      <span class="eyebrow">Reference</span>
      <h1>Bible passages that support the teaching of the Trinity</h1>
      <p>Each passage shows how often the classical writers used it and the themes and topics it explains. Choose a label to open that topic.</p>
      <p style="font-size: 13px; color: var(--faint)">Scripture text: Berean Standard Bible (BSB), public domain.</p>
    </div>
    <div class="card filters">
      <div class="row" role="group" aria-label="Testament" style="flex-basis: 100%">
        ${FILTERS.map(([id, label]) => `<button type="button" class="pill" data-testament="${id}" aria-pressed="${!state.exact && state.testament === id}">${label}</button>`).join('')}
      </div>
      <label class="field">Find a passage<input id="ref-q" type="search" value="${esc(state.q)}" placeholder="e.g. John 10:30"></label>
      <label class="field">Book<select id="ref-book"><option value="">All books</option>${res.books.map((b) => `<option${b === state.book ? ' selected' : ''}>${esc(b)}</option>`).join('')}</select></label>
      <label class="field">Order<select id="ref-sort"><option value="uses"${state.sort === 'uses' ? ' selected' : ''}>Most used first</option><option value="bible"${state.sort === 'bible' ? ' selected' : ''}>Bible order</option></select></label>
    </div>
    ${state.exact ? `<div class="banner"><span>Showing <strong>${esc(state.exact)}</strong></span><button type="button" id="ref-clear">Show all passages</button></div>` : ''}
    <p class="status" role="status">${status}</p>
    <div class="grid">${cards}</div>
    ${res.total > state.shown ? `<div class="more"><button type="button" class="btn" id="ref-more">Show ${PAGE} more passages</button></div>` : ''}
  </div>`;

  if (keepFocus === 'ref-q') {
    const input = root.querySelector<HTMLInputElement>('#ref-q')!;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
  root.querySelectorAll<HTMLButtonElement>('[data-testament]').forEach((b) => b.addEventListener('click', () => set({ testament: b.dataset.testament!, book: '', exact: '' })));
  root.querySelector<HTMLInputElement>('#ref-q')!.addEventListener('input', debounce((e: Event) => set({ q: (e.target as HTMLInputElement).value, exact: '' })));
  root.querySelector<HTMLSelectElement>('#ref-book')!.addEventListener('change', (e) => set({ book: (e.target as HTMLSelectElement).value, exact: '' }));
  root.querySelector<HTMLSelectElement>('#ref-sort')!.addEventListener('change', (e) => set({ sort: (e.target as HTMLSelectElement).value }));
  root.querySelector('#ref-clear')?.addEventListener('click', () => set({ exact: '' }));
  root.querySelector('#ref-more')?.addEventListener('click', () => navigate('reference', { ...state, shown: state.shown + PAGE }, true));
  root.querySelectorAll<HTMLButtonElement>('[data-more]').forEach((b) => b.addEventListener('click', () => {
    const ref = b.dataset.more!;
    if (opened.has(ref)) opened.delete(ref); else opened.add(ref);
    void renderReference(root, params);
  }));
}
