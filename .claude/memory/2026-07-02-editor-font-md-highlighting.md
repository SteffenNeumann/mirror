# Editor: JetBrains Mono + Markdown-Quell-Highlighting (2026-07-02)

PR #10 (`5815730`), Follow-up PR #11 (`b575d17`).

## Was

- **JetBrains Mono** self-hosted (`/vendor/jetbrains-mono-var.woff2`, Variable Font,
  `@font-face`, SW-precached).
- **Markdown-Quell-Highlighting** als Overlay `#mdHighlightOverlay`; Tokenizer
  `buildMdHighlightHtml` / `mdInline`, Sentinel U+E000 zum Stashen von Code/Links/Bold.
- CSS-Vars `--editor-font` / `--editor-size` / `--editor-lh` werden von Textarea
  **und allen Overlays gemeinsam** genutzt — identische Metrik = korrekte Ausrichtung.
  Dazu `--md-*` für die Token-Farben.
- **Settings → „Editor":** Schriftart (System Sans / JetBrains Mono / System Mono),
  Hervorhebung An/Aus, 3 Farbschema-Presets. Persistenz `mirror_editor_font`,
  `mirror_md_highlight`, `mirror_md_preset`.
- Default: Sans + Highlighting **aus** (opt-in; Aktivieren erzwingt Monospace).

## MERKE

**Programmatische `textarea.value = …`-Edits triggern kein `input`-Event** → das
Overlay aktualisiert sich nicht. Lösung: Dirty-Watcher `startMdDirtyWatch`
(140 ms-Poll), der den Wert gegen den letzten bekannten Stand vergleicht.

Dasselbe Muster taucht beim Undo/Redo wieder auf (dort synthetisches `input`-Event).
