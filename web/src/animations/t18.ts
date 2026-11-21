import { F, P, frame } from './frame';
import './t18.css';

// ---------- Teaching 18: The three Persons are coeternal ----------
// 40 seconds: the Father first and the others later, on lines of time, struck out; three lines running back
// forever; the world's making, with the Word who "was" and the eternal Spirit; "always", side by side.

const LANES: [number, string, string, string][] = [[60, '#2E5AAC', 'Father', '#22437F'], [190, '#AE4C17', 'Son', '#7E3A10'], [320, '#157A6E', 'Spirit', '#0E5A51']];

const pill = (cls: string, x: number, y: number, w: number, text: string, stroke: string, ink: string) =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="#FFFFFF" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

// The true line of each Person: drawn back from the Person to x 110, then dotted on, arrowed, off the page.
const lane = ([y, c]: [number, string, string, string]) =>
  `<line class="a-lane" x1="452" y1="${y}" x2="110" y2="${y}" pathLength="1" stroke-dasharray="1 1" stroke="${c}" stroke-width="5" stroke-linecap="round"></line>
      <g class="a-forever"><line x1="102" y1="${y}" x2="46" y2="${y}" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 11"></line><path d="M40,${y - 9} L24,${y} L40,${y + 9} Z" fill="${c}"></path></g>
      <g transform="translate(452,${y})"><g class="a-spark"><circle r="7" fill="#E8A33C"></circle></g></g>`;

// The wrong picture: a Person's line beginning at `x0`, the start marked with a dot.
const wrong = (n: number, x0: number, [y, c]: [number, string, string, string]) =>
  `<line class="a-wrong${n}" x1="${x0}" y1="${y}" x2="452" y2="${y}" pathLength="1" stroke-dasharray="1 1" stroke="${c}" stroke-opacity="0.55" stroke-width="10" stroke-linecap="round"></line>
      <g transform="translate(${x0},${y})"><g class="a-dot${n}"><circle r="9" fill="#FFFFFF" stroke="${c}" stroke-width="3"></circle></g></g>`;

const person = ([y, c, name]: [number, string, string, string]) =>
  `<g transform="translate(500,${y})"><g class="a-person">
        <circle r="42" fill="${c}"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>${name}</text>
        <text class="a-sub1" y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>Person</text>
        <text class="a-sub2" y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>eternal</text>
      </g></g>`;

function coeternal(): string {
  const [f, s, p] = LANES;
  return frame(18, 40000, [
    { label: 'Not the Father first', at: 0, caption: 'The Father did not exist alone, then bring the Son and the Spirit into being.' },
    { label: 'No beginning', at: 0.22, caption: 'Father, Son and Holy Spirit have each existed forever, with no beginning.' },
    { label: 'Before the world', at: 0.46, caption: 'Before anything was made, the Word already “was”; the Spirit is “eternal.”' },
    { label: 'Always together', at: 0.72, caption: 'Always Father, so always with His Son; and the Spirit always with Them both.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: three lines of time, one for each Person. First the Father’s line begins alone and the Son’s and the Spirit’s begin later; that picture is struck out. Then each Person’s line runs back without a beginning, off the page. A dashed line marks the making of the world: before it, the Word already was, there is glory before the world existed, and the Spirit is the eternal Spirit. The Father, the Son and the Spirit are always together, each eternal.">
      ${wrong(1, 120, f)}${wrong(2, 260, s)}${wrong(3, 380, p)}
      ${pill('a-alone', 190, 118, 196, 'the Father alone first?', '#6B7080', '#3A4058')}
      <line class="a-wrongstrike" x1="96" y1="352" x2="452" y2="24" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <line class="a-made" x1="330" y1="16" x2="330" y2="372" stroke="#A39782" stroke-width="2.5" stroke-dasharray="7 6"></line>
      ${pill('a-madelabel', 330, 398, 150, 'the world made', '#A39782', '#5A4F3C')}
      ${lane(f)}${lane(s)}${lane(p)}
      ${pill('a-nobegin', 120, 125, 124, 'no beginning', '#33449A', '#33449A')}
      ${pill('a-q1', 200, 190, 196, '“In the beginning was”', s[1], s[3])}
      ${pill('a-q2', 200, 60, 212, '“before the world existed”', f[1], f[3])}
      ${pill('a-q3', 200, 320, 172, '“the eternal Spirit”', p[1], p[3])}
      <line class="a-tie" x1="500" y1="104" x2="500" y2="146" stroke="#6B7080" stroke-width="3"></line>
      <line class="a-tie" x1="500" y1="234" x2="500" y2="276" stroke="#6B7080" stroke-width="3"></line>
      ${person(f)}${person(s)}${person(p)}
      ${pill('a-always', 500, 125, 76, 'always', '#6B7080', '#4A5168')}
      ${pill('a-always', 500, 255, 76, 'always', '#6B7080', '#4A5168')}
    </svg>`);
}

export default coeternal;
