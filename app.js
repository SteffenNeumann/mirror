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
	const metaLeft = document.getElementById("metaLeft");
	const metaRight = document.getElementById("metaRight");
	const toastRoot = document.getElementById("toastRoot");
	const editorPreviewGrid = document.getElementById("editorPreviewGrid");
	const previewPanel = document.getElementById("previewPanel");
	const mdPreview = document.getElementById("mdPreview");
	const togglePreview = document.getElementById("togglePreview");

	// Personal Space elements (optional)
	const psUnauthed = document.getElementById("psUnauthed");
	const psAuthed = document.getElementById("psAuthed");
	const addPersonalSpaceBtn = document.getElementById("addPersonalSpace");
	const psDevLink = document.getElementById("psDevLink");
	const psEmail = document.getElementById("psEmail");
	const psTags = document.getElementById("psTags");
	const psNewNote = document.getElementById("psNewNote");
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
	let psActiveTag = "";
	let psEditingNoteId = "";
	let psEditingNoteKind = "";
	let psEditingNoteTags = [];
	let previewOpen = false;
	let md;
	const clearMirrorBtn = document.getElementById("clearMirror");

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

	function renderNoteHtml(note) {
		const renderer = ensureMarkdown();
		const text = String((note && note.text) || "");
		const kind = String((note && note.kind) || "");
		const tags = Array.isArray(note && note.tags) ? note.tags : [];
		if (!renderer) {
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
			return `<div class="md-content mt-2">${renderer.render(src)}</div>`;
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
			? "grid grid-cols-1 gap-3 lg:grid-cols-2"
			: "grid grid-cols-1 gap-3 lg:grid-cols-1";
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
			mdPreview.srcdoc = `<!doctype html><html lang="de"><head><meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<style>:root{color-scheme:dark;}body{margin:0;padding:16px;font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,Noto Sans,sans-serif;background:#020617;color:#e2e8f0;}a{color:#60a5fa;}</style>
			</head><body><!--ts:${stamp}--><strong>Markdown Preview nicht verfügbar.</strong><div style="margin-top:8px;color:#94a3b8">Bitte Seite neu laden oder CDN-Blocking (AdBlock/Corporate Proxy) prüfen.</div></body></html>`;
			return;
		}
		const src = String(textarea && textarea.value ? textarea.value : "");
		let bodyHtml = "";
		try {
			bodyHtml = renderer.render(src);
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
		// Safari kann srcdoc-Updates gelegentlich "verschlucken"; leeren + neu setzen ist stabiler.
		try {
			mdPreview.srcdoc = "";
		} catch {
			// ignore
		}
		mdPreview.srcdoc = doc;
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
				const active = it.tag === psActiveTag;
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
				psActiveTag = btn.getAttribute("data-tag") || "";
				await refreshPersonalSpace();
			});
		});
	}

	function renderPsList(notes) {
		if (!psList) return;
		const items = Array.isArray(notes) ? notes : [];
		if (items.length === 0) {
			psList.innerHTML =
				'<div class="text-xs text-slate-400">Noch keine Notizen.</div>';
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

		let notes = Array.isArray(psState.notes) ? psState.notes : [];
		if (psActiveTag) {
			notes = notes.filter((n) => (n.tags || []).includes(psActiveTag));
		}
		renderPsTags(psState.tags || []);
		renderPsList(notes);
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
		if (!key) toast("Öffentlicher Raum (ohne Key).", "info");
		connect();
	});

	// Initial
	setStatus("offline", "Offline");
	connect();

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
	if (psLogout) {
		psLogout.addEventListener("click", async () => {
			try {
				await api("/api/logout", { method: "POST", body: "{}" });
				psActiveTag = "";
				toast("Abgemeldet.", "success");
				await refreshPersonalSpace();
			} catch {
				toast("Abmelden fehlgeschlagen.", "error");
			}
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
