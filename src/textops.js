// Pure text helpers for editing the canvas source (used by the section palette, tutorials and theme picker).

import { getCanvas } from './canvases.js';

export function skeleton(typeId, title = 'My Canvas') {
  const def = getCanvas(typeId);
  return `@start${def.tag}\ntitle ${title}\n\n@end${def.tag}\n`;
}

export function blockText(key, items = []) {
  const body = items.length ? items.map((i) => `  - ${i}`).join('\n') : '  - ';
  return `${key} {\n${body}\n}`;
}

const END_LINE = /^\s*@end/i;
const START_LINE = /^\s*@start/i;

// Insert a block of text just before the @end line (or at the end). Returns { text, cursor }.
export function insertBlock(text, block) {
  const lines = text.split('\n');
  let at = lines.findIndex((l) => END_LINE.test(l));
  if (at < 0) at = lines.length;
  // keep a blank line separating blocks
  const before = lines.slice(0, at);
  while (before.length && before[before.length - 1].trim() === '') before.pop();
  const insert = ['', ...block.split('\n'), ''];
  const out = [...before, ...insert, ...lines.slice(at)];
  const text2 = out.join('\n');
  // cursor goes to the end of the first item line (1-based: blank, key, then item)
  return { text: text2, cursor: lineEnd(text2, before.length + 3) };
}

// Set (or remove, when value is empty) a one-line directive such as "theme dark".
export function setDirective(text, name, value) {
  const lines = text.split('\n');
  const re = new RegExp(`^\\s*${name}\\b`, 'i');
  const idx = lines.findIndex((l) => re.test(l));
  if (idx >= 0) {
    if (value) lines[idx] = `${name} ${value}`;
    else lines.splice(idx, 1);
  } else if (value) {
    const s = lines.findIndex((l) => START_LINE.test(l));
    lines.splice(s + 1, 0, `${name} ${value}`);
  }
  return lines.join('\n');
}

export function lineStart(text, lineNo) {
  const lines = text.split('\n');
  let pos = 0;
  for (let i = 0; i < Math.min(lineNo - 1, lines.length); i++) pos += lines[i].length + 1;
  return pos;
}

export function lineEnd(text, lineNo) {
  const lines = text.split('\n');
  const i = Math.min(lineNo, lines.length) - 1;
  return lineStart(text, lineNo) + (lines[i] ? lines[i].length : 0);
}
