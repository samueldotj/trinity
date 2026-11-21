import { frame } from './frame';
import './t22.css';

// ---------- Teaching 22: The Father is eternally Father ----------
// 40 seconds: God moving along time, "becomes Father?" at creation and at Jesus’ birth struck out; Father and
// Son side by side from before the world; a mask, a job, a title struck out; always Father, always Son.

function fatherEternallyFather(): string {
  return frame(22, 40000, [
    { label: 'Not from some point', at: 0, caption: 'God did not become Father when He made the world, or when Jesus was born.' },
    { label: 'Never without the Son', at: 0.22, caption: 'Father and Son were together “before the world existed”: never one alone.' },
    { label: 'Not a mask or a role', at: 0.46, caption: 'Being Father is not a job, a title or a mask: it is who this Person is.' },
    { label: 'Always Father and Son', at: 0.72, caption: 'Since the Son has always been the Son, the Father has always been Father.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: A line of time begins at creation and runs past Jesus’ birth. God moves along it, and the question becomes Father? is struck out at creation and again at Jesus’ birth. The Father and the Son appear, an arrow running from the Father to the Son labelled always Father of, and two lines, one for each, run side by side through all of time and on into the age before the world existed. A mask, a job or a title laid on the Father is struck out and falls away. The Father is always Father, the Son always Son.">
      <g class="a-time">
      <line x1="280" y1="402" x2="532" y2="402" stroke="#6B7080" stroke-width="3" stroke-linecap="round"></line>
      <path d="M530,394 L546,402 L530,410 Z" fill="#6B7080"></path>
      <line x1="280" y1="392" x2="280" y2="412" stroke="#6B7080" stroke-width="3"></line><line x1="450" y1="394" x2="450" y2="410" stroke="#6B7080" stroke-width="2"></line>
      <text x="280" y="434" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">creation</text>
      <text x="450" y="434" text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">Jesus’ birth</text>
      <text x="236" y="434" text-anchor="end" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">before the world existed</text>
      </g>
      <g transform="translate(280,330)"><g class="a-goddot"><circle r="34" fill="#12172B"></circle><text y="7" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">God</text></g></g>
      <g transform="translate(280,262)"><g class="a-ask1"><rect x="-73.5" y="-15" width="147" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">becomes Father?</text></g></g>
      <line class="a-askstrike1" x1="210.5" y1="262" x2="349.5" y2="262" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g transform="translate(450,262)"><g class="a-ask2"><rect x="-73.5" y="-15" width="147" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">becomes Father?</text></g></g>
      <line class="a-askstrike2" x1="380.5" y1="262" x2="519.5" y2="262" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g class="a-bars">
      <line x1="40" y1="334" x2="116" y2="334" stroke="#2E5AAC" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 14"></line>
      <line x1="130" y1="334" x2="540" y2="334" stroke="#2E5AAC" stroke-width="8" stroke-linecap="round"></line>
      <line x1="40" y1="358" x2="116" y2="358" stroke="#AE4C17" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 14"></line>
      <line x1="130" y1="358" x2="540" y2="358" stroke="#AE4C17" stroke-width="8" stroke-linecap="round"></line>
      <text x="548" y="339" font-size="13" font-weight="600" fill="#2E5AAC" font-family="IBM Plex Sans, sans-serif">F</text><text x="548" y="363" font-size="13" font-weight="600" fill="#AE4C17" font-family="IBM Plex Sans, sans-serif">S</text>
      </g>
      <line class="a-arrow" x1="212" y1="150" x2="378" y2="150" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3" stroke-linecap="round"></line><g class="a-arrowhead"><path d="M388,150 L374,157.5 L374,142.5 Z" fill="#33449A"></path></g>
      <g transform="translate(300,112)"><g class="a-oflabel"><rect x="-77.5" y="-15" width="155" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">always Father of</text></g></g>
      <g transform="translate(150,150)"><g class="a-f"><circle r="56" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Father</text></g></g>
      <g transform="translate(450,150)"><g class="a-s"><circle r="56" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Son</text></g></g>
      <g transform="translate(150,140)"><g class="a-mask"><path d="M-46,-10 Q-46,-26 -24,-24 L24,-24 Q46,-26 46,-10 Q46,16 18,14 Q8,6 0,10 Q-8,6 -18,14 Q-46,16 -46,-10 Z" fill="#6B7080" stroke="#4A5168" stroke-width="2"></path><ellipse cx="-19" cy="-6" rx="10" ry="6" fill="#E3E3E6"></ellipse><ellipse cx="19" cy="-6" rx="10" ry="6" fill="#E3E3E6"></ellipse></g></g>
      <line class="a-maskstrike" x1="108" y1="176" x2="192" y2="104" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <g transform="translate(150,262)"><g class="a-masktag"><rect x="-104.5" y="-15" width="209" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">a job, a title, a mask?</text></g></g>
      <line class="a-masktagstrike" x1="49.5" y1="262" x2="250.5" y2="262" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g class="a-notes"><text x="150" y="238" text-anchor="middle" font-size="16" font-weight="600" fill="#2E5AAC" font-family="IBM Plex Sans, sans-serif">always Father</text><text x="450" y="238" text-anchor="middle" font-size="16" font-weight="600" fill="#AE4C17" font-family="IBM Plex Sans, sans-serif">always Son</text></g>
    </svg>`);
}

export default fatherEternallyFather;
