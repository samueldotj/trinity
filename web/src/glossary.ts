// The key words (glossary) and how they are found in the teachings' explanations.
// The glossary itself comes with the teachings data; this file only knows which wordings
// in the text count as each key word, so the explanations can link them to the Key words page.
import { esc, href } from './util';

export interface Term { term: string; def: string; edited?: boolean }
export type Glossary = Record<string, Term>;

// Wordings that link to each key word. Longer wordings are tried first, so "eternal generation"
// wins over "eternal" and "relations of origin" is one link. "Person" links only when capitalised,
// which is how the text writes a divine Person ("a person" in the everyday sense stays plain).
const FORMS: Record<string, string[]> = {
  essence: ['essence'],
  nature: ['natures', 'nature'],
  person: ['Persons', 'Person'],
  trinity: ['Trinity', 'Triune'],
  eternal: ['eternal', 'eternally'],
  immutable: ['immutable'],
  omnipresent: ['omnipresent', 'omnipresence'],
  indivisible: ['indivisible', 'divine simplicity'],
  coeternal: ['coeternal'],
  coequal: ['coequal'],
  perichoresis: ['perichoresis', 'mutual indwelling'],
  'eternal-generation': ['eternal generation', 'eternally begotten', 'begotten', 'begetting', 'begets'],
  procession: ['procession', 'proceeds'],
  'relations-of-origin': ['relations of origin'],
  'inseparable-operations': ['inseparable operations', 'inseparably'],
  appropriation: ['appropriation'],
  incarnation: ['Incarnation', 'incarnate'],
  'hypostatic-union': ['hypostatic union', 'two natures'],
};
const CASE_SENSITIVE = new Set(['person']);

const forms = Object.entries(FORMS)
  .flatMap(([key, list]) => list.map((form) => ({ key, form })))
  .sort((a, b) => b.form.length - a.form.length);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Not inside a longer word: no letter, digit or hyphen on either side.
const MATCH = new RegExp(`(?<![\\p{L}\\p{N}-])(${forms.map((f) => escapeRe(esc(f.form))).join('|')})(?![\\p{L}\\p{N}-])`, 'giu');

function keyFor(found: string): string | undefined {
  for (const { key, form } of forms) {
    const f = esc(form);
    if (CASE_SENSITIVE.has(key) ? found === f : found.toLowerCase() === f.toLowerCase()) return key;
  }
  return undefined;
}

/** The key words that appear in `text`, in the order they first appear. */
export function termsIn(text: string, glossary: Glossary): string[] {
  const out: string[] = [];
  for (const m of esc(text).matchAll(MATCH)) {
    const key = keyFor(m[0]);
    if (key && glossary[key] && !out.includes(key)) out.push(key);
  }
  return out;
}

/**
 * Escape `text` for HTML and link the first mention of each key word to the Key words page.
 * `seen` carries over between paragraphs of one page, so a word is linked once per page.
 * `from` is the teaching the link is on, so the Key words page can link back to it.
 */
export function linkTerms(text: string, glossary: Glossary, seen: Set<string>, from?: number): string {
  return esc(text).replace(MATCH, (found) => {
    const key = keyFor(found);
    if (!key || !glossary[key] || seen.has(key)) return found;
    seen.add(key);
    return `<a class="term-link" href="${href('keywords', { term: key, from })}" title="${esc(glossary[key].def)}">${found}</a>`;
  });
}
