import { frame } from './frame';
import './t20.css';

// ---------- Teaching 20: There are exactly three divine Persons ----------
// 30 seconds: one Person taking turns as Father, Son and Spirit, struck out; three Persons at once, each
// not the others; They speak to, love and know one another; counted one, two, three, and no fourth.

function exactlyThreePersons(): string {
  return frame(20, 30000, [
    { label: 'Not one in three roles', at: 0, caption: 'God is not one Person who takes turns as Father, then Son, then Spirit.' },
    { label: 'All three at once', at: 0.22, caption: 'The Father, Son and Spirit are truly distinct, always and at the same time.' },
    { label: 'Relating to one another', at: 0.46, caption: 'They really know, love and speak to one another: real Persons, not roles.' },
    { label: 'One, two, three', at: 0.72, caption: 'No more and no fewer than three, yet not three Gods: each is the whole God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: One circle takes turns being the Father, then the Son, then the Spirit, like an actor playing three parts, and this is struck out. The circle opens into three Persons, the Father, the Son and the Holy Spirit, present all at once, with dashed lines marking that each is not the others. Flowing lines show Them speaking to, loving and knowing one another. They are counted one, two, three; a fourth is struck out. Not one Person in three roles.">
      <circle class="a-actor" cx="300" cy="222" r="74" fill="none" stroke="#4A5168" stroke-width="3" stroke-dasharray="7 6"></circle>
      <g transform="translate(300,222)"><g class="a-role1"><circle r="62" fill="#2E5AAC"></circle><text y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Father?</text><text y="24" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">then…</text></g></g>
      <g transform="translate(300,222)"><g class="a-role2"><circle r="62" fill="#AE4C17"></circle><text y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Son?</text><text y="24" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">then…</text></g></g>
      <g transform="translate(300,222)"><g class="a-role3"><circle r="62" fill="#157A6E"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Spirit?</text></g></g>
      <g transform="translate(300,322)"><g class="a-onetag"><rect x="-108.5" y="-15" width="217" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">one Person, three roles?</text></g></g>
      <line class="a-onestrike" x1="222" y1="350" x2="378" y2="150" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <line class="a-isnot" x1="271.3" y1="134.4" x2="188.7" y2="279.6" stroke="#6B7080" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 6"></line>
      <line class="a-isnot" x1="328.7" y1="134.4" x2="411.3" y2="279.6" stroke="#6B7080" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 6"></line>
      <line class="a-isnot" x1="218" y1="330" x2="382" y2="330" stroke="#6B7080" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 6"></line>
      <g transform="translate(230,207)"><g class="a-isnotlabel"><rect x="-38.5" y="-15" width="77" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#4A5168" font-family="IBM Plex Sans, sans-serif">is not</text></g></g>
      <g transform="translate(370,207)"><g class="a-isnotlabel"><rect x="-38.5" y="-15" width="77" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#4A5168" font-family="IBM Plex Sans, sans-serif">is not</text></g></g>
      <g transform="translate(300,330)"><g class="a-isnotlabel"><rect x="-38.5" y="-15" width="77" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#4A5168" font-family="IBM Plex Sans, sans-serif">is not</text></g></g>
      <path class="a-arc" d="M244,100 Q130,150 136,276" fill="none" stroke="#33449A" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 10"></path>
      <path class="a-arc" d="M356,100 Q470,150 464,276" fill="none" stroke="#33449A" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 10"></path>
      <path class="a-arc" d="M206,366 Q300,420 394,366" fill="none" stroke="#33449A" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 10"></path>
      <g transform="translate(160,169)"><g class="a-arclabel"><rect x="-34.5" y="-15" width="69" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">speak</text></g></g>
      <g transform="translate(440,169)"><g class="a-arclabel"><rect x="-30.5" y="-15" width="61" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">love</text></g></g>
      <g transform="translate(300,393)"><g class="a-arclabel"><rect x="-30.5" y="-15" width="61" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">know</text></g></g>
      <g transform="translate(300,84)"><g class="a-person" style="--dx: 0px; --dy: 138px"><circle r="52" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Father</text></g></g>
      <g transform="translate(160,330)"><g class="a-person" style="--dx: 140px; --dy: -108px"><circle r="52" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Son</text></g></g>
      <g transform="translate(440,330)"><g class="a-person" style="--dx: -140px; --dy: -108px"><circle r="52" fill="#157A6E"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Spirit</text></g></g>
      <g transform="translate(356,34)"><g class="a-num" style="animation-delay: 0s"><circle r="17" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#33449A" font-family="Fraunces, Georgia, serif">1</text></g></g>
      <g transform="translate(100,286)"><g class="a-num" style="animation-delay: 0.3s"><circle r="17" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#33449A" font-family="Fraunces, Georgia, serif">2</text></g></g>
      <g transform="translate(500,286)"><g class="a-num" style="animation-delay: 0.6s"><circle r="17" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#33449A" font-family="Fraunces, Georgia, serif">3</text></g></g>
      <g transform="translate(500,150)"><g class="a-ghost"><circle r="36" fill="#FFFFFF" stroke="#8A90A6" stroke-width="2.5" stroke-dasharray="6 5"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#6B7080" font-family="Fraunces, Georgia, serif">4?</text></g></g>
      <line class="a-ghoststrike" x1="470" y1="180" x2="530" y2="120" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g class="a-centre"><text x="300" y="248" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">not one Person</text><text x="300" y="268" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">in three roles</text></g>
    </svg>`);
}

export default exactlyThreePersons;
