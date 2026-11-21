import { F, P, frame } from './frame';
import './t44.css';

// ---------- Teaching 44: The Son’s human nature is created, but His divine nature is eternal ----------
// 30 seconds: the Son on an endless line, with the Father and the Spirit; history drawn below and, at one
// moment, a created human nature begins; "the Son began here?" and "humanity eternal?" struck out; one Son.

/** A white pill with coloured outline and text, drawn around 0,0. */
function pill44(w: number, text: string, stroke: string, ink: string): string {
  return `<rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="13" fill="#FFFFFF" stroke="${stroke}" stroke-width="1.5"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="${ink}" ${P}>${text}</text>`;
}

function humanCreatedDivineEternal(): string {
  const ticks = [100, 150, 200, 250, 300, 350, 400, 450, 500].map((x) => `<line x1="${x}" y1="394" x2="${x}" y2="406" stroke="#8A90A6" stroke-width="2"></line>`).join('');
  return frame(44, 30000, [
    { label: 'Always God', at: 0, caption: 'As God, the Son has no beginning: always with the Father and the Spirit.' },
    { label: 'A real moment', at: 0.22, caption: 'In Mary’s womb, at a real moment, He took a created human body and soul.' },
    { label: 'Two errors ruled out', at: 0.46, caption: 'He did not begin at Bethlehem, and His humanity is not eternal or divine.' },
    { label: 'One Person', at: 0.72, caption: 'The two natures stay distinct, not mixed, yet both belong to the one Son.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Son, eternal God, sits on a line that runs out both ways with no beginning, with the Father and the Spirit beside Him. A line of history is drawn below, and at one moment, His conception in Mary’s womb, a created human nature begins and runs on from there; the Son takes it on in time and is shown as God and man. The idea that the Son began there is struck out, and so is a human nature stretching back for ever. The two natures stay distinct, and both belong to the one Person of the Son.">
      <line class="a-band" x1="300" y1="150" x2="44" y2="150" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="4"></line>
      <line class="a-band" x1="300" y1="150" x2="556" y2="150" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="4"></line>
      <g class="a-bandends">
        <path d="M46,141 L30,150 L46,159 Z" fill="#33449A"></path><path d="M554,141 L570,150 L554,159 Z" fill="#33449A"></path>
        <text x="40" y="128" font-size="13" font-weight="600" fill="#33449A" ${P}>no beginning</text>
      </g>
      <g transform="translate(165,150)"><g class="a-fp"><circle r="30" fill="#2E5AAC"></circle><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" ${P}>Father</text></g></g>
      <g transform="translate(435,150)"><g class="a-fp"><circle r="30" fill="#157A6E"></circle><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" ${P}>Spirit</text></g></g>
      <line class="a-history" x1="50" y1="400" x2="542" y2="400" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3"></line>
      <g class="a-ticks">${ticks}<path d="M540,391 L558,400 L540,409 Z" fill="#6B7080"></path><text x="50" y="428" font-size="13" font-weight="600" fill="#4A5168" ${P}>history</text></g>
      <g transform="translate(360,0)"><g class="a-mark"><line x1="0" y1="318" x2="0" y2="410" stroke="#E8A33C" stroke-width="4" stroke-linecap="round"></line><circle cy="400" r="7" fill="#E8A33C"></circle></g></g>
      <g transform="translate(360,442)"><g class="a-marklab">${pill44(196, 'conceived in Mary’s womb', '#A39782', '#5A4F3C')}</g></g>
      <g class="a-ghostbar">
        <rect x="50" y="322" width="310" height="40" rx="8" fill="rgba(239,233,221,0.6)" stroke="#A39782" stroke-width="2" stroke-dasharray="8 6"></rect>
        <g transform="translate(205,342)">${pill44(150, 'humanity eternal?', '#6B7080', '#3A4058')}</g>
      </g>
      <line class="a-barstrike" x1="118" y1="374" x2="292" y2="310" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(360,322)"><g class="a-bar"><rect width="190" height="40" rx="8" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect></g></g>
      <g class="a-bartext"><text x="455" y="347" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>human nature (created)</text></g>
      <path class="a-took" d="M316,200 Q320,290 384,318" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="3"></path>
      <g class="a-tooklab"><path d="M372.6,319.7 L386,319 L377.4,308.7 Z" fill="#33449A"></path><g transform="translate(330,268)">${pill44(124, 'took on in time', '#33449A', '#33449A')}</g></g>
      <g class="a-post"><line x1="372" y1="110" x2="372" y2="192" stroke="#6B7080" stroke-width="3" stroke-dasharray="6 5"></line><path d="M372,110 L398,118 L372,126 Z" fill="#6B7080"></path></g>
      <g transform="translate(450,82)"><g class="a-posttag">${pill44(170, 'the Son began here?', '#6B7080', '#3A4058')}</g></g>
      <line class="a-poststrike" x1="358" y1="200" x2="540" y2="66" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(150,250)"><g class="a-distinct">${pill44(150, 'distinct, not mixed', '#33449A', '#33449A')}</g></g>
      <g transform="translate(300,74)"><g class="a-oneperson">${pill44(110, 'one Person', '#AE4C17', '#7E3A10')}</g></g>
      <g transform="translate(300,150)"><g class="a-son">
        <circle r="52" fill="#AE4C17"></circle>
        <g class="a-split"><path d="M0,-52 A52,52 0 0 1 0,52 Z" fill="#7E3A10"></path><text y="33" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>God | man</text></g>
        <text y="-4" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
        <text y="15" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>eternal God</text>
      </g></g>
    </svg>`);
}

export default humanCreatedDivineEternal;
