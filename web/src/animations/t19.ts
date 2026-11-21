import { F, P, frame } from './frame';
import './t19.css';

// ---------- Teaching 19: The three Persons are coequal in deity ----------
// 30 seconds: the Persons on a stair of rank, struck out, the stair falling level; three columns rising to
// the same full height; equal honour flowing to each; a triangle with "=" on every side, one name.

const pill = (cls: string, x: number, y: number, w: number, text: string, stroke: string, ink: string, style = '', size = 14) =>
  `<g transform="translate(${x},${y})"><g class="${cls}"${style ? ` style="${style}"` : ''}><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="#FFFFFF" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="${size}" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

// `stages`: the offsets from the last scene's place for the stair, the level ground and the row (t19.css).
const person = (x: number, y: number, fill: string, name: string, stages: number[]) => {
  const [x1, y1, x2, y2, x3, y3] = stages;
  return `<g transform="translate(${x},${y})"><g class="a-person" style="--x1: ${x1}px; --y1: ${y1}px; --x2: ${x2}px; --y2: ${y2}px; --x3: ${x3}px; --y3: ${y3}px">
        <circle class="a-glow" r="55" fill="rgba(232,163,60,0.18)" stroke="#E8A33C" stroke-width="3"></circle>
        <circle r="46" fill="${fill}"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>${name}</text>
        <text class="a-sub1" y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>Person</text>
        <text class="a-sub2" y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>equal</text>
      </g></g>`;
};

// A stair block 140 wide standing on y 400, drawn 50 high and stretched `k` times in the first scene.
const step = (x: number, k: number) =>
  `<g transform="translate(${x},400)"><g class="a-step" style="--k: ${k}"><rect x="-70" y="-50" width="140" height="50" fill="#EFE9DD"></rect></g></g>`;

const column = (x: number, fill: string, delay: string) =>
  `<g transform="translate(${x},400)"><g class="a-column" style="animation-delay: ${delay}"><rect x="-30" y="-200" width="60" height="200" rx="4" fill="${fill}"></rect></g></g>`;

const eq = (x: number, y: number) =>
  `<g transform="translate(${x},${y})"><g class="a-eq"><circle r="16" fill="#FFFFFF" stroke="#6B7080" stroke-width="1.5"></circle><text y="6.5" text-anchor="middle" font-size="20" font-weight="600" fill="#4A5168" ${P}>=</text></g></g>`;

const figure = (x: number) =>
  `<g transform="translate(${x},462)"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g>`;

function coequal(): string {
  return frame(19, 30000, [
    { label: 'Not a ladder', at: 0, caption: 'The Father, the Son and the Spirit are not ranked as greater and lesser Gods.' },
    { label: 'Equally God', at: 0.22, caption: 'Each has the whole divine essence: equally almighty, holy and glorious.' },
    { label: 'Equal honour', at: 0.46, caption: 'All should honour the Son just as they honour the Father: equally worthy.' },
    { label: 'Every side equal', at: 0.72, caption: 'Told apart only by how They relate, never by rank: every side is equal.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father, the Son and the Spirit stand on a stair, marked greater, lesser and least; the labels are struck out and the stair falls level. Three columns, one under each Person, rise to the same full height: the whole divine essence, equally almighty, holy and glorious. People give honour to each of the three alike, the Son just as the Father. The three form a triangle with an equals sign on every side, under one name.">
      ${step(130, 5)}${step(300, 3)}${step(470, 1)}
      ${pill('a-chip', 130, 22, 104, 'greater?', '#6B7080', '#3A4058', 'animation-delay: 0s')}
      ${pill('a-chip', 300, 122, 96, 'lesser?', '#6B7080', '#3A4058', 'animation-delay: 0.3s')}
      ${pill('a-chip', 470, 222, 84, 'least?', '#6B7080', '#3A4058', 'animation-delay: 0.6s')}
      <line class="a-strike" x1="76" y1="-10" x2="524" y2="253" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      ${column(130, '#96ACD6', '0s')}${column(300, '#D6A68B', '0.3s')}${column(470, '#8ABCB6', '0.6s')}
      <line class="a-levelline" x1="80" y1="200" x2="520" y2="200" stroke="#33449A" stroke-width="2.5" stroke-dasharray="8 6"></line>
      ${pill('a-essence', 300, 170, 214, 'the whole divine essence', '#33449A', '#33449A')}
      ${pill('a-equally', 300, 436, 276, 'equally almighty, holy, glorious', '#2849B8', '#1A3285')}
      <g class="a-people">${figure(250)}${figure(300)}${figure(350)}</g>
      <line class="a-honour" x1="290" y1="395" x2="157" y2="139" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-honour" x1="300" y1="392" x2="300" y2="146" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-honour" x1="310" y1="395" x2="443" y2="139" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      ${pill('a-honourpill', 300, 174, 228, '“just as they honor the Father”', '#E8A33C', '#7A4E0E', '', 13)}
      <line class="a-edge" x1="273.5" y1="104.7" x2="166.5" y2="285.3" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3"></line>
      <line class="a-edge" x1="326.5" y1="104.7" x2="433.5" y2="285.3" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3"></line>
      <line class="a-edge" x1="192" y1="330" x2="408" y2="330" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3"></line>
      ${eq(220, 195)}${eq(380, 195)}${eq(300, 330)}
      ${pill('a-onename', 300, 240, 104, 'one name', '#33449A', '#33449A')}
      ${person(300, 60, '#2E5AAC', 'Father', [-170, 40, -170, 240, -170, 30])}
      ${person(140, 330, '#AE4C17', 'Son', [160, -130, 160, -30, 160, -240])}
      ${person(460, 330, '#157A6E', 'Spirit', [10, -30, 10, -30, 10, -240])}
    </svg>`);
}

export default coequal;
