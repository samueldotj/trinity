import { F, P, frame } from './frame';
import './t13.css';

// ---------- Teaching 13: The Father, Son, and Holy Spirit are distinct Persons ----------
// 30 seconds: three real Whos side by side; at the Jordan the Son rises, the Spirit descends, the Father
// speaks; one actor in three masks, struck out; three distinct Persons, "is not", round the one God.

const person = (x: number, y: number, fill: string, name: string, style: string) =>
  `<g transform="translate(${x},${y})"><g class="a-person" style="${style}">
        <circle r="50" fill="${fill}"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>${name}</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>Person</text>
      </g></g>`;

const who = (x: number, delay: string) =>
  `<g transform="translate(${x},285)"><g class="a-who" style="animation-delay: ${delay}"><rect x="-52" y="-15" width="104" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>a real Who</text></g></g>`;

// A dashed "is not" line between two Persons' circles (radius 50, 6px clear), with its pill at the middle.
function isNot(ax: number, ay: number, bx: number, by: number, delay: string): string {
  const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, g = 56;
  const r = (v: number) => Math.round(v * 10) / 10;
  return `<line class="a-edge" x1="${r(ax + ux * g)}" y1="${r(ay + uy * g)}" x2="${r(bx - ux * g)}" y2="${r(by - uy * g)}" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
      <g transform="translate(${r((ax + bx) / 2)},${r((ay + by) / 2)})"><g class="a-isnot" style="animation-delay: ${delay}"><rect x="-32" y="-13" width="64" height="26" rx="13" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#4A5168" ${P}>is not</text></g></g>`;
}

const wave = (y: number) => `<path d="M150,${y} q25,-10 50,0 t50,0 t50,0 t50,0 t50,0 t50,0" fill="none" stroke="#8FA6D9" stroke-width="3" stroke-linecap="round"></path>`;

function distinctPersons(): string {
  return frame(13, 30000, [
    { label: 'Three real Whos', at: 0, caption: 'A Person is who someone is: Father, Son and Spirit are three real “Whos.”' },
    { label: 'At the Jordan', at: 0.22, caption: 'At once: the Son rises from the water, the Spirit descends, the Father speaks.' },
    { label: 'Not one actor', at: 0.46, caption: 'Not one Person taking turns as Father, Son, Spirit, like an actor in masks.' },
    { label: 'Distinct, one God', at: 0.72, caption: 'Truly different from each other, yet not three Gods: each is the whole of God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father, the Son and the Holy Spirit appear side by side, each a real Who. At the Jordan the Son comes up out of the water, the Spirit descends on Him like a dove, and the Father speaks from heaven: My beloved Son. One actor changing masks, Father, then Son, then Spirit, is struck out. The three Persons stand apart, each joined to the others by is not, around the one God.">
      <g class="a-water">${wave(418)}${wave(436)}</g>
      <g transform="translate(300,330)"><g class="a-json">
        <circle r="48" fill="#AE4C17"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>Person</text>
      </g></g>
      <g class="a-waterfront">${wave(400)}</g>
      <g transform="translate(300,40)"><g class="a-father2">
        <circle r="44" fill="#2E5AAC"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
        <text y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>in heaven</text>
      </g></g>
      <line class="a-voiceline" x1="300" y1="90" x2="300" y2="122" stroke="#2E5AAC" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 7"></line>
      <g transform="translate(300,140)"><g class="a-voice"><rect x="-82" y="-15" width="164" height="30" rx="15" fill="#FFFFFF" stroke="#2E5AAC"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#22437F" ${P}>“My beloved Son”</text></g></g>
      <g transform="translate(300,262)"><g class="a-dove"><path d="M-28,-2 Q-14,-24 -2,-6 Q0,-12 2,-6 Q14,-24 28,-2 Q12,-8 4,2 Q0,10 -4,2 Q-12,-8 -28,-2 Z" fill="#157A6E"></path></g></g>
      <g class="a-dovelabel"><text x="338" y="267" font-size="13" font-weight="600" fill="#0E5A51" ${P}>the Spirit descends</text></g>
      <g transform="translate(300,200)"><g class="a-actor">
        <circle class="a-actorfill" r="64" fill="#2E5AAC"></circle>
        <text class="a-m1" y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
        <text class="a-m2" y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
        <text class="a-m3" y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text>
        <text y="24" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>one Person?</text>
      </g></g>
      <g transform="translate(300,312)"><g class="a-masks"><rect x="-104" y="-15" width="208" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>one actor, three masks?</text></g></g>
      <line class="a-strike" x1="196" y1="344" x2="404" y2="96" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      ${isNot(300, 70, 140, 360, '0s')}
      ${isNot(300, 70, 460, 360, '0.2s')}
      ${isNot(140, 360, 460, 360, '0.4s')}
      <g transform="translate(300,255)"><g class="a-god">
        <circle r="40" fill="#E3E3E6" stroke="#888B95" stroke-width="2"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#12172B" ${F}>God</text>
        <text y="19" text-anchor="middle" font-size="12" fill="#12172B" ${P}>one God</text>
      </g></g>
      ${who(130, '0s')}${who(300, '0.3s')}${who(470, '0.6s')}
      ${person(300, 70, '#2E5AAC', 'Father', '--x: -170px; --y: 130px; animation-delay: 0s')}
      ${person(140, 360, '#AE4C17', 'Son', '--x: 160px; --y: -160px; animation-delay: 0.3s')}
      ${person(460, 360, '#157A6E', 'Spirit', '--x: 10px; --y: -160px; animation-delay: 0.6s')}
    </svg>`);
}

export default distinctPersons;
