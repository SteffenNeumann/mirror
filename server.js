import http from "node:http";
import {
	mkdirSync,
	readFileSync,
	readdirSync,
	statSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
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
const UPLOADS_DIR = process.env.MIRROR_UPLOADS_DIR
	? String(process.env.MIRROR_UPLOADS_DIR).trim()
	: join(ROOT_DIR, "uploads");

const SESSION_COOKIE = "mirror_ps";
const MAGIC_LINK_TTL_MS = 1000 * 60 * 30; // 30 min
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const MAX_BODY_BYTES = 1024 * 1024; // 1MB
const UPLOAD_MAX_MB = Math.max(
	1,
	Math.min(50, Number(process.env.MIRROR_UPLOAD_MAX_MB || 8))
);
const MAX_UPLOAD_BYTES = Math.floor(UPLOAD_MAX_MB * 1024 * 1024);
const MAX_UPLOAD_BODY_BYTES = Math.ceil(MAX_UPLOAD_BYTES * 1.4);
const UPLOAD_REQUIRE_AUTH =
	String(process.env.MIRROR_UPLOAD_REQUIRE_AUTH || "").toLowerCase() === "true";
const UPLOAD_RETENTION_HOURS = Math.max(
	0,
	Number(process.env.MIRROR_UPLOAD_RETENTION_HOURS || 0)
);

const ANTHROPIC_API_KEY = String(process.env.ANTHROPIC_API_KEY || "").trim();
const ANTHROPIC_MODEL = String(
	process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022"
).trim();
const AI_MAX_INPUT_CHARS = 20000;
const AI_MAX_OUTPUT_TOKENS = Number(process.env.AI_MAX_OUTPUT_TOKENS || 900);
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 30000);
const AI_RATE_WINDOW_MS = Number(process.env.AI_RATE_WINDOW_MS || 60_000);
const AI_RATE_MAX = Number(process.env.AI_RATE_MAX || 10);

let signingSecret = String(process.env.MIRROR_SECRET || "");

let db;
let stmtUserGet;
let stmtUserInsert;
let stmtNoteInsert;
let stmtNoteGetByIdUser;
let stmtNoteGetByHashUser;
let stmtNoteUpdate;
let stmtNoteDelete;
let stmtNotesDeleteAll;
let stmtNotesByUser;
let stmtNotesByUserAndTag;
let stmtTagsByUser;
let stmtTokenInsert;
let stmtTokenGet;
let stmtTokenDelete;
let stmtMetaGet;
let stmtMetaInsert;
let stmtRoomStateGet;
let stmtRoomStateUpsert;
let stmtFavoriteUpsert;
let stmtFavoriteDelete;
let stmtFavoritesByUser;
let stmtRoomTabUpsert;
let stmtRoomTabDelete;
let stmtRoomTabsByUser;

// In-memory rate limit: ip -> { count, resetAt }
const aiRate = new Map();

function getClientIp(req) {
	const fwd = String(req.headers["x-forwarded-for"] || "").trim();
	if (fwd) return String(fwd.split(",")[0] || "").trim();
	return String(
		req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : ""
	);
}

function checkAiRateLimit(ip) {
	const now = Date.now();
	const key = String(ip || "");
	const rec = aiRate.get(key);
	if (!rec || now >= rec.resetAt) {
		aiRate.set(key, { count: 1, resetAt: now + AI_RATE_WINDOW_MS });
		return { ok: true };
	}
	if (rec.count >= AI_RATE_MAX) {
		return { ok: false, retryAfterMs: Math.max(0, rec.resetAt - now) };
	}
	rec.count += 1;
	return { ok: true };
}

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
		CREATE TABLE IF NOT EXISTS room_state (
			rk TEXT PRIMARY KEY,
			text TEXT NOT NULL,
			ts INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		);
		CREATE INDEX IF NOT EXISTS idx_room_state_updated ON room_state(updated_at DESC);
		CREATE TABLE IF NOT EXISTS room_favorites (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			room TEXT NOT NULL,
			room_key TEXT NOT NULL,
			text TEXT NOT NULL,
			added_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
			UNIQUE(user_id, room, room_key)
		);
		CREATE INDEX IF NOT EXISTS idx_room_favorites_user_added ON room_favorites(user_id, added_at DESC);
			CREATE TABLE IF NOT EXISTS room_tabs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_id INTEGER NOT NULL,
				room TEXT NOT NULL,
				room_key TEXT NOT NULL,
				text TEXT NOT NULL,
				last_used INTEGER NOT NULL,
				added_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
				UNIQUE(user_id, room, room_key)
			);
			CREATE INDEX IF NOT EXISTS idx_room_tabs_user_used ON room_tabs(user_id, last_used DESC);
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
				content_hash TEXT,
			tags_json TEXT NOT NULL,
			created_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
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

	const noteCols = db.prepare("PRAGMA table_info(notes)").all();
	const hasHash = noteCols.some((c) => String(c && c.name) === "content_hash");
	if (!hasHash) {
		try {
			db.exec("ALTER TABLE notes ADD COLUMN content_hash TEXT");
		} catch {
			// ignore
		}
	}
	const hasUpdatedAt = noteCols.some(
		(c) => String(c && c.name) === "updated_at"
	);
	if (!hasUpdatedAt) {
		try {
			db.exec("ALTER TABLE notes ADD COLUMN updated_at INTEGER");
			db.exec(
				"UPDATE notes SET updated_at = created_at WHERE updated_at IS NULL"
			);
		} catch {
			// ignore
		}
	}

	const roomStateCols = db.prepare("PRAGMA table_info(room_state)").all();
	const hasCiphertext = roomStateCols.some(
		(c) => String(c && c.name) === "ciphertext"
	);
	const hasIv = roomStateCols.some((c) => String(c && c.name) === "iv");
	const hasV = roomStateCols.some((c) => String(c && c.name) === "v");
	if (!hasCiphertext) {
		try {
			db.exec("ALTER TABLE room_state ADD COLUMN ciphertext TEXT");
		} catch {
			// ignore
		}
	}
	if (!hasIv) {
		try {
			db.exec("ALTER TABLE room_state ADD COLUMN iv TEXT");
		} catch {
			// ignore
		}
	}
	if (!hasV) {
		try {
			db.exec("ALTER TABLE room_state ADD COLUMN v TEXT");
		} catch {
			// ignore
		}
	}
	db.exec(
		"CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_user_hash ON notes(user_id, content_hash) WHERE content_hash IS NOT NULL AND content_hash <> ''"
	);

	stmtUserGet = db.prepare("SELECT id, email FROM users WHERE email = ?");
	stmtUserInsert = db.prepare(
		"INSERT INTO users(email, created_at) VALUES(?, ?) ON CONFLICT(email) DO NOTHING"
	);
	stmtNoteInsert = db.prepare(
		"INSERT INTO notes(id, user_id, text, kind, content_hash, tags_json, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
	);
	stmtNoteGetByIdUser = db.prepare(
		"SELECT id, text, kind, tags_json, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?"
	);
	stmtNoteGetByHashUser = db.prepare(
		"SELECT id, text, kind, tags_json, created_at, updated_at FROM notes WHERE user_id = ? AND content_hash = ? LIMIT 1"
	);
	stmtNoteUpdate = db.prepare(
		"UPDATE notes SET text = ?, kind = ?, content_hash = ?, tags_json = ?, updated_at = ? WHERE id = ? AND user_id = ?"
	);
	stmtNoteDelete = db.prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
	stmtNotesDeleteAll = db.prepare("DELETE FROM notes WHERE user_id = ?");
	stmtNotesByUser = db.prepare(
		"SELECT id, text, kind, tags_json, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY created_at DESC LIMIT 500"
	);
	stmtNotesByUserAndTag = db.prepare(
		"SELECT id, text, kind, tags_json, created_at, updated_at FROM notes WHERE user_id = ? AND tags_json LIKE ? ORDER BY created_at DESC LIMIT 500"
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
	stmtRoomStateGet = db.prepare(
		"SELECT text, ts, ciphertext, iv, v FROM room_state WHERE rk = ?"
	);
	stmtRoomStateUpsert = db.prepare(
		"INSERT INTO room_state(rk, text, ts, ciphertext, iv, v, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?) ON CONFLICT(rk) DO UPDATE SET text = excluded.text, ts = excluded.ts, ciphertext = excluded.ciphertext, iv = excluded.iv, v = excluded.v, updated_at = excluded.updated_at"
	);
	stmtFavoriteUpsert = db.prepare(
		"INSERT INTO room_favorites(user_id, room, room_key, text, added_at, updated_at) VALUES(?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, room, room_key) DO UPDATE SET text = excluded.text, updated_at = excluded.updated_at"
	);
	stmtFavoriteDelete = db.prepare(
		"DELETE FROM room_favorites WHERE user_id = ? AND room = ? AND room_key = ?"
	);
	stmtFavoritesByUser = db.prepare(
		"SELECT room, room_key, text, added_at FROM room_favorites WHERE user_id = ? ORDER BY added_at DESC LIMIT 200"
	);
	stmtRoomTabUpsert = db.prepare(
		"INSERT INTO room_tabs(user_id, room, room_key, text, last_used, added_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, room, room_key) DO UPDATE SET text = excluded.text, last_used = excluded.last_used, updated_at = excluded.updated_at"
	);
	stmtRoomTabDelete = db.prepare(
		"DELETE FROM room_tabs WHERE user_id = ? AND room = ? AND room_key = ?"
	);
	stmtRoomTabsByUser = db.prepare(
		"SELECT room, room_key, text, last_used, added_at FROM room_tabs WHERE user_id = ? ORDER BY last_used DESC LIMIT 50"
	);
}

