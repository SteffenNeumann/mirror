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
