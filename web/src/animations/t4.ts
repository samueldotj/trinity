import { frame } from './frame';
import './t4.css';

// ---------- Teaching 4: God is Uncreated ----------
// 24 seconds: "made by?" struck out; the one-way arrow to Creation and life and breath flowing from God;
// a ghost of God as one part of the world struck out; God is Father, Son and Spirit, all uncreated.

function godIsUncreated(): string {
  return frame(4, 24000, [
    { label: 'Never made', at: 0, caption: 'God was never made, caused or brought into being by anyone or anything.' },
    { label: 'All depends on Him', at: 0.22, caption: 'He needs nothing from the world; everything else depends completely on Him.' },
    { label: 'Not part of the world', at: 0.46, caption: 'He did not grow out of the universe and is not part of it, however great.' },
    { label: 'Father, Son and Spirit', at: 0.72, caption: 'Father, Son and Spirit are the one uncreated God; none of them was made.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: God, uncreated. A question mark asks who made God, and is struck out: made by no one. An arrow runs one way from God down to Creation, and lines of life and breath flow from God to the things He made. A ghost of God inside creation, as one part of the world, is struck out. God is the Father, the Son and the Spirit, all uncreated, above the line between Maker and made.">
      <line class="a-divider" x1="40" y1="262" x2="560" y2="262" stroke="#8A90A6" stroke-width="2" stroke-dasharray="8 6"></line>
      <g class="a-divider"><text x="40" y="252" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">uncreated: the Maker</text><text x="40" y="282" font-size="13" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">created: all He made</text></g>
      <g class="a-box">
        <rect x="110" y="300" width="380" height="140" rx="16" fill="#F4F1EA" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="128" y="324" font-size="14" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">Creation</text>
      </g>
      <g transform="translate(170,385)"><g class="a-item" style="animation-delay: 0s"><circle r="16" fill="#E8A33C"></circle><line x1="0" y1="-21" x2="0" y2="-27" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(0)"></line><line x1="0" y1="-21" x2="0" y2="-27" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(45)"></line><line x1="0" y1="-21" x2="0" y2="-27" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(90)"></line><line x1="0" y1="-21" x2="0" y2="-27" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(135)"></line><line x1="0" y1="-21" x2="0" y2="-27" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(180)"></line><line x1="0" y1="-21" x2="0" y2="-27" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(225)"></line><line x1="0" y1="-21" x2="0" y2="-27" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(270)"></line><line x1="0" y1="-21" x2="0" y2="-27" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(315)"></line></g></g>
      <g transform="translate(240,388)"><g class="a-item" style="animation-delay: 0.15s"><circle r="20" fill="#4F8A6E"></circle><path d="M-12,-8 Q-2,-14 4,-6 Q10,2 2,8 Q-8,6 -12,-8 Z" fill="#9CC5A1"></path></g></g>
      <g transform="translate(310,410)"><g class="a-item" style="animation-delay: 0.3s"><rect x="-4" y="-14" width="8" height="16" fill="#7A5C3E"></rect><path d="M0,-52 L20,-12 L-20,-12 Z" fill="#3F7A4E"></path></g></g>
      <g transform="translate(380,410)"><g class="a-item" style="animation-delay: 0.45s"><circle cy="-38" r="8" fill="#6B7080"></circle><path d="M-12,-27 Q0,-31 12,-27 L14,-8 L7,-8 L6,6 L1,6 L0,-6 L-1,6 L-6,6 L-7,-8 L-14,-8 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(440,372)"><g class="a-item" style="animation-delay: 0.6s"><path d="M0,-12 L3.5,-3.5 L12,-3 L5.5,3 L7.5,12 L0,7 L-7.5,12 L-5.5,3 L-12,-3 L-3.5,-3.5 Z" fill="#E8A33C"></path></g></g>
      <path class="a-life" d="M262,128 Q170,200 170,358" fill="none" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 10"></path>
      <path class="a-life" d="M338,128 Q430,200 380,360" fill="none" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 10"></path>
      <g transform="translate(118,214)"><g class="a-lifelabel"><text text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">life and breath</text></g></g>
      <line class="a-arrow" x1="300" y1="152" x2="300" y2="288" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="a-madeby" d="M291,284 L300,298 L309,284 Z" fill="#33449A"></path>
      <g transform="translate(300,222)"><g class="a-madeby"><rect x="-58" y="-15" width="116" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">made by God</text></g></g>
      <g transform="translate(300,370)"><g class="a-ghost"><circle r="46" fill="rgba(255,255,255,0.85)" stroke="#12172B" stroke-width="3" stroke-dasharray="9 7"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#12172B" font-family="Fraunces, Georgia, serif">God?</text></g></g>
      <g transform="translate(300,462)"><g class="a-ghosttag"><rect x="-100" y="-15" width="200" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">one part of the world?</text></g></g>
      <line class="a-ghoststrike" x1="246" y1="424" x2="354" y2="316" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g class="a-q">
        <circle cx="108" cy="96" r="30" fill="none" stroke="#8A90A6" stroke-width="2.5" stroke-dasharray="6 5"></circle>
        <text x="108" y="106" text-anchor="middle" font-size="28" font-weight="600" fill="#8A90A6" font-family="Fraunces, Georgia, serif">?</text>
        <line x1="142" y1="96" x2="234" y2="96" stroke="#8A90A6" stroke-width="2.5" stroke-dasharray="6 5"></line>
        <path d="M232,88 L246,96 L232,104 Z" fill="#8A90A6"></path>
        <text x="190" y="80" text-anchor="middle" font-size="13" font-weight="600" fill="#4A5168" font-family="IBM Plex Sans, sans-serif">made by?</text>
      </g>
      <line class="a-qstrike" x1="146" y1="124" x2="236" y2="66" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(170,150)"><g class="a-noone"><rect x="-75" y="-15" width="150" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">made by no one</text></g></g>
      <g transform="translate(300,96)"><g class="a-god">
        <circle r="52" fill="#12172B"></circle>
        <g class="a-godtext"><text y="2" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">God</text><text y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">uncreated</text></g>
        <g class="a-persons">
          <circle cx="-18" cy="-11" r="15" fill="#2E5AAC"></circle><text x="-18" y="-6.5" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">F</text>
          <circle cx="18" cy="-11" r="15" fill="#AE4C17"></circle><text x="18" y="-6.5" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">S</text>
          <circle cy="19" r="15" fill="#157A6E"></circle><text y="23.5" text-anchor="middle" font-size="11" font-weight="600" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">Sp</text>
        </g>
      </g></g>
      <g class="a-trilabel"><text x="368" y="90" font-size="15" font-weight="600" fill="#12172B" font-family="IBM Plex Sans, sans-serif">Father, Son and Spirit</text><text x="368" y="110" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">all uncreated</text></g>
    </svg>`);
}

export default godIsUncreated;
