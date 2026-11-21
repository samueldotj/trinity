import { frame, F, P } from './frame';
import './t40.css';

// ---------- Teaching 40: Baptism identifies believers with the Father, Son, and Holy Spirit ----------
// 40 seconds: Father, Son and Spirit named into one name as a believer goes under the water; the believer
// is joined to that name; three gods and two helpers struck out; all three named equally, one God.

function baptismOneName(): string {
  return frame(40, 40000, [
    { label: 'Baptised in the name', at: 0, caption: 'Baptised “in the name of the Father and of the Son and of the Holy Spirit.”' },
    { label: 'Belonging to Him', at: 0.22, caption: 'Baptised in His name, the believer is handed over to belong to Him.' },
    { label: 'Not three gods', at: 0.46, caption: 'Not baptised into three gods, nor into the Father with two lesser helpers.' },
    { label: 'Named equally', at: 0.72, caption: 'One name, not three: all three named equally, the one God we belong to.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: The Father, the Son and the Holy Spirit are named one after another, each joined by a line to a single plate reading One name, while a believer goes down under the water and comes up again. A line joins the believer to the name, labelled belongs to Him, and the believer now bears His name. The one name splitting into three plates for three gods is struck out, and helper labels on the Son and the Spirit are struck out. The three Persons glow together, named equally: one God.">
      <defs><clipPath id="t40-water"><rect x="0" y="-24" width="600" height="436"></rect></clipPath></defs>
      <line class="a-linef" x1="167.1" y1="98.4" x2="240" y2="170" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-lines" x1="300" y1="114" x2="300" y2="170" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-linep" x1="432.9" y1="98.4" x2="360" y2="170" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-glow" x1="167.1" y1="98.4" x2="240" y2="170" stroke="#E8A33C" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 10"></line>
      <line class="a-glow" x1="300" y1="114" x2="300" y2="170" stroke="#E8A33C" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 10"></line>
      <line class="a-glow" x1="432.9" y1="98.4" x2="360" y2="170" stroke="#E8A33C" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 10"></line>
      <line class="a-belong" x1="300" y1="362" x2="300" y2="228" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g transform="translate(300,300)"><g class="a-belonglabel"><rect x="-66" y="-14" width="132" height="28" rx="14" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>belongs to Him</text></g></g>
      <g transform="translate(130,198)"><g class="a-split" style="--dx: 170px"><rect x="-52" y="-22" width="104" height="44" rx="12" fill="#4A5168"></rect><text y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#FFFFFF" ${F}>a god?</text></g></g>
      <g transform="translate(300,198)"><g class="a-split" style="--dx: 0px"><rect x="-52" y="-22" width="104" height="44" rx="12" fill="#4A5168"></rect><text y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#FFFFFF" ${F}>a god?</text></g></g>
      <g transform="translate(470,198)"><g class="a-split" style="--dx: -170px"><rect x="-52" y="-22" width="104" height="44" rx="12" fill="#4A5168"></rect><text y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#FFFFFF" ${F}>a god?</text></g></g>
      <line class="a-splitstrike" x1="64" y1="236" x2="536" y2="160" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(300,198)"><g class="a-plate"><rect x="-100" y="-28" width="200" height="56" rx="14" fill="#12172B"></rect><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>One name</text></g></g>
      <g transform="translate(130,62)"><g class="a-f"><circle r="48" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text></g></g>
      <g transform="translate(300,62)"><g class="a-s"><circle r="48" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text><g class="a-dim"><circle r="48" fill="#F5EAE3" stroke="#D6A68B" stroke-width="2"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#7E3A10" ${F}>Son</text></g></g></g>
      <g transform="translate(470,62)"><g class="a-p"><circle r="48" fill="#157A6E"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text><g class="a-dim"><circle r="48" fill="#E3EFEE" stroke="#8ABCB6" stroke-width="2"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#0E5A51" ${F}>Spirit</text></g></g></g>
      <g transform="translate(300,140)"><g class="a-helper"><rect x="-42" y="-14" width="84" height="28" rx="14" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>helper?</text></g></g>
      <g transform="translate(470,140)"><g class="a-helper" style="animation-delay: 0.3s"><rect x="-42" y="-14" width="84" height="28" rx="14" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>helper?</text></g></g>
      <line class="a-helperstrike" x1="252" y1="154" x2="348" y2="126" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-helperstrike" x1="422" y1="154" x2="518" y2="126" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round" style="animation-delay: 0.3s"></line>
      <g transform="translate(300,140)"><g class="a-equal"><rect x="-62" y="-14" width="124" height="28" rx="14" fill="#FFFFFF" stroke="#E8A33C" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>named equally</text></g></g>
      <g clip-path="url(#t40-water)">
        <g transform="translate(300,440)"><g class="a-believer">
          <g transform="scale(1.2)"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g>
          <g class="a-named"><g transform="scale(1.2)"><circle cy="-50" r="10" fill="#12172B"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#12172B"></path></g></g>
        </g></g>
      </g>
      <g class="a-water">
        <path d="M110,412 Q155,402 200,412 Q245,422 290,412 Q335,402 380,412 Q425,422 490,410 L490,462 L110,462 Z" fill="rgba(196,218,240,0.92)"></path>
        <path d="M150,440 Q180,432 210,440 M390,444 Q420,436 450,444" fill="none" stroke="#8FB2D9" stroke-width="2" stroke-linecap="round"></path>
      </g>
      <g transform="translate(300,412)"><g class="a-ripple" style="animation-delay: 0s"><ellipse rx="40" ry="7" fill="none" stroke="#2849B8" stroke-width="2.5"></ellipse></g></g>
      <g transform="translate(300,412)"><g class="a-ripple" style="animation-delay: 0.4s"><ellipse rx="40" ry="7" fill="none" stroke="#2849B8" stroke-width="2.5"></ellipse></g></g>
      <g transform="translate(440,372)"><g class="a-bears"><rect x="-62" y="-14" width="124" height="28" rx="14" fill="#12172B"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#FFFFFF" ${P}>bears His name</text></g></g>
    </svg>`);
}

export default baptismOneName;
