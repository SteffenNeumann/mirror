# Dokumentation – Änderungen (2026-09-21)

## Tags-Leiste im Editor flach
- `#psEditorTagsBar` und `.ps-tags-bar-inner` haben in **allen 13 Themes** keinen
  Hintergrund, keinen Rahmen, keinen Schatten und keinen Blur mehr — die Tag-Pills
  stehen direkt auf dem Editor.
- Umsetzung: eine Regel am Ende von `styles/app.css` mit doppelter ID
  (`#psEditorTagsBar#psEditorTagsBar`), die alle Theme-Blöcke schlägt. Die Basisregel
  gilt jetzt gezielt für `#psEditorTagsSuggest`, das Vorschlags-Dropdown behält seine Fläche.
- Cache-Busting: `?v=2026-09-21-05`, `CACHE_NAME` `mirror-v59`.

## Neues Theme „Ash Light“
- Helles Gegenstück zu Ash: kühler Schiefergrund `#f3f5f6`, Panel `#e9edef`, Text
  `#1d2427`, Akzent Stahlblau `#3e6a8a` (dunkler als im dunklen Ash, sonst 2,9:1).
- ID `ashLight`, letzte Stelle in `THEME_ORDER`, ohne Glow. `app.js`: 10 Stellen inkl.
  `isLightSyntax` (helle Code-Farben in der Vorschau).
- `styles/app.css`: aus `bitterLight` abgeleitet — 107 Gruppen-Selektoren um eine Zeile
  ergänzt, 136 Einzelblöcke mit gemappten Farben dahinter kopiert. Rein additiv, kein
  anderes Theme verändert (Alt/Neu per `getComputedStyle` verglichen).
- Eigene Markdown-Token (`--md-marker #616d77`, `--md-muted`, `--md-code`), weil die
  gemeinsamen Light-Werte auf dem kühlen Panel unter AA lagen. Alle Textpaare ≥ 4,5:1.
- Cache-Busting: `?v=2026-09-21-04`, `CACHE_NAME` `mirror-v58`.

## Code-Sprachauswahl (`#codeLang`) im Theme-Grund
- **Befund:** Das Dropdown hatte in allen dunklen Themes fest Dunkelblau `#0f172a`
  (nur die hellen Themes waren überschrieben) — in Ash, coffeeDark, bronzeDark,
  bitterDark und monoDark wirkte es wie ein Fremdkörper.
- **Fix:** `styles/app.css` setzt je Theme dieselben deckenden Werte wie `solidBgs` in
  `app.js`; Ash nimmt seine Eingabefläche `#2f3437` mit Text `#d0d9e0` und Rand `#3d4447`.
  Deckend bleibt Pflicht: `--panel-solid-bg` hat in manchen Themes Alpha.
- Cache-Busting: `?v=2026-09-21-03`, `CACHE_NAME` `mirror-v57`.

## „Claude fragen" maximiert: Antwort ganz lesbar
- **Befund:** Im maximierten Chat blieb der Verlauf klein (Nachrichten auf 3 Zeilen
  gekürzt), darüber viel leerer Platz. Die volle Antwort hing unten in `#runOutput`
  und lief auf hohen Fenstern über den Panelrand hinaus.
- **Fix:** Im Max-Modus füllt `#aiChatHistory` den freien Platz, zeigt Nachrichten
  ungekürzt und scrollt ans Ende. `#runOutput` ist auf `30dvh` begrenzt und scrollt.
  `renderAiChatHistory()` und `setAiChatMax()` rufen `scrollAiChatHistoryToEnd()`.
- Nachtrag: Eingabe steht im Max-Modus jetzt ganz unten (`#aiPromptRow { order: 1 }`),
  die Antwort darüber — vorher kam die Antwort unter der Eingabe.
- Cache-Busting: `?v=2026-09-21-02`, `CACHE_NAME` `mirror-v56`.

# Dokumentation – Änderungen (2026-09-16)

## Ziel
- Detaillierte Prüfung der Mobilansicht (iPhone 375×812): Was ist sichtbar, was ist
  bedienbar, was funktioniert nicht. Anschließend alle bestätigten Funde beheben.

## Befund
- **Stiller Datenverlust im Raum-Editor.** `#noteCloseMobile` erscheint dort, obwohl
  keine Notiz offen ist — `.mobile-only { display: inline-flex !important }` schlägt die
  Regel, die es ausblenden soll (die hat kein `!important`). Sein Handler leerte
  `textarea.value` bedingungslos; der nächste Tastendruck verteilte die Löschung über
  CRDT an alle. Mit zwei Browser-Tabs gegen Produktion reproduziert: 76 Zeichen Raumtext
  waren nach einem einzigen Tastendruck für alle weg.
- **Monatskalender unbrauchbar.** Die `grid-cols-7`-Wochentagszeile stand über einem
  `grid-cols-2`-Tagegitter; 42 Zellen à 150 px ergaben 3150 px, also 6,6 Bildschirme für
  einen Monat. Der Fix dafür existierte bereits, lag aber in
  `@media (min-width: 640px) and (max-width: 1023px)` und griff damit auf keinem Telefon.
- **Vier Funktionen nur mit Maus oder Tastatur erreichbar:** Notiz-Aktionen (nur
  `:hover` bzw. `.ps-note-active`, beides mobil ausgeschlossen), Blöcke sortieren (nur
  HTML5-Drag&Drop oder Alt+Pfeil), Befehlspalette (nur Tastenkombination), Tag- und
  Notiz-Kontextmenü (nur Rechtsklick). `app.js` hatte null `touchstart`-Handler.
- **Werkzeugleiste** 408 px breit und rechts verankert: zwei Werkzeuge lagen außerhalb
  des Bildschirms. Die dafür gedachte Verkleinerung war wirkungslos, weil `.toolbox-btn`
  gegen `#toolboxPanel .toolbox-btn` verliert.
- **Editor brach keine Zeilen um** (`white-space: pre !important`): ein Satz mit 107
  Zeichen brauchte 800 px in einem 341 px breiten Feld.
- **62 Eingabefelder unter 16 px** → iOS Safari zoomt beim Fokus hinein.
- Weiteres: „Speichern" außerhalb des Bildschirms, Vollbild-Panels auf `100vh` statt
  `dvh`, Such- und MD-Overlay 38 px zu tief, 13 Einstellungs-Reiter mit 3½ sichtbaren,
  Offline-Banner über allen Dialogen, Kalenderverwaltung mobil ganz ausgeblendet,
  Touch-Ziele bis hinunter zu 20 px, englische Texte im deutschen Interface.

## Änderungen
- **Datenverlust:** Das Leeren der Textarea hängt jetzt an `psEditingNoteId`. Das X
  bleibt sichtbar — es ist der einzige mobile Einstieg in die Notizliste — und heißt
  jetzt „Notizliste".
- **Kalender:** Wochentagszeile wird unter 1024 px ausgeblendet, der Wochentag steht in
  der Zelle; Zellenhöhe auf Telefonen 64 px statt 150 px → 2,7 statt 6,6 Bildschirme.
- **Werkzeugleiste** beidseitig begrenzt und seitlich scrollbar, Knöpfe 40 px.
- **Neu bedienbar:** Notiz-Aktionen auf Touch sichtbar, Hoch/Runter-Knöpfe zum
  Sortieren von Blöcken, Knopf für die Befehlspalette, Long-Press für die beiden
  Kontextmenüs (`addLongPress` in `app.js`).
- **Layout:** Editor bricht mobil um (Overlays ziehen mit), Knopfzeile umbricht,
  Vollbild-Panels auf `100dvh` + `bottom: auto`, Einstellungs-Reiter umbrechen,
  Offline-Banner auf `z-index: 150`, Touch-Ziele auf 44 px.
- **Eingabefelder** mobil auf 16 px — außer `#mirror`, das seine Metriken mit vier
  Overlays teilt und stattdessen über `--editor-size` mitwächst.
- **Deutsch:** Login-Dialog, Vorschau-Knopf, Statuszeile, Editor-Platzhalter,
  Notiz-Aktionen; „Geteilte Raeume" → „Geteilte Räume".
- **Nebenbei:** `styles/app.css` hat endlich einen `?v=`-Cache-Buster. Vorher wurde es
  mit `max-age=300` statt `immutable` ausgeliefert, und beim Testen kam reproduzierbar
  altes CSS zurück.

## Verifikation
- Funde live gegen Produktion gemessen, von einem separaten Agenten gegengeprüft
  (vier Fehlalarme verworfen), Fix-Paket unabhängig code-reviewt und im Browser gegen
  den unveränderten Stand getestet.
- Das Review fand eine Regression im Fix selbst: die 16-px-Regel riss `#mirror` und
  seine Overlays auseinander (16 px/25,6 px gegen 15 px/24 px). Behoben und gemessen.
- Datenverlust-Kette nach dem Deploy erneut gegen Produktion gefahren: Raumtext bleibt
  vollständig erhalten.
- Desktop 1440×900, Tablet 768×1024 und Querformat 812×375 ohne Verschlechterung.

PR #47. `app.js` und `app.css` `?v=2026-09-16-01`, `CACHE_NAME` `mirror-v54`.
Details: `.claude/memory/2026-09-16-mobil-audit.md`.

---

# Dokumentation – Änderungen (2026-09-15)

## Ziel
- Der Bereich „Claude fragen" im Vorschau-Panel soll die volle Höhe nutzen können —
  Chatverlauf und Antworten passten nicht hinein.

## Befund
- `#aiConversationSection` hatte keine Höhengrenze. Mit 15 Nachrichten wurde er
  2042 px hoch bei 736 px sichtbarer Panelhöhe; das iframe schrumpfte auf 0 px, das
  Eingabefeld lag über 1000 px unter dem sichtbaren Rand.
- `#runOutput` durfte zusätzlich bis 85 % der Panelhöhe einnehmen.
- „Vollansicht" half nicht: sie blendet nur den Editor aus, nicht die Vorschau.

## Änderungen
- **Neuer Knopf „Chat maximieren"** in der Kopfzeile „Claude fragen": blendet die
  Vorschau aus, Chat nimmt die ganze Panelhöhe. Verlauf und Antwort scrollen, das
  Eingabefeld bleibt unten sichtbar. Nochmal klicken zeigt die Vorschau wieder.
  Zustand wird bewusst nicht gespeichert.
- **Grundfix:** Der Chatbereich ist im Normalmodus auf 60 % der Panelhöhe gedeckelt und
  scrollt selbst — es wird nichts mehr abgeschnitten.
