import { frame } from './frame';
import './t25.css';

// ---------- Teaching 25: The Persons are distinguished by eternal relations of origin ----------
// 24 seconds: one nature in the centre shared by all three, with power, glory, wisdom and love; sizes of more or
// less divine struck out; where each comes from drawn in; a start in time and a lesser God struck out.

function relationsOfOrigin(): string {
  return frame(25, 24000, [
    { label: 'Everything else shared', at: 0, caption: 'In power, glory, wisdom and love the three share the one divine nature fully.' },
    { label: 'Not by rank or degree', at: 0.22, caption: 'They are not told apart by one being more divine, of higher rank, or first.' },
    { label: 'Relations of origin', at: 0.46, caption: 'The Father is from no one; the Son is begotten; the Spirit proceeds from both.' },
    { label: 'No beginning, none less', at: 0.72, caption: 'This origin has no beginning in time, and makes no Person any less God.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: The Father, the Son and the Holy Spirit around one nature in the centre, gold lines showing each shares it fully: power, glory, wisdom and love. The Persons swell and shrink to different sizes, as if one were more divine or higher in rank, and this is struck out as They return to the same size. Then the relations of origin are drawn: the Father, unbegotten, from no one; an arrow from the Father to the Son, begets; arrows from the Father and from the Son to the Spirit, proceeds. The questions a start in time? and less God? are struck out. Only these relations tell the Persons apart; the nature in the centre is one.">
      <line class="a-spoke" x1="300" y1="200" x2="300" y2="142" pathLength="1" stroke-dasharray="1 1" stroke="#E8A33C" stroke-width="4" stroke-linecap="round"></line>
      <line class="a-share" x1="300" y1="200" x2="300" y2="142" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 12"></line>
      <line class="a-spoke" x1="257.9" y1="271" x2="202.6" y2="301.2" pathLength="1" stroke-dasharray="1 1" stroke="#E8A33C" stroke-width="4" stroke-linecap="round"></line>
      <line class="a-share" x1="257.9" y1="271" x2="202.6" y2="301.2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 12"></line>
      <line class="a-spoke" x1="342.1" y1="271" x2="397.4" y2="301.2" pathLength="1" stroke-dasharray="1 1" stroke="#E8A33C" stroke-width="4" stroke-linecap="round"></line>
      <line class="a-share" x1="342.1" y1="271" x2="397.4" y2="301.2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 12"></line>
      <line class="a-r1" x1="270" y1="131.6" x2="185.2" y2="271.8" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3" stroke-linecap="round"></line><g class="a-r1head"><path d="M180,280.4 L180.8,264.5 L193.7,272.3 Z" fill="#33449A"></path></g>
      <line class="a-r2" x1="330" y1="131.6" x2="414.8" y2="271.8" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3" stroke-linecap="round"></line><g class="a-r2head"><path d="M420,280.4 L406.3,272.3 L419.2,264.5 Z" fill="#33449A"></path></g>
      <line class="a-r3" x1="208" y1="330" x2="382" y2="330" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3" stroke-linecap="round"></line><g class="a-r3head"><path d="M392,330 L378,337.5 L378,322.5 Z" fill="#33449A"></path></g>
      <g class="a-r1label"><text x="212" y="204" text-anchor="end" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">begets</text></g>
      <g class="a-r2label"><text x="388" y="204" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">proceeds</text></g>
      <g class="a-r3label"><text x="300" y="352" text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">proceeds</text></g>
      <g transform="translate(300,248)"><g class="a-nature"><circle r="44" fill="#FFF8EB" stroke="#E8A33C" stroke-width="4"></circle><text y="-3" text-anchor="middle" font-size="15" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">one</text><text y="15" text-anchor="middle" font-size="15" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">nature</text></g></g>
      <g transform="translate(300,82)"><g class="a-person" style="--s: 1.18"><circle r="52" fill="#2E5AAC"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Father</text></g></g>
      <g transform="translate(150,330)"><g class="a-person" style="--s: 0.82"><circle r="52" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Son</text></g></g>
      <g transform="translate(450,330)"><g class="a-person" style="--s: 0.62"><circle r="52" fill="#157A6E"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">Spirit</text></g></g>
      <g transform="translate(172.5,440)"><g class="a-chip" style="animation-delay: 0s"><rect x="-34.5" y="-15" width="69" height="30" rx="15" fill="#FFFFFF" stroke="#E8A33C"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">power</text></g></g>
      <g transform="translate(257.5,440)"><g class="a-chip" style="animation-delay: 0.2s"><rect x="-34.5" y="-15" width="69" height="30" rx="15" fill="#FFFFFF" stroke="#E8A33C"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">glory</text></g></g>
      <g transform="translate(346.5,440)"><g class="a-chip" style="animation-delay: 0.4s"><rect x="-38.5" y="-15" width="77" height="30" rx="15" fill="#FFFFFF" stroke="#E8A33C"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">wisdom</text></g></g>
      <g transform="translate(431.5,440)"><g class="a-chip" style="animation-delay: 0.6s"><rect x="-30.5" y="-15" width="61" height="30" rx="15" fill="#FFFFFF" stroke="#E8A33C"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">love</text></g></g>
      <g transform="translate(300,440)"><g class="a-rank"><rect x="-124" y="-15" width="248" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">more divine? higher in rank?</text></g></g>
      <line class="a-rankstrike" x1="180" y1="440" x2="420" y2="440" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g class="a-fnote"><text x="364" y="76" font-size="15" font-weight="600" fill="#2E5AAC" font-family="IBM Plex Sans, sans-serif">unbegotten</text><text x="364" y="95" font-size="13" font-weight="600" fill="#4A5168" font-family="IBM Plex Sans, sans-serif">from no one</text></g>
      <g class="a-snote"><text x="150" y="410" text-anchor="middle" font-size="15" font-weight="600" fill="#AE4C17" font-family="IBM Plex Sans, sans-serif">begotten</text></g>
      <g class="a-pnote"><text x="450" y="410" text-anchor="middle" font-size="15" font-weight="600" fill="#157A6E" font-family="IBM Plex Sans, sans-serif">proceeds</text></g>
      <g transform="translate(176,448)"><g class="a-start"><rect x="-77.5" y="-15" width="155" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">a start in time?</text></g></g>
      <line class="a-startstrike" x1="102.5" y1="448" x2="249.5" y2="448" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g transform="translate(440,448)"><g class="a-lessgod"><rect x="-50" y="-15" width="100" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">less God?</text></g></g>
      <line class="a-lessgodstrike" x1="394" y1="448" x2="486" y2="448" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
    </svg>`);
}

export default relationsOfOrigin;
