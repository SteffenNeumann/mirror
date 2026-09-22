# 2026-09-22 — Ash Light ruhiger (Pastell), PR #62

**Auftrag:** Akzent-Blau zu präsent, Flächen blendend. Zielbild: alle Flächen eine Stufe
dunkler, Akzent überall blasser. Später vom User nachgeschärft: „Akzent zu dunkel“ →
Option „richtig hell, pastellig, dunkle Schrift auf Knöpfen“; „Eingabe und Vorschau
verschieden getönt, wirkt unruhig“ → ein Ton. Gewählt: **P + Fokus-Ring**.
Entscheidungsgrundlage: Artefakt „Ash Light, ruhiger“ (Varianten A/B/C, dann P).

## Ablauf, der funktioniert hat
- Designer-Agent: Farben als **Alt→Neu-Tabelle** (OKLCH), per Skript nur auf
  ashLight-Regeln angewendet (`gen.py` → `shared.py` → `genP.py` im Scratchpad), jede
  Variante als App-Kopie mit Stub-Server gerendert.
- Prüfer-Agent jede Runde live gegen den echten DOM. Er fand: Werkzeug-Knopf blieb
  hell, `#codeLang` durch zweite spätere Regel weiß, Vorschau-Checkbox 1,12:1,
  „All“-Hover tot. Er hat auch einmal übertrieben (57 statt 5 feste helle Regeln,
  grobe Textsuche) und es selbst zurückgenommen.

## Fallen
- **Vorschau-iframe lädt kein `app.css`** — Overrides mit `.md-content …` greifen dort
  nie. Checkbox-Rand gehört in `buildPreviewHighlightCss`.
- Helle Akzentfüllung macht jede Stelle kaputt, die `--accent-strong` als Linie/Text
  nutzt → eigener Grafik-Ton `#5a798f`. Pastell-Scan über Haupt-DOM **und** iframe.
- Ruheregel der Aktions-Knöpfe trägt `!important` → Hover braucht eigene Regel.
- Zwei gleich spezifische `!important`-Regeln: die spätere gewinnt (`#codeLang`).

## Bewusst offen
- Aktions-Knöpfe (`#psNewNote`, `#psSaveMain`, `#commentAdd`, `#aiAssist`) Rand 1,96:1.
  Prüfer: „vertretbar, nicht strikt normkonform“. Ich: Knopf über Beschriftung erkennbar.
- `#psSearch` hat beim Fokus gar keinen Ring (vorbestehend, alle Themes).
- `.identity-avatar-item.selected` im Stub nicht renderbar, nur gerechnet (3,55–3,86).
