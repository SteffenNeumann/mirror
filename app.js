// Minimalistische Echtzeit-Synchronisation.
// Für Produktion: eigenen WebSocket-Server oder einen Realtime-Provider einsetzen.
(function () {
	const textarea = document.getElementById("mirror");
	const statusDot = document.getElementById("statusDot");
	const statusText = document.getElementById("statusText");
	const roomLabel = document.getElementById("roomLabel");
	const buildStamp = document.getElementById("buildStamp");
	const shareLink = document.getElementById("shareLink");
	const copyLinkBtn = document.getElementById("copyLink");
	const wsHint = document.getElementById("wsHint");
	const roomInput = document.getElementById("roomInput");
	const roomOptions = document.getElementById("roomOptions");
	const joinRoomBtn = document.getElementById("joinRoom");
	const newRoomBtn = document.getElementById("newRoom");
	const favoritesSelect = document.getElementById("favoritesSelect");
	const toggleFavoriteBtn = document.getElementById("toggleFavorite");
	const roomTabs = document.getElementById("roomTabs");
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
	const runOutputEl = document.getElementById("runOutput");
	const runStatusEl = document.getElementById("runStatus");
	const runOutputTitleEl = document.getElementById("runOutputTitle");
	const runOutputIconEl = document.getElementById("runOutputIcon");
	const applyOutputReplaceBtn = document.getElementById("applyOutputReplace");
	const applyOutputAppendBtn = document.getElementById("applyOutputAppend");
	const aiPromptInput = document.getElementById("aiPrompt");
	const aiPromptClearBtn = document.getElementById("aiPromptClear");
	const aiUsePreviewBtn = document.getElementById("aiUsePreviewBtn");
	const aiUseAnswerBtn = document.getElementById("aiUseAnswerBtn");
	const aiModeWrap = document.getElementById("aiModeWrap");
	const aiPromptWrap = document.getElementById("aiPromptWrap");
	const copyMirrorBtn = document.getElementById("copyMirror");
	const codeLangWrap = document.getElementById("codeLangWrap");
	const codeLangSelect = document.getElementById("codeLang");
	const insertCodeBlockBtn = document.getElementById("insertCodeBlock");
	const slashMenu = document.getElementById("slashMenu");
	const slashMenuList = document.getElementById("slashMenuList");
	const wikiMenu = document.getElementById("wikiMenu");
	const wikiMenuList = document.getElementById("wikiMenuList");
	const selectionMenu = document.getElementById("selectionMenu");
	const mirrorMask = document.getElementById("mirrorMask");
	const mirrorMaskContent = document.getElementById("mirrorMaskContent");
	const attributionOverlay = document.getElementById("attributionOverlay");
	const attributionOverlayContent = document.getElementById(
		"attributionOverlayContent"
	);
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
	const psTagsPanel = document.getElementById("psTagsPanel");
	const psTags = document.getElementById("psTags");
	const psTagFilterModeSelect = document.getElementById("psTagFilterMode");
	const psNewNote = document.getElementById("psNewNote");
	const psEditorTagsBar = document.getElementById("psEditorTagsBar");
	const psEditorTagsInput = document.getElementById("psEditorTagsInput");
	const psEditorTagsSuggest = document.getElementById("psEditorTagsSuggest");
	const psExportNotesBtn = document.getElementById("psExportNotes");
	const psImportModeSelect = document.getElementById("psImportMode");
	const psImportNotesBtn = document.getElementById("psImportNotes");
	const psImportFileInput = document.getElementById("psImportFile");
	const psCount = document.getElementById("psCount");
	const psSearchInput = document.getElementById("psSearch");
	const psPinnedToggle = document.getElementById("psPinnedToggle");
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
	const settingsRoot = document.getElementById("settingsRoot");
	const settingsBackdrop = document.getElementById("settingsBackdrop");
	const settingsPanel = document.getElementById("settingsPanel");
	const settingsClose = document.getElementById("settingsClose");
	const settingsNavButtons = document.querySelectorAll("[data-settings-nav]");
	const settingsSections = document.querySelectorAll("[data-settings-section]");
	const settingsThemeSelect = document.getElementById("settingsTheme");
	const mobileAutoNoteSecondsInput = document.getElementById(
		"mobileAutoNoteSeconds"
	);
	const aiApiKeyInput = document.getElementById("aiApiKey");
	const aiApiModelInput = document.getElementById("aiApiModel");
	const aiApiSaveBtn = document.getElementById("aiApiSave");
	const aiApiClearBtn = document.getElementById("aiApiClear");
	const aiApiStatus = document.getElementById("aiApiStatus");
	const faqSearchInput = document.getElementById("faqSearch");
	const faqList = document.getElementById("faqList");
	const favoritesManageList = document.getElementById("favoritesManageList");
	const favoritesManageEmpty = document.getElementById("favoritesManageEmpty");
	const uploadsRefreshBtn = document.getElementById("uploadsRefresh");
	const uploadsManageList = document.getElementById("uploadsManageList");
	const uploadsManageEmpty = document.getElementById("uploadsManageEmpty");
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
	const calendarViewButtons = document.querySelectorAll("[data-calendar-view]");
	const psUserAuthed = document.getElementById("psUserAuthed");
	const psUserUnauthed = document.getElementById("psUserUnauthed");
	const bgBlobTop = document.getElementById("bgBlobTop");
	const bgBlobBottom = document.getElementById("bgBlobBottom");

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
		return {
			dataUrl: canvas.toDataURL("image/png"),
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
			const sha = parts[parts.length - 1];
			const datePart = String(parts[0] || "");
			const timePart = String(parts[1] || "");
			// Anzeige ohne Zeitzone: nur Uhrzeit (hh:mm)
			let hm = "";
			if (timePart.includes(":")) {
				hm = timePart.split(":").slice(0, 2).join(":");
			} else if (timePart.length >= 4) {
				hm = `${timePart.slice(0, 2)}:${timePart.slice(2, 4)}`;
			}
			let shortDate = "";
			const dateParts = datePart.split("-");
			if (dateParts.length === 3) {
				shortDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0].slice(
					-2
				)}`;
			}
			const formattedTs = shortDate && hm ? `${shortDate} ${hm}` : hm;
			const shortSha = sha ? sha.slice(0, 7) : "";
			// Subtil: kurze Anzeige, volle Infos im Tooltip.
			buildStamp.textContent =
				shortSha && formattedTs ? `${shortSha} - ${formattedTs}` : shortSha;
			buildStamp.title = line.trim();
		} catch {
			// ignore
		}
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

	async function api(path, opts) {
		const res = await fetch(path, {
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			...opts,
		});
		const text = await res.text();
		const data = safeJsonParse(text);
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
			throw new Error(msg);
		}
		return data;
	}

	function fmtDate(ts) {
		try {
			return new Date(ts).toLocaleString("de-DE", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return "";
		}
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
			if (!/^[a-z0-9_+\-]{1,48}$/i.test(s)) continue;
			out.push(s);
			if (out.length >= 24) break;
		}
		return Array.from(new Set(out));
	}

	function formatTagsForHint(tags) {
		const arr = Array.isArray(tags) ? tags : [];
		if (!arr.length) return "";
		return arr.map((t) => `#${t}`).join(" ");
	}

	function updatePsEditingTagsHint() {
		if (!psHint) return;
		const t = formatTagsForHint(psEditingNoteTags);
		if (!t) {
			const existing = String(psHint.textContent || "").trim();
			if (!existing) return;
			const cleaned = existing
				.replace(/\s*·\s*Tags:\s*[^·]+$/i, "")
				.replace(/^Tags:\s*.*$/i, "")
				.trim();
			if (cleaned !== existing) psHint.textContent = cleaned;
			return;
		}
		const tagPart = `Tags: ${t}`;
		const existing = String(psHint.textContent || "").trim();
		if (!existing) {
			psHint.textContent = tagPart;
			return;
		}
		if (/\bTags:\b/i.test(existing)) {
			psHint.textContent = tagPart;
			return;
		}
		psHint.textContent = `${existing} · ${tagPart}`;
	}

	let psEditorTagsSyncing = false;

	function formatTagsForEditor(tags) {
		const arr = Array.isArray(tags) ? tags : [];
		return arr.join(", ");
	}

	function setPsEditorTagsVisible(visible) {
		if (!psEditorTagsBar || !psEditorTagsBar.classList) return;
		psEditorTagsBar.classList.toggle("hidden", !visible);
	}

	function syncPsEditorTagsInput(force) {
		if (!psEditorTagsInput) return;
		try {
			if (!force && document && document.activeElement === psEditorTagsInput)
				return;
		} catch {
			// ignore
		}
		psEditorTagsSyncing = true;
		psEditorTagsInput.value = formatTagsForEditor(psEditingNoteTags);
		psEditorTagsSyncing = false;
	}

	let psEditorTagsSuggestOpen = false;
	let psEditorTagsSuggestItems = [];
	let psEditorTagsSuggestIndex = -1;

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
			const lower = raw.toLowerCase();
			if (existing.has(lower)) continue;
			if (prefix && !lower.startsWith(prefix)) continue;
			items.push(raw);
			if (items.length >= 8) break;
		}
		return items;
	}

	function closePsEditorTagsSuggest() {
		if (!psEditorTagsSuggest) return;
		psEditorTagsSuggestOpen = false;
		psEditorTagsSuggestItems = [];
		psEditorTagsSuggestIndex = -1;
		psEditorTagsSuggest.classList.add("hidden");
		psEditorTagsSuggest.innerHTML = "";
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

	function updatePsEditorTagsFromInput() {
		if (!psEditorTagsInput) return;
		if (psEditorTagsSyncing) return;
		const nextTags = normalizeManualTags(psEditorTagsInput.value);
		psEditingNoteTags = nextTags;
		psEditingNoteTagsOverridden = true;
		updatePsEditingTagsHint();
		updateEditingNoteTagsLocal(nextTags);
		schedulePsTagsAutoSave();
		updateEditorMetaYaml();
	}

	function applyPsEditorTagSuggestion(tag) {
		if (!psEditorTagsInput) return;
		const { value, start, end } = getPsEditorTagTokenBounds(psEditorTagsInput);
		const nextValue =
			value.slice(0, start) + String(tag || "") + value.slice(end);
		psEditorTagsInput.value = nextValue;
		const caret = start + String(tag || "").length;
		try {
			psEditorTagsInput.setSelectionRange(caret, caret);
		} catch {
			// ignore
		}
		updatePsEditorTagsFromInput();
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
		psEditingNoteTags = stripPinnedTag(stripManualTagsMarker(rawTags));
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
			title: "Slash commands",
			message:
				"/h1 /h2 /h3 · /b (bold) · /i (italic) · /s (strike) · /quote · /ul · /ol · /todo · /done · /tasks · /code [lang] · /link · /hr · /divider · /table · /table row+ · /table row- · /table col+ · /table col-",
			okText: "OK",
			cancelText: "Close",
			backdropClose: true,
		});
	}

	const SLASH_SUGGESTIONS = [
		{ cmd: "help", label: "Help", snippet: "/help" },
		{ cmd: "h1", label: "Heading 1", snippet: "/h1" },
		{ cmd: "h2", label: "Heading 2", snippet: "/h2" },
		{ cmd: "h3", label: "Heading 3", snippet: "/h3" },
		{ cmd: "b", label: "Bold", snippet: "/b" },
		{ cmd: "i", label: "Italic", snippet: "/i" },
		{ cmd: "s", label: "Strikethrough", snippet: "/s" },
		{ cmd: "quote", label: "Blockquote", snippet: "/quote" },
		{ cmd: "ul", label: "Bullet list", snippet: "/ul" },
		{ cmd: "ol", label: "Numbered list", snippet: "/ol" },
		{ cmd: "todo", label: "Task list", snippet: "/todo" },
		{ cmd: "done", label: "Task (checked)", snippet: "/done" },
		{ cmd: "tasks", label: "Task template", snippet: "/tasks" },
		{ cmd: "table", label: "Table", snippet: "/table" },
		{ cmd: "table", label: "Table (3x2)", snippet: "/table 3x2" },
		{ cmd: "table", label: "Table: row +", snippet: "/table row+" },
		{ cmd: "table", label: "Table: row -", snippet: "/table row-" },
		{ cmd: "table", label: "Table: col +", snippet: "/table col+" },
		{ cmd: "table", label: "Table: col -", snippet: "/table col-" },
		{ cmd: "hr", label: "Horizontal rule", snippet: "/hr" },
		{ cmd: "divider", label: "Divider", snippet: "/divider" },
		{ cmd: "link", label: "Link", snippet: "/link" },
		{ cmd: "code", label: "Code block", snippet: "/code" },
		{ cmd: "code", label: "Code block (js)", snippet: "/code javascript" },
		{ cmd: "code", label: "Code block (py)", snippet: "/code python" },
	];

	let slashMenuOpen = false;
	let slashMenuItems = [];
	let slashMenuIndex = 0;
	let wikiMenuOpen = false;
	let wikiMenuItems = [];
	let wikiMenuIndex = 0;
	let selectionMenuOpen = false;
	let psTagsAutoSaveTimer = null;
	let psNoteHistory = [];
	let psNoteHistoryIndex = -1;
	let psNoteHistorySkip = false;
	let psSelectedNoteIds = new Set();
	let psRenderedNoteIds = [];
	let psContextMenuOpen = false;
	let psContextMenuTargetId = "";
	let editorMaskDisabled = false;
	let crdtMarksEnabled = true;
	const EDITOR_MASK_DISABLED_KEY = "mirror_mask_disabled";
	const CRDT_MARKS_DISABLED_KEY = "mirror_crdt_marks_disabled";

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
		const parent = el.parentElement;
		if (!parent) return;
		const elRect = el.getBoundingClientRect();
		const parentRect = parent.getBoundingClientRect();
		const left = coords.left - el.scrollLeft + (elRect.left - parentRect.left);
		const top = coords.top - el.scrollTop + (elRect.top - parentRect.top);
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
		switch (action) {
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
			case "masktoggle":
				toggleEditorMaskView();
				schedulePsAutoSave();
				scheduleSend();
				return;
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
			case "sort":
				sortSelectionLines(textarea);
				break;
			default:
				return;
		}
		try {
			textarea.focus();
		} catch {
			// ignore
		}
		updatePreview();
		updatePasswordMaskOverlay();
		scheduleSend();
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
		positionFloatingMenu(selectionMenu, textarea, range.end, 10);
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
				'<div class="px-3 py-2 text-xs text-slate-400">No matches.</div>';
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
				const right =
					'<span class="text-[11px] text-slate-500">' +
					String(it.snippet || "") +
					"</span>";
				return (
					`<button type="button" data-slash-idx="${idx}" class="${base} ${cls}">` +
					`<span class="font-medium">${String(it.label || it.cmd)}</span>` +
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
		updatePasswordMaskOverlay();
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
	};
	let psActiveTags = new Set();
	let psTagFilterMode = "and";
	let psEditingNoteId = "";
	let psEditingNoteKind = "";
	let psEditingNoteTags = [];
	let psEditingNoteTagsOverridden = false;
	let psEditingNotePinned = false;
	let psSortMode = "updated";
	let psMetaVisible = true;
	let psMetaBasePaddingTop = null;
	let psAutoSaveTimer = 0;
	let psAutoSaveLastSavedText = "";
	let psAutoSaveLastSavedNoteId = "";
	let psAutoSaveInFlight = false;
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
		document.body.classList.toggle("mobile-preview-open", previewActive);
		document.body.classList.toggle("mobile-note-open", noteActive);
		document.body.classList.toggle("mobile-ps-open", psActive);
		document.body.classList.toggle("mobile-editor-open", editorActive);
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
	let psNextImportMode = "merge";
	let psSearchQuery = "";
	let psSearchDebounceTimer = 0;
	let psPinnedOnly = false;
	let psNoteAccessedById = new Map();
	const PS_ACTIVE_TAGS_KEY = "mirror_ps_active_tags";
	const PS_TAG_FILTER_MODE_KEY = "mirror_ps_tag_filter_mode";
	const PS_TAGS_COLLAPSED_KEY = "mirror_ps_tags_collapsed";
	const PS_SEARCH_QUERY_KEY = "mirror_ps_search_query";
	const PS_VISIBLE_KEY = "mirror_ps_visible";
	const PS_PINNED_ONLY_KEY = "mirror_ps_pinned_only";
	const PS_SORT_MODE_KEY = "mirror_ps_sort_mode";
	const PS_NOTE_ACCESSED_KEY = "mirror_ps_note_accessed_v1";
	const PS_META_VISIBLE_KEY = "mirror_ps_meta_visible";
	const PS_MANUAL_TAGS_MARKER = "__manual_tags__";
	const PS_PINNED_TAG = "pinned";
	const AI_PROMPT_KEY = "mirror_ai_prompt";
	const AI_USE_PREVIEW_KEY = "mirror_ai_use_preview";
	const AI_USE_ANSWER_KEY = "mirror_ai_use_answer";
	const AI_API_KEY_KEY = "mirror_ai_api_key";
	const AI_API_MODEL_KEY = "mirror_ai_api_model";
	const THEME_KEY = "mirror_theme";
	const MOBILE_AUTO_NOTE_SECONDS_KEY = "mirror_mobile_auto_note_seconds";
	const MOBILE_LAST_ACTIVE_KEY = "mirror_mobile_last_active";
	let aiPrompt = "";
	let aiUsePreview = true;
	let aiUseAnswer = true;
	let aiApiKey = "";
	let aiApiModel = "";
	let settingsOpen = false;
	let settingsSection = "user";
	let activeTheme = "fuchsia";
	let mobileAutoNoteSeconds = 0;
	let mobileAutoNoteChecked = false;
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
		amber: {
			label: "Amber",
			top: "rgba(250, 204, 21, 0.2)",
			bottom: "rgba(253, 224, 71, 0.14)",
			accentBgSoft: "rgba(250, 204, 21, 0.12)",
			accentBg: "rgba(250, 204, 21, 0.16)",
			accentBgHover: "rgba(250, 204, 21, 0.22)",
			accentBadgeBg: "rgba(250, 204, 21, 0.22)",
			accentStrong: "rgba(250, 204, 21, 0.6)",
			accentStrongHover: "rgba(250, 204, 21, 0.7)",
			accentStrongActive: "rgba(250, 204, 21, 0.8)",
			accentBorder: "rgba(250, 204, 21, 0.3)",
			accentBorderStrong: "rgba(250, 204, 21, 0.4)",
			accentText: "rgba(255, 251, 235, 0.98)",
			accentTextSoft: "rgba(253, 230, 138, 0.95)",
			accentRing: "rgba(250, 204, 21, 0.25)",
			accentRingStrong: "rgba(250, 204, 21, 0.4)",
		},
		red: {
			label: "Red",
			top: "rgba(239, 68, 68, 0.2)",
			bottom: "rgba(244, 63, 94, 0.12)",
			accentBgSoft: "rgba(239, 68, 68, 0.12)",
			accentBg: "rgba(239, 68, 68, 0.16)",
			accentBgHover: "rgba(239, 68, 68, 0.22)",
			accentBadgeBg: "rgba(239, 68, 68, 0.22)",
			accentStrong: "rgba(239, 68, 68, 0.6)",
			accentStrongHover: "rgba(239, 68, 68, 0.7)",
			accentStrongActive: "rgba(239, 68, 68, 0.8)",
			accentBorder: "rgba(239, 68, 68, 0.3)",
			accentBorderStrong: "rgba(239, 68, 68, 0.4)",
			accentText: "rgba(254, 242, 242, 0.98)",
			accentTextSoft: "rgba(254, 202, 202, 0.95)",
			accentRing: "rgba(239, 68, 68, 0.25)",
			accentRingStrong: "rgba(239, 68, 68, 0.4)",
		},
		monoLight: {
			label: "Mono Light",
			top: "rgba(241, 245, 249, 0.55)",
			bottom: "rgba(226, 232, 240, 0.45)",
			accentBgSoft: "rgba(226, 232, 240, 0.16)",
			accentBg: "rgba(226, 232, 240, 0.22)",
			accentBgHover: "rgba(226, 232, 240, 0.28)",
			accentBadgeBg: "rgba(226, 232, 240, 0.28)",
			accentStrong: "rgba(203, 213, 225, 0.65)",
			accentStrongHover: "rgba(203, 213, 225, 0.75)",
			accentStrongActive: "rgba(203, 213, 225, 0.85)",
			accentBorder: "rgba(148, 163, 184, 0.22)",
			accentBorderStrong: "rgba(148, 163, 184, 0.32)",
			accentText: "rgba(30, 41, 59, 0.98)",
			accentTextSoft: "rgba(71, 85, 105, 0.9)",
			accentRing: "rgba(148, 163, 184, 0.22)",
			accentRingStrong: "rgba(148, 163, 184, 0.32)",
		},
		monoDark: {
			label: "Mono Dark",
			top: "rgba(2, 6, 23, 0.55)",
			bottom: "rgba(0, 0, 0, 0.65)",
			accentBgSoft: "rgba(30, 41, 59, 0.14)",
			accentBg: "rgba(30, 41, 59, 0.2)",
			accentBgHover: "rgba(30, 41, 59, 0.28)",
			accentBadgeBg: "rgba(30, 41, 59, 0.28)",
			accentStrong: "rgba(51, 65, 85, 0.7)",
			accentStrongHover: "rgba(51, 65, 85, 0.8)",
			accentStrongActive: "rgba(51, 65, 85, 0.9)",
			accentBorder: "rgba(51, 65, 85, 0.4)",
			accentBorderStrong: "rgba(51, 65, 85, 0.55)",
			accentText: "rgba(226, 232, 240, 0.98)",
			accentTextSoft: "rgba(148, 163, 184, 0.9)",
			accentRing: "rgba(51, 65, 85, 0.35)",
			accentRingStrong: "rgba(51, 65, 85, 0.5)",
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
	};

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
		try {
			const raw = localStorage.getItem(AI_USE_ANSWER_KEY);
			aiUseAnswer = raw === null ? true : raw !== "0";
		} catch {
			aiUseAnswer = true;
		}
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

	function saveAiPrompt(next) {
		aiPrompt = String(next || "");
		try {
			localStorage.setItem(AI_PROMPT_KEY, aiPrompt);
		} catch {
			// ignore
		}
	}

	function saveAiUseAnswer(next) {
		aiUseAnswer = Boolean(next);
		try {
			localStorage.setItem(AI_USE_ANSWER_KEY, aiUseAnswer ? "1" : "0");
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

	function loadTheme() {
		try {
			activeTheme = String(localStorage.getItem(THEME_KEY) || "fuchsia");
		} catch {
			activeTheme = "fuchsia";
		}
		applyTheme(activeTheme);
	}

	function applyTheme(themeName) {
		const next = THEMES[themeName] ? themeName : "fuchsia";
		activeTheme = next;
		if (settingsThemeSelect) settingsThemeSelect.value = next;
		const colors = THEMES[next];
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
		}
		try {
			document.body.setAttribute("data-theme", next);
		} catch {
			// ignore
		}
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
		}
	}

	async function loadAiStatus() {
		if (!aiApiStatus) return;
		const localKey = String(aiApiKey || "").trim();
		if (localKey) {
			aiApiStatus.textContent = "Local API key set (will be used).";
			return;
		}
		try {
			const res = await api("/api/ai/status");
			const configured = Boolean(res && res.configured);
			const model = res && res.model ? String(res.model) : "";
			aiApiStatus.textContent = configured
				? `Server key active${model ? ` (${model})` : ""}.`
				: "Server key not configured.";
		} catch {
			aiApiStatus.textContent = "AI status not available.";
		}
	}

	const FAQ_ITEMS = [
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
			a: "Settings → Themes changes the background glow. Your choice is stored locally in your browser, so it does not affect other devices.",
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
			q: "Multiuser-Anzeige & Passwort-Maske",
			a: "The presence list shows who is online. Use the selection menu actions to hide password-like tokens or toggle masking on/off when sharing screens.",
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
	];

	function renderFaq() {
		if (!faqList) return;
		const query = String(
			faqSearchInput && faqSearchInput.value ? faqSearchInput.value : ""
		)
			.trim()
			.toLowerCase();
		const items = FAQ_ITEMS.filter((item) => {
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
				'<div class="rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-400">No results.</div>';
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

	function getAiPrompt() {
		const v = String(
			aiPromptInput && aiPromptInput.value ? aiPromptInput.value : ""
		)
			.trim()
			.slice(0, 800);
		return v;
	}

	function getAiUsePreview() {
		return aiUsePreview;
	}

	function getAiUseAnswer() {
		return aiUseAnswer;
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
		const lines = [
			"---",
			`id: ${String(safe.id || "")}`,
			`kind: ${String(safe.kind || "note")}`,
			`created: ${formatMetaDate(safe.createdAt)}`,
			`updated: ${formatMetaDate(safe.updatedAt)}`,
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
		}
		const rect = psMetaYaml.getBoundingClientRect();
		const height = Math.max(
			0,
			rect.height || 0,
			psMetaYaml.offsetHeight || 0,
			psMetaYaml.scrollHeight || 0
		);
		const next = psMetaBasePaddingTop + height + 4;
		textarea.style.paddingTop = `${Math.round(next)}px`;
		if (mirrorMask) mirrorMask.style.paddingTop = `${Math.round(next)}px`;
		if (attributionOverlay)
			attributionOverlay.style.paddingTop = `${Math.round(next)}px`;
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
		}
		textarea.style.paddingTop = `${Math.round(psMetaBasePaddingTop)}px`;
		if (mirrorMask)
			mirrorMask.style.paddingTop = `${Math.round(psMetaBasePaddingTop)}px`;
		if (attributionOverlay)
			attributionOverlay.style.paddingTop = `${Math.round(psMetaBasePaddingTop)}px`;
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

	function loadPsPinnedOnly() {
		try {
			psPinnedOnly = localStorage.getItem(PS_PINNED_ONLY_KEY) === "1";
		} catch {
			psPinnedOnly = false;
		}
		updatePsPinnedToggle();
	}

	function savePsPinnedOnly() {
		try {
			localStorage.setItem(PS_PINNED_ONLY_KEY, psPinnedOnly ? "1" : "0");
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

	function noteMatchesSearch(note, tokens) {
		if (!tokens || tokens.length === 0) return true;
		const text = String(note && note.text ? note.text : "").toLowerCase();
		const tags = Array.isArray(note && note.tags) ? note.tags : [];
		const tagsLower = tags.map((t) => String(t || "").toLowerCase());
		const hay = `${text}\n${tagsLower.join(" ")}`;
		return tokens.every((tokRaw) => {
			let tok = String(tokRaw || "")
				.trim()
				.toLowerCase();
			if (!tok) return true;
			if (tok.startsWith("#")) tok = tok.slice(1);
			if (!tok) return true;
			if (tok.startsWith("tag:")) {
				const want = tok.slice(4).trim();
				if (!want) return true;
				return tagsLower.includes(want);
			}
			return hay.includes(tok);
		});
	}

	function applyPersonalSpaceFiltersAndRender() {
		if (!psState || !psState.authed) return;
		const allNotes = Array.isArray(psState.notes) ? psState.notes : [];
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
		if (q) {
			const tokens = q.split(/\s+/).filter(Boolean).slice(0, 8);
			notes = notes.filter((n) => noteMatchesSearch(n, tokens));
		}
		if (psCount) {
			const total = allNotes.length;
			const shown = notes.length;
			const hasFilter = active.length > 0 || !!q || psPinnedOnly;
			psCount.textContent = hasFilter ? `${shown}/${total}` : String(total);
		}
		renderPsTags(psState.tags || []);
		renderPsList(notes);
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

	function renderPasswordToken(raw) {
		const value = String(raw || "");
		return escapeHtml(value);
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
			toggleBtn.textContent = next ? "🙈" : "👁";
		}
		return next;
	}

	function loadEditorMaskDisabled() {
		try {
			const raw = String(localStorage.getItem(EDITOR_MASK_DISABLED_KEY) || "");
			editorMaskDisabled = raw === "1";
		} catch {
			editorMaskDisabled = false;
		}
	}

	function saveEditorMaskDisabled() {
		try {
			localStorage.setItem(
				EDITOR_MASK_DISABLED_KEY,
				editorMaskDisabled ? "1" : "0"
			);
		} catch {
			// ignore
		}
	}

	function toggleEditorMaskView() {
		editorMaskDisabled = !editorMaskDisabled;
		saveEditorMaskDisabled();
		setEditorMaskToggleUi();
		updatePasswordMaskOverlay();
	}

	function setEditorMaskToggleUi() {
		const enabled = !editorMaskDisabled;
		if (selectionMenu) {
			const btn = selectionMenu.querySelector(
				'[data-selection-action="masktoggle"]'
			);
			if (btn) {
				btn.setAttribute("aria-pressed", enabled ? "true" : "false");
				btn.textContent = enabled ? "Unmask" : "Mask";
				btn.setAttribute("title", enabled ? "Maskierung aus" : "Maskierung an");
				btn.setAttribute(
					"aria-label",
					enabled ? "Maskierung aus" : "Maskierung an"
				);
			}
		}
	}

	function loadCrdtMarksPreference() {
		try {
			const raw = String(localStorage.getItem(CRDT_MARKS_DISABLED_KEY) || "");
			crdtMarksEnabled = raw !== "1";
		} catch {
			crdtMarksEnabled = true;
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

	function hasPasswordTokens(text) {
		return /\|\|[^\n]+?\|\|/.test(String(text || ""));
	}

	function maskPasswordTokens(text) {
		return String(text || "").replace(/\|\|[^\n]+?\|\|/g, (m) => {
			const len = Math.max(4, String(m || "").length);
			return "•".repeat(len);
		});
	}

	function buildEditorMaskHtml(text) {
		const src = String(text || "");
		if (!src) return "";
		let out = "";
		let last = 0;
		const re = /\|\|[^\n]+?\|\|/g;
		let match;
		while ((match = re.exec(src))) {
			const start = match.index;
			const end = start + match[0].length;
			if (start > last) {
				out += escapeHtml(src.slice(last, start));
			}
			out += `<span class="pw-editor-token">${escapeHtml(
				src.slice(start, end)
			)}</span>`;
			last = end;
		}
		if (last < src.length) {
			out += escapeHtml(src.slice(last));
		}
		return out;
	}

	function syncPasswordMaskScroll() {
		if (!mirrorMaskContent || !textarea) return;
		const x = Number(textarea.scrollLeft || 0);
		const y = Number(textarea.scrollTop || 0);
		mirrorMaskContent.style.transform = `translate(${-x}px, ${-y}px)`;
	}

	function updatePasswordMaskOverlay() {
		if (!textarea || !mirrorMask || !mirrorMaskContent) return;
		const value = String(textarea.value || "");
		const enabled = hasPasswordTokens(value) && !editorMaskDisabled;
		mirrorMask.classList.toggle("hidden", !enabled);
		textarea.classList.toggle("pw-mask-enabled", enabled);
		if (!enabled) {
			mirrorMaskContent.textContent = "";
			updateAttributionOverlay();
			return;
		}
		mirrorMaskContent.innerHTML = buildEditorMaskHtml(value);
		syncPasswordMaskScroll();
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

		const basePx = 160; // roughly Tailwind max-h-40
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
		const budgetPx = Math.floor(
			Math.min((panelPx || winPx) * 0.65, winPx * 0.7 || 520)
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
		updatePasswordMaskOverlay();
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
		updatePasswordMaskOverlay();
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
			try {
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
				? "Show input"
				: "Full preview";
			toggleFullPreview.setAttribute(
				"aria-pressed",
				fullPreview ? "true" : "false"
			);
		}
		updateRunOutputSizing();
	}

	function setPreviewVisible(next) {
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
		setFullPreview(fullPreview);
		syncMobileFocusState();
	}

	function updatePreview() {
		if (!previewOpen || !mdPreview) return;
		const isMonoLight = activeTheme === "monoLight";
		const renderer = ensureMarkdown();
		const stamp = Date.now();
		if (!renderer) {
			const fallbackColorScheme = isMonoLight ? "light" : "dark";
			const fallbackBg = isMonoLight ? "#f8fafc" : "#020617";
			const fallbackText = isMonoLight ? "#0f172a" : "#e2e8f0";
			const fallbackLink = isMonoLight ? "#2563eb" : "#60a5fa";
			const fallbackScrollThumb = isMonoLight
				? "rgba(100,116,139,.35)"
				: "rgba(148,163,184,.3)";
			const fallbackScrollThumbHover = isMonoLight
				? "rgba(100,116,139,.5)"
				: "rgba(148,163,184,.45)";
			const fallbackScrollBorder = isMonoLight
				? "rgba(241,245,249,.9)"
				: "rgba(2,6,23,.35)";
			const fallbackDoc = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<style>:root{color-scheme:${fallbackColorScheme};--scrollbar-thumb:${fallbackScrollThumb};--scrollbar-thumb-hover:${fallbackScrollThumbHover};}body{margin:0;padding:16px;font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,Noto Sans,sans-serif;background:${fallbackBg};color:${fallbackText};}a{color:${fallbackLink};}*{scrollbar-width:thin;scrollbar-color:var(--scrollbar-thumb) transparent;}*::-webkit-scrollbar{width:10px;height:10px;}*::-webkit-scrollbar-track{background:transparent;}*::-webkit-scrollbar-thumb{background-color:var(--scrollbar-thumb);border-radius:999px;border:2px solid ${fallbackScrollBorder};}*::-webkit-scrollbar-thumb:hover{background-color:var(--scrollbar-thumb-hover);}</style>
			</head><body><!--ts:${stamp}--><strong>Markdown preview unavailable.</strong><div style="margin-top:8px;color:#94a3b8">Reload the page or check for CDN blocking (AdBlock / corporate proxy).</div></body></html>`;
			setPreviewDocument(fallbackDoc);
			return;
		}
		const srcRaw = String(textarea && textarea.value ? textarea.value : "");
		const src = applyWikiLinksToMarkdown(srcRaw);
		let bodyHtml = "";
		try {
			bodyHtml = embedPdfLinks(applyHljsToHtml(renderer.render(src)));
		} catch {
			bodyHtml = "";
		}
		const themeColors = THEMES[activeTheme] || THEMES.fuchsia || {};
		const blockquoteBorder =
			themeColors.blockquoteBorder ||
			themeColors.accentBorderStrong ||
			themeColors.accentBorder ||
			"rgba(217,70,239,.45)";
		const blockquoteText =
			themeColors.blockquoteText ||
			themeColors.accentTextSoft ||
			"rgba(203,213,225,1)";
		const scrollbarThumb =
			themeColors.scrollbarThumb ||
			themeColors.accentTextSoft ||
			"rgba(148,163,184,.3)";
		const scrollbarThumbHover =
			themeColors.scrollbarThumbHover ||
			themeColors.accentText ||
			"rgba(148,163,184,.45)";
		const previewColorScheme = isMonoLight ? "light" : "dark";
		const previewBg = isMonoLight ? "#f8fafc" : "#020617";
		const previewText = isMonoLight ? "#0f172a" : "#e2e8f0";
		const previewLink = isMonoLight ? "#2563eb" : "#60a5fa";
		const previewPreBg = isMonoLight
			? "rgba(15,23,42,.04)"
			: "rgba(2,6,23,.6)";
		const previewPreBorder = isMonoLight
			? "rgba(15,23,42,.1)"
			: "rgba(255,255,255,.08)";
		const previewCodeBg = isMonoLight
			? "rgba(15,23,42,.06)"
			: "rgba(255,255,255,.06)";
		const previewFieldBg = isMonoLight
			? "rgba(15,23,42,.06)"
			: "rgba(15,23,42,.6)";
		const previewFieldBorder = isMonoLight
			? "rgba(15,23,42,.12)"
			: "rgba(255,255,255,.12)";
		const previewFieldText = isMonoLight
			? "rgba(15,23,42,.9)"
			: "rgba(226,232,240,.9)";
		const previewValueText = isMonoLight
			? "rgba(15,23,42,.95)"
			: "rgba(226,232,240,.95)";
		const previewMetaBg = isMonoLight
			? "rgba(15,23,42,.04)"
			: "rgba(15,23,42,.55)";
		const previewMetaBorder = isMonoLight
			? "rgba(15,23,42,.12)"
			: "rgba(148,163,184,.18)";
		const previewMetaText = isMonoLight
			? "rgba(71,85,105,.9)"
			: "rgba(148,163,184,.9)";
		const previewTableBorder = isMonoLight
			? "rgba(15,23,42,.12)"
			: "rgba(255,255,255,.12)";
		const previewScrollBorder = isMonoLight
			? "rgba(241,245,249,.9)"
			: "rgba(2,6,23,.35)";
		const highlightCssUrl = isMonoLight
			? "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css"
			: "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css";
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
		:root{color-scheme:${previewColorScheme};--blockquote-border:${blockquoteBorder};--blockquote-text:${blockquoteText};--scrollbar-thumb:${scrollbarThumb};--scrollbar-thumb-hover:${scrollbarThumbHover};}
    body{margin:0;padding:16px;font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,Noto Sans,sans-serif;background:${previewBg};color:${previewText};}
    a{color:${previewLink};}
		img{max-width:100%;height:auto;}
		.img-wrap{position:relative;display:inline-block;max-width:100%;}
		.img-tools{position:absolute;top:8px;right:8px;display:inline-flex;gap:6px;align-items:center;padding:4px 6px;border-radius:999px;background:rgba(2,6,23,.55);border:1px solid rgba(148,163,184,.25);opacity:0;transition:opacity .16s ease;}
		.img-wrap:hover .img-tools{opacity:1;}
		.img-tools button{border:0;background:rgba(148,163,184,.15);color:${previewText};font-size:11px;line-height:1;padding:4px 6px;border-radius:999px;cursor:pointer;}
		.img-tools button:hover{background:rgba(148,163,184,.3);}
    code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;}
    pre{overflow:auto;border:1px solid ${previewPreBorder};border-radius:12px;padding:12px;background:${previewPreBg};}
    code{background:${previewCodeBg};padding:.15em .35em;border-radius:.35em;}
    pre code{background:transparent;padding:0;}
		.pw-field{display:inline-flex;align-items:center;gap:.35rem;padding:.1rem .45rem;border-radius:999px;border:1px solid ${previewFieldBorder};background:${previewFieldBg};font-size:.85em;line-height:1.2;}
		.pw-mask{letter-spacing:.18em;font-weight:600;color:${previewFieldText};}
		.pw-value{display:none;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;color:${previewValueText};}
		.pw-field.pw-revealed .pw-mask{display:none;}
		.pw-field.pw-revealed .pw-value{display:inline;}
		.pw-toggle,.pw-copy{display:inline-flex;align-items:center;justify-content:center;height:1.4rem;min-width:1.4rem;padding:0 .35rem;border-radius:999px;border:1px solid ${previewFieldBorder};background:${previewCodeBg};color:${previewFieldText};font-size:.75rem;line-height:1;cursor:pointer;}
		.pw-toggle:hover,.pw-copy:hover{background:${previewPreBg};}
		.meta-yaml{margin:0 0 12px 0;font-size:11px;line-height:1.4;color:${previewMetaText};background:${previewMetaBg};border:1px solid ${previewMetaBorder};border-radius:10px;padding:8px 10px;white-space:pre-wrap;}
		*{scrollbar-width:thin;scrollbar-color:var(--scrollbar-thumb) transparent;}
		*::-webkit-scrollbar{width:10px;height:10px;}
		*::-webkit-scrollbar-track{background:transparent;}
		*::-webkit-scrollbar-thumb{background-color:var(--scrollbar-thumb);border-radius:999px;border:2px solid ${previewScrollBorder};}
		*::-webkit-scrollbar-thumb:hover{background-color:var(--scrollbar-thumb-hover);}
    h1,h2,h3{line-height:1.25;}
    table{border-collapse:collapse;width:100%;}
		th,td{border:1px solid ${previewTableBorder};padding:6px 8px;}
		blockquote{border-left:3px solid var(--blockquote-border);margin:0;padding:0 12px;color:var(--blockquote-text);}
    ul.task-list{list-style:none;padding-left:0;}
    ul.task-list li{display:flex;gap:.55rem;align-items:flex-start;}
		ul.task-list li.task-list-item.checked{opacity:.75;text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:rgba(148,163,184,.7);}
		ul.task-list li.task-list-item.checked input[type=checkbox]{opacity:1;}
    ul.task-list input[type=checkbox]{margin-top:.2rem;}
		.pdf-embed{margin:12px 0;border:1px solid ${previewTableBorder};border-radius:12px;overflow:hidden;background:${previewPreBg};}
		.pdf-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 10px;border-bottom:1px solid ${previewTableBorder};font-size:12px;background:${previewMetaBg};}
		.pdf-nav{display:flex;align-items:center;gap:6px;}
		.pdf-nav-btn{border:1px solid ${previewTableBorder};background:${previewPreBg};color:${previewText};font-size:12px;line-height:1;padding:3px 8px;border-radius:999px;cursor:pointer;}
		.pdf-nav-btn:disabled{opacity:.45;cursor:default;}
		.pdf-page-label{color:${previewMetaText};font-size:12px;}
		.pdf-actions{display:flex;justify-content:flex-end;gap:8px;}
		.pdf-frame{width:100%;height:auto;display:block;background:${previewBg};}
		.pdf-fallback{padding:10px 12px;font-size:12px;color:${previewMetaText};background:${previewMetaBg};border-bottom:1px solid ${previewTableBorder};}
  </style>
</head>
<body>
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

					function setPasswordRevealed(field, on){
						if (!field || !field.classList) return;
						if (on) field.classList.add('pw-revealed');
						else field.classList.remove('pw-revealed');
						var toggleBtn = field.querySelector ? field.querySelector('.pw-toggle') : null;
						if (toggleBtn) {
							toggleBtn.textContent = on ? '🙈' : '👁';
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
		for (let li = 0; li < lines.length; li++) {
			const line = String(lines[li] || "");
			const m = line.match(
				/^(\s*(?:>\s*)?(?:[-*+]|\d+[.)])\s+\[)([ xX])(\].*)$/
			);
			if (!m) continue;
			if (seen === idx) {
				const nextChecked =
					typeof forceChecked === "boolean"
						? forceChecked
						: String(m[2] || " ").toLowerCase() !== "x";
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
		schedulePsAutoSave();
		scheduleSend();
		return true;
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
		const indexOfCheckbox = (box) => {
			if (!box) return null;
			const all = doc.querySelectorAll('ul.task-list input[type="checkbox"]');
			for (let i = 0; i < all.length; i++) if (all[i] === box) return i;
			return null;
		};

		// Capture click early to compute the intended next state deterministically.
		doc.addEventListener(
			"click",
			(ev) => {
				const box = findCheckbox(ev && ev.target ? ev.target : null);
				if (!box) return;
				const idx = indexOfCheckbox(box);
				if (idx === null) return;
				const next = !Boolean(box.checked);
				try {
					box.checked = next;
				} catch {
					// ignore
				}
				try {
					ev.preventDefault();
					ev.stopPropagation();
				} catch {
					// ignore
				}
				const ok = toggleMarkdownTaskAtIndex(idx, next);
				if (ok) {
					if (metaLeft) metaLeft.textContent = "Todo updated.";
					if (metaRight) metaRight.textContent = nowIso();
				} else {
					if (metaLeft) metaLeft.textContent = "Todo not found.";
					if (metaRight) metaRight.textContent = nowIso();
				}
			},
			true
		);
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

	function renderPsTags(tags) {
		if (!psTags) return;
		const safeTags = Array.isArray(tags) ? tags : [];
		const visibleTags = safeTags.filter(
			(t) => String(t || "") !== PS_PINNED_TAG
		);
		const allBtn = {
			tag: "",
			label: "All",
		};
		const items = [
			allBtn,
			...visibleTags.map((t) => ({ tag: t, label: `#${t}` })),
		];
		psTags.innerHTML = items
			.map((it) => {
				const active = it.tag
					? psActiveTags && psActiveTags.has(String(it.tag))
					: !psActiveTags || psActiveTags.size === 0;
				const base = "rounded-full border px-2.5 py-1 text-xs transition";
				const cls = active
					? "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100"
					: "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10";
				const tagAttr = it.tag ? `data-tag="${it.tag}"` : 'data-tag=""';
				return `<button type="button" ${tagAttr} class="${base} ${cls}">${it.label}</button>`;
			})
			.join("");

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
		const rawTags = Array.isArray(note.tags) ? note.tags : [];
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
					psEditingNoteTags = stripPinnedTag(stripManualTagsMarker(updatedRaw));
					syncPsEditorTagsInput(true);
					updatePsEditingTagsHint();
				}
				applyPersonalSpaceFiltersAndRender();
				toast(pinned ? "Unpinned." : "Pinned.", "success");
			}
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Error";
			toast(`Pin failed: ${msg}`, "error");
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
		const tagsWithPinned = psEditingNotePinned
			? [...baseTags, PS_PINNED_TAG]
			: baseTags;
		const tagsPayload = buildPsTagsPayload(
			tagsWithPinned,
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
			.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
		for (const note of sorted) {
			const noteText = normalizeNoteTextForCompare(
				note && note.text ? note.text : ""
			);
			if (noteText === target) return note;
		}
		return null;
	}

	function clearPsEditingNoteState(opts) {
		psEditingNoteId = "";
		psEditingNoteKind = "";
		psEditingNoteTags = [];
		psEditingNoteTagsOverridden = false;
		psEditingNotePinned = false;
		syncPsEditorTagsInput(true);
		updatePsEditingTagsHint();
		if (psMainHint && !(opts && opts.keepHint)) {
			psMainHint.classList.add("hidden");
		}
		updateEditorMetaYaml();
	}

	function syncPsEditingNoteFromEditorText(text, opts) {
		if (!psState || !psState.authed) return false;
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
		psEditingNoteTags = stripPinnedTag(stripManualTagsMarker(rawTags));
		syncPsEditorTagsInput(true);
		updatePsEditingTagsHint();
		psAutoSaveLastSavedNoteId = psEditingNoteId;
		psAutoSaveLastSavedText = String(text || "");
		if (psMainHint) {
			psMainHint.classList.remove("hidden");
			psMainHint.textContent = "Editing active";
		}
		updateEditorMetaYaml();
		if (opts && opts.updateList) applyPersonalSpaceFiltersAndRender();
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
		psEditingNoteTags = stripPinnedTag(stripManualTagsMarker(rawTags));
		syncPsEditorTagsInput(true);
		textarea.value = String(note.text || "");
		try {
			textarea.focus();
		} catch {
			// ignore
		}
		if (psHint) psHint.textContent = "Editing: editor text updated.";
		updatePsEditingTagsHint();
		if (psMainHint) {
			psMainHint.classList.remove("hidden");
			psMainHint.textContent = "Editing active";
		}
		psAutoSaveLastSavedNoteId = psEditingNoteId;
		psAutoSaveLastSavedText = String(textarea.value || "");
		setPsAutoSaveStatus("");
		updatePreview();
		updatePasswordMaskOverlay();
		updateEditorMetaYaml();
		if (notesForList && psSortMode !== "accessed") {
			renderPsList(notesForList);
		} else {
			applyPersonalSpaceFiltersAndRender();
		}
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
		psRenderedNoteIds = items.map((n) => String(n.id || "")).filter(Boolean);
		prunePsSelectedNotes(psRenderedNoteIds);
		psList.innerHTML = items
			.map((n) => {
				const id = String(n.id || "");
				const active = id && id === psEditingNoteId;
				const selected = id && psSelectedNoteIds.has(id);
				const rawTags = Array.isArray(n.tags) ? n.tags : [];
				const pinned = rawTags.some((t) => String(t || "") === PS_PINNED_TAG);
				const tags = stripPinnedTag(stripManualTagsMarker(rawTags));
				const showTags = tags.length > 6 ? tags.slice(-6) : tags;
				const chips = showTags
					.map(
						(t) =>
							`<span class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-200">#${t}</span>`
					)
					.join("");
				const info = getNoteTitleAndExcerpt(n && n.text ? n.text : "");
				const titleHtml = escapeHtml(info.title);
				const excerptHtml = escapeHtml(info.excerpt);
				return `
					<div data-note-id="${id}" class="group ps-note-item relative cursor-pointer rounded-xl border ${
					active
						? "ps-note-active border-fuchsia-400/40 bg-fuchsia-500/10"
						: "border-white/10 bg-slate-950/25 hover:bg-slate-950/35"
				} p-3${selected ? " ring-2 ring-fuchsia-400/30" : ""}">
						<div class="flex items-center justify-between gap-2">
							<div class="text-xs text-slate-400">${fmtDate(n.createdAt)}</div>
							<div class="ps-note-actions flex items-center gap-2">
								<button
									type="button"
									data-action="pin"
									class="ps-note-pin inline-flex rounded-md border border-white/10 p-1.5 shadow-soft backdrop-blur transition ${
										pinned
											? "bg-fuchsia-500/20 text-fuchsia-100"
											: "bg-slate-950/60 text-slate-200 hover:bg-slate-950/80"
									}"
									title="Pin"
									aria-label="Pin">
									<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M4 4v16" />
										<path d="M4 4h12l-2 5 2 5H4" />
									</svg>
								</button>
								<button
									type="button"
									data-action="share"
									class="ps-note-share inline-flex rounded-md border border-white/10 bg-slate-950/60 p-1.5 text-slate-200 shadow-soft backdrop-blur transition hover:bg-slate-950/80"
									title="Teilen"
									aria-label="Teilen">
									<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="18" cy="5" r="3" />
										<circle cx="6" cy="12" r="3" />
										<circle cx="18" cy="19" r="3" />
										<path d="M8.5 10.5L15.5 6.5" />
										<path d="M8.5 13.5L15.5 17.5" />
									</svg>
								</button>
								<button
									type="button"
									data-action="delete"
									class="ps-note-delete inline-flex rounded-md border border-white/10 bg-slate-950/60 p-1.5 text-slate-200 shadow-soft backdrop-blur transition hover:bg-slate-950/80"
									title="Delete"
									aria-label="Delete">
									<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M3 6h18" />
										<path d="M8 6V4h8v2" />
										<path d="M19 6l-1 14H6L5 6" />
										<path d="M10 11v6" />
										<path d="M14 11v6" />
									</svg>
								</button>
							</div>
						</div>
						<div class="mt-2">
							<div class="truncate text-sm font-semibold text-slate-100">${titleHtml}</div>
							${
								excerptHtml
									? `<div class="ps-note-excerpt mt-1 text-xs text-slate-300">${excerptHtml}</div>`
									: ""
							}
						</div>
						${chips ? `<div class="mt-2 flex flex-wrap gap-1">${chips}</div>` : ""}
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
			row.addEventListener("click", (ev) => {
				const id = row.getAttribute("data-note-id") || "";
				if (!id) return;
				const toggle = Boolean(ev && (ev.metaKey || ev.ctrlKey));
				if (toggle) {
					ev.preventDefault();
					ev.stopPropagation();
					setPsNoteSelected(id, !psSelectedNoteIds.has(id));
					return;
				}
				const note = byId.get(id);
				if (!note) return;
				applyNoteToEditor(note, items);
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
						if (psEditingNoteId === id) {
							psEditingNoteId = "";
							if (psMainHint) psMainHint.classList.add("hidden");
							syncMobileFocusState();
						}
						toast("Notiz im Papierkorb abgelegt.", "success");
						await refreshPersonalSpace();
					} catch {
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
					const note = byId.get(id);
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
			const ok = toggleMarkdownTaskAtIndex(idx, checked);
			if (metaLeft)
				metaLeft.textContent = ok ? "Todo updated." : "Todo not found.";
			if (metaRight) metaRight.textContent = nowIso();
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
		if (v === "fix" || v === "improve" || v === "run" || v === "summarize")
			return v;
		return "explain";
	}

	async function aiAssistFromPreview() {
		const mode = getAiMode();
		const parsed = parseRunnableFromEditor();
		const editorText = String(textarea && textarea.value ? textarea.value : "");
		const lang = String(parsed && parsed.lang ? parsed.lang : "")
			.trim()
			.toLowerCase();
		const code = String(parsed && parsed.code ? parsed.code : "");

		const prompt = getAiPrompt();
		if (prompt) saveAiPrompt(prompt);
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
			setPreviewRunOutput({
				status: "AI",
				output: String(res && res.text ? res.text : ""),
				error: "",
				source: "ai",
			});
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Error";
			setPreviewRunOutput({
				status: "AI error",
				output: "",
				error: msg,
				source: "ai",
			});
			toast(`AI failed: ${msg}`, "error");
		}
	}

	async function refreshPersonalSpace() {
		if (!psUnauthed || !psAuthed) return;

		try {
			const me = await api("/api/personal-space/me");
			psState = me;
		} catch (e) {
			psState = {
				authed: false,
				email: "",
				tags: [],
				notes: [],
				favorites: [],
				roomTabs: [],
			};
			if (psHint) psHint.textContent = "";
		}
		psState.favorites = Array.isArray(psState.favorites)
			? dedupeFavorites(psState.favorites)
			: [];
		psState.roomTabs = Array.isArray(psState.roomTabs)
			? psState.roomTabs
			: [];
		psState.notes = Array.isArray(psState.notes)
			? psState.notes.map((n) => ensureNoteUpdatedAt(n))
			: [];

		if (!psState.authed) {
			psUnauthed.classList.remove("hidden");
			psAuthed.classList.add("hidden");
			if (psLogout) psLogout.classList.add("hidden");
			if (psUserAuthed) psUserAuthed.classList.add("hidden");
			if (psUserUnauthed) psUserUnauthed.classList.remove("hidden");
			if (psEmail) psEmail.textContent = "";
			clearPsSelection();
			setPsEditorTagsVisible(false);
			updatePsPinnedToggle();
			updateFavoritesUI();
			renderRoomTabs();
			setPsAutoSaveStatus("");
			updatePsNoteNavButtons();
			maybeStartMobileAutoNoteSession();
			return;
		}

		psUnauthed.classList.add("hidden");
		psAuthed.classList.remove("hidden");
		if (psLogout) psLogout.classList.remove("hidden");
		if (psEmail) psEmail.textContent = psState.email || "";
		if (psUserAuthed) psUserAuthed.classList.remove("hidden");
		if (psUserUnauthed) psUserUnauthed.classList.add("hidden");
		setPsEditorTagsVisible(true);
		syncCalendarSettingsFromServer();

		applyPersonalSpaceFiltersAndRender();
		syncPsEditingNoteTagsFromState();
		syncPsEditorTagsInput();
		updatePsPinnedToggle();
		updateFavoritesUI();
		renderRoomTabs();
		updateEditorMetaYaml();
		updatePsNoteNavButtons();
		maybeStartMobileAutoNoteSession();
		await syncLocalRoomTabsToServer();
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

	async function exportPersonalSpaceNotes() {
		if (!psState || !psState.authed) {
			toast("Please enable Personal Space first (sign in).", "error");
			return;
		}
		const hintEl = psTransferHint || psHint;
		try {
			if (hintEl) hintEl.textContent = "Exporting…";
			const res = await api("/api/notes/export");
			const payload =
				res && res.export ? res.export : { version: 1, notes: [] };
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

		// Conservative limit: keep JSON request under 1MB.
		const MAX_CHARS = 220000;

		const now = Date.now();
		const normalized = trimmed.replace(/\r\n?/g, "\n");

		function splitOffFrontMatter(src) {
			const lines = src.split("\n");
			if (lines[0] !== "---") return { front: "", body: src };
			let end = -1;
			for (let i = 1; i < Math.min(lines.length, 2000); i += 1) {
				if (lines[i] === "---") {
					end = i;
					break;
				}
			}
			if (end === -1) return { front: "", body: src };
			const front = lines.slice(0, end + 1).join("\n");
			const body = lines
				.slice(end + 1)
				.join("\n")
				.trimStart();
			return { front, body };
		}

		function splitByHr(src) {
			// Split at markdown separator lines consisting of '---' only,
			// but only when surrounded by blank lines (or file boundaries).
			const lines = src.split("\n");
			const parts = [];
			let buf = [];
			for (let i = 0; i < lines.length; i += 1) {
				const line = lines[i];
				if (line.trim() === "---") {
					const prevBlank = i === 0 ? true : lines[i - 1].trim() === "";
					const nextBlank =
						i === lines.length - 1 ? true : lines[i + 1].trim() === "";
					if (prevBlank && nextBlank) {
						const chunk = buf.join("\n").trim();
						if (chunk) parts.push(chunk);
						buf = [];
						continue;
					}
				}
				buf.push(line);
			}
			const last = buf.join("\n").trim();
			if (last) parts.push(last);
			return parts.length ? parts : [src.trim()];
		}

		function splitByHeadings(src) {
			const lines = src.split("\n");
			const hasH1 = lines.some((l) => /^#\s+\S/.test(l));
			const re = hasH1 ? /^#\s+\S/ : /^##\s+\S/;
			const blocks = [];
			let cur = [];
			for (const line of lines) {
				if (re.test(line) && cur.length) {
					const chunk = cur.join("\n").trim();
					if (chunk) blocks.push(chunk);
					cur = [line];
					continue;
				}
				cur.push(line);
			}
			const last = cur.join("\n").trim();
			if (last) blocks.push(last);
			return blocks.length ? blocks : [src.trim()];
		}

		function chunkBigText(src, labelPrefix) {
			const out = [];
			if (src.length <= MAX_CHARS) {
				out.push({ text: src.trim(), createdAt: now });
				return out;
			}
			let part = 0;
			for (let start = 0; start < src.length; start += MAX_CHARS) {
				part += 1;
				const chunk = src.slice(start, start + MAX_CHARS).trim();
				if (!chunk) continue;
				out.push({
					text: `${labelPrefix} (Teil ${part})\n\n${chunk}`,
					createdAt: now,
				});
				if (out.length >= 25) break;
			}
			return out;
		}

		// 1) YAML front matter (optional) stays with the first note.
		const fm = splitOffFrontMatter(normalized);
		let blocks = splitByHr(fm.body);
		blocks = blocks.flatMap((b) => splitByHeadings(b));
		blocks = blocks.map((b) => b.trim()).filter(Boolean);
		if (!blocks.length) return [];

		// Prepend front matter to first block if present.
		if (fm.front) {
			blocks[0] = `${fm.front}\n\n${blocks[0]}`.trim();
		}

		const notes = [];
		for (let idx = 0; idx < blocks.length; idx += 1) {
			const b = blocks[idx];
			const hasHeading = /^(#|##)\s+\S/m.test(b);
			const label = hasHeading ? `Import: ${name}` : `# Import: ${name}`;
			const prefixed = hasHeading ? b : `${label}\n\n${b}`;
			for (const n of chunkBigText(prefixed, `# Import: ${name}`)) {
				notes.push(n);
				if (notes.length >= 25) break;
			}
			if (notes.length >= 25) break;
		}
		return notes;
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

	let { room, key } = parseRoomAndKeyFromHash();
	if (!room) {
		room = randomRoom();
		key = randomKey();
		location.hash = buildShareHash(room, key);
	}

	const RECENT_KEY = "mirror_recent_rooms";
	const FAVORITES_KEY = "mirror_favorites_v1";
	const ROOM_TABS_KEY = "mirror_room_tabs_v1";
	const CALENDAR_SOURCES_KEY = "mirror_calendar_sources_v1";
	const CALENDAR_DEFAULT_VIEW_KEY = "mirror_calendar_default_view_v1";
	const CALENDAR_VIEWS = ["day", "week", "month"];
	const CALENDAR_SETTINGS_SYNC_DELAY = 1200;
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
	const calendarState = {
		view: "month",
		cursor: new Date(),
		events: [],
		loading: false,
		lastLoadedAt: 0,
	};

	function normalizeFavoriteEntry(it) {
		const roomName = normalizeRoom(it && it.room);
		const keyName = normalizeKey(it && it.key);
		const addedAt = Number(it && (it.addedAt || it.added_at)) || 0;
		const text = String(it && it.text ? it.text : "");
		if (!roomName) return null;
		return { room: roomName, key: keyName, addedAt, text };
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
		const noteId = getActiveRoomTabNoteId();
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

	let roomTabSyncTimer = 0;
	let roomTabSyncPayload = null;
	let roomTabSyncInFlight = false;
	let roomTabSyncQueued = false;
	let roomTabsSyncedFromLocal = false;

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
		const noteId = getActiveRoomTabNoteId();
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

	function touchRoomTab(roomName, keyName, opts) {
		const nextRoom = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!nextRoom) return;
		const tabs = dedupeRoomTabs(loadRoomTabs());
		const now = Date.now();
		const idx = tabs.findIndex(
			(t) => t.room === nextRoom && t.key === nextKey
		);
		if (idx >= 0) {
			tabs[idx].lastUsed = now;
		} else {
			if (tabs.length >= MAX_ROOM_TABS) {
				showRoomTabLimitModal();
				return;
			}
			tabs.push({ room: nextRoom, key: nextKey, lastUsed: now });
		}
		saveRoomTabs(tabs);
		if (!(opts && opts.skipSync)) {
			const noteId = getActiveRoomTabNoteId();
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
			.map((t) => {
				const isActive = t.room === room && t.key === key;
				const isCollab = isActive && presenceState && presenceState.size > 1;
				const base =
					"inline-flex items-center gap-1 rounded-lg border text-xs transition";
				const active =
					"border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100";
				const idle =
					"border-white/10 bg-slate-950/40 text-slate-200 hover:bg-white/10";
				const badge = t.key
					? '<span class="text-[10px] text-slate-400">privat</span>'
					: "";
				const collab = isCollab
					? '<span class="ml-1 inline-flex h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(16,185,129,0.6)]" title="Collaboration aktiv" aria-label="Collaboration aktiv"></span>'
					: "";
				const closeBtn = canClose
					? `
							<button
								type="button"
								data-tab-close
								data-room="${escapeAttr(t.room)}"
								data-key="${escapeAttr(t.key)}"
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
							data-room="${escapeAttr(t.room)}"
							data-key="${escapeAttr(t.key)}"
							class="inline-flex items-center gap-2 px-3 py-1.5">
							<span class="max-w-[140px] truncate">${escapeHtml(t.room)}</span>
							${badge}
							${collab}
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
		tabs.splice(idx, 1);
		saveRoomTabs(tabs);
		removeRoomTabFromState(nextRoom, nextKey);
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
				return `
					<div class="rounded-lg border border-white/10 bg-slate-950/30 p-2">
						<div class="flex items-center justify-between gap-2">
							<div class="flex items-center gap-2 text-xs text-slate-200">
								<span class="font-medium">${escapeHtml(f.room)}</span>
								${badge}
							</div>
							<button
								type="button"
								data-fav-remove
								data-fav-room="${escapeAttr(f.room)}"
								data-fav-key="${escapeAttr(f.key)}"
								class="rounded-md border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-200 transition hover:bg-white/5 active:bg-white/10">
								Entfernen
							</button>
						</div>
						<label class="mt-2 block text-[11px] text-slate-400">Notiz</label>
						<input
							type="text"
							value="${escapeAttr(textVal)}"
							data-fav-text
							data-fav-room="${escapeAttr(f.room)}"
							data-fav-key="${escapeAttr(f.key)}"
							class="mt-1 w-full rounded-md border border-white/10 bg-slate-950/40 px-2.5 py-1.5 text-[12px] text-slate-100 shadow-soft backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400/25"
							placeholder="Kurze Notiz (optional)" />
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
		};
	}

	function applyCalendarSettings(calendar, opts) {
		if (!calendar || typeof calendar !== "object") return false;
		const hasSources = Array.isArray(calendar.sources);
		const hasView = CALENDAR_VIEWS.includes(calendar.defaultView);
		if (hasSources) saveCalendarSources(calendar.sources, { skipSync: true });
		if (hasView) {
			saveCalendarDefaultView(calendar.defaultView, {
				skipSync: true,
				skipRender: true,
			});
		}
		if (hasSources || hasView) {
			renderCalendarSettings();
			scheduleCalendarRefresh();
			if (!(opts && opts.skipRender)) renderCalendarPanel();
		}
		return hasSources || hasView;
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
			calendarState.view = loadCalendarDefaultView();
			updateCalendarViewButtons();
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
			calendarLayout.classList.toggle("lg:grid-cols-[minmax(0,1fr)_260px]", !next);
			calendarLayout.classList.toggle("lg:grid-cols-1", next);
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
		return date.toLocaleTimeString("de-DE", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	function formatDayLabel(date) {
		return date.toLocaleDateString("de-DE", {
			weekday: "short",
			day: "2-digit",
			month: "2-digit",
		});
	}

	function formatCalendarTitle(view, date) {
		if (view === "day") {
			return date.toLocaleDateString("de-DE", {
				weekday: "long",
				day: "2-digit",
				month: "long",
				year: "numeric",
			});
		}
		if (view === "week") {
			const start = startOfWeek(date);
			const end = addDays(start, 6);
			return `${start.toLocaleDateString("de-DE", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})} – ${end.toLocaleDateString("de-DE", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})}`;
		}
		return date.toLocaleDateString("de-DE", {
			month: "long",
			year: "numeric",
		});
	}

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

	async function refreshCalendarEvents(force) {
		if (calendarState.loading) return;
		const now = Date.now();
		if (!force && now - calendarState.lastLoadedAt < 60 * 1000) return;
		const sources = loadCalendarSources().filter((s) => s.enabled && s.url);
		if (!calendarStatus || !calendarGrid) return;
		if (!sources.length) {
			calendarState.events = [];
			calendarStatus.textContent = "No calendar sources enabled.";
			renderCalendarPanel();
			return;
		}
		calendarState.loading = true;
		calendarStatus.textContent = "Loading calendars…";
		if (calendarGrid) {
			calendarGrid.innerHTML =
				'<div class="text-sm text-slate-400">Loading calendars…</div>';
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
		calendarState.events = mergeCalendarEvents(sources, results);
		calendarState.lastLoadedAt = Date.now();
		calendarState.loading = false;
		const okCount = results.length - errors;
		calendarStatus.textContent = `${okCount} calendars loaded${
			errors ? ` · ${errors} errors` : ""
		}`;
		renderCalendarPanel();
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

	function renderCalendarLegend() {
		if (!calendarLegend) return;
		const sources = loadCalendarSources();
		if (!sources.length) {
			calendarLegend.innerHTML =
				'<div class="text-xs text-slate-400">Keine Kalender verbunden.</div>';
			return;
		}
		calendarLegend.innerHTML = sources
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
			.join("");
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

	function renderCalendarPanel() {
		if (!calendarGrid) return;
		const view = calendarState.view;
		const cursor = calendarState.cursor || new Date();
		const sources = loadCalendarSources().filter((s) => s.enabled && s.url);
		const events = Array.isArray(calendarState.events)
			? calendarState.events.slice()
			: [];
		events.sort((a, b) => a.start.getTime() - b.start.getTime());
		if (calendarTitle) {
			calendarTitle.textContent = formatCalendarTitle(view, cursor);
		}
		renderCalendarLegend();
		if (!sources.length) {
			calendarGrid.innerHTML =
				'<div class="text-sm text-slate-400">Keine Kalenderquellen aktiv.</div>';
			return;
		}
		if (!events.length) {
			calendarGrid.innerHTML =
				'<div class="text-sm text-slate-400">Keine Termine in diesem Zeitraum.</div>';
			return;
		}
		if (view === "day") {
			const start = startOfDay(cursor);
			const end = addDays(start, 1);
			const dayEvents = events.filter(
				(evt) => evt.start < end && evt.end > start
			);
			const isToday =
				startOfDay(start).getTime() === startOfDay(new Date()).getTime();
			const dayBorder = isToday ? "border-fuchsia-400/40" : "border-white/10";
			calendarGrid.innerHTML = dayEvents.length
				? dayEvents
					.map((evt) => {
						const time = evt.allDay
							? "Ganztägig"
							: `${formatTime(evt.start)} – ${formatTime(evt.end)}`;
						const loc = evt.location
							? `<div class=\"text-[11px] text-slate-400\">${escapeHtml(
									evt.location
								)}\</div>`
							: "";
						return `
							<div class="rounded-lg border ${dayBorder} bg-slate-950/40 p-3">
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
				const dayEvents = events.filter(
					(evt) => evt.start < dayEnd && evt.end > day
				);
				const list = dayEvents.length
					? dayEvents
						.map((evt) => {
							const time = evt.allDay
								? "Ganztägig"
								: formatTime(evt.start);
							return `
								<div class="rounded-md border border-white/10 bg-slate-950/50 px-2 py-1 text-[11px] text-slate-200">
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
					<div class="rounded-lg border ${dayBorder} bg-slate-950/40 p-2">
						<div class="text-[11px] text-slate-400">${formatDayLabel(
							day
						)}</div>
						<div class="mt-2 space-y-1">${list}</div>
					</div>`;
			});
			calendarGrid.innerHTML = `<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">${cols.join(
				"")}</div>`;
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
			const dayEvents = events.filter(
				(evt) => evt.start < dayEnd && evt.end > day
			);
			const visibleEvents = dayEvents.slice(0, 2).map((evt) => {
				const time = evt.allDay ? "Ganztägig" : formatTime(evt.start);
				const title = `${time} · ${evt.title}`;
				return `
					<div class="truncate rounded-md border border-white/10 bg-slate-950/50 px-2 py-1 text-[10px] text-slate-200" title="${escapeAttr(
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
			return `
				<div class="min-h-[88px] rounded-lg border ${
					isToday ? "border-fuchsia-400/40" : "border-white/10"
				} bg-slate-950/40 p-2">
					<div class="text-[11px] text-slate-400">${day.getDate()}</div>
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
			loadTrashManage();
		} catch {
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
		touchRoomTab(room, key, { skipSync: true });
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
		return new Date().toLocaleString("de-DE", {
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
		presenceSummary.textContent =
			count === 1 ? "1 Nutzer online" : `${count} Nutzer online`;

		if (typingIndicator) {
			const typingUsers = users.filter(
				(u) => u.typing && u.clientId !== clientId
			);
			if (typingUsers.length === 0) {
				typingIndicator.textContent = "";
				typingIndicator.classList.add("hidden");
			} else if (typingUsers.length === 1) {
				typingIndicator.textContent = `${typingUsers[0].name} tippt…`;
				typingIndicator.classList.remove("hidden");
			} else {
				typingIndicator.textContent = `${typingUsers.length} Personen tippen…`;
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

	function syncAttributionOverlayScroll() {
		if (!attributionOverlayContent || !textarea) return;
		const x = Number(textarea.scrollLeft || 0);
		const y = Number(textarea.scrollTop || 0);
		attributionOverlayContent.style.transform = `translate(${-x}px, ${-y}px)`;
	}

	function buildAttributionHtml() {
		if (!ytext) return "";
		const delta = ytext.toDelta();
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
			out += `<span class="author-span" style="background-color:${bg};box-shadow:inset 0 0 0 1px ${border};">${escapeHtml(
				text
			)}</span>`;
		}
		return out;
	}

	function updateAttributionOverlay() {
		if (!attributionOverlay || !attributionOverlayContent) return;
		if (!crdtMarksEnabled) {
			attributionOverlay.classList.add("hidden");
			attributionOverlayContent.textContent = "";
			if (textarea && textarea.classList) {
				textarea.classList.remove("attribution-active");
			}
			return;
		}
		if (!crdtReady || !ytext || presenceState.size <= 1) {
			attributionOverlay.classList.add("hidden");
			attributionOverlayContent.textContent = "";
			if (textarea && textarea.classList) {
				textarea.classList.remove("attribution-active");
			}
			return;
		}
		const maskVisible =
			mirrorMask && !mirrorMask.classList.contains("hidden");
		if (maskVisible) {
			attributionOverlay.classList.add("hidden");
			if (textarea && textarea.classList) {
				textarea.classList.remove("attribution-active");
			}
			return;
		}
		const html = buildAttributionHtml();
		if (!html) {
			attributionOverlay.classList.add("hidden");
			attributionOverlayContent.textContent = "";
			if (textarea && textarea.classList) {
				textarea.classList.remove("attribution-active");
			}
			return;
		}
		attributionOverlayContent.innerHTML = html;
		attributionOverlay.classList.remove("hidden");
		syncAttributionOverlayScroll();
		if (textarea && textarea.classList) {
			textarea.classList.add("attribution-active");
		}
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
		suppressSend = true;
		const cleaned = sanitizeLegacySnapshotText(text);
		textarea.value = String(cleaned ?? "");
		lastLocalText = textarea.value;
		suppressSend = false;

		metaLeft.textContent = label || "Synced.";
		metaRight.textContent = nowIso();
		updateRoomTabTextLocal(room, key, cleaned);
		updatePreview();
		updatePasswordMaskOverlay();
		const noteId = getActiveRoomTabNoteId();
		scheduleRoomTabSync({
			room,
			key,
			text: resolveRoomTabSnapshotText(noteId, String(cleaned ?? "")),
			lastUsed:
				typeof lastUsedTs === "number" ? lastUsedTs : Date.now(),
		});
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
				return;
			}

			if (msg.type === "presence_update") {
				applyPresenceUpdate(msg);
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
		setCalendarPanelActive(false);
		flushRoomTabSync();
		location.hash = buildShareHash(next, key);
	}

	function goToRoomWithKey(roomName, keyName) {
		const next = normalizeRoom(roomName);
		const nextKey = normalizeKey(keyName);
		if (!next) return;
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

	textarea.addEventListener("input", () => {
		metaLeft.textContent = "Typing…";
		if (isCrdtEnabled()) {
			updateCrdtFromTextarea();
		} else {
			scheduleSend();
		}
		setTyping(true);
		scheduleTypingStop();
		scheduleSelectionSend();
		const noteId = getActiveRoomTabNoteId();
		updateRoomTabTextLocal(room, key, textarea.value);
		scheduleRoomTabSync({
			room,
			key,
			text: resolveRoomTabSnapshotText(noteId, String(textarea.value || "")),
			lastUsed: Date.now(),
		});
		updatePreview();
		updatePasswordMaskOverlay();
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
		updatePasswordMaskOverlay();
		scheduleSelectionSend();
	});

	textarea.addEventListener("focus", () => {
		updateCodeLangOverlay();
		updateTableMenuVisibility();
		updatePasswordMaskOverlay();
		scheduleSelectionSend();
	});

	textarea.addEventListener("blur", () => {
		setTyping(false);
	});

	textarea.addEventListener("scroll", () => {
		updateSlashMenu();
		updateSelectionMenu();
		updateEditorMetaScroll();
		syncPasswordMaskScroll();
		syncAttributionOverlayScroll();
	});

	textarea.addEventListener("keyup", () => {
		updateCodeLangOverlay();
		updateTableMenuVisibility();
		updateWikiMenu();
		updateSelectionMenu();
		updatePasswordMaskOverlay();
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
			const href = String(
				shareModalLink && shareModalLink.value ? shareModalLink.value : ""
			);
			const ok = await copyTextToClipboard(href);
			toast(ok ? "Link copied." : "Copy not available.", ok ? "success" : "error");
		});
	}
	if (shareModalShare) {
		shareModalShare.addEventListener("click", async () => {
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
					updatePasswordMaskOverlay();
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
		updatePasswordMaskOverlay();
		scheduleSelectionSend();
	});

	window.addEventListener("hashchange", () => {
		const parsed = parseRoomAndKeyFromHash();
		const nextRoom = parsed.room;
		const nextKey = parsed.key;
		if (!nextRoom) return;
		if (nextRoom === room && nextKey === key) return;
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
				return;
			}
		}
		const suppressRestore =
			pendingClosedTab &&
			pendingClosedTab.room === room &&
			pendingClosedTab.key === key;
		pendingClosedTab = null;
		if (textarea && !suppressRestore) {
			updateRoomTabTextLocal(room, key, textarea.value);
		}
		if (!suppressRestore) {
			flushRoomTabSync();
		}
		room = nextRoom;
		key = nextKey;
		resetE2eeKeyCache();
		lastAppliedRemoteTs = 0;
		lastLocalText = "";
		roomLabel.textContent = room;
		updateShareLink();
		roomInput.value = room;
		saveRecentRoom(room);
		renderRecentRooms();
		updateFavoritesUI();
		touchRoomTab(room, key, { skipSync: true });
		renderRoomTabs();
		if (textarea) {
			const cached = loadRoomTabs().find(
				(t) => t.room === room && t.key === key
			);
			const cachedNoteId = cached && cached.noteId ? String(cached.noteId || "") : "";
			const note = cachedNoteId ? findNoteById(cachedNoteId) : null;
			const cachedText =
				!cachedNoteId && cached && typeof cached.text === "string"
					? cached.text
					: "";
			const nextText = note
				? String(note.text || "")
				: !cachedNoteId
					? cachedText || pendingRoomBootstrapText || ""
					: "";
			pendingRoomBootstrapText = "";
			if (note) {
				applyNoteToEditor(note, null, { skipHistory: true });
			} else {
				textarea.value = nextText;
			}
			lastLocalText = textarea.value;
			metaLeft.textContent = note ? "Room geladen (Note)." : "Room geladen (lokal).";
			metaRight.textContent = "";
			updatePreview();
			updatePasswordMaskOverlay();
			updateCodeLangOverlay();
			updateTableMenuVisibility();
			updateSelectionMenu();
			if (!note) {
				syncPsEditingNoteFromEditorText(nextText, {
					clear: true,
					updateList: true,
				});
			}
		}
		if (!key) toast("Public room (no key).", "info");
		setTyping(false);
		presenceState.clear();
		updatePresenceUI();
		connect();
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

	window.addEventListener("visibilitychange", () => {
		if (document.visibilityState !== "visible") return;
		refreshSyncOnFocus();
	});
	window.addEventListener("focus", () => {
		refreshSyncOnFocus();
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
	loadPsNoteAccessed();
	loadPsSortMode();
	loadPsMetaVisible();
	loadPsVisible();
	applyPsVisible();
	loadTheme();
	loadAiApiConfig();
	loadEditorMaskDisabled();
	setEditorMaskToggleUi();
	loadCrdtMarksPreference();
	setCrdtMarksToggleUi();
	updatePasswordMaskOverlay();

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
		psNewNote.addEventListener("click", () => {
			psEditingNoteId = "";
			psEditingNoteKind = "";
			psEditingNoteTags = [];
			psEditingNoteTagsOverridden = false;
			psEditingNotePinned = false;
			psAutoSaveLastSavedNoteId = "";
			psAutoSaveLastSavedText = "";
			if (psAutoSaveTimer) window.clearTimeout(psAutoSaveTimer);
			setPsAutoSaveStatus("");
			syncPsEditorTagsInput();
			if (textarea) {
				textarea.value = "";
				textarea.focus();
			}
			if (psMainHint) psMainHint.classList.add("hidden");
			if (psHint) psHint.textContent = "New note.";
			metaLeft.textContent = "Bereit.";
			metaRight.textContent = "";
			updatePreview();
			updatePasswordMaskOverlay();
			syncMobileFocusState();
		});
	}
	if (psEditorTagsInput) {
		psEditorTagsInput.addEventListener("input", () => {
			updatePsEditorTagsFromInput();
			updatePsEditorTagsSuggest(true);
		});
		psEditorTagsInput.addEventListener("focus", () => {
			updatePsEditorTagsSuggest(true);
		});
		psEditorTagsInput.addEventListener("keydown", (ev) => {
			if (!psEditorTagsSuggestOpen) return;
			if (!psEditorTagsSuggestItems.length) return;
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
			if (ev.key === "Enter" || ev.key === "Tab") {
				const item = psEditorTagsSuggestItems[psEditorTagsSuggestIndex];
				if (item) {
					ev.preventDefault();
					applyPsEditorTagSuggestion(item);
				}
				return;
			}
			if (ev.key === "Escape") {
				ev.preventDefault();
				closePsEditorTagsSuggest();
			}
		});
		psEditorTagsInput.addEventListener("blur", () => {
			if (psEditorTagsSyncing) return;
			syncPsEditorTagsInput();
			closePsEditorTagsSuggest();
		});
	}
	if (psEditorTagsSuggest) {
		psEditorTagsSuggest.addEventListener("mousedown", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			if (!target.closest("[data-tag]")) return;
			ev.preventDefault();
		});
		psEditorTagsSuggest.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
			const btn = target.closest("[data-tag]");
			if (!btn) return;
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
				updatePasswordMaskOverlay();
				scheduleSend();
			})();
		});
	}

	function canAutoSavePsNote() {
		return Boolean(psState && psState.authed && textarea);
	}

	async function savePersonalSpaceNote(text, opts) {
		const auto = Boolean(opts && opts.auto);
		const trimmed = String(text || "");
		if (!trimmed.trim()) return false;
		if (!psState || !psState.authed) {
			if (!auto)
				toast("Please enable Personal Space first (sign in).", "error");
			return false;
		}
		const baseTags = Array.isArray(psEditingNoteTags) ? psEditingNoteTags : [];
		const tagsWithPinned = psEditingNotePinned
			? [...baseTags, PS_PINNED_TAG]
			: baseTags;
		const tagsPayload = buildPsTagsPayload(
			tagsWithPinned,
			psEditingNoteTagsOverridden
		);
		if (auto) setPsAutoSaveStatus("Speichern…");
		else if (psHint)
			psHint.textContent = psEditingNoteId ? "Updating…" : "Saving…";
		if (!psEditingNoteId) {
			const existing = findNoteByText(trimmed);
			if (existing && existing.id) {
				applyNoteToEditor(existing);
				psAutoSaveLastSavedNoteId = psEditingNoteId;
				psAutoSaveLastSavedText = trimmed;
				setPsAutoSaveStatus("Bereits gespeichert");
				if (psHint) psHint.textContent = "Bereits gespeichert.";
				if (!auto) toast("Personal Space: bereits gespeichert.", "info");
				return true;
			}
			const res = await api("/api/notes", {
				method: "POST",
				body: JSON.stringify({
					text: trimmed,
					tags: tagsPayload,
				}),
			});
			const saved = res && res.note ? res.note : null;
			if (saved && saved.id && psState && psState.authed) {
				saved.updatedAt = Date.now();
				saved.createdAt = Number(saved.createdAt || Date.now());
				psEditingNoteId = String(saved.id);
				psEditingNoteKind = String(saved.kind || "");
				const notes = Array.isArray(psState.notes) ? psState.notes : [];
				const nextNotes = notes.filter(
					(n) => String(n && n.id ? n.id : "") !== psEditingNoteId
				);
				psState.notes = [saved, ...nextNotes];
				applyPersonalSpaceFiltersAndRender();
				syncPsEditingNoteTagsFromState();
				updateEditorMetaYaml();
				if (psMainHint) {
					psMainHint.classList.remove("hidden");
					psMainHint.textContent = "Editing active";
				}
			}
			psAutoSaveLastSavedNoteId = psEditingNoteId;
			psAutoSaveLastSavedText = trimmed;
			if (auto) setPsAutoSaveStatus("Automatisch gespeichert");
			else setPsAutoSaveStatus("Gespeichert");
			if (psHint) psHint.textContent = auto ? "" : "Saved.";
			if (!auto) toast("Personal Space: saved.", "success");
			if (!auto) await refreshPersonalSpace();
			return true;
		}

		const res = await api(`/api/notes/${encodeURIComponent(psEditingNoteId)}`, {
			method: "PUT",
			body: JSON.stringify({
				text: trimmed,
				tags: tagsPayload,
			}),
		});
		const saved = res && res.note ? res.note : null;
		if (saved && saved.id && psState && psState.authed) {
			saved.updatedAt = Date.now();
			const notes = Array.isArray(psState.notes) ? psState.notes : [];
			const id = String(saved.id);
			const idx = notes.findIndex((n) => String(n && n.id ? n.id : "") === id);
			psState.notes =
				idx >= 0
					? [...notes.slice(0, idx), saved, ...notes.slice(idx + 1)]
					: [saved, ...notes];
			applyPersonalSpaceFiltersAndRender();
			syncPsEditingNoteTagsFromState();
			updateEditorMetaYaml();
		}
		psAutoSaveLastSavedNoteId = psEditingNoteId;
		psAutoSaveLastSavedText = trimmed;
		if (auto) setPsAutoSaveStatus("Automatisch gespeichert");
		else setPsAutoSaveStatus("Gespeichert");
		if (psHint) psHint.textContent = auto ? "" : "Updated.";
		if (!auto) toast("Personal Space: saved.", "success");
		if (!auto) await refreshPersonalSpace();
		return true;
	}

	function schedulePsAutoSave() {
		if (!canAutoSavePsNote()) return;
		const text = String(textarea && textarea.value ? textarea.value : "");
		if (!text.trim()) return;
		if (psAutoSaveLastSavedNoteId !== psEditingNoteId) {
			psAutoSaveLastSavedNoteId = psEditingNoteId;
			psAutoSaveLastSavedText = psEditingNoteId ? text : "";
		}
		if (text === psAutoSaveLastSavedText) return;
		if (psAutoSaveTimer) window.clearTimeout(psAutoSaveTimer);
		setPsAutoSaveStatus("Speichern…");
		psAutoSaveTimer = window.setTimeout(async () => {
			if (psAutoSaveInFlight) return;
			if (!canAutoSavePsNote()) return;
			const latest = String(textarea && textarea.value ? textarea.value : "");
			if (latest === psAutoSaveLastSavedText) return;
			psAutoSaveInFlight = true;
			try {
				await savePersonalSpaceNote(latest, { auto: true });
			} catch {
				setPsAutoSaveStatus("Speichern fehlgeschlagen");
			} finally {
				psAutoSaveInFlight = false;
			}
		}, 900);
	}
	if (psSaveMain) {
		psSaveMain.addEventListener("click", async () => {
			const text = String(
				textarea && textarea.value ? textarea.value : ""
			).trim();
			if (!text) return;
			try {
				await savePersonalSpaceNote(text, { auto: false });
			} catch (e) {
				if (psHint) psHint.textContent = "Not saved (sign in?).";
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
	if (mdPreview) {
		mdPreview.addEventListener("load", () => {
			attachPreviewCheckboxWriteback();
		});
	}
	if (aiAssistBtn) {
		aiAssistBtn.addEventListener("click", async () => {
			await aiAssistFromPreview();
		});
	}
	if (clearRunOutputBtn) {
		clearRunOutputBtn.addEventListener("click", () => {
			setPreviewRunOutput({ status: "", output: "", error: "", source: "" });
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
			updatePasswordMaskOverlay();
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
			updatePasswordMaskOverlay();
			scheduleSend();
			toast("AI output applied (appended).", "success");
		});
	}
	window.addEventListener("resize", () => {
		updateRunOutputSizing();
		syncPsListHeight();
		syncMobileFocusState();
	});
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
			if (e.key === "Enter") {
				e.preventDefault();
				aiAssistFromPreview();
			}
		});
	}
	if (aiUsePreviewBtn) {
		aiUsePreviewBtn.addEventListener("click", () => {
			saveAiUsePreview(!aiUsePreview);
			setAiUsePreviewUi(aiUsePreview);
			applyAiContextMode();
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
	if (psContextMenu) {
		document.addEventListener("click", (ev) => {
			if (!psContextMenuOpen) return;
			const target = ev && ev.target ? ev.target : null;
			if (target && psContextMenu.contains(target)) return;
			closePsContextMenu();
		});
		document.addEventListener("keydown", (ev) => {
			if (!psContextMenuOpen) return;
			if (ev && ev.key === "Escape") {
				ev.preventDefault();
				closePsContextMenu();
			}
		});
		window.addEventListener("scroll", () => {
			if (psContextMenuOpen) closePsContextMenu();
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
	if (psPinnedToggle) {
		psPinnedToggle.addEventListener("click", async () => {
			psPinnedOnly = !psPinnedOnly;
			savePsPinnedOnly();
			updatePsPinnedToggle();
			applyPersonalSpaceFiltersAndRender();
		});
	}
	if (togglePersonalSpaceBtn) {
		togglePersonalSpaceBtn.addEventListener("click", () => {
			if (isMobileViewport()) {
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
		noteCloseMobile.addEventListener("click", () => {
			clearPsEditingNoteState();
			if (psMainHint) psMainHint.classList.add("hidden");
			mobilePsOpen = mobileNoteReturn === "ps";
			mobileNoteReturn = "editor";
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
	if (settingsThemeSelect) {
		settingsThemeSelect.addEventListener("change", () => {
			saveTheme(settingsThemeSelect.value);
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
	if (favoritesManageList) {
		favoritesManageList.addEventListener("click", (ev) => {
			const target = ev.target;
			if (!(target instanceof HTMLElement)) return;
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
	if (aiApiSaveBtn) {
		aiApiSaveBtn.addEventListener("click", () => {
			const nextKey = readAiApiKeyInput();
			const nextModel = normalizeAiModelInput(
				aiApiModelInput ? aiApiModelInput.value : ""
			);
			saveAiApiConfig(nextKey, nextModel);
			loadAiStatus();
			toast("AI settings gespeichert.", "success");
		});
	}
	if (aiApiClearBtn) {
		aiApiClearBtn.addEventListener("click", () => {
			saveAiApiConfig("", "");
			if (aiApiKeyInput) aiApiKeyInput.value = "";
			if (aiApiModelInput) aiApiModelInput.value = "";
			loadAiStatus();
			toast("AI settings gelöscht.", "success");
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

	// Show a small post-verify hint
	try {
		const sp = new URLSearchParams(location.search);
		if (sp.get("ps") === "1") {
			toast("Personal Space aktiviert.", "success");
			sp.delete("ps");
			const next =
				location.pathname + (sp.toString() ? `?${sp}` : "") + location.hash;
			history.replaceState(null, "", next);
		}
	} catch {
		// ignore
	}

	loadMobileAutoNoteSeconds();
	refreshPersonalSpace();
	loadAiPrompt();
	loadAiUsePreview();
	loadAiUseAnswer();
	applyAiContextMode();
	updateTableMenuVisibility();
	syncMobileFocusState();
})();
