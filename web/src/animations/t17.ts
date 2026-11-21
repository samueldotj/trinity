import { F, P, frame } from './frame';
import './t17.css';

// ---------- Teaching 17: Each Person is fully God ----------
// 40 seconds: God cut into three thirds, struck out, made whole; His power, wisdom, holiness and life, all
// of it carried to each Person; "lesser", "partial" and "three Gods" struck out; prayer to the whole God.

const pill = (cls: string, x: number, y: number, w: number, text: string, stroke: string, ink: string, style = '', fill = '#FFFFFF') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"${style ? ` style="${style}"` : ''}><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="${fill}" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

const strike = (cls: string, x1: number, y1: number, x2: number, y2: number, w: number, delay = '0s') =>
  `<line class="${cls}" style="animation-delay: ${delay}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="${w}" stroke-linecap="round"></line>`;

// A third of a disc of radius 80, `d` its outline; it slides out by (dx, dy) in the first scene.
const wedge = (d: string, fill: string, lx: number, ly: number, dx: number, dy: number) =>
  `<g transform="translate(300,215)"><g class="a-wedge" style="--dx: ${dx}px; --dy: ${dy}px"><path d="${d}" fill="${fill}" stroke="#FFFFFF" stroke-width="3"></path><text x="${lx}" y="${ly + 8}" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>⅓?</text></g></g>`;

const person = (cls: string, x: number, y: number, fill: string, name: string) =>
  `<g transform="translate(${x},${y})"><g class="${cls}">
        <circle class="a-halo" r="53" fill="none" stroke="#12172B" stroke-width="3"></circle>
        <circle r="46" fill="${fill}"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>${name}</text>
        <text y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>fully God</text>
      </g></g>`;

const token = (dx: number, dy: number) =>
  `<g transform="translate(300,215)"><g class="a-token" style="--dx: ${dx}px; --dy: ${dy}px"><circle r="18" fill="#12172B" stroke="#FFFFFF" stroke-width="2"></circle><text y="4.5" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>all</text></g></g>`;

function eachFullyGod(): string {
  return frame(17, 40000, [
    { label: 'Not a third each', at: 0, caption: 'God is not split into three pieces, with each Person holding a share.' },
    { label: 'All of what God is', at: 0.22, caption: 'God has no parts: each Person has all His power, wisdom, holiness and life.' },
    { label: 'Not lesser, not three', at: 0.46, caption: 'So the Son and the Spirit are not lesser or partial gods, nor three Gods.' },
    { label: 'The whole God', at: 0.72, caption: 'Praying to the Father, the Son or the Spirit, we speak to the whole God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: a disc cut into three thirds, one for each Person, slides apart; three pieces is struck out and God is whole again. His power, wisdom, holiness and life gather into God, and all of God is carried along a line to each of the Father, the Son and the Spirit, who each get a full ring. Lesser god, partial god and three Gods are struck out. Each line says fully God; one person prays, and the prayer goes to the whole God.">
      ${wedge('M0,0 L-69.3,-40 A80,80 0 0 1 69.3,-40 Z', '#2E5AAC', 0, -46, 0, -40)}
      ${wedge('M0,0 L69.3,-40 A80,80 0 0 1 0,80 Z', '#157A6E', 40, 23, 34.6, 20)}
      ${wedge('M0,0 L0,80 A80,80 0 0 1 -69.3,-40 Z', '#AE4C17', -40, 23, -34.6, 20)}
      ${pill('a-pieces', 300, 372, 150, 'three pieces?', '#6B7080', '#3A4058')}
      ${strike('a-strike1', 186, 330, 414, 96, 6)}
      ${pill('a-attr', 130, 150, 92, 'power', '#2849B8', '#1A3285', '--dx: 170px; --dy: 65px')}
      ${pill('a-attr', 130, 196, 96, 'wisdom', '#2849B8', '#1A3285', '--dx: 170px; --dy: 19px')}
      ${pill('a-attr', 470, 150, 104, 'holiness', '#2849B8', '#1A3285', '--dx: -170px; --dy: 65px')}
      ${pill('a-attr', 470, 196, 76, 'life', '#2849B8', '#1A3285', '--dx: -170px; --dy: 19px')}
      <line class="a-spoke" x1="300" y1="155" x2="300" y2="98" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-spoke" x1="251.6" y1="250.5" x2="170.3" y2="310.4" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-spoke" x1="348.4" y1="250.5" x2="429.7" y2="310.4" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-prayer" x1="300" y1="398" x2="300" y2="280" stroke="#6B7080" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 9"></line>
      <g transform="translate(300,462)"><g class="a-worshipper"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(300,215)"><g class="a-god">
        <circle r="62" fill="rgba(51,68,154,0.16)"></circle>
        <circle r="56" fill="#12172B"></circle>
        <text y="3" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" ${F}>God</text>
        <text class="a-godsub1" y="23" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>one God</text>
        <text class="a-godsub2" y="23" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>not ⅓ each</text>
      </g></g>
      ${token(0, -167)}${token(-170, 125)}${token(170, 125)}
      ${pill('a-fully', 300, 126, 88, 'fully God', '#1B1E27', '#1B1E27', 'animation-delay: 0s')}
      ${pill('a-fully', 211, 280, 88, 'fully God', '#1B1E27', '#1B1E27', 'animation-delay: 0.3s')}
      ${pill('a-fully', 389, 280, 88, 'fully God', '#1B1E27', '#1B1E27', 'animation-delay: 0.6s')}
      ${person('a-pf', 300, 48, '#2E5AAC', 'Father')}
      ${person('a-ps', 130, 340, '#AE4C17', 'Son')}
      ${person('a-pp', 470, 340, '#157A6E', 'Spirit')}
      ${pill('a-chip', 130, 262, 120, 'lesser god?', '#6B7080', '#3A4058', 'animation-delay: 0s')}
      ${strike('a-chipstrike', 78, 262, 182, 262, 4)}
      ${pill('a-chip', 470, 262, 124, 'partial god?', '#6B7080', '#3A4058', 'animation-delay: 0.4s')}
      ${strike('a-chipstrike', 416, 262, 524, 262, 4, '0.4s')}
      ${pill('a-three', 300, 410, 130, 'three Gods?', '#B3261E', '#9B1C1C', '', '#FBEAEA')}
      ${strike('a-threestrike', 244, 410, 356, 410, 4)}
    </svg>`);
}

export default eachFullyGod;
