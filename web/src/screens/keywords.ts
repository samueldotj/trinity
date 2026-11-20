import { api } from '../api';
import { editable, wireEditing } from '../edit';
import { type Glossary, termsIn } from '../glossary';
import { esc, failure, href, icon, loading } from '../util';

interface Teaching { n: number; short: string; title: string; meaning?: string; support?: string }
interface Data { glossary?: Glossary; teachings: Teaching[] }

/** Key words: every theological word the teachings use, defined, with the teachings that use it. */
export async function renderKeywords(root: HTMLElement, params: URLSearchParams): Promise<void> {
  if (!root.querySelector('.keywords')) root.innerHTML = loading('Loading the key words…');
  let data: Data;
  try {
    data = await api<Data>('teachings');
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }
  const gl = data.glossary || {};
  const want = params.get('term') || '';
  const from = Number(params.get('from')) || 0;
  const back = data.teachings.find((t) => t.n === from);

  // Which teachings mention each word, worked out the same way the explanations link them.
  const usedIn: Record<string, Teaching[]> = {};
  for (const t of data.teachings) {
    for (const k of termsIn(`${t.title} ${t.meaning || ''} ${t.support || ''}`, gl)) (usedIn[k] ||= []).push(t);
  }

  const sorted = Object.entries(gl).sort(([, a], [, b]) => a.term.localeCompare(b.term));
  const entries = sorted.map(([k, g]) => {
    const used = usedIn[k] || [];
    return `<section class="card kw-entry${k === want ? ' is-target' : ''}" id="term-${esc(k)}" aria-labelledby="h-${esc(k)}" tabindex="-1">
      <h2 id="h-${esc(k)}">${esc(g.term)}</h2>
      ${editable(`term:${k}:def`, `<p class="kw-def">${esc(g.def)}</p>`, { text: g.def, edited: g.edited, label: `definition of ${g.term}` })}
      ${used.length ? `<p class="kw-used"><span class="small-caps">Used in</span> ${used.map((t) =>
        `<a href="${href('explanations', { t: t.n })}">${t.n} · ${esc(t.short)}</a>`).join('')}</p>` : ''}
    </section>`;
  }).join('');

  const index = sorted.map(([k, g]) => `<a href="${href('keywords', { term: k, from: from || undefined })}">${esc(g.term)}</a>`).join('');

  root.innerHTML = `<div class="page keywords">
    <header class="kw-head">
      ${back ? `<a class="btn" href="${href('explanations', { t: back.n })}">${icon.left}Back to teaching ${back.n} · ${esc(back.short)}</a>` : ''}
      <h1>Key words</h1>
      <p class="detail">The theological words used in the teachings, from A to Z. In each teaching’s explanation, these words link here.</p>
      <nav class="kw-index" aria-label="Key words">${index}</nav>
    </header>
    <div class="kw-list">${entries}</div>
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
