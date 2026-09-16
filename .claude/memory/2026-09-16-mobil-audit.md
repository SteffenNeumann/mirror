# Mobil-Audit iPhone 375×812 + Fix-Paket (2026-09-16)

PR #47, `app.js`/`app.css` `?v=2026-09-16-01`, SW `mirror-v54`.
Ablauf: 2 Analyse-Agenten → 1 Verifikations-Agent → Fixes → 1 Code-Review + 1 Browser-Test.

## Der Fund, der zählt: stiller CRDT-Datenverlust

`#noteCloseMobile` erscheint auch im **Raum-Editor**, weil
`.mobile-only { display: inline-flex !important }` (app.css) die Regel
`body:not(.mobile-note-open) #noteCloseMobile { display: none }` schlägt — die hat
kein `!important`. Sein Handler leerte `textarea.value` bedingungslos; der nächste
Tastendruck diffte gegen den geleerten Stand und verteilte die Löschung über CRDT.

**Reproduziert, vorher und nachher, mit zwei Tabs gegen Prod:** 76 Zeichen, X tippen,
ein Zeichen tippen → Beobachter sah vorher nur dieses eine Zeichen.

**⚠️ Falle beim Nachbessern:** Das X ist der **einzige** mobile Einstieg in die
Notizliste — `mobilePsOpen = true` steht im ganzen `app.js` nur in diesem Handler.
`#togglePersonalSpace` hat zwar einen vollständigen Mobil-Zweig, ist aber mobil
`display: none !important`. Wer das X „sauber" ausblendet, sperrt Handy-Nutzer aus.
Deshalb: Leeren an `psEditingNoteId` gebunden, X bleibt, Label → „Notizliste".

## Stehende Lehre: Spezifität schlägt Media Query

Drei unabhängige Bugs, **dieselbe Ursache** — eine Mobil-Regel sollte eine Basisregel
überschreiben, verlor aber die Spezifitätsrechnung. Media Queries erhöhen die
Spezifität **nicht**.

| Ort | Basis | Mobil-Versuch | Folge |
|---|---|---|---|
| `.toolbox-btn` | `#toolboxPanel .toolbox-btn` (1‑1‑0) | `.toolbox-btn` (0‑1‑0) | Verkleinerung wirkungslos, Leiste 408 px → 2 Knöpfe außerhalb |
| `#psMetaToggle`/`#clearMirror` | `!important` in der 390‑px‑Query | neue 40‑px‑Regel ohne `!important` | blieben als einzige bei 32 px |
| Kalender-Wochentage | – | `@media (min-width:640px) and (max-width:1023px)` | Fix existierte, griff auf **keinem** Telefon |

**Vor jedem „Mobil-Override" prüfen:** `grep -n '<selektor>' styles/app.css` über die
**ganze** Datei, dann Spezifität und Quellreihenfolge rechnen.

## Eigene Regression im Fix (vom Review gefunden)

`input, textarea, select { font-size: 16px !important }` gegen den iOS-Zoom traf
`#mirror`, **nicht** aber die vier Overlay-Divs, die sich laut Kommentar in app.css
(„Textarea + every overlay must share IDENTICAL metrics") dieselben Metriken teilen.
Mono-Schrift = 15 px, und `mdHighlightOn` **erzwingt** Mono (app.js) → 16 px/25,6 px
gegen 15 px/24 px. Gemessen. **Merke:** `#mirror` nie einzeln in Schriftmetriken
anfassen — immer `--editor-size` / `--editor-lh` anheben, dann ziehen alle fünf mit.

## Weitere bestätigte Funde

- **Kalender:** `grid-cols-7`-Kopfzeile über `grid-cols-2`-Gitter, 42 Zellen à 150 px
  = 6,6 Bildschirme. Jetzt 64 px → 2,7.
- **Nur-Maus-Funktionen:** `.ps-note-actions` an `:hover`/`.ps-note-active` (schließen
  sich mobil aus); Blöcke sortieren nur per HTML5-Drag&Drop oder Alt+Pfeil;
  Befehlspalette nur per Tastenkombi; Tag-/Notiz-Kontextmenü nur per Rechtsklick.
  `app.js` hatte **0** `touchstart`-Handler. Der einzige `@media (hover: none)`-Block
  behandelte nur `#toggleHeader`.
- **Editor:** `white-space: pre !important` + `wrap="off"` → 107 Zeichen brauchten
  800 px in einem 341-px-Feld.
- **iOS-Zoom:** 62 Felder unter 16 px. Beim Kalender-Suchfeld stand der Kommentar
  „prevent iOS zoom" über `14px` und wurde 3 Zeilen später auf `11px` überschrieben.

## Widerlegt (Fehlalarme der Analyse-Agenten)

- „Toolbox-Knöpfe sind mobil 28 px" — sind 32 px, die 28er-Regel verliert.
- „Alle vier Schließen-X dauernd sichtbar" — nur `#noteCloseMobile`, die anderen
  liegen in ausgeblendeten Panels.
- „Kalender unten abgeschnitten" — `max-height: 100dvh` am Kind fängt es ab.
- „PWA läuft unter den Notch" — ohne `viewport-fit=cover` legt iOS innerhalb der
  Safe Area an. Sicher ist nur: die eine `env()`-Nutzung ist dadurch ein No-op.

## Testumgebung

Lokaler Serverstart scheitert weiter an `better-sqlite3`. Frontend statisch servieren
reicht **nicht** — ohne API-Antworten kollabiert das Layout. Lösung: kleiner
Python-Server mit Stubs für `/api/identity`, `/api/personal-space/me`,
`/api/saved-queries`, `/api/rooms/*/comments`. Damit rendert die App normal.
**Der Konsolenfehler `Cannot access 'psState' before initialization` tritt dabei auch
im unveränderten Stand auf** — Umgebungsartefakt, keine Regression.

**Gegen den Altstand vergleichen:** `git archive HEAD | tar -x -C <tmp>` und auf einem
zweiten Port servieren. Ohne diesen Vergleich hätte ich den psState-Fehler mir selbst
angelastet.

## Nebenbei geschlossen

`styles/app.css` hat jetzt einen `?v=` (index.html Preload + Stylesheet, `sw.js`
PRECACHE_URLS). Vorher `max-age=300` statt `immutable` — beim Testen kam dadurch
**reproduzierbar** altes CSS zurück, obwohl die Datei längst neu war.
