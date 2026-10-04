import { skeleton, blockText, insertBlock, setDirective, lineStart, lineEnd } from '../src/textops.js';
import { parse } from '../src/parser.js';
import { encodeShare, decodeShare, toMarkdown } from '../src/exporters.js';
import { highlight } from '../src/editor.js';
import { getCanvas } from '../src/canvases.js';

const { module, test } = QUnit;

module('text operations', () => {
  test('skeleton parses cleanly for every canvas type', (assert) => {
    for (const id of ['lean', 'bmc', 'vpc', 'swot', 'empathy']) {
      const doc = parse(skeleton(id));
      assert.equal(doc.type, id);
      assert.equal(doc.diagnostics.length, 0, id);
    }
  });

  test('insertBlock puts the block before @end and the cursor on the first item', (assert) => {
    const r = insertBlock(skeleton('lean'), blockText('problem'));
    assert.ok(r.text.indexOf('problem') < r.text.indexOf('@endlean'));
    assert.equal(r.text.slice(0, r.cursor).split('\n').pop(), '  - ');
    assert.equal(parse(r.text).diagnostics.length, 0);
    const again = insertBlock(r.text, blockText('uvp', ['One']));
    assert.equal(parse(again.text).sections.uvp.items[0].text, 'One');
  });

  test('insertBlock without @end appends', (assert) => {
    assert.ok(insertBlock('@startlean', blockText('problem', ['A'])).text.trimEnd().endsWith('}'));
  });

  test('setDirective replaces, inserts and removes', (assert) => {
    let t = skeleton('lean', 'X');
    t = setDirective(t, 'theme', 'dark');
    assert.equal(parse(t).theme, 'dark');
    assert.ok(t.indexOf('theme dark') > t.indexOf('@startlean'));
    t = setDirective(t, 'theme', 'mono');
    assert.equal(t.match(/theme/g).length, 1);
    assert.equal(parse(t).theme, 'mono');
    t = setDirective(t, 'theme', '');
    assert.equal(parse(t).theme, 'light');
  });

  test('lineStart / lineEnd', (assert) => {
    const t = 'ab\ncde\nf';
    assert.equal(lineStart(t, 1), 0);
    assert.equal(lineStart(t, 2), 3);
    assert.equal(lineEnd(t, 2), 6);
    assert.equal(lineEnd(t, 3), 8);
  });

  test('share links round-trip unicode', (assert) => {
    const text = '@startlean\ntitle Café ☕ 日本語\n@endlean';
    const enc = encodeShare(text);
    assert.ok(/^[A-Za-z0-9_-]+$/.test(enc), 'url safe');
    assert.equal(decodeShare(enc), text);
    assert.strictEqual(decodeShare('***not base64***'), null);
  });

  test('markdown export lists every section', (assert) => {
    const md = toMarkdown(parse('@startswot\ntitle S\nstrengths\n - Fast\nend\n@endswot'));
    assert.ok(md.startsWith('# S'));
    assert.ok(md.includes('## Strengths\n- Fast'));
    assert.ok(md.includes('## Threats\n_(empty)_'));
  });

  test('highlight escapes HTML and marks tokens', (assert) => {
    const html = highlight("@startlean\nproblem\n  - <b>x</b> #red\nend\n' note\n@endlean", getCanvas('lean'));
    assert.ok(!html.includes('<b>'), 'escaped');
    assert.ok(html.includes('&lt;b&gt;'));
    assert.ok(html.includes('<span class="t">#red</span>'));
    assert.ok(html.includes('<span class="c">'));
    assert.equal(html.split('\n').length, 6, 'one output line per input line');
  });
});
