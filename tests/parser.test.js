import { parse, parseItem, lint, completeness, suggest } from '../src/parser.js';

const { module, test } = QUnit;

module('parser', () => {
  test('parseItem extracts color tags', (assert) => {
    assert.deepEqual(parseItem('Busy parents #green'), { text: 'Busy parents', color: 'green' });
    assert.deepEqual(parseItem('Loud #FF8800'), { text: 'Loud', color: '#ff8800' });
    assert.deepEqual(parseItem('Fix #f80'), { text: 'Fix', color: '#f80' });
    assert.deepEqual(parseItem('Issue #42'), { text: 'Issue #42', color: null }, 'not a color');
    assert.deepEqual(parseItem('  plain  '), { text: 'plain', color: null });
  });

  test('parses header, directives and blocks', (assert) => {
    const doc = parse('@startlean\ntitle My Idea\nsubtitle Sub\nauthor Me\ndate 2026-01-01\nversion 2\ntheme dark\nproblem\n  - A\n  * B #red\n  + C\nend\n@endlean');
    assert.equal(doc.type, 'lean');
    assert.equal(doc.title, 'My Idea');
    assert.equal(doc.subtitle, 'Sub');
    assert.equal(doc.author, 'Me');
    assert.equal(doc.version, '2');
    assert.equal(doc.theme, 'dark');
    assert.deepEqual(doc.sections.problem.items.map((i) => i.text), ['A', 'B', 'C']);
    assert.equal(doc.sections.problem.items[1].color, 'red');
    assert.equal(doc.diagnostics.length, 0);
    assert.equal(doc.sections.problem.line, 8);
    assert.equal(doc.sections.problem.endLine, 12);
  });

  test('inline sections, aliases, case and spacing', (assert) => {
    const doc = parse('@startlean\nUnique Value Proposition: One sentence\nCustomer Segments: Devs\nunfair-advantage: Moat\n@endlean');
    assert.equal(doc.sections.uvp.items[0].text, 'One sentence');
    assert.equal(doc.sections.segments.items[0].text, 'Devs');
    assert.equal(doc.sections.unfair.items[0].text, 'Moat');
    assert.equal(doc.diagnostics.length, 0);
  });

  test('repeated blocks merge', (assert) => {
    const doc = parse('@startlean\nproblem\n - A\nend\nproblem\n - B\nend\nproblem: C\n@endlean');
    assert.deepEqual(doc.sections.problem.items.map((i) => i.text), ['A', 'B', 'C']);
  });

  test('plain lines inside a block are items; "End users" does not close the block', (assert) => {
    const doc = parse('@startlean\nproblem\n  Plain item\n  End users are confused\nend\n@endlean');
    assert.deepEqual(doc.sections.problem.items.map((i) => i.text), ['Plain item', 'End users are confused']);
  });

  test('block syntax: braces, plus the older "end" forms', (assert) => {
    const doc = parse('@startlean\nproblem {\n - A\n}\nsolution:\n - B\nend solution\n@endlean');
    assert.equal(doc.sections.problem.items.length, 1);
    assert.equal(doc.sections.solution.items.length, 1);
    assert.equal(doc.diagnostics.length, 0);
  });

  test('comments are ignored', (assert) => {
    const doc = parse("@startlean\n' comment\n// another\n/' block\nproblem\n'/\nproblem\n - Real\nend\n@endlean");
    assert.deepEqual(doc.sections.problem.items.map((i) => i.text), ['Real']);
    assert.equal(doc.diagnostics.length, 0);
  });

  test('unknown section gives an error with a suggestion', (assert) => {
    const doc = parse('@startlean\nprobelm\n - A\nend\n@endlean');
    const err = doc.diagnostics.find((d) => d.severity === 'error');
    assert.ok(err, 'error reported');
    assert.equal(err.line, 2);
    assert.ok(/Did you mean "problem"/.test(err.message), err.message);
  });

  test('missing closing brace is a warning and the next section still parses', (assert) => {
    const doc = parse('@startlean\nproblem\n - A\nsolution\n - B\nend\n@endlean');
    assert.ok(doc.diagnostics.some((d) => d.severity === 'warning' && /missing its closing "}"/.test(d.message)));
    assert.equal(doc.sections.problem.items.length, 1);
    assert.equal(doc.sections.solution.items.length, 1);
  });

  test('unclosed block at end of file', (assert) => {
    const doc = parse('@startlean\nproblem\n - A');
    assert.equal(doc.sections.problem.items.length, 1);
    assert.ok(doc.diagnostics.some((d) => /missing its closing "}"/.test(d.message)));
  });

  test('canvas type selection and unknown types', (assert) => {
    assert.equal(parse('@startbmc\n@endbmc').type, 'bmc');
    assert.equal(parse('@startSWOT\n@endswot').type, 'swot');
    const bad = parse('@startnope\n@endnope');
    assert.ok(bad.diagnostics.some((d) => d.severity === 'error' && /Unknown canvas type/.test(d.message)));
  });

  test('missing @start falls back to the default type with a warning', (assert) => {
    const doc = parse('problem: x', { defaultType: 'bmc' });
    assert.equal(doc.type, 'bmc');
    assert.ok(doc.diagnostics.some((d) => d.severity === 'warning'));
  });

  test('bad theme and garbage are errors with line numbers', (assert) => {
    const doc = parse('@startlean\ntheme neon\n123 ???\n@endlean');
    assert.equal(doc.diagnostics.filter((d) => d.severity === 'error').length, 2);
    assert.deepEqual(doc.diagnostics.map((d) => d.line), [2, 3]);
  });

  test('text after @end is ignored with a warning', (assert) => {
    const doc = parse('@startlean\n@endlean\nproblem: x');
    assert.equal(doc.sections.problem, undefined);
    assert.ok(doc.diagnostics.some((d) => d.severity === 'warning'));
  });

  test('CRLF line endings work', (assert) => {
    const doc = parse('@startlean\r\nproblem\r\n - A\r\nend\r\n@endlean\r\n');
    assert.equal(doc.sections.problem.items[0].text, 'A');
    assert.equal(doc.diagnostics.length, 0);
  });

  test('suggest finds near matches only', (assert) => {
    assert.equal(suggest('sollution', ['solution', 'problem']), 'solution');
    assert.equal(suggest('zzzzzz', ['solution', 'problem']), null);
  });

  test('lint and completeness', (assert) => {
    const doc = parse('@startlean\nproblem\n - 1\n - 2\n - 3\n - 4\nend\nuvp\n - a\n - b\nend\n@endlean');
    const hints = lint(doc);
    assert.ok(hints.some((h) => /top 1-3 problems/.test(h.message)));
    assert.ok(hints.some((h) => /single clear sentence/.test(h.message)));
    assert.ok(hints.some((h) => /title/.test(h.message)));
    const c = completeness(doc);
    assert.equal(c.filled, 2);
    assert.equal(c.total, 9, 'optional sub-sections are not counted');
  });
});
