import { F, P, frame } from './frame';
import './t45.css';

// ---------- Teaching 45: The Father did not suffer or die on the cross ----------
// 24 seconds: only the Son has a human body, the Father none; one Person wearing three masks is struck out;
// the Father sends the Son, one in the work of saving; the Son suffers as man, the Father does not suffer.

/** A white pill with coloured outline and text, drawn around 0,0. */
function pill45(w: number, text: string, stroke: string, ink: string): string {
  return `<rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="13" fill="#FFFFFF" stroke="${stroke}" stroke-width="1.5"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="${ink}" ${P}>${text}</text>`;
}

const BODY45 = 'M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z';

function fatherDidNotSuffer(): string {
  return frame(45, 24000, [
    { label: 'Only the Son had a body', at: 0, caption: 'Only the Son became man, so only He had a body that could suffer and die.' },
    { label: 'Not three masks', at: 0.22, caption: 'Father, Son and Spirit are not three masks of one Person who died.' },
    { label: 'Sent by the Father', at: 0.46, caption: 'The Father was not distant: He sent the Son, united with Him in saving us.' },
    { label: 'Suffered as man', at: 0.72, caption: 'The Son suffered and died in His human nature; God’s nature cannot die.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father and the Son, with a plain cross between them below. Under the Son a human body appears; under the Father there is none. A single figure changing masks, Father, Son and Spirit, as if one Person died, is struck out. The Father sends the Son, one with Him in the work of saving. An arrow marked suffered as man runs from the Son’s human body to the cross, and a dashed line marked did not suffer runs from the Father.">
      <g class="a-cross">
        <rect x="220" y="250" width="160" height="196" rx="14" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="300" y="274" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>The cross</text>
        <rect x="293" y="290" width="14" height="140" rx="2" fill="#7A5C3E"></rect>
        <rect x="256" y="318" width="88" height="14" rx="2" fill="#7A5C3E"></rect>
      </g>
      <g transform="translate(140,232)"><g class="a-nobody"><circle cy="-50" r="10" fill="none" stroke="#96ACD6" stroke-width="2" stroke-dasharray="4 4"></circle><path d="${BODY45}" fill="none" stroke="#96ACD6" stroke-width="2" stroke-dasharray="4 4"></path></g></g>
      <g transform="translate(140,256)"><g class="a-nobodytag">${pill45(120, 'no human body', '#96ACD6', '#22437F')}</g></g>
      <g transform="translate(460,256)"><g class="a-bodytag">${pill45(116, 'a human body', '#A39782', '#5A4F3C')}</g></g>
      <line class="a-bodylink" x1="460" y1="152" x2="460" y2="170" stroke="#A39782" stroke-width="3"></line>
      <g transform="translate(460,232)"><g class="a-body"><circle cy="-50" r="10" fill="#5A4F3C"></circle><path d="${BODY45}" fill="#5A4F3C"></path></g></g>
      <g transform="translate(110,350)"><g class="a-masks">
        <circle r="40" fill="rgba(255,255,255,0.9)" stroke="#6B7080" stroke-width="2.5" stroke-dasharray="8 6"></circle>
        <text class="a-mask1" y="6" text-anchor="middle" font-size="18" font-weight="600" fill="#22437F" ${F}>Father</text>
        <text class="a-mask2" y="6" text-anchor="middle" font-size="18" font-weight="600" fill="#7E3A10" ${F}>Son</text>
        <text class="a-mask3" y="6" text-anchor="middle" font-size="18" font-weight="600" fill="#0E5A51" ${F}>Spirit</text>
      </g></g>
      <g transform="translate(115,418)"><g class="a-maskstag">${pill45(180, 'one Person, three masks?', '#6B7080', '#3A4058')}</g></g>
      <line class="a-maskstrike" x1="40" y1="440" x2="190" y2="306" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-sends" x1="192" y1="100" x2="398" y2="100" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-sendslab"><path d="M396,93 L408,100 L396,107 Z" fill="#33449A"></path><g transform="translate(300,100)">${pill45(70, 'sends', '#33449A', '#33449A')}</g></g>
      <g transform="translate(300,150)"><g class="a-onework">${pill45(170, 'one work of saving us', '#33449A', '#33449A')}</g></g>
      <line class="a-notsuffer" x1="170" y1="142" x2="236" y2="252" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
      <g transform="translate(203,197)"><g class="a-notsufferlab">${pill45(116, 'did not suffer', '#6B7080', '#4A5168')}</g></g>
      <path class="a-suffered" d="M444,222 Q420,282 388,310" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="3"></path>
      <g class="a-sufferedlab"><path d="M399.4,307.9 L386.5,311.3 L391.5,298.9 Z" fill="#33449A"></path><g transform="translate(482,318)">${pill45(130, 'suffered as man', '#33449A', '#33449A')}</g></g>
      <g transform="translate(140,100)"><g class="a-father">
        <circle r="50" fill="#2E5AAC"></circle>
        <text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
      </g></g>
      <g transform="translate(460,100)"><g class="a-son">
        <circle r="50" fill="#AE4C17"></circle>
        <path d="M0,-50 A50,50 0 0 1 0,50 Z" fill="#7E3A10"></path>
        <text y="0" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
        <text y="21" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>God | man</text>
      </g></g>
    </svg>`);
}

export default fatherDidNotSuffer;
