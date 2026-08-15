# Mirror – Architektur (Ist-Zustand)

> **Diese Datei beschreibt, wie Mirror JETZT gebaut ist.** Sie wird bei Änderungen
> **überschrieben, nicht ergänzt** — es gibt hier keine datierten Abschnitte.
> Historie steht in [DOCUMENTATION.md](DOCUMENTATION.md) und
> [CHANGELOG-ARCHIVE.md](CHANGELOG-ARCHIVE.md), Funktionsdetails in
> [FUNCTIONS.md](FUNCTIONS.md), Arbeitsregeln in `CLAUDE.md` im Repo-Root.
>
> Budget: **max. 15 KB.** Wird es enger, gehört der Zuwachs woanders hin.

## Was Mirror ist

Kollaborativer Echtzeit-Editor mit vier Säulen: geteilter **Editor** (CRDT), **Personal
Space** (persönliche Notizen mit Tags, Wiki-Links, Query-Engine), **Kalender** inkl.
gemeinsamer Terminfindung, und **Planung/Tools** (Kommentare, Uploads, AI, Excalidraw).

Produktion: <https://mymirror.myinterdesk.net> · Fly.io (`mirror-snowy-sound-8093`,
Region `fra`, Suspend-Modus + Keep-Alive-Ping) · Auto-Deploy bei Push auf `main`.

## Stack

| Layer | Technologie |
|---|---|
| Frontend | Vanilla JS in **einer** Datei `app.js` (~34k Zeilen), `index.html`, `styles/app.css` |
| Styling | Tailwind **vorkompiliert** (`vendor/tailwind-built.css`) + Custom-CSS |
| Backend | Node.js ES-Module (`server.js`), HTTP-API + statische Files |
| Echtzeit | WebSocket (`ws`) + Yjs-CRDT, Awareness für Presence |
| Datenbank | SQLite via `better-sqlite3`, `/data/mirror.sqlite` (Fly-Volume) |
| Offline | Service Worker (`sw.js`) + IndexedDB-Queue + localStorage-Backup |
| Deploy | Docker auf Fly.io; Build-Schritt nur im Image (Tailwind + esbuild-Minify) |

**Kein Build-Schritt in der Entwicklung** — Quelldateien werden direkt editiert. Erst
der Docker-Build kompiliert Tailwind und minifiziert `app.js` (die Quelle bleibt
unminifiziert).

## Dateien und Zuständigkeiten

| Datei | Rolle |
|---|---|
| `app.js` | **Sämtliche** Frontend-Logik, keine Module, kein Bundler |
| `index.html` | Vollständiges UI-Markup inkl. aller Modals und Settings-Sektionen |
| `styles/app.css` | Custom-CSS, Theme-Overrides, Mobile-Layout |
| `server.js` | WebSocket-Server, SQLite-API, Auth, Mail, File-Serving |
| `sw.js` | Service Worker: Precache + Stale-While-Revalidate |
| `vendor/` | Selbst gehostete Libs (markdown-it, highlight.js, Yjs, force-graph, Tailwind-CSS, JetBrains Mono) |

Alle Fremd-Libs sind **vendored**, keine CDN-Abhängigkeit — sonst funktioniert die App
offline nicht (siehe Fallen).

## Startsequenz

**Client:**

```
App-Start
  ├─ initUiEventListeners()   UI-Events → updatePreview / connect / savePersonalSpaceNote
  ├─ initStartupTasks()       Sprache, Auto-Backup/-Import, Diktat,
  │                           refreshPersonalSpace(), loadCommentsForRoom()
  ├─ Service Worker           Asset-Cache (Stale-While-Revalidate)
  └─ IndexedDB                notes / pendingOps / meta
```

**Server** (im `server.listen`-Callback, Reihenfolge ist bindend):

1. `initDb()` — DB + Prepared Statements. **Muss vor jedem DB-Zugriff laufen**; die
   `stmt*`-Statements existieren vorher schlicht nicht.
