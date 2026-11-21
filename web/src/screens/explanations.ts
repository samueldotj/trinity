import { animationFor, wireAnimation } from '../animations';
import { api } from '../api';
import { draw, LAYOUT } from '../diagram';
import { editable, wireEditing } from '../edit';
import { type Glossary, linkTerms, linkTermsTa } from '../glossary';
import { type Lang, langSwitch, pickLang, tamilCredit } from '../lang';
import { mdInline, mdParas, mdPlain } from '../markdown';
import { type Bubble, type Deck, present, type Slide } from '../present';
import { esc, failure, href, icon, loading, navigate } from '../util';

interface Teaching {
  n: number; g: number; short: string; title: string; detail: string; refs: string;
  /** Each passage in the BSB, and in the Tamil IRV (label_ta, text_ta) for the Tamil page. */
  verses: { label: string; text: string; ref: string; label_ta?: string; text_ta?: string }[];
  notes: string[];
  cap: string;
  note?: { title: string; text: string; see: number };
  /** "What does this mean?" and how the supporting verses support it (AI-written). */
  meaning?: string;
  support?: string;
  /** The same two, translated into Tamil. */
  meaning_ta?: string;
  support_ta?: string;
  /** The title and description, translated into Tamil. */
  title_ta?: string;
  detail_ta?: string;
  edited?: { caption: boolean; detail: boolean; meaning?: boolean; support?: boolean; detail_ta?: boolean; meaning_ta?: boolean; support_ta?: boolean };
  topic: { id: number; title: string; theme: string; q: number };
  /** Heresies that deny this teaching, from the Heresies page. */
  heresies?: { id: string; name: string; year?: string; name_ta?: string; year_ta?: string }[];
}
/** A heresy as the Heresies page has it: the presentation shows what it taught in a bubble. */
interface HeresyEntry {
  id: string; name: string; year: string; place: string; founder: string; summary: string;
  name_ta?: string; year_ta?: string; place_ta?: string; founder_ta?: string; summary_ta?: string;
}

/** A heresy's name and year in the reader's language: Tamil where translated, else English. */
function heresyIn(h: { name: string; year?: string; name_ta?: string; year_ta?: string }, lang: Lang) {
  const ta = lang === 'ta' && !!h.name_ta;
  return { name: ta ? h.name_ta! : h.name, year: (ta && h.year_ta) || h.year || '', ta };
}
interface Data { groups: { title: string; note: string }[]; glossary?: Glossary; glossary_ta?: Glossary; teachings: Teaching[] }

/** A teaching's title in the reader's language: Tamil where it has been translated, else English. */
function titleIn(t: Teaching, lang: Lang): { text: string; ta: boolean } {
  return lang === 'ta' && t.title_ta ? { text: t.title_ta, ta: true } : { text: t.title, ta: false };
}
/** `lang="ta"` for an element holding Tamil text. */
const taAttr = (ta: boolean) => (ta ? ' lang="ta"' : '');

let lastShown = '';

