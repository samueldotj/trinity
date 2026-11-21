import { F, P, frame } from './frame';
import './t6.css';

// ---------- Teaching 6: God is Invisible ----------
// 24 seconds: an eye, even with a lens, finds nothing to see; a statue and a huge bright figure are struck
// out; fire, a cloud and a vision show Him; the Son, Himself God, comes and makes the unseen God known.

const pill6 = (cls: string, x: number, y: number, w: number, text: string, stroke = '#33449A', ink = '#33449A', fill = '#FFFFFF') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="${fill}" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

const body6 = (fill: string) =>
  `<circle cy="-50" r="10" fill="${fill}"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="${fill}"></path>`;

const label6 = (cls: string, x: number, y: number, text: string, ink = '#4A5168') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><text text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

function godIsInvisible(): string {
  return frame(6, 24000, [
    { label: 'No eye can see Him', at: 0, caption: 'God has no body and is not made of matter: no eye, however sharp, sees Him.' },
    { label: 'No image shows Him', at: 0.22, caption: 'No statue or image, and no huge, bright creature, can show what He truly is.' },
    { label: 'Shown through signs', at: 0.46, caption: 'When people “saw” God, He showed Himself through fire, a cloud or a vision.' },
    { label: 'Made known by the Son', at: 0.72, caption: 'No one has ever seen God, but the Son, Himself God, has made Him known.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: God drawn as an empty, outlined circle inside a dashed ring, because He cannot be seen. An eye looks, even through a lens, and finds no body and no matter to see. A statue and a huge, bright figure are struck out: neither shows what God is. Fire, a cloud and a vision appear, through which God showed Himself, not His very being. The Son comes, Himself God, and makes the unseen God known to people.">
      <circle class="a-ring" cx="300" cy="170" r="104" fill="none" stroke="#9AA0AD" stroke-width="2.5" stroke-dasharray="8 6"></circle>
      ${pill6('a-ringlabel', 300, 34, 150, 'cannot be seen')}
      <g transform="translate(92,170)"><g class="a-eye">
        <path d="M-36,0 Q0,-28 36,0 Q0,28 -36,0 Z" fill="#FFFFFF" stroke="#4A5168" stroke-width="2.5"></path>
        <circle r="12" fill="#4A5168"></circle><circle r="5" fill="#12172B"></circle>
      </g></g>
      <g transform="translate(92,170)"><g class="a-lens">
        <circle r="44" fill="rgba(227,233,247,0.35)" stroke="#33449A" stroke-width="4"></circle>
        <line x1="31" y1="31" x2="58" y2="58" stroke="#33449A" stroke-width="7" stroke-linecap="round"></line>
      </g></g>
      <line class="a-gaze" x1="140" y1="160" x2="194" y2="146" stroke="#4A5168" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 8"></line>
      <line class="a-gaze" x1="140" y1="170" x2="194" y2="170" stroke="#4A5168" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 8"></line>
      <line class="a-gaze" x1="140" y1="180" x2="194" y2="194" stroke="#4A5168" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 8"></line>
      ${pill6('a-nobody', 300, 318, 180, 'no body, no matter')}
      <g transform="translate(110,400)"><g class="a-statue">
        <rect x="-36" y="-24" width="72" height="24" rx="3" fill="#A39782"></rect>
        <g transform="translate(0,-24) scale(1.5)">${body6('#BDB29D')}</g>
      </g></g>
      ${pill6('a-tag', 110, 440, 164, 'a statue, an image?', '#6B7080', '#3A4058')}
      <line class="a-strike1" x1="52" y1="408" x2="168" y2="280" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(490,400)"><g class="a-giant">
        <circle cy="-82" r="68" fill="rgba(232,163,60,0.22)"></circle>
        <g transform="scale(2.1)">${body6('#E8A33C')}</g>
      </g></g>
      ${pill6('a-tag', 486, 440, 176, 'a huge, bright being?', '#6B7080', '#3A4058')}
      <line class="a-strike2" x1="428" y1="408" x2="552" y2="262" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-signline" x1="236" y1="254" x2="172" y2="330" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-signline" x1="300" y1="278" x2="300" y2="338" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-signline" x1="364" y1="254" x2="428" y2="330" stroke="#33449A" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <g transform="translate(150,390)"><g class="a-sign" style="animation-delay: 0s">
        <path d="M0,-46 C16,-26 28,-12 21,6 C16,20 -16,20 -21,6 C-28,-12 -8,-20 0,-46 Z" fill="#E8A33C"></path>
        <path d="M0,-18 C8,-8 12,0 8,8 C5,14 -5,14 -8,8 C-12,0 -4,-6 0,-18 Z" fill="#F6D28E"></path>
      </g></g>
      <g transform="translate(300,382)"><g class="a-sign" style="animation-delay: 0.3s">
        <circle cx="-26" cy="6" r="18" fill="#C9CDD8"></circle><circle cy="-8" r="24" fill="#C9CDD8"></circle><circle cx="26" cy="6" r="18" fill="#C9CDD8"></circle>
        <rect x="-44" y="4" width="88" height="20" rx="10" fill="#C9CDD8"></rect>
      </g></g>
      <g transform="translate(450,380)"><g class="a-sign" style="animation-delay: 0.6s">
        <rect x="-40" y="-30" width="80" height="60" rx="12" fill="#FFF6E3" stroke="#E8A33C" stroke-width="2.5"></rect>
        <path d="M0,-16 L4.5,-4.5 L16,-4 L7,4 L10,16 L0,9 L-10,16 L-7,4 L-16,-4 L-4.5,-4.5 Z" fill="#E8A33C"></path>
      </g></g>
      ${label6('a-signlabel', 150, 440, 'fire')}${label6('a-signlabel', 300, 440, 'a cloud')}${label6('a-signlabel', 450, 440, 'a vision')}
      ${pill6('a-notbeing', 482, 90, 170, 'not His very being')}
      <line class="a-link" x1="300" y1="276" x2="300" y2="324" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <g transform="translate(300,300)"><g class="a-himself"><rect x="-52" y="-12" width="104" height="24" rx="12" fill="#FFFFFF" stroke="#1B1E27"></rect><text y="4.5" text-anchor="middle" font-size="13" font-weight="600" fill="#1B1E27" ${P}>Himself God</text></g></g>
      <g transform="translate(300,370)"><g class="a-son">
        <circle r="46" fill="#AE4C17"></circle>
        <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>Son</text>
        <text y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>seen as man</text>
      </g></g>
      <line class="a-known" x1="352" y1="370" x2="462" y2="370" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-knownlabel"><path d="M460,362 L474,370 L460,378 Z" fill="#33449A"></path><text x="412" y="354" text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" ${P}>makes Him known</text></g>
      <g transform="translate(504,404)"><g class="a-people" style="animation-delay: 0s">${body6('#6B7080')}</g></g>
      <g transform="translate(548,404)"><g class="a-people" style="animation-delay: 0.3s">${body6('#6B7080')}</g></g>
      <g transform="translate(300,170)"><g class="a-god">
        <circle r="56" fill="#FFFFFF" stroke="#12172B" stroke-width="3"></circle>
        <text y="2" text-anchor="middle" font-size="26" font-weight="600" fill="#12172B" ${F}>God</text>
        <text y="21" text-anchor="middle" font-size="12" fill="#12172B" ${P}>unseen</text>
      </g></g>
    </svg>`);
}

export default godIsInvisible;