2. Cleanup alter Availability-Einträge (> 30 Tage)
3. `refreshLatestModel()` — aktuelles AI-Modell von der Anthropic-API
4. Intervalle: Cleanup alle 24 h, Modell-Refresh alle 6 h

## Raum- und Scope-Modell

Ein Raum ist ein Paar aus `room` + `key` (aus dem URL-Hash). **Die Raumwahl hängt
nicht am Login.** Reihenfolge: URL-Hash → zuletzt genutzter Raum aus localStorage →
Startup-Favorit aus dem Account → sonst neuer Zufallsraum.

User **ohne** Personal Space nehmen vollwertig teil — es gibt kein Gastraum-Konzept,
sondern einen **Room-Scope** statt eines Note-Scopes:

```
getCommentScopeId():
  isRoomMarkedShared(room, key)  → "room:<room>:<key>[:n:<noteId>]"
  psEditingNoteId gesetzt        → "note:<noteId>"
  sonst                          → "room:<room>:<key>"
```

Dasselbe Fallback nutzen `getExcalidrawNoteId`, `getExcelNoteId`, `getLinearNoteId`.
Ein Raum gilt automatisch als geteilt, sobald der `presence_state`-Handler fremde
`clientId`s sieht, ein `room_pin_state` mit `shared: true` eintrifft, oder der User
den Link explizit teilt (`markCurrentRoomShared()`).

## Personal Space: Persistenz in drei Schichten

```
Online    savePersonalSpaceNote() → API + offlinePutNotes()   (Spiegel)
Offline   savePersonalSpaceNote() → offlineSaveNote() + offlineEnqueueOp()
Reconnect replayOfflineOps()      → API-Replay + offlineClearOps()
```

1. **Server-SQLite** — die Wahrheit. Tabellen u. a. `notes`, `notes_trash`
   (Papierkorb mit `/restore`, 365 Tage Aufbewahrung).
2. **IndexedDB** (`mirror_offline_v1`) — Offline-Spiegel + Operations-Queue.
   `offlinePutNotes` macht **Full-Sync** (clear + put), damit keine Ghost-Notizen
   entstehen.
3. **localStorage-„Black Box"** (`mirror_ps_local_backup_v1`) — Ringpuffer als letztes
   Netz. Wiederherstellung nur über die Konsole (`window.mirrorLocalBackups`,
   `mirrorRestoreBackup`), keine Settings-UI.

**Cross-Device-Sync:** `schedulePsAutoRefresh()` bei Tab-Fokus und alle 60 s
(Debounce 5 s) → `refreshPersonalSpace()` → `/api/personal-space/me`.

**Duplikat-Abwehr** an mehreren Stellen: `filterRealNotes` entdoppelt nach ID
(neuestes `updatedAt` gewinnt), `psSaveNoteInFlight` ist ein Mutex gegen parallele
Saves, `findNoteByText` erkennt inhaltsgleiche Notizen vor dem Anlegen, und der Server
prüft `contentHash` und `title_hash`.

⚠️ **Jeder PUT stempelt `updatedAt = Date.now()`.** No-Op-Saves müssen deshalb **vor**
dem PUT abgefangen werden, sonst springen Notizen in der Sortierung „Geändert" nach oben.

## Login / Auth

Magic-Link, kein Passwort: `requestPersonalSpaceLink()` → `POST
/api/personal-space/request-link` → `sendMagicLinkEmail()` → `GET /verify?token=` setzt
das Cookie. Tabelle `login_tokens`, TTL 30 Minuten. Versand über SMTP (Gmail-App-Passwort
in den Fly-Secrets `SMTP_*` / `MAIL_FROM`). Notizen sind pro **exakter** E-Mail getrennt.

## Markdown-Vorschau

markdown-it mit `html: false`, `linkify`, `breaks`, `typographer`, lazy geladen
(`ensureMarkdownLibs`). Custom-Rules leben in `ensureMarkdown()`:

