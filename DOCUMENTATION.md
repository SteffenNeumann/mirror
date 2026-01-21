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
