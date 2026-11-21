// Animated illustrations for presentation mode, one per teaching that has one (design canvas:
// Explanation Presentation Mode, "Slide 5 · Animated illustration"). Teaching n's is t<n>.ts, with its
// keyframes in t<n>.css: plain SVG and HTML moved by CSS, so it restarts whenever its slide is shown and,
// for readers who ask for reduced motion, stands still on its finished picture. A new t<n>.ts is found
// here by itself; nothing else needs to list it.

export { wireAnimation } from './frame';

const modules = import.meta.glob<{ default: () => string }>('./t*.ts', { eager: true });
const ANIMATIONS: Record<number, () => string> = {};
for (const [path, mod] of Object.entries(modules)) {
  const n = Number(/\/t(\d+)\.ts$/.exec(path)?.[1]);
  if (n) ANIMATIONS[n] = mod.default;
}

/** The animated illustration for teaching `n`, or null where it has none yet. */
export function animationFor(n: number): string | null {
  return ANIMATIONS[n]?.() ?? null;
}
