import { frame, F, P } from './frame';
import './t31.css';

// ---------- Teaching 31: The Father sends the Son ----------
// 24 seconds: the eternal Son is already with the Father; He is sent down into the world and born of a
// woman; an unwilling servant struck out, one will; an angry Father won over struck out, love sends Him.

function fatherSendsSon(): string {
  return frame(31, 24000, [
    { label: 'Already the Son', at: 0, caption: 'The Son did not begin to exist when sent: He was already the eternal Son.' },
    { label: 'Born of a woman', at: 0.22, caption: 'When the time had fully come, God sent His Son, born of a woman.' },
    { label: 'Sent, yet free', at: 0.46, caption: 'Being sent makes Him neither lower nor unwilling: They share one will.' },
    { label: 'To save the world', at: 0.72, caption: 'No angry Father won over: His own love sent the Son to save the world.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father and the eternal Son above, and the world below. The idea that the Son began when He was sent is struck out. The Father sends the Son, who comes down into the world and takes on human nature, born of a woman. The idea of an unwilling servant is struck out: Father and Son share one will, and the Son comes freely. The idea of an angry Father won over is struck out; love flows from the Father through the sending to save the world.">
      <g class="a-world">
        <rect x="60" y="322" width="480" height="134" rx="16" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="78" y="346" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>The world</text>
      </g>
      <rect class="a-worldglow" x="56" y="318" width="488" height="142" rx="19" fill="none" stroke="#E8A33C" stroke-width="4"></rect>
      <line class="a-sends" x1="212" y1="121" x2="375" y2="332" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="a-sendshead" d="M382,341 L380.2,327.2 L369.2,335.8 Z" fill="#33449A"></path>
      <line class="a-love" x1="212" y1="121" x2="375" y2="332" stroke="#E8A33C" stroke-width="5" stroke-linecap="round" stroke-dasharray="3 10"></line>
      <line class="a-trail" x1="420" y1="128" x2="420" y2="324" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="a-trailhead" d="M411,322 L420,336 L429,322 Z" fill="#33449A"></path>
      <g transform="translate(297,231)"><g class="a-edgepill"><rect x="-35" y="-15" width="70" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>sends</text></g></g>
      <g transform="translate(420,231)"><g class="a-edgepill"><rect x="-36" y="-15" width="72" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>comes</text></g></g>
      <g transform="translate(180,80)"><g class="a-father">
        <circle r="44" fill="#2E5AAC"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
      </g></g>
      <g transform="translate(420,390)"><g class="a-human"><circle r="52" fill="none" stroke="#A39782" stroke-width="6"></circle></g></g>
      <g transform="translate(420,390)"><g class="a-sonmove"><g class="a-son">
        <circle r="42" fill="#AE4C17"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
      </g></g></g>
      <g transform="translate(420,150)"><g class="a-eternal"><rect x="-58" y="-15" width="116" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>eternal Son</text></g></g>
      <g transform="translate(420,214)"><g class="a-begins"><rect x="-104" y="-15" width="208" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>begins when sent?</text></g></g>
      <line class="a-beginstrike" x1="310" y1="228" x2="530" y2="200" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(230,368)"><g class="a-born"><rect x="-76" y="-15" width="152" height="30" rx="15" fill="#FFFFFF" stroke="#A39782"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>born of a woman</text></g></g>
      <g transform="translate(130,220)"><g class="a-servant"><rect x="-84" y="-15" width="168" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>unwilling servant?</text></g></g>
      <line class="a-servantstrike" x1="40" y1="234" x2="220" y2="206" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(130,220)"><g class="a-freely"><rect x="-80" y="-15" width="160" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>one will, freely</text></g></g>
      <g transform="translate(130,220)"><g class="a-angry"><rect x="-98" y="-15" width="196" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>angry Father won over?</text></g></g>
      <line class="a-angrystrike" x1="26" y1="234" x2="234" y2="206" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(130,220)"><g class="a-lovepill"><rect x="-90" y="-15" width="180" height="30" rx="15" fill="#FFFFFF" stroke="#E8A33C" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>love from the Father</text></g></g>
      <g transform="translate(230,418)"><g class="a-save"><rect x="-80" y="-15" width="160" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>to save the world</text></g></g>
    </svg>`);
}

export default fatherSendsSon;
