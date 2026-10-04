// Application shell: wires the editor, parser, renderer, tutorials and exports together.

import { CANVASES, getCanvas } from './canvases.js';
import { parse, lint, completeness, THEME_NAMES } from './parser.js';
import { buildModel } from './layout.js';
import { render, svgString, svgToPngBlob, renderStandalone } from './renderer.js';
import { getTheme } from './themes.js';
import { createEditor } from './editor.js';
import { EXAMPLES } from './examples.js';
import { getGuide, getCanvasGuide } from './guides.js';
import { TUTORIALS, getTutorial } from './tutorials.js';
import { skeleton, blockText, insertBlock, setDirective } from './textops.js';
import { toMarkdown, encodeShare, decodeShare, saveDraft, loadDraft, download, slug } from './exporters.js';

const $ = (sel) => document.querySelector(sel);

const state = {
  doc: null,
  lastType: 'lean',
  lastLoaded: '',
  activeKey: null,
  tutorial: null, // { def, idx }
};

// ---------- Editor ----------
let timer = null;
const editor = createEditor($('#editor'), {
  onChange: () => { clearTimeout(timer); timer = setTimeout(update, 100); },
});

function loadText(text) {
  state.lastLoaded = text;
  editor.setValue(text, { silent: true });
  update();
}

// ---------- Update pipeline ----------
function update() {
  const text = editor.getValue();
  const doc = parse(text, { defaultType: state.lastType });
  state.doc = doc;
  state.lastType = doc.type;
  saveDraft(text);

  editor.setDef(doc.def);
  const diags = [...doc.diagnostics, ...lint(doc)];
  editor.setDiagnostics(diags);
  drawCanvas();
  drawDiagnostics(doc, diags);
  drawPalette(doc);
  drawStatus(doc);
  drawTutorial();
  $('#themeSelect').value = doc.theme;
  $('#newType').value = '';
  document.title = `${doc.title || 'Untitled'} · Canvas Studio`;
}

function focusSet() {
  const s = new Set();
  if (state.activeKey) s.add(state.activeKey);
  if (state.tutorial) getStep().focus.forEach((k) => s.add(k));
  return s;
}

function drawCanvas() {
  const doc = state.doc;
  render($('#canvas'), buildModel(doc), getTheme(doc.theme), {
    focus: focusSet(),
    onCellClick: (key) => {
      const s = doc.sections[key];
      if (s) editor.focusLine(s.line);
      else addSection(key);
    },
    onTypeHover: (on, e) => (on ? showCanvasGuide(doc.def, e.clientX + 14, e.clientY + 14) : hideGuide()),
    onCellHover: (key, e) => (key ? showGuide(doc.def, key, e.clientX + 14, e.clientY + 14) : hideGuide()),
  });
}

// ---------- Hover guide popover ----------
let guideEl = null;
function showGuide(def, key, x, y) {
  const sec = def.sections.find((s) => s.key === key);
  if (!sec) return hideGuide();
  const g = getGuide(def.id, key);
  const html = `<b>${escapeHtml(sec.title)}</b><p>${escapeHtml(g ? g.about : sec.hint)}</p>`
    + (g ? `<h4>Think about</h4><ul>${g.ask.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}</ul>`
      + `<h4>Examples</h4><ul class="ex">${g.examples.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}</ul>` : '');
  showPopover(`${def.id}:${key}`, html, x, y);
}
function showCanvasGuide(def, x, y) {
  const g = getCanvasGuide(def.id);
  const html = `<b>${escapeHtml(def.name)}</b><p>${escapeHtml(g ? g.about : def.blurb)}</p>`
    + (g ? `<h4>Use it for</h4><ul>${g.use.map((u) => `<li>${escapeHtml(u)}</li>`).join('')}</ul>`
      + (g.numbered ? `<h4>Why the numbers?</h4><p>${escapeHtml(g.numbered)}</p>` : '') : '');
  showPopover(`canvas:${def.id}`, html, x, y);
}
function showPopover(id, html, x, y) {
  if (!guideEl) {
    guideEl = document.createElement('div');
    guideEl.id = 'guide';
    guideEl.setAttribute('role', 'tooltip');
    document.body.appendChild(guideEl);
  }
  if (guideEl.dataset.key !== id) { guideEl.dataset.key = id; guideEl.innerHTML = html; }
  guideEl.style.display = 'block';
  const r = guideEl.getBoundingClientRect();
  guideEl.style.left = `${Math.max(8, Math.min(x, window.innerWidth - r.width - 8))}px`;
  guideEl.style.top = `${Math.max(8, y + r.height > window.innerHeight - 8 ? y - r.height - 28 : y)}px`;
}
function hideGuide() { if (guideEl) guideEl.style.display = 'none'; }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideGuide(); });

