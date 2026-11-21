import { frame, F, P } from './frame';
import './t34.css';

// ---------- Teaching 34: The Holy Spirit glorifies the Son ----------
// 30 seconds: the Spirit's light falls on the Son and people see Him; what is Christ's passes through the
// Spirit to us; a message of the Spirit's own is struck out; the Father joins, the Spirit glorifies the Son.

function spiritGlorifiesSon(): string {
  return frame(34, 30000, [
    { label: 'Shows us Jesus', at: 0, caption: 'The Spirit’s work is to show us who Jesus is: He opens our eyes to His glory.' },
    { label: 'Takes what is Christ’s', at: 0.22, caption: 'He takes what is Christ’s and makes it known, bringing His words home to us.' },
    { label: 'No message of His own', at: 0.46, caption: 'He brings no different message of His own, nothing beyond Christ.' },
    { label: 'Equal in glory', at: 0.72, caption: 'Not lesser: He is fully God, worshipped with the Father and the Son.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: The Holy Spirit shines a light on the Son, who glows, and people below see Him. A card of what is Christ’s passes from the Son to the Spirit and on to the people. A message of the Spirit’s own and a teaching beyond Christ are struck out. The Father appears above, and an arrow labelled glorifies runs from the Spirit to the Son: the Spirit is fully God and equal in glory.">
      <line class="a-flines" x1="268.5" y1="88.8" x2="212.9" y2="157.2" pathLength="1" stroke-dasharray="1 1" stroke="#C9C5BB" stroke-width="2"></line>
      <line class="a-flines" x1="331.5" y1="88.8" x2="387.1" y2="157.2" pathLength="1" stroke-dasharray="1 1" stroke="#C9C5BB" stroke-width="2"></line>
      <polygon class="a-beam" points="380,194 380,226 232,262 232,158" fill="rgba(232,163,60,0.3)"></polygon>
      <line class="a-sight" x1="186" y1="286" x2="220" y2="380" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-sight" x1="204" y1="280" x2="300" y2="380" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <line class="a-sight" x1="220" y1="270" x2="380" y2="380" stroke="#E8A33C" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 9"></line>
      <g transform="translate(170,210)"><g class="a-halo"><circle r="66" fill="rgba(232,163,60,0.14)" stroke="#E8A33C" stroke-width="5"></circle></g></g>
      <line class="a-arrow" x1="376" y1="210" x2="250" y2="210" pathLength="1" stroke-dasharray="1 1" stroke="#33449A" stroke-width="3"></line>
      <g class="a-glory"><path d="M250,203 L238,210 L250,217 Z" fill="#33449A"></path></g>
      <g transform="translate(310,210)"><g class="a-glory"><rect x="-44" y="-14" width="88" height="28" rx="14" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>glorifies</text></g></g>
      <g transform="translate(300,50)"><g class="a-father"><circle r="46" fill="#E6EBF5" stroke="#96ACD6" stroke-width="2"></circle><text y="8" text-anchor="middle" font-size="22" font-weight="600" fill="#22437F" ${F}>Father</text></g></g>
      <g transform="translate(170,210)"><g class="a-son"><circle r="52" fill="#AE4C17"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Son</text></g></g>
      <g transform="translate(170,210)"><g class="a-sondim"><circle r="52" fill="#F5EAE3" stroke="#D6A68B" stroke-width="2"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#7E3A10" ${F}>Son</text></g></g>
      <g transform="translate(430,210)"><g class="a-spirit"><circle r="52" fill="#157A6E"></circle><text y="8" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>Spirit</text></g></g>
      <g transform="translate(300,100)"><g class="a-receives"><text text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" ${P}>He hears and receives</text></g></g>
      <g transform="translate(482,318)"><g class="a-discloses"><text text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" ${P}>discloses to you</text></g></g>
      <g transform="translate(170,128)"><g class="a-card"><rect x="-67" y="-15" width="134" height="30" rx="15" fill="#FFFFFF" stroke="#AE4C17" stroke-width="2"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#7E3A10" ${P}>what is Christ’s</text></g></g>
      <g transform="translate(440,305)"><g class="a-own"><rect x="-92" y="-15" width="184" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>a message of His own?</text></g></g>
      <g transform="translate(440,350)"><g class="a-own" style="animation-delay: 0.3s"><rect x="-98" y="-15" width="196" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>teaching beyond Christ?</text></g></g>
      <line class="a-strike" x1="340" y1="318" x2="540" y2="292" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round"></line>
      <line class="a-strike" x1="334" y1="363" x2="546" y2="337" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="5" stroke-linecap="round" style="animation-delay: 0.3s"></line>
      <g transform="translate(300,300)"><g class="a-equal"><rect x="-112" y="-15" width="224" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>fully God · equal in glory</text></g></g>
      <g transform="translate(220,450)"><g class="a-people" style="animation-delay: 0s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(300,450)"><g class="a-people" style="animation-delay: 0.2s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
      <g transform="translate(380,450)"><g class="a-people" style="animation-delay: 0.4s"><circle cy="-50" r="10" fill="#6B7080"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#6B7080"></path></g></g>
    </svg>`);
}

export default spiritGlorifiesSon;
