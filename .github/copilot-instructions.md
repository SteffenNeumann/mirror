# Copilot-Instruktionen – Mirror

Diese Datei ist **absichtlich kurz**. Die Regeln stehen an genau einer Stelle, damit
sie nicht auseinanderdriften — hier steht nur, wo diese Stelle ist.

## Zuerst lesen

| Frage | Datei |
|---|---|
| Wie arbeite ich in diesem Repo? | [`CLAUDE.md`](../CLAUDE.md) im Repo-Root |
| Wie ist die App gebaut? | [`.github/Documentation/ARCHITECTURE.md`](Documentation/ARCHITECTURE.md) |
| Welche Funktion macht was? | [`.github/Documentation/FUNCTIONS.md`](Documentation/FUNCTIONS.md) — nach `#tag` greppen |
| Erfahrungen und bekannte Fallen | [`.claude/memory/MEMORY.md`](../.claude/memory/MEMORY.md) |

`CLAUDE.md` gilt für **alle** KI-Assistenten in diesem Repo, nicht nur für Claude.
Der Abschnitt „Stehende Fallen" in `MEMORY.md` spart die Fehler, die hier schon
zweimal passiert sind.

## Die drei Regeln, die am häufigsten verletzt werden

1. **Keine neue Sammel-Dokumentationsdatei anlegen.** Die Doku ist nach Lebensdauer
   getrennt: `ARCHITECTURE.md` beschreibt den Ist-Zustand und wird **überschrieben**;
   `DOCUMENTATION.md` ist der wachsende Changelog. Wer beides mischt, baut wieder die
   221-KB-Datei, die 2026-08 aufgeteilt werden musste, weil kein Modell sie mehr las.
   Größenbudgets prüft `scripts/check-doc-budgets.sh` in der CI.

2. **Nicht direkt auf `main` committen.** Für jede Arbeit frisch abzweigen
   (`git fetch origin main && git checkout -b <neu> origin/main`), dann PR. Details
   und die Cache-Busting-Pflicht stehen in `CLAUDE.md` → „Commit-Workflow".

3. **Nichts Privates in versionierte Dateien.** Das Repo ist **öffentlich**. Konten,
   Adressen und Zugangsdaten gehören in `.claude/memory/local.md` (gitignoriert).

## Ausgabestil

- Vollständig antworten, nicht abschneiden — auch bei langem Code.
- Nur vorhandene Informationen nutzen, exakt die gestellte Frage beantworten.
- Code und Kommandos in Codeblöcke.
- Betroffene Dateien und Zeilen konkret benennen statt allgemein zu beschreiben.
