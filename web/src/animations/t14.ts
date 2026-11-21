import { F, P, frame } from './frame';
import './t14.css';

// ---------- Teaching 14: The Father is not the Son ----------
// 30 seconds: the Father begets, the Son is begotten, and the roles will not swap; the Son prays to the
// Father and shares His glory; two witnesses; "is not", and two Gods struck out for the one God.

const person = (x: number, y: number, fill: string, name: string) =>
  `<g transform="translate(${x},${y})"><g class="a-person">
        <circle r="58" fill="${fill}"></circle>
        <text y="3" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>${name}</text>
        <text y="23" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>Person</text>
      </g></g>`;

// A white pill centred on (x, y): `cls` names its part, `w` its width.
const pill = (cls: string, x: number, y: number, w: number, text: string, stroke: string, ink: string, extra = '') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"${extra}><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="#FFFFFF" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

const badge = (x: number, y: number, n: string, delay: string) =>
  `<g transform="translate(${x},${y})"><g class="a-badge" style="animation-delay: ${delay}"><circle r="17" fill="#FFFFFF" stroke="#12172B" stroke-width="2.5"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#12172B" ${F}>${n}</text></g></g>`;

function fatherNotSon(): string {
  return frame(14, 30000, [
    { label: 'Begets and begotten', at: 0, caption: 'The Father is the One who begets; the Son is begotten. The roles cannot swap.' },
    { label: 'Prays to the Father', at: 0.22, caption: 'Jesus prays to the Father as “You,” asking for the glory He had “with” Him.' },
    { label: 'Two witnesses', at: 0.46, caption: 'Jesus counts Himself and the Father as two witnesses: two distinct Persons.' },
    { label: 'Distinct, not separate', at: 0.72, caption: 'Distinct, not separate: not two Gods, for each has the one divine essence.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father and the Son side by side. An arrow from the Father to the Son says begets; the labels begets and begotten try to swap places and spring back. The Son prays up to the Father, and a warm glow of shared glory, from before the world, surrounds Them both. The Father and the Son are numbered one and two, two witnesses whose testimony is valid. A dashed line says is not; two Gods is struck out, and both are joined to the one God below.">
      <g class="a-glory"><ellipse cx="300" cy="175" rx="255" ry="105" fill="rgba(232,163,60,0.16)" stroke="#E8A33C" stroke-width="2"></ellipse></g>
      ${pill('a-glorylabel', 300, 302, 264, 'glory “with You” before the world', '#E8A33C', '#7A4E0E')}
      <path class="a-prayer" d="M421,120 Q300,10 179,120" fill="none" stroke="#AE4C17" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></path>
      <path class="a-prayerhead" d="M179,120 L192,116.5 L184,107.5 Z" fill="#AE4C17"></path>
      ${pill('a-prayerlabel', 300, 26, 180, '“Father, glorify Me”', '#AE4C17', '#7E3A10')}
      <line class="a-beget" x1="214" y1="170" x2="382" y2="170" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="a-begethead" d="M380,162 L392,170 L380,178 Z" fill="#33449A"></path>
      ${pill('a-begetlabel', 300, 170, 84, 'begets', '#33449A', '#33449A')}
      ${pill('a-role', 150, 262, 90, 'begets', '#2E5AAC', '#22437F', ' style="--dx: 70px"')}
      ${pill('a-role', 450, 262, 104, 'begotten', '#AE4C17', '#7E3A10', ' style="--dx: -70px"')}
      <g transform="translate(300,336)"><g class="a-noswap"><rect x="-104" y="-15" width="208" height="30" rx="15" fill="#FBEAEA" stroke="#B3261E"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#9B1C1C" ${P}>roles cannot be swapped</text></g></g>
      <line class="a-wline" x1="182" y1="224" x2="240" y2="344" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 8"></line>
      <line class="a-wline" x1="418" y1="224" x2="360" y2="344" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 8"></line>
      ${pill('a-witness', 130, 262, 96, 'witness', '#33449A', '#33449A')}
      ${pill('a-witness', 470, 262, 96, 'witness', '#33449A', '#33449A')}
      <g transform="translate(300,382)"><g class="a-card">
        <rect x="-90" y="-34" width="180" height="68" rx="10" fill="#F4F1EA" stroke="#A39782" stroke-width="1.5"></rect>
        <text y="-6" text-anchor="middle" font-size="16" font-weight="600" fill="#5A4F3C" ${P}>testimony</text>
        <text class="a-valid" y="18" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>of two is valid</text>
      </g></g>
      <line class="a-edge" x1="214" y1="170" x2="386" y2="170" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
      ${pill('a-isnot', 300, 170, 70, 'is not', '#6B7080', '#4A5168')}
      <line class="a-gline" x1="190.2" y1="219.8" x2="267.3" y2="315.5" stroke="#6B7080" stroke-width="3"></line>
      <line class="a-gline" x1="409.8" y1="219.8" x2="332.7" y2="315.5" stroke="#6B7080" stroke-width="3"></line>
      <g transform="translate(300,330)"><g class="a-two"><rect x="-60" y="-15" width="120" height="30" rx="15" fill="#FBEAEA" stroke="#B3261E"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#9B1C1C" ${P}>two Gods?</text></g></g>
      <line class="a-twostrike" x1="234" y1="330" x2="366" y2="330" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g transform="translate(300,356)"><g class="a-god">
        <circle r="46" fill="#E3E3E6" stroke="#888B95" stroke-width="2"></circle>
        <text y="3" text-anchor="middle" font-size="22" font-weight="600" fill="#12172B" ${F}>God</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#12172B" ${P}>one essence</text>
      </g></g>
      ${person(150, 170, '#2E5AAC', 'Father')}
      ${person(450, 170, '#AE4C17', 'Son')}
      ${badge(196, 122, '1', '0s')}${badge(404, 122, '2', '0.4s')}
    </svg>`);
}

export default fatherNotSon;
