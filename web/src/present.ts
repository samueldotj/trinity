// Presentation mode: a teaching shown as full-screen slides for teaching a group.
//
// Each slide is drawn on a fixed 1280 x 720 stage and scaled to fit the screen, so it looks the same on a
// laptop and a projector. → / Space / PageDown go forward, ← / PageUp back, Home / End to the ends; Esc (or
// Exit) leaves full screen and returns to the page.

import { esc, icon } from './util';

export type SlideKind = 'title' | 'text' | 'diagram' | 'verses' | 'heresies';

export interface Slide {
  kind: SlideKind;
  /** The slide's content: already-safe HTML. */
  html: string;
  /** Shrink `.slide-fit` text until it fits the slide. */
  fit?: boolean;
}

export interface Deck {
  /** Shown at the top of every slide but the first, e.g. "Teaching 1 · God is One". */
  where: string;
  slides: Slide[];
  /** Called after the presentation closes, with the slide it closed on. */
  onClose?: (last: Slide) => void;
}

const W = 1280, H = 720;

export function present(deck: Deck): void {
  const { slides } = deck;
  if (!slides.length) return;
  let at = 0;

  const dlg = document.createElement('dialog');
  dlg.className = 'present';
  dlg.setAttribute('aria-label', `Presentation: ${deck.where}`);
  dlg.innerHTML = `
    <div class="present-stage">
      <div class="slide" tabindex="-1">
        <header class="slide-top">
          <span class="slide-where"><span class="tri" aria-hidden="true"></span><span class="slide-where-text">${esc(deck.where)}</span></span>
          <button type="button" class="slide-exit">${icon.close}Exit <kbd>Esc</kbd></button>
        </header>
        <div class="slide-body" aria-live="polite"></div>
        <footer class="slide-foot">
          <ol class="slide-steps" aria-label="Slides">${slides.map((_, i) => `<li><button type="button" aria-label="Slide ${i + 1}"><span></span></button></li>`).join('')}</ol>
          <span class="slide-count"></span>
          <button type="button" class="slide-prev" aria-label="Previous slide">${icon.left}</button>
          <button type="button" class="slide-next" aria-label="Next slide">${icon.right}</button>
        </footer>
      </div>
    </div>`;
  document.body.appendChild(dlg);

  const stage = dlg.querySelector<HTMLElement>('.present-stage')!;
  const slideEl = dlg.querySelector<HTMLElement>('.slide')!;
  const body = dlg.querySelector<HTMLElement>('.slide-body')!;
  const count = dlg.querySelector<HTMLElement>('.slide-count')!;
  const prevBtn = dlg.querySelector<HTMLButtonElement>('.slide-prev')!;
  const nextBtn = dlg.querySelector<HTMLButtonElement>('.slide-next')!;
  const steps = [...dlg.querySelectorAll<HTMLButtonElement>('.slide-steps button')];

  const scale = () => {
    const s = Math.min(stage.clientWidth / W, stage.clientHeight / H);
    slideEl.style.transform = `translate(-50%, -50%) scale(${s})`;
  };

  // Long paragraphs (and Tamil, which runs longer) are set smaller until they fit the slide.
  const fitText = () => {
    const s = slides[at];
    if (!s.fit) return;
    const text = body.querySelector<HTMLElement>('.slide-fit');
    if (!text) return;
    text.style.fontSize = '';
    let size = parseFloat(getComputedStyle(text).fontSize);
    while (body.scrollHeight > body.clientHeight + 1 && size > 22) {
      size -= 2;
      text.style.fontSize = `${size}px`;
    }
  };

  const show = (i: number) => {
    at = Math.min(Math.max(i, 0), slides.length - 1);
    const s = slides[at];
    slideEl.dataset.kind = s.kind;
    slideEl.classList.toggle('is-dark', s.kind === 'title');
    body.innerHTML = s.html;
    count.textContent = `${at + 1} / ${slides.length}`;
    steps.forEach((b, k) => {
      b.className = k < at ? 'done' : '';
      if (k === at) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    prevBtn.disabled = at === 0;
    const last = at === slides.length - 1;
    nextBtn.classList.toggle('finish', last);
    nextBtn.innerHTML = last ? 'Finish' : icon.right;
    nextBtn.setAttribute('aria-label', last ? 'Finish the presentation' : 'Next slide');
    fitText();
  };

  const close = () => { if (dlg.open) dlg.close(); };
  const next = () => (at === slides.length - 1 ? close() : show(at + 1));

  prevBtn.addEventListener('click', () => show(at - 1));
  nextBtn.addEventListener('click', next);
  steps.forEach((b, k) => b.addEventListener('click', () => show(k)));
  dlg.querySelector('.slide-exit')!.addEventListener('click', close);

  dlg.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) {
      e.preventDefault();
      if (at < slides.length - 1) show(at + 1);
    } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) {
      e.preventDefault();
      show(at - 1);
    } else if (k === 'Home') { e.preventDefault(); show(0); }
    else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
  });

  // In full screen the browser takes the first Esc to leave full screen: that ends the presentation too.
  const onFullscreen = () => { if (!document.fullscreenElement) close(); };
  const ro = new ResizeObserver(scale);
  window.addEventListener('hashchange', close);  // a key word or verse link was followed
  dlg.addEventListener('close', () => {
    ro.disconnect();
    window.removeEventListener('hashchange', close);
    document.removeEventListener('fullscreenchange', onFullscreen);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    dlg.remove();
    deck.onClose?.(slides[at]);
  });

  dlg.showModal();
  ro.observe(stage);
  scale();
  show(0);
  slideEl.focus();
  void document.fonts?.ready.then(() => { if (dlg.open) fitText(); });

  // The dialog itself goes full screen, so it stays above the page.
  if (dlg.requestFullscreen && !document.fullscreenElement) {
    dlg.requestFullscreen({ navigationUI: 'hide' })
      .then(() => document.addEventListener('fullscreenchange', onFullscreen))
      .catch(() => {});  // not allowed here (e.g. some webviews): present in the window instead
  }
}
