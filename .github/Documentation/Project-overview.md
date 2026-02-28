# Project overview

Datum: 2026-02-26

Hinweis: Abhängigkeiten sind Funktionsaufrufe innerhalb der Datei (statische Analyse, keine Laufzeitauflösung).

---

## Architektur: Shared Rooms für User ohne Personal Space

User ohne Personal Space (PS) können vollständig an geteilten Räumen teilnehmen. Es gibt kein separates "Gastraum"-Konzept – stattdessen nutzt das System einen **Room-Scope** anstelle eines Note-Scopes:

### Room-Scope-Mechanismus (User ohne PS)

| Komponente | Verhalten für User ohne PS |
|------------|----------------------------|
| **Text-Sync (CRDT)** | WebSocket-Sync läuft über `room:key`, CRDT ist konfliktfrei → alle Clients dürfen senden/empfangen |
| **Kommentare** | `getCommentScopeId()` gibt `room:roomName:key` zurück statt `note:xxx` |
| **Apps (Excalidraw/Excel/Linear)** | `getExcalidrawNoteId()` etc. fallen auf `room:roomName:key` zurück |
| **Availability/Kalender** | `availability_state` mit `selectedDays` funktioniert unabhängig von PS-Auth |
| **Permanent-Links** | Per WebSocket empfangene Pins werden im Shared-Storage gespeichert |

### Automatische Shared-Markierung

Der Raum wird automatisch als "shared" markiert wenn:
1. `presence_state`-Handler andere `clientIds` erkennt (anderer User anwesend)
2. `room_pin_state` empfangen wird mit `shared: true` Flag oder Pin-Daten
3. User explizit `markCurrentRoomShared()` aufruft (Link teilen)

### Scope-Priorisierung (`getCommentScopeId`)

```
if (isRoomMarkedShared(room, key)) → "room:roomName:key[:n:noteId]"
else if (psEditingNoteId)          → "note:noteId"
else if (room && key)              → "room:roomName:key"
```

