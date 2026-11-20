import './style.css';
import { esc } from './util';
import { editingAvailable, editingOn, initEditing, setEditingOn } from './edit';
import { renderExplanations } from './screens/explanations';
import { renderReference } from './screens/reference';
import { renderTopics } from './screens/topics';
import { renderQA } from './screens/qa';
import { renderWritings } from './screens/writings';
import { renderReader } from './screens/reader';
import { renderKeywords } from './screens/keywords';

export type Screen = (root: HTMLElement, params: URLSearchParams) => void | Promise<void>;

const ICONS: Record<string, string> = {
  explanations: '<path d="M10 3 3 17h14L10 3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  reference: '<path d="M4 3h9l3 3v11H4V3Z M7 8h6 M7 11h6 M7 14h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  topics: '<path d="M3 5h14 M3 10h14 M3 15h9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  qa: '<path d="M4 4h12v9H9l-4 3v-3H4V4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  keywords: '<path d="M5 3h10v14l-5-3-5 3V3Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
};

const SCREENS: Record<string, { title: string; render: Screen; nav?: string; reading?: boolean }> = {
  explanations: { title: 'Explanations', render: renderExplanations, nav: 'Explanations' },
  reference: { title: 'Reference', render: renderReference, nav: 'Reference' },
  topics: { title: 'Topics', render: renderTopics, nav: 'Topics' },
  qa: { title: 'Q&A', render: renderQA, nav: 'Q&A' },
  keywords: { title: 'Key words', render: renderKeywords, nav: 'Key words' },
  writings: { title: 'Early Writings', render: renderWritings },
  reader: { title: 'Reader', render: renderReader, reading: true },
};

const LOGO = `<svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="11" r="7" fill="#2E5AAC"/><circle cx="10.5" cy="24" r="7" fill="#C2581B" fill-opacity="0.92"/><circle cx="25.5" cy="24" r="7" fill="#157A6E" fill-opacity="0.92"/></svg>`;

function rail(current: string): string {
  const links = Object.entries(SCREENS)
    .filter(([, s]) => s.nav)
    .map(([id, s]) => `<a href="#/${id}"${id === current ? ' aria-current="page"' : ''}><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">${ICONS[id]}</svg>${esc(s.nav)}</a>`)
    .join('');
  return `<a class="brand" href="#/explanations">${LOGO}<b>Trinity<br> Explained</b></a>
    <nav class="rail-nav" aria-label="Main">${links}</nav>
    <div class="rail-foot">
      <span class="tri" aria-hidden="true"></span>
      ${editingAvailable() ? `<button type="button" class="edit-switch" id="edit-switch" aria-pressed="${editingOn()}">Edit mode: ${editingOn() ? 'on' : 'off'}<small>local only</small></button>` : ''}
      <a href="#/writings"${current === 'writings' ? ' aria-current="page"' : ''}>Early Writings →</a>
      <small>Scripture: Berean Standard Bible, public domain. Classical texts: public-domain editions.</small>
    </div>`;
}

function route(): void {
  const raw = location.hash.replace(/^#\/?/, '');
  const [name, query = ''] = raw.split('?');
  const id = name in SCREENS ? name : 'explanations';
  const screen = SCREENS[id];
  document.getElementById('rail')!.innerHTML = rail(id);
  document.getElementById('edit-switch')?.addEventListener('click', () => {
    setEditingOn(!editingOn());
    route();
  });
  document.getElementById('shell')!.classList.toggle('reading', !!screen.reading);
  document.title = `${screen.title} — Trinity Explained`;
  const app = document.getElementById('app')!;
  const sameScreen = app.dataset.screen === id;
  app.dataset.screen = id;
  void screen.render(app, new URLSearchParams(query));
  if (!sameScreen) window.scrollTo({ top: 0 });
}

window.addEventListener('hashchange', route);
void initEditing().then(route);
