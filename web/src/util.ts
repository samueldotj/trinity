// Small helpers shared by the screens.

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text for HTML (content and attribute values). Every value from data goes through this. */
export function esc(v: unknown): string {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
}

/** Build a hash link: href('reference', { exact: 'John 1:1' }) -> '#/reference?exact=John+1%3A1'. */
export function href(screen: string, params: Record<string, string | number | undefined | null> = {}): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  const q = qs.toString();
  return `#/${screen}${q ? '?' + q : ''}`;
}

export function navigate(screen: string, params: Record<string, string | number | undefined | null> = {}, replace = false): void {
  const target = href(screen, params);
  if (replace) {
    history.replaceState(null, '', target);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else location.hash = target.slice(1);
}

export const icon = {
  chevron: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  left: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  right: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  small: '<svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><path d="m4 2 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

export function loading(text = 'Loading…'): string {
  return `<p class="status" role="status">${esc(text)}</p>`;
}

export function failure(e: unknown): string {
  return `<p class="status error" role="alert">Something went wrong: ${esc(e instanceof Error ? e.message : e)} Reload the page to try again.</p>`;
}

/** Debounce for search boxes. */
export function debounce<A extends unknown[]>(fn: (...a: A) => void, ms = 250): (...a: A) => void {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...a: A) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}
