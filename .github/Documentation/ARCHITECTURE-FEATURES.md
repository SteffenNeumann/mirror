# Mirror – Architektur der einzelnen Features

**Ist-Zustand pro Feature. Wird je Abschnitt ersetzt, wenn sich das Feature ändert —
kein Changelog, keine Historie.**

Diese Datei ergänzt [`ARCHITECTURE.md`](ARCHITECTURE.md). Die Aufteilung folgt der
**Lesehäufigkeit**, nicht dem Thema:

| Datei | wann gelesen | Budget |
|---|---|---|
| `ARCHITECTURE.md` | **vor jeder Aufgabe**, ganz | 15 KB |
| `ARCHITECTURE-FEATURES.md` (diese) | **nur der Abschnitt**, den man anfasst | keins |

`ARCHITECTURE.md` trägt, was querliegt: Stack, Startsequenz, Raum-Modell, PS-Persistenz,
Markdown-Vorschau, Themes und Layout, Offline, Cache-Busting. Das wächst mit der App,
nicht mit der Zahl der Features. Hier landen die Interna einzelner Features — sie wachsen
mit jedem neuen Feature und würden das Budget drüben sonst sprengen.

**Ein neues Feature dokumentieren:** Abschnitt hier anlegen, drüben ein Dreizeiler mit
Verweis. **Nicht** in eine datierte Datei unter `.claude/memory/` verweisen — die sind
Aufgaben-Protokolle und werden nicht nachgeführt, wenn sich das Feature ändert.

---

## Vergleichs-Panel

`#comparePanel` zeigt eine **zweite Notiz read-only** neben dem Editor. Vorschau und
Vergleich teilen sich die zweite Spalte von `#editorPreviewGrid`; die Spaltenzahl setzt
`syncEditorPreviewGridColumns()` per `classList` (nie `className` überschreiben — daran
hängen auch `comment-panel-open` und das `hidden` des Kalenders). Öffnen: Button
„Vergleichen" in der Editor-Leiste, das Symbol in der Notizzeile, der Kontextmenü-Eintrag
oder **Alt+Klick** in der Liste. Auf Touch führt nur das Kontextmenü hin — `.ps-note-actions`
erscheint erst bei `:hover`. Mobil: Vollbild über die Body-Klasse `mobile-compare-open`.

Datenquelle ist `psState.notes`, gerendert mit `buildPreviewContentHtml(text, {noteId,
showMeta})` ins Haupt-DOM. Kein Backend, kein CRDT, kein Auto-Save.

⚠️ **Drei Regeln, die das Panel tragen:**

1. **Kein zweites Vorschau-iframe.** `previewMsgToken` ist ein *einziger* globaler
   String, gegen den der zentrale `message`-Handler alles validiert. Ein zweiter Frame
   wäre tot oder würde den Haupt-Frame kapern — ein Checkbox-Klick im Vergleich schriebe
   dann in die **bearbeitete** Notiz.
2. **`psEditingNoteId` bleibt unberührt.** Auf Mobil hängt der Ansichtszustand allein
   daran, und die Auto-Save-Kette leitet daraus die bearbeitete Notiz ab.
3. **Eigene Typografie.** Tailwind-Preflight resettet Überschriften und Listen; der
   iframe der Vorschau kennt kein Preflight und nutzt Browser-Defaults. Die Regeln für
   das Panel stehen unter `.compare-body` in `styles/app.css`.

## Claude-Chat im Vorschau-Panel

`#previewPanel` ist eine Flex-Spalte: Kopfzeile, `iframe#mdPreview` (`flex-1 min-h-0`),
`#aiConversationSection`. Im Abschnitt stehen Steuerzeile, `#aiChatHistory`,
`#aiPromptRow`, `#runOutputBar` und `#runOutput`.

- **Normalmodus:** `#aiConversationSection` hat `max-height: 60%` und scrollt selbst.
  Ohne diese Grenze wuchs er mit dem Verlauf, drückte das iframe auf 0 px, und das
  `overflow-hidden` des Panels schnitt Prompt und Antwort ab.
- **Maximiert** (`#aiChatMaxBtn` → `setAiChatMax()`, Klasse `ai-chat-max` am Panel):
  iframe `display:none` (unbedenklich — nichts misst das iframe, Rendering läuft über
  `src`/`srcdoc`). Der Abschnitt nimmt die volle Höhe. `#aiChatHistory` füllt den
  freien Platz (`flex: 1 1 0`, mind. 120 px, scrollt, springt ans Ende) und zeigt die
  Nachrichten **ungekürzt** (das 3-Zeilen-`line-clamp` von `.ai-chat-message` ist hier
  aus). `#runOutput` ist auf `30dvh` begrenzt und scrollt selbst. `#aiPromptRow` steht
  per `order: 1` ganz unten (Reihenfolge wie im Chat: Verlauf → Antwort → Eingabe). `updateRunOutputSizing()` setzt in diesem Modus kein Inline-`max-height`.
- Einklappen beendet den Max-Modus, Maximieren klappt auf. Der Zustand wird **nicht**
  gespeichert — nach dem Neuladen ist die Vorschau immer da.

## Kalender: gemeinsame Terminfindung

