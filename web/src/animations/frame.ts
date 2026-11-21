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

/** `ms`: the loop's length, as in the .anim-t<n> rule in t<n>.css. */
export function frame(n: number, ms: number, scenes: Scene[], svg: string): string {
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
