# Mirror – Arbeitsregeln

**Mirror** ist ein kollaborativer Echtzeit-Editor mit Personal Space (Notizen),
Kalender und Planungs-Tools. Produktion: <https://mymirror.myinterdesk.net>

Diese Datei enthält **nur Regeln**. Wie die App gebaut ist, steht an genau einer
Stelle: [`.github/Documentation/ARCHITECTURE.md`](.github/Documentation/ARCHITECTURE.md).

## Zuerst lesen

1. **`.claude/memory/MEMORY.md`** — Projektstand, Entscheidungen, Erfahrungen aus
   früheren Aufgaben und die stehenden Fallen. Immer zu Beginn eines Chats.
2. **`.github/Documentation/ARCHITECTURE.md`** — Ist-Zustand der Architektur.

## Dokumentation: was gehört wohin

Jede Datei hat **eine** Lebensdauer. Wer das mischt, produziert Dateien, die niemand
mehr liest — genau deshalb wurde die 221 KB große `Project-overview.md` aufgeteilt.

| Datei | Verhalten | Budget |
|---|---|---|
| `CLAUDE.md` (diese) | Regeln, **wird ersetzt** | 5 KB |
| `.github/Documentation/ARCHITECTURE.md` | Ist-Zustand, **wird ersetzt** | 15 KB |
| `.claude/memory/MEMORY.md` | Index, eine Zeile pro Aufgabe | 17 KB |
| `.claude/memory/<datum>-<thema>.md` | Details je Aufgabe | 6 KB |
| `.github/Documentation/DOCUMENTATION.md` | Changelog, wächst | – |
| `.github/Documentation/FUNCTIONS.md` | Nachschlagewerk (`#tags`), wächst | – |
| `.github/Documentation/FEATURES.md`, `todo.md` | Backlog | – |

`scripts/check-doc-budgets.sh` prüft die Budgets, die CI führt es bei jedem Push aus.
Reißt ein Budget: **auslagern statt kürzen** — Details in eine Topic-Datei, alte
Log-Einträge nach `.claude/memory/ARCHIVE-<jahr>.md`.

**Nichts Privates in versionierte Dateien** — das Repo ist öffentlich. Konten,
Adressen, Zugangsdaten gehören in `.claude/memory/local.md` (gitignoriert).

## Nach jeder erledigten Aufgabe

1. `MEMORY.md` um **eine Zeile** ergänzen (+ Topic-Datei, wenn es Details gibt)
2. Neue Features in `DOCUMENTATION.md` dokumentieren
3. `ARCHITECTURE.md` anpassen, **falls sich der Ist-Zustand geändert hat**

## Entwicklung

- **Kein Build-Schritt in der Entwicklung** — Quelldateien direkt editieren. Tailwind
  und die `app.js`-Minifizierung laufen nur im Docker-Build.
- JS gehört nach `app.js`, CSS nach `styles/app.css`, Markup nach `index.html`.
- Mobile-Regeln, Z-Index-Skala, Theme-Variablen und die bekannten Fallen stehen in
  `ARCHITECTURE.md` — vor UI-Arbeit dort nachsehen, nicht raten.

## Commit-Workflow

**Stehende Freigabe (User, 2026-07-01):** commit, push, PR erstellen **und** nach `main`
mergen ist dauerhaft freigegeben — nicht nachfragen, durchführen, danach Deploy und
Produktion verifizieren.

- Für neue Arbeit **immer** frisch abzweigen:
  `git fetch origin main && git checkout -b <neu> origin/main`
- Vor jedem Commit `gitstamp.txt` aktualisieren (`YYYY-MM-DD HH:MM:SS <short-hash>`).
- **Cache-Busting** bei sichtbaren Frontend-Änderungen ist Pflicht und dreiteilig:
  `?v=` in `index.html` (Preload **und** Script-Tag), dieselbe Version in
  `sw.js` → `PRECACHE_URLS`, plus `CACHE_NAME` bumpen. `gitstamp` allein reicht nicht.
- `git reset --hard` / `--force` sind blockiert → Cleanup nicht-destruktiv über
  `git stash push` + `git merge --ff-only origin/main`.
- **Worktree-Falle:** In Worktree-Sessions Edits **und** git nur mit absoluten
  Worktree-Pfaden. Nach dem Commit `git show --stat HEAD` prüfen — sonst fehlt `app.js`
  im Commit, obwohl alles richtig aussah.

## Rollen / Skills

`/app-dev` (Full-Stack), `/ui-designer` (Visual/CSS), `/mirror-dev` (beides).