function drawDiagnostics(doc, diags) {
  const box = $('#diag');
  const real = diags.filter((d) => d.severity !== 'hint');
  const hints = diags.filter((d) => d.severity === 'hint');
  const row = (d) => `<li class="${d.severity}"><button data-line="${d.line}"><b>Line ${d.line}</b> ${escapeHtml(d.message)}</button></li>`;
  let html = '';
  if (!real.length) html += '<div class="ok">No problems found.</div>';
  else html += `<ul>${real.map(row).join('')}</ul>`;
  if (hints.length) html += `<details${real.length ? '' : ' open'}><summary>${hints.length} tip${hints.length > 1 ? 's' : ''}</summary><ul>${hints.map(row).join('')}</ul></details>`;
  box.innerHTML = html;
  box.querySelectorAll('button[data-line]').forEach((b) => b.addEventListener('click', () => editor.focusLine(+b.dataset.line)));
  box.dataset.errors = String(doc.diagnostics.filter((d) => d.severity === 'error').length);
}

function drawPalette(doc) {
  const el = $('#palette');
  el.innerHTML = '<span class="label">Add section:</span>' + doc.def.sections.map((s) => {
    const n = doc.sections[s.key] ? doc.sections[s.key].items.length : 0;
    return `<button class="chip${n ? ' filled' : ''}${s.sub ? ' sub' : ''}" data-key="${s.key}" title="${escapeHtml(s.hint)}">${n ? '✓ ' : '+ '}${escapeHtml(s.title)}</button>`;
  }).join('');
  el.querySelectorAll('.chip').forEach((b) => {
    b.removeAttribute('title');
    b.addEventListener('click', () => addSection(b.dataset.key));
    b.addEventListener('mouseenter', () => { const r = b.getBoundingClientRect(); showGuide(doc.def, b.dataset.key, r.left, r.bottom + 6); });
    b.addEventListener('mouseleave', hideGuide);
  });
}

function addSection(key) {
  const s = state.doc.sections[key];
  if (s) { editor.focusLine(s.line); return; }
  const r = insertBlock(editor.getValue(), blockText(key));
  editor.setValue(r.text);
  editor.setCursor(r.cursor);
}

