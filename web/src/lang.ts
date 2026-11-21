// The reader's language for the parts of the site that have a Tamil translation: the Key words page
// and the teachings' explanations. One choice covers both, so switching on either page carries over.

export type Lang = 'en' | 'ta';

// Kept from when only the Key words page had Tamil, so readers keep the choice they made there.
const LANG_KEY = 'keywords-lang';

/** The language to show: the address says, else the reader's last choice, else English. */
export function pickLang(params: URLSearchParams): Lang {
  const asked = params.get('lang');
  if (asked === 'en' || asked === 'ta') {
    try { localStorage.setItem(LANG_KEY, asked); } catch { /* ignore */ }
    return asked;
  }
  try { return localStorage.getItem(LANG_KEY) === 'ta' ? 'ta' : 'en'; } catch { return 'en'; }
}

/** The English | தமிழ் switch. `to` gives the address of this page in the other language. */
export function langSwitch(lang: Lang, to: (l: Lang) => string): string {
  return `<nav class="lang-switch" aria-label="Language / மொழி">
      <a href="${to('en')}" lang="en"${lang === 'en' ? ' aria-current="true"' : ''}>English</a>
      <a href="${to('ta')}" lang="ta"${lang === 'ta' ? ' aria-current="true"' : ''}>தமிழ்</a>
    </nav>`;
}

/** The credit for the Tamil Bible wording, under translated text. `what` says what was translated. */
export function tamilCredit(what: string): string {
  return `<p class="kw-credit" lang="en">Tamil Bible wording follows the
      <a href="https://ebible.org/details.php?id=tam2017">Tamil Indian Revised Version (IRV)</a>,
      © 2017, 2019 Bridge Connectivity Solutions, licensed
      <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. ${what} translated from the English.</p>`;
}
