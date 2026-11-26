import { frame } from './frame';
import './t3.css';

// ---------- Teaching 3: God is Eternal ----------
// 30 seconds: a straight line through God runs out to both edges with an arrow at each end (never a
// circle, so time is not read as going round in cycles); time drawn in beneath as a line with a start
// and a finish, made by God; a candle on it burns out while "very old?" is struck out; Alpha and
// Omega on God's line over the start and finish of time.

const tick = (x: number) => `<line x1="${x}" y1="424" x2="${x}" y2="436" stroke="#8A90A6" stroke-width="2"></line>`;

function godIsEternal(): string {
  return frame(3, 30000, [
    { label: 'No beginning or end', at: 0, caption: 'There was never a time when God did not exist, and there never will be.' },
    { label: 'Time is made', at: 0.22, caption: 'Time is something He created, not something that rules over Him.' },
    { label: 'Not merely old', at: 0.46, caption: 'He is not merely very old: He does not grow older or wear out.' },
    { label: 'He simply is', at: 0.72, caption: 'He simply is: the Alpha and the Omega, who is and was and is to come.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: a straight line runs out from God in both directions, with an arrow at each end: no beginning and no end. A line of time appears beneath, with a start and a finish, made by God. A candle on the line of time burns down and goes out, and the question very old is struck out. Alpha and Omega stand on God's line over the start and the finish of time: God who is and was and is to come.">
      <line class="a-time" x1="160" y1="430" x2="430" y2="430" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3"></line>
      <g class="a-timeextra"><line x1="160" y1="418" x2="160" y2="442" stroke="#6B7080" stroke-width="3"></line>${[200, 240, 280, 320, 360, 400].map(tick).join('')}<path d="M428,421 L446,430 L428,439 Z" fill="#6B7080"></path></g>
      <g transform="translate(300,458)"><g class="a-timelabel"><text text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">time · made by God</text></g></g>
      <line class="a-drop" x1="160" y1="236" x2="160" y2="416" stroke="#33449A" stroke-width="2" stroke-dasharray="6 6"></line>
      <line class="a-drop" x1="440" y1="236" x2="440" y2="416" stroke="#33449A" stroke-width="2" stroke-dasharray="6 6"></line>
      <g transform="translate(160,458)"><g class="a-drop"><text text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">the start</text></g></g>
      <g transform="translate(440,458)"><g class="a-drop"><text text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">the finish</text></g></g>
      <g transform="translate(220,430)"><g class="a-candle"><rect x="-11" y="-62" width="22" height="62" rx="3" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect></g></g>
      <g transform="translate(220,430)"><g class="a-flame"><line x1="0" y1="-62" x2="0" y2="-70" stroke="#5A4F3C" stroke-width="2"></line><path d="M0,-88 Q8,-76 0,-68 Q-8,-76 0,-88 Z" fill="#E8A33C"></path></g></g>
      <g transform="translate(220,458)"><g class="a-wears"><text text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">wears out</text></g></g>
      <line class="a-line" x1="300" y1="210" x2="40" y2="210" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="5"></line>
      <line class="a-line" x1="300" y1="210" x2="560" y2="210" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="5"></line>
      <g class="a-heads"><path d="M42,198 L18,210 L42,222 Z" fill="#33449A"></path><path d="M558,198 L582,210 L558,222 Z" fill="#33449A"></path></g>
      <g transform="translate(300,300)"><g class="a-ringlabel"><rect x="-98" y="-15" width="196" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">no beginning · no end</text></g></g>
      <g transform="translate(300,210)"><g class="a-god">
        <circle r="58" fill="#12172B"></circle>
        <text y="3" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">God</text>
        <text y="23" text-anchor="middle" font-size="13" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">eternal</text>
      </g></g>
      <g transform="translate(300,300)"><g class="a-wasis"><text text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">was · is · is to come</text></g></g>
      <g transform="translate(478,64)"><g class="a-oldtag"><rect x="-58" y="-15" width="116" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">very old?</text></g></g>
      <line class="a-oldstrike" x1="414" y1="64" x2="542" y2="64" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g transform="translate(160,210)"><g class="a-letter"><circle r="24" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5"></circle><text y="9" text-anchor="middle" font-size="26" font-weight="600" fill="#33449A" font-family="Fraunces, Georgia, serif">Α</text><text y="-34" text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">Alpha</text></g></g>
      <g transform="translate(440,210)"><g class="a-letter"><circle r="24" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5"></circle><text y="9" text-anchor="middle" font-size="26" font-weight="600" fill="#33449A" font-family="Fraunces, Georgia, serif">Ω</text><text y="-34" text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">Omega</text></g></g>
    </svg>`);
}

export default godIsEternal;
