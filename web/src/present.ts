// Presentation mode: a teaching shown as full-screen slides for teaching a group.
//
// Each slide is drawn on a fixed 1280 x 720 stage and scaled to fit the screen, so it looks the same on a
// laptop and a projector. → / Space / PageDown go forward, ← / PageUp back, Home / End to the ends. Exit
// returns to the page; Esc asks first, since it is easy to press by accident.
//
// The presenter can draw on a slide with a pen (P) or highlighter (H); each slide keeps its drawing until
// the presentation ends. Clicking a key word, a verse or a heresy opens it in a thought bubble; the next
// click anywhere closes it. With the pen or highlighter on, the presenter draws over the bubble instead,
// and that drawing goes when the bubble closes.

import { esc, icon } from './util';

export type SlideKind = 'title' | 'text' | 'diagram' | 'verses' | 'heresies';

export interface Slide {
  kind: SlideKind;
  /** The slide's content: already-safe HTML. */
  html: string;
  /** Shrink `.slide-fit` text until it fits the slide. */
  fit?: boolean;
  /** Runs after the slide is drawn, e.g. to size a picture to the room it has. */
  onShow?: (body: HTMLElement) => void;
}

/** What a thought bubble shows: a key word's definition or a verse's text. */
export interface Bubble {
  title: string;
  /** Already-safe HTML. */
  html: string;
  /** A line under the title, e.g. a heresy's date, place and founder. */
  meta?: string;
  /** A line under the text, e.g. the Bible translation. */
  cite?: string;
  /** Longer text: a wider bubble. */
  wide?: boolean;
  lang?: string;
}

export interface Deck {
  /** Shown at the top of every slide but the first, e.g. "Teaching 1", then the `title`, "God is One". */
  where: string;
  title: string;
  slides: Slide[];
  /** The bubble for a link on a slide, or null to follow the link as usual. */
  explain?: (link: HTMLAnchorElement) => Bubble | null;
  /** Called after the presentation closes, with the slide it closed on. */
  onClose?: (last: Slide) => void;
}

const W = 1280, H = 720, INK_SCALE = 2;

type Tool = 'pen' | 'marker' | null;
/** `onBubble`: drawn while a bubble was open, so it is cleared when the bubble closes. */
interface Stroke { tool: 'pen' | 'marker'; color: string; points: [number, number][]; onBubble?: boolean }

const PEN_COLORS = [
  { name: 'Red', value: '#D42A3C' },
  { name: 'Blue', value: '#2849B8' },
  { name: 'Green', value: '#157A6E' },
];
const MARKER = '#FFD43B';

