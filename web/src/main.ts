import './style.css';
import { esc } from './util';
import { renderExplanations } from './screens/explanations';
import { renderReference } from './screens/reference';
import { renderTopics } from './screens/topics';
import { renderQA } from './screens/qa';
import { renderWritings } from './screens/writings';
import { renderReader } from './screens/reader';

export type Screen = (root: HTMLElement, params: URLSearchParams) => void | Promise<void>;

const SCREENS: Record<string, { title: string; render: Screen; nav?: string }> = {
  explanations: { title: 'Explanations', render: renderExplanations, nav: 'Explanations' },
  reference: { title: 'Reference', render: renderReference, nav: 'Reference' },
  topics: { title: 'Topics', render: renderTopics, nav: 'Topics' },
  qa: { title: 'Q&A', render: renderQA, nav: 'Q&A' },
  writings: { title: 'Early Writings', render: renderWritings },
  reader: { title: 'Reader', render: renderReader },
};

const LOGO = `<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="9" r="6" fill="none" stroke="#2E5AAC" stroke-width="2"/><circle cx="9" cy="23" r="6" fill="none" stroke="#B5561C" stroke-width="2"/><circle cx="25" cy="23" r="6" fill="none" stroke="#1D7366" stroke-width="2"/></svg>`;

function header(current: string): string {
  const links = Object.entries(SCREENS)
    .filter(([, s]) => s.nav)
    .map(([id, s]) => `<a href="#/${id}"${id === current ? ' aria-current="page"' : ''}>${esc(s.nav)}</a>`)
    .join('');
  return `<div class="bar">
    <a class="brand" href="#/explanations">${LOGO}<span class="brand-name"><b>Trinity Explained</b><small>through the classical writers</small></span></a>
    <nav class="nav" aria-label="Main">${links}</nav>
  </div>`;
}

function footer(): string {
  return `<div class="bar">
    <span class="brand-name"><b>Trinity Explained</b></span>
    <nav class="row" aria-label="Footer"><a href="#/writings">Early Writings</a></nav>
    <span class="credits">Scripture: Berean Standard Bible (BSB), public domain. Classical texts: public-domain editions.</span>
  </div>`;
}

let renderId = 0;

function route(): void {
  const raw = location.hash.replace(/^#\/?/, '');
  const [name, query = ''] = raw.split('?');
  const id = name in SCREENS ? name : 'explanations';
  const screen = SCREENS[id];
  document.getElementById('site-header')!.innerHTML = header(id);
  document.title = `${screen.title} — Trinity Explained`;
  const app = document.getElementById('app')!;
  const mine = ++renderId;
  app.dataset.render = String(mine);
  const sameScreen = app.dataset.screen === id;
  app.dataset.screen = id;
  void screen.render(app, new URLSearchParams(query));
  if (!sameScreen) window.scrollTo({ top: 0 });
}

document.getElementById('site-footer')!.innerHTML = footer();
window.addEventListener('hashchange', route);
route();
