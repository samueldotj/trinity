// Animated illustrations for presentation mode, one per teaching that has one (design canvas:
// Explanation Presentation Mode, "Slide 5 · Animated illustration"). Each is plain SVG and HTML moved by
// CSS keyframes in style.css (the .anim-t<n> rules), so it restarts whenever its slide is shown and,
// for readers who ask for reduced motion, stands still on its finished picture.

const F = 'font-family="Fraunces, Georgia, serif"';
const P = 'font-family="IBM Plex Sans, sans-serif"';

/** A scene's label above the picture, and the caption shown under it during that scene. */
interface Scene { label: string; caption: string }

function frame(n: number, scenes: Scene[], svg: string): string {
  return `<div class="anim anim-t${n}">
      <ol class="anim-steps" aria-label="Scenes">${scenes.map((s, i) => `<li class="anim-step${i + 1}">${i + 1} · ${s.label}</li>`).join('')}</ol>
      ${svg}
      <div class="anim-caps">${scenes.map((s, i) => `<p class="anim-cap${i + 1}">${s.caption}</p>`).join('')}</div>
    </div>`;
}

// ---------- Teaching 1: God is One ----------
// 16 seconds: God and the one essence; the three Persons come from Him, each joined by "is"; pulled apart
// they would be three gods, which is struck out; they come back together.

// `tagY`: where the "a god?" tag sits, below the Father and above the Son and the Spirit, inside the picture.
function person1(cls: string, x: number, y: number, fill: string, name: string, tagY: number): string {
  return `<g transform="translate(${x},${y})"><g class="${cls}">
      <circle r="56" fill="${fill}"></circle>
      <text y="2" text-anchor="middle" font-size="22" font-weight="600" fill="#FFFFFF" ${F}>${name}</text>
      <text y="22" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>Person</text>
      <g transform="translate(0,${tagY})"><g class="a-tag"><rect x="-40" y="-13" width="80" height="26" rx="13" fill="#FBEAEA" stroke="#B3261E"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#9B1C1C" ${P}>a god?</text></g></g>
    </g></g>`;
}

const isPill = (x: number, y: number) =>
  `<g transform="translate(${x},${y})"><g class="a-pill"><rect x="-17" y="-12" width="34" height="24" rx="12" fill="#FFFFFF" stroke="#1B1E27"></rect><text y="4.5" text-anchor="middle" font-size="13" font-weight="600" fill="#1B1E27" ${P}>is</text></g></g>`;

function godIsOne(): string {
  const svg = `<svg class="anim-svg" viewBox="0 0 600 480" role="img" aria-label="Animation: one God at the centre, one in essence. The Father, the Son and the Holy Spirit come out from Him, each joined to Him by the word is. Pulled apart they would be three gods, which is struck out. They come back together: one what, three who.">
      <line class="a-tri" x1="300" y1="80" x2="130" y2="370" stroke="#C9C5BB" stroke-width="2"></line>
      <line class="a-tri" x1="300" y1="80" x2="470" y2="370" stroke="#C9C5BB" stroke-width="2"></line>
      <line class="a-tri" x1="130" y1="370" x2="470" y2="370" stroke="#C9C5BB" stroke-width="2"></line>
      <line class="a-spoke" x1="300" y1="250" x2="300" y2="80" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-spoke" x1="300" y1="250" x2="130" y2="370" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <line class="a-spoke" x1="300" y1="250" x2="470" y2="370" pathLength="1" stroke-dasharray="1 1" stroke="#1B1E27" stroke-width="3"></line>
      <circle class="a-ring" cx="300" cy="250" r="82" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="3" transform="rotate(-90 300 250)"></circle>
      <g transform="translate(452,206)"><g class="a-ringlabel"><rect x="-62" y="-14" width="124" height="28" rx="14" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" ${P}>one essence</text></g></g>
      <g transform="translate(300,250)"><g class="a-god">
        <circle r="58" fill="rgba(51,68,154,0.16)"></circle>
        <circle r="52" fill="#12172B"></circle>
        <text y="3" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" ${F}>God</text>
        <text y="22" text-anchor="middle" font-size="12" fill="#FFFFFF" ${P}>one God</text>
      </g></g>
      ${isPill(300, 168)}${isPill(218, 308)}${isPill(382, 308)}
      ${person1('a-f', 300, 80, '#2E5AAC', 'Father', 80)}
      ${person1('a-s', 130, 370, '#AE4C17', 'Son', -80)}
      ${person1('a-p', 470, 370, '#157A6E', 'Spirit', -80)}
      <g transform="translate(300,250)"><g class="a-not">
        <rect x="-96" y="-20" width="192" height="40" rx="20" fill="#FFFFFF" stroke="#B3261E" stroke-width="2"></rect>
        <text y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#9B1C1C" text-decoration="line-through" ${P}>Not three gods</text>
      </g></g>
    </svg>`;
  return frame(1, [
    { label: 'One essence', caption: 'There is only one divine being: God is one in essence, what God is.' },
    { label: 'Three Persons', caption: 'He is three in Person, who God is: the Father, the Son and the Holy Spirit.' },
    { label: 'Not three gods', caption: 'Not three separate gods working together like a team.' },
    { label: 'One God', caption: 'One “what” and three “who”: no contradiction.' },
  ], svg);
}

const ANIMATIONS: Record<number, () => string> = { 1: godIsOne };

/** The animated illustration for teaching `n`, or null where it has none yet. */
export function animationFor(n: number): string | null {
  return ANIMATIONS[n]?.() ?? null;
}