export async function renderExplanations(root: HTMLElement, params: URLSearchParams): Promise<void> {
  if (!root.querySelector('.lesson')) root.innerHTML = loading('Loading the teachings…');
  let data: Data;
  try {
    data = await api<Data>('teachings');
  } catch (e) {
    root.innerHTML = failure(e);
    return;
  }
  const T = data.teachings;
  const lang = pickLang(params);
  // Moving to another teaching (or the completion page) starts at the top, like turning a page.
  // Re-rendering the same one, e.g. after an edit, keeps the reader's place.
  const shown = params.has('done') ? 'done' : String(Math.min(Math.max(Number(params.get('t') || 1), 1), T.length));
  if (lastShown && shown !== lastShown) window.scrollTo({ top: 0 });
  lastShown = shown;
  if (params.has('done')) {
    renderComplete(root, data);
    return;
  }
  const i = Math.min(Math.max(Number(params.get('t') || 1), 1), T.length) - 1;
  const cur = T[i];
  const grp = data.groups[cur.g];
  const inPart = T.filter((t) => t.g === cur.g);  // the part's note shows once, on its first teaching
  // A course, not a carousel: the first teaching has no "previous", and the last leads to the completion page.
  const prev = i > 0 ? T[i - 1] : null;
  const next = i < T.length - 1 ? T[i + 1] : null;
  const link = (t: Teaching) => href('explanations', { t: t.n });

  const outline = data.groups.map((g, gi) => `<li>
      <h2 class="outline-part">Part ${gi + 1} · ${esc(g.title)}</h2>
      <ol>${T.filter((t) => t.g === gi).map((t) => `<li><a href="${link(t)}"${t.n === cur.n ? ' aria-current="page"' : ''}${t.n < cur.n ? ' class="done"' : ''}><span class="outline-n">${t.n}</span><span${taAttr(titleIn(t, lang).ta)}>${esc(titleIn(t, lang).text)}</span></a></li>`).join('')}</ol>
    </li>`).join('');

  const steps = inPart.map((t) => `<li><a href="${link(t)}" class="${t.n < cur.n ? 'done' : ''}"${t.n === cur.n ? ' aria-current="step"' : ''} aria-label="Teaching ${t.n}: ${esc(t.short)}"><span></span></a></li>`).join('');
  const jump = data.groups.map((g, gi) => `<optgroup label="${gi + 1}. ${esc(g.title)}">${
    T.filter((t) => t.g === gi).map((t) => `<option value="${t.n}"${t.n === cur.n ? ' selected' : ''}>${t.n} · ${esc(t.short)}</option>`).join('')
  }</optgroup>`).join('');

  const dg = draw(cur.n, cur.notes, cur.cap);

  // Key words in the title and explanation link to the Key words page, the first mention of each only.
  const gl = data.glossary || {};
  const seen = new Set<string>();
  // In Tamil, the title, description, explanation and how the passages support it are translated;
  // the rest stays English. A part without a translation shows its English.
  const ta = lang === 'ta' && !!cur.meaning_ta;
  const glTa = data.glossary_ta || {};
  const seenTa = new Set<string>();
  const titleTa = titleIn(cur, lang).ta;
  const title = titleTa ? linkTermsTa(cur.title_ta!, glTa, seenTa, cur.n, gl) : linkTerms(cur.title, gl, seen, cur.n);
  const detailTa = lang === 'ta' && cur.detail_ta;
  const detail = detailTa
    ? `<div lang="ta">${editable(`teaching:${cur.n}:detail:ta`, `<p class="detail">${mdInline(detailTa)}</p>`, { text: detailTa, edited: cur.edited?.detail_ta, label: 'teaching description (Tamil)' })}</div>`
    : cur.detail ? editable(`teaching:${cur.n}:detail`, `<p class="detail">${mdInline(cur.detail)}</p>`, { text: cur.detail, edited: cur.edited?.detail, label: 'teaching description' }) : '';
  const meaningText = ta ? cur.meaning_ta! : cur.meaning;
  const meaning = meaningText ? `<section class="explain" aria-labelledby="explain-h"${ta ? ' lang="ta"' : ''}>
          <h2 id="explain-h" class="small-caps">${ta ? 'இதன் பொருள் என்ன?' : 'What does this mean?'}</h2>
          ${ta
            ? editable(`teaching:${cur.n}:meaning:ta`, mdParas(meaningText, 'explain-text', (p) => linkTermsTa(p, glTa, seenTa, cur.n, gl)), { text: meaningText, edited: cur.edited?.meaning_ta, label: 'explanation (Tamil)' })
            : editable(`teaching:${cur.n}:meaning`, mdParas(meaningText, 'explain-text', (p) => linkTerms(p, gl, seen, cur.n)), { text: meaningText, edited: cur.edited?.meaning, label: 'explanation' })}
        </section>` : '';
  const supportTa = lang === 'ta' && cur.support_ta;
  const support = supportTa
    ? `<div lang="ta">${editable(`teaching:${cur.n}:support:ta`, mdParas(supportTa, 'support', (p) => linkTermsTa(p, glTa, seenTa, cur.n, gl)), { text: supportTa, edited: cur.edited?.support_ta, label: 'how the passages support it (Tamil)' })}</div>`
    : cur.support ? editable(`teaching:${cur.n}:support`, mdParas(cur.support, 'support', (p) => linkTerms(p, gl, seen, cur.n)), { text: cur.support, edited: cur.edited?.support, label: 'how the passages support it' }) : '';

  // On the Tamil page the passages are shown in the Tamil Indian Revised Version, where it has them.
  const versesTa = lang === 'ta' && cur.verses.every((v) => v.text_ta);
  const verses = cur.verses.map((v) => `<a class="card verse-card" href="${href('reference', { exact: v.ref })}"${versesTa ? ' lang="ta"' : ''}>${
    versesTa ? `<b>${esc(v.label_ta!)}</b><span class="verse-text">${esc(v.text_ta!)}</span>` : `<b>${esc(v.label)}</b><span class="verse-text">${esc(v.text)}</span>`}</a>`).join('');

  root.innerHTML = `<div class="page">
    <div class="lesson-top">
      <div class="row">
        <div class="lesson-where">
          <p class="course-progress"><b>Teaching ${cur.n} of ${T.length}</b><span class="eyebrow">Part ${cur.g + 1} of ${data.groups.length} · ${esc(grp.title)}</span></p>
          <button type="button" class="outline-btn" aria-expanded="false" aria-controls="outline">Course outline${icon.chevron}</button>
        </div>
        <div class="lesson-tools">
          ${langSwitch(lang, (l) => href('explanations', { t: cur.n, lang: l }))}
          <label class="jump">Jump to <select id="jump">${jump}</select></label>
        </div>
      </div>
      <ol class="steps" aria-label="Teachings in this part">${steps}</ol>
      <nav class="outline" id="outline" aria-label="Course outline" hidden>
        <ol class="outline-parts">${outline}</ol>
      </nav>
    </div>

    <div class="lesson">
      <section class="lesson-text" aria-label="Teaching">
        <span class="lesson-num" aria-hidden="true">${cur.n}</span>
        <h1><span class="sr-only">Teaching ${cur.n}: </span><span${taAttr(titleTa)}>${title}</span></h1>
        ${detail}
        ${meaning}
        ${cur.note ? `<aside class="note teaching-note" aria-label="${esc(cur.note.title)}"><strong>${esc(cur.note.title)}.</strong> ${esc(cur.note.text)}${
          T[cur.note.see - 1] ? ` <a href="${link(T[cur.note.see - 1])}">See teaching ${cur.note.see}: <span${taAttr(titleIn(T[cur.note.see - 1], lang).ta)}>${esc(titleIn(T[cur.note.see - 1], lang).text)}</span> →</a>` : ''}</aside>` : ''}
        ${grp.note && inPart[0] === cur ? `<p class="note"><strong>Note.</strong> ${esc(grp.note)}</p>` : ''}
        <div class="lesson-nav">
          ${prev ? `<a class="btn" href="${link(prev)}">${icon.left}${prev.n} · ${esc(prev.short)}</a>` : ''}
          ${next ? `<a class="btn primary" href="${link(next)}">${next.n} · ${esc(next.short)}${icon.right}</a>`
            : `<a class="btn primary" href="${href('explanations', { done: 1 })}">Finish the course${icon.right}</a>`}
        </div>
      </section>
      <figure class="card diagram-card">
        <button type="button" class="diagram-open" aria-label="Enlarge diagram. ${esc(mdPlain(dg.alt))}">
          <span class="diagram-fit" aria-hidden="true"></span>
          <span class="diagram-hint">${icon.expand}Tap to enlarge</span>
        </button>
        <figcaption class="caption">${editable(`teaching:${cur.n}:caption`, mdInline(dg.cap), { text: cur.cap, edited: cur.edited?.caption, label: 'diagram caption' })}</figcaption>
        <div class="legend">
          <span><i style="background: #1B1E27"></i>is</span>
          <span><i style="height: 0; border-top: 3px dashed #6B7080"></i>is not</span>
          <span><i style="background: #33449A"></i>relation or act</span>
        </div>
      </figure>
    </div>

    <section class="verses-section" aria-label="Supporting verses" style="display: flex; flex-direction: column; gap: 14px">
      <div class="row" style="justify-content: space-between; align-items: baseline">
        <h2 style="font-size: 26px">Supporting verses</h2>
        <span style="font-size: 13px; color: var(--muted)">${esc(cur.refs)} · ${versesTa ? 'Tamil Indian Revised Version (IRV)' : 'Berean Standard Bible'}</span>
      </div>
      ${support}
      <div class="verse-grid">${verses}</div>
    </section>

    ${cur.heresies?.length ? `<section class="denied-by" aria-labelledby="denied-h">
      <h2 id="denied-h" class="small-caps"${taAttr(lang === 'ta')}>${lang === 'ta' ? 'இந்தப் போதனையை மறுக்கும் வேதப்புரட்டுகள்' : 'Heresies that deny this teaching'}</h2>
      <ul>${cur.heresies.map((h) => `<li><a href="${href('heresies', { h: h.id, t: cur.n })}"${taAttr(heresyIn(h, lang).ta)}>${esc(heresyIn(h, lang).name)}</a></li>`).join('')}</ul>
      <a class="denied-all" href="${href('heresies', { t: cur.n })}"${taAttr(lang === 'ta')}>${lang === 'ta' ? 'ஒவ்வொன்றும் என்ன போதிக்கிறது என்று வாசியுங்கள் →' : 'Read what each one teaches →'}</a>
    </section>` : ''}

    <section class="explore" aria-label="Keep exploring">
      <a class="topic-link" href="${href('topics', { topic: cur.topic.id })}"><span class="small-caps">Topic · ${esc(cur.topic.theme)}</span><span>${esc(cur.topic.title)}</span></a>
      <a class="q-link" href="${href('qa', { topic: cur.topic.title })}"><span class="small-caps">Questions</span><b>${cur.topic.q}</b><span>Read the answers →</span></a>
    </section>
    ${ta || supportTa || versesTa ? tamilCredit('The explanations are') : ''}
    <div class="present-row">
      <button type="button" class="btn present-btn" aria-label="Present teaching ${cur.n} as slides">${icon.present}Present as slides</button>
      <span>Show this teaching full screen, for teaching a group.</span>
    </div>
  </div>`;

  const open = root.querySelector<HTMLButtonElement>('.diagram-open')!;
  fitDiagram(open.querySelector<HTMLElement>('.diagram-fit')!, cur, root.querySelector<HTMLElement>('.diagram-card')!);
  open.addEventListener('click', () => enlargeDiagram(cur, dg.cap));

  // The outline button sits beside the progress line; the outline itself opens full width below.
  const outlineBtn = root.querySelector<HTMLButtonElement>('.outline-btn')!;
  const outlinePanel = root.querySelector<HTMLElement>('#outline')!;
  outlineBtn.addEventListener('click', () => {
    const show = outlinePanel.hidden;
    outlinePanel.hidden = !show;
    outlineBtn.setAttribute('aria-expanded', String(show));
  });

  const presentBtn = root.querySelector<HTMLButtonElement>('.present-btn')!;
  presentBtn.addEventListener('click', () => present(deckFor(cur, data, lang, (s, endLang) => {
    // Switched language while presenting: the page follows, in that language.
    if (endLang && endLang !== lang) { navigate('explanations', { t: cur.n, lang: endLang }); return; }
    // Back on the page, at the part the last slide showed.
    const at = s.kind === 'text' ? '.explain' : s.kind === 'diagram' ? '.diagram-card' : s.kind === 'verses' ? '.verses-section' : s.kind === 'heresies' ? '.denied-by' : '';
    const el = at ? root.querySelector<HTMLElement>(at) : null;
    if (el) el.scrollIntoView({ block: 'start' }); else window.scrollTo({ top: 0 });
    presentBtn.focus({ preventScroll: true });
  })));

  wireEditing(root, () => void renderExplanations(root, params));
  root.querySelector<HTMLSelectElement>('#jump')!.addEventListener('change', (e) =>
    navigate('explanations', { t: (e.target as HTMLSelectElement).value }, true));
}

/** The page after the last teaching: what was covered, and where to go next. */
function renderComplete(root: HTMLElement, data: Data): void {
  const T = data.teachings;
  const last = T[T.length - 1];
  const parts = data.groups.map((g, gi) => {
    const inPart = T.filter((t) => t.g === gi);
    return `<li class="card complete-part">
        <span class="small-caps">Part ${gi + 1} · ${inPart.length} teachings</span>
        <b>${esc(g.title)}</b>
        <a href="${href('explanations', { t: inPart[0].n })}">Review from teaching ${inPart[0].n} →</a>
      </li>`;
  }).join('');
  root.innerHTML = `<div class="page complete">
    <a class="btn complete-back" href="${href('explanations', { t: last.n })}">${icon.left}Back to teaching ${last.n}</a>
    <header class="complete-head">
      <span class="eyebrow">Course complete</span>
      <h1>You have worked through all ${T.length} teachings</h1>
      <p class="detail">From the one God, through the three Persons and their relations, to the incarnation of the Son: ${data.groups.length} parts, each grounded in the Bible passages that support it.</p>
    </header>
    <ol class="complete-parts" aria-label="What the course covered">${parts}</ol>
    <section class="complete-next" aria-labelledby="next-h">
      <h2 id="next-h">Keep going</h2>
      <div class="row">
        <a class="btn primary" href="${href('keywords')}">Review the key words</a>
        <a class="btn" href="${href('topics')}">Explore the topics</a>
        <a class="btn" href="${href('qa')}">Read the questions</a>
        <a class="btn" href="${href('explanations', { t: 1 })}">Start again from teaching 1</a>
      </div>
    </section>
  </div>`;
}