Zwei Modi (`calendarMode`): `personal` und `planning`. Im Planning-Modus wird das Teilen
automatisch aktiviert.

```
Tage wählen → toggleDayAvailability() → manualFreeSlots: Map<"YYYY-MM-DD", Set>
            → broadcastAvailability()  ──WS "availability_state"──▶ Server
Server validiert (busy ≤ 200 Intervalle, selectedDays ≤ 60) und broadcastet an alle
            ◀── handleAvailabilityState() → renderCommonFreeSlots() + renderCalendarPanel()
```

`computeCommonSelectedDays()` bildet die Schnittmenge aller Teilnehmer;
`renderParticipantIndicators(day)` zeichnet farbige Punkte plus „2/3"-Badge ins Grid.
Empfangene Daten liegen in `availabilityByClient: Map<clientId, AvailabilityData>`
mit `{ name, color, busy[], selectedDays[], rangeStart, rangeEnd }`.

## Notiz-Graph

Vollbild-Overlay `#noteGraphOverlay`, reine Client-Ansicht über vorhandene Daten —
**kein Backend- oder Schema-Change**. Alle Funktionen sind `ng`-präfixiert.

```
psState.notes → filterRealNotes → ngBuildData {nodes, links} → ngViewData (Global|Lokal)
              → ForceGraph().graphData()  (Canvas)
```

Kanten aus `[[Wiki-Links]]`, optional aus geteilten Tags (default **aus**, gekappt bei
8 Notizen pro Tag). Knotengröße skaliert mit dem Verlinkungsgrad. Split-View: Liste
(`#ngSidebar`) und Canvas sind zwei Ansichten **einer** Auswahl — beide laufen durch
`ngSetSelection(id, {source})`, damit nichts auseinanderdriftet.

⚠️ Canvas erbt kein CSS. Farben kommen per `getComputedStyle` aus den `--accent-*`.
Die Textfarbe wird aus der **Hintergrund-Luminanz** abgeleitet, weil `body color` auf
mehreren Dark-Themes schwarz ist. In `ngInit` ist `.autoPauseRedraw(false)` zwingend,
sonst friert `cooldownTicks` das Rendering ein.

## Query-Engine (PS-Suchfeld)

Operatoren: `tag:` · `task:open` · `task:done` · `has:task` · `has:link` · `kind:` ·
`created:>` · `updated:<` · `pinned:`. Bei Task-Queries erscheint ein aggregiertes
Ergebnis-Panel über der Notizliste. Zuständig: `parseQueryTokens`,
`noteMatchesStructuredQuery`, `renderQueryResults`.

## Ein neues Theme hinzufügen

Vollständige Liste der Stellen — `index.html` braucht **nichts**, die Theme-Liste
rendert `renderThemeList()` aus `THEME_ORDER`.

**`app.js` (9, hell: 10):** `THEMES.<id>` · `THEME_ORDER` · `GLOW_BLOCKED_THEMES` (falls
ohne Glow) · `solidBgs` · `modalBackdrops` · `modalBorders` · `getPreviewFieldColors` ·
`getPreviewPreColors` · `buildPreviewHighlightCss` — und bei hellen Themes
`isLightSyntax` in `updatePreview()`, sonst rendert die Vorschau dunkle Code-Farben.

**`styles/app.css` (6):** der `body[data-theme="…"]`-Hauptblock — plus fünf **leicht
übersehene** Gruppen-Selektoren, die weit verstreut liegen: `.ps-tags-bar-inner`
(steht rund 3300 Zeilen vor dem Hauptblock), die `.excel-iframe`-Invert-Liste,
`.ps-note-pin … svg path`, `.calendar-day-today` und `#codeLang` (Basisregel mit
`!important` und festem Dunkelblau — ohne eigenen Eintrag bleibt das Dropdown blau).

**Helle Themes sind ein anderer Maßstab:** Sie müssen jede dunkle Tailwind-Grundfarbe
einzeln überschreiben — `bitterLight` hat rund 240 Regelblöcke (107 davon Gruppen-
Selektoren), ein dunkles Theme wie `ash` rund 75. `ashLight` ist deshalb aus
`bitterLight` **abgeleitet**: jeder Gruppen-Selektor bekam eine `ashLight`-Zeile, jeder
Einzelblock eine Kopie mit gemappten Farben direkt dahinter (gleiche Kaskaden-Position).
Die gemeinsame Light-Token-Gruppe (`--md-marker`, `--md-muted`, `--md-code`) fällt auf
kühlem Grund unter AA — ein neues helles Theme braucht dort eigene Werte.

⚠️ `--modal-backdrop` und `--modal-border` sind in CSS **nirgends** deklariert — die
JS-Maps sind dort die einzige Quelle. Wer sie vergisst, bekommt einen generisch blauen
Modal-Hintergrund.

⚠️ Als Vorlage taugt `bronzeDark` nur bedingt: ihm fehlen sechs Gruppen, die andere
Themes haben (`.calendar-day-today`, `#settingsGlowToggle`-Optik,
`.block-arrange-overlay`, `.cal-mode-tab`, `caret-color`, `getPreviewPreColors`). Wer
es kopiert, kopiert die Lücken mit. `ash` hat alle sechs.
