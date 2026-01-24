# Project overview

Datum: 2026-01-24

Hinweis: Abhängigkeiten sind Funktionsaufrufe innerhalb der Datei (statische Analyse, keine Laufzeitauflösung).

## Hauptfunktion (Client)
- Datei: [app.js](app.js#L1) (IIFE). Zweck: Initialisiert UI, Event-Handler, Synchronisation, Preview und Personal Space.
- Umsetzung: ruft `initUiEventListeners` und `initStartupTasks` auf und startet Hintergrundflüsse.
  - `initUiEventListeners`: [app.js](app.js#L14836)
  - `initStartupTasks`: [app.js](app.js#L15750)

## Hauptfunktion (Server)
- Datei: [server.js](server.js#L1) (Modul-Entry). Zweck: HTTP-Server, API-Routen, Uploads, SQLite, WebSocket-Sync.
- Umsetzung: initialisiert DB-Hilfen, richtet Request-Handling ein, startet WebSocket-Server und hört auf `PORT`.

## Funktionsübersicht app.js

- `normalizeBaseUrl` ([app.js](app.js#L338)) — Zweck: Normalisiert base url. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `tryRenderSharedNote` ([app.js](app.js#L351)) — Zweck: Allgemeiner Helfer: try render shared note. Umsetzung: nutzt interne Aufrufe: `base64UrlDecode`, `buildNoteShareHtmlDocument`, `t`.
- `ensurePdfJsLoaded` ([app.js](app.js#L382)) — Zweck: Stellt sicher: pdf js loaded. Umsetzung: nutzt interne Aufrufe: `t`.
- `getPdfPreviewDoc` ([app.js](app.js#L398)) — Zweck: Liest pdf preview doc. Umsetzung: nutzt interne Aufrufe: `ensurePdfJsLoaded`, `t`.
- `renderPdfPreviewPage` ([app.js](app.js#L414)) — Zweck: Rendert pdf preview page. Umsetzung: nutzt interne Aufrufe: `ensurePdfJsLoaded`, `getPdfPreviewDoc`, `t`.
- `createClientId` ([app.js](app.js#L437)) — Zweck: Erzeugt client id. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `announceClientId` ([app.js](app.js#L451)) — Zweck: Allgemeiner Helfer: announce client id. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `randomIdentity` ([app.js](app.js#L476)) — Zweck: Erzeugt zufällige identity. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `loadIdentity` ([app.js](app.js#L555)) — Zweck: Lädt identity. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `saveIdentity` ([app.js](app.js#L571)) — Zweck: Speichert identity. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `normalizeRoom` ([app.js](app.js#L587)) — Zweck: Normalisiert room. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `normalizeKey` ([app.js](app.js#L596)) — Zweck: Normalisiert key. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `parseRoomAndKeyFromHash` ([app.js](app.js#L605)) — Zweck: Parst room and key from hash. Umsetzung: nutzt interne Aufrufe: `normalizeKey`, `normalizeRoom`, `t`.
- `buildShareHash` ([app.js](app.js#L624)) — Zweck: Baut share hash. Umsetzung: nutzt interne Aufrufe: `t`.
- `randomKey` ([app.js](app.js#L631)) — Zweck: Erzeugt zufällige key. Umsetzung: nutzt interne Aufrufe: `normalizeKey`.
- `resetE2eeKeyCache` ([app.js](app.js#L652)) — Zweck: Allgemeiner Helfer: reset e2ee key cache. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `base64UrlEncode` ([app.js](app.js#L657)) — Zweck: Allgemeiner Helfer: base64 url encode. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `base64UrlDecode` ([app.js](app.js#L668)) — Zweck: Allgemeiner Helfer: base64 url decode. Umsetzung: nutzt interne Aufrufe: `t`.
- `base64EncodeBytes` ([app.js](app.js#L682)) — Zweck: Allgemeiner Helfer: base64 encode bytes. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `base64DecodeBytes` ([app.js](app.js#L691)) — Zweck: Allgemeiner Helfer: base64 decode bytes. Umsetzung: nutzt interne Aufrufe: `t`.
- `getE2eeKey` ([app.js](app.js#L701)) — Zweck: Liest e2ee key. Umsetzung: nutzt interne Aufrufe: `t`.
- `encryptForRoom` ([app.js](app.js#L717)) — Zweck: Allgemeiner Helfer: encrypt for room. Umsetzung: nutzt interne Aufrufe: `base64UrlEncode`, `getE2eeKey`, `t`.
- `decryptForRoom` ([app.js](app.js#L733)) — Zweck: Allgemeiner Helfer: decrypt for room. Umsetzung: nutzt interne Aufrufe: `base64UrlDecode`, `getE2eeKey`, `t`.
- `toast` ([app.js](app.js#L746)) — Zweck: Benachrichtigungen anzeigen. Umsetzung: nutzt interne Aufrufe: `t`.
- `loadBuildStamp` ([app.js](app.js#L767)) — Zweck: Lädt build stamp. Umsetzung: nutzt interne Aufrufe: `t`.
- `isModalReady` ([app.js](app.js#L805)) — Zweck: Prüft is modal ready. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `setModalOpen` ([app.js](app.js#L817)) — Zweck: Setzt modal open. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `openModal` ([app.js](app.js#L829)) — Zweck: Öffnet modal. Umsetzung: nutzt interne Aufrufe: `cleanup`, `finish`, `isModalReady`, `onBackdropClick`, `onCancel`, `onInputKey`, `onKeyDown`, `onOk`, `setModalOpen`, `t`.
- `cleanup` ([app.js](app.js#L880)) — Zweck: Allgemeiner Helfer: cleanup. Umsetzung: nutzt interne Aufrufe: `setModalOpen`.
- `finish` ([app.js](app.js#L899)) — Zweck: Allgemeiner Helfer: finish. Umsetzung: nutzt interne Aufrufe: `cleanup`.
- `onCancel` ([app.js](app.js#L905)) — Zweck: Allgemeiner Helfer: on cancel. Umsetzung: nutzt interne Aufrufe: `finish`.
- `onOk` ([app.js](app.js#L908)) — Zweck: Allgemeiner Helfer: on ok. Umsetzung: nutzt interne Aufrufe: `finish`.
- `onBackdropClick` ([app.js](app.js#L911)) — Zweck: Allgemeiner Helfer: on backdrop click. Umsetzung: nutzt interne Aufrufe: `finish`.
- `onInputKey` ([app.js](app.js#L915)) — Zweck: Allgemeiner Helfer: on input key. Umsetzung: nutzt interne Aufrufe: `finish`, `t`.
- `onKeyDown` ([app.js](app.js#L922)) — Zweck: Allgemeiner Helfer: on key down. Umsetzung: nutzt interne Aufrufe: `finish`, `t`.
- `modalConfirm` ([app.js](app.js#L940)) — Zweck: Allgemeiner Helfer: modal confirm. Umsetzung: nutzt interne Aufrufe: `openModal`.
- `modalPrompt` ([app.js](app.js#L952)) — Zweck: Allgemeiner Helfer: modal prompt. Umsetzung: nutzt interne Aufrufe: `openModal`.
- `isShareModalReady` ([app.js](app.js#L971)) — Zweck: Prüft is share modal ready. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `setShareModalOpen` ([app.js](app.js#L983)) — Zweck: Setzt share modal open. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `buildQrUrl` ([app.js](app.js#L995)) — Zweck: Baut qr url. Umsetzung: nutzt interne Aufrufe: `t`.
- `updateShareModalLink` ([app.js](app.js#L1000)) — Zweck: Aktualisiert share modal link. Umsetzung: nutzt interne Aufrufe: `buildQrUrl`, `buildShareHref`, `isShareModalReady`, `t`.
- `openShareModal` ([app.js](app.js#L1017)) — Zweck: Öffnet share modal. Umsetzung: nutzt interne Aufrufe: `isShareModalReady`, `setShareModalOpen`, `t`, `updateShareModalLink`.
- `isNoteShareModalReady` ([app.js](app.js#L1036)) — Zweck: Prüft is note share modal ready. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `revokeNoteShareShareUrl` ([app.js](app.js#L1049)) — Zweck: Allgemeiner Helfer: revoke note share share url. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `buildNoteShareHtmlDocument` ([app.js](app.js#L1053)) — Zweck: Baut note share html document. Umsetzung: nutzt interne Aufrufe: `escapeHtml`.
- `setNoteShareModalOpen` ([app.js](app.js#L1076)) — Zweck: Setzt note share modal open. Umsetzung: nutzt interne Aufrufe: `revokeNoteShareShareUrl`.
- `buildNoteSharePayloadFromIds` ([app.js](app.js#L1089)) — Zweck: Baut note share payload from ids. Umsetzung: nutzt interne Aufrufe: `findNoteById`, `getNoteTitle`.
- `buildNoteShareUrl` ([app.js](app.js#L1114)) — Zweck: Baut note share url. Umsetzung: nutzt interne Aufrufe: `base64UrlEncode`, `t`.
- `buildNoteShareQrPayload` ([app.js](app.js#L1128)) — Zweck: Baut note share qr payload. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `updateNoteShareModal` ([app.js](app.js#L1148)) — Zweck: Aktualisiert note share modal. Umsetzung: nutzt interne Aufrufe: `buildNoteShareQrPayload`, `buildNoteShareUrl`, `buildQrUrl`, `isNoteShareModalReady`, `revokeNoteShareShareUrl`, `t`.
- `openNoteShareModal` ([app.js](app.js#L1190)) — Zweck: Öffnet note share modal. Umsetzung: nutzt interne Aufrufe: `buildNoteSharePayloadFromIds`, `isNoteShareModalReady`, `setNoteShareModalOpen`, `t`, `toast`, `updateNoteShareModal`.
- `isUploadModalReady` ([app.js](app.js#L1212)) — Zweck: Prüft is upload modal ready. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `setUploadModalOpen` ([app.js](app.js#L1224)) — Zweck: Setzt upload modal open. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `formatBytes` ([app.js](app.js#L1236)) — Zweck: Formatiert bytes. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `buildUploadMarkdown` ([app.js](app.js#L1244)) — Zweck: Baut upload markdown. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `isAllowedUploadType` ([app.js](app.js#L1254)) — Zweck: Prüft is allowed upload type. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `updateUploadPreview` ([app.js](app.js#L1259)) — Zweck: Aktualisiert upload preview. Umsetzung: nutzt interne Aufrufe: `formatBytes`.
- `setUploadInsertDisabled` ([app.js](app.js#L1275)) — Zweck: Setzt upload insert disabled. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `resetUploadModalState` ([app.js](app.js#L1283)) — Zweck: Allgemeiner Helfer: reset upload modal state. Umsetzung: nutzt interne Aufrufe: `setUploadInsertDisabled`, `updateUploadPreview`.
- `openUploadModal` ([app.js](app.js#L1291)) — Zweck: Öffnet upload modal. Umsetzung: nutzt interne Aufrufe: `isUploadModalReady`, `resetUploadModalState`, `setUploadModalOpen`, `t`.
- `readFileAsDataUrl` ([app.js](app.js#L1304)) — Zweck: Allgemeiner Helfer: read file as data url. Umsetzung: nutzt interne Aufrufe: `t`.
- `api` ([app.js](app.js#L1313)) — Zweck: HTTP-API-Aufruf im Client. Umsetzung: nutzt interne Aufrufe: `safeJsonParse`, `t`.
- `fmtDate` ([app.js](app.js#L1336)) — Zweck: Allgemeiner Helfer: fmt date. Umsetzung: nutzt interne Aufrufe: `getUiLocale`.
- `normalizeManualTags` ([app.js](app.js#L1350)) — Zweck: Normalisiert manual tags. Umsetzung: nutzt interne Aufrufe: `t`.
- `uniqTags` ([app.js](app.js#L1408)) — Zweck: Entfernt Duplikate für tags. Umsetzung: nutzt interne Aufrufe: `t`.
- `normalizeYearTag` ([app.js](app.js#L1426)) — Zweck: Normalisiert year tag. Umsetzung: nutzt interne Aufrufe: `t`.
- `normalizeMonthTag` ([app.js](app.js#L1432)) — Zweck: Normalisiert month tag. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `normalizeCategoryValue` ([app.js](app.js#L1438)) — Zweck: Normalisiert category value. Umsetzung: nutzt interne Aufrufe: `t`.
- `isYearTag` ([app.js](app.js#L1449)) — Zweck: Prüft is year tag. Umsetzung: nutzt interne Aufrufe: `t`.
- `isMonthTag` ([app.js](app.js#L1453)) — Zweck: Prüft is month tag. Umsetzung: nutzt interne Aufrufe: `normalizeMonthTag`.
- `getDateTagsForTs` ([app.js](app.js#L1457)) — Zweck: Liest date tags for ts. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `splitTagsForEditor` ([app.js](app.js#L1479)) — Zweck: Allgemeiner Helfer: split tags for editor. Umsetzung: nutzt interne Aufrufe: `getDateTagsForTs`, `isMonthTag`, `isYearTag`, `normalizeMonthTag`, `stripManualTagsMarker`, `stripPinnedTag`.
- `buildEditorSystemTags` ([app.js](app.js#L1524)) — Zweck: Baut editor system tags. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `getEditingNoteCreatedAt` ([app.js](app.js#L1534)) — Zweck: Liest editing note created at. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `syncPsEditorTagMetaInputs` ([app.js](app.js#L1543)) — Zweck: Synchronisiert ps editor tag meta inputs. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `updatePsEditorTagMetaFromInputs` ([app.js](app.js#L1553)) — Zweck: Aktualisiert ps editor tag meta from inputs. Umsetzung: nutzt interne Aufrufe: `getDateTagsForTs`, `getEditingNoteCreatedAt`, `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `schedulePsTagsAutoSave`, `syncPsEditorTagMetaInputs`, `t`, `updateEditingNoteTagsLocal`, `updateEditorMetaYaml`, `updatePsEditingTagsHint`.
- `formatTagsForHint` ([app.js](app.js#L1576)) — Zweck: Formatiert tags for hint. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `updatePsEditingTagsHint` ([app.js](app.js#L1582)) — Zweck: Aktualisiert ps editing tags hint. Umsetzung: nutzt interne Aufrufe: `formatTagsForHint`, `t`.
- `formatTagsForEditor` ([app.js](app.js#L1610)) — Zweck: Formatiert tags for editor. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `setPsEditorTagsVisible` ([app.js](app.js#L1615)) — Zweck: Setzt ps editor tags visible. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `syncPsEditorTagsInput` ([app.js](app.js#L1620)) — Zweck: Synchronisiert ps editor tags input. Umsetzung: nutzt interne Aufrufe: `formatTagsForEditor`, `syncPsEditorTagMetaInputs`.
- `getPsEditorTagTokenBounds` ([app.js](app.js#L1638)) — Zweck: Liest ps editor tag token bounds. Umsetzung: nutzt interne Aufrufe: `t`.
- `buildPsEditorTagsSuggestItems` ([app.js](app.js#L1652)) — Zweck: Baut ps editor tags suggest items. Umsetzung: nutzt interne Aufrufe: `getPsEditorTagTokenBounds`, `isMonthTag`, `isYearTag`, `normalizeManualTags`, `t`.
- `closePsEditorTagsSuggest` ([app.js](app.js#L1679)) — Zweck: Schließt ps editor tags suggest. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `renderPsEditorTagsSuggest` ([app.js](app.js#L1688)) — Zweck: Rendert ps editor tags suggest. Umsetzung: nutzt interne Aufrufe: `closePsEditorTagsSuggest`, `escapeHtml`, `escapeHtmlAttr`, `t`.
- `updatePsEditorTagsSuggest` ([app.js](app.js#L1713)) — Zweck: Aktualisiert ps editor tags suggest. Umsetzung: nutzt interne Aufrufe: `buildPsEditorTagsSuggestItems`, `closePsEditorTagsSuggest`, `renderPsEditorTagsSuggest`, `t`.
- `updatePsEditorTagsFromInput` ([app.js](app.js#L1744)) — Zweck: Aktualisiert ps editor tags from input. Umsetzung: nutzt interne Aufrufe: `normalizeManualTags`, `schedulePsTagsAutoSave`, `t`, `updateEditingNoteTagsLocal`, `updateEditorMetaYaml`, `updatePsEditingTagsHint`.
- `applyPsEditorTagSuggestion` ([app.js](app.js#L1756)) — Zweck: Wendet ps editor tag suggestion. Umsetzung: nutzt interne Aufrufe: `getPsEditorTagTokenBounds`, `t`, `updatePsEditorTagsFromInput`, `updatePsEditorTagsSuggest`.
- `syncPsEditingNoteTagsFromState` ([app.js](app.js#L1772)) — Zweck: Synchronisiert ps editing note tags from state. Umsetzung: nutzt interne Aufrufe: `normalizeCategoryValue`, `normalizeMonthTag`, `normalizeYearTag`, `splitTagsForEditor`, `syncPsEditorTagsInput`, `t`, `updatePsEditingTagsHint`.
- `getLineBounds` ([app.js](app.js#L1796)) — Zweck: Liest line bounds. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `replaceTextRange` ([app.js](app.js#L1805)) — Zweck: Allgemeiner Helfer: replace text range. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `insertTextAtCursor` ([app.js](app.js#L1813)) — Zweck: Allgemeiner Helfer: insert text at cursor. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `showSlashHelp` ([app.js](app.js#L1828)) — Zweck: Allgemeiner Helfer: show slash help. Umsetzung: nutzt interne Aufrufe: `openModal`.
- `getTextareaCaretCoords` ([app.js](app.js#L1896)) — Zweck: Liest textarea caret coords. Umsetzung: nutzt interne Aufrufe: `t`.
- `positionFloatingMenu` ([app.js](app.js#L1959)) — Zweck: Allgemeiner Helfer: position floating menu. Umsetzung: nutzt interne Aufrufe: `getTextareaCaretCoords`, `t`.
- `setSlashMenuOpen` ([app.js](app.js#L1980)) — Zweck: Setzt slash menu open. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `getSlashContext` ([app.js](app.js#L1986)) — Zweck: Liest slash context. Umsetzung: nutzt interne Aufrufe: `getLineBounds`.
- `setWikiMenuOpen` ([app.js](app.js#L2033)) — Zweck: Setzt wiki menu open. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `setSelectionMenuOpen` ([app.js](app.js#L2039)) — Zweck: Setzt selection menu open. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
- `getSelectionRange` ([app.js](app.js#L2045)) — Zweck: Liest selection range. Umsetzung: nutzt interne Aufrufe: keine internen Funktionsaufrufe.
## Funktionsübersicht server.js
