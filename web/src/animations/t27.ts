import { frame, F, P } from './frame';
import './t27.css';

// ---------- Teaching 27: The Son eternally shares the Father’s glory ----------
// 30 seconds: one glory shines round Father and Son before the world begins; received, earned, borrowed
// struck out; glory passed to a creature struck out; as man the Son’s glory is veiled, yet still shines.

function sonSharesGlory(): string {
  return frame(27, 30000, [
    { label: 'Before the world', at: 0, caption: 'Before the world existed, the Son already had glory with the Father.' },
    { label: 'Not earned or borrowed', at: 0.22, caption: 'He did not receive it later, earn it or borrow it: He has always shared it.' },
    { label: 'Given to no creature', at: 0.46, caption: 'God gives His glory to no creature: the Son is not made, nor a lesser God.' },
    { label: 'Hidden, never lost', at: 0.72, caption: 'As man, His glory was hidden behind a humble life, but it was never lost.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father and the Son, each shining with the same glory, joined by one glory. A time line shows that glory already there before the world begins. Labels saying the Son received it later, earned it or borrowed it are struck out: He has always shared it. An arrow passing God’s glory to a creature is struck out. Then a plain veil, His human life, covers the Son, but His glory still shines round it: hidden, never lost.">
      <g transform="translate(170,180)"><g class="a-glow"><circle r="72" fill="#E8A33C" fill-opacity="0.18" stroke="#E8A33C" stroke-width="3"></circle></g></g>
      <g transform="translate(430,180)"><g class="a-glow"><circle r="72" fill="#E8A33C" fill-opacity="0.18" stroke="#E8A33C" stroke-width="3"></circle></g></g>
      <g class="a-link">
        <line x1="234" y1="180" x2="366" y2="180" stroke="#33449A" stroke-width="3"></line>
        <path d="M234,172 L220,180 L234,188 Z" fill="#33449A"></path>
        <path d="M366,172 L380,180 L366,188 Z" fill="#33449A"></path>
      </g>
      <g transform="translate(300,180)"><g class="a-onepill"><rect x="-52" y="-15" width="104" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>one glory</text></g></g>
      <g transform="translate(170,180)"><g class="a-person">
        <circle r="46" fill="#2E5AAC"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>glory</text>
      </g></g>
      <g transform="translate(430,180)"><g class="a-person">
        <circle r="46" fill="#AE4C17"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>glory</text>
      </g></g>
      <line class="a-time" x1="50" y1="380" x2="550" y2="380" stroke="#A39782" stroke-width="3" stroke-linecap="round"></line>
      <line class="a-timegold" x1="50" y1="380" x2="400" y2="380" stroke="#E8A33C" stroke-width="8" stroke-linecap="round"></line>
      <g class="a-timetext"><text x="210" y="360" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>glory before the world existed</text></g>
      <g transform="translate(420,380)"><g class="a-world">
        <circle r="24" fill="#EFE9DD" stroke="#A39782" stroke-width="2"></circle>
        <path d="M-16,-6 Q-4,-14 6,-6 Q14,2 4,10 Q-10,8 -16,-6 Z" fill="#A39782"></path>
        <text y="50" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>the world begins</text>
      </g></g>
      <g transform="translate(140,330)"><g class="a-chip"><rect x="-70" y="-15" width="140" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>received later?</text></g></g>
      <g transform="translate(300,330)"><g class="a-chip"><rect x="-46" y="-15" width="92" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>earned?</text></g></g>
      <g transform="translate(460,330)"><g class="a-chip"><rect x="-56" y="-15" width="112" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>borrowed?</text></g></g>
      <line class="a-chipstrike" x1="64" y1="344" x2="216" y2="316" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-chipstrike" x1="248" y1="344" x2="352" y2="316" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-chipstrike" x1="398" y1="344" x2="522" y2="316" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(300,410)"><g class="a-always"><rect x="-75" y="-15" width="150" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>always shared</text></g></g>
      <line class="a-giftarrow" x1="300" y1="204" x2="300" y2="326" stroke="#E8A33C" stroke-width="4" stroke-linecap="round" stroke-dasharray="7 7"></line>
      <path class="a-giftarrow" d="M291,324 L300,338 L309,324 Z" fill="#E8A33C"></path>
      <g class="a-giftlabel"><text x="316" y="276" font-size="14" font-weight="600" fill="#4A5168" ${P}>to a creature?</text></g>
      <line class="a-giftstrike" x1="272" y1="294" x2="328" y2="244" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(300,410)"><g class="a-creature"><circle cy="-50" r="10" fill="#A39782"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#A39782"></path></g></g>
      <g transform="translate(300,448)"><g class="a-nocreature"><rect x="-112" y="-15" width="224" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>His glory to no creature</text></g></g>
      <g transform="translate(430,180)"><g class="a-veil">
        <rect x="-80" y="-84" width="160" height="168" rx="14" fill="#EFE9DD" fill-opacity="0.55" stroke="#A39782" stroke-width="2"></rect>
        <text y="-62" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>as man</text>
      </g></g>
      <g transform="translate(430,180)"><g class="a-shine"><rect x="-86" y="-90" width="172" height="180" rx="18" fill="none" stroke="#E8A33C" stroke-width="4"></rect></g></g>
      <g transform="translate(430,306)"><g class="a-hidden"><rect x="-80" y="-15" width="160" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>hidden, never lost</text></g></g>
    </svg>`);
}

export default sonSharesGlory;
