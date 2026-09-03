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
> 3. **Rotation:** Sobald diese Datei **85 %** ihres Budgets erreicht, wandern die
>    ältesten Log-Einträge nach `ARCHIVE-<jahr>.md` in diesem Ordner — verschieben,
>    nicht löschen. (Die frühere Regel „älter als ~6 Monate" hielt mit dem Wachstum
>    nicht Schritt; die Datei lief voll, bevor die Frist erreicht war.)
> 4. **Nicht wiederholen, was in `ARCHITECTURE.md` steht.** Doppelte Fakten veralten
>    hier zuerst und werden dann geglaubt.
> 5. **Nichts Privates hier** — das Repo ist öffentlich. Konkrete Adressen, Konten und
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
`ARCHITECTURE.md` (**Ist-Zustand querliegend, wird überschrieben** — hier nachsehen, wie etwas gebaut ist),
`ARCHITECTURE-FEATURES.md` (Ist-Zustand **je Feature**, nur den passenden Abschnitt lesen),
`FUNCTIONS.md` (Funktionskatalog, nach `#tag` greppen), `DOCUMENTATION.md` (datierter Changelog),
`CHANGELOG-ARCHIVE.md` (Altbestand 2026-02…08), `FEATURES.md` + `todo.md` (Backlog).
`Project-overview.md` ist nur noch ein Wegweiser-Stub. **Neue Features dort dokumentieren**, nicht nur im Memory.

## Architektur — steht woanders

Stack, Startsequenz, Raum-/Scope-Modell, PS-Persistenz, Themes, Z-Index-Skala,
Mobile-Regeln, Markdown-Vorschau, Offline und Cache-Busting stehen **vollständig und
aktuell** in [`.github/Documentation/ARCHITECTURE.md`](../../.github/Documentation/ARCHITECTURE.md).
Hier bewusst **nicht** wiederholt — die Kopie war zuletzt veraltet (sie sprach noch von
7 Themes, als es 12 waren). Fakten stehen genau einmal.

Was hier steht, steht *nicht* dort: Zugänge, Login-Fallstricke, die stehenden Fallen
und das Aufgaben-Log.

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

<!-- ROTATION: Sobald diese Datei 85 % ihres Budgets erreicht (siehe
     scripts/check-doc-budgets.sh), wandern die ältesten Einträge nach
     ARCHIVE-<jahr>.md im selben Ordner — verschieben, nicht löschen.
     Zuletzt rotiert: 2026-09-03 (alles vor 2026-08-01 → ARCHIVE-2026.md). -->

