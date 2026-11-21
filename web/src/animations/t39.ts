import { frame, F, P } from './frame';
import './t39.css';

// ---------- Teaching 39: Salvation is the work of the Father, Son, and Holy Spirit ----------
// 40 seconds: the Father chooses each believer before the world; the Son's cross breaks the chain; the Spirit's
// seal comes down and changes them; "a stern Father?" struck out, the Father sends the Son in love.

function salvationTriuneWork(): string {
  return frame(39, 40000, [
    { label: 'The Father chooses', at: 0, caption: 'The Father plans and chooses: He chose us in Christ before the world began.' },
    { label: 'The Son redeems', at: 0.22, caption: 'The Son comes and gives His life: in Him we have redemption through His blood.' },
    { label: 'The Spirit seals', at: 0.46, caption: 'The Spirit brings the rescue home: He seals us and changes us from within.' },
    { label: 'One work, all for us', at: 0.72, caption: 'Not a stern Father won over by a kind Son: one work, all three for us.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: The Father, the Son and the Spirit above a group of believers. An arrow labelled chooses runs from the Father, and a ring of light marks each believer, chosen before the world began. An arrow labelled redeems runs from the Son, a cross appears, and the chain across the believers breaks. An arrow labelled seals runs from the Spirit, a seal comes down onto the believers and they are changed. The idea of a stern Father is struck out; an arrow shows the Father sending the Son in love: one salvation, the work of all three.">
      <g class="a-box">
        <rect x="60" y="300" width="480" height="152" rx="16" fill="#F4F1EA" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="78" y="326" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>Believers</text>
      </g>
      <g transform="translate(140,444)"><g class="a-people" style="animation-delay: 0s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(220,444)"><g class="a-people" style="animation-delay: 0.15s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(300,444)"><g class="a-people" style="animation-delay: 0.3s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(380,444)"><g class="a-people" style="animation-delay: 0.45s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(460,444)"><g class="a-people" style="animation-delay: 0.6s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(140,444)"><g class="a-changed" style="animation-delay: 0s"><circle cy="-50" r="10" fill="#157A6E"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#157A6E"></path></g></g>
      <g transform="translate(220,444)"><g class="a-changed" style="animation-delay: 0.15s"><circle cy="-50" r="10" fill="#157A6E"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#157A6E"></path></g></g>
      <g transform="translate(300,444)"><g class="a-changed" style="animation-delay: 0.3s"><circle cy="-50" r="10" fill="#157A6E"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#157A6E"></path></g></g>
      <g transform="translate(380,444)"><g class="a-changed" style="animation-delay: 0.45s"><circle cy="-50" r="10" fill="#157A6E"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#157A6E"></path></g></g>
      <g transform="translate(460,444)"><g class="a-changed" style="animation-delay: 0.6s"><circle cy="-50" r="10" fill="#157A6E"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#157A6E"></path></g></g>
      <g transform="translate(140,414)"><g class="a-chosen" style="animation-delay: 0s"><circle r="34" fill="rgba(232,163,60,0.12)" stroke="#E8A33C" stroke-width="3" stroke-dasharray="6 5"></circle></g></g>
      <g transform="translate(220,414)"><g class="a-chosen" style="animation-delay: 0.15s"><circle r="34" fill="rgba(232,163,60,0.12)" stroke="#E8A33C" stroke-width="3" stroke-dasharray="6 5"></circle></g></g>
      <g transform="translate(300,414)"><g class="a-chosen" style="animation-delay: 0.3s"><circle r="34" fill="rgba(232,163,60,0.12)" stroke="#E8A33C" stroke-width="3" stroke-dasharray="6 5"></circle></g></g>
      <g transform="translate(380,414)"><g class="a-chosen" style="animation-delay: 0.45s"><circle r="34" fill="rgba(232,163,60,0.12)" stroke="#E8A33C" stroke-width="3" stroke-dasharray="6 5"></circle></g></g>
      <g transform="translate(460,414)"><g class="a-chosen" style="animation-delay: 0.6s"><circle r="34" fill="rgba(232,163,60,0.12)" stroke="#E8A33C" stroke-width="3" stroke-dasharray="6 5"></circle></g></g>
      <g transform="translate(446,326)"><g class="a-before"><rect x="-88" y="-14" width="176" height="28" rx="14" fill="#FFFFFF" stroke="#E8A33C" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>before the world began</text></g></g>
      <g transform="translate(300,416)"><g class="a-chainl"><line x1="-188" y1="0" x2="-2" y2="0" stroke="#4A5168" stroke-width="6" stroke-dasharray="14 6" stroke-linecap="round"></line></g></g>
      <g transform="translate(300,416)"><g class="a-chainr"><line x1="2" y1="0" x2="188" y2="0" stroke="#4A5168" stroke-width="6" stroke-dasharray="14 6" stroke-linecap="round"></line></g></g>
      <line class="a-arrowf" x1="133.6" y1="118.5" x2="214.7" y2="287.2" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-labelf"><path d="M208.4,290.3 L220,298 L221.0,284.1 Z" fill="#33449A"></path></g>
      <line class="a-arrows" x1="300" y1="124" x2="300" y2="286" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-labels"><path d="M293,286 L300,298 L307,286 Z" fill="#33449A"></path></g>
      <line class="a-arrowp" x1="466.4" y1="118.5" x2="385.3" y2="287.2" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-labelp"><path d="M391.6,290.3 L380,298 L379.0,284.1 Z" fill="#33449A"></path></g>
      <g transform="translate(300,218)"><g class="a-cross"><rect x="-6" y="-34" width="12" height="68" rx="2" fill="#5A4F3C"></rect><rect x="-24" y="-18" width="48" height="12" rx="2" fill="#5A4F3C"></rect></g></g>
      <g transform="translate(172,200)"><g class="a-labelf"><rect x="-40" y="-14" width="80" height="28" rx="14" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>chooses</text></g></g>
      <g transform="translate(300,205)"><g class="a-labels"><rect x="-42" y="-14" width="84" height="28" rx="14" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>redeems</text></g></g>
      <g transform="translate(428,200)"><g class="a-labelp"><rect x="-32" y="-14" width="64" height="28" rx="14" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>seals</text></g></g>
      <line class="a-love" x1="164" y1="70" x2="234" y2="70" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-lovelabel"><path d="M234,63 L246,70 L234,77 Z" fill="#33449A"></path><text x="205" y="44" text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" ${P}>sends, in love</text></g>
      <g transform="translate(226,150)"><g class="a-stern"><rect x="-64" y="-15" width="128" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>a stern Father?</text></g></g>
      <line class="a-sternstrike" x1="156" y1="166" x2="296" y2="134" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(110,70)"><g class="a-person"><circle r="50" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text></g></g>
      <g transform="translate(300,70)"><g class="a-person"><circle r="50" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text></g></g>
      <g transform="translate(490,70)"><g class="a-person"><circle r="50" fill="#157A6E"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text></g></g>
      <g transform="translate(480,326)"><g class="a-seal" style="--dx: 10px; --dy: -256px"><circle r="23" fill="#157A6E"></circle><circle r="18" fill="none" stroke="#FFFFFF" stroke-width="1.5"></circle><text y="4" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>sealed</text></g></g>
      <g transform="translate(300,326)"><g class="a-one"><rect x="-66" y="-14" width="132" height="28" rx="14" fill="#12172B"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#FFFFFF" ${P}>one salvation</text></g></g>
    </svg>`);
}

export default salvationTriuneWork;
