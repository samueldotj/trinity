import { F, P, frame } from './frame';
import './t7.css';

// ---------- Teaching 7: God is Omnipresent ----------
// 40 seconds: a person goes up to the heavens, down to Sheol and out to the farthest sea, and God is there;
// God stretched thin in pieces is struck out, the whole of Him in a room and at a star; God shut inside the
// world is struck out; waves spread from God and reach someone hiding behind a wall.

const pill7 = (cls: string, x: number, y: number, w: number, text: string, stroke = '#33449A', ink = '#33449A', fill = '#FFFFFF') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="${fill}" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

const body7 = (fill: string) =>
  `<circle cy="-50" r="10" fill="${fill}"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="${fill}"></path>`;

const star7 = (x: number, y: number, s: number) =>
  `<path transform="translate(${x},${y}) scale(${s})" d="M0,-12 L3.5,-3.5 L12,-3 L5.5,3 L7.5,12 L0,7 L-7.5,12 L-5.5,3 L-12,-3 L-3.5,-3.5 Z" fill="#E8A33C"></path>`;

/** A place the psalm names: its picture and name always shown in scene 1, and `here`: the person there, in God's presence. */
function place7(x: number, y: number, icon: string, name: string, nameY: number, here: string): string {
  return `<g transform="translate(${x},${y})"><g class="a-place">${icon}<text y="${nameY}" text-anchor="middle" font-size="14" font-weight="600" fill="#4A5168" ${P}>${name}</text></g></g>
      <g transform="translate(${x},${y})"><g class="${here}">
        <circle r="48" fill="rgba(51,68,154,0.12)" stroke="#33449A" stroke-width="2.5"></circle>
        <g transform="translate(0,30) scale(.7)">${body7('#4A5168')}</g>
      </g></g>`;
}

