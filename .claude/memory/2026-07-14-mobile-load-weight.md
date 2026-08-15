# Mobile-Ladegewicht gesenkt: Tailwind vorkompiliert (2026-07-14)

PR #19 + #20, SW v39 → v40, `app.js?v` / `tailwind-built ?v` `2026-07-14-01`.

## Was

Tailwind-Play-CDN-**Runtime** (398 KB roh / 121 KB gzip, JIT scannt bei jedem Load
das DOM) ersetzt durch **vorkompiliertes statisches CSS** `vendor/tailwind-built.css`
(30 KB / 6 KB gzip, **kein Runtime-JS**).

- `tailwind.config.cjs` (content: `index.html` + `app.js`; `theme.extend` übernimmt
  die alte Runtime-Config: `font-sans`, `shadow-soft`), Input `styles/tailwind.input.css`
- Eingebunden als `<link>` **vor** `app.css` — dessen `!important`-Overrides gewinnen
  weiterhin
- `vendor/tailwind.min.js` gelöscht

**Risiko-Check vorab:** keine fragment-gebauten Klassen (`"grid-cols-" + n`) im Code
→ der statische Scan erfasst alles, inklusive arbitrary values (`text-[10px]`, `z-[9998]`).

## Build

`npm run build:css` läuft im **Docker-Build-Step** (`tailwindcss` als devDep) → der
Dev-Workflow bleibt build-frei, CI regeneriert bei jedem Deploy.

## FALLE (kostete den ersten Deploy)

Das Base-Image setzt `ENV NODE_ENV=production` → `npm ci` überspringt devDeps →
Deploy failte mit `tailwindcss: not found` (exit 127). **Fix:** `npm ci --include=dev`
plus `npm prune --omit=dev` nach dem Build (PR #20).

## Nebenbefund

Der Branch war stale gegenüber `main` (PS-Sort #16–18 waren dazwischen gemerged) →
`git merge origin/main`; Konflikte betrafen nur Versionsstände (gitstamp, index.html,
sw.js), die app.js-Fixes aus main wurden behalten.

Verifiziert: Browser (Desktop + Mobil, coffeeDark/coffeeLight, `window.tailwind === undefined`)
und Prod.