function drawStatus(doc) {
  const c = completeness(doc);
  $('#status').innerHTML = `<span id="statusType" style="cursor:help">${escapeHtml(doc.def.name)}</span>
    <span class="meter" title="${c.filled} of ${c.total} main sections have content"><i style="width:${Math.round(c.ratio * 100)}%"></i></span>
    <span>${c.filled}/${c.total} sections filled</span>`;
  const t = $('#statusType');
  t.addEventListener('mouseenter', () => { const r = t.getBoundingClientRect(); showCanvasGuide(doc.def, r.left, r.top - 200); });
  t.addEventListener('mouseleave', hideGuide);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// ---------- Caret -> highlighted canvas box ----------
function caretSection() {
  const ta = editor.textarea;
  const line = ta.value.slice(0, ta.selectionStart).split('\n').length;
  for (const s of Object.values(state.doc.sections)) if (line >= s.line && line <= s.endLine) return s.key;
  return null;
}
function onCaret() {
  const k = caretSection();
  if (k !== state.activeKey) { state.activeKey = k; drawCanvas(); }
}
['keyup', 'click', 'focus'].forEach((ev) => editor.textarea.addEventListener(ev, onCaret));
editor.textarea.addEventListener('blur', () => { state.activeKey = null; drawCanvas(); });

// ---------- Tutorials ----------
const getStep = () => state.tutorial.def.steps[state.tutorial.idx];

function startTutorial(type) {
  const def = getTutorial(type);
  state.tutorial = { def, idx: 0 };
  state.lastType = type;
  loadText(skeleton(type, def.initialTitle));
  $('#tutorial').hidden = false;
  closeDialogs();
}

function exitTutorial() {
  state.tutorial = null;
  $('#tutorial').hidden = true;
  drawCanvas();
}

function drawTutorial() {
  const box = $('#tutorial');
  if (!state.tutorial) { box.hidden = true; return; }
  const { def, idx } = state.tutorial;
  const step = getStep();
  const ok = step.check(state.doc);
  const last = idx === def.steps.length - 1;
  box.hidden = false;
  box.innerHTML = `
    <div class="tut-head"><b>${escapeHtml(def.title)}</b><span>Step ${idx + 1} of ${def.steps.length}</span><button id="tutExit" class="link">Exit</button></div>
    <div class="dots">${def.steps.map((_, i) => `<i class="${i < idx ? 'done' : i === idx ? 'cur' : ''}"></i>`).join('')}</div>
    <h3>${escapeHtml(step.title)}</h3>
    <p>${escapeHtml(step.body)}</p>
    ${step.tip ? `<p class="tip">💡 ${escapeHtml(step.tip)}</p>` : ''}
    ${step.syntax ? `<pre class="syntax">${escapeHtml(step.syntax)}</pre>` : ''}
    <div class="goal ${ok ? 'met' : ''}">${ok ? '✓' : '○'} ${escapeHtml(step.goal)}</div>
    <div class="tut-actions">
      <button id="tutBack" ${idx === 0 ? 'disabled' : ''}>Back</button>
      <button id="tutShow" ${last ? 'hidden' : ''}>Show me</button>
      <button id="tutNext" class="primary">${last ? 'Finish' : ok ? 'Next ›' : 'Skip ›'}</button>
    </div>`;
  $('#tutExit').onclick = exitTutorial;
  $('#tutBack').onclick = () => { state.tutorial.idx--; update(); };
  $('#tutShow').onclick = () => { editor.setValue(step.apply(editor.getValue())); };
  $('#tutNext').onclick = () => {
    if (last) { exitTutorial(); return; }
    state.tutorial.idx++;
    update();
  };
}

// ---------- Dialogs ----------
function closeDialogs() { document.querySelectorAll('dialog[open]').forEach((d) => d.close()); }
document.querySelectorAll('dialog').forEach((d) => {
  d.querySelector('.close')?.addEventListener('click', () => d.close());
  d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
});

function openExamples() {
  const grid = $('#exampleGrid');
  grid.innerHTML = '';
  for (const ex of EXAMPLES) {
    const card = document.createElement('button');
    card.className = 'card';
    const { svg } = renderStandalone(parse(ex.text), 600);
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    card.appendChild(svg);
    const info = document.createElement('div');
    info.innerHTML = `<b>${escapeHtml(ex.name)}</b><small>${escapeHtml(getCanvas(ex.type).name)}</small><span>${escapeHtml(ex.description)}</span>`;
    card.appendChild(info);
    card.addEventListener('click', () => {
      if (!confirmReplace()) return;
      exitTutorial();
      loadText(ex.text);
      closeDialogs();
    });
    grid.appendChild(card);
  }
  $('#examplesDialog').showModal();
}

function openLearn() {
  $('#learnGrid').innerHTML = TUTORIALS.map((t) => `
    <button class="card text" data-type="${t.type}">
      <b>${escapeHtml(t.title)}</b>
      <small>${t.steps.length} steps</small>
      <span>${escapeHtml(t.summary)}</span>
    </button>`).join('');
  $('#learnGrid').querySelectorAll('.card').forEach((c) => c.addEventListener('click', () => {
    if (confirmReplace()) startTutorial(c.dataset.type);
  }));
  $('#learnDialog').showModal();
}

function openHelp() {
  const def = state.doc.def;
  $('#helpSections').innerHTML = `<h3>${escapeHtml(def.name)} sections</h3><table>
    <tr><th>Keyword</th><th>Also accepted</th><th>Meaning</th></tr>
    ${def.sections.map((s) => `<tr><td><code>${s.key}</code></td><td>${s.aliases.map((a) => `<code>${a}</code>`).join(' ')}</td><td>${escapeHtml(s.title)}: ${escapeHtml(s.hint)}</td></tr>`).join('')}
  </table>`;
  $('#helpDialog').showModal();
}

function confirmReplace() {
  const t = editor.getValue();
  return !t.trim() || t === state.lastLoaded || window.confirm('Replace your current canvas? Unsaved edits will be lost.');
}

// ---------- Toolbar ----------
const newType = $('#newType');
newType.innerHTML = '<option value="">New canvas…</option>' + CANVASES.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
newType.addEventListener('change', () => {
  const id = newType.value;
  if (!id) return;
  if (!confirmReplace()) { newType.value = ''; return; }
  exitTutorial();
  state.lastType = id;
  loadText(skeleton(id, 'Untitled ' + getCanvas(id).name));
  editor.setCursor(editor.getValue().length);
});

$('#themeSelect').innerHTML = THEME_NAMES.map((t) => `<option value="${t}">${t[0].toUpperCase() + t.slice(1)} theme</option>`).join('');
$('#themeSelect').addEventListener('change', (e) => {
  editor.setValue(setDirective(editor.getValue(), 'theme', e.target.value === 'light' ? '' : e.target.value));
});

$('#btnExamples').addEventListener('click', openExamples);
$('#btnLearn').addEventListener('click', openLearn);
$('#btnHelp').addEventListener('click', openHelp);

const toast = (msg) => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 2600);
};

