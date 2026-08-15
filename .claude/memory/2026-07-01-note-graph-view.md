# Note Graph View (Obsidian-Style) — 2026-07-01

Feature: full-screen, theme-adaptive graph that visualizes relationships between
Personal-Space notes. Nodes = notes, edges = existing `[[wiki-links]]` (+ optional
shared-tag edges). Pure client-side view over data Mirror already has — **no
backend or DB schema change**.

Commit `744b049` (feature) + `0545c9c` (gitstamp). PR #3 → merge to `main` = Fly deploy.

---

## Why it was cheap to build

The relationship data already existed:
- **Wiki-links** `[[Title]]` were already parsed/autocompleted/rendered clickable
  (`getWikiContext` ~4559, `insertWikiLink` ~4644, `buildNoteTitleIndex` ~13448,
  `applyWikiLinksToMarkdown` ~13466). These are the explicit, directed edges.
- **Tags** (`tags_json` per note) give optional implicit edges.
So the graph just builds a `{nodes, links}` object from `psState.notes` and renders it.

## Files touched

| File | Change |
|---|---|
| `index.html` | `#psGraphBtn` in PS toolbar (next to Filter); `#noteGraphOverlay` markup (toolbar, `#noteGraphCanvas`, `#ngNote` preview, `#ngLegend`, `#ngEmpty`); `app.js?v=` → `2026-07-01-01` (preload + script) |
| `app.js` | Graph module (all fns `ng*`) inserted right after `openNoteFromWikiTarget` (~15831); button wiring near `psQueryBuilderBtn` wiring |
| `styles/app.css` | `.ng-*` glass styles themed via `--accent-*` / `--panel-solid-bg`; light-theme title-contrast overrides at end |
| `sw.js` | `CACHE_NAME` v22→v23; precache `/app.js?v=2026-07-01-01` + `/vendor/force-graph.min.js?v=2026-07-01-01` |
| `vendor/force-graph.min.js` | vendored lib (v1.43.5, ~160 kB raw / ~55 kB gz), UMD global `window.ForceGraph` |

## Rendering lib

`vasturiano/force-graph` (canvas force-directed). Chosen over cytoscape/vis/sigma:
Obsidian's exact model, built-in pan/zoom/drag/pinch, small, and — crucially — you
draw every node/link yourself so theming reads live CSS vars. **Lazy-loaded** on
first open (`ngEnsureLib` injects `<script>`), **SW-precached** for offline.

## Key functions (app.js, all `ng`-prefixed)

- `openNoteGraph()` / `closeNoteGraph()` — toggle overlay, add/remove `body.note-graph-open`, resume/pause sim.
- `ngEnsureLib()` — lazy `<script>` inject of the vendored lib, returns Promise.
- `ngBuildData()` — builds `{nodes, links}` from `filterRealNotes(psState.notes)`; wiki edges via `buildNoteTitleIndex` + regex `/\[\[([^\[\]\n]+)\]\]/g`; tag edges capped (see below); computes per-node `deg`.
- `ngViewData()` — global returns full; local returns selected node + its 1-hop neighbors.
- `ngReadPalette()` — reads theme colors (see theming pitfalls).
- `ngDrawNode` / `ngPaintArea` / `ngLinkColor` / `ngLinkWidth` — canvas draw callbacks.
- `ngComputeHighlight(id)` — neighbor set for hover/selected dimming.
- `ngShowNotePreview(id)` / `ngOpenNote(id)` — preview card; open calls `findNoteById` → `applyNoteToEditor`.
- `ngWireControls()` — one-time (`ngWired` guard) wiring of seg/search/tag-toggle/fit/close + resize + Esc.

## THEMING PITFALLS (important, don't regress)

Canvas doesn't inherit CSS, so colors are read via `getComputedStyle`. Two traps:

1. **`body color` is BLACK on several dark themes** (fuchsia, cyan, emerald, violet
   all return `rgb(0,0,0)` — text color comes from Tailwind utility classes, not
   body). So `cs.color` is USELESS for canvas label color. → `ngReadPalette` derives
   label/text color from **background luminance**: light bg → dark text `rgb(38,32,45)`,
   dark bg → light text `rgb(232,228,240)`.
2. **`--accent-text` is `#fff` on light themes** (coffeeLight/bitterLight/monoLight) —
   it's meant for text ON an accent fill, not on the light glass panel. → CSS overrides
   at end of `app.css` force readable `.ng-title`/`.ng-note-title`/`.ng-empty-title`
   colors for those three themes.

Everything else themes correctly from `--accent-strong` (node hue + active seg btn),
`--accent-text-soft`, `--accent-border*`, `--accent-bg-soft`, `--panel-solid-bg`.
`--accent-*` are set on `documentElement` by `applyTheme` (~9951) from the `THEMES`
object at runtime, so they're always populated. Default theme is `fuchsia` (never bare `:root`).

## Interactions

Hover = highlight neighbors + dim rest (~0.14). Click = select + preview card (does
NOT auto-open — safe on touch); open via card button. Global/Local toggle. Search =
white-ring highlight of matches. Tag-edge checkbox. Zoom-to-fit. Close = ✕ / Esc /
background stays. Node size = link degree (hubs big). Selected = full accent + glow.
Drag pins a node (`fx/fy` in `onNodeDragEnd`). Mobile: default Local mode, tap=preview.

## Config / defaults chosen

- **Tag-edges default OFF** (wiki-links only). When on, capped: skip tags shared by
  `> 8` notes (`CAP` in `ngBuildData`) to avoid hairball cliques.
- **Full-screen only** for v1. Inline mini-graph-in-note is a possible v2.

## Verification

Local full-app boot fails (better-sqlite3 ABI vs Node 26 — known local-only issue),
so verified via an isolated static Playwright harness: force-graph init chain runs
error-free, canvas paints nodes/edges, and theming confirmed on coffeeLight (brown),
fuchsia (dark, white labels), bronzeDark, mono/bitter — title colors correct per theme.

## MERKE (aus MEMORY.md konsolidiert 2026-08-15)

- `ngParseColor` muss **rgba UND Hex** matchen — `THEMES[*].accentStrong` liefert
  beide Formate gemischt.
- `cooldownTicks` friert die Simulation ein → force-graph pausiert dann das
  Rendern. In `ngInit` deshalb zwingend `.autoPauseRedraw(false)` setzen.
- Labels werden luminanz-abgeleitet berechnet: auf dunklen Themes ist die
  body-`color` BLACK, `cs.color` ist damit für das Canvas unbrauchbar.
