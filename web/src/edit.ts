// Edit mode for the AI-written text. It exists only when the local dev server says so
// (`route=editing`); the deployed site and the desktop app are read-only.
//
// Screens wrap each editable block with `editable(...)` and call `wireEditing(root)` after
// rendering. Bible text, quotations and the books are never wrapped, and the server refuses
// any key that is not an AI-written field anyway.

import { api, saveEdit } from './api';
import { esc } from './util';

let available = false;
let on = true;
try {
  on = localStorage.getItem('edit-mode') !== 'off';
} catch { /* private mode: default on */ }

export async function initEditing(): Promise<void> {
  try {
    available = (await api<{ enabled: boolean }>('editing')).enabled === true;
  } catch {
    available = false;
  }
}

export const editingAvailable = (): boolean => available;
export const editingOn = (): boolean => available && on;

export function setEditingOn(value: boolean): void {
  on = value;
  try { localStorage.setItem('edit-mode', value ? 'on' : 'off'); } catch { /* ignore */ }
}

interface Opts {
  /** The text as shown, before any HTML is added. */
  text: string;
  /** Whether this text is already your edit rather than the generated original. */
  edited?: boolean;
  /** What the block is, for the button's accessible name: "answer", "summary"… */
  label: string;
}

/** Wrap rendered `html` so it can be edited in place. Outside edit mode it returns `html` unchanged. */
export function editable(key: string, html: string, o: Opts): string {
  if (!editingOn()) return html;
  return `<div class="editable${o.edited ? ' is-edited' : ''}" data-edit-key="${esc(key)}" data-edit-text="${esc(o.text)}" data-edited="${o.edited ? 1 : 0}">
    ${html}
    <div class="edit-tools">
      ${o.edited ? '<span class="edited-tag">Edited</span>' : '<span class="ai-tag">AI-written</span>'}
      <button type="button" class="edit-btn" aria-label="Edit ${esc(o.label)}"><svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>Edit</button>
    </div>
  </div>`;
}

/** Attach the edit buttons inside `root`. `after` re-renders the screen once an edit is saved. */
export function wireEditing(root: HTMLElement, after: () => void): void {
  if (!editingOn()) return;
  root.querySelectorAll<HTMLButtonElement>('.editable .edit-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      open(btn.closest<HTMLElement>('.editable')!, after);
    });
  });
}

function open(box: HTMLElement, after: () => void): void {
  const key = box.dataset.editKey!;
  const text = box.dataset.editText || '';
  const edited = box.dataset.edited === '1';
  const keep = box.innerHTML;
  box.classList.add('editing');
  box.innerHTML = `<form class="edit-form">
    <label class="sr-only" for="ed-${esc(key)}">Edit text</label>
    <textarea id="ed-${esc(key)}" rows="4">${esc(text)}</textarea>
    <div class="row">
      <button type="submit" class="btn primary">Save</button>
      <button type="button" class="btn" data-act="cancel">Cancel</button>
      ${edited ? '<button type="button" class="btn" data-act="restore">Restore original</button>' : ''}
      <span class="edit-status" role="status"></span>
    </div>
  </form>`;
  const form = box.querySelector('form')!;
  const area = box.querySelector('textarea')!;
  const status = box.querySelector<HTMLElement>('.edit-status')!;
  const fit = () => { area.style.height = 'auto'; area.style.height = `${area.scrollHeight + 4}px`; };
  fit();
  area.addEventListener('input', fit);
  area.focus();

  const close = () => {
    box.classList.remove('editing');
    box.innerHTML = keep;
    wireEditing(box, after);
  };
  const save = async (value: string | null) => {
    status.textContent = 'Saving…';
    form.querySelectorAll('button').forEach((b) => (b.disabled = true));
    try {
      await saveEdit(key, value);
      after();
    } catch (err) {
      status.textContent = err instanceof Error ? err.message : String(err);
      form.querySelectorAll('button').forEach((b) => (b.disabled = false));
    }
  };
  form.addEventListener('submit', (e) => { e.preventDefault(); void save(area.value); });
  form.querySelector('[data-act="cancel"]')!.addEventListener('click', close);
  form.querySelector('[data-act="restore"]')?.addEventListener('click', () => void save(null));
  area.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); void save(area.value); }
  });
}
