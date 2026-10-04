# Canvas description syntax

A canvas is described in plain text, in the spirit of PlantUML.

```
@startlean
title    PetPal
subtitle On-demand dog walking
author   Chris
date     2026-01-15
version  1.0
theme    blueprint

segments {
  - Busy urban professionals with dogs #green
  - Pet owners who travel
}

problem: Hard to find a walker I can trust

' comments start with an apostrophe or //
@endlean
```

## Structure

| Element | Meaning |
| --- | --- |
| `@startTYPE` / `@endTYPE` | Wraps the description. `TYPE` is one of `lean`, `bmc`, `vpc`, `swot`, `empathy`, `roam`, `lbc`, `ia`. |
| `title`, `subtitle`, `author`, `date`, `version` | Header text. A colon after the name is optional. |
| `theme NAME` | `light` (default), `dark`, `blueprint`, `mono`. |
| `section {` ... `}` | A block of items for one section. The older form `section` ... `end` (or `end section-name`) still works. |
| `section: text` | A one-line section with a single item. |
| `- text`, `* text`, `+ text` | An item (sticky note). Plain lines inside a block are items too. |
| `... #color` | Trailing color tag: `#yellow` (default), `#green`, `#blue`, `#pink`, `#orange`, `#purple`, `#gray`, `#red`, or hex such as `#f80` / `#ff8800`. |
| `' text`, `// text` | Comment. `/'` ... `'/` is a multi-line comment. |

Rules:

* Section names ignore case, spaces, hyphens and underscores, and accept aliases (`Unfair Advantage`, `unfair-advantage`, `moat`).
* Repeating a section adds more items to it.
* Only one canvas per description. Text after `@end...` is ignored (with a warning).
* If a block is missing its closing `}`, a section name on the next line still starts a new block (with a warning).

## Canvases and their sections

### Lean Canvas (`@startlean`)

`problem`, `alternatives`, `solution`, `metrics`, `uvp`, `concept`, `unfair`, `channels`, `segments`, `earlyadopters`, `costs`, `revenue`.
`alternatives`, `concept` and `earlyadopters` are the optional sub-boxes under Problem, UVP and Customer Segments.

### Business Model Canvas (`@startbmc`)

`partners`, `activities`, `resources`, `value`, `relationships`, `channels`, `segments`, `costs`, `revenue`.

### Value Proposition Canvas (`@startvpc`)

Value Map: `gaincreators`, `products`, `painrelievers`. Customer Profile: `gains`, `jobs`, `pains`.

### SWOT Analysis (`@startswot`)

`strengths`, `weaknesses`, `opportunities`, `threats`.

### Empathy Map (`@startempathy`)

`says`, `thinks`, `does`, `feels`, `pains`, `gains`.

### ROAM Risk Board (`@startroam`)

SAFe risk categories: `resolved`, `owned`, `accepted`, `mitigated`.

### Lean Business Case (`@startlbc`)

SAFe Epic one-pager: `epic`, `outcomes`, `indicators`, `mvp`, `nfr`, `outofscope`, `sponsors`, `estimate`.

### Inspect & Adapt Retrospective (`@startia`)

SAFe end-of-PI event: `wentwell`, `improve`, `metrics`, `problems`, `causes`, `actions`.

The in-app **Syntax help** dialog lists every accepted alias for the canvas you are editing.

## Adding a new canvas type

Add an entry to `CANVASES` in `src/canvases.js`: a grid (`cols`, relative `rows` heights, `aspect`) and a list of sections with their grid position. The parser, renderer, palette, help, and tests (`tests/canvases.test.js` verifies the grid is fully covered with no overlaps) all pick it up automatically. Then add an example in `src/examples.js` and optionally a tutorial in `src/tutorials.js`; the content tests will check them.