/**
 * The teaching as slides: its title; one slide per paragraph of "What does this mean?"; the diagram;
 * the supporting verses; and the heresies that deny it (when there are any). Key words stay linked.
 */
function deckFor(cur: Teaching, data: Data, lang: Lang, onClose: Deck['onClose']): Deck {
  const T = data.teachings;
  const gl = data.glossary || {}, glTa = data.glossary_ta || {};
  // Each slide links the first mention of a key word on it, so every slide can open its bubbles.
  let seen = new Set<string>(), seenTa = new Set<string>();
  const fresh = () => { seen = new Set(); seenTa = new Set(); };
  const ta = lang === 'ta' && !!cur.meaning_ta;
  const linkEn = (p: string) => linkTerms(p, gl, seen, cur.n);
  const linkTa = (p: string) => linkTermsTa(p, glTa, seenTa, cur.n, gl);
  const verseHref = (v: Teaching['verses'][number]) => href('reference', { exact: v.ref });
  const slideDetail = (lang === 'ta' && cur.detail_ta) || cur.detail;
  const slides: Slide[] = [{
    kind: 'title', fit: true,
    html: `<p class="slide-eyebrow">Teaching ${cur.n} of ${T.length} · Part ${cur.g + 1} · ${esc(data.groups[cur.g].title)}</p>
      <h1 class="slide-title slide-fit"${taAttr(titleIn(cur, lang).ta)}>${esc(titleIn(cur, lang).text)}</h1>
      ${slideDetail ? `<p class="slide-sub"${taAttr(slideDetail === cur.detail_ta)}>${mdInline(slideDetail)}</p>` : ''}`,
  }];

  const meaning = (ta ? cur.meaning_ta : cur.meaning)?.trim();
  if (meaning) {
    const paras = meaning.split(/\n[ \t]*\n+/);
    const head = ta ? 'இதன் பொருள் என்ன?' : 'What does this mean?';
    paras.forEach((p, i) => {
      fresh();
      slides.push({
        kind: 'text', fit: true,
        html: `<p class="slide-eyebrow"${ta ? ' lang="ta"' : ''}>${head}${paras.length > 1 ? ` · ${i + 1} of ${paras.length}` : ''}</p>
          <div class="slide-fit slide-text"${ta ? ' lang="ta"' : ''}>${mdParas(p, 'slide-para', ta ? linkTa : linkEn)}</div>`,
      });
    });
  }

  // A teaching with an animated illustration shows that; the others, the diagram from the page.
  const animation = animationFor(cur.n, lang);
  slides.push(animation ? { kind: 'diagram', html: animation, onShow: wireAnimation } : {
    kind: 'diagram',
    onShow: fitSlideDiagram,
    html: `<div class="slide-diagram">
        <div class="slide-diagram-fit" role="img" aria-label="${esc(mdPlain(draw(cur.n, cur.notes, cur.cap).alt))}">${diagramHtml(cur, 'wide')}</div>
        <div class="slide-diagram-side">
          <div class="legend">
            <span><i style="background: #1B1E27"></i>is</span>
            <span><i style="height: 0; border-top: 3px dashed #6B7080"></i>is not</span>
            <span><i style="background: #33449A"></i>relation or act</span>
          </div>
        </div>
      </div>`,
  });

  const supportTa = lang === 'ta' && cur.support_ta;
  const support = supportTa || cur.support;
  const versesTa = lang === 'ta' && cur.verses.every((v) => v.text_ta);
  const chips = cur.verses.map((v) => `<a class="chip" href="${verseHref(v)}"${versesTa ? ' lang="ta"' : ''}>${esc(versesTa ? v.label_ta! : v.label)}</a>`).join('');
  // The passages named in the text link too (the first mention of each), so they open in a bubble.
  const labelled = cur.verses.map((v) => ({ label: esc((supportTa ? v.label_ta : v.label) || v.label), href: verseHref(v) }));
  const linkVerses = (html: string) => {
    const done = new Set<string>();
    return html.split(/(<[^>]*>)/).map((part, i, all) => {
      // Text only: not inside a tag, and not inside a link already.
      if (part.startsWith('<') || all.slice(0, i).filter((p) => p.startsWith('<a ')).length > all.slice(0, i).filter((p) => p === '</a>').length) return part;
      for (const l of labelled) {
        if (done.has(l.href) || !part.includes(l.label)) continue;
        done.add(l.href);
        part = part.replace(l.label, `<a class="verse-link" href="${l.href}">${l.label}</a>`);
      }
      return part;
    }).join('');
  };
  fresh();
  // Without the written explanation of how the passages support it, the slide shows the passages themselves.
  const body = support
    ? linkVerses(mdParas(support, 'slide-para', supportTa ? linkTa : linkEn))
    : cur.verses.map((v) => `<p class="slide-para"${versesTa ? ' lang="ta"' : ''}><b>${esc(versesTa ? v.label_ta! : v.label)}</b> ${esc(versesTa ? v.text_ta! : v.text)}</p>`).join('');
  slides.push({
    kind: 'verses', fit: true,
    html: `<h2 class="slide-heading">Supporting Verses</h2>
      <div class="slide-fit slide-support"${supportTa ? ' lang="ta"' : ''}>${body}</div>
      <div class="slide-chips">${chips}<span>${versesTa ? 'Tamil Indian Revised Version (IRV)' : 'Berean Standard Bible'}</span></div>`,
  });

  if (cur.heresies?.length) {
    const H = cur.heresies;
    slides.push({
      kind: 'heresies',
      html: `<div class="slide-head-row">
          <h2 class="slide-heading"${taAttr(lang === 'ta')}>${lang === 'ta' ? 'வேதப்புரட்டுகள்' : 'Heresies'}</h2>
          <p class="slide-eyebrow"${taAttr(lang === 'ta')}>${lang === 'ta' ? `இந்தப் போதனையை மறுக்கும் ${H.length} · பழமையானது முதலில்` : `${H.length} that deny this teaching · oldest first`}</p>
        </div>
        <ul class="slide-heresies" style="grid-template-rows: repeat(${Math.ceil(H.length / 3)}, auto)">${H.map((h) => { const x = heresyIn(h, lang); return `<li><a href="${href('heresies', { h: h.id, t: cur.n })}"${taAttr(x.ta)}><b>${esc(x.name)}</b>${x.year ? `<span>${esc(x.year)}</span>` : ''}</a></li>`; }).join('')}</ul>`,
    });
  }

  // The heresies' own entries (what each taught) come from the Heresies page's data, fetched now so they
  // are ready by the last slide. Until they arrive, a heresy link opens the Heresies page as usual.
  let heresies: Map<string, HeresyEntry> | null = null;
  if (cur.heresies?.length) {
    api<{ heresies: HeresyEntry[] }>('heresies')
      .then((d) => { heresies = new Map(d.heresies.map((h) => [h.id, h])); })
      .catch(() => {});
  }

  // A key word opens its definition, a passage its text, and a heresy what it taught, in a thought bubble.
  const explain = (a: HTMLAnchorElement): Bubble | null => {
    const [route, query = ''] = (a.getAttribute('href') || '').replace(/^#\//, '').split('?');
    const q = new URLSearchParams(query);
    if (route === 'keywords') {
      const inTa = q.get('lang') === 'ta';
      const term = (inTa ? glTa : gl)[q.get('term') || ''];
      return term ? { title: term.term, html: mdParas(term.def, 'bubble-para'), lang: inTa ? 'ta' : 'en' } : null;
    }
    if (route === 'reference') {
      const v = cur.verses.find((x) => x.ref === q.get('exact'));
      if (!v) return null;
      return versesTa
        ? { title: v.label_ta!, html: `<p class="bubble-para">${esc(v.text_ta!)}</p>`, cite: 'Tamil Indian Revised Version (IRV)', lang: 'ta' }
        : { title: v.label, html: `<p class="bubble-para">${esc(v.text)}</p>`, cite: 'Berean Standard Bible', lang: 'en' };
    }
    if (route === 'heresies') {
      const h = heresies?.get(q.get('h') || '');
      if (!h) return null;
      if (lang === 'ta' && h.summary_ta) {
        return {
          title: h.name_ta || h.name, meta: [h.year_ta || h.year, h.place_ta || h.place, h.founder_ta || h.founder].filter(Boolean).join(' · '),
          html: mdParas(h.summary_ta, 'bubble-para'), lang: 'ta', wide: true,
        };
      }
      return {
        title: h.name, meta: [h.year, h.place, h.founder].filter(Boolean).join(' · '),
        html: mdParas(h.summary, 'bubble-para'), lang: 'en', wide: true,
      };
    }
    return null;
  };

  return {
    where: `Teaching ${cur.n}`, title: lang === 'ta' && cur.title_ta ? cur.title_ta : cur.short, slides, explain, onClose,
    lang, relang: (l) => deckFor(cur, data, l, onClose),
  };
}

/**
 * The diagram on its slide, as large as the slide allows. The drawing keeps room for parts most
 * teachings don't use (a box below, labels on a ring), so it is cropped to what it actually draws first.
 */
function fitSlideDiagram(body: HTMLElement): void {
  const holder = body.querySelector<HTMLElement>('.slide-diagram-fit');
  const dg = holder?.querySelector<HTMLElement>('.diagram');
  const legend = body.querySelector<HTMLElement>('.slide-diagram-side');
  if (!holder || !dg || !legend) return;
  dg.style.transform = 'none';
  const box = dg.getBoundingClientRect();
  const k = dg.offsetWidth / box.width;  // screen pixels to the drawing's own
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const el of dg.querySelectorAll<HTMLElement>('.diagram-inner *')) {
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    x1 = Math.min(x1, r.left); y1 = Math.min(y1, r.top); x2 = Math.max(x2, r.right); y2 = Math.max(y2, r.bottom);
  }
  if (!isFinite(x1)) return;
  const m = 12;  // breathing room, in the drawing's pixels
  const cx = (x1 - box.left) * k - m, cy = (y1 - box.top) * k - m;
  const cw = (x2 - x1) * k + 2 * m, ch = (y2 - y1) * k + 2 * m;
  const cs = getComputedStyle(body);
  const aw = body.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const ah = body.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - legend.offsetHeight - 18;
  const s = Math.min(aw / cw, ah / ch, 1.8);
  holder.style.width = `${cw * s}px`;
  holder.style.height = `${ch * s}px`;
  dg.style.transformOrigin = '0 0';
  dg.style.transform = `scale(${s}) translate(${-cx}px, ${-cy}px)`;
}

