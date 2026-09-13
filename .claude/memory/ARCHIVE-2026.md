# Memory-Archiv 2026

> Ausgelagerte Einträge aus [`MEMORY.md`](MEMORY.md). **Append-only — nur greppen,
> nicht am Stück lesen.** Nichts hier wurde gelöscht, nur aus dem Index verschoben,
> damit der Index lesbar bleibt.
>
> Rotiert am 2026-09-03: alle Einträge vor 2026-08-01.
> Rotiert am 2026-09-13: alle Einträge vor 2026-08-16.

## Completed Tasks Log (älteste zuerst rotiert, neueste oben)

- **2026-08-15** Doku + Memory nach **Lebensdauer** getrennt (PRs #27/#28, `e5c90e5`). `Project-overview.md` (221 KB, von keiner KI mehr gelesen) → `ARCHITECTURE.md` (Ist-Zustand, wird überschrieben) + `FUNCTIONS.md` + `CHANGELOG-ARCHIVE.md` + Stub. Memory ins Repo (`.claude/memory/`, Claude-Ordner ist Symlink), private Konten nach `local.md` (gitignoriert, Repo ist öffentlich). `CLAUDE.md` nur noch Regeln. **Grundsatz: eine Datei darf wachsen ODER gelesen werden, nie beides** — `scripts/check-doc-budgets.sh` + CI erzwingen das. Detail: `2026-08-15-doc-memory-restructure.md`.
- **2026-08-15** Farb-Chips in der Vorschau (PR #26, `85da9ba`, v44) — `/FF6115/` + `#FF6115` → Farbkreis, Settings→„Editor", Default an. **MERKE:** Inline-Tokenizer auf `/` feuert nie → `md.core.ruler.push`; Preview-Styles immer an zwei Stellen (iframe + app.css). Detail: `2026-08-15-preview-color-chips.md`.
- **2026-08-11** Geräte-Anzeige in Presence + Präsenz auf Mobil wieder sichtbar (PR #25, `c2a6f2f`, v43). **MERKE:** Presence-Felder müssen durch 4 Whitelists, sonst still verschluckt. Detail: `2026-08-11-presence-device-display.md`.
- **2026-07-15** Raum-Restore (Fix A lokal wirksam, Fix B account-basiert) + app.js-Minifizierung (PRs #21 `1a2da08`, #22 `feb3f90`, v41/v42) + SW-Auto-Reload. Detail: `2026-07-15-room-restore-and-minify.md`.
- **2026-07-14** Mobile-Ladegewicht: Tailwind-CDN-Runtime → vorkompiliertes CSS (PRs #19+#20, v40). **FALLE:** `NODE_ENV=production` überspringt devDeps im Docker-Build. Detail: `2026-07-14-mobile-load-weight.md`.
- **2026-07-13** Full Offline Mode — CDN-Assets nach `/vendor/` vendored + precached (PR #14, v35). **MERKE:** opaque cross-origin Responses (`ok===false`) werden von `.ok`-gegateten `cache.put` nie gespeichert. Detail: `2026-07-13-full-offline-mode.md`.
- **2026-07-13** Follow-up PR #15 (`c8b78bd`, v36): markdown-Libs lazy via `ensureMarkdownLibs()` + Idle-Prefetch, Offline-Badge dezenter.
- **2026-07-13** Fix PS-Sort „Geändert" — bloßes Anwählen bumpte `updatedAt` (PRs #16–#18, `e380fca`, v39). **MERKE:** jeder PUT stempelt `updatedAt` → No-Op-Saves VOR dem PUT abfangen. Detail: `2026-07-13-ps-sort-modified-fix.md`.
- **2026-07-02** Editor: JetBrains Mono + einstellbares MD-Quell-Highlighting (PRs #10 `5815730`, #11 `b575d17`). **MERKE:** programmatische `textarea.value=`-Edits triggern kein `input`-Event. Detail: `2026-07-02-editor-font-md-highlighting.md`.
- **2026-07-01→02** Obsidian-Style Note Graph v1–v5, vendored force-graph (PRs #3–#9). **MERKE:** `.autoPauseRedraw(false)` zwingend. Detail: `2026-07-01-note-graph-view.md`.
- **2026-06-29** Editor Undo/Redo — Snapshot-History (200 Schritte, Caret-Restore, Cmd+Z/Shift+Z/Y), Undo via synthetischem `input`-Event. `fe128ac`.
- **2026-06-28** Auto-backup zu fixer Tageszeit (`psAutoBackupTime`, default 03:00) + backup-on-leave (`attachBackupOnLeave`). FS-Folder-Backup bei Hard-Close nicht garantiert — die black box ist das verlässliche Netz. `716ad01`.
- **2026-06-27** PS data-loss hardening (offline 404 recreate, dirty-note preserve, save-fail toasts, black box, conflict warning, trash→365d). `18dc7df`. Detail: `2026-06-27-ps-dataloss-hardening.md`.
- **2026-06-27** Action-Panel Share „An Drafts" (`drafts://x-callback-url/create?text=`) statt Telegram; Fix `getEditorContent()` las nicht-existentes `#editor` → `#mirror`. `cc0e5a6`.
- **2026-06-03** Content Actions & Workflow system — ⚡ panel, SMTP mail, save/share/copy, SSRF-geschützte Webhook-Workflows (`workflows`-Tabelle, 7 API-Routen). `fdbf48a`+.
- **2026-06-03** bronzeDark theme + `--accent-*` bridge fix (tokens on bg `#262626`). `b636483`.
- **2026-03-30** Fix PS data loss on remote delete — snapshot-404-Handler legt via `savePersonalSpaceNote(rawText,{auto:false})` neu an. `4fc1e4f`.
- **2026-03-23** Query Builder filter button + dead-button cleanup. `e88a887`, `c7f2bf0`, `94cd497`.
- **2026-03-20** Query Builder tag browser — accordion groups + search filter (`qbTagBrowserState`, `qbTagFilter`).
- **2026-03-19** AI Transform mode („Bearbeiten & Anwenden") — `mode==="transform"`, ersetzt `#mirror`. `4e181a8`.
- **2026-03-17** Paste cleanup — `formatPastedText()` on textarea paste. `399cfb7`.
- **2026-03-09** WCAG AA contrast fix light themes (coffee/bitter/monoLight). `d3e30ce`.
- **2026-03-09** Upload delete cleans PS note links — `removeUploadLinksFromNotes()` in `deleteUpload()`.
- **2026-03-07** Mobile Toolbox Fix — `100dvh` + `bottom:auto` on editorPanel; touch-action. `dd37f6d`.
- **2026-03-07** AI Skill Setup — `CLAUDE.md`, skills, MEMORY.md angelegt.
