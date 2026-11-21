import { frame, F, P } from './frame';
import './t38.css';

// ---------- Teaching 38: Creation is the work of the one Triune God ----------
// 30 seconds: the work split into three shares is struck out and made whole; the Spirit hovers over the dark
// waters; from the Father, through the Son, by the Spirit the world fills with light; "helper?" struck out.

function creationTriuneWork(): string {
  return frame(38, 30000, [
    { label: 'Not three shares', at: 0, caption: 'Father, Son and Spirit did not each do a separate share of the work.' },
    { label: 'Over the waters', at: 0.22, caption: 'God created the heavens and the earth; His Spirit hovered over the waters.' },
    { label: 'From, through, by', at: 0.46, caption: 'One act: the Father made all things through the Son and by the Spirit.' },
    { label: 'Not helpers', at: 0.72, caption: 'The Son and Spirit are not helpers or tools, and not among the things made.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: A circle of work split into three shares, the Father’s, the Son’s and the Spirit’s, is struck out and closes into one whole: one act of one God. In the beginning God created; the Spirit hovers over a dark, formless world of waters. The one God appears as a ring round the Father, the Son and the Spirit, who comes down into it; a light passes from the Father through the Son and by the Spirit into the world, which fills with light, sun, star and tree. The labels helper and tool under the Son and the Spirit are struck out, and an arrow labelled creates runs from the one God to all creation.">
      <g transform="translate(300,215)"><g class="a-wedge" style="--dx: 0px; --dy: -28px">
        <path d="M0,0 L-95.3,-55 A110,110 0 0 1 95.3,-55 Z" fill="#E6EBF5" stroke="#96ACD6" stroke-width="2"></path>
        <text y="-62" text-anchor="middle" font-size="13" font-weight="600" fill="#22437F" ${P}>Father’s</text><text y="-46" text-anchor="middle" font-size="13" font-weight="600" fill="#22437F" ${P}>share</text>
      </g></g>
      <g transform="translate(300,215)"><g class="a-wedge" style="--dx: 24px; --dy: 14px">
        <path d="M0,0 L95.3,-55 A110,110 0 0 1 0,110 Z" fill="#E3EFEE" stroke="#8ABCB6" stroke-width="2"></path>
        <text x="58" y="30" text-anchor="middle" font-size="13" font-weight="600" fill="#0E5A51" ${P}>Spirit’s</text><text x="58" y="46" text-anchor="middle" font-size="13" font-weight="600" fill="#0E5A51" ${P}>share</text>
      </g></g>
      <g transform="translate(300,215)"><g class="a-wedge" style="--dx: -24px; --dy: 14px">
        <path d="M0,0 L0,110 A110,110 0 0 1 -95.3,-55 Z" fill="#F5EAE3" stroke="#D6A68B" stroke-width="2"></path>
        <text x="-58" y="30" text-anchor="middle" font-size="13" font-weight="600" fill="#7E3A10" ${P}>Son’s</text><text x="-58" y="46" text-anchor="middle" font-size="13" font-weight="600" fill="#7E3A10" ${P}>share</text>
      </g></g>
      <line class="a-sharestrike" x1="170" y1="340" x2="430" y2="92" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(300,215)"><g class="a-whole"><circle r="110" fill="#12172B"></circle><text y="9" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" ${F}>one work</text></g></g>
      <g transform="translate(300,368)"><g class="a-oneact"><rect x="-86" y="-15" width="172" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>one act of one God</text></g></g>
      <g class="a-world">
        <circle cx="480" cy="230" r="90" fill="#F4F1EA" stroke="#A39782" stroke-width="2"></circle>
      </g>
      <g class="a-item" style="animation-delay: 0s"><circle cx="440" cy="196" r="13" fill="#E8A33C"></circle></g>
      <g class="a-item" style="animation-delay: 0.2s"><path d="M525,170 L528.5,178.5 L537,179 L530.5,185 L532.5,194 L525,189 L517.5,194 L519.5,185 L513,179 L521.5,178.5 Z" fill="#E8A33C"></path></g>
      <g class="a-item" style="animation-delay: 0.4s"><rect x="497" y="244" width="8" height="18" fill="#7A5C3E"></rect><path d="M501,206 L521,246 L481,246 Z" fill="#3F7A4E"></path></g>
      <g class="a-item" style="animation-delay: 0.6s"><line x1="396" y1="262" x2="564" y2="262" stroke="#A39782" stroke-width="2"></line><path d="M414,284 Q434,276 454,284 T494,284 T534,284 M434,302 Q454,294 474,302 T514,302" fill="none" stroke="#8FB2D9" stroke-width="2.5" stroke-linecap="round"></path></g>
      <g class="a-deep">
        <circle cx="480" cy="230" r="90" fill="#3A4058" stroke="#12172B" stroke-width="2"></circle>
        <path d="M410,206 Q430,198 450,206 T490,206 T530,206 M400,234 Q420,226 440,234 T480,234 T520,234 T560,234 M414,262 Q434,254 454,262 T494,262 T534,262" fill="none" stroke="#8A90A6" stroke-width="2.5" stroke-linecap="round"></path>
      </g>
      <g transform="translate(480,350)"><g class="a-alllabel"><text text-anchor="middle" font-size="15" font-weight="600" fill="#5A4F3C" ${P}>All creation</text></g></g>
      <g transform="translate(190,240)"><g class="a-beginning"><rect x="-114" y="-15" width="228" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>In the beginning God created</text></g></g>
      <g transform="translate(290,86)"><g class="a-hover"><rect x="-100" y="-15" width="200" height="30" rx="15" fill="#FFFFFF" stroke="#157A6E"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#0E5A51" ${P}>hovering over the waters</text></g></g>
      <circle class="a-ring" cx="180" cy="230" r="150" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#12172B" stroke-width="4" transform="rotate(-90 180 230)"></circle>
      <g transform="translate(180,80)"><g class="a-onegod"><rect x="-46" y="-13" width="92" height="26" rx="13" fill="#12172B"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#FFFFFF" ${P}>one God</text></g></g>
      <line class="a-fs" x1="157.4" y1="182.4" x2="127.2" y2="238.8" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-fslabel"><path d="M121.0,235.5 L121.6,249.4 L133.4,242.1 Z" fill="#33449A"></path></g>
      <g transform="translate(142,211)"><g class="a-fslabel"><rect x="-37" y="-12" width="74" height="24" rx="12" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" ${P}>through</text></g></g>
      <line class="a-sp" x1="148" y1="290" x2="202" y2="290" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-splabel"><path d="M202,283 L214,290 L202,297 Z" fill="#33449A"></path></g>
      <g transform="translate(172,290)"><g class="a-splabel"><rect x="-17" y="-12" width="34" height="24" rx="12" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" ${P}>by</text></g></g>
      <line class="a-creates" x1="334" y1="230" x2="376" y2="230" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-createslabel"><path d="M376,223 L388,230 L376,237 Z" fill="#33449A"></path><text x="361" y="214" text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" ${P}>creates</text></g>
      <g transform="translate(180,140)"><g class="a-person"><circle r="44" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text></g></g>
      <g transform="translate(100,290)"><g class="a-person"><circle r="44" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text></g></g>
      <g transform="translate(260,290)"><g class="a-spirit"><circle r="44" fill="#157A6E"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text></g></g>
      <g transform="translate(180,140)"><g class="a-pulse"><circle r="10" fill="#E8A33C" stroke="#FFFFFF" stroke-width="3"></circle></g></g>
      <g transform="translate(100,414)"><g class="a-helper"><rect x="-50" y="-15" width="100" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>a helper?</text></g></g>
      <g transform="translate(260,414)"><g class="a-helper" style="animation-delay: 0.3s"><rect x="-42" y="-15" width="84" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>a tool?</text></g></g>
      <line class="a-helperstrike" x1="44" y1="428" x2="156" y2="400" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-helperstrike" x1="212" y1="428" x2="308" y2="400" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round" style="animation-delay: 0.3s"></line>
    </svg>`);
}

export default creationTriuneWork;
