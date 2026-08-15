# Changelog-Archiv (aus Project-overview.md, 2026-02 bis 2026-08)

> Historische, datierte Änderungsnotizen. **Kein Ist-Zustand** — der steht in [ARCHITECTURE.md](ARCHITECTURE.md).
> Neue Einträge kommen nach [DOCUMENTATION.md](DOCUMENTATION.md), nicht hierher.

## Aktuelle Änderungen (2026-08-11)

- **Geräte-Anzeige in der Präsenzliste + Präsenz auf Mobil wieder sichtbar** `#presence` `#mobile` `#i18n` `#ux`:

  **Problem 1 — Präsenz auf Mobil unsichtbar.** Seit `035b333` (2026-01-20) startet der Header eingeklappt (`headerCollapsed = isMobileViewport()`). `setHeaderCollapsed()` setzt `hidden` auf alle `[data-header-detail="true"]`-Elemente — und `#presenceSummary` + `#presenceList` liegen in genau so einem Container ([index.html](../../index.html) Header-Block). Auf dem Handy war die Anzeige „N Nutzer online" damit vor dem ersten Paint weg. Verschärfend: `#toggleHeader` nutzt ein Desktop-Hover-Muster (`opacity-0` → `group-hover:opacity-100`) ohne Touch-Fallback und war auf Touch-Geräten faktisch unsichtbar; der Aufklapp-Zustand wurde nicht persistiert und fiel bei jedem Reload/Raumwechsel zurück.

  **Problem 2 — eigene Geräte ununterscheidbar.** Seit `earlyIdentitySync()` (`3bdfec7`) laden alle Geräte dieselbe kontobezogene Identität (Name/Avatar/Farbe) vom Server. Handy und Rechner erschienen als zwei optisch identische Chips; nur der `(du)`-Marker verriet die eigene Session — nicht aber, welches Gerät das war.

  **Lösung — Geräteklasse durch die gesamte Presence-Kette:**
  1. `detectDeviceKind()` (`app.js`, direkt vor `createClientId`-Nutzung) klassifiziert clientseitig in `mobile` / `tablet` / `desktop`. Reihenfolge ist wichtig: Tablet-Erkennung **zuerst** (iPadOS 13+ meldet sich als `Macintosh` und verrät sich nur über `maxTouchPoints > 1`), dann `navigator.userAgentData.mobile`, dann UA-Regex, dann Touch+Viewport-Fallback. Kein Server-seitiges UA-Parsing, keine neue Dependency.
  2. Feld `device` läuft durch **vier Whitelists**, die es sonst still verschlucken würden: `hello`-Payload (3 Sendestellen: `connect()`, nach `syncIdentityFromServer`, nach `saveIdentityFromModal`) → `server.js` `hello`-Handler (baut das Presence-Objekt feldweise neu, validiert jetzt gegen `["mobile","tablet","desktop"]`) → Client-`presence_state`-Handler (baut ebenfalls feldweise neu) → `updatePresenceUI()`.
  3. `createDeviceIcon(kind)` rendert ein Inline-SVG (`currentColor`, theme-neutral) statt Emoji — Telefon/Tablet/Laptop sind so eindeutig unterscheidbar. Eigener Chip zeigt `Name (du · Handy)`, fremde Chips bekommen ein `title` mit Gerätelabel.
  4. Neue Kurzzeile `#presenceCompact` **außerhalb** des `data-header-detail`-Containers: bei eingeklapptem Header immer sichtbar (`1 online · 💻 Computer`), klickbar zum Aufklappen. Bei ausgeklapptem Header ausgeblendet (die volle Chip-Liste ersetzt sie).
  5. Aufklapp-Zustand persistiert in `localStorage` unter `mirror_header_collapsed_v1` (`"1"`/`"0"`); ohne gespeicherten Wert bleibt der bisherige Default `isMobileViewport()`. `#toggleHeader` wird per `@media (hover: none)` auf Touch dauerhaft sichtbar.
  6. i18n DE+EN: `presence.self`, `presence.typing_short`, `presence.compact`, `presence.compact_aria`, `device.mobile|tablet|desktop`. Die bisher hartcodierten deutschen Strings `(du)` und `• tippt` wurden dabei in die i18n-Tabelle überführt.

  **Grenzen:** `clientId` wird bei jedem (Re-)Connect neu vergeben und identifiziert eine WebSocket-Session, kein Gerät — nach einem Netzwechsel können kurzzeitig zwei Chips desselben Geräts stehen, bis der Server die tote Session aufräumt (bestehendes Verhalten). Nicht eingeloggte Gast-Sessions behalten ihren Zufallsnamen, bekommen das Geräte-Icon aber trotzdem.

  **Verifiziert:** `detectDeviceKind()` gegen 14 echte User-Agents (iPhone, iPad klassisch, iPadOS-13+-als-Macintosh, Android-Phone Chrome/Firefox, Android-Tablet, macOS breit/schmal, Windows, Windows-Touch-Laptop Chrome **und Firefox**, Linux-X11-Touch, ChromeOS-Touch, Firefox-iOS) — alle korrekt. Der Touch-Fallback braucht dafür einen Desktop-OS-Ausschluss: ohne ihn galt ein Windows-Touch-Notebook in Firefox (kein `navigator.userAgentData`) bei schmalem Fenster fälschlich als Handy. Browser: Chip-Rendering, Kurzzeile, Persistenz `"0"`/`"1"`, Klick-zum-Aufklappen, Touch-Sichtbarkeit des Toggles, DE+EN.

---

## Aktuelle Änderungen (2026-03-02)

- **Globales Command Palette (Shift+Cmd/Ctrl+P)** `#ux` `#command-palette` `#search` `#keyboard`: Neues globales modales Suchfenster im VS-Code-/Spotlight-Stil. Öffnet sich mit `Shift+Cmd+P` (Mac) bzw. `Shift+Ctrl+P` (Windows/Linux) über allen anderen Panels.

  ### Funktionsumfang

  ```
  ┌─────────────────────────────────────────────────────────────┐
  │  🔍  Suche Befehle, Notizen, Einstellungen…        ESC     │
  ├─────────────────────────────────────────────────────────────┤
  │  [⚡ Alle] [▶ Befehle] [📄 Notizen] [🚪 Räume] [⚙ Einst.] │
  ├─────────────────────────────────────────────────────────────┤
  │  BEFEHLE                                                     │
  │  📝  Neue Notiz erstellen                                    │
  │  🚪  Neuen Raum erstellen                                    │
  │  👁  Vorschau ein-/ausblenden              ⌘ P              │
  │  ⚙  Einstellungen öffnen                  ⌘ ,              │
  │  📎  Datei hochladen                                         │
  │  ...                                                         │
  │  FORMATIERUNG                                                │
  │  B   Fett                                  ⌘ B              │
  │  I   Kursiv                                ⌘ I              │
  │  ...                                                         │
  │  NOTIZEN                                                     │
  │  📄  Erste Notiz-Vorschau…                 tag1, tag2       │
  │  ...                                                         │
  │  FAVORITEN & RÄUME                                           │
  │  🚪  KubernetesRoom123                     🔒               │
  │  ...                                                         │
  │  EINSTELLUNGEN                                               │
  │  🎨  Theme wechseln                                          │
  │  🇩🇪  Sprache: Deutsch                                       │
  │  🇬🇧  Sprache: English                                       │
  │  ...                                                         │
  ├─────────────────────────────────────────────────────────────┤
  │  ↑↓ Navigieren   ↵ Auswählen   esc Schließen   23 Treffer  │
  └─────────────────────────────────────────────────────────────┘
  ```

  ### Features
  - **Fuzzy-Suche**: Echtzeit-Filterung über Befehle, Notizen, Favoriten-Räume und Einstellungen
  - **Filter-Chips**: Schnellfilter per Klick oder Tab-Taste (Alle, Befehle, Notizen, Räume, Einstellungen)
  - **Keyboard-Navigation**: ↑↓ zum Navigieren, Enter zum Ausführen, Escape zum Schließen, Tab zum Filterwechsel
  - **Match-Highlighting**: Suchbegriff wird in Ergebnissen farblich markiert
  - **Gruppen-Header**: Ergebnisse nach Kategorien gruppiert mit Überschriften
  - **Shortcut-Anzeige**: Tastenkürzel werden bei Befehlen angezeigt
  - **Theme-Aware**: Vollständige Unterstützung aller Themes (Dark + Light: coffeeLight, bitterLight, monoLight)
  - **i18n**: Vollständig zweisprachig (DE/EN)
  - **Responsive**: Mobile-optimiertes Layout
  - **Animation**: Sanftes Einblenden mit scale+translate

  ### Implementierung

  1. **HTML: Command Palette Modal** (`index.html` ~L3449): Neues `#cmdPalette` Overlay mit Backdrop, Dialog, Input, Filter-Bereich, Ergebnis-Liste und Footer mit Keyboard-Hints.
  2. **CSS: `.cmd-palette-*` Styles** (`styles/app.css` ~L9562): Vollständige Styles für Dialog, Input, Filter-Chips, Ergebnis-Items, Gruppen-Header, Footer und Keyboard-Hints. Light-Theme-Overrides für coffeeLight, bitterLight, monoLight. Mobile-Responsive mit `@media (max-width: 640px)`.
  3. **JS: Command Registry** (`app.js` ~L29688): `getCmdItems()` baut dynamisch alle verfügbare Befehle zusammen:
     - Befehle (Neue Notiz, Neuer Raum, Vorschau, Upload, Settings, Kopieren, Kommentare, Apps, KI, etc.)
     - Formatierung (Bold, Italic, Strike, Code, Link, Quote, Listen, Tasks, HR)
     - Einstellungen (Theme, Sprache DE/EN, Export)
     - Notizen (dynamisch aus `psState.notes`, max 50)
     - Räume (dynamisch aus `loadFavorites()`, max 20)
  4. **JS: Filter & Search** (`app.js` ~L29770): `filterCmdItems()` filtert nach aktiver Kategorie und Suchbegriff (case-insensitive, Prefix-Priorität).
  5. **JS: Render** (`app.js` ~L29790): `renderCmdResults()` erzeugt HTML mit Gruppen-Headern, Icons, Labels mit Match-Highlighting, Shortcuts und Meta-Infos.
  6. **JS: Keyboard Handler** (`app.js` ~L29890): Globaler `keydown`-Listener für Shift+Cmd/Ctrl+P zum Öffnen/Schließen. Input-Handler für ↑↓ Navigation, Enter Ausführung, Escape Schließen, Tab Filterwechsel.
  7. **i18n: 50+ neue Strings** (`app.js` ~DE L6665, ~EN L7364): Vollständiger DE/EN Stringsatz für Placeholder, Filter-Labels, Gruppen-Header, Befehls-Labels und Keyboard-Hints.

  ### Verfügbare Befehle

  | Befehl | Gruppe | Shortcut | Aktion |
  |--------|--------|----------|--------|
  | Neue Notiz erstellen | Befehle | — | `psNewNote.click()` |
  | Neuen Raum erstellen | Befehle | — | `newRoomBtn.click()` |
  | Raum teilen | Befehle | — | `copyLinkBtn.click()` |
  | Vorschau ein-/ausblenden | Befehle | ⌘P | `setPreviewVisible()` |
  | Vollbild-Vorschau | Befehle | — | `setFullPreview()` |
  | Datei hochladen | Befehle | — | `openUploadModal()` |
  | Einstellungen öffnen | Befehle | ⌘, | `setSettingsOpen(true)` |
  | Text kopieren | Befehle | — | `copyMirrorBtn.click()` |
  | Kommentare ein-/ausblenden | Befehle | — | `toggleCommentsBtn.click()` |
  | Blöcke anordnen | Befehle | ⌘⇧A | `openBlockArrange()` |
  | Excalidraw öffnen | Befehle | — | `toggleExcalidrawBtn.click()` |
  | Tabelle öffnen | Befehle | — | `toggleExcelBtn.click()` |
  | Linear öffnen | Befehle | — | `toggleLinearBtn.click()` |
  | KI fragen | Befehle | — | `aiAssistBtn.click()` |
  | Personal Space ein-/ausklappen | Befehle | — | `togglePersonalSpaceBtn.click()` |
  | Favorit hinzufügen/entfernen | Befehle | — | `toggleFavoriteBtn.click()` |
  | Notiz speichern | Befehle | ⌘S | `schedulePsAutoSave()` |
  | Permanent-Link | Befehle | — | `togglePermanentLinkBtn.click()` |
  | Fett/Kursiv/Strike/Code/Link/Quote/Listen/Tasks/HR | Formatierung | diverse | `applySelectionAction()` |
  | Theme wechseln | Einstellungen | — | `openSettingsAt("themes")` |
  | Sprache DE/EN | Einstellungen | — | `setUiLanguage()` |
  | Export/Import | Einstellungen | — | `openSettingsAt("export")` |
  | [Notiz-Titel] | Notizen | — | Öffnet Notiz in PS |
  | [Raum-Name] | Räume | — | Navigiert zum Raum |

  - Zuständige Funktionen: `getCmdItems`, `filterCmdItems`, `renderCmdResults`, `renderCmdFilters`, `cmdSetActiveIndex`, `setCmdPaletteOpen`, `openCmdPalette`, `closeCmdPalette`, `executeCmdItem`, `cmdHighlightMatch`, `cmdEscapeHtml`.
  - Zuständige Dateien: `app.js`, `index.html`, `styles/app.css`.

