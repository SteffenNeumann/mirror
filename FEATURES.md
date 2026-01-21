# Mirror – Feature List (Ideas / Roadmap)

This list is intentionally broad. It’s an idea backlog for future iterations.

## UX & Basics

- Save rooms and access them again
- Switch rooms without reload (stable, no flicker)
- Configurable “room name” generator (nerdy/funny/short) + “New” always creates a unique name
- “Copy link” button (with visual feedback)
- “Join on Enter” + validation feedback (invalid characters, length)
- More precise load/sync status: `Connecting…`, `Online`, `Offline`, `Last update: …`
- Toasts for important actions/errors
- Mobile UX: better height/keyboard handling, larger touch targets
- Accessibility: focus styles, ARIA labels, contrast, screen reader text
- i18n (DE/EN) as an option
- Vor/Zurück Navigation
- Tags in der Liste live aktualisieren, wenn eine Notiz bereits gespeichert ist
- Blockquote-Farbe an das Theme anpassen
- Submenu bei Textmarkierung einblenden (Formatierung ändern, sortieren etc.)
- Slashkommand-Menüposition an Cursor-Position ausrichten (aktuell zu hoch)

## Markdown (Display & Export)

- Markdown preview (split view: editor left, preview right)
- Markdown rendering with a security sandbox (no unsafe HTML)
- Syntax highlighting for code blocks
- GitHub-flavoured Markdown: tables, task lists, strikethrough
- Autolinks (URLs automatically clickable)
- Mermaid/diagrams optional (off by default for security)
- Export:
  - `Download .md`
  - `Download .txt`
  - `Copy as Markdown`
  - `Copy as HTML` (optional)

## Code Runner (Snippets)

- Run snippets (Preview / Personal Space): Python (Pyodide) & JavaScript
- Python init timeout workaround (if CDN blocked / network slow): open page with `?pyodide=https://pyodide-cdn2.iodide.io/v0.25.1/full/`
- Optional: AI assist (explain/fix/improve/summarize) for code blocks (server API, requires API key via ENV)

## Collaboration (Realtime)

- Presence: “X users online in this room”
- “User is typing…” indicator
- Cursor/selection sharing (optional)
- Conflict-free collaboration (CRDT/OT) instead of “last write wins”
- Per-client identity (name/color) + random avatars
- Rate limits & debounce/throttle per client
- “Read-only” mode (room can be write-protected)

## Persistence & History

- Persistence across restarts:
  - Local: file/SQLite
  - Production: Redis/Postgres
- Versioning/history per room (snapshots)
- Server-side undo/redo (or CRDT-based)
- Time travel/restore to snapshot
- Optional: auto-prune (e.g., delete rooms after 7/30 days of inactivity)

## Security & Privacy

- Private rooms: secret token in the link (e.g. `#room=...&key=...`)
- Passphrase-protected rooms
- End-to-end encryption (E2EE) in the browser (server only sees ciphertext)
- CORS/origin check for WS (only allow own domain)
- Input hardening:
  - Room name whitelist (already constrained)
  - Validate message schema
  - Payload limits (max text size)
- Abuse protection:
  - Connection limits per IP
  - Flood protection
- Audit logs (optional, GDPR-friendly)

## Admin & Operations

- Healthcheck endpoint (`/healthz`)
- Metrics (e.g. Prometheus): active rooms, active WS connections
- Structured logging (JSON), log levels
- Configuration via ENV:
  - Port/host
  - Max rooms/connections
  - Storage backend
- Graceful shutdown: close WS cleanly, flush state

## Product Features

- Room overview (local/admin only): list active rooms
- Favorites/recents (client) – partially exists, expand
- Favoriten in Einstellungen bearbeiten (z. B. umbenennen, neu sortieren, entfernen)
- Templates (predefined content: meeting notes, standup, retro)
- Tags/labels per room
- Sharing: QR code for room link
- “Broadcast” mode (only one sender can write)

## Integrationen & Live Updates (neuer Raum)

- Live-Update von Webseiten/Feeds per API (Zweck: aktuelle Infos im Raum bündeln; Nutzen: weniger Kontextwechsel; Möglichkeiten: Polling/Webhooks, Anzeige als Karten/Markdown)
- News/Breaking-Feeds (Zweck: schnelle Lagebilder; Nutzen: Team bleibt synchron; Möglichkeiten: Tagesschau/NewsAPI, Filter nach Keywords)
- Wetter/Unwetterwarnungen (Zweck: operative Planung; Nutzen: rechtzeitige Hinweise; Möglichkeiten: DWD/Open-Meteo, Push bei Warnstufe)
- Börse/Krypto/Preise (Zweck: Marktüberblick; Nutzen: Entscheidungen im Team; Möglichkeiten: Alpha Vantage/CoinGecko, Alarme bei Schwellen)
- Statusseiten (Zweck: Störungen erkennen; Nutzen: weniger Support-Noise; Möglichkeiten: Statuspage.io/Atlassian, Auto-Post in Raum)
- GitHub/GitLab Activity (Zweck: Dev-Transparenz; Nutzen: weniger Tool-Hopping; Möglichkeiten: PR/Issue-Events, Build-Status)
- Kalender/Termine (Zweck: gemeinsame Planung; Nutzen: Termine im Blick; Möglichkeiten: ICS/Google Calendar, Tagesagenda)
  - Freie-Zeiten-Ansicht (Tag/Woche) via Icon im Kalenderbereich
  - Lokale Termine anlegen + Sync mit Personal Space (read-only ICS bleibt)
- Verkehr/ÖPNV (Zweck: Reiseplanung; Nutzen: weniger Überraschungen; Möglichkeiten: GTFS-Realtime, Störungsmeldungen)
- Monitoring/Alerts (Zweck: Betriebssicherheit; Nutzen: schnellere Reaktion; Möglichkeiten: Prometheus/Alertmanager, Severity-Filter)

## Developer Quality

- E2E test: two clients, sync, room switch
- Lint/format (Prettier/ESLint) + CI
- TypeScript (optional) or at least JSDoc + schema validation
- Clean separation: move client script out of HTML into its own file (optional)

---

### Priority Proposal (short)

- P0: payload limits + origin check + better status indicators
- P1: markdown preview + export
- P2: persistence (SQLite/Redis) + history
- P3: CRDT/OT + cursor/presence
