import { F, P, frame } from './frame';
import './t16.css';

// ---------- Teaching 16: The Holy Spirit is not the Father ----------
// 40 seconds: the Son asks, the Father gives the Spirit to the disciples; giver and given; a "Spirit?"
// name tag stuck on the Father is struck off; from no one and proceeds, level on "equally God".

const pill = (cls: string, x: number, y: number, w: number, text: string, stroke: string, ink: string, fill = '#FFFFFF') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="${fill}" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

const figure = (x: number) =>
  `<g transform="translate(${x},462)"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g>`;

const disc = (fill: string, name: string, ink = '#FFFFFF', stroke = '') =>
  `<circle r="50" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="2"` : ''}></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="${ink}" ${F}>${name}</text>
        <text y="21" text-anchor="middle" font-size="12" fill="${ink}" ${P}>Person</text>`;

function spiritNotFather(): string {
  return frame(16, 40000, [
    { label: 'Asks and gives', at: 0, caption: 'Jesus asks the Father, and the Father gives “another Advocate,” the Spirit.' },
    { label: 'Giver and given', at: 0.22, caption: 'The Father gives and sends; the Spirit is given and sent: not one Person.' },
    { label: 'Not another name', at: 0.46, caption: 'The Spirit is not the Father under another name, or acting another way.' },
    { label: 'Relation, not rank', at: 0.72, caption: 'Father from no one, Spirit proceeding: a difference of relation, not of rank.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: the Son asks the Father, and the Father gives the Spirit, who comes down from Him to the disciples: another Advocate. The Father gives and sends; the Spirit is given and sent; the same Person is struck out. A name tag reading Spirit is stuck on the Father and struck off: not the Father under another name. The Father and the Spirit stand level, joined by is not: the Father from no one, the Spirit proceeding from the Father and the Son, both fully and equally God.">
      <g class="a-people">${figure(240)}${figure(300)}${figure(360)}</g>
      <line class="a-asks" x1="374" y1="90" x2="241" y2="90" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <path class="a-askshead" d="M241,82 L227,90 L241,98 Z" fill="#33449A"></path>
      ${pill('a-askslabel', 300, 90, 64, 'asks', '#33449A', '#33449A')}
      <line class="a-sendline" x1="199.5" y1="137.6" x2="270.5" y2="252.4" stroke="#2E5AAC" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      ${pill('a-gives', 186, 215, 72, 'gives', '#2E5AAC', '#22437F')}
      ${pill('a-advocate', 300, 372, 168, 'another Advocate', '#157A6E', '#0E5A51')}
      ${pill('a-giver', 170, 12, 156, 'gives and sends', '#2E5AAC', '#22437F')}
      ${pill('a-given', 300, 372, 152, 'given and sent', '#157A6E', '#0E5A51')}
      ${pill('a-same', 456, 214, 160, 'the same Person?', '#B3261E', '#9B1C1C', '#FBEAEA')}
      <line class="a-samestrike" x1="384" y1="214" x2="528" y2="214" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <line class="a-edge" x1="206" y1="250" x2="394" y2="250" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
      ${pill('a-isnot', 300, 250, 70, 'is not', '#6B7080', '#4A5168')}
      ${pill('a-note', 150, 338, 118, 'from no one', '#2E5AAC', '#22437F')}
      ${pill('a-note', 450, 338, 236, 'proceeds from Father and Son', '#157A6E', '#0E5A51')}
      <g class="a-level">
        <rect x="70" y="384" width="460" height="38" rx="19" fill="#E3E9F7" stroke="#2849B8" stroke-width="1.5"></rect>
        <text x="300" y="408" text-anchor="middle" font-size="15" font-weight="600" fill="#1A3285" ${P}>fully and equally God</text>
      </g>
      <g transform="translate(450,250)"><g class="a-spirit">${disc('#157A6E', 'Spirit')}</g></g>
      <g transform="translate(300,80)"><g class="a-son">
        ${disc('#AE4C17', 'Son')}
        <g class="a-sondim">${disc('#F5EAE3', 'Son', '#7E3A10', '#D6A68B')}</g>
      </g></g>
      <g transform="translate(150,250)"><g class="a-father">${disc('#2E5AAC', 'Father')}</g></g>
      ${pill('a-another', 170, 182, 150, 'another name?', '#6B7080', '#3A4058')}
      <g transform="translate(170,92)"><g class="a-tag">
        <rect x="-50" y="-18" width="100" height="36" rx="6" fill="#FFFFFF" stroke="#157A6E" stroke-width="2"></rect>
        <text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#0E5A51" ${F}>Spirit?</text>
      </g></g>
      <line class="a-tagstrike" x1="114" y1="114" x2="226" y2="70" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
    </svg>`);
}

export default spiritNotFather;
