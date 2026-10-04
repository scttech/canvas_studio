import { wrapText, layoutNotes, buildModel, fitTitle } from '../src/layout.js';
import { parse } from '../src/parser.js';

const { module, test } = QUnit;

module('layout', () => {
  test('wrapText wraps on words and breaks long words', (assert) => {
    const lines = wrapText('the quick brown fox jumps over the lazy dog', 100, 10);
    assert.ok(lines.length > 1);
    assert.ok(lines.every((l) => l.length <= Math.floor(100 / 5.4)));
    assert.equal(lines.join(' '), 'the quick brown fox jumps over the lazy dog');
    const long = wrapText('abcdefghijklmnopqrstuvwxyz', 54, 10);
    assert.ok(long.length > 1 && long.every((l) => l.length <= 10));
    assert.deepEqual(wrapText('', 100, 10), ['']);
  });

  test('layoutNotes keeps notes inside the area and does not overlap', (assert) => {
    const area = { x: 0, y: 0, w: 200, h: 300 };
    const items = Array.from({ length: 4 }, (_, i) => ({ text: `Item number ${i} with some words`, color: null }));
    const r = layoutNotes(items, area);
    assert.equal(r.notes.length, 4);
    assert.equal(r.overflow, 0);
    for (const n of r.notes) assert.ok(n.y >= 0 && n.y + n.h <= area.h && n.x + n.w <= area.w + 0.01);
    for (let i = 1; i < r.notes.length; i++) assert.ok(r.notes[i].y >= r.notes[i - 1].y + r.notes[i - 1].h, 'stacked');
  });

  test('layoutNotes shrinks the font, then reports overflow', (assert) => {
    const area = { x: 0, y: 0, w: 160, h: 120 };
    const few = layoutNotes([{ text: 'a' }, { text: 'b' }], area);
    assert.equal(few.fontSize, 15);
    const many = layoutNotes(Array.from({ length: 30 }, (_, i) => ({ text: `Item ${i}` })), area);
    assert.equal(many.fontSize, 10);
    assert.ok(many.overflow > 0);
    assert.equal(many.notes.length + many.overflow, 30);
  });

  test('wide cells use two columns', (assert) => {
    const r = layoutNotes([{ text: 'a' }, { text: 'b' }], { x: 0, y: 0, w: 600, h: 200 });
    assert.notEqual(r.notes[0].x, r.notes[1].x);
    assert.equal(r.notes[0].y, r.notes[1].y);
  });

  test('buildModel produces a cell per section inside the canvas', (assert) => {
    const doc = parse('@startlean\ntitle T\nproblem\n - A\nend\n@endlean');
    const m = buildModel(doc, 1200);
    assert.equal(m.cells.length, doc.def.sections.length);
    assert.equal(m.header.title, 'T');
    for (const c of m.cells) {
      assert.ok(c.x >= 0 && c.y >= 0 && c.x + c.w <= m.width && c.y + c.h <= m.height, `${c.key} inside canvas`);
    }
    assert.equal(m.cells.find((c) => c.key === 'problem').notes.length, 1);
    assert.equal(m.cells.find((c) => c.key === 'solution').notes.length, 0);
  });

  test('group bands exist for the value proposition canvas only', (assert) => {
    assert.equal(buildModel(parse('@startvpc\n@endvpc')).groups.length, 2);
    assert.equal(buildModel(parse('@startlean\n@endlean')).groups.length, 0);
  });

  test('untitled canvases get a default title', (assert) => {
    assert.equal(buildModel(parse('@startswot\n@endswot')).header.title, 'Untitled SWOT Analysis');
  });

  test('fitTitle keeps short titles on one line and wraps long ones in two', (assert) => {
    const short = fitTitle('Problem', 200, 15);
    assert.deepEqual(short.lines, ['Problem']);
    assert.equal(short.size, 15);
    const long = fitTitle('Unique Value Proposition', 150, 15);
    assert.deepEqual(long.lines, ['Unique Value', 'Proposition']);
    assert.ok(long.size >= 9);
    assert.deepEqual(fitTitle('Supercalifragilistic', 50, 15).lines.length, 1, 'single words are never split');
  });
});
