import { api } from '../api';
import { draw } from '../diagram';
import { editable, wireEditing } from '../edit';
import { esc, failure, href, icon, loading, navigate } from '../util';

interface Teaching {
  n: number; g: number; short: string; title: string; detail: string; refs: string;
  verses: { label: string; text: string; ref: string }[];
  notes: string[];
  cap: string;
  edited?: { caption: boolean };
  topic: { id: number; title: string; theme: string; q: number };
}
interface Data { groups: { title: string; note: string }[]; teachings: Teaching[] }

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
  const diagram = `
    ${dg.rings.map((r: { style: string }) => `<div style="${r.style}"></div>`).join('')}
    ${dg.edges.map((e: { line: string; head: string; tail: string }) => `<div style="${e.line}"><div style="${e.head}"></div><div style="${e.tail}"></div></div>`).join('')}
    <div style="${dg.nF}"><span style="font-family: var(--display); font-size: 20px; font-weight: 600">Father</span><span style="font-size: 11px; line-height: 1.2">${esc(dg.tF)}</span></div>
    <div style="${dg.nS}"><span style="font-family: var(--display); font-size: 20px; font-weight: 600">Son</span><span style="font-size: 11px; line-height: 1.2">${esc(dg.tS)}</span></div>
    <div style="${dg.nP}"><span style="font-family: var(--display); font-size: 20px; font-weight: 600">Spirit</span><span style="font-size: 11px; line-height: 1.2">${esc(dg.tP)}</span></div>
    <div style="${dg.nG}"><span style="font-family: var(--display); font-size: 22px; font-weight: 600">God</span><span style="font-size: 11px; line-height: 1.2">${esc(dg.tG)}</span></div>
    ${dg.hasBox ? `<div style="${dg.boxStyle}">${esc(dg.box)}</div>` : ''}
    ${dg.labels.map((l: { style: string; text: string }) => `<span style="${l.style}">${esc(l.text)}</span>`).join('')}
    ${dg.hasRingLabel ? `<span style="${dg.ringLabelStyle}">${esc(dg.ringLabel)}</span>` : ''}`;

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
        <h1><span class="sr-only">Teaching ${cur.n}: </span>${esc(cur.title)}</h1>
        ${cur.detail ? `<p class="detail">${esc(cur.detail)}</p>` : ''}
        ${grp.note ? `<p class="note"><strong>Note.</strong> ${esc(grp.note)}</p>` : ''}
        <div class="lesson-nav">
          <a class="btn" href="${link(prev)}">${icon.left}${prev.n} · ${esc(prev.short)}</a>
          <a class="btn primary" href="${link(next)}">${next.n} · ${esc(next.short)}${icon.right}</a>
        </div>
      </section>
      <figure class="card diagram-card">
        <div class="diagram-scroll"><div class="diagram" role="img" aria-label="${esc(dg.alt)}"><div class="diagram-inner">${diagram}</div></div></div>
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
      <div class="verse-grid">${verses}</div>
    </section>

    <section class="explore" aria-label="Keep exploring">
      <a class="topic-link" href="${href('topics', { topic: cur.topic.id })}"><span class="small-caps">Topic · ${esc(cur.topic.theme)}</span><span>${esc(cur.topic.title)}</span></a>
      <a class="q-link" href="${href('qa', { topic: cur.topic.title })}"><span class="small-caps">Questions</span><b>${cur.topic.q}</b><span>Read the answers →</span></a>
    </section>
  </div>`;

  wireEditing(root, () => void renderExplanations(root, params));
  root.querySelector<HTMLSelectElement>('#jump')!.addEventListener('change', (e) =>
    navigate('explanations', { t: (e.target as HTMLSelectElement).value }, true));
}
