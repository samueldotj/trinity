import { F, P, frame } from './frame';
import './t10.css';

// ---------- Teaching 10: The Father is God ----------
// 30 seconds: the Father joined to God, eternal, all-powerful, all-knowing; from no one, He begets the Son;
// all things come from Him; "more God" and "only a role" are struck out, leaving the Father is God.

const pill10 = (cls: string, x: number, y: number, w: number, text: string, stroke = '#33449A', ink = '#33449A', fill = '#FFFFFF') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="${fill}" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

const circle10 = (cls: string, x: number, y: number, r: number, fill: string, border: string, ink: string, name: string) =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><circle r="${r}" fill="${fill}" stroke="${border}" stroke-width="2"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="${ink}" ${F}>${name}</text></g></g>`;

const attr10 = (y: number, text: string, delay: number) =>
  `<g transform="translate(452,${y})"><g class="a-attr" style="animation-delay: ${delay}s"><rect x="-64" y="-15" width="128" height="30" rx="15" fill="#E3E9F7" stroke="#2849B8"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#1A3285" ${P}>${text}</text></g></g>`;

function theFatherIsGod(): string {
  return frame(10, 30000, [
    { label: 'Fully God', at: 0, caption: 'The Father has the whole divine essence: eternal, all-powerful, all-knowing.' },
    { label: 'Father of the Son', at: 0.22, caption: 'He comes from no one, and eternally begets the Son: always Father.' },
    { label: 'Source of all things', at: 0.46, caption: 'He is the “one God … from whom all things came,” the source of everything.' },
    { label: 'Not more God', at: 0.72, caption: 'Not more God than the Son or Spirit, nor older, nor only a role for a time.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father at the top, joined by a solid line to the one God: the Father is God, eternal, all-powerful and all-knowing. He comes from no one, and an arrow shows Him eternally begetting the Son. A flow runs from the Father down to a box of all things: everything came from Him. The Father swells as if He were more God than the Son and the Spirit, and that is struck out, as is the idea that being Father is only a role for a time. The picture ends with the Father lit and joined to God.">
      <g class="a-faint">
        <line x1="300" y1="70" x2="130" y2="380" stroke="#C9C5BB" stroke-width="2"></line>
        <line x1="300" y1="70" x2="470" y2="380" stroke="#C9C5BB" stroke-width="2"></line>
        <line x1="130" y1="380" x2="470" y2="380" stroke="#C9C5BB" stroke-width="2"></line>
      </g>
      <line class="a-spoke" x1="300" y1="250" x2="300" y2="70" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <g transform="translate(300,160)"><g class="a-isgod"><rect x="-36" y="-12" width="72" height="24" rx="12" fill="#FFFFFF" stroke="#1B1E27"></rect><text y="4.5" text-anchor="middle" font-size="13" font-weight="600" fill="#1B1E27" ${P}>is God</text></g></g>
      ${attr10(30, 'eternal', 0)}${attr10(70, 'all-powerful', 0.3)}${attr10(110, 'all-knowing', 0.6)}
      ${pill10('a-noone', 452, 70, 168, 'comes from no one')}
      <path class="a-beget" d="M251,88 Q110,150 126,320" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="3" stroke-linecap="round"></path>
      <path class="a-begethead" d="M118,316 L127,332 L135,315 Z" fill="#33449A"></path>
      ${pill10('a-begetlabel', 148, 177, 138, 'eternally begets', '#33449A', '#33449A')}
      <g class="a-box">
        <rect x="196" y="404" width="208" height="62" rx="12" fill="#F4F1EA" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="300" y="424" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>all things</text>
        <circle cx="238" cy="446" r="9" fill="#E8A33C"></circle>
        <g transform="translate(286,458)"><rect x="-3" y="-9" width="6" height="9" fill="#7A5C3E"></rect><path d="M0,-30 L12,-8 L-12,-8 Z" fill="#3F7A4E"></path></g>
        <g transform="translate(330,459) scale(.5)"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g>
        <path transform="translate(370,446) scale(.8)" d="M0,-12 L3.5,-3.5 L12,-3 L5.5,3 L7.5,12 L0,7 L-7.5,12 L-5.5,3 L-12,-3 L-3.5,-3.5 Z" fill="#E8A33C"></path>
      </g>
      <path class="a-flow" d="M340,112 Q420,260 362,394" fill="none" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 10"></path>
      <path class="a-flowhead" d="M352,388 L359,404 L369,391 Z" fill="#33449A"></path>
      ${pill10('a-flowlabel', 500, 230, 150, 'all things from Him')}
      ${circle10('a-sdim', 130, 380, 48, '#F5EAE3', '#D6A68B', '#7E3A10', 'Son')}
      ${circle10('a-slit', 130, 380, 48, '#AE4C17', '#AE4C17', '#FFFFFF', 'Son')}
      ${circle10('a-pdim', 470, 380, 48, '#E3EFEE', '#8ABCB6', '#0E5A51', 'Spirit')}
      ${circle10('a-plit', 470, 380, 48, '#157A6E', '#157A6E', '#FFFFFF', 'Spirit')}
      <g transform="translate(300,250)"><g class="a-god">
        <circle r="54" fill="rgba(51,68,154,0.16)"></circle>
        <circle r="48" fill="#12172B"></circle>
        <text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>God</text>
      </g></g>
      <g transform="translate(300,70)"><g class="a-father">
        <circle r="58" fill="rgba(51,68,154,0.16)"></circle>
        <circle r="52" fill="#2E5AAC"></circle>
        <text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
      </g></g>
      ${pill10('a-tag1', 138, 40, 172, 'more God? older?', '#B3261E', '#9B1C1C', '#FBEAEA')}
      <line class="a-strike1" x1="58" y1="50" x2="218" y2="30" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      ${pill10('a-tag2', 462, 40, 196, 'only a role for a time?', '#B3261E', '#9B1C1C', '#FBEAEA')}
      <line class="a-strike2" x1="370" y1="50" x2="554" y2="30" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
    </svg>`);
}

export default theFatherIsGod;
