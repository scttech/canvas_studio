// Parser for the PlantUML-style canvas description language.
//
//   @startlean
//   title My Startup
//   segments {
//     - Busy parents #green
//   }
//   problem: Dinner takes too long
//   @endlean

import { CANVASES, findCanvasByTag, resolveSection, allSectionNames, norm, getCanvas } from './canvases.js';

export const NOTE_COLORS = ['yellow', 'green', 'blue', 'pink', 'orange', 'purple', 'gray', 'red'];
export const THEME_NAMES = ['light', 'dark', 'blueprint', 'mono'];
const DIRECTIVES = ['title', 'subtitle', 'author', 'date', 'version', 'theme'];

const HEX_TAG = /\s+#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
const NAME_TAG = new RegExp(`\\s+#(${NOTE_COLORS.join('|')})$`, 'i');

export function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

export function suggest(word, candidates) {
  const w = norm(word);
  let best = null;
  let bestD = Infinity;
  for (const c of candidates) {
    const d = levenshtein(w, norm(c));
    if (d < bestD) { bestD = d; best = c; }
  }
  return best !== null && bestD <= Math.max(2, Math.floor(w.length / 3)) ? best : null;
}

// "Busy parents #green" -> { text: 'Busy parents', color: 'green' }
export function parseItem(raw) {
  let text = raw.trim();
  let color = null;
  let m = text.match(NAME_TAG);
  if (m) {
    color = m[1].toLowerCase();
    text = text.slice(0, m.index).trim();
  } else if ((m = text.match(HEX_TAG))) {
    color = '#' + m[1].toLowerCase();
    text = text.slice(0, m.index).trim();
  }
  return { text, color };
}

