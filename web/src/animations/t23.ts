import { frame } from './frame';
import './t23.css';

// ---------- Teaching 23: The Son is eternally begotten of the Father ----------
// 24 seconds: the Father begets the Son, who has the same gold ring of the divine nature; a builder makes a house,
// another kind, and "a creature?" is struck out; no time before the Son; one God round both, a second God struck out.

function sonEternallyBegotten(): string {
  return frame(23, 24000, [
    { label: 'Begotten: same nature', at: 0, caption: 'Begotten: the Son comes from the Father, sharing the Father’s own nature.' },
    { label: 'Not made, like a house', at: 0.22, caption: 'What is made is another, lesser kind, as a house differs from its builder.' },
    { label: 'Without beginning', at: 0.46, caption: 'This begetting has no beginning: there was never a time the Son was not.' },
    { label: 'One God, not two', at: 0.72, caption: 'The Father gives the Son the whole divine nature: one God, not two Gods.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: The Father, ringed in gold for the divine nature, with an arrow labelled begets running to the Son; gold flows along it and the Son appears with the same gold ring: same nature. Below, a builder makes a house, another kind of thing, and the question a creature? beside the Son is struck out. The question a time before the Son? is struck out: eternally begotten. One ring labelled one God goes round the Father, unbegotten, and the Son, begotten, not made, and the question a second God? is struck out.">
      <ellipse class="a-onering" cx="300" cy="160" rx="236" ry="112" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="4"></ellipse>
      <line class="a-arrow" x1="232" y1="150" x2="358" y2="150" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="4" stroke-linecap="round"></line>
      <g class="a-arrowhead"><path d="M368,150 L353,158 L353,142 Z" fill="#33449A"></path></g>
      <line class="a-gift" x1="232" y1="150" x2="358" y2="150" stroke="#E8A33C" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 15"></line>
      <g transform="translate(300,118)"><g class="a-begets"><rect x="-38.5" y="-15" width="77" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">begets</text></g></g>
      <g transform="translate(300,186)"><g class="a-same"><rect x="-58" y="-15" width="116" height="30" rx="15" fill="#FFFFFF" stroke="#E8A33C"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">same nature</text></g></g>
      <g transform="translate(160,150)"><g class="a-fgold"><circle r="65" fill="none" stroke="#E8A33C" stroke-width="5"></circle></g></g>
      <g transform="translate(440,150)"><g class="a-sgold"><circle r="65" fill="none" stroke="#E8A33C" stroke-width="5"></circle></g></g>
      <g transform="translate(160,150)"><g class="a-f"><circle r="56" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Father</text></g></g>
      <g transform="translate(440,150)"><g class="a-s"><circle r="56" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Son</text></g></g>
      <g class="a-made">
      <g transform="translate(170,440)"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g>
      <text x="170" y="364" text-anchor="middle" font-size="13" font-weight="600" fill="#4A5168" font-family="IBM Plex Sans, sans-serif">builder</text>
      <g transform="translate(430,440)"><rect x="-40" y="-58" width="80" height="58" fill="#EFE9DD" stroke="#A39782" stroke-width="2"></rect><path d="M-52,-56 L0,-96 L52,-56 Z" fill="#D9CDB6" stroke="#A39782" stroke-width="2"></path><rect x="-10" y="-30" width="20" height="30" fill="#A39782"></rect></g>
      <line x1="204" y1="410" x2="366" y2="410" stroke="#5A4F3C" stroke-width="3" stroke-linecap="round"></line>
      <path d="M380,410 L366,417 L366,403 Z" fill="#5A4F3C"></path>
      <text x="290" y="398" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">makes</text>
      <text x="290" y="434" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">another kind</text>
      </g>
      <g transform="translate(482,58)"><g class="a-creature"><rect x="-58" y="-15" width="116" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">a creature?</text></g></g>
      <line class="a-creaturestrike" x1="428" y1="58" x2="536" y2="58" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g transform="translate(300,320)"><g class="a-when"><rect x="-101" y="-15" width="202" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">a time before the Son?</text></g></g>
      <line class="a-whenstrike" x1="203" y1="320" x2="397" y2="320" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g transform="translate(300,320)"><g class="a-always"><rect x="-85" y="-15" width="170" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">eternally begotten</text></g></g>
      <g transform="translate(300,272)"><g class="a-onegod"><rect x="-58" y="-19" width="116" height="38" rx="19" fill="#12172B"></rect><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">one God</text></g></g>
      <g class="a-notes"><text x="160" y="318" text-anchor="middle" font-size="15" font-weight="600" fill="#2E5AAC" font-family="IBM Plex Sans, sans-serif">unbegotten</text><text x="440" y="318" text-anchor="middle" font-size="15" font-weight="600" fill="#AE4C17" font-family="IBM Plex Sans, sans-serif">begotten, not made</text></g>
      <g transform="translate(300,384)"><g class="a-second"><rect x="-65.5" y="-15" width="131" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">a second God?</text></g></g>
      <line class="a-secondstrike" x1="238.5" y1="384" x2="361.5" y2="384" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
    </svg>`);
}

export default sonEternallyBegotten;
