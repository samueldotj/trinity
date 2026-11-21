// A small, safe subset of Markdown for the AI-written text you can edit: paragraphs (a blank line),
// line breaks (a single newline), **bold** and *italic* (or _italic_). Nothing else is special, and all
// other text is escaped, so an edit can never add raw HTML.
//
// `inline` turns one paragraph's plain text into HTML; it must escape it. The default only escapes;
// the teachings pass their key-word linker, so links and emphasis work together.

import { esc } from './util';

type Inline = (text: string) => string;

const PARA = /\n[ \t]*\n+/;

/** Bold and italic in already-escaped HTML, leaving tags and their attributes alone. */
function emphasis(html: string): string {
  const tags: string[] = [];
  let s = html.replace(/<[^>]*>/g, (t) => `\u0000${tags.push(t) - 1}\u0000`);
  s = s
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(?=\S)([\s\S]*?\S)\*/g, '<em>$1</em>')
    .replace(/(^|[^\p{L}\p{M}\p{N}_])_(?=\S)([\s\S]*?\S)_(?![\p{L}\p{M}\p{N}_])/gu, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => tags[Number(i)]);
}

const lines = (html: string) => html.replace(/[ \t]*\n[ \t]*/g, '<br>');

/** One paragraph's worth of Markdown, for text shown inside another element (a caption, a description). */
export function mdInline(text: string, inline: Inline = esc): string {
  return text.trim().split(PARA).map((p) => lines(emphasis(inline(p.trim())))).join('<br><br>');
}

/** Markdown as paragraphs: one `<p>` per paragraph, each with class `cls`. */
export function mdParas(text: string, cls: string, inline: Inline = esc): string {
  return text.trim().split(PARA).map((p) => `<p class="${cls} md-p">${lines(emphasis(inline(p.trim())))}</p>`).join('');
}

/** The text without its Markdown marks, for tooltips and other places that show plain text. */
export function mdPlain(text: string): string {
  return text
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '$1')
    .replace(/\*(?=\S)([\s\S]*?\S)\*/g, '$1')
    .replace(/(^|[^\p{L}\p{M}\p{N}_])_(?=\S)([\s\S]*?\S)_(?![\p{L}\p{M}\p{N}_])/gu, '$1$2')
    .replace(/\s*\n\s*/g, ' ')
    .trim();
}