- **Bidirektionales Parallel-Scrolling zwischen Editor und Preview** `#mirror` `#mdPreview` `#ux` `#preview` `#scroll`: Beim Scrollen im Editor (`id="mirror"`) wird die Markdown-Vorschau (`id="mdPreview"`) proportional mitgescrollt. Zusätzlich funktioniert es jetzt auch umgekehrt (Preview → Editor, vice versa).
  1. **Neue Scroll-Sync-Funktionen** (`app.js` ~L22512): `syncPreviewScrollFromEditor()` und `syncEditorScrollFromPreview()` berechnen je Seite die vertikale Scroll-Position über eine Verhältnislogik (`scrollTop / (scrollHeight - clientHeight)`) und übertragen diese auf die jeweils andere Seite.
  2. **Loop-Guard gegen Endlosschleifen** (`app.js` ~L22483): Zwei Locks (`syncFromEditorScrollLock`, `syncFromPreviewScrollLock`) verhindern Ping-Pong-Events beim gegenseitigen Setzen von `scrollTop`.
  3. **Robuste Preview-Event-Anbindung** (`app.js` ~L22538): Die Rückrichtung (Preview → Editor) hört auf `contentDocument`, `contentWindow` und das effektive `scrollingElement`, damit unterschiedliche Browser-/Iframe-Scrollpfade zuverlässig abgedeckt sind.
  4. **Event-Hooks ergänzt** (`app.js` ~L25409, ~L26953, ~L13662): Editor-`scroll` triggert Preview-Sync; bei Preview-`load` wird der Sync angebunden; zusätzlich wird die Anbindung auch beim Checkbox-Writeback-Setup im Preview sichergestellt.
  - Zuständige Funktionen: `syncPreviewScrollFromEditor`, `syncEditorScrollFromPreview`, `attachPreviewScrollSync`, `getPreviewScrollElement`, `getScrollRatioY`, `getScrollableYMax`.
  - Zuständige Dateien: `app.js`.

- **Excalidraw/Tabellen strikt an aktive Notiz-ID gebunden** `#apps` `#excalidraw` `#excel` `#note-scoping` `#room-sync`: Wenn eine Notiz geladen ist, arbeiten Excalidraw (`id="toggleExcalidraw"`) und Tabellen (`id="toggleExcel"`) jetzt mit der aktuellen Notiz-ID als Scope. Dadurch bleibt bearbeiteter Inhalt pro Notiz isoliert; beim Erstellen/Wechseln auf eine neue Notiz wird eine neue App-Instanz (eigener Scope) verwendet.
  1. **Scope-Priorität angepasst** (`app.js` ~L23919, ~L23935): `getExcalidrawNoteId()` und `getExcelNoteId()` priorisieren zuerst `psEditingNoteId`; Room-Scope bleibt Fallback für Fälle ohne aktive Notiz.
  2. **Excel-Sheet-ID auf aktiven Scope umgestellt** (`app.js` ~L23985): `buildExcelSheetId()` erzeugt IDs jetzt aus dem aktiven App-Scope (Notiz-basiert), statt immer nur `room-key` zu verwenden.
  3. **Note-Sync ohne erzwungenes Pinned-Room-Remap** (`app.js` ~L24436, ~L24452): `syncExcalidrawForNote()` und `syncExcelForNote()` übernehmen den übergebenen Notizkontext direkt und laden damit den korrekten notizspezifischen Zustand.
  4. **WebSocket-Mapping mit Legacy-Kompatibilität** (`app.js` ~L23153, ~L23182, ~L23327): Eingehende `excalidraw_state`/`excel_state`/`excalidraw_scene` Daten werden auf Notiz-ID fokussiert; ältere room-scope Payloads werden weiterhin auf die gepinnte Notiz zurückgemappt.
  - Zuständige Funktionen: `getExcalidrawNoteId`, `getExcelNoteId`, `buildExcelSheetId`, `syncExcalidrawForNote`, `syncExcelForNote`.
  - Zuständige Dateien: `app.js`.

- **Fix: Excel-Änderungen bleiben pro Notiz stabil erhalten** `#excel` `#persistence` `#bugfix` `#note-scoping`: Nach der Scope-Umstellung wurde beim Notizwechsel teils die falsche Sheet-URL gesetzt, wodurch Einträge scheinbar „nicht gespeichert“ wirkten. Die URL-Ermittlung verwendet jetzt konsequent den explizit synchronisierten Ziel-Scope.
  1. **Expliziter Scope für Sheet-ID/URL** (`app.js` ~L23985, ~L24000): `buildExcelSheetId(noteId)` und `setExcelEmbedUrl(noteId)` akzeptieren jetzt eine Ziel-Notiz-ID.
  2. **Sync mit Ziel-Notiz statt implizitem Global-State** (`app.js` ~L24452): `syncExcelForNote(noteId)` übergibt den berechneten `activeId` direkt an `setExcelEmbedUrl(activeId)`.
  3. **Toggle nutzt aktuellen Scope explizit** (`app.js` ~L24950): Beim Öffnen der Tabelle wird `setExcelEmbedUrl(getExcelNoteId())` verwendet, um unbeabsichtigte Sheet-Wechsel zu vermeiden.
  - Zuständige Funktionen: `buildExcelSheetId`, `setExcelEmbedUrl`, `syncExcelForNote`.
  - Zuständige Dateien: `app.js`.

- **Fix: Kein Fallback mehr auf leeres Default-Sheet** `#excel` `#persistence` `#bugfix`: Beim schnellen Notizwechsel konnte der Scope kurzzeitig leer sein; dadurch wurde auf ein `default`-Sheet gewechselt, was wie Datenverlust aussah. Dieser Fallback ist entfernt.
  1. **Leerer Scope wird verworfen** (`app.js` ~L23985): `buildExcelSheetId(noteId)` gibt bei leerem Scope jetzt `""` zurück statt `"default"`.
  2. **URL-Update nur mit gültiger Sheet-ID** (`app.js` ~L24000): `setExcelEmbedUrl(noteId)` bricht bei leerer Sheet-ID ab und behält die zuletzt gültige URL.
  - Zuständige Funktionen: `buildExcelSheetId`, `setExcelEmbedUrl`.
  - Zuständige Dateien: `app.js`.

---

## Aktuelle Änderungen (2026-02-28)

- **Farbige Text-Markierungen (Highlight-Syntax)** `#markdown` `#highlight` `#preview` `#ux`: Textpassagen können jetzt im Markdown farblich markiert werden. Die Syntax `==text==` erzeugt eine gelbe Markierung (Standard), `=={farbe}text==` eine farbige Markierung mit benannter oder benutzerdefinierter Farbe.

  ### Syntax

  | Markdown-Eingabe | Ergebnis |
  |---|---|
  | `==markierter Text==` | Gelbe Markierung (Standard) |
  | `=={red}roter Text==` | Rote Markierung |
  | `=={green}grüner Text==` | Grüne Markierung |
  | `=={blue}blauer Text==` | Blaue Markierung |
  | `=={orange}orange==` | Orange Markierung |
  | `=={purple}lila==` | Lila Markierung |
  | `=={pink}pink==` | Pinke Markierung |
  | `=={cyan}türkis==` | Türkise Markierung |
  | `=={#ff9900}custom==` | Benutzerdefinierte Hex-Farbe |

  ### Implementierung

  1. **markdown-it Inline-Rule `highlight_mark`** (`app.js` ~L11800): Neuer Tokenizer (analog zum bestehenden `password`-Tokenizer für `||secret||`). Erkennt `==...==`-Syntax mit optionalem `{farbe}`-Prefix. Erzeugt `highlight_mark`-Tokens mit `meta.color`-Property.
  2. **Renderer-Rule `highlight_mark`** (`app.js` ~L11860): Rendert `<mark>`-Tags. Ohne Farbe: Standard-`<mark>`. Mit benannter Farbe: `<mark class="mark-{farbe}">`. Mit Hex-Farbe: `<mark style="background:...">`.
  3. **Preview-iframe CSS** (`app.js` ~L12558): Theme-aware Styles für `mark` und `.mark-{farbe}`-Klassen. Dark-Themes nutzen helle Textfarben mit transparentem Hintergrund, Light-Themes dunklere Textfarben mit geringerem Hintergrund-Opacity.
  4. **`=`-Zeichen bereits im Terminator**: Das Gleichheitszeichen (0x3D) war bereits im `isTerminatorOrPipe`-Switch registriert, daher greift der Highlight-Tokenizer korrekt.

  ### Verfügbare Farben

  | Farbe | Dark-Theme BG | Dark-Theme Text | Light-Theme BG | Light-Theme Text |
  |-------|---------------|-----------------|-----------------|-------------------|
  | (Standard) | `rgba(250,204,21,.35)` | inherit | `rgba(250,204,21,.30)` | inherit |
  | red | `rgba(239,68,68,.25)` | `rgba(252,165,165,1)` | `rgba(239,68,68,.18)` | `rgba(185,28,28,1)` |
  | green | `rgba(34,197,94,.25)` | `rgba(134,239,172,1)` | `rgba(34,197,94,.18)` | `rgba(21,128,61,1)` |
  | blue | `rgba(59,130,246,.25)` | `rgba(147,197,253,1)` | `rgba(59,130,246,.18)` | `rgba(29,78,216,1)` |
  | orange | `rgba(249,115,22,.25)` | `rgba(253,186,116,1)` | `rgba(249,115,22,.18)` | `rgba(194,65,12,1)` |
  | purple | `rgba(168,85,247,.25)` | `rgba(216,180,254,1)` | `rgba(168,85,247,.18)` | `rgba(126,34,206,1)` |
  | pink | `rgba(236,72,153,.25)` | `rgba(249,168,212,1)` | `rgba(236,72,153,.18)` | `rgba(190,24,93,1)` |
  | cyan | `rgba(6,182,212,.25)` | `rgba(103,232,249,1)` | `rgba(6,182,212,.18)` | `rgba(14,116,144,1)` |

  - Zuständige Funktionen: `tokenizeHighlight` (inline-rule), `highlight_mark` renderer-rule, `ensureMarkdown`.
  - Zuständige Dateien: `app.js`.

- **Highlight-Farbpalette im Selection-Menü** `#selectionMenu` `#highlight` `#ux`: Die farbige Textmarkierung ist jetzt direkt im Selection-Menü (Text markieren → Popup) verfügbar. Ein 🖍-Button setzt gelbe Standard-Markierung, daneben eine Farbpalette mit 7 Farb-Dots für direkte farbige Markierung.

  ### Integration im Selection-Menü

  ```
  [ B ] [ I ] [ S ] [ PW ] [ " ] [ • List ] [ 1. List ] [ ☐ Task ] [ --- ] [ </> ] [ Link ] [ Comment ]
  ──────────────────────────────────────────────────────────────────────────────────────
  [ 🖍 ] [ 🔴 🟢 🔵 🟠 🟣 🩷 🩵 ]  |  [ Sort A–Z ] [ ? ]
  ```

  ### Implementierung

  1. **HTML: Highlight-Buttons** (`index.html` ~L857): Neuer 🖍-Button mit `data-selection-action="highlight"` für gelbe Standard-Markierung (`==text==`). Daneben 7 Farb-Dots mit `data-selection-action="highlight-color"` und `data-highlight-color="{farbe}"` für farbspezifische Markierung (`=={farbe}text==`).
  2. **JS: `applyHighlightColor(color)`** (`app.js` ~L4250): Neue Funktion, die selektierten Text mit `=={farbe}...==` umschließt. Erkennt bereits existierende `==`-Markierungen und ersetzt die Farbe statt doppelt zu wrappen. Handhabt sowohl inline-gewrappten als auch umgebend-gewrappten Text.
  3. **JS: Event-Handler erweitert** (`app.js` ~L24755): Der selectionMenu Event-Delegator erkennt `highlight-color`-Actions und ruft `applyHighlightColor()` mit dem `data-highlight-color`-Attribut auf.
  4. **JS: `applySelectionAction` erweitert** (`app.js` ~L4145): Neue Cases `highlight` (Standard-gelb via `wrapSelectionToggle`) und `highlight-color`.
  5. **CSS: `.highlight-dot` Styles** (`styles/app.css` ~L92): 18×18px runde Farb-Buttons mit Hover-Animation (scale + border). Light-Theme-Overrides für Hover-Effekte.
  6. **i18n**: Neuer String `menu.highlight_tip` für DE („Auswahl farblich markieren") und EN („Highlight selection with color").
  - Zuständige Funktionen: `applyHighlightColor` (neu), `applySelectionAction`, selectionMenu Event-Handler.
  - Zuständige Dateien: `app.js`, `index.html`, `styles/app.css`.

---

## Aktuelle Änderungen (2026-02-27)

- **Fix: Presence-Name vom Server laden statt pro Device random generieren** `#presence` `#identity` `#cross-device` `#fix`: Auf neuen Geräten wurde bisher ein zufälliger Name (z.B. "Cosmic Hawk") in der `presenceList` angezeigt, obwohl der User bereits einen Namen im Personal Space gespeichert hatte. Der zufällige Name war sichtbar, bis `refreshPersonalSpace()` → `syncIdentityFromServer()` die Identität vom Server nachlud — oft mehrere Sekunden nach dem WebSocket-Connect. Auf Geräten, die den Browser-localStorage nicht teilten, wurde der zufällige Name dauerhaft angezeigt bis der User manuell seine Identität änderte.
  1. **Neue Funktion `earlyIdentitySync()`** (`app.js` ~L926): Asynchrone Funktion, die `/api/identity` GET abruft **bevor** der WebSocket-Connect (`connect()`) ausgeführt wird. Falls der Server eine gespeicherte Identität hat, werden `identity.name`, `identity.avatar` und `identity.color` sofort überschrieben und im localStorage persistiert. Bei nicht eingeloggten Usern (kein PS) oder Netzwerkfehlern wird der zufällige Name beibehalten.
  2. **Connect-Reihenfolge geändert** (`app.js` ~L25462): `connect()` wird jetzt erst nach `earlyIdentitySync().then(() => connect())` aufgerufen. Damit sendet der erste `hello`-Broadcast bereits den korrekten Server-gespeicherten Namen, statt eines zufälligen.
  - Zuständige Funktionen: `earlyIdentitySync` (neu), `connect`, `identity`-IIFE.
  - Zuständige Dateien: `app.js`.

