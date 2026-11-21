import { F, P, frame } from './frame';
import './t12.css';

// ---------- Teaching 12: The Holy Spirit is God ----------
// 40 seconds: heat flowing from a fire, as a picture of the Spirit, is struck out; the Spirit knows, acts and
// can be lied to; believers become a temple where the Spirit dwells; lying to the Spirit is lying to God.

const pill12 = (cls: string, x: number, y: number, w: number, text: string, stroke = '#33449A', ink = '#33449A', fill = '#FFFFFF') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="${fill}" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

const body12 = (fill: string) =>
  `<circle cy="-50" r="10" fill="${fill}"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="${fill}"></path>`;

const circle12 = (cls: string, x: number, y: number, r: number, fill: string, border: string, ink: string, name: string) =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><circle r="${r}" fill="${fill}" stroke="${border}" stroke-width="2"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="${ink}" ${F}>${name}</text></g></g>`;

const wave12 = (y: number) =>
  `<path class="a-wave" d="M210,${y} q18,-12 36,0 t36,0 t36,0 t36,0 t36,0 t36,0" fill="none" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 8"></path>`;

function theSpiritIsGod(): string {
  return frame(12, 40000, [
    { label: 'Not a force', at: 0, caption: 'Not an impersonal power God sends out, the way heat comes from a fire.' },
    { label: 'A Person', at: 0.22, caption: 'He is a Person: He knows, He acts, and He can be lied to, as no force can.' },
    { label: 'God’s temple', at: 0.46, caption: 'Believers are “God’s temple,” because “God’s Spirit dwells in you.”' },
    { label: 'Lied to God', at: 0.72, caption: 'Lying “to the Holy Spirit” is lying “to God”: the Spirit is fully God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: heat flowing out from a fire, as a picture of the Spirit as an impersonal force, is struck out. The Holy Spirit appears as a Person who knows, acts and can be lied to. People stand together as a temple, and the Spirit comes to dwell among them: you are God’s temple. Ananias lies to the Holy Spirit, and that is lying to God. The picture ends with the Spirit lit and joined to the one God by is God.">
      <g transform="translate(150,250)"><g class="a-fire">
        <path d="M0,-80 C26,-46 44,-24 34,4 C26,26 -26,26 -34,4 C-44,-24 -12,-36 0,-80 Z" fill="#E8A33C"></path>
        <path d="M0,-34 C12,-18 18,-4 12,8 C8,16 -8,16 -12,8 C-18,-4 -6,-12 0,-34 Z" fill="#F6D28E"></path>
        <rect x="-42" y="18" width="84" height="12" rx="6" fill="#7A5C3E"></rect>
      </g></g>
      ${wave12(210)}${wave12(240)}${wave12(270)}
      ${pill12('a-forcetag', 320, 330, 250, 'a force, like heat from fire?', '#B3261E', '#9B1C1C', '#FBEAEA')}
      <line class="a-forcestrike" x1="196" y1="300" x2="444" y2="186" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <line class="a-actline" x1="300" y1="164" x2="300" y2="115" stroke="#157A6E" stroke-width="2.5"></line>
      <line class="a-actline" x1="254" y1="252" x2="176" y2="290" stroke="#157A6E" stroke-width="2.5"></line>
      <line class="a-actline" x1="346" y1="252" x2="420" y2="290" stroke="#157A6E" stroke-width="2.5"></line>
      ${pill12('a-act1', 300, 100, 104, 'He knows', '#157A6E', '#0E5A51')}
      ${pill12('a-act2', 140, 300, 96, 'He acts', '#157A6E', '#0E5A51')}
      ${pill12('a-act3', 460, 300, 168, 'He can be lied to', '#157A6E', '#0E5A51')}
      ${pill12('a-person', 300, 400, 196, 'a Person, not a force')}
      <g class="a-temple">
        <path d="M100,150 L300,56 L500,150 Z" fill="#F4F1EA" stroke="#A39782" stroke-width="2" stroke-linejoin="round"></path>
        <rect x="110" y="150" width="380" height="16" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
        <rect x="100" y="404" width="400" height="18" rx="3" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect>
      </g>
      <g transform="translate(140,404)"><g class="a-pillar" style="animation-delay: 0s"><g transform="scale(2.4)">${body12('#6B7080')}</g></g></g>
      <g transform="translate(200,404)"><g class="a-pillar" style="animation-delay: 0.2s"><g transform="scale(2.4)">${body12('#6B7080')}</g></g></g>
      <g transform="translate(400,404)"><g class="a-pillar" style="animation-delay: 0.4s"><g transform="scale(2.4)">${body12('#6B7080')}</g></g></g>
      <g transform="translate(460,404)"><g class="a-pillar" style="animation-delay: 0.6s"><g transform="scale(2.4)">${body12('#6B7080')}</g></g></g>
      ${pill12('a-templelabel', 300, 112, 196, 'you are God’s temple', '#A39782', '#5A4F3C')}
      ${pill12('a-dwells', 300, 448, 236, 'God’s Spirit dwells in you')}
      <g transform="translate(300,220)"><g class="a-token">
        <circle r="64" fill="rgba(21,122,110,0.16)"></circle>
        <circle r="56" fill="#157A6E"></circle>
        <text y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>a Person</text>
      </g></g>
      <g class="a-faint">
        <line x1="300" y1="70" x2="130" y2="380" stroke="#C9C5BB" stroke-width="2"></line>
        <line x1="300" y1="70" x2="470" y2="380" stroke="#C9C5BB" stroke-width="2"></line>
        <line x1="130" y1="380" x2="470" y2="380" stroke="#C9C5BB" stroke-width="2"></line>
      </g>
      <line class="a-spoke" x1="300" y1="240" x2="470" y2="380" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <path class="a-lie1" d="M150,262 Q260,400 406,388" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#6B7080" stroke-width="3" stroke-linecap="round"></path>
      <path class="a-lie1head" d="M404,379 L419,388 L404,397 Z" fill="#6B7080"></path>
      <line class="a-lie2" x1="160" y1="226" x2="236" y2="236" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3" stroke-linecap="round"></line>
      <path class="a-lie2head" d="M233,228 L249,238 L232,245 Z" fill="#6B7080"></path>
      ${circle12('a-fdim', 300, 70, 52, '#E6EBF5', '#96ACD6', '#22437F', 'Father')}
      ${circle12('a-sdim', 130, 380, 48, '#F5EAE3', '#D6A68B', '#7E3A10', 'Son')}
      <g transform="translate(470,380)"><g class="a-plit">
        <circle r="54" fill="rgba(51,68,154,0.16)"></circle>
        <circle r="48" fill="#157A6E"></circle>
        <text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text>
      </g></g>
      <g transform="translate(300,240)"><g class="a-god">
        <circle r="54" fill="rgba(51,68,154,0.16)"></circle>
        <circle r="48" fill="#12172B"></circle>
        <text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>God</text>
      </g></g>
      <g transform="translate(385,310)"><g class="a-isgod"><rect x="-36" y="-12" width="72" height="24" rx="12" fill="#FFFFFF" stroke="#1B1E27"></rect><text y="4.5" text-anchor="middle" font-size="13" font-weight="600" fill="#1B1E27" ${P}>is God</text></g></g>
      <g class="a-ananias">
        <g transform="translate(110,250) scale(1.2)">${body12('#6B7080')}</g>
        <text x="110" y="274" text-anchor="middle" font-size="13" font-weight="600" fill="#4A5168" ${P}>Ananias</text>
      </g>
      ${pill12('a-lie1label', 280, 358, 196, 'lied to the Holy Spirit', '#6B7080', '#3A4058')}
      ${pill12('a-lie2label', 196, 198, 80, 'to God', '#6B7080', '#3A4058')}
    </svg>`);
}

export default theSpiritIsGod;
