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
	const aiUsePreviewToggle = document.getElementById("aiUsePreview");
	const copyMirrorBtn = document.getElementById("copyMirror");
	const codeLangWrap = document.getElementById("codeLangWrap");
	const codeLangSelect = document.getElementById("codeLang");
	const insertCodeBlockBtn = document.getElementById("insertCodeBlock");
	const slashMenu = document.getElementById("slashMenu");
	const slashMenuList = document.getElementById("slashMenuList");
	const mainGrid = document.getElementById("mainGrid");
	const psPanel = document.getElementById("psPanel");
	const togglePersonalSpaceBtn = document.getElementById("togglePersonalSpace");

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
	const psList = document.getElementById("psList");
	const psHint = document.getElementById("psHint");
	const psLogout = document.getElementById("psLogout");
	const psSaveMain = document.getElementById("psSaveMain");
	const psMainHint = document.getElementById("psMainHint");

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
		psEditingNoteTags = stripManualTagsMarker(rawTags);
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
				"/h1 /h2 /h3 · /b (bold) · /i (italic) · /s (strike) · /quote · /ul · /ol · /todo · /done · /tasks · /code [lang] · /link · /hr",
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
		{ cmd: "hr", label: "Horizontal rule", snippet: "/hr" },
		{ cmd: "link", label: "Link", snippet: "/link" },
		{ cmd: "code", label: "Code block", snippet: "/code" },
		{ cmd: "code", label: "Code block (js)", snippet: "/code javascript" },
		{ cmd: "code", label: "Code block (py)", snippet: "/code python" },
	];

	let slashMenuOpen = false;
	let slashMenuItems = [];
	let slashMenuIndex = 0;

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

	let psState = { authed: false, email: "", tags: [], notes: [] };
	let psActiveTags = new Set();
	let psTagFilterMode = "and";
	let psEditingNoteId = "";
	let psEditingNoteKind = "";
	let psEditingNoteTags = [];
	let psEditingNoteTagsOverridden = false;
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
	const PS_ACTIVE_TAGS_KEY = "mirror_ps_active_tags";
	const PS_TAG_FILTER_MODE_KEY = "mirror_ps_tag_filter_mode";
	const PS_TAGS_COLLAPSED_KEY = "mirror_ps_tags_collapsed";
	const PS_SEARCH_QUERY_KEY = "mirror_ps_search_query";
	const PS_VISIBLE_KEY = "mirror_ps_visible";
	const PS_MANUAL_TAGS_MARKER = "__manual_tags__";
	const AI_PROMPT_KEY = "mirror_ai_prompt";
	const AI_USE_PREVIEW_KEY = "mirror_ai_use_preview";
	let aiPrompt = "";
	let aiUsePreview = true;

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
		if (aiUsePreviewToggle) aiUsePreviewToggle.checked = aiUsePreview;
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

	function getAiPrompt() {
		const v = String(
			aiPromptInput && aiPromptInput.value ? aiPromptInput.value : ""
		)
			.trim()
			.slice(0, 800);
		return v;
	}

	function getAiUsePreview() {
		if (!aiUsePreviewToggle) return aiUsePreview;
		return Boolean(aiUsePreviewToggle.checked);
	}

	function stripManualTagsMarker(tags) {
		const arr = Array.isArray(tags) ? tags : [];
		return arr.filter((t) => String(t || "") !== PS_MANUAL_TAGS_MARKER);
	}

	function buildPsTagsPayload(tags, overridden) {
		const cleaned = stripManualTagsMarker(tags);
		return overridden ? [...cleaned, PS_MANUAL_TAGS_MARKER] : cleaned;
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
			const hasFilter = active.length > 0 || !!q;
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
			String(previewRunState && previewRunState.output ? previewRunState.output : "")
				.trim()
		);
		const hasAnyError = Boolean(
			String(previewRunState && previewRunState.error ? previewRunState.error : "")
				.trim()
		);
		const hasAnyStatus = Boolean(
			String(previewRunState && previewRunState.status ? previewRunState.status : "")
				.trim()
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
					/^(https?:|mailto:|tel:)/i.test(String(url || "").trim());
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
		const src = String(textarea && textarea.value ? textarea.value : "");
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
		const allBtn = {
			tag: "",
			label: "All",
		};
		const items = [
			allBtn,
			...safeTags.map((t) => ({ tag: t, label: `#${t}` })),
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

	function renderPsList(notes) {
		if (!psList) return;
		const escapeHtml = (raw) =>
			String(raw || "")
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/\"/g, "&quot;");

		const cleanTitleLine = (line) => {
			let s = String(line || "").trim();
			// headings
			s = s.replace(/^#{1,6}\s+/, "");
			// task list item
			s = s.replace(/^(?:[-*+]|\d+[.)])\s+\[[ xX]\]\s+/, "");
			// bullet/ordered list
			s = s.replace(/^(?:[-*+]|\d+[.)])\s+/, "");
			// blockquote
			s = s.replace(/^>\s+/, "");
			// inline code wrappers
			s = s.replace(/^`+|`+$/g, "");
			return s.trim();
		};

		const getTitleAndExcerpt = (text) => {
			const src = String(text || "").replace(/\r\n?/g, "\n");
			const lines = src.split("\n");
			let title = "";
			let titleLineIndex = -1;
			for (let i = 0; i < lines.length; i++) {
				const line = String(lines[i] || "").trim();
				if (!line) continue;
				title = cleanTitleLine(line);
				titleLineIndex = i;
				break;
			}
			if (!title) title = "Untitled";
			// Excerpt: next non-empty lines after title, flattened.
			let rest = "";
			for (let i = titleLineIndex + 1; i < lines.length; i++) {
				const line = String(lines[i] || "").trim();
				if (!line) continue;
				rest += (rest ? " " : "") + cleanTitleLine(line);
				if (rest.length >= 220) break;
			}
			rest = rest.replace(/\s+/g, " ").trim();
			if (rest.length > 240) rest = rest.slice(0, 240).trim() + "…";
			return { title, excerpt: rest };
		};

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
				const tags = stripManualTagsMarker(Array.isArray(n.tags) ? n.tags : []);
				const showTags = tags.length > 6 ? tags.slice(-6) : tags;
				const chips = showTags
					.map(
						(t) =>
							`<span class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-200">#${t}</span>`
					)
					.join("");
				const info = getTitleAndExcerpt(n && n.text ? n.text : "");
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
				if (!note || !textarea) return;
				psEditingNoteId = id;
				psEditingNoteKind = String(note.kind || "");
				const rawTags = Array.isArray(note.tags) ? note.tags : [];
				psEditingNoteTagsOverridden = rawTags.some(
					(t) => String(t || "") === PS_MANUAL_TAGS_MARKER
				);
				psEditingNoteTags = stripManualTagsMarker(rawTags);
				syncPsEditorTagsInput(true);
				textarea.value = String(note.text || "");
				textarea.focus();
				if (psHint) psHint.textContent = "Editing: editor text updated.";
				updatePsEditingTagsHint();
				if (psMainHint) {
					psMainHint.classList.remove("hidden");
					psMainHint.textContent = "Editing active";
				}
				updatePreview();
				renderPsList(items);
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
			const res = await api("/api/ai", {
				method: "POST",
				body: JSON.stringify({
					mode,
					lang: payloadLang,
					kind,
					code: payloadText,
					prompt: promptForRequest,
				}),
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
			psState = { authed: false, email: "", tags: [], notes: [] };
			if (psHint) psHint.textContent = "";
		}

		if (!psState.authed) {
			psUnauthed.classList.remove("hidden");
			psAuthed.classList.add("hidden");
			if (psLogout) psLogout.classList.add("hidden");
			setPsEditorTagsVisible(false);
			return;
		}

		psUnauthed.classList.add("hidden");
		psAuthed.classList.remove("hidden");
		if (psLogout) psLogout.classList.remove("hidden");
		if (psEmail) psEmail.textContent = psState.email || "";
		setPsEditorTagsVisible(true);

		applyPersonalSpaceFiltersAndRender();
		syncPsEditingNoteTagsFromState();
		syncPsEditorTagsInput();
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
		try {
			if (psHint) psHint.textContent = "Exporting…";
			const res = await api("/api/notes/export");
			const payload =
				res && res.export ? res.export : { version: 1, notes: [] };
			downloadJson(`mirror-notes-${ymd() || "export"}.json`, payload);
			if (psHint) psHint.textContent = "Export ready.";
			toast("Export created.", "success");
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Error";
			if (psHint) psHint.textContent = "Export failed.";
			toast(`Export failed: ${msg}`, "error");
		}
	}

	async function importPersonalSpaceNotes(notes, mode) {
		const m = String(mode || "merge")
			.trim()
			.toLowerCase();
		const safeMode = m === "replace" ? "replace" : "merge";
		try {
			if (psHint) psHint.textContent = "Importing…";
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
			if (psHint) psHint.textContent = "Import complete.";
			await refreshPersonalSpace();
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Error";
			if (psHint) psHint.textContent = "Import failed.";
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

	function loadFavorites() {
		try {
			const raw = localStorage.getItem(FAVORITES_KEY);
			const parsed = JSON.parse(raw || "[]");
			if (!Array.isArray(parsed)) return [];
			return parsed
				.map((it) => {
					const roomName = normalizeRoom(it && it.room);
					const keyName = normalizeKey(it && it.key);
					const addedAt = Number(it && it.addedAt) || 0;
					if (!roomName) return null;
					return { room: roomName, key: keyName, addedAt };
				})
				.filter(Boolean);
		} catch {
			return [];
		}
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
		const options = favs
			.map((f) => {
				const value = buildShareHash(f.room, f.key);
				const label = f.key ? `${f.room} (privat)` : f.room;
				return `<option value="${value}">${label}</option>`;
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

	function wsUrlForRoom(base, roomName, keyName) {
		// Viele Relays verwenden Query-Parameter. Falls dein Relay anders ist,
		// setze ?ws=wss://... passend oder passe diese Funktion an.
		const url = new URL(base, location.href);
		url.searchParams.set("room", roomName);
		if (keyName) url.searchParams.set("key", keyName);
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

	function scheduleSend() {
		if (suppressSend) return;
		window.clearTimeout(sendTimer);
		sendTimer = window.setTimeout(() => {
			const text = textarea.value;
			if (text === lastLocalText) return;

			lastLocalText = text;
			const ts = Date.now();
			sendMessage({ type: "set", room, text, ts, clientId });
			metaLeft.textContent = "Gesendet.";
			metaRight.textContent = nowIso();
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
		const url = wsUrlForRoom(wsBaseUrl, room, key);
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
				applyRemoteText(msg.text, msg.ts);
			}

			if (msg.type === "request_state") {
				// Zustand an neue Teilnehmer schicken
				sendMessage({
					type: "set",
					room,
					text: textarea.value,
					ts: Date.now(),
					clientId,
				});
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
		toggleFavoriteBtn.addEventListener("click", () => {
			const roomName = normalizeRoom(room);
			const keyName = normalizeKey(key);
			if (!roomName) return;
			const favs = loadFavorites();
			const idx = favs.findIndex(
				(f) => f.room === roomName && f.key === keyName
			);
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

	textarea.addEventListener("input", () => {
		metaLeft.textContent = "Typing…";
		scheduleSend();
		updatePreview();
		updateSlashMenu();
		updateCodeLangOverlay();
	});

	textarea.addEventListener("click", () => {
		updateSlashMenu();
		updateCodeLangOverlay();
	});

	textarea.addEventListener("focus", () => {
		updateCodeLangOverlay();
	});

	textarea.addEventListener("keyup", () => {
		updateCodeLangOverlay();
	});

	textarea.addEventListener("keydown", (ev) => {
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

	window.addEventListener("hashchange", () => {
		const parsed = parseRoomAndKeyFromHash();
		const nextRoom = parsed.room;
		const nextKey = parsed.key;
		if (!nextRoom) return;
		if (nextRoom === room && nextKey === key) return;
		room = nextRoom;
		key = nextKey;
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
	loadPsVisible();
	applyPsVisible();

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
	if (psSaveMain) {
		psSaveMain.addEventListener("click", async () => {
			const text = String(
				textarea && textarea.value ? textarea.value : ""
			).trim();
			if (!text) return;
			if (!psState || !psState.authed) {
				toast("Please enable Personal Space first (sign in).", "error");
				return;
			}
			try {
				const tagsPayload = buildPsTagsPayload(
					Array.isArray(psEditingNoteTags) ? psEditingNoteTags : [],
					psEditingNoteTagsOverridden
				);
				if (psHint)
					psHint.textContent = psEditingNoteId ? "Updating…" : "Saving…";
				if (!psEditingNoteId) {
					const res = await api("/api/notes", {
						method: "POST",
						body: JSON.stringify({
							text,
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
					if (psHint) psHint.textContent = "Saved.";
				} else {
					const res = await api(
						`/api/notes/${encodeURIComponent(psEditingNoteId)}`,
						{
							method: "PUT",
							body: JSON.stringify({
								text,
								tags: tagsPayload,
							}),
						}
					);
					const saved = res && res.note ? res.note : null;
					if (saved && saved.id && psState && psState.authed) {
						const notes = Array.isArray(psState.notes) ? psState.notes : [];
						const id = String(saved.id);
						const idx = notes.findIndex(
							(n) => String(n && n.id ? n.id : "") === id
						);
						psState.notes =
							idx >= 0
								? [...notes.slice(0, idx), saved, ...notes.slice(idx + 1)]
								: [saved, ...notes];
						applyPersonalSpaceFiltersAndRender();
						syncPsEditingNoteTagsFromState();
					}
					if (psHint) psHint.textContent = "Updated.";
				}
				toast("Personal Space: saved.", "success");
				await refreshPersonalSpace();
			} catch (e) {
				if (psHint) psHint.textContent = "Not saved (sign in?).";
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
	if (aiUsePreviewToggle) {
		aiUsePreviewToggle.addEventListener("change", () => {
			saveAiUsePreview(Boolean(aiUsePreviewToggle.checked));
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
})();