### Zuständige Funktionen
- `getCommentScopeId` ([app.js](app.js#L2813))
- `isRoomMarkedShared` → prüft Shared-Status
- `markRoomShared` → (auto/manual) setzt Shared-Flag
- `getExcalidrawNoteId`, `getExcelNoteId`, `getLinearNoteId` → Room-Scope-Fallback

---

## Architektur: Gemeinsame Zeit finden (Availability Broadcasting)

Die "Gemeinsame Planung"-Funktion ermöglicht es mehreren Teilnehmern in einem geteilten Raum, ihre Verfügbarkeit zu teilen und gemeinsame freie Termine zu finden.

### Workflow-Diagramm

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GEMEINSAME PLANUNG - WORKFLOW                        │
│                                                                             │
│  NEU: Tab-basierter Einstieg via "Gemeinsam planen" Tab (ab 2026-02-26)     │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐                                                    ┌──────────────┐
│   USER A     │                                                    │   USER B     │
│  (Browser)   │                                                    │  (Browser)   │
└──────┬───────┘                                                    └──────┬───────┘
       │                                                                   │
       │ 0. Klick auf "Gemeinsam planen" Tab (NEU)                         │
       │    → setCalendarMode("planning")                                  │
       │    → Auto-Enable: saveCommonFreeSlotsSharing(true)                │
       ▼                                                                   │
       │ 1. (ODER) Klick auf "Verfügbarkeit teilen" Toggle                 │
       │    (calendarCommonFreeToggle)                                     │
       ▼                                                                   │
┌──────────────────────────────────────┐                                   │
│ saveCommonFreeSlotsSharing(true)     │                                   │
│ → commonFreeSlotsSharing = true      │                                   │
│ → applyCommonFreeToggleUI()          │                                   │
│ → scheduleRoomSlotsSync()            │                                   │
└──────────────────────────────────────┘                                   │
       │                                                                   │
       │ 2. User wählt Tage im Kalender-Grid aus                           │
       │    (Klick auf Tag-Zelle)                                          │
       ▼                                                                   │
┌──────────────────────────────────────┐                                   │
│ toggleDayAvailability(day)           │                                   │
│ → manualFreeSlots.set(dayKey, Set)   │                                   │
│ → Set enthält FULL_DAY_AVAILABLE_KEY │                                   │
└──────────────────────────────────────┘                                   │
       │                                                                   │
       │ 3. Verfügbarkeit wird via WebSocket gesendet                      │
       ▼                                                                   │
┌──────────────────────────────────────┐                                   │
│ broadcastAvailability()              │                                   │
│ → Sammelt alle selectedDays aus      │                                   │
│   manualFreeSlots Map                │                                   │
│ → Berechnet busy-Intervalle          │                                   │
│   (Komplement der freien Zeiten)     │                                   │
│ → Sendet WebSocket-Nachricht:        │                                   │
│   {                                  │                                   │
│     type: "availability_state",      │                                   │
│     clientId, name, color,           │                                   │
│     busy: [...],                     │                                   │
│     selectedDays: ["2026-02-24",...],│                                   │
│     rangeStart, rangeEnd             │                                   │
│   }                                  │                                   │
└──────────────────────────────────────┘                                   │
       │                                                                   │
       │                    WebSocket                                      │
       ▼                                                                   │
┌──────────────────────────────────────────────────────────────────────────┐
│                            SERVER (server.js)                            │
│                                                                          │
│  if (msg.type === "availability_state") {                                │
│    → Validiert clientId, name, color                                     │
│    → Validiert busy-Intervalle (max 200)                                 │
│    → Validiert selectedDays (YYYY-MM-DD, max 60)                         │
│    → Speichert in roomAvailabilityState Map:                             │
│      map.set(clientId, { name, color, busy, selectedDays, ... })         │
│    → Broadcast an ALLE Clients im Raum:                                  │
│      { type: "availability_state", participants: [...] }                 │
│  }                                                                       │
└──────────────────────────────────────────────────────────────────────────┘
       │                                                                   │
       │                    WebSocket Broadcast                            │
       ▼                                                                   ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────────┐
│ handleAvailabilityState(msg)         │    │ handleAvailabilityState(msg)     │
│ (User A - Bestätigung)               │    │ (User B - Empfängt Daten)        │
│ → availabilityByClient.set(...)      │    │ → availabilityByClient.set(...)  │
│ → renderCommonFreeSlots()            │    │ → renderCommonFreeSlots()        │
│ → renderCalendarPanel()              │    │ → renderCalendarPanel()          │
└──────────────────────────────────────┘    └──────────────────────────────────┘
       │                                                                   │
       ▼                                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RENDERING (beide Clients)                           │
│                                                                             │
│  renderCommonFreeSlots()                                                    │
│  ├─ computeCommonSelectedDays()                                             │
│  │   → Berechnet Schnittmenge der selectedDays aller Teilnehmer             │
│  │   → Gibt commonDays[] + perParticipant[] zurück                          │
│  │                                                                          │
│  ├─ Zeigt Teilnehmer-Chips mit Tage-Anzahl:                                 │
│  │   "User A (du) 3 Tage" "User B 2 Tage"                                   │
│  │                                                                          │
│  ├─ Wenn commonDays.length > 0:                                             │
│  │   → Zeigt "Gemeinsame Tage" Sektion mit grünen Chips                     │
│  │                                                                          │
│  └─ Sonst:                                                                  │
│      → Zeigt pro Teilnehmer deren ausgewählte Tage                          │
│                                                                             │
│  renderCalendarPanel()                                                      │
│  └─ renderParticipantIndicators(day)                                        │
│      ├─ getParticipantsAvailabilityForDay(day)                              │
│      │   → Prüft für JEDEN anderen Teilnehmer ob selectedDays               │
│      │     den aktuellen Tag enthält                                        │
│      │   → Gibt { participants, allAvailable, someAvailable } zurück        │
│      │                                                                      │
│      └─ Rendert farbige Dots + Badge im Kalender-Grid:                      │
│          [🔴][🟢][🔵] 2/3 (2 von 3 Teilnehmern verfügbar)                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Datenstrukturen

| Variable | Typ | Beschreibung |
|----------|-----|--------------|
| `calendarMode` | `"personal" \| "planning"` | Aktueller Kalender-Modus (Tab-State) |
| `CALENDAR_MODE_KEY` | `string` | localStorage-Key für Modus-Persistierung |
| `commonFreeSlotsSharing` | `boolean` | Lokaler Toggle-Status (teilt der User?) |
| `manualFreeSlots` | `Map<string, Set<string>>` | Lokal ausgewählte Tage: `"2026-02-24" → Set(["__day_available__"])` |
| `availabilityByClient` | `Map<string, AvailabilityData>` | Empfangene Daten aller Teilnehmer inkl. self |
| `FULL_DAY_AVAILABLE_KEY` | `"__day_available__"` | Marker für "Tag ist ausgewählt" |

```typescript
// AvailabilityData Struktur
interface AvailabilityData {
  name: string;           // "Max Mustermann"
  color: string;          // "#ef4444"
  busy: Array<{start: number, end: number}>;  // Busy-Intervalle (Timestamps)
  selectedDays: string[]; // ["2026-02-24", "2026-02-25", ...]
  rangeStart: number;     // Timestamp (Beginn des 7-Tage-Fensters)
  rangeEnd: number;       // Timestamp (Ende des 7-Tage-Fensters)
}
```

### Funktions-Referenz

| Funktion | Datei | Zweck |
|----------|-------|-------|
| `loadCalendarMode()` | app.js | Lädt Modus aus localStorage |
| `saveCalendarMode()` | app.js | Speichert Modus in localStorage |
| `setCalendarMode(mode)` | app.js | Wechselt Modus, auto-enables Sharing im Planning-Modus |
| `applyCalendarModeUI()` | app.js | Setzt data-Attribute auf body, updated Tab-States |
| `saveCommonFreeSlotsSharing(bool)` | app.js | Aktiviert/deaktiviert Sharing-Toggle |
| `broadcastAvailability()` | app.js | Sendet eigene Verfügbarkeit via WebSocket |
| `handleAvailabilityState(msg)` | app.js | Empfängt Verfügbarkeit anderer Teilnehmer |
| `handleAvailabilityLeave(clientId)` | app.js | Entfernt Teilnehmer bei Disconnect |
| `computeCommonSelectedDays()` | app.js | Berechnet Schnittmenge aller selectedDays |
| `getParticipantsAvailabilityForDay(day)` | app.js | Prüft wer an einem Tag verfügbar ist |
| `renderCommonFreeSlots()` | app.js | Rendert Sidebar "Gemeinsame freie Zeiten" |
| `renderParticipantIndicators(day)` | app.js | Rendert Dots im Kalender-Grid |
| `availability_state` handler | server.js | Validiert und broadcastet Availability |

### WebSocket-Nachrichtenformat

**Client → Server:**
```json
{
  "type": "availability_state",
  "room": "myroom",
  "clientId": "abc123",
  "name": "Max Mustermann",
  "color": "#ef4444",
  "busy": [{"start": 1740380400000, "end": 1740384000000}],
  "selectedDays": ["2026-02-24", "2026-02-25"],
  "rangeStart": 1740355200000,
  "rangeEnd": 1740960000000
}
```

**Server → Alle Clients (Broadcast):**
```json
{
  "type": "availability_state",
  "room": "myroom",
  "participants": [
    {"clientId": "abc123", "name": "Max", "color": "#ef4444", "busy": [...], "selectedDays": [...], ...},
    {"clientId": "def456", "name": "Lisa", "color": "#10b981", "busy": [...], "selectedDays": [...], ...}
  ]
}
```

---

## Aktuelle Änderungen (2026-02-28)

- **Farbige Text-Markierungen (Highlight-Syntax)** `#markdown` `#highlight` `#preview` `#ux`: Textpassagen können jetzt im Markdown farblich markiert werden. Die Syntax `==text==` erzeugt eine gelbe Markierung (Standard), `=={farbe}text==` eine farbige Markierung mit benannter oder benutzerdefinierter Farbe.

  ### Syntax

  | Markdown-Eingabe | Ergebnis |
  |---|---|
  | `==markierter Text==` | Gelbe Markierung (Standard) |
  | `=={red}roter Text==` | Rote Markierung |
  | `=={green}grüner Text==` | Grüne Markierung |
  | `=={blue}blauer Text==` | Blaue Markierung |
  | `=={orange}orange==` | Orange Markierung |
  | `=={purple}lila==` | Lila Markierung |
  | `=={pink}pink==` | Pinke Markierung |
  | `=={cyan}türkis==` | Türkise Markierung |
  | `=={#ff9900}custom==` | Benutzerdefinierte Hex-Farbe |

  ### Implementierung

  1. **markdown-it Inline-Rule `highlight_mark`** (`app.js` ~L11800): Neuer Tokenizer (analog zum bestehenden `password`-Tokenizer für `||secret||`). Erkennt `==...==`-Syntax mit optionalem `{farbe}`-Prefix. Erzeugt `highlight_mark`-Tokens mit `meta.color`-Property.
  2. **Renderer-Rule `highlight_mark`** (`app.js` ~L11860): Rendert `<mark>`-Tags. Ohne Farbe: Standard-`<mark>`. Mit benannter Farbe: `<mark class="mark-{farbe}">`. Mit Hex-Farbe: `<mark style="background:...">`.
  3. **Preview-iframe CSS** (`app.js` ~L12558): Theme-aware Styles für `mark` und `.mark-{farbe}`-Klassen. Dark-Themes nutzen helle Textfarben mit transparentem Hintergrund, Light-Themes dunklere Textfarben mit geringerem Hintergrund-Opacity.
  4. **`=`-Zeichen bereits im Terminator**: Das Gleichheitszeichen (0x3D) war bereits im `isTerminatorOrPipe`-Switch registriert, daher greift der Highlight-Tokenizer korrekt.

  ### Verfügbare Farben

  | Farbe | Dark-Theme BG | Dark-Theme Text | Light-Theme BG | Light-Theme Text |
  |-------|---------------|-----------------|-----------------|-------------------|
  | (Standard) | `rgba(250,204,21,.35)` | inherit | `rgba(250,204,21,.30)` | inherit |
  | red | `rgba(239,68,68,.25)` | `rgba(252,165,165,1)` | `rgba(239,68,68,.18)` | `rgba(185,28,28,1)` |
  | green | `rgba(34,197,94,.25)` | `rgba(134,239,172,1)` | `rgba(34,197,94,.18)` | `rgba(21,128,61,1)` |
  | blue | `rgba(59,130,246,.25)` | `rgba(147,197,253,1)` | `rgba(59,130,246,.18)` | `rgba(29,78,216,1)` |
  | orange | `rgba(249,115,22,.25)` | `rgba(253,186,116,1)` | `rgba(249,115,22,.18)` | `rgba(194,65,12,1)` |
  | purple | `rgba(168,85,247,.25)` | `rgba(216,180,254,1)` | `rgba(168,85,247,.18)` | `rgba(126,34,206,1)` |
  | pink | `rgba(236,72,153,.25)` | `rgba(249,168,212,1)` | `rgba(236,72,153,.18)` | `rgba(190,24,93,1)` |
  | cyan | `rgba(6,182,212,.25)` | `rgba(103,232,249,1)` | `rgba(6,182,212,.18)` | `rgba(14,116,144,1)` |

  - Zuständige Funktionen: `tokenizeHighlight` (inline-rule), `highlight_mark` renderer-rule, `ensureMarkdown`.
  - Zuständige Dateien: `app.js`.

---

## Aktuelle Änderungen (2026-02-27)

- **Fix: Presence-Name vom Server laden statt pro Device random generieren** `#presence` `#identity` `#cross-device` `#fix`: Auf neuen Geräten wurde bisher ein zufälliger Name (z.B. "Cosmic Hawk") in der `presenceList` angezeigt, obwohl der User bereits einen Namen im Personal Space gespeichert hatte. Der zufällige Name war sichtbar, bis `refreshPersonalSpace()` → `syncIdentityFromServer()` die Identität vom Server nachlud — oft mehrere Sekunden nach dem WebSocket-Connect. Auf Geräten, die den Browser-localStorage nicht teilten, wurde der zufällige Name dauerhaft angezeigt bis der User manuell seine Identität änderte.
  1. **Neue Funktion `earlyIdentitySync()`** (`app.js` ~L926): Asynchrone Funktion, die `/api/identity` GET abruft **bevor** der WebSocket-Connect (`connect()`) ausgeführt wird. Falls der Server eine gespeicherte Identität hat, werden `identity.name`, `identity.avatar` und `identity.color` sofort überschrieben und im localStorage persistiert. Bei nicht eingeloggten Usern (kein PS) oder Netzwerkfehlern wird der zufällige Name beibehalten.
  2. **Connect-Reihenfolge geändert** (`app.js` ~L25462): `connect()` wird jetzt erst nach `earlyIdentitySync().then(() => connect())` aufgerufen. Damit sendet der erste `hello`-Broadcast bereits den korrekten Server-gespeicherten Namen, statt eines zufälligen.
  - Zuständige Funktionen: `earlyIdentitySync` (neu), `connect`, `identity`-IIFE.
  - Zuständige Dateien: `app.js`.

- **Fix: Planungssektion zeigt nur noch Teilnehmer des aktuellen Raums** `#calendar` `#availability` `#bug` `#room-scoping`: Die Teilnehmerliste in der Planungssektion ("Gemeinsame Zeit finden") zeigte bisher ALLE User, die jemals Verfügbarkeit geteilt hatten — unabhängig davon, ob sie aktuell im selektierten Raum verbunden sind. Ursache: Beim initialen WebSocket-Verbindungsaufbau wurden veraltete Availability-Einträge aus der Datenbank (bis zu 30 Tage alt) geladen und als aktive Teilnehmer dargestellt.
  1. **Server: Initial DB-Load filtert nach verbundenen Clients** (`server.js` ~L5952): Beim Laden von Availability-Daten aus der DB werden jetzt nur Einträge für `client_id`s berücksichtigt, die aktuell eine aktive WebSocket-Verbindung im Raum haben. Wenn keine anderen Clients verbunden sind, wird das DB-Loading übersprungen.
  2. **Server: Initial-State-Send filtert nach verbundenen Clients** (`server.js` ~L6007): Der initiale Availability-State, der an neu verbindende Clients gesendet wird, wird gegen die aktuell verbundenen Socket-ClientIds gefiltert.
  3. **Server: `request_state`-Handler filtert nach verbundenen Clients** (`server.js` ~L6788): Auch bei expliziten State-Requests werden nur Availability-Daten für aktuell verbundene Clients zurückgegeben.
  - Zuständige Funktionen: Initial-Connection-Handler, `request_state`-Handler (Server).
  - Zuständige Dateien: `server.js`.

---

## Aktuelle Änderungen (2026-02-26)

- **Kalender Modus-Trennung: Personal vs. Planning (Doodle-Style)** `#calendar` `#ux` `#tabs` `#planning`: Der Kalender hat jetzt zwei separate Modi mit Tab-Navigation für eine klarere UX-Trennung zwischen privater Kalenderverwaltung und gemeinsamer Terminplanung.

  ### Konzept
  
  ```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  [📅 Mein Kalender]  [👥 Gemeinsam planen]   ← Tab-Navigation          │
  ├─────────────────────────────────────────────────────────────────────────┤
  │                                                                         │
  │  PERSONAL MODE                    │   PLANNING MODE                     │
  │  ─────────────────                │   ──────────────                    │
  │  • Termine anzeigen               │   • Tage für Verfügbarkeit wählen   │
  │  • Kalenderquellen verwalten      │   • Teilnehmer-Übersicht            │
  │  • Bundesland/Feiertage           │   • Gemeinsame Tage finden          │
  │  • Grid-Klick → Wochenansicht     │   • Grid-Klick → Toggle Verfügbar   │
  │                                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
  ```

  ### Implementierte Änderungen
  
  1. **HTML: Tab-Navigation** (`index.html` ~L1673): Neue `#calendarModeTabs` Container mit zwei Buttons (`data-calendar-mode="personal"` und `data-calendar-mode="planning"`).
  
  2. **HTML: Sidebar-Sektionen mit Attributen** (`index.html`):
     - `#calendarSidebarCalendarsSection` → `data-calendar-section="personal"`
     - `#calendarSidebarFreeSlotsSection` → `data-calendar-section="personal"`
     - `#calendarSidebarPlanningSection` → `data-calendar-section="planning"`
  
  3. **CSS: Modus-basierte Sichtbarkeit** (`styles/app.css` ~L7293):
     - `.cal-mode-tabs` Container-Styles
     - `.cal-mode-tab` und `.cal-mode-tab--active` Button-Styles
     - `body[data-calendar-mode="planning"] [data-calendar-section="personal"]` → `display: none`
     - `body[data-calendar-mode="planning"] [data-calendar-section="planning"]` → `display: block`
     - Planning-Mode-Indikator auf Grid ("Klicke auf Tage...")
     - Light-Theme Support
  
  4. **JavaScript: Mode State Management** (`app.js` ~L15721):
     - `calendarMode` Variable (`"personal"` | `"planning"`)
     - `CALENDAR_MODE_KEY` für localStorage-Persistierung
     - `loadCalendarMode()` → Lädt beim Startup
     - `saveCalendarMode()` → Speichert bei Änderung
     - `setCalendarMode(mode)` → Wechselt Modus, auto-enabled Sharing im Planning-Modus
     - `applyCalendarModeUI()` → Setzt `data-calendar-mode` auf body, updated Tab-States
  
  5. **JavaScript: Grid-Klick-Verhalten** (`app.js` ~L27780):
     - Personal Mode: Klick auf Tag navigiert zur Wochenansicht
     - Planning Mode: Klick auf Tag togglet Verfügbarkeit (wie bisher)
  
  6. **JavaScript: Event Handlers** (`app.js` ~L27360):
     - Tab-Buttons rufen `setCalendarMode()` auf

  ### Workflow-Erweiterung
  
  Der bestehende Availability-Workflow (siehe oben) bleibt vollständig erhalten. Die Tab-Trennung fügt nur einen neuen UI-Einstiegspunkt hinzu:
  
  ```
  User wechselt zu "Gemeinsam planen" Tab
       ↓
  setCalendarMode("planning")
       ↓
  applyCalendarModeUI() → body bekommt data-calendar-mode="planning"
       ↓
  CSS versteckt Personal-Sektionen, zeigt Planning-Sektion
       ↓
  Auto-Enable: saveCommonFreeSlotsSharing(true) → Sharing wird aktiviert
       ↓
  renderCommonFreeSlots() → Panel wird sichtbar
       ↓
  Grid-Klicks togglen jetzt Verfügbarkeit
  ```

  ### Neue Funktionen
  
  | Funktion | Datei | Zweck |
  |----------|-------|-------|
  | `loadCalendarMode()` | app.js | Lädt gespeicherten Modus aus localStorage |
  | `saveCalendarMode()` | app.js | Speichert Modus in localStorage |
  | `setCalendarMode(mode)` | app.js | Wechselt Modus, updated UI, auto-enables Sharing |
  | `applyCalendarModeUI()` | app.js | Setzt data-Attribute und Tab-States |

  - Zuständige Dateien: `app.js`, `index.html`, `styles/app.css`.

---

## Aktuelle Änderungen (2026-02-24)

- **AI-Chat-History Persistierung** `#ai` `#chat` `#persistence`: Der AI-Chatverlauf wird jetzt in localStorage gespeichert und bleibt auch nach Seiten-Reload erhalten.
  1. **Neue Konstante `AI_CHAT_HISTORY_KEY`** (`app.js` ~L2597): localStorage-Key für Chat-History.
  2. **`saveAiChatHistory()`** (`app.js` ~L2602): Serialisiert `aiChatHistoryByContext` Map nach JSON und speichert in localStorage. Begrenzt auf max. 50 Einträge pro Kontext.
  3. **`loadAiChatHistory()`** (`app.js` ~L2617): Lädt Chat-History aus localStorage beim Startup, stellt auch `aiChatSeq` Counter wieder her.
  4. **Auto-Save bei Änderungen**: `clearAiChatHistoryForContext`, `deleteAiChatEntryById` und `addAiChatEntry` rufen jetzt `saveAiChatHistory()` auf.
  5. **Startup-Integration** (`app.js` ~L28015): `loadAiChatHistory()` wird in `initStartupTasks()` vor `syncAiChatContext()` aufgerufen.
  - Zuständige Funktionen: `saveAiChatHistory`, `loadAiChatHistory`, `clearAiChatHistoryForContext`, `deleteAiChatEntryById`, `addAiChatEntry`, `initStartupTasks`.
  - Zuständige Dateien: `app.js`.

- **AI-Output-Größenerweiterung für lange Antworten** `#ai` `#ui` `#output`: Lange AI-Text-Ausgaben (z.B. generierter Code) werden jetzt korrekt mit erweiterten Größenlimits dargestellt, sodass der vollständige Inhalt sichtbar ist.
  1. **`updateRunOutputSizing()` erweitert** (`app.js` ~L11062): Neue `isAiText`-Erkennung für `source === "ai"`. AI-Text-Outputs erhalten jetzt basePx=320 (statt 160) und 85%/90% Panel-/Window-Anteil (statt 65%/70%).
  2. **`updateRunOutputUi()` setzt CSS-Klasse** (`app.js` ~L11051): Neue `.is-ai-output`-Klasse wird auf `#runOutput` gesetzt wenn `source === "ai"` oder `source === "ai-image"`.
  3. **Mobile CSS erweitert** (`styles/app.css` ~L2467): `#runOutput.is-ai-output` erhält wie Bild-Outputs `max-height: 70vh` statt der bisherigen 120px-Begrenzung.
  4. **Tailwind max-h-40 entfernt** (`index.html` ~L1565): Festes 160px-Limit entfernt, JS-basiertes dynamisches Sizing kann jetzt greifen.
  5. **Default CSS-Regel für #runOutput** (`styles/app.css` ~L117): Basis-Sizing mit `overflow: auto` und `-webkit-overflow-scrolling: touch` für Scrollbar-Unterstützung.
  6. **AI-Token-Limit erhöht** (`server.js` ~L205): `AI_MAX_OUTPUT_TOKENS` von 900 auf 4096 erhöht. `AI_TIMEOUT_MS` von 30s auf 60s erhöht für längere Generierungen.
  - Zuständige Funktionen: `updateRunOutputSizing`, `updateRunOutputUi`.
  - Zuständige Dateien: `app.js`, `styles/app.css`, `index.html`, `server.js`.

- **Fix: Shared Room Content-Sync für neue User** `#shared` `#sync` `#bug`: User ohne Personal Space sahen den existierenden Inhalt einer geteilten Notiz erst nachdem sie selbst schrieben. Ursache: `applyRemoteText()` und `applySyncedText()` blockierten das Übernehmen von Remote-Content wenn lokaler Content leer war.
  1. **`applySyncedText()` mit `force`-Option erweitert** (`app.js` ~L20954): Neuer `opts.force`-Parameter umgeht den `offlineSyncInFlight`-Guard.
  2. **`applyRemoteText()` setzt `force: true` bei leerem Content** (`app.js` ~L21195): Wenn der lokale Editor leer ist (neuer User im Raum), wird `force: true` gesetzt um den Remote-Content sofort zu übernehmen.
  - Zuständige Funktionen: `applySyncedText`, `applyRemoteText`.
  - Zuständige Dateien: `app.js`.

- **Fix: Kalender-Availability-Sync in geteilten Räumen** `#calendar` `#availability` `#sync` `#bug`: Die ausgewählten Tage im "Gemeinsame Planung"-Kalender wurden nicht zwischen Teilnehmern synchronisiert — jeder sah nur seine eigenen Auswahlen. Ursache: `manualFreeSlots` (ausgewählte Tage) wurde nur lokal gespeichert, nicht via WebSocket übertragen.
  1. **Client: `selectedDays` zu `broadcastAvailability()` hinzugefügt** (`app.js` ~L19479): Die Funktion sendet jetzt ein `selectedDays`-Array mit allen explizit ausgewählten Tagen (YYYY-MM-DD Format).
  2. **Client: `handleAvailabilityState()` parst `selectedDays`** (`app.js` ~L19547): Empfangene `selectedDays` werden im `availabilityByClient`-Map gespeichert.
  3. **Client: `getParticipantsAvailabilityForDay()` nutzt `selectedDays`** (`app.js` ~L19654): Die Primär-Prüfung für Teilnehmerverfügbarkeit basiert jetzt auf den explizit ausgewählten Tagen statt auf Busy-Intervall-Inferenz.
  4. **Server: `availability_state`-Handler speichert `selectedDays`** (`server.js` ~L6115): Neue Validierung (max 60 Tage, YYYY-MM-DD Format) und Persistierung im `roomAvailabilityState`.
  5. **Server: Initial-State und `request_state` senden `selectedDays`** (`server.js` ~L5771, ~L6458): Neue Clients erhalten die ausgewählten Tage aller Teilnehmer beim Verbinden.
  - Zuständige Funktionen: `broadcastAvailability`, `handleAvailabilityState`, `getParticipantsAvailabilityForDay` (Client), `availability_state`-Handler, Initial-State, `request_state` (Server).
  - Zuständige Dateien: `app.js`, `server.js`.

- **Gemeinsame Planung: Erweiterte Teilnehmer- und Tage-Anzeige** `#calendar` `#availability` `#ux`: Die "Gemeinsame Planung"-Sektion in der Kalender-Sidebar zeigt jetzt detaillierte Informationen zu Teilnehmern und deren ausgewählten Tagen.
  1. **Neue Funktion `computeCommonSelectedDays()`** (`app.js` ~L19656): Berechnet die Schnittmenge aller `selectedDays` über alle Teilnehmer hinweg. Gibt `commonDays` (gemeinsame Tage) und `perParticipant` (Tage pro Teilnehmer) zurück.
  2. **Erweiterte Teilnehmer-Chips** (`app.js` ~L19797): Jeder Teilnehmer-Chip zeigt jetzt die Anzahl der ausgewählten Tage an (`X Tage`). Eigener User wird mit `(du)` markiert.
  3. **Gemeinsame Tage Sektion** (`app.js` ~L19820): Wenn alle Teilnehmer mindestens einen gemeinsamen Tag haben, wird eine "Gemeinsame Tage"-Liste mit grünen Chips angezeigt.
  4. **Teilnehmer-Tage Fallback** (`app.js` ~L19835): Wenn keine gemeinsamen Tage existieren, werden die ausgewählten Tage jedes anderen Teilnehmers einzeln aufgelistet.
  5. **Verbesserte Panel-Sichtbarkeit** (`app.js` ~L19785): Das Panel wird jetzt auch angezeigt wenn der User seinen Sharing-Toggle aktiviert hat, unabhängig davon ob andere bereits teilen.
  6. **CSS-Styles für `.common-day-chip`** (`styles/app.css` ~L6742): Neue Styles für die grünen Tag-Chips in der Gemeinsame-Tage-Liste.
  7. **i18n-Strings** (`app.js`): Neue Strings `calendar.common.common_days` und `calendar.common.participant_days` für DE/EN.
  - Zuständige Funktionen: `computeCommonSelectedDays`, `renderCommonFreeSlots`.
  - Zuständige Dateien: `app.js`, `styles/app.css`.

## Aktuelle Änderungen (2026-02-23)

- **Gemeinsame Zeit finden: Teilnehmer-Visualisierung im Kalender-Grid** `#calendar` `#availability` `#shared`: Die Verfügbarkeit von Teilnehmern in geteilten Räumen wird jetzt direkt in den Kalender-Grid-Zellen (Tag/Woche/Monat) visuell dargestellt. Farbige User-Dots zeigen auf einen Blick, welche Teilnehmer an einem Tag verfügbar sind. Ein Badge zeigt die Schnittmenge an („alle frei" oder „X/Y verfügbar").
  1. **Neue Hilfsfunktion `getParticipantsAvailabilityForDay(day)`** (`app.js` ~L19525): Berechnet für jeden Teilnehmer die Verfügbarkeit eines Tages basierend auf den via WebSocket empfangenen Busy-Intervallen. Rückgabe: Array mit `{clientId, name, color, isAvailable}` sowie `allAvailable`/`someAvailable`-Flags.
  2. **Neue Render-Funktion `renderParticipantIndicators(day)`** (`app.js` ~L19590): Erzeugt HTML mit farbigen Dots pro Teilnehmer (Opacity 1 = verfügbar, 0.35 = beschäftigt) und Badge für Schnittmenge (grün = alle frei, gelb = teilweise).
  3. **Day-View erweitert** (`app.js` ~L19722): Am Anfang des Day-Grids werden die Participant-Indikatoren angezeigt.
  4. **Week-View erweitert** (`app.js` ~L19800): Jede Tageszelle zeigt Participant-Indikatoren unterhalb des Datums-Headers.
  5. **Month-View erweitert** (`app.js` ~L19865): Jede Tageszelle zeigt Participant-Indikatoren unterhalb des Datums-Headers.
  6. **Handler-Update für Live-Aktualisierung** (`app.js` ~L19438): `handleAvailabilityState()` und `handleAvailabilityLeave()` rufen nun `renderCalendarPanel()` auf, wenn der Kalender aktiv ist, damit neue Verfügbarkeitsdaten sofort im Grid reflektiert werden.
  7. **CSS-Styles** (`styles/app.css` ~L6743): Neue Styles für `.participant-indicators`, `.participant-dot`, `.participant-badge`, `.participant-badge--all`, `.participant-badge--partial`. Tageszellen mit „alle verfügbar" erhalten einen subtilen grünen Hintergrund via `:has(.participant-badge--all)`.
  8. **i18n** (`app.js`): Neue Strings `calendar.grid.all_available` und `calendar.grid.partial_available` für DE/EN.
  - Zuständige Funktionen: `getParticipantsAvailabilityForDay`, `renderParticipantIndicators`, `renderCalendarPanel`, `handleAvailabilityState`, `handleAvailabilityLeave`.
  - Zuständige Dateien: `app.js`, `styles/app.css`.

- **Kalender Mobile UX kompakter + schließbar** `#calendar` `#mobile` `#ux`: Die mobile Kalenderansicht wurde deutlich verdichtet und kann jetzt direkt per X-Button geschlossen werden, um schnell zu Tabs/Räumen zurückzukehren.
  1. **Mobile Close-Button** (`index.html` ~L1639, `app.js` ~L25755): Neuer `#calendarCloseMobile` im Header; Handler setzt `setCalendarPanelActive(false)`.
  2. **Sichtbarkeit nur im Kalenderzustand** (`styles/app.css` ~L2278): `#calendarCloseMobile` wird nur bei `body.mobile-calendar-open` angezeigt.
  3. **Phone-Layout kompakter** (`styles/app.css` ~L2643): Engere Header-Abstände, kleinere Controls, reduzierte Grid/Sidebar-Paddings, kleinere Listenhöhen.
  4. **Ultra-Kompakt für sehr kleine Geräte** (`styles/app.css` ~L2751): Zusätzliche Regeln für `<390px` Viewport (30px Controls, engeres Spacing, dichtere Tageszellen).
  - Zuständige Dateien: `index.html`, `app.js`, `styles/app.css`.

- **Kalender-Sidebar auf Phones entrümpelt** `#calendar` `#mobile` `#sidebar`: Zur Übersichtsgewinnung ist der Block „Meine Kalender“ inkl. Bundesland-Auswahl in der Phone-Ansicht ausgeblendet; „Gemeinsame Planung“ bleibt erhalten.
  1. **Gezielte Section-ID** (`index.html` ~L1689): `#calendarSidebarCalendarsSection` ergänzt.
  2. **Mobile-Ausblendung** (`styles/app.css` ~L2666): `#calendarSidebarCalendarsSection`, `#calendarBundeslandWrap`, `#calendarLegend`, `#calendarStatus`, `#calendarRefresh` auf Phone ausgeblendet.
  - Zuständige Dateien: `index.html`, `styles/app.css`.

- **Mobile Startup/Ladezeit massiv beschleunigt (Reihenfolge optimiert)** `#mobile` `#performance` `#startup`: Nicht-kritische Initialisierungen werden auf mobilen Geräten nicht mehr im kritischen Startpfad ausgeführt, sondern idle/verzögert nachgeladen.
  1. **Deferred Startup Helper** (`app.js` ~L5034): `runDeferredStartupTask(task, opts)` mit `requestIdleCallback`-Fallback.
  2. **Nicht-kritische Tasks auf Mobile verschoben** (`app.js` ~L27007): `initAutoBackup`, `initAutoImport`, `startPsPolling`, `initAiDictation`, `loadCommentsForRoom`, `initBlockArrange`, `syncRoomSlotsFromServer` laufen gestaffelt nach Initial-Render.
  3. **Kalender-Open ohne doppelte Refresh-Last** (`app.js` ~L21490): Doppelte `refreshCalendarEvents(true)`-Ausführung beim Öffnen per Kalendertab entfernt.
  4. **Ressourcenpriorität angepasst** (`index.html` ~L23, ~L3424): `yjs.bundle.js` von `preload` auf `prefetch` umgestellt und Script mit `fetchpriority="low"` markiert.
  5. **Service Worker später registriert** (`index.html` ~L3426): Registrierung erst nach `load` + verzögert (`setTimeout`), um den initialen Main-Thread zu entlasten.
  6. **CDN-Verbindungsaufbau vorgezogen** (`index.html` ~L28): `preconnect` für `cdn.jsdelivr.net` ergänzt.
  - Zuständige Dateien: `app.js`, `index.html`.


## Feature-Analyse: Video-Upload & Preview-Wiedergabe (2026-02-22)

**Frage:** Ist es möglich, Videos hochzuladen (Server) und im Preview wiederzugeben?

**Antwort: Aktuell NEIN — aber ab diesem Commit implementiert.** Video-Upload und -Wiedergabe wurden mit folgenden Änderungen freigeschaltet:

### Implementierte Änderungen (2026-02-22)

| # | Datei | Änderung | Stelle |
|---|-------|----------|--------|
| **S1** | `server.js` | `isAllowedUploadMime()` akzeptiert jetzt `video/*` MIME-Types | [server.js](server.js#L1185) |
| **S2** | `server.js` | `extForMime()` kennt `.mp4`, `.webm`, `.ogg`, `.mov` | [server.js](server.js#L1190) |
| **S3** | `server.js` | `mimeTypeForPath()` liefert korrekte `Content-Type`-Header für Video-Dateien (`video/mp4`, `video/webm`, `video/ogg`, `video/quicktime`) | [server.js](server.js#L950) |
| **C1** | `app.js` | Neue `embedVideoLinks(html)` Funktion — ersetzt `<img>` und `<a>` mit Video-Erweiterungen durch `<video controls>` mit `<source>` + Fallback-Download-Link | [app.js](app.js#L11247) |
| **C2** | `app.js` | `buildPreviewContentHtml()` und `updatePreview()` pipen HTML durch `embedVideoLinks()` nach `embedPdfLinks()` | [app.js](app.js#L11442) |
| **C3** | `index.html` | Upload-File-Input akzeptiert `video/*` zusätzlich zu `image/*` und `application/pdf` | [index.html](index.html#L3094) |
| **C4** | `app.js` | `isAllowedUploadType()` akzeptiert `video/*` (vorher nur `image/*` + `application/pdf` → Client blockierte Upload) | [app.js](app.js#L1521) |
| **C5** | `app.js` | `buildUploadMarkdown()` erzeugt `![video](url)` für Video-MIME-Types (nötig für `embedVideoLinks`) | [app.js](app.js#L1511) |
| **C6** | `app.js` | Toast-Meldungen: „Nur Bilder, Videos oder PDFs sind erlaubt." (vorher: „Nur Bilder oder PDFs") | [app.js](app.js#L23475) |

### Nutzung

1. **Upload**: Upload-Modal → Datei wählen (`.mp4`, `.webm`, `.ogg`, `.mov`) → In Mirror einfügen
2. **Markdown-Syntax**: `![Mein Video](/uploads/xyz.mp4)` oder einfacher Link `[Video](/uploads/xyz.mp4)`
3. **Preview**: Video wird automatisch als `<video controls>` gerendert mit nativen Browser-Controls (Play, Pause, Lautstärke, Fullscreen)

### Bekannte Limitierungen

| Limitation | Detail |
|------------|--------|
| **Dateigröße** | Max `MIRROR_UPLOAD_MAX_MB` (Default 8 MB, max 50 MB). Für längere Videos ggf. erhöhen. |
| **Base64-Encoding** | Upload nutzt Data-URI im JSON-Body → 33% Overhead. Kein Streaming-Upload. |
| **Browserformat** | Nicht jeder Browser spielt jedes Format ab. `.mp4` (H.264) hat die beste Kompatibilität. `.mov` funktioniert primär in Safari. |
| **Kein Transcoding** | Videos werden 1:1 gespeichert, kein Server-seitiges Transcoding. |

---

## Aktuelle Änderungen (2026-02-22)

- **Video-Upload & Preview-Wiedergabe** `#upload` `#video` `#preview`: Videos können jetzt über das Upload-Modal hochgeladen und im Markdown-Preview als `<video controls>` abgespielt werden. Unterstützte Formate: MP4, WebM, OGG, MOV.
  1. **Server: MIME-Filter erweitert** (`server.js` ~L1185): `isAllowedUploadMime()` akzeptiert `video/*` zusätzlich zu `image/*` und `application/pdf`.
  2. **Server: Extension-Mapping** (`server.js` ~L1190): `extForMime()` kennt `.mp4`, `.webm`, `.ogg`, `.mov`.
  3. **Server: Static-Serving MIME** (`server.js` ~L950): `mimeTypeForPath()` liefert korrekte `Content-Type`-Header für Video-Dateien.
  4. **Client: `embedVideoLinks()`** (`app.js` ~L11247): Neue Post-Processing-Funktion (analog zu `embedPdfLinks`). Erkennt `<img>`- und `<a>`-Tags mit Video-Erweiterungen und ersetzt sie durch `<video controls>` mit `<source>` + Fallback-Download-Link. Responsive Styling (max-width:100%, border-radius).
  5. **Client: Preview-Pipeline** (`app.js` ~L11442, ~L11528): `buildPreviewContentHtml()` und `updatePreview()` pipen HTML durch `embedVideoLinks()` nach `embedPdfLinks()`.
  6. **Upload-Modal: Accept erweitert** (`index.html` ~L3094): File-Input akzeptiert `video/*`.
  7. **Client: MIME-Filter erweitert** (`app.js` ~L1521): `isAllowedUploadType()` akzeptiert `video/*` — vorher blockierte der Client den Upload vor dem Server-Request.
  8. **Client: Markdown-Builder** (`app.js` ~L1511): `buildUploadMarkdown()` erzeugt `![video](url)` für Video-MIME-Types, damit `embedVideoLinks()` greift.
  9. **Client: Toast-Meldungen** (`app.js` ~L23475): „Nur Bilder, Videos oder PDFs sind erlaubt." statt „Nur Bilder oder PDFs".
  - Zuständige Funktionen: `isAllowedUploadMime`, `extForMime`, `mimeTypeForPath`, `embedVideoLinks`, `buildPreviewContentHtml`, `updatePreview`, `isAllowedUploadType`, `buildUploadMarkdown`.
  - Zuständige Dateien: `server.js`, `app.js`, `index.html`.

- **Auto-Tag-Generator nur bei Erst-Erstellung aktiv (per-Note Lock)** `#ps` `#tags` `#auto-tag` `#override`: Der Auto-Tag-Generator (`classifyText`/`mergeManualTags`) läuft nur noch beim allerersten Speichern einer Notiz (POST). Sobald die Notiz existiert (in Editor geladen oder nach POST-Response), wird `psEditingNoteTagsOverridden = true` gesetzt. Jeder folgende Save sendet den `__manual_tags__`-Marker → Server überspringt Auto-Tag-Recomputation. Damit kann der Auto-Tag-Generator beim Bearbeiten von Tags nicht mehr „dazwischenfunken".
  1. **`applyNoteToEditor`** (`app.js` ~L13443): `psEditingNoteTagsOverridden = true` statt `rawTags.some(marker)`. Existierende Notizen werden sofort als manuell-überschrieben behandelt.
  2. **`syncPsEditingNoteFromEditorText`** (`app.js` ~L13401): Gleiche Änderung — Notiz per Text-Match gefunden → sofort `true`.
  3. **`savePersonalSpaceNote` POST-Response** (`app.js` ~L24341): Nach `syncPsEditingNoteTagsFromState()` wird `psEditingNoteTagsOverridden = true` gesetzt, damit alle weiteren Saves (Auto-Save, manuell) den Marker enthalten.
  4. **`togglePinnedForNote`** (`app.js` ~L13170): Override bleibt nach Pin-Toggle `true`, wird nicht durch Server-Response zurückgesetzt.
  5. **`syncPsEditingNoteTagsFromState` Guard verstärkt** (`app.js` ~L2406): Akzeptiert jetzt `opts.force`-Parameter. Wenn `psEditingNoteTagsOverridden = true` und **nicht** `force`, wird der gesamte Tag-Sync übersprungen (nur Pinned-State wird synchronisiert). Vorher wurde nur geschützt wenn der Server den Marker noch nicht hatte — bei vorherigem Save mit Marker wurde der Guard umgangen und `refreshPersonalSpace`-Polling überschrieb lokale Tag-Änderungen (Category, Subcategory, manuelle Tags) mit veraltetem Server-Stand. Nur `updateNotesForTagChange` (Tag-Kontextmenü) übergibt `{ force: true }`.
  6. **3-Tag-Limit nur für Auto-Tags, nicht für User-Tags** (`server.js` ~L1399): `normalizeImportTags` akzeptiert jetzt optionalen `limit`-Parameter (Default: 3). `splitManualOverrideTags` prüft **vor** der Normalisierung ob der `__manual_tags__`-Marker im Payload ist: wenn ja → `limit=50` (User-kuratierte Tags werden vollständig erhalten), wenn nein → `limit=3` (Auto-Tag-Cap bleibt). Vorher wurden User-Tags wie `cat:custom` bei ≥3 regulären Tags stillschweigend abgeschnitten.
  - Zuständige Funktionen: `applyNoteToEditor`, `syncPsEditingNoteFromEditorText`, `savePersonalSpaceNote`, `togglePinnedForNote`, `syncPsEditingNoteTagsFromState`, `updateNotesForTagChange`, `normalizeImportTags`, `splitManualOverrideTags`.
  - Zuständige Dateien: `app.js`, `server.js`.

## Aktuelle Änderungen (2026-02-21)

- **Fix: Tag-Löschen/Umbenennen via Kontextmenü wirkungslos** `#ps` `#tags` `#bug` `#context-menu`: Tags ließen sich über das Tag-Kontextmenü (Rechtsklick → Löschen/Umbenennen) nicht ändern — Toast bestätigte zwar "Updated", aber die Tags blieben in der DB unverändert. Ursache: `normalizeImportTags()` hatte ein Hard-Limit von **3 regulären Tags** und verwendete `break` zum Abbruch der Schleife. Bei Notizen mit ≥3 Tags (z. B. `["note", "2026", "february", "__manual_tags__"]`) verließ `break` die Schleife bevor `__manual_tags__` am Array-Ende gelesen wurde → Server erkannte `override = false` → verwendete alte DB-Tags statt die neuen.
  1. **System-Marker vom Tag-Limit ausgenommen** (`server.js` ~L1395): Neue Konstante `SYSTEM_TAG_MARKERS = new Set(["__manual_tags__", "pinned"])`. `normalizeImportTags` sammelt System-Marker in separatem Array und zählt sie nicht gegen das 3-Tag-Limit. Reguläre Tags werden nach 3 Stück per `continue` übersprungen (statt `break`), sodass die Schleife System-Marker am Array-Ende weiterhin erreicht.
  - Zuständige Funktionen: `normalizeImportTags`, `splitManualOverrideTags`.
  - Zuständige Dateien: `server.js`.

- **Auto-Tag Blacklist** `#ps` `#tags` `#blacklist` `#auto-tag`: Neue erweiterbare Blacklist für Tags, die von der automatischen Klassifizierung (`classifyText`) nie vergeben werden sollen. Aktuell geblockt: `markdown`, `yaml`. Die Blacklist ist zentral definiert und leicht erweiterbar.
  1. **Server-Blacklist** (`server.js` ~L1216): Neue Konstante `AUTO_TAG_BLACKLIST = new Set(["markdown", "yaml"])`. `classifyText()` filtert blacklisted Tags vor der Rückgabe. `mergeManualTags()` entfernt sie ebenfalls aus dem Merge-Ergebnis.
  2. **Client-Blacklist** (`app.js` ~L5075): Spiegelkonstante `AUTO_TAG_BLACKLIST`. `rebuildPsTagsFromNotes()` filtert blacklisted Tags aus dem Tag-Panel. `splitTagsForEditor()` überspringt sie beim Laden in den Editor. `renderPsList()` blendet sie in der Notizliste aus.
  - Zuständige Funktionen: `classifyText`, `mergeManualTags`, `rebuildPsTagsFromNotes`, `splitTagsForEditor`, `renderPsList`.
  - Zuständige Dateien: `server.js`, `app.js`.

- **Auto-Tag nur bei Erst-Erstellung, keine Überschreibung eigener Tags** `#ps` `#tags` `#race-condition` `#auto-tag`: Auto-Tags (z. B. `note`, `code`, `link`) werden jetzt ausschließlich beim ersten Erstellen einer Notiz vergeben. Danach können Benutzer eigene Tags anlegen, ohne dass diese durch Auto-Tags oder Refresh-Zyklen überschrieben werden. Ursache war eine Race-Condition: `refreshPersonalSpace()` (Polling, Visibility, Focus) rief `syncPsEditingNoteTagsFromState()` auf, die veraltete Server-Tags (ohne `__manual_tags__`-Marker) in den lokalen Editing-State übernahm und so den noch nicht gespeicherten Override-Flag sowie eigene Tags löschte.
  1. **Guard in `syncPsEditingNoteTagsFromState`** (`app.js` ~L2402): Wenn `psEditingNoteTagsOverridden = true` lokal gesetzt ist, aber der Server den `__manual_tags__`-Marker noch nicht hat, wird der Tag-Sync übersprungen (nur Pinned-State wird weiter synchronisiert). Damit bleiben lokale Tag-Änderungen bis zum erfolgreichen Server-Save erhalten.
  2. **Guard in `savePersonalSpaceNoteSnapshot`** (`app.js` ~L24410): Wenn die Text-Auto-Save-Response veraltete Tags (ohne Marker) liefert, aber lokal bereits ein Override aktiv ist, werden die lokalen Tags in `psState.notes` beibehalten statt durch die stale Server-Response überschrieben.
  - Zuständige Funktionen: `syncPsEditingNoteTagsFromState`, `savePersonalSpaceNoteSnapshot`.
  - Zuständige Dateien: `app.js`.

- **Basiskalender für nicht registrierte User** `#calendar` `#base` `#ux`: Kalender wird jetzt immer gerendert — auch wenn keine Kalenderquellen (ICS, Google, Outlook) verknüpft sind. Bisher zeigte `renderCalendarPanel()` ein Early-Return mit "Keine Kalenderquellen aktiv." und kein Kalender-Grid.
  1. **Early-Return entfernt** (`app.js` ~L19303): Die Bedingung `!sources.length && calendarState.localEvents.length === 0` als Abbruch wurde entfernt. Das Kalender-Grid (Monat/Woche/Tag) wird immer dargestellt, auch bei 0 Events.
  2. **Status-Text angepasst** (`app.js` ~L18001): `refreshCalendarEvents()` zeigt "Basiskalender aktiv." statt "Keine Kalenderquellen aktiv." wenn keine externen Quellen aber Feiertage vorhanden.
  3. **Legend-Hint** (`app.js` ~L18418): Legende zeigt `t("calendar.base.hint")` statt "Keine Kalender verbunden." bei leerem Zustand.
  - Zuständige Funktionen: `renderCalendarPanel`, `refreshCalendarEvents`, `renderCalendarLegend`.
  - Zuständige Dateien: `app.js`.

- **Feiertage & Schulferien mit Bundesland-Auswahl** `#calendar` `#holidays` `#vacations` `#bundesland`: Deutsche gesetzliche Feiertage und Schulferien werden im Kalender angezeigt. Nutzer wählen ein Bundesland aus einem Dropdown — die Auswahl wird geräteübergreifend synchronisiert.
  1. **Konstanten** (`app.js` ~L14949): `CALENDAR_BUNDESLAND_KEY`, `CALENDAR_HOLIDAYS_SOURCE` (Farbe: #ef4444), `CALENDAR_VACATION_SOURCE` (Farbe: #06b6d4), `BUNDESLAENDER`-Array (16 Bundesländer).
  2. **Feiertag-Berechnung** (`app.js` ~L18061): `computeEasterSunday(year)` (Anonymous Gregorian Algorithm), `getGermanHolidays(year, bl)` — alle bundesweiten + landesspezifischen Feiertage (Hl. Drei Könige, Fronleichnam, Buß- und Bettag, Reformationstag, Allerheiligen, Weltkindertag, Frauentag etc.).
  3. **Schulferien-Daten** (`app.js` ~L18160): `getGermanSchoolVacations(year, bl)` — Ferien für alle 16 Bundesländer, Datensätze für 2025 und 2026 (Winter-, Oster-, Pfingst-, Sommer-, Herbst-, Weihnachtsferien).
  4. **Event-Integration** (`app.js` ~L18370): `getHolidayEvents()` generiert Kalender-Events mit `isHoliday`/`isVacation`-Flags. `getCalendarEvents()` merged diese mit externen + lokalen Events.
  5. **Legende** (`app.js` ~L18467): `renderCalendarLegend()` zeigt Feiertage (rot) und Schulferien (cyan) mit Bundesland-Kürzel.
  6. **Bundesland-Selektoren** (`index.html` ~L1688, ~L2429): Dropdown im Kalender-Sidebar (`#calendarBundeslandSelect`) und in Einstellungen → Kalender (`#calendarSettingsBundesland`). Beide synchronisieren sich gegenseitig.
  7. **Persistenz & Sync** (`app.js`): `loadCalendarBundesland()`, `saveCalendarBundesland()` — localStorage + `getLocalCalendarSettings()` liefert `bundesland`-Feld → Server-Sync via `syncCalendarSettingsToServer()`. `applyCalendarSettings()` und `syncCalendarSettingsFromServer()` unterstützen das Bundesland-Feld.
  8. **i18n** (`app.js`): 14 neue Strings je Sprache (DE/EN) für `calendar.holidays.*`, `calendar.base.*`, `settings.calendar.holidays.*`.
  - Zuständige Funktionen: `computeEasterSunday`, `addDaysToDate`, `getGermanHolidays`, `getGermanSchoolVacations`, `getHolidayEvents`, `getCalendarEvents`, `renderCalendarLegend`, `renderCalendarPanel`, `refreshCalendarEvents`, `loadCalendarBundesland`, `saveCalendarBundesland`, `getLocalCalendarSettings`, `applyCalendarSettings`, `syncCalendarSettingsFromServer`, `initBundeslandSelectors`.
  - Zuständige Dateien: `app.js`, `index.html`.

## Aktuelle Änderungen (2026-02-20)

- **PsTransitionManager – prioritätsbasierter Orchestrator für psList-Rendering** `#ps` `#psList` `#race-condition` `#tabs` `#manager`: Ersetzt den einfachen Singleton-Guard durch einen vollständigen Transition-Manager, der den gesamten Lebenszyklus von Tab-Wechsel, Notiz-Auswahl, Background-Refresh und Debounced-Rerender orchestriert.
  1. **PsTransitionManager IIFE** (`app.js` ~L4921–4977): Prioritätsbasierte State-Machine mit 4 Typen: `tab-switch`(3) > `note-select`(2) > `refresh`(1) > `rerender`(0). Methoden: `begin(type)→gen|null`, `end(gen)`, `isActive(type?)`, `isBlocked(type)`, `requestRender()→bool`, `activeType()→string|null`. Höherpriore Operationen blockieren niederpriore. Queued Renders werden nach `end()` automatisch nachgeholt.
  2. **Snapshot-Restore in `_refreshPersonalSpaceImpl`** (`app.js` ~L14211): Vor dem API-Call werden `prevAuthed`/`prevNotes` gespeichert. Bei transientem Fehler (nicht-offline, vorherige Daten valide) wird der vorherige State beibehalten statt auf `{authed:false, notes:[]}` zu nullen. Damit bleiben Notizen in der psList sichtbar auch bei kurzzeitigen Netzwerkfehlern.
  3. **hashchange: Tab-Switch Transition** (`app.js` ~L21955): Gesamter hashchange-Handler mit `psTransition.begin("tab-switch")` / `.end(tsGen)` umschlossen. Async-Pfad (`refreshPersonalSpace().then(...)`) tracked mit `asyncRefreshActive`-Flag und `.finally()` für garantiertes `end()`.
  4. **schedulePsAutoRefresh Guard** (`app.js` ~L22136): `psTransition.isBlocked("refresh")` verhindert Auto-Refresh während höherpriorer Tab-Switch-Transition.
  5. **schedulePsListRerender Guard** (`app.js` ~L8956): `psTransition.requestRender()` deferred Render während aktiver Transition; Manager holt ihn nach `end()` automatisch nach.
  6. **refreshPersonalSpace Guard** (`app.js` ~L14206): `psTransition.isBlocked("refresh")` blockiert Refresh-Aufrufe während Tab-Switch.
  - Zuständige Funktionen: `psTransition` (IIFE), `refreshPersonalSpace`, `_refreshPersonalSpaceImpl`, `schedulePsListRerender`, `schedulePsAutoRefresh`, hashchange-Handler.
  - Zuständige Dateien: `app.js`.

- **Fix: psList-Notizen verschwinden bei Tabwechsel** `#ps` `#psList` `#race-condition` `#tabs`: Notizen verschwanden aus der `#psList`-Sidebar beim Wechsel zwischen Tabs und wurden erst nach Server-Reload wieder angezeigt. Ursache: Mehrere parallele `refreshPersonalSpace()`-Aufrufe (hashchange + visibilitychange + focus + polling) überschrieben sich gegenseitig `psState`. Bei fehlgeschlagenem API-Call wurde `psState.authed = false` gesetzt → `applyPersonalSpaceFiltersAndRender()` machte Early-Return → psList blieb leer.
  1. **Singleton-Guard `psRefreshPromise`** (`app.js`): Neue Variable `psRefreshPromise` verhindert parallele Ausführungen von `refreshPersonalSpace()`. Wenn bereits ein Refresh läuft, wird das existierende Promise zurückgegeben statt eine neue Ausführung zu starten. Die eigentliche Logik ist in `_refreshPersonalSpaceImpl()` ausgelagert.
  2. **`schedulePsListRerender` Guard** (`app.js`): `if (psRefreshPromise) return;` — verhindert Rendering des 120ms-Debounce-Timers während ein Refresh in-flight ist, da `psState` in diesem Moment inkonsistent sein kann.
  3. **`schedulePsAutoRefresh` Guard** (`app.js`): `if (psRefreshPromise) return;` — verhindert doppelte Refreshes durch simultane `visibilitychange` + `focus`-Events bei Tab-Rückkehr.
  - Zuständige Funktionen: `refreshPersonalSpace` ([app.js](app.js#L14129)), `_refreshPersonalSpaceImpl` ([app.js](app.js#L14135)), `schedulePsListRerender` ([app.js](app.js#L8881)), `schedulePsAutoRefresh` ([app.js](app.js#L22034)).
  - Zuständige Dateien: `app.js`.

- **Automatischer PS-Notizen-Sync zwischen Devices** `#ps` `#sync` `#offline` `#polling`: Personal-Space-Notizen werden jetzt automatisch zwischen Devices synchronisiert — ohne manuellen Reload. Zwei Mechanismen:
  1. **Visibility/Focus-Refresh** (`app.js`): Bei `visibilitychange` (Tab wird wieder aktiv) und `focus`-Events wird `schedulePsAutoRefresh()` aufgerufen, das `refreshPersonalSpace()` triggert. Damit lädt Device B sofort neue Notizen vom Server, sobald der Tab wieder fokussiert wird.
  2. **Periodisches Polling** (`app.js`): `startPsPolling()` startet einen 60-Sekunden-Intervall-Timer. Nur wenn Tab sichtbar und online, wird `refreshPersonalSpace()` aufgerufen. Damit werden neue Notizen auch bei langem Offenbleiben eines Tabs synchronisiert.
  3. **Debounce** (5s): `PS_REFRESH_DEBOUNCE_MS` verhindert, dass `refreshPersonalSpace()` öfter als alle 5 Sekunden aufgerufen wird. `psLastRefreshTs` wird sowohl bei Auto- als auch manuellen Refreshes gesetzt.
  4. **Offline-Sync-Guard**: `schedulePsAutoRefresh()` blockiert während `offlineSyncInFlight === true`, damit die IndexedDB nicht geleert wird bevor Offline-Ops replayed wurden.
  - Zuständige Funktionen: `schedulePsAutoRefresh` ([app.js](app.js#L21986)), `startPsPolling` ([app.js](app.js#L21995)), `stopPsPolling` ([app.js](app.js#L22003)).
  - Zuständige Dateien: `app.js`.

- **IndexedDB Full-Sync: Ghost-Notizen bereinigt** `#offline` `#sync` `#indexeddb`: `offlinePutNotes()` war bisher nur additiv — Notizen, die auf dem Server gelöscht wurden, blieben als Ghost-Einträge in der IndexedDB anderer Devices. Das führte zu unterschiedlichen Notizen-Anzahlen zwischen Devices, besonders bei Offline/Online-Wechseln.
  1. **Full-Sync statt additiv** (`app.js`): `offlinePutNotes()` ruft jetzt `store.clear()` vor dem Einfügen auf. Damit wird die IndexedDB bei jedem Online-Refresh komplett durch den Server-Stand ersetzt.
  2. **Leere Server-Antwort berücksichtigt** (`app.js`): Die `notes.length`-Guard im Mirror-Aufruf in `refreshPersonalSpace()` wurde entfernt. Wenn der Server 0 Notizen zurückgibt (alle gelöscht), wird die IndexedDB korrekt geleert.
  3. **Leeres Array akzeptiert** (`app.js`): `offlinePutNotes()` akzeptiert leere Arrays und führt dann nur `clear()` aus.
  - Zuständige Funktionen: `offlinePutNotes` ([app.js](app.js#L6728)), `refreshPersonalSpace` ([app.js](app.js#L14084)).
  - Zuständige Dateien: `app.js`.

## Aktuelle Änderungen (2026-02-16)

- **AI-Bild: Upload, Mirror-Einfügen, vergrößerter Ausgabebereich** `#ai` `#image` `#upload` `#ux`: Generierte FLUX.2-Bilder können jetzt in Uploads gespeichert, in den Mirror-Editor eingefügt und heruntergeladen werden. Der Ausgabebereich ist deutlich größer.
  1. **3 Aktions-Buttons** (`app.js`): ⬇ Download, 📁 In Uploads speichern (`/api/uploads` POST), ✏️ In Mirror einfügen (Auto-Upload → `![image](url)` via `insertTextAtCursor`).
  2. **Vergrößerter Output** (`app.js`, `app.css`): `updateRunOutputSizing` nutzt für `ai-image` Quelle Base 480px und 85% Budget statt 160px/65%. Mobile CSS: `#runOutput:has(img)` bekommt `max-height: 70vh`. Bild-`max-height` Limit (512px) entfernt.
  3. **Upload-Workflow**: „In Mirror einfügen" führt automatisch erst den Upload durch (falls noch nicht erfolgt), dann wird das Markdown-Bild in die Textarea eingefügt.
  4. **i18n**: 9 neue Strings für DE/EN (Download, Upload, Insert, Status-Feedback).
  - Zuständige Dateien: `app.js` (Buttons, Event-Handler, Sizing), `app.css` (Mobile-Override).

- **BFL API-Key verschlüsselt pro Benutzer** `#ai` `#image` `#security` `#encryption`: BFL (FLUX.2) API-Key wird jetzt wie der Linear API-Key pro User verschlüsselt auf dem Server gespeichert (AES-256-GCM). Jeder Benutzer hinterlegt seinen eigenen Key in Einstellungen → Integrationen.
  1. **DB-Migration** (`server.js`): Neue Spalten `bfl_api_key_ciphertext`, `bfl_api_key_iv`, `bfl_api_key_tag` in `user_settings`.
  2. **Server-Funktionen** (`server.js`): `getUserBflApiKey(userId)` / `saveUserBflApiKey(userId, apiKey)` — nutzt dieselben `encryptLinearApiKey`/`decryptLinearApiKey`-Funktionen (gleicher Cipher-Key via `MIRROR_LINEAR_KEY_SECRET`).
  3. **API-Endpoints** (`server.js`): `GET /api/bfl-key` (liest entschlüsselten Key), `POST /api/bfl-key` (speichert verschlüsselt).
  4. **Key-Fallback** in `/api/ai/image`: Request-Body `apiKey` → User-DB-Key → Env `BFL_API_KEY`.
  5. **Frontend** (`index.html`, `app.js`): Neuer BFL-Key-Bereich in Einstellungen → Integrationen (nach Linear) mit Input, Speichern/Löschen-Buttons, Status-Anzeige. Funktionen: `saveBflApiKeyToServer`, `syncBflApiKeyFromServer`, `readBflApiKeyInput`, `updateBflApiStatus`. i18n DE/EN.
  6. **Image-Request bereinigt**: Frontend sendet keinen API-Key mehr im Request-Body, Server liest den Key selbst aus der DB.
  - Zuständige Dateien: `server.js`, `app.js`, `index.html`.

- **AI-Bildgenerierung via FLUX.2 (Black Forest Labs)** `#ai` `#image` `#flux`: Neuer AI-Modus „Bild generieren" in der bestehenden AI-Section. Nutzer gibt einen Text-Prompt ein und erhält ein KI-generiertes Bild direkt im AI-Output-Bereich.
  1. **Server-Endpoint `/api/ai/image`** (`server.js`): Neuer POST-Endpoint mit Authentifizierung, Rate-Limiting und asynchronem Submit/Poll/Download-Pattern gegen die BFL API (`https://api.bfl.ai/v1/{model}`). Da BFL-Delivery-URLs kein CORS unterstützen, wird das Bild serverseitig heruntergeladen und als Base64-Data-URI an den Client zurückgegeben.
  2. **AI-Modus `image`** (`index.html`): Neue `<option value="image">` im `#aiMode`-Select mit 🎨-Icon.
  3. **Frontend-Logic** (`app.js`): `getAiMode()` akzeptiert `"image"`. Neuer Branch in `aiAssistFromPreview()` sendet Prompt an `/api/ai/image`, rendert das zurückgegebene Bild mit Download-Button im `#runOutput`-Bereich, trägt Generierung in Chat-History ein.
  4. **Konfiguration**: Env-Variablen `BFL_API_KEY` (erforderlich), `BFL_MODEL` (Standard: `flux-2-pro`), `BFL_IMAGE_TIMEOUT_MS` (Standard: 120000ms). Unterstützte Modelle: `flux-2-pro`, `flux-2-max`, `flux-2-flex`, `flux-2-klein-4b`, `flux-2-klein-9b`, `flux-pro-1.1-ultra` u.a.
  5. **i18n**: `preview.ai_mode.image` in DE („🎨 Bild generieren") und EN („🎨 Generate image").
  - Zuständige Dateien: `server.js` (Endpoint, BFL-Integration), `app.js` (Frontend-Logic, i18n), `index.html` (Select-Option).
  - Zuständige Funktionen: `aiAssistFromPreview` ([app.js](app.js#L13529)), `getAiMode` ([app.js](app.js#L13518)), `/api/ai/image`-Handler ([server.js](server.js#L4635)).

## Aktuelle Änderungen (2026-02-14)

- **Offline-Modus (PWA + IndexedDB)** `#offline` `#pwa` `#sync` `#ps`: Vollständiger Offline-Support für die App — Notizen können ohne Serververbindung erstellt, bearbeitet und gelesen werden. Änderungen werden bei Reconnect automatisch synchronisiert.
  1. **Service Worker** (`sw.js`): Stale-While-Revalidate-Strategie für alle statischen Assets (HTML, JS, CSS, Vendor-Dateien). Pre-cacht kritische Ressourcen bei Installation. API-/Upload-/WebSocket-Requests werden nicht gecacht.
  2. **PWA Manifest** (`manifest.json`): Web-App-Manifest für Standalone-Installation auf Desktop und Mobile. `display: standalone`, dunkles Farbschema.
  3. **IndexedDB Offline-Store**: Drei Object-Stores: `notes` (lokaler Notizen-Spiegel), `pendingOps` (Sync-Queue), `meta` (Email etc.). Notizen werden bei jedem `refreshPersonalSpace` in IndexedDB gespiegelt.
  4. **Offline-fähiges `savePersonalSpaceNote`**: Bei `navigator.onLine === false` wird die Notiz in IndexedDB gespeichert und eine `create`/`update`-Operation in die Sync-Queue eingereiht. AutoSave-Status zeigt „Offline gespeichert".
  5. **Offline-fähiges `savePersonalSpaceNoteSnapshot`**: Gleiche Logik für Snapshot-Saves (Auto-Save-Timer).
  6. **Offline-fähiges `refreshPersonalSpace`**: Bei Offline wird auf IndexedDB-Cache zurückgegriffen (Email + Notizen). Bei Online werden Notizen in IndexedDB gespiegelt.
  7. **Sync-Queue (`replayOfflineOps`)**: Bei `online`-Event und WebSocket-Reconnect werden ausstehende Operationen sequentiell zum Server gesendet. Temp-IDs (`offline_*`) werden durch Server-IDs ersetzt. Bei Erfolg wird die Queue geleert und ein Toast angezeigt.
     - **Retry-Logik mit Backoff**: Jede Operation hat einen `retries`-Zähler. Bei 5xx-Fehlern (502, 503 etc.) wird exponentieller Backoff angewendet (2s, 4s, 8s, 16s, 32s).
     - **Max Retries**: Nach 5 fehlgeschlagenen Versuchen wird die Operation aus der Queue entfernt und ein Fehler-Toast angezeigt.
     - **Einzelne Op-Löschung**: `offlineDeleteSingleOp(opId)` ermöglicht granulare Queue-Verwaltung statt `clearOps()`.
     - **404/409 Skip**: Operationen für gelöschte (404) oder duplizierte (409) Notizen werden übersprungen.
  8. **i18n**: `offline.now_offline`, `offline.back_online`, `offline.synced`, `offline.sync_failed`, `offline.saved_locally` in DE + EN.
  - Zuständige Dateien: `sw.js` (neu), `manifest.json` (neu), `app.js` (Offline-Store, Save-/Load-Anpassungen, Sync-Queue, i18n), `index.html` (Manifest-Link, SW-Registration), `server.js` (JSON-MIME-Type).
  - Zuständige Funktionen: `openOfflineDb`, `offlinePutNote`, `offlinePutNotes`, `offlineGetAllNotes`, `offlineDeleteNote`, `offlineEnqueueOp`, `offlineGetAllOps`, `offlineClearOps`, `offlineUpdateOp`, `offlineDeleteSingleOp`, `offlineSaveMeta`, `offlineLoadMeta`, `offlineSaveNote`, `replayOfflineOps`, `isAppOffline` (alle [app.js](app.js#L6371)).

- **Duplikat-Notizen-Schutz erweitert (Header-Vergleich)**: Ergänzt den bestehenden Volltext-Hash-Schutz um einen Header-basierten Duplikat-Check auf Client- und Server-Seite:
  1. **Client `findNoteByText` Header-Fallback**: Wenn kein exakter Volltextmatch gefunden wird, sucht die Funktion nach Notizen mit identischem Titel (erste nicht-leere Zeile, normalisiert). Nur bei genau einem Treffer wird die existierende Note zurückgegeben — verhindert Duplikate bei kleinen Textänderungen (Whitespace, Zeilenumbruch).
  2. **Client `schedulePsAutoSave` Sync-Recovery**: Wenn `psEditingNoteId` leer ist, wird `syncPsEditingNoteFromEditorText` aufgerufen bevor Auto-Save übersprungen wird. Damit wird ein verlorener ID-Bezug (z.B. durch Tab-Wechsel/CRDT-Sync) über den Header wiederhergestellt.
  3. **Server `title_hash`-Spalte**: Neue Spalte `title_hash` in der `notes`-Tabelle mit Index. Wird bei POST (Create), PUT (Update), Restore und Import gesetzt.
  4. **Server POST `/api/notes` Title-Hash-Check**: Nach dem contentHash-Check wird als Fallback per `stmtNoteGetByTitleHashUser` geprüft, ob bereits eine Note mit gleichem Header existiert. Bei Treffer wird die existierende Note zurückgegeben statt eine neue zu erstellen.
  - Zuständige Funktionen: `findNoteByText` ([app.js](app.js#L11997)), `schedulePsAutoSave` ([app.js](app.js#L21614)), `extractNoteFirstLine`/`computeNoteTitleHash` ([server.js](server.js#L1262)), POST `/api/notes` ([server.js](server.js#L3692)).

## Aktuelle Änderungen (2026-02-10)

- **Query-Engine für Personal-Space-Notizen** `#ps` `#search` `#filter` `#query`: Erweiterte Suchsyntax im PS-Suchfeld ermöglicht strukturierte Abfragen über alle Notizen. Nutzer können Tasks, Tags, Datumsbereiche, Notiztypen und Pin-Status filtern und erhalten ein aggregiertes Ergebnis-Panel mit allen passenden Tasks.
  - **Query-Parser** (`parseQueryTokens`): Zerlegt Sucheingabe in strukturierte Operatoren (`tag:`, `task:open`, `task:done`, `has:task`, `has:link`, `kind:`, `created:>`, `updated:<`, `pinned:`) und Freitext-Tokens. Unterstützt exakte Phrasen mit Anführungszeichen.
  - **Task-Extraktor** (`extractNoteTasks`): Extrahiert Markdown-Checkboxen (`- [ ]` / `- [x]`) mit Labeltext aus Notizen.
  - **Strukturierte Suche** (`noteMatchesStructuredQuery`): Filtert Notizen anhand der Query-Operatoren – lazy Task-Parsing für Performance.
  - **Query-Result-Panel** (`renderQueryResults`): Aggregiert Tasks über alle gefilterten Notizen in einem glasmorphen Panel (`#psQueryResults`) oberhalb der Notizliste. Zeigt offene/erledigte Zähler, Tag-Badges und Quellnotiz-Referenz. Klick auf einen Task öffnet die zugehörige Notiz im Editor.
  - **i18n**: `query.open`, `query.done`, `query.from_notes` in DE + EN. Search-Placeholder zeigt verfügbare Operatoren.
  - Zuständige Funktionen: `parseQueryTokens` ([app.js](app.js#L8435)), `extractNoteTasks` ([app.js](app.js#L8477)), `parseDatePrefix` ([app.js](app.js#L8491)), `isQueryMode` ([app.js](app.js#L8497)), `noteMatchesStructuredQuery` ([app.js](app.js#L8838)), `renderQueryResults` ([app.js](app.js#L8888)), `applyPersonalSpaceFiltersAndRender` ([app.js](app.js#L8966)).
  - Zuständige Dateien: `app.js`, `index.html` (Panel-HTML), `styles/app.css` (Query-Panel CSS).

- **Link-Symbol nach Shared-Room-Löschung entfernt** `#tabs` `#share` `#ws`: Wenn ein geteilter Raum über die Settings-Verwaltung entfernt wurde (`removeSharedRoom` / `clearSharedRooms`), konnte das Link-Symbol (🔗 `room-tab-link-badge`) im Tab sofort wieder erscheinen, weil WebSocket-Handler (`presence_state`, `room_pin_state`) den Raum automatisch als geteilt neu markierten. Fix: Neue `manuallyUnsharedRooms`-Set speichert explizit un-geteilte Räume. `markRoomShared` ignoriert automatisches Re-Marking für diese Räume. Beim Raumwechsel wird der Guard aufgehoben, damit ein erneuter Besuch frisch startet. Explizites Teilen (`markCurrentRoomShared`) löscht den Guard.
  - Zuständige Funktionen: `markRoomShared`, `removeSharedRoom`, `clearSharedRooms`, `markCurrentRoomShared`, hashchange-Handler (alle in `app.js`).

- **Permanent-Link Deaktivierung repariert**: `clearRoomPinnedEntry` löschte den Pin nur aus lokalen und Server-Pins, aber nicht aus den Shared-Pins (per WebSocket empfangene Einträge). Da `loadRoomPinnedEntries()` alle drei Quellen merged (shared + local + server), blieb der Pin in der Shared-Quelle erhalten und die UI zeigte „aktiv" obwohl der Toast „deaktiviert" meldete. Fix: `clearRoomPinnedEntry` ruft jetzt `clearSharedRoomPinnedEntry` auf, damit alle drei Quellen konsistent bereinigt werden.
  - Zuständige Funktion: `clearRoomPinnedEntry` ([app.js](app.js#L13802)).

- **Permanent-Link Info-Tooltip (Hover)**: Hover über den Permanent-Link-Button blendet nach 500ms ein kleines Tooltip-Fenster ein (gleicher Stil wie Kalender-Tagestermine, `tab-tooltip-layer`). Beim Verlassen verschwindet es sofort. Rechtsklick wird unterdrückt (kein Kontextmenü).
  - Zuständige Stelle: `togglePermanentLinkBtn` mouseenter/mouseleave-Handler ([app.js](app.js#L18607)).

- **Permanent-Link i18n**: Toast-Meldungen, Button-Labels und Info-Modal sind jetzt vollständig über `UI_STRINGS` (de/en) lokalisiert. HTML-Button trägt `data-i18n-title` und `data-i18n-aria` für automatische Sprachumschaltung.
  - Zuständige Strings: `editor.permalink`, `editor.permalink_active`, `toast.permalink_activated`, `toast.permalink_deactivated`, `permalink.info.title`, `permalink.info.message`.

- **Kommentar-Textmarkierung an Note-ID gebunden**: Textmarkierungen (Highlights) im Editor werden jetzt eindeutig der Note-ID zugeordnet. Jeder Kommentar speichert die `noteId` der Notiz, auf der er erstellt wurde. Neue zentrale Filterfunktion `getVisibleCommentItems()` unterscheidet zwei Kommentartypen:
  - **Raum-Kommentare** (ohne Textmarkierung): immer sichtbar im Raum – Counter, Liste, Overlay.
  - **Textmarkierung-Kommentare** (mit `selection` + `noteId`): nur sichtbar wenn die zugehörige Notiz aktiv ist – sonst weder im Counter noch in der Kommentarliste noch als Highlight im Editor.
  - Legacy-Kommentare (mit `selection`, ohne `noteId`) werden weiterhin immer angezeigt.
  - `renderCommentList` (Counter + Liste), `buildCommentOverlayHtml` (Highlights) und `updateCommentOverlay` nutzen alle `getVisibleCommentItems()` als zentrale Quelle.
  - Zuständige Funktionen: `getVisibleCommentItems` ([app.js](app.js#L2741)), `getCommentSelectionNoteId` ([app.js](app.js#L2500)), `normalizeCommentItems` ([app.js](app.js#L2595)), `buildCommentOverlayHtml` ([app.js](app.js#L2760)), `renderCommentList` ([app.js](app.js#L2951)), `addCommentFromDraft` ([app.js](app.js#L3125)).

- **Linear-Projekt für Gäste in geteilten Räumen**: Zwei Fehler behoben, die dazu führten, dass Gäste (ohne eigenen API-Key) beim Auswählen oder Aktualisieren eines via WebSocket geteilten Linear-Projekts den Fehler „API-Key fehlt" erhielten:
  1. **Apply-Button**: Sucht das Projekt jetzt zusätzlich in `linearProjectByNote` (via WebSocket empfangene Shared-Projekte), wenn es nicht in der lokalen `linearProjects`-Liste vorhanden ist. Gäste ohne API-Key rendern Tasks aus dem Cache (`linearDataByNote`) statt die Linear-API direkt aufzurufen.
  2. **Refresh-Button**: Gäste ohne API-Key senden per WebSocket `request_state` an den Server, um den gepufferten Linear-State (Projekt + Tasks) erneut zu empfangen, statt die Linear-API aufzurufen.
  - Zuständige Stellen: `linearProjectApplyBtn`-Handler ([app.js](app.js#L19640)), `linearRefreshBtn`-Handler ([app.js](app.js#L19680)).

- **Auto-Favorit für geteilte Räume**: Wenn ein Raum als geteilt markiert wird (`markRoomShared`), wird er automatisch als Favorit gespeichert. Damit kann der Nutzer einen geteilten Raum jederzeit wiederfinden – auch nach dem Schließen des Browsers oder dem Entfernen aus den Tabs. Die neue Funktion `ensureFavoriteForSharedRoom` prüft, ob der Raum bereits ein Favorit ist, und fügt ihn andernfalls hinzu (inkl. Server-Sync bei PS-Auth).
  - Zuständige Funktionen: `markRoomShared` ([app.js](app.js#L13478)), `ensureFavoriteForSharedRoom` ([app.js](app.js#L13498)).

## Aktuelle Änderungen (2026-02-09)

- **Duplikat-Notizen-Schutz**: Drei Maßnahmen gegen doppelte Notizen (gleicher Inhalt, verschiedene IDs):
  1. **Client-Mutex für manuelle Saves**: `psSaveNoteInFlight`-Flag verhindert, dass parallele manuelle `savePersonalSpaceNote`-Aufrufe gleichzeitig neue Notizen erstellen. Auto-Save (`auto:true`) ist nicht betroffen. Bei Fehler wird der Mutex im `catch`-Block freigegeben.
  2. **Server: Hash-Schutz für leere Notizen**: `computeNoteContentHash("")` gibt jetzt einen stabilen Hash (`sha256("__EMPTY_NOTE__")`) statt `""` zurück. Damit greift der `contentHash`-UNIQUE-Check auch für leere Notizen und verhindert mehrfache Empty-Notes pro User.
  3. **Mobile Note-Close: AutoSave-Reset**: `noteCloseMobile`-Handler ruft jetzt `resetPsAutoSaveState()` und leert `psAutoSaveLastSavedNoteId`/`psAutoSaveLastSavedText` nach `clearPsEditingNoteState()` auf, damit kein Timer mit veralteter ID weiterschreibt.
  - Zuständige Funktionen: `savePersonalSpaceNote` ([app.js](app.js#L20950)), `computeNoteContentHash` ([server.js](server.js#L1233)), `noteCloseMobile`-Handler ([app.js](app.js#L21665)).

- **Shared-Room App-Sync (Excalidraw, Excel, Linear)**: Drei Ursachen behoben, die dazu führten, dass iframes in geteilten Räumen nicht synchron geöffnet/geschlossen und positioniert wurden:
  1. Server sendet `room_pin_state` jetzt **vor** den App-States (`excalidraw_state`, `excel_state`, `linear_state`), damit Clients den Pin kennen bevor sie App-State verarbeiten. Zusätzlich wird `room_pin_state` auch gesendet wenn kein Pin existiert aber >1 Socket verbunden ist (mit `shared: true` Flag).
  2. `room_pin_state`-Handler ruft `syncExcalidrawForNote(noteId)` etc. mit der noteId aus der Nachricht statt `psEditingNoteId` auf, damit Guests den korrekten Room-Scope auflösen.
  3. `getExcalidrawNoteId()`, `getExcelNoteId()`, `getLinearNoteId()` verwenden in shared Rooms (`isRoomMarkedShared()`) immer den Room-Scope statt auf `psEditingNoteId` zurückzufallen. Damit senden und empfangen Owner und Guest denselben noteId-Key.
  4. `request_state`-Handler (Tab-Wechsel Re-Sync) sendet `room_pin_state` jetzt ebenfalls **vor** App-States und mit `shared: true`-Flag — gleiche Reihenfolge wie Initial-Connect.
  - Zuständige Funktionen: `getExcalidrawNoteId`, `getExcelNoteId`, `getLinearNoteId` ([app.js](app.js#L18542)), `room_pin_state`-Handler ([app.js](app.js#L17999)), Server Initial-State ([server.js](server.js#L4823)), Server `request_state` ([server.js](server.js#L5443)).
- **Shared-Room Kommentar-Sync (Markierung + Counter)**: Zwei Ursachen behoben, die dazu führten, dass Textmarkierungen und `commentCountBadge` beim Owner nicht angezeigt wurden obwohl der Client sie sah:
  1. `room_pin_state`-Handler ruft `markRoomShared()` jetzt immer auf wenn `shared`-Flag oder Pin vorhanden ist (nicht nur bei aktivem Permanent-Link). Damit kennen beide Seiten den Shared-Status.
  2. `presence_state`-Handler markiert den Room als shared wenn andere User anwesend sind (`presenceState` enthält fremde clientIds). Damit wird auch ohne Permanent-Link der Room-Scope für Kommentare verwendet und `comment_update`-WebSocket-Nachrichten nicht mehr wegen Scope-Mismatch verworfen.
  - Zuständige Funktionen: `room_pin_state`-Handler ([app.js](app.js#L17999)), `presence_state`-Handler ([app.js](app.js#L17838)), `getCommentScopeId` ([app.js](app.js#L2500)).

- Kommentar-Scope in geteilten Räumen: `getCommentScopeId()` priorisiert nun `room:` Scope wenn `isRoomMarkedShared()` true ist, bevor `note:` geprüft wird. Vorher sahen Eigentümer (mit PS-Note) und Besucher (ohne PS) unterschiedliche Scopes (`note:xxx` vs. `room:roomName`), weshalb Kommentare füreinander unsichtbar waren und der Counter (`commentCountBadge`) keine fremden Kommentare zählte. WebSocket `comment_update`-Nachrichten wurden wegen Scope-Mismatch ignoriert.
  - Zuständige Funktion: `getCommentScopeId` ([app.js](app.js#L2499)).
- Comment-Badge-Flicker bei Tab-Wechsel: `loadCommentsForRoom()` leert `commentItems` nur noch bei echtem Scope-Wechsel (`commentActiveNoteId !== scopeId`). Bei Reload desselben Scopes bleibt der alte Badge-Wert bis der Fetch abschließt, anstatt kurz auf 0 zu springen.
  - Zuständige Funktion: `loadCommentsForRoom` ([app.js](app.js#L2606)).
- Kommentar-Markierungsfarbe pro User: `buildCommentOverlayHtml` setzt jetzt inline `background`/`box-shadow` basierend auf `author.color` des jeweiligen Kommentars. Damit sind Markierungen verschiedener User visuell unterscheidbar. Ohne `author.color` greift der CSS-Fallback (Fuchsia).
  - Zuständige Funktion: `buildCommentOverlayHtml` ([app.js](app.js#L2708)).
- Erster Kommentar verschwindet in geteilten Räumen: Drei Race Conditions behoben:
  1. `scheduleCommentSave` persistiert jetzt sofort statt mit 400ms Delay, damit der Server-State aktuell ist bevor ein paralleles `loadCommentsForRoom` den lokalen State überschreibt.
  2. `loadCommentsForRoom` wartet auf laufende `commentSavePromise` bevor es den Server abfragt, damit kein veralteter State geladen wird.
  3. WebSocket `comment_update`-Handler ignoriert jetzt eigene Nachrichten (`msg.clientId === clientId`), damit der lokale State nicht durch die eigene Broadcast-Nachricht überschrieben wird.
  - Zuständige Funktionen: `scheduleCommentSave` ([app.js](app.js#L2645)), `persistCommentsForScope` ([app.js](app.js#L2655)), `loadCommentsForRoom` ([app.js](app.js#L2606)), WS-Handler `comment_update` ([app.js](app.js#L18010)).
- Kommentare an gepinnte Notiz gebunden: In geteilten Räumen mit Permanent-Link wird die `pinnedNoteId` an den Kommentar-Scope angehängt (`room:room:key:n:noteId`). Damit sind Kommentare, Counter und Overlay eindeutig der gepinnten Notiz zugeordnet. Bei Notiz-Wechsel (Pin ändern/entfernen) wird `loadCommentsForRoom()` aufgerufen, um Badge und Liste zu aktualisieren. Server-API akzeptiert optionalen `?noteId=`-Parameter für den erweiterten Scope.
  - Zuständige Funktionen: `getCommentScopeId` ([app.js](app.js#L2501)), `getCommentScopeRequestInfo` ([app.js](app.js#L2521)), `room_pin_state`-Handler ([app.js](app.js#L17986)), `togglePermanentLink`-Handler ([app.js](app.js#L18398)), Room-Comment-API ([server.js](server.js#L3760)).

## Aktuelle Änderungen (2026-02-08)

- CRDT-Sync für Gäste in Permalink-Räumen: `updateCrdtFromTextarea` blockiert nicht mehr durch `shouldSyncRoomContentNow()` – CRDT ist konfliktfrei, daher dürfen alle Clients (auch Gäste ohne aktive PS-Note) Änderungen senden und empfangen. User-Markierungen (`{ author: clientId }`) bleiben erhalten.
  - Zuständige Funktion: `updateCrdtFromTextarea` ([app.js](app.js#L17477)).
- PS-Notizenvorschau bei Remote-Sync: Wenn `applySyncedText` CRDT-Änderungen empfängt und eine gebundene Note existiert, wird `schedulePsListRerender()` aufgerufen, damit die PS-Liste sofort die aktualisierte Vorschau anzeigt.
  - Zuständige Funktion: `applySyncedText` ([app.js](app.js#L17357)).
- Room-Tabs: Server-Listenreihenfolge nutzt nun `added_at`, damit die Tab-Position beim Wechsel stabil bleibt.
  - Zuständige Stelle: `stmtRoomTabsByUser` ([server.js](server.js#L564)).
- Linear-Panel (toggleLinear) Bugfix: Drei Fehler behoben, die dazu führten, dass sich das Linear-Panel nicht mehr schließen ließ und in der PS nicht aktualisierte:
  1. Permalink-Deaktivierung räumt nun Room-Scope-States auf (`linearVisibleByNote`, `linearOffsetByNote`, `linearProjectByNote`, `linearDataByNote` + Excalidraw/Excel analog), damit Panels nicht „hängenbleiben".
  2. `syncLinearForNote` fällt nicht mehr auf veraltete Room-Scope-Sichtbarkeit zurück, wenn kein Pin und keine Note aktiv ist – stattdessen wird Linear korrekt ausgeblendet.
  3. Toggle-Click-Handler: Schließen ist jetzt immer möglich (eigener `if (linearVisible)` Pfad), unabhängig vom Projekt-Auswahlstatus.
  - Zuständige Funktionen: `togglePermanentLink`-Handler ([app.js](app.js#L18265)), `syncLinearForNote` ([app.js](app.js#L19362)), `toggleLinear`-Click ([app.js](app.js#L19390)).
- Linear-Projekt in geteilten Räumen: Wenn ein Permanent-Link mit einem Linear-Projekt aktiviert wird, erscheint das Projekt automatisch sichtbar für Gäste. Neuer Projekt-Header (`#linearProjectHeader`) zeigt den Projektnamen im Linear-Panel.
  - Zuständige Stellen: `togglePermanentLink`-Handler ([app.js](app.js#L18350)), `renderLinearTasks` ([app.js](app.js#L19123)), `#linearProjectHeader` ([index.html](index.html#L585)).
- Raumbezogene Kommentare für Gäste: Gäste in geteilten Räumen können jetzt über `toggleComments`/`commentPanel` kommentieren, ohne Personal-Space-Authentifizierung:
  1. `room_pin_state`-Handler ruft `markRoomShared()` auf, damit `getCommentScopeId()` für Gäste den Raum-Scope zurückgibt.
  2. `canSyncCommentsForScope` erlaubt Room-Scope-Kommentare ohne PS-Auth.
  3. Server: Room-Comment-REST-Endpoints (`/api/rooms/.../comments`) erfordern keine Authentifizierung mehr.
  - Zuständige Stellen: `room_pin_state`-Handler ([app.js](app.js#L17855)), `canSyncCommentsForScope` ([app.js](app.js#L2462)), Room-Comment-API ([server.js](server.js#L3760)).

## Aktuelle Änderungen (2026-02-07)

- Personal Space Autosave: Auto-Save erzeugt keine neuen Notizen mehr ohne aktive Note-ID; verhindert doppelte Listeneintraege mit unterschiedlichen Ständen in `#psList`.
  - Zuständige Funktionen: `savePersonalSpaceNote` ([app.js](app.js#L20750)), `schedulePsAutoSave` ([app.js](app.js#L20906)), `filterRealNotes` ([app.js](app.js#L7970)).
- Markdown-Tasks: Beim Abhaken wird ein Abschluss-Timestamp gespeichert und in der Vorschau subtil unter erledigten Tasks angezeigt.
  - Zuständige Funktionen: `updatePreview` ([app.js](app.js#L9667)), `toggleMarkdownTaskAtIndex` ([app.js](app.js#L10465)), `applyTaskClosedTimestampsToHtml` ([app.js](app.js#L10878)).
- Outlook Kalender: Microsoft Graph OAuth (Single-Tenant), neue Outlook-API-Endpunkte fuer Status, Kalenderliste und Event-Sync; Kalender-UI ergaenzt, Sync-Ziel im Termin-Dialog vereinheitlicht (lokal/Google/Outlook) und Outlook-Events im Kalender geladen.
  - Zuständige Dateien: [app.js](app.js), [server.js](server.js), [index.html](index.html).

## Aktuelle Änderungen (2026-02-06)

- Shared Room Pins: Permanent-Link-Zustand wird serverseitig pro Room persistiert und per WebSocket an Gäste verteilt; Clients übernehmen Room-Pin in lokalen Shared-Storage, öffnen Excalidraw/Excel/Linear auch ohne Personal Space und blockieren Room-Sync nicht für Gäste.
- Settings: Neuer Bereich zum Verwalten geteilter Raeume (Liste, Oeffnen, Entfernen, Alles entfernen) mit Filter (persistiert) und kompakter Icon-Darstellung.

## Aktuelle Änderungen (2026-02-04)

- Commit `Add Linear project stats view`: Linear-Embed um Board/Statistik-Tabs erweitert; neue Auswertung mit Kennzahlen (Status, Overdue, Due soon) und Breakdown nach Status/Assignee für das ausgewählte Projekt.
- Commit `Encrypt Linear API key storage`: Linear API-Key wird verschlüsselt serverseitig im Personal Space gespeichert; neue API `/api/linear-key` für Sync; Client lädt Key nach Login und migriert bestehende lokale Keys.
- Commit `Permanent-Link for room tabs`: Neuer Permanent-Link-Button neben Copy im Editor; verlinkter Inhalt (Notiz oder lokaler Text) bleibt dem Raum-Tab zugeordnet und wird bei Tabwechsel wiederhergestellt; Room-Sync wird nur für verlinkten Inhalt ausgeführt; verlinkte Apps speichern State im Room-Scope, damit geteilte Rooms die Apps wieder öffnen; Pins werden lokal + serverseitig für Personal-Space Nutzer synchronisiert.
- Commit `Add Linear integration for shared rooms`: Neuer Settings-Bereich "Integrationen" inkl. Linear API-Key und Projektauswahl; Linear-Panel mit Projektpicker/Refresh im Editor; Tasks werden read-only pro Room/Note-Scope über WebSocket-Events `linear_state`/`linear_data` verteilt und serverseitig gepuffert (in-memory).
- Commit `Add Ethercalc Fly service + embed`: Ethercalc wird als Fly.io-Service bereitgestellt (eigener Dockerfile/fly.toml) und im Editor als eingebettete Tabelle genutzt; Sheet-URL wird pro Room/Key generiert, Excel-Toggle/Drag bleibt erhalten. Persistenz ist optional über REDIS_URL.

- Commit `Add self-hosted Excalidraw scene sync`: Excalidraw läuft nun lokal via `/excalidraw-embed.html` (React/Excalidraw-CDN), Szenen werden per PostMessage gelesen/geschrieben, über WebSocket-Typ `excalidraw_scene` pro Note/Room-Scope synchronisiert und serverseitig gepuffert; max Payload ~200 KB, Sichtbarkeit/Offset bleiben wie zuvor. Sichtbare Unterschiede: kein externer excalidraw.com-Login nötig, Inhalt synchronisiert zwischen Clients.
- Commit `Update gitstamp`: `gitstamp.txt` auf aktuellen Stand (SHA `acf430dcd5154afa2f3e65d08309c7cbad0d7bf5`) aktualisiert.

## Grafische Übersicht (ASCII)

```
App-Start
  |
  +--> initUiEventListeners()  ----> UI-Events/Inputs
  |                                 |-> updatePreview()
  |                                 |-> connect()
  |                                 |-> savePersonalSpaceNote()
  +--> initStartupTasks() ----> Background/Startflüsse
  |                                 |-> initUiLanguage()
  |                                 |-> initAutoBackup()/initAutoImport()
  |                                 |-> initAiDictation()
  |                                 |-> refreshPersonalSpace()
  |                                 |-> loadCommentsForRoom()
  |
  +--> Service Worker (sw.js)  ----> Asset-Cache (Stale-While-Revalidate)
  +--> IndexedDB (Offline-Store) --> notes / pendingOps / meta

Online ──> savePersonalSpaceNote() ──> API + offlinePutNotes() (Full-Sync-Spiegel)
Offline ─> savePersonalSpaceNote() ──> offlineSaveNote() + offlineEnqueueOp()
Reconnect ─> replayOfflineOps() ──> API Replay + offlineClearOps()

Auto-Sync (Cross-Device):
  visibilitychange/focus ──> schedulePsAutoRefresh() ──> refreshPersonalSpace()
  setInterval(60s) ──────> schedulePsAutoRefresh() ──> refreshPersonalSpace()
  refreshPersonalSpace() ──> API /api/personal-space/me ──> offlinePutNotes(clear+put)

Server-Start
  |-> HTTP Server (API, Uploads) -> initDb() -> SQLite
  |-> WebSocketServer -> persistRoomState()/loadPersistedRoomState()
  |-> Static Files (sw.js, manifest.json, ...)

Server-Start Detailliert (`server.listen` Callback):
  1. initDb()                          // DB + Prepared Statements initialisieren (PFLICHT vor DB-Zugriffen)
  2. stmtRoomAvailabilityCleanup.run() // Alte Availability-Einträge (>30 Tage) löschen
  3. refreshLatestModel()              // Anthropic Models API: aktuelles AI-Modell ermitteln
  4. setInterval(Cleanup, 24h)         // Periodischer Cleanup aller 24 Stunden
  5. setInterval(refreshModel, 6h)     // AI-Modell alle 6 Stunden aktualisieren

WICHTIG: initDb() MUSS vor allen DB-Zugriffen aufgerufen werden.
         Die Prepared Statements (stmtRoomAvailability*, stmtNotes*, etc.)
         werden erst in initDb() erzeugt und sind vorher undefined.
````

## Chronologischer Ablauf (App öffnet → Nutzeraktionen)

1) App lädt und initialisiert UI
- Zweck: Initialisierung der UI, Event-Handler, Startlogik.
- Umsetzung: `initUiEventListeners`, `initStartupTasks` ([app.js](app.js#L20974), [app.js](app.js#L22010)).

2) Sprach- und UI-Initialisierung
- Zweck: UI-Sprache erkennen/setzen und Übersetzungen anwenden.
- Umsetzung: `detectUiLanguage`, `applyUiLanguage`, `applyUiTranslations`, `t`.

3) Verbindungsaufbau (Room/Sync)
- Zweck: Room/Key bestimmen, WebSocket verbinden, CRDT/Presence starten.
- Umsetzung: `parseRoomAndKeyFromHash`, `connect`, `ensureYjsLoaded`, `initCrdt`, `sendCurrentState`.

4) Nutzer tippt im Editor
- Zweck: Text aktualisieren, Preview/Mask/CRDT syncen, Auto-Save triggern.
- Umsetzung: `updatePreview`, `updatePasswordMaskOverlay`, `scheduleSend`, `schedulePsAutoSave`.

5) Preview interagiert (Checkbox, Code, Tabellen)
- Zweck: Preview-Aktionen zurück in den Editor schreiben.
- Umsetzung: `attachPreviewCheckboxWriteback`, `toggleMarkdownTaskAtIndex`, `applyTableCommand`.

6) Kommentare/Markierungen
- Zweck: Kommentare verwalten, Overlay/Panel synchronisieren.
- Umsetzung: `loadCommentsForRoom`, `renderCommentList`, `updateCommentOverlay`, `addCommentFromDraft`.
- Hinweis: Raum-Kommentare (ohne Textmarkierung) sind immer sichtbar. Textmarkierung-Kommentare sind per `noteId` an die jeweilige Notiz gebunden und werden nur angezeigt (Counter, Liste, Overlay), wenn die zugehörige Notiz aktiv ist. `getVisibleCommentItems()` filtert zentral für alle drei Ausgaben.

7) Personal Space (Notizen, Tags, Auto-Save, Query-Engine, Cross-Device-Sync)
- Zweck: Notizen laden/filtern, Tags, Auto-Save, Tabs/History. Strukturierte Abfragen über alle Notizen via Query-Engine. Automatische Synchronisation zwischen Devices.
- Umsetzung: `refreshPersonalSpace`, `applyPersonalSpaceFiltersAndRender`, `savePersonalSpaceNote`, `updateRoomTabsForNoteId`, `parseQueryTokens`, `noteMatchesStructuredQuery`, `renderQueryResults`, `schedulePsAutoRefresh`, `startPsPolling`.
- Hinweis: Notizen werden per `filterRealNotes` auf gültige IDs geprüft und nach ID entdoppelt (neuestes `updatedAt`/`createdAt` bleibt); Tag-Änderungen aktualisieren bestehende Notizen statt neue anzulegen. Zusätzlich verhindert `psSaveNoteInFlight`-Mutex parallele manuelle Saves, `findNoteByText` erkennt inhaltlich identische Notizen (Volltext + Header-Fallback) vor dem Erstellen, `schedulePsAutoSave` stellt verlorene Note-IDs per Header-Sync wieder her, und der Server blockiert Duplikate per `contentHash`- und `title_hash`-Prüfung.
- Cross-Device-Sync: `schedulePsAutoRefresh` ruft `refreshPersonalSpace()` bei Tab-Fokus und alle 60s auf (Debounce 5s). `offlinePutNotes` führt Full-Sync (clear + put) durch, damit die IndexedDB exakt dem Server-Stand entspricht und keine Ghost-Notizen entstehen.
- Query-Engine: Das PS-Suchfeld unterstützt strukturierte Operatoren (`tag:`, `task:open`, `task:done`, `has:task`, `has:link`, `kind:`, `created:>`, `updated:<`, `pinned:`). Bei Task-Queries (`task:open`/`task:done`/`has:task`) wird ein aggregiertes Ergebnis-Panel über der Notizliste eingeblendet. `has:link` filtert alle Notizen, die Markdown-Links `[text](url)`, URLs (`https://...`) oder `www.`-Präfix-Links enthalten.

8) Settings/Tools (Uploads, Kalender, AI, Bildgenerierung)
- Zweck: Uploads/Trash/Calendar/AI-Einstellungen verwalten; KI-gestützte Bildgenerierung.
- Umsetzung: `loadUploadsManage`, `loadTrashManage`, `renderCalendarPanel`, `aiAssistFromPreview`.
- Hinweis: AI-Modus `image` nutzt FLUX.2 (BFL API) statt Anthropic Claude. Prompt → Server `/api/ai/image` → BFL Submit/Poll → Bild-Download → Base64-Data-URI → Rendering im `#runOutput` mit Download-Button. Konfiguration via `BFL_API_KEY`/`BFL_MODEL`/`BFL_IMAGE_TIMEOUT_MS`.

9) Offline-Modus (PWA, IndexedDB, Sync-Queue)
- Zweck: App offline nutzbar machen — Assets aus Service-Worker-Cache laden, Notizen lokal in IndexedDB lesen/schreiben, Änderungen bei Reconnect synchronisieren.
- Umsetzung: `sw.js` (Service Worker), `manifest.json` (PWA-Manifest), `openOfflineDb`, `offlineSaveNote`, `offlinePutNotes`, `offlineGetAllNotes`, `offlineEnqueueOp`, `replayOfflineOps`, `isAppOffline`.
- Hinweis: Bei Offline werden `savePersonalSpaceNote` und `savePersonalSpaceNoteSnapshot` lokal statt über API gespeichert. `refreshPersonalSpace` fällt auf IndexedDB-Cache zurück. Bei erneutem Online-Ereignis (`window.online`) und WebSocket-Reconnect werden ausstehende Operationen (Create/Update/Delete) sequentiell zum Server gesendet. Temporäre IDs (`offline_*`) werden durch Server-IDs ersetzt.

## Funktionskatalog (kategorisiert nach Funktionsbereichen)

> **Wartungshinweis**: Neue Funktionen am Ende der jeweiligen Kategorie einfügen.  
> Jede Funktion trägt `#tags` für Kategorie- und Querschnittssuche. Zum Finden: `Ctrl+F` → `#tagname`.  
> **Datei**: Jeder Sektionsheader enthält die Quelldatei (`app.js` / `server.js`).  
> **Kategorien**: `#core` `#crypto` `#modal` `#share` `#upload` `#tags` `#editor` `#comments` `#wiki` `#slash` `#table` `#mobile` `#i18n` `#theme` `#ai` `#image` `#flux` `#settings` `#backup` `#ps` `#preview` `#runner` `#import` `#favorites` `#tabs` `#pins` `#calendar` `#ws` `#crdt` `#presence` `#linear` `#init` `#query` `#offline`  
> **Querschnitt**: `#render` `#parse` `#normalize` `#format` `#storage` `#api` `#handler` `#dom` `#debounce` `#security` `#url` `#identity` `#date` `#ui` `#pdf` `#html` `#build` `#sync`

---

### app.js

---

#### 1 · Basis-Helfer & Initialisierung `#core` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `normalizeBaseUrl` | Normalisiert Base-URL | `#url` `#normalize` | — |
| `tryRenderSharedNote` | Versucht geteilte Notiz zu rendern | `#share` `#render` | `base64UrlDecode`, `buildNoteShareHtmlDocument`, `t` |
| `ensurePdfJsLoaded` | Stellt sicher, dass PDF.js geladen ist | `#pdf` | `t` |
| `getPdfPreviewDoc` | Liest PDF-Preview-Dokument | `#pdf` | `ensurePdfJsLoaded`, `t` |
| `renderPdfPreviewPage` | Rendert eine PDF-Preview-Seite | `#pdf` `#render` | `ensurePdfJsLoaded`, `getPdfPreviewDoc`, `t` |
| `createClientId` | Erzeugt eindeutige Client-ID | `#identity` | — |
| `announceClientId` | Teilt Client-ID mit | `#identity` `#ws` | — |
| `randomIdentity` | Erzeugt zufällige Identität | `#identity` | — |
| `loadIdentity` | Lädt gespeicherte Identität | `#identity` `#storage` | — |
| `saveIdentity` | Speichert Identität | `#identity` `#storage` | — |
| `normalizeRoom` | Normalisiert Raum-Name | `#room` `#normalize` | — |
| `normalizeKey` | Normalisiert Schlüssel | `#key` `#normalize` | — |
| `parseRoomAndKeyFromHash` | Parst Room+Key aus URL-Hash | `#room` `#key` `#parse` | `normalizeKey`, `normalizeRoom`, `t` |
| `buildShareHash` | Baut Share-Hash | `#share` `#url` | `t` |
| `randomKey` | Erzeugt zufälligen Key | `#key` | `normalizeKey` |
| `api` | HTTP-API-Client | `#api` `#http` | `safeJsonParse`, `t` |
| `fmtDate` | Formatiert Datum | `#date` `#format` | `getUiLocale` |
| `toast` | Zeigt Benachrichtigung an | `#ui` `#notification` | `t` |
| `loadBuildStamp` | Lädt Build-Stamp | `#version` | `t` |
| `escapeHtml` | HTML-Sonderzeichen escapen | `#html` `#security` | — |
| `escapeHtmlAttr` | HTML-Attribute escapen | `#html` `#security` | — |
| `escapeAttr` | Attribut-Escape (Render-Kontext) | `#html` `#security` | `escapeHtml`, diverse |
| `copyTextToClipboard` | Text in Zwischenablage kopieren | `#clipboard` `#ui` | `t` |
| `nowIso` | ISO-Zeitstempel erzeugen | `#date` `#format` | `getUiLocale` |
| `safeJsonParse` | Sicheres JSON-Parsen | `#json` `#parse` | — |
| `sanitizeLegacySnapshotText` | Legacy-Snapshots bereinigen | `#legacy` `#parse` | `safeJsonParse` |
| `getLineBounds` | Zeilenanfang/-ende im Text | `#text` `#cursor` | — |
| `replaceTextRange` | Textbereich ersetzen | `#text` `#edit` | — |
| `insertTextAtCursor` | Text an Cursor einfügen | `#text` `#edit` | — |
| `getTextareaCaretCoords` | Cursor-Koordinaten im Textarea | `#cursor` `#dom` | `t` |
| `positionFloatingMenu` | Floating-Menü positionieren | `#menu` `#dom` | `getTextareaCaretCoords`, `t` |

#### 2 · Verschlüsselung (E2EE) `#crypto` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `resetE2eeKeyCache` | Setzt E2EE-Key-Cache zurück | `#e2ee` `#cache` | — |
| `base64UrlEncode` | Base64-URL-Encode | `#encode` `#base64` | — |
| `base64UrlDecode` | Base64-URL-Decode | `#decode` `#base64` | `t` |
| `base64EncodeBytes` | Bytes → Base64 | `#encode` `#base64` | — |
| `base64DecodeBytes` | Base64 → Bytes | `#decode` `#base64` | `t` |
| `getE2eeKey` | E2EE-Schlüssel ableiten | `#e2ee` `#key` | `t` |
| `encryptForRoom` | Raum-Text verschlüsseln | `#e2ee` `#encrypt` | `base64UrlEncode`, `getE2eeKey`, `t` |
| `decryptForRoom` | Raum-Text entschlüsseln | `#e2ee` `#decrypt` | `base64UrlDecode`, `getE2eeKey`, `t` |
| `isE2eeActive` | Prüft ob E2EE aktiv | `#e2ee` `#check` | — |
| `toast` | Benachrichtigungen anzeigen | `#ui` `#notification` | `t` |
| `loadBuildStamp` | Build-Stamp laden | `#version` | `t` |

#### 3 · Modale Dialoge `#modal` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `isModalReady` | Prüft Modal-Bereitschaft | `#check` `#ui` | — |
| `setModalOpen` | Setzt Modal offen/geschlossen | `#ui` `#state` | — |
| `openModal` | Öffnet modalen Dialog | `#ui` `#handler` | `cleanup`, `finish`, `isModalReady`, `onBackdropClick`, `onCancel`, `onInputKey`, `onKeyDown`, `onOk`, `setModalOpen`, `t` |
| `cleanup` | Räumt Modal auf | `#ui` | `setModalOpen` |
| `finish` | Schließt Modal mit Ergebnis | `#ui` | `cleanup` |
| `onCancel` | Abbrechen-Handler | `#handler` | `finish` |
| `onOk` | OK-Handler | `#handler` | `finish` |
| `onBackdropClick` | Hintergrund-Klick-Handler | `#handler` | `finish` |
| `onInputKey` | Input-Tastatur-Handler | `#handler` `#keyboard` | `finish`, `t` |
| `onKeyDown` | Tastatur-Handler | `#handler` `#keyboard` | `finish`, `t` |
| `modalConfirm` | Bestätigungsdialog | `#dialog` | `openModal` |
| `modalPrompt` | Eingabedialog | `#dialog` | `openModal` |
| `showSlashHelp` | Slash-Befehle Hilfe anzeigen | `#dialog` `#help` | `openModal` |

#### 4 · Teilen (Share / Note-Share) `#share` — `app.js`

##### 4.1 Room-Share-Modal — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `isShareModalReady` | Prüft Share-Modal-Bereitschaft | `#check` `#ui` | — |
| `setShareModalOpen` | Setzt Share-Modal offen | `#ui` `#state` | — |
| `buildQrUrl` | Baut QR-Code-URL | `#qr` `#url` | `t` |
| `updateShareModalLink` | Aktualisiert Share-Link im Modal | `#render` `#url` | `buildQrUrl`, `buildShareHref`, `isShareModalReady`, `t` |
| `openShareModal` | Öffnet Share-Modal | `#ui` `#handler` | `isShareModalReady`, `setShareModalOpen`, `t`, `updateShareModalLink` |
| `buildShareHref` | Baut vollständige Share-URL | `#url` `#build` | `buildShareHash` |
| `updateShareLink` | Aktualisiert Share-Link global | `#url` `#sync` | `buildShareHref`, `updateShareModalLink` |

##### 4.2 Notizen-Share-Modal — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `isNoteShareModalReady` | Prüft Note-Share-Modal | `#check` `#ui` | — |
| `revokeNoteShareShareUrl` | Widerruft Note-Share-URL | `#revoke` `#url` | — |
| `buildNoteShareHtmlDocument` | Baut HTML-Dokument für Notiz-Share | `#build` `#html` | `escapeHtml` |
| `setNoteShareModalOpen` | Setzt Note-Share-Modal | `#ui` `#state` | `revokeNoteShareShareUrl` |
| `buildNoteSharePayloadFromIds` | Baut Share-Payload aus IDs | `#build` `#data` | `findNoteById`, `getNoteTitle` |
| `buildNoteShareUrl` | Baut Note-Share-URL | `#url` `#build` | `base64UrlEncode`, `t` |
| `buildNoteShareQrPayload` | Baut QR-Payload für Notiz | `#qr` `#build` | — |
| `updateNoteShareModal` | Aktualisiert Note-Share-Modal | `#render` `#ui` | `buildNoteShareQrPayload`, `buildNoteShareUrl`, `buildQrUrl`, `isNoteShareModalReady`, `revokeNoteShareShareUrl`, `t` |
| `openNoteShareModal` | Öffnet Note-Share-Modal | `#ui` `#handler` | `buildNoteSharePayloadFromIds`, `isNoteShareModalReady`, `setNoteShareModalOpen`, `t`, `toast`, `updateNoteShareModal` |

#### 5 · Upload-Modal `#upload` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `isUploadModalReady` | Prüft Upload-Modal | `#check` `#ui` | — |
| `setUploadModalOpen` | Setzt Upload-Modal | `#ui` `#state` | — |
| `formatBytes` | Formatiert Byte-Größe | `#format` | — |
| `buildUploadMarkdown` | Baut Upload-Markdown | `#build` `#markdown` | — |
| `isAllowedUploadType` | Prüft erlaubten Dateityp | `#check` `#security` | — |
| `updateUploadPreview` | Aktualisiert Upload-Vorschau | `#render` `#ui` | `formatBytes` |
| `setUploadInsertDisabled` | Setzt Insert-Button-Status | `#ui` `#state` | — |
| `resetUploadModalState` | Setzt Upload-Modal zurück | `#ui` `#reset` | `setUploadInsertDisabled`, `updateUploadPreview` |
| `openUploadModal` | Öffnet Upload-Modal | `#ui` `#handler` | `isUploadModalReady`, `resetUploadModalState`, `setUploadModalOpen`, `t` |
| `readFileAsDataUrl` | Liest Datei als Data-URL | `#file` `#read` | `t` |

#### 6 · Tag-System & Kategorisierung `#tags` — `app.js`

##### 6.1 Tag-Normalisierung & Helfer — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `normalizeManualTags` | Normalisiert manuelle Tags | `#normalize` | `t` |
| `uniqTags` | Entfernt Tag-Duplikate | `#dedupe` | `t` |
| `normalizeYearTag` | Normalisiert Jahres-Tag | `#normalize` `#date` | `t` |
| `normalizeMonthTag` | Normalisiert Monats-Tag | `#normalize` `#date` | — |
| `normalizeCategoryValue` | Normalisiert Kategorie | `#normalize` | `t` |
| `isYearTag` | Prüft Jahres-Tag | `#check` `#date` | `t` |
| `isMonthTag` | Prüft Monats-Tag | `#check` `#date` | `normalizeMonthTag` |
| `getDateTagsForTs` | Datum-Tags aus Timestamp | `#date` `#build` | — |
| `splitTagsForEditor` | Tags für Editor aufteilen | `#parse` `#editor` | `getDateTagsForTs`, `isMonthTag`, `isYearTag`, `normalizeMonthTag`, `stripManualTagsMarker`, `stripPinnedTag` |
| `buildEditorSystemTags` | System-Tags erzeugen | `#build` | — |
| `stripManualTagsMarker` | Manual-Tags-Marker entfernen | `#strip` `#parse` | — |
| `stripPinnedTag` | Pinned-Tag entfernen | `#strip` `#parse` | — |
| `noteIsPinned` | Prüft ob Notiz gepinnt | `#check` `#pin` | — |
| `buildPsTagsPayload` | Baut Tags-Payload | `#build` `#api` | `stripManualTagsMarker` |

##### 6.2 Tag-Editor (PS-Sidebar) — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `getEditingNoteCreatedAt` | Liest createdAt der aktiven Notiz | `#read` `#note` | — |
| `syncPsEditorTagMetaInputs` | Synchronisiert Tag-Meta-Inputs | `#sync` `#ui` | — |
| `updatePsEditorTagMetaFromInputs` | Aktualisiert Tags aus Inputs | `#handler` `#sync` | `getDateTagsForTs`, `getEditingNoteCreatedAt`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `schedulePsTagsAutoSave`, `syncPsEditorTagMetaInputs`, `t`, `updateEditingNoteTagsLocal`, `updateEditorMetaYaml`, `updatePsEditingTagsHint` |
| `formatTagsForHint` | Tags als Hint formatieren | `#format` `#ui` | — |
| `updatePsEditingTagsHint` | Aktualisiert Tags-Hint | `#render` `#ui` | `formatTagsForHint`, `t` |
| `formatTagsForEditor` | Tags für Editor formatieren | `#format` `#editor` | — |
| `setPsEditorTagsVisible` | Tags sichtbar/unsichtbar | `#ui` `#state` | — |
| `syncPsEditorTagsInput` | Synchronisiert Tags-Input | `#sync` `#ui` | `formatTagsForEditor`, `syncPsEditorTagMetaInputs` |
| `getPsEditorTagTokenBounds` | Tag-Token-Grenzen ermitteln | `#parse` `#cursor` | `t` |
| `buildPsEditorTagsSuggestItems` | Suggest-Items erzeugen | `#build` `#suggest` | `getPsEditorTagTokenBounds`, `isMonthTag`, `isYearTag`, `normalizeManualTags`, `t` |
| `closePsEditorTagsSuggest` | Suggest-Menü schließen | `#ui` `#suggest` | — |
| `renderPsEditorTagsSuggest` | Suggest-Menü rendern | `#render` `#suggest` | `closePsEditorTagsSuggest`, `escapeHtml`, `escapeHtmlAttr`, `t` |
| `updatePsEditorTagsSuggest` | Suggest-Menü aktualisieren | `#render` `#suggest` | `buildPsEditorTagsSuggestItems`, `closePsEditorTagsSuggest`, `renderPsEditorTagsSuggest`, `t` |
| `updatePsEditorTagsFromInput` | Tags aus Input aktualisieren | `#handler` `#sync` | `normalizeManualTags`, `schedulePsTagsAutoSave`, `t`, `updateEditingNoteTagsLocal`, `updateEditorMetaYaml`, `updatePsEditingTagsHint` |
| `applyPsEditorTagSuggestion` | Tag-Suggestion anwenden | `#handler` `#suggest` | `getPsEditorTagTokenBounds`, `t`, `updatePsEditorTagsFromInput`, `updatePsEditorTagsSuggest` |
| `syncPsEditingNoteTagsFromState` | Tags vom State synchronisieren | `#sync` `#state` | `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `splitTagsForEditor`, `syncPsEditorTagsInput`, `t`, `updatePsEditingTagsHint` |

##### 6.3 Tag-Verwaltung (Sections, Context-Menü) — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `sortTagList` | Tag-Liste sortieren | `#sort` | `t` |
| `buildTagSections` | Tag-Sektionen aufbauen | `#build` `#render` | `isMonthTag`, `isYearTag`, `sortTagList`, `t` |
| `loadPsTagSectionState` | Tag-Sektion-Zustand laden | `#storage` `#load` | — |
| `savePsTagSectionState` | Tag-Sektion-Zustand speichern | `#storage` `#save` | — |
| `normalizeSingleTag` | Einzelnen Tag normalisieren | `#normalize` | `normalizeManualTags` |
| `dedupeRawTags` | Raw-Tags entdoppeln | `#dedupe` | `t` |
| `updateNotesForTagChange` | Notizen bei Tag-Änderung aktualisieren | `#api` `#sync` | `api`, `applyPersonalSpaceFiltersAndRender`, `dedupeRawTags`, `rebuildPsTagsFromNotes`, `t`, `toast` |
| `resetPsTagContextDelete` | Tag-Lösch-Dialog zurücksetzen | `#ui` `#reset` | `t` |
| `setPsTagContextMenuOpen` | Tag-Kontextmenü öffnen/schließen | `#ui` `#context-menu` | — |
| `positionPsTagContextMenu` | Tag-Kontextmenü positionieren | `#dom` `#context-menu` | `t` |
| `closePsTagContextMenu` | Tag-Kontextmenü schließen | `#ui` `#context-menu` | `resetPsTagContextDelete`, `setPsTagContextMenuOpen` |
| `openPsTagContextMenu` | Tag-Kontextmenü öffnen | `#ui` `#context-menu` | `closePsContextMenu`, `positionPsTagContextMenu`, `resetPsTagContextDelete`, `setPsTagContextMenuOpen`, `t` |
| `applyPsTagContextValue` | Tag-Kontextwert anwenden | `#handler` `#context-menu` | `closePsTagContextMenu`, `normalizeSingleTag`, `t`, `toast`, `updateNotesForTagChange` |
| `applyPsTagContextInput` | Tag-Kontext-Eingabe anwenden | `#handler` `#context-menu` | `applyPsTagContextValue` |
| `confirmPsTagContextDelete` | Tag-Löschung bestätigen | `#handler` `#delete` | `closePsTagContextMenu`, `updateNotesForTagChange` |
| `updatePsTagsActiveInfo` | Aktive Tag-Info aktualisieren | `#ui` `#render` | — |
| `renderPsTags` | Tag-Panel rendern | `#render` `#panel` | `buildTagSections`, `loadPsTagSectionState`, `openPsTagContextMenu`, `refreshPersonalSpace`, `savePsTagPrefs`, `savePsTagSectionState`, `t`, `updatePsTagsActiveInfo` |
| `togglePinnedForNote` | Pin-Status für Notiz umschalten | `#handler` `#pin` | `api`, `applyPersonalSpaceFiltersAndRender`, `buildPsTagsPayload`, diverse Tag-Helfer |
| `rebuildPsTagsFromNotes` | Tags aus Notizen neu aufbauen | `#build` `#sync` | `t`, `updatePsEditorTagsSuggest` |
| `updateEditingNoteTagsLocal` | Lokale Tags der aktiven Notiz aktualisieren | `#sync` `#state` | `applyPersonalSpaceFiltersAndRender`, `buildEditorSystemTags`, `buildPsTagsPayload`, `rebuildPsTagsFromNotes`, `uniqTags` |
| `schedulePsTagsAutoSave` | Tags-Auto-Save planen | `#debounce` `#save` | `savePersonalSpaceNote`, `t` |

#### 7 · Kommentare `#comments` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `formatCommentTime` | Kommentar-Zeit formatieren | `#format` `#date` | — |
| `getCommentScopeId` | Ermittelt Scope-ID (Raum/Note) | `#scope` `#room` | — |
| `getCommentSelectionNoteId` | Ermittelt Note-ID für Markierungszuordnung (Pin > PS-Note) | `#scope` `#identity` | `getCommentNoteId`, `getRoomPinnedEntry`, `normalizeRoom`, `normalizeKey` |
| `getVisibleCommentItems` | Filtert Kommentare: Raum-Kommentare immer, Textmarkierungen nur bei passender `noteId` | `#filter` `#scope` | `getCommentSelectionNoteId` |
| `canSyncCommentsForScope` | Prüft ob Kommentar-Sync erlaubt | `#check` `#security` | — |
| `loadCommentsForRoom` | Lädt Kommentare für Raum | `#api` `#load` | `getCommentScopeId`, `renderCommentList`, `t`, `updateCommentOverlay` |
| `saveCommentsForRoom` | Speichert Kommentare | `#api` `#save` | `getCommentScopeId` |
| `normalizeCommentSelection` | Normalisiert Kommentar-Selektion | `#normalize` | — |
| `buildCommentOverlayHtml` | Baut Kommentar-Overlay-HTML aus sichtbaren Kommentaren | `#build` `#html` | `escapeHtml`, `escapeHtmlAttr`, `getVisibleCommentItems`, `normalizeCommentSelection`, `t` |
| `syncCommentOverlayScroll` | Synchronisiert Overlay-Scroll | `#sync` `#dom` | — |
| `updateCommentOverlay` | Aktualisiert Kommentar-Overlay | `#render` `#overlay` | `buildCommentOverlayHtml`, `syncCommentOverlayScroll` |
| `setCommentPanelOpen` | Setzt Panel offen/geschlossen | `#ui` `#state` | `updateCommentOverlay` |
| `setCommentDraftSelection` | Setzt Draft-Selektion | `#state` | — |
| `updateCommentComposerUi` | Aktualisiert Composer-UI | `#render` `#ui` | `applyUiTranslations` |
| `setCommentComposerState` | Setzt Composer-State | `#state` | — |
| `clearCommentComposerState` | Löscht Composer-State | `#reset` `#state` | `setCommentDraftSelection`, `updateCommentComposerUi` |
| `renderCommentList` | Rendert sichtbare Kommentare (gefiltert via `getVisibleCommentItems`) | `#render` `#panel` | `applyUiTranslations`, `clearCommentComposerState`, `formatCommentTime`, `getVisibleCommentItems`, `normalizeCommentSelection`, `saveCommentsForRoom`, `setCommentComposerState`, `setCommentPanelOpen`, `t`, `updateCommentOverlay`, `updateSelectionMenu` |
| `addCommentFromDraft` | Fügt Kommentar aus Draft hinzu; speichert `noteId` | `#handler` `#create` | `clearCommentComposerState`, `getCommentSelectionNoteId`, `getSelectionRange`, `renderCommentList`, `saveCommentsForRoom`, `t`, `toast`, `updateCommentOverlay` |
| `openCommentFromSelection` | Öffnet Kommentar aus Selektion | `#handler` `#ui` | `getSelectionRange`, `setCommentDraftSelection`, `setCommentPanelOpen`, `setSelectionMenuOpen`, `updateCommentComposerUi` |

#### 8 · Editor-Selektion & Textformatierung `#editor` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `setSlashMenuOpen` | Slash-Menü öffnen/schließen | `#ui` `#menu` | — |
| `getSlashContext` | Slash-Kontext ermitteln | `#parse` `#cursor` | `getLineBounds` |
| `setWikiMenuOpen` | Wiki-Menü öffnen/schließen | `#ui` `#menu` | — |
| `setSelectionMenuOpen` | Selektions-Menü öffnen/schließen | `#ui` `#menu` | — |
| `getSelectionRange` | Selektion ermitteln | `#dom` `#cursor` | — |
| `getSelectionLineRange` | Selektions-Zeilenbereich | `#dom` `#cursor` | — |
| `wrapSelection` | Selektion umschließen | `#edit` `#format` | — |
| `wrapSelectionToggle` | Selektion toggle-umschließen | `#edit` `#format` | — |
| `prefixSelectionLines` | Zeilen-Prefix einfügen | `#edit` `#format` | `getSelectionLineRange`, `t` |
| `togglePrefixSelectionLines` | Zeilen-Prefix togglen | `#edit` `#format` | `getSelectionLineRange`, `t` |
| `toggleDividerAtSelection` | Trennlinie togglen | `#edit` `#format` | `getSelectionLineRange`, `t` |
| `toggleFencedCodeBlock` | Code-Block togglen | `#edit` `#code` | `getSelectedCodeLang`, `getSelectionLineRange`, `t` |
| `sortSelectionLines` | Selektions-Zeilen sortieren | `#edit` `#sort` | `getSelectionLineRange`, `t` |
| `applySelectionAction` | Selektions-Aktion ausführen | `#handler` | `openCommentFromSelection`, `schedulePsAutoSave`, `scheduleSend`, diverse |
| `updateSelectionMenu` | Selektions-Menü aktualisieren | `#render` `#menu` | `getSelectionRange`, `positionFloatingMenu`, `setSelectionMenuOpen` |

#### 9 · Wiki-Menü `#wiki` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `getWikiContext` | Wiki-Kontext ermitteln | `#parse` `#cursor` | — |
| `renderWikiMenu` | Wiki-Menü rendern | `#render` `#menu` | `escapeHtml`, `insertWikiLink`, `t` |
| `insertWikiLink` | Wiki-Link einfügen | `#edit` `#link` | `getWikiContext`, `replaceTextRange`, `setWikiMenuOpen`, `t`, `updatePreview` |
| `updateWikiMenu` | Wiki-Menü aktualisieren | `#render` `#menu` | `fmtDate`, `getNoteTitle`, `getWikiContext`, `renderWikiMenu`, `setSlashMenuOpen`, `setWikiMenuOpen`, `t` |
| `handleWikiMenuKey` | Wiki-Menü Tastatur-Handler | `#handler` `#keyboard` | `insertWikiLink`, `renderWikiMenu`, `setWikiMenuOpen`, `t` |

#### 10 · Slash-Menü `#slash` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `renderSlashMenu` | Slash-Menü rendern | `#render` `#menu` | `insertSlashSnippet`, `t` |
| `insertSlashSnippet` | Slash-Snippet einfügen | `#edit` `#snippet` | `getSlashContext`, `replaceTextRange`, `setSlashMenuOpen`, `t`, `updatePreview` |
| `updateSlashMenu` | Slash-Menü aktualisieren | `#render` `#menu` | `getSlashContext`, `getWikiContext`, `positionFloatingMenu`, `renderSlashMenu`, `setSlashMenuOpen`, `t` |
| `handleSlashMenuKey` | Slash-Menü Tastatur-Handler | `#handler` `#keyboard` | `getSlashContext`, `insertSlashSnippet`, `renderSlashMenu`, `setSlashMenuOpen`, `t` |
| `applySlashCommand` | Slash-Befehl ausführen | `#handler` `#command` | `applyTableCommand`, `buildMarkdownTable`, `getLineBounds`, `getSelectedCodeLang`, `replaceTextRange`, `showSlashHelp`, `t`, `toast`, `updateCodeLangOverlay` |

#### 11 · Tabellen-Editor `#table` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `renderTableRow` | Tabellen-Zeile rendern | `#render` | — |
| `renderTableSeparator` | Tabellen-Separator rendern | `#render` | — |
| `buildMarkdownTable` | Markdown-Tabelle bauen | `#build` `#markdown` | `renderTableRow`, `renderTableSeparator` |
| `getLineIndexAtPos` | Zeilenindex an Position | `#parse` `#cursor` | — |
| `isTableSeparator` | Prüft Tabellen-Separator | `#check` | `t` |
| `splitTableRow` | Tabellen-Zeile aufteilen | `#parse` | `t` |
| `getColumnIndexFromCaret` | Spaltenindex aus Cursor | `#parse` `#cursor` | `t` |
| `getTableContext` | Tabellen-Kontext ermitteln | `#parse` | `getLineIndexAtPos`, `isTableSeparator`, `t` |
| `applyTableCommand` | Tabellen-Befehl ausführen | `#handler` `#command` | `getColumnIndexFromCaret`, `getTableContext`, `renderTableRow`, `renderTableSeparator`, `replaceTextRange`, `splitTableRow`, `t` |
| `setTableModalOpen` | Tabellen-Modal öffnen/schließen | `#ui` `#state` | — |
| `parseTableFromContext` | Tabelle aus Kontext parsen | `#parse` | `splitTableRow` |
| `renderTableEditorGrid` | Tabellen-Editor-Grid rendern | `#render` `#grid` | `escapeHtmlAttr`, `t`, `updateTableActiveCellLabel`, `updateTableActiveInputHighlight`, `updateTableCalculations` |
| `updateTableActiveCellLabel` | Aktive Zelle Label | `#ui` | — |
| `updateTableActiveInputHighlight` | Aktive Zelle Highlight | `#ui` `#dom` | — |
| `getNumericValuesForScope` | Numerische Werte für Scope | `#calc` `#data` | — |
| `updateTableCalculations` | Tabellen-Berechnungen | `#calc` `#render` | `getNumericValuesForScope` |
| `insertCalcResult` | Berechnung einfügen | `#calc` `#edit` | `getNumericValuesForScope`, `renderTableEditorGrid`, `updateTableCalculations` |
| `applyTableEditorToTextarea` | Tabellen-Editor → Textarea | `#sync` `#edit` | `renderTableRow`, `renderTableSeparator`, `replaceTextRange`, `scheduleSend`, `updatePasswordMaskOverlay`, `updatePreview` |
| `openTableEditorFromCursor` | Tabellen-Editor am Cursor öffnen | `#handler` `#ui` | `getTableContext`, `parseTableFromContext`, `renderTableEditorGrid`, `setTableModalOpen`, `t`, `toast`, `updateTableActiveCellLabel`, `updateTableCalculations` |
| `updateTableMenuVisibility` | Tabellen-Menü Sichtbarkeit | `#ui` `#state` | `getTableContext`, `t` |

#### 12 · Mobil-Unterstützung `#mobile` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `isMobileViewport` | Prüft mobiles Viewport | `#check` `#viewport` | — |
| `syncMobileFocusState` | Synchronisiert mobilen Fokus | `#sync` `#ui` | `isMobileViewport`, `t` |
| `normalizeMobileAutoNoteSeconds` | Normalisiert Mobile-Auto-Note-Sekunden | `#normalize` | — |
| `loadMobileAutoNoteSeconds` | Lädt Mobile-Auto-Note-Sekunden | `#storage` `#load` | `normalizeMobileAutoNoteSeconds` |
| `saveMobileAutoNoteSeconds` | Speichert Mobile-Auto-Note-Sekunden | `#storage` `#save` | `normalizeMobileAutoNoteSeconds` |
| `recordMobileLastActive` | Merkt letzte Aktivität | `#state` | — |
| `shouldStartMobileAutoNote` | Prüft ob Auto-Note starten | `#check` | `isMobileViewport`, `t` |
| `maybeStartMobileAutoNoteSession` | Startet ggf. Auto-Note-Session | `#handler` `#auto` | `setPreviewVisible`, `shouldStartMobileAutoNote`, `syncMobileFocusState` |

#### 13 · Internationalisierung (i18n) `#i18n` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `getUiString` | UI-String lesen | `#read` | — |
| `t` | Übersetzungsschlüssel auflösen | `#translate` | `getUiString` |
| `formatUi` | UI-Template formatieren | `#format` | — |
| `getUiLocale` | UI-Locale lesen | `#read` `#locale` | — |
| `getUiSpeechLocale` | Speech-Locale lesen | `#read` `#locale` | — |
| `detectUiLanguage` | UI-Sprache erkennen | `#detect` `#locale` | — |
| `applyI18nAttribute` | i18n-Attribut anwenden | `#dom` `#translate` | `getUiString` |
| `applyUiTranslations` | Alle Übersetzungen anwenden | `#dom` `#translate` | `applyI18nAttribute`, `getUiString` |
| `syncUiLangButtons` | Sprach-Buttons synchronisieren | `#ui` `#sync` | — |
| `applyUiLanguage` | UI-Sprache anwenden | `#apply` `#locale` | `applyGlowEnabled`, `applyUiTranslations`, `getUiSpeechLocale`, `syncUiLangButtons` |
| `setUiLanguage` | UI-Sprache setzen | `#state` `#locale` | `applyUiLanguage` |
| `initUiLanguage` | UI-Sprache initialisieren | `#init` `#locale` | `applyUiLanguage`, `detectUiLanguage` |

#### 14 · Theme & Glow `#theme` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `renderThemeList` | Theme-Liste rendern | `#render` `#ui` | `syncThemeListActive`, `t` |
| `syncThemeListActive` | Aktives Theme synchronisieren | `#sync` `#ui` | — |
| `loadGlowEnabled` | Glow-Einstellung laden | `#storage` `#load` | `applyGlowEnabled` |
| `applyGlowEnabled` | Glow anwenden | `#dom` `#apply` | `t` |
| `saveGlowEnabled` | Glow speichern | `#storage` `#save` | `applyGlowEnabled` |
| `loadTheme` | Theme laden | `#storage` `#load` | `applyTheme` |
| `applyTheme` | Theme anwenden | `#dom` `#apply` | `syncThemeListActive`, `updatePreview` |
| `saveTheme` | Theme speichern | `#storage` `#save` | `applyTheme` |

#### 15 · KI-Assistent & Diktat `#ai` — `app.js`

##### 15.1 AI-Konfiguration — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `loadAiPrompt` | AI-Prompt laden | `#storage` `#load` | — |
| `loadAiUsePreview` | AI-Use-Preview laden | `#storage` `#load` | `setAiUsePreviewUi` |
| `loadAiUseAnswer` | AI-Use-Answer laden | `#storage` `#load` | `setAiUseAnswerUi` |
| `saveAiPrompt` | AI-Prompt speichern | `#storage` `#save` | — |
| `saveAiUseAnswer` | AI-Use-Answer speichern | `#storage` `#save` | — |
| `saveAiUsePreview` | AI-Use-Preview speichern | `#storage` `#save` | — |
| `loadAiApiConfig` | AI-API-Config laden | `#storage` `#load` | — |
| `saveAiApiConfig` | AI-API-Config speichern | `#storage` `#save` | — |
| `getAiApiConfig` | AI-API-Config lesen | `#read` `#config` | — |
| `getAiPrompt` | AI-Prompt lesen | `#read` | — |
| `getAiUsePreview` | AI-Use-Preview lesen | `#read` | — |
| `getAiUseAnswer` | AI-Use-Answer lesen | `#read` | — |
| `setAiUsePreviewUi` | AI-Use-Preview UI | `#ui` `#state` | — |
| `setAiUseAnswerUi` | AI-Use-Answer UI | `#ui` `#state` | — |
| `readAiApiKeyInput` | AI-API-Key Input lesen | `#read` `#ui` | — |
| `normalizeAiModelInput` | AI-Modell Input normalisieren | `#normalize` | — |
| `applyAiContextMode` | AI-Kontextmodus anwenden | `#apply` `#ui` | `getAiUsePreview` |
| `loadAiStatus` | AI-Status laden | `#api` `#load` | `api` |
| `getAiMode` | AI-Modus ermitteln (explain/fix/improve/run/summarize/image) | `#read` | — |
| `aiAssistFromPreview` | AI-Assist aus Preview (Text via Anthropic, Bild via FLUX.2) | `#api` `#handler` | `api`, `addAiChatEntry`, `clearAiPromptAfterResponse`, `escapeHtml`, `getAiApiConfig`, `getAiChatContextKey`, `getAiMode`, `getAiPrompt`, `getAiUseAnswer`, `getAiUsePreview`, `parseRunnableFromEditor`, `saveAiPrompt`, `setPreviewRunOutput`, `setRunOutputProcessing`, `t`, `toast`, `updateRunOutputSizing`, `updateRunOutputUi` |

##### 15.2 AI-Diktat — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `getSpeechRecognitionConstructor` | Speech-Recognition Konstruktor | `#speech` `#check` | — |
| `setAiDictationUi` | Diktat-UI setzen | `#ui` `#state` | — |
| `updateAiDictationValue` | Diktat-Wert aktualisieren | `#handler` `#speech` | — |
| `onAiDictationResult` | Diktat-Ergebnis verarbeiten | `#handler` `#speech` | `updateAiDictationValue` |
| `stopAiDictation` | Diktat stoppen | `#speech` `#handler` | `setAiDictationUi` |
| `startAiDictation` | Diktat starten | `#speech` `#handler` | `setAiDictationUi`, `t` |
| `initAiDictation` | Diktat initialisieren | `#init` `#speech` | `getSpeechRecognitionConstructor`, `getUiSpeechLocale`, `setAiDictationUi`, `t`, `toast` |

#### 16 · Einstellungen & FAQ `#settings` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `setSettingsOpen` | Settings öffnen/schließen | `#ui` `#handler` | `loadAiStatus`, `renderFaq`, `renderFavoritesManager`, `setActiveSettingsSection` |
| `openSettingsAt` | Settings bei Abschnitt öffnen | `#ui` `#handler` | `setActiveSettingsSection`, `setSettingsOpen` |
| `setActiveSettingsSection` | Aktiven Settings-Abschnitt setzen | `#ui` `#state` | `fetchGoogleCalendarStatus`, `loadTrashManage`, `loadUploadsManage`, `renderCalendarSettings` |
| `renderFaq` | FAQ rendern | `#render` `#help` | — |

#### 17 · Auto-Backup & Auto-Import `#backup` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `supportsDirectoryAccess` | Directory-Access-Support prüfen | `#check` `#fs` | — |
| `setAutoBackupStatus` | Backup-Status setzen | `#ui` `#state` | — |
| `setAutoImportStatus` | Import-Status setzen | `#ui` `#state` | — |
| `normalizeAutoInterval` | Auto-Intervall normalisieren | `#normalize` | — |
| `autoIntervalToMs` | Intervall → Millisekunden | `#convert` | — |
| `openFsHandleDb` | FS-Handle-DB öffnen | `#fs` `#storage` | `t` |
| `readFsHandle` | FS-Handle lesen | `#fs` `#read` | `openFsHandleDb`, `supportsDirectoryAccess`, `t` |
| `writeFsHandle` | FS-Handle schreiben | `#fs` `#write` | `openFsHandleDb`, `supportsDirectoryAccess`, `t` |
| `ensureDirPermission` | Verzeichnis-Berechtigung sichern | `#fs` `#security` | — |
| `updateAutoBackupFolderLabel` | Backup-Ordner-Label aktualisieren | `#ui` `#render` | — |
| `updateAutoImportFolderLabel` | Import-Ordner-Label aktualisieren | `#ui` `#render` | — |
| `applyAutoAccessSupportUi` | Auto-Access-UI anwenden | `#ui` `#apply` | `supportsDirectoryAccess` |
| `loadAutoBackupSettings` | Backup-Einstellungen laden | `#storage` `#load` | `normalizeAutoInterval` |
| `saveAutoBackupSettings` | Backup-Einstellungen speichern | `#storage` `#save` | — |
| `loadAutoImportSettings` | Import-Einstellungen laden | `#storage` `#load` | `normalizeAutoInterval` |
| `saveAutoImportSettings` | Import-Einstellungen speichern | `#storage` `#save` | — |
| `loadAutoImportSeen` | Gesehene Imports laden | `#storage` `#load` | — |
| `saveAutoImportSeen` | Gesehene Imports speichern | `#storage` `#save` | — |
| `buildAutoImportKey` | Import-Key erzeugen | `#build` `#key` | — |
| `scheduleAutoBackup` | Auto-Backup planen | `#debounce` `#schedule` | `autoIntervalToMs`, `runAutoBackup`, `supportsDirectoryAccess`, `t` |
| `scheduleAutoImport` | Auto-Import planen | `#debounce` `#schedule` | `autoIntervalToMs`, `runAutoImport`, `supportsDirectoryAccess`, `t` |
| `runAutoBackup` | Auto-Backup ausführen | `#handler` `#fs` | `ensureDirPermission`, `fetchPersonalSpaceExport`, `setAutoBackupStatus`, `t` |
| `runAutoImport` | Auto-Import ausführen | `#handler` `#fs` | `buildAutoImportKey`, `ensureDirPermission`, `importPersonalSpaceNotesFromText`, `saveAutoImportSeen`, `setAutoImportStatus`, `t` |
| `pickAutoBackupFolder` | Backup-Ordner wählen | `#handler` `#fs` | `runAutoBackup`, `setAutoBackupStatus`, `supportsDirectoryAccess`, `updateAutoBackupFolderLabel`, `writeFsHandle` |
| `pickAutoImportFolder` | Import-Ordner wählen | `#handler` `#fs` | `runAutoImport`, `setAutoImportStatus`, `supportsDirectoryAccess`, `t`, `updateAutoImportFolderLabel`, `writeFsHandle` |
| `initAutoBackup` | Auto-Backup initialisieren | `#init` | `applyAutoAccessSupportUi`, `loadAutoBackupSettings`, `readFsHandle`, `scheduleAutoBackup`, `updateAutoBackupFolderLabel` |
| `initAutoImport` | Auto-Import initialisieren | `#init` | `applyAutoAccessSupportUi`, `loadAutoImportSeen`, `loadAutoImportSettings`, `readFsHandle`, `scheduleAutoImport`, `t`, `updateAutoImportFolderLabel` |

#### 18 · Personal Space (Notizen) `#ps` — `app.js`

##### 18.1 PS Meta & YAML — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `stripManualTagsMarker` | Manuelle-Tags-Marker entfernen | `#strip` `#parse` | — |
| `stripPinnedTag` | Pinned-Tag entfernen | `#strip` `#parse` | — |
| `noteIsPinned` | Notiz gepinnt prüfen | `#check` `#pin` | — |
| `buildPsTagsPayload` | PS-Tags-Payload bauen | `#build` `#api` | `stripManualTagsMarker` |
| `setPsAutoSaveStatus` | Auto-Save-Status setzen | `#ui` `#state` | `updatePsSaveVisibility` |
| `updatePsSaveVisibility` | Save-Sichtbarkeit aktualisieren | `#ui` `#render` | `canAutoSavePsNote` |
| `schedulePsListRerender` | Listen-Rerender planen | `#debounce` `#render` | — |
| `ensureNoteUpdatedAt` | updatedAt sicherstellen | `#normalize` `#date` | — |
| `filterRealNotes` | Gültige Notizen filtern/entdoppeln | `#filter` `#dedupe` | — |
| `formatMetaDate` | Meta-Datum formatieren | `#format` `#date` | `t` |
| `buildNoteMetaYaml` | Meta-YAML bauen | `#build` `#yaml` | `ensureNoteUpdatedAt`, `formatMetaDate`, `stripManualTagsMarker`, `stripPinnedTag`, `t` |
| `setPsMetaVisible` | Meta-Sichtbarkeit setzen | `#ui` `#state` | `updateEditorMetaYaml`, `updatePreview` |
| `loadPsMetaVisible` | Meta-Sichtbarkeit laden | `#storage` `#load` | `setPsMetaVisible` |
| `savePsMetaVisible` | Meta-Sichtbarkeit speichern | `#storage` `#save` | — |
| `updateEditorMetaYaml` | Editor-Meta-YAML aktualisieren | `#render` `#yaml` | `buildNoteMetaYaml`, `findNoteById`, `resetEditorMetaPadding`, `updateEditorMetaPadding`, `updateEditorMetaScroll` |
| `updateEditorMetaScroll` | Editor-Meta-Scroll sync | `#sync` `#dom` | — |
| `updateEditorMetaPadding` | Editor-Meta-Padding setzen | `#dom` `#layout` | `t` |
| `resetEditorMetaPadding` | Editor-Meta-Padding zurücksetzen | `#dom` `#layout` | `t` |

##### 18.2 PS Notiz-Titel & Suche — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `cleanNoteTitleLine` | Titelzeile bereinigen | `#parse` `#strip` | — |
| `getNoteTitleAndExcerpt` | Titel+Auszug lesen | `#read` `#note` | `cleanNoteTitleLine`, `t` |
| `getNoteTitle` | Notiz-Titel lesen | `#read` `#note` | `getNoteTitleAndExcerpt`, `t` |
| `loadPsVisible` | PS-Sichtbarkeit laden | `#storage` `#load` | — |
| `savePsVisible` | PS-Sichtbarkeit speichern | `#storage` `#save` | — |
| `applyPsVisible` | PS-Sichtbarkeit anwenden | `#ui` `#apply` | — |
| `normalizeSearchQuery` | Suchbegriff normalisieren | `#normalize` `#search` | — |
| `loadPsSearchQuery` | Suchabfrage laden | `#storage` `#load` | — |
| `normalizePsSortMode` | Sort-Modus normalisieren | `#normalize` `#sort` | — |
| `setPsSortMenuOpen` | Sort-Menü öffnen/schließen | `#ui` `#menu` | — |
| `syncPsSortMenu` | Sort-Menü synchronisieren | `#ui` `#sync` | — |
| `loadPsNoteAccessed` | Notiz-Zugriffe laden | `#storage` `#load` | `t` |
| `savePsNoteAccessed` | Notiz-Zugriffe speichern | `#storage` `#save` | `t` |
| `markPsNoteAccessed` | Notiz-Zugriff markieren | `#handler` `#state` | `savePsNoteAccessed`, `t` |
| `loadPsSortMode` | Sort-Modus laden | `#storage` `#load` | `normalizePsSortMode`, `syncPsSortMenu` |
| `savePsSortMode` | Sort-Modus speichern | `#storage` `#save` | `normalizePsSortMode` |
| `savePsSearchQuery` | Suchabfrage speichern | `#storage` `#save` | — |
| `loadPsPinnedOnly` | Nur-Pinned laden | `#storage` `#load` | `updatePsPinnedToggle` |
| `savePsPinnedOnly` | Nur-Pinned speichern | `#storage` `#save` | — |
| `updatePsPinnedToggle` | Pinned-Toggle aktualisieren | `#ui` `#render` | — |
| `noteMatchesSearch` | Notiz-Suchfilter prüfen (Freitext + Phonetik) | `#filter` `#search` | `colognePhonetic` |
| `parseQueryTokens` | Query-String in strukturierte Operatoren + Freitext zerlegen | `#parse` `#query` `#search` | — |
| `extractNoteTasks` | Markdown-Tasks (`- [ ]`/`- [x]`) aus Text extrahieren | `#parse` `#query` `#task` | — |
| `parseDatePrefix` | Datumswert für Query-Datumsfilter parsen | `#parse` `#date` `#query` | — |
| `isQueryMode` | Prüft ob Sucheingabe Query-Operatoren enthält | `#parse` `#query` | — |
| `noteMatchesStructuredQuery` | Notiz gegen strukturierte Query-Token filtern | `#filter` `#query` | `extractNoteTasks`, `noteIsPinned`, `parseDatePrefix` |
| `renderQueryResults` | Aggregiertes Task-Ergebnis-Panel rendern | `#render` `#query` `#ui` | `applyNoteToEditor`, `escapeHtml`, `extractNoteTasks`, `filterRealNotes`, `findNoteById`, `getNoteTitle`, `t` |
| `applyPersonalSpaceFiltersAndRender` | Filter anwenden & rendern | `#render` `#filter` | `ensureNoteUpdatedAt`, `getNoteTitle`, `normalizeSearchQuery`, `noteIsPinned`, `noteMatchesSearch`, `noteMatchesStructuredQuery`, `parseQueryTokens`, `renderPsList`, `renderPsTags`, `renderQueryResults`, `t`, `updateEditorMetaYaml` |

##### 18.3 PS Tags-Prefs — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `loadPsTagsCollapsed` | Tags-Collapsed laden | `#storage` `#load` | — |
| `savePsTagsCollapsed` | Tags-Collapsed speichern | `#storage` `#save` | — |
| `applyPsTagsCollapsed` | Tags-Collapsed anwenden | `#ui` `#apply` | — |
| `loadPsTagPrefs` | Tag-Prefs laden | `#storage` `#load` | `t` |
| `savePsTagPrefs` | Tag-Prefs speichern | `#storage` `#save` | — |

##### 18.4 Passwort-Maskierung `#password` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `escapeHtml` | HTML escapen | `#html` `#security` | — |
| `renderPasswordToken` | Passwort-Token rendern | `#render` `#security` | `escapeHtml` |
| `copyTextToClipboard` | Text in Zwischenablage | `#clipboard` `#ui` | `t` |
| `togglePasswordField` | Passwort-Feld umschalten | `#handler` `#ui` | — |
| `loadEditorMaskDisabled` | Mask-Disabled laden | `#storage` `#load` | — |
| `saveEditorMaskDisabled` | Mask-Disabled speichern | `#storage` `#save` | — |
| `toggleEditorMaskView` | Mask-View umschalten | `#handler` `#ui` | `saveEditorMaskDisabled`, `setEditorMaskToggleUi`, `updatePasswordMaskOverlay` |
| `setEditorMaskToggleUi` | Mask-Toggle-UI setzen | `#ui` `#state` | — |
| `loadCrdtMarksPreference` | CRDT-Marks-Pref laden | `#storage` `#load` | — |
| `saveCrdtMarksPreference` | CRDT-Marks-Pref speichern | `#storage` `#save` | — |
| `setCrdtMarksToggleUi` | CRDT-Marks-Toggle-UI | `#ui` `#state` | — |
| `toggleCrdtMarks` | CRDT-Marks umschalten | `#handler` `#crdt` | `saveCrdtMarksPreference`, `setCrdtMarksToggleUi`, `updateAttributionOverlay` |
| `hasPasswordTokens` | Passwort-Tokens prüfen | `#check` `#security` | `t` |
| `maskPasswordTokens` | Passwort-Tokens maskieren | `#security` `#render` | `t` |
| `buildEditorMaskHtml` | Editor-Mask-HTML bauen | `#build` `#html` | `escapeHtml` |
| `syncPasswordMaskScroll` | Mask-Scroll synchronisieren | `#sync` `#dom` | — |
| `updatePasswordMaskOverlay` | Mask-Overlay aktualisieren | `#render` `#overlay` | `buildEditorMaskHtml`, `hasPasswordTokens`, `syncPasswordMaskScroll`, `updateAttributionOverlay` |

#### 19 · Preview & Rendering `#preview` — `app.js`

##### 19.1 Run-Output — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `getPreviewRunCombinedText` | Run-Combined-Text lesen | `#read` | — |
| `updateRunOutputUi` | Run-Output-UI aktualisieren | `#ui` `#render` | — |
| `updateRunOutputSizing` | Run-Output-Sizing | `#ui` `#layout` | `t` |
| `setPreviewRunOutput` | Run-Output setzen | `#handler` `#render` | `escapeHtml`, `getPreviewRunCombinedText`, `t`, `updateRunOutputSizing`, `updateRunOutputUi` |
| `parseRunnableFromEditor` | Runnable-Block parsen | `#parse` `#code` | `t` |

##### 19.2 Code-Language & Fenced-Blocks — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `getSelectedCodeLang` | Code-Sprache lesen | `#read` `#code` | — |
| `getFencedCodeOpenAtPos` | Fenced-Code an Position prüfen | `#parse` `#code` | *(umfangreiche Abhängigkeiten)* |
| `setFencedCodeLanguage` | Fenced-Code-Sprache setzen | `#edit` `#code` | *(umfangreiche Abhängigkeiten)* |
| `updateCodeLangOverlay` | Code-Lang-Overlay aktualisieren | `#render` `#overlay` | `getFencedCodeOpenAtPos`, `resetEditorMetaPadding`, `updateEditorMetaPadding`, `updateEditorMetaScroll` |
| `insertCodeBlock` | Code-Block einfügen | `#edit` `#code` | `getSelectedCodeLang`, `nowIso`, `scheduleSend`, `updateCodeLangOverlay`, `updatePasswordMaskOverlay`, `updatePreview` |

##### 19.3 Markdown & Rendering — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `ensureMarkdown` | Markdown-Lib laden | `#loader` `#markdown` | `escapeHtml`, `renderPasswordToken`, `t` |
| `applyHljsToHtml` | Syntax-Highlighting anwenden | `#render` `#highlight` | `t` |
| `embedPdfLinks` | PDF-Links einbetten | `#render` `#pdf` | `t` |
| `buildNoteTitleIndex` | Notiz-Titel-Index bauen | `#build` `#index` | `getNoteTitle`, `t` |
| `applyWikiLinksToMarkdown` | Wiki-Links in Markdown | `#render` `#wiki` | `buildNoteTitleIndex`, `t` |
| `renderNoteHtml` | Notiz → HTML rendern | `#render` `#markdown` | `ensureMarkdown`, `t`, `toast` |
| `setFullPreview` | Full-Preview setzen | `#ui` `#state` | `t`, `updateRunOutputSizing` |
| `setPreviewVisible` | Preview-Sichtbarkeit setzen | `#ui` `#state` | `ensureMarkdown`, `setFullPreview`, `syncMobileFocusState`, `t`, `toast`, `updatePreview`, `updateRunOutputSizing`, `updateRunOutputUi` |
| `updatePreview` | Preview aktualisieren | `#render` `#main` | `allTaskCheckboxes`, `applyHljsToHtml`, `applyWikiLinksToMarkdown`, `buildNoteMetaYaml`, `buildToc`, `embedPdfLinks`, `ensureMarkdown`, `ensurePdfJsLoaded`, `escapeHtml`, `findCheckbox`, `findNoteById`, `getNoteHrefTarget`, `getPdfRenderId`, `indexOfCheckbox`, `initImageTools`, `initPdfEmbeds`, `renderPdfPage`, `send`, `setExpanded`, `setPasswordRevealed`, `setPreviewDocument`, `slugify`, `t`, `toElement`, `updatePdfNav`, `wrapImage` |

##### 19.4 Helfer & PDF — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `send` | WS-Nachricht senden (low-level) | `#ws` `#send` | — |
| `slugify` | Slug erzeugen | `#format` `#url` | — |
| `buildToc` | Inhaltsverzeichnis bauen | `#build` `#render` | `setExpanded`, `slugify`, `t` |
| `setExpanded` | Expandiert setzen | `#ui` `#state` | — |
| `getNoteHrefTarget` | Notiz-Link-Target lesen | `#read` `#link` | — |
| `toElement` | String → DOM-Element | `#dom` `#parse` | — |
| `findCheckbox` | Checkbox finden | `#dom` `#search` | `t`, `toElement` |
| `allTaskCheckboxes` | Alle Task-Checkboxen | `#dom` `#search` | — |
| `indexOfCheckbox` | Checkbox-Index | `#dom` `#search` | `allTaskCheckboxes` |
| `setPasswordRevealed` | Passwort aufdecken | `#handler` `#security` | — |
| `wrapImage` | Bild wrappen | `#dom` `#render` | `t` |
| `initImageTools` | Image-Tools initialisieren | `#init` `#dom` | `wrapImage` |
| `getPdfRenderId` | PDF-Render-ID lesen | `#read` `#pdf` | — |
| `updatePdfNav` | PDF-Nav aktualisieren | `#ui` `#pdf` | — |
| `renderPdfPage` | PDF-Seite rendern | `#render` `#pdf` | `getPdfRenderId`, `send` |
| `initPdfEmbeds` | PDF-Embeds initialisieren | `#init` `#pdf` | `renderPdfPage`, `t` |
| `toggleMarkdownTaskAtIndex` | Markdown-Task umschalten | `#handler` `#checkbox` | `getActiveRoomTabNoteId`, `schedulePsAutoSave`, `scheduleSend`, `t`, `updateLocalNoteText`, `updatePreview` |
| `attachPreviewCheckboxWriteback` | Checkbox-Writeback anbinden | `#handler` `#checkbox` | `findCheckbox`, `indexOfCheckbox`, `nowIso`, `t`, `toElement`, `toggleMarkdownTaskAtIndex` |
| `setPreviewDocument` | Preview-Document setzen | `#handler` `#render` | `attachPreviewCheckboxWriteback`, `t` |

##### 18.4b PS Tags-Verwaltung `#tags` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `sortTagList` | Tag-Liste sortieren | `#sort` `#render` | `t` |
| `buildTagSections` | Tag-Sections bauen | `#build` `#render` | `isMonthTag`, `isYearTag`, `sortTagList`, `t` |
| `loadPsTagSectionState` | Tag-Section-State laden | `#load` `#storage` | — |
| `savePsTagSectionState` | Tag-Section-State speichern | `#save` `#storage` | — |
| `normalizeSingleTag` | Einzelnen Tag normalisieren | `#normalize` | `normalizeManualTags` |
| `dedupeRawTags` | Rohe Tags deduplizieren | `#dedupe` | `t` |
| `updateNotesForTagChange` | Notizen für Tag-Änderung aktualisieren | `#api` `#sync` | `api`, `applyPersonalSpaceFiltersAndRender`, `dedupeRawTags`, `rebuildPsTagsFromNotes`, `t`, `toast` |
| `resetPsTagContextDelete` | Tag-Kontext-Löschen zurücksetzen | `#ui` `#reset` | `t` |
| `setPsTagContextMenuOpen` | Tag-Kontext-Menü öffnen/schließen | `#ui` `#context-menu` | — |
| `positionPsTagContextMenu` | Tag-Kontext-Menü positionieren | `#ui` `#context-menu` | `t` |
| `closePsTagContextMenu` | Tag-Kontext-Menü schließen | `#ui` `#context-menu` | `resetPsTagContextDelete`, `setPsTagContextMenuOpen` |
| `openPsTagContextMenu` | Tag-Kontext-Menü öffnen | `#ui` `#context-menu` | `closePsContextMenu`, `positionPsTagContextMenu`, `resetPsTagContextDelete`, `setPsTagContextMenuOpen`, `t` |
| `applyPsTagContextValue` | Tag-Kontext-Wert anwenden | `#handler` `#context-menu` | `closePsTagContextMenu`, `normalizeSingleTag`, `t`, `toast`, `updateNotesForTagChange` |
| `applyPsTagContextInput` | Tag-Kontext-Input anwenden | `#handler` `#context-menu` | `applyPsTagContextValue` |
| `confirmPsTagContextDelete` | Tag-Löschen bestätigen | `#handler` `#context-menu` | `closePsTagContextMenu`, `updateNotesForTagChange` |
| `updatePsTagsActiveInfo` | Tags-Active-Info aktualisieren | `#ui` `#state` | — |
| `renderPsTags` | PS-Tags rendern | `#render` `#main` | `buildTagSections`, `loadPsTagSectionState`, `openPsTagContextMenu`, `refreshPersonalSpace`, `savePsTagPrefs`, `savePsTagSectionState`, `t`, `updatePsTagsActiveInfo` |
| `togglePinnedForNote` | Notiz-Pinned umschalten | `#handler` `#pin` | `api`, `applyPersonalSpaceFiltersAndRender`, `buildPsTagsPayload`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `refreshPersonalSpace`, `splitTagsForEditor`, `stripManualTagsMarker`, `stripPinnedTag`, `syncPsEditorTagsInput`, `t`, `toast`, `updatePsEditingTagsHint` |

##### 18.5 PS Notiz-Navigation — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `findNoteById` | Notiz per ID finden | `#search` `#note` | — |
| `updatePsNoteNavButtons` | Nav-Buttons aktualisieren | `#ui` `#nav` | — |
| `pushPsNoteHistory` | Notiz-History pushen | `#history` `#nav` | `updatePsNoteNavButtons` |
| `navigatePsNoteHistory` | In History navigieren | `#history` `#nav` | `applyNoteToEditor`, `findNoteById`, `updatePsNoteNavButtons` |
| `rebuildPsTagsFromNotes` | Tags aus Notizen neubauen | `#build` `#sync` | `t`, `updatePsEditorTagsSuggest` |
| `updateEditingNoteTagsLocal` | Tags lokal aktualisieren | `#handler` `#state` | `applyPersonalSpaceFiltersAndRender`, `buildEditorSystemTags`, `buildPsTagsPayload`, `rebuildPsTagsFromNotes`, `uniqTags` |
| `schedulePsTagsAutoSave` | Tags-Auto-Save planen | `#debounce` `#save` | `savePersonalSpaceNote`, `t` |
| `findNoteByTitle` | Notiz per Titel finden | `#search` `#note` | `getNoteTitle`, `t` |
| `normalizeNoteTextForCompare` | Notiz-Text normalisieren | `#normalize` | — |
| `findNoteByText` | Notiz per Text finden | `#search` `#note` | `normalizeNoteTextForCompare`, `t` |
| `clearPsEditingNoteState` | Editing-State löschen | `#state` `#reset` | `getDateTagsForTs`, `syncPsEditorTagsInput`, `t`, `updateEditorMetaYaml`, `updatePsEditingTagsHint` |
| `syncPsEditingNoteFromEditorText` | Editing-State aus Editor sync | `#sync` `#state` | `applyPersonalSpaceFiltersAndRender`, `clearPsEditingNoteState`, `findNoteByText`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeNoteTextForCompare`, `normalizeYearTag`, `splitTagsForEditor`, `syncPsEditorTagsInput`, `t`, `updateEditorMetaYaml`, `updatePsEditingTagsHint` |
| `applyNoteToEditor` | Notiz → Editor | `#handler` `#load` | `applyPersonalSpaceFiltersAndRender`, `isMobileViewport`, `markPsNoteAccessed`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `pushPsNoteHistory`, `renderPsList`, `setPreviewVisible`, `setPsAutoSaveStatus`, `setRoomTabNoteId`, `splitTagsForEditor`, `syncMobileFocusState`, `syncPsEditorTagsInput`, `t`, `updateEditorMetaYaml`, `updatePasswordMaskOverlay`, `updatePreview`, `updatePsEditingTagsHint`, `updateRoomTabTextLocal` |
| `openNoteFromWikiTarget` | Notiz aus Wiki-Link öffnen | `#handler` `#wiki` | `applyNoteToEditor`, `findNoteById`, `findNoteByTitle`, `t`, `toast` |

##### 18.6 PS Context-Menü & Bulk — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `syncPsListHeight` | Listen-Höhe synchronisieren | `#ui` `#dom` | `t` |
| `setPsContextMenuOpen` | Kontext-Menü öffnen/schließen | `#ui` `#context-menu` | — |
| `positionPsContextMenu` | Kontext-Menü positionieren | `#ui` `#context-menu` | `t` |
| `openPsContextMenu` | Kontext-Menü öffnen | `#handler` `#context-menu` | `closePsTagContextMenu`, `positionPsContextMenu`, `setPsContextMenuOpen` |
| `closePsContextMenu` | Kontext-Menü schließen | `#handler` `#context-menu` | `setPsContextMenuOpen` |
| `updatePsBulkBar` | Bulk-Bar aktualisieren | `#ui` `#bulk` | `syncPsBulkSelectionToDom` |
| `syncPsBulkSelectionToDom` | Bulk-Selection → DOM | `#sync` `#dom` | — |
| `prunePsSelectedNotes` | Auswahl bereinigen | `#handler` `#bulk` | `t`, `updatePsBulkBar` |
| `setPsNoteSelected` | Notiz selektieren | `#handler` `#bulk` | `updatePsBulkBar` |
| `togglePsSelectAll` | Alle selektieren/deselektieren | `#handler` `#bulk` | `updatePsBulkBar` |
| `clearPsSelection` | Auswahl löschen | `#handler` `#bulk` | `t`, `updatePsBulkBar` |
| `getSelectedNoteIds` | Selektierte IDs lesen | `#read` `#bulk` | — |
| `applyBulkTagsToNotes` | Bulk-Tags anwenden | `#api` `#bulk` | `api`, `buildPsTagsPayload`, `findNoteById`, `t`, `toast` |
| `deleteBulkNotes` | Bulk-Notizen löschen | `#api` `#bulk` | `api`, `syncMobileFocusState`, `t`, `toast` |

##### 18.7 PS Tags-Verwaltung (erweitert) — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `sortTagList` | Tag-Liste sortieren | `#sort` `#render` | `t` |
| `buildTagSections` | Tag-Sektionen bauen | `#build` `#render` | `isMonthTag`, `isYearTag`, `sortTagList`, `t` |
| `loadPsTagSectionState` | Tag-Section-State laden | `#load` `#storage` | — |
| `savePsTagSectionState` | Tag-Section-State speichern | `#save` `#storage` | — |
| `normalizeSingleTag` | Einzelnen Tag normalisieren | `#normalize` | `normalizeManualTags` |
| `dedupeRawTags` | Roh-Tags entdoppeln | `#dedupe` | `t` |
| `updateNotesForTagChange` | Notizen für Tag-Änderung updaten | `#api` `#sync` | `api`, `applyPersonalSpaceFiltersAndRender`, `dedupeRawTags`, `rebuildPsTagsFromNotes`, `t`, `toast` |
| `resetPsTagContextDelete` | Tag-Kontext-Löschen zurücksetzen | `#ui` `#reset` | `t` |
| `setPsTagContextMenuOpen` | Tag-Kontext-Menü öffnen/schließen | `#ui` `#context-menu` | — |
| `positionPsTagContextMenu` | Tag-Kontext-Menü positionieren | `#ui` `#context-menu` | `t` |
| `closePsTagContextMenu` | Tag-Kontext-Menü schließen | `#ui` `#context-menu` | `resetPsTagContextDelete`, `setPsTagContextMenuOpen` |
| `openPsTagContextMenu` | Tag-Kontext-Menü öffnen | `#handler` `#context-menu` | `closePsContextMenu`, `positionPsTagContextMenu`, `resetPsTagContextDelete`, `setPsTagContextMenuOpen`, `t` |
| `applyPsTagContextValue` | Tag-Kontext-Wert anwenden | `#handler` `#context-menu` | `closePsTagContextMenu`, `normalizeSingleTag`, `t`, `toast`, `updateNotesForTagChange` |
| `applyPsTagContextInput` | Tag-Kontext-Input anwenden | `#handler` `#context-menu` | `applyPsTagContextValue` |
| `confirmPsTagContextDelete` | Tag-Kontext-Löschen bestätigen | `#handler` `#context-menu` | `closePsTagContextMenu`, `updateNotesForTagChange` |
| `updatePsTagsActiveInfo` | Tags-Active-Info aktualisieren | `#ui` `#state` | — |
| `renderPsTags` | PS-Tags rendern | `#render` `#main` | `buildTagSections`, `loadPsTagSectionState`, `openPsTagContextMenu`, `refreshPersonalSpace`, `savePsTagPrefs`, `savePsTagSectionState`, `t`, `updatePsTagsActiveInfo` |
| `togglePinnedForNote` | Pinned für Notiz umschalten | `#handler` `#pin` | `api`, `applyPersonalSpaceFiltersAndRender`, `buildPsTagsPayload`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `refreshPersonalSpace`, `splitTagsForEditor`, `stripManualTagsMarker`, `stripPinnedTag`, `syncPsEditorTagsInput`, `t`, `toast`, `updatePsEditingTagsHint` |

##### 18.8 PS Liste & Save — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `renderPsList` | PS-Liste rendern (Hauptfunktion) | `#render` `#main` | _massiv – siehe Code_ |
| `canAutoSavePsNote` | Auto-Save prüfen | `#check` `#state` | — |
| `savePersonalSpaceNote` | PS-Notiz speichern | `#api` `#save` | `api`, `applyNoteToEditor`, `applyPersonalSpaceFiltersAndRender`, `buildEditorSystemTags`, `buildPsTagsPayload`, `findNoteByText`, `refreshPersonalSpace`, `setPsAutoSaveStatus`, `syncPsEditingNoteTagsFromState`, `t`, `toast`, `uniqTags`, `updateEditorMetaYaml`, `updateRoomTabsForNoteId` |
| `schedulePsAutoSave` | PS-Auto-Save planen | `#debounce` `#save` | `canAutoSavePsNote`, `savePersonalSpaceNote`, `setPsAutoSaveStatus`, `t` |

#### 19 · Preview & Rendering `#preview` — `app.js`

##### 19.1 Code-Runner-Output — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `getPreviewRunCombinedText` | Run-Ausgabetext lesen | `#read` `#runner` | — |
| `updateRunOutputUi` | Run-Output-UI aktualisieren | `#ui` `#runner` | — |
| `updateRunOutputSizing` | Run-Output-Größe anpassen | `#ui` `#resize` | `t` |
| `setPreviewRunOutput` | Run-Output setzen | `#handler` `#runner` | `escapeHtml`, `getPreviewRunCombinedText`, `t`, `updateRunOutputSizing`, `updateRunOutputUi` |

##### 19.2 Code-Blöcke & Sprache — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `parseRunnableFromEditor` | Runnable aus Editor parsen | `#parse` `#code` | `t` |
| `getSelectedCodeLang` | Selektierte Code-Sprache lesen | `#read` `#code` | — |
| `getFencedCodeOpenAtPos` | Fenced-Code-Block an Position | `#parse` `#code` | _viele interne Deps_ |
| `setFencedCodeLanguage` | Fenced-Code-Sprache setzen | `#edit` `#code` | _viele interne Deps_ |
| `updateCodeLangOverlay` | Code-Lang-Overlay aktualisieren | `#render` `#overlay` | `getFencedCodeOpenAtPos`, `resetEditorMetaPadding`, `updateEditorMetaPadding`, `updateEditorMetaScroll` |
| `insertCodeBlock` | Code-Block einfügen | `#edit` `#code` | `getSelectedCodeLang`, `nowIso`, `scheduleSend`, `updateCodeLangOverlay`, `updatePasswordMaskOverlay`, `updatePreview` |

##### 19.3 Markdown & HTML — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `ensureMarkdown` | Markdown-Lib laden | `#loader` `#markdown` | `escapeHtml`, `renderPasswordToken`, `t` |
| `applyHljsToHtml` | Syntax-Highlighting anwenden | `#render` `#highlight` | `t` |
| `embedPdfLinks` | PDF-Links einbetten | `#render` `#pdf` | `t` |
| `buildNoteTitleIndex` | Notiz-Titel-Index bauen | `#build` `#index` | `getNoteTitle`, `t` |
| `applyWikiLinksToMarkdown` | Wiki-Links in Markdown | `#render` `#wiki` | `buildNoteTitleIndex`, `t` |
| `renderNoteHtml` | Notiz-HTML rendern | `#render` `#markdown` | `ensureMarkdown`, `t`, `toast` |
| `setFullPreview` | Vollbild-Preview setzen | `#ui` `#state` | `t`, `updateRunOutputSizing` |
| `setPreviewVisible` | Preview sichtbar setzen | `#ui` `#state` | `ensureMarkdown`, `setFullPreview`, `syncMobileFocusState`, `t`, `toast`, `updatePreview`, `updateRunOutputSizing`, `updateRunOutputUi` |
| `updatePreview` | Preview aktualisieren (Haupt) | `#render` `#main` | `allTaskCheckboxes`, `applyHljsToHtml`, `applyWikiLinksToMarkdown`, `buildNoteMetaYaml`, `buildToc`, `embedPdfLinks`, `ensureMarkdown`, `ensurePdfJsLoaded`, `escapeHtml`, `findCheckbox`, `findNoteById`, `getNoteHrefTarget`, `getPdfRenderId`, `indexOfCheckbox`, `initImageTools`, `initPdfEmbeds`, `renderPdfPage`, `send`, `setExpanded`, `setPasswordRevealed`, `setPreviewDocument`, `slugify`, `t`, `toElement`, `updatePdfNav`, `wrapImage` |

##### 19.4 Preview-Helfer — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `send` | Send-Helper | `#ws` `#send` | — |
| `slugify` | Text → Slug | `#format` `#url` | — |
| `buildToc` | Inhaltsverzeichnis bauen | `#build` `#render` | `setExpanded`, `slugify`, `t` |
| `setExpanded` | Expanded-State setzen | `#ui` `#state` | — |
| `getNoteHrefTarget` | Note-Href-Target lesen | `#read` `#link` | — |
| `toElement` | String → DOM-Element | `#dom` `#parse` | — |
| `findCheckbox` | Checkbox finden | `#dom` `#search` | `t`, `toElement` |
| `allTaskCheckboxes` | Alle Task-Checkboxen | `#dom` `#search` | — |
| `indexOfCheckbox` | Checkbox-Index | `#dom` `#search` | `allTaskCheckboxes` |
| `setPasswordRevealed` | Passwort-Reveal setzen | `#handler` `#security` | — |
| `wrapImage` | Bild wrappen | `#dom` `#render` | `t` |
| `initImageTools` | Image-Tools initialisieren | `#init` `#dom` | `wrapImage` |
| `getPdfRenderId` | PDF-Render-ID lesen | `#read` `#pdf` | — |
| `updatePdfNav` | PDF-Navigation aktualisieren | `#ui` `#pdf` | — |
| `renderPdfPage` | PDF-Seite rendern | `#render` `#pdf` | `getPdfRenderId`, `send` |
| `initPdfEmbeds` | PDF-Embeds initialisieren | `#init` `#pdf` | `renderPdfPage`, `t` |
| `toggleMarkdownTaskAtIndex` | Markdown-Task umschalten | `#handler` `#checkbox` | `getActiveRoomTabNoteId`, `schedulePsAutoSave`, `scheduleSend`, `t`, `updateLocalNoteText`, `updatePreview` |
| `attachPreviewCheckboxWriteback` | Checkbox-Writeback anhängen | `#handler` `#checkbox` | `findCheckbox`, `indexOfCheckbox`, `nowIso`, `t`, `toElement`, `toggleMarkdownTaskAtIndex` |
| `setPreviewDocument` | Preview-Dokument setzen | `#handler` `#render` | `attachPreviewCheckboxWriteback`, `t` |
| `applyTaskClosedTimestampsToHtml` | Task-Closed-Timestamps anwenden | `#render` `#date` | — |

#### 20 · Code-Runner `#runner` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `ensureJsRunnerFrame` | JS-Runner-Frame sichern | `#init` `#js` | `t` |
| `runJsSnippet` | JS-Snippet ausführen | `#exec` `#js` | `ensureJsRunnerFrame`, `send`, `t` |
| `normalizeBase` | Base-URL normalisieren | `#normalize` `#url` | — |
| `ensurePyodide` | Pyodide laden | `#loader` `#python` | `normalizeBase` |
| `ensurePyRunnerWorker` | Python-Runner-Worker sichern | `#init` `#python` | `ensurePyodide`, `normalizeBase`, `t` |
| `runPySnippet` | Python-Snippet ausführen | `#exec` `#python` | `ensurePyRunnerWorker`, `t` |
| `runSnippetForNote` | Snippet für Notiz ausführen | `#exec` `#handler` | `renderPsList`, `runJsSnippet`, `runPySnippet`, `t`, `toast` |
| `getAiMode` | AI-Modus ermitteln | `#read` `#ai` | — |
| `aiAssistFromPreview` | AI-Assist aus Preview | `#api` `#ai` | `api`, `getAiApiConfig`, `getAiMode`, `getAiPrompt`, `getAiUseAnswer`, `getAiUsePreview`, `parseRunnableFromEditor`, `saveAiPrompt`, `setPreviewRunOutput`, `t`, `toast` |

#### 21 · Import/Export `#import` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `refreshPersonalSpace` | Personal Space neu laden | `#api` `#init` | `api`, `applyPersonalSpaceFiltersAndRender`, `clearPsSelection`, `dedupeFavorites`, `ensureNoteUpdatedAt`, `maybeStartMobileAutoNoteSession`, `renderRoomTabs`, `setPsAutoSaveStatus`, `setPsEditorTagsVisible`, `syncCalendarSettingsFromServer`, `syncLocalRoomTabsToServer`, `syncPsEditingNoteTagsFromState`, `syncPsEditorTagsInput`, `t`, `updateEditorMetaYaml`, `updateFavoritesUI`, `updatePsNoteNavButtons`, `updatePsPinnedToggle` |
| `downloadJson` | JSON herunterladen | `#export` `#fs` | `t`, `toast` |
| `ymd` | Datum → YYYY-MM-DD | `#format` `#date` | `t` |
| `fetchPersonalSpaceExport` | PS-Export abrufen | `#api` `#export` | `api` |
| `exportPersonalSpaceNotes` | PS-Notizen exportieren | `#handler` `#export` | `downloadJson`, `fetchPersonalSpaceExport`, `t`, `toast`, `ymd` |
| `importPersonalSpaceNotes` | PS-Notizen importieren | `#api` `#import` | `api`, `refreshPersonalSpace`, `t`, `toast` |
| `chunkTextIntoNotes` | Text in Notizen aufteilen | `#parse` `#import` | — |
| `importPersonalSpaceNotesFromText` | PS-Notizen aus Text importieren | `#handler` `#import` | `importPersonalSpaceNotes`, `t`, `toast` |
| `importPersonalSpaceFile` | PS-Datei importieren | `#handler` `#import` | `chunkTextIntoNotes`, `importPersonalSpaceNotes`, `importPersonalSpaceNotesFromText`, `t`, `toast` |
| `startNotesImport` | Notiz-Import starten | `#handler` `#import` | `t`, `toast` |
| `requestPersonalSpaceLink` | PS-Link anfordern | `#api` `#share` | `api`, `modalPrompt`, `t`, `toast` |
| `randomRoom` | Zufälligen Raum erzeugen | `#build` `#room` | `normalizeRoom`, `t` |

#### 22 · Favoriten `#favorites` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `normalizeFavoriteEntry` | Favorit-Eintrag normalisieren | `#normalize` | `normalizeKey`, `normalizeRoom` |
| `dedupeFavorites` | Favoriten entdoppeln | `#dedupe` | `normalizeFavoriteEntry`, `t` |
| `loadLocalFavorites` | Lokale Favoriten laden | `#load` `#storage` | `dedupeFavorites` |
| `loadFavorites` | Favoriten laden | `#load` `#storage` | `dedupeFavorites`, `loadLocalFavorites` |
| `saveFavorites` | Favoriten speichern | `#save` `#storage` | `dedupeFavorites` |
| `findFavoriteIndex` | Favorit-Index finden | `#search` | `loadFavorites` |
| `upsertFavoriteInState` | Favorit in State upserten | `#state` `#upsert` | `normalizeFavoriteEntry` |
| `renderFavorites` | Favoriten rendern | `#render` `#main` | _viele Deps – Kalender, Tabs, etc._ |
| `renderFavoritesManager` | Favoriten-Manager rendern | `#render` `#ui` | `dedupeFavorites`, `escapeAttr`, `escapeHtml`, `loadFavorites`, `t` |
| `updateFavoriteText` | Favorit-Text aktualisieren | `#api` `#handler` | `api`, `dedupeFavorites`, `loadFavorites`, `normalizeKey`, `normalizeRoom`, `saveFavorites`, `updateFavoritesUI` |
| `removeFavorite` | Favorit entfernen | `#api` `#handler` | `api`, `dedupeFavorites`, `loadFavorites`, `normalizeKey`, `normalizeRoom`, `saveFavorites`, `updateFavoritesUI` |
| `updateFavoriteButton` | Favorit-Button aktualisieren | `#ui` `#state` | `findFavoriteIndex` |
| `ensureFavoriteForSharedRoom` | Geteilten Raum automatisch als Favorit speichern | `#auto` `#share` `#handler` | `loadFavorites`, `normalizeFavoriteEntry`, `dedupeFavorites`, `saveFavorites`, `api`, `updateFavoritesUI` |
| `updateFavoritesUI` | Favoriten-UI aktualisieren (Haupt) | `#render` `#main` | _massiv – fast alle Module_ |

#### 23 · Room-Tabs `#tabs` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `normalizeRoomTabEntry` | Room-Tab-Eintrag normalisieren | `#normalize` | `normalizeKey`, `normalizeRoom` |
| `dedupeRoomTabs` | Room-Tabs entdoppeln | `#dedupe` | `normalizeKey`, `normalizeRoom`, `normalizeRoomTabEntry`, `t` |
| `showRoomTabLimitModal` | Tab-Limit-Modal zeigen | `#ui` `#modal` | `openModal` |
| `mergeRoomTabs` | Room-Tabs mergen | `#sync` `#merge` | `normalizeRoomTabEntry`, `t` |
| `loadLocalRoomTabs` | Lokale Room-Tabs laden | `#load` `#storage` | `dedupeRoomTabs`, `saveRoomTabs` |
| `loadRoomTabs` | Room-Tabs laden | `#load` `#storage` | `dedupeRoomTabs`, `loadLocalRoomTabs`, `mergeRoomTabs` |
| `saveRoomTabs` | Room-Tabs speichern | `#save` `#storage` | `dedupeRoomTabs` |
| `getActiveRoomTabNoteId` | Aktive Room-Tab-Note-ID | `#read` `#state` | — |
| `resolveRoomTabSnapshotText` | Room-Tab-Snapshot auflösen | `#read` `#state` | — |
| `upsertRoomTabInState` | Room-Tab in State upserten | `#state` `#upsert` | `normalizeRoomTabEntry` |
| `removeRoomTabFromState` | Room-Tab aus State entfernen | `#state` `#remove` | `normalizeKey`, `normalizeRoom` |
| `updateRoomTabTextLocal` | Room-Tab-Text lokal updaten | `#handler` `#state` | `dedupeRoomTabs`, `getActiveRoomTabNoteId`, `loadRoomTabs`, `normalizeKey`, `normalizeRoom`, `resolveRoomTabSnapshotText`, `saveRoomTabs`, `t` |
| `updateRoomTabsForNoteId` | Room-Tabs für Note-ID updaten | `#handler` `#sync` | `dedupeRoomTabs`, `loadRoomTabs`, `saveRoomTabs` |
| `setRoomTabNoteId` | Room-Tab-Note-ID setzen | `#handler` `#state` | `dedupeRoomTabs`, `loadRoomTabs`, `normalizeKey`, `normalizeRoom`, `saveRoomTabs` |
| `findRoomTabByNoteId` | Room-Tab per Note-ID finden | `#search` | `loadRoomTabs` |
| `updateLocalNoteText` | Lokalen Notiz-Text updaten | `#handler` `#state` | — |
| `syncRoomTabToServer` | Room-Tab → Server synchen | `#api` `#sync` | `api`, `normalizeKey`, `normalizeRoom`, `renderRoomTabs`, `upsertRoomTabInState` |
| `scheduleRoomTabSync` | Room-Tab-Sync planen | `#debounce` `#sync` | `syncRoomTabToServer`, `t` |
| `flushRoomTabSync` | Room-Tab-Sync flushen | `#handler` `#sync` | `getActiveRoomTabNoteId`, `resolveRoomTabSnapshotText`, `scheduleRoomTabSync`, `t` |
| `syncLocalRoomTabsToServer` | Lokale Room-Tabs → Server | `#api` `#sync` | `loadLocalRoomTabs`, `normalizeKey`, `normalizeRoom`, `syncRoomTabToServer`, `t` |
| `touchRoomTab` | Room-Tab berühren | `#handler` `#state` | `dedupeRoomTabs`, `getActiveRoomTabNoteId`, `loadRoomTabs`, `normalizeKey`, `normalizeRoom`, `resolveRoomTabSnapshotText`, `saveRoomTabs`, `scheduleRoomTabSync`, `showRoomTabLimitModal`, `t` |
| `escapeHtml` | HTML escapen (Tabs-Kontext) | `#html` `#escape` | — |
| `escapeAttr` | Attribut escapen | `#html` `#escape` | `escapeHtml` |
| `renderRoomTabs` | Room-Tabs rendern | `#render` `#main` | `escapeAttr`, `escapeHtml`, `loadRoomTabs` |
| `closeRoomTab` | Room-Tab schließen | `#handler` `#remove` | `api`, `buildShareHash`, `loadRoomTabs`, `normalizeKey`, `normalizeRoom`, `randomKey`, `randomRoom`, `removeRoomTabFromState`, `renderRoomTabs`, `saveRoomTabs` |

#### 24 · Room-Pins (Permanent Links) `#pins` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `normalizeRoomPinnedEntry` | Room-Pinned-Eintrag normalisieren | `#normalize` | `normalizeKey`, `normalizeRoom` |
| `mergeRoomPinnedEntries` | Room-Pinned-Einträge mergen | `#sync` `#merge` | `normalizeRoomPinnedEntry` |
| `loadLocalRoomPinnedEntries` | Lokale Pinned-Entries laden | `#load` `#storage` | `normalizeRoomPinnedEntry`, `saveRoomPinnedEntries` |
| `loadRoomPinnedEntries` | Room-Pinned-Entries laden | `#load` `#storage` | `loadLocalRoomPinnedEntries`, `mergeRoomPinnedEntries` |
| `saveRoomPinnedEntries` | Room-Pinned-Entries speichern | `#save` `#storage` | `normalizeRoomPinnedEntry` |
| `getRoomPinnedEntry` | Room-Pinned-Entry lesen | `#read` `#state` | `loadRoomPinnedEntries`, `normalizeKey`, `normalizeRoom` |
| `setRoomPinnedEntry` | Room-Pinned-Entry setzen | `#handler` `#state` | `loadRoomPinnedEntries`, `normalizeKey`, `normalizeRoom`, `normalizeRoomPinnedEntry`, `saveRoomPinnedEntries`, `syncRoomPinToServer` |
| `clearRoomPinnedEntry` | Room-Pinned-Entry löschen | `#handler` `#remove` | `loadRoomPinnedEntries`, `normalizeKey`, `normalizeRoom`, `removeRoomPinFromState`, `saveRoomPinnedEntries` |
| `isPinnedContentActiveForRoom` | Pinned-Content aktiv prüfen | `#check` `#state` | `getRoomPinnedEntry` |
| `shouldSyncRoomContentNow` | Room-Sync prüfen | `#check` `#state` | `isPinnedContentActiveForRoom` |
| `syncPermanentLinkToggleUi` | Permanent-Link-Toggle-UI sync | `#ui` `#sync` | `getRoomPinnedEntry` |
| `upsertRoomPinInState` | Room-Pin in State upserten | `#state` `#upsert` | `normalizeRoomPinnedEntry` |
| `removeRoomPinFromState` | Room-Pin aus State entfernen | `#state` `#remove` | `normalizeKey`, `normalizeRoom` |
| `syncRoomPinToServer` | Room-Pin → Server synchen | `#api` `#sync` | `api`, `normalizeKey`, `normalizeRoom`, `upsertRoomPinInState` |
| `syncLocalRoomPinsToServer` | Lokale Room-Pins → Server | `#api` `#sync` | `loadLocalRoomPinnedEntries`, `normalizeRoomPinnedEntry`, `syncRoomPinToServer` |
| `isRoomMarkedShared` | Raum als geteilt markiert prüfen | `#check` `#state` | `loadSharedRooms`, `normalizeKey`, `normalizeRoom` |
| `markRoomShared` | Raum als geteilt markieren (auto/manual) | `#handler` `#state` | `loadSharedRooms`, `normalizeKey`, `normalizeRoom`, `saveSharedRooms`, `syncSharedRoomToServer`, `renderSharedRoomsManager`, `ensureFavoriteForSharedRoom`, `manuallyUnsharedRooms` |
| `removeSharedRoom` | Geteilten Raum entfernen + Auto-Re-Mark blockieren | `#handler` `#remove` | `loadSharedRooms`, `normalizeKey`, `normalizeRoom`, `saveSharedRooms`, `api`, `renderRoomTabs`, `renderSharedRoomsManager`, `manuallyUnsharedRooms` |
| `clearSharedRooms` | Alle geteilten Räume entfernen + Auto-Re-Mark blockieren | `#handler` `#remove` | `loadSharedRooms`, `saveSharedRooms`, `api`, `renderRoomTabs`, `renderSharedRoomsManager`, `manuallyUnsharedRooms` |

#### 25 · Uploads & Trash-Verwaltung `#uploads` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `formatUploadUpdatedAt` | Upload-Datum formatieren | `#format` `#date` | — |
| `renderUploadsManageList` | Upload-Liste rendern | `#render` `#ui` | `escapeAttr`, `escapeHtml`, `formatBytes`, `formatUploadUpdatedAt`, `t` |
| `formatTrashDeletedAt` | Trash-Datum formatieren | `#format` `#date` | — |
| `renderTrashManageList` | Trash-Liste rendern | `#render` `#ui` | `escapeAttr`, `escapeHtml`, `fmtDate`, `formatTrashDeletedAt`, `getNoteTitleAndExcerpt`, `t` |
| `loadUploadsManage` | Uploads laden | `#api` `#load` | `api`, `renderUploadsManageList`, `t` |
| `loadTrashManage` | Trash laden | `#api` `#load` | `api`, `renderTrashManageList`, `t` |
| `restoreTrashNote` | Trash-Notiz wiederherstellen | `#api` `#handler` | `api`, `loadTrashManage`, `refreshPersonalSpace`, `t`, `toast` |
| `deleteUpload` | Upload löschen | `#api` `#handler` | `api`, `loadUploadsManage`, `t`, `toast` |

#### 26 · Kalender `#calendar` — `app.js`

##### 26.1 Quellen & Settings — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `normalizeCalendarSource` | Kalender-Quelle normalisieren | `#normalize` | `createClientId` |
| `loadCalendarSources` | Quellen laden | `#load` `#storage` | — |
| `saveCalendarSources` | Quellen speichern | `#save` `#storage` | `scheduleCalendarSettingsSync` |
| `loadCalendarDefaultView` | Standard-Ansicht laden | `#load` `#storage` | — |
| `saveCalendarDefaultView` | Standard-Ansicht speichern | `#save` `#storage` | `renderCalendarPanel`, `scheduleCalendarSettingsSync`, `updateCalendarViewButtons` |
| `getLocalCalendarSettings` | Lokale Kalender-Einstellungen lesen | `#read` `#state` | `loadCalendarDefaultView`, `loadCalendarGoogleId`, `loadCalendarSources`, `loadLocalCalendarEventsRaw` |
| `applyCalendarSettings` | Kalender-Einstellungen anwenden | `#handler` `#state` | `renderCalendarPanel`, `renderCalendarSettings`, `saveCalendarDefaultView`, `saveCalendarGoogleId`, `saveCalendarSources`, `saveLocalCalendarEvents`, `scheduleCalendarRefresh` |
| `syncCalendarSettingsToServer` | Settings → Server synchen | `#api` `#sync` | `api` |
| `scheduleCalendarSettingsSync` | Settings-Sync debounce | `#debounce` `#sync` | `getLocalCalendarSettings`, `syncCalendarSettingsToServer`, `t` |
| `syncCalendarSettingsFromServer` | Settings ← Server synchen | `#api` `#sync` | `applyCalendarSettings`, `getLocalCalendarSettings`, `scheduleCalendarSettingsSync` |
| `renderCalendarSettings` | Settings-UI rendern | `#render` `#ui` | `escapeAttr`, `loadCalendarDefaultView`, `loadCalendarSources`, `renderCalendarGoogleSelect`, `renderCalendarLocalEvents`, `t` |

##### 26.2 Google Calendar — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `renderCalendarGoogleSelect` | Google-Kalender-Auswahl rendern | `#render` `#google` | `escapeAttr`, `escapeHtml`, `loadCalendarGoogleId` |
| `setGoogleCalendarUi` | Google-UI setzen | `#ui` `#google` | `renderCalendarGoogleSelect`, `t` |
| `fetchGoogleCalendarList` | Google-Kalender-Liste abrufen | `#api` `#google` | `api`, `renderCalendarGoogleSelect`, `t` |
| `fetchGoogleCalendarStatus` | Google-Status prüfen | `#api` `#google` | `api`, `fetchGoogleCalendarList`, `saveCalendarGoogleId`, `setGoogleCalendarUi`, `t` |
| `createGoogleCalendarEvent` | Google-Event erstellen | `#api` `#google` | `api`, `formatDateInputValue`, `t` |
| `deleteGoogleCalendarEvent` | Google-Event löschen | `#api` `#google` | `api`, `t` |
| `loadCalendarGoogleId` | Google-ID laden | `#load` `#storage` | — |
| `saveCalendarGoogleId` | Google-ID speichern | `#save` `#storage` | `renderCalendarSettings`, `scheduleCalendarSettingsSync` |
| `fetchGoogleCalendarEvents` | Google-Events abrufen | `#api` `#google` | `api`, `parseGoogleDate`, `t` |

##### 26.3 Panel & Darstellung — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `setCalendarPanelActive` | Panel aktivieren | `#handler` `#state` | `applyCalendarFreeSlotsVisibility`, `fetchGoogleCalendarStatus`, `loadCalendarDefaultView`, `refreshCalendarEvents`, `renderCalendarPanel`, `renderRoomTabs`, `updateCalendarViewButtons` |
| `setCalendarSidebarCollapsed` | Sidebar ein-/ausklappen | `#ui` `#state` | — |
| `startOfDay` | Tagesanfang berechnen | `#date` `#calc` | — |
| `addDays` | Tage addieren | `#date` `#calc` | — |
| `startOfWeek` | Wochenanfang berechnen | `#date` `#calc` | `startOfDay` |
| `startOfMonth` | Monatsanfang berechnen | `#date` `#calc` | — |
| `formatTime` | Zeit formatieren | `#format` `#date` | `getUiLocale` |
| `formatDayLabel` | Tageslabel formatieren | `#format` `#date` | `getUiLocale` |
| `formatCalendarTitle` | Kalender-Titel formatieren | `#format` `#date` | `addDays`, `getUiLocale`, `startOfWeek` |
| `getIsoWeekNumber` | ISO-Wochennummer berechnen | `#date` `#calc` | — |
| `updateCalendarViewButtons` | View-Buttons aktualisieren | `#ui` `#state` | — |
| `getCalendarEvents` | Events lesen | `#read` `#state` | — |
| `renderCalendarLegend` | Legende rendern | `#render` `#ui` | `escapeAttr`, `escapeHtml`, `loadCalendarSources` |
| `moveCalendarCursor` | Cursor bewegen | `#handler` `#nav` | `renderCalendarPanel` |
| `renderCalendarPanel` | Panel rendern | `#render` `#main` | `addDays`, `escapeAttr`, `escapeHtml`, `formatCalendarTitle`, `formatDayLabel`, `formatTime`, `getCalendarEvents`, `getIsoWeekNumber`, `loadCalendarSources`, `renderCalendarFreeSlots`, `renderCalendarLegend`, `startOfDay`, `startOfMonth`, `startOfWeek`, `t` |

##### 26.4 Lokale Events & ICS — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `renderCalendarLocalEvents` | Lokale Events rendern | `#render` `#ui` | `escapeAttr`, `escapeHtml`, `formatTime`, `getUiLocale`, `t` |
| `loadCalendarFreeSlotsVisible` | Free-Slots-Sichtbarkeit laden | `#load` `#storage` | — |
| `saveCalendarFreeSlotsVisible` | Free-Slots-Sichtbarkeit speichern | `#save` `#storage` | `applyCalendarFreeSlotsVisibility` |
| `applyCalendarFreeSlotsVisibility` | Free-Slots-Sichtbarkeit anwenden | `#ui` `#state` | — |
| `parseLocalEventDate` | Lokales Event-Datum parsen | `#parse` `#date` | — |
| `normalizeLocalCalendarEvent` | Lokales Event normalisieren | `#normalize` | `createClientId`, `parseLocalEventDate` |
| `serializeLocalCalendarEvent` | Lokales Event serialisieren | `#format` `#storage` | — |
| `loadLocalCalendarEventsRaw` | Rohe lokale Events laden | `#load` `#storage` | — |
| `loadLocalCalendarEvents` | Lokale Events laden | `#load` `#storage` | `loadLocalCalendarEventsRaw` |
| `saveLocalCalendarEvents` | Lokale Events speichern | `#save` `#storage` | `renderCalendarPanel`, `renderCalendarSettings`, `scheduleCalendarSettingsSync` |
| `parseIcsDate` | ICS-Datum parsen | `#parse` `#ics` | `t` |
| `parseGoogleDate` | Google-Datum parsen | `#parse` `#google` | `t` |
| `unfoldIcsLines` | ICS-Zeilen entfalten | `#parse` `#ics` | `t` |
| `parseIcsEvents` | ICS-Events parsen | `#parse` `#ics` | `addDays`, `createClientId`, `parseIcsDate`, `t`, `unfoldIcsLines` |
| `mergeCalendarEvents` | Events zusammenführen | `#merge` `#state` | — |
| `getCalendarRange` | Kalender-Range berechnen | `#calc` `#date` | `addDays`, `startOfDay`, `startOfMonth`, `startOfWeek` |

##### 26.5 Rendering & Free-Slots — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `refreshCalendarEvents` | Events aktualisieren | `#api` `#refresh` | `fetchGoogleCalendarEvents`, `getCalendarRange`, `loadCalendarSources`, `mergeCalendarEvents`, `parseIcsEvents`, `renderCalendarPanel`, `t` |
| `scheduleCalendarRefresh` | Refresh debounce | `#debounce` | `refreshCalendarEvents`, `t` |
| `buildWorkWindow` | Arbeitszeitfenster bauen | `#build` `#calc` | — |
| `mergeIntervals` | Intervalle zusammenführen | `#calc` `#merge` | `t` |
| `computeFreeSlotsForDay` | Freie Slots pro Tag berechnen | `#calc` `#render` | `addDays`, `buildWorkWindow`, `mergeIntervals`, `startOfDay` |
| `renderCalendarFreeSlots` | Free-Slots rendern | `#render` `#ui` | `addDays`, `computeFreeSlotsForDay`, `formatDayLabel`, `formatTime`, `startOfWeek` |

##### 26.6 Event-Modal — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `formatDateInputValue` | Datumswert formatieren | `#format` `#date` | `t` |
| `openCalendarEventModal` | Event-Modal öffnen | `#handler` `#modal` | `formatDateInputValue`, `t`, `updateCalendarEventTimeState` |
| `closeCalendarEventModal` | Event-Modal schließen | `#handler` `#modal` | — |
| `updateCalendarEventTimeState` | Zeitstatus aktualisieren | `#ui` `#state` | — |
| `buildLocalEventFromModal` | Lokales Event aus Modal bauen | `#build` `#handler` | `addDays`, `createClientId`, `t`, `toast` |
| `addLocalCalendarEvent` | Lokales Event hinzufügen | `#handler` `#save` | `saveLocalCalendarEvents`, `t`, `toast` |
#### 27 · Status, Recent Rooms & Share-UI `#status` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `updateFavoriteText` | Favoriten-Text aktualisieren | `#api` `#handler` | `api`, `dedupeFavorites`, `loadFavorites`, `normalizeKey`, `normalizeRoom`, `saveFavorites`, `updateFavoritesUI` |
| `removeFavorite` | Favorit entfernen | `#api` `#handler` | `api`, `dedupeFavorites`, `loadFavorites`, `normalizeKey`, `normalizeRoom`, `saveFavorites`, `updateFavoritesUI` |
| `updateFavoriteButton` | Favoriten-Button aktualisieren | `#ui` `#state` | `findFavoriteIndex` |
| `updateFavoritesUI` | Favoriten-UI aktualisieren | `#render` `#main` | *(umfangreiche Abhängigkeiten — Init-Handler)* |
| `loadRecentRooms` | Recent-Rooms laden | `#load` `#storage` | — |
| `saveRecentRoom` | Recent-Room speichern | `#save` `#storage` | `loadRecentRooms` |
| `renderRecentRooms` | Recent-Rooms rendern | `#render` `#ui` | `loadRecentRooms` |
| `buildShareHref` | Share-URL bauen | `#build` `#url` | `buildShareHash` |
| `updateShareLink` | Share-Link aktualisieren | `#ui` `#share` | `buildShareHref`, `updateShareModalLink` |
| `setStatus` | Verbindungs-Status setzen | `#ui` `#state` | — |
| `setHeaderCollapsed` | Header ein-/ausklappen | `#ui` `#state` | — |

#### 28 · WebSocket & CRDT `#ws` `#crdt` — `app.js`

##### 28.1 WS-Verbindung — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `wsDisplay` | WS-Status anzeigen | `#ui` `#state` | — |
| `hashKeyForWs` | Key für WS hashen | `#crypto` `#hash` | `t` |
| `wsUrlForRoom` | WS-URL bauen | `#build` `#url` | `hashKeyForWs`, `t` |
| `isCrdtAvailable` | CRDT verfügbar? | `#check` `#state` | — |
| `isCrdtEnabled` | CRDT aktiv? | `#check` `#state` | — |
| `isE2eeActive` | E2EE aktiv? | `#check` `#security` | — |
| `ensureYjsLoaded` | Yjs-Laden sicherstellen | `#loader` `#init` | `isCrdtAvailable`, `t` |
| `nowIso` | ISO-Zeitstempel | `#format` `#date` | `getUiLocale` |
| `safeJsonParse` | JSON sicher parsen | `#parse` `#json` | — |
| `sanitizeLegacySnapshotText` | Legacy-Snapshot bereinigen | `#normalize` `#legacy` | `safeJsonParse` |

##### 28.2 CRDT-Nachrichten — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `sendMessage` | WS-Nachricht senden | `#ws` `#send` | `send` |
| `sendCrdtUpdate` | CRDT-Update senden | `#ws` `#crdt` | `encryptForRoom`, `isE2eeActive`, `sendMessage` |
| `sendCrdtSnapshot` | CRDT-Snapshot senden | `#ws` `#crdt` | `encryptForRoom`, `isE2eeActive`, `sendMessage` |
| `buildSetMessage` | Set-Nachricht bauen | `#build` `#ws` | `encryptForRoom` |
| `sendCurrentState` | Aktuellen State senden | `#ws` `#send` | `buildSetMessage`, `sendMessage` |
| `scheduleSend` | Send debounce | `#debounce` `#ws` | `buildSetMessage`, `isCrdtEnabled`, `nowIso`, `sendMessage`, `t` |
| `applyRemoteText` | Remote-Text anwenden | `#handler` `#sync` | `applySyncedText`, `t` |

##### 28.3 CRDT-Core — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `applySyncedText` | Synced-Text anwenden | `#handler` `#sync` | `getActiveRoomTabNoteId`, `nowIso`, `resolveRoomTabSnapshotText`, `sanitizeLegacySnapshotText`, `scheduleRoomTabSync`, `t`, `updatePasswordMaskOverlay`, `updatePreview`, `updateRoomTabTextLocal` |
| `initCrdt` | CRDT initialisieren | `#init` `#crdt` | `applyPendingCrdtBootstrap`, `applySyncedText`, `base64EncodeBytes`, `isCrdtAvailable`, `scheduleCrdtSnapshot`, `sendCrdtUpdate`, `t`, `updateAttributionOverlay` |
| `destroyCrdt` | CRDT zerstören | `#cleanup` `#crdt` | `t`, `updateAttributionOverlay` |
| `applyCrdtUpdate` | CRDT-Update anwenden | `#handler` `#crdt` | `base64DecodeBytes`, `updateAttributionOverlay` |
| `setCrdtText` | CRDT-Text setzen | `#handler` `#crdt` | `applySyncedText`, `sanitizeLegacySnapshotText`, `scheduleCrdtSnapshot`, `t`, `updateAttributionOverlay` |
| `updateCrdtFromTextarea` | CRDT ← Textarea | `#handler` `#crdt` | `t`, `updateAttributionOverlay` |
| `scheduleCrdtSnapshot` | Snapshot debounce | `#debounce` `#crdt` | `base64EncodeBytes`, `sendCrdtSnapshot`, `t` |
| `applyPendingCrdtBootstrap` | Pending Bootstrap anwenden | `#handler` `#crdt` | `applyCrdtUpdate`, `setCrdtText`, `t` |
| `connect` | WS verbinden | `#init` `#ws` | `announceClientId`, `applyCrdtUpdate`, `applyPresenceUpdate`, `applyRemoteText`, `createClientId`, `decryptForRoom`, `destroyCrdt`, `ensureYjsLoaded`, `initCrdt`, `isCrdtAvailable`, `isCrdtEnabled`, `safeJsonParse`, `scheduleCrdtSnapshot`, `sendCurrentState`, `sendMessage`, `setCrdtText`, `setStatus`, `t`, `toast`, `updatePresenceUI`, `upsertPresence`, `wsDisplay`, `wsUrlForRoom` |
#### 29 · Presence `#presence` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `updatePresenceUI` | Presence-UI aktualisieren | `#render` `#ui` | `formatUi`, `t`, `updateAttributionOverlay` |
| `upsertPresence` | Presence einfügen/aktualisieren | `#handler` `#state` | `t`, `updatePresenceUI` |
| `applyPresenceUpdate` | Presence-Update anwenden | `#handler` `#sync` | `t`, `updatePresenceUI` |
| `getAuthorMeta` | Autor-Meta lesen | `#read` `#state` | `t` |
| `parseHexColor` | Hex-Farbe parsen | `#parse` `#color` | `t` |
| `colorToRgba` | Farbe → RGBA | `#format` `#color` | `parseHexColor` |
| `syncAttributionOverlayScroll` | Attribution-Overlay-Scroll synchen | `#ui` `#scroll` | — |
| `buildAttributionHtml` | Attribution-HTML bauen | `#build` `#render` | `colorToRgba`, `escapeHtml`, `getAuthorMeta` |
| `updateAttributionOverlay` | Attribution-Overlay aktualisieren | `#render` `#ui` | `buildAttributionHtml`, `syncAttributionOverlayScroll` |
| `setTyping` | Typing-Status setzen | `#handler` `#ws` | `applyPresenceUpdate`, `sendMessage` |
| `scheduleTypingStop` | Typing-Stop debounce | `#debounce` `#ws` | `setTyping`, `t` |
| `scheduleSelectionSend` | Selection-Send debounce | `#debounce` `#ws` | `applyPresenceUpdate`, `sendMessage`, `t` |

#### 30 · Navigation `#nav` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `goToRoom` | Zu Raum navigieren | `#handler` `#nav` | `buildShareHash`, `flushRoomTabSync`, `normalizeRoom`, `setCalendarPanelActive` |
| `goToRoomWithKey` | Zu Raum + Key navigieren | `#handler` `#nav` | `buildShareHash`, `flushRoomTabSync`, `normalizeKey`, `normalizeRoom`, `setCalendarPanelActive` |

#### 31 · Linear-Integration `#linear` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `readLinearApiKeyInput` | Liest API-Key aus Input-Feld | `#read` `#settings` | — |
| `fetchLinearProjectsFromApi` | Projekte von Linear-API laden | `#api` `#load` | `linearRequest`, `readLinearApiKeyInput`, `t`, `toast` |
| `fetchLinearTasksForProject` | Tasks eines Projekts von API laden | `#api` `#load` | `linearRequest`, `readLinearApiKeyInput`, `sendLinearDataForNote`, `renderLinearTasks`, `t`, `toast` |
| `updateLinearProjectSelectOptions` | Projekt-Dropdown aktualisieren | `#render` `#ui` | `linearProjectByNote`, `linearProjects`, `t` |
| `renderLinearTasks` | Linear-Tasks als Kanban rendern | `#render` `#ui` | `getLinearDataForNote`, `getLinearStatusColor`, `linearProjectByNote`, `t` |
| `renderLinearStats` | Linear-Statistik rendern | `#render` `#ui` | `getLinearDataForNote`, `linearProjectByNote` |
| `setLinearProjectForNote` | Projekt einer Notiz zuweisen | `#state` `#sync` | `linearProjectByNote`, `sendLinearStateForNote`, `updateLinearProjectSelectOptions` |
| `syncLinearForNote` | Linear für Notiz synchen | `#sync` `#state` | `loadLinearOffsetForNote`, `setLinearVisible`, `updateLinearProjectSelectOptions`, `renderLinearTasks`, `sendLinearStateForNote`, `sendLinearDataForNote` |
| `sendLinearStateForNote` | Linear-State per WS senden | `#ws` `#sync` | `getLinearStateForNote`, `sendMessage` |
| `sendLinearDataForNote` | Linear-Daten per WS senden | `#ws` `#sync` | `getLinearDataForNote`, `sendMessage` |
| `linearProjectApplyBtn` (click) | Projekt auswählen und laden | `#handler` `#ui` | `linearProjectByNote`, `readLinearApiKeyInput`, `fetchLinearTasksForProject`, `renderLinearTasks`, `setLinearProjectForNote`, `t`, `toast` |
| `linearRefreshBtn` (click) | Projekt-Tasks aktualisieren | `#handler` `#ui` | `linearProjectByNote`, `readLinearApiKeyInput`, `fetchLinearTasksForProject`, `sendMessage`, `t`, `toast` |
| `toggleLinear` (click) | Linear-Panel umschalten | `#handler` `#ui` | `setLinearVisible`, `updateLinearProjectSelectOptions`, `t`, `toast` |

#### 32 · Synchronisation & Fokus `#sync` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `refreshSyncOnFocus` | Sync bei Fokus auffrischen | `#handler` `#sync` | `connect`, `isCrdtEnabled`, `sendMessage`, `t` |
| `canAutoSavePsNote` | Auto-Save möglich prüfen | `#check` `#state` | — |
| `savePersonalSpaceNote` | PS-Notiz speichern | `#api` `#save` | `api`, `applyNoteToEditor`, `applyPersonalSpaceFiltersAndRender`, `buildEditorSystemTags`, `buildPsTagsPayload`, `findNoteByText`, `refreshPersonalSpace`, `setPsAutoSaveStatus`, `syncPsEditingNoteTagsFromState`, `t`, `toast`, `uniqTags`, `updateEditorMetaYaml`, `updateRoomTabsForNoteId` |
| `schedulePsAutoSave` | PS-Auto-Save debounce | `#debounce` `#save` | `canAutoSavePsNote`, `savePersonalSpaceNote`, `setPsAutoSaveStatus`, `t` |

#### 33 · Initialisierung `#init` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `initUiEventListeners` | UI-Event-Listener initialisieren | `#init` `#handler` | *(umfangreiche Abhängigkeiten — bindet alle UI-Events)* |
| `initStartupTasks` | Startup-Tasks ausführen | `#init` `#main` | `applyAiContextMode`, `initAiDictation`, `initAutoBackup`, `initAutoImport`, `initUiLanguage`, `loadAiPrompt`, `loadAiUseAnswer`, `loadAiUsePreview`, `loadCommentsForRoom`, `loadMobileAutoNoteSeconds`, `refreshPersonalSpace`, `setCommentDraftSelection`, `startPsPolling`, `syncMobileFocusState`, `t`, `updateTableMenuVisibility` |
| `schedulePsAutoRefresh` | PS-Notizen auto-refresh mit Debounce (5s) | `#sync` `#debounce` | `refreshPersonalSpace` |
| `startPsPolling` | Startet periodisches PS-Polling (60s Intervall) | `#sync` `#polling` | `schedulePsAutoRefresh` |
| `stopPsPolling` | Stoppt periodisches PS-Polling | `#sync` `#polling` | — |

#### 34 · Offline-Modus (PWA + IndexedDB + Sync-Queue) `#offline` — `app.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `openOfflineDb` | IndexedDB-Offline-Datenbank öffnen/erstellen | `#storage` `#init` | — |
| `offlinePutNote` | Einzelne Notiz in IndexedDB speichern | `#storage` `#save` | `openOfflineDb` |
| `offlinePutNotes` | Notiz-Array in IndexedDB spiegeln (Full-Sync: clear + put) | `#storage` `#save` `#sync` | `openOfflineDb` |
| `offlineGetAllNotes` | Alle Notizen aus IndexedDB laden | `#storage` `#load` | `openOfflineDb` |
| `offlineDeleteNote` | Notiz aus IndexedDB löschen | `#storage` `#delete` | `openOfflineDb` |
| `offlineEnqueueOp` | Pending-Operation in Sync-Queue einreihen | `#sync` `#save` | `openOfflineDb` |
| `offlineGetAllOps` | Alle Pending-Operationen aus Queue lesen | `#sync` `#load` | `openOfflineDb` |
| `offlineClearOps` | Sync-Queue leeren | `#sync` `#delete` | `openOfflineDb` |
| `offlineSaveMeta` | Meta-Datum in IndexedDB speichern (z.B. Email) | `#storage` `#save` | `openOfflineDb` |
| `offlineLoadMeta` | Meta-Datum aus IndexedDB laden | `#storage` `#load` | `openOfflineDb` |
| `offlineSaveNote` | Notiz offline speichern + Op in Queue einreihen | `#offline` `#save` | `offlinePutNote`, `offlineEnqueueOp`, `offlineGetAllNotes` |
| `replayOfflineOps` | Sync-Queue bei Reconnect abspielen (Create/Update/Delete) | `#offline` `#sync` | `api`, `offlineGetAllOps`, `offlineClearOps`, `offlineDeleteNote`, `offlinePutNote`, `refreshPersonalSpace`, `t`, `toast` |
| `isAppOffline` | Prüft ob App offline ist (`navigator.onLine`) | `#offline` `#check` | — |

##### Zugehörige Dateien (nicht in `app.js`)

| Datei | Zweck | Tags |
|-------|-------|------|
| `sw.js` | Service Worker — Pre-Cache + Stale-While-Revalidate für statische Assets | `#offline` `#cache` |
| `manifest.json` | PWA Web-App-Manifest — Standalone-Installation, Icons, Theme | `#offline` `#pwa` |

---

### server.js — Funktionskatalog

#### S1 · Server-Core & Datenbank `#server` `#db` — `server.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `getClientIp` | Client-IP lesen | `#read` `#http` | — |
| `checkAiRateLimit` | AI-Rate-Limit prüfen | `#check` `#security` | — |
| `ensureDbDir` | DB-Verzeichnis sicherstellen | `#init` `#fs` | — |
| `initDb` | DB initialisieren | `#init` `#db` | `ensureDbDir` |
| `loadPersistedRoomState` | Room-State laden | `#load` `#db` | `initDb` |
| `persistRoomState` | Room-State persistieren | `#save` `#db` | `initDb` |
| `getSigningSecret` | Signing-Secret lesen | `#read` `#security` | `initDb` |

#### S2 · HTTP-Helfer `#http` — `server.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `mimeTypeForPath` | MIME-Type ermitteln | `#read` `#format` | — |
| `safeJsonParse` | JSON sicher parsen | `#parse` `#json` | — |
| `json` | JSON-Response senden | `#send` `#http` | — |
| `text` | Text-Response senden | `#send` `#http` | — |
| `redirect` | Redirect senden | `#send` `#http` | — |
| `readBody` | Body lesen | `#read` `#http` | — |
| `readBodyWithLimit` | Body mit Limit lesen | `#read` `#security` | — |
| `readJson` | JSON-Body lesen | `#read` `#http` | `readBody`, `safeJsonParse` |
| `readJsonWithLimit` | JSON-Body mit Limit lesen | `#read` `#security` | `readBodyWithLimit`, `safeJsonParse` |

#### S3 · Auth & Session `#auth` — `server.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `parseCookies` | Cookies parsen | `#parse` `#http` | — |
| `cookieOptions` | Cookie-Optionen bauen | `#build` `#http` | — |
| `sign` | HMAC signieren | `#crypto` `#security` | `getSigningSecret` |
| `makeSessionCookie` | Session-Cookie erstellen | `#build` `#auth` | `cookieOptions`, `sign` |
| `clearSessionCookie` | Session-Cookie löschen | `#handler` `#auth` | — |
| `getAuthedEmail` | Auth-Email lesen | `#read` `#auth` | `parseCookies`, `sign` |
| `normalizeEmail` | Email normalisieren | `#normalize` | — |
| `saveLoginToken` | Login-Token speichern | `#save` `#db` | `initDb` |
| `getLoginToken` | Login-Token lesen | `#read` `#db` | `initDb` |
| `deleteLoginToken` | Login-Token löschen | `#handler` `#db` | `initDb` |
| `getOrigin` | Origin lesen | `#read` `#http` | — |
| `sendMagicLinkEmail` | Magic-Link-Email senden | `#handler` `#auth` | — |

#### S4 · Uploads `#uploads` — `server.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `ensureUploadsDir` | Upload-Verzeichnis sicherstellen | `#init` `#fs` | — |
| `cleanupUploads` | Uploads aufräumen | `#handler` `#fs` | `ensureUploadsDir` |
| `sanitizeFilename` | Dateiname bereinigen | `#normalize` `#security` | — |
| `decodeDataUrl` | Data-URL dekodieren | `#parse` `#format` | — |
| `isAllowedUploadMime` | Upload-MIME prüfen | `#check` `#security` | — |
| `extForMime` | Extension für MIME | `#read` `#format` | — |

#### S5 · Notes, Tags & Favoriten `#notes` `#tags` — `server.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `uniq` | Duplikate entfernen | `#helper` `#dedupe` | — |
| `extractHashtags` | Hashtags extrahieren | `#parse` `#tags` | — |
| `classifyText` | Text klassifizieren | `#handler` `#tags` | `applyDateTags`, `computeNoteContentHash`, `extractHashtags`, `getDateTagsForTs`, `getOrCreateUserId`, `initDb`, `isMonthTag`, `isValidNoteId`, `isYearTag`, `listNotes`, `mergeManualTags`, `normalizeImportTags`, `normalizeNoteTextForHash`, `parseTagsJson`, `splitManualOverrideTags`, `uniq` |
| `parseTagsJson` | Tags-JSON parsen | `#parse` `#json` | — |
| `normalizeImportTags` | Import-Tags normalisieren | `#normalize` `#tags` | `uniq` |
| `isYearTag` | Jahres-Tag prüfen | `#check` `#tags` | — |
| `isMonthTag` | Monats-Tag prüfen | `#check` `#tags` | — |
| `getDateTagsForTs` | Datums-Tags für Timestamp | `#build` `#tags` | — |
| `applyDateTags` | Datums-Tags anwenden | `#handler` `#tags` | `getDateTagsForTs`, `isMonthTag`, `isYearTag`, `uniq` |
| `splitManualOverrideTags` | Manuelle Override-Tags splitten | `#parse` `#tags` | `normalizeImportTags` |
| `mergeManualTags` | Manuelle Tags mergen | `#handler` `#tags` | `classifyText`, `extractHashtags`, `normalizeImportTags`, `uniq` |
| `isValidNoteId` | Notiz-ID validieren | `#check` | — |
| `normalizeNoteTextForHash` | Notiz-Text für Hash normalisieren | `#normalize` | — |
| `computeNoteContentHash` | Notiz-Content-Hash berechnen | `#crypto` `#hash` | `normalizeNoteTextForHash` |
| `getOrCreateUserId` | User-ID erstellen/lesen | `#handler` `#db` | `initDb` |
| `listNotes` | Notizen auflisten | `#read` `#db` | `initDb`, `parseTagsJson` |
| `purgeExpiredTrash` | Abgelaufenen Trash löschen | `#handler` `#db` | `initDb` |
| `listTrashNotes` | Trash-Notizen auflisten | `#read` `#db` | `initDb`, `parseTagsJson` |
| `listTags` | Tags auflisten | `#read` `#db` | `initDb`, `parseTagsJson`, `uniq` |
| `listFavorites` | Favoriten auflisten | `#read` `#db` | `initDb` |
| `listRoomTabs` | Room-Tabs auflisten | `#read` `#db` | `initDb` |

#### S6 · Calendar & Google `#calendar` `#google` — `server.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `sanitizeCalendarSettings` | Kalender-Settings bereinigen | `#normalize` `#security` | — |
| `parseCalendarJson` | Kalender-JSON parsen | `#parse` `#json` | `sanitizeCalendarSettings` |
| `getUserSettings` | User-Settings lesen | `#read` `#db` | `initDb`, `parseCalendarJson` |
| `upsertUserSettings` | User-Settings schreiben | `#save` `#db` | `initDb`, `sanitizeCalendarSettings` |
| `googleConfigured` | Google konfiguriert? | `#check` `#google` | — |
| `makeGoogleState` | Google-State erstellen | `#build` `#google` | `sign` |
| `parseGoogleState` | Google-State parsen | `#parse` `#google` | `sign` |
| `getGoogleTokens` | Google-Tokens lesen | `#read` `#db` | `initDb` |
| `saveGoogleTokens` | Google-Tokens speichern | `#save` `#db` | `initDb` |
| `deleteGoogleTokens` | Google-Tokens löschen | `#handler` `#db` | `initDb` |
| `getGoogleCalendarIdForUser` | Google-Kalender-ID lesen | `#read` `#google` | `getUserSettings` |
| `refreshGoogleAccessToken` | Google-Token auffrischen | `#api` `#google` | `json` |
| `getGoogleAccessToken` | Google-Access-Token lesen | `#api` `#google` | `getGoogleTokens`, `refreshGoogleAccessToken`, `saveGoogleTokens` |

#### S7 · WebSocket & Presence `#ws` `#presence` — `server.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `clampRoom` | Room-Name begrenzen | `#normalize` `#security` | — |
| `clampKey` | Key begrenzen | `#normalize` `#security` | — |
| `roomKey` | Room-Key bauen | `#build` | — |
| `getRoomSockets` | Room-Sockets lesen | `#read` `#state` | — |
| `getRoomPresence` | Room-Presence lesen | `#read` `#state` | — |
| `buildPresenceList` | Presence-Liste bauen | `#build` `#render` | `getRoomPresence` |
| `sendPresenceState` | Presence-State senden | `#ws` `#send` | `buildPresenceList` |
| `broadcastPresenceState` | Presence broadcasten | `#ws` `#send` | `broadcast`, `buildPresenceList` |
| `broadcast` | An Room broadcasten | `#ws` `#send` | `getRoomSockets` |

#### S8 · AI / Anthropic `#ai` — `server.js`

| Funktion | Zweck | Tags | Abhängigkeiten |
|----------|-------|------|----------------|
| `formatInputForUserPrompt` | Input für User-Prompt formatieren | `#format` `#build` | — |
| `buildUserPrompt` | User-Prompt bauen | `#build` `#ai` | `formatInputForUserPrompt` |
| `callAnthropic` | Anthropic API aufrufen | `#api` `#ai` | `safeJsonParse`, `text` |
| `runWithModelFallback` | Mit Model-Fallback ausführen | `#handler` `#ai` | `callAnthropic` |
| `extractText` | Text extrahieren | `#parse` `#ai` | — |
| `shouldRetryRunOutput` | Run-Output Retry prüfen | `#check` `#ai` | — |
| `extractFencedCodeBlocks` | Fenced-Code-Blöcke extrahieren | `#parse` `#code` | — |
| `coerceRunModeText` | Run-Mode-Text umwandeln | `#format` `#ai` | `extractFencedCodeBlocks` |
| `chunkText` | Text in Chunks teilen | `#parse` `#format` | — |

#### S9 · AI / FLUX.2 Bildgenerierung `#ai` `#image` `#flux` — `server.js`

| Funktion / Handler | Zweck | Tags | Abhängigkeiten |
|--------------------|-------|------|----------------|
| `POST /api/ai/image` | Bildgenerierung via FLUX.2 (BFL API) | `#api` `#ai` `#image` | `getAuthedEmail`, `getOrCreateUserId`, `getUserBflApiKey`, `getClientIp`, `checkAiRateLimit`, `readJson`, `json` |
| `GET /api/bfl-key` | BFL API-Key (entschlüsselt) lesen | `#api` `#encryption` | `getAuthedEmail`, `getOrCreateUserId`, `getUserBflApiKey` |
| `POST /api/bfl-key` | BFL API-Key verschlüsselt speichern | `#api` `#encryption` | `getAuthedEmail`, `getOrCreateUserId`, `saveUserBflApiKey`, `readJson` |
| `getUserBflApiKey(userId)` | BFL-Key aus DB entschlüsseln | `#encryption` `#db` | `getUserSettingsRow`, `decryptLinearApiKey` |
| `saveUserBflApiKey(userId, apiKey)` | BFL-Key verschlüsselt in DB speichern | `#encryption` `#db` | `getUserSettingsRow`, `encryptLinearApiKey`, `stmtUserBflKeyUpsert` |

**Key-Fallback** in `/api/ai/image`: 1) Request-Body `apiKey` → 2) User-DB-Key (`getUserBflApiKey`) → 3) Env `BFL_API_KEY`.

**Ablauf**: Authentifizierung → Rate-Limit → JSON lesen → BFL API Submit (`POST https://api.bfl.ai/v1/{model}`) → Polling (`GET polling_url`, alle 1.5s) → Status `Ready` → Bild-Download → Base64-Konvertierung → JSON-Response `{ ok, imageDataUri, model, prompt, width, height }`.

**Konfiguration** (Env-Variablen):
| Variable | Standard | Beschreibung |
|----------|----------|------|
| `BFL_API_KEY` | — | BFL API-Key (erforderlich für serverseitige Bildgenerierung) |
| `BFL_MODEL` | `flux-2-pro` | FLUX-Modell für Bildgenerierung |
| `BFL_IMAGE_TIMEOUT_MS` | `120000` | Timeout für den gesamten Submit/Poll/Download-Zyklus |
| `BFL_POLL_INTERVAL_MS` | `1500` | Polling-Intervall (Konstante) |
