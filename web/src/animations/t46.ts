import { F, P, frame } from './frame';
import './t46.css';

// ---------- Teaching 46: The incarnation did not change the divine nature ----------
// 40 seconds: human nature added while eternal, all-powerful and all-knowing stay; God turning into a man and
// deity set aside are struck out; the same Son before the world, in the manger, on the cross; the Trinity unchanged.

/** A white pill with coloured outline and text, drawn around 0,0. */
function pill46(w: number, text: string, stroke: string, ink: string): string {
  return `<rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="13" fill="#FFFFFF" stroke="${stroke}" stroke-width="1.5"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="${ink}" ${P}>${text}</text>`;
}

const BODY46 = 'M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z';

/** One moment in the Son's story: a label, and the Son below it, as fully God as ever. */
function station46(x: number, w: number, label: string, man: boolean, delay: number): string {
  return `<g transform="translate(${x},30)"><g class="a-station" style="animation-delay: ${delay}s">${pill46(w, label, '#33449A', '#33449A')}</g></g>
      <g transform="translate(${x},84)"><g class="a-mini" style="animation-delay: ${delay}s"><circle r="24" fill="#AE4C17"></circle>${man ? '<path d="M0,-24 A24,24 0 0 1 0,24 Z" fill="#7E3A10"></path>' : ''}<text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" ${P}>God</text></g></g>`;
}

function incarnationDidNotChangeGod(): string {
  return frame(46, 40000, [
    { label: 'Added, nothing lost', at: 0, caption: 'He added a human nature; His divine nature stayed exactly as it always was.' },
    { label: 'Not turned into man', at: 0.22, caption: 'God did not turn into a man, nor set aside His divinity for a time.' },
    { label: 'Always the same', at: 0.46, caption: 'As fully God in the manger and on the cross as before the world began.' },
    { label: 'Trinity unchanged', at: 0.72, caption: 'The Trinity did not change: still three Persons and one God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Son, eternal, all-powerful and all-knowing, takes on a human nature, added to Him, and all three stay as they were. A picture of God shrinking and turning into a man is struck out, and so is the idea that He set aside His divinity for a time. The Son is shown before the world began, in the manger and on the cross, as fully God each time: the same yesterday, today and forever. Then the Father, the Spirit and God appear with the Son: the Son, joined to God by a line marked unchanged, has added human nature, and there are still three Persons and one God.">
      <g class="a-box">
        <rect x="210" y="372" width="180" height="80" rx="14" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="324" y="417" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>Human nature</text>
        <g transform="translate(244,444) scale(0.8)"><circle cy="-50" r="10" fill="#5A4F3C"></circle><path d="${BODY46}" fill="#5A4F3C"></path></g>
      </g>
      <line class="a-addv" x1="300" y1="276" x2="300" y2="362" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-addvlab"><path d="M293,360 L300,372 L307,360 Z" fill="#33449A"></path><g transform="translate(300,320)">${pill46(64, 'added', '#33449A', '#33449A')}</g></g>
      <g transform="translate(300,138)"><g class="a-attr">${pill46(84, 'eternal', '#2849B8', '#1A3285')}</g></g>
      <g transform="translate(150,220)"><g class="a-attr">${pill46(110, 'all-powerful', '#2849B8', '#1A3285')}</g></g>
      <g transform="translate(450,220)"><g class="a-attr">${pill46(110, 'all-knowing', '#2849B8', '#1A3285')}</g></g>
      <g transform="translate(480,230)"><g class="a-morphgod"><circle r="40" fill="rgba(255,255,255,0.9)" stroke="#AE4C17" stroke-width="2.5" stroke-dasharray="8 6"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#7E3A10" ${F}>God</text></g></g>
      <g transform="translate(480,344)"><g class="a-morphman"><circle cy="-50" r="10" fill="none" stroke="#6B7080" stroke-width="2" stroke-dasharray="4 4"></circle><path d="${BODY46}" fill="none" stroke="#6B7080" stroke-width="2" stroke-dasharray="4 4"></path></g></g>
      <g transform="translate(484,384)"><g class="a-morphtag">${pill46(176, 'God turned into a man?', '#6B7080', '#3A4058')}</g></g>
      <line class="a-morphstrike" x1="404" y1="404" x2="560" y2="196" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(130,330)"><g class="a-asidetag">${pill46(196, 'deity set aside a while?', '#6B7080', '#3A4058')}</g></g>
      <line class="a-asidestrike" x1="36" y1="346" x2="224" y2="314" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      ${station46(120, 140, 'before the world', false, 0)}
      ${station46(300, 120, 'in the manger', true, 0.6)}
      ${station46(480, 110, 'on the cross', true, 1.2)}
      <g transform="translate(300,136)"><g class="a-hebrews">${pill46(272, 'the same yesterday, today and forever', '#33449A', '#33449A')}</g></g>
      <line class="a-unch" x1="261" y1="193" x2="175" y2="257" stroke="#1B1E27" stroke-width="3"></line>
      <g transform="translate(218,225)"><g class="a-unchlab">${pill46(96, 'unchanged', '#1B1E27', '#1B1E27')}</g></g>
      <line class="a-addd" x1="169" y1="330" x2="203" y2="365" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-adddlab"><path d="M197.3,367.6 L210,372 L205.9,359.2 Z" fill="#33449A"></path><g transform="translate(120,372)">${pill46(64, 'added', '#33449A', '#33449A')}</g></g>
      <g transform="translate(480,372)"><g class="a-trio">${pill46(176, 'three Persons · one God', '#33449A', '#33449A')}</g></g>
      <g transform="translate(300,52)"><g class="a-tri"><circle r="40" fill="#E6EBF5" stroke="#96ACD6" stroke-width="2"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#22437F" ${F}>Father</text></g></g>
      <g transform="translate(470,290)"><g class="a-tri"><circle r="40" fill="#E3EFEE" stroke="#8ABCB6" stroke-width="2"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#0E5A51" ${F}>Spirit</text></g></g>
      <g transform="translate(300,165)"><g class="a-god"><circle r="44" fill="#12172B"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>God</text></g></g>
      <g transform="translate(130,290)"><g class="a-son">
        <circle r="52" fill="#AE4C17"></circle>
        <g class="a-split"><path d="M0,-52 A52,52 0 0 1 0,52 Z" fill="#7E3A10"></path><text y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>God | man</text></g>
        <g class="a-godnote"><text y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>God</text></g>
        <text y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
      </g></g>
    </svg>`);
}

export default incarnationDidNotChangeGod;
