import http from "node:http";
import { readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";

const ROOT_DIR = process.env.ROOT_DIR || process.cwd();
const INDEX_PATH = join(ROOT_DIR, "index.html");

function mimeTypeForPath(filePath) {
	const ext = extname(filePath).toLowerCase();
	if (ext === ".html") return "text/html; charset=utf-8";
	if (ext === ".js") return "text/javascript; charset=utf-8";
	if (ext === ".css") return "text/css; charset=utf-8";
	if (ext === ".svg") return "image/svg+xml";
	if (ext === ".png") return "image/png";
	if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
	if (ext === ".ico") return "image/x-icon";
	return "application/octet-stream";
}

function safeJsonParse(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function clampRoom(room) {
	return String(room || "")
		.trim()
		.replace(/[^a-zA-Z0-9_-]/g, "")
		.slice(0, 40);
}

function clampKey(key) {
	return String(key || "")
		.trim()
		.replace(/[^a-zA-Z0-9_-]/g, "")
		.slice(0, 64);
}

function roomKey(room, key) {
	return key ? `${room}:${key}` : room;
}

/**
 * In-memory state (scales horizontally with sticky sessions or external store).
 * roomKey -> { text: string, ts: number }
 */
const roomState = new Map();

/** roomKey -> Set<WebSocket> */
const roomSockets = new Map();

function getRoomSockets(roomKeyName) {
	let set = roomSockets.get(roomKeyName);
	if (!set) {
		set = new Set();
		roomSockets.set(roomKeyName, set);
	}
	return set;
}

function broadcast(roomKeyName, data, except) {
	const payload = JSON.stringify(data);
	for (const socket of getRoomSockets(roomKeyName)) {
		if (socket === except) continue;
		if (socket.readyState !== socket.OPEN) continue;
		socket.send(payload);
	}
}

const server = http.createServer((req, res) => {
	const url = new URL(req.url || "/", `http://${req.headers.host}`);

	if (url.pathname === "/" || url.pathname === "/index.html") {
		try {
			const html = readFileSync(INDEX_PATH);
			res.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8",
				"Cache-Control": "no-store",
			});
			res.end(html);
		} catch {
			res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
			res.end("index.html not found");
		}
		return;
	}

	// Optional static files if you add assets later
	const filePath = join(ROOT_DIR, url.pathname.replace(/^\/+/, ""));
	try {
		const stat = statSync(filePath);
		if (!stat.isFile()) throw new Error("not a file");
		const buf = readFileSync(filePath);
		res.writeHead(200, {
			"Content-Type": mimeTypeForPath(filePath),
			"Cache-Control": "no-store",
		});
		res.end(buf);
	} catch {
		res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("Not found");
	}
});

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws, req) => {
	const url = new URL(req.url || "/ws", `http://${req.headers.host}`);
	const room = clampRoom(url.searchParams.get("room"));
	const key = clampKey(url.searchParams.get("key"));
	const rk = roomKey(room, key);

	if (!room) {
		ws.close(1008, "room required");
		return;
	}

	const sockets = getRoomSockets(rk);
	sockets.add(ws);

	const existing = roomState.get(rk);
	if (existing) {
		ws.send(
			JSON.stringify({
				type: "set",
				room,
				text: existing.text,
				ts: existing.ts,
			})
		);
	}

	ws.on("message", (raw) => {
		const msg = safeJsonParse(String(raw));
		if (!msg || msg.room !== room) return;

		if (msg.type === "set") {
			const ts = typeof msg.ts === "number" ? msg.ts : Date.now();
			const text = typeof msg.text === "string" ? msg.text : "";

			const prev = roomState.get(rk);
			if (prev && prev.ts > ts) return;

			roomState.set(rk, { text, ts });
			broadcast(rk, { type: "set", room, text, ts }, ws);
			return;
		}

		if (msg.type === "request_state") {
			const cur = roomState.get(rk);
			if (cur) {
				ws.send(
					JSON.stringify({ type: "set", room, text: cur.text, ts: cur.ts })
				);
			}
			return;
		}
	});

	ws.on("close", () => {
		sockets.delete(ws);
		if (sockets.size === 0) roomSockets.delete(rk);
	});
});

server.listen(PORT, HOST, () => {
	console.log(`Mirror server running on http://${HOST}:${PORT}`);
	console.log(`WebSocket endpoint: ws://${HOST}:${PORT}/ws?room=<room>`);
});
