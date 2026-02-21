// Minimalistische Echtzeit-Synchronisation.
// Für Produktion: eigenen WebSocket-Server oder einen Realtime-Provider einsetzen.
(function () {
	const textarea = document.getElementById("mirror");
	const statusDot = document.getElementById("statusDot");
	const statusText = document.getElementById("statusText");
	const roomLabel = document.getElementById("roomLabel");
	const buildStamp = document.getElementById("buildStamp");
	const syncStamp = document.getElementById("syncStamp");
	const shareLink = document.getElementById("shareLink");
	const copyLinkBtn = document.getElementById("copyLink");
	const wsHint = document.getElementById("wsHint");
	const roomInput = document.getElementById("roomInput");
	const roomOptions = document.getElementById("roomOptions");
	const joinRoomBtn = document.getElementById("joinRoom");
	const newRoomBtn = document.getElementById("newRoom");
	const favoritesSelect = document.getElementById("favoritesSelect");
	const toggleFavoriteBtn = document.getElementById("toggleFavorite");
	const metaLeft = document.getElementById("metaLeft");
	const metaRight = document.getElementById("metaRight");
	const presenceSummary = document.getElementById("presenceSummary");
	const presenceList = document.getElementById("presenceList");
	const typingIndicator = document.getElementById("typingIndicator");
	const crdtStatus = document.getElementById("crdtStatus");
	const toggleCrdtMarksBtn = document.getElementById("toggleCrdtMarks");
	const toastRoot = document.getElementById("toastRoot");
	const modalRoot = document.getElementById("modalRoot");
	const modalBackdrop = document.querySelector('[data-role="modalBackdrop"]');
	const modalTitle = document.getElementById("modalTitle");
	const modalDesc = document.getElementById("modalDesc");
	const modalInputWrap = document.getElementById("modalInputWrap");
	const modalInput = document.getElementById("modalInput");
	const modalClose = document.getElementById("modalClose");
	const modalCancel = document.getElementById("modalCancel");
	const modalOk = document.getElementById("modalOk");
	const shareModal = document.getElementById("shareModal");
	const shareModalBackdrop = document.querySelector(
		'[data-role="shareModalBackdrop"]'
	);
	const shareModalClose = document.getElementById("shareModalClose");
	const shareModeSelect = document.getElementById("shareMode");
	const shareModalLink = document.getElementById("shareModalLink");
	const shareModalCopy = document.getElementById("shareModalCopy");
	const shareModalQr = document.getElementById("shareModalQr");
	const shareModalShare = document.getElementById("shareModalShare");
	const shareModalMail = document.getElementById("shareModalMail");
	const shareModalOpen = document.getElementById("shareModalOpen");
	const noteShareModal = document.getElementById("noteShareModal");
	const noteShareModalBackdrop = document.querySelector(
		'[data-role="noteShareModalBackdrop"]'
	);
	const noteShareModalClose = document.getElementById("noteShareModalClose");
	const noteShareModalTitle = document.getElementById("noteShareModalTitle");
	const noteShareModalMeta = document.getElementById("noteShareModalMeta");
	const noteShareModalText = document.getElementById("noteShareModalText");
	const noteShareModalCopy = document.getElementById("noteShareModalCopy");
	const noteShareModalQr = document.getElementById("noteShareModalQr");
	const noteShareModalShare = document.getElementById("noteShareModalShare");
	const noteShareModalMail = document.getElementById("noteShareModalMail");
	const noteShareModalOpen = document.getElementById("noteShareModalOpen");
	const openUploadModalBtn = document.getElementById("openUploadModal");
	const uploadModal = document.getElementById("uploadModal");
	const uploadModalBackdrop = document.querySelector(
		'[data-role="uploadModalBackdrop"]'
	);
	const uploadModalClose = document.getElementById("uploadModalClose");
	const uploadPickBtn = document.getElementById("uploadPick");
	const uploadFileInput = document.getElementById("uploadFile");
	const uploadFileName = document.getElementById("uploadFileName");
	const uploadFileMeta = document.getElementById("uploadFileMeta");
	const uploadCancel = document.getElementById("uploadCancel");
	const uploadInsert = document.getElementById("uploadInsert");
	const editorPreviewGrid = document.getElementById("editorPreviewGrid");
	const previewPanel = document.getElementById("previewPanel");
	const mdPreview = document.getElementById("mdPreview");
	const togglePreview = document.getElementById("togglePreview");
	const toggleFullPreview = document.getElementById("toggleFullPreview");
	const previewCloseMobile = document.getElementById("previewCloseMobile");
	const aiModeSelect = document.getElementById("aiMode");
	const aiAssistBtn = document.getElementById("aiAssist");
	const clearRunOutputBtn = document.getElementById("clearRunOutput");
	const runOutputBar = document.getElementById("runOutputBar");
	const runOutputEl = document.getElementById("runOutput");
	const runStatusEl = document.getElementById("runStatus");
	const runOutputTitleEl = document.getElementById("runOutputTitle");
	const runOutputIconEl = document.getElementById("runOutputIcon");
	const applyOutputReplaceBtn = document.getElementById("applyOutputReplace");
	const applyOutputAppendBtn = document.getElementById("applyOutputAppend");
	const aiPromptInput = document.getElementById("aiPrompt");
	const aiPromptClearBtn = document.getElementById("aiPromptClear");
	const aiDictateBtn = document.getElementById("aiDictate");
	const aiUsePreviewBtn = document.getElementById("aiUsePreviewBtn");
	const aiUseAnswerBtn = document.getElementById("aiUseAnswerBtn");
	const aiModeWrap = document.getElementById("aiModeWrap");
	const aiPromptWrap = document.getElementById("aiPromptWrap");
	const aiChatHistory = document.getElementById("aiChatHistory");
	const aiChatList = document.getElementById("aiChatList");
	const aiChatClearBtn = document.getElementById("aiChatClear");
	const copyMirrorBtn = document.getElementById("copyMirror");
	const togglePermanentLinkBtn = document.getElementById("togglePermanentLink");
	const toggleExcalidrawBtn = document.getElementById("toggleExcalidraw");
	const toggleLinearBtn = document.getElementById("toggleLinear");
	const toggleExcelBtn = document.getElementById("toggleExcel");
	const toggleCommentsBtn = document.getElementById("toggleComments");
	const commentPanel = document.getElementById("commentPanel");
	const commentList = document.getElementById("commentList");
	const commentEmpty = document.getElementById("commentEmpty");
	const commentSelectionLabel = document.getElementById("commentSelectionLabel");
	const commentInput = document.getElementById("commentInput");
	const commentAddBtn = document.getElementById("commentAdd");
	const commentAddLabel = document.getElementById("commentAddLabel");
	const commentMdBoldBtn = document.getElementById("commentMdBold");
	const commentMdItalicBtn = document.getElementById("commentMdItalic");
	const commentMdCodeBtn = document.getElementById("commentMdCode");
	const commentCloseBtn = document.getElementById("commentClose");
	const commentCountBadge = document.getElementById("commentCountBadge");
	const codeLangWrap = document.getElementById("codeLangWrap");
	const codeLangSelect = document.getElementById("codeLang");
	const insertCodeBlockBtn = document.getElementById("insertCodeBlock");
	const slashMenu = document.getElementById("slashMenu");
	const slashMenuList = document.getElementById("slashMenuList");
	const wikiMenu = document.getElementById("wikiMenu");
	const wikiMenuList = document.getElementById("wikiMenuList");
	const selectionMenu = document.getElementById("selectionMenu");
	const attributionOverlay = document.getElementById("attributionOverlay");
	const attributionOverlayContent = document.getElementById(
		"attributionOverlayContent"
	);
	const commentOverlay = document.getElementById("commentOverlay");
	const commentOverlayContent = document.getElementById("commentOverlayContent");
	const excalidrawEmbed = document.getElementById("excalidrawEmbed");
	const excalidrawFrame = excalidrawEmbed
		? excalidrawEmbed.querySelector("iframe")
		: null;
	const excalidrawDragHandle = document.getElementById("excalidrawDragHandle");
	const excelEmbed = document.getElementById("excelEmbed");
	const excelFrame = excelEmbed ? excelEmbed.querySelector("iframe") : null;
	const excelDragHandle = document.getElementById("excelDragHandle");
	const linearEmbed = document.getElementById("linearEmbed");
	const linearDragHandle = document.getElementById("linearDragHandle");
	const linearProjectSelect = document.getElementById("linearProjectSelect");
	const linearProjectApplyBtn = document.getElementById("linearProjectApply");
	const linearRefreshBtn = document.getElementById("linearRefresh");
	const linearProjectHeader = document.getElementById("linearProjectHeader");
	const linearStatus = document.getElementById("linearStatus");
	const linearEmpty = document.getElementById("linearEmpty");
	const linearTaskList = document.getElementById("linearTaskList");
	const linearStatsPanel = document.getElementById("linearStatsPanel");
	const linearViewBoardBtn = document.getElementById("linearViewBoard");
	const linearViewStatsBtn = document.getElementById("linearViewStats");
	const EXCALIDRAW_SCENE_MAX_BYTES = 200000;
	const EXCALIDRAW_EMPTY_SCENE =
		"{" +
		"\"elements\":[]," +
		"\"appState\":{}," +
		"\"files\":{}" +
		"}";
	let cursorOverlay = null;
	let cursorOverlayContent = null;
	const mainGrid = document.getElementById("mainGrid");
	const psPanel = document.getElementById("psPanel");
	const togglePersonalSpaceBtn = document.getElementById("togglePersonalSpace");
	const psCloseMobile = document.getElementById("psCloseMobile");
	const toggleHeaderBtn = document.getElementById("toggleHeader");
	const noteCloseMobile = document.getElementById("noteCloseMobile");
	const headerDetailEls = document.querySelectorAll(
		'[data-header-detail="true"]'
	);
	const tableMenuBtn = document.getElementById("tableMenuBtn");
	const tableModal = document.getElementById("tableModal");
	const tableModalBackdrop = document.querySelector(
		'[data-role="tableModalBackdrop"]'
	);
	const tableModalClose = document.getElementById("tableModalClose");
	const tableModalCancel = document.getElementById("tableModalCancel");
	const tableModalApply = document.getElementById("tableModalApply");
	const tableGridWrap = document.getElementById("tableGridWrap");
	const tableAddRowBtn = document.getElementById("tableAddRow");
	const tableDelRowBtn = document.getElementById("tableDelRow");
	const tableAddColBtn = document.getElementById("tableAddCol");
	const tableDelColBtn = document.getElementById("tableDelCol");
	const tableCalcScope = document.getElementById("tableCalcScope");
	const tableCalcIndex = document.getElementById("tableCalcIndex");
	const tableCalcSum = document.getElementById("tableCalcSum");
	const tableCalcAvg = document.getElementById("tableCalcAvg");
	const tableCalcMax = document.getElementById("tableCalcMax");
	const tableCalcMin = document.getElementById("tableCalcMin");
	const tableInsertSum = document.getElementById("tableInsertSum");
	const tableInsertAvg = document.getElementById("tableInsertAvg");
	const tableInsertMax = document.getElementById("tableInsertMax");
	const tableInsertMin = document.getElementById("tableInsertMin");
	const tableActiveCell = document.getElementById("tableActiveCell");

	// Personal Space elements (optional)
	const psUnauthed = document.getElementById("psUnauthed");
	const psAuthed = document.getElementById("psAuthed");
	const addPersonalSpaceBtn = document.getElementById("addPersonalSpace");
	const psDevLink = document.getElementById("psDevLink");
	const psEmail = document.getElementById("psEmail");
	const psToggleTags = document.getElementById("psToggleTags");
	const psTagControls = document.getElementById("psTagControls");
	const psTagsActiveInfo = document.getElementById("psTagsActiveInfo");
	const psTagsPanel = document.getElementById("psTagsPanel");
	const psTags = document.getElementById("psTags");
	const psTagFilterModeSelect = document.getElementById("psTagFilterMode");
	const psNewNote = document.getElementById("psNewNote");
	const psEditorTagsBar = document.getElementById("psEditorTagsBar");
	const psEditorTagsInput = document.getElementById("psEditorTagsInput");
	const psEditorYearTag = document.getElementById("psEditorYearTag");
	const psEditorMonthTag = document.getElementById("psEditorMonthTag");
	const psEditorCategoryTag = document.getElementById("psEditorCategoryTag");
	const psEditorSubcategoryTag = document.getElementById(
		"psEditorSubcategoryTag"
	);
	const psEditorTagsSuggest = document.getElementById("psEditorTagsSuggest");
	const psExportNotesBtn = document.getElementById("psExportNotes");
	const psImportModeSelect = document.getElementById("psImportMode");
	const psImportNotesBtn = document.getElementById("psImportNotes");
	const psImportFileInput = document.getElementById("psImportFile");
	const psAutoBackupEnabledInput = document.getElementById(
		"psAutoBackupEnabled"
	);
	const psAutoBackupIntervalInput = document.getElementById(
		"psAutoBackupInterval"
	);
	const psAutoBackupFolderBtn = document.getElementById("psAutoBackupFolder");
	const psAutoBackupFolderLabel = document.getElementById(
		"psAutoBackupFolderLabel"
	);
	const psAutoBackupStatus = document.getElementById("psAutoBackupStatus");
	const psAutoBackupUnsupported = document.getElementById(
		"psAutoBackupUnsupported"
	);
	const psAutoImportEnabledInput = document.getElementById(
		"psAutoImportEnabled"
	);
	const psAutoImportIntervalInput = document.getElementById(
		"psAutoImportInterval"
	);
	const psAutoImportFolderBtn = document.getElementById("psAutoImportFolder");
	const psAutoImportFolderLabel = document.getElementById(
		"psAutoImportFolderLabel"
	);
	const psAutoImportStatus = document.getElementById("psAutoImportStatus");
	const psAutoImportUnsupported = document.getElementById(
		"psAutoImportUnsupported"
	);
	const psCount = document.getElementById("psCount");
	const psSearchInput = document.getElementById("psSearch");
	const psPinnedToggle = document.getElementById("psPinnedToggle");
	const psCommentsToggle = document.getElementById("psCommentsToggle");
	const psSortMenuBtn = document.getElementById("psSortMenuBtn");
	const psSortMenu = document.getElementById("psSortMenu");
	const psList = document.getElementById("psList");
	const psHint = document.getElementById("psHint");
	const psTransferHint = document.getElementById("psTransferHint");
	const psLogout = document.getElementById("psLogout");
	const psSaveMain = document.getElementById("psSaveMain");
	const psMainHint = document.getElementById("psMainHint");
	const psAutoSaveStatus = document.getElementById("psAutoSaveStatus");
	const psMetaYaml = document.getElementById("psMetaYaml");
	const psMetaToggle = document.getElementById("psMetaToggle");
	const psNavBackBtn = document.getElementById("psNavBack");
	const psNavForwardBtn = document.getElementById("psNavForward");
	const psSettingsBtn = document.getElementById("psSettingsBtn");
	const psContextMenu = document.getElementById("psContextMenu");
	const psContextSelect = document.getElementById("psContextSelect");
	const psContextSelectLabel = document.querySelector(
		"[data-role=\"psContextSelectLabel\"]"
	);
	const psContextSelectAll = document.getElementById("psContextSelectAll");
	const psContextClear = document.getElementById("psContextClear");
	const psContextTags = document.getElementById("psContextTags");
	const psContextShare = document.getElementById("psContextShare");
	const psContextDelete = document.getElementById("psContextDelete");
	const psTagContextMenu = document.getElementById("psTagContextMenu");
	const psTagContextLabel = document.getElementById("psTagContextLabel");
	const psTagContextInput = document.getElementById("psTagContextInput");
	const psTagContextApply = document.getElementById("psTagContextApply");
	const psTagContextDelete = document.getElementById("psTagContextDelete");
	const settingsRoot = document.getElementById("settingsRoot");
	const settingsBackdrop = document.getElementById("settingsBackdrop");
	const settingsPanel = document.getElementById("settingsPanel");
	const settingsClose = document.getElementById("settingsClose");
	const settingsNavButtons = document.querySelectorAll("[data-settings-nav]");
	const settingsSections = document.querySelectorAll("[data-settings-section]");
	const settingsThemeList = document.getElementById("settingsThemeList");
	const settingsGlowToggle = document.getElementById("settingsGlowToggle");
	const taskAutoSortToggle = document.getElementById("taskAutoSort");
	const settingsDateFormatSelect = document.getElementById("settingsDateFormat");
	const settingsTimeFormatSelect = document.getElementById("settingsTimeFormat");
	const mobileAutoNoteSecondsInput = document.getElementById(
		"mobileAutoNoteSeconds"
	);
	const aiApiKeyInput = document.getElementById("aiApiKey");
	const aiApiModelInput = document.getElementById("aiApiModel");
	const aiApiSaveBtn = document.getElementById("aiApiSave");
	const aiApiClearBtn = document.getElementById("aiApiClear");
	const aiApiStatus = document.getElementById("aiApiStatus");
	const linearApiKeyInput = document.getElementById("linearApiKey");
	const linearApiSaveBtn = document.getElementById("linearApiSave");
	const linearApiClearBtn = document.getElementById("linearApiClear");
	const linearLoadProjectsBtn = document.getElementById("linearLoadProjects");
	const linearProjectsList = document.getElementById("linearProjectsList");
	const linearProjectsEmpty = document.getElementById("linearProjectsEmpty");
	const linearApiStatus = document.getElementById("linearApiStatus");
	const bflApiKeyInput = document.getElementById("bflApiKey");
	const bflApiSaveBtn = document.getElementById("bflApiSave");
	const bflApiClearBtn = document.getElementById("bflApiClear");
	const bflApiStatus = document.getElementById("bflApiStatus");
	const faqSearchInput = document.getElementById("faqSearch");
	const faqList = document.getElementById("faqList");
	const favoritesManageList = document.getElementById("favoritesManageList");
	const favoritesManageEmpty = document.getElementById("favoritesManageEmpty");
	const sharedRoomsManageList = document.getElementById("sharedRoomsManageList");
	const sharedRoomsManageEmpty = document.getElementById(
		"sharedRoomsManageEmpty"
	);
	const sharedRoomsFilterInput = document.getElementById("sharedRoomsFilter");
	const sharedRoomsClearBtn = document.getElementById("sharedRoomsClear");
	const uploadsRefreshBtn = document.getElementById("uploadsRefresh");
	const uploadsManageList = document.getElementById("uploadsManageList");
	const uploadsManageEmpty = document.getElementById("uploadsManageEmpty");
	const uiLangDeBtn = document.getElementById("uiLangDe");
	const uiLangEnBtn = document.getElementById("uiLangEn");
	const trashRefreshBtn = document.getElementById("trashRefresh");
	const trashManageList = document.getElementById("trashManageList");
	const trashManageEmpty = document.getElementById("trashManageEmpty");
	const calendarDefaultViewSelect = document.getElementById("calendarDefaultView");
	const calendarSourcesList = document.getElementById("calendarSourcesList");
	const calendarSourcesEmpty = document.getElementById("calendarSourcesEmpty");
	const calendarAddName = document.getElementById("calendarAddName");
	const calendarAddUrl = document.getElementById("calendarAddUrl");
	const calendarAddColor = document.getElementById("calendarAddColor");
	const calendarAddEnabled = document.getElementById("calendarAddEnabled");
	const calendarAddBtn = document.getElementById("calendarAddBtn");
	const calendarPanel = document.getElementById("calendarPanel");
	const calendarWeekLabel = document.getElementById("calendarWeekLabel");
	const calendarTitle = document.getElementById("calendarTitle");
	const calendarGrid = document.getElementById("calendarGrid");
	const calendarLegend = document.getElementById("calendarLegend");
	const calendarStatus = document.getElementById("calendarStatus");
	const calendarLayout = document.getElementById("calendarLayout");
	const calendarSidebar = document.getElementById("calendarSidebar");
	const calendarSidebarToggle = document.getElementById("calendarSidebarToggle");
	const calendarPrevBtn = document.getElementById("calendarPrev");
	const calendarNextBtn = document.getElementById("calendarNext");
	const calendarTodayBtn = document.getElementById("calendarToday");
	const calendarRefreshBtn = document.getElementById("calendarRefresh");
	const calendarOpenSettingsBtn = document.getElementById("calendarOpenSettings");
	const calendarFreeToggle = document.getElementById("calendarFreeToggle");
	const calendarFreeSlotsWrap = document.getElementById("calendarFreeSlotsWrap");
	const calendarFreeSlots = document.getElementById("calendarFreeSlots");
	const calendarMySelectionsWrap = document.getElementById("calendarMySelectionsWrap");
	const calendarMySelections = document.getElementById("calendarMySelections");
	const calendarMySelectionsCount = document.getElementById("calendarMySelectionsCount");
	const calendarCommonFreeSlotsWrap = document.getElementById("calendarCommonFreeSlotsWrap");
	const calendarCommonFreeToggle = document.getElementById("calendarCommonFreeToggle");
	const calendarCommonFreeParticipants = document.getElementById("calendarCommonFreeParticipants");
	const calendarCommonFreeSlots = document.getElementById("calendarCommonFreeSlots");
	const calendarAddEventBtn = document.getElementById("calendarAddEvent");
	const calendarGoogleStatus = document.getElementById("calendarGoogleStatus");
	const calendarGoogleSelect = document.getElementById("calendarGoogleSelect");
	const calendarGoogleConnect = document.getElementById("calendarGoogleConnect");
	const calendarGoogleDisconnect = document.getElementById(
		"calendarGoogleDisconnect"
	);
	const calendarOutlookStatus = document.getElementById("calendarOutlookStatus");
	const calendarOutlookSelect = document.getElementById("calendarOutlookSelect");
	const calendarOutlookConnect = document.getElementById("calendarOutlookConnect");
	const calendarOutlookDisconnect = document.getElementById(
		"calendarOutlookDisconnect"
	);
	const calendarViewButtons = document.querySelectorAll("[data-calendar-view]");
	const calendarLocalEventsList = document.getElementById("calendarLocalEventsList");
	const calendarLocalEventsEmpty = document.getElementById("calendarLocalEventsEmpty");
	const calendarEventModal = document.getElementById("calendarEventModal");
	const calendarEventClose = document.getElementById("calendarEventClose");
	const calendarEventCancel = document.getElementById("calendarEventCancel");
	const calendarEventSave = document.getElementById("calendarEventSave");
	const calendarEventName = document.getElementById("calendarEventName");
	const calendarEventDate = document.getElementById("calendarEventDate");
	const calendarEventAllDay = document.getElementById("calendarEventAllDay");
	const calendarEventStart = document.getElementById("calendarEventStart");
	const calendarEventEnd = document.getElementById("calendarEventEnd");
	const calendarEventLocation = document.getElementById("calendarEventLocation");
	const calendarEventSyncTarget = document.getElementById(
		"calendarEventSyncTarget"
	);
	const calendarEventBackdrop = document.querySelector(
		"[data-role=\"calendarEventBackdrop\"]"
	);
	const psUserAuthed = document.getElementById("psUserAuthed");
	const psUserUnauthed = document.getElementById("psUserUnauthed");
	const bgBlobTop = document.getElementById("bgBlobTop");
	const bgBlobBottom = document.getElementById("bgBlobBottom");

	const SCROLLBAR_REVEAL_MS = 800;

	function attachScrollbarReveal(el) {
		if (!el || !el.addEventListener) return;
		let hideTimer = null;
		const show = () => {
			el.classList.add("scrollbar-active");
			if (hideTimer) window.clearTimeout(hideTimer);
			hideTimer = window.setTimeout(() => {
				el.classList.remove("scrollbar-active");
			}, SCROLLBAR_REVEAL_MS);
		};
		["scroll", "wheel", "touchmove"].forEach((evt) => {
			el.addEventListener(evt, show, { passive: true });
		});
	}

	function setupScrollbarReveal() {
		attachScrollbarReveal(psList);
		attachScrollbarReveal(textarea);
	}

	const params = new URLSearchParams(location.search);
	const defaultWsUrl =
		(location.protocol === "https:" ? "wss:" : "ws:") +
		"//" +
		location.host +
		"/ws";
	// Override möglich: ?ws=wss://example.com/ws
	const wsBaseUrl = params.get("ws") || defaultWsUrl;
	const debug = params.get("debug") === "1";
	const pyodideBaseOverrideRaw =
		params.get("pyodide") || params.get("pyodideBase") || "";

	function normalizeBaseUrl(raw) {
		const v = String(raw || "").trim();
		if (!v) return "";
		return v.endsWith("/") ? v : v + "/";
	}

	let skipStartupTabRestore = null;

	function maybeApplyStartupFavoriteFromPs() {
		if (startupApplied) return;
		const favs = dedupeFavorites(loadFavorites());
		const startupFav = favs.find((f) => f.isStartup);
		if (!startupFav) {
			if (autoSelectedRoom) {
				const tabs = dedupeRoomTabs(loadRoomTabs());
				const exists = tabs.some(
					(t) =>
						t.room === autoSelectedRoomName && t.key === autoSelectedKey
				);
				if (!exists) {
					touchRoomTab(autoSelectedRoomName, autoSelectedKey, {
						skipSync: true,
					});
					renderRoomTabs();
				}
				autoSelectedRoom = false;
				try {
					localStorage.removeItem(AUTO_ROOM_KEY);
				} catch {
					// ignore
				}
			}
			return;
		}
		let storedAutoRoom = "";
		let storedAutoKey = "";
		try {
			const raw = localStorage.getItem(AUTO_ROOM_KEY);
			const parsed = raw ? JSON.parse(raw) : null;
			storedAutoRoom = normalizeRoom(parsed && parsed.room);
			storedAutoKey = normalizeKey(parsed && parsed.key);
		} catch {
			storedAutoRoom = "";
			storedAutoKey = "";
		}
		const current = parseRoomAndKeyFromHash();
		if (current.room === startupFav.room && current.key === startupFav.key) {
			startupApplied = true;
			autoSelectedRoom = false;
			try {
				localStorage.removeItem(AUTO_ROOM_KEY);
			} catch {
				// ignore
			}
			return;
		}
		const currentRoom = current.room;
		const currentKey = current.key;
		const isCurrentFavorite =
			findFavoriteIndex(currentRoom, currentKey) >= 0;
		if (currentRoom && !isCurrentFavorite) {
			const tabs = dedupeRoomTabs(loadRoomTabs());
			const nextTabs = tabs.filter(
				(t) => !(t.room === currentRoom && t.key === currentKey)
			);
			if (nextTabs.length !== tabs.length) {
				saveRoomTabs(nextTabs);
				removeRoomTabFromState(currentRoom, currentKey);
				removeNoteRoomBindingByRoom(currentRoom, currentKey);
				renderRoomTabs();
				if (psState && psState.authed) {
					api("/api/room-tabs", {
						method: "DELETE",
						body: JSON.stringify({
							room: currentRoom,
							key: currentKey,
						}),
					}).catch(() => {
						// ignore
					});
				}
			}
		}
		const storedAutoIsFavorite =
			findFavoriteIndex(storedAutoRoom, storedAutoKey) >= 0;
		if (storedAutoRoom && !storedAutoIsFavorite) {
			const tabs = dedupeRoomTabs(loadRoomTabs());
			const nextTabs = tabs.filter(
				(t) => !(t.room === storedAutoRoom && t.key === storedAutoKey)
			);
			if (nextTabs.length !== tabs.length) {
				saveRoomTabs(nextTabs);
				removeRoomTabFromState(storedAutoRoom, storedAutoKey);
				removeNoteRoomBindingByRoom(storedAutoRoom, storedAutoKey);
				renderRoomTabs();
				if (psState && psState.authed) {
					api("/api/room-tabs", {
						method: "DELETE",
						body: JSON.stringify({
							room: storedAutoRoom,
							key: storedAutoKey,
						}),
					}).catch(() => {
						// ignore
					});
				}
			}
		}
		const autoRoomRegex =
			/^(Dark|Kubernetes|Kubernetics|Byte|Hack|Code|Pixel|Nerd|Retro|Quantum|Dungeon|Terminal|Matrix|Syntax|Kernel|Cache|Compile|Docker|Git|Linux|Neon|Vector)Room\d{3}$/;
		const tabs = dedupeRoomTabs(loadRoomTabs());
		const removedTabs = tabs.filter((t) => {
			if (!autoRoomRegex.test(String(t.room || ""))) return false;
			if (t.room === startupFav.room && t.key === startupFav.key) return false;
			if (findFavoriteIndex(t.room, t.key) >= 0) return false;
			return true;
		});
		if (removedTabs.length) {
			const keepTabs = tabs.filter(
				(t) =>
					!removedTabs.some(
						(r) => r.room === t.room && r.key === t.key
					)
			);
			saveRoomTabs(keepTabs);
			for (const t of removedTabs) {
				removeRoomTabFromState(t.room, t.key);
				removeNoteRoomBindingByRoom(t.room, t.key);
				if (psState && psState.authed) {
					api("/api/room-tabs", {
						method: "DELETE",
						body: JSON.stringify({ room: t.room, key: t.key }),
					}).catch(() => {
						// ignore
					});
				}
			}
			renderRoomTabs();
		}
		if (currentRoom) {
			skipStartupTabRestore = { room: currentRoom, key: currentKey };
		}
		startupApplied = true;
		autoSelectedRoom = false;
		try {
			localStorage.removeItem(AUTO_ROOM_KEY);
		} catch {
			// ignore
		}
		location.hash = buildShareHash(startupFav.room, startupFav.key);
	}

	const pyodideBaseOverride = normalizeBaseUrl(pyodideBaseOverrideRaw);
	const PYODIDE_BASE_URLS = [
		pyodideBaseOverride,
		"https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
		"https://pyodide-cdn2.iodide.io/v0.25.1/full/",
	].filter(Boolean);

	function tryRenderSharedNote() {
		const sp = new URLSearchParams(location.search || "");
		if (sp.get("shareNote") !== "1") return false;
		const title = String(sp.get("title") || "Shared note");
		const rawHash = String(location.hash || "");
		const hash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
		const hsp = new URLSearchParams(hash);
		const data = String(hsp.get("data") || "");
		let text = "";
		if (data) {
			try {
				const bytes = base64UrlDecode(data);
				text = textDecoder.decode(bytes);
			} catch {
				text = "";
			}
		}
		const html = buildNoteShareHtmlDocument(text, title);
		try {
			document.open();
			document.write(html);
			document.close();
		} catch {
			// ignore
		}
		return true;
	}

	if (tryRenderSharedNote()) return;

	let pdfJsPreloadPromise = null;
	function ensurePdfJsLoaded() {
		if (pdfJsPreloadPromise) return pdfJsPreloadPromise;
		pdfJsPreloadPromise = import("/vendor/pdfjs/pdf.mjs")
			.then((pdfjsLib) => {
				window.pdfjsLib = pdfjsLib;
				if (window.pdfjsLib) {
					window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.mjs";
				}
				return pdfjsLib;
			})
			.catch(() => null);
		window.__pdfjsReady = pdfJsPreloadPromise;
		return pdfJsPreloadPromise;
	}

	const pdfPreviewDocCache = new Map();
	async function getPdfPreviewDoc(src) {
		const key = String(src || "").trim();
		if (!key) return null;
		if (pdfPreviewDocCache.has(key)) return pdfPreviewDocCache.get(key);
		const lib = await ensurePdfJsLoaded();
		if (!lib || !lib.getDocument) return null;
		try {
			const task = lib.getDocument(key);
			const promise = task && task.promise ? task.promise : Promise.resolve(null);
			pdfPreviewDocCache.set(key, promise);
			return promise;
		} catch {
			return null;
		}
	}

	async function renderPdfPreviewPage(src, pageNum) {
		const lib = await ensurePdfJsLoaded();
		if (!lib) return null;
		const doc = await getPdfPreviewDoc(src);
		if (!doc || !doc.getPage) return null;
		const total = Number(doc.numPages || 1);
		const pageIndex = Math.min(Math.max(1, Number(pageNum || 1)), total);
		const page = await doc.getPage(pageIndex);
		const viewport = page.getViewport({ scale: 1.2 });
		const canvas = document.createElement("canvas");
		canvas.width = viewport.width;
		canvas.height = viewport.height;
		const ctx = canvas.getContext("2d");
		await page.render({ canvasContext: ctx, viewport }).promise;
		const dataUrl = canvas.toDataURL("image/png");
		return {
			dataUrl,
			page: pageIndex,
			pages: total,
			width: canvas.width,
			height: canvas.height,
		};
	}

	function createClientId() {
		const base = crypto.randomUUID
			? crypto.randomUUID()
			: String(Math.random()).slice(2);
		return `${base}-${Date.now().toString(36)}`;
	}

	const tabId = createClientId();
	let clientId = createClientId();
	const clientIdChannel =
		typeof BroadcastChannel !== "undefined"
			? new BroadcastChannel("mirror-client-id")
			: null;

	function announceClientId() {
		if (!clientIdChannel) return;
		try {
			clientIdChannel.postMessage({ type: "client_id", clientId, sender: tabId });
		} catch {
			// ignore
		}
	}

	if (clientIdChannel) {
		clientIdChannel.addEventListener("message", (ev) => {
			const data = ev && ev.data ? ev.data : null;
			if (!data || data.type !== "client_id") return;
			if (data.sender && data.sender === tabId) return;
			if (data.clientId !== clientId) return;
			clientId = createClientId();
			announceClientId();
			connect();
		});
	}

	announceClientId();

	const IDENTITY_KEY = "mirror_identity_v1";

	function randomIdentity() {
		const adjectives = [
			"Nebula",
			"Pixel",
			"Silent",
			"Neon",
			"Cosmic",
			"Swift",
			"Electric",
			"Shadow",
			"Arctic",
			"Crimson",
			"Golden",
			"Cobalt",
			"Sienna",
			"Mint",
			"Quartz",
			"Velvet",
		];
		const nouns = [
			"Fox",
			"Otter",
			"Hawk",
			"Lynx",
			"Panda",
			"Falcon",
			"Raven",
			"Tiger",
			"Wolf",
			"Koala",
			"Badger",
			"Orca",
			"Moose",
			"Heron",
			"Geko",
			"Stag",
		];
		const avatars = [
			"🦊",
			"🦦",
			"🦅",
			"🐾",
			"🐼",
			"🦉",
			"🐺",
			"🦄",
			"🐯",
			"🐨",
			"🦝",
			"🐬",
			"🫎",
			"🦩",
			"🦎",
			"🦌",
		];
		const colors = [
			"#38bdf8",
			"#a78bfa",
			"#f472b6",
			"#22d3ee",
			"#f59e0b",
			"#34d399",
			"#e879f9",
			"#60a5fa",
			"#fb7185",
			"#c084fc",
			"#f97316",
			"#2dd4bf",
			"#facc15",
			"#4ade80",
			"#a3e635",
			"#818cf8",
		];
		const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
		const avatar = avatars[Math.floor(Math.random() * avatars.length)];
		const color = colors[Math.floor(Math.random() * colors.length)];
		return { name, avatar, color };
	}

	function loadIdentity() {
		try {
			const raw = localStorage.getItem(IDENTITY_KEY);
			if (!raw) return null;
			const parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== "object") return null;
			const name = String(parsed.name || "").trim();
			const avatar = String(parsed.avatar || "").trim();
			const color = String(parsed.color || "").trim();
			if (!name || !avatar || !color) return null;
			return { name, avatar, color };
		} catch {
			return null;
		}
	}

	function saveIdentity(identity) {
		try {
			localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
		} catch {
			// ignore
		}
	}

	const identity = (() => {
		const existing = loadIdentity();
		if (existing) return existing;
		const fresh = randomIdentity();
		saveIdentity(fresh);
		return fresh;
	})();

	function normalizeRoom(raw) {
		return String(raw || "")
			.trim()
			.replace(/^#/, "")
			.replace(/^room=/, "")
			.replace(/[^a-zA-Z0-9_-]/g, "")
			.slice(0, 40);
	}

	function normalizeKey(raw) {
		return String(raw || "")
			.trim()
			.replace(/^#/, "")
			.replace(/^key=/, "")
			.replace(/[^a-zA-Z0-9_-]/g, "")
			.slice(0, 64);
	}

	function parseRoomAndKeyFromHash() {
		const raw = String(location.hash || "");
		const hash = raw.startsWith("#") ? raw.slice(1) : raw;
		if (!hash) return { room: "", key: "" };

		// Unterstützt:
		// - #room=ABC
		// - #room=ABC&key=SECRET
		// - #ABC (fallback)
		if (!hash.includes("=")) {
			return { room: normalizeRoom(hash), key: "" };
		}
		const sp = new URLSearchParams(hash);
		return {
			room: normalizeRoom(sp.get("room")),
			key: normalizeKey(sp.get("key")),
		};
	}

	function buildShareHash(roomName, keyName) {
		const sp = new URLSearchParams();
		sp.set("room", roomName);
		if (keyName) sp.set("key", keyName);
		return "#" + sp.toString();
	}

	function randomKey() {
		try {
			const bytes = new Uint8Array(16);
			crypto.getRandomValues(bytes);
			let bin = "";
			for (const b of bytes) bin += String.fromCharCode(b);
			const b64 = btoa(bin)
				.replace(/\+/g, "-")
				.replace(/\//g, "_")
				.replace(/=+$/g, "");
			return normalizeKey(b64);
		} catch {
			return normalizeKey(String(Math.random()).slice(2));
		}
	}

	const textEncoder = new TextEncoder();
	const textDecoder = new TextDecoder();
	let e2eeKeyPromise = null;
	let e2eeKeySeed = "";

	function resetE2eeKeyCache() {
		e2eeKeyPromise = null;
		e2eeKeySeed = "";
	}

	function base64UrlEncode(input) {
		const bytes =
			input instanceof Uint8Array ? input : new Uint8Array(input || []);
		let bin = "";
		for (const b of bytes) bin += String.fromCharCode(b);
		return btoa(bin)
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/g, "");
	}

	function base64UrlDecode(input) {
		const raw = String(input || "")
			.replace(/-/g, "+")
			.replace(/_/g, "/");
		const padLen = (4 - (raw.length % 4)) % 4;
		const padded = raw + "=".repeat(padLen);
		const bin = atob(padded);
		const out = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i += 1) {
			out[i] = bin.charCodeAt(i);
		}
		return out;
	}

	function base64EncodeBytes(bytes) {
		const input = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
		let bin = "";
		for (let i = 0; i < input.length; i += 1) {
			bin += String.fromCharCode(input[i]);
		}
		return btoa(bin);
	}

	function base64DecodeBytes(input) {
		const raw = String(input || "");
		const bin = atob(raw);
		const out = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i += 1) {
			out[i] = bin.charCodeAt(i);
		}
		return out;
	}

	async function getE2eeKey() {
		const seed = String(key || "");
		if (!seed) return null;
		if (e2eeKeyPromise && e2eeKeySeed === seed) return e2eeKeyPromise;
		e2eeKeySeed = seed;
		e2eeKeyPromise = crypto.subtle
			.digest("SHA-256", textEncoder.encode(seed))
			.then((hash) =>
				crypto.subtle.importKey("raw", hash, "AES-GCM", false, [
					"encrypt",
					"decrypt",
				])
			);
		return e2eeKeyPromise;
	}

	async function encryptForRoom(plainText) {
		const encKey = await getE2eeKey();
		if (!encKey) return { mode: "plain", text: plainText };
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const cipher = await crypto.subtle.encrypt(
			{ name: "AES-GCM", iv },
			encKey,
			textEncoder.encode(String(plainText ?? ""))
		);
		return {
			mode: "e2ee",
			ciphertext: base64UrlEncode(cipher),
			iv: base64UrlEncode(iv),
		};
	}

	async function decryptForRoom(ciphertext, iv) {
		const encKey = await getE2eeKey();
		if (!encKey) return null;
		const ivBytes = base64UrlDecode(iv);
		const cipherBytes = base64UrlDecode(ciphertext);
		const plain = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv: ivBytes },
			encKey,
			cipherBytes
		);
		return textDecoder.decode(plain);
	}

	function toast(message, kind) {
		if (!toastRoot) return;
		const el = document.createElement("div");
		const base =
			"pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-soft backdrop-blur";
		const colors =
			kind === "error"
				? "border-rose-400/30 bg-rose-500/10 text-rose-100"
				: kind === "success"
				? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
				: "border-white/10 bg-white/10 text-slate-100";
		el.className = `${base} ${colors}`;
		el.textContent = message;
		toastRoot.appendChild(el);
		window.setTimeout(() => {
			el.style.opacity = "0";
			el.style.transition = "opacity 220ms ease";
			window.setTimeout(() => el.remove(), 260);
		}, 1400);
	}

	async function loadBuildStamp() {
		if (!buildStamp) return;
		try {
			const res = await fetch("/gitstamp.txt", { cache: "no-store" });
			if (!res.ok) return;
			const raw = String(await res.text());
			const line = raw.split(/\r?\n/)[0] || "";
			const parts = line.trim().split(/\s+/);
			if (parts.length < 2) return;
			// Detect format: "date sha" (2 parts) or "date time sha" (3+ parts)
			const hasTime = parts.length >= 3 && parts[1].includes(":");
			const sha = parts[parts.length - 1];
			const datePart = String(parts[0] || "");
			const timePart = hasTime ? String(parts[1] || "") : "";
			// Anzeige ohne Zeitzone: nur Uhrzeit (hh:mm)
			let hm = "";
			if (timePart && timePart.includes(":")) {
				hm = timePart.split(":").slice(0, 2).join(":");
			}
			let shortDate = "";
			const dateParts = datePart.split("-");
			if (dateParts.length === 3) {
				shortDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0].slice(
					-2
				)}`;
			}
			const formattedTs = shortDate && hm ? `${shortDate} ${hm}` : shortDate;
			const shortSha = sha ? sha.slice(0, 7) : "";
			// Subtil: kurze Anzeige, volle Infos im Tooltip.
			buildStamp.textContent =
				shortSha && formattedTs ? `${shortSha} - ${formattedTs}` : shortSha;
			buildStamp.title = line.trim();
		} catch {
			// ignore
		}
	}

	/* ── Sync-Timestamp im Settings-Header aktualisieren ── */
	function updateSyncStamp() {
		if (!syncStamp) return;
		const now = new Date();
		const hh = String(now.getHours()).padStart(2, "0");
		const mm = String(now.getMinutes()).padStart(2, "0");
		const dd = String(now.getDate()).padStart(2, "0");
		const mo = String(now.getMonth() + 1).padStart(2, "0");
		const yy = String(now.getFullYear()).slice(-2);
		syncStamp.textContent = `\u21BB ${dd}.${mo}.${yy} ${hh}:${mm}`;
		syncStamp.title = `Last sync: ${now.toLocaleString()}`;
	}

	let modalBusy = false;
	function isModalReady() {
		return (
			modalRoot &&
			modalTitle &&
			modalDesc &&
			modalCancel &&
			modalOk &&
			modalInputWrap &&
			modalInput
		);
	}

	function setModalOpen(open) {
		if (!modalRoot || !modalRoot.classList) return;
		modalRoot.classList.toggle("hidden", !open);
		modalRoot.classList.toggle("flex", open);
		modalRoot.setAttribute("aria-hidden", open ? "false" : "true");
		try {
			document.body.style.overflow = open ? "hidden" : "";
		} catch {
			// ignore
		}
	}

	function openModal(opts) {
		if (!isModalReady() || modalBusy) {
			return Promise.resolve({ ok: false, value: "" });
		}
		modalBusy = true;
		const title = String((opts && opts.title) || "Modal");
		const message = String((opts && opts.message) || "");
		const okText = String((opts && opts.okText) || "OK");
		const cancelText = String((opts && opts.cancelText) || "Cancel");
		const danger = Boolean(opts && opts.danger);
		const input = opts && opts.input ? opts.input : null;
		const allowBackdropClose = Boolean(opts && opts.backdropClose);

		modalTitle.textContent = title;
		modalDesc.textContent = message;
		modalOk.textContent = okText;
		modalCancel.textContent = cancelText;
		modalOk.classList.toggle("border-rose-400/30", danger);
		modalOk.classList.toggle("bg-rose-500/15", danger);
		modalOk.classList.toggle("text-rose-100", danger);

		if (input) {
			modalInputWrap.classList.remove("hidden");
			modalInput.type = String(input.type || "text");
			modalInput.placeholder = String(input.placeholder || "");
			modalInput.value = String(input.value || "");
			if (input.autocomplete) {
				modalInput.setAttribute("autocomplete", String(input.autocomplete));
			} else {
				modalInput.setAttribute("autocomplete", "off");
			}
		} else {
			modalInputWrap.classList.add("hidden");
			modalInput.value = "";
		}

		setModalOpen(true);

		const prevActive = document.activeElement;
		window.setTimeout(() => {
			try {
				if (input) modalInput.focus();
				else modalOk.focus();
			} catch {
				// ignore
			}
		}, 0);

		return new Promise((resolve) => {
			let settled = false;

			function cleanup() {
				if (settled) return;
				settled = true;
				setModalOpen(false);
				modalBusy = false;
				window.removeEventListener("keydown", onKeyDown, true);
				if (modalCancel) modalCancel.removeEventListener("click", onCancel);
				if (modalOk) modalOk.removeEventListener("click", onOk);
				if (modalClose) modalClose.removeEventListener("click", onCancel);
				if (modalBackdrop)
					modalBackdrop.removeEventListener("click", onBackdropClick);
				if (modalInput) modalInput.removeEventListener("keydown", onInputKey);
				try {
					if (prevActive && prevActive.focus) prevActive.focus();
				} catch {
					// ignore
				}
			}

			function finish(ok) {
				const value = input ? String(modalInput.value || "") : "";
				cleanup();
				resolve({ ok: Boolean(ok), value });
			}

			function onCancel() {
				finish(false);
			}
			function onOk() {
				finish(true);
			}
			function onBackdropClick() {
				if (!allowBackdropClose) return;
				finish(false);
			}
			function onInputKey(ev) {
				if (!ev) return;
				if (ev.key === "Enter") {
					ev.preventDefault();
					finish(true);
				}
			}
			function onKeyDown(ev) {
				if (!ev) return;
				if (ev.key === "Escape") {
					ev.preventDefault();
					finish(false);
				}
			}

			modalCancel.addEventListener("click", onCancel);
			modalOk.addEventListener("click", onOk);
			if (modalClose) modalClose.addEventListener("click", onCancel);
			if (modalBackdrop)
				modalBackdrop.addEventListener("click", onBackdropClick);
			if (modalInput) modalInput.addEventListener("keydown", onInputKey);
			window.addEventListener("keydown", onKeyDown, true);
		});
	}

	async function modalConfirm(message, opts) {
		const res = await openModal({
			title: (opts && opts.title) || "Confirm",
			message: String(message || ""),
			okText: (opts && opts.okText) || "OK",
			cancelText: (opts && opts.cancelText) || "Cancel",
			danger: Boolean(opts && opts.danger),
			backdropClose: Boolean(opts && opts.backdropClose),
		});
		return Boolean(res && res.ok);
	}

	async function modalPrompt(message, opts) {
		const res = await openModal({
			title: (opts && opts.title) || "Input",
			message: String(message || ""),
			okText: (opts && opts.okText) || "Continue",
			cancelText: (opts && opts.cancelText) || "Cancel",
			backdropClose: Boolean(opts && opts.backdropClose),
			input: {
				type: (opts && opts.type) || "text",
				placeholder: (opts && opts.placeholder) || "",
				value: (opts && opts.value) || "",
				autocomplete: (opts && opts.autocomplete) || "off",
			},
		});
		if (!res || !res.ok) return null;
		return String(res.value || "");
	}

	let shareModalMode = "private";
	function isShareModalReady() {
		return (
			shareModal &&
			shareModeSelect &&
			shareModalLink &&
			shareModalCopy &&
			shareModalQr &&
			shareModalMail &&
			shareModalOpen
		);
	}

	function setShareModalOpen(open) {
		if (!shareModal || !shareModal.classList) return;
		shareModal.classList.toggle("hidden", !open);
		shareModal.classList.toggle("flex", open);
		shareModal.setAttribute("aria-hidden", open ? "false" : "true");
		try {
			document.body.style.overflow = open ? "hidden" : "";
		} catch {
			// ignore
		}
	}

	function buildQrUrl(value) {
		const data = encodeURIComponent(String(value || ""));
		return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${data}`;
	}

	function updateShareModalLink() {
		if (!isShareModalReady()) return;
		const usePublic = shareModalMode === "public";
		const shareKey = usePublic ? "" : key;
		const href = buildShareHref(room, shareKey) || location.href;
		shareModalLink.value = href;
		shareModalOpen.href = href;
		shareModalMail.href = `mailto:?subject=${encodeURIComponent(
			"Mirror Link"
		)}&body=${encodeURIComponent(href)}`;
		shareModalQr.src = buildQrUrl(href);
		if (shareModalShare) {
			const canShare = typeof navigator !== "undefined" && navigator.share;
			shareModalShare.classList.toggle("hidden", !canShare);
		}
	}

	function markCurrentRoomShared() {
		if (!room) return false;
		const roomKey = `${normalizeRoom(room)}:${normalizeKey(key)}`;
		manuallyUnsharedRooms.delete(roomKey);
		const marked = markRoomShared(room, key, { manual: true });
		if (marked) renderRoomTabs();
		return marked;
	}

	function openShareModal() {
		if (!isShareModalReady()) return;
		shareModalMode = key ? "private" : "public";
		shareModeSelect.value = shareModalMode;
		updateShareModalLink();
		setShareModalOpen(true);
		window.setTimeout(() => {
			try {
				shareModeSelect.focus();
			} catch {
				// ignore
			}
		}, 0);
	}

	let noteSharePayload = null;
	let noteShareModalShareUrl = "";
	const NOTE_SHARE_QR_MAX_CHARS = 900;
	const NOTE_SHARE_URL_MAX_CHARS = 1800;
	function isNoteShareModalReady() {
		return (
			noteShareModal &&
			noteShareModalTitle &&
			noteShareModalMeta &&
			noteShareModalText &&
			noteShareModalCopy &&
			noteShareModalQr &&
			noteShareModalMail &&
			noteShareModalOpen
		);
	}

	function revokeNoteShareShareUrl() {
		noteShareModalShareUrl = "";
	}

	function buildNoteShareHtmlDocument(text, title) {
		const safeTitle = escapeHtml(String(title || "Mirror Notiz"));
		const safeBody = escapeHtml(String(text || ""));
		return `<!doctype html>
<html lang="de">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>${safeTitle}</title>
	<style>
		:root { color-scheme: light dark; }
		body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif; margin: 24px; }
		h1 { font-size: 20px; margin: 0 0 12px; }
		pre { white-space: pre-wrap; word-break: break-word; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; background: rgba(0,0,0,.04); padding: 12px; border-radius: 8px; }
	</style>
</head>
<body>
	<h1>${safeTitle}</h1>
	<pre>${safeBody}</pre>
</body>
</html>`;
	}

	function setNoteShareModalOpen(open) {
		if (!noteShareModal || !noteShareModal.classList) return;
		noteShareModal.classList.toggle("hidden", !open);
		noteShareModal.classList.toggle("flex", open);
		noteShareModal.setAttribute("aria-hidden", open ? "false" : "true");
		if (!open) revokeNoteShareShareUrl();
		try {
			document.body.style.overflow = open ? "hidden" : "";
		} catch {
			// ignore
		}
	}

	function buildNoteSharePayloadFromIds(noteIds) {
		const ids = Array.isArray(noteIds) ? noteIds : [];
		const notes = ids
			.map((id) => findNoteById(id))
			.filter((n) => n && n.id);
		if (!notes.length) return null;
		if (notes.length === 1) {
			const note = notes[0];
			const text = String(note.text || "");
			const title = getNoteTitle(text);
			return { title, text, count: 1 };
		}
		const blocks = notes.map((note, idx) => {
			const text = String(note.text || "").trim();
			if (text) return text;
			const fallbackTitle = getNoteTitle(String(note.text || ""));
			return fallbackTitle ? `# ${fallbackTitle}` : `# Note ${idx + 1}`;
		});
		return {
			title: `Mirror Notes (${notes.length})`,
			text: blocks.join("\n\n---\n\n"),
			count: notes.length,
		};
	}

	function buildNoteShareUrl(payload) {
		const text = String(payload && payload.text ? payload.text : "");
		if (!text) return "";
		const title = String(payload && payload.title ? payload.title : "").trim();
		const data = base64UrlEncode(textEncoder.encode(text));
		if (!data) return "";
		const sp = new URLSearchParams();
		sp.set("shareNote", "1");
		if (title) sp.set("title", title);
		const hash = new URLSearchParams();
		hash.set("data", data);
		return `${location.origin}${location.pathname}?${sp.toString()}#${hash.toString()}`;
	}

	function buildNoteShareQrPayload(payload) {
		const raw = String(payload && payload.text ? payload.text : "");
		if (!raw) return { text: "", truncated: false };
		if (raw.length <= NOTE_SHARE_QR_MAX_CHARS) {
			return { text: raw, truncated: false };
		}
		const title = String(payload && payload.title ? payload.title : "").trim();
		const prefix = title ? `Title: ${title}\n\n` : "";
		const suffix = "\n\n… (truncated for QR)";
		const maxBody = Math.max(
			0,
			NOTE_SHARE_QR_MAX_CHARS - prefix.length - suffix.length
		);
		const body = maxBody > 0 ? raw.slice(0, maxBody) : "";
		return {
			text: `${prefix}${body}${suffix}`.trim(),
			truncated: true,
		};
	}

	function updateNoteShareModal(payload) {
		if (!isNoteShareModalReady() || !payload) return;
		noteSharePayload = payload;
		noteShareModalTitle.textContent = "Share note";
		const baseMeta =
			payload.count && payload.count > 1
				? `${payload.count} notes selected.`
				: payload.title
				? `“${payload.title}” is being shared.`
				: "Share note.";
		noteShareModalText.value = String(payload.text || "");
		revokeNoteShareShareUrl();
		const shareUrl = buildNoteShareUrl(payload);
		if (shareUrl && shareUrl.length <= NOTE_SHARE_URL_MAX_CHARS) {
			noteShareModalShareUrl = shareUrl;
		}
		noteShareModalOpen.href = noteShareModalShareUrl || "#";
		const subject = payload.title
			? `Mirror note: ${payload.title}`
			: "Mirror note";
		const mailBody = noteShareModalShareUrl
			? `HTML link:\n${noteShareModalShareUrl}\n\nText:\n${String(payload.text || "")}`
			: String(payload.text || "");
		noteShareModalMail.href = `mailto:?subject=${encodeURIComponent(
			subject
		)}&body=${encodeURIComponent(mailBody)}`;
		const qrPayload = noteShareModalShareUrl
			? { text: noteShareModalShareUrl, truncated: false, reason: "" }
			: buildNoteShareQrPayload(payload);
		const metaSuffix = noteShareModalShareUrl
			? ""
			: " Share link too long for QR.";
		noteShareModalMeta.textContent = qrPayload.truncated
			? `${baseMeta} QR was truncated.${metaSuffix}`
			: `${baseMeta}${metaSuffix}`;
		noteShareModalQr.src = buildQrUrl(String(qrPayload.text || ""));
		if (noteShareModalShare) {
			const canShare = typeof navigator !== "undefined" && navigator.share;
			noteShareModalShare.classList.toggle("hidden", !canShare);
		}
	}

	function openNoteShareModal(noteIds) {
		if (!isNoteShareModalReady()) return;
		const payload = buildNoteSharePayloadFromIds(noteIds);
		if (!payload || !String(payload.text || "").trim()) {
			toast("No note to share.", "info");
			return;
		}
		updateNoteShareModal(payload);
		setNoteShareModalOpen(true);
		window.setTimeout(() => {
			try {
				noteShareModalCopy.focus();
			} catch {
				// ignore
			}
		}, 0);
	}

	const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
	let uploadSelectedFile = null;
	let uploadBusy = false;

	function isUploadModalReady() {
		return (
			uploadModal &&
			uploadPickBtn &&
			uploadFileInput &&
			uploadFileName &&
			uploadFileMeta &&
			uploadCancel &&
			uploadInsert
		);
	}

	function setUploadModalOpen(open) {
		if (!uploadModal || !uploadModal.classList) return;
		uploadModal.classList.toggle("hidden", !open);
		uploadModal.classList.toggle("flex", open);
		uploadModal.setAttribute("aria-hidden", open ? "false" : "true");
		try {
			document.body.style.overflow = open ? "hidden" : "";
		} catch {
			// ignore
		}
	}

	function formatBytes(bytes) {
		const size = Number(bytes || 0);
		if (!Number.isFinite(size) || size <= 0) return "";
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / (1024 * 1024)).toFixed(2)} MB`;
	}

	function buildUploadMarkdown(url, file) {
		const nameRaw = file ? String(file.name || "file") : "file";
		const name = nameRaw.replace(/\s+/g, " ").trim() || "file";
		const safeUrl = String(url || "").trim();
		if (!safeUrl) return name;
		const mime = file ? String(file.type || "") : "";
		if (mime.startsWith("image/")) return `![${name}](${safeUrl})`;
		return `[${name}](${safeUrl})`;
	}

	function isAllowedUploadType(file) {
		const mime = file ? String(file.type || "") : "";
		return mime.startsWith("image/") || mime === "application/pdf";
	}

	function updateUploadPreview(file) {
		if (!uploadFileName || !uploadFileMeta) return;
		if (!file) {
			uploadFileName.textContent = "Keine Datei ausgewählt.";
			uploadFileMeta.textContent = "";
			return;
		}
		const name = String(file.name || "Datei").trim() || "Datei";
		const meta = [
			String(file.type || "unbekannter Typ"),
			formatBytes(file.size || 0),
		].filter(Boolean);
		uploadFileName.textContent = name;
		uploadFileMeta.textContent = meta.join(" · ");
	}

	function setUploadInsertDisabled(disabled, label) {
		if (!uploadInsert) return;
		uploadInsert.disabled = Boolean(disabled);
		uploadInsert.classList.toggle("opacity-60", Boolean(disabled));
		uploadInsert.classList.toggle("pointer-events-none", Boolean(disabled));
		uploadInsert.textContent = label || "Upload & Insert";
	}

	function resetUploadModalState() {
		uploadSelectedFile = null;
		uploadBusy = false;
		if (uploadFileInput) uploadFileInput.value = "";
		updateUploadPreview(null);
		setUploadInsertDisabled(true);
	}

	function openUploadModal() {
		if (!isUploadModalReady()) return;
		resetUploadModalState();
		setUploadModalOpen(true);
		window.setTimeout(() => {
			try {
				uploadPickBtn.focus();
			} catch {
				// ignore
			}
		}, 0);
	}

	function readFileAsDataUrl(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result || ""));
			reader.onerror = () => reject(new Error("file_read_failed"));
			reader.readAsDataURL(file);
		});
	}

	async function api(path, opts, _retries) {
		const maxRetries = typeof _retries === "number" ? _retries : 2;
		let lastErr = null;
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			if (attempt > 0) {
				await new Promise((r) => setTimeout(r, 800 * attempt));
			}
			try {
				const res = await fetch(path, {
					credentials: "same-origin",
					headers: { "Content-Type": "application/json" },
					...opts,
				});
				const text = await res.text();
				const data = safeJsonParse(text);
				if (res.status === 502 && attempt < maxRetries) {
					console.warn(`[api] 502 on ${path}, retry ${attempt + 1}/${maxRetries}`);
					continue;
				}
				if (!res.ok) {
					const msg = data
						? data.error
							? data.message
								? `${data.error}: ${data.message}`
								: String(data.error)
							: data.message
							? String(data.message)
							: `HTTP ${res.status}`
						: `HTTP ${res.status}`;
					const err = new Error(msg);
					err.status = res.status;
					throw err;
				}
				return data;
			} catch (err) {
				lastErr = err;
				if (attempt < maxRetries && err && err.message && /^HTTP 502\b/.test(err.message)) {
					console.warn(`[api] 502 error on ${path}, retry ${attempt + 1}/${maxRetries}`);
					continue;
				}
				if (attempt < maxRetries && (!err || !err.message)) {
					console.warn(`[api] network error on ${path}, retry ${attempt + 1}/${maxRetries}`);
					continue;
				}
				throw err;
			}
		}
		throw lastErr || new Error("api_failed");
	}

	function fmtDate(ts) {
		try {
			const date = new Date(ts);
			if (Number.isNaN(date.getTime())) return "";
			const datePart = formatDatePart(date);
			const timePart = formatTimePart(date);
			if (datePart && timePart) return `${datePart} ${timePart}`;
			return datePart || timePart || "";
		} catch {
			return "";
		}
	}

	function fmtShortDate(ts) {
		try {
			const date = new Date(ts);
			if (Number.isNaN(date.getTime())) return "";
			const dd = String(date.getDate()).padStart(2, "0");
			const mm = String(date.getMonth() + 1).padStart(2, "0");
			const yy = String(date.getFullYear()).slice(-2);
			return `${dd}.${mm}.${yy}`;
		} catch {
			return "";
		}
	}

	function fmtShortDateTime(ts) {
		try {
			const date = new Date(ts);
			if (Number.isNaN(date.getTime())) return "";
			const dd = String(date.getDate()).padStart(2, "0");
			const mm = String(date.getMonth() + 1).padStart(2, "0");
			const yy = String(date.getFullYear()).slice(-2);
			const hh = String(date.getHours()).padStart(2, "0");
			const min = String(date.getMinutes()).padStart(2, "0");
			return `${dd}.${mm}.${yy} ${hh}:${min}`;
		} catch {
			return "";
		}
	}

	function formatDatePart(date) {
		if (!date || Number.isNaN(date.getTime())) return "";
		if (dateFormat === "dmy") {
			const dd = String(date.getDate()).padStart(2, "0");
			const mm = String(date.getMonth() + 1).padStart(2, "0");
			const yyyy = String(date.getFullYear());
			return `${dd}.${mm}.${yyyy}`;
		}
		if (dateFormat === "ymd") {
			const dd = String(date.getDate()).padStart(2, "0");
			const mm = String(date.getMonth() + 1).padStart(2, "0");
			const yyyy = String(date.getFullYear());
			return `${yyyy}-${mm}-${dd}`;
		}
		if (dateFormat === "mdy") {
			const dd = String(date.getDate()).padStart(2, "0");
			const mm = String(date.getMonth() + 1).padStart(2, "0");
			const yyyy = String(date.getFullYear());
			return `${mm}/${dd}/${yyyy}`;
		}
		return date.toLocaleDateString(getUiLocale(), {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
	}

	function formatTimePart(date) {
		if (!date || Number.isNaN(date.getTime())) return "";
		if (timeFormat === "24h") {
			const hh = String(date.getHours()).padStart(2, "0");
			const mm = String(date.getMinutes()).padStart(2, "0");
			return `${hh}:${mm}`;
		}
		if (timeFormat === "12h") {
			return date.toLocaleTimeString(getUiLocale(), {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
		}
		return date.toLocaleTimeString(getUiLocale(), {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	function normalizeManualTags(rawTags) {
		const text = String(rawTags || "");
		const parts = text
			.split(/[\s,]+/g)
			.map((p) => String(p || "").trim())
			.filter(Boolean);
		const out = [];
		for (const p of parts) {
			const s = String(p || "")
				.trim()
				.replace(/^#/, "")
				.toLowerCase()
				.slice(0, 48);
			if (!s) continue;
			if (!/^[a-z0-9_+:\-]{1,48}$/i.test(s)) continue;
			out.push(s);
			if (out.length >= 24) break;
		}
		return Array.from(new Set(out));
	}

	const PS_MONTH_TAGS = [
		"jan",
		"feb",
		"mar",
		"apr",
		"may",
		"jun",
		"jul",
		"aug",
		"sep",
		"oct",
		"nov",
		"dec",
	];
	const PS_MONTH_ALIASES = {
		january: "jan",
		february: "feb",
		march: "mar",
		april: "apr",
		june: "jun",
		july: "jul",
		august: "aug",
		september: "sep",
		october: "oct",
		november: "nov",
		december: "dec",
		januar: "jan",
		februar: "feb",
		maerz: "mar",
		märz: "mar",
		mai: "may",
		juni: "jun",
		juli: "jul",
		oktober: "oct",
		dezember: "dec",
	};

	function uniqTags(list) {
		const out = [];
		const seen = new Set();
		const items = Array.isArray(list) ? list : [];
		for (const item of items) {
			const s = String(item || "")
				.trim()
				.toLowerCase()
				.slice(0, 48);
			if (!s) continue;
			if (!/^[a-z0-9_+:\-]{1,48}$/i.test(s)) continue;
			if (seen.has(s)) continue;
			seen.add(s);
			out.push(s);
		}
		return out;
	}

	function normalizeYearTag(raw) {
		const s = String(raw || "").trim();
		if (!/^\d{4}$/.test(s)) return "";
		return s;
	}

	function normalizeMonthTag(raw) {
		const s = String(raw || "").trim().toLowerCase();
		const mapped = PS_MONTH_ALIASES[s] || s;
		return PS_MONTH_TAGS.includes(mapped) ? mapped : "";
	}

	function normalizeCategoryValue(raw) {
		const s = String(raw || "")
			.trim()
			.toLowerCase()
			.replace(/\s+/g, "-")
			.slice(0, 48);
		if (!s) return "";
		if (!/^[a-z0-9_+\-]{1,48}$/i.test(s)) return "";
		return s;
	}

	function isYearTag(tag) {
		return /^\d{4}$/.test(String(tag || "").trim());
	}

	function isMonthTag(tag) {
		return Boolean(normalizeMonthTag(tag));
	}

	function getDateTagsForTs(ts) {
		try {
			const d = new Date(ts);
			if (Number.isNaN(d.getTime())) return { year: "", month: "" };
			const year = String(d.getFullYear());
			const month = PS_MONTH_TAGS[d.getMonth()] || "";
			return { year, month };
		} catch {
			return { year: "", month: "" };
		}
	}

	const PS_KIND_TAGS = new Set([
		"note",
		"code",
		"link",
		"address",
		"email",
		"phone",
		"todo",
	]);

	function splitTagsForEditor(rawTags, createdAt) {
		const tags = Array.isArray(rawTags) ? rawTags : [];
		const cleaned = stripPinnedTag(stripManualTagsMarker(tags));
		let year = "";
		let month = "";
		let category = "";
		let subcategory = "";
		let derivedCategory = "";
		let derivedSubcategory = "";
		const manual = [];
		for (const t of cleaned) {
			const s = String(t || "").trim().toLowerCase();
			if (!s) continue;
			if (!year && isYearTag(s)) {
				year = s;
				continue;
			}
			if (!month && isMonthTag(s)) {
				month = normalizeMonthTag(s);
				continue;
			}
			if (!category && s.startsWith("cat:")) {
				category = s.slice(4);
				continue;
			}
			if (!subcategory && s.startsWith("sub:")) {
				subcategory = s.slice(4);
				continue;
			}
			if (!derivedCategory && PS_KIND_TAGS.has(s)) {
				derivedCategory = s;
			}
			if (!derivedSubcategory && s.startsWith("lang-")) {
				derivedSubcategory = s.slice(5);
			}
			manual.push(s);
		}
		if (!category && derivedCategory) category = derivedCategory;
		if (!subcategory && derivedSubcategory) subcategory = derivedSubcategory;
		return { year, month, category, subcategory, manual };
	}

	function sortTagsByCategory(tags) {
		const list = Array.isArray(tags) ? tags : [];
		const years = [];
		const months = [];
		const cats = [];
		const subs = [];
		const manual = [];
		for (const t of list) {
			const s = String(t || "").trim().toLowerCase();
			if (!s) continue;
			if (isYearTag(s)) {
				years.push(s);
			} else if (isMonthTag(s)) {
				months.push(s);
			} else if (s.startsWith("cat:")) {
				cats.push(s);
			} else if (s.startsWith("sub:")) {
				subs.push(s);
			} else {
				manual.push(s);
			}
		}
		return [...years, ...months, ...cats, ...subs, ...manual];
	}

	function buildEditorSystemTags() {
		const tags = [];
		if (psEditingNoteYearTag) tags.push(psEditingNoteYearTag);
		if (psEditingNoteMonthTag) tags.push(psEditingNoteMonthTag);
		if (psEditingNoteCategory) tags.push(`cat:${psEditingNoteCategory}`);
		if (psEditingNoteSubcategory)
			tags.push(`sub:${psEditingNoteSubcategory}`);
		return tags;
	}

	function getEditingNoteCreatedAt() {
		if (!psEditingNoteId || !psState || !psState.authed) return Date.now();
		const notes = Array.isArray(psState.notes) ? psState.notes : [];
		const id = String(psEditingNoteId || "");
		const note = notes.find((n) => String(n && n.id ? n.id : "") === id);
		const createdAt = note && typeof note.createdAt === "number" ? note.createdAt : 0;
		return createdAt || Date.now();
	}

	function ensurePsEditingDateTagsInitialized() {
		if (psEditingNoteDateInitialized) return;
		const defaults = getDateTagsForTs(getEditingNoteCreatedAt());
		if (!psEditingNoteYearTag) psEditingNoteYearTag = defaults.year;
		if (!psEditingNoteMonthTag) psEditingNoteMonthTag = defaults.month;
		psEditingNoteDateInitialized = true;
	}

	function syncPsEditorTagMetaInputs() {
		if (psEditorYearTag) psEditorYearTag.value = psEditingNoteYearTag || "";
		if (psEditorMonthTag)
			psEditorMonthTag.value = psEditingNoteMonthTag || "";
		if (psEditorCategoryTag)
			psEditorCategoryTag.value = psEditingNoteCategory || "";
		if (psEditorSubcategoryTag)
			psEditorSubcategoryTag.value = psEditingNoteSubcategory || "";
	}

	function updatePsEditorTagMetaFromInputs() {
		psEditingNoteYearTag = normalizeYearTag(
			psEditorYearTag ? psEditorYearTag.value : ""
		);
		psEditingNoteMonthTag = normalizeMonthTag(
			psEditorMonthTag ? psEditorMonthTag.value : ""
		);
		psEditingNoteCategory = normalizeCategoryValue(
			psEditorCategoryTag ? psEditorCategoryTag.value : ""
		);
		psEditingNoteSubcategory = normalizeCategoryValue(
			psEditorSubcategoryTag ? psEditorSubcategoryTag.value : ""
		);
		// Inhibit auto-tag reassignment when user manually edits any psEditorTagsBar field
		psEditingNoteTagsOverridden = true;
		psEditingNoteDateInitialized = true;
		syncPsEditorTagMetaInputs();
		updatePsEditingTagsHint();
		updateEditingNoteTagsLocal(psEditingNoteTags);
		schedulePsTagsAutoSave();
		updateEditorMetaYaml();
	}

	function formatTagsForHint(tags) {
		const arr = Array.isArray(tags) ? tags : [];
		if (!arr.length) return "";
		return arr.map((t) => `#${t}`).join(" ");
	}

	function setPsHintText(text) {
		if (!psHint) return;
		const msg = String(text || "").slice(0, 200);
		psHint.textContent = msg;
	}

	function updatePsEditingTagsHint() {
		if (!psHint) return;
		const manualTags = Array.isArray(psEditingNoteTags)
			? psEditingNoteTags
			: [];
		const systemTags = buildEditorSystemTags();
		const combined = [];
		const seen = new Set();
		for (const tag of [...manualTags, ...systemTags]) {
			const s = String(tag || "").trim();
			if (!s) continue;
			const key = s.toLowerCase();
			if (seen.has(key)) continue;
			seen.add(key);
			combined.push(s);
		}
		const t = formatTagsForHint(combined);
		if (!t) {
			const existing = String(psHint.textContent || "").trim();
			if (!existing) return;
			const cleaned = existing
				.replace(/\s*·\s*Tags:\s*[^·]+$/i, "")
				.replace(/^Tags:\s*.*$/i, "")
				.trim();
			if (cleaned !== existing) setPsHintText(cleaned);
			return;
		}
		const tagPart = `Tags: ${t}`;
		const existing = String(psHint.textContent || "").trim();
		if (!existing) {
			setPsHintText(tagPart);
			return;
		}
		if (/\bTags:\b/i.test(existing)) {
			setPsHintText(tagPart);
			return;
		}
		setPsHintText(`${existing} · ${tagPart}`);
	}

	let psEditorTagsSyncing = false;
	const psEditorTagsPills = document.getElementById("psEditorTagsPills");

	function formatTagsForEditor(tags) {
		const arr = Array.isArray(tags) ? tags : [];
		return arr.join(", ");
	}

	function setPsEditorTagsVisible(visible) {
		if (!psEditorTagsBar || !psEditorTagsBar.classList) return;
		psEditorTagsBar.classList.toggle("hidden", !visible);
	}

	function createPillRemoveIcon() {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 16 16");
		svg.setAttribute("fill", "currentColor");
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z");
		svg.appendChild(path);
		return svg;
	}

	function renderPsEditorTagsPills() {
		if (!psEditorTagsPills) return;
		psEditorTagsPills.innerHTML = "";

		// Year pill
		if (psEditingNoteYearTag) {
			const pill = document.createElement("span");
			pill.className = "ps-tag-pill ps-tag-pill-year";
			pill.innerHTML = `<span class="ps-tag-pill-hash">#</span><span>${escapeHtml(psEditingNoteYearTag)}</span>`;
			const rm = document.createElement("span");
			rm.className = "ps-tag-pill-remove";
			rm.appendChild(createPillRemoveIcon());
			rm.addEventListener("click", (e) => {
				e.stopPropagation();
				psEditingNoteYearTag = "";
				psEditingNoteTagsOverridden = true;
				syncPsEditorTagMetaInputs();
				renderPsEditorTagsPills();
				updatePsEditingTagsHint();
				schedulePsTagsAutoSave();
				updateEditorMetaYaml();
			});
			pill.appendChild(rm);
			psEditorTagsPills.appendChild(pill);
		}

		// Month pill
		if (psEditingNoteMonthTag) {
			const pill = document.createElement("span");
			pill.className = "ps-tag-pill ps-tag-pill-month";
			pill.innerHTML = `<span class="ps-tag-pill-hash">#</span><span>${escapeHtml(psEditingNoteMonthTag.charAt(0).toUpperCase() + psEditingNoteMonthTag.slice(1))}</span>`;
			const rm = document.createElement("span");
			rm.className = "ps-tag-pill-remove";
			rm.appendChild(createPillRemoveIcon());
			rm.addEventListener("click", (e) => {
				e.stopPropagation();
				psEditingNoteMonthTag = "";
				psEditingNoteTagsOverridden = true;
				syncPsEditorTagMetaInputs();
				renderPsEditorTagsPills();
				updatePsEditingTagsHint();
				schedulePsTagsAutoSave();
				updateEditorMetaYaml();
			});
			pill.appendChild(rm);
			psEditorTagsPills.appendChild(pill);
		}

		// Category pill
		if (psEditingNoteCategory) {
			const pill = document.createElement("span");
			pill.className = "ps-tag-pill ps-tag-pill-category";
			pill.innerHTML = `<span class="ps-tag-pill-hash">#</span><span>${escapeHtml(psEditingNoteCategory)}</span>`;
			const rm = document.createElement("span");
			rm.className = "ps-tag-pill-remove";
			rm.appendChild(createPillRemoveIcon());
			rm.addEventListener("click", (e) => {
				e.stopPropagation();
				psEditingNoteCategory = "";
				psEditingNoteTagsOverridden = true;
				syncPsEditorTagMetaInputs();
				renderPsEditorTagsPills();
				updatePsEditingTagsHint();
				schedulePsTagsAutoSave();
				updateEditorMetaYaml();
			});
			pill.appendChild(rm);
			psEditorTagsPills.appendChild(pill);
		}

		// Subcategory pill
		if (psEditingNoteSubcategory) {
			const pill = document.createElement("span");
			pill.className = "ps-tag-pill ps-tag-pill-subcategory";
			pill.innerHTML = `<span class="ps-tag-pill-hash">#</span><span>${escapeHtml(psEditingNoteSubcategory)}</span>`;
			const rm = document.createElement("span");
			rm.className = "ps-tag-pill-remove";
			rm.appendChild(createPillRemoveIcon());
			rm.addEventListener("click", (e) => {
				e.stopPropagation();
				psEditingNoteSubcategory = "";
				psEditingNoteTagsOverridden = true;
				syncPsEditorTagMetaInputs();
				renderPsEditorTagsPills();
				updatePsEditingTagsHint();
				schedulePsTagsAutoSave();
				updateEditorMetaYaml();
			});
			pill.appendChild(rm);
			psEditorTagsPills.appendChild(pill);
		}

		// Manual tags as pills
		const manualTags = Array.isArray(psEditingNoteTags) ? psEditingNoteTags : [];
		for (const tag of manualTags) {
			const s = String(tag || "").trim();
			if (!s) continue;
			const pill = document.createElement("span");
			pill.className = "ps-tag-pill ps-tag-pill-tag";
			pill.innerHTML = `<span class="ps-tag-pill-hash">#</span><span>${escapeHtml(s)}</span>`;
			const rm = document.createElement("span");
			rm.className = "ps-tag-pill-remove";
			rm.appendChild(createPillRemoveIcon());
			rm.addEventListener("click", (e) => {
				e.stopPropagation();
				psEditingNoteTags = psEditingNoteTags.filter(t => t.toLowerCase() !== s.toLowerCase());
				psEditingNoteTagsOverridden = true;
				renderPsEditorTagsPills();
				updatePsEditingTagsHint();
				updateEditingNoteTagsLocal(psEditingNoteTags);
				schedulePsTagsAutoSave();
				updateEditorMetaYaml();
			});
			pill.appendChild(rm);
			psEditorTagsPills.appendChild(pill);
		}
	}

	function syncPsEditorTagsInput(force) {
		if (!psEditorTagsInput) return;
		const isFocused = (() => {
			try {
				return document && document.activeElement === psEditorTagsInput;
			} catch {
				return false;
			}
		})();
		// Always update pills, even if input is focused
		if (!isFocused || force) {
			psEditorTagsSyncing = true;
			psEditorTagsInput.value = ""; // Clear input since tags are now shown as pills
			psEditorTagsSyncing = false;
		}
		syncPsEditorTagMetaInputs();
		renderPsEditorTagsPills();
	}

	let psEditorTagsSuggestOpen = false;
	let psEditorTagsSuggestItems = [];
	let psEditorTagsSuggestIndex = -1;
	let psEditorTagsSuggestTarget = null; // null = psEditorTagsInput, or reference to category/subcategory input

	function getPsEditorTagTokenBounds(inputEl) {
		const value = String(inputEl && inputEl.value ? inputEl.value : "");
		const caret = Math.max(
			0,
			Math.min(value.length, Number(inputEl.selectionStart) || 0)
		);
		const isSep = (ch) => /[\s,]/.test(ch || "");
		let start = caret;
		while (start > 0 && !isSep(value[start - 1])) start -= 1;
		let end = caret;
		while (end < value.length && !isSep(value[end])) end += 1;
		return { value, start, end, token: value.slice(start, end) };
	}

	function buildPsEditorTagsSuggestItems() {
		if (!psEditorTagsInput) return [];
		const tags = Array.isArray(psState && psState.tags) ? psState.tags : [];
		if (!tags.length) return [];
		const { token } = getPsEditorTagTokenBounds(psEditorTagsInput);
		const prefix = String(token || "")
			.trim()
			.replace(/^#/, "")
			.toLowerCase();
		const existing = new Set(normalizeManualTags(psEditorTagsInput.value));
		if (prefix) existing.delete(prefix);
		const items = [];
		for (const t of tags) {
			const raw = String(t || "").trim();
			if (!raw) continue;
			if (raw === PS_PINNED_TAG || raw === PS_MANUAL_TAGS_MARKER) continue;
			if (raw.startsWith("cat:") || raw.startsWith("sub:")) continue;
			if (isYearTag(raw) || isMonthTag(raw)) continue;
			const lower = raw.toLowerCase();
			if (lower === "shell") continue;
			if (existing.has(lower)) continue;
			if (prefix && !lower.startsWith(prefix)) continue;
			items.push(raw);
			if (items.length >= 8) break;
		}
		return items;
	}

	function buildPsMetaTagSuggestItems(targetEl, tagPrefix) {
		if (!targetEl) return [];
		const tags = Array.isArray(psState && psState.tags) ? psState.tags : [];
		if (!tags.length) return [];
		const currentVal = String(targetEl.value || "").trim().toLowerCase();
		const seen = new Set();
		const items = [];
		for (const t of tags) {
			const raw = String(t || "").trim();
			if (!raw.startsWith(tagPrefix)) continue;
			const val = raw.slice(tagPrefix.length);
			if (!val) continue;
			const lower = val.toLowerCase();
			if (seen.has(lower)) continue;
			seen.add(lower);
			if (lower === currentVal) continue;
			if (currentVal && !lower.startsWith(currentVal)) continue;
			items.push(val);
			if (items.length >= 8) break;
		}
		return items;
	}

	function closePsEditorTagsSuggest() {
		if (!psEditorTagsSuggest) return;
		psEditorTagsSuggestOpen = false;
		psEditorTagsSuggestItems = [];
		psEditorTagsSuggestIndex = -1;
		psEditorTagsSuggestTarget = null;
		psEditorTagsSuggest.classList.add("hidden");
		psEditorTagsSuggest.innerHTML = "";
		psEditorTagsSuggest.style.left = "";
		psEditorTagsSuggest.style.width = "";
	}

	function positionPsEditorTagsSuggest() {
		if (!psEditorTagsSuggest || !psEditorTagsBar) return;
		const callerEl = psEditorTagsSuggestTarget || psEditorTagsInput;
		if (!callerEl) return;
		const barRect = psEditorTagsBar.getBoundingClientRect();
		const elRect = callerEl.getBoundingClientRect();
		const left = elRect.left - barRect.left;
		const width = Math.max(elRect.width, 140);
		psEditorTagsSuggest.style.left = left + "px";
		psEditorTagsSuggest.style.width = width + "px";
	}

	function renderPsEditorTagsSuggest(items, activeIndex) {
		if (!psEditorTagsSuggest) return;
		if (!items.length) {
			closePsEditorTagsSuggest();
			return;
		}
		psEditorTagsSuggestOpen = true;
		psEditorTagsSuggestItems = items;
		psEditorTagsSuggestIndex = activeIndex;
		psEditorTagsSuggest.innerHTML = items
			.map((tag, idx) => {
				const active = idx === activeIndex;
				const btnClass = active
					? "bg-white/10 text-white"
					: "text-slate-200 hover:bg-white/5";
				return `\n\t\t\t<button type="button" class="flex w-full items-center gap-2 px-2.5 py-1.5 text-left ${btnClass}" data-tag="${escapeHtmlAttr(
					tag
				)}" data-index="${idx}"><span class="text-slate-400">#</span><span class="font-medium">${escapeHtml(
					tag
				)}</span></button>`;
			})
			.join("");
		psEditorTagsSuggest.classList.remove("hidden");
		positionPsEditorTagsSuggest();
	}

	function updatePsEditorTagsSuggest(forceOpen) {
		if (!psEditorTagsInput || !psEditorTagsSuggest) return;
		if (!psState || !psState.authed) {
			closePsEditorTagsSuggest();
			return;
		}
		if (psEditorTagsBar && psEditorTagsBar.classList.contains("hidden")) {
			closePsEditorTagsSuggest();
			return;
		}
		const focused = (() => {
			try {
				return document && document.activeElement === psEditorTagsInput;
			} catch {
				return false;
			}
		})();
		if (!forceOpen && !focused) {
			closePsEditorTagsSuggest();
			return;
		}
		const items = buildPsEditorTagsSuggestItems();
		if (!items.length) {
			closePsEditorTagsSuggest();
			return;
		}
		let nextIndex = psEditorTagsSuggestIndex;
		if (nextIndex < 0 || nextIndex >= items.length) nextIndex = 0;
		renderPsEditorTagsSuggest(items, nextIndex);
	}

	function addTagFromInput() {
		if (!psEditorTagsInput) return false;
		const inputVal = String(psEditorTagsInput.value || "").trim().replace(/^#/, "");
		if (!inputVal) return false;
		
		// Check if it's a special tag type
		if (isYearTag(inputVal) && !psEditingNoteYearTag) {
			psEditingNoteYearTag = inputVal;
		} else if (isMonthTag(inputVal) && !psEditingNoteMonthTag) {
			psEditingNoteMonthTag = normalizeMonthTag(inputVal);
		} else if (inputVal.startsWith("cat:")) {
			psEditingNoteCategory = normalizeCategoryValue(inputVal.slice(4));
		} else if (inputVal.startsWith("sub:")) {
			psEditingNoteSubcategory = normalizeCategoryValue(inputVal.slice(4));
		} else {
			// Add as manual tag if not already present
			const normalized = inputVal.toLowerCase().replace(/\s+/g, "-").slice(0, 48);
			if (normalized && !psEditingNoteTags.some(t => t.toLowerCase() === normalized)) {
				psEditingNoteTags = [...psEditingNoteTags, normalized];
			}
		}
		
		psEditingNoteTagsOverridden = true;
		psEditorTagsInput.value = "";
		syncPsEditorTagMetaInputs();
		renderPsEditorTagsPills();
		updatePsEditingTagsHint();
		updateEditingNoteTagsLocal(psEditingNoteTags);
		schedulePsTagsAutoSave();
		updateEditorMetaYaml();
		return true;
	}

	function updatePsEditorTagsFromInput() {
		if (!psEditorTagsInput) return;
		if (psEditorTagsSyncing) return;
		// For pill-based design, we don't update tags on every input
		// Tags are added when user presses Enter or selects from suggestions
	}

	function applyPsEditorTagSuggestion(tag) {
		if (psEditorTagsSuggestTarget) {
			const el = psEditorTagsSuggestTarget;
			closePsEditorTagsSuggest();
			el.value = String(tag || "");
			updatePsEditorTagMetaFromInputs();
			renderPsEditorTagsPills();
			el.focus();
			return;
		}
		if (!psEditorTagsInput) return;
		// Add the tag as a pill
		const normalized = String(tag || "").toLowerCase().replace(/\s+/g, "-").slice(0, 48);
		if (normalized && !psEditingNoteTags.some(t => t.toLowerCase() === normalized)) {
			psEditingNoteTags = [...psEditingNoteTags, normalized];
		}
		closePsEditorTagsSuggest();
		psEditorTagsInput.value = "";
		psEditingNoteTagsOverridden = true;
		renderPsEditorTagsPills();
		updatePsEditingTagsHint();
		updateEditingNoteTagsLocal(psEditingNoteTags);
		schedulePsTagsAutoSave();
		updateEditorMetaYaml();
		psEditorTagsInput.focus();
		updatePsEditorTagsSuggest(true);
	}

	function syncPsEditingNoteTagsFromState() {
		if (!psState || !psState.authed) return;
		if (!psEditingNoteId) return;
		const notes = Array.isArray(psState.notes) ? psState.notes : [];
		const id = String(psEditingNoteId || "");
		const note = notes.find((n) => String(n && n.id ? n.id : "") === id);
		if (!note) return;
		const rawTags = Array.isArray(note.tags) ? note.tags : [];
		psEditingNoteTagsOverridden = rawTags.some(
			(t) => String(t || "") === PS_MANUAL_TAGS_MARKER
		);
		psEditingNotePinned = rawTags.some(
			(t) => String(t || "") === PS_PINNED_TAG
		);
		const split = splitTagsForEditor(rawTags, note.createdAt);
		psEditingNoteTags = split.manual;
		psEditingNoteYearTag = normalizeYearTag(split.year);
		psEditingNoteMonthTag = normalizeMonthTag(split.month);
		psEditingNoteCategory = normalizeCategoryValue(split.category);
		psEditingNoteSubcategory = normalizeCategoryValue(split.subcategory);
		psEditingNoteDateInitialized = false;
		ensurePsEditingDateTagsInitialized();
		updatePsEditingTagsHint();
		syncPsEditorTagsInput();
	}

	function getLineBounds(text, pos) {
		const v = String(text || "");
		const p = Math.max(0, Math.min(v.length, Number(pos) || 0));
		const start = v.lastIndexOf("\n", p - 1) + 1;
		const endIdx = v.indexOf("\n", p);
		const end = endIdx === -1 ? v.length : endIdx;
		return { start, end, line: v.slice(start, end) };
	}

	function replaceTextRange(el, start, end, replacement) {
		const v = String(el && el.value ? el.value : "");
		const s = Math.max(0, Math.min(v.length, Number(start) || 0));
		const e = Math.max(s, Math.min(v.length, Number(end) || 0));
		el.value = v.slice(0, s) + String(replacement || "") + v.slice(e);
		return s + String(replacement || "").length;
	}

	function insertTextAtCursor(el, text) {
		if (!el) return;
		const value = String(el.value || "");
		const start = Math.max(0, Math.min(value.length, Number(el.selectionStart) || 0));
		const end = Math.max(start, Math.min(value.length, Number(el.selectionEnd) || 0));
		const next = value.slice(0, start) + String(text || "") + value.slice(end);
		el.value = next;
		const caret = start + String(text || "").length;
		try {
			el.setSelectionRange(caret, caret);
		} catch {
			// ignore
		}
	}

	async function showSlashHelp() {
		await openModal({
			title: t("slash.help.title"),
			message: t("slash.help.message"),
			okText: t("modal.ok"),
			cancelText: t("modal.close"),
			backdropClose: true,
		});
	}

	const SELECTION_HELP_KEYS = [
		"menu.bold_tip",
		"menu.italic_tip",
		"menu.strike_tip",
		"menu.password_hide_tip",
		"menu.blockquote_tip",
		"menu.bullet_tip",
		"menu.numbered_tip",
		"menu.task_tip",
		"menu.divider_tip",
		"menu.code_tip",
		"menu.link_tip",
		"menu.comment_tip",
		"menu.sort_az_tip",
	];

	async function showSelectionHelp() {
		const message = SELECTION_HELP_KEYS.map((key) => t(key)).join(" · ");
		await openModal({
			title: t("selection.help.title"),
			message,
			okText: t("modal.ok"),
			cancelText: t("modal.close"),
			backdropClose: true,
		});
	}

	const SLASH_SUGGESTIONS = [
		{ cmd: "help", labelKey: "slash.item.help", label: "Help", snippet: "/help" },
		{ cmd: "h1", labelKey: "slash.item.h1", label: "Heading 1", snippet: "/h1" },
		{ cmd: "h2", labelKey: "slash.item.h2", label: "Heading 2", snippet: "/h2" },
		{ cmd: "h3", labelKey: "slash.item.h3", label: "Heading 3", snippet: "/h3" },
		{ cmd: "b", labelKey: "slash.item.bold", label: "Bold", snippet: "/b" },
		{ cmd: "i", labelKey: "slash.item.italic", label: "Italic", snippet: "/i" },
		{ cmd: "s", labelKey: "slash.item.strike", label: "Strikethrough", snippet: "/s" },
		{ cmd: "quote", labelKey: "slash.item.quote", label: "Blockquote", snippet: "/quote" },
		{ cmd: "ul", labelKey: "slash.item.ul", label: "Bullet list", snippet: "/ul" },
		{ cmd: "ol", labelKey: "slash.item.ol", label: "Numbered list", snippet: "/ol" },
		{ cmd: "todo", labelKey: "slash.item.todo", label: "Task list", snippet: "/todo" },
		{ cmd: "done", labelKey: "slash.item.done", label: "Task (checked)", snippet: "/done" },
		{ cmd: "tasks", labelKey: "slash.item.tasks", label: "Task template", snippet: "/tasks" },
		{ cmd: "table", labelKey: "slash.item.table", label: "Table", snippet: "/table" },
		{ cmd: "table", labelKey: "slash.item.table_3x2", label: "Table (3x2)", snippet: "/table 3x2" },
		{ cmd: "table", labelKey: "slash.item.table_row_add", label: "Table: row +", snippet: "/table row+" },
		{ cmd: "table", labelKey: "slash.item.table_row_remove", label: "Table: row -", snippet: "/table row-" },
		{ cmd: "table", labelKey: "slash.item.table_col_add", label: "Table: col +", snippet: "/table col+" },
		{ cmd: "table", labelKey: "slash.item.table_col_remove", label: "Table: col -", snippet: "/table col-" },
		{ cmd: "hr", labelKey: "slash.item.hr", label: "Horizontal rule", snippet: "/hr" },
		{ cmd: "divider", labelKey: "slash.item.divider", label: "Divider", snippet: "/divider" },
		{ cmd: "link", labelKey: "slash.item.link", label: "Link", snippet: "/link" },
		{ cmd: "code", labelKey: "slash.item.code", label: "Code block", snippet: "/code" },
		{ cmd: "code", labelKey: "slash.item.code_js", label: "Code block (js)", snippet: "/code javascript" },
		{ cmd: "code", labelKey: "slash.item.code_py", label: "Code block (py)", snippet: "/code python" },
	];

	let slashMenuOpen = false;
	let slashMenuItems = [];
	let slashMenuIndex = 0;
	let wikiMenuOpen = false;
	let wikiMenuItems = [];
	let wikiMenuIndex = 0;
	let selectionMenuOpen = false;
	let commentPanelOpen = false;
	let commentDraftSelection = null;
	let commentEditId = "";
	let commentReplyToId = "";
	let commentSelectedId = "";
	let commentItems = [];
	let commentSaveTimer = null;
	let commentSavePromise = null;
	let commentSaveNoteId = "";
	let commentLoadToken = 0;
	let commentActiveNoteId = "";
	let psCommentedNoteIds = new Set();
	let psCommentIndexLoaded = false;
	let psCommentIndexPromise = null;
	let psTagsAutoSaveTimer = null;
	let psNoteHistory = [];
	let psNoteHistoryIndex = -1;
	let psNoteHistorySkip = false;
	let psSelectedNoteIds = new Set();
	let psRenderedNoteIds = [];
	let psContextMenuOpen = false;
	let psContextMenuTargetId = "";
	let psTagContextMenuOpen = false;
	let psTagContextMenuTag = "";
	let psTagContextDeleteArmed = false;
	let psTagContextDeleteTimer = null;
	let crdtMarksEnabled = true;
	let crdtMarksStyle = "underline";
	const CRDT_MARKS_DISABLED_KEY = "mirror_crdt_marks_disabled";
	const CRDT_MARKS_STYLE_KEY = "mirror_crdt_marks_style";
	const aiChatHistoryByContext = new Map();
	let aiChatContextKey = "";
	let aiChatSeq = 0;

	function getTextareaCaretCoords(el, pos) {
		if (!el) return { left: 0, top: 0, height: 0 };
		const value = String(el.value || "");
		const caret = Math.max(0, Math.min(value.length, Number(pos) || 0));
		const div = document.createElement("div");
		const span = document.createElement("span");
		const style = window.getComputedStyle(el);
		const props = [
			"direction",
			"boxSizing",
			"width",
			"height",
			"overflowX",
			"overflowY",
			"borderTopWidth",
			"borderRightWidth",
			"borderBottomWidth",
			"borderLeftWidth",
			"paddingTop",
			"paddingRight",
			"paddingBottom",
			"paddingLeft",
			"fontStyle",
			"fontVariant",
			"fontWeight",
			"fontStretch",
			"fontSize",
			"lineHeight",
			"fontFamily",
			"textAlign",
			"textTransform",
			"textIndent",
			"textDecoration",
			"letterSpacing",
			"wordSpacing",
			"tabSize",
			"MozTabSize",
		];
		props.forEach((p) => {
			div.style[p] = style[p];
		});
		div.style.position = "absolute";
		div.style.visibility = "hidden";
		div.style.whiteSpace = "pre-wrap";
		div.style.wordWrap = "break-word";
		div.style.top = "0";
		div.style.left = "-9999px";
		div.textContent = value.slice(0, caret);
		span.textContent = value.slice(caret) || ".";
		div.appendChild(span);
		document.body.appendChild(div);
		const rect = span.getBoundingClientRect();
		const divRect = div.getBoundingClientRect();
		const height = rect.height || parseFloat(style.lineHeight) || 16;
		const coords = {
			left: rect.left - divRect.left,
			top: rect.top - divRect.top,
			height,
		};
		div.remove();
		return coords;
	}

	function positionFloatingMenu(menu, el, caretPos, offsetY) {
		if (!menu || !el) return;
		const coords = getTextareaCaretCoords(el, caretPos);
		const elRect = el.getBoundingClientRect();
		if (menu.id === "selectionMenu") {
			const menuRect = menu.getBoundingClientRect();
			const selStart = Math.min(
				Number(el.selectionStart || 0),
				Number(el.selectionEnd || 0)
			);
			const selEnd = Math.max(
				Number(el.selectionStart || 0),
				Number(el.selectionEnd || 0)
			);
			const startCoords = getTextareaCaretCoords(el, selStart);
			const endCoords = getTextareaCaretCoords(el, selEnd);
			const selectionCenter = (startCoords.left + endCoords.left) / 2;
			const selectionTop = Math.min(startCoords.top, endCoords.top);
			const desiredLeft =
				elRect.left + selectionCenter - el.scrollLeft - menuRect.width / 2;
			const desiredTop =
				elRect.top + selectionTop - el.scrollTop - menuRect.height - 18;
			const minTop = elRect.top + 8;
			const maxTop = elRect.bottom - Math.max(0, menuRect.height) - 8;
			const minLeft = elRect.left + 8;
			const maxLeft = elRect.right - Math.max(0, menuRect.width) - 8;
			const nextLeft = Math.max(minLeft, Math.min(desiredLeft, maxLeft));
			const nextTop = Math.max(minTop, Math.min(desiredTop, maxTop));
			menu.style.position = "fixed";
			menu.style.left = `${Math.round(nextLeft)}px`;
			menu.style.top = `${Math.round(nextTop)}px`;
			return;
		}
		const offsetParent = menu.offsetParent || menu.parentElement;
		if (!offsetParent) return;
		const parentRect = offsetParent.getBoundingClientRect();
		const left =
			coords.left - el.scrollLeft + (elRect.left - parentRect.left);
		const top =
			coords.top - el.scrollTop + (elRect.top - parentRect.top);
		const menuRect = menu.getBoundingClientRect();
		const maxLeft = parentRect.width - Math.max(0, menuRect.width) - 8;
		const maxTop = parentRect.height - Math.max(0, menuRect.height) - 8;
		const nextLeft = Math.max(8, Math.min(left, maxLeft));
		const nextTop = Math.max(
			8,
			Math.min(top + coords.height + (offsetY || 8), maxTop)
		);
		menu.style.left = `${Math.round(nextLeft)}px`;
		menu.style.top = `${Math.round(nextTop)}px`;
	}

	function setSlashMenuOpen(open) {
		slashMenuOpen = Boolean(open);
		if (!slashMenu || !slashMenu.classList) return;
		slashMenu.classList.toggle("hidden", !slashMenuOpen);
	}

	function getSlashContext() {
		if (!textarea)
			return {
				active: false,
				start: 0,
				end: 0,
				query: "",
				token: "",
				exact: false,
			};
		const value = String(textarea.value || "");
		const caret = Math.max(
			0,
			Math.min(value.length, Number(textarea.selectionEnd || 0))
		);
		const { start, end, line } = getLineBounds(value, caret);
		const raw = String(line || "");
		const leading = raw.match(/^\s+/);
		const leadingLen = leading ? leading[0].length : 0;
		const trimmedStart = raw.slice(leadingLen);
		if (!trimmedStart.startsWith("/")) {
			return { active: false, start, end, query: "", token: "", exact: false };
		}
		const firstWs = trimmedStart.search(/\s/);
		const token =
			(firstWs === -1
				? trimmedStart.slice(1)
				: trimmedStart.slice(1, firstWs)) || "";
		const tokenLower = token.toLowerCase();
		const exact = SLASH_SUGGESTIONS.some(
			(it) => String(it.cmd || "").toLowerCase() === tokenLower
		);
		// Only show suggestions while the caret is in the command token (before args).
		const caretInLine = caret - start;
		const caretInTrimmed = caretInLine - leadingLen;
		const tokenEndInTrimmed = firstWs === -1 ? trimmedStart.length : firstWs;
		const caretInToken = caretInTrimmed <= tokenEndInTrimmed;
		return {
			active: caretInToken,
			start,
			end,
			query: tokenLower,
			token: tokenLower,
			exact,
		};
	}

	function setWikiMenuOpen(open) {
		wikiMenuOpen = Boolean(open);
		if (!wikiMenu || !wikiMenu.classList) return;
		wikiMenu.classList.toggle("hidden", !wikiMenuOpen);
	}

	function setSelectionMenuOpen(open) {
		selectionMenuOpen = Boolean(open);
		if (!selectionMenu || !selectionMenu.classList) return;
		selectionMenu.classList.toggle("hidden", !selectionMenuOpen);
	}

	function getSelectionRange() {
		if (!textarea) return null;
		const start = Number(textarea.selectionStart || 0);
		const end = Number(textarea.selectionEnd || 0);
		if (end <= start) return null;
		return { start, end };
	}

	function formatCommentTime(value) {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "";
		try {
			return date.toLocaleString(undefined, {
				dateStyle: "short",
				timeStyle: "short",
			});
		} catch {
			return date.toISOString().replace("T", " ").slice(0, 16);
		}
	}

	function getCommentNoteId() {
		return psEditingNoteId ? String(psEditingNoteId || "") : "";
	}

	/** Returns the note ID that the current editor content belongs to.
	 *  Used to bind comment text-selections to a specific note so
	 *  highlights don't leak across notes that share the same comment scope. */
	function getCommentSelectionNoteId() {
		const nextRoom = normalizeRoom(room);
		const nextKey = normalizeKey(key);
		const pinned = getRoomPinnedEntry(nextRoom, nextKey);
		const pinnedNoteId = pinned && pinned.noteId ? String(pinned.noteId || "").trim() : "";
		return pinnedNoteId || getCommentNoteId();
	}

	function getCommentScopeId() {
		const nextRoom = normalizeRoom(room);
		const nextKey = normalizeKey(key);
		const shared = isRoomMarkedShared(room, key);
		// Shared rooms use room scope so all participants see the same comments.
		// When a note is pinned, append note ID to bind comments to that note.
		if (shared && nextRoom) {
			const pinned = getRoomPinnedEntry(nextRoom, nextKey);
			const pinnedNoteId = pinned && pinned.noteId ? String(pinned.noteId || "").trim() : "";
			const base = `room:${nextRoom}${nextKey ? `:${nextKey}` : ""}`;
			return pinnedNoteId ? `${base}:n:${pinnedNoteId}` : base;
		}
		const noteId = getCommentNoteId();
		if (noteId) return `note:${noteId}`;
		if (nextRoom && nextKey) {
			return `room:${nextRoom}:${nextKey}`;
		}
		return "";
	}

	function getCommentScopeRequestInfo() {
		const scopeId = getCommentScopeId();
		if (!scopeId) return { scopeId: "", apiUrl: "" };
		if (scopeId.startsWith("room:")) {
			// Extract room, key, and optional noteId from scope
			// Format: room:ROOM[:KEY][:n:NOTEID]
			const raw = scopeId.slice(5);
			const noteMarker = raw.indexOf(":n:");
			const noteIdPart = noteMarker >= 0 ? raw.slice(noteMarker + 3) : "";
			const roomKeyPart = noteMarker >= 0 ? raw.slice(0, noteMarker) : raw;
			const parts = roomKeyPart.split(":");
			const scopeRoom = parts[0] || "";
			const scopeKey = parts.slice(1).join(":");
			if (!scopeRoom) return { scopeId: "", apiUrl: "" };
			const base = `/api/rooms/${encodeURIComponent(scopeRoom)}`;
			let apiUrl = scopeKey
				? `${base}/${encodeURIComponent(scopeKey)}/comments`
				: `${base}/comments`;
			// Always send noteId when editing a PS note so server can track for has:comment
			const effectiveNoteId = noteIdPart || String(psEditingNoteId || "").trim();
			if (effectiveNoteId) {
				apiUrl += `?noteId=${encodeURIComponent(effectiveNoteId)}`;
			}
			return { scopeId, apiUrl };
		}
		if (scopeId.startsWith("note:")) {
			const noteId = scopeId.slice(5);
			if (!noteId) return { scopeId: "", apiUrl: "" };
			return {
				scopeId,
				apiUrl: `/api/notes/${encodeURIComponent(noteId)}/comments`,
			};
		}
		return { scopeId: "", apiUrl: "" };
	}

	function canSyncCommentsForScope(scopeId) {
		if (!scopeId) return false;
		// Room-scoped comments are available for all users (including guests)
		if (scopeId.startsWith("room:")) return true;
		// Note-scoped comments require PS auth
		return Boolean(psState && psState.authed);
	}

	async function ensureCommentScopeId() {
		const currentScope = getCommentScopeId();
		if (currentScope) return currentScope;
		const shared = isRoomMarkedShared(room, key);
		if (shared) return getCommentScopeId();
		if (!psState || !psState.authed || !textarea) return "";
		const text = String(textarea.value || "");
		if (!text.trim()) return "";
		try {
			await savePersonalSpaceNote(text, { auto: true });
		} catch {
			return "";
		}
		return getCommentScopeId();
	}

	function normalizeCommentItems(raw) {
		if (!Array.isArray(raw)) return [];
		return raw
			.map((item) => {
				if (!item || typeof item !== "object") return null;
				const text = String(item.text || "").trim();
				if (!text) return null;
				const createdAt = Number(item.createdAt || 0) || Date.now();
				const updatedAt = Number(item.updatedAt || 0) || 0;
				const parentId = String(item.parentId || "").trim();
				const author = item.author && typeof item.author === "object"
					? item.author
					: identity;
				const selectionSource =
					item.selection && typeof item.selection === "object"
						? item.selection
						: null;
				let normalizedSelection = null;
				if (selectionSource) {
					const start = Number(selectionSource.start || 0);
					const end = Number(selectionSource.end || 0);
					const selText = String(selectionSource.text || "").trim();
					if (selText && end > start) {
						normalizedSelection = { start, end, text: selText };
					}
				}
				return {
					id: String(item.id || `c_${createdAt}`),
					createdAt,
					updatedAt,
					text,
					parentId,
					selection: normalizedSelection,
					author,
					noteId: String(item.noteId || "").trim(),
				};
			})
			.filter(Boolean)
			.slice(0, 200);
	}

	async function loadCommentsForRoom() {
		const { scopeId, apiUrl } = getCommentScopeRequestInfo();
		const scopeChanged = commentActiveNoteId !== scopeId;
		commentActiveNoteId = scopeId;
		// Only clear immediately when switching to a different scope
		// to avoid badge flickering to 0 on same-scope reload
		if (scopeChanged) {
			commentItems = [];
			renderCommentList();
			updateCommentOverlay();
		}
		if (!canSyncCommentsForScope(scopeId) || !apiUrl) {
			if (!scopeChanged) {
				commentItems = [];
				renderCommentList();
				updateCommentOverlay();
			}
			return;
		}
		// Wait for any in-flight comment save to finish before loading
		if (commentSavePromise) {
			try { await commentSavePromise; } catch { /* ignore */ }
		}
		const token = ++commentLoadToken;
		try {
			const res = await api(apiUrl);
			if (commentLoadToken !== token) return;
			if (getCommentScopeId() !== scopeId) return;
			commentItems = normalizeCommentItems(res && res.comments ? res.comments : []);
			commentActiveNoteId = scopeId;
		} catch {
			if (commentLoadToken !== token) return;
			if (getCommentScopeId() !== scopeId) return;
			commentItems = [];
		}
		renderCommentList();
		updateCommentOverlay();
	}

	function scheduleCommentSave(scopeId) {
		if (!canSyncCommentsForScope(scopeId)) return;
		commentSaveNoteId = scopeId;
		if (commentSaveTimer) window.clearTimeout(commentSaveTimer);
		// Persist immediately to avoid race with loadCommentsForRoom
		// overwriting local state before the save completes
		void persistCommentsForScope(scopeId);
	}

	async function persistCommentsForScope(scopeId) {
		const { scopeId: resolvedScopeId, apiUrl } = getCommentScopeRequestInfo();
		if (!canSyncCommentsForScope(scopeId)) return;
		if (!apiUrl || resolvedScopeId !== scopeId) return;
		const payload = commentItems.slice(0, 200);
		const p = (async () => {
			try {
				const res = await api(apiUrl, {
					method: "PUT",
					body: JSON.stringify({ comments: payload }),
				});
				if (getCommentScopeId() !== scopeId) return;
				const updatedAt = Number(res && res.updatedAt ? res.updatedAt : 0) || 0;
				if (scopeId.startsWith("note:")) {
					const noteId = scopeId.slice(5);
					if (noteId) {
						if (payload.length > 0) psCommentedNoteIds.add(noteId);
						else psCommentedNoteIds.delete(noteId);
					}
				} else if (scopeId.startsWith("room:")) {
					const editNoteId = String(psEditingNoteId || "").trim();
					if (editNoteId) {
						if (payload.length > 0) psCommentedNoteIds.add(editNoteId);
						else psCommentedNoteIds.delete(editNoteId);
					}
				}
				const hasCommentFilter = psCommentsOnly || String(psSearchQuery || "").toLowerCase().includes("has:comment");
				if (hasCommentFilter) applyPersonalSpaceFiltersAndRender();
				sendMessage({
					type: "comment_update",
					room,
					clientId,
					scopeId,
					comments: payload,
					updatedAt,
				});
			} catch {
				// ignore
			}
		})();
		commentSavePromise = p;
		p.finally(() => {
			if (commentSavePromise === p) commentSavePromise = null;
		});
		return p;
	}

	function saveCommentsForRoom() {
		const scopeId = getCommentScopeId();
		if (!scopeId) return;
		scheduleCommentSave(scopeId);
	}

	function normalizeCommentSelection(entry, value) {
		if (!entry || !entry.selection || typeof value !== "string") return null;
		const sel = entry.selection;
		let start = Math.max(0, Math.min(value.length, Number(sel.start || 0)));
		let end = Math.max(start, Math.min(value.length, Number(sel.end || 0)));
		const text = String(sel.text || "").trim();
		if (text && value.slice(start, end) !== text) {
			const idx = value.indexOf(text);
			if (idx >= 0) {
				start = idx;
				end = idx + text.length;
			} else {
				// Selection text not found in current content → no highlight
				return null;
			}
		}
		if (end <= start) return null;
		return { start, end, text: text || value.slice(start, end) };
	}

	/**
	 * Returns comment items visible for the current note context.
	 * - Comments WITHOUT text-selection (room-level) are always visible.
	 * - Comments WITH text-selection + noteId are only visible when
	 *   that note is currently displayed.
	 * - Legacy comments WITH text-selection but WITHOUT noteId are only
	 *   visible when their selection text exists in the current editor content.
	 */
	function getVisibleCommentItems() {
		const activeNoteId = getCommentSelectionNoteId();
		const editorText = textarea ? String(textarea.value || "") : "";
		return commentItems.filter((entry) => {
			if (!entry) return false;
			// No text-selection → room-level comment, always visible
			if (!entry.selection) return true;
			// Has noteId → only visible when that note is active
			if (entry.noteId) {
				if (!activeNoteId) return true;
				return entry.noteId === activeNoteId;
			}
			// Legacy (no noteId): only show if selection text exists in current editor
			const selText = entry.selection && entry.selection.text
				? String(entry.selection.text || "").trim() : "";
			if (!selText) return true;
			return editorText.includes(selText);
		});
	}

	function buildCommentOverlayHtml(value) {
		if (!value) return "";
		const visible = getVisibleCommentItems();
		const ranges = visible
			.map((entry) => {
				const normalized = normalizeCommentSelection(entry, value);
				if (!normalized) return null;
				const authorColor = entry.author && entry.author.color
					? String(entry.author.color) : "";
				return { id: entry.id, authorColor, ...normalized };
			})
			.filter(Boolean)
			.sort((a, b) => a.start - b.start);
		if (!ranges.length) return "";
		let out = "";
		let cursor = 0;
		let lastEnd = 0;
		for (const range of ranges) {
			if (range.start < lastEnd) continue;
			out += escapeHtml(value.slice(cursor, range.start));
			const colorStyle = range.authorColor
				? ` style="background:${escapeHtmlAttr(range.authorColor)}33;box-shadow:inset 0 0 0 1px ${escapeHtmlAttr(range.authorColor)}73"`
				: "";
			out += `<span class="comment-span" data-comment-id="${escapeHtmlAttr(
				range.id
			)}"${colorStyle}>${escapeHtml(value.slice(range.start, range.end))}</span>`;
			cursor = range.end;
			lastEnd = range.end;
		}
		out += escapeHtml(value.slice(cursor));
		return out;
	}

	function syncCommentOverlayScroll() {
		if (!commentOverlayContent || !textarea) return;
		const x = Number(textarea.scrollLeft || 0);
		const y = Number(textarea.scrollTop || 0);
		commentOverlayContent.style.transform = `translate(${-x}px, ${-y}px)`;
	}

	function updateCommentOverlay() {
		if (!commentOverlay || !commentOverlayContent) return;
		const scopeId = getCommentScopeId();
		if (!scopeId || commentActiveNoteId !== scopeId || !commentItems.length) {
			commentOverlay.classList.add("hidden");
			commentOverlayContent.textContent = "";
			return;
		}
		const value = String(textarea && textarea.value ? textarea.value : "");
		if (!value) {
			commentOverlay.classList.add("hidden");
			commentOverlayContent.textContent = "";
			return;
		}
		const html = buildCommentOverlayHtml(value);
		if (!html) {
			commentOverlay.classList.add("hidden");
			commentOverlayContent.textContent = "";
			return;
		}
		commentOverlayContent.innerHTML = html;
		commentOverlay.classList.remove("hidden");
		syncCommentOverlayScroll();
	}

	function setCommentPanelOpen(open) {
		commentPanelOpen = Boolean(open);
		if (commentPanel && commentPanel.classList) {
			commentPanel.classList.toggle("hidden", !commentPanelOpen);
		}
		if (editorPreviewGrid && editorPreviewGrid.classList) {
			editorPreviewGrid.classList.toggle(
				"comment-panel-open",
				commentPanelOpen
			);
		}
		if (toggleCommentsBtn) {
			toggleCommentsBtn.setAttribute(
				"aria-pressed",
				commentPanelOpen ? "true" : "false"
			);
			toggleCommentsBtn.classList.toggle(
				"bg-fuchsia-500/20",
				commentPanelOpen
			);
			toggleCommentsBtn.classList.toggle(
				"border-fuchsia-400/40",
				commentPanelOpen
			);
		}
		if (commentPanelOpen) {
			if (
				!isRoomMarkedShared(room, key) &&
				!getCommentNoteId() &&
				psState &&
				psState.authed &&
				textarea
			) {
				syncPsEditingNoteFromEditorText(String(textarea.value || ""), {
					clear: false,
					updateList: true,
				});
			}
			void loadCommentsForRoom();
		}
		updateCommentOverlay();
	}

	function setCommentDraftSelection(selection) {
		commentDraftSelection = selection;
		if (!commentSelectionLabel) return;
		if (!selection || !selection.text) {
			let prefix = "Ohne Textmarkierung";
			if (commentEditId) prefix = "Bearbeiten ohne Textmarkierung";
			else if (commentReplyToId) prefix = "Antwort ohne Textmarkierung";
			commentSelectionLabel.textContent = `${prefix}.`;
			return;
		}
		const trimmed =
			selection.text.length > 120
				? `${selection.text.slice(0, 120).trim()}…`
				: selection.text;
			let prefix = "Auswahl";
			if (commentEditId) prefix = "Bearbeiten";
			else if (commentReplyToId) prefix = "Antwort";
			commentSelectionLabel.textContent = `${prefix}: "${trimmed}"`;
	}

	function updateCommentComposerUi() {
		if (!commentAddBtn) return;
		let actionKey = "comments.add_action";
		if (commentEditId) actionKey = "comments.save_action";
		else if (commentReplyToId) actionKey = "comments.reply_action";
		commentAddBtn.setAttribute("data-i18n-title", actionKey);
		commentAddBtn.setAttribute("data-i18n-aria", actionKey);
		if (commentAddLabel) {
			commentAddLabel.setAttribute("data-i18n", actionKey);
		}
		applyUiTranslations();
	}

	function setCommentComposerState({ editId, replyToId, selection, text }) {
		commentEditId = editId || "";
		commentReplyToId = replyToId || "";
		if (commentInput && typeof text === "string") {
			commentInput.value = text;
		}
		setCommentDraftSelection(selection || null);
		updateCommentComposerUi();
	}

	function clearCommentComposerState() {
		commentEditId = "";
		commentReplyToId = "";
		if (commentInput) commentInput.value = "";
		setCommentDraftSelection(null);
		updateCommentComposerUi();
	}

	function applyCommentMarkdown(action) {
		if (!commentInput) return;
		commentInput.focus();
		const start = Number(commentInput.selectionStart || 0);
		const end = Number(commentInput.selectionEnd || 0);
		if (action === "bold") {
			if (!wrapSelectionToggle(commentInput, "**", "**")) {
				wrapSelection(commentInput, "**", "**");
			}
			return;
		}
		if (action === "italic") {
			if (!wrapSelectionToggle(commentInput, "*", "*")) {
				wrapSelection(commentInput, "*", "*");
			}
			return;
		}
		if (action === "code") {
			if (end > start) {
				toggleFencedCodeBlock(commentInput);
				return;
			}
			const value = String(commentInput.value || "");
			const insert = "```\n\n```";
			commentInput.value = value.slice(0, start) + insert + value.slice(end);
			const pos = start + 4;
			commentInput.selectionStart = pos;
			commentInput.selectionEnd = pos;
		}
	}

	function renderCommentList() {
		if (!commentList) return;
		commentList.innerHTML = "";
		// Filter: room-level comments always visible; text-marked comments
		// only when their noteId matches the currently displayed note.
		const visibleItems = getVisibleCommentItems();
		if (
			commentSelectedId &&
			!visibleItems.some((it) => String(it && it.id ? it.id : "") === commentSelectedId)
		) {
			commentSelectedId = "";
		}
		if (commentEmpty) {
			commentEmpty.classList.toggle("hidden", visibleItems.length > 0);
		}
		if (commentCountBadge) {
			const count = visibleItems.length;
			commentCountBadge.textContent = String(count);
			commentCountBadge.classList.toggle("hidden", count === 0);
		}
		const orderedComments = visibleItems
			.slice()
			.sort(
				(a, b) =>
					(Number(a && a.createdAt ? a.createdAt : 0) || 0) -
						(Number(b && b.createdAt ? b.createdAt : 0) || 0) ||
					String(a && a.id ? a.id : "").localeCompare(
						String(b && b.id ? b.id : "")
					)
			);
		orderedComments.forEach((entry) => {
			const item = document.createElement("div");
			const isReply = Boolean(entry && entry.parentId);
			item.className =
				"comment-item rounded-lg border border-white/10 bg-slate-950/50 p-2 text-sm text-slate-100" +
				(isReply ? " ml-4 border-l-2 border-l-white/10" : "");
			item.title = entry && entry.selection ? entry.selection.text || "" : "";
			item.setAttribute("data-comment-id", entry.id || "");
			item.classList.toggle("is-selected", commentSelectedId === entry.id);
			const header = document.createElement("div");
			header.className = "mb-1 flex items-center justify-between";
			const left = document.createElement("div");
			left.className = "flex items-center gap-2";
			const avatar = document.createElement("span");
			avatar.className =
				"inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-[12px]";
			avatar.textContent =
				entry && entry.author && entry.author.avatar
					? entry.author.avatar
					: "ƒæñ";
			if (entry && entry.author && entry.author.color) {
				avatar.style.background = entry.author.color;
			}
			const meta = document.createElement("div");
			meta.className = "flex flex-col";
			const name = document.createElement("span");
			name.className = "text-[11px] font-medium text-slate-200";
			name.textContent =
				entry && entry.author && entry.author.name
					? entry.author.name
					: "User";
			const time = document.createElement("span");
			time.className = "text-[10px] text-slate-400";
			const baseTime = formatCommentTime(entry.createdAt);
			const wasEdited =
				entry.updatedAt && entry.updatedAt > entry.createdAt + 1000;
			time.textContent = wasEdited ? `${baseTime} · bearbeitet` : baseTime;
			left.appendChild(avatar);
			meta.appendChild(name);
			meta.appendChild(time);
			left.appendChild(meta);
			if (isReply) {
				const replyTag = document.createElement("span");
				replyTag.className =
					"comment-reply-badge rounded-full px-2 py-0.5 text-[10px] font-semibold";
				replyTag.textContent = "Antwort";
				left.appendChild(replyTag);
			}
			header.appendChild(left);
			const actions = document.createElement("div");
			actions.className = "comment-actions flex items-center gap-1";
			const editBtn = document.createElement("button");
			editBtn.type = "button";
			editBtn.className =
				"comment-action-btn inline-flex h-6 w-6 items-center justify-center rounded-md";
			editBtn.title = t("comments.edit_action");
			editBtn.setAttribute("data-i18n-title", "comments.edit_action");
			editBtn.setAttribute("data-i18n-aria", "comments.edit_action");
			editBtn.innerHTML =
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"h-3.5 w-3.5\"><path d=\"M12 20h9\" /><path d=\"M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z\" /></svg>";
			const replyBtn = document.createElement("button");
			replyBtn.type = "button";
			replyBtn.className =
				"comment-action-btn inline-flex h-6 w-6 items-center justify-center rounded-md";
			replyBtn.title = t("comments.reply_action");
			replyBtn.setAttribute("data-i18n-title", "comments.reply_action");
			replyBtn.setAttribute("data-i18n-aria", "comments.reply_action");
			replyBtn.innerHTML =
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"h-3.5 w-3.5\"><path d=\"M9 17l-5-5 5-5\" /><path d=\"M4 12h10a6 6 0 0 1 6 6v2\" /></svg>";
			const deleteBtn = document.createElement("button");
			deleteBtn.type = "button";
			deleteBtn.className =
				"comment-action-btn inline-flex h-6 w-6 items-center justify-center rounded-md";
			deleteBtn.setAttribute("data-i18n-title", "comments.delete_action");
			deleteBtn.setAttribute("data-i18n-aria", "comments.delete_action");
			deleteBtn.innerHTML =
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"h-3.5 w-3.5\"><path d=\"M3 6h18\" /><path d=\"M8 6V4h8v2\" /><path d=\"M6 6l1 16h10l1-16\" /><path d=\"M10 11v6\" /><path d=\"M14 11v6\" /></svg>";
			actions.appendChild(editBtn);
			actions.appendChild(replyBtn);
			actions.appendChild(deleteBtn);
			header.appendChild(actions);
			const body = document.createElement("div");
			body.className = "comment-body text-sm text-slate-100";
			const rawText = entry.text || "";
			const renderer = ensureMarkdown();
			if (renderer) {
				try {
					body.innerHTML = applyHljsToHtml(renderer.render(String(rawText)));
				} catch {
					body.textContent = rawText;
				}
			} else {
				body.textContent = rawText;
			}
			const selection = document.createElement("div");
			selection.className =
				"mb-2 rounded-md bg-white/5 px-2 py-1 text-[11px] text-slate-300";
			selection.textContent = entry.selection ? entry.selection.text || "" : "";
			item.appendChild(header);
			if (selection.textContent) {
				item.appendChild(selection);
			}
			item.appendChild(body);
			commentList.appendChild(item);
			item.addEventListener("click", () => {
				commentSelectedId = entry.id || "";
				commentList
					.querySelectorAll(".comment-item.is-selected")
					.forEach((el) => el.classList.remove("is-selected"));
				item.classList.add("is-selected");
				if (!textarea || !entry.selection) return;
				const value = String(textarea.value || "");
				const normalized = normalizeCommentSelection(entry, value);
				if (!normalized) return;
				textarea.focus();
				try {
					textarea.setSelectionRange(normalized.start, normalized.end);
				} catch {
					// ignore
				}
				updateSelectionMenu();
				updateCommentOverlay();
			});
			editBtn.addEventListener("click", (ev) => {
				if (ev) ev.stopPropagation();
				setCommentPanelOpen(true);
				setCommentComposerState({
					editId: entry.id,
					replyToId: "",
					selection: entry.selection,
					text: entry.text || "",
				});
				if (commentInput) commentInput.focus();
			});
			replyBtn.addEventListener("click", (ev) => {
				if (ev) ev.stopPropagation();
				setCommentPanelOpen(true);
				setCommentComposerState({
					editId: "",
					replyToId: entry.id,
					selection: entry.selection,
					text: "",
				});
				if (commentInput) commentInput.focus();
			});
			deleteBtn.addEventListener("click", (ev) => {
				if (ev) ev.stopPropagation();
				const targetId = String(entry.id || "");
				if (!targetId) return;
				commentItems = commentItems.filter(
					(it) => it.id !== targetId && it.parentId !== targetId
				);
				saveCommentsForRoom();
				renderCommentList();
				updateCommentOverlay();
				if (commentEditId === targetId || commentReplyToId === targetId) {
					clearCommentComposerState();
				}
			});
		});
		applyUiTranslations();
	}

	async function addCommentFromDraft() {
		if (!commentInput) return;
		const text = String(commentInput.value || "").trim();
		if (!text) return;
		const scopeId = await ensureCommentScopeId();
		if (!scopeId) {
			toast("Kommentare sind nur für Notizen verfügbar.", "error");
			return;
		}
		let selection = commentDraftSelection;
		if (!selection) {
			const range = getSelectionRange();
			if (range && textarea) {
				const value = String(textarea.value || "");
				const selectedText = value.slice(range.start, range.end).trim();
				if (selectedText) {
					selection = {
						start: range.start,
						end: range.end,
						text: selectedText,
					};
				}
			}
		}
		let resolvedSelection = selection || null;
		if (!resolvedSelection && commentEditId) {
			const existing = commentItems.find((it) => it.id === commentEditId);
			resolvedSelection = existing && existing.selection ? existing.selection : null;
		}
		if (commentEditId) {
			const idx = commentItems.findIndex((it) => it.id === commentEditId);
			if (idx >= 0) {
				commentItems[idx] = {
					...commentItems[idx],
					text,
					updatedAt: Date.now(),
					selection: resolvedSelection,
					noteId: getCommentSelectionNoteId(),
				};
			}
			clearCommentComposerState();
			renderCommentList();
			saveCommentsForRoom();
			updateCommentOverlay();
			return;
		}
		const nextEntry = {
			id: `c_${Date.now().toString(36)}_${Math.random()
				.toString(36)
				.slice(2, 7)}`,
			createdAt: Date.now(),
			text,
			selection: resolvedSelection,
			parentId: commentReplyToId || "",
			author: identity,
			noteId: getCommentSelectionNoteId(),
		};
		if (commentReplyToId) {
			const idx = commentItems.findIndex(
				(it) => it.id === commentReplyToId
			);
			if (idx >= 0) {
				commentItems.splice(idx + 1, 0, nextEntry);
			} else {
				commentItems.unshift(nextEntry);
			}
		} else {
			commentItems.unshift(nextEntry);
		}
		clearCommentComposerState();
		renderCommentList();
		saveCommentsForRoom();
		updateCommentOverlay();
	}

	async function openCommentFromSelection() {
		if (!textarea) return;
		const scopeId = await ensureCommentScopeId();
		if (!scopeId) {
			toast("Kommentare sind nur für Notizen verfügbar.", "error");
			return;
		}
		const range = getSelectionRange();
		if (!range) return;
		const value = String(textarea.value || "");
		const selectedText = value.slice(range.start, range.end).trim();
		if (!selectedText) return;
		setCommentDraftSelection({
			start: range.start,
			end: range.end,
			text: selectedText,
		});
		commentEditId = "";
		commentReplyToId = "";
		updateCommentComposerUi();
		setCommentPanelOpen(true);
		if (commentInput) commentInput.focus();
		setSelectionMenuOpen(false);
	}

	function getSelectionLineRange(value, start, end) {
		const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
		const lineEndIdx = value.indexOf("\n", end);
		const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
		return { lineStart, lineEnd };
	}

	function wrapSelection(el, left, right) {
		if (!el) return;
		const value = String(el.value || "");
		const start = Number(el.selectionStart || 0);
		const end = Number(el.selectionEnd || 0);
		const inner = start < end ? value.slice(start, end) : "";
		const next = `${left}${inner}${right}`;
		el.value = value.slice(0, start) + next + value.slice(end);
		el.selectionStart = start + left.length;
		el.selectionEnd = start + left.length + inner.length;
	}

	function wrapSelectionToggle(el, left, right) {
		if (!el) return false;
		const value = String(el.value || "");
		const start = Number(el.selectionStart || 0);
		const end = Number(el.selectionEnd || 0);
		if (end <= start) return false;
		const selected = value.slice(start, end);
		if (
			selected.startsWith(left) &&
			selected.endsWith(right) &&
			selected.length >= left.length + right.length
		) {
			const inner = selected.slice(left.length, selected.length - right.length);
			el.value = value.slice(0, start) + inner + value.slice(end);
			el.selectionStart = start;
			el.selectionEnd = start + inner.length;
			return true;
		}
		const beforeStart = start - left.length;
		const afterEnd = end + right.length;
		if (
			beforeStart >= 0 &&
			afterEnd <= value.length &&
			value.slice(beforeStart, start) === left &&
			value.slice(end, afterEnd) === right
		) {
			el.value =
				value.slice(0, beforeStart) +
				value.slice(start, end) +
				value.slice(afterEnd);
			el.selectionStart = beforeStart;
			el.selectionEnd = beforeStart + (end - start);
			return true;
		}
		const next = `${left}${selected}${right}`;
		el.value = value.slice(0, start) + next + value.slice(end);
		el.selectionStart = start + left.length;
		el.selectionEnd = start + left.length + selected.length;
		return true;
	}

	function prefixSelectionLines(el, prefix, numbered) {
		if (!el) return;
		const value = String(el.value || "");
		const start = Number(el.selectionStart || 0);
		const end = Number(el.selectionEnd || 0);
		const { lineStart, lineEnd } = getSelectionLineRange(value, start, end);
		const block = value.slice(lineStart, lineEnd);
		const lines = block.split("\n");
		const nextLines = lines.map((line, idx) => {
			const base = String(line || "");
			if (!base.trim()) return base;
			if (numbered) {
				const clean = base.replace(/^\s*\d+\.\s+/, "");
				return `${idx + 1}. ${clean}`;
			}
			return base.startsWith(prefix) ? base : `${prefix}${base}`;
		});
		const nextBlock = nextLines.join("\n");
		el.value = value.slice(0, lineStart) + nextBlock + value.slice(lineEnd);
		el.selectionStart = lineStart;
		el.selectionEnd = lineStart + nextBlock.length;
	}

	function togglePrefixSelectionLines(el, prefix, mode) {
		if (!el) return;
		const value = String(el.value || "");
		const start = Number(el.selectionStart || 0);
		const end = Number(el.selectionEnd || 0);
		const { lineStart, lineEnd } = getSelectionLineRange(value, start, end);
		const block = value.slice(lineStart, lineEnd);
		const lines = block.split("\n");
		const nonEmpty = lines.filter((line) => String(line || "").trim());
		const hasPrefix = nonEmpty.length
			? nonEmpty.every((line) => {
				const src = String(line || "");
				if (mode === "numbered") return /^\s*\d+\.\s+/.test(src);
				if (mode === "task") return /^\s*-\s\[(?: |x|X)\]\s+/.test(src);
				if (mode === "ul") return /^\s*[-*+]\s+/.test(src);
				if (mode === "quote") return /^\s*>\s?/.test(src);
				return src.startsWith(prefix);
			})
			: false;
		const nextLines = lines.map((line, idx) => {
			const src = String(line || "");
			if (!src.trim()) return src;
			if (hasPrefix) {
				if (mode === "numbered") return src.replace(/^\s*\d+\.\s+/, "");
				if (mode === "task")
					return src.replace(/^\s*-\s\[(?: |x|X)\]\s+/, "");
				if (mode === "ul") return src.replace(/^\s*[-*+]\s+/, "");
				if (mode === "quote") return src.replace(/^\s*>\s?/, "");
				return src.startsWith(prefix) ? src.slice(prefix.length) : src;
			}
			if (mode === "numbered") {
				const clean = src.replace(/^\s*\d+\.\s+/, "");
				return `${idx + 1}. ${clean}`;
			}
			return `${prefix}${src}`;
		});
		const nextBlock = nextLines.join("\n");
		el.value = value.slice(0, lineStart) + nextBlock + value.slice(lineEnd);
		el.selectionStart = lineStart;
		el.selectionEnd = lineStart + nextBlock.length;
	}

	function toggleDividerAtSelection(el) {
		if (!el) return;
		const value = String(el.value || "");
		const start = Number(el.selectionStart || 0);
		const end = Number(el.selectionEnd || 0);
		const { lineStart, lineEnd } = getSelectionLineRange(value, start, end);
		const block = value.slice(lineStart, lineEnd);
		const lines = block.split("\n");
		const nonEmpty = lines.filter((line) => String(line || "").trim());
		const isSingleDivider =
			nonEmpty.length === 1 && String(nonEmpty[0] || "").trim() === "---";
		if (isSingleDivider) {
			const afterLine = lineEnd < value.length ? lineEnd + 1 : lineEnd;
			el.value = value.slice(0, lineStart) + value.slice(afterLine);
			el.selectionStart = lineStart;
			el.selectionEnd = lineStart;
			return;
		}
		const nextBlock = "---";
		el.value = value.slice(0, lineStart) + nextBlock + value.slice(lineEnd);
		el.selectionStart = lineStart;
		el.selectionEnd = lineStart + nextBlock.length;
	}

	function toggleFencedCodeBlock(el) {
		if (!el) return;
		const value = String(el.value || "");
		const start = Number(el.selectionStart || 0);
		const end = Number(el.selectionEnd || 0);
		if (end <= start) return;
		const selected = value.slice(start, end);
		const selectedLines = selected.split("\n");
		const firstLine = String(selectedLines[0] || "");
		const lastLine = String(selectedLines[selectedLines.length - 1] || "");
		const isWrappedInSelection =
			/^\s*```/.test(firstLine) && /^\s*```/.test(lastLine);
		if (isWrappedInSelection && selectedLines.length >= 2) {
			const innerLines = selectedLines.slice(1, -1);
			const inner = innerLines.join("\n");
			el.value = value.slice(0, start) + inner + value.slice(end);
			el.selectionStart = start;
			el.selectionEnd = start + inner.length;
			return;
		}
		const { lineStart, lineEnd } = getSelectionLineRange(value, start, end);
		const prevLineStart = value.lastIndexOf("\n", Math.max(0, lineStart - 2)) + 1;
		const prevLineEnd = Math.max(prevLineStart, lineStart - 1);
		const nextLineStart = lineEnd < value.length ? lineEnd + 1 : value.length;
		let nextLineEnd = value.indexOf("\n", nextLineStart);
		if (nextLineEnd === -1) nextLineEnd = value.length;
		const prevLine = value.slice(prevLineStart, prevLineEnd);
		const nextLine = value.slice(nextLineStart, nextLineEnd);
		if (/^\s*```/.test(prevLine) && /^\s*```/.test(nextLine)) {
			const afterNext = nextLineEnd < value.length ? nextLineEnd + 1 : nextLineEnd;
			const inner = value.slice(lineStart, lineEnd);
			el.value = value.slice(0, prevLineStart) + inner + value.slice(afterNext);
			el.selectionStart = prevLineStart;
			el.selectionEnd = prevLineStart + inner.length;
			return;
		}
		const lang = getSelectedCodeLang();
		const opening = "```" + String(lang || "");
		const insert = `${opening}\n${selected}\n\`\`\``;
		el.value = value.slice(0, start) + insert + value.slice(end);
		el.selectionStart = start + opening.length + 1;
		el.selectionEnd = start + opening.length + 1 + selected.length;
	}

	function sortSelectionLines(el) {
		if (!el) return;
		const value = String(el.value || "");
		const start = Number(el.selectionStart || 0);
		const end = Number(el.selectionEnd || 0);
		const { lineStart, lineEnd } = getSelectionLineRange(value, start, end);
		const block = value.slice(lineStart, lineEnd);
		const lines = block.split("\n");
		const sorted = lines.slice().sort((a, b) =>
			String(a || "").localeCompare(String(b || ""), undefined, {
				numeric: true,
				sensitivity: "base",
			})
		);
		const nextBlock = sorted.join("\n");
		el.value = value.slice(0, lineStart) + nextBlock + value.slice(lineEnd);
		el.selectionStart = lineStart;
		el.selectionEnd = lineStart + nextBlock.length;
	}

	function applySelectionAction(action) {
		if (!textarea) return;
		const before = String(textarea.value || "");
		switch (action) {
			case "help":
				setSelectionMenuOpen(false);
				void showSelectionHelp();
				return;
			case "bold":
				wrapSelectionToggle(textarea, "**", "**");
				break;
			case "italic":
				wrapSelectionToggle(textarea, "*", "*");
				break;
			case "strike":
				wrapSelectionToggle(textarea, "~~", "~~");
				break;
			case "password":
				wrapSelection(textarea, "||", "||");
				try {
					const pos = Number(textarea.selectionEnd || 0);
					textarea.setSelectionRange(pos, pos);
				} catch {
					// ignore
				}
				break;

			case "quote":
				togglePrefixSelectionLines(textarea, "> ", "quote");
				break;
			case "ul":
				togglePrefixSelectionLines(textarea, "- ", "ul");
				break;
			case "ol":
				togglePrefixSelectionLines(textarea, "", "numbered");
				break;
			case "todo":
				togglePrefixSelectionLines(textarea, "- [ ] ", "task");
				break;
			case "divider":
				toggleDividerAtSelection(textarea);
				break;
			case "code":
				toggleFencedCodeBlock(textarea);
				updateCodeLangOverlay();
				break;
			case "link": {
				const value = String(textarea.value || "");
				const start = Number(textarea.selectionStart || 0);
				const end = Number(textarea.selectionEnd || 0);
				if (end <= start) return;
				const selected = value.slice(start, end);
				const urlPlaceholder = "https://";
				const insert = `[${selected}](${urlPlaceholder})`;
				textarea.value = value.slice(0, start) + insert + value.slice(end);
				const urlStart = start + selected.length + 3;
				textarea.selectionStart = urlStart;
				textarea.selectionEnd = urlStart + urlPlaceholder.length;
				break;
			}
			case "comment":
				void openCommentFromSelection();
				return;
			case "sort":
				sortSelectionLines(textarea);
				break;
			default:
				return;
		}
		const after = String(textarea.value || "");
		const changed = before !== after;
		try {
			textarea.focus();
		} catch {
			// ignore
		}
		if (changed) {
			metaLeft.textContent = "Formatting";
			metaRight.textContent = nowIso();
			const canSyncRoom = shouldSyncRoomContentNow();
			if (canSyncRoom) {
				if (isCrdtEnabled()) {
					updateCrdtFromTextarea();
				} else {
					scheduleSend();
				}
			}
			setTyping(true);
			scheduleTypingStop();
			scheduleSelectionSend();
			const noteId = getRoomTabNoteIdForRoom(room, key);
			const activePsNoteId = getActiveRoomTabNoteId();
			if (canSyncRoom) {
				updateRoomTabTextLocal(room, key, textarea.value);
				if (noteId) updateLocalNoteText(noteId, textarea.value);
				scheduleRoomTabSync({
					room,
					key,
					text: resolveRoomTabSnapshotText(
						noteId,
						String(textarea.value || "")
					),
					lastUsed: Date.now(),
				});
			}
			if (activePsNoteId && activePsNoteId !== noteId) {
				updateLocalNoteText(activePsNoteId, textarea.value);
			}
		}
		updatePreview();
		updateCommentOverlay();
		updateSlashMenu();
		updateWikiMenu();
		updateCodeLangOverlay();
		updateTableMenuVisibility();
		updateSelectionMenu();
		updateEditorMetaScroll();
		if (!changed) scheduleSend();
		schedulePsAutoSave();
		setSelectionMenuOpen(false);
	}

	function updateSelectionMenu() {
		if (!selectionMenu || !textarea) return;
		if (slashMenuOpen || wikiMenuOpen) {
			setSelectionMenuOpen(false);
			return;
		}
		if (document.activeElement !== textarea) {
			setSelectionMenuOpen(false);
			return;
		}
		const range = getSelectionRange();
		if (!range) {
			setSelectionMenuOpen(false);
			return;
		}
		setSelectionMenuOpen(true);
		const caretPos =
			textarea.selectionDirection === "backward" ? range.start : range.end;
		positionFloatingMenu(selectionMenu, textarea, caretPos, 2);
	}

	function getWikiContext() {
		if (!textarea)
			return {
				active: false,
				start: 0,
				end: 0,
				query: "",
			};
		const value = String(textarea.value || "");
		const caret = Math.max(
			0,
			Math.min(value.length, Number(textarea.selectionEnd || 0))
		);
		const lineStart = value.lastIndexOf("\n", caret - 1) + 1;
		const lineEnd = value.indexOf("\n", caret);
		const end = lineEnd === -1 ? value.length : lineEnd;
		const line = value.slice(lineStart, end);
		const relCaret = caret - lineStart;
		const uptoCaret = line.slice(0, relCaret);
		const startIdx = uptoCaret.lastIndexOf("[[");
		if (startIdx === -1) return { active: false, start: 0, end: 0, query: "" };
		if (uptoCaret.slice(startIdx + 2).includes("]]")) {
			return { active: false, start: 0, end: 0, query: "" };
		}
		const query = uptoCaret.slice(startIdx + 2);
		return {
			active: true,
			start: lineStart + startIdx,
			end: lineStart + relCaret,
			query,
		};
	}

	function renderWikiMenu() {
		if (!wikiMenuList) return;
		if (!wikiMenuItems.length) {
			wikiMenuList.innerHTML =
				'<div class="px-3 py-2 text-xs text-slate-400">Keine Treffer.</div>';
			return;
		}
		wikiMenuList.innerHTML = wikiMenuItems
			.map((it, idx) => {
				const active = idx === wikiMenuIndex;
				const base =
					"w-full text-left rounded-lg px-3 py-2 text-sm transition flex items-center justify-between gap-3";
				const cls = active
					? "bg-fuchsia-500/15 text-fuchsia-100"
					: "hover:bg-white/5 text-slate-200";
				const right =
					'<span class="text-[11px] text-slate-500">' +
					String(it.when || "") +
					"</span>";
				return (
					`<button type="button" data-wiki-idx="${idx}" class="${base} ${cls}">` +
					`<span class="font-medium">${escapeHtml(
						String(it.title || "")
					)}</span>` +
					right +
					"</button>"
				);
			})
			.join("");

		wikiMenuList.querySelectorAll("button[data-wiki-idx]").forEach((btn) => {
			const pick = () => {
				const idx = Number(btn.getAttribute("data-wiki-idx") || 0);
				const it = wikiMenuItems[idx];
				if (!it) return;
				insertWikiLink(String(it.title || ""));
			};
			btn.addEventListener("pointerdown", (ev) => {
				if (ev) ev.preventDefault();
				btn.dataset.wikiHandled = "1";
				pick();
			});
			btn.addEventListener("click", () => {
				if (btn.dataset && btn.dataset.wikiHandled === "1") {
					btn.dataset.wikiHandled = "0";
					return;
				}
				pick();
			});
		});
	}

	function insertWikiLink(title) {
		if (!textarea) return;
		const t = String(title || "").trim();
		if (!t) return;
		const ctx = getWikiContext();
		if (!ctx.active) return;
		const insert = `[[${t}]]`;
		replaceTextRange(textarea, ctx.start, ctx.end, insert + " ");
		const pos = ctx.start + insert.length + 1;
		textarea.selectionStart = pos;
		textarea.selectionEnd = pos;
		setWikiMenuOpen(false);
		try {
			textarea.focus();
		} catch {
			// ignore
		}
		updatePreview();
	}

	function updateWikiMenu() {
		if (!textarea || !wikiMenu || !wikiMenuList) return;
		const ctx = getWikiContext();
		if (!ctx.active) {
			setWikiMenuOpen(false);
			return;
		}
		setSlashMenuOpen(false);
		const q = String(ctx.query || "")
			.trim()
			.toLowerCase();
		const notes = psState && Array.isArray(psState.notes) ? psState.notes : [];
		const sorted = notes
			.slice()
			.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
		const items = [];
		for (const note of sorted) {
			const title = getNoteTitle(note && note.text ? note.text : "");
			if (!title) continue;
			const titleLower = title.toLowerCase();
			if (q && !titleLower.includes(q)) continue;
			items.push({
				title,
				id: String(note && note.id ? note.id : ""),
				when: fmtDate(note && note.createdAt ? note.createdAt : 0),
			});
			if (items.length >= 12) break;
		}
		wikiMenuItems = items;
		wikiMenuIndex = 0;
		setWikiMenuOpen(true);
		renderWikiMenu();
	}

	function handleWikiMenuKey(ev) {
		if (!wikiMenuOpen) return false;
		if (!ev) return false;
		if (ev.key === "Escape") {
			ev.preventDefault();
			setWikiMenuOpen(false);
			return true;
		}
		if (ev.key === "ArrowDown") {
			ev.preventDefault();
			wikiMenuIndex = Math.min(wikiMenuItems.length - 1, wikiMenuIndex + 1);
			renderWikiMenu();
			return true;
		}
		if (ev.key === "ArrowUp") {
			ev.preventDefault();
			wikiMenuIndex = Math.max(0, wikiMenuIndex - 1);
			renderWikiMenu();
			return true;
		}
		if (ev.key === "Tab" || ev.key === "Enter") {
			ev.preventDefault();
			const it = wikiMenuItems[wikiMenuIndex];
			if (it) insertWikiLink(String(it.title || ""));
			return true;
		}
		return false;
	}

	function renderSlashMenu() {
		if (!slashMenuList) return;
		if (!slashMenuItems.length) {
			slashMenuList.innerHTML =
				`<div class="px-3 py-2 text-xs text-slate-400">${t(
					"slash.menu.empty",
					"No matches."
				)}</div>`;
			return;
		}
		slashMenuList.innerHTML = slashMenuItems
			.map((it, idx) => {
				const active = idx === slashMenuIndex;
				const base =
					"w-full text-left rounded-lg px-3 py-2 text-sm transition flex items-center justify-between gap-3";
				const cls = active
					? "bg-fuchsia-500/15 text-fuchsia-100"
					: "hover:bg-white/5 text-slate-200";
				const label = it.labelKey
					? t(it.labelKey, it.label || it.cmd)
					: String(it.label || it.cmd || "");
				const right =
					'<span class="text-[11px] text-slate-500">' +
					String(it.snippet || "") +
					"</span>";
				return (
					`<button type="button" data-slash-idx="${idx}" class="${base} ${cls}">` +
					`<span class="font-medium">${String(label || "")}</span>` +
					right +
					"</button>"
				);
			})
			.join("");

		slashMenuList.querySelectorAll("button[data-slash-idx]").forEach((btn) => {
			const pick = () => {
				const idx = Number(btn.getAttribute("data-slash-idx") || 0);
				const it = slashMenuItems[idx];
				if (!it) return;
				insertSlashSnippet(String(it.snippet || ""));
			};
			// Prevent the menu from stealing focus from the textarea on mouse/touch.
			btn.addEventListener("pointerdown", (ev) => {
				if (ev) ev.preventDefault();
				btn.dataset.slashHandled = "1";
				pick();
			});
			btn.addEventListener("click", () => {
				if (btn.dataset && btn.dataset.slashHandled === "1") {
					btn.dataset.slashHandled = "0";
					return;
				}
				pick();
			});
		});
	}

	function insertSlashSnippet(snippet) {
		if (!textarea) return;
		const s = String(snippet || "").trim();
		if (!s) return;
		const ctx = getSlashContext();
		if (!ctx.active) return;
		replaceTextRange(textarea, ctx.start, ctx.end, s);
		const pos = ctx.start + s.length;
		textarea.selectionStart = pos;
		textarea.selectionEnd = pos;
		setSlashMenuOpen(false);
		try {
			textarea.focus();
		} catch {
			// ignore
		}
		updatePreview();
	}

	function updateSlashMenu() {
		if (!textarea || !slashMenu || !slashMenuList) return;
		const wikiCtx = getWikiContext();
		if (wikiCtx.active) {
			setSlashMenuOpen(false);
			return;
		}
		const ctx = getSlashContext();
		if (!ctx.active) {
			setSlashMenuOpen(false);
			return;
		}
		const q = String(ctx.query || "");
		slashMenuItems = SLASH_SUGGESTIONS.filter((it) => {
			if (!q) return true;
			return String(it.cmd || "")
				.toLowerCase()
				.startsWith(q);
		}).slice(0, 12);
		// If the user typed an exact command that has no variants, hide the menu.
		if (ctx.exact && q) {
			const matchCount = SLASH_SUGGESTIONS.reduce((acc, it) => {
				const c = String(it.cmd || "").toLowerCase();
				return c.startsWith(q) ? acc + 1 : acc;
			}, 0);
			if (matchCount <= 1) {
				setSlashMenuOpen(false);
				return;
			}
		}
		slashMenuIndex = 0;
		setSlashMenuOpen(true);
		renderSlashMenu();
		positionFloatingMenu(
			slashMenu,
			textarea,
			Number(textarea.selectionEnd || 0),
			6
		);
	}

	function handleSlashMenuKey(ev) {
		if (!slashMenuOpen) return false;
		if (!ev) return false;
		if (ev.key === "Escape") {
			ev.preventDefault();
			setSlashMenuOpen(false);
			return true;
		}
		if (ev.key === "ArrowDown") {
			ev.preventDefault();
			slashMenuIndex = Math.min(slashMenuItems.length - 1, slashMenuIndex + 1);
			renderSlashMenu();
			return true;
		}
		if (ev.key === "ArrowUp") {
			ev.preventDefault();
			slashMenuIndex = Math.max(0, slashMenuIndex - 1);
			renderSlashMenu();
			return true;
		}
		if (ev.key === "Tab") {
			ev.preventDefault();
			const it = slashMenuItems[slashMenuIndex];
			if (it) insertSlashSnippet(String(it.snippet || ""));
			return true;
		}
		if (ev.key === "Enter") {
			const ctx = getSlashContext();
			// If the command is already an exact match, let the normal Enter handler
			// apply the slash-command (instead of re-inserting the snippet).
			if (ctx && ctx.exact) {
				setSlashMenuOpen(false);
				return false;
			}
			ev.preventDefault();
			const it = slashMenuItems[slashMenuIndex];
			if (it) insertSlashSnippet(String(it.snippet || ""));
			return true;
		}
		return false;
	}

	function renderTableRow(cells) {
		const safeCells = Array.isArray(cells) ? cells : [];
		return `| ${safeCells
			.map((cell) => String(cell || "").trim())
			.join(" | ")} |`;
	}

	function renderTableSeparator(aligns) {
		const safeAligns = Array.isArray(aligns) ? aligns : [];
		const parts = safeAligns.map((a) => {
			const left = a && a.left ? ":" : "";
			const right = a && a.right ? ":" : "";
			return `${left}---${right}`;
		});
		return `| ${parts.join(" | ")} |`;
	}

	function buildMarkdownTable(cols, rows) {
		const c = Math.max(1, Number(cols) || 2);
		const r = Math.max(1, Number(rows) || 2);
		const header = Array.from({ length: c }, (_, i) => `Header ${i + 1}`);
		const aligns = Array.from({ length: c }, () => ({
			left: false,
			right: false,
		}));
		const body = Array.from({ length: r }, () =>
			Array.from({ length: c }, () => "")
		);
		return [
			renderTableRow(header),
			renderTableSeparator(aligns),
			...body.map(renderTableRow),
		].join("\n");
	}

	function getLineIndexAtPos(text, pos) {
		const src = String(text || "");
		const p = Math.max(0, Math.min(src.length, Number(pos) || 0));
		let lineIndex = 0;
		for (let i = 0; i < p; i++) {
			if (src[i] === "\n") lineIndex += 1;
		}
		return lineIndex;
	}

	function isTableSeparator(line) {
		return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(String(line || ""));
	}

	function splitTableRow(line) {
		const raw = String(line || "").trim();
		const inner = raw.replace(/^\|/, "").replace(/\|$/, "");
		if (!inner) return [""];
		return inner.split("|").map((cell) => String(cell || "").trim());
	}

	function getColumnIndexFromCaret(line, caretCol, colCount) {
		const raw = String(line || "");
		const pipes = [];
		for (let i = 0; i < raw.length; i++) if (raw[i] === "|") pipes.push(i);
		if (!pipes.length) return 0;
		let before = 0;
		for (let i = 0; i < pipes.length; i++) if (pipes[i] < caretCol) before += 1;
		const hasLeadingPipe = /^\s*\|/.test(raw);
		let col = hasLeadingPipe ? before - 1 : before;
		if (col < 0) col = 0;
		const maxCol = Math.max(0, Number(colCount || 1) - 1);
		if (col > maxCol) col = maxCol;
		return col;
	}

	function getTableContext(src, caretPos) {
		const text = String(src || "");
		const lines = text.split("\n");
		const lineStarts = [];
		let acc = 0;
		for (let i = 0; i < lines.length; i++) {
			lineStarts[i] = acc;
			acc += lines[i].length + 1;
		}
		const lineIndex = getLineIndexAtPos(text, caretPos);
		if (lineIndex < 0 || lineIndex >= lines.length) return null;
		const isTableLine = (line) => /\|/.test(String(line || ""));
		let start = lineIndex;
		while (start > 0 && isTableLine(lines[start - 1])) start -= 1;
		let end = lineIndex;
		while (end < lines.length - 1 && isTableLine(lines[end + 1])) end += 1;
		const block = lines.slice(start, end + 1);
		const sepOffset = block.findIndex((line) => isTableSeparator(line));
		if (sepOffset <= 0) return null;
		const startPos = lineStarts[start];
		const endPos = lineStarts[end] + lines[end].length;
		const caretCol = Math.max(
			0,
			Number(caretPos || 0) - (lineStarts[lineIndex] || 0)
		);
		return {
			block,
			sepOffset,
			startPos,
			endPos,
			lineIndex,
			start,
			caretCol,
		};
	}

	function applyTableCommand(el, action, caretPos) {
		if (!el) return false;
		const src = String(el.value || "");
		const ctx = getTableContext(src, caretPos);
		if (!ctx) return false;
		const { block, sepOffset, startPos, endPos, lineIndex, start, caretCol } =
			ctx;
		const headerCells = splitTableRow(block[sepOffset - 1]);
		const sepCellsRaw = splitTableRow(block[sepOffset]);
		const bodyRowsRaw = block.slice(sepOffset + 1).map(splitTableRow);
		let colCount = Math.max(
			1,
			headerCells.length,
			sepCellsRaw.length,
			...bodyRowsRaw.map((row) => row.length)
		);
		const normalizeRow = (row) => {
			const out = Array.isArray(row) ? row.slice(0, colCount) : [];
			while (out.length < colCount) out.push("");
			return out;
		};
		let header = normalizeRow(headerCells);
		let sepAligns = normalizeRow(sepCellsRaw).map((cell) => {
			const s = String(cell || "").trim();
			return {
				left: s.startsWith(":") || s.startsWith("-:"),
				right: s.endsWith(":"),
			};
		});
		let body = bodyRowsRaw.map(normalizeRow);
		if (!body.length) body = [Array.from({ length: colCount }, () => "")];
		const relLine = lineIndex - start;
		let targetRow = relLine;
		if (targetRow <= sepOffset) targetRow = sepOffset + 1;
		let bodyIndex = targetRow - (sepOffset + 1);
		if (bodyIndex < 0) bodyIndex = 0;
		if (bodyIndex >= body.length) bodyIndex = body.length - 1;
		const lineForCol =
			block[Math.min(Math.max(relLine, 0), block.length - 1)] || "";
		const colIndex = getColumnIndexFromCaret(lineForCol, caretCol, colCount);
		if (action === "add-row") {
			body.splice(
				bodyIndex + 1,
				0,
				Array.from({ length: colCount }, () => "")
			);
		} else if (action === "del-row") {
			if (body.length > 1) body.splice(bodyIndex, 1);
			else body[0] = Array.from({ length: colCount }, () => "");
		} else if (action === "add-col") {
			header.splice(colIndex + 1, 0, "Header");
			sepAligns.splice(colIndex + 1, 0, { left: false, right: false });
			body.forEach((row) => row.splice(colIndex + 1, 0, ""));
			colCount += 1;
		} else if (action === "del-col") {
			if (colCount <= 1) return false;
			header.splice(colIndex, 1);
			sepAligns.splice(colIndex, 1);
			body.forEach((row) => row.splice(colIndex, 1));
			colCount -= 1;
		} else {
			return false;
		}
		const nextBlock = [
			renderTableRow(header),
			renderTableSeparator(sepAligns),
			...body.map(renderTableRow),
		].join("\n");
		const relativeCaret = Math.max(0, Number(caretPos || 0) - startPos);
		const nextCaret = Math.min(
			startPos + nextBlock.length,
			startPos + relativeCaret
		);
		replaceTextRange(el, startPos, endPos, nextBlock);
		try {
			el.setSelectionRange(nextCaret, nextCaret);
		} catch {
			// ignore
		}
		return true;
	}

	const tableEditorState = {
		startPos: 0,
		endPos: 0,
		header: [],
		aligns: [],
		body: [],
		activeCell: { row: 0, col: 0, isHeader: false },
	};

	function setTableModalOpen(open) {
		if (!tableModal || !tableModal.classList) return;
		tableModal.classList.toggle("hidden", !open);
		tableModal.classList.toggle("flex", open);
		tableModal.setAttribute("aria-hidden", open ? "false" : "true");
		try {
			document.body.style.overflow = open ? "hidden" : "";
		} catch {
			// ignore
		}
	}

	function escapeHtmlAttr(raw) {
		return String(raw || "")
			.replace(/&/g, "&amp;")
			.replace(/"/g, "&quot;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	function parseTableFromContext(ctx) {
		const block = ctx.block || [];
		const sepOffset = Number(ctx.sepOffset || 0);
		const headerCells = splitTableRow(block[sepOffset - 1]);
		const sepCellsRaw = splitTableRow(block[sepOffset]);
		const bodyRowsRaw = block.slice(sepOffset + 1).map(splitTableRow);
		let colCount = Math.max(
			1,
			headerCells.length,
			sepCellsRaw.length,
			...bodyRowsRaw.map((row) => row.length)
		);
		const normalizeRow = (row) => {
			const out = Array.isArray(row) ? row.slice(0, colCount) : [];
			while (out.length < colCount) out.push("");
			return out;
		};
		const header = normalizeRow(headerCells);
		const aligns = normalizeRow(sepCellsRaw).map((cell) => {
			const s = String(cell || "").trim();
			return {
				left: s.startsWith(":") || s.startsWith("-:"),
				right: s.endsWith(":"),
			};
		});
		let body = bodyRowsRaw.map(normalizeRow);
		if (!body.length) body = [Array.from({ length: colCount }, () => "")];
		return { header, aligns, body };
	}

	function renderTableEditorGrid() {
		if (!tableGridWrap) return;
		const cols = Math.max(1, tableEditorState.header.length || 1);
		const rows = Math.max(1, tableEditorState.body.length || 1);
		const gridStyle = `grid-template-columns: repeat(${cols}, minmax(140px, 1fr));`;
		const headerHtml = tableEditorState.header
			.map((cell, col) => {
				const cls =
					"table-cell-input w-full rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-2 text-xs text-slate-100 shadow-inner outline-none ring-1 ring-transparent transition focus:border-white/20 focus:ring-fuchsia-400/25";
				return `
					<div class="flex flex-col gap-1">
						<input
							data-table-header="1"
							data-row="0"
							data-col="${col}"
							value="${escapeHtmlAttr(cell)}"
							class="${cls}"
							placeholder="Header" />
					</div>
				`;
			})
			.join("");
		const bodyHtml = tableEditorState.body
			.map((row, rowIdx) =>
				row
					.map((cell, col) => {
						const cls =
							"table-cell-input w-full rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-2 text-xs text-slate-100 shadow-inner outline-none ring-1 ring-transparent transition focus:border-white/20 focus:ring-fuchsia-400/25";
						return `
							<div class="flex flex-col gap-1">
								<input
									data-row="${rowIdx}"
									data-col="${col}"
									value="${escapeHtmlAttr(cell)}"
									class="${cls}"
									placeholder="" />
							</div>
						`;
					})
					.join("")
			)
			.join("");
		tableGridWrap.innerHTML = `
			<div class="grid gap-2" style="${gridStyle}">
				${headerHtml}
			</div>
			<div class="mt-3 grid gap-2" style="${gridStyle}">
				${bodyHtml}
			</div>
		`;

		tableGridWrap.querySelectorAll("input[data-row]").forEach((input) => {
			input.addEventListener("focus", () => {
				const row = Number(input.getAttribute("data-row") || 0);
				const col = Number(input.getAttribute("data-col") || 0);
				const isHeader = input.hasAttribute("data-table-header");
				tableEditorState.activeCell = { row, col, isHeader };
				updateTableActiveCellLabel();
				updateTableActiveInputHighlight();
				if (tableCalcScope && tableCalcIndex && !isHeader) {
					const scope = String(tableCalcScope.value || "col");
					tableCalcIndex.value =
						scope === "row" ? String(row + 1) : String(col + 1);
				}
				updateTableCalculations();
			});
			input.addEventListener("input", () => {
				const row = Number(input.getAttribute("data-row") || 0);
				const col = Number(input.getAttribute("data-col") || 0);
				const isHeader = input.hasAttribute("data-table-header");
				if (isHeader) tableEditorState.header[col] = String(input.value || "");
				else tableEditorState.body[row][col] = String(input.value || "");
				updateTableCalculations();
			});
		});
		updateTableActiveInputHighlight();
	}

	function updateTableActiveCellLabel() {
		if (!tableActiveCell) return;
		const cell = tableEditorState.activeCell;
		if (cell.isHeader) {
			tableActiveCell.textContent = `Cell: Header ${cell.col + 1}`;
			return;
		}
		tableActiveCell.textContent = `Cell: R${cell.row + 1} · C${cell.col + 1}`;
	}

	function updateTableActiveInputHighlight() {
		if (!tableGridWrap) return;
		const inputs = tableGridWrap.querySelectorAll("input.table-cell-input");
		inputs.forEach((input) => {
			input.classList.remove("ring-2", "ring-fuchsia-400/40");
		});
		const cell = tableEditorState.activeCell;
		const selector = cell.isHeader
			? `input[data-table-header="1"][data-col="${cell.col}"]`
			: `input[data-row="${cell.row}"][data-col="${cell.col}"]`;
		const target = tableGridWrap.querySelector(selector);
		if (target) target.classList.add("ring-2", "ring-fuchsia-400/40");
	}

	function getNumericValuesForScope() {
		const scope = tableCalcScope
			? String(tableCalcScope.value || "col")
			: "col";
		const idxRaw = tableCalcIndex ? Number(tableCalcIndex.value || 1) : 1;
		const idx = Math.max(1, Math.floor(idxRaw || 1));
		const values = [];
		if (scope === "row") {
			const row = tableEditorState.body[idx - 1] || [];
			row.forEach((cell) => {
				const v = Number(String(cell || "").replace(/,/g, "."));
				if (Number.isFinite(v)) values.push(v);
			});
		} else {
			for (const row of tableEditorState.body) {
				const cell = row[idx - 1];
				const v = Number(String(cell || "").replace(/,/g, "."));
				if (Number.isFinite(v)) values.push(v);
			}
		}
		return values;
	}

	function updateTableCalculations() {
		if (!tableCalcSum || !tableCalcAvg || !tableCalcMax || !tableCalcMin)
			return;
		const values = getNumericValuesForScope();
		if (!values.length) {
			tableCalcSum.textContent = "—";
			tableCalcAvg.textContent = "—";
			tableCalcMax.textContent = "—";
			tableCalcMin.textContent = "—";
			return;
		}
		const sum = values.reduce((acc, v) => acc + v, 0);
		const avg = sum / values.length;
		const max = Math.max(...values);
		const min = Math.min(...values);
		tableCalcSum.textContent = String(sum);
		tableCalcAvg.textContent = String(Number.isFinite(avg) ? avg : "—");
		tableCalcMax.textContent = String(max);
		tableCalcMin.textContent = String(min);
	}

	function insertCalcResult(kind) {
		const values = getNumericValuesForScope();
		if (!values.length) return;
		let result = 0;
		if (kind === "avg")
			result = values.reduce((a, v) => a + v, 0) / values.length;
		else if (kind === "max") result = Math.max(...values);
		else if (kind === "min") result = Math.min(...values);
		else result = values.reduce((a, v) => a + v, 0);
		const cell = tableEditorState.activeCell;
		if (cell.isHeader) return;
		if (!tableEditorState.body[cell.row]) return;
		tableEditorState.body[cell.row][cell.col] = String(result);
		renderTableEditorGrid();
		updateTableCalculations();
	}

	function applyTableEditorToTextarea() {
		if (!textarea) return false;
		const nextBlock = [
			renderTableRow(tableEditorState.header),
			renderTableSeparator(tableEditorState.aligns),
			...tableEditorState.body.map(renderTableRow),
		].join("\n");
		replaceTextRange(
			textarea,
			tableEditorState.startPos,
			tableEditorState.endPos,
			nextBlock
		);
		try {
			const caret = tableEditorState.startPos + nextBlock.length;
			textarea.setSelectionRange(caret, caret);
		} catch {
			// ignore
		}
		updatePreview();
		scheduleSend();
		return true;
	}

	function openTableEditorFromCursor() {
		if (!textarea) return;
		const caret = Number(textarea.selectionEnd || 0);
		const ctx = getTableContext(String(textarea.value || ""), caret);
		if (!ctx) {
			toast("No table found on this line.", "error");
			return;
		}
		const parsed = parseTableFromContext(ctx);
		tableEditorState.startPos = ctx.startPos;
		tableEditorState.endPos = ctx.endPos;
		tableEditorState.header = parsed.header.slice();
		tableEditorState.aligns = parsed.aligns.slice();
		tableEditorState.body = parsed.body.map((row) => row.slice());
		tableEditorState.activeCell = { row: 0, col: 0, isHeader: false };
		updateTableActiveCellLabel();
		if (tableCalcIndex) tableCalcIndex.value = "1";
		renderTableEditorGrid();
		updateTableCalculations();
		setTableModalOpen(true);
		try {
			const firstInput = tableGridWrap
				? tableGridWrap.querySelector("input[data-row]")
				: null;
			if (firstInput) firstInput.focus();
		} catch {
			// ignore
		}
	}

	function updateTableMenuVisibility() {
		if (!tableMenuBtn || !textarea) return;
		const caret = Number(textarea.selectionEnd || 0);
		const ctx = getTableContext(String(textarea.value || ""), caret);
		tableMenuBtn.classList.toggle("hidden", !ctx);
	}

	function applySlashCommand(el) {
		if (!el) return false;
		const value = String(el.value || "");
		const selStart = Number(el.selectionStart || 0);
		const selEnd = Number(el.selectionEnd || 0);
		const caret = Math.max(0, Math.min(value.length, selEnd));
		const { start, end, line } = getLineBounds(value, caret);
		const trimmed = String(line || "").trim();
		if (!trimmed.startsWith("/")) return false;
		const m = trimmed.match(/^\/(\S+)(?:\s+(.*))?$/);
		if (!m) return false;
		const cmd = String(m[1] || "")
			.trim()
			.toLowerCase();
		const arg = String(m[2] || "");

		const wrap = (left, right) => {
			const hasSel = selEnd > selStart;
			const inner = hasSel ? value.slice(selStart, selEnd) : arg;
			const next = `${left}${inner}${right}`;
			if (hasSel) {
				replaceTextRange(el, selStart, selEnd, next);
				el.selectionStart = selStart;
				el.selectionEnd = selStart + next.length;
				return;
			}
			const nextPos = replaceTextRange(el, start, end, next);
			if (!inner) {
				const caretPos = nextPos - right.length;
				el.selectionStart = caretPos;
				el.selectionEnd = caretPos;
			} else {
				el.selectionStart = start + next.length;
				el.selectionEnd = start + next.length;
			}
		};

		const insertLine = (prefix) => {
			const next = arg ? `${prefix}${arg}` : prefix;
			replaceTextRange(el, start, end, next);
			const cursor = start + (arg ? next.length : prefix.length);
			el.selectionStart = cursor;
			el.selectionEnd = cursor;
		};

		if (cmd === "help" || cmd === "?" || cmd === "commands") {
			void showSlashHelp();
			replaceTextRange(el, start, end, "");
			el.selectionStart = start;
			el.selectionEnd = start;
			return true;
		}
		if (cmd === "h1") {
			insertLine("# ");
			return true;
		}
		if (cmd === "h2") {
			insertLine("## ");
			return true;
		}
		if (cmd === "h3") {
			insertLine("### ");
			return true;
		}
		if (cmd === "b" || cmd === "bold") {
			wrap("**", "**");
			return true;
		}
		if (cmd === "i" || cmd === "italic") {
			wrap("*", "*");
			return true;
		}
		if (cmd === "s" || cmd === "strike" || cmd === "strikethrough") {
			wrap("~~", "~~");
			return true;
		}
		if (cmd === "quote") {
			insertLine("> ");
			return true;
		}
		if (cmd === "ul" || cmd === "list") {
			insertLine("- ");
			return true;
		}
		if (cmd === "ol") {
			insertLine("1. ");
			return true;
		}
		if (cmd === "todo" || cmd === "task") {
			insertLine("- [ ] ");
			return true;
		}
		if (cmd === "done" || cmd === "x" || cmd === "check") {
			insertLine("- [x] ");
			return true;
		}
		if (cmd === "tasks") {
			const block = "- [ ] " + (arg ? arg : "") + "\n- [ ] \n- [ ] ";
			replaceTextRange(el, start, end, block);
			const cursor = start + "- [ ] ".length + (arg ? String(arg).length : 0);
			el.selectionStart = cursor;
			el.selectionEnd = cursor;
			return true;
		}
		if (cmd === "hr" || cmd === "divider") {
			insertLine("---");
			return true;
		}
		if (cmd === "link") {
			const next = arg ? `[${arg}](https://)` : "[]()";
			replaceTextRange(el, start, end, next);
			if (!arg) {
				el.selectionStart = start + 1;
				el.selectionEnd = start + 1;
			} else {
				el.selectionStart = start + next.length - 1;
				el.selectionEnd = start + next.length - 1;
			}
			return true;
		}
		if (cmd === "table" || cmd === "tbl") {
			const rawArg = String(arg || "")
				.trim()
				.toLowerCase();
			const dimMatch = rawArg.match(/^(\d+)\s*[x,]\s*(\d+)$/);
			if (!rawArg || dimMatch) {
				const cols = dimMatch ? Number(dimMatch[1]) : 2;
				const rows = dimMatch ? Number(dimMatch[2]) : 2;
				const block = buildMarkdownTable(cols, rows);
				replaceTextRange(el, start, end, block);
				const cursor = start + 2;
				el.selectionStart = cursor;
				el.selectionEnd = cursor;
				return true;
			}
			const action =
				rawArg === "row+" ||
				rawArg === "addrow" ||
				rawArg === "row-add" ||
				rawArg === "add-row"
					? "add-row"
					: rawArg === "row-" ||
					  rawArg === "delrow" ||
					  rawArg === "row-del" ||
					  rawArg === "del-row"
					? "del-row"
					: rawArg === "col+" ||
					  rawArg === "addcol" ||
					  rawArg === "col-add" ||
					  rawArg === "add-col"
					? "add-col"
					: rawArg === "col-" ||
					  rawArg === "delcol" ||
					  rawArg === "col-del" ||
					  rawArg === "del-col"
					? "del-col"
					: "";
			if (!action) return false;
			const ok = applyTableCommand(el, action, caret);
			if (!ok) {
				toast("No table found on this line.", "error");
				replaceTextRange(el, start, end, "");
				el.selectionStart = start;
				el.selectionEnd = start;
				return true;
			}
			return true;
		}
		if (cmd === "code") {
			const fallback = getSelectedCodeLang();
			const lang = String(arg || fallback || "")
				.trim()
				.toLowerCase()
				.replace(/[^a-z0-9_+\-]/g, "")
				.slice(0, 32);
			const opening = lang ? `\`\`\`${lang}` : "```";
			const insert = `${opening}\n\n\`\`\``;
			replaceTextRange(el, start, end, insert);
			const cursor = start + opening.length + 1;
			el.selectionStart = cursor;
			el.selectionEnd = cursor;
			updateCodeLangOverlay();
			return true;
		}

		return false;
	}

	let psState = {
		authed: false,
		email: "",
		tags: [],
		notes: [],
		favorites: [],
		roomTabs: [],
		sharedRooms: [],
	};
	let psActiveTags = new Set();
	let psTagFilterMode = "and";
	let psEditingNoteId = "";
	let psEditingNoteKind = "";
	let psEditingNoteTags = [];
	let psEditingNoteYearTag = "";
	let psEditingNoteMonthTag = "";
	let psEditingNoteCategory = "";
	let psEditingNoteSubcategory = "";
	let psEditingNoteDateInitialized = false;
	let psEditingNoteTagsOverridden = false;
	let psEditingNotePinned = false;
	let psSortMode = "updated";
	let psMetaVisible = true;
	let psMetaBasePaddingTop = null;
	let psAutoSaveTimer = 0;
	let psAutoSaveLastSavedText = "";
	let psAutoSaveLastSavedNoteId = "";
	let psAutoSaveInFlight = false;
	let psAutoSaveQueuedText = "";
	let psAutoSaveQueuedNoteId = "";
	let psAutoSaveQueuedTags = null;
	let psSaveNoteInFlight = false;
	let psPinToggleInFlight = new Set();
	let psListRerenderTimer = 0;
	let psRefreshPromise = null;

	/* ── PsTransitionManager ──────────────────────────────────────────────
	 * Orchestrates tab-switch, note-selection, and background-refresh flows
	 * to prevent race conditions that leave #psList empty or stale.
	 *
	 * Priorities (high → low):
	 *   tab-switch  (3) — user hashchange
	 *   note-select (2) — user clicks note in psList
	 *   refresh     (1) — background visibility/focus/poll refresh
	 *   rerender    (0) — debounced list rerender
	 *
	 * Rules:
	 *   - Only one transition at a time (per priority).
	 *   - Higher priority supersedes lower; lower is blocked.
	 *   - Blocked renders are queued and executed after release.
	 *   - Generation counter detects stale callbacks.
	 * ───────────────────────────────────────────────────────────────────── */
	const psTransition = (() => {
		const PRIO = { "tab-switch": 3, "note-select": 2, "refresh": 1, "rerender": 0 };
		let _active = null;  // { type, gen }
		let _gen = 0;
		let _renderQueued = false;

		function begin(type) {
			const prio = PRIO[type] ?? 0;
			if (_active) {
				const activePrio = PRIO[_active.type] ?? 0;
				if (prio <= activePrio) {
					if (type === "rerender" || type === "refresh") _renderQueued = true;
					return null; // blocked
				}
				// Higher priority supersedes current
			}
			const gen = ++_gen;
			_active = { type, gen };
			_renderQueued = false;
			return gen;
		}

		function end(gen) {
			if (!_active || _active.gen !== gen) return;
			_active = null;
			if (_renderQueued) {
				_renderQueued = false;
				if (psState && psState.authed) {
					applyPersonalSpaceFiltersAndRender();
				}
			}
		}

		function isActive(type) {
			if (!type) return !!_active;
			return !!(_active && _active.type === type);
		}

		function isBlocked(type) {
			if (!_active) return false;
			const prio = PRIO[type] ?? 0;
			return prio <= (PRIO[_active.type] ?? 0);
		}

		function requestRender() {
			if (_active) {
				_renderQueued = true;
				return false; // render deferred
			}
			return true; // render now
		}

		function activeType() {
			return _active ? _active.type : null;
		}

		return { begin, end, isActive, isBlocked, requestRender, activeType };
	})();
	let previewOpen = false;
	let fullPreview = false;
	let mobilePsOpen = false;
	let mobileNoteReturn = "editor";
	function isMobileViewport() {
		try {
			return (
				window.matchMedia &&
				window.matchMedia("(max-width: 1023px)").matches
			);
		} catch {
			return false;
		}
	}

	function syncMobileFocusState() {
		if (!document.body || !document.body.classList) return;
		const isMobile = isMobileViewport();
		const previewActive = isMobile && previewOpen;
		const noteActive =
			isMobile && !previewOpen && Boolean(String(psEditingNoteId || ""));
		const psActive = isMobile && !previewOpen && !noteActive && mobilePsOpen;
		const editorActive =
			isMobile && !previewOpen && !noteActive && !mobilePsOpen;
		const wasNoteActive = document.body.classList.contains("mobile-note-open");
		document.body.classList.toggle("mobile-preview-open", previewActive);
		document.body.classList.toggle("mobile-note-open", noteActive);
		document.body.classList.toggle("mobile-ps-open", psActive);
		document.body.classList.toggle("mobile-editor-open", editorActive);
		// Re-render tag pills when entering note view on mobile
		if (noteActive && !wasNoteActive) {
			try {
				renderPsEditorTagsPills();
			} catch {
				// ignore
			}
		}
	}
	let md;
	const clearMirrorBtn = document.getElementById("clearMirror");
	let mdLibWarned = false;
	let previewObjectUrl = "";
	let previewMsgToken = "";
	let psRunOutputById = new Map();
	let pyRunnerWorker = null;
	let pyRunnerSeq = 0;
	let pyRuntimeWarmed = false;
	let jsRunnerFrame = null;
	let jsRunnerPending = new Map();
	let previewRunState = { status: "", output: "", error: "", source: "" };
	let previewTaskEditsPending = false;
	let previewTaskAutoSortTimer = 0;
	const PREVIEW_TASK_AUTO_SORT_DELAY = 220;
	let psNextImportMode = "merge";
	let psSearchQuery = "";
	let psSearchDebounceTimer = 0;
	let psPinnedOnly = false;
	let psCommentsOnly = false;
	let psNoteAccessedById = new Map();
	const PS_ACTIVE_TAGS_KEY = "mirror_ps_active_tags";
	const PS_TAG_FILTER_MODE_KEY = "mirror_ps_tag_filter_mode";
	const PS_TAGS_COLLAPSED_KEY = "mirror_ps_tags_collapsed";
	const PS_SEARCH_QUERY_KEY = "mirror_ps_search_query";
	const PS_VISIBLE_KEY = "mirror_ps_visible";
	const PS_PINNED_ONLY_KEY = "mirror_ps_pinned_only";
	const PS_COMMENTS_ONLY_KEY = "mirror_ps_comments_only";
	const PS_SORT_MODE_KEY = "mirror_ps_sort_mode";
	const PS_NOTE_ACCESSED_KEY = "mirror_ps_note_accessed_v1";
	const PS_META_VISIBLE_KEY = "mirror_ps_meta_visible";
	const PS_AUTO_BACKUP_ENABLED_KEY = "mirror_ps_auto_backup_enabled";
	const PS_AUTO_BACKUP_INTERVAL_KEY = "mirror_ps_auto_backup_interval";
	const PS_AUTO_IMPORT_ENABLED_KEY = "mirror_ps_auto_import_enabled";
	const PS_AUTO_IMPORT_INTERVAL_KEY = "mirror_ps_auto_import_interval";
	const PS_AUTO_IMPORT_SEEN_KEY = "mirror_ps_auto_import_seen_v1";
	const PS_MANUAL_TAGS_MARKER = "__manual_tags__";
	const PS_PINNED_TAG = "pinned";
	const PS_QUERY_RESULT_KEY = "mirror_ps_query_result_collapsed";
	const AI_PROMPT_KEY = "mirror_ai_prompt";
	const AI_USE_PREVIEW_KEY = "mirror_ai_use_preview";
	const AI_USE_ANSWER_KEY = "mirror_ai_use_answer";
	const AI_API_KEY_KEY = "mirror_ai_api_key";
	const AI_API_MODEL_KEY = "mirror_ai_api_model";
	const LINEAR_API_KEY_KEY = "mirror_linear_api_key";
	const LINEAR_PROJECTS_KEY = "mirror_linear_projects";
	const LINEAR_PROJECTS_ENABLED_KEY = "mirror_linear_projects_enabled";
	const THEME_KEY = "mirror_theme";
	const GLOW_ENABLED_KEY = "mirror_glow_enabled";
	const TASK_AUTO_SORT_KEY = "mirror_task_auto_sort";
	const DATE_FORMAT_KEY = "mirror_date_format";
	const TIME_FORMAT_KEY = "mirror_time_format";
	const UI_LANG_KEY = "mirror_ui_lang";
	const UI_LANG_DEFAULT = "de";
	const UI_LANGS = ["de", "en"];
	const MOBILE_AUTO_NOTE_SECONDS_KEY = "mirror_mobile_auto_note_seconds";
	const MOBILE_LAST_ACTIVE_KEY = "mirror_mobile_last_active";
	let aiPrompt = "";
	let aiUsePreview = true;
	let aiUseAnswer = true;
	let aiApiKey = "";
	let aiApiModel = "";
	let linearApiKey = "";
	let bflApiKey = "";
	let linearProjects = [];
	let linearEnabledProjectIds = new Set();
	let aiDictationAvailable = false;
	let aiDictationActive = false;
	let aiDictationRecognizer = null;
	let aiDictationBaseText = "";
	let aiDictationFinalText = "";
	let aiDictationInterimText = "";
	let aiDictationRestarting = false;
	let aiDictationLastErrorAt = 0;
	let aiDictationMicCheckInFlight = false;
	let settingsOpen = false;
	let settingsSection = "user";
	let uiLang = UI_LANG_DEFAULT;
	let activeTheme = "fuchsia";
	let glowEnabled = true;
	let taskAutoSortEnabled = false;
	let dateFormat = "locale";
	let timeFormat = "locale";
	let mobileAutoNoteSeconds = 0;
	let mobileAutoNoteChecked = false;
	let psAutoBackupEnabled = false;
	let psAutoBackupInterval = "daily";
	let psAutoBackupTimer = 0;
	let psAutoBackupInFlight = false;
	let psAutoBackupHandle = null;
	let psAutoImportEnabled = false;
	let psAutoImportInterval = "daily";
	let psAutoImportTimer = 0;
	let psAutoImportInFlight = false;
	let psAutoImportHandle = null;
	let psAutoImportSeen = new Map();
	const THEMES = {
		fuchsia: {
			label: "Fuchsia",
			top: "rgba(217, 70, 239, 0.15)",
			bottom: "rgba(34, 211, 238, 0.1)",
			accentBgSoft: "rgba(217, 70, 239, 0.1)",
			accentBg: "rgba(217, 70, 239, 0.15)",
			accentBgHover: "rgba(217, 70, 239, 0.2)",
			accentBadgeBg: "rgba(217, 70, 239, 0.2)",
			accentStrong: "rgba(217, 70, 239, 0.6)",
			accentStrongHover: "rgba(217, 70, 239, 0.7)",
			accentStrongActive: "rgba(217, 70, 239, 0.8)",
			accentBorder: "rgba(217, 70, 239, 0.3)",
			accentBorderStrong: "rgba(217, 70, 239, 0.4)",
			accentText: "rgba(253, 242, 255, 0.98)",
			accentTextSoft: "rgba(244, 114, 182, 0.95)",
			accentRing: "rgba(217, 70, 239, 0.25)",
			accentRingStrong: "rgba(217, 70, 239, 0.4)",
		},
		cyan: {
			label: "Cyan",
			top: "rgba(14, 165, 233, 0.2)",
			bottom: "rgba(59, 130, 246, 0.12)",
			accentBgSoft: "rgba(14, 165, 233, 0.12)",
			accentBg: "rgba(14, 165, 233, 0.16)",
			accentBgHover: "rgba(14, 165, 233, 0.22)",
			accentBadgeBg: "rgba(14, 165, 233, 0.22)",
			accentStrong: "rgba(14, 165, 233, 0.6)",
			accentStrongHover: "rgba(14, 165, 233, 0.7)",
			accentStrongActive: "rgba(14, 165, 233, 0.8)",
			accentBorder: "rgba(14, 165, 233, 0.3)",
			accentBorderStrong: "rgba(14, 165, 233, 0.4)",
			accentText: "rgba(224, 242, 254, 0.98)",
			accentTextSoft: "rgba(103, 232, 249, 0.95)",
			accentRing: "rgba(14, 165, 233, 0.25)",
			accentRingStrong: "rgba(14, 165, 233, 0.4)",
		},
		emerald: {
			label: "Emerald",
			top: "rgba(16, 185, 129, 0.18)",
			bottom: "rgba(34, 197, 94, 0.12)",
			accentBgSoft: "rgba(16, 185, 129, 0.12)",
			accentBg: "rgba(16, 185, 129, 0.16)",
			accentBgHover: "rgba(16, 185, 129, 0.22)",
			accentBadgeBg: "rgba(16, 185, 129, 0.22)",
			accentStrong: "rgba(16, 185, 129, 0.6)",
			accentStrongHover: "rgba(16, 185, 129, 0.7)",
			accentStrongActive: "rgba(16, 185, 129, 0.8)",
			accentBorder: "rgba(16, 185, 129, 0.3)",
			accentBorderStrong: "rgba(16, 185, 129, 0.4)",
			accentText: "rgba(209, 250, 229, 0.98)",
			accentTextSoft: "rgba(110, 231, 183, 0.95)",
			accentRing: "rgba(16, 185, 129, 0.25)",
			accentRingStrong: "rgba(16, 185, 129, 0.4)",
		},
		violet: {
			label: "Violet",
			top: "rgba(124, 58, 237, 0.2)",
			bottom: "rgba(99, 102, 241, 0.12)",
			accentBgSoft: "rgba(124, 58, 237, 0.12)",
			accentBg: "rgba(124, 58, 237, 0.16)",
			accentBgHover: "rgba(124, 58, 237, 0.22)",
			accentBadgeBg: "rgba(124, 58, 237, 0.22)",
			accentStrong: "rgba(124, 58, 237, 0.6)",
			accentStrongHover: "rgba(124, 58, 237, 0.7)",
			accentStrongActive: "rgba(124, 58, 237, 0.8)",
			accentBorder: "rgba(124, 58, 237, 0.3)",
			accentBorderStrong: "rgba(124, 58, 237, 0.4)",
			accentText: "rgba(237, 233, 254, 0.98)",
			accentTextSoft: "rgba(196, 181, 253, 0.95)",
			accentRing: "rgba(124, 58, 237, 0.25)",
			accentRingStrong: "rgba(124, 58, 237, 0.4)",
		},
		coffeeDark: {
			label: "Coffee Dark",
			top: "rgba(38, 29, 26, 0.9)",
			bottom: "rgba(28, 22, 20, 0.92)",
			previewBg: "#18120e",
			previewMetaBg: "rgba(53, 38, 32, 0.75)",
			previewMetaBorder: "rgba(201, 155, 119, 0.38)",
			previewMetaText: "rgba(233, 219, 204, 0.92)",
			previewLink: "rgba(201, 155, 119, 0.9)",
			accentBgSoft: "rgba(201, 155, 119, 0.12)",
			accentBg: "rgba(201, 155, 119, 0.16)",
			accentBgHover: "rgba(201, 155, 119, 0.22)",
			accentBadgeBg: "rgba(201, 155, 119, 0.22)",
			accentStrong: "rgba(201, 155, 119, 0.7)",
			accentStrongHover: "rgba(201, 155, 119, 0.8)",
			accentStrongActive: "rgba(201, 155, 119, 0.9)",
			accentBorder: "rgba(201, 155, 119, 0.35)",
			accentBorderStrong: "rgba(201, 155, 119, 0.48)",
			accentText: "rgba(255, 240, 230, 0.96)",
			accentTextSoft: "rgba(234, 208, 187, 0.92)",
			accentRing: "rgba(201, 155, 119, 0.35)",
			accentRingStrong: "rgba(201, 155, 119, 0.5)",
			blockquoteBorder: "rgba(201, 155, 119, 0.32)",
			blockquoteText: "rgba(234, 208, 187, 0.9)",
			scrollbarThumb: "rgba(201, 155, 119, 0.2)",
			scrollbarThumbHover: "rgba(201, 155, 119, 0.3)",
			scrollbarBorder: "rgba(16, 12, 10, 0.6)",
		},
		bitterDark: {
			label: "Bitter Dark",
			top: "#0d0c10",
			bottom: "#151518",
			previewBg: "#0d0c10",
			previewText: "#f6f3ef",
			previewLink: "#ff2301",
			previewMetaBg: "rgba(21, 21, 24, 0.85)",
			previewMetaBorder: "rgba(255, 35, 1, 0.32)",
			previewMetaText: "rgba(240, 232, 223, 0.9)",
			tocBorder: "rgba(148, 163, 184, 0.18)",
			tocText: "#f6f3ef",
			tocMuted: "rgba(216, 204, 194, 0.82)",
			tocHover: "rgba(148, 163, 184, 0.14)",
			accentBgSoft: "rgba(255, 35, 1, 0.08)",
			accentBg: "rgba(255, 35, 1, 0.12)",
			accentBgHover: "rgba(255, 35, 1, 0.18)",
			accentBadgeBg: "rgba(255, 35, 1, 0.18)",
			accentStrong: "#ff2301",
			accentStrongHover: "#e51f00",
			accentStrongActive: "#c61a00",
			accentBorder: "rgba(255, 35, 1, 0.32)",
			accentBorderStrong: "rgba(255, 35, 1, 0.45)",
			accentText: "rgba(255, 241, 232, 0.98)",
			accentTextSoft: "rgba(255, 210, 194, 0.92)",
			accentRing: "rgba(255, 35, 1, 0.28)",
			accentRingStrong: "rgba(255, 35, 1, 0.4)",
			blockquoteBorder: "rgba(255, 35, 1, 0.28)",
			blockquoteText: "rgba(240, 232, 223, 0.9)",
			scrollbarThumb: "rgba(255, 210, 194, 0.25)",
			scrollbarThumbHover: "rgba(255, 210, 194, 0.35)",
			scrollbarBorder: "rgba(13, 12, 16, 0.8)",
		},
		coffeeLight: {
			label: "Coffee Light",
			top: "rgba(248, 241, 233, 0.95)",
			bottom: "rgba(239, 226, 217, 0.94)",
			previewBg: "#f2e6dc",
			previewText: "#3b2a21",
			previewMetaBg: "rgba(240, 227, 216, 0.9)",
			previewMetaBorder: "rgba(176, 112, 73, 0.32)",
			previewMetaText: "rgba(68, 45, 30, 0.9)",
			previewLink: "rgba(176, 112, 73, 0.95)",
			tocText: "#3b2a21",
			tocMuted: "rgba(92, 70, 53, 0.85)",
			accentBgSoft: "rgba(176, 112, 73, 0.08)",
			accentBg: "rgba(176, 112, 73, 0.12)",
			accentBgHover: "rgba(176, 112, 73, 0.16)",
			accentBadgeBg: "rgba(176, 112, 73, 0.16)",
			accentStrong: "rgba(176, 112, 73, 0.78)",
			accentStrongHover: "rgba(176, 112, 73, 0.85)",
			accentStrongActive: "rgba(176, 112, 73, 0.92)",
			accentBorder: "rgba(176, 112, 73, 0.35)",
			accentBorderStrong: "rgba(176, 112, 73, 0.5)",
			accentText: "rgba(68, 45, 30, 0.98)",
			accentTextSoft: "rgba(92, 62, 41, 0.9)",
			accentRing: "rgba(176, 112, 73, 0.28)",
			accentRingStrong: "rgba(176, 112, 73, 0.42)",
			blockquoteBorder: "rgba(176, 112, 73, 0.3)",
			blockquoteText: "rgba(76, 54, 38, 0.9)",
			scrollbarThumb: "rgba(176, 112, 73, 0.2)",
			scrollbarThumbHover: "rgba(176, 112, 73, 0.3)",
			scrollbarBorder: "rgba(250, 244, 237, 0.9)",
		},
		bitterLight: {
			label: "Bitter Light",
			top: "#f7f6f4",
			bottom: "#f0eeeb",
			previewBg: "#f0eeeb",
			previewText: "#0d0c10",
			previewLink: "#ff2301",
			previewMetaBg: "rgba(240, 238, 234, 0.95)",
			previewMetaBorder: "rgba(255, 35, 1, 0.22)",
			previewMetaText: "rgba(21, 21, 24, 0.9)",
			tocBorder: "rgba(15, 23, 42, 0.12)",
			tocText: "#0d0c10",
			tocMuted: "rgba(52, 52, 60, 0.85)",
			tocHover: "rgba(15, 23, 42, 0.06)",
			accentBgSoft: "rgba(255, 35, 1, 0.08)",
			accentBg: "rgba(255, 35, 1, 0.12)",
			accentBgHover: "rgba(255, 35, 1, 0.16)",
			accentBadgeBg: "rgba(255, 35, 1, 0.14)",
			accentStrong: "#ff2301",
			accentStrongHover: "#e51f00",
			accentStrongActive: "#c61a00",
			accentBorder: "rgba(255, 35, 1, 0.25)",
			accentBorderStrong: "rgba(255, 35, 1, 0.36)",
			accentText: "rgba(27, 27, 32, 0.98)",
			accentTextSoft: "rgba(52, 52, 60, 0.9)",
			accentRing: "rgba(255, 35, 1, 0.2)",
			accentRingStrong: "rgba(255, 35, 1, 0.32)",
			blockquoteBorder: "rgba(255, 35, 1, 0.2)",
			blockquoteText: "rgba(52, 52, 60, 0.9)",
			scrollbarThumb: "rgba(21, 21, 24, 0.25)",
			scrollbarThumbHover: "rgba(21, 21, 24, 0.35)",
			scrollbarBorder: "rgba(230, 228, 224, 0.9)",
		},
		monoDark: {
			label: "Mono Dark",
			top: "#0d1117",
			bottom: "#0d1117",
			previewBg: "#0d1117",
			accentBgSoft: "rgba(88, 166, 255, 0.12)",
			accentBg: "rgba(88, 166, 255, 0.18)",
			accentBgHover: "rgba(88, 166, 255, 0.24)",
			accentBadgeBg: "rgba(88, 166, 255, 0.24)",
			accentStrong: "#1f6feb",
			accentStrongHover: "#388bfd",
			accentStrongActive: "#1b4b91",
			accentBorder: "rgba(88, 166, 255, 0.4)",
			accentBorderStrong: "rgba(88, 166, 255, 0.55)",
			accentText: "rgba(240, 246, 252, 0.98)",
			accentTextSoft: "rgba(201, 209, 217, 0.9)",
			accentRing: "rgba(88, 166, 255, 0.35)",
			accentRingStrong: "rgba(88, 166, 255, 0.5)",
			blockquoteBorder: "rgba(48, 54, 61, 0.9)",
			blockquoteText: "rgba(139, 148, 158, 0.95)",
			scrollbarThumb: "rgba(139, 148, 158, 0.35)",
			scrollbarThumbHover: "rgba(139, 148, 158, 0.5)",
			scrollbarBorder: "rgba(13, 17, 23, 0.9)",
		},
		monoLight: {
			label: "Mono Light",
			top: "#f6f8fa",
			bottom: "#f6f8fa",
			previewBg: "#f6f8fa",
			accentBgSoft: "rgba(9, 105, 218, 0.08)",
			accentBg: "rgba(9, 105, 218, 0.12)",
			accentBgHover: "rgba(9, 105, 218, 0.16)",
			accentBadgeBg: "rgba(9, 105, 218, 0.14)",
			accentStrong: "#0969da",
			accentStrongHover: "#0550ae",
			accentStrongActive: "#033d8b",
			accentBorder: "rgba(9, 105, 218, 0.28)",
			accentBorderStrong: "rgba(9, 105, 218, 0.4)",
			accentText: "rgba(15, 23, 42, 0.98)",
			accentTextSoft: "rgba(51, 65, 85, 0.9)",
			accentRing: "rgba(9, 105, 218, 0.25)",
			accentRingStrong: "rgba(9, 105, 218, 0.4)",
			blockquoteBorder: "rgba(208, 215, 222, 0.9)",
			blockquoteText: "rgba(87, 96, 106, 0.95)",
			scrollbarThumb: "rgba(87, 96, 106, 0.35)",
			scrollbarThumbHover: "rgba(87, 96, 106, 0.5)",
			scrollbarBorder: "rgba(240, 246, 252, 0.9)",
		},
	};

	const THEME_ORDER = [
		"fuchsia",
		"cyan",
		"emerald",
		"violet",
		"coffeeDark",
		"coffeeLight",
		"bitterDark",
		"bitterLight",
		"monoDark",
		"monoLight",
	];

	const GLOW_BLOCKED_THEMES = new Set([
		"monoLight",
		"monoDark",
		"coffeeLight",
		"coffeeDark",
		"bitterLight",
		"bitterDark",
	]);

		const UI_STRINGS = {
			de: {
				"ps.title": "Personal Space",
				"ps.close": "Schließen",
				"ps.add": "Personal Space hinzufügen",
				"ps.add_hint": "Du erhältst einen Bestätigungslink per E-Mail.",
				"ps.new_note": "Neue Notiz",
				"ps.tags": "Tags",
				"ps.notes": "Notizen",
				"ps.pinned_only": "Nur angepinnte",
				"ps.comments_only": "Nur mit Kommentaren",
				"ps.search": "Suche… (tag: task: has: kind: pinned:)",
				"ps.sort": "Sortierung",
				"ps.save_query": "Query speichern",
				"query.open": "offen",
				"query.done": "erledigt",
				"query.from_notes": "aus {n} Notizen",
				"search.help": "⚡ Query-Operatoren:\n• tag:name – Notizen mit Tag filtern\n• task:open – offene Aufgaben anzeigen\n• task:done – erledigte Aufgaben\n• has:task – Notizen mit Aufgaben\n• has:comment – Notizen mit Kommentaren\n• has:permalink – Notizen mit aktivem Permalink\n• kind:note – nach Art filtern\n• pinned:yes / pinned:no\n• created:>2026-01-01\n• updated:<2026-02-01\n\nKombinierbar: task:open tag:projektA",
				"ps.sort_by": "Sortieren nach",
				"ps.sort.modified": "Geändert",
				"ps.sort.created": "Erstellt",
				"ps.sort.accessed": "Zuletzt geöffnet",
				"ps.sort.text": "Text",
				"ps.tags.and": "UND",
				"ps.tags.or": "ODER",
				"header.room_label": "Raum",
				"header.room_placeholder": "Raum (z. B. KubernetesRoom123)",
				"header.join": "Beitreten",
				"header.new": "Neu",
				"header.share_room": "Raum teilen",
				"header.favorites_label": "Favoriten",
				"header.favorites_placeholder": "Favoriten…",
				"header.favorite_toggle": "Favorit hinzufügen/entfernen",
				"header.room_prefix": "Raum:",
				"header.crdt_toggle": "CRDT-Markierung ausblenden",
				"tabs.tooltip.private": "Privater Raum · Zugriff nur mit Schlüssel",
				"tabs.tooltip.public": "Öffentlicher Raum · Kein Schlüssel erforderlich",
				"tabs.tooltip.shared": "Geteilter Raum · Link wurde geteilt",
				"editor.note_close": "Notiz schließen",
				"editor.copy": "In Zwischenablage kopieren",
				"editor.clear_input": "Eingabe leeren",
				"comments.toggle": "Kommentare ein-/ausblenden",
				"comments.title": "Kommentare",
				"comments.close": "Schließen",
				"comments.empty": "Noch keine Kommentare.",
				"comments.input_label": "Kommentar",
				"comments.input_placeholder": "Kommentar (Markdown)",
				"comments.add": "Kommentar hinzufügen",
				"comments.add_action": "Kommentar hinzufügen",
				"comments.save_action": "Kommentar speichern",
				"comments.reply_action": "Antwort senden",
				"comments.edit_action": "Kommentar bearbeiten",
				"comments.delete_action": "Kommentar löschen",
				"arrange.toggle": "Blöcke anordnen",
				"arrange.title": "Blöcke anordnen",
				"arrange.close": "Schließen",
				"arrange.apply": "Übernehmen",
				"arrange.cancel": "Abbrechen",
				"arrange.undo": "Rückgängig",
				"arrange.outline": "Nur Überschriften",
				"arrange.hint": "Ziehen zum Verschieben · ⌥+↑↓ mit Tastatur",
				"arrange.empty": "Keine Blöcke gefunden.",
				"arrange.unsaved": "Änderungen verwerfen?",
				"editor.nav_back": "Zurück",
				"editor.nav_forward": "Vorwärts",
				"editor.preview": "Vorschau",
				"editor.upload": "Datei hochladen",
				"editor.save": "Speichern",
				"editor.ready": "Bereit.",
				"preview.title": "Vorschau",
				"preview.full": "Vollbild-Vorschau",
				"preview.show_input": "Eingabe anzeigen",
				"preview.close": "Vorschau schließen",
				"preview.iframe": "Markdown-Vorschau",
				"preview.ask_claude": "Claude fragen",
				"preview.use_context": "Vorschau als Kontext verwenden",
				"preview.ai_mode": "KI-Modus",
				"preview.ai_mode.none": "Ohne Vorgabe",
				"preview.ai_mode.explain": "Erklären / Antworten",
				"preview.ai_mode.fix": "Fixen / Korrigieren",
				"preview.ai_mode.improve": "Verbessern",
				"preview.ai_mode.run": "Code ausführen",
				"preview.ai_mode.summarize": "Zusammenfassen",
				"preview.ai_mode.image": "🎨 Bild generieren",
				"preview.ask": "Fragen",
				"preview.prompt_clear": "Prompt leeren",
				"preview.dictate": "Diktat starten",
				"preview.dictate_sr": "Diktat",
				"preview.chat_history": "Chatverlauf",
				"preview.chat_you": "Du",
				"preview.chat_ai": "KI",
				"preview.chat_clear": "Chat leeren",
				"preview.chat_delete": "Chat löschen",
				"preview.chat_output": "Chat",
				"toast.dictation_started": "Diktat gestartet.",
				"preview.replace_title": "Editor durch KI-Ausgabe ersetzen",
				"preview.replace": "Ersetzen",
				"preview.append_title": "KI-Ausgabe ans Ende anfügen",
				"preview.append": "Anhängen",
				"preview.clear_title": "Ausgabe löschen",
				"preview.clear": "Löschen",
				"menu.bold": "Fett",
				"menu.bold_tip": "Markierten Text fett darstellen.",
				"menu.italic": "Kursiv",
				"menu.italic_tip": "Markierten Text kursiv darstellen.",
				"menu.strike": "Durchgestrichen",
				"menu.strike_tip": "Markierten Text durchstreichen.",
				"menu.password_hide": "Passwort verstecken",
				"menu.password_hide_tip": "Markierten Text als Passwort-Token verstecken.",
				"menu.password": "PW",
				"menu.blockquote": "Zitat",
				"menu.blockquote_tip": "Auswahl in ein Zitat (Blockquote) umwandeln.",
				"menu.bullet": "Liste (Aufzählung)",
				"menu.bullet_tip": "Zeilen in eine Aufzählungsliste umwandeln.",
				"menu.bullet_label": "• Liste",
				"menu.numbered": "Liste (Nummeriert)",
				"menu.numbered_tip": "Zeilen in eine nummerierte Liste umwandeln.",
				"menu.numbered_label": "1. Liste",
				"menu.task": "Aufgabenliste",
				"menu.task_tip": "Zeilen in eine Aufgabenliste mit Checkboxen umwandeln.",
				"menu.task_label": "☐ Aufgabe",
				"menu.divider": "Trenner",
				"menu.divider_tip": "Trennlinie einfügen.",
				"menu.code": "Codeblock",
				"menu.code_tip": "Auswahl in einen Codeblock setzen.",
				"menu.link": "Link",
				"menu.link_tip": "Auswahl in einen Link umwandeln.",
				"menu.comment": "Kommentar",
				"menu.comment_tip": "Kommentar zur Auswahl hinzufügen.",
				"menu.sort_az": "Sortieren A–Z",
				"menu.sort_az_tip": "Ausgewählte Zeilen A–Z sortieren.",
				"menu.code_lang_label": "Sprache",
				"menu.code_lang_title": "Sprache für Codeblock",
				"menu.help_tip": "Formatierungs-Hilfe öffnen.",
				"selection.help.title": "Format-Menü",
				"slash.menu.title": "Slash-Kommandos",
				"slash.menu.hint": "(Enter/Tab zum Einfügen, ↑↓ zum Navigieren)",
				"slash.menu.empty": "Keine Treffer.",
				"slash.help.title": "Slash-Kommandos",
				"slash.help.message":
					"Tippe / im Editor und wähle einen Befehl. Beispiele: /h1 Überschrift, /b fett, /i kursiv, /s durchgestrichen, /quote Zitat, /ul Aufzählung, /ol Nummern, /todo Aufgabe, /done erledigte Aufgabe, /tasks Aufgaben-Template, /code [sprache] Codeblock, /link Link, /hr Trenner, /divider Trenner, /table 3x2 Tabelle, /table row+ Zeile hinzufügen, /table col- Spalte entfernen.",
				"slash.item.help": "Hilfe",
				"slash.item.h1": "Überschrift 1",
				"slash.item.h2": "Überschrift 2",
				"slash.item.h3": "Überschrift 3",
				"slash.item.bold": "Fett",
				"slash.item.italic": "Kursiv",
				"slash.item.strike": "Durchgestrichen",
				"slash.item.quote": "Zitat",
				"slash.item.ul": "Aufzählungsliste",
				"slash.item.ol": "Nummerierte Liste",
				"slash.item.todo": "Aufgabenliste",
				"slash.item.done": "Aufgabe (erledigt)",
				"slash.item.tasks": "Aufgaben-Template",
				"slash.item.table": "Tabelle",
				"slash.item.table_3x2": "Tabelle (3x2)",
				"slash.item.table_row_add": "Tabelle: Zeile +",
				"slash.item.table_row_remove": "Tabelle: Zeile -",
				"slash.item.table_col_add": "Tabelle: Spalte +",
				"slash.item.table_col_remove": "Tabelle: Spalte -",
				"slash.item.hr": "Horizontale Linie",
				"slash.item.divider": "Divider",
				"slash.item.link": "Link",
				"slash.item.code": "Codeblock",
				"slash.item.code_js": "Codeblock (JS)",
				"slash.item.code_py": "Codeblock (PY)",
				"presence.one": "{count} Nutzer online",
				"presence.many": "{count} Nutzer online",
				"typing.one": "{name} tippt…",
				"typing.many": "{count} Personen tippen…",
				"settings.open": "Einstellungen öffnen",
				"settings.title": "Einstellungen",
				"settings.desc": "Konto, Export/Import, Themes, KI und Hilfe verwalten.",
				"settings.build": "Build-Info",
				"settings.close": "Einstellungen schließen",
				"settings.nav.user": "Benutzer-Einstellungen",
				"settings.nav.export": "Export/Import",
				"settings.nav.shared": "Geteilte Raeume",
				"settings.nav.themes": "Themes",
				"settings.nav.calendar": "Kalender",
				"settings.nav.integrations": "Integrationen",
				"settings.nav.ai": "KI",
				"settings.nav.uploads": "Uploads",
				"settings.nav.faq": "FAQ",
				"settings.nav.trash": "Papierkorb",
				"settings.user.title": "Benutzer-Einstellungen",
				"settings.user.desc": "Personal Space Identität und Abmeldung.",
				"settings.user.signed_in": "Angemeldet als",
				"settings.user.sign_out": "Abmelden",
				"settings.user.signed_out":
					"Nicht angemeldet. Nutze „Personal Space hinzufügen“, um zu starten.",
				"settings.user.favorites.title": "Favoriten",
				"settings.user.favorites.desc":
					"Favoriten bearbeiten, Notizen hinzufügen oder entfernen.",
				"settings.user.favorites.empty": "Keine Favoriten vorhanden.",
				"settings.shared.title": "Geteilte Raeume",
				"settings.shared.desc": "Geteilte Raeume verwalten und entfernen.",
				"settings.shared.empty": "Keine geteilten Raeume gespeichert.",
				"settings.shared.empty_filtered": "Keine Treffer fuer den Filter.",
				"settings.shared.open": "Oeffnen",
				"settings.shared.remove": "Entfernen",
				"settings.shared.updated": "Zuletzt geteilt:",
				"settings.shared.search_placeholder": "Geteilte Raeume suchen",
				"settings.shared.clear": "Alle entfernen",
				"settings.shared.clear_title": "Geteilte Raeume loeschen",
				"settings.shared.clear_confirm": "Moechtest du alle geteilten Raeume entfernen?",
				"settings.shared.clear_ok": "Alles entfernen",
				"settings.shared.clear_cancel": "Abbrechen",
				"settings.user.favorites.remove": "Entfernen",
				"settings.user.favorites.note_label": "Notiz",
				"settings.user.favorites.note_placeholder":
					"Kurze Notiz (optional)",
				"settings.user.favorites.startup_active":
					"Als Standard-Raum beim App-Start markiert (Klicken zum Deaktivieren)",
				"settings.user.favorites.startup_inactive":
					"Als Standard-Raum beim App-Start markieren",
				"settings.user.mobile_auto.title":
					"Mobil: Neue Notiz nach Inaktivität",
				"settings.user.mobile_auto.desc":
					"Nach wie vielen Sekunden Inaktivität beim nächsten App-Start eine neue Notiz erstellt wird.",
				"settings.user.mobile_auto.unit": "Sekunden (0 = aus)",
				"settings.language.title": "App-Sprache",
				"settings.language.desc": "Sprache der Oberfläche auswählen.",
				"settings.language.de": "Deutsch",
				"settings.language.en": "Englisch",
				"settings.tasks.title": "Markdown-Aufgaben",
				"settings.tasks.desc":
					"Offene Aufgaben beim Schließen der Vorschau automatisch nach oben sortieren.",
				"settings.tasks.auto_sort": "Offene Einträge zuerst",
				"settings.datetime.title": "Datum & Zeit",
				"settings.datetime.desc":
					"Format für Datum und Uhrzeit im Personal Space.",
				"settings.datetime.date_label": "Datumsformat",
				"settings.datetime.time_label": "Zeitformat",
				"settings.datetime.date_auto": "System",
				"settings.datetime.date_dmy": "TT.MM.JJJJ",
				"settings.datetime.date_ymd": "JJJJ-MM-TT",
				"settings.datetime.date_mdy": "MM/TT/JJJJ",
				"settings.datetime.time_auto": "System",
				"settings.datetime.time_24h": "24h",
				"settings.datetime.time_12h": "12h AM/PM",
				"settings.export.title": "Export/Import",
				"settings.export.desc":
					"Personal Space Notizen sichern oder importieren.",
				"settings.export.export": "Exportieren",
				"settings.export.import": "Importieren",
				"settings.export.merge": "Zusammenführen",
				"settings.export.replace": "Ersetzen",
				"settings.export.autobackup.title": "Auto-Backup",
				"settings.export.autobackup.desc":
					"Sichert deine Personal Space Notizen regelmäßig in einen lokalen Ordner.",
				"settings.export.autobackup.active": "Aktiv",
				"settings.export.autobackup.daily": "Täglich",
				"settings.export.autobackup.weekly": "Wöchentlich",
				"settings.export.autobackup.monthly": "Monatlich",
				"settings.export.autobackup.choose_folder": "Ordner wählen",
				"settings.export.autobackup.no_folder": "Kein Ordner gewählt",
				"settings.export.autobackup.unsupported":
					"Nicht verfügbar (Browser unterstützt keinen Ordnerzugriff).",
				"settings.export.autoimport.title": "Auto-Import",
				"settings.export.autoimport.desc":
					"Importiert neue JSON/Markdown-Dateien aus einem Ordner (Merge).",
				"settings.export.autoimport.active": "Aktiv",
				"settings.export.autoimport.daily": "Täglich",
				"settings.export.autoimport.weekly": "Wöchentlich",
				"settings.export.autoimport.monthly": "Monatlich",
				"settings.export.autoimport.choose_folder": "Ordner wählen",
				"settings.export.autoimport.no_folder": "Kein Ordner gewählt",
				"settings.export.autoimport.unsupported":
					"Nicht verfügbar (Browser unterstützt keinen Ordnerzugriff).",
				"settings.calendar.title": "Kalender",
				"settings.calendar.desc":
					"Kalender verbinden und Standardansicht festlegen.",
				"settings.calendar.default_view": "Standardansicht",
				"settings.calendar.view.day": "Tag",
				"settings.calendar.view.week": "Woche",
				"settings.calendar.view.month": "Monat",
				"settings.calendar.sources.title": "Kalenderquellen",
				"settings.calendar.sources.desc":
					"Füge öffentliche ICS-Links hinzu (CORS muss erlaubt sein).",
				"settings.calendar.sources.empty": "Keine Kalender verbunden.",
				"settings.calendar.local.title": "Lokale Termine",
				"settings.calendar.local.desc":
					"Manuell angelegte Termine werden lokal gespeichert und mit Personal Space synchronisiert (falls aktiv).",
				"settings.calendar.local.empty": "Keine lokalen Termine.",
				"settings.calendar.google.title": "Google Calendar",
				"settings.calendar.google.desc":
					"Verbinde deinen Google Kalender, um Termine zu schreiben.",
				"settings.calendar.google.status_disconnected": "Nicht verbunden.",
				"settings.calendar.google.connected": "Verbunden",
				"settings.calendar.google.not_configured":
					"Google Kalender ist nicht konfiguriert.",
				"settings.calendar.google.unavailable": "Google Status nicht verfügbar.",
				"settings.calendar.google.select": "Kalender auswählen",
				"settings.calendar.google.primary": "Primär",
				"settings.calendar.google.connect": "Google verbinden",
				"settings.calendar.google.disconnect": "Trennen",
				"settings.calendar.outlook.title": "Outlook Calendar",
				"settings.calendar.outlook.desc":
					"Verbinde deinen Outlook Kalender, um Termine zu schreiben.",
				"settings.calendar.outlook.status_disconnected": "Nicht verbunden.",
				"settings.calendar.outlook.connected": "Verbunden",
				"settings.calendar.outlook.not_configured":
					"Outlook Kalender ist nicht konfiguriert.",
				"settings.calendar.outlook.unavailable": "Outlook Status nicht verfügbar.",
				"settings.calendar.outlook.select": "Kalender auswählen",
				"settings.calendar.outlook.primary": "Standard",
				"settings.calendar.outlook.connect": "Outlook verbinden",
				"settings.calendar.outlook.disconnect": "Trennen",
				"settings.calendar.add.title": "Neuen Kalender hinzufügen",
				"settings.calendar.add.name": "Name",
				"settings.calendar.add.name_placeholder": "Team, Privat, Urlaub",
				"settings.calendar.add.color": "Farbe",
				"settings.calendar.add.url": "ICS-URL",
				"settings.calendar.add.url_placeholder":
					"https://example.com/calendar.ics",
				"settings.calendar.add.active": "Aktiv",
				"settings.calendar.add.submit": "Hinzufügen",
				"settings.integrations.title": "Integrationen",
				"settings.integrations.desc":
					"App-Integrationen verwalten (API-Keys serverseitig verschlüsselt).",
				"settings.integrations.linear.title": "Linear",
				"settings.integrations.linear.desc":
					"API-Key verschlüsselt im Personal Space speichern und Projekte für die Freigabe auswählen.",
				"settings.integrations.linear.key_label": "Linear API-Key",
				"settings.integrations.linear.save": "Speichern",
				"settings.integrations.linear.clear": "Löschen",
				"settings.integrations.linear.load": "Projekte laden",
				"settings.integrations.linear.projects.title":
					"Projekte für Raumfreigabe",
				"settings.integrations.linear.projects.desc":
					"Wähle die Projekte, die im Raum geteilt werden dürfen.",
				"settings.integrations.linear.projects.empty": "Keine Projekte geladen.",
				"settings.integrations.bfl.title": "FLUX.2 (BFL)",
				"settings.integrations.bfl.desc":
					"BFL API-Key verschlüsselt im Personal Space speichern für AI-Bildgenerierung.",
				"settings.integrations.bfl.key_label": "BFL API-Key",
				"settings.integrations.bfl.save": "Speichern",
				"settings.integrations.bfl.clear": "Löschen",
				"settings.integrations.bfl.api_link": "→ API-Key erstellen auf api.bfl.ai",
				"settings.trash.title": "Papierkorb",
				"settings.trash.desc":
					"Gelöschte Notizen bleiben 30 Tage erhalten und können wiederhergestellt werden.",
				"settings.trash.refresh": "Aktualisieren",
				"settings.trash.empty": "Keine gelöschten Notizen.",
				"settings.themes.title": "Themes",
				"settings.themes.desc":
					"Hintergrundstil wählen. Lokal gespeichert.",
				"settings.themes.glow.title": "Hintergrund-Glow",
				"settings.themes.glow.desc": "Theme-Glow aktivieren oder deaktivieren.",
				"settings.themes.glow_on": "Glow an",
				"settings.themes.glow_off": "Glow aus",
				"settings.ai.title": "KI",
				"settings.ai.desc":
					"API-Key wird lokal gespeichert und pro Anfrage verwendet.",
				"settings.ai.key_label": "Anthropic API-Key",
				"settings.ai.model_label": "Modell (optional)",
				"settings.ai.save": "Speichern",
				"settings.ai.clear": "Löschen",
				"settings.ai.status_local_key": "Lokaler API-Key aktiv.",
				"settings.ai.status_server_key": "Server-Key aktiv.",
				"settings.ai.status_not_configured": "AI nicht konfiguriert.",
				"settings.ai.status_unavailable": "AI-Status nicht verfügbar.",
				"settings.ai.status_model": "Modell",
				"settings.ai.status_last_used": "Zuletzt verwendet",
				"settings.ai.status_latest": "Neuestes verfügbar",
				"settings.ai.status_checked": "Geprüft",
				"settings.faq.title": "FAQ",
				"settings.faq.desc": "Schnelle Antworten und Tipps.",
				"settings.faq.search_label": "FAQ durchsuchen",
				"settings.faq.search_placeholder": "Suchen…",
				"faq.no_results": "Keine Treffer.",
				"settings.uploads.title": "Uploads",
				"settings.uploads.desc": "Uploads verwalten.",
				"settings.uploads.refresh": "Aktualisieren",
				"settings.uploads.empty": "Keine Uploads vorhanden.",
				"calendar.local.remove": "Entfernen",
				"modal.title": "Dialog",
				"modal.close": "Schließen",
				"modal.input": "Eingabe",
				"modal.cancel": "Abbrechen",
				"modal.ok": "OK",
				"calendar.modal.title": "Neuen Termin",
				"calendar.modal.desc": "Einfacher Termin im lokalen Kalender.",
				"calendar.modal.close": "Kalender-Dialog schließen",
				"calendar.modal.title_label": "Titel",
				"calendar.modal.title_placeholder": "Termin",
				"calendar.modal.date": "Datum",
				"calendar.modal.all_day": "Ganztägig",
				"calendar.modal.start": "Start",
				"calendar.modal.end": "Ende",
				"calendar.modal.sync_label": "Sync-Ziel",
				"calendar.modal.sync.local": "Nur lokal",
				"calendar.modal.sync.google": "Google Calendar",
				"calendar.modal.sync.outlook": "Outlook Calendar",
				"toast.dictation_failed": "Diktat fehlgeschlagen.",
				"toast.ai_saved": "KI-Einstellungen gespeichert.",
				"toast.ai_cleared": "KI-Einstellungen gelöscht.",
				"toast.ps_activated": "Personal Space aktiviert.",
				"toast.linear_saved": "Linear-Einstellungen gespeichert.",
				"toast.linear_cleared": "Linear-Einstellungen gelöscht.",
				"toast.linear_key_failed": "Linear-API-Key konnte nicht gespeichert werden.",
				"toast.bfl_saved": "BFL API-Key gespeichert.",
				"toast.bfl_cleared": "BFL API-Key gelöscht.",
				"toast.bfl_key_failed": "BFL API-Key konnte nicht gespeichert werden.",
				"bfl.status.key_set": "✓ BFL API-Key hinterlegt.",
				"bfl.status.no_key": "Kein BFL API-Key hinterlegt.",
				"ai.image.download": "Download",
				"ai.image.save_upload": "In Uploads speichern",
				"ai.image.insert_mirror": "In Mirror einfügen",
				"ai.image.uploading": "Wird hochgeladen…",
				"ai.image.saved": "Gespeichert",
				"ai.image.inserted": "Eingefügt",
				"toast.ai_image_uploaded": "Bild in Uploads gespeichert.",
				"toast.ai_image_upload_failed": "Upload fehlgeschlagen",
				"toast.ai_image_inserted": "Bild in Mirror eingefügt.",
				"toast.linear_projects_loaded": "Linear-Projekte geladen.",
				"toast.linear_projects_failed": "Linear-Projekte konnten nicht geladen werden.",
				"toast.linear_tasks_failed": "Linear-Aufgaben konnten nicht geladen werden.",
				"toast.linear_select_project": "Bitte ein Linear-Projekt auswählen.",
				"toast.linear_missing_key": "Linear API-Key fehlt.",
				"linear.embed.title": "Linear",
				"linear.embed.select_placeholder": "Projekt auswählen",
				"linear.embed.apply": "Teilen",
				"linear.embed.refresh": "Aktualisieren",
				"linear.embed.empty": "Keine Aufgaben geladen.",
				"linear.embed.open": "In Linear öffnen",
				"linear.view.board": "Board",
				"linear.view.stats": "Statistik",
				"linear.stats.empty": "Keine Aufgaben für die Auswertung.",
				"linear.stats.total": "Gesamt · {count}",
				"linear.stats.done": "Erledigt",
				"linear.stats.in_progress": "In Arbeit",
				"linear.stats.blocked": "Blockiert",
				"linear.stats.overdue": "Überfällig",
				"linear.stats.due_soon": "Fällig (7 Tage)",
				"linear.stats.by_status": "Status",
				"linear.stats.by_assignee": "Zuständig",
				"linear.stats.unassigned": "Ohne Owner",
				"linear.stats.updated": "Aktualisiert · {date}",
				"linear.stats.unknown": "Unbekannt",
				"linear.status.key_set": "API-Key gesetzt.",
				"linear.status.key_set_with_projects":
					"API-Key gesetzt · {count} Projekte",
				"linear.status.no_key": "Kein API-Key gesetzt.",
				"linear.status.loading": "Linear lädt…",
				"linear.status.failed": "Linear nicht erreichbar.",
				"editor.permalink": "Permanent-Link",
				"editor.permalink_active": "Permanent-Link aktiv",
				"toast.permalink_activated": "Permanent-Link aktiviert.",
				"toast.permalink_deactivated": "Permanent-Link deaktiviert.",
				"permalink.info.title": "Permanent-Link",
				"permalink.info.message": "Pinnt den aktuellen Inhalt (Notiz oder Text) dauerhaft an diesen Raum-Tab. Gäste sehen automatisch den gepinnten Inhalt, wenn sie den Raum betreten. Erneut klicken, um den Pin zu entfernen. Eingebettete Apps (Excalidraw, Excel, Linear) werden mitgeteilt.",
				"offline.now_offline": "Du bist offline. Änderungen werden lokal gespeichert.",
				"offline.back_online": "Wieder online — synchronisiere…",
				"offline.synced": "Offline-Änderungen synchronisiert.",
				"offline.saved_locally": "Offline gespeichert.",
				"settings.nav.shortcuts": "Tastenkürzel",
				"settings.shortcuts.title": "Tastenkürzel",
				"settings.shortcuts.desc": "Übersicht aller Tastenkombinationen für schnellen Zugriff.",
				"shortcuts.new_note": "Neue Notiz",
				"shortcuts.new_note_desc": "Erstellt eine neue Notiz im aktuellen Tab/Raum.",
				"shortcuts.save": "Notiz speichern",
				"shortcuts.save_desc": "Speichert die aktuelle Notiz sofort.",
				"shortcuts.settings": "Einstellungen öffnen",
				"shortcuts.settings_desc": "Öffnet das Einstellungs-Panel.",
				"shortcuts.preview": "Vorschau ein/aus",
				"shortcuts.preview_desc": "Schaltet die Markdown-Vorschau ein oder aus.",
				"shortcuts.focus_room": "Raum-Eingabe fokussieren",
				"shortcuts.focus_room_desc": "Setzt den Fokus auf die Raum-Eingabe zum schnellen Wechseln.",
				"shortcuts.copy": "Editor-Inhalt kopieren",
				"shortcuts.copy_desc": "Kopiert den gesamten Editor-Inhalt in die Zwischenablage.",
				"shortcuts.upload": "Upload-Dialog öffnen",
				"shortcuts.upload_desc": "Öffnet den Dialog zum Hochladen von Dateien.",
				"toast.shortcut_new_note": "Neue Notiz erstellt.",
				"toast.shortcut_saved": "Notiz gespeichert.",
				"toast.shortcut_copied": "Inhalt kopiert.",
				"calendar.common.title": "Gemeinsame freie Zeiten",
				"calendar.common.toggle": "Verfügbarkeit teilen",
				"calendar.common.sharing": "Wird geteilt",
				"calendar.common.not_sharing": "Nicht geteilt",
				"calendar.common.no_shared_room": "Nur in geteilten Räumen verfügbar.",
				"calendar.common.no_participants": "Noch keine Teilnehmer teilen ihre Verfügbarkeit.",
				"calendar.common.no_common": "Keine gemeinsame freie Zeit.",
				"calendar.common.select_day_week": "Für gemeinsame Zeiten bitte Tag/Woche wählen.",
				"calendar.common.all_free": "alle frei",
				"calendar.common.partial": "{n}/{total}",
				"calendar.common.book_best": "Besten Slot buchen",
				"calendar.free.select_day_week": "Für freie Zeiten bitte Tag/Woche wählen.",
				"calendar.free.none": "Keine freien Zeiten.",
				"calendar.free.hint": "Klicke auf einen Slot, um ihn als verfügbar zu markieren.",
				"calendar.free.title": "Freie Zeiten",
				"calendar.free.month_hint": "Klicke auf einen Tag, um deine Verfügbarkeit festzulegen.",
				"calendar.free.days_available": "Tage verfügbar",
				"calendar.my_selections.title": "Meine Auswahl",
				"calendar.my_selections.empty": "Noch keine Tage ausgewählt.",
				"calendar.my_selections.jump": "Zum Tag springen",
				"calendar.my_selections.all_slots": "Ganzer Tag",
				"calendar.my_selections.slots": "Slots",
			},
			en: {
				"ps.title": "Personal Space",
				"ps.close": "Close",
				"ps.add": "Add Personal Space",
				"ps.add_hint": "You’ll receive a verification link by email.",
				"ps.new_note": "New note",
				"ps.tags": "Tags",
				"ps.notes": "Notes",
				"ps.pinned_only": "Pinned only",
				"ps.comments_only": "With comments",
				"ps.search": "Search… (tag: task: has: kind: pinned:)",
				"ps.sort": "Sort",
				"ps.save_query": "Save query",
				"query.open": "open",
				"query.done": "done",
				"query.from_notes": "from {n} notes",
				"search.help": "⚡ Query operators:\n• tag:name – filter notes by tag\n• task:open – show open tasks\n• task:done – completed tasks\n• has:task – notes with tasks\n• has:comment – notes with comments\n• has:permalink – notes with active permalink\n• kind:note – filter by type\n• pinned:yes / pinned:no\n• created:>2026-01-01\n• updated:<2026-02-01\n\nCombine freely: task:open tag:projectA",
				"ps.sort_by": "Sort by",
				"ps.sort.modified": "Modified",
				"ps.sort.created": "Created",
				"ps.sort.accessed": "Accessed",
				"ps.sort.text": "Text",
				"ps.tags.and": "AND",
				"ps.tags.or": "OR",
				"header.room_label": "Room",
				"header.room_placeholder": "Room (e.g. KubernetesRoom123)",
				"header.join": "Join",
				"header.new": "New",
				"header.share_room": "Share room",
				"header.favorites_label": "Favorites",
				"header.favorites_placeholder": "Favorites…",
				"header.favorite_toggle": "Add/remove favorite",
				"header.room_prefix": "Room:",
				"header.crdt_toggle": "Hide CRDT markers",
				"tabs.tooltip.private": "Private room · Access requires key",
				"tabs.tooltip.public": "Public room · No key required",
				"tabs.tooltip.shared": "Shared room · Link was shared",
				"editor.note_close": "Close note",
				"editor.copy": "Copy to clipboard",
				"editor.clear_input": "Clear input",
				"comments.toggle": "Toggle comments",
				"comments.title": "Comments",
				"comments.close": "Close",
				"comments.empty": "No comments yet.",
				"comments.input_label": "Comment",
				"comments.input_placeholder": "Comment (Markdown)",
				"comments.add": "Add comment",
				"comments.add_action": "Add comment",
				"comments.save_action": "Save comment",
				"comments.reply_action": "Send reply",
				"comments.edit_action": "Edit comment",
				"comments.delete_action": "Delete comment",
				"arrange.toggle": "Arrange blocks",
				"arrange.title": "Arrange Blocks",
				"arrange.close": "Close",
				"arrange.apply": "Apply",
				"arrange.cancel": "Cancel",
				"arrange.undo": "Undo",
				"arrange.outline": "Headings only",
				"arrange.hint": "Drag to move · ⌥+↑↓ with keyboard",
				"arrange.empty": "No blocks found.",
				"arrange.unsaved": "Discard changes?",
				"editor.nav_back": "Back",
				"editor.nav_forward": "Forward",
				"editor.preview": "Preview",
				"editor.upload": "Upload file",
				"editor.save": "Save",
				"editor.ready": "Ready.",
				"preview.title": "Preview",
				"preview.full": "Full preview",
				"preview.show_input": "Show input",
				"preview.close": "Close preview",
				"preview.iframe": "Markdown Preview",
				"preview.ask_claude": "Ask Claude",
				"preview.use_context": "Use preview as context",
				"preview.ai_mode": "AI mode",
				"preview.ai_mode.none": "No preset",
				"preview.ai_mode.explain": "Explain / Answer",
				"preview.ai_mode.fix": "Fix / Correct",
				"preview.ai_mode.improve": "Improve",
				"preview.ai_mode.run": "Run code",
				"preview.ai_mode.summarize": "Summarize",
				"preview.ai_mode.image": "🎨 Generate image",
				"preview.ask": "Ask",
				"preview.prompt_clear": "Clear prompt",
				"preview.dictate": "Start dictation",
				"preview.dictate_sr": "Dictation",
				"preview.chat_history": "Chat history",
				"preview.chat_you": "You",
				"preview.chat_ai": "AI",
				"preview.chat_clear": "Clear chat",
				"preview.chat_delete": "Delete chat",
				"preview.chat_output": "Chat",
				"toast.dictation_started": "Dictation started.",
				"preview.replace_title": "Replace editor with AI output",
				"preview.replace": "Replace",
				"preview.append_title": "Append AI output to editor",
				"preview.append": "Append",
				"preview.clear_title": "Clear output",
				"preview.clear": "Clear",
				"menu.bold": "Bold",
				"menu.bold_tip": "Make the selected text bold.",
				"menu.italic": "Italic",
				"menu.italic_tip": "Italicize the selected text.",
				"menu.strike": "Strikethrough",
				"menu.strike_tip": "Strike through the selected text.",
				"menu.password_hide": "Hide password",
				"menu.password_hide_tip": "Hide the selected text as a password token.",
				"menu.password": "PW",
				"menu.blockquote": "Blockquote",
				"menu.blockquote_tip": "Turn the selection into a quote block.",
				"menu.bullet": "Bullet list",
				"menu.bullet_tip": "Turn lines into a bulleted list.",
				"menu.bullet_label": "• List",
				"menu.numbered": "Numbered list",
				"menu.numbered_tip": "Turn lines into a numbered list.",
				"menu.numbered_label": "1. List",
				"menu.task": "Task list",
				"menu.task_tip": "Turn lines into a task list with checkboxes.",
				"menu.task_label": "☐ Task",
				"menu.divider": "Divider",
				"menu.divider_tip": "Insert a divider line.",
				"menu.code": "Code block",
				"menu.code_tip": "Wrap the selection in a code block.",
				"menu.link": "Link",
				"menu.link_tip": "Convert the selection into a link.",
				"menu.comment": "Comment",
				"menu.comment_tip": "Add a comment to the selection.",
				"menu.sort_az": "Sort A–Z",
				"menu.sort_az_tip": "Sort selected lines A–Z.",
				"menu.code_lang_label": "Language",
				"menu.code_lang_title": "Language for code block",
				"menu.help_tip": "Open formatting help.",
				"selection.help.title": "Formatting menu",
				"slash.menu.title": "Slash commands",
				"slash.menu.hint": "(Enter/Tab to insert, ↑↓ to navigate)",
				"slash.menu.empty": "No matches.",
				"slash.help.title": "Slash commands",
				"slash.help.message":
					"Type / in the editor and pick a command. Examples: /h1 heading, /b bold, /i italic, /s strike, /quote blockquote, /ul bullet list, /ol numbered list, /todo task list, /done checked task, /tasks task template, /code [lang] code block, /link link, /hr divider, /divider divider, /table 3x2 table, /table row+ add row, /table col- remove column.",
				"slash.item.help": "Help",
				"slash.item.h1": "Heading 1",
				"slash.item.h2": "Heading 2",
				"slash.item.h3": "Heading 3",
				"slash.item.bold": "Bold",
				"slash.item.italic": "Italic",
				"slash.item.strike": "Strikethrough",
				"slash.item.quote": "Blockquote",
				"slash.item.ul": "Bullet list",
				"slash.item.ol": "Numbered list",
				"slash.item.todo": "Task list",
				"slash.item.done": "Task (checked)",
				"slash.item.tasks": "Task template",
				"slash.item.table": "Table",
				"slash.item.table_3x2": "Table (3x2)",
				"slash.item.table_row_add": "Table: row +",
				"slash.item.table_row_remove": "Table: row -",
				"slash.item.table_col_add": "Table: col +",
				"slash.item.table_col_remove": "Table: col -",
				"slash.item.hr": "Horizontal rule",
				"slash.item.divider": "Divider",
				"slash.item.link": "Link",
				"slash.item.code": "Code block",
				"slash.item.code_js": "Code block (JS)",
				"slash.item.code_py": "Code block (PY)",
				"presence.one": "{count} user online",
				"presence.many": "{count} users online",
				"typing.one": "{name} is typing…",
				"typing.many": "{count} people are typing…",
				"settings.open": "Open settings",
				"settings.title": "Settings",
				"settings.desc": "Manage account, export/import, themes, AI, and help.",
				"settings.build": "Build info",
				"settings.close": "Close settings",
				"settings.nav.user": "User Settings",
				"settings.nav.export": "Export/Import",
				"settings.nav.shared": "Shared Rooms",
				"settings.nav.themes": "Themes",
				"settings.nav.calendar": "Calendar",
				"settings.nav.integrations": "Integrations",
				"settings.nav.ai": "AI",
				"settings.nav.uploads": "Uploads",
				"settings.nav.faq": "FAQ",
				"settings.nav.trash": "Trash",
				"settings.user.title": "User Settings",
				"settings.user.desc": "Personal Space identity and sign-out.",
				"settings.user.signed_in": "Signed in as",
				"settings.user.sign_out": "Sign out",
				"settings.user.signed_out":
					"Not signed in. Use \"Add Personal Space\" to get started.",
				"settings.user.favorites.title": "Favorites",
				"settings.user.favorites.desc": "Edit favorites, add or remove notes.",
				"settings.user.favorites.empty": "No favorites yet.",
				"settings.shared.title": "Shared Rooms",
				"settings.shared.desc": "Manage and remove shared rooms.",
				"settings.shared.empty": "No shared rooms saved.",
				"settings.shared.empty_filtered": "No matches for the filter.",
				"settings.shared.open": "Open",
				"settings.shared.remove": "Remove",
				"settings.shared.updated": "Last shared:",
				"settings.shared.search_placeholder": "Search shared rooms",
				"settings.shared.clear": "Remove all",
				"settings.shared.clear_title": "Clear shared rooms",
				"settings.shared.clear_confirm": "Do you want to remove all shared rooms?",
				"settings.shared.clear_ok": "Remove all",
				"settings.shared.clear_cancel": "Cancel",
				"settings.user.favorites.remove": "Remove",
				"settings.user.favorites.note_label": "Note",
				"settings.user.favorites.note_placeholder": "Short note (optional)",
				"settings.user.favorites.startup_active":
					"Marked as default room on app start (Click to deactivate)",
				"settings.user.favorites.startup_inactive":
					"Mark as default room on app start",
				"settings.user.mobile_auto.title": "Mobile: new note after inactivity",
				"settings.user.mobile_auto.desc":
					"How many seconds of inactivity before creating a new note on next start.",
				"settings.user.mobile_auto.unit": "Seconds (0 = off)",
				"settings.language.title": "App language",
				"settings.language.desc": "Choose the interface language.",
				"settings.language.de": "German",
				"settings.language.en": "English",
				"settings.tasks.title": "Markdown tasks",
				"settings.tasks.desc":
					"Automatically move open tasks to the top when closing preview.",
				"settings.tasks.auto_sort": "Open items first",
				"settings.datetime.title": "Date & time",
				"settings.datetime.desc":
					"Date and time format for Personal Space.",
				"settings.datetime.date_label": "Date format",
				"settings.datetime.time_label": "Time format",
				"settings.datetime.date_auto": "System",
				"settings.datetime.date_dmy": "DD.MM.YYYY",
				"settings.datetime.date_ymd": "YYYY-MM-DD",
				"settings.datetime.date_mdy": "MM/DD/YYYY",
				"settings.datetime.time_auto": "System",
				"settings.datetime.time_24h": "24h",
				"settings.datetime.time_12h": "12h AM/PM",
				"settings.export.title": "Export/Import",
				"settings.export.desc": "Back up or import your Personal Space notes.",
				"settings.export.export": "Export",
				"settings.export.import": "Import",
				"settings.export.merge": "Merge",
				"settings.export.replace": "Replace",
				"settings.export.autobackup.title": "Auto-backup",
				"settings.export.autobackup.desc":
					"Regularly backs up your Personal Space notes to a local folder.",
				"settings.export.autobackup.active": "Active",
				"settings.export.autobackup.daily": "Daily",
				"settings.export.autobackup.weekly": "Weekly",
				"settings.export.autobackup.monthly": "Monthly",
				"settings.export.autobackup.choose_folder": "Choose folder",
				"settings.export.autobackup.no_folder": "No folder selected",
				"settings.export.autobackup.unsupported":
					"Unavailable (browser does not support folder access).",
				"settings.export.autoimport.title": "Auto-import",
				"settings.export.autoimport.desc":
					"Imports new JSON/Markdown files from a folder (merge).",
				"settings.export.autoimport.active": "Active",
				"settings.export.autoimport.daily": "Daily",
				"settings.export.autoimport.weekly": "Weekly",
				"settings.export.autoimport.monthly": "Monthly",
				"settings.export.autoimport.choose_folder": "Choose folder",
				"settings.export.autoimport.no_folder": "No folder selected",
				"settings.export.autoimport.unsupported":
					"Unavailable (browser does not support folder access).",
				"settings.calendar.title": "Calendar",
				"settings.calendar.desc": "Connect calendars and choose a default view.",
				"settings.calendar.default_view": "Default view",
				"settings.calendar.view.day": "Day",
				"settings.calendar.view.week": "Week",
				"settings.calendar.view.month": "Month",
				"settings.calendar.sources.title": "Calendar sources",
				"settings.calendar.sources.desc": "Add public ICS links (CORS must be allowed).",
				"settings.calendar.sources.empty": "No calendars connected.",
				"settings.calendar.local.title": "Local events",
				"settings.calendar.local.desc":
					"Manually created events are stored locally and synced to Personal Space (if active).",
				"settings.calendar.local.empty": "No local events.",
				"settings.calendar.google.title": "Google Calendar",
				"settings.calendar.google.desc": "Connect your Google Calendar to write events.",
				"settings.calendar.google.status_disconnected": "Not connected.",
				"settings.calendar.google.connected": "Connected",
				"settings.calendar.google.not_configured":
					"Google Calendar is not configured.",
				"settings.calendar.google.unavailable": "Google status unavailable.",
				"settings.calendar.google.select": "Select calendar",
				"settings.calendar.google.primary": "Primary",
				"settings.calendar.google.connect": "Connect Google",
				"settings.calendar.google.disconnect": "Disconnect",
				"settings.calendar.outlook.title": "Outlook Calendar",
				"settings.calendar.outlook.desc": "Connect your Outlook Calendar to write events.",
				"settings.calendar.outlook.status_disconnected": "Not connected.",
				"settings.calendar.outlook.connected": "Connected",
				"settings.calendar.outlook.not_configured":
					"Outlook Calendar is not configured.",
				"settings.calendar.outlook.unavailable": "Outlook status unavailable.",
				"settings.calendar.outlook.select": "Select calendar",
				"settings.calendar.outlook.primary": "Default",
				"settings.calendar.outlook.connect": "Connect Outlook",
				"settings.calendar.outlook.disconnect": "Disconnect",
				"settings.calendar.add.title": "Add new calendar",
				"settings.calendar.add.name": "Name",
				"settings.calendar.add.name_placeholder": "Team, Personal, Vacation",
				"settings.calendar.add.color": "Color",
				"settings.calendar.add.url": "ICS URL",
				"settings.calendar.add.url_placeholder":
					"https://example.com/calendar.ics",
				"settings.calendar.add.active": "Active",
				"settings.calendar.add.submit": "Add",
				"settings.integrations.title": "Integrations",
				"settings.integrations.desc":
					"Manage app integrations (API keys encrypted on the server).",
				"settings.integrations.linear.title": "Linear",
				"settings.integrations.linear.desc":
					"Store the API key encrypted in Personal Space and pick projects for sharing.",
				"settings.integrations.linear.key_label": "Linear API key",
				"settings.integrations.linear.save": "Save",
				"settings.integrations.linear.clear": "Clear",
				"settings.integrations.linear.load": "Load projects",
				"settings.integrations.linear.projects.title": "Projects for room sharing",
				"settings.integrations.linear.projects.desc":
					"Select which projects can be shared in rooms.",
				"settings.integrations.linear.projects.empty": "No projects loaded.",
				"settings.integrations.bfl.title": "FLUX.2 (BFL)",
				"settings.integrations.bfl.desc":
					"Store BFL API key encrypted in Personal Space for AI image generation.",
				"settings.integrations.bfl.key_label": "BFL API key",
				"settings.integrations.bfl.save": "Save",
				"settings.integrations.bfl.clear": "Clear",
				"settings.integrations.bfl.api_link": "→ Create API key at api.bfl.ai",
				"settings.trash.title": "Trash",
				"settings.trash.desc": "Deleted notes are kept for 30 days and can be restored.",
				"settings.trash.refresh": "Refresh",
				"settings.trash.empty": "No deleted notes.",
				"settings.themes.title": "Themes",
				"settings.themes.desc": "Choose a background style. Stored locally.",
				"settings.themes.glow.title": "Background Glow",
				"settings.themes.glow.desc": "Enable or disable the theme glow.",
				"settings.themes.glow_on": "Glow on",
				"settings.themes.glow_off": "Glow off",
				"settings.ai.title": "AI",
				"settings.ai.desc": "API key is stored locally and used per request.",
				"settings.ai.key_label": "Anthropic API key",
				"settings.ai.model_label": "Model (optional)",
				"settings.ai.save": "Save",
				"settings.ai.clear": "Clear",
				"settings.ai.status_local_key": "Local API key active.",
				"settings.ai.status_server_key": "Server key active.",
				"settings.ai.status_not_configured": "AI not configured.",
				"settings.ai.status_unavailable": "AI status unavailable.",
				"settings.ai.status_model": "Model",
				"settings.ai.status_last_used": "Last used",
				"settings.ai.status_latest": "Latest available",
				"settings.ai.status_checked": "Checked",
				"settings.faq.title": "FAQ",
				"settings.faq.desc": "Quick answers and tips.",
				"settings.faq.search_label": "Search FAQ",
				"settings.faq.search_placeholder": "Search…",
				"faq.no_results": "No results.",
				"settings.uploads.title": "Uploads",
				"settings.uploads.desc": "Manage uploaded files.",
				"settings.uploads.refresh": "Refresh",
				"settings.uploads.empty": "No uploads.",
				"calendar.local.remove": "Remove",
				"modal.title": "Modal",
				"modal.close": "Close",
				"modal.input": "Input",
				"modal.cancel": "Cancel",
				"modal.ok": "OK",
				"calendar.modal.title": "New event",
				"calendar.modal.desc": "Simple event in the local calendar.",
				"calendar.modal.close": "Close calendar event modal",
				"calendar.modal.title_label": "Title",
				"calendar.modal.title_placeholder": "Event",
				"calendar.modal.date": "Date",
				"calendar.modal.all_day": "All day",
				"calendar.modal.start": "Start",
				"calendar.modal.end": "End",
				"calendar.modal.sync_label": "Sync target",
				"calendar.modal.sync.local": "Local only",
				"calendar.modal.sync.google": "Google Calendar",
				"calendar.modal.sync.outlook": "Outlook Calendar",
				"toast.dictation_failed": "Dictation failed.",
				"toast.ai_saved": "AI settings saved.",
				"toast.ai_cleared": "AI settings cleared.",
				"toast.ps_activated": "Personal Space activated.",
				"toast.linear_saved": "Linear settings saved.",
				"toast.linear_cleared": "Linear settings cleared.",
				"toast.linear_key_failed": "Linear API key could not be saved.",
				"toast.bfl_saved": "BFL API key saved.",
				"toast.bfl_cleared": "BFL API key cleared.",
				"toast.bfl_key_failed": "BFL API key could not be saved.",
				"bfl.status.key_set": "✓ BFL API key configured.",
				"bfl.status.no_key": "No BFL API key configured.",
				"ai.image.download": "Download",
				"ai.image.save_upload": "Save to Uploads",
				"ai.image.insert_mirror": "Insert in Mirror",
				"ai.image.uploading": "Uploading…",
				"ai.image.saved": "Saved",
				"ai.image.inserted": "Inserted",
				"toast.ai_image_uploaded": "Image saved to uploads.",
				"toast.ai_image_upload_failed": "Upload failed",
				"toast.ai_image_inserted": "Image inserted into Mirror.",
				"toast.linear_projects_loaded": "Linear projects loaded.",
				"toast.linear_projects_failed": "Linear projects could not be loaded.",
				"toast.linear_tasks_failed": "Linear tasks could not be loaded.",
				"toast.linear_select_project": "Please select a Linear project.",
				"toast.linear_missing_key": "Linear API key is missing.",
				"linear.embed.title": "Linear",
				"linear.embed.select_placeholder": "Select project",
				"linear.embed.apply": "Share",
				"linear.embed.refresh": "Refresh",
				"linear.embed.empty": "No tasks loaded.",
				"linear.embed.open": "Open in Linear",
				"linear.view.board": "Board",
				"linear.view.stats": "Stats",
				"linear.stats.empty": "No tasks available for analysis.",
				"linear.stats.total": "Total · {count}",
				"linear.stats.done": "Done",
				"linear.stats.in_progress": "In progress",
				"linear.stats.blocked": "Blocked",
				"linear.stats.overdue": "Overdue",
				"linear.stats.due_soon": "Due soon (7d)",
				"linear.stats.by_status": "Status",
				"linear.stats.by_assignee": "Assignee",
				"linear.stats.unassigned": "Unassigned",
				"linear.stats.updated": "Updated · {date}",
				"linear.stats.unknown": "Unknown",
				"linear.status.key_set": "API key set.",
				"linear.status.key_set_with_projects":
					"API key set · {count} projects",
				"linear.status.no_key": "No API key set.",
				"linear.status.loading": "Loading Linear…",
				"linear.status.failed": "Linear unavailable.",
				"editor.permalink": "Permanent Link",
				"editor.permalink_active": "Permanent Link active",
				"toast.permalink_activated": "Permanent Link activated.",
				"toast.permalink_deactivated": "Permanent Link deactivated.",
				"permalink.info.title": "Permanent Link",
				"permalink.info.message": "Pins the current content (note or text) permanently to this room tab. Guests automatically see the pinned content when they enter the room. Click again to remove the pin. Embedded apps (Excalidraw, Excel, Linear) are shared as well.",
				"offline.now_offline": "You are offline. Changes are saved locally.",
				"offline.back_online": "Back online — syncing…",
				"offline.synced": "Offline changes synced.",
				"offline.saved_locally": "Saved offline.",
				"settings.nav.shortcuts": "Shortcuts",
				"settings.shortcuts.title": "Keyboard Shortcuts",
				"settings.shortcuts.desc": "Overview of all keyboard shortcuts for quick access.",
				"shortcuts.new_note": "New Note",
				"shortcuts.new_note_desc": "Creates a new note in the current tab/room.",
				"shortcuts.save": "Save Note",
				"shortcuts.save_desc": "Saves the current note immediately.",
				"shortcuts.settings": "Open Settings",
				"shortcuts.settings_desc": "Opens the settings panel.",
				"shortcuts.preview": "Toggle Preview",
				"shortcuts.preview_desc": "Toggles the Markdown preview on or off.",
				"shortcuts.focus_room": "Focus Room Input",
				"shortcuts.focus_room_desc": "Focuses the room input field for quick switching.",
				"shortcuts.copy": "Copy Editor Content",
				"shortcuts.copy_desc": "Copies the entire editor content to clipboard.",
				"shortcuts.upload": "Open Upload Dialog",
				"shortcuts.upload_desc": "Opens the file upload dialog.",
				"toast.shortcut_new_note": "New note created.",
				"toast.shortcut_saved": "Note saved.",
				"toast.shortcut_copied": "Content copied.",
				"calendar.common.title": "Common free slots",
				"calendar.common.toggle": "Share availability",
				"calendar.common.sharing": "Sharing",
				"calendar.common.not_sharing": "Not sharing",
				"calendar.common.no_shared_room": "Only available in shared rooms.",
				"calendar.common.no_participants": "No participants sharing availability yet.",
				"calendar.common.no_common": "No common free time.",
				"calendar.common.select_day_week": "Select Day/Week for common free slots.",
				"calendar.common.all_free": "all free",
				"calendar.common.partial": "{n}/{total}",
				"calendar.common.book_best": "Book best slot",
				"calendar.free.select_day_week": "Select Day/Week for free slots.",
				"calendar.free.none": "No free times.",
				"calendar.free.hint": "Click a slot to mark it as available.",
				"calendar.free.title": "Free slots",
				"calendar.free.month_hint": "Click a day to set your availability.",
				"calendar.free.days_available": "days available",
				"calendar.my_selections.title": "My selections",
				"calendar.my_selections.empty": "No days selected yet.",
				"calendar.my_selections.jump": "Jump to day",
				"calendar.my_selections.all_slots": "All day",
				"calendar.my_selections.slots": "Slots",
			},
		};

		function getUiString(key) {
			const table = UI_STRINGS[uiLang] || {};
			if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
			const fallbackTable = UI_STRINGS[UI_LANG_DEFAULT] || {};
			if (Object.prototype.hasOwnProperty.call(fallbackTable, key)) {
				return fallbackTable[key];
			}
			return null;
		}

		function t(key, fallback) {
			const v = getUiString(key);
			if (v !== null && v !== undefined) return v;
			return fallback !== undefined ? fallback : key;
		}

		function formatUi(template, vars) {
			const source = String(template || "");
			const values = vars && typeof vars === "object" ? vars : {};
			return source.replace(/\{(\w+)\}/g, (match, key) => {
				if (Object.prototype.hasOwnProperty.call(values, key)) {
					return String(values[key]);
				}
				return match;
			});
		}

		function getUiLocale() {
			return uiLang === "en" ? "en-US" : "de-DE";
		}

		function getUiSpeechLocale() {
			return uiLang === "en" ? "en-US" : "de-DE";
		}

		function detectUiLanguage() {
			try {
				const stored = localStorage.getItem(UI_LANG_KEY);
				if (stored && UI_LANGS.includes(stored)) return stored;
			} catch {
				// ignore
			}
			const nav = String(navigator.language || "").toLowerCase();
			return nav.startsWith("en") ? "en" : "de";
		}

		function applyI18nAttribute(dataAttr, targetAttr) {
			document.querySelectorAll(`[${dataAttr}]`).forEach((el) => {
				const key = el.getAttribute(dataAttr);
				if (!key) return;
				const next = getUiString(key);
				if (next === null || next === undefined) return;
				el.setAttribute(targetAttr, next);
			});
		}

		function applyUiTranslations() {
			document.querySelectorAll("[data-i18n]").forEach((el) => {
				const key = el.getAttribute("data-i18n");
				if (!key) return;
				const next = getUiString(key);
				if (next === null || next === undefined) return;
				el.textContent = next;
			});
			applyI18nAttribute("data-i18n-placeholder", "placeholder");
			applyI18nAttribute("data-i18n-title", "title");
			applyI18nAttribute("data-i18n-aria", "aria-label");
		}

		function syncUiLangButtons() {
			if (uiLangDeBtn) {
				const active = uiLang === "de";
				uiLangDeBtn.setAttribute("aria-pressed", active ? "true" : "false");
				uiLangDeBtn.classList.toggle("bg-fuchsia-500/20", active);
				uiLangDeBtn.classList.toggle("text-fuchsia-100", active);
				uiLangDeBtn.classList.toggle("border-fuchsia-300/40", active);
				uiLangDeBtn.classList.toggle("bg-white/5", !active);
			}
			if (uiLangEnBtn) {
				const active = uiLang === "en";
				uiLangEnBtn.setAttribute("aria-pressed", active ? "true" : "false");
				uiLangEnBtn.classList.toggle("bg-fuchsia-500/20", active);
				uiLangEnBtn.classList.toggle("text-fuchsia-100", active);
				uiLangEnBtn.classList.toggle("border-fuchsia-300/40", active);
				uiLangEnBtn.classList.toggle("bg-white/5", !active);
			}
		}

		function applyUiLanguage() {
			document.documentElement.setAttribute("lang", uiLang === "en" ? "en" : "de");
			applyUiTranslations();
			syncUiLangButtons();
			applyGlowEnabled();
			renderFaq();
			updateLinearProjectSelectOptions(getLinearNoteId());
			renderLinearTasks(getLinearNoteId());
			updateLinearApiStatus();
			if (aiDictationRecognizer) {
				aiDictationRecognizer.lang = getUiSpeechLocale();
			}
		}

		function setUiLanguage(next) {
			const lang = UI_LANGS.includes(next) ? next : UI_LANG_DEFAULT;
			uiLang = lang;
			try {
				localStorage.setItem(UI_LANG_KEY, uiLang);
			} catch {
				// ignore
			}
			applyUiLanguage();
		}

		function initUiLanguage() {
			uiLang = detectUiLanguage();
			applyUiLanguage();
		}

	function renderThemeList() {
		if (!settingsThemeList) return;
		settingsThemeList.innerHTML = "";
		const orderedKeys = THEME_ORDER.filter((key) => THEMES[key]);
		const remainingKeys = Object.keys(THEMES).filter(
			(key) => !THEME_ORDER.includes(key)
		);
		const keys = [...orderedKeys, ...remainingKeys];
		keys.forEach((key) => {
			const theme = THEMES[key];
			const btn = document.createElement("button");
			const top = theme.top || theme.accentBg || "rgba(148, 163, 184, 0.4)";
			const bottom =
				theme.bottom || theme.accentBgSoft || theme.accentBg || "rgba(148, 163, 184, 0.2)";
			btn.type = "button";
			btn.className =
				"theme-option flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10";
			btn.setAttribute("data-theme", key);
			btn.setAttribute("aria-pressed", "false");
			btn.innerHTML = `<span class="theme-swatch" style="--swatch-top: ${top}; --swatch-bottom: ${bottom};"></span><span>${
				theme.label || key
			}</span>`;
			settingsThemeList.appendChild(btn);
		});
		syncThemeListActive();
	}

	function syncThemeListActive() {
		if (!settingsThemeList) return;
		const buttons = settingsThemeList.querySelectorAll("[data-theme]");
		buttons.forEach((btn) => {
			const themeName = btn.getAttribute("data-theme");
			const active = themeName === activeTheme;
			btn.setAttribute("aria-pressed", active ? "true" : "false");
			btn.classList.toggle("bg-white/10", active);
			btn.classList.toggle("ring-2", active);
			btn.classList.toggle("ring-fuchsia-400/40", active);
			btn.classList.toggle("border-fuchsia-300/40", active);
		});
	}

	function loadGlowEnabled() {
		try {
			const raw = localStorage.getItem(GLOW_ENABLED_KEY);
			glowEnabled = raw === null ? true : raw === "1";
		} catch {
			glowEnabled = true;
		}
		applyGlowEnabled();
	}

	function applyGlowEnabled() {
		const glowBlocked = GLOW_BLOCKED_THEMES.has(activeTheme);
		const effectiveGlowEnabled = glowEnabled && !glowBlocked;
		document.body.classList.toggle("glow-disabled", !effectiveGlowEnabled);
		if (settingsGlowToggle) {
			settingsGlowToggle.setAttribute(
				"aria-pressed",
				effectiveGlowEnabled ? "true" : "false"
			);
			settingsGlowToggle.textContent = effectiveGlowEnabled
				? t("settings.themes.glow_on")
				: t("settings.themes.glow_off");
			settingsGlowToggle.classList.toggle(
				"bg-fuchsia-500/20",
				effectiveGlowEnabled
			);
			settingsGlowToggle.classList.toggle(
				"text-fuchsia-100",
				effectiveGlowEnabled
			);
			settingsGlowToggle.classList.toggle(
				"bg-white/5",
				!effectiveGlowEnabled
			);
			settingsGlowToggle.classList.toggle("opacity-60", glowBlocked);
			settingsGlowToggle.classList.toggle("cursor-not-allowed", glowBlocked);
			settingsGlowToggle.classList.toggle("pointer-events-none", glowBlocked);
			if (glowBlocked) {
				settingsGlowToggle.setAttribute("disabled", "disabled");
				settingsGlowToggle.setAttribute("aria-disabled", "true");
			} else {
				settingsGlowToggle.removeAttribute("disabled");
				settingsGlowToggle.setAttribute("aria-disabled", "false");
			}
		}
	}

	function saveGlowEnabled(next) {
		glowEnabled = Boolean(next);
		try {
			localStorage.setItem(GLOW_ENABLED_KEY, glowEnabled ? "1" : "0");
		} catch {
			// ignore
		}
		applyGlowEnabled();
	}

	function applyTaskAutoSortUi() {
		if (!taskAutoSortToggle) return;
		taskAutoSortToggle.checked = Boolean(taskAutoSortEnabled);
	}

	function loadTaskAutoSortEnabled() {
		try {
			const raw = localStorage.getItem(TASK_AUTO_SORT_KEY);
			taskAutoSortEnabled = raw === "1";
		} catch {
			taskAutoSortEnabled = false;
		}
		applyTaskAutoSortUi();
	}

	function normalizeDateFormat(raw) {
		const next = String(raw || "").toLowerCase();
		if (next === "dmy" || next === "ymd" || next === "mdy") return next;
		return "locale";
	}

	function normalizeTimeFormat(raw) {
		const next = String(raw || "").toLowerCase();
		if (next === "24h" || next === "12h") return next;
		return "locale";
	}

	function applyDateTimeFormatUi() {
		if (settingsDateFormatSelect) {
			settingsDateFormatSelect.value = dateFormat;
		}
		if (settingsTimeFormatSelect) {
			settingsTimeFormatSelect.value = timeFormat;
		}
	}

	function loadDateFormatSetting() {
		try {
			const raw = localStorage.getItem(DATE_FORMAT_KEY);
			dateFormat = normalizeDateFormat(raw);
		} catch {
			dateFormat = "locale";
		}
		applyDateTimeFormatUi();
	}

	function loadTimeFormatSetting() {
		try {
			const raw = localStorage.getItem(TIME_FORMAT_KEY);
			timeFormat = normalizeTimeFormat(raw);
		} catch {
			timeFormat = "locale";
		}
		applyDateTimeFormatUi();
	}

	function saveDateFormatSetting(next) {
		dateFormat = normalizeDateFormat(next);
		try {
			localStorage.setItem(DATE_FORMAT_KEY, dateFormat);
		} catch {
			// ignore
		}
		applyDateTimeFormatUi();
		schedulePsListRerender();
	}

	function saveTimeFormatSetting(next) {
		timeFormat = normalizeTimeFormat(next);
		try {
			localStorage.setItem(TIME_FORMAT_KEY, timeFormat);
		} catch {
			// ignore
		}
		applyDateTimeFormatUi();
		schedulePsListRerender();
	}

	function saveTaskAutoSortEnabled(next) {
		taskAutoSortEnabled = Boolean(next);
		try {
			localStorage.setItem(TASK_AUTO_SORT_KEY, taskAutoSortEnabled ? "1" : "0");
		} catch {
			// ignore
		}
		applyTaskAutoSortUi();
	}

	function loadAiPrompt() {
		try {
			aiPrompt = String(localStorage.getItem(AI_PROMPT_KEY) || "");
		} catch {
			aiPrompt = "";
		}
		if (aiPromptInput) aiPromptInput.value = aiPrompt;
	}

	function loadAiUsePreview() {
		try {
			const raw = localStorage.getItem(AI_USE_PREVIEW_KEY);
			aiUsePreview = raw === null ? true : raw !== "0";
		} catch {
			aiUsePreview = true;
		}
		setAiUsePreviewUi(aiUsePreview);
	}

	function loadAiUseAnswer() {
		aiUseAnswer = true;
		setAiUseAnswerUi(aiUseAnswer);
	}

	function normalizeMobileAutoNoteSeconds(raw) {
		const n = Number(raw);
		if (!Number.isFinite(n) || n < 0) return 0;
		return Math.min(3600, Math.round(n));
	}

	function loadMobileAutoNoteSeconds() {
		try {
			const raw = localStorage.getItem(MOBILE_AUTO_NOTE_SECONDS_KEY);
			mobileAutoNoteSeconds = normalizeMobileAutoNoteSeconds(raw);
		} catch {
			mobileAutoNoteSeconds = 0;
		}
		if (mobileAutoNoteSecondsInput)
			mobileAutoNoteSecondsInput.value = String(mobileAutoNoteSeconds || 0);
	}

	function saveMobileAutoNoteSeconds(next) {
		mobileAutoNoteSeconds = normalizeMobileAutoNoteSeconds(next);
		try {
			localStorage.setItem(
				MOBILE_AUTO_NOTE_SECONDS_KEY,
				String(mobileAutoNoteSeconds)
			);
		} catch {
			// ignore
		}
		if (mobileAutoNoteSecondsInput)
			mobileAutoNoteSecondsInput.value = String(mobileAutoNoteSeconds || 0);
	}

	function recordMobileLastActive() {
		try {
			localStorage.setItem(MOBILE_LAST_ACTIVE_KEY, String(Date.now()));
		} catch {
			// ignore
		}
	}

	function shouldStartMobileAutoNote() {
		if (!isMobileViewport()) return false;
		if (!psState || !psState.authed) return false;
		if (!mobileAutoNoteSeconds || mobileAutoNoteSeconds <= 0) return false;
		try {
			const raw = localStorage.getItem(MOBILE_LAST_ACTIVE_KEY);
			const last = Number(raw || 0);
			if (!Number.isFinite(last) || last <= 0) return true;
			return Date.now() - last >= mobileAutoNoteSeconds * 1000;
		} catch {
			return true;
		}
	}

	function maybeStartMobileAutoNoteSession() {
		if (mobileAutoNoteChecked) return;
		mobileAutoNoteChecked = true;
		if (!shouldStartMobileAutoNote()) return;
		mobilePsOpen = false;
		if (previewOpen) setPreviewVisible(false);
		syncMobileFocusState();
		if (psNewNote) {
			psNewNote.click();
		}
	}

	const FS_HANDLE_DB = "mirror_fs_handles_v1";
	const FS_HANDLE_STORE = "handles";
	const AUTO_BACKUP_HANDLE_KEY = "ps_auto_backup_dir";
	const AUTO_IMPORT_HANDLE_KEY = "ps_auto_import_dir";
	const AUTO_IMPORT_MAX_PER_RUN = 5;

	function supportsDirectoryAccess() {
		return typeof window.showDirectoryPicker === "function";
	}

	function setAutoBackupStatus(message) {
		if (!psAutoBackupStatus) return;
		psAutoBackupStatus.textContent = String(message || "");
	}

	function setAutoImportStatus(message) {
		if (!psAutoImportStatus) return;
		psAutoImportStatus.textContent = String(message || "");
	}

	function normalizeAutoInterval(raw, fallback) {
		const val = String(raw || "").trim().toLowerCase();
		if (val === "weekly" || val === "monthly") return val;
		if (val === "daily") return "daily";
		return fallback;
	}

	function autoIntervalToMs(interval) {
		switch (String(interval || "").toLowerCase()) {
			case "weekly":
				return 7 * 24 * 60 * 60 * 1000;
			case "monthly":
				return 30 * 24 * 60 * 60 * 1000;
			case "daily":
			default:
				return 24 * 60 * 60 * 1000;
		}
	}

	function openFsHandleDb() {
		return new Promise((resolve, reject) => {
			if (!window.indexedDB) {
				reject(new Error("IndexedDB unavailable"));
				return;
			}
			const req = window.indexedDB.open(FS_HANDLE_DB, 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains(FS_HANDLE_STORE)) {
					db.createObjectStore(FS_HANDLE_STORE);
				}
			};
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error || new Error("DB open failed"));
		});
	}

	async function readFsHandle(key) {
		if (!supportsDirectoryAccess()) return null;
		try {
			const db = await openFsHandleDb();
			return await new Promise((resolve) => {
				const tx = db.transaction(FS_HANDLE_STORE, "readonly");
				const store = tx.objectStore(FS_HANDLE_STORE);
				const req = store.get(key);
				req.onsuccess = () => resolve(req.result || null);
				req.onerror = () => resolve(null);
			});
		} catch {
			return null;
		}
	}

	async function writeFsHandle(key, handle) {
		if (!supportsDirectoryAccess()) return false;
		try {
			const db = await openFsHandleDb();
			return await new Promise((resolve) => {
				const tx = db.transaction(FS_HANDLE_STORE, "readwrite");
				const store = tx.objectStore(FS_HANDLE_STORE);
				const req = store.put(handle, key);
				req.onsuccess = () => resolve(true);
				req.onerror = () => resolve(false);
			});
		} catch {
			return false;
		}
	}

	// ─── Offline Store (IndexedDB) ───────────────────────────────────
	const OFFLINE_DB_NAME = "mirror_offline_v1";
	const OFFLINE_DB_VERSION = 1;
	const OFFLINE_STORE_NOTES = "notes";
	const OFFLINE_STORE_OPS = "pendingOps";
	const OFFLINE_STORE_META = "meta";
	let offlineDb = null;

	function openOfflineDb() {
		if (offlineDb) return Promise.resolve(offlineDb);
		return new Promise((resolve, reject) => {
			if (!window.indexedDB) { reject(new Error("IndexedDB unavailable")); return; }
			const req = window.indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains(OFFLINE_STORE_NOTES)) {
					db.createObjectStore(OFFLINE_STORE_NOTES, { keyPath: "id" });
				}
				if (!db.objectStoreNames.contains(OFFLINE_STORE_OPS)) {
					db.createObjectStore(OFFLINE_STORE_OPS, { keyPath: "opId", autoIncrement: true });
				}
				if (!db.objectStoreNames.contains(OFFLINE_STORE_META)) {
					db.createObjectStore(OFFLINE_STORE_META);
				}
			};
			req.onsuccess = () => { offlineDb = req.result; resolve(offlineDb); };
			req.onerror = () => reject(req.error || new Error("OfflineDB open failed"));
		});
	}

	async function offlinePutNote(note) {
		if (!note || !note.id) return;
		try {
			const db = await openOfflineDb();
			const tx = db.transaction(OFFLINE_STORE_NOTES, "readwrite");
			tx.objectStore(OFFLINE_STORE_NOTES).put({
				id: String(note.id),
				text: String(note.text || ""),
				tags: Array.isArray(note.tags) ? note.tags : [],
				kind: String(note.kind || ""),
				createdAt: Number(note.createdAt || Date.now()),
				updatedAt: Number(note.updatedAt || Date.now()),
				deletedAt: note.deletedAt || null,
				dirty: note.dirty || false,
			});
			await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej; });
		} catch (e) { console.warn("[offline] putNote failed:", e); }
	}

	async function offlinePutNotes(notes) {
		if (!Array.isArray(notes)) return;
		try {
			const db = await openOfflineDb();
			const tx = db.transaction(OFFLINE_STORE_NOTES, "readwrite");
			const store = tx.objectStore(OFFLINE_STORE_NOTES);
			// Full-sync: clear all existing entries first, then put server notes.
			// This removes ghost entries (deleted on server but still in IndexedDB).
			store.clear();
			for (const n of notes) {
				if (!n || !n.id) continue;
				store.put({
					id: String(n.id),
					text: String(n.text || ""),
					tags: Array.isArray(n.tags) ? n.tags : [],
					kind: String(n.kind || ""),
					createdAt: Number(n.createdAt || Date.now()),
					updatedAt: Number(n.updatedAt || Date.now()),
					deletedAt: n.deletedAt || null,
					dirty: false,
				});
			}
			await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej; });
		} catch (e) { console.warn("[offline] putNotes failed:", e); }
	}

	async function offlineGetAllNotes() {
		try {
			const db = await openOfflineDb();
			return await new Promise((resolve) => {
				const tx = db.transaction(OFFLINE_STORE_NOTES, "readonly");
				const req = tx.objectStore(OFFLINE_STORE_NOTES).getAll();
				req.onsuccess = () => resolve(req.result || []);
				req.onerror = () => resolve([]);
			});
		} catch { return []; }
	}

	async function offlineDeleteNote(noteId) {
		try {
			const db = await openOfflineDb();
			const tx = db.transaction(OFFLINE_STORE_NOTES, "readwrite");
			tx.objectStore(OFFLINE_STORE_NOTES).delete(String(noteId));
			await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej; });
		} catch (e) { console.warn("[offline] deleteNote failed:", e); }
	}

	// --- Pending Operations Queue ---
	async function offlineEnqueueOp(op) {
		try {
			const db = await openOfflineDb();
			const tx = db.transaction(OFFLINE_STORE_OPS, "readwrite");
			tx.objectStore(OFFLINE_STORE_OPS).add({
				...op,
				ts: Date.now(),
			});
			await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej; });
		} catch (e) { console.warn("[offline] enqueueOp failed:", e); }
	}

	async function offlineGetAllOps() {
		try {
			const db = await openOfflineDb();
			return await new Promise((resolve) => {
				const tx = db.transaction(OFFLINE_STORE_OPS, "readonly");
				const req = tx.objectStore(OFFLINE_STORE_OPS).getAll();
				req.onsuccess = () => resolve(req.result || []);
				req.onerror = () => resolve([]);
			});
		} catch { return []; }
	}

	async function offlineClearOps() {
		try {
			const db = await openOfflineDb();
			const tx = db.transaction(OFFLINE_STORE_OPS, "readwrite");
			tx.objectStore(OFFLINE_STORE_OPS).clear();
			await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej; });
		} catch (e) { console.warn("[offline] clearOps failed:", e); }
	}

	async function offlineSaveMeta(key, value) {
		try {
			const db = await openOfflineDb();
			const tx = db.transaction(OFFLINE_STORE_META, "readwrite");
			tx.objectStore(OFFLINE_STORE_META).put(value, key);
			await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej; });
		} catch (e) { console.warn("[offline] saveMeta failed:", e); }
	}

	async function offlineLoadMeta(key) {
		try {
			const db = await openOfflineDb();
			return await new Promise((resolve) => {
				const tx = db.transaction(OFFLINE_STORE_META, "readonly");
				const req = tx.objectStore(OFFLINE_STORE_META).get(key);
				req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
				req.onerror = () => resolve(null);
			});
		} catch { return null; }
	}

	// --- Offline save: store note locally + enqueue sync op ---
	async function offlineSaveNote(noteId, text, tagsPayload) {
		const id = String(noteId || "").trim();
		if (!id) {
			// Offline create: generate temp ID
			const tempId = "offline_" + crypto.randomUUID();
			const note = {
				id: tempId,
				text: String(text || ""),
				tags: Array.isArray(tagsPayload) ? tagsPayload : [],
				kind: "",
				createdAt: Date.now(),
				updatedAt: Date.now(),
				dirty: true,
			};
			await offlinePutNote(note);
			await offlineEnqueueOp({ type: "create", tempId, text: note.text, tags: note.tags });
			return note;
		}
		// Offline update
		const allNotes = await offlineGetAllNotes();
		const existing = allNotes.find((n) => n.id === id);
		const note = {
			id,
			text: String(text || ""),
			tags: Array.isArray(tagsPayload) ? tagsPayload : (existing ? existing.tags : []),
			kind: existing ? existing.kind : "",
			createdAt: existing ? existing.createdAt : Date.now(),
			updatedAt: Date.now(),
			dirty: true,
		};
		await offlinePutNote(note);
		await offlineEnqueueOp({ type: "update", noteId: id, text: note.text, tags: note.tags });
		return note;
	}

	// --- Sync Queue Replay: push pending ops to server ---
	let offlineSyncInFlight = false;
	async function replayOfflineOps() {
		if (offlineSyncInFlight) return;
		if (typeof navigator !== "undefined" && navigator.onLine === false) return;
		offlineSyncInFlight = true;
		try {
			const ops = await offlineGetAllOps();
			if (!ops.length) return;
			let anyFailed = false;
			for (const op of ops) {
				try {
					if (op.type === "create") {
						const res = await api("/api/notes", {
							method: "POST",
							body: JSON.stringify({ text: op.text, tags: op.tags || [] }),
						});
						const saved = res && res.note ? res.note : null;
						if (saved && saved.id) {
							// Replace temp note in IndexedDB with server note
							await offlineDeleteNote(op.tempId);
							await offlinePutNote({
								id: String(saved.id),
								text: String(saved.text || op.text),
								tags: Array.isArray(saved.tags) ? saved.tags : op.tags,
								kind: String(saved.kind || ""),
								createdAt: Number(saved.createdAt || Date.now()),
								updatedAt: Number(saved.updatedAt || Date.now()),
								dirty: false,
							});
							// Update in-memory psEditingNoteId if it matches tempId
							if (psEditingNoteId === op.tempId) {
								psEditingNoteId = String(saved.id);
								psAutoSaveLastSavedNoteId = psEditingNoteId;
							}
						}
					} else if (op.type === "update") {
						await api(`/api/notes/${encodeURIComponent(op.noteId)}`, {
							method: "PUT",
							body: JSON.stringify({ text: op.text, tags: op.tags || [] }),
						});
						// Mark clean in IndexedDB
						const allN = await offlineGetAllNotes();
						const n = allN.find((x) => x.id === op.noteId);
						if (n) { n.dirty = false; await offlinePutNote(n); }
					} else if (op.type === "delete") {
						await api(`/api/notes/${encodeURIComponent(op.noteId)}`, {
							method: "DELETE",
						});
						await offlineDeleteNote(op.noteId);
					}
				} catch (e) {
					const msg = e && e.message ? String(e.message) : "";
					const is404 = msg.includes("404") || msg.includes("not_found");
					const is409 = msg.includes("409") || msg.includes("duplicate");
					if (is404 || is409) {
						console.warn("[offline] replay op skipped (" + (is404 ? "deleted" : "duplicate") + "):", op.noteId || op.tempId);
						continue;
					}
					console.warn("[offline] replay op failed:", op, e);
					anyFailed = true;
					break; // Stop at first failure, retry later
				}
			}
			if (!anyFailed) {
				await offlineClearOps();
				toast(t("offline.synced") || "Offline changes synced.", "success");
				await refreshPersonalSpace();
				// Restore textarea + CRDT to correct server text after replay
				const editId = String(psEditingNoteId || "").trim();
				if (editId && psState && Array.isArray(psState.notes)) {
					const srvNote = psState.notes.find((n) => String(n && n.id ? n.id : "") === editId);
					if (srvNote) {
						textarea.value = String(srvNote.text || "");
						lastLocalText = textarea.value;
						psAutoSaveLastSavedText = textarea.value;
						psAutoSaveLastSavedNoteId = editId;
						if (typeof updateCrdtFromTextarea === "function") updateCrdtFromTextarea();
						if (typeof scheduleCrdtSnapshot === "function") scheduleCrdtSnapshot();
					}
				}
			}
		} finally {
			offlineSyncInFlight = false;
		}
	}

	// --- Online/Offline event listeners ---
	function isAppOffline() {
		return typeof navigator !== "undefined" && navigator.onLine === false;
	}

	window.addEventListener("online", () => {
		toast(t("offline.back_online") || "Back online — syncing…", "success");
		void replayOfflineOps();
	});

	window.addEventListener("offline", () => {
		toast(t("offline.now_offline") || "You are offline. Changes are saved locally.", "info");
	});
	// ─── End Offline Store ───────────────────────────────────────────

	async function ensureDirPermission(handle, write) {
		if (!handle || !handle.queryPermission) return false;
		const opts = { mode: write ? "readwrite" : "read" };
		try {
			const current = await handle.queryPermission(opts);
			if (current === "granted") return true;
		} catch {
			// ignore
		}
		try {
			const next = await handle.requestPermission(opts);
			return next === "granted";
		} catch {
			return false;
		}
	}

	function updateAutoBackupFolderLabel() {
		if (!psAutoBackupFolderLabel) return;
		psAutoBackupFolderLabel.textContent = psAutoBackupHandle
			? String(psAutoBackupHandle.name || "Ordner ausgewählt")
			: "Kein Ordner gewählt";
	}

	function updateAutoImportFolderLabel() {
		if (!psAutoImportFolderLabel) return;
		psAutoImportFolderLabel.textContent = psAutoImportHandle
			? String(psAutoImportHandle.name || "Ordner ausgewählt")
			: "Kein Ordner gewählt";
	}

	function applyAutoAccessSupportUi() {
		const supported = supportsDirectoryAccess();
		if (psAutoBackupUnsupported)
			psAutoBackupUnsupported.classList.toggle("hidden", supported);
		if (psAutoImportUnsupported)
			psAutoImportUnsupported.classList.toggle("hidden", supported);
		if (psAutoBackupEnabledInput) psAutoBackupEnabledInput.disabled = !supported;
		if (psAutoBackupIntervalInput) psAutoBackupIntervalInput.disabled = !supported;
		if (psAutoBackupFolderBtn) psAutoBackupFolderBtn.disabled = !supported;
		if (psAutoImportEnabledInput) psAutoImportEnabledInput.disabled = !supported;
		if (psAutoImportIntervalInput) psAutoImportIntervalInput.disabled = !supported;
		if (psAutoImportFolderBtn) psAutoImportFolderBtn.disabled = !supported;
	}

	function loadAutoBackupSettings() {
		try {
			const rawEnabled = localStorage.getItem(PS_AUTO_BACKUP_ENABLED_KEY);
			psAutoBackupEnabled = rawEnabled === "1";
		} catch {
			psAutoBackupEnabled = false;
		}
		try {
			const rawInterval = localStorage.getItem(PS_AUTO_BACKUP_INTERVAL_KEY);
			psAutoBackupInterval = normalizeAutoInterval(rawInterval, "daily");
		} catch {
			psAutoBackupInterval = "daily";
		}
		if (psAutoBackupEnabledInput)
			psAutoBackupEnabledInput.checked = psAutoBackupEnabled;
		if (psAutoBackupIntervalInput)
			psAutoBackupIntervalInput.value = String(psAutoBackupInterval || "daily");
	}

	function saveAutoBackupSettings() {
		try {
			localStorage.setItem(
				PS_AUTO_BACKUP_ENABLED_KEY,
				psAutoBackupEnabled ? "1" : "0"
			);
			localStorage.setItem(
				PS_AUTO_BACKUP_INTERVAL_KEY,
				String(psAutoBackupInterval || "daily")
			);
		} catch {
			// ignore
		}
	}

	function loadAutoImportSettings() {
		try {
			const rawEnabled = localStorage.getItem(PS_AUTO_IMPORT_ENABLED_KEY);
			psAutoImportEnabled = rawEnabled === "1";
		} catch {
			psAutoImportEnabled = false;
		}
		try {
			const rawInterval = localStorage.getItem(PS_AUTO_IMPORT_INTERVAL_KEY);
			psAutoImportInterval = normalizeAutoInterval(rawInterval, "daily");
		} catch {
			psAutoImportInterval = "daily";
		}
		if (psAutoImportEnabledInput)
			psAutoImportEnabledInput.checked = psAutoImportEnabled;
		if (psAutoImportIntervalInput)
			psAutoImportIntervalInput.value = String(psAutoImportInterval || "daily");
	}

	function saveAutoImportSettings() {
		try {
			localStorage.setItem(
				PS_AUTO_IMPORT_ENABLED_KEY,
				psAutoImportEnabled ? "1" : "0"
			);
			localStorage.setItem(
				PS_AUTO_IMPORT_INTERVAL_KEY,
				String(psAutoImportInterval || "daily")
			);
		} catch {
			// ignore
		}
	}

	function loadAutoImportSeen() {
		try {
			const raw = localStorage.getItem(PS_AUTO_IMPORT_SEEN_KEY);
			const parsed = raw ? JSON.parse(raw) : [];
			if (Array.isArray(parsed)) {
				psAutoImportSeen = new Map(parsed.map((k) => [String(k), 1]));
				return;
			}
		} catch {
			// ignore
		}
		psAutoImportSeen = new Map();
	}

	function saveAutoImportSeen() {
		try {
			const keys = Array.from(psAutoImportSeen.keys());
			const trimmed = keys.slice(-500);
			localStorage.setItem(PS_AUTO_IMPORT_SEEN_KEY, JSON.stringify(trimmed));
		} catch {
			// ignore
		}
	}

	function buildAutoImportKey(file) {
		const name = file && file.name ? String(file.name) : "";
		const size = file && typeof file.size === "number" ? file.size : 0;
		const mod =
			file && typeof file.lastModified === "number" ? file.lastModified : 0;
		return `${name}|${size}|${mod}`;
	}

	function scheduleAutoBackup() {
		if (psAutoBackupTimer) window.clearTimeout(psAutoBackupTimer);
		psAutoBackupTimer = 0;
		if (!psAutoBackupEnabled || !psAutoBackupInterval) return;
		if (!supportsDirectoryAccess()) return;
		psAutoBackupTimer = window.setTimeout(async () => {
			await runAutoBackup();
			scheduleAutoBackup();
		}, autoIntervalToMs(psAutoBackupInterval));
	}

	function scheduleAutoImport() {
		if (psAutoImportTimer) window.clearTimeout(psAutoImportTimer);
		psAutoImportTimer = 0;
		if (!psAutoImportEnabled || !psAutoImportInterval) return;
		if (!supportsDirectoryAccess()) return;
		psAutoImportTimer = window.setTimeout(async () => {
			await runAutoImport();
			scheduleAutoImport();
		}, autoIntervalToMs(psAutoImportInterval));
	}

	async function runAutoBackup() {
		if (psAutoBackupInFlight) return;
		if (!psAutoBackupEnabled) return;
		if (!psState || !psState.authed) {
			setAutoBackupStatus("Bitte anmelden, um Auto-Backup zu nutzen.");
			return;
		}
		if (!psAutoBackupHandle) {
			setAutoBackupStatus("Kein Ordner gewählt.");
			return;
		}
		psAutoBackupInFlight = true;
		try {
			setAutoBackupStatus("Backup wird erstellt…");
			const ok = await ensureDirPermission(psAutoBackupHandle, true);
			if (!ok) {
				setAutoBackupStatus("Ordnerzugriff erforderlich.");
				return;
			}
			const payload = await fetchPersonalSpaceExport();
			const text = JSON.stringify(payload, null, 2);
			const timestamp = new Date();
			const stamp = `${timestamp.getFullYear()}${String(
				timestamp.getMonth() + 1
			).padStart(2, "0")}${String(timestamp.getDate()).padStart(
				2,
				"0"
			)}-${String(timestamp.getHours()).padStart(2, "0")}${String(
				timestamp.getMinutes()
			).padStart(2, "0")}`;
			const filename = `mirror-notes-${stamp}.json`;
			const fileHandle = await psAutoBackupHandle.getFileHandle(filename, {
				create: true,
			});
			const writable = await fileHandle.createWritable();
			await writable.write(text);
			await writable.close();
			setAutoBackupStatus(`Backup gespeichert: ${filename}`);
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Fehler";
			setAutoBackupStatus(`Backup fehlgeschlagen: ${msg}`);
		} finally {
			psAutoBackupInFlight = false;
		}
	}

	async function runAutoImport() {
		if (psAutoImportInFlight) return;
		if (!psAutoImportEnabled) return;
		if (!psState || !psState.authed) {
			setAutoImportStatus("Bitte anmelden, um Auto-Import zu nutzen.");
			return;
		}
		if (!psAutoImportHandle) {
			setAutoImportStatus("Kein Ordner gewählt.");
			return;
		}
		psAutoImportInFlight = true;
		try {
			setAutoImportStatus("Suche nach neuen Dateien…");
			const ok = await ensureDirPermission(psAutoImportHandle, false);
			if (!ok) {
				setAutoImportStatus("Ordnerzugriff erforderlich.");
				return;
			}
			const entries = [];
			if (psAutoImportHandle && psAutoImportHandle.values) {
				for await (const entry of psAutoImportHandle.values()) {
					if (entry && entry.kind === "file") entries.push(entry);
				}
			}
			const candidates = entries.filter((entry) => {
				const name = String(entry && entry.name ? entry.name : "").toLowerCase();
				return (
					name.endsWith(".json") ||
					name.endsWith(".md") ||
					name.endsWith(".markdown") ||
					name.endsWith(".txt")
				);
			});
			let imported = 0;
			for (const entry of candidates) {
				if (imported >= AUTO_IMPORT_MAX_PER_RUN) break;
				const file = await entry.getFile();
				const key = buildAutoImportKey(file);
				if (psAutoImportSeen.has(key)) continue;
				const text = await file.text();
				await importPersonalSpaceNotesFromText(text, "merge");
				psAutoImportSeen.set(key, Date.now());
				imported += 1;
			}
			saveAutoImportSeen();
			setAutoImportStatus(
				imported ? `Auto-Import: ${imported} Datei(en).` : "Keine neuen Dateien."
			);
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Fehler";
			setAutoImportStatus(`Auto-Import fehlgeschlagen: ${msg}`);
		} finally {
			psAutoImportInFlight = false;
		}
	}

	async function pickAutoBackupFolder() {
		if (!supportsDirectoryAccess()) return;
		try {
			const handle = await window.showDirectoryPicker({ mode: "readwrite" });
			psAutoBackupHandle = handle;
			updateAutoBackupFolderLabel();
			await writeFsHandle(AUTO_BACKUP_HANDLE_KEY, handle);
			setAutoBackupStatus("Ordner gespeichert.");
			if (psAutoBackupEnabled) await runAutoBackup();
		} catch {
			// ignore
		}
	}

	async function pickAutoImportFolder() {
		if (!supportsDirectoryAccess()) return;
		try {
			const handle = await window.showDirectoryPicker({ mode: "read" });
			psAutoImportHandle = handle;
			updateAutoImportFolderLabel();
			await writeFsHandle(AUTO_IMPORT_HANDLE_KEY, handle);
			setAutoImportStatus("Ordner gespeichert.");
			if (psAutoImportEnabled) await runAutoImport();
		} catch {
			// ignore
		}
	}

	async function initAutoBackup() {
		applyAutoAccessSupportUi();
		loadAutoBackupSettings();
		psAutoBackupHandle = await readFsHandle(AUTO_BACKUP_HANDLE_KEY);
		updateAutoBackupFolderLabel();
		scheduleAutoBackup();
	}

	async function initAutoImport() {
		applyAutoAccessSupportUi();
		loadAutoImportSettings();
		loadAutoImportSeen();
		psAutoImportHandle = await readFsHandle(AUTO_IMPORT_HANDLE_KEY);
		updateAutoImportFolderLabel();
		scheduleAutoImport();
	}

	function saveAiPrompt(next) {
		aiPrompt = String(next || "");
		try {
			localStorage.setItem(AI_PROMPT_KEY, aiPrompt);
		} catch {
			// ignore
		}
	}

	function saveAiUseAnswer(next) {
		aiUseAnswer = true;
		try {
			localStorage.setItem(AI_USE_ANSWER_KEY, "1");
		} catch {
			// ignore
		}
	}

	function saveAiUsePreview(next) {
		aiUsePreview = Boolean(next);
		try {
			localStorage.setItem(AI_USE_PREVIEW_KEY, aiUsePreview ? "1" : "0");
		} catch {
			// ignore
		}
		syncAiChatContext();
	}

	function loadAiApiConfig() {
		try {
			aiApiKey = String(localStorage.getItem(AI_API_KEY_KEY) || "");
			aiApiModel = String(localStorage.getItem(AI_API_MODEL_KEY) || "");
		} catch {
			aiApiKey = "";
			aiApiModel = "";
		}
		if (aiApiKeyInput) aiApiKeyInput.value = aiApiKey ? "••••••••" : "";
		if (aiApiModelInput) aiApiModelInput.value = aiApiModel;
	}

	function saveAiApiConfig(nextKey, nextModel) {
		aiApiKey = String(nextKey || "").trim();
		aiApiModel = String(nextModel || "").trim();
		try {
			localStorage.setItem(AI_API_KEY_KEY, aiApiKey);
			localStorage.setItem(AI_API_MODEL_KEY, aiApiModel);
		} catch {
			// ignore
		}
		if (aiApiKeyInput) aiApiKeyInput.value = aiApiKey ? "••••••••" : "";
		if (aiApiModelInput) aiApiModelInput.value = aiApiModel;
	}

	function getAiApiConfig() {
		return {
			apiKey: String(aiApiKey || "").trim(),
			model: String(aiApiModel || "").trim(),
		};
	}

	function loadLinearApiConfig() {
		linearApiKey = "";
		if (linearApiKeyInput) {
			linearApiKeyInput.value = "";
		}
		updateLinearApiStatus();
	}

	function readLocalLinearApiKey() {
		try {
			return String(localStorage.getItem(LINEAR_API_KEY_KEY) || "").trim();
		} catch {
			return "";
		}
	}

	async function saveLinearApiKeyToServer(nextKey, opts) {
		const apiKey = String(nextKey || "").trim();
		if (!psState || !psState.authed) {
			if (!(opts && opts.silent)) {
				toast("Please enable Personal Space first (sign in).", "error");
			}
			return false;
		}
		try {
			await api("/api/linear-key", {
				method: "POST",
				body: JSON.stringify({ apiKey }),
			});
			linearApiKey = apiKey;
			if (linearApiKeyInput) {
				linearApiKeyInput.value = apiKey ? "••••••••" : "";
			}
			updateLinearApiStatus();
			if (!(opts && opts.silent)) {
				toast(
					apiKey ? t("toast.linear_saved") : t("toast.linear_cleared"),
					"success"
				);
			}
			return true;
		} catch {
			if (!(opts && opts.silent)) {
				toast(t("toast.linear_key_failed"), "error");
			}
			return false;
		}
	}

	async function syncLinearApiKeyFromServer() {
		if (!psState || !psState.authed) {
			linearApiKey = "";
			if (linearApiKeyInput) linearApiKeyInput.value = "";
			updateLinearApiStatus();
			return;
		}
		let serverKey = "";
		try {
			const res = await api("/api/linear-key");
			serverKey = String(res && res.apiKey ? res.apiKey : "").trim();
		} catch {
			updateLinearApiStatus();
			return;
		}
		if (serverKey) {
			linearApiKey = serverKey;
			if (linearApiKeyInput) linearApiKeyInput.value = "••••••••";
			updateLinearApiStatus();
			try {
				localStorage.removeItem(LINEAR_API_KEY_KEY);
			} catch {
				// ignore
			}
			return;
		}
		const legacyKey = readLocalLinearApiKey();
		if (legacyKey) {
			const saved = await saveLinearApiKeyToServer(legacyKey, { silent: true });
			if (saved) {
				try {
					localStorage.removeItem(LINEAR_API_KEY_KEY);
				} catch {
					// ignore
				}
			}
		}
		if (!legacyKey) {
			linearApiKey = "";
			if (linearApiKeyInput) linearApiKeyInput.value = "";
			updateLinearApiStatus();
		}
	}

	async function saveBflApiKeyToServer(nextKey, opts) {
		const apiKey = String(nextKey || "").trim();
		if (!psState || !psState.authed) {
			if (!(opts && opts.silent)) {
				toast("Please enable Personal Space first (sign in).", "error");
			}
			return false;
		}
		try {
			await api("/api/bfl-key", {
				method: "POST",
				body: JSON.stringify({ apiKey }),
			});
			bflApiKey = apiKey;
			if (bflApiKeyInput) {
				bflApiKeyInput.value = apiKey ? "••••••••" : "";
			}
			updateBflApiStatus();
			if (!(opts && opts.silent)) {
				toast(
					apiKey ? t("toast.bfl_saved") : t("toast.bfl_cleared"),
					"success"
				);
			}
			return true;
		} catch {
			if (!(opts && opts.silent)) {
				toast(t("toast.bfl_key_failed"), "error");
			}
			return false;
		}
	}

	async function syncBflApiKeyFromServer() {
		if (!psState || !psState.authed) {
			bflApiKey = "";
			if (bflApiKeyInput) bflApiKeyInput.value = "";
			updateBflApiStatus();
			return;
		}
		try {
			const res = await api("/api/bfl-key");
			const serverKey = String(res && res.apiKey ? res.apiKey : "").trim();
			bflApiKey = serverKey;
			if (bflApiKeyInput) bflApiKeyInput.value = serverKey ? "••••••••" : "";
			updateBflApiStatus();
		} catch {
			updateBflApiStatus();
		}
	}

	function readBflApiKeyInput() {
		if (!bflApiKeyInput) return bflApiKey;
		const raw = String(bflApiKeyInput.value || "").trim();
		if (!raw || raw === "••••••••") return bflApiKey;
		return raw;
	}

	function updateBflApiStatus() {
		if (!bflApiStatus) return;
		const keySet = Boolean(String(bflApiKey || "").trim());
		bflApiStatus.textContent = keySet
			? t("bfl.status.key_set")
			: t("bfl.status.no_key");
	}

	function readLinearApiKeyInput() {
		if (!linearApiKeyInput) return linearApiKey;
		const raw = String(linearApiKeyInput.value || "").trim();
		if (!raw || raw === "••••••••") return linearApiKey;
		return raw;
	}

	function loadLinearProjectsFromStorage() {
		try {
			const raw = String(localStorage.getItem(LINEAR_PROJECTS_KEY) || "");
			const parsed = raw ? JSON.parse(raw) : [];
			linearProjects = Array.isArray(parsed)
				? parsed
						.map((p) => ({
							id: String(p && p.id ? p.id : ""),
							name: String(p && p.name ? p.name : ""),
						}))
						.filter((p) => p.id && p.name)
				: [];
		} catch {
			linearProjects = [];
		}
		loadLinearProjectSelections();
		renderLinearProjectsList();
		updateLinearProjectSelectOptions(getLinearNoteId());
	}

	function saveLinearProjectsToStorage(nextProjects) {
		linearProjects = Array.isArray(nextProjects) ? nextProjects : [];
		try {
			localStorage.setItem(LINEAR_PROJECTS_KEY, JSON.stringify(linearProjects));
		} catch {
			// ignore
		}
		renderLinearProjectsList();
		updateLinearProjectSelectOptions(getLinearNoteId());
	}

	function loadLinearProjectSelections() {
		try {
			const raw = String(
				localStorage.getItem(LINEAR_PROJECTS_ENABLED_KEY) || ""
			);
			const parsed = raw ? JSON.parse(raw) : [];
			const ids = Array.isArray(parsed) ? parsed.map((id) => String(id || "")) : [];
			linearEnabledProjectIds = new Set(ids.filter(Boolean));
		} catch {
			linearEnabledProjectIds = new Set();
		}
	}

	function saveLinearProjectSelections() {
		try {
			const ids = Array.from(linearEnabledProjectIds || []);
			localStorage.setItem(LINEAR_PROJECTS_ENABLED_KEY, JSON.stringify(ids));
		} catch {
			// ignore
		}
		updateLinearProjectSelectOptions(getLinearNoteId());
	}

	function updateLinearApiStatus() {
		if (!linearApiStatus) return;
		const keySet = Boolean(String(linearApiKey || "").trim());
		const count = Array.isArray(linearProjects) ? linearProjects.length : 0;
		if (keySet) {
			linearApiStatus.textContent = count
				? formatUi(t("linear.status.key_set_with_projects"), { count })
				: t("linear.status.key_set");
			return;
		}
		linearApiStatus.textContent = t("linear.status.no_key");
	}

	function renderLinearProjectsList() {
		if (!linearProjectsList) return;
		const list = Array.isArray(linearProjects) ? linearProjects : [];
		if (linearProjectsEmpty) {
			linearProjectsEmpty.classList.toggle("hidden", list.length > 0);
		}
		if (!list.length) {
			linearProjectsList.innerHTML = "";
			return;
		}
		linearProjectsList.innerHTML = list
			.map((p) => {
				const id = String(p.id || "");
				const name = String(p.name || "");
				const checked = linearEnabledProjectIds.has(id) ? "checked" : "";
				return `
					<label class="flex items-center gap-2 text-xs text-slate-200" data-linear-project-id="${id}">
						<input type="checkbox" class="h-4 w-4 rounded border-white/20 bg-slate-950/40 text-fuchsia-400" ${checked} />
						<span>${name}</span>
					</label>`;
			})
			.join("");
	}

	async function linearRequest(query, variables) {
		const token = String(linearApiKey || "").trim();
		if (!token) throw new Error("missing_key");
		const authHeader = token.startsWith("Bearer ")
			? token
			: token.startsWith("lin_api_")
				? token
				: `Bearer ${token}`;
		const res = await fetch("/api/linear", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: authHeader,
			},
			body: JSON.stringify({ query, variables: variables || {} }),
		});
		if (!res.ok) throw new Error("linear_http");
		const payload = await res.json();
		if (payload && Array.isArray(payload.errors) && payload.errors.length) {
			throw new Error("linear_api");
		}
		return payload ? payload.data : null;
	}

	async function fetchLinearProjectsFromApi() {
		const inputKey = readLinearApiKeyInput();
		if (inputKey && inputKey !== linearApiKey) {
			linearApiKey = inputKey;
		}
		if (!linearApiKey) {
			toast(t("toast.linear_missing_key"), "error");
			return;
		}
		if (linearApiStatus) linearApiStatus.textContent = t("linear.status.loading");
		try {
			const data = await linearRequest(
				"query { projects { nodes { id name } } }"
			);
			const nodes =
				data && data.projects && Array.isArray(data.projects.nodes)
					? data.projects.nodes
					: [];
			const cleaned = nodes
				.map((p) => ({
					id: String(p && p.id ? p.id : ""),
					name: String(p && p.name ? p.name : ""),
				}))
				.filter((p) => p.id && p.name);
			saveLinearProjectsToStorage(cleaned);
			updateLinearApiStatus();
			toast(t("toast.linear_projects_loaded"), "success");
		} catch {
			if (linearApiStatus) {
				linearApiStatus.textContent = t("linear.status.failed");
			}
			toast(t("toast.linear_projects_failed"), "error");
		}
	}

	async function fetchLinearTasksForProject(noteId, projectId) {
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		if (!activeId || !projectId) return;
		const inputKey = readLinearApiKeyInput();
		if (inputKey && inputKey !== linearApiKey) {
			linearApiKey = inputKey;
		}
		if (!linearApiKey) {
			toast(t("toast.linear_missing_key"), "error");
			return;
		}
		if (linearStatus) linearStatus.textContent = t("linear.status.loading");
		try {
			const data = await linearRequest(
				"query($id: String!) { project(id: $id) { id name issues(first: 50, orderBy: updatedAt) { nodes { id title identifier url dueDate state { name } assignee { name } } } } }",
				{ id: String(projectId) }
			);
			const project = data && data.project ? data.project : null;
			const projectName = String(project && project.name ? project.name : "");
			const nodes = project && project.issues && Array.isArray(project.issues.nodes)
				? project.issues.nodes
				: [];
			const tasks = nodes.map((task) => ({
				id: String(task && task.id ? task.id : ""),
				title: String(task && task.title ? task.title : ""),
				identifier: String(task && task.identifier ? task.identifier : ""),
				url: String(task && task.url ? task.url : ""),
				dueDate: String(task && task.dueDate ? task.dueDate : ""),
				state: String(task && task.state && task.state.name ? task.state.name : ""),
				assignee: String(task && task.assignee && task.assignee.name ? task.assignee.name : ""),
			}));
			const payload = {
				projectId: String(projectId || ""),
				projectName: projectName,
				updatedAt: Date.now(),
				tasks,
			};
			linearDataByNote.set(activeId, payload);
			renderLinearTasks(activeId);
			sendLinearDataForNote(activeId, payload);
			if (linearStatus) {
				linearStatus.textContent = `${projectName || "Linear"} · ${new Date(
					payload.updatedAt
				).toLocaleString()}`;
			}
		} catch {
			if (linearStatus) linearStatus.textContent = t("linear.status.failed");
			toast(t("toast.linear_tasks_failed"), "error");
		}
	}

	function loadTheme() {
		try {
			activeTheme = String(localStorage.getItem(THEME_KEY) || "fuchsia");
		} catch {
			activeTheme = "fuchsia";
		}
		applyTheme(activeTheme);
	}

	function toAlphaColor(inputColor, alphaValue) {
		if (!inputColor) return null;
		const rgbaMatch = inputColor.match(/rgba\(([^)]+)\)/i);
		if (rgbaMatch) {
			const parts = rgbaMatch[1].split(",").map((part) => part.trim());
			if (parts.length >= 3) {
				return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alphaValue})`;
			}
		}
		const rgbMatch = inputColor.match(/rgb\(([^)]+)\)/i);
		if (rgbMatch) {
			const parts = rgbMatch[1].split(",").map((part) => part.trim());
			if (parts.length >= 3) {
				return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alphaValue})`;
			}
		}
		return null;
	}

	function applyTheme(themeName) {
		const next = THEMES[themeName] ? themeName : "fuchsia";
		activeTheme = next;
		syncThemeListActive();
		const colors = THEMES[next];
		const isMonoLightTheme = next === "monoLight";
		const isMonoDarkTheme = next === "monoDark";
		const isMonoTheme = isMonoLightTheme || isMonoDarkTheme;
		const nonMonoScrollbarThumb =
			toAlphaColor(colors && colors.accentTextSoft, 0.1) ||
			toAlphaColor(colors && colors.accentText, 0.1) ||
			"rgba(103, 232, 249, 0.1)";
		if (bgBlobTop && colors) bgBlobTop.style.background = colors.top;
		if (bgBlobBottom && colors) bgBlobBottom.style.background = colors.bottom;
		if (colors) {
			const root = document.documentElement;
			root.style.setProperty(
				"--accent-bg-soft",
				colors.accentBgSoft || colors.accentBg || colors.top
			);
			root.style.setProperty("--accent-bg", colors.accentBg || colors.top);
			root.style.setProperty(
				"--accent-bg-hover",
				colors.accentBgHover || colors.accentBg || colors.top
			);
			root.style.setProperty(
				"--accent-badge-bg",
				colors.accentBadgeBg || colors.accentBg || colors.top
			);
			root.style.setProperty(
				"--accent-strong",
				colors.accentStrong || colors.accentBg || colors.top
			);
			root.style.setProperty(
				"--accent-strong-hover",
				colors.accentStrongHover || colors.accentStrong || colors.accentBg
			);
			root.style.setProperty(
				"--accent-strong-active",
				colors.accentStrongActive || colors.accentStrong || colors.accentBg
			);
			root.style.setProperty(
				"--accent-border",
				colors.accentBorder || colors.accentBg
			);
			root.style.setProperty(
				"--accent-border-strong",
				colors.accentBorderStrong || colors.accentBorder || colors.accentBg
			);
			root.style.setProperty(
				"--accent-text",
				colors.accentText || "rgba(255,255,255,0.95)"
			);
			root.style.setProperty(
				"--accent-text-soft",
				colors.accentTextSoft || colors.accentText || "rgba(255,255,255,0.8)"
			);
			root.style.setProperty(
				"--accent-ring",
				colors.accentRing || colors.accentBorder || "rgba(255,255,255,0.25)"
			);
			root.style.setProperty(
				"--accent-ring-strong",
				colors.accentRingStrong || colors.accentRing || colors.accentBorder
			);
			root.style.setProperty(
				"--blockquote-border",
				colors.blockquoteBorder ||
					colors.accentBorderStrong ||
					colors.accentBorder ||
					"rgba(217, 70, 239, 0.45)"
			);
			root.style.setProperty(
				"--blockquote-text",
				colors.blockquoteText ||
					colors.accentTextSoft ||
					"rgba(203, 213, 225, 1)"
			);
			root.style.setProperty(
				"--scrollbar-thumb",
				isMonoTheme
					? colors.scrollbarThumb ||
						colors.accentTextSoft ||
						"rgba(148, 163, 184, 0.3)"
					: nonMonoScrollbarThumb
			);
			root.style.setProperty(
				"--scrollbar-thumb-hover",
				isMonoTheme
					? colors.scrollbarThumbHover ||
						colors.accentText ||
						"rgba(148, 163, 184, 0.45)"
					: nonMonoScrollbarThumb
			);
			root.style.setProperty(
				"--scrollbar-border",
				isMonoTheme
					? colors.scrollbarBorder ||
						(isMonoLightTheme
							? "rgba(241, 245, 249, 0.9)"
							: "rgba(2, 6, 23, 0.35)")
					: "rgba(2, 6, 23, 0.1)"
			);
			root.style.setProperty(
				"--calendar-event-bg",
				colors.accentBgSoft || "rgba(15, 23, 42, 0.55)"
			);
			root.style.setProperty(
				"--calendar-tooltip-bg",
				colors.accentBg || "rgba(2, 6, 23, 0.92)"
			);
			root.style.setProperty(
				"--calendar-tooltip-border",
				colors.accentBorder || "rgba(255, 255, 255, 0.12)"
			);
			root.style.setProperty(
				"--calendar-tooltip-text",
				colors.accentText || "rgba(226, 232, 240, 0.95)"
			);
			/* solid panel bg per theme (no opacity) */
			const solidBgs = {
				fuchsia: "#0f0a1a", cyan: "#0a1018", emerald: "#0a1510", violet: "#0d0a18",
				coffeeDark: "#1c1614", coffeeLight: "#f3ebe2",
				bitterDark: "#131216", bitterLight: "#efecea",
				monoDark: "#161b22", monoLight: "#eef1f5"
			};
			root.style.setProperty("--panel-solid-bg", solidBgs[next] || "#0f0a1a");
			/* modal theming – backdrop & border per theme */
			const modalBackdrops = {
				fuchsia: "rgba(15,10,26,0.6)", cyan: "rgba(10,16,24,0.6)",
				emerald: "rgba(10,21,16,0.6)", violet: "rgba(13,10,24,0.6)",
				coffeeDark: "rgba(16,12,10,0.6)", coffeeLight: "rgba(68,45,30,0.2)",
				bitterDark: "rgba(13,12,16,0.6)", bitterLight: "rgba(21,21,24,0.2)",
				monoDark: "rgba(22,27,34,0.6)", monoLight: "rgba(27,31,36,0.22)"
			};
			const modalBorders = {
				fuchsia: "rgba(255,255,255,0.1)", cyan: "rgba(255,255,255,0.1)",
				emerald: "rgba(255,255,255,0.1)", violet: "rgba(255,255,255,0.1)",
				coffeeDark: "#35261e", coffeeLight: "#d9c7bc",
				bitterDark: "#2a2a30", bitterLight: "#d8d2cb",
				monoDark: "rgba(48,54,61,0.9)", monoLight: "#d0d7de"
			};
			root.style.setProperty("--modal-backdrop", modalBackdrops[next] || "rgba(2,6,23,0.7)");
			root.style.setProperty("--modal-border", modalBorders[next] || "rgba(255,255,255,0.1)");
		}
		try {
			document.body.setAttribute("data-theme", next);
		} catch {
			// ignore
		}
		applyGlowEnabled();
		if (previewOpen) updatePreview();
	}

	function saveTheme(next) {
		const safe = THEMES[next] ? next : "fuchsia";
		try {
			localStorage.setItem(THEME_KEY, safe);
		} catch {
			// ignore
		}
		applyTheme(safe);
	}

	function setSettingsOpen(open) {
		settingsOpen = Boolean(open);
		if (!settingsRoot || !settingsRoot.classList) return;
		settingsRoot.classList.toggle("hidden", !settingsOpen);
		settingsRoot.classList.toggle("flex", settingsOpen);
		settingsRoot.setAttribute("aria-hidden", settingsOpen ? "false" : "true");
		if (settingsOpen) {
			setActiveSettingsSection(settingsSection || "user");
			loadAiStatus();
			renderFaq();
			renderFavoritesManager();
			renderSharedRoomsManager();
		}
	}

	function openSettingsAt(section) {
		setSettingsOpen(true);
		setActiveSettingsSection(section || "user");
	}

	function setActiveSettingsSection(next) {
		const target = String(next || "user");
		settingsSection = target;
		settingsSections.forEach((section) => {
			const name = String(section.getAttribute("data-settings-section") || "");
			section.classList.toggle("hidden", name !== target);
		});
		settingsNavButtons.forEach((btn) => {
			const name = String(btn.getAttribute("data-settings-nav") || "");
			const active = name === target;
			btn.classList.toggle("bg-white/10", active);
			btn.classList.toggle("text-slate-100", active);
			btn.classList.toggle("text-slate-200", !active);
		});
		if (target === "uploads") {
			loadUploadsManage();
		}
		if (target === "trash") {
			loadTrashManage();
		}
		if (target === "calendar") {
			renderCalendarSettings();
			fetchGoogleCalendarStatus();
			fetchOutlookCalendarStatus();
		}
		if (target === "integrations") {
			updateLinearApiStatus();
			renderLinearProjectsList();
			updateLinearProjectSelectOptions(getLinearNoteId());
		}
		if (target === "shared") {
			renderSharedRoomsManager();
		}
	}

	async function loadAiStatus() {
		if (!aiApiStatus) return;
		const localKey = String(aiApiKey || "").trim();
		try {
			const res = await api("/api/ai/status");
			const configured = Boolean(res && res.configured);
			const serverModel = res && res.model ? String(res.model) : "";
			const latestModel = res && res.latestModel ? String(res.latestModel) : "";
			const fetchedAt = res && res.modelFetchedAt ? new Date(res.modelFetchedAt).toLocaleString() : "";
			const localModel = String(aiApiModel || "").trim();
			const effectiveModel = localModel || serverModel;
			let parts = [];
			if (localKey) {
				parts.push(t("settings.ai.status_local_key"));
			} else if (configured) {
				parts.push(t("settings.ai.status_server_key"));
			} else {
				aiApiStatus.textContent = t("settings.ai.status_not_configured");
				return;
			}
			if (effectiveModel) {
				parts.push(`${t("settings.ai.status_model")}: ${effectiveModel}`);
			}
			if (latestModel && latestModel !== effectiveModel) {
				parts.push(`${t("settings.ai.status_latest")}: ${latestModel}`);
			}
			if (fetchedAt) {
				parts.push(`${t("settings.ai.status_checked")}: ${fetchedAt}`);
			}
			aiApiStatus.textContent = parts.join(" · ");
			// Update datalist with top models from server
			const topModels = Array.isArray(res && res.topModels) ? res.topModels : [];
			const datalist = document.getElementById("aiApiModelList");
			if (datalist && topModels.length) {
				datalist.innerHTML = "";
				for (const m of topModels) {
					const opt = document.createElement("option");
					opt.value = m;
					datalist.appendChild(opt);
				}
			}
		} catch {
			aiApiStatus.textContent = t("settings.ai.status_unavailable");
		}
	}

	function updateAiStatusWithModel(model) {
		if (!aiApiStatus || !model) return;
		const current = aiApiStatus.textContent || "";
		const modelPrefix = t("settings.ai.status_model") + ": ";
		const lastUsedPrefix = t("settings.ai.status_last_used") + ": ";
		let base = current;
		const lastUsedIdx = base.indexOf(" · " + lastUsedPrefix);
		if (lastUsedIdx >= 0) base = base.slice(0, lastUsedIdx);
		aiApiStatus.textContent = base + " · " + lastUsedPrefix + model;
	}

	const FAQ_ITEMS = {
		de: [
			{
				q: "Was ist Mirror?",
				a: "Mirror ist ein kollaborativer Echtzeit-Editor mit Personal Space, Vorschau und KI. Nutze ihn, um Räume zu teilen, Notizen zu erstellen und Wissen an einem Ort zu bündeln.",
			},
			{
				q: "Wie aktiviere ich Personal Space?",
				a: "Klicke links auf „Personal Space hinzufügen“. Du erhältst einen Bestätigungslink per E‑Mail. Nach der Anmeldung werden Notizen, Tags und Favoriten mit deinem Account synchronisiert.",
			},
			{
				q: "An- und Abmelden",
				a: "Melde dich über Personal Space an. Zum Abmelden: Einstellungen → Benutzer‑Einstellungen → Abmelden. Die Session wird gelöscht, deine Notizen bleiben sicher im Account.",
			},
			{
				q: "Autosave",
				a: "Personal‑Space‑Notizen werden automatisch gespeichert. Der Status erscheint unter dem Editor (z. B. Speichern… / Gespeichert). Autosave läuft nur bei Anmeldung.",
			},
			{
				q: "Manuell speichern",
				a: "Mit dem Speichern‑Button im Editor kannst du sofort sichern – nützlich vor Raumwechseln oder dem Schließen des Tabs.",
			},
			{
				q: "Notizen exportieren",
				a: "Einstellungen → Export/Import → Export lädt ein JSON‑Backup. Es enthält Notizen, Tags und Metadaten.",
			},
			{
				q: "Notizen importieren",
				a: "Einstellungen → Export/Import erlaubt Merge oder Replace. Merge ergänzt/aktualisiert, Replace ersetzt den Bestand komplett.",
			},
			{
				q: "Themes",
				a: "Einstellungen → Themes steuert den Hintergrund‑Glow. Deine Auswahl wird lokal gespeichert und gilt nur auf diesem Gerät.",
			},
			{
				q: "KI nutzen",
				a: "Im KI‑Panel kannst du erklären, verbessern, fixen, ausführen oder zusammenfassen. Für KI‑Anfragen ist ein API‑Key nötig (lokal oder serverseitig).",
			},
			{
				q: "KI‑Keys und Modelle",
				a: "Einstellungen → KI: eigener Key, optionales Modell überschreibt den Server‑Default nur für dich.",
			},
			{
				q: "Google‑Kalender Einrichtung",
				a: "Setze GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET und GOOGLE_OAUTH_REDIRECT_URL. Der Redirect zeigt auf /api/calendar/google/callback. Vor dem Verbinden im Personal Space anmelden.",
			},
			{
				q: "Google‑Kalender Berechtigungen",
				a: "Nach dem Verbinden schreibt Mirror Termine in deinen primären Google‑Kalender. Trennen ist jederzeit möglich.",
			},
			{
				q: "Slash‑Kommandos",
				a: "Tippe / im Editor (z. B. /table, /code, /link). /table 3x4 erstellt schnell ein Grid, /table row+ fügt Zeilen hinzu.",
			},
			{
				q: "Tabellen",
				a: "Mit /table 2x2 fügst du Tabellen ein. Das Tabellen‑Menü erlaubt Zeilen/Spalten und Berechnungen (Sum/Avg/Max/Min).",
			},
			{
				q: "Räume wechseln",
				a: "Ändere den Raumnamen oder nutze das Dropdown. Der URL‑Hash aktualisiert sich für Sharing inkl. optionalem Key.",
			},
			{
				q: "Favoriten",
				a: "Markiere Räume mit dem Stern. Über das Favoriten‑Dropdown springst du schnell zurück.",
			},
			{
				q: "Tabs / Multiuser",
				a: "Room‑Tabs erleichtern das Wechseln. Präsenz‑Liste und Tipp‑Indikator zeigen Aktivität im Raum.",
			},
			{
				q: "Multiuser‑Anzeige & Passwort‑Maske",
				a: "Die Präsenzliste zeigt, wer online ist. Im Kontextmenü kannst du Passwort‑ähnliche Tokens verstecken oder Maskierung ein/aus schalten.",
			},
			{
				q: "Vorschau",
				a: "Die Vorschau rendert Markdown inkl. Tasks, Tabellen und Code‑Highlighting.",
			},
			{
				q: "Run‑Output",
				a: "Der Run‑Output zeigt KI‑Ergebnisse oder simulierte Ausgaben. Du kannst löschen oder KI‑Output in den Editor übernehmen.",
			},
			{
				q: "Tags",
				a: "Mit Tags filterst du Personal‑Space‑Notizen. AND/OR umschalten und mehrere Tags kombinieren.",
			},
			{
				q: "Pinned Notizen",
				a: "Pinne Notizen, um sie oben zu halten. Der Pin‑Filter zeigt nur angepinnte.",
			},
			{
				q: "Raum teilen",
				a: "Mit „Link kopieren“ teilst du Raum + optionalen Key. Ist ein Key gesetzt, braucht man ihn für Zugriff.",
			},
			{
				q: "Ende‑zu‑Ende‑Verschlüsselung (E2EE)",
				a: "Erstellst du einen Raum mit Key (z. B. #mein-raum:geheim), wird der gesamte Inhalt clientseitig mit AES-GCM verschlüsselt. Nur Teilnehmer mit dem richtigen Key können den Text lesen. Der Server sieht ausschließlich verschlüsselte Daten.",
			},
			{
				q: "Offline‑Modus (PWA)",
				a: "Mirror funktioniert als installierbare Progressive Web App. Ohne Internetverbindung kannst du Notizen aus dem lokalen IndexedDB‑Cache lesen und bearbeiten. Änderungen werden in einer Sync‑Warteschlange gespeichert und automatisch an den Server gesendet, sobald du wieder online bist.",
			},
			{
				q: "Geräteübergreifende Synchronisation",
				a: "Personal‑Space‑Notizen synchronisieren sich automatisch über alle Geräte. Ein Refresh wird beim Tab‑Wechsel oder Fokussieren des Fensters ausgelöst. Zusätzlich prüft ein 60‑Sekunden‑Polling im Hintergrund auf Änderungen. IndexedDB wird bei jedem Refresh vollständig durch den Serverzustand ersetzt (Full Sync).",
			},
			{
				q: "Duplikat‑Schutz",
				a: "Mehrere Mechanismen verhindern doppelte Notizen: ein Client‑Mutex blockiert paralleles Speichern, der Server prüft Content- und Titel‑Hashes als Unique Constraints, und der Client erkennt identische Notizen per Volltext- und Header‑Vergleich vor dem Erstellen.",
			},
			{
				q: "Permanent‑Link",
				a: "Mit dem Permanent‑Link‑Button im Editor bindest du eine Notiz dauerhaft an einen Raum‑Tab. Der verknüpfte Inhalt wird beim Tab‑Wechsel automatisch wiederhergestellt. Gäste im Raum sehen denselben Inhalt und können via CRDT‑Sync mitbearbeiten.",
			},
			{
				q: "Geteilte Räume verwalten",
				a: "Einstellungen → Geteilte Räume zeigt alle mit dir geteilten Räume. Du kannst einzelne Räume öffnen, entfernen oder alle auf einmal löschen. Geteilte Räume werden automatisch als Favoriten gespeichert.",
			},
			{
				q: "Kommentare & Textmarkierungen",
				a: "Markiere Text im Editor und klicke auf das Kommentar‑Icon, um eine farbige Textmarkierung mit Kommentar zu hinterlassen. In geteilten Räumen sind Kommentare für alle Teilnehmer sichtbar und werden via WebSocket synchronisiert.",
			},
			{
				q: "Wiki‑Links",
				a: "Tippe [[ im Editor, um einen Wiki‑Link zu einer anderen Personal‑Space‑Notiz einzufügen. Autovervollständigung zeigt passende Notizen nach Titel. In der Vorschau sind Wiki‑Links klickbar und öffnen die referenzierte Notiz direkt.",
			},
			{
				q: "Query‑Engine (erweiterte Suche)",
				a: "Das PS‑Suchfeld unterstützt strukturierte Abfragen: tag:projektX, task:open, task:done, has:task, kind:note, created:>2026-01, updated:<2026-02, pinned:yes. Task‑Abfragen zeigen ein aggregiertes Ergebnis‑Panel mit offenen/erledigten Aufgaben aus allen passenden Notizen.",
			},
			{
				q: "Excalidraw (Zeichnen)",
				a: "Excalidraw ist ein eingebettetes Whiteboard‑Zeichentool. In geteilten Räumen werden Zeichnungen via WebSocket synchronisiert – alle Teilnehmer sehen Änderungen in Echtzeit. Die Sichtbarkeit wird pro Notiz/Raum gespeichert.",
			},
			{
				q: "Ethercalc (Tabellenkalkulation)",
				a: "Ethercalc stellt eine eingebettete Tabellenkalkulation im Editor bereit. Sheet‑URLs werden pro Raum generiert. Du kannst das Excel‑Panel ein-/ausblenden und per Drag verschieben.",
			},
			{
				q: "Linear‑Integration",
				a: "Verbinde dein Linear‑Konto unter Einstellungen → Integrationen. Wähle ein Projekt und die Aufgaben erscheinen im Linear‑Panel neben dem Editor. In geteilten Räumen können Gäste Aufgaben ebenfalls via WebSocket sehen. Der API‑Key wird serverseitig verschlüsselt gespeichert (AES‑256‑GCM).",
			},
			{
				q: "KI‑Bildgenerierung (FLUX.2)",
				a: "Im KI‑Panel den Modus „🎨 Bild generieren“ wählen und einen Prompt eingeben. Das generierte Bild erscheint im Ausgabebereich mit Optionen zum Herunterladen, Speichern in Uploads oder direkten Einfügen als Markdown‑Bild.",
			},
			{
				q: "BFL API‑Key (Bildgenerierung)",
				a: "Unter Einstellungen → Integrationen kannst du deinen eigenen BFL‑API‑Key (Black Forest Labs) hinterlegen. Der Key wird verschlüsselt auf dem Server gespeichert. Ohne eigenen Key wird der Server‑Standard verwendet (falls konfiguriert).",
			},
			{
				q: "Outlook‑Kalender",
				a: "Verbinde dein Microsoft‑Konto über Einstellungen → Kalender → Outlook. Nach der OAuth‑Anmeldung erscheinen Outlook‑Ereignisse im Kalender‑Panel. Du kannst Termine sowohl in Google- als auch Outlook‑Kalender speichern.",
			},
			{
				q: "Auto‑Backup & Auto‑Import",
				a: "Einstellungen → Export/Import → Auto‑Backup: Wähle einen lokalen Ordner und Mirror erstellt regelmäßig ein JSON‑Backup deiner Notizen. Auto‑Import überwacht einen Ordner auf neue Markdown‑Dateien und importiert sie automatisch.",
			},
			{
				q: "Markdown‑Tasks mit Zeitstempel",
				a: "Markdown‑Checkboxen (- [ ] / - [x]) können direkt in der Vorschau abgehakt werden. Beim Abhaken wird ein Erledigungs‑Zeitstempel gespeichert und dezent unter der erledigten Aufgabe angezeigt.",
			},
			{
				q: "Passwort‑Maskierung",
				a: "Passwortähnliche Tokens werden im Editor automatisch maskiert. Mit dem PW‑Button im Auswahl‑Menü kannst du die Maskierung umschalten. In der Vorschau bleiben Passwörter verborgen, können aber per Klick aufgedeckt und als Klartext kopiert werden.",
			},
			{
				q: "Gemeinsame freie Zeiten finden",
				a: "Im Kalender‑Panel klickst du die Tage an, an denen du verfügbar bist (Opt‑in). In geteilten Räumen wird die Verfügbarkeit aller Teilnehmer per WebSocket ausgetauscht. Das Panel „Gemeinsame freie Zeiten“ zeigt die Schnittmenge – Zeitfenster, in denen alle frei sind. Wechsel in die Tagesansicht, um einzelne Zeitslots auszuwählen.",
			},
			{
				q: "Diktat (Spracheingabe)",
				a: "Klicke auf das Mikrofon‑Icon im KI‑Panel, um Text per Spracheingabe zu diktieren. Die Erkennung nutzt die Web Speech API deines Browsers. Die Sprache folgt deiner UI‑Spracheinstellung.",
			},
			{
				q: "Mobil‑Unterstützung",
				a: "Mirror passt sich an mobile Viewports an. Auf Mobilgeräten wechselt die Ansicht automatisch zwischen Editor und Vorschau. Eine optionale Auto‑Notiz‑Funktion erstellt beim App‑Öffnen nach einer konfigurierbaren Inaktivitätszeit eine neue Notiz.",
			},

		],
		en: [
			{
				q: "What is Mirror?",
				a: "Mirror is a real-time collaborative editor with Personal Space notes, previews, and AI assistance. Use it to share rooms, take notes, and manage your personal knowledge in one place.",
			},
			{
				q: "How do I activate Personal Space?",
				a: 'Click "Add Personal Space" in the left panel. You will receive a verification link by email; open it to sign in. Once signed in, your notes, tags, and favorites will sync to your account.',
			},
			{
				q: "Signing in and out",
				a: "Sign in via Personal Space. To sign out, open Settings → User Settings and click Sign out. This clears the session but keeps your notes safe in your account.",
			},
			{
				q: "Autosave",
				a: "Personal Space notes autosave while you edit. The status appears below the editor (e.g., Saving… / Saved). Autosave only runs when you are signed in and editing a Personal Space note.",
			},
			{
				q: "Manual save",
				a: "Use the Save button in the editor toolbar to save immediately. This is helpful before closing the tab or switching rooms.",
			},
			{
				q: "Export notes",
				a: "Open Settings → Export/Import and click Export to download a JSON backup. The file contains your notes, tags, and metadata for restoring later.",
			},
			{
				q: "Import notes",
				a: "Settings → Export/Import lets you choose Merge or Replace, then select a JSON/Markdown file. Merge adds or updates notes; Replace wipes existing notes before importing.",
			},
			{
				q: "Themes",
				a: "Settings → Themes changes the background glow. You can also toggle the glow on/off. Your choice is stored locally in your browser, so it does not affect other devices.",
			},
			{
				q: "AI usage",
				a: "Use the AI panel to explain, improve, fix, run, or summarize. The prompt box lets you provide extra instructions. AI requests require an API key (local or server).",
			},
			{
				q: "AI keys and models",
				a: "Set your key in Settings → AI. An optional model name overrides the server default for your requests only.",
			},
			{
				q: "Google Calendar setup",
				a: "Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and GOOGLE_OAUTH_REDIRECT_URL. The redirect URL must point to /api/calendar/google/callback. Sign in to Personal Space before connecting Google Calendar.",
			},
			{
				q: "Google Calendar permissions",
				a: "Mirror writes events to your Google primary calendar after you connect via Settings → Calendar → Google connect. You can disconnect any time in the same section.",
			},
			{
				q: "Slash commands",
				a: "Type / in the editor to open commands (e.g., /table, /code, /link). Use /table 3x4 for quick grids or /table row+ to add rows.",
			},
			{
				q: "Tables",
				a: "Use /table 2x2 to insert a table. The table menu lets you add/remove rows/columns and insert calculations like sum/avg/max/min for the selected column or row.",
			},
			{
				q: "Room switching",
				a: "Change the room name or use the dropdown to switch. The URL hash updates for sharing and keeps optional keys intact.",
			},
			{
				q: "Favorites",
				a: "Star a room to add it to Favorites. Use the Favorites dropdown to jump back to a saved room quickly.",
			},
			{
				q: "Tabs / Multiuser",
				a: "Room tabs help you jump between rooms quickly. The multiuser presence list and typing indicator keep you aware of activity in shared rooms.",
			},
			{
				q: "Multiuser display & password",
				a: "The presence list shows who is online. Use the PW button in the selection menu to hide password-like tokens. In the preview, passwords are masked but can be selected and copied as plain text.",
			},
			{
				q: "Preview",
				a: "Toggle the preview panel to render Markdown and code highlights. Task lists, tables, and code blocks render in the preview.",
			},
			{
				q: "Run output",
				a: "The Run output area shows AI results or simulated execution output. You can clear output or apply AI output back into the editor.",
			},
			{
				q: "Tags",
				a: "Use tags to filter Personal Space notes. Switch AND/OR filtering in the Tags panel and combine multiple tags for precise filtering.",
			},
			{
				q: "Pinned notes",
				a: "Pin notes to keep them on top. Use the pin toggle to filter pinned-only and focus on important notes.",
			},
			{
				q: "Sharing a room",
				a: "Use Copy link to share the room + optional key with collaborators. If a room key is set, only people with the key can access the room.",
			},
			{
				q: "End-to-end encryption (E2EE)",
				a: "When you create a room with a key (e.g. #my-room:secretkey), all content is encrypted client-side using AES-GCM. Only participants with the correct key can read the text. The server only sees encrypted data.",
			},
			{
				q: "Offline mode (PWA)",
				a: "Mirror works as an installable Progressive Web App. Without an internet connection, you can read and edit notes from the local IndexedDB cache. Changes are stored in a sync queue and automatically sent to the server once you\u2019re back online.",
			},
			{
				q: "Cross-device sync",
				a: "Personal Space notes sync automatically across devices. A refresh is triggered when you switch back to the tab or focus the window. Additionally, a 60-second polling interval checks for changes in the background. IndexedDB is fully replaced by the server state on each refresh (full sync).",
			},
			{
				q: "Duplicate note protection",
				a: "Multiple mechanisms prevent duplicate notes: a client mutex blocks parallel saves, the server checks content hashes and title hashes as unique constraints, and the client detects identical notes via full-text and header comparison before creating a new one.",
			},
			{
				q: "Permanent link",
				a: "Use the permanent link button in the editor to bind a note permanently to a room tab. The linked content is automatically restored when switching tabs. Guests in the room see the same content and can co-edit via CRDT sync.",
			},
			{
				q: "Managing shared rooms",
				a: "Settings \u2192 Shared Rooms shows all rooms shared with you. You can open, remove individual rooms, or clear all at once. Shared rooms are automatically saved as favorites.",
			},
			{
				q: "Comments & text highlights",
				a: "Select text in the editor and click the comment icon to leave a text highlight with a comment. Highlights are color-coded per user. In shared rooms, comments are visible to all participants and synced via WebSocket.",
			},
			{
				q: "Wiki links",
				a: "Type [[ in the editor to insert a wiki link to another Personal Space note. Autocomplete shows matching notes by title. In the preview, wiki links are clickable and open the referenced note directly.",
			},
			{
				q: "Query engine (advanced search)",
				a: "The PS search field supports structured queries: tag:projectX, task:open, task:done, has:task, kind:note, created:>2026-01, updated:<2026-02, pinned:yes. Task queries show an aggregated result panel with open/completed tasks from all matching notes.",
			},
			{
				q: "Excalidraw (drawing)",
				a: "Excalidraw is an embedded whiteboard drawing tool. In shared rooms, drawings are synced via WebSocket \u2013 all participants see changes in real time. Visibility is stored per note/room.",
			},
			{
				q: "Ethercalc (spreadsheet)",
				a: "Ethercalc provides an embedded spreadsheet in the editor. Sheet URLs are generated per room. You can toggle the Excel panel on/off and reposition it by dragging.",
			},
			{
				q: "Linear integration",
				a: "Connect your Linear account in Settings \u2192 Integrations. Select a project and tasks appear in the Linear panel next to the editor. In shared rooms, guests can also see tasks via WebSocket. The API key is stored encrypted server-side (AES-256-GCM).",
			},
			{
				q: "AI image generation (FLUX.2)",
				a: "In the AI panel, select \u201c\ud83c\udfa8 Generate image\u201d mode and enter a prompt. The generated image appears in the output area with options to download, save to uploads, or insert directly into the editor as a Markdown image.",
			},
			{
				q: "BFL API key (image generation)",
				a: "In Settings \u2192 Integrations you can store your own BFL (Black Forest Labs) API key. The key is stored encrypted on the server. Without your own key, the server default is used (if configured).",
			},
			{
				q: "Outlook calendar",
				a: "Connect your Microsoft account via Settings \u2192 Calendar \u2192 Outlook. After OAuth sign-in, Outlook events appear in the calendar panel. You can save events to both Google and Outlook calendars.",
			},
			{
				q: "Auto-backup & auto-import",
				a: "Settings \u2192 Export/Import \u2192 Auto-Backup: choose a local folder and Mirror will regularly save a JSON backup of your notes. Auto-Import watches a folder for new Markdown files and imports them automatically.",
			},
			{
				q: "Markdown tasks with timestamp",
				a: "Markdown checkboxes (- [ ] / - [x]) can be checked directly in the preview. When checked, a completion timestamp is saved and displayed subtly below the completed task.",
			},
			{
				q: "Password masking",
				a: "Password-like tokens are automatically masked in the editor. Use the PW button in the selection menu to toggle masking. In the preview, passwords remain hidden but can be revealed and copied with a click.",
			},
			{
				q: "Find common free times",
				a: "In the calendar panel, click days you\u2019re available on (opt-in). In shared rooms, availability from all participants is exchanged via WebSocket. The \u201cCommon free slots\u201d panel shows the intersection \u2013 time windows when everyone is free. Switch to day view to select individual time slots.",
			},
			{
				q: "Dictation (voice input)",
				a: "Click the microphone icon in the AI panel to dictate text via voice input. Recognition uses your browser\u2019s Web Speech API. The language follows your UI language setting.",
			},
			{
				q: "Mobile support",
				a: "Mirror adapts to mobile viewports. On mobile devices, the view automatically switches between editor and preview. An optional auto-note feature creates a new note on app open after a configurable inactivity period.",
			},

		],
	};

	function renderFaq() {
		if (!faqList) return;
		const query = String(
			faqSearchInput && faqSearchInput.value ? faqSearchInput.value : ""
		)
			.trim()
			.toLowerCase();
		const list =
			FAQ_ITEMS[uiLang] || FAQ_ITEMS[UI_LANG_DEFAULT] || [];
		const items = list.filter((item) => {
			const text = `${item.q} ${item.a}`.toLowerCase();
			return !query || text.includes(query);
		});
		faqList.innerHTML = items
			.map((item, idx) => {
				const safeIdx = Number.isFinite(idx) ? idx : 0;
				return `
					<details class="group rounded-xl border border-white/10 bg-white/5 p-3">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-slate-100">
							<span>${item.q}</span>
							<span class="text-xs text-slate-400 transition group-open:rotate-180">▾</span>
						</summary>
						<p class="mt-2 text-xs text-slate-300">${item.a}</p>
					</details>`;
			})
			.join("");
		if (!items.length) {
			faqList.innerHTML =
				`<div class="rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-400">${t(
					"faq.no_results"
				)}</div>`;
		}
	}

	function readAiApiKeyInput() {
		if (!aiApiKeyInput) return aiApiKey;
		const raw = String(aiApiKeyInput.value || "").trim();
		if (!raw || raw === "••••••••") return aiApiKey;
		return raw;
	}

	function normalizeAiModelInput(raw) {
		const v = String(raw || "")
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9._:-]/gi, "")
			.slice(0, 64);
		return v;
	}

	function applyAiContextMode() {
		const usePreview = getAiUsePreview();
		if (!usePreview && aiModeSelect) {
			try {
				aiModeSelect.value = "";
			} catch {
				// ignore
			}
		}
	}

	function getSpeechRecognitionConstructor() {
		return (
			window.SpeechRecognition ||
			window.webkitSpeechRecognition ||
			null
		);
	}

	function setAiDictationUi(active, supported) {
		if (!aiDictateBtn || !aiDictateBtn.classList) return;
		const isSupported =
			typeof supported === "boolean" ? supported : aiDictationAvailable;
		aiDictateBtn.disabled = false;
		aiDictateBtn.classList.toggle("opacity-50", !isSupported);
		aiDictateBtn.classList.toggle("cursor-not-allowed", !isSupported);
		aiDictateBtn.classList.toggle("bg-fuchsia-500/20", active);
		aiDictateBtn.classList.toggle("border-fuchsia-400/40", active);
		aiDictateBtn.classList.toggle("text-fuchsia-100", active);
		aiDictateBtn.classList.toggle("bg-transparent", !active);
		aiDictateBtn.classList.toggle("border-transparent", !active);
		aiDictateBtn.classList.toggle("text-slate-300", !active);
		try {
			aiDictateBtn.setAttribute("aria-pressed", active ? "true" : "false");
			aiDictateBtn.setAttribute("aria-disabled", isSupported ? "false" : "true");
			aiDictateBtn.setAttribute(
				"title",
				!isSupported
					? "Diktat nicht unterstützt"
					: active
						? "Diktat stoppen"
						: "Diktat starten"
			);
		} catch {
			// ignore
		}
	}

	function updateAiDictationValue() {
		if (!aiPromptInput) return;
		const base = String(aiDictationBaseText || "");
		const interim = String(aiDictationInterimText || "");
		const finalText = String(aiDictationFinalText || "");
		const combined = `${finalText} ${interim}`.trim();
		if (!combined) {
			aiPromptInput.value = base;
			return;
		}
		const sep = base && !base.endsWith(" ") ? " " : "";
		aiPromptInput.value = base + sep + combined;
	}

	function getDictationMicErrorMessage(kind) {
		const code = String(kind || "").toLowerCase();
		if (uiLang === "en") {
			if (code === "permission")
				return "Microphone access is blocked. Allow it in browser settings.";
			if (code === "not_found") return "No microphone found.";
			if (code === "busy")
				return "Microphone is busy. Close other apps using it.";
			return "Microphone not available. Check permissions or device.";
		}
		if (code === "permission")
			return "Mikrofonzugriff blockiert. Bitte im Browser erlauben.";
		if (code === "not_found") return "Kein Mikrofon gefunden.";
		if (code === "busy")
			return "Mikrofon belegt. Andere Apps schließen.";
		return "Mikrofon nicht verfügbar. Berechtigung oder Gerät prüfen.";
	}

	function toastDictationError(message) {
		const now = Date.now();
		if (now - aiDictationLastErrorAt < 800) return;
		aiDictationLastErrorAt = now;
		toast(message, "error");
	}

	function getSpeechEngineErrorMessage() {
		return uiLang === "en"
			? "Microphone works, but speech recognition failed. Restart the browser or disable extensions."
			: "Mikrofon funktioniert, aber die Spracherkennung ist fehlgeschlagen. Browser neu starten oder Erweiterungen prüfen.";
	}

	async function resolveAudioCaptureMessage() {
		if (
			!navigator ||
			!navigator.mediaDevices ||
			!navigator.mediaDevices.getUserMedia
		)
			return getDictationMicErrorMessage("unknown");
		if (navigator.permissions && navigator.permissions.query) {
			try {
				const status = await navigator.permissions.query({ name: "microphone" });
				if (status && status.state === "denied") {
					return getDictationMicErrorMessage("permission");
				}
			} catch {
				// ignore
			}
		}
		try {
			if (navigator.mediaDevices.enumerateDevices) {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const hasInput = (devices || []).some(
					(d) => d && d.kind === "audioinput"
				);
				if (!hasInput) return getDictationMicErrorMessage("not_found");
			}
		} catch {
			// ignore
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			try {
				stream.getTracks().forEach((track) => track.stop());
			} catch {
				// ignore
			}
			return getSpeechEngineErrorMessage();
		} catch (err) {
			const name = err && err.name ? String(err.name) : "";
			let kind = "unknown";
			if (name === "NotAllowedError" || name === "SecurityError") {
				kind = "permission";
			} else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
				kind = "not_found";
			} else if (name === "NotReadableError" || name === "AbortError") {
				kind = "busy";
			}
			return getDictationMicErrorMessage(kind);
		}
	}

	function handleAudioCaptureError() {
		collectDictationDebugSnapshot({ code: "audio-capture" })
			.then((snapshot) => logDictationDebugSnapshot("audio-capture", snapshot))
			.catch(() => {
				// ignore
			});
		resolveAudioCaptureMessage()
			.then((message) => {
				toastDictationError(message);
			})
			.catch(() => {
				toastDictationError(getDictationMicErrorMessage("unknown"));
			});
	}

	async function collectDictationDebugSnapshot(context) {
		const snapshot = {
			at: new Date().toISOString(),
			context: context || {},
			uiLang,
			userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
			speechRecognitionSupported: Boolean(getSpeechRecognitionConstructor()),
			dictationAvailable: aiDictationAvailable,
			dictationActive: aiDictationActive,
			permissions: { microphone: "unknown" },
			audioInputs: { count: null, labeled: null },
		};
		if (
			navigator &&
			navigator.permissions &&
			navigator.permissions.query
		) {
			try {
				const status = await navigator.permissions.query({
					name: "microphone",
				});
				if (status && status.state) {
					snapshot.permissions.microphone = status.state;
				}
			} catch {
				// ignore
			}
		}
		if (navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const inputs = (devices || []).filter(
					(d) => d && d.kind === "audioinput"
				);
				snapshot.audioInputs.count = inputs.length;
				snapshot.audioInputs.labeled = inputs.some(
					(d) => d && d.label
				);
			} catch {
				// ignore
			}
		}
		return snapshot;
	}

	function logDictationDebugSnapshot(reason, snapshot) {
		try {
			window.__mirrorDictationDebug = snapshot;
		} catch {
			// ignore
		}
		try {
			const label = reason ? `[Diktat][Debug] ${reason}` : "[Diktat][Debug]";
			console.groupCollapsed(label);
			console.log(snapshot);
			console.groupEnd();
		} catch {
			// ignore
		}
	}

	async function ensureDictationMicAccess() {
		if (
			!navigator ||
			!navigator.mediaDevices ||
			!navigator.mediaDevices.getUserMedia
		)
			return true;
		if (aiDictationMicCheckInFlight) return false;
		aiDictationMicCheckInFlight = true;
		try {
			if (navigator.permissions && navigator.permissions.query) {
				try {
					const status = await navigator.permissions.query({
						name: "microphone",
					});
					if (status && status.state === "denied") {
						toastDictationError(getDictationMicErrorMessage("permission"));
						return false;
					}
					if (status && status.state === "granted") return true;
				} catch {
					// ignore
				}
			}
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			try {
				stream.getTracks().forEach((track) => track.stop());
			} catch {
				// ignore
			}
			return true;
		} catch (err) {
			const name = err && err.name ? String(err.name) : "";
			if (name === "NotReadableError" || name === "AbortError") {
				// Busy mic: allow SpeechRecognition to try anyway.
				return true;
			}
			let kind = "unknown";
			if (name === "NotAllowedError" || name === "SecurityError") {
				kind = "permission";
			} else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
				kind = "not_found";
			}
			toastDictationError(getDictationMicErrorMessage(kind));
			return false;
		} finally {
			aiDictationMicCheckInFlight = false;
		}
	}

	function onAiDictationResult(event) {
		if (!event || !event.results) return;
		let interim = "";
		for (let i = event.resultIndex; i < event.results.length; i += 1) {
			const result = event.results[i];
			if (!result || !result[0]) continue;
			const text = String(result[0].transcript || "").trim();
			if (!text) continue;
			if (result.isFinal) {
				aiDictationFinalText = aiDictationFinalText
					? `${aiDictationFinalText} ${text}`
					: text;
			} else {
				interim = interim ? `${interim} ${text}` : text;
			}
		}
		aiDictationInterimText = interim;
		updateAiDictationValue();
	}

	function stopAiDictation() {
		if (!aiDictationRecognizer) return;
		aiDictationRestarting = false;
		aiDictationActive = false;
		try {
			aiDictationRecognizer.stop();
		} catch {
			// ignore
		}
		setAiDictationUi(false);
	}

	async function startAiDictation() {
		if (!aiDictationRecognizer || !aiPromptInput) {
			console.log("[Diktat] Recognizer oder Input fehlt");
			return;
		}
		const accessOk = await ensureDictationMicAccess();
		if (!accessOk) return;
		const start = () => {
			console.log("[Diktat] Start-Funktion aufgerufen");
			aiDictationBaseText = String(aiPromptInput.value || "");
			aiDictationFinalText = "";
			aiDictationInterimText = "";
			aiDictationActive = true;
			setAiDictationUi(true);
			console.log("[Diktat] UI auf aktiv gesetzt");
			toast(t("toast.dictation_started"), "info");
			console.log("[Diktat] Toast angezeigt");
			try {
				aiDictationRecognizer.lang = getUiSpeechLocale();
				console.log("[Diktat] Sprache gesetzt:", aiDictationRecognizer.lang);
			} catch (e) {
				console.error("[Diktat] Fehler beim Setzen der Sprache:", e);
			}
			try {
				console.log("[Diktat] Starte Recognition...");
				aiDictationRecognizer.start();
				console.log("[Diktat] Recognition gestartet!");
			} catch (e) {
				console.error("[Diktat] Fehler beim Start:", e);
				aiDictationRestarting = false;
				aiDictationActive = false;
				setAiDictationUi(false);
				toast(t("toast.dictation_failed"), "error");
			}
		};
		console.log("[Diktat] startAiDictation aufgerufen");
		try {
			aiDictationRestarting = true;
			aiDictationRecognizer.stop();
			console.log("[Diktat] Vorheriger Recognizer gestoppt");
		} catch (e) {
			aiDictationRestarting = false;
			console.log("[Diktat] Kein vorheriger Recognizer zu stoppen:", e.message);
		}
		start();
	}

	function initAiDictation() {
		const Ctor = getSpeechRecognitionConstructor();
		aiDictationAvailable = Boolean(Ctor);
		setAiDictationUi(false, aiDictationAvailable);
		if (!Ctor) return;
		try {
			aiDictationRecognizer = new Ctor();
			aiDictationRecognizer.continuous = true;
			aiDictationRecognizer.interimResults = true;
			aiDictationRecognizer.lang = getUiSpeechLocale();
			aiDictationRecognizer.onstart = () => {
				aiDictationRestarting = false;
			};
			aiDictationRecognizer.onresult = onAiDictationResult;
			aiDictationRecognizer.onerror = (event) => {
				const code = event && event.error ? String(event.error) : "";
				console.error("[Diktat] Fehler:", code || event || "unknown");
				if (aiDictationRestarting) return;
				aiDictationActive = false;
				aiDictationRestarting = false;
				setAiDictationUi(false);
				if (code === "audio-capture") {
					handleAudioCaptureError();
					return;
				}
				toastDictationError(t("toast.dictation_failed"));
			};
			aiDictationRecognizer.onend = () => {
				if (aiDictationRestarting) return;
				aiDictationActive = false;
				setAiDictationUi(false);
			};
		} catch {
			aiDictationAvailable = false;
			aiDictationRecognizer = null;
			setAiDictationUi(false, false);
		}
	}

	function getAiPrompt() {
		const v = String(
			aiPromptInput && aiPromptInput.value ? aiPromptInput.value : ""
		)
			.trim()
			.slice(0, 800);
		return v;
	}

	function clearAiPromptAfterResponse(promptText) {
		if (!aiPromptInput) return;
		const trimmed = String(promptText || "").trim();
		if (!trimmed) return;
		aiPromptInput.value = "";
		saveAiPrompt("");
	}

	function getAiUsePreview() {
		return aiUsePreview;
	}

	function getAiUseAnswer() {
		return true;
	}

	function setAiUsePreviewUi(active) {
		if (!aiUsePreviewBtn || !aiUsePreviewBtn.classList) return;
		aiUsePreviewBtn.classList.toggle("bg-fuchsia-600/60", active);
		aiUsePreviewBtn.classList.toggle("border-fuchsia-500/30", active);
		aiUsePreviewBtn.classList.toggle("text-slate-50", active);
		aiUsePreviewBtn.classList.toggle("shadow-soft", active);
		aiUsePreviewBtn.classList.toggle("bg-slate-950/30", !active);
		aiUsePreviewBtn.classList.toggle("border-white/15", !active);
		aiUsePreviewBtn.classList.toggle("text-slate-300", !active);
		try {
			aiUsePreviewBtn.setAttribute("aria-pressed", active ? "true" : "false");
		} catch {
			// ignore
		}
	}

	function setAiUseAnswerUi(active) {
		if (!aiUseAnswerBtn || !aiUseAnswerBtn.classList) return;
		aiUseAnswerBtn.classList.toggle("bg-fuchsia-600/60", active);
		aiUseAnswerBtn.classList.toggle("border-fuchsia-500/30", active);
		aiUseAnswerBtn.classList.toggle("text-slate-50", active);
		aiUseAnswerBtn.classList.toggle("shadow-soft", active);
		aiUseAnswerBtn.classList.toggle("bg-slate-950/30", !active);
		aiUseAnswerBtn.classList.toggle("border-white/15", !active);
		aiUseAnswerBtn.classList.toggle("text-slate-300", !active);
		try {
			aiUseAnswerBtn.setAttribute("aria-pressed", active ? "true" : "false");
		} catch {
			// ignore
		}
	}

	function getAiChatContextKey() {
		if (!getAiUsePreview()) return "global";
		const noteId = String(psEditingNoteId || "").trim();
		if (noteId) return `note:${noteId}`;
		return "";
	}

	function getAiChatEntriesForContext(key) {
		const ctx = String(key || "");
		if (!ctx) return [];
		const list = aiChatHistoryByContext.get(ctx);
		return Array.isArray(list) ? list : [];
	}

	function setAiChatHistoryVisible(hasChat) {
		if (!aiChatHistory || !aiChatHistory.classList) return;
		aiChatHistory.classList.toggle("hidden", !hasChat);
	}

	function syncAiChatHistoryVisibility() {
		const items = getAiChatEntriesForContext(aiChatContextKey);
		setAiChatHistoryVisible(items.length > 0);
	}

	function createAiChatEntryEl(entry) {
		const item = document.createElement("div");
		item.className = "ai-chat-item group relative space-y-2 rounded-md bg-white/5 p-2";
		item.setAttribute("data-chat-id", entry.id);
		const items = Array.isArray(entry.items) ? entry.items : [];
		for (const row of items) {
			const rowEl = document.createElement("div");
			rowEl.className = "flex items-start gap-2";
			const badge = document.createElement("span");
			const isAi = String(row.role || "").toLowerCase() === "ai";
			const badgeKey = isAi ? "preview.chat_ai" : "preview.chat_you";
			badge.className = isAi
				? "ai-chat-badge ai-chat-badge-ai mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-fuchsia-500/20 text-[10px] text-fuchsia-200"
				: "ai-chat-badge mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-[10px]";
			badge.setAttribute("data-i18n", badgeKey);
			badge.textContent = t(badgeKey);
			const body = document.createElement("div");
			body.className = "ai-chat-message flex-1 rounded-md bg-white/5 px-2 py-1.5 text-slate-100";
			body.textContent = String(row.text || "");
			rowEl.appendChild(badge);
			rowEl.appendChild(body);
			item.appendChild(rowEl);
		}
		const del = document.createElement("button");
		del.type = "button";
		del.className = "ai-chat-delete absolute right-2 top-2 h-6 w-6 rounded-md text-xs text-slate-300 transition hover:bg-white/5 active:bg-white/10";
		del.setAttribute("data-chat-delete", "true");
		del.setAttribute("data-chat-id", entry.id);
		del.setAttribute("data-i18n", "preview.chat_delete");
		del.setAttribute("title", t("preview.chat_delete"));
		del.textContent = "×";
		item.appendChild(del);
		return item;
	}

	function renderAiChatHistory() {
		if (!aiChatList) return;
		aiChatList.innerHTML = "";
		const items = getAiChatEntriesForContext(aiChatContextKey);
		for (const entry of items) {
			aiChatList.appendChild(createAiChatEntryEl(entry));
		}
		syncAiChatHistoryVisibility();
	}

	function syncAiChatContext() {
		if (!getAiUsePreview()) {
			if (!aiChatContextKey) aiChatContextKey = "global";
			syncAiChatHistoryVisibility();
			return;
		}
		const nextKey = getAiChatContextKey();
		if (nextKey === aiChatContextKey) {
			syncAiChatHistoryVisibility();
			return;
		}
		aiChatContextKey = nextKey;
		renderAiChatHistory();
	}

	function clearAiChatHistoryForContext() {
		if (!aiChatContextKey) return;
		aiChatHistoryByContext.set(aiChatContextKey, []);
		renderAiChatHistory();
	}

	function deleteAiChatEntryById(entryId) {
		const id = String(entryId || "");
		if (!id) return;
		const list = getAiChatEntriesForContext(aiChatContextKey);
		if (!list.length) return;
		const next = list.filter((item) => String(item.id || "") !== id);
		aiChatHistoryByContext.set(aiChatContextKey, next);
		renderAiChatHistory();
	}

	function addAiChatEntry(role, text, contextKey) {
		const content = String(text || "").trim();
		if (!content) return;
		const key = String(contextKey || getAiChatContextKey() || "");
		if (!key) return;
		const list = getAiChatEntriesForContext(key).slice();
		const roleLower = String(role || "").toLowerCase();
		const isAi = roleLower === "ai";
		if (isAi && list.length) {
			const last = list[list.length - 1];
			const lastItems = Array.isArray(last.items) ? last.items : [];
			const lastHasAi = lastItems.some((item) => String(item.role || "").toLowerCase() === "ai");
			if (!lastHasAi) {
				last.items = [...lastItems, { role: "ai", text: content }];
				list[list.length - 1] = last;
			} else {
				list.push({
					id: `${Date.now()}-${(aiChatSeq += 1)}`,
					items: [{ role: "ai", text: content }],
				});
			}
		} else {
			list.push({
				id: `${Date.now()}-${(aiChatSeq += 1)}`,
				items: [{ role: roleLower || "user", text: content }],
			});
		}
		aiChatHistoryByContext.set(key, list);
		if (key !== aiChatContextKey) {
			aiChatContextKey = key;
		}
		renderAiChatHistory();
	}

	function stripManualTagsMarker(tags) {
		const arr = Array.isArray(tags) ? tags : [];
		return arr.filter((t) => String(t || "") !== PS_MANUAL_TAGS_MARKER);
	}

	function stripPinnedTag(tags) {
		const arr = Array.isArray(tags) ? tags : [];
		return arr.filter((t) => String(t || "") !== PS_PINNED_TAG);
	}

	function noteIsPinned(note) {
		const tags = Array.isArray(note && note.tags) ? note.tags : [];
		return tags.some((t) => String(t || "") === PS_PINNED_TAG);
	}

	function buildPsTagsPayload(tags, overridden) {
		const cleaned = stripManualTagsMarker(tags);
		return overridden ? [...cleaned, PS_MANUAL_TAGS_MARKER] : cleaned;
	}

	function setPsAutoSaveStatus(message) {
		if (!psAutoSaveStatus) return;
		const text = String(message || "").trim();
		psAutoSaveStatus.textContent = text;
		psAutoSaveStatus.classList.toggle("hidden", !text);
		updatePsSaveVisibility();
	}

	function updatePsSaveVisibility() {
		if (!psSaveMain || !psSaveMain.classList) return;
		psSaveMain.classList.toggle("hidden", canAutoSavePsNote());
	}

	function schedulePsListRerender() {
		if (psListRerenderTimer) {
			window.clearTimeout(psListRerenderTimer);
			psListRerenderTimer = 0;
		}
		psListRerenderTimer = window.setTimeout(() => {
			psListRerenderTimer = 0;
			if (!psTransition.requestRender()) return; // deferred by manager
			if (!psState || !psState.authed) return;
			applyPersonalSpaceFiltersAndRender();
		}, 120);
	}

	function resetPsAutoSaveState() {
		if (psAutoSaveTimer) {
			window.clearTimeout(psAutoSaveTimer);
			psAutoSaveTimer = 0;
		}
		psAutoSaveInFlight = false;
		psAutoSaveQueuedText = "";
		psAutoSaveQueuedNoteId = "";
		psAutoSaveQueuedTags = null;
	}

	async function flushPendingPsAutoSave() {
		if (!canAutoSavePsNote()) return;
		if (psAutoSaveInFlight) return;
		const currentNoteId = String(psEditingNoteId || "").trim();
		if (!currentNoteId) return;
		const currentText = String(textarea && textarea.value ? textarea.value : "");
		if (!currentText.trim()) return;
		if (psAutoSaveTimer) {
			window.clearTimeout(psAutoSaveTimer);
			psAutoSaveTimer = 0;
		}
		const queuedText = psAutoSaveQueuedText || currentText;
		const queuedNoteId = psAutoSaveQueuedNoteId || currentNoteId;
		const queuedTags = psAutoSaveQueuedTags || buildCurrentPsTagsPayload();
		psAutoSaveQueuedText = "";
		psAutoSaveQueuedNoteId = "";
		psAutoSaveQueuedTags = null;
		// Don't try to save a note that doesn't exist locally (deleted by server dedup)
		if (!findNoteById(queuedNoteId)) {
			return;
		}
		psAutoSaveInFlight = true;
		try {
			await savePersonalSpaceNoteSnapshot(queuedNoteId, queuedText, queuedTags);
		} finally {
			psAutoSaveInFlight = false;
		}
	}

	function ensureNoteUpdatedAt(note) {
		if (!note || typeof note !== "object") return note;
		if (
			typeof note.updatedAt !== "number" ||
			!Number.isFinite(note.updatedAt)
		) {
			note.updatedAt =
				typeof note.createdAt === "number" ? note.createdAt : Date.now();
		}
		return note;
	}

	function filterRealNotes(notes) {
		const list = Array.isArray(notes) ? notes : [];
		const byId = new Map();
		for (const note of list) {
			if (!note || typeof note !== "object") continue;
			const id = String(note.id || "").trim();
			if (!id) continue;
			const prev = byId.get(id);
			if (!prev) {
				byId.set(id, note);
				continue;
			}
			const prevUpdated = Number(prev.updatedAt || prev.createdAt || 0);
			const nextUpdated = Number(note.updatedAt || note.createdAt || 0);
			if (nextUpdated >= prevUpdated) byId.set(id, note);
		}
		const idDeduped = Array.from(byId.values());
		const activeId = String(psEditingNoteId || "").trim();
		const byTitle = new Map();
		for (const note of idDeduped) {
			const title = getNoteTitle(note && note.text ? note.text : "");
			if (!title || title === "Untitled") continue;
			const key = title.toLowerCase();
			const prev = byTitle.get(key);
			if (!prev) {
				byTitle.set(key, note);
				continue;
			}
			const noteId = String(note.id || "");
			const prevId = String(prev.id || "");
			if (activeId && noteId === activeId) {
				byTitle.set(key, note);
				continue;
			}
			if (activeId && prevId === activeId) {
				continue;
			}
			const prevUpdated = Number(prev.updatedAt || prev.createdAt || 0);
			const nextUpdated = Number(note.updatedAt || note.createdAt || 0);
			const prevTags = Array.isArray(prev.tags) ? prev.tags : [];
			const nextTags = Array.isArray(note.tags) ? note.tags : [];
			const prevPinned = prevTags.some((t) => String(t || "") === PS_PINNED_TAG);
			const nextPinned = nextTags.some((t) => String(t || "") === PS_PINNED_TAG);
			if (nextPinned && !prevPinned) {
				byTitle.set(key, note);
			} else if (!nextPinned && prevPinned) {
				// keep prev (pinned)
			} else if (nextUpdated >= prevUpdated) {
				byTitle.set(key, note);
			}
		}
		const keepIds = new Set();
		for (const note of byTitle.values()) {
			keepIds.add(String(note.id || ""));
		}
		const result = [];
		for (const note of idDeduped) {
			const title = getNoteTitle(note && note.text ? note.text : "");
			if (!title || title === "Untitled") {
				result.push(note);
				continue;
			}
			if (keepIds.has(String(note.id || ""))) {
				result.push(note);
			}
		}
		return result;
	}

	function formatMetaDate(ts) {
		if (!ts || !Number.isFinite(ts)) return "";
		try {
			const d = new Date(ts);
			if (Number.isNaN(d.getTime())) return "";
			const dd = String(d.getDate()).padStart(2, "0");
			const mm = String(d.getMonth() + 1).padStart(2, "0");
			const yyyy = String(d.getFullYear());
			const hh = String(d.getHours()).padStart(2, "0");
			const min = String(d.getMinutes()).padStart(2, "0");
			return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
		} catch {
			return "";
		}
	}

	function buildNoteMetaYaml(note) {
		if (!note) return "";
		const safe = ensureNoteUpdatedAt({ ...note });
		const tags = Array.isArray(safe.tags) ? safe.tags : [];
		const cleanTags = stripPinnedTag(stripManualTagsMarker(tags));
		const text = String(safe.text || "");
		const words = text.trim().match(/\S+/g);
		const wordCount = words ? words.length : 0;
		const charCount = text.length;
		const lines = [
			"---",
			`id: ${String(safe.id || "")}`,
			`kind: ${String(safe.kind || "note")}`,
			`created: ${formatMetaDate(safe.createdAt)}`,
			`updated: ${formatMetaDate(safe.updatedAt)}`,
			`words: ${wordCount}`,
			`characters: ${charCount}`,
			`tags: [${cleanTags.map((t) => JSON.stringify(String(t))).join(", ")}]`,
			"---",
		];
		return lines.join("\n");
	}

	function setPsMetaVisible(next) {
		psMetaVisible = Boolean(next);
		if (psMetaToggle) {
			psMetaToggle.classList.toggle("bg-white/10", psMetaVisible);
			psMetaToggle.classList.toggle("text-slate-100", psMetaVisible);
			psMetaToggle.classList.toggle("text-slate-200", !psMetaVisible);
			try {
				psMetaToggle.setAttribute(
					"aria-pressed",
					psMetaVisible ? "true" : "false"
				);
			} catch {
				// ignore
			}
		}
		updateEditorMetaYaml();
		if (previewOpen) updatePreview();
	}

	function loadPsMetaVisible() {
		try {
			const raw = localStorage.getItem(PS_META_VISIBLE_KEY);
			psMetaVisible = raw === null ? true : raw !== "0";
		} catch {
			psMetaVisible = true;
		}
		setPsMetaVisible(psMetaVisible);
	}

	function savePsMetaVisible() {
		try {
			localStorage.setItem(PS_META_VISIBLE_KEY, psMetaVisible ? "1" : "0");
		} catch {
			// ignore
		}
	}

	function updateEditorMetaYaml() {
		if (!psMetaYaml || !psMetaYaml.classList) return;
		if (!psMetaVisible) {
			psMetaYaml.classList.add("hidden");
			resetEditorMetaPadding();
			return;
		}
		if (!psState || !psState.authed || !psEditingNoteId) {
			psMetaYaml.classList.add("hidden");
			resetEditorMetaPadding();
			return;
		}
		const note = findNoteById(psEditingNoteId);
		if (!note) {
			psMetaYaml.classList.add("hidden");
			resetEditorMetaPadding();
			return;
		}
		const yaml = buildNoteMetaYaml(note);
		const pre = psMetaYaml.querySelector("pre");
		if (pre) pre.textContent = yaml;
		psMetaYaml.classList.toggle("hidden", !yaml);
		if (!yaml) {
			resetEditorMetaPadding();
			return;
		}
		requestAnimationFrame(() => {
			if (!psMetaYaml || psMetaYaml.classList.contains("hidden")) return;
			updateEditorMetaPadding();
			updateEditorMetaScroll();
		});
	}

	function updateEditorMetaScroll() {
		if (!psMetaYaml || !textarea) return;
		const y = Math.max(0, Number(textarea.scrollTop || 0));
		psMetaYaml.style.transform = `translateY(${-y}px)`;
	}

	function updateEditorMetaPadding() {
		if (!textarea || !psMetaYaml) return;
		if (psMetaBasePaddingTop === null) {
			try {
				psMetaBasePaddingTop =
					parseFloat(getComputedStyle(textarea).paddingTop) || 0;
			} catch {
				psMetaBasePaddingTop = 0;
			}
			// Ensure minimum base padding (Tailwind pt-20 = 80px, mobile ≥ 42px)
			if (psMetaBasePaddingTop < 42) psMetaBasePaddingTop = 42;
		}
		const rect = psMetaYaml.getBoundingClientRect();
		const height = Math.max(
			0,
			rect.height || 0,
			psMetaYaml.offsetHeight || 0,
			psMetaYaml.scrollHeight || 0
		);
		const next = psMetaBasePaddingTop + height + 4;
		const val = `${Math.round(next)}px`;
		textarea.style.setProperty('padding-top', val, 'important');
		if (attributionOverlay)
			attributionOverlay.style.setProperty('padding-top', val, 'important');
		if (commentOverlay)
			commentOverlay.style.setProperty('padding-top', val, 'important');
	}

	function resetEditorMetaPadding() {
		if (!textarea) return;
		if (psMetaBasePaddingTop === null) {
			try {
				psMetaBasePaddingTop =
					parseFloat(getComputedStyle(textarea).paddingTop) || 0;
			} catch {
				psMetaBasePaddingTop = 0;
			}
			// Ensure minimum base padding (Tailwind pt-20 = 80px, mobile ≥ 42px)
			if (psMetaBasePaddingTop < 42) psMetaBasePaddingTop = 42;
		}
		// Remove the JS override so CSS rules (incl. !important) take effect again
		textarea.style.removeProperty('padding-top');
		if (attributionOverlay)
			attributionOverlay.style.removeProperty('padding-top');
		if (commentOverlay)
			commentOverlay.style.removeProperty('padding-top');
	}

	function cleanNoteTitleLine(line) {
		return String(line || "")
			.replace(/^#+\s*/, "")
			.replace(/^[-*+]\s+/, "")
			.replace(/^\d+[.)]\s+/, "")
			.trim()
			.slice(0, 120);
	}

	function getNoteTitleAndExcerpt(text) {
		const lines = String(text || "").split("\n");
		let title = "";
		let titleLineIndex = 0;
		for (let i = 0; i < lines.length; i++) {
			const line = String(lines[i] || "").trim();
			if (!line) continue;
			title = cleanNoteTitleLine(line);
			titleLineIndex = i;
			break;
		}
		if (!title) title = "Untitled";
		let rest = "";
		for (let i = titleLineIndex + 1; i < lines.length; i++) {
			const line = String(lines[i] || "").trim();
			if (!line) continue;
			rest += (rest ? " " : "") + cleanNoteTitleLine(line);
			if (rest.length >= 220) break;
		}
		rest = rest.replace(/\s+/g, " ").trim();
		if (rest.length > 240) rest = rest.slice(0, 240).trim() + "…";
		return { title, excerpt: rest };
	}

	function getNotePreviewLines(text, maxLines = 3) {
		const lines = String(text || "").split("\n");
		let titleLineIndex = 0;
		for (let i = 0; i < lines.length; i++) {
			const line = String(lines[i] || "").trim();
			if (!line) continue;
			titleLineIndex = i;
			break;
		}
		const previewLines = [];
		for (let i = titleLineIndex + 1; i < lines.length; i++) {
			const raw = String(lines[i] || "");
			const trimmedEnd = raw.trimEnd();
			if (!trimmedEnd.trim()) continue;
			previewLines.push(trimmedEnd);
			if (previewLines.length >= maxLines) break;
		}
		return previewLines;
	}

	function getNoteTitle(text) {
		return getNoteTitleAndExcerpt(text).title;
	}
	let psTagsCollapsed = false;
	let psVisible = true;
	const GRID_WITH_PS = "lg:grid-cols-[360px_1fr]";
	const GRID_NO_PS = "lg:grid-cols-1";

	function loadPsVisible() {
		try {
			const v = localStorage.getItem(PS_VISIBLE_KEY);
			psVisible = v === null ? true : v !== "0";
		} catch {
			psVisible = true;
		}
	}

	function savePsVisible() {
		try {
			localStorage.setItem(PS_VISIBLE_KEY, psVisible ? "1" : "0");
		} catch {
			// ignore
		}
	}

	function applyPsVisible() {
		if (psPanel && psPanel.classList) {
			psPanel.classList.toggle("hidden", !psVisible);
		}
		if (mainGrid && mainGrid.classList) {
			mainGrid.classList.toggle(GRID_WITH_PS, psVisible);
			mainGrid.classList.toggle(GRID_NO_PS, !psVisible);
		}
		if (togglePersonalSpaceBtn) {
			try {
				togglePersonalSpaceBtn.setAttribute(
					"aria-pressed",
					psVisible ? "true" : "false"
				);
			} catch {
				// ignore
			}
			try {
				const icon = togglePersonalSpaceBtn.querySelector(
					'[data-role="psChevron"]'
				);
				if (icon && icon.classList) {
					icon.classList.toggle("rotate-180", !psVisible);
				}
			} catch {
				// ignore
			}
		}
	}

	function normalizeSearchQuery(raw) {
		return String(raw || "")
			.trim()
			.toLowerCase();
	}

	/* ── Query Engine ──────────────────────────────────────── */

	function parseQueryTokens(raw) {
		const src = String(raw || "").trim().toLowerCase();
		if (!src) return { structured: [], plain: [] };
		const structured = [];
		const plain = [];
		const regex = /"([^"]+)"|([^\s]+)/g;
		let m;
		while ((m = regex.exec(src))) {
			const v = (m[1] || m[2] || "").trim();
			if (!v) continue;
			if (v.startsWith("tag:")) {
				const tag = v.slice(4).replace(/^#/, "").trim();
				if (tag) structured.push({ type: "tag", value: tag });
			} else if (v === "task:open") {
				structured.push({ type: "taskOpen" });
			} else if (v === "task:done" || v === "task:closed") {
				structured.push({ type: "taskDone" });
			} else if (v === "has:task" || v === "has:tasks") {
				structured.push({ type: "hasTask" });
			} else if (v === "has:comment" || v === "has:comments") {
				structured.push({ type: "hasComment" });
			} else if (v === "has:permalink" || v === "has:permalinks" || v === "has:permanentlink") {
				structured.push({ type: "hasPermalink" });
			} else if (v.startsWith("kind:")) {
				structured.push({ type: "kind", value: v.slice(5).trim() });
			} else if (v.startsWith("created:>")) {
				structured.push({ type: "createdAfter", value: v.slice(9).trim() });
			} else if (v.startsWith("created:<")) {
				structured.push({ type: "createdBefore", value: v.slice(9).trim() });
			} else if (v.startsWith("updated:>")) {
				structured.push({ type: "updatedAfter", value: v.slice(9).trim() });
			} else if (v.startsWith("updated:<")) {
				structured.push({ type: "updatedBefore", value: v.slice(9).trim() });
			} else if (v === "pinned:yes" || v === "pinned:true") {
				structured.push({ type: "pinned", value: true });
			} else if (v === "pinned:no" || v === "pinned:false") {
				structured.push({ type: "pinned", value: false });
			} else {
				plain.push(v);
			}
		}
		return { structured, plain };
	}

	function extractNoteTasks(text) {
		const lines = String(text || "").split("\n");
		const open = [];
		const done = [];
		for (const line of lines) {
			const m = line.match(/^\s*-\s\[([ xX])\]\s+(.+)/);
			if (m) {
				const label = m[2].trim();
				if (m[1] === " ") open.push(label);
				else done.push(label);
			}
		}
		return { open, done, total: open.length + done.length };
	}

	function parseDatePrefix(val) {
		if (!val) return 0;
		const d = new Date(val);
		return Number.isFinite(d.getTime()) ? d.getTime() : 0;
	}

	function isQueryMode(raw) {
		const q = String(raw || "").trim().toLowerCase();
		return /(?:^|\s)(?:tag:|task:|has:|kind:|created:|updated:|pinned:)/.test(q);
	}

	function colognePhonetic(raw) {
		const input = String(raw || "")
			.toLowerCase()
			.replace(/[ä]/g, "a")
			.replace(/[ö]/g, "o")
			.replace(/[ü]/g, "u")
			.replace(/ß/g, "s")
			.replace(/[^a-z]/g, " ");
		const chars = Array.from(input);
		const digits = [];
		for (let i = 0; i < chars.length; i += 1) {
			const c = chars[i];
			const prev = i > 0 ? chars[i - 1] : "";
			const next = i + 1 < chars.length ? chars[i + 1] : "";
			let code = "";
			switch (c) {
				case "a":
				case "e":
				case "i":
				case "j":
				case "o":
				case "u":
				case "y":
					code = "0";
					break;
				case "h":
					code = "-";
					break;
				case "b":
					code = "1";
					break;
				case "p":
					code = next === "h" ? "3" : "1";
					break;
				case "d":
				case "t":
					code = next && "scxz".includes(next) ? "8" : "2";
					break;
				case "f":
				case "v":
				case "w":
					code = "3";
					break;
				case "g":
				case "k":
				case "q":
					code = "4";
					break;
				case "c": {
					const front = "ahkloqrux".includes(next);
					if (i === 0) code = front ? "4" : "8";
					else if ("sz".includes(prev)) code = "8";
					else if (front) code = "4";
					else code = "8";
					break;
				}
				case "x":
					digits.push("4");
					digits.push("8");
					continue;
				case "l":
					code = "5";
					break;
				case "m":
				case "n":
					code = "6";
					break;
				case "r":
					code = "7";
					break;
				case "s":
				case "z":
					code = "8";
					break;
				default:
					code = "";
			}
			if (!code || code === "-") continue;
			digits.push(code);
		}
		const compact = [];
		digits.forEach((d) => {
			if (!d) return;
			if (compact[compact.length - 1] !== d) compact.push(d);
		});
		return compact.filter((d) => d !== "0").join("");
	}

	function loadPsSearchQuery() {
		try {
			psSearchQuery = String(localStorage.getItem(PS_SEARCH_QUERY_KEY) || "");
		} catch {
			psSearchQuery = "";
		}
		if (psSearchInput) psSearchInput.value = psSearchQuery;
	}

	function normalizePsSortMode(raw) {
		const mode = String(raw || "")
			.trim()
			.toLowerCase();
		if (
			mode === "created" ||
			mode === "updated" ||
			mode === "accessed" ||
			mode === "text"
		) {
			return mode;
		}
		return "updated";
	}

	function setPsSortMenuOpen(open) {
		if (!psSortMenu) return;
		psSortMenu.classList.toggle("hidden", !open);
		if (psSortMenuBtn) {
			try {
				psSortMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
			} catch {
				// ignore
			}
		}
	}

	function syncPsSortMenu() {
		if (!psSortMenu) return;
		const items = psSortMenu.querySelectorAll("[data-sort]");
		items.forEach((el) => {
			const btn = el;
			const mode = btn.getAttribute("data-sort") || "";
			const active = mode === psSortMode;
			btn.classList.toggle("bg-fuchsia-500/20", active);
			btn.classList.toggle("text-fuchsia-50", active);
			const check = btn.querySelector(".ps-sort-check");
			if (check && check.classList) {
				check.classList.toggle("invisible", !active);
			}
			try {
				btn.setAttribute("aria-checked", active ? "true" : "false");
			} catch {
				// ignore
			}
		});
	}

	function loadPsNoteAccessed() {
		try {
			const raw = localStorage.getItem(PS_NOTE_ACCESSED_KEY);
			if (!raw) {
				psNoteAccessedById = new Map();
				return;
			}
			const parsed = JSON.parse(raw);
			const next = new Map();
			if (parsed && typeof parsed === "object") {
				Object.keys(parsed).forEach((id) => {
					const val = Number(parsed[id] || 0);
					if (Number.isFinite(val) && val > 0) {
						next.set(String(id), val);
					}
				});
			}
			psNoteAccessedById = next;
		} catch {
			psNoteAccessedById = new Map();
		}
	}

	function savePsNoteAccessed() {
		try {
			const entries = Array.from(psNoteAccessedById.entries())
				.sort((a, b) => b[1] - a[1])
				.slice(0, 300);
			psNoteAccessedById = new Map(entries);
			const payload = Object.fromEntries(entries);
			localStorage.setItem(PS_NOTE_ACCESSED_KEY, JSON.stringify(payload));
		} catch {
			// ignore
		}
	}

	function markPsNoteAccessed(noteId) {
		const id = String(noteId || "").trim();
		if (!id) return;
		psNoteAccessedById.set(id, Date.now());
		savePsNoteAccessed();
	}

	function loadPsSortMode() {
		try {
			psSortMode = normalizePsSortMode(
				localStorage.getItem(PS_SORT_MODE_KEY) || "updated"
			);
		} catch {
			psSortMode = normalizePsSortMode("updated");
		}
		psSortMode = normalizePsSortMode(psSortMode);
		syncPsSortMenu();
	}

	function savePsSortMode() {
		try {
			psSortMode = normalizePsSortMode(psSortMode);
			localStorage.setItem(PS_SORT_MODE_KEY, psSortMode);
		} catch {
			// ignore
		}
	}

	function savePsSearchQuery() {
		try {
			localStorage.setItem(PS_SEARCH_QUERY_KEY, String(psSearchQuery || ""));
		} catch {
			// ignore
		}
	}

	/* ── Saved Queries (server-backed) ── */
	let psSavedQueries = [];

	async function loadPsSavedQueries() {
		try {
			const res = await api("/api/saved-queries");
			psSavedQueries = Array.isArray(res.queries) ? res.queries : [];
		} catch {
			psSavedQueries = [];
		}
		renderSavedQueryChips();
	}

	async function addSavedQuery(query) {
		const q = String(query || "").trim();
		if (!q) return;
		if (psSavedQueries.some((s) => s.query === q)) return;
		try {
			const res = await api("/api/saved-queries", {
				method: "POST",
				body: JSON.stringify({ query: q }),
			});
			if (res.ok) {
				psSavedQueries.push({ id: res.id, label: res.label, query: res.query, created_at: res.created_at });
				renderSavedQueryChips();
			}
		} catch { /* ignore */ }
	}

	async function removeSavedQuery(idx) {
		const sq = psSavedQueries[idx];
		if (!sq) return;
		psSavedQueries.splice(idx, 1);
		renderSavedQueryChips();
		try {
			await api(`/api/saved-queries/${encodeURIComponent(sq.id)}`, { method: "DELETE" });
		} catch { /* ignore */ }
	}

	function applySavedQuery(query) {
		if (psSearchInput) psSearchInput.value = query;
		psSearchQuery = query;
		savePsSearchQuery();
		applyPersonalSpaceFiltersAndRender();
	}

	function renderSavedQueryChips() {
		const wrap = document.getElementById("psSavedQueries");
		if (!wrap) return;
		if (psSavedQueries.length === 0) { wrap.classList.add("hidden"); wrap.innerHTML = ""; return; }
		wrap.classList.remove("hidden");
		wrap.innerHTML = "";
		psSavedQueries.forEach((sq, i) => {
			const chip = document.createElement("button");
			chip.type = "button";
			chip.className = "ps-saved-query-chip";
			chip.title = sq.query;
			const txt = document.createElement("span");
			txt.textContent = sq.label;
			chip.appendChild(txt);
			const del = document.createElement("span");
			del.className = "ps-saved-query-del";
			del.textContent = "×";
			del.addEventListener("click", (ev) => { ev.stopPropagation(); removeSavedQuery(i); });
			chip.appendChild(del);
			chip.addEventListener("click", () => applySavedQuery(sq.query));
			wrap.appendChild(chip);
		});
	}

	function loadPsPinnedOnly() {
		try {
			psPinnedOnly = localStorage.getItem(PS_PINNED_ONLY_KEY) === "1";
		} catch {
			psPinnedOnly = false;
		}
		updatePsPinnedToggle();
	}

	function loadPsCommentsOnly() {
		try {
			psCommentsOnly = localStorage.getItem(PS_COMMENTS_ONLY_KEY) === "1";
		} catch {
			psCommentsOnly = false;
		}
		updatePsCommentsToggle();
	}

	function savePsPinnedOnly() {
		try {
			localStorage.setItem(PS_PINNED_ONLY_KEY, psPinnedOnly ? "1" : "0");
		} catch {
			// ignore
		}
	}

	function savePsCommentsOnly() {
		try {
			localStorage.setItem(PS_COMMENTS_ONLY_KEY, psCommentsOnly ? "1" : "0");
		} catch {
			// ignore
		}
	}

	function updatePsPinnedToggle() {
		if (!psPinnedToggle || !psPinnedToggle.classList) return;
		psPinnedToggle.classList.toggle("bg-fuchsia-500/20", psPinnedOnly);
		psPinnedToggle.classList.toggle("border-fuchsia-400/40", psPinnedOnly);
		psPinnedToggle.classList.toggle("text-fuchsia-100", psPinnedOnly);
		psPinnedToggle.classList.toggle("shadow-soft", psPinnedOnly);
		psPinnedToggle.classList.toggle("bg-transparent", !psPinnedOnly);
		psPinnedToggle.classList.toggle("border-white/10", !psPinnedOnly);
		psPinnedToggle.classList.toggle("text-slate-300", !psPinnedOnly);
		try {
			psPinnedToggle.setAttribute(
				"aria-pressed",
				psPinnedOnly ? "true" : "false"
			);
		} catch {
			// ignore
		}
	}

	function updatePsCommentsToggle() {
		if (!psCommentsToggle || !psCommentsToggle.classList) return;
		psCommentsToggle.classList.toggle("bg-fuchsia-500/20", psCommentsOnly);
		psCommentsToggle.classList.toggle("border-fuchsia-400/40", psCommentsOnly);
		psCommentsToggle.classList.toggle("text-fuchsia-100", psCommentsOnly);
		psCommentsToggle.classList.toggle("shadow-soft", psCommentsOnly);
		psCommentsToggle.classList.toggle("bg-transparent", !psCommentsOnly);
		psCommentsToggle.classList.toggle("border-white/10", !psCommentsOnly);
		psCommentsToggle.classList.toggle("text-slate-300", !psCommentsOnly);
		try {
			psCommentsToggle.setAttribute(
				"aria-pressed",
				psCommentsOnly ? "true" : "false"
			);
		} catch {
			// ignore
		}
	}

	async function loadPsCommentIndex() {
		if (psCommentIndexPromise) return psCommentIndexPromise;
		psCommentIndexPromise = (async () => {
			try {
				if (!psState || !psState.authed) {
					psCommentedNoteIds = new Set();
					return;
				}
				const res = await api("/api/notes/comments-index");
				const ids = Array.isArray(res && res.noteIds) ? res.noteIds : [];
				psCommentedNoteIds = new Set(
					ids.map((id) => String(id || "").trim()).filter(Boolean)
				);
			} catch (e) {
				console.warn("[has:comment] failed to load comment index:", e);
				psCommentedNoteIds = new Set();
			} finally {
				psCommentIndexLoaded = true;
				psCommentIndexPromise = null;
			}
		})();
		return psCommentIndexPromise;
	}

	function noteMatchesSearch(note, tokens) {
		if (!tokens || tokens.length === 0) return true;
		const noteId = String(note && note.id ? note.id : "").trim();
		const text = String(note && note.text ? note.text : "").toLowerCase();
		const tags = Array.isArray(note && note.tags) ? note.tags : [];
		const tagsLower = tags.map((t) => String(t || "").toLowerCase());
		const hay = `${text}\n${tagsLower.join(" ")}`;
		const phoneticTokens = new Set();
		const addPhonetic = (word) => {
			const code = colognePhonetic(word);
			if (code) phoneticTokens.add(code);
		};
		text
			.split(/[^a-z0-9äöüß]+/i)
			.filter(Boolean)
			.forEach((w) => addPhonetic(w));
		tagsLower.forEach((t) => addPhonetic(t));
		return tokens.every((tokRaw) => {
			let tok = String(tokRaw || "")
				.trim()
				.toLowerCase();
			if (!tok) return true;
			if (
				tok === "has:comment" ||
				tok === "has:comments" ||
				tok === "commented"
			) {
				if (!noteId) return false;
				return psCommentedNoteIds.has(noteId);
			}
			if (tok.startsWith("#")) tok = tok.slice(1);
			if (tok.startsWith("tag:")) {
				const want = tok.slice(4).trim();
				if (!want) return true;
				return tagsLower.includes(want);
			}
			if (!tok) return true;
			const phon = colognePhonetic(tok);
			if (hay.includes(tok)) return true;
			if (phon && phoneticTokens.has(phon)) return true;
			return false;
		});
	}

	function noteSearchRelevance(note, tokens) {
		if (!tokens || tokens.length === 0) return 0;
		const text = String(note && note.text ? note.text : "").toLowerCase();
		const tags = Array.isArray(note && note.tags) ? note.tags : [];
		const tagsLower = tags.map((t) => String(t || "").toLowerCase());
		const hay = `${text}\n${tagsLower.join(" ")}`;
		const firstLine = (text.split("\n")[0] || "").trim();
		const words = text.split(/[^a-z0-9äöüß]+/i).filter(Boolean);
		const titleWords = firstLine.split(/[^a-z0-9äöüß]+/i).filter(Boolean);
		let score = 0;
		for (const tokRaw of tokens) {
			let tok = String(tokRaw || "").trim().toLowerCase();
			if (!tok) continue;
			if (tok.startsWith("#")) tok = tok.slice(1);
			if (!tok) continue;
			if (tok.startsWith("tag:")) { if (tagsLower.includes(tok.slice(4).trim())) score += 10; continue; }

			/* ── exact whole-word match (highest value) ── */
			const hasExactWord = words.some((w) => w === tok);
			const hasExactTitleWord = titleWords.some((w) => w === tok);
			const hasExactTag = tagsLower.some((t) => t === tok);

			/* ── title is exactly the search term ── */
			if (firstLine === tok) score += 100;

			/* ── exact word in title ── */
			if (hasExactTitleWord) score += 50;

			/* ── exact tag match ── */
			if (hasExactTag) score += 40;

			/* ── title contains substring ── */
			if (!hasExactTitleWord && firstLine.includes(tok)) score += 30;

			/* ── exact word anywhere in body ── */
			if (hasExactWord && !hasExactTitleWord) score += 20;

			/* ── substring match – count occurrences ── */
			let idx = 0; let exactHits = 0;
			while ((idx = hay.indexOf(tok, idx)) !== -1) { exactHits++; idx += tok.length; }
			if (exactHits > 0) {
				score += 10 + Math.min(exactHits, 20);
			}

			/* ── shorter notes with match = more focused = higher rank ── */
			if (exactHits > 0 && text.length > 0) {
				const density = (exactHits * tok.length) / text.length;
				score += Math.round(density * 30);
			}

			/* ── phonetic-only match = lowest score tier ── */
			if (exactHits === 0) {
				const phon = colognePhonetic(tok);
				if (phon) {
					let phonHits = 0;
					for (const w of words) { if (colognePhonetic(w) === phon) phonHits++; }
					for (const tl of tagsLower) { if (colognePhonetic(tl) === phon) phonHits++; }
					if (phonHits > 0) score += 2 + phonHits;
				}
			}
		}
		return score;
	}

	function noteMatchesStructuredQuery(note, structured) {
		if (!structured || structured.length === 0) return true;
		const text = String(note && note.text ? note.text : "");
		const tags = Array.isArray(note && note.tags) ? note.tags : [];
		const tagsLower = tags.map((t) => String(t || "").toLowerCase());
		const kind = String(note && note.kind ? note.kind : "").toLowerCase();
		const createdAt = Number(note && note.createdAt ? note.createdAt : 0);
		const updatedAt = Number(note && note.updatedAt ? note.updatedAt : createdAt);
		let tasks = null;
		const getTasks = () => {
			if (!tasks) tasks = extractNoteTasks(text);
			return tasks;
		};
		return structured.every((tok) => {
			switch (tok.type) {
				case "tag":
					return tagsLower.includes(tok.value);
				case "taskOpen":
					return getTasks().open.length > 0;
				case "taskDone":
					return getTasks().done.length > 0;
				case "hasTask":
					return getTasks().total > 0;
				case "hasComment":
					return psCommentedNoteIds.has(String(note && note.id ? note.id : "").trim());
				case "hasPermalink": {
					const nid = String(note && note.id ? note.id : "").trim();
					if (!nid) return false;
					const pins = loadRoomPinnedEntries();
					return pins.some((p) => p.noteId === nid);
				}
				case "kind":
					return kind === tok.value || (!kind && tok.value === "note");
				case "createdAfter": {
					const ts = parseDatePrefix(tok.value);
					return ts ? createdAt >= ts : true;
				}
				case "createdBefore": {
					const ts = parseDatePrefix(tok.value);
					return ts ? createdAt < ts : true;
				}
				case "updatedAfter": {
					const ts = parseDatePrefix(tok.value);
					return ts ? updatedAt >= ts : true;
				}
				case "updatedBefore": {
					const ts = parseDatePrefix(tok.value);
					return ts ? updatedAt < ts : true;
				}
				case "pinned":
					return tok.value ? noteIsPinned(note) : !noteIsPinned(note);
				default:
					return true;
			}
		});
	}

	function renderQueryResults(notes, parsed, hasStructured) {
		const panel = document.getElementById("psQueryResults");
		if (!panel) return;
		const hasTaskQuery = parsed.structured.some(
			(t) => t.type === "taskOpen" || t.type === "taskDone" || t.type === "hasTask"
		);
		if (!hasStructured || !hasTaskQuery || notes.length === 0) {
			panel.classList.add("hidden");
			panel.innerHTML = "";
			return;
		}
		const wantOpen = parsed.structured.some((t) => t.type === "taskOpen");
		const wantDone = parsed.structured.some((t) => t.type === "taskDone");
		const showBoth = !wantOpen && !wantDone;
		const items = [];
		for (const note of notes) {
			const text = String(note && note.text ? note.text : "");
			const tasks = extractNoteTasks(text);
			const title = getNoteTitle(text);
			const noteId = String(note && note.id ? note.id : "");
			if (wantOpen || showBoth) {
				for (const t of tasks.open) {
					items.push({ label: t, done: false, noteTitle: title, noteId });
				}
			}
			if (wantDone || showBoth) {
				for (const t of tasks.done) {
					items.push({ label: t, done: true, noteTitle: title, noteId });
				}
			}
		}
		if (items.length === 0) {
			panel.classList.add("hidden");
			panel.innerHTML = "";
			return;
		}
		const openCount = items.filter((i) => !i.done).length;
		const doneCount = items.filter((i) => i.done).length;
		const tagTokens = parsed.structured.filter((t) => t.type === "tag").map((t) => "#" + t.value);
		const tagLabel = tagTokens.length ? tagTokens.join(", ") : "";
		const headerParts = [];
		if (openCount > 0) headerParts.push(`${openCount} ` + t("query.open"));
		if (doneCount > 0) headerParts.push(`${doneCount} ` + t("query.done"));
		const countLabel = headerParts.join(", ");
		const fromLabel = t("query.from_notes").replace("{n}", String(notes.length));
		let html = '<div class="ps-query-header">';
		html += '<div class="ps-query-header-row">';
		html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ps-query-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';
		html += '<span class="ps-query-summary">' + countLabel;
		if (tagLabel) html += ' <span class="ps-query-tag">' + escapeHtml(tagLabel) + '</span>';
		html += ' <span class="ps-query-from">' + escapeHtml(fromLabel) + '</span>';
		html += '</span>';
		html += '</div></div>';
		html += '<ul class="ps-query-list">';
		for (const item of items) {
			const cls = item.done ? 'ps-query-item done' : 'ps-query-item';
			const check = item.done
				? '<svg viewBox="0 0 16 16" class="ps-query-check done"><rect x="1" y="1" width="14" height="14" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
				: '<svg viewBox="0 0 16 16" class="ps-query-check"><rect x="1" y="1" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
			html += '<li class="' + cls + '" data-query-note-id="' + escapeHtml(item.noteId) + '">';
			html += check;
			html += '<span class="ps-query-label">' + escapeHtml(item.label) + '</span>';
			html += '<span class="ps-query-note-ref" title="' + escapeHtml(item.noteTitle) + '">' + escapeHtml(item.noteTitle) + '</span>';
			html += '</li>';
		}
		html += '</ul>';
		panel.innerHTML = html;
		panel.classList.remove("hidden");
		panel.querySelectorAll("[data-query-note-id]").forEach((el) => {
			el.addEventListener("click", () => {
				const noteId = el.getAttribute("data-query-note-id") || "";
				if (!noteId) return;
				const note = findNoteById(noteId);
				if (note) {
					const allNotes = filterRealNotes(psState && psState.notes ? psState.notes : []);
					applyNoteToEditor(note, allNotes);
				}
			});
		});
	}

	function applyPersonalSpaceFiltersAndRender() {
		if (!psState || !psState.authed) return;
		const allNotes = filterRealNotes(psState.notes);
		const sortedAll = allNotes
			.map((n) => ensureNoteUpdatedAt(n))
			.slice()
			.sort((a, b) => {
				if (psSortMode === "text") {
					const aTitle = getNoteTitle(a && a.text ? a.text : "")
						.toLowerCase()
						.trim();
					const bTitle = getNoteTitle(b && b.text ? b.text : "")
						.toLowerCase()
						.trim();
					if (aTitle < bTitle) return -1;
					if (aTitle > bTitle) return 1;
				}
				const aTime =
					psSortMode === "created"
						? Number(a.createdAt || 0)
						: psSortMode === "accessed"
							? Number(psNoteAccessedById.get(String(a.id || "")) || 0)
							: Number(a.updatedAt || a.createdAt || 0);
				const bTime =
					psSortMode === "created"
						? Number(b.createdAt || 0)
						: psSortMode === "accessed"
							? Number(psNoteAccessedById.get(String(b.id || "")) || 0)
							: Number(b.updatedAt || b.createdAt || 0);
				if (bTime !== aTime) return bTime - aTime;
				const bFallback = Number(b.updatedAt || b.createdAt || 0);
				const aFallback = Number(a.updatedAt || a.createdAt || 0);
				return bFallback - aFallback;
			});
		let notes = sortedAll;
		if (psPinnedOnly) {
			notes = notes.filter((n) => noteIsPinned(n));
		}
		if (psCommentsOnly) {
			notes = notes.filter((n) =>
				psCommentedNoteIds.has(String(n && n.id ? n.id : "").trim())
			);
		}
		const active = Array.from(psActiveTags || []).filter(Boolean);
		if (active.length) {
			if (psTagFilterMode === "or") {
				notes = notes.filter((n) => {
					const tags = Array.isArray(n && n.tags) ? n.tags : [];
					return active.some((t) => tags.includes(t));
				});
			} else {
				notes = notes.filter((n) => {
					const tags = Array.isArray(n && n.tags) ? n.tags : [];
					return active.every((t) => tags.includes(t));
				});
			}
		}
		const q = normalizeSearchQuery(psSearchQuery);
		const parsed = parseQueryTokens(q);
		const hasStructured = parsed.structured.length > 0;
		if (parsed.structured.some((t) => t.type === "hasComment")) {
			// Force fresh reload every time has:comment is queried
			psCommentIndexPromise = null;
			psCommentIndexLoaded = false;
			loadPsCommentIndex().then(() => {
				// Check if Set changed – if so, re-filter the already-rendered list
				const currentIds = Array.from(psCommentedNoteIds).sort().join(',');
				if (currentIds !== (window._lastCommentIds || '')) {
					window._lastCommentIds = currentIds;
					const refiltered = notes.filter((n) => psCommentedNoteIds.has(String(n && n.id ? n.id : "").trim()));
					renderPsList(refiltered);
					if (psCount) {
						const total = filterRealNotes(psState.notes).length;
						psCount.textContent = `${refiltered.length}/${total}`;
					}
				}
			});
		}
		if (hasStructured) {
			notes = notes.filter((n) => noteMatchesStructuredQuery(n, parsed.structured));
		}
		if (parsed.plain.length > 0) {
			notes = notes.filter((n) => noteMatchesSearch(n, parsed.plain));
			/* sort by relevance: exact matches first, phonetic-only lower */
			const plain = parsed.plain;
			notes.sort((a, b) => noteSearchRelevance(b, plain) - noteSearchRelevance(a, plain));
		}
		if (psCount) {
			const total = allNotes.length;
			const shown = notes.length;
			const hasFilter =
				active.length > 0 || !!q || psPinnedOnly || psCommentsOnly;
			psCount.textContent = hasFilter ? `${shown}/${total}` : String(total);
		}
		renderPsTags(psState.tags || []);
		renderPsList(notes);
		renderQueryResults(notes, parsed, hasStructured);
		requestAnimationFrame(() => {
			syncPsListHeight();
		});
		updateEditorMetaYaml();
	}

	function loadPsTagsCollapsed() {
		try {
			psTagsCollapsed = localStorage.getItem(PS_TAGS_COLLAPSED_KEY) === "1";
		} catch {
			psTagsCollapsed = false;
		}
	}

	function savePsTagsCollapsed() {
		try {
			localStorage.setItem(PS_TAGS_COLLAPSED_KEY, psTagsCollapsed ? "1" : "0");
		} catch {
			// ignore
		}
	}

	function applyPsTagsCollapsed() {
		if (!psToggleTags) return;
		try {
			psToggleTags.setAttribute(
				"aria-expanded",
				psTagsCollapsed ? "false" : "true"
			);
		} catch {
			// ignore
		}
		const chev = psToggleTags.querySelector('[data-role="chevron"]');
		if (chev && chev.classList) {
			chev.classList.toggle("-rotate-90", psTagsCollapsed);
		}
		if (psTagControls && psTagControls.classList) {
			psTagControls.classList.toggle("hidden", psTagsCollapsed);
		}
		if (psTagsPanel && psTagsPanel.classList) {
			psTagsPanel.classList.toggle("hidden", psTagsCollapsed);
		}
		requestAnimationFrame(() => {
			syncPsListHeight();
		});
	}

	function loadPsTagPrefs() {
		try {
			const rawTags = localStorage.getItem(PS_ACTIVE_TAGS_KEY);
			if (rawTags) {
				const arr = JSON.parse(rawTags);
				if (Array.isArray(arr)) {
					psActiveTags = new Set(
						arr
							.map((t) => String(t || "").trim())
							.filter(Boolean)
							.slice(0, 12)
					);
				}
			}
		} catch {
			psActiveTags = new Set();
		}
		try {
			const m = String(localStorage.getItem(PS_TAG_FILTER_MODE_KEY) || "and")
				.trim()
				.toLowerCase();
			psTagFilterMode = m === "or" ? "or" : "and";
		} catch {
			psTagFilterMode = "and";
		}
		if (psTagFilterModeSelect) {
			psTagFilterModeSelect.value = psTagFilterMode;
		}
	}

	function savePsTagPrefs() {
		try {
			localStorage.setItem(
				PS_ACTIVE_TAGS_KEY,
				JSON.stringify(Array.from(psActiveTags || []).slice(0, 12))
			);
		} catch {
			// ignore
		}
		try {
			localStorage.setItem(PS_TAG_FILTER_MODE_KEY, psTagFilterMode);
		} catch {
			// ignore
		}
	}

	function escapeHtml(str) {
		return String(str || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	const PW_ICON_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
	const PW_ICON_UNLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';
	const PW_ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

	function renderPasswordToken(raw) {
		const value = String(raw || "");
		const escaped = escapeHtml(value);
		const dots = "•".repeat(Math.max(4, value.length));
		return `<span class="pw-field" data-pw="${escaped}"><span class="pw-mask" aria-hidden="true">${dots}</span><span class="pw-value">${escaped}</span><button type="button" class="pw-toggle" title="Anzeigen" aria-label="Passwort anzeigen">${PW_ICON_LOCK}</button><button type="button" class="pw-copy" title="Kopieren" aria-label="Passwort kopieren">${PW_ICON_COPY}</button></span>`;
	}

	async function copyTextToClipboard(value) {
		const text = String(value || "");
		if (!text) return false;
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// ignore
		}
		try {
			const ta = document.createElement("textarea");
			ta.value = text;
			ta.setAttribute("readonly", "");
			ta.style.position = "fixed";
			ta.style.opacity = "0";
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			ta.remove();
			return true;
		} catch {
			return false;
		}
	}

	function togglePasswordField(field, force) {
		if (!field || !field.classList) return false;
		const next =
			typeof force === "boolean"
				? force
				: !field.classList.contains("pw-revealed");
			field.classList.toggle("pw-revealed", next);
		const toggleBtn = field.querySelector
			? field.querySelector(".pw-toggle")
			: null;
		if (toggleBtn) {
			toggleBtn.setAttribute(
				"aria-label",
				next ? "Passwort verbergen" : "Passwort anzeigen"
			);
			toggleBtn.setAttribute("title", next ? "Verbergen" : "Anzeigen");
			toggleBtn.innerHTML = next ? PW_ICON_UNLOCK : PW_ICON_LOCK;
		}
		return next;
	}

	function loadCrdtMarksPreference() {
		try {
			const raw = String(localStorage.getItem(CRDT_MARKS_DISABLED_KEY) || "");
			crdtMarksEnabled = raw !== "1";
		} catch {
			crdtMarksEnabled = true;
		}
	}

	function loadCrdtMarksStyle() {
		try {
			const raw = String(localStorage.getItem(CRDT_MARKS_STYLE_KEY) || "").trim();
			if (raw === "overlay" || raw === "underline") {
				crdtMarksStyle = raw;
			} else {
				crdtMarksStyle = "underline";
			}
		} catch {
			crdtMarksStyle = "underline";
		}
	}

	function saveCrdtMarksPreference() {
		try {
			localStorage.setItem(
				CRDT_MARKS_DISABLED_KEY,
				crdtMarksEnabled ? "0" : "1"
			);
		} catch {
			// ignore
		}
	}

	function setCrdtMarksToggleUi() {
		if (!toggleCrdtMarksBtn) return;
		const enabled = crdtMarksEnabled;
		toggleCrdtMarksBtn.setAttribute(
			"aria-pressed",
			enabled ? "true" : "false"
		);
		toggleCrdtMarksBtn.setAttribute(
			"title",
			enabled ? "CRDT-Markierung ausblenden" : "CRDT-Markierung einblenden"
		);
		toggleCrdtMarksBtn.setAttribute(
			"aria-label",
			enabled ? "CRDT-Markierung ausblenden" : "CRDT-Markierung einblenden"
		);
		toggleCrdtMarksBtn.classList.toggle("text-fuchsia-200", enabled);
		toggleCrdtMarksBtn.classList.toggle("text-slate-400", !enabled);
	}

	function toggleCrdtMarks() {
		crdtMarksEnabled = !crdtMarksEnabled;
		saveCrdtMarksPreference();
		setCrdtMarksToggleUi();
		updateAttributionOverlay();
	}

	function getPreviewRunCombinedText(state) {
		const s = state || { output: "", error: "" };
		const out = s.output ? String(s.output) : "";
		const err = s.error ? String(s.error) : "";
		if (!err) return out;
		return out ? out + "\n" + err : err;
	}

	function updateRunOutputUi() {
		const src = String(
			previewRunState && previewRunState.source ? previewRunState.source : ""
		);
		const hasAiOutput =
			src === "ai" &&
			Boolean(
				String(
					previewRunState && previewRunState.output
						? previewRunState.output
						: ""
				).trim()
			);
		const hasAnyOutput = Boolean(
			String(
				previewRunState && previewRunState.output ? previewRunState.output : ""
			).trim()
		);
		const hasAnyError = Boolean(
			String(
				previewRunState && previewRunState.error ? previewRunState.error : ""
			).trim()
		);
		const hasAnyStatus = Boolean(
			String(
				previewRunState && previewRunState.status ? previewRunState.status : ""
			).trim()
		);
		const canClear = hasAnyOutput || hasAnyError || hasAnyStatus;
		if (runOutputBar && runOutputBar.classList) {
			runOutputBar.classList.toggle("hidden", !canClear);
		}
		if (runOutputTitleEl)
			runOutputTitleEl.textContent = hasAiOutput ? "AI Output" : "AI";
		if (applyOutputReplaceBtn && applyOutputReplaceBtn.classList) {
			applyOutputReplaceBtn.classList.toggle("hidden", !hasAiOutput);
		}
		if (applyOutputAppendBtn && applyOutputAppendBtn.classList) {
			applyOutputAppendBtn.classList.toggle("hidden", !hasAiOutput);
		}
		if (clearRunOutputBtn && clearRunOutputBtn.classList) {
			clearRunOutputBtn.classList.toggle("hidden", !canClear);
		}
	}

	function setRunOutputProcessing(active) {
		if (!runOutputIconEl || !runOutputIconEl.classList) return;
		runOutputIconEl.classList.toggle("is-processing", Boolean(active));
	}

	function updateRunOutputSizing() {
		if (!runOutputEl) return;
		// When the preview panel is closed/hidden, keep default sizing.
		if (
			!previewOpen ||
			!previewPanel ||
			(previewPanel.classList && previewPanel.classList.contains("hidden"))
		) {
			try {
				runOutputEl.style.maxHeight = "";
			} catch {
				// ignore
			}
			return;
		}

		const isAiImage = previewRunState && previewRunState.source === "ai-image";
		const basePx = isAiImage ? 480 : 160;
		let contentPx = 0;
		try {
			contentPx = Math.ceil(runOutputEl.scrollHeight || 0);
		} catch {
			contentPx = 0;
		}
		if (contentPx <= basePx) {
			try {
				runOutputEl.style.maxHeight = `${basePx}px`;
			} catch {
				// ignore
			}
			return;
		}

		let panelPx = 0;
		try {
			panelPx = Math.ceil(previewPanel.getBoundingClientRect().height || 0);
		} catch {
			panelPx = 0;
		}
		const winPx = Math.max(0, Math.floor(window.innerHeight || 0));
		const fraction = isAiImage ? 0.85 : 0.65;
		const fractionWin = isAiImage ? 0.85 : 0.7;
		const budgetPx = Math.floor(
			Math.min((panelPx || winPx) * fraction, winPx * fractionWin || 520)
		);
		const maxPx = Math.max(basePx, budgetPx || 520);
		const targetPx = Math.max(basePx, Math.min(maxPx, contentPx));
		try {
			runOutputEl.style.maxHeight = `${targetPx}px`;
		} catch {
			// ignore
		}
	}

	function setPreviewRunOutput(state) {
		const next = state || { status: "", output: "", error: "" };
		const status = String(next.status || "");
		const explicitSource = String(next.source || "")
			.trim()
			.toLowerCase();
		const inferredSource = explicitSource
			? explicitSource
			: /^(ai\b|ai\s*\(|ai\s*error)/i.test(status)
			? "ai"
			: /^(running|done|error)/i.test(status)
			? "run"
			: "";
		previewRunState = {
			status,
			output: next.output ? String(next.output) : "",
			error: next.error ? String(next.error) : "",
			source: inferredSource,
		};
		if (runStatusEl) runStatusEl.textContent = previewRunState.status || "";
		if (!runOutputEl) return;
		const combined = getPreviewRunCombinedText(previewRunState);
		runOutputEl.innerHTML = escapeHtml(combined);
		updateRunOutputUi();
		updateRunOutputSizing();
	}

	function parseRunnableFromEditor() {
		const text = String(textarea && textarea.value ? textarea.value : "");
		if (!text.trim()) return null;

		// Prefer Personal Space context when editing a code note
		if (psEditingNoteKind === "code") {
			const langTag = (psEditingNoteTags || []).find((t) =>
				/^lang-[a-z0-9_+-]{1,32}$/i.test(String(t || ""))
			);
			const lang = langTag ? String(langTag).slice(5).toLowerCase() : "";
			return { lang, code: text };
		}

		// Fallback: first fenced code block
		const m = text.match(/```([a-z0-9_+-]{0,32})\n([\s\S]*?)\n```/i);
		if (m) {
			const lang = String(m[1] || "").toLowerCase();
			const code = String(m[2] || "");
			return { lang, code };
		}

		// Last resort: run whole editor as code if a language is selected
		const selected = String(
			codeLangSelect && codeLangSelect.value ? codeLangSelect.value : ""
		)
			.trim()
			.toLowerCase();
		if (selected) return { lang: selected, code: text };
		return null;
	}

	function getSelectedCodeLang() {
		const v = String(
			codeLangSelect && codeLangSelect.value ? codeLangSelect.value : ""
		)
			.trim()
			.toLowerCase();
		return v || "python";
	}

	function getFencedCodeOpenAtPos(text, pos) {
		const src = String(text || "");
		const p = Math.max(0, Math.min(src.length, Number(pos) || 0));
		let inside = false;
		let open = null;
		let idx = 0;
		while (idx <= src.length) {
			const lineStart = idx;
			let lineEnd = src.indexOf("\n", idx);
			if (lineEnd === -1) lineEnd = src.length;
			// Include the line that contains the caret (so the opening fence line works too).
			if (lineStart > p) break;
			const line = src.slice(lineStart, lineEnd);
			const m = line.match(/^\s*```\s*([a-z0-9_+\-]{0,32})\s*$/i);
			if (m) {
				if (!inside) {
					inside = true;
					open = {
						lineStart,
						lineEnd,
						lang: String(m[1] || "").toLowerCase(),
					};
				} else {
					inside = false;
					open = null;
				}
			}
			idx = lineEnd + 1;
			if (idx > src.length) break;
		}
		return inside && open ? open : null;
	}

	function setFencedCodeLanguage(newLang) {
		if (!textarea) return false;
		const src = String(textarea.value || "");
		const caret = Number(textarea.selectionEnd || 0);
		const open = getFencedCodeOpenAtPos(src, caret);
		if (!open) return false;
		const lang = String(newLang || "")
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9_+\-]/g, "")
			.slice(0, 32);
		const oldLine = src.slice(open.lineStart, open.lineEnd);
		const prefixMatch = oldLine.match(/^(\s*)```/);
		const prefix = prefixMatch ? prefixMatch[1] : "";
		const nextLine = prefix + "```" + (lang ? lang : "");
		if (nextLine === oldLine) return true;
		const delta = nextLine.length - oldLine.length;
		const startSel = Number(textarea.selectionStart || 0);
		const endSel = Number(textarea.selectionEnd || 0);
		textarea.value =
			src.slice(0, open.lineStart) + nextLine + src.slice(open.lineEnd);
		try {
			const bump = (n) => (n > open.lineEnd ? n + delta : n);
			textarea.setSelectionRange(bump(startSel), bump(endSel));
		} catch {
			// ignore
		}
		updatePreview();
		scheduleSend();
		return true;
	}

	function updateCodeLangOverlay() {
		if (!textarea || !codeLangWrap || !codeLangSelect) return;
		const open = getFencedCodeOpenAtPos(
			String(textarea.value || ""),
			Number(textarea.selectionEnd || 0)
		);
		const show = Boolean(open);
		if (document.body && document.body.classList) {
			document.body.classList.toggle("code-lang-active", show);
		}
		if (codeLangWrap.classList) codeLangWrap.classList.toggle("hidden", !show);
		if (psMetaToggle && psMetaToggle.classList) {
			psMetaToggle.classList.toggle("hidden", show);
		}
		if (psMetaYaml && psMetaYaml.classList) {
			psMetaYaml.classList.toggle("hidden", show || !psMetaVisible);
			if (show || !psMetaVisible) {
				resetEditorMetaPadding();
			} else {
				updateEditorMetaPadding();
				updateEditorMetaScroll();
			}
		}
		if (show && open && open.lang) {
			try {
				codeLangSelect.value = String(open.lang);
			} catch {
				// ignore
			}
		}
	}

	function insertCodeBlock() {
		if (!textarea) return;
		const lang = getSelectedCodeLang();
		const start = textarea.selectionStart || 0;
		const end = textarea.selectionEnd || 0;
		const full = String(textarea.value || "");
		const selected = full.slice(start, end);
		const fenceStart = "```" + lang + "\n";
		const fenceEnd = "\n```";
		const insert = fenceStart + (selected || "") + fenceEnd;
		textarea.value = full.slice(0, start) + insert + full.slice(end);
		// Cursor inside block
		try {
			const cursor = start + fenceStart.length;
			textarea.focus();
			textarea.setSelectionRange(cursor, cursor + (selected || "").length);
		} catch {
			// ignore
		}
		metaLeft.textContent = "Inserted code block.";
		metaRight.textContent = nowIso();
		updatePreview();
		updateCodeLangOverlay();
		scheduleSend();
	}

	function ensureMarkdown() {
		if (md) return md;
		if (typeof window.markdownit !== "function") return null;
		try {
			const safeLang = (raw) =>
				String(raw || "")
					.trim()
					.toLowerCase()
					.replace(/[^a-z0-9_+-]/g, "")
					.slice(0, 32);
			const highlightPlain = (str) => {
				const escaped = md.utils.escapeHtml(str);
				return `<pre class="hljs"><code>${escaped}</code></pre>`;
			};

			md = window.markdownit({
				html: false,
				linkify: true,
				breaks: true,
				typographer: true,
				highlight: (str, lang) => {
					const canHighlight =
						window.hljs && typeof window.hljs.highlight === "function";
					if (!canHighlight) return highlightPlain(str);
					try {
						const l = safeLang(lang);
						if (l && window.hljs.getLanguage && window.hljs.getLanguage(l)) {
							const v = window.hljs.highlight(str, {
								language: l,
								ignoreIllegals: true,
							}).value;
							return `<pre class="hljs"><code class="hljs language-${l}">${v}</code></pre>`;
						}
						const v =
							window.hljs && typeof window.hljs.highlightAuto === "function"
								? window.hljs.highlightAuto(str).value
								: md.utils.escapeHtml(str);
						return `<pre class="hljs"><code class="hljs">${v}</code></pre>`;
					} catch {
						return highlightPlain(str);
					}
				},
			});
			// Nur sichere Link-Protokolle (kein javascript:, data:, etc.)
			try {
				md.validateLink = (url) => {
					const raw = String(url || "").trim();
					if (!raw) return false;
					if (/^(https?:|mailto:|tel:|note:)/i.test(raw)) return true;
					if (raw.startsWith("/") || raw.startsWith("./") || raw.startsWith("../"))
						return true;
					if (raw.startsWith("#")) return true;
					return false;
				};
			} catch {
				// ignore
			}
			// GFM bits
			try {
				md.enable(["table", "strikethrough"]);
			} catch {
				// ignore
			}
			if (typeof window.markdownitTaskLists === "function") {
				md.use(window.markdownitTaskLists, {
					enabled: true,
					label: true,
					labelAfter: true,
				});
			}
			// Inline Passwords: ||secret|| -> masked token
			// Patch: markdown-it's built-in text rule does not treat | (0x7C) as
			// a terminator character, so the text scanner consumes ||...|| as
			// plain text before our password tokenizer can see it.  We replace the
			// text rule with a version that also terminates on |.
			try {
				const isTerminatorOrPipe = (ch) => {
					if (ch === 0x7C) return true; // |
					switch (ch) {
						case 0x0A: case 0x21: case 0x23: case 0x24: case 0x25:
						case 0x26: case 0x2A: case 0x2B: case 0x2D: case 0x3A:
						case 0x3C: case 0x3D: case 0x40: case 0x5B: case 0x5C:
						case 0x5D: case 0x5E: case 0x5F: case 0x60: case 0x7B:
						case 0x7D: case 0x7E: return true;
						default: return false;
					}
				};
				md.inline.ruler.at("text", function textWithPipe(state, silent) {
					let pos = state.pos;
					while (pos < state.posMax && !isTerminatorOrPipe(state.src.charCodeAt(pos))) {
						pos++;
					}
					if (pos === state.pos) return false;
					if (!silent) state.pending += state.src.slice(state.pos, pos);
					state.pos = pos;
					return true;
				});

				const tokenizePassword = (state, silent) => {
					const start = state.pos;
					if (state.src.charCodeAt(start) !== 124) return false;
					if (state.src.charCodeAt(start + 1) !== 124) return false;
					let pos = start + 2;
					const max = state.posMax;
					while (pos < max - 1) {
						if (
							state.src.charCodeAt(pos) === 124 &&
							state.src.charCodeAt(pos + 1) === 124
						) {
							break;
						}
						pos += 1;
					}
					if (pos >= max - 1) return false;
					const content = state.src.slice(start + 2, pos);
					if (!content) return false;
					if (!silent) {
						const token = state.push("password", "", 0);
						token.content = content;
					}
					state.pos = pos + 2;
					return true;
				};
				md.inline.ruler.before("emphasis", "password", tokenizePassword);
				md.renderer.rules.password = (tokens, idx) =>
					renderPasswordToken(tokens[idx].content || "");
			} catch {
				// ignore
			}
			// Links in neuer Tab + sicher
			const defaultRender =
				md.renderer.rules.link_open ||
				function (tokens, idx, options, env, self) {
					return self.renderToken(tokens, idx, options);
				};
			md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
				const token = tokens[idx];
				const setAttr = (name, value) => {
					const i = token.attrIndex(name);
					if (i < 0) token.attrPush([name, value]);
					else token.attrs[i][1] = value;
				};
				setAttr("target", "_blank");
				setAttr("rel", "noopener noreferrer");
				return defaultRender(tokens, idx, options, env, self);
			};
			return md;
		} catch {
			md = null;
			return null;
		}
	}

	function applyHljsToHtml(html) {
		try {
			if (!window.hljs || typeof window.hljs.highlightElement !== "function") {
				return html;
			}
			const container = document.createElement("div");
			container.innerHTML = html;
			container.querySelectorAll("pre code").forEach((codeEl) => {
				try {
					// Escape raw HTML inside <code> to prevent hljs security warnings
					if (!codeEl.dataset.highlighted) {
						codeEl.textContent = codeEl.textContent;
					}
					window.hljs.highlightElement(codeEl);
				} catch {
					// ignore
				}
			});
			return container.innerHTML;
		} catch {
			return html;
		}
	}

	function embedPdfLinks(html) {
		try {
			const container = document.createElement("div");
			container.innerHTML = String(html || "");
			const links = container.querySelectorAll("a[href]");
			links.forEach((link) => {
				const href = String(link.getAttribute("href") || "").trim();
				if (!href) return;
				const lower = href.toLowerCase();
				if (!lower.includes(".pdf")) return;
				let resolved = href;
				try {
					if (typeof location !== "undefined" && location.origin) {
						resolved = new URL(href, location.origin).href;
					}
				} catch {
					resolved = href;
				}
				const wrapper = document.createElement("div");
				wrapper.className = "pdf-embed";
				wrapper.setAttribute("data-pdf-src", resolved);
				wrapper.setAttribute("data-pdf-page", "1");
				const toolbar = document.createElement("div");
				toolbar.className = "pdf-toolbar";
				const nav = document.createElement("div");
				nav.className = "pdf-nav";
				const prev = document.createElement("button");
				prev.type = "button";
				prev.className = "pdf-nav-btn";
				prev.setAttribute("data-pdf-prev", "true");
				prev.textContent = "‹";
				const pageLabel = document.createElement("span");
				pageLabel.className = "pdf-page-label";
				pageLabel.setAttribute("data-pdf-page-label", "true");
				pageLabel.textContent = "Seite 1";
				const next = document.createElement("button");
				next.type = "button";
				next.className = "pdf-nav-btn";
				next.setAttribute("data-pdf-next", "true");
				next.textContent = "›";
				nav.appendChild(prev);
				nav.appendChild(pageLabel);
				nav.appendChild(next);
				const canvas = document.createElement("canvas");
				canvas.className = "pdf-frame";
				canvas.setAttribute("data-pdf-src", href);
				const actions = document.createElement("div");
				actions.className = "pdf-actions";
				const open = document.createElement("a");
				open.href = resolved;
				open.target = "_blank";
				open.rel = "noopener noreferrer";
				open.textContent = "Open PDF";
				actions.appendChild(open);
				toolbar.appendChild(nav);
				toolbar.appendChild(actions);
				wrapper.appendChild(toolbar);
				wrapper.appendChild(canvas);
				link.replaceWith(wrapper);
			});
			return container.innerHTML;
		} catch {
			return html;
		}
	}

	function buildNoteTitleIndex() {
		const notes = psState && Array.isArray(psState.notes) ? psState.notes : [];
		const sorted = notes
			.slice()
			.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
		const index = new Map();
		for (const note of sorted) {
			const title = getNoteTitle(note && note.text ? note.text : "");
			const key = String(title || "").toLowerCase();
			if (!key || index.has(key)) continue;
			index.set(key, {
				id: String(note && note.id ? note.id : ""),
				title,
			});
		}
		return index;
	}

	function applyWikiLinksToMarkdown(src) {
		const text = String(src || "");
		if (!text.includes("[[")) return text;
		const index = buildNoteTitleIndex();
		return text.replace(/\[\[([^\[\]\n]+)\]\]/g, (raw, inner) => {
			const label = String(inner || "").trim();
			if (!label) return raw;
			const key = label.toLowerCase();
			const match = index.get(key);
			const target = match && match.id ? match.id : label;
			return `[${label}](note:${encodeURIComponent(target)})`;
		});
	}

	function renderNoteHtml(note) {
		const renderer = ensureMarkdown();
		const text = String((note && note.text) || "");
		const kind = String((note && note.kind) || "");
		const tags = Array.isArray(note && note.tags) ? note.tags : [];
		if (!renderer) {
			if (!mdLibWarned) {
				mdLibWarned = true;
				toast("Markdown rendering: libraries not loaded (CDN).", "error");
			}
			const body = text
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");
			return `<pre class="mt-2 whitespace-pre-wrap break-words text-sm text-slate-100">${body}</pre>`;
		}
		let src = text;
		const hasMdLink = /!?\[[^\]]+\]\([^)]+\)/.test(text);
		if (kind === "code" && !/```/.test(text) && !hasMdLink) {
			const langTag = tags.find((t) =>
				/^lang-[a-z0-9_+-]{1,32}$/i.test(String(t || ""))
			);
			const lang = langTag ? String(langTag).slice(5) : "";
			src = `\n\n\`\`\`${lang}\n${text}\n\`\`\`\n`;
		}
		src = applyWikiLinksToMarkdown(src);
		try {
			const rendered = renderer.render(src);
			return `<div class="md-content mt-2">${applyHljsToHtml(rendered)}</div>`;
		} catch {
			const body = text
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");
			return `<pre class="mt-2 whitespace-pre-wrap break-words text-sm text-slate-100">${body}</pre>`;
		}
	}

	function setFullPreview(next) {
		const shouldEnable = Boolean(next) && previewOpen;
		fullPreview = shouldEnable;
		if (document.body && document.body.classList) {
			document.body.classList.toggle("preview-only", fullPreview);
		}
		if (toggleFullPreview) {
			toggleFullPreview.textContent = fullPreview
				? t("preview.show_input")
				: t("preview.full");
			toggleFullPreview.setAttribute(
				"aria-pressed",
				fullPreview ? "true" : "false"
			);
		}
		updateRunOutputSizing();
	}

	function setPreviewVisible(next) {
		const wasPreviewOpen = previewOpen;
		previewOpen = Boolean(next);
		if (!previewPanel || !editorPreviewGrid) return;
		previewPanel.classList.toggle("hidden", !previewOpen);
		editorPreviewGrid.className = previewOpen
			? "grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-2"
			: "grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-1";
		if (togglePreview) {
			togglePreview.textContent = previewOpen ? "Hide preview" : "Preview";
		}
		if (previewOpen) {
			const renderer = ensureMarkdown();
			if (!renderer) {
				toast("Markdown preview: library not loaded (CDN).", "error");
			}
			updatePreview();
			window.setTimeout(() => {
				updateRunOutputUi();
				updateRunOutputSizing();
			}, 0);
		} else {
			// Reset status when preview is hidden.
			previewMsgToken = "";
			if (metaLeft) metaLeft.textContent = "Ready.";
			if (metaRight) metaRight.textContent = "";
		}
		if (!previewOpen && wasPreviewOpen) {
			// Auto-sort is handled on preview interaction with delay.
		}
		setFullPreview(fullPreview);
		syncMobileFocusState();
	}

	function buildPreviewContentHtml(srcRaw) {
		const renderer = ensureMarkdown();
		if (!renderer) return "";
		const src = applyWikiLinksToMarkdown(String(srcRaw || ""));
		let bodyHtml = "";
		const taskScopeKey = buildTaskScopeKey(getActiveRoomTabNoteId());
		try {
			bodyHtml = embedPdfLinks(applyHljsToHtml(renderer.render(src)));
			bodyHtml = applyTaskClosedTimestampsToHtml(
				bodyHtml,
				String(srcRaw || ""),
				taskScopeKey
			);
		} catch {
			bodyHtml = "";
		}
		const metaNote = psEditingNoteId ? findNoteById(psEditingNoteId) : null;
		const metaYaml =
			psMetaVisible && metaNote ? buildNoteMetaYaml(metaNote) : "";
		const metaHtml = metaYaml
			? `<pre class="meta-yaml">${escapeHtml(metaYaml)}</pre>`
			: "";
		return `${metaHtml}${bodyHtml}`;
	}

	function sendPreviewContentUpdate(html) {
		if (!mdPreview || !previewMsgToken) return false;
		try {
			const win = mdPreview.contentWindow || null;
			if (!win) return false;
			win.postMessage(
				{
					type: "mirror_preview_update",
					token: previewMsgToken,
					html: String(html || ""),
				},
				"*"
			);
			return true;
		} catch {
			return false;
		}
	}

	function updatePreview() {
		if (!previewOpen || !mdPreview) return;
		const isMonoLight = activeTheme === "monoLight";
		const isMonoDark = activeTheme === "monoDark";
		const isMonoTheme = isMonoLight || isMonoDark;
		const themeColors = THEMES[activeTheme] || THEMES.fuchsia || {};
		const nonMonoScrollbarThumb =
			toAlphaColor(themeColors.accentTextSoft, 0.1) ||
			toAlphaColor(themeColors.accentText, 0.1) ||
			"rgba(103, 232, 249, 0.1)";
		const renderer = ensureMarkdown();
		const stamp = Date.now();
		if (!renderer) {
			const fallbackColorScheme = isMonoLight ? "light" : "dark";
			const fallbackBg = isMonoLight
				? "#f8fafc"
				: isMonoDark
					? "#0d1117"
					: "#111827";
			const fallbackText = isMonoLight ? "#0f172a" : "#e2e8f0";
			const fallbackLink = isMonoLight ? "#2563eb" : "#60a5fa";
			const fallbackScrollThumb = isMonoTheme
				? isMonoLight
					? "rgba(100,116,139,.35)"
					: "rgba(148,163,184,.3)"
				: nonMonoScrollbarThumb;
			const fallbackScrollThumbHover = isMonoTheme
				? isMonoLight
					? "rgba(100,116,139,.5)"
					: "rgba(148,163,184,.45)"
				: nonMonoScrollbarThumb;
			const fallbackScrollBorder = isMonoTheme
				? isMonoLight
					? "rgba(241,245,249,.9)"
					: "rgba(2,6,23,.35)"
				: "rgba(2,6,23,.1)";
			const fallbackDoc = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<style>:root{color-scheme:${fallbackColorScheme};--scrollbar-thumb:${fallbackScrollThumb};--scrollbar-thumb-hover:${fallbackScrollThumbHover};}body{margin:0;padding:16px;font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,Noto Sans,sans-serif;background:${fallbackBg};color:${fallbackText};overflow-x:hidden;scrollbar-gutter:stable;}a{color:${fallbackLink};}*{scrollbar-width:thin;scrollbar-color:transparent transparent;}*::-webkit-scrollbar{width:10px;height:10px;}*::-webkit-scrollbar-track{background:transparent;}*::-webkit-scrollbar-thumb{background-color:transparent;border-radius:999px;border:2px solid transparent;transition:background-color 90ms ease,border-color 90ms ease;}body.scrollbar-active{scrollbar-color:var(--scrollbar-thumb) transparent;}body.scrollbar-active *::-webkit-scrollbar-thumb{background-color:var(--scrollbar-thumb);border-color:${fallbackScrollBorder};}body.scrollbar-active *::-webkit-scrollbar-thumb:hover{background-color:var(--scrollbar-thumb-hover);}</style>
				</head><body>
				<script>(function(){var body=document.body;if(!body)return;var hideTimer=null;function show(){body.classList.add('scrollbar-active');if(hideTimer)clearTimeout(hideTimer);hideTimer=setTimeout(function(){body.classList.remove('scrollbar-active');},800);}['scroll','wheel','touchmove'].forEach(function(evt){window.addEventListener(evt,show,{passive:true});});window.addEventListener('keydown',function(e){if(e && (e.key==='PageDown'||e.key==='PageUp'||e.key==='End'||e.key==='Home')){show();}});})();</script><!--ts:${stamp}--><strong>Markdown preview unavailable.</strong><div style="margin-top:8px;color:#94a3b8">Reload the page or check for CDN blocking (AdBlock / corporate proxy).</div></body></html>`;
			setPreviewDocument(fallbackDoc);
			return;
		}
		const srcRaw = String(textarea && textarea.value ? textarea.value : "");
		const src = applyWikiLinksToMarkdown(srcRaw);
		let bodyHtml = "";
		const taskScopeKey = buildTaskScopeKey(getActiveRoomTabNoteId());
		try {
			bodyHtml = embedPdfLinks(applyHljsToHtml(renderer.render(src)));
			bodyHtml = applyTaskClosedTimestampsToHtml(
				bodyHtml,
				srcRaw,
				taskScopeKey
			);
		} catch {
			bodyHtml = "";
		}
		const blockquoteBorder =
			themeColors.blockquoteBorder ||
			themeColors.accentBorderStrong ||
			themeColors.accentBorder ||
			"rgba(217,70,239,.45)";
		const blockquoteText =
			themeColors.blockquoteText ||
			themeColors.accentTextSoft ||
			"rgba(203,213,225,1)";
		const scrollbarThumb = isMonoTheme
			? themeColors.scrollbarThumb ||
				themeColors.accentTextSoft ||
				"rgba(148,163,184,.3)"
			: nonMonoScrollbarThumb;
		const scrollbarThumbHover = isMonoTheme
			? themeColors.scrollbarThumbHover ||
				themeColors.accentText ||
				"rgba(148,163,184,.45)"
			: nonMonoScrollbarThumb;
		const isLightSyntax =
			activeTheme === "monoLight" ||
			activeTheme === "coffeeLight" ||
			activeTheme === "bitterLight";
		const previewColorScheme = isLightSyntax ? "light" : "dark";
		const previewBg =
			themeColors.previewBg ||
			(isMonoLight ? "#f8fafc" : isMonoDark ? "#0d1117" : "rgba(2, 6, 23, 0.4)");
		const previewText =
			themeColors.previewText || (isMonoLight ? "#0f172a" : "#e2e8f0");
		const previewLink =
			themeColors.previewLink || (isMonoLight ? "#2563eb" : "#60a5fa");
		const previewPreColors = getPreviewPreColors(activeTheme, {
			isLightSyntax,
			previewText,
		});
		const previewPreBg = previewPreColors.preBg;
		const previewPreBorder = previewPreColors.preBorder;
		const previewPreText = previewPreColors.preText;
		const previewCodeBg = previewPreColors.codeBg;
		const previewFieldColors = getPreviewFieldColors(activeTheme, { isLightSyntax });
		const previewFieldBg = previewFieldColors.fieldBg;
		const previewFieldBorder = previewFieldColors.fieldBorder;
		const previewFieldText = previewFieldColors.fieldText;
		const previewValueText = previewFieldColors.valueText;
		const previewMetaBg =
			themeColors.previewMetaBg ||
			(isMonoLight ? "rgba(15,23,42,.04)" : "rgba(15,23,42,.55)");
		const previewMetaBorder =
			themeColors.previewMetaBorder ||
			(isMonoLight ? "rgba(15,23,42,.12)" : "rgba(148,163,184,.18)");
		const previewMetaText =
			themeColors.previewMetaText ||
			(isMonoLight ? "rgba(71,85,105,.9)" : "rgba(148,163,184,.9)");
		const previewAccentStrong =
			themeColors.accentStrong || themeColors.accentBg || previewLink;
		const previewAccentText = themeColors.accentText || previewText;
		const previewAccentTextSoft =
			themeColors.accentTextSoft || previewMetaText;
		const previewTaskClosedText = previewMetaText;
		const tocBg = themeColors.tocBg || previewBg;
		const tocBorder =
			themeColors.tocBorder ||
			(isMonoLight ? "rgba(15,23,42,.12)" : "rgba(148,163,184,.18)");
		const tocText =
			themeColors.tocText ||
			(isMonoLight ? "rgba(15,23,42,.95)" : "rgba(226,232,240,.95)");
		const tocMuted =
			themeColors.tocMuted ||
			(isMonoLight ? "rgba(71,85,105,.85)" : "rgba(148,163,184,.8)");
		const tocHover =
			themeColors.tocHover ||
			(isMonoLight ? "rgba(15,23,42,.06)" : "rgba(148,163,184,.14)");
		const tocRing =
			themeColors.accentRing || "rgba(217,70,239,.25)";
		const tocShadow =
			themeColors.tocShadow ||
			(isMonoLight
				? "0 6px 14px rgba(27,31,36,.08)"
				: "0 12px 26px rgba(0,0,0,.45)");
		const previewTableBorder = isMonoLight
			? "rgba(15,23,42,.12)"
			: "rgba(255,255,255,.12)";
		const previewScrollBorder = isMonoTheme
			? isMonoLight
				? "rgba(241,245,249,.9)"
				: "rgba(2,6,23,.35)"
			: "rgba(2,6,23,.1)";
		const highlightCssUrl = isLightSyntax
			? "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css"
			: "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css";
		const highlightThemeCss = buildPreviewHighlightCss(activeTheme);

		function getPreviewFieldColors(theme, opts) {
			const lightDefaults = {
				fieldBg: "rgba(15,23,42,.06)",
				fieldBorder: "rgba(15,23,42,.12)",
				fieldText: "rgba(15,23,42,.9)",
				valueText: "rgba(15,23,42,.95)",
			};
			const darkDefaults = {
				fieldBg: "rgba(15,23,42,.6)",
				fieldBorder: "rgba(255,255,255,.12)",
				fieldText: "rgba(226,232,240,.9)",
				valueText: "rgba(226,232,240,.95)",
			};
			const base = opts.isLightSyntax ? lightDefaults : darkDefaults;
			switch (theme) {
				case "coffeeLight":
					return { ...base, fieldBg: "#f3e9df", fieldBorder: "#d9c7bc", fieldText: "#5b4436", valueText: "#3b2a21" };
				case "coffeeDark":
					return { ...base, fieldBg: "#1c1511", fieldBorder: "#35261e", fieldText: "#c7ae9d", valueText: "#e8d9cc" };
				case "bitterLight":
					return { ...base, fieldBg: "#f0eeeb", fieldBorder: "#d8d2cb", fieldText: "#2a292f", valueText: "#0d0c10" };
				case "bitterDark":
					return { ...base, fieldBg: "#0d0c10", fieldBorder: "#2a2a30", fieldText: "#c0b5ad", valueText: "#f0e8df" };
				case "monoLight":
					return { ...base, fieldBg: "#f6f8fa", fieldBorder: "#d0d7de", fieldText: "#57606a", valueText: "#24292f" };
				case "monoDark":
					return { ...base, fieldBg: "#0d1117", fieldBorder: "#30363d", fieldText: "#8b949e", valueText: "#c9d1d9" };
				default:
					return base;
			}
		}

		function getPreviewPreColors(theme, opts) {
			const lightDefaults = {
				preBg: "rgba(15,23,42,.04)",
				preBorder: "rgba(15,23,42,.1)",
				preText: opts.previewText || "#0f172a",
				codeBg: "rgba(15,23,42,.06)",
			};
			const darkDefaults = {
				preBg: "rgba(2,6,23,.6)",
				preBorder: "rgba(255,255,255,.08)",
				preText: opts.previewText || "#e2e8f0",
				codeBg: "rgba(255,255,255,.06)",
			};
			const base = opts.isLightSyntax ? lightDefaults : darkDefaults;
			switch (theme) {
				case "coffeeLight":
					return {
						...base,
						preBg: "#f8f1e9",
						preBorder: "#f8f1e9",
						preText: "#3b2a21",
						codeBg: "#f0e3d8",
					};
				case "bitterLight":
					return {
						...base,
						preBg: "#f7f6f4",
						preBorder: "#f7f6f4",
						preText: "#0d0c10",
						codeBg: "#ebe9e6",
					};
				case "bitterDark":
					return {
						...base,
						preBg: "#0d0c10",
						preBorder: "#2a2a30",
						preText: "#f0e8df",
						codeBg: "rgba(255,210,194,.1)",
					};
				default:
					return base;
			}
		}

		function buildPreviewHighlightCss(theme) {
			switch (theme) {
				case "coffeeLight":
					return `
					pre.hljs{background:#f8f1e9;border-color:#f8f1e9;color:#3b2a21;}
					pre.hljs code.hljs, code.hljs{color:#3b2a21;}
					.hljs-keyword,.hljs-selector-tag,.hljs-title{color:#b07049;}
					.hljs-string,.hljs-attr,.hljs-number{color:#5b3a28;}
					.hljs-comment,.hljs-quote{color:rgba(59,42,33,.6);}
					`;
				case "bitterLight":
					return `
					pre.hljs{background:#f7f6f4;border-color:#f7f6f4;color:#0d0c10;}
					pre.hljs code.hljs, code.hljs{color:#0d0c10;}
					.hljs-keyword,.hljs-selector-tag,.hljs-title{color:#ff2301;}
					.hljs-string,.hljs-attr,.hljs-number{color:#7a4c35;}
					.hljs-comment,.hljs-quote{color:rgba(13,12,16,.55);}
					`;
				case "bitterDark":
					return `
					pre.hljs{background:#0d0c10;border-color:#2a2a30;color:#f0e8df;}
					pre.hljs code.hljs, code.hljs{color:#f0e8df;}
					.hljs-keyword,.hljs-selector-tag,.hljs-title{color:#ff2301;}
					.hljs-string,.hljs-attr,.hljs-number{color:#ffb199;}
					.hljs-comment,.hljs-quote{color:rgba(240,232,223,.55);}
					`;
				default:
					return "";
			}
		}
		const pdfJsUrl = "/vendor/pdfjs/pdf.mjs";
		const pdfWorkerUrl = "/vendor/pdfjs/pdf.worker.mjs";
		const previewBase =
			typeof location !== "undefined" && location.origin
				? location.origin
				: "";
		const metaNote = psEditingNoteId ? findNoteById(psEditingNoteId) : null;
		const metaYaml =
			psMetaVisible && metaNote ? buildNoteMetaYaml(metaNote) : "";
		const metaHtml = metaYaml
			? `<pre class="meta-yaml">${escapeHtml(metaYaml)}</pre>`
			: "";
		if (bodyHtml && bodyHtml.includes("pdf-embed")) {
			ensurePdfJsLoaded();
		}

		// Token pro Preview-Render: erlaubt sichere postMessage-Validierung auch bei sandbox/null origin.
		try {
			previewMsgToken =
				typeof crypto !== "undefined" && crypto.randomUUID
					? crypto.randomUUID()
					: `t_${stamp}_${Math.random().toString(16).slice(2)}`;
		} catch {
			previewMsgToken = `t_${stamp}_${Math.random().toString(16).slice(2)}`;
		}
		const tokenJs = JSON.stringify(previewMsgToken);

		const doc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
	${previewBase ? `<base href="${previewBase}">` : ""}
	<script>
		try {
			if (!window.pdfjsLib && parent && parent.pdfjsLib) {
				window.pdfjsLib = parent.pdfjsLib;
			}
			if (!window.__pdfjsReady && parent && parent.__pdfjsReady) {
				window.__pdfjsReady = parent.__pdfjsReady;
			}
		} catch (e) {
			// ignore
		}
	</script>
  <link rel="stylesheet" href="${highlightCssUrl}">
	<!--ts:${stamp}-->
  <style>
		:root{color-scheme:${previewColorScheme};--blockquote-border:${blockquoteBorder};--blockquote-text:${blockquoteText};--scrollbar-thumb:${scrollbarThumb};--scrollbar-thumb-hover:${scrollbarThumbHover};--toc-bg:${tocBg};--toc-border:${tocBorder};--toc-text:${tocText};--toc-muted:${tocMuted};--toc-hover:${tocHover};--toc-ring:${tocRing};--toc-accent:${previewLink};--toc-shadow:${tocShadow};--accent-strong:${previewAccentStrong};--accent-text:${previewAccentText};--accent-text-soft:${previewAccentTextSoft};--task-closed-text:${previewTaskClosedText};}
	body{margin:0;padding:16px;font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,Noto Sans,sans-serif;background:${previewBg};color:${previewText};overflow-x:hidden;scrollbar-gutter:stable;}
    a{color:${previewLink};}
		img{max-width:100%;height:auto;}
		.img-wrap{position:relative;display:inline-block;max-width:100%;}
		.img-tools{position:absolute;top:8px;right:8px;display:inline-flex;gap:6px;align-items:center;padding:4px 6px;border-radius:999px;background:rgba(2,6,23,.55);border:1px solid rgba(148,163,184,.25);opacity:0;transition:opacity .16s ease;}
		.img-wrap:hover .img-tools{opacity:1;}
		.img-tools button{border:0;background:rgba(148,163,184,.15);color:${previewText};font-size:11px;line-height:1;padding:4px 6px;border-radius:999px;cursor:pointer;}
		.img-tools button:hover{background:rgba(148,163,184,.3);}
    code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;}
	pre{overflow:auto;border:1px solid ${previewPreBorder};border-radius:12px;padding:12px;background:${previewPreBg};color:${previewPreText};}
    code{background:${previewCodeBg};padding:.15em .35em;border-radius:.35em;}
    pre code{background:transparent;padding:0;}
		.pw-field{display:inline-flex;align-items:center;gap:.35rem;padding:.1rem .45rem;border-radius:999px;border:1px solid ${previewFieldBorder};background:${previewFieldBg};font-size:.85em;line-height:1.2;position:relative;}
		.pw-mask{position:absolute;left:.45rem;pointer-events:none;letter-spacing:.18em;font-weight:600;color:${previewFieldText};white-space:nowrap;}
		.pw-value{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;color:transparent;-webkit-user-select:text;user-select:text;cursor:text;}
		.pw-field.pw-revealed .pw-mask{display:none;}
		.pw-field.pw-revealed .pw-value{color:${previewValueText};}
		.pw-toggle,.pw-copy{display:inline-flex;align-items:center;justify-content:center;height:1.4rem;min-width:1.4rem;padding:0 .25rem;border-radius:999px;border:1px solid ${previewFieldBorder};background:${previewCodeBg};color:${previewFieldText};font-size:.75rem;line-height:1;cursor:pointer;opacity:0;transition:opacity .16s ease;}
		.pw-field:hover .pw-toggle,.pw-field:hover .pw-copy,.pw-field.pw-revealed .pw-toggle,.pw-field.pw-revealed .pw-copy{opacity:1;}
		.pw-toggle svg,.pw-copy svg{width:.85rem;height:.85rem;display:block;}
		.pw-toggle:hover,.pw-copy:hover{background:${previewPreBg};}
		.meta-yaml{margin:0 0 12px 0;font-size:11px;line-height:1.4;color:${previewMetaText};background:${previewMetaBg};border:1px solid ${previewMetaBorder};border-radius:10px;padding:8px 10px;white-space:pre-wrap;}
		*{scrollbar-width:thin;scrollbar-color:transparent transparent;}
		*::-webkit-scrollbar{width:10px;height:10px;}
		*::-webkit-scrollbar-track{background:transparent;}
		*::-webkit-scrollbar-thumb{background-color:transparent;border-radius:999px;border:2px solid transparent;transition:background-color 90ms ease,border-color 90ms ease;}
		body.scrollbar-active{scrollbar-color:var(--scrollbar-thumb) transparent;}
		body.scrollbar-active *::-webkit-scrollbar-thumb{background-color:var(--scrollbar-thumb);border-color:${previewScrollBorder};}
		body.scrollbar-active *::-webkit-scrollbar-thumb:hover{background-color:var(--scrollbar-thumb-hover);}
    h1,h2,h3{line-height:1.25;}
    table{border-collapse:collapse;width:100%;}
		th,td{border:1px solid ${previewTableBorder};padding:6px 8px;}
		blockquote{border-left:3px solid var(--blockquote-border);margin:0;padding:0 12px;color:var(--blockquote-text);}
		ul.task-list,ol.task-list{list-style:none;padding-left:0;}
		ul.task-list li,ol.task-list li,li.task-list-item{display:flex;gap:.55rem;align-items:flex-start;flex-wrap:nowrap;white-space:nowrap;position:relative;padding-bottom:1.8rem;min-width:0;transition:transform 1.8s ease;will-change:transform;color:var(--accent-text);font-size:1.1rem;font-weight:400;}
		ul.task-list li label,ol.task-list li label,li.task-list-item label{font-weight:400;flex:1 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;}
		ul.task-list li *,ol.task-list li *,li.task-list-item *{font-weight:400 !important;}
		ul.task-list li.task-list-item.checked,ol.task-list li.task-list-item.checked,li.task-list-item.checked{opacity:1;color:inherit;}
		ul.task-list li.task-list-item.checked label,ol.task-list li.task-list-item.checked label,li.task-list-item.checked label{text-decoration:line-through;text-decoration-thickness:1.5px;text-decoration-color:var(--accent-strong);}
		ul.task-list li.task-list-item.checked label *,ol.task-list li.task-list-item.checked label *,li.task-list-item.checked label *{text-decoration:line-through;text-decoration-thickness:1.5px;text-decoration-color:var(--accent-strong);}
		ul.task-list li.task-list-item.checked input[type=checkbox],ol.task-list li.task-list-item.checked input[type=checkbox],li.task-list-item.checked input[type=checkbox]{opacity:1;}
		ul.task-list input[type=checkbox],ol.task-list input[type=checkbox],input.task-list-item-checkbox{appearance:none;-webkit-appearance:none;margin-top:.25rem;width:1.2rem;height:1.2rem;flex:0 0 auto;border-radius:.4rem;border:2px solid var(--accent-strong);background:transparent;display:inline-grid;place-content:center;}
		ul.task-list input[type=checkbox]::before,ol.task-list input[type=checkbox]::before,input.task-list-item-checkbox::before{content:"";width:.5rem;height:.2rem;border-left:2px solid transparent;border-bottom:2px solid transparent;transform:rotate(-45deg);}
		ul.task-list input[type=checkbox]:checked,ol.task-list input[type=checkbox]:checked,input.task-list-item-checkbox:checked{background:var(--accent-strong);}
		ul.task-list input[type=checkbox]:checked::before,ol.task-list input[type=checkbox]:checked::before,input.task-list-item-checkbox:checked::before{border-color:var(--accent-text);}
		ul.task-list li > .task-closed-at,ol.task-list li > .task-closed-at,li.task-list-item > .task-closed-at{position:absolute;left:calc(2.3rem);top:1.7rem;margin-left:0;white-space:nowrap;}
		.task-closed-at{display:block;margin-top:0;font-size:.75rem;line-height:1.2;color:var(--task-closed-text);opacity:.85;text-decoration:none !important;}
		.pdf-embed{margin:12px 0;border:1px solid ${previewTableBorder};border-radius:12px;overflow:hidden;background:${previewPreBg};}
		.pdf-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 10px;border-bottom:1px solid ${previewTableBorder};font-size:12px;background:${previewMetaBg};}
		.pdf-nav{display:flex;align-items:center;gap:6px;}
		.pdf-nav-btn{border:1px solid ${previewTableBorder};background:${previewPreBg};color:${previewText};font-size:12px;line-height:1;padding:3px 8px;border-radius:999px;cursor:pointer;}
		.pdf-nav-btn:disabled{opacity:.45;cursor:default;}
		.pdf-page-label{color:${previewMetaText};font-size:12px;}
		.pdf-actions{display:flex;justify-content:flex-end;gap:8px;}
		.pdf-frame{width:100%;height:auto;display:block;background:${previewBg};}
		.pdf-fallback{padding:10px 12px;font-size:12px;color:${previewMetaText};background:${previewMetaBg};border-bottom:1px solid ${previewTableBorder};}
		.toc-float{position:fixed;top:12px;right:12px;z-index:20;width:200px;max-height:calc(100vh - 24px);display:flex;flex-direction:column;border:1px solid var(--toc-border);background:var(--toc-bg);border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,0.08);backdrop-filter:blur(12px);color:var(--toc-text);}
		.toc-header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border-bottom:1px solid var(--toc-border);font-size:11px;font-weight:600;letter-spacing:.02em;box-shadow:0 1px 0 rgba(0,0,0,0.03);}
		.toc-title{display:inline-flex;align-items:center;justify-content:center;color:var(--toc-text);}
		.toc-title svg{width:14px;height:14px;}
		.toc-toggle{border:none;background:transparent;color:var(--toc-muted);border-radius:999px;padding:1px 7px;font-size:10px;cursor:pointer;}
		.toc-toggle:hover{background:var(--toc-hover);color:var(--toc-text);}
		.toc-toggle svg{width:12px;height:12px;display:block;}
		.toc-list{margin:0;padding:6px 6px 8px 6px;list-style:none;overflow:auto;}
		.toc-item a{display:block;padding:5px 7px;border-radius:7px;color:var(--toc-text);text-decoration:none;font-size:11px;line-height:1.3;}
		.toc-item a:hover{background:var(--toc-hover);}
		.toc-item a:focus{outline:2px solid var(--toc-ring);outline-offset:1px;}
		.toc-item[data-level="2"] a{padding-left:16px;}
		.toc-item[data-level="3"] a{padding-left:24px;}
		.toc-item[data-level="4"] a{padding-left:32px;}
		.toc-collapsed .toc-list{display:none;}
		.toc-collapsed .toc-header{border-bottom:0;}
		@media (max-width: 900px){.toc-float{right:10px;top:10px;width:180px;max-height:55vh;}}
${highlightThemeCss}
  </style>
</head>
<body>
	<script>(function(){var body=document.body;if(!body)return;var hideTimer=null;function show(){body.classList.add('scrollbar-active');if(hideTimer)clearTimeout(hideTimer);hideTimer=setTimeout(function(){body.classList.remove('scrollbar-active');},800);}['scroll','wheel','touchmove'].forEach(function(evt){window.addEventListener(evt,show,{passive:true});});window.addEventListener('keydown',function(e){if(e && (e.key==='PageDown'||e.key==='PageUp'||e.key==='End'||e.key==='Home')){show();}});}());</script>
	<div id="tocFloat" class="toc-float" aria-hidden="true">
		<div class="toc-header">
			<span class="toc-title" title="Inhaltsverzeichnis" aria-label="Inhaltsverzeichnis" role="img">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M4 6h10" />
					<path d="M4 12h16" />
					<path d="M4 18h12" />
				</svg>
			</span>
			<button id="tocToggle" type="button" class="toc-toggle" aria-expanded="true" aria-label="Inhaltsverzeichnis einklappen" title="Einklappen">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M6 9l6 6 6-6" />
				</svg>
			</button>
		</div>
		<ul id="tocList" class="toc-list"></ul>
	</div>
	<div id="content">${metaHtml}${bodyHtml}</div>
	<script>
		(function(){
			var TOKEN = ${tokenJs};
			function send(type, payload){
				try {
					parent.postMessage(Object.assign({ type: type, token: TOKEN }, payload || {}), '*');
				} catch (e) {
					// ignore
				}
			}
			function slugify(text){
				return String(text || '')
					.toLowerCase()
					.trim()
					.replace(/[^a-z0-9\s-]/g, '')
					.replace(/\s+/g, '-')
					.replace(/-+/g, '-');
			}
			function buildToc(){
				var toc = document.getElementById('tocFloat');
				var list = document.getElementById('tocList');
				var toggle = document.getElementById('tocToggle');
				if (!toc || !list || !toggle) return;
				list.innerHTML = '';
				var headings = document.querySelectorAll('#content h1, #content h2, #content h3, #content h4');
				if (!headings || headings.length < 2) {
					toc.style.display = 'none';
					toc.setAttribute('aria-hidden', 'true');
					return;
				}
				var used = {};
				for (var i = 0; i < headings.length; i++) {
					var h = headings[i];
					if (!h) continue;
					var level = Number(String(h.tagName || '').slice(1)) || 1;
					var title = String(h.textContent || '').trim();
					if (!title) continue;
					var base = slugify(title) || 'section';
					var rawId = String(h.getAttribute('id') || '').trim() || base;
					var unique = rawId;
					var n = 1;
					while (used[unique]) {
						n += 1;
						unique = rawId + '-' + n;
					}
					used[unique] = true;
					if (h.id !== unique) h.id = unique;
					var li = document.createElement('li');
					li.className = 'toc-item';
					li.setAttribute('data-level', String(level));
					var a = document.createElement('a');
					a.href = '#' + unique;
					a.textContent = title;
					a.setAttribute('data-target-id', unique);
					li.appendChild(a);
					list.appendChild(li);
				}
				if (!list.children.length) {
					toc.style.display = 'none';
					toc.setAttribute('aria-hidden', 'true');
					return;
				}
				toc.style.display = 'flex';
				toc.setAttribute('aria-hidden', 'false');
				function setExpanded(on){
					var expanded = Boolean(on);
					toc.classList.toggle('toc-collapsed', !expanded);
					toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
					var label = expanded ? 'Inhaltsverzeichnis einklappen' : 'Inhaltsverzeichnis ausklappen';
					toggle.setAttribute('aria-label', label);
					toggle.setAttribute('title', expanded ? 'Einklappen' : 'Ausklappen');
					toggle.innerHTML = expanded
						? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>'
						: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>';
				}
				setExpanded(false);
				toggle.addEventListener('click', function(){
					var collapsed = toc.classList.contains('toc-collapsed');
					setExpanded(collapsed);
				});
				list.addEventListener('click', function(ev){
					var t = ev && ev.target ? ev.target : null;
					var link = t && t.closest ? t.closest('a') : null;
					if (!link) return;
					var targetId = link.getAttribute('data-target-id');
					if (!targetId) return;
					var targetEl = document.getElementById(targetId);
					if (!targetEl) return;
					try {
						ev.preventDefault();
					} catch {
						// ignore
					}
					try {
						targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
					} catch {
						targetEl.scrollIntoView();
					}
				});
			}
				function getNoteHrefTarget(href){
					if (!href || typeof href !== 'string') return '';
					var raw = href.trim();
					if (!raw.toLowerCase().startsWith('note:')) return '';
					return raw.slice(5);
				}
			function toElement(t){
				if (!t) return null;
				if (t.nodeType === 1) return t;
				// Text node -> parent element
				return t.parentElement || null;
			}
			function findCheckbox(t){
				var el = toElement(t);
				if (!el) return null;
				if (el.closest && el.closest('a')) return null;
				if (el.matches && el.matches('input[type="checkbox"]')) return el;
				var label = el.closest ? el.closest('label') : null;
				if (label) {
					var inLabel = label.querySelector ? label.querySelector('input[type="checkbox"]') : null;
					if (inLabel) return inLabel;
				}
				var li = el.closest ? el.closest('li.task-list-item') : null;
				if (li) {
					var inLi = li.querySelector ? li.querySelector('input[type="checkbox"]') : null;
					if (inLi) return inLi;
				}
				return null;
			}
			function allTaskCheckboxes(){
				// markdown-it-task-lists reliably marks LI with task-list-item,
				// but UL class can vary depending on plugin/options.
				var byLi = document.querySelectorAll('li.task-list-item input[type="checkbox"]');
				if (byLi && byLi.length) return byLi;
				var byClass = document.querySelectorAll('input.task-list-item-checkbox');
				if (byClass && byClass.length) return byClass;
				var byUl = document.querySelectorAll('ul.task-list input[type="checkbox"]');
				return byUl;
			}
			function syncTaskCheckedState(){
				var boxes = allTaskCheckboxes();
				if (!boxes || !boxes.length) return;
				for (var i = 0; i < boxes.length; i++) {
					var box = boxes[i];
					if (!box) continue;
					var li = box.closest ? box.closest('li.task-list-item') : null;
					if (!li || !li.classList) continue;
					if (box.checked) li.classList.add('checked');
					else li.classList.remove('checked');
				}
			}
			function captureTaskRects(){
				var map = {};
				var nodes = document.querySelectorAll('li.task-list-item[data-task-key]');
				if (!nodes || !nodes.length) return map;
				for (var i = 0; i < nodes.length; i++) {
					var el = nodes[i];
					if (!el || !el.getAttribute) continue;
					var key = el.getAttribute('data-task-key');
					if (!key) continue;
					map[key] = el.getBoundingClientRect();
				}
				return map;
			}
			function animateTaskReorder(prevRects){
				if (!prevRects) return;
				var duration = 1200;
				var nodes = document.querySelectorAll('li.task-list-item[data-task-key]');
				if (!nodes || !nodes.length) return;
				var changed = [];
				for (var i = 0; i < nodes.length; i++) {
					var el = nodes[i];
					if (!el || !el.getAttribute) continue;
					var key = el.getAttribute('data-task-key');
					if (!key || !prevRects[key]) continue;
					var next = el.getBoundingClientRect();
					var prev = prevRects[key];
					var dy = prev.top - next.top;
					if (!dy) continue;
					el.style.transition = 'none';
					el.style.transform = 'translateY(' + dy + 'px)';
					changed.push(el);
				}
				if (!changed.length) return;
				window.requestAnimationFrame(function(){
					window.requestAnimationFrame(function(){
						for (var i = 0; i < changed.length; i++) {
							var node = changed[i];
							if (!node) continue;
							node.style.transition = 'transform ' + duration + 'ms ease';
							node.style.transform = 'translateY(0)';
							(function(el){
								window.setTimeout(function(){
									el.style.transition = '';
									el.style.transform = '';
								}, duration + 60);
							})(node);
						}
					});
				});
			}
			function disableTaskFade(duration){
				var nodes = document.querySelectorAll('li.task-list-item');
				if (!nodes || !nodes.length) return;
				for (var i = 0; i < nodes.length; i++) {
					var el = nodes[i];
					if (!el) continue;
					el.style.animation = 'none';
				}
				if (!duration) return;
				window.setTimeout(function(){
					for (var i = 0; i < nodes.length; i++) {
						var el = nodes[i];
						if (!el) continue;
						el.style.animation = '';
					}
				}, duration);
			}
			function indexOfCheckbox(box){
				if (!box) return null;
				var all = allTaskCheckboxes();
				for (var i = 0; i < all.length; i++) if (all[i] === box) return i;
				return null;
			}
			document.addEventListener('change', function(ev){
				var t = ev && ev.target ? ev.target : null;
				if (!t) return;
				var box = findCheckbox(t);
				if (!box) return;
				var idx = indexOfCheckbox(box);
				if (idx === null) return;
				syncTaskCheckedState();
				send('mirror_task_toggle', { index: idx, checked: !!box.checked });
			}, true);

				document.addEventListener('click', function(ev){
					var t = ev && ev.target ? ev.target : null;
					var el = toElement(t);
					if (!el) return;
					var link = el.closest ? el.closest('a') : null;
					if (!link || !link.getAttribute) return;
					var href = link.getAttribute('href');
					var target = getNoteHrefTarget(href);
					if (!target) return;
					ev.preventDefault();
					send('mirror_note_open', { target: target });
				}, true);

					syncTaskCheckedState();

					var PW_ICON_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
					var PW_ICON_UNLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';

					function setPasswordRevealed(field, on){
						if (!field || !field.classList) return;
						if (on) field.classList.add('pw-revealed');
						else field.classList.remove('pw-revealed');
						var toggleBtn = field.querySelector ? field.querySelector('.pw-toggle') : null;
						if (toggleBtn) {
							toggleBtn.innerHTML = on ? PW_ICON_UNLOCK : PW_ICON_LOCK;
							toggleBtn.setAttribute('aria-label', on ? 'Passwort verbergen' : 'Passwort anzeigen');
							toggleBtn.setAttribute('title', on ? 'Verbergen' : 'Anzeigen');
						}
					}

					document.addEventListener('click', function(ev){
						var t = ev && ev.target ? ev.target : null;
						var btn = t && t.closest ? t.closest('.pw-toggle, .pw-copy') : null;
						if (!btn) return;
						var field = btn.closest ? btn.closest('.pw-field') : null;
						if (!field) return;
						ev.preventDefault();
						ev.stopPropagation();
						if (btn.classList.contains('pw-toggle')) {
							var next = !field.classList.contains('pw-revealed');
							setPasswordRevealed(field, next);
							return;
						}
						if (btn.classList.contains('pw-copy')) {
							var value = field.getAttribute('data-pw') || '';
							if (!value) return;
							send('mirror_password_copy', { value: value });
						}
					}, true);

					function wrapImage(img){
						if (!img || img.closest('.img-wrap')) return;
						var wrap = document.createElement('span');
						wrap.className = 'img-wrap';
						var tools = document.createElement('span');
						tools.className = 'img-tools';
						var sizes = [
							{ label: 'S', width: '30%' },
							{ label: 'M', width: '60%' },
							{ label: 'L', width: '100%' }
						];
						sizes.forEach(function(s){
							var btn = document.createElement('button');
							btn.type = 'button';
							btn.textContent = s.label;
							btn.addEventListener('click', function(ev){
								ev.preventDefault();
								ev.stopPropagation();
								img.style.width = s.width;
							});
							tools.appendChild(btn);
						});
						img.parentNode.insertBefore(wrap, img);
						wrap.appendChild(img);
						wrap.appendChild(tools);
					}

					function initImageTools(){
						var imgs = document.querySelectorAll('#content img');
						if (!imgs || !imgs.length) return;
						imgs.forEach(function(img){
							wrapImage(img);
						});
					}

					function getPdfRenderId(wrapper){
						if (!wrapper) return '';
						var id = wrapper.getAttribute('data-pdf-id');
						if (id) return id;
						var next = 'pdf_' + Date.now().toString(36) + '_' + Math.random().toString(16).slice(2);
						wrapper.setAttribute('data-pdf-id', next);
						return next;
					}

					function updatePdfNav(wrapper, page, total){
						if (!wrapper) return;
						var label = wrapper.querySelector('[data-pdf-page-label]');
						var prev = wrapper.querySelector('[data-pdf-prev]');
						var next = wrapper.querySelector('[data-pdf-next]');
						if (label) label.textContent = 'Seite ' + page + ' / ' + total;
						if (prev) prev.disabled = page <= 1;
						if (next) next.disabled = page >= total;
					}

					function renderPdfPage(wrapper, pageNum){
						if (!wrapper) return;
						var src = wrapper.getAttribute('data-pdf-src');
						if (!src) return;
						var id = getPdfRenderId(wrapper);
						var target = Math.max(1, Number(pageNum || 1));
						wrapper.setAttribute('data-pdf-page', String(target));
						send('mirror_pdf_render', { id: id, src: src, page: target });
					}

					function initPdfEmbeds(){
						var wrappers = document.querySelectorAll('.pdf-embed[data-pdf-src]');
						if (!wrappers || !wrappers.length) return;
						wrappers.forEach(function(wrap){
							var page = parseInt(wrap.getAttribute('data-pdf-page') || '1', 10);
							if (!isFinite(page) || page < 1) page = 1;
							var prev = wrap.querySelector('[data-pdf-prev]');
							var next = wrap.querySelector('[data-pdf-next]');
							if (prev) prev.addEventListener('click', function(ev){
								ev.preventDefault();
								var current = parseInt(wrap.getAttribute('data-pdf-page') || '1', 10);
								renderPdfPage(wrap, current - 1);
							});
							if (next) next.addEventListener('click', function(ev){
								ev.preventDefault();
								var current = parseInt(wrap.getAttribute('data-pdf-page') || '1', 10);
								renderPdfPage(wrap, current + 1);
							});
							renderPdfPage(wrap, page);
						});
					}

					window.addEventListener('message', function(ev){
						var data = ev && ev.data ? ev.data : null;
						if (!data || data.type !== 'mirror_preview_update') return;
						if (data.token !== TOKEN) return;
						var content = document.getElementById('content');
						if (!content) return;
						var prevRects = captureTaskRects();
						content.innerHTML = String(data.html || '');
						disableTaskFade(2100);
						syncTaskCheckedState();
						initImageTools();
						initPdfEmbeds();
						buildToc();
						animateTaskReorder(prevRects);
					}, true);

					window.addEventListener('message', function(ev){
						var data = ev && ev.data ? ev.data : null;
						if (!data || data.type !== 'mirror_pdf_render_result') return;
						if (data.token !== TOKEN) return;
						var id = String(data.id || '');
						if (!id) return;
						var wrap = document.querySelector('.pdf-embed[data-pdf-id="' + id.replace(/"/g, '') + '"]');
						if (!wrap) return;
						if (!data.dataUrl) return;
						var img = wrap.querySelector('img[data-pdf-img]');
						if (!img) {
							img = document.createElement('img');
							img.setAttribute('data-pdf-img', '1');
							img.style.width = '100%';
							img.style.display = 'block';
							var canvas = wrap.querySelector('canvas');
							if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
							wrap.appendChild(img);
						}
						img.src = String(data.dataUrl || '');
						var page = Number(data.page || 1);
						var pages = Number(data.pages || 1);
						wrap.setAttribute('data-pdf-page', String(page));
						wrap.setAttribute('data-pdf-pages', String(pages));
						updatePdfNav(wrap, page, pages);
					}, true);

					initImageTools();
					initPdfEmbeds();
					buildToc();

			// Handshake: signalisiert dem Parent, dass Script+Messaging aktiv sind.
			send('mirror_preview_ready', { ts: Date.now() });
		})();
	</script>
</body>
</html>`;
		setPreviewDocument(doc);
	}

	function toggleMarkdownTaskAtIndex(index, forceChecked) {
		if (!textarea) return false;
		const idx = typeof index === "number" ? index : Number(index);
		if (!Number.isFinite(idx) || idx < 0) return false;
		const src = String(textarea.value || "");
		const lines = src.split("\n");
		let seen = 0;
		let changed = false;
		const scopeKey = buildTaskScopeKey(getActiveRoomTabNoteId());
		const counts = new Map();
		for (let li = 0; li < lines.length; li++) {
			const line = String(lines[li] || "");
			const m = line.match(
				/^(\s*(?:>\s*)?(?:[-*+]|\d+[.)])\s+\[)([ xX])(\].*)$/
			);
			if (!m) continue;
			const taskText = normalizeTaskLineText(String(m[3] || "").slice(1));
			const count = (counts.get(taskText) || 0) + 1;
			counts.set(taskText, count);
			if (seen === idx) {
				const currentChecked = String(m[2] || " ").toLowerCase() === "x";
				const nextChecked =
					typeof forceChecked === "boolean"
						? forceChecked
						: String(m[2] || " ").toLowerCase() !== "x";
				const taskKey = buildTaskKey(scopeKey, taskText, count);
				if (taskKey && currentChecked !== nextChecked) {
					setTaskClosedTimestamp(
						taskKey,
						nextChecked ? Date.now() : null
					);
				}
				lines[li] = m[1] + (nextChecked ? "x" : " ") + m[3];
				changed = true;
				break;
			}
			seen += 1;
		}
		if (!changed) return false;
		const startSel = Number(textarea.selectionStart || 0);
		const endSel = Number(textarea.selectionEnd || 0);
		textarea.value = lines.join("\n");
		try {
			textarea.setSelectionRange(startSel, endSel);
		} catch {
			// ignore
		}
		updatePreview();
		const noteId = getActiveRoomTabNoteId();
		if (noteId) updateLocalNoteText(noteId, textarea.value);
		schedulePsAutoSave();
		scheduleSend();
		return true;
	}

	function sortMarkdownTasksOpenFirst(src) {
		const lines = String(src || "").split("\n");
		const out = [];
		let changed = false;
		for (let i = 0; i < lines.length; ) {
			const line = String(lines[i] || "");
			if (!TASK_LINE_RE.test(line)) {
				out.push(line);
				i += 1;
				continue;
			}
			const block = [];
			let j = i;
			while (j < lines.length && TASK_LINE_RE.test(String(lines[j] || ""))) {
				block.push(lines[j]);
				j += 1;
			}
			const open = [];
			const done = [];
			block.forEach((raw) => {
				const m = String(raw || "").match(TASK_LINE_RE);
				if (!m) return;
				const isDone = String(m[2] || "").toLowerCase() === "x";
				(isDone ? done : open).push(raw);
			});
			const sortedBlock = open.concat(done);
			if (
				!changed &&
				sortedBlock.some((lineValue, idx) => lineValue !== block[idx])
			) {
				changed = true;
			}
			out.push(...sortedBlock);
			i = j;
		}
		return { text: changed ? out.join("\n") : src, changed };
	}

	let lastPreviewTaskToggle = null;
	function markPreviewTaskToggle(index, checked) {
		lastPreviewTaskToggle = {
			index,
			checked,
			ts: Date.now(),
		};
	}
	function shouldIgnorePreviewTaskToggle(index, checked) {
		if (!lastPreviewTaskToggle) return false;
		if (lastPreviewTaskToggle.index !== index) return false;
		if (lastPreviewTaskToggle.checked !== checked) return false;
		return Date.now() - lastPreviewTaskToggle.ts < 400;
	}
	function applyPreviewTaskToggle(index, checked) {
		const ok = toggleMarkdownTaskAtIndex(index, checked);
		if (metaLeft) metaLeft.textContent = ok ? "Todo updated." : "Todo not found.";
		if (metaRight) metaRight.textContent = nowIso();
		if (ok) {
			previewTaskEditsPending = true;
		}
		if (ok && textarea) {
			try {
				textarea.dispatchEvent(new Event("input", { bubbles: true }));
			} catch {
				// ignore
			}
		}
		if (ok) schedulePreviewTaskAutoSort();
		return ok;
	}

	function schedulePreviewTaskAutoSort() {
		if (!taskAutoSortEnabled) return;
		if (!previewTaskEditsPending) return;
		if (previewTaskAutoSortTimer) {
			window.clearTimeout(previewTaskAutoSortTimer);
			previewTaskAutoSortTimer = 0;
		}
		previewTaskAutoSortTimer = window.setTimeout(() => {
			previewTaskAutoSortTimer = 0;
			maybeAutoSortTasksAfterPreview();
		}, PREVIEW_TASK_AUTO_SORT_DELAY);
	}

	function forcePreviewTaskAutoSortNow() {
		if (previewTaskAutoSortTimer) {
			window.clearTimeout(previewTaskAutoSortTimer);
			previewTaskAutoSortTimer = 0;
		}
		if (!previewTaskEditsPending) return;
		maybeAutoSortTasksAfterPreview();
	}

	function maybeAutoSortTasksAfterPreview() {
		if (!taskAutoSortEnabled) {
			previewTaskEditsPending = false;
			return;
		}
		if (!previewTaskEditsPending) return;
		if (!textarea) {
			previewTaskEditsPending = false;
			return;
		}
		const before = String(textarea.value || "");
		const { text, changed } = sortMarkdownTasksOpenFirst(before);
		previewTaskEditsPending = false;
		if (!changed) return;
		const startSel = Number(textarea.selectionStart || 0);
		const endSel = Number(textarea.selectionEnd || 0);
		textarea.value = text;
		try {
			const len = text.length;
			textarea.setSelectionRange(
				Math.min(startSel, len),
				Math.min(endSel, len)
			);
		} catch {
			// ignore
		}
		if (isCrdtEnabled()) {
			updateCrdtFromTextarea();
		} else {
			scheduleSend();
		}
		const previewHtml = buildPreviewContentHtml(text);
		const didUpdate = previewHtml && sendPreviewContentUpdate(previewHtml);
		if (!didUpdate) updatePreview();
		const noteId = getActiveRoomTabNoteId();
		if (noteId) updateLocalNoteText(noteId, textarea.value);
		updateRoomTabTextLocal(room, key, textarea.value);
		const tabNoteId = getRoomTabNoteIdForRoom(room, key);
		scheduleRoomTabSync({
			room,
			key,
			text: resolveRoomTabSnapshotText(tabNoteId, String(textarea.value || "")),
			lastUsed: Date.now(),
		});
		schedulePsAutoSave();
		schedulePsListRerender();
		if (metaLeft)
			metaLeft.textContent = uiLang === "de" ? "Aufgaben sortiert." : "Tasks sorted.";
		if (metaRight) metaRight.textContent = nowIso();
	}

	let previewCheckboxDoc = null;
	function attachPreviewCheckboxWriteback() {
		if (!mdPreview) return;
		let doc;
		try {
			doc = mdPreview.contentDocument || null;
		} catch {
			doc = null;
		}
		if (!doc || previewCheckboxDoc === doc) return;
		previewCheckboxDoc = doc;

		const toElement = (t) => {
			if (!t) return null;
			if (t.nodeType === 1) return t;
			return t.parentElement || null;
		};
		const findCheckbox = (t) => {
			const el = toElement(t);
			if (!el) return null;
			if (el.closest && el.closest("a")) return null;
			if (el.matches && el.matches('input[type="checkbox"]')) return el;
			const label = el.closest ? el.closest("label") : null;
			if (label && label.querySelector) {
				const inLabel = label.querySelector('input[type="checkbox"]');
				if (inLabel) return inLabel;
			}
			const li = el.closest ? el.closest("li.task-list-item") : null;
			if (li && li.querySelector) {
				const inLi = li.querySelector('input[type="checkbox"]');
				if (inLi) return inLi;
			}
			return null;
		};
		const allTaskCheckboxes = () => {
			const byLi = doc.querySelectorAll(
				'li.task-list-item input[type="checkbox"]'
			);
			if (byLi && byLi.length) return byLi;
			const byClass = doc.querySelectorAll('input.task-list-item-checkbox');
			if (byClass && byClass.length) return byClass;
			return doc.querySelectorAll('ul.task-list input[type="checkbox"]');
		};
		const indexOfCheckbox = (box) => {
			if (!box) return null;
			const all = allTaskCheckboxes();
			for (let i = 0; i < all.length; i++) if (all[i] === box) return i;
			return null;
		};

		doc.addEventListener(
			"change",
			(ev) => {
				const box = findCheckbox(ev && ev.target ? ev.target : null);
				if (!box) return;
				const idx = indexOfCheckbox(box);
				if (idx === null) return;
				const checked = Boolean(box.checked);
				if (shouldIgnorePreviewTaskToggle(idx, checked)) return;
				markPreviewTaskToggle(idx, checked);
				applyPreviewTaskToggle(idx, checked);
			},
			true
		);

		doc.addEventListener(
			"click",
			(ev) => {
				const box = findCheckbox(ev && ev.target ? ev.target : null);
				if (!box) return;
				const idx = indexOfCheckbox(box);
				if (idx === null) return;
				window.setTimeout(() => {
					const checked = Boolean(box.checked);
					if (shouldIgnorePreviewTaskToggle(idx, checked)) return;
					markPreviewTaskToggle(idx, checked);
					applyPreviewTaskToggle(idx, checked);
				}, 0);
			},
			true
		);

		const schedulePreviewExitSave = () => {
			if (!psEditingNoteId) return;
			if (!textarea) return;
			schedulePsAutoSave();
		};
		doc.addEventListener("mouseleave", schedulePreviewExitSave, true);

		// Change event is sufficient for checkbox toggles.
	}

	function setPreviewDocument(html) {
		if (!mdPreview) return;
		const htmlText = String(html || "");
		const prefersSrcDoc =
			htmlText.includes("pdf-embed") || htmlText.includes("data-pdf-src");
		// Robust: statt srcdoc eine blob: URL nutzen (Safari/Reload/Room-Switch ist damit stabil).
		try {
			if (prefersSrcDoc) throw new Error("prefer_srcdoc");
			if (previewObjectUrl) {
				URL.revokeObjectURL(previewObjectUrl);
				previewObjectUrl = "";
			}
			const blob = new Blob([htmlText], { type: "text/html" });
			previewObjectUrl = URL.createObjectURL(blob);
			mdPreview.removeAttribute("srcdoc");
			mdPreview.src = previewObjectUrl;
			window.setTimeout(() => {
				attachPreviewCheckboxWriteback();
			}, 0);
			return;
		} catch {
			// Fallback: srcdoc
			try {
				mdPreview.src = "about:blank";
			} catch {
				// ignore
			}
			try {
				mdPreview.srcdoc = htmlText;
				window.setTimeout(() => {
					attachPreviewCheckboxWriteback();
				}, 0);
			} catch {
				// ignore
			}
		}
	}

	const TASK_LINE_RE = /^(\s*(?:>\s*)?(?:[-*+]|\d+[.)])\s+\[)([ xX])(\].*)$/;
	const TASK_CLOSED_TS_KEY = "mirror_task_closed_ts_v1";
	let taskClosedTsCache = null;

	function loadTaskClosedTsCache() {
		if (taskClosedTsCache) return;
		try {
			const raw = localStorage.getItem(TASK_CLOSED_TS_KEY);
			const parsed = raw ? JSON.parse(raw) : {};
			taskClosedTsCache = parsed && typeof parsed === "object" ? parsed : {};
		} catch {
			taskClosedTsCache = {};
		}
	}

	function saveTaskClosedTsCache() {
		try {
			if (!taskClosedTsCache) return;
			localStorage.setItem(
				TASK_CLOSED_TS_KEY,
				JSON.stringify(taskClosedTsCache)
			);
		} catch {
			// ignore
		}
	}

	function getTaskClosedTimestamp(taskKey) {
		if (!taskKey) return null;
		loadTaskClosedTsCache();
		const raw = taskClosedTsCache[taskKey];
		const ts = typeof raw === "number" ? raw : Number(raw);
		return Number.isFinite(ts) ? ts : null;
	}

	function setTaskClosedTimestamp(taskKey, ts) {
		if (!taskKey) return;
		loadTaskClosedTsCache();
		const num = typeof ts === "number" ? ts : Number(ts);
		if (!Number.isFinite(num)) {
			delete taskClosedTsCache[taskKey];
			saveTaskClosedTsCache();
			return;
		}
		taskClosedTsCache[taskKey] = num;
		saveTaskClosedTsCache();
	}

	function buildTaskScopeKey(noteId) {
		const safeNoteId = String(noteId || "").trim();
		if (safeNoteId) return `note:${safeNoteId}`;
		const scopeRoom = String(room || "").trim();
		const scopeKey = String(key || "").trim();
		return `room:${scopeRoom}|key:${scopeKey}`;
	}

	function normalizeTaskLineText(raw) {
		return String(raw || "").replace(/\s+/g, " ").trim();
	}

	function buildTaskKey(scopeKey, text, count) {
		if (!scopeKey || !text) return "";
		return `${scopeKey}|${encodeURIComponent(text)}|${count}`;
	}

	function collectTaskKeysFromSource(src, scopeKey) {
		const lines = String(src || "").split("\n");
		const counts = new Map();
		const tasks = [];
		for (let i = 0; i < lines.length; i++) {
			const line = String(lines[i] || "");
			const m = line.match(TASK_LINE_RE);
			if (!m) continue;
			const taskText = normalizeTaskLineText(String(m[3] || "").slice(1));
			const count = (counts.get(taskText) || 0) + 1;
			counts.set(taskText, count);
			const keyValue = buildTaskKey(scopeKey, taskText, count);
			tasks.push({
				key: keyValue,
				isDone: String(m[2] || " ").toLowerCase() === "x",
			});
		}
		return tasks;
	}

	function applyTaskClosedTimestampsToHtml(html, src, scopeKey) {
		try {
			const tasks = collectTaskKeysFromSource(src, scopeKey);
			if (!tasks.length) return html;
			const container = document.createElement("div");
			container.innerHTML = String(html || "");
			const items = container.querySelectorAll("li.task-list-item");
			if (!items || !items.length) return html;
			const count = Math.min(items.length, tasks.length);
			for (let i = 0; i < count; i++) {
				const task = tasks[i];
				const li = items[i];
				if (!li || !task || !task.key) continue;
				li.setAttribute("data-task-key", task.key);
				if (!task.isDone) continue;
				const ts = getTaskClosedTimestamp(task.key);
				if (!ts) continue;
				const stamp = formatMetaDate(ts);
				if (!stamp) continue;
				if (li.querySelector(".task-closed-at")) continue;
				const node = document.createElement("span");
				node.className = "task-closed-at";
				node.textContent =
					(uiLang === "en" ? "Closed " : "Geschlossen ") + stamp;
				li.appendChild(node);
			}
			return container.innerHTML;
		} catch {
			return html;
		}
	}

	function sortTagList(list) {
		return list.slice().sort((a, b) => a.localeCompare(b));
	}

	function buildTagSections(tags) {
		const all = Array.isArray(tags) ? tags : [];
		const buckets = {
			year: [],
			month: [],
			category: [],
			subcategory: [],
			kind: [],
			language: [],
			other: [],
		};
		for (const t of all) {
			const tag = String(t || "").trim();
			if (!tag) continue;
			if (isYearTag(tag)) {
				buckets.year.push(tag);
				continue;
			}
			if (isMonthTag(tag)) {
				buckets.month.push(tag);
				continue;
			}
			if (tag.startsWith("cat:")) {
				buckets.category.push(tag);
				continue;
			}
			if (tag.startsWith("sub:")) {
				buckets.subcategory.push(tag);
				continue;
			}
			if (PS_KIND_TAGS.has(tag)) {
				buckets.kind.push(tag);
				continue;
			}
			if (tag.startsWith("lang-")) {
				buckets.language.push(tag);
				continue;
			}
			buckets.other.push(tag);
		}
		return [
			{ key: "year", label: "Year", tags: sortTagList(buckets.year) },
			{ key: "month", label: "Month", tags: sortTagList(buckets.month) },
			{ key: "category", label: "Category", tags: sortTagList(buckets.category) },
			{
				key: "subcategory",
				label: "Subcategory",
				tags: sortTagList(buckets.subcategory),
			},
			{ key: "kind", label: "Type", tags: sortTagList(buckets.kind) },
			{ key: "language", label: "Language", tags: sortTagList(buckets.language) },
			{ key: "other", label: "Tags", tags: sortTagList(buckets.other) },
		].filter((section) => section.tags.length > 0);
	}

	const PS_TAG_SECTION_STATE_KEY = "mirror_ps_tag_sections_v1";

	function loadPsTagSectionState() {
		try {
			const raw = localStorage.getItem(PS_TAG_SECTION_STATE_KEY);
			if (!raw) return {};
			const parsed = JSON.parse(raw);
			return parsed && typeof parsed === "object" ? parsed : {};
		} catch {
			return {};
		}
	}

	function savePsTagSectionState(state) {
		try {
			localStorage.setItem(
				PS_TAG_SECTION_STATE_KEY,
				JSON.stringify(state || {})
			);
		} catch {
			// ignore
		}
	}

	function normalizeSingleTag(raw) {
		const first = normalizeManualTags(raw)[0];
		return first ? String(first) : "";
	}

	function dedupeRawTags(rawTags) {
		const out = [];
		const seen = new Set();
		const list = Array.isArray(rawTags) ? rawTags : [];
		for (const t of list) {
			const s = String(t || "");
			if (!s) continue;
			if (seen.has(s)) continue;
			seen.add(s);
			out.push(s);
		}
		return out;
	}

	async function updateNotesForTagChange(oldTag, nextTag) {
		if (!psState || !psState.authed) {
			toast("Please enable Personal Space first (sign in).", "error");
			return;
		}
		const notes = Array.isArray(psState.notes) ? psState.notes : [];
		const target = String(oldTag || "");
		const next = nextTag ? String(nextTag) : "";
		if (!target) return;
		let updatedCount = 0;
		let touchedCurrentNote = false;
		for (const note of notes) {
			const rawTags = Array.isArray(note && note.tags) ? note.tags : [];
			if (!rawTags.includes(target)) continue;
			const nextTags = [];
			let replaced = false;
			for (const t of rawTags) {
				const s = String(t || "");
				if (s === target) {
					replaced = true;
					if (next) nextTags.push(next);
					continue;
				}
				nextTags.push(s);
			}
			if (!replaced) continue;
			const finalTags = dedupeRawTags(nextTags);
			const tagsPayload = buildPsTagsPayload(finalTags, true);
			try {
				const res = await api(`/api/notes/${encodeURIComponent(note.id)}`, {
					method: "PUT",
					body: JSON.stringify({
						text: String(note.text || ""),
						tags: tagsPayload,
					}),
				});
				const saved = res && res.note ? res.note : null;
				if (saved) {
					psState.notes = psState.notes.map((n) =>
						String(n && n.id ? n.id : "") === String(saved.id)
							? saved
							: n
					);
					updatedCount += 1;
					if (psEditingNoteId && String(saved.id) === String(psEditingNoteId)) {
						touchedCurrentNote = true;
					}
				}
			} catch (e) {
				const msg = e && e.message ? String(e.message) : "Error";
				toast(`Tag update failed: ${msg}`, "error");
				break;
			}
		}
		if (updatedCount) {
			if (psActiveTags && psActiveTags.size) {
				const nextActive = new Set(psActiveTags);
				if (next) {
					if (nextActive.has(target)) {
						nextActive.delete(target);
						nextActive.add(next);
					}
				} else {
					nextActive.delete(target);
				}
				psActiveTags = nextActive;
			}
			rebuildPsTagsFromNotes();
			applyPersonalSpaceFiltersAndRender();
			if (touchedCurrentNote) {
				syncPsEditingNoteTagsFromState();
			}
			toast(`Updated ${updatedCount} note${updatedCount === 1 ? "" : "s"}.`, "success");
		} else {
			toast("No notes updated.", "info");
		}
	}

	function resetPsTagContextDelete() {
		psTagContextDeleteArmed = false;
		if (psTagContextDeleteTimer) {
			window.clearTimeout(psTagContextDeleteTimer);
			psTagContextDeleteTimer = null;
		}
		if (psTagContextDelete) psTagContextDelete.textContent = "Löschen";
	}

	function setPsTagContextMenuOpen(open) {
		if (!psTagContextMenu || !psTagContextMenu.classList) return;
		psTagContextMenuOpen = Boolean(open);
		psTagContextMenu.classList.toggle("hidden", !psTagContextMenuOpen);
	}

	function positionPsTagContextMenu(x, y) {
		if (!psTagContextMenu) return;
		const rect = psTagContextMenu.getBoundingClientRect();
		const margin = 12;
		const maxLeft = window.innerWidth - rect.width - margin;
		const maxTop = window.innerHeight - rect.height - margin;
		const left = Math.max(margin, Math.min(Number(x || 0), maxLeft));
		const top = Math.max(margin, Math.min(Number(y || 0), maxTop));
		psTagContextMenu.style.left = `${Math.round(left)}px`;
		psTagContextMenu.style.top = `${Math.round(top)}px`;
	}

	function closePsTagContextMenu() {
		psTagContextMenuTag = "";
		setPsTagContextMenuOpen(false);
		resetPsTagContextDelete();
	}

	function openPsTagContextMenu(tag, x, y) {
		const current = String(tag || "");
		if (!current || !psTagContextMenu) return;
		psTagContextMenuTag = current;
		if (psTagContextLabel) psTagContextLabel.textContent = `#${current}`;
		if (psTagContextInput) psTagContextInput.value = current;
		resetPsTagContextDelete();
		if (psContextMenuOpen) closePsContextMenu();
		positionPsTagContextMenu(x, y);
		setPsTagContextMenuOpen(true);
		if (psTagContextInput && psTagContextInput.focus) {
			window.setTimeout(() => {
				if (!psTagContextMenuOpen) return;
				psTagContextInput.focus();
				if (psTagContextInput.select) psTagContextInput.select();
			}, 0);
		}
	}

	async function applyPsTagContextValue(rawInput, allowEmpty) {
		const current = String(psTagContextMenuTag || "");
		if (!current) return;
		const next = String(rawInput || "").trim();
		if (!next) {
			if (!allowEmpty) return;
			closePsTagContextMenu();
			await updateNotesForTagChange(current, "");
			return;
		}
		const normalized = normalizeSingleTag(next);
		if (!normalized) {
			toast("Invalid tag.", "error");
			return;
		}
		if (normalized === current) {
			closePsTagContextMenu();
			return;
		}
		closePsTagContextMenu();
		await updateNotesForTagChange(current, normalized);
	}

	async function applyPsTagContextInput() {
		if (!psTagContextInput) return;
		await applyPsTagContextValue(psTagContextInput.value, true);
	}

	async function confirmPsTagContextDelete() {
		const current = String(psTagContextMenuTag || "");
		if (!current) return;
		closePsTagContextMenu();
		await updateNotesForTagChange(current, "");
	}

	function updatePsTagsActiveInfo() {
		if (!psTagsActiveInfo) return;
		const active = Array.from(psActiveTags || []).filter(Boolean);
		if (!active.length) {
			psTagsActiveInfo.textContent = "Alle";
			psTagsActiveInfo.title = "Alle";
			return;
		}
		const label = active.map((t) => `#${t}`).join(", ");
		psTagsActiveInfo.textContent = label;
		psTagsActiveInfo.title = label;
	}

	function renderPsTags(tags) {
		if (!psTags) return;
		const safeTags = Array.isArray(tags) ? tags : [];
		const visibleTags = safeTags.filter(
			(t) => String(t || "") !== PS_PINNED_TAG
		);
		updatePsTagsActiveInfo();
		const allBtn = {
			tag: "",
			label: "All",
		};
		const sections = buildTagSections(visibleTags);
		const sectionState = loadPsTagSectionState();
		const sectionIcons = {
			year:
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\" /><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\" /><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\" /><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\" /></svg>",
			month:
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\" /><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\" /><path d=\"M7 14h10\" /><path d=\"M7 18h6\" /></svg>",
			category:
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" /></svg>",
			subcategory:
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8z\" /><path d=\"M16 2v6h6\" /></svg>",
			kind:
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2l7 4v6c0 5-7 10-7 10S5 17 5 12V6z\" /></svg>",
			language:
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5h8\" /><path d=\"M8 5v14\" /><path d=\"M4 19h8\" /><path d=\"M14 9h6\" /><path d=\"M14 19h6\" /><path d=\"M14 19l4-10\" /><path d=\"M18 9l4 10\" /></svg>",
			other:
				"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 7h16\" /><path d=\"M4 12h10\" /><path d=\"M4 17h16\" /></svg>",
		};
		const renderButton = (it, groupKey) => {
			const active = it.tag
				? psActiveTags && psActiveTags.has(String(it.tag))
				: !psActiveTags || psActiveTags.size === 0;
			const base = "rounded-full border px-2.5 py-1 text-xs transition";
			const cls = active
				? "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100"
				: "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10";
			const tagAttr = it.tag ? `data-tag=\"${it.tag}\"` : 'data-tag=""';
			const groupClass = groupKey
				? `ps-tag-button-group ps-tag-group-${groupKey}`
				: "";
			const activeClass = active ? "ps-tag-active" : "";
			return `<button type=\"button\" ${tagAttr} class=\"${base} ${cls} ps-tag-button ${groupClass} ${activeClass}\">${it.label}</button>`;
		};
		const allHtml = `<div class=\"w-full mb-2 flex flex-wrap items-center gap-2\">${renderButton(
			allBtn,
			""
		)}</div>`;
		const sectionHtml = sections
			.map(
				(section) => {
					const key = String(section.key || section.label || "");
					const collapsed = Boolean(sectionState[key]);
					const chev = collapsed ? "-rotate-90" : "";
					const bodyClass = collapsed ? "hidden" : "";
					const icon = sectionIcons[key] || sectionIcons.other;
					return `<div class=\"w-full mb-2 ps-tag-section ps-tag-section-${key}\" data-section-wrap=\"${key}\" data-section=\"${key}\"><button type=\"button\" class=\"mb-1 flex w-full items-center justify-between gap-2 text-[11px] uppercase tracking-wide text-slate-400 hover:text-slate-200 transition\" data-section-toggle=\"${key}\" aria-expanded=\"${collapsed ? "false" : "true"}\"><span class=\"inline-flex items-center gap-2\"><span class=\"inline-flex h-4 w-4 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition ${chev}\" data-role=\"chev\">▸</span><span class=\"ps-tag-icon\" aria-hidden=\"true\">${icon}</span><span class=\"whitespace-nowrap\">${section.label}</span></span></button><div class=\"flex flex-wrap items-center gap-2 ${bodyClass}\" data-section-body=\"${key}\">${section.tags
						.map((t) => renderButton({ tag: t, label: `#${t}` }, key))
						.join("")}</div></div>`;
				}
			)
			.join("");
		psTags.innerHTML = `${allHtml}${sectionHtml}`;

		psTags.querySelectorAll("[data-section-toggle]").forEach((btn) => {
			btn.addEventListener("click", () => {
				const key = btn.getAttribute("data-section-toggle") || "";
				if (!key) return;
				const wrap = psTags.querySelector(
					`[data-section-wrap="${key}"]`
				);
				const body = psTags.querySelector(
					`[data-section-body="${key}"]`
				);
				const chev = btn.querySelector("[data-role=\"chev\"]");
				const nextCollapsed = !(sectionState && sectionState[key]);
				sectionState[key] = nextCollapsed;
				savePsTagSectionState(sectionState);
				if (body && body.classList) body.classList.toggle("hidden", nextCollapsed);
				if (chev && chev.classList)
					chev.classList.toggle("-rotate-90", nextCollapsed);
				btn.setAttribute("aria-expanded", nextCollapsed ? "false" : "true");
				if (wrap && wrap.scrollIntoView) {
					wrap.scrollIntoView({ block: "nearest" });
				}
			});
		});

		psTags.querySelectorAll("button[data-tag]").forEach((btn) => {
			btn.addEventListener("click", async () => {
				const t = btn.getAttribute("data-tag") || "";
				if (!t) {
					psActiveTags = new Set();
				} else {
					const next = new Set(psActiveTags || []);
					if (next.has(t)) next.delete(t);
					else next.add(t);
					psActiveTags = next;
				}
				savePsTagPrefs();
				await refreshPersonalSpace();
			});
			btn.addEventListener("contextmenu", async (ev) => {
				if (!ev) return;
				const t = btn.getAttribute("data-tag") || "";
				if (!t) return;
				ev.preventDefault();
				ev.stopPropagation();
				openPsTagContextMenu(t, ev.clientX, ev.clientY);
			});
		});
	}

	async function togglePinnedForNote(note) {
		if (!note) return;
		if (!psState || !psState.authed) {
			toast("Please enable Personal Space first (sign in).", "error");
			return;
		}
		const id = String(note.id || "");
		if (!id) return;
		// Prevent concurrent toggle for the same note (rapid double-click)
		if (psPinToggleInFlight.has(id)) return;
		psPinToggleInFlight.add(id);
		// Always re-read from psState for fresh tag state
		const fresh = findNoteById(id) || note;
		const rawTags = Array.isArray(fresh.tags) ? fresh.tags : [];
		const hasManual = rawTags.some(
			(t) => String(t || "") === PS_MANUAL_TAGS_MARKER
		);
		const pinned = rawTags.some((t) => String(t || "") === PS_PINNED_TAG);
		const baseTags = stripPinnedTag(stripManualTagsMarker(rawTags));
		const nextTags = pinned ? baseTags : [...baseTags, PS_PINNED_TAG];
		const tagsPayload = buildPsTagsPayload(nextTags, hasManual);
		const text = String(note.text || "");
		try {
			const res = await api(`/api/notes/${encodeURIComponent(id)}`, {
				method: "PUT",
				body: JSON.stringify({ text, tags: tagsPayload }),
			});
			const saved = res && res.note ? res.note : null;
			if (saved && psState && psState.authed) {
				const notes = Array.isArray(psState.notes) ? psState.notes : [];
				psState.notes = notes.map((n) =>
					String(n && n.id ? n.id : "") === id ? saved : n
				);
				if (psEditingNoteId === id) {
					const updatedRaw = Array.isArray(saved.tags) ? saved.tags : [];
					psEditingNotePinned = updatedRaw.some(
						(t) => String(t || "") === PS_PINNED_TAG
					);
					psEditingNoteTagsOverridden = updatedRaw.some(
						(t) => String(t || "") === PS_MANUAL_TAGS_MARKER
					);
					const split = splitTagsForEditor(updatedRaw, saved.createdAt);
					psEditingNoteTags = split.manual;
					psEditingNoteYearTag = normalizeYearTag(split.year);
					psEditingNoteMonthTag = normalizeMonthTag(split.month);
					psEditingNoteCategory = normalizeCategoryValue(split.category);
					psEditingNoteSubcategory = normalizeCategoryValue(split.subcategory);
					syncPsEditorTagsInput(true);
					updatePsEditingTagsHint();
				}
				applyPersonalSpaceFiltersAndRender();
				toast(pinned ? "Unpinned." : "Pinned.", "success");
			}
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Error";
			const notFound = msg.includes("not_found") || msg.includes("404");
			if (notFound) {
				if (psState && Array.isArray(psState.notes)) {
					psState.notes = psState.notes.filter(
						(n) => String(n && n.id ? n.id : "") !== id
					);
				}
				applyPersonalSpaceFiltersAndRender();
				await refreshPersonalSpace();
				toast("Notiz nicht gefunden (bereits entfernt).", "info");
				return;
			}
			toast(`Pin failed: ${msg}`, "error");
		} finally {
			psPinToggleInFlight.delete(id);
		}
	}

	function findNoteById(id) {
		const notes = psState && Array.isArray(psState.notes) ? psState.notes : [];
		const target = String(id || "");
		if (!target) return null;
		return notes.find((n) => String(n && n.id ? n.id : "") === target) || null;
	}

	function updatePsNoteNavButtons() {
		if (!psNavBackBtn || !psNavForwardBtn) return;
		const canBack = psNoteHistoryIndex > 0;
		const canForward =
			psNoteHistoryIndex >= 0 && psNoteHistoryIndex < psNoteHistory.length - 1;
		psNavBackBtn.disabled = !canBack;
		psNavForwardBtn.disabled = !canForward;
	}

	function pushPsNoteHistory(noteId) {
		if (psNoteHistorySkip) return;
		const id = String(noteId || "");
		if (!id) return;
		const current =
			psNoteHistoryIndex >= 0 ? psNoteHistory[psNoteHistoryIndex] : "";
		if (current === id) return;
		if (psNoteHistoryIndex < psNoteHistory.length - 1) {
			psNoteHistory = psNoteHistory.slice(0, psNoteHistoryIndex + 1);
		}
		psNoteHistory.push(id);
		psNoteHistoryIndex = psNoteHistory.length - 1;
		updatePsNoteNavButtons();
	}

	function navigatePsNoteHistory(delta) {
		const nextIndex = psNoteHistoryIndex + Number(delta || 0);
		if (nextIndex < 0 || nextIndex >= psNoteHistory.length) return;
		const id = psNoteHistory[nextIndex];
		const note = findNoteById(id);
		psNoteHistoryIndex = nextIndex;
		updatePsNoteNavButtons();
		if (!note) return;
		psNoteHistorySkip = true;
		applyNoteToEditor(note, null, { skipHistory: true });
		psNoteHistorySkip = false;
	}

	function rebuildPsTagsFromNotes() {
		if (!psState || !psState.authed) return;
		const tags = new Set();
		const notes = Array.isArray(psState.notes) ? psState.notes : [];
		for (const note of notes) {
			const raw = Array.isArray(note && note.tags) ? note.tags : [];
			raw.forEach((t) => {
				const tag = String(t || "");
				if (!tag) return;
				if (tag === PS_PINNED_TAG || tag === PS_MANUAL_TAGS_MARKER) return;
				tags.add(tag);
			});
		}
		psState.tags = Array.from(tags).sort();
		try {
			if (document && document.activeElement === psEditorTagsInput) {
				updatePsEditorTagsSuggest(true);
			}
		} catch {
			// ignore
		}
	}

	function updateEditingNoteTagsLocal(nextTags) {
		if (!psState || !psState.authed) return;
		if (!psEditingNoteId) return;
		const notes = Array.isArray(psState.notes) ? psState.notes : [];
		const id = String(psEditingNoteId || "");
		const idx = notes.findIndex((n) => String(n && n.id ? n.id : "") === id);
		if (idx < 0) return;
		const baseTags = Array.isArray(nextTags) ? nextTags : [];
		const systemTags = buildEditorSystemTags();
		const tagsWithPinned = psEditingNotePinned
			? [...baseTags, ...systemTags, PS_PINNED_TAG]
			: [...baseTags, ...systemTags];
		const tagsPayload = buildPsTagsPayload(
			uniqTags(tagsWithPinned),
			psEditingNoteTagsOverridden
		);
		const updated = { ...notes[idx], tags: tagsPayload };
		psState.notes = [...notes.slice(0, idx), updated, ...notes.slice(idx + 1)];
		rebuildPsTagsFromNotes();
		applyPersonalSpaceFiltersAndRender();
	}

	function schedulePsTagsAutoSave() {
		if (!psEditingNoteId || !textarea) return;
		if (!psState || !psState.authed) return;
		if (psTagsAutoSaveTimer) window.clearTimeout(psTagsAutoSaveTimer);
		psTagsAutoSaveTimer = window.setTimeout(() => {
			psTagsAutoSaveTimer = null;
			void savePersonalSpaceNote(String(textarea.value || ""), { auto: true });
		}, 700);
	}

	function findNoteByTitle(title) {
		const notes = psState && Array.isArray(psState.notes) ? psState.notes : [];
		const target = String(title || "")
			.trim()
			.toLowerCase();
		if (!target) return null;
		const sorted = notes
			.slice()
			.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
		for (const note of sorted) {
			const noteTitle = getNoteTitle(note && note.text ? note.text : "");
			if (String(noteTitle || "").toLowerCase() === target) return note;
		}
		return null;
	}

	function normalizeNoteTextForCompare(text) {
		return String(text || "")
			.replace(/\r\n?/g, "\n")
			.trim();
	}

	function findNoteByText(text) {
		const notes = psState && Array.isArray(psState.notes) ? psState.notes : [];
		const target = normalizeNoteTextForCompare(text);
		if (!target) return null;
		const sorted = notes
			.slice()
			.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
		for (const note of sorted) {
			const noteText = normalizeNoteTextForCompare(
				note && note.text ? note.text : ""
			);
			if (noteText === target) return note;
		}
		const targetTitle = getNoteTitle(target);
		if (!targetTitle || targetTitle === "Untitled") return null;
		const titleLower = targetTitle.toLowerCase();
		const titleMatches = [];
		for (const note of sorted) {
			const noteTitle = getNoteTitle(note && note.text ? note.text : "");
			if (String(noteTitle || "").toLowerCase() === titleLower) {
				titleMatches.push(note);
			}
		}
		if (titleMatches.length >= 1) return titleMatches[0];
		return null;
	}

	function clearPsEditingNoteState(opts) {
		psEditingNoteId = "";
		psEditingNoteKind = "";
		psEditingNoteTags = [];
		const defaults = getDateTagsForTs(Date.now());
		psEditingNoteYearTag = defaults.year;
		psEditingNoteMonthTag = defaults.month;
		psEditingNoteCategory = "";
		psEditingNoteSubcategory = "";
		psEditingNoteDateInitialized = true;
		psEditingNoteTagsOverridden = false;
		psEditingNotePinned = false;
		syncPsEditorTagsInput(true);
		updatePsEditingTagsHint();
		syncExcalidrawForNote("");
		syncExcelForNote("");
		syncLinearForNote("");
		if (psMainHint && !(opts && opts.keepHint)) {
			psMainHint.classList.add("hidden");
		}
		updateEditorMetaYaml();
		commentActiveNoteId = "";
		commentItems = [];
		if (commentSaveTimer) {
			window.clearTimeout(commentSaveTimer);
			commentSaveTimer = null;
		}
		renderCommentList();
		updateCommentOverlay();
		syncAiChatContext();
	}

	function syncPsEditingNoteFromEditorText(text, opts) {
		if (!psState || !psState.authed) return false;
		const prevNoteId = psEditingNoteId;
		const target = normalizeNoteTextForCompare(text);
		if (!target) {
			if (opts && opts.clear) clearPsEditingNoteState();
			return false;
		}
		const note = findNoteByText(target);
		if (!note || !note.id) {
			if (opts && opts.clear) clearPsEditingNoteState();
			return false;
		}
		psEditingNoteId = String(note.id || "");
		psEditingNoteKind = String(note.kind || "");
		const rawTags = Array.isArray(note.tags) ? note.tags : [];
		psEditingNoteTagsOverridden = rawTags.some(
			(t) => String(t || "") === PS_MANUAL_TAGS_MARKER
		);
		psEditingNotePinned = rawTags.some(
			(t) => String(t || "") === PS_PINNED_TAG
		);
		const split = splitTagsForEditor(rawTags, note.createdAt);
		psEditingNoteTags = split.manual;
		psEditingNoteYearTag = normalizeYearTag(split.year);
		psEditingNoteMonthTag = normalizeMonthTag(split.month);
		psEditingNoteCategory = normalizeCategoryValue(split.category);
		psEditingNoteSubcategory = normalizeCategoryValue(split.subcategory);
		psEditingNoteDateInitialized = false;
		ensurePsEditingDateTagsInitialized();
		syncPsEditorTagsInput(true);
		updatePsEditingTagsHint();
		psAutoSaveLastSavedNoteId = psEditingNoteId;
		psAutoSaveLastSavedText = String(text || "");
		if (psMainHint) {
			psMainHint.classList.remove("hidden");
			psMainHint.textContent = "Editing active";
		}
		updateEditorMetaYaml();
		if (prevNoteId !== psEditingNoteId) {
			syncExcalidrawForNote(psEditingNoteId);
			syncExcelForNote(psEditingNoteId);
			syncLinearForNote(psEditingNoteId);
			void loadCommentsForRoom();
		}
		if (opts && opts.updateList) applyPersonalSpaceFiltersAndRender();
		syncAiChatContext();
		return true;
	}

	function applyNoteToEditor(note, notesForList, opts) {
		if (!note || !textarea) return;
		psEditingNoteId = String(note.id || "");
		markPsNoteAccessed(psEditingNoteId);
		psEditingNoteKind = String(note.kind || "");
		if (!(opts && opts.skipHistory)) {
			pushPsNoteHistory(psEditingNoteId);
		}
		const rawTags = Array.isArray(note.tags) ? note.tags : [];
		psEditingNoteTagsOverridden = rawTags.some(
			(t) => String(t || "") === PS_MANUAL_TAGS_MARKER
		);
		psEditingNotePinned = rawTags.some(
			(t) => String(t || "") === PS_PINNED_TAG
		);
		const split = splitTagsForEditor(rawTags, note.createdAt);
		psEditingNoteTags = split.manual;
		psEditingNoteYearTag = normalizeYearTag(split.year);
		psEditingNoteMonthTag = normalizeMonthTag(split.month);
		psEditingNoteCategory = normalizeCategoryValue(split.category);
		psEditingNoteSubcategory = normalizeCategoryValue(split.subcategory);
		psEditingNoteDateInitialized = false;
		ensurePsEditingDateTagsInitialized();
		syncPsEditorTagsInput(true);
		if (!(opts && opts.skipText)) {
			textarea.value = String(note.text || "");
			try {
				textarea.focus();
			} catch {
				// ignore
			}
			if (psHint) setPsHintText("Editing: editor text updated.");
		}
		updatePsEditingTagsHint();
		if (psMainHint) {
			psMainHint.classList.remove("hidden");
			psMainHint.textContent = "Editing active";
		}
		psAutoSaveLastSavedNoteId = psEditingNoteId;
		psAutoSaveLastSavedText = String(textarea.value || "");
		setPsAutoSaveStatus("");
		syncExcalidrawForNote(psEditingNoteId);
		syncExcelForNote(psEditingNoteId);
		syncLinearForNote(psEditingNoteId);
		if (room && key) {
			const canSyncRoom = isPinnedContentActiveForRoom(
				room,
				key,
				psEditingNoteId
			);
			if (canSyncRoom) {
				setRoomTabNoteId(room, key, psEditingNoteId);
			}
		}
		if (room && key && !(opts && opts.skipText)) {
			const canSyncRoom = isPinnedContentActiveForRoom(
				room,
				key,
				psEditingNoteId
			);
			if (canSyncRoom) {
				updateRoomTabTextLocal(room, key, textarea.value);
				if (isCrdtEnabled()) {
					updateCrdtFromTextarea();
				} else {
					scheduleSend();
				}
			}
		}
		if (!(opts && opts.skipText)) {
			updatePreview();
		}
		updateEditorMetaYaml();
		void loadCommentsForRoom();
		applyPersonalSpaceFiltersAndRender();
		if (isMobileViewport()) {
			mobileNoteReturn = notesForList ? "ps" : "editor";
			mobilePsOpen = false;
			if (previewOpen) {
				setPreviewVisible(false);
			} else {
				syncMobileFocusState();
			}
		} else {
			syncMobileFocusState();
		}
		syncAiChatContext();
	}

	function openNoteFromWikiTarget(target) {
		const raw = String(target || "");
		if (!raw) return;
		let decoded = raw;
		try {
			decoded = decodeURIComponent(raw);
		} catch {
			decoded = raw;
		}
		const byId = findNoteById(decoded);
		const note = byId || findNoteByTitle(decoded);
		if (!note) {
			toast("Note not found.", "info");
			return;
		}
		applyNoteToEditor(note);
	}

	function syncPsListHeight() {
		if (!psPanel || !psList) return;
		const panelRect = psPanel.getBoundingClientRect();
		const listRect = psList.getBoundingClientRect();
		if (!panelRect.height || !listRect.height) return;
		let maxHeight = panelRect.bottom - listRect.top;
		const isMobilePsOpen =
			document.body &&
			document.body.classList &&
			document.body.classList.contains("mobile-ps-open");
		if (textarea && !isMobilePsOpen) {
			const editorRect = textarea.getBoundingClientRect();
			if (editorRect.bottom > listRect.top) {
				maxHeight = Math.min(maxHeight, editorRect.bottom - listRect.top);
			}
		}
		if (psSettingsBtn) {
			const settingsRect = psSettingsBtn.getBoundingClientRect();
			if (settingsRect.top > listRect.top) {
				maxHeight = Math.min(maxHeight, settingsRect.top - listRect.top);
			}
		}
		if (Number.isFinite(maxHeight) && maxHeight > 0) {
			psList.style.maxHeight = `${Math.max(120, Math.floor(maxHeight))}px`;
		}
	}

	function setPsContextMenuOpen(open) {
		if (!psContextMenu || !psContextMenu.classList) return;
		psContextMenuOpen = Boolean(open);
		psContextMenu.classList.toggle("hidden", !psContextMenuOpen);
	}

	function positionPsContextMenu(x, y) {
		if (!psContextMenu) return;
		const rect = psContextMenu.getBoundingClientRect();
		const maxLeft = window.innerWidth - rect.width - 8;
		const maxTop = window.innerHeight - rect.height - 8;
		const left = Math.max(8, Math.min(Number(x || 0), maxLeft));
		const top = Math.max(8, Math.min(Number(y || 0), maxTop));
		psContextMenu.style.left = `${Math.round(left)}px`;
		psContextMenu.style.top = `${Math.round(top)}px`;
	}

	function openPsContextMenu(noteId, x, y) {
		const id = String(noteId || "");
		if (!id || !psContextMenu) return;
		psContextMenuTargetId = id;
		const isSelected = psSelectedNoteIds.has(id);
		if (psContextSelectLabel) {
			psContextSelectLabel.textContent = isSelected
				? "Auswahl entfernen"
				: "Auswählen";
		}
		if (psTagContextMenuOpen) closePsTagContextMenu();
		positionPsContextMenu(x, y);
		setPsContextMenuOpen(true);
	}

	function closePsContextMenu() {
		psContextMenuTargetId = "";
		setPsContextMenuOpen(false);
	}

	function updatePsBulkBar() {
		syncPsBulkSelectionToDom();
	}

	function syncPsBulkSelectionToDom() {
		if (!psList) return;
		psList.querySelectorAll("[data-note-id]").forEach((row) => {
			const id = String(row.getAttribute("data-note-id") || "");
			const selected = id && psSelectedNoteIds.has(id);
			row.classList.toggle("ring-2", Boolean(selected));
			row.classList.toggle("ring-fuchsia-400/30", Boolean(selected));
		});
	}

	function prunePsSelectedNotes(nextIds) {
		const nextSet = new Set(Array.isArray(nextIds) ? nextIds : []);
		let changed = false;
		for (const id of psSelectedNoteIds) {
			if (!nextSet.has(id)) {
				psSelectedNoteIds.delete(id);
				changed = true;
			}
		}
		if (changed) updatePsBulkBar();
	}

	function setPsNoteSelected(noteId, selected) {
		const id = String(noteId || "");
		if (!id) return;
		if (selected) psSelectedNoteIds.add(id);
		else psSelectedNoteIds.delete(id);
		updatePsBulkBar();
	}

	function togglePsSelectAll() {
		const ids = Array.isArray(psRenderedNoteIds) ? psRenderedNoteIds : [];
		const allSelected = ids.length > 0 && ids.every((id) => psSelectedNoteIds.has(id));
		if (allSelected) {
			ids.forEach((id) => psSelectedNoteIds.delete(id));
		} else {
			ids.forEach((id) => psSelectedNoteIds.add(id));
		}
		updatePsBulkBar();
	}

	function clearPsSelection() {
		psSelectedNoteIds = new Set();
		updatePsBulkBar();
	}

	function getSelectedNoteIds() {
		return Array.from(psSelectedNoteIds || []);
	}

	async function applyBulkTagsToNotes(noteIds, tags) {
		const ids = Array.isArray(noteIds) ? noteIds : [];
		if (!ids.length) return;
		const nextTags = Array.isArray(tags) ? tags : [];
		const tasks = ids.map(async (id) => {
			const note = findNoteById(id);
			if (!note) return { ok: false };
			const rawTags = Array.isArray(note.tags) ? note.tags : [];
			const pinned = rawTags.some((t) => String(t || "") === PS_PINNED_TAG);
			const tagsPayload = buildPsTagsPayload(
				pinned ? [...nextTags, PS_PINNED_TAG] : nextTags,
				true
			);
			const text = String(note.text || "");
			try {
				await api(`/api/notes/${encodeURIComponent(id)}`, {
					method: "PUT",
					body: JSON.stringify({ text, tags: tagsPayload }),
				});
				return { ok: true };
			} catch {
				return { ok: false };
			}
		});
		const results = await Promise.allSettled(tasks);
		const okCount = results.filter((r) => r.status === "fulfilled" && r.value && r.value.ok).length;
		if (okCount) toast(`Tags aktualisiert: ${okCount}.`, "success");
		else toast("Tags aktualisieren fehlgeschlagen.", "error");
	}

	async function deleteBulkNotes(noteIds) {
		const ids = Array.isArray(noteIds) ? noteIds : [];
		if (!ids.length) return;
		const tasks = ids.map(async (id) => {
			try {
				await api(`/api/notes/${encodeURIComponent(id)}`, {
					method: "DELETE",
				});
				return { ok: true, id };
			} catch {
				return { ok: false, id };
			}
		});
		const results = await Promise.allSettled(tasks);
		const okIds = results
			.filter((r) => r.status === "fulfilled" && r.value && r.value.ok)
			.map((r) => r.value.id);
		okIds.forEach((id) => removeNoteRoomBindingByNoteId(id));
		if (okIds.includes(psEditingNoteId)) {
			psEditingNoteId = "";
			if (psMainHint) psMainHint.classList.add("hidden");
			syncMobileFocusState();
		}
		if (okIds.length) toast(`Notizen gelöscht: ${okIds.length}.`, "success");
		else toast("Löschen fehlgeschlagen.", "error");
	}

	function renderPsList(notes) {
		if (!psList) return;
		const escapeHtml = (raw) =>
			String(raw || "")
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/\"/g, "&quot;");

		const items = Array.isArray(notes) ? notes : [];
		if (items.length === 0) {
			psRenderedNoteIds = [];
			prunePsSelectedNotes(psRenderedNoteIds);
			const q = normalizeSearchQuery(psSearchQuery);
			psList.innerHTML = q
				? '<div class="text-xs text-slate-400">No matches.</div>'
				: '<div class="text-xs text-slate-400">No notes yet.</div>';
			syncPsListHeight();
			return;
		}
		const byId = new Map(items.map((n) => [String(n.id || ""), n]));
		const linkedNoteIds = new Set(
			loadRoomPinnedEntries()
				.filter((p) => p && p.noteId)
				.map((p) => String(p.noteId || "").trim())
				.filter(Boolean)
		);
		psRenderedNoteIds = items.map((n) => String(n.id || "")).filter(Boolean);
		prunePsSelectedNotes(psRenderedNoteIds);
		psList.innerHTML = items
			.map((n) => {
				const id = String(n.id || "");
				const active = id && id === psEditingNoteId;
				const selected = id && psSelectedNoteIds.has(id);
				const rawTags = Array.isArray(n.tags) ? n.tags : [];
				const pinned = rawTags.some((t) => String(t || "") === PS_PINNED_TAG);
				const linked = id && linkedNoteIds.has(id);
				const tags = sortTagsByCategory(stripPinnedTag(stripManualTagsMarker(rawTags)));
				const tagsText = tags.map((t) => `#${t}`).join(" ");
				const info = getNoteTitleAndExcerpt(n && n.text ? n.text : "");
				const titleHtml = escapeHtml(info.title);
				const previewLines = getNotePreviewLines(n && n.text ? n.text : "", 3);
				const excerptHtml = escapeHtml(previewLines.join("\n"));
				const linkedBadge = linked
					? `<span class="ps-note-link-badge" aria-label="Permanent-Link" title="Permanent-Link">
						<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="7" r="3" />
							<path d="M12 10v8" />
							<path d="M5 14a7 7 0 0 0 14 0" />
							<path d="M8 18l-3-3" />
							<path d="M16 18l3-3" />
						</svg>
					</span>`
					: "";
				return `
					<div data-note-id="${id}" class="group ps-note-item relative cursor-pointer ${
					active ? "ps-note-active" : ""
				} px-4${selected ? " ring-2 ring-fuchsia-400/30 rounded-lg" : ""}">
						<div class="flex items-center justify-between gap-4 w-full">
							<div class="truncate text-sm font-semibold text-slate-100 flex-1 min-w-0">${titleHtml}</div>
							<div class="ps-note-actions flex items-center gap-2 flex-shrink-0">
								<button type="button" data-action="pin" class="ps-note-pin inline-flex rounded-md p-1 transition ${pinned ? "text-fuchsia-300" : "text-slate-400 hover:text-slate-200"}" title="Pin" aria-label="Pin">
									<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16" /><path d="M4 4h12l-2 5 2 5H4" /></svg>
								</button>
								<button type="button" data-action="share" class="ps-note-share inline-flex rounded-md p-1 text-slate-400 hover:text-slate-200 transition" title="Teilen" aria-label="Teilen">
									<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.5 10.5L15.5 6.5" /><path d="M8.5 13.5L15.5 17.5" /></svg>
								</button>
								<button type="button" data-action="delete" class="ps-note-delete inline-flex rounded-md p-1 text-slate-400 hover:text-red-400 transition" title="Delete" aria-label="Delete">
									<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
								</button>
							</div>
						</div>
						<div class="flex items-center gap-2 mt-1 w-full ps-note-meta min-w-0">
							<span class="text-[10px] text-slate-400 flex-shrink-0">${fmtShortDateTime(n.createdAt)}</span>
							${tagsText ? `<span class="ps-note-tags-inline text-[10px] text-slate-400 truncate min-w-0">${escapeHtml(tagsText)}</span>` : ''}
						</div>
						${linkedBadge}
					</div>
				`;
			})
			.join("");

		psList.querySelectorAll("[data-note-id]").forEach((row) => {
			row.querySelectorAll("a").forEach((a) => {
				a.addEventListener("click", (ev) => {
					ev.stopPropagation();
				});
			});
			row.addEventListener("click", async (ev) => {
				forcePreviewTaskAutoSortNow();
				await flushPendingPsAutoSave();
				const id = row.getAttribute("data-note-id") || "";
				if (!id) return;
				const toggle = Boolean(ev && (ev.metaKey || ev.ctrlKey));
				if (toggle) {
					ev.preventDefault();
					ev.stopPropagation();
					setPsNoteSelected(id, !psSelectedNoteIds.has(id));
					return;
				}
				const existingTab = findRoomTabByNoteId(id);
				if (
					existingTab &&
					!(existingTab.room === room && existingTab.key === key)
				) {
					goToRoomWithKey(existingTab.room, existingTab.key);
					return;
				}
				const note = findNoteById(id);
				if (!note) return;
				applyNoteToEditor(note);
			});

			row.addEventListener("contextmenu", (ev) => {
				const id = row.getAttribute("data-note-id") || "";
				if (!id) return;
				ev.preventDefault();
				ev.stopPropagation();
				if (!psSelectedNoteIds.has(id)) {
					setPsNoteSelected(id, true);
				}
				openPsContextMenu(id, ev.clientX, ev.clientY);
			});

			const delBtn = row.querySelector('[data-action="delete"]');
			if (delBtn) {
				delBtn.addEventListener("click", async (ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					const id = row.getAttribute("data-note-id") || "";
					if (!id) return;
					try {
						await api(`/api/notes/${encodeURIComponent(id)}`, {
							method: "DELETE",
						});
						if (psState && Array.isArray(psState.notes)) {
							psState.notes = psState.notes.filter(
								(n) => String(n && n.id ? n.id : "") !== id
							);
						}
						if (psEditingNoteId === id) {
							psEditingNoteId = "";
							if (psMainHint) psMainHint.classList.add("hidden");
							syncMobileFocusState();
						}
						removeNoteRoomBindingByNoteId(id);
						applyPersonalSpaceFiltersAndRender();
						toast("Notiz im Papierkorb abgelegt.", "success");
						await refreshPersonalSpace();
					} catch (e) {
						const msg = e && e.message ? String(e.message) : "";
						const notFound = msg.includes("not_found") || msg.includes("404");
						if (notFound) {
							if (psState && Array.isArray(psState.notes)) {
								psState.notes = psState.notes.filter(
									(n) => String(n && n.id ? n.id : "") !== id
								);
							}
							removeNoteRoomBindingByNoteId(id);
							applyPersonalSpaceFiltersAndRender();
							await refreshPersonalSpace();
							toast("Notiz war bereits gelöscht.", "info");
							return;
						}
						toast("Löschen fehlgeschlagen.", "error");
					}
				});
			}
			const shareBtn = row.querySelector('[data-action="share"]');
			if (shareBtn) {
				shareBtn.addEventListener("click", (ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					const id = row.getAttribute("data-note-id") || "";
					if (!id) return;
					openNoteShareModal([id]);
				});
			}
			const pinBtn = row.querySelector('[data-action="pin"]');
			if (pinBtn) {
				pinBtn.addEventListener("click", async (ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					const id = row.getAttribute("data-note-id") || "";
					if (!id) return;
					const note = findNoteById(id) || byId.get(id);
					if (!note) return;
					await togglePinnedForNote(note);
				});
			}
		});
		syncPsListHeight();
	}

	function ensureJsRunnerFrame() {
		if (jsRunnerFrame && jsRunnerFrame.contentWindow) return jsRunnerFrame;
		try {
			const iframe = document.createElement("iframe");
			iframe.style.position = "fixed";
			iframe.style.width = "1px";
			iframe.style.height = "1px";
			iframe.style.opacity = "0";
			iframe.style.pointerEvents = "none";
			iframe.style.left = "-9999px";
			iframe.style.top = "-9999px";
			iframe.setAttribute("sandbox", "allow-scripts");
			document.body.appendChild(iframe);
			jsRunnerFrame = iframe;
			return jsRunnerFrame;
		} catch {
			jsRunnerFrame = null;
			return null;
		}
	}

	window.addEventListener("message", (ev) => {
		const data = ev && ev.data ? ev.data : null;
		if (!data || !data.type) return;
		if (data.type === "mirror_preview_ready") {
			if (!previewMsgToken) return;
			if (String(data.token || "") !== String(previewMsgToken)) return;
			if (metaLeft) metaLeft.textContent = "Preview ready.";
			if (metaRight) metaRight.textContent = nowIso();
			return;
		}
		if (data.type === "mirror_task_toggle") {
			// Token ist die primäre Validierung (robust bei sandbox/null origin).
			if (!previewMsgToken) return;
			if (String(data.token || "") !== String(previewMsgToken)) return;
			const idx = Number(data.index);
			if (!Number.isFinite(idx) || idx < 0) return;
			const checked = Boolean(data.checked);
			if (shouldIgnorePreviewTaskToggle(idx, checked)) return;
			markPreviewTaskToggle(idx, checked);
			applyPreviewTaskToggle(idx, checked);
			return;
		}
		if (data.type === "mirror_note_open") {
			if (!previewMsgToken) return;
			if (String(data.token || "") !== String(previewMsgToken)) return;
			openNoteFromWikiTarget(String(data.target || ""));
			return;
		}
		if (data.type === "mirror_password_copy") {
			if (!previewMsgToken) return;
			if (String(data.token || "") !== String(previewMsgToken)) return;
			const value = String(data.value || "");
			if (!value) return;
			copyTextToClipboard(value).then((ok) => {
				toast(
					ok ? "Passwort kopiert." : "Kopieren nicht verfügbar.",
					ok ? "success" : "error"
				);
			});
			return;
		}
		if (data.type === "mirror_pdf_render") {
			if (!previewMsgToken) return;
			if (String(data.token || "") !== String(previewMsgToken)) return;
			const src = String(data.src || "").trim();
			const id = String(data.id || "").trim();
			const page = Number(data.page || 1);
			if (!src || !id || !Number.isFinite(page)) return;
			const target = ev && ev.source ? ev.source : null;
			if (!target || typeof target.postMessage !== "function") return;
			void renderPdfPreviewPage(src, page)
				.then((res) => {
					if (!res || !res.dataUrl) return;
					try {
						target.postMessage(
							{
								type: "mirror_pdf_render_result",
								token: previewMsgToken,
								id,
								dataUrl: res.dataUrl,
								page: res.page,
								pages: res.pages,
							},
							"*"
						);
					} catch {
						// ignore
					}
				})
				.catch(() => {
					// ignore
				});
			return;
		}
		if (data.type !== "mirror_js_run_result") return;
		const pending = jsRunnerPending.get(String(data.id || ""));
		if (!pending) return;
		try {
			jsRunnerPending.delete(String(data.id || ""));
			pending.resolve({
				output: String(data.output || ""),
				error: String(data.error || ""),
			});
		} catch {
			// ignore
		}
	});

	function runJsSnippet(code, timeoutMs) {
		return new Promise((resolve) => {
			const js = String(code || "");
			const id = `js_${Date.now()}_${Math.random().toString(16).slice(2)}`;

			// Prefer WebWorker (robust, killable on timeout) over iframe/sandbox.
			try {
				const workerCode = `
self.onmessage = async (e) => {
  const data = e && e.data ? e.data : {};
  const id = String(data.id || '');
  const code = String(data.code || '');
  const logs = [];
  const stringify = (v) => {
    try {
      if (typeof v === 'string') return v;
      if (v && v.stack) return String(v.stack);
      return JSON.stringify(v);
    } catch {
      try { return String(v); } catch { return '[unserializable]'; }
    }
  };
  const orig = { log: console.log, warn: console.warn, error: console.error };
  console.log = (...a) => logs.push(a.map(stringify).join(' '));
  console.warn = (...a) => logs.push(a.map(stringify).join(' '));
  console.error = (...a) => logs.push(a.map(stringify).join(' '));
  try {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const fn = new AsyncFunction('console', 'stringify', code);
    await fn(console, stringify);
    self.postMessage({ id, output: logs.join('\n'), error: '' });
  } catch (ex) {
    const err = (ex && ex.stack) ? String(ex.stack) : String(ex);
    self.postMessage({ id, output: logs.join('\n'), error: err });
  } finally {
    console.log = orig.log; console.warn = orig.warn; console.error = orig.error;
  }
};
`;
				const blob = new Blob([workerCode], {
					type: "application/javascript",
				});
				const url = URL.createObjectURL(blob);
				const worker = new Worker(url);
				let workerUrl = url;
				const cleanupWorkerUrl = () => {
					try {
						if (workerUrl) URL.revokeObjectURL(workerUrl);
					} catch {
						// ignore
					}
					workerUrl = "";
				};
				// Safety: revoke später, falls cleanup nicht greift
				window.setTimeout(() => cleanupWorkerUrl(), 5000);
				let done = false;
				const timer = window.setTimeout(() => {
					if (done) return;
					done = true;
					try {
						worker.terminate();
					} catch {
						// ignore
					}
					cleanupWorkerUrl();
					resolve({ output: "", error: `Timeout after ${timeoutMs}ms.` });
				}, timeoutMs);
				worker.addEventListener("message", (ev) => {
					const data = ev && ev.data ? ev.data : null;
					if (!data || String(data.id || "") !== id) return;
					if (done) return;
					done = true;
					window.clearTimeout(timer);
					try {
						worker.terminate();
					} catch {
						// ignore
					}
					cleanupWorkerUrl();
					resolve({
						output: String(data.output || ""),
						error: String(data.error || ""),
					});
				});
				worker.addEventListener("error", () => {
					if (done) return;
					done = true;
					window.clearTimeout(timer);
					try {
						worker.terminate();
					} catch {
						// ignore
					}
					cleanupWorkerUrl();
					resolve({
						output: "",
						error: "JS runner could not be started.",
					});
				});
				worker.postMessage({ id, code: js });
				return;
			} catch {
				// Fallback: iframe runner
			}

			const frame = ensureJsRunnerFrame();
			if (!frame || !frame.contentWindow) {
				resolve({ output: "", error: "JS runner unavailable." });
				return;
			}
			let runnerUrl = "";
			const cleanupUrl = () => {
				try {
					if (runnerUrl) URL.revokeObjectURL(runnerUrl);
				} catch {
					// ignore
				}
				runnerUrl = "";
			};
			const timer = window.setTimeout(() => {
				jsRunnerPending.delete(id);
				cleanupUrl();
				try {
					if (jsRunnerFrame) jsRunnerFrame.remove();
				} catch {
					// ignore
				}
				jsRunnerFrame = null;
				resolve({ output: "", error: `Timeout after ${timeoutMs}ms.` });
			}, timeoutMs);
			jsRunnerPending.set(id, {
				resolve: (v) => {
					window.clearTimeout(timer);
					cleanupUrl();
					resolve(v);
				},
			});

			const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>
(function(){
  const id = ${JSON.stringify(id)};
  const send = (output, error) => parent.postMessage({type:'mirror_js_run_result', id, output, error}, '*');
  const logs = [];
  const stringify = (v)=>{ try{ if (typeof v==='string') return v; if (v && v.stack) return String(v.stack); return JSON.stringify(v);}catch{ try{return String(v);}catch{return '[unserializable]';}} };
  const orig = { log: console.log, warn: console.warn, error: console.error };
  console.log = (...a)=>logs.push(a.map(stringify).join(' '));
  console.warn = (...a)=>logs.push(a.map(stringify).join(' '));
  console.error = (...a)=>logs.push(a.map(stringify).join(' '));
  try {
    (function(){ ${js}\n })();
    send(logs.join('\n'), '');
  } catch (e) {
    send(logs.join('\n'), (e && e.stack) ? String(e.stack) : String(e));
  } finally {
    console.log = orig.log; console.warn = orig.warn; console.error = orig.error;
  }
})();
<\/script></body></html>`;
			try {
				const blob = new Blob([html], { type: "text/html" });
				runnerUrl = URL.createObjectURL(blob);
				frame.src = runnerUrl;
			} catch {
				try {
					frame.src = "about:blank";
				} catch {
					// ignore
				}
				try {
					frame.srcdoc = html;
				} catch {
					window.clearTimeout(timer);
					jsRunnerPending.delete(id);
					cleanupUrl();
					resolve({
						output: "",
						error: "JS runner could not be started.",
					});
				}
			}
		});
	}

	function ensurePyRunnerWorker() {
		if (pyRunnerWorker) return pyRunnerWorker;
		try {
			const baseUrls = JSON.stringify(PYODIDE_BASE_URLS);
			const workerCode = `
let pyodide = null;
let pyodideReady = null;
const BASE_URLS = ${baseUrls};

function normalizeBase(raw) {
	const v = String(raw || '').trim();
	if (!v) return '';
	return v.endsWith('/') ? v : v + '/';
}

async function ensurePyodide() {
  if (pyodide) return pyodide;
  if (!pyodideReady) {
		pyodideReady = (async () => {
			let lastErr = null;
			const bases = Array.isArray(BASE_URLS) ? BASE_URLS : [];
			for (const b of bases) {
				const base = normalizeBase(b);
				if (!base) continue;
				try {
					importScripts(base + 'pyodide.js');
					const py = await loadPyodide({ indexURL: base });
					return py;
				} catch (e) {
					lastErr = e;
				}
			}
			throw lastErr || new Error('Pyodide could not be loaded.');
		})();
  }
  pyodide = await pyodideReady;
  return pyodide;
}

self.onmessage = async (e) => {
  const data = e && e.data ? e.data : {};
  const id = String(data.id || '');
  const code = String(data.code || '');
  try {
    const py = await ensurePyodide();
    py.globals.set('___code', code);
    const result = await py.runPythonAsync(
      "import sys, io, traceback\n" +
      "_out = io.StringIO()\n" +
      "_err = io.StringIO()\n" +
      "_old_out, _old_err = sys.stdout, sys.stderr\n" +
      "sys.stdout, sys.stderr = _out, _err\n" +
      "try:\n" +
      "    exec(___code, {})\n" +
      "except Exception:\n" +
      "    traceback.print_exc(file=_err)\n" +
      "finally:\n" +
      "    sys.stdout, sys.stderr = _old_out, _old_err\n" +
      "(_out.getvalue(), _err.getvalue())\n"
    );
    let out = '';
    let err = '';
    try { out = (result && result.get && result.get(0)) ? String(result.get(0)) : String(result[0] || ''); } catch { out = '' }
    try { err = (result && result.get && result.get(1)) ? String(result.get(1)) : String(result[1] || ''); } catch { err = '' }
    self.postMessage({ id, output: out, error: err });
  } catch (ex) {
    self.postMessage({ id, output: '', error: (ex && ex.stack) ? String(ex.stack) : String(ex) });
  }
};
`;
			const blob = new Blob([workerCode], { type: "application/javascript" });
			const url = URL.createObjectURL(blob);
			pyRunnerWorker = new Worker(url);
			try {
				setTimeout(() => URL.revokeObjectURL(url), 5000);
			} catch {
				// ignore
			}
			return pyRunnerWorker;
		} catch {
			pyRunnerWorker = null;
			return null;
		}
	}

	function runPySnippet(code, timeoutMs) {
		return new Promise((resolve) => {
			const worker = ensurePyRunnerWorker();
			if (!worker) {
				resolve({ output: "", error: "Python runner unavailable." });
				return;
			}
			const id = `py_${Date.now()}_${++pyRunnerSeq}`;
			let done = false;
			const timer = window.setTimeout(() => {
				if (done) return;
				done = true;
				try {
					worker.terminate();
				} catch {
					// ignore
				}
				pyRunnerWorker = null;
				resolve({ output: "", error: `Timeout after ${timeoutMs}ms.` });
			}, timeoutMs);

			const onMsg = (ev) => {
				const data = ev && ev.data ? ev.data : null;
				if (!data || String(data.id || "") !== id) return;
				if (done) return;
				done = true;
				window.clearTimeout(timer);
				try {
					worker.removeEventListener("message", onMsg);
				} catch {
					// ignore
				}
				resolve({
					output: String(data.output || ""),
					error: String(data.error || ""),
				});
			};
			worker.addEventListener("message", onMsg);
			try {
				worker.postMessage({ id, code: String(code || "") });
			} catch {
				window.clearTimeout(timer);
				try {
					worker.removeEventListener("message", onMsg);
				} catch {
					// ignore
				}
				resolve({ output: "", error: "Python runner failed to start." });
			}
		});
	}

	const PY_TIMEOUT_COLD_MS = 180000;
	const PY_TIMEOUT_WARM_MS = 60000;
	const JS_TIMEOUT_MS = 20000;

	async function runSnippetForNote(noteId, lang, code) {
		const id = String(noteId || "");
		if (!id) return;
		psRunOutputById.set(id, { status: "running", output: "", error: "" });
		renderPsList(Array.isArray(psState && psState.notes) ? psState.notes : []);

		const timeoutMs =
			lang === "python" || lang === "py"
				? pyRuntimeWarmed
					? PY_TIMEOUT_WARM_MS
					: PY_TIMEOUT_COLD_MS
				: JS_TIMEOUT_MS;
		let res = { output: "", error: "" };
		if (lang === "python" || lang === "py") {
			res = await runPySnippet(code, timeoutMs);
		} else if (lang === "javascript" || lang === "js") {
			res = await runJsSnippet(code, timeoutMs);
		} else {
			res = { output: "", error: `Not supported: ${lang || "unknown"}` };
		}
		if (lang === "python" || lang === "py") {
			// Mark runtime warmed if we got any non-timeout response
			if (!/Timeout\s+(nach|after)/i.test(String(res.error || "")))
				pyRuntimeWarmed = true;
		}

		const out = String(res.output || "");
		const err = String(res.error || "");
		psRunOutputById.set(id, {
			status: err ? "error" : "done",
			output: out ? out.slice(0, 8000) : "",
			error: err ? err.slice(0, 8000) : "",
		});
		renderPsList(Array.isArray(psState && psState.notes) ? psState.notes : []);
		if (err) toast("Snippet error (see output).", "error");
	}

	function getAiMode() {
		const v = String(
			aiModeSelect && aiModeSelect.value ? aiModeSelect.value : ""
		)
			.trim()
			.toLowerCase();
		if (v === "fix" || v === "improve" || v === "run" || v === "summarize" || v === "image")
			return v;
		return "explain";
	}

	async function aiAssistFromPreview() {
		const mode = getAiMode();

		// --- Image generation mode (FLUX.2) ---
		if (mode === "image") {
			const imgPrompt = String(getAiPrompt() || "").trim();
			if (!imgPrompt) {
				setPreviewRunOutput({ status: "", output: "", error: "", source: "" });
				toast("Bitte einen Bild-Prompt eingeben.", "info");
				return;
			}
			saveAiPrompt(imgPrompt);
			const chatContextKey = getAiChatContextKey();
			setRunOutputProcessing(true);
			setPreviewRunOutput({
				status: "🎨 Bild wird generiert…",
				output: "",
				error: "",
				source: "ai",
			});
			try {
				const body = { prompt: imgPrompt };
				const imgRes = await api("/api/ai/image", {
					method: "POST",
					body: JSON.stringify(body),
				});
				const dataUri = String(imgRes && imgRes.imageDataUri ? imgRes.imageDataUri : "");
				const usedModel = imgRes && imgRes.model ? String(imgRes.model) : "FLUX.2";
				if (!dataUri) {
					setPreviewRunOutput({
						status: "AI error",
						output: "",
						error: "No image returned.",
						source: "ai",
					});
					toast("Image generation returned no image.", "error");
					return;
				}
				// Render image in output area
				previewRunState = {
					status: "AI (" + usedModel + ")",
					output: imgPrompt,
					error: "",
					source: "ai-image",
					imageDataUri: dataUri,
				};
				if (runStatusEl) runStatusEl.textContent = previewRunState.status;
				if (runOutputEl) {
					const imgId = "ai-gen-img-" + Date.now();
					runOutputEl.innerHTML =
						'<div style="text-align:center;padding:12px 0">' +
						'<img id="' + imgId + '" src="' + dataUri + '" alt="' + escapeHtml(imgPrompt).replace(/"/g, '&quot;') + '" ' +
						'style="max-width:100%;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.4)" />' +
						'<div style="margin-top:8px;font-size:11px;color:#94a3b8">' + escapeHtml(usedModel) + ' · ' + escapeHtml(imgPrompt).slice(0, 120) + '</div>' +
						'<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:10px">' +
						'<a href="' + dataUri + '" download="flux-image.jpg" ' +
						'style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:#e2e8f0;font-size:12px;text-decoration:none;cursor:pointer;transition:background .15s" ' +
						'onmouseover="this.style.background=\'rgba(255,255,255,.15)\'" onmouseout="this.style.background=\'rgba(255,255,255,.08)\'"' +
						'>⬇ ' + t("ai.image.download") + '</a>' +
						'<button type="button" data-ai-img-action="upload" ' +
						'style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:#e2e8f0;font-size:12px;cursor:pointer;transition:background .15s" ' +
						'onmouseover="this.style.background=\'rgba(255,255,255,.15)\'" onmouseout="this.style.background=\'rgba(255,255,255,.08)\'"' +
						'>📁 ' + t("ai.image.save_upload") + '</button>' +
						'<button type="button" data-ai-img-action="insert" ' +
						'style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(232,121,249,.15);color:#e2e8f0;font-size:12px;cursor:pointer;transition:background .15s" ' +
						'onmouseover="this.style.background=\'rgba(232,121,249,.25)\'" onmouseout="this.style.background=\'rgba(232,121,249,.15)\'"' +
						'>✏️ ' + t("ai.image.insert_mirror") + '</button>' +
						'</div>' +
						'</div>';
				}
				updateRunOutputUi();
				updateRunOutputSizing();
				addAiChatEntry("user", "🎨 " + imgPrompt, chatContextKey);
				addAiChatEntry("ai", "[Bild generiert: " + imgPrompt.slice(0, 80) + "]", chatContextKey);
				clearAiPromptAfterResponse(imgPrompt);
			} catch (e) {
				const msg = e && e.message ? String(e.message) : "Error";
				setPreviewRunOutput({
					status: "AI error",
					output: "",
					error: msg,
					source: "ai",
				});
				toast("Image generation failed: " + msg, "error");
			} finally {
				setRunOutputProcessing(false);
			}
			return;
		}

		const parsed = parseRunnableFromEditor();
		const editorText = String(textarea && textarea.value ? textarea.value : "");
		const lang = String(parsed && parsed.lang ? parsed.lang : "")
			.trim()
			.toLowerCase();
		const code = String(parsed && parsed.code ? parsed.code : "");

		const prompt = getAiPrompt();
		if (prompt) saveAiPrompt(prompt);
		const promptForChat = String(prompt || "").trim();
		const chatContextKey = getAiChatContextKey();
		const usePreview = getAiUsePreview();
		const followUpEnabled = getAiUseAnswer();
		const lastAiOutput =
			followUpEnabled && previewRunState && previewRunState.source === "ai"
				? String(previewRunState.output || "")
				: "";
		const followUpSnippet = String(lastAiOutput || "")
			.trim()
			.slice(0, 2000);
		const hasFollowUpContext = Boolean(followUpSnippet);
		const hasCode = Boolean(String(code || "").trim());
		if (mode === "run" && !hasCode) {
			setPreviewRunOutput({ status: "", output: "", error: "", source: "" });
			toast(
				"No runnable code found. Use #lang-python/#lang-js or a fenced ```lang code block.",
				"info"
			);
			return;
		}
		let kind = mode === "run" ? "code" : hasCode ? "code" : "text";
		let payloadText = kind === "code" ? code : editorText;
		let payloadLang = kind === "code" ? lang || "" : "text";
		let promptForRequest = prompt;
		const aiConfig = getAiApiConfig();
		if (mode !== "run" && !usePreview) {
			if (!prompt) {
				setPreviewRunOutput({ status: "", output: "", error: "", source: "" });
				toast("Bitte eine Frage eingeben.", "info");
				return;
			}
			kind = "text";
			payloadText = hasFollowUpContext ? followUpSnippet : prompt;
			payloadLang = "text";
			promptForRequest = hasFollowUpContext ? prompt : "";
		} else if (mode !== "run" && usePreview) {
			if (!String(editorText || "").trim() && prompt) {
				kind = "text";
				payloadText = prompt;
				payloadLang = "text";
				promptForRequest = "";
			}
		}
		if (mode !== "run" && usePreview && prompt && hasFollowUpContext) {
			promptForRequest = `Nachfrage: ${prompt}\n\nVorherige AI-Antwort:\n${followUpSnippet}`;
		}
		if (!String(payloadText || "").trim()) {
			setPreviewRunOutput({ status: "", output: "", error: "", source: "" });
			toast("Nothing to send.", "info");
			return;
		}
		setRunOutputProcessing(true);
		setPreviewRunOutput({
			status: `AI (${mode})…`,
			output: "",
			error: "",
			source: "ai",
		});
		try {
			const body = {
				mode,
				lang: payloadLang,
				kind,
				code: payloadText,
				prompt: promptForRequest,
			};
			if (aiConfig.apiKey) body.apiKey = aiConfig.apiKey;
			if (aiConfig.model) body.model = aiConfig.model;
			const res = await api("/api/ai", {
				method: "POST",
				body: JSON.stringify(body),
			});
			const aiText = String(res && res.text ? res.text : "");
			const usedModel = res && res.model ? String(res.model) : "";
			setPreviewRunOutput({
				status: "AI",
				output: aiText,
				error: "",
				source: "ai",
			});
			if (usedModel) updateAiStatusWithModel(usedModel);
			if (promptForChat) addAiChatEntry("user", promptForChat, chatContextKey);
			if (aiText) addAiChatEntry("ai", aiText, chatContextKey);
			if (aiText) clearAiPromptAfterResponse(promptForChat);
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Error";
			setPreviewRunOutput({
				status: "AI error",
				output: "",
				error: msg,
				source: "ai",
			});
			toast(`AI failed: ${msg}`, "error");
		} finally {
			setRunOutputProcessing(false);
		}
	}

	async function refreshPersonalSpace() {
		if (psRefreshPromise) return psRefreshPromise;
		if (psTransition.isBlocked("refresh")) return;
		psRefreshPromise = _refreshPersonalSpaceImpl();
		try { return await psRefreshPromise; } finally { psRefreshPromise = null; }
	}

	async function _refreshPersonalSpaceImpl() {
		if (!psUnauthed || !psAuthed) return;
		const gen = psTransition.begin("refresh");
		// gen may be null if blocked by higher-prio transition — still run
		// the refresh but skip the render at the end (manager will queue it).
		psLastRefreshTs = Date.now();
		updateSyncStamp();

		const isOffline = typeof navigator !== "undefined" && navigator.onLine === false;
		// Snapshot: preserve previous valid state so we can restore on transient error
		const prevAuthed = psState && psState.authed;
		const prevNotes = psState && Array.isArray(psState.notes) ? psState.notes : [];

		try {
			if (isOffline) throw new Error("offline");
			const me = await api("/api/personal-space/me");
			psState = me;
		} catch (e) {
			// Offline fallback: load notes from IndexedDB
			if (isOffline || (e && e.message === "offline")) {
				try {
					const cachedNotes = await offlineGetAllNotes();
					const cachedEmail = await offlineLoadMeta("email");
					if (cachedNotes.length || cachedEmail) {
						psState = {
							authed: true,
							email: cachedEmail || "",
							tags: [],
							notes: cachedNotes.filter((n) => !n.deletedAt),
							favorites: Array.isArray(psState && psState.favorites) ? psState.favorites : [],
							roomTabs: Array.isArray(psState && psState.roomTabs) ? psState.roomTabs : [],
							roomPins: Array.isArray(psState && psState.roomPins) ? psState.roomPins : [],
							sharedRooms: Array.isArray(psState && psState.sharedRooms) ? psState.sharedRooms : [],
						};
					} else {
						psState = { authed: false, email: "", tags: [], notes: [], favorites: [], roomTabs: [], roomPins: [], sharedRooms: [] };
					}
				} catch {
					psState = { authed: false, email: "", tags: [], notes: [], favorites: [], roomTabs: [], roomPins: [], sharedRooms: [] };
				}
			} else if (prevAuthed && prevNotes.length > 0) {
				// Transient API error while we had valid data — keep previous notes
				// instead of destroying the list. This prevents psList from going blank.
				console.warn("[ps] refresh failed, preserving previous state:", e && e.message);
				if (gen) psTransition.end(gen);
				return;
			} else {
				psState = {
					authed: false,
					email: "",
					tags: [],
					notes: [],
					favorites: [],
					roomTabs: [],
					roomPins: [],
					sharedRooms: [],
				};
			}
			if (psHint) setPsHintText("");
		}

		// Mirror notes to IndexedDB when online (full-sync: also clears deleted notes)
		if (!isOffline && psState.authed && Array.isArray(psState.notes)) {
			void offlinePutNotes(psState.notes);
			void offlineSaveMeta("email", psState.email || "");
		}
		psState.favorites = Array.isArray(psState.favorites)
			? dedupeFavorites(psState.favorites)
			: [];
		psState.roomTabs = Array.isArray(psState.roomTabs)
			? psState.roomTabs
			: [];
		psState.roomPins = Array.isArray(psState.roomPins)
			? psState.roomPins
			: [];
		psState.sharedRooms = Array.isArray(psState.sharedRooms)
			? psState.sharedRooms
			: [];
		psState.notes = filterRealNotes(
			(Array.isArray(psState.notes) ? psState.notes : [])
				.map((n) => ensureNoteUpdatedAt(n))
				.filter((n) => !n || !n.deletedAt)
		);

		if (!psState.authed) {
			psUnauthed.classList.remove("hidden");
			psAuthed.classList.add("hidden");
			if (psLogout) psLogout.classList.add("hidden");
			if (psUserAuthed) psUserAuthed.classList.add("hidden");
			if (psUserUnauthed) psUserUnauthed.classList.remove("hidden");
			if (psEmail) psEmail.textContent = "";
			linearApiKey = "";
			if (linearApiKeyInput) linearApiKeyInput.value = "";
			updateLinearApiStatus();
			bflApiKey = "";
			if (bflApiKeyInput) bflApiKeyInput.value = "";
			updateBflApiStatus();
			clearPsSelection();
			setPsEditorTagsVisible(false);
			updatePsPinnedToggle();
			updateFavoritesUI();
			renderRoomTabs();
			setPsAutoSaveStatus("");
			updatePsNoteNavButtons();
			maybeStartMobileAutoNoteSession();
			if (gen) psTransition.end(gen);
			return;
		}

		psUnauthed.classList.add("hidden");
		psAuthed.classList.remove("hidden");
		if (psLogout) psLogout.classList.remove("hidden");
		if (psEmail) psEmail.textContent = psState.email || "";
		if (psUserAuthed) psUserAuthed.classList.remove("hidden");
		if (psUserUnauthed) psUserUnauthed.classList.add("hidden");
		setPsEditorTagsVisible(true);
		await syncLinearApiKeyFromServer();
		await syncBflApiKeyFromServer();
		syncCalendarSettingsFromServer();
		const serverRoomPins = Array.isArray(psState.roomPins)
			? psState.roomPins
			: [];
		const mergedRoomPins = mergeRoomPinnedEntries(
			loadLocalRoomPinnedEntries(),
			serverRoomPins
		);
		saveRoomPinnedEntries(mergedRoomPins);
		psState.roomPins = mergedRoomPins;

		await loadPsCommentIndex();
		applyPersonalSpaceFiltersAndRender();
		syncPsEditingNoteTagsFromState();
		syncPsEditorTagsInput();
		updatePsPinnedToggle();
		updateFavoritesUI();
		await resetSharedRoomsIfNeeded();
		renderRoomTabs();
		updateEditorMetaYaml();
		updatePsNoteNavButtons();
		maybeStartMobileAutoNoteSession();
		await syncLocalRoomTabsToServer();
		await syncLocalSharedRoomsToServer();
		await syncLocalRoomPinsToServer(serverRoomPins);
		void loadCommentsForRoom();
		maybeApplyStartupFavoriteFromPs();
		if (gen) psTransition.end(gen);
	}

	function downloadJson(filename, obj) {
		try {
			const text = JSON.stringify(obj, null, 2);
			const blob = new Blob([text], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(url), 500);
		} catch {
			toast("Export failed.", "error");
		}
	}

	function ymd() {
		try {
			const d = new Date();
			const y = String(d.getFullYear());
			const m = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			return `${y}${m}${day}`;
		} catch {
			return "";
		}
	}

	async function fetchPersonalSpaceExport() {
		if (!psState || !psState.authed) {
			throw new Error("Personal Space not enabled");
		}
		const res = await api("/api/notes/export");
		return res && res.export ? res.export : { version: 1, notes: [] };
	}

	async function exportPersonalSpaceNotes() {
		if (!psState || !psState.authed) {
			toast("Please enable Personal Space first (sign in).", "error");
			return;
		}
		const hintEl = psTransferHint || psHint;
		try {
			if (hintEl) hintEl.textContent = "Exporting…";
			const payload = await fetchPersonalSpaceExport();
			downloadJson(`mirror-notes-${ymd() || "export"}.json`, payload);
			if (hintEl) hintEl.textContent = "Export ready.";
			toast("Export created.", "success");
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Error";
			if (hintEl) hintEl.textContent = "Export failed.";
			toast(`Export failed: ${msg}`, "error");
		}
	}

	async function importPersonalSpaceNotes(notes, mode) {
		const m = String(mode || "merge")
			.trim()
			.toLowerCase();
		const safeMode = m === "replace" ? "replace" : "merge";
		const hintEl = psTransferHint || psHint;
		try {
			if (hintEl) hintEl.textContent = "Importing…";
			const res = await api("/api/notes/import", {
				method: "POST",
				body: JSON.stringify({ mode: safeMode, notes }),
			});
			toast(
				`Import complete: ${res.imported || 0} new, ${
					res.updated || 0
				} updated, ${res.skipped || 0} skipped.`,
				"success"
			);
			if (hintEl) hintEl.textContent = "Import complete.";
			await refreshPersonalSpace();
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Error";
			if (hintEl) hintEl.textContent = "Import failed.";
			toast(`Import failed: ${msg}`, "error");
		}
	}

	function chunkTextIntoNotes(text, filename) {
		const raw = String(text || "").replace(/^\uFEFF/, "");
		const trimmed = raw.trim();
		if (!trimmed) return [];
		const name = String(filename || "import").trim();
		const now = Date.now();
		const normalized = trimmed.replace(/\r\n?/g, "\n");
		const hasHeading = /^(#|##)\s+\S/m.test(normalized);
		const label = hasHeading ? `Import: ${name}` : `# Import: ${name}`;
		const prefixed = hasHeading ? normalized : `${label}\n\n${normalized}`;
		return [{ text: prefixed.trim(), createdAt: now }];
	}

	async function importPersonalSpaceNotesFromText(text, mode) {
		let parsed;
		try {
			parsed = JSON.parse(String(text || ""));
		} catch {
			toast("Import: invalid JSON file.", "error");
			return;
		}
		const notes = Array.isArray(parsed)
			? parsed
			: Array.isArray(parsed && parsed.notes)
			? parsed.notes
			: Array.isArray(parsed && parsed.export && parsed.export.notes)
			? parsed.export.notes
			: [];
		if (!Array.isArray(notes)) {
			toast("Import: no notes found.", "error");
			return;
		}
		await importPersonalSpaceNotes(notes, mode);
	}

	async function importPersonalSpaceFile(file, mode) {
		if (!file) return;
		const name = String(file.name || "");
		const isJson =
			/\.json$/i.test(name) ||
			String(file.type || "")
				.toLowerCase()
				.includes("json");
		let text = "";
		try {
			text = await file.text();
		} catch {
			toast("Import failed (file read).", "error");
			return;
		}
		if (isJson) {
			await importPersonalSpaceNotesFromText(text, mode);
			return;
		}
		const notes = chunkTextIntoNotes(text, name || "import.md");
		if (!notes.length) {
			toast("Import: file is empty.", "error");
			return;
		}
		await importPersonalSpaceNotes(notes, mode);
	}

	function startNotesImport(mode) {
		if (!psImportFileInput) return;
		if (!psState || !psState.authed) {
			toast("Please enable Personal Space first (sign in).", "error");
			return;
		}
		psNextImportMode = String(mode || "merge")
			.trim()
			.toLowerCase();
		try {
			psImportFileInput.value = "";
		} catch {
			// ignore
		}
		psImportFileInput.click();
	}

	async function requestPersonalSpaceLink() {
		const raw = await modalPrompt("Email address for your Personal Space:", {
			title: "Personal Space",
			okText: "Send link",
			cancelText: "Cancel",
			type: "email",
			autocomplete: "email",
			placeholder: "name@example.com",
			backdropClose: true,
		});
		const email = String(raw || "").trim();
		if (!email) return;
		try {
			const res = await api("/api/personal-space/request-link", {
				method: "POST",
				body: JSON.stringify({ email }),
			});
			if (res.sent) {
				toast("Link sent. Check your email.", "success");
				if (psDevLink) psDevLink.classList.add("hidden");
				return;
			}
			// Dev-/Fallback: Link anzeigen (nur wenn Server ihn explizit zurückgibt)
			if (psDevLink && res.link) {
				toast("SMTP/sending not enabled — showing link (dev).", "info");
				psDevLink.classList.remove("hidden");
				psDevLink.innerHTML = `<div class="text-slate-300">Verification link:</div><a class="mt-1 block break-all underline decoration-white/20 underline-offset-4 hover:decoration-white/50" href="${res.link}">${res.link}</a>`;
				return;
			}
			if (psDevLink) psDevLink.classList.add("hidden");
			const reason = res && res.reason ? String(res.reason) : "unknown";
			const hint =
				reason === "smtp_not_configured"
					? "SMTP is not configured."
					: reason === "smtp_incomplete"
					? "SMTP secrets are incomplete."
					: reason === "send_failed"
					? "SMTP send failed."
					: "Check SMTP/setup.";
			toast(`Email not sent: ${hint} (${reason})`, "error");
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Unknown error";
			toast(`Could not create link: ${msg}`, "error");
		}
	}

	function randomRoom() {
		const prefixes = [
			"Dark",
			"Kubernetes",
			"Kubernetics",
			"Byte",
			"Hack",
			"Code",
			"Pixel",
			"Nerd",
			"Retro",
			"Quantum",
			"Dungeon",
			"Terminal",
			"Matrix",
			"Syntax",
			"Kernel",
			"Cache",
			"Compile",
			"Docker",
			"Git",
			"Linux",
			"Neon",
			"Vector",
		];

		const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
		const number = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
		return normalizeRoom(`${prefix}Room${number}`);
	}

	const AUTO_ROOM_KEY = "mirror_auto_room_v1";
	let startupApplied = false;
	let autoSelectedRoom = false;
	let autoSelectedRoomName = "";
	let autoSelectedKey = "";

	let { room, key } = parseRoomAndKeyFromHash();
	if (!room) {
		const favs = dedupeFavorites(loadFavorites());
		const startupFav = favs.find((f) => f.isStartup);
		if (startupFav) {
			room = startupFav.room;
			key = startupFav.key;
			startupApplied = true;
		} else {
			room = randomRoom();
			key = randomKey();
			autoSelectedRoom = true;
			autoSelectedRoomName = room;
			autoSelectedKey = key;
			try {
				localStorage.setItem(
					AUTO_ROOM_KEY,
					JSON.stringify({ room, key })
				);
			} catch {
				// ignore
			}
		}
		location.hash = buildShareHash(room, key);
	}

	const RECENT_KEY = "mirror_recent_rooms";
	const FAVORITES_KEY = "mirror_favorites_v1";
	const ROOM_TABS_KEY = "mirror_room_tabs_v1";
	const NOTE_ROOM_BINDINGS_KEY = "mirror_note_room_bindings_v1";
	const ROOM_PINNED_KEY = "mirror_room_pinned_v1";
	const ROOM_SHARED_PINNED_KEY = "mirror_room_shared_pinned_v1";
	const SHARED_ROOMS_KEY = "mirror_shared_rooms_v1";
	const SHARED_ROOMS_RESET_KEY = "mirror_shared_rooms_reset_v1";
	const SHARED_ROOMS_FILTER_KEY = "mirror_shared_rooms_filter_v1";
	const COMMENT_STORAGE_KEY = "mirror_comments_v1";
	const CALENDAR_SOURCES_KEY = "mirror_calendar_sources_v1";
	const CALENDAR_LOCAL_EVENTS_KEY = "mirror_calendar_local_events_v1";
	const CALENDAR_DEFAULT_VIEW_KEY = "mirror_calendar_default_view_v1";
	const CALENDAR_FREE_SLOTS_KEY = "mirror_calendar_free_slots_v1";
	const CALENDAR_GOOGLE_CAL_ID_KEY = "mirror_calendar_google_id_v1";
	const CALENDAR_OUTLOOK_CAL_ID_KEY = "mirror_calendar_outlook_id_v1";
	const CALENDAR_SYNC_TARGET_KEY = "mirror_calendar_sync_target_v1";
	const CALENDAR_VIEWS = ["day", "week", "month"];
	const CALENDAR_SETTINGS_SYNC_DELAY = 1200;
	const CALENDAR_WORK_START_HOUR = 9;
	const CALENDAR_WORK_END_HOUR = 18;
	const CALENDAR_LOCAL_SOURCE = {
		id: "local",
		name: "Eigene Termine",
		color: "#f59e0b",
	};
	const CALENDAR_GOOGLE_SOURCE = {
		id: "google",
		name: "Google Calendar",
		color: "#4285f4",
	};
	const CALENDAR_OUTLOOK_SOURCE = {
		id: "outlook",
		name: "Outlook Calendar",
		color: "#0a6cce",
	};
	const MAX_ROOM_TABS = 5;
	let pendingRoomBootstrapText = "";
	let pendingClosedTab = null;
	let roomTabLimitNoticeAt = 0;
	let skipTabLimitCheck = false;
	let calendarPanelActive = false;
	let calendarRefreshTimer = 0;
	let calendarSidebarCollapsed = false;
	let calendarSettingsSyncTimer = 0;
	let calendarSettingsSyncPayload = null;
	let calendarSettingsSyncInFlight = false;
	let calendarSettingsSyncQueued = false;
	let calendarFreeSlotsVisible = true;
	let commonFreeSlotsSharing = false;
	const COMMON_FREE_SLOTS_KEY = "mirror_calendar_common_sharing_v1";
	const MANUAL_FREE_SLOTS_KEY = "mirror_calendar_manual_free_v2";
	/** Day key (YYYY-MM-DD) currently highlighted via "My Selections" jump */
	let calendarFocusedDayKey = "";
	let calendarFocusedDayTimer = 0;
	/** Map<clientId, { name, color, busy: Array<{start:number, end:number}> }> */
	const availabilityByClient = new Map();
	/** Map<dayKey(YYYY-MM-DD), Set<slotKey(startMs_endMs)>> – manually selected free slots */
	let manualFreeSlots = new Map();
	let googleCalendarConnected = false;
	let googleCalendarList = [];
	let outlookCalendarConnected = false;
	let outlookCalendarList = [];
	const calendarState = {
		view: "month",
		cursor: new Date(),
		externalEvents: [],
		localEvents: [],
		loading: false,
		lastLoadedAt: 0,
	};

	function normalizeFavoriteEntry(it) {
		const roomName = normalizeRoom(it && it.room);
		const keyName = normalizeKey(it && it.key);
		const addedAt = Number(it && (it.addedAt || it.added_at)) || 0;
		const text = String(it && it.text ? it.text : "");
		const isStartup = Boolean(it && it.isStartup);
		if (!roomName) return null;
		return { room: roomName, key: keyName, addedAt, text, isStartup };
	}

	function dedupeFavorites(list) {
		const out = [];
		const index = new Map();
		for (const entry of list) {
			const normalized = normalizeFavoriteEntry(entry);
			if (!normalized) continue;
			const keyId = `${normalized.room}:${normalized.key}`;
			if (!index.has(keyId)) {
				index.set(keyId, out.length);
				out.push(normalized);
				continue;
			}
			const idx = index.get(keyId);
			const prev = out[idx];
			out[idx] = {
				...prev,
				...normalized,
				addedAt: Math.max(prev.addedAt || 0, normalized.addedAt || 0),
				text: normalized.text || prev.text || "",
			};
		}
		const byRoom = new Map();
		for (const entry of out) {
			const roomName = entry.room;
			if (!byRoom.has(roomName)) byRoom.set(roomName, []);
			byRoom.get(roomName).push(entry);
		}
		const trimmed = [];
		for (const entries of byRoom.values()) {
			const hasKey = entries.some((e) => e.key);
			for (const e of entries) {
				if (!e.key && hasKey) continue;
				trimmed.push(e);
			}
		}
		return trimmed;
	}

	function normalizeRoomTabEntry(it) {
		const roomName = normalizeRoom(it && it.room);
		const keyName = normalizeKey(it && it.key);
		const lastUsed = Number(it && it.lastUsed) || 0;
		const noteId = String(it && (it.noteId || it.note_id) ? it.noteId || it.note_id : "").trim();
		const rawText = String(it && it.text ? it.text : "");
		const text = noteId ? "" : rawText;
		if (!roomName) return null;
		return { room: roomName, key: keyName, lastUsed, text, noteId };
	}

	function dedupeRoomTabs(list) {
		const out = [];
		const index = new Map();
		for (const entry of list) {
			const roomName = normalizeRoom(entry && entry.room);
			const keyName = normalizeKey(entry && entry.key);
			if (!roomName) continue;
			const keyId = `${roomName}:${keyName}`;
			const normalized = normalizeRoomTabEntry({
				...entry,
				room: roomName,
				key: keyName,
			});
			if (!normalized) continue;
			if (!index.has(keyId)) {
				index.set(keyId, out.length);
				out.push(normalized);
				continue;
			}
			const idx = index.get(keyId);
			const prev = out[idx];
			const noteId = normalized.noteId || prev.noteId || "";
			const text = noteId ? "" : normalized.text || prev.text || "";
			out[idx] = {
				...prev,
				...normalized,
				noteId,
				text,
				lastUsed: Math.max(prev.lastUsed || 0, normalized.lastUsed || 0),
			};
		}
		const byRoom = new Map();
		for (const entry of out) {
			const roomName = entry.room;
			if (!byRoom.has(roomName)) byRoom.set(roomName, []);
			byRoom.get(roomName).push(entry);
		}
		const trimmed = [];
		for (const entries of byRoom.values()) {
			const hasKey = entries.some((e) => e.key);
			for (const e of entries) {
				if (!e.key && hasKey) continue;
				trimmed.push(e);
			}
		}
		return trimmed;
	}

	function showRoomTabLimitModal() {
		const minGap = 3000;
		if (Date.now() - roomTabLimitNoticeAt <= minGap) return;
		roomTabLimitNoticeAt = Date.now();
		return openModal({
			title: "Tab-Limit erreicht",
			message: `Maximal ${MAX_ROOM_TABS} Tabs erlaubt.`,
			okText: "OK",
			cancelText: "Schließen",
			backdropClose: true,
		});
	}

	function mergeRoomTabs(localTabs, serverTabs) {
		const map = new Map();
		const add = (entry, preferText) => {
			const normalized = normalizeRoomTabEntry(entry);
			if (!normalized) return;
			const keyId = `${normalized.room}:${normalized.key}`;
			const existing = map.get(keyId);
			if (!existing) {
				map.set(keyId, normalized);
				return;
			}
			const useNoteId = preferText
				? normalized.noteId || existing.noteId || ""
				: existing.noteId || normalized.noteId || "";
			const useText = useNoteId
				? ""
				: preferText
					? normalized.text || existing.text || ""
					: existing.text || normalized.text || "";
			map.set(keyId, {
				...existing,
				...normalized,
				noteId: useNoteId,
				text: useText,
				lastUsed: Math.max(existing.lastUsed || 0, normalized.lastUsed || 0),
			});
		};
		for (const s of serverTabs || []) add(s, false);
		for (const l of localTabs || []) add(l, true);
		return Array.from(map.values());
	}

	function normalizeSharedRoomEntry(it) {
		const roomName = normalizeRoom(it && it.room);
		const keyName = normalizeKey(it && it.key);
		const updatedAt = Number(it && it.updatedAt) || 0;
		if (!roomName) return null;
		return { room: roomName, key: keyName, updatedAt };
	}

	function mergeSharedRooms(localList, serverList) {
		const map = new Map();
		const add = (entry) => {
			const normalized = normalizeSharedRoomEntry(entry);
			if (!normalized) return;
			const keyId = `${normalized.room}:${normalized.key}`;
			const existing = map.get(keyId);
			if (!existing || normalized.updatedAt > existing.updatedAt) {
				map.set(keyId, normalized);
			}
		};
		for (const s of serverList || []) add(s);
		for (const l of localList || []) add(l);
		return Array.from(map.values());
	}

	function loadLocalSharedRooms() {
		try {
			const raw = localStorage.getItem(SHARED_ROOMS_KEY);
			const parsed = JSON.parse(raw || "[]");
			if (!Array.isArray(parsed)) return [];
			const cleaned = parsed.map(normalizeSharedRoomEntry).filter(Boolean);
			if (cleaned.length !== parsed.length) {
				localStorage.setItem(SHARED_ROOMS_KEY, JSON.stringify(cleaned));
			}
			return cleaned;
		} catch {
			return [];
		}
	}

	function loadSharedRoomsFilterValue() {
		try {
			return String(localStorage.getItem(SHARED_ROOMS_FILTER_KEY) || "");
		} catch {
			return "";
		}
	}

	function saveSharedRoomsFilterValue(value) {
		try {
			localStorage.setItem(
				SHARED_ROOMS_FILTER_KEY,
				String(value || "")
			);
		} catch {
			// ignore
		}
	}

	function loadSharedRooms() {
		const local = loadLocalSharedRooms();
		if (psState && psState.authed) {
			const server = Array.isArray(psState.sharedRooms)
				? psState.sharedRooms
				: [];
			return mergeSharedRooms(local, server);
		}
		return local;
	}

	function saveSharedRooms(list) {
		try {
			const cleaned = Array.isArray(list)
				? list.map(normalizeSharedRoomEntry).filter(Boolean)
				: [];
			localStorage.setItem(SHARED_ROOMS_KEY, JSON.stringify(cleaned));
			if (psState && psState.authed) {
				const server = Array.isArray(psState.sharedRooms)
					? psState.sharedRooms
					: [];
				psState.sharedRooms = mergeSharedRooms(server, cleaned);
			}
		} catch {
			// ignore
		}
	}

	function isRoomMarkedShared(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return false;
		return loadSharedRooms().some(
			(r) => r.room === nextRoom && r.key === nextKey
		);
	}

	function markRoomShared(roomName, keyName, options) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return false;
		const keyId = `${nextRoom}:${nextKey}`;
		// Skip automatic (WebSocket-driven) re-marking if user explicitly un-shared
		if (!(options && options.manual) && manuallyUnsharedRooms.has(keyId)) {
			return false;
		}
		const list = loadSharedRooms();
		const filtered = list.filter((r) => `${r.room}:${r.key}` !== keyId);
		filtered.push({ room: nextRoom, key: nextKey, updatedAt: Date.now() });
		saveSharedRooms(filtered);
		if (psState && psState.authed) {
			syncSharedRoomToServer({
				room: nextRoom,
				key: nextKey,
				updatedAt: Date.now(),
			});
		}
		renderSharedRoomsManager();
		// Auto-save shared room as favorite so the user can always find it again
		ensureFavoriteForSharedRoom(nextRoom, nextKey);
		return filtered.length !== list.length;
	}

	/**
	 * Ensures a shared room is saved as a favorite automatically.
	 * This guarantees the user can always return to a shared room,
	 * even after closing the browser or clearing tabs.
	 */
	function ensureFavoriteForSharedRoom(roomName, keyName) {
		const favs = loadFavorites();
		const alreadyFav = favs.some(
			(f) => f.room === roomName && f.key === keyName
		);
		if (alreadyFav) return;
		const textSnapshot = String(
			textarea && textarea.value ? textarea.value : ""
		);
		const entry = normalizeFavoriteEntry({
			room: roomName,
			key: keyName,
			addedAt: Date.now(),
			text: textSnapshot,
		});
		if (!entry) return;
		const next = dedupeFavorites([entry, ...favs]).slice(0, 20);
		saveFavorites(next);
		if (psState && psState.authed) {
			api("/api/favorites", {
				method: "POST",
				body: JSON.stringify({
					room: roomName,
					key: keyName,
					text: textSnapshot,
				}),
			}).catch(() => {
				// ignore – favorite will sync on next PS refresh
			});
		}
		updateFavoritesUI();
	}

	function removeSharedRoom(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const list = loadSharedRooms();
		const keyId = `${nextRoom}:${nextKey}`;
		const filtered = list.filter((r) => `${r.room}:${r.key}` !== keyId);
		manuallyUnsharedRooms.add(keyId);
		saveSharedRooms(filtered);
		if (psState && psState.authed) {
			api("/api/shared-rooms", {
				method: "DELETE",
				body: JSON.stringify({ room: nextRoom, key: nextKey }),
			}).catch(() => {
				// ignore
			});
			psState.sharedRooms = filtered;
		}
		renderRoomTabs();
		renderSharedRoomsManager();
	}

	async function clearSharedRooms() {
		// Prevent WebSocket auto-re-marking for all currently shared rooms
		for (const r of loadSharedRooms()) {
			manuallyUnsharedRooms.add(`${r.room}:${r.key}`);
		}
		saveSharedRooms([]);
		if (psState && psState.authed) {
			try {
				await api("/api/shared-rooms", {
					method: "DELETE",
					body: JSON.stringify({ all: true }),
				});
			} catch {
				// ignore
			}
			psState.sharedRooms = [];
		}
		renderRoomTabs();
		renderSharedRoomsManager();
	}

	function normalizeNoteRoomBinding(it) {
		const noteId = String(it && it.noteId ? it.noteId : "").trim();
		const roomName = normalizeRoom(it && it.room);
		const keyName = normalizeKey(it && it.key);
		const updatedAt = Number(it && it.updatedAt) || 0;
		if (!noteId || !roomName) return null;
		return { noteId, room: roomName, key: keyName, updatedAt };
	}

	function mergeNoteRoomBindings(list) {
		const byNote = new Map();
		const byRoom = new Map();
		for (const entry of list || []) {
			const normalized = normalizeNoteRoomBinding(entry);
			if (!normalized) continue;
			const roomKey = `${normalized.room}:${normalized.key}`;
			const prevByNote = byNote.get(normalized.noteId);
			const prevByRoom = byRoom.get(roomKey);
			if (prevByNote && prevByNote.updatedAt >= normalized.updatedAt) continue;
			if (prevByRoom && prevByRoom.updatedAt > normalized.updatedAt) continue;
			if (prevByRoom && prevByRoom.noteId !== normalized.noteId) {
				byNote.delete(prevByRoom.noteId);
			}
			if (prevByNote) {
				const prevRoomKey = `${prevByNote.room}:${prevByNote.key}`;
				byRoom.delete(prevRoomKey);
			}
			byNote.set(normalized.noteId, normalized);
			byRoom.set(roomKey, normalized);
		}
		return Array.from(byNote.values());
	}

	function normalizeRoomPinnedEntry(it) {
		const roomName = normalizeRoom(it && it.room);
		const keyName = normalizeKey(it && it.key);
		const noteId = String(
			it && (it.noteId || it.note_id) ? it.noteId || it.note_id : ""
		).trim();
		const updatedAt = Number(it && (it.updatedAt || it.updated_at)) || 0;
		const rawText = String(it && it.text ? it.text : "");
		const text = noteId ? "" : rawText;
		if (!roomName) return null;
		return { room: roomName, key: keyName, noteId, text, updatedAt };
	}

	function mergeRoomPinnedEntries(localList, serverList) {
		const map = new Map();
		const add = (entry) => {
			const normalized = normalizeRoomPinnedEntry(entry);
			if (!normalized) return;
			const keyId = `${normalized.room}:${normalized.key}`;
			const existing = map.get(keyId);
			if (!existing || normalized.updatedAt >= existing.updatedAt) {
				map.set(keyId, normalized);
			}
		};
		for (const s of serverList || []) add(s);
		for (const l of localList || []) add(l);
		return Array.from(map.values());
	}

	function loadSharedRoomPinnedEntries() {
		try {
			const raw = localStorage.getItem(ROOM_SHARED_PINNED_KEY);
			const parsed = JSON.parse(raw || "[]");
			if (!Array.isArray(parsed)) return [];
			const cleaned = parsed
				.map(normalizeRoomPinnedEntry)
				.filter(Boolean);
			if (cleaned.length !== parsed.length) {
				saveSharedRoomPinnedEntries(cleaned);
			}
			return cleaned;
		} catch {
			return [];
		}
	}

	function saveSharedRoomPinnedEntries(list) {
		try {
			const cleaned = Array.isArray(list)
				? list.map(normalizeRoomPinnedEntry).filter(Boolean)
				: [];
			localStorage.setItem(ROOM_SHARED_PINNED_KEY, JSON.stringify(cleaned));
		} catch {
			// ignore
		}
	}

	function setSharedRoomPinnedEntry(roomName, keyName, payload) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const base = normalizeRoomPinnedEntry({
			room: nextRoom,
			key: nextKey,
			noteId: payload && payload.noteId ? payload.noteId : "",
			text: payload && payload.text ? payload.text : "",
			updatedAt: Number(payload && payload.updatedAt) || Date.now(),
		});
		if (!base) return;
		const list = loadSharedRoomPinnedEntries().filter(
			(e) => !(e.room === nextRoom && e.key === nextKey)
		);
		list.push(base);
		saveSharedRoomPinnedEntries(list);
	}

	function clearSharedRoomPinnedEntry(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const list = loadSharedRoomPinnedEntries().filter(
			(e) => !(e.room === nextRoom && e.key === nextKey)
		);
		saveSharedRoomPinnedEntries(list);
	}

	function loadLocalRoomPinnedEntries() {
		try {
			const raw = localStorage.getItem(ROOM_PINNED_KEY);
			const parsed = JSON.parse(raw || "[]");
			if (!Array.isArray(parsed)) return [];
			const cleaned = parsed
				.map(normalizeRoomPinnedEntry)
				.filter(Boolean);
			if (cleaned.length !== parsed.length) {
				saveRoomPinnedEntries(cleaned);
			}
			return cleaned;
		} catch {
			return [];
		}
	}

	function loadRoomPinnedEntries() {
		const localPins = loadLocalRoomPinnedEntries();
		const sharedPins = loadSharedRoomPinnedEntries();
		if (psState && psState.authed) {
			const serverPins = Array.isArray(psState.roomPins)
				? psState.roomPins
				: [];
			const mergedLocal = mergeRoomPinnedEntries(sharedPins, localPins);
			return mergeRoomPinnedEntries(mergedLocal, serverPins);
		}
		return mergeRoomPinnedEntries(sharedPins, localPins);
	}

	function saveRoomPinnedEntries(list) {
		try {
			const cleaned = Array.isArray(list)
				? list.map(normalizeRoomPinnedEntry).filter(Boolean)
				: [];
			localStorage.setItem(ROOM_PINNED_KEY, JSON.stringify(cleaned));
			if (psState && psState.authed) {
				psState.roomPins = cleaned;
			}
		} catch {
			// ignore
		}
	}

	function getRoomPinnedEntry(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return null;
		return (
			loadRoomPinnedEntries().find(
				(e) => e.room === nextRoom && e.key === nextKey
			) || null
		);
	}

	function setRoomPinnedEntry(roomName, keyName, payload) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const base = normalizeRoomPinnedEntry({
			room: nextRoom,
			key: nextKey,
			noteId: payload && payload.noteId ? payload.noteId : "",
			text: payload && payload.text ? payload.text : "",
			updatedAt: Date.now(),
		});
		if (!base) return;
		const list = loadRoomPinnedEntries().filter(
			(e) => !(e.room === nextRoom && e.key === nextKey)
		);
		list.push(base);
		saveRoomPinnedEntries(list);
		if (psState && psState.authed) {
			syncRoomPinToServer(base);
		}
	}

	function clearRoomPinnedEntry(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		// Also clear shared pin so loadRoomPinnedEntries() merges don't resurrect it
		clearSharedRoomPinnedEntry(nextRoom, nextKey);
		const list = loadRoomPinnedEntries().filter(
			(e) => !(e.room === nextRoom && e.key === nextKey)
		);
		saveRoomPinnedEntries(list);
		if (psState && psState.authed) {
			api("/api/room-pins", {
				method: "DELETE",
				body: JSON.stringify({ room: nextRoom, key: nextKey }),
			}).catch(() => {
				// ignore
			});
			removeRoomPinFromState(nextRoom, nextKey);
		}
	}

	function sendRoomPinStateForRoom(roomName, keyName, payload) {
		if (!ws || ws.readyState !== WebSocket.OPEN) return;
		const nextRoom = normalizeRoom(roomName);
		if (!nextRoom) return;
		const noteId = String(payload && payload.noteId ? payload.noteId : "").trim();
		const textVal = noteId ? "" : String(payload && payload.text ? payload.text : "");
		const updatedAt = Number(payload && payload.updatedAt) || Date.now();
		sendMessage({
			type: "room_pin_state",
			room: nextRoom,
			clientId,
			noteId,
			text: textVal,
			updatedAt,
		});
	}

	function isPinnedContentActiveForRoom(roomName, keyName, activeNoteId) {
		const pinned = getRoomPinnedEntry(roomName, keyName);
		if (!pinned) return true;
		const activeId = String(activeNoteId || "").trim();
		if (pinned.noteId) {
			if (!psState || !psState.authed) return true;
			return pinned.noteId === activeId;
		}
		return !activeId;
	}

	function shouldSyncRoomContentNow() {
		return isPinnedContentActiveForRoom(room, key, psEditingNoteId);
	}

	function syncPermanentLinkToggleUi() {
		if (!togglePermanentLinkBtn) return;
		const pinned = getRoomPinnedEntry(room, key);
		const active = Boolean(pinned);
		const label = active ? t("editor.permalink_active") : t("editor.permalink");
		togglePermanentLinkBtn.setAttribute("aria-pressed", active ? "true" : "false");
		togglePermanentLinkBtn.setAttribute("title", label);
		togglePermanentLinkBtn.setAttribute("aria-label", label);
	}

	function loadNoteRoomBindings() {
		try {
			const raw = localStorage.getItem(NOTE_ROOM_BINDINGS_KEY);
			const parsed = JSON.parse(raw || "[]");
			if (!Array.isArray(parsed)) return [];
			const cleaned = mergeNoteRoomBindings(parsed);
			if (cleaned.length !== parsed.length) saveNoteRoomBindings(cleaned);
			return cleaned;
		} catch {
			return [];
		}
	}

	function saveNoteRoomBindings(list) {
		try {
			const cleaned = mergeNoteRoomBindings(Array.isArray(list) ? list : []);
			localStorage.setItem(NOTE_ROOM_BINDINGS_KEY, JSON.stringify(cleaned));
		} catch {
			// ignore
		}
	}

	function findNoteRoomBindingByNoteId(noteId) {
		const target = String(noteId || "").trim();
		if (!target) return null;
		return loadNoteRoomBindings().find((b) => b.noteId === target) || null;
	}

	function findNoteRoomBindingByRoom(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return null;
		return (
			loadNoteRoomBindings().find(
				(b) => b.room === nextRoom && b.key === nextKey
			) || null
		);
	}

	function removeNoteRoomBindingByNoteId(noteId) {
		const target = String(noteId || "").trim();
		if (!target) return;
		const list = loadNoteRoomBindings().filter((b) => b.noteId !== target);
		saveNoteRoomBindings(list);
		const tabs = dedupeRoomTabs(loadRoomTabs());
		let changed = false;
		const nextTabs = tabs.map((t) => {
			if (!t || String(t.noteId || "") !== target) return t;
			changed = true;
			return { ...t, noteId: "", text: t.text || "" };
		});
		if (changed) saveRoomTabs(nextTabs);
	}

	function removeNoteRoomBindingByRoom(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const pinned = getRoomPinnedEntry(nextRoom, nextKey);
		if (pinned && pinned.noteId) return;
		const list = loadNoteRoomBindings().filter(
			(b) => !(b.room === nextRoom && b.key === nextKey)
		);
		saveNoteRoomBindings(list);
	}

	function upsertNoteRoomBinding(noteId, roomName, keyName) {
		const targetId = String(noteId || "").trim();
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!targetId || !nextRoom) return;
		const roomKey = `${nextRoom}:${nextKey}`;
		const next = loadNoteRoomBindings().filter(
			(b) => b.noteId !== targetId && `${b.room}:${b.key}` !== roomKey
		);
		next.push({
			noteId: targetId,
			room: nextRoom,
			key: nextKey,
			updatedAt: Date.now(),
		});
		saveNoteRoomBindings(next);
	}

	function getRoomTabNoteIdForRoom(roomName, keyName) {
		const activeNoteId = getActiveRoomTabNoteId();
		if (activeNoteId) return activeNoteId;
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return "";
		const pinned = getRoomPinnedEntry(nextRoom, nextKey);
		if (pinned && pinned.noteId) return String(pinned.noteId || "").trim();
		const tabs = loadRoomTabs();
		const cached = tabs.find((t) => t.room === nextRoom && t.key === nextKey);
		if (cached && cached.noteId) return String(cached.noteId || "").trim();
		const bound = findNoteRoomBindingByRoom(nextRoom, nextKey);
		return bound && bound.noteId ? String(bound.noteId || "").trim() : "";
	}

	function loadLocalRoomTabs() {
		try {
			const raw = localStorage.getItem(ROOM_TABS_KEY);
			const parsed = JSON.parse(raw || "[]");
			if (!Array.isArray(parsed)) return [];
			const cleaned = dedupeRoomTabs(
				parsed.map(normalizeRoomTabEntry).filter(Boolean)
			);
			if (cleaned.length !== parsed.length) saveRoomTabs(cleaned);
			return cleaned;
		} catch {
			return [];
		}
	}

	function loadRoomTabs() {
		if (psState && psState.authed) {
			const serverTabs = Array.isArray(psState.roomTabs) ? psState.roomTabs : [];
			const localTabs = loadLocalRoomTabs();
			return dedupeRoomTabs(mergeRoomTabs(localTabs, serverTabs));
		}
		return loadLocalRoomTabs();
	}

	function saveRoomTabs(list) {
		try {
			const cleaned = Array.isArray(list) ? dedupeRoomTabs(list) : [];
			localStorage.setItem(ROOM_TABS_KEY, JSON.stringify(cleaned));
		} catch {
			// ignore
		}
		if (psState && psState.authed) {
			psState.roomTabs = Array.isArray(list) ? dedupeRoomTabs(list) : [];
		}
	}

	function getActiveRoomTabNoteId() {
		return String(psEditingNoteId || "").trim();
	}

	function resolveRoomTabSnapshotText(noteId, fallbackText) {
		if (noteId) return "";
		if (typeof fallbackText === "string") return fallbackText;
		return textarea ? String(textarea.value || "") : "";
	}

	function upsertRoomTabInState(entry) {
		if (!psState || !psState.authed) return;
		const normalized = normalizeRoomTabEntry(entry);
		if (!normalized) return;
		const tabs = Array.isArray(psState.roomTabs) ? psState.roomTabs : [];
		const idx = tabs.findIndex(
			(t) => t.room === normalized.room && t.key === normalized.key
		);
		if (idx >= 0) {
			const updated = { ...tabs[idx], ...normalized };
			psState.roomTabs = [...tabs.slice(0, idx), updated, ...tabs.slice(idx + 1)];
			return;
		}
		psState.roomTabs = [normalized, ...tabs];
	}

	function removeRoomTabFromState(roomName, keyName) {
		if (!psState || !psState.authed) return;
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const tabs = Array.isArray(psState.roomTabs) ? psState.roomTabs : [];
		const idx = tabs.findIndex(
			(t) => t.room === nextRoom && t.key === nextKey
		);
		if (idx < 0) return;
		psState.roomTabs = [...tabs.slice(0, idx), ...tabs.slice(idx + 1)];
	}

	function updateRoomTabTextLocal(roomName, keyName, textVal) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const tabs = dedupeRoomTabs(loadRoomTabs());
		const idx = tabs.findIndex(
			(t) => t.room === nextRoom && t.key === nextKey
		);
		const activeNoteId = getActiveRoomTabNoteId();
		const existingNoteId =
			idx >= 0 ? String(tabs[idx].noteId || "").trim() : "";
		const bound = findNoteRoomBindingByRoom(nextRoom, nextKey);
		const boundNoteId = bound && bound.noteId ? String(bound.noteId || "").trim() : "";
		const noteId = activeNoteId || existingNoteId || boundNoteId;
		const text = resolveRoomTabSnapshotText(noteId, String(textVal ?? ""));
		if (idx >= 0) {
			const updated = { ...tabs[idx], text, noteId };
			tabs.splice(idx, 1, updated);
		} else {
			if (tabs.length >= MAX_ROOM_TABS) return;
			tabs.push({
				room: nextRoom,
				key: nextKey,
				lastUsed: Date.now(),
				text,
				noteId,
			});
		}
		saveRoomTabs(tabs);
	}

	function updateRoomTabsForNoteId(noteId, textVal) {
		const targetId = String(noteId || "").trim();
		if (!targetId) return;
		const tabs = dedupeRoomTabs(loadRoomTabs());
		let changed = false;
		const text = String(textVal ?? "");
		const nextTabs = tabs.map((t) => {
			if (!t || String(t.noteId || "").trim() !== targetId) return t;
			changed = true;
			return { ...t, text, noteId: targetId };
		});
		if (changed) saveRoomTabs(nextTabs);
	}

	function setRoomTabNoteId(roomName, keyName, noteId) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		const nextId = String(noteId || "").trim();
		if (!nextRoom) return;
		const tabs = dedupeRoomTabs(loadRoomTabs());
		const idx = tabs.findIndex(
			(t) => t.room === nextRoom && t.key === nextKey
		);
		if (!nextId) {
			if (idx >= 0) {
				const updated = { ...tabs[idx], noteId: "", text: tabs[idx].text || "" };
				tabs.splice(idx, 1, updated);
				saveRoomTabs(tabs);
			}
			removeNoteRoomBindingByRoom(nextRoom, nextKey);
			return;
		}
		const clearedTabs = tabs.map((t) => {
			if (!t) return t;
			if (t.room === nextRoom && t.key === nextKey) return t;
			if (String(t.noteId || "").trim() !== nextId) return t;
			return { ...t, noteId: "", text: t.text || "" };
		});
		const entry = {
			room: nextRoom,
			key: nextKey,
			lastUsed: Date.now(),
			noteId: nextId,
			text: "",
		};
		if (idx >= 0) {
			clearedTabs.splice(idx, 1, { ...clearedTabs[idx], ...entry });
		} else {
			if (clearedTabs.length >= MAX_ROOM_TABS) return;
			clearedTabs.push(entry);
		}
		saveRoomTabs(clearedTabs);
		upsertNoteRoomBinding(nextId, nextRoom, nextKey);
	}

	function findRoomTabByNoteId(noteId) {
		const targetId = String(noteId || "").trim();
		if (!targetId) return null;
		const direct = loadRoomTabs().find(
			(t) => String(t && t.noteId ? t.noteId : "") === targetId
		);
		if (direct) return direct;
		const bound = findNoteRoomBindingByNoteId(targetId);
		return bound ? { room: bound.room, key: bound.key, noteId: bound.noteId } : null;
	}

	function updateLocalNoteText(noteId, textVal) {
		const targetId = String(noteId || "").trim();
		if (!targetId) return;
		if (!psState || !Array.isArray(psState.notes)) return;
		const idx = psState.notes.findIndex(
			(n) => String(n && n.id ? n.id : "") === targetId
		);
		if (idx < 0) return;
		const text = String(textVal ?? "");
		const base = psState.notes[idx];
		const updated = {
			...base,
			text,
			updatedAt: Date.now(),
		};
		psState.notes = [
			...psState.notes.slice(0, idx),
			updated,
			...psState.notes.slice(idx + 1),
		];
	}

	function upsertFavoriteInState(entry) {
		if (!psState || !psState.authed) return;
		const normalized = normalizeFavoriteEntry(entry);
		if (!normalized) return;
		const favs = Array.isArray(psState.favorites) ? psState.favorites : [];
		const idx = favs.findIndex(
			(f) => f.room === normalized.room && f.key === normalized.key
		);
		if (idx >= 0) {
			const updated = { ...favs[idx], ...normalized };
			psState.favorites = [...favs.slice(0, idx), updated, ...favs.slice(idx + 1)];
			return;
		}
		psState.favorites = [normalized, ...favs];
	}

	function upsertSharedRoomInState(entry) {
		if (!psState || !psState.authed) return;
		const normalized = normalizeSharedRoomEntry(entry);
		if (!normalized) return;
		const shared = Array.isArray(psState.sharedRooms)
			? psState.sharedRooms
			: [];
		const idx = shared.findIndex(
			(s) => s.room === normalized.room && s.key === normalized.key
		);
		if (idx >= 0) {
			const updated = { ...shared[idx], ...normalized };
			psState.sharedRooms = [
				...shared.slice(0, idx),
				updated,
				...shared.slice(idx + 1),
			];
			return;
		}
		psState.sharedRooms = [normalized, ...shared];
	}

	function upsertRoomPinInState(entry) {
		if (!psState || !psState.authed) return;
		const normalized = normalizeRoomPinnedEntry(entry);
		if (!normalized) return;
		const pins = Array.isArray(psState.roomPins) ? psState.roomPins : [];
		const idx = pins.findIndex(
			(p) => p.room === normalized.room && p.key === normalized.key
		);
		if (idx >= 0) {
			const updated = { ...pins[idx], ...normalized };
			psState.roomPins = [
				...pins.slice(0, idx),
				updated,
				...pins.slice(idx + 1),
			];
			return;
		}
		psState.roomPins = [normalized, ...pins];
	}

	function removeRoomPinFromState(roomName, keyName) {
		if (!psState || !psState.authed) return;
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const pins = Array.isArray(psState.roomPins) ? psState.roomPins : [];
		const next = pins.filter(
			(p) => !(p.room === nextRoom && p.key === nextKey)
		);
		psState.roomPins = next;
	}

	let roomTabSyncTimer = 0;
	let roomTabSyncPayload = null;
	let roomTabSyncInFlight = false;
	let roomTabSyncQueued = false;
	let roomTabsSyncedFromLocal = false;
	let sharedRoomsSyncedFromLocal = false;
	let roomPinsSyncedFromLocal = false;

	/** Rooms the user explicitly un-shared; prevents WebSocket auto-re-marking. */
	const manuallyUnsharedRooms = new Set();

	async function syncSharedRoomToServer(payload) {
		if (!psState || !psState.authed) return;
		if (!payload || !payload.room) return;
		const roomName = normalizeRoom(payload.room);
		const keyName = normalizeKey(payload.key);
		if (!roomName) return;
		const updatedAt = Number(payload.updatedAt) || Date.now();
		try {
			const res = await api("/api/shared-rooms", {
				method: "POST",
				body: JSON.stringify({
					room: roomName,
					key: keyName,
					updatedAt,
				}),
			});
			if (res && res.sharedRoom) {
				upsertSharedRoomInState(res.sharedRoom);
				renderRoomTabs();
			}
		} catch {
			// ignore
		}
	}

	async function syncRoomPinToServer(payload) {
		if (!psState || !psState.authed) return;
		if (!payload || !payload.room) return;
		const roomName = normalizeRoom(payload.room);
		const keyName = normalizeKey(payload.key);
		if (!roomName) return;
		const noteId = String(payload.noteId || "").trim();
		const textVal = noteId ? "" : String(payload.text || "");
		const updatedAt = Number(payload.updatedAt) || Date.now();
		try {
			const res = await api("/api/room-pins", {
				method: "POST",
				body: JSON.stringify({
					room: roomName,
					key: keyName,
					noteId,
					text: textVal,
					updatedAt,
				}),
			});
			if (res && res.roomPin) {
				upsertRoomPinInState(res.roomPin);
			}
		} catch {
			// ignore
		}
	}

	async function syncRoomTabToServer(payload) {
		if (!psState || !psState.authed) return;
		if (!payload || !payload.room) return;
		const roomName = normalizeRoom(payload.room);
		const keyName = normalizeKey(payload.key);
		if (!roomName) return;
		const textSnapshot = String(payload.text || "");
		const lastUsed = Number(payload.lastUsed) || Date.now();
		try {
			const res = await api("/api/room-tabs", {
				method: "POST",
				body: JSON.stringify({
					room: roomName,
					key: keyName,
					text: textSnapshot,
					lastUsed,
				}),
			});
			if (res && res.roomTab) {
				upsertRoomTabInState(res.roomTab);
			}
			renderRoomTabs();
		} catch {
			// ignore
		}
	}

	async function resetSharedRoomsIfNeeded() {
		try {
			if (localStorage.getItem(SHARED_ROOMS_RESET_KEY) === "1") return;
		} catch {
			// ignore
		}
		const serverShared =
			psState && psState.authed && Array.isArray(psState.sharedRooms)
				? psState.sharedRooms
				: [];
		const localShared = loadLocalSharedRooms();
		if (serverShared.length || localShared.length) {
			try {
				localStorage.setItem(SHARED_ROOMS_RESET_KEY, "1");
			} catch {
				// ignore
			}
			if (serverShared.length) {
				saveSharedRooms(serverShared);
			}
			return;
		}
		try {
			localStorage.setItem(SHARED_ROOMS_KEY, JSON.stringify([]));
			localStorage.setItem(SHARED_ROOMS_RESET_KEY, "1");
		} catch {
			// ignore
		}
		if (psState && psState.authed) {
			try {
				await api("/api/shared-rooms", {
					method: "DELETE",
					body: JSON.stringify({ all: true }),
				});
			} catch {
				// ignore
			}
			psState.sharedRooms = [];
		}
		renderRoomTabs();
	}

	function scheduleRoomTabSync(payload) {
		if (!psState || !psState.authed) return;
		roomTabSyncPayload = payload;
		if (roomTabSyncTimer) window.clearTimeout(roomTabSyncTimer);
		roomTabSyncTimer = window.setTimeout(async () => {
			roomTabSyncTimer = 0;
			if (roomTabSyncInFlight) {
				roomTabSyncQueued = true;
				return;
			}
			roomTabSyncInFlight = true;
			const nextPayload = roomTabSyncPayload;
			roomTabSyncPayload = null;
			await syncRoomTabToServer(nextPayload);
			roomTabSyncInFlight = false;
			if (roomTabSyncQueued) {
				roomTabSyncQueued = false;
				if (roomTabSyncPayload) scheduleRoomTabSync(roomTabSyncPayload);
			}
		}, 1200);
	}

	function flushRoomTabSync() {
		if (!psState || !psState.authed) return;
		const noteId = getRoomTabNoteIdForRoom(room, key);
		const snapshot = resolveRoomTabSnapshotText(noteId);
		scheduleRoomTabSync({
			room,
			key,
			text: snapshot,
			lastUsed: Date.now(),
		});
	}

	async function syncLocalRoomTabsToServer() {
		if (!psState || !psState.authed) return;
		if (roomTabsSyncedFromLocal) return;
		roomTabsSyncedFromLocal = true;
		const localTabs = loadLocalRoomTabs();
		if (!localTabs.length) return;
		const serverTabs = Array.isArray(psState.roomTabs) ? psState.roomTabs : [];
		const has = new Set(
			serverTabs.map((t) => `${normalizeRoom(t.room)}:${normalizeKey(t.key)}`)
		);
		for (const t of localTabs) {
			const roomName = normalizeRoom(t.room);
			const keyName = normalizeKey(t.key);
			const k = `${roomName}:${keyName}`;
			if (!roomName || has.has(k)) continue;
			await syncRoomTabToServer({
				room: roomName,
				key: keyName,
				text: "",
				lastUsed: t.lastUsed || Date.now(),
			});
		}
	}

	async function syncLocalSharedRoomsToServer() {
		if (!psState || !psState.authed) return;
		if (sharedRoomsSyncedFromLocal) return;
		sharedRoomsSyncedFromLocal = true;
		const localShared = loadLocalSharedRooms();
		if (!localShared.length) return;
		const serverShared = Array.isArray(psState.sharedRooms)
			? psState.sharedRooms
			: [];
		const has = new Set(
			serverShared.map((s) => `${normalizeRoom(s.room)}:${normalizeKey(s.key)}`)
		);
		for (const s of localShared) {
			const roomName = normalizeRoom(s.room);
			const keyName = normalizeKey(s.key);
			const k = `${roomName}:${keyName}`;
			if (!roomName || has.has(k)) continue;
			await syncSharedRoomToServer({
				room: roomName,
				key: keyName,
				updatedAt: s.updatedAt || Date.now(),
			});
		}
	}

	async function syncLocalRoomPinsToServer(serverPins) {
		if (!psState || !psState.authed) return;
		if (roomPinsSyncedFromLocal) return;
		roomPinsSyncedFromLocal = true;
		const localPins = loadLocalRoomPinnedEntries();
		if (!localPins.length) return;
		const serverList = Array.isArray(serverPins)
			? serverPins
			: Array.isArray(psState.roomPins)
				? psState.roomPins
				: [];
		const byKey = new Map(
			serverList
				.map(normalizeRoomPinnedEntry)
				.filter(Boolean)
				.map((p) => [`${p.room}:${p.key}`, p])
		);
		for (const p of localPins) {
			const normalized = normalizeRoomPinnedEntry(p);
			if (!normalized) continue;
			const keyId = `${normalized.room}:${normalized.key}`;
			const server = byKey.get(keyId);
			if (!server || normalized.updatedAt > server.updatedAt) {
				await syncRoomPinToServer({
					room: normalized.room,
					key: normalized.key,
					noteId: normalized.noteId,
					text: normalized.text,
					updatedAt: normalized.updatedAt || Date.now(),
				});
			}
		}
	}

	function touchRoomTab(roomName, keyName, opts) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const tabs = dedupeRoomTabs(loadRoomTabs());
		const now = Date.now();
		const idx = tabs.findIndex(
			(t) => t.room === nextRoom && t.key === nextKey
		);
		const pinned = getRoomPinnedEntry(nextRoom, nextKey);
		const pinnedNoteId = pinned && pinned.noteId ? String(pinned.noteId || "").trim() : "";
		const bound = findNoteRoomBindingByRoom(nextRoom, nextKey);
		const boundNoteId = pinnedNoteId || (bound && bound.noteId ? String(bound.noteId || "").trim() : "");
		if (idx >= 0) {
			tabs[idx].lastUsed = now;
			if (boundNoteId && !String(tabs[idx].noteId || "").trim()) {
				tabs[idx].noteId = boundNoteId;
			}
		} else {
			if (tabs.length >= MAX_ROOM_TABS) {
				showRoomTabLimitModal();
				return;
			}
			tabs.push({
				room: nextRoom,
				key: nextKey,
				lastUsed: now,
				noteId: boundNoteId,
				text: "",
			});
		}
		saveRoomTabs(tabs);
		if (!(opts && opts.skipSync)) {
			const noteId = getRoomTabNoteIdForRoom(nextRoom, nextKey);
			const snapshot = resolveRoomTabSnapshotText(noteId);
			scheduleRoomTabSync({
				room: nextRoom,
				key: nextKey,
				text: snapshot,
				lastUsed: now,
			});
		}
	}

	function escapeHtml(raw) {
		return String(raw || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	}

	function escapeAttr(raw) {
		return String(raw || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	function renderRoomTabs() {
		if (!roomTabs) return;
		const tabs = loadRoomTabs();
		const canClose = tabs.length > 1;
		const html = tabs
			.map((tab) => {
				const isActive = tab.room === room && tab.key === key;
				const isCollab = isActive && presenceState && presenceState.size > 1;
				const isShared = isRoomMarkedShared(tab.room, tab.key);
				const privateTooltip = t(
					"tabs.tooltip.private",
					"Privater Raum · Zugriff nur mit Schlüssel"
				);
				const publicTooltip = t(
					"tabs.tooltip.public",
					"Öffentlicher Raum · Kein Schlüssel erforderlich"
				);
				const sharedTooltip = t(
					"tabs.tooltip.shared",
					"Geteilter Raum · Link wurde geteilt"
				);
				const base =
					"inline-flex items-center gap-1 rounded-lg border text-xs transition";
				const active =
					"border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100";
				const idle =
					"border-white/10 bg-slate-950/40 text-slate-200 hover:bg-white/10";
				const privacyIcon = tab.key
					? `<span class="tab-tooltip inline-flex h-3 w-3 items-center justify-center text-slate-300" data-tooltip="${escapeAttr(
						privateTooltip
					)}" aria-label="${escapeAttr(privateTooltip)}"><svg viewBox="0 0 24 24" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect x="5" y="11" width="14" height="10" rx="2" /></svg></span>`
					: `<span class="tab-tooltip inline-flex h-3 w-3 items-center justify-center text-slate-300" data-tooltip="${escapeAttr(
						publicTooltip
					)}" aria-label="${escapeAttr(publicTooltip)}"><svg viewBox="0 0 24 24" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20" /><path d="M12 2a15 15 0 0 0 0 20" /></svg></span>`;
				const sharedBadge = isShared
					? `<span class="tab-tooltip room-tab-link-badge${
							isCollab ? " is-live" : ""
						}" data-tooltip="${escapeAttr(sharedTooltip)}" aria-label="${escapeAttr(
							sharedTooltip
						)}"><svg viewBox="0 0 24 24" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" /><path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" /></svg></span>`
					: "";
				const iconGroup = `<span class="inline-flex items-center gap-1">${privacyIcon}</span>`;
				const closeBtn = canClose
					? `
							<button
								type="button"
								data-tab-close
								data-room="${escapeAttr(tab.room)}"
								data-key="${escapeAttr(tab.key)}"
								class="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
								title="Tab schließen"
								aria-label="Tab schließen">
								<span aria-hidden="true">×</span>
							</button>`
					: "";
				return `
					<div class="${base} ${isActive ? active : idle}">
						<button
							type="button"
							data-tab-select
							data-room="${escapeAttr(tab.room)}"
							data-key="${escapeAttr(tab.key)}"
							class="inline-flex items-center gap-2 px-3 py-1.5">
							${iconGroup}
							<span class="max-w-[140px] truncate">${escapeHtml(tab.room)}</span>
							${sharedBadge}
						</button>
						${closeBtn}
					</div>`;
			})
			.join("");
		const calendarBase =
			"inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition";
		const calendarActive =
			"border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100";
		const calendarIdle =
			"border-white/10 bg-slate-950/40 text-slate-200 hover:bg-white/10";
		const calendarHtml = `
			<button
				type="button"
				data-calendar-tab
				class="${calendarBase} ${
					calendarPanelActive ? calendarActive : calendarIdle
				}">
				<span class="max-w-[140px] truncate">Kalender</span>
			</button>`;
		roomTabs.innerHTML = `${html}${calendarHtml}`;
	}

	function closeRoomTab(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const tabs = loadRoomTabs();
		if (tabs.length <= 1) return;
		const idx = tabs.findIndex(
			(t) => t.room === nextRoom && t.key === nextKey
		);
		if (idx < 0) return;
		const isFavorite = findFavoriteIndex(nextRoom, nextKey) >= 0;
		const pinned = getRoomPinnedEntry(nextRoom, nextKey);
		tabs.splice(idx, 1);
		saveRoomTabs(tabs);
		removeRoomTabFromState(nextRoom, nextKey);
		if (!isFavorite && !(pinned && pinned.noteId)) {
			removeNoteRoomBindingByRoom(nextRoom, nextKey);
		}
		renderRoomTabs();
		if (psState && psState.authed) {
			api("/api/room-tabs", {
				method: "DELETE",
				body: JSON.stringify({ room: nextRoom, key: nextKey }),
			}).catch(() => {
				// ignore
			});
		}
		if (room === nextRoom && key === nextKey) {
			const fallback = tabs[idx] || tabs[idx - 1] || null;
			if (fallback) {
				pendingClosedTab = { room: nextRoom, key: nextKey };
				location.hash = buildShareHash(fallback.room, fallback.key);
				return;
			}
			const next = randomRoom();
			const nextKeyAuto = randomKey();
			pendingClosedTab = { room: nextRoom, key: nextKey };
			location.hash = buildShareHash(next, nextKeyAuto);
		}
	}

	function loadLocalFavorites() {
		try {
			const raw = localStorage.getItem(FAVORITES_KEY);
			const parsed = JSON.parse(raw || "[]");
			if (!Array.isArray(parsed)) return [];
			return dedupeFavorites(parsed.map(normalizeFavoriteEntry).filter(Boolean));
		} catch {
			return [];
		}
	}

	function loadFavorites() {
		if (psState && psState.authed) {
			const favs = Array.isArray(psState.favorites) ? psState.favorites : [];
			return dedupeFavorites(favs.map(normalizeFavoriteEntry).filter(Boolean));
		}
		return loadLocalFavorites();
	}

	function saveFavorites(list) {
		const cleaned = Array.isArray(list) ? dedupeFavorites(list) : [];
		try {
			localStorage.setItem(FAVORITES_KEY, JSON.stringify(cleaned));
		} catch {
			// ignore
		}
		if (psState && psState.authed) {
			psState.favorites = cleaned;
		}
	}

	function findFavoriteIndex(roomName, keyName) {
		const favs = loadFavorites();
		return favs.findIndex((f) => f.room === roomName && f.key === keyName);
	}

	function renderFavorites() {
		if (!favoritesSelect) return;
		const favs = dedupeFavorites(loadFavorites()).sort(
			(a, b) => (b.addedAt || 0) - (a.addedAt || 0)
		);
		const escapeAttr = (raw) =>
			String(raw || "")
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;");
		const options = favs
			.map((f) => {
				const value = buildShareHash(f.room, f.key);
				const label = f.key ? `${f.room} (privat)` : f.room;
				const textRaw = String(f.text || "").trim();
				const snippet =
					textRaw.length > 200 ? `${textRaw.slice(0, 200)}…` : textRaw;
				const titleAttr = snippet ? ` title="${escapeAttr(snippet)}"` : "";
				return `<option value="${value}"${titleAttr}>${label}</option>`;
			})
			.join("");
		favoritesSelect.innerHTML = `<option value="">Favoriten…</option>${options}`;
	}

	function renderFavoritesManager() {
		if (!favoritesManageList) return;
		const favs = dedupeFavorites(loadFavorites()).sort(
			(a, b) => (b.addedAt || 0) - (a.addedAt || 0)
		);
		if (favoritesManageEmpty && favoritesManageEmpty.classList) {
			favoritesManageEmpty.classList.toggle("hidden", favs.length > 0);
		}
		if (!favs.length) {
			favoritesManageList.innerHTML = "";
			return;
		}
		favoritesManageList.innerHTML = favs
			.map((f) => {
				const badge = f.key
					? '<span class="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-300">privat</span>'
					: "";
				const textVal = String(f.text || "");
				const isStartup = Boolean(f.isStartup);
				const startupIconClass = isStartup
					? "text-yellow-400"
					: "text-slate-400 hover:text-yellow-400";
				const startupIconFill = isStartup ? "currentColor" : "none";
				const startupTitle = t(
					isStartup
						? "settings.user.favorites.startup_active"
						: "settings.user.favorites.startup_inactive"
				);
				return `
					<div class="rounded-lg border border-white/10 bg-slate-950/30 p-2">
						<div class="flex items-center justify-between gap-2">
							<div class="flex items-center gap-2 text-xs text-slate-200">
								<button
									type="button"
									data-fav-startup
									data-fav-room="${escapeAttr(f.room)}"
									data-fav-key="${escapeAttr(f.key)}"
									class="rounded-md p-1 transition ${startupIconClass}"
									title="${escapeAttr(startupTitle)}"
									aria-label="${escapeAttr(startupTitle)}">
									<svg viewBox="0 0 24 24" fill="${startupIconFill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
									</svg>
								</button>
								<span class="font-medium">${escapeHtml(f.room)}</span>
								${badge}
							</div>
							<button
								type="button"
								data-fav-remove
								data-fav-room="${escapeAttr(f.room)}"
								data-fav-key="${escapeAttr(f.key)}"
								class="rounded-md border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-200 transition hover:bg-white/5 active:bg-white/10">
								${t("settings.user.favorites.remove")}
							</button>
						</div>
						<label class="mt-2 block text-[11px] text-slate-400">${t(
							"settings.user.favorites.note_label"
						)}</label>
						<input
							type="text"
							value="${escapeAttr(textVal)}"
							data-fav-text
							data-fav-room="${escapeAttr(f.room)}"
							data-fav-key="${escapeAttr(f.key)}"
							class="mt-1 w-full rounded-md border border-white/10 bg-slate-950/40 px-2.5 py-1.5 text-[12px] text-slate-100 shadow-soft backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400/25"
							placeholder="${t(
								"settings.user.favorites.note_placeholder"
							)}" />
					</div>`;
			})
			.join("");
	}

	function renderSharedRoomsManager() {
		if (!sharedRoomsManageList) return;
		if (sharedRoomsFilterInput && !sharedRoomsFilterInput.dataset.synced) {
			sharedRoomsFilterInput.value = loadSharedRoomsFilterValue();
			sharedRoomsFilterInput.dataset.synced = "1";
		}
		const allRooms = loadSharedRooms().sort(
			(a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
		);
		const query = String(
			sharedRoomsFilterInput ? sharedRoomsFilterInput.value : ""
		)
			.trim()
			.toLowerCase();
		const rooms = query
			? allRooms.filter((r) => {
					const roomName = String(r.room || "").toLowerCase();
					const keyName = String(r.key || "").toLowerCase();
					return roomName.includes(query) || keyName.includes(query);
			  })
			: allRooms;
		if (sharedRoomsManageEmpty && sharedRoomsManageEmpty.classList) {
			sharedRoomsManageEmpty.textContent = rooms.length
				? ""
				: allRooms.length
					? t("settings.shared.empty_filtered")
					: t("settings.shared.empty");
			sharedRoomsManageEmpty.classList.toggle("hidden", rooms.length > 0);
		}
		if (!rooms.length) {
			sharedRoomsManageList.innerHTML = "";
			return;
		}
		sharedRoomsManageList.innerHTML = rooms
			.map((r) => {
				const badge = r.key
					? '<span class="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-300">privat</span>'
					: "";
				const label = r.key ? `${r.room} (privat)` : r.room;
				const updated = r.updatedAt
					? new Date(r.updatedAt).toLocaleString(getUiLocale())
					: "";
				const updatedLabel = updated
					? `${t("settings.shared.updated")} ${updated}`
					: "";
				const openLabel = t("settings.shared.open");
				const removeLabel = t("settings.shared.remove");
				return `
					<div class="rounded-lg border border-white/10 bg-slate-950/30 p-2">
						<div class="flex items-center justify-between gap-2">
							<div class="flex items-center gap-2 text-xs text-slate-200">
								<span class="font-medium">${escapeHtml(label)}</span>
								${badge}
							</div>
							<div class="flex items-center gap-1.5">
								<button
									type="button"
									data-shared-open
									data-shared-room="${escapeAttr(r.room)}"
									data-shared-key="${escapeAttr(r.key)}"
									class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-transparent text-slate-200 transition hover:bg-white/5 active:bg-white/10"
									title="${escapeAttr(openLabel)}"
									aria-label="${escapeAttr(openLabel)}">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" aria-hidden="true">
										<path d="M5 12h14" />
										<path d="M12 5l7 7-7 7" />
									</svg>
								</button>
								<button
									type="button"
									data-shared-remove
									data-shared-room="${escapeAttr(r.room)}"
									data-shared-key="${escapeAttr(r.key)}"
									class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-transparent text-slate-200 transition hover:bg-white/5 active:bg-white/10"
									title="${escapeAttr(removeLabel)}"
									aria-label="${escapeAttr(removeLabel)}">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" aria-hidden="true">
										<path d="M3 6h18" />
										<path d="M8 6v-2h8v2" />
										<path d="M19 6l-1 14H6L5 6" />
										<path d="M10 11v6" />
										<path d="M14 11v6" />
									</svg>
								</button>
							</div>
						</div>
						${
							updatedLabel
								? `<div class="mt-2 text-[11px] text-slate-400">${escapeHtml(updatedLabel)}</div>`
								: ""
						}
					</div>`;
			})
			.join("");
	}

	function formatUploadUpdatedAt(ts) {
		const next = Number(ts || 0);
		if (!Number.isFinite(next) || next <= 0) return "";
		const date = new Date(next);
		if (Number.isNaN(date.getTime())) return "";
		return date.toLocaleString();
	}

	function renderUploadsManageList(items) {
		if (!uploadsManageList) return;
		const list = Array.isArray(items) ? items : [];
		if (uploadsManageEmpty && uploadsManageEmpty.classList) {
			uploadsManageEmpty.textContent = "Keine Uploads vorhanden.";
			uploadsManageEmpty.classList.toggle("hidden", list.length > 0);
		}
		if (!list.length) {
			uploadsManageList.innerHTML = "";
			return;
		}
		uploadsManageList.innerHTML = list
			.map((item) => {
				const name = String(item && item.name ? item.name : "").trim();
				const displayName = name.replace(/^[^-]+-[^-]+-/, "") || name;
				const url = String(item && item.url ? item.url : "").trim();
				const size = formatBytes(item && item.size ? item.size : 0);
				const updated = formatUploadUpdatedAt(item && item.updatedAt);
				const metaParts = [size, updated].filter(Boolean).join(" · ");
				return `
					<div class="rounded-lg border border-white/10 bg-slate-950/30 p-2">
						<div class="flex items-center justify-between gap-2">
							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2 text-xs text-slate-200">
									<a
										href="${escapeAttr(url)}"
										target="_blank"
										rel="noreferrer"
										class="font-medium text-fuchsia-200 hover:text-fuchsia-100">
										${escapeHtml(displayName)}
									</a>
									<span class="text-[11px] text-slate-400">${escapeHtml(
										metaParts
									)}</span>
								</div>
							</div>
							<button
								type="button"
								data-upload-delete
								data-upload-name="${escapeAttr(name)}"
								class="rounded-md border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-200 transition hover:bg-white/5 active:bg-white/10">
								Löschen
							</button>
						</div>
					</div>`;
			})
			.join("");
	}

	function formatTrashDeletedAt(ts) {
		const next = Number(ts || 0);
		if (!Number.isFinite(next) || next <= 0) return "";
		const date = new Date(next);
		if (Number.isNaN(date.getTime())) return "";
		return date.toLocaleString();
	}

	function renderTrashManageList(items) {
		if (!trashManageList) return;
		const list = Array.isArray(items) ? items : [];
		if (trashManageEmpty && trashManageEmpty.classList) {
			trashManageEmpty.textContent = "No deleted notes.";
			trashManageEmpty.classList.toggle("hidden", list.length > 0);
		}
		if (!list.length) {
			trashManageList.innerHTML = "";
			return;
		}
		trashManageList.innerHTML = list
			.map((note) => {
				const id = String(note && note.id ? note.id : "");
				const info = getNoteTitleAndExcerpt(note && note.text ? note.text : "");
				const title = escapeHtml(info.title || "Unbenannt");
				const excerpt = escapeHtml(info.excerpt || "");
				const deletedAt = formatTrashDeletedAt(
					note && note.deletedAt ? note.deletedAt : 0
				);
				const createdAt = note && note.createdAt ? fmtDate(note.createdAt) : "";
				const meta = [
					deletedAt ? `Gelöscht: ${deletedAt}` : "",
					createdAt ? `Erstellt: ${createdAt}` : "",
				]
					.filter(Boolean)
					.join(" · ");
				return `
					<div class="rounded-lg border border-white/10 bg-slate-950/30 p-3">
						<div class="flex items-start justify-between gap-3">
							<div class="min-w-0">
								<div class="text-xs font-semibold text-slate-100">${title}</div>
								${
									excerpt
										? `<div class="mt-1 text-[11px] text-slate-300">${excerpt}</div>`
										: ""
								}
								${
									meta
										? `<div class="mt-1 text-[11px] text-slate-400">${escapeHtml(
											meta
										)}</div>`
										: ""
								}
							</div>
							<button
								type="button"
								data-trash-restore
								data-trash-id="${escapeAttr(id)}"
								class="shrink-0 rounded-md border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-200 transition hover:bg-white/5 active:bg-white/10">
								Wiederherstellen
							</button>
						</div>
					</div>`;
			})
			.join("");
	}

	function normalizeCalendarSource(it) {
		if (!it) return null;
		const id = String(it.id || "").trim() || createClientId();
		const name = String(it.name || "").trim() || "Kalender";
		const url = String(it.url || "").trim();
		const color = String(it.color || "").trim() || "#a855f7";
		const enabled = typeof it.enabled === "boolean" ? it.enabled : true;
		return { id, name, url, color, enabled };
	}

	function loadCalendarSources() {
		try {
			const raw = localStorage.getItem(CALENDAR_SOURCES_KEY);
			const parsed = JSON.parse(raw || "[]");
			if (!Array.isArray(parsed)) return [];
			return parsed.map(normalizeCalendarSource).filter(Boolean);
		} catch {
			return [];
		}
	}

	function saveCalendarSources(list, opts) {
		try {
			const cleaned = Array.isArray(list)
				? list.map(normalizeCalendarSource).filter(Boolean)
				: [];
			localStorage.setItem(CALENDAR_SOURCES_KEY, JSON.stringify(cleaned));
		} catch {
			// ignore
		}
		if (!(opts && opts.skipSync)) {
			scheduleCalendarSettingsSync();
		}
	}

	function loadCalendarDefaultView() {
		try {
			const raw = String(localStorage.getItem(CALENDAR_DEFAULT_VIEW_KEY) || "");
			return CALENDAR_VIEWS.includes(raw) ? raw : "month";
		} catch {
			return "month";
		}
	}

	function saveCalendarDefaultView(view, opts) {
		const safe = CALENDAR_VIEWS.includes(view) ? view : "month";
		try {
			localStorage.setItem(CALENDAR_DEFAULT_VIEW_KEY, safe);
		} catch {
			// ignore
		}
		calendarState.view = safe;
		updateCalendarViewButtons();
		if (!(opts && opts.skipRender)) {
			renderCalendarPanel();
		}
		if (!(opts && opts.skipSync)) {
			scheduleCalendarSettingsSync();
		}
	}

	function getLocalCalendarSettings() {
		return {
			sources: loadCalendarSources(),
			defaultView: loadCalendarDefaultView(),
			localEvents: loadLocalCalendarEventsRaw(),
			googleCalendarId: loadCalendarGoogleId(),
			outlookCalendarId: loadCalendarOutlookId(),
		};
	}

	function applyCalendarSettings(calendar, opts) {
		if (!calendar || typeof calendar !== "object") return false;
		const hasSources = Array.isArray(calendar.sources);
		const hasView = CALENDAR_VIEWS.includes(calendar.defaultView);
		const hasLocalEvents = Array.isArray(calendar.localEvents);
		const hasGoogleCalendarId = typeof calendar.googleCalendarId === "string";
		const hasOutlookCalendarId = typeof calendar.outlookCalendarId === "string";
		if (hasSources) saveCalendarSources(calendar.sources, { skipSync: true });
		if (hasView) {
			saveCalendarDefaultView(calendar.defaultView, {
				skipSync: true,
				skipRender: true,
			});
		}
		if (hasLocalEvents) {
			saveLocalCalendarEvents(calendar.localEvents, {
				skipSync: true,
				skipRender: true,
			});
		}
		if (hasGoogleCalendarId) {
			saveCalendarGoogleId(calendar.googleCalendarId, {
				skipSync: true,
				skipRender: true,
			});
		}
		if (hasOutlookCalendarId) {
			saveCalendarOutlookId(calendar.outlookCalendarId, {
				skipSync: true,
				skipRender: true,
			});
		}
		if (
			hasSources ||
			hasView ||
			hasLocalEvents ||
			hasGoogleCalendarId ||
			hasOutlookCalendarId
		) {
			renderCalendarSettings();
			scheduleCalendarRefresh();
			if (!(opts && opts.skipRender)) renderCalendarPanel();
		}
		return (
			hasSources ||
			hasView ||
			hasLocalEvents ||
			hasGoogleCalendarId ||
			hasOutlookCalendarId
		);
	}

	async function syncCalendarSettingsToServer(calendar) {
		if (!psState || !psState.authed) return;
		try {
			const res = await api("/api/user-settings", {
				method: "POST",
				body: JSON.stringify({ calendar }),
			});
			if (res && res.settings) {
				psState.settings = res.settings;
			}
		} catch {
			// ignore
		}
	}

	function scheduleCalendarSettingsSync(nextCalendar) {
		if (!psState || !psState.authed) return;
		calendarSettingsSyncPayload =
			nextCalendar && typeof nextCalendar === "object"
				? nextCalendar
				: getLocalCalendarSettings();
		if (calendarSettingsSyncTimer) window.clearTimeout(calendarSettingsSyncTimer);
		calendarSettingsSyncTimer = window.setTimeout(async () => {
			calendarSettingsSyncTimer = 0;
			if (calendarSettingsSyncInFlight) {
				calendarSettingsSyncQueued = true;
				return;
			}
			calendarSettingsSyncInFlight = true;
			const payload =
				calendarSettingsSyncPayload || getLocalCalendarSettings();
			calendarSettingsSyncPayload = null;
			await syncCalendarSettingsToServer(payload);
			calendarSettingsSyncInFlight = false;
			if (calendarSettingsSyncQueued) {
				calendarSettingsSyncQueued = false;
				if (calendarSettingsSyncPayload) {
					scheduleCalendarSettingsSync(calendarSettingsSyncPayload);
				}
			}
		}, CALENDAR_SETTINGS_SYNC_DELAY);
	}

	function syncCalendarSettingsFromServer() {
		if (!psState || !psState.authed) return;
		const serverCalendar =
			psState.settings && psState.settings.calendar
				? psState.settings.calendar
				: null;
		const hasServer =
			serverCalendar &&
			(Array.isArray(serverCalendar.sources) ||
				CALENDAR_VIEWS.includes(serverCalendar.defaultView));
		if (hasServer) {
			applyCalendarSettings(serverCalendar);
			return;
		}
		const local = getLocalCalendarSettings();
		const hasLocalSources =
			Array.isArray(local.sources) && local.sources.length > 0;
		const hasLocalCustomView =
			CALENDAR_VIEWS.includes(local.defaultView) && local.defaultView !== "month";
		if (hasLocalSources || hasLocalCustomView) {
			scheduleCalendarSettingsSync(local);
		}
	}

	function renderCalendarSettings() {
		if (calendarDefaultViewSelect) {
			calendarDefaultViewSelect.value = loadCalendarDefaultView();
		}
		if (!calendarSourcesList) return;
		const list = loadCalendarSources();
		if (calendarSourcesEmpty && calendarSourcesEmpty.classList) {
			calendarSourcesEmpty.classList.toggle("hidden", list.length > 0);
		}
		if (!list.length) {
			calendarSourcesList.innerHTML = "";
			return;
		}
		calendarSourcesList.innerHTML = list
			.map((src) => {
				const safeId = escapeAttr(src.id);
				return `
					<div class="rounded-lg border border-white/10 bg-slate-950/30 p-3" data-cal-id="${safeId}">
						<div class="flex items-start justify-between gap-3">
							<div class="min-w-0 flex-1">
								<label class="text-[11px] text-slate-400">Name</label>
								<input
									type="text"
									data-cal-field="name"
									value="${escapeAttr(src.name)}"
									class="mt-1 w-full rounded-md border border-white/10 bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-100 shadow-soft backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400/25" />
								<label class="mt-2 block text-[11px] text-slate-400">ICS-URL</label>
								<input
									type="url"
									data-cal-field="url"
									value="${escapeAttr(src.url)}"
									class="mt-1 w-full rounded-md border border-white/10 bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-100 shadow-soft backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400/25" />
							</div>
							<div class="flex flex-col items-end gap-2">
								<input
									type="color"
									data-cal-field="color"
									value="${escapeAttr(src.color)}"
									class="h-9 w-16 rounded-md border border-white/10 bg-slate-950/40" />
								<label class="flex items-center gap-2 text-[11px] text-slate-300">
									<input
										type="checkbox"
										data-cal-field="enabled"
										${src.enabled ? "checked" : ""}
										class="h-4 w-4 rounded border-white/20 bg-slate-950/40 text-fuchsia-400" />
									Aktiv
								</label>
								<button
									type="button"
									data-cal-remove="1"
									class="rounded-md border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-200 transition hover:bg-white/5 active:bg-white/10">
									Entfernen
								</button>
							</div>
						</div>
					</div>`;
			})
			.join("");
		renderCalendarLocalEvents();
		renderCalendarGoogleSelect();
		renderCalendarOutlookSelect();
	}

	function renderCalendarGoogleSelect() {
		if (!calendarGoogleSelect) return;
		const selected = loadCalendarGoogleId();
		const list = Array.isArray(googleCalendarList)
			? googleCalendarList.slice()
			: [];
		const usable = list.filter(
			(item) => item.accessRole === "owner" || item.accessRole === "writer"
		);
		const entries = usable.length
			? usable
			: [{ id: "primary", summary: "Primary", primary: true }];
		calendarGoogleSelect.innerHTML = entries
			.map((item) => {
				const label = item.primary
					? `${item.summary || "Primary"} (primary)`
					: item.summary || item.id;
				const value = item.id || "primary";
				return `<option value="${escapeAttr(value)}">${escapeHtml(
					label
				)}</option>`;
			})
			.join("");
		calendarGoogleSelect.value = selected;
	}

	function renderCalendarOutlookSelect() {
		if (!calendarOutlookSelect) return;
		const selected = loadCalendarOutlookId();
		const list = Array.isArray(outlookCalendarList)
			? outlookCalendarList.slice()
			: [];
		const entries = list.length
			? list
			: [{ id: "primary", name: "Default", isDefault: true }];
		calendarOutlookSelect.innerHTML = entries
			.map((item) => {
				const label = item.isDefault
					? `${item.name || "Default"} (default)`
					: item.name || item.id;
				const value = item.id || "primary";
				return `<option value="${escapeAttr(value)}">${escapeHtml(
					label
				)}</option>`;
			})
			.join("");
		calendarOutlookSelect.value = selected;
	}

	function renderCalendarLocalEvents() {
		if (!calendarLocalEventsList) return;
		const list = Array.isArray(calendarState.localEvents)
			? calendarState.localEvents.slice()
			: [];
		list.sort((a, b) => a.start.getTime() - b.start.getTime());
		if (calendarLocalEventsEmpty && calendarLocalEventsEmpty.classList) {
			calendarLocalEventsEmpty.classList.toggle("hidden", list.length > 0);
		}
		if (!list.length) {
			calendarLocalEventsList.innerHTML = "";
			return;
		}
		calendarLocalEventsList.innerHTML = list
			.map((evt) => {
				const dateLabel = evt.start.toLocaleDateString(getUiLocale(), {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				});
				const timeLabel = evt.allDay
					? t("calendar.modal.all_day")
					: `${formatTime(evt.start)} – ${formatTime(evt.end)}`;
				const googleBadge = evt.googleEventId
					? '<span class="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-300">Google</span>'
					: "";
				const outlookBadge = evt.outlookEventId
					? '<span class="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-300">Outlook</span>'
					: "";
				return `
					<div class="rounded-lg border border-white/10 bg-slate-950/30 p-2">
						<div class="flex items-start justify-between gap-2">
							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-100">
									<span>${escapeHtml(evt.title)}</span>
										${googleBadge}${outlookBadge}
								</div>
								<div class="text-[11px] text-slate-400">${dateLabel} · ${timeLabel}</div>
							</div>
							<button
								type="button"
								data-local-event-remove
								data-local-event-id="${escapeAttr(evt.id)}"
								class="rounded-md border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-200 transition hover:bg-white/5 active:bg-white/10">
								${t("calendar.local.remove")}
							</button>
						</div>
					</div>`;
			})
			.join("");
	}

	function updateCalendarSyncTargetOptions() {
		if (!calendarEventSyncTarget) return;
		const googleOption = calendarEventSyncTarget.querySelector(
			'option[value="google"]'
		);
		const outlookOption = calendarEventSyncTarget.querySelector(
			'option[value="outlook"]'
		);
		if (googleOption) googleOption.disabled = !googleCalendarConnected;
		if (outlookOption) outlookOption.disabled = !outlookCalendarConnected;
		let nextValue = String(calendarEventSyncTarget.value || "").trim();
		if (!nextValue) nextValue = loadCalendarSyncTarget();
		if (nextValue === "google" && !googleCalendarConnected) {
			nextValue = "local";
		}
		if (nextValue === "outlook" && !outlookCalendarConnected) {
			nextValue = "local";
		}
		calendarEventSyncTarget.value = nextValue;
		saveCalendarSyncTarget(nextValue);
	}

	function setGoogleCalendarUi(connected, info) {
		googleCalendarConnected = Boolean(connected);
		if (calendarGoogleStatus) {
			const base = t("settings.calendar.google.connected");
			calendarGoogleStatus.textContent = connected
				? `${base}${info ? ` (${info})` : ""}.`
				: t("settings.calendar.google.status_disconnected");
		}
		if (calendarGoogleSelect) {
			calendarGoogleSelect.disabled = !connected;
		}
		if (calendarGoogleConnect) {
			calendarGoogleConnect.classList.toggle("hidden", connected);
		}
		if (calendarGoogleDisconnect) {
			calendarGoogleDisconnect.classList.toggle("hidden", !connected);
		}
		updateCalendarSyncTargetOptions();
		if (!connected) {
			googleCalendarList = [];
			renderCalendarGoogleSelect();
		}
	}

	function setOutlookCalendarUi(connected, info) {
		outlookCalendarConnected = Boolean(connected);
		if (calendarOutlookStatus) {
			const base = t("settings.calendar.outlook.connected");
			calendarOutlookStatus.textContent = connected
				? `${base}${info ? ` (${info})` : ""}.`
				: t("settings.calendar.outlook.status_disconnected");
		}
		if (calendarOutlookSelect) {
			calendarOutlookSelect.disabled = !connected;
		}
		if (calendarOutlookConnect) {
			calendarOutlookConnect.classList.toggle("hidden", connected);
		}
		if (calendarOutlookDisconnect) {
			calendarOutlookDisconnect.classList.toggle("hidden", !connected);
		}
		updateCalendarSyncTargetOptions();
		if (!connected) {
			outlookCalendarList = [];
			renderCalendarOutlookSelect();
		}
	}

	async function fetchGoogleCalendarList() {
		if (!psState || !psState.authed) return;
		try {
			const res = await api("/api/calendar/google/calendars", {}, 0);
			googleCalendarList = Array.isArray(res && res.calendars)
				? res.calendars
				: [];
			renderCalendarGoogleSelect();
		} catch (err) {
			if (err && err.status === 403) {
				googleCalendarConnected = false;
				setGoogleCalendarUi(false);
			}
			googleCalendarList = [];
			renderCalendarGoogleSelect();
		}
	}

	async function fetchOutlookCalendarList() {
		if (!psState || !psState.authed) return;
		try {
			const res = await api("/api/calendar/outlook/calendars");
			outlookCalendarList = Array.isArray(res && res.calendars)
				? res.calendars
				: [];
			renderCalendarOutlookSelect();
		} catch {
			outlookCalendarList = [];
			renderCalendarOutlookSelect();
		}
	}

	async function fetchGoogleCalendarStatus() {
		if (!psState || !psState.authed) {
			setGoogleCalendarUi(false);
			return;
		}
		try {
			const res = await api("/api/calendar/google/status");
			if (!res || !res.configured) {
				setGoogleCalendarUi(false);
				if (calendarGoogleStatus) {
					calendarGoogleStatus.textContent = t(
						"settings.calendar.google.not_configured"
					);
				}
				return;
			}
			setGoogleCalendarUi(Boolean(res.connected), res.email || "");
			if (res && res.calendarId) {
				saveCalendarGoogleId(res.calendarId, {
					skipSync: true,
					skipRender: true,
				});
			}
			if (res.connected) {
				await fetchGoogleCalendarList();
			}
		} catch {
			setGoogleCalendarUi(false);
			if (calendarGoogleStatus) {
				calendarGoogleStatus.textContent = t(
					"settings.calendar.google.unavailable"
				);
			}
		}
	}

	async function fetchOutlookCalendarStatus() {
		if (!psState || !psState.authed) {
			setOutlookCalendarUi(false);
			return;
		}
		try {
			const res = await api("/api/calendar/outlook/status");
			if (!res || !res.configured) {
				setOutlookCalendarUi(false);
				if (calendarOutlookStatus) {
					calendarOutlookStatus.textContent = t(
						"settings.calendar.outlook.not_configured"
					);
				}
				return;
			}
			setOutlookCalendarUi(Boolean(res.connected), res.email || "");
			if (res && res.calendarId) {
				saveCalendarOutlookId(res.calendarId, {
					skipSync: true,
					skipRender: true,
				});
			}
			if (res.connected) {
				await fetchOutlookCalendarList();
			}
		} catch {
			setOutlookCalendarUi(false);
			if (calendarOutlookStatus) {
				calendarOutlookStatus.textContent = t(
					"settings.calendar.outlook.unavailable"
				);
			}
		}
	}

	async function createGoogleCalendarEvent(evt) {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
		const startDate = evt.allDay ? formatDateInputValue(evt.start) : "";
		const endDate = evt.allDay ? formatDateInputValue(evt.end) : "";
		const payload = {
			title: evt.title,
			location: evt.location || "",
			start: evt.start.toISOString(),
			end: evt.end.toISOString(),
			allDay: Boolean(evt.allDay),
			startDate,
			endDate,
			timeZone: timezone,
		};
		return api("/api/calendar/google/events", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	async function createOutlookCalendarEvent(evt) {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
		const startDate = evt.allDay ? formatDateInputValue(evt.start) : "";
		const endDate = evt.allDay ? formatDateInputValue(evt.end) : "";
		const payload = {
			title: evt.title,
			location: evt.location || "",
			start: evt.start.toISOString(),
			end: evt.end.toISOString(),
			allDay: Boolean(evt.allDay),
			startDate,
			endDate,
			timeZone: timezone,
		};
		return api("/api/calendar/outlook/events", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	async function deleteGoogleCalendarEvent(eventId) {
		if (!eventId) return;
		try {
			await api(`/api/calendar/google/events/${encodeURIComponent(eventId)}`, {
				method: "DELETE",
			});
		} catch {
			// ignore
		}
	}

	async function deleteOutlookCalendarEvent(eventId) {
		if (!eventId) return;
		try {
			await api(`/api/calendar/outlook/events/${encodeURIComponent(eventId)}`, {
				method: "DELETE",
			});
		} catch {
			// ignore
		}
	}

	function setCalendarPanelActive(active) {
		calendarPanelActive = Boolean(active);
		if (editorPreviewGrid && editorPreviewGrid.classList) {
			editorPreviewGrid.classList.toggle("hidden", calendarPanelActive);
		}
		if (calendarPanel && calendarPanel.classList) {
			calendarPanel.classList.toggle("hidden", !calendarPanelActive);
		}
		if (calendarPanelActive) {
			// Only reset to default view when opening for the first time (no events loaded yet)
			if (!calendarState.lastLoadedAt) {
				calendarState.view = loadCalendarDefaultView();
			}
			updateCalendarViewButtons();
			applyCalendarFreeSlotsVisibility();
			fetchGoogleCalendarStatus();
			fetchOutlookCalendarStatus();
			renderCalendarPanel();
			refreshCalendarEvents(true);
		}
		renderRoomTabs();
	}

	function setCalendarSidebarCollapsed(collapsed) {
		const next = Boolean(collapsed);
		if (calendarSidebar && calendarSidebar.classList) {
			calendarSidebar.classList.toggle("hidden", next);
		}
		if (calendarLayout && calendarLayout.classList) {
			calendarLayout.classList.remove(
				"lg:grid-cols-[minmax(0,1fr)_200px]",
				"lg:grid-cols-[minmax(0,1fr)_260px]",
				"lg:grid-cols-1"
			);
			calendarLayout.classList.add(
				next ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_260px]"
			);
		}
		if (calendarSidebarToggle) {
			calendarSidebarToggle.setAttribute(
				"aria-expanded",
				next ? "false" : "true"
			);
			const icon = calendarSidebarToggle.querySelector(
				"[data-role=\"calendarSidebarChevron\"]"
			);
			if (icon) icon.classList.toggle("rotate-180", next);
		}
	}

	function startOfDay(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	function addDays(date, days) {
		const next = new Date(date);
		next.setDate(next.getDate() + days);
		return next;
	}

	function startOfWeek(date) {
		const d = startOfDay(date);
		const dow = (d.getDay() + 6) % 7; // Monday start
		d.setDate(d.getDate() - dow);
		return d;
	}

	function startOfMonth(date) {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	function formatTime(date) {
		return formatTimePart(date);
	}

	function formatDayLabel(date) {
		const weekday = date.toLocaleDateString(getUiLocale(), {
			weekday: "short",
		});
		const datePart = formatDatePart(date);
		if (weekday && datePart) return `${weekday} ${datePart}`;
		return weekday || datePart || "";
	}

	function formatCalendarTitle(view, date) {
		if (view === "day") {
			const weekday = date.toLocaleDateString(getUiLocale(), {
				weekday: "long",
			});
			const datePart = formatDatePart(date);
			if (weekday && datePart) return `${weekday} · ${datePart}`;
			return weekday || datePart || "";
		}
		if (view === "week") {
			const start = startOfWeek(date);
			const end = addDays(start, 6);
			const startPart = formatDatePart(start);
			const endPart = formatDatePart(end);
			if (startPart && endPart) return `${startPart} – ${endPart}`;
			return startPart || endPart || "";
		}
		return date.toLocaleDateString(getUiLocale(), {
			month: "long",
			year: "numeric",
		});
	}

	function getIsoWeekNumber(date) {
		const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		const dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
	}

	function loadCalendarFreeSlotsVisible() {
		try {
			const raw = String(localStorage.getItem(CALENDAR_FREE_SLOTS_KEY) || "1");
			return raw !== "0";
		} catch {
			return true;
		}
	}

	function saveCalendarFreeSlotsVisible(next) {
		calendarFreeSlotsVisible = Boolean(next);
		try {
			localStorage.setItem(
				CALENDAR_FREE_SLOTS_KEY,
				calendarFreeSlotsVisible ? "1" : "0"
			);
		} catch {
			// ignore
		}
		applyCalendarFreeSlotsVisibility();
	}

	function applyCalendarFreeSlotsVisibility() {
		if (calendarFreeSlotsWrap && calendarFreeSlotsWrap.classList) {
			calendarFreeSlotsWrap.classList.toggle(
				"hidden",
				!calendarFreeSlotsVisible
			);
		}
		if (calendarFreeToggle) {
			calendarFreeToggle.setAttribute(
				"aria-pressed",
				calendarFreeSlotsVisible ? "true" : "false"
			);
			calendarFreeToggle.classList.toggle(
				"bg-white/10",
				calendarFreeSlotsVisible
			);
			calendarFreeToggle.classList.toggle(
				"text-slate-100",
				calendarFreeSlotsVisible
			);
			calendarFreeToggle.classList.toggle(
				"text-slate-300",
				!calendarFreeSlotsVisible
			);
		}
	}

	function parseLocalEventDate(raw) {
		if (!raw) return null;
		const date = raw instanceof Date ? raw : new Date(raw);
		if (Number.isNaN(date.getTime())) return null;
		return date;
	}

	function normalizeLocalCalendarEvent(it) {
		if (!it) return null;
		const id = String(it.id || "").trim() || createClientId();
		const title = String(it.title || "").trim() || "(Ohne Titel)";
		const start = parseLocalEventDate(it.start);
		const end = parseLocalEventDate(it.end);
		if (!start || !end) return null;
		const allDay = Boolean(it.allDay);
		const location = String(it.location || "").trim();
		const googleEventId = String(it.googleEventId || "").trim();
		const outlookEventId = String(it.outlookEventId || "").trim();
		return {
			id,
			title,
			start,
			end,
			allDay,
			location,
			googleEventId,
			outlookEventId,
		};
	}

	function serializeLocalCalendarEvent(evt) {
		return {
			id: evt.id,
			title: evt.title,
			start: evt.start.toISOString(),
			end: evt.end.toISOString(),
			allDay: Boolean(evt.allDay),
			location: evt.location || "",
			googleEventId: evt.googleEventId || "",
			outlookEventId: evt.outlookEventId || "",
		};
	}

	function loadLocalCalendarEventsRaw() {
		try {
			const raw = localStorage.getItem(CALENDAR_LOCAL_EVENTS_KEY);
			const parsed = JSON.parse(raw || "[]");
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	}

	function loadLocalCalendarEvents() {
		return loadLocalCalendarEventsRaw()
			.map(normalizeLocalCalendarEvent)
			.filter(Boolean);
	}

	function saveLocalCalendarEvents(list, opts) {
		const normalized = Array.isArray(list)
			? list.map(normalizeLocalCalendarEvent).filter(Boolean)
			: [];
		calendarState.localEvents = normalized;
		try {
			localStorage.setItem(
				CALENDAR_LOCAL_EVENTS_KEY,
				JSON.stringify(normalized.map(serializeLocalCalendarEvent))
			);
		} catch {
			// ignore
		}
		if (!(opts && opts.skipRender)) {
			renderCalendarSettings();
			renderCalendarPanel();
		}
		if (!(opts && opts.skipSync)) {
			scheduleCalendarSettingsSync();
		}
	}

	function loadCalendarGoogleId() {
		try {
			const raw = String(
				localStorage.getItem(CALENDAR_GOOGLE_CAL_ID_KEY) || "primary"
			).trim();
			return raw || "primary";
		} catch {
			return "primary";
		}
	}

	function saveCalendarGoogleId(id, opts) {
		const safe = String(id || "primary").trim() || "primary";
		try {
			localStorage.setItem(CALENDAR_GOOGLE_CAL_ID_KEY, safe);
		} catch {
			// ignore
		}
		if (!(opts && opts.skipRender)) {
			renderCalendarSettings();
		}
		if (!(opts && opts.skipSync)) {
			scheduleCalendarSettingsSync();
		}
	}

	function loadCalendarOutlookId() {
		try {
			const raw = String(
				localStorage.getItem(CALENDAR_OUTLOOK_CAL_ID_KEY) || "primary"
			).trim();
			return raw || "primary";
		} catch {
			return "primary";
		}
	}

	function saveCalendarOutlookId(id, opts) {
		const safe = String(id || "primary").trim() || "primary";
		try {
			localStorage.setItem(CALENDAR_OUTLOOK_CAL_ID_KEY, safe);
		} catch {
			// ignore
		}
		if (!(opts && opts.skipRender)) {
			renderCalendarSettings();
		}
		if (!(opts && opts.skipSync)) {
			scheduleCalendarSettingsSync();
		}
	}

	function loadCalendarSyncTarget() {
		try {
			const raw = String(
				localStorage.getItem(CALENDAR_SYNC_TARGET_KEY) || "local"
			)
				.trim()
				.toLowerCase();
			return ["local", "google", "outlook"].includes(raw) ? raw : "local";
		} catch {
			return "local";
		}
	}

	function saveCalendarSyncTarget(target) {
		const safe = ["local", "google", "outlook"].includes(target)
			? target
			: "local";
		try {
			localStorage.setItem(CALENDAR_SYNC_TARGET_KEY, safe);
		} catch {
			// ignore
		}
	}

	calendarFreeSlotsVisible = loadCalendarFreeSlotsVisible();
	calendarState.localEvents = loadLocalCalendarEvents();
	applyCalendarFreeSlotsVisibility();

	function parseIcsDate(value) {
		const raw = String(value || "").trim();
		if (!raw) return null;
		if (/^\d{8}$/.test(raw)) {
			const y = Number(raw.slice(0, 4));
			const m = Number(raw.slice(4, 6)) - 1;
			const d = Number(raw.slice(6, 8));
			return { date: new Date(y, m, d), allDay: true };
		}
		const match = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/);
		if (!match) return null;
		const y = Number(match[1]);
		const mo = Number(match[2]) - 1;
		const d = Number(match[3]);
		const h = Number(match[4] || 0);
		const mi = Number(match[5] || 0);
		const s = Number(match[6] || 0);
		if (match[7] === "Z") {
			return { date: new Date(Date.UTC(y, mo, d, h, mi, s)), allDay: false };
		}
		return { date: new Date(y, mo, d, h, mi, s), allDay: false };
	}

	function parseGoogleDate(value, isAllDay) {
		const raw = String(value || "").trim();
		if (!raw) return null;
		if (isAllDay) {
			const parts = raw.split("-").map((v) => Number(v));
			if (parts.length !== 3) return null;
			return new Date(parts[0], parts[1] - 1, parts[2]);
		}
		const date = new Date(raw);
		return Number.isNaN(date.getTime()) ? null : date;
	}

	function parseOutlookDate(value, isAllDay) {
		const raw = String(value || "").trim();
		if (!raw) return null;
		if (isAllDay) {
			const datePart = raw.split("T")[0];
			const parts = datePart.split("-").map((v) => Number(v));
			if (parts.length !== 3) return null;
			return new Date(parts[0], parts[1] - 1, parts[2]);
		}
		const date = new Date(raw);
		return Number.isNaN(date.getTime()) ? null : date;
	}

	function unfoldIcsLines(text) {
		const rawLines = String(text || "")
			.replace(/\r\n/g, "\n")
			.replace(/\r/g, "\n")
			.split("\n");
		const out = [];
		for (const line of rawLines) {
			if (!line) continue;
			if (/^[ \t]/.test(line) && out.length) {
				out[out.length - 1] += line.trimStart();
				continue;
			}
			out.push(line.trim());
		}
		return out;
	}

	function parseIcsEvents(text) {
		const lines = unfoldIcsLines(text);
		const events = [];
		let current = null;
		for (const line of lines) {
			if (line === "BEGIN:VEVENT") {
				current = {};
				continue;
			}
			if (line === "END:VEVENT") {
				if (current && current.start) {
					const start = current.start;
					let end = current.end;
					if (!end) {
						end = current.allDay
							? addDays(start, 1)
							: new Date(start.getTime() + 60 * 60 * 1000);
					}
					events.push({
						id: current.uid || createClientId(),
						start,
						end,
						allDay: Boolean(current.allDay),
						title: current.summary || "(Ohne Titel)",
						location: current.location || "",
					});
				}
				current = null;
				continue;
			}
			if (!current) continue;
			const idx = line.indexOf(":");
			if (idx < 0) continue;
			const keyPart = line.slice(0, idx);
			const value = line.slice(idx + 1);
			const [rawKey] = keyPart.split(";");
			const key = rawKey.toUpperCase();
			if (key === "DTSTART") {
				const parsed = parseIcsDate(value);
				if (parsed) {
					current.start = parsed.date;
					current.allDay = parsed.allDay;
				}
			}
			if (key === "DTEND") {
				const parsed = parseIcsDate(value);
				if (parsed) {
					current.end = parsed.date;
				}
			}
			if (key === "SUMMARY") {
				current.summary = value;
			}
			if (key === "LOCATION") {
				current.location = value;
			}
			if (key === "UID") {
				current.uid = value;
			}
		}
		return events;
	}

	function mergeCalendarEvents(sources, results) {
		const merged = [];
		results.forEach((res, idx) => {
			if (res.status !== "fulfilled") return;
			const source = sources[idx];
			const events = Array.isArray(res.value) ? res.value : [];
			events.forEach((evt) => {
				merged.push({
					...evt,
					calendarId: source.id,
					calendarName: source.name,
					color: source.color,
				});
			});
		});
		return merged;
	}

	function getCalendarRange(view, cursor) {
		if (view === "day") {
			const start = startOfDay(cursor);
			return { start, end: addDays(start, 1) };
		}
		if (view === "week") {
			const start = startOfWeek(cursor);
			return { start, end: addDays(start, 7) };
		}
		const monthStart = startOfMonth(cursor);
		const gridStart = startOfWeek(monthStart);
		return { start: gridStart, end: addDays(gridStart, 42) };
	}

	async function fetchGoogleCalendarEvents(range) {
		if (!googleCalendarConnected) return [];
		const startIso = range.start.toISOString();
		const endIso = range.end.toISOString();
		try {
			const res = await api(
				`/api/calendar/google/events?start=${encodeURIComponent(
					startIso
				)}&end=${encodeURIComponent(endIso)}`,
				{},
				0
			);
			const items = Array.isArray(res && res.events) ? res.events : [];
			return items
				.map((evt) => {
					const allDay = Boolean(evt.allDay);
					const start = parseGoogleDate(evt.start, allDay);
					const end = parseGoogleDate(evt.end, allDay);
					if (!start || !end) return null;
					return {
						id: String(evt.id || ""),
						start,
						end,
						allDay,
						title: String(evt.title || "(Ohne Titel)"),
						location: String(evt.location || ""),
						calendarId: CALENDAR_GOOGLE_SOURCE.id,
						calendarName: CALENDAR_GOOGLE_SOURCE.name,
						color: CALENDAR_GOOGLE_SOURCE.color,
					};
				})
				.filter(Boolean);
		} catch (err) {
			if (err && err.status === 403) {
				googleCalendarConnected = false;
				setGoogleCalendarUi(false);
			}
			return [];
		}
	}

	async function fetchOutlookCalendarEvents(range) {
		if (!outlookCalendarConnected) return [];
		const startIso = range.start.toISOString();
		const endIso = range.end.toISOString();
		try {
			const res = await api(
				`/api/calendar/outlook/events?start=${encodeURIComponent(
					startIso
				)}&end=${encodeURIComponent(endIso)}`
			);
			const items = Array.isArray(res && res.events) ? res.events : [];
			return items
				.map((evt) => {
					const allDay = Boolean(evt.allDay);
					const start = parseOutlookDate(evt.start, allDay);
					const end = parseOutlookDate(evt.end, allDay);
					if (!start || !end) return null;
					return {
						id: String(evt.id || ""),
						start,
						end,
						allDay,
						title: String(evt.title || "(Ohne Titel)"),
						location: String(evt.location || ""),
						calendarId: CALENDAR_OUTLOOK_SOURCE.id,
						calendarName: CALENDAR_OUTLOOK_SOURCE.name,
						color: CALENDAR_OUTLOOK_SOURCE.color,
					};
				})
				.filter(Boolean);
		} catch {
			return [];
		}
	}

	async function refreshCalendarEvents(force) {
		if (calendarState.loading) return;
		const now = Date.now();
		if (!force && now - calendarState.lastLoadedAt < 60 * 1000) return;
		const sources = loadCalendarSources().filter((s) => s.enabled && s.url);
		if (!calendarStatus || !calendarGrid) return;
		calendarState.loading = true;
		calendarStatus.textContent = "Loading calendars…";
		// Don't clear the grid – keep existing content visible to avoid flash/flicker
		const range = getCalendarRange(
			calendarState.view,
			calendarState.cursor || new Date()
		);
		let googleEvents = [];
		let outlookEvents = [];
		if (googleCalendarConnected) {
			googleEvents = await fetchGoogleCalendarEvents(range);
		}
		if (outlookCalendarConnected) {
			outlookEvents = await fetchOutlookCalendarEvents(range);
		}
		if (!sources.length) {
			calendarState.externalEvents = [...googleEvents, ...outlookEvents];
			calendarState.lastLoadedAt = Date.now();
			calendarState.loading = false;
			calendarStatus.textContent =
				calendarState.localEvents.length > 0 ||
				googleEvents.length > 0 ||
				outlookEvents.length > 0
					? "Kalender aktualisiert."
					: "Keine Kalenderquellen aktiv.";
			renderCalendarPanel();
			return;
		}
		const results = await Promise.allSettled(
			sources.map(async (src) => {
				const proxyUrl = `/api/calendar/ics?url=${encodeURIComponent(
					src.url
				)}`;
				const res = await fetch(proxyUrl, { cache: "no-store" });
				if (!res.ok) throw new Error("fetch_failed");
				const text = await res.text();
				return parseIcsEvents(text);
			})
		);
		const errors = results.filter((r) => r.status === "rejected").length;
		calendarState.externalEvents = [
			...mergeCalendarEvents(sources, results),
			...googleEvents,
			...outlookEvents,
		];
		calendarState.lastLoadedAt = Date.now();
		calendarState.loading = false;
		const okCount = results.length - errors;
		calendarStatus.textContent = `${okCount} calendars loaded${
			errors ? ` · ${errors} errors` : ""
		}${googleEvents.length ? " · Google sync" : ""}${
			outlookEvents.length ? " · Outlook sync" : ""
		}`;
		renderCalendarPanel();
		if (commonFreeSlotsSharing) broadcastAvailability();
	}

	function scheduleCalendarRefresh() {
		if (calendarRefreshTimer) window.clearTimeout(calendarRefreshTimer);
		calendarRefreshTimer = window.setTimeout(() => {
			calendarRefreshTimer = 0;
			refreshCalendarEvents(true);
		}, 400);
	}

	function updateCalendarViewButtons() {
		if (!calendarViewButtons || !calendarViewButtons.length) return;
		calendarViewButtons.forEach((btn) => {
			const name = String(btn.getAttribute("data-calendar-view") || "");
			const active = name === calendarState.view;
			btn.classList.toggle("bg-white/10", active);
			btn.classList.toggle("text-slate-100", active);
			btn.classList.toggle("text-slate-300", !active);
		});
	}

	function getCalendarEvents() {
		const external = Array.isArray(calendarState.externalEvents)
			? calendarState.externalEvents
			: [];
		const local = Array.isArray(calendarState.localEvents)
			? calendarState.localEvents
			: [];
		const localDecorated = local.map((evt) => ({
			...evt,
			calendarId: CALENDAR_LOCAL_SOURCE.id,
			calendarName: CALENDAR_LOCAL_SOURCE.name,
			color: CALENDAR_LOCAL_SOURCE.color,
		}));
		return [...external, ...localDecorated];
	}

	function renderCalendarLegend() {
		if (!calendarLegend) return;
		const sources = loadCalendarSources();
		const localCount = Array.isArray(calendarState.localEvents)
			? calendarState.localEvents.length
			: 0;
		const hasGoogle = googleCalendarConnected;
		const hasOutlook = outlookCalendarConnected;
		if (!sources.length && !localCount && !hasGoogle && !hasOutlook) {
			calendarLegend.innerHTML =
				'<div class="text-xs text-slate-400">Keine Kalender verbunden.</div>';
			return;
		}
		const localRow = localCount
			? `
				<div class="flex items-center justify-between gap-2 text-xs text-slate-300">
					<div class="flex items-center gap-2">
						<span class="inline-flex h-2.5 w-2.5 rounded-full" style="background:${escapeAttr(
							CALENDAR_LOCAL_SOURCE.color
						)}"></span>
						<span class="truncate">${escapeHtml(
							CALENDAR_LOCAL_SOURCE.name
						)}</span>
					</div>
					<span class="text-[10px] text-slate-500">lokal</span>
				</div>`
			: "";
		const googleRow = hasGoogle
			? `
				<div class="flex items-center justify-between gap-2 text-xs text-slate-300">
					<div class="flex items-center gap-2">
						<span class="inline-flex h-2.5 w-2.5 rounded-full" style="background:${escapeAttr(
							CALENDAR_GOOGLE_SOURCE.color
						)}"></span>
						<span class="truncate">${escapeHtml(
							CALENDAR_GOOGLE_SOURCE.name
						)}</span>
					</div>
					<span class="text-[10px] text-slate-500">sync</span>
				</div>`
			: "";
		const outlookRow = hasOutlook
			? `
				<div class="flex items-center justify-between gap-2 text-xs text-slate-300">
					<div class="flex items-center gap-2">
						<span class="inline-flex h-2.5 w-2.5 rounded-full" style="background:${escapeAttr(
							CALENDAR_OUTLOOK_SOURCE.color
						)}"></span>
						<span class="truncate">${escapeHtml(
							CALENDAR_OUTLOOK_SOURCE.name
						)}</span>
					</div>
					<span class="text-[10px] text-slate-500">sync</span>
				</div>`
			: "";
		calendarLegend.innerHTML = `${localRow}${googleRow}${outlookRow}${sources
			.map((src) => {
				const dot = `<span class="inline-flex h-2.5 w-2.5 rounded-full" style="background:${escapeAttr(
					src.color
				)}"></span>`;
				const state = src.enabled ? "" : "<span class=\"text-[10px] text-slate-500\">inaktiv</span>";
				return `
					<div class="flex items-center justify-between gap-2 text-xs text-slate-300">
						<div class="flex items-center gap-2">
							${dot}
							<span class="truncate">${escapeHtml(src.name)}</span>
						</div>
						${state}
					</div>`;
			})
			.join("")}`;
	}

	function moveCalendarCursor(direction) {
		const dir = Number(direction) || 0;
		if (!dir) return;
		const view = calendarState.view;
		const base = calendarState.cursor || new Date();
		const next = new Date(base);
		if (view === "day") {
			next.setDate(next.getDate() + dir);
		} else if (view === "week") {
			next.setDate(next.getDate() + dir * 7);
		} else {
			next.setMonth(next.getMonth() + dir);
		}
		calendarState.cursor = next;
		renderCalendarPanel();
	}

	function buildWorkWindow(day) {
		const start = new Date(
			day.getFullYear(),
			day.getMonth(),
			day.getDate(),
			CALENDAR_WORK_START_HOUR,
			0,
			0
		);
		const end = new Date(
			day.getFullYear(),
			day.getMonth(),
			day.getDate(),
			CALENDAR_WORK_END_HOUR,
			0,
			0
		);
		return { start, end };
	}

	function mergeIntervals(intervals) {
		if (!intervals.length) return [];
		const sorted = intervals
			.slice()
			.sort((a, b) => a[0].getTime() - b[0].getTime());
		const merged = [sorted[0]];
		for (let i = 1; i < sorted.length; i += 1) {
			const [start, end] = sorted[i];
			const last = merged[merged.length - 1];
			if (start <= last[1]) {
				last[1] = new Date(Math.max(last[1].getTime(), end.getTime()));
			} else {
				merged.push([start, end]);
			}
		}
		return merged;
	}

	function computeFreeSlotsForDay(day, events) {
		const dayStart = startOfDay(day);
		const dayEnd = addDays(dayStart, 1);
		const window = buildWorkWindow(dayStart);
		const busy = events
			.filter((evt) => evt.start < dayEnd && evt.end > dayStart)
			.map((evt) => {
				const start = evt.allDay ? dayStart : new Date(evt.start);
				const end = evt.allDay ? dayEnd : new Date(evt.end);
				return [
					start < dayStart ? dayStart : start,
					end > dayEnd ? dayEnd : end,
				];
			})
			.filter((pair) => pair[1] > pair[0]);
		const merged = mergeIntervals(busy);
		const free = [];
		let cursor = window.start;
		const windowEnd = window.end;
		for (const [start, end] of merged) {
			if (end <= window.start || start >= windowEnd) continue;
			const sliceStart = start < window.start ? window.start : start;
			const sliceEnd = end > windowEnd ? windowEnd : end;
			if (sliceStart > cursor) {
				free.push([cursor, sliceStart]);
			}
			if (sliceEnd > cursor) cursor = sliceEnd;
		}
		if (cursor < windowEnd) {
			free.push([cursor, windowEnd]);
		}
		return free.filter((slot) => slot[1] > slot[0]);
	}

	/* ── Manual Free Slot Selection Helpers ── */

	function dayKeyFromDate(d) {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${y}-${m}-${dd}`;
	}

	function slotKey(startMs, endMs) {
		return `${startMs}_${endMs}`;
	}

	function loadManualFreeSlots() {
		try {
			const raw = localStorage.getItem(MANUAL_FREE_SLOTS_KEY);
			if (!raw) return new Map();
			const obj = JSON.parse(raw);
			const map = new Map();
			for (const [dk, arr] of Object.entries(obj)) {
				if (Array.isArray(arr)) map.set(dk, new Set(arr));
			}
			return map;
		} catch {
			return new Map();
		}
	}

	function saveManualFreeSlots() {
		try {
			const obj = {};
			for (const [dk, set] of manualFreeSlots) {
				obj[dk] = Array.from(set);
			}
			localStorage.setItem(MANUAL_FREE_SLOTS_KEY, JSON.stringify(obj));
		} catch {
			// ignore
		}
	}

	function isSlotSelected(day, startMs, endMs) {
		const dk = dayKeyFromDate(day);
		const set = manualFreeSlots.get(dk);
		if (!set) return true; // default: all selected if no manual override
		return set.has(slotKey(startMs, endMs));
	}

	function toggleSlotSelection(day, startMs, endMs, allSlotKeys) {
		const dk = dayKeyFromDate(day);
		let set = manualFreeSlots.get(dk);
		const sk = slotKey(startMs, endMs);
		if (!set) {
			// First toggle on this day: initialize with all slots selected, then toggle
			set = new Set(allSlotKeys);
			manualFreeSlots.set(dk, set);
		}
		if (set.has(sk)) {
			set.delete(sk);
		} else {
			set.add(sk);
		}
		saveManualFreeSlots();
	}

	/** Marker key: when present in a day's Set, the entire day is explicitly marked available (opt-in) */
	const FULL_DAY_AVAILABLE_KEY = "__day_available__";

	function isDayAvailable(day) {
		const dk = dayKeyFromDate(day);
		const set = manualFreeSlots.get(dk);
		if (!set) return false; // default: not selected (opt-in)
		if (set.has(FULL_DAY_AVAILABLE_KEY)) return true;
		return false;
	}

	function toggleDayAvailability(day) {
		const dk = dayKeyFromDate(day);
		let set = manualFreeSlots.get(dk);
		if (!set) {
			// Day was not selected → mark available
			set = new Set([FULL_DAY_AVAILABLE_KEY]);
			manualFreeSlots.set(dk, set);
		} else if (set.has(FULL_DAY_AVAILABLE_KEY)) {
			// Day was available → remove marker (deselect)
			set.delete(FULL_DAY_AVAILABLE_KEY);
			if (set.size === 0) manualFreeSlots.delete(dk);
		} else {
			// Day has individual slot selections but no available marker → mark available
			set.add(FULL_DAY_AVAILABLE_KEY);
		}
		saveManualFreeSlots();
	}

	function getSelectedFreeSlotsForDay(day, events) {
		// If day is not explicitly selected, return empty
		if (!isDayAvailable(day)) return [];
		const slots = computeFreeSlotsForDay(day, events);
		const dk = dayKeyFromDate(day);
		const set = manualFreeSlots.get(dk);
		if (!set) return []; // no explicit selection
		// If day is available (full day marker) but no individual slot keys → return all slots
		if (set.size === 1 && set.has(FULL_DAY_AVAILABLE_KEY)) return slots;
		return slots.filter(([s, e]) => set.has(slotKey(s.getTime(), e.getTime())));
	}

	function cleanupOldManualSlots() {
		// Remove entries older than 14 days
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - 14);
		const cutoffKey = dayKeyFromDate(cutoff);
		let changed = false;
		for (const dk of manualFreeSlots.keys()) {
			if (dk < cutoffKey) {
				manualFreeSlots.delete(dk);
				changed = true;
			}
		}
		if (changed) saveManualFreeSlots();
	}

	function renderCalendarFreeSlots(view, cursor, events) {
		if (!calendarFreeSlots) return;
		if (!calendarFreeSlotsVisible) {
			calendarFreeSlots.innerHTML = "";
			return;
		}
		if (view === "month") {
			// Show summary of selected days in current month
			const mStart = startOfMonth(cursor);
			const daysInMonth = new Date(mStart.getFullYear(), mStart.getMonth() + 1, 0).getDate();
			let availCount = 0;
			for (let i = 0; i < daysInMonth; i++) {
				const d = addDays(mStart, i);
				if (isDayAvailable(d)) availCount++;
			}
			calendarFreeSlots.innerHTML =
				`<div class="text-[11px] text-slate-400">${escapeHtml(t("calendar.free.month_hint"))}</div>
				 <div class="mt-1 text-[11px] ${availCount === daysInMonth ? "text-emerald-400" : "text-amber-400"}">${availCount}/${daysInMonth} ${escapeHtml(t("calendar.free.days_available"))}</div>`;
			return;
		}
		if (view === "day") {
			const slots = computeFreeSlotsForDay(cursor, events);
			if (!slots.length) {
				calendarFreeSlots.innerHTML =
					`<div class="text-[11px] text-slate-500">${escapeHtml(t("calendar.free.none"))}</div>`;
				return;
			}
			const dayDate = cursor;
			calendarFreeSlots.innerHTML = slots
				.map(([start, end]) => {
					const sMs = start.getTime();
					const eMs = end.getTime();
					const selected = isSlotSelected(dayDate, sMs, eMs);
					return `<div class="free-slot-item${selected ? " free-slot-selected" : ""}" data-free-slot="${sMs}|${eMs}">
						<span class="free-slot-check">${selected ? "✓" : ""}</span>
						<span>${formatTime(start)} – ${formatTime(end)}</span>
					</div>`;
				})
				.join("");
			return;
		}
		// Week view: show slots per day with selection count
		const weekStart = startOfWeek(cursor);
		const rows = Array.from({ length: 7 }).map((_, idx) => {
			const day = addDays(weekStart, idx);
			const slots = computeFreeSlotsForDay(day, events);
			const label = formatDayLabel(day);
			if (!slots.length) {
				return `<div class="flex items-center justify-between gap-2 text-[11px]">
					<span class="text-slate-400">${label}</span>
					<span class="text-slate-500">—</span>
				</div>`;
			}
			const selected = getSelectedFreeSlotsForDay(day, events);
			const countText = `${selected.length}/${slots.length}`;
			const allSelected = selected.length === slots.length;
			return `<div class="flex items-center justify-between gap-2 text-[11px]">
				<span class="text-slate-400">${label}</span>
				<span>${selected.length ? formatTime(selected[0][0]) + " – " + formatTime(selected[0][1]) : "—"}</span>
				<span class="text-[10px] ${allSelected ? "text-emerald-400" : "text-amber-400"}">${countText}</span>
			</div>`;
		});
		calendarFreeSlots.innerHTML = rows.join("");
	}

	/* ── My Selections Panel ── */

	function renderMySelections() {
		if (!calendarMySelections) return;
		const events = getCalendarEvents();
		// Collect all days where the user has marked availability
		const entries = [];
		for (const [dk, set] of manualFreeSlots) {
			if (!set || !set.has(FULL_DAY_AVAILABLE_KEY)) continue;
			entries.push(dk);
		}
		entries.sort();

		if (calendarMySelectionsCount) {
			calendarMySelectionsCount.textContent = entries.length
				? `${entries.length}`
				: "";
		}

		if (!entries.length) {
			calendarMySelections.innerHTML =
				`<div class="text-[11px] text-slate-500">${escapeHtml(t("calendar.my_selections.empty"))}</div>`;
			return;
		}

		const rows = entries.map((dk) => {
			const parts = dk.split("-");
			const day = new Date(
				Number(parts[0]),
				Number(parts[1]) - 1,
				Number(parts[2])
			);
			const label = formatDayLabel(day);
			const weekday = day.toLocaleDateString(uiLang === "de" ? "de-DE" : "en-US", { weekday: "short" });
			const set = manualFreeSlots.get(dk);
			const slots = computeFreeSlotsForDay(day, events);
			const selectedSlots = getSelectedFreeSlotsForDay(day, events);
			// Determine slot info text
			let slotInfo = "";
			if (selectedSlots.length && selectedSlots.length < slots.length) {
				slotInfo = `${selectedSlots.length}/${slots.length} ${escapeHtml(t("calendar.my_selections.slots"))}`;
			} else if (selectedSlots.length) {
				slotInfo = escapeHtml(t("calendar.my_selections.all_slots"));
			}
			// First selected time range for display
			let timeRange = "";
			if (selectedSlots.length) {
				timeRange = `${formatTime(selectedSlots[0][0])} – ${formatTime(selectedSlots[selectedSlots.length - 1][1])}`;
			}

			return `<div class="my-selection-row group" data-my-sel-day="${escapeAttr(dk)}">
				<div class="flex items-center gap-2 min-w-0">
					<span class="inline-flex h-2 w-2 rounded-full bg-emerald-400 shrink-0"></span>
					<span class="font-medium text-slate-200 truncate">${weekday}, ${label}</span>
				</div>
				<div class="flex items-center gap-2">
					${timeRange ? `<span class="text-[10px] text-slate-400">${timeRange}</span>` : ""}
					${slotInfo ? `<span class="text-[10px] text-emerald-400/70">${slotInfo}</span>` : ""}
					<button type="button" class="my-sel-jump opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-fuchsia-400 hover:text-fuchsia-300 shrink-0" data-my-sel-jump="${escapeAttr(dk)}" title="${escapeAttr(t("calendar.my_selections.jump"))}">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 inline-block"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
					</button>
				</div>
			</div>`;
		});
		calendarMySelections.innerHTML = rows.join("");
	}

	function jumpToCalendarDay(dayKey) {
		const parts = dayKey.split("-");
		if (parts.length !== 3) return;
		const day = new Date(
			Number(parts[0]),
			Number(parts[1]) - 1,
			Number(parts[2])
		);
		if (isNaN(day.getTime())) return;
		// Navigate to month view with focus on the target day
		calendarState.cursor = day;
		calendarState.view = "month";
		updateCalendarViewButtons();
		// Set temporary focus highlight
		calendarFocusedDayKey = dayKey;
		if (calendarFocusedDayTimer) window.clearTimeout(calendarFocusedDayTimer);
		calendarFocusedDayTimer = window.setTimeout(() => {
			calendarFocusedDayKey = "";
			calendarFocusedDayTimer = 0;
			// Remove highlight class after fade
			if (calendarGrid) {
				const el = calendarGrid.querySelector(".calendar-day-focused");
				if (el) el.classList.remove("calendar-day-focused");
			}
		}, 3000);
		renderCalendarPanel();
		// Scroll the focused cell into view
		if (calendarGrid) {
			const cell = calendarGrid.querySelector(`[data-calendar-day="${dayKey}"]`);
			if (cell) cell.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}

	/* ── Common Free Slots (Availability Broadcasting) ── */

	function loadCommonFreeSlotsSharing() {
		try {
			return localStorage.getItem(COMMON_FREE_SLOTS_KEY) === "1";
		} catch {
			return false;
		}
	}

	function saveCommonFreeSlotsSharing(next) {
		commonFreeSlotsSharing = Boolean(next);
		try {
			localStorage.setItem(COMMON_FREE_SLOTS_KEY, commonFreeSlotsSharing ? "1" : "0");
		} catch {
			// ignore
		}
		applyCommonFreeToggleUI();
	}

	function applyCommonFreeToggleUI() {
		if (!calendarCommonFreeToggle) return;
		calendarCommonFreeToggle.setAttribute("aria-pressed", commonFreeSlotsSharing ? "true" : "false");
		calendarCommonFreeToggle.title = commonFreeSlotsSharing ? t("calendar.common.sharing") : t("calendar.common.toggle");
	}

	function isInSharedRoom() {
		const roomName = normalizeRoom(room);
		const keyName = normalizeKey(key);
		return roomName && isRoomMarkedShared(roomName, keyName);
	}

	function extractBusyIntervals(events, rangeStart, rangeEnd) {
		const busy = [];
		for (const evt of events) {
			if (!evt || !evt.start || !evt.end) continue;
			const s = evt.start < rangeStart ? rangeStart : evt.start;
			const e = evt.end > rangeEnd ? rangeEnd : evt.end;
			if (s >= e) continue;
			busy.push({ start: s.getTime(), end: e.getTime() });
		}
		return busy;
	}

	function broadcastAvailability() {
		if (!commonFreeSlotsSharing || !ws || ws.readyState !== 1) return;
		if (!isInSharedRoom()) return;
		const now = new Date();
		const rangeStart = startOfDay(now);
		const rangeEnd = addDays(rangeStart, 7);
		const events = getCalendarEvents();
		// Build busy as complement of manually selected free slots within work window
		const busy = [];
		for (let d = 0; d < 7; d++) {
			const day = addDays(rangeStart, d);
			const window = buildWorkWindow(day);
			const selectedFree = getSelectedFreeSlotsForDay(day, events);
			// Invert selected free to get busy within work window
			let cursor = window.start;
			for (const [freeStart, freeEnd] of selectedFree) {
				if (freeStart > cursor) {
					busy.push({ start: cursor.getTime(), end: freeStart.getTime() });
				}
				if (freeEnd > cursor) cursor = freeEnd;
			}
			if (cursor < window.end) {
				busy.push({ start: cursor.getTime(), end: window.end.getTime() });
			}
		}
		const identity = loadIdentity();
		try {
			ws.send(JSON.stringify({
				type: "availability_state",
				room,
				clientId,
				name: identity.name || "Guest",
				color: identity.color || "#94a3b8",
				busy,
			}));
		} catch {
			// ignore
		}
	}

	function handleAvailabilityState(msg) {
		if (!msg) return;
		// Full state: array of all participants
		if (Array.isArray(msg.participants)) {
			availabilityByClient.clear();
			for (const p of msg.participants) {
				if (!p || !p.clientId) continue;
				availabilityByClient.set(String(p.clientId), {
					name: String(p.name || "Guest"),
					color: String(p.color || "#94a3b8"),
					busy: Array.isArray(p.busy) ? p.busy : [],
				});
			}
		} else if (msg.clientId) {
			// Single participant update
			availabilityByClient.set(String(msg.clientId), {
				name: String(msg.name || "Guest"),
				color: String(msg.color || "#94a3b8"),
				busy: Array.isArray(msg.busy) ? msg.busy : [],
			});
		}
		renderCommonFreeSlots();
	}

	function handleAvailabilityLeave(leftClientId) {
		if (!leftClientId) return;
		if (availabilityByClient.delete(String(leftClientId))) {
			renderCommonFreeSlots();
		}
	}

	function computeCommonFreeSlotsForDay(day, allBusy) {
		const dayStart = startOfDay(day);
		const dayEnd = addDays(dayStart, 1);
		const window = buildWorkWindow(dayStart);
		// Merge all busy intervals from all participants
		const unionBusy = [];
		for (const participantBusy of allBusy) {
			for (const b of participantBusy) {
				const s = new Date(b.start);
				const e = new Date(b.end);
				if (e <= dayStart || s >= dayEnd) continue;
				unionBusy.push([
					s < dayStart ? dayStart : s,
					e > dayEnd ? dayEnd : e,
				]);
			}
		}
		const merged = mergeIntervals(unionBusy);
		const free = [];
		let cursor = window.start;
		const windowEnd = window.end;
		for (const [start, end] of merged) {
			if (end <= window.start || start >= windowEnd) continue;
			const sliceStart = start < window.start ? window.start : start;
			const sliceEnd = end > windowEnd ? windowEnd : end;
			if (sliceStart > cursor) {
				free.push([cursor, sliceStart]);
			}
			if (sliceEnd > cursor) cursor = sliceEnd;
		}
		if (cursor < windowEnd) {
			free.push([cursor, windowEnd]);
		}
		return free.filter((slot) => slot[1] > slot[0]);
	}

	function computePerParticipantFreeForDay(day) {
		const participants = Array.from(availabilityByClient.entries());
		if (!participants.length) return { common: [], perParticipant: [], total: 0 };
		const allBusy = participants.map(([, p]) => p.busy);
		const common = computeCommonFreeSlotsForDay(day, allBusy);
		// For partial info: check each participant's availability per common slot
		const perParticipant = common.map(([start, end]) => {
			let freeCount = 0;
			for (const [, p] of participants) {
				const isBusy = p.busy.some((b) => {
					const bs = b.start;
					const be = b.end;
					return bs < end.getTime() && be > start.getTime();
				});
				if (!isBusy) freeCount++;
			}
			return { start, end, freeCount, total: participants.length };
		});
		return { common, perParticipant, total: participants.length };
	}

	function renderCommonFreeSlots() {
		if (!calendarCommonFreeSlotsWrap) return;
		const shared = isInSharedRoom();
		// Show panel only in shared rooms
		calendarCommonFreeSlotsWrap.classList.toggle("hidden", !shared);
		if (!shared) return;

		// Update participants chips
		if (calendarCommonFreeParticipants) {
			const parts = Array.from(availabilityByClient.entries());
			if (parts.length === 0) {
				calendarCommonFreeParticipants.innerHTML = "";
			} else {
				calendarCommonFreeParticipants.innerHTML = parts
					.map(([cid, p]) => {
						const dotColor = escapeAttr(p.color || "#94a3b8");
						const name = escapeHtml(p.name || "Guest");
						return `<span class="common-slot-chip"><span class="chip-dot" style="background:${dotColor}"></span>${name}</span>`;
					})
					.join("");
			}
		}

		if (!calendarCommonFreeSlots) return;
		const view = calendarState.view;
		const cursor = calendarState.cursor || new Date();

		if (availabilityByClient.size === 0) {
			calendarCommonFreeSlots.innerHTML =
				`<div class="text-[11px] text-slate-500">${escapeHtml(t("calendar.common.no_participants"))}</div>`;
			return;
		}

		if (view === "month") {
			calendarCommonFreeSlots.innerHTML =
				`<div class="text-[11px] text-slate-400">${escapeHtml(t("calendar.common.select_day_week"))}</div>`;
			return;
		}

		if (view === "day") {
			const result = computePerParticipantFreeForDay(cursor);
			if (!result.perParticipant.length) {
				calendarCommonFreeSlots.innerHTML =
					`<div class="text-[11px] text-slate-500">${escapeHtml(t("calendar.common.no_common"))}</div>`;
				return;
			}
			const rows = result.perParticipant.map((slot) => {
				const isAll = slot.freeCount === slot.total;
				const badgeClass = isAll ? "common-slot-badge--all" : "common-slot-badge--partial";
				const badgeText = isAll
					? t("calendar.common.all_free")
					: `${slot.freeCount}/${slot.total}`;
				return `<div class="common-slot-row">
					<span>${formatTime(slot.start)} – ${formatTime(slot.end)}</span>
					<span class="common-slot-badge ${badgeClass}">${escapeHtml(badgeText)}</span>
				</div>`;
			});
			const bestSlot = result.perParticipant.find((s) => s.freeCount === s.total) || result.perParticipant[0];
			if (bestSlot) {
				rows.push(`<button type="button" class="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-slate-200 transition hover:bg-white/10 active:bg-white/15" data-common-book="${bestSlot.start.toISOString()}|${bestSlot.end.toISOString()}">${escapeHtml(t("calendar.common.book_best"))}</button>`);
			}
			calendarCommonFreeSlots.innerHTML = rows.join("");
			return;
		}

		// Week view
		const weekStart = startOfWeek(cursor);
		const rows = Array.from({ length: 7 }).map((_, idx) => {
			const day = addDays(weekStart, idx);
			const result = computePerParticipantFreeForDay(day);
			const label = formatDayLabel(day);
			if (!result.perParticipant.length) {
				return `<div class="common-slot-row text-[11px]">
					<span class="text-slate-400">${label}</span>
					<span class="text-slate-500">—</span>
				</div>`;
			}
			const best = result.perParticipant[0];
			const isAll = best.freeCount === best.total;
			const badgeClass = isAll ? "common-slot-badge--all" : "common-slot-badge--partial";
			const badgeText = isAll
				? t("calendar.common.all_free")
				: `${best.freeCount}/${best.total}`;
			return `<div class="common-slot-row text-[11px]">
				<span class="text-slate-400">${label}</span>
				<span>${formatTime(best.start)} – ${formatTime(best.end)}</span>
				<span class="common-slot-badge ${badgeClass}">${escapeHtml(badgeText)}</span>
			</div>`;
		});
		calendarCommonFreeSlots.innerHTML = rows.join("");
	}

	function renderCalendarPanel() {
		if (!calendarGrid) return;
		const view = calendarState.view;
		const cursor = calendarState.cursor || new Date();
		const sources = loadCalendarSources().filter((s) => s.enabled && s.url);
		const events = getCalendarEvents();
		events.sort((a, b) => a.start.getTime() - b.start.getTime());
		if (calendarGrid && calendarGrid.classList) {
			calendarGrid.classList.toggle("calendar-grid-month", view === "month");
		}
		if (calendarTitle) {
			calendarTitle.textContent = formatCalendarTitle(view, cursor);
		}
		if (calendarWeekLabel) {
			const showWeek = view === "week" || view === "day";
			if (showWeek) {
				calendarWeekLabel.textContent = `KW ${getIsoWeekNumber(cursor)}`;
				calendarWeekLabel.classList.remove("hidden");
			} else {
				calendarWeekLabel.textContent = "";
				calendarWeekLabel.classList.add("hidden");
			}
		}
		renderCalendarLegend();
		if (!sources.length && calendarState.localEvents.length === 0) {
			calendarGrid.innerHTML =
				'<div class="text-sm text-slate-400">Keine Kalenderquellen aktiv.</div>';
			renderCalendarFreeSlots(view, cursor, events);
			return;
		}
		if (!events.length) {
			calendarGrid.innerHTML =
				'<div class="text-sm text-slate-400">Keine Termine in diesem Zeitraum.</div>';
			renderCalendarFreeSlots(view, cursor, events);
			return;
		}
		if (view === "day") {
			const start = startOfDay(cursor);
			const end = addDays(start, 1);
			const dayEvents = events.filter(
				(evt) => evt.start < end && evt.end > start
			);
			calendarGrid.innerHTML = dayEvents.length
				? dayEvents
					.map((evt) => {
						const time = evt.allDay
							? "Ganztägig"
							: `${formatTime(evt.start)} – ${formatTime(evt.end)}`;
						const tooltip = evt.location
							? `${time} · ${evt.title} · ${evt.location}`
							: `${time} · ${evt.title}`;
						const loc = evt.location
							? `<div class=\"text-[11px] text-slate-400\">${escapeHtml(
									evt.location
								)}\</div>`
							: "";
						return `
							<div class="calendar-event rounded-lg bg-slate-950/40 p-3" data-tooltip="${escapeAttr(
								tooltip
							)}">
								<div class="flex items-center justify-between gap-2">
									<div class="text-xs font-semibold text-slate-100">${escapeHtml(
										evt.title
									)}
									</div>
									<span class="text-[11px] text-slate-400">${time}</span>
								</div>
								${loc}
							</div>`;
					})
					.join("")
				: '<div class="text-sm text-slate-400">Keine Termine heute.</div>';
			renderCalendarFreeSlots(view, cursor, events);
			return;
		}
		if (view === "week") {
			const start = startOfWeek(cursor);
			const cols = Array.from({ length: 7 }).map((_, idx) => {
				const day = addDays(start, idx);
				const dayEnd = addDays(day, 1);
				const isToday =
					startOfDay(day).getTime() === startOfDay(new Date()).getTime();
				const dayBorder = isToday ? "border-fuchsia-400/40" : "border-white/10";
				const dayAvail = isDayAvailable(day);
				const availClass = dayAvail ? "calendar-day-available" : "calendar-day-unavailable";
				const dk = dayKeyFromDate(day);
				const dayEvents = events.filter(
					(evt) => evt.start < dayEnd && evt.end > day
				);
				const list = dayEvents.length
					? dayEvents
						.map((evt) => {
							const time = evt.allDay
								? "Ganztägig"
								: formatTime(evt.start);
							const tooltip = evt.location
								? `${time} · ${evt.title} · ${evt.location}`
								: `${time} · ${evt.title}`;
							return `
								<div class="calendar-event rounded-md bg-slate-950/50 px-2 py-1 text-[11px] text-slate-200" data-tooltip="${escapeAttr(
									tooltip
								)}">
									<div class="flex items-center gap-2">
										<span class="inline-flex h-2 w-2 rounded-full" style="background:${escapeAttr(
											evt.color
										)}"></span>
										<span class="truncate">${time} · ${escapeHtml(
											evt.title
										)}</span>
									</div>
								</div>`;
						})
						.join("")
					: '<div class="text-[11px] text-slate-500">Keine Termine</div>';
				return `
					<div class="rounded-lg border ${dayBorder} ${availClass} bg-slate-950/40 p-2 cursor-pointer select-none transition-colors" data-calendar-day="${dk}">
						<div class="flex items-center justify-between">
							<span class="text-[11px] text-slate-400">${formatDayLabel(day)}</span>
							<span class="calendar-day-indicator text-[9px]">${dayAvail ? "✓" : "✕"}</span>
						</div>
						<div class="mt-2 space-y-1">${list}</div>
					</div>`;
			});
			calendarGrid.innerHTML = `<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">${cols.join(
				"")}</div>`;
			renderCalendarFreeSlots(view, cursor, events);
			return;
		}
		const monthStart = startOfMonth(cursor);
		const gridStart = startOfWeek(monthStart);
		const weekdayLabels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
		const weekdayHeader = weekdayLabels
			.map(
				(label) =>
					`<div class="text-[11px] text-slate-400 uppercase tracking-wide">${label}</div>`
			)
			.join("");
		const cells = Array.from({ length: 42 }).map((_, idx) => {
			const day = addDays(gridStart, idx);
			const dayEnd = addDays(day, 1);
			const dk = dayKeyFromDate(day);
			const dayAvail = isDayAvailable(day);
			const dayEvents = events.filter(
				(evt) => evt.start < dayEnd && evt.end > day
			);
			const visibleEvents = dayEvents.slice(0, 2).map((evt) => {
				const time = evt.allDay ? "Ganztägig" : formatTime(evt.start);
				const title = evt.location
					? `${time} · ${evt.title} · ${evt.location}`
					: `${time} · ${evt.title}`;
				return `
							<div class="calendar-event rounded-md bg-slate-950/50 px-2 py-1 text-[10px] text-slate-200" data-tooltip="${escapeAttr(
							title
						)}">
						<div class="flex items-center gap-2">
							<span class="inline-flex h-2 w-2 rounded-full" style="background:${escapeAttr(
								evt.color
							)}"></span>
							<span class="truncate">${escapeHtml(title)}</span>
						</div>
					</div>`;
			});
			const extra =
				dayEvents.length > 2
					? `<span class=\"text-[10px] text-slate-500\">+${
						dayEvents.length - 2
					} weitere</span>`
					: "";
			const isToday = startOfDay(day).getTime() === startOfDay(new Date()).getTime();
			const isCurrentMonth = day.getMonth() === cursor.getMonth();
			const isFocused = dk === calendarFocusedDayKey;
			const borderClass = isFocused
				? ""
				: isToday
					? "border-fuchsia-400/40"
					: (dayAvail ? "border-emerald-500/30" : "border-white/10");
			const focusedClass = isFocused ? " calendar-day-focused" : "";
			const availClass = dayAvail ? "calendar-day-available" : "calendar-day-unavailable";
			const opacityClass = isCurrentMonth ? "" : " opacity-40";
			return `
				<div class="min-h-[88px] rounded-lg border ${borderClass} ${availClass} bg-slate-950/40 p-2 cursor-pointer select-none transition-colors${opacityClass}${focusedClass}" data-calendar-day="${dk}">
					<div class="flex items-center justify-between">
						<span class="text-[11px] text-slate-400">${day.getDate()}</span>
						<span class="calendar-day-indicator text-[9px]">${dayAvail ? "✓" : "✕"}</span>
					</div>
					<div class="mt-1 space-y-1">${visibleEvents.join("")}${
						visibleEvents.length && extra ? `<div>${extra}</div>` : extra
					}</div>
				</div>`;
		});
		calendarGrid.innerHTML = `
				<div class="grid grid-cols-7 gap-2 text-center">
					${weekdayHeader}
				</div>
				<div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
					${cells.join("")}
				</div>`;
		renderCalendarFreeSlots(view, cursor, events);
		renderCommonFreeSlots();
		renderMySelections();
	}

	function formatDateInputValue(date) {
		const offset = date.getTimezoneOffset() * 60 * 1000;
		return new Date(date.getTime() - offset).toISOString().slice(0, 10);
	}

	function openCalendarEventModal(baseDate, endDate) {
		if (!calendarEventModal) return;
		calendarEventModal.classList.remove("hidden");
		calendarEventModal.classList.add("flex");
		calendarEventModal.setAttribute("aria-hidden", "false");
		const date = baseDate instanceof Date ? baseDate : new Date();
		if (calendarEventDate) {
			calendarEventDate.value = formatDateInputValue(date);
		}
		if (calendarEventName) calendarEventName.value = "";
		if (calendarEventLocation) calendarEventLocation.value = "";
		if (calendarEventAllDay) calendarEventAllDay.checked = false;
		if (calendarEventStart) {
			if (baseDate instanceof Date) {
				const hh = String(baseDate.getHours()).padStart(2, "0");
				const mm = String(baseDate.getMinutes()).padStart(2, "0");
				calendarEventStart.value = `${hh}:${mm}`;
			} else {
				calendarEventStart.value = "09:00";
			}
		}
		if (calendarEventEnd) {
			if (endDate instanceof Date) {
				const hh = String(endDate.getHours()).padStart(2, "0");
				const mm = String(endDate.getMinutes()).padStart(2, "0");
				calendarEventEnd.value = `${hh}:${mm}`;
			} else {
				calendarEventEnd.value = "10:00";
			}
		}
		if (calendarEventSyncTarget) {
			calendarEventSyncTarget.value = loadCalendarSyncTarget();
			updateCalendarSyncTargetOptions();
		}
		updateCalendarEventTimeState();
		setTimeout(() => {
			if (calendarEventName) calendarEventName.focus();
		}, 0);
	}

	function closeCalendarEventModal() {
		if (!calendarEventModal) return;
		calendarEventModal.classList.add("hidden");
		calendarEventModal.classList.remove("flex");
		calendarEventModal.setAttribute("aria-hidden", "true");
	}

	function updateCalendarEventTimeState() {
		const allDay = Boolean(calendarEventAllDay && calendarEventAllDay.checked);
		if (calendarEventStart) calendarEventStart.disabled = allDay;
		if (calendarEventEnd) calendarEventEnd.disabled = allDay;
	}

	function buildLocalEventFromModal() {
		const title = String(calendarEventName ? calendarEventName.value : "").trim();
		if (!title) {
			toast("Bitte einen Titel angeben.", "error");
			return null;
		}
		const dateStr = String(calendarEventDate ? calendarEventDate.value : "").trim();
		if (!dateStr) {
			toast("Bitte ein Datum auswählen.", "error");
			return null;
		}
		const allDay = Boolean(calendarEventAllDay && calendarEventAllDay.checked);
		const location = String(
			calendarEventLocation ? calendarEventLocation.value : ""
		).trim();
		let start;
		let end;
		if (allDay) {
			const [y, m, d] = dateStr.split("-").map((v) => Number(v));
			start = new Date(y, m - 1, d, 0, 0, 0);
			end = addDays(start, 1);
		} else {
			const startTime = String(
				calendarEventStart ? calendarEventStart.value : ""
			).trim();
			const endTime = String(
				calendarEventEnd ? calendarEventEnd.value : ""
			).trim();
			if (!startTime || !endTime) {
				toast("Bitte Start- und Endzeit angeben.", "error");
				return null;
			}
			const [y, m, d] = dateStr.split("-").map((v) => Number(v));
			const [sh, sm] = startTime.split(":").map((v) => Number(v));
			const [eh, em] = endTime.split(":").map((v) => Number(v));
			start = new Date(y, m - 1, d, sh, sm || 0, 0);
			end = new Date(y, m - 1, d, eh, em || 0, 0);
			if (!(end > start)) {
				toast("Ende muss nach Start liegen.", "error");
				return null;
			}
		}
		return {
			id: createClientId(),
			title,
			start,
			end,
			allDay,
			location,
			googleEventId: "",
			outlookEventId: "",
		};
	}

	function addLocalCalendarEvent(evt) {
		const list = Array.isArray(calendarState.localEvents)
			? calendarState.localEvents.slice()
			: [];
		list.push(evt);
		saveLocalCalendarEvents(list);
		toast("Termin gespeichert.", "success");
	}

	async function loadUploadsManage() {
		if (!uploadsManageList) return;
		uploadsManageList.innerHTML = "";
		if (uploadsManageEmpty && uploadsManageEmpty.classList) {
			uploadsManageEmpty.textContent = "Lade Uploads…";
			uploadsManageEmpty.classList.remove("hidden");
		}
		try {
			const res = await api("/api/uploads/list");
			const items = Array.isArray(res && res.items) ? res.items : [];
			renderUploadsManageList(items);
		} catch {
			if (uploadsManageEmpty && uploadsManageEmpty.classList) {
				uploadsManageEmpty.textContent =
					"Uploads konnten nicht geladen werden.";
				uploadsManageEmpty.classList.remove("hidden");
			}
		}
	}

	async function loadTrashManage() {
		if (!trashManageList) return;
		trashManageList.innerHTML = "";
		if (trashManageEmpty && trashManageEmpty.classList) {
			trashManageEmpty.textContent = "Loading trash…";
			trashManageEmpty.classList.remove("hidden");
		}
		if (!psState || !psState.authed) {
			if (trashManageEmpty && trashManageEmpty.classList) {
				trashManageEmpty.textContent =
					"Please enable Personal Space to view the trash.";
				trashManageEmpty.classList.remove("hidden");
			}
			return;
		}
		try {
			const res = await api("/api/notes/trash");
			const items = Array.isArray(res && res.notes) ? res.notes : [];
			renderTrashManageList(items);
		} catch {
			if (trashManageEmpty && trashManageEmpty.classList) {
				trashManageEmpty.textContent =
					"Trash could not be loaded.";
				trashManageEmpty.classList.remove("hidden");
			}
		}
	}

	async function restoreTrashNote(noteId) {
		const safeId = String(noteId || "").trim();
		if (!safeId) return;
		try {
			await api(`/api/notes/${encodeURIComponent(safeId)}/restore`, {
				method: "POST",
			});
			toast("Notiz wiederhergestellt.", "success");
			await refreshPersonalSpace();
			await loadTrashManage();
		} catch {
			await loadTrashManage();
			await refreshPersonalSpace();
			toast("Wiederherstellen fehlgeschlagen.", "error");
		}
	}

	async function deleteUpload(name) {
		const safeName = String(name || "").trim();
		if (!safeName) return;
		if (!window.confirm(`Upload löschen?\n${safeName}`)) return;
		try {
			await api("/api/uploads/delete", {
				method: "DELETE",
				body: JSON.stringify({ name: safeName }),
			});
			toast("Upload gelöscht.", "success");
			loadUploadsManage();
		} catch {
			toast("Upload konnte nicht gelöscht werden.", "error");
		}
	}

	function updateFavoriteText(roomName, keyName, nextText) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const text = String(nextText || "").slice(0, 2000);
		const favs = dedupeFavorites(loadFavorites());
		const idx = favs.findIndex(
			(f) => f.room === nextRoom && f.key === nextKey
		);
		if (idx >= 0) {
			favs.splice(idx, 1, { ...favs[idx], text });
		} else {
			favs.push({ room: nextRoom, key: nextKey, addedAt: Date.now(), text });
		}
		saveFavorites(favs);
		updateFavoritesUI();
		if (psState && psState.authed) {
			api("/api/favorites", {
				method: "POST",
				body: JSON.stringify({
					room: nextRoom,
					key: nextKey,
					text,
				}),
			}).catch(() => {
				// ignore
			});
		}
	}

	function removeFavorite(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const favs = dedupeFavorites(loadFavorites()).filter(
			(f) => !(f.room === nextRoom && f.key === nextKey)
		);
		saveFavorites(favs);
		updateFavoritesUI();
		if (psState && psState.authed) {
			api("/api/favorites", {
				method: "DELETE",
				body: JSON.stringify({ room: nextRoom, key: nextKey }),
			}).catch(() => {
				// ignore
			});
		}
	}

	function setStartupFavorite(roomName, keyName) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const favs = dedupeFavorites(loadFavorites());
		const idx = favs.findIndex(
			(f) => f.room === nextRoom && f.key === nextKey
		);
		if (idx < 0) return;
		const currentIsStartup = favs[idx].isStartup;
		for (let i = 0; i < favs.length; i += 1) {
			favs[i].isStartup = i === idx ? !currentIsStartup : false;
		}
		saveFavorites(favs);
		updateFavoritesUI();
		if (psState && psState.authed) {
			api("/api/favorites", {
				method: "POST",
				body: JSON.stringify({
					room: nextRoom,
					key: nextKey,
					text: favs[idx].text,
					isStartup: favs[idx].isStartup,
				}),
			}).catch(() => {
				// ignore
			});
		}
	}

	function updateFavoriteButton() {
		if (!toggleFavoriteBtn) return;
		const active = findFavoriteIndex(room, key) >= 0;
		toggleFavoriteBtn.classList.toggle("border-fuchsia-400/40", active);
		toggleFavoriteBtn.classList.toggle("bg-fuchsia-500/15", active);
		toggleFavoriteBtn.classList.toggle("text-fuchsia-100", active);
	}

	function updateFavoritesUI() {
		renderFavorites();
		updateFavoriteButton();
		if (favoritesSelect) {
			const current = buildShareHash(room, key);
			const esc =
				window.CSS && typeof window.CSS.escape === "function"
					? window.CSS.escape(current)
					: current.replace(/"/g, '\\"');
			const has = favoritesSelect.querySelector(`option[value="${esc}"]`);
			favoritesSelect.value = has ? current : "";
		}
		renderFavoritesManager();
	}
	function loadRecentRooms() {
		try {
			const raw = localStorage.getItem(RECENT_KEY);
			const parsed = JSON.parse(raw || "[]");
			return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
		} catch {
			return [];
		}
	}
	function saveRecentRoom(roomName) {
		const cur = loadRecentRooms();
		const next = [roomName, ...cur.filter((r) => r !== roomName)].slice(0, 8);
		try {
			localStorage.setItem(RECENT_KEY, JSON.stringify(next));
		} catch {
			// ignore
		}
	}
	function renderRecentRooms() {
		const rooms = loadRecentRooms();
		roomOptions.innerHTML = rooms
			.map((r) => `<option value="${r}"></option>`)
			.join("");
	}

	const presenceState = new Map();
	let shareHref = "";
	function buildShareHref(roomName, keyName) {
		return (
			location.origin +
			location.pathname +
			location.search +
			buildShareHash(roomName, keyName)
		);
	}
	function updateShareLink() {
		shareHref = buildShareHref(room, key);
		if (shareLink) shareLink.href = shareHref;
		updateShareModalLink();
	}

	roomLabel.textContent = room;
	updateShareLink();
	roomInput.value = room;
	saveRecentRoom(room);
	renderRecentRooms();
	updateFavoritesUI();
	const initialTabs = loadRoomTabs();
	if (!initialTabs.length) {
		if (!autoSelectedRoom) {
			touchRoomTab(room, key, { skipSync: true });
		}
	}
	renderRoomTabs();

	function setStatus(kind, text) {
		if (statusText) statusText.textContent = text;
		statusDot.className = "h-2.5 w-2.5 rounded-full";
		if (kind === "online") statusDot.classList.add("bg-emerald-400");
		else if (kind === "connecting") statusDot.classList.add("bg-amber-400");
		else statusDot.classList.add("bg-slate-500");
	}

	function setHeaderCollapsed(collapsed) {
		headerDetailEls.forEach((el) => {
			el.classList.toggle("hidden", collapsed);
		});
		if (!toggleHeaderBtn) return;
		toggleHeaderBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
		const icon = toggleHeaderBtn.querySelector("[data-role=\"headerChevron\"]");
		if (icon) icon.classList.toggle("rotate-180", collapsed);
	}

	function wsDisplay(base) {
		try {
			const u = new URL(base, location.href);
			return `${u.protocol}//${u.host}${u.pathname}`;
		} catch {
			return String(base);
		}
	}

	function hashKeyForWs(rawKey) {
		const s = String(rawKey || "");
		if (!s) return "";
		let h1 = 0x811c9dc5;
		let h2 = 0x9e3779b9;
		for (let i = 0; i < s.length; i += 1) {
			const c = s.charCodeAt(i);
			h1 ^= c;
			h1 = (h1 * 0x01000193) >>> 0;
			h2 ^= c;
			h2 = (h2 + ((h2 << 6) + (h2 << 16) - h2)) >>> 0;
		}
		const part1 = h1.toString(36);
		const part2 = h2.toString(36);
		return `${part1}${part2}`.slice(0, 24);
	}

	function wsUrlForRoom(base, roomName) {
		// Key bleibt im Hash (Client-only), wird nicht an den Server gesendet.
		// Viele Relays verwenden Query-Parameter. Falls dein Relay anders ist,
		// setze ?ws=wss://... passend oder passe diese Funktion an.
		const url = new URL(base, location.href);
		url.searchParams.set("room", roomName);
		if (key) {
			url.searchParams.set("key", hashKeyForWs(key));
		} else {
			url.searchParams.delete("key");
		}
		url.searchParams.set("client", clientId);
		return url.toString();
	}

	let ws;
	let reconnectTimer;
	let lastLocalText = "";
	let lastAppliedRemoteTs = 0;
	let suppressSend = false;
	let sendTimer;
	let connectionSeq = 0;
	let isTyping = false;
	let typingTimer;
	let selectionTimer;
	let lastSelection = { start: 0, end: 0 };
	let ydoc;
	let ytext;
	let crdtSuppressSend = false;
	let crdtLastText = "";
	let crdtHasSnapshot = false;
	let crdtSnapshotTimer;
	let yjsLoadingPromise;
	let crdtReady = false;
	let pendingCrdtBootstrap = null;

	function isCrdtAvailable() {
		return typeof window.Y !== "undefined";
	}

	function isCrdtEnabled() {
		return crdtReady;
	}

	function isE2eeActive() {
		return Boolean(key);
	}

	function ensureYjsLoaded() {
		if (isCrdtAvailable()) return Promise.resolve(true);
		if (yjsLoadingPromise) return yjsLoadingPromise;
		yjsLoadingPromise = new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = `/vendor/yjs.bundle.js?v=${Date.now()}`;
			script.async = true;
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.head.appendChild(script);
		});
		return yjsLoadingPromise;
	}

	function nowIso() {
		return new Date().toLocaleString(getUiLocale(), {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	}

	function safeJsonParse(raw) {
		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	}

	function sanitizeLegacySnapshotText(rawText) {
		const text = String(rawText ?? "");
		const trimmed = text.trim();
		if (!trimmed) return text;
		const direct = safeJsonParse(trimmed);
		if (direct && typeof direct === "object" && typeof direct.text === "string") {
			return direct.text;
		}
		const idx = text.lastIndexOf('{"update"');
		if (idx <= 0) return text;
		const suffix = text.slice(idx).trim();
		const payload = safeJsonParse(suffix);
		if (!payload || typeof payload !== "object" || typeof payload.text !== "string") {
			return text;
		}
		if (text.startsWith(payload.text)) {
			const rest = text.slice(payload.text.length).trim();
			if (rest.startsWith('{"update"')) return payload.text;
		}
		return text;
	}

	function sendMessage(message) {
		if (!ws || ws.readyState !== WebSocket.OPEN) return;
		ws.send(JSON.stringify(message));
	}

	function sendCrdtUpdate(updateStr) {
		if (!updateStr) return;
		if (!isE2eeActive()) {
			sendMessage({ type: "doc_update", room, clientId, update: updateStr });
			return;
		}
		encryptForRoom(updateStr)
			.then((enc) => {
				if (!enc || enc.mode !== "e2ee") return;
				sendMessage({
					type: "doc_update",
					room,
					clientId,
					ciphertext: enc.ciphertext,
					iv: enc.iv,
					v: "e2ee-v1",
				});
			})
			.catch(() => {
				// ignore
			});
	}

	function sendCrdtSnapshot(updateStr, textSnapshot, ts) {
		const safeTs = typeof ts === "number" ? ts : Date.now();
		if (!isE2eeActive()) {
			sendMessage({
				type: "doc_snapshot",
				room,
				clientId,
				update: updateStr,
				text: textSnapshot,
				ts: safeTs,
			});
			return;
		}
		const payload = JSON.stringify({
			update: updateStr,
			text: textSnapshot,
			ts: safeTs,
		});
		encryptForRoom(payload)
			.then((enc) => {
				if (!enc || enc.mode !== "e2ee") return;
				sendMessage({
					type: "doc_snapshot",
					room,
					clientId,
					ciphertext: enc.ciphertext,
					iv: enc.iv,
					v: "e2ee-v1",
					ts: safeTs,
				});
			})
			.catch(() => {
				// ignore
			});
	}

	function updatePresenceUI() {
		if (!presenceSummary || !presenceList) return;
		const users = Array.from(presenceState.values());
		const count = users.length;
		const presenceKey = count === 1 ? "presence.one" : "presence.many";
		presenceSummary.textContent = formatUi(t(presenceKey), { count });

		if (typingIndicator) {
			const typingUsers = users.filter(
				(u) => u.typing && u.clientId !== clientId
			);
			if (typingUsers.length === 0) {
				typingIndicator.textContent = "";
				typingIndicator.classList.add("hidden");
			} else if (typingUsers.length === 1) {
				typingIndicator.textContent = formatUi(t("typing.one"), {
					name: typingUsers[0].name,
				});
				typingIndicator.classList.remove("hidden");
			} else {
				typingIndicator.textContent = formatUi(t("typing.many"), {
					count: typingUsers.length,
				});
				typingIndicator.classList.remove("hidden");
			}
		}

		presenceList.innerHTML = "";
		for (const user of users) {
			const chip = document.createElement("span");
			chip.className =
				"inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-200";
			const avatar = document.createElement("span");
			avatar.textContent = user.avatar || "🙂";
			avatar.style.filter = "drop-shadow(0 0 6px rgba(0,0,0,0.25))";
			const dot = document.createElement("span");
			dot.className = "inline-block h-2 w-2 rounded-full";
			dot.style.background = user.color || "#94a3b8";
			const label = document.createElement("span");
			label.textContent =
				user.clientId === clientId ? `${user.name} (du)` : user.name;
			chip.appendChild(avatar);
			chip.appendChild(dot);
			chip.appendChild(label);
			if (user.selection && typeof user.selection.start === "number") {
				const sel = document.createElement("span");
				const len = Math.max(0, user.selection.end - user.selection.start);
				sel.className = "text-[10px] text-slate-400";
				sel.textContent = len > 0 ? `• Sel ${len}` : "• Cursor";
				chip.appendChild(sel);
			}
			if (user.typing) {
				const typing = document.createElement("span");
				typing.className = "text-[10px] text-fuchsia-300";
				typing.textContent = "• tippt";
				chip.appendChild(typing);
			}
			presenceList.appendChild(chip);
		}
		updateAttributionOverlay();
		updateCursorOverlay();
	}

	let tabTooltipLayer = null;
	let tabTooltipBox = null;
	let tabTooltipArrow = null;

	function ensureTabTooltipLayer() {
		if (tabTooltipLayer) return;
		const layer = document.createElement("div");
		layer.className = "tab-tooltip-layer";
		const box = document.createElement("div");
		box.className = "tab-tooltip-layer__box";
		const arrow = document.createElement("div");
		arrow.className = "tab-tooltip-layer__arrow";
		layer.appendChild(box);
		layer.appendChild(arrow);
		document.body.appendChild(layer);
		tabTooltipLayer = layer;
		tabTooltipBox = box;
		tabTooltipArrow = arrow;
	}

	function hideTabTooltip() {
		if (!tabTooltipLayer) return;
		tabTooltipLayer.classList.remove("is-visible");
	}

	function showTabTooltip(target) {
		const text = String(target && target.getAttribute("data-tooltip") || "");
		if (!text) return;
		ensureTabTooltipLayer();
		if (!tabTooltipLayer || !tabTooltipBox) return;
		tabTooltipBox.textContent = text;
		const rect = target.getBoundingClientRect();
		const left = rect.left + rect.width / 2;
		tabTooltipLayer.style.left = `${left}px`;
		tabTooltipLayer.style.top = "0px";
		requestAnimationFrame(() => {
			if (!tabTooltipLayer || !tabTooltipBox) return;
			const height = tabTooltipBox.offsetHeight || 0;
			const top = rect.top - height - 10;
			tabTooltipLayer.style.top = `${top}px`;
			tabTooltipLayer.classList.add("is-visible");
		});
	}

	function upsertPresence(user) {
		if (!user || !user.clientId) return;
		presenceState.set(user.clientId, user);
		updatePresenceUI();
	}

	function applyPresenceUpdate(update) {
		if (!update || !update.clientId) return;
		const current = presenceState.get(update.clientId);
		if (!current) return;
		presenceState.set(update.clientId, { ...current, ...update });
		updatePresenceUI();
	}

	function getAuthorMeta(authorId) {
		if (!authorId) return { name: "User", color: "#64748b" };
		const user = presenceState.get(authorId);
		if (user) return user;
		return { name: "User", color: "#64748b" };
	}

	function parseHexColor(input) {
		const raw = String(input || "").trim();
		if (!raw) return null;
		const hex = raw.startsWith("#") ? raw.slice(1) : raw;
		if (hex.length === 3) {
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			if ([r, g, b].some((v) => Number.isNaN(v))) return null;
			return { r, g, b };
		}
		if (hex.length === 6) {
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			if ([r, g, b].some((v) => Number.isNaN(v))) return null;
			return { r, g, b };
		}
		return null;
	}

	function colorToRgba(color, alpha) {
		const parsed = parseHexColor(color);
		if (!parsed) return `rgba(148, 163, 184, ${alpha})`;
		return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha})`;
	}

	function ensureCursorOverlayLayer() {
		if (cursorOverlay || !textarea) return;
		const parent = textarea.parentElement;
		if (!parent) return;
		const layer = document.createElement("div");
		layer.id = "cursorOverlay";
		layer.className =
			"pointer-events-none absolute inset-0 hidden overflow-hidden rounded-xl px-4 pt-20 pb-12 pr-11 font-sans text-base leading-relaxed text-slate-100";
		const content = document.createElement("div");
		content.id = "cursorOverlayContent";
		layer.appendChild(content);
		parent.appendChild(layer);
		cursorOverlay = layer;
		cursorOverlayContent = content;
	}

	function syncAttributionOverlayScroll() {
		if (!attributionOverlayContent || !textarea) return;
		const x = Number(textarea.scrollLeft || 0);
		const y = Number(textarea.scrollTop || 0);
		attributionOverlayContent.style.transform = `translate(${-x}px, ${-y}px)`;
	}

	function syncCursorOverlayScroll() {
		if (!cursorOverlayContent || !textarea) return;
		const x = Number(textarea.scrollLeft || 0);
		const y = Number(textarea.scrollTop || 0);
		cursorOverlayContent.style.transform = `translate(${-x}px, ${-y}px)`;
	}

	function buildAttributionHtml() {
		if (!ytext) return "";
		const delta = ytext.toDelta();
		const underlineMode = crdtMarksStyle === "underline";
		let out = "";
		for (const op of delta) {
			if (typeof op.insert !== "string") continue;
			const text = op.insert;
			const authorId = op.attributes ? op.attributes.author : "";
			if (!authorId) {
				out += escapeHtml(text);
				continue;
			}
			const meta = getAuthorMeta(String(authorId));
			const bg = colorToRgba(meta.color, 0.34);
			const border = colorToRgba(meta.color, 0.7);
			const style = underlineMode
				? `text-decoration:underline;text-decoration-color:${border};text-decoration-thickness:2px;text-underline-offset:0.18em;`
				: `background-color:${bg};box-shadow:inset 0 0 0 1px ${border};`;
			const cls = underlineMode ? "author-span author-underline" : "author-span";
			out += `<span class="${cls}" style="${style}">${escapeHtml(
				text
			)}</span>`;
		}
		return out;
	}

	function updateAttributionOverlay() {
		if (!attributionOverlay || !attributionOverlayContent) return;
		const underlineMode = crdtMarksStyle === "underline";
		if (!crdtMarksEnabled) {
			attributionOverlay.classList.add("hidden");
			attributionOverlay.classList.remove("is-underline");
			attributionOverlayContent.textContent = "";
			if (textarea && textarea.classList) {
				textarea.classList.remove("attribution-active");
				textarea.classList.remove("attribution-underline");
			}
			return;
		}
		if (!crdtReady || !ytext || presenceState.size <= 1) {
			attributionOverlay.classList.add("hidden");
			attributionOverlay.classList.remove("is-underline");
			attributionOverlayContent.textContent = "";
			if (textarea && textarea.classList) {
				textarea.classList.remove("attribution-active");
				textarea.classList.remove("attribution-underline");
			}
			return;
		}
		const html = buildAttributionHtml();
		if (!html) {
			attributionOverlay.classList.add("hidden");
			attributionOverlay.classList.remove("is-underline");
			attributionOverlayContent.textContent = "";
			if (textarea && textarea.classList) {
				textarea.classList.remove("attribution-active");
				textarea.classList.remove("attribution-underline");
			}
			return;
		}
		attributionOverlayContent.innerHTML = html;
		attributionOverlay.classList.remove("hidden");
		attributionOverlay.classList.toggle("is-underline", underlineMode);
		syncAttributionOverlayScroll();
		if (textarea && textarea.classList) {
			textarea.classList.toggle("attribution-active", !underlineMode);
			textarea.classList.toggle("attribution-underline", underlineMode);
		}
		updateCursorOverlay();
	}

	function updateCursorOverlay() {
		ensureCursorOverlayLayer();
		if (!cursorOverlay || !cursorOverlayContent || !textarea) return;
		const users = Array.from(presenceState.values()).filter((user) => {
			if (!user || user.clientId === clientId) return false;
			return (
				user.selection && Number.isFinite(user.selection.start)
			);
		});
		if (users.length === 0) {
			cursorOverlay.classList.add("hidden");
			cursorOverlayContent.textContent = "";
			return;
		}
		const style = window.getComputedStyle(textarea);
		const padLeft = parseFloat(style.paddingLeft) || 0;
		const padTop = parseFloat(style.paddingTop) || 0;
		cursorOverlayContent.innerHTML = "";
		cursorOverlay.classList.remove("hidden");
		for (const user of users) {
			const selection = user.selection || {};
			const caretPos = Number.isFinite(selection.end)
				? selection.end
				: selection.start;
			const coords = getTextareaCaretCoords(textarea, caretPos);
			const caret = document.createElement("div");
			caret.className = "remote-caret";
			caret.style.left = `${coords.left - padLeft}px`;
			caret.style.top = `${coords.top - padTop}px`;
			caret.style.height = `${Math.max(12, coords.height || 16)}px`;
			const color = user.color || "#94a3b8";
			caret.style.borderColor = color;
			caret.style.backgroundColor = colorToRgba(color, 0.35);
			const label = document.createElement("div");
			label.className = "remote-caret-label";
			label.textContent = user.name || "User";
			label.style.backgroundColor = colorToRgba(color, 0.92);
			label.style.borderColor = colorToRgba(color, 1);
			caret.appendChild(label);
			cursorOverlayContent.appendChild(caret);
		}
		syncCursorOverlayScroll();
	}

	function applyPendingCrdtBootstrap() {
		if (!pendingCrdtBootstrap || !crdtReady) return;
		const payload = pendingCrdtBootstrap;
		pendingCrdtBootstrap = null;
		if (payload.update) {
			applyCrdtUpdate(payload.update);
			return;
		}
		if (typeof payload.text === "string") {
			setCrdtText(payload.text);
		}
	}

	function setTyping(active) {
		const next = Boolean(active);
		if (next === isTyping) return;
		isTyping = next;
		applyPresenceUpdate({ clientId, typing: isTyping });
		sendMessage({ type: "typing", room, clientId, typing: isTyping });
	}

	function scheduleTypingStop() {
		window.clearTimeout(typingTimer);
		typingTimer = window.setTimeout(() => setTyping(false), 1200);
	}

	function scheduleSelectionSend() {
		window.clearTimeout(selectionTimer);
		selectionTimer = window.setTimeout(() => {
			if (!textarea) return;
			const start = Number(textarea.selectionStart || 0);
			const end = Number(textarea.selectionEnd || 0);
			if (start === lastSelection.start && end === lastSelection.end) return;
			lastSelection = { start, end };
			applyPresenceUpdate({ clientId, selection: { start, end } });
			sendMessage({ type: "cursor", room, clientId, start, end });
		}, 120);
	}

	function applySyncedText(text, label, lastUsedTs) {
		// Block CRDT text overwrites while offline ops are being replayed
		if (offlineSyncInFlight) return;
		suppressSend = true;
		const cleaned = sanitizeLegacySnapshotText(text);
		textarea.value = String(cleaned ?? "");
		lastLocalText = textarea.value;
		suppressSend = false;

		metaLeft.textContent = label || "Synced.";
		metaRight.textContent = nowIso();
		const noteId = getRoomTabNoteIdForRoom(room, key);
		updateRoomTabTextLocal(room, key, cleaned);
		if (noteId) {
			updateLocalNoteText(noteId, cleaned);
			schedulePsListRerender();
		}
		const previewHtml = buildPreviewContentHtml(text);
		const didUpdate = previewHtml && sendPreviewContentUpdate(previewHtml);
		if (!didUpdate) updatePreview();
		scheduleRoomTabSync({
			room,
			key,
			text: resolveRoomTabSnapshotText(noteId, String(cleaned ?? "")),
			lastUsed:
				typeof lastUsedTs === "number" ? lastUsedTs : Date.now(),
		});
		if (noteId && psEditingNoteId && noteId === String(psEditingNoteId || "").trim()) {
			// CRDT-synced text is already persisted via room state — update
			// the auto-save tracker so the next real user edit can diff correctly,
			// but do NOT trigger an auto-save (avoids 409 duplicate conflicts).
			psAutoSaveLastSavedNoteId = psEditingNoteId;
			psAutoSaveLastSavedText = String(cleaned ?? "");
		}
	}

	function initCrdt() {
		if (!isCrdtAvailable() || !textarea) return false;
		if (!window.Y) return false;
		const { Doc } = window.Y;
		ydoc = new Doc();
		ytext = ydoc.getText("mirror");
		crdtLastText = ytext.toString();
		crdtHasSnapshot = false;
		ytext.observe(() => {
			const next = ytext.toString();
			if (next === textarea.value) return;
			applySyncedText(next, "Synced (CRDT)." );
			crdtLastText = next;
			updateAttributionOverlay();
		});
		ydoc.on("update", (update) => {
			if (crdtSuppressSend) return;
			const encoded = base64EncodeBytes(update);
			sendCrdtUpdate(encoded);
			scheduleCrdtSnapshot();
		});
		updateAttributionOverlay();
		if (crdtStatus) {
			crdtStatus.textContent = "CRDT aktiv";
			crdtStatus.classList.remove("hidden");
		}
		crdtReady = true;
		applyPendingCrdtBootstrap();
		return true;
	}

	function destroyCrdt() {
		if (ydoc) {
			try {
				ydoc.destroy();
			} catch {
				// ignore
			}
		}
		ydoc = null;
		ytext = null;
		crdtLastText = "";
		crdtHasSnapshot = false;
		window.clearTimeout(crdtSnapshotTimer);
		updateAttributionOverlay();
		if (crdtStatus) {
			crdtStatus.textContent = "";
			crdtStatus.classList.add("hidden");
		}
		crdtReady = false;
	}

	function applyCrdtUpdate(encoded) {
		if (!ydoc || !encoded) return;
		try {
			const update = base64DecodeBytes(encoded);
			crdtSuppressSend = true;
			window.Y.applyUpdate(ydoc, update);
			crdtSuppressSend = false;
			crdtHasSnapshot = true;
			crdtReady = true;
			updateAttributionOverlay();
		} catch {
			// ignore
		}
	}

	function setCrdtText(nextText) {
		if (!ydoc || !ytext) return;
		const cleanedText = sanitizeLegacySnapshotText(nextText);
		const current = ytext.toString();
		if (current === cleanedText) return;
		crdtSuppressSend = true;
		try {
			ydoc.transact(() => {
				ytext.delete(0, ytext.length);
				ytext.insert(0, String(cleanedText ?? ""));
			});
		} finally {
			crdtSuppressSend = false;
		}
		crdtLastText = ytext.toString();
		crdtHasSnapshot = true;
		crdtReady = true;
		applySyncedText(crdtLastText, "Synced (CRDT)." );
		updateAttributionOverlay();
		scheduleCrdtSnapshot();
	}

	function updateCrdtFromTextarea() {
		// CRDT is conflict-free – always allow local edits to propagate,
		// even when a permalink pin exists and the guest has no matching PS note.
		if (!ytext || !crdtReady) return;
		const current = ytext.toString();
		if (crdtLastText !== current) {
			crdtLastText = current;
		}
		const next = String(textarea.value || "");
		if (next === crdtLastText) return;
		const prev = crdtLastText;
		let start = 0;
		while (
			start < prev.length &&
			start < next.length &&
			prev[start] === next[start]
		) {
			start += 1;
		}
		let endPrev = prev.length - 1;
		let endNext = next.length - 1;
		while (
			endPrev >= start &&
			endNext >= start &&
			prev[endPrev] === next[endNext]
		) {
			endPrev -= 1;
			endNext -= 1;
		}
		const removeLen = endPrev >= start ? endPrev - start + 1 : 0;
		const insertText = endNext >= start ? next.slice(start, endNext + 1) : "";
		crdtSuppressSend = false;
		ydoc.transact(() => {
			if (removeLen > 0) ytext.delete(start, removeLen);
			if (insertText) ytext.insert(start, insertText, { author: clientId });
		});
		crdtLastText = next;
		updateAttributionOverlay();
	}

	function scheduleCrdtSnapshot() {
		window.clearTimeout(crdtSnapshotTimer);
		crdtSnapshotTimer = window.setTimeout(() => {
			if (!ydoc) return;
			try {
				const update = window.Y.encodeStateAsUpdate(ydoc);
				const text = ytext ? ytext.toString() : "";
				sendCrdtSnapshot(base64EncodeBytes(update), text, Date.now());
			} catch {
				// ignore
			}
		}, 1200);
	}

	async function buildSetMessage(text, ts) {
		const enc = await encryptForRoom(text);
		if (enc && enc.mode === "e2ee") {
			return {
				type: "set",
				room,
				ciphertext: enc.ciphertext,
				iv: enc.iv,
				ts,
				clientId,
				v: "e2ee-v1",
			};
		}
		return { type: "set", room, text, ts, clientId };
	}

	function sendCurrentState() {
		const text = textarea.value;
		const ts = Date.now();
		buildSetMessage(text, ts)
			.then((payload) => {
				sendMessage(payload);
			})
			.catch(() => {
				metaLeft.textContent = "Verschlüsselung fehlgeschlagen.";
			});
	}

	function scheduleSend() {
		if (isCrdtEnabled()) return;
		if (suppressSend) return;
		if (!shouldSyncRoomContentNow()) return;
		window.clearTimeout(sendTimer);
		sendTimer = window.setTimeout(() => {
			const text = textarea.value;
			if (text === lastLocalText) return;
			const ts = Date.now();
			buildSetMessage(text, ts)
				.then((payload) => {
					sendMessage(payload);
					lastLocalText = text;
					metaLeft.textContent = "Gesendet.";
					metaRight.textContent = nowIso();
				})
				.catch(() => {
					metaLeft.textContent = "Verschlüsselung fehlgeschlagen.";
				});
		}, 180);
	}

	function applyRemoteText(text, ts) {
		if (typeof ts !== "number" || ts < lastAppliedRemoteTs) return;
		const boundNoteId = getRoomTabNoteIdForRoom(room, key);
		if (boundNoteId) {
			const boundNote = findNoteById(boundNoteId);
			const noteUpdatedAt = Number(boundNote && boundNote.updatedAt);
			if (Number.isFinite(noteUpdatedAt) && ts <= noteUpdatedAt) return;
		}
		lastAppliedRemoteTs = ts;
		applySyncedText(text, "Synced.", ts);
	}

	function connect() {
		const mySeq = ++connectionSeq;
		window.clearTimeout(reconnectTimer);
		clientId = createClientId();
		announceClientId();
		if (ws) {
			try {
				ws.close();
			} catch {
				// ignore
			}
		}

		destroyCrdt();
		presenceState.clear();
		availabilityByClient.clear();
		upsertPresence({
			clientId,
			name: identity.name,
			avatar: identity.avatar,
			color: identity.color,
			typing: false,
			selection: lastSelection,
		});

		setStatus("connecting", "Connecting…");
		if (debug) {
			wsHint.classList.remove("hidden");
			wsHint.textContent = wsDisplay(wsBaseUrl);
		} else {
			wsHint.classList.add("hidden");
			wsHint.textContent = "";
		}
		const url = wsUrlForRoom(wsBaseUrl, room);
		ws = new WebSocket(url);

		ws.addEventListener("open", () => {
			if (mySeq !== connectionSeq) return;
			setStatus("online", "Online");
			metaLeft.textContent = "Online. Waiting for updates…";
			// Replay any offline-queued operations
			void replayOfflineOps();
			const mode = isCrdtAvailable() ? "crdt" : "lww";
			sendMessage({
				type: "hello",
				room,
				clientId,
				mode,
				name: identity.name,
				color: identity.color,
				avatar: identity.avatar,
				ts: Date.now(),
			});
			const currentExcalNote = getExcalidrawNoteId();
			if (currentExcalNote) sendExcalidrawStateForNote(currentExcalNote);
			if (currentExcalNote) {
				const scene = getExcalidrawSceneForNote(currentExcalNote);
				if (scene) {
					pendingExcalidrawScene = { noteId: currentExcalNote, scene };
					scheduleSendExcalidrawScene();
				}
			}
			const currentExcelNote = getExcelNoteId();
			if (currentExcelNote) sendExcelStateForNote(currentExcelNote);
			const currentLinearNote = getLinearNoteId();
			if (currentLinearNote) sendLinearStateForNote(currentLinearNote);
			if (currentLinearNote && linearDataByNote.has(currentLinearNote)) {
				sendLinearDataForNote(currentLinearNote);
			}
			void loadCommentsForRoom();
			// Broadcast availability if sharing is enabled
			if (commonFreeSlotsSharing) {
				setTimeout(() => broadcastAvailability(), 500);
			}
			ensureYjsLoaded().then((ok) => {
				if (mySeq !== connectionSeq) return;
				if (!ok) {
					metaLeft.textContent = "CRDT nicht verfügbar.";
					if (crdtStatus) {
						crdtStatus.textContent = "CRDT nicht verfügbar";
						crdtStatus.classList.remove("hidden");
					}
					sendMessage({
						type: "request_state",
						room,
						clientId,
						ts: Date.now(),
					});
					return;
				}
				const started = initCrdt();
				if (!started) {
					metaLeft.textContent = "CRDT nicht verfügbar.";
					if (crdtStatus) {
						crdtStatus.textContent = "CRDT nicht verfügbar";
						crdtStatus.classList.remove("hidden");
					}
					sendMessage({
						type: "request_state",
						room,
						clientId,
						ts: Date.now(),
					});
					return;
				}
				sendMessage({
					type: "doc_request",
					room,
					clientId,
					ts: Date.now(),
				});
				scheduleCrdtSnapshot();
			});
		});

		ws.addEventListener("message", (ev) => {
			if (mySeq !== connectionSeq) return;
			const msg = safeJsonParse(ev.data);
			if (!msg || msg.room !== room) return;
			if (msg.clientId === clientId) return;

			if (msg.type === "presence_state") {
				presenceState.clear();
				const list = Array.isArray(msg.users) ? msg.users : [];
				for (const user of list) {
					if (!user || !user.clientId) continue;
					presenceState.set(user.clientId, {
						clientId: String(user.clientId || ""),
						name: String(user.name || "Guest"),
						avatar: String(user.avatar || "🙂"),
						color: String(user.color || "#94a3b8"),
						typing: Boolean(user.typing),
						selection: user.selection || null,
					});
				}
				updatePresenceUI();
				// When other users are present (excluding self), mark as shared
				// so comment scope and app state resolve to room scope
				const othersPresent = Array.from(presenceState.keys()).some(
					(id) => id !== clientId
				);
				if (othersPresent) {
					const roomName = normalizeRoom(room);
					const keyName = normalizeKey(key);
					if (roomName && !isRoomMarkedShared(roomName, keyName)) {
						markRoomShared(roomName, keyName);
						void loadCommentsForRoom();
					}
				}
				return;
			}

			if (msg.type === "presence_update") {
				applyPresenceUpdate(msg);
				return;
			}

			if (msg.type === "excalidraw_state") {
				if (msg.clientId && msg.clientId === clientId) return;
				const items = Array.isArray(msg.items) ? msg.items : [];
				const activeId = getExcalidrawNoteId();
				const pinned = getRoomPinnedEntry(room, key);
				const pinnedNoteId = pinned && pinned.noteId ? String(pinned.noteId || "") : "";
				const pinnedScope = pinned ? getExcalidrawRoomScope() : "";
				for (const it of items) {
					const rawNoteId = String(it && it.noteId ? it.noteId : "").trim();
					const noteId =
						pinnedNoteId && rawNoteId === pinnedNoteId && pinnedScope
							? pinnedScope
							: rawNoteId;
					if (!noteId) continue;
					const visible = Boolean(it && it.visible);
					const offset = {
						x: Number(it && it.offset && it.offset.x) || 0,
						y: Number(it && it.offset && it.offset.y) || 0,
					};
					excalidrawVisibleByNote.set(noteId, visible);
					excalidrawOffsetByNote.set(noteId, offset);
					if (noteId === activeId) {
						applyExcalidrawOffset(offset);
						setExcalidrawVisible(visible, { remember: false });
					}
				}
				return;
			}

			if (msg.type === "excel_state") {
				if (msg.clientId && msg.clientId === clientId) return;
				const items = Array.isArray(msg.items) ? msg.items : [];
				const activeId = getExcelNoteId();
				const pinned = getRoomPinnedEntry(room, key);
				const pinnedNoteId = pinned && pinned.noteId ? String(pinned.noteId || "") : "";
				const pinnedScope = pinned ? getExcelRoomScope() : "";
				for (const it of items) {
					const rawNoteId = String(it && it.noteId ? it.noteId : "").trim();
					const noteId =
						pinnedNoteId && rawNoteId === pinnedNoteId && pinnedScope
							? pinnedScope
							: rawNoteId;
					if (!noteId) continue;
					const visible = Boolean(it && it.visible);
					const offset = {
						x: Number(it && it.offset && it.offset.x) || 0,
						y: Number(it && it.offset && it.offset.y) || 0,
					};
					excelVisibleByNote.set(noteId, visible);
					excelOffsetByNote.set(noteId, offset);
					if (noteId === activeId) {
						applyExcelOffset(offset);
						setExcelVisible(visible, { remember: false });
					}
				}
				return;
			}

			if (msg.type === "linear_state") {
				if (msg.clientId && msg.clientId === clientId) return;
				const items = Array.isArray(msg.items) ? msg.items : [];
				const activeId = getLinearNoteId();
				const pinned = getRoomPinnedEntry(room, key);
				const pinnedNoteId = pinned && pinned.noteId ? String(pinned.noteId || "") : "";
				const pinnedScope = pinned ? getLinearRoomScope() : "";
				for (const it of items) {
					const rawNoteId = String(it && it.noteId ? it.noteId : "").trim();
					const noteId =
						pinnedNoteId && rawNoteId === pinnedNoteId && pinnedScope
							? pinnedScope
							: rawNoteId;
					if (!noteId) continue;
					const visible = Boolean(it && it.visible);
					const projectId = String(it && it.projectId ? it.projectId : "");
					const projectName = String(it && it.projectName ? it.projectName : "");
					const offset = {
						x: Number(it && it.offset && it.offset.x) || 0,
						y: Number(it && it.offset && it.offset.y) || 0,
					};
					linearVisibleByNote.set(noteId, visible);
					linearOffsetByNote.set(noteId, offset);
					if (projectId) {
						linearProjectByNote.set(noteId, {
							projectId,
							projectName,
						});
					}
					if (noteId === activeId) {
						applyLinearOffset(offset);
						setLinearVisible(visible, { remember: false });
						updateLinearProjectSelectOptions(activeId);
						renderLinearTasks(activeId);
					}
				}
				return;
			}

			if (msg.type === "linear_data") {
				if (msg.clientId && msg.clientId === clientId) return;
				const items = Array.isArray(msg.items) ? msg.items : [];
				const activeId = getLinearNoteId();
				const pinned = getRoomPinnedEntry(room, key);
				const pinnedNoteId = pinned && pinned.noteId ? String(pinned.noteId || "") : "";
				const pinnedScope = pinned ? getLinearRoomScope() : "";
				for (const it of items) {
					const rawNoteId = String(it && it.noteId ? it.noteId : "").trim();
					const noteId =
						pinnedNoteId && rawNoteId === pinnedNoteId && pinnedScope
							? pinnedScope
							: rawNoteId;
					if (!noteId) continue;
					const payload = {
						projectId: String(it && it.projectId ? it.projectId : ""),
						projectName: String(it && it.projectName ? it.projectName : ""),
						updatedAt: Number(it && it.updatedAt ? it.updatedAt : 0) || Date.now(),
						tasks: Array.isArray(it && it.tasks) ? it.tasks : [],
					};
					linearDataByNote.set(noteId, payload);
					if (noteId === activeId) {
						renderLinearTasks(activeId);
					}
				}
				return;
			}

			if (msg.type === "availability_state") {
				handleAvailabilityState(msg);
				return;
			}

			if (msg.type === "availability_leave") {
				handleAvailabilityLeave(msg.leftClientId || msg.clientId);
				return;
			}

			if (msg.type === "room_pin_state") {
				if (msg.clientId && msg.clientId === clientId) return;
				const roomName = normalizeRoom(room);
				if (!roomName) return;
				const keyName = normalizeKey(key);
				const noteId = String(msg && msg.noteId ? msg.noteId : "").trim();
				const textVal = noteId ? "" : String(msg && msg.text ? msg.text : "");
				const updatedAt = Number(msg && msg.updatedAt) || Date.now();
				if (!noteId && !textVal) {
					clearSharedRoomPinnedEntry(roomName, keyName);
				} else {
					setSharedRoomPinnedEntry(roomName, keyName, {
						noteId,
						text: textVal,
						updatedAt,
					});
				}
				// Always mark room as shared when we receive pin state (even empty)
				// so comment scope and guest features work for all participants
				if (msg.shared || noteId || textVal) {
					markRoomShared(roomName, keyName);
				}
				syncPermanentLinkToggleUi();
				// Use noteId from pin message, not local psEditingNoteId,
				// so guests resolve the correct room scope for apps
				syncExcalidrawForNote(noteId || "");
				syncExcelForNote(noteId || "");
				syncLinearForNote(noteId || "");
				void loadCommentsForRoom();
				return;
			}

			if (msg.type === "excalidraw_scene") {
				if (msg.clientId && msg.clientId === clientId) return;
				const items = Array.isArray(msg.items) ? msg.items : [];
				const activeId = getExcalidrawNoteId();
				const pinned = getRoomPinnedEntry(room, key);
				const pinnedNoteId = pinned && pinned.noteId ? String(pinned.noteId || "") : "";
				const pinnedScope = pinned ? getExcalidrawRoomScope() : "";
				for (const it of items) {
					const rawNoteId = String(it && it.noteId ? it.noteId : "").trim();
					const noteId =
						pinnedNoteId && rawNoteId === pinnedNoteId && pinnedScope
							? pinnedScope
							: rawNoteId;
					const scene = typeof it === "object" && typeof it.scene === "string" ? it.scene : "";
					if (!noteId || !scene) continue;
					if (scene.length > EXCALIDRAW_SCENE_MAX_BYTES) continue;
					excalidrawSceneByNote.set(noteId, scene);
					if (noteId === activeId) {
						sendExcalidrawSceneToEmbed(noteId, scene);
					}
				}
				return;
			}

			if (msg.type === "comment_update") {
				if (msg.clientId && msg.clientId === clientId) return;
				const scopeId = String(msg.scopeId || "").trim();
				if (!scopeId || scopeId !== getCommentScopeId()) return;
				commentItems = normalizeCommentItems(
					Array.isArray(msg.comments) ? msg.comments : []
				);
				if (scopeId.startsWith("note:")) {
					const noteId = scopeId.slice(5);
					if (noteId) {
						if (commentItems.length > 0) psCommentedNoteIds.add(noteId);
						else psCommentedNoteIds.delete(noteId);
					}
				} else if (scopeId.startsWith("room:")) {
					const editNoteId = String(psEditingNoteId || "").trim();
					if (editNoteId) {
						if (commentItems.length > 0) psCommentedNoteIds.add(editNoteId);
						else psCommentedNoteIds.delete(editNoteId);
					}
				}
				const hasCommentFilter = psCommentsOnly || String(psSearchQuery || "").toLowerCase().includes("has:comment");
				if (hasCommentFilter) applyPersonalSpaceFiltersAndRender();
				commentActiveNoteId = scopeId;
				renderCommentList();
				updateCommentOverlay();
				return;
			}

			if (msg.type === "doc_update") {
				if (!isCrdtEnabled()) return;
				if (msg.update) {
					applyCrdtUpdate(msg.update);
					return;
				}
				if (msg.ciphertext && msg.iv) {
					decryptForRoom(msg.ciphertext, msg.iv)
						.then((plain) => {
							if (typeof plain !== "string") return;
							applyCrdtUpdate(plain);
						})
						.catch(() => {
							// ignore
						});
				}
				return;
			}

			if (msg.type === "doc_snapshot") {
				if (!isCrdtEnabled()) return;
				if (msg.ciphertext && msg.iv) {
					decryptForRoom(msg.ciphertext, msg.iv)
						.then((plain) => {
							if (typeof plain !== "string") return;
							const payload = safeJsonParse(plain);
							if (!payload || typeof payload !== "object") return;
							if (payload.update) applyCrdtUpdate(payload.update);
							if (!payload.update && typeof payload.text === "string") {
								setCrdtText(payload.text);
							}
						})
						.catch(() => {
							// ignore
						});
				} else {
					if (msg.update) {
						applyCrdtUpdate(msg.update);
					}
					if (!msg.update && typeof msg.text === "string") {
						setCrdtText(msg.text);
					}
				}
				crdtHasSnapshot = true;
				return;
			}

			if (msg.type === "set") {
				if (isCrdtEnabled()) {
					if (msg.ciphertext && msg.iv) {
						decryptForRoom(msg.ciphertext, msg.iv)
							.then((plain) => {
								if (typeof plain !== "string") return;
								const payload = safeJsonParse(plain);
								if (payload && typeof payload === "object") {
									if (payload.update) applyCrdtUpdate(payload.update);
									if (!payload.update && typeof payload.text === "string") {
										setCrdtText(payload.text);
									}
									return;
								}
								if (!crdtHasSnapshot) setCrdtText(plain);
							})
							.catch(() => {
								// ignore
							});
						return;
					}
					if (!crdtHasSnapshot && typeof msg.text === "string") {
						setCrdtText(msg.text);
					}
					return;
				}
				if (isCrdtAvailable()) {
					if (msg.ciphertext && msg.iv) {
						decryptForRoom(msg.ciphertext, msg.iv)
							.then((plain) => {
								if (typeof plain !== "string") return;
								const payload = safeJsonParse(plain);
								if (payload && typeof payload === "object") {
									pendingCrdtBootstrap = payload;
									return;
								}
								applyRemoteText(plain, msg.ts);
							})
							.catch(() => {
								// ignore
							});
						return;
					}
					if (typeof msg.text === "string") {
						const payload = safeJsonParse(msg.text);
						if (payload && typeof payload === "object") {
							pendingCrdtBootstrap = payload;
							return;
						}
					}
				}
				if (msg.ciphertext && msg.iv) {
					decryptForRoom(msg.ciphertext, msg.iv)
						.then((plain) => {
							if (typeof plain !== "string") return;
							applyRemoteText(plain, msg.ts);
						})
						.catch(() => {
							toast("Entschlüsselung fehlgeschlagen.", "error");
						});
				} else {
					applyRemoteText(msg.text, msg.ts);
				}
			}

			if (msg.type === "request_state") {
				// Zustand an neue Teilnehmer schicken
				if (isCrdtEnabled() && ytext) {
					scheduleCrdtSnapshot();
				} else {
					sendCurrentState();
				}
				const activeExcal = getExcalidrawNoteId();
				if (activeExcal) sendExcalidrawStateForNote(activeExcal);
				const activeExcel = getExcelNoteId();
				if (activeExcel) sendExcelStateForNote(activeExcel);
				const activeLinear = getLinearNoteId();
				if (activeLinear) {
					sendLinearStateForNote(activeLinear);
					if (linearDataByNote.has(activeLinear)) {
						sendLinearDataForNote(activeLinear);
					}
				}
			}
		});

		ws.addEventListener("close", () => {
			if (mySeq !== connectionSeq) return;
			setStatus("offline", "Offline — reconnecting…");
			metaLeft.textContent = "Connection lost. Check server/network.";
			presenceState.clear();
			updatePresenceUI();
			reconnectTimer = window.setTimeout(connect, 900);
		});

		ws.addEventListener("error", () => {
			if (mySeq !== connectionSeq) return;
			setStatus("offline", "WebSocket unreachable");
			metaLeft.textContent =
				"No connection. Is the server running (npm start)?";
		});
	}

	function goToRoom(roomName) {
		const next = normalizeRoom(roomName);
		if (!next) return;
		forcePreviewTaskAutoSortNow();
		setCalendarPanelActive(false);
		flushRoomTabSync();
		location.hash = buildShareHash(next, key);
	}

	function goToRoomWithKey(roomName, keyName) {
		const next = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!next) return;
		forcePreviewTaskAutoSortNow();
		setCalendarPanelActive(false);
		flushRoomTabSync();
		location.hash = buildShareHash(next, nextKey);
	}

	joinRoomBtn.addEventListener("click", () => {
		goToRoom(roomInput.value);
	});
	roomInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			goToRoom(roomInput.value);
		}
	});
	newRoomBtn.addEventListener("click", () => {
		const nextRoom = randomRoom();
		const nextKey = randomKey();
		forcePreviewTaskAutoSortNow();
		flushRoomTabSync();
		location.hash = buildShareHash(nextRoom, nextKey);
	});

	if (roomTabs) {
		roomTabs.addEventListener("click", (ev) => {
			const target = ev && ev.target ? ev.target : null;
			if (!(target instanceof Element)) return;
			const calendarBtn = target.closest("[data-calendar-tab]");
			if (calendarBtn) {
				ev.preventDefault();
				setCalendarPanelActive(true);
				refreshCalendarEvents(true);
				return;
			}
			const closeBtn = target.closest("[data-tab-close]");
			if (closeBtn) {
				ev.preventDefault();
				closeRoomTab(
					closeBtn.getAttribute("data-room"),
					closeBtn.getAttribute("data-key")
				);
				return;
			}
			const selectBtn = target.closest("[data-tab-select]");
			if (!selectBtn) return;
			ev.preventDefault();
			goToRoomWithKey(
				selectBtn.getAttribute("data-room"),
				selectBtn.getAttribute("data-key")
			);
		});
	}

	if (favoritesSelect) {
		favoritesSelect.addEventListener("change", () => {
			const v = String(favoritesSelect.value || "");
			if (!v) return;
			forcePreviewTaskAutoSortNow();
			location.hash = v;
		});
	}
	if (toggleFavoriteBtn) {
		toggleFavoriteBtn.addEventListener("click", async () => {
			const roomName = normalizeRoom(room);
			const keyName = normalizeKey(key);
			if (!roomName) return;
			const favs = loadFavorites();
			const idx = favs.findIndex(
				(f) => f.room === roomName && f.key === keyName
			);
			const authed = Boolean(psState && psState.authed);
			if (authed) {
				try {
					if (idx >= 0) {
						await api("/api/favorites", {
							method: "DELETE",
							body: JSON.stringify({ room: roomName, key: keyName }),
						});
						const next = favs.filter(
							(f) => !(f.room === roomName && f.key === keyName)
						);
						psState.favorites = next;
						toast("Removed from favorites.", "info");
					} else {
						const textSnapshot = String(
							textarea && textarea.value ? textarea.value : ""
						);
						const res = await api("/api/favorites", {
							method: "POST",
							body: JSON.stringify({
								room: roomName,
								key: keyName,
								text: textSnapshot,
							}),
						});
						const added = normalizeFavoriteEntry(
							(res && res.favorite) || {
								room: roomName,
								key: keyName,
								text: textSnapshot,
								addedAt: Date.now(),
							}
						);
						const next = [added, ...favs]
							.filter(Boolean)
							.filter(
								(f, i, arr) =>
									arr.findIndex((x) => x.room === f.room && x.key === f.key) ===
									i
							)
							.slice(0, 20);
						psState.favorites = next;
						toast("Saved to favorites.", "success");
					}
					updateFavoritesUI();
				} catch (e) {
					const msg = e && e.message ? String(e.message) : "Error";
					toast(`Favorites update failed: ${msg}`, "error");
				}
				return;
			}

			if (idx >= 0) {
				favs.splice(idx, 1);
				saveFavorites(favs);
				toast("Removed from favorites.", "info");
			} else {
				const next = [
					{ room: roomName, key: keyName, addedAt: Date.now() },
					...favs,
				]
					.filter(
						(f, i, arr) =>
							arr.findIndex((x) => x.room === f.room && x.key === f.key) === i
					)
					.slice(0, 20);
				saveFavorites(next);
				toast("Saved to favorites.", "success");
			}
			updateFavoritesUI();
		});
	}

	copyLinkBtn.addEventListener("click", async () => {
		openShareModal();
	});

	if (copyMirrorBtn && textarea) {
		copyMirrorBtn.addEventListener("click", async () => {
			const value = String(textarea.value || "");
			if (!value) {
				toast("Nothing to copy.", "info");
				return;
			}
			try {
				await navigator.clipboard.writeText(value);
				toast("Text copied.", "success");
			} catch {
				try {
					const ta = document.createElement("textarea");
					ta.value = value;
					ta.setAttribute("readonly", "");
					ta.style.position = "fixed";
					ta.style.opacity = "0";
					document.body.appendChild(ta);
					ta.select();
					document.execCommand("copy");
					ta.remove();
					toast("Text copied.", "success");
				} catch {
					toast("Copy not available.", "error");
				}
			}
		});
	}

	if (togglePermanentLinkBtn) {
		togglePermanentLinkBtn.addEventListener("click", () => {
			const roomName = normalizeRoom(room);
			const keyName = normalizeKey(key);
			if (!roomName) return;
			const current = getRoomPinnedEntry(roomName, keyName);
			if (current) {
				clearRoomPinnedEntry(roomName, keyName);
				sendRoomPinStateForRoom(roomName, keyName, {
					noteId: "",
					text: "",
					updatedAt: Date.now(),
				});
				if (current.noteId) {
					removeNoteRoomBindingByRoom(roomName, keyName);
				}
				// Clean up room-scope app states so panels don't stay stuck visible
				const excalRoom = getExcalidrawRoomScope();
				const excelRoom = getExcelRoomScope();
				const linearRoom = getLinearRoomScope();
				if (excalRoom) {
					excalidrawVisibleByNote.delete(excalRoom);
					excalidrawOffsetByNote.delete(excalRoom);
					excalidrawSceneByNote.delete(excalRoom);
				}
				if (excelRoom) {
					excelVisibleByNote.delete(excelRoom);
					excelOffsetByNote.delete(excelRoom);
				}
				if (linearRoom) {
					linearVisibleByNote.delete(linearRoom);
					linearOffsetByNote.delete(linearRoom);
					linearProjectByNote.delete(linearRoom);
					linearDataByNote.delete(linearRoom);
				}
				syncExcalidrawForNote(psEditingNoteId);
				syncExcelForNote(psEditingNoteId);
				syncLinearForNote(psEditingNoteId);
				syncPermanentLinkToggleUi();
				schedulePsListRerender();
				void loadCommentsForRoom();
				toast(t("toast.permalink_deactivated"), "info");
				return;
			}
			const noteId = String(psEditingNoteId || "").trim();
			const textSnapshot = noteId
				? ""
				: String(textarea && textarea.value ? textarea.value : "");
			setRoomPinnedEntry(roomName, keyName, {
				noteId,
				text: textSnapshot,
			});
			sendRoomPinStateForRoom(roomName, keyName, {
				noteId,
				text: textSnapshot,
				updatedAt: Date.now(),
			});
			if (noteId) {
				setRoomTabNoteId(roomName, keyName, noteId);
				const excalRoom = getExcalidrawRoomScope();
				const excelRoom = getExcelRoomScope();
				const linearRoom = getLinearRoomScope();
				const excalState = getExcalidrawStateForNote(noteId);
				if (excalState && excalRoom) {
					excalidrawVisibleByNote.set(excalRoom, excalState.visible);
					excalidrawOffsetByNote.set(excalRoom, excalState.offset || { x: 0, y: 0 });
					sendExcalidrawStateForNote(excalRoom);
					const scene = getExcalidrawSceneForNote(noteId);
					if (scene) {
						excalidrawSceneByNote.set(excalRoom, scene);
						pendingExcalidrawScene = { noteId: excalRoom, scene };
						scheduleSendExcalidrawScene();
					}
				}
				const excelState = getExcelStateForNote(noteId);
				if (excelState && excelRoom) {
					excelVisibleByNote.set(excelRoom, excelState.visible);
					excelOffsetByNote.set(excelRoom, excelState.offset || { x: 0, y: 0 });
					sendExcelStateForNote(excelRoom);
				}
				const linearState = getLinearStateForNote(noteId);
				if (linearState && linearRoom) {
					// Auto-show Linear for guests when a project is shared via permalink
					const autoShow = Boolean(linearState.projectId);
					linearVisibleByNote.set(linearRoom, autoShow || linearState.visible);
					linearOffsetByNote.set(linearRoom, linearState.offset || { x: 0, y: 0 });
					if (linearState.projectId) {
						linearProjectByNote.set(linearRoom, {
							projectId: linearState.projectId,
							projectName: linearState.projectName,
						});
					}
					sendLinearStateForNote(linearRoom);
					const linearData = getLinearDataForNote(noteId);
					if (linearData) {
						linearDataByNote.set(linearRoom, { ...linearData });
						sendLinearDataForNote(linearRoom, linearData);
					}
				}
			} else {
				setRoomTabNoteId(roomName, keyName, "");
				updateRoomTabTextLocal(roomName, keyName, textSnapshot);
			}
			scheduleRoomTabSync({
				room: roomName,
				key: keyName,
				text: resolveRoomTabSnapshotText(noteId, textSnapshot),
				lastUsed: Date.now(),
			});
			syncPermanentLinkToggleUi();
			schedulePsListRerender();
			void loadCommentsForRoom();
			toast(t("toast.permalink_activated"), "success");
		});
		togglePermanentLinkBtn.addEventListener("contextmenu", (ev) => {
			ev.preventDefault();
		});
		let permalinkTooltipTimer = null;
		let permalinkTooltipEl = null;
		function showPermalinkTooltip() {
			hidePermalinkTooltip();
			const el = document.createElement("div");
			el.className = "tab-tooltip-layer";
			const box = document.createElement("div");
			box.className = "tab-tooltip-layer__box";
			box.style.maxWidth = "360px";
			box.style.minWidth = "280px";
			box.style.padding = "8px 12px";
			box.textContent = t("permalink.info.message");
			const arrow = document.createElement("div");
			arrow.className = "tab-tooltip-layer__arrow";
			el.appendChild(box);
			el.appendChild(arrow);
			document.body.appendChild(el);
			permalinkTooltipEl = el;
			const rect = togglePermanentLinkBtn.getBoundingClientRect();
			const left = rect.left + rect.width / 2;
			el.style.left = `${left}px`;
			el.style.top = "0px";
			requestAnimationFrame(() => {
				if (!permalinkTooltipEl) return;
				const bw = box.offsetWidth || 0;
				const h = box.offsetHeight || 0;
				const top = rect.top - h - 10;
				// Clamp horizontally so tooltip stays within viewport
				const vw = window.innerWidth;
				const margin = 8;
				let finalLeft = left;
				const halfW = bw / 2;
				if (finalLeft + halfW > vw - margin) finalLeft = vw - margin - halfW;
				if (finalLeft - halfW < margin) finalLeft = margin + halfW;
				el.style.left = `${finalLeft}px`;
				el.style.top = `${top}px`;
				// Shift arrow to point at the button center
				const arrowOffset = left - finalLeft;
				arrow.style.left = `calc(50% + ${arrowOffset}px)`;
				el.classList.add("is-visible");
			});
		}
		function hidePermalinkTooltip() {
			if (permalinkTooltipTimer) { clearTimeout(permalinkTooltipTimer); permalinkTooltipTimer = null; }
			if (permalinkTooltipEl) { permalinkTooltipEl.remove(); permalinkTooltipEl = null; }
		}
		togglePermanentLinkBtn.addEventListener("mouseenter", () => {
			permalinkTooltipTimer = setTimeout(showPermalinkTooltip, 500);
		});
		togglePermanentLinkBtn.addEventListener("mouseleave", hidePermalinkTooltip);
	}

	let excalidrawVisible = false;
	const excalidrawVisibleByNote = new Map();
	let excalidrawOffset = { x: 0, y: 0 };
	const excalidrawOffsetByNote = new Map();
	const excalidrawSceneByNote = new Map();
	let excalidrawSceneSendTimer = null;
	let pendingExcalidrawScene = null;
	let excelVisible = false;
	const excelVisibleByNote = new Map();
	let excelOffset = { x: 0, y: 0 };
	const excelOffsetByNote = new Map();
	let linearVisible = false;
	const linearVisibleByNote = new Map();
	let linearOffset = { x: 0, y: 0 };
	const linearOffsetByNote = new Map();
	const linearProjectByNote = new Map();
	const linearDataByNote = new Map();
	const linearViewByNote = new Map();
	let linearActiveView = "board";
	let linearDataSendTimer = null;
	let pendingLinearData = null;

	const getExcalidrawRoomScope = () => {
		const roomName = normalizeRoom(room);
		if (!roomName) return "";
		const keyName = normalizeKey(key);
		return `room:${roomName}:${keyName || "nokey"}`;
	};

	const getExcalidrawNoteId = () => {
		const pinned = getRoomPinnedEntry(room, key);
		if (pinned) return getExcalidrawRoomScope();
		// In shared rooms, always use room scope so all participants
		// resolve the same noteId for app state sync
		if (isRoomMarkedShared(room, key)) return getExcalidrawRoomScope();
		const noteId = String(psEditingNoteId || "").trim();
		if (noteId) return noteId;
		return getExcalidrawRoomScope();
	};

	const getExcelRoomScope = () => {
		const roomName = normalizeRoom(room);
		if (!roomName) return "";
		const keyName = normalizeKey(key);
		return `room:${roomName}:${keyName || "nokey"}`;
	};

	const getExcelNoteId = () => {
		const pinned = getRoomPinnedEntry(room, key);
		if (pinned) return getExcelRoomScope();
		if (isRoomMarkedShared(room, key)) return getExcelRoomScope();
		const noteId = String(psEditingNoteId || "").trim();
		if (noteId) return noteId;
		return getExcelRoomScope();
	};

	const getLinearRoomScope = () => {
		const roomName = normalizeRoom(room);
		if (!roomName) return "";
		const keyName = normalizeKey(key);
		return `room:${roomName}:${keyName || "nokey"}`;
	};

	const getLinearNoteId = () => {
		const pinned = getRoomPinnedEntry(room, key);
		if (pinned) return getLinearRoomScope();
		if (isRoomMarkedShared(room, key)) return getLinearRoomScope();
		const noteId = String(psEditingNoteId || "").trim();
		if (noteId) return noteId;
		return getLinearRoomScope();
	};

	const resolvePinnedAppScope = (noteId, kind) => {
		const pinned = getRoomPinnedEntry(room, key);
		if (!pinned || !pinned.noteId) return "";
		const targetId = String(noteId || "").trim();
		if (!targetId || targetId !== String(pinned.noteId || "").trim()) return "";
		switch (kind) {
			case "excalidraw":
				return getExcalidrawRoomScope();
			case "excel":
				return getExcelRoomScope();
			case "linear":
				return getLinearRoomScope();
			default:
				return "";
		}
	};

	const getExcelBaseUrl = () => {
		if (excelEmbed) {
			const base = String(excelEmbed.getAttribute("data-excel-base") || "").trim();
			if (base) return base;
		}
		return "";
	};

	const buildExcelSheetId = () => {
		const roomName = normalizeRoom(room);
		if (roomName) {
			const keyName = normalizeKey(key);
			return keyName ? `${roomName}-${keyName}` : roomName;
		}
		const fallbackNoteId = String(psEditingNoteId || "").trim();
		if (fallbackNoteId) return `note-${fallbackNoteId}`;
		return "default";
	};

	const setExcelEmbedUrl = () => {
		const base = getExcelBaseUrl();
		if (!base || !excelFrame) return;
		const sheetId = buildExcelSheetId();
		const cleanBase = base.replace(/\/+$/, "");
		const nextUrl = `${cleanBase}/${encodeURIComponent(sheetId)}`;
		const currentUrl = String(excelFrame.getAttribute("src") || "").trim();
		if (currentUrl !== nextUrl) {
			excelFrame.setAttribute("src", nextUrl);
		}
	};

	const getExcalidrawStateForNote = (noteId) => {
		const activeId = String(noteId || "").trim() || getExcalidrawNoteId();
		if (!activeId) return null;
		const offset = excalidrawOffsetByNote.get(activeId) || { x: 0, y: 0 };
		const visible = Boolean(excalidrawVisibleByNote.get(activeId));
		return {
			noteId: activeId,
			visible,
			offset: {
				x: Number(offset.x || 0) || 0,
				y: Number(offset.y || 0) || 0,
			},
		};
	};

	const getExcalidrawSceneForNote = (noteId) => {
		const activeId = String(noteId || "").trim() || getExcalidrawNoteId();
		if (!activeId) return "";
		return String(excalidrawSceneByNote.get(activeId) || "");
	};

	const getExcelStateForNote = (noteId) => {
		const activeId = String(noteId || "").trim() || getExcelNoteId();
		if (!activeId) return null;
		const offset = excelOffsetByNote.get(activeId) || { x: 0, y: 0 };
		const visible = Boolean(excelVisibleByNote.get(activeId));
		return {
			noteId: activeId,
			visible,
			offset: {
				x: Number(offset.x || 0) || 0,
				y: Number(offset.y || 0) || 0,
			},
		};
	};

	const getLinearStateForNote = (noteId) => {
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		if (!activeId) return null;
		const offset = linearOffsetByNote.get(activeId) || { x: 0, y: 0 };
		const visible = Boolean(linearVisibleByNote.get(activeId));
		const project = linearProjectByNote.get(activeId) || null;
		return {
			noteId: activeId,
			visible,
			projectId: project && project.projectId ? project.projectId : "",
			projectName: project && project.projectName ? project.projectName : "",
			offset: {
				x: Number(offset.x || 0) || 0,
				y: Number(offset.y || 0) || 0,
			},
		};
	};

	const getLinearDataForNote = (noteId) => {
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		if (!activeId) return null;
		return linearDataByNote.get(activeId) || null;
	};

	const postExcalidrawMessage = (payload) => {
		if (!excalidrawFrame || !excalidrawFrame.contentWindow) return;
		try {
			excalidrawFrame.contentWindow.postMessage(payload, window.location.origin);
		} catch {
			// ignore
		}
	};

	const sendExcalidrawSceneToEmbed = (noteId, scene) => {
		const targetId = String(noteId || "").trim() || getExcalidrawNoteId();
		if (!targetId) return;
		const payloadScene = scene || getExcalidrawSceneForNote(targetId) || EXCALIDRAW_EMPTY_SCENE;
		postExcalidrawMessage({
			type: "excalidraw_load_scene",
			noteId: targetId,
			scene: payloadScene,
		});
	};

	const clampExcalidrawOffsetToMirror = (next, dragState) => {
		if (!textarea || !excalidrawEmbed) return next;
		const mirrorRect = dragState && dragState.mirrorRect ? dragState.mirrorRect : textarea.getBoundingClientRect();
		const baseRect = dragState && dragState.baseRect ? dragState.baseRect : excalidrawEmbed.getBoundingClientRect();
		if (!mirrorRect || !baseRect) return next;
		const baseX = dragState ? dragState.baseX : excalidrawOffset.x || 0;
		const baseY = dragState ? dragState.baseY : excalidrawOffset.y || 0;
		const dx = next.x - baseX;
		const dy = next.y - baseY;
		const clampedDx = Math.min(
			Math.max(dx, mirrorRect.left - baseRect.left),
			mirrorRect.right - baseRect.right
		);
		const clampedDy = Math.min(
			Math.max(dy, mirrorRect.top - baseRect.top),
			mirrorRect.bottom - baseRect.bottom
		);
		return { x: baseX + clampedDx, y: baseY + clampedDy };
	};

	const clampExcelOffsetToMirror = (next, dragState) => {
		if (!textarea || !excelEmbed) return next;
		const mirrorRect = dragState && dragState.mirrorRect ? dragState.mirrorRect : textarea.getBoundingClientRect();
		const baseRect = dragState && dragState.baseRect ? dragState.baseRect : excelEmbed.getBoundingClientRect();
		if (!mirrorRect || !baseRect) return next;
		const baseX = dragState ? dragState.baseX : excelOffset.x || 0;
		const baseY = dragState ? dragState.baseY : excelOffset.y || 0;
		const dx = next.x - baseX;
		const dy = next.y - baseY;
		const clampedDx = Math.min(
			Math.max(dx, mirrorRect.left - baseRect.left),
			mirrorRect.right - baseRect.right
		);
		const clampedDy = Math.min(
			Math.max(dy, mirrorRect.top - baseRect.top),
			mirrorRect.bottom - baseRect.bottom
		);
		return { x: baseX + clampedDx, y: baseY + clampedDy };
	};

	const clampLinearOffsetToMirror = (next, dragState) => {
		if (!textarea || !linearEmbed) return next;
		const mirrorRect = dragState && dragState.mirrorRect ? dragState.mirrorRect : textarea.getBoundingClientRect();
		const baseRect = dragState && dragState.baseRect ? dragState.baseRect : linearEmbed.getBoundingClientRect();
		if (!mirrorRect || !baseRect) return next;
		const baseX = dragState ? dragState.baseX : linearOffset.x || 0;
		const baseY = dragState ? dragState.baseY : linearOffset.y || 0;
		const dx = next.x - baseX;
		const dy = next.y - baseY;
		const clampedDx = Math.min(
			Math.max(dx, mirrorRect.left - baseRect.left),
			mirrorRect.right - baseRect.right
		);
		const clampedDy = Math.min(
			Math.max(dy, mirrorRect.top - baseRect.top),
			mirrorRect.bottom - baseRect.bottom
		);
		return { x: baseX + clampedDx, y: baseY + clampedDy };
	};

	const scheduleSendExcalidrawScene = () => {
		if (!pendingExcalidrawScene) return;
		window.clearTimeout(excalidrawSceneSendTimer);
		excalidrawSceneSendTimer = window.setTimeout(() => {
			if (!pendingExcalidrawScene) return;
			if (!ws || ws.readyState !== WebSocket.OPEN) return;
			const items = [pendingExcalidrawScene];
			pendingExcalidrawScene = null;
			sendMessage({
				type: "excalidraw_scene",
				room,
				clientId,
				items,
			});
		}, 400);
	};

	const sendExcalidrawStateForNote = (noteId) => {
		const state = getExcalidrawStateForNote(noteId);
		if (!state) return;
		if (!ws || ws.readyState !== WebSocket.OPEN) return;
		sendMessage({
			type: "excalidraw_state",
			room,
			clientId,
			items: [state],
		});
	};

	const sendExcelStateForNote = (noteId) => {
		const state = getExcelStateForNote(noteId);
		if (!state) return;
		if (!ws || ws.readyState !== WebSocket.OPEN) return;
		sendMessage({
			type: "excel_state",
			room,
			clientId,
			items: [state],
		});
	};

	const sendLinearStateForNote = (noteId) => {
		const state = getLinearStateForNote(noteId);
		if (!state) return;
		if (!ws || ws.readyState !== WebSocket.OPEN) return;
		sendMessage({
			type: "linear_state",
			room,
			clientId,
			items: [state],
		});
	};

	const scheduleSendLinearData = () => {
		if (!pendingLinearData) return;
		window.clearTimeout(linearDataSendTimer);
		linearDataSendTimer = window.setTimeout(() => {
			if (!pendingLinearData) return;
			if (!ws || ws.readyState !== WebSocket.OPEN) return;
			const items = [pendingLinearData];
			pendingLinearData = null;
			sendMessage({
				type: "linear_data",
				room,
				clientId,
				items,
			});
		}, 500);
	};

	const sendLinearDataForNote = (noteId, data) => {
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		if (!activeId) return;
		const payload = data || getLinearDataForNote(activeId);
		if (!payload) return;
		if (!ws || ws.readyState !== WebSocket.OPEN) return;
		pendingLinearData = {
			noteId: activeId,
			projectId: String(payload.projectId || ""),
			projectName: String(payload.projectName || ""),
			updatedAt: Number(payload.updatedAt || Date.now()) || Date.now(),
			tasks: Array.isArray(payload.tasks) ? payload.tasks.slice(0, 200) : [],
		};
		scheduleSendLinearData();
	};

	const applyExcalidrawOffset = (offset) => {
		const ox = Number(offset && offset.x ? offset.x : 0) || 0;
		const oy = Number(offset && offset.y ? offset.y : 0) || 0;
		excalidrawOffset = { x: ox, y: oy };
		if (excalidrawEmbed) {
			excalidrawEmbed.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
		}
	};

	const applyExcelOffset = (offset) => {
		const ox = Number(offset && offset.x ? offset.x : 0) || 0;
		const oy = Number(offset && offset.y ? offset.y : 0) || 0;
		excelOffset = { x: ox, y: oy };
		if (excelEmbed) {
			excelEmbed.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
		}
	};

	const applyLinearOffset = (offset) => {
		const ox = Number(offset && offset.x ? offset.x : 0) || 0;
		const oy = Number(offset && offset.y ? offset.y : 0) || 0;
		linearOffset = { x: ox, y: oy };
		if (linearEmbed) {
			linearEmbed.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
		}
	};

	const loadExcalidrawOffsetForNote = (noteId) => {
		const activeId = String(noteId || "").trim() || getExcalidrawNoteId();
		const saved = activeId ? excalidrawOffsetByNote.get(activeId) : null;
		if (saved) {
			applyExcalidrawOffset({ x: saved.x || 0, y: saved.y || 0 });
			return;
		}
		applyExcalidrawOffset({ x: 0, y: 0 });
	};

	const loadExcelOffsetForNote = (noteId) => {
		const activeId = String(noteId || "").trim() || getExcelNoteId();
		const saved = activeId ? excelOffsetByNote.get(activeId) : null;
		if (saved) {
			applyExcelOffset({ x: saved.x || 0, y: saved.y || 0 });
			return;
		}
		applyExcelOffset({ x: 0, y: 0 });
	};

	const loadLinearOffsetForNote = (noteId) => {
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		const saved = activeId ? linearOffsetByNote.get(activeId) : null;
		if (saved) {
			applyLinearOffset({ x: saved.x || 0, y: saved.y || 0 });
			return;
		}
		applyLinearOffset({ x: 0, y: 0 });
	};

	const storeExcalidrawOffsetForNote = (noteId, offset) => {
		const activeId = String(noteId || "").trim() || getExcalidrawNoteId();
		if (!activeId) return;
		excalidrawOffsetByNote.set(activeId, {
			x: Number(offset && offset.x ? offset.x : 0) || 0,
			y: Number(offset && offset.y ? offset.y : 0) || 0,
		});
		sendExcalidrawStateForNote(activeId);
	};

	const storeExcelOffsetForNote = (noteId, offset) => {
		const activeId = String(noteId || "").trim() || getExcelNoteId();
		if (!activeId) return;
		excelOffsetByNote.set(activeId, {
			x: Number(offset && offset.x ? offset.x : 0) || 0,
			y: Number(offset && offset.y ? offset.y : 0) || 0,
		});
		sendExcelStateForNote(activeId);
	};

	const storeLinearOffsetForNote = (noteId, offset) => {
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		if (!activeId) return;
		linearOffsetByNote.set(activeId, {
			x: Number(offset && offset.x ? offset.x : 0) || 0,
			y: Number(offset && offset.y ? offset.y : 0) || 0,
		});
		sendLinearStateForNote(activeId);
	};

	const setExcalidrawVisible = (nextVisible, opts = {}) => {
		excalidrawVisible = Boolean(nextVisible);
		const remember = opts.remember !== false;
		const activeNoteId = getExcalidrawNoteId();
		if (excalidrawEmbed) {
			excalidrawEmbed.classList.toggle("hidden", !excalidrawVisible);
			excalidrawEmbed.setAttribute(
				"aria-hidden",
				excalidrawVisible ? "false" : "true"
			);
		}
		if (toggleExcalidrawBtn) {
			toggleExcalidrawBtn.setAttribute(
				"aria-pressed",
				excalidrawVisible ? "true" : "false"
			);
		}
		if (remember && activeNoteId) {
			excalidrawVisibleByNote.set(activeNoteId, excalidrawVisible);
			sendExcalidrawStateForNote(activeNoteId);
		}
		if (textarea) {
			textarea.classList.toggle("excalidraw-active", excalidrawVisible);
		}
		applyExcalidrawOffset(excalidrawOffset);
		if (excalidrawVisible && excalidrawFrame) {
			try {
				excalidrawFrame.focus();
			} catch {
				// ignore
			}
		}
	};

	const setExcelVisible = (nextVisible, opts = {}) => {
		excelVisible = Boolean(nextVisible);
		const remember = opts.remember !== false;
		const activeNoteId = getExcelNoteId();
		if (excelEmbed) {
			excelEmbed.classList.toggle("hidden", !excelVisible);
			excelEmbed.setAttribute(
				"aria-hidden",
				excelVisible ? "false" : "true"
			);
		}
		if (toggleExcelBtn) {
			toggleExcelBtn.setAttribute(
				"aria-pressed",
				excelVisible ? "true" : "false"
			);
		}
		if (remember && activeNoteId) {
			excelVisibleByNote.set(activeNoteId, excelVisible);
			sendExcelStateForNote(activeNoteId);
		}
		applyExcelOffset(excelOffset);
		if (excelVisible && excelFrame) {
			try {
				excelFrame.focus();
			} catch {
				// ignore
			}
		}
	};

	const setLinearVisible = (nextVisible, opts = {}) => {
		linearVisible = Boolean(nextVisible);
		const remember = opts.remember !== false;
		const activeNoteId = getLinearNoteId();
		if (linearEmbed) {
			linearEmbed.classList.toggle("hidden", !linearVisible);
			linearEmbed.setAttribute(
				"aria-hidden",
				linearVisible ? "false" : "true"
			);
		}
		if (toggleLinearBtn) {
			toggleLinearBtn.setAttribute(
				"aria-pressed",
				linearVisible ? "true" : "false"
			);
		}
		if (remember && activeNoteId) {
			linearVisibleByNote.set(activeNoteId, linearVisible);
			sendLinearStateForNote(activeNoteId);
		}
		applyLinearOffset(linearOffset);
	};

	const handleExcalidrawEmbedMessage = (ev) => {
		if (ev && ev.origin && ev.origin !== window.location.origin) return;
		const msg = ev && ev.data ? ev.data : null;
		if (!msg || msg.type !== "excalidraw_scene_change") return;
		const noteId = String(msg.noteId || getExcalidrawNoteId() || "").trim();
		const scene = typeof msg.scene === "string" ? msg.scene : "";
		if (!noteId || !scene) return;
		if (scene.length > EXCALIDRAW_SCENE_MAX_BYTES) return;
		excalidrawSceneByNote.set(noteId, scene);
		pendingExcalidrawScene = { noteId, scene };
		scheduleSendExcalidrawScene();
	};

	if (typeof window !== "undefined") {
		window.addEventListener("message", handleExcalidrawEmbedMessage);
	}

	if (excalidrawFrame) {
		excalidrawFrame.addEventListener("load", () => {
			sendExcalidrawSceneToEmbed(getExcalidrawNoteId());
		});
	}

	const syncExcalidrawForNote = (noteId) => {
		const pinnedScope = resolvePinnedAppScope(noteId, "excalidraw");
		const activeId = pinnedScope || String(noteId || "").trim() || getExcalidrawNoteId();
		const savedVisible = activeId
			? Boolean(excalidrawVisibleByNote.get(activeId))
			: false;
		loadExcalidrawOffsetForNote(activeId);
		setExcalidrawVisible(savedVisible, { remember: false });
		sendExcalidrawSceneToEmbed(activeId);
		if (
			activeId &&
			(excalidrawVisibleByNote.has(activeId) || excalidrawOffsetByNote.has(activeId))
		) {
			sendExcalidrawStateForNote(activeId);
		}
	};

	const syncExcelForNote = (noteId) => {
		const pinnedScope = resolvePinnedAppScope(noteId, "excel");
		const activeId = pinnedScope || String(noteId || "").trim() || getExcelNoteId();
		setExcelEmbedUrl();
		const savedVisible = activeId
			? Boolean(excelVisibleByNote.get(activeId))
			: false;
		loadExcelOffsetForNote(activeId);
		setExcelVisible(savedVisible, { remember: false });
		if (activeId && (excelVisibleByNote.has(activeId) || excelOffsetByNote.has(activeId))) {
			sendExcelStateForNote(activeId);
		}
	};

	const normalizeLinearView = (value) => (value === "stats" ? "stats" : "board");

	const getLinearViewForNote = (noteId) => {
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		if (!activeId) return "board";
		const saved = linearViewByNote.get(activeId);
		return normalizeLinearView(saved);
	};

	const applyLinearView = (view) => {
		const next = normalizeLinearView(view);
		linearActiveView = next;
		if (linearViewBoardBtn) {
			linearViewBoardBtn.setAttribute(
				"aria-pressed",
				next === "board" ? "true" : "false"
			);
		}
		if (linearViewStatsBtn) {
			linearViewStatsBtn.setAttribute(
				"aria-pressed",
				next === "stats" ? "true" : "false"
			);
		}
		if (linearTaskList) {
			linearTaskList.classList.toggle("hidden", next !== "board");
		}
		if (linearStatsPanel) {
			linearStatsPanel.classList.toggle("hidden", next !== "stats");
		}
		if (linearEmpty && next !== "board") {
			linearEmpty.classList.add("hidden");
		}
	};

	const setLinearViewForNote = (noteId, view) => {
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		const next = normalizeLinearView(view);
		if (activeId) {
			linearViewByNote.set(activeId, next);
		}
		applyLinearView(next);
	};

	const updateLinearProjectSelectOptions = (activeId) => {
		if (!linearProjectSelect) return;
		const enabled = Array.from(linearEnabledProjectIds || []).filter(Boolean);
		const enabledSet = new Set(enabled);
		const allowedProjects = Array.isArray(linearProjects)
			? linearProjects.filter((p) => enabledSet.has(p.id))
			: [];
		const current = activeId ? linearProjectByNote.get(activeId) : null;
		let selectedId = current && current.projectId ? current.projectId : "";
		// If the selected project was received via sync (shared room) but is not
		// in the local enabled set, keep it and add it as an option so guests
		// can see the shared project.
		const sharedProjectOption =
			selectedId && !enabledSet.has(selectedId) && current
				? { id: current.projectId, name: current.projectName || current.projectId }
				: null;
		const projectOptions = sharedProjectOption
			? [
					sharedProjectOption,
					...allowedProjects.filter((p) => p.id !== sharedProjectOption.id),
			  ]
			: allowedProjects;
		const options = [
			{ id: "", name: t("linear.embed.select_placeholder") },
			...projectOptions.map((p) => ({ id: p.id, name: p.name })),
		];
		linearProjectSelect.innerHTML = options
			.map((opt) => {
				const safeId = String(opt.id || "");
				const safeName = String(opt.name || "");
				const selected = safeId && safeId === selectedId ? "selected" : "";
				return `<option value="${safeId}" ${selected}>${safeName}</option>`;
			})
			.join("");
		linearProjectSelect.value = selectedId || "";
	};

	const getLinearStatusColor = (state) => {
		const value = String(state || "").trim().toLowerCase();
		if (!value) return "#38bdf8";
		if (
			value.includes("done") ||
			value.includes("completed") ||
			value.includes("closed") ||
			value.includes("finished")
		) {
			return "#22c55e";
		}
		if (
			value.includes("progress") ||
			value.includes("doing") ||
			value.includes("active")
		) {
			return "#f59e0b";
		}
		if (
			value.includes("review") ||
			value.includes("qa") ||
			value.includes("test")
		) {
			return "#a855f7";
		}
		if (
			value.includes("blocked") ||
			value.includes("cancelled") ||
			value.includes("canceled") ||
			value.includes("failed")
		) {
			return "#ef4444";
		}
		if (
			value.includes("backlog") ||
			value.includes("todo") ||
			value.includes("open") ||
			value.includes("triage") ||
			value.includes("new")
		) {
			return "#94a3b8";
		}
		return "#38bdf8";
	};

	const getLinearStatusBucket = (state) => {
		const value = String(state || "").trim().toLowerCase();
		if (
			value.includes("done") ||
			value.includes("completed") ||
			value.includes("closed") ||
			value.includes("finished")
		) {
			return "done";
		}
		if (
			value.includes("progress") ||
			value.includes("doing") ||
			value.includes("active")
		) {
			return "in_progress";
		}
		if (
			value.includes("review") ||
			value.includes("qa") ||
			value.includes("test")
		) {
			return "review";
		}
		if (
			value.includes("blocked") ||
			value.includes("cancelled") ||
			value.includes("canceled") ||
			value.includes("failed")
		) {
			return "blocked";
		}
		if (
			value.includes("backlog") ||
			value.includes("todo") ||
			value.includes("open") ||
			value.includes("triage") ||
			value.includes("new")
		) {
			return "backlog";
		}
		return "other";
	};

	const normalizeLinearTasks = (tasks) => {
		const list = Array.isArray(tasks) ? tasks : [];
		return list.map((task) => {
			const title = String(task && task.title ? task.title : "");
			const id = String(task && task.identifier ? task.identifier : "");
			const state = String(task && task.state ? task.state : "").trim();
			const assignee = String(task && task.assignee ? task.assignee : "");
			const due = String(task && task.dueDate ? task.dueDate : "");
			const url = String(task && task.url ? task.url : "");
			return { title, id, state: state || "Unbekannt", assignee, due, url };
		});
	};

	const renderLinearTasks = (noteId) => {
		if (!linearTaskList) return;
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		const data = getLinearDataForNote(activeId);
		const rawTasks = data && Array.isArray(data.tasks) ? data.tasks : [];
		const tasks = normalizeLinearTasks(rawTasks);
		const openLabel = t("linear.embed.open");
		const columns = new Map();
		const stateOrder = [];
		for (const item of tasks) {
			if (!columns.has(item.state)) {
				columns.set(item.state, []);
				stateOrder.push(item.state);
			}
			columns.get(item.state).push(item);
		}
		linearTaskList.innerHTML = `
			<div class="linear-kanban">
				${stateOrder
					.map((state) => {
						const items = columns.get(state) || [];
						const statusColor = getLinearStatusColor(state);
						return `
							<div class="linear-kanban-column">
								<div class="linear-kanban-header">
									<span class="linear-kanban-title">
										<svg class="linear-kanban-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: ${statusColor}">
											<path d="M3 3h7v7H3z" />
											<path d="M14 3h7v7h-7z" />
											<path d="M3 14h7v7H3z" />
											<path d="M14 14h7v7h-7z" />
										</svg>
										${state}
									</span>
									<span class="linear-kanban-count">${items.length}</span>
								</div>
								<div class="linear-kanban-list">
									${items
										.map((task) => {
											const metaParts = [
												task.id,
												task.assignee,
												task.due,
											].filter(Boolean);
											return `
												<div class="linear-task-item">
													<div class="linear-task-title">${task.title || "—"}</div>
													<div class="linear-task-meta">${metaParts.join(" · ")}</div>
													${
														task.url
															? `<a class="linear-task-link" href="${task.url}" target="_blank" rel="noreferrer">${openLabel}</a>`
															: ""
													}
												</div>`;
										})
										.join("")}
								</div>
							</div>`;
					})
					.join("")}
			</div>
		`;
		if (linearStatus) {
			const project = activeId ? linearProjectByNote.get(activeId) : null;
			if (!project || !project.projectId) {
				linearStatus.textContent = t("linear.embed.select_placeholder");
			} else if (data && data.updatedAt) {
				linearStatus.textContent = `${
					project.projectName || "Linear"
				} · ${new Date(data.updatedAt).toLocaleString()}`;
			} else {
				linearStatus.textContent = project.projectName || "Linear";
			}
		}
		if (linearProjectHeader) {
			const project = activeId ? linearProjectByNote.get(activeId) : null;
			if (project && project.projectName) {
				linearProjectHeader.textContent = project.projectName;
				linearProjectHeader.classList.remove("hidden");
			} else {
				linearProjectHeader.textContent = "";
				linearProjectHeader.classList.add("hidden");
			}
		}
		if (linearEmpty) {
			linearEmpty.classList.toggle("hidden", tasks.length > 0);
		}
		renderLinearStats(activeId);
		applyLinearView(getLinearViewForNote(activeId));
	};

	const renderLinearStats = (noteId) => {
		if (!linearStatsPanel) return;
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		const data = getLinearDataForNote(activeId);
		const rawTasks = data && Array.isArray(data.tasks) ? data.tasks : [];
		const tasks = normalizeLinearTasks(rawTasks);
		if (!tasks.length) {
			linearStatsPanel.innerHTML = `<div class="linear-stats-empty">${t(
				"linear.stats.empty"
			)}</div>`;
			return;
		}
		const project = activeId ? linearProjectByNote.get(activeId) : null;
		const projectName = project && project.projectName ? project.projectName : "Linear";
		const updatedAt = data && data.updatedAt
			? new Date(data.updatedAt).toLocaleString(getUiLocale())
			: "";
		const total = tasks.length;
		let done = 0;
		let inProgress = 0;
		let blocked = 0;
		let overdue = 0;
		let dueSoon = 0;
		const stateCounts = new Map();
		const assigneeCounts = new Map();
		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		).getTime();
		const soonLimit = today + 7 * 24 * 60 * 60 * 1000;
		for (const task of tasks) {
			const bucket = getLinearStatusBucket(task.state);
			if (bucket === "done") done += 1;
			if (bucket === "in_progress") inProgress += 1;
			if (bucket === "blocked") blocked += 1;
			const stateKey = task.state || t("linear.stats.unknown");
			stateCounts.set(stateKey, (stateCounts.get(stateKey) || 0) + 1);
			const assigneeLabel = task.assignee
				? task.assignee
				: t("linear.stats.unassigned");
			assigneeCounts.set(
				assigneeLabel,
				(assigneeCounts.get(assigneeLabel) || 0) + 1
			);
			const dueTs = task.due ? Date.parse(task.due) : NaN;
			if (!Number.isNaN(dueTs)) {
				if (dueTs < today) overdue += 1;
				else if (dueTs <= soonLimit) dueSoon += 1;
			}
		}
		const stateRows = Array.from(stateCounts.entries()).sort(
			(a, b) => b[1] - a[1]
		);
		const assigneeRows = Array.from(assigneeCounts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 6);
		const maxState = Math.max(1, ...stateRows.map((row) => row[1]));
		const maxAssignee = Math.max(1, ...assigneeRows.map((row) => row[1]));
		const totalLabel = formatUi(t("linear.stats.total"), { count: total });
		const updatedLabel = updatedAt
			? formatUi(t("linear.stats.updated"), { date: updatedAt })
			: "";
		linearStatsPanel.innerHTML = `
			<div class="linear-stats-header">
				<div>
					<div class="linear-stats-title">${projectName}</div>
					${updatedLabel ? `<div class="linear-stats-sub">${updatedLabel}</div>` : ""}
				</div>
				<div class="linear-stats-badge">${totalLabel}</div>
			</div>
			<div class="linear-stats-grid">
				<div class="linear-stat-card">
					<div class="linear-stat-label">${t("linear.stats.done")}</div>
					<div class="linear-stat-value">${done}</div>
				</div>
				<div class="linear-stat-card">
					<div class="linear-stat-label">${t("linear.stats.in_progress")}</div>
					<div class="linear-stat-value">${inProgress}</div>
				</div>
				<div class="linear-stat-card">
					<div class="linear-stat-label">${t("linear.stats.blocked")}</div>
					<div class="linear-stat-value">${blocked}</div>
				</div>
				<div class="linear-stat-card">
					<div class="linear-stat-label">${t("linear.stats.overdue")}</div>
					<div class="linear-stat-value">${overdue}</div>
				</div>
				<div class="linear-stat-card">
					<div class="linear-stat-label">${t("linear.stats.due_soon")}</div>
					<div class="linear-stat-value">${dueSoon}</div>
				</div>
			</div>
			<div class="linear-stats-section">
				<div class="linear-stats-section-title">${t("linear.stats.by_status")}</div>
				<div class="linear-stats-list">
					${stateRows
						.map(([label, count]) => {
							const width = Math.max(6, Math.round((count / maxState) * 100));
							const color = getLinearStatusColor(label);
							return `
								<div class="linear-stats-row">
									<div class="linear-stats-row-label">${label}</div>
									<div class="linear-stats-row-bar">
										<div class="linear-stats-row-fill" style="width: ${width}%; background: ${color};"></div>
									</div>
									<div class="linear-stats-row-value">${count}</div>
								</div>`;
						})
						.join("")}
				</div>
			</div>
			<div class="linear-stats-section">
				<div class="linear-stats-section-title">${t("linear.stats.by_assignee")}</div>
				<div class="linear-stats-list">
					${assigneeRows
						.map(([label, count]) => {
							const width = Math.max(6, Math.round((count / maxAssignee) * 100));
							return `
								<div class="linear-stats-row">
									<div class="linear-stats-row-label">${label}</div>
									<div class="linear-stats-row-bar">
										<div class="linear-stats-row-fill" style="width: ${width}%;"></div>
									</div>
									<div class="linear-stats-row-value">${count}</div>
								</div>`;
						})
						.join("")}
				</div>
			</div>
		`;
	};

	const setLinearProjectForNote = (noteId, project) => {
		const activeId = String(noteId || "").trim() || getLinearNoteId();
		if (!activeId || !project) return;
		const projectId = String(project.projectId || project.id || "");
		const projectName = String(project.projectName || project.name || "");
		if (!projectId) return;
		linearProjectByNote.set(activeId, { projectId, projectName });
		updateLinearProjectSelectOptions(activeId);
		sendLinearStateForNote(activeId);
		if (linearStatus) {
			linearStatus.textContent = `${projectName || "Linear"}`;
		}
	};

	const syncLinearForNote = (noteId) => {
		const pinnedScope = resolvePinnedAppScope(noteId, "linear");
		const resolvedNoteId = String(noteId || "").trim();
		const activeId = pinnedScope || resolvedNoteId || getLinearNoteId();
		// If no pin and no note, hide Linear – don't inherit stale room scope visibility
		const hasPinOrNote = Boolean(pinnedScope || resolvedNoteId || getRoomPinnedEntry(room, key));
		const savedVisible = hasPinOrNote && activeId
			? Boolean(linearVisibleByNote.get(activeId))
			: false;
		loadLinearOffsetForNote(activeId);
		setLinearVisible(savedVisible, { remember: false });
		updateLinearProjectSelectOptions(activeId);
		renderLinearTasks(activeId);
		if (activeId && (linearVisibleByNote.has(activeId) || linearOffsetByNote.has(activeId))) {
			sendLinearStateForNote(activeId);
		}
		if (activeId && linearDataByNote.has(activeId)) {
			sendLinearDataForNote(activeId);
		}
	};

	if (toggleExcalidrawBtn && excalidrawEmbed) {
		toggleExcalidrawBtn.addEventListener("click", () => {
			setExcalidrawVisible(!excalidrawVisible);
		});
	}

	if (toggleLinearBtn && linearEmbed) {
		toggleLinearBtn.addEventListener("click", () => {
			const activeId = getLinearNoteId();
			if (linearVisible) {
				// Always allow hiding
				setLinearVisible(false);
				return;
			}
			// Opening: check if a project is selected
			updateLinearProjectSelectOptions(activeId);
			const current = activeId ? linearProjectByNote.get(activeId) : null;
			if (!current || !current.projectId) {
				setLinearVisible(true, { remember: false });
				toast(t("toast.linear_select_project"), "info");
				return;
			}
			setLinearVisible(true);
		});
	}

	if (linearViewBoardBtn) {
		linearViewBoardBtn.addEventListener("click", () => {
			const activeId = getLinearNoteId();
			setLinearViewForNote(activeId, "board");
			renderLinearTasks(activeId);
		});
	}

	if (linearViewStatsBtn) {
		linearViewStatsBtn.addEventListener("click", () => {
			const activeId = getLinearNoteId();
			setLinearViewForNote(activeId, "stats");
			renderLinearStats(activeId);
		});
	}

	if (toggleExcelBtn && excelEmbed) {
		toggleExcelBtn.addEventListener("click", () => {
			setExcelEmbedUrl();
			setExcelVisible(!excelVisible);
		});
	}

	if (linearProjectApplyBtn) {
		linearProjectApplyBtn.addEventListener("click", () => {
			const activeId = getLinearNoteId();
			const selected = String(
				linearProjectSelect ? linearProjectSelect.value : ""
			).trim();
			if (!selected) {
				toast(t("toast.linear_select_project"), "info");
				return;
			}
			let project = Array.isArray(linearProjects)
				? linearProjects.find((p) => String(p.id || "") === selected)
				: null;
			// Shared-room guest: project may not be in local list but was
			// received via WebSocket (linearProjectByNote).
			if (!project && activeId) {
				const shared = linearProjectByNote.get(activeId);
				if (shared && String(shared.projectId || "") === selected) {
					project = { id: shared.projectId, name: shared.projectName || shared.projectId };
				}
			}
			if (!project) {
				toast(t("toast.linear_projects_failed"), "error");
				return;
			}
			setLinearProjectForNote(activeId, {
				projectId: project.id,
				projectName: project.name,
			});
			setLinearVisible(true);
			// Guest without API key: render from cached shared data instead
			// of calling Linear API directly.
			if (!linearApiKey && !readLinearApiKeyInput()) {
				renderLinearTasks(activeId);
				return;
			}
			void fetchLinearTasksForProject(activeId, project.id);
		});
	}

	if (linearRefreshBtn) {
		linearRefreshBtn.addEventListener("click", () => {
			const activeId = getLinearNoteId();
			const current = activeId ? linearProjectByNote.get(activeId) : null;
			if (!current || !current.projectId) {
				toast(t("toast.linear_select_project"), "info");
				return;
			}
			// Guest without API key: request fresh state from server buffer
			// via WebSocket instead of calling Linear API directly.
			if (!linearApiKey && !readLinearApiKeyInput()) {
				if (ws && ws.readyState === WebSocket.OPEN) {
					sendMessage({ type: "request_state", room, clientId, ts: Date.now() });
				}
				return;
			}
			void fetchLinearTasksForProject(activeId, current.projectId);
		});
	}

	if (excalidrawDragHandle && excalidrawEmbed) {
		let excalidrawDragState = null;
		const endExcalidrawDrag = (ev) => {
			if (!excalidrawDragState) return;
			try {
				excalidrawDragHandle.releasePointerCapture(
					excalidrawDragState.pointerId
				);
			} catch {
				// ignore
			}
			window.removeEventListener("pointermove", onExcalidrawDragMove);
			window.removeEventListener("pointerup", endExcalidrawDrag);
			window.removeEventListener("pointercancel", endExcalidrawDrag);
			excalidrawEmbed.classList.remove("excalidraw-dragging");
			const activeNoteId = getExcalidrawNoteId();
			storeExcalidrawOffsetForNote(activeNoteId, excalidrawOffset);
			excalidrawDragState = null;
		};

		const onExcalidrawDragMove = (ev) => {
			if (!excalidrawDragState) return;
			const dx = Number(ev.clientX || 0) - excalidrawDragState.startX;
			const dy = Number(ev.clientY || 0) - excalidrawDragState.startY;
				const rawNext = {
					x: excalidrawDragState.baseX + dx,
					y: excalidrawDragState.baseY + dy,
				};
				const next = clampExcalidrawOffsetToMirror(rawNext, excalidrawDragState);
				applyExcalidrawOffset(next);
		};

		excalidrawDragHandle.addEventListener("pointerdown", (ev) => {
			if (!excalidrawVisible) return;
			ev.preventDefault();
			excalidrawDragState = {
				startX: Number(ev.clientX || 0),
				startY: Number(ev.clientY || 0),
				baseX: Number(excalidrawOffset.x || 0),
				baseY: Number(excalidrawOffset.y || 0),
				pointerId: ev.pointerId,
					mirrorRect: textarea ? textarea.getBoundingClientRect() : null,
					baseRect: excalidrawEmbed.getBoundingClientRect(),
			};
			excalidrawEmbed.classList.add("excalidraw-dragging");
			try {
				excalidrawDragHandle.setPointerCapture(ev.pointerId);
			} catch {
				// ignore
			}
			window.addEventListener("pointermove", onExcalidrawDragMove);
			window.addEventListener("pointerup", endExcalidrawDrag);
			window.addEventListener("pointercancel", endExcalidrawDrag);
		});
	}

	if (excelDragHandle && excelEmbed) {
		let excelDragState = null;
		const endExcelDrag = (ev) => {
			if (!excelDragState) return;
			try {
				excelDragHandle.releasePointerCapture(excelDragState.pointerId);
			} catch {
				// ignore
			}
			window.removeEventListener("pointermove", onExcelDragMove);
			window.removeEventListener("pointerup", endExcelDrag);
			window.removeEventListener("pointercancel", endExcelDrag);
			excelEmbed.classList.remove("excel-dragging");
			const activeNoteId = getExcelNoteId();
			storeExcelOffsetForNote(activeNoteId, excelOffset);
			excelDragState = null;
		};

		const onExcelDragMove = (ev) => {
			if (!excelDragState) return;
			const dx = Number(ev.clientX || 0) - excelDragState.startX;
			const dy = Number(ev.clientY || 0) - excelDragState.startY;
			const rawNext = {
				x: excelDragState.baseX + dx,
				y: excelDragState.baseY + dy,
			};
			const next = clampExcelOffsetToMirror(rawNext, excelDragState);
			applyExcelOffset(next);
		};

		excelDragHandle.addEventListener("pointerdown", (ev) => {
			if (!excelVisible) return;
			ev.preventDefault();
			excelDragState = {
				startX: Number(ev.clientX || 0),
				startY: Number(ev.clientY || 0),
				baseX: Number(excelOffset.x || 0),
				baseY: Number(excelOffset.y || 0),
				pointerId: ev.pointerId,
				mirrorRect: textarea ? textarea.getBoundingClientRect() : null,
				baseRect: excelEmbed.getBoundingClientRect(),
			};
			excelEmbed.classList.add("excel-dragging");
			try {
				excelDragHandle.setPointerCapture(ev.pointerId);
			} catch {
				// ignore
			}
			window.addEventListener("pointermove", onExcelDragMove);
			window.addEventListener("pointerup", endExcelDrag);
			window.addEventListener("pointercancel", endExcelDrag);
		});
	}

	if (linearDragHandle && linearEmbed) {
		let linearDragState = null;
		const endLinearDrag = (ev) => {
			if (!linearDragState) return;
			try {
				linearDragHandle.releasePointerCapture(linearDragState.pointerId);
			} catch {
				// ignore
			}
			window.removeEventListener("pointermove", onLinearDragMove);
			window.removeEventListener("pointerup", endLinearDrag);
			window.removeEventListener("pointercancel", endLinearDrag);
			linearEmbed.classList.remove("linear-dragging");
			const activeNoteId = getLinearNoteId();
			storeLinearOffsetForNote(activeNoteId, linearOffset);
			linearDragState = null;
		};

		const onLinearDragMove = (ev) => {
			if (!linearDragState) return;
			const dx = Number(ev.clientX || 0) - linearDragState.startX;
			const dy = Number(ev.clientY || 0) - linearDragState.startY;
			const rawNext = {
				x: linearDragState.baseX + dx,
				y: linearDragState.baseY + dy,
			};
			const next = clampLinearOffsetToMirror(rawNext, linearDragState);
			applyLinearOffset(next);
		};

		linearDragHandle.addEventListener("pointerdown", (ev) => {
			if (!linearVisible) return;
			ev.preventDefault();
			linearDragState = {
				startX: Number(ev.clientX || 0),
				startY: Number(ev.clientY || 0),
				baseX: Number(linearOffset.x || 0),
				baseY: Number(linearOffset.y || 0),
				pointerId: ev.pointerId,
				mirrorRect: textarea ? textarea.getBoundingClientRect() : null,
				baseRect: linearEmbed.getBoundingClientRect(),
			};
			linearEmbed.classList.add("linear-dragging");
			try {
				linearDragHandle.setPointerCapture(ev.pointerId);
			} catch {
				// ignore
			}
			window.addEventListener("pointermove", onLinearDragMove);
			window.addEventListener("pointerup", endLinearDrag);
			window.addEventListener("pointercancel", endLinearDrag);
		});
	}

	if (codeLangSelect) {
		try {
			const saved = localStorage.getItem("mirror_code_lang") || "";
			if (saved) codeLangSelect.value = saved;
			else codeLangSelect.value = "python";
			codeLangSelect.addEventListener("change", () => {
				// If we're inside a fenced code block, update its language tag.
				if (textarea) {
					const applied = setFencedCodeLanguage(
						String(codeLangSelect.value || "")
					);
					if (applied) {
						updateCodeLangOverlay();
						return;
					}
				}
				try {
					localStorage.setItem(
						"mirror_code_lang",
						String(codeLangSelect.value || "")
					);
				} catch {
					// ignore
				}
			});
		} catch {
			// ignore
		}
	}
	if (insertCodeBlockBtn) {
		insertCodeBlockBtn.addEventListener("click", () => {
			insertCodeBlock();
		});
	}
	if (tableMenuBtn) {
		tableMenuBtn.addEventListener("click", () => {
			openTableEditorFromCursor();
		});
	}
	if (selectionMenu) {
		selectionMenu.querySelectorAll("[data-selection-action]").forEach((btn) => {
			const handle = () => {
				const action = String(btn.getAttribute("data-selection-action") || "");
				applySelectionAction(action);
			};
			btn.addEventListener("pointerdown", (ev) => {
				if (ev) ev.preventDefault();
				btn.dataset.selectionHandled = "1";
				handle();
			});
			btn.addEventListener("click", () => {
				if (btn.dataset && btn.dataset.selectionHandled === "1") {
					btn.dataset.selectionHandled = "0";
					return;
				}
				handle();
			});
		});
	}

	document.addEventListener("click", (ev) => {
		const target = ev && ev.target ? ev.target : null;
		const btn = target && target.closest ? target.closest(".pw-toggle, .pw-copy") : null;
		if (!btn) return;
		const field = btn.closest ? btn.closest(".pw-field") : null;
		if (!field) return;
		try {
			ev.preventDefault();
			ev.stopPropagation();
		} catch {
			// ignore
		}
		if (btn.classList.contains("pw-toggle")) {
			togglePasswordField(field);
			return;
		}
		if (btn.classList.contains("pw-copy")) {
			const value = String(field.getAttribute("data-pw") || "");
			if (!value) return;
			copyTextToClipboard(value).then((ok) => {
				toast(
					ok ? "Passwort kopiert." : "Kopieren nicht verfügbar.",
					ok ? "success" : "error"
				);
			});
		}
	});

	document.addEventListener(
		"pointerenter",
		(ev) => {
			const target = ev && ev.target ? ev.target : null;
			const el = target && target.closest ? target.closest(".tab-tooltip") : null;
			if (!el) return;
			showTabTooltip(el);
		},
		true
	);

	document.addEventListener(
		"pointerleave",
		(ev) => {
			const target = ev && ev.target ? ev.target : null;
			const el = target && target.closest ? target.closest(".tab-tooltip") : null;
			if (!el) return;
			hideTabTooltip();
		},
		true
	);

	document.addEventListener("focusin", (ev) => {
		const target = ev && ev.target ? ev.target : null;
		const el = target && target.closest ? target.closest(".tab-tooltip") : null;
		if (!el) return;
		showTabTooltip(el);
	});

	document.addEventListener("focusout", (ev) => {
		const target = ev && ev.target ? ev.target : null;
		const el = target && target.closest ? target.closest(".tab-tooltip") : null;
		if (!el) return;
		hideTabTooltip();
	});

	window.addEventListener("scroll", hideTabTooltip, true);
	window.addEventListener("resize", hideTabTooltip);

	textarea.addEventListener("input", () => {
		metaLeft.textContent = "Typing…";
		const canSyncRoom = shouldSyncRoomContentNow();
		if (canSyncRoom) {
			if (isCrdtEnabled()) {
				updateCrdtFromTextarea();
			} else {
				scheduleSend();
			}
		}
		setTyping(true);
		scheduleTypingStop();
		scheduleSelectionSend();
		const tabNoteId = getRoomTabNoteIdForRoom(room, key);
		const activePsNoteId = getActiveRoomTabNoteId();
		if (canSyncRoom) {
			updateRoomTabTextLocal(room, key, textarea.value);
			if (tabNoteId) updateLocalNoteText(tabNoteId, textarea.value);
		}
		if (activePsNoteId && activePsNoteId !== tabNoteId) {
			updateLocalNoteText(activePsNoteId, textarea.value);
		}
		schedulePsListRerender();
		if (canSyncRoom) {
			scheduleRoomTabSync({
				room,
				key,
				text: resolveRoomTabSnapshotText(
					tabNoteId,
					String(textarea.value || "")
				),
				lastUsed: Date.now(),
			});
		}
		updatePreview();
		updateCommentOverlay();
		updateSlashMenu();
		updateWikiMenu();
		updateCodeLangOverlay();
		updateTableMenuVisibility();
		updateSelectionMenu();
		updateEditorMetaScroll();
		schedulePsAutoSave();
	});

	textarea.addEventListener("click", () => {
		updateSlashMenu();
		updateWikiMenu();
		updateCodeLangOverlay();
		updateTableMenuVisibility();
		updateSelectionMenu();
		scheduleSelectionSend();
	});

	textarea.addEventListener("focus", () => {
		updateCodeLangOverlay();
		updateTableMenuVisibility();
		scheduleSelectionSend();
	});

	textarea.addEventListener("blur", () => {
		setTyping(false);
	});

	textarea.addEventListener("scroll", () => {
		updateSlashMenu();
		updateSelectionMenu();
		updateEditorMetaScroll();
		syncAttributionOverlayScroll();
		syncCommentOverlayScroll();
		syncCursorOverlayScroll();
	});

	textarea.addEventListener("keyup", () => {
		updateCodeLangOverlay();
		updateTableMenuVisibility();
		updateWikiMenu();
		updateSelectionMenu();
		scheduleSelectionSend();
	});

	textarea.addEventListener("keydown", (ev) => {
		if (handleWikiMenuKey(ev)) return;
		if (handleSlashMenuKey(ev)) return;
		if (!ev) return;
		if (ev.key !== "Enter") return;
		if (ev.shiftKey || ev.metaKey || ev.ctrlKey || ev.altKey) return;
		const applied = applySlashCommand(textarea);
		if (!applied) return;
		ev.preventDefault();
		metaLeft.textContent = "Formatting";
		metaRight.textContent = nowIso();
		updatePreview();
		scheduleSend();
	});

	if (tableModalClose) {
		tableModalClose.addEventListener("click", () => setTableModalOpen(false));
	}
	if (tableModalCancel) {
		tableModalCancel.addEventListener("click", () => setTableModalOpen(false));
	}
	if (tableModalBackdrop) {
		tableModalBackdrop.addEventListener("click", () => {
			setTableModalOpen(false);
		});
	}
	if (tableModalApply) {
		tableModalApply.addEventListener("click", () => {
			const ok = applyTableEditorToTextarea();
			if (ok) setTableModalOpen(false);
		});
	}
	if (shareModeSelect) {
		shareModeSelect.addEventListener("change", () => {
			shareModalMode = shareModeSelect.value === "public" ? "public" : "private";
			if (shareModalMode === "private" && !key) {
				pendingRoomBootstrapText = String(textarea.value || "");
				key = randomKey();
				location.hash = buildShareHash(room, key);
			}
			updateShareModalLink();
		});
	}
	if (shareModalCopy) {
		shareModalCopy.addEventListener("click", async () => {
			markCurrentRoomShared();
			const href = String(
				shareModalLink && shareModalLink.value ? shareModalLink.value : ""
			);
			const ok = await copyTextToClipboard(href);
			toast(ok ? "Link copied." : "Copy not available.", ok ? "success" : "error");
		});
	}
	if (shareModalShare) {
		shareModalShare.addEventListener("click", async () => {
			markCurrentRoomShared();
			const href = String(
				shareModalLink && shareModalLink.value ? shareModalLink.value : ""
			);
			if (!href || !navigator.share) return;
			try {
				await navigator.share({
					title: "Mirror",
					text: "Mirror Link",
					url: href,
				});
				toast("Shared.", "success");
			} catch {
				// ignore
			}
		});
	}
	if (shareModalOpen) {
		shareModalOpen.addEventListener("click", () => {
			markCurrentRoomShared();
		});
	}
	if (shareModalClose) {
		shareModalClose.addEventListener("click", () => setShareModalOpen(false));
	}
	if (shareModalBackdrop) {
		shareModalBackdrop.addEventListener("click", () => setShareModalOpen(false));
	}
	window.addEventListener("keydown", (ev) => {
		if (!shareModal || shareModal.classList.contains("hidden")) return;
		if (ev && ev.key === "Escape") {
			ev.preventDefault();
			setShareModalOpen(false);
		}
	});
	if (noteShareModalCopy) {
		noteShareModalCopy.addEventListener("click", async () => {
			const text = String(noteSharePayload && noteSharePayload.text ? noteSharePayload.text : "");
			const ok = await copyTextToClipboard(text);
			toast(ok ? "Note copied." : "Copy not available.", ok ? "success" : "error");
		});
	}
	if (noteShareModalShare) {
		noteShareModalShare.addEventListener("click", async () => {
			const text = String(noteSharePayload && noteSharePayload.text ? noteSharePayload.text : "");
			const title = String(noteSharePayload && noteSharePayload.title ? noteSharePayload.title : "Mirror note");
			if (!text || !navigator.share) return;
			try {
				const url = noteShareModalShareUrl || undefined;
				await navigator.share({
					title,
					text,
					url,
				});
				toast("Shared.", "success");
			} catch {
				// ignore
			}
		});
	}
	if (noteShareModalClose) {
		noteShareModalClose.addEventListener("click", () =>
			setNoteShareModalOpen(false)
		);
	}
	if (noteShareModalBackdrop) {
		noteShareModalBackdrop.addEventListener("click", () =>
			setNoteShareModalOpen(false)
		);
	}
	window.addEventListener("keydown", (ev) => {
		if (!noteShareModal || noteShareModal.classList.contains("hidden")) return;
		if (ev && ev.key === "Escape") {
			ev.preventDefault();
			setNoteShareModalOpen(false);
		}
	});
	if (openUploadModalBtn) {
		openUploadModalBtn.addEventListener("click", () => openUploadModal());
	}
	if (uploadModalClose) {
		uploadModalClose.addEventListener("click", () => setUploadModalOpen(false));
	}
	if (uploadModalBackdrop) {
		uploadModalBackdrop.addEventListener("click", () =>
			setUploadModalOpen(false)
		);
	}
	if (uploadCancel) {
		uploadCancel.addEventListener("click", () => setUploadModalOpen(false));
	}
	if (uploadPickBtn && uploadFileInput) {
		uploadPickBtn.addEventListener("click", () => uploadFileInput.click());
	}
	if (uploadFileInput) {
		uploadFileInput.addEventListener("change", () => {
			const file = uploadFileInput.files
				? uploadFileInput.files[0]
				: null;
			if (!file) {
				uploadSelectedFile = null;
				updateUploadPreview(null);
				setUploadInsertDisabled(true);
				return;
			}
			if (!isAllowedUploadType(file)) {
				toast("Nur Bilder oder PDFs sind erlaubt.", "error");
				uploadSelectedFile = null;
				uploadFileInput.value = "";
				updateUploadPreview(null);
				setUploadInsertDisabled(true);
				return;
			}
			if (file.size > MAX_UPLOAD_BYTES) {
				toast("Datei zu groß (max. 8 MB).", "error");
				uploadSelectedFile = null;
				uploadFileInput.value = "";
				updateUploadPreview(null);
				setUploadInsertDisabled(true);
				return;
			}
			uploadSelectedFile = file;
			updateUploadPreview(file);
			setUploadInsertDisabled(false);
		});
	}
	if (uploadInsert) {
		uploadInsert.addEventListener("click", async () => {
			if (uploadBusy) return;
			if (!uploadSelectedFile) {
				toast("Bitte zuerst eine Datei auswählen.", "error");
				return;
			}
			if (!isAllowedUploadType(uploadSelectedFile)) {
				toast("Nur Bilder oder PDFs sind erlaubt.", "error");
				return;
			}
			if (uploadSelectedFile.size > MAX_UPLOAD_BYTES) {
				toast("Datei zu groß (max. 8 MB).", "error");
				return;
			}
			uploadBusy = true;
			setUploadInsertDisabled(true, "Uploading...");
			try {
				const dataUrl = await readFileAsDataUrl(uploadSelectedFile);
				const payload = {
					filename: uploadSelectedFile.name,
					dataUrl,
					type: uploadSelectedFile.type,
					size: uploadSelectedFile.size,
				};
				const res = await api("/api/uploads", {
					method: "POST",
					body: JSON.stringify(payload),
				});
				const url = String(res && res.url ? res.url : "");
				if (!url) throw new Error("invalid_response");
				const markdown = buildUploadMarkdown(url, uploadSelectedFile);
				if (textarea) {
					insertTextAtCursor(textarea, markdown);
					updatePreview();
					scheduleSend();
					schedulePsAutoSave();
				}
				toast("Upload eingefügt.", "success");
				setUploadModalOpen(false);
			} catch (e) {
				const msg = e && e.message ? String(e.message) : "Upload fehlgeschlagen.";
				toast(`Upload fehlgeschlagen: ${msg}`, "error");
			} finally {
				uploadBusy = false;
				setUploadInsertDisabled(false);
			}
		});
	}
	window.addEventListener("keydown", (ev) => {
		if (!uploadModal || uploadModal.classList.contains("hidden")) return;
		if (ev && ev.key === "Escape") {
			ev.preventDefault();
			setUploadModalOpen(false);
		}
	});
	if (tableAddRowBtn) {
		tableAddRowBtn.addEventListener("click", () => {
			const cols = Math.max(1, tableEditorState.header.length || 1);
			const idx = Math.max(0, tableEditorState.activeCell.row || 0);
			tableEditorState.body.splice(
				Math.min(idx + 1, tableEditorState.body.length),
				0,
				Array.from({ length: cols }, () => "")
			);
			renderTableEditorGrid();
			updateTableCalculations();
		});
	}
	if (tableDelRowBtn) {
		tableDelRowBtn.addEventListener("click", () => {
			const idx = Math.max(0, tableEditorState.activeCell.row || 0);
			if (tableEditorState.body.length > 1) {
				tableEditorState.body.splice(
					Math.min(idx, tableEditorState.body.length - 1),
					1
				);
				if (tableEditorState.activeCell.row >= tableEditorState.body.length) {
					tableEditorState.activeCell.row = Math.max(
						0,
						tableEditorState.body.length - 1
					);
				}
			} else {
				tableEditorState.body[0] = tableEditorState.body[0].map(() => "");
			}
			renderTableEditorGrid();
			updateTableCalculations();
		});
	}
	if (tableAddColBtn) {
		tableAddColBtn.addEventListener("click", () => {
			const idx = Math.max(0, tableEditorState.activeCell.col || 0);
			tableEditorState.header.splice(
				Math.min(idx + 1, tableEditorState.header.length),
				0,
				"Header"
			);
			tableEditorState.aligns.splice(
				Math.min(idx + 1, tableEditorState.aligns.length),
				0,
				{ left: false, right: false }
			);
			tableEditorState.body = tableEditorState.body.map((row) => {
				const next = row.slice();
				next.splice(Math.min(idx + 1, next.length), 0, "");
				return next;
			});
			renderTableEditorGrid();
			updateTableCalculations();
		});
	}
	if (tableDelColBtn) {
		tableDelColBtn.addEventListener("click", () => {
			if (tableEditorState.header.length <= 1) return;
			const idx = Math.max(0, tableEditorState.activeCell.col || 0);
			tableEditorState.header.splice(
				Math.min(idx, tableEditorState.header.length - 1),
				1
			);
			tableEditorState.aligns.splice(
				Math.min(idx, tableEditorState.aligns.length - 1),
				1
			);
			tableEditorState.body = tableEditorState.body.map((row) => {
				const next = row.slice();
				next.splice(Math.min(idx, next.length - 1), 1);
				return next;
			});
			if (tableEditorState.activeCell.col >= tableEditorState.header.length) {
				tableEditorState.activeCell.col = Math.max(
					0,
					tableEditorState.header.length - 1
				);
			}
			renderTableEditorGrid();
			updateTableCalculations();
		});
	}
	if (tableCalcScope) {
		tableCalcScope.addEventListener("change", () => {
			updateTableCalculations();
		});
	}
	if (tableCalcIndex) {
		tableCalcIndex.addEventListener("input", () => {
			updateTableCalculations();
		});
	}
	if (tableInsertSum) {
		tableInsertSum.addEventListener("click", () => insertCalcResult("sum"));
	}
	if (tableInsertAvg) {
		tableInsertAvg.addEventListener("click", () => insertCalcResult("avg"));
	}
	if (tableInsertMax) {
		tableInsertMax.addEventListener("click", () => insertCalcResult("max"));
	}
	if (tableInsertMin) {
		tableInsertMin.addEventListener("click", () => insertCalcResult("min"));
	}
	window.addEventListener("keydown", (ev) => {
		if (!tableModal || tableModal.classList.contains("hidden")) return;
		if (ev && ev.key === "Escape") {
			ev.preventDefault();
			setTableModalOpen(false);
		}
	});
	document.addEventListener("selectionchange", () => {
		if (document.activeElement !== textarea) return;
		updateTableMenuVisibility();
		updateSelectionMenu();
		scheduleSelectionSend();
	});

	window.addEventListener("hashchange", () => {
		const parsed = parseRoomAndKeyFromHash();
		const nextRoom = parsed.room;
		const nextKey = parsed.key;
		if (!nextRoom) return;
		if (nextRoom === room && nextKey === key) return;
		/* ── Transition Manager: begin tab-switch (highest priority) ── */
		const tsGen = psTransition.begin("tab-switch");
		if (skipTabLimitCheck) {
			skipTabLimitCheck = false;
		} else {
			const tabs = loadRoomTabs();
			const exists = tabs.some(
				(t) => t.room === normalizeRoom(nextRoom) && t.key === normalizeKey(nextKey)
			);
			if (!exists && tabs.length >= MAX_ROOM_TABS) {
				const prevRoom = room;
				const prevKey = key;
				const modalPromise = showRoomTabLimitModal();
				if (modalPromise && modalPromise.then) {
					modalPromise.finally(() => {
						skipTabLimitCheck = true;
						location.hash = buildShareHash(prevRoom, prevKey);
					});
				} else {
					skipTabLimitCheck = true;
					location.hash = buildShareHash(prevRoom, prevKey);
				}
				if (tsGen) psTransition.end(tsGen);
				return;
			}
		}
		const suppressRestore =
			(pendingClosedTab &&
				pendingClosedTab.room === room &&
				pendingClosedTab.key === key) ||
			(skipStartupTabRestore &&
				skipStartupTabRestore.room === room &&
				skipStartupTabRestore.key === key);
		pendingClosedTab = null;
		skipStartupTabRestore = null;
		const canSyncPrev = isPinnedContentActiveForRoom(
			room,
			key,
			psEditingNoteId
		);
		if (textarea && !suppressRestore && canSyncPrev) {
			updateRoomTabTextLocal(room, key, textarea.value);
		}
		if (!suppressRestore && canSyncPrev) {
			flushRoomTabSync();
		}
		// Clear manual-unshare guard for old room so re-visiting works fresh
		manuallyUnsharedRooms.delete(`${normalizeRoom(room)}:${normalizeKey(key)}`);
		room = nextRoom;
		key = nextKey;
		resetE2eeKeyCache();
		lastAppliedRemoteTs = 0;
		lastLocalText = "";
		roomLabel.textContent = room;
		updateShareLink();
		syncExcalidrawForNote("");
		syncExcelForNote("");
		syncLinearForNote("");
		roomInput.value = room;
		saveRecentRoom(room);
		renderRecentRooms();
		updateFavoritesUI();
		touchRoomTab(room, key, { skipSync: true });
		renderRoomTabs();
		syncPermanentLinkToggleUi();
		/* Track whether the async path is active — only release lock after it settles */
		let asyncRefreshActive = false;
		if (textarea) {
			const cached = loadRoomTabs().find(
				(t) => t.room === room && t.key === key
			);
			const cachedNoteId = cached && cached.noteId ? String(cached.noteId || "") : "";
			const bound = findNoteRoomBindingByRoom(room, key);
			const boundNoteId = bound && bound.noteId ? String(bound.noteId || "") : "";
			const pinned = getRoomPinnedEntry(room, key);
			const pinnedNoteId = pinned && pinned.noteId ? String(pinned.noteId || "") : "";
			const pinnedText = pinned && !pinnedNoteId ? String(pinned.text || "") : "";
			const resolvedNoteId = pinnedNoteId || cachedNoteId || boundNoteId;
			if (pinnedNoteId && cachedNoteId !== pinnedNoteId) {
				setRoomTabNoteId(room, key, pinnedNoteId);
			}
			if (pinned && !pinnedNoteId && cachedNoteId) {
				setRoomTabNoteId(room, key, "");
			}
			if (!pinnedNoteId && !cachedNoteId && boundNoteId) {
				setRoomTabNoteId(room, key, boundNoteId);
			}
			const note = resolvedNoteId ? findNoteById(resolvedNoteId) : null;
			const cachedText =
				cached && typeof cached.text === "string" ? cached.text : "";
			const nextText = note
				? String(note.text || "")
				: !resolvedNoteId
					? pinnedText || cachedText || pendingRoomBootstrapText || ""
					: "";
			pendingRoomBootstrapText = "";
			if (note) {
				applyNoteToEditor(note, null, { skipHistory: true });
			} else {
				if (resolvedNoteId) {
					asyncRefreshActive = true;
					psEditingNoteId = resolvedNoteId;
					if (psMainHint) {
						psMainHint.classList.remove("hidden");
						psMainHint.textContent = "Loading…";
					}
					const targetRoom = room;
					const targetKey = key;
					void refreshPersonalSpace().then(() => {
						if (room !== targetRoom || key !== targetKey) {
							return;
						}
						const refreshed = findNoteById(resolvedNoteId);
						if (refreshed) {
							applyNoteToEditor(refreshed, null, { skipHistory: true });
						} else {
							// Note no longer exists on server — clear stale reference
							if (String(psEditingNoteId || "") === resolvedNoteId) {
								psEditingNoteId = "";
								psAutoSaveLastSavedNoteId = "";
								psAutoSaveLastSavedText = "";
								setPsAutoSaveStatus("");
							}
							setRoomTabNoteId(targetRoom, targetKey, "");
							applyPersonalSpaceFiltersAndRender();
						}
					}).catch((err) => {
						console.warn("[psTransition] async refresh in tab-switch failed:", err && err.message);
					}).finally(() => {
						if (tsGen) psTransition.end(tsGen);
					});
				} else {
					textarea.value = nextText;
				}
			}
			lastLocalText = textarea.value;
			metaLeft.textContent = note ? "Room geladen (Note)." : "Room geladen (lokal).";
			metaRight.textContent = "";
			updatePreview();
			updateCodeLangOverlay();
			updateTableMenuVisibility();
			updateSelectionMenu();
			void loadCommentsForRoom();
			if (!note && !resolvedNoteId) {
				const linked = syncPsEditingNoteFromEditorText(nextText, {
					clear: true,
					updateList: true,
				});
				if (linked && psEditingNoteId && !pinned) {
					setRoomTabNoteId(room, key, psEditingNoteId);
				}
			}
			if (resolvedNoteId && psEditingNoteId) {
				applyPersonalSpaceFiltersAndRender();
			}
		}
		if (!key) toast("Public room (no key).", "info");
		setTyping(false);
		presenceState.clear();
		updatePresenceUI();
		syncAiChatContext();
		connect();
		/* Release tab-switch lock unless async refresh is still running */
		if (!asyncRefreshActive && tsGen) psTransition.end(tsGen);
	});

	function refreshSyncOnFocus() {
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			connect();
			return;
		}
		if (isCrdtEnabled()) {
			sendMessage({ type: "doc_request", room, clientId, ts: Date.now() });
			return;
		}
		sendMessage({ type: "request_state", room, clientId, ts: Date.now() });
	}

	/* ── Personal Space: auto-refresh on visibility/focus + periodic polling ── */
	let psAutoRefreshTimer = null;
	let psLastRefreshTs = 0;
	const PS_REFRESH_DEBOUNCE_MS = 5000;  // min 5s between auto-refreshes
	const PS_POLL_INTERVAL_MS = 60000;    // poll every 60s

	function schedulePsAutoRefresh() {
		const now = Date.now();
		if (now - psLastRefreshTs < PS_REFRESH_DEBOUNCE_MS) return;
		if (offlineSyncInFlight) return; // Don't refresh while offline ops are replaying
		if (psRefreshPromise) return;   // Don't stack concurrent refreshes
		if (psTransition.isBlocked("refresh")) return; // Blocked by higher-prio transition
		psLastRefreshTs = now;
		if (psState && psState.authed) {
			void refreshPersonalSpace();
		}
	}

	function startPsPolling() {
		if (psAutoRefreshTimer) return;
		psAutoRefreshTimer = setInterval(() => {
			if (document.visibilityState !== "visible") return;
			if (typeof navigator !== "undefined" && navigator.onLine === false) return;
			schedulePsAutoRefresh();
		}, PS_POLL_INTERVAL_MS);
	}

	function stopPsPolling() {
		if (psAutoRefreshTimer) { clearInterval(psAutoRefreshTimer); psAutoRefreshTimer = null; }
	}

	window.addEventListener("visibilitychange", () => {
		if (document.visibilityState !== "visible") return;
		refreshSyncOnFocus();
		schedulePsAutoRefresh();
		/* ── Mobile: re-check inactivity on resume ── */
		if (isMobileViewport() && mobileAutoNoteSeconds > 0) {
			mobileAutoNoteChecked = false;
			maybeStartMobileAutoNoteSession();
		}
	});
	window.addEventListener("focus", () => {
		refreshSyncOnFocus();
		schedulePsAutoRefresh();
	});

	if (toggleHeaderBtn) {
		let headerCollapsed = isMobileViewport();
		setHeaderCollapsed(headerCollapsed);
		toggleHeaderBtn.addEventListener("click", () => {
			headerCollapsed = !headerCollapsed;
			setHeaderCollapsed(headerCollapsed);
		});
	}
	if (toggleCrdtMarksBtn) {
		toggleCrdtMarksBtn.addEventListener("click", () => {
			toggleCrdtMarks();
		});
	}

	// Initial
	setStatus("offline", "Offline");
	loadBuildStamp();
	connect();
	loadPsTagPrefs();
	loadPsTagsCollapsed();
	applyPsTagsCollapsed();
	loadPsSearchQuery();
	loadPsPinnedOnly();
	loadPsCommentsOnly();
	loadPsSavedQueries();
	loadPsNoteAccessed();
	loadPsSortMode();
	loadPsMetaVisible();
	loadPsVisible();
	applyPsVisible();
	renderThemeList();
	loadTheme();
	loadGlowEnabled();
	loadTaskAutoSortEnabled();
	loadDateFormatSetting();
	loadTimeFormatSetting();
	loadAiApiConfig();
	loadLinearApiConfig();
	loadLinearProjectsFromStorage();
	syncLinearForNote(getLinearNoteId());
	loadCrdtMarksStyle();
	loadCrdtMarksPreference();
	setCrdtMarksToggleUi();
	syncPermanentLinkToggleUi();

	// Personal Space wiring
	if (addPersonalSpaceBtn) {
		addPersonalSpaceBtn.addEventListener("click", requestPersonalSpaceLink);
	}
	if (psNavBackBtn) {
		psNavBackBtn.addEventListener("click", () => {
			navigatePsNoteHistory(-1);
		});
	}
	if (psNavForwardBtn) {
		psNavForwardBtn.addEventListener("click", () => {
			navigatePsNoteHistory(1);
		});
	}
	if (psNewNote) {
		psNewNote.addEventListener("click", async () => {
			const prevRoom = room;
			const prevKey = key;
			const prevNoteId = String(psEditingNoteId || "");
			const currentText = String(textarea && textarea.value ? textarea.value : "");
			const hasContent = Boolean(currentText.trim());
			const hasId = Boolean(psEditingNoteId);
			if (hasContent || hasId) {
				try {
					await savePersonalSpaceNote(currentText, { auto: false });
				} catch {
					// ignore save errors before creating a new note
				}
			}
			psEditingNoteId = "";
			psEditingNoteKind = "";
			psEditingNoteTags = [];
			const defaults = getDateTagsForTs(Date.now());
			psEditingNoteYearTag = defaults.year;
			psEditingNoteMonthTag = defaults.month;
			psEditingNoteCategory = "";
			psEditingNoteSubcategory = "";
			psEditingNoteTagsOverridden = false;
			psEditingNotePinned = false;
			psAutoSaveLastSavedNoteId = "";
			psAutoSaveLastSavedText = "";
			resetPsAutoSaveState();
			setPsAutoSaveStatus("");
			syncPsEditorTagsInput();
			try {
				const created = await savePersonalSpaceNote("", {
					auto: false,
					allowEmpty: true,
				});
				if (created && prevRoom && String(psEditingNoteId || "").trim()) {
					const canSyncRoom = isPinnedContentActiveForRoom(
						prevRoom,
						prevKey,
						psEditingNoteId
					);
					if (canSyncRoom) {
						setRoomTabNoteId(prevRoom, prevKey, psEditingNoteId);
					}
				} else if (prevRoom && prevNoteId) {
					const canSyncRoom = isPinnedContentActiveForRoom(
						prevRoom,
						prevKey,
						prevNoteId
					);
					if (canSyncRoom) {
						setRoomTabNoteId(prevRoom, prevKey, "");
					}
				}
			} catch {
				// ignore
			}
			if (textarea) {
				textarea.value = "";
				textarea.focus();
			}
			if (psMainHint) psMainHint.classList.add("hidden");
				if (psHint) setPsHintText("New note.");
			metaLeft.textContent = "Bereit.";
			metaRight.textContent = "";
			updatePreview();
			syncMobileFocusState();
		});
	}
	if (psEditorTagsInput) {
		psEditorTagsInput.addEventListener("input", () => {
			updatePsEditorTagsSuggest(true);
		});
		psEditorTagsInput.addEventListener("focus", () => {
			updatePsEditorTagsSuggest(true);
		});
		psEditorTagsInput.addEventListener("keydown", (ev) => {
			// Handle suggestions navigation
			if (psEditorTagsSuggestOpen && psEditorTagsSuggestItems.length) {
				if (ev.key === "ArrowDown") {
					ev.preventDefault();
					const next = Math.min(
						psEditorTagsSuggestItems.length - 1,
						psEditorTagsSuggestIndex + 1
					);
					psEditorTagsSuggestIndex = next;
					renderPsEditorTagsSuggest(psEditorTagsSuggestItems, next);
					return;
				}
				if (ev.key === "ArrowUp") {
					ev.preventDefault();
					const next = Math.max(0, psEditorTagsSuggestIndex - 1);
					psEditorTagsSuggestIndex = next;
					renderPsEditorTagsSuggest(psEditorTagsSuggestItems, next);
					return;
				}
				if (ev.key === "Tab") {
					const item = psEditorTagsSuggestItems[psEditorTagsSuggestIndex];
					if (item) {
						ev.preventDefault();
						applyPsEditorTagSuggestion(item);
					}
					return;
				}
				if (ev.key === "Enter") {
					const item = psEditorTagsSuggestItems[psEditorTagsSuggestIndex];
					if (item) {
						ev.preventDefault();
						applyPsEditorTagSuggestion(item);
						return;
					}
				}
				if (ev.key === "Escape") {
					ev.preventDefault();
					closePsEditorTagsSuggest();
					return;
				}
			}
			// Add tag on Enter when no suggestion selected
			if (ev.key === "Enter") {
				ev.preventDefault();
				addTagFromInput();
				return;
			}
			// Add tag on comma or space (common tag separators)
			if (ev.key === "," || ev.key === " ") {
				const val = String(psEditorTagsInput.value || "").trim();
				if (val) {
					ev.preventDefault();
					addTagFromInput();
				}
			}
		});
		psEditorTagsInput.addEventListener("blur", () => {
			if (psEditorTagsSyncing) return;
			// Add any remaining input as a tag on blur
			const val = String(psEditorTagsInput.value || "").trim();
			if (val) addTagFromInput();
			closePsEditorTagsSuggest();
		});
	}
	function attachPsTagPreviewHover(el) {
		// no-op: removed to prevent psHint flashing on every mouseover
	}
	attachPsTagPreviewHover(psEditorTagsBar);
	attachPsTagPreviewHover(psEditorTagsInput);
	attachPsTagPreviewHover(psEditorYearTag);
	attachPsTagPreviewHover(psEditorMonthTag);
	attachPsTagPreviewHover(psEditorCategoryTag);
	attachPsTagPreviewHover(psEditorSubcategoryTag);
	if (psEditorYearTag) {
		psEditorYearTag.addEventListener("input", () => {
			updatePsEditorTagMetaFromInputs();
		});
	}
	if (psEditorMonthTag) {
		psEditorMonthTag.addEventListener("change", () => {
			updatePsEditorTagMetaFromInputs();
		});
	}
	function openPsMetaTagSuggest(targetEl, tagPrefix) {
		if (!targetEl || !psEditorTagsSuggest) return;
		if (!psState || !psState.authed) return;
		psEditorTagsSuggestTarget = targetEl;
		const items = buildPsMetaTagSuggestItems(targetEl, tagPrefix);
		if (!items.length) {
			closePsEditorTagsSuggest();
			return;
		}
		renderPsEditorTagsSuggest(items, 0);
	}
	if (psEditorCategoryTag) {
		psEditorCategoryTag.addEventListener("input", () => {
			updatePsEditorTagMetaFromInputs();
			openPsMetaTagSuggest(psEditorCategoryTag, "cat:");
		});
		psEditorCategoryTag.addEventListener("focus", () => {
			openPsMetaTagSuggest(psEditorCategoryTag, "cat:");
		});
		psEditorCategoryTag.addEventListener("blur", () => {
			closePsEditorTagsSuggest();
		});
	}
	if (psEditorSubcategoryTag) {
		psEditorSubcategoryTag.addEventListener("input", () => {
			updatePsEditorTagMetaFromInputs();
			openPsMetaTagSuggest(psEditorSubcategoryTag, "sub:");
		});
		psEditorSubcategoryTag.addEventListener("focus", () => {
			openPsMetaTagSuggest(psEditorSubcategoryTag, "sub:");
		});
		psEditorSubcategoryTag.addEventListener("blur", () => {
			closePsEditorTagsSuggest();
		});
	}
	if (psEditorTagsSuggest) {
		psEditorTagsSuggest.addEventListener("mousedown", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-tag]");
			if (!btn) return;
			ev.preventDefault();
			ev.stopPropagation();
			const tag = String(btn.getAttribute("data-tag") || "");
			if (!tag) return;
			applyPsEditorTagSuggestion(tag);
		});
	}
	if (psSortMenuBtn && psSortMenu) {
		psSortMenuBtn.addEventListener("click", (ev) => {
			ev.preventDefault();
			const open = psSortMenu.classList.contains("hidden");
			setPsSortMenuOpen(open);
		});
		psSortMenu.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-sort]");
			if (!btn) return;
			const mode = normalizePsSortMode(btn.getAttribute("data-sort"));
			psSortMode = mode;
			savePsSortMode();
			syncPsSortMenu();
			setPsSortMenuOpen(false);
			applyPersonalSpaceFiltersAndRender();
		});
		document.addEventListener("click", (ev) => {
			if (psSortMenu.classList.contains("hidden")) return;
			const target = ev.target;
			if (!(target instanceof Node)) return;
			if (psSortMenu.contains(target) || psSortMenuBtn.contains(target)) return;
			setPsSortMenuOpen(false);
		});
		window.addEventListener("keydown", (ev) => {
			if (psSortMenu.classList.contains("hidden")) return;
			if (ev && ev.key === "Escape") {
				ev.preventDefault();
				setPsSortMenuOpen(false);
			}
		});
	}
	if (psMetaToggle) {
		psMetaToggle.addEventListener("click", () => {
			setPsMetaVisible(!psMetaVisible);
			savePsMetaVisible();
		});
	}
	if (psExportNotesBtn) {
		psExportNotesBtn.addEventListener("click", async () => {
			await exportPersonalSpaceNotes();
		});
	}
	if (psImportNotesBtn && psImportFileInput) {
		psImportNotesBtn.addEventListener("click", () => {
			const mode = String(
				psImportModeSelect && psImportModeSelect.value
					? psImportModeSelect.value
					: "merge"
			)
				.trim()
				.toLowerCase();
			(async () => {
				if (mode === "replace") {
					const ok = await modalConfirm(
						"Replace import deletes all existing notes. Continue?",
						{
							title: "Replace import",
							okText: "Replace",
							cancelText: "Cancel",
							danger: true,
							backdropClose: true,
						}
					);
					if (!ok) return;
				}
				startNotesImport(mode);
			})();
		});
		psImportFileInput.addEventListener("change", async () => {
			const file =
				psImportFileInput.files && psImportFileInput.files[0]
					? psImportFileInput.files[0]
					: null;
			if (!file) return;
			await importPersonalSpaceFile(file, psNextImportMode);
		});
	}
	if (psAutoBackupEnabledInput) {
		psAutoBackupEnabledInput.addEventListener("change", async () => {
			psAutoBackupEnabled = Boolean(psAutoBackupEnabledInput.checked);
			saveAutoBackupSettings();
			scheduleAutoBackup();
			if (psAutoBackupEnabled) await runAutoBackup();
			else setAutoBackupStatus("Auto-Backup deaktiviert.");
		});
	}
	if (psAutoBackupIntervalInput) {
		psAutoBackupIntervalInput.addEventListener("change", () => {
			psAutoBackupInterval = normalizeAutoInterval(
				psAutoBackupIntervalInput.value,
				"daily"
			);
			psAutoBackupIntervalInput.value = String(psAutoBackupInterval || "daily");
			saveAutoBackupSettings();
			scheduleAutoBackup();
		});
	}
	if (psAutoBackupFolderBtn) {
		psAutoBackupFolderBtn.addEventListener("click", async () => {
			await pickAutoBackupFolder();
		});
	}
	if (psAutoImportEnabledInput) {
		psAutoImportEnabledInput.addEventListener("change", async () => {
			psAutoImportEnabled = Boolean(psAutoImportEnabledInput.checked);
			saveAutoImportSettings();
			scheduleAutoImport();
			if (psAutoImportEnabled) await runAutoImport();
			else setAutoImportStatus("Auto-Import deaktiviert.");
		});
	}
	if (psAutoImportIntervalInput) {
		psAutoImportIntervalInput.addEventListener("change", () => {
			psAutoImportInterval = normalizeAutoInterval(
				psAutoImportIntervalInput.value,
				"daily"
			);
			psAutoImportIntervalInput.value = String(psAutoImportInterval || "daily");
			saveAutoImportSettings();
			scheduleAutoImport();
		});
	}
	if (psAutoImportFolderBtn) {
		psAutoImportFolderBtn.addEventListener("click", async () => {
			await pickAutoImportFolder();
		});
	}
	if (clearMirrorBtn && textarea) {
		clearMirrorBtn.addEventListener("click", () => {
			if (!textarea.value) return;
			(async () => {
				const ok = await modalConfirm("Clear the editor?", {
					title: "Clear text",
					okText: "Clear",
					cancelText: "Cancel",
					danger: true,
					backdropClose: true,
				});
				if (!ok) return;
				textarea.value = "";
				textarea.focus();
				metaLeft.textContent = "Cleared.";
				metaRight.textContent = nowIso();
				updatePreview();
				scheduleSend();
			})();
		});
	}

	function canAutoSavePsNote() {
		if (offlineSyncInFlight) return false;
		return Boolean(psState && psState.authed && textarea);
	}

	function buildCurrentPsTagsPayload() {
		const baseTags = Array.isArray(psEditingNoteTags) ? psEditingNoteTags : [];
		const systemTags = buildEditorSystemTags();
		const tagsWithPinned = psEditingNotePinned
			? [...baseTags, ...systemTags, PS_PINNED_TAG]
			: [...baseTags, ...systemTags];
		return buildPsTagsPayload(
			uniqTags(tagsWithPinned),
			psEditingNoteTagsOverridden
		);
	}

	async function savePersonalSpaceNote(text, opts) {
		const auto = Boolean(opts && opts.auto);
		const allowEmpty = Boolean(opts && opts.allowEmpty);
		const rawText = String(text || "");
		if (!allowEmpty && !rawText.trim()) return false;
		// --- Offline: save locally + enqueue ---
		if (typeof navigator !== "undefined" && navigator.onLine === false) {
			try {
				const tagsPayload = buildCurrentPsTagsPayload();
				const saved = await offlineSaveNote(psEditingNoteId, rawText, tagsPayload);
				if (saved && saved.id) {
					if (!psEditingNoteId || psEditingNoteId !== saved.id) {
						psEditingNoteId = saved.id;
					}
					// Update local psState.notes for UI
					if (psState && psState.notes) {
						const idx = psState.notes.findIndex((n) => String(n && n.id ? n.id : "") === saved.id);
						if (idx >= 0) psState.notes[idx] = saved;
						else psState.notes.unshift(saved);
						applyPersonalSpaceFiltersAndRender();
					}
				}
				if (auto) setPsAutoSaveStatus("Offline gespeichert");
				else { setPsAutoSaveStatus("Offline gespeichert"); toast(t("offline.saved_locally") || "Saved offline.", "info"); }
				psAutoSaveLastSavedNoteId = psEditingNoteId;
				psAutoSaveLastSavedText = rawText;
				return true;
			} catch (e) {
				console.warn("[offline] save failed:", e);
				if (auto) setPsAutoSaveStatus("Offline-Speichern fehlgeschlagen");
				return false;
			}
		}
		if (!psState || !psState.authed) {
			if (!auto)
				toast("Please enable Personal Space first (sign in).", "error");
			return false;
		}
		if (!auto && psSaveNoteInFlight) return false;
		if (!auto) psSaveNoteInFlight = true;
		try {
		const tagsPayload = buildCurrentPsTagsPayload();
		if (auto) setPsAutoSaveStatus("Speichern…");
		else if (psHint)
			setPsHintText(psEditingNoteId ? "Updating…" : "Saving…");
		let targetNoteId = String(psEditingNoteId || "").trim();
		let targetNoteKind = psEditingNoteKind;
		if (!targetNoteId && !allowEmpty) {
			const existing = findNoteByText(rawText);
			if (existing && existing.id) {
				targetNoteId = String(existing.id);
				targetNoteKind = String(existing.kind || "");
				psEditingNoteId = targetNoteId;
				psEditingNoteKind = targetNoteKind;
			}
		}
		if (auto && !targetNoteId) {
			setPsAutoSaveStatus("Auto-Save uebersprungen");
			return false;
		}
		if (!targetNoteId) {
			const res = await api("/api/notes", {
				method: "POST",
				body: JSON.stringify({
					text: allowEmpty ? "" : rawText,
					tags: tagsPayload,
					allowEmpty,
				}),
			});
			const saved = res && res.note ? res.note : null;
			if (saved && saved.id && psState && psState.authed) {
				saved.updatedAt = Date.now();
				saved.createdAt = Number(saved.createdAt || Date.now());
				psEditingNoteId = String(saved.id);
				psEditingNoteKind = String(saved.kind || "");
				const notes = Array.isArray(psState.notes) ? psState.notes : [];
				psState.notes = filterRealNotes([saved, ...notes]);
				applyPersonalSpaceFiltersAndRender();
				syncPsEditingNoteTagsFromState();
				updateEditorMetaYaml();
				if (!auto && room && key) {
					const canSyncRoom = isPinnedContentActiveForRoom(
						room,
						key,
						psEditingNoteId
					);
					if (canSyncRoom) {
						setRoomTabNoteId(room, key, psEditingNoteId);
					}
				}
				if (psMainHint) {
					psMainHint.classList.remove("hidden");
					psMainHint.textContent = "Editing active";
				}
			}
			psAutoSaveLastSavedNoteId = psEditingNoteId;
			psAutoSaveLastSavedText = rawText;
			updateRoomTabsForNoteId(psEditingNoteId, rawText);
			if (auto) setPsAutoSaveStatus("Automatisch gespeichert");
			else setPsAutoSaveStatus("Gespeichert");
			if (psHint) setPsHintText(auto ? "" : "Saved.");
			if (!auto) toast("Personal Space: saved.", "success");
			if (!auto) { psSaveNoteInFlight = false; await refreshPersonalSpace(); }
			return true;
		}

		const res = await api(`/api/notes/${encodeURIComponent(targetNoteId)}`, {
			method: "PUT",
			body: JSON.stringify({
				text: allowEmpty ? "" : rawText,
				tags: tagsPayload,
			}),
		});
		const saved = res && res.note ? res.note : null;
		if (saved && saved.id && psState && psState.authed) {
			saved.updatedAt = Date.now();
			const notes = Array.isArray(psState.notes) ? psState.notes : [];
			const id = String(saved.id);
			psState.notes = filterRealNotes([saved, ...notes.filter((n) => String(n && n.id ? n.id : "") !== id)]);
			applyPersonalSpaceFiltersAndRender();
			syncPsEditingNoteTagsFromState();
			updateEditorMetaYaml();
		}
		psEditingNoteId = targetNoteId;
		psEditingNoteKind = targetNoteKind;
		psAutoSaveLastSavedNoteId = targetNoteId;
		psAutoSaveLastSavedText = rawText;
		updateRoomTabsForNoteId(targetNoteId, rawText);
		if (auto) setPsAutoSaveStatus("Automatisch gespeichert");
		else setPsAutoSaveStatus("Gespeichert");
		if (psHint) setPsHintText(auto ? "" : "Updated.");
		if (!auto) toast("Personal Space: saved.", "success");
		if (!auto) { psSaveNoteInFlight = false; await refreshPersonalSpace(); }
		return true;
		} catch (e) {
			psSaveNoteInFlight = false;
			const errMsg = e && e.message ? String(e.message) : "";
			const is404 = errMsg.includes("404") || errMsg.includes("not_found");
			const is409 = errMsg.includes("409") || errMsg.includes("duplicate");
			if (is404 || is409) {
				// 404: Note deleted; 409: content already in another note — find it
				console.warn("[saveNote] " + (is404 ? "not found" : "duplicate") + ":", psEditingNoteId);
				const existing = findNoteByText(rawText);
				if (existing && existing.id && String(existing.id) !== String(psEditingNoteId || "")) {
					psEditingNoteId = String(existing.id);
					psEditingNoteKind = String(existing.kind || "");
					psAutoSaveLastSavedNoteId = psEditingNoteId;
					psAutoSaveLastSavedText = rawText;
					setPsAutoSaveStatus("Note zugeordnet");
					applyPersonalSpaceFiltersAndRender();
					return true;
				}
				if (is404) {
					psEditingNoteId = "";
					psEditingNoteKind = "";
					try {
						return await savePersonalSpaceNote(rawText, { auto, allowEmpty });
					} catch {
						return false;
					}
				}
				// 409 with no local match — content is saved, just accept
				psAutoSaveLastSavedText = rawText;
				setPsAutoSaveStatus("Gespeichert");
				return true;
			}
			// Network error fallback: save offline if the API call failed
			try {
				const tagsPayloadFb = buildCurrentPsTagsPayload();
				await offlineSaveNote(psEditingNoteId, rawText, tagsPayloadFb);
				if (auto) setPsAutoSaveStatus("Offline gespeichert");
				else { setPsAutoSaveStatus("Offline gespeichert"); toast(t("offline.saved_locally") || "Saved offline.", "info"); }
				psAutoSaveLastSavedNoteId = psEditingNoteId;
				psAutoSaveLastSavedText = rawText;
				return true;
			} catch {
				throw e;
			}
		}
	}

	async function savePersonalSpaceNoteSnapshot(noteId, text, tagsPayload) {
		const targetId = String(noteId || "").trim();
		const rawText = String(text || "");
		if (!targetId) return false;
		if (!rawText.trim()) return false;
		// --- Offline: save locally + enqueue ---
		if (typeof navigator !== "undefined" && navigator.onLine === false) {
			try {
				await offlineSaveNote(targetId, rawText, Array.isArray(tagsPayload) ? tagsPayload : []);
				if (String(psEditingNoteId || "").trim() === targetId) {
					psAutoSaveLastSavedNoteId = targetId;
					psAutoSaveLastSavedText = rawText;
					setPsAutoSaveStatus("Offline gespeichert");
				}
				return true;
			} catch (e) {
				console.warn("[offline] snapshot save failed:", e);
				if (String(psEditingNoteId || "").trim() === targetId) {
					setPsAutoSaveStatus("Offline-Speichern fehlgeschlagen");
				}
				return false;
			}
		}
		if (!psState || !psState.authed) return false;
		try {
			const res = await api(`/api/notes/${encodeURIComponent(targetId)}`, {
				method: "PUT",
				body: JSON.stringify({
					text: rawText,
					tags: Array.isArray(tagsPayload) ? tagsPayload : [],
				}),
			});
			const saved = res && res.note ? res.note : null;
			if (saved && saved.id && psState && psState.authed) {
				saved.updatedAt = Date.now();
				const notes = Array.isArray(psState.notes) ? psState.notes : [];
				const idx = notes.findIndex(
					(n) => String(n && n.id ? n.id : "") === targetId
				);
				psState.notes =
					idx >= 0
						? [...notes.slice(0, idx), saved, ...notes.slice(idx + 1)]
						: [saved, ...notes];
			}
			if (String(psEditingNoteId || "").trim() === targetId) {
				psAutoSaveLastSavedNoteId = targetId;
				psAutoSaveLastSavedText = rawText;
				setPsAutoSaveStatus("Automatisch gespeichert");
			}
			updateRoomTabsForNoteId(targetId, rawText);
			return true;
		} catch (err) {
			const errMsg = err && err.message ? String(err.message) : "";
			const is404 = errMsg.includes("404") || errMsg.includes("not_found");
			const is409 = errMsg.includes("409") || errMsg.includes("duplicate");
			if (is409) {
				// 409: content hash matches another note — note still exists, don't delete
				console.warn("[saveSnapshot] duplicate content, resolving:", targetId);
				const survivingNote = findNoteByText(rawText);
				if (survivingNote && survivingNote.id && String(survivingNote.id) !== targetId) {
					// Redirect to the existing note that owns this content
					if (String(psEditingNoteId || "").trim() === targetId) {
						psEditingNoteId = String(survivingNote.id);
						psAutoSaveLastSavedNoteId = psEditingNoteId;
						psAutoSaveLastSavedText = rawText;
						setPsAutoSaveStatus("Note zugeordnet");
					}
				} else {
					// Same note or no match — just accept, content is already saved
					psAutoSaveLastSavedNoteId = targetId;
					psAutoSaveLastSavedText = rawText;
					setPsAutoSaveStatus("Gespeichert");
				}
				return true;
			}
			if (is404) {
				// 404: Note deleted server-side — clean up
				console.warn("[saveSnapshot] not found, removing:", targetId);
				if (psState && Array.isArray(psState.notes)) {
					psState.notes = psState.notes.filter(
						(n) => String(n && n.id ? n.id : "") !== targetId
					);
				}
				if (String(psAutoSaveQueuedNoteId || "") === targetId) {
					psAutoSaveQueuedNoteId = "";
					psAutoSaveQueuedText = "";
					psAutoSaveQueuedTags = null;
				}
				const staleTab = findRoomTabByNoteId(targetId);
				if (staleTab) {
					setRoomTabNoteId(staleTab.room, staleTab.key, "");
				}
				if (String(psEditingNoteId || "").trim() === targetId) {
					psEditingNoteId = "";
					psAutoSaveLastSavedNoteId = "";
					psAutoSaveLastSavedText = "";
					setPsAutoSaveStatus("");
				}
				applyPersonalSpaceFiltersAndRender();
				return false;
			}
			// Network error fallback: save offline if the API call failed
			try {
				await offlineSaveNote(targetId, rawText, Array.isArray(tagsPayload) ? tagsPayload : []);
				if (String(psEditingNoteId || "").trim() === targetId) {
					psAutoSaveLastSavedNoteId = targetId;
					psAutoSaveLastSavedText = rawText;
					setPsAutoSaveStatus("Offline gespeichert");
				}
				return true;
			} catch {
				if (String(psEditingNoteId || "").trim() === targetId) {
					setPsAutoSaveStatus("Speichern fehlgeschlagen");
				}
				return false;
			}
		}
	}

	function schedulePsAutoSave() {
		if (!canAutoSavePsNote()) return;
		if (psAutoSaveInFlight && !psAutoSaveTimer) {
			resetPsAutoSaveState();
		}
		const text = String(textarea && textarea.value ? textarea.value : "");
		if (!text.trim()) return;
		let noteId = String(psEditingNoteId || "").trim();
		if (!noteId) {
			syncPsEditingNoteFromEditorText(text);
			noteId = String(psEditingNoteId || "").trim();
		}
		if (!noteId) return;
		const tagsPayload = buildCurrentPsTagsPayload();
		if (psAutoSaveLastSavedNoteId !== psEditingNoteId) {
			psAutoSaveLastSavedNoteId = psEditingNoteId;
			psAutoSaveLastSavedText = psEditingNoteId ? text : "";
		}
		if (text === psAutoSaveLastSavedText) return;
		psAutoSaveQueuedText = text;
		psAutoSaveQueuedNoteId = noteId;
		psAutoSaveQueuedTags = tagsPayload;
		if (psAutoSaveInFlight) {
			return;
		}
		if (psAutoSaveTimer) {
			window.clearTimeout(psAutoSaveTimer);
			psAutoSaveTimer = 0;
		}
		setPsAutoSaveStatus("Speichern…");
		psAutoSaveInFlight = true;
		psAutoSaveTimer = window.setTimeout(async () => {
			psAutoSaveTimer = 0;
			if (!canAutoSavePsNote()) {
				psAutoSaveInFlight = false;
				return;
			}
			const queuedText = String(psAutoSaveQueuedText || "");
			const queuedNoteId = String(psAutoSaveQueuedNoteId || "").trim();
			const currentNoteId = String(psEditingNoteId || "").trim();
			const queuedTags = psAutoSaveQueuedTags;
			psAutoSaveQueuedText = "";
			psAutoSaveQueuedNoteId = "";
			psAutoSaveQueuedTags = null;
			if (!queuedText.trim()) {
				psAutoSaveInFlight = false;
				return;
			}
			try {
				if (!queuedNoteId) {
					await savePersonalSpaceNote(queuedText, { auto: true });
				} else {
					await savePersonalSpaceNoteSnapshot(
						queuedNoteId,
						queuedText,
						queuedTags
					);
				}
			} catch {
				setPsAutoSaveStatus("Speichern fehlgeschlagen");
			} finally {
				psAutoSaveInFlight = false;
				if (
					psAutoSaveQueuedText &&
					psAutoSaveQueuedText !== psAutoSaveLastSavedText
				) {
					psAutoSaveQueuedText = "";
					schedulePsAutoSave();
				}
			}
		}, 0);
	}
	function initUiEventListeners() {
	if (psSaveMain) {
		psSaveMain.addEventListener("click", async () => {
			const text = String(
				textarea && textarea.value ? textarea.value : ""
			).trim();
			if (!text) return;
			try {
				await savePersonalSpaceNote(text, { auto: false });
			} catch (e) {
				if (psHint) setPsHintText("Not saved (sign in?).");
				setPsAutoSaveStatus("");
				const msg = e && e.message ? String(e.message) : "Error";
				toast(`Save failed: ${msg}`, "error");
			}
		});
	}
	if (togglePreview) {
		togglePreview.addEventListener("click", () => {
			setPreviewVisible(!previewOpen);
		});
	}
	if (toggleFullPreview) {
		toggleFullPreview.addEventListener("click", () => {
			if (!previewOpen) setPreviewVisible(true);
			setFullPreview(!fullPreview);
		});
	}
	if (toggleCommentsBtn) {
		toggleCommentsBtn.addEventListener("click", () => {
			setCommentPanelOpen(!commentPanelOpen);
		});
	}
	if (commentCloseBtn) {
		commentCloseBtn.addEventListener("click", () => {
			setCommentPanelOpen(false);
		});
	}
	if (commentAddBtn) {
		commentAddBtn.addEventListener("click", () => {
			void addCommentFromDraft();
		});
	}
	if (commentMdBoldBtn) {
		commentMdBoldBtn.addEventListener("click", () => {
			applyCommentMarkdown("bold");
		});
	}
	if (commentMdItalicBtn) {
		commentMdItalicBtn.addEventListener("click", () => {
			applyCommentMarkdown("italic");
		});
	}
	if (commentMdCodeBtn) {
		commentMdCodeBtn.addEventListener("click", () => {
			applyCommentMarkdown("code");
		});
	}
	if (commentInput) {
		commentInput.addEventListener("keydown", (e) => {
			if (!e) return;
			if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
				e.preventDefault();
				void addCommentFromDraft();
			}
		});
	}
	if (mdPreview) {
		mdPreview.addEventListener("load", () => {
			attachPreviewCheckboxWriteback();
		});
	}
	if (aiAssistBtn) {
		aiAssistBtn.addEventListener("click", async () => {
			if (aiDictationActive) stopAiDictation();
			await aiAssistFromPreview();
		});
	}
	if (clearRunOutputBtn) {
		clearRunOutputBtn.addEventListener("click", () => {
			setPreviewRunOutput({ status: "", output: "", error: "", source: "" });
		});
	}
	if (runOutputEl) {
		runOutputEl.addEventListener("click", async (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-ai-img-action]");
			if (!btn) return;
			const action = String(btn.getAttribute("data-ai-img-action") || "");
			const dataUri = previewRunState && previewRunState.imageDataUri ? String(previewRunState.imageDataUri) : "";
			if (!dataUri) return;
			const prompt = previewRunState && previewRunState.output ? String(previewRunState.output) : "flux-image";
			const safeName = prompt.replace(/[^a-z0-9äöü ]/gi, "").trim().replace(/\s+/g, "-").slice(0, 40) || "flux-image";

			if (action === "upload") {
				btn.disabled = true;
				btn.textContent = "⏳ " + t("ai.image.uploading");
				try {
					const res = await api("/api/uploads", {
						method: "POST",
						body: JSON.stringify({
							filename: safeName + ".jpg",
							dataUrl: dataUri,
							type: "image/jpeg",
							size: Math.round(dataUri.length * 0.75),
						}),
					});
					const url = String(res && res.url ? res.url : "");
					if (!url) throw new Error("invalid_response");
					previewRunState._uploadedUrl = url;
					btn.textContent = "✅ " + t("ai.image.saved");
					btn.disabled = true;
					toast(t("toast.ai_image_uploaded"), "success");
				} catch (e) {
					const msg = e && e.message ? String(e.message) : "Upload failed";
					btn.textContent = "📁 " + t("ai.image.save_upload");
					btn.disabled = false;
					toast(t("toast.ai_image_upload_failed") + ": " + msg, "error");
				}
				return;
			}

			if (action === "insert") {
				let url = previewRunState && previewRunState._uploadedUrl ? String(previewRunState._uploadedUrl) : "";
				if (!url) {
					btn.disabled = true;
					btn.textContent = "⏳ " + t("ai.image.uploading");
					try {
						const res = await api("/api/uploads", {
							method: "POST",
							body: JSON.stringify({
								filename: safeName + ".jpg",
								dataUrl: dataUri,
								type: "image/jpeg",
								size: Math.round(dataUri.length * 0.75),
							}),
						});
						url = String(res && res.url ? res.url : "");
						if (!url) throw new Error("invalid_response");
						previewRunState._uploadedUrl = url;
						const uploadBtn = runOutputEl.querySelector("[data-ai-img-action='upload']");
						if (uploadBtn) {
							uploadBtn.textContent = "✅ " + t("ai.image.saved");
							uploadBtn.disabled = true;
						}
					} catch (e) {
						const msg = e && e.message ? String(e.message) : "Upload failed";
						btn.textContent = "✏️ " + t("ai.image.insert_mirror");
						btn.disabled = false;
						toast(t("toast.ai_image_upload_failed") + ": " + msg, "error");
						return;
					}
				}
				if (textarea && url) {
					const markdown = "\n![" + safeName + "](" + url + ")\n";
					insertTextAtCursor(textarea, markdown);
					updatePreview();
					scheduleSend();
					schedulePsAutoSave();
					toast(t("toast.ai_image_inserted"), "success");
				}
				btn.textContent = "✅ " + t("ai.image.inserted");
				btn.disabled = true;
				return;
			}
		});
	}
	if (applyOutputReplaceBtn) {
		applyOutputReplaceBtn.addEventListener("click", () => {
			if (!textarea) return;
			if (
				String(
					previewRunState && previewRunState.source
						? previewRunState.source
						: ""
				) !== "ai"
			)
				return;
			const text = getPreviewRunCombinedText(previewRunState);
			if (!String(text || "").trim()) return;
			textarea.value = text;
			if (metaLeft) metaLeft.textContent = "AI output replaced editor.";
			if (metaRight) metaRight.textContent = nowIso();
			updatePreview();
			scheduleSend();
			toast("AI output applied (replaced).", "success");
		});
	}
	if (applyOutputAppendBtn) {
		applyOutputAppendBtn.addEventListener("click", () => {
			if (!textarea) return;
			if (
				String(
					previewRunState && previewRunState.source
						? previewRunState.source
						: ""
				) !== "ai"
			)
				return;
			const text = getPreviewRunCombinedText(previewRunState);
			if (!String(text || "").trim()) return;
			const base = String(textarea.value || "");
			const sep = base ? (base.endsWith("\n") ? "\n" : "\n\n") : "";
			textarea.value = base + sep + text;
			if (metaLeft) metaLeft.textContent = "AI output appended to editor.";
			if (metaRight) metaRight.textContent = nowIso();
			updatePreview();
			scheduleSend();
			toast("AI output applied (appended).", "success");
		});
	}
	window.addEventListener("resize", () => {
		updateRunOutputSizing();
		syncPsListHeight();
		syncMobileFocusState();
	});

	/* ── AI Conversation collapsible toggle (mobile) ── */
	const aiConversationHeader = document.getElementById("aiConversationHeader");
	const aiConversationBody = document.getElementById("aiConversationBody");
	const aiConversationChevron = document.getElementById("aiConversationChevron");
	if (aiConversationHeader && aiConversationBody) {
		aiConversationHeader.addEventListener("click", () => {
			const isCollapsed = aiConversationBody.classList.toggle("ai-collapsed");
			if (aiConversationChevron) aiConversationChevron.classList.toggle("ai-collapsed", isCollapsed);
			aiConversationHeader.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
		});
	}

	/* ── Tablet orientation change: force layout re-sync ── */
	if (window.matchMedia) {
		const orientationMq = window.matchMedia("(orientation: portrait)");
		const onOrientationChange = () => {
			syncMobileFocusState();
			syncPsListHeight();
			updateRunOutputSizing();
		};
		if (orientationMq.addEventListener) {
			orientationMq.addEventListener("change", onOrientationChange);
		} else if (orientationMq.addListener) {
			orientationMq.addListener(onOrientationChange);
		}
	}

	window.addEventListener("pagehide", () => {
		recordMobileLastActive();
	});
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) recordMobileLastActive();
	});
	if (aiPromptInput) {
		aiPromptInput.addEventListener("input", () => {
			// Don't persist every keystroke (privacy-ish); we persist on send.
		});
		aiPromptInput.addEventListener("keydown", (e) => {
			if (!e) return;
			if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				aiAssistFromPreview();
			}
		});
	}
	if (aiDictateBtn) {
		aiDictateBtn.addEventListener("click", async () => {
			if (!aiDictationAvailable) {
				toast(t("toast.dictation_failed"), "error");
				return;
			}
			if (aiDictationActive) {
				stopAiDictation();
				return;
			}
			await startAiDictation();
		});
	}
	if (aiUsePreviewBtn) {
		aiUsePreviewBtn.addEventListener("click", () => {
			saveAiUsePreview(!aiUsePreview);
			setAiUsePreviewUi(aiUsePreview);
			applyAiContextMode();
			syncAiChatContext();
		});
	}
	if (aiUseAnswerBtn) {
		aiUseAnswerBtn.addEventListener("click", () => {
			saveAiUseAnswer(!aiUseAnswer);
			setAiUseAnswerUi(aiUseAnswer);
		});
	}
	if (aiPromptClearBtn) {
		aiPromptClearBtn.addEventListener("click", () => {
			if (aiPromptInput) aiPromptInput.value = "";
			saveAiPrompt("");
			toast("AI prompt cleared.", "success");
		});
	}
	if (aiChatClearBtn) {
		aiChatClearBtn.addEventListener("click", () => {
			clearAiChatHistoryForContext();
		});
	}
	if (aiChatList) {
		aiChatList.addEventListener("click", (ev) => {
			const target = ev && ev.target ? ev.target : null;
			if (!target) return;
			const deleteBtn = target.closest
				? target.closest("[data-chat-delete=\"true\"]")
				: null;
			if (deleteBtn) {
				const id = deleteBtn.getAttribute("data-chat-id");
				deleteAiChatEntryById(id);
				return;
			}
			const item = target.closest
				? target.closest("[data-chat-id]")
				: null;
			if (!item) return;
			const id = item.getAttribute("data-chat-id");
			const entries = getAiChatEntriesForContext(aiChatContextKey);
			const entry = entries.find((e) => String(e.id || "") === String(id || ""));
			if (!entry) return;
			const parts = (Array.isArray(entry.items) ? entry.items : []).map((row) => {
				const isAi = String(row.role || "").toLowerCase() === "ai";
				const label = isAi ? t("preview.chat_ai") : t("preview.chat_you");
				return `${label}: ${String(row.text || "")}`.trim();
			});
			const output = parts.join("\n\n");
			setPreviewRunOutput({
				status: t("preview.chat_output"),
				output,
				error: "",
				source: "chat",
			});
		});
	}
	if (psLogout) {
		psLogout.addEventListener("click", async () => {
			try {
				await api("/api/logout", { method: "POST", body: "{}" });
				psActiveTags = new Set();
				savePsTagPrefs();
				toast("Signed out.", "success");
				await refreshPersonalSpace();
			} catch {
				toast("Sign out failed.", "error");
			}
		});
	}
	if (psTagFilterModeSelect) {
		psTagFilterModeSelect.addEventListener("change", async () => {
			const v = String(psTagFilterModeSelect.value || "and")
				.trim()
				.toLowerCase();
			psTagFilterMode = v === "or" ? "or" : "and";
			savePsTagPrefs();
			await refreshPersonalSpace();
		});
	}
	if (psSearchInput) {
		psSearchInput.addEventListener("input", () => {
			psSearchQuery = String(psSearchInput.value || "");
			applyPersonalSpaceFiltersAndRender();
			if (psSearchDebounceTimer) window.clearTimeout(psSearchDebounceTimer);
			psSearchDebounceTimer = window.setTimeout(() => {
				savePsSearchQuery();
			}, 150);
		});
	}

	/* ── Search-Help tooltip (? icon) ── */
	const psSearchHelpBtn = document.getElementById("psSearchHelp");
	if (psSearchHelpBtn) {
		let searchHelpTimer = null;
		let searchHelpEl = null;
		function showSearchHelp() {
			hideSearchHelp();
			const el = document.createElement("div");
			el.className = "ps-search-help-layer";
			const box = document.createElement("div");
			box.className = "ps-search-help-box";
			box.textContent = t("search.help");
			const arrow = document.createElement("div");
			arrow.className = "ps-search-help-arrow";
			el.appendChild(arrow);
			el.appendChild(box);
			document.body.appendChild(el);
			searchHelpEl = el;
			requestAnimationFrame(() => {
				if (!searchHelpEl) return;
				const searchInput = document.getElementById("psSearch");
				const anchor = searchInput ? searchInput.parentElement : psSearchHelpBtn;
				const rect = anchor.getBoundingClientRect();
				const bw = box.offsetWidth || 0;
				const bh = box.offsetHeight || 0;
				const gap = 8;
				let posLeft = rect.right + gap;
				let posTop = rect.top + rect.height / 2 - bh / 2;
				/* clamp to viewport */
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				if (posLeft + bw + 8 > vw) posLeft = rect.left - bw - gap;
				if (posTop < 8) posTop = 8;
				if (posTop + bh + 8 > vh) posTop = vh - bh - 8;
				el.style.left = `${posLeft}px`;
				el.style.top = `${posTop}px`;
				/* position arrow on the left edge, vertically centered on the anchor */
				const arrowTop = rect.top + rect.height / 2 - posTop;
				arrow.style.top = `${arrowTop}px`;
				el.classList.add("is-visible");
			});
		}
		function hideSearchHelp() {
			if (searchHelpTimer) { clearTimeout(searchHelpTimer); searchHelpTimer = null; }
			if (searchHelpEl) { searchHelpEl.remove(); searchHelpEl = null; }
		}
		psSearchHelpBtn.addEventListener("mouseenter", () => {
			searchHelpTimer = setTimeout(showSearchHelp, 350);
		});
		psSearchHelpBtn.addEventListener("mouseleave", hideSearchHelp);
		psSearchHelpBtn.addEventListener("click", (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
			if (searchHelpEl) { hideSearchHelp(); } else { showSearchHelp(); }
		});
	}

	/* ── Save Query Button ── */
	const psSaveQueryBtn = document.getElementById("psSaveQuery");
	if (psSaveQueryBtn) {
		psSaveQueryBtn.addEventListener("click", () => {
			const q = String(psSearchInput ? psSearchInput.value : "").trim();
			if (q) addSavedQuery(q);
		});
	}
	if (psSearchInput) {
		const updateSaveBtn = () => {
			if (!psSaveQueryBtn) return;
			const q = String(psSearchInput.value || "").trim();
			psSaveQueryBtn.style.display = q ? "" : "none";
		};
		psSearchInput.addEventListener("input", updateSaveBtn);
		updateSaveBtn();
	}

	/* Delegated pin/delete handler removed – per-row handlers in renderPsList
	   already handle these actions with stopPropagation, making the delegated
	   listener unreachable (dead code). */
	if (psContextMenu || psTagContextMenu) {
		document.addEventListener("click", (ev) => {
			if (!psContextMenuOpen && !psTagContextMenuOpen) return;
			const target = ev && ev.target ? ev.target : null;
			if (target && psContextMenu && psContextMenu.contains(target)) return;
			if (target && psTagContextMenu && psTagContextMenu.contains(target))
				return;
			if (psContextMenuOpen) closePsContextMenu();
			if (psTagContextMenuOpen) closePsTagContextMenu();
		});
		document.addEventListener("keydown", (ev) => {
			if (!psContextMenuOpen && !psTagContextMenuOpen) return;
			if (ev && ev.key === "Escape") {
				ev.preventDefault();
				if (psContextMenuOpen) closePsContextMenu();
				if (psTagContextMenuOpen) closePsTagContextMenu();
			}
		});
		window.addEventListener("scroll", () => {
			if (psContextMenuOpen) closePsContextMenu();
			if (psTagContextMenuOpen) closePsTagContextMenu();
		});
	}
	if (psContextSelect) {
		psContextSelect.addEventListener("click", () => {
			const id = String(psContextMenuTargetId || "");
			if (!id) return;
			setPsNoteSelected(id, !psSelectedNoteIds.has(id));
			closePsContextMenu();
		});
	}
	if (psContextSelectAll) {
		psContextSelectAll.addEventListener("click", () => {
			togglePsSelectAll();
			closePsContextMenu();
		});
	}
	if (psContextClear) {
		psContextClear.addEventListener("click", () => {
			clearPsSelection();
			closePsContextMenu();
		});
	}
	if (psContextTags) {
		psContextTags.addEventListener("click", async () => {
			const ids = getSelectedNoteIds();
			closePsContextMenu();
			if (!ids.length) return;
			const value = await modalPrompt("Tags setzen (Komma oder Leerzeichen getrennt).", {
				title: "Tags ändern",
				okText: "Übernehmen",
				cancelText: "Abbrechen",
				placeholder: "tag1, tag2",
			});
			if (value === null) return;
			const tags = normalizeManualTags(value);
			await applyBulkTagsToNotes(ids, tags);
			await refreshPersonalSpace();
			clearPsSelection();
		});
	}
	if (psContextShare) {
		psContextShare.addEventListener("click", () => {
			const selected = getSelectedNoteIds();
			const fallbackId = String(psContextMenuTargetId || "");
			closePsContextMenu();
			const ids = selected.length ? selected : fallbackId ? [fallbackId] : [];
			if (!ids.length) return;
			openNoteShareModal(ids);
		});
	}
	if (psContextDelete) {
		psContextDelete.addEventListener("click", async () => {
			const ids = getSelectedNoteIds();
			closePsContextMenu();
			if (!ids.length) return;
			const ok = await modalConfirm(
				`${ids.length} Notizen löschen? (Papierkorb)`,
				{
					title: "Mehrfach löschen",
					okText: "Löschen",
					cancelText: "Abbrechen",
					danger: true,
				}
			);
			if (!ok) return;
			await deleteBulkNotes(ids);
			await refreshPersonalSpace();
			clearPsSelection();
		});
	}
	if (psTagContextApply) {
		psTagContextApply.addEventListener("click", async () => {
			await applyPsTagContextInput();
		});
	}
	if (psTagContextDelete) {
		psTagContextDelete.addEventListener("click", async () => {
			if (!psTagContextMenuOpen) return;
			if (!psTagContextDeleteArmed) {
				psTagContextDeleteArmed = true;
				psTagContextDelete.textContent = "Löschen bestätigen";
				if (psTagContextDeleteTimer)
					window.clearTimeout(psTagContextDeleteTimer);
				psTagContextDeleteTimer = window.setTimeout(
					resetPsTagContextDelete,
					3000
				);
				return;
			}
			resetPsTagContextDelete();
			await confirmPsTagContextDelete();
		});
	}
	if (psTagContextInput) {
		psTagContextInput.addEventListener("keydown", async (ev) => {
			if (!ev) return;
			if (ev.key === "Enter") {
				ev.preventDefault();
				await applyPsTagContextInput();
			}
			if (ev.key === "Escape") {
				ev.preventDefault();
				closePsTagContextMenu();
			}
		});
	}
	if (psPinnedToggle) {
		psPinnedToggle.addEventListener("click", async () => {
			psPinnedOnly = !psPinnedOnly;
			savePsPinnedOnly();
			updatePsPinnedToggle();
			applyPersonalSpaceFiltersAndRender();
		});
	}
	if (psCommentsToggle) {
		psCommentsToggle.addEventListener("click", async () => {
			psCommentsOnly = !psCommentsOnly;
			savePsCommentsOnly();
			updatePsCommentsToggle();
			if (psCommentsOnly && !psCommentIndexLoaded) await loadPsCommentIndex();
			applyPersonalSpaceFiltersAndRender();
		});
	}
	if (togglePersonalSpaceBtn) {
		togglePersonalSpaceBtn.addEventListener("click", () => {
			if (isMobileViewport()) {
				// Mobile: always close editing note first if open
				if (psEditingNoteId) {
					clearPsEditingNoteState();
					resetPsAutoSaveState();
					psAutoSaveLastSavedNoteId = "";
					psAutoSaveLastSavedText = "";
					if (psMainHint) psMainHint.classList.add("hidden");
				}
				mobilePsOpen = !mobilePsOpen;
				if (mobilePsOpen && !psVisible) {
					psVisible = true;
					savePsVisible();
					applyPsVisible();
				}
				syncMobileFocusState();
				return;
			}
			psVisible = !psVisible;
			savePsVisible();
			applyPsVisible();
		});
	}
	if (psCloseMobile) {
		psCloseMobile.addEventListener("click", () => {
			mobilePsOpen = false;
			syncMobileFocusState();
		});
	}
	if (previewCloseMobile) {
		previewCloseMobile.addEventListener("click", () => {
			setPreviewVisible(false);
		});
	}
	if (noteCloseMobile) {
		noteCloseMobile.addEventListener("click", async () => {
			// Save current note if it has content before closing
			if (textarea && textarea.value && textarea.value.trim()) {
				try {
					await flushPendingPsAutoSave();
				} catch {
					// ignore save errors on close
				}
			}
			clearPsEditingNoteState();
			resetPsAutoSaveState();
			psAutoSaveLastSavedNoteId = "";
			psAutoSaveLastSavedText = "";
			psEditingNoteId = "";
			psEditingNoteKind = "";
			if (psMainHint) psMainHint.classList.add("hidden");
			if (textarea) textarea.value = "";
			mobilePsOpen = mobileNoteReturn === "ps";
			mobileNoteReturn = "editor";
			updatePreview();
			syncMobileFocusState();
		});
	}
	if (psToggleTags) {
		psToggleTags.addEventListener("click", () => {
			psTagsCollapsed = !psTagsCollapsed;
			savePsTagsCollapsed();
			applyPsTagsCollapsed();
		});
	}
	if (psSettingsBtn) {
		psSettingsBtn.addEventListener("click", () => {
			setSettingsOpen(true);
		});
	}
	if (settingsClose) {
		settingsClose.addEventListener("click", () => {
			setSettingsOpen(false);
		});
	}
	if (settingsBackdrop) {
		settingsBackdrop.addEventListener("click", () => {
			setSettingsOpen(false);
		});
	}
	settingsNavButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const target = btn.getAttribute("data-settings-nav") || "user";
			setActiveSettingsSection(target);
		});
	});
	if (settingsThemeList) {
		settingsThemeList.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-theme]");
			if (!btn) return;
			const themeName = btn.getAttribute("data-theme");
			if (!themeName) return;
			saveTheme(themeName);
		});
	}
	if (settingsGlowToggle) {
		settingsGlowToggle.addEventListener("click", () => {
			if (activeTheme === "monoLight" || activeTheme === "monoDark") return;
			saveGlowEnabled(!glowEnabled);
		});
	}
	if (taskAutoSortToggle) {
		taskAutoSortToggle.addEventListener("change", () => {
			saveTaskAutoSortEnabled(Boolean(taskAutoSortToggle.checked));
		});
	}
	if (settingsDateFormatSelect) {
		settingsDateFormatSelect.addEventListener("change", () => {
			saveDateFormatSetting(settingsDateFormatSelect.value);
		});
	}
	if (settingsTimeFormatSelect) {
		settingsTimeFormatSelect.addEventListener("change", () => {
			saveTimeFormatSetting(settingsTimeFormatSelect.value);
		});
	}
	if (uiLangDeBtn) {
		uiLangDeBtn.addEventListener("click", () => {
			setUiLanguage("de");
		});
	}
	if (uiLangEnBtn) {
		uiLangEnBtn.addEventListener("click", () => {
			setUiLanguage("en");
		});
	}
	if (mobileAutoNoteSecondsInput) {
		mobileAutoNoteSecondsInput.addEventListener("change", () => {
			saveMobileAutoNoteSeconds(mobileAutoNoteSecondsInput.value);
		});
	}
	if (calendarDefaultViewSelect) {
		calendarDefaultViewSelect.addEventListener("change", () => {
			saveCalendarDefaultView(calendarDefaultViewSelect.value);
		});
	}
	if (calendarAddBtn) {
		calendarAddBtn.addEventListener("click", () => {
			const name = String(calendarAddName ? calendarAddName.value : "").trim();
			const url = String(calendarAddUrl ? calendarAddUrl.value : "").trim();
			const color = String(
				calendarAddColor ? calendarAddColor.value : "#a855f7"
			).trim();
			const enabled = Boolean(calendarAddEnabled && calendarAddEnabled.checked);
			if (!url) {
				toast("Bitte eine ICS-URL angeben.", "error");
				return;
			}
			const list = loadCalendarSources();
			list.push(
				normalizeCalendarSource({
					id: createClientId(),
					name: name || "Kalender",
					url,
					color,
					enabled,
				})
			);
			saveCalendarSources(list);
			renderCalendarSettings();
			scheduleCalendarRefresh();
			if (calendarAddName) calendarAddName.value = "";
			if (calendarAddUrl) calendarAddUrl.value = "";
			if (calendarAddEnabled) calendarAddEnabled.checked = true;
		});
	}
	if (calendarSourcesList) {
		calendarSourcesList.addEventListener("input", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLInputElement)) return;
			const field = target.getAttribute("data-cal-field");
			if (field !== "name" && field !== "url") return;
			const row = target.closest("[data-cal-id]");
			if (!row) return;
			const id = row.getAttribute("data-cal-id");
			if (!id) return;
			const list = loadCalendarSources();
			const idx = list.findIndex((s) => s.id === id);
			if (idx < 0) return;
			list[idx] = { ...list[idx], [field]: target.value };
			saveCalendarSources(list);
			scheduleCalendarRefresh();
		});
		calendarSourcesList.addEventListener("change", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLInputElement)) return;
			const field = target.getAttribute("data-cal-field");
			if (field !== "color" && field !== "enabled") return;
			const row = target.closest("[data-cal-id]");
			if (!row) return;
			const id = row.getAttribute("data-cal-id");
			if (!id) return;
			const list = loadCalendarSources();
			const idx = list.findIndex((s) => s.id === id);
			if (idx < 0) return;
			const value =
				field === "enabled" ? target.checked : String(target.value || "");
			list[idx] = { ...list[idx], [field]: value };
			saveCalendarSources(list);
			scheduleCalendarRefresh();
		});
		calendarSourcesList.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-cal-remove]");
			if (!btn) return;
			const row = btn.closest("[data-cal-id]");
			if (!row) return;
			const id = row.getAttribute("data-cal-id");
			if (!id) return;
			const list = loadCalendarSources().filter((s) => s.id !== id);
			saveCalendarSources(list);
			renderCalendarSettings();
			scheduleCalendarRefresh();
		});
	}
	if (calendarViewButtons && calendarViewButtons.length) {
		calendarViewButtons.forEach((btn) => {
			btn.addEventListener("click", () => {
				const view = String(btn.getAttribute("data-calendar-view") || "month");
				if (!CALENDAR_VIEWS.includes(view)) return;
				calendarState.view = view;
				updateCalendarViewButtons();
				renderCalendarPanel();
			});
		});
	}
	if (calendarPrevBtn) {
		calendarPrevBtn.addEventListener("click", () => {
			moveCalendarCursor(-1);
		});
	}
	if (calendarNextBtn) {
		calendarNextBtn.addEventListener("click", () => {
			moveCalendarCursor(1);
		});
	}
	if (calendarTodayBtn) {
		calendarTodayBtn.addEventListener("click", () => {
			calendarState.cursor = new Date();
			renderCalendarPanel();
		});
	}
	if (calendarRefreshBtn) {
		calendarRefreshBtn.addEventListener("click", () => {
			refreshCalendarEvents(true);
		});
	}
	if (calendarSidebarToggle) {
		setCalendarSidebarCollapsed(calendarSidebarCollapsed);
		calendarSidebarToggle.addEventListener("click", () => {
			calendarSidebarCollapsed = !calendarSidebarCollapsed;
			setCalendarSidebarCollapsed(calendarSidebarCollapsed);
		});
	}
	if (calendarOpenSettingsBtn) {
		calendarOpenSettingsBtn.addEventListener("click", () => {
			openSettingsAt("calendar");
		});
	}
	if (calendarAddEventBtn) {
		calendarAddEventBtn.addEventListener("click", () => {
			openCalendarEventModal(calendarState.cursor || new Date());
		});
	}
	if (calendarEventClose) {
		calendarEventClose.addEventListener("click", () => {
			closeCalendarEventModal();
		});
	}
	if (calendarEventCancel) {
		calendarEventCancel.addEventListener("click", () => {
			closeCalendarEventModal();
		});
	}
	if (calendarEventBackdrop) {
		calendarEventBackdrop.addEventListener("click", () => {
			closeCalendarEventModal();
		});
	}
	document.addEventListener("keydown", (ev) => {
		if (!calendarEventModal) return;
		if (calendarEventModal.classList.contains("hidden")) return;
		if (ev && ev.key === "Escape") {
			ev.preventDefault();
			closeCalendarEventModal();
		}
	});
	if (calendarEventAllDay) {
		calendarEventAllDay.addEventListener("change", () => {
			updateCalendarEventTimeState();
		});
	}
	if (calendarEventSyncTarget) {
		calendarEventSyncTarget.addEventListener("change", () => {
			saveCalendarSyncTarget(calendarEventSyncTarget.value || "local");
			updateCalendarSyncTargetOptions();
		});
	}
	if (calendarEventSave) {
		calendarEventSave.addEventListener("click", async () => {
			const evt = buildLocalEventFromModal();
			if (!evt) return;
			closeCalendarEventModal();
			const syncTarget = calendarEventSyncTarget
				? String(calendarEventSyncTarget.value || "local")
				: "local";
			saveCalendarSyncTarget(syncTarget);
			if (syncTarget === "google") {
				if (!googleCalendarConnected) {
					toast("Google Kalender ist nicht verbunden.", "error");
				} else {
					try {
						const res = await createGoogleCalendarEvent(evt);
						if (res && res.eventId) {
							evt.googleEventId = String(res.eventId || "");
						}
					} catch (err) {
						const msg = err && err.message ? err.message : "";
						toast("Google Sync fehlgeschlagen" + (msg ? ": " + msg : "."), "error");
					}
				}
			}
			if (syncTarget === "outlook") {
				if (!outlookCalendarConnected) {
					toast("Outlook Kalender ist nicht verbunden.", "error");
				} else {
					try {
						const res = await createOutlookCalendarEvent(evt);
						if (res && res.eventId) {
							evt.outlookEventId = String(res.eventId || "");
						}
					} catch (err) {
						const msg = err && err.message ? err.message : "";
						toast("Outlook Sync fehlgeschlagen" + (msg ? ": " + msg : "."), "error");
					}
				}
			}
			addLocalCalendarEvent(evt);
		});
	}
	if (calendarGoogleConnect) {
		calendarGoogleConnect.addEventListener("click", () => {
			window.location.href = "/api/calendar/google/auth";
		});
	}
	if (calendarGoogleDisconnect) {
		calendarGoogleDisconnect.addEventListener("click", async () => {
			try {
				await api("/api/calendar/google/disconnect", { method: "POST" });
				setGoogleCalendarUi(false);
				toast("Google Kalender getrennt.", "success");
			} catch {
				toast("Trennen fehlgeschlagen.", "error");
			}
		});
	}
	if (calendarGoogleSelect) {
		calendarGoogleSelect.addEventListener("change", () => {
			saveCalendarGoogleId(calendarGoogleSelect.value || "primary");
		});
	}
	if (calendarOutlookConnect) {
		calendarOutlookConnect.addEventListener("click", () => {
			window.location.href = "/api/calendar/outlook/auth";
		});
	}
	if (calendarOutlookDisconnect) {
		calendarOutlookDisconnect.addEventListener("click", async () => {
			try {
				await api("/api/calendar/outlook/disconnect", { method: "POST" });
				setOutlookCalendarUi(false);
				toast("Outlook Kalender getrennt.", "success");
			} catch {
				toast("Trennen fehlgeschlagen.", "error");
			}
		});
	}
	if (calendarOutlookSelect) {
		calendarOutlookSelect.addEventListener("change", () => {
			saveCalendarOutlookId(calendarOutlookSelect.value || "primary");
		});
	}
	if (calendarLocalEventsList) {
		calendarLocalEventsList.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-local-event-remove]");
			if (!btn) return;
			const id = String(btn.getAttribute("data-local-event-id") || "");
			if (!id) return;
			const list = Array.isArray(calendarState.localEvents)
				? calendarState.localEvents.slice()
				: [];
			const idx = list.findIndex((evt) => evt.id === id);
			if (idx < 0) return;
			const [removed] = list.splice(idx, 1);
			saveLocalCalendarEvents(list);
			if (removed && removed.googleEventId && googleCalendarConnected) {
				deleteGoogleCalendarEvent(removed.googleEventId);
			}
			if (removed && removed.outlookEventId && outlookCalendarConnected) {
				deleteOutlookCalendarEvent(removed.outlookEventId);
			}
		});
	}
	if (calendarFreeToggle) {
		calendarFreeToggle.addEventListener("click", () => {
			saveCalendarFreeSlotsVisible(!calendarFreeSlotsVisible);
			renderCalendarPanel();
		});
	}
	if (calendarFreeSlots) {
		calendarFreeSlots.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const item = target.closest("[data-free-slot]");
			if (!item) return;
			const raw = String(item.getAttribute("data-free-slot") || "");
			const [startStr, endStr] = raw.split("|");
			if (!startStr || !endStr) return;
			const sMs = Number(startStr);
			const eMs = Number(endStr);
			if (!Number.isFinite(sMs) || !Number.isFinite(eMs)) return;
			// Compute all slot keys for this day so first toggle initializes correctly
			const cursor = calendarState.cursor || new Date();
			const events = getCalendarEvents();
			const allSlots = computeFreeSlotsForDay(cursor, events);
			const allSlotKeys = allSlots.map(([s, e]) => slotKey(s.getTime(), e.getTime()));
			toggleSlotSelection(cursor, sMs, eMs, allSlotKeys);
			renderCalendarPanel();
			broadcastAvailability();
		});
	}
	if (calendarCommonFreeToggle) {
		calendarCommonFreeToggle.addEventListener("click", () => {
			saveCommonFreeSlotsSharing(!commonFreeSlotsSharing);
			if (commonFreeSlotsSharing) {
				broadcastAvailability();
			}
			renderCommonFreeSlots();
		});
	}
	if (calendarGrid) {
		calendarGrid.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof Element)) return;
			// Don't toggle when clicking on an event itself
			if (target.closest(".calendar-event")) return;
			const cell = target.closest("[data-calendar-day]");
			if (!cell) return;
			const dk = cell.getAttribute("data-calendar-day");
			if (!dk) return;
			// Parse YYYY-MM-DD to Date
			const parts = dk.split("-");
			if (parts.length !== 3) return;
			const day = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
			if (Number.isNaN(day.getTime())) return;
			toggleDayAvailability(day);
			renderCalendarPanel();
			broadcastAvailability();
		});
	}
	if (calendarMySelections) {
		calendarMySelections.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const jumpBtn = target.closest("[data-my-sel-jump]");
			if (jumpBtn) {
				const dk = String(jumpBtn.getAttribute("data-my-sel-jump") || "");
				if (dk) jumpToCalendarDay(dk);
				return;
			}
			const row = target.closest("[data-my-sel-day]");
			if (row) {
				const dk = String(row.getAttribute("data-my-sel-day") || "");
				if (dk) jumpToCalendarDay(dk);
			}
		});
	}
	if (calendarCommonFreeSlots) {
		calendarCommonFreeSlots.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-common-book]");
			if (!btn) return;
			const raw = String(btn.getAttribute("data-common-book") || "");
			const [startStr, endStr] = raw.split("|");
			if (!startStr || !endStr) return;
			const startDate = new Date(startStr);
			const endDate = new Date(endStr);
			if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return;
			openCalendarEventModal(startDate, endDate);
		});
	}
	if (favoritesManageList) {
		favoritesManageList.addEventListener("click", (ev) => {
			const target = ev.target;
			// Allow SVG clicks as well (SVG elements are not HTMLElements)
			if (!(target instanceof Element)) return;
			const startupBtn = target.closest("[data-fav-startup]");
			if (startupBtn) {
				const roomName = startupBtn.getAttribute("data-fav-room") || "";
				const keyName = startupBtn.getAttribute("data-fav-key") || "";
				setStartupFavorite(roomName, keyName);
				return;
			}
			const btn = target.closest("[data-fav-remove]");
			if (!btn) return;
			const roomName = btn.getAttribute("data-fav-room") || "";
			const keyName = btn.getAttribute("data-fav-key") || "";
			removeFavorite(roomName, keyName);
		});
		favoritesManageList.addEventListener("change", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLInputElement)) return;
			const input = target.closest("[data-fav-text]");
			if (!input) return;
			const roomName = input.getAttribute("data-fav-room") || "";
			const keyName = input.getAttribute("data-fav-key") || "";
			updateFavoriteText(roomName, keyName, input.value);
		});
	}
	if (sharedRoomsManageList) {
		sharedRoomsManageList.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof Element)) return;
			const openBtn = target.closest("[data-shared-open]");
			if (openBtn) {
				const roomName = openBtn.getAttribute("data-shared-room") || "";
				const keyName = openBtn.getAttribute("data-shared-key") || "";
				goToRoomWithKey(roomName, keyName);
				return;
			}
			const removeBtn = target.closest("[data-shared-remove]");
			if (!removeBtn) return;
			const roomName = removeBtn.getAttribute("data-shared-room") || "";
			const keyName = removeBtn.getAttribute("data-shared-key") || "";
			removeSharedRoom(roomName, keyName);
		});
	}
	if (sharedRoomsFilterInput) {
		sharedRoomsFilterInput.addEventListener("input", () => {
			saveSharedRoomsFilterValue(sharedRoomsFilterInput.value);
			renderSharedRoomsManager();
		});
	}
	if (sharedRoomsClearBtn) {
		sharedRoomsClearBtn.addEventListener("click", async () => {
			const ok = await modalConfirm(t("settings.shared.clear_confirm"), {
				title: t("settings.shared.clear_title"),
				okText: t("settings.shared.clear_ok"),
				cancelText: t("settings.shared.clear_cancel"),
				danger: true,
			});
			if (!ok) return;
			await clearSharedRooms();
		});
	}
	if (uploadsRefreshBtn) {
		uploadsRefreshBtn.addEventListener("click", () => {
			loadUploadsManage();
		});
	}
	if (trashRefreshBtn) {
		trashRefreshBtn.addEventListener("click", () => {
			loadTrashManage();
		});
	}
	if (uploadsManageList) {
		uploadsManageList.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-upload-delete]");
			if (!btn) return;
			const name = btn.getAttribute("data-upload-name") || "";
			deleteUpload(name);
		});
	}
	if (trashManageList) {
		trashManageList.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-trash-restore]");
			if (!btn) return;
			const id = btn.getAttribute("data-trash-id") || "";
			restoreTrashNote(id);
		});
	}
	if (aiApiKeyInput) {
		aiApiKeyInput.addEventListener("focus", () => {
			if (aiApiKeyInput.value === "••••••••") aiApiKeyInput.value = "";
		});
	}
	if (linearApiKeyInput) {
		linearApiKeyInput.addEventListener("focus", () => {
			if (linearApiKeyInput.value === "••••••••") {
				linearApiKeyInput.value = "";
			}
		});
	}
	if (aiApiSaveBtn) {
		aiApiSaveBtn.addEventListener("click", () => {
			const nextKey = readAiApiKeyInput();
			const nextModel = normalizeAiModelInput(
				aiApiModelInput ? aiApiModelInput.value : ""
			);
			saveAiApiConfig(nextKey, nextModel);
			loadAiStatus();
			toast(t("toast.ai_saved"), "success");
		});
	}
	if (linearApiSaveBtn) {
		linearApiSaveBtn.addEventListener("click", async () => {
			const nextKey = readLinearApiKeyInput();
			await saveLinearApiKeyToServer(nextKey);
		});
	}
	if (aiApiClearBtn) {
		aiApiClearBtn.addEventListener("click", () => {
			saveAiApiConfig("", "");
			if (aiApiKeyInput) aiApiKeyInput.value = "";
			if (aiApiModelInput) aiApiModelInput.value = "";
			loadAiStatus();
			toast(t("toast.ai_cleared"), "success");
		});
	}
	if (linearApiClearBtn) {
		linearApiClearBtn.addEventListener("click", async () => {
			await saveLinearApiKeyToServer("");
			if (linearApiKeyInput) linearApiKeyInput.value = "";
		});
	}
	if (bflApiKeyInput) {
		bflApiKeyInput.addEventListener("focus", () => {
			if (bflApiKeyInput.value === "••••••••") bflApiKeyInput.value = "";
		});
	}
	if (bflApiSaveBtn) {
		bflApiSaveBtn.addEventListener("click", async () => {
			const nextKey = readBflApiKeyInput();
			await saveBflApiKeyToServer(nextKey);
		});
	}
	if (bflApiClearBtn) {
		bflApiClearBtn.addEventListener("click", async () => {
			await saveBflApiKeyToServer("");
			if (bflApiKeyInput) bflApiKeyInput.value = "";
		});
	}
	if (linearLoadProjectsBtn) {
		linearLoadProjectsBtn.addEventListener("click", () => {
			void fetchLinearProjectsFromApi();
		});
	}
	if (linearProjectsList) {
		linearProjectsList.addEventListener("change", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLInputElement)) return;
			const row = target.closest("[data-linear-project-id]");
			if (!row) return;
			const id = String(row.getAttribute("data-linear-project-id") || "");
			if (!id) return;
			if (target.checked) linearEnabledProjectIds.add(id);
			else linearEnabledProjectIds.delete(id);
			saveLinearProjectSelections();
		});
	}
	if (faqSearchInput) {
		faqSearchInput.addEventListener("input", () => {
			renderFaq();
		});
	}
	window.addEventListener("keydown", (ev) => {
		if (!settingsRoot || settingsRoot.classList.contains("hidden")) return;
		if (ev && ev.key === "Escape") {
			ev.preventDefault();
			setSettingsOpen(false);
		}
	});
	}
	initUiEventListeners();

	/* ── Global Keyboard Shortcuts ── */
	const MIRROR_SHORTCUTS = [
		{ id: "newNote",      keys: "Alt+N",              i18nLabel: "shortcuts.new_note",      i18nDesc: "shortcuts.new_note_desc" },
		{ id: "save",         keys: "Cmd/Ctrl+S",         i18nLabel: "shortcuts.save",          i18nDesc: "shortcuts.save_desc" },
		{ id: "settings",     keys: "Cmd/Ctrl+,",         i18nLabel: "shortcuts.settings",      i18nDesc: "shortcuts.settings_desc" },
		{ id: "preview",      keys: "Alt+P",              i18nLabel: "shortcuts.preview",        i18nDesc: "shortcuts.preview_desc" },
		{ id: "focusRoom",    keys: "Cmd/Ctrl+K",         i18nLabel: "shortcuts.focus_room",    i18nDesc: "shortcuts.focus_room_desc" },
		{ id: "copy",         keys: "Alt+C",              i18nLabel: "shortcuts.copy",           i18nDesc: "shortcuts.copy_desc" },
		{ id: "upload",       keys: "Alt+U",              i18nLabel: "shortcuts.upload",         i18nDesc: "shortcuts.upload_desc" },
	];

	const isMac = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent || "");

	function shortcutDisplayKey(raw) {
		return String(raw || "")
			.replace(/Cmd\/Ctrl/g, isMac ? "⌘" : "Ctrl")
			.replace(/Alt/g, isMac ? "⌥" : "Alt")
			.replace(/Shift/g, isMac ? "⇧" : "Shift");
	}

	function renderShortcutsList() {
		const container = document.getElementById("shortcutsList");
		if (!container) return;
		container.innerHTML = "";
		MIRROR_SHORTCUTS.forEach((sc) => {
			const row = document.createElement("div");
			row.className = "flex items-center justify-between gap-4 rounded-lg bg-white/5 px-3 py-2";
			const left = document.createElement("div");
			left.className = "min-w-0";
			const label = document.createElement("div");
			label.className = "text-sm font-medium text-slate-100";
			label.textContent = t(sc.i18nLabel);
			const desc = document.createElement("div");
			desc.className = "mt-0.5 text-xs text-slate-400";
			desc.textContent = t(sc.i18nDesc);
			left.appendChild(label);
			left.appendChild(desc);
			const kbd = document.createElement("kbd");
			kbd.className = "shrink-0 rounded-md bg-white/10 px-2 py-1 text-xs font-mono text-slate-200 whitespace-nowrap";
			kbd.textContent = shortcutDisplayKey(sc.keys);
			row.appendChild(left);
			row.appendChild(kbd);
			container.appendChild(row);
		});
	}

	window.addEventListener("keydown", (ev) => {
		if (!ev) return;
		const key = (ev.key || "").toLowerCase();
		const code = (ev.code || "");
		const mod = ev.metaKey || ev.ctrlKey;
		const alt = ev.altKey;
		const shift = ev.shiftKey;
		const tag = String((ev.target && ev.target.tagName) || "").toLowerCase();
		const isInput = tag === "input" || tag === "select";

		// Skip shortcuts when modal dialogs are open (except settings itself)
		if (modalRoot && !modalRoot.classList.contains("hidden")) return;

		// Alt+N → Neue Notiz (use ev.code because Alt produces special chars on macOS)
		if (alt && !mod && !shift && code === "KeyN") {
			ev.preventDefault();
			ev.stopPropagation();
			if (psNewNote) psNewNote.click();
			return;
		}

		// Cmd/Ctrl+S → Speichern
		if (mod && !alt && !shift && key === "s") {
			ev.preventDefault();
			if (psSaveMain && !psSaveMain.classList.contains("hidden")) {
				psSaveMain.click();
			} else {
				const text = String(textarea && textarea.value ? textarea.value : "").trim();
				if (text) {
					(async () => {
						try {
							await savePersonalSpaceNote(text, { auto: false });
							toast(t("toast.shortcut_saved"), "success");
						} catch { /* ignore */ }
					})();
				}
			}
			return;
		}

		// Cmd/Ctrl+, → Einstellungen
		if (mod && !alt && !shift && (key === "," || code === "Comma")) {
			ev.preventDefault();
			if (settingsOpen) {
				setSettingsOpen(false);
			} else {
				setSettingsOpen(true);
			}
			return;
		}

		// Alt+P → Preview toggle (use ev.code for macOS compatibility)
		if (alt && !mod && !shift && code === "KeyP" && !isInput) {
			ev.preventDefault();
			ev.stopPropagation();
			setPreviewVisible(!previewOpen);
			return;
		}

		// Cmd/Ctrl+K → Raum-Eingabe fokussieren
		if (mod && !alt && !shift && key === "k") {
			ev.preventDefault();
			if (roomInput) {
				roomInput.focus();
				roomInput.select();
			}
			return;
		}

		// Alt+C → Editor-Inhalt kopieren (use ev.code for macOS compatibility)
		if (alt && !mod && !shift && code === "KeyC" && !isInput) {
			ev.preventDefault();
			ev.stopPropagation();
			if (copyMirrorBtn) copyMirrorBtn.click();
			return;
		}

		// Alt+U → Upload-Dialog (use ev.code for macOS compatibility)
		if (alt && !mod && !shift && code === "KeyU" && !isInput) {
			ev.preventDefault();
			ev.stopPropagation();
			if (openUploadModalBtn) openUploadModalBtn.click();
			return;
		}
	}, true);  // capture phase – fires BEFORE textarea processes the key

	// Render shortcuts list when settings section is shown
	const _origSetActiveSettingsSection = setActiveSettingsSection;
	setActiveSettingsSection = function (next) {
		_origSetActiveSettingsSection(next);
		if (String(next || "") === "shortcuts") {
			renderShortcutsList();
		}
	};

	// Show a small post-verify hint
	try {
		const sp = new URLSearchParams(location.search);
		if (sp.get("ps") === "1") {
			toast(t("toast.ps_activated"), "success");
			sp.delete("ps");
			const next =
				location.pathname + (sp.toString() ? `?${sp}` : "") + location.hash;
			history.replaceState(null, "", next);
		}
	} catch {
		// ignore
	}

	/* ════════════════════════════════════════════════════════════════════════════════
	   BLOCK ARRANGE MODE
	   ════════════════════════════════════════════════════════════════════════════════ */

	const blockArrangeOverlay = document.getElementById("blockArrangeOverlay");
	const blockArrangeList = document.getElementById("blockArrangeList");
	const blockArrangeEmpty = document.getElementById("blockArrangeEmpty");
	const toggleBlockArrangeBtn = document.getElementById("toggleBlockArrange");
	const blockArrangeCloseBtn = document.getElementById("blockArrangeClose");
	const blockArrangeCancelBtn = document.getElementById("blockArrangeCancel");
	const blockArrangeApplyBtn = document.getElementById("blockArrangeApply");
	const blockArrangeUndoBtn = document.getElementById("blockArrangeUndo");
	const blockArrangeOutlineChk = document.getElementById("blockArrangeOutline");

	let blockArrangeOpen = false;
	let blockArrangeBlocks = [];
	let blockArrangeHistory = [];
	let blockArrangeSelectedIdx = -1;
	let blockArrangeOutlineOnly = false;

	/**
	 * Parse markdown text into blocks
	 */
	function parseMarkdownBlocks(text) {
		const lines = text.split("\n");
		const blocks = [];
		let i = 0;

		while (i < lines.length) {
			const line = lines[i];
			const trimmed = line.trim();

			// Skip empty lines
			if (!trimmed) {
				i++;
				continue;
			}

			// Headings
			const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
			if (headingMatch) {
				const level = headingMatch[1].length;
				blocks.push({
					type: `h${level}`,
					content: line,
					preview: headingMatch[2].trim(),
					startLine: i,
					endLine: i,
					level: level
				});
				i++;
				continue;
			}

			// Fenced code blocks
			if (trimmed.startsWith("```")) {
				const startLine = i;
				const codeLines = [line];
				const lang = trimmed.slice(3).trim();
				i++;
				while (i < lines.length && !lines[i].trim().startsWith("```")) {
					codeLines.push(lines[i]);
					i++;
				}
				if (i < lines.length) {
					codeLines.push(lines[i]);
					i++;
				}
				blocks.push({
					type: "code",
					content: codeLines.join("\n"),
					preview: lang ? `[${lang}] ${codeLines.length - 2} lines` : `${codeLines.length - 2} lines`,
					startLine: startLine,
					endLine: i - 1
				});
				continue;
			}

			// Tables (starts with |)
			if (trimmed.startsWith("|")) {
				const startLine = i;
				const tableLines = [line];
				i++;
				while (i < lines.length && lines[i].trim().startsWith("|")) {
					tableLines.push(lines[i]);
					i++;
				}
				const cols = (tableLines[0].match(/\|/g) || []).length - 1;
				const rows = tableLines.length;
				blocks.push({
					type: "table",
					content: tableLines.join("\n"),
					preview: `${rows}×${cols} table`,
					startLine: startLine,
					endLine: i - 1
				});
				continue;
			}

			// Blockquotes
			if (trimmed.startsWith(">")) {
				const startLine = i;
				const quoteLines = [line];
				i++;
				while (i < lines.length && lines[i].trim().startsWith(">")) {
					quoteLines.push(lines[i]);
					i++;
				}
			const preview = quoteLines.join("\n");
				blocks.push({
					type: "quote",
					content: quoteLines.join("\n"),
					preview: preview,
					startLine: startLine,
					endLine: i - 1
				});
				continue;
			}

			// Horizontal rules
			if (/^(---+|\*\*\*+|___+)$/.test(trimmed)) {
				blocks.push({
					type: "hr",
					content: line,
					preview: "───────",
					startLine: i,
					endLine: i
				});
				i++;
				continue;
			}

			// Lists (unordered, ordered, task)
			if (/^[-*+]\s|^\d+\.\s|^- \[[ x]\]/i.test(trimmed)) {
				const startLine = i;
				const listLines = [line];
				i++;
				while (i < lines.length) {
					const nextTrimmed = lines[i].trim();
					const isListItem = /^[-*+]\s|^\d+\.\s|^- \[[ x]\]/i.test(nextTrimmed);
					const isIndented = lines[i].startsWith("  ") || lines[i].startsWith("\t");
					if (!nextTrimmed || isListItem || isIndented) {
						if (!nextTrimmed) {
							// Check if next non-empty line is still a list
							let j = i + 1;
							while (j < lines.length && !lines[j].trim()) j++;
							if (j < lines.length && /^[-*+]\s|^\d+\.\s|^- \[[ x]\]/i.test(lines[j].trim())) {
								listLines.push(lines[i]);
								i++;
								continue;
							}
							break;
						}
						listLines.push(lines[i]);
						i++;
					} else {
						break;
					}
				}
			blocks.push({
				type: "list",
				content: listLines.join("\n"),
				preview: listLines.join("\n"),
					startLine: startLine,
					endLine: i - 1
				});
				continue;
			}

			// Paragraph (default)
			const startLine = i;
			const paraLines = [line];
			i++;
			while (i < lines.length) {
				const nextTrimmed = lines[i].trim();
				if (!nextTrimmed) break;
				if (/^#{1,6}\s|^```|^\||^>|^---+$|^\*\*\*+$|^___+$|^[-*+]\s|^\d+\.\s|^- \[[ x]\]/i.test(nextTrimmed)) break;
				paraLines.push(lines[i]);
				i++;
			}
			blocks.push({
				type: "paragraph",
				content: paraLines.join("\n"),
				preview: paraLines.join("\n"),
				startLine: startLine,
				endLine: i - 1
			});
		}

		return blocks;
	}

	/**
	 * Convert blocks back to markdown text
	 */
	function blocksToMarkdown(blocks) {
		return blocks.map(b => b.content).join("\n\n");
	}

	/**
	 * Render block items in the list
	 */
	function renderBlockArrangeItems() {
		if (!blockArrangeList) return;

		const displayBlocks = blockArrangeOutlineOnly
			? blockArrangeBlocks.filter(b => /^h[1-6]$/.test(b.type))
			: blockArrangeBlocks;

		if (!displayBlocks.length) {
			blockArrangeList.innerHTML = "";
			if (blockArrangeEmpty) blockArrangeEmpty.classList.remove("hidden");
			return;
		}

		if (blockArrangeEmpty) blockArrangeEmpty.classList.add("hidden");

		const badgeLabels = {
			h1: "H1", h2: "H2", h3: "H3", h4: "H4", h5: "H5", h6: "H6",
			code: "Code", list: "List", table: "Table", quote: "Quote", hr: "HR", paragraph: "P"
		};

		blockArrangeList.innerHTML = displayBlocks.map((block, idx) => {
			const actualIdx = blockArrangeOutlineOnly
				? blockArrangeBlocks.indexOf(block)
				: idx;
		const selected = actualIdx === blockArrangeSelectedIdx ? "selected" : "";
		const preview = escapeHtml(block.preview || block.content);
			const badge = badgeLabels[block.type] || block.type.toUpperCase();
			const indent = block.level ? `padding-left: ${(block.level - 1) * 1.25}rem;` : "";

			return `
				<div class="block-arrange-item ${selected}"
					 data-idx="${actualIdx}"
					 draggable="true"
					 tabindex="0"
					 style="${indent}">
					<span class="block-arrange-handle">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/>
							<circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/>
							<circle cx="5" cy="12" r="1.5"/><circle cx="11" cy="12" r="1.5"/>
						</svg>
					</span>
					<span class="block-arrange-badge" data-type="${block.type}">${badge}</span>
					<span class="block-arrange-preview">${preview}</span>
				</div>
			`;
		}).join("");

		// Re-attach drag handlers
		blockArrangeList.querySelectorAll(".block-arrange-item").forEach(item => {
			item.addEventListener("dragstart", handleBlockDragStart);
			item.addEventListener("dragend", handleBlockDragEnd);
			item.addEventListener("dragover", handleBlockDragOver);
			item.addEventListener("dragleave", handleBlockDragLeave);
			item.addEventListener("drop", handleBlockDrop);
			item.addEventListener("click", handleBlockClick);
			item.addEventListener("keydown", handleBlockKeydown);
		});
	}

	let draggedBlockIdx = -1;

	function handleBlockDragStart(e) {
		const item = e.currentTarget;
		draggedBlockIdx = parseInt(item.dataset.idx, 10);
		item.classList.add("dragging");
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/plain", draggedBlockIdx.toString());
	}

	function handleBlockDragEnd(e) {
		e.currentTarget.classList.remove("dragging");
		blockArrangeList.querySelectorAll(".block-arrange-item").forEach(el => {
			el.classList.remove("drag-over");
		});
		draggedBlockIdx = -1;
	}

	function handleBlockDragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		const item = e.currentTarget;
		const targetIdx = parseInt(item.dataset.idx, 10);
		if (targetIdx !== draggedBlockIdx) {
			item.classList.add("drag-over");
		}
	}

	function handleBlockDragLeave(e) {
		e.currentTarget.classList.remove("drag-over");
	}

	function handleBlockDrop(e) {
		e.preventDefault();
		const item = e.currentTarget;
		item.classList.remove("drag-over");
		const targetIdx = parseInt(item.dataset.idx, 10);
		if (draggedBlockIdx === -1 || draggedBlockIdx === targetIdx) return;

		moveBlock(draggedBlockIdx, targetIdx);
		draggedBlockIdx = -1;
	}

	function handleBlockClick(e) {
		const item = e.currentTarget;
		const idx = parseInt(item.dataset.idx, 10);
		blockArrangeSelectedIdx = idx;
		renderBlockArrangeItems();
		item.focus();
	}

	function handleBlockKeydown(e) {
		const item = e.currentTarget;
		const idx = parseInt(item.dataset.idx, 10);

		if (e.altKey && e.key === "ArrowUp") {
			e.preventDefault();
			if (idx > 0) moveBlock(idx, idx - 1);
		} else if (e.altKey && e.key === "ArrowDown") {
			e.preventDefault();
			if (idx < blockArrangeBlocks.length - 1) moveBlock(idx, idx + 1);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			const prev = blockArrangeList.querySelector(`[data-idx="${idx - 1}"]`);
			if (prev) {
				blockArrangeSelectedIdx = idx - 1;
				renderBlockArrangeItems();
				prev.focus();
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			const next = blockArrangeList.querySelector(`[data-idx="${idx + 1}"]`);
			if (next) {
				blockArrangeSelectedIdx = idx + 1;
				renderBlockArrangeItems();
				next.focus();
			}
		}
	}

	function moveBlock(fromIdx, toIdx) {
		// Save history for undo
		blockArrangeHistory.push(blockArrangeBlocks.map(b => ({ ...b })));
		if (blockArrangeUndoBtn) blockArrangeUndoBtn.disabled = false;

		// Perform move
		const [block] = blockArrangeBlocks.splice(fromIdx, 1);
		blockArrangeBlocks.splice(toIdx, 0, block);

		// Update selection
		blockArrangeSelectedIdx = toIdx;

		// Re-render with animation hint
		renderBlockArrangeItems();

		// Focus moved item
		setTimeout(() => {
			const movedEl = blockArrangeList.querySelector(`[data-idx="${toIdx}"]`);
			if (movedEl) movedEl.focus();
		}, 50);
	}

	function undoBlockArrange() {
		if (!blockArrangeHistory.length) return;
		blockArrangeBlocks = blockArrangeHistory.pop();
		if (blockArrangeUndoBtn) {
			blockArrangeUndoBtn.disabled = blockArrangeHistory.length === 0;
		}
		renderBlockArrangeItems();
	}

	function openBlockArrange() {
		if (!textarea || !blockArrangeOverlay) return;

		const text = textarea.value || "";
		blockArrangeBlocks = parseMarkdownBlocks(text);
		blockArrangeHistory = [];
		blockArrangeSelectedIdx = -1;

		if (blockArrangeUndoBtn) blockArrangeUndoBtn.disabled = true;

		renderBlockArrangeItems();

		blockArrangeOverlay.setAttribute("aria-hidden", "false");
		blockArrangeOpen = true;

		// Update translations
		const titleEl = blockArrangeOverlay.querySelector(".block-arrange-title");
		if (titleEl) titleEl.textContent = t("arrange.title");

		const hintEl = blockArrangeOverlay.querySelector(".block-arrange-hint");
		if (hintEl) hintEl.innerHTML = t("arrange.hint");

		const emptyEl = blockArrangeOverlay.querySelector("#blockArrangeEmpty span");
		if (emptyEl) emptyEl.textContent = t("arrange.empty");

		if (blockArrangeApplyBtn) blockArrangeApplyBtn.textContent = t("arrange.apply");
		if (blockArrangeCancelBtn) blockArrangeCancelBtn.textContent = t("arrange.cancel");
		if (blockArrangeUndoBtn) {
			const undoSpan = blockArrangeUndoBtn.querySelector("span");
			if (undoSpan) undoSpan.textContent = t("arrange.undo");
		}

		const outlineLabel = blockArrangeOverlay.querySelector("#blockArrangeOutline + span");
		if (outlineLabel) outlineLabel.textContent = t("arrange.outline");

		// Focus first item or list
		setTimeout(() => {
			const firstItem = blockArrangeList.querySelector(".block-arrange-item");
			if (firstItem) firstItem.focus();
			else blockArrangeList.focus();
		}, 100);
	}

	function closeBlockArrange(apply = false) {
		if (!blockArrangeOverlay) return;

		if (apply && textarea && blockArrangeBlocks.length) {
			const newText = blocksToMarkdown(blockArrangeBlocks);
			textarea.value = newText;
			textarea.dispatchEvent(new Event("input", { bubbles: true }));
		}

		blockArrangeOverlay.setAttribute("aria-hidden", "true");
		blockArrangeOpen = false;
		blockArrangeBlocks = [];
		blockArrangeHistory = [];
		blockArrangeSelectedIdx = -1;

		textarea.focus();
	}

	function initBlockArrange() {
		if (toggleBlockArrangeBtn) {
			toggleBlockArrangeBtn.addEventListener("click", () => {
				openBlockArrange();
			});
			toggleBlockArrangeBtn.title = t("arrange.toggle");
		}

		if (blockArrangeCloseBtn) {
			blockArrangeCloseBtn.addEventListener("click", () => {
				closeBlockArrange(false);
			});
		}

		if (blockArrangeCancelBtn) {
			blockArrangeCancelBtn.addEventListener("click", () => {
				closeBlockArrange(false);
			});
		}

		if (blockArrangeApplyBtn) {
			blockArrangeApplyBtn.addEventListener("click", () => {
				closeBlockArrange(true);
			});
		}

		if (blockArrangeUndoBtn) {
			blockArrangeUndoBtn.addEventListener("click", () => {
				undoBlockArrange();
			});
		}

		if (blockArrangeOutlineChk) {
			blockArrangeOutlineChk.addEventListener("change", () => {
				blockArrangeOutlineOnly = blockArrangeOutlineChk.checked;
				renderBlockArrangeItems();
			});
		}

		// Global keyboard shortcut: Cmd/Ctrl+Shift+A
		window.addEventListener("keydown", (e) => {
			if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "a") {
				e.preventDefault();
				if (blockArrangeOpen) {
					closeBlockArrange(false);
				} else {
					openBlockArrange();
				}
			}

			// Escape to close
			if (e.key === "Escape" && blockArrangeOpen) {
				e.preventDefault();
				closeBlockArrange(false);
			}

			// Cmd/Ctrl+Z for undo in arrange mode
			if (blockArrangeOpen && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
				e.preventDefault();
				undoBlockArrange();
			}

			// Alt+Arrow for moving blocks (global handler)
			if (blockArrangeOpen && e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
				e.preventDefault();
				const idx = blockArrangeSelectedIdx;
				if (idx < 0) {
					// No selection - select first item
					if (blockArrangeBlocks.length > 0) {
						blockArrangeSelectedIdx = 0;
						renderBlockArrangeItems();
						const firstEl = blockArrangeList.querySelector('[data-idx="0"]');
						if (firstEl) firstEl.focus();
					}
					return;
				}
				if (e.key === "ArrowUp" && idx > 0) {
					moveBlock(idx, idx - 1);
				} else if (e.key === "ArrowDown" && idx < blockArrangeBlocks.length - 1) {
					moveBlock(idx, idx + 1);
				}
			}

			// Arrow keys for navigation in arrange mode (without Alt)
			if (blockArrangeOpen && !e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
				const focused = document.activeElement;
				const isItemFocused = focused && focused.classList && focused.classList.contains("block-arrange-item");
				if (!isItemFocused && blockArrangeBlocks.length > 0) {
					e.preventDefault();
					let nextIdx = blockArrangeSelectedIdx;
					if (e.key === "ArrowUp") {
						nextIdx = nextIdx > 0 ? nextIdx - 1 : 0;
					} else {
						nextIdx = nextIdx < blockArrangeBlocks.length - 1 ? nextIdx + 1 : blockArrangeBlocks.length - 1;
					}
					if (nextIdx < 0) nextIdx = 0;
					blockArrangeSelectedIdx = nextIdx;
					renderBlockArrangeItems();
					const nextEl = blockArrangeList.querySelector(`[data-idx="${nextIdx}"]`);
					if (nextEl) nextEl.focus();
				}
			}
		});

		// Click outside list to deselect
		if (blockArrangeOverlay) {
			blockArrangeOverlay.addEventListener("click", (e) => {
				if (e.target === blockArrangeOverlay || e.target.classList.contains("block-arrange-list")) {
					blockArrangeSelectedIdx = -1;
					renderBlockArrangeItems();
				}
			});
		}
	}

	function initStartupTasks() {
		setupScrollbarReveal();
	initUiLanguage();
	loadMobileAutoNoteSeconds();
	void initAutoBackup();
	void initAutoImport();
	refreshPersonalSpace();
	startPsPolling();
	initAiDictation();
	loadAiPrompt();
	loadAiUsePreview();
	loadAiUseAnswer();
	applyAiContextMode();
	syncAiChatContext();
	setCommentDraftSelection(null);
	void loadCommentsForRoom();
	updateTableMenuVisibility();
	syncMobileFocusState();
	initBlockArrange();
	commonFreeSlotsSharing = loadCommonFreeSlotsSharing();
	applyCommonFreeToggleUI();
	manualFreeSlots = loadManualFreeSlots();
	cleanupOldManualSlots();
	}
	initStartupTasks();
})();
