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
| `escapeHtml` | [L8765](app.js#L8765) | HTML-Sonderzeichen escapen | — |
| `escapeHtmlAttr` | [L3986](app.js#L3986) | HTML-Attribute escapen | — |
| `escapeAttr` | [L14322](app.js#L14322) | Attribut-Escape (Render-Kontext) | `escapeHtml`, diverse |
| `copyTextToClipboard` | [L8777](app.js#L8777) | Text in Zwischenablage kopieren | `t` |
| `nowIso` | [L16894](app.js#L16894) | ISO-Zeitstempel erzeugen | `getUiLocale` |
| `safeJsonParse` | [L16905](app.js#L16905) | Sicheres JSON-Parsen | — |
| `sanitizeLegacySnapshotText` | [L16913](app.js#L16913) | Legacy-Snapshots bereinigen | `safeJsonParse` |
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
| `buildShareHref` | [L16760](app.js#L16760) | Baut vollständige Share-URL | `buildShareHash` |
| `updateShareLink` | [L16768](app.js#L16768) | Aktualisiert Share-Link global | `buildShareHref`, `updateShareModalLink` |

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
| `sortTagList` | [L10910](app.js#L10910) | Tag-Liste sortieren | `t` |
| `buildTagSections` | [L10914](app.js#L10914) | Tag-Sektionen aufbauen | `isMonthTag`, `isYearTag`, `sortTagList`, `t` |
| `loadPsTagSectionState` | [L10971](app.js#L10971) | Tag-Sektion-Zustand laden | — |
| `savePsTagSectionState` | [L10982](app.js#L10982) | Tag-Sektion-Zustand speichern | — |
| `normalizeSingleTag` | [L10993](app.js#L10993) | Einzelnen Tag normalisieren | `normalizeManualTags` |
| `dedupeRawTags` | [L10998](app.js#L10998) | Raw-Tags entdoppeln | `t` |
| `updateNotesForTagChange` | [L11012](app.js#L11012) | Notizen bei Tag-Änderung aktualisieren | `api`, `applyPersonalSpaceFiltersAndRender`, `dedupeRawTags`, `rebuildPsTagsFromNotes`, `t`, `toast` |
| `resetPsTagContextDelete` | [L11082](app.js#L11082) | Tag-Lösch-Dialog zurücksetzen | `t` |
| `setPsTagContextMenuOpen` | [L11091](app.js#L11091) | Tag-Kontextmenü öffnen/schließen | — |
| `positionPsTagContextMenu` | [L11097](app.js#L11097) | Tag-Kontextmenü positionieren | `t` |
| `closePsTagContextMenu` | [L11109](app.js#L11109) | Tag-Kontextmenü schließen | `resetPsTagContextDelete`, `setPsTagContextMenuOpen` |
| `openPsTagContextMenu` | [L11115](app.js#L11115) | Tag-Kontextmenü öffnen | `closePsContextMenu`, `positionPsTagContextMenu`, `resetPsTagContextDelete`, `setPsTagContextMenuOpen`, `t` |
| `applyPsTagContextValue` | [L11134](app.js#L11134) | Tag-Kontextwert anwenden | `closePsTagContextMenu`, `normalizeSingleTag`, `t`, `toast`, `updateNotesForTagChange` |
| `applyPsTagContextInput` | [L11157](app.js#L11157) | Tag-Kontext-Eingabe anwenden | `applyPsTagContextValue` |
| `confirmPsTagContextDelete` | [L11162](app.js#L11162) | Tag-Löschung bestätigen | `closePsTagContextMenu`, `updateNotesForTagChange` |
| `updatePsTagsActiveInfo` | [L11169](app.js#L11169) | Aktive Tag-Info aktualisieren | — |
| `renderPsTags` | [L11182](app.js#L11182) | Tag-Panel rendern | `buildTagSections`, `loadPsTagSectionState`, `openPsTagContextMenu`, `refreshPersonalSpace`, `savePsTagPrefs`, `savePsTagSectionState`, `t`, `updatePsTagsActiveInfo` |
| `togglePinnedForNote` | [L11295](app.js#L11295) | Pin-Status für Notiz umschalten | `api`, `applyPersonalSpaceFiltersAndRender`, `buildPsTagsPayload`, diverse Tag-Helfer |
| `rebuildPsTagsFromNotes` | [L11405](app.js#L11405) | Tags aus Notizen neu aufbauen | `t`, `updatePsEditorTagsSuggest` |
| `updateEditingNoteTagsLocal` | [L11428](app.js#L11428) | Lokale Tags der aktiven Notiz aktualisieren | `applyPersonalSpaceFiltersAndRender`, `buildEditorSystemTags`, `buildPsTagsPayload`, `rebuildPsTagsFromNotes`, `uniqTags` |
| `schedulePsTagsAutoSave` | [L11450](app.js#L11450) | Tags-Auto-Save planen | `savePersonalSpaceNote`, `t` |

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
| `saveAiPrompt` | [L6457](app.js#L6457) | AI-Prompt speichern | — |
| `saveAiUseAnswer` | [L6466](app.js#L6466) | AI-Use-Answer speichern | — |
| `saveAiUsePreview` | [L6475](app.js#L6475) | AI-Use-Preview speichern | — |
| `loadAiApiConfig` | [L6485](app.js#L6485) | AI-API-Config laden | — |
| `saveAiApiConfig` | [L6497](app.js#L6497) | AI-API-Config speichern | — |
| `getAiApiConfig` | [L6510](app.js#L6510) | AI-API-Config lesen | — |
| `getAiPrompt` | [L7687](app.js#L7687) | AI-Prompt lesen | — |
| `getAiUsePreview` | [L7704](app.js#L7704) | AI-Use-Preview lesen | — |
| `getAiUseAnswer` | [L7708](app.js#L7708) | AI-Use-Answer lesen | — |
| `setAiUsePreviewUi` | [L7712](app.js#L7712) | AI-Use-Preview UI | — |
| `setAiUseAnswerUi` | [L7728](app.js#L7728) | AI-Use-Answer UI | — |
| `readAiApiKeyInput` | [L7284](app.js#L7284) | AI-API-Key Input lesen | — |
| `normalizeAiModelInput` | [L7291](app.js#L7291) | AI-Modell Input normalisieren | — |
| `applyAiContextMode` | [L7300](app.js#L7300) | AI-Kontextmodus anwenden | `getAiUsePreview` |
| `loadAiStatus` | [L7040](app.js#L7040) | AI-Status laden | `api` |
| `getAiMode` | [L12552](app.js#L12552) | AI-Modus ermitteln | — |
| `aiAssistFromPreview` | [L12563](app.js#L12563) | AI-Assist aus Preview | `api`, `getAiApiConfig`, `getAiMode`, `getAiPrompt`, `getAiUseAnswer`, `getAiUsePreview`, `parseRunnableFromEditor`, `saveAiPrompt`, `setPreviewRunOutput`, `t`, `toast` |

##### 15.2 AI-Diktat

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getSpeechRecognitionConstructor` | [L7311](app.js#L7311) | Speech-Recognition Konstruktor | — |
| `setAiDictationUi` | [L7319](app.js#L7319) | Diktat-UI setzen | — |
| `updateAiDictationValue` | [L7348](app.js#L7348) | Diktat-Wert aktualisieren | — |
| `onAiDictationResult` | [L7569](app.js#L7569) | Diktat-Ergebnis verarbeiten | `updateAiDictationValue` |
| `stopAiDictation` | [L7589](app.js#L7589) | Diktat stoppen | `setAiDictationUi` |
| `startAiDictation` | [L7601](app.js#L7601) | Diktat starten | `setAiDictationUi`, `t` |
| `initAiDictation` | [L7648](app.js#L7648) | Diktat initialisieren | `getSpeechRecognitionConstructor`, `getUiSpeechLocale`, `setAiDictationUi`, `t`, `toast` |

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
| `updateAutoBackupFolderLabel` | [L6159](app.js#L6159) | Backup-Ordner-Label aktualisieren | — |
| `updateAutoImportFolderLabel` | [L6166](app.js#L6166) | Import-Ordner-Label aktualisieren | — |
| `applyAutoAccessSupportUi` | [L6173](app.js#L6173) | Auto-Access-UI anwenden | `supportsDirectoryAccess` |
| `loadAutoBackupSettings` | [L6187](app.js#L6187) | Backup-Einstellungen laden | `normalizeAutoInterval` |
| `saveAutoBackupSettings` | [L6206](app.js#L6206) | Backup-Einstellungen speichern | — |
| `loadAutoImportSettings` | [L6221](app.js#L6221) | Import-Einstellungen laden | `normalizeAutoInterval` |
| `saveAutoImportSettings` | [L6240](app.js#L6240) | Import-Einstellungen speichern | — |
| `loadAutoImportSeen` | [L6255](app.js#L6255) | Gesehene Imports laden | — |
| `saveAutoImportSeen` | [L6269](app.js#L6269) | Gesehene Imports speichern | — |
| `buildAutoImportKey` | [L6279](app.js#L6279) | Import-Key erzeugen | — |
| `scheduleAutoBackup` | [L6287](app.js#L6287) | Auto-Backup planen | `autoIntervalToMs`, `runAutoBackup`, `supportsDirectoryAccess`, `t` |
| `scheduleAutoImport` | [L6298](app.js#L6298) | Auto-Import planen | `autoIntervalToMs`, `runAutoImport`, `supportsDirectoryAccess`, `t` |
| `runAutoBackup` | [L6309](app.js#L6309) | Auto-Backup ausführen | `ensureDirPermission`, `fetchPersonalSpaceExport`, `setAutoBackupStatus`, `t` |
| `runAutoImport` | [L6355](app.js#L6355) | Auto-Import ausführen | `buildAutoImportKey`, `ensureDirPermission`, `importPersonalSpaceNotesFromText`, `saveAutoImportSeen`, `setAutoImportStatus`, `t` |
| `pickAutoBackupFolder` | [L6412](app.js#L6412) | Backup-Ordner wählen | `runAutoBackup`, `setAutoBackupStatus`, `supportsDirectoryAccess`, `updateAutoBackupFolderLabel`, `writeFsHandle` |
| `pickAutoImportFolder` | [L6426](app.js#L6426) | Import-Ordner wählen | `runAutoImport`, `setAutoImportStatus`, `supportsDirectoryAccess`, `t`, `updateAutoImportFolderLabel`, `writeFsHandle` |
| `initAutoBackup` | [L6440](app.js#L6440) | Auto-Backup initialisieren | `applyAutoAccessSupportUi`, `loadAutoBackupSettings`, `readFsHandle`, `scheduleAutoBackup`, `updateAutoBackupFolderLabel` |
| `initAutoImport` | [L6448](app.js#L6448) | Auto-Import initialisieren | `applyAutoAccessSupportUi`, `loadAutoImportSeen`, `loadAutoImportSettings`, `readFsHandle`, `scheduleAutoImport`, `t`, `updateAutoImportFolderLabel` |

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
| `getNoteTitle` | [L8202](app.js#L8202) | Notiz-Titel lesen | `getNoteTitleAndExcerpt`, `t` |
| `loadPsVisible` | [L8210](app.js#L8210) | PS-Sichtbarkeit laden | — |
| `savePsVisible` | [L8219](app.js#L8219) | PS-Sichtbarkeit speichern | — |
| `applyPsVisible` | [L8227](app.js#L8227) | PS-Sichtbarkeit anwenden | — |
| `normalizeSearchQuery` | [L8257](app.js#L8257) | Suchbegriff normalisieren | — |
| `loadPsSearchQuery` | [L8351](app.js#L8351) | Suchabfrage laden | — |
| `normalizePsSortMode` | [L8360](app.js#L8360) | Sort-Modus normalisieren | — |
| `setPsSortMenuOpen` | [L8375](app.js#L8375) | Sort-Menü öffnen/schließen | — |
| `syncPsSortMenu` | [L8387](app.js#L8387) | Sort-Menü synchronisieren | — |
| `loadPsNoteAccessed` | [L8408](app.js#L8408) | Notiz-Zugriffe laden | `t` |
| `savePsNoteAccessed` | [L8431](app.js#L8431) | Notiz-Zugriffe speichern | `t` |
| `markPsNoteAccessed` | [L8444](app.js#L8444) | Notiz-Zugriff markieren | `savePsNoteAccessed`, `t` |
| `loadPsSortMode` | [L8451](app.js#L8451) | Sort-Modus laden | `normalizePsSortMode`, `syncPsSortMenu` |
| `savePsSortMode` | [L8463](app.js#L8463) | Sort-Modus speichern | `normalizePsSortMode` |
| `savePsSearchQuery` | [L8472](app.js#L8472) | Suchabfrage speichern | — |
| `loadPsPinnedOnly` | [L8480](app.js#L8480) | Nur-Pinned laden | `updatePsPinnedToggle` |
| `savePsPinnedOnly` | [L8498](app.js#L8498) | Nur-Pinned speichern | — |
| `updatePsPinnedToggle` | [L8514](app.js#L8514) | Pinned-Toggle aktualisieren | — |
| `noteMatchesSearch` | [L8566](app.js#L8566) | Notiz-Suchfilter prüfen | — |
| `applyPersonalSpaceFiltersAndRender` | [L8601](app.js#L8601) | Filter anwenden & rendern | `ensureNoteUpdatedAt`, `getNoteTitle`, `normalizeSearchQuery`, `noteIsPinned`, `noteMatchesSearch`, `renderPsList`, `renderPsTags`, `t`, `updateEditorMetaYaml` |

##### 18.3 PS Tags-Prefs

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `loadPsTagsCollapsed` | [L8678](app.js#L8678) | Tags-Collapsed laden | — |
| `savePsTagsCollapsed` | [L8686](app.js#L8686) | Tags-Collapsed speichern | — |
| `applyPsTagsCollapsed` | [L8694](app.js#L8694) | Tags-Collapsed anwenden | — |
| `loadPsTagPrefs` | [L8719](app.js#L8719) | Tag-Prefs laden | `t` |
| `savePsTagPrefs` | [L8749](app.js#L8749) | Tag-Prefs speichern | — |

##### 18.4 Passwort-Maskierung `#password`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `escapeHtml` | [L8765](app.js#L8765) | HTML escapen | — |
| `renderPasswordToken` | [L8772](app.js#L8772) | Passwort-Token rendern | `escapeHtml` |
| `copyTextToClipboard` | [L8777](app.js#L8777) | Text in Zwischenablage | `t` |
| `togglePasswordField` | [L8802](app.js#L8802) | Passwort-Feld umschalten | — |
| `loadEditorMaskDisabled` | [L8823](app.js#L8823) | Mask-Disabled laden | — |
| `saveEditorMaskDisabled` | [L8832](app.js#L8832) | Mask-Disabled speichern | — |
| `toggleEditorMaskView` | [L8843](app.js#L8843) | Mask-View umschalten | `saveEditorMaskDisabled`, `setEditorMaskToggleUi`, `updatePasswordMaskOverlay` |
| `setEditorMaskToggleUi` | [L8850](app.js#L8850) | Mask-Toggle-UI setzen | — |
| `loadCrdtMarksPreference` | [L8868](app.js#L8868) | CRDT-Marks-Pref laden | — |
| `saveCrdtMarksPreference` | [L8890](app.js#L8890) | CRDT-Marks-Pref speichern | — |
| `setCrdtMarksToggleUi` | [L8901](app.js#L8901) | CRDT-Marks-Toggle-UI | — |
| `toggleCrdtMarks` | [L8920](app.js#L8920) | CRDT-Marks umschalten | `saveCrdtMarksPreference`, `setCrdtMarksToggleUi`, `updateAttributionOverlay` |
| `hasPasswordTokens` | [L8927](app.js#L8927) | Passwort-Tokens prüfen | `t` |
| `maskPasswordTokens` | [L8931](app.js#L8931) | Passwort-Tokens maskieren | `t` |
| `buildEditorMaskHtml` | [L8938](app.js#L8938) | Editor-Mask-HTML bauen | `escapeHtml` |
| `syncPasswordMaskScroll` | [L8962](app.js#L8962) | Mask-Scroll synchronisieren | — |
| `updatePasswordMaskOverlay` | [L8969](app.js#L8969) | Mask-Overlay aktualisieren | `buildEditorMaskHtml`, `hasPasswordTokens`, `syncPasswordMaskScroll`, `updateAttributionOverlay` |

#### 19 · Preview & Rendering `#preview`

##### 19.1 Run-Output

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getPreviewRunCombinedText` | [L8987](app.js#L8987) | Run-Combined-Text lesen | — |
| `updateRunOutputUi` | [L8995](app.js#L8995) | Run-Output-UI aktualisieren | — |
| `updateRunOutputSizing` | [L9045](app.js#L9045) | Run-Output-Sizing | `t` |
| `setPreviewRunOutput` | [L9096](app.js#L9096) | Run-Output setzen | `escapeHtml`, `getPreviewRunCombinedText`, `t`, `updateRunOutputSizing`, `updateRunOutputUi` |
| `parseRunnableFromEditor` | [L9123](app.js#L9123) | Runnable-Block parsen | `t` |

##### 19.2 Code-Language & Fenced-Blocks

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `getSelectedCodeLang` | [L9154](app.js#L9154) | Code-Sprache lesen | — |
| `getFencedCodeOpenAtPos` | [L9163](app.js#L9163) | Fenced-Code an Position prüfen | *(umfangreiche Abhängigkeiten)* |
| `setFencedCodeLanguage` | [L9196](app.js#L9196) | Fenced-Code-Sprache setzen | *(umfangreiche Abhängigkeiten)* |
| `updateCodeLangOverlay` | [L9229](app.js#L9229) | Code-Lang-Overlay aktualisieren | `getFencedCodeOpenAtPos`, `resetEditorMetaPadding`, `updateEditorMetaPadding`, `updateEditorMetaScroll` |
| `insertCodeBlock` | [L9261](app.js#L9261) | Code-Block einfügen | `getSelectedCodeLang`, `nowIso`, `scheduleSend`, `updateCodeLangOverlay`, `updatePasswordMaskOverlay`, `updatePreview` |

##### 19.3 Markdown & Rendering

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `ensureMarkdown` | [L9288](app.js#L9288) | Markdown-Lib laden | `escapeHtml`, `renderPasswordToken`, `t` |
| `applyHljsToHtml` | [L9415](app.js#L9415) | Syntax-Highlighting anwenden | `t` |
| `embedPdfLinks` | [L9435](app.js#L9435) | PDF-Links einbetten | `t` |
| `buildNoteTitleIndex` | [L9501](app.js#L9501) | Notiz-Titel-Index bauen | `getNoteTitle`, `t` |
| `applyWikiLinksToMarkdown` | [L9519](app.js#L9519) | Wiki-Links in Markdown | `buildNoteTitleIndex`, `t` |
| `renderNoteHtml` | [L9533](app.js#L9533) | Notiz → HTML rendern | `ensureMarkdown`, `t`, `toast` |
| `setFullPreview` | [L9571](app.js#L9571) | Full-Preview setzen | `t`, `updateRunOutputSizing` |
| `setPreviewVisible` | [L9589](app.js#L9589) | Preview-Sichtbarkeit setzen | `ensureMarkdown`, `setFullPreview`, `syncMobileFocusState`, `t`, `toast`, `updatePreview`, `updateRunOutputSizing`, `updateRunOutputUi` |
| `updatePreview` | [L9667](app.js#L9667) | Preview aktualisieren | `allTaskCheckboxes`, `applyHljsToHtml`, `applyWikiLinksToMarkdown`, `buildNoteMetaYaml`, `buildToc`, `embedPdfLinks`, `ensureMarkdown`, `ensurePdfJsLoaded`, `escapeHtml`, `findCheckbox`, `findNoteById`, `getNoteHrefTarget`, `getPdfRenderId`, `indexOfCheckbox`, `initImageTools`, `initPdfEmbeds`, `renderPdfPage`, `send`, `setExpanded`, `setPasswordRevealed`, `setPreviewDocument`, `slugify`, `t`, `toElement`, `updatePdfNav`, `wrapImage` |

##### 19.4 Helfer & PDF

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `send` | [L10044](app.js#L10044) | WS-Nachricht senden (low-level) | — |
| `slugify` | [L10051](app.js#L10051) | Slug erzeugen | — |
| `buildToc` | [L10059](app.js#L10059) | Inhaltsverzeichnis bauen | `setExpanded`, `slugify`, `t` |
| `setExpanded` | [L10105](app.js#L10105) | Expandiert setzen | — |
| `getNoteHrefTarget` | [L10141](app.js#L10141) | Notiz-Link-Target lesen | — |
| `toElement` | [L10147](app.js#L10147) | String → DOM-Element | — |
| `findCheckbox` | [L10153](app.js#L10153) | Checkbox finden | `t`, `toElement` |
| `allTaskCheckboxes` | [L10170](app.js#L10170) | Alle Task-Checkboxen | — |
| `indexOfCheckbox` | [L10259](app.js#L10259) | Checkbox-Index | `allTaskCheckboxes` |
| `setPasswordRevealed` | [L10291](app.js#L10291) | Passwort aufdecken | — |
| `wrapImage` | [L10323](app.js#L10323) | Bild wrappen | `t` |
| `initImageTools` | [L10350](app.js#L10350) | Image-Tools initialisieren | `wrapImage` |
| `getPdfRenderId` | [L10358](app.js#L10358) | PDF-Render-ID lesen | — |
| `updatePdfNav` | [L10367](app.js#L10367) | PDF-Nav aktualisieren | — |
| `renderPdfPage` | [L10377](app.js#L10377) | PDF-Seite rendern | `getPdfRenderId`, `send` |
| `initPdfEmbeds` | [L10387](app.js#L10387) | PDF-Embeds initialisieren | `renderPdfPage`, `t` |
| `toggleMarkdownTaskAtIndex` | [L10465](app.js#L10465) | Markdown-Task umschalten | `getActiveRoomTabNoteId`, `schedulePsAutoSave`, `scheduleSend`, `t`, `updateLocalNoteText`, `updatePreview` |
| `attachPreviewCheckboxWriteback` | [L10664](app.js#L10664) | Checkbox-Writeback anbinden | `findCheckbox`, `indexOfCheckbox`, `nowIso`, `t`, `toElement`, `toggleMarkdownTaskAtIndex` |
| `setPreviewDocument` | [L10755](app.js#L10755) | Preview-Document setzen | `attachPreviewCheckboxWriteback`, `t` |

##### 18.4b PS Tags-Verwaltung `#tags`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `sortTagList` | [L10910](app.js#L10910) | Tag-Liste sortieren | `t` |
| `buildTagSections` | [L10914](app.js#L10914) | Tag-Sections bauen | `isMonthTag`, `isYearTag`, `sortTagList`, `t` |
| `loadPsTagSectionState` | [L10971](app.js#L10971) | Tag-Section-State laden | — |
| `savePsTagSectionState` | [L10982](app.js#L10982) | Tag-Section-State speichern | — |
| `normalizeSingleTag` | [L10993](app.js#L10993) | Einzelnen Tag normalisieren | `normalizeManualTags` |
| `dedupeRawTags` | [L10998](app.js#L10998) | Rohe Tags deduplizieren | `t` |
| `updateNotesForTagChange` | [L11012](app.js#L11012) | Notizen für Tag-Änderung aktualisieren | `api`, `applyPersonalSpaceFiltersAndRender`, `dedupeRawTags`, `rebuildPsTagsFromNotes`, `t`, `toast` |
| `resetPsTagContextDelete` | [L11082](app.js#L11082) | Tag-Kontext-Löschen zurücksetzen | `t` |
| `setPsTagContextMenuOpen` | [L11091](app.js#L11091) | Tag-Kontext-Menü öffnen/schließen | — |
| `positionPsTagContextMenu` | [L11097](app.js#L11097) | Tag-Kontext-Menü positionieren | `t` |
| `closePsTagContextMenu` | [L11109](app.js#L11109) | Tag-Kontext-Menü schließen | `resetPsTagContextDelete`, `setPsTagContextMenuOpen` |
| `openPsTagContextMenu` | [L11115](app.js#L11115) | Tag-Kontext-Menü öffnen | `closePsContextMenu`, `positionPsTagContextMenu`, `resetPsTagContextDelete`, `setPsTagContextMenuOpen`, `t` |
| `applyPsTagContextValue` | [L11134](app.js#L11134) | Tag-Kontext-Wert anwenden | `closePsTagContextMenu`, `normalizeSingleTag`, `t`, `toast`, `updateNotesForTagChange` |
| `applyPsTagContextInput` | [L11157](app.js#L11157) | Tag-Kontext-Input anwenden | `applyPsTagContextValue` |
| `confirmPsTagContextDelete` | [L11162](app.js#L11162) | Tag-Löschen bestätigen | `closePsTagContextMenu`, `updateNotesForTagChange` |
| `updatePsTagsActiveInfo` | [L11169](app.js#L11169) | Tags-Active-Info aktualisieren | — |
| `renderPsTags` | [L11182](app.js#L11182) | PS-Tags rendern | `buildTagSections`, `loadPsTagSectionState`, `openPsTagContextMenu`, `refreshPersonalSpace`, `savePsTagPrefs`, `savePsTagSectionState`, `t`, `updatePsTagsActiveInfo` |
| `togglePinnedForNote` | [L11295](app.js#L11295) | Notiz-Pinned umschalten | `api`, `applyPersonalSpaceFiltersAndRender`, `buildPsTagsPayload`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `refreshPersonalSpace`, `splitTagsForEditor`, `stripManualTagsMarker`, `stripPinnedTag`, `syncPsEditorTagsInput`, `t`, `toast`, `updatePsEditingTagsHint` |

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
| `syncPsListHeight` | [L11687](app.js#L11687) | Listen-Höhe synchronisieren | `t` |
| `setPsContextMenuOpen` | [L11714](app.js#L11714) | Kontext-Menü öffnen/schließen | — |
| `positionPsContextMenu` | [L11720](app.js#L11720) | Kontext-Menü positionieren | `t` |
| `openPsContextMenu` | [L11731](app.js#L11731) | Kontext-Menü öffnen | `closePsTagContextMenu`, `positionPsContextMenu`, `setPsContextMenuOpen` |
| `closePsContextMenu` | [L11746](app.js#L11746) | Kontext-Menü schließen | `setPsContextMenuOpen` |
| `updatePsBulkBar` | [L11751](app.js#L11751) | Bulk-Bar aktualisieren | `syncPsBulkSelectionToDom` |
| `syncPsBulkSelectionToDom` | [L11755](app.js#L11755) | Bulk-Selection → DOM | — |
| `prunePsSelectedNotes` | [L11765](app.js#L11765) | Auswahl bereinigen | `t`, `updatePsBulkBar` |
| `setPsNoteSelected` | [L11777](app.js#L11777) | Notiz selektieren | `updatePsBulkBar` |
| `togglePsSelectAll` | [L11785](app.js#L11785) | Alle selektieren/deselektieren | `updatePsBulkBar` |
| `clearPsSelection` | [L11796](app.js#L11796) | Auswahl löschen | `t`, `updatePsBulkBar` |
| `getSelectedNoteIds` | [L11801](app.js#L11801) | Selektierte IDs lesen | — |
| `applyBulkTagsToNotes` | [L11805](app.js#L11805) | Bulk-Tags anwenden | `api`, `buildPsTagsPayload`, `findNoteById`, `t`, `toast` |
| `deleteBulkNotes` | [L11835](app.js#L11835) | Bulk-Notizen löschen | `api`, `syncMobileFocusState`, `t`, `toast` |

##### 18.7 PS Tags-Verwaltung (erweitert)

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `sortTagList` | [L10910](app.js#L10910) | Tag-Liste sortieren | `t` |
| `buildTagSections` | [L10914](app.js#L10914) | Tag-Sektionen bauen | `isMonthTag`, `isYearTag`, `sortTagList`, `t` |
| `loadPsTagSectionState` | [L10971](app.js#L10971) | Tag-Section-State laden | — |
| `savePsTagSectionState` | [L10982](app.js#L10982) | Tag-Section-State speichern | — |
| `normalizeSingleTag` | [L10993](app.js#L10993) | Einzelnen Tag normalisieren | `normalizeManualTags` |
| `dedupeRawTags` | [L10998](app.js#L10998) | Roh-Tags entdoppeln | `t` |
| `updateNotesForTagChange` | [L11012](app.js#L11012) | Notizen für Tag-Änderung updaten | `api`, `applyPersonalSpaceFiltersAndRender`, `dedupeRawTags`, `rebuildPsTagsFromNotes`, `t`, `toast` |
| `resetPsTagContextDelete` | [L11082](app.js#L11082) | Tag-Kontext-Löschen zurücksetzen | `t` |
| `setPsTagContextMenuOpen` | [L11091](app.js#L11091) | Tag-Kontext-Menü öffnen/schließen | — |
| `positionPsTagContextMenu` | [L11097](app.js#L11097) | Tag-Kontext-Menü positionieren | `t` |
| `closePsTagContextMenu` | [L11109](app.js#L11109) | Tag-Kontext-Menü schließen | `resetPsTagContextDelete`, `setPsTagContextMenuOpen` |
| `openPsTagContextMenu` | [L11115](app.js#L11115) | Tag-Kontext-Menü öffnen | `closePsContextMenu`, `positionPsTagContextMenu`, `resetPsTagContextDelete`, `setPsTagContextMenuOpen`, `t` |
| `applyPsTagContextValue` | [L11134](app.js#L11134) | Tag-Kontext-Wert anwenden | `closePsTagContextMenu`, `normalizeSingleTag`, `t`, `toast`, `updateNotesForTagChange` |
| `applyPsTagContextInput` | [L11157](app.js#L11157) | Tag-Kontext-Input anwenden | `applyPsTagContextValue` |
| `confirmPsTagContextDelete` | [L11162](app.js#L11162) | Tag-Kontext-Löschen bestätigen | `closePsTagContextMenu`, `updateNotesForTagChange` |
| `updatePsTagsActiveInfo` | [L11169](app.js#L11169) | Tags-Active-Info aktualisieren | — |
| `renderPsTags` | [L11182](app.js#L11182) | PS-Tags rendern | `buildTagSections`, `loadPsTagSectionState`, `openPsTagContextMenu`, `refreshPersonalSpace`, `savePsTagPrefs`, `savePsTagSectionState`, `t`, `updatePsTagsActiveInfo` |
| `togglePinnedForNote` | [L11295](app.js#L11295) | Pinned für Notiz umschalten | `api`, `applyPersonalSpaceFiltersAndRender`, `buildPsTagsPayload`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `refreshPersonalSpace`, `splitTagsForEditor`, `stripManualTagsMarker`, `stripPinnedTag`, `syncPsEditorTagsInput`, `t`, `toast`, `updatePsEditingTagsHint` |

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
| `getPreviewRunCombinedText` | [L8987](app.js#L8987) | Run-Ausgabetext lesen | — |
| `updateRunOutputUi` | [L8995](app.js#L8995) | Run-Output-UI aktualisieren | — |
| `updateRunOutputSizing` | [L9045](app.js#L9045) | Run-Output-Größe anpassen | `t` |
| `setPreviewRunOutput` | [L9096](app.js#L9096) | Run-Output setzen | `escapeHtml`, `getPreviewRunCombinedText`, `t`, `updateRunOutputSizing`, `updateRunOutputUi` |

##### 19.2 Code-Blöcke & Sprache

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `parseRunnableFromEditor` | [L9123](app.js#L9123) | Runnable aus Editor parsen | `t` |
| `getSelectedCodeLang` | [L9154](app.js#L9154) | Selektierte Code-Sprache lesen | — |
| `getFencedCodeOpenAtPos` | [L9163](app.js#L9163) | Fenced-Code-Block an Position | _viele interne Deps_ |
| `setFencedCodeLanguage` | [L9196](app.js#L9196) | Fenced-Code-Sprache setzen | _viele interne Deps_ |
| `updateCodeLangOverlay` | [L9229](app.js#L9229) | Code-Lang-Overlay aktualisieren | `getFencedCodeOpenAtPos`, `resetEditorMetaPadding`, `updateEditorMetaPadding`, `updateEditorMetaScroll` |
| `insertCodeBlock` | [L9261](app.js#L9261) | Code-Block einfügen | `getSelectedCodeLang`, `nowIso`, `scheduleSend`, `updateCodeLangOverlay`, `updatePasswordMaskOverlay`, `updatePreview` |

##### 19.3 Markdown & HTML

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `ensureMarkdown` | [L9288](app.js#L9288) | Markdown-Lib laden | `escapeHtml`, `renderPasswordToken`, `t` |
| `applyHljsToHtml` | [L9415](app.js#L9415) | Syntax-Highlighting anwenden | `t` |
| `embedPdfLinks` | [L9435](app.js#L9435) | PDF-Links einbetten | `t` |
| `buildNoteTitleIndex` | [L9501](app.js#L9501) | Notiz-Titel-Index bauen | `getNoteTitle`, `t` |
| `applyWikiLinksToMarkdown` | [L9519](app.js#L9519) | Wiki-Links in Markdown | `buildNoteTitleIndex`, `t` |
| `renderNoteHtml` | [L9533](app.js#L9533) | Notiz-HTML rendern | `ensureMarkdown`, `t`, `toast` |
| `setFullPreview` | [L9571](app.js#L9571) | Vollbild-Preview setzen | `t`, `updateRunOutputSizing` |
| `setPreviewVisible` | [L9589](app.js#L9589) | Preview sichtbar setzen | `ensureMarkdown`, `setFullPreview`, `syncMobileFocusState`, `t`, `toast`, `updatePreview`, `updateRunOutputSizing`, `updateRunOutputUi` |
| `updatePreview` | [L9667](app.js#L9667) | Preview aktualisieren (Haupt) | `allTaskCheckboxes`, `applyHljsToHtml`, `applyWikiLinksToMarkdown`, `buildNoteMetaYaml`, `buildToc`, `embedPdfLinks`, `ensureMarkdown`, `ensurePdfJsLoaded`, `escapeHtml`, `findCheckbox`, `findNoteById`, `getNoteHrefTarget`, `getPdfRenderId`, `indexOfCheckbox`, `initImageTools`, `initPdfEmbeds`, `renderPdfPage`, `send`, `setExpanded`, `setPasswordRevealed`, `setPreviewDocument`, `slugify`, `t`, `toElement`, `updatePdfNav`, `wrapImage` |

##### 19.4 Preview-Helfer

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `send` | [L10044](app.js#L10044) | Send-Helper | — |
| `slugify` | [L10051](app.js#L10051) | Text → Slug | — |
| `buildToc` | [L10059](app.js#L10059) | Inhaltsverzeichnis bauen | `setExpanded`, `slugify`, `t` |
| `setExpanded` | [L10105](app.js#L10105) | Expanded-State setzen | — |
| `getNoteHrefTarget` | [L10141](app.js#L10141) | Note-Href-Target lesen | — |
| `toElement` | [L10147](app.js#L10147) | String → DOM-Element | — |
| `findCheckbox` | [L10153](app.js#L10153) | Checkbox finden | `t`, `toElement` |
| `allTaskCheckboxes` | [L10170](app.js#L10170) | Alle Task-Checkboxen | — |
| `indexOfCheckbox` | [L10259](app.js#L10259) | Checkbox-Index | `allTaskCheckboxes` |
| `setPasswordRevealed` | [L10291](app.js#L10291) | Passwort-Reveal setzen | — |
| `wrapImage` | [L10323](app.js#L10323) | Bild wrappen | `t` |
| `initImageTools` | [L10350](app.js#L10350) | Image-Tools initialisieren | `wrapImage` |
| `getPdfRenderId` | [L10358](app.js#L10358) | PDF-Render-ID lesen | — |
| `updatePdfNav` | [L10367](app.js#L10367) | PDF-Navigation aktualisieren | — |
| `renderPdfPage` | [L10377](app.js#L10377) | PDF-Seite rendern | `getPdfRenderId`, `send` |
| `initPdfEmbeds` | [L10387](app.js#L10387) | PDF-Embeds initialisieren | `renderPdfPage`, `t` |
| `toggleMarkdownTaskAtIndex` | [L10465](app.js#L10465) | Markdown-Task umschalten | `getActiveRoomTabNoteId`, `schedulePsAutoSave`, `scheduleSend`, `t`, `updateLocalNoteText`, `updatePreview` |
| `attachPreviewCheckboxWriteback` | [L10664](app.js#L10664) | Checkbox-Writeback anhängen | `findCheckbox`, `indexOfCheckbox`, `nowIso`, `t`, `toElement`, `toggleMarkdownTaskAtIndex` |
| `setPreviewDocument` | [L10755](app.js#L10755) | Preview-Dokument setzen | `attachPreviewCheckboxWriteback`, `t` |
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
| `refreshPersonalSpace` | [L12671](app.js#L12671) | Personal Space neu laden | `api`, `applyPersonalSpaceFiltersAndRender`, `clearPsSelection`, `dedupeFavorites`, `ensureNoteUpdatedAt`, `maybeStartMobileAutoNoteSession`, `renderRoomTabs`, `setPsAutoSaveStatus`, `setPsEditorTagsVisible`, `syncCalendarSettingsFromServer`, `syncLocalRoomTabsToServer`, `syncPsEditingNoteTagsFromState`, `syncPsEditorTagsInput`, `t`, `updateEditorMetaYaml`, `updateFavoritesUI`, `updatePsNoteNavButtons`, `updatePsPinnedToggle` |
| `downloadJson` | [L12766](app.js#L12766) | JSON herunterladen | `t`, `toast` |
| `ymd` | [L12783](app.js#L12783) | Datum → YYYY-MM-DD | `t` |
| `fetchPersonalSpaceExport` | [L12795](app.js#L12795) | PS-Export abrufen | `api` |
| `exportPersonalSpaceNotes` | [L12803](app.js#L12803) | PS-Notizen exportieren | `downloadJson`, `fetchPersonalSpaceExport`, `t`, `toast`, `ymd` |
| `importPersonalSpaceNotes` | [L12822](app.js#L12822) | PS-Notizen importieren | `api`, `refreshPersonalSpace`, `t`, `toast` |
| `chunkTextIntoNotes` | [L12849](app.js#L12849) | Text in Notizen aufteilen | — |
| `importPersonalSpaceNotesFromText` | [L12862](app.js#L12862) | PS-Notizen aus Text importieren | `importPersonalSpaceNotes`, `t`, `toast` |
| `importPersonalSpaceFile` | [L12884](app.js#L12884) | PS-Datei importieren | `chunkTextIntoNotes`, `importPersonalSpaceNotes`, `importPersonalSpaceNotesFromText`, `t`, `toast` |
| `startNotesImport` | [L12911](app.js#L12911) | Notiz-Import starten | `t`, `toast` |
| `requestPersonalSpaceLink` | [L12928](app.js#L12928) | PS-Link anfordern | `api`, `modalPrompt`, `t`, `toast` |
| `randomRoom` | [L12974](app.js#L12974) | Zufälligen Raum erzeugen | `normalizeRoom`, `t` |

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
| `normalizeCalendarSource` | [L14814](app.js#L14814) | Kalender-Quelle normalisieren | `createClientId` |
| `loadCalendarSources` | [L14824](app.js#L14824) | Quellen laden | — |
| `saveCalendarSources` | [L14835](app.js#L14835) | Quellen speichern | `scheduleCalendarSettingsSync` |
| `loadCalendarDefaultView` | [L14849](app.js#L14849) | Standard-Ansicht laden | — |
| `saveCalendarDefaultView` | [L14858](app.js#L14858) | Standard-Ansicht speichern | `renderCalendarPanel`, `scheduleCalendarSettingsSync`, `updateCalendarViewButtons` |
| `getLocalCalendarSettings` | [L14875](app.js#L14875) | Lokale Kalender-Einstellungen lesen | `loadCalendarDefaultView`, `loadCalendarGoogleId`, `loadCalendarSources`, `loadLocalCalendarEventsRaw` |
| `applyCalendarSettings` | [L14885](app.js#L14885) | Kalender-Einstellungen anwenden | `renderCalendarPanel`, `renderCalendarSettings`, `saveCalendarDefaultView`, `saveCalendarGoogleId`, `saveCalendarSources`, `saveLocalCalendarEvents`, `scheduleCalendarRefresh` |
| `syncCalendarSettingsToServer` | [L14937](app.js#L14937) | Settings → Server synchen | `api` |
| `scheduleCalendarSettingsSync` | [L14952](app.js#L14952) | Settings-Sync debounce | `getLocalCalendarSettings`, `syncCalendarSettingsToServer`, `t` |
| `syncCalendarSettingsFromServer` | [L14980](app.js#L14980) | Settings ← Server synchen | `applyCalendarSettings`, `getLocalCalendarSettings`, `scheduleCalendarSettingsSync` |
| `renderCalendarSettings` | [L15004](app.js#L15004) | Settings-UI rendern | `escapeAttr`, `loadCalendarDefaultView`, `loadCalendarSources`, `renderCalendarGoogleSelect`, `renderCalendarLocalEvents`, `t` |

##### 26.2 Google Calendar

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `renderCalendarGoogleSelect` | [L15067](app.js#L15067) | Google-Kalender-Auswahl rendern | `escapeAttr`, `escapeHtml`, `loadCalendarGoogleId` |
| `setGoogleCalendarUi` | [L15190](app.js#L15190) | Google-UI setzen | `renderCalendarGoogleSelect`, `t` |
| `fetchGoogleCalendarList` | [L15238](app.js#L15238) | Google-Kalender-Liste abrufen | `api`, `renderCalendarGoogleSelect`, `t` |
| `fetchGoogleCalendarStatus` | [L15266](app.js#L15266) | Google-Status prüfen | `api`, `fetchGoogleCalendarList`, `saveCalendarGoogleId`, `setGoogleCalendarUi`, `t` |
| `createGoogleCalendarEvent` | [L15338](app.js#L15338) | Google-Event erstellen | `api`, `formatDateInputValue`, `t` |
| `deleteGoogleCalendarEvent` | [L15378](app.js#L15378) | Google-Event löschen | `api`, `t` |
| `loadCalendarGoogleId` | [L15642](app.js#L15642) | Google-ID laden | — |
| `saveCalendarGoogleId` | [L15653](app.js#L15653) | Google-ID speichern | `renderCalendarSettings`, `scheduleCalendarSettingsSync` |
| `fetchGoogleCalendarEvents` | [L15882](app.js#L15882) | Google-Events abrufen | `api`, `parseGoogleDate`, `t` |

##### 26.3 Panel & Darstellung

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `setCalendarPanelActive` | [L15400](app.js#L15400) | Panel aktivieren | `applyCalendarFreeSlotsVisibility`, `fetchGoogleCalendarStatus`, `loadCalendarDefaultView`, `refreshCalendarEvents`, `renderCalendarPanel`, `renderRoomTabs`, `updateCalendarViewButtons` |
| `setCalendarSidebarCollapsed` | [L15420](app.js#L15420) | Sidebar ein-/ausklappen | — |
| `startOfDay` | [L15447](app.js#L15447) | Tagesanfang berechnen | — |
| `addDays` | [L15451](app.js#L15451) | Tage addieren | — |
| `startOfWeek` | [L15457](app.js#L15457) | Wochenanfang berechnen | `startOfDay` |
| `startOfMonth` | [L15464](app.js#L15464) | Monatsanfang berechnen | — |
| `formatTime` | [L15468](app.js#L15468) | Zeit formatieren | `getUiLocale` |
| `formatDayLabel` | [L15472](app.js#L15472) | Tageslabel formatieren | `getUiLocale` |
| `formatCalendarTitle` | [L15481](app.js#L15481) | Kalender-Titel formatieren | `addDays`, `getUiLocale`, `startOfWeek` |
| `getIsoWeekNumber` | [L15504](app.js#L15504) | ISO-Wochennummer berechnen | — |
| `updateCalendarViewButtons` | [L16025](app.js#L16025) | View-Buttons aktualisieren | — |
| `getCalendarEvents` | [L16036](app.js#L16036) | Events lesen | — |
| `renderCalendarLegend` | [L16052](app.js#L16052) | Legende rendern | `escapeAttr`, `escapeHtml`, `loadCalendarSources` |
| `moveCalendarCursor` | [L16125](app.js#L16125) | Cursor bewegen | `renderCalendarPanel` |
| `renderCalendarPanel` | [L16263](app.js#L16263) | Panel rendern | `addDays`, `escapeAttr`, `escapeHtml`, `formatCalendarTitle`, `formatDayLabel`, `formatTime`, `getCalendarEvents`, `getIsoWeekNumber`, `loadCalendarSources`, `renderCalendarFreeSlots`, `renderCalendarLegend`, `startOfDay`, `startOfMonth`, `startOfWeek`, `t` |

##### 26.4 Lokale Events & ICS

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `renderCalendarLocalEvents` | [L15116](app.js#L15116) | Lokale Events rendern | `escapeAttr`, `escapeHtml`, `formatTime`, `getUiLocale`, `t` |
| `loadCalendarFreeSlotsVisible` | [L15512](app.js#L15512) | Free-Slots-Sichtbarkeit laden | — |
| `saveCalendarFreeSlotsVisible` | [L15521](app.js#L15521) | Free-Slots-Sichtbarkeit speichern | `applyCalendarFreeSlotsVisibility` |
| `applyCalendarFreeSlotsVisibility` | [L15534](app.js#L15534) | Free-Slots-Sichtbarkeit anwenden | — |
| `parseLocalEventDate` | [L15561](app.js#L15561) | Lokales Event-Datum parsen | — |
| `normalizeLocalCalendarEvent` | [L15568](app.js#L15568) | Lokales Event normalisieren | `createClientId`, `parseLocalEventDate` |
| `serializeLocalCalendarEvent` | [L15591](app.js#L15591) | Lokales Event serialisieren | — |
| `loadLocalCalendarEventsRaw` | [L15604](app.js#L15604) | Rohe lokale Events laden | — |
| `loadLocalCalendarEvents` | [L15614](app.js#L15614) | Lokale Events laden | `loadLocalCalendarEventsRaw` |
| `saveLocalCalendarEvents` | [L15620](app.js#L15620) | Lokale Events speichern | `renderCalendarPanel`, `renderCalendarSettings`, `scheduleCalendarSettingsSync` |
| `parseIcsDate` | [L15722](app.js#L15722) | ICS-Datum parsen | `t` |
| `parseGoogleDate` | [L15745](app.js#L15745) | Google-Datum parsen | `t` |
| `unfoldIcsLines` | [L15770](app.js#L15770) | ICS-Zeilen entfalten | `t` |
| `parseIcsEvents` | [L15787](app.js#L15787) | ICS-Events parsen | `addDays`, `createClientId`, `parseIcsDate`, `t`, `unfoldIcsLines` |
| `mergeCalendarEvents` | [L15850](app.js#L15850) | Events zusammenführen | — |
| `getCalendarRange` | [L15868](app.js#L15868) | Kalender-Range berechnen | `addDays`, `startOfDay`, `startOfMonth`, `startOfWeek` |

##### 26.5 Rendering & Free-Slots

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `refreshCalendarEvents` | [L15952](app.js#L15952) | Events aktualisieren | `fetchGoogleCalendarEvents`, `getCalendarRange`, `loadCalendarSources`, `mergeCalendarEvents`, `parseIcsEvents`, `renderCalendarPanel`, `t` |
| `scheduleCalendarRefresh` | [L16017](app.js#L16017) | Refresh debounce | `refreshCalendarEvents`, `t` |
| `buildWorkWindow` | [L16142](app.js#L16142) | Arbeitszeitfenster bauen | — |
| `mergeIntervals` | [L16162](app.js#L16162) | Intervalle zusammenführen | `t` |
| `computeFreeSlotsForDay` | [L16180](app.js#L16180) | Freie Slots pro Tag berechnen | `addDays`, `buildWorkWindow`, `mergeIntervals`, `startOfDay` |
| `renderCalendarFreeSlots` | [L16214](app.js#L16214) | Free-Slots rendern | `addDays`, `computeFreeSlotsForDay`, `formatDayLabel`, `formatTime`, `startOfWeek` |

##### 26.6 Event-Modal

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `formatDateInputValue` | [L16446](app.js#L16446) | Datumswert formatieren | `t` |
| `openCalendarEventModal` | [L16451](app.js#L16451) | Event-Modal öffnen | `formatDateInputValue`, `t`, `updateCalendarEventTimeState` |
| `closeCalendarEventModal` | [L16475](app.js#L16475) | Event-Modal schließen | — |
| `updateCalendarEventTimeState` | [L16482](app.js#L16482) | Zeitstatus aktualisieren | — |
| `buildLocalEventFromModal` | [L16488](app.js#L16488) | Lokales Event aus Modal bauen | `addDays`, `createClientId`, `t`, `toast` |
| `addLocalCalendarEvent` | [L16542](app.js#L16542) | Lokales Event hinzufügen | `saveLocalCalendarEvents`, `t`, `toast` |
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
| `buildSetMessage` | [L17531](app.js#L17531) | Set-Nachricht bauen | `encryptForRoom` |
| `sendCurrentState` | [L17547](app.js#L17547) | Aktuellen State senden | `buildSetMessage`, `sendMessage` |
| `scheduleSend` | [L17559](app.js#L17559) | Send debounce | `buildSetMessage`, `isCrdtEnabled`, `nowIso`, `sendMessage`, `t` |
| `applyRemoteText` | [L17581](app.js#L17581) | Remote-Text anwenden | `applySyncedText`, `t` |

##### 28.3 CRDT-Core

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `applySyncedText` | [L17357](app.js#L17357) | Synced-Text anwenden | `getActiveRoomTabNoteId`, `nowIso`, `resolveRoomTabSnapshotText`, `sanitizeLegacySnapshotText`, `scheduleRoomTabSync`, `t`, `updatePasswordMaskOverlay`, `updatePreview`, `updateRoomTabTextLocal` |
| `initCrdt` | [L17388](app.js#L17388) | CRDT initialisieren | `applyPendingCrdtBootstrap`, `applySyncedText`, `base64EncodeBytes`, `isCrdtAvailable`, `scheduleCrdtSnapshot`, `sendCrdtUpdate`, `t`, `updateAttributionOverlay` |
| `destroyCrdt` | [L17419](app.js#L17419) | CRDT zerstören | `t`, `updateAttributionOverlay` |
| `applyCrdtUpdate` | [L17440](app.js#L17440) | CRDT-Update anwenden | `base64DecodeBytes`, `updateAttributionOverlay` |
| `setCrdtText` | [L17455](app.js#L17455) | CRDT-Text setzen | `applySyncedText`, `sanitizeLegacySnapshotText`, `scheduleCrdtSnapshot`, `t`, `updateAttributionOverlay` |
| `updateCrdtFromTextarea` | [L17477](app.js#L17477) | CRDT ← Textarea | `t`, `updateAttributionOverlay` |
| `scheduleCrdtSnapshot` | [L17517](app.js#L17517) | Snapshot debounce | `base64EncodeBytes`, `sendCrdtSnapshot`, `t` |
| `applyPendingCrdtBootstrap` | [L17318](app.js#L17318) | Pending Bootstrap anwenden | `applyCrdtUpdate`, `setCrdtText`, `t` |
| `connect` | [L17593](app.js#L17593) | WS verbinden | `announceClientId`, `applyCrdtUpdate`, `applyPresenceUpdate`, `applyRemoteText`, `createClientId`, `decryptForRoom`, `destroyCrdt`, `ensureYjsLoaded`, `initCrdt`, `isCrdtAvailable`, `isCrdtEnabled`, `safeJsonParse`, `scheduleCrdtSnapshot`, `sendCurrentState`, `sendMessage`, `setCrdtText`, `setStatus`, `t`, `toast`, `updatePresenceUI`, `upsertPresence`, `wsDisplay`, `wsUrlForRoom` |
#### 29 · Presence `#presence`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `updatePresenceUI` | [L16999](app.js#L16999) | Presence-UI aktualisieren | `formatUi`, `t`, `updateAttributionOverlay` |
| `upsertPresence` | [L17106](app.js#L17106) | Presence einfügen/aktualisieren | `t`, `updatePresenceUI` |
| `applyPresenceUpdate` | [L17112](app.js#L17112) | Presence-Update anwenden | `t`, `updatePresenceUI` |
| `getAuthorMeta` | [L17120](app.js#L17120) | Autor-Meta lesen | `t` |
| `parseHexColor` | [L17127](app.js#L17127) | Hex-Farbe parsen | `t` |
| `colorToRgba` | [L17148](app.js#L17148) | Farbe → RGBA | `parseHexColor` |
| `syncAttributionOverlayScroll` | [L17170](app.js#L17170) | Attribution-Overlay-Scroll synchen | — |
| `buildAttributionHtml` | [L17184](app.js#L17184) | Attribution-HTML bauen | `colorToRgba`, `escapeHtml`, `getAuthorMeta` |
| `updateAttributionOverlay` | [L17211](app.js#L17211) | Attribution-Overlay aktualisieren | `buildAttributionHtml`, `syncAttributionOverlayScroll` |
| `setTyping` | [L17331](app.js#L17331) | Typing-Status setzen | `applyPresenceUpdate`, `sendMessage` |
| `scheduleTypingStop` | [L17339](app.js#L17339) | Typing-Stop debounce | `setTyping`, `t` |
| `scheduleSelectionSend` | [L17344](app.js#L17344) | Selection-Send debounce | `applyPresenceUpdate`, `sendMessage`, `t` |

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
| `getClientIp` | [L140](server.js#L140) | Client-IP lesen | — |
| `checkAiRateLimit` | [L148](server.js#L148) | AI-Rate-Limit prüfen | — |
| `ensureDbDir` | [L163](server.js#L163) | DB-Verzeichnis sicherstellen | — |
| `initDb` | [L171](server.js#L171) | DB initialisieren | `ensureDbDir` |
| `loadPersistedRoomState` | [L608](server.js#L608) | Room-State laden | `initDb` |
| `persistRoomState` | [L633](server.js#L633) | Room-State persistieren | `initDb` |
| `getSigningSecret` | [L652](server.js#L652) | Signing-Secret lesen | `initDb` |

#### S2 · HTTP-Helfer `#http`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `mimeTypeForPath` | [L665](server.js#L665) | MIME-Type ermitteln | — |
| `safeJsonParse` | [L679](server.js#L679) | JSON sicher parsen | — |
| `json` | [L687](server.js#L687) | JSON-Response senden | — |
| `text` | [L696](server.js#L696) | Text-Response senden | — |
| `redirect` | [L704](server.js#L704) | Redirect senden | — |
| `readBody` | [L783](server.js#L783) | Body lesen | — |
| `readBodyWithLimit` | [L802](server.js#L802) | Body mit Limit lesen | — |
| `readJson` | [L822](server.js#L822) | JSON-Body lesen | `readBody`, `safeJsonParse` |
| `readJsonWithLimit` | [L828](server.js#L828) | JSON-Body mit Limit lesen | `readBodyWithLimit`, `safeJsonParse` |

#### S3 · Auth & Session `#auth`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `parseCookies` | [L714](server.js#L714) | Cookies parsen | — |
| `cookieOptions` | [L728](server.js#L728) | Cookie-Optionen bauen | — |
| `sign` | [L734](server.js#L734) | HMAC signieren | `getSigningSecret` |
| `makeSessionCookie` | [L741](server.js#L741) | Session-Cookie erstellen | `cookieOptions`, `sign` |
| `clearSessionCookie` | [L750](server.js#L750) | Session-Cookie löschen | — |
| `getAuthedEmail` | [L756](server.js#L756) | Auth-Email lesen | `parseCookies`, `sign` |
| `normalizeEmail` | [L774](server.js#L774) | Email normalisieren | — |
| `saveLoginToken` | [L1799](server.js#L1799) | Login-Token speichern | `initDb` |
| `getLoginToken` | [L1804](server.js#L1804) | Login-Token lesen | `initDb` |
| `deleteLoginToken` | [L1809](server.js#L1809) | Login-Token löschen | `initDb` |
| `getOrigin` | [L1814](server.js#L1814) | Origin lesen | — |
| `sendMagicLinkEmail` | [L1827](server.js#L1827) | Magic-Link-Email senden | — |

#### S4 · Uploads `#uploads`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `ensureUploadsDir` | [L834](server.js#L834) | Upload-Verzeichnis sicherstellen | — |
| `cleanupUploads` | [L842](server.js#L842) | Uploads aufräumen | `ensureUploadsDir` |
| `sanitizeFilename` | [L871](server.js#L871) | Dateiname bereinigen | — |
| `decodeDataUrl` | [L882](server.js#L882) | Data-URL dekodieren | — |
| `isAllowedUploadMime` | [L898](server.js#L898) | Upload-MIME prüfen | — |
| `extForMime` | [L903](server.js#L903) | Extension für MIME | — |

#### S5 · Notes, Tags & Favoriten `#notes` `#tags`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `uniq` | [L914](server.js#L914) | Duplikate entfernen | — |
| `extractHashtags` | [L918](server.js#L918) | Hashtags extrahieren | — |
| `classifyText` | [L926](server.js#L926) | Text klassifizieren | `applyDateTags`, `computeNoteContentHash`, `extractHashtags`, `getDateTagsForTs`, `getOrCreateUserId`, `initDb`, `isMonthTag`, `isValidNoteId`, `isYearTag`, `listNotes`, `mergeManualTags`, `normalizeImportTags`, `normalizeNoteTextForHash`, `parseTagsJson`, `splitManualOverrideTags`, `uniq` |
| `parseTagsJson` | [L1014](server.js#L1014) | Tags-JSON parsen | — |
| `normalizeImportTags` | [L1098](server.js#L1098) | Import-Tags normalisieren | `uniq` |
| `isYearTag` | [L1151](server.js#L1151) | Jahres-Tag prüfen | — |
| `isMonthTag` | [L1155](server.js#L1155) | Monats-Tag prüfen | — |
| `getDateTagsForTs` | [L1161](server.js#L1161) | Datums-Tags für Timestamp | — |
| `applyDateTags` | [L1173](server.js#L1173) | Datums-Tags anwenden | `getDateTagsForTs`, `isMonthTag`, `isYearTag`, `uniq` |
| `splitManualOverrideTags` | [L1186](server.js#L1186) | Manuelle Override-Tags splitten | `normalizeImportTags` |
| `mergeManualTags` | [L1195](server.js#L1195) | Manuelle Tags mergen | `classifyText`, `extractHashtags`, `normalizeImportTags`, `uniq` |
| `isValidNoteId` | [L1223](server.js#L1223) | Notiz-ID validieren | — |
| `normalizeNoteTextForHash` | [L1227](server.js#L1227) | Notiz-Text für Hash normalisieren | — |
| `computeNoteContentHash` | [L1233](server.js#L1233) | Notiz-Content-Hash berechnen | `normalizeNoteTextForHash` |
| `getOrCreateUserId` | [L1239](server.js#L1239) | User-ID erstellen/lesen | `initDb` |
| `listNotes` | [L1248](server.js#L1248) | Notizen auflisten | `initDb`, `parseTagsJson` |
| `purgeExpiredTrash` | [L1277](server.js#L1277) | Abgelaufenen Trash löschen | `initDb` |
| `listTrashNotes` | [L1284](server.js#L1284) | Trash-Notizen auflisten | `initDb`, `parseTagsJson` |
| `listTags` | [L1300](server.js#L1300) | Tags auflisten | `initDb`, `parseTagsJson`, `uniq` |
| `listFavorites` | [L1313](server.js#L1313) | Favoriten auflisten | `initDb` |
| `listRoomTabs` | [L1324](server.js#L1324) | Room-Tabs auflisten | `initDb` |

#### S6 · Calendar & Google `#calendar` `#google`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `sanitizeCalendarSettings` | [L1357](server.js#L1357) | Kalender-Settings bereinigen | — |
| `parseCalendarJson` | [L1439](server.js#L1439) | Kalender-JSON parsen | `sanitizeCalendarSettings` |
| `getUserSettings` | [L1502](server.js#L1502) | User-Settings lesen | `initDb`, `parseCalendarJson` |
| `upsertUserSettings` | [L1526](server.js#L1526) | User-Settings schreiben | `initDb`, `sanitizeCalendarSettings` |
| `googleConfigured` | [L1586](server.js#L1586) | Google konfiguriert? | — |
| `makeGoogleState` | [L1603](server.js#L1603) | Google-State erstellen | `sign` |
| `parseGoogleState` | [L1612](server.js#L1612) | Google-State parsen | `sign` |
| `getGoogleTokens` | [L1651](server.js#L1651) | Google-Tokens lesen | `initDb` |
| `saveGoogleTokens` | [L1656](server.js#L1656) | Google-Tokens speichern | `initDb` |
| `deleteGoogleTokens` | [L1670](server.js#L1670) | Google-Tokens löschen | `initDb` |
| `getGoogleCalendarIdForUser` | [L1699](server.js#L1699) | Google-Kalender-ID lesen | `getUserSettings` |
| `refreshGoogleAccessToken` | [L1713](server.js#L1713) | Google-Token auffrischen | `json` |
| `getGoogleAccessToken` | [L1736](server.js#L1736) | Google-Access-Token lesen | `getGoogleTokens`, `refreshGoogleAccessToken`, `saveGoogleTokens` |

#### S7 · WebSocket & Presence `#ws` `#presence`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `clampRoom` | [L1867](server.js#L1867) | Room-Name begrenzen | — |
| `clampKey` | [L1874](server.js#L1874) | Key begrenzen | — |
| `roomKey` | [L1881](server.js#L1881) | Room-Key bauen | — |
| `getRoomSockets` | [L1915](server.js#L1915) | Room-Sockets lesen | — |
| `getRoomPresence` | [L1924](server.js#L1924) | Room-Presence lesen | — |
| `buildPresenceList` | [L1989](server.js#L1989) | Presence-Liste bauen | `getRoomPresence` |
| `sendPresenceState` | [L1993](server.js#L1993) | Presence-State senden | `buildPresenceList` |
| `broadcastPresenceState` | [L2002](server.js#L2002) | Presence broadcasten | `broadcast`, `buildPresenceList` |
| `broadcast` | [L2007](server.js#L2007) | An Room broadcasten | `getRoomSockets` |

#### S8 · AI / Anthropic `#ai`

| Funktion | Zeile | Zweck | Abhängigkeiten |
|----------|-------|-------|----------------|
| `formatInputForUserPrompt` | [L4381](server.js#L4381) | Input für User-Prompt formatieren | — |
| `buildUserPrompt` | [L4395](server.js#L4395) | User-Prompt bauen | `formatInputForUserPrompt` |
| `callAnthropic` | [L4417](server.js#L4417) | Anthropic API aufrufen | `safeJsonParse`, `text` |
| `runWithModelFallback` | [L4447](server.js#L4447) | Mit Model-Fallback ausführen | `callAnthropic` |
| `extractText` | [L4476](server.js#L4476) | Text extrahieren | — |
| `shouldRetryRunOutput` | [L4485](server.js#L4485) | Run-Output Retry prüfen | — |
| `extractFencedCodeBlocks` | [L4501](server.js#L4501) | Fenced-Code-Blöcke extrahieren | — |
| `coerceRunModeText` | [L4513](server.js#L4513) | Run-Mode-Text umwandeln | `extractFencedCodeBlocks` |
| `chunkText` | [L4548](server.js#L4548) | Text in Chunks teilen | — |
