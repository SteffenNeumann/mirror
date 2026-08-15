# Farb-Chips in der Markdown-Vorschau (2026-08-15)

PR #26, `85da9ba`, SW v44, `app.js?v` `2026-08-15-01`.

## Was

`/FF6115/` (3/6/8 Hexstellen) und `#FF6115` (6/8 Stellen) rendern in der Vorschau
als Farbkreis + Hex-Label. Settings → „Editor", Default **an**, localStorage-Key
`mirror_color_chips` (nur explizites `"0"` schaltet ab). Auslöser war die Notiz
„Colormatches" mit Paletten der Form `Neon Orange /FF6115/ + Porcelain /FFFCF4/`.

## Die drei Fallen (alle empirisch belegt)

### 1. Ein Inline-Tokenizer auf `/` feuert NIE

Die für `||passwort||` gepatchte `text`-Rule `textWithPipe` in `ensureMarkdown()`
terminiert nur auf `|` plus die Standard-Sonderzeichen. `/` (0x2F) fehlt → der
Text-Scanner verschluckt `/FF6115/` komplett als Plain-Text, bevor eine per
`md.inline.ruler.before("emphasis", …)` registrierte Rule an die Position kommt.
Gemessen: 0 Treffer, auch am Zeilenanfang.

**Lösung:** `md.core.ruler.push(…)` über die fertigen inline-Token. Schützt
Code-Spans und Fences gratis, weil das keine `text`-Token sind.

**Regel für die Zukunft:** Bei JEDEM neuen Inline-Delimiter zuerst prüfen, ob das
Zeichen in `isTerminatorOrPipe` steht. Die Terminator-Liste zu erweitern ist der
gefährlichere Weg — sie ist der Hotspot für das Password-Feature.

### 2. Core-Rules brauchen Link-Tiefen-Tracking

Ohne Zählen von `link_open`/`link_close` zerschneidet die Regex Linktexte und
linkify-erkannte URLs (`https://ex.de/facade/` wird mitten in der URL getroffen).
Nur `token.type === "text"` zu filtern reicht NICHT.

### 3. Die Haupt-Vorschau ist ein iframe mit inline generiertem CSS

`updatePreview()` baut das komplette HTML-Dokument als String, theme-abhängig über
`isLightSyntax`, direkt bei den `mark.mark-*`-Regeln. **`styles/app.css` greift dort
nicht.** Preview-Styles müssen daher IMMER an zwei Stellen:

1. iframe-`<style>` in `updatePreview()`
2. `styles/app.css` — für PS-Notizkarten (`renderNoteHtml`) und Kommentare.
   Nicht auf `.md-content` scopen: Kommentare rendern ohne diesen Wrapper.

**Kontrast-Trick für beliebige Nutzerfarben:** `box-shadow: inset 0 0 0 1px
rgba(128,128,128,.45)` statt Border — hält `#FFFCF4` (fast weiß) und `#18251D`
(fast schwarz) auf hellen wie dunklen Themes sichtbar, ohne Luminanz-Rechnung.

## Syntax-Erkenntnisse

- 3-stelliges Hex in der `#`-Form kollidiert mit Hashtags (`#dad`, `#bad`, `#ace`)
  → dort nur 6/8 Stellen zulassen. In der Slash-Form sind 3 Stellen unkritisch.
- Wortgrenzen-Anker (`(^|[\s(\[])` + Lookahead) killen `/usr/bin/`, `24/7`, `1/2/3`
  und URL-Fragmente.
- Restrisiko bleiben echte Hex-Wörter passender Länge: `/facade/`, `/decade/`,
  `/beefed/`. Akzeptiert, weil der Toggle existiert.
- Sicherheit: nur `[0-9a-fA-F]` erreicht das `style`-Attribut (Whitelist im
  Renderer zusätzlich zur Tokenizer-Regex) — passend zu `html:false`.

## Test-Muster zum Wiederverwenden

Node-Skript schneidet den Code-Block per String-Marker aus `app.js` heraus und
`eval`t ihn gegen die vendored markdown-it → getestet wird der **echte** Code,
nicht eine nachgebaute Kopie. Fallstrick: Repo hat `"type":"module"`, das UMD-Bundle
muss vorher in einen Ordner ohne `package.json` kopiert werden, sonst liefert
`require()` ein leeres ESM-Namespace-Objekt.

Lokaler Server bootet weiterhin nicht (`better-sqlite3` ABI, Node 26 vs. 131).
Für Browser-Tests das Frontend statisch servieren — die Vorschau ist reines
Client-Rendering, nur WebSocket/PS fallen aus.
