import { api } from '../api';
import { draw, LAYOUT } from '../diagram';
import { editable, wireEditing } from '../edit';
import { type Glossary, linkTerms } from '../glossary';
import { esc, failure, href, icon, loading, navigate } from '../util';

interface Teaching {
  n: number; g: number; short: string; title: string; detail: string; refs: string;
  verses: { label: string; text: string; ref: string }[];
  notes: string[];
  cap: string;
  note?: { title: string; text: string; see: number };
  /** "What does this mean?" and "How these passages support it" (AI-written). */
  meaning?: string;
  support?: string;
  edited?: { caption: boolean; detail: boolean; meaning?: boolean; support?: boolean };
  topic: { id: number; title: string; theme: string; q: number };
}
interface Data { groups: { title: string; note: string }[]; glossary?: Glossary; teachings: Teaching[] }

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
  const i = Math.min(Math.max(Number(params.get('t') || 1), 1), T.length) - 1;
  const cur = T[i];
  const grp = data.groups[cur.g];
  const inPart = T.filter((t) => t.g === cur.g);
  const prev = T[(i + T.length - 1) % T.length];
  const next = T[(i + 1) % T.length];
  const link = (t: Teaching) => href('explanations', { t: t.n });

  const steps = inPart.map((t) => `<li><a href="${link(t)}" class="${t.n < cur.n ? 'done' : ''}"${t.n === cur.n ? ' aria-current="step"' : ''} aria-label="Teaching ${t.n}: ${esc(t.short)}"><span></span></a></li>`).join('');
  const jump = data.groups.map((g, gi) => `<optgroup label="${gi + 1}. ${esc(g.title)}">${
    T.filter((t) => t.g === gi).map((t) => `<option value="${t.n}"${t.n === cur.n ? ' selected' : ''}>${t.n} · ${esc(t.short)}</option>`).join('')
  }</optgroup>`).join('');

  const dg = draw(cur.n, cur.notes, cur.cap);

  // Key words in the title and explanation link to the Key words page, the first mention of each only.
  const gl = data.glossary || {};
  const seen = new Set<string>();
  const title = linkTerms(cur.title, gl, seen, cur.n);
  const meaning = cur.meaning ? `<section class="explain" aria-labelledby="explain-h">
          <h2 id="explain-h" class="small-caps">What does this mean?</h2>
          ${editable(`teaching:${cur.n}:meaning`, `<p class="explain-text">${linkTerms(cur.meaning, gl, seen, cur.n)}</p>`, { text: cur.meaning, edited: cur.edited?.meaning, label: 'explanation' })}
        </section>` : '';
  const support = cur.support ? editable(`teaching:${cur.n}:support`, `<p class="support"><strong>How these passages support it.</strong> ${linkTerms(cur.support, gl, seen, cur.n)}</p>`, { text: cur.support, edited: cur.edited?.support, label: 'how the passages support it' }) : '';

  const verses = cur.verses.map((v) => `<a class="card verse-card" href="${href('reference', { exact: v.ref })}"><b>${esc(v.label)}</b><span class="verse-text">${esc(v.text)}</span></a>`).join('');

  root.innerHTML = `<div class="page">
    <div class="lesson-top">
      <div class="row">
        <span class="eyebrow">Part ${cur.g + 1} of ${data.groups.length} · ${esc(grp.title)}</span>
        <label class="jump">Jump to <select id="jump">${jump}</select></label>
      </div>
      <ol class="steps" aria-label="Teachings in this part">${steps}</ol>
    </div>

    <div class="lesson">
      <section class="lesson-text" aria-label="Teaching">
        <span class="lesson-num" aria-hidden="true">${cur.n}</span>
        <h1><span class="sr-only">Teaching ${cur.n}: </span>${title}</h1>
        ${cur.detail ? editable(`teaching:${cur.n}:detail`, `<p class="detail">${esc(cur.detail)}</p>`, { text: cur.detail, edited: cur.edited?.detail, label: 'teaching description' }) : ''}
        ${meaning}
        ${cur.note ? `<aside class="note teaching-note" aria-label="${esc(cur.note.title)}"><strong>${esc(cur.note.title)}.</strong> ${esc(cur.note.text)}${
          T[cur.note.see - 1] ? ` <a href="${link(T[cur.note.see - 1])}">See teaching ${cur.note.see}: ${esc(T[cur.note.see - 1].title)} →</a>` : ''}</aside>` : ''}
        ${grp.note ? `<p class="note"><strong>Note.</strong> ${esc(grp.note)}</p>` : ''}
        <div class="lesson-nav">
          <a class="btn" href="${link(prev)}">${icon.left}${prev.n} · ${esc(prev.short)}</a>
          <a class="btn primary" href="${link(next)}">${next.n} · ${esc(next.short)}${icon.right}</a>
        </div>
      </section>
      <figure class="card diagram-card">
        <button type="button" class="diagram-open" aria-label="Enlarge diagram. ${esc(dg.alt)}">
          <span class="diagram-fit" aria-hidden="true"></span>
          <span class="diagram-hint">${icon.expand}Tap to enlarge</span>
        </button>
        <figcaption class="caption">${editable(`teaching:${cur.n}:caption`, esc(dg.cap), { text: cur.cap, edited: cur.edited?.caption, label: 'diagram caption' })}</figcaption>
        <div class="legend">
          <span><i style="background: #1B1E27"></i>is</span>
          <span><i style="height: 0; border-top: 3px dashed #6B7080"></i>is not</span>
          <span><i style="background: #33449A"></i>relation or act</span>
        </div>
      </figure>
    </div>

    <section aria-label="From the Bible" style="display: flex; flex-direction: column; gap: 14px">
      <div class="row" style="justify-content: space-between; align-items: baseline">
        <h2 style="font-size: 26px">From the Bible</h2>
        <span style="font-size: 13px; color: var(--muted)">${esc(cur.refs)} · Berean Standard Bible</span>
      </div>
      ${support}
      <div class="verse-grid">${verses}</div>
    </section>

    <section class="explore" aria-label="Keep exploring">
      <a class="topic-link" href="${href('topics', { topic: cur.topic.id })}"><span class="small-caps">Topic · ${esc(cur.topic.theme)}</span><span>${esc(cur.topic.title)}</span></a>
      <a class="q-link" href="${href('qa', { topic: cur.topic.title })}"><span class="small-caps">Questions</span><b>${cur.topic.q}</b><span>Read the answers →</span></a>
    </section>
  </div>`;

  const open = root.querySelector<HTMLButtonElement>('.diagram-open')!;
  fitDiagram(open.querySelector<HTMLElement>('.diagram-fit')!, cur, root.querySelector<HTMLElement>('.diagram-card')!);
  open.addEventListener('click', () => enlargeDiagram(cur, dg.cap));

  wireEditing(root, () => void renderExplanations(root, params));
  root.querySelector<HTMLSelectElement>('#jump')!.addEventListener('change', (e) =>
    navigate('explanations', { t: (e.target as HTMLSelectElement).value }, true));
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
      <p class="caption">${esc(caption)}</p>
      <button type="button" class="btn zoom" aria-pressed="false">Zoom in</button>
      <button type="button" class="btn primary close">Close</button>
    </div>
    <div class="diagram-dialog-stage"><div class="diagram-fit" role="img" aria-label="Diagram: ${esc(caption)}"></div></div>`;
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
