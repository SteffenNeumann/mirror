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
- **PROD-VERIFIKATION MIT ZU WEITEM `grep`:** `curl <prod>/styles/app.css | grep -q "box-shadow: none"` meldete sofort Erfolg, obwohl der Deploy noch lief — der String steht Dutzende Male in der Datei. Polling-Bedingungen IMMER auf den Block eingrenzen (`grep -A6 '^#psMetaYaml' | grep -q …`) und die Trefferstelle mit ausgeben, sonst verifiziert man den Vorzustand.
- **PROD-BUNDLE IST MINIFIED:** Funktionsnamen sind gemangelt → in Prod-`app.js` nur nach **String-Literalen** grepen (Keys, CSS-Klassen), nie nach fn-Namen. Detail: `2026-07-15-room-restore-and-minify.md`.
- **SW CACHT AGGRESSIV:** Beim lokalen Testen zuerst SW unregistern + `caches.delete`.
- **TDZ bei Raum-Init:** läuft top-level VOR den `*_KEY`-consts → dort keine localStorage-Logik; Keys als Literal lesen. Sicherer Ort: `maybeApplyStartupFavoriteFromPs`.
- **Lokaler Serverstart scheitert** (`better-sqlite3` ABI) → für Browser-Tests Frontend statisch servieren; Vorschau/Editor sind reines Client-Rendering.
- **AUTO-DEPLOY KANN NACH MERGE AUSBLEIBEN:** Bei PR #39 (2026-09-13) blieb der `Fly Deploy`-Workflow nach `gh pr merge` aus (kein Push-Event-Run für den Merge-Commit, andere Workflows liefen normal) — Ursache nicht geklärt, ggf. GitHub-Webhook-Aussetzer. Nach jedem Merge **prüfen, nicht annehmen:** `gh run list --workflow="Fly Deploy" --limit 1` bzw. `fly releases -a mirror-snowy-sound-8093` gegen die Merge-Zeit abgleichen. Fehlt der Run: `FLY_API_TOKEN="$(security find-generic-password -s mirror_fly_token -w)" fly deploy --remote-only -a mirror-snowy-sound-8093` manuell nachholen.

---

## Completed Tasks Log (eine Zeile je Aufgabe; Details in den Topic-Dateien)