- **Fix: Planungssektion zeigt nur noch Teilnehmer des aktuellen Raums** `#calendar` `#availability` `#bug` `#room-scoping`: Die Teilnehmerliste in der Planungssektion ("Gemeinsame Zeit finden") zeigte bisher ALLE User, die jemals Verfügbarkeit geteilt hatten — unabhängig davon, ob sie aktuell im selektierten Raum verbunden sind. Ursache: Beim initialen WebSocket-Verbindungsaufbau wurden veraltete Availability-Einträge aus der Datenbank (bis zu 30 Tage alt) geladen und als aktive Teilnehmer dargestellt.
  1. **Server: Initial DB-Load filtert nach verbundenen Clients** (`server.js` ~L5952): Beim Laden von Availability-Daten aus der DB werden jetzt nur Einträge für `client_id`s berücksichtigt, die aktuell eine aktive WebSocket-Verbindung im Raum haben. Wenn keine anderen Clients verbunden sind, wird das DB-Loading übersprungen.
  2. **Server: Initial-State-Send filtert nach verbundenen Clients** (`server.js` ~L6007): Der initiale Availability-State, der an neu verbindende Clients gesendet wird, wird gegen die aktuell verbundenen Socket-ClientIds gefiltert.
  3. **Server: `request_state`-Handler filtert nach verbundenen Clients** (`server.js` ~L6788): Auch bei expliziten State-Requests werden nur Availability-Daten für aktuell verbundene Clients zurückgegeben.
  - Zuständige Funktionen: Initial-Connection-Handler, `request_state`-Handler (Server).
  - Zuständige Dateien: `server.js`.

---

## Aktuelle Änderungen (2026-02-26)

- **Kalender Modus-Trennung: Personal vs. Planning (Doodle-Style)** `#calendar` `#ux` `#tabs` `#planning`: Der Kalender hat jetzt zwei separate Modi mit Tab-Navigation für eine klarere UX-Trennung zwischen privater Kalenderverwaltung und gemeinsamer Terminplanung.

  ### Konzept
  
  ```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  [📅 Mein Kalender]  [👥 Gemeinsam planen]   ← Tab-Navigation          │
  ├─────────────────────────────────────────────────────────────────────────┤
  │                                                                         │
  │  PERSONAL MODE                    │   PLANNING MODE                     │
  │  ─────────────────                │   ──────────────                    │
  │  • Termine anzeigen               │   • Tage für Verfügbarkeit wählen   │
  │  • Kalenderquellen verwalten      │   • Teilnehmer-Übersicht            │
  │  • Bundesland/Feiertage           │   • Gemeinsame Tage finden          │
  │  • Grid-Klick → Wochenansicht     │   • Grid-Klick → Toggle Verfügbar   │
  │                                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
  ```

  ### Implementierte Änderungen
  
  1. **HTML: Tab-Navigation** (`index.html` ~L1673): Neue `#calendarModeTabs` Container mit zwei Buttons (`data-calendar-mode="personal"` und `data-calendar-mode="planning"`).
  
  2. **HTML: Sidebar-Sektionen mit Attributen** (`index.html`):
     - `#calendarSidebarCalendarsSection` → `data-calendar-section="personal"`
     - `#calendarSidebarFreeSlotsSection` → `data-calendar-section="personal"`
     - `#calendarSidebarPlanningSection` → `data-calendar-section="planning"`
  
  3. **CSS: Modus-basierte Sichtbarkeit** (`styles/app.css` ~L7293):
     - `.cal-mode-tabs` Container-Styles
     - `.cal-mode-tab` und `.cal-mode-tab--active` Button-Styles
     - `body[data-calendar-mode="planning"] [data-calendar-section="personal"]` → `display: none`
     - `body[data-calendar-mode="planning"] [data-calendar-section="planning"]` → `display: block`
     - Planning-Mode-Indikator auf Grid ("Klicke auf Tage...")
     - Light-Theme Support
  
  4. **JavaScript: Mode State Management** (`app.js` ~L15721):
     - `calendarMode` Variable (`"personal"` | `"planning"`)
     - `CALENDAR_MODE_KEY` für localStorage-Persistierung
     - `loadCalendarMode()` → Lädt beim Startup
     - `saveCalendarMode()` → Speichert bei Änderung
     - `setCalendarMode(mode)` → Wechselt Modus, auto-enabled Sharing im Planning-Modus
     - `applyCalendarModeUI()` → Setzt `data-calendar-mode` auf body, updated Tab-States
  
  5. **JavaScript: Grid-Klick-Verhalten** (`app.js` ~L27780):
     - Personal Mode: Klick auf Tag navigiert zur Wochenansicht
     - Planning Mode: Klick auf Tag togglet Verfügbarkeit (wie bisher)
  
  6. **JavaScript: Event Handlers** (`app.js` ~L27360):
     - Tab-Buttons rufen `setCalendarMode()` auf

  ### Workflow-Erweiterung
  
  Der bestehende Availability-Workflow (siehe oben) bleibt vollständig erhalten. Die Tab-Trennung fügt nur einen neuen UI-Einstiegspunkt hinzu:
  
  ```
  User wechselt zu "Gemeinsam planen" Tab
       ↓
  setCalendarMode("planning")
       ↓
  applyCalendarModeUI() → body bekommt data-calendar-mode="planning"
       ↓
  CSS versteckt Personal-Sektionen, zeigt Planning-Sektion
       ↓
  Auto-Enable: saveCommonFreeSlotsSharing(true) → Sharing wird aktiviert
       ↓
  renderCommonFreeSlots() → Panel wird sichtbar
       ↓
  Grid-Klicks togglen jetzt Verfügbarkeit
  ```

  ### Neue Funktionen
  
  | Funktion | Datei | Zweck |
  |----------|-------|-------|
  | `loadCalendarMode()` | app.js | Lädt gespeicherten Modus aus localStorage |
  | `saveCalendarMode()` | app.js | Speichert Modus in localStorage |
  | `setCalendarMode(mode)` | app.js | Wechselt Modus, updated UI, auto-enables Sharing |
  | `applyCalendarModeUI()` | app.js | Setzt data-Attribute und Tab-States |

  - Zuständige Dateien: `app.js`, `index.html`, `styles/app.css`.

---

## Aktuelle Änderungen (2026-02-24)

- **AI-Chat-History Persistierung** `#ai` `#chat` `#persistence`: Der AI-Chatverlauf wird jetzt in localStorage gespeichert und bleibt auch nach Seiten-Reload erhalten.
  1. **Neue Konstante `AI_CHAT_HISTORY_KEY`** (`app.js` ~L2597): localStorage-Key für Chat-History.
  2. **`saveAiChatHistory()`** (`app.js` ~L2602): Serialisiert `aiChatHistoryByContext` Map nach JSON und speichert in localStorage. Begrenzt auf max. 50 Einträge pro Kontext.
  3. **`loadAiChatHistory()`** (`app.js` ~L2617): Lädt Chat-History aus localStorage beim Startup, stellt auch `aiChatSeq` Counter wieder her.
  4. **Auto-Save bei Änderungen**: `clearAiChatHistoryForContext`, `deleteAiChatEntryById` und `addAiChatEntry` rufen jetzt `saveAiChatHistory()` auf.
  5. **Startup-Integration** (`app.js` ~L28015): `loadAiChatHistory()` wird in `initStartupTasks()` vor `syncAiChatContext()` aufgerufen.
  - Zuständige Funktionen: `saveAiChatHistory`, `loadAiChatHistory`, `clearAiChatHistoryForContext`, `deleteAiChatEntryById`, `addAiChatEntry`, `initStartupTasks`.
  - Zuständige Dateien: `app.js`.

- **AI-Output-Größenerweiterung für lange Antworten** `#ai` `#ui` `#output`: Lange AI-Text-Ausgaben (z.B. generierter Code) werden jetzt korrekt mit erweiterten Größenlimits dargestellt, sodass der vollständige Inhalt sichtbar ist.
  1. **`updateRunOutputSizing()` erweitert** (`app.js` ~L11062): Neue `isAiText`-Erkennung für `source === "ai"`. AI-Text-Outputs erhalten jetzt basePx=320 (statt 160) und 85%/90% Panel-/Window-Anteil (statt 65%/70%).
  2. **`updateRunOutputUi()` setzt CSS-Klasse** (`app.js` ~L11051): Neue `.is-ai-output`-Klasse wird auf `#runOutput` gesetzt wenn `source === "ai"` oder `source === "ai-image"`.
  3. **Mobile CSS erweitert** (`styles/app.css` ~L2467): `#runOutput.is-ai-output` erhält wie Bild-Outputs `max-height: 70vh` statt der bisherigen 120px-Begrenzung.
  4. **Tailwind max-h-40 entfernt** (`index.html` ~L1565): Festes 160px-Limit entfernt, JS-basiertes dynamisches Sizing kann jetzt greifen.
  5. **Default CSS-Regel für #runOutput** (`styles/app.css` ~L117): Basis-Sizing mit `overflow: auto` und `-webkit-overflow-scrolling: touch` für Scrollbar-Unterstützung.
  6. **AI-Token-Limit erhöht** (`server.js` ~L205): `AI_MAX_OUTPUT_TOKENS` von 900 auf 4096 erhöht. `AI_TIMEOUT_MS` von 30s auf 60s erhöht für längere Generierungen.
  - Zuständige Funktionen: `updateRunOutputSizing`, `updateRunOutputUi`.
  - Zuständige Dateien: `app.js`, `styles/app.css`, `index.html`, `server.js`.

- **Fix: Shared Room Content-Sync für neue User** `#shared` `#sync` `#bug`: User ohne Personal Space sahen den existierenden Inhalt einer geteilten Notiz erst nachdem sie selbst schrieben. Ursache: `applyRemoteText()` und `applySyncedText()` blockierten das Übernehmen von Remote-Content wenn lokaler Content leer war.
  1. **`applySyncedText()` mit `force`-Option erweitert** (`app.js` ~L20954): Neuer `opts.force`-Parameter umgeht den `offlineSyncInFlight`-Guard.
  2. **`applyRemoteText()` setzt `force: true` bei leerem Content** (`app.js` ~L21195): Wenn der lokale Editor leer ist (neuer User im Raum), wird `force: true` gesetzt um den Remote-Content sofort zu übernehmen.
  - Zuständige Funktionen: `applySyncedText`, `applyRemoteText`.
  - Zuständige Dateien: `app.js`.

- **Fix: Kalender-Availability-Sync in geteilten Räumen** `#calendar` `#availability` `#sync` `#bug`: Die ausgewählten Tage im "Gemeinsame Planung"-Kalender wurden nicht zwischen Teilnehmern synchronisiert — jeder sah nur seine eigenen Auswahlen. Ursache: `manualFreeSlots` (ausgewählte Tage) wurde nur lokal gespeichert, nicht via WebSocket übertragen.
  1. **Client: `selectedDays` zu `broadcastAvailability()` hinzugefügt** (`app.js` ~L19479): Die Funktion sendet jetzt ein `selectedDays`-Array mit allen explizit ausgewählten Tagen (YYYY-MM-DD Format).
  2. **Client: `handleAvailabilityState()` parst `selectedDays`** (`app.js` ~L19547): Empfangene `selectedDays` werden im `availabilityByClient`-Map gespeichert.
  3. **Client: `getParticipantsAvailabilityForDay()` nutzt `selectedDays`** (`app.js` ~L19654): Die Primär-Prüfung für Teilnehmerverfügbarkeit basiert jetzt auf den explizit ausgewählten Tagen statt auf Busy-Intervall-Inferenz.
  4. **Server: `availability_state`-Handler speichert `selectedDays`** (`server.js` ~L6115): Neue Validierung (max 60 Tage, YYYY-MM-DD Format) und Persistierung im `roomAvailabilityState`.
  5. **Server: Initial-State und `request_state` senden `selectedDays`** (`server.js` ~L5771, ~L6458): Neue Clients erhalten die ausgewählten Tage aller Teilnehmer beim Verbinden.
  - Zuständige Funktionen: `broadcastAvailability`, `handleAvailabilityState`, `getParticipantsAvailabilityForDay` (Client), `availability_state`-Handler, Initial-State, `request_state` (Server).
  - Zuständige Dateien: `app.js`, `server.js`.

