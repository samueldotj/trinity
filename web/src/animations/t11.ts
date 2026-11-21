import { F, P, frame } from './frame';
import './t11.css';

// ---------- Teaching 11: The Son is God ----------
// 30 seconds: the Word before the beginning of time, with God and God; the Son set among made things or
// half-divine or as a second god, each struck out, and of one nature with the Father; Thomas says "My Lord
// and my God!" and Jesus accepts it; the Son is God.

const pill11 = (cls: string, x: number, y: number, w: number, text: string, stroke = '#33449A', ink = '#33449A', fill = '#FFFFFF') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="${fill}" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;
const wrong11 = (cls: string, x: number, y: number, w: number, text: string) => pill11(cls, x, y, w, text, '#B3261E', '#9B1C1C', '#FBEAEA');

const circle11 = (cls: string, x: number, y: number, r: number, fill: string, border: string, ink: string, name: string, size = 22) =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><circle r="${r}" fill="${fill}" stroke="${border}" stroke-width="2"></circle><text y="${Math.round(size / 3)}" text-anchor="middle" font-size="${size}" font-weight="600" fill="${ink}" ${F}>${name}</text></g></g>`;

const strike11 = (cls: string, x1: number, y1: number, x2: number, y2: number) =>
  `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>`;

function theSonIsGod(): string {
  return frame(11, 30000, [
    { label: 'In the beginning', at: 0, caption: 'In the beginning the Word already was; He was with God, and He was God.' },
    { label: 'Not made, not lesser', at: 0.22, caption: 'Not the greatest thing God made, nor half-divine, nor a second god.' },
    { label: '“My Lord and my God!”', at: 0.46, caption: 'Thomas calls the risen Jesus “My Lord and my God!”, and Jesus accepts it.' },
    { label: 'The Son is God', at: 0.72, caption: 'The same divine nature as the Father, yet a distinct Person: the Son is God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Son, the Word, is there before the line of time begins; He is with God the Father and He is God. Then three levels, God, in between and made things: the Son is placed among made things, then in between as half-divine, then beside the Father as a second god, and each is struck out; He and the Father share one divine nature. Thomas says to the risen Jesus, My Lord and my God, and Jesus accepts it. The picture ends with the Son lit and joined to the one God by is God.">
      <g class="a-faint">
        <line x1="300" y1="70" x2="130" y2="380" stroke="#C9C5BB" stroke-width="2"></line>
        <line x1="300" y1="70" x2="470" y2="380" stroke="#C9C5BB" stroke-width="2"></line>
        <line x1="130" y1="380" x2="470" y2="380" stroke="#C9C5BB" stroke-width="2"></line>
      </g>
      <line class="a-time" x1="210" y1="458" x2="556" y2="458" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3"></line>
      <g class="a-timemark"><line x1="210" y1="448" x2="210" y2="468" stroke="#6B7080" stroke-width="3"></line><path d="M554,451 L568,458 L554,465 Z" fill="#6B7080"></path><text x="218" y="444" font-size="13" font-weight="600" fill="#4A5168" ${P}>in the beginning</text></g>
      <g class="a-word"><text x="130" y="450" text-anchor="middle" font-size="13" font-weight="600" fill="#7E3A10" ${P}>the Word</text></g>
      <path class="a-with" d="M126,330 Q110,150 251,88" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="3" stroke-linecap="round"></path>
      ${pill11('a-withlabel', 148, 177, 96, 'with God')}
      <line class="a-spoke" x1="300" y1="250" x2="130" y2="380" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <g transform="translate(215,315)"><g class="a-isgod"><rect x="-36" y="-12" width="72" height="24" rx="12" fill="#FFFFFF" stroke="#1B1E27"></rect><text y="4.5" text-anchor="middle" font-size="13" font-weight="600" fill="#1B1E27" ${P}>is God</text></g></g>
      ${circle11('a-fdim', 300, 70, 52, '#E6EBF5', '#96ACD6', '#22437F', 'Father')}
      ${circle11('a-flit', 300, 70, 52, '#2E5AAC', '#2E5AAC', '#FFFFFF', 'Father')}
      ${circle11('a-pdim', 470, 380, 48, '#E3EFEE', '#8ABCB6', '#0E5A51', 'Spirit')}
      <g transform="translate(300,250)"><g class="a-god">
        <circle r="48" fill="#12172B"></circle>
        <text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>God</text>
      </g></g>
      <g transform="translate(130,380)"><g class="a-son">
        <circle r="54" fill="rgba(51,68,154,0.16)"></circle>
        <circle r="48" fill="#AE4C17"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
      </g></g>
      <g class="a-bands">
        <rect x="60" y="22" width="480" height="96" rx="14" fill="#E3E9F7" stroke="#2849B8" stroke-width="1.5"></rect>
        <text x="80" y="77" font-size="22" font-weight="600" fill="#1A3285" ${F}>God</text>
        <rect x="60" y="172" width="480" height="96" rx="14" fill="none" stroke="#9AA0AD" stroke-width="2" stroke-dasharray="8 6"></rect>
        <text x="80" y="225" font-size="14" font-weight="600" fill="#4A5168" ${P}>in between?</text>
        <rect x="60" y="322" width="480" height="96" rx="14" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="80" y="375" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>made things</text>
      </g>
      ${circle11('a-ftoken', 200, 70, 38, '#2E5AAC', '#2E5AAC', '#FFFFFF', 'Father', 20)}
      <ellipse class="a-same" cx="248" cy="70" rx="112" ry="44" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#1A3285" stroke-width="2.5"></ellipse>
      ${pill11('a-samelabel', 248, 142, 176, 'one divine nature')}
      <g transform="translate(296,370)"><g class="a-stoken"><circle r="38" fill="#AE4C17"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text></g></g>
      ${wrong11('a-tag1', 448, 370, 180, 'the first thing made?')}${strike11('a-strike1', 362, 380, 534, 360)}
      ${wrong11('a-tag2', 448, 220, 132, 'half-divine?')}${strike11('a-strike2', 386, 230, 510, 210)}
      ${wrong11('a-tag3', 448, 70, 140, 'a second god?')}${strike11('a-strike3', 382, 80, 514, 60)}
      <g transform="translate(400,220)"><g class="a-glow"><circle r="76" fill="rgba(232,163,60,0.18)" stroke="#E8A33C" stroke-width="2.5"></circle></g></g>
      <g transform="translate(400,220)"><g class="a-jesus">
        <circle r="56" fill="#AE4C17"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Jesus</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>risen</text>
      </g></g>
      <g transform="translate(170,346)"><g class="a-thomas"><g transform="scale(1.6)"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g></g>
      <g transform="translate(170,374)"><g class="a-thomaslabel"><text text-anchor="middle" font-size="13" font-weight="600" fill="#4A5168" ${P}>Thomas</text></g></g>
      <g transform="translate(172,236)"><g class="a-bubble">
        <rect x="-122" y="-70" width="244" height="46" rx="14" fill="#FFFFFF" stroke="#4A5168" stroke-width="2"></rect>
        <path d="M-10,-25 L0,-8 L10,-25 Z" fill="#FFFFFF" stroke="#4A5168" stroke-width="2" stroke-linejoin="round"></path>
        <rect x="-11" y="-27" width="22" height="4" fill="#FFFFFF"></rect>
        <text y="-41" text-anchor="middle" font-size="19" font-weight="600" fill="#12172B" ${F}>“My Lord and my God!”</text>
      </g></g>
      ${pill11('a-accepts', 400, 334, 140, 'He accepts it')}
    </svg>`);
}

export default theSonIsGod;
