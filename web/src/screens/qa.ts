import { api } from '../api';
import { editable, editingOn, wireEditing } from '../edit';
import { mdParas } from '../markdown';
import { type Lang, langSwitch, pickLang, tamilCredit } from '../lang';
import { debounce, esc, failure, href, icon, loading, navigate } from '../util';
import { book, writer } from '../writers';

interface Item { id: number; question: string; question_ta?: string | null; cat: string; theme: string; topic: string; writers: string[] }
interface Result {
  total: number; items: Item[]; topicName: string | null;
  themes: string[]; cats: string[]; writers: { id: number; name: string }[];
}
interface Detail {
  question: string;
  question_ta?: string | null;
  edited?: { text: boolean; synthesis: boolean; answers: boolean[] };
  synthesis: string;
  answers: { author: string; work: string; place: string; answer: string; answer_ta?: string | null; quote: string; scripture: string[]; workId: string }[];
}

const PAGE = 25;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

// The page's own words in each language.
const UI: Record<Lang, {
  loading: string; eyebrow: string; heading: string; intro: string; search: string; placeholder: string;
  theme: string; allThemes: string; writer: string; allWriters: string; kind: string; allKinds: string;
  order: string; deep: string; many: string; byTheme: string; onTopic: string; showAll: string;
  none: string; showing: (n: number, total: string) => string; more: (n: number) => string;
  answeredBy: string; writers: (n: number) => string; answers: (answers: number, writers: number) => string;
  wording: string; topic: string; close: string; cats: Record<string, string>;
}> = {
  en: {
    loading: 'Loading questions…', eyebrow: 'Q&amp;A', heading: 'Questions answered by early Christian writers on the Trinity',
    intro: 'Open a question to see each writer’s answer, his own words, and where to find them.',
    search: 'Search questions', placeholder: 'Ask about the Son, the Spirit, a verse, or a number like Q505…',
    theme: 'Theme', allThemes: 'All themes', writer: 'Writer', allWriters: 'All writers', kind: 'Kind', allKinds: 'All kinds',
    order: 'Order', deep: 'Most thought-provoking first', many: 'Most writers first', byTheme: 'By theme',
    onTopic: 'Questions on the topic', showAll: 'Show all questions', none: 'No questions match.',
    showing: (n, total) => `Showing ${n} of ${total} questions`, more: (n) => `Show ${n} more questions`,
    answeredBy: 'Answered by ', writers: (n) => `${n} writers: `,
    // "1 answer", "3 answers", or "9 answers from 7 writers" when some writers answer more than once.
    answers: (a, w) => (a === w ? plural(a, 'answer') : `${plural(a, 'answer')} from ${plural(w, 'writer')}`),
    wording: 'Question wording', topic: 'Topic', close: 'Close this question', cats: {},
  },
  ta: {
    loading: 'கேள்விகள் ஏற்றப்படுகின்றன…', eyebrow: 'கேள்வி-பதில்',
    heading: 'திரித்துவம் பற்றி ஆரம்பகால கிறிஸ்தவ எழுத்தாளர்கள் பதிலளித்த கேள்விகள்',
    intro: 'ஒரு கேள்வியைத் திறந்து, ஒவ்வொரு எழுத்தாளரின் பதிலையும், அவருடைய சொந்த வார்த்தைகளையும், அவை எங்கே உள்ளன என்பதையும் பாருங்கள்.',
    search: 'கேள்விகளில் தேடுங்கள்', placeholder: 'குமாரன், ஆவியானவர், ஒரு வசனம், அல்லது Q505 போன்ற எண்…',
    theme: 'கருப்பொருள்', allThemes: 'எல்லாக் கருப்பொருள்களும்', writer: 'எழுத்தாளர்', allWriters: 'எல்லா எழுத்தாளர்களும்',
    kind: 'வகை', allKinds: 'எல்லா வகைகளும்', order: 'வரிசை', deep: 'அதிகம் சிந்திக்கவைப்பவை முதலில்',
    many: 'அதிக எழுத்தாளர்கள் உள்ளவை முதலில்', byTheme: 'கருப்பொருள் வாரியாக',
    onTopic: 'இந்தத் தலைப்பிலான கேள்விகள்:', showAll: 'எல்லாக் கேள்விகளையும் காட்டு', none: 'பொருந்தும் கேள்விகள் இல்லை.',
    showing: (n, total) => `${total} கேள்விகளில் ${n} காட்டப்படுகின்றன`, more: (n) => `இன்னும் ${n} கேள்விகளைக் காட்டு`,
    answeredBy: 'பதிலளித்தவர்: ', writers: (n) => `${n} எழுத்தாளர்கள்: `,
    answers: (a, w) => (a === w ? `${a} பதில்கள்` : `${w} எழுத்தாளர்களிடமிருந்து ${a} பதில்கள்`),
    wording: 'கேள்வியின் வாசகம்', topic: 'தலைப்பு', close: 'இந்தக் கேள்வியை மூடு',
    cats: { theological: 'இறையியல்', exegetical: 'வேதவிளக்கம்', philosophical: 'தத்துவம்', logical: 'தர்க்கம்' },
  },
};

