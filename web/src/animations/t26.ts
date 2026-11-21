import { frame } from './frame';
import './t26.css';

// ---------- Teaching 26: The Father loves the Son eternally ----------
// 30 seconds: love flowing from the Father to the Son before the world was made; a lonely God, needing someone
// to love, struck out; started, grew and faded bounce off the steady love; that love flows out to us.

function fatherLovesSon(): string {
  return frame(26, 30000, [
    { label: 'Before the world began', at: 0, caption: 'Before anything was made, the Father and the Son already shared perfect love.' },
    { label: 'Not lonely', at: 0.22, caption: 'God was not lonely: He did not need to make the world to have someone to love.' },
    { label: 'Never began or faded', at: 0.46, caption: 'This love never started, grew or faded: it is who God eternally is.' },
    { label: 'Love flows out to us', at: 0.72, caption: 'The love God shows us flows out of the love He has always had within Himself.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: Love flows in a steady stream from the Father to the Son, labelled loves, while the world below is only an empty outline, not yet made: before the foundation of the world. A lonely God, needing someone to love, is struck out. The words started, grew and faded rise against the stream of love and fall away; it never grows, fades or starts. Then the love flows down from the Father and the Son out to people: the Father loves, the Son is beloved, and that love reaches us.">
      <g class="a-world"><rect x="150" y="300" width="300" height="110" rx="14" fill="none" stroke="#A39782" stroke-width="2" stroke-dasharray="8 6"></rect><text x="300" y="350" text-anchor="middle" font-size="15" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">the world</text><text x="300" y="372" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">not yet made</text></g>
      <g class="a-before"><text x="300" y="246" text-anchor="middle" font-size="15" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">“before the foundation of the world”</text></g>
      <g class="a-love"><line x1="222" y1="130" x2="368" y2="130" stroke="#C9D2EE" stroke-width="8" stroke-linecap="round"></line><path d="M378,130 L362,139 L362,121 Z" fill="#33449A"></path></g>
      <line class="a-lovedots" x1="222" y1="130" x2="368" y2="130" stroke="#33449A" stroke-width="8" stroke-linecap="round" stroke-dasharray="0 18"></line>
      <g transform="translate(300,96)"><g class="a-loves"><rect x="-34.5" y="-15" width="69" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">loves</text></g></g>
      <g transform="translate(160,130)"><g class="a-f"><circle r="56" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Father</text></g></g>
      <g transform="translate(440,130)"><g class="a-s"><circle r="56" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Son</text></g></g>
      <g transform="translate(300,330)"><g class="a-lonely"><circle r="46" fill="#FFFFFF" stroke="#8A90A6" stroke-width="2.5" stroke-dasharray="6 5"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#4A5168" font-family="Fraunces, Georgia, serif">lonely?</text></g></g>
      <g transform="translate(300,412)"><g class="a-need"><rect x="-108.5" y="-15" width="217" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">needing someone to love?</text></g></g>
      <line class="a-lonelystrike" x1="226" y1="440" x2="374" y2="284" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(186,226)"><g class="a-chip" style="--dy: 110px"><rect x="-46" y="-15" width="92" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">started?</text></g></g>
      <g transform="translate(300,226)"><g class="a-chip" style="--dy: 110px"><rect x="-34.5" y="-15" width="69" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">grew?</text></g></g>
      <g transform="translate(414,226)"><g class="a-chip" style="--dy: 110px"><rect x="-38.5" y="-15" width="77" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">faded?</text></g></g>
      <g transform="translate(300,300)"><g class="a-steady"><rect x="-124" y="-15" width="248" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">never grows, fades or starts</text></g></g>
      <path class="a-out" d="M300,142 Q200,230 182,364" fill="none" stroke="#33449A" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"></path>
      <path class="a-out" d="M300,142 L300,364" fill="none" stroke="#33449A" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"></path>
      <path class="a-out" d="M300,142 Q400,230 418,364" fill="none" stroke="#33449A" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"></path>
      <g transform="translate(182,432)"><g class="a-people" style="animation-delay: 0s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(300,432)"><g class="a-people" style="animation-delay: 0.3s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(418,432)"><g class="a-people" style="animation-delay: 0.6s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g class="a-us"><text x="300" y="458" text-anchor="middle" font-size="14" font-weight="600" fill="#4A5168" font-family="IBM Plex Sans, sans-serif">us</text></g>
      <g class="a-notes"><text x="160" y="218" text-anchor="middle" font-size="16" font-weight="600" fill="#2E5AAC" font-family="IBM Plex Sans, sans-serif">loves</text><text x="440" y="218" text-anchor="middle" font-size="16" font-weight="600" fill="#AE4C17" font-family="IBM Plex Sans, sans-serif">beloved</text></g>
    </svg>`);
}

export default fatherLovesSon;
