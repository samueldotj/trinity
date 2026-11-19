import { api } from '../api';
import { draw } from '../diagram';
import { esc, failure, href, icon, loading, navigate } from '../util';

interface Teaching {
  n: number; g: number; short: string; title: string; detail: string; refs: string;
  verses: { label: string; text: string; ref: string }[];
  notes: string[];
  topic: { id: number; title: string; theme: string; q: number };
}
interface Data { groups: { title: string; note: string }[]; teachings: Teaching[] }

const openGroups = new Set<number>();

export async function renderExplanations(root: HTMLElement, params: URLSearchParams): Promise<void> {
  if (!root.querySelector('.explanations')) root.innerHTML = loading('Loading the teachings…');
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
  const go = (j: number) => navigate('explanations', { t: ((j + T.length) % T.length) + 1 }, true);

  const groups = data.groups.map((g, gi) => {
    const items = T.filter((t) => t.g === gi);
    const list = items.map((t) => `<button type="button" class="teach" data-t="${t.n}" aria-current="${t.n - 1 === i}"><span class="num">${t.n}</span><span>${esc(t.short)}</span></button>`).join('');
    return `<details class="group" data-g="${gi}"${openGroups.has(gi) ? ' open' : ''}>
      <summary><span class="n">${gi + 1}.</span> ${esc(g.title)}<span class="range">${items[0].n}–${items[items.length - 1].n}</span></summary>
      <div class="items">${list}</div>
    </details>`;
  }).join('');

  const dg = draw(cur.n, cur.notes);
  const diagram = `
    ${dg.rings.map((r: { style: string }) => `<div style="${r.style}"></div>`).join('')}
    ${dg.edges.map((e: { line: string; head: string; tail: string }) => `<div style="${e.line}"><div style="${e.head}"></div><div style="${e.tail}"></div></div>`).join('')}
    <div style="${dg.nF}"><span style="font-family: var(--serif); font-size: 20px; font-weight: 600">Father</span><span style="font-size: 11px; line-height: 1.2">${esc(dg.tF)}</span></div>
    <div style="${dg.nS}"><span style="font-family: var(--serif); font-size: 20px; font-weight: 600">Son</span><span style="font-size: 11px; line-height: 1.2">${esc(dg.tS)}</span></div>
    <div style="${dg.nP}"><span style="font-family: var(--serif); font-size: 20px; font-weight: 600">Spirit</span><span style="font-size: 11px; line-height: 1.2">${esc(dg.tP)}</span></div>
    <div style="${dg.nG}"><span style="font-family: var(--serif); font-size: 22px; font-weight: 600">God</span><span style="font-size: 11px; line-height: 1.2">${esc(dg.tG)}</span></div>
    ${dg.hasBox ? `<div style="${dg.boxStyle}">${esc(dg.box)}</div>` : ''}
    ${dg.labels.map((l: { style: string; text: string }) => `<span style="${l.style}">${esc(l.text)}</span>`).join('')}
    ${dg.hasRingLabel ? `<span style="${dg.ringLabelStyle}">${esc(dg.ringLabel)}</span>` : ''}`;

  const verses = cur.verses.map((v) => `<div class="row" style="flex-direction: column; align-items: flex-start; gap: 4px">
      <a href="${href('reference', { exact: v.ref })}" style="font-size: 14px; font-weight: 600">${esc(v.label)}</a>
      <p class="verse-text">${esc(v.text)}</p></div>`).join('');

  root.innerHTML = `<div class="page explanations">
    <div class="intro">
      <span class="eyebrow">Explanations</span>
      <h1>Teachings on the Trinity, step by step</h1>
      <p>Five parts, from the nature of God to the incarnation. Each teaching shows the picture and the Bible passages behind it.</p>
    </div>
    <div class="cols">
      <nav class="side groups" aria-label="Teachings">${groups}</nav>
      <div class="content split">
        <section class="card diagram-card" aria-label="Diagram">
          <div class="diagram-scroll"><div class="diagram" role="img" aria-label="${esc(dg.alt)}">${diagram}</div></div>
          <p class="caption">${esc(dg.cap)}</p>
          <div class="legend">
            <span><i style="background: #1B1E27"></i>is</span>
            <span><i style="height: 0; border-top: 3px dashed #6B7080"></i>is not</span>
            <span><i style="background: #33449A"></i>relation or act</span>
          </div>
          <div class="row" style="justify-content: center; gap: 12px">
            <button type="button" class="btn" data-step="-1">${icon.left}Previous</button>
            <button type="button" class="btn primary" data-step="1">Next teaching${icon.right}</button>
          </div>
        </section>
        <section class="explain" aria-label="Explanation">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <span style="font-size: 13px; font-weight: 600; color: var(--faint)">Teaching ${cur.n} · ${esc(grp.title)}</span>
            <h2>${esc(cur.title)}</h2>
            ${cur.detail ? `<p class="detail">${esc(cur.detail)}</p>` : ''}
          </div>
          <div class="card verses">
            <span class="small-caps">From the Bible · ${esc(cur.refs)}</span>
            ${verses}
            <span style="font-size: 12px; color: var(--faint)">Berean Standard Bible (BSB), public domain.</span>
          </div>
          ${grp.note ? `<p class="note"><strong>Note.</strong> ${esc(grp.note)}</p>` : ''}
          <div class="cards2">
            <a class="card link-card" href="${href('topics', { topic: cur.topic.id })}"><span class="small-caps">Topic · ${esc(cur.topic.theme)}</span><b>${esc(cur.topic.title)}</b></a>
            <a class="card link-card" href="${href('qa', { topic: cur.topic.title })}"><span class="small-caps">Questions answered</span><b>${cur.topic.q} questions →</b></a>
          </div>
        </section>
      </div>
    </div>
  </div>`;

  root.querySelectorAll<HTMLDetailsElement>('details.group').forEach((d) => {
    d.addEventListener('toggle', () => {
      const g = Number(d.dataset.g);
      if (d.open) openGroups.add(g); else openGroups.delete(g);
    });
  });
  root.querySelectorAll<HTMLButtonElement>('.teach').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.t) - 1)));
  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) => b.addEventListener('click', () => go(i + Number(b.dataset.step))));
}
