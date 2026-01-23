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
