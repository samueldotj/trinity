import { frame, F, P } from './frame';
import './t36.css';

// ---------- Teaching 36: The Father speaks to the Son ----------
// 30 seconds: at the Jordan the voice from heaven calls Jesus "My beloved Son"; the One speaking and the One
// spoken of; one actor switching between roles is struck out; the Son prays and the Father answers.

function fatherSpeaksToSon(): string {
  return frame(36, 30000, [
    { label: 'A voice from heaven', at: 0, caption: 'Jesus stands in the Jordan; a voice from heaven calls Him “My beloved Son.”' },
    { label: 'Two real Persons', at: 0.22, caption: 'The One speaking and the One spoken of are clearly not the same Person.' },
    { label: 'Not one actor', at: 0.46, caption: 'God is not one Person acting sometimes as Father and sometimes as Son.' },
    { label: 'Asked and answered', at: 0.72, caption: 'Jesus prays and the Father answers: love within the one God, not two Gods.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: The Son stands in the river Jordan. From the clouds above, the Father’s voice comes down in waves: “This is My beloved Son”, and an arrow labelled speaks to runs from the Father to the Son. The Father is marked as the One speaking and the Son as the One spoken of: not the same Person. One actor switching between Father and Son is struck out. The Son prays “Father, glorify Your name!” and the Father answers “I have glorified it”: a relationship of love within the one God.">
      <g class="a-cloud">
        <circle cx="214" cy="84" r="18" fill="#E3E9F7"></circle><circle cx="240" cy="74" r="24" fill="#E3E9F7"></circle><circle cx="266" cy="84" r="18" fill="#E3E9F7"></circle><rect x="196" y="84" width="88" height="18" rx="9" fill="#E3E9F7"></rect>
        <circle cx="334" cy="84" r="18" fill="#E3E9F7"></circle><circle cx="360" cy="74" r="24" fill="#E3E9F7"></circle><circle cx="386" cy="84" r="18" fill="#E3E9F7"></circle><rect x="316" y="84" width="88" height="18" rx="9" fill="#E3E9F7"></rect>
      </g>
      <g transform="translate(300,118)"><g class="a-wave" style="animation-delay: 0s"><path d="M-34,0 Q0,20 34,0" fill="none" stroke="#2E5AAC" stroke-width="3" stroke-linecap="round"></path></g></g>
      <g transform="translate(300,118)"><g class="a-wave" style="animation-delay: 0.3s"><path d="M-34,0 Q0,20 34,0" fill="none" stroke="#2E5AAC" stroke-width="3" stroke-linecap="round"></path></g></g>
      <g transform="translate(300,118)"><g class="a-wave" style="animation-delay: 0.6s"><path d="M-34,0 Q0,20 34,0" fill="none" stroke="#2E5AAC" stroke-width="3" stroke-linecap="round"></path></g></g>
      <line class="a-arrow" x1="300" y1="108" x2="300" y2="262" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-speaks"><path d="M293,262 L300,274 L307,262 Z" fill="#33449A"></path></g>
      <g transform="translate(300,190)"><g class="a-speaks"><rect x="-46" y="-14" width="92" height="28" rx="14" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>speaks to</text></g></g>
      <g transform="translate(300,52)"><g class="a-father"><circle r="50" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Father</text></g></g>
      <g transform="translate(300,330)"><g class="a-son"><circle r="50" fill="#AE4C17"></circle><text y="0" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text></g></g>
      <g transform="translate(300,330)"><g class="a-note"><text y="21" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>beloved Son</text></g></g>
      <g class="a-river">
        <path d="M40,370 Q105,358 170,370 Q235,382 300,370 Q365,358 430,370 Q495,382 560,370 L560,424 L40,424 Z" fill="rgba(196,218,240,0.8)"></path>
        <path d="M80,398 Q120,390 160,398 M420,400 Q460,392 500,400" fill="none" stroke="#8FB2D9" stroke-width="2" stroke-linecap="round"></path>
        <text x="540" y="414" text-anchor="end" font-size="13" font-weight="600" fill="#1A3285" ${P}>the Jordan</text>
      </g>
      <g transform="translate(455,190)"><g class="a-voice"><rect x="-100" y="-17" width="200" height="34" rx="12" fill="#FFFFFF" stroke="#2E5AAC" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#22437F" ${P}>“This is My beloved Son”</text></g></g>
      <g transform="translate(115,52)"><g class="a-who"><rect x="-72" y="-15" width="144" height="30" rx="15" fill="#FFFFFF" stroke="#2E5AAC"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#22437F" ${P}>the One speaking</text></g></g>
      <g transform="translate(115,330)"><g class="a-who" style="animation-delay: 0.4s"><rect x="-76" y="-15" width="152" height="30" rx="15" fill="#FFFFFF" stroke="#AE4C17"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#7E3A10" ${P}>the One spoken of</text></g></g>
      <g transform="translate(460,262)"><g class="a-notsame"><rect x="-88" y="-15" width="176" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>not the same Person</text></g></g>
      <g transform="translate(470,186)"><g class="a-actor">
        <circle r="44" fill="#2E5AAC"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#FFFFFF" ${F}>Father</text>
        <g class="a-actorson"><circle r="44" fill="#AE4C17"></circle><text y="7" text-anchor="middle" font-size="20" font-weight="600" fill="#FFFFFF" ${F}>Son</text></g>
      </g></g>
      <g transform="translate(470,262)"><g class="a-actorpill"><rect x="-94" y="-15" width="188" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>one Person, two roles?</text></g></g>
      <line class="a-strike" x1="384" y1="286" x2="556" y2="150" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(136,140)"><g class="a-ask"><rect x="-106" y="-17" width="212" height="34" rx="12" fill="#FFFFFF" stroke="#AE4C17" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#7E3A10" ${P}>“Father, glorify Your name!”</text></g></g>
      <g transform="translate(462,292)"><g class="a-answer"><rect x="-84" y="-17" width="168" height="34" rx="12" fill="#FFFFFF" stroke="#2E5AAC" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#22437F" ${P}>“I have glorified it”</text></g></g>
      <g transform="translate(300,448)"><g class="a-love"><rect x="-130" y="-15" width="260" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>one God · a relationship of love</text></g></g>
    </svg>`);
}

export default fatherSpeaksToSon;
