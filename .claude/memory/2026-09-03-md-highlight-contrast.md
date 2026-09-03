# Markdown-Hervorhebung: Kontrast + Tags-Leisten-Schatten (2026-09-03)

**Falscher Alarm, aber echter Befund.** Der User meldete „die Markdown-Formatierung in
`#mirror` ist weg". Das Feature war intakt (Code seit `cd06ac6` unangetastet, in Prod
verifiziert). Es war **Lesbarkeit**:

- Farbschema „Theme-Akzent" setzt `--md-heading: var(--accent-strong)` — und
  `--accent-strong` ist bei 8 von 12 Themes eine **halbtransparente Füllfarbe**. Gedeckt
  über der Editor-Fläche: violet **1,92:1**, fuchsia/coffeeLight 2,66:1, ash 3,23:1;
  nur bitterDark (5,10:1) schafft AA. Bei Ash war die Überschrift dunkler als der
  Klartext. **MERKE: `--accent-strong` ist eine Füll-, keine Textfarbe.**
- `--md-marker` liegt in **jedem** Theme unter AA (3,00–4,03:1), Ash am schwächsten.

Gefixt wurde **nur Ash** (User: andere Themes passen): `--md-marker` → `#8b949e` (4,7:1),
`--md-heading` im Akzent-Schema → deckendes `#6fa8d6` (5,7:1) via
`body.md-preset-accent[data-theme="ash"]`.

**Tags-Leiste:** Der `box-shadow` saß auf der Gruppe
`#toggleComments, #psEditorTagsBar, #psEditorTagsBar > div` — liegt jetzt nur noch auf
dem Button. `#psEditorTagsSuggest` ist auch ein `> div`, behält seinen Schatten aber
über `.shadow-soft`.

## ⚠️ Test-Falle: eingefrorene CSS-Transitions

`getComputedStyle` im In-App-Browser lieferte für `#mirror` dauerhaft den alten
Tailwind-Wert `rgba(2,6,23,.4)`, obwohl die Theme-Regel geladen war und ein **Klon**
desselben Elements die richtige Farbe bekam. Ursache: `ed.getAnimations()` zeigte sechs
`CSSTransition` in `playState: "running"`, die nie fertig wurden (Pane im Hintergrund →
Animationen gedrosselt). `getComputedStyle` gab den eingefrorenen Startwert zurück; nach
erzwungenem Reflow sprang er auf den richtigen. **Ein Prüf-Agent hat daraus fälschlich
einen Caching-Bug diagnostiziert.** Bei Farbmessungen im Browser also erst Reflow
erzwingen oder `getAnimations()` prüfen.

**Echte Lücke daneben:** `styles/app.css` ist das einzige Haupt-Stylesheet ohne `?v=`
(`index.html:42`) → `max-age=300` statt `immutable`, SW stale-while-revalidate. Ein
`CACHE_NAME`-Bump repariert es pro Deploy; strukturell offen.


Siehe auch: [`2026-09-03-ash-theme.md`](2026-09-03-ash-theme.md)