| Syntax | Typ | Ergebnis |
|---|---|---|
| `\|\|geheim\|\|` | Inline-Rule | maskiertes Passwortfeld |
| `==Text==`, `=={rot}Text==` | Inline-Rule | `<mark>` mit optionaler Farbe |
| `/FF6115/`, `#FF6115` | **Core-Rule** | Farbkreis + Hex-Label |
| `[[Titel]]` | Vorverarbeitung | Link `note:<id>` vor dem Rendern |

⚠️ **Zwei Fallen, die jede neue Regel betreffen:**

1. Die `text`-Rule ist gepatcht (`textWithPipe`), damit `|` als Terminator gilt. Ein
   Zeichen, das **nicht** in `isTerminatorOrPipe` steht, erreicht keinen Inline-Tokenizer
   — der Text-Scanner verschluckt es vorher. Für solche Delimiter **Core-Rule statt
   Inline-Rule** (`md.core.ruler.push`), dann sind Code-Spans und Fences gratis geschützt.
   Core-Rules brauchen dann aber Link-Tiefen-Tracking über `link_open`/`link_close`.
2. **Die Haupt-Vorschau ist ein iframe, dessen CSS `updatePreview()` als String
   erzeugt** — `styles/app.css` greift dort **nicht**. Vorschau-Styles müssen immer an
   zwei Stellen: in den iframe-`<style>` **und** nach `styles/app.css` (für PS-Karten
   via `renderNoteHtml` und für Kommentare, die ohne `.md-content`-Wrapper rendern).

## Kalender: gemeinsame Terminfindung

Zwei Modi (`calendarMode`): `personal` und `planning`. Im Planning-Modus wird das Teilen
automatisch aktiviert.

```
Tage wählen → toggleDayAvailability() → manualFreeSlots: Map<"YYYY-MM-DD", Set>
            → broadcastAvailability()  ──WS "availability_state"──▶ Server
Server validiert (busy ≤ 200 Intervalle, selectedDays ≤ 60) und broadcastet an alle
            ◀── handleAvailabilityState() → renderCommonFreeSlots() + renderCalendarPanel()
```

`computeCommonSelectedDays()` bildet die Schnittmenge aller Teilnehmer;
`renderParticipantIndicators(day)` zeichnet farbige Punkte plus „2/3"-Badge ins Grid.
Empfangene Daten liegen in `availabilityByClient: Map<clientId, AvailabilityData>`
mit `{ name, color, busy[], selectedDays[], rangeStart, rangeEnd }`.

## Notiz-Graph

Vollbild-Overlay `#noteGraphOverlay`, reine Client-Ansicht über vorhandene Daten —
**kein Backend- oder Schema-Change**. Alle Funktionen sind `ng`-präfixiert.

```
psState.notes → filterRealNotes → ngBuildData {nodes, links} → ngViewData (Global|Lokal)
              → ForceGraph().graphData()  (Canvas)
```

Kanten aus `[[Wiki-Links]]`, optional aus geteilten Tags (default **aus**, gekappt bei
8 Notizen pro Tag). Knotengröße skaliert mit dem Verlinkungsgrad. Split-View: Liste
(`#ngSidebar`) und Canvas sind zwei Ansichten **einer** Auswahl — beide laufen durch
`ngSetSelection(id, {source})`, damit nichts auseinanderdriftet.

⚠️ Canvas erbt kein CSS. Farben kommen per `getComputedStyle` aus den `--accent-*`.
Die Textfarbe wird aus der **Hintergrund-Luminanz** abgeleitet, weil `body color` auf
mehreren Dark-Themes schwarz ist. In `ngInit` ist `.autoPauseRedraw(false)` zwingend,
sonst friert `cooldownTicks` das Rendering ein.

## Query-Engine (PS-Suchfeld)

