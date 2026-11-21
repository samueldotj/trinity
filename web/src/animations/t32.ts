import { frame, F, P } from './frame';
import './t32.css';

// ---------- Teaching 32: The Father and Son send the Holy Spirit ----------
// 30 seconds: the Son rises from His people back to the Father; Father and Son send the Spirit in one act;
// at Pentecost He comes down and flames rest on the Church; “lesser servant” struck out: fully God.

function fatherAndSonSendSpirit(): string {
  return frame(32, 30000, [
    { label: 'Jesus returns', at: 0, caption: 'After Jesus returned to the Father, the Spirit was sent to live in His people.' },
    { label: 'Sent by both', at: 0.22, caption: 'The Father and the Son send Him: not one without the other, but one act.' },
    { label: 'Pentecost', at: 0.46, caption: 'At Pentecost the Spirit came to live in His people: a sending in time.' },
    { label: 'Not lesser', at: 0.72, caption: 'Being sent does not make Him lesser: the Spirit is fully God, and willing.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Son rises from among His people, the Church, back to the Father. The Holy Spirit appears, and arrows from both the Father and the Son send Him, in one shared act. At Pentecost the Spirit is given to the Church, and a flame rests on each person. The idea that being sent makes the Spirit a lesser servant is struck out: He is fully God and comes willingly.">
      <g class="a-church">
        <rect x="90" y="330" width="420" height="126" rx="16" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="108" y="352" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>The Church</text>
      </g>
      <g transform="translate(170,450)"><g class="a-people"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(230,450)"><g class="a-people"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(290,450)"><g class="a-people"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(350,450)"><g class="a-people"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(170,382)"><g class="a-flame" style="animation-delay: 0s"><path d="M0,-18 C8,-9 9,-2 5,3 C3,6 -3,6 -5,3 C-9,-2 -6,-8 0,-18 Z" fill="#E8A33C"></path></g></g>
      <g transform="translate(230,382)"><g class="a-flame" style="animation-delay: 0.2s"><path d="M0,-18 C8,-9 9,-2 5,3 C3,6 -3,6 -5,3 C-9,-2 -6,-8 0,-18 Z" fill="#E8A33C"></path></g></g>
      <g transform="translate(290,382)"><g class="a-flame" style="animation-delay: 0.4s"><path d="M0,-18 C8,-9 9,-2 5,3 C3,6 -3,6 -5,3 C-9,-2 -6,-8 0,-18 Z" fill="#E8A33C"></path></g></g>
      <g transform="translate(350,382)"><g class="a-flame" style="animation-delay: 0.6s"><path d="M0,-18 C8,-9 9,-2 5,3 C3,6 -3,6 -5,3 C-9,-2 -6,-8 0,-18 Z" fill="#E8A33C"></path></g></g>
      <line class="a-trail" x1="450" y1="122" x2="450" y2="344" stroke="#AE4C17" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-send" x1="186" y1="101" x2="253" y2="159" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <line class="a-send" x1="414" y1="101" x2="347" y2="159" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="a-sendhead" d="M262,167 L257.5,153.8 L248.3,164.4 Z" fill="#33449A"></path>
      <path class="a-sendhead" d="M338,167 L342.5,153.8 L351.7,164.4 Z" fill="#33449A"></path>
      <g transform="translate(224,134)"><g class="a-sendpill"><rect x="-32" y="-15" width="64" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>sends</text></g></g>
      <g transform="translate(376,134)"><g class="a-sendpill"><rect x="-32" y="-15" width="64" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>sends</text></g></g>
      <g transform="translate(300,70)"><g class="a-returns"><rect x="-88" y="-15" width="176" height="30" rx="15" fill="#FFFFFF" stroke="#AE4C17"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#7E3A10" ${P}>returns to the Father</text></g></g>
      <g transform="translate(300,70)"><g class="a-oneact"><rect x="-70" y="-15" width="140" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>one shared act</text></g></g>
      <line class="a-given" x1="300" y1="246" x2="300" y2="316" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="a-givenhead" d="M291,314 L300,328 L309,314 Z" fill="#33449A"></path>
      <g transform="translate(300,282)"><g class="a-givenpill"><rect x="-32" y="-15" width="64" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>given</text></g></g>
      <g transform="translate(436,290)"><g class="a-pentecost"><rect x="-76" y="-15" width="152" height="30" rx="15" fill="#FFFFFF" stroke="#A39782"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>Pentecost: in time</text></g></g>
      <g transform="translate(150,70)"><g class="a-father">
        <circle r="42" fill="#2E5AAC"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
      </g></g>
      <g transform="translate(450,70)"><g class="a-sonrise"><g class="a-son">
        <circle r="42" fill="#AE4C17"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
      </g></g></g>
      <g transform="translate(300,200)"><g class="a-spirit">
        <circle r="42" fill="#157A6E"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text>
      </g></g>
      <g transform="translate(470,200)"><g class="a-servant"><rect x="-72" y="-15" width="144" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>lesser servant?</text></g></g>
      <line class="a-servantstrike" x1="392" y1="214" x2="548" y2="186" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(470,200)"><g class="a-fully"><rect x="-80" y="-15" width="160" height="30" rx="15" fill="#FFFFFF" stroke="#157A6E" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#0E5A51" ${P}>fully God, willing</text></g></g>
    </svg>`);
}

export default fatherAndSonSendSpirit;
