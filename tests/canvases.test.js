import { CANVASES, resolveSection, norm } from '../src/canvases.js';
import { getGuide, getCanvasGuide } from '../src/guides.js';

const { module, test } = QUnit;

module('canvas definitions', () => {
  test('ids and tags are unique', (assert) => {
    assert.equal(new Set(CANVASES.map((c) => c.id)).size, CANVASES.length);
    assert.equal(new Set(CANVASES.map((c) => c.tag)).size, CANVASES.length);
  });

  for (const def of CANVASES) {
    test(`${def.id}: sections fit the grid without overlapping`, (assert) => {
      const taken = new Map();
      for (const s of def.sections) {
        assert.ok(s.col >= 1 && s.col + s.w - 1 <= def.cols, `${s.key} within columns`);
        assert.ok(s.row >= 1 && s.row + s.h - 1 <= def.rows.length, `${s.key} within rows`);
        for (let c = s.col; c < s.col + s.w; c++) {
          for (let r = s.row; r < s.row + s.h; r++) {
            const k = `${c},${r}`;
            assert.notOk(taken.has(k), `${s.key} overlaps ${taken.get(k)} at ${k}`);
            taken.set(k, s.key);
          }
        }
      }
      assert.equal(taken.size, def.cols * def.rows.length, 'the grid is completely covered');
    });

    test(`${def.id}: every section has a hover guide`, (assert) => {
      for (const s of def.sections) {
        const g = getGuide(def.id, s.key);
        assert.ok(g && g.about && g.ask.length > 0 && g.examples.length > 0, `${s.key} has about, questions and examples`);
      }
    });

    test(`${def.id}: names and aliases resolve uniquely`, (assert) => {
      const seen = new Map();
      for (const s of def.sections) {
        for (const name of [s.key, s.title, ...s.aliases]) {
          const n = norm(name);
          if (seen.has(n)) assert.equal(seen.get(n), s.key, `"${name}" is ambiguous`);
          seen.set(n, s.key);
          assert.equal(resolveSection(def, name).key, s.key);
        }
      }
    });
  }

  test('every canvas has a canvas-level guide', (assert) => {
    for (const c of CANVASES) {
      const g = getCanvasGuide(c.id);
      assert.ok(g && g.about && g.use.length > 0, c.id);
      if (c.sections.some((s) => s.num)) assert.ok(g.numbered, `${c.id} explains its numbered sections`);
    }
  });

  test('resolveSection is case and punctuation insensitive', (assert) => {
    const lean = CANVASES.find((c) => c.id === 'lean');
    assert.equal(resolveSection(lean, 'Unfair Advantage').key, 'unfair');
    assert.equal(resolveSection(lean, 'KEY-METRICS').key, 'metrics');
    assert.equal(resolveSection(lean, 'nope'), null);
  });
});
