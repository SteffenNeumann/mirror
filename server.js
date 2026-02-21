import http from "node:http";
import { createGzip, gzipSync } from "node:zlib";
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

// ── Gzip compression cache for static assets ──
const gzipCache = new Map();
const GZIP_CACHE_MAX_AGE_MS = 5 * 60 * 1000; // 5 min

function isCompressible(mimeType) {
	const m = String(mimeType || "").toLowerCase();
	return (
		m.startsWith("text/") ||
		m.includes("javascript") ||
		m.includes("json") ||
		m.includes("xml") ||
		m.includes("svg")
	);
}

function acceptsGzip(req) {
	const ae = String(req.headers["accept-encoding"] || "");
	return ae.includes("gzip");
}

function getGzipped(key, buf) {
	const cached = gzipCache.get(key);
	if (cached && Date.now() - cached.time < GZIP_CACHE_MAX_AGE_MS) return cached.data;
	const compressed = gzipSync(buf, { level: 6 });
	gzipCache.set(key, { data: compressed, time: Date.now() });
	return compressed;
}

function sendCompressed(req, res, statusCode, buf, headers, cacheKey) {
	const mime = headers["Content-Type"] || "";
	if (acceptsGzip(req) && isCompressible(mime) && buf.length > 860) {
		const compressed = getGzipped(cacheKey || mime + buf.length, buf);
		headers["Content-Encoding"] = "gzip";
		headers["Vary"] = "Accept-Encoding";
		res.writeHead(statusCode, headers);
		res.end(compressed);
	} else {
		res.writeHead(statusCode, headers);
		res.end(buf);
	}
}

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
const ANTHROPIC_MODEL_OVERRIDE = String(
	process.env.ANTHROPIC_MODEL || ""
).trim();
const ANTHROPIC_MODEL_FALLBACK = "claude-sonnet-4-20250514";
let ANTHROPIC_MODEL = ANTHROPIC_MODEL_OVERRIDE || ANTHROPIC_MODEL_FALLBACK;

// --- FLUX.2 Image Generation (Black Forest Labs) ---
const BFL_API_KEY = String(process.env.BFL_API_KEY || "").trim();
const BFL_MODEL = String(process.env.BFL_MODEL || "flux-2-pro").trim();
const BFL_IMAGE_TIMEOUT_MS = Number(process.env.BFL_IMAGE_TIMEOUT_MS || 120000);
const BFL_POLL_INTERVAL_MS = 1500;

// --- Dynamic model discovery via Anthropic Models API ---
const AI_MODEL_REFRESH_MS = 6 * 60 * 60 * 1000; // 6 hours
let aiLatestModelCache = { model: "", models: [], fetchedAt: 0 };

/** Model family preference (higher = better). */
const MODEL_FAMILY_RANK = {
	"claude-opus-4": 100,
	"claude-sonnet-4": 90,
	"claude-3-7-sonnet": 80,
	"claude-3-5-sonnet": 70,
	"claude-3-opus": 60,
	"claude-3-sonnet": 50,
	"claude-3-5-haiku": 40,
	"claude-3-haiku": 30,
};

function rankModel(id) {
	for (const [family, rank] of Object.entries(MODEL_FAMILY_RANK)) {
		if (id.startsWith(family)) return rank;
	}
	return 0;
}

async function fetchLatestAnthropicModel(apiKey) {
	if (!apiKey) return null;
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 10000);
		const r = await fetch("https://api.anthropic.com/v1/models", {
			method: "GET",
			headers: {
				"x-api-key": apiKey,
				"anthropic-version": "2023-06-01",
			},
			signal: controller.signal,
		});
		clearTimeout(timer);
		if (!r.ok) {
			console.warn(`[ai] models API returned ${r.status}`);
			return null;
		}
		const data = await r.json();
		const models = Array.isArray(data && data.data) ? data.data : [];
		// Filter for chat-capable models, sort by family rank then by created_at desc
		const chatModels = models
			.filter((m) => m && m.id && m.type === "model")
			.map((m) => ({ id: m.id, rank: rankModel(m.id), created: m.created_at || "" }))
			.sort((a, b) => b.rank - a.rank || b.created.localeCompare(a.created));
		if (!chatModels.length) return null;
		const best = chatModels[0].id;
		const topModels = chatModels.slice(0, 5).map((m) => m.id);
		console.log(`[ai] latest model: ${best} (from ${models.length} available)`);
		return { model: best, models: topModels };
	} catch (e) {
		console.warn(`[ai] models API error: ${e && e.message ? e.message : e}`);
		return null;
	}
}

async function refreshLatestModel() {
	const apiKey = ANTHROPIC_API_KEY;
	if (!apiKey) return;
	const result = await fetchLatestAnthropicModel(apiKey);
	if (result && result.model) {
		aiLatestModelCache = { model: result.model, models: result.models, fetchedAt: Date.now() };
		if (!ANTHROPIC_MODEL_OVERRIDE) {
			ANTHROPIC_MODEL = result.model;
		}
	}
}

function getLatestModelInfo() {
	return {
		activeModel: ANTHROPIC_MODEL,
		latestModel: aiLatestModelCache.model || ANTHROPIC_MODEL,
		topModels: aiLatestModelCache.models,
		fetchedAt: aiLatestModelCache.fetchedAt,
		override: ANTHROPIC_MODEL_OVERRIDE || "",
	};
}

const LINEAR_KEY_SECRET = String(
	process.env.MIRROR_LINEAR_KEY_SECRET || ""
).trim();
const GOOGLE_OAUTH_CLIENT_ID = String(
	process.env.GOOGLE_OAUTH_CLIENT_ID || ""
).trim();
const GOOGLE_OAUTH_CLIENT_SECRET = String(
	process.env.GOOGLE_OAUTH_CLIENT_SECRET || ""
).trim();
const GOOGLE_OAUTH_REDIRECT_URL = String(
	process.env.GOOGLE_OAUTH_REDIRECT_URL || ""
).trim();
const OUTLOOK_OAUTH_CLIENT_ID = String(
	process.env.OUTLOOK_OAUTH_CLIENT_ID || ""
).trim();
const OUTLOOK_OAUTH_CLIENT_SECRET = String(
	process.env.OUTLOOK_OAUTH_CLIENT_SECRET || ""
).trim();
const OUTLOOK_OAUTH_REDIRECT_URL = String(
	process.env.OUTLOOK_OAUTH_REDIRECT_URL || ""
).trim();
const OUTLOOK_OAUTH_TENANT = String(
	process.env.OUTLOOK_OAUTH_TENANT || ""
).trim();
const AI_MAX_INPUT_CHARS = 20000;
const AI_MAX_OUTPUT_TOKENS = Number(process.env.AI_MAX_OUTPUT_TOKENS || 900);
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 30000);
const AI_RATE_WINDOW_MS = Number(process.env.AI_RATE_WINDOW_MS || 60_000);
const AI_RATE_MAX = Number(process.env.AI_RATE_MAX || 10);
const TRASH_RETENTION_DAYS = 30;
const TRASH_RETENTION_MS = 1000 * 60 * 60 * 24 * TRASH_RETENTION_DAYS;

let signingSecret = String(process.env.MIRROR_SECRET || "");

