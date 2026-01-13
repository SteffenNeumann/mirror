import http from "node:http";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import crypto from "node:crypto";
import { WebSocketServer } from "ws";
import Database from "better-sqlite3";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";

const ROOT_DIR = process.env.ROOT_DIR || process.cwd();
const INDEX_PATH = join(ROOT_DIR, "index.html");
const DB_PATH =
	process.env.MIRROR_DB_PATH || join(ROOT_DIR, "data", "mirror.sqlite");

const SESSION_COOKIE = "mirror_ps";
const MAGIC_LINK_TTL_MS = 1000 * 60 * 30; // 30 min
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const MAX_BODY_BYTES = 1024 * 1024; // 1MB

let signingSecret = String(process.env.MIRROR_SECRET || "");

let db;
let stmtUserGet;
let stmtUserInsert;
let stmtNoteInsert;
let stmtNotesByUser;
let stmtNotesByUserAndTag;
let stmtTagsByUser;
let stmtTokenInsert;
let stmtTokenGet;
let stmtTokenDelete;
let stmtMetaGet;
let stmtMetaInsert;

function ensureDbDir() {
	try {
		mkdirSync(dirname(DB_PATH), { recursive: true });
	} catch {
		// ignore
	}
}

function initDb() {
	if (db) return;
	ensureDbDir();
	db = new Database(DB_PATH);
	db.pragma("journal_mode = WAL");
	db.pragma("foreign_keys = ON");

	db.exec(`
		CREATE TABLE IF NOT EXISTS meta (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT NOT NULL UNIQUE,
			created_at INTEGER NOT NULL
		);
		CREATE TABLE IF NOT EXISTS notes (
			id TEXT PRIMARY KEY,
			user_id INTEGER NOT NULL,
			text TEXT NOT NULL,
			kind TEXT NOT NULL,
			tags_json TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
		);
		CREATE INDEX IF NOT EXISTS idx_notes_user_created ON notes(user_id, created_at DESC);
		CREATE TABLE IF NOT EXISTS login_tokens (
			token TEXT PRIMARY KEY,
			email TEXT NOT NULL,
			exp INTEGER NOT NULL
		);
		CREATE INDEX IF NOT EXISTS idx_login_tokens_exp ON login_tokens(exp);
	`);

	stmtUserGet = db.prepare("SELECT id, email FROM users WHERE email = ?");
	stmtUserInsert = db.prepare(
		"INSERT INTO users(email, created_at) VALUES(?, ?) ON CONFLICT(email) DO NOTHING"
	);
	stmtNoteInsert = db.prepare(
		"INSERT INTO notes(id, user_id, text, kind, tags_json, created_at) VALUES(?, ?, ?, ?, ?, ?)"
	);
	stmtNotesByUser = db.prepare(
		"SELECT id, text, kind, tags_json, created_at FROM notes WHERE user_id = ? ORDER BY created_at DESC LIMIT 500"
	);
	stmtNotesByUserAndTag = db.prepare(
		"SELECT id, text, kind, tags_json, created_at FROM notes WHERE user_id = ? AND tags_json LIKE ? ORDER BY created_at DESC LIMIT 500"
	);
	stmtTagsByUser = db.prepare(
		"SELECT tags_json FROM notes WHERE user_id = ? ORDER BY created_at DESC LIMIT 500"
	);
	stmtTokenInsert = db.prepare(
		"INSERT INTO login_tokens(token, email, exp) VALUES(?, ?, ?)"
	);
	stmtTokenGet = db.prepare(
		"SELECT token, email, exp FROM login_tokens WHERE token = ?"
	);
	stmtTokenDelete = db.prepare("DELETE FROM login_tokens WHERE token = ?");
	stmtMetaGet = db.prepare("SELECT value FROM meta WHERE key = ?");
	stmtMetaInsert = db.prepare(
		"INSERT INTO meta(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
	);
}

function getSigningSecret() {
	if (signingSecret) return signingSecret;
	initDb();
	const row = stmtMetaGet.get("signing_secret");
	if (row && typeof row.value === "string" && row.value.length >= 16) {
		signingSecret = row.value;
		return signingSecret;
	}
	signingSecret = crypto.randomBytes(32).toString("hex");
	stmtMetaInsert.run("signing_secret", signingSecret);
	return signingSecret;
}

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