function godIsOmnipresent(): string {
  return frame(7, 40000, [
    { label: 'Already there', at: 0, caption: 'Up to the heavens, down to Sheol, out to the farthest sea: God is there.' },
    { label: 'The whole of God', at: 0.22, caption: 'Not stretched out, a little here and there: the whole God is in every place.' },
    { label: 'Not the world', at: 0.46, caption: 'God is not the world, and the world does not contain Him: He made it.' },
    { label: 'No one can hide', at: 0.72, caption: '“Do I not fill the heavens and the earth?” No one is beyond His reach.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: God at the centre with circles spreading out from Him. A person goes up to the heavens, down to Sheol and out to the farthest sea, and each time God is already there. God stretched across the world in pieces, a little here and a little there, is struck out; the whole of God is present both in your room and at the farthest star. God shut inside the world, as if it contained Him, is struck out: He made it and is distinct from it. Waves spread from God and reach a person hiding behind a wall: no one can hide from Him, who fills heaven and earth.">
      <g class="a-ripples">
        <circle cx="300" cy="230" r="120" fill="none" stroke="rgba(51,68,154,0.35)" stroke-width="2"></circle>
        <circle cx="300" cy="230" r="170" fill="none" stroke="rgba(51,68,154,0.25)" stroke-width="2"></circle>
        <circle cx="300" cy="230" r="220" fill="none" stroke="rgba(51,68,154,0.15)" stroke-width="2"></circle>
      </g>
      <g transform="translate(300,230)"><g class="a-pulse1"><circle r="236" fill="none" stroke="#33449A" stroke-width="3"></circle></g></g>
      <g transform="translate(300,230)"><g class="a-pulse2"><circle r="236" fill="none" stroke="#33449A" stroke-width="3"></circle></g></g>
      <g transform="translate(300,230)"><g class="a-pulse3"><circle r="236" fill="none" stroke="#33449A" stroke-width="3"></circle></g></g>
      ${place7(118, 72, `${star7(-30, -26, 0.9)}${star7(2, -34, 0.7)}${star7(32, -22, 0.8)}`, 'the heavens', 70, 'a-here1')}
      ${place7(118, 378, '<path d="M-46,12 Q0,40 46,12 L46,36 L-46,36 Z" fill="#5A4F3C"></path>', 'Sheol', -58, 'a-here2')}
      ${place7(482, 378, '<path d="M-46,16 q11,-8 23,0 t23,0 t23,0 t23,0" fill="none" stroke="#2849B8" stroke-width="3" stroke-linecap="round"></path><path d="M-46,30 q11,-8 23,0 t23,0 t23,0 t23,0" fill="none" stroke="#2849B8" stroke-width="3" stroke-linecap="round"></path>', 'the farthest sea', -58, 'a-here3')}
      <g transform="translate(300,230)"><g class="a-stretch">
        <ellipse rx="230" ry="66" fill="#12172B"></ellipse>
        <line x1="-77" y1="-62" x2="-77" y2="62" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="7 6"></line>
        <line x1="77" y1="-62" x2="77" y2="62" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="7 6"></line>
        <text x="-148" y="5" text-anchor="middle" font-size="15" font-weight="600" fill="#FFFFFF" ${P}>a little here</text>
        <text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>God?</text>
        <text x="148" y="5" text-anchor="middle" font-size="15" font-weight="600" fill="#FFFFFF" ${P}>a little there</text>
      </g></g>
      ${pill7('a-stretchtag', 300, 336, 236, 'spread thin, in pieces?', '#B3261E', '#9B1C1C', '#FBEAEA')}
      <line class="a-stretchstrike" x1="96" y1="310" x2="504" y2="150" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(110,400)"><g class="a-spot">
        <path d="M-30,-8 L0,-34 L30,-8 Z" fill="#A39782"></path>
        <rect x="-24" y="-8" width="48" height="32" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <rect x="-6" y="6" width="12" height="18" fill="#A39782"></rect>
        <text y="64" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>your room</text>
      </g></g>
      <g transform="translate(490,74)"><g class="a-spot">
        ${star7(0, 0, 1.8)}
        <text y="-56" text-anchor="middle" font-size="14" font-weight="600" fill="#4A5168" ${P}>the farthest star</text>
      </g></g>
      <circle class="a-whole" cx="110" cy="396" r="46" pathLength="1" stroke-dasharray="1 1" fill="rgba(51,68,154,0.08)" stroke="#33449A" stroke-width="3" transform="rotate(-90 110 396)"></circle>
      <circle class="a-whole" cx="490" cy="74" r="46" pathLength="1" stroke-dasharray="1 1" fill="rgba(51,68,154,0.08)" stroke="#33449A" stroke-width="3" transform="rotate(-90 490 74)"></circle>
      ${pill7('a-wholepill', 110, 326, 156, 'the whole of God')}
      ${pill7('a-wholepill', 490, 150, 156, 'the whole of God')}
      <g class="a-world">
        <rect x="150" y="300" width="300" height="120" rx="14" fill="rgba(239,233,221,0.92)" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="166" y="324" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>the world</text>
        <g transform="translate(196,406) scale(.7)">${body7('#6B7080')}</g>
        <g transform="translate(404,408)"><rect x="-4" y="-14" width="8" height="14" fill="#7A5C3E"></rect><path d="M0,-50 L18,-12 L-18,-12 Z" fill="#3F7A4E"></path></g>
      </g>
      <g transform="translate(300,360)"><g class="a-ghost"><circle r="34" fill="rgba(255,255,255,0.85)" stroke="#12172B" stroke-width="3" stroke-dasharray="8 6"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#12172B" ${F}>God?</text></g></g>
      ${pill7('a-ghosttag', 300, 446, 210, 'contained by the world?', '#6B7080', '#3A4058')}
      <line class="a-ghoststrike" x1="236" y1="414" x2="364" y2="306" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      ${pill7('a-distinct', 300, 446, 236, 'He made it; He is not it')}
      <g transform="translate(470,374)"><g class="a-glow"><circle r="44" fill="rgba(51,68,154,0.14)" stroke="#33449A" stroke-width="2.5"></circle></g></g>
      <g class="a-hider">
        <rect x="408" y="326" width="16" height="88" rx="2" fill="#A39782"></rect>
        <g transform="translate(470,402) scale(.9)">${body7('#6B7080')}</g>
      </g>
      ${pill7('a-hidetag', 470, 296, 150, 'hide from Him?', '#6B7080', '#3A4058')}
      <line class="a-hidestrike" x1="404" y1="304" x2="536" y2="288" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      ${pill7('a-ringlabel', 300, 452, 196, 'not limited by space')}
      <g transform="translate(300,230)"><g class="a-god">
        <circle r="54" fill="rgba(51,68,154,0.16)"></circle>
        <circle r="48" fill="#12172B"></circle>
        <text y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>God</text>
        <text y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>everywhere</text>
      </g></g>
    </svg>`);
}

export default godIsOmnipresent;