let db;
let stmtUserGet;
let stmtUserInsert;
let stmtNoteInsert;
let stmtNoteGetByIdUser;
let stmtNoteGetById;
let stmtNoteGetByHashUser;
let stmtNoteGetByTitleHashUser;
let stmtNoteUpdate;
let stmtNoteDelete;
let stmtNotesDeleteAll;
let stmtNotesByUser;
let stmtNotesByUserAndTag;
let stmtTagsByUser;
let stmtNoteCommentsGetByScope;
let stmtNoteCommentsUpsert;
let stmtNoteCommentsDeleteByScope;
let stmtNoteCommentsByUser;
let stmtSavedQueryList;
let stmtSavedQueryInsert;
let stmtSavedQueryDelete;
let stmtTrashInsert;
let stmtTrashGetByIdUser;
let stmtTrashDeleteByIdUser;
let stmtTrashListByUser;
let stmtTrashDeleteExpired;
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
let stmtFavoriteClearStartup;
let stmtRoomTabUpsert;
let stmtRoomTabDelete;
let stmtRoomTabsByUser;
let stmtRoomPinUpsert;
let stmtRoomPinDelete;
let stmtRoomPinsByUser;
let stmtRoomSharedPinUpsert;
let stmtRoomSharedPinDelete;
let stmtRoomSharedPinGet;
let stmtSharedRoomUpsert;
let stmtSharedRoomDelete;
let stmtSharedRoomsByUser;
let stmtSharedRoomsDeleteAll;
let stmtUserSettingsGet;
let stmtUserSettingsUpsert;
let stmtUserLinearKeyUpsert;
let stmtUserBflKeyUpsert;
let stmtGoogleTokenGet;
let stmtGoogleTokenUpsert;
let stmtGoogleTokenDelete;
let stmtOutlookTokenGet;
let stmtOutlookTokenUpsert;
let stmtOutlookTokenDelete;
let stmtRoomSlotsGet;
let stmtRoomSlotsUpsert;

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
			CREATE TABLE IF NOT EXISTS room_pins (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_id INTEGER NOT NULL,
				room TEXT NOT NULL,
				room_key TEXT NOT NULL,
				note_id TEXT NOT NULL,
				text TEXT NOT NULL,
				added_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
				UNIQUE(user_id, room, room_key)
			);
			CREATE INDEX IF NOT EXISTS idx_room_pins_user_updated ON room_pins(user_id, updated_at DESC);
			CREATE TABLE IF NOT EXISTS room_shared_pins (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				room TEXT NOT NULL,
				room_key TEXT NOT NULL,
				note_id TEXT NOT NULL,
				text TEXT NOT NULL,
				added_at INTEGER NOT NULL,
				updated_at INTEGER NOT NULL,
				UNIQUE(room, room_key)
			);
			CREATE INDEX IF NOT EXISTS idx_room_shared_pins_updated ON room_shared_pins(updated_at DESC);
		CREATE TABLE IF NOT EXISTS shared_rooms (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			room TEXT NOT NULL,
			room_key TEXT NOT NULL,
			added_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
			UNIQUE(user_id, room, room_key)
		);
		CREATE INDEX IF NOT EXISTS idx_shared_rooms_user_updated ON shared_rooms(user_id, updated_at DESC);
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT NOT NULL UNIQUE,
			created_at INTEGER NOT NULL
		);
		CREATE TABLE IF NOT EXISTS user_settings (
			user_id INTEGER PRIMARY KEY,
			calendar_json TEXT NOT NULL,
			updated_at INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
		);
		CREATE TABLE IF NOT EXISTS google_calendar_tokens (
			user_id INTEGER PRIMARY KEY,
			access_token TEXT NOT NULL,
			refresh_token TEXT NOT NULL,
			expires_at INTEGER NOT NULL,
			scope TEXT NOT NULL,
			token_type TEXT NOT NULL,
			updated_at INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
		);
		CREATE TABLE IF NOT EXISTS outlook_calendar_tokens (
			user_id INTEGER PRIMARY KEY,
			access_token TEXT NOT NULL,
			refresh_token TEXT NOT NULL,
			expires_at INTEGER NOT NULL,
			scope TEXT NOT NULL,
			token_type TEXT NOT NULL,
			updated_at INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
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
		CREATE TABLE IF NOT EXISTS notes_trash (
			id TEXT NOT NULL,
			user_id INTEGER NOT NULL,
			text TEXT NOT NULL,
			kind TEXT NOT NULL,
			content_hash TEXT,
			tags_json TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			deleted_at INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
			PRIMARY KEY(user_id, id)
		);
		CREATE INDEX IF NOT EXISTS idx_notes_trash_user_deleted ON notes_trash(user_id, deleted_at DESC);
		CREATE TABLE IF NOT EXISTS notes_comments (
			scope_id TEXT NOT NULL,
			comments_json TEXT NOT NULL,
			updated_at INTEGER NOT NULL,
			PRIMARY KEY(scope_id)
		);
		CREATE INDEX IF NOT EXISTS idx_notes_comments_updated ON notes_comments(updated_at DESC);
		CREATE TABLE IF NOT EXISTS login_tokens (
			token TEXT PRIMARY KEY,
			email TEXT NOT NULL,
			exp INTEGER NOT NULL
		);
		CREATE INDEX IF NOT EXISTS idx_login_tokens_exp ON login_tokens(exp);
		CREATE TABLE IF NOT EXISTS user_room_slots (
			user_id INTEGER NOT NULL,
			room_key TEXT NOT NULL,
			slots_json TEXT NOT NULL DEFAULT '{}',
			sharing INTEGER NOT NULL DEFAULT 0,
			updated_at INTEGER NOT NULL,
			PRIMARY KEY(user_id, room_key),
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
		);
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

	const commentCols = db.prepare("PRAGMA table_info(notes_comments)").all();
	const hasCommentScopeId = commentCols.some(
		(c) => String(c && c.name) === "scope_id"
	);
	const hasCommentNoteId = commentCols.some(
		(c) => String(c && c.name) === "note_id"
	);
	if (!hasCommentScopeId && hasCommentNoteId) {
		try {
			db.exec(
				"CREATE TABLE IF NOT EXISTS notes_comments_v3 (scope_id TEXT NOT NULL PRIMARY KEY, comments_json TEXT NOT NULL, updated_at INTEGER NOT NULL)"
			);
			db.exec(
				"INSERT INTO notes_comments_v3(scope_id, comments_json, updated_at) SELECT 'note:' || nc.note_id, nc.comments_json, nc.updated_at FROM notes_comments nc JOIN (SELECT note_id, MAX(updated_at) AS max_updated FROM notes_comments GROUP BY note_id) t ON nc.note_id = t.note_id AND nc.updated_at = t.max_updated"
			);
			db.exec("DROP TABLE notes_comments");
			db.exec("ALTER TABLE notes_comments_v3 RENAME TO notes_comments");
			db.exec(
				"CREATE INDEX IF NOT EXISTS idx_notes_comments_updated ON notes_comments(updated_at DESC)"
			);
		} catch {
			// ignore
		}
	} else {
		try {
			db.exec(
				"CREATE INDEX IF NOT EXISTS idx_notes_comments_updated ON notes_comments(updated_at DESC)"
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

	const settingsCols = db.prepare("PRAGMA table_info(user_settings)").all();
	const hasLinearCiphertext = settingsCols.some(
		(c) => String(c && c.name) === "linear_api_key_ciphertext"
	);
	const hasLinearIv = settingsCols.some(
		(c) => String(c && c.name) === "linear_api_key_iv"
	);
	const hasLinearTag = settingsCols.some(
		(c) => String(c && c.name) === "linear_api_key_tag"
	);
	if (!hasLinearCiphertext) {
		try {
			db.exec("ALTER TABLE user_settings ADD COLUMN linear_api_key_ciphertext TEXT");
		} catch {
			// ignore
		}
	}
	if (!hasLinearIv) {
		try {
			db.exec("ALTER TABLE user_settings ADD COLUMN linear_api_key_iv TEXT");
		} catch {
			// ignore
		}
	}
	if (!hasLinearTag) {
		try {
			db.exec("ALTER TABLE user_settings ADD COLUMN linear_api_key_tag TEXT");
		} catch {
			// ignore
		}
	}

	const hasBflCiphertext = settingsCols.some(
		(c) => String(c && c.name) === "bfl_api_key_ciphertext"
	);
	const hasBflIv = settingsCols.some(
		(c) => String(c && c.name) === "bfl_api_key_iv"
	);
	const hasBflTag = settingsCols.some(
		(c) => String(c && c.name) === "bfl_api_key_tag"
	);
	if (!hasBflCiphertext) {
		try {
			db.exec("ALTER TABLE user_settings ADD COLUMN bfl_api_key_ciphertext TEXT");
		} catch {
			// ignore
		}
	}
	if (!hasBflIv) {
		try {
			db.exec("ALTER TABLE user_settings ADD COLUMN bfl_api_key_iv TEXT");
		} catch {
			// ignore
		}
	}
	if (!hasBflTag) {
		try {
			db.exec("ALTER TABLE user_settings ADD COLUMN bfl_api_key_tag TEXT");
		} catch {
			// ignore
		}
	}

	const favoriteCols = db.prepare("PRAGMA table_info(room_favorites)").all();
	const hasIsStartup = favoriteCols.some(
		(c) => String(c && c.name) === "is_startup"
	);
	if (!hasIsStartup) {
		try {
			db.exec("ALTER TABLE room_favorites ADD COLUMN is_startup INTEGER DEFAULT 0");
		} catch {
			// ignore
		}
	}

	db.exec(
		"CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_user_hash ON notes(user_id, content_hash) WHERE content_hash IS NOT NULL AND content_hash <> ''"
	);

	const hasTitleHash = noteCols.some((c) => String(c && c.name) === "title_hash");
	if (!hasTitleHash) {
		try {
			db.exec("ALTER TABLE notes ADD COLUMN title_hash TEXT");
		} catch {
			// ignore
		}
	}
	db.exec(
		"CREATE INDEX IF NOT EXISTS idx_notes_user_title_hash ON notes(user_id, title_hash) WHERE title_hash IS NOT NULL AND title_hash <> ''"
	);

	// Backfill title_hash for existing notes that have NULL title_hash
	try {
		const nullHashRows = db.prepare(
			"SELECT id, text FROM notes WHERE title_hash IS NULL OR title_hash = ''"
		).all();
		if (nullHashRows.length > 0) {
			const updateStmt = db.prepare("UPDATE notes SET title_hash = ? WHERE id = ?");
			const backfillTx = db.transaction(() => {
				for (const row of nullHashRows) {
					const th = computeNoteTitleHash(String(row.text || ""));
					if (th) updateStmt.run(th, row.id);
				}
			});
			backfillTx();
			console.log(`[initDb] Backfilled title_hash for ${nullHashRows.length} notes`);
		}
	} catch (e) {
		console.warn("[initDb] title_hash backfill error:", e);
	}

	// Auto-dedup: remove duplicate notes with same user_id + title_hash + content_hash
	try {
		const dupeRows = db.prepare(`
			SELECT n.id, n.user_id, n.title_hash, n.content_hash, n.text, n.tags_json, n.created_at, n.updated_at
			FROM notes n
			WHERE n.title_hash IS NOT NULL AND n.title_hash <> ''
			ORDER BY n.user_id, n.title_hash, n.updated_at DESC
		`).all();
		const seen = new Map();
		const toDelete = [];
		for (const row of dupeRows) {
			const key = `${row.user_id}::${row.title_hash}`;
			if (!seen.has(key)) {
				seen.set(key, row);
			} else {
				// Same user + same title: duplicate → keep the first (newest by updated_at), trash the rest
				toDelete.push(row);
			}
		}
		if (toDelete.length > 0) {
			const trashInsert = db.prepare(
				"INSERT OR IGNORE INTO notes_trash(id, user_id, text, kind, content_hash, tags_json, created_at, updated_at, deleted_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)"
			);
			const deleteStmt = db.prepare("DELETE FROM notes WHERE id = ?");
			const dedupTx = db.transaction(() => {
				const now = Date.now();
				for (const row of toDelete) {
					try {
						trashInsert.run(row.id, row.user_id, row.text, "", row.content_hash || "", row.tags_json || "[]", row.created_at, row.updated_at, now);
					} catch { /* ignore trash insert errors */ }
					deleteStmt.run(row.id);
				}
			});
			dedupTx();
			console.log(`[initDb] Auto-dedup: moved ${toDelete.length} duplicate notes to trash`);
		}
	} catch (e) {
		console.warn("[initDb] auto-dedup error:", e);
	}

	db.exec(`
		CREATE TABLE IF NOT EXISTS saved_queries (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			label TEXT NOT NULL,
			query TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
		);
		CREATE INDEX IF NOT EXISTS idx_saved_queries_user ON saved_queries(user_id, created_at ASC);
	`);

	stmtUserGet = db.prepare("SELECT id, email FROM users WHERE email = ?");
	stmtUserInsert = db.prepare(
		"INSERT INTO users(email, created_at) VALUES(?, ?) ON CONFLICT(email) DO NOTHING"
	);
	stmtNoteInsert = db.prepare(
		"INSERT INTO notes(id, user_id, text, kind, content_hash, title_hash, tags_json, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)"
	);
	stmtNoteGetByIdUser = db.prepare(
		"SELECT id, text, kind, content_hash, tags_json, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?"
	);
	stmtNoteGetById = db.prepare(
		"SELECT id, user_id FROM notes WHERE id = ?"
	);
	stmtNoteGetByHashUser = db.prepare(
		"SELECT id, text, kind, tags_json, created_at, updated_at FROM notes WHERE user_id = ? AND content_hash = ? LIMIT 1"
	);
	stmtNoteGetByTitleHashUser = db.prepare(
		"SELECT id, text, kind, tags_json, created_at, updated_at FROM notes WHERE user_id = ? AND title_hash = ? LIMIT 1"
	);
	stmtNoteUpdate = db.prepare(
		"UPDATE notes SET text = ?, kind = ?, content_hash = ?, title_hash = ?, tags_json = ?, updated_at = ? WHERE id = ? AND user_id = ?"
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
	stmtNoteCommentsGetByScope = db.prepare(
		"SELECT comments_json, updated_at FROM notes_comments WHERE scope_id = ?"
	);
	stmtNoteCommentsUpsert = db.prepare(
		"INSERT INTO notes_comments(scope_id, comments_json, updated_at) VALUES(?, ?, ?) ON CONFLICT(scope_id) DO UPDATE SET comments_json = excluded.comments_json, updated_at = excluded.updated_at"
	);
	stmtNoteCommentsDeleteByScope = db.prepare(
		"DELETE FROM notes_comments WHERE scope_id = ?"
	);
	stmtNoteCommentsByUser = db.prepare(
		"SELECT n.id as note_id, nc.comments_json FROM notes n JOIN notes_comments nc ON nc.scope_id = 'note:' || n.id WHERE n.user_id = ? AND nc.comments_json IS NOT NULL AND nc.comments_json != ''"
	);
	stmtSavedQueryList = db.prepare(
		"SELECT id, label, query, created_at FROM saved_queries WHERE user_id = ? ORDER BY created_at ASC LIMIT 50"
	);
	stmtSavedQueryInsert = db.prepare(
		"INSERT INTO saved_queries(user_id, label, query, created_at) VALUES(?, ?, ?, ?)"
	);
	stmtSavedQueryDelete = db.prepare(
		"DELETE FROM saved_queries WHERE id = ? AND user_id = ?"
	);
	stmtRoomSlotsGet = db.prepare(
		"SELECT slots_json, sharing, updated_at FROM user_room_slots WHERE user_id = ? AND room_key = ?"
	);
	stmtRoomSlotsUpsert = db.prepare(
		"INSERT INTO user_room_slots(user_id, room_key, slots_json, sharing, updated_at) VALUES(?, ?, ?, ?, ?) ON CONFLICT(user_id, room_key) DO UPDATE SET slots_json = excluded.slots_json, sharing = excluded.sharing, updated_at = excluded.updated_at"
	);
	stmtTrashInsert = db.prepare(
		"INSERT INTO notes_trash(id, user_id, text, kind, content_hash, tags_json, created_at, updated_at, deleted_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, id) DO UPDATE SET text = excluded.text, kind = excluded.kind, content_hash = excluded.content_hash, tags_json = excluded.tags_json, created_at = excluded.created_at, updated_at = excluded.updated_at, deleted_at = excluded.deleted_at"
	);
	stmtTrashGetByIdUser = db.prepare(
		"SELECT id, text, kind, content_hash, tags_json, created_at, updated_at, deleted_at FROM notes_trash WHERE id = ? AND user_id = ?"
	);
	stmtTrashDeleteByIdUser = db.prepare(
		"DELETE FROM notes_trash WHERE id = ? AND user_id = ?"
	);
	stmtTrashListByUser = db.prepare(
		"SELECT id, text, kind, tags_json, created_at, updated_at, deleted_at FROM notes_trash WHERE user_id = ? ORDER BY deleted_at DESC LIMIT 500"
	);
	stmtTrashDeleteExpired = db.prepare(
		"DELETE FROM notes_trash WHERE deleted_at < ?"
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
		"INSERT INTO room_favorites(user_id, room, room_key, text, is_startup, added_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, room, room_key) DO UPDATE SET text = excluded.text, is_startup = excluded.is_startup, updated_at = excluded.updated_at"
	);
	stmtFavoriteDelete = db.prepare(
		"DELETE FROM room_favorites WHERE user_id = ? AND room = ? AND room_key = ?"
	);
	stmtRoomPinUpsert = db.prepare(
		"INSERT INTO room_pins(user_id, room, room_key, note_id, text, added_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, room, room_key) DO UPDATE SET note_id = excluded.note_id, text = excluded.text, updated_at = excluded.updated_at"
	);
	stmtRoomPinDelete = db.prepare(
		"DELETE FROM room_pins WHERE user_id = ? AND room = ? AND room_key = ?"
	);
	stmtRoomPinsByUser = db.prepare(
		"SELECT room, room_key, note_id, text, added_at, updated_at FROM room_pins WHERE user_id = ? ORDER BY updated_at DESC"
	);
	stmtRoomSharedPinUpsert = db.prepare(
		"INSERT INTO room_shared_pins(room, room_key, note_id, text, added_at, updated_at) VALUES(?, ?, ?, ?, ?, ?) ON CONFLICT(room, room_key) DO UPDATE SET note_id = excluded.note_id, text = excluded.text, updated_at = excluded.updated_at"
	);
	stmtRoomSharedPinDelete = db.prepare(
		"DELETE FROM room_shared_pins WHERE room = ? AND room_key = ?"
	);
	stmtRoomSharedPinGet = db.prepare(
		"SELECT room, room_key, note_id, text, updated_at FROM room_shared_pins WHERE room = ? AND room_key = ?"
	);
	stmtFavoritesByUser = db.prepare(
		"SELECT room, room_key, text, is_startup, added_at FROM room_favorites WHERE user_id = ? ORDER BY added_at DESC LIMIT 200"
	);
	stmtFavoriteClearStartup = db.prepare(
		"UPDATE room_favorites SET is_startup = 0 WHERE user_id = ?"
	);
	stmtRoomTabUpsert = db.prepare(
		"INSERT INTO room_tabs(user_id, room, room_key, text, last_used, added_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, room, room_key) DO UPDATE SET text = excluded.text, last_used = excluded.last_used, updated_at = excluded.updated_at"
	);
	stmtRoomTabDelete = db.prepare(
		"DELETE FROM room_tabs WHERE user_id = ? AND room = ? AND room_key = ?"
	);
	stmtRoomTabsByUser = db.prepare(
		"SELECT room, room_key, text, last_used, added_at FROM room_tabs WHERE user_id = ? ORDER BY added_at ASC LIMIT 50"
	);
	stmtSharedRoomUpsert = db.prepare(
		"INSERT INTO shared_rooms(user_id, room, room_key, added_at, updated_at) VALUES(?, ?, ?, ?, ?) ON CONFLICT(user_id, room, room_key) DO UPDATE SET updated_at = excluded.updated_at"
	);
	stmtSharedRoomDelete = db.prepare(
		"DELETE FROM shared_rooms WHERE user_id = ? AND room = ? AND room_key = ?"
	);
	stmtSharedRoomsByUser = db.prepare(
		"SELECT room, room_key, added_at, updated_at FROM shared_rooms WHERE user_id = ? ORDER BY updated_at DESC LIMIT 200"
	);
	stmtSharedRoomsDeleteAll = db.prepare(
		"DELETE FROM shared_rooms WHERE user_id = ?"
	);
	stmtUserSettingsGet = db.prepare(
		"SELECT calendar_json, linear_api_key_ciphertext, linear_api_key_iv, linear_api_key_tag, bfl_api_key_ciphertext, bfl_api_key_iv, bfl_api_key_tag, updated_at FROM user_settings WHERE user_id = ?"
	);
	stmtUserSettingsUpsert = db.prepare(
		"INSERT INTO user_settings(user_id, calendar_json, updated_at) VALUES(?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET calendar_json = excluded.calendar_json, updated_at = excluded.updated_at"
	);
	stmtUserLinearKeyUpsert = db.prepare(
		"INSERT INTO user_settings(user_id, calendar_json, linear_api_key_ciphertext, linear_api_key_iv, linear_api_key_tag, updated_at) VALUES(?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET linear_api_key_ciphertext = excluded.linear_api_key_ciphertext, linear_api_key_iv = excluded.linear_api_key_iv, linear_api_key_tag = excluded.linear_api_key_tag, updated_at = excluded.updated_at"
	);
	stmtUserBflKeyUpsert = db.prepare(
		"INSERT INTO user_settings(user_id, calendar_json, bfl_api_key_ciphertext, bfl_api_key_iv, bfl_api_key_tag, updated_at) VALUES(?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET bfl_api_key_ciphertext = excluded.bfl_api_key_ciphertext, bfl_api_key_iv = excluded.bfl_api_key_iv, bfl_api_key_tag = excluded.bfl_api_key_tag, updated_at = excluded.updated_at"
	);
	stmtGoogleTokenGet = db.prepare(
		"SELECT access_token, refresh_token, expires_at, scope, token_type, updated_at FROM google_calendar_tokens WHERE user_id = ?"
	);
	stmtGoogleTokenUpsert = db.prepare(
		"INSERT INTO google_calendar_tokens(user_id, access_token, refresh_token, expires_at, scope, token_type, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET access_token = excluded.access_token, refresh_token = excluded.refresh_token, expires_at = excluded.expires_at, scope = excluded.scope, token_type = excluded.token_type, updated_at = excluded.updated_at"
	);
	stmtGoogleTokenDelete = db.prepare(
		"DELETE FROM google_calendar_tokens WHERE user_id = ?"
	);
	stmtOutlookTokenGet = db.prepare(
		"SELECT access_token, refresh_token, expires_at, scope, token_type, updated_at FROM outlook_calendar_tokens WHERE user_id = ?"
	);
	stmtOutlookTokenUpsert = db.prepare(
		"INSERT INTO outlook_calendar_tokens(user_id, access_token, refresh_token, expires_at, scope, token_type, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET access_token = excluded.access_token, refresh_token = excluded.refresh_token, expires_at = excluded.expires_at, scope = excluded.scope, token_type = excluded.token_type, updated_at = excluded.updated_at"
	);
	stmtOutlookTokenDelete = db.prepare(
		"DELETE FROM outlook_calendar_tokens WHERE user_id = ?"
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

function loadPersistedRoomSharedPin(room, key) {
	initDb();
	const row = stmtRoomSharedPinGet.get(room, key);
	if (!row) return null;
	const noteId = String(row.note_id || "").trim();
	const text = noteId ? "" : String(row.text || "");
	const updatedAt = Number(row.updated_at) || 0;
	if (!noteId && !text) return null;
	return { noteId, text, updatedAt };
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
	if (ext === ".json") return "application/json; charset=utf-8";
	if (ext === ".webmanifest") return "application/manifest+json; charset=utf-8";
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
	while ((m = re.exec(text))) {
		tags.push(m[1].toLowerCase());
		if (tags.length >= 3) break;
	}
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
	// Limit: max 1 auxiliary auto-tag per field
	if (isJson) tags.push("json");
	else if (hasStacktrace) tags.push("stacktrace");
	else if (hasMarkdown && kind !== "code") tags.push("markdown");
	// Grobe Sprach-Erkennung: max 1 Sprach-Tag (1 auto-tag pro Feld)
	if (kind === "code" && !fenceLang) {
		if (/\b(def\s+\w+\(|import\s+\w+|print\()\b/.test(t)) tags.push("python");
		else if (/\b(const|let|var|=>|console\.)\b/.test(t)) tags.push("javascript");
		else if (/\b(public\s+class|System\.out\.println|import\s+java\.)\b/.test(t))
			tags.push("java");
		else if (
			/\bSELECT\b[\s\S]*\bFROM\b/i.test(t) ||
			/\bINSERT\b[\s\S]*\bINTO\b/i.test(t)
		)
			tags.push("sql");
		else if (/(^|\n)\s*[A-Za-z0-9_-]+:\s*\S+/.test(t) && hasManyLines)
			tags.push("yaml");
	}
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

function parseCommentsJson(raw) {
	try {
		const parsed = JSON.parse(String(raw || "[]"));
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function sanitizeCommentAuthor(raw) {
	if (!raw || typeof raw !== "object") return null;
	const avatar = String(raw.avatar || "").trim().slice(0, 8);
	const color = String(raw.color || "").trim().slice(0, 32);
	const name = String(raw.name || "").trim().slice(0, 64);
	const out = {};
	if (avatar) out.avatar = avatar;
	if (color) out.color = color;
	if (name) out.name = name;
	return Object.keys(out).length ? out : null;
}

function sanitizeCommentItems(raw) {
	const items = Array.isArray(raw) ? raw : [];
	const out = [];
	for (const item of items) {
		if (!item || typeof item !== "object") continue;
		const id = String(item.id || "").trim();
		if (!id) continue;
		const text = String(item.text || "").trim();
		if (!text) continue;
		const selectionRaw =
			item.selection && typeof item.selection === "object"
				? item.selection
				: null;
		let normalizedSelection = null;
		if (selectionRaw) {
			const startRaw = Number(selectionRaw.start || 0);
			const endRaw = Number(selectionRaw.end || 0);
			if (Number.isFinite(startRaw) && Number.isFinite(endRaw)) {
				const start = Math.max(0, Math.floor(startRaw));
				const end = Math.max(start, Math.floor(endRaw));
				const selText = String(selectionRaw.text || "").trim();
				if (selText && end > start) {
					normalizedSelection = {
						start,
						end,
						text: selText.slice(0, 800),
					};
				}
			}
		}
		const createdAtRaw = Number(item.createdAt || 0);
		const createdAt =
			Number.isFinite(createdAtRaw) && createdAtRaw > 0
				? createdAtRaw
				: Date.now();
		const updatedAtRaw = Number(item.updatedAt || 0);
		const updatedAt =
			Number.isFinite(updatedAtRaw) && updatedAtRaw > 0 ? updatedAtRaw : 0;
		const parentId = String(item.parentId || "").trim();
		const author = sanitizeCommentAuthor(item.author);
		out.push({
			id,
			createdAt,
			updatedAt,
			text: text.slice(0, 4000),
			parentId,
			selection: normalizedSelection || undefined,
			author: author || undefined,
		});
		if (out.length >= 200) break;
	}
	return out;
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
		if (!/^[a-z0-9_+:\-]{1,48}$/i.test(s)) continue;
		out.push(s);
		if (out.length >= 3) break;
	}
	return uniq(out);
}

const NOTE_MONTH_TAGS = [
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
const NOTE_MONTH_ALIASES = {
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

function isYearTag(tag) {
	return /^\d{4}$/.test(String(tag || "").trim());
}

function isMonthTag(tag) {
	const raw = String(tag || "").trim().toLowerCase();
	const mapped = NOTE_MONTH_ALIASES[raw] || raw;
	return NOTE_MONTH_TAGS.includes(mapped);
}

function getDateTagsForTs(ts) {
	try {
		const d = new Date(ts);
		if (Number.isNaN(d.getTime())) return { year: "", month: "" };
		const year = String(d.getFullYear());
		const month = NOTE_MONTH_TAGS[d.getMonth()] || "";
		return { year, month };
	} catch {
		return { year: "", month: "" };
	}
}

function applyDateTags(tags, createdAt) {
	const list = Array.isArray(tags) ? tags : [];
	const hasYear = list.some((t) => isYearTag(t));
	const hasMonth = list.some((t) => isMonthTag(t));
	const { year, month } = getDateTagsForTs(createdAt || Date.now());
	const next = list.slice();
	if (!hasYear && year) next.push(year);
	if (!hasMonth && month) next.push(month);
	return uniq(next);
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
			t === "stacktrace"
		) {
			keep.add(t);
		}
		if (t.startsWith("lang-")) keep.add(t);
		if (
			derived.kind === "code" &&
			/^(python|javascript|java|sql|yaml|json|stacktrace)$/i.test(t)
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
	if (!normalized) return crypto.createHash("sha256").update("__EMPTY_NOTE__").digest("hex");
	return crypto.createHash("sha256").update(normalized).digest("hex");
}

function extractNoteFirstLine(text) {
	const lines = String(text || "").split("\n");
	for (const line of lines) {
		const trimmed = line.replace(/\r$/, "").trim();
		if (!trimmed) continue;
		return trimmed
			.replace(/^#+\s*/, "")
			.replace(/^[-*+]\s+/, "")
			.replace(/^\d+[.)]\s+/, "")
			.trim()
			.toLowerCase()
			.slice(0, 200);
	}
	return "";
}

function computeNoteTitleHash(text) {
	const firstLine = extractNoteFirstLine(text);
	if (!firstLine) return "";
	return crypto.createHash("sha256").update(firstLine).digest("hex");
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

function purgeExpiredTrash() {
	initDb();
	const cutoff = Date.now() - TRASH_RETENTION_MS;
	if (!Number.isFinite(cutoff)) return;
	stmtTrashDeleteExpired.run(cutoff);
}

function listTrashNotes(userId) {
	initDb();
	return stmtTrashListByUser.all(userId).map((r) => ({
		id: r.id,
		text: r.text,
		kind: r.kind,
		tags: parseTagsJson(r.tags_json),
		createdAt: r.created_at,
		updatedAt:
			typeof r.updated_at === "number" && Number.isFinite(r.updated_at)
				? r.updated_at
				: r.created_at,
		deletedAt: r.deleted_at,
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
		isStartup: Boolean(r.is_startup),
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

function listRoomPins(userId) {
	initDb();
	return stmtRoomPinsByUser.all(userId).map((r) => ({
		room: r.room,
		key: r.room_key,
		noteId: r.note_id,
		text: r.text,
		addedAt: r.added_at,
		updatedAt: r.updated_at,
	}));
}

function listSharedRooms(userId) {
	initDb();
	return stmtSharedRoomsByUser.all(userId).map((r) => ({
		room: r.room,
		key: r.room_key,
		addedAt: r.added_at,
		updatedAt: r.updated_at,
	}));
}

function sanitizeCalendarSettings(input) {
	const safe = input && typeof input === "object" ? input : {};
	const rawSources = Array.isArray(safe.sources) ? safe.sources : [];
	const sources = rawSources
		.slice(0, 25)
		.map((src) => {
			const id = String(src && src.id ? src.id : "")
				.trim()
				.slice(0, 64);
			const name = String(src && src.name ? src.name : "")
				.trim()
				.slice(0, 80);
			const url = String(src && src.url ? src.url : "")
				.trim()
				.slice(0, 2000);
			const color = String(src && src.color ? src.color : "")
				.trim()
				.slice(0, 32);
			const enabled = Boolean(src && src.enabled);
			if (!url) return null;
			return { id, name, url, color, enabled };
		})
		.filter(Boolean);
	const rawEvents = Array.isArray(safe.localEvents) ? safe.localEvents : [];
	const localEvents = rawEvents
		.slice(0, 500)
		.map((evt) => {
			const id = String(evt && evt.id ? evt.id : "")
				.trim()
				.slice(0, 64);
			const title = String(evt && evt.title ? evt.title : "")
				.trim()
				.slice(0, 140);
			const location = String(evt && evt.location ? evt.location : "")
				.trim()
				.slice(0, 200);
			const googleEventId = String(evt && evt.googleEventId ? evt.googleEventId : "")
				.trim()
				.slice(0, 256);
			const outlookEventId = String(
				evt && evt.outlookEventId ? evt.outlookEventId : ""
			)
				.trim()
				.slice(0, 256);
			const startRaw = evt && evt.start ? evt.start : "";
			const endRaw = evt && evt.end ? evt.end : "";
			const startDate = new Date(startRaw);
			const endDate = new Date(endRaw);
			if (Number.isNaN(startDate.getTime())) return null;
			if (Number.isNaN(endDate.getTime())) return null;
			const allDay = Boolean(evt && evt.allDay);
			return {
				id: id || crypto.randomUUID(),
				title: title || "(Ohne Titel)",
				start: startDate.toISOString(),
				end: endDate.toISOString(),
				allDay,
				location,
				googleEventId,
				outlookEventId,
			};
		})
		.filter(Boolean);
	const googleCalendarId = String(safe.googleCalendarId || "")
		.trim()
		.slice(0, 256);
	const outlookCalendarId = String(safe.outlookCalendarId || "")
		.trim()
		.slice(0, 256);
	const rawView = String(safe.defaultView || "").trim();
	const defaultView = ["day", "week", "month"].includes(rawView)
		? rawView
		: "month";
	return {
		sources,
		defaultView,
		localEvents,
		googleCalendarId: googleCalendarId || "primary",
		outlookCalendarId: outlookCalendarId || "primary",
	};
}

function parseCalendarJson(raw) {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return null;
		return sanitizeCalendarSettings(parsed);
	} catch {
		return null;
	}
}

function getLinearKeyCipherKey() {
	if (!LINEAR_KEY_SECRET) return null;
	return crypto.createHash("sha256").update(LINEAR_KEY_SECRET).digest();
}

function encryptLinearApiKey(raw) {
	const key = getLinearKeyCipherKey();
	if (!key) return { ok: false, error: "linear_key_secret_missing" };
	try {
		const iv = crypto.randomBytes(12);
		const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
		const ciphertext = Buffer.concat([
			cipher.update(String(raw || ""), "utf8"),
			cipher.final(),
		]);
		const tag = cipher.getAuthTag();
		return {
			ok: true,
			ciphertext: ciphertext.toString("base64url"),
			iv: iv.toString("base64url"),
			tag: tag.toString("base64url"),
		};
	} catch {
		return { ok: false, error: "linear_key_encrypt_failed" };
	}
}

function decryptLinearApiKey(ciphertext, iv, tag) {
	const key = getLinearKeyCipherKey();
	if (!key) return { ok: false, error: "linear_key_secret_missing" };
	try {
		const decipher = crypto.createDecipheriv(
			"aes-256-gcm",
			key,
			Buffer.from(String(iv || ""), "base64url")
		);
		decipher.setAuthTag(Buffer.from(String(tag || ""), "base64url"));
		const plaintext = Buffer.concat([
			decipher.update(Buffer.from(String(ciphertext || ""), "base64url")),
			decipher.final(),
		]);
		return { ok: true, value: plaintext.toString("utf8") };
	} catch {
		return { ok: false, error: "linear_key_decrypt_failed" };
	}
}

function getUserSettingsRow(userId) {
	initDb();
	return stmtUserSettingsGet.get(userId) || null;
}

function getUserSettings(userId) {
	const row = getUserSettingsRow(userId);
	if (!row) return null;
	const calendar = parseCalendarJson(row.calendar_json);
	const linearApiKeySet = Boolean(
		row.linear_api_key_ciphertext &&
			row.linear_api_key_iv &&
			row.linear_api_key_tag
	);
	const bflApiKeySet = Boolean(
		row.bfl_api_key_ciphertext &&
			row.bfl_api_key_iv &&
			row.bfl_api_key_tag
	);
	return {
		calendar:
			calendar ||
			{
				sources: [],
				defaultView: "month",
				localEvents: [],
				googleCalendarId: "primary",
				outlookCalendarId: "primary",
			},
		updatedAt: Number(row.updated_at) || 0,
		linearApiKeySet,
		bflApiKeySet,
	};
}

function upsertUserSettings(userId, settings) {
	initDb();
	const now = Date.now();
	const calendar = sanitizeCalendarSettings(settings && settings.calendar);
	const calendarJson = JSON.stringify(
		calendar ||
			{
				sources: [],
				defaultView: "month",
				localEvents: [],
				googleCalendarId: "primary",
				outlookCalendarId: "primary",
			}
	);
	stmtUserSettingsUpsert.run(userId, calendarJson, now);
	return { calendar, updatedAt: now };
}

function getUserLinearApiKey(userId) {
	const row = getUserSettingsRow(userId);
	if (!row) return { ok: true, key: "" };
	const ciphertext = String(row.linear_api_key_ciphertext || "");
	const iv = String(row.linear_api_key_iv || "");
	const tag = String(row.linear_api_key_tag || "");
	if (!ciphertext || !iv || !tag) return { ok: true, key: "" };
	const decrypted = decryptLinearApiKey(ciphertext, iv, tag);
	if (!decrypted.ok) return { ok: false, error: decrypted.error };
	return { ok: true, key: String(decrypted.value || "") };
}

function saveUserLinearApiKey(userId, apiKey) {
	const nextKey = String(apiKey || "").trim();
	const now = Date.now();
	const row = getUserSettingsRow(userId);
	const calendarJson = row && row.calendar_json
		? String(row.calendar_json)
		: JSON.stringify({
			sources: [],
			defaultView: "month",
			localEvents: [],
			googleCalendarId: "primary",
			outlookCalendarId: "primary",
		});
	if (!nextKey) {
		stmtUserLinearKeyUpsert.run(userId, calendarJson, "", "", "", now);
		return { ok: true };
	}
	const encrypted = encryptLinearApiKey(nextKey);
	if (!encrypted.ok) return encrypted;
	stmtUserLinearKeyUpsert.run(
		userId,
		calendarJson,
		String(encrypted.ciphertext || ""),
		String(encrypted.iv || ""),
		String(encrypted.tag || ""),
		now
	);
	return { ok: true };
}

function getUserBflApiKey(userId) {
	const row = getUserSettingsRow(userId);
	if (!row) return { ok: true, key: "" };
	const ciphertext = String(row.bfl_api_key_ciphertext || "");
	const iv = String(row.bfl_api_key_iv || "");
	const tag = String(row.bfl_api_key_tag || "");
	if (!ciphertext || !iv || !tag) return { ok: true, key: "" };
	const decrypted = decryptLinearApiKey(ciphertext, iv, tag);
	if (!decrypted.ok) return { ok: false, error: decrypted.error };
	return { ok: true, key: String(decrypted.value || "") };
}

function saveUserBflApiKey(userId, apiKey) {
	const nextKey = String(apiKey || "").trim();
	const now = Date.now();
	const row = getUserSettingsRow(userId);
	const calendarJson = row && row.calendar_json
		? String(row.calendar_json)
		: JSON.stringify({
			sources: [],
			defaultView: "month",
			localEvents: [],
			googleCalendarId: "primary",
			outlookCalendarId: "primary",
		});
	if (!nextKey) {
		stmtUserBflKeyUpsert.run(userId, calendarJson, "", "", "", now);
		return { ok: true };
	}
	const encrypted = encryptLinearApiKey(nextKey);
	if (!encrypted.ok) return encrypted;
	stmtUserBflKeyUpsert.run(
		userId,
		calendarJson,
		String(encrypted.ciphertext || ""),
		String(encrypted.iv || ""),
		String(encrypted.tag || ""),
		now
	);
	return { ok: true };
}

function googleConfigured() {
	return Boolean(
		GOOGLE_OAUTH_CLIENT_ID &&
			GOOGLE_OAUTH_CLIENT_SECRET &&
			GOOGLE_OAUTH_REDIRECT_URL
	);
}

function outlookConfigured() {
	return Boolean(
		OUTLOOK_OAUTH_CLIENT_ID &&
			OUTLOOK_OAUTH_CLIENT_SECRET &&
			OUTLOOK_OAUTH_REDIRECT_URL &&
			OUTLOOK_OAUTH_TENANT
	);
}

function makeGoogleState(email) {
	const exp = Date.now() + 1000 * 60 * 10;
	const payload = Buffer.from(
		JSON.stringify({ email, exp, nonce: crypto.randomUUID() }),
		"utf8"
	).toString("base64url");
	return `${payload}.${sign(payload)}`;
}

function parseGoogleState(state) {
	const raw = String(state || "");
	const [payload, sig] = raw.split(".");
	if (!payload || !sig) return "";
	if (sign(payload) !== sig) return "";
	try {
		const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
		if (!decoded || typeof decoded !== "object") return "";
		if (typeof decoded.exp !== "number" || Date.now() > decoded.exp) return "";
		return typeof decoded.email === "string" ? decoded.email : "";
	} catch {
		return "";
	}
}

function makeOutlookState(email) {
	const exp = Date.now() + 1000 * 60 * 10;
	const payload = Buffer.from(
		JSON.stringify({ email, exp, nonce: crypto.randomUUID() }),
		"utf8"
	).toString("base64url");
	return `${payload}.${sign(payload)}`;
}

function parseOutlookState(state) {
	const raw = String(state || "");
	const [payload, sig] = raw.split(".");
	if (!payload || !sig) return "";
	if (sign(payload) !== sig) return "";
	try {
		const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
		if (!decoded || typeof decoded !== "object") return "";
		if (typeof decoded.exp !== "number" || Date.now() > decoded.exp) return "";
		return typeof decoded.email === "string" ? decoded.email : "";
	} catch {
		return "";
	}
}

function getGoogleTokens(userId) {
	initDb();
	return stmtGoogleTokenGet.get(userId) || null;
}

function saveGoogleTokens(userId, token) {
	initDb();
	const now = Date.now();
	stmtGoogleTokenUpsert.run(
		userId,
		String(token.access_token || ""),
		String(token.refresh_token || ""),
		Number(token.expires_at || 0),
		String(token.scope || ""),
		String(token.token_type || ""),
		now
	);
}

function deleteGoogleTokens(userId) {
	initDb();
	stmtGoogleTokenDelete.run(userId);
}

function getOutlookTokens(userId) {
	initDb();
	return stmtOutlookTokenGet.get(userId) || null;
}

function saveOutlookTokens(userId, token) {
	initDb();
	const now = Date.now();
	stmtOutlookTokenUpsert.run(
		userId,
		String(token.access_token || ""),
		String(token.refresh_token || ""),
		Number(token.expires_at || 0),
		String(token.scope || ""),
		String(token.token_type || ""),
		now
	);
}

function deleteOutlookTokens(userId) {
	initDb();
	stmtOutlookTokenDelete.run(userId);
}

function getGoogleCalendarIdForUser(userId) {
	const settings = getUserSettings(userId);
	const id = settings && settings.calendar ? settings.calendar.googleCalendarId : "";
	const safe = String(id || "primary").trim() || "primary";
	return safe.slice(0, 256);
}

function getOutlookCalendarIdForUser(userId) {
	const settings = getUserSettings(userId);
	const id = settings && settings.calendar ? settings.calendar.outlookCalendarId : "";
	const safe = String(id || "primary").trim() || "primary";
	return safe.slice(0, 256);
}

async function refreshGoogleAccessToken(refreshToken) {
	const params = new URLSearchParams();
	params.set("client_id", GOOGLE_OAUTH_CLIENT_ID);
	params.set("client_secret", GOOGLE_OAUTH_CLIENT_SECRET);
	params.set("refresh_token", refreshToken);
	params.set("grant_type", "refresh_token");
	const res = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.toString(),
	});
	if (!res.ok) throw new Error("refresh_failed");
	const data = await res.json();
	const expiresAt = Date.now() + Number(data.expires_in || 0) * 1000;
	return {
		access_token: data.access_token,
		refresh_token: refreshToken,
		expires_at: expiresAt,
		scope: String(data.scope || ""),
		token_type: String(data.token_type || "Bearer"),
	};
}

async function getGoogleAccessToken(userId) {
	const token = getGoogleTokens(userId);
	if (!token) return null;
	const now = Date.now();
	if (Number(token.expires_at || 0) - now > 60_000) {
		return token;
	}
	if (!token.refresh_token) return null;
	try {
		const refreshed = await refreshGoogleAccessToken(token.refresh_token);
		saveGoogleTokens(userId, refreshed);
		return refreshed;
	} catch {
		return null;
	}
}

async function refreshOutlookAccessToken(refreshToken) {
	const params = new URLSearchParams();
	params.set("client_id", OUTLOOK_OAUTH_CLIENT_ID);
	params.set("client_secret", OUTLOOK_OAUTH_CLIENT_SECRET);
	params.set("refresh_token", refreshToken);
	params.set("grant_type", "refresh_token");
	params.set("scope", "https://graph.microsoft.com/Calendars.ReadWrite offline_access User.Read");
	const res = await fetch(
		`https://login.microsoftonline.com/${encodeURIComponent(
			OUTLOOK_OAUTH_TENANT
		)}/oauth2/v2.0/token`,
		{
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: params.toString(),
		}
	);
	if (!res.ok) throw new Error("refresh_failed");
	const data = await res.json();
	const expiresAt = Date.now() + Number(data.expires_in || 0) * 1000;
	return {
		access_token: data.access_token,
		refresh_token: refreshToken,
		expires_at: expiresAt,
		scope: String(data.scope || ""),
		token_type: String(data.token_type || "Bearer"),
	};
}

async function getOutlookAccessToken(userId) {
	const token = getOutlookTokens(userId);
	if (!token) return null;
	const now = Date.now();
	if (Number(token.expires_at || 0) - now > 60_000) {
		return token;
	}
	if (!token.refresh_token) return null;
	try {
		const refreshed = await refreshOutlookAccessToken(token.refresh_token);
		saveOutlookTokens(userId, refreshed);
		return refreshed;
	} catch {
		return null;
	}
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

/** roomKey -> { noteId: string, text: string, updatedAt: number } */
const roomSharedPins = new Map();

/** roomKey -> { update?: string, text?: string, ts?: number, ciphertext?: string, iv?: string, v?: string } */
const roomCrdtSnapshots = new Map();

/** roomKey -> Map<noteId, { visible: boolean, offset: { x: number, y: number } }> */
const roomExcalidrawState = new Map();
/** roomKey -> Map<noteId, { visible: boolean, offset: { x: number, y: number } }> */
const roomExcelState = new Map();
/** roomKey -> Map<noteId, { visible: boolean, offset: { x: number, y: number }, projectId?: string, projectName?: string }> */
const roomLinearState = new Map();
/** roomKey -> Map<noteId, { projectId?: string, projectName?: string, updatedAt?: number, tasks?: Array<object> }> */
const roomLinearData = new Map();
/** roomKey -> Map<noteId, sceneJsonString> */
const roomExcalidrawScenes = new Map();
const EXCALIDRAW_SCENE_MAX_BYTES = 200000;
/** roomKey -> Map<clientId, { name, color, busy: Array<{start:number, end:number}> }> */
const roomAvailabilityState = new Map();

function getRoomAvailabilityState(roomKeyName) {
	let map = roomAvailabilityState.get(roomKeyName);
	if (!map) {
		map = new Map();
		roomAvailabilityState.set(roomKeyName, map);
	}
	return map;
}

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

function getRoomSharedPin(roomKeyName, room, key) {
	let entry = roomSharedPins.get(roomKeyName);
	if (entry) return entry;
	const persisted = loadPersistedRoomSharedPin(room, key);
	if (persisted) {
		roomSharedPins.set(roomKeyName, persisted);
		return persisted;
	}
	return null;
}

function getRoomExcalidrawState(roomKeyName) {
	let map = roomExcalidrawState.get(roomKeyName);
	if (!map) {
		map = new Map();
		roomExcalidrawState.set(roomKeyName, map);
	}
	return map;
}

function getRoomExcelState(roomKeyName) {
	let map = roomExcelState.get(roomKeyName);
	if (!map) {
		map = new Map();
		roomExcelState.set(roomKeyName, map);
	}
	return map;
}

function getRoomLinearState(roomKeyName) {
	let map = roomLinearState.get(roomKeyName);
	if (!map) {
		map = new Map();
		roomLinearState.set(roomKeyName, map);
	}
	return map;
}

function getRoomLinearData(roomKeyName) {
	let map = roomLinearData.get(roomKeyName);
	if (!map) {
		map = new Map();
		roomLinearData.set(roomKeyName, map);
	}
	return map;
}

function getRoomExcalidrawScenes(roomKeyName) {
	let map = roomExcalidrawScenes.get(roomKeyName);
	if (!map) {
		map = new Map();
		roomExcalidrawScenes.set(roomKeyName, map);
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

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url || "/", `http://${req.headers.host}`);

	// --- API: Personal Space + Notes ---
	if (url.pathname === "/favicon.ico") {
		res.writeHead(204, { "Cache-Control": "no-store" });
		res.end();
		return;
	}

	if (url.pathname === "/api/linear" && req.method === "POST") {
		const authHeader = String(req.headers.authorization || "").trim();
		if (!authHeader) {
			json(res, 401, { ok: false, error: "missing_auth" });
			return;
		}
		let payload;
		try {
			payload = await readJsonWithLimit(req, MAX_BODY_BYTES);
		} catch (err) {
			const code = err && err.message === "body_too_large" ? 413 : 400;
			json(res, code, { ok: false, error: "invalid_body" });
			return;
		}
		if (!payload) {
			json(res, 400, { ok: false, error: "invalid_body" });
			return;
		}
		try {
			const apiRes = await fetch("https://api.linear.app/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: authHeader,
				},
				body: JSON.stringify(payload),
			});
			const bodyText = await apiRes.text();
			res.writeHead(apiRes.status, {
				"Content-Type": apiRes.headers.get("content-type") || "application/json",
				"Cache-Control": "no-store",
			});
			res.end(bodyText);
			return;
		} catch {
			json(res, 502, { ok: false, error: "linear_api_failed" });
			return;
		}
	}

	if (url.pathname === "/api/calendar/google/status" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!googleConfigured()) {
			json(res, 200, { ok: true, configured: false, connected: false });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getGoogleAccessToken(userId);
		json(res, 200, {
			ok: true,
			configured: true,
			connected: Boolean(token && token.access_token),
			email,
			calendarId: getGoogleCalendarIdForUser(userId),
		});
		return;
	}

	if (
		url.pathname === "/api/calendar/google/calendars" &&
		req.method === "GET"
	) {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!googleConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getGoogleAccessToken(userId);
		if (!token || !token.access_token) {
			json(res, 401, { ok: false, error: "not_connected" });
			return;
		}
		try {
			const apiRes = await fetch(
				"https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250",
				{
					headers: {
						Authorization: `Bearer ${token.access_token}`,
					},
				}
			);
			if (!apiRes.ok) {
				let detail = "";
				try { detail = await apiRes.text(); } catch {}
				console.error(`[google] GET calendars failed: ${apiRes.status} ${detail.slice(0, 500)}`);
				const proxyStatus = apiRes.status >= 400 && apiRes.status < 500 ? apiRes.status : 502;
				json(res, proxyStatus, { ok: false, error: "google_api_error", status: apiRes.status, message: detail.slice(0, 200) });
				return;
			}
			const data = await apiRes.json();
			const calendars = Array.isArray(data && data.items)
				? data.items.map((item) => ({
						id: String(item.id || "").trim(),
						summary: String(item.summary || "").trim(),
						primary: Boolean(item.primary),
						accessRole: String(item.accessRole || "").trim(),
					}))
				: [];
			json(res, 200, { ok: true, calendars });
			return;
		} catch (err) {
			console.error(`[google] GET calendars exception:`, err && err.message ? err.message : err);
			json(res, 500, { ok: false, error: "google_api_failed" });
			return;
		}
	}

	if (url.pathname === "/api/calendar/google/auth" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!googleConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const state = makeGoogleState(email);
		const params = new URLSearchParams();
		params.set("client_id", GOOGLE_OAUTH_CLIENT_ID);
		params.set("redirect_uri", GOOGLE_OAUTH_REDIRECT_URL);
		params.set("response_type", "code");
		params.set("access_type", "offline");
		params.set("prompt", "consent");
		params.set("include_granted_scopes", "true");
		params.set("scope", "https://www.googleapis.com/auth/calendar");
		params.set("state", state);
		redirect(
			res,
			`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
		);
		return;
	}

	if (url.pathname === "/api/calendar/google/callback" && req.method === "GET") {
		if (!googleConfigured()) {
			text(res, 400, "Google OAuth not configured.");
			return;
		}
		const code = String(url.searchParams.get("code") || "").trim();
		const state = String(url.searchParams.get("state") || "").trim();
		const email = parseGoogleState(state);
		if (!code || !email) {
			text(res, 400, "Invalid OAuth callback.");
			return;
		}
		const userId = getOrCreateUserId(email);
		const params = new URLSearchParams();
		params.set("code", code);
		params.set("client_id", GOOGLE_OAUTH_CLIENT_ID);
		params.set("client_secret", GOOGLE_OAUTH_CLIENT_SECRET);
		params.set("redirect_uri", GOOGLE_OAUTH_REDIRECT_URL);
		params.set("grant_type", "authorization_code");
		try {
			const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: params.toString(),
			});
			if (!tokenRes.ok) {
				text(res, 400, "OAuth token exchange failed.");
				return;
			}
			const data = await tokenRes.json();
			const existing = getGoogleTokens(userId);
			const refreshToken =
				String(data.refresh_token || "").trim() ||
				(existing ? String(existing.refresh_token || "") : "");
			if (!refreshToken) {
				text(res, 400, "Missing refresh token.");
				return;
			}
			const expiresAt = Date.now() + Number(data.expires_in || 0) * 1000;
			saveGoogleTokens(userId, {
				access_token: data.access_token,
				refresh_token: refreshToken,
				expires_at: expiresAt,
				scope: String(data.scope || ""),
				token_type: String(data.token_type || "Bearer"),
			});
			redirect(res, "/?google=connected");
			return;
		} catch {
			text(res, 500, "OAuth flow failed.");
			return;
		}
	}

	if (
		url.pathname === "/api/calendar/google/disconnect" &&
		req.method === "POST"
	) {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		deleteGoogleTokens(userId);
		json(res, 200, { ok: true });
		return;
	}

	if (url.pathname === "/api/calendar/google/events" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!googleConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getGoogleAccessToken(userId);
		if (!token || !token.access_token) {
			json(res, 401, { ok: false, error: "not_connected" });
			return;
		}
		const calendarId = getGoogleCalendarIdForUser(userId);
		const body = await readJson(req);
		const title = String(body && body.title ? body.title : "").trim();
		if (!title) {
			json(res, 400, { ok: false, error: "missing_title" });
			return;
		}
		const allDay = Boolean(body && body.allDay);
		const location = String(body && body.location ? body.location : "").trim();
		const timeZone = String(body && body.timeZone ? body.timeZone : "UTC");
		const startIso = String(body && body.start ? body.start : "").trim();
		const endIso = String(body && body.end ? body.end : "").trim();
		const startDate = String(body && body.startDate ? body.startDate : "").trim();
		const endDate = String(body && body.endDate ? body.endDate : "").trim();
		if (allDay && (!startDate || !endDate)) {
			json(res, 400, { ok: false, error: "missing_date" });
			return;
		}
		if (!allDay && (!startIso || !endIso)) {
			json(res, 400, { ok: false, error: "missing_time" });
			return;
		}
		const payload = {
			summary: title,
			location: location || undefined,
			start: allDay
				? { date: startDate, timeZone }
				: { dateTime: startIso, timeZone },
			end: allDay
				? { date: endDate, timeZone }
				: { dateTime: endIso, timeZone },
		};
		try {
			const apiRes = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
					calendarId
				)}/events`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token.access_token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);
			if (!apiRes.ok) {
				let detail = "";
				try { detail = await apiRes.text(); } catch {}
				console.error(`[google] POST events failed: ${apiRes.status} ${detail.slice(0, 500)}`);
				const proxyStatus = apiRes.status >= 400 && apiRes.status < 500 ? apiRes.status : 502;
				json(res, proxyStatus, { ok: false, error: "google_api_error", status: apiRes.status, message: detail.slice(0, 200) });
				return;
			}
			const data = await apiRes.json();
			json(res, 200, { ok: true, eventId: data && data.id ? data.id : "" });
			return;
		} catch (err) {
			console.error(`[google] POST events exception:`, err && err.message ? err.message : err);
			json(res, 500, { ok: false, error: "google_api_failed" });
			return;
		}
	}

	if (url.pathname === "/api/calendar/google/events" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!googleConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getGoogleAccessToken(userId);
		if (!token || !token.access_token) {
			json(res, 401, { ok: false, error: "not_connected" });
			return;
		}
		const start = String(url.searchParams.get("start") || "").trim();
		const end = String(url.searchParams.get("end") || "").trim();
		if (!start || !end) {
			json(res, 400, { ok: false, error: "missing_range" });
			return;
		}
		const calendarId = getGoogleCalendarIdForUser(userId);
		const params = new URLSearchParams();
		params.set("timeMin", start);
		params.set("timeMax", end);
		params.set("singleEvents", "true");
		params.set("orderBy", "startTime");
		params.set("maxResults", "2500");
		try {
			const apiRes = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
					calendarId
				)}/events?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${token.access_token}`,
					},
				}
			);
			if (!apiRes.ok) {
				let detail = "";
				try { detail = await apiRes.text(); } catch {}
				console.error(`[google] GET events failed: ${apiRes.status} ${detail.slice(0, 500)}`);
				const proxyStatus = apiRes.status >= 400 && apiRes.status < 500 ? apiRes.status : 502;
				json(res, proxyStatus, { ok: false, error: "google_api_error", status: apiRes.status, message: detail.slice(0, 200) });
				return;
			}
			const data = await apiRes.json();
			const items = Array.isArray(data && data.items) ? data.items : [];
			const events = items.map((evt) => ({
				id: String(evt.id || ""),
				title: String(evt.summary || "(Ohne Titel)"),
				location: String(evt.location || ""),
				allDay: Boolean(evt.start && evt.start.date),
				start: evt.start && (evt.start.dateTime || evt.start.date),
				end: evt.end && (evt.end.dateTime || evt.end.date),
			}));
			json(res, 200, { ok: true, events });
			return;
		} catch (err) {
			console.error(`[google] GET events exception:`, err && err.message ? err.message : err);
			json(res, 500, { ok: false, error: "google_api_failed" });
			return;
		}
	}

	if (
		url.pathname.startsWith("/api/calendar/google/events/") &&
		req.method === "DELETE"
	) {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!googleConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getGoogleAccessToken(userId);
		if (!token || !token.access_token) {
			json(res, 401, { ok: false, error: "not_connected" });
			return;
		}
		const calendarId = getGoogleCalendarIdForUser(userId);
		const eventId = decodeURIComponent(
			url.pathname.replace("/api/calendar/google/events/", "")
		);
		if (!eventId) {
			json(res, 400, { ok: false, error: "missing_event_id" });
			return;
		}
		try {
			const apiRes = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
					calendarId
				)}/events/${encodeURIComponent(
					eventId
				)}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token.access_token}`,
					},
				}
			);
			if (!apiRes.ok && apiRes.status !== 204) {
				let detail = "";
				try { detail = await apiRes.text(); } catch {}
				console.error(`[google] DELETE event failed: ${apiRes.status} ${detail.slice(0, 500)}`);
				const proxyStatus = apiRes.status >= 400 && apiRes.status < 500 ? apiRes.status : 502;
				json(res, proxyStatus, { ok: false, error: "google_api_error", status: apiRes.status, message: detail.slice(0, 200) });
				return;
			}
			json(res, 200, { ok: true });
			return;
		} catch (err) {
			console.error(`[google] DELETE event exception:`, err && err.message ? err.message : err);
			json(res, 500, { ok: false, error: "google_api_failed" });
			return;
		}
	}

	if (url.pathname === "/api/calendar/ics" && req.method === "GET") {
		const rawUrl = String(url.searchParams.get("url") || "").trim();
		if (!rawUrl) {
			json(res, 400, { ok: false, error: "missing_url" });
			return;
		}
		let target;
		try {
			target = new URL(rawUrl);
		} catch {
			json(res, 400, { ok: false, error: "invalid_url" });
			return;
		}
		if (target.protocol !== "https:") {
			json(res, 400, { ok: false, error: "invalid_protocol" });
			return;
		}
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 12000);
		fetch(target.toString(), {
			signal: controller.signal,
			redirect: "follow",
			headers: {
				"User-Agent": "Mirror/1.0",
				Accept: "text/calendar,text/plain,*/*",
			},
		})
			.then((upstream) => {
				clearTimeout(timer);
				if (!upstream.ok) {
					json(res, 502, { ok: false, error: "calendar_fetch_failed" });
					return null;
				}
				return upstream.text();
			})
			.then((text) => {
				if (text === null || typeof text !== "string") return;
				res.writeHead(200, {
					"Content-Type": "text/calendar; charset=utf-8",
					"Cache-Control": "no-store",
				});
				res.end(text);
			})
			.catch(() => {
				clearTimeout(timer);
				json(res, 502, { ok: false, error: "calendar_fetch_failed" });
			});
		return;
	}

	if (url.pathname === "/api/calendar/outlook/status" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!outlookConfigured()) {
			json(res, 200, { ok: true, configured: false, connected: false });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getOutlookAccessToken(userId);
		json(res, 200, {
			ok: true,
			configured: true,
			connected: Boolean(token && token.access_token),
			email,
			calendarId: getOutlookCalendarIdForUser(userId),
		});
		return;
	}

	if (
		url.pathname === "/api/calendar/outlook/calendars" &&
		req.method === "GET"
	) {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!outlookConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getOutlookAccessToken(userId);
		if (!token || !token.access_token) {
			json(res, 401, { ok: false, error: "not_connected" });
			return;
		}
		try {
			const apiRes = await fetch("https://graph.microsoft.com/v1.0/me/calendars", {
				headers: {
					Authorization: `Bearer ${token.access_token}`,
				},
			});
			if (!apiRes.ok) {
				let detail = "";
				try { detail = await apiRes.text(); } catch {}
				console.error(`[outlook] GET calendars failed: ${apiRes.status} ${detail.slice(0, 500)}`);
				const proxyStatus = apiRes.status >= 400 && apiRes.status < 500 ? apiRes.status : 502;
				json(res, proxyStatus, { ok: false, error: "outlook_api_error", status: apiRes.status, message: detail.slice(0, 200) });
				return;
			}
			const data = await apiRes.json();
			const calendars = Array.isArray(data && data.value)
				? data.value.map((item) => ({
						id: String(item.id || "").trim(),
						name: String(item.name || "").trim(),
						isDefault: Boolean(item.isDefaultCalendar),
					}))
				: [];
			json(res, 200, { ok: true, calendars });
			return;
		} catch (err) {
			console.error(`[outlook] GET calendars exception:`, err && err.message ? err.message : err);
			json(res, 500, { ok: false, error: "outlook_api_failed" });
			return;
		}
	}

	if (url.pathname === "/api/calendar/outlook/auth" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!outlookConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const state = makeOutlookState(email);
		const params = new URLSearchParams();
		params.set("client_id", OUTLOOK_OAUTH_CLIENT_ID);
		params.set("redirect_uri", OUTLOOK_OAUTH_REDIRECT_URL);
		params.set("response_type", "code");
		params.set("response_mode", "query");
		params.set("prompt", "consent");
		params.set(
			"scope",
			"https://graph.microsoft.com/Calendars.ReadWrite offline_access User.Read"
		);
		params.set("state", state);
		const authUrl = `https://login.microsoftonline.com/${encodeURIComponent(
			OUTLOOK_OAUTH_TENANT
		)}/oauth2/v2.0/authorize?${params.toString()}`;
		redirect(res, authUrl);
		return;
	}

	if (url.pathname === "/api/calendar/outlook/callback" && req.method === "GET") {
		if (!outlookConfigured()) {
			text(res, 400, "Outlook OAuth not configured.");
			return;
		}
		const code = String(url.searchParams.get("code") || "").trim();
		const state = String(url.searchParams.get("state") || "").trim();
		const email = parseOutlookState(state);
		if (!code || !email) {
			text(res, 400, "Invalid OAuth callback.");
			return;
		}
		const userId = getOrCreateUserId(email);
		const params = new URLSearchParams();
		params.set("code", code);
		params.set("client_id", OUTLOOK_OAUTH_CLIENT_ID);
		params.set("client_secret", OUTLOOK_OAUTH_CLIENT_SECRET);
		params.set("redirect_uri", OUTLOOK_OAUTH_REDIRECT_URL);
		params.set("grant_type", "authorization_code");
		params.set(
			"scope",
			"https://graph.microsoft.com/Calendars.ReadWrite offline_access User.Read"
		);
		try {
			const tokenRes = await fetch(
				`https://login.microsoftonline.com/${encodeURIComponent(
					OUTLOOK_OAUTH_TENANT
				)}/oauth2/v2.0/token`,
				{
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: params.toString(),
				}
			);
			if (!tokenRes.ok) {
				text(res, 400, "OAuth token exchange failed.");
				return;
			}
			const data = await tokenRes.json();
			const existing = getOutlookTokens(userId);
			const refreshToken =
				String(data.refresh_token || "").trim() ||
				(existing ? String(existing.refresh_token || "") : "");
			if (!refreshToken) {
				text(res, 400, "Missing refresh token.");
				return;
			}
			const expiresAt = Date.now() + Number(data.expires_in || 0) * 1000;
			saveOutlookTokens(userId, {
				access_token: data.access_token,
				refresh_token: refreshToken,
				expires_at: expiresAt,
				scope: String(data.scope || ""),
				token_type: String(data.token_type || "Bearer"),
			});
			redirect(res, "/?outlook=connected");
			return;
		} catch {
			text(res, 500, "OAuth flow failed.");
			return;
		}
	}

	if (
		url.pathname === "/api/calendar/outlook/disconnect" &&
		req.method === "POST"
	) {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		deleteOutlookTokens(userId);
		json(res, 200, { ok: true });
		return;
	}

	if (url.pathname === "/api/calendar/outlook/events" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!outlookConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getOutlookAccessToken(userId);
		if (!token || !token.access_token) {
			json(res, 401, { ok: false, error: "not_connected" });
			return;
		}
		const calendarId = getOutlookCalendarIdForUser(userId);
		const body = await readJson(req);
		const title = String(body && body.title ? body.title : "").trim();
		if (!title) {
			json(res, 400, { ok: false, error: "missing_title" });
			return;
		}
		const allDay = Boolean(body && body.allDay);
		const location = String(body && body.location ? body.location : "").trim();
		const timeZone = String(body && body.timeZone ? body.timeZone : "UTC");
		const startIso = String(body && body.start ? body.start : "").trim();
		const endIso = String(body && body.end ? body.end : "").trim();
		const startDate = String(body && body.startDate ? body.startDate : "").trim();
		const endDate = String(body && body.endDate ? body.endDate : "").trim();
		if (allDay && (!startDate || !endDate)) {
			json(res, 400, { ok: false, error: "missing_date" });
			return;
		}
		if (!allDay && (!startIso || !endIso)) {
			json(res, 400, { ok: false, error: "missing_time" });
			return;
		}
		const payload = {
			subject: title,
			location: location ? { displayName: location } : undefined,
			start: allDay
				? { dateTime: `${startDate}T00:00:00`, timeZone }
				: { dateTime: startIso, timeZone },
			end: allDay
				? { dateTime: `${endDate}T00:00:00`, timeZone }
				: { dateTime: endIso, timeZone },
			isAllDay: Boolean(allDay),
		};
		const targetUrl =
			calendarId && calendarId !== "primary"
				? `https://graph.microsoft.com/v1.0/me/calendars/${encodeURIComponent(
						calendarId
					)}/events`
				: "https://graph.microsoft.com/v1.0/me/calendar/events";
		try {
			const apiRes = await fetch(targetUrl, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token.access_token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			if (!apiRes.ok) {
				let detail = "";
				try { detail = await apiRes.text(); } catch {}
				console.error(`[outlook] POST events failed: ${apiRes.status} ${detail.slice(0, 500)}`);
				const proxyStatus = apiRes.status >= 400 && apiRes.status < 500 ? apiRes.status : 502;
				json(res, proxyStatus, { ok: false, error: "outlook_api_error", status: apiRes.status, message: detail.slice(0, 200) });
				return;
			}
			const data = await apiRes.json();
			json(res, 200, { ok: true, eventId: data && data.id ? data.id : "" });
			return;
		} catch (err) {
			console.error(`[outlook] POST events exception:`, err && err.message ? err.message : err);
			json(res, 500, { ok: false, error: "outlook_api_failed" });
			return;
		}
	}

	if (url.pathname === "/api/calendar/outlook/events" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!outlookConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getOutlookAccessToken(userId);
		if (!token || !token.access_token) {
			json(res, 401, { ok: false, error: "not_connected" });
			return;
		}
		const start = String(url.searchParams.get("start") || "").trim();
		const end = String(url.searchParams.get("end") || "").trim();
		if (!start || !end) {
			json(res, 400, { ok: false, error: "missing_range" });
			return;
		}
		const params = new URLSearchParams();
		params.set("startDateTime", start);
		params.set("endDateTime", end);
		try {
			const apiRes = await fetch(
				`https://graph.microsoft.com/v1.0/me/calendarView?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${token.access_token}`,
						Prefer: 'outlook.timezone="UTC"',
					},
				}
			);
			if (!apiRes.ok) {
				let detail = "";
				try { detail = await apiRes.text(); } catch {}
				console.error(`[outlook] GET events failed: ${apiRes.status} ${detail.slice(0, 500)}`);
				const proxyStatus = apiRes.status >= 400 && apiRes.status < 500 ? apiRes.status : 502;
				json(res, proxyStatus, { ok: false, error: "outlook_api_error", status: apiRes.status, message: detail.slice(0, 200) });
				return;
			}
			const data = await apiRes.json();
			const items = Array.isArray(data && data.value) ? data.value : [];
			const events = items.map((evt) => ({
				id: String(evt.id || ""),
				title: String(evt.subject || "(Ohne Titel)"),
				location: String(
					evt.location && evt.location.displayName
						? evt.location.displayName
						: ""
				),
				allDay: Boolean(evt.isAllDay),
				start: evt.start && evt.start.dateTime,
				end: evt.end && evt.end.dateTime,
			}));
			json(res, 200, { ok: true, events });
			return;
		} catch (err) {
			console.error(`[outlook] GET events exception:`, err && err.message ? err.message : err);
			json(res, 500, { ok: false, error: "outlook_api_failed" });
			return;
		}
	}

	if (
		url.pathname.startsWith("/api/calendar/outlook/events/") &&
		req.method === "DELETE"
	) {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		if (!outlookConfigured()) {
			json(res, 400, { ok: false, error: "not_configured" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const token = await getOutlookAccessToken(userId);
		if (!token || !token.access_token) {
			json(res, 401, { ok: false, error: "not_connected" });
			return;
		}
		const eventId = decodeURIComponent(
			url.pathname.replace("/api/calendar/outlook/events/", "")
		);
		if (!eventId) {
			json(res, 400, { ok: false, error: "missing_event_id" });
			return;
		}
		try {
			const apiRes = await fetch(
				`https://graph.microsoft.com/v1.0/me/events/${encodeURIComponent(
					eventId
				)}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token.access_token}`,
					},
				}
			);
			if (!apiRes.ok && apiRes.status !== 204) {
				let detail = "";
				try { detail = await apiRes.text(); } catch {}
				console.error(`[outlook] DELETE event failed: ${apiRes.status} ${detail.slice(0, 500)}`);
				const proxyStatus = apiRes.status >= 400 && apiRes.status < 500 ? apiRes.status : 502;
				json(res, proxyStatus, { ok: false, error: "outlook_api_error", status: apiRes.status, message: detail.slice(0, 200) });
				return;
			}
			json(res, 200, { ok: true });
			return;
		} catch (err) {
			console.error(`[outlook] DELETE event exception:`, err && err.message ? err.message : err);
			json(res, 500, { ok: false, error: "outlook_api_failed" });
			return;
		}
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
				"Access-Control-Allow-Origin": "*",
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
		const roomPins = listRoomPins(userId);
		const sharedRooms = listSharedRooms(userId);
		const settings = getUserSettings(userId);
		json(res, 200, {
			ok: true,
			authed: true,
			email,
			tags,
			notes,
			favorites,
			roomTabs,
			roomPins,
			sharedRooms,
			settings,
		});
		return;
	}

	if (url.pathname === "/api/user-settings" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const settings = getUserSettings(userId);
		json(res, 200, { ok: true, settings });
		return;
	}

	if (url.pathname === "/api/user-settings" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const userId = getOrCreateUserId(email);
				const calendar = sanitizeCalendarSettings(body && body.calendar);
				const settings = upsertUserSettings(userId, { calendar });
				json(res, 200, { ok: true, settings });
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

	/* ── Saved Queries API ── */

	/* ── Room Slots API ── */

	if (url.pathname === "/api/room-slots" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) { json(res, 401, { ok: false, error: "unauthorized" }); return; }
		const rp = url.searchParams.get("room") || "";
		const kp = url.searchParams.get("key") || "";
		const rk = `${rp}:${kp}`;
		const userId = getOrCreateUserId(email);
		const row = stmtRoomSlotsGet.get(userId, rk);
		if (!row) {
			json(res, 200, { ok: true, slots: {}, sharing: false });
			return;
		}
		let slots = {};
		try { slots = JSON.parse(row.slots_json); } catch { /* ignore */ }
		json(res, 200, { ok: true, slots, sharing: row.sharing === 1 });
		return;
	}

	if (url.pathname === "/api/room-slots" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) { json(res, 401, { ok: false, error: "unauthorized" }); return; }
		readJson(req)
			.then((body) => {
				const rp = String(body && body.room || "").trim().slice(0, 40);
				const kp = String(body && body.key || "").trim().slice(0, 64);
				const rk = `${rp}:${kp}`;
				const userId = getOrCreateUserId(email);
				const rawSlots = body && typeof body.slots === "object" ? body.slots : null;
				const sharing = body && typeof body.sharing === "boolean" ? body.sharing : null;
				// Merge: load existing, apply deltas
				const existingRow = stmtRoomSlotsGet.get(userId, rk);
				let existingSlots = {};
				let existingSharing = 0;
				if (existingRow) {
					try { existingSlots = JSON.parse(existingRow.slots_json); } catch { /* ignore */ }
					existingSharing = existingRow.sharing;
				}
				const nextSlots = rawSlots !== null ? rawSlots : existingSlots;
				const nextSharing = sharing !== null ? (sharing ? 1 : 0) : existingSharing;
				// Validate slots size (max 500KB)
				const slotsJson = JSON.stringify(nextSlots);
				if (slotsJson.length > 512000) {
					json(res, 413, { ok: false, error: "slots_too_large" });
					return;
				}
				const now = Date.now();
				stmtRoomSlotsUpsert.run(userId, rk, slotsJson, nextSharing, now);
				json(res, 200, { ok: true, slots: nextSlots, sharing: nextSharing === 1, updatedAt: now });
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

	if (url.pathname === "/api/saved-queries" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) { json(res, 401, { ok: false, error: "unauthorized" }); return; }
		const userId = getOrCreateUserId(email);
		const rows = stmtSavedQueryList.all(userId);
		json(res, 200, { ok: true, queries: rows });
		return;
	}

	if (url.pathname === "/api/saved-queries" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) { json(res, 401, { ok: false, error: "unauthorized" }); return; }
		readJson(req)
			.then((body) => {
				const userId = getOrCreateUserId(email);
				const label = String(body && body.label ? body.label : "").trim().slice(0, 100);
				const query = String(body && body.query ? body.query : "").trim().slice(0, 500);
				if (!query) { json(res, 400, { ok: false, error: "empty_query" }); return; }
				const lbl = label || (query.length > 28 ? query.slice(0, 26) + "…" : query);
				const now = Date.now();
				const info = stmtSavedQueryInsert.run(userId, lbl, query, now);
				json(res, 200, { ok: true, id: Number(info.lastInsertRowid), label: lbl, query, created_at: now });
			})
			.catch((e) => {
				if (String(e && e.message) === "body_too_large") { json(res, 413, { ok: false, error: "body_too_large" }); return; }
				json(res, 400, { ok: false, error: "invalid_json" });
			});
		return;
	}

	if (url.pathname.startsWith("/api/saved-queries/") && req.method === "DELETE") {
		const email = getAuthedEmail(req);
		if (!email) { json(res, 401, { ok: false, error: "unauthorized" }); return; }
		const userId = getOrCreateUserId(email);
		const idStr = url.pathname.replace("/api/saved-queries/", "");
		const qid = parseInt(idStr, 10);
		if (!Number.isFinite(qid)) { json(res, 400, { ok: false, error: "invalid_id" }); return; }
		stmtSavedQueryDelete.run(qid, userId);
		json(res, 200, { ok: true });
		return;
	}

	if (url.pathname === "/api/linear-key" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const keyRes = getUserLinearApiKey(userId);
		if (!keyRes.ok) {
			json(res, 500, { ok: false, error: keyRes.error || "linear_key_read_failed" });
			return;
		}
		const key = String(keyRes.key || "").trim();
		json(res, 200, { ok: true, apiKey: key, configured: Boolean(key) });
		return;
	}

	if (url.pathname === "/api/linear-key" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const userId = getOrCreateUserId(email);
				const apiKey = String(body && body.apiKey ? body.apiKey : "").trim();
				const saveRes = saveUserLinearApiKey(userId, apiKey);
				if (!saveRes.ok) {
					json(res, 500, {
						ok: false,
						error: saveRes.error || "linear_key_save_failed",
					});
					return;
				}
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

	if (url.pathname === "/api/bfl-key" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const keyRes = getUserBflApiKey(userId);
		if (!keyRes.ok) {
			json(res, 500, { ok: false, error: keyRes.error || "bfl_key_read_failed" });
			return;
		}
		const key = String(keyRes.key || "").trim();
		json(res, 200, { ok: true, apiKey: key, configured: Boolean(key) });
		return;
	}

	if (url.pathname === "/api/bfl-key" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const userId = getOrCreateUserId(email);
				const apiKey = String(body && body.apiKey ? body.apiKey : "").trim();
				const saveRes = saveUserBflApiKey(userId, apiKey);
				if (!saveRes.ok) {
					json(res, 500, {
						ok: false,
						error: saveRes.error || "bfl_key_save_failed",
					});
					return;
				}
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

	if (url.pathname === "/api/room-pins" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const roomPins = listRoomPins(userId);
		json(res, 200, { ok: true, roomPins });
		return;
	}

	if (url.pathname === "/api/room-pins" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const room = clampRoom(body && body.room);
				const key = clampKey(body && body.key);
				const rawNoteId = String(body && body.noteId ? body.noteId : "").trim();
				const rawText = String(body && body.text ? body.text : "");
				const textVal = rawNoteId ? "" : rawText;
				const updatedAtRaw = Number(body && body.updatedAt);
				const updatedAt = Number.isFinite(updatedAtRaw)
					? updatedAtRaw
					: Date.now();
				if (!room) {
					json(res, 400, { ok: false, error: "invalid_room" });
					return;
				}
				const userId = getOrCreateUserId(email);
				const now = Date.now();
				initDb();
				stmtRoomPinUpsert.run(
					userId,
					room,
					key,
					rawNoteId,
					textVal,
					now,
					updatedAt
				);
				json(res, 200, {
					ok: true,
					roomPin: {
						room,
						key,
						noteId: rawNoteId,
						text: textVal,
						addedAt: now,
						updatedAt,
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

	if (url.pathname === "/api/room-pins" && req.method === "DELETE") {
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
				stmtRoomPinDelete.run(userId, room, key);
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

	if (url.pathname === "/api/shared-rooms" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		const sharedRooms = listSharedRooms(userId);
		json(res, 200, { ok: true, sharedRooms });
		return;
	}

	if (url.pathname === "/api/shared-rooms" && req.method === "POST") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const room = clampRoom(body && body.room);
				const key = clampKey(body && body.key);
				const updatedAtRaw = Number(body && body.updatedAt);
				const updatedAt = Number.isFinite(updatedAtRaw)
					? updatedAtRaw
					: Date.now();
				if (!room) {
					json(res, 400, { ok: false, error: "invalid_room" });
					return;
				}
				const userId = getOrCreateUserId(email);
				const now = Date.now();
				initDb();
				stmtSharedRoomUpsert.run(userId, room, key, now, updatedAt);
				json(res, 200, {
					ok: true,
					sharedRoom: {
						room,
						key,
						addedAt: now,
						updatedAt,
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

	if (url.pathname === "/api/shared-rooms" && req.method === "DELETE") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		readJson(req)
			.then((body) => {
				const removeAll = Boolean(body && body.all);
				const room = clampRoom(body && body.room);
				const key = clampKey(body && body.key);
				if (!removeAll && !room) {
					json(res, 400, { ok: false, error: "invalid_room" });
					return;
				}
				const userId = getOrCreateUserId(email);
				initDb();
				if (removeAll) {
					stmtSharedRoomsDeleteAll.run(userId);
					json(res, 200, { ok: true, cleared: true });
					return;
				}
				stmtSharedRoomDelete.run(userId, room, key);
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
				const isStartup = Boolean(body && body.isStartup);
				if (!room) {
					json(res, 400, { ok: false, error: "invalid_room" });
					return;
				}
				const userId = getOrCreateUserId(email);
				const now = Date.now();
				initDb();
				if (isStartup) {
					stmtFavoriteClearStartup.run(userId);
				}
				stmtFavoriteUpsert.run(userId, room, key, textVal, isStartup ? 1 : 0, now, now);
				json(res, 200, {
					ok: true,
					favorite: {
						room,
						key,
						text: textVal,
						isStartup,
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
				const allowEmpty = Boolean(body && body.allowEmpty);
				const textVal = String(body && body.text ? body.text : "").trim();
				if (!textVal && !allowEmpty) {
					json(res, 400, { ok: false, error: "empty" });
					return;
				}
				const textFinal = allowEmpty ? "" : textVal;
				const hasTags =
					body && Object.prototype.hasOwnProperty.call(body, "tags");
				if (hasTags && !Array.isArray(body && body.tags ? body.tags : [])) {
					json(res, 400, { ok: false, error: "invalid_tags" });
					return;
				}
				const userId = getOrCreateUserId(email);
				const contentHash = computeNoteContentHash(textFinal);
				let kind;
				let tags;
				let override = false;
				if (hasTags) {
					const split = splitManualOverrideTags(
						body && body.tags ? body.tags : []
					);
					override = split.override;
					if (override) {
						kind = classifyText(textFinal).kind;
						tags = uniq([...split.tags, MANUAL_TAGS_MARKER]);
					} else {
						const merged = mergeManualTags(textFinal, split.tags);
						kind = merged.kind;
						tags = merged.tags;
					}
				} else {
					const merged = classifyText(textFinal);
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
				const titleHash = computeNoteTitleHash(textFinal);
				if (titleHash) {
					const byTitle = stmtNoteGetByTitleHashUser.get(userId, titleHash);
					if (byTitle) {
						json(res, 200, {
							ok: true,
							note: {
								id: byTitle.id,
								text: byTitle.text,
								kind: byTitle.kind,
								tags: parseTagsJson(byTitle.tags_json),
								createdAt: byTitle.created_at,
								updatedAt:
									typeof byTitle.updated_at === "number" &&
									Number.isFinite(byTitle.updated_at)
										? byTitle.updated_at
										: byTitle.created_at,
							},
						});
						return;
					}
				}
				const createdAt = Date.now();
				const updatedAt = Date.now();
				if (!override) tags = applyDateTags(tags, createdAt);
				const note = {
					id: crypto.randomBytes(12).toString("base64url"),
					text: textFinal,
					createdAt,
					updatedAt,
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
						titleHash,
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
		const m = url.pathname.match(
			/^\/api\/notes\/([a-zA-Z0-9_-]{8,80})\/comments$/
		);
		const noteId = m ? String(m[1] || "") : "";
		if (noteId && req.method === "GET") {
			const email = getAuthedEmail(req);
			if (!email) {
				json(res, 401, { ok: false, error: "unauthorized" });
				return;
			}
			initDb();
			const existing = stmtNoteGetById.get(noteId);
			if (!existing) {
				json(res, 404, { ok: false, error: "not_found" });
				return;
			}
			const scopeId = `note:${noteId}`;
			const row = stmtNoteCommentsGetByScope.get(scopeId);
			const comments = row ? parseCommentsJson(row.comments_json) : [];
			json(res, 200, {
				ok: true,
				noteId,
				comments,
				updatedAt: row && row.updated_at ? row.updated_at : 0,
			});
			return;
		}
		if (noteId && req.method === "PUT") {
			const email = getAuthedEmail(req);
			if (!email) {
				json(res, 401, { ok: false, error: "unauthorized" });
				return;
			}
			readJson(req)
				.then((body) => {
					getOrCreateUserId(email);
					initDb();
					const existing = stmtNoteGetById.get(noteId);
					if (!existing) {
						json(res, 404, { ok: false, error: "not_found" });
						return;
					}
					if (!Array.isArray(body && body.comments ? body.comments : null)) {
						json(res, 400, { ok: false, error: "invalid_comments" });
						return;
					}
					const comments = sanitizeCommentItems(body.comments);
					const updatedAt = Date.now();
					const scopeId = `note:${noteId}`;
					if (comments.length > 0) {
						stmtNoteCommentsUpsert.run(
							scopeId,
							JSON.stringify(comments),
							updatedAt
						);
					} else {
						stmtNoteCommentsDeleteByScope.run(scopeId);
					}
					json(res, 200, {
						ok: true,
						noteId,
						count: comments.length,
						updatedAt,
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
	}

	{
		let room = "";
		let key = "";
		let match = url.pathname.match(
			/^\/api\/rooms\/([a-zA-Z0-9_-]{1,40})\/([a-zA-Z0-9_-]{1,64})\/comments$/
		);
		if (match) {
			room = String(match[1] || "");
			key = String(match[2] || "");
		} else {
			match = url.pathname.match(
				/^\/api\/rooms\/([a-zA-Z0-9_-]{1,40})\/comments$/
			);
			if (match) {
				room = String(match[1] || "");
				key = "";
			}
		}
		if (room && (req.method === "GET" || req.method === "PUT")) {
			// Room-scoped comments are accessible without authentication
			// so guests in shared rooms can participate in conversations
			const email = getAuthedEmail(req);
			initDb();
			const noteIdParam = String(url.searchParams.get("noteId") || "").trim().slice(0, 80);
			const baseScopeId = `room:${room}${key ? `:${key}` : ""}`;
			const scopeId = noteIdParam ? `${baseScopeId}:n:${noteIdParam}` : baseScopeId;
			if (req.method === "GET") {
				const row = stmtNoteCommentsGetByScope.get(scopeId);
				const comments = row ? parseCommentsJson(row.comments_json) : [];
				json(res, 200, {
					ok: true,
					room,
					key,
					comments,
					updatedAt: row && row.updated_at ? row.updated_at : 0,
				});
				return;
			}
			readJson(req)
				.then((body) => {
					if (email) getOrCreateUserId(email);
					if (!Array.isArray(body && body.comments ? body.comments : null)) {
						json(res, 400, { ok: false, error: "invalid_comments" });
						return;
					}
					const comments = sanitizeCommentItems(body.comments);
					const updatedAt = Date.now();
					if (comments.length > 0) {
						stmtNoteCommentsUpsert.run(
							scopeId,
							JSON.stringify(comments),
							updatedAt
						);
					} else {
						stmtNoteCommentsDeleteByScope.run(scopeId);
					}
					// Also mark note:NOTEID so has:comment index finds room-scoped comments
					if (noteIdParam && email) {
						const userId = getOrCreateUserId(email);
						const noteOwned = stmtNoteGetByIdUser.get(noteIdParam, userId);
						if (noteOwned) {
							const noteScope = `note:${noteIdParam}`;
							if (comments.length > 0) {
								const existing = stmtNoteCommentsGetByScope.get(noteScope);
								if (!existing) {
									stmtNoteCommentsUpsert.run(noteScope, JSON.stringify(comments), updatedAt);
								}
							} else {
								stmtNoteCommentsDeleteByScope.run(noteScope);
							}
						}
					}
					json(res, 200, {
						ok: true,
						room,
						key,
						count: comments.length,
						updatedAt,
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

					const kind = classifyText(nextText).kind;
					const contentHash = computeNoteContentHash(nextText);
					let tags;
					let override = false;
					const existingTags = parseTagsJson(existing.tags_json);
					if (hasTags) {
						const split = splitManualOverrideTags(
							body && body.tags ? body.tags : []
						);
						override = split.override;
						if (override) {
							// Manual override: keep user tags, no auto-tag recomputation
							tags = uniq([...split.tags, MANUAL_TAGS_MARKER]);
						} else {
							// Update: always preserve existing tags — auto-tags are only assigned once at creation
							tags = existingTags;
						}
					} else {
						// No tags sent: always keep existing tags as-is
						tags = existingTags;
					}
					if (!override) {
						tags = applyDateTags(tags, existing.created_at);
					}
					if (contentHash) {
						// Skip duplicate check if content hasn't changed (idempotent save)
						const existingHash = existing.content_hash || computeNoteContentHash(existing.text);
						if (contentHash !== existingHash) {
							const dupe = stmtNoteGetByHashUser.get(userId, contentHash);
							if (dupe && String(dupe.id || "") !== String(noteId || "")) {
								json(res, 409, { ok: false, error: "duplicate" });
								return;
							}
						}
					}
					const updatedAt = Date.now();
					const titleHash = computeNoteTitleHash(nextText);
					stmtNoteUpdate.run(
						nextText,
						kind,
						contentHash,
						titleHash,
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
			purgeExpiredTrash();
			const existing = stmtNoteGetByIdUser.get(noteId, userId);
			if (!existing) {
				json(res, 404, { ok: false, error: "not_found" });
				return;
			}
			const now = Date.now();
			const contentHash = existing.content_hash
				? String(existing.content_hash || "")
				: computeNoteContentHash(existing.text);
			const tx = db.transaction(() => {
				stmtTrashInsert.run(
					existing.id,
					userId,
					existing.text,
					existing.kind,
					contentHash,
					existing.tags_json,
					existing.created_at,
					existing.updated_at,
					now
				);
				stmtNoteDelete.run(noteId, userId);
			});
			tx();
			json(res, 200, { ok: true, trashedAt: now });
			return;
		}
	}

	{
		const m = url.pathname.match(
			/^\/api\/notes\/([a-zA-Z0-9_-]{8,80})\/restore$/
		);
		const noteId = m ? String(m[1] || "") : "";
		if (noteId && req.method === "POST") {
			const email = getAuthedEmail(req);
			if (!email) {
				json(res, 401, { ok: false, error: "unauthorized" });
				return;
			}
			const userId = getOrCreateUserId(email);
			initDb();
			purgeExpiredTrash();
			const trashed = stmtTrashGetByIdUser.get(noteId, userId);
			if (!trashed) {
				json(res, 404, { ok: false, error: "not_found" });
				return;
			}
			const textVal = String(trashed.text || "");
			const contentHash = trashed.content_hash
				? String(trashed.content_hash || "")
				: computeNoteContentHash(textVal);
			if (contentHash) {
				const dupe = stmtNoteGetByHashUser.get(userId, contentHash);
				if (dupe) {
					stmtTrashDeleteByIdUser.run(noteId, userId);
					json(res, 200, {
						ok: true,
						note: {
							id: dupe.id,
							text: dupe.text,
							kind: dupe.kind,
							tags: parseTagsJson(dupe.tags_json),
							createdAt: dupe.created_at,
							updatedAt:
								typeof dupe.updated_at === "number" &&
								Number.isFinite(dupe.updated_at)
									? dupe.updated_at
									: dupe.created_at,
						},
					});
					return;
				}
			}
			let restoreId = String(trashed.id || "");
			if (stmtNoteGetByIdUser.get(restoreId, userId)) {
				restoreId = crypto.randomBytes(12).toString("base64url");
			}
			const tags = parseTagsJson(trashed.tags_json);
			const createdAt = Number(trashed.created_at || 0) || Date.now();
			const updatedAt = Date.now();
			const tx = db.transaction(() => {
				stmtNoteInsert.run(
					restoreId,
					userId,
					textVal,
					String(trashed.kind || "note"),
					contentHash,
					computeNoteTitleHash(textVal),
					JSON.stringify(tags),
					createdAt,
					updatedAt
				);
				stmtTrashDeleteByIdUser.run(noteId, userId);
			});
			tx();
			json(res, 200, {
				ok: true,
				note: {
					id: restoreId,
					text: textVal,
					kind: String(trashed.kind || "note"),
					tags,
					createdAt,
					updatedAt,
				},
			});
			return;
		}
	}

	if (url.pathname === "/api/notes/trash" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		purgeExpiredTrash();
		const notes = listTrashNotes(userId);
		json(res, 200, {
			ok: true,
			retentionDays: TRASH_RETENTION_DAYS,
			notes,
		});
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

	if (url.pathname === "/api/notes/comments-index" && req.method === "GET") {
		const email = getAuthedEmail(req);
		if (!email) {
			json(res, 401, { ok: false, error: "unauthorized" });
			return;
		}
		const userId = getOrCreateUserId(email);
		initDb();
		const rows = stmtNoteCommentsByUser.all(userId);
		const noteIds = [];
		for (const row of rows) {
			const noteId = String(row && row.note_id ? row.note_id : "").trim();
			if (!noteId) continue;
			const valid = sanitizeCommentItems(parseCommentsJson(row.comments_json));
			if (valid.length > 0) noteIds.push(noteId);
		}
		json(res, 200, { ok: true, noteIds });
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
							const kind = kindRaw ? kindRaw : classifyText(textVal).kind;
							// Preserve existing tags on update — auto-tags only at creation
							const existingImportTags = parseTagsJson(existing.tags_json);
							const tagsFinal = tags.length ? tags : (existingImportTags.length ? existingImportTags : classifyText(textVal).tags);
							stmtNoteUpdate.run(
								textVal,
								kind,
								contentHash,
								computeNoteTitleHash(textVal),
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
							computeNoteTitleHash(textVal),
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
		const info = getLatestModelInfo();
		json(res, 200, {
			ok: true,
			provider: "anthropic",
			configured: Boolean(ANTHROPIC_API_KEY),
			model: info.activeModel,
			latestModel: info.latestModel,
			topModels: info.topModels,
			modelFetchedAt: info.fetchedAt || null,
			override: info.override || "",
		});
		return;
	}

	// --- API: AI Image Generation (FLUX.2 via BFL) ---
	if (url.pathname === "/api/ai/image" && req.method === "POST") {
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
				let effectiveApiKey = apiKeyRaw;
				if (!effectiveApiKey) {
					const userId = getOrCreateUserId(email);
					const userKeyRes = getUserBflApiKey(userId);
					if (userKeyRes.ok && userKeyRes.key) effectiveApiKey = userKeyRes.key;
				}
				if (!effectiveApiKey) effectiveApiKey = BFL_API_KEY;
				if (!effectiveApiKey) {
					json(res, 503, { ok: false, error: "image_ai_not_configured", message: "No BFL API key configured. Set BFL_API_KEY or provide apiKey." });
					return;
				}
				const prompt = String(body && body.prompt ? body.prompt : "").trim();
				if (!prompt) {
					json(res, 400, { ok: false, error: "empty", message: "Prompt is required." });
					return;
				}
				const width = Math.min(2048, Math.max(256, Number(body && body.width ? body.width : 1024) || 1024));
				const height = Math.min(2048, Math.max(256, Number(body && body.height ? body.height : 1024) || 1024));
				const model = String(body && body.model ? body.model : "").trim() || BFL_MODEL;

				try {
					// Step 1: Submit generation request
					const submitController = new AbortController();
					const submitTimer = setTimeout(() => submitController.abort(), 15000);
					const submitRes = await fetch(`https://api.bfl.ai/v1/${encodeURIComponent(model)}`, {
						method: "POST",
						headers: {
							"accept": "application/json",
							"x-key": effectiveApiKey,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ prompt, width, height }),
						signal: submitController.signal,
					});
					clearTimeout(submitTimer);
					const submitData = await submitRes.json();
					if (!submitRes.ok) {
						const errMsg = (submitData && submitData.detail) || (submitData && submitData.message) || `BFL API HTTP ${submitRes.status}`;
						console.warn("[ai/image] submit error", { reqId, status: submitRes.status, errMsg });
						json(res, 502, { ok: false, error: "image_submit_failed", message: String(errMsg), reqId });
						return;
					}
					const pollingUrl = String(submitData.polling_url || "");
					const requestId = String(submitData.id || "");
					if (!pollingUrl) {
						json(res, 502, { ok: false, error: "image_no_polling_url", message: "No polling URL returned.", reqId });
						return;
					}

					// Step 2: Poll for result
					const deadline = Date.now() + BFL_IMAGE_TIMEOUT_MS;
					let imageUrl = "";
					while (Date.now() < deadline) {
						await new Promise((r) => setTimeout(r, BFL_POLL_INTERVAL_MS));
						const pollController = new AbortController();
						const pollTimer = setTimeout(() => pollController.abort(), 10000);
						try {
							const pollRes = await fetch(pollingUrl, {
								method: "GET",
								headers: {
									"accept": "application/json",
									"x-key": effectiveApiKey,
								},
								signal: pollController.signal,
							});
							clearTimeout(pollTimer);
							const pollData = await pollRes.json();
							const status = String(pollData && pollData.status ? pollData.status : "");
							if (status === "Ready") {
								imageUrl = String(pollData.result && pollData.result.sample ? pollData.result.sample : "");
								break;
							}
							if (status === "Error" || status === "Failed") {
								const errDetail = JSON.stringify(pollData);
								console.warn("[ai/image] generation failed", { reqId, pollData });
								json(res, 502, { ok: false, error: "image_generation_failed", message: `Generation failed: ${errDetail}`, reqId });
								return;
							}
							// status is "Pending" or "Processing" – continue polling
						} catch (pollErr) {
							clearTimeout(pollTimer);
							// Transient poll error – retry
							console.warn("[ai/image] poll error (retrying)", { reqId, err: pollErr && pollErr.message });
						}
					}

					if (!imageUrl) {
						json(res, 504, { ok: false, error: "image_timeout", message: "Image generation timed out.", reqId });
						return;
					}

					// Step 3: Download image and return as base64 (BFL delivery URLs have no CORS)
					const dlController = new AbortController();
					const dlTimer = setTimeout(() => dlController.abort(), 30000);
					try {
						const dlRes = await fetch(imageUrl, { signal: dlController.signal });
						clearTimeout(dlTimer);
						if (!dlRes.ok) {
							json(res, 502, { ok: false, error: "image_download_failed", message: `Failed to download image: HTTP ${dlRes.status}`, reqId });
							return;
						}
						const contentType = String(dlRes.headers.get("content-type") || "image/jpeg");
						const arrayBuf = await dlRes.arrayBuffer();
						const base64 = Buffer.from(arrayBuf).toString("base64");
						const dataUri = `data:${contentType};base64,${base64}`;

						json(res, 200, {
							ok: true,
							imageDataUri: dataUri,
							model,
							prompt,
							width,
							height,
							reqId,
						});
					} catch (dlErr) {
						clearTimeout(dlTimer);
						console.warn("[ai/image] download error", { reqId, err: dlErr && dlErr.message });
						json(res, 502, { ok: false, error: "image_download_failed", message: dlErr && dlErr.message ? String(dlErr.message) : "download_error", reqId });
					}
				} catch (e) {
					const msg = e && e.name === "AbortError" ? "timeout" : e && e.message ? String(e.message) : "image_error";
					console.warn("[ai/image] exception", { reqId, msg, ip, email });
					json(res, 502, { ok: false, error: "image_failed", message: msg, reqId });
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

					const dynamicTop = aiLatestModelCache.models.length
						? aiLatestModelCache.models
						: [ANTHROPIC_MODEL_FALLBACK, "claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"];
					const candidates = uniq([
						modelOverride,
						ANTHROPIC_MODEL,
						...dynamicTop,
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
			sendCompressed(req, res, 200, html, {
				"Content-Type": "text/html; charset=utf-8",
				"Cache-Control": "no-cache",
			}, "index.html");
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
		const mime = mimeTypeForPath(targetPath);
		// Immutable cache for versioned/vendor assets, short cache for others
		const hasVersion = url.search && url.search.includes("v=");
		const isVendor = relPath.startsWith("vendor/");
		const isSw = relPath === "sw.js";
		let cacheControl = "public, max-age=300"; // 5 min default
		if (hasVersion || isVendor) cacheControl = "public, max-age=31536000, immutable";
		if (isSw) cacheControl = "no-cache";
		const headers = {
			"Content-Type": mime,
			"Cache-Control": cacheControl,
		};
		if (relPath.startsWith("vendor/pdfjs/")) {
			headers["Access-Control-Allow-Origin"] = "*";
		}
		sendCompressed(req, res, 200, buf, headers, relPath);
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

	// Send room_pin_state BEFORE app states so the client knows the
	// pinned note before processing excalidraw/excel/linear state.
	// Also send a shared indicator when >1 socket is connected so
	// guests can mark the room as shared even without a permanent link.
	const sharedPin = getRoomSharedPin(rk, room, key);
	const roomSocketCount = getRoomSockets(rk).size;
	if (sharedPin || roomSocketCount > 1) {
		try {
			ws.send(
				JSON.stringify({
					type: "room_pin_state",
					room,
					noteId: sharedPin ? (sharedPin.noteId || "") : "",
					text: sharedPin ? (sharedPin.text || "") : "",
					updatedAt: sharedPin ? (Number(sharedPin.updatedAt) || 0) : 0,
					shared: true,
				})
			);
		} catch {
			// ignore
		}
	}

	const initialExcal = roomExcalidrawState.get(rk);
	if (initialExcal && initialExcal.size > 0) {
		const items = Array.from(initialExcal.entries()).map(([noteId, state]) => ({
			noteId,
			visible: Boolean(state && state.visible),
			offset: {
				x: Number(state && state.offset && state.offset.x) || 0,
				y: Number(state && state.offset && state.offset.y) || 0,
			},
		}));
		try {
			ws.send(JSON.stringify({ type: "excalidraw_state", room, items }));
		} catch {
			// ignore
		}
	}

	const initialExcel = roomExcelState.get(rk);
	if (initialExcel && initialExcel.size > 0) {
		const items = Array.from(initialExcel.entries()).map(([noteId, state]) => ({
			noteId,
			visible: Boolean(state && state.visible),
			offset: {
				x: Number(state && state.offset && state.offset.x) || 0,
				y: Number(state && state.offset && state.offset.y) || 0,
			},
		}));
		try {
			ws.send(JSON.stringify({ type: "excel_state", room, items }));
		} catch {
			// ignore
		}
	}

	const initialLinear = roomLinearState.get(rk);
	if (initialLinear && initialLinear.size > 0) {
		const items = Array.from(initialLinear.entries()).map(([noteId, state]) => ({
			noteId,
			visible: Boolean(state && state.visible),
			projectId: state && state.projectId ? String(state.projectId) : "",
			projectName: state && state.projectName ? String(state.projectName) : "",
			offset: {
				x: Number(state && state.offset && state.offset.x) || 0,
				y: Number(state && state.offset && state.offset.y) || 0,
			},
		}));
		try {
			ws.send(JSON.stringify({ type: "linear_state", room, items }));
		} catch {
			// ignore
		}
	}

	const initialLinearData = roomLinearData.get(rk);
	if (initialLinearData && initialLinearData.size > 0) {
		const items = Array.from(initialLinearData.entries()).map(([noteId, data]) => ({
			noteId,
			projectId: data && data.projectId ? String(data.projectId) : "",
			projectName: data && data.projectName ? String(data.projectName) : "",
			updatedAt: Number(data && data.updatedAt ? data.updatedAt : 0) || 0,
			tasks: Array.isArray(data && data.tasks) ? data.tasks : [],
		}));
		try {
			ws.send(JSON.stringify({ type: "linear_data", room, items }));
		} catch {
			// ignore
		}
	}

	const initialScenes = roomExcalidrawScenes.get(rk);
	if (initialScenes && initialScenes.size > 0) {
		const items = Array.from(initialScenes.entries()).map(([noteId, scene]) => ({
			noteId,
			scene: typeof scene === "string" ? scene : "",
		})).filter((it) => it.noteId && it.scene);
		if (items.length > 0) {
			try {
				ws.send(JSON.stringify({ type: "excalidraw_scene", room, items }));
			} catch {
				// ignore
			}
		}
	}

	const initialAvail = roomAvailabilityState.get(rk);
	if (initialAvail && initialAvail.size > 0) {
		const participants = Array.from(initialAvail.entries()).map(([cid, entry]) => ({
			clientId: cid,
			name: entry.name,
			color: entry.color,
			busy: entry.busy,
		}));
		try {
			ws.send(JSON.stringify({ type: "availability_state", room, participants }));
		} catch {
			// ignore
		}
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

		if (msg.type === "excalidraw_state") {
			const items = Array.isArray(msg.items)
				? msg.items
				: msg.noteId
				? [
					{
						noteId: msg.noteId,
						visible: msg.visible,
						offset: msg.offset,
					},
				]
				: [];
			const sanitized = [];
			for (const it of items) {
				const noteId = String(it && it.noteId ? it.noteId : "").trim();
				if (!noteId) continue;
				const visible = Boolean(it && it.visible);
				const oxRaw = Number(it && it.offset && it.offset.x);
				const oyRaw = Number(it && it.offset && it.offset.y);
				const ox = Number.isFinite(oxRaw)
					? Math.max(-4000, Math.min(4000, oxRaw))
					: 0;
				const oy = Number.isFinite(oyRaw)
					? Math.max(-4000, Math.min(4000, oyRaw))
					: 0;
				sanitized.push({ noteId, visible, offset: { x: ox, y: oy } });
			}
			if (sanitized.length === 0) return;
			const map = getRoomExcalidrawState(rk);
			const fromClientId = typeof msg.clientId === "string" ? msg.clientId : "";
			for (const it of sanitized) {
				map.set(it.noteId, { visible: it.visible, offset: it.offset });
			}
			broadcast(
				rk,
				{ type: "excalidraw_state", room, clientId: fromClientId, items: sanitized },
				ws
			);
			return;
		}

		if (msg.type === "excel_state") {
			const items = Array.isArray(msg.items)
				? msg.items
				: msg.noteId
				? [
					{
						noteId: msg.noteId,
						visible: msg.visible,
						offset: msg.offset,
					},
				]
				: [];
			const sanitized = [];
			for (const it of items) {
				const noteId = String(it && it.noteId ? it.noteId : "").trim();
				if (!noteId) continue;
				const visible = Boolean(it && it.visible);
				const oxRaw = Number(it && it.offset && it.offset.x);
				const oyRaw = Number(it && it.offset && it.offset.y);
				const ox = Number.isFinite(oxRaw)
					? Math.max(-4000, Math.min(4000, oxRaw))
					: 0;
				const oy = Number.isFinite(oyRaw)
					? Math.max(-4000, Math.min(4000, oyRaw))
					: 0;
				sanitized.push({ noteId, visible, offset: { x: ox, y: oy } });
			}
			if (sanitized.length === 0) return;
			const map = getRoomExcelState(rk);
			const fromClientId = typeof msg.clientId === "string" ? msg.clientId : "";
			for (const it of sanitized) {
				map.set(it.noteId, { visible: it.visible, offset: it.offset });
			}
			broadcast(
				rk,
				{ type: "excel_state", room, clientId: fromClientId, items: sanitized },
				ws
			);
			return;
		}

		if (msg.type === "linear_state") {
			const items = Array.isArray(msg.items)
				? msg.items
				: msg.noteId
				? [
					{
						noteId: msg.noteId,
						visible: msg.visible,
						offset: msg.offset,
						projectId: msg.projectId,
						projectName: msg.projectName,
					},
				]
				: [];
			const sanitized = [];
			for (const it of items) {
				const noteId = String(it && it.noteId ? it.noteId : "").trim();
				if (!noteId) continue;
				const visible = Boolean(it && it.visible);
				const oxRaw = Number(it && it.offset && it.offset.x);
				const oyRaw = Number(it && it.offset && it.offset.y);
				const ox = Number.isFinite(oxRaw)
					? Math.max(-4000, Math.min(4000, oxRaw))
					: 0;
				const oy = Number.isFinite(oyRaw)
					? Math.max(-4000, Math.min(4000, oyRaw))
					: 0;
				const projectId = String(it && it.projectId ? it.projectId : "").slice(0, 120);
				const projectName = String(it && it.projectName ? it.projectName : "").slice(0, 160);
				sanitized.push({
					noteId,
					visible,
					projectId,
					projectName,
					offset: { x: ox, y: oy },
				});
			}
			if (sanitized.length === 0) return;
			const map = getRoomLinearState(rk);
			const fromClientId = typeof msg.clientId === "string" ? msg.clientId : "";
			for (const it of sanitized) {
				map.set(it.noteId, {
					visible: it.visible,
					offset: it.offset,
					projectId: it.projectId,
					projectName: it.projectName,
				});
			}
			broadcast(
				rk,
				{ type: "linear_state", room, clientId: fromClientId, items: sanitized },
				ws
			);
			return;
		}

		if (msg.type === "linear_data") {
			const items = Array.isArray(msg.items)
				? msg.items
				: msg.noteId
				? [
					{
						noteId: msg.noteId,
						projectId: msg.projectId,
						projectName: msg.projectName,
						updatedAt: msg.updatedAt,
						tasks: msg.tasks,
					},
				]
				: [];
			const sanitized = [];
			for (const it of items) {
				const noteId = String(it && it.noteId ? it.noteId : "").trim();
				if (!noteId) continue;
				const projectId = String(it && it.projectId ? it.projectId : "").slice(0, 120);
				const projectName = String(it && it.projectName ? it.projectName : "").slice(0, 160);
				const updatedAt =
					typeof it.updatedAt === "number" && Number.isFinite(it.updatedAt)
						? it.updatedAt
						: Date.now();
				const tasks = Array.isArray(it && it.tasks) ? it.tasks.slice(0, 200) : [];
				const safeTasks = tasks.map((task) => ({
					id: String(task && task.id ? task.id : "").slice(0, 120),
					title: String(task && task.title ? task.title : "").slice(0, 240),
					identifier: String(task && task.identifier ? task.identifier : "").slice(0, 60),
					url: String(task && task.url ? task.url : "").slice(0, 400),
					dueDate: String(task && task.dueDate ? task.dueDate : "").slice(0, 40),
					state: String(task && task.state ? task.state : "").slice(0, 80),
					assignee: String(task && task.assignee ? task.assignee : "").slice(0, 120),
				}));
				sanitized.push({
					noteId,
					projectId,
					projectName,
					updatedAt,
					tasks: safeTasks,
				});
			}
			if (sanitized.length === 0) return;
			const map = getRoomLinearData(rk);
			const fromClientId = typeof msg.clientId === "string" ? msg.clientId : "";
			for (const it of sanitized) {
				map.set(it.noteId, {
					projectId: it.projectId,
					projectName: it.projectName,
					updatedAt: it.updatedAt,
					tasks: it.tasks,
				});
			}
			broadcast(
				rk,
				{ type: "linear_data", room, clientId: fromClientId, items: sanitized },
				ws
			);
			return;
		}

		if (msg.type === "room_pin_state") {
			const fromClientId = String(msg.clientId || "").trim();
			const noteId = String(msg.noteId || "").trim();
			const rawText = String(msg.text || "");
			const textVal = noteId ? "" : rawText;
			const updatedAt = Number(msg.updatedAt) || Date.now();
			initDb();
			if (!noteId && !textVal) {
				roomSharedPins.delete(rk);
				stmtRoomSharedPinDelete.run(room, key);
			} else {
				roomSharedPins.set(rk, { noteId, text: textVal, updatedAt });
				stmtRoomSharedPinUpsert.run(
					room,
					key,
					noteId,
					textVal,
					Date.now(),
					updatedAt
				);
			}
			broadcast(
				rk,
				{
					type: "room_pin_state",
					room,
					clientId: fromClientId,
					noteId,
					text: textVal,
					updatedAt,
				},
				ws
			);
			return;
		}

		if (msg.type === "excalidraw_scene") {
			const items = Array.isArray(msg.items)
				? msg.items
				: msg.noteId && typeof msg.scene === "string"
				? [{ noteId: msg.noteId, scene: msg.scene }]
				: [];
			const sanitized = [];
			for (const it of items) {
				const noteId = String(it && it.noteId ? it.noteId : "").trim();
				const scene = typeof it === "object" && typeof it.scene === "string" ? it.scene : "";
				if (!noteId || !scene) continue;
				if (scene.length > EXCALIDRAW_SCENE_MAX_BYTES) continue;
				sanitized.push({ noteId, scene });
			}
			if (sanitized.length === 0) return;
			const map = getRoomExcalidrawScenes(rk);
			for (const it of sanitized) {
				map.set(it.noteId, it.scene);
			}
			const fromClientId = typeof msg.clientId === "string" ? msg.clientId : "";
			broadcast(
				rk,
				{ type: "excalidraw_scene", room, clientId: fromClientId, items: sanitized },
				ws
			);
			return;
		}

		if (msg.type === "availability_state") {
			const fromClientId = typeof msg.clientId === "string" ? msg.clientId : "";
			if (!fromClientId) return;
			const name = typeof msg.name === "string" ? msg.name.slice(0, 100) : "Guest";
			const color = typeof msg.color === "string" ? msg.color.slice(0, 20) : "#94a3b8";
			const rawBusy = Array.isArray(msg.busy) ? msg.busy : [];
			const busy = [];
			for (const b of rawBusy) {
				if (!b || typeof b.start !== "number" || typeof b.end !== "number") continue;
				if (!Number.isFinite(b.start) || !Number.isFinite(b.end)) continue;
				if (b.end <= b.start) continue;
				busy.push({ start: b.start, end: b.end });
				if (busy.length >= 200) break;
			}
			const map = getRoomAvailabilityState(rk);
			map.set(fromClientId, { name, color, busy });
			// Broadcast full state to all clients
			const participants = Array.from(map.entries()).map(([cid, entry]) => ({
				clientId: cid,
				name: entry.name,
				color: entry.color,
				busy: entry.busy,
			}));
			broadcast(rk, { type: "availability_state", room, participants });
			return;
		}

		if (msg.type === "comment_update") {
			const clientId = String(msg.clientId || "").trim();
			if (!clientId) return;
			const scopeId = String(msg.scopeId || "").trim();
			if (!scopeId) return;
			const comments = Array.isArray(msg.comments)
				? sanitizeCommentItems(msg.comments)
				: [];
			const updatedAt =
				typeof msg.updatedAt === "number" && Number.isFinite(msg.updatedAt)
					? msg.updatedAt
					: Date.now();
			broadcast(
				rk,
				{ type: "comment_update", room, clientId, scopeId, comments, updatedAt },
				ws
			);
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
			// Send room_pin_state BEFORE app states (same order as initial connect)
			const sharedPin = getRoomSharedPin(rk, room, key);
			const reqSocketCount = getRoomSockets(rk).size;
			if (sharedPin || reqSocketCount > 1) {
				try {
					ws.send(
						JSON.stringify({
							type: "room_pin_state",
							room,
							noteId: sharedPin ? (sharedPin.noteId || "") : "",
							text: sharedPin ? (sharedPin.text || "") : "",
							updatedAt: sharedPin ? (Number(sharedPin.updatedAt) || 0) : 0,
							shared: true,
						})
					);
				} catch {
					// ignore
				}
			}
			const excal = roomExcalidrawState.get(rk);
			if (excal && excal.size > 0) {
				const items = Array.from(excal.entries()).map(([noteId, state]) => ({
					noteId,
					visible: Boolean(state && state.visible),
					offset: {
						x: Number(state && state.offset && state.offset.x) || 0,
						y: Number(state && state.offset && state.offset.y) || 0,
					},
				}));
				try {
					ws.send(JSON.stringify({ type: "excalidraw_state", room, items }));
				} catch {
					// ignore
				}
			}
			const excel = roomExcelState.get(rk);
			if (excel && excel.size > 0) {
				const items = Array.from(excel.entries()).map(([noteId, state]) => ({
					noteId,
					visible: Boolean(state && state.visible),
					offset: {
						x: Number(state && state.offset && state.offset.x) || 0,
						y: Number(state && state.offset && state.offset.y) || 0,
					},
				}));
				try {
					ws.send(JSON.stringify({ type: "excel_state", room, items }));
				} catch {
					// ignore
				}
			}
			const linearState = roomLinearState.get(rk);
			if (linearState && linearState.size > 0) {
				const items = Array.from(linearState.entries()).map(([noteId, state]) => ({
					noteId,
					visible: Boolean(state && state.visible),
					projectId: state && state.projectId ? String(state.projectId) : "",
					projectName: state && state.projectName ? String(state.projectName) : "",
					offset: {
						x: Number(state && state.offset && state.offset.x) || 0,
						y: Number(state && state.offset && state.offset.y) || 0,
					},
				}));
				try {
					ws.send(JSON.stringify({ type: "linear_state", room, items }));
				} catch {
					// ignore
				}
			}
			const linearData = roomLinearData.get(rk);
			if (linearData && linearData.size > 0) {
				const items = Array.from(linearData.entries()).map(([noteId, data]) => ({
					noteId,
					projectId: data && data.projectId ? String(data.projectId) : "",
					projectName: data && data.projectName ? String(data.projectName) : "",
					updatedAt: Number(data && data.updatedAt ? data.updatedAt : 0) || 0,
					tasks: Array.isArray(data && data.tasks) ? data.tasks : [],
				}));
				try {
					ws.send(JSON.stringify({ type: "linear_data", room, items }));
				} catch {
					// ignore
				}
			}
			const scenes = roomExcalidrawScenes.get(rk);
			if (scenes && scenes.size > 0) {
				const items = Array.from(scenes.entries())
					.map(([noteId, scene]) => ({
						noteId,
						scene: typeof scene === "string" ? scene : "",
					}))
					.filter((it) => it.noteId && it.scene);
				if (items.length > 0) {
					try {
						ws.send(JSON.stringify({ type: "excalidraw_scene", room, items }));
					} catch {
						// ignore
					}
				}
			}
			const reqAvail = roomAvailabilityState.get(rk);
			if (reqAvail && reqAvail.size > 0) {
				const participants = Array.from(reqAvail.entries()).map(([cid, entry]) => ({
					clientId: cid,
					name: entry.name,
					color: entry.color,
					busy: entry.busy,
				}));
				try {
					ws.send(JSON.stringify({ type: "availability_state", room, participants }));
				} catch {
					// ignore
				}
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
			// Remove availability for disconnected client
			const availMap = roomAvailabilityState.get(rk);
			if (availMap) {
				availMap.delete(clientId);
				if (availMap.size > 0) {
					const participants = Array.from(availMap.entries()).map(([cid, entry]) => ({
						clientId: cid,
						name: entry.name,
						color: entry.color,
						busy: entry.busy,
					}));
					broadcast(rk, { type: "availability_state", room, participants });
				} else {
					broadcast(rk, { type: "availability_leave", room, clientId });
				}
			}
		}
		if (sockets.size === 0) {
			roomSockets.delete(rk);
			roomExcalidrawState.delete(rk);
			roomExcelState.delete(rk);
			roomLinearState.delete(rk);
			roomLinearData.delete(rk);
			roomExcalidrawScenes.delete(rk);
			roomAvailabilityState.delete(rk);
			roomSharedPins.delete(rk);
		}
	});
});

server.listen(PORT, HOST, async () => {
	console.log(`Mirror server running on http://${HOST}:${PORT}`);
	console.log(`WebSocket endpoint: ws://${HOST}:${PORT}/ws?room=<room>`);
	// Fetch latest Anthropic model on startup
	await refreshLatestModel();
	console.log(`[ai] active model: ${ANTHROPIC_MODEL}`);
	// Refresh periodically
	setInterval(() => refreshLatestModel(), AI_MODEL_REFRESH_MS);
});
