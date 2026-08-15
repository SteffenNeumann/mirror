# Funktionskatalog

> Nachschlagewerk, **nicht zum Lesen am Stück** gedacht. Jede Funktion trägt `#tags` — zum Finden `Ctrl+F` bzw. `grep` nach `#tagname`.
> Ist-Zustand und Architektur stehen in [ARCHITECTURE.md](ARCHITECTURE.md).


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

---

## Architektur-Referenz (übernommen aus Project-overview.md)

> Detailtabellen, die beim Destillieren von ARCHITECTURE.md nicht in die Kurzfassung passten.

### Notiz-Graph

### Zuständige Funktionen (app.js, alle `ng`-präfixiert, nach `openNoteFromWikiTarget`)

| Funktion | Zweck | Abhängigkeiten |
|---|---|---|
| `openNoteGraph` / `closeNoteGraph` | Overlay auf/zu, Sim resume/pause | `ngEnsureLib`, `ngInit`, `ngApplyData`, `isMobileViewport` |
| `ngEnsureLib` | force-graph lazy per `<script>` laden | — |
| `ngBuildData` | `{nodes, links}` bauen (Wiki + Tag-Kanten, Grad) | `filterRealNotes`, `buildNoteTitleIndex`, `getNoteTitle` |
| `ngViewData` | Global/Lokal-Filter | — |
| `ngReadPalette` | Theme-Farben lesen (Luminanz-Fallback) | — |
| `ngDrawNode` / `ngPaintArea` / `ngLinkColor` / `ngLinkWidth` | Canvas-Zeichnen | `ngReadPalette` |
| `ngComputeHighlight` | Nachbar-Set für Hover/Auswahl | — |
| `ngShowNotePreview` / `ngOpenNote` | Vorschaukarte / Notiz öffnen | `findNoteById`, `applyNoteToEditor` |
| `ngWireControls` | Einmaliges Wiring (Seg/Suche/Toggle/Fit/Close/Esc/Resize) | — |

### Konfiguration / Defaults

- **Tag-Kanten default AUS** (nur Wiki-Links); bei „an" gekappt (`CAP = 8` Notizen/Tag) gegen Hairball.
- **Nur Vollbild** in v1; Inline-Mini-Graph in der Notiz ist mögliche v2.
- Cache: SW `mirror-v22` → `v23`, `app.js?v=2026-07-01-01`, `force-graph.min.js` precached.


### Availability / gemeinsame Terminfindung

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

