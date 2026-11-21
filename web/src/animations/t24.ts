import { frame } from './frame';
import './t24.css';

// ---------- Teaching 24: The Holy Spirit eternally proceeds from the Father and the Son ----------
// 24 seconds: the Son begotten of the Father alone; two streams, from the Father and the Son, join as one source
// and flow to the Spirit; the Father gives the Son all that is His; "less God?" struck out, all three ringed in gold.

function spiritProceeds(): string {
  return frame(24, 24000, [
    { label: 'The Son: Father alone', at: 0, caption: 'The Son is begotten of the Father alone. The Spirit comes forth differently.' },
    { label: 'From both, as one source', at: 0.22, caption: 'The Spirit proceeds from the Father and the Son together, as from one source.' },
    { label: 'Given by the Father', at: 0.46, caption: 'The Son has this from the Father, who gives Him everything that is His.' },
    { label: 'Fully God, not less', at: 0.72, caption: 'The Spirit is not less: He receives the whole divine nature and is fully God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: The Father and the Son side by side, an arrow labelled begets running from the Father to the Son: from the Father alone. Then a line from the Father and a line from the Son meet at one point and run on as a single stream down to the Holy Spirit: He proceeds from the Father and the Son, as from one source. Gold flows from the Father to the Son, who receives all that is the Father’s, and the Son’s line glows. The question less God? beside the Spirit is struck out, and the Father, the Son and the Spirit each wear the same gold ring: the Spirit is fully God.">
      <g class="a-fs"><line x1="248" y1="110" x2="342" y2="110" stroke="#33449A" stroke-width="4" stroke-linecap="round"></line><path d="M352,110 L337,118 L337,102 Z" fill="#33449A"></path></g>
      <line class="a-give" x1="248" y1="110" x2="342" y2="110" stroke="#E8A33C" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 15"></line>
      <g transform="translate(300,30)"><g class="a-begets"><rect x="-38.5" y="-15" width="77" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">begets</text></g></g>
      <g class="a-alone"><text x="300" y="186" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">from the Father alone</text></g>
      <g transform="translate(300,30)"><g class="a-gives"><rect x="-97" y="-15" width="194" height="30" rx="15" fill="#FFFFFF" stroke="#E8A33C"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">gives all that is His</text></g></g>
      <line class="a-branch" x1="228.1" y1="153.7" x2="300" y2="236" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-branch" x1="371.9" y1="153.7" x2="300" y2="236" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-stem" x1="300" y1="236" x2="300" y2="294" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="5" stroke-linecap="round"></line>
      <g class="a-stemhead"><path d="M300,304 L291,288 L309,288 Z" fill="#33449A"></path><circle cx="300" cy="236" r="8" fill="#33449A"></circle></g>
      <path class="a-songlow" d="M371.9,153.7 L300,236" fill="none" stroke="#E8A33C" stroke-width="9" stroke-linecap="round" opacity=".55"></path>
      <path class="a-pflow" d="M228.1,153.7 L300,236 L300,294" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 13"></path>
      <path class="a-pflow" d="M371.9,153.7 L300,236 L300,294" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 13"></path>
      <g class="a-blabels"><text x="256" y="210" text-anchor="end" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">proceeds from</text><text x="344" y="210" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">and the Son</text></g>
      <g transform="translate(384,282)"><g class="a-onesource"><rect x="-65.5" y="-15" width="131" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">as one source</text></g></g>
      <g transform="translate(190,110)"><g class="a-gold" style="animation-delay: 0s"><circle r="61" fill="none" stroke="#E8A33C" stroke-width="5"></circle></g></g>
      <g transform="translate(410,110)"><g class="a-gold" style="animation-delay: 0s"><circle r="61" fill="none" stroke="#E8A33C" stroke-width="5"></circle></g></g>
      <g transform="translate(300,362)"><g class="a-gold" style="animation-delay: 0.3s"><circle r="61" fill="none" stroke="#E8A33C" stroke-width="5"></circle></g></g>
      <g transform="translate(190,110)"><g class="a-f"><circle r="52" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Father</text></g></g>
      <g transform="translate(410,110)"><g class="a-s"><circle r="52" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Son</text></g></g>
      <g transform="translate(300,362)"><g class="a-p"><circle r="52" fill="#157A6E"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Spirit</text></g></g>
      <g transform="translate(458,366)"><g class="a-less"><rect x="-50" y="-15" width="100" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">less God?</text></g></g>
      <line class="a-lessstrike" x1="412" y1="366" x2="504" y2="366" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g class="a-pnote"><text x="300" y="450" text-anchor="middle" font-size="15" font-weight="600" fill="#157A6E" font-family="IBM Plex Sans, sans-serif">proceeds · fully God</text></g>
    </svg>`);
}

export default spiritProceeds;
