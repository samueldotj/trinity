import { F, P, frame } from './frame';
import './t8.css';

// ---------- Teaching 8: God is Indivisible ----------
// 30 seconds: four pieces fit together as God and are struck out, and a blade cannot cut Him; a pie of three
// slices is struck out; each Person is the whole God, not a third; love, justice and power flow into God.

const pill8 = (cls: string, x: number, y: number, w: number, text: string, stroke = '#33449A', ink = '#33449A', fill = '#FFFFFF') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="${fill}" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;
const wrong8 = (cls: string, x: number, y: number, w: number, text: string) => pill8(cls, x, y, w, text, '#B3261E', '#9B1C1C', '#FBEAEA');

/** One quarter of a disc that slides in from (dx, dy) to make up a God of parts. */
const wedge8 = (d: string, dx: number, dy: number) =>
  `<g class="a-wedge" style="--dx: ${dx}px; --dy: ${dy}px"><path d="${d}" fill="#12172B" stroke="#FFFFFF" stroke-width="3"></path></g>`;

/** One slice of the pie, sliding out along (dx, dy). */
const slice8 = (d: string, fill: string, tx: number, ty: number, name: string, dx: number, dy: number) =>
  `<g class="a-slice" style="--dx: ${dx}px; --dy: ${dy}px"><path d="${d}" fill="${fill}" stroke="#FFFFFF" stroke-width="3"></path><text x="${tx}" y="${ty}" text-anchor="middle" font-size="14" font-weight="600" fill="#FFFFFF" ${P}>${name}</text></g>`;

const person8 = (x: number, y: number, fill: string, name: string) =>
  `<g transform="translate(${x},${y})"><g class="a-person"><circle r="40" fill="${fill}"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>${name}</text></g></g>`;

const is8 = (x: number, y: number) =>
  `<g transform="translate(${x},${y})"><g class="a-is"><rect x="-17" y="-12" width="34" height="24" rx="12" fill="#FFFFFF" stroke="#1B1E27"></rect><text y="4.5" text-anchor="middle" font-size="13" font-weight="600" fill="#1B1E27" ${P}>is</text></g></g>`;

/** A quality of God, starting at (x, y) and flowing into Him at the centre. */
const attr8 = (x: number, y: number, w: number, text: string) =>
  `<g transform="translate(${x},${y})"><g class="a-attr" style="--dx: ${300 - x}px; --dy: ${200 - y}px"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="#E3E9F7" stroke="#2849B8"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#1A3285" ${P}>${text}</text></g></g>`;

function godIsIndivisible(): string {
  return frame(8, 30000, [
    { label: 'No pieces', at: 0, caption: 'God is not built out of pieces put together, and He cannot be split up.' },
    { label: 'Not a pie in three', at: 0.22, caption: 'Father, Son and Spirit are not three slices that add up to one God.' },
    { label: 'Each the whole God', at: 0.46, caption: 'Not a third of God each: each Person is the whole God.' },
    { label: 'Love is God loving', at: 0.72, caption: 'His love, justice and power are not parts: His love is God Himself loving.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: four pieces slide together to make up God, and the idea that God is built from pieces is struck out; a single God appears inside a thick unbroken ring, and a blade cannot cut into it. A pie cut into three slices for the Father, the Son and the Spirit is pulled apart and struck out. The three Persons stand round the one God, each joined to Him by is: the tag a third of God is struck out from each and replaced by whole God. Love, justice and power flow into God and become one with Him: one, undivided.">
      <circle class="a-ring" cx="300" cy="200" r="160" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#1B1E27" stroke-width="7" transform="rotate(-90 300 200)"></circle>
      <g transform="translate(300,200)">
        ${wedge8('M0,0 L0,-60 A60,60 0 0 1 60,0 Z', 64, -64)}
        ${wedge8('M0,0 L60,0 A60,60 0 0 1 0,60 Z', 64, 64)}
        ${wedge8('M0,0 L0,60 A60,60 0 0 1 -60,0 Z', -64, 64)}
        ${wedge8('M0,0 L-60,0 A60,60 0 0 1 0,-60 Z', -64, -64)}
      </g>
      ${wrong8('a-piecetag', 300, 310, 176, 'built from pieces?')}
      <line class="a-piecestrike" x1="222" y1="282" x2="378" y2="118" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(118,200)"><g class="a-knife">
        <rect x="-70" y="-10" width="30" height="20" rx="4" fill="#5A4F3C"></rect>
        <path d="M-40,-9 L0,-9 L14,0 L0,9 L-40,9 Z" fill="#9AA0AD" stroke="#6B7080" stroke-width="1.5"></path>
      </g></g>
      ${pill8('a-nosplit', 300, 310, 160, 'cannot be split')}
      <g transform="translate(300,200)">
        ${slice8('M0,0 L-69.3,-40 A80,80 0 0 1 69.3,-40 Z', '#2E5AAC', 0, -46, 'Father', 0, -32)}
        ${slice8('M0,0 L0,80 A80,80 0 0 1 -69.3,-40 Z', '#AE4C17', -38, 26, 'Son', -28, 16)}
        ${slice8('M0,0 L69.3,-40 A80,80 0 0 1 0,80 Z', '#157A6E', 38, 26, 'Spirit', 28, 16)}
      </g>
      ${wrong8('a-pietag', 300, 336, 230, 'three slices, one God?')}
      <line class="a-piestrike" x1="196" y1="300" x2="404" y2="96" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <line class="a-spoke" x1="300" y1="200" x2="300" y2="46" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-spoke" x1="300" y1="200" x2="150" y2="330" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-spoke" x1="300" y1="200" x2="450" y2="330" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      ${is8(300, 113)}${is8(217, 272)}${is8(383, 272)}
      ${person8(300, 46, '#2E5AAC', 'Father')}${person8(150, 330, '#AE4C17', 'Son')}${person8(450, 330, '#157A6E', 'Spirit')}
      ${wrong8('a-third', 430, 46, 144, 'a third of God?')}${wrong8('a-third', 150, 400, 144, 'a third of God?')}${wrong8('a-third', 450, 400, 144, 'a third of God?')}
      <line class="a-thirdstrike" x1="364" y1="54" x2="496" y2="38" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <line class="a-thirdstrike" x1="84" y1="408" x2="216" y2="392" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <line class="a-thirdstrike" x1="384" y1="408" x2="516" y2="392" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      ${pill8('a-whole', 430, 46, 124, 'whole God')}${pill8('a-whole', 150, 400, 124, 'whole God')}${pill8('a-whole', 450, 400, 124, 'whole God')}
      ${attr8(300, 4, 84, 'love')}${attr8(90, 330, 96, 'justice')}${attr8(510, 330, 96, 'power')}
      ${pill8('a-loving', 300, 404, 262, 'His love is God Himself loving')}
      ${pill8('a-ringlabel', 300, 448, 150, 'one, undivided')}
      <g transform="translate(300,200)"><g class="a-god">
        <circle r="60" fill="#12172B"></circle>
        <text y="3" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" ${F}>God</text>
        <text y="22" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>no parts</text>
      </g></g>
    </svg>`);
}

export default godIsIndivisible;
