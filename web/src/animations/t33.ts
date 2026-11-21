import { frame, F, P } from './frame';
import './t33.css';

// ---------- Teaching 33: The Son reveals the Father ----------
// 40 seconds: our sight cannot reach the hidden Father; the Son is at the Father’s side; the Son comes and
// the Father is seen in Him; “only a teacher” and “the Father renamed” struck out: two Persons, one God.

function sonRevealsFather(): string {
  return frame(33, 40000, [
    { label: 'No one has seen God', at: 0, caption: 'No one has ever seen God: the Father is beyond our sight and our reach.' },
    { label: 'At the Father’s side', at: 0.22, caption: 'The Son is Himself God, at the Father’s side, and knows Him fully.' },
    { label: 'Seen Me, seen the Father', at: 0.46, caption: '“Anyone who has seen Me has seen the Father”: in Jesus we see what He is like.' },
    { label: 'Two Persons, one God', at: 0.72, caption: 'Not only a teacher, nor the Father renamed: two Persons, yet one God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father, pale and hidden inside a veil, above a box of people, Us. Their lines of sight reach up and are stopped at the veil: no one has ever seen God. The Son appears inside the veil at the Father’s side. Then the Son comes down to the people; the Father, now in full colour, is seen in the Son, who is ringed in the Father’s colour and makes the Father known: anyone who has seen Him has seen the Father. The ideas that He is only a teacher, or the Father under another name, are struck out: two Persons, one God.">
      <g transform="translate(300,64)"><g class="a-veil"><ellipse rx="150" ry="58" fill="#F0F1F5" stroke="#9AA0AD" stroke-width="2" stroke-dasharray="7 6"></ellipse></g></g>
      <g class="a-us">
        <rect x="90" y="362" width="420" height="94" rx="16" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="108" y="386" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>Us</text>
      </g>
      <g transform="translate(230,450)"><g class="a-people"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(300,450)"><g class="a-people"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(370,450)"><g class="a-people"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <line class="a-sight" x1="236" y1="386" x2="272" y2="132" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3" stroke-linecap="round"></line>
      <line class="a-sight" x1="364" y1="386" x2="328" y2="132" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3" stroke-linecap="round"></line>
      <g class="a-block">
        <line x1="258" y1="130" x2="286" y2="130" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
        <line x1="314" y1="130" x2="342" y2="130" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      </g>
      <g transform="translate(468,250)"><g class="a-nosee"><rect x="-104" y="-15" width="208" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>no one has ever seen God</text></g></g>
      <line class="a-seen" x1="300" y1="126" x2="300" y2="186" stroke="#6B7080" stroke-width="3"></line>
      <path class="a-seen" d="M292,184 L300,196 L308,184 Z" fill="#6B7080"></path>
      <g transform="translate(300,156)"><g class="a-seenpill"><rect x="-36" y="-15" width="72" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>seen in</text></g></g>
      <line class="a-known" x1="300" y1="306" x2="300" y2="346" stroke="#33449A" stroke-width="3"></line>
      <path class="a-known" d="M291,344 L300,358 L309,344 Z" fill="#33449A"></path>
      <g transform="translate(300,326)"><g class="a-knownpill"><rect x="-98" y="-15" width="196" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>makes the Father known</text></g></g>
      <g transform="translate(300,64)"><g class="a-fmove">
        <g class="a-fdim"><circle r="44" fill="#E6EBF5" stroke="#96ACD6" stroke-width="2"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#22437F" ${F}>Father</text></g>
        <g class="a-ffull"><circle r="44" fill="#2E5AAC"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text></g>
      </g></g>
      <g transform="translate(300,250)"><g class="a-echo"><circle r="54" fill="none" stroke="#2E5AAC" stroke-width="4"></circle></g></g>
      <g transform="translate(300,250)"><g class="a-sonmove"><g class="a-son">
        <circle r="44" fill="#AE4C17"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
      </g></g></g>
      <g transform="translate(300,162)"><g class="a-side"><rect x="-100" y="-15" width="200" height="30" rx="15" fill="#FFFFFF" stroke="#AE4C17"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#7E3A10" ${P}>Himself God, at His side</text></g></g>
      <g transform="translate(468,250)"><g class="a-quote"><rect x="-104" y="-15" width="208" height="30" rx="15" fill="#FFFFFF" stroke="#2E5AAC" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#22437F" ${P}>seen Me, seen the Father</text></g></g>
      <g transform="translate(130,218)"><g class="a-teacher"><rect x="-70" y="-15" width="140" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>only a teacher?</text></g></g>
      <line class="a-teacherstrike" x1="54" y1="230" x2="206" y2="206" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(130,282)"><g class="a-renamed"><rect x="-90" y="-15" width="180" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>the Father renamed?</text></g></g>
      <line class="a-renamedstrike" x1="34" y1="294" x2="226" y2="270" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(130,250)"><g class="a-onegod"><rect x="-94" y="-15" width="188" height="30" rx="15" fill="#12172B"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#FFFFFF" ${P}>two Persons, one God</text></g></g>
    </svg>`);
}

export default sonRevealsFather;
