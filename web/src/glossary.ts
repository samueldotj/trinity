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

// Tamil: the wordings come from the fixed Tamil terms themselves. Tamil adds endings to a word, so a
// wording matches at the start of a word and may run on. A term ending in a bare consonant (்) also
// matches with a vowel after it (ஆள்தத்துவமும்), and one ending in ம் also matches its forms in த்
// (சாராம்சத்தை) and its adjective before a space (நித்திய ஜெனிப்பித்தல்). A bracketed part such as
// (பெரிகொரேசிஸ்) is only a gloss and is left out. Verb roots link procession and eternal generation.
const TA_ROOTS: Record<string, string[]> = { procession: ['புறப்படு'], 'eternal-generation': ['ஜெனிப்பி'] };
const taCache = new WeakMap<Glossary, { re: RegExp; keys: { re: RegExp; key: string }[] }>();

function tamilForms(glossary: Glossary) {
  let got = taCache.get(glossary);
  if (got) return got;
  const list: { src: string; key: string; len: number }[] = [];
  for (const [key, { term }] of Object.entries(glossary)) {
    const base = esc(term.replace(/\s*\(.*\)\s*$/, '').trim());
    if (!base) continue;
    const add = (src: string, len: number) => list.push({ src, key, len });
    add(escapeRe(base), base.length);
    if (base.endsWith('்')) add(`${escapeRe(base.slice(0, -1))}(?=\\p{M})`, base.length - 1);
    if (base.endsWith('ம்')) {
      add(escapeRe(`${base.slice(0, -2)}த்`), base.length);
      add(`${escapeRe(base.slice(0, -2))}(?=\\s)`, base.length - 2);
    }
    for (const root of TA_ROOTS[key] || []) add(escapeRe(root), root.length);
  }
  list.sort((a, b) => b.len - a.len);  // longest first, so a whole phrase wins over a word inside it
  const lead = '(?<![\\p{L}\\p{M}\\p{N}])';
  got = {
    // The link takes in the rest of the word too, so it never ends partway through a letter.
    re: new RegExp(`${lead}(?:${list.map((f) => f.src).join('|')})[\\p{L}\\p{M}]*`, 'gu'),
    keys: list.map((f) => ({ re: new RegExp(`^(?:${f.src})`, 'u'), key: f.key })),
  };
  taCache.set(glossary, got);
  return got;
}

/**
 * Like `linkTerms`, for Tamil text and the Tamil glossary; the links open the Key words page in Tamil.
 * With `english` (the English glossary), each linked word is followed by its English term in brackets.
 */
export function linkTermsTa(text: string, glossary: Glossary, seen: Set<string>, from?: number, english?: Glossary): string {
  const { re, keys } = tamilForms(glossary);
  const html = esc(text);
  return html.replace(re, (found, offset: number) => {
    const key = keys.find((k) => k.re.test(html.slice(offset)))?.key;
    if (!key || seen.has(key)) return found;
    seen.add(key);
    // The English term links to the English Key words entry, with the English definition as its tooltip.
    const en = english?.[key] ? ` <span class="term-en" lang="en">(<a class="term-link" href="${href('keywords', { term: key, from, lang: 'en' })}" title="${esc(english[key].def)}">${esc(english[key].term)}</a>)</span>` : '';
    return `<a class="term-link" href="${href('keywords', { term: key, from, lang: 'ta' })}" title="${esc(glossary[key].def)}">${found}</a>${en}`;
  });
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
