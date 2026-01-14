# Mirror – Featureliste (Ideen / Roadmap)

Diese Liste ist bewusst breit. Sie dient als Ideenspeicher für zukünftige Iterationen.

## UX & Basics

- Räume Speichernund wieder drau zugreifen können
- Raumwechsel ohne Reload (stabil, kein Flackern)
- „Room“-Namen-Generator konfigurierbar (nerdig/lustig/kurz) + „Neu“ erstellt immer eindeutigen Namen
- „Link kopieren“ Button (mit visuellem Feedback)
- „Join on Enter“ + Validierungsfeedback (ungültige Zeichen, Länge)
- Lade-/Sync-Status genauer: `Verbinde…`, `Online`, `Offline`, `Letztes Update: …`
- Toasts für wichtige Aktionen/Fehler
- Mobile UX: bessere Höhe/Keyboard-Handling, größere Touch-Targets
- Accessibility: Fokus-Stile, ARIA-Labels, Kontrast, Screenreader-Texte
- i18n (DE/EN) als Option

## Markdown (Anzeige & Export)

- Markdown-Preview (Split View: Editor links, Preview rechts)
- Markdown-Rendering mit Sicherheits-Sandbox (kein unsicheres HTML)
- Syntax-Highlighting für Codeblöcke
- GitHub-flavoured Markdown: Tabellen, Tasklists, Strikethrough
- Autolinks (URLs automatisch klickbar)
- Mermaid/Diagramme optional (aus Sicherheitsgründen standardmäßig aus)
- Export:
  - `Download .md`
  - `Download .txt`
  - `Copy as Markdown`
  - `Copy as HTML` (optional)

## Kollaboration (Realtime)

- Präsenz: „X Nutzer online in diesem Raum“
- Anzeige „User tippt…“ (Typing Indicator)
- Cursor-/Selection-Sharing (optional)
- Konfliktfreie Zusammenarbeit (CRDT/OT) statt „Last write wins“
- Per-Client Identität (Name/Farbe) + zufällige Avatare
- Rate-Limits & Debounce/Throttle pro Client
- „Read-only“ Mode (Raum kann schreibgeschützt sein)

## Persistenz & Historie

- Persistenz über Neustarts:
  - Lokal: Datei/SQLite
  - Production: Redis/Postgres
- Versionierung/History pro Raum (Snapshots)
- Undo/Redo serverseitig (oder CRDT-basiert)
- Zeitreise/Restore auf Snapshot
- Optional: Auto-Prune (z.B. Räume nach 7/30 Tagen ohne Aktivität löschen)

## Sicherheit & Datenschutz

- Private Rooms: Secret Token im Link (z.B. `#room=...&key=...`)
- Passphrase-geschützte Räume
- Ende-zu-Ende-Verschlüsselung (E2EE) im Browser (Server sieht nur Ciphertext)
- CORS/Origin-Check für WS (nur eigene Domain zulassen)
- Input-Härtung:
  - Room-Name Whitelist (ist bereits eingeschränkt)
  - Message-Schema validieren
  - Payload-Limits (max Textgröße)
- Abuse-Schutz:
  - Connection limits pro IP
  - Flood protection
- Audit-Logs (optional, DSGVO-konform)

## Admin & Operations

- Healthcheck Endpoint (`/healthz`)
- Metrics (z.B. Prometheus): aktive Rooms, aktive WS-Verbindungen
- Logging strukturiert (JSON), Log-Level
- Konfiguration via ENV:
  - Port/Host
  - Max Rooms/Connections
  - Storage backend
- Graceful shutdown: WS sauber schließen, State flushen

## Produkt-Features

- Raum-Übersicht (nur lokal/admin): Liste aktiver Räume
- Favoriten/Recents (Client) – existiert teilweise, ausbauen
- Templates (vordefinierte Inhalte: Meeting Notes, Standup, Retro)
- Tags/Labels pro Raum
- Sharing: QR-Code für Raum-Link
- „Broadcast“ Modus (nur ein Sender darf schreiben)

## Entwickler-Qualität

- E2E-Test: zwei Clients, Sync, Room switch
- Lint/Format (Prettier/ESLint) + CI
- TypeScript (optional) oder zumindest JSDoc + Schema Validation
- Saubere Trennung: Client-Script aus HTML in eigene Datei (optional)

---

### Priorisierungsvorschlag (kurz)

- P0: Payload-Limits + Origin-Check + bessere Statusanzeigen
- P1: Markdown-Preview + Export
- P2: Persistenz (SQLite/Redis) + History
- P3: CRDT/OT + Cursor/Presence
