# Canvas Studio

Describe a Lean Canvas, Business Model Canvas, Value Proposition Canvas, SWOT analysis or Empathy Map in
PlantUML-style text and watch it render live with D3.js. Includes guided tutorials and an examples gallery.

Plain HTML, CSS and JavaScript (ES modules). No Node, no `package.json`, no build step. D3 and QUnit are vendored in `vendor/`.

## Run it

ES modules cannot be loaded from `file://`, so serve the folder with any static server. 

`python -m http.server` or any other static server works too.

Works with VS Code Live Server as well.

## Tests

Open `http://localhost:8080/tests/`. Besides unit tests for the parser, layout and renderer, the suite checks that every example is
valid, and simulates clicking "Show me" through every step of every tutorial to make sure each one can be completed.

## Live Demo

Check out the [live demo](https://scttech.github.io/canvas_studio/index.html)