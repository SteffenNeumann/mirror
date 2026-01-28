# Dokumentation – Änderungen (2026-01-28)

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
