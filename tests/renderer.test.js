import { render, svgString, renderStandalone } from '../src/renderer.js';
import { buildModel } from '../src/layout.js';
import { getTheme, noteStyle, THEMES } from '../src/themes.js';
import { parse } from '../src/parser.js';
import { EXAMPLES } from '../src/examples.js';

const { module, test } = QUnit;
const SVG = 'http://www.w3.org/2000/svg';
const text = '@startlean\ntitle Hello\nproblem\n - A <script> & B #red\n - Second\nend\n@endlean';
const draw = (svg, src, opts = {}) => render(svg, buildModel(parse(src)), getTheme('light'), { animate: false, ...opts });

module('renderer (D3)', () => {
  test('draws one cell per section and one note per item', (assert) => {
    const doc = parse(text);
    const svg = document.createElementNS(SVG, 'svg');
    draw(svg, text);
    assert.equal(svg.querySelectorAll('g.cell').length, doc.def.sections.length);
    assert.equal(svg.querySelectorAll('g.note').length, 2);
    assert.equal(svg.querySelector('text.title').textContent, 'Hello');
    assert.equal(svg.getAttribute('viewBox'), '0 0 1200 888');
  });

  test('re-rendering updates in place (no duplicates) and removes deleted notes', (assert) => {
    const svg = document.createElementNS(SVG, 'svg');
    draw(svg, text);
    draw(svg, text);
    assert.equal(svg.querySelectorAll('g.cell').length, 12);
    assert.equal(svg.querySelectorAll('g.note').length, 2);
    draw(svg, '@startlean\nproblem: only one\n@endlean');
    assert.equal(svg.querySelectorAll('g.note').length, 1);
  });

  test('switching canvas type swaps the cells', (assert) => {
    const svg = document.createElementNS(SVG, 'svg');
    draw(svg, text);
    draw(svg, '@startswot\n@endswot');
    assert.equal(svg.querySelectorAll('g.cell').length, 4);
  });

  test('focus highlights only the requested cells', (assert) => {
    const svg = document.createElementNS(SVG, 'svg');
    draw(svg, text, { focus: new Set(['problem']) });
    const bold = [...svg.querySelectorAll('g.cell')].filter((g) => g.querySelector('rect.frame').getAttribute('stroke-width') === '3.5');
    assert.equal(bold.length, 1);
  });

  test('click callback receives the section key', (assert) => {
    let clicked = null;
    const svg = document.createElementNS(SVG, 'svg');
    draw(svg, text, { onCellClick: (k) => { clicked = k; } });
    svg.querySelector('g.cell').dispatchEvent(new MouseEvent('click'));
    assert.ok(parse(text).def.sections.some((s) => s.key === clicked), `clicked ${clicked}`);
  });

  test('empty sections show their hint; filled sections do not', (assert) => {
    const svg = document.createElementNS(SVG, 'svg');
    draw(svg, text);
    const hintOf = (n) => [...svg.querySelectorAll('g.cell')].find((g) => g.querySelector('text.ctitle').textContent === n).querySelector('text.hint').textContent;
    assert.equal(hintOf('PROBLEM'), '');
    assert.ok(hintOf('SOLUTION').length > 0);
  });

  test('standalone SVG export is well-formed XML and escapes user text', (assert) => {
    const xml = svgString(parse(text));
    const dom = new DOMParser().parseFromString(xml, 'image/svg+xml');
    assert.equal(dom.querySelector('parsererror'), null, 'valid XML');
    assert.ok(xml.includes('&lt;script&gt;'));
    assert.ok(!xml.includes('<script>'));
    assert.ok(xml.includes('xmlns="http://www.w3.org/2000/svg"'));
  });

  test('every example renders in every theme', (assert) => {
    for (const ex of EXAMPLES) {
      for (const name of Object.keys(THEMES)) {
        const doc = parse(ex.text);
        doc.theme = name;
        const { svg, model } = renderStandalone(doc, 800);
        assert.equal(svg.querySelectorAll('g.cell').length, model.cells.length, `${ex.id}/${name}`);
      }
    }
  });

  test('note styles per theme, including hex colors', (assert) => {
    assert.equal(noteStyle(THEMES.light, 'yellow').fill, '#fff3a8');
    assert.equal(noteStyle(THEMES.light, null).fill, '#fff3a8', 'default is yellow');
    assert.equal(noteStyle(THEMES.light, '#000000').text, '#ffffff', 'light text on dark hex');
    assert.equal(noteStyle(THEMES.light, '#ffffff').text, '#1d2b3a', 'dark text on light hex');
    assert.notEqual(noteStyle(THEMES.dark, 'red').fill, noteStyle(THEMES.light, 'red').fill);
    assert.equal(noteStyle(THEMES.mono, 'red').stroke, '#000000');
  });
});
