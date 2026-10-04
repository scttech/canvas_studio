// A small code editor: textarea + syntax-highlight overlay + line-number gutter with diagnostics.

import { resolveSection } from './canvases.js';
import { lineStart, lineEnd } from './textops.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TAG = /(\s)(#(?:green|blue|red|pink|orange|purple|gray|yellow|[0-9a-fA-F]{6}|[0-9a-fA-F]{3}))$/i;

// Returns HTML (one <span>-decorated string per line, joined by \n) for the overlay <pre>.
export function highlight(text, def) {
  let inBlock = false;
  let inComment = false;
  return text.split('\n').map((raw) => {
    const t = raw.trim();
    const e = esc(raw);
    if (inComment) { if (t.endsWith("'/")) inComment = false; return `<span class="c">${e}</span>`; }
    if (t.startsWith("/'")) { if (!t.endsWith("'/") || t.length < 4) inComment = true; return `<span class="c">${e}</span>`; }
    if (t.startsWith("'") || t.startsWith('//')) return `<span class="c">${e}</span>`;
    if (t.startsWith('@')) return `<span class="d">${e}</span>`;
    const indent = esc(raw.slice(0, raw.length - raw.trimStart().length));
    const item = (s) => {
      const m = s.match(TAG);
      return m ? `${esc(s.slice(0, m.index))}${m[1]}<span class="t">${esc(m[2])}</span>` : esc(s);
    };
    if (inBlock) {
      if (t === '}' || /^end(\s+\S.*)?$/i.test(t)) { inBlock = false; return `${indent}<span class="k">${esc(t)}</span>`; }
      const b = t.match(/^([-*+])\s+(.*)$/);
      if (b) return `${indent}<span class="b">${b[1]}</span> ${item(b[2])}`;
      return `${indent}${item(t)}`;
    }
    const d = t.match(/^(title|subtitle|author|date|version|theme)\b(\s*:?\s*)(.*)$/i);
    if (d) return `${indent}<span class="k">${esc(d[1])}</span>${esc(d[2])}<span class="s">${esc(d[3])}</span>`;
    const inl = t.match(/^([A-Za-z][A-Za-z &/_-]*?)(\s*:\s*)(.+)$/);
    if (inl && resolveSection(def, inl[1])) return `${indent}<span class="k">${esc(inl[1])}</span>${esc(inl[2])}${item(inl[3])}`;
    const h = t.match(/^([A-Za-z][A-Za-z &/_-]*?)\s*(?::|\{)?\s*$/);
    if (h && resolveSection(def, h[1])) { inBlock = true; return `${indent}<span class="k">${esc(t)}</span>`; }
    return `<span class="x">${e}</span>`;
  }).join('\n');
}

export function createEditor(container, { onChange } = {}) {
  container.innerHTML = `
    <div class="ed-gutter"><div class="ed-gutter-inner"></div></div>
    <div class="ed-code">
      <pre class="ed-hl" aria-hidden="true"></pre>
      <textarea class="ed-ta" spellcheck="false" wrap="off" autocomplete="off" aria-label="Canvas description"></textarea>
    </div>`;
  const gutter = container.querySelector('.ed-gutter-inner');
  const pre = container.querySelector('.ed-hl');
  const ta = container.querySelector('.ed-ta');
  let def = null;
  let diags = [];

  const paintGutter = () => {
    const n = ta.value.split('\n').length;
    const worst = new Map();
    const rank = { error: 3, warning: 2, hint: 1 };
    for (const d of diags) if (!worst.has(d.line) || rank[d.severity] > rank[worst.get(d.line).severity]) worst.set(d.line, d);
    let html = '';
    for (let i = 1; i <= n; i++) {
      const d = worst.get(i);
      html += `<div class="ed-ln${d ? ' ' + d.severity : ''}"${d ? ` title="${esc(d.message).replace(/"/g, '&quot;')}"` : ''}>${i}</div>`;
    }
    gutter.innerHTML = html;
  };
  const paint = () => {
    pre.innerHTML = (def ? highlight(ta.value, def) : esc(ta.value)) + '\n ';
    paintGutter();
    syncScroll();
  };
  const syncScroll = () => {
    const t = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
    pre.style.transform = t;
    gutter.style.transform = `translateY(${-ta.scrollTop}px)`;
  };

  // Insert with execCommand so the browser's undo stack keeps working.
  const insert = (s) => {
    ta.focus();
    if (!document.execCommand || !document.execCommand('insertText', false, s)) {
      ta.setRangeText(s, ta.selectionStart, ta.selectionEnd, 'end');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  ta.addEventListener('input', () => { paint(); onChange && onChange(ta.value); });
  ta.addEventListener('scroll', syncScroll);
  ta.addEventListener('keydown', (ev) => {
    if (ev.key === 'Tab' && !ev.ctrlKey && !ev.altKey) {
      ev.preventDefault();
      insert('  ');
    } else if (ev.key === 'Enter' && !ev.shiftKey && !ev.ctrlKey && ta.selectionStart === ta.selectionEnd) {
      const pos = ta.selectionStart;
      const start = ta.value.lastIndexOf('\n', pos - 1) + 1;
      const before = ta.value.slice(start, pos);
      const m = before.match(/^(\s*)([-*+])\s+(.*)$/);
      const ind = before.match(/^\s*/)[0];
      if (m && m[3] === '' ) { // empty bullet: remove it instead of continuing the list
        ev.preventDefault();
        ta.setSelectionRange(start, pos);
        insert('');
      } else if (m) {
        ev.preventDefault();
        insert(`\n${m[1]}${m[2]} `);
      } else if (ind) {
        ev.preventDefault();
        insert(`\n${ind}`);
      }
    }
  });
  new ResizeObserver(syncScroll).observe(ta);

  return {
    textarea: ta,
    getValue: () => ta.value,
    setValue(v, { silent = false } = {}) { ta.value = v; paint(); if (!silent && onChange) onChange(v); },
    setDef(d) { def = d; paint(); },
    setDiagnostics(list) { diags = list; paintGutter(); },
    focusLine(lineNo) {
      ta.focus();
      const a = lineStart(ta.value, lineNo);
      ta.setSelectionRange(a, lineEnd(ta.value, lineNo));
      const lh = parseFloat(getComputedStyle(ta).lineHeight) || 20;
      ta.scrollTop = Math.max(0, (lineNo - 3) * lh);
      syncScroll();
    },
    setCursor(pos) { ta.focus(); ta.setSelectionRange(pos, pos); },
    refresh: paint,
  };
}
