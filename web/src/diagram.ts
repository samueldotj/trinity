// @ts-nocheck -- ported unchanged from the design canvas (design/canvas/Main.dc.html).
// spec(n) describes the picture for teaching n; draw(n) turns it into positioned boxes, lines and labels.
export function spec(n: number): any {
  // hi: Persons lit (F S P G); spk: [which Persons join the centre, label]; e: [from, to, label, arrows '>' '<' '<>' '', kind]
  // kinds: is (solid dark), not (dashed grey), rel (blue arrow), eq (solid grey)
  // ring: eternal | spirit | unchanging | invisible | everywhere | single; box: a thing outside God; split: Son shown as God and man
  const not3 = [['F', 'S', 'is not', '', 'not'], ['F', 'P', 'is not', '', 'not'], ['S', 'P', 'is not', '', 'not']];
  const eq3 = (l) => [['F', 'S', l, '', 'eq'], ['F', 'P', l, '', 'eq'], ['S', 'P', l, '', 'eq']];
  const S = {
    1: { hi: 'G', spk: ['FSP', 'is'], n: { G: 'one God' } },
    2: { hi: 'G', spk: ['FSP', 'is'], ring: 'spirit', hollow: true, n: { G: 'Spirit' } },
    3: { hi: 'G', spk: ['FSP', 'is'], ring: 'eternal', n: { G: 'eternal' } },
    4: { hi: 'G', spk: ['FSP', 'is'], box: 'Creation', e: [['G', 'X', 'made by God', '>', 'rel']], n: { G: 'uncreated' } },
    5: { hi: 'G', spk: ['FSP', 'is'], ring: 'unchanging', n: { G: 'unchanging' } },
    6: { hi: 'G', spk: ['FSP', 'is'], ring: 'invisible', hollow: true, n: { G: 'unseen' } },
    7: { hi: 'G', spk: ['FSP', 'is'], ring: 'everywhere', n: { G: 'everywhere' } },
    8: { hi: 'G', spk: ['FSP', 'is'], ring: 'single', n: { G: 'no parts' } },
    9: { hi: 'FSPG', spk: ['FSP', 'is'], e: not3, n: { F: 'Person', S: 'Person', P: 'Person', G: 'one being' } },
    10: { hi: 'FG', spk: ['F', 'is God'] },
    11: { hi: 'SG', spk: ['S', 'is God'] },
    12: { hi: 'PG', spk: ['P', 'is God'] },
    13: { hi: 'FSP', e: not3 },
    14: { hi: 'FS', e: [['F', 'S', 'is not', '', 'not']] },
    15: { hi: 'SP', e: [['S', 'P', 'is not', '', 'not']] },
    16: { hi: 'FP', e: [['F', 'P', 'is not', '', 'not']] },
    17: { hi: 'FSPG', spk: ['FSP', 'fully God'], n: { G: 'not ⅓ each' } },
    18: { hi: 'FSP', e: eq3('always'), n: { F: 'eternal', S: 'eternal', P: 'eternal' } },
    19: { hi: 'FSP', e: eq3('='), n: { F: 'equal', S: 'equal', P: 'equal' } },
    20: { hi: 'FSP', e: not3, n: { F: '1', S: '2', P: '3', G: 'not one Person in three roles' } },
    21: { hi: 'FSP', e: [['F', 'S', 'in', '<>', 'rel'], ['F', 'P', 'in', '<>', 'rel'], ['S', 'P', 'in', '<>', 'rel']] },
    22: { hi: 'FS', e: [['F', 'S', 'always Father of', '>', 'rel']], n: { F: 'always Father', S: 'always Son' } },
    23: { hi: 'FS', e: [['F', 'S', 'begets', '>', 'rel']], n: { F: 'unbegotten', S: 'begotten, not made' } },
    24: { hi: 'FSP', e: [['F', 'P', 'proceeds from', '>', 'rel'], ['S', 'P', 'and the Son', '>', 'rel']], n: { P: 'proceeds' } },
    25: { hi: 'FSP', e: [['F', 'S', 'begets', '>', 'rel'], ['F', 'P', 'proceeds', '>', 'rel'], ['S', 'P', 'proceeds', '>', 'rel']], n: { F: 'unbegotten', S: 'begotten', P: 'proceeds', G: 'one nature' } },
    26: { hi: 'FS', e: [['F', 'S', 'loves', '>', 'rel']], n: { F: 'loves', S: 'beloved' } },
    27: { hi: 'FS', e: [['F', 'S', 'one glory', '<>', 'rel']], n: { F: 'glory', S: 'glory' } },
    28: { hi: 'FSPG', spk: ['FSP', 'one will'], n: { G: 'one will' } },
    29: { hi: 'FSPG', e: [['F', 'S', 'through', '>', 'rel'], ['S', 'P', 'in', '>', 'rel'], ['G', 'X', 'one act', '>', 'rel']], box: 'One work', n: { F: 'from', S: 'through', P: 'in' } },
    30: { hi: 'FSP', spk: ['FSP', 'is'], e: eq3('=') },
    31: { hi: 'FS', e: [['F', 'S', 'sends', '>', 'rel'], ['S', 'X', 'comes', '>', 'rel']], box: 'The world', hideG: true },
    32: { hi: 'FSP', e: [['F', 'P', 'sends', '>', 'rel'], ['S', 'P', 'sends', '>', 'rel'], ['P', 'X', 'given', '>', 'rel']], box: 'The Church', hideG: true },
    33: { hi: 'FS', e: [['F', 'S', 'seen in', '>', 'eq'], ['S', 'X', 'makes the Father known', '>', 'rel']], box: 'Us', hideG: true },
    34: { hi: 'SP', e: [['P', 'S', 'glorifies', '>', 'rel']] },
    35: { hi: 'FS', e: [['S', 'F', 'prays to', '>', 'rel']] },
    36: { hi: 'FS', e: [['F', 'S', 'speaks to', '>', 'rel']], n: { S: 'beloved Son' } },
    37: { hi: 'P', e: [['P', 'X', 'speaks · teaches · wills', '>', 'rel']], box: 'The Church', hideG: true, n: { P: 'a Person' } },
    38: { hi: 'FSPG', e: [['F', 'S', 'through', '>', 'rel'], ['S', 'P', 'by', '>', 'rel'], ['G', 'X', 'creates', '>', 'rel']], box: 'All creation', n: { F: 'from', S: 'through', P: 'by' } },
    39: { hi: 'FSP', e: [['F', 'X', 'chooses', '>', 'rel'], ['S', 'X', 'redeems', '>', 'rel'], ['P', 'X', 'seals', '>', 'rel']], box: 'Believers', hideG: true },
    40: { hi: 'FSP', e: [['F', 'X', '', '', 'is'], ['S', 'X', '', '', 'is'], ['P', 'X', '', '', 'is']], box: 'One name', hideG: true },
    41: { hi: 'S', e: [['S', 'X', 'became flesh', '>', 'rel']], box: 'Human nature', hideG: true, n: { F: 'not incarnate', P: 'not incarnate' } },
    42: { hi: 'SG', split: true, spk: ['S', 'still God'], e: [['S', 'X', 'took on', '>', 'rel']], box: 'Human nature' },
    43: { hi: 'S', split: true, e: [['S', 'X', 'united', '', 'is']], box: 'Human nature', hideG: true, n: { S: 'one Person' } },
    44: { hi: 'S', split: true, e: [['S', 'X', 'took on in time', '>', 'rel']], box: 'Human nature (created)', hideG: true, n: { S: 'eternal God' } },
    45: { hi: 'FS', e: [['S', 'X', 'suffered as man', '>', 'rel'], ['F', 'X', 'did not suffer', '', 'not']], box: 'The cross', hideG: true, split: true },
    46: { hi: 'SG', split: true, spk: ['S', 'unchanged'], e: [['S', 'X', 'added', '>', 'rel']], box: 'Human nature' }
  };
  return S[n] || S[1];
}
// Two layouts. wide: the design canvas (480 x 510 drawing in a 500 x 516 frame).
// compact: for phones — a narrower triangle (360 x 510 drawing in a 372 x 516 frame) with larger text,
// so that once it is scaled down to a phone's width the labels stay readable.
export const LAYOUT = {
  wide: { w: 500, h: 516, ix: 10, iy: 6, iw: 480, ih: 510 },
  compact: { w: 372, h: 516, ix: 6, iy: 6, iw: 360, ih: 510 }
};
export function draw(n: number, fallbackNotes: string[], caption = '', compact = false): any {
  const sp = spec(n);
  const P = compact
    ? { F: [180, 66, 50], S: [66, 326, 50], P: [294, 326, 50], G: [180, 222, 48], X: [180, 466, 30] }
    : { F: [240, 72, 54], S: [86, 330, 54], P: [394, 330, 54], G: [240, 228, 48], X: [240, 466, 30] };
  const cx = compact ? 180 : 240;
  // Font sizes in drawing pixels: names, God's name, notes inside the circles, line labels, the box.
  const fs = compact ? { name: 22, god: 24, note: 14, label: 14, box: 16 } : { name: 20, god: 22, note: 11, label: 12, box: 15 };
  const COL = { is: '#1B1E27', not: '#6B7080', rel: '#33449A', eq: '#6B7080', faint: '#C9C5BB' };
  const hi = sp.hi || '';
  // A Person the teaching is not about is drawn in a pale tint of its colour with dark text, not faded
  // with opacity: faded white-on-colour text measured 1.6:1, while every tint/ink pair here is at
  // least 6.8:1 (WCAG AA needs 4.5:1). Full fills all carry white text at 5.2:1 or more.
  const DIM = {
    F: { bg: '#E6EBF5', border: '#96ACD6', ink: '#22437F' },
    S: { bg: '#F5EAE3', border: '#D6A68B', ink: '#7E3A10', split: 'linear-gradient(90deg, #F5EAE3 50%, #F0E7E2 50%)' },
    P: { bg: '#E3EFEE', border: '#8ABCB6', ink: '#0E5A51' },
    G: { bg: '#E3E3E6', border: '#888B95', ink: '#12172B' }
  };
  const isDim = (k) => !!hi && hi.indexOf(k) < 0;
  const nodeState = (k) => (sp.hideG && k === 'G') ? 'display: none;' : (hi.indexOf(k) >= 0 ? 'box-shadow: 0 0 0 6px rgba(51,68,154,0.16);' : '');
  const node = (k, bg, border, fg) => {
    const [x, y, r] = P[k];
    if (isDim(k)) {
      const d = DIM[k];
      bg = k === 'S' && sp.split ? d.split : (k === 'G' && sp.hollow ? '#FFFFFF' : d.bg);
      border = d.border;
      fg = d.ink;
    }
    return 'position: absolute; left: ' + (x - r) + 'px; top: ' + (y - r) + 'px; width: ' + 2 * r + 'px; height: ' + 2 * r + 'px; box-sizing: border-box; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 8px; gap: 2px; z-index: 2; background: ' + bg + '; border: 2px solid ' + border + '; color: ' + fg + '; ' + nodeState(k);
  };
  const edges = [], labels = [];
  const seg = (a, b, label, dir, kind) => {
    const [x1, y1, r1] = P[a], [x2, y2, r2] = P[b];
    const dx = x2 - x1, dy = y2 - y1, d = Math.sqrt(dx * dx + dy * dy), ux = dx / d, uy = dy / d;
    const sx = x1 + ux * (r1 + 4), sy = y1 + uy * (r1 + 4), len = d - r1 - r2 - 8;
    const ang = Math.atan2(dy, dx) * 180 / Math.PI;
    const c = COL[kind];
    const thick = kind === 'faint' ? 2 : 3;
    const paint = kind === 'not'
      ? 'background: repeating-linear-gradient(90deg, ' + c + ' 0 8px, transparent 8px 14px);'
      : 'background: ' + c + ';';
    const arrow = (side) => 'position: absolute; top: 50%; ' + side + ': -2px; width: 0; height: 0; transform: translateY(-50%); border-top: 7px solid transparent; border-bottom: 7px solid transparent; ' +
      (side === 'right' ? 'border-left: 12px solid ' : 'border-right: 12px solid ') + c + ';';
    edges.push({
      line: 'position: absolute; z-index: 1; left: ' + sx + 'px; top: ' + (sy - thick / 2) + 'px; width: ' + len + 'px; height: ' + thick + 'px; transform-origin: 0 50%; transform: rotate(' + ang + 'deg); ' + paint,
      head: dir.indexOf('>') >= 0 ? arrow('right') : 'display: none;',
      tail: dir.indexOf('<') >= 0 ? arrow('left') : 'display: none;'
    });
    if (label) {
      const mx = sx + ux * len / 2, my = sy + uy * len / 2;
      labels.push({ text: label, style: 'position: absolute; z-index: 3; left: ' + mx + 'px; top: ' + my + 'px; transform: translate(-50%, -50%); white-space: nowrap; padding: 2px 8px; border-radius: 999px; background: #FFFFFF; border: 1px solid ' + c + '; color: ' + (kind === 'faint' ? '#5A5F6B' : c) + '; font-size: ' + fs.label + 'px; font-weight: 600;' });
    }
  };
  const list = sp.e || [];
  const has = (a, b) => list.some((e) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a));
  [['F', 'S'], ['F', 'P'], ['S', 'P']].forEach(([a, b]) => { if (!has(a, b)) seg(a, b, '', '', 'faint'); });
  if (sp.spk && !sp.hideG) sp.spk[0].split('').forEach((k) => seg('G', k, sp.spk[1], '', 'is'));
  list.forEach((e) => seg(e[0], e[1], e[2], e[3], e[4]));
  // Single rings are centred on the middle of the triangle (y 244) and sized so their inside edge
  // clears every Person's circle by about 12px; the "everywhere" ripples stay centred on God.
  // In the compact layout the rings become upright ellipses, keeping the same clearance around the Persons.
  const ringBase = (r, extra, cy = 244) => {
    const rx = compact ? r * 186 / 250 : r;
    return 'position: absolute; z-index: 0; box-sizing: border-box; left: ' + (cx - rx) + 'px; top: ' + (cy - r) + 'px; width: ' + 2 * rx + 'px; height: ' + 2 * r + 'px; border-radius: 50%; ' + extra;
  };
  const RINGS = {
    eternal: [[250, 'border: 4px solid #33449A;']],
    spirit: [[250, 'border: 3px dotted #33449A;']],
    unchanging: [[250, 'border: 6px double #33449A;']],
    invisible: [[250, 'border: 2px dashed #9AA0AD;']],
    everywhere: [[150, 'border: 2px solid rgba(51,68,154,0.35);', 228], [190, 'border: 2px solid rgba(51,68,154,0.25);', 228], [228, 'border: 2px solid rgba(51,68,154,0.15);', 228]],
    single: [[250, 'border: 7px solid #1B1E27;']]
  };
  const RLABEL = { eternal: 'no beginning · no end', spirit: 'no body · no parts', unchanging: 'does not change', invisible: 'cannot be seen', everywhere: 'not limited by space', single: 'one, undivided' };
  const notes = Object.assign({ F: fallbackNotes[0] || '', S: fallbackNotes[1] || '', P: fallbackNotes[2] || '', G: fallbackNotes[3] || '' }, sp.n || {});
  if (!sp.n && sp.spk) { notes.F = notes.S = notes.P = ''; }
  // The Son's fill is a shade darker than the brand orange (#C2581B, 4.46:1 with white) so white text passes.
  const sonBg = sp.split ? 'linear-gradient(90deg, #AE4C17 50%, #7E3A10 50%)' : '#AE4C17';
  const gHollow = sp.hollow;
  const alt = 'Diagram: ' + caption;
  return {
    alt, cap: caption, edges, labels, fs,
    rings: (RINGS[sp.ring] || []).map(([r, css, cy]) => ({ style: ringBase(r, css, cy) })),
    hasRingLabel: !!sp.ring, ringLabel: RLABEL[sp.ring] || '',
    ringLabelStyle: 'position: absolute; z-index: 3; left: ' + cx + 'px; top: 436px; transform: translate(-50%, -50%); white-space: nowrap; padding: 3px 10px; border-radius: 999px; background: #FFFFFF; border: 1px solid #33449A; color: #33449A; font-size: ' + fs.label + 'px; font-weight: 600;',
    nF: node('F', '#2E5AAC', '#2E5AAC', '#FFFFFF'),
    nS: node('S', sonBg, '#AE4C17', '#FFFFFF'),
    nP: node('P', '#157A6E', '#157A6E', '#FFFFFF'),
    nG: node('G', gHollow ? '#FFFFFF' : '#12172B', '#12172B', gHollow ? '#12172B' : '#FFFFFF'),
    tF: notes.F, tS: sp.split && !sp.n ? 'God | man' : (sp.split ? notes.S + ' · God | man' : notes.S), tP: notes.P, tG: notes.G,
    hasBox: !!sp.box, box: sp.box || '',
    boxStyle: 'position: absolute; z-index: 2; left: ' + (cx - 110) + 'px; top: 440px; width: 220px; height: 52px; box-sizing: border-box; border-radius: 12px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 0 10px; background: #F1EEE8; border: 2px solid #9AA0AD; color: #1B1E27; font-size: ' + fs.box + 'px; font-weight: 600;'
  };
}