- **Gemeinsame Planung: Erweiterte Teilnehmer- und Tage-Anzeige** `#calendar` `#availability` `#ux`: Die "Gemeinsame Planung"-Sektion in der Kalender-Sidebar zeigt jetzt detaillierte Informationen zu Teilnehmern und deren ausgewählten Tagen.
  1. **Neue Funktion `computeCommonSelectedDays()`** (`app.js` ~L19656): Berechnet die Schnittmenge aller `selectedDays` über alle Teilnehmer hinweg. Gibt `commonDays` (gemeinsame Tage) und `perParticipant` (Tage pro Teilnehmer) zurück.
  2. **Erweiterte Teilnehmer-Chips** (`app.js` ~L19797): Jeder Teilnehmer-Chip zeigt jetzt die Anzahl der ausgewählten Tage an (`X Tage`). Eigener User wird mit `(du)` markiert.
  3. **Gemeinsame Tage Sektion** (`app.js` ~L19820): Wenn alle Teilnehmer mindestens einen gemeinsamen Tag haben, wird eine "Gemeinsame Tage"-Liste mit grünen Chips angezeigt.
  4. **Teilnehmer-Tage Fallback** (`app.js` ~L19835): Wenn keine gemeinsamen Tage existieren, werden die ausgewählten Tage jedes anderen Teilnehmers einzeln aufgelistet.
  5. **Verbesserte Panel-Sichtbarkeit** (`app.js` ~L19785): Das Panel wird jetzt auch angezeigt wenn der User seinen Sharing-Toggle aktiviert hat, unabhängig davon ob andere bereits teilen.
  6. **CSS-Styles für `.common-day-chip`** (`styles/app.css` ~L6742): Neue Styles für die grünen Tag-Chips in der Gemeinsame-Tage-Liste.
  7. **i18n-Strings** (`app.js`): Neue Strings `calendar.common.common_days` und `calendar.common.participant_days` für DE/EN.
  - Zuständige Funktionen: `computeCommonSelectedDays`, `renderCommonFreeSlots`.
  - Zuständige Dateien: `app.js`, `styles/app.css`.

## Aktuelle Änderungen (2026-02-23)

- **Gemeinsame Zeit finden: Teilnehmer-Visualisierung im Kalender-Grid** `#calendar` `#availability` `#shared`: Die Verfügbarkeit von Teilnehmern in geteilten Räumen wird jetzt direkt in den Kalender-Grid-Zellen (Tag/Woche/Monat) visuell dargestellt. Farbige User-Dots zeigen auf einen Blick, welche Teilnehmer an einem Tag verfügbar sind. Ein Badge zeigt die Schnittmenge an („alle frei" oder „X/Y verfügbar").
  1. **Neue Hilfsfunktion `getParticipantsAvailabilityForDay(day)`** (`app.js` ~L19525): Berechnet für jeden Teilnehmer die Verfügbarkeit eines Tages basierend auf den via WebSocket empfangenen Busy-Intervallen. Rückgabe: Array mit `{clientId, name, color, isAvailable}` sowie `allAvailable`/`someAvailable`-Flags.
  2. **Neue Render-Funktion `renderParticipantIndicators(day)`** (`app.js` ~L19590): Erzeugt HTML mit farbigen Dots pro Teilnehmer (Opacity 1 = verfügbar, 0.35 = beschäftigt) und Badge für Schnittmenge (grün = alle frei, gelb = teilweise).
  3. **Day-View erweitert** (`app.js` ~L19722): Am Anfang des Day-Grids werden die Participant-Indikatoren angezeigt.
  4. **Week-View erweitert** (`app.js` ~L19800): Jede Tageszelle zeigt Participant-Indikatoren unterhalb des Datums-Headers.
  5. **Month-View erweitert** (`app.js` ~L19865): Jede Tageszelle zeigt Participant-Indikatoren unterhalb des Datums-Headers.
  6. **Handler-Update für Live-Aktualisierung** (`app.js` ~L19438): `handleAvailabilityState()` und `handleAvailabilityLeave()` rufen nun `renderCalendarPanel()` auf, wenn der Kalender aktiv ist, damit neue Verfügbarkeitsdaten sofort im Grid reflektiert werden.
  7. **CSS-Styles** (`styles/app.css` ~L6743): Neue Styles für `.participant-indicators`, `.participant-dot`, `.participant-badge`, `.participant-badge--all`, `.participant-badge--partial`. Tageszellen mit „alle verfügbar" erhalten einen subtilen grünen Hintergrund via `:has(.participant-badge--all)`.
  8. **i18n** (`app.js`): Neue Strings `calendar.grid.all_available` und `calendar.grid.partial_available` für DE/EN.
  - Zuständige Funktionen: `getParticipantsAvailabilityForDay`, `renderParticipantIndicators`, `renderCalendarPanel`, `handleAvailabilityState`, `handleAvailabilityLeave`.
  - Zuständige Dateien: `app.js`, `styles/app.css`.

- **Kalender Mobile UX kompakter + schließbar** `#calendar` `#mobile` `#ux`: Die mobile Kalenderansicht wurde deutlich verdichtet und kann jetzt direkt per X-Button geschlossen werden, um schnell zu Tabs/Räumen zurückzukehren.
  1. **Mobile Close-Button** (`index.html` ~L1639, `app.js` ~L25755): Neuer `#calendarCloseMobile` im Header; Handler setzt `setCalendarPanelActive(false)`.
  2. **Sichtbarkeit nur im Kalenderzustand** (`styles/app.css` ~L2278): `#calendarCloseMobile` wird nur bei `body.mobile-calendar-open` angezeigt.
  3. **Phone-Layout kompakter** (`styles/app.css` ~L2643): Engere Header-Abstände, kleinere Controls, reduzierte Grid/Sidebar-Paddings, kleinere Listenhöhen.
  4. **Ultra-Kompakt für sehr kleine Geräte** (`styles/app.css` ~L2751): Zusätzliche Regeln für `<390px` Viewport (30px Controls, engeres Spacing, dichtere Tageszellen).
  - Zuständige Dateien: `index.html`, `app.js`, `styles/app.css`.

- **Kalender-Sidebar auf Phones entrümpelt** `#calendar` `#mobile` `#sidebar`: Zur Übersichtsgewinnung ist der Block „Meine Kalender“ inkl. Bundesland-Auswahl in der Phone-Ansicht ausgeblendet; „Gemeinsame Planung“ bleibt erhalten.
  1. **Gezielte Section-ID** (`index.html` ~L1689): `#calendarSidebarCalendarsSection` ergänzt.
  2. **Mobile-Ausblendung** (`styles/app.css` ~L2666): `#calendarSidebarCalendarsSection`, `#calendarBundeslandWrap`, `#calendarLegend`, `#calendarStatus`, `#calendarRefresh` auf Phone ausgeblendet.
  - Zuständige Dateien: `index.html`, `styles/app.css`.

- **Mobile Startup/Ladezeit massiv beschleunigt (Reihenfolge optimiert)** `#mobile` `#performance` `#startup`: Nicht-kritische Initialisierungen werden auf mobilen Geräten nicht mehr im kritischen Startpfad ausgeführt, sondern idle/verzögert nachgeladen.
  1. **Deferred Startup Helper** (`app.js` ~L5034): `runDeferredStartupTask(task, opts)` mit `requestIdleCallback`-Fallback.
  2. **Nicht-kritische Tasks auf Mobile verschoben** (`app.js` ~L27007): `initAutoBackup`, `initAutoImport`, `startPsPolling`, `initAiDictation`, `loadCommentsForRoom`, `initBlockArrange`, `syncRoomSlotsFromServer` laufen gestaffelt nach Initial-Render.
  3. **Kalender-Open ohne doppelte Refresh-Last** (`app.js` ~L21490): Doppelte `refreshCalendarEvents(true)`-Ausführung beim Öffnen per Kalendertab entfernt.
  4. **Ressourcenpriorität angepasst** (`index.html` ~L23, ~L3424): `yjs.bundle.js` von `preload` auf `prefetch` umgestellt und Script mit `fetchpriority="low"` markiert.
  5. **Service Worker später registriert** (`index.html` ~L3426): Registrierung erst nach `load` + verzögert (`setTimeout`), um den initialen Main-Thread zu entlasten.
  6. **CDN-Verbindungsaufbau vorgezogen** (`index.html` ~L28): `preconnect` für `cdn.jsdelivr.net` ergänzt.
  - Zuständige Dateien: `app.js`, `index.html`.


## Feature-Analyse: Video-Upload & Preview-Wiedergabe (2026-02-22)

**Frage:** Ist es möglich, Videos hochzuladen (Server) und im Preview wiederzugeben?

**Antwort: Aktuell NEIN — aber ab diesem Commit implementiert.** Video-Upload und -Wiedergabe wurden mit folgenden Änderungen freigeschaltet:

### Implementierte Änderungen (2026-02-22)

