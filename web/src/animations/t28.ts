import { frame, F, P } from './frame';
import './t28.css';

// ---------- Teaching 28: The three Persons have one divine will ----------
// 40 seconds: one will at the centre of the one God; three separate wishes struck out; each Person flows
// into the one will, which goes out as one purpose; the Son’s human will swings round to follow it.

function oneDivineWill(): string {
  return frame(28, 40000, [
    { label: 'One will in God', at: 0, caption: 'A will is the power to choose and want; it belongs to God’s one essence.' },
    { label: 'Not three wishes', at: 0.22, caption: 'Not three with their own wishes who must agree, bargain or overrule.' },
    { label: 'Each in His own way', at: 0.46, caption: 'They share one divine will, though each Person wills in His own way.' },
    { label: 'A human will too', at: 0.72, caption: 'As man, the Son also took a human will, always freely following the divine.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father, the Son and the Holy Spirit joined to God at the centre, where the one divine will is. The Persons drift apart, each with a separate wish pointing a different way, and a label asking whether three wills must agree; all of this is struck out. The Persons come back, each flowing in His own colour into the one will, which goes out as one arrow: one will, one purpose. Beside the Son a smaller arrow, His human will, swings round to point the same way.">
      <g class="a-spokes">
        <line x1="300" y1="144" x2="300" y2="110" stroke="#1B1E27" stroke-width="3"></line>
        <line x1="254" y1="228" x2="189" y2="273" stroke="#1B1E27" stroke-width="3"></line>
        <line x1="346" y1="228" x2="411" y2="273" stroke="#1B1E27" stroke-width="3"></line>
      </g>
      <line class="a-flow" x1="300" y1="110" x2="300" y2="144" stroke="#2E5AAC" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 7"></line>
      <line class="a-flow" x1="189" y1="273" x2="254" y2="228" stroke="#AE4C17" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 7"></line>
      <line class="a-flow" x1="411" y1="273" x2="346" y2="228" stroke="#157A6E" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 7"></line>
      <line class="a-willarrow" x1="300" y1="250" x2="300" y2="396" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="5" stroke-linecap="round"></line>
      <path class="a-willhead" d="M290,392 L300,408 L310,392 Z" fill="#33449A"></path>
      <g transform="translate(300,436)"><g class="a-willpill"><rect x="-90" y="-15" width="180" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>one will, one purpose</text></g></g>
      <g transform="translate(300,196)"><g class="a-god">
        <circle r="52" fill="#12172B"></circle>
        <text y="1" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>God</text>
        <text y="20" text-anchor="middle" font-size="13" fill="#FFFFFF" ${P}>one will</text>
      </g></g>
      <g transform="translate(300,64)"><g class="a-pf">
        <circle r="44" fill="#2E5AAC"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
      </g></g>
      <g transform="translate(150,300)"><g class="a-ps">
        <circle r="44" fill="#AE4C17"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
      </g></g>
      <g transform="translate(450,300)"><g class="a-pp">
        <circle r="44" fill="#157A6E"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text>
      </g></g>
      <g transform="translate(350,48) rotate(-15)"><g class="a-wish"><line x1="0" y1="0" x2="64" y2="0" stroke="#6B7080" stroke-width="3" stroke-dasharray="6 5"></line><path d="M64,-7 L78,0 L64,7 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(120,360) rotate(110)"><g class="a-wish"><line x1="0" y1="0" x2="64" y2="0" stroke="#6B7080" stroke-width="3" stroke-dasharray="6 5"></line><path d="M64,-7 L78,0 L64,7 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(480,360) rotate(70)"><g class="a-wish"><line x1="0" y1="0" x2="64" y2="0" stroke="#6B7080" stroke-width="3" stroke-dasharray="6 5"></line><path d="M64,-7 L78,0 L64,7 Z" fill="#6B7080"></path></g></g>
      <line class="a-wishstrike" x1="384" y1="22" x2="394" y2="54" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-wishstrike" x1="91" y1="393" x2="121" y2="403" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-wishstrike" x1="479" y1="403" x2="509" y2="392" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(300,430)"><g class="a-three"><rect x="-100" y="-15" width="200" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>three wills to agree?</text></g></g>
      <line class="a-threestrike" x1="192" y1="442" x2="408" y2="418" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(150,354)"><g class="a-human"><line x1="0" y1="0" x2="0" y2="40" stroke="#A39782" stroke-width="5" stroke-linecap="round"></line><path d="M-9,38 L0,54 L9,38 Z" fill="#A39782"></path></g></g>
      <g transform="translate(140,436)"><g class="a-humanpill"><rect x="-56" y="-15" width="112" height="30" rx="15" fill="#FFFFFF" stroke="#A39782"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>human will</text></g></g>
    </svg>`);
}

export default oneDivineWill;
