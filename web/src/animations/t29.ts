import { frame, F, P } from './frame';
import './t29.css';

// ---------- Teaching 29: The three Persons act inseparably in divine works ----------
// 40 seconds: three separate jobs struck out; one work runs from the Father, through the Son, in the Spirit;
// creation, redemption and holiness each lit with one Person; the same God works all things.

function inseparableWorks(): string {
  return frame(29, 40000, [
    { label: 'Not three jobs', at: 0, caption: 'God’s work is not split into three separate jobs, like a team’s tasks.' },
    { label: 'From, through, in', at: 0.22, caption: 'One work together: from the Father, through the Son, in the Spirit.' },
    { label: 'Fitting to each', at: 0.46, caption: 'Creation, redemption and holiness each fit one Person; none works alone.' },
    { label: 'The same God', at: 0.72, caption: '“The same God works all things in all people”: one will, one power.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father, the Son and the Holy Spirit in a row. Below each a separate job box appears, like a team sharing out tasks, and the three boxes are struck out. They gather into one box, One work, as a light passes from the Father, through the Son, in the Spirit, and one arrow, one act, comes down into it. Inside are creation, redemption and making holy, each lit in turn with the Father, the Son and the Spirit while all three stay at work. Then a frame shows the same God round all three, and the whole work is lit.">
      <g transform="translate(300,80)"><g class="a-godframe">
        <rect x="-216" y="-60" width="432" height="118" rx="50" fill="none" stroke="#12172B" stroke-width="3"></rect>
      </g></g>
      <g transform="translate(300,8)"><g class="a-godpill"><rect x="-66" y="-15" width="132" height="30" rx="15" fill="#12172B"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#FFFFFF" ${P}>the same God</text></g></g>
      <g class="a-arrows">
        <line x1="186" y1="80" x2="244" y2="80" stroke="#33449A" stroke-width="3"></line><path d="M244,72 L256,80 L244,88 Z" fill="#33449A"></path>
        <line x1="346" y1="80" x2="404" y2="80" stroke="#33449A" stroke-width="3"></line><path d="M404,72 L416,80 L404,88 Z" fill="#33449A"></path>
      </g>
      <g transform="translate(140,80)"><g class="a-dot"><circle r="9" fill="#E8A33C"></circle></g></g>
      <g transform="translate(140,80)"><g class="a-ring1"><circle r="50" fill="none" stroke="#E8A33C" stroke-width="4"></circle></g></g>
      <g transform="translate(300,80)"><g class="a-ring2"><circle r="50" fill="none" stroke="#E8A33C" stroke-width="4"></circle></g></g>
      <g transform="translate(460,80)"><g class="a-ring3"><circle r="50" fill="none" stroke="#E8A33C" stroke-width="4"></circle></g></g>
      <g transform="translate(140,80)"><g class="a-person">
        <circle r="42" fill="#2E5AAC"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
      </g></g>
      <g transform="translate(300,80)"><g class="a-person">
        <circle r="42" fill="#AE4C17"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
      </g></g>
      <g transform="translate(460,80)"><g class="a-person">
        <circle r="42" fill="#157A6E"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text>
      </g></g>
      <g class="a-joblines">
        <line x1="140" y1="126" x2="140" y2="232" stroke="#6B7080" stroke-width="2.5" stroke-dasharray="6 5"></line>
        <line x1="300" y1="126" x2="300" y2="232" stroke="#6B7080" stroke-width="2.5" stroke-dasharray="6 5"></line>
        <line x1="460" y1="126" x2="460" y2="232" stroke="#6B7080" stroke-width="2.5" stroke-dasharray="6 5"></line>
      </g>
      <g transform="translate(140,264)"><g class="a-job" style="--dx: 160px"><rect x="-58" y="-28" width="116" height="56" rx="10" fill="#FFFFFF" stroke="#6B7080" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>His own job?</text></g></g>
      <g transform="translate(300,264)"><g class="a-job" style="--dx: 0px"><rect x="-58" y="-28" width="116" height="56" rx="10" fill="#FFFFFF" stroke="#6B7080" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>His own job?</text></g></g>
      <g transform="translate(460,264)"><g class="a-job" style="--dx: -160px"><rect x="-58" y="-28" width="116" height="56" rx="10" fill="#FFFFFF" stroke="#6B7080" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>His own job?</text></g></g>
      <line class="a-jobstrike" x1="70" y1="306" x2="530" y2="222" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(300,350)"><g class="a-team"><rect x="-110" y="-15" width="220" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>a team sharing out tasks?</text></g></g>
      <g transform="translate(140,162)"><g class="a-note"><rect x="-32" y="-15" width="64" height="30" rx="15" fill="#FFFFFF" stroke="#2E5AAC"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#22437F" ${P}>from</text></g></g>
      <g transform="translate(300,162)"><g class="a-note"><rect x="-44" y="-15" width="88" height="30" rx="15" fill="#FFFFFF" stroke="#AE4C17"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#7E3A10" ${P}>through</text></g></g>
      <g transform="translate(460,162)"><g class="a-note"><rect x="-26" y="-15" width="52" height="30" rx="15" fill="#FFFFFF" stroke="#157A6E"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#0E5A51" ${P}>in</text></g></g>
      <path class="a-brace" d="M100,184 Q100,196 120,196 L280,196 Q300,196 300,210 Q300,196 320,196 L480,196 Q500,196 500,184" fill="none" stroke="#33449A" stroke-width="3" stroke-linecap="round"></path>
      <line class="a-act" x1="300" y1="212" x2="300" y2="312" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="a-acthead" d="M291,310 L300,324 L309,310 Z" fill="#33449A"></path>
      <g transform="translate(300,262)"><g class="a-actpill"><rect x="-44" y="-15" width="88" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>one act</text></g></g>
      <g class="a-box">
        <rect x="110" y="326" width="380" height="126" rx="16" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="128" y="349" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>One work</text>
      </g>
      <rect class="a-hl1" x="138" y="358" width="104" height="86" rx="12" fill="#E8A33C" fill-opacity="0.22" stroke="#E8A33C" stroke-width="2"></rect>
      <rect class="a-hl2" x="248" y="358" width="104" height="86" rx="12" fill="#E8A33C" fill-opacity="0.22" stroke="#E8A33C" stroke-width="2"></rect>
      <rect class="a-hl3" x="358" y="358" width="104" height="86" rx="12" fill="#E8A33C" fill-opacity="0.22" stroke="#E8A33C" stroke-width="2"></rect>
      <g class="a-works">
        <circle cx="190" cy="386" r="18" fill="#4F8A6E"></circle><path d="M178,380 Q188,374 194,382 Q200,390 192,396 Q182,394 178,380 Z" fill="#9CC5A1"></path>
        <rect x="296" y="364" width="8" height="44" fill="#5A4F3C"></rect><rect x="284" y="374" width="32" height="8" fill="#5A4F3C"></rect>
        <path d="M410,364 C422,378 424,390 418,400 C414,406 406,406 402,400 C396,390 402,380 410,364 Z" fill="#E8A33C"></path><path d="M410,382 C415,390 415,396 412,400 C410,402 408,402 407,400 C405,396 406,390 410,382 Z" fill="#FFF3D6"></path>
        <text x="190" y="432" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>creation</text>
        <text x="300" y="432" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>redemption</text>
        <text x="410" y="432" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>making holy</text>
      </g>
    </svg>`);
}

export default inseparableWorks;