| # | Datei | Änderung | Stelle |
|---|-------|----------|--------|
| **S1** | `server.js` | `isAllowedUploadMime()` akzeptiert jetzt `video/*` MIME-Types | [server.js](server.js#L1185) |
| **S2** | `server.js` | `extForMime()` kennt `.mp4`, `.webm`, `.ogg`, `.mov` | [server.js](server.js#L1190) |
| **S3** | `server.js` | `mimeTypeForPath()` liefert korrekte `Content-Type`-Header für Video-Dateien (`video/mp4`, `video/webm`, `video/ogg`, `video/quicktime`) | [server.js](server.js#L950) |
| **C1** | `app.js` | Neue `embedVideoLinks(html)` Funktion — ersetzt `<img>` und `<a>` mit Video-Erweiterungen durch `<video controls>` mit `<source>` + Fallback-Download-Link | [app.js](app.js#L11247) |
| **C2** | `app.js` | `buildPreviewContentHtml()` und `updatePreview()` pipen HTML durch `embedVideoLinks()` nach `embedPdfLinks()` | [app.js](app.js#L11442) |
| **C3** | `index.html` | Upload-File-Input akzeptiert `video/*` zusätzlich zu `image/*` und `application/pdf` | [index.html](index.html#L3094) |
| **C4** | `app.js` | `isAllowedUploadType()` akzeptiert `video/*` (vorher nur `image/*` + `application/pdf` → Client blockierte Upload) | [app.js](app.js#L1521) |
| **C5** | `app.js` | `buildUploadMarkdown()` erzeugt `![video](url)` für Video-MIME-Types (nötig für `embedVideoLinks`) | [app.js](app.js#L1511) |
| **C6** | `app.js` | Toast-Meldungen: „Nur Bilder, Videos oder PDFs sind erlaubt." (vorher: „Nur Bilder oder PDFs") | [app.js](app.js#L23475) |

### Nutzung

1. **Upload**: Upload-Modal → Datei wählen (`.mp4`, `.webm`, `.ogg`, `.mov`) → In Mirror einfügen
2. **Markdown-Syntax**: `![Mein Video](/uploads/xyz.mp4)` oder einfacher Link `[Video](/uploads/xyz.mp4)`
3. **Preview**: Video wird automatisch als `<video controls>` gerendert mit nativen Browser-Controls (Play, Pause, Lautstärke, Fullscreen)

### Bekannte Limitierungen

| Limitation | Detail |
|------------|--------|
| **Dateigröße** | Max `MIRROR_UPLOAD_MAX_MB` (Default 8 MB, max 50 MB). Für längere Videos ggf. erhöhen. |
| **Base64-Encoding** | Upload nutzt Data-URI im JSON-Body → 33% Overhead. Kein Streaming-Upload. |
| **Browserformat** | Nicht jeder Browser spielt jedes Format ab. `.mp4` (H.264) hat die beste Kompatibilität. `.mov` funktioniert primär in Safari. |
| **Kein Transcoding** | Videos werden 1:1 gespeichert, kein Server-seitiges Transcoding. |

---

## Aktuelle Änderungen (2026-02-22)

- **Video-Upload & Preview-Wiedergabe** `#upload` `#video` `#preview`: Videos können jetzt über das Upload-Modal hochgeladen und im Markdown-Preview als `<video controls>` abgespielt werden. Unterstützte Formate: MP4, WebM, OGG, MOV.
  1. **Server: MIME-Filter erweitert** (`server.js` ~L1185): `isAllowedUploadMime()` akzeptiert `video/*` zusätzlich zu `image/*` und `application/pdf`.
  2. **Server: Extension-Mapping** (`server.js` ~L1190): `extForMime()` kennt `.mp4`, `.webm`, `.ogg`, `.mov`.
  3. **Server: Static-Serving MIME** (`server.js` ~L950): `mimeTypeForPath()` liefert korrekte `Content-Type`-Header für Video-Dateien.
  4. **Client: `embedVideoLinks()`** (`app.js` ~L11247): Neue Post-Processing-Funktion (analog zu `embedPdfLinks`). Erkennt `<img>`- und `<a>`-Tags mit Video-Erweiterungen und ersetzt sie durch `<video controls>` mit `<source>` + Fallback-Download-Link. Responsive Styling (max-width:100%, border-radius).
  5. **Client: Preview-Pipeline** (`app.js` ~L11442, ~L11528): `buildPreviewContentHtml()` und `updatePreview()` pipen HTML durch `embedVideoLinks()` nach `embedPdfLinks()`.
  6. **Upload-Modal: Accept erweitert** (`index.html` ~L3094): File-Input akzeptiert `video/*`.
  7. **Client: MIME-Filter erweitert** (`app.js` ~L1521): `isAllowedUploadType()` akzeptiert `video/*` — vorher blockierte der Client den Upload vor dem Server-Request.
  8. **Client: Markdown-Builder** (`app.js` ~L1511): `buildUploadMarkdown()` erzeugt `![video](url)` für Video-MIME-Types, damit `embedVideoLinks()` greift.
  9. **Client: Toast-Meldungen** (`app.js` ~L23475): „Nur Bilder, Videos oder PDFs sind erlaubt." statt „Nur Bilder oder PDFs".
  - Zuständige Funktionen: `isAllowedUploadMime`, `extForMime`, `mimeTypeForPath`, `embedVideoLinks`, `buildPreviewContentHtml`, `updatePreview`, `isAllowedUploadType`, `buildUploadMarkdown`.
  - Zuständige Dateien: `server.js`, `app.js`, `index.html`.

- **Auto-Tag-Generator nur bei Erst-Erstellung aktiv (per-Note Lock)** `#ps` `#tags` `#auto-tag` `#override`: Der Auto-Tag-Generator (`classifyText`/`mergeManualTags`) läuft nur noch beim allerersten Speichern einer Notiz (POST). Sobald die Notiz existiert (in Editor geladen oder nach POST-Response), wird `psEditingNoteTagsOverridden = true` gesetzt. Jeder folgende Save sendet den `__manual_tags__`-Marker → Server überspringt Auto-Tag-Recomputation. Damit kann der Auto-Tag-Generator beim Bearbeiten von Tags nicht mehr „dazwischenfunken".
  1. **`applyNoteToEditor`** (`app.js` ~L13443): `psEditingNoteTagsOverridden = true` statt `rawTags.some(marker)`. Existierende Notizen werden sofort als manuell-überschrieben behandelt.
  2. **`syncPsEditingNoteFromEditorText`** (`app.js` ~L13401): Gleiche Änderung — Notiz per Text-Match gefunden → sofort `true`.
  3. **`savePersonalSpaceNote` POST-Response** (`app.js` ~L24341): Nach `syncPsEditingNoteTagsFromState()` wird `psEditingNoteTagsOverridden = true` gesetzt, damit alle weiteren Saves (Auto-Save, manuell) den Marker enthalten.
  4. **`togglePinnedForNote`** (`app.js` ~L13170): Override bleibt nach Pin-Toggle `true`, wird nicht durch Server-Response zurückgesetzt.
  5. **`syncPsEditingNoteTagsFromState` Guard verstärkt** (`app.js` ~L2406): Akzeptiert jetzt `opts.force`-Parameter. Wenn `psEditingNoteTagsOverridden = true` und **nicht** `force`, wird der gesamte Tag-Sync übersprungen (nur Pinned-State wird synchronisiert). Vorher wurde nur geschützt wenn der Server den Marker noch nicht hatte — bei vorherigem Save mit Marker wurde der Guard umgangen und `refreshPersonalSpace`-Polling überschrieb lokale Tag-Änderungen (Category, Subcategory, manuelle Tags) mit veraltetem Server-Stand. Nur `updateNotesForTagChange` (Tag-Kontextmenü) übergibt `{ force: true }`.
  6. **3-Tag-Limit nur für Auto-Tags, nicht für User-Tags** (`server.js` ~L1399): `normalizeImportTags` akzeptiert jetzt optionalen `limit`-Parameter (Default: 3). `splitManualOverrideTags` prüft **vor** der Normalisierung ob der `__manual_tags__`-Marker im Payload ist: wenn ja → `limit=50` (User-kuratierte Tags werden vollständig erhalten), wenn nein → `limit=3` (Auto-Tag-Cap bleibt). Vorher wurden User-Tags wie `cat:custom` bei ≥3 regulären Tags stillschweigend abgeschnitten.
  - Zuständige Funktionen: `applyNoteToEditor`, `syncPsEditingNoteFromEditorText`, `savePersonalSpaceNote`, `togglePinnedForNote`, `syncPsEditingNoteTagsFromState`, `updateNotesForTagChange`, `normalizeImportTags`, `splitManualOverrideTags`.
  - Zuständige Dateien: `app.js`, `server.js`.

## Aktuelle Änderungen (2026-02-21)

- **Fix: Tag-Löschen/Umbenennen via Kontextmenü wirkungslos** `#ps` `#tags` `#bug` `#context-menu`: Tags ließen sich über das Tag-Kontextmenü (Rechtsklick → Löschen/Umbenennen) nicht ändern — Toast bestätigte zwar "Updated", aber die Tags blieben in der DB unverändert. Ursache: `normalizeImportTags()` hatte ein Hard-Limit von **3 regulären Tags** und verwendete `break` zum Abbruch der Schleife. Bei Notizen mit ≥3 Tags (z. B. `["note", "2026", "february", "__manual_tags__"]`) verließ `break` die Schleife bevor `__manual_tags__` am Array-Ende gelesen wurde → Server erkannte `override = false` → verwendete alte DB-Tags statt die neuen.
  1. **System-Marker vom Tag-Limit ausgenommen** (`server.js` ~L1395): Neue Konstante `SYSTEM_TAG_MARKERS = new Set(["__manual_tags__", "pinned"])`. `normalizeImportTags` sammelt System-Marker in separatem Array und zählt sie nicht gegen das 3-Tag-Limit. Reguläre Tags werden nach 3 Stück per `continue` übersprungen (statt `break`), sodass die Schleife System-Marker am Array-Ende weiterhin erreicht.
  - Zuständige Funktionen: `normalizeImportTags`, `splitManualOverrideTags`.
  - Zuständige Dateien: `server.js`.

- **Auto-Tag Blacklist** `#ps` `#tags` `#blacklist` `#auto-tag`: Neue erweiterbare Blacklist für Tags, die von der automatischen Klassifizierung (`classifyText`) nie vergeben werden sollen. Aktuell geblockt: `markdown`, `yaml`. Die Blacklist ist zentral definiert und leicht erweiterbar.
  1. **Server-Blacklist** (`server.js` ~L1216): Neue Konstante `AUTO_TAG_BLACKLIST = new Set(["markdown", "yaml"])`. `classifyText()` filtert blacklisted Tags vor der Rückgabe. `mergeManualTags()` entfernt sie ebenfalls aus dem Merge-Ergebnis.
  2. **Client-Blacklist** (`app.js` ~L5075): Spiegelkonstante `AUTO_TAG_BLACKLIST`. `rebuildPsTagsFromNotes()` filtert blacklisted Tags aus dem Tag-Panel. `splitTagsForEditor()` überspringt sie beim Laden in den Editor. `renderPsList()` blendet sie in der Notizliste aus.
  - Zuständige Funktionen: `classifyText`, `mergeManualTags`, `rebuildPsTagsFromNotes`, `splitTagsForEditor`, `renderPsList`.
  - Zuständige Dateien: `server.js`, `app.js`.

- **Auto-Tag nur bei Erst-Erstellung, keine Überschreibung eigener Tags** `#ps` `#tags` `#race-condition` `#auto-tag`: Auto-Tags (z. B. `note`, `code`, `link`) werden jetzt ausschließlich beim ersten Erstellen einer Notiz vergeben. Danach können Benutzer eigene Tags anlegen, ohne dass diese durch Auto-Tags oder Refresh-Zyklen überschrieben werden. Ursache war eine Race-Condition: `refreshPersonalSpace()` (Polling, Visibility, Focus) rief `syncPsEditingNoteTagsFromState()` auf, die veraltete Server-Tags (ohne `__manual_tags__`-Marker) in den lokalen Editing-State übernahm und so den noch nicht gespeicherten Override-Flag sowie eigene Tags löschte.
  1. **Guard in `syncPsEditingNoteTagsFromState`** (`app.js` ~L2402): Wenn `psEditingNoteTagsOverridden = true` lokal gesetzt ist, aber der Server den `__manual_tags__`-Marker noch nicht hat, wird der Tag-Sync übersprungen (nur Pinned-State wird weiter synchronisiert). Damit bleiben lokale Tag-Änderungen bis zum erfolgreichen Server-Save erhalten.
  2. **Guard in `savePersonalSpaceNoteSnapshot`** (`app.js` ~L24410): Wenn die Text-Auto-Save-Response veraltete Tags (ohne Marker) liefert, aber lokal bereits ein Override aktiv ist, werden die lokalen Tags in `psState.notes` beibehalten statt durch die stale Server-Response überschrieben.
  - Zuständige Funktionen: `syncPsEditingNoteTagsFromState`, `savePersonalSpaceNoteSnapshot`.
  - Zuständige Dateien: `app.js`.

- **Basiskalender für nicht registrierte User** `#calendar` `#base` `#ux`: Kalender wird jetzt immer gerendert — auch wenn keine Kalenderquellen (ICS, Google, Outlook) verknüpft sind. Bisher zeigte `renderCalendarPanel()` ein Early-Return mit "Keine Kalenderquellen aktiv." und kein Kalender-Grid.
  1. **Early-Return entfernt** (`app.js` ~L19303): Die Bedingung `!sources.length && calendarState.localEvents.length === 0` als Abbruch wurde entfernt. Das Kalender-Grid (Monat/Woche/Tag) wird immer dargestellt, auch bei 0 Events.
  2. **Status-Text angepasst** (`app.js` ~L18001): `refreshCalendarEvents()` zeigt "Basiskalender aktiv." statt "Keine Kalenderquellen aktiv." wenn keine externen Quellen aber Feiertage vorhanden.
  3. **Legend-Hint** (`app.js` ~L18418): Legende zeigt `t("calendar.base.hint")` statt "Keine Kalender verbunden." bei leerem Zustand.
  - Zuständige Funktionen: `renderCalendarPanel`, `refreshCalendarEvents`, `renderCalendarLegend`.
  - Zuständige Dateien: `app.js`.

- **Feiertage & Schulferien mit Bundesland-Auswahl** `#calendar` `#holidays` `#vacations` `#bundesland`: Deutsche gesetzliche Feiertage und Schulferien werden im Kalender angezeigt. Nutzer wählen ein Bundesland aus einem Dropdown — die Auswahl wird geräteübergreifend synchronisiert.
  1. **Konstanten** (`app.js` ~L14949): `CALENDAR_BUNDESLAND_KEY`, `CALENDAR_HOLIDAYS_SOURCE` (Farbe: #ef4444), `CALENDAR_VACATION_SOURCE` (Farbe: #06b6d4), `BUNDESLAENDER`-Array (16 Bundesländer).
  2. **Feiertag-Berechnung** (`app.js` ~L18061): `computeEasterSunday(year)` (Anonymous Gregorian Algorithm), `getGermanHolidays(year, bl)` — alle bundesweiten + landesspezifischen Feiertage (Hl. Drei Könige, Fronleichnam, Buß- und Bettag, Reformationstag, Allerheiligen, Weltkindertag, Frauentag etc.).
  3. **Schulferien-Daten** (`app.js` ~L18160): `getGermanSchoolVacations(year, bl)` — Ferien für alle 16 Bundesländer, Datensätze für 2025 und 2026 (Winter-, Oster-, Pfingst-, Sommer-, Herbst-, Weihnachtsferien).
  4. **Event-Integration** (`app.js` ~L18370): `getHolidayEvents()` generiert Kalender-Events mit `isHoliday`/`isVacation`-Flags. `getCalendarEvents()` merged diese mit externen + lokalen Events.
  5. **Legende** (`app.js` ~L18467): `renderCalendarLegend()` zeigt Feiertage (rot) und Schulferien (cyan) mit Bundesland-Kürzel.
  6. **Bundesland-Selektoren** (`index.html` ~L1688, ~L2429): Dropdown im Kalender-Sidebar (`#calendarBundeslandSelect`) und in Einstellungen → Kalender (`#calendarSettingsBundesland`). Beide synchronisieren sich gegenseitig.
  7. **Persistenz & Sync** (`app.js`): `loadCalendarBundesland()`, `saveCalendarBundesland()` — localStorage + `getLocalCalendarSettings()` liefert `bundesland`-Feld → Server-Sync via `syncCalendarSettingsToServer()`. `applyCalendarSettings()` und `syncCalendarSettingsFromServer()` unterstützen das Bundesland-Feld.
  8. **i18n** (`app.js`): 14 neue Strings je Sprache (DE/EN) für `calendar.holidays.*`, `calendar.base.*`, `settings.calendar.holidays.*`.
  - Zuständige Funktionen: `computeEasterSunday`, `addDaysToDate`, `getGermanHolidays`, `getGermanSchoolVacations`, `getHolidayEvents`, `getCalendarEvents`, `renderCalendarLegend`, `renderCalendarPanel`, `refreshCalendarEvents`, `loadCalendarBundesland`, `saveCalendarBundesland`, `getLocalCalendarSettings`, `applyCalendarSettings`, `syncCalendarSettingsFromServer`, `initBundeslandSelectors`.
  - Zuständige Dateien: `app.js`, `index.html`.

## Aktuelle Änderungen (2026-02-20)

- **PsTransitionManager – prioritätsbasierter Orchestrator für psList-Rendering** `#ps` `#psList` `#race-condition` `#tabs` `#manager`: Ersetzt den einfachen Singleton-Guard durch einen vollständigen Transition-Manager, der den gesamten Lebenszyklus von Tab-Wechsel, Notiz-Auswahl, Background-Refresh und Debounced-Rerender orchestriert.
  1. **PsTransitionManager IIFE** (`app.js` ~L4921–4977): Prioritätsbasierte State-Machine mit 4 Typen: `tab-switch`(3) > `note-select`(2) > `refresh`(1) > `rerender`(0). Methoden: `begin(type)→gen|null`, `end(gen)`, `isActive(type?)`, `isBlocked(type)`, `requestRender()→bool`, `activeType()→string|null`. Höherpriore Operationen blockieren niederpriore. Queued Renders werden nach `end()` automatisch nachgeholt.
  2. **Snapshot-Restore in `_refreshPersonalSpaceImpl`** (`app.js` ~L14211): Vor dem API-Call werden `prevAuthed`/`prevNotes` gespeichert. Bei transientem Fehler (nicht-offline, vorherige Daten valide) wird der vorherige State beibehalten statt auf `{authed:false, notes:[]}` zu nullen. Damit bleiben Notizen in der psList sichtbar auch bei kurzzeitigen Netzwerkfehlern.
  3. **hashchange: Tab-Switch Transition** (`app.js` ~L21955): Gesamter hashchange-Handler mit `psTransition.begin("tab-switch")` / `.end(tsGen)` umschlossen. Async-Pfad (`refreshPersonalSpace().then(...)`) tracked mit `asyncRefreshActive`-Flag und `.finally()` für garantiertes `end()`.
  4. **schedulePsAutoRefresh Guard** (`app.js` ~L22136): `psTransition.isBlocked("refresh")` verhindert Auto-Refresh während höherpriorer Tab-Switch-Transition.
  5. **schedulePsListRerender Guard** (`app.js` ~L8956): `psTransition.requestRender()` deferred Render während aktiver Transition; Manager holt ihn nach `end()` automatisch nach.
  6. **refreshPersonalSpace Guard** (`app.js` ~L14206): `psTransition.isBlocked("refresh")` blockiert Refresh-Aufrufe während Tab-Switch.
  - Zuständige Funktionen: `psTransition` (IIFE), `refreshPersonalSpace`, `_refreshPersonalSpaceImpl`, `schedulePsListRerender`, `schedulePsAutoRefresh`, hashchange-Handler.
  - Zuständige Dateien: `app.js`.

- **Fix: psList-Notizen verschwinden bei Tabwechsel** `#ps` `#psList` `#race-condition` `#tabs`: Notizen verschwanden aus der `#psList`-Sidebar beim Wechsel zwischen Tabs und wurden erst nach Server-Reload wieder angezeigt. Ursache: Mehrere parallele `refreshPersonalSpace()`-Aufrufe (hashchange + visibilitychange + focus + polling) überschrieben sich gegenseitig `psState`. Bei fehlgeschlagenem API-Call wurde `psState.authed = false` gesetzt → `applyPersonalSpaceFiltersAndRender()` machte Early-Return → psList blieb leer.
  1. **Singleton-Guard `psRefreshPromise`** (`app.js`): Neue Variable `psRefreshPromise` verhindert parallele Ausführungen von `refreshPersonalSpace()`. Wenn bereits ein Refresh läuft, wird das existierende Promise zurückgegeben statt eine neue Ausführung zu starten. Die eigentliche Logik ist in `_refreshPersonalSpaceImpl()` ausgelagert.
  2. **`schedulePsListRerender` Guard** (`app.js`): `if (psRefreshPromise) return;` — verhindert Rendering des 120ms-Debounce-Timers während ein Refresh in-flight ist, da `psState` in diesem Moment inkonsistent sein kann.
  3. **`schedulePsAutoRefresh` Guard** (`app.js`): `if (psRefreshPromise) return;` — verhindert doppelte Refreshes durch simultane `visibilitychange` + `focus`-Events bei Tab-Rückkehr.
  - Zuständige Funktionen: `refreshPersonalSpace` ([app.js](app.js#L14129)), `_refreshPersonalSpaceImpl` ([app.js](app.js#L14135)), `schedulePsListRerender` ([app.js](app.js#L8881)), `schedulePsAutoRefresh` ([app.js](app.js#L22034)).
  - Zuständige Dateien: `app.js`.

- **Automatischer PS-Notizen-Sync zwischen Devices** `#ps` `#sync` `#offline` `#polling`: Personal-Space-Notizen werden jetzt automatisch zwischen Devices synchronisiert — ohne manuellen Reload. Zwei Mechanismen:
  1. **Visibility/Focus-Refresh** (`app.js`): Bei `visibilitychange` (Tab wird wieder aktiv) und `focus`-Events wird `schedulePsAutoRefresh()` aufgerufen, das `refreshPersonalSpace()` triggert. Damit lädt Device B sofort neue Notizen vom Server, sobald der Tab wieder fokussiert wird.
  2. **Periodisches Polling** (`app.js`): `startPsPolling()` startet einen 60-Sekunden-Intervall-Timer. Nur wenn Tab sichtbar und online, wird `refreshPersonalSpace()` aufgerufen. Damit werden neue Notizen auch bei langem Offenbleiben eines Tabs synchronisiert.
  3. **Debounce** (5s): `PS_REFRESH_DEBOUNCE_MS` verhindert, dass `refreshPersonalSpace()` öfter als alle 5 Sekunden aufgerufen wird. `psLastRefreshTs` wird sowohl bei Auto- als auch manuellen Refreshes gesetzt.
  4. **Offline-Sync-Guard**: `schedulePsAutoRefresh()` blockiert während `offlineSyncInFlight === true`, damit die IndexedDB nicht geleert wird bevor Offline-Ops replayed wurden.
  - Zuständige Funktionen: `schedulePsAutoRefresh` ([app.js](app.js#L21986)), `startPsPolling` ([app.js](app.js#L21995)), `stopPsPolling` ([app.js](app.js#L22003)).
  - Zuständige Dateien: `app.js`.

- **IndexedDB Full-Sync: Ghost-Notizen bereinigt** `#offline` `#sync` `#indexeddb`: `offlinePutNotes()` war bisher nur additiv — Notizen, die auf dem Server gelöscht wurden, blieben als Ghost-Einträge in der IndexedDB anderer Devices. Das führte zu unterschiedlichen Notizen-Anzahlen zwischen Devices, besonders bei Offline/Online-Wechseln.
  1. **Full-Sync statt additiv** (`app.js`): `offlinePutNotes()` ruft jetzt `store.clear()` vor dem Einfügen auf. Damit wird die IndexedDB bei jedem Online-Refresh komplett durch den Server-Stand ersetzt.
  2. **Leere Server-Antwort berücksichtigt** (`app.js`): Die `notes.length`-Guard im Mirror-Aufruf in `refreshPersonalSpace()` wurde entfernt. Wenn der Server 0 Notizen zurückgibt (alle gelöscht), wird die IndexedDB korrekt geleert.
  3. **Leeres Array akzeptiert** (`app.js`): `offlinePutNotes()` akzeptiert leere Arrays und führt dann nur `clear()` aus.
  - Zuständige Funktionen: `offlinePutNotes` ([app.js](app.js#L6728)), `refreshPersonalSpace` ([app.js](app.js#L14084)).
  - Zuständige Dateien: `app.js`.

## Aktuelle Änderungen (2026-02-16)

- **AI-Bild: Upload, Mirror-Einfügen, vergrößerter Ausgabebereich** `#ai` `#image` `#upload` `#ux`: Generierte FLUX.2-Bilder können jetzt in Uploads gespeichert, in den Mirror-Editor eingefügt und heruntergeladen werden. Der Ausgabebereich ist deutlich größer.
  1. **3 Aktions-Buttons** (`app.js`): ⬇ Download, 📁 In Uploads speichern (`/api/uploads` POST), ✏️ In Mirror einfügen (Auto-Upload → `![image](url)` via `insertTextAtCursor`).
  2. **Vergrößerter Output** (`app.js`, `app.css`): `updateRunOutputSizing` nutzt für `ai-image` Quelle Base 480px und 85% Budget statt 160px/65%. Mobile CSS: `#runOutput:has(img)` bekommt `max-height: 70vh`. Bild-`max-height` Limit (512px) entfernt.
  3. **Upload-Workflow**: „In Mirror einfügen" führt automatisch erst den Upload durch (falls noch nicht erfolgt), dann wird das Markdown-Bild in die Textarea eingefügt.
  4. **i18n**: 9 neue Strings für DE/EN (Download, Upload, Insert, Status-Feedback).
  - Zuständige Dateien: `app.js` (Buttons, Event-Handler, Sizing), `app.css` (Mobile-Override).

- **BFL API-Key verschlüsselt pro Benutzer** `#ai` `#image` `#security` `#encryption`: BFL (FLUX.2) API-Key wird jetzt wie der Linear API-Key pro User verschlüsselt auf dem Server gespeichert (AES-256-GCM). Jeder Benutzer hinterlegt seinen eigenen Key in Einstellungen → Integrationen.
  1. **DB-Migration** (`server.js`): Neue Spalten `bfl_api_key_ciphertext`, `bfl_api_key_iv`, `bfl_api_key_tag` in `user_settings`.
  2. **Server-Funktionen** (`server.js`): `getUserBflApiKey(userId)` / `saveUserBflApiKey(userId, apiKey)` — nutzt dieselben `encryptLinearApiKey`/`decryptLinearApiKey`-Funktionen (gleicher Cipher-Key via `MIRROR_LINEAR_KEY_SECRET`).
  3. **API-Endpoints** (`server.js`): `GET /api/bfl-key` (liest entschlüsselten Key), `POST /api/bfl-key` (speichert verschlüsselt).
  4. **Key-Fallback** in `/api/ai/image`: Request-Body `apiKey` → User-DB-Key → Env `BFL_API_KEY`.
  5. **Frontend** (`index.html`, `app.js`): Neuer BFL-Key-Bereich in Einstellungen → Integrationen (nach Linear) mit Input, Speichern/Löschen-Buttons, Status-Anzeige. Funktionen: `saveBflApiKeyToServer`, `syncBflApiKeyFromServer`, `readBflApiKeyInput`, `updateBflApiStatus`. i18n DE/EN.
  6. **Image-Request bereinigt**: Frontend sendet keinen API-Key mehr im Request-Body, Server liest den Key selbst aus der DB.
  - Zuständige Dateien: `server.js`, `app.js`, `index.html`.

- **AI-Bildgenerierung via FLUX.2 (Black Forest Labs)** `#ai` `#image` `#flux`: Neuer AI-Modus „Bild generieren" in der bestehenden AI-Section. Nutzer gibt einen Text-Prompt ein und erhält ein KI-generiertes Bild direkt im AI-Output-Bereich.
  1. **Server-Endpoint `/api/ai/image`** (`server.js`): Neuer POST-Endpoint mit Authentifizierung, Rate-Limiting und asynchronem Submit/Poll/Download-Pattern gegen die BFL API (`https://api.bfl.ai/v1/{model}`). Da BFL-Delivery-URLs kein CORS unterstützen, wird das Bild serverseitig heruntergeladen und als Base64-Data-URI an den Client zurückgegeben.
  2. **AI-Modus `image`** (`index.html`): Neue `<option value="image">` im `#aiMode`-Select mit 🎨-Icon.
  3. **Frontend-Logic** (`app.js`): `getAiMode()` akzeptiert `"image"`. Neuer Branch in `aiAssistFromPreview()` sendet Prompt an `/api/ai/image`, rendert das zurückgegebene Bild mit Download-Button im `#runOutput`-Bereich, trägt Generierung in Chat-History ein.
  4. **Konfiguration**: Env-Variablen `BFL_API_KEY` (erforderlich), `BFL_MODEL` (Standard: `flux-2-pro`), `BFL_IMAGE_TIMEOUT_MS` (Standard: 120000ms). Unterstützte Modelle: `flux-2-pro`, `flux-2-max`, `flux-2-flex`, `flux-2-klein-4b`, `flux-2-klein-9b`, `flux-pro-1.1-ultra` u.a.
  5. **i18n**: `preview.ai_mode.image` in DE („🎨 Bild generieren") und EN („🎨 Generate image").
  - Zuständige Dateien: `server.js` (Endpoint, BFL-Integration), `app.js` (Frontend-Logic, i18n), `index.html` (Select-Option).
  - Zuständige Funktionen: `aiAssistFromPreview` ([app.js](app.js#L13529)), `getAiMode` ([app.js](app.js#L13518)), `/api/ai/image`-Handler ([server.js](server.js#L4635)).

## Aktuelle Änderungen (2026-02-14)

- **Offline-Modus (PWA + IndexedDB)** `#offline` `#pwa` `#sync` `#ps`: Vollständiger Offline-Support für die App — Notizen können ohne Serververbindung erstellt, bearbeitet und gelesen werden. Änderungen werden bei Reconnect automatisch synchronisiert.
  1. **Service Worker** (`sw.js`): Stale-While-Revalidate-Strategie für alle statischen Assets (HTML, JS, CSS, Vendor-Dateien). Pre-cacht kritische Ressourcen bei Installation. API-/Upload-/WebSocket-Requests werden nicht gecacht.
  2. **PWA Manifest** (`manifest.json`): Web-App-Manifest für Standalone-Installation auf Desktop und Mobile. `display: standalone`, dunkles Farbschema.
  3. **IndexedDB Offline-Store**: Drei Object-Stores: `notes` (lokaler Notizen-Spiegel), `pendingOps` (Sync-Queue), `meta` (Email etc.). Notizen werden bei jedem `refreshPersonalSpace` in IndexedDB gespiegelt.
  4. **Offline-fähiges `savePersonalSpaceNote`**: Bei `navigator.onLine === false` wird die Notiz in IndexedDB gespeichert und eine `create`/`update`-Operation in die Sync-Queue eingereiht. AutoSave-Status zeigt „Offline gespeichert".
  5. **Offline-fähiges `savePersonalSpaceNoteSnapshot`**: Gleiche Logik für Snapshot-Saves (Auto-Save-Timer).
  6. **Offline-fähiges `refreshPersonalSpace`**: Bei Offline wird auf IndexedDB-Cache zurückgegriffen (Email + Notizen). Bei Online werden Notizen in IndexedDB gespiegelt.
  7. **Sync-Queue (`replayOfflineOps`)**: Bei `online`-Event und WebSocket-Reconnect werden ausstehende Operationen sequentiell zum Server gesendet. Temp-IDs (`offline_*`) werden durch Server-IDs ersetzt. Bei Erfolg wird die Queue geleert und ein Toast angezeigt.
     - **Retry-Logik mit Backoff**: Jede Operation hat einen `retries`-Zähler. Bei 5xx-Fehlern (502, 503 etc.) wird exponentieller Backoff angewendet (2s, 4s, 8s, 16s, 32s).
     - **Max Retries**: Nach 5 fehlgeschlagenen Versuchen wird die Operation aus der Queue entfernt und ein Fehler-Toast angezeigt.
     - **Einzelne Op-Löschung**: `offlineDeleteSingleOp(opId)` ermöglicht granulare Queue-Verwaltung statt `clearOps()`.
     - **404/409 Skip**: Operationen für gelöschte (404) oder duplizierte (409) Notizen werden übersprungen.
  8. **i18n**: `offline.now_offline`, `offline.back_online`, `offline.synced`, `offline.sync_failed`, `offline.saved_locally` in DE + EN.
  - Zuständige Dateien: `sw.js` (neu), `manifest.json` (neu), `app.js` (Offline-Store, Save-/Load-Anpassungen, Sync-Queue, i18n), `index.html` (Manifest-Link, SW-Registration), `server.js` (JSON-MIME-Type).
  - Zuständige Funktionen: `openOfflineDb`, `offlinePutNote`, `offlinePutNotes`, `offlineGetAllNotes`, `offlineDeleteNote`, `offlineEnqueueOp`, `offlineGetAllOps`, `offlineClearOps`, `offlineUpdateOp`, `offlineDeleteSingleOp`, `offlineSaveMeta`, `offlineLoadMeta`, `offlineSaveNote`, `replayOfflineOps`, `isAppOffline` (alle [app.js](app.js#L6371)).

- **Duplikat-Notizen-Schutz erweitert (Header-Vergleich)**: Ergänzt den bestehenden Volltext-Hash-Schutz um einen Header-basierten Duplikat-Check auf Client- und Server-Seite:
  1. **Client `findNoteByText` Header-Fallback**: Wenn kein exakter Volltextmatch gefunden wird, sucht die Funktion nach Notizen mit identischem Titel (erste nicht-leere Zeile, normalisiert). Nur bei genau einem Treffer wird die existierende Note zurückgegeben — verhindert Duplikate bei kleinen Textänderungen (Whitespace, Zeilenumbruch).
  2. **Client `schedulePsAutoSave` Sync-Recovery**: Wenn `psEditingNoteId` leer ist, wird `syncPsEditingNoteFromEditorText` aufgerufen bevor Auto-Save übersprungen wird. Damit wird ein verlorener ID-Bezug (z.B. durch Tab-Wechsel/CRDT-Sync) über den Header wiederhergestellt.
  3. **Server `title_hash`-Spalte**: Neue Spalte `title_hash` in der `notes`-Tabelle mit Index. Wird bei POST (Create), PUT (Update), Restore und Import gesetzt.
  4. **Server POST `/api/notes` Title-Hash-Check**: Nach dem contentHash-Check wird als Fallback per `stmtNoteGetByTitleHashUser` geprüft, ob bereits eine Note mit gleichem Header existiert. Bei Treffer wird die existierende Note zurückgegeben statt eine neue zu erstellen.
  - Zuständige Funktionen: `findNoteByText` ([app.js](app.js#L11997)), `schedulePsAutoSave` ([app.js](app.js#L21614)), `extractNoteFirstLine`/`computeNoteTitleHash` ([server.js](server.js#L1262)), POST `/api/notes` ([server.js](server.js#L3692)).

## Aktuelle Änderungen (2026-02-10)

- **Query-Engine für Personal-Space-Notizen** `#ps` `#search` `#filter` `#query`: Erweiterte Suchsyntax im PS-Suchfeld ermöglicht strukturierte Abfragen über alle Notizen. Nutzer können Tasks, Tags, Datumsbereiche, Notiztypen und Pin-Status filtern und erhalten ein aggregiertes Ergebnis-Panel mit allen passenden Tasks.
  - **Query-Parser** (`parseQueryTokens`): Zerlegt Sucheingabe in strukturierte Operatoren (`tag:`, `task:open`, `task:done`, `has:task`, `has:link`, `kind:`, `created:>`, `updated:<`, `pinned:`) und Freitext-Tokens. Unterstützt exakte Phrasen mit Anführungszeichen.
  - **Task-Extraktor** (`extractNoteTasks`): Extrahiert Markdown-Checkboxen (`- [ ]` / `- [x]`) mit Labeltext aus Notizen.
  - **Strukturierte Suche** (`noteMatchesStructuredQuery`): Filtert Notizen anhand der Query-Operatoren – lazy Task-Parsing für Performance.
  - **Query-Result-Panel** (`renderQueryResults`): Aggregiert Tasks über alle gefilterten Notizen in einem glasmorphen Panel (`#psQueryResults`) oberhalb der Notizliste. Zeigt offene/erledigte Zähler, Tag-Badges und Quellnotiz-Referenz. Klick auf einen Task öffnet die zugehörige Notiz im Editor.
  - **i18n**: `query.open`, `query.done`, `query.from_notes` in DE + EN. Search-Placeholder zeigt verfügbare Operatoren.
  - Zuständige Funktionen: `parseQueryTokens` ([app.js](app.js#L8435)), `extractNoteTasks` ([app.js](app.js#L8477)), `parseDatePrefix` ([app.js](app.js#L8491)), `isQueryMode` ([app.js](app.js#L8497)), `noteMatchesStructuredQuery` ([app.js](app.js#L8838)), `renderQueryResults` ([app.js](app.js#L8888)), `applyPersonalSpaceFiltersAndRender` ([app.js](app.js#L8966)).
  - Zuständige Dateien: `app.js`, `index.html` (Panel-HTML), `styles/app.css` (Query-Panel CSS).

- **Link-Symbol nach Shared-Room-Löschung entfernt** `#tabs` `#share` `#ws`: Wenn ein geteilter Raum über die Settings-Verwaltung entfernt wurde (`removeSharedRoom` / `clearSharedRooms`), konnte das Link-Symbol (🔗 `room-tab-link-badge`) im Tab sofort wieder erscheinen, weil WebSocket-Handler (`presence_state`, `room_pin_state`) den Raum automatisch als geteilt neu markierten. Fix: Neue `manuallyUnsharedRooms`-Set speichert explizit un-geteilte Räume. `markRoomShared` ignoriert automatisches Re-Marking für diese Räume. Beim Raumwechsel wird der Guard aufgehoben, damit ein erneuter Besuch frisch startet. Explizites Teilen (`markCurrentRoomShared`) löscht den Guard.
  - Zuständige Funktionen: `markRoomShared`, `removeSharedRoom`, `clearSharedRooms`, `markCurrentRoomShared`, hashchange-Handler (alle in `app.js`).

- **Permanent-Link Deaktivierung repariert**: `clearRoomPinnedEntry` löschte den Pin nur aus lokalen und Server-Pins, aber nicht aus den Shared-Pins (per WebSocket empfangene Einträge). Da `loadRoomPinnedEntries()` alle drei Quellen merged (shared + local + server), blieb der Pin in der Shared-Quelle erhalten und die UI zeigte „aktiv" obwohl der Toast „deaktiviert" meldete. Fix: `clearRoomPinnedEntry` ruft jetzt `clearSharedRoomPinnedEntry` auf, damit alle drei Quellen konsistent bereinigt werden.
  - Zuständige Funktion: `clearRoomPinnedEntry` ([app.js](app.js#L13802)).

- **Permanent-Link Info-Tooltip (Hover)**: Hover über den Permanent-Link-Button blendet nach 500ms ein kleines Tooltip-Fenster ein (gleicher Stil wie Kalender-Tagestermine, `tab-tooltip-layer`). Beim Verlassen verschwindet es sofort. Rechtsklick wird unterdrückt (kein Kontextmenü).
  - Zuständige Stelle: `togglePermanentLinkBtn` mouseenter/mouseleave-Handler ([app.js](app.js#L18607)).

- **Permanent-Link i18n**: Toast-Meldungen, Button-Labels und Info-Modal sind jetzt vollständig über `UI_STRINGS` (de/en) lokalisiert. HTML-Button trägt `data-i18n-title` und `data-i18n-aria` für automatische Sprachumschaltung.
  - Zuständige Strings: `editor.permalink`, `editor.permalink_active`, `toast.permalink_activated`, `toast.permalink_deactivated`, `permalink.info.title`, `permalink.info.message`.

- **Kommentar-Textmarkierung an Note-ID gebunden**: Textmarkierungen (Highlights) im Editor werden jetzt eindeutig der Note-ID zugeordnet. Jeder Kommentar speichert die `noteId` der Notiz, auf der er erstellt wurde. Neue zentrale Filterfunktion `getVisibleCommentItems()` unterscheidet zwei Kommentartypen:
  - **Raum-Kommentare** (ohne Textmarkierung): immer sichtbar im Raum – Counter, Liste, Overlay.
  - **Textmarkierung-Kommentare** (mit `selection` + `noteId`): nur sichtbar wenn die zugehörige Notiz aktiv ist – sonst weder im Counter noch in der Kommentarliste noch als Highlight im Editor.
  - Legacy-Kommentare (mit `selection`, ohne `noteId`) werden weiterhin immer angezeigt.
  - `renderCommentList` (Counter + Liste), `buildCommentOverlayHtml` (Highlights) und `updateCommentOverlay` nutzen alle `getVisibleCommentItems()` als zentrale Quelle.
  - Zuständige Funktionen: `getVisibleCommentItems` ([app.js](app.js#L2741)), `getCommentSelectionNoteId` ([app.js](app.js#L2500)), `normalizeCommentItems` ([app.js](app.js#L2595)), `buildCommentOverlayHtml` ([app.js](app.js#L2760)), `renderCommentList` ([app.js](app.js#L2951)), `addCommentFromDraft` ([app.js](app.js#L3125)).

- **Linear-Projekt für Gäste in geteilten Räumen**: Zwei Fehler behoben, die dazu führten, dass Gäste (ohne eigenen API-Key) beim Auswählen oder Aktualisieren eines via WebSocket geteilten Linear-Projekts den Fehler „API-Key fehlt" erhielten:
  1. **Apply-Button**: Sucht das Projekt jetzt zusätzlich in `linearProjectByNote` (via WebSocket empfangene Shared-Projekte), wenn es nicht in der lokalen `linearProjects`-Liste vorhanden ist. Gäste ohne API-Key rendern Tasks aus dem Cache (`linearDataByNote`) statt die Linear-API direkt aufzurufen.
  2. **Refresh-Button**: Gäste ohne API-Key senden per WebSocket `request_state` an den Server, um den gepufferten Linear-State (Projekt + Tasks) erneut zu empfangen, statt die Linear-API aufzurufen.
  - Zuständige Stellen: `linearProjectApplyBtn`-Handler ([app.js](app.js#L19640)), `linearRefreshBtn`-Handler ([app.js](app.js#L19680)).

- **Auto-Favorit für geteilte Räume**: Wenn ein Raum als geteilt markiert wird (`markRoomShared`), wird er automatisch als Favorit gespeichert. Damit kann der Nutzer einen geteilten Raum jederzeit wiederfinden – auch nach dem Schließen des Browsers oder dem Entfernen aus den Tabs. Die neue Funktion `ensureFavoriteForSharedRoom` prüft, ob der Raum bereits ein Favorit ist, und fügt ihn andernfalls hinzu (inkl. Server-Sync bei PS-Auth).
  - Zuständige Funktionen: `markRoomShared` ([app.js](app.js#L13478)), `ensureFavoriteForSharedRoom` ([app.js](app.js#L13498)).

## Aktuelle Änderungen (2026-02-09)

- **Duplikat-Notizen-Schutz**: Drei Maßnahmen gegen doppelte Notizen (gleicher Inhalt, verschiedene IDs):
  1. **Client-Mutex für manuelle Saves**: `psSaveNoteInFlight`-Flag verhindert, dass parallele manuelle `savePersonalSpaceNote`-Aufrufe gleichzeitig neue Notizen erstellen. Auto-Save (`auto:true`) ist nicht betroffen. Bei Fehler wird der Mutex im `catch`-Block freigegeben.
  2. **Server: Hash-Schutz für leere Notizen**: `computeNoteContentHash("")` gibt jetzt einen stabilen Hash (`sha256("__EMPTY_NOTE__")`) statt `""` zurück. Damit greift der `contentHash`-UNIQUE-Check auch für leere Notizen und verhindert mehrfache Empty-Notes pro User.
  3. **Mobile Note-Close: AutoSave-Reset**: `noteCloseMobile`-Handler ruft jetzt `resetPsAutoSaveState()` und leert `psAutoSaveLastSavedNoteId`/`psAutoSaveLastSavedText` nach `clearPsEditingNoteState()` auf, damit kein Timer mit veralteter ID weiterschreibt.
  - Zuständige Funktionen: `savePersonalSpaceNote` ([app.js](app.js#L20950)), `computeNoteContentHash` ([server.js](server.js#L1233)), `noteCloseMobile`-Handler ([app.js](app.js#L21665)).

- **Shared-Room App-Sync (Excalidraw, Excel, Linear)**: Drei Ursachen behoben, die dazu führten, dass iframes in geteilten Räumen nicht synchron geöffnet/geschlossen und positioniert wurden:
  1. Server sendet `room_pin_state` jetzt **vor** den App-States (`excalidraw_state`, `excel_state`, `linear_state`), damit Clients den Pin kennen bevor sie App-State verarbeiten. Zusätzlich wird `room_pin_state` auch gesendet wenn kein Pin existiert aber >1 Socket verbunden ist (mit `shared: true` Flag).
  2. `room_pin_state`-Handler ruft `syncExcalidrawForNote(noteId)` etc. mit der noteId aus der Nachricht statt `psEditingNoteId` auf, damit Guests den korrekten Room-Scope auflösen.
  3. `getExcalidrawNoteId()`, `getExcelNoteId()`, `getLinearNoteId()` verwenden in shared Rooms (`isRoomMarkedShared()`) immer den Room-Scope statt auf `psEditingNoteId` zurückzufallen. Damit senden und empfangen Owner und Guest denselben noteId-Key.
  4. `request_state`-Handler (Tab-Wechsel Re-Sync) sendet `room_pin_state` jetzt ebenfalls **vor** App-States und mit `shared: true`-Flag — gleiche Reihenfolge wie Initial-Connect.
  - Zuständige Funktionen: `getExcalidrawNoteId`, `getExcelNoteId`, `getLinearNoteId` ([app.js](app.js#L18542)), `room_pin_state`-Handler ([app.js](app.js#L17999)), Server Initial-State ([server.js](server.js#L4823)), Server `request_state` ([server.js](server.js#L5443)).
- **Shared-Room Kommentar-Sync (Markierung + Counter)**: Zwei Ursachen behoben, die dazu führten, dass Textmarkierungen und `commentCountBadge` beim Owner nicht angezeigt wurden obwohl der Client sie sah:
  1. `room_pin_state`-Handler ruft `markRoomShared()` jetzt immer auf wenn `shared`-Flag oder Pin vorhanden ist (nicht nur bei aktivem Permanent-Link). Damit kennen beide Seiten den Shared-Status.
  2. `presence_state`-Handler markiert den Room als shared wenn andere User anwesend sind (`presenceState` enthält fremde clientIds). Damit wird auch ohne Permanent-Link der Room-Scope für Kommentare verwendet und `comment_update`-WebSocket-Nachrichten nicht mehr wegen Scope-Mismatch verworfen.
  - Zuständige Funktionen: `room_pin_state`-Handler ([app.js](app.js#L17999)), `presence_state`-Handler ([app.js](app.js#L17838)), `getCommentScopeId` ([app.js](app.js#L2500)).

- Kommentar-Scope in geteilten Räumen: `getCommentScopeId()` priorisiert nun `room:` Scope wenn `isRoomMarkedShared()` true ist, bevor `note:` geprüft wird. Vorher sahen Eigentümer (mit PS-Note) und Besucher (ohne PS) unterschiedliche Scopes (`note:xxx` vs. `room:roomName`), weshalb Kommentare füreinander unsichtbar waren und der Counter (`commentCountBadge`) keine fremden Kommentare zählte. WebSocket `comment_update`-Nachrichten wurden wegen Scope-Mismatch ignoriert.
  - Zuständige Funktion: `getCommentScopeId` ([app.js](app.js#L2499)).
- Comment-Badge-Flicker bei Tab-Wechsel: `loadCommentsForRoom()` leert `commentItems` nur noch bei echtem Scope-Wechsel (`commentActiveNoteId !== scopeId`). Bei Reload desselben Scopes bleibt der alte Badge-Wert bis der Fetch abschließt, anstatt kurz auf 0 zu springen.
  - Zuständige Funktion: `loadCommentsForRoom` ([app.js](app.js#L2606)).
- Kommentar-Markierungsfarbe pro User: `buildCommentOverlayHtml` setzt jetzt inline `background`/`box-shadow` basierend auf `author.color` des jeweiligen Kommentars. Damit sind Markierungen verschiedener User visuell unterscheidbar. Ohne `author.color` greift der CSS-Fallback (Fuchsia).
  - Zuständige Funktion: `buildCommentOverlayHtml` ([app.js](app.js#L2708)).
- Erster Kommentar verschwindet in geteilten Räumen: Drei Race Conditions behoben:
  1. `scheduleCommentSave` persistiert jetzt sofort statt mit 400ms Delay, damit der Server-State aktuell ist bevor ein paralleles `loadCommentsForRoom` den lokalen State überschreibt.
  2. `loadCommentsForRoom` wartet auf laufende `commentSavePromise` bevor es den Server abfragt, damit kein veralteter State geladen wird.
  3. WebSocket `comment_update`-Handler ignoriert jetzt eigene Nachrichten (`msg.clientId === clientId`), damit der lokale State nicht durch die eigene Broadcast-Nachricht überschrieben wird.
  - Zuständige Funktionen: `scheduleCommentSave` ([app.js](app.js#L2645)), `persistCommentsForScope` ([app.js](app.js#L2655)), `loadCommentsForRoom` ([app.js](app.js#L2606)), WS-Handler `comment_update` ([app.js](app.js#L18010)).
- Kommentare an gepinnte Notiz gebunden: In geteilten Räumen mit Permanent-Link wird die `pinnedNoteId` an den Kommentar-Scope angehängt (`room:room:key:n:noteId`). Damit sind Kommentare, Counter und Overlay eindeutig der gepinnten Notiz zugeordnet. Bei Notiz-Wechsel (Pin ändern/entfernen) wird `loadCommentsForRoom()` aufgerufen, um Badge und Liste zu aktualisieren. Server-API akzeptiert optionalen `?noteId=`-Parameter für den erweiterten Scope.
  - Zuständige Funktionen: `getCommentScopeId` ([app.js](app.js#L2501)), `getCommentScopeRequestInfo` ([app.js](app.js#L2521)), `room_pin_state`-Handler ([app.js](app.js#L17986)), `togglePermanentLink`-Handler ([app.js](app.js#L18398)), Room-Comment-API ([server.js](server.js#L3760)).

## Aktuelle Änderungen (2026-02-08)

- CRDT-Sync für Gäste in Permalink-Räumen: `updateCrdtFromTextarea` blockiert nicht mehr durch `shouldSyncRoomContentNow()` – CRDT ist konfliktfrei, daher dürfen alle Clients (auch Gäste ohne aktive PS-Note) Änderungen senden und empfangen. User-Markierungen (`{ author: clientId }`) bleiben erhalten.
  - Zuständige Funktion: `updateCrdtFromTextarea` ([app.js](app.js#L17477)).
- PS-Notizenvorschau bei Remote-Sync: Wenn `applySyncedText` CRDT-Änderungen empfängt und eine gebundene Note existiert, wird `schedulePsListRerender()` aufgerufen, damit die PS-Liste sofort die aktualisierte Vorschau anzeigt.
  - Zuständige Funktion: `applySyncedText` ([app.js](app.js#L17357)).
- Room-Tabs: Server-Listenreihenfolge nutzt nun `added_at`, damit die Tab-Position beim Wechsel stabil bleibt.
  - Zuständige Stelle: `stmtRoomTabsByUser` ([server.js](server.js#L564)).
- Linear-Panel (toggleLinear) Bugfix: Drei Fehler behoben, die dazu führten, dass sich das Linear-Panel nicht mehr schließen ließ und in der PS nicht aktualisierte:
  1. Permalink-Deaktivierung räumt nun Room-Scope-States auf (`linearVisibleByNote`, `linearOffsetByNote`, `linearProjectByNote`, `linearDataByNote` + Excalidraw/Excel analog), damit Panels nicht „hängenbleiben".
  2. `syncLinearForNote` fällt nicht mehr auf veraltete Room-Scope-Sichtbarkeit zurück, wenn kein Pin und keine Note aktiv ist – stattdessen wird Linear korrekt ausgeblendet.
  3. Toggle-Click-Handler: Schließen ist jetzt immer möglich (eigener `if (linearVisible)` Pfad), unabhängig vom Projekt-Auswahlstatus.
  - Zuständige Funktionen: `togglePermanentLink`-Handler ([app.js](app.js#L18265)), `syncLinearForNote` ([app.js](app.js#L19362)), `toggleLinear`-Click ([app.js](app.js#L19390)).
- Linear-Projekt in geteilten Räumen: Wenn ein Permanent-Link mit einem Linear-Projekt aktiviert wird, erscheint das Projekt automatisch sichtbar für Gäste. Neuer Projekt-Header (`#linearProjectHeader`) zeigt den Projektnamen im Linear-Panel.
  - Zuständige Stellen: `togglePermanentLink`-Handler ([app.js](app.js#L18350)), `renderLinearTasks` ([app.js](app.js#L19123)), `#linearProjectHeader` ([index.html](index.html#L585)).
- Raumbezogene Kommentare für Gäste: Gäste in geteilten Räumen können jetzt über `toggleComments`/`commentPanel` kommentieren, ohne Personal-Space-Authentifizierung:
  1. `room_pin_state`-Handler ruft `markRoomShared()` auf, damit `getCommentScopeId()` für Gäste den Raum-Scope zurückgibt.
  2. `canSyncCommentsForScope` erlaubt Room-Scope-Kommentare ohne PS-Auth.
  3. Server: Room-Comment-REST-Endpoints (`/api/rooms/.../comments`) erfordern keine Authentifizierung mehr.
  - Zuständige Stellen: `room_pin_state`-Handler ([app.js](app.js#L17855)), `canSyncCommentsForScope` ([app.js](app.js#L2462)), Room-Comment-API ([server.js](server.js#L3760)).

## Aktuelle Änderungen (2026-02-07)

- Personal Space Autosave: Auto-Save erzeugt keine neuen Notizen mehr ohne aktive Note-ID; verhindert doppelte Listeneintraege mit unterschiedlichen Ständen in `#psList`.
  - Zuständige Funktionen: `savePersonalSpaceNote` ([app.js](app.js#L20750)), `schedulePsAutoSave` ([app.js](app.js#L20906)), `filterRealNotes` ([app.js](app.js#L7970)).
- Markdown-Tasks: Beim Abhaken wird ein Abschluss-Timestamp gespeichert und in der Vorschau subtil unter erledigten Tasks angezeigt.
  - Zuständige Funktionen: `updatePreview` ([app.js](app.js#L9667)), `toggleMarkdownTaskAtIndex` ([app.js](app.js#L10465)), `applyTaskClosedTimestampsToHtml` ([app.js](app.js#L10878)).
- Outlook Kalender: Microsoft Graph OAuth (Single-Tenant), neue Outlook-API-Endpunkte fuer Status, Kalenderliste und Event-Sync; Kalender-UI ergaenzt, Sync-Ziel im Termin-Dialog vereinheitlicht (lokal/Google/Outlook) und Outlook-Events im Kalender geladen.
  - Zuständige Dateien: [app.js](app.js), [server.js](server.js), [index.html](index.html).

## Aktuelle Änderungen (2026-02-06)

- Shared Room Pins: Permanent-Link-Zustand wird serverseitig pro Room persistiert und per WebSocket an Gäste verteilt; Clients übernehmen Room-Pin in lokalen Shared-Storage, öffnen Excalidraw/Excel/Linear auch ohne Personal Space und blockieren Room-Sync nicht für Gäste.
- Settings: Neuer Bereich zum Verwalten geteilter Raeume (Liste, Oeffnen, Entfernen, Alles entfernen) mit Filter (persistiert) und kompakter Icon-Darstellung.

## Aktuelle Änderungen (2026-02-04)

- Commit `Add Linear project stats view`: Linear-Embed um Board/Statistik-Tabs erweitert; neue Auswertung mit Kennzahlen (Status, Overdue, Due soon) und Breakdown nach Status/Assignee für das ausgewählte Projekt.
- Commit `Encrypt Linear API key storage`: Linear API-Key wird verschlüsselt serverseitig im Personal Space gespeichert; neue API `/api/linear-key` für Sync; Client lädt Key nach Login und migriert bestehende lokale Keys.
- Commit `Permanent-Link for room tabs`: Neuer Permanent-Link-Button neben Copy im Editor; verlinkter Inhalt (Notiz oder lokaler Text) bleibt dem Raum-Tab zugeordnet und wird bei Tabwechsel wiederhergestellt; Room-Sync wird nur für verlinkten Inhalt ausgeführt; verlinkte Apps speichern State im Room-Scope, damit geteilte Rooms die Apps wieder öffnen; Pins werden lokal + serverseitig für Personal-Space Nutzer synchronisiert.
- Commit `Add Linear integration for shared rooms`: Neuer Settings-Bereich "Integrationen" inkl. Linear API-Key und Projektauswahl; Linear-Panel mit Projektpicker/Refresh im Editor; Tasks werden read-only pro Room/Note-Scope über WebSocket-Events `linear_state`/`linear_data` verteilt und serverseitig gepuffert (in-memory).
- Commit `Add Ethercalc Fly service + embed`: Ethercalc wird als Fly.io-Service bereitgestellt (eigener Dockerfile/fly.toml) und im Editor als eingebettete Tabelle genutzt; Sheet-URL wird pro Room/Key generiert, Excel-Toggle/Drag bleibt erhalten. Persistenz ist optional über REDIS_URL.

- Commit `Add self-hosted Excalidraw scene sync`: Excalidraw läuft nun lokal via `/excalidraw-embed.html` (React/Excalidraw-CDN), Szenen werden per PostMessage gelesen/geschrieben, über WebSocket-Typ `excalidraw_scene` pro Note/Room-Scope synchronisiert und serverseitig gepuffert; max Payload ~200 KB, Sichtbarkeit/Offset bleiben wie zuvor. Sichtbare Unterschiede: kein externer excalidraw.com-Login nötig, Inhalt synchronisiert zwischen Clients.
- Commit `Update gitstamp`: `gitstamp.txt` auf aktuellen Stand (SHA `acf430dcd5154afa2f3e65d08309c7cbad0d7bf5`) aktualisiert.