Operatoren: `tag:` · `task:open` · `task:done` · `has:task` · `has:link` · `kind:` ·
`created:>` · `updated:<` · `pinned:`. Bei Task-Queries erscheint ein aggregiertes
Ergebnis-Panel über der Notizliste. Zuständig: `parseQueryTokens`,
`noteMatchesStructuredQuery`, `renderQueryResults`.

## Themes und Layout

- **7 Themes** über `body[data-theme]`, gesteuert durch die CSS-Variablen `--accent-bg`,
  `--accent-border`, `--accent-text`, `--accent-text-soft` u. a. `applyTheme` setzt sie
  zur Laufzeit auf `documentElement`. Ein neues Dark-Theme **muss alle** `--accent-*`
  in seinem Block überschreiben.
- ⚠️ `--accent-text` ist auf Light-Themes `#fff` — gedacht als Text *auf* Akzentfüllung,
  nicht auf hellem Panel. Wer es als Textfarbe nutzt, braucht ein Override.
- **Mobile** über JS-getoggelte Body-Klassen: `mobile-editor-open`, `mobile-note-open`,
  `mobile-ps-open`, `mobile-preview-open`, `mobile-calendar-open`. Breakpoint
  `max-width: 1023px`, Helfer `isMobileViewport()`.
- **Z-Index-Skala:** Overlays 30 → Panels 40 → Mobile-Vollbild 70 → Modals 9998–9999.
- **Mobile-Pflicht:** `touch-action: manipulation` + `-webkit-tap-highlight-color:
  transparent` auf Buttons; Vollbild-Panels `height: 100dvh` mit `bottom: auto`
  (nicht `inset: 0` allein — sonst Tastatur-Problem auf iOS).
- ⚠️ **Spezifitätsfalle:** Light-Themes nutzen `body[data-theme="X"] .bg-slate-950/80
  { … !important }` (0,0,2,1) — Modal-Overrides müssen daher `#modalId .class` nutzen.

## Offline-Fähigkeit

Service Worker precached alle Assets und liefert Stale-While-Revalidate. Bei Offline
schreiben `savePersonalSpaceNote` und `…Snapshot` lokal; `refreshPersonalSpace` fällt
auf die IndexedDB zurück. Bei `window.online` oder WS-Reconnect werden die
Queue-Operationen sequentiell nachgesendet, temporäre `offline_*`-IDs durch Server-IDs
ersetzt.

⚠️ **Deshalb sind alle Libs vendored:** cross-origin Responses sind *opaque*
(`ok === false`) und werden von einem `.ok`-gegateten `cache.put` **nie** gespeichert.
CDN-Abhängigkeiten sind offline tot.

## Cache-Busting (bei jeder sichtbaren Frontend-Änderung Pflicht)

Der SW cached aggressiv, `gitstamp` allein reicht **nicht**. Immer alle drei:

1. `?v=<datum>` an `/app.js` in `index.html` hochzählen (Preload **und** Script-Tag)
2. dieselbe Version in `sw.js` → `PRECACHE_URLS`
3. `CACHE_NAME` in `sw.js` bumpen

Seit v42 lädt die App bei `controllerchange` automatisch neu, ältere Installationen
brauchen ggf. einen manuellen Reload.

## Wo was nachschlagen

| Frage | Datei |
|---|---|
| Wie arbeite ich in diesem Repo? | `CLAUDE.md` (Root) |
| Wie ist es gebaut? | **diese Datei** |
| Welche Funktion macht was? | [FUNCTIONS.md](FUNCTIONS.md) (nach `#tag` greppen) |
| Was wurde wann geändert? | [DOCUMENTATION.md](DOCUMENTATION.md), älter: [CHANGELOG-ARCHIVE.md](CHANGELOG-ARCHIVE.md) |
| Was ist geplant? | [FEATURES.md](FEATURES.md), [todo.md](todo.md) |
| Erfahrungen aus früheren Aufgaben | `.claude/memory/MEMORY.md` |