export async function renderQA(root: HTMLElement, params: URLSearchParams): Promise<void> {
  const state = {
    q: params.get('q') || '', theme: params.get('theme') || '', writer: params.get('writer') || '',
    cat: params.get('cat') || '', sort: params.get('sort') || 'deep', topic: params.get('topic') || '',
    open: params.get('open') || '', shown: Number(params.get('shown') || PAGE),
  };
  const set = (patch: Partial<typeof state>) => navigate('qa', { ...state, shown: PAGE, open: '', ...patch }, true);

  const lang = pickLang(params);
  const ui = UI[lang];
  // In Tamil, each part shows its translation where it has one, else its English. Editing is of the English only.
  const ta = lang === 'ta';
  const tr = (en: string, t?: string | null) => (ta && t ? t : en);
  const catName = (c: string) => tr(cap(c), ui.cats[c]);
  const keepFocus = document.activeElement?.id;
  if (!root.querySelector('.qa-page')) root.innerHTML = loading(ui.loading);
  let res: Result;
  let detail: Detail | null = null;
  // Tamil theme names come from the Topics data, in the same order as the Q&A's themes.
  let themesTa: (string | null | undefined)[] = [];
  try {
    if (ta) themesTa = (await api<{ title_ta?: string | null }[]>('themes')).map((t) => t.title_ta);
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
    const writers = (x.writers.length === 1 ? ui.answeredBy : ui.writers(x.writers.length)) + x.writers.map(writer).join(', ');
    let body = '';
    if (isOpen && detail) {
      const d = detail;
      const answers = d.answers.map((a, n) => `<li class="answer">
          <span class="a-badge" aria-hidden="true">A</span>
          <div class="answer-main">
            <div class="answer-head"><b>${esc(writer(a.author))}</b>
              <a href="${href('reader', { work: a.workId, quote: a.quote })}">${esc(a.place ? `${book(a.work, a.workId)} · ${a.place}` : book(a.work, a.workId))} →</a></div>
            ${ta && a.answer_ta ? mdParas(a.answer_ta, 'answer-text') : editable(`question:${x.id}:answer:${n}`, mdParas(a.answer, 'answer-text'), { text: a.answer, edited: d.edited?.answers[n], label: `${a.author}’s answer` })}
            <blockquote class="quote">“${esc(a.quote)}”</blockquote>
            ${a.scripture.length ? `<div class="row">${a.scripture.map((r) => `<a class="chip" href="${href('reference', { exact: r })}">${esc(r)}</a>`).join('')}</div>` : ''}
          </div>
        </li>`).join('');
      body = `<div class="qa-body">
        ${editingOn() && !ta ? editable(`question:${x.id}:text`, `<span class="small-caps">${ui.wording}</span><p class="q" style="font-family: var(--display); font-size: 19px">${esc(d.question)}</p>`, { text: d.question, edited: d.edited?.text, label: 'question wording' }) : ''}
        <span class="small-caps answers-label">${ui.answers(d.answers.length, new Set(d.answers.map((a) => a.author)).size)}</span>
        <ol class="answers" aria-label="Answers">${answers}</ol>
        <div class="qa-foot"><a class="chip dark" href="${href('topics', { title: x.topic })}">${ui.topic}: ${esc(x.topic)}</a>
          <button type="button" class="linkish" data-q="${x.id}">${ui.close}</button></div>
      </div>`;
    }
    return `<article class="card qa${isOpen ? ' open' : ''}">
      <button type="button" class="qa-toggle" data-q="${x.id}" aria-expanded="${isOpen}">
        <span class="q-badge" aria-hidden="true">Q</span>
        <span class="txt"><span class="meta"><span class="q-num">Q${x.id}</span> · ${esc(catName(x.cat))} · ${esc(tr(x.theme, themesTa[res.themes.indexOf(x.theme)]))}</span><span class="q">${esc(tr(x.question, x.question_ta))}</span><span class="who">${esc(writers)}</span></span>
        <span class="round">${icon.chevron}</span>
      </button>${body}
    </article>`;
  }).join('');

  const status = res.total === 0 ? ui.none : ui.showing(Math.min(state.shown, res.total), res.total.toLocaleString('en'));
  const here = (l: Lang) => href('qa', { ...state, shown: undefined, lang: l });
  root.innerHTML = `<div class="page narrow qa-page" lang="${lang}">
    <div class="intro">
      <span class="eyebrow">${ui.eyebrow}</span>
      <h1>${ui.heading}</h1>
      <p>${ui.intro}</p>
      ${langSwitch(lang, here)}
    </div>
    <div class="card filters">
      <label class="field wide">${ui.search}<input id="qa-q" type="search" value="${esc(state.q)}" placeholder="${esc(ui.placeholder)}"></label>
      <label class="field">${ui.theme}<select id="qa-theme">${opt(res.themes.map((t, i) => ({ v: String(i), label: tr(t, themesTa[i]) })), state.theme, ui.allThemes)}</select></label>
      <label class="field">${ui.writer}<select id="qa-writer">${opt(res.writers.map((w) => ({ v: String(w.id), label: writer(w.name) })), state.writer, ui.allWriters)}</select></label>
      <label class="field">${ui.kind}<select id="qa-cat">${opt(res.cats.map((c, i) => ({ v: String(i), label: catName(c) })), state.cat, ui.allKinds)}</select></label>
      <label class="field">${ui.order}<select id="qa-sort"><option value="deep"${state.sort === 'deep' ? ' selected' : ''}>${ui.deep}</option><option value="many"${state.sort === 'many' ? ' selected' : ''}>${ui.many}</option><option value="theme"${state.sort === 'theme' ? ' selected' : ''}>${ui.byTheme}</option></select></label>
    </div>
    ${res.topicName ? `<div class="banner"><span>${ui.onTopic} <strong>${esc(res.topicName)}</strong></span><button type="button" id="qa-clear">${ui.showAll}</button></div>` : ''}
    <p class="status" role="status">${status}</p>
    <div class="qa-list">${items}</div>
    ${res.total > state.shown ? `<div class="more"><button type="button" class="btn" id="qa-more">${ui.more(PAGE)}</button></div>` : ''}
    ${ta && res.items.some((x) => x.question_ta) ? tamilCredit('The questions and answers are') : ''}
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
