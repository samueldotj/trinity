// Animated illustrations for presentation mode, one per teaching that has one (design canvas:
// Explanation Presentation Mode, "Slide 5 · Animated illustration"). Teaching n's is t<n>.ts, with its
// keyframes in t<n>.css: plain SVG and HTML moved by CSS, so it restarts whenever its slide is shown and,
// for readers who ask for reduced motion, stands still on its finished picture. A new t<n>.ts is found
// here by itself; nothing else needs to list it.
//
// On the Tamil page the scene labels and captions come from captions.ta.json (by teaching number, four
// of each, in scene order); the picture itself stays as drawn.

import type { Lang } from '../lang';
import { esc } from '../util';
import TAMIL from './captions.ta.json';

export { wireAnimation } from './frame';

const modules = import.meta.glob<{ default: () => string }>('./t*.ts', { eager: true });
const ANIMATIONS: Record<number, () => string> = {};
for (const [path, mod] of Object.entries(modules)) {
  const n = Number(/\/t(\d+)\.ts$/.exec(path)?.[1]);
  if (n) ANIMATIONS[n] = mod.default;
}

interface Words { labels: string[]; captions: string[] }
const TA = TAMIL as Record<string, Words>;

/** The animated illustration for teaching `n`, or null where it has none yet. */
export function animationFor(n: number, lang: Lang = 'en'): string | null {
  const html = ANIMATIONS[n]?.();
  const ta = lang === 'ta' ? TA[n] : undefined;
  if (!html || !ta) return html ?? null;
  return html
    .replace('<div class="anim anim-t', '<div class="anim is-ta anim-t')
    .replace(/(<button type="button" class="anim-step(\d)"[^>]*>)\d · [^<]*(<\/button>)/g,
      (_, open: string, i: string, close: string) => `${open.replace('<button ', '<button lang="ta" ')}${i} · ${esc(ta.labels[+i - 1])}${close}`)
    .replace(/<p class="anim-cap(\d)">[^<]*<\/p>/g,
      (_, i: string) => `<p class="anim-cap${i}" lang="ta">${esc(ta.captions[+i - 1])}</p>`);
}
