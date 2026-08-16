# Mirror – Project Memory

> **Zu Beginn jedes Chats lesen. Nach jeder erledigten Aufgabe aktualisieren.**
>
> Diese Datei liegt **im Repo** (`.claude/memory/`) — versioniert, gesichert, für jede
> KI und jeden Rechner sichtbar. Der Claude-Code-Memory-Ordner ist ein Symlink hierher.
>
> **Regeln, damit das lesbar bleibt:**
> 1. **Index-Charakter:** eine Zeile pro Aufgabe. Details gehören in eine datierte
>    Topic-Datei daneben (`YYYY-MM-DD-thema.md`), verlinkt aus der Zeile.
> 2. **Budgets** (CI prüft sie, siehe `scripts/check-doc-budgets.sh`):
>    diese Datei ≤ 17 KB, jede Topic-Datei ≤ 6 KB.
> 3. **Rotation:** Log-Einträge älter als ~6 Monate wandern gesammelt nach
>    `ARCHIVE-<jahr>.md` in diesem Ordner. Nichts löschen, nur verschieben.
> 4. **Nichts Privates hier** — das Repo ist öffentlich. Konkrete Adressen, Konten und
>    Zugangsdaten gehören in `local.md` (gitignoriert).
>
> Ist-Zustand der Architektur: `.github/Documentation/ARCHITECTURE.md`.
> Arbeitsregeln: `CLAUDE.md` im Repo-Root.

## Project Identity

- **App**: Mirror – collaborative editor, Personal Space (notes), Calendar, Planning
- **URL**: https://mymirror.myinterdesk.net
- **Repo**: `/Users/steffen/Documents/GitHub/mirror`
- **Deploy**: Fly.io (`mirror-snowy-sound-8093`, region `fra`), auto-deploy on `git push main`. `FLY_API_TOKEN` lives ONLY as a GitHub Actions secret — no local fly login.

## Access (Prod DB / Fly)

- Fly-Token im **macOS-Keychain**, Service `mirror_fly_token` (NICHT im Klartext speichern). Abruf: `FLY_API_TOKEN="$(security find-generic-password -s mirror_fly_token -w)"`
- Prod-DB durchsuchen (Container hat nur `better-sqlite3` via node, kein `sqlite3`): base64-Node-Skript in `/app`, z.B. `fly ssh console -a mirror-snowy-sound-8093 -C "sh -c 'cd /app && echo <B64> | base64 -d | node'"`. DB: `/data/mirror.sqlite`, Tabellen u.a. `notes`, `notes_trash` (`id,user_id,text,tags_json,updated_at`/`deleted_at`).

## Login / Auth (Magic-Link)

- **⚠️ Zwei Konten, leicht zu verwechseln:** das **echte Notizkonto** des Users (user_id 1, ~117 Notizen) und die **Claude-Konto-Adresse** (user_id 4, in Mirror LEER). Login-Tests IMMER gegen das echte Notizkonto. Notizen sind pro **exakter** E-Mail getrennt — eine falsche Adresse sieht aus wie „alle Notizen weg". **Die konkreten Adressen stehen in `local.md`** (gitignoriert, öffentliches Repo).
- App speichert KEINE Standard-Login-Mail — `modalPrompt` fragt jedes Mal neu. `#psEmail` = nur Anzeige des eingeloggten Kontos.
- **Login = Magic-Link**, kein Passwort. `requestPersonalSpaceLink()` → POST `/api/personal-space/request-link` → `sendMagicLinkEmail()` (server.js ~2540) → GET `/verify?token=` setzt Cookie. Tabelle `login_tokens`, TTL 30 Min.
- **SMTP = Gmail** via Fly-Secrets (`SMTP_*`, `MAIL_FROM`). `SMTP_PASS` = Gmail-App-Passwort (braucht 2FA).
- **⚠️ Häufigster Login-Fehler:** Google-Konto-PW geändert → App-Passwörter ungültig → SMTP `535-5.7.8 BadCredentials` → `{sent:false,reason:"send_failed"}` → Toast „SMTP send failed". **Fix:** neues App-PW (https://myaccount.google.com/apppasswords), `fly secrets set SMTP_PASS="…" -a mirror-snowy-sound-8093`. Verifizieren: `curl -X POST .../api/personal-space/request-link -d '{"email":"…"}'` → `sent:true`. (Zuletzt 2026-07-08.)

## Documentation (repo)

