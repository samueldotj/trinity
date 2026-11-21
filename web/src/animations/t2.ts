import { F, P, frame } from './frame';
import './t2.css';

// ---------- Teaching 2: God is Spirit ----------
// 24 seconds: a solid disc of body, size, shape and parts cracks and falls away, leaving God, who is Spirit;
// a human figure grows bigger and stronger and is struck out; a hand and an eye become power and care;
// God is Spirit, no body and no parts.

/** One quarter of the stone disc; it flies off along (dx, dy), turning by r degrees. */
function piece2(d: string, lx: number, ly: number, dx: number, dy: number, r: number, label: string): string {
  return `<g class="a-piece" style="--dx: ${dx}px; --dy: ${dy}px; --r: ${r}deg">
      <path d="${d}" fill="#8E8A80" stroke="#6E695D" stroke-width="1.5"></path>
      <text x="${lx}" y="${ly}" text-anchor="middle" font-size="15" font-weight="600" fill="#FFFFFF" ${P}>${label}</text>
    </g>`;
}

function word2(x: number, y: number, picture: string, meaning: string): string {
  return `<g transform="translate(${x},${y})"><g class="a-word">
      <text y="-30" text-anchor="middle" font-size="12" font-weight="600" fill="#4A5168" ${P}>“${picture}” pictures His</text>
      <rect x="-50" y="-17" width="100" height="34" rx="17" fill="#E3E9F7" stroke="#2849B8" stroke-width="1.5"></rect>
      <text y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#1A3285" ${P}>${meaning}</text>
    </g></g>`;
}

function godIsSpirit(): string {
  const svg = `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: a solid disc made of pieces labelled body, size, shape and parts cracks apart and falls away, leaving God, who is Spirit, inside a dotted ring. A small human figure grows bigger and stronger, is asked whether that is God, and is struck out. A hand and an eye become the words power and care. God is Spirit: no body, no parts.">
      <g transform="translate(300,250)"><g class="a-ringspin">
        <circle class="a-ring" r="150" fill="none" stroke="#33449A" stroke-width="4" stroke-linecap="round" stroke-dasharray="0.1 14"></circle>
      </g></g>
      <g transform="translate(130,450)"><g class="a-human">
        <circle cy="-106" r="17" fill="#6B7080"></circle>
        <path d="M-27,-82 Q0,-91 27,-82 L31,-36 L18,-36 L16,0 L4,0 L0,-30 L-4,0 L-16,0 L-18,-36 L-31,-36 Z" fill="#6B7080"></path>
      </g></g>
      <g transform="translate(140,96)"><g class="a-humantag"><rect x="-104" y="-15" width="208" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>bigger, stronger… God?</text></g></g>
      <line class="a-strike" x1="50" y1="452" x2="232" y2="128" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="7" stroke-linecap="round"></line>
      <g transform="translate(300,250)">
        ${piece2('M-2,-2 L-80,-2 A78,78 0 0 1 -2,-80 Z', -36, -26, -150, -110, -25, 'body')}
        ${piece2('M2,-2 L2,-80 A78,78 0 0 1 80,-2 Z', 36, -26, 150, -110, 25, 'size')}
        ${piece2('M2,2 L80,2 A78,78 0 0 1 2,80 Z', 36, 42, 150, 110, -20, 'shape')}
        ${piece2('M-2,2 L-2,80 A78,78 0 0 1 -80,2 Z', -36, 42, -150, 110, 20, 'parts')}
      </g>
      <g transform="translate(76,250)"><g class="a-icon">
        <path d="M-24,46 L-24,4 M-24,4 L-24,-30 M-9,6 L-9,-40 M6,6 L6,-38 M21,8 L21,-26" stroke="#8A7F6E" stroke-width="13" stroke-linecap="round" fill="none"></path>
        <path d="M-31,0 L-31,30 Q-31,52 -6,52 L10,52 Q28,52 28,32 L28,6 L-31,6 Z" fill="#8A7F6E"></path>
        <path d="M28,20 L44,4" stroke="#8A7F6E" stroke-width="13" stroke-linecap="round"></path>
      </g></g>
      <g transform="translate(524,250)"><g class="a-icon">
        <path d="M-46,0 Q0,-36 46,0 Q0,36 -46,0 Z" fill="#FFFFFF" stroke="#8A7F6E" stroke-width="4"></path>
        <circle r="14" fill="#8A7F6E"></circle>
      </g></g>
      ${word2(84, 250, 'hand', 'power')}
      ${word2(516, 250, 'eyes', 'care')}
      <g transform="translate(300,250)"><g class="a-god">
        <circle r="58" fill="#FFFFFF" stroke="#12172B" stroke-width="3"></circle>
        <text y="3" text-anchor="middle" font-size="26" font-weight="600" fill="#12172B" ${F}>God</text>
        <text y="23" text-anchor="middle" font-size="13" fill="#3A4058" ${P}>Spirit</text>
      </g></g>
      <g transform="translate(300,436)"><g class="a-spiritlabel"><rect x="-90" y="-15" width="180" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>no body · no parts</text></g></g>
    </svg>`;
  return frame(2, 24000, [
    { label: 'No matter', at: 0, caption: 'God is not made of matter: no body, no size or shape, no physical parts.' },
    { label: 'Not a bigger human', at: 0.22, caption: 'He is not a larger, stronger version of a human being.' },
    { label: 'Pictures, not parts', at: 0.46, caption: 'His “hand” and “eyes” are pictures of His real power and care.' },
    { label: 'God is Spirit', at: 0.72, caption: 'God is Spirit: He cannot be seen with our eyes or confined to one place.' },
  ], svg);
}

export default godIsSpirit;