- **2026-09-03** Doku-Struktur: `ARCHITECTURE.md` nach **Lesehäufigkeit** geteilt. Querliegendes bleibt dort (budgetiert, ganz gelesen), Feature-Interna nach `ARCHITECTURE-FEATURES.md` (wächst, abschnittsweise gelesen). **Warum:** die Datei startete am 2026-08-15 schon bei 79 % und wächst ~3,4 KB/Monat — Budget anheben hätte nur ~2 Monate gekauft. 92 % → 81 %. **MERKE:** aus einem Ist-Zustand **nie** auf eine datierte Datei in `.claude/memory/` verweisen — die sind Protokolle und werden nicht nachgeführt; genau den Fehler hatte ich am selben Tag gemacht.
- **2026-09-03** Theme **„Ash"** aus `sku-menubar` nach Mirror portiert (flach: Grund, Sidebar und Panels alle `#262a2c`, Steel-Blue `#6c96b4`, kein Glow). **MERKE:** zwei Theming-Systeme — JS schreibt Variablen auf `<html>`, CSS auf `<body>`, die UI nimmt **immer den CSS-Wert**; nur `--modal-backdrop`/`--modal-border` kommen aus JS. Das Vorschau-iframe liest direkt aus `THEMES` → beide Seiten deckungsgleich halten (bronzeDark divergiert real). 4 leicht übersehene CSS-Gruppen: `.ps-tags-bar-inner`, `.excel-iframe`-Invert, `.ps-note-pin svg path`, `.calendar-day-today`. Nachtrag: MD-Hervorhebung war nicht kaputt, nur unlesbar — `--accent-strong` ist eine **Füll-, keine Textfarbe** (Akzent-Schema: violet 1,9:1, ash 3,2:1); Ash-Marker + Akzent-Überschrift angehoben, Tags-Leisten-Schatten entfernt. **Test-Falle:** eingefrorene CSS-Transitions lassen `getComputedStyle` alte Farben liefern — erst Reflow erzwingen. Details: `2026-09-03-ash-theme.md`, `2026-09-03-md-highlight-contrast.md`.
- **2026-08-25** Vergleichs-Panel: zweite Notiz **read-only** neben dem Editor (`#comparePanel`, Button „Vergleichen" + **Alt+Klick** in der Liste, v45). **MERKE:** Tabs gibt es längst — als *Raum*-Tabs (`hashchange` → WS/CRDT-Neuaufbau, nie zwei gleichzeitig sichtbar). Ein zweiter *editierbarer* Editor wäre ein Neubau (alles Singleton). **Nie ein zweites Vorschau-iframe** — `previewMsgToken` ist global, ein Checkbox-Klick schriebe in die falsche Notiz. `psEditingNoteId` bleibt unberührt. Tailwind-Preflight resettet Überschriften/Listen — die Vorschau merkt das nicht (iframe ohne Preflight). Nebenbei Altbug gefixt: `setPreviewVisible` überschrieb `className` und verlor `comment-panel-open`/`hidden`. Detail: `2026-08-25-compare-panel.md`.
- **2026-08-25** Vergleichs-Panel ohne Tastenkombi bedienbar (v46): Knopf in jeder Notizzeile + Kontextmenü-Eintrag. **MERKE:** `.ps-note-actions` ist nur bei `:hover` sichtbar — auf Touch führt kein Weg dorthin, deshalb ist der **Kontextmenü-Eintrag** (langes Tippen) der mobile Pfad. Markierung folgt dem Panel, also Listen-Rerender bei Auswahl-/Sichtbarkeitswechsel. Detail: `2026-08-25-compare-panel.md`.
- **2026-08-16** Analyse „Bild wird in der Vorschau nicht angezeigt" (kein Code-Fix): im Notiztext stand `[name](…)` statt `![name](…)` — das `!` war beim Einfügen verrutscht. **MERKE:** Upload-URLs haben immer ein Zufalls-Präfix (`/uploads/<originalname>` = 404); `Content-Type: image/png` beweist nichts (endungsabgeleitet); die blob:-Vorschau ist durch `<base href>` entlastet. Offene Härtung: Upload-Auth/Typprüfung (Details in `local.md`). Detail: `2026-08-16-upload-preview-image-bug.md`.
- **2026-08-15** Doku + Memory nach **Lebensdauer** getrennt (PRs #27/#28, `e5c90e5`). `Project-overview.md` (221 KB, von keiner KI mehr gelesen) → `ARCHITECTURE.md` (Ist-Zustand, wird überschrieben) + `FUNCTIONS.md` + `CHANGELOG-ARCHIVE.md` + Stub. Memory ins Repo (`.claude/memory/`, Claude-Ordner ist Symlink), private Konten nach `local.md` (gitignoriert, Repo ist öffentlich). `CLAUDE.md` nur noch Regeln. **Grundsatz: eine Datei darf wachsen ODER gelesen werden, nie beides** — `scripts/check-doc-budgets.sh` + CI erzwingen das. Detail: `2026-08-15-doc-memory-restructure.md`.
- **2026-08-15** Farb-Chips in der Vorschau (PR #26, `85da9ba`, v44) — `/FF6115/` + `#FF6115` → Farbkreis, Settings→„Editor", Default an. **MERKE:** Inline-Tokenizer auf `/` feuert nie → `md.core.ruler.push`; Preview-Styles immer an zwei Stellen (iframe + app.css). Detail: `2026-08-15-preview-color-chips.md`.
- **2026-08-11** Geräte-Anzeige in Presence + Präsenz auf Mobil wieder sichtbar (PR #25, `c2a6f2f`, v43). **MERKE:** Presence-Felder müssen durch 4 Whitelists, sonst still verschluckt. Detail: `2026-08-11-presence-device-display.md`.

---

## Open / Known Issues

- **Cold-Start (~5s weißer Bildschirm) — ADRESSIERT 2026-07-15 via Keep-Alive** (`.github/workflows/keep-alive.yml`, GH Actions cron `*/5`, intern 5× Ping/60s → durchgehend warm; public repo = gratis; pingt `/gitstamp.txt`). **Kosten-Realität:** warme Fly-Maschine ≈ gleiche Compute-Kosten wie `min_machines_running=1` (~5$/Mon) — nur das GH-Pingen ist gratis, die Suspend-Ersparnis entfällt. User kann den Workflow deaktivieren. Fly warm ~250ms, gzip aktiv.
- PS Black-Box recovery ist console-only (`window.mirrorLocalBackups` / `mirrorRestoreBackup`) — keine Settings-UI.
- Prod DB access via Keychain token (`mirror_fly_token`) — siehe Access.
- Local server boot fails on `better-sqlite3` ABI mismatch — nur lokal; Docker prod fine.
- Fix B des Raum-Restores (echtes Login am Handy) ist vom User noch nicht real gegengetestet.
- **Farbschema „Theme-Akzent" ist bei 10 von 12 Themes unter AA** — `--md-heading: var(--accent-strong)`, und `--accent-strong` ist eine halbtransparente **Füllfarbe**. Gedeckt über der Editor-Fläche: violet 1,9:1, fuchsia/coffeeLight 2,7:1; nur bitterDark schafft AA. Für Ash am 2026-09-03 gefixt, der Rest bewusst offen (User: passt so). Fix wäre eine Zeile: `--md-heading` auf eine deckende Akzentfarbe legen.
- **`styles/app.css` hat als einziges Haupt-Stylesheet keinen `?v=`-Cache-Buster** (`index.html:42`) → Server liefert `max-age=300` statt `immutable`, SW stale-while-revalidate. Ein `CACHE_NAME`-Bump repariert es pro Deploy; strukturell offen. Folge: nach einem CSS-Deploy kann ein Ladevorgang neues `data-theme` mit altem Theme-CSS zeigen.

## Design Decisions

- Toolbox panel slides from right (`translateX(40px)`→`0`), left of trigger; `#commentPanel` z-40 hides toolbox (z-30) when open.
- Search bar `#editorSearchBar` = sibling of `#editorToolbox`.
