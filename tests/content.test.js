// Content integrity: every shipped example and tutorial must be valid.
import { EXAMPLES } from '../src/examples.js';
import { TUTORIALS } from '../src/tutorials.js';
import { CANVASES } from '../src/canvases.js';
import { parse } from '../src/parser.js';
import { skeleton } from '../src/textops.js';

const { module, test } = QUnit;

module('examples', () => {
  test('every canvas type has at least one example', (assert) => {
    for (const c of CANVASES) assert.ok(EXAMPLES.some((e) => e.type === c.id), c.id);
  });
  for (const ex of EXAMPLES) {
    test(`example "${ex.name}" parses without errors or warnings`, (assert) => {
      const doc = parse(ex.text);
      assert.equal(doc.type, ex.type);
      assert.deepEqual(doc.diagnostics, []);
      const filled = Object.values(doc.sections).filter((s) => s.items.length).length;
      assert.ok(filled >= doc.def.sections.filter((s) => !s.sub).length, 'all main sections filled');
    });
  }
  test('example ids are unique', (assert) => {
    assert.equal(new Set(EXAMPLES.map((e) => e.id)).size, EXAMPLES.length);
  });
});

module('tutorials', () => {
  test('every canvas type has a tutorial', (assert) => {
    for (const c of CANVASES) assert.ok(TUTORIALS.some((t) => t.type === c.id), c.id);
  });

  for (const tut of TUTORIALS) {
    test(`tutorial "${tut.title}": clicking "Show me" on every step completes it`, (assert) => {
      let text = skeleton(tut.type, tut.initialTitle);
      assert.equal(parse(text).diagnostics.length, 0, 'starting skeleton is valid');
      const keys = new Set(parse(text).def.sections.map((s) => s.key));
      tut.steps.forEach((step, i) => {
        step.focus.forEach((k) => assert.ok(keys.has(k), `step ${i + 1} focuses a real section: ${k}`));
        if (i > 0 && i < tut.steps.length - 1 && step.focus.length) {
          assert.notOk(step.check(parse(text)), `step ${i + 1} (${step.title}) starts incomplete`);
        }
        text = step.apply(text);
        const doc = parse(text);
        assert.deepEqual(doc.diagnostics.filter((d) => d.severity === 'error'), [], `step ${i + 1} leaves no errors`);
        assert.ok(step.check(doc), `step ${i + 1} (${step.title}) is complete after "Show me"`);
      });
      const final = parse(text);
      const core = final.def.sections.filter((s) => !s.sub);
      assert.ok(core.every((s) => final.sections[s.key]?.items.length), 'the finished canvas has every main section filled');
    });
  }
});
