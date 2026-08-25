# 2026-08-25 — Vergleichs-Panel (zwei Notizen nebeneinander)

## Ausgangsfrage

„Open new tab, um mehrere Tabs zu öffnen und Notizen zu vergleichen."

## Befund der Analyse

**Tabs gibt es längst — als Raum-Tabs.** Ein Tab = ein Raum (`room`+`key`),
`MAX_ROOM_TABS = 5`, persistiert in `mirror_room_tabs_v1` + Server-Tabelle
`room_tabs`. Umschalten läuft ausschließlich über `location.hash` →
`hashchange`-Handler und baut WS + CRDT komplett neu auf. Zwei Tabs gleichzeitig
sichtbar sind damit ausgeschlossen. Gefehlt hat nicht das Öffnen, sondern das
Nebeneinander.

**Ein zweiter *editierbarer* Editor wäre ein Neubau:** ein `<textarea id="mirror">`,
ein Yjs-Doc, eine WS-Verbindung — und `psEditingNoteId`, Auto-Save-Kette,
Undo/Redo (200 Schritte), Vor/Zurück-Historie und Kommentare sind alle Singletons.
Der gefährlichste Punkt: `psAutoSaveLastSavedNoteId` kennt genau **eine** Notiz;
verwechselt sie sich, wird Text in die falsche Notiz geschrieben.

Gebaut wurde deshalb die read-only Variante.

## Was gebaut wurde

`#comparePanel` als Geschwister von `#previewPanel` in `#editorPreviewGrid`.
Vorschau und Vergleich teilen sich die zweite Spalte (drei Spalten sind zwischen
1024 und ~1280 px unbenutzbar). Öffnen über den Button „Vergleichen" neben
„Vorschau" oder per **Alt+Klick** auf eine Notiz in der Liste.

- `setComparePanelVisible`, `setCompareNoteId`, `renderComparePanel`,
  `populateCompareSelect`, `syncComparePanelFromState`, `setCompareMetaVisible`
- Auswahl merkt sich die Notiz in `mirror_compare_note_v1`
- Mobil: eigener Vollbildmodus über die Body-Klasse `mobile-compare-open`

## Merksätze (teuer erarbeitet)

- **Kein zweites Vorschau-iframe.** `previewMsgToken` ist ein *einziger* globaler
  String, gegen den der zentrale `message`-Handler alle Nachrichten validiert.
  Ein zweiter Frame wäre entweder tot oder würde den des Hauptpanels kapern —
  ein Checkbox-Klick im Vergleich schriebe dann in die **bearbeitete** Notiz.
  Deshalb reines DOM-Rendering über `buildPreviewContentHtml`.
- **`psEditingNoteId` nicht anfassen.** Auf Mobil hängt der komplette
  Ansichtszustand allein daran, und die Auto-Save-Kette leitet daraus ab, welche
  Notiz gerade bearbeitet wird. Alt+Klick läuft deshalb ganz vorn im Handler,
  vor `flushPendingPsAutoSave()`.
- **Tailwind-Preflight resettet Überschriften und Listen.** Die Vorschau merkt
  das nicht — sie lebt im iframe ohne Preflight und nutzt Browser-Defaults. Im
  Haupt-DOM las sich die Notiz ohne eigene Typografie-Regeln als Fließtext.
  Regeln liegen unter `.compare-body` in `styles/app.css`.
- **Task-Checkboxen sind echte Checkboxen** (`enabled: true` beim Task-List-Plugin).
  Im iframe fängt `attachPreviewCheckboxWriteback()` die Klicks ab; im Panel gibt
  es nichts dergleichen — ohne `disabled` setzt sich ein Haken sichtbar und wird
  nie gespeichert. Im Review gefunden, nicht beim Bauen.
- **PDF-Embeds nur im iframe.** `embedPdfLinks` ersetzt den Link durch ein Widget,
  dessen pdf.js und CSS nur im Vorschau-iframe existieren → `skipPdfEmbed` für das
  Panel. Video-Embeds sind native `<video>`-Elemente und funktionieren überall.
- **`note:`-Wiki-Links** werden abgefangen und springen im Panel weiter, statt per
  `postMessage` zu laufen. `target="_blank"` setzt die `link_open`-Rule ohnehin
  für jeden Link — eine eigene Link-Härtung wäre doppelt gemoppelt.
- **500-Notizen-Grenze:** `stmtNotesByUser` liefert `LIMIT 500`, und es gibt
  keine Route für eine einzelne Notiz. Bis dahin trägt „kein Backend nötig".

## Mitgenommener Altbug

`setPreviewVisible()` überschrieb `editorPreviewGrid.className` komplett und warf
dabei `comment-panel-open` (Kommentarpanel) und `hidden` (Kalender) weg. Ersetzt
durch `syncEditorPreviewGridColumns()` mit `classList.toggle`.

## Test

Lokal gegen einen Fake-API-Server im Scratchpad (der echte Serverstart scheitert
weiter an der `better-sqlite3`-ABI; `npm rebuild` läuft unter Node 26 nicht
durch). Geprüft: Spaltenwechsel, gegenseitiger Ausschluss mit der Vorschau,
Rendering inkl. Code-Highlighting, Farb-Chips, Passwortfeldern, Tabellen und
Wiki-Links, Alt+Klick, Persistenz, Light-Theme, Mobil-Vollbild, und dass der
Editor dabei unberührt bleibt.

## Offen

- Zeilenweiser Diff (farbige Unterschiede) — bewusst nicht in v1. Es gibt keine
  Diff-Bibliothek im Projekt; das wären ~80–120 Zeilen ohne neue Abhängigkeit.
- Keine E2E-Tests: `tests/` enthält weiterhin nur den Playwright-Scaffold.