function json(res, statusCode, obj) {
	const payload = JSON.stringify(obj);
	res.writeHead(statusCode, {
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "no-store",
	});
	res.end(payload);
}

function text(res, statusCode, body) {
	res.writeHead(statusCode, {
		"Content-Type": "text/plain; charset=utf-8",
		"Cache-Control": "no-store",
	});
	res.end(body);
}

function redirect(res, location, setCookieValue) {
	const headers = {
		Location: location,
		"Cache-Control": "no-store",
	};
	if (setCookieValue) headers["Set-Cookie"] = setCookieValue;
	res.writeHead(302, headers);
	res.end();
}

function parseCookies(req) {
	const header = String(req.headers.cookie || "");
	const out = {};
	for (const part of header.split(";")) {
		const idx = part.indexOf("=");
		if (idx === -1) continue;
		const k = part.slice(0, idx).trim();
		const v = part.slice(idx + 1).trim();
		if (!k) continue;
		out[k] = decodeURIComponent(v);
	}
	return out;
}

function cookieOptions() {
	const parts = ["Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=2592000"];
	if (process.env.NODE_ENV === "production") parts.push("Secure");
	return parts.join("; ");
}

function sign(value) {
	return crypto
		.createHmac("sha256", getSigningSecret())
		.update(value)
		.digest("base64url");
}

function makeSessionCookie(email) {
	const exp = Date.now() + SESSION_TTL_MS;
	const payload = Buffer.from(JSON.stringify({ email, exp }), "utf8").toString(
		"base64url"
	);
	const raw = `${payload}.${sign(payload)}`;
	return `${SESSION_COOKIE}=${encodeURIComponent(raw)}; ${cookieOptions()}`;
}

function clearSessionCookie() {
	const parts = ["Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
	if (process.env.NODE_ENV === "production") parts.push("Secure");
	return `${SESSION_COOKIE}=; ${parts.join("; ")}`;
}

function getAuthedEmail(req) {
	const cookies = parseCookies(req);
	const raw = cookies[SESSION_COOKIE];
	if (!raw) return "";
	const [payload, sig] = String(raw).split(".");
	if (!payload || !sig) return "";
	if (sign(payload) !== sig) return "";
	let decoded;
	try {
		decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
	} catch {
		return "";
	}
	if (!decoded || typeof decoded !== "object") return "";
	if (typeof decoded.exp !== "number" || Date.now() > decoded.exp) return "";
	return typeof decoded.email === "string" ? decoded.email : "";
}

function normalizeEmail(raw) {
	const email = String(raw || "")
		.trim()
		.toLowerCase();
	if (email.length > 254) return "";
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "";
	return email;
}

function readBody(req) {
	return new Promise((resolve, reject) => {
		let size = 0;
		let buf = "";
		req.setEncoding("utf8");
		req.on("data", (chunk) => {
			size += chunk.length;
			if (size > MAX_BODY_BYTES) {
				reject(new Error("body_too_large"));
				req.destroy();
				return;
			}
			buf += chunk;
		});
		req.on("end", () => resolve(buf));
		req.on("error", reject);
	});
}

async function readJson(req) {
	const raw = await readBody(req);
	const parsed = safeJsonParse(raw);
	return parsed && typeof parsed === "object" ? parsed : null;
}

function uniq(arr) {
	return Array.from(new Set(arr.filter(Boolean)));
}

function extractHashtags(text) {
	const tags = [];
	const re = /#([a-zA-Z0-9_-]{2,30})/g;
	let m;
	while ((m = re.exec(text))) tags.push(m[1].toLowerCase());
	return tags;
}

function classifyText(text) {
	const t = String(text || "").trim();
	if (!t) return { kind: "note", tags: ["note"] };

	const tags = [];

	const hasCodeFence = /```/.test(t);
	const hasManyLines = t.split("\n").length >= 3;
	const looksLikeCode =
		hasCodeFence ||
		(hasManyLines && /[{};]/.test(t)) ||
		/\b(const|let|var|function|class|import|export|return|def|SELECT|INSERT|UPDATE)\b/i.test(
			t
		);

	const hasUrl = /\bhttps?:\/\//i.test(t) || /\bwww\.[^\s]+\.[^\s]+/i.test(t);
	const hasEmail = /\b[^@\s]+@[^@\s]+\.[^@\s]+\b/i.test(t);
	const hasPhone = /\b\+?\d[\d\s()\-]{7,}\d\b/.test(t);
	const hasTodo = /(^|\n)\s*(?:-\s*\[\s*\]|TODO:)/i.test(t);
	const hasAddress =
		/\b\d{5}\b/.test(t) ||
		/\b\d{1,4}\s+[^\n,]+\s+(?:str\.|straße|strasse|weg|gasse|platz|allee|road|rd\.|avenue|ave\.)\b/i.test(
			t
		);

	let kind = "note";
	if (looksLikeCode) kind = "code";
	else if (hasUrl) kind = "link";
	else if (hasAddress) kind = "address";
	else if (hasEmail) kind = "email";
	else if (hasPhone) kind = "phone";
	else if (hasTodo) kind = "todo";

	tags.push(kind);
	tags.push(...extractHashtags(t));

	return { kind, tags: uniq(tags) };
}

function parseTagsJson(raw) {
	try {
		const parsed = JSON.parse(String(raw || "[]"));
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function getOrCreateUserId(email) {
	initDb();
	const existing = stmtUserGet.get(email);
	if (existing && existing.id) return existing.id;
	stmtUserInsert.run(email, Date.now());
	const created = stmtUserGet.get(email);
	return created && created.id ? created.id : 0;
}

function listNotes(userId, tag) {
	initDb();
	if (!tag) {
		return stmtNotesByUser.all(userId).map((r) => ({
			id: r.id,
			text: r.text,
			kind: r.kind,
			tags: parseTagsJson(r.tags_json),
			createdAt: r.created_at,
		}));
	}
	const like = `%"${String(tag).replace(/"/g, "")}"%`;
	return stmtNotesByUserAndTag.all(userId, like).map((r) => ({
		id: r.id,
		text: r.text,
		kind: r.kind,
		tags: parseTagsJson(r.tags_json),
		createdAt: r.created_at,
	}));
}

