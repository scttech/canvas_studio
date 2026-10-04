// Pure layout: turns a parsed document into positioned rectangles and wrapped text.
// No DOM access here, so it is fully unit-testable.

export const WIDTH = 1200;
const HEADER_H = 70;
const PAD = 14;
const GAP = 6;
const GROUP_H = 30;
const TITLE_H = 44;
const FONT_SIZES = [15, 13, 12, 11, 10];

// Greedy word wrap using an average glyph-width estimate (works without a DOM).
export function wrapText(text, maxWidth, fontSize) {
  const maxChars = Math.max(1, Math.floor(maxWidth / (fontSize * 0.54)));
  const lines = [];
  let line = '';
  for (let word of String(text).split(/\s+/).filter(Boolean)) {
    while (word.length > maxChars) { // break very long words
      if (line) { lines.push(line); line = ''; }
      lines.push(word.slice(0, maxChars));
      word = word.slice(maxChars);
    }
    if (!line) line = word;
    else if ((line + ' ' + word).length <= maxChars) line += ' ' + word;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

// Place items as sticky notes inside area {x,y,w,h}. Shrinks the font until everything fits;
// at the smallest size, notes that still do not fit are counted in `overflow`.
export function layoutNotes(items, area) {
  const cols = area.w >= 480 ? 2 : 1;
  const colW = (area.w - GAP * (cols - 1)) / cols;
  const padN = 7;
  let result = { notes: [], fontSize: FONT_SIZES[0], overflow: 0 };

  for (let k = 0; k < FONT_SIZES.length; k++) {
    const fs = FONT_SIZES[k];
    const last = k === FONT_SIZES.length - 1;
    const lineH = Math.round(fs * 1.25);
    const reserve = last ? 18 : 0; // room for "+N more"
    const colY = Array(cols).fill(0);
    const notes = [];
    let overflow = 0;
    for (const item of items) {
      const lines = wrapText(item.text, colW - 2 * padN, fs);
      const h = lines.length * lineH + 2 * padN;
      let c = 0;
      for (let i = 1; i < cols; i++) if (colY[i] < colY[c]) c = i;
      if (colY[c] + h > area.h - reserve) { overflow++; continue; }
      notes.push({ x: area.x + c * (colW + GAP), y: area.y + colY[c], w: colW, h, lines, lineH, padding: padN, text: item.text, color: item.color });
      colY[c] += h + GAP;
    }
    result = { notes, fontSize: fs, overflow };
    if (overflow === 0) break;
  }
  return result;
}

export function buildModel(doc, width = WIDTH) {
  const def = doc.def;
  const height = Math.round(width * def.aspect);
  const hasGroups = !!(def.groups && def.groups.length);
  const gridX = PAD;
  const gridY = HEADER_H + (hasGroups ? GROUP_H : 0);
  const gridW = width - 2 * PAD;
  const gridH = height - gridY - PAD;
  const colW = gridW / def.cols;
  const rowSum = def.rows.reduce((a, b) => a + b, 0);
  const rowY = [0];
  def.rows.forEach((r, i) => rowY.push(rowY[i] + (r / rowSum) * gridH));

  const cells = def.sections.map((sec) => {
    const x = gridX + (sec.col - 1) * colW + GAP / 2;
    const y = gridY + rowY[sec.row - 1] + GAP / 2;
    const w = sec.w * colW - GAP;
    const h = rowY[sec.row - 1 + sec.h] - rowY[sec.row - 1] - GAP;
    const items = doc.sections[sec.key] ? doc.sections[sec.key].items : [];
    const t = fitTitle(sec.title, w - (sec.num ? 40 : 14) - 10, sec.sub ? 13 : 15);
    const titleH = TITLE_H + (t.lines.length > 1 ? t.size + 2 : 0);
    const area = { x: x + 10, y: y + titleH, w: w - 20, h: h - titleH - 10 };
    const laid = layoutNotes(items, area);
    return {
      key: sec.key, title: sec.title, hint: sec.hint, num: sec.num || null, tone: sec.tone || null, sub: !!sec.sub,
      x, y, w, h, area, itemCount: items.length, titleSize: t.size, titleLines: t.lines, ...laid,
    };
  });

  const groups = hasGroups
    ? def.groups.map((g) => ({ title: g.title, x: gridX + (g.col - 1) * colW + GAP / 2, y: HEADER_H - 2, w: g.w * colW - GAP, h: GROUP_H - 4 }))
    : [];

  const meta = [doc.author, doc.date, doc.version && `v${doc.version.replace(/^v/i, '')}`].filter(Boolean).join('  ·  ');
  return {
    width, height, canvasName: def.name,
    header: { title: doc.title || `Untitled ${def.name}`, subtitle: doc.subtitle || def.name, typeLabel: !doc.subtitle, meta },
    cells, groups,
  };
}

// Fit an uppercase section title in `space` px: one line if it fits at a readable size, otherwise two balanced lines.
export function fitTitle(title, space, maxSize) {
  const GLYPH = 0.68; // average uppercase bold glyph width in em
  const one = Math.floor(space / (title.length * GLYPH));
  if (one >= Math.min(maxSize, 12) || !title.includes(' ')) return { lines: [title], size: Math.max(9, Math.min(maxSize, one)) };
  const words = title.split(' ');
  let best = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const longest = Math.max(a.length, b.length);
    if (!best || longest < best.longest) best = { lines: [a, b], longest };
  }
  return { lines: best.lines, size: Math.max(9, Math.min(maxSize, Math.floor(space / (best.longest * GLYPH)))) };
}