const fileBase = () => slug(state.doc.title || state.doc.def.name);
const actions = {
  svg: () => download(`${fileBase()}.svg`, new Blob([svgString(state.doc)], { type: 'image/svg+xml' })),
  png: () => svgToPngBlob(state.doc).then((b) => download(`${fileBase()}.png`, b)).catch((e) => toast(e.message)),
  md: () => download(`${fileBase()}.md`, new Blob([toMarkdown(state.doc)], { type: 'text/markdown' })),
  txt: () => download(`${fileBase()}.canvas.txt`, new Blob([editor.getValue()], { type: 'text/plain' })),
  share: async () => {
    const url = `${location.origin === 'null' ? 'file://' : location.origin}${location.pathname}#c=${encodeShare(editor.getValue())}`;
    history.replaceState(null, '', '#c=' + encodeShare(editor.getValue()));
    try { await navigator.clipboard.writeText(url); toast('Share link copied to clipboard'); } catch { toast('Link is in the address bar: copy it from there'); }
  },
  print: () => window.print(),
};
document.querySelectorAll('[data-action]').forEach((b) => b.addEventListener('click', () => {
  b.closest('details')?.removeAttribute('open');
  actions[b.dataset.action]();
}));
document.addEventListener('click', (e) => {
  document.querySelectorAll('details.menu[open]').forEach((d) => { if (!d.contains(e.target)) d.removeAttribute('open'); });
});

// ---------- Splitter ----------
(() => {
  const split = $('#splitter');
  const main = $('#main');
  split.addEventListener('pointerdown', (e) => {
    split.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const r = main.getBoundingClientRect();
      const pct = Math.min(70, Math.max(22, ((ev.clientX - r.left) / r.width) * 100));
      main.style.setProperty('--left', pct + '%');
    };
    const up = () => { split.removeEventListener('pointermove', move); split.removeEventListener('pointerup', up); };
    split.addEventListener('pointermove', move);
    split.addEventListener('pointerup', up);
  });
})();

// ---------- Boot ----------
(function boot() {
  const m = location.hash.match(/^#c=(.+)$/);
  const shared = m ? decodeShare(m[1]) : null;
  const text = shared || loadDraft() || EXAMPLES[0].text;
  loadText(text);
  if (shared) toast('Loaded shared canvas');
})();