const toolIcon = {
  pen: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14.5 6.5l3 3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  marker: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 15l-3 3v2h5l2-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 15l8.5-8.5a2.1 2.1 0 0 1 3 3L12 18z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 21h18" stroke="#E0B000" stroke-width="3" stroke-linecap="round"/></svg>',
  undo: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7L4 12l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12h10a6 6 0 0 1 0 12h-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" transform="translate(0 -4)"/></svg>',
  clear: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

export function present(deck: Deck): void {
  const { slides } = deck;
  if (!slides.length) return;
  let at = 0;

  const dlg = document.createElement('dialog');
  dlg.className = 'present';
  dlg.setAttribute('aria-label', `Presentation: ${deck.where}, ${deck.title}`);
  dlg.innerHTML = `
    <div class="present-stage">
      <div class="slide" tabindex="-1">
        <header class="slide-top">
          <span class="slide-where"><span class="tri" aria-hidden="true"></span><span class="slide-where-text">${esc(deck.where)} · <span class="slide-where-title">${esc(deck.title)}</span></span></span>
          <div class="slide-tools" role="toolbar" aria-label="Drawing">
            <button type="button" class="ink-tool" data-tool="pen" aria-pressed="false" aria-label="Pen (P)" title="Pen (P)">${toolIcon.pen}</button>
            <span class="ink-colors" hidden>${PEN_COLORS.map((c, i) => `<button type="button" class="ink-color" data-color="${c.value}" aria-pressed="${i === 0}" aria-label="${c.name} pen" style="--ink: ${c.value}"><span></span></button>`).join('')}</span>
            <button type="button" class="ink-tool" data-tool="marker" aria-pressed="false" aria-label="Highlighter (H)" title="Highlighter (H)">${toolIcon.marker}</button>
            <button type="button" class="ink-undo" aria-label="Undo (Ctrl+Z)" title="Undo (Ctrl+Z)" disabled>${toolIcon.undo}</button>
            <button type="button" class="ink-clear" aria-label="Clear this slide's drawing" title="Clear drawing" disabled>${toolIcon.clear}</button>
          </div>
          <button type="button" class="slide-exit">${icon.close}Exit <kbd>Esc</kbd></button>
        </header>
        <div class="slide-body" aria-live="polite"></div>
        <canvas class="slide-ink" width="${W * INK_SCALE}" height="${H * INK_SCALE}" aria-hidden="true"></canvas>
        <footer class="slide-foot">
          <ol class="slide-steps" aria-label="Slides">${slides.map((_, i) => `<li><button type="button" aria-label="Slide ${i + 1}"><span></span></button></li>`).join('')}</ol>
          <span class="slide-count"></span>
          <button type="button" class="slide-prev" aria-label="Previous slide">${icon.left}</button>
          <button type="button" class="slide-next" aria-label="Next slide">${icon.right}</button>
        </footer>
      </div>
    </div>`;
  document.body.appendChild(dlg);

  const $ = <T extends Element>(sel: string) => dlg.querySelector<T>(sel)!;
  const stage = $<HTMLElement>('.present-stage');
  const slideEl = $<HTMLElement>('.slide');
  const body = $<HTMLElement>('.slide-body');
  const count = $<HTMLElement>('.slide-count');
  const prevBtn = $<HTMLButtonElement>('.slide-prev');
  const nextBtn = $<HTMLButtonElement>('.slide-next');
  const steps = [...dlg.querySelectorAll<HTMLButtonElement>('.slide-steps button')];

  const scale = () => {
    const s = Math.min(stage.clientWidth / W, stage.clientHeight / H);
    slideEl.style.transform = `translate(-50%, -50%) scale(${s})`;
  };
  /** A point on the screen, in the slide's own 1280 x 720 pixels. */
  const toSlide = (x: number, y: number): [number, number] => {
    const r = slideEl.getBoundingClientRect();
    return [(x - r.left) * W / r.width, (y - r.top) * H / r.height];
  };

  // Long paragraphs (and Tamil, which runs longer) are set smaller until they fit the slide.
  const fitText = () => {
    if (!slides[at].fit) return;
    const text = body.querySelector<HTMLElement>('.slide-fit');
    if (!text) return;
    text.style.fontSize = '';
    let size = parseFloat(getComputedStyle(text).fontSize);
    while (body.scrollHeight > body.clientHeight + 1 && size > 22) {
      size -= 2;
      text.style.fontSize = `${size}px`;
    }
  };

  // ---------- drawing ----------
  const canvas = $<HTMLCanvasElement>('.slide-ink');
  const ctx = canvas.getContext('2d')!;
  ctx.scale(INK_SCALE, INK_SCALE);
  const ink: Stroke[][] = slides.map(() => []);
  let tool: Tool = null, penColor = PEN_COLORS[0].value, drawing: Stroke | null = null, queued = false;
  const toolBtns = [...dlg.querySelectorAll<HTMLButtonElement>('.ink-tool')];
  const colorBtns = [...dlg.querySelectorAll<HTMLButtonElement>('.ink-color')];
  const colorsEl = $<HTMLElement>('.ink-colors');
  const undoBtn = $<HTMLButtonElement>('.ink-undo');
  const clearBtn = $<HTMLButtonElement>('.ink-clear');

  const paint = () => {
    queued = false;
    ctx.clearRect(0, 0, W, H);
    const dark = slides[at].kind === 'title';
    for (const s of ink[at]) {
      const pts = s.points;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (s.tool === 'marker') {
        // Multiplying keeps the text under the highlight dark and readable; on the dark title slide it would vanish.
        ctx.globalCompositeOperation = dark ? 'source-over' : 'multiply';
        ctx.globalAlpha = dark ? 0.35 : 0.55;
        ctx.lineWidth = 30;
        ctx.lineCap = 'butt';
      } else {
        ctx.lineWidth = 5;
      }
      ctx.strokeStyle = s.color;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      if (pts.length === 1) ctx.lineTo(pts[0][0] + 0.1, pts[0][1]);
      // Smooth the line through the midpoints of the points the pointer reported.
      for (let i = 1; i < pts.length - 1; i++) {
        const [x, y] = pts[i], [nx, ny] = pts[i + 1];
        ctx.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
      }
      if (pts.length > 1) ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
      ctx.stroke();
      ctx.restore();
    }
    undoBtn.disabled = clearBtn.disabled = !ink[at].length;
  };
  const repaint = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };

  const setTool = (t: Tool) => {
    tool = t;
    toolBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === t)));
    colorsEl.hidden = t !== 'pen';
    slideEl.classList.toggle('is-inking', !!t);
    slideEl.dataset.tool = t || '';
  };
  toolBtns.forEach((b) => b.addEventListener('click', () => setTool(tool === b.dataset.tool ? null : b.dataset.tool as Tool)));
  colorBtns.forEach((b) => b.addEventListener('click', () => {
    penColor = b.dataset.color!;
    colorBtns.forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
  }));
  const undo = () => { ink[at].pop(); repaint(); };
  undoBtn.addEventListener('click', undo);
  clearBtn.addEventListener('click', () => { ink[at] = []; repaint(); });

  canvas.addEventListener('pointerdown', (e) => {
    if (!tool || e.button !== 0) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    drawing = { tool, color: tool === 'pen' ? penColor : MARKER, points: [toSlide(e.clientX, e.clientY)], onBubble: bubbleEls.length > 0 };
    ink[at].push(drawing);
    repaint();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const events = e.getCoalescedEvents?.() ?? [e];
    for (const ev of events.length ? events : [e]) drawing.points.push(toSlide(ev.clientX, ev.clientY));
    repaint();
  });
  const endStroke = () => { drawing = null; };
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointercancel', endStroke);

  // ---------- thought bubble ----------
  let bubbleEls: HTMLElement[] = [];
  let swallowClick = false;
  function closeBubble(): void {
    const els = bubbleEls;
    if (!els.length) return;
    bubbleEls = [];
    // What was drawn on the bubble goes with it.
    if (ink[at].some((s) => s.onBubble)) { ink[at] = ink[at].filter((s) => !s.onBubble); repaint(); }
    els.forEach((el) => el.classList.add('is-leaving'));
    setTimeout(() => els.forEach((el) => el.remove()), 200);
  }
  const openBubble = (link: HTMLAnchorElement, b: Bubble) => {
    closeBubble();
    // A link that is a whole card (a heresy) points from the text of its name, which leaves room beside it.
    const name = link.querySelector('b');
    const range = document.createRange();
    if (name) range.selectNodeContents(name);
    const r = name ? range.getBoundingClientRect() : link.getBoundingClientRect();
    const [x1, y1] = toSlide(r.left, r.top), [x2, y2] = toSlide(r.right, r.bottom);
    const ax = (x1 + x2) / 2;

    const card = document.createElement('div');
    card.className = 'bubble';
    card.setAttribute('role', 'note');
    if (b.lang) card.lang = b.lang;
    if (b.wide) card.classList.add('is-wide');
    card.innerHTML = `<p class="bubble-title">${esc(b.title)}</p>${b.meta ? `<p class="bubble-meta">${esc(b.meta)}</p>` : ''}<div class="bubble-text">${b.html}</div>${b.cite ? `<p class="bubble-cite">${esc(b.cite)}</p>` : ''}`;
    slideEl.appendChild(card);
    // Where it goes, in order: above or below the word at full size; beside it (left or right, whichever
    // has more room), its text made smaller if need be; else on the larger of above and below, smaller still.
    // Never over the word itself, the slide's edges or its controls.
    const gap = 56, top = 84, bottom = H - 84, edge = 48;
    const text = card.querySelector<HTMLElement>('.bubble-text')!;
    const size = (w: number) => { card.style.width = `${w}px`; return card.offsetHeight; };
    let side: 'above' | 'below' | 'left' | 'right';
    const full = b.wide ? 780 : 640;
    let h = size(full);
    if (y1 - gap - h >= top) side = 'above';
    else if (y2 + gap + h <= bottom) side = 'below';
    else {
      const roomL = x1 - gap - edge, roomR = W - edge - x2 - gap;
      const sideW = Math.min(full, Math.max(roomL, roomR));
      const shrinkTo = (room: number) => {
        for (let f = parseFloat(getComputedStyle(text).fontSize); h > room && f > 18; f -= 2) {
          text.style.fontSize = `${f - 2}px`;
          h = card.offsetHeight;
        }
        return h <= room;
      };
      if (sideW >= 400 && (h = size(sideW), shrinkTo(bottom - top))) side = roomL >= roomR ? 'left' : 'right';
      else {
        text.style.fontSize = '';
        side = y1 - top >= bottom - y2 ? 'above' : 'below';
        const room = side === 'above' ? y1 - gap - top : bottom - y2 - gap;
        h = size(860);
        shrinkTo(room);
      }
    }
    const w = card.offsetWidth;
    const clampX = (x: number) => Math.min(Math.max(x, edge), W - edge - w);
    const clampY = (y: number) => Math.min(Math.max(y, top), bottom - h);
    const ay = (y1 + y2) / 2;
    const [left, want] =
      side === 'above' ? [clampX(ax - w / 2), y1 - gap - h]
      : side === 'below' ? [clampX(ax - w / 2), y2 + gap]
      : side === 'left' ? [x1 - gap - w, ay - h / 2]
      : [x2 + gap, ay - h / 2];
    // Always inside the slide, even if (with very long text) that means covering the word.
    const ty = h > bottom - top ? top : clampY(want);
    card.style.left = `${left}px`;
    card.style.top = `${ty}px`;
    // The bubble grows out of the point on its edge nearest the word; the puffs lead there from the word.
    const vertical = side === 'above' || side === 'below';
    const ex = vertical ? Math.min(Math.max(ax, left + 48), left + w - 48) : side === 'left' ? left + w : left;
    const ey = vertical ? (side === 'above' ? ty + h : ty) : Math.min(Math.max(ay, ty + 48), ty + h - 48);
    card.style.transformOrigin = `${ex - left}px ${ey - ty}px`;
    const sx = vertical ? ax : side === 'left' ? x1 - 6 : x2 + 6;
    const sy = vertical ? (side === 'above' ? y1 - 6 : y2 + 6) : ay;
    const puffs = [[0.3, 14], [0.66, 24]].map(([t, d], i) => {
      const p = document.createElement('span');
      p.className = 'bubble-puff';
      p.style.cssText = `left: ${sx + (ex - sx) * t - d / 2}px; top: ${sy + (ey - sy) * t - d / 2}px; width: ${d}px; height: ${d}px; animation-delay: ${i * 70}ms`;
      slideEl.appendChild(p);
      return p;
    });
    bubbleEls = [...puffs, card];
  };

  // While a bubble is open, the next press anywhere closes it and does nothing else; but the drawing
  // tools stay usable, so the presenter can pick up the pen and draw on the bubble itself.
  dlg.addEventListener('pointerdown', (e) => {
    if (!bubbleEls.length) return;
    const t = e.target as Element;
    if (t.closest('.slide-tools') || (tool && t === canvas)) return;
    e.preventDefault();
    e.stopPropagation();
    swallowClick = true;
    closeBubble();
  }, true);
  dlg.addEventListener('click', (e) => {
    if (swallowClick) {
      swallowClick = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const a = (e.target as Element).closest<HTMLAnchorElement>('.slide-body a[href]');
    const b = a && deck.explain?.(a);
    if (a && b) {
      e.preventDefault();
      openBubble(a, b);
    }
  }, true);

  // ---------- slides ----------
  const show = (i: number) => {
    closeBubble();
    at = Math.min(Math.max(i, 0), slides.length - 1);
    const s = slides[at];
    slideEl.dataset.kind = s.kind;
    slideEl.classList.toggle('is-dark', s.kind === 'title');
    body.innerHTML = s.html;
    // No hover tooltips while presenting: a click opens the bubble instead.
    body.querySelectorAll('a[title]').forEach((a) => a.removeAttribute('title'));
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
    s.onShow?.(body);
    paint();
  };

  const close = () => { if (dlg.open) dlg.close(); };
  const next = () => (at === slides.length - 1 ? close() : show(at + 1));

  prevBtn.addEventListener('click', () => show(at - 1));
  nextBtn.addEventListener('click', next);
  steps.forEach((b, k) => b.addEventListener('click', () => show(k)));
  $('.slide-exit').addEventListener('click', close);

  // ---------- leaving ----------
  // Esc is easy to press by accident, so it asks first. The Exit and Finish buttons leave at once.
  const ask = document.createElement('div');
  ask.className = 'present-ask';
  ask.hidden = true;
  ask.innerHTML = `<div class="present-ask-card" role="alertdialog" aria-modal="true" aria-labelledby="present-ask-h" aria-describedby="present-ask-p">
      <h2 id="present-ask-h">Leave the presentation?</h2>
      <p id="present-ask-p"></p>
      <div class="present-ask-actions">
        <button type="button" class="btn primary present-keep">Keep presenting</button>
        <button type="button" class="btn present-leave">Exit</button>
      </div>
    </div>`;
  dlg.appendChild(ask);
  const keepBtn = ask.querySelector<HTMLButtonElement>('.present-keep')!;
  let wasFullscreen = false;
  const askToLeave = () => {
    closeBubble();
    ask.querySelector('p')!.textContent = ink.some((s) => s.length)
      ? 'Your drawings on the slides will be cleared.'
      : 'You can come back to it with the Present button.';
    ask.hidden = false;
    keepBtn.focus();
  };
  const keepPresenting = () => {
    ask.hidden = true;
    slideEl.focus();
    // If Esc took the browser out of full screen, this click is allowed to put it back.
    if (wasFullscreen && !document.fullscreenElement) goFullscreen();
  };
  keepBtn.addEventListener('click', keepPresenting);
  ask.querySelector('.present-leave')!.addEventListener('click', close);
  // Esc first closes an open bubble, then puts the pen down, then asks.
  const onEscape = () => {
    if (!ask.hidden) keepPresenting();
    else if (bubbleEls.length) closeBubble();
    else if (tool) setTool(null);
    else askToLeave();
  };

  dlg.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'Escape') { e.preventDefault(); onEscape(); return; }
    if (!ask.hidden) return;  // the question's own buttons take Enter, Space and Tab
    if ((e.ctrlKey || e.metaKey) && !e.altKey && k.toLowerCase() === 'z') { e.preventDefault(); undo(); return; }
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) {
      e.preventDefault();
      if (at < slides.length - 1) show(at + 1);
    } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) {
      e.preventDefault();
      show(at - 1);
    } else if (k === 'Home') { e.preventDefault(); show(0); }
    else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
    else if (k === 'p' || k === 'P') setTool(tool === 'pen' ? null : 'pen');
    else if (k === 'h' || k === 'H') setTool(tool === 'marker' ? null : 'marker');
  });
  // The keydown above normally stops Esc from closing the dialog; this catches any other way it is asked to.
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); onEscape(); });

  // In full screen the browser keeps Esc for itself where it can't be locked (see goFullscreen): leaving
  // full screen then asks too, and "Keep presenting" goes back into it.
  const onFullscreen = () => { if (!document.fullscreenElement && dlg.open && ask.hidden) askToLeave(); };
  const ro = new ResizeObserver(scale);
  window.addEventListener('hashchange', close);  // a link was followed
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
  void document.fonts?.ready.then(() => { if (dlg.open) { fitText(); slides[at].onShow?.(body); } });

  // The dialog itself goes full screen, so it stays above the page. Where the browser allows it (Chrome,
  // Edge), Esc is locked so the page receives it and can ask; leaving full screen then takes holding Esc.
  function goFullscreen(): void {
    if (!dlg.requestFullscreen || document.fullscreenElement) return;
    dlg.requestFullscreen({ navigationUI: 'hide' })
      .then(() => {
        wasFullscreen = true;
        document.addEventListener('fullscreenchange', onFullscreen);
        const kb = (navigator as Navigator & { keyboard?: { lock?: (keys: string[]) => Promise<void> } }).keyboard;
        return kb?.lock?.(['Escape']);
      })
      .catch(() => {});  // not allowed here (e.g. some webviews): present in the window instead
  }
  goFullscreen();
}