type Layout = 'wide' | 'compact';

function diagramHtml(t: Teaching, layout: Layout): string {
  const dg = draw(t.n, t.notes, t.cap, layout === 'compact');
  const L = LAYOUT[layout];
  const name = (text: string, size: number) => `<span style="font-family: var(--display); font-size: ${size}px; font-weight: 600">${text}</span>`;
  const note = (text: string) => `<span style="font-size: ${dg.fs.note}px; line-height: 1.2">${esc(text)}</span>`;
  return `<div class="diagram" style="width: ${L.w}px; height: ${L.h}px"><div class="diagram-inner" style="left: ${L.ix}px; top: ${L.iy}px; width: ${L.iw}px; height: ${L.ih}px">
    ${dg.rings.map((r: { style: string }) => `<div style="${r.style}"></div>`).join('')}
    ${dg.edges.map((e: { line: string; head: string; tail: string }) => `<div style="${e.line}"><div style="${e.head}"></div><div style="${e.tail}"></div></div>`).join('')}
    <div style="${dg.nF}">${name('Father', dg.fs.name)}${note(dg.tF)}</div>
    <div style="${dg.nS}">${name('Son', dg.fs.name)}${note(dg.tS)}</div>
    <div style="${dg.nP}">${name('Spirit', dg.fs.name)}${note(dg.tP)}</div>
    <div style="${dg.nG}">${name('God', dg.fs.god)}${note(dg.tG)}</div>
    ${dg.hasBox ? `<div style="${dg.boxStyle}">${esc(dg.box)}</div>` : ''}
    ${dg.labels.map((l: { style: string; text: string }) => `<span style="${l.style}">${esc(l.text)}</span>`).join('')}
    ${dg.hasRingLabel ? `<span style="${dg.ringLabelStyle}">${esc(dg.ringLabel)}</span>` : ''}
  </div></div>`;
}

