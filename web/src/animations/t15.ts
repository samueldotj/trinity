import { F, P, frame } from './frame';
import './t15.css';

// ---------- Teaching 15: The Son is not the Holy Spirit ----------
// 30 seconds: the Son and "another Advocate" with the disciples; the Son sends, the Spirit testifies about
// Him; on a level beam, "greater?" and "another kind?" are struck out; begotten, and proceeds, "is not".

const r1 = (v: number) => Math.round(v * 10) / 10;

// Son and Spirit: drawn where the last scene leaves them, raised 130px for the first three (see t15.css).
const person = (cls: string, x: number, y: number, fill: string, name: string, last: string) =>
  `<g transform="translate(${x},${y})"><g class="${cls}">
        <circle r="52" fill="${fill}"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>${name}</text>
        <text class="a-sub1" y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>Person</text>
        <text class="a-sub2" y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>${last}</text>
      </g></g>`;

const pill = (cls: string, x: number, y: number, w: number, text: string, stroke: string, ink: string, extra = '') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"${extra}><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="#FFFFFF" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

const chip = (x: number, y: number, w: number, text: string, delay: string) =>
  `<g transform="translate(${x},${y})"><g class="a-chip" style="animation-delay: ${delay}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>${text}</text></g></g>
      <line class="a-chipstrike" style="animation-delay: ${delay}" x1="${x - w / 2 + 6}" y1="${y}" x2="${x + w / 2 - 6}" y2="${y}" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>`;

// An arrow from one circle to another, drawn with dashoffset (class `cls`), its head shown by `head`.
function arrow(cls: string, head: string, ax: number, ay: number, ar: number, bx: number, by: number, br: number): string {
  const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
  const tx = bx - ux * (br + 4), ty = by - uy * (br + 4), hx = tx - ux * 13, hy = ty - uy * 13;
  return `<line class="${cls}" x1="${r1(ax + ux * (ar + 6))}" y1="${r1(ay + uy * (ar + 6))}" x2="${r1(hx + ux * 2)}" y2="${r1(hy + uy * 2)}" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="${head}" d="M${r1(tx)},${r1(ty)} L${r1(hx - uy * 7)},${r1(hy + ux * 7)} L${r1(hx + uy * 7)},${r1(hy - ux * 7)} Z" fill="#33449A"></path>`;
}

const figure = (x: number) =>
  `<g transform="translate(${x},460)"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g>`;

function sonNotSpirit(): string {
  return frame(15, 30000, [
    { label: 'Another Advocate', at: 0, caption: 'Jesus promises “another Advocate”: the Spirit is someone other than Jesus.' },
    { label: 'Sends and testifies', at: 0.22, caption: 'The Son sends the Spirit, and the Spirit testifies about Him: two Persons.' },
    { label: 'Neither is greater', at: 0.46, caption: 'Both are fully God: not different kinds of God, and neither one greater.' },
    { label: 'Begotten, proceeds', at: 0.72, caption: 'The Son is begotten of the Father; the Spirit proceeds from Father and Son.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Son, the disciples’ Advocate, stands beside the Spirit, another Advocate, both helping the disciples. The Son sends the Spirit, and the Spirit testifies about the Son. The two stand on a level beam: the beam tips at greater and another kind, which are struck out, and it comes level, both fully God. The Father appears above: the Son is begotten of Him, the Spirit proceeds from the Father and from the Son, and a dashed line between the Son and the Spirit says is not.">
      <g class="a-people">${figure(250)}${figure(300)}${figure(350)}</g>
      <line class="a-help" x1="178.9" y1="250.3" x2="262" y2="392" stroke="#AE4C17" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 8"></line>
      <line class="a-help2" x1="421.1" y1="250.3" x2="338" y2="392" stroke="#157A6E" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 8"></line>
      ${pill('a-adv1', 150, 118, 110, 'Advocate', '#AE4C17', '#7E3A10')}
      ${pill('a-adv2', 450, 118, 166, 'another Advocate', '#157A6E', '#0E5A51')}
      <path class="a-testify" d="M418,246 Q300,330 182,246" fill="none" stroke="#157A6E" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></path>
      <path class="a-testifyhead" d="M182,246 L195.5,248.3 L188.6,258 Z" fill="#157A6E"></path>
      ${pill('a-testifylabel', 300, 288, 186, '“testifies about Me”', '#157A6E', '#0E5A51')}
      <line class="a-sends" x1="208" y1="200" x2="381" y2="200" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="a-sendshead" d="M379,192 L393,200 L379,208 Z" fill="#33449A"></path>
      ${pill('a-sendslabel', 300, 200, 76, 'sends', '#33449A', '#33449A')}
      <g class="a-stand"><path d="M300,258 L272,312 L328,312 Z" fill="#A39782"></path><line x1="244" y1="314" x2="356" y2="314" stroke="#A39782" stroke-width="4" stroke-linecap="round"></line></g>
      <g transform="translate(300,255)"><g class="a-beam"><rect x="-206" y="-3" width="412" height="7" rx="3.5" fill="#6B7080"></rect><circle r="6" fill="#4A5168"></circle></g></g>
      ${pill('a-fully', 300, 352, 150, 'both fully God', '#33449A', '#33449A')}
      ${chip(150, 110, 110, 'greater?', '0s')}
      ${chip(450, 110, 140, 'another kind?', '0.5s')}
      ${arrow('a-arrow', 'a-head', 300, 70, 50, 150, 330, 52)}
      ${arrow('a-arrow', 'a-head', 300, 70, 50, 450, 330, 52)}
      <path class="a-arc" d="M178.5,379.4 Q300,480 421.5,379.4" fill="none" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></path>
      <path class="a-archead" d="M421.5,379.4 L416,393.1 L407,382.3 Z" fill="#33449A"></path>
      <line class="a-edge" x1="208" y1="330" x2="392" y2="330" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
      ${pill('a-label', 225, 200, 84, 'begets', '#33449A', '#33449A')}
      ${pill('a-label', 375, 200, 98, 'proceeds', '#33449A', '#33449A')}
      ${pill('a-arclabel', 300, 430, 118, 'and the Son', '#33449A', '#33449A')}
      ${pill('a-isnot', 300, 330, 70, 'is not', '#6B7080', '#4A5168')}
      <g transform="translate(300,70)"><g class="a-father">
        <circle r="50" fill="#2E5AAC"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>Person</text>
      </g></g>
      ${person('a-son', 150, 330, '#AE4C17', 'Son', 'begotten')}
      ${person('a-spirit', 450, 330, '#157A6E', 'Spirit', 'proceeds')}
    </svg>`);
}

export default sonNotSpirit;