function loadPersistedRoomState(rk) {
	initDb();
	const row = stmtRoomStateGet.get(rk);
	if (!row) return null;
	const ts = typeof row.ts === "number" ? row.ts : Number(row.ts) || 0;
	return {
		text: String(row.text ?? ""),
		ts,
		ciphertext: row.ciphertext ? String(row.ciphertext) : "",
		iv: row.iv ? String(row.iv) : "",
		v: row.v ? String(row.v) : "",
	};
}

function persistRoomState(rk, state) {
	initDb();
	const safeTs = state && typeof state.ts === "number" ? state.ts : Date.now();
	const text = state && typeof state.text === "string" ? state.text : "";
	const ciphertext =
		state && typeof state.ciphertext === "string" ? state.ciphertext : "";
	const iv = state && typeof state.iv === "string" ? state.iv : "";
	const v = state && typeof state.v === "string" ? state.v : "";
	stmtRoomStateUpsert.run(
		String(rk),
		String(text ?? ""),
		safeTs,
		String(ciphertext ?? ""),
		String(iv ?? ""),
		String(v ?? ""),
		Date.now()
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
	if (ext === ".mjs") return "text/javascript; charset=utf-8";
	if (ext === ".css") return "text/css; charset=utf-8";
	if (ext === ".svg") return "image/svg+xml";
	if (ext === ".png") return "image/png";
	if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
	if (ext === ".pdf") return "application/pdf";
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

function readBodyWithLimit(req, maxBytes) {
	const limit = Number.isFinite(maxBytes) ? Number(maxBytes) : MAX_BODY_BYTES;
	return new Promise((resolve, reject) => {
		let size = 0;
		let buf = "";
		req.setEncoding("utf8");
		req.on("data", (chunk) => {
			size += chunk.length;
			if (size > limit) {
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

async function readJsonWithLimit(req, maxBytes) {
	const raw = await readBodyWithLimit(req, maxBytes);
	const parsed = safeJsonParse(raw);
	return parsed && typeof parsed === "object" ? parsed : null;
}

function ensureUploadsDir() {
	try {
		mkdirSync(UPLOADS_DIR, { recursive: true });
	} catch {
		// ignore
	}
}

function cleanupUploads() {
	if (!UPLOAD_RETENTION_HOURS) return;
	ensureUploadsDir();
	const cutoff = Date.now() - UPLOAD_RETENTION_HOURS * 60 * 60 * 1000;
	let entries = [];
	try {
		entries = readdirSync(UPLOADS_DIR);
	} catch {
		entries = [];
	}
	for (const name of entries) {
		const filePath = join(UPLOADS_DIR, name);
		let stat;
		try {
			stat = statSync(filePath);
		} catch {
			stat = null;
		}
		if (!stat || !stat.isFile()) continue;
		const mtime = Number(stat.mtimeMs || 0);
		if (!mtime || mtime > cutoff) continue;
		try {
			unlinkSync(filePath);
		} catch {
			// ignore
		}
	}
}

function sanitizeFilename(raw) {
	const base = String(raw || "upload").trim() || "upload";
	const cleaned = base
		.replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/^[-_.]+/, "");
	const truncated = cleaned.slice(0, 120);
	return truncated || "upload";
}

function decodeDataUrl(input) {
	const raw = String(input || "").trim();
	const match = raw.match(/^data:([^;]+);base64,(.+)$/);
	if (!match) return null;
	const mime = String(match[1] || "").trim();
	const b64 = String(match[2] || "").trim();
	if (!mime || !b64) return null;
	let buf;
	try {
		buf = Buffer.from(b64, "base64");
	} catch {
		return null;
	}
	return { mime, buf };
}

function isAllowedUploadMime(mime) {
	const m = String(mime || "").toLowerCase();
	return m.startsWith("image/") || m === "application/pdf";
}

function extForMime(mime) {
	const m = String(mime || "").toLowerCase();
	if (m === "application/pdf") return ".pdf";
	if (m === "image/png") return ".png";
	if (m === "image/jpeg") return ".jpg";
	if (m === "image/webp") return ".webp";
	if (m === "image/gif") return ".gif";
	if (m === "image/svg+xml") return ".svg";
	return "";
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
	const fenceLangMatch = t.match(/(^|\n)```\s*([a-zA-Z0-9_+-]{1,32})\s*(\n|$)/);
	const fenceLangRaw = fenceLangMatch ? fenceLangMatch[2] : "";
	const fenceLang = String(fenceLangRaw || "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9_+-]/g, "")
		.slice(0, 32);
	const hasManyLines = t.split("\n").length >= 3;
	const hasIndentedCode = /(^|\n)(?:\t| {4,})\S/.test(t);
	const hasStacktrace =
		/(^|\n)\s*at\s+\S+\s*\(/.test(t) || /(^|\n)\w+Exception\b/.test(t);
	const hasShell = /(^|\n)\s*(\$|#)\s+\S+/.test(t);
	const maybeJson = /^[\[{]/.test(t) && /[\]}]$/.test(t) && t.length <= 200000;
	let isJson = false;
	if (maybeJson) {
		try {
			const parsed = JSON.parse(t);
			isJson = parsed !== null && typeof parsed === "object";
		} catch {
			isJson = false;
		}
	}
	const looksLikeCode =
		hasCodeFence ||
		hasIndentedCode ||
		hasStacktrace ||
		isJson ||
		(hasManyLines && /[{};]/.test(t)) ||
		/\b(const|let|var|function|class|import|export|return|def|SELECT|INSERT|UPDATE)\b/i.test(
			t
		);

	const hasUrl = /\bhttps?:\/\//i.test(t) || /\bwww\.[^\s]+\.[^\s]+/i.test(t);
	const hasEmail = /\b[^@\s]+@[^@\s]+\.[^@\s]+\b/i.test(t);
	const hasPhone = /\b\+?\d[\d\s()\-]{7,}\d\b/.test(t);
	const hasTodo = /(^|\n)\s*(?:-\s*\[\s*\]|TODO:)/i.test(t);
	const hasMarkdown =
		/(^|\n)\s{0,3}#{1,6}\s+/.test(t) ||
		/(^|\n)\s*(?:[-*+]|\d+\.)\s+/.test(t) ||
		/(^|\n)\s*>\s+/.test(t) ||
		/(^|\n)\s*\|.+\|\s*$/.test(t) ||
		/(^|\n)\s*[-*]\s*\[[ xX]\]\s+/.test(t) ||
		/\*\*[^*]+\*\*/.test(t) ||
		/`[^`]+`/.test(t);
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
	if (fenceLang && kind === "code") tags.push(`lang-${fenceLang}`);
	if (isJson) tags.push("json");
	if (hasStacktrace) tags.push("stacktrace");
	if (hasShell) tags.push("shell");
	// Grobe Sprach-Erkennung (Regex, heuristisch)
	if (kind === "code") {
		if (/\b(def\s+\w+\(|import\s+\w+|print\()\b/.test(t)) tags.push("python");
		if (/\b(const|let|var|=>|console\.)\b/.test(t)) tags.push("javascript");
		if (/\b(public\s+class|System\.out\.println|import\s+java\.)\b/.test(t))
			tags.push("java");
		if (
			/\bSELECT\b[\s\S]*\bFROM\b/i.test(t) ||
			/\bINSERT\b[\s\S]*\bINTO\b/i.test(t)
		)
			tags.push("sql");
		if (/(^|\n)\s*[A-Za-z0-9_-]+:\s*\S+/.test(t) && hasManyLines)
			tags.push("yaml");
	}
	if (hasMarkdown && kind !== "code") tags.push("markdown");
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

function normalizeImportTags(rawTags) {
	const tags = Array.isArray(rawTags) ? rawTags : [];
	const out = [];
	for (const t of tags) {
		const s = String(t || "")
			.trim()
			.toLowerCase()
			.slice(0, 48);
		if (!s) continue;
		if (!/^[a-z0-9_+\-]{1,48}$/i.test(s)) continue;
		out.push(s);
		if (out.length >= 24) break;
	}
	return uniq(out);
}

const MANUAL_TAGS_MARKER = "__manual_tags__";

function splitManualOverrideTags(rawTags) {
	const normalized = normalizeImportTags(rawTags);
	const override = normalized.includes(MANUAL_TAGS_MARKER);
	const tags = override
		? normalized.filter((t) => t !== MANUAL_TAGS_MARKER)
		: normalized;
	return { override, tags };
}

function mergeManualTags(textVal, manualTags) {
	const derived = classifyText(textVal);
	const manual = normalizeImportTags(manualTags);
	if (!manual.length) return { kind: derived.kind, tags: derived.tags };

	const keep = new Set();
	keep.add(derived.kind);
	for (const ht of extractHashtags(textVal)) keep.add(ht);
	for (const t of derived.tags) {
		if (t === derived.kind) keep.add(t);
		if (
			t === "markdown" ||
			t === "json" ||
			t === "stacktrace" ||
			t === "shell"
		) {
			keep.add(t);
		}
		if (t.startsWith("lang-")) keep.add(t);
		if (
			derived.kind === "code" &&
			/^(python|javascript|java|sql|yaml|json|shell|stacktrace)$/i.test(t)
		)
			keep.add(t);
	}
	const tags = uniq([...keep, ...manual]);
	return { kind: derived.kind, tags };
}

function isValidNoteId(id) {
	return /^[a-zA-Z0-9_-]{8,80}$/.test(String(id || ""));
}

function normalizeNoteTextForHash(text) {
	return String(text || "")
		.replace(/\r\n?/g, "\n")
		.trim();
}

function computeNoteContentHash(text) {
	const normalized = normalizeNoteTextForHash(text);
	if (!normalized) return "";
	return crypto.createHash("sha256").update(normalized).digest("hex");
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
			updatedAt:
				typeof r.updated_at === "number" && Number.isFinite(r.updated_at)
					? r.updated_at
					: r.created_at,
		}));
	}
	const like = `%"${String(tag).replace(/"/g, "")}"%`;
	return stmtNotesByUserAndTag.all(userId, like).map((r) => ({
		id: r.id,
		text: r.text,
		kind: r.kind,
		tags: parseTagsJson(r.tags_json),
		createdAt: r.created_at,
		updatedAt:
			typeof r.updated_at === "number" && Number.isFinite(r.updated_at)
				? r.updated_at
				: r.created_at,
	}));
}

function listTags(userId) {
	initDb();
	const rows = stmtTagsByUser.all(userId);
	const tags = [];
	for (const r of rows) {
		for (const t of parseTagsJson(r.tags_json)) {
			if (String(t || "") === MANUAL_TAGS_MARKER) continue;
			tags.push(t);
		}
	}
	return uniq(tags).sort();
}

function listFavorites(userId) {
	initDb();
	return stmtFavoritesByUser.all(userId).map((r) => ({
		room: r.room,
		key: r.room_key,
		text: r.text,
		addedAt: r.added_at,
	}));
}

function listRoomTabs(userId) {
	initDb();
	return stmtRoomTabsByUser.all(userId).map((r) => ({
		room: r.room,
		key: r.room_key,
		text: r.text,
		lastUsed: r.last_used,
		addedAt: r.added_at,
	}));
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
	)
		.split(",")[0]
		.trim();
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
		subject: "Mirror: your sign-in link",
		text: `Here is your sign-in link (valid for 30 minutes):\n\n${link}\n\nIf you did not request this, you can ignore this email.`,
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
 * roomKey -> { text: string, ts: number, ciphertext?: string, iv?: string, v?: string }
 */
const roomState = new Map();

/** roomKey -> Set<WebSocket> */
const roomSockets = new Map();

/** roomKey -> Map<clientId, presence> */
const roomPresence = new Map();

/** roomKey -> { update?: string, text?: string, ts?: number, ciphertext?: string, iv?: string, v?: string } */
const roomCrdtSnapshots = new Map();

function getRoomSockets(roomKeyName) {
	let set = roomSockets.get(roomKeyName);
	if (!set) {
		set = new Set();
		roomSockets.set(roomKeyName, set);
	}
	return set;
}

function getRoomPresence(roomKeyName) {
	let map = roomPresence.get(roomKeyName);
	if (!map) {
		map = new Map();
		roomPresence.set(roomKeyName, map);
	}
	return map;
}

function buildPresenceList(roomKeyName) {
	return Array.from(getRoomPresence(roomKeyName).values());
}

function sendPresenceState(ws, roomKeyName, room) {
	const users = buildPresenceList(roomKeyName);
	try {
		ws.send(JSON.stringify({ type: "presence_state", room, users }));
	} catch {
		// ignore
	}
}

function broadcastPresenceState(roomKeyName, room, except) {
	const users = buildPresenceList(roomKeyName);
	broadcast(roomKeyName, { type: "presence_state", room, users }, except);
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
	if (url.pathname === "/favicon.ico") {
		res.writeHead(204, { "Cache-Control": "no-store" });
		res.end();
		return;
	}

	if (url.pathname === "/api/uploads" && req.method === "POST") {
		if (UPLOAD_REQUIRE_AUTH) {
			const email = getAuthedEmail(req);
			if (!email) {
				json(res, 401, { ok: false, error: "unauthorized" });
				return;
			}
		}
		readJsonWithLimit(req, MAX_UPLOAD_BODY_BYTES)
			.then((body) => {
				if (!body || typeof body !== "object") {
					json(res, 400, { ok: false, error: "invalid_json" });
					return;
				}
				const dataUrl = String(body && body.dataUrl ? body.dataUrl : "");
				if (!dataUrl) {
					json(res, 400, { ok: false, error: "missing_data" });
					return;
				}
				const decoded = decodeDataUrl(dataUrl);
				if (!decoded) {
					json(res, 400, { ok: false, error: "invalid_data_url" });
					return;
				}
				const mime = String(decoded.mime || "").toLowerCase();
				if (!isAllowedUploadMime(mime)) {
					json(res, 415, { ok: false, error: "unsupported_type" });
					return;
				}
				const buf = decoded.buf;
				if (!buf || buf.length > MAX_UPLOAD_BYTES) {
					json(res, 413, { ok: false, error: "file_too_large" });
					return;
				}
				const rawName = sanitizeFilename(body && body.filename ? body.filename : "upload");
				const extFromMime = extForMime(mime);
				const hasExt = extname(rawName);
				const finalName = hasExt
					? rawName
					: `${rawName}${extFromMime || ""}`;
				const id = crypto.randomBytes(6).toString("hex");
				const fileName = `${Date.now().toString(36)}-${id}-${finalName}`;
				ensureUploadsDir();
				writeFileSync(join(UPLOADS_DIR, fileName), buf);
				json(res, 200, {
					ok: true,
					url: `/uploads/${encodeURIComponent(fileName)}`,
					name: finalName,
					mime,
					size: buf.length,
				});
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

	if (url.pathname === "/api/uploads/list" && req.method === "GET") {
		if (UPLOAD_REQUIRE_AUTH) {
			const email = getAuthedEmail(req);
			if (!email) {
				json(res, 401, { ok: false, error: "unauthorized" });
				return;
			}
		}
		ensureUploadsDir();
		let entries = [];
		try {
			entries = readdirSync(UPLOADS_DIR);
		} catch {
			entries = [];
		}
		const items = [];
		for (const name of entries) {
			if (!name) continue;
			const filePath = join(UPLOADS_DIR, name);
			let stat;
			try {
				stat = statSync(filePath);
			} catch {
				stat = null;
			}
			if (!stat || !stat.isFile()) continue;
			items.push({
				name,
				size: Number(stat.size || 0),
				updatedAt: Number(stat.mtimeMs || 0),
				url: `/uploads/${encodeURIComponent(name)}`,
			});
		}
		items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
		json(res, 200, { ok: true, items: items.slice(0, 200) });
		return;
	}

	if (url.pathname === "/api/uploads/delete" && req.method === "POST") {
		if (UPLOAD_REQUIRE_AUTH) {
			const email = getAuthedEmail(req);
			if (!email) {
				json(res, 401, { ok: false, error: "unauthorized" });
				return;
			}
		}
		readJson(req)
			.then((body) => {
				const name = String(body && body.name ? body.name : "").trim();
				if (!name || name.includes("/") || name.includes("\\") || name.includes("..")) {
					json(res, 400, { ok: false, error: "invalid_name" });
					return;
				}
				try {
					unlinkSync(join(UPLOADS_DIR, name));
					json(res, 200, { ok: true });
				} catch {
					json(res, 404, { ok: false, error: "not_found" });
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

	if (url.pathname.startsWith("/uploads/")) {
		const rel = url.pathname.replace(/^\/uploads\//, "");
		let decoded;
		try {
			decoded = decodeURIComponent(rel);
		} catch {
			decoded = "";
		}
		if (!decoded) {
			res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
			res.end("Invalid filename");
			return;
		}
		if (decoded.includes("/") || decoded.includes("\\") || decoded.includes("..")) {
			res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
			res.end("Invalid filename");
			return;
		}
		try {
			const targetPath = join(UPLOADS_DIR, decoded);
			const stat = statSync(targetPath);
			if (!stat.isFile()) throw new Error("not a file");
			const buf = readFileSync(targetPath);
			res.writeHead(200, {
				"Content-Type": mimeTypeForPath(targetPath),
				"Cache-Control": "no-store",
			});
			res.end(buf);
		} catch {
			res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
			res.end("Not found");
		}
		return;
	}

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
					String(
						process.env.RETURN_MAGIC_LINK_IN_RESPONSE || ""
					).toLowerCase() === "true" || process.env.NODE_ENV !== "production";
				const token = crypto.randomBytes(32).toString("base64url");
				saveLoginToken(token, email, Date.now() + MAGIC_LINK_TTL_MS);

				const origin = getOrigin(req);
				const link = `${origin}/verify?token=${encodeURIComponent(token)}`;

				try {
					const result = await sendMagicLinkEmail(email, link);
					if (!result.sent) {
						console.log(
							`[magic-link] NOT SENT (${result.reason}) for ${email}`
						);
						if (allowReturnLink)
							console.log(`[magic-link] DEV LINK for ${email}: ${link}`);
						json(res, 200, {
							ok: true,
							sent: false,
							reason: result.reason,
							...(allowReturnLink ? { link } : {}),
						});
						return;
					}
					console.log(
						`[magic-link] SENT to ${email} ${
							result.messageId ? `(${result.messageId})` : ""
						}`
					);
					json(res, 200, { ok: true, sent: true });
				} catch (e) {
					console.error("magic-link send failed", e);
					if (allowReturnLink)
						console.log(`[magic-link] DEV LINK for ${email}: ${link}`);
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
			text(res, 400, "Link is invalid or expired.");
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
		const favorites = listFavorites(userId);
		const roomTabs = listRoomTabs(userId);
		json(res, 200, {
			ok: true,
			authed: true,
			email,
			tags,
			notes,
			favorites,
			roomTabs,
		});
		return;
	}

	if (url.pathname === "/api/room-tabs" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const roomTabs = listRoomTabs(userId);
		json(res, 200, { ok: true, roomTabs });
		return;
	}

	if (url.pathname === "/api/room-tabs" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const room = clampRoom(body && body.room);
				const key = clampKey(body && body.key);
				const textVal = String(body && body.text ? body.text : "");
				const lastUsedRaw = Number(body && body.lastUsed);
				const lastUsed = Number.isFinite(lastUsedRaw)
					? lastUsedRaw
					: Date.now();
				if (!room) {
					json(res, 400, { ok: false, error: "invalid_room" });
					return;
				}
				const userId = getOrCreateUserId(email);
				const now = Date.now();
				initDb();
				stmtRoomTabUpsert.run(userId, room, key, textVal, lastUsed, now, now);
				json(res, 200, {
					ok: true,
					roomTab: {
						room,
						key,
						text: textVal,
						lastUsed,
						addedAt: now,
					},
				});
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

	if (url.pathname === "/api/room-tabs" && req.method === "DELETE") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const room = clampRoom(body && body.room);
				const key = clampKey(body && body.key);
				if (!room) {
					json(res, 400, { ok: false, error: "invalid_room" });
					return;
				}
				const userId = getOrCreateUserId(email);
				initDb();
				stmtRoomTabDelete.run(userId, room, key);
				json(res, 200, { ok: true });
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

	if (url.pathname === "/api/favorites" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const favorites = listFavorites(userId);
		json(res, 200, { ok: true, favorites });
		return;
	}

	if (url.pathname === "/api/favorites" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const room = clampRoom(body && body.room);
				const key = clampKey(body && body.key);
				const textVal = String(body && body.text ? body.text : "");
				if (!room) {
					json(res, 400, { ok: false, error: "invalid_room" });
					return;
				}
				const userId = getOrCreateUserId(email);
				const now = Date.now();
				initDb();
				stmtFavoriteUpsert.run(userId, room, key, textVal, now, now);
				json(res, 200, {
					ok: true,
					favorite: {
						room,
						key,
						text: textVal,
						addedAt: now,
					},
				});
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

	if (url.pathname === "/api/favorites" && req.method === "DELETE") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const room = clampRoom(body && body.room);
				const key = clampKey(body && body.key);
				if (!room) {
					json(res, 400, { ok: false, error: "invalid_room" });
					return;
				}
				const userId = getOrCreateUserId(email);
				initDb();
				stmtFavoriteDelete.run(userId, room, key);
				json(res, 200, { ok: true });
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
				const hasTags =
					body && Object.prototype.hasOwnProperty.call(body, "tags");
				if (hasTags && !Array.isArray(body && body.tags ? body.tags : [])) {
					json(res, 400, { ok: false, error: "invalid_tags" });
					return;
				}
				const userId = getOrCreateUserId(email);
				const contentHash = computeNoteContentHash(textVal);
				let kind;
				let tags;
				if (hasTags) {
					const { override, tags: incoming } = splitManualOverrideTags(
						body && body.tags ? body.tags : []
					);
					if (override) {
						kind = classifyText(textVal).kind;
						tags = uniq([...incoming, MANUAL_TAGS_MARKER]);
					} else {
						const merged = mergeManualTags(textVal, incoming);
						kind = merged.kind;
						tags = merged.tags;
					}
				} else {
					const merged = classifyText(textVal);
					kind = merged.kind;
					tags = merged.tags;
				}
				initDb();
				if (contentHash) {
					const existing = stmtNoteGetByHashUser.get(userId, contentHash);
					if (existing) {
						json(res, 200, {
							ok: true,
							note: {
								id: existing.id,
								text: existing.text,
								kind: existing.kind,
								tags: parseTagsJson(existing.tags_json),
								createdAt: existing.created_at,
								updatedAt:
									typeof existing.updated_at === "number" &&
									Number.isFinite(existing.updated_at)
										? existing.updated_at
										: existing.created_at,
							},
						});
						return;
					}
				}
				const note = {
					id: crypto.randomBytes(12).toString("base64url"),
					text: textVal,
					createdAt: Date.now(),
					updatedAt: Date.now(),
					kind,
					tags,
				};
				try {
					stmtNoteInsert.run(
						note.id,
						userId,
						note.text,
						note.kind,
						contentHash,
						JSON.stringify(note.tags),
						note.createdAt,
						note.updatedAt
					);
				} catch (e) {
					if (contentHash && /UNIQUE/i.test(String(e && e.message))) {
						const existing = stmtNoteGetByHashUser.get(userId, contentHash);
						if (existing) {
							json(res, 200, {
								ok: true,
								note: {
									id: existing.id,
									text: existing.text,
									kind: existing.kind,
									tags: parseTagsJson(existing.tags_json),
									createdAt: existing.created_at,
									updatedAt:
										typeof existing.updated_at === "number" &&
										Number.isFinite(existing.updated_at)
											? existing.updated_at
											: existing.created_at,
								},
							});
							return;
						}
					}
					throw e;
				}
				json(res, 200, { ok: true, note });
			})
			.catch(() => json(res, 400, { ok: false, error: "invalid_json" }));
		return;
	}

	{
		const m = url.pathname.match(/^\/api\/notes\/([a-zA-Z0-9_-]{8,80})$/);
		const noteId = m ? String(m[1] || "") : "";
		if (noteId && req.method === "PUT") {
			const email = getAuthedEmail(req);
			if (!email) {
				json(res, 401, { ok: false, error: "unauthorized" });
				return;
			}
			readJson(req)
				.then((body) => {
					const userId = getOrCreateUserId(email);
					initDb();
					const existing = stmtNoteGetByIdUser.get(noteId, userId);
					if (!existing) {
						json(res, 404, { ok: false, error: "not_found" });
						return;
					}
					const hasText =
						body && Object.prototype.hasOwnProperty.call(body, "text");
					const hasTags =
						body && Object.prototype.hasOwnProperty.call(body, "tags");
					const nextText = hasText
						? String(body && body.text ? body.text : "").trim()
						: String(existing.text || "");
					if (hasText && !nextText) {
						json(res, 400, { ok: false, error: "empty" });
						return;
					}
					if (hasTags && !Array.isArray(body && body.tags ? body.tags : [])) {
						json(res, 400, { ok: false, error: "invalid_tags" });
						return;
					}

					const derived = classifyText(nextText);
					const kind = derived.kind;
					const contentHash = computeNoteContentHash(nextText);
					let tags;
					if (hasTags) {
						const { override, tags: incoming } = splitManualOverrideTags(
							body && body.tags ? body.tags : []
						);
						tags = override
							? uniq([...incoming, MANUAL_TAGS_MARKER])
							: mergeManualTags(nextText, incoming).tags;
					} else if (hasText) {
						tags = derived.tags;
					} else {
						tags = parseTagsJson(existing.tags_json);
					}
					if (contentHash) {
						const dupe = stmtNoteGetByHashUser.get(userId, contentHash);
						if (dupe && String(dupe.id || "") !== String(noteId || "")) {
							json(res, 409, { ok: false, error: "duplicate" });
							return;
						}
					}
					const updatedAt = Date.now();
					stmtNoteUpdate.run(
						nextText,
						kind,
						contentHash,
						JSON.stringify(tags),
						updatedAt,
						noteId,
						userId
					);
					json(res, 200, {
						ok: true,
						note: {
							id: noteId,
							text: nextText,
							kind,
							tags,
							createdAt: existing.created_at,
							updatedAt,
						},
					});
				})
				.catch(() => json(res, 400, { ok: false, error: "invalid_json" }));
			return;
		}
		if (noteId && req.method === "DELETE") {
			const email = getAuthedEmail(req);
			if (!email) {
				json(res, 401, { ok: false, error: "unauthorized" });
				return;
			}
			const userId = getOrCreateUserId(email);
			initDb();
			const info = stmtNoteDelete.run(noteId, userId);
			if (!info || info.changes < 1) {
				json(res, 404, { ok: false, error: "not_found" });
				return;
			}
			json(res, 200, { ok: true });
			return;
		}
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

	if (url.pathname === "/api/notes/export" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const notes = listNotes(userId, "");
		json(res, 200, {
			ok: true,
			export: {
				version: 1,
				exportedAt: Date.now(),
				notes,
			},
		});
		return;
	}

	if (url.pathname === "/api/notes/import" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const userId = getOrCreateUserId(email);
				const mode = String(body && body.mode ? body.mode : "merge")
					.trim()
					.toLowerCase();
				const exportObj = body && body.export ? body.export : null;
				const notesRaw =
					(body && Array.isArray(body.notes) ? body.notes : null) ||
					(exportObj && Array.isArray(exportObj.notes)
						? exportObj.notes
						: null) ||
					[];
				if (!Array.isArray(notesRaw)) {
					json(res, 400, { ok: false, error: "invalid_notes" });
					return;
				}

				initDb();
				let imported = 0;
				let updated = 0;
				let skipped = 0;
				const seenHashes = new Set();

				const tx = db.transaction(() => {
					if (mode === "replace") {
						stmtNotesDeleteAll.run(userId);
					}
					for (const n of notesRaw) {
						const textVal = String(n && n.text ? n.text : "").trim();
						if (!textVal) {
							skipped += 1;
							continue;
						}
						const contentHash = computeNoteContentHash(textVal);
						if (!contentHash) {
							skipped += 1;
							continue;
						}
						if (mode !== "replace" && seenHashes.has(contentHash)) {
							skipped += 1;
							continue;
						}
						let noteId = String(n && n.id ? n.id : "");
						if (!isValidNoteId(noteId)) {
							noteId = crypto.randomBytes(12).toString("base64url");
						}
						const createdAtRaw = Number(n && n.createdAt ? n.createdAt : 0);
						const createdAt =
							Number.isFinite(createdAtRaw) && createdAtRaw > 0
								? createdAtRaw
								: Date.now();
						const updatedAtRaw = Number(n && n.updatedAt ? n.updatedAt : 0);
						const updatedAt =
							Number.isFinite(updatedAtRaw) && updatedAtRaw > 0
								? updatedAtRaw
								: createdAt;
						const kindRaw = String(n && n.kind ? n.kind : "").trim();
						const tagsRaw = n && n.tags ? n.tags : [];
						const tags = normalizeImportTags(tagsRaw);

						const existing = stmtNoteGetByIdUser.get(noteId, userId);
						if (existing) {
							const dupeByHash =
								mode !== "replace"
									? stmtNoteGetByHashUser.get(userId, contentHash)
									: null;
							if (
								dupeByHash &&
								String(dupeByHash.id || "") !== String(noteId || "")
							) {
								skipped += 1;
								continue;
							}
							const derived = classifyText(textVal);
							const kind = kindRaw ? kindRaw : derived.kind;
							const tagsFinal = tags.length ? tags : derived.tags;
							stmtNoteUpdate.run(
								textVal,
								kind,
								contentHash,
								JSON.stringify(tagsFinal),
								updatedAt,
								noteId,
								userId
							);
							updated += 1;
							seenHashes.add(contentHash);
							continue;
						}

						if (mode !== "replace") {
							const dupeByHash = stmtNoteGetByHashUser.get(userId, contentHash);
							if (dupeByHash) {
								skipped += 1;
								continue;
							}
						}

						const derived = classifyText(textVal);
						const kind = kindRaw ? kindRaw : derived.kind;
						const tagsFinal = tags.length ? tags : derived.tags;
						stmtNoteInsert.run(
							noteId,
							userId,
							textVal,
							kind,
							contentHash,
							JSON.stringify(tagsFinal),
							createdAt,
							updatedAt
						);
						imported += 1;
						seenHashes.add(contentHash);
					}
				});

				tx();
				json(res, 200, {
					ok: true,
					mode: mode === "replace" ? "replace" : "merge",
					imported,
					updated,
					skipped,
				});
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

	// --- API: AI helper (Claude via Anthropic) ---
	if (url.pathname === "/api/ai/status" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		json(res, 200, {
			ok: true,
			provider: "anthropic",
			configured: Boolean(ANTHROPIC_API_KEY),
			model: ANTHROPIC_MODEL,
		});
		return;
	}

	if (url.pathname === "/api/ai" && req.method === "POST") {
		const reqId = crypto.randomBytes(6).toString("hex");
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const ip = getClientIp(req);
		const rl = checkAiRateLimit(ip);
		if (!rl.ok) {
			res.writeHead(429, {
				"Content-Type": "application/json; charset=utf-8",
				"Cache-Control": "no-store",
				"Retry-After": String(Math.ceil((rl.retryAfterMs || 0) / 1000) || 1),
			});
			res.end(JSON.stringify({ ok: false, error: "rate_limited" }));
			return;
		}

		readJson(req)
			.then(async (body) => {
				const apiKeyRaw = String(body && body.apiKey ? body.apiKey : "").trim();
				const effectiveApiKey = apiKeyRaw || ANTHROPIC_API_KEY;
				if (!effectiveApiKey) {
					json(res, 503, { ok: false, error: "ai_not_configured" });
					return;
				}
				const modeRaw = String(body && body.mode ? body.mode : "explain")
					.trim()
					.toLowerCase();
				const mode =
					modeRaw === "fix" ||
					modeRaw === "improve" ||
					modeRaw === "run" ||
					modeRaw === "summarize"
						? modeRaw
						: "explain";
				const lang = String(body && body.lang ? body.lang : "")
					.trim()
					.toLowerCase()
					.slice(0, 32);
				const kindRaw = String(body && body.kind ? body.kind : "")
					.trim()
					.toLowerCase();
				const promptRaw = String(body && body.prompt ? body.prompt : "").trim();
				const prompt = promptRaw ? promptRaw.slice(0, 800) : "";
				const modelRaw = String(body && body.model ? body.model : "").trim();
				const modelOverride = /^[a-z0-9._:-]{1,64}$/i.test(modelRaw)
					? modelRaw
					: "";
				let input = String(body && body.code ? body.code : "");
				if (!input.trim()) {
					json(res, 400, { ok: false, error: "empty" });
					return;
				}

				const isTextLang =
					lang === "text" ||
					lang === "plain" ||
					lang === "markdown" ||
					lang === "md" ||
					lang === "txt";
				const isCodeLang =
					/^(python|py|javascript|js|typescript|ts|bash|sh|shell|json|yaml|yml|sql|html|css)$/i.test(
						String(lang || "")
					);
				const kind =
					kindRaw === "text" || kindRaw === "code"
						? kindRaw
						: isTextLang
						? "text"
						: isCodeLang
						? "code"
						: "text";

				// Keep a larger ceiling for summarize; chunk later to avoid hard-truncation.
				const MAX_TOTAL_CHARS = Number(
					process.env.AI_MAX_TOTAL_CHARS || 120000
				);
				let truncated = false;
				if (Number.isFinite(MAX_TOTAL_CHARS) && MAX_TOTAL_CHARS > 1000) {
					if (input.length > MAX_TOTAL_CHARS) {
						input = input.slice(0, MAX_TOTAL_CHARS);
						truncated = true;
					}
				} else {
					if (input.length > AI_MAX_INPUT_CHARS) {
						input = input.slice(0, AI_MAX_INPUT_CHARS);
						truncated = true;
					}
				}

				const system =
					"You are Mirror's assistant. You can help with both code and normal text. " +
					"Reply in the same language as the user's input (German/English). " +
					"Use inclusive language unless the user explicitly asks otherwise. " +
					"Be concrete and practical. Never reveal secrets/keys.";

				const modeInstructionBase =
					mode === "fix"
						? kind === "code"
							? "Fix bugs and issues. Briefly explain root cause, then propose minimal changes (steps or a small patch snippet)."
							: "Correct errors and ambiguities in the text. Improve clarity and inclusive wording. Provide an improved version and a short rationale."
						: mode === "improve"
						? kind === "code"
							? "Improve quality: readability, performance, safety. Keep changes minimal and practical."
							: "Improve the text: clarity, structure, tone, inclusive language. Provide an improved version."
						: mode === "run"
						? kind === "code"
							? "Simulate executing the code. Do NOT claim you actually ran it.\n\nIMPORTANT: Return ONLY the following lines/sections (no other text, no headings, no markdown). No emojis.\nOutput: <plain text output or (no output)>\n\nIf an error is likely, additionally include:\nError: <short>\nFix:\n```<same language>\n<corrected code>\n```\n\nDo NOT explain the code. Only give Output and, if needed, Error+Fix."
							: "The user asked to run something, but the input is text. Explain that only code can be run, and ask for a code snippet or clarify what to execute."
						: mode === "summarize"
						? kind === "code"
							? "Summarize what this code does. Include: purpose, inputs/outputs, key logic, risks, and 2-3 improvement ideas."
							: "Summarize the text. Include: core points, decisions, next steps (if any), and key entities. Use bullet points."
						: kind === "code"
						? "Explain what this code does and how it works. Mention important details and edge cases."
						: "If the input contains a question or instruction, answer it. Otherwise explain the content clearly.";
				const modeInstruction = prompt
					? modeInstructionBase +
					  "\n\nUser request (higher priority): " +
					  prompt
					: modeInstructionBase;

				function formatInputForUserPrompt(kind, lang, input) {
					if (kind === "code") {
						return (
							"Code:\n\n" +
							"```" +
							(lang && !isTextLang ? lang : "") +
							"\n" +
							input +
							"\n```"
						);
					}
					return "Text:\n\n" + input;
				}

				function buildUserPrompt(instruction, inputText) {
					return (
						`Mode: ${mode}\nKind: ${kind}\nLanguageTag: ${lang || "(auto)"}\n` +
						(truncated
							? "Note: input may be truncated for safety/performance.\n"
							: "") +
						"\nInstruction: " +
						instruction +
						"\n\n" +
						formatInputForUserPrompt(kind, lang, inputText)
					);
				}

				const controller = new AbortController();
				const t = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
				try {
					const maxTokens = Number.isFinite(AI_MAX_OUTPUT_TOKENS)
						? AI_MAX_OUTPUT_TOKENS
						: 900;

					const temperature = mode === "run" && kind === "code" ? 0 : 0.3;

					async function callAnthropic(model, userPrompt) {
						const r = await fetch("https://api.anthropic.com/v1/messages", {
							method: "POST",
							headers: {
								"content-type": "application/json",
								"x-api-key": effectiveApiKey,
								"anthropic-version": "2023-06-01",
							},
							body: JSON.stringify({
								model,
								temperature,
								max_tokens: maxTokens,
								system,
								messages: [{ role: "user", content: userPrompt }],
							}),
							signal: controller.signal,
						});
						const textBody = await r.text();
						const data = safeJsonParse(textBody);
						return { r, data };
					}

					const candidates = uniq([
						modelOverride,
						ANTHROPIC_MODEL,
						"claude-3-5-sonnet-20241022",
						"claude-3-5-sonnet-20240620",
						"claude-3-5-haiku-20241022",
					]);

					async function runWithModelFallback(userPrompt) {
						let lastStatus = 0;
						let lastErrMsg = "";
						let chosenModel = "";
						let data = null;
						for (const model of candidates) {
							chosenModel = String(model || "").trim();
							if (!chosenModel) continue;
							const out = await callAnthropic(chosenModel, userPrompt);
							lastStatus = out.r.status;
							data = out.data;
							if (out.r.ok) return { ok: true, data, model: chosenModel };
							lastErrMsg =
								(data && data.error && data.error.message) ||
								(data && data.message) ||
								`AI HTTP ${out.r.status}`;
							const isModel404 =
								out.r.status === 404 && /\bmodel\b/i.test(String(lastErrMsg));
							if (!isModel404) break;
						}
						return {
							ok: false,
							data,
							status: lastStatus,
							errMsg: lastErrMsg,
							model: "",
						};
					}

					function extractText(data) {
						const parts =
							data && Array.isArray(data.content) ? data.content : [];
						return parts
							.map((p) => (p && p.type === "text" ? String(p.text || "") : ""))
							.join("\n")
							.trim();
					}

					function shouldRetryRunOutput(text) {
						const raw = String(text || "").trim();
						if (!raw) return true;
						const t = raw.toLowerCase();
						if (t.startsWith("output:")) return false;
						// Common explanation patterns (headings, "let me explain", overviews)
						if (/(^|\n)#{2,}\s/.test(raw)) return true;
						if (t.includes("let me explain")) return true;
						if (t.includes("code overview")) return true;
						if (t.includes("this script") && t.includes("demonstrates"))
							return true;
						if (t.includes("explain")) return true;
						// If it doesn't look like the requested format, retry once.
						return true;
					}

					function extractFencedCodeBlocks(text) {
						const src = String(text || "");
						const blocks = [];
						const re = /```[^\n]*\n([\s\S]*?)```/g;
						let m;
						while ((m = re.exec(src))) {
							blocks.push(String(m[1] || ""));
							if (blocks.length >= 6) break;
						}
						return blocks;
					}

					function coerceRunModeText(text) {
						const raw = String(text || "").trim();
						if (!raw) return "Output: (no output)";
						if (raw.toLowerCase().startsWith("output:")) return raw;

						// Prefer any fenced code block as the most likely "stdout" snippet.
						const blocks = extractFencedCodeBlocks(raw);
						if (blocks.length) {
							const last = String(blocks[blocks.length - 1] || "").trim();
							return "Output:\n" + (last || "(no output)");
						}

						// Fallback: try to salvage likely output-like lines.
						const lines = raw.split("\n").map((l) => l.replace(/\s+$/g, ""));
						const candidates = [];
						for (const line of lines) {
							const s = String(line || "").trim();
							if (!s) continue;
							if (/^(?:[-*•]|\d+\.)\s+/.test(s)) continue;
							if (
								/^(?:code overview|key components|execution flow|potential edge cases)\b/i.test(
									s
								)
							)
								continue;
							if (/\b(run speed:|traceback|exception|error:)\b/i.test(s)) {
								candidates.push(s);
							}
							if (candidates.length >= 12) break;
						}
						if (candidates.length) return "Output:\n" + candidates.join("\n");

						return "Output: (no output)";
					}

					function chunkText(text, maxChars) {
						const src = String(text || "");
						const size = Math.max(1000, Number(maxChars) || AI_MAX_INPUT_CHARS);
						const chunks = [];
						let i = 0;
						while (i < src.length) {
							chunks.push(src.slice(i, i + size));
							i += size;
							if (chunks.length >= 8) break; // hard cap to avoid runaway calls
						}
						return chunks;
					}

					let finalData = null;
					let chosenModel = "";
					let chunkCount = 1;
					if (
						mode === "summarize" &&
						kind === "text" &&
						input.length > AI_MAX_INPUT_CHARS
					) {
						const chunks = chunkText(input, AI_MAX_INPUT_CHARS);
						chunkCount = chunks.length;
						const partials = [];
						for (let idx = 0; idx < chunks.length; idx += 1) {
							const partInstruction =
								"Summarize PART " +
								(idx + 1) +
								"/" +
								chunks.length +
								" of a longer text. Keep the same language. Output concise bullet points.";
							const prompt = buildUserPrompt(partInstruction, chunks[idx]);
							const out = await runWithModelFallback(prompt);
							if (!out.ok || !out.data) {
								const lastErrMsg = out.errMsg || "ai_failed";
								json(res, 502, {
									ok: false,
									error: "ai_failed",
									message: lastErrMsg,
									reqId,
								});
								return;
							}
							chosenModel = out.model || chosenModel;
							partials.push(extractText(out.data));
						}
						const combineInstruction =
							"Combine the partial summaries into ONE coherent summary. Keep the same language. " +
							"Include core points and any explicit decisions/next steps if present.";
						const combinePrompt = buildUserPrompt(
							combineInstruction,
							partials.join("\n\n")
						);
						const combined = await runWithModelFallback(combinePrompt);
						if (!combined.ok || !combined.data) {
							const lastErrMsg = combined.errMsg || "ai_failed";
							json(res, 502, {
								ok: false,
								error: "ai_failed",
								message: lastErrMsg,
								reqId,
							});
							return;
						}
						chosenModel = combined.model || chosenModel;
						finalData = combined.data;
					} else {
						const userPrompt = buildUserPrompt(modeInstruction, input);
						let out = await runWithModelFallback(userPrompt);
						if (!out.ok || !out.data) {
							const lastStatus = out.status || 502;
							const lastErrMsg = out.errMsg || "ai_failed";
							try {
								console.warn("[ai] upstream_error", {
									reqId,
									status: lastStatus,
									errMsg: lastErrMsg || `AI HTTP ${lastStatus}`,
									mode,
									lang,
									kind,
									ip,
									email,
								});
							} catch {
								// ignore logging errors
							}
							json(res, 502, {
								ok: false,
								error: "ai_failed",
								message: lastErrMsg || `AI HTTP ${lastStatus}`,
								reqId,
							});
							return;
						}

						// One retry for run-mode if the model returns an explanation instead of the required Output/Error/Fix format.
						if (mode === "run" && kind === "code") {
							const firstText = extractText(out.data);
							if (shouldRetryRunOutput(firstText)) {
								const strictRunInstruction =
									"Your previous answer was invalid. Reply ONLY in this exact format (no extra text, no markdown headings, no explanations, no emojis):\n" +
									"Output: <plain text output or (no output)>\n\n" +
									"If an error is likely:\nError: <short>\nFix:\n```<same language>\n<corrected code>\n```";
								const retryPrompt = buildUserPrompt(
									strictRunInstruction,
									input
								);
								const retryOut = await runWithModelFallback(retryPrompt);
								if (retryOut.ok && retryOut.data) out = retryOut;
							}
						}
						chosenModel = out.model || chosenModel;
						finalData = out.data;
					}

					let outText = extractText(finalData);
					if (mode === "run" && kind === "code") {
						outText = coerceRunModeText(outText);
					}
					json(res, 200, {
						ok: true,
						text: outText,
						model:
							finalData && finalData.model
								? String(finalData.model)
								: chosenModel,
						truncated,
						chunks: chunkCount,
					});
					return;
				} catch (e) {
					const msg =
						e && e.name === "AbortError"
							? "timeout"
							: e && e.message
							? String(e.message)
							: "ai_error";
					try {
						console.warn("[ai] exception", {
							reqId,
							name: e && e.name ? String(e.name) : "",
							msg,
							mode,
							lang,
							ip,
							email,
						});
					} catch {
						// ignore logging errors
					}
					json(res, 502, {
						ok: false,
						error: "ai_failed",
						message: msg,
						reqId,
					});
				} finally {
					clearTimeout(t);
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
	const relPath = url.pathname.replace(/^\/+/, "");
	const filePath = join(ROOT_DIR, relPath);
	try {
		let targetPath = filePath;
		let stat;
		try {
			stat = statSync(targetPath);
		} catch {
			stat = null;
		}
		if (!stat && !extname(relPath)) {
			const jsPath = `${filePath}.js`;
			try {
				stat = statSync(jsPath);
				if (stat.isFile()) targetPath = jsPath;
			} catch {
				// ignore
			}
		}
		if (!stat || !stat.isFile()) throw new Error("not a file");
		const buf = readFileSync(targetPath);
		res.writeHead(200, {
			"Content-Type": mimeTypeForPath(targetPath),
			"Cache-Control": "no-store",
		});
		res.end(buf);
	} catch {
		res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("Not found");
	}
});

if (UPLOAD_RETENTION_HOURS) {
	cleanupUploads();
	setInterval(
		() => cleanupUploads(),
		Math.max(1, UPLOAD_RETENTION_HOURS) * 60 * 60 * 1000
	);
}

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

	let existing = roomState.get(rk);
	if (!existing) {
		const persisted = loadPersistedRoomState(rk);
		if (persisted) {
			existing = persisted;
			roomState.set(rk, persisted);
		}
	}
	if (existing) {
		const payload =
			existing.ciphertext && existing.iv
				? {
						type: "set",
						room,
						ciphertext: existing.ciphertext,
						iv: existing.iv,
						v: existing.v || "e2ee-v1",
						ts: existing.ts,
				  }
				: {
						type: "set",
						room,
						text: existing.text,
						ts: existing.ts,
				  };
		ws.send(JSON.stringify(payload));
	}

	ws.on("message", (raw) => {
		const msg = safeJsonParse(String(raw));
		if (!msg || msg.room !== room) return;

		if (msg.type === "hello") {
			const clientId = String(msg.clientId || "").trim();
			if (!clientId) return;
			ws.clientId = clientId;
			ws.clientMode = String(msg.mode || "lww");
			const name = String(msg.name || "Guest").slice(0, 40);
			const color = String(msg.color || "#94a3b8").slice(0, 32);
			const avatar = String(msg.avatar || "🙂").slice(0, 8);
			const presence = {
				clientId,
				name,
				color,
				avatar,
				typing: false,
				selection: null,
				updatedAt: Date.now(),
			};
			getRoomPresence(rk).set(clientId, presence);
			sendPresenceState(ws, rk, room);
			broadcastPresenceState(rk, room, ws);
			return;
		}

		if (msg.type === "typing") {
			const clientId = String(msg.clientId || "").trim();
			if (!clientId) return;
			const map = getRoomPresence(rk);
			const current = map.get(clientId);
			if (!current) return;
			const typing = Boolean(msg.typing);
			map.set(clientId, {
				...current,
				typing,
				updatedAt: Date.now(),
			});
			broadcast(rk, { type: "presence_update", room, clientId, typing });
			return;
		}

		if (msg.type === "cursor") {
			const clientId = String(msg.clientId || "").trim();
			if (!clientId) return;
			const map = getRoomPresence(rk);
			const current = map.get(clientId);
			if (!current) return;
			const start = Number(msg.start);
			const end = Number(msg.end);
			const selection =
				Number.isFinite(start) && Number.isFinite(end)
					? { start, end }
					: null;
			map.set(clientId, {
				...current,
				selection,
				updatedAt: Date.now(),
			});
			broadcast(rk, { type: "presence_update", room, clientId, selection });
			return;
		}

		if (msg.type === "doc_update") {
			if (typeof msg.update === "string" && msg.update) {
				broadcast(
					rk,
					{ type: "doc_update", room, update: msg.update, clientId: msg.clientId },
					ws
				);
				return;
			}
			const hasCiphertext =
				typeof msg.ciphertext === "string" &&
				msg.ciphertext &&
				typeof msg.iv === "string" &&
				msg.iv;
			if (hasCiphertext) {
				broadcast(
					rk,
					{
						type: "doc_update",
						room,
						ciphertext: msg.ciphertext,
						iv: msg.iv,
						v: typeof msg.v === "string" ? msg.v : "e2ee-v1",
						clientId: msg.clientId,
					},
					ws
				);
				return;
			}
			return;
		}

		if (msg.type === "doc_snapshot") {
			const ts = typeof msg.ts === "number" ? msg.ts : Date.now();
			const hasCiphertext =
				typeof msg.ciphertext === "string" &&
				msg.ciphertext &&
				typeof msg.iv === "string" &&
				msg.iv;
			if (hasCiphertext) {
				roomCrdtSnapshots.set(rk, {
					ciphertext: msg.ciphertext,
					iv: msg.iv,
					v: typeof msg.v === "string" ? msg.v : "e2ee-v1",
					ts,
				});
				persistRoomState(rk, {
					text: "",
					ts,
					ciphertext: msg.ciphertext,
					iv: msg.iv,
					v: typeof msg.v === "string" ? msg.v : "e2ee-v1",
				});
				return;
			}
			const update = typeof msg.update === "string" ? msg.update : "";
			const text = typeof msg.text === "string" ? msg.text : "";
			if (update || text) {
				roomCrdtSnapshots.set(rk, { update, text, ts });
				persistRoomState(rk, { text, ts });
			}
			return;
		}

		if (msg.type === "doc_request") {
			const snap = roomCrdtSnapshots.get(rk);
			if (snap) {
				if (snap.ciphertext && snap.iv) {
					ws.send(
						JSON.stringify({
							type: "doc_snapshot",
							room,
							ciphertext: snap.ciphertext,
							iv: snap.iv,
							v: snap.v || "e2ee-v1",
							ts: snap.ts,
						})
					);
					return;
				}
				if (snap.update || snap.text) {
					ws.send(
						JSON.stringify({
							type: "doc_snapshot",
							room,
							update: snap.update || "",
							text: snap.text || "",
							ts: snap.ts,
						})
					);
					return;
				}
			}
			const cur = roomState.get(rk);
			if (cur) {
				if (cur.ciphertext && cur.iv) {
					ws.send(
						JSON.stringify({
							type: "doc_snapshot",
							room,
							ciphertext: cur.ciphertext,
							iv: cur.iv,
							v: cur.v || "e2ee-v1",
							ts: cur.ts || Date.now(),
						})
					);
					return;
				}
				if (typeof cur.text === "string") {
					ws.send(
						JSON.stringify({
							type: "doc_snapshot",
							room,
							update: "",
							text: cur.text,
							ts: cur.ts || Date.now(),
						})
					);
				}
			}
			return;
		}

		if (msg.type === "set") {
			const ts = typeof msg.ts === "number" ? msg.ts : Date.now();
			const isEncrypted =
				typeof msg.ciphertext === "string" &&
				msg.ciphertext &&
				typeof msg.iv === "string" &&
				msg.iv;
			const text = typeof msg.text === "string" ? msg.text : "";
			const nextState = isEncrypted
				? {
						text: "",
						ts,
						ciphertext: msg.ciphertext,
						iv: msg.iv,
						v: typeof msg.v === "string" ? msg.v : "e2ee-v1",
				  }
				: { text, ts, ciphertext: "", iv: "", v: "" };

			const prev = roomState.get(rk);
			if (prev && prev.ts > ts) return;

			roomState.set(rk, nextState);
			persistRoomState(rk, nextState);
			if (isEncrypted) {
				broadcast(
					rk,
					{
						type: "set",
						room,
						ciphertext: msg.ciphertext,
						iv: msg.iv,
						v: typeof msg.v === "string" ? msg.v : "e2ee-v1",
						ts,
					},
					ws
				);
			} else {
				broadcast(rk, { type: "set", room, text, ts }, ws);
			}
			return;
		}

		if (msg.type === "request_state") {
			let cur = roomState.get(rk);
			if (!cur) {
				const persisted = loadPersistedRoomState(rk);
				if (persisted) {
					cur = persisted;
					roomState.set(rk, persisted);
				}
			}
			if (cur) {
				const payload =
					cur.ciphertext && cur.iv
						? {
								type: "set",
								room,
								ciphertext: cur.ciphertext,
								iv: cur.iv,
								v: cur.v || "e2ee-v1",
								ts: cur.ts,
						  }
						: { type: "set", room, text: cur.text, ts: cur.ts };
				ws.send(JSON.stringify(payload));
			}
			return;
		}
	});

	ws.on("close", () => {
		sockets.delete(ws);
		const clientId = ws.clientId ? String(ws.clientId) : "";
		if (clientId) {
			const map = getRoomPresence(rk);
			map.delete(clientId);
			broadcastPresenceState(rk, room);
			if (map.size === 0) roomPresence.delete(rk);
		}
		if (sockets.size === 0) roomSockets.delete(rk);
	});
});

server.listen(PORT, HOST, () => {
	console.log(`Mirror server running on http://${HOST}:${PORT}`);
	console.log(`WebSocket endpoint: ws://${HOST}:${PORT}/ws?room=<room>`);
});
