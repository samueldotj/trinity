import { frame, F, P } from './frame';
import './t35.css';

// ---------- Teaching 35: The Son prays to the Father ----------
// 24 seconds: the Son speaks to the Father face to face; one actor with three masks is struck out; "not My
// will, but Yours" over the cup; one God, the Son with the Father in glory before the world existed.

function sonPraysToFather(): string {
  return frame(35, 24000, [
    { label: 'Face to face', at: 0, caption: 'Jesus prays as a real Person speaking to another, the Father, with love.' },
    { label: 'Not three masks', at: 0.22, caption: 'Father, Son and Spirit are not three masks or roles worn by one Person.' },
    { label: 'Not My will, but Yours', at: 0.46, caption: '“Not My will, but Yours”: as man the Son freely obeys; God has one will.' },
    { label: 'Before the world', at: 0.72, caption: 'Not two Gods: one God with the Father, whom He loved before the world began.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: The Son and the Father face to face. The Son’s words “Father, the hour has come” travel to the Father; the Son says “You” and calls Himself “Your Son”, and an arrow labelled prays to runs from the Son to the Father. One actor behind three masks is struck out. Beside a cup the Son prays “Not My will, but Yours”: as man He freely obeys. A ring of one God goes round the Father and the Son, both glowing with the glory they shared before the world, which appears afterwards beneath them.">
      <ellipse class="a-ring" cx="300" cy="200" rx="250" ry="100" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#12172B" stroke-width="3"></ellipse>
      <g transform="translate(300,100)"><g class="a-onegod"><rect x="-46" y="-14" width="92" height="28" rx="14" fill="#12172B"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#FFFFFF" ${P}>one God</text></g></g>
      <g transform="translate(150,200)"><g class="a-halo"><circle r="66" fill="rgba(232,163,60,0.14)" stroke="#E8A33C" stroke-width="4"></circle></g></g>
      <g transform="translate(450,200)"><g class="a-halo"><circle r="66" fill="rgba(232,163,60,0.14)" stroke="#E8A33C" stroke-width="4"></circle></g></g>
      <line class="a-arrow" x1="208" y1="200" x2="380" y2="200" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-pray"><path d="M380,193 L392,200 L380,207 Z" fill="#33449A"></path></g>
      <g transform="translate(294,200)"><g class="a-pray"><rect x="-42" y="-14" width="84" height="28" rx="14" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>prays to</text></g></g>
      <g transform="translate(150,200)"><g class="a-person"><circle r="54" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text></g></g>
      <g transform="translate(450,200)"><g class="a-person"><circle r="54" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Father</text></g></g>
      <g transform="translate(450,112)"><g class="a-bubble1"><rect x="-110" y="-17" width="220" height="34" rx="12" fill="#FFFFFF" stroke="#AE4C17" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#7E3A10" ${P}>“Father, the hour has come”</text></g></g>
      <g transform="translate(450,294)"><g class="a-you"><rect x="-40" y="-15" width="80" height="30" rx="15" fill="#FFFFFF" stroke="#2E5AAC"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#22437F" ${P}>“You”</text></g></g>
      <g transform="translate(150,294)"><g class="a-you" style="animation-delay: 0.3s"><rect x="-56" y="-15" width="112" height="30" rx="15" fill="#FFFFFF" stroke="#AE4C17"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#7E3A10" ${P}>“Your Son”</text></g></g>
      <g transform="translate(300,385)"><g class="a-actor"><circle r="36" fill="#E3E3E6" stroke="#888B95" stroke-width="2"></circle></g></g>
      <g transform="translate(246,374)"><g class="a-mask" style="animation-delay: 0s"><ellipse rx="22" ry="27" fill="#2E5AAC"></ellipse><ellipse cx="-8" cy="-6" rx="5" ry="3.5" fill="#FFFFFF"></ellipse><ellipse cx="8" cy="-6" rx="5" ry="3.5" fill="#FFFFFF"></ellipse></g></g>
      <g transform="translate(300,352)"><g class="a-mask" style="animation-delay: 0.3s"><ellipse rx="22" ry="27" fill="#AE4C17"></ellipse><ellipse cx="-8" cy="-6" rx="5" ry="3.5" fill="#FFFFFF"></ellipse><ellipse cx="8" cy="-6" rx="5" ry="3.5" fill="#FFFFFF"></ellipse></g></g>
      <g transform="translate(354,374)"><g class="a-mask" style="animation-delay: 0.6s"><ellipse rx="22" ry="27" fill="#157A6E"></ellipse><ellipse cx="-8" cy="-6" rx="5" ry="3.5" fill="#FFFFFF"></ellipse><ellipse cx="8" cy="-6" rx="5" ry="3.5" fill="#FFFFFF"></ellipse></g></g>
      <g transform="translate(300,446)"><g class="a-maskpill"><rect x="-104" y="-15" width="208" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>one Person, three masks?</text></g></g>
      <line class="a-maskstrike" x1="196" y1="452" x2="404" y2="318" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(150,334)"><g class="a-cup">
        <path d="M-25,-34 L25,-34 Q22,-5 0,0 Q-22,-5 -25,-34 Z" fill="#EFE9DD" stroke="#A39782" stroke-width="2"></path>
        <rect x="-3" y="0" width="6" height="20" fill="#A39782"></rect>
        <rect x="-16" y="20" width="32" height="6" rx="3" fill="#A39782"></rect>
        <text y="48" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>this cup</text>
      </g></g>
      <g transform="translate(450,112)"><g class="a-bubble2"><rect x="-104" y="-17" width="208" height="34" rx="12" fill="#FFFFFF" stroke="#AE4C17" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#7E3A10" ${P}>“Not My will, but Yours”</text></g></g>
      <g transform="translate(320,304)"><g class="a-obey"><rect x="-96" y="-15" width="192" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>as man, freely obeys</text></g></g>
      <g transform="translate(300,336)"><g class="a-before"><rect x="-136" y="-15" width="272" height="30" rx="15" fill="#FFFFFF" stroke="#E8A33C" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>together before the world existed</text></g></g>
      <g transform="translate(300,414)"><g class="a-world">
        <circle r="28" fill="#EFE9DD" stroke="#A39782" stroke-width="2"></circle>
        <path d="M-26,-6 Q-10,-14 0,-6 Q12,4 26,-4" fill="none" stroke="#A39782" stroke-width="2"></path>
        <path d="M-24,12 Q-6,4 6,12 Q16,18 24,10" fill="none" stroke="#A39782" stroke-width="2"></path>
        <text x="40" y="5" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>the world</text>
      </g></g>
    </svg>`);
}

export default sonPraysToFather;