function listTags(userId) {
	initDb();
	const rows = stmtTagsByUser.all(userId);
	const tags = [];
	for (const r of rows) tags.push(...parseTagsJson(r.tags_json));
	return uniq(tags).sort();
}

function saveLoginToken(token, email, exp) {
	initDb();
	stmtTokenInsert.run(token, email, exp);
}

function getLoginToken(token) {
	initDb();
	return stmtTokenGet.get(token);
}

function deleteLoginToken(token) {
	initDb();
	stmtTokenDelete.run(token);
}

function getOrigin(req) {
	const proto =
		String(req.headers["x-forwarded-proto"] || "")
			.split(",")[0]
			.trim() || "http";
	const host = String(
		req.headers["x-forwarded-host"] || req.headers.host || ""
	);
	return `${proto}://${host}`;
}

async function sendMagicLinkEmail(email, link) {
	const host = process.env.SMTP_HOST;
	if (!host) return { sent: false, reason: "smtp_not_configured" };

	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;
	const port = Number(process.env.SMTP_PORT || 587);
	const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true";
	const from = process.env.MAIL_FROM || process.env.SMTP_FROM || user;
	if (!user || !pass || !from)
		return { sent: false, reason: "smtp_incomplete" };

	let nodemailer;
	try {
		nodemailer = (await import("nodemailer")).default;
	} catch {
		return { sent: false, reason: "nodemailer_missing" };
	}

	const transporter = nodemailer.createTransport({
		host,
		port,
		secure,
		auth: { user, pass },
	});

	const info = await transporter.sendMail({
		from,
		to: email,
		subject: "Mirror: dein Login-Link",
		text: `Hier ist dein Login-Link (gültig für 30 Minuten):\n\n${link}\n\nWenn du das nicht warst, ignoriere diese E-Mail.`,
	});

	return {
		sent: true,
		messageId: info && info.messageId ? String(info.messageId) : "",
		response: info && info.response ? String(info.response) : "",
	};
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

	// --- API: Personal Space + Notes ---
	if (
		url.pathname === "/api/personal-space/request-link" &&
		req.method === "POST"
	) {
		readJson(req)
			.then(async (body) => {
				const email = normalizeEmail(body && body.email);
				if (!email) {
					json(res, 400, { ok: false, error: "invalid_email" });
					return;
				}
				const allowReturnLink =
					String(process.env.RETURN_MAGIC_LINK_IN_RESPONSE || "").toLowerCase() ===
						"true" || process.env.NODE_ENV !== "production";
				const token = crypto.randomBytes(32).toString("base64url");
				saveLoginToken(token, email, Date.now() + MAGIC_LINK_TTL_MS);

				const origin = getOrigin(req);
				const link = `${origin}/verify?token=${encodeURIComponent(token)}`;

				try {
					const result = await sendMagicLinkEmail(email, link);
					if (!result.sent) {
						console.log(`[magic-link] NOT SENT (${result.reason}) for ${email}`);
						if (allowReturnLink) console.log(`[magic-link] DEV LINK for ${email}: ${link}`);
						json(res, 200, {
							ok: true,
							sent: false,
							reason: result.reason,
							...(allowReturnLink ? { link } : {}),
						});
						return;
					}
					console.log(
						`[magic-link] SENT to ${email} ${result.messageId ? `(${result.messageId})` : ""}`
					);
					json(res, 200, { ok: true, sent: true });
				} catch (e) {
					console.error("magic-link send failed", e);
					if (allowReturnLink) console.log(`[magic-link] DEV LINK for ${email}: ${link}`);
					json(res, 200, {
						ok: true,
						sent: false,
						reason: "send_failed",
						...(allowReturnLink ? { link } : {}),
					});
				}
			})
			.catch((e) => {
				if (String(e && e.message) === "body_too_large") {
					json(res, 413, { ok: false, error: "body_too_large" });
					return;
				}
				json(res, 400, { ok: false, error: "invalid_json" });
			});
		return;
	}

	if (url.pathname === "/verify" && req.method === "GET") {
		const token = String(url.searchParams.get("token") || "");
		const rec = getLoginToken(token);
		if (!rec || Date.now() > Number(rec.exp || 0)) {
			text(res, 400, "Link ungültig oder abgelaufen.");
			return;
		}
		deleteLoginToken(token);
		getOrCreateUserId(rec.email);
		redirect(res, "/?ps=1", makeSessionCookie(rec.email));
		return;
	}

	if (url.pathname === "/api/personal-space/me" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 200, { ok: true, authed: false });
			return;
		}
		const userId = getOrCreateUserId(email);
		const notes = listNotes(userId, "");
		const tags = listTags(userId);
		json(res, 200, {
			ok: true,
			authed: true,
			email,
			tags,
			notes,
		});
		return;
	}

	if (url.pathname === "/api/notes" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const textVal = String(body && body.text ? body.text : "").trim();
				if (!textVal) {
					json(res, 400, { ok: false, error: "empty" });
					return;
				}
				const userId = getOrCreateUserId(email);
				const { kind, tags } = classifyText(textVal);
				const note = {
					id: crypto.randomBytes(12).toString("base64url"),
					text: textVal,
					createdAt: Date.now(),
					kind,
					tags,
				};
				initDb();
				stmtNoteInsert.run(
					note.id,
					userId,
					note.text,
					note.kind,
					JSON.stringify(note.tags),
					note.createdAt
				);
				json(res, 200, { ok: true, note });
			})
			.catch(() => json(res, 400, { ok: false, error: "invalid_json" }));
		return;
	}

	if (url.pathname === "/api/notes" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const tag = String(url.searchParams.get("tag") || "")
			.trim()
			.toLowerCase();
		const userId = getOrCreateUserId(email);
		const notes = listNotes(userId, tag);
		json(res, 200, { ok: true, notes });
		return;
	}

	if (url.pathname === "/api/logout" && req.method === "POST") {
		// stateless cookie; just clear
		res.writeHead(200, {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
			"Set-Cookie": clearSessionCookie(),
		});
		res.end(JSON.stringify({ ok: true }));
		return;
	}

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
