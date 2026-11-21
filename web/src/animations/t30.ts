import { frame, F, P } from './frame';
import './t30.css';

// ---------- Teaching 30: No Person is more divine than another ----------
// 24 seconds: God’s being cut into bigger and smaller shares, struck out; the whole goes to each Person;
// a ranking with the Father on top struck out, leaving relations that only tell Them apart; equal honour.

function noPersonMoreDivine(): string {
  return frame(30, 24000, [
    { label: 'Not shared out', at: 0, caption: 'God’s being cannot be shared out in larger and smaller amounts.' },
    { label: 'Each fully God', at: 0.22, caption: 'Each Person has the whole divine essence: the same power, glory, majesty.' },
    { label: 'Relations, not ranks', at: 0.46, caption: 'Begetting and proceeding tell Them apart; they rank no Person higher.' },
    { label: 'Equal honour', at: 0.72, caption: 'All should honour the Son just as they honour the Father: equally God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: God’s one being, drawn as a circle, is cut into a bigger and a smaller share, and the cutting is struck out. The whole circle then goes to each of the Father, the Son and the Holy Spirit, so each is ringed as fully God. The Persons are pushed into a ranking, the Father on top as the real God and the others lower, and the ranking is struck out; They return level, with arrows for begets and proceeds that only tell Them apart. Equals signs join Them, and people give the Son the same honour as the Father.">
      <g transform="translate(300,170)"><g class="a-being">
        <circle r="96" fill="#12172B"></circle>
        <text x="-48" y="-2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>God</text>
        <text x="-48" y="20" text-anchor="middle" font-size="13" fill="#FFFFFF" ${P}>one being</text>
      </g></g>
      <g class="a-slice">
        <line x1="300" y1="170" x2="300" y2="76" stroke="#FFFFFF" stroke-width="4"></line>
        <line x1="300" y1="170" x2="394" y2="170" stroke="#FFFFFF" stroke-width="4"></line>
        <line x1="300" y1="170" x2="347" y2="251" stroke="#FFFFFF" stroke-width="4"></line>
      </g>
      <g transform="translate(140,70)"><g class="a-share"><rect x="-66" y="-15" width="132" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>bigger share?</text></g></g>
      <g transform="translate(470,250)"><g class="a-share"><rect x="-70" y="-15" width="140" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>smaller share?</text></g></g>
      <line class="a-slicestrike" x1="200" y1="270" x2="400" y2="70" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="7" stroke-linecap="round"></line>
      <path class="a-rel" d="M150,222 Q210,280 270,222" fill="none" stroke="#33449A" stroke-width="3"></path>
      <path class="a-rel" d="M270,222 L265.5,234.6 L257.2,226 Z" fill="#33449A"></path>
      <path class="a-rel" d="M330,222 Q390,280 450,222" fill="none" stroke="#33449A" stroke-width="3"></path>
      <path class="a-rel" d="M450,222 L445.5,234.6 L437.2,226 Z" fill="#33449A"></path>
      <path class="a-rel" d="M130,112 Q300,10 470,112" fill="none" stroke="#33449A" stroke-width="3"></path>
      <path class="a-rel" d="M470,112 L456.6,110.9 L462.8,100.7 Z" fill="#33449A"></path>
      <g transform="translate(210,262)"><g class="a-relpill"><rect x="-38" y="-15" width="76" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>begets</text></g></g>
      <g transform="translate(390,262)"><g class="a-relpill"><rect x="-44" y="-15" width="88" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>proceeds</text></g></g>
      <g transform="translate(300,61)"><g class="a-relpill"><rect x="-44" y="-15" width="88" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>proceeds</text></g></g>
      <g transform="translate(120,170)"><g class="a-honour"><circle r="64" fill="none" stroke="#E8A33C" stroke-width="4"></circle></g></g>
      <g transform="translate(300,170)"><g class="a-honour"><circle r="64" fill="none" stroke="#E8A33C" stroke-width="4"></circle></g></g>
      <g transform="translate(120,170)"><g class="a-rankf">
        <g class="a-whole" style="--dx: 180px"><circle r="56" fill="none" stroke="#12172B" stroke-width="5"></circle></g>
        <g class="a-person"><circle r="44" fill="#2E5AAC"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text></g>
      </g></g>
      <g transform="translate(300,170)"><g class="a-ranks">
        <g class="a-whole" style="--dx: 0px"><circle r="56" fill="none" stroke="#12172B" stroke-width="5"></circle></g>
        <g class="a-person"><circle r="44" fill="#AE4C17"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text></g>
      </g></g>
      <g transform="translate(480,170)"><g class="a-ranks">
        <g class="a-whole" style="--dx: -180px"><circle r="56" fill="none" stroke="#12172B" stroke-width="5"></circle></g>
        <g class="a-person"><circle r="44" fill="#157A6E"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text></g>
      </g></g>
      <g transform="translate(120,250)"><g class="a-fully"><rect x="-50" y="-15" width="100" height="30" rx="15" fill="#FFFFFF" stroke="#12172B"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#12172B" ${P}>fully God</text></g></g>
      <g transform="translate(300,250)"><g class="a-fully"><rect x="-50" y="-15" width="100" height="30" rx="15" fill="#FFFFFF" stroke="#12172B"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#12172B" ${P}>fully God</text></g></g>
      <g transform="translate(480,250)"><g class="a-fully"><rect x="-50" y="-15" width="100" height="30" rx="15" fill="#FFFFFF" stroke="#12172B"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#12172B" ${P}>fully God</text></g></g>
      <g transform="translate(120,30)"><g class="a-rankpill"><rect x="-64" y="-15" width="128" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>the real God?</text></g></g>
      <g transform="translate(300,326)"><g class="a-rankpill"><rect x="-44" y="-15" width="88" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>lesser?</text></g></g>
      <g transform="translate(480,326)"><g class="a-rankpill"><rect x="-44" y="-15" width="88" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>lesser?</text></g></g>
      <line class="a-rankstrike" x1="60" y1="40" x2="540" y2="340" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="7" stroke-linecap="round"></line>
      <g transform="translate(210,170)"><g class="a-eq"><rect x="-18" y="-15" width="36" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="6" text-anchor="middle" font-size="18" font-weight="600" fill="#3A4058" ${P}>=</text></g></g>
      <g transform="translate(390,170)"><g class="a-eq"><rect x="-18" y="-15" width="36" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="6" text-anchor="middle" font-size="18" font-weight="600" fill="#3A4058" ${P}>=</text></g></g>
      <line class="a-honourline" x1="268" y1="388" x2="150" y2="294" stroke="#E8A33C" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-honourline" x1="300" y1="386" x2="300" y2="294" stroke="#E8A33C" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <g transform="translate(240,456)"><g class="a-people"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(300,456)"><g class="a-people" style="animation-delay: 0.3s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(360,456)"><g class="a-people" style="animation-delay: 0.6s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(470,420)"><g class="a-samepill"><rect x="-64" y="-15" width="128" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>same honour</text></g></g>
    </svg>`);
}

export default noPersonMoreDivine;
