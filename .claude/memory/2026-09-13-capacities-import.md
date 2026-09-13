# Capacities-Backup-Import (2026-09-13)

**Ziel:** Notizen aus einem Capacities-App-Export (`Schedule #1`) ins echte
Notizkonto (user_id 1) importieren. Kein Code-Change am Repo — reine
Daten-Migration über die bereits vorhandene `/api/notes/import`-Funktion.

## Umfang (nach mehreren Einschränkungen durch den User)
Nur `NOTES VAULT/Notes` (112) + `NOTES VAULT/CodeSnippets` (134) = **246 Notizen**.
Alles andere (Tasks, Projects, Journeys, Recipies, DailyNotes, Contacts, Movies,
Weblinks, Images, PDFs, DOCUMENT VAULT …) bewusst ausgeschlossen.

## Wichtige Erkenntnisse für künftige Bulk-Importe
- **Tag-Limit:** `normalizeImportTags()` (server.js) lässt nur **3 reguläre Tags**
  pro Notiz zu, lowercase, `^[a-z0-9_+:-]{1,48}$` — Capacities-Tags mit `#`/Umlauten
  müssen bereinigt und gekappt werden (bei diesem Import: 189 Tags verworfen).
- **Kein Pipe-Alias in Wikilinks:** `applyWikiLinksToMarkdown()` (app.js) matcht nur
  reines `[[Titel]]`. `[[Titel|Alias]]` muss vor dem Import zu `[[Titel]]` gekürzt
  werden, sonst entsteht ein toter Link (70 Fälle repariert).
- **1-MB-Request-Limit** auf `/api/notes/import` (readBody zählt String-*Zeichen*,
  nicht Bytes) — bei größeren Imports in mehrere `mode:"merge"`-Batches aufteilen.
  Nie `mode:"replace"` verwenden (löscht alle bestehenden Notizen hart, ohne Trash).
- **Kein Bulk-Attachment-Import.** Der eingebaute Import (Settings→Export/Import)
  überträgt nur Text+Tags, keine Dateien. Bilder/PDFs müssen einzeln über
  `/api/uploads` hochgeladen und die Pfade im Text ersetzt werden — bei diesem
  Import stattdessen bewusst übersprungen (siehe unten).
- **Meta-Kopf im Editor ist nicht frei nutzbar:** `buildNoteMetaYaml()` (app.js)
  zeigt nur berechnete Systemfelder (id/kind/created/updated/words/characters/tags),
  kein Speicherplatz für eigene Felder wie Capacities' `status`/`deadline`.
  Frontmatter-Felder wurden stattdessen als `- **feld:** wert`-Zeilen in den
  Notiztext gefaltet.
- **Cross-Note-Links per relativem `.md`-Pfad** (Capacities nutzt das gelegentlich
  statt `[[Wikilink]]`) werden von Mirror gar nicht erkannt — nur reparierbar, wenn
  das Linkziel selbst mitimportiert wird (hier: 1 von 19 Fällen).
- **Orphan-Wikilinks:** Bei einem Teil-Import (hier nur 2 von 21 Capacities-
  Kategorien) zeigen viele `[[Wikilinks]]` auf nicht importierte Notizen (132 Fälle)
  — bleiben als toter Link stehen, ist bei Teil-Imports unvermeidbar.

## Durchführung
Vorschau zuerst als Claude-Artefakt gezeigt (Vorher/Nachher, 5 Beispielnotizen),
erst nach Freigabe den vollen Konverter (Node-Skript, lokal, nicht Teil des Repos)
auf alle 246 Dateien laufen lassen. User wollte **keine** Live-Session-Nutzung
(kein Magic-Link-Login im Claude-Browser) — stattdessen zwei fertige JSON-Dateien
geliefert, die er selbst über Settings→Export/Import→Merge eingespielt hat, plus
eine Checkliste (`anhaenge-checkliste.md`) für die 9 Notizen mit insgesamt 19
Anhängen (22 MB, größte Datei 5,5 MB), die er manuell nachträgt.

**Ergebnis:** Import lief erfolgreich (User-Rückmeldung 2026-09-13).
