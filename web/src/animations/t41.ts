import { F, P, frame } from './frame';
import './t41.css';

// ---------- Teaching 41: Only the Son became incarnate ----------
// 30 seconds: the Father sends, the Spirit forms a body, the Son comes; only the Son is joined to human
// nature; "the Father born in Bethlehem?" is struck out; the Persons stand distinct, not three masks.

/** A white pill with coloured outline and text, drawn around 0,0. */
function pill41(w: number, text: string, stroke: string, ink: string): string {
  return `<rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="13" fill="#FFFFFF" stroke="${stroke}" stroke-width="1.5"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="${ink}" ${P}>${text}</text>`;
}

/** A Person who did not become man: full colour at first, then the pale tint with "not incarnate". */
function person41(x: number, name: string, full: string, bg: string, border: string, ink: string): string {
  return `<g transform="translate(${x},110)"><g class="a-person">
        <circle r="46" fill="${bg}" stroke="${border}" stroke-width="2"></circle>
        <text y="0" text-anchor="middle" font-size="22" font-weight="600" fill="${ink}" ${F}>${name}</text>
        <g class="a-note"><text y="20" text-anchor="middle" font-size="12" font-weight="600" fill="${ink}" ${P}>not incarnate</text></g>
        <g class="a-full"><circle r="46" fill="${full}"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>${name}</text></g>
      </g></g>`;
}

function onlyTheSonBecameIncarnate(): string {
  return frame(41, 30000, [
    { label: 'All three at work', at: 0, caption: 'The Father sent the Son; the Spirit formed His body; the Son came.' },
    { label: 'Only the Son joined', at: 0.22, caption: 'Of the three Persons, only the Son took a human body and soul.' },
    { label: 'Not the Father', at: 0.46, caption: 'It is wrong to say the Father was born in Bethlehem or died on the cross.' },
    { label: 'Truly distinct', at: 0.72, caption: 'Only the Son was joined to a human nature: the Persons are truly distinct.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Father, the Son and the Spirit side by side. The Father sends the Son, who comes down; the Spirit forms a human body. Only the Son is joined to the human nature and becomes flesh, shown as God and man; the Father and the Spirit are not incarnate. A ghost of the Father going down to be born in Bethlehem and die on the cross is struck out. Lines marked is not stand between the Persons: three distinct Persons, not three masks.">
      <g class="a-isnot">
        <line x1="165" y1="132" x2="252" y2="176" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
        <line x1="435" y1="132" x2="348" y2="176" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
        <g transform="translate(208,154)">${pill41(64, 'is not', '#6B7080', '#4A5168')}</g>
        <g transform="translate(392,154)">${pill41(64, 'is not', '#6B7080', '#4A5168')}</g>
      </g>
      <g transform="translate(300,14)"><g class="a-masks">${pill41(250, 'three Persons, not three masks', '#33449A', '#33449A')}</g></g>
      <g transform="translate(0,0)"><g class="a-box">
        <rect x="200" y="330" width="200" height="112" rx="14" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="300" y="354" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>Human nature</text>
      </g></g>
      <g transform="translate(300,436)"><g class="a-body"><circle cy="-50" r="10" fill="#5A4F3C"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#5A4F3C"></path></g></g>
      <path class="a-flow" d="M446,152 Q440,290 404,372" fill="none" stroke="#157A6E" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></path>
      <g transform="translate(508,276)"><g class="a-flowlab">${pill41(116, 'forms His body', '#157A6E', '#0E5A51')}</g></g>
      <path class="a-sends" d="M162,134 Q200,196 240,200" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="3"></path>
      <g class="a-sendslab"><path d="M238,193 L250,200 L238,207 Z" fill="#33449A"></path><g transform="translate(150,200)">${pill41(70, 'sends', '#33449A', '#33449A')}</g></g>
      <g transform="translate(120,110)"><g class="a-ghost">
        <circle r="44" fill="rgba(255,255,255,0.9)" stroke="#2E5AAC" stroke-width="2.5" stroke-dasharray="8 6"></circle>
        <text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#22437F" ${F}>Father?</text>
      </g></g>
      <g class="a-ghosttag">
        <g transform="translate(120,382)">${pill41(150, 'born in Bethlehem?', '#6B7080', '#3A4058')}</g>
        <g transform="translate(120,418)">${pill41(150, 'died on the cross?', '#6B7080', '#3A4058')}</g>
      </g>
      <line class="a-ghoststrike" x1="46" y1="440" x2="190" y2="262" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      ${person41(120, 'Father', '#2E5AAC', '#E6EBF5', '#96ACD6', '#22437F')}
      ${person41(480, 'Spirit', '#157A6E', '#E3EFEE', '#8ABCB6', '#0E5A51')}
      <line class="a-flesh" x1="300" y1="254" x2="300" y2="322" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-fleshlab"><path d="M293,318 L300,330 L307,318 Z" fill="#33449A"></path><g transform="translate(300,288)">${pill41(112, 'became flesh', '#33449A', '#33449A')}</g></g>
      <g transform="translate(300,200)"><g class="a-son">
        <circle r="50" fill="#AE4C17"></circle>
        <g class="a-split"><path d="M0,-50 A50,50 0 0 1 0,50 Z" fill="#7E3A10"></path><text y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>God | man</text></g>
        <text y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
      </g></g>
    </svg>`);
}

export default onlyTheSonBecameIncarnate;
