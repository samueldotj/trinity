import { F, P, frame } from './frame';
import './t43.css';

// ---------- Teaching 43: Jesus Christ has two natures, divine and human, united in one Person ----------
// 30 seconds: one Son, the "who", above two natures, the "whats"; the natures pressed into a blend, struck
// out; the Son pulled apart into two people, struck out; what He did and suffered goes back to the one Son.

/** A white pill with coloured outline and text, drawn around 0,0. */
function pill43(w: number, text: string, stroke: string, ink: string): string {
  return `<rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="13" fill="#FFFFFF" stroke="${stroke}" stroke-width="1.5"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="${ink}" ${P}>${text}</text>`;
}

function twoNaturesOnePerson(): string {
  return frame(43, 30000, [
    { label: 'One who, two whats', at: 0, caption: 'In Jesus there is one “who,” the eternal Son, but two “whats.”' },
    { label: 'Not mixed', at: 0.22, caption: 'The natures are not mixed into a blend that is neither fully God nor man.' },
    { label: 'Not separated', at: 0.46, caption: 'Nor are they separated, as if Jesus were two people sharing one body.' },
    { label: 'One Son did it', at: 0.72, caption: 'Whatever Jesus did or suffered, it was the one Son of God who did it.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Son, one Person, shown as God and man, joined by lines to two natures below: the divine nature, fully God, and the human nature, a body and soul. He is the one who; the natures are the two whats. The two natures slide together into a mixed blend, which is struck out, and slide apart again. The Son is pulled into two people sharing one body, which is struck out. What He did and what He suffered rise to the one Son of God; the two natures stay united, not mixed and not separated.">
      <g class="a-links">
        <line x1="262" y1="124" x2="196" y2="234" stroke="#1B1E27" stroke-width="3"></line>
        <line x1="338" y1="124" x2="404" y2="234" stroke="#1B1E27" stroke-width="3"></line>
      </g>
      <g class="a-united">
        <line x1="250" y1="300" x2="350" y2="300" stroke="#1B1E27" stroke-width="3"></line>
        <g transform="translate(300,300)"><g class="a-unitedpill">${pill43(72, 'united', '#1B1E27', '#1B1E27')}</g></g>
      </g>
      <g transform="translate(160,300)"><g class="a-divine">
        <rect x="-90" y="-65" width="180" height="130" rx="16" fill="#12172B"></rect>
        <text y="-38" text-anchor="middle" font-size="14" font-weight="600" fill="#FFFFFF" ${P}>divine nature</text>
        <text y="12" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" ${F}>God</text>
        <text y="40" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" ${P}>fully God</text>
      </g></g>
      <g transform="translate(440,300)"><g class="a-human">
        <rect x="-90" y="-65" width="180" height="130" rx="16" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text y="-38" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>human nature</text>
        <g transform="translate(0,40)"><circle cy="-50" r="10" fill="#5A4F3C"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#5A4F3C"></path></g>
        <text y="57" text-anchor="middle" font-size="12" font-weight="600" fill="#5A4F3C" ${P}>body and soul</text>
      </g></g>
      <g class="a-whats">
        <g transform="translate(160,392)">${pill43(84, 'a “what”', '#6B7080', '#3A4058')}</g>
        <g transform="translate(440,392)">${pill43(84, 'a “what”', '#6B7080', '#3A4058')}</g>
      </g>
      <g transform="translate(436,60)"><g class="a-who">${pill43(110, 'the one “who”', '#33449A', '#33449A')}</g></g>
      <g transform="translate(300,300)"><g class="a-blend">
        <rect x="-90" y="-65" width="180" height="130" rx="16" fill="#8C735A"></rect>
        <text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>neither?</text>
      </g></g>
      <g transform="translate(300,392)"><g class="a-blendtag">${pill43(130, 'a mixed blend?', '#6B7080', '#3A4058')}</g></g>
      <line class="a-blendstrike" x1="200" y1="410" x2="400" y2="226" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(300,82)"><g class="a-ghost" style="--dx: -140px">
        <circle r="40" fill="rgba(255,255,255,0.9)" stroke="#AE4C17" stroke-width="2.5" stroke-dasharray="8 6"></circle>
        <text y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#7E3A10" ${F}>who 1?</text>
      </g></g>
      <g transform="translate(300,82)"><g class="a-ghost" style="--dx: 140px">
        <circle r="40" fill="rgba(255,255,255,0.9)" stroke="#AE4C17" stroke-width="2.5" stroke-dasharray="8 6"></circle>
        <text y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#7E3A10" ${F}>who 2?</text>
      </g></g>
      <g transform="translate(300,190)"><g class="a-twotag">${pill43(196, 'two people in one body?', '#6B7080', '#3A4058')}</g></g>
      <line class="a-twostrike" x1="194" y1="206" x2="406" y2="174" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(229,180)"><g class="a-did" style="--dx: 46px; --dy: -74px">${pill43(56, 'did', '#33449A', '#33449A')}</g></g>
      <g transform="translate(371,180)"><g class="a-did" style="--dx: -46px; --dy: -74px; animation-delay: 0.6s">${pill43(86, 'suffered', '#33449A', '#33449A')}</g></g>
      <g transform="translate(300,200)"><g class="a-oneson">${pill43(150, 'the one Son of God', '#33449A', '#33449A')}</g></g>
      <g transform="translate(300,82)"><g class="a-son">
        <circle r="56" fill="#AE4C17"></circle>
        <path d="M0,-56 A56,56 0 0 1 0,56 Z" fill="#7E3A10"></path>
        <text y="-6" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
        <text y="13" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>one Person</text>
        <text y="31" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>God | man</text>
      </g></g>
    </svg>`);
}

export default twoNaturesOnePerson;
