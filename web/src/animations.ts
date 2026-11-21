// Animated illustrations for presentation mode, one per teaching that has one (design canvas:
// Explanation Presentation Mode, "Slide 5 · Animated illustration"). Each is plain SVG and HTML moved by
// CSS keyframes in style.css (the .anim-t<n> rules), so it restarts whenever its slide is shown and,
// for readers who ask for reduced motion, stands still on its finished picture.

const F = 'font-family="Fraunces, Georgia, serif"';
const P = 'font-family="IBM Plex Sans, sans-serif"';

/**
 * A scene's label above the picture, the caption shown under it during that scene, and when it starts,
 * as a fraction of the loop (matching its caption's keyframes in style.css).
 */
interface Scene { label: string; caption: string; at: number }

const PAUSE = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/><rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/></svg>';
const PLAY = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4L13 8z" fill="currentColor"/></svg>';

/** `ms`: the loop's length, as in its .anim-t<n> rule. */
function frame(n: number, ms: number, scenes: Scene[], svg: string): string {
  return `<div class="anim anim-t${n}">
      <div class="anim-bar">
        <button type="button" class="anim-toggle" aria-pressed="false" aria-label="Pause (K)" title="Pause (K)">${PAUSE}</button>
        <ol class="anim-steps" aria-label="Scenes">${scenes.map((s, i) => `<li><button type="button" class="anim-step${i + 1}" data-at="${Math.round(s.at * ms)}" title="Go to this scene">${i + 1} · ${s.label}</button></li>`).join('')}</ol>
      </div>
      ${svg}
      <div class="anim-caps">${scenes.map((s, i) => `<p class="anim-cap${i + 1}">${s.caption}</p>`).join('')}</div>
    </div>`;
}

/**
 * Pause and play, for explaining a scene: the button, K, or a click on the picture. A scene's label goes
 * to the start of that scene, keeping it paused if it was. Runs each time the slide is shown.
 */