Projekt-Doku in **`.github/Documentation/`** — jede Datei mit eigener Lebensdauer:
`ARCHITECTURE.md` (**Ist-Zustand, wird überschrieben** — hier nachsehen, wie etwas gebaut ist),
`FUNCTIONS.md` (Funktionskatalog, nach `#tag` greppen), `DOCUMENTATION.md` (datierter Changelog),
`CHANGELOG-ARCHIVE.md` (Altbestand 2026-02…08), `FEATURES.md` + `todo.md` (Backlog).
`Project-overview.md` ist nur noch ein Wegweiser-Stub. **Neue Features dort dokumentieren**, nicht nur im Memory.

## Stack Summary

| Layer | Details |
|---|---|
| Frontend | Vanilla JS (`app.js` ~34k lines), `index.html`, `styles/app.css` |
| Backend | Node.js ES modules (`server.js`), WebSocket (`ws`), Yjs CRDT, SQLite (`better-sqlite3`) |
| Styling | Tailwind (vorkompiliert, `vendor/tailwind-built.css`) + custom CSS in `app.css` |
| Deploy | Fly.io + Docker, persistent volume `/data`, suspend mode |

## Key Architectural Patterns

- **No build step im Dev** — Quelldateien direkt editieren. CSS/JS-Build (Tailwind + esbuild-Minify) läuft nur im Docker-Build.
- **Single JS file** — all frontend logic in `app.js`
- **Mobile layout** via JS body-class toggle: `mobile-editor-open`, `mobile-note-open`, `mobile-ps-open`, `mobile-preview-open`, `mobile-calendar-open` (breakpoint `max-width: 1023px`; helper `isMobileViewport()`)
- **Themes**: 7 themes via `body[data-theme]` (incl. bronzeDark), CSS vars `--accent-*`. Neues Dark-Theme MUSS alle `--accent-*` in seinem Block überschreiben.
- **Z-index scale**: overlays 30 → panels 40 → mobile fullscreen 70 → modals 9998–9999
- **PS persistence**: server SQLite + IndexedDB offline queue (`mirror_offline_v1`) + localStorage "black box" ring buffer (`mirror_ps_local_backup_v1`). Trash mit `/restore`, retention 365 Tage.
- **Markdown-Vorschau**: markdown-it mit Custom-Rules in `ensureMarkdown()` (`||passwort||`, `==highlight==`, Farb-Chips). **Die Haupt-Vorschau ist ein iframe, dessen CSS `updatePreview()` als String erzeugt** — `styles/app.css` greift dort NICHT.

## Mobile CSS Rules (Critical)

- Always `touch-action: manipulation` + `-webkit-tap-highlight-color: transparent` on mobile buttons
- Fullscreen mobile panels: `height: 100vh; height: 100dvh; bottom: auto;` (NICHT `inset: 0` allein — keyboard issue). `100dvh` = iOS keyboard.

## Design System

- **Aesthetic**: glass morphism, dark UI, fuchsia/purple accent (`#d946ef` family)
- **Backdrop**: `backdrop-filter: blur(24px) saturate(1.5)`; radius 8/10/12/16–20px; transitions 0.15–0.25s (`transform`+`opacity`)
- **Show/hide**: `visibility`+`opacity`+`pointer-events` (nicht `display`)
- **CSS specificity trap**: light themes nutzen `body[data-theme="X"] .bg-slate-950/80 {!important}` (0,0,2,1) — modal overrides müssen `#modalId .class` nutzen.

## AI Roles / Skills

`/app-dev` (full-stack), `/ui-designer` (visual/CSS), `/mirror-dev` (both).

## Commit Workflow (MANDATORY)

**Stehende Freigabe (User, 2026-07-01):** commit, push, PR erstellen UND PR nach `main` mergen (→ Fly-Prod-Deploy) dauerhaft freigegeben — nicht nachfragen, durchführen, danach Deploy + Prod verifizieren.
- Seit 2026-07-13 sind `Bash(git push:*)`, `Bash(gh pr create:*)`, `Bash(gh pr merge:*)`, `Bash(gh pr edit:*)` in `~/.claude/settings.json` freigegeben → Selbst-Merge läuft ohne Classifier-Block. **ABER** `git reset --hard`/`--force` bleiben blockiert → Cleanup nicht-destruktiv (`git stash push <file>` + `git merge --ff-only origin/main` + `git stash drop`). settings.json darf ich NICHT selbst ändern (Self-Modification).
- Before every `git commit + push`: `gitstamp.txt` (`YYYY-MM-DD HH:MM:SS <short-hash>`) aktualisieren, in gleichem/Follow-up-chore-Commit.
- **Cache-Busting (bei sichtbaren app.js/index.html-Änderungen):** SW nutzt stale-while-revalidate + precached `index.html`. gitstamp allein reicht NICHT. IMMER: (1) `?v=DATUM` an `/app.js` in `index.html` (preload + script) hochzählen, (2) gleiche Version in `sw.js` PRECACHE_URLS, (3) `CACHE_NAME` in `sw.js` bumpen. Danach 1–2× neu laden.

