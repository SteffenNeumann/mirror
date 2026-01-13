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

	const params = new URLSearchParams(location.search);
	const defaultWsUrl =
		(location.protocol === "https:" ? "wss:" : "ws:") +
		"//" +
		location.host +
		"/ws";
	// Override möglich: ?ws=wss://example.com/ws
	const wsBaseUrl = params.get("ws") || defaultWsUrl;
	const debug = params.get("debug") === "1";

	const clientId = crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);

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
	shareLink.href = location.pathname + location.search + buildShareHash(room, key);
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
		shareLink.href = location.pathname + location.search + buildShareHash(room, key);
		roomInput.value = room;
		saveRecentRoom(room);
		renderRecentRooms();
		if (!key) toast("Öffentlicher Raum (ohne Key).", "info");
		connect();
	});

	// Initial
	setStatus("offline", "Offline");
	connect();
})();
