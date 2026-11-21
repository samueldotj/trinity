import { F, P, frame } from './frame';
import './t42.css';

// ---------- Teaching 42: The Son remained fully God when He became man ----------
// 24 seconds: human nature is added to the Son, nothing swapped; "power given up?" and "knowledge given up?"
// are struck out; God and man pressed into one blend is struck out; even as a baby the Son is still God.

/** A white pill with coloured outline and text, drawn around 0,0. */
function pill42(w: number, text: string, stroke: string, ink: string): string {
  return `<rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="13" fill="#FFFFFF" stroke="${stroke}" stroke-width="1.5"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="${ink}" ${P}>${text}</text>`;
}

function sonRemainedFullyGod(): string {
  return frame(42, 24000, [
    { label: 'Added, not swapped', at: 0, caption: 'Becoming man was an adding, not a swapping: He took on a full human nature.' },
    { label: 'Nothing given up', at: 0.22, caption: 'His divine power and knowledge were not reduced, set aside or changed.' },
    { label: 'Not a blend', at: 0.46, caption: 'He was not a blend, partly God and partly man, but wholly God and truly man.' },
    { label: 'Even as a baby', at: 0.72, caption: 'Even as a baby in Mary’s arms, the one Son was still wholly God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: God above, joined to the Son by a line marked still God. A human nature slides in and the Son takes it on, so He is shown as God and man: an adding, not a swapping. The ideas that He gave up power or knowledge come out from Him and are struck out. A circle of God and a circle of man pressed into one blend, partly God and partly man, is struck out. The human figure becomes a baby held in Mary’s arms, and the Son is still God.">
      <line class="a-link" x1="300" y1="106" x2="300" y2="164" stroke="#1B1E27" stroke-width="3"></line>
      <g transform="translate(300,134)"><g class="a-stillgod">${pill42(84, 'still God', '#1B1E27', '#1B1E27')}</g></g>
      <g class="a-box">
        <rect x="190" y="340" width="220" height="106" rx="14" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <text x="300" y="364" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" ${P}>Human nature</text>
        <g transform="translate(300,440)"><g class="a-adult"><circle cy="-50" r="10" fill="#5A4F3C"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#5A4F3C"></path></g></g>
        <g transform="translate(300,420)"><g class="a-baby">
          <ellipse cx="6" cy="-14" rx="26" ry="11" fill="#FFFFFF" stroke="#A39782" stroke-width="2"></ellipse>
          <circle cx="-22" cy="-17" r="9" fill="#A39782"></circle>
          <path d="M-46,-16 Q0,22 46,-16" fill="none" stroke="#5A4F3C" stroke-width="5" stroke-linecap="round"></path>
        </g></g>
      </g>
      <line class="a-took" x1="300" y1="280" x2="300" y2="330" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-tooklab"><path d="M293,328 L300,340 L307,328 Z" fill="#33449A"></path><g transform="translate(300,306)">${pill42(72, 'took on', '#33449A', '#33449A')}</g></g>
      <g transform="translate(130,220)"><g class="a-giveup" style="--dx: 170px">${pill42(132, 'power given up?', '#6B7080', '#3A4058')}</g></g>
      <g transform="translate(470,220)"><g class="a-giveup" style="--dx: -170px">${pill42(160, 'knowledge given up?', '#6B7080', '#3A4058')}</g></g>
      <line class="a-upstrike" x1="58" y1="234" x2="202" y2="206" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <line class="a-upstrike" x1="384" y1="234" x2="556" y2="206" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g transform="translate(70,62)"><g class="a-godpart"><circle r="24" fill="#12172B"></circle><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" ${P}>God</text></g></g>
      <g transform="translate(190,62)"><g class="a-manpart"><circle r="24" fill="#EFE9DD" stroke="#A39782" stroke-width="2"></circle><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" ${P}>man</text></g></g>
      <g transform="translate(130,62)"><g class="a-blend"><circle r="32" fill="#8C735A"></circle><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" ${P}>blend?</text></g></g>
      <g transform="translate(130,124)"><g class="a-blendtag">${pill42(186, 'partly God, partly man?', '#6B7080', '#3A4058')}</g></g>
      <line class="a-blendstrike" x1="40" y1="144" x2="220" y2="22" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(470,124)"><g class="a-both">${pill42(170, 'wholly God, truly man', '#33449A', '#33449A')}</g></g>
      <g transform="translate(300,62)"><g class="a-god">
        <circle r="42" fill="#12172B"></circle>
        <text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>God</text>
      </g></g>
      <g transform="translate(300,220)"><g class="a-son">
        <circle r="56" fill="#AE4C17"></circle>
        <g class="a-split"><path d="M0,-56 A56,56 0 0 1 0,56 Z" fill="#7E3A10"></path><text y="24" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" ${P}>God | man</text></g>
        <g class="a-godnote"><text y="24" text-anchor="middle" font-size="13" font-weight="600" fill="#FFFFFF" ${P}>God</text></g>
        <text y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
      </g></g>
    </svg>`);
}

export default sonRemainedFullyGod;