---

## ⚠️ Stehende Fallen (vor jeder Aufgabe lesen)

- **WORKTREE-BRANCH:** Für neue Arbeit IMMER `git fetch origin main && git checkout -b <neu> origin/main` — nicht auf altem Worktree-Branch aufsetzen. Vorab `git rev-list --count HEAD..origin/main` prüfen.
- **WORKTREE-EDIT (zweimal passiert):** Edits an den Haupt-Repo-Pfad `…/mirror/app.js`, während git im Worktree läuft → Commit ohne app.js, Fix „verloren" trotz korrektem gitstamp. In Worktree-Sessions Edits + git NUR mit absoluten Worktree-Pfaden ODER ganz ohne `cd`. Nach dem Commit `git show --stat HEAD` prüfen, nach dem Deploy `curl <prod>/app.js?v=… | grep -c "<literal>"`. Detail: `2026-07-13-ps-sort-modified-fix.md`.
- **PROD-BUNDLE IST MINIFIED:** Funktionsnamen sind gemangelt → in Prod-`app.js` nur nach **String-Literalen** grepen (Keys, CSS-Klassen), nie nach fn-Namen. Detail: `2026-07-15-room-restore-and-minify.md`.
- **SW CACHT AGGRESSIV:** Beim lokalen Testen zuerst SW unregistern + `caches.delete`.
- **TDZ bei Raum-Init:** läuft top-level VOR den `*_KEY`-consts → dort keine localStorage-Logik; Keys als Literal lesen. Sicherer Ort: `maybeApplyStartupFavoriteFromPs`.
- **Lokaler Serverstart scheitert** (`better-sqlite3` ABI) → für Browser-Tests Frontend statisch servieren; Vorschau/Editor sind reines Client-Rendering.

---

## Completed Tasks Log (eine Zeile je Aufgabe; Details in den Topic-Dateien)

<!-- ROTATION: Einträge älter als ~6 Monate gesammelt nach ARCHIVE-<jahr>.md verschieben
     (nicht löschen). Ältester Eintrag aktuell 2026-03-07 → nächste Rotation ab ca. 2026-09. -->


- **2026-08-16** Analyse „Bild wird in der Vorschau nicht angezeigt" (kein Code-Fix): im Notiztext stand `[name](…)` statt `![name](…)` — das `!` war beim Einfügen verrutscht. **MERKE:** Upload-URLs haben immer ein Zufalls-Präfix (`/uploads/<originalname>` = 404); `Content-Type: image/png` beweist nichts (endungsabgeleitet); die blob:-Vorschau ist durch `<base href>` entlastet. Offene Härtung: Upload-Auth/Typprüfung (Details in `local.md`). Detail: `2026-08-16-upload-preview-image-bug.md`.
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
- **2026-03-09** Upload delete cleans PS note links — `removeUploadLinksFromNotes()` in `deleteUpload()`.
- **2026-03-09** WCAG AA contrast fix light themes (coffee/bitter/monoLight). `d3e30ce`.
- **2026-03-07** Mobile Toolbox Fix — `100dvh` + `bottom:auto` on editorPanel; touch-action. `dd37f6d`.
- **2026-03-07** AI Skill Setup — `CLAUDE.md`, skills, MEMORY.md angelegt.

---

## Open / Known Issues

- **Cold-Start (~5s weißer Bildschirm) — ADRESSIERT 2026-07-15 via Keep-Alive** (`.github/workflows/keep-alive.yml`, GH Actions cron `*/5`, intern 5× Ping/60s → durchgehend warm; public repo = gratis; pingt `/gitstamp.txt`). **Kosten-Realität:** warme Fly-Maschine ≈ gleiche Compute-Kosten wie `min_machines_running=1` (~5$/Mon) — nur das GH-Pingen ist gratis, die Suspend-Ersparnis entfällt. User kann den Workflow deaktivieren. Fly warm ~250ms, gzip aktiv.
- PS Black-Box recovery ist console-only (`window.mirrorLocalBackups` / `mirrorRestoreBackup`) — keine Settings-UI.
- Prod DB access via Keychain token (`mirror_fly_token`) — siehe Access.
- Local server boot fails on `better-sqlite3` ABI mismatch — nur lokal; Docker prod fine.
- Fix B des Raum-Restores (echtes Login am Handy) ist vom User noch nicht real gegengetestet.

## Design Decisions

- Toolbox panel slides from right (`translateX(40px)`→`0`), left of trigger; `#commentPanel` z-40 hides toolbox (z-30) when open.
- Search bar `#editorSearchBar` = sibling of `#editorToolbox`.
