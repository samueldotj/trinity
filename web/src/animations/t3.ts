import { frame } from './frame';
import './t3.css';

// ---------- Teaching 3: God is Eternal ----------
// 30 seconds: an unbroken circle round God with a point going round it; time drawn in beneath, made by
// God; a candle on it burns out while "very old?" is struck out; Alpha and Omega over the start and finish.

function godIsEternal(): string {
  return frame(3, 30000, [
    { label: 'No beginning or end', at: 0, caption: 'There was never a time when God did not exist, and there never will be.' },
    { label: 'Time is made', at: 0.22, caption: 'Time is something He created, not something that rules over Him.' },
    { label: 'Not merely old', at: 0.46, caption: 'He is not merely very old: He does not grow older or wear out.' },
    { label: 'He simply is', at: 0.72, caption: 'He simply is: the Alpha and the Omega, who is and was and is to come.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: God inside an unbroken circle, a point going round it without start or stop. A line of time appears beneath, made by God. A candle on the line of time burns down and goes out, and the question very old is struck out. Alpha and Omega stand on the circle over the start and the finish of time: God who is and was and is to come.">
      <line class="a-time" x1="100" y1="430" x2="500" y2="430" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3"></line>
      <g class="a-timeextra"><line x1="140" y1="424" x2="140" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="180" y1="424" x2="180" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="220" y1="424" x2="220" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="260" y1="424" x2="260" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="300" y1="424" x2="300" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="340" y1="424" x2="340" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="380" y1="424" x2="380" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="420" y1="424" x2="420" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="460" y1="424" x2="460" y2="436" stroke="#8A90A6" stroke-width="2"></line><path d="M500,421 L518,430 L500,439 Z" fill="#6B7080"></path></g>
      <g transform="translate(300,458)"><g class="a-timelabel"><text text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">time · made by God</text></g></g>
      <line class="a-drop" x1="160" y1="236" x2="160" y2="430" stroke="#33449A" stroke-width="2" stroke-dasharray="6 6"></line>
      <line class="a-drop" x1="440" y1="236" x2="440" y2="430" stroke="#33449A" stroke-width="2" stroke-dasharray="6 6"></line>
      <g transform="translate(160,458)"><g class="a-drop"><text text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">the start</text></g></g>
      <g transform="translate(440,458)"><g class="a-drop"><text text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">the finish</text></g></g>
      <g transform="translate(220,430)"><g class="a-candle"><rect x="-11" y="-62" width="22" height="62" rx="3" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect></g></g>
      <g transform="translate(220,430)"><g class="a-flame"><line x1="0" y1="-62" x2="0" y2="-70" stroke="#5A4F3C" stroke-width="2"></line><path d="M0,-88 Q8,-76 0,-68 Q-8,-76 0,-88 Z" fill="#E8A33C"></path></g></g>
      <g transform="translate(220,458)"><g class="a-wears"><text text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">wears out</text></g></g>
      <circle class="a-ring" cx="300" cy="210" r="140" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="5" transform="rotate(-90 300 210)"></circle>
      <g transform="translate(300,210)"><g class="a-orbit"><circle cy="-140" r="9" fill="#33449A"></circle><circle cy="-140" r="16" fill="rgba(51,68,154,0.2)"></circle></g></g>
      <g transform="translate(300,376)"><g class="a-ringlabel"><rect x="-98" y="-15" width="196" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">no beginning · no end</text></g></g>
      <g transform="translate(300,210)"><g class="a-god">
        <circle r="58" fill="#12172B"></circle>
        <text y="3" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">God</text>
        <text y="23" text-anchor="middle" font-size="13" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">eternal</text>
      </g></g>
      <g transform="translate(300,300)"><g class="a-wasis"><text text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">was · is · is to come</text></g></g>
      <g transform="translate(478,64)"><g class="a-oldtag"><rect x="-58" y="-15" width="116" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">very old?</text></g></g>
      <line class="a-oldstrike" x1="414" y1="64" x2="542" y2="64" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g transform="translate(160,210)"><g class="a-letter"><circle r="24" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5"></circle><text y="9" text-anchor="middle" font-size="26" font-weight="600" fill="#33449A" font-family="Fraunces, Georgia, serif">Α</text><text x="-32" y="5" text-anchor="end" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">Alpha</text></g></g>
      <g transform="translate(440,210)"><g class="a-letter"><circle r="24" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5"></circle><text y="9" text-anchor="middle" font-size="26" font-weight="600" fill="#33449A" font-family="Fraunces, Georgia, serif">Ω</text><text x="32" y="5" text-anchor="start" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">Omega</text></g></g>
    </svg>`);
}

export default godIsEternal;
