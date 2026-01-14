// Minimalistische Echtzeit-Synchronisation.
// Für Produktion: eigenen WebSocket-Server oder einen Realtime-Provider einsetzen.
(function () {
	const textarea = document.getElementById("mirror");
	const statusDot = document.getElementById("statusDot");
	const statusText = document.getElementById("statusText");
	const roomLabel = document.getElementById("roomLabel");
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
	const editorPreviewGrid = document.getElementById("editorPreviewGrid");
	const previewPanel = document.getElementById("previewPanel");
	const mdPreview = document.getElementById("mdPreview");
	const togglePreview = document.getElementById("togglePreview");
	const runPreviewBtn = document.getElementById("runPreview");
	const clearRunOutputBtn = document.getElementById("clearRunOutput");
	const runOutputEl = document.getElementById("runOutput");
	const runStatusEl = document.getElementById("runStatus");
	const copyMirrorBtn = document.getElementById("copyMirror");
	const codeLangSelect = document.getElementById("codeLang");
	const insertCodeBlockBtn = document.getElementById("insertCodeBlock");

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
	const psExportNotesBtn = document.getElementById("psExportNotes");
	const psImportModeSelect = document.getElementById("psImportMode");
	const psImportNotesBtn = document.getElementById("psImportNotes");
	const psImportFileInput = document.getElementById("psImportFile");
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

	async function api(path, opts) {
		const res = await fetch(path, {
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			...opts,
		});
		const text = await res.text();
		const data = safeJsonParse(text);
		if (!res.ok) {
			const msg = (data && data.error) || `HTTP ${res.status}`;
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

	let psState = { authed: false, email: "", tags: [], notes: [] };
	let psActiveTags = new Set();
	let psTagFilterMode = "and";
	let psEditingNoteId = "";
	let psEditingNoteKind = "";
	let psEditingNoteTags = [];
	let previewOpen = false;
	let md;
	const clearMirrorBtn = document.getElementById("clearMirror");
	let mdLibWarned = false;
	let previewObjectUrl = "";
	let psRunOutputById = new Map();
	let pyRunnerWorker = null;
	let pyRunnerSeq = 0;
	let pyRuntimeWarmed = false;
	let jsRunnerFrame = null;
	let jsRunnerPending = new Map();
	let previewRunState = { status: "", output: "", error: "" };
	let psNextImportMode = "merge";
	let psSearchQuery = "";
	let psSearchDebounceTimer = 0;
	const PS_ACTIVE_TAGS_KEY = "mirror_ps_active_tags";
	const PS_TAG_FILTER_MODE_KEY = "mirror_ps_tag_filter_mode";
	const PS_TAGS_COLLAPSED_KEY = "mirror_ps_tags_collapsed";
	const PS_SEARCH_QUERY_KEY = "mirror_ps_search_query";
	let psTagsCollapsed = false;

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
		let notes = Array.isArray(psState.notes) ? psState.notes : [];
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

	function setPreviewRunOutput(state) {
		previewRunState = state || { status: "", output: "", error: "" };
		if (runStatusEl) runStatusEl.textContent = previewRunState.status || "";
		if (!runOutputEl) return;
		const combined =
			(previewRunState.output ? String(previewRunState.output) : "") +
			(previewRunState.error
				? (previewRunState.output ? "\n" : "") + String(previewRunState.error)
				: "");
		runOutputEl.innerHTML = escapeHtml(combined);
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
		metaLeft.textContent = "Codeblock eingefügt.";
		metaRight.textContent = nowIso();
		updatePreview();
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
				toast("Markdown-Rendering: Bibliotheken nicht geladen (CDN).", "error");
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
			togglePreview.textContent = previewOpen ? "Preview aus" : "Preview";
		}
		if (previewOpen) {
			const renderer = ensureMarkdown();
			if (!renderer) {
				toast("Markdown-Preview: Bibliothek nicht geladen (CDN).", "error");
			}
			updatePreview();
		}
	}

	function updatePreview() {
		if (!previewOpen || !mdPreview) return;
		const renderer = ensureMarkdown();
		const stamp = Date.now();
		if (!renderer) {
			const fallbackDoc = `<!doctype html><html lang="de"><head><meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<style>:root{color-scheme:dark;}body{margin:0;padding:16px;font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,Noto Sans,sans-serif;background:#020617;color:#e2e8f0;}a{color:#60a5fa;}</style>
			</head><body><!--ts:${stamp}--><strong>Markdown Preview nicht verfügbar.</strong><div style="margin-top:8px;color:#94a3b8">Bitte Seite neu laden oder CDN-Blocking (AdBlock/Corporate Proxy) prüfen.</div></body></html>`;
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

		const doc = `<!doctype html>
<html lang="de">
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
    ul.task-list input[type=checkbox]{margin-top:.2rem;}
  </style>
</head>
<body>
  <div id="content">${bodyHtml}</div>
</body>
</html>`;
		setPreviewDocument(doc);
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
			label: "Alle",
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
		const items = Array.isArray(notes) ? notes : [];
		if (items.length === 0) {
			const q = normalizeSearchQuery(psSearchQuery);
			psList.innerHTML = q
				? '<div class="text-xs text-slate-400">Keine Treffer.</div>'
				: '<div class="text-xs text-slate-400">Noch keine Notizen.</div>';
			return;
		}
		const byId = new Map(items.map((n) => [String(n.id || ""), n]));
		psList.innerHTML = items
			.map((n) => {
				const id = String(n.id || "");
				const active = id && id === psEditingNoteId;
				const tags = Array.isArray(n.tags) ? n.tags : [];
				const chips = tags
					.slice(0, 6)
					.map(
						(t) =>
							`<span class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-200">#${t}</span>`
					)
					.join(" ");
				const bodyHtml = renderNoteHtml(n);
				return `
					<div data-note-id="${id}" class="group relative cursor-pointer rounded-xl border ${
					active
						? "border-fuchsia-400/40 bg-fuchsia-500/10"
						: "border-white/10 bg-slate-950/25 hover:bg-slate-950/35"
				} p-3">
						<button
							type="button"
							data-action="delete"
							class="absolute right-2 top-2 hidden rounded-md border border-white/10 bg-slate-950/60 p-1.5 text-slate-200 shadow-soft backdrop-blur transition group-hover:flex hover:bg-slate-950/80"
										title="Löschen">
							<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M3 6h18" />
								<path d="M8 6V4h8v2" />
								<path d="M19 6l-1 14H6L5 6" />
								<path d="M10 11v6" />
								<path d="M14 11v6" />
							</svg>
						</button>
						<div class="flex items-center justify-between gap-2">
							<div class="text-xs text-slate-400">${fmtDate(n.createdAt)}</div>
							<div class="text-[11px] text-slate-300">${chips}</div>
						</div>
						<div class="max-h-40 overflow-hidden">${bodyHtml}</div>
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
				psEditingNoteTags = Array.isArray(note.tags) ? note.tags : [];
				textarea.value = String(note.text || "");
				textarea.focus();
				if (psHint) psHint.textContent = "Bearbeiten: Text rechts angepasst.";
				if (psMainHint) {
					psMainHint.classList.remove("hidden");
					psMainHint.textContent = "Bearbeiten aktiv";
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
					if (!window.confirm("Notiz wirklich löschen?")) return;
					try {
						await api(`/api/notes/${encodeURIComponent(id)}`, {
							method: "DELETE",
						});
						if (psEditingNoteId === id) {
							psEditingNoteId = "";
							if (psMainHint) psMainHint.classList.add("hidden");
						}
						toast("Notiz gelöscht.", "success");
						await refreshPersonalSpace();
					} catch {
						toast("Löschen fehlgeschlagen.", "error");
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
		if (!data || data.type !== "mirror_js_run_result") return;
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
			const frame = ensureJsRunnerFrame();
			if (!frame || !frame.contentWindow) {
				resolve({ output: "", error: "JS Runner nicht verfügbar." });
				return;
			}
			const id = `js_${Date.now()}_${Math.random().toString(16).slice(2)}`;
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
				// Kill runaway scripts by replacing the runner frame
				try {
					if (jsRunnerFrame) jsRunnerFrame.remove();
				} catch {
					// ignore
				}
				jsRunnerFrame = null;
				resolve({ output: "", error: `Timeout nach ${timeoutMs}ms.` });
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
  const orig = { log: console.log, warn: console.warn, error: console.error };
  console.log = (...a)=>logs.push(a.map(String).join(' '));
  console.warn = (...a)=>logs.push(a.map(String).join(' '));
  console.error = (...a)=>logs.push(a.map(String).join(' '));
  try {
    (function(){ ${code}\n })();
    send(logs.join('\n'), '');
  } catch (e) {
    send(logs.join('\n'), (e && e.stack) ? String(e.stack) : String(e));
  } finally {
    console.log = orig.log; console.warn = orig.warn; console.error = orig.error;
  }
})();
<\/script></body></html>`;
			try {
				// Prefer Blob URL over srcdoc (stabiler mit sandbox, insbesondere in Safari)
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
						error: "JS Runner konnte nicht gestartet werden.",
					});
				}
			}
		});
	}

	function ensurePyRunnerWorker() {
		if (pyRunnerWorker) return pyRunnerWorker;
		try {
			const workerCode = `
let pyodide = null;
let pyodideReady = null;

async function ensurePyodide() {
  if (pyodide) return pyodide;
  if (!pyodideReady) {
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js');
    pyodideReady = loadPyodide();
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
			URL.revokeObjectURL(url);
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
				resolve({ output: "", error: "Python Runner nicht verfügbar." });
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
				resolve({ output: "", error: `Timeout nach ${timeoutMs}ms.` });
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
				resolve({ output: "", error: "Python Runner konnte nicht starten." });
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
			res = { output: "", error: `Nicht unterstützt: ${lang || "unknown"}` };
		}
		if (lang === "python" || lang === "py") {
			// Mark runtime warmed if we got any non-timeout response
			if (!/Timeout nach/i.test(String(res.error || "")))
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
		if (err) toast("Snippet-Fehler (siehe Ausgabe).", "error");
	}

	async function warmPythonRuntime() {
		if (pyRuntimeWarmed) return { ok: true };
		setPreviewRunOutput({
			status: "Python lädt…",
			output: "",
			error: "",
		});
		const res = await runPySnippet("pass", PY_TIMEOUT_COLD_MS);
		if (res && res.error && /Timeout nach/i.test(String(res.error))) {
			return {
				ok: false,
				error:
					"Python-Init Timeout. Vermutlich Pyodide-CDN blockiert oder Netzwerk zu langsam.",
			};
		}
		if (res && res.error) {
			return {
				ok: false,
				error: String(res.error || "Python konnte nicht initialisiert werden."),
			};
		}
		pyRuntimeWarmed = true;
		return { ok: true };
	}

	async function runSnippetFromPreview() {
		const parsed = parseRunnableFromEditor();
		if (!parsed) {
			setPreviewRunOutput({ status: "", output: "", error: "" });
			toast(
				"Kein ausführbarer Code gefunden. Nutze #lang-python/#lang-js oder einen ```lang Codeblock.",
				"info"
			);
			return;
		}
		const lang = String(parsed.lang || "").toLowerCase();
		const code = String(parsed.code || "");
		setPreviewRunOutput({ status: "läuft…", output: "", error: "" });
		const timeoutMs =
			lang === "python" || lang === "py"
				? pyRuntimeWarmed
					? PY_TIMEOUT_WARM_MS
					: PY_TIMEOUT_COLD_MS
				: JS_TIMEOUT_MS;
		let res = { output: "", error: "" };
		if (lang === "python" || lang === "py") {
			if (!pyRuntimeWarmed) {
				const warm = await warmPythonRuntime();
				if (!warm.ok) {
					setPreviewRunOutput({
						status: "Fehler",
						output: "",
						error: String(
							warm.error || "Python konnte nicht initialisiert werden."
						),
					});
					toast("Run: Fehler (siehe Ausgabe).", "error");
					return;
				}
				setPreviewRunOutput({ status: "läuft…", output: "", error: "" });
			}
			res = await runPySnippet(code, timeoutMs);
			if (!/Timeout nach/i.test(String(res.error || "")))
				pyRuntimeWarmed = true;
		} else if (
			lang === "javascript" ||
			lang === "js" ||
			lang === "javascript" ||
			lang === "node"
		) {
			res = await runJsSnippet(code, timeoutMs);
		} else {
			res = { output: "", error: `Nicht unterstützt: ${lang || "unknown"}` };
		}
		setPreviewRunOutput({
			status: res.error ? "Fehler" : "fertig",
			output: String(res.output || "").slice(0, 8000),
			error: String(res.error || "").slice(0, 8000),
		});
		if (res.error) toast("Run: Fehler (siehe Ausgabe).", "error");
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
			return;
		}

		psUnauthed.classList.add("hidden");
		psAuthed.classList.remove("hidden");
		if (psLogout) psLogout.classList.remove("hidden");
		if (psEmail) psEmail.textContent = psState.email || "";

		applyPersonalSpaceFiltersAndRender();
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
			toast("Export fehlgeschlagen.", "error");
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
			toast("Bitte erst Personal Space aktivieren (Login).", "error");
			return;
		}
		try {
			if (psHint) psHint.textContent = "Exportiere…";
			const res = await api("/api/notes/export");
			const payload =
				res && res.export ? res.export : { version: 1, notes: [] };
			downloadJson(`mirror-notes-${ymd() || "export"}.json`, payload);
			if (psHint) psHint.textContent = "Export bereit.";
			toast("Export erstellt.", "success");
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Fehler";
			if (psHint) psHint.textContent = "Export fehlgeschlagen.";
			toast(`Export fehlgeschlagen: ${msg}`, "error");
		}
	}

	async function importPersonalSpaceNotes(notes, mode) {
		const m = String(mode || "merge")
			.trim()
			.toLowerCase();
		const safeMode = m === "replace" ? "replace" : "merge";
		try {
			if (psHint) psHint.textContent = "Importiere…";
			const res = await api("/api/notes/import", {
				method: "POST",
				body: JSON.stringify({ mode: safeMode, notes }),
			});
			toast(
				`Import fertig: ${res.imported || 0} neu, ${
					res.updated || 0
				} aktualisiert, ${res.skipped || 0} übersprungen.`,
				"success"
			);
			if (psHint) psHint.textContent = "Import fertig.";
			await refreshPersonalSpace();
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "Fehler";
			if (psHint) psHint.textContent = "Import fehlgeschlagen.";
			toast(`Import fehlgeschlagen: ${msg}`, "error");
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
			toast("Import: ungültige JSON-Datei.", "error");
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
			toast("Import: keine Notizen gefunden.", "error");
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
			toast("Import fehlgeschlagen (Datei lesen).", "error");
			return;
		}
		if (isJson) {
			await importPersonalSpaceNotesFromText(text, mode);
			return;
		}
		const notes = chunkTextIntoNotes(text, name || "import.md");
		if (!notes.length) {
			toast("Import: Datei ist leer.", "error");
			return;
		}
		await importPersonalSpaceNotes(notes, mode);
	}

	function startNotesImport(mode) {
		if (!psImportFileInput) return;
		if (!psState || !psState.authed) {
			toast("Bitte erst Personal Space aktivieren (Login).", "error");
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
		const raw = window.prompt("E-Mail-Adresse für deinen Personal Space:");
		const email = String(raw || "").trim();
		if (!email) return;
		try {
			const res = await api("/api/personal-space/request-link", {
				method: "POST",
				body: JSON.stringify({ email }),
			});
			if (res.sent) {
				toast("Link gesendet. Bitte E-Mail prüfen.", "success");
				if (psDevLink) psDevLink.classList.add("hidden");
				return;
			}
			// Dev-/Fallback: Link anzeigen (nur wenn Server ihn explizit zurückgibt)
			if (psDevLink && res.link) {
				toast("SMTP/Versand nicht aktiv – Link wird angezeigt (Dev).", "info");
				psDevLink.classList.remove("hidden");
				psDevLink.innerHTML = `<div class="text-slate-300">Verifizierungs-Link:</div><a class="mt-1 block break-all underline decoration-white/20 underline-offset-4 hover:decoration-white/50" href="${res.link}">${res.link}</a>`;
				return;
			}
			if (psDevLink) psDevLink.classList.add("hidden");
			const reason = res && res.reason ? String(res.reason) : "unknown";
			const hint =
				reason === "smtp_not_configured"
					? "SMTP ist nicht konfiguriert."
					: reason === "smtp_incomplete"
					? "SMTP Secrets sind unvollständig."
					: reason === "send_failed"
					? "SMTP Versand fehlgeschlagen."
					: "SMTP/Setup prüfen.";
			toast(`E-Mail nicht versendet: ${hint} (${reason})`, "error");
		} catch (e) {
			const msg = e && e.message ? String(e.message) : "unbekannter Fehler";
			toast(`Link konnte nicht erstellt werden: ${msg}`, "error");
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

		metaLeft.textContent = "Synchronisiert.";
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

		setStatus("connecting", "Verbinde…");
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
			metaLeft.textContent = "Online. Warte auf Updates…";
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
			setStatus("offline", "Offline – Reconnect…");
			metaLeft.textContent = "Verbindung verloren. Prüfe Server/Netzwerk.";
			reconnectTimer = window.setTimeout(connect, 900);
		});

		ws.addEventListener("error", () => {
			if (mySeq !== connectionSeq) return;
			setStatus("offline", "WebSocket nicht erreichbar");
			metaLeft.textContent = "Keine Verbindung. Läuft der Server (npm start)?";
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
				toast("Favorit entfernt.", "info");
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
				toast("Favorit gespeichert.", "success");
			}
			updateFavoritesUI();
		});
	}

	copyLinkBtn.addEventListener("click", async () => {
		const href = shareLink.href;
		try {
			await navigator.clipboard.writeText(href);
			toast("Link kopiert.", "success");
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
				toast("Link kopiert.", "success");
			} catch {
				toast("Kopieren nicht möglich.", "error");
			}
		}
	});

	if (copyMirrorBtn && textarea) {
		copyMirrorBtn.addEventListener("click", async () => {
			const value = String(textarea.value || "");
			if (!value) {
				toast("Nichts zu kopieren.", "info");
				return;
			}
			try {
				await navigator.clipboard.writeText(value);
				toast("Text kopiert.", "success");
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
					toast("Text kopiert.", "success");
				} catch {
					toast("Kopieren nicht möglich.", "error");
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
		metaLeft.textContent = "Tippen…";
		scheduleSend();
		updatePreview();
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
		if (!key) toast("Öffentlicher Raum (ohne Key).", "info");
		connect();
	});

	// Initial
	setStatus("offline", "Offline");
	connect();
	loadPsTagPrefs();
	loadPsTagsCollapsed();
	applyPsTagsCollapsed();
	loadPsSearchQuery();

	// Personal Space wiring
	if (addPersonalSpaceBtn) {
		addPersonalSpaceBtn.addEventListener("click", requestPersonalSpaceLink);
	}
	if (psNewNote) {
		psNewNote.addEventListener("click", () => {
			psEditingNoteId = "";
			psEditingNoteKind = "";
			psEditingNoteTags = [];
			if (textarea) {
				textarea.value = "";
				textarea.focus();
			}
			if (psMainHint) psMainHint.classList.add("hidden");
			if (psHint) psHint.textContent = "Neuer Eintrag.";
			metaLeft.textContent = "Bereit.";
			metaRight.textContent = "";
			updatePreview();
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
			if (
				mode === "replace" &&
				!window.confirm(
					"Import ersetzen löscht alle vorhandenen Notizen. Wirklich fortfahren?"
				)
			)
				return;
			startNotesImport(mode);
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
			if (!window.confirm("Eingabe wirklich löschen?")) return;
			textarea.value = "";
			textarea.focus();
			metaLeft.textContent = "Geleert.";
			metaRight.textContent = nowIso();
			updatePreview();
			scheduleSend();
		});
	}
	if (psSaveMain) {
		psSaveMain.addEventListener("click", async () => {
			const text = String(
				textarea && textarea.value ? textarea.value : ""
			).trim();
			if (!text) return;
			if (!psState || !psState.authed) {
				toast("Bitte erst Personal Space aktivieren (Login).", "error");
				return;
			}
			try {
				if (psHint)
					psHint.textContent = psEditingNoteId ? "Aktualisiere…" : "Speichere…";
				if (!psEditingNoteId) {
					await api("/api/notes", {
						method: "POST",
						body: JSON.stringify({ text }),
					});
					if (psHint) psHint.textContent = "Gespeichert.";
				} else {
					await api(`/api/notes/${encodeURIComponent(psEditingNoteId)}`, {
						method: "PUT",
						body: JSON.stringify({ text }),
					});
					if (psHint) psHint.textContent = "Aktualisiert.";
				}
				toast("Personal Space: gespeichert.", "success");
				await refreshPersonalSpace();
			} catch (e) {
				if (psHint) psHint.textContent = "Nicht gespeichert (Login?).";
				const msg = e && e.message ? String(e.message) : "Fehler";
				toast(`Speichern fehlgeschlagen: ${msg}`, "error");
			}
		});
	}
	if (togglePreview) {
		togglePreview.addEventListener("click", () => {
			setPreviewVisible(!previewOpen);
		});
	}
	if (runPreviewBtn) {
		runPreviewBtn.addEventListener("click", async () => {
			await runSnippetFromPreview();
		});
	}
	if (clearRunOutputBtn) {
		clearRunOutputBtn.addEventListener("click", () => {
			setPreviewRunOutput({ status: "", output: "", error: "" });
		});
	}
	if (psLogout) {
		psLogout.addEventListener("click", async () => {
			try {
				await api("/api/logout", { method: "POST", body: "{}" });
				psActiveTags = new Set();
				savePsTagPrefs();
				toast("Abgemeldet.", "success");
				await refreshPersonalSpace();
			} catch {
				toast("Abmelden fehlgeschlagen.", "error");
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
})();
