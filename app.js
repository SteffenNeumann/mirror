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
	const metaLeft = document.getElementById("metaLeft");
	const metaRight = document.getElementById("metaRight");
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
	const editorPreviewGrid = document.getElementById("editorPreviewGrid");
	const previewPanel = document.getElementById("previewPanel");
	const mdPreview = document.getElementById("mdPreview");
	const togglePreview = document.getElementById("togglePreview");
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
	const mainGrid = document.getElementById("mainGrid");
	const psPanel = document.getElementById("psPanel");
	const togglePersonalSpaceBtn = document.getElementById("togglePersonalSpace");
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
	const psExportNotesBtn = document.getElementById("psExportNotes");
	const psImportModeSelect = document.getElementById("psImportMode");
	const psImportNotesBtn = document.getElementById("psImportNotes");
	const psImportFileInput = document.getElementById("psImportFile");
	const psCount = document.getElementById("psCount");
	const psSearchInput = document.getElementById("psSearch");
	const psPinnedToggle = document.getElementById("psPinnedToggle");
	const psList = document.getElementById("psList");
	const psHint = document.getElementById("psHint");
	const psTransferHint = document.getElementById("psTransferHint");
	const psLogout = document.getElementById("psLogout");
	const psSaveMain = document.getElementById("psSaveMain");
	const psMainHint = document.getElementById("psMainHint");
	const psAutoSaveStatus = document.getElementById("psAutoSaveStatus");
	const psSettingsBtn = document.getElementById("psSettingsBtn");
	const settingsRoot = document.getElementById("settingsRoot");
	const settingsBackdrop = document.getElementById("settingsBackdrop");
	const settingsPanel = document.getElementById("settingsPanel");
	const settingsClose = document.getElementById("settingsClose");
	const settingsNavButtons = document.querySelectorAll("[data-settings-nav]");
	const settingsSections = document.querySelectorAll("[data-settings-section]");
	const settingsThemeSelect = document.getElementById("settingsTheme");
	const aiApiKeyInput = document.getElementById("aiApiKey");
	const aiApiModelInput = document.getElementById("aiApiModel");
	const aiApiSaveBtn = document.getElementById("aiApiSave");
	const aiApiClearBtn = document.getElementById("aiApiClear");
	const aiApiStatus = document.getElementById("aiApiStatus");
	const faqSearchInput = document.getElementById("faqSearch");
	const faqList = document.getElementById("faqList");
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

	const clientId = crypto.randomUUID
		? crypto.randomUUID()
		: String(Math.random()).slice(2);

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
			// Anzeige ohne Zeitzone: lokale Zeit aus gitstamp.txt (YYYY-MM-DD HH:MM:SS)
			const hm = timePart.split(":").slice(0, 2).join(":");
			const formattedTs = datePart && hm ? `${datePart} ${hm}` : "";
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

	async function showSlashHelp() {
		await openModal({
			title: "Slash commands",
			message:
				"/h1 /h2 /h3 · /b (bold) · /i (italic) · /s (strike) · /quote · /ul · /ol · /todo · /done · /tasks · /code [lang] · /link · /hr · /table · /table row+ · /table row- · /table col+ · /table col-",
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
		if (cmd === "hr") {
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
	};
	let psActiveTags = new Set();
	let psTagFilterMode = "and";
	let psEditingNoteId = "";
	let psEditingNoteKind = "";
	let psEditingNoteTags = [];
	let psEditingNoteTagsOverridden = false;
	let psEditingNotePinned = false;
	let psAutoSaveTimer = 0;
	let psAutoSaveLastSavedText = "";
	let psAutoSaveLastSavedNoteId = "";
	let psAutoSaveInFlight = false;
	let previewOpen = false;
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
	const PS_ACTIVE_TAGS_KEY = "mirror_ps_active_tags";
	const PS_TAG_FILTER_MODE_KEY = "mirror_ps_tag_filter_mode";
	const PS_TAGS_COLLAPSED_KEY = "mirror_ps_tags_collapsed";
	const PS_SEARCH_QUERY_KEY = "mirror_ps_search_query";
	const PS_VISIBLE_KEY = "mirror_ps_visible";
	const PS_PINNED_ONLY_KEY = "mirror_ps_pinned_only";
	const PS_MANUAL_TAGS_MARKER = "__manual_tags__";
	const PS_PINNED_TAG = "pinned";
	const AI_PROMPT_KEY = "mirror_ai_prompt";
	const AI_USE_PREVIEW_KEY = "mirror_ai_use_preview";
	const AI_API_KEY_KEY = "mirror_ai_api_key";
	const AI_API_MODEL_KEY = "mirror_ai_api_model";
	const THEME_KEY = "mirror_theme";
	let aiPrompt = "";
	let aiUsePreview = true;
	let aiApiKey = "";
	let aiApiModel = "";
	let settingsOpen = false;
	let settingsSection = "user";
	let activeTheme = "fuchsia";
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
			top: "rgba(251, 191, 36, 0.18)",
			bottom: "rgba(244, 114, 182, 0.12)",
			accentBgSoft: "rgba(251, 191, 36, 0.12)",
			accentBg: "rgba(251, 191, 36, 0.16)",
			accentBgHover: "rgba(251, 191, 36, 0.22)",
			accentBadgeBg: "rgba(251, 191, 36, 0.22)",
			accentStrong: "rgba(251, 191, 36, 0.6)",
			accentStrongHover: "rgba(251, 191, 36, 0.7)",
			accentStrongActive: "rgba(251, 191, 36, 0.8)",
			accentBorder: "rgba(251, 191, 36, 0.3)",
			accentBorderStrong: "rgba(251, 191, 36, 0.4)",
			accentText: "rgba(255, 251, 235, 0.98)",
			accentTextSoft: "rgba(253, 230, 138, 0.95)",
			accentRing: "rgba(251, 191, 36, 0.25)",
			accentRingStrong: "rgba(251, 191, 36, 0.4)",
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

	function saveAiPrompt(next) {
		aiPrompt = String(next || "");
		try {
			localStorage.setItem(AI_PROMPT_KEY, aiPrompt);
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
		}
		try {
			document.body.setAttribute("data-theme", next);
		} catch {
			// ignore
		}
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
		}
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
		let notes = allNotes;
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
				md.validateLink = (url) =>
					/^(https?:|mailto:|tel:|note:)/i.test(String(url || "").trim());
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
		if (kind === "code" && !/```/.test(text)) {
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
	}

	function updatePreview() {
		if (!previewOpen || !mdPreview) return;
		const renderer = ensureMarkdown();
		const stamp = Date.now();
		if (!renderer) {
			const fallbackDoc = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<style>:root{color-scheme:dark;}body{margin:0;padding:16px;font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,Noto Sans,sans-serif;background:#020617;color:#e2e8f0;}a{color:#60a5fa;}</style>
			</head><body><!--ts:${stamp}--><strong>Markdown preview unavailable.</strong><div style="margin-top:8px;color:#94a3b8">Reload the page or check for CDN blocking (AdBlock / corporate proxy).</div></body></html>`;
			setPreviewDocument(fallbackDoc);
			return;
		}
		const srcRaw = String(textarea && textarea.value ? textarea.value : "");
		const src = applyWikiLinksToMarkdown(srcRaw);
		let bodyHtml = "";
		try {
			bodyHtml = applyHljsToHtml(renderer.render(src));
		} catch {
			bodyHtml = "";
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
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css">
	<!--ts:${stamp}-->
  <style>
    :root{color-scheme:dark;}
    body{margin:0;padding:16px;font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,Noto Sans,sans-serif;background:#020617;color:#e2e8f0;}
    a{color:#60a5fa;}
    code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;}
    pre{overflow:auto;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px;background:rgba(2,6,23,.6);}
    code{background:rgba(255,255,255,.06);padding:.15em .35em;border-radius:.35em;}
    pre code{background:transparent;padding:0;}
    h1,h2,h3{line-height:1.25;}
    table{border-collapse:collapse;width:100%;}
    th,td{border:1px solid rgba(255,255,255,.12);padding:6px 8px;}
    blockquote{border-left:3px solid rgba(217,70,239,.45);margin:0;padding:0 12px;color:#cbd5e1;}
    ul.task-list{list-style:none;padding-left:0;}
    ul.task-list li{display:flex;gap:.55rem;align-items:flex-start;}
		ul.task-list li.task-list-item.checked{opacity:.75;text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:rgba(148,163,184,.7);}
		ul.task-list li.task-list-item.checked input[type=checkbox]{opacity:1;}
    ul.task-list input[type=checkbox]{margin-top:.2rem;}
  </style>
</head>
<body>
  <div id="content">${bodyHtml}</div>
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
		// Robust: statt srcdoc eine blob: URL nutzen (Safari/Reload/Room-Switch ist damit stabil).
		try {
			if (previewObjectUrl) {
				URL.revokeObjectURL(previewObjectUrl);
				previewObjectUrl = "";
			}
			const blob = new Blob([String(html || "")], { type: "text/html" });
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
				mdPreview.srcdoc = String(html || "");
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

	function applyNoteToEditor(note, notesForList) {
		if (!note || !textarea) return;
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
		if (notesForList) renderPsList(notesForList);
		else applyPersonalSpaceFiltersAndRender();
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
			const q = normalizeSearchQuery(psSearchQuery);
			psList.innerHTML = q
				? '<div class="text-xs text-slate-400">No matches.</div>'
				: '<div class="text-xs text-slate-400">No notes yet.</div>';
			return;
		}
		const byId = new Map(items.map((n) => [String(n.id || ""), n]));
		psList.innerHTML = items
			.map((n) => {
				const id = String(n.id || "");
				const active = id && id === psEditingNoteId;
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
					<div data-note-id="${id}" class="group relative cursor-pointer rounded-xl border ${
					active
						? "border-fuchsia-400/40 bg-fuchsia-500/10"
						: "border-white/10 bg-slate-950/25 hover:bg-slate-950/35"
				} p-3">
						<div class="flex items-center justify-between gap-2">
							<div class="text-xs text-slate-400">${fmtDate(n.createdAt)}</div>
							<div class="flex items-center gap-2">
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
			row.querySelectorAll('input[type="checkbox"]').forEach((i) => {
				i.addEventListener("click", (ev) => {
					ev.preventDefault();
					ev.stopPropagation();
				});
			});

			row.addEventListener("click", () => {
				const id = row.getAttribute("data-note-id") || "";
				const note = byId.get(id);
				if (!note) return;
				applyNoteToEditor(note, items);
			});

			const delBtn = row.querySelector('[data-action="delete"]');
			if (delBtn) {
				delBtn.addEventListener("click", async (ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					const id = row.getAttribute("data-note-id") || "";
					if (!id) return;
					const ok = await modalConfirm("Delete this note?", {
						title: "Delete note",
						okText: "Delete",
						cancelText: "Cancel",
						danger: true,
						backdropClose: true,
					});
					if (!ok) return;
					try {
						await api(`/api/notes/${encodeURIComponent(id)}`, {
							method: "DELETE",
						});
						if (psEditingNoteId === id) {
							psEditingNoteId = "";
							if (psMainHint) psMainHint.classList.add("hidden");
						}
						toast("Note deleted.", "success");
						await refreshPersonalSpace();
					} catch {
						toast("Delete failed.", "error");
					}
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
			payloadText = prompt;
			payloadLang = "text";
			promptForRequest = "";
		} else if (mode !== "run" && usePreview) {
			if (!String(editorText || "").trim() && prompt) {
				kind = "text";
				payloadText = prompt;
				payloadLang = "text";
				promptForRequest = "";
			}
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
			};
			if (psHint) psHint.textContent = "";
		}
		psState.favorites = Array.isArray(psState.favorites)
			? psState.favorites
			: [];

		if (!psState.authed) {
			psUnauthed.classList.remove("hidden");
			psAuthed.classList.add("hidden");
			if (psLogout) psLogout.classList.add("hidden");
			if (psUserAuthed) psUserAuthed.classList.add("hidden");
			if (psUserUnauthed) psUserUnauthed.classList.remove("hidden");
			if (psEmail) psEmail.textContent = "";
			setPsEditorTagsVisible(false);
			updatePsPinnedToggle();
			updateFavoritesUI();
			setPsAutoSaveStatus("");
			return;
		}

		psUnauthed.classList.add("hidden");
		psAuthed.classList.remove("hidden");
		if (psLogout) psLogout.classList.remove("hidden");
		if (psEmail) psEmail.textContent = psState.email || "";
		if (psUserAuthed) psUserAuthed.classList.remove("hidden");
		if (psUserUnauthed) psUserUnauthed.classList.add("hidden");
		setPsEditorTagsVisible(true);

		applyPersonalSpaceFiltersAndRender();
		syncPsEditingNoteTagsFromState();
		syncPsEditorTagsInput();
		updatePsPinnedToggle();
		updateFavoritesUI();
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

	function normalizeFavoriteEntry(it) {
		const roomName = normalizeRoom(it && it.room);
		const keyName = normalizeKey(it && it.key);
		const addedAt = Number(it && (it.addedAt || it.added_at)) || 0;
		const text = String(it && it.text ? it.text : "");
		if (!roomName) return null;
		return { room: roomName, key: keyName, addedAt, text };
	}

	function loadLocalFavorites() {
		try {
			const raw = localStorage.getItem(FAVORITES_KEY);
			const parsed = JSON.parse(raw || "[]");
			if (!Array.isArray(parsed)) return [];
			return parsed.map(normalizeFavoriteEntry).filter(Boolean);
		} catch {
			return [];
		}
	}

	function loadFavorites() {
		if (psState && psState.authed) {
			const favs = Array.isArray(psState.favorites) ? psState.favorites : [];
			return favs.map(normalizeFavoriteEntry).filter(Boolean);
		}
		return loadLocalFavorites();
	}

	function saveFavorites(list) {
		try {
			localStorage.setItem(FAVORITES_KEY, JSON.stringify(list || []));
		} catch {
			// ignore
		}
	}

	function findFavoriteIndex(roomName, keyName) {
		const favs = loadFavorites();
		return favs.findIndex((f) => f.room === roomName && f.key === keyName);
	}

	function renderFavorites() {
		if (!favoritesSelect) return;
		const favs = loadFavorites().sort(
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

	roomLabel.textContent = room;
	shareLink.href =
		location.pathname + location.search + buildShareHash(room, key);
	roomInput.value = room;
	saveRecentRoom(room);
	renderRecentRooms();
	updateFavoritesUI();

	function setStatus(kind, text) {
		statusText.textContent = text;
		statusDot.className = "h-2.5 w-2.5 rounded-full";
		if (kind === "online") statusDot.classList.add("bg-emerald-400");
		else if (kind === "connecting") statusDot.classList.add("bg-amber-400");
		else statusDot.classList.add("bg-slate-500");
	}

	function wsDisplay(base) {
		try {
			const u = new URL(base, location.href);
			return `${u.protocol}//${u.host}${u.pathname}`;
		} catch {
			return String(base);
		}
	}

	function wsUrlForRoom(base, roomName) {
		// Key bleibt im Hash (Client-only), wird nicht an den Server gesendet.
		// Viele Relays verwenden Query-Parameter. Falls dein Relay anders ist,
		// setze ?ws=wss://... passend oder passe diese Funktion an.
		const url = new URL(base, location.href);
		url.searchParams.set("room", roomName);
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

	function sendMessage(message) {
		if (!ws || ws.readyState !== WebSocket.OPEN) return;
		ws.send(JSON.stringify(message));
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

		suppressSend = true;
		textarea.value = String(text ?? "");
		lastLocalText = textarea.value;
		suppressSend = false;

		metaLeft.textContent = "Synced.";
		metaRight.textContent = nowIso();
		updatePreview();
	}

	function connect() {
		const mySeq = ++connectionSeq;
		window.clearTimeout(reconnectTimer);
		if (ws) {
			try {
				ws.close();
			} catch {
				// ignore
			}
		}

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
			sendMessage({ type: "hello", room, clientId, ts: Date.now() });
			sendMessage({
				type: "request_state",
				room,
				clientId,
				ts: Date.now(),
			});
		});

		ws.addEventListener("message", (ev) => {
			if (mySeq !== connectionSeq) return;
			const msg = safeJsonParse(ev.data);
			if (!msg || msg.room !== room) return;
			if (msg.clientId === clientId) return;

			if (msg.type === "set") {
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
				sendCurrentState();
			}
		});

		ws.addEventListener("close", () => {
			if (mySeq !== connectionSeq) return;
			setStatus("offline", "Offline — reconnecting…");
			metaLeft.textContent = "Connection lost. Check server/network.";
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
		location.hash = buildShareHash(next, key);
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
		key = randomKey();
		location.hash = buildShareHash(nextRoom, key);
	});

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
		const href = shareLink.href;
		try {
			await navigator.clipboard.writeText(href);
			toast("Link copied.", "success");
		} catch {
			// Fallback: in-page selection (funktioniert ohne Clipboard API)
			try {
				const ta = document.createElement("textarea");
				ta.value = href;
				ta.setAttribute("readonly", "");
				ta.style.position = "fixed";
				ta.style.opacity = "0";
				document.body.appendChild(ta);
				ta.select();
				document.execCommand("copy");
				ta.remove();
				toast("Link copied.", "success");
			} catch {
				toast("Copy not available.", "error");
			}
		}
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

	textarea.addEventListener("input", () => {
		metaLeft.textContent = "Typing…";
		scheduleSend();
		updatePreview();
		updateSlashMenu();
		updateWikiMenu();
		updateCodeLangOverlay();
		updateTableMenuVisibility();
		schedulePsAutoSave();
	});

	textarea.addEventListener("click", () => {
		updateSlashMenu();
		updateWikiMenu();
		updateCodeLangOverlay();
		updateTableMenuVisibility();
	});

	textarea.addEventListener("focus", () => {
		updateCodeLangOverlay();
		updateTableMenuVisibility();
	});

	textarea.addEventListener("keyup", () => {
		updateCodeLangOverlay();
		updateTableMenuVisibility();
		updateWikiMenu();
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
	});

	window.addEventListener("hashchange", () => {
		const parsed = parseRoomAndKeyFromHash();
		const nextRoom = parsed.room;
		const nextKey = parsed.key;
		if (!nextRoom) return;
		if (nextRoom === room && nextKey === key) return;
		room = nextRoom;
		key = nextKey;
		resetE2eeKeyCache();
		lastAppliedRemoteTs = 0;
		lastLocalText = "";
		roomLabel.textContent = room;
		shareLink.href =
			location.pathname + location.search + buildShareHash(room, key);
		roomInput.value = room;
		saveRecentRoom(room);
		renderRecentRooms();
		updateFavoritesUI();
		if (!key) toast("Public room (no key).", "info");
		connect();
	});

	// Initial
	setStatus("offline", "Offline");
	loadBuildStamp();
	connect();
	loadPsTagPrefs();
	loadPsTagsCollapsed();
	applyPsTagsCollapsed();
	loadPsSearchQuery();
	loadPsPinnedOnly();
	loadPsVisible();
	applyPsVisible();
	loadTheme();
	loadAiApiConfig();

	// Personal Space wiring
	if (addPersonalSpaceBtn) {
		addPersonalSpaceBtn.addEventListener("click", requestPersonalSpaceLink);
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
		});
	}
	if (psEditorTagsInput) {
		psEditorTagsInput.addEventListener("input", () => {
			if (psEditorTagsSyncing) return;
			const nextTags = normalizeManualTags(psEditorTagsInput.value);
			psEditingNoteTags = nextTags;
			psEditingNoteTagsOverridden = true;
			updatePsEditingTagsHint();
		});
		psEditorTagsInput.addEventListener("blur", () => {
			if (psEditorTagsSyncing) return;
			syncPsEditorTagsInput();
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
				scheduleSend();
			})();
		});
	}

	function canAutoSavePsNote() {
		return Boolean(psState && psState.authed && psEditingNoteId && textarea);
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
				psEditingNoteId = String(saved.id);
				psEditingNoteKind = String(saved.kind || "");
				const notes = Array.isArray(psState.notes) ? psState.notes : [];
				psState.notes = [saved, ...notes];
				applyPersonalSpaceFiltersAndRender();
				syncPsEditingNoteTagsFromState();
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
			const notes = Array.isArray(psState.notes) ? psState.notes : [];
			const id = String(saved.id);
			const idx = notes.findIndex((n) => String(n && n.id ? n.id : "") === id);
			psState.notes =
				idx >= 0
					? [...notes.slice(0, idx), saved, ...notes.slice(idx + 1)]
					: [saved, ...notes];
			applyPersonalSpaceFiltersAndRender();
			syncPsEditingNoteTagsFromState();
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
			psAutoSaveLastSavedText = text;
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
			psVisible = !psVisible;
			savePsVisible();
			applyPsVisible();
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

	refreshPersonalSpace();
	loadAiPrompt();
	loadAiUsePreview();
	applyAiContextMode();
	updateTableMenuVisibility();
})();
