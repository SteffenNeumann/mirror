# 2026-09-21 – Theme „Ash Light“

**Auftrag:** helles Gegenstück zum Ash-Theme. Farbanalyse Frontend-Agent, Kontraste
von mir nachgerechnet, Umsetzung per Skript, Prüfung durch QA-Agent (PUSH OK).
Entscheidungsgrundlage für den User: Artefakt „Ash Light“ (Variante A „kühl-hell“
gewählt, B „Papier-warm“ verworfen — lag fast auf Bitter Light).

## Wie gebaut

Helle Themes überschreiben jede dunkle Tailwind-Grundfarbe einzeln (~240 Blöcke).
Statt sie von Hand zu schreiben: Skript über alle Regelblöcke mit
`data-theme="bitterLight"`:
- Block mit anderen Themes im Selektor → `ashLight`-Zeile hinter der bitterLight-Zeile.
- Block nur für bitterLight → Kopie direkt dahinter, Farben per Map (Hex + RGB-Tripel
  für rgba mit beliebigem Alpha). Gleiche Position = gleiche Kaskade.
- Semantische Farben (Tag-Pills grün/blau, Linear-Violett, rgba(0,0,0,x)) bleiben.
- Falle: Regeln in `@media` kamen ohne Einrückung raus → nachträglich eingerückt.

## Funde

- `isLightSyntax` fehlte in der Theme-Checkliste → ohne ihn dunkle Code-Farben in der
  Vorschau. Checkliste in `ARCHITECTURE-FEATURES.md` ergänzt.
- Gemeinsame Light-Token-Gruppe (`--md-marker #7a7f88` 3,4:1 auf Panel) → eigene Werte.
- Vorbestehend, alle Light-Themes (nicht behoben): `.hljs-title.function_` bleibt lila
  (github.min.css schlägt die 1-Klassen-Regel); einige `text-slate-*`-Klassen direkt in
  `index.html` (Header-Buttons, Footer) liegen unter 4,5:1.
