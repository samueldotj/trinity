import { F, P, frame } from './frame';
import './t9.css';

// ---------- Teaching 9: God has one divine essence ----------
// 24 seconds: what is God? one being; who? three Persons; three beings side by side in a room is struck out;
// one figure changing three masks is struck out; one being, each Person God, no Person another.

const pill9 = (cls: string, x: number, y: number, w: number, text: string, stroke = '#33449A', ink = '#33449A', fill = '#FFFFFF') =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-15" width="${w}" height="30" rx="15" fill="${fill}" stroke="${stroke}"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="${ink}" ${P}>${text}</text></g></g>`;

/** A Person at (x, y); in scene 2 it moves by (dx, dy) into the room. */
const person9 = (x: number, y: number, fill: string, name: string, dx: number, dy: number, delay: number) =>
  `<g transform="translate(${x},${y})"><g class="a-person" style="--dx: ${dx}px; --dy: ${dy}px; animation-delay: ${delay}s">
      <circle r="48" fill="${fill}"></circle>
      <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>${name}</text>
      <text y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>Person</text>
    </g></g>`;

const small9 = (cls: string, x: number, y: number, w: number, text: string, color: string) =>
  `<g transform="translate(${x},${y})"><g class="${cls}"><rect x="${-w / 2}" y="-12" width="${w}" height="24" rx="12" fill="#FFFFFF" stroke="${color}"></rect><text y="4.5" text-anchor="middle" font-size="13" font-weight="600" fill="${color}" ${P}>${text}</text></g></g>`;

const mask9 = (cls: string, fill: string, name: string) =>
  `<g transform="translate(300,214)"><g class="${cls}">
      <ellipse rx="36" ry="42" fill="${fill}" stroke="#FFFFFF" stroke-width="2"></ellipse>
      <ellipse cx="-13" cy="-10" rx="7" ry="4.5" fill="#FFFFFF"></ellipse><ellipse cx="13" cy="-10" rx="7" ry="4.5" fill="#FFFFFF"></ellipse>
      <text y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#FFFFFF" ${P}>${name}</text>
    </g></g>`;

function oneDivineEssence(): string {
  return frame(9, 24000, [
    { label: 'One what, three who', at: 0, caption: 'What is God? One divine being. Who is God? Three Persons.' },
    { label: 'Not three beings', at: 0.22, caption: 'Not three beings or three gods, side by side like three people in a room.' },
    { label: 'Not three masks', at: 0.46, caption: 'Nor one God wearing three masks: the three Persons are truly distinct.' },
    { label: 'One being, three Persons', at: 0.72, caption: 'One being, wholly possessed by three Persons: each has all of it.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: God, one being, answers the question what is God; the Father, the Son and the Holy Spirit, three Persons, answer who is God. The three Persons move into a room side by side, as three beings or three gods, and this is struck out. One figure puts on the masks of the Father, the Son and the Spirit in turn, and this is struck out too. Then the one God at the centre, with a solid line saying is to each Person, and dashed lines saying is not between the Persons: one being, three Persons.">
      <g class="a-room">
        <rect x="50" y="170" width="500" height="160" rx="16" fill="#F1EEE8" stroke="#9AA0AD" stroke-width="2"></rect>
        <text x="68" y="194" font-size="13" font-weight="600" fill="#4A5168" ${P}>one room</text>
      </g>
      <line class="a-not" x1="300" y1="60" x2="120" y2="380" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
      <line class="a-not" x1="300" y1="60" x2="480" y2="380" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
      <line class="a-not" x1="120" y1="380" x2="480" y2="380" stroke="#6B7080" stroke-width="3" stroke-dasharray="8 6"></line>
      <line class="a-spoke" x1="300" y1="250" x2="300" y2="60" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-spoke" x1="300" y1="250" x2="120" y2="380" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-spoke" x1="300" y1="250" x2="480" y2="380" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      ${small9('a-is', 300, 154, 34, 'is', '#1B1E27')}${small9('a-is', 209, 316, 34, 'is', '#1B1E27')}${small9('a-is', 391, 316, 34, 'is', '#1B1E27')}
      ${small9('a-isnot', 210, 220, 62, 'is not', '#4A5168')}${small9('a-isnot', 390, 220, 62, 'is not', '#4A5168')}${small9('a-isnot', 300, 380, 62, 'is not', '#4A5168')}
      ${pill9('a-what', 466, 250, 150, 'what? one being')}
      ${pill9('a-who', 136, 250, 172, 'who? three Persons')}
      <g transform="translate(300,330)"><g class="a-figure"><g transform="scale(2.2)"><circle cy="-50" r="10" fill="#8A90A6"></circle><path d="M-15,-37 Q0,-42 15,-37 L17,-14 L9,-14 L8,0 L2,0 L0,-12 L-2,0 L-8,0 L-9,-14 L-17,-14 Z" fill="#8A90A6"></path></g></g></g>
      ${mask9('a-mask1', '#2E5AAC', 'Father')}${mask9('a-mask2', '#AE4C17', 'Son')}${mask9('a-mask3', '#157A6E', 'Spirit')}
      ${pill9('a-masktag', 300, 374, 206, 'one God, three masks?', '#B3261E', '#9B1C1C', '#FBEAEA')}
      <line class="a-maskstrike" x1="196" y1="398" x2="404" y2="166" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
      <g transform="translate(300,250)"><g class="a-god">
        <circle r="56" fill="rgba(51,68,154,0.16)"></circle>
        <circle r="50" fill="#12172B"></circle>
        <text y="2" text-anchor="middle" font-size="24" font-weight="600" fill="#FFFFFF" ${F}>God</text>
        <text y="20" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>one being</text>
      </g></g>
      ${person9(300, 60, '#2E5AAC', 'Father', -150, 190, 0)}
      ${person9(120, 380, '#AE4C17', 'Son', 180, -130, 0.3)}
      ${person9(480, 380, '#157A6E', 'Spirit', -30, -130, 0.6)}
      ${pill9('a-roomtag', 300, 372, 236, 'three beings, three gods?', '#B3261E', '#9B1C1C', '#FBEAEA')}
      <line class="a-roomstrike" x1="70" y1="320" x2="530" y2="180" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="6" stroke-linecap="round"></line>
    </svg>`);
}

export default oneDivineEssence;
