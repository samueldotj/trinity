import { frame, F, P } from './frame';
import './t37.css';

// ---------- Teaching 37: The Holy Spirit speaks, teaches, and wills ----------
// 40 seconds: the Spirit says "Set apart for Me Barnabas and Saul" and two are called; He teaches from an
// open book; He gives each one a different gift as He chooses; "only a force?" struck out: a Person.

function spiritSpeaksTeachesWills(): string {
  return frame(37, 40000, [
    { label: 'He speaks', at: 0, caption: 'The Spirit speaks: “Set apart for Me Barnabas and Saul,” whom He has called.' },
    { label: 'He teaches', at: 0.22, caption: 'He teaches all things and reminds the disciples of everything Jesus said.' },
    { label: 'He chooses', at: 0.46, caption: 'He gives out gifts to each one as He determines: He makes choices.' },
    { label: 'Someone, not something', at: 0.72, caption: 'Not a mere power like wind or electricity: a divine Person, fully God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: The Holy Spirit above the Church. He speaks, “Set apart for Me Barnabas and Saul”, and two of the people are marked out by name. An open book appears and His teaching flows to each person. He sends a different gift to each one, as He determines. A lightning bolt and gusts of wind labelled only a force are struck out: an arrow labelled speaks, teaches, wills runs from the Spirit, a Person, to the Church.">
      <g class="a-church">
        <rect x="90" y="320" width="420" height="138" rx="16" fill="#F4F1EA" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="108" y="344" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>The Church</text>
      </g>
      <g transform="translate(170,446)"><g class="a-people" style="animation-delay: 0s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(250,446)"><g class="a-people" style="animation-delay: 0.15s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(350,446)"><g class="a-people" style="animation-delay: 0.3s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(430,446)"><g class="a-people" style="animation-delay: 0.45s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(250,446)"><g class="a-called"><circle cy="-50" r="10" fill="#157A6E"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#157A6E"></path></g></g>
      <g transform="translate(350,446)"><g class="a-called" style="animation-delay: 0.3s"><circle cy="-50" r="10" fill="#157A6E"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#157A6E"></path></g></g>
      <g class="a-names"><text x="250" y="374" text-anchor="middle" font-size="13" font-weight="600" fill="#0E5A51" ${P}>Barnabas</text><text x="350" y="374" text-anchor="middle" font-size="13" font-weight="600" fill="#0E5A51" ${P}>Saul</text></g>
      <g transform="translate(300,206)"><g class="a-bubble"><rect x="-140" y="-18" width="280" height="36" rx="12" fill="#FFFFFF" stroke="#157A6E" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#0E5A51" ${P}>“Set apart for Me Barnabas and Saul”</text></g></g>
      <line class="a-teach" x1="290" y1="254" x2="174" y2="374" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-teach" x1="296" y1="256" x2="252" y2="374" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-teach" x1="304" y1="256" x2="348" y2="374" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-teach" x1="310" y1="254" x2="426" y2="374" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <g transform="translate(300,212)"><g class="a-book">
        <path d="M0,-30 Q-35,-42 -72,-32 L-72,34 Q-35,24 0,36 Z" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5" stroke-linejoin="round"></path>
        <path d="M0,-30 Q35,-42 72,-32 L72,34 Q35,24 0,36 Z" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5" stroke-linejoin="round"></path>
        <line class="a-bookline" x1="-60" y1="-16" x2="-12" y2="-12" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3" stroke-linecap="round"></line>
        <line class="a-bookline" x1="-60" y1="0" x2="-12" y2="4" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3" stroke-linecap="round" style="animation-delay: 0.2s"></line>
        <line class="a-bookline" x1="-60" y1="16" x2="-12" y2="20" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3" stroke-linecap="round" style="animation-delay: 0.4s"></line>
        <line class="a-bookline" x1="12" y1="-12" x2="60" y2="-16" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3" stroke-linecap="round" style="animation-delay: 0.6s"></line>
        <line class="a-booklineb" x1="12" y1="4" x2="60" y2="0" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3" stroke-linecap="round"></line>
        <line class="a-booklineb" x1="12" y1="20" x2="60" y2="16" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3" stroke-linecap="round" style="animation-delay: 0.2s"></line>
      </g></g>
      <g transform="translate(480,212)"><g class="a-said"><rect x="-88" y="-15" width="176" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>everything Jesus said</text></g></g>
      <g transform="translate(170,366)"><g class="a-gifta" style="--dx: 130px; --dy: -256px"><path d="M0,-14 L12,0 L0,14 L-12,0 Z" fill="#E8A33C"></path></g></g>
      <g transform="translate(250,366)"><g class="a-giftb" style="--dx: 50px; --dy: -256px"><path d="M0,-13 L3.8,-3.8 L13,-3.3 L6,3.3 L8.2,13 L0,7.6 L-8.2,13 L-6,3.3 L-13,-3.3 L-3.8,-3.8 Z" fill="#2849B8"></path></g></g>
      <g transform="translate(350,366)"><g class="a-gifta" style="--dx: -50px; --dy: -256px; animation-delay: 0.5s"><path d="M0,-14 Q11,-2 7,8 Q0,15 -7,8 Q-11,-2 0,-14 Z" fill="#157A6E"></path></g></g>
      <g transform="translate(430,366)"><g class="a-giftb" style="--dx: -130px; --dy: -256px; animation-delay: 0.5s"><circle r="10" fill="none" stroke="#33449A" stroke-width="5"></circle></g></g>
      <g transform="translate(480,200)"><g class="a-determines"><rect x="-76" y="-15" width="152" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>as He determines</text></g></g>
      <g transform="translate(490,186)"><g class="a-force">
        <path d="M10,-40 L-14,2 L0,2 L-8,40 L18,-8 L3,-8 Z" fill="#E8A33C"></path>
        <path d="M-74,-18 Q-56,-26 -38,-18 M-80,0 Q-60,-8 -40,0 M-74,18 Q-56,10 -38,18" fill="none" stroke="#8A90A6" stroke-width="3" stroke-linecap="round"></path>
      </g></g>
      <g transform="translate(490,262)"><g class="a-force"><rect x="-64" y="-15" width="128" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>only a force?</text></g></g>
      <line class="a-strike" x1="412" y1="284" x2="564" y2="144" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <line class="a-arrow" x1="300" y1="140" x2="300" y2="298" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-label"><path d="M293,298 L300,310 L307,298 Z" fill="#33449A"></path></g>
      <g transform="translate(300,226)"><g class="a-label"><rect x="-100" y="-15" width="200" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>speaks · teaches · wills</text></g></g>
      <g transform="translate(300,78)"><g class="a-spirit"><circle r="56" fill="#157A6E"></circle><text y="4" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text><g class="a-note"><text y="26" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" ${P}>a Person</text></g></g></g>
    </svg>`);
}

export default spiritSpeaksTeachesWills;
