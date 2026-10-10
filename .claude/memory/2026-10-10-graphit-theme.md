# Theme Graphit (2026-10-10)

Wunsch: ein Theme in sauber abgestuften Grautönen mit bestmöglichem Kontrast, jedes
Element bewertet. Erst Vorschlag als Artifact, nach OK eingebaut.

## Vorgehen

1. Lokaler Stub-Server (Rezept `2026-09-16-mobil-audit.md`) mit 4 Beispiel-Notizen.
2. Playwright (Python aus `/opt/anaconda3`, Chromium 1117) öffnet 10 Ansichten
   (Start, Notiz, Vorschau, Kommentare, Auswahlmenü, Einstellungen, Kalender, 3 × Handy)
   und misst je sichtbarem Element Textfarbe gegen die echte, aufgemischte Fläche,
   bei Feldern/Knöpfen den Rand. Auch im Vorschau-iframe.
3. CSS aus `ash` abgeleitet (Farb-Mapping je Hex/rgba, Block direkt hinter jedem
   Ash-Block), plus Graphit-Block am Dateiende. JS: `THEMES`, `THEME_ORDER`,
   `GLOW_BLOCKED_THEMES`, `solidBgs`, `modalBackdrops`, `modalBorders`, drei
   Vorschau-`case`s.
4. Gegenprüfung durch eigenen Agenten mit Pixelmessung.

## Ergebnis (Ash → Graphit, 133 Texte, 34 Ränder)

Texte < 7:1: 63 → 0 · Texte < 4,5:1: 13 → 0 · Ränder < 3:1: 28 → 2 (Text-Chips,
Rand nur Deko) · Flächen/Texte mit Farbton: 145 → 0. Ausgenommen: `#appFooter`
(inline-Style, bis Hover unsichtbar, alle Themes).

## Was die Gegenprüfung fand (Runde 1)

Kalender-✕ 3,3:1 · Tag-Trenner › 6,1:1 auf dem Chip (ich hatte gegen `#181818`
gerechnet, er sitzt auf `#2d2d2d`) · gestrichelter Rand „+ Tag“ 2,9:1
(`color-mix(currentColor 35%)`) · bläulich: `#actionTrigger`/`#toolboxTrigger`
(`rgba(226,232,240,.8)`), `#tocToggle` (fehlende `toc*`-Keys in `THEMES`),
aktiver Raum-Tab (`#roomTabs .text-fuchsia-100 { #e2e8f0 !important }`).

## Merke

- Kontrast gegen die Fläche **direkt dahinter** rechnen, nicht gegen den Grund.
- Pixel-Messung kleiner Schrift (11 px) liegt deutlich unter dem Farbwert
  (Kalender außerhalb des Monats: Farbe 7,8:1, Pixel 5,9:1).
- `:focus-visible` auf Textfeldern greift auch bei Mausklick → Ring nur für
  Knöpfe/Links, Textfelder zeigen Fokus über den Rand.
- Fehlende `toc*`-Keys in `THEMES` fallen auf Schiefer-Blau zurück.

- `--accent-text` nicht als „Schrift auf Akzent-Füllung“ umdeuten — fast alle Regeln
  nutzen es als helle Schrift auf dunkler Fläche (Hover von Chips, ✕, Tooltip).

## Nachtrag Rahmen + Hover

User: „Rahmen massiv reduzieren, Hover reparieren“. Ränder `#6e6e6e` → `#383838`
(aktiv/Hover `#4a4a4a`). Hover-Probe (Maus auf jedes Element, Stil vorher/nachher)
fand: Filter-Chips, ✕, „Zurücksetzen“, Sortier-Knopf → Schrift `#141414`; dazu
`!important`-Overrides, die Hover von „Anwenden“, Datumsfeldern und Backup-Knöpfen
schluckten. Notizliste hat jetzt Hover (andere Themes: bewusst keiner).

## Offen

Fokus-/Disabled-Zustände nicht gemessen. Status-Punkt und die 7 Markier-Punkte
bleiben bunt (User-Entscheid: sind Inhalt bzw. Status).