// Draws the diagram into `holder` and scales it to the card's width, never scrolling sideways.
// Where the full design does not fit, the compact layout is used instead: its larger text keeps the
// labels readable once scaled. Re-fits whenever the space changes (rotation, window resize).
function fitDiagram(holder: HTMLElement, t: Teaching, card: HTMLElement): void {
  let shown: Layout | '' = '';
  const fit = () => {
    if (!holder.isConnected) { ro.disconnect(); return; }
    const cs = getComputedStyle(card);
    const avail = card.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (avail <= 0) return;
    const layout: Layout = avail >= LAYOUT.wide.w ? 'wide' : 'compact';
    if (layout !== shown) { holder.innerHTML = diagramHtml(t, layout); shown = layout; }
    const L = LAYOUT[layout], s = Math.min(1, avail / L.w);
    holder.style.width = `${L.w * s}px`;
    holder.style.height = `${L.h * s}px`;
    holder.querySelector<HTMLElement>('.diagram')!.style.transform = `scale(${s})`;
    card.classList.toggle('is-compact', layout === 'compact');
  };
  const ro = new ResizeObserver(fit);
  ro.observe(card);
  fit();
}

// Full-screen view: the diagram as large as the screen allows (turning a phone sideways gives more room),
// in whichever layout shows the text larger. "Zoom in" doubles it and lets the reader pan around.
function enlargeDiagram(t: Teaching, caption: string): void {
  const dlg = document.createElement('dialog');
  dlg.className = 'diagram-dialog';
  dlg.setAttribute('aria-label', 'Diagram, enlarged');
  dlg.innerHTML = `
    <div class="diagram-dialog-bar">
      <p class="caption">${mdInline(caption)}</p>
      <button type="button" class="btn zoom" aria-pressed="false">Zoom in</button>
      <button type="button" class="btn primary close">Close</button>
    </div>
    <div class="diagram-dialog-stage"><div class="diagram-fit" role="img" aria-label="Diagram: ${esc(mdPlain(caption))}"></div></div>`;
  document.body.appendChild(dlg);
  const stage = dlg.querySelector<HTMLElement>('.diagram-dialog-stage')!;
  const holder = dlg.querySelector<HTMLElement>('.diagram-fit')!;
  const zoomBtn = dlg.querySelector<HTMLButtonElement>('.zoom')!;
  let zoom = 1, shown: Layout | '' = '';
  const fit = () => {
    const aw = stage.clientWidth - 24, ah = stage.clientHeight - 24;
    const scale = (l: Layout) => Math.max(0.2, Math.min(aw / LAYOUT[l].w, ah / LAYOUT[l].h));
    // Pick the layout whose note text (11px wide, 14px compact) comes out larger on this screen.
    const layout: Layout = scale('wide') * 11 >= scale('compact') * 14 ? 'wide' : 'compact';
    if (layout !== shown) { holder.innerHTML = diagramHtml(t, layout); shown = layout; }
    const L = LAYOUT[layout], s = scale(layout) * zoom;
    holder.style.width = `${L.w * s}px`;
    holder.style.height = `${L.h * s}px`;
    holder.querySelector<HTMLElement>('.diagram')!.style.transform = `scale(${s})`;
  };
  const ro = new ResizeObserver(fit);
  const close = () => dlg.close();
  zoomBtn.addEventListener('click', () => {
    zoom = zoom === 1 ? 2 : 1;
    zoomBtn.textContent = zoom === 1 ? 'Zoom in' : 'Fit to screen';
    zoomBtn.setAttribute('aria-pressed', String(zoom !== 1));
    fit();
    stage.scrollTo({ left: (stage.scrollWidth - stage.clientWidth) / 2, top: 0 });
  });
  dlg.querySelector('.close')!.addEventListener('click', close);
  window.addEventListener('hashchange', close);
  dlg.addEventListener('close', () => {
    ro.disconnect();
    window.removeEventListener('hashchange', close);
    dlg.remove();
    document.querySelector<HTMLElement>('.diagram-open')?.focus();
  });
  dlg.showModal();
  ro.observe(stage);
  fit();
}
