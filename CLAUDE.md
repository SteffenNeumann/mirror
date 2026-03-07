# Mirror – Claude Project Instructions

## Memory & Context

- **Always read** `.claude/memory/MEMORY.md` at the start of every new chat for project state, recent decisions, and key patterns.
- **After every completed task**, update `MEMORY.md` with relevant learnings, decisions, and changes.
- Memory path: `/Users/steffen/.claude/projects/-Users-steffen-Documents-GitHub-mirror/memory/MEMORY.md`

## Project Overview

**Mirror** is a real-time collaborative web app — a shared editor, personal note space (Personal Space / PS), calendar, and planning tool.

- **URL**: https://mymirror.myinterdesk.net
- **Deployment**: Fly.io (`mirror-snowy-sound-8093`, region `fra`)
- **Mode**: Suspend mode with health-check to reduce 502s

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JS (`app.js`), HTML (`index.html`), CSS (`styles/app.css`) |
| Styling | Tailwind (utility classes) + custom CSS in `app.css` |
| Backend | Node.js (`server.js`), ES modules |
| Real-time | WebSocket (`ws` library) + Yjs CRDT (`yjs`) |
| Database | SQLite via `better-sqlite3` at `/data/mirror.sqlite` |
| Deploy | Fly.io + Docker, persistent volume at `/data` |
| Embeds | Excalidraw (`excalidraw-embed.html`), EtherCalc, Linear |

## Key Files

| File | Role |
|---|---|
| `app.js` | All frontend logic (~27k+ lines) |
| `index.html` | Full UI markup |
| `styles/app.css` | All custom CSS, theme overrides, mobile layout |
| `server.js` | WebSocket server, SQLite API, file serving |
| `fly.toml` | Fly.io deployment config |
| `sw.js` | Service Worker for PWA |

## Architecture Notes

- **Single-file frontend**: All JS in `app.js`, all CSS in `styles/app.css` — no build step, no bundler.
- **Themes**: 6 themes (`coffeeLight`, `coffeeDark`, `bitterLight`, `bitterDark`, `monoLight`, `monoDark`) via `body[data-theme="..."]` selectors. CSS variables: `--accent-bg`, `--accent-border`, `--accent-text`, `--accent-text-soft`.
- **Mobile layout**: Driven by JS-toggled body classes (`mobile-editor-open`, `mobile-note-open`, `mobile-ps-open`, `mobile-preview-open`, `mobile-calendar-open`). Mobile breakpoint: `max-width: 1023px`.
- **Personal Space (PS)**: SQLite-backed note system with tags, pinning, YAML frontmatter, categories.
- **Toolbox**: Editor toolbar (`#editorToolbox`, `.toolbox-trigger`, `.toolbox-btn`) at bottom-right of editor.
- **CRDT**: Yjs-based real-time sync with awareness (cursors, presence).

## Development Guidelines

- No build step — edit source files directly.
- Keep JS in `app.js`, CSS in `styles/app.css`, markup in `index.html`.
- Always use `touch-action: manipulation` + `-webkit-tap-highlight-color: transparent` for mobile buttons.
- Use `100dvh` (with `100vh` fallback) for full-screen mobile panels.
- Z-index scale: overlays 30, panels 40, mobile full-screen 70, modals 9998–9999.
- After changes: `git add`, commit, `git push` (Fly.io auto-deploys from main).
- Update `gitstamp` / `gitstamp.txt` when bumping the app version cache.

## Available Roles / Skills

| Skill | Invocation | Description |
|---|---|---|
| App Developer | `/app-dev` | Full-stack development (frontend + backend) |
| UI Designer | `/ui-designer` | Visual design, new components, CSS/Tailwind |
| Mirror Dev | `/mirror-dev` | Both roles combined |