const BULLET = /^[-*+]\s+(.*)$/;
const INLINE = /^([A-Za-z][A-Za-z &/_-]*?)\s*:\s*(.+)$/;
const HEADER = /^([A-Za-z][A-Za-z &/_-]*?)\s*(?::|\{)?\s*$/;
const HEADER_BRACE = /^([A-Za-z][A-Za-z &/_-]*?)\s*(?::\s*)?\{\s*$/;

export function parse(text, { defaultType = 'lean' } = {}) {
  const diagnostics = [];
  const add = (line, severity, message) => diagnostics.push({ line, severity, message });

  let def = getCanvas(defaultType) || CANVASES[0];
  let sawStart = false;
  let ended = false;
  const doc = {
    type: def.id, def, title: '', subtitle: '', author: '', date: '', version: '', theme: 'light',
    sections: {}, diagnostics, startLine: 0, endLine: 0,
  };

  const lines = String(text).replace(/\r/g, '').split('\n');
  let current = null; // the open block's section def
  let currentLine = 0;
  let inBlockComment = false;

  const bucket = (sec, line) => {
    if (!doc.sections[sec.key]) doc.sections[sec.key] = { key: sec.key, items: [], line, endLine: line };
    return doc.sections[sec.key];
  };
  const addItem = (sec, raw, line) => {
    const item = parseItem(raw);
    if (!item.text) return;
    const b = bucket(sec, line);
    b.items.push({ ...item, line });
    b.endLine = Math.max(b.endLine, line);
  };
  const closeBlock = (line) => {
    if (current && doc.sections[current.key]) doc.sections[current.key].endLine = line;
    current = null;
  };
  const unknown = (word, line) => {
    const hint = suggest(word, [...allSectionNames(def), ...DIRECTIVES]);
    add(line, 'error', `Unknown section "${word}"` + (hint ? `. Did you mean "${hint}"?` : `. Valid sections: ${def.sections.map((s) => s.key).join(', ')}`));
  };

  for (let i = 0; i < lines.length; i++) {
    const n = i + 1;
    const t = lines[i].trim();
    if (inBlockComment) { if (t.endsWith("'/")) inBlockComment = false; continue; }
    if (!t) continue;
    if (t.startsWith("/'")) { if (!t.endsWith("'/") || t.length < 4) inBlockComment = true; continue; }
    if (t.startsWith("'") || t.startsWith('//')) continue;
    if (ended) { add(n, 'warning', 'Text after the @end line is ignored'); break; }

    // @startX / @endX
    if (t.startsWith('@')) {
      const m = t.match(/^@(start|end)\s*([A-Za-z0-9_-]*)/i);
      if (!m) { add(n, 'error', `Unknown command "${t}"`); continue; }
      if (m[1].toLowerCase() === 'start') {
        if (sawStart) { add(n, 'warning', 'Only one canvas per description: second @start ignored'); continue; }
        sawStart = true;
        doc.startLine = n;
        const found = findCanvasByTag(m[2]);
        if (found) {
          def = found; doc.def = found; doc.type = found.id;
        } else {
          add(n, 'error', `Unknown canvas type "${m[2]}". Use one of: ${CANVASES.map((c) => '@start' + c.tag).join(', ')}`);
        }
      } else {
        if (current) { add(currentLine, 'warning', `Section "${current.key}" is missing its closing "}"`); closeBlock(n - 1); }
        ended = true;
        doc.endLine = n;
      }
      continue;
    }

    // Inside a block
    if (current) {
      // "}" closes a block. The older "end", "end problem" and "end block" forms still work ("End users" is just an item).
      const endM = t.match(/^end(?:\s+(.+))?$/i);
      if (t === '}' || (endM && (!endM[1] || /^(block|section)$/i.test(endM[1]) || resolveSection(def, endM[1])))) {
        closeBlock(n);
        continue;
      }
      const b = t.match(BULLET);
      if (b) { addItem(current, b[1], n); continue; }
      // Forgot the "}"? A known section name starts the next block.
      const h = t.match(HEADER_BRACE) || t.match(HEADER);
      const sec = h && resolveSection(def, h[1]);
      if (sec) {
        add(currentLine, 'warning', `Section "${current.key}" is missing its closing "}"`);
        closeBlock(n - 1);
        current = sec; currentLine = n; bucket(sec, n);
        continue;
      }
      addItem(current, t, n);
      continue;
    }

    // Outside a block: directives
    const d = t.match(/^(title|subtitle|author|date|version|theme)\b\s*:?\s*(.*)$/i);
    if (d) {
      const name = d[1].toLowerCase();
      const value = d[2].trim();
      if (name === 'theme') {
        if (!THEME_NAMES.includes(value.toLowerCase())) add(n, 'error', `Unknown theme "${value}". Use one of: ${THEME_NAMES.join(', ')}`);
        else doc.theme = value.toLowerCase();
      } else {
        doc[name] = value;
      }
      continue;
    }

    // Outside a block: "section: single item"
    const inl = t.match(INLINE);
    if (inl) {
      const sec = resolveSection(def, inl[1]);
      if (sec) { bucket(sec, n); addItem(sec, inl[2], n); continue; }
      unknown(inl[1], n);
      continue;
    }

    // Outside a block: block header
    const h = t.match(HEADER_BRACE) || t.match(HEADER);
    if (h) {
      const sec = resolveSection(def, h[1]);
      if (sec) { current = sec; currentLine = n; bucket(sec, n); continue; }
      unknown(h[1], n);
      continue;
    }

    add(n, 'error', `Cannot understand "${t}"`);
  }

  if (current) { add(currentLine, 'warning', `Section "${current.key}" is missing its closing "}"`); closeBlock(lines.length); }
  if (!sawStart) add(1, 'warning', `No @start${def.tag} line; assuming a ${def.name}`);
  return doc;
}

// Gentle coaching: never errors, just "hint" severity.
export function lint(doc) {
  const hints = [];
  const def = doc.def;
  for (const sec of def.sections) {
    if (sec.sub) continue;
    const s = doc.sections[sec.key];
    if (!s || s.items.length === 0) continue;
    if (s.items.length > 5) hints.push({ line: s.line, severity: 'hint', message: `${sec.title} has ${s.items.length} items. Consider keeping only the most important ones.` });
    const long = s.items.find((it) => it.text.length > 110);
    if (long) hints.push({ line: long.line, severity: 'hint', message: `An item in ${sec.title} is quite long. Short phrases read better on a canvas.` });
  }
  if (doc.type === 'lean') {
    const u = doc.sections.uvp;
    if (u && u.items.length > 1) hints.push({ line: u.line, severity: 'hint', message: 'A Unique Value Proposition should be a single clear sentence.' });
    const p = doc.sections.problem;
    if (p && p.items.length > 3) hints.push({ line: p.line, severity: 'hint', message: 'Lean Canvas suggests focusing on your top 1-3 problems.' });
  }
  if (!doc.title) hints.push({ line: doc.startLine || 1, severity: 'hint', message: 'Add a "title" line to name your canvas.' });
  return hints;
}

export function completeness(doc) {
  const core = doc.def.sections.filter((s) => !s.sub);
  const filled = core.filter((s) => doc.sections[s.key] && doc.sections[s.key].items.length > 0).length;
  return { filled, total: core.length, ratio: core.length ? filled / core.length : 0 };
}

export function itemsOf(doc, key) {
  return doc.sections[key] ? doc.sections[key].items : [];
}