export function wireAnimation(body: HTMLElement): void {
  const box = body.querySelector<HTMLElement>('.anim');
  if (!box) return;
  const toggle = box.querySelector<HTMLButtonElement>('.anim-toggle')!;
  const all = () => box.getAnimations({ subtree: true });
  let paused = false;
  const set = (p: boolean) => {
    paused = p;
    all().forEach((a) => (p ? a.pause() : a.play()));
    box.classList.toggle('is-paused', p);
    toggle.setAttribute('aria-pressed', String(p));
    toggle.innerHTML = p ? PLAY : PAUSE;
    toggle.title = p ? 'Play (K)' : 'Pause (K)';
    toggle.setAttribute('aria-label', toggle.title);
  };
  toggle.addEventListener('click', () => set(!paused));
  box.querySelector('.anim-svg')?.addEventListener('click', () => set(!paused));
  box.querySelectorAll<HTMLButtonElement>('[data-at]').forEach((b) => b.addEventListener('click', () => {
    const t = Number(b.dataset.at);
    all().forEach((a) => { a.currentTime = t; });
  }));
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
  const svg = `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: one God at the centre, one in essence. The Father, the Son and the Holy Spirit come out from Him, each joined to Him by the word is. Pulled apart they would be three gods, which is struck out. They come back together: one what, three who.">
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
  return frame(1, 16000, [
    { label: 'One essence', at: 0, caption: 'There is only one divine being: God is one in essence, what God is.' },
    { label: 'Three Persons', at: 0.22, caption: 'He is three in Person, who God is: the Father, the Son and the Holy Spirit.' },
    { label: 'Not three gods', at: 0.46, caption: 'Not three separate gods working together like a team.' },
    { label: 'One God', at: 0.72, caption: 'One “what” and three “who”: no contradiction.' },
  ], svg);
}

// ---------- Teaching 2: God is Spirit ----------
// 24 seconds: a solid disc of body, size, shape and parts cracks and falls away, leaving God, who is Spirit;
// a human figure grows bigger and stronger and is struck out; a hand and an eye become power and care;
// God is Spirit, no body and no parts.

/** One quarter of the stone disc; it flies off along (dx, dy), turning by r degrees. */
function piece2(d: string, lx: number, ly: number, dx: number, dy: number, r: number, label: string): string {
  return `<g class="a-piece" style="--dx: ${dx}px; --dy: ${dy}px; --r: ${r}deg">
      <path d="${d}" fill="#8E8A80" stroke="#6E695D" stroke-width="1.5"></path>
      <text x="${lx}" y="${ly}" text-anchor="middle" font-size="15" font-weight="600" fill="#FFFFFF" ${P}>${label}</text>
    </g>`;
}

function word2(x: number, y: number, picture: string, meaning: string): string {
  return `<g transform="translate(${x},${y})"><g class="a-word">
      <text y="-30" text-anchor="middle" font-size="12" font-weight="600" fill="#4A5168" ${P}>“${picture}” pictures His</text>
      <rect x="-50" y="-17" width="100" height="34" rx="17" fill="#E3E9F7" stroke="#2849B8" stroke-width="1.5"></rect>
      <text y="6" text-anchor="middle" font-size="17" font-weight="600" fill="#1A3285" ${P}>${meaning}</text>
    </g></g>`;
}

function godIsSpirit(): string {
  const svg = `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: a solid disc made of pieces labelled body, size, shape and parts cracks apart and falls away, leaving God, who is Spirit, inside a dotted ring. A small human figure grows bigger and stronger, is asked whether that is God, and is struck out. A hand and an eye become the words power and care. God is Spirit: no body, no parts.">
      <g transform="translate(300,250)"><g class="a-ringspin">
        <circle class="a-ring" r="150" fill="none" stroke="#33449A" stroke-width="4" stroke-linecap="round" stroke-dasharray="0.1 14"></circle>
      </g></g>
      <g transform="translate(130,450)"><g class="a-human">
        <circle cy="-106" r="17" fill="#6B7080"></circle>
        <path d="M-27,-82 Q0,-91 27,-82 L31,-36 L18,-36 L16,0 L4,0 L0,-30 L-4,0 L-16,0 L-18,-36 L-31,-36 Z" fill="#6B7080"></path>
      </g></g>
      <g transform="translate(140,96)"><g class="a-humantag"><rect x="-104" y="-15" width="208" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" ${P}>bigger, stronger… God?</text></g></g>
      <line class="a-strike" x1="50" y1="452" x2="232" y2="128" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="7" stroke-linecap="round"></line>
      <g transform="translate(300,250)">
        ${piece2('M-2,-2 L-80,-2 A78,78 0 0 1 -2,-80 Z', -36, -26, -150, -110, -25, 'body')}
        ${piece2('M2,-2 L2,-80 A78,78 0 0 1 80,-2 Z', 36, -26, 150, -110, 25, 'size')}
        ${piece2('M2,2 L80,2 A78,78 0 0 1 2,80 Z', 36, 42, 150, 110, -20, 'shape')}
        ${piece2('M-2,2 L-2,80 A78,78 0 0 1 -80,2 Z', -36, 42, -150, 110, 20, 'parts')}
      </g>
      <g transform="translate(76,250)"><g class="a-icon">
        <path d="M-24,46 L-24,4 M-24,4 L-24,-30 M-9,6 L-9,-40 M6,6 L6,-38 M21,8 L21,-26" stroke="#8A7F6E" stroke-width="13" stroke-linecap="round" fill="none"></path>
        <path d="M-31,0 L-31,30 Q-31,52 -6,52 L10,52 Q28,52 28,32 L28,6 L-31,6 Z" fill="#8A7F6E"></path>
        <path d="M28,20 L44,4" stroke="#8A7F6E" stroke-width="13" stroke-linecap="round"></path>
      </g></g>
      <g transform="translate(524,250)"><g class="a-icon">
        <path d="M-46,0 Q0,-36 46,0 Q0,36 -46,0 Z" fill="#FFFFFF" stroke="#8A7F6E" stroke-width="4"></path>
        <circle r="14" fill="#8A7F6E"></circle>
      </g></g>
      ${word2(84, 250, 'hand', 'power')}
      ${word2(516, 250, 'eyes', 'care')}
      <g transform="translate(300,250)"><g class="a-god">
        <circle r="58" fill="#FFFFFF" stroke="#12172B" stroke-width="3"></circle>
        <text y="3" text-anchor="middle" font-size="26" font-weight="600" fill="#12172B" ${F}>God</text>
        <text y="23" text-anchor="middle" font-size="13" fill="#3A4058" ${P}>Spirit</text>
      </g></g>
      <g transform="translate(300,436)"><g class="a-spiritlabel"><rect x="-90" y="-15" width="180" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" ${P}>no body · no parts</text></g></g>
    </svg>`;
  return frame(2, 24000, [
    { label: 'No matter', at: 0, caption: 'God is not made of matter: no body, no size or shape, no physical parts.' },
    { label: 'Not a bigger human', at: 0.22, caption: 'He is not a larger, stronger version of a human being.' },
    { label: 'Pictures, not parts', at: 0.46, caption: 'His “hand” and “eyes” are pictures of His real power and care.' },
    { label: 'God is Spirit', at: 0.72, caption: 'God is Spirit: He cannot be seen with our eyes or confined to one place.' },
  ], svg);
}

// ---------- Teaching 3: God is Eternal ----------
// 24 seconds: an unbroken circle round God with a point going round it; time drawn in beneath, made by
// God; a candle on it burns out while "very old?" is struck out; Alpha and Omega over the start and finish.

function godIsEternal(): string {
  return frame(3, 24000, [
    { label: 'No beginning or end', at: 0, caption: 'There was never a time when God did not exist, and there never will be.' },
    { label: 'Time is made', at: 0.22, caption: 'Time is something He created, not something that rules over Him.' },
    { label: 'Not merely old', at: 0.46, caption: 'He is not merely very old: He does not grow older or wear out.' },
    { label: 'He simply is', at: 0.72, caption: 'He simply is: the Alpha and the Omega, who is and was and is to come.' },
  ], `<svg class="anim-svg" viewBox="0 -24 600 504" role="img" aria-label="Animation: God inside an unbroken circle, a point going round it without start or stop. A line of time appears beneath, made by God. A candle on the line of time burns down and goes out, and the question very old is struck out. Alpha and Omega stand on the circle over the start and the finish of time: God who is and was and is to come.">
      <line class="a-time" x1="100" y1="430" x2="500" y2="430" pathLength="1" stroke-dasharray="1 1" stroke="#6B7080" stroke-width="3"></line>
      <g class="a-timeextra"><line x1="140" y1="424" x2="140" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="180" y1="424" x2="180" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="220" y1="424" x2="220" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="260" y1="424" x2="260" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="300" y1="424" x2="300" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="340" y1="424" x2="340" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="380" y1="424" x2="380" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="420" y1="424" x2="420" y2="436" stroke="#8A90A6" stroke-width="2"></line><line x1="460" y1="424" x2="460" y2="436" stroke="#8A90A6" stroke-width="2"></line><path d="M500,421 L518,430 L500,439 Z" fill="#6B7080"></path></g>
      <g transform="translate(300,458)"><g class="a-timelabel"><text text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">time · made by God</text></g></g>
      <line class="a-drop" x1="160" y1="236" x2="160" y2="430" stroke="#33449A" stroke-width="2" stroke-dasharray="6 6"></line>
      <line class="a-drop" x1="440" y1="236" x2="440" y2="430" stroke="#33449A" stroke-width="2" stroke-dasharray="6 6"></line>
      <g transform="translate(160,458)"><g class="a-drop"><text text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">the start</text></g></g>
      <g transform="translate(440,458)"><g class="a-drop"><text text-anchor="middle" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">the finish</text></g></g>
      <g transform="translate(220,430)"><g class="a-candle"><rect x="-11" y="-62" width="22" height="62" rx="3" fill="#EFE9DD" stroke="#A39782" stroke-width="1.5"></rect></g></g>
      <g transform="translate(220,430)"><g class="a-flame"><line x1="0" y1="-62" x2="0" y2="-70" stroke="#5A4F3C" stroke-width="2"></line><path d="M0,-88 Q8,-76 0,-68 Q-8,-76 0,-88 Z" fill="#E8A33C"></path></g></g>
      <g transform="translate(220,458)"><g class="a-wears"><text text-anchor="middle" font-size="13" font-weight="600" fill="#5A4F3C" font-family="IBM Plex Sans, sans-serif">wears out</text></g></g>
      <circle class="a-ring" cx="300" cy="210" r="140" pathLength="1" stroke-dasharray="1 1" fill="none" stroke="#33449A" stroke-width="5" transform="rotate(-90 300 210)"></circle>
      <g transform="translate(300,210)"><g class="a-orbit"><circle cy="-140" r="9" fill="#33449A"></circle><circle cy="-140" r="16" fill="rgba(51,68,154,0.2)"></circle></g></g>
      <g transform="translate(300,376)"><g class="a-ringlabel"><rect x="-98" y="-15" width="196" height="30" rx="15" fill="#FFFFFF" stroke="#33449A"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">no beginning · no end</text></g></g>
      <g transform="translate(300,210)"><g class="a-god">
        <circle r="58" fill="#12172B"></circle>
        <text y="3" text-anchor="middle" font-size="26" font-weight="600" fill="#FFFFFF" font-family="Fraunces, Georgia, serif">God</text>
        <text y="23" text-anchor="middle" font-size="13" fill="#FFFFFF" font-family="IBM Plex Sans, sans-serif">eternal</text>
      </g></g>
      <g transform="translate(300,300)"><g class="a-wasis"><text text-anchor="middle" font-size="14" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">was · is · is to come</text></g></g>
      <g transform="translate(478,64)"><g class="a-oldtag"><rect x="-58" y="-15" width="116" height="30" rx="15" fill="#FFFFFF" stroke="#6B7080"></rect><text y="5" text-anchor="middle" font-size="14" font-weight="600" fill="#3A4058" font-family="IBM Plex Sans, sans-serif">very old?</text></g></g>
      <line class="a-oldstrike" x1="414" y1="64" x2="542" y2="64" pathLength="1" stroke-dasharray="1 1" stroke="#B3261E" stroke-width="4" stroke-linecap="round"></line>
      <g transform="translate(160,210)"><g class="a-letter"><circle r="24" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5"></circle><text y="9" text-anchor="middle" font-size="26" font-weight="600" fill="#33449A" font-family="Fraunces, Georgia, serif">Α</text><text x="-32" y="5" text-anchor="end" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">Alpha</text></g></g>
      <g transform="translate(440,210)"><g class="a-letter"><circle r="24" fill="#FFFFFF" stroke="#33449A" stroke-width="2.5"></circle><text y="9" text-anchor="middle" font-size="26" font-weight="600" fill="#33449A" font-family="Fraunces, Georgia, serif">Ω</text><text x="32" y="5" text-anchor="start" font-size="13" font-weight="600" fill="#33449A" font-family="IBM Plex Sans, sans-serif">Omega</text></g></g>
    </svg>`);
}

const ANIMATIONS: Record<number, () => string> = { 1: godIsOne, 2: godIsSpirit, 3: godIsEternal };

/** The animated illustration for teaching `n`, or null where it has none yet. */
export function animationFor(n: number): string | null {
  return ANIMATIONS[n]?.() ?? null;
}