- **2026-09-21** Theme **Ash Light** (`ashLight`) — CSS per Skript aus `bitterLight` abgeleitet (243 Blöcke, rein additiv), eigene MD-Token, `isLightSyntax` ergänzt. **MERKE:** helles Theme = ~240 Blöcke statt ~75; nie von Hand, immer ableiten. Details: `2026-09-21-ash-light-theme.md`.
- **2026-09-21** `#codeLang`-Dropdown hatte in allen dunklen Themes fest `#0f172a` → jetzt je Theme deckend (Werte wie `solidBgs`). **MERKE:** Neues Theme = auch `#codeLang` in `styles/app.css` eintragen (steht nicht in der Theme-Checkliste, die per `body[data-theme]`-Block allein nicht greift, weil die Basisregel `!important` trägt).
- **2026-09-21** Chat maximiert: Verlauf füllt jetzt den Platz, Nachrichten ungekürzt (`line-clamp` im Max-Modus aus), `#runOutput` auf `30dvh` + eigener Scroll. **MERKE:** Beim lokalen Test half SW-Unregister + `caches.delete` NICHT — der HTTP-Cache hielt die alte `app.css?v=…`. Erst der `?v=`-Bump lud die neue Datei. Also: Version zuerst hochzählen, dann testen. Nachtrag (PR #51): User wollte die Chat-Reihenfolge Verlauf → Antwort → Eingabe; `#aiPromptRow { order: 1 }` im Max-Modus. **MERKE:** Bei UI-Beschwerden erst fragen, was *genau* stört — ich hatte „Antwort doppelt“ vermutet, gemeint war die Reihenfolge. Detail: `ARCHITECTURE-FEATURES.md#claude-chat-im-vorschau-panel`.
- **2026-09-16** Mobil-Audit iPhone (375×812) + Fix-Paket, PR #47. Schwerster Fund: **stiller CRDT-Datenverlust** — `#noteCloseMobile` erscheint auch im Raum-Editor (`.mobile-only{display:inline-flex !important}` schlägt die Ausblend-Regel ohne `!important`) und leerte die Textarea bedingungslos; ein Tastendruck später war der Raumtext für alle weg (mit zwei Tabs gegen Prod reproduziert, vorher UND nachher). **⚠️ Das X ist zugleich der EINZIGE mobile Einstieg in die Notizliste** — `mobilePsOpen = true` steht nur in diesem Handler; wer es ausblendet, sperrt Handy-Nutzer aus. **MERKE (drei Bugs, eine Ursache): Media Queries erhöhen die Spezifität NICHT** — `.toolbox-btn` verlor gegen `#toolboxPanel .toolbox-btn`, eine 40px-Regel gegen ein altes `!important`, und der Kalender-Fix lag in `min-width:640px` und griff auf keinem Telefon. Vor jedem Mobil-Override die ganze `app.css` greppen und Spezifität rechnen. **Eigene Regression im Fix:** `input,textarea{font-size:16px !important}` traf `#mirror`, nicht dessen vier Overlay-Divs → Metriken liefen auseinander; `#mirror` nie einzeln anfassen, stattdessen `--editor-size`. `styles/app.css` hat jetzt endlich einen `?v=`. Details: `2026-09-16-mobil-audit.md`.
<!-- ROTATION: Sobald diese Datei 85 % ihres Budgets erreicht (siehe
     scripts/check-doc-budgets.sh), wandern die ältesten Einträge nach
     ARCHIVE-<jahr>.md im selben Ordner — verschieben, nicht löschen.
     Zuletzt rotiert: 2026-09-16 (alles vor 2026-09-14 → ARCHIVE-2026.md). -->

- **2026-09-15** „Claude fragen" in voller Höhe: Knopf „Chat maximieren" (`#previewPanel.ai-chat-max`, iframe `display:none`, nicht gespeichert) + Grundfix `max-height:60%`/Eigen-Scroll für `#aiConversationSection`. **MERKE:** In einer Flex-Spalte mit `overflow-hidden`-Eltern braucht **jedes** wachsende Kind eine Höhengrenze (`min-height:0` + Scroll) — sonst drückt es das `flex-1`-Geschwister auf 0 px und der Rest wird lautlos abgeschnitten. `updateRunOutputSizing()` setzt Inline-`max-height`, das CSS nicht überschreibt → im Max-Modus JS-seitig aussetzen. Test-Tipp: Mobil-Layout nur per echtem Klick auf „Vorschau" nach Reload prüfen, Body-Klasse per JS setzen reicht nicht. Detail: `ARCHITECTURE-FEATURES.md#claude-chat-im-vorschau-panel`. User hat es in Prod bestätigt; Nachtrag: `FUNCTIONS.md` §15, gemergte Remote-Branches #41–#45 gelöscht.
- **2026-09-14** Folgefehler zu PR #39: der Schatten war „noch da" und der Meta-Header-**Inhalt weg** — beim Entfernen der `shadow-soft`-Klasse war das schließende `>` des `#psMetaYaml`-Öffnungstags mitgelöscht worden, der `<pre>`-Kindknoten landete so in der Attributliste. **MERKE:** Beim Klassen-Entfernen aus einem **mehrzeilig umbrochenen** Tag (Prettier bricht `class="…">` auf eine eigene Zeile) steht das `>` am Zeilenende der Klassen-Zeile — mit weglöschen ist die Standardfalle. Nach jeder Klassenänderung in `index.html` die Tag-Struktur gegenprüfen (`grep -A2 'id="…"'`). Symptomatik merken: kaputtes Markup sieht aus wie „CSS-Fix hat nicht gewirkt + Inhalt verschwunden", nicht wie ein Syntaxfehler (HTML-Parser meckert nicht). PR #41, `sw.js` CACHE_NAME v51. **Zweiter Anlauf (PR #43):** der Schatten war damit immer noch da — er kam nie aus `shadow-soft`, sondern aus `styles/app.css:248`, wo `#psMetaYaml, #psMetaYamlInline` den **Kalender-Tooltip-Schatten** erben (`box-shadow: var(--calendar-tooltip-shadow)`); dort jetzt `none`. **MERKE:** Tailwind-Utilities im Markup sind bei diesen IDs nur die halbe Wahrheit — es gibt einen ID-Regelblock in `app.css`, der mit `!important` gegen die Utility-Klassen arbeitet. Vor einem „Klasse entfernen“-Fix IMMER erst `grep -A6 '^#<id>' styles/app.css` prüfen. `app.css` hat keinen `?v=` → nur der `CACHE_NAME`-Bump (v52) wirkt.
---

## Open / Known Issues

- **Cold-Start (~5s weißer Bildschirm) — ADRESSIERT 2026-07-15 via Keep-Alive** (`.github/workflows/keep-alive.yml`, GH Actions cron `*/5`, intern 5× Ping/60s → durchgehend warm; public repo = gratis; pingt `/gitstamp.txt`). **Kosten-Realität:** warme Fly-Maschine ≈ gleiche Compute-Kosten wie `min_machines_running=1` (~5$/Mon) — nur das GH-Pingen ist gratis, die Suspend-Ersparnis entfällt. User kann den Workflow deaktivieren. Fly warm ~250ms, gzip aktiv.
- PS Black-Box recovery ist console-only (`window.mirrorLocalBackups` / `mirrorRestoreBackup`) — keine Settings-UI.
- Prod DB access via Keychain token (`mirror_fly_token`) — siehe Access.
- Local server boot fails on `better-sqlite3` ABI mismatch — nur lokal; Docker prod fine. **Workaround für Frontend-Tests (2026-09-16):** statisch servieren reicht NICHT, ohne API-Antworten kollabiert das Layout. Kleiner Python-Server mit Stubs für `/api/identity`, `/api/personal-space/me`, `/api/saved-queries`, `/api/rooms/*/comments` → App rendert normal. Rezept in `2026-09-16-mobil-audit.md`.
- Fix B des Raum-Restores (echtes Login am Handy) ist vom User noch nicht real gegengetestet.
- **Farbschema „Theme-Akzent" ist bei 10 von 12 Themes unter AA** — `--md-heading: var(--accent-strong)`, und `--accent-strong` ist eine halbtransparente **Füllfarbe**. Gedeckt über der Editor-Fläche: violet 1,9:1, fuchsia/coffeeLight 2,7:1; nur bitterDark schafft AA. Für Ash am 2026-09-03 gefixt, der Rest bewusst offen (User: passt so). Fix wäre eine Zeile: `--md-heading` auf eine deckende Akzentfarbe legen.

## Design Decisions

- Toolbox panel slides from right (`translateX(40px)`→`0`), left of trigger; `#commentPanel` z-40 hides toolbox (z-30) when open. **Mobil (≤1023px) ist `.editor-toolbox` beidseitig begrenzt (`left: 8px`, `justify-content: flex-end`) und `.toolbox-panel` schrumpft per `min-width: 0` + `overflow-x: auto`** — ohne das ragte der 408-px-Streifen links aus dem Bild.
- Search bar `#editorSearchBar` = sibling of `#editorToolbox`.
