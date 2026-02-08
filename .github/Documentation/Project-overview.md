# Project overview

Datum: 2026-02-08

Hinweis: Abhängigkeiten sind Funktionsaufrufe innerhalb der Datei (statische Analyse, keine Laufzeitauflösung).

## Aktuelle Änderungen (2026-02-08)

- CRDT-Sync für Gäste in Permalink-Räumen: `updateCrdtFromTextarea` blockiert nicht mehr durch `shouldSyncRoomContentNow()` – CRDT ist konfliktfrei, daher dürfen alle Clients (auch Gäste ohne aktive PS-Note) Änderungen senden und empfangen. User-Markierungen (`{ author: clientId }`) bleiben erhalten.
  - Zuständige Funktion: `updateCrdtFromTextarea` ([app.js](app.js#L17477)).
- PS-Notizenvorschau bei Remote-Sync: Wenn `applySyncedText` CRDT-Änderungen empfängt und eine gebundene Note existiert, wird `schedulePsListRerender()` aufgerufen, damit die PS-Liste sofort die aktualisierte Vorschau anzeigt.
  - Zuständige Funktion: `applySyncedText` ([app.js](app.js#L17357)).
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
                                    |-> initUiLanguage()
                                    |-> initAutoBackup()/initAutoImport()
                                    |-> initAiDictation()
                                    |-> refreshPersonalSpace()
                                    |-> loadCommentsForRoom()

Server-Start
  |-> HTTP Server (API, Uploads) -> initDb() -> SQLite
  |-> WebSocketServer -> persistRoomState()/loadPersistedRoomState()
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

7) Personal Space (Notizen, Tags, Auto-Save)
- Zweck: Notizen laden/filtern, Tags, Auto-Save, Tabs/History.
- Umsetzung: `refreshPersonalSpace`, `applyPersonalSpaceFiltersAndRender`, `savePersonalSpaceNote`, `updateRoomTabsForNoteId`.
- Hinweis: Notizen werden per `filterRealNotes` auf gültige IDs geprüft und nach ID entdoppelt (neuestes `updatedAt`/`createdAt` bleibt); Tag-Änderungen aktualisieren bestehende Notizen statt neue anzulegen.

8) Settings/Tools (Uploads, Kalender, AI)
- Zweck: Uploads/Trash/Calendar/AI-Einstellungen verwalten.
- Umsetzung: `loadUploadsManage`, `loadTrashManage`, `renderCalendarPanel`, `aiAssistFromPreview`.

## Funktionskatalog (kategorisiert nach Funktionsbereichen)

> **Wartungshinweis**: Neue Funktionen am Ende der jeweiligen Kategorie einfügen.  
> Zeilenangaben beziehen sich auf den Stand vom **2026-02-08**.  
> Tags: `#core` `#crypto` `#modal` `#share` `#upload` `#tags` `#editor` `#comments` `#wiki` `#slash` `#table` `#mobile` `#i18n` `#theme` `#ai` `#settings` `#backup` `#ps` `#preview` `#runner` `#import` `#favorites` `#tabs` `#pins` `#calendar` `#ws` `#crdt` `#presence` `#linear` `#init`

---

### app.js

---

#### 1 · Basis-Helfer & Initialisierung `#core`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `normalizeBaseUrl` | [L422](app.js#L422) | Normalisiert Base-URL | — |
| `tryRenderSharedNote` | [L581](app.js#L581) | Versucht geteilte Notiz zu rendern | `base64UrlDecode`, `buildNoteShareHtmlDocument`, `t` |
| `ensurePdfJsLoaded` | [L612](app.js#L612) | Stellt sicher, dass PDF.js geladen ist | `t` |
| `getPdfPreviewDoc` | [L628](app.js#L628) | Liest PDF-Preview-Dokument | `ensurePdfJsLoaded`, `t` |
| `renderPdfPreviewPage` | [L644](app.js#L644) | Rendert eine PDF-Preview-Seite | `ensurePdfJsLoaded`, `getPdfPreviewDoc`, `t` |
| `createClientId` | [L668](app.js#L668) | Erzeugt eindeutige Client-ID | — |
| `announceClientId` | [L682](app.js#L682) | Teilt Client-ID mit | — |
| `randomIdentity` | [L707](app.js#L707) | Erzeugt zufällige Identität | — |
| `loadIdentity` | [L786](app.js#L786) | Lädt gespeicherte Identität | — |
| `saveIdentity` | [L802](app.js#L802) | Speichert Identität | — |
| `normalizeRoom` | [L818](app.js#L818) | Normalisiert Raum-Name | — |
| `normalizeKey` | [L827](app.js#L827) | Normalisiert Schlüssel | — |
| `parseRoomAndKeyFromHash` | [L836](app.js#L836) | Parst Room+Key aus URL-Hash | `normalizeKey`, `normalizeRoom`, `t` |
| `buildShareHash` | [L855](app.js#L855) | Baut Share-Hash | `t` |
| `randomKey` | [L862](app.js#L862) | Erzeugt zufälligen Key | `normalizeKey` |
| `api` | [L1551](app.js#L1551) | HTTP-API-Client | `safeJsonParse`, `t` |
| `fmtDate` | [L1574](app.js#L1574) | Formatiert Datum | `getUiLocale` |
| `toast` | [L977](app.js#L977) | Zeigt Benachrichtigung an | `t` |
| `loadBuildStamp` | [L998](app.js#L998) | Lädt Build-Stamp | `t` |
| `escapeHtml` *(L6446)* | [L6446](app.js#L6446) | HTML-Sonderzeichen escapen | — |
| `escapeHtmlAttr` | [L3986](app.js#L3986) | HTML-Attribute escapen | — |
| `escapeAttr` | [L10622](app.js#L10622) | Attribut-Escape (Render-Kontext) | `escapeHtml`, diverse |
| `copyTextToClipboard` | [L6458](app.js#L6458) | Text in Zwischenablage kopieren | `t` |
| `nowIso` | [L12718](app.js#L12718) | ISO-Zeitstempel erzeugen | `getUiLocale` |
| `safeJsonParse` | [L12729](app.js#L12729) | Sicheres JSON-Parsen | — |
| `sanitizeLegacySnapshotText` | [L12737](app.js#L12737) | Legacy-Snapshots bereinigen | `safeJsonParse` |
| `getLineBounds` | [L2081](app.js#L2081) | Zeilenanfang/-ende im Text | — |
| `replaceTextRange` | [L2090](app.js#L2090) | Textbereich ersetzen | — |
| `insertTextAtCursor` | [L2098](app.js#L2098) | Text an Cursor einfügen | — |
| `getTextareaCaretCoords` | [L2219](app.js#L2219) | Cursor-Koordinaten im Textarea | `t` |
| `positionFloatingMenu` | [L2282](app.js#L2282) | Floating-Menü positionieren | `getTextareaCaretCoords`, `t` |

#### 2 · Verschlüsselung (E2EE) `#crypto`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `resetE2eeKeyCache` | [L883](app.js#L883) | Setzt E2EE-Key-Cache zurück | — |
| `base64UrlEncode` | [L888](app.js#L888) | Base64-URL-Encode | — |
| `base64UrlDecode` | [L899](app.js#L899) | Base64-URL-Decode | `t` |
| `base64EncodeBytes` | [L913](app.js#L913) | Bytes → Base64 | — |
| `base64DecodeBytes` | [L922](app.js#L922) | Base64 → Bytes | `t` |
| `getE2eeKey` | [L932](app.js#L932) | E2EE-Schlüssel ableiten | `t` |
| `encryptForRoom` | [L948](app.js#L948) | Raum-Text verschlüsseln | `base64UrlEncode`, `getE2eeKey`, `t` |
| `decryptForRoom` | [L964](app.js#L964) | Raum-Text entschlüsseln | `base64UrlDecode`, `getE2eeKey`, `t` |
| `isE2eeActive` | [L12700](app.js#L12700) | Prüft ob E2EE aktiv | — |
| `toast` | [L746](app.js#L746) | Benachrichtigungen anzeigen | `t` |
| `loadBuildStamp` | [L767](app.js#L767) | Build-Stamp laden | `t` |

#### 3 · Modale Dialoge `#modal`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `isModalReady` | [L1036](app.js#L1036) | Prüft Modal-Bereitschaft | — |
| `setModalOpen` | [L1048](app.js#L1048) | Setzt Modal offen/geschlossen | — |
| `openModal` | [L1060](app.js#L1060) | Öffnet modalen Dialog | `cleanup`, `finish`, `isModalReady`, `onBackdropClick`, `onCancel`, `onInputKey`, `onKeyDown`, `onOk`, `setModalOpen`, `t` |
| `cleanup` | [L1111](app.js#L1111) | Räumt Modal auf | `setModalOpen` |
| `finish` | [L1130](app.js#L1130) | Schließt Modal mit Ergebnis | `cleanup` |
| `onCancel` | [L1136](app.js#L1136) | Abbrechen-Handler | `finish` |
| `onOk` | [L1139](app.js#L1139) | OK-Handler | `finish` |
| `onBackdropClick` | [L1142](app.js#L1142) | Hintergrund-Klick-Handler | `finish` |
| `onInputKey` | [L1146](app.js#L1146) | Input-Tastatur-Handler | `finish`, `t` |
| `onKeyDown` | [L1153](app.js#L1153) | Tastatur-Handler | `finish`, `t` |
| `modalConfirm` | [L1171](app.js#L1171) | Bestätigungsdialog | `openModal` |
| `modalPrompt` | [L1183](app.js#L1183) | Eingabedialog | `openModal` |
| `showSlashHelp` | [L2113](app.js#L2113) | Slash-Befehle Hilfe anzeigen | `openModal` |

#### 4 · Teilen (Share / Note-Share) `#share`

##### 4.1 Room-Share-Modal

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `isShareModalReady` | [L1202](app.js#L1202) | Prüft Share-Modal-Bereitschaft | — |
| `setShareModalOpen` | [L1214](app.js#L1214) | Setzt Share-Modal offen | — |
| `buildQrUrl` | [L1226](app.js#L1226) | Baut QR-Code-URL | `t` |
| `updateShareModalLink` | [L1231](app.js#L1231) | Aktualisiert Share-Link im Modal | `buildQrUrl`, `buildShareHref`, `isShareModalReady`, `t` |
| `openShareModal` | [L1255](app.js#L1255) | Öffnet Share-Modal | `isShareModalReady`, `setShareModalOpen`, `t`, `updateShareModalLink` |
| `buildShareHref` | [L12586](app.js#L12586) | Baut vollständige Share-URL | `buildShareHash` |
| `updateShareLink` | [L12594](app.js#L12594) | Aktualisiert Share-Link global | `buildShareHref`, `updateShareModalLink` |

##### 4.2 Notizen-Share-Modal

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `isNoteShareModalReady` | [L1274](app.js#L1274) | Prüft Note-Share-Modal | — |
| `revokeNoteShareShareUrl` | [L1287](app.js#L1287) | Widerruft Note-Share-URL | — |
| `buildNoteShareHtmlDocument` | [L1291](app.js#L1291) | Baut HTML-Dokument für Notiz-Share | `escapeHtml` |
| `setNoteShareModalOpen` | [L1314](app.js#L1314) | Setzt Note-Share-Modal | `revokeNoteShareShareUrl` |
| `buildNoteSharePayloadFromIds` | [L1327](app.js#L1327) | Baut Share-Payload aus IDs | `findNoteById`, `getNoteTitle` |
| `buildNoteShareUrl` | [L1352](app.js#L1352) | Baut Note-Share-URL | `base64UrlEncode`, `t` |
| `buildNoteShareQrPayload` | [L1366](app.js#L1366) | Baut QR-Payload für Notiz | — |
| `updateNoteShareModal` | [L1386](app.js#L1386) | Aktualisiert Note-Share-Modal | `buildNoteShareQrPayload`, `buildNoteShareUrl`, `buildQrUrl`, `isNoteShareModalReady`, `revokeNoteShareShareUrl`, `t` |
| `openNoteShareModal` | [L1428](app.js#L1428) | Öffnet Note-Share-Modal | `buildNoteSharePayloadFromIds`, `isNoteShareModalReady`, `setNoteShareModalOpen`, `t`, `toast`, `updateNoteShareModal` |

#### 5 · Upload-Modal `#upload`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `isUploadModalReady` | [L1450](app.js#L1450) | Prüft Upload-Modal | — |
| `setUploadModalOpen` | [L1462](app.js#L1462) | Setzt Upload-Modal | — |
| `formatBytes` | [L1474](app.js#L1474) | Formatiert Byte-Größe | — |
| `buildUploadMarkdown` | [L1482](app.js#L1482) | Baut Upload-Markdown | — |
| `isAllowedUploadType` | [L1492](app.js#L1492) | Prüft erlaubten Dateityp | — |
| `updateUploadPreview` | [L1497](app.js#L1497) | Aktualisiert Upload-Vorschau | `formatBytes` |
| `setUploadInsertDisabled` | [L1513](app.js#L1513) | Setzt Insert-Button-Status | — |
| `resetUploadModalState` | [L1521](app.js#L1521) | Setzt Upload-Modal zurück | `setUploadInsertDisabled`, `updateUploadPreview` |
| `openUploadModal` | [L1529](app.js#L1529) | Öffnet Upload-Modal | `isUploadModalReady`, `resetUploadModalState`, `setUploadModalOpen`, `t` |
| `readFileAsDataUrl` | [L1542](app.js#L1542) | Liest Datei als Data-URL | `t` |

#### 6 · Tag-System & Kategorisierung `#tags`

##### 6.1 Tag-Normalisierung & Helfer

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `normalizeManualTags` | [L1634](app.js#L1634) | Normalisiert manuelle Tags | `t` |
| `uniqTags` | [L1692](app.js#L1692) | Entfernt Tag-Duplikate | `t` |
| `normalizeYearTag` | [L1710](app.js#L1710) | Normalisiert Jahres-Tag | `t` |
| `normalizeMonthTag` | [L1716](app.js#L1716) | Normalisiert Monats-Tag | — |
| `normalizeCategoryValue` | [L1722](app.js#L1722) | Normalisiert Kategorie | `t` |
| `isYearTag` | [L1733](app.js#L1733) | Prüft Jahres-Tag | `t` |
| `isMonthTag` | [L1737](app.js#L1737) | Prüft Monats-Tag | `normalizeMonthTag` |
| `getDateTagsForTs` | [L1741](app.js#L1741) | Datum-Tags aus Timestamp | — |
| `splitTagsForEditor` | [L1763](app.js#L1763) | Tags für Editor aufteilen | `getDateTagsForTs`, `isMonthTag`, `isYearTag`, `normalizeMonthTag`, `stripManualTagsMarker`, `stripPinnedTag` |
| `buildEditorSystemTags` | [L1808](app.js#L1808) | System-Tags erzeugen | — |
| `stripManualTagsMarker` | [L7878](app.js#L7878) | Manual-Tags-Marker entfernen | — |
| `stripPinnedTag` | [L7883](app.js#L7883) | Pinned-Tag entfernen | — |
| `noteIsPinned` | [L7888](app.js#L7888) | Prüft ob Notiz gepinnt | — |
| `buildPsTagsPayload` | [L7893](app.js#L7893) | Baut Tags-Payload | `stripManualTagsMarker` |

##### 6.2 Tag-Editor (PS-Sidebar)

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getEditingNoteCreatedAt` | [L1818](app.js#L1818) | Liest createdAt der aktiven Notiz | — |
| `syncPsEditorTagMetaInputs` | [L1827](app.js#L1827) | Synchronisiert Tag-Meta-Inputs | — |
| `updatePsEditorTagMetaFromInputs` | [L1837](app.js#L1837) | Aktualisiert Tags aus Inputs | `getDateTagsForTs`, `getEditingNoteCreatedAt`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `schedulePsTagsAutoSave`, `syncPsEditorTagMetaInputs`, `t`, `updateEditingNoteTagsLocal`, `updateEditorMetaYaml`, `updatePsEditingTagsHint` |
| `formatTagsForHint` | [L1860](app.js#L1860) | Tags als Hint formatieren | — |
| `updatePsEditingTagsHint` | [L1866](app.js#L1866) | Aktualisiert Tags-Hint | `formatTagsForHint`, `t` |
| `formatTagsForEditor` | [L1894](app.js#L1894) | Tags für Editor formatieren | — |
| `setPsEditorTagsVisible` | [L1899](app.js#L1899) | Tags sichtbar/unsichtbar | — |
| `syncPsEditorTagsInput` | [L1904](app.js#L1904) | Synchronisiert Tags-Input | `formatTagsForEditor`, `syncPsEditorTagMetaInputs` |
| `getPsEditorTagTokenBounds` | [L1922](app.js#L1922) | Tag-Token-Grenzen ermitteln | `t` |
| `buildPsEditorTagsSuggestItems` | [L1936](app.js#L1936) | Suggest-Items erzeugen | `getPsEditorTagTokenBounds`, `isMonthTag`, `isYearTag`, `normalizeManualTags`, `t` |
| `closePsEditorTagsSuggest` | [L1964](app.js#L1964) | Suggest-Menü schließen | — |
| `renderPsEditorTagsSuggest` | [L1973](app.js#L1973) | Suggest-Menü rendern | `closePsEditorTagsSuggest`, `escapeHtml`, `escapeHtmlAttr`, `t` |
| `updatePsEditorTagsSuggest` | [L1998](app.js#L1998) | Suggest-Menü aktualisieren | `buildPsEditorTagsSuggestItems`, `closePsEditorTagsSuggest`, `renderPsEditorTagsSuggest`, `t` |
| `updatePsEditorTagsFromInput` | [L2029](app.js#L2029) | Tags aus Input aktualisieren | `normalizeManualTags`, `schedulePsTagsAutoSave`, `t`, `updateEditingNoteTagsLocal`, `updateEditorMetaYaml`, `updatePsEditingTagsHint` |
| `applyPsEditorTagSuggestion` | [L2041](app.js#L2041) | Tag-Suggestion anwenden | `getPsEditorTagTokenBounds`, `t`, `updatePsEditorTagsFromInput`, `updatePsEditorTagsSuggest` |
| `syncPsEditingNoteTagsFromState` | [L2057](app.js#L2057) | Tags vom State synchronisieren | `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `splitTagsForEditor`, `syncPsEditorTagsInput`, `t`, `updatePsEditingTagsHint` |

##### 6.3 Tag-Verwaltung (Sections, Context-Menü)

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `sortTagList` | [L7999](app.js#L7999) | Tag-Liste sortieren | `t` |
| `buildTagSections` | [L8003](app.js#L8003) | Tag-Sektionen aufbauen | `isMonthTag`, `isYearTag`, `sortTagList`, `t` |
| `loadPsTagSectionState` | [L8060](app.js#L8060) | Tag-Sektion-Zustand laden | — |
| `savePsTagSectionState` | [L8071](app.js#L8071) | Tag-Sektion-Zustand speichern | — |
| `normalizeSingleTag` | [L8082](app.js#L8082) | Einzelnen Tag normalisieren | `normalizeManualTags` |
| `dedupeRawTags` | [L8087](app.js#L8087) | Raw-Tags entdoppeln | `t` |
| `updateNotesForTagChange` | [L8101](app.js#L8101) | Notizen bei Tag-Änderung aktualisieren | `api`, `applyPersonalSpaceFiltersAndRender`, `dedupeRawTags`, `rebuildPsTagsFromNotes`, `t`, `toast` |
| `resetPsTagContextDelete` | [L8171](app.js#L8171) | Tag-Lösch-Dialog zurücksetzen | `t` |
| `setPsTagContextMenuOpen` | [L8180](app.js#L8180) | Tag-Kontextmenü öffnen/schließen | — |
| `positionPsTagContextMenu` | [L8186](app.js#L8186) | Tag-Kontextmenü positionieren | `t` |
| `closePsTagContextMenu` | [L8198](app.js#L8198) | Tag-Kontextmenü schließen | `resetPsTagContextDelete`, `setPsTagContextMenuOpen` |
| `openPsTagContextMenu` | [L8204](app.js#L8204) | Tag-Kontextmenü öffnen | `closePsContextMenu`, `positionPsTagContextMenu`, `resetPsTagContextDelete`, `setPsTagContextMenuOpen`, `t` |
| `applyPsTagContextValue` | [L8223](app.js#L8223) | Tag-Kontextwert anwenden | `closePsTagContextMenu`, `normalizeSingleTag`, `t`, `toast`, `updateNotesForTagChange` |
| `applyPsTagContextInput` | [L8246](app.js#L8246) | Tag-Kontext-Eingabe anwenden | `applyPsTagContextValue` |
| `confirmPsTagContextDelete` | [L8251](app.js#L8251) | Tag-Löschung bestätigen | `closePsTagContextMenu`, `updateNotesForTagChange` |
| `updatePsTagsActiveInfo` | [L8258](app.js#L8258) | Aktive Tag-Info aktualisieren | — |
| `renderPsTags` | [L8271](app.js#L8271) | Tag-Panel rendern | `buildTagSections`, `loadPsTagSectionState`, `openPsTagContextMenu`, `refreshPersonalSpace`, `savePsTagPrefs`, `savePsTagSectionState`, `t`, `updatePsTagsActiveInfo` |
| `togglePinnedForNote` | [L8384](app.js#L8384) | Pin-Status für Notiz umschalten | `api`, `applyPersonalSpaceFiltersAndRender`, `buildPsTagsPayload`, diverse Tag-Helfer |
| `rebuildPsTagsFromNotes` | [L8494](app.js#L8494) | Tags aus Notizen neu aufbauen | `t`, `updatePsEditorTagsSuggest` |
| `updateEditingNoteTagsLocal` | [L8517](app.js#L8517) | Lokale Tags der aktiven Notiz aktualisieren | `applyPersonalSpaceFiltersAndRender`, `buildEditorSystemTags`, `buildPsTagsPayload`, `rebuildPsTagsFromNotes`, `uniqTags` |
| `schedulePsTagsAutoSave` | [L8539](app.js#L8539) | Tags-Auto-Save planen | `savePersonalSpaceNote`, `t` |

#### 7 · Kommentare `#comments`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `formatCommentTime` | [L2407](app.js#L2407) | Kommentar-Zeit formatieren | — |
| `getCommentScopeId` | [L2424](app.js#L2424) | Ermittelt Scope-ID (Raum/Note) | — |
| `canSyncCommentsForScope` | [L2462](app.js#L2462) | Prüft ob Kommentar-Sync erlaubt | — |
| `loadCommentsForRoom` | [L2526](app.js#L2526) | Lädt Kommentare für Raum | `getCommentScopeId`, `renderCommentList`, `t`, `updateCommentOverlay` |
| `saveCommentsForRoom` | [L2593](app.js#L2593) | Speichert Kommentare | `getCommentScopeId` |
| `normalizeCommentSelection` | [L2599](app.js#L2599) | Normalisiert Kommentar-Selektion | — |
| `buildCommentOverlayHtml` | [L2616](app.js#L2616) | Baut Kommentar-Overlay-HTML | `escapeHtml`, `escapeHtmlAttr`, `normalizeCommentSelection`, `t` |
| `syncCommentOverlayScroll` | [L2643](app.js#L2643) | Synchronisiert Overlay-Scroll | — |
| `updateCommentOverlay` | [L2650](app.js#L2650) | Aktualisiert Kommentar-Overlay | `buildCommentOverlayHtml`, `syncCommentOverlayScroll` |
| `setCommentPanelOpen` | [L2675](app.js#L2675) | Setzt Panel offen/geschlossen | `updateCommentOverlay` |
| `setCommentDraftSelection` | [L2718](app.js#L2718) | Setzt Draft-Selektion | — |
| `updateCommentComposerUi` | [L2738](app.js#L2738) | Aktualisiert Composer-UI | `applyUiTranslations` |
| `setCommentComposerState` | [L2751](app.js#L2751) | Setzt Composer-State | — |
| `clearCommentComposerState` | [L2761](app.js#L2761) | Löscht Composer-State | `setCommentDraftSelection`, `updateCommentComposerUi` |
| `renderCommentList` | [L2800](app.js#L2800) | Rendert Kommentar-Liste | `applyUiTranslations`, `clearCommentComposerState`, `formatCommentTime`, `normalizeCommentSelection`, `saveCommentsForRoom`, `setCommentComposerState`, `setCommentPanelOpen`, `t`, `updateCommentOverlay`, `updateSelectionMenu` |
| `addCommentFromDraft` | [L2990](app.js#L2990) | Fügt Kommentar aus Draft hinzu | `clearCommentComposerState`, `getSelectionRange`, `renderCommentList`, `saveCommentsForRoom`, `t`, `toast`, `updateCommentOverlay` |
| `openCommentFromSelection` | [L3063](app.js#L3063) | Öffnet Kommentar aus Selektion | `getSelectionRange`, `setCommentDraftSelection`, `setCommentPanelOpen`, `setSelectionMenuOpen`, `updateCommentComposerUi` |

#### 8 · Editor-Selektion & Textformatierung `#editor`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `setSlashMenuOpen` | [L2334](app.js#L2334) | Slash-Menü öffnen/schließen | — |
| `getSlashContext` | [L2340](app.js#L2340) | Slash-Kontext ermitteln | `getLineBounds` |
| `setWikiMenuOpen` | [L2387](app.js#L2387) | Wiki-Menü öffnen/schließen | — |
| `setSelectionMenuOpen` | [L2393](app.js#L2393) | Selektions-Menü öffnen/schließen | — |
| `getSelectionRange` | [L2399](app.js#L2399) | Selektion ermitteln | — |
| `getSelectionLineRange` | [L3088](app.js#L3088) | Selektions-Zeilenbereich | — |
| `wrapSelection` | [L3095](app.js#L3095) | Selektion umschließen | — |
| `wrapSelectionToggle` | [L3107](app.js#L3107) | Selektion toggle-umschließen | — |
| `prefixSelectionLines` | [L3148](app.js#L3148) | Zeilen-Prefix einfügen | `getSelectionLineRange`, `t` |
| `togglePrefixSelectionLines` | [L3171](app.js#L3171) | Zeilen-Prefix togglen | `getSelectionLineRange`, `t` |
| `toggleDividerAtSelection` | [L3213](app.js#L3213) | Trennlinie togglen | `getSelectionLineRange`, `t` |
| `toggleFencedCodeBlock` | [L3237](app.js#L3237) | Code-Block togglen | `getSelectedCodeLang`, `getSelectionLineRange`, `t` |
| `sortSelectionLines` | [L3281](app.js#L3281) | Selektions-Zeilen sortieren | `getSelectionLineRange`, `t` |
| `applySelectionAction` | [L3301](app.js#L3301) | Selektions-Aktion ausführen | `openCommentFromSelection`, `schedulePsAutoSave`, `scheduleSend`, diverse |
| `updateSelectionMenu` | [L3428](app.js#L3428) | Selektions-Menü aktualisieren | `getSelectionRange`, `positionFloatingMenu`, `setSelectionMenuOpen` |

#### 9 · Wiki-Menü `#wiki`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getWikiContext` | [L3449](app.js#L3449) | Wiki-Kontext ermitteln | — |
| `renderWikiMenu` | [L3482](app.js#L3482) | Wiki-Menü rendern | `escapeHtml`, `insertWikiLink`, `t` |
| `insertWikiLink` | [L3534](app.js#L3534) | Wiki-Link einfügen | `getWikiContext`, `replaceTextRange`, `setWikiMenuOpen`, `t`, `updatePreview` |
| `updateWikiMenu` | [L3554](app.js#L3554) | Wiki-Menü aktualisieren | `fmtDate`, `getNoteTitle`, `getWikiContext`, `renderWikiMenu`, `setSlashMenuOpen`, `setWikiMenuOpen`, `t` |
| `handleWikiMenuKey` | [L3588](app.js#L3588) | Wiki-Menü Tastatur-Handler | `insertWikiLink`, `renderWikiMenu`, `setWikiMenuOpen`, `t` |

#### 10 · Slash-Menü `#slash`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `renderSlashMenu` | [L3617](app.js#L3617) | Slash-Menü rendern | `insertSlashSnippet`, `t` |
| `insertSlashSnippet` | [L3674](app.js#L3674) | Slash-Snippet einfügen | `getSlashContext`, `replaceTextRange`, `setSlashMenuOpen`, `t`, `updatePreview` |
| `updateSlashMenu` | [L3693](app.js#L3693) | Slash-Menü aktualisieren | `getSlashContext`, `getWikiContext`, `positionFloatingMenu`, `renderSlashMenu`, `setSlashMenuOpen`, `t` |
| `handleSlashMenuKey` | [L3734](app.js#L3734) | Slash-Menü Tastatur-Handler | `getSlashContext`, `insertSlashSnippet`, `renderSlashMenu`, `setSlashMenuOpen`, `t` |
| `applySlashCommand` | [L4249](app.js#L4249) | Slash-Befehl ausführen | `applyTableCommand`, `buildMarkdownTable`, `getLineBounds`, `getSelectedCodeLang`, `replaceTextRange`, `showSlashHelp`, `t`, `toast`, `updateCodeLangOverlay` |

#### 11 · Tabellen-Editor `#table`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `renderTableRow` | [L3776](app.js#L3776) | Tabellen-Zeile rendern | — |
| `renderTableSeparator` | [L3783](app.js#L3783) | Tabellen-Separator rendern | — |
| `buildMarkdownTable` | [L3793](app.js#L3793) | Markdown-Tabelle bauen | `renderTableRow`, `renderTableSeparator` |
| `getLineIndexAtPos` | [L3811](app.js#L3811) | Zeilenindex an Position | — |
| `isTableSeparator` | [L3821](app.js#L3821) | Prüft Tabellen-Separator | `t` |
| `splitTableRow` | [L3825](app.js#L3825) | Tabellen-Zeile aufteilen | `t` |
| `getColumnIndexFromCaret` | [L3832](app.js#L3832) | Spaltenindex aus Cursor | `t` |
| `getTableContext` | [L3847](app.js#L3847) | Tabellen-Kontext ermitteln | `getLineIndexAtPos`, `isTableSeparator`, `t` |
| `applyTableCommand` | [L3883](app.js#L3883) | Tabellen-Befehl ausführen | `getColumnIndexFromCaret`, `getTableContext`, `renderTableRow`, `renderTableSeparator`, `replaceTextRange`, `splitTableRow`, `t` |
| `setTableModalOpen` | [L3974](app.js#L3974) | Tabellen-Modal öffnen/schließen | — |
| `parseTableFromContext` | [L3994](app.js#L3994) | Tabelle aus Kontext parsen | `splitTableRow` |
| `renderTableEditorGrid` | [L4024](app.js#L4024) | Tabellen-Editor-Grid rendern | `escapeHtmlAttr`, `t`, `updateTableActiveCellLabel`, `updateTableActiveInputHighlight`, `updateTableCalculations` |
| `updateTableActiveCellLabel` | [L4102](app.js#L4102) | Aktive Zelle Label | — |
| `updateTableActiveInputHighlight` | [L4112](app.js#L4112) | Aktive Zelle Highlight | — |
| `getNumericValuesForScope` | [L4126](app.js#L4126) | Numerische Werte für Scope | — |
| `updateTableCalculations` | [L4149](app.js#L4149) | Tabellen-Berechnungen | `getNumericValuesForScope` |
| `insertCalcResult` | [L4170](app.js#L4170) | Berechnung einfügen | `getNumericValuesForScope`, `renderTableEditorGrid`, `updateTableCalculations` |
| `applyTableEditorToTextarea` | [L4187](app.js#L4187) | Tabellen-Editor → Textarea | `renderTableRow`, `renderTableSeparator`, `replaceTextRange`, `scheduleSend`, `updatePasswordMaskOverlay`, `updatePreview` |
| `openTableEditorFromCursor` | [L4212](app.js#L4212) | Tabellen-Editor am Cursor öffnen | `getTableContext`, `parseTableFromContext`, `renderTableEditorGrid`, `setTableModalOpen`, `t`, `toast`, `updateTableActiveCellLabel`, `updateTableCalculations` |
| `updateTableMenuVisibility` | [L4242](app.js#L4242) | Tabellen-Menü Sichtbarkeit | `getTableContext`, `t` |

#### 12 · Mobil-Unterstützung `#mobile`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `isMobileViewport` | [L4472](app.js#L4472) | Prüft mobiles Viewport | — |
| `syncMobileFocusState` | [L4483](app.js#L4483) | Synchronisiert mobilen Fokus | `isMobileViewport`, `t` |
| `normalizeMobileAutoNoteSeconds` | [L5988](app.js#L5988) | Normalisiert Mobile-Auto-Note-Sekunden | — |
| `loadMobileAutoNoteSeconds` | [L5994](app.js#L5994) | Lädt Mobile-Auto-Note-Sekunden | `normalizeMobileAutoNoteSeconds` |
| `saveMobileAutoNoteSeconds` | [L6005](app.js#L6005) | Speichert Mobile-Auto-Note-Sekunden | `normalizeMobileAutoNoteSeconds` |
| `recordMobileLastActive` | [L6019](app.js#L6019) | Merkt letzte Aktivität | — |
| `shouldStartMobileAutoNote` | [L6027](app.js#L6027) | Prüft ob Auto-Note starten | `isMobileViewport`, `t` |
| `maybeStartMobileAutoNoteSession` | [L6041](app.js#L6041) | Startet ggf. Auto-Note-Session | `setPreviewVisible`, `shouldStartMobileAutoNote`, `syncMobileFocusState` |

#### 13 · Internationalisierung (i18n) `#i18n`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getUiString` | [L5660](app.js#L5660) | UI-String lesen | — |
| `t` | [L5670](app.js#L5670) | Übersetzungsschlüssel auflösen | `getUiString` |
| `formatUi` | [L5676](app.js#L5676) | UI-Template formatieren | — |
| `getUiLocale` | [L5687](app.js#L5687) | UI-Locale lesen | — |
| `getUiSpeechLocale` | [L5691](app.js#L5691) | Speech-Locale lesen | — |
| `detectUiLanguage` | [L5695](app.js#L5695) | UI-Sprache erkennen | — |
| `applyI18nAttribute` | [L5706](app.js#L5706) | i18n-Attribut anwenden | `getUiString` |
| `applyUiTranslations` | [L5716](app.js#L5716) | Alle Übersetzungen anwenden | `applyI18nAttribute`, `getUiString` |
| `syncUiLangButtons` | [L5729](app.js#L5729) | Sprach-Buttons synchronisieren | — |
| `applyUiLanguage` | [L5748](app.js#L5748) | UI-Sprache anwenden | `applyGlowEnabled`, `applyUiTranslations`, `getUiSpeechLocale`, `syncUiLangButtons` |
| `setUiLanguage` | [L5762](app.js#L5762) | UI-Sprache setzen | `applyUiLanguage` |
| `initUiLanguage` | [L5773](app.js#L5773) | UI-Sprache initialisieren | `applyUiLanguage`, `detectUiLanguage` |

#### 14 · Theme & Glow `#theme`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `renderThemeList` | [L5778](app.js#L5778) | Theme-Liste rendern | `syncThemeListActive`, `t` |
| `syncThemeListActive` | [L5805](app.js#L5805) | Aktives Theme synchronisieren | — |
| `loadGlowEnabled` | [L5819](app.js#L5819) | Glow-Einstellung laden | `applyGlowEnabled` |
| `applyGlowEnabled` | [L5829](app.js#L5829) | Glow anwenden | `t` |
| `saveGlowEnabled` | [L5866](app.js#L5866) | Glow speichern | `applyGlowEnabled` |
| `loadTheme` | [L6818](app.js#L6818) | Theme laden | `applyTheme` |
| `applyTheme` | [L6846](app.js#L6846) | Theme anwenden | `syncThemeListActive`, `updatePreview` |
| `saveTheme` | [L6975](app.js#L6975) | Theme speichern | `applyTheme` |

#### 15 · KI-Assistent & Diktat `#ai`

##### 15.1 AI-Konfiguration

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `loadAiPrompt` | [L5964](app.js#L5964) | AI-Prompt laden | — |
| `loadAiUsePreview` | [L5973](app.js#L5973) | AI-Use-Preview laden | `setAiUsePreviewUi` |
| `loadAiUseAnswer` | [L5983](app.js#L5983) | AI-Use-Answer laden | `setAiUseAnswerUi` |
| `saveAiPrompt` | [L6485](app.js#L6485) | AI-Prompt speichern | — |
| `saveAiUseAnswer` | [L6492](app.js#L6492) | AI-Use-Answer speichern | — |
| `saveAiUsePreview` | [L6497](app.js#L6497) | AI-Use-Preview speichern | — |
| `loadAiApiConfig` | [L6485](app.js#L6485) | AI-API-Config laden | — |
| `saveAiApiConfig` | [L6497](app.js#L6497) | AI-API-Config speichern | — |
| `getAiApiConfig` | [L6510](app.js#L6510) | AI-API-Config lesen | — |
| `getAiPrompt` | [L7284](app.js#L7284) | AI-Prompt lesen | — |
| `getAiUsePreview` | [L7293](app.js#L7293) | AI-Use-Preview lesen | — |
| `getAiUseAnswer` | [L7297](app.js#L7297) | AI-Use-Answer lesen | — |
| `setAiUsePreviewUi` | [L7301](app.js#L7301) | AI-Use-Preview UI | — |
| `setAiUseAnswerUi` | [L7317](app.js#L7317) | AI-Use-Answer UI | — |
| `readAiApiKeyInput` | [L7250](app.js#L7250) | AI-API-Key Input lesen | — |
| `normalizeAiModelInput` | [L7257](app.js#L7257) | AI-Modell Input normalisieren | — |
| `applyAiContextMode` | [L7266](app.js#L7266) | AI-Kontextmodus anwenden | `getAiUsePreview` |
| `loadAiStatus` | [L7040](app.js#L7040) | AI-Status laden | `api` |
| `getAiMode` | [L12552](app.js#L12552) | AI-Modus ermitteln | — |
| `aiAssistFromPreview` | [L12563](app.js#L12563) | AI-Assist aus Preview | `api`, `getAiApiConfig`, `getAiMode`, `getAiPrompt`, `getAiUseAnswer`, `getAiUsePreview`, `parseRunnableFromEditor`, `saveAiPrompt`, `setPreviewRunOutput`, `t`, `toast` |

##### 15.2 AI-Diktat

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getSpeechRecognitionConstructor` | [L7333](app.js#L7333) | Speech-Recognition Konstruktor | — |
| `setAiDictationUi` | [L7341](app.js#L7341) | Diktat-UI setzen | — |
| `updateAiDictationValue` | [L7369](app.js#L7369) | Diktat-Wert aktualisieren | — |
| `onAiDictationResult` | [L7383](app.js#L7383) | Diktat-Ergebnis verarbeiten | `updateAiDictationValue` |
| `stopAiDictation` | [L7403](app.js#L7403) | Diktat stoppen | `setAiDictationUi` |
| `startAiDictation` | [L7414](app.js#L7414) | Diktat starten | `setAiDictationUi`, `t` |
| `initAiDictation` | [L7728](app.js#L7728) | Diktat initialisieren | `getSpeechRecognitionConstructor`, `getUiSpeechLocale`, `setAiDictationUi`, `t`, `toast` |

#### 16 · Einstellungen & FAQ `#settings`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `setSettingsOpen` | [L6985](app.js#L6985) | Settings öffnen/schließen | `loadAiStatus`, `renderFaq`, `renderFavoritesManager`, `setActiveSettingsSection` |
| `openSettingsAt` | [L7000](app.js#L7000) | Settings bei Abschnitt öffnen | `setActiveSettingsSection`, `setSettingsOpen` |
| `setActiveSettingsSection` | [L7005](app.js#L7005) | Aktiven Settings-Abschnitt setzen | `fetchGoogleCalendarStatus`, `loadTrashManage`, `loadUploadsManage`, `renderCalendarSettings` |
| `renderFaq` | [L7250](app.js#L7250) | FAQ rendern | — |

#### 17 · Auto-Backup & Auto-Import `#backup`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `supportsDirectoryAccess` | [L6059](app.js#L6059) | Directory-Access-Support prüfen | — |
| `setAutoBackupStatus` | [L6063](app.js#L6063) | Backup-Status setzen | — |
| `setAutoImportStatus` | [L6068](app.js#L6068) | Import-Status setzen | — |
| `normalizeAutoInterval` | [L6073](app.js#L6073) | Auto-Intervall normalisieren | — |
| `autoIntervalToMs` | [L6080](app.js#L6080) | Intervall → Millisekunden | — |
| `openFsHandleDb` | [L6092](app.js#L6092) | FS-Handle-DB öffnen | `t` |
| `readFsHandle` | [L6110](app.js#L6110) | FS-Handle lesen | `openFsHandleDb`, `supportsDirectoryAccess`, `t` |
| `writeFsHandle` | [L6126](app.js#L6126) | FS-Handle schreiben | `openFsHandleDb`, `supportsDirectoryAccess`, `t` |
| `ensureDirPermission` | [L6142](app.js#L6142) | Verzeichnis-Berechtigung sichern | — |
| `updateAutoBackupFolderLabel` | [L6160](app.js#L6160) | Backup-Ordner-Label aktualisieren | — |
| `updateAutoImportFolderLabel` | [L6167](app.js#L6167) | Import-Ordner-Label aktualisieren | — |
| `applyAutoAccessSupportUi` | [L6174](app.js#L6174) | Auto-Access-UI anwenden | `supportsDirectoryAccess` |
| `loadAutoBackupSettings` | [L6188](app.js#L6188) | Backup-Einstellungen laden | `normalizeAutoInterval` |
| `saveAutoBackupSettings` | [L6207](app.js#L6207) | Backup-Einstellungen speichern | — |
| `loadAutoImportSettings` | [L6222](app.js#L6222) | Import-Einstellungen laden | `normalizeAutoInterval` |
| `saveAutoImportSettings` | [L6241](app.js#L6241) | Import-Einstellungen speichern | — |
| `loadAutoImportSeen` | [L6256](app.js#L6256) | Gesehene Imports laden | — |
| `saveAutoImportSeen` | [L6270](app.js#L6270) | Gesehene Imports speichern | — |
| `buildAutoImportKey` | [L6280](app.js#L6280) | Import-Key erzeugen | — |
| `scheduleAutoBackup` | [L6288](app.js#L6288) | Auto-Backup planen | `autoIntervalToMs`, `runAutoBackup`, `supportsDirectoryAccess`, `t` |
| `scheduleAutoImport` | [L6299](app.js#L6299) | Auto-Import planen | `autoIntervalToMs`, `runAutoImport`, `supportsDirectoryAccess`, `t` |
| `runAutoBackup` | [L6310](app.js#L6310) | Auto-Backup ausführen | `ensureDirPermission`, `fetchPersonalSpaceExport`, `setAutoBackupStatus`, `t` |
| `runAutoImport` | [L6356](app.js#L6356) | Auto-Import ausführen | `buildAutoImportKey`, `ensureDirPermission`, `importPersonalSpaceNotesFromText`, `saveAutoImportSeen`, `setAutoImportStatus`, `t` |
| `pickAutoBackupFolder` | [L6413](app.js#L6413) | Backup-Ordner wählen | `runAutoBackup`, `setAutoBackupStatus`, `supportsDirectoryAccess`, `updateAutoBackupFolderLabel`, `writeFsHandle` |
| `pickAutoImportFolder` | [L6427](app.js#L6427) | Import-Ordner wählen | `runAutoImport`, `setAutoImportStatus`, `supportsDirectoryAccess`, `t`, `updateAutoImportFolderLabel`, `writeFsHandle` |
| `initAutoBackup` | [L6441](app.js#L6441) | Auto-Backup initialisieren | `applyAutoAccessSupportUi`, `loadAutoBackupSettings`, `readFsHandle`, `scheduleAutoBackup`, `updateAutoBackupFolderLabel` |
| `initAutoImport` | [L6449](app.js#L6449) | Auto-Import initialisieren | `applyAutoAccessSupportUi`, `loadAutoImportSeen`, `loadAutoImportSettings`, `readFsHandle`, `scheduleAutoImport`, `t`, `updateAutoImportFolderLabel` |

#### 18 · Personal Space (Notizen) `#ps`

##### 18.1 PS Meta & YAML

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `stripManualTagsMarker` | [L7878](app.js#L7878) | Manuelle-Tags-Marker entfernen | — |
| `stripPinnedTag` | [L7883](app.js#L7883) | Pinned-Tag entfernen | — |
| `noteIsPinned` | [L7888](app.js#L7888) | Notiz gepinnt prüfen | — |
| `buildPsTagsPayload` | [L7893](app.js#L7893) | PS-Tags-Payload bauen | `stripManualTagsMarker` |
| `setPsAutoSaveStatus` | [L7898](app.js#L7898) | Auto-Save-Status setzen | `updatePsSaveVisibility` |
| `updatePsSaveVisibility` | [L7906](app.js#L7906) | Save-Sichtbarkeit aktualisieren | `canAutoSavePsNote` |
| `schedulePsListRerender` | [L7911](app.js#L7911) | Listen-Rerender planen | — |
| `ensureNoteUpdatedAt` | [L7958](app.js#L7958) | updatedAt sicherstellen | — |
| `filterRealNotes` | [L7970](app.js#L7970) | Gültige Notizen filtern/entdoppeln | — |
| `formatMetaDate` | [L7989](app.js#L7989) | Meta-Datum formatieren | `t` |
| `buildNoteMetaYaml` | [L8005](app.js#L8005) | Meta-YAML bauen | `ensureNoteUpdatedAt`, `formatMetaDate`, `stripManualTagsMarker`, `stripPinnedTag`, `t` |
| `setPsMetaVisible` | [L8028](app.js#L8028) | Meta-Sichtbarkeit setzen | `updateEditorMetaYaml`, `updatePreview` |
| `loadPsMetaVisible` | [L8047](app.js#L8047) | Meta-Sichtbarkeit laden | `setPsMetaVisible` |
| `savePsMetaVisible` | [L8057](app.js#L8057) | Meta-Sichtbarkeit speichern | — |
| `updateEditorMetaYaml` | [L8065](app.js#L8065) | Editor-Meta-YAML aktualisieren | `buildNoteMetaYaml`, `findNoteById`, `resetEditorMetaPadding`, `updateEditorMetaPadding`, `updateEditorMetaScroll` |
| `updateEditorMetaScroll` | [L8098](app.js#L8098) | Editor-Meta-Scroll sync | — |
| `updateEditorMetaPadding` | [L8104](app.js#L8104) | Editor-Meta-Padding setzen | `t` |
| `resetEditorMetaPadding` | [L8130](app.js#L8130) | Editor-Meta-Padding zurücksetzen | `t` |

##### 18.2 PS Notiz-Titel & Suche

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `cleanNoteTitleLine` | [L8149](app.js#L8149) | Titelzeile bereinigen | — |
| `getNoteTitleAndExcerpt` | [L8158](app.js#L8158) | Titel+Auszug lesen | `cleanNoteTitleLine`, `t` |
| `getNoteTitle` | [L8182](app.js#L8182) | Notiz-Titel lesen | `getNoteTitleAndExcerpt`, `t` |
| `loadPsVisible` | [L8190](app.js#L8190) | PS-Sichtbarkeit laden | — |
| `savePsVisible` | [L8199](app.js#L8199) | PS-Sichtbarkeit speichern | — |
| `applyPsVisible` | [L8207](app.js#L8207) | PS-Sichtbarkeit anwenden | — |
| `normalizeSearchQuery` | [L8237](app.js#L8237) | Suchbegriff normalisieren | — |
| `loadPsSearchQuery` | [L8243](app.js#L8243) | Suchabfrage laden | — |
| `normalizePsSortMode` | [L8252](app.js#L8252) | Sort-Modus normalisieren | — |
| `setPsSortMenuOpen` | [L8267](app.js#L8267) | Sort-Menü öffnen/schließen | — |
| `syncPsSortMenu` | [L8279](app.js#L8279) | Sort-Menü synchronisieren | — |
| `loadPsNoteAccessed` | [L8300](app.js#L8300) | Notiz-Zugriffe laden | `t` |
| `savePsNoteAccessed` | [L8323](app.js#L8323) | Notiz-Zugriffe speichern | `t` |
| `markPsNoteAccessed` | [L8336](app.js#L8336) | Notiz-Zugriff markieren | `savePsNoteAccessed`, `t` |
| `loadPsSortMode` | [L8343](app.js#L8343) | Sort-Modus laden | `normalizePsSortMode`, `syncPsSortMenu` |
| `savePsSortMode` | [L8355](app.js#L8355) | Sort-Modus speichern | `normalizePsSortMode` |
| `savePsSearchQuery` | [L8364](app.js#L8364) | Suchabfrage speichern | — |
| `loadPsPinnedOnly` | [L8372](app.js#L8372) | Nur-Pinned laden | `updatePsPinnedToggle` |
| `savePsPinnedOnly` | [L8381](app.js#L8381) | Nur-Pinned speichern | — |
| `updatePsPinnedToggle` | [L8389](app.js#L8389) | Pinned-Toggle aktualisieren | — |
| `noteMatchesSearch` | [L8408](app.js#L8408) | Notiz-Suchfilter prüfen | — |
| `applyPersonalSpaceFiltersAndRender` | [L8430](app.js#L8430) | Filter anwenden & rendern | `ensureNoteUpdatedAt`, `getNoteTitle`, `normalizeSearchQuery`, `noteIsPinned`, `noteMatchesSearch`, `renderPsList`, `renderPsTags`, `t`, `updateEditorMetaYaml` |

##### 18.3 PS Tags-Prefs

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `loadPsTagsCollapsed` | [L8498](app.js#L8498) | Tags-Collapsed laden | — |
| `savePsTagsCollapsed` | [L8506](app.js#L8506) | Tags-Collapsed speichern | — |
| `applyPsTagsCollapsed` | [L8514](app.js#L8514) | Tags-Collapsed anwenden | — |
| `loadPsTagPrefs` | [L8536](app.js#L8536) | Tag-Prefs laden | `t` |
| `savePsTagPrefs` | [L8566](app.js#L8566) | Tag-Prefs speichern | — |

##### 18.4 Passwort-Maskierung `#password`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `escapeHtml` | [L6446](app.js#L6446) | HTML escapen | — |
| `renderPasswordToken` | [L6453](app.js#L6453) | Passwort-Token rendern | `escapeHtml` |
| `copyTextToClipboard` | [L6458](app.js#L6458) | Text in Zwischenablage | `t` |
| `togglePasswordField` | [L6483](app.js#L6483) | Passwort-Feld umschalten | — |
| `loadEditorMaskDisabled` | [L6504](app.js#L6504) | Mask-Disabled laden | — |
| `saveEditorMaskDisabled` | [L6513](app.js#L6513) | Mask-Disabled speichern | — |
| `toggleEditorMaskView` | [L6524](app.js#L6524) | Mask-View umschalten | `saveEditorMaskDisabled`, `setEditorMaskToggleUi`, `updatePasswordMaskOverlay` |
| `setEditorMaskToggleUi` | [L6531](app.js#L6531) | Mask-Toggle-UI setzen | — |
| `loadCrdtMarksPreference` | [L6549](app.js#L6549) | CRDT-Marks-Pref laden | — |
| `saveCrdtMarksPreference` | [L6558](app.js#L6558) | CRDT-Marks-Pref speichern | — |
| `setCrdtMarksToggleUi` | [L6569](app.js#L6569) | CRDT-Marks-Toggle-UI | — |
| `toggleCrdtMarks` | [L6588](app.js#L6588) | CRDT-Marks umschalten | `saveCrdtMarksPreference`, `setCrdtMarksToggleUi`, `updateAttributionOverlay` |
| `hasPasswordTokens` | [L6595](app.js#L6595) | Passwort-Tokens prüfen | `t` |
| `maskPasswordTokens` | [L6599](app.js#L6599) | Passwort-Tokens maskieren | `t` |
| `buildEditorMaskHtml` | [L6606](app.js#L6606) | Editor-Mask-HTML bauen | `escapeHtml` |
| `syncPasswordMaskScroll` | [L6630](app.js#L6630) | Mask-Scroll synchronisieren | — |
| `updatePasswordMaskOverlay` | [L6637](app.js#L6637) | Mask-Overlay aktualisieren | `buildEditorMaskHtml`, `hasPasswordTokens`, `syncPasswordMaskScroll`, `updateAttributionOverlay` |

#### 19 · Preview & Rendering `#preview`

##### 19.1 Run-Output

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getPreviewRunCombinedText` | [L6653](app.js#L6653) | Run-Combined-Text lesen | — |
| `updateRunOutputUi` | [L6661](app.js#L6661) | Run-Output-UI aktualisieren | — |
| `updateRunOutputSizing` | [L6703](app.js#L6703) | Run-Output-Sizing | `t` |
| `setPreviewRunOutput` | [L6754](app.js#L6754) | Run-Output setzen | `escapeHtml`, `getPreviewRunCombinedText`, `t`, `updateRunOutputSizing`, `updateRunOutputUi` |
| `parseRunnableFromEditor` | [L6781](app.js#L6781) | Runnable-Block parsen | `t` |

##### 19.2 Code-Language & Fenced-Blocks

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getSelectedCodeLang` | [L6812](app.js#L6812) | Code-Sprache lesen | — |
| `getFencedCodeOpenAtPos` | [L6821](app.js#L6821) | Fenced-Code an Position prüfen | *(umfangreiche Abhängigkeiten)* |
| `setFencedCodeLanguage` | [L6854](app.js#L6854) | Fenced-Code-Sprache setzen | *(umfangreiche Abhängigkeiten)* |
| `updateCodeLangOverlay` | [L6887](app.js#L6887) | Code-Lang-Overlay aktualisieren | `getFencedCodeOpenAtPos`, `resetEditorMetaPadding`, `updateEditorMetaPadding`, `updateEditorMetaScroll` |
| `insertCodeBlock` | [L6916](app.js#L6916) | Code-Block einfügen | `getSelectedCodeLang`, `nowIso`, `scheduleSend`, `updateCodeLangOverlay`, `updatePasswordMaskOverlay`, `updatePreview` |

##### 19.3 Markdown & Rendering

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `ensureMarkdown` | [L6943](app.js#L6943) | Markdown-Lib laden | `escapeHtml`, `renderPasswordToken`, `t` |
| `applyHljsToHtml` | [L7070](app.js#L7070) | Syntax-Highlighting anwenden | `t` |
| `embedPdfLinks` | [L7090](app.js#L7090) | PDF-Links einbetten | `t` |
| `buildNoteTitleIndex` | [L7156](app.js#L7156) | Notiz-Titel-Index bauen | `getNoteTitle`, `t` |
| `applyWikiLinksToMarkdown` | [L7174](app.js#L7174) | Wiki-Links in Markdown | `buildNoteTitleIndex`, `t` |
| `renderNoteHtml` | [L7188](app.js#L7188) | Notiz → HTML rendern | `ensureMarkdown`, `t`, `toast` |
| `setFullPreview` | [L7226](app.js#L7226) | Full-Preview setzen | `t`, `updateRunOutputSizing` |
| `setPreviewVisible` | [L7244](app.js#L7244) | Preview-Sichtbarkeit setzen | `ensureMarkdown`, `setFullPreview`, `syncMobileFocusState`, `t`, `toast`, `updatePreview`, `updateRunOutputSizing`, `updateRunOutputUi` |
| `updatePreview` | [L7274](app.js#L7274) | Preview aktualisieren | `allTaskCheckboxes`, `applyHljsToHtml`, `applyWikiLinksToMarkdown`, `buildNoteMetaYaml`, `buildToc`, `embedPdfLinks`, `ensureMarkdown`, `ensurePdfJsLoaded`, `escapeHtml`, `findCheckbox`, `findNoteById`, `getNoteHrefTarget`, `getPdfRenderId`, `indexOfCheckbox`, `initImageTools`, `initPdfEmbeds`, `renderPdfPage`, `send`, `setExpanded`, `setPasswordRevealed`, `setPreviewDocument`, `slugify`, `t`, `toElement`, `updatePdfNav`, `wrapImage` |

##### 19.4 Helfer & PDF

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `send` | [L7522](app.js#L7522) | WS-Nachricht senden (low-level) | — |
| `slugify` | [L7529](app.js#L7529) | Slug erzeugen | — |
| `buildToc` | [L7537](app.js#L7537) | Inhaltsverzeichnis bauen | `setExpanded`, `slugify`, `t` |
| `setExpanded` | [L7583](app.js#L7583) | Expandiert setzen | — |
| `getNoteHrefTarget` | [L7619](app.js#L7619) | Notiz-Link-Target lesen | — |
| `toElement` | [L7625](app.js#L7625) | String → DOM-Element | — |
| `findCheckbox` | [L7631](app.js#L7631) | Checkbox finden | `t`, `toElement` |
| `allTaskCheckboxes` | [L7648](app.js#L7648) | Alle Task-Checkboxen | — |
| `indexOfCheckbox` | [L7658](app.js#L7658) | Checkbox-Index | `allTaskCheckboxes` |
| `setPasswordRevealed` | [L7687](app.js#L7687) | Passwort aufdecken | — |
| `wrapImage` | [L7719](app.js#L7719) | Bild wrappen | `t` |
| `initImageTools` | [L7746](app.js#L7746) | Image-Tools initialisieren | `wrapImage` |
| `getPdfRenderId` | [L7754](app.js#L7754) | PDF-Render-ID lesen | — |
| `updatePdfNav` | [L7763](app.js#L7763) | PDF-Nav aktualisieren | — |
| `renderPdfPage` | [L7773](app.js#L7773) | PDF-Seite rendern | `getPdfRenderId`, `send` |
| `initPdfEmbeds` | [L7783](app.js#L7783) | PDF-Embeds initialisieren | `renderPdfPage`, `t` |
| `toggleMarkdownTaskAtIndex` | [L7845](app.js#L7845) | Markdown-Task umschalten | `getActiveRoomTabNoteId`, `schedulePsAutoSave`, `scheduleSend`, `t`, `updateLocalNoteText`, `updatePreview` |
| `attachPreviewCheckboxWriteback` | [L7888](app.js#L7888) | Checkbox-Writeback anbinden | `findCheckbox`, `indexOfCheckbox`, `nowIso`, `t`, `toElement`, `toggleMarkdownTaskAtIndex` |
| `setPreviewDocument` | [L7961](app.js#L7961) | Preview-Document setzen | `attachPreviewCheckboxWriteback`, `t` |

##### 18.4b PS Tags-Verwaltung `#tags`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `sortTagList` | [L7999](app.js#L7999) | Tag-Liste sortieren | `t` |
| `buildTagSections` | [L8003](app.js#L8003) | Tag-Sections bauen | `isMonthTag`, `isYearTag`, `sortTagList`, `t` |
| `loadPsTagSectionState` | [L8060](app.js#L8060) | Tag-Section-State laden | — |
| `savePsTagSectionState` | [L8071](app.js#L8071) | Tag-Section-State speichern | — |
| `normalizeSingleTag` | [L8082](app.js#L8082) | Einzelnen Tag normalisieren | `normalizeManualTags` |
| `dedupeRawTags` | [L8087](app.js#L8087) | Rohe Tags deduplizieren | `t` |
| `updateNotesForTagChange` | [L8101](app.js#L8101) | Notizen für Tag-Änderung aktualisieren | `api`, `applyPersonalSpaceFiltersAndRender`, `dedupeRawTags`, `rebuildPsTagsFromNotes`, `t`, `toast` |
| `resetPsTagContextDelete` | [L8171](app.js#L8171) | Tag-Kontext-Löschen zurücksetzen | `t` |
| `setPsTagContextMenuOpen` | [L8180](app.js#L8180) | Tag-Kontext-Menü öffnen/schließen | — |
| `positionPsTagContextMenu` | [L8186](app.js#L8186) | Tag-Kontext-Menü positionieren | `t` |
| `closePsTagContextMenu` | [L8198](app.js#L8198) | Tag-Kontext-Menü schließen | `resetPsTagContextDelete`, `setPsTagContextMenuOpen` |
| `openPsTagContextMenu` | [L8204](app.js#L8204) | Tag-Kontext-Menü öffnen | `closePsContextMenu`, `positionPsTagContextMenu`, `resetPsTagContextDelete`, `setPsTagContextMenuOpen`, `t` |
| `applyPsTagContextValue` | [L8223](app.js#L8223) | Tag-Kontext-Wert anwenden | `closePsTagContextMenu`, `normalizeSingleTag`, `t`, `toast`, `updateNotesForTagChange` |
| `applyPsTagContextInput` | [L8246](app.js#L8246) | Tag-Kontext-Input anwenden | `applyPsTagContextValue` |
| `confirmPsTagContextDelete` | [L8251](app.js#L8251) | Tag-Löschen bestätigen | `closePsTagContextMenu`, `updateNotesForTagChange` |
| `updatePsTagsActiveInfo` | [L8258](app.js#L8258) | Tags-Active-Info aktualisieren | — |
| `renderPsTags` | [L8271](app.js#L8271) | PS-Tags rendern | `buildTagSections`, `loadPsTagSectionState`, `openPsTagContextMenu`, `refreshPersonalSpace`, `savePsTagPrefs`, `savePsTagSectionState`, `t`, `updatePsTagsActiveInfo` |
| `togglePinnedForNote` | [L8384](app.js#L8384) | Notiz-Pinned umschalten | `api`, `applyPersonalSpaceFiltersAndRender`, `buildPsTagsPayload`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `refreshPersonalSpace`, `splitTagsForEditor`, `stripManualTagsMarker`, `stripPinnedTag`, `syncPsEditorTagsInput`, `t`, `toast`, `updatePsEditingTagsHint` |

##### 18.5 PS Notiz-Navigation

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `findNoteById` | [L11361](app.js#L11361) | Notiz per ID finden | — |
| `updatePsNoteNavButtons` | [L11368](app.js#L11368) | Nav-Buttons aktualisieren | — |
| `pushPsNoteHistory` | [L11377](app.js#L11377) | Notiz-History pushen | `updatePsNoteNavButtons` |
| `navigatePsNoteHistory` | [L11392](app.js#L11392) | In History navigieren | `applyNoteToEditor`, `findNoteById`, `updatePsNoteNavButtons` |
| `rebuildPsTagsFromNotes` | [L11405](app.js#L11405) | Tags aus Notizen neubauen | `t`, `updatePsEditorTagsSuggest` |
| `updateEditingNoteTagsLocal` | [L11428](app.js#L11428) | Tags lokal aktualisieren | `applyPersonalSpaceFiltersAndRender`, `buildEditorSystemTags`, `buildPsTagsPayload`, `rebuildPsTagsFromNotes`, `uniqTags` |
| `schedulePsTagsAutoSave` | [L11450](app.js#L11450) | Tags-Auto-Save planen | `savePersonalSpaceNote`, `t` |
| `findNoteByTitle` | [L11460](app.js#L11460) | Notiz per Titel finden | `getNoteTitle`, `t` |
| `normalizeNoteTextForCompare` | [L11476](app.js#L11476) | Notiz-Text normalisieren | — |
| `findNoteByText` | [L11482](app.js#L11482) | Notiz per Text finden | `normalizeNoteTextForCompare`, `t` |
| `clearPsEditingNoteState` | [L11498](app.js#L11498) | Editing-State löschen | `getDateTagsForTs`, `syncPsEditorTagsInput`, `t`, `updateEditorMetaYaml`, `updatePsEditingTagsHint` |
| `syncPsEditingNoteFromEditorText` | [L11517](app.js#L11517) | Editing-State aus Editor sync | `applyPersonalSpaceFiltersAndRender`, `clearPsEditingNoteState`, `findNoteByText`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeNoteTextForCompare`, `normalizeYearTag`, `splitTagsForEditor`, `syncPsEditorTagsInput`, `t`, `updateEditorMetaYaml`, `updatePsEditingTagsHint` |
| `applyNoteToEditor` | [L11557](app.js#L11557) | Notiz → Editor | `applyPersonalSpaceFiltersAndRender`, `isMobileViewport`, `markPsNoteAccessed`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `pushPsNoteHistory`, `renderPsList`, `setPreviewVisible`, `setPsAutoSaveStatus`, `setRoomTabNoteId`, `splitTagsForEditor`, `syncMobileFocusState`, `syncPsEditorTagsInput`, `t`, `updateEditorMetaYaml`, `updatePasswordMaskOverlay`, `updatePreview`, `updatePsEditingTagsHint`, `updateRoomTabTextLocal` |
| `openNoteFromWikiTarget` | [L11625](app.js#L11625) | Notiz aus Wiki-Link öffnen | `applyNoteToEditor`, `findNoteById`, `findNoteByTitle`, `t`, `toast` |

##### 18.6 PS Context-Menü & Bulk

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `syncPsListHeight` | [L11643](app.js#L11643) | Listen-Höhe synchronisieren | `t` |
| `setPsContextMenuOpen` | [L11670](app.js#L11670) | Kontext-Menü öffnen/schließen | — |
| `positionPsContextMenu` | [L11676](app.js#L11676) | Kontext-Menü positionieren | `t` |
| `openPsContextMenu` | [L11687](app.js#L11687) | Kontext-Menü öffnen | `closePsTagContextMenu`, `positionPsContextMenu`, `setPsContextMenuOpen` |
| `closePsContextMenu` | [L11702](app.js#L11702) | Kontext-Menü schließen | `setPsContextMenuOpen` |
| `updatePsBulkBar` | [L11707](app.js#L11707) | Bulk-Bar aktualisieren | `syncPsBulkSelectionToDom` |
| `syncPsBulkSelectionToDom` | [L11711](app.js#L11711) | Bulk-Selection → DOM | — |
| `prunePsSelectedNotes` | [L11721](app.js#L11721) | Auswahl bereinigen | `t`, `updatePsBulkBar` |
| `setPsNoteSelected` | [L11733](app.js#L11733) | Notiz selektieren | `updatePsBulkBar` |
| `togglePsSelectAll` | [L11741](app.js#L11741) | Alle selektieren/deselektieren | `updatePsBulkBar` |
| `clearPsSelection` | [L11752](app.js#L11752) | Auswahl löschen | `t`, `updatePsBulkBar` |
| `getSelectedNoteIds` | [L11757](app.js#L11757) | Selektierte IDs lesen | — |
| `applyBulkTagsToNotes` | [L11761](app.js#L11761) | Bulk-Tags anwenden | `api`, `buildPsTagsPayload`, `findNoteById`, `t`, `toast` |
| `deleteBulkNotes` | [L11791](app.js#L11791) | Bulk-Notizen löschen | `api`, `syncMobileFocusState`, `t`, `toast` |

##### 18.7 PS Tags-Verwaltung (erweitert)

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `sortTagList` | [L8582](app.js#L8582) | Tag-Liste sortieren | `t` |
| `buildTagSections` | [L8586](app.js#L8586) | Tag-Sektionen bauen | `isMonthTag`, `isYearTag`, `sortTagList`, `t` |
| `loadPsTagSectionState` | [L8643](app.js#L8643) | Tag-Section-State laden | — |
| `savePsTagSectionState` | [L8654](app.js#L8654) | Tag-Section-State speichern | — |
| `normalizeSingleTag` | [L8665](app.js#L8665) | Einzelnen Tag normalisieren | `normalizeManualTags` |
| `dedupeRawTags` | [L8670](app.js#L8670) | Roh-Tags entdoppeln | `t` |
| `updateNotesForTagChange` | [L8684](app.js#L8684) | Notizen für Tag-Änderung updaten | `api`, `applyPersonalSpaceFiltersAndRender`, `dedupeRawTags`, `rebuildPsTagsFromNotes`, `t`, `toast` |
| `resetPsTagContextDelete` | [L8754](app.js#L8754) | Tag-Kontext-Löschen zurücksetzen | `t` |
| `setPsTagContextMenuOpen` | [L8763](app.js#L8763) | Tag-Kontext-Menü öffnen/schließen | — |
| `positionPsTagContextMenu` | [L8769](app.js#L8769) | Tag-Kontext-Menü positionieren | `t` |
| `closePsTagContextMenu` | [L8781](app.js#L8781) | Tag-Kontext-Menü schließen | `resetPsTagContextDelete`, `setPsTagContextMenuOpen` |
| `openPsTagContextMenu` | [L8787](app.js#L8787) | Tag-Kontext-Menü öffnen | `closePsContextMenu`, `positionPsTagContextMenu`, `resetPsTagContextDelete`, `setPsTagContextMenuOpen`, `t` |
| `applyPsTagContextValue` | [L8806](app.js#L8806) | Tag-Kontext-Wert anwenden | `closePsTagContextMenu`, `normalizeSingleTag`, `t`, `toast`, `updateNotesForTagChange` |
| `applyPsTagContextInput` | [L8829](app.js#L8829) | Tag-Kontext-Input anwenden | `applyPsTagContextValue` |
| `confirmPsTagContextDelete` | [L8834](app.js#L8834) | Tag-Kontext-Löschen bestätigen | `closePsTagContextMenu`, `updateNotesForTagChange` |
| `updatePsTagsActiveInfo` | [L8841](app.js#L8841) | Tags-Active-Info aktualisieren | — |
| `renderPsTags` | [L8854](app.js#L8854) | PS-Tags rendern | `buildTagSections`, `loadPsTagSectionState`, `openPsTagContextMenu`, `refreshPersonalSpace`, `savePsTagPrefs`, `savePsTagSectionState`, `t`, `updatePsTagsActiveInfo` |
| `togglePinnedForNote` | [L8967](app.js#L8967) | Pinned für Notiz umschalten | `api`, `applyPersonalSpaceFiltersAndRender`, `buildPsTagsPayload`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `refreshPersonalSpace`, `splitTagsForEditor`, `stripManualTagsMarker`, `stripPinnedTag`, `syncPsEditorTagsInput`, `t`, `toast`, `updatePsEditingTagsHint` |

##### 18.8 PS Liste & Save

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `renderPsList` | [L11862](app.js#L11862) | PS-Liste rendern (Hauptfunktion) | _massiv – siehe Code_ |
| `canAutoSavePsNote` | [L20734](app.js#L20734) | Auto-Save prüfen | — |
| `savePersonalSpaceNote` | [L20750](app.js#L20750) | PS-Notiz speichern | `api`, `applyNoteToEditor`, `applyPersonalSpaceFiltersAndRender`, `buildEditorSystemTags`, `buildPsTagsPayload`, `findNoteByText`, `refreshPersonalSpace`, `setPsAutoSaveStatus`, `syncPsEditingNoteTagsFromState`, `t`, `toast`, `uniqTags`, `updateEditorMetaYaml`, `updateRoomTabsForNoteId` |
| `schedulePsAutoSave` | [L20906](app.js#L20906) | PS-Auto-Save planen | `canAutoSavePsNote`, `savePersonalSpaceNote`, `setPsAutoSaveStatus`, `t` |

#### 19 · Preview & Rendering `#preview`

##### 19.1 Code-Runner-Output

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getPreviewRunCombinedText` | [L8582](app.js#L8582) | Run-Ausgabetext lesen | — |
| `updateRunOutputUi` | [L8590](app.js#L8590) | Run-Output-UI aktualisieren | — |
| `updateRunOutputSizing` | [L8632](app.js#L8632) | Run-Output-Größe anpassen | `t` |
| `setPreviewRunOutput` | [L8683](app.js#L8683) | Run-Output setzen | `escapeHtml`, `getPreviewRunCombinedText`, `t`, `updateRunOutputSizing`, `updateRunOutputUi` |

##### 19.2 Code-Blöcke & Sprache

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `parseRunnableFromEditor` | [L8710](app.js#L8710) | Runnable aus Editor parsen | `t` |
| `getSelectedCodeLang` | [L8741](app.js#L8741) | Selektierte Code-Sprache lesen | — |
| `getFencedCodeOpenAtPos` | [L8750](app.js#L8750) | Fenced-Code-Block an Position | _viele interne Deps_ |
| `setFencedCodeLanguage` | [L8783](app.js#L8783) | Fenced-Code-Sprache setzen | _viele interne Deps_ |
| `updateCodeLangOverlay` | [L8816](app.js#L8816) | Code-Lang-Overlay aktualisieren | `getFencedCodeOpenAtPos`, `resetEditorMetaPadding`, `updateEditorMetaPadding`, `updateEditorMetaScroll` |
| `insertCodeBlock` | [L8845](app.js#L8845) | Code-Block einfügen | `getSelectedCodeLang`, `nowIso`, `scheduleSend`, `updateCodeLangOverlay`, `updatePasswordMaskOverlay`, `updatePreview` |

##### 19.3 Markdown & HTML

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `ensureMarkdown` | [L8872](app.js#L8872) | Markdown-Lib laden | `escapeHtml`, `renderPasswordToken`, `t` |
| `applyHljsToHtml` | [L8999](app.js#L8999) | Syntax-Highlighting anwenden | `t` |
| `embedPdfLinks` | [L9019](app.js#L9019) | PDF-Links einbetten | `t` |
| `buildNoteTitleIndex` | [L9085](app.js#L9085) | Notiz-Titel-Index bauen | `getNoteTitle`, `t` |
| `applyWikiLinksToMarkdown` | [L9103](app.js#L9103) | Wiki-Links in Markdown | `buildNoteTitleIndex`, `t` |
| `renderNoteHtml` | [L9117](app.js#L9117) | Notiz-HTML rendern | `ensureMarkdown`, `t`, `toast` |
| `setFullPreview` | [L9155](app.js#L9155) | Vollbild-Preview setzen | `t`, `updateRunOutputSizing` |
| `setPreviewVisible` | [L9173](app.js#L9173) | Preview sichtbar setzen | `ensureMarkdown`, `setFullPreview`, `syncMobileFocusState`, `t`, `toast`, `updatePreview`, `updateRunOutputSizing`, `updateRunOutputUi` |
| `updatePreview` | [L9667](app.js#L9667) | Preview aktualisieren (Haupt) | `allTaskCheckboxes`, `applyHljsToHtml`, `applyWikiLinksToMarkdown`, `buildNoteMetaYaml`, `buildToc`, `embedPdfLinks`, `ensureMarkdown`, `ensurePdfJsLoaded`, `escapeHtml`, `findCheckbox`, `findNoteById`, `getNoteHrefTarget`, `getPdfRenderId`, `indexOfCheckbox`, `initImageTools`, `initPdfEmbeds`, `renderPdfPage`, `send`, `setExpanded`, `setPasswordRevealed`, `setPreviewDocument`, `slugify`, `t`, `toElement`, `updatePdfNav`, `wrapImage` |

##### 19.4 Preview-Helfer

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `send` | [L9915](app.js#L9915) | Send-Helper | — |
| `slugify` | [L9922](app.js#L9922) | Text → Slug | — |
| `buildToc` | [L9930](app.js#L9930) | Inhaltsverzeichnis bauen | `setExpanded`, `slugify`, `t` |
| `setExpanded` | [L9976](app.js#L9976) | Expanded-State setzen | — |
| `getNoteHrefTarget` | [L10012](app.js#L10012) | Note-Href-Target lesen | — |
| `toElement` | [L10018](app.js#L10018) | String → DOM-Element | — |
| `findCheckbox` | [L10024](app.js#L10024) | Checkbox finden | `t`, `toElement` |
| `allTaskCheckboxes` | [L10041](app.js#L10041) | Alle Task-Checkboxen | — |
| `indexOfCheckbox` | [L10051](app.js#L10051) | Checkbox-Index | `allTaskCheckboxes` |
| `setPasswordRevealed` | [L10080](app.js#L10080) | Passwort-Reveal setzen | — |
| `wrapImage` | [L10112](app.js#L10112) | Bild wrappen | `t` |
| `initImageTools` | [L10139](app.js#L10139) | Image-Tools initialisieren | `wrapImage` |
| `getPdfRenderId` | [L10147](app.js#L10147) | PDF-Render-ID lesen | — |
| `updatePdfNav` | [L10156](app.js#L10156) | PDF-Navigation aktualisieren | — |
| `renderPdfPage` | [L10166](app.js#L10166) | PDF-Seite rendern | `getPdfRenderId`, `send` |
| `initPdfEmbeds` | [L10176](app.js#L10176) | PDF-Embeds initialisieren | `renderPdfPage`, `t` |
| `toggleMarkdownTaskAtIndex` | [L10465](app.js#L10465) | Markdown-Task umschalten | `getActiveRoomTabNoteId`, `schedulePsAutoSave`, `scheduleSend`, `t`, `updateLocalNoteText`, `updatePreview` |
| `attachPreviewCheckboxWriteback` | [L10508](app.js#L10508) | Checkbox-Writeback anhängen | `findCheckbox`, `indexOfCheckbox`, `nowIso`, `t`, `toElement`, `toggleMarkdownTaskAtIndex` |
| `setPreviewDocument` | [L10581](app.js#L10581) | Preview-Dokument setzen | `attachPreviewCheckboxWriteback`, `t` |
| `applyTaskClosedTimestampsToHtml` | [L10878](app.js#L10878) | Task-Closed-Timestamps anwenden | — |

#### 20 · Code-Runner `#runner`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `ensureJsRunnerFrame` | [L12082](app.js#L12082) | JS-Runner-Frame sichern | `t` |
| `runJsSnippet` | [L12191](app.js#L12191) | JS-Snippet ausführen | `ensureJsRunnerFrame`, `send`, `t` |
| `normalizeBase` | [L12374](app.js#L12374) | Base-URL normalisieren | — |
| `ensurePyodide` | [L12380](app.js#L12380) | Pyodide laden | `normalizeBase` |
| `ensurePyRunnerWorker` | [L12365](app.js#L12365) | Python-Runner-Worker sichern | `ensurePyodide`, `normalizeBase`, `t` |
| `runPySnippet` | [L12459](app.js#L12459) | Python-Snippet ausführen | `ensurePyRunnerWorker`, `t` |
| `runSnippetForNote` | [L12515](app.js#L12515) | Snippet für Notiz ausführen | `renderPsList`, `runJsSnippet`, `runPySnippet`, `t`, `toast` |
| `getAiMode` | [L12552](app.js#L12552) | AI-Modus ermitteln | — |
| `aiAssistFromPreview` | [L12563](app.js#L12563) | AI-Assist aus Preview | `api`, `getAiApiConfig`, `getAiMode`, `getAiPrompt`, `getAiUseAnswer`, `getAiUsePreview`, `parseRunnableFromEditor`, `saveAiPrompt`, `setPreviewRunOutput`, `t`, `toast` |

#### 21 · Import/Export `#import`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `refreshPersonalSpace` | [L12684](app.js#L12684) | Personal Space neu laden | `api`, `applyPersonalSpaceFiltersAndRender`, `clearPsSelection`, `dedupeFavorites`, `ensureNoteUpdatedAt`, `maybeStartMobileAutoNoteSession`, `renderRoomTabs`, `setPsAutoSaveStatus`, `setPsEditorTagsVisible`, `syncCalendarSettingsFromServer`, `syncLocalRoomTabsToServer`, `syncPsEditingNoteTagsFromState`, `syncPsEditorTagsInput`, `t`, `updateEditorMetaYaml`, `updateFavoritesUI`, `updatePsNoteNavButtons`, `updatePsPinnedToggle` |
| `downloadJson` | [L12750](app.js#L12750) | JSON herunterladen | `t`, `toast` |
| `ymd` | [L12767](app.js#L12767) | Datum → YYYY-MM-DD | `t` |
| `fetchPersonalSpaceExport` | [L12779](app.js#L12779) | PS-Export abrufen | `api` |
| `exportPersonalSpaceNotes` | [L12787](app.js#L12787) | PS-Notizen exportieren | `downloadJson`, `fetchPersonalSpaceExport`, `t`, `toast`, `ymd` |
| `importPersonalSpaceNotes` | [L12806](app.js#L12806) | PS-Notizen importieren | `api`, `refreshPersonalSpace`, `t`, `toast` |
| `chunkTextIntoNotes` | [L12833](app.js#L12833) | Text in Notizen aufteilen | `chunkBigText`, `splitByHeadings`, `splitByHr`, `splitOffFrontMatter`, `t` |
| `splitOffFrontMatter` | [L12845](app.js#L12845) | Frontmatter abtrennen | `t` |
| `splitByHr` | [L12864](app.js#L12864) | Am HR aufteilen | `t` |
| `splitByHeadings` | [L12890](app.js#L12890) | An Überschriften aufteilen | `t` |
| `chunkBigText` | [L12910](app.js#L12910) | Großen Text chunken | — |
| `importPersonalSpaceNotesFromText` | [L12957](app.js#L12957) | PS-Notizen aus Text importieren | `importPersonalSpaceNotes`, `t`, `toast` |
| `importPersonalSpaceFile` | [L12979](app.js#L12979) | PS-Datei importieren | `chunkTextIntoNotes`, `importPersonalSpaceNotes`, `importPersonalSpaceNotesFromText`, `t`, `toast` |
| `startNotesImport` | [L13006](app.js#L13006) | Notiz-Import starten | `t`, `toast` |
| `requestPersonalSpaceLink` | [L13023](app.js#L13023) | PS-Link anfordern | `api`, `modalPrompt`, `t`, `toast` |
| `randomRoom` | [L13069](app.js#L13069) | Zufälligen Raum erzeugen | `normalizeRoom`, `t` |

#### 22 · Favoriten `#favorites`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `normalizeFavoriteEntry` | [L13099](app.js#L13099) | Favorit-Eintrag normalisieren | `normalizeKey`, `normalizeRoom` |
| `dedupeFavorites` | [L13109](app.js#L13109) | Favoriten entdoppeln | `normalizeFavoriteEntry`, `t` |
| `loadLocalFavorites` | [L13460](app.js#L13460) | Lokale Favoriten laden | `dedupeFavorites` |
| `loadFavorites` | [L13471](app.js#L13471) | Favoriten laden | `dedupeFavorites`, `loadLocalFavorites` |
| `saveFavorites` | [L13479](app.js#L13479) | Favoriten speichern | `dedupeFavorites` |
| `findFavoriteIndex` | [L13491](app.js#L13491) | Favorit-Index finden | `loadFavorites` |
| `upsertFavoriteInState` | [L13204](app.js#L13204) | Favorit in State upserten | `normalizeFavoriteEntry` |
| `renderFavorites` | [L14496](app.js#L14496) | Favoriten rendern | _viele Deps – Kalender, Tabs, etc._ |
| `renderFavoritesManager` | [L14521](app.js#L14521) | Favoriten-Manager rendern | `dedupeFavorites`, `escapeAttr`, `escapeHtml`, `loadFavorites`, `t` |
| `updateFavoriteText` | [L16632](app.js#L16632) | Favorit-Text aktualisieren | `api`, `dedupeFavorites`, `loadFavorites`, `normalizeKey`, `normalizeRoom`, `saveFavorites`, `updateFavoritesUI` |
| `removeFavorite` | [L16662](app.js#L16662) | Favorit entfernen | `api`, `dedupeFavorites`, `loadFavorites`, `normalizeKey`, `normalizeRoom`, `saveFavorites`, `updateFavoritesUI` |
| `updateFavoriteButton` | [L16711](app.js#L16711) | Favorit-Button aktualisieren | `findFavoriteIndex` |
| `updateFavoritesUI` | [L16719](app.js#L16719) | Favoriten-UI aktualisieren (Haupt) | _massiv – fast alle Module_ |

#### 23 · Room-Tabs `#tabs`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `normalizeRoomTabEntry` | [L13147](app.js#L13147) | Room-Tab-Eintrag normalisieren | `normalizeKey`, `normalizeRoom` |
| `dedupeRoomTabs` | [L13158](app.js#L13158) | Room-Tabs entdoppeln | `normalizeKey`, `normalizeRoom`, `normalizeRoomTabEntry`, `t` |
| `showRoomTabLimitModal` | [L13206](app.js#L13206) | Tab-Limit-Modal zeigen | `openModal` |
| `mergeRoomTabs` | [L13219](app.js#L13219) | Room-Tabs mergen | `normalizeRoomTabEntry`, `t` |
| `loadLocalRoomTabs` | [L13251](app.js#L13251) | Lokale Room-Tabs laden | `dedupeRoomTabs`, `saveRoomTabs` |
| `loadRoomTabs` | [L13266](app.js#L13266) | Room-Tabs laden | `dedupeRoomTabs`, `loadLocalRoomTabs`, `mergeRoomTabs` |
| `saveRoomTabs` | [L13275](app.js#L13275) | Room-Tabs speichern | `dedupeRoomTabs` |
| `getActiveRoomTabNoteId` | [L13287](app.js#L13287) | Aktive Room-Tab-Note-ID | — |
| `resolveRoomTabSnapshotText` | [L13291](app.js#L13291) | Room-Tab-Snapshot auflösen | — |
| `upsertRoomTabInState` | [L13297](app.js#L13297) | Room-Tab in State upserten | `normalizeRoomTabEntry` |
| `removeRoomTabFromState` | [L13313](app.js#L13313) | Room-Tab aus State entfernen | `normalizeKey`, `normalizeRoom` |
| `updateRoomTabTextLocal` | [L13326](app.js#L13326) | Room-Tab-Text lokal updaten | `dedupeRoomTabs`, `getActiveRoomTabNoteId`, `loadRoomTabs`, `normalizeKey`, `normalizeRoom`, `resolveRoomTabSnapshotText`, `saveRoomTabs`, `t` |
| `updateRoomTabsForNoteId` | [L13352](app.js#L13352) | Room-Tabs für Note-ID updaten | `dedupeRoomTabs`, `loadRoomTabs`, `saveRoomTabs` |
| `setRoomTabNoteId` | [L13366](app.js#L13366) | Room-Tab-Note-ID setzen | `dedupeRoomTabs`, `loadRoomTabs`, `normalizeKey`, `normalizeRoom`, `saveRoomTabs` |
| `findRoomTabByNoteId` | [L13391](app.js#L13391) | Room-Tab per Note-ID finden | `loadRoomTabs` |
| `updateLocalNoteText` | [L13401](app.js#L13401) | Lokalen Notiz-Text updaten | — |
| `syncRoomTabToServer` | [L13245](app.js#L13245) | Room-Tab → Server synchen | `api`, `normalizeKey`, `normalizeRoom`, `renderRoomTabs`, `upsertRoomTabInState` |
| `scheduleRoomTabSync` | [L13272](app.js#L13272) | Room-Tab-Sync planen | `syncRoomTabToServer`, `t` |
| `flushRoomTabSync` | [L13294](app.js#L13294) | Room-Tab-Sync flushen | `getActiveRoomTabNoteId`, `resolveRoomTabSnapshotText`, `scheduleRoomTabSync`, `t` |
| `syncLocalRoomTabsToServer` | [L13306](app.js#L13306) | Lokale Room-Tabs → Server | `loadLocalRoomTabs`, `normalizeKey`, `normalizeRoom`, `syncRoomTabToServer`, `t` |
| `touchRoomTab` | [L13330](app.js#L13330) | Room-Tab berühren | `dedupeRoomTabs`, `getActiveRoomTabNoteId`, `loadRoomTabs`, `normalizeKey`, `normalizeRoom`, `resolveRoomTabSnapshotText`, `saveRoomTabs`, `scheduleRoomTabSync`, `showRoomTabLimitModal`, `t` |
| `escapeHtml` | [L14308](app.js#L14308) | HTML escapen (Tabs-Kontext) | — |
| `escapeAttr` | [L14315](app.js#L14315) | Attribut escapen | `escapeHtml` |
| `renderRoomTabs` | [L14330](app.js#L14330) | Room-Tabs rendern | `escapeAttr`, `escapeHtml`, `loadRoomTabs` |
| `closeRoomTab` | [L14419](app.js#L14419) | Room-Tab schließen | `api`, `buildShareHash`, `loadRoomTabs`, `normalizeKey`, `normalizeRoom`, `randomKey`, `randomRoom`, `removeRoomTabFromState`, `renderRoomTabs`, `saveRoomTabs` |

#### 24 · Room-Pins (Permanent Links) `#pins`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `normalizeRoomPinnedEntry` | [L13437](app.js#L13437) | Room-Pinned-Eintrag normalisieren | `normalizeKey`, `normalizeRoom` |
| `mergeRoomPinnedEntries` | [L13448](app.js#L13448) | Room-Pinned-Einträge mergen | `normalizeRoomPinnedEntry` |
| `loadLocalRoomPinnedEntries` | [L13464](app.js#L13464) | Lokale Pinned-Entries laden | `normalizeRoomPinnedEntry`, `saveRoomPinnedEntries` |
| `loadRoomPinnedEntries` | [L13540](app.js#L13540) | Room-Pinned-Entries laden | `loadLocalRoomPinnedEntries`, `mergeRoomPinnedEntries` |
| `saveRoomPinnedEntries` | [L13551](app.js#L13551) | Room-Pinned-Entries speichern | `normalizeRoomPinnedEntry` |
| `getRoomPinnedEntry` | [L13565](app.js#L13565) | Room-Pinned-Entry lesen | `loadRoomPinnedEntries`, `normalizeKey`, `normalizeRoom` |
| `setRoomPinnedEntry` | [L13576](app.js#L13576) | Room-Pinned-Entry setzen | `loadRoomPinnedEntries`, `normalizeKey`, `normalizeRoom`, `normalizeRoomPinnedEntry`, `saveRoomPinnedEntries`, `syncRoomPinToServer` |
| `clearRoomPinnedEntry` | [L13598](app.js#L13598) | Room-Pinned-Entry löschen | `loadRoomPinnedEntries`, `normalizeKey`, `normalizeRoom`, `removeRoomPinFromState`, `saveRoomPinnedEntries` |
| `isPinnedContentActiveForRoom` | [L13636](app.js#L13636) | Pinned-Content aktiv prüfen | `getRoomPinnedEntry` |
| `shouldSyncRoomContentNow` | [L13647](app.js#L13647) | Room-Sync prüfen | `isPinnedContentActiveForRoom` |
| `syncPermanentLinkToggleUi` | [L13651](app.js#L13651) | Permanent-Link-Toggle-UI sync | `getRoomPinnedEntry` |
| `upsertRoomPinInState` | [L13223](app.js#L13223) | Room-Pin in State upserten | `normalizeRoomPinnedEntry` |
| `removeRoomPinFromState` | [L13243](app.js#L13243) | Room-Pin aus State entfernen | `normalizeKey`, `normalizeRoom` |
| `syncRoomPinToServer` | [L13288](app.js#L13288) | Room-Pin → Server synchen | `api`, `normalizeKey`, `normalizeRoom`, `upsertRoomPinInState` |
| `syncLocalRoomPinsToServer` | [L13452](app.js#L13452) | Lokale Room-Pins → Server | `loadLocalRoomPinnedEntries`, `normalizeRoomPinnedEntry`, `syncRoomPinToServer` |
| `isRoomMarkedShared` | [L13337](app.js#L13337) | Raum als geteilt markiert prüfen | — |
| `markRoomShared` | [L13346](app.js#L13346) | Raum als geteilt markieren | — |

#### 25 · Uploads & Trash-Verwaltung `#uploads`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `formatUploadUpdatedAt` | [L14573](app.js#L14573) | Upload-Datum formatieren | — |
| `renderUploadsManageList` | [L14581](app.js#L14581) | Upload-Liste rendern | `escapeAttr`, `escapeHtml`, `formatBytes`, `formatUploadUpdatedAt`, `t` |
| `formatTrashDeletedAt` | [L14630](app.js#L14630) | Trash-Datum formatieren | — |
| `renderTrashManageList` | [L14638](app.js#L14638) | Trash-Liste rendern | `escapeAttr`, `escapeHtml`, `fmtDate`, `formatTrashDeletedAt`, `getNoteTitleAndExcerpt`, `t` |
| `loadUploadsManage` | [L16551](app.js#L16551) | Uploads laden | `api`, `renderUploadsManageList`, `t` |
| `loadTrashManage` | [L16571](app.js#L16571) | Trash laden | `api`, `renderTrashManageList`, `t` |
| `restoreTrashNote` | [L16599](app.js#L16599) | Trash-Notiz wiederherstellen | `api`, `loadTrashManage`, `refreshPersonalSpace`, `t`, `toast` |
| `deleteUpload` | [L16616](app.js#L16616) | Upload löschen | `api`, `loadUploadsManage`, `t`, `toast` |

#### 26 · Kalender `#calendar`

##### 26.1 Quellen & Settings

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `normalizeCalendarSource` | [L10969](app.js#L10969) | Kalender-Quelle normalisieren | `createClientId` |
| `loadCalendarSources` | [L10979](app.js#L10979) | Quellen laden | — |
| `saveCalendarSources` | [L10990](app.js#L10990) | Quellen speichern | `scheduleCalendarSettingsSync` |
| `loadCalendarDefaultView` | [L11004](app.js#L11004) | Standard-Ansicht laden | — |
| `saveCalendarDefaultView` | [L11013](app.js#L11013) | Standard-Ansicht speichern | `renderCalendarPanel`, `scheduleCalendarSettingsSync`, `updateCalendarViewButtons` |
| `getLocalCalendarSettings` | [L11030](app.js#L11030) | Lokale Kalender-Einstellungen lesen | `loadCalendarDefaultView`, `loadCalendarGoogleId`, `loadCalendarSources`, `loadLocalCalendarEventsRaw` |
| `applyCalendarSettings` | [L11039](app.js#L11039) | Kalender-Einstellungen anwenden | `renderCalendarPanel`, `renderCalendarSettings`, `saveCalendarDefaultView`, `saveCalendarGoogleId`, `saveCalendarSources`, `saveLocalCalendarEvents`, `scheduleCalendarRefresh` |
| `syncCalendarSettingsToServer` | [L11072](app.js#L11072) | Settings → Server synchen | `api` |
| `scheduleCalendarSettingsSync` | [L11087](app.js#L11087) | Settings-Sync debounce | `getLocalCalendarSettings`, `syncCalendarSettingsToServer`, `t` |
| `syncCalendarSettingsFromServer` | [L11115](app.js#L11115) | Settings ← Server synchen | `applyCalendarSettings`, `getLocalCalendarSettings`, `scheduleCalendarSettingsSync` |
| `renderCalendarSettings` | [L11139](app.js#L11139) | Settings-UI rendern | `escapeAttr`, `loadCalendarDefaultView`, `loadCalendarSources`, `renderCalendarGoogleSelect`, `renderCalendarLocalEvents`, `t` |

##### 26.2 Google Calendar

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `renderCalendarGoogleSelect` | [L11201](app.js#L11201) | Google-Kalender-Auswahl rendern | `escapeAttr`, `escapeHtml`, `loadCalendarGoogleId` |
| `setGoogleCalendarUi` | [L11276](app.js#L11276) | Google-UI setzen | `renderCalendarGoogleSelect`, `t` |
| `fetchGoogleCalendarList` | [L11303](app.js#L11303) | Google-Kalender-Liste abrufen | `api`, `renderCalendarGoogleSelect`, `t` |
| `fetchGoogleCalendarStatus` | [L11317](app.js#L11317) | Google-Status prüfen | `api`, `fetchGoogleCalendarList`, `saveCalendarGoogleId`, `setGoogleCalendarUi`, `t` |
| `createGoogleCalendarEvent` | [L11353](app.js#L11353) | Google-Event erstellen | `api`, `formatDateInputValue`, `t` |
| `deleteGoogleCalendarEvent` | [L11373](app.js#L11373) | Google-Event löschen | `api`, `t` |
| `loadCalendarGoogleId` | [L11621](app.js#L11621) | Google-ID laden | — |
| `saveCalendarGoogleId` | [L11632](app.js#L11632) | Google-ID speichern | `renderCalendarSettings`, `scheduleCalendarSettingsSync` |
| `fetchGoogleCalendarEvents` | [L11798](app.js#L11798) | Google-Events abrufen | `api`, `parseGoogleDate`, `t` |

##### 26.3 Panel & Darstellung

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `setCalendarPanelActive` | [L11384](app.js#L11384) | Panel aktivieren | `applyCalendarFreeSlotsVisibility`, `fetchGoogleCalendarStatus`, `loadCalendarDefaultView`, `refreshCalendarEvents`, `renderCalendarPanel`, `renderRoomTabs`, `updateCalendarViewButtons` |
| `setCalendarSidebarCollapsed` | [L11403](app.js#L11403) | Sidebar ein-/ausklappen | — |
| `startOfDay` | [L11430](app.js#L11430) | Tagesanfang berechnen | — |
| `addDays` | [L11434](app.js#L11434) | Tage addieren | — |
| `startOfWeek` | [L11440](app.js#L11440) | Wochenanfang berechnen | `startOfDay` |
| `startOfMonth` | [L11447](app.js#L11447) | Monatsanfang berechnen | — |
| `formatTime` | [L11451](app.js#L11451) | Zeit formatieren | `getUiLocale` |
| `formatDayLabel` | [L11458](app.js#L11458) | Tageslabel formatieren | `getUiLocale` |
| `formatCalendarTitle` | [L11466](app.js#L11466) | Kalender-Titel formatieren | `addDays`, `getUiLocale`, `startOfWeek` |
| `getIsoWeekNumber` | [L11494](app.js#L11494) | ISO-Wochennummer berechnen | — |
| `updateCalendarViewButtons` | [L11897](app.js#L11897) | View-Buttons aktualisieren | — |
| `getCalendarEvents` | [L11908](app.js#L11908) | Events lesen | — |
| `renderCalendarLegend` | [L11924](app.js#L11924) | Legende rendern | `escapeAttr`, `escapeHtml`, `loadCalendarSources` |
| `moveCalendarCursor` | [L11982](app.js#L11982) | Cursor bewegen | `renderCalendarPanel` |
| `renderCalendarPanel` | [L12120](app.js#L12120) | Panel rendern | `addDays`, `escapeAttr`, `escapeHtml`, `formatCalendarTitle`, `formatDayLabel`, `formatTime`, `getCalendarEvents`, `getIsoWeekNumber`, `loadCalendarSources`, `renderCalendarFreeSlots`, `renderCalendarLegend`, `startOfDay`, `startOfMonth`, `startOfWeek`, `t` |

##### 26.4 Lokale Events & ICS

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `renderCalendarLocalEvents` | [L11227](app.js#L11227) | Lokale Events rendern | `escapeAttr`, `escapeHtml`, `formatTime`, `getUiLocale`, `t` |
| `loadCalendarFreeSlotsVisible` | [L11502](app.js#L11502) | Free-Slots-Sichtbarkeit laden | — |
| `saveCalendarFreeSlotsVisible` | [L11511](app.js#L11511) | Free-Slots-Sichtbarkeit speichern | `applyCalendarFreeSlotsVisibility` |
| `applyCalendarFreeSlotsVisibility` | [L11524](app.js#L11524) | Free-Slots-Sichtbarkeit anwenden | — |
| `parseLocalEventDate` | [L11551](app.js#L11551) | Lokales Event-Datum parsen | — |
| `normalizeLocalCalendarEvent` | [L11558](app.js#L11558) | Lokales Event normalisieren | `createClientId`, `parseLocalEventDate` |
| `serializeLocalCalendarEvent` | [L11571](app.js#L11571) | Lokales Event serialisieren | — |
| `loadLocalCalendarEventsRaw` | [L11583](app.js#L11583) | Rohe lokale Events laden | — |
| `loadLocalCalendarEvents` | [L11593](app.js#L11593) | Lokale Events laden | `loadLocalCalendarEventsRaw` |
| `saveLocalCalendarEvents` | [L11599](app.js#L11599) | Lokale Events speichern | `renderCalendarPanel`, `renderCalendarSettings`, `scheduleCalendarSettingsSync` |
| `parseIcsDate` | [L11651](app.js#L11651) | ICS-Datum parsen | `t` |
| `parseGoogleDate` | [L11674](app.js#L11674) | Google-Datum parsen | `t` |
| `unfoldIcsLines` | [L11686](app.js#L11686) | ICS-Zeilen entfalten | `t` |
| `parseIcsEvents` | [L11703](app.js#L11703) | ICS-Events parsen | `addDays`, `createClientId`, `parseIcsDate`, `t`, `unfoldIcsLines` |
| `mergeCalendarEvents` | [L11766](app.js#L11766) | Events zusammenführen | — |
| `getCalendarRange` | [L11784](app.js#L11784) | Kalender-Range berechnen | `addDays`, `startOfDay`, `startOfMonth`, `startOfWeek` |

##### 26.5 Rendering & Free-Slots

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `refreshCalendarEvents` | [L11833](app.js#L11833) | Events aktualisieren | `fetchGoogleCalendarEvents`, `getCalendarRange`, `loadCalendarSources`, `mergeCalendarEvents`, `parseIcsEvents`, `renderCalendarPanel`, `t` |
| `scheduleCalendarRefresh` | [L11889](app.js#L11889) | Refresh debounce | `refreshCalendarEvents`, `t` |
| `buildWorkWindow` | [L11999](app.js#L11999) | Arbeitszeitfenster bauen | — |
| `mergeIntervals` | [L12019](app.js#L12019) | Intervalle zusammenführen | `t` |
| `computeFreeSlotsForDay` | [L12037](app.js#L12037) | Freie Slots pro Tag berechnen | `addDays`, `buildWorkWindow`, `mergeIntervals`, `startOfDay` |
| `renderCalendarFreeSlots` | [L12071](app.js#L12071) | Free-Slots rendern | `addDays`, `computeFreeSlotsForDay`, `formatDayLabel`, `formatTime`, `startOfWeek` |

##### 26.6 Event-Modal

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `formatDateInputValue` | [L12303](app.js#L12303) | Datumswert formatieren | `t` |
| `openCalendarEventModal` | [L12308](app.js#L12308) | Event-Modal öffnen | `formatDateInputValue`, `t`, `updateCalendarEventTimeState` |
| `closeCalendarEventModal` | [L12332](app.js#L12332) | Event-Modal schließen | — |
| `updateCalendarEventTimeState` | [L12339](app.js#L12339) | Zeitstatus aktualisieren | — |
| `buildLocalEventFromModal` | [L12345](app.js#L12345) | Lokales Event aus Modal bauen | `addDays`, `createClientId`, `t`, `toast` |
| `addLocalCalendarEvent` | [L12398](app.js#L12398) | Lokales Event hinzufügen | `saveLocalCalendarEvents`, `t`, `toast` |
#### 27 · Status, Recent Rooms & Share-UI `#status`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `updateFavoriteText` | [L16632](app.js#L16632) | Favoriten-Text aktualisieren | `api`, `dedupeFavorites`, `loadFavorites`, `normalizeKey`, `normalizeRoom`, `saveFavorites`, `updateFavoritesUI` |
| `removeFavorite` | [L16662](app.js#L16662) | Favorit entfernen | `api`, `dedupeFavorites`, `loadFavorites`, `normalizeKey`, `normalizeRoom`, `saveFavorites`, `updateFavoritesUI` |
| `updateFavoriteButton` | [L16711](app.js#L16711) | Favoriten-Button aktualisieren | `findFavoriteIndex` |
| `updateFavoritesUI` | [L16719](app.js#L16719) | Favoriten-UI aktualisieren | *(umfangreiche Abhängigkeiten — Init-Handler)* |
| `loadRecentRooms` | [L16733](app.js#L16733) | Recent-Rooms laden | — |
| `saveRecentRoom` | [L16742](app.js#L16742) | Recent-Room speichern | `loadRecentRooms` |
| `renderRecentRooms` | [L16751](app.js#L16751) | Recent-Rooms rendern | `loadRecentRooms` |
| `buildShareHref` | [L16760](app.js#L16760) | Share-URL bauen | `buildShareHash` |
| `updateShareLink` | [L16768](app.js#L16768) | Share-Link aktualisieren | `buildShareHref`, `updateShareModalLink` |
| `setStatus` | [L16788](app.js#L16788) | Verbindungs-Status setzen | — |
| `setHeaderCollapsed` | [L16796](app.js#L16796) | Header ein-/ausklappen | — |

#### 28 · WebSocket & CRDT `#ws` `#crdt`

##### 28.1 WS-Verbindung

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `wsDisplay` | [L16806](app.js#L16806) | WS-Status anzeigen | — |
| `hashKeyForWs` | [L16815](app.js#L16815) | Key für WS hashen | `t` |
| `wsUrlForRoom` | [L16832](app.js#L16832) | WS-URL bauen | `hashKeyForWs`, `t` |
| `isCrdtAvailable` | [L16868](app.js#L16868) | CRDT verfügbar? | — |
| `isCrdtEnabled` | [L16872](app.js#L16872) | CRDT aktiv? | — |
| `isE2eeActive` | [L16876](app.js#L16876) | E2EE aktiv? | — |
| `ensureYjsLoaded` | [L16880](app.js#L16880) | Yjs-Laden sicherstellen | `isCrdtAvailable`, `t` |
| `nowIso` | [L16894](app.js#L16894) | ISO-Zeitstempel | `getUiLocale` |
| `safeJsonParse` | [L16905](app.js#L16905) | JSON sicher parsen | — |
| `sanitizeLegacySnapshotText` | [L16913](app.js#L16913) | Legacy-Snapshot bereinigen | `safeJsonParse` |

##### 28.2 CRDT-Nachrichten

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `sendMessage` | [L16935](app.js#L16935) | WS-Nachricht senden | `send` |
| `sendCrdtUpdate` | [L16940](app.js#L16940) | CRDT-Update senden | `encryptForRoom`, `isE2eeActive`, `sendMessage` |
| `sendCrdtSnapshot` | [L16963](app.js#L16963) | CRDT-Snapshot senden | `encryptForRoom`, `isE2eeActive`, `sendMessage` |
| `buildSetMessage` | [L17384](app.js#L17384) | Set-Nachricht bauen | `encryptForRoom` |
| `sendCurrentState` | [L17400](app.js#L17400) | Aktuellen State senden | `buildSetMessage`, `sendMessage` |
| `scheduleSend` | [L17412](app.js#L17412) | Send debounce | `buildSetMessage`, `isCrdtEnabled`, `nowIso`, `sendMessage`, `t` |
| `applyRemoteText` | [L17433](app.js#L17433) | Remote-Text anwenden | `applySyncedText`, `t` |

##### 28.3 CRDT-Core

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `applySyncedText` | [L17357](app.js#L17357) | Synced-Text anwenden | `getActiveRoomTabNoteId`, `nowIso`, `resolveRoomTabSnapshotText`, `sanitizeLegacySnapshotText`, `scheduleRoomTabSync`, `t`, `updatePasswordMaskOverlay`, `updatePreview`, `updateRoomTabTextLocal` |
| `initCrdt` | [L17388](app.js#L17388) | CRDT initialisieren | `applyPendingCrdtBootstrap`, `applySyncedText`, `base64EncodeBytes`, `isCrdtAvailable`, `scheduleCrdtSnapshot`, `sendCrdtUpdate`, `t`, `updateAttributionOverlay` |
| `destroyCrdt` | [L17421](app.js#L17421) | CRDT zerstören | `t`, `updateAttributionOverlay` |
| `applyCrdtUpdate` | [L17442](app.js#L17442) | CRDT-Update anwenden | `base64DecodeBytes`, `updateAttributionOverlay` |
| `setCrdtText` | [L17457](app.js#L17457) | CRDT-Text setzen | `applySyncedText`, `sanitizeLegacySnapshotText`, `scheduleCrdtSnapshot`, `t`, `updateAttributionOverlay` |
| `updateCrdtFromTextarea` | [L17477](app.js#L17477) | CRDT ← Textarea | `t`, `updateAttributionOverlay` |
| `scheduleCrdtSnapshot` | [L17517](app.js#L17517) | Snapshot debounce | `base64EncodeBytes`, `sendCrdtSnapshot`, `t` |
| `applyPendingCrdtBootstrap` | [L17329](app.js#L17329) | Pending Bootstrap anwenden | `applyCrdtUpdate`, `setCrdtText`, `t` |
| `connect` | [L17593](app.js#L17593) | WS verbinden | `announceClientId`, `applyCrdtUpdate`, `applyPresenceUpdate`, `applyRemoteText`, `createClientId`, `decryptForRoom`, `destroyCrdt`, `ensureYjsLoaded`, `initCrdt`, `isCrdtAvailable`, `isCrdtEnabled`, `safeJsonParse`, `scheduleCrdtSnapshot`, `sendCurrentState`, `sendMessage`, `setCrdtText`, `setStatus`, `t`, `toast`, `updatePresenceUI`, `upsertPresence`, `wsDisplay`, `wsUrlForRoom` |
#### 29 · Presence `#presence`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `updatePresenceUI` | [L16999](app.js#L16999) | Presence-UI aktualisieren | `formatUi`, `t`, `updateAttributionOverlay` |
| `upsertPresence` | [L17061](app.js#L17061) | Presence einfügen/aktualisieren | `t`, `updatePresenceUI` |
| `applyPresenceUpdate` | [L17067](app.js#L17067) | Presence-Update anwenden | `t`, `updatePresenceUI` |
| `getAuthorMeta` | [L17075](app.js#L17075) | Autor-Meta lesen | `t` |
| `parseHexColor` | [L17082](app.js#L17082) | Hex-Farbe parsen | `t` |
| `colorToRgba` | [L17103](app.js#L17103) | Farbe → RGBA | `parseHexColor` |
| `syncAttributionOverlayScroll` | [L17109](app.js#L17109) | Attribution-Overlay-Scroll synchen | — |
| `buildAttributionHtml` | [L17116](app.js#L17116) | Attribution-HTML bauen | `colorToRgba`, `escapeHtml`, `getAuthorMeta` |
| `updateAttributionOverlay` | [L17138](app.js#L17138) | Attribution-Overlay aktualisieren | `buildAttributionHtml`, `syncAttributionOverlayScroll` |
| `setTyping` | [L17195](app.js#L17195) | Typing-Status setzen | `applyPresenceUpdate`, `sendMessage` |
| `scheduleTypingStop` | [L17203](app.js#L17203) | Typing-Stop debounce | `setTyping`, `t` |
| `scheduleSelectionSend` | [L17208](app.js#L17208) | Selection-Send debounce | `applyPresenceUpdate`, `sendMessage`, `t` |

#### 30 · Navigation `#nav`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `goToRoom` | [L18075](app.js#L18075) | Zu Raum navigieren | `buildShareHash`, `flushRoomTabSync`, `normalizeRoom`, `setCalendarPanelActive` |
| `goToRoomWithKey` | [L18084](app.js#L18084) | Zu Raum + Key navigieren | `buildShareHash`, `flushRoomTabSync`, `normalizeKey`, `normalizeRoom`, `setCalendarPanelActive` |

#### 31 · Linear-Integration `#linear`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `renderLinearTasks` | [L19123](app.js#L19123) | Linear-Tasks rendern | `escapeHtml`, `t` |
| `syncLinearForNote` | [L19362](app.js#L19362) | Linear für Notiz synchen | `api`, `renderLinearTasks`, `t`, `toast` |
| `toggleLinear` (click) | [L19390](app.js#L19390) | Linear-Panel umschalten | `syncLinearForNote`, `t` |

#### 32 · Synchronisation & Fokus `#sync`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `refreshSyncOnFocus` | [L20347](app.js#L20347) | Sync bei Fokus auffrischen | `connect`, `isCrdtEnabled`, `sendMessage`, `t` |
| `canAutoSavePsNote` | [L20734](app.js#L20734) | Auto-Save möglich prüfen | — |
| `savePersonalSpaceNote` | [L20750](app.js#L20750) | PS-Notiz speichern | `api`, `applyNoteToEditor`, `applyPersonalSpaceFiltersAndRender`, `buildEditorSystemTags`, `buildPsTagsPayload`, `findNoteByText`, `refreshPersonalSpace`, `setPsAutoSaveStatus`, `syncPsEditingNoteTagsFromState`, `t`, `toast`, `uniqTags`, `updateEditorMetaYaml`, `updateRoomTabsForNoteId` |
| `schedulePsAutoSave` | [L20906](app.js#L20906) | PS-Auto-Save debounce | `canAutoSavePsNote`, `savePersonalSpaceNote`, `setPsAutoSaveStatus`, `t` |

#### 33 · Initialisierung `#init`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `initUiEventListeners` | [L20974](app.js#L20974) | UI-Event-Listener initialisieren | *(umfangreiche Abhängigkeiten — bindet alle UI-Events)* |
| `initStartupTasks` | [L22010](app.js#L22010) | Startup-Tasks ausführen | `applyAiContextMode`, `initAiDictation`, `initAutoBackup`, `initAutoImport`, `initUiLanguage`, `loadAiPrompt`, `loadAiUseAnswer`, `loadAiUsePreview`, `loadCommentsForRoom`, `loadMobileAutoNoteSeconds`, `refreshPersonalSpace`, `setCommentDraftSelection`, `syncMobileFocusState`, `t`, `updateTableMenuVisibility` |

---

### server.js — Funktionskatalog

#### S1 · Server-Core & Datenbank `#server` `#db`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getClientIp` | [L105](server.js#L105) | Client-IP lesen | — |
| `checkAiRateLimit` | [L113](server.js#L113) | AI-Rate-Limit prüfen | — |
| `ensureDbDir` | [L128](server.js#L128) | DB-Verzeichnis sicherstellen | — |
| `initDb` | [L136](server.js#L136) | DB initialisieren | `ensureDbDir` |
| `loadPersistedRoomState` | [L383](server.js#L383) | Room-State laden | `initDb` |
| `persistRoomState` | [L397](server.js#L397) | Room-State persistieren | `initDb` |
| `getSigningSecret` | [L416](server.js#L416) | Signing-Secret lesen | `initDb` |

#### S2 · HTTP-Helfer `#http`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `mimeTypeForPath` | [L429](server.js#L429) | MIME-Type ermitteln | — |
| `safeJsonParse` | [L443](server.js#L443) | JSON sicher parsen | — |
| `json` | [L451](server.js#L451) | JSON-Response senden | — |
| `text` | [L460](server.js#L460) | Text-Response senden | — |
| `redirect` | [L468](server.js#L468) | Redirect senden | — |
| `readBody` | [L547](server.js#L547) | Body lesen | — |
| `readBodyWithLimit` | [L566](server.js#L566) | Body mit Limit lesen | — |
| `readJson` | [L586](server.js#L586) | JSON-Body lesen | `readBody`, `safeJsonParse` |
| `readJsonWithLimit` | [L592](server.js#L592) | JSON-Body mit Limit lesen | `readBodyWithLimit`, `safeJsonParse` |

#### S3 · Auth & Session `#auth`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `parseCookies` | [L478](server.js#L478) | Cookies parsen | — |
| `cookieOptions` | [L492](server.js#L492) | Cookie-Optionen bauen | — |
| `sign` | [L498](server.js#L498) | HMAC signieren | `getSigningSecret` |
| `makeSessionCookie` | [L505](server.js#L505) | Session-Cookie erstellen | `cookieOptions`, `sign` |
| `clearSessionCookie` | [L514](server.js#L514) | Session-Cookie löschen | — |
| `getAuthedEmail` | [L520](server.js#L520) | Auth-Email lesen | `parseCookies`, `sign` |
| `normalizeEmail` | [L538](server.js#L538) | Email normalisieren | — |
| `saveLoginToken` | [L1233](server.js#L1233) | Login-Token speichern | `initDb` |
| `getLoginToken` | [L1238](server.js#L1238) | Login-Token lesen | `initDb` |
| `deleteLoginToken` | [L1243](server.js#L1243) | Login-Token löschen | `initDb` |
| `getOrigin` | [L1248](server.js#L1248) | Origin lesen | — |
| `sendMagicLinkEmail` | [L1261](server.js#L1261) | Magic-Link-Email senden | — |

#### S4 · Uploads `#uploads`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `ensureUploadsDir` | [L598](server.js#L598) | Upload-Verzeichnis sicherstellen | — |
| `cleanupUploads` | [L606](server.js#L606) | Uploads aufräumen | `ensureUploadsDir` |
| `sanitizeFilename` | [L635](server.js#L635) | Dateiname bereinigen | — |
| `decodeDataUrl` | [L646](server.js#L646) | Data-URL dekodieren | — |
| `isAllowedUploadMime` | [L662](server.js#L662) | Upload-MIME prüfen | — |
| `extForMime` | [L667](server.js#L667) | Extension für MIME | — |

#### S5 · Notes, Tags & Favoriten `#notes` `#tags`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `uniq` | [L678](server.js#L678) | Duplikate entfernen | — |
| `extractHashtags` | [L682](server.js#L682) | Hashtags extrahieren | — |
| `classifyText` | [L690](server.js#L690) | Text klassifizieren | `applyDateTags`, `computeNoteContentHash`, `extractHashtags`, `getDateTagsForTs`, `getOrCreateUserId`, `initDb`, `isMonthTag`, `isValidNoteId`, `isYearTag`, `listNotes`, `mergeManualTags`, `normalizeImportTags`, `normalizeNoteTextForHash`, `parseTagsJson`, `splitManualOverrideTags`, `uniq` |
| `parseTagsJson` | [L780](server.js#L780) | Tags-JSON parsen | — |
| `normalizeImportTags` | [L789](server.js#L789) | Import-Tags normalisieren | `uniq` |
| `isYearTag` | [L842](server.js#L842) | Jahres-Tag prüfen | — |
| `isMonthTag` | [L846](server.js#L846) | Monats-Tag prüfen | — |
| `getDateTagsForTs` | [L852](server.js#L852) | Datums-Tags für Timestamp | — |
| `applyDateTags` | [L864](server.js#L864) | Datums-Tags anwenden | `getDateTagsForTs`, `isMonthTag`, `isYearTag`, `uniq` |
| `splitManualOverrideTags` | [L877](server.js#L877) | Manuelle Override-Tags splitten | `normalizeImportTags` |
| `mergeManualTags` | [L886](server.js#L886) | Manuelle Tags mergen | `classifyText`, `extractHashtags`, `normalizeImportTags`, `uniq` |
| `isValidNoteId` | [L915](server.js#L915) | Notiz-ID validieren | — |
| `normalizeNoteTextForHash` | [L919](server.js#L919) | Notiz-Text für Hash normalisieren | — |
| `computeNoteContentHash` | [L925](server.js#L925) | Notiz-Content-Hash berechnen | `normalizeNoteTextForHash` |
| `getOrCreateUserId` | [L931](server.js#L931) | User-ID erstellen/lesen | `initDb` |
| `listNotes` | [L940](server.js#L940) | Notizen auflisten | `initDb`, `parseTagsJson` |
| `purgeExpiredTrash` | [L969](server.js#L969) | Abgelaufenen Trash löschen | `initDb` |
| `listTrashNotes` | [L976](server.js#L976) | Trash-Notizen auflisten | `initDb`, `parseTagsJson` |
| `listTags` | [L992](server.js#L992) | Tags auflisten | `initDb`, `parseTagsJson`, `uniq` |
| `listFavorites` | [L1005](server.js#L1005) | Favoriten auflisten | `initDb` |
| `listRoomTabs` | [L1015](server.js#L1015) | Room-Tabs auflisten | `initDb` |

#### S6 · Calendar & Google `#calendar` `#google`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `sanitizeCalendarSettings` | [L1026](server.js#L1026) | Kalender-Settings bereinigen | — |
| `parseCalendarJson` | [L1094](server.js#L1094) | Kalender-JSON parsen | `sanitizeCalendarSettings` |
| `getUserSettings` | [L1105](server.js#L1105) | User-Settings lesen | `initDb`, `parseCalendarJson` |
| `upsertUserSettings` | [L1118](server.js#L1118) | User-Settings schreiben | `initDb`, `sanitizeCalendarSettings` |
| `googleConfigured` | [L1130](server.js#L1130) | Google konfiguriert? | — |
| `makeGoogleState` | [L1138](server.js#L1138) | Google-State erstellen | `sign` |
| `parseGoogleState` | [L1147](server.js#L1147) | Google-State parsen | `sign` |
| `getGoogleTokens` | [L1162](server.js#L1162) | Google-Tokens lesen | `initDb` |
| `saveGoogleTokens` | [L1167](server.js#L1167) | Google-Tokens speichern | `initDb` |
| `deleteGoogleTokens` | [L1181](server.js#L1181) | Google-Tokens löschen | `initDb` |
| `getGoogleCalendarIdForUser` | [L1186](server.js#L1186) | Google-Kalender-ID lesen | `getUserSettings` |
| `refreshGoogleAccessToken` | [L1193](server.js#L1193) | Google-Token auffrischen | `json` |
| `getGoogleAccessToken` | [L1216](server.js#L1216) | Google-Access-Token lesen | `getGoogleTokens`, `refreshGoogleAccessToken`, `saveGoogleTokens` |

#### S7 · WebSocket & Presence `#ws` `#presence`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `clampRoom` | [L1301](server.js#L1301) | Room-Name begrenzen | — |
| `clampKey` | [L1308](server.js#L1308) | Key begrenzen | — |
| `roomKey` | [L1315](server.js#L1315) | Room-Key bauen | — |
| `getRoomSockets` | [L1334](server.js#L1334) | Room-Sockets lesen | — |
| `getRoomPresence` | [L1343](server.js#L1343) | Room-Presence lesen | — |
| `buildPresenceList` | [L1352](server.js#L1352) | Presence-Liste bauen | `getRoomPresence` |
| `sendPresenceState` | [L1356](server.js#L1356) | Presence-State senden | `buildPresenceList` |
| `broadcastPresenceState` | [L1365](server.js#L1365) | Presence broadcasten | `broadcast`, `buildPresenceList` |
| `broadcast` | [L1370](server.js#L1370) | An Room broadcasten | `getRoomSockets` |

#### S8 · AI / Anthropic `#ai`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `formatInputForUserPrompt` | [L2935](server.js#L2935) | Input für User-Prompt formatieren | — |
| `buildUserPrompt` | [L2949](server.js#L2949) | User-Prompt bauen | `formatInputForUserPrompt` |
| `callAnthropic` | [L2971](server.js#L2971) | Anthropic API aufrufen | `safeJsonParse`, `text` |
| `runWithModelFallback` | [L3001](server.js#L3001) | Mit Model-Fallback ausführen | `callAnthropic` |
| `extractText` | [L3030](server.js#L3030) | Text extrahieren | — |
| `shouldRetryRunOutput` | [L3039](server.js#L3039) | Run-Output Retry prüfen | — |
| `extractFencedCodeBlocks` | [L3055](server.js#L3055) | Fenced-Code-Blöcke extrahieren | — |
| `coerceRunModeText` | [L3067](server.js#L3067) | Run-Mode-Text umwandeln | `extractFencedCodeBlocks` |
| `chunkText` | [L3102](server.js#L3102) | Text in Chunks teilen | — |
