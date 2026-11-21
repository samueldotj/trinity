import { frame } from './frame';
import './t5.css';

// ---------- Teaching 5: God is Immutable ----------
// 30 seconds: more and less bounce off; a sun crosses and a shadow swings while God has none; goodness,
// faithfulness and love the same in every age; people change and pray, God answers and stays the same.

function godIsImmutable(): string {
  return frame(5, 30000, [
    { label: 'Not more or less', at: 0, caption: 'God never becomes more or less than He is: He does not grow, weaken or age.' },
    { label: 'No shifting shadow', at: 0.22, caption: 'Unlike the sun, with its moving shadows, God is always the same.' },
    { label: 'Always faithful', at: 0.46, caption: 'His faithfulness and love never change: His promises can be relied on.' },
    { label: 'Acts, yet the same', at: 0.72, caption: 'He acts, answers prayer and deals with changing people, yet stays the same.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: God inside a double circle that stands for a nature that does not change. Labels wiser, stronger, weaker and older come at Him and fall away. A sun crosses the sky and a post's shadow swings, while God has no shifting shadow. His goodness, faithfulness and love stay the same from Jacob's day to today and always. People change and pray; God answers, and stays the same.">
      <g class="a-ground">
        <line x1="40" y1="446" x2="260" y2="446" stroke="#A39782" stroke-width="3" stroke-linecap="round"></line>
        <rect x="128" y="386" width="9" height="60" rx="2" fill="#7A5C3E"></rect>
      </g>
      <g transform="translate(132,443)"><g class="a-shadow"><rect x="0" y="-3" width="84" height="7" rx="3" fill="rgba(18,23,43,0.35)"></rect></g></g>
      <g transform="translate(132,300)"><g class="a-sun"><circle r="17" fill="#E8A33C"></circle><line x1="0" y1="-22" x2="0" y2="-29" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(0)"></line><line x1="0" y1="-22" x2="0" y2="-29" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(45)"></line><line x1="0" y1="-22" x2="0" y2="-29" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(90)"></line><line x1="0" y1="-22" x2="0" y2="-29" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(135)"></line><line x1="0" y1="-22" x2="0" y2="-29" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(180)"></line><line x1="0" y1="-22" x2="0" y2="-29" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(225)"></line><line x1="0" y1="-22" x2="0" y2="-29" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(270)"></line><line x1="0" y1="-22" x2="0" y2="-29" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" transform="rotate(315)"></line></g></g>
      <g transform="translate(486,190)"><g class="a-noshadow"><rect x="-80" y="-15" width="160" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">no shifting shadow</text></g></g>
      <g transform="translate(300,190)"><g class="a-ring">
        <circle r="92" fill="none" stroke="#33449A" stroke-width="4"></circle>
        <circle r="102" fill="none" stroke="#33449A" stroke-width="4"></circle>
      </g></g>
      <g transform="translate(240,62)"><g class="a-chip" style="--dy: -78px"><rect x="-52" y="-15" width="104" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">+ wiser?</text></g></g>
      <g transform="translate(360,62)"><g class="a-chip" style="--dy: -78px"><rect x="-60" y="-15" width="120" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">+ stronger?</text></g></g>
      <g transform="translate(240,320)"><g class="a-chip" style="--dy: 104px"><rect x="-56" y="-15" width="112" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">− weaker?</text></g></g>
      <g transform="translate(360,320)"><g class="a-chip" style="--dy: 104px"><rect x="-50" y="-15" width="100" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">− older?</text></g></g>
      <g transform="translate(300,356)"><g class="a-nochange"><rect x="-95" y="-15" width="190" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">neither more nor less</text></g></g>
      <g transform="translate(130,190)"><g class="a-virtue"><rect x="-56" y="-15" width="112" height="30" rx="15" fill="#FFFFFF" stroke="#2849B8"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#1A3285" font-family="IBM Plex Sans, sans-serif">goodness</text></g></g>
      <g transform="translate(474,190)"><g class="a-virtue"><rect x="-66" y="-15" width="132" height="30" rx="15" fill="#FFFFFF" stroke="#2849B8"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#1A3285" font-family="IBM Plex Sans, sans-serif">faithfulness</text></g></g>
      <g transform="translate(300,330)"><g class="a-virtue"><rect x="-40" y="-15" width="80" height="30" rx="15" fill="#FFFFFF" stroke="#2849B8"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#1A3285" font-family="IBM Plex Sans, sans-serif">love</text></g></g>
      <g transform="translate(300,414)"><g class="a-card">
        <rect x="-112" y="-22" width="224" height="44" rx="10" fill="#F4F1EA" stroke="#A39782" stroke-width="1.5"></rect>
        <text class="a-year1" y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">in Jacob’s day</text>
        <text class="a-year2" y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">today</text>
        <text class="a-year3" y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">always: the same</text>
      </g></g>
      <g transform="translate(180,446)"><g class="a-people" style="animation-delay: 0s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g><g transform="translate(300,446)"><g class="a-people" style="animation-delay: 0.3s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g><g transform="translate(420,446)"><g class="a-people" style="animation-delay: 0.6s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <line class="a-prayer" x1="300" y1="384" x2="300" y2="298" stroke="#6B7080" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 9"></line>
      <g class="a-prayerlabel"><text x="288" y="346" text-anchor="end" font-size="13" font-weight="600" fill="#4A5168" font-family="IBM Plex Sans, sans-serif">prayer</text></g>
      <path class="a-answer" d="M372,250 Q440,300 426,378" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="3" stroke-linecap="round"></path>
      <g class="a-answerlabel"><path d="M417,371 L426,386 L434,370 Z" fill="#33449A"></path><text x="446" y="312" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">answers</text></g>
      <g transform="translate(300,62)"><g class="a-same"><rect x="-75" y="-15" width="150" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">stays the same</text></g></g>
      <g transform="translate(300,190)"><g class="a-god">
        <circle r="56" fill="#12172B"></circle>
        <text y="2" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">God</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">unchanging</text>
      </g></g>
    </svg>`);
}

export default godIsImmutable;
