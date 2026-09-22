# 2026-09-21/22 – Tags-Leiste im Editor (5 PRs an zwei Tagen)

Ist-Zustand steht in `ARCHITECTURE-FEATURES.md#tags-leiste-im-editor`. Hier nur, wie es
lief und was man daraus lernt.

**Ablauf:** #54 Leiste flach (User-Wunsch) → #55 Tags gruppiert (Variante C aus dem
Artefakt „Mirror Tags“) → #56 Verlauf, weil nach #54 Text unter den Tags durchlief →
#57 Text auf der Editor-Kante + 12-px-Spalt rechts.

**Fehler von mir:**
- #54 hat die Folge nicht bedacht: die Leiste liegt ÜBER dem scrollenden Text; ihr
  Hintergrund war zugleich Abdeckung. Wer eine Fläche entfernt, prüft mit gescrolltem Inhalt.
- Erster Verlauf hing an der Leiste (`::before`) — mobil ist die Leiste schmaler, Text lief
  links/rechts vorbei. Und `right: 12px` „für die Scrollleiste“: macOS-Overlay-Scrollbars
  haben keine Breite, lange Zeilen (`white-space: pre`) reichen bis an den Rand.
- Das Aufblitzen auf der Kante habe ich ZWEIMAL als „alten Stale-Paint-Fehler“ abgetan.
  Ursache war banal: Overlays `inset:0` malen in den halbtransparenten 1px-Rahmen. Meine
  Browser-Pane-Experimente (clip-path, contain) waren wertlos, weil verkleinerte
  Screenshots und nicht neu gezeichnete Pixel sich gegenseitig verdeckten.

**Methode, die es in Minuten belegt hat:** Playwright (`mcp__playwright__*`, Viewport
1280×800, echte CSS-Pixel) + `page.mouse.wheel` in Schritten + `page.screenshot({clip})`
+ Pixel-Scan (helle Pixel je Zeile) — vorher/nachher als Zahl (1880 → 0).
Screenshots darf Playwright nur unter `<repo>/.playwright-mcp/` speichern — der Ordner
ist NICHT gitignoriert, nach dem Test löschen.

**Prüfer-Funde, die ich übersehen hatte:** bronzeDark-Kontrast 4,07 (→ eigenes Bronze);
Meta-Kasten `#psMetaOverlay` blitzte ebenfalls auf der Kante.
