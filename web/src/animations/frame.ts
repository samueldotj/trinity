// What every animated illustration shares: the frame round its picture (scene labels, pause button,
// captions) and the controls that pause it and jump between scenes. Each teaching's own picture is in
// t<n>.ts beside this file, moved by the keyframes in its t<n>.css; index.ts finds them.

export const F = 'font-family="Fraunces, Georgia, serif"';
export const P = 'font-family="IBM Plex Sans, sans-serif"';

/**
 * A scene's label above the picture, the caption shown under it during that scene, and when it starts,
 * as a fraction of the loop (matching the shared caption keyframes in style.css).
 */
export interface Scene { label: string; caption: string; at: number }

const PAUSE = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/><rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor"/></svg>';
const PLAY = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4L13 8z" fill="currentColor"/></svg>';

/** Playback speeds, slowest first; "Normal" plays each loop in its own time (40 seconds). */
const SPEEDS: [string, number][] = [
  ['Slowest', 0.25], ['Slower', 0.5], ['Slow', 0.75], ['Normal', 1], ['Fast', 1.5], ['Faster', 2], ['Fastest', 3],
];
const SPEED_KEY = 'trinity.animationSpeed';
/** The speed last chosen, kept between slides, teachings and visits. */
function savedSpeed(): number {
  try {
    const r = Number(localStorage.getItem(SPEED_KEY));
    if (SPEEDS.some(([, s]) => s === r)) return r;
  } catch { /* storage unavailable: normal speed */ }
  return 1;
}

/** `ms`: the loop's length, as in the .anim-t<n> rule in t<n>.css. */
export function frame(n: number, ms: number, scenes: Scene[], svg: string): string {
  const speed = savedSpeed();
  return `<div class="anim anim-t${n}">
      <div class="anim-bar">
        <button type="button" class="anim-toggle" aria-pressed="false" aria-label="Pause (K)" title="Pause (K)">${PAUSE}</button>
        <label class="anim-speed" title="Animation speed"><span class="sr-only">Animation speed</span>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 11a5.5 5.5 0 1 1 11 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 11l3-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <select>${SPEEDS.map(([name, r]) => `<option value="${r}"${r === speed ? ' selected' : ''}>${name}</option>`).join('')}</select>
        </label>
        <ol class="anim-steps" aria-label="Scenes">${scenes.map((s, i) => `<li><button type="button" class="anim-step${i + 1}" data-at="${Math.round(s.at * ms)}" title="Go to this scene">${i + 1} · ${s.label}</button></li>`).join('')}</ol>
      </div>
      ${svg}
      <div class="anim-caps">${scenes.map((s, i) => `<p class="anim-cap${i + 1}">${s.caption}</p>`).join('')}</div>
    </div>`;
}

/**
 * Pause and play, for explaining a scene: the button, K, or a click on the picture. A scene's label goes
 * to the start of that scene, keeping it paused if it was. The speed menu slows or quickens the whole
 * animation, captions and labels with it, from where it is. Runs each time the slide is shown.
 *
 * With `controls: false` (the Explanations page, for reading rather than presenting) the pause button and
 * speed menu are taken away and the animation simply plays at normal speed; the scene buttons stay.
 */
export function wireAnimation(body: HTMLElement, { controls = true }: { controls?: boolean } = {}): void {
  const box = body.querySelector<HTMLElement>('.anim');
  if (!box) return;
  if (!controls) {
    box.querySelectorAll('.anim-toggle, .anim-speed').forEach((el) => el.remove());
    box.classList.add('no-controls');
  }
  const all = () => box.getAnimations({ subtree: true });
  // A caption too long for its strip (Tamil can be) is set smaller until it fits; again once fonts load.
  const fitCaptions = () => box.querySelectorAll<HTMLElement>('.anim-caps p').forEach((p) => {
    p.style.fontSize = '';
    const text = document.createRange();
    text.selectNodeContents(p);
    for (let size = parseFloat(getComputedStyle(p).fontSize); text.getBoundingClientRect().height > p.getBoundingClientRect().height + 1 && size > 16; size -= 1) {
      p.style.fontSize = `${size - 1}px`;
    }
  });
  fitCaptions();
  void document.fonts?.ready.then(() => { if (box.isConnected) fitCaptions(); });
  box.querySelectorAll<HTMLButtonElement>('[data-at]').forEach((b) => b.addEventListener('click', () => {
    const t = Number(b.dataset.at);
    all().forEach((a) => { a.currentTime = t; });
  }));
  if (!controls) return;

  const toggle = box.querySelector<HTMLButtonElement>('.anim-toggle')!;
  const speed = box.querySelector<HTMLSelectElement>('.anim-speed select')!;
  const setSpeed = (r: number) => all().forEach((a) => { a.playbackRate = r; });
  setSpeed(Number(speed.value));
  speed.addEventListener('change', () => {
    setSpeed(Number(speed.value));
    try { localStorage.setItem(SPEED_KEY, speed.value); } catch { /* not remembered */ }
  });
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
}
