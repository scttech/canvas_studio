# Canvas Studio

Describe a Lean Canvas, Business Model Canvas, Value Proposition Canvas, SWOT analysis or Empathy Map in
PlantUML-style text and watch it render live with D3.js. Includes guided tutorials and an examples gallery.

Plain HTML, CSS and JavaScript (ES modules). No Node, no `package.json`, no build step. D3 and QUnit are vendored in `vendor/`.

## Run it

ES modules cannot be loaded from `file://`, so serve the folder with any static server. The included one needs nothing installed:

```powershell
./serve.ps1            # then open http://localhost:8080/   (tests: /tests/)
```

(`python -m http.server` or any other static server works too.)

## Features

* **Live editor** with syntax highlighting, line gutter (errors, warnings and tips), auto-continued bullets, and typo suggestions ("Did you mean `problem`?").
* **Five canvases**: Lean, Business Model, Value Proposition, SWOT, Empathy Map. Canvas types are plain data in `src/canvases.js`.
* **Learn**: step-by-step tutorials for every canvas. Each step highlights the relevant box, explains the idea, checks your progress live, and has a "Show me" button.
* **Examples gallery** with rendered thumbnails.
* **Add section** chips, click-to-jump (click a box on the canvas to jump to its text; the box under your cursor is highlighted).
* **Themes**: light, dark, blueprint, mono. Colored sticky notes via `#green`, `#f80`, etc.
* **Export** SVG, PNG, Markdown outline, canvas text; **Share link** (the canvas is encoded in the URL); print.
* Autosaves your draft in the browser; coaching tips ("keep to your top 1-3 problems"); completeness meter.

Syntax reference: [docs/syntax.md](docs/syntax.md), or press **Syntax help** in the app.

## Layout

```
index.html        app shell
src/canvases.js   canvas definitions (grid + sections + aliases)
src/parser.js     text -> document, diagnostics, lint
src/layout.js     document -> positioned boxes and wrapped notes (pure, no DOM)
src/renderer.js   D3 rendering, SVG/PNG export
src/themes.js     colors
src/editor.js     highlighting editor
src/tutorials.js  src/examples.js   learning content
src/textops.js    src/exporters.js  text editing helpers, markdown, share links
tests/            QUnit (open /tests/ in the browser)
vendor/           d3.min.js, qunit.js, qunit.css
```

## Tests

Open `http://localhost:8080/tests/`. Besides unit tests for the parser, layout and renderer, the suite checks that every example is
valid, and simulates clicking "Show me" through every step of every tutorial to make sure each one can be completed.