- Einklappen beendet den Max-Modus; Maximieren klappt einen eingeklappten Chat auf.
- Getestet: Desktop (1440×900) und Mobil (375×812), jeweils Verlauf + lange Antwort.
- Dateien: `index.html`, `styles/app.css`, `app.js`; Cache-Busting `v=2026-09-15-01`,
  `CACHE_NAME` `mirror-v53`.

# Dokumentation – Änderungen (2026-09-03d)

## Ziel
- `ARCHITECTURE.md` dauerhaft unter sein Budget bringen, statt es weiter zu verschieben.

## Ausgangsbefund
Gemessen an der Git-Historie der Datei:

```
2026-08-15   12,1 KB   angelegt (bei 15 KB Budget = 79 %)
2026-08-25   13,5 KB   Vergleichs-Panel
2026-09-03   15,0 KB   Ash-Theme
```

- Die Datei startete bereits bei **79 %**. Jedes Feature kostet ~0,7 KB, macht rund
  **3,4 KB pro Monat** — sie wäre spätestens im Oktober gerissen, auch ohne Ash.
- **Budget anheben wäre keine Lösung:** 20 KB hätten bei diesem Tempo etwa zwei Monate
  gekauft, und der Druck zum Kuratieren wäre weg.
- Die Ursache ist strukturell: Feature-Abschnitte wachsen mit der Zahl der Features,
  querliegendes Wissen wächst mit der App. Zwei Wachstumsraten in einer budgetierten
  Datei gehen nicht auf.

## Änderungen
- **Neue Datei `ARCHITECTURE-FEATURES.md`** — Ist-Zustand **je Feature**, wird je
  Abschnitt ersetzt, wächst, **kein Budget**. Getrennt wird nach **Lesehäufigkeit**,
  nicht nach Thema: `ARCHITECTURE.md` = was man vor *jeder* Aufgabe braucht (ganz
  gelesen, budgetiert), die neue Datei = was man nur beim Anfassen des Features liest.
  Dasselbe Muster, das bei `FUNCTIONS.md` schon trägt.
- **Umgezogen:** Vergleichs-Panel, Kalender, Notiz-Graph, Query-Engine — jeweils in
  **voller** Fassung (die zuvor am selben Tag verdichteten Abschnitte sind aus der
  Historie wiederhergestellt, nichts blieb gekürzt). In `ARCHITECTURE.md` steht dafür
  ein Abschnitt „Features im Überblick": vier Zeilen plus die je eine Regel, die man
  kennen muss, *bevor* man in die Nähe kommt (kein zweites Vorschau-iframe,
  `autoPauseRedraw`).
- **Lebensdauer-Fehler vom selben Tag korrigiert:** die verdichteten Abschnitte zeigten
  auf `.claude/memory/2026-08-25-compare-panel.md` und `…-note-graph-view.md`. Das sind
  **datierte Aufgaben-Protokolle** — sie werden nicht nachgeführt, wenn sich das Feature
  ändert, der Verweis wäre nach der nächsten Änderung falsch. Ebenso die
  Theme-Checkliste, die jetzt als Ist-Zustand in `ARCHITECTURE-FEATURES.md` steht.
- **Regel ergänzt** in `CLAUDE.md` und im Kopf der neuen Datei: neues Feature = Abschnitt
  dort + Dreizeiler mit Verweis, **nie** ein Verweis auf eine datierte Memory-Datei.
- Wegweiser nachgezogen: `CLAUDE.md`-Tabelle, `MEMORY.md`, `Project-overview.md`,
  „Wo was nachschlagen" in `ARCHITECTURE.md`, Hinweistext in `check-doc-budgets.sh`.

## Auswirkungen
- **UI/UX:** Keine. Kein Produktionscode geändert, kein Cache-Bump.
- **Budgets:** `ARCHITECTURE.md` 92 % → **81 %**, alle anderen grün. Platz für rund
  vier weitere Features, danach wächst nur noch die unbudgetierte Datei.

## Tests
- `scripts/check-doc-budgets.sh` grün.
- Geprüft, dass kein Verweis aus `ARCHITECTURE.md` mehr in eine datierte Memory-Datei
  zeigt (nur noch der legitime auf `MEMORY.md` als Erfahrungs-Index).

# Dokumentation – Änderungen (2026-09-03c)

## Ziel
- Doku und Memory nachziehen und aufräumen. Kein Produktionscode berührt.

## Ausgangsbefund
- `MEMORY.md` stand bei **99 %** seines Budgets — der nächste Eintrag hätte die CI gerissen.
- Vier Abschnitte in `MEMORY.md` (Stack Summary, Key Architectural Patterns, Mobile CSS
  Rules, Design System) **duplizierten `ARCHITECTURE.md`** — und die Kopie war bereits
  **veraltet**: sie sprach von „7 Themes (incl. bronzeDark)", während es 12 sind. Genau
  der Fehler, den die Doku-Trennung vom 2026-08-15 verhindern sollte.
