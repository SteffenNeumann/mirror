# 2026-07-13 — Full Offline Mode

## Symptom
Offline (Handy): App rendert kaputt, Notiz-Daten laden nicht.

## Root cause (WICHTIG für PWA/Service-Worker)
Der Service Worker cachte die CDN-Assets **nie**. Die cross-origin `<script>`/`<link>`-Tags (Tailwind, markdown-it, highlight.js) werden **no-cors** geladen → **opaque Response** (`status 0`, `ok === false`). Der SW-Cache-Zweig war `if (networkResponse.ok) cache.put(...)` → lief für opaque Responses nie. Online kommen sie frisch vom CDN (funktioniert), offline schlägt der Fetch fehl und der Cache ist leer → **komplettes Tailwind-Utility-Layout kollabiert** + markdown-Preview bleibt leer (`buildMarkdown`/`window.markdownit` fehlt → `null`).

**MERKE:** opaque cross-origin Responses haben `ok === false` und werden von `.ok`-gegateten `cache.put` NIE gespeichert. CDN-Abhängigkeiten sind offline immer tot — außer man (a) vendored sie lokal oder (b) cached opaque Responses explizit (ohne `.ok`-Check, `cache.put` kann opaque speichern).

## Fix — voller Offline-Modus (Option: vendoring)
Gewählt: **selbst hosten**, weil es zum bestehenden Muster passt (force-graph, yjs, jetbrains-mono liegen schon in `/vendor`).

Nach `/vendor/` geladen (via curl von jsdelivr/cdn.tailwindcss.com) + in SW `PRECACHE_URLS`:
- `tailwind.min.js` (Play-CDN-Runtime-Compiler, ~400KB)
- `markdown-it.min.js`, `markdown-it-task-lists.min.js`
- `highlight.min.js`, `github-dark.min.css`, `github.min.css`

Alle mit `?v=2026-07-13-01`.

**index.html:** Tailwind-Inject-Script `s.src` → `/vendor/tailwind.min.js?v=…` (Config bleibt in `s.onload`); hljs-CSS-`<link>` → `/vendor/github-dark.min.css`; die 3 defer-`<script>`-Tags (markdown-it/task-lists/highlight) → `/vendor/…`; `app.js`-preload + script-Tag → `?v=2026-07-13-01`; DNS-prefetch/preconnect zu CDNs entfernt, Tailwind-preload ergänzt.

**app.js:** `highlightCssUrl` (~Z.14148, injiziert in Preview-`<link>` ~Z.14382) light/dark → `/vendor/github.min.css` / `/vendor/github-dark.min.css`.

**sw.js:** toter `CDN_CACHE_URLS`-Pfad + `isCdn` entfernt → Fetch-Handler cached nur noch Same-Origin-GETs mit `ok`. `CACHE_NAME` `mirror-v34` → **`mirror-v35`**.

## Offline-Banner (UX)
Persistente theme-aware Pill oben-mittig: `#offlineBanner` (Glass, pulsierender amber Punkt `.offline-dot`), CSS am Ende von `app.css` (`z-index:9997`, unter Modals). JS: `ensureOfflineBanner()` (lazy DOM-Create) + `updateOfflineBanner()` (toggelt `.is-visible` nach `isAppOffline()`), verdrahtet an `online`/`offline`-Events + Boot (DOMContentLoaded/sofort). i18n `offline.banner` (de „Offline – lokale Ansicht" / en „Offline – local view").

## Offline-Daten (schon vorhanden, nicht angefasst)
`refreshPersonalSpace` (~Z.18420) hat bereits einen IndexedDB-Fallback: bei `navigator.onLine === false` lädt es Notizen via `offlineGetAllNotes()` + `offlineLoadMeta("email")` (populiert durch `offlinePutNotes` bei jedem Online-Refresh). War nur durch das kaputte Rendering maskiert.

## Out of scope
Pyodide (Python-Ausführung, `app.js:605`) bleibt CDN — multi-MB, Nische. Offline funktioniert Python-Exec nicht (bewusst).

## Verifikation
Lokaler voller Server bootet nicht (better-sqlite3 ABI). Stattdessen statischer `python3 -m http.server` + Browser-Pane: volles Tailwind-Styling greift, `window.tailwind/markdownit/hljs/markdownitTaskLists` alle vorhanden, Banner rendert mit korrektem DE-Label. Prod nach Deploy: gitstamp `9500779`, alle 5 Vendor-Assets HTTP 200, `sw.js` `CACHE_NAME="mirror-v35"`, `index.html` `app.js?v=2026-07-13-01`.

## Deploy
PR #14 (`9500779`) → main gemerged → Fly-Deploy success → Prod verifiziert. Branch `claude/offline-mode-mobile-567c46` war aktuell auf origin/main (keine Worktree-Falle).