- Der Log war nicht chronologisch (der 2026-09-03-Eintrag stand zwischen zwei August-Einträgen).
- Die Rotationsregel („älter als ~6 Monate") hielt mit dem Wachstum nicht Schritt.

## Änderungen
- **Rotation ausgeführt:** 22 Log-Einträge vor 2026-08-01 nach
  `.claude/memory/ARCHIVE-2026.md` verschoben (nichts gelöscht). Log neu sortiert —
  er war nicht mehr chronologisch. Im Index bleiben die 7 Einträge ab August.
- **Rotationsregel mechanisch gemacht:** ab 85 % Budget rotieren, statt nach Alter.
  Die alte Frist ist als gescheitert vermerkt, damit sie niemand zurücksetzt.
- **Duplikate entfernt:** die vier Abschnitte sind durch **einen Verweis** auf
  `ARCHITECTURE.md` ersetzt, plus eine neue Regel „Nicht wiederholen, was dort steht".
  99 % → **79 %**.
- **Gestaltungssprache umgezogen:** Glas-Optik, `backdrop-filter`, Radien, Übergangs-
  zeiten und die Show/Hide-Konvention standen **nur** in `MEMORY.md` und fehlten in
  `ARCHITECTURE.md`. Jetzt dort, wo sie hingehören.
- **`ARCHITECTURE.md` entlastet** (97 % → 92 %): die How-to-Checkliste für neue Themes
  raus (gehört nicht in einen Ist-Zustand), Vergleichs-Panel und Notiz-Graph auf das
  Wesentliche verdichtet mit Verweis auf ihre Topic-Dateien. Vorher geprüft, dass jede
  entfernte Falle dort wirklich steht.
- **Topic-Datei geteilt:** `2026-09-03-ash-theme.md` (96 %) → Theme-Port bleibt dort,
  Kontrast- und Schatten-Nachtrag nach `2026-09-03-md-highlight-contrast.md`.
- **`scripts/check-doc-budgets.sh`:** `ARCHIVE-*.md` vom Topic-Budget ausgenommen —
  Archive sind append-only und werden gegrept, nicht am Stück gelesen.
- **Offene Punkte im Memory festgehalten:** das schwache Akzent-Farbschema in 10 Themes,
  der fehlende `?v=`-Cache-Buster für `styles/app.css`, und dass `ARCHITECTURE.md` bei
  92 % strukturell an seiner Grenze ist.

## Auswirkungen
- **UI/UX:** Keine. Kein Produktionscode geändert.
- **Cache:** Kein Bump nötig — weder `app.js` noch `index.html` noch `styles/app.css`
  wurden verändert.

## Tests
- `scripts/check-doc-budgets.sh` grün; alle Budgets eingehalten, `MEMORY.md` bei 79 %.
- Vor dem Entfernen geprüft, dass jede verschobene Falle in der Zieldatei steht
  (`previewMsgToken`, `psEditingNoteId`, Tailwind-Preflight, `autoPauseRedraw`,
  Luminanz-Ableitung) — per grep, nicht per Augenmaß.

# Dokumentation – Änderungen (2026-09-03b)

## Ziel
- Markdown-Hervorhebung im Editor für **Ash** lesbar machen.
- Schatten von der Tags-Leiste `#psEditorTagsBar` entfernen, Buttons behalten ihren.

## Ausgangsbefund
- Die Markdown-Hervorhebung war **nicht kaputt** — Feature-Code seit Einführung
  (`cd06ac6` + Fix `36e2d67`) nie wieder angefasst, in Produktion verifiziert.
  Das Problem war reine Lesbarkeit auf der Ash-Fläche.
- **Farbschema „Theme-Akzent":** `--md-heading: var(--accent-strong)`. `--accent-strong`
  ist bei 8 von 12 Themes eine **halbtransparente Füllfarbe**, keine Textfarbe. Über der
  Editor-Fläche gedeckt bleibt kaum Kontrast: violet **1,92:1**, fuchsia und coffeeLight
  je 2,66:1, ash 3,23:1 — nur bitterDark (5,10:1) schafft AA. Bei Ash war die Überschrift
  damit **dunkler als der Klartext** (3,14:1 gegeneinander), sah also aus wie „keine
  Formatierung".
- **`--md-marker`** (`#`, `**`, `>`, `-`) liegt in **jedem** Theme unter AA (3,00–4,03:1).
  Ash war mit exakt 3,00:1 das schwächste — die Grundfläche `#262a2c` ist heller als bei
  den anderen Dark-Themes, der Default-Marker `#6b7280` deshalb dort am schwächsten.

## Änderungen
- **Nur Ash** angehoben (die anderen Themes passen laut User):
  `--md-marker` `#6b7280` → **`#8b949e`** (3,0:1 → 4,7:1) und, im Akzent-Schema,
  `--md-heading` → deckendes **`#6fa8d6`** (3,2:1 → 5,7:1; das Editorial-Blau liegt
  bei 5,3:1). Selektor `body.md-preset-accent[data-theme="ash"]` (0,2,1) schlägt
  `body.md-preset-accent` (0,1,1) unabhängig von der Reihenfolge.
- **Schatten der Tags-Leiste entfernt.** Die Gruppe
  `#toggleComments, #psEditorTagsBar, #psEditorTagsBar > div` trug einen gemeinsamen
  `box-shadow`. Der liegt jetzt nur noch auf `#toggleComments` (Button). Die Leiste und
  ihre innere Leiste liegen flach auf dem Editor. Das Vorschlags-Dropdown
  `#psEditorTagsSuggest` ist ebenfalls ein `> div`, behält aber über die Klasse
  `.shadow-soft` seinen eigenen Schatten — es soll weiter schweben.
  Die drei Light-Themes hatten dort ohnehin `box-shadow: none !important`, für sie
  ändert sich nichts.

## Auswirkungen
- **UI/UX:** Tags-Leiste flach in allen Themes. Ash-Hervorhebung lesbar.
- **Datenebene:** Keine.
- **Cache:** SW `v47`→`v48`, `app.js?v`→`2026-09-03-02`.

## Offen
- Das Akzent-Schema ist bei den übrigen 10 Themes weiter unter AA (violet 1,92:1 am
  schlechtesten). Bewusst nicht angefasst — der User hat sie als passend bewertet.
- `styles/app.css` ist das einzige Haupt-Stylesheet **ohne** `?v=`-Cache-Buster
  (`index.html:42`). Server liefert `max-age=300` statt `immutable`, der SW
  stale-while-revalidate. Ein `CACHE_NAME`-Bump repariert es pro Deploy, strukturell
  bleibt die Lücke. Als eigener Schritt vorgemerkt.

## Tests
- Lokal verifiziert: `#psEditorTagsBar` und `.ps-tags-bar-inner` `box-shadow: none`,
  `#psEditorTagsSuggest` behält `rgba(0,0,0,.2) 0 6px 14px`, `#toggleComments` behält
  seinen Schatten — geprüft in Ash **und** fuchsia. Ash-Tokens: `--md-marker` `#8b949e`,
  `--md-heading` `#6fa8d6` kommen im Overlay an. Kontraste nachgerechnet, nicht geschätzt.

# Dokumentation – Änderungen (2026-09-03)

## Ziel
- Das Theme **„Ash"** aus der macOS-App `sku-menubar` nach Mirror übernehmen.

## Ausgangsbefund
- `sku-menubar` hatte sein Theme-System ursprünglich **aus Mirror portiert**
  (`ThemeManager.swift:4`). „Ash" ist dort neu entstanden und existierte in Mirror nicht —
  die Aufgabe war also ein Rück-Port von SwiftUI nach CSS.
- Der Quell-Kommentar dort nennt `#202325`; der reale Wert ist seit Commit `880aa41`
  **`#262A2C`**. Auch die dort notierten „11.1:1" stimmen nicht mehr (real 10,13:1).
- Zwei Kontrastlücken im Original: Tertiärtext (`#808080`, 3,64:1) verfehlt AA überall,
  Sekundärtext (`#999999`) verfehlt AA auf Karten (4,10:1).

## Änderungen
- **Neues Dark-Theme `ash`** — flach, ohne Glow, ohne Verlauf: Grundfläche, Sidebar und
  Panels tragen dieselbe Farbe `#262A2C`. Struktur entsteht über weiße Auflagen
  (`#2F3437` Fläche, `#3D4447` Rahmen) statt über Flächenkontrast. Akzent:
  Steel-Blue `#6C96B4`, Akzent-Text `#80AAC8`, Haupttext `#D0D9E0`.
- **Textstufen gegenüber dem Original angehoben**, damit jede Stufe AA (4,5:1) auf
  *beiden* Flächen erreicht: `.text-slate-100` `#d0d9e0` (10,1/8,8) · `200` `#bcc6ce`
  (8,4/7,3) · `300` `#a3aeb6` (6,4/5,6) · `400` `#9aa5ad` (5,8/5,0) · `500` `#939ea6`
  (5,3/4,6). Code-Kommentare in der Vorschau von `0.5` auf `0.65` Alpha (3,4 → 4,7:1).
  Das „Heute"-Badge im Kalender bekommt für Ash den soliden Akzent mit dunklem Text
  (5,6:1) — Weiß auf `--accent-strong` käme nur auf 4,48:1.
- **`app.js` (9 Stellen):** `THEMES.ash`, `THEME_ORDER`, `GLOW_BLOCKED_THEMES`,
  `solidBgs`, `modalBackdrops`, `modalBorders`, `getPreviewFieldColors`,
  `getPreviewPreColors`, `buildPreviewHighlightCss`.
- **`styles/app.css` (5 Stellen):** Haupt-Block (~360 Zeilen), `.ps-tags-bar-inner`-Block,
  `.excel-iframe`-Invert-Liste, `.ps-note-pin svg path`-Gruppe, `.calendar-day-today`-Gruppe.
- **Lücken mitgenommen, die `bronzeDark` selbst noch hat:** `#settingsGlowToggle` wird
  optisch deaktiviert, `.block-arrange-overlay`, `.cal-mode-tab(-active)`,
  `#mirror.attribution-active` (caret-color) und `getPreviewPreColors` sind für Ash
  von Anfang an gesetzt.
- **JS- und CSS-Werte sind deckungsgleich.** Bei `bronzeDark` divergieren sie real
  (`--accent-text` `#fff` in der Vorschau vs. `#e8dfd3` im Editor), weil JS auf `<html>`
  schreibt und CSS auf `<body>` — die UI nimmt immer den CSS-Wert.

## Auswirkungen
- **UI/UX:** Ein Theme mehr, an letzter Position der Liste. Kein bestehendes Theme berührt.
- **Datenebene:** Keine.
- **Cache:** SW `v46`→`v47`, `app.js?v`→`2026-09-03-01`.

## Tests
- Lokal statisch verifiziert (Browser): Theme erscheint in der Liste und lässt sich wählen;
  `body`, `#psPanel`, `#editorPanel` und `#mirror` sind alle exakt `rgb(38,42,44)` (flach);
  Glow ist gesperrt (`glow-disabled`, Blobs `display:none`, Toggle `opacity 0.35`);
  `--modal-backdrop`/`--modal-border` kommen korrekt aus JS an; das Vorschau-iframe rendert
  Hintergrund, Text, Links, Blockquote, Inline-Code, Tabellen und hljs-Syntaxfarben in
  Ash-Farben; Kalender inkl. „Heute"-Badge und Mode-Tabs korrekt; Mobile-Viewport korrekt.
  Keine Konsolenfehler.

# Dokumentation – Änderungen (2026-08-25b)

## Ziel
- Das Vergleichs-Panel ohne Tastenkombination bedienbar machen.

## Änderungen
- **Neuer Knopf in jeder Notizzeile** (`data-action="compare"`), erstes Symbol in `.ps-note-actions` vor Pin/Teilen/Löschen. Ein geteiltes Rechteck als Symbol; die gerade verglichene Notiz wird fuchsia markiert (`aria-pressed`).
- **Zweiter Klick schließt das Panel**, die Auswahl bleibt erhalten — erneutes Öffnen zeigt dieselbe Notiz wieder.
- **Auf der Notiz im Editor wird der Knopf weggelassen**, statt einen wirkungslosen Knopf anzubieten (das Panel lehnt die bearbeitete Notiz ohnehin ab).
- **Kontextmenü-Eintrag „Zum Vergleichen öffnen"** (Rechtsklick, auf Mobil langes Tippen). Das ist der Weg ohne Hover — `.ps-note-actions` wird nur bei `:hover` bzw. auf der aktiven Zeile eingeblendet, auf Touch-Geräten also nicht. Label wechselt zu „Vergleich schließen", wenn die Notiz gerade im Panel steht; auf der bearbeiteten Notiz ist der Eintrag ausgeblendet.
- **Markierung folgt dem Panel:** `setCompareNoteId` und `setComparePanelVisible` stoßen einen Listen-Rerender an, wenn sich Auswahl oder Sichtbarkeit ändern — ohne das bliebe die Markierung auf der alten Zeile stehen. Doppeltes Rendern ist abgefangen.
- **Hinweistext im leeren Panel** verweist jetzt auf das Symbol statt auf Alt+Klick. Alt+Klick funktioniert unverändert weiter.
- **i18n:** 2 neue Keys in DE und EN.

## Auswirkungen
- **UI/UX:** Ein Symbol mehr pro Notizzeile. Drei Wege zur selben Funktion: Symbol, Kontextmenü, Alt+Klick — plus die Auswahl im Panel-Kopf.
- **Datenebene:** Keine. Das Panel bleibt strikt read-only.
- **Cache:** SW `v45`→`v46`, `app.js?v`→`2026-08-25-02`.

## Tests
- Lokal gegen den Fake-API-Server verifiziert: Knopf öffnet das Panel und markiert die Zeile, zweiter Klick schließt es und behält die Auswahl, auf der bearbeiteten Notiz fehlt der Knopf, Kontextmenü-Eintrag öffnet den Vergleich mit korrektem Label, Editor bleibt in allen Fällen unberührt. Keine Konsolenfehler.

# Dokumentation – Änderungen (2026-08-25)

## Ziel
- Zwei Notizen nebeneinander lesen und vergleichen können.

## Ausgangsbefund
- **Tabs existierten bereits — als Raum-Tabs.** Ein Tab = ein Raum (`room`+`key`), `MAX_ROOM_TABS = 5`, persistiert in `mirror_room_tabs_v1` + Server-Tabelle `room_tabs`. Umschalten läuft ausschließlich über `location.hash` → `hashchange` und baut WS + CRDT komplett neu auf; zwei Tabs gleichzeitig sichtbar waren damit ausgeschlossen. Gefehlt hat nicht das Öffnen, sondern das Nebeneinander.
- **Ein zweiter *editierbarer* Editor wäre ein Neubau:** ein `<textarea id="mirror">`, ein Yjs-Doc, eine WS-Verbindung — und `psEditingNoteId`, Auto-Save-Kette, Undo/Redo, Vor/Zurück-Historie und Kommentare sind sämtlich Singletons. `psAutoSaveLastSavedNoteId` kennt genau **eine** Notiz; eine Verwechslung schriebe Text in die falsche Notiz. Umgesetzt wurde deshalb die read-only Variante.

## Änderungen
- **Neues Panel `#comparePanel`** als Geschwister von `#previewPanel` in `#editorPreviewGrid`. Vorschau und Vergleich teilen sich die zweite Spalte — drei Spalten sind zwischen 1024 und ~1280 px unbenutzbar.
- **Öffnen:** Button „Vergleichen" neben „Vorschau", oder **Alt+Klick** auf eine Notiz in der Liste. Auswahl zusätzlich über ein Select im Panel-Kopf; die zuletzt gewählte Notiz merkt sich `mirror_compare_note_v1`.
- **Rendering ohne iframe:** `buildPreviewContentHtml(text, {noteId, showMeta})` — die Funktion wurde um die beiden optionalen Parameter erweitert, ohne Parameter verhält sie sich unverändert. Ergebnis landet in `.md-content` im Haupt-DOM. Code-Highlighting, Farb-Chips, Passwortfelder, Tabellen, Task-Timestamps und PDF/Video-Embeds kommen damit unverändert mit.
- **Bewusst kein zweites Vorschau-iframe:** `previewMsgToken` ist ein *einziger* globaler String, gegen den der zentrale `message`-Handler alle Nachrichten validiert. Ein zweiter Frame wäre entweder tot oder würde den des Hauptpanels kapern — ein Checkbox-Klick im Vergleich schriebe dann in die **bearbeitete** Notiz.
- **`psEditingNoteId` bleibt unberührt.** Alt+Klick greift ganz vorn im Listen-Handler, vor `flushPendingPsAutoSave()`. Auf Mobil hängt der komplette Ansichtszustand allein an dieser Variable, und die Auto-Save-Kette leitet daraus die bearbeitete Notiz ab.
- **Eigene Typografie unter `.compare-body`:** Tailwind-Preflight resettet Überschriften und Listen. Der Vorschau-iframe kennt kein Preflight und lebt von Browser-Defaults — im Haupt-DOM las sich die Notiz sonst als Fließtext ohne Struktur.
- **Task-Checkboxen werden deaktiviert.** Die Task-Listen rendern mit `enabled: true`, sind also echte Checkboxen. Im iframe fängt `attachPreviewCheckboxWriteback()` die Klicks ab — im Panel gibt es keine Rückschreibe-Kette, ein Haken hätte sich sichtbar gesetzt und wäre nie gespeichert worden.
- **PDF-Links bleiben Links** (`skipPdfEmbed`). Das `.pdf-embed`-Widget braucht pdf.js und CSS, die nur im Vorschau-iframe leben; im Haupt-DOM bliebe ein toter Kasten. Video-Embeds bleiben, die sind native `<video>`-Elemente.
- **Links:** `note:`-Wiki-Links werden abgefangen und springen **im Panel** weiter, statt per `postMessage` in den Editor. Zeigt der Link auf die Notiz im Editor, kommt ein Hinweis-Toast statt einer stillen Nicht-Aktion. (`target="_blank"` setzt bereits die `link_open`-Rule für jeden Link.)
- **Robustheit:** die Vergleichsnotiz kann nie die bearbeitete sein (sonst räumt der nächste Rerender sie kommentarlos weg); eine gelöschte Notiz wird aus Auswahl und `localStorage` entfernt, statt das Select auf einen Wert ohne Option zu setzen; das Nachladen der Markdown-Libs versucht genau **einen** erneuten Render (sonst Microtask-Endlosschleife, wenn die Libs da sind, aber die Initialisierung wirft).
- **Aktualität:** `syncComparePanelFromState()` hängt am Listen-Rerender (u. a. 60-s-Poll, Tab-Fokus) und rendert Markdown nur bei tatsächlich geändertem Inhalt neu. Dieselbe Notiz links und rechts wird automatisch aufgelöst.
- **Mobil:** eigener Vollbildmodus über die Body-Klasse `mobile-compare-open` (`100dvh`, `bottom: auto`), inklusive der `main`-Viewport-Regel, Priorität zwischen Vorschau und Notiz-Ansicht.
- **Altbug mitgefixt:** `setPreviewVisible()` überschrieb `editorPreviewGrid.className` komplett und warf dabei `comment-panel-open` (Kommentarpanel) und `hidden` (Kalender) weg. Ersetzt durch `syncEditorPreviewGridColumns()` mit `classList.toggle`.
- **i18n:** 13 neue Keys in DE **und** EN.

## Auswirkungen
- **UI/UX:** Zusätzlicher Button in der Editor-Leiste. Vorschau und Vergleich schließen sich gegenseitig aus. Bestehende Abläufe unverändert.
- **Datenebene:** Keine. Das Panel ist strikt read-only — kein Schreibpfad, kein CRDT, kein Auto-Save.
- **Backend:** Keine Änderung. Die Notizen liegen bereits vollständig clientseitig in `psState.notes`.
- **Grenze:** `stmtNotesByUser` liefert `LIMIT 500` und es gibt keine Route für eine einzelne Notiz — ab 500 Notizen wäre eine ältere Notiz clientseitig nicht auffindbar.
- **Cache:** SW `v44`→`v45`, `app.js?v`→`2026-08-25-01`.

## Tests
- Lokal gegen einen Fake-API-Server (der echte Serverstart scheitert weiter an der `better-sqlite3`-ABI; `npm rebuild` läuft unter Node 26 nicht durch).
- Verifiziert: Spaltenwechsel 1↔2, gegenseitiger Ausschluss mit der Vorschau, Rendering inkl. Überschriften/Listen/Tabellen/Code-Highlighting/Farb-Chips/Passwortfeld (Aufdecken funktioniert über den bestehenden Handler auf `document`-Ebene), Wiki-Link-Sprung im Panel ohne URL-Wechsel, Alt+Klick ohne Editor-Änderung, Auto-Auflösung bei gleicher Notiz links/rechts, Persistenz der Auswahl, Light-Theme (coffeeLight), Mobil-Vollbild inkl. Rückkehr, Layout bei 1024 px. Der Altbug-Fix ist gegengeprüft: `comment-panel-open` überlebt den Preview-Umschalter.
- Keine Konsolenfehler aus dem Feature (nur WS-/SW-Meldungen des Fake-Servers).

## Offen
- Zeilenweiser Diff (farbige Unterschiede) bewusst nicht in v1 — es gibt keine Diff-Bibliothek im Projekt, das wären ~80–120 Zeilen ohne neue Abhängigkeit.
- Keine E2E-Tests; `tests/` enthält weiterhin nur den Playwright-Scaffold.

# Dokumentation – Änderungen (2026-08-15)

## Ziel
- Hex-Farbcodes in der Markdown-Vorschau als Farbkreis + Hex-Label rendern (Anwendungsfall: Notiz „Colormatches" mit Paletten der Form `Neon Orange /FF6115/ + Porcelain /FFFCF4/`).

## Änderungen
- **Farb-Chips** in `ensureMarkdown()`: `/FF6115/` (Slash-Form, 3/6/8 Hexstellen) und `#FF6115` (Hash-Form, nur 6/8 Stellen) werden zu `<span class="color-chip">` mit farbigem Punkt und Hex-Label.
- **Bewusst als markdown-it CORE-Rule**, nicht als Inline-Tokenizer: die für `||passwort||` gepatchte `text`-Rule (`textWithPipe`) terminiert nicht auf `/`, der Text-Scanner verschluckt `/FF6115/` also als Plain-Text — ein Inline-Tokenizer wird an der Position nie aufgerufen (empirisch verifiziert: 0 Treffer). Die Core-Rule läuft über die fertigen inline-Token und schützt dadurch Code-Spans und Fences automatisch.
- **Link-Tiefen-Tracking** über `link_open`/`link_close`: ohne das zerschneidet die Regex Linktexte und linkify-erkannte URLs (`https://ex.de/facade/`).
- **False-Positive-Härtung:** nur Längen 3/6/8, nur an Wortgrenzen (`(^|[\s(\[])` + Lookahead). Das schließt `beef`, `cafe`, `/usr/bin/`, `24/7`, `1/2/3` aus. Die Hash-Form erlaubt **keine** 3 Stellen, sonst würden Hashtags wie `#dad`, `#bad`, `#ace` zu Farbchips.
- **Sicherheit:** Nur `[0-9a-fA-F]` erreicht das `style`-Attribut (Whitelist-Regex im Renderer, zusätzlich zur Regex beim Tokenisieren) — CSS-Injection strukturell ausgeschlossen, passend zu `html:false`.
- **Styling an zwei Stellen**, weil die Haupt-Vorschau ein iframe mit inline generiertem CSS ist: theme-abhängig (`isLightSyntax`) im iframe-`<style>`, plus globale `.color-chip`-Regeln in `styles/app.css` für PS-Notizkarten und Kommentare. Innerer Ring (`box-shadow: inset 0 0 0 1px rgba(128,128,128,.45)`) hält sehr helle (`#FFFCF4`) wie sehr dunkle (`#18251D`) Farben auf jedem Theme sichtbar.
- **Settings → „Editor":** Schalter „Farb-Chips in der Vorschau", **Default an**, Persistenz `mirror_color_chips` (nur explizites `"0"` schaltet ab). Die Core-Rule liest das Flag bei jedem Render → Umschalten wirkt sofort ohne Neuaufbau der `md`-Instanz. i18n-Keys DE + EN ergänzt.

## Auswirkungen
- **UI/UX:** Default an; abschaltbar. Bestehende Notizen bleiben unverändert — die Syntax des Users muss nicht angepasst werden.
- **Datenebene:** Keine. Reines Render-Feature, kein Eingriff in gespeicherten Text.
- **Performance:** Regex läuft nur über `text`-Token und steigt früh aus, wenn weder `/` noch `#` vorkommt.
- **Cache:** SW `v43`→`v44`, `app.js?v`→`2026-08-15-01`.

## Tests
- 40 automatisierte Assertions gegen den **aus `app.js` extrahierten** Code (nicht gegen eine Kopie) mit der vendored markdown-it: Notiz 12/12 Farben, Heading/Wiki-Link/Liste intakt, 9 Kontext-Schutz-Fälle, 15 False-Positive-Fälle, Toggle an/aus, Injection-Abwehr. Alle bestanden.
- Browser verifiziert (statisch serviertes Frontend): 13 Chips gerendert, Negativfälle (`` `/FF6115/` ``, linkify-URL, `#dad`, `/beef/`) bleiben Text, Toggle 13→0→13, Kontrast auf monoDark **und** monoLight geprüft, keine JS-Konsolenfehler.

# Dokumentation – Änderungen (2026-07-02b)

## Ziel
- Einstellbares Markdown-Highlighting + Editor-Schriftart (JetBrains Mono) im Eingabebereich `#mirror`.

## Änderungen
- **JetBrains Mono** self-hosted (`/vendor/jetbrains-mono-var.woff2`, Variable Font, `@font-face`, SW-precached). Neue CSS-Vars `--editor-font/-size/-lh` werden von Textarea **und allen Overlays** gemeinsam genutzt (identische Metrik = Ausrichtung).
- **Markdown-Quell-Highlighting** als 4. Overlay (`#mdHighlightOverlay`): Tokenizer (`buildMdHighlightHtml`/`mdInline`) färbt Überschriften+Marker, Bold/Italic, Inline-/Fenced-Code, Links `[t](url)`, `[[Wikilinks]]`, Blockquote, Listen, `---`, Tasks. Textarea-Text wird transparent (`-webkit-text-fill-color`), Caret bleibt via `caret-color`. Reuse des bestehenden Scroll-Sync-Musters.
- **5 Theme-Variablen** `--md-heading/-marker/-link/-code/-muted` (Dark-Defaults „Editorial-Blau" + Light-Overrides für AA-Kontrast). **3 Presets** via Body-Klasse: Editorial-Blau (Default), Theme-Akzent (`--accent-*`), Gedämpft.
- **Settings → „Editor"**: Schriftart (System Sans / JetBrains Mono / System Mono), Markdown-Hervorhebung An/Aus (Default aus, erzwingt Monospace), Farbschema-Presets. Persistenz `mirror_editor_font` / `mirror_md_highlight` / `mirror_md_preset`.

## Auswirkungen
- **UI/UX:** Opt-in, Default unverändert (Sans, Highlighting aus). Alles CSS-Var-gesteuert → alle Themes.
- **Datenebene:** Keine. Rein clientseitig (Overlay + localStorage).
- **Performance:** Tokenize debounced (60 ms) + nur wenn aktiv; Monospace hält Ausrichtung (feste Advance-Breite über Gewicht/Kursiv).
- **Cache:** SW `v30`→`v31`, `app.js?v`→`2026-07-02-04`, Font precached.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`, `node --check sw.js`; Tokenizer-Unit-Smoke (keine Platzhalter-Reste).
- Editor-Rendering (JetBrains Mono + Editorial-Blau) auf Dark (monoDark) und Light (coffeeLight) via Playwright-Harness verifiziert.

# Dokumentation – Änderungen (2026-07-01d)

## Ziel
- Visuelles Redesign der Graph-Ansicht (Ausrichtung, Typografie, Knotendesign).

## Änderungen
- **Knotendesign:** Notizen = Kreise mit dezenter Tiefe (Top-Sheen + 1px-Ring); Tags = abgerundete Kacheln mit `#`-Glyphe — durch die Form sofort unterscheidbar (statt nur Füllung vs. Ring). Dynamischer Hub: der am stärksten verlinkte Knoten (`ngState.topHubId`, Schwelle `hubThreshold = max(4, ceil(maxDeg*0.6))`) bekommt hellen Kern, „Well" und schwereren Ring.
- **Typografie:** Labels als Pille (roundRect-Halo), Mindestgröße ~12px on-screen, Ellipsis ab 26 Zeichen, Anzeige-Regeln gegen Gewusel (bei > 120 Knoten nur Hub/Auswahl/Hover/Treffer-Labels bis Zoom 2.4).
- **Layout (d3-force):** größenskalierte Ladung + `distanceMax`, getrennte Link-Distanzen (Wiki 30 / Tag 46), eigene **Kollisions-Force** (kein d3-Import) gegen Überlappung inkl. Label-Platz, schnelleres Einschwingen (`d3AlphaDecay 0.045`, `velocityDecay 0.45`, `cooldownTicks 120`), `d3ReheatSimulation` bei Datenänderung.
- **Kanten:** ruhiger (niedrigerer Kontrast), Fokus-Dimming (nicht-fokussierte Kanten ×0.4), Tag-Kanten leicht gekurvt.
- **Zustände:** Hover/Selektion dimmt Rest auf 0.12; Auswahl = Blur + crisper Ring; Suchtreffer bleiben sichtbar.
- Alle Werte aus dem Theme-Palette-Objekt → alle Themes automatisch; Light-Theme-Kontrast (dunklerer Note-Ring, opakeres Halo) berücksichtigt.

## Auswirkungen
- **UI/UX:** Deutlich aufgeräumteres, „designtes" Erscheinungsbild. Rein Canvas (`ngDrawNode`/`ngInit`/`ngApplyData`), keine HTML/CSS-Struktur geändert.
- **Performance:** Geometrie/Labels/Hub in `ngPrecompute` (einmal pro Datenänderung), nicht pro Frame; Sim friert nach Cooldown ein.
- **Cache:** SW `v26`→`v27`, `app.js?v`→`2026-07-01-05`.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`, `node --check sw.js`
- Neues Rendering + Kollisions-Layout via Playwright-Harness auf Dark (fuchsia) und Light (coffeeLight) verifiziert.

# Dokumentation – Änderungen (2026-07-01c)

## Ziel
- Tags im Notiz-Graphen sichtbar machen (als eigene Knoten).

## Änderungen
- Der „Tags"-Schalter (früher „Tag-Kanten") zeigt Tags jetzt als **eigene Knoten** statt Notiz-zu-Notiz-Kanten. Jeder Tag wird ein Knoten, der mit allen Notizen verbunden ist, die ihn tragen (Stern-Topologie → kein Hairball).
- Tag-Knoten sind visuell abgesetzt: kleiner, weicher Ring in `--accent-text-soft`, Label mit `#`-Präfix; Kante Notiz→Tag gestrichelt.
- Interne `__`-Tags werden ausgeschlossen; nahezu universelle Tags (auf > 40 Notizen) übersprungen. Notiz-`deg` (Hub-Größe + Listen-Badge) zählt weiterhin nur Wiki-Links, nicht Tags.
- Tag-Knoten erscheinen nicht in der Notizliste; Klick auf einen Tag-Knoten hebt seine Notizen hervor (bzw. fokussiert sie im Lokal-Modus).

## Auswirkungen
- **UI/UX:** `ngBuildData` erzeugt Tag-Knoten (`kind:"tag"`), `ngDrawNode`/`ngNodeRadius` zeichnen sie abgesetzt; Legende zeigt einen Tag-Ring. Default weiterhin AUS.
- **Datenebene:** Keine. Client-seitig aus vorhandenen `tags_json`.
- **Cache:** SW `v25`→`v26`, `app.js?v`→`2026-07-01-04`.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`, `node --check sw.js`
- Tag-Knoten-Rendering (Note vs. Tag, gestrichelte Kanten, `#`-Label) via Playwright-Harness verifiziert.

# Dokumentation – Änderungen (2026-07-01b)

## Ziel
- Graph-Ansicht: linke Notizliste (Obsidian-Split-View) + Zoom-Fix.

## Änderungen
- **Zoom-Fix:** Klick auf einen Knoten im Lokal-Modus zoomte extrem rein (1–2 Knoten füllten den Viewport). Neuer `ngFitView()` clampt den Auto-Fit-Zoom auf 1.8×; manuelles Zoomen bleibt (`minZoom 0.15` / `maxZoom 8`).
- **Notizliste (Sidebar):** Links im Overlay eine Liste aller Notizen (`#ngSidebar`, 300px, einklappbar + in localStorage gemerkt). Zeile = Titel + Verbindungs-Badge (`deg`) + Meta (Tags · Datum). Sortierung Verbindungen/Neueste/A–Z (gemerkt).
- **Auswahl-Funnel `ngSetSelection()`:** Klick auf Zeile oder Knoten wählt dieselbe Notiz — Zwei-Wege-Sync; Lokal = Nachbarschaft neu aufbauen, Global = zum Knoten gleiten. Hover in Liste hebt Knoten hervor (Desktop).
- **Vorschau-Karte entfernt** — Inhalt (Tags, Links/Backlinks, „Notiz öffnen") klappt jetzt in der ausgewählten Zeile auf.
- **Suche** (bestehende Toolbar) filtert jetzt die Liste **und** dimmt den Graphen.
- **Global/Lokal-Toggle bleibt.** **Mobil:** Liste ist Default-Ansicht, „Liste/Graph"-Umschalter; Tap auf Notiz öffnet ihren lokalen Graphen.

## Auswirkungen
- **UI/UX:** Overlay wird Split-View (`.ng-body` = Sidebar + `.ng-canvas-wrap`). Themed über `--accent-*` / `--sel-text`.
- **Feature-Interaktionen:** Liste und Canvas teilen eine Auswahlquelle (`ngState.selected`); `ngResize()` nach Sidebar-Toggle, damit force-graph neu misst.
- **Datenebene:** Keine. Alles Client-seitig aus `ngBuildData()`.
- **Cache:** SW `v23`→`v25`, `app.js?v`→`2026-07-01-03`.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`, `node --check sw.js`
- Layout + Theming (Desktop dark, coffeeLight, Mobile Liste/Graph, Sidebar-Collapse-Reflow) via Playwright-Harness verifiziert.

# Dokumentation – Änderungen (2026-07-01)

## Ziel
- Obsidian-artige Graph-Ansicht: Beziehungen zwischen Personal-Space-Notizen visuell darstellen.

## Änderungen
- Neuer Button „Graph" in der PS-Toolbar (`#psGraphBtn`, neben Filter) öffnet ein Vollbild-Glas-Overlay (`#noteGraphOverlay`).
- Graph baut Knoten aus `psState.notes` und Kanten aus vorhandenen `[[Wiki-Links]]` (+ optionalen, gekappten Tag-Kanten) — kein Backend-/DB-Change.
- Gerendert mit vendored `force-graph` (`/vendor/force-graph.min.js`, Canvas, lazy-load beim ersten Öffnen, im Service Worker precached für Offline).
- Farben werden live aus den Theme-Variablen (`--accent-*`, `--panel-solid-bg`) gelesen → funktioniert über alle Themes. Label-/Titelfarben sind luminanz-basiert (mehrere Dark-Themes liefern schwarze `body color`); Light-Themes erhalten explizite Titel-Kontrast-Overrides (dort ist `--accent-text: #fff`).
- Interaktionen: Hover = Nachbarn hervorheben + Rest dimmen, Klick = Notiz-Vorschau mit „Öffnen", Global/Lokal-Umschaltung, Suche, Tag-Kanten-Toggle, Zoom-to-fit, Esc/✕. Mobil default Lokal.

## Auswirkungen
- **UI/UX:** Neues Overlay auf `z-index: 9997`; `body.note-graph-open` sperrt Scroll. Themed über alle 7+ Themes.
- **Feature-Interaktionen:** Klick auf Knoten öffnet die Notiz im Editor (`findNoteById` → `applyNoteToEditor`); nutzt die bestehende Wiki-Link-Auflösung (`buildNoteTitleIndex`).
- **Datenebene:** Keine. Reine Client-Ansicht über vorhandene Notizdaten.
- **Cache:** Service Worker `mirror-v22` → `v23`; `app.js?v=` → `2026-07-01-01`; `force-graph.min.js` precached.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check sw.js`
- force-graph-Init-Kette, Rendering und Theming (coffeeLight/fuchsia/bronzeDark/mono/bitter) via isoliertem Playwright-Harness verifiziert (lokaler Full-App-Boot scheitert an `better-sqlite3` ABI vs. Node 26).

# Dokumentation – Änderungen (2026-02-04)

## Ziel
- Permanent-Link pro Raum-Tab: aktuellen Inhalt fest mit dem Tab verknüpfen.

## Änderungen
- Neuer Permanent-Link-Button neben Copy im Editor.
- Verlinkter Inhalt (Notiz oder lokaler Text) bleibt dem Raum-Tab zugeordnet und wird beim Tabwechsel wiederhergestellt.
- Room-Sync wird nur für den verlinkten Inhalt ausgeführt.
- Permanent-Link wird für eingeloggte Personal-Space Nutzer serverseitig gespeichert und synchronisiert.
- Verlinkte Apps (Excalidraw/Excel/Linear) werden für den Raum-Scope gespeichert und bei Room-Aufruf automatisch wieder geöffnet.

## Auswirkungen
- **UI/UX:** Link-Button mit aktivem Zustand im Editor.
- **Feature-Interaktionen:** Room-Tab bleibt auf verlinktem Inhalt, PS-Notizen öffnen verknüpfte Tabs.
- **Feature-Interaktionen:** Geteilte Rooms zeigen verlinkte Apps dauerhaft an.
- **Datenebene:** Neue Tabelle `room_pins` + API `/api/room-pins`; Pins werden lokal + serverseitig gemerged.

## Tests (Smoke)
- Nicht ausgeführt.

# Dokumentation – Änderungen (2026-02-04)

## Ziel
- Linear-Integration in privaten Räumen: Projekte auswählen, Tasks read-only anzeigen, kollaborativ teilen.

## Änderungen
- Neuer Bereich in den Einstellungen für App-Integrationen (Linear API-Key + Projektauswahl).
- Neuer Linear-Button neben Excalidraw/Excel, inkl. Projektauswahl und Refresh im Embed.
- Lineare Tasks werden pro Raum synchronisiert (State + Daten) via WebSocket.

## Auswirkungen
- **UI/UX:** Linear-Panel mit Projektpicker, Taskliste und Statusanzeige.
- **Feature-Interaktionen:** Tasks werden read-only gezeigt und kollaborativ geteilt.
- **Datenebene:** Linear-State und Taskliste werden im Room-State (in-memory) verteilt.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Eingebettete Tabelle per Button; Ethercalc auf Fly.io als eingebettete Lösung.

## Änderungen
- Excel-Embed nutzt nun Ethercalc-Base-URL und generiert Sheet-URL pro Room/Key.
- Ethercalc-Service-Konfiguration für Fly.io ergänzt (Dockerfile + fly.toml).
- Toggle/Drag/Synchronisierung für Excel bleibt erhalten.

## Auswirkungen
- **UI/UX:** Tabellen lassen sich im Editor ein-/ausblenden und verschieben.
- **Feature-Interaktionen:** Realtime-Collab über Ethercalc; Sichtbarkeit/Position per WebSocket.
- **Datenebene:** Persistenz via Redis möglich (REDIS_URL), sonst In-Memory.

## Tests (Smoke)
- Nicht ausgeführt.

# Dokumentation – Änderungen (2026-01-31)

## Ziel
- Markdown-Aufgaben beim Verlassen der Vorschau automatisch sortieren (offen oben).

## Änderungen
- Neue Einstellung in den Benutzer-Einstellungen: "Markdown-Aufgaben" → "Offene Einträge zuerst" (lokal gespeichert).
- Preview-Checkbox-Toggles markieren Pending-Tasks; beim Schließen der Vorschau werden zusammenhängende Aufgabenblöcke neu geordnet: offene `- [ ]` vor erledigten `- [x]`.
- Sortiertes Ergebnis wird in den Editor übernommen, Autosave/Synchronisation angestoßen, Statusmeldung angezeigt.

## Auswirkungen
- **UI/UX:** Offene Tasks stehen oben, sobald die Vorschau verlassen wird; optisches Feedback durch Statuszeile.
- **Feature-Interaktionen:** Gilt für Markdown-Tasklisten im Editor/Preview; Note-Text wird aktualisiert und gespeichert.
- **Datenebene:** Keine Server-Änderung, Einstellung liegt in `localStorage`.

## Tests (Smoke)
- Nicht ausgeführt (UI-Änderung ohne Build-Schritt).

## Sonstiges
- `gitstamp.txt` auf aktuellen Commit-Hash aktualisiert (Build-Metadaten).

# Dokumentation – Änderungen (2026-01-29)

## Ziel
- Kommentar-Icons nur bei Fokus/Hover anzeigen und Layout anpassen.
- Kommentar-Filter im Notiz-Header hinzufügen.

## Änderungen
- Kommentar-Items: Avatar + Name, Zeit darunter; Reply-Badge in Theme-Farbe.
- Action-Icons ohne Border/Color, sichtbar bei Hover/Fokus/Selektion.
- Notiz-Header: Kommentar-Filter-Icon mit Filterlogik (Notizen mit Kommentaren).
- Kommentar-Index-API für Filter (`/api/notes/comments-index`).

## Auswirkungen
- **UI/UX:** Klarere Kommentar-Optik, Fokus-Icons, Filter im Notes-Header.
- **Feature-Interaktionen:** Filter nutzt serverseitigen Kommentar-Index.
- **Datenebene:** Neue Abfrage für Kommentar-Index.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Kommentar-Badge in Shared Rooms sofort korrekt anzeigen.

## Änderungen
- Kommentar-Scope nutzt Room, sobald eine Room-ID vorhanden ist (Key oder Shared-Markierung).

## Auswirkungen
- **UI/UX:** Kommentar-Badge zeigt nach App-Start korrekte Zahl ohne Icon-Klick.
- **Feature-Interaktionen:** Kommentar-Sync bleibt room-basiert für Shared Rooms.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`

## Ziel
- Kommentar-Anzeige (Toggle/Badge) beim App-Start aktualisieren.

## Änderungen
- Nach `refreshPersonalSpace()` werden Kommentare geladen.

## Auswirkungen
- **UI/UX:** Kommentar-Badge zeigt nach App-Start den korrekten Stand.
- **Feature-Interaktionen:** Kommentar-Sync folgt bestehendem Scope.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`

## Ziel
- Kommentare in Shared Rooms konsistent und realtime zwischen Geräten.

## Änderungen
- Kommentar-Scope nutzt in Shared Rooms einen Raum-Key (`room:<room>:<key>`), sonst Notiz-Scope (`note:<id>`).
- Neue Room-Kommentar-API (`/api/rooms/:room/:key/comments`) und Scope-Migration in `notes_comments`.
- WebSocket-Comment-Updates nutzen `scopeId`.

## Auswirkungen
- **UI/UX:** Gleiche Kommentare in Shared Rooms auf allen Geräten, realtime Updates.
- **Feature-Interaktionen:** Kommentar-Sync abhängig vom Room-Scope.
- **Datenebene:** Schemawechsel `notes_comments` (scope_id statt note_id).

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Kommentare pro Notiz teamweit speichern und realtime synchronisieren.

## Änderungen
- `notes_comments` auf notizweite Speicherung umgestellt (Migration von per-User).
- Kommentar-Updates per WebSocket im aktiven Room gebroadcastet.

## Auswirkungen
- **UI/UX:** Kommentare sind für alle Nutzer der gleichen Notiz sichtbar und aktualisieren sich live.
- **Feature-Interaktionen:** Kommentar-Push nutzt die bestehende Room-WebSocket-Verbindung.
- **Datenebene:** Schema-Änderung an `notes_comments` (kein `user_id`).

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Kommentare nach Reload zuverlässig anzeigen.
- Kommentarhintergrund heller gestalten.

## Änderungen
- Kommentar-Panel lädt Kommentare beim Öffnen und synchronisiert bei Bedarf die aktive Notiz aus dem Editor-Text.
- Kommentar-Item-Hintergrund in Standard- und Mono-Themes aufgehellt.

## Auswirkungen
- **UI/UX:** Kommentare sind nach Reload sichtbar; Kommentar-Items heben sich besser vom Panel ab.
- **Feature-Interaktionen:** Kommentar-Panel lädt stabil nach Panel-Öffnung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`

## Ziel
- Tags lassen sich zuverlässig löschen.
- Tag "shell" nicht mehr automatisch vorschlagen.

## Änderungen
- Auto-Tagging entfernt "shell" aus der Klassifizierung.
- Tag-Vorschläge filtern "shell" im Editor aus.

## Auswirkungen
- **UI/UX:** Tag-Vorschläge zeigen "shell" nicht mehr an.
- **Feature-Interaktionen:** Tag-Löschen bleibt konsistent, Auto-Tags greifen ohne "shell".
- **Datenebene:** Keine Änderung am API-Vertrag.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- psList-Höhe nach Filter-Reset zuverlässig auf verfügbare Sidebar-Höhe setzen.

## Änderungen
- Zusätzlicher Height-Sync nach Rendern der Filter/Tags und nach Tag-Panel-Toggle.

## Auswirkungen
- **UI/UX:** Sidebar nutzt nach Tag-Reset sofort die volle Höhe.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`

## Ziel
- Notizvorschau in der Liste stabil begrenzen und besser lesbar machen.

## Änderungen
- Vorschau nutzt Zeilenumbrüche (inkl. Listen) und wird auf 3 Zeilen gekappt.
- Lange Wörter/Zeilen umbrechen in der Vorschau, damit nichts überläuft.

## Auswirkungen
- **UI/UX:** Notizkarten zeigen maximal drei Vorschauzeilen ohne Überlauf.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`

## Ziel
- CRDT-Markierungen als Unterstreichung pro User darstellen.
- Remote-Cursor der anderen Nutzer sichtbar machen.

## Änderungen
- Attribution-Overlay unterstützt Unterstreichungsmodus ohne Text-Overlay.
- Cursor-Layer rendert Carets und Labels für Presence-Selection.
- Cursor-Positionierung kompensiert Editor-Padding für exakte Ausrichtung.

## Auswirkungen
- **UI/UX:** Text bleibt lesbar, Unterstreichungen zeigen Autorschaft; Remote-Cursor sichtbar.
- **Feature-Interaktionen:** Presence/Selection weiterhin Basis; keine API-Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Import großer Dateien nicht mehr stückeln; jeder Import erzeugt genau eine Notiz.

## Änderungen
- Text-Import erstellt genau eine Notiz und verzichtet auf Split/Chunking.

## Auswirkungen
- **UI/UX:** Importierte Dateien landen als einzelne Notiz.
- **Feature-Interaktionen:** Importlogik unverändert, nur das Split-Verhalten entfällt.
- **Datenebene:** Keine Änderung am API-Vertrag.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`

# Dokumentation – Änderungen (2026-01-28)

## Ziel
- AI-Promptfeld nach Anfrage leeren, sobald Antwort und Chat sichtbar sind.

## Änderungen
- Nach erfolgreicher AI-Antwort mit Inhalt wird `aiPrompt` zurückgesetzt, wenn eine Eingabe gesendet wurde.

## Auswirkungen
- **UI/UX:** Promptfeld leert sich nach Antwort; Chatverlauf bleibt sichtbar.
- **Feature-Interaktionen:** Keine Änderung an API/Sync; nur UI-State.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt: `node --check app.js` (node nicht gefunden)

## Ziel
- Notizinhalt beim ersten Klick korrekt laden.

## Änderungen
- In der Notizliste wird beim Öffnen die aktuelle Note aus dem State bevorzugt.

## Auswirkungen
- **UI/UX:** Inhalt lädt sofort beim ersten Klick.
- **Feature-Interaktionen:** Keine Änderung an API/Sync; nur Auswahl-Logik.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Checkbox-Änderungen lösen zuverlässig Autosave aus.

## Änderungen
- Nach Preview-Checkbox-Toggle wird ein Input-Event am Editor dispatcht.

## Auswirkungen
- **UI/UX:** Task-Änderungen werden zuverlässig gespeichert.
- **Feature-Interaktionen:** Autosave-Pipeline wird genutzt.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Preview-Checkbox-Änderungen auch bei Maus-Exit sichern.

## Änderungen
- Beim Verlassen der Preview wird Autosave getriggert.

## Auswirkungen
- **UI/UX:** Checkbox-Änderungen bleiben erhalten auch bei schnellem Wechsel.
- **Feature-Interaktionen:** Kein API-Change, nur zusätzlicher Save-Trigger.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Preview-Checkbox-Änderungen zuverlässig speichern.

## Änderungen
- Zusätzlicher Click-Fallback im Preview-Writeback (ohne Default-Block).

## Auswirkungen
- **UI/UX:** Checkboxen toggeln und speichern stabil.
- **Feature-Interaktionen:** Writeback robuster, kein doppeltes Blocking.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Preview-Checkboxen wieder zuverlässig umschalten.

## Änderungen
- Click-Interception im Preview-Writeback entfernt; nur `change`-Event.

## Auswirkungen
- **UI/UX:** Checkboxen lassen sich in der Preview wieder toggeln.
- **Feature-Interaktionen:** Writeback bleibt stabil, ohne Doppel-Events.
- **Datenebene:** Keine Änderung am API-Vertrag.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Task-Checkbox-Änderungen in der Preview zuverlässig speichern.

## Änderungen
- Preview-Checkbox-Writeback nutzt robustere Checkbox-Erkennung (LI/Class/UL).
- Doppeltes Toggle-Handling über Klick/Message entprellt.
- Fallback auf `change`-Event im Preview-Dokument ergänzt.

## Auswirkungen
- **UI/UX:** Task-Checkboxen bleiben konsistent beim Umschalten.
- **Feature-Interaktionen:** Preview-Tasks schreiben sicher in den Editor zurück.
- **Datenebene:** Keine Änderung am API-Vertrag.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Kommentare an Notiz-ID binden und serverseitig speichern.

## Änderungen
- Kommentar-Speicherung auf `/api/notes/:id/comments` umgestellt.
- Kommentare werden beim Notizwechsel geladen und pro Note gespeichert.
- Validierung/Sanitizing der Kommentar-Payload im Server ergänzt.
- Kommentar-Aktion legt bei Bedarf automatisch eine Notiz an, damit Markierungen kommentiert werden können.
- Kommentar-Liste mit 8px Abstand zwischen Einträgen.
- Tooltips für Bearbeiten/Antworten in der Kommentar-Liste (sprachabhängig).

## Auswirkungen
- **UI/UX:** Kommentare sind jetzt eindeutig der aktiven Notiz zugeordnet.
- **Feature-Interaktionen:** Kommentar-Panel lädt/speichert pro Notiz.
- **Datenebene:** Neue Tabelle `notes_comments` mit Server-Persistenz.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Autosave für Preview-Task-Toggles zuverlässig sichern, auch beim Notizwechsel.

## Änderungen
- Autosave nutzt Snapshot (Note-ID/Text/Tags), damit Task-Checkbox-Änderungen nicht verloren gehen.

## Auswirkungen
- **UI/UX:** Autosave bleibt konsistent beim Notizwechsel.
- **Feature-Interaktionen:** Personal Space Autosave stabiler bei Preview-Interaktionen.
- **Datenebene:** Keine Änderung am API-Vertrag; nur zuverlässigeres Speichern.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Diktat-Debug-Ausgabe im Browser konsistent sichtbar machen.

## Änderungen
- Debug-Snapshot bei `audio-capture` in die Konsole geschrieben.
- Cache-Busting für app.js aktualisiert.

## Auswirkungen
- **UI/UX:** Keine Änderung.
- **Feature-Interaktionen:** Bessere Diagnosemöglichkeit.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Audio-Capture-Fehler genauer differenzieren (Mikrofon vs. SpeechRecognition).

## Änderungen
- Zusätzliche Diagnose bei `audio-capture` (Permission, Gerät, getUserMedia).
- Hinweistext, wenn Mikrofon funktioniert, aber Spracherkennung fehlschlägt.
- Cache-Busting für app.js aktualisiert.

## Auswirkungen
- **UI/UX:** Präzisere Fehlermeldungen für Diktat.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Diktat auf Desktop nicht blockieren, wenn Mikrofon als „busy“ gemeldet wird.

## Änderungen
- Busy-Mikrofon führt nicht mehr zum Abbruch des Diktat-Starts.
- Cache-Busting für app.js aktualisiert.

## Auswirkungen
- **UI/UX:** Diktat startet auf Desktop trotz Busy-Fehlermeldung.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

# Dokumentation – Änderungen (2026-01-27)

## Ziel
- Diktat-Start robuster machen, wenn Mikrofon blockiert oder belegt ist.

## Änderungen
- Mikrofon-Zugriff vor dem Start geprüft (Permission/Device/Busy).
- Diktat-Fehlermeldungen gedrosselt und präzisiert.

## Auswirkungen
- **UI/UX:** Klarere Hinweise bei Mikrofon-Problemen.
- **Feature-Interaktionen:** Diktat startet nur bei verfügbarer Audio-Quelle.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Ziel
- Cache-Busting für app.js aktualisieren, damit Diktat-Fix geladen wird.

## Änderungen
- Versions-Query für app.js im HTML angepasst.

## Auswirkungen
- **UI/UX:** Neueste Diktat-Änderungen werden geladen.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt (HTML-Änderung).

## Ziel
- Nicht-monochrome Scrollbar-Farbe auf dezentes Cyan setzen.
- Horizontale Scrollbar in `#psList` entfernen.

## Änderungen
- Standard-`--scrollbar-thumb` auf `rgba(103, 232, 249, 0.1)` gesetzt.
- `#psList` erhält `overflow-x: hidden` auch im Mobile-Layout.
- MonoLight/MonoDark behalten eigene Scrollbar-Werte.

## Auswirkungen
- **UI/UX:** Scrollbars sind deutlich subtiler in farbigen Themes.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt (UI-Änderung).

## Ziel
- Scrollbars in nicht-monochromen Themes deutlich zurücknehmen.

## Änderungen
- Standard-Scrollbar-Variablen weiter reduziert.

## Auswirkungen
- **UI/UX:** Scrollbars sind weniger präsent in farbigen Themes.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt (UI-Änderung).

## Ziel
- Scrollbar-Hintergrund in nicht-monochromen Themes subtiler machen.

## Änderungen
- Scrollbar-Variablen im Standard-Theme reduziert.
- MonoLight/MonoDark behalten die bisherigen Scrollbar-Werte.

## Auswirkungen
- **UI/UX:** Scrollbars wirken in farbigen Themes ruhiger.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt (UI-Änderung).

## Ziel
- TOC-Float-Hintergrund an Markdown-Preview angleichen.
- Kommentar-Panel-Hintergrund an Editor-Theme angleichen.

## Änderungen
- TOC-Hintergrund nutzt die Preview-Hintergrundfarbe.
- MonoLight-Override für Kommentar-Panel an Editor-Hintergrund angepasst.

## Auswirkungen
- **UI/UX:** TOC und Kommentar-Panel folgen dem aktiven Theme.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt: `node` nicht verfügbar (`node --check app.js`).
- Nicht ausgeführt: `node` nicht verfügbar (`node --check server.js`).

## Ziel
- Kommentar-Chat-Hintergrund an aktives Theme anpassen.

## Änderungen
- Theme-Variable für Kommentar-Items ergänzt und in der Kommentar-Liste angewendet.
- MonoLight/MonoDark setzen spezifische Kommentar-Hintergründe.

## Auswirkungen
- **UI/UX:** Kommentar-Items passen zum aktiven Theme.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt: `node` nicht verfügbar (`node --check app.js`).
- Nicht ausgeführt: `node` nicht verfügbar (`node --check server.js`).

## Ziel
- Trash-Icon im Kommentar-Panel im Light-Theme sichtbar machen.

## Änderungen
- MonoLight-Override für den Delete-Button im Kommentar-Panel ergänzt.

## Auswirkungen
- **UI/UX:** Löschen-Icon im Light-Theme klar sichtbar.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt: `node` nicht verfügbar (`node --check app.js`).
- Nicht ausgeführt: `node` nicht verfügbar (`node --check server.js`).

## Ziel
- Kalendertermine themenabhängig gestalten (Hintergrund + Tooltip) und Borders bei Terminen entfernen.

## Änderungen
- Theme-abhängige CSS-Variablen für Kalendertermine/Tooltip ergänzt.
- Border-Klassen von Kalender-Terminen in Tag/Woche/Monat entfernt.
- Lokale Kalender-Event-Erstellung korrigiert (korrekte Rückgabe).

## Auswirkungen
- **UI/UX:** Termine und Tooltip passen zum aktiven Theme, keine Termins-Border.
- **Feature-Interaktionen:** Kalender-Anzeige unverändert, nur Styling.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

# Dokumentation – Änderungen (2026-01-25)

## Ziel
- Horizontale Scrollbar in der Markdown-Preview entfernen.

## Änderungen
- Preview-HTML setzt `overflow-x: hidden` im Body (inkl. Fallback).

## Auswirkungen
- **UI/UX:** Keine horizontale Scrollbar in `#mdPreview`.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt (UI-Änderung).

## Ziel
- Scrollbar-Farbe in Non-Mono-Themes aus dem Theme ableiten bei 0.1 Opacity.

## Änderungen
- `app.js` nutzt `accentTextSoft`/`accentText` mit 0.1 Alpha für Scrollbars in Non-Mono.
- Preview und Fallback übernehmen die themebasierte Scrollbar-Farbe.

## Auswirkungen
- **UI/UX:** Scrollbar-Farbe passt zum Theme und bleibt dezent.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt (UI-Änderung).

## Ziel
- Runtime-Overrides setzen Scrollbar-Opacity auf 0.1 für nicht-monochrome Themes.

## Änderungen
- Theme-Apply und Preview-Fallback erzwingen `--scrollbar-thumb`/`--scrollbar-thumb-hover` mit 0.1 in Non-Mono.
- Preview-Scrollbar-Border für Non-Mono auf 0.1 reduziert.

## Auswirkungen
- **UI/UX:** Scrollbars bleiben auch zur Laufzeit subtil.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt (UI-Änderung).

## Ziel
- Scrollbar-Opacity in nicht-monochromen Themes auf 0.1 reduzieren.

## Änderungen
- Standard-Scrollbar-Variablen auf 0.1 gesetzt (Thumb/Hover/Border).

## Auswirkungen
- **UI/UX:** Scrollbars wirken noch dezenter in farbigen Themes.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Nicht ausgeführt (UI-Änderung).

## Ziel
- Audio-Capture-Fehler verständlich melden und Toast-Spam vermeiden.

## Änderungen
- Fehler-Toast für `audio-capture` mit Hinweistext ergänzt.
- Fehler-Toast gedrosselt, um Mehrfachmeldungen zu vermeiden.

## Auswirkungen
- **UI/UX:** Klarer Hinweis bei Mikrofon-Problemen, weniger Spam.
- **Feature-Interaktionen:** Keine Änderung außerhalb Diktat.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Auszuführen: `node --check app.js`
- Auszuführen: `node --check server.js`

## Ziel
- Diktat-Fehler-Toast vermeiden durch Start im User-Gesture-Pfad.

## Änderungen
- Diktat-Start wird nicht mehr von `getUserMedia()` abhängig gemacht.
- Fehler-Handler loggt Fehlercode und ignoriert Restart-Zustand.

## Auswirkungen
- **UI/UX:** Diktat startet stabiler, weniger Fehl-Toast direkt nach Klick.
- **Feature-Interaktionen:** Keine Änderung außerhalb Diktat.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Auszuführen: `node --check app.js`
- Auszuführen: `node --check server.js`

## Ziel
- Diktat-Toast und Status-Icon sichtbar machen sowie Diktat-Start stabilisieren.

## Änderungen
- Toast-Container in [index.html](index.html) ergänzt.
- Diktat-Button-Status nutzt vorhandene Theme-Styles in [app.js](app.js).
- Restart-Guard für SpeechRecognition-`onend` ergänzt, damit Start nicht sofort zurückgesetzt wird.

## Auswirkungen
- **UI/UX:** Toasts erscheinen wieder, Diktat-Button zeigt aktiven Zustand.
- **Feature-Interaktionen:** Diktat-Start bleibt stabil; kein Einfluss auf andere Flows.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Auszuführen: `node --check app.js`
- Auszuführen: `node --check server.js`

## Ziel
- Gleichmäßigen 16px-Gap zum Fenster herstellen.

## Änderungen
- Gleichmäßigen Gap über `body`-Padding auf 16px gesetzt.

## Auswirkungen
- **UI/UX:** Gleichmäßiger Rand oben/unten/links/rechts.
- **Feature-Interaktionen:** Keine Änderung.
- **Datenebene:** Keine Änderung.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

# Dokumentation – Änderungen (2026-01-24)

## Ziel
- App-Sprache in den Einstellungen auswählbar machen (DE/EN) und Labels umstellen.

## Änderungen
- Sprachwahl in den Einstellungen ergänzt und lokal gespeichert.
- UI-Labels in Personal Space, Header/Editor-Footer, Kommentarfenster und Preview über i18n-Keys/Übersetzungen umgestellt.
- Datums-/Zeitformatierung an die UI-Sprache gekoppelt.

## Auswirkungen
- **UI/UX:** Sprache wechselt sofort; Settings/Personal-Space-Beschriftungen aktualisiert.
- **Feature-Interaktionen:** Keine Änderung an bestehenden Flows.
- **Datenebene:** Sprache lokal gespeichert.

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

# Dokumentation – Änderungen (2026-01-23)

## Ziel
- Kommentare für markierte Textpassagen ermöglichen.

## Änderungen
- Auswahlmenü um Aktion **Comment** ergänzt.
- Kommentar-Panel im Editor ergänzt (Avatar + Zeit im Header, Eingabe darunter).
- Kommentar-Panel per Icon links im Eingabefenster ein-/ausblendbar.
- Kommentare werden raumbezogen lokal gespeichert.
- Kommentar-Markierungen als Overlay im Editor sichtbar, wenn Kommentare eingeblendet sind.

## Auswirkungen
- **UI/UX:** Zusätzliche Kommentar-UI + Markierungen im Editor.
- **Feature-Interaktionen:** Keine Änderung an bestehenden Flows.
- **Datenebene:** Kommentare lokal im Client je Room/Key gespeichert.

## Tests (Smoke)
- Nicht ausgeführt: `node` nicht verfügbar (`node --check app.js`).

# Dokumentation – Änderungen (2026-01-21)

## Kontext & Referenzen
- Referenzierte Projektdoku: [FEATURES.md](FEATURES.md)

## Ziel
- CSS aus der HTML-Datei auslagern.
- `app.js` in Unterfunktionen gliedern (ohne Funktionsänderung).

## Änderungen
- Inline-CSS aus [index.html](index.html) entfernt und in [styles/app.css](styles/app.css) ausgelagert.
- `app.js` mit neuen Unterfunktionen strukturiert: `initUiEventListeners()` und `initStartupTasks()`.

## Begründung
- Bessere Trennung von Struktur (HTML) und Styles.
- Klarere Struktur der Initialisierung in `app.js`.

## Auswirkungen
- **UI/UX:** Keine Änderung am Layout oder Verhalten erwartet.
- **Feature-Interaktionen:** Keine Änderung an bestehenden Flows.
- **Datenebene:** Keine Änderung.

## Beispiel (Stil beibehalten)
```javascript
function initUiEventListeners() {
	if (psSaveMain) {
		psSaveMain.addEventListener("click", async () => {
			// ...
		});
	}
}
```

## Tests (Smoke)
- Ausgeführt: `node --check app.js`
- Ausgeführt: `node --check server.js`

## Hotfix (2026-01-21)
- [index.html](index.html) Head/Body repariert und Stylesheet-Link korrekt platziert.
- [styles/app.css](styles/app.css) bereinigt (nur gültiges CSS), fehlende Variable `--blockquote-text` ergänzt.

## Workflow-Analyse (2026-01-22)

### Ablauf: Automatisches Speichern
- Textänderung im Editor triggert `textarea`-`input` und ruft `schedulePsAutoSave()` auf. Quelle: [app.js](app.js#L12240-L12270) und [app.js](app.js#L13107-L13156).
- Auto-Save ruft `savePersonalSpaceNote()` (PUT/POST) und aktualisiert `psState.notes`. Quelle: [app.js](app.js#L13005-L13102).
- Todo-Haken im Preview nutzt `toggleMarkdownTaskAtIndex()` und anschließend `schedulePsAutoSave()` + `scheduleSend()`. Quelle: [app.js](app.js#L6443-L6475).

### Ablauf: Tabwechsel
- `hashchange` wechselt Raum/Key, schreibt den aktuellen Tab zurück und lädt den neuen. Quelle: [app.js](app.js#L12598-L12747).
- Für Note-Tabs wird die Notiz über `findNoteById()` geladen und `applyNoteToEditor()` aufgerufen. Quelle: [app.js](app.js#L12698-L12733).
- Falls die Notiz per `noteId` noch nicht lokal vorhanden ist, wird `refreshPersonalSpace()` aufgerufen und danach die Notiz geladen (mit Guard auf Room/Key). Quelle: [app.js](app.js#L12702-L12735).

### Auswahl aus der Notizliste
- Wird eine Notiz angeklickt und ist bereits in einem Tab offen, wird dieser Tab aktiviert (`goToRoomWithKey`). Quelle: [app.js](app.js#L7551-L7566).
- Gibt es keinen passenden Tab, wird die Notiz im aktuellen Tab geöffnet. Quelle: [app.js](app.js#L7567-L7571).

### Cache-/Sync-Logik für Note-Tabs
- Tab-Cache speichert bei Note-Tabs nur die `noteId` (kein Text). Quelle: [app.js](app.js#L8630-L8721) und [app.js](app.js#L8808-L8832).
- `updateLocalNoteText()` hält `psState.notes` bei jeder Eingabe/Todo-Aktion sofort aktuell, damit Tabwechsel die letzte Änderung lädt, auch bevor der Server-Save abgeschlossen ist. Quelle: [app.js](app.js#L8834-L8861), [app.js](app.js#L12245-L12270), [app.js](app.js#L6468-L6475).
- Beim Auswählen einer Notiz wird die `noteId` sofort dem aktiven Tab zugeordnet, ohne auf Inhaltsänderung zu warten. Quelle: [app.js](app.js#L7118-L7130).

### Änderung (Fix)
- Lokales Update von `psState.notes` bei jeder Eingabe/Todo-Aktion (`updateLocalNoteText()`).
- Tabwechsel lädt Note-Inhalt ausschließlich über `noteId` (kein Text aus dem Tab-Cache).

### Tests (Smoke)
- Ausgeführt: `node --check app.js`
