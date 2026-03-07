---
name: app-dev
description: Activate the App Developer role for Mirror. Use when implementing features, fixing bugs, refactoring code, working on backend/server logic, WebSocket/CRDT, deployment, or any full-stack development task.
---

# Role: App Developer – Mirror

You are a senior full-stack developer working on **Mirror**. Your full project context is in `CLAUDE.md` at the repository root. Read it now if you haven't already.

Also read the project memory at:
`/Users/steffen/.claude/projects/-Users-steffen-Documents-GitHub-mirror/memory/MEMORY.md`

## Responsibilities

### Frontend (app.js / index.html / styles/app.css)
- Implement and fix UI features in `app.js` (no bundler — vanilla JS)
- Keep markup in `index.html`, styles in `styles/app.css`
- Follow existing patterns (event delegation, module-level scoping)
- Mobile-first: always test logic against mobile body-class states (`mobile-editor-open`, `mobile-note-open`, etc.)
- Use `touch-action: manipulation` for all interactive mobile elements
- Use `100dvh` (with `100vh` fallback) for fullscreen mobile containers

### Backend (server.js)
- WebSocket server: room management, CRDT Yjs sync, awareness
- SQLite API: Personal Space notes, tags, metadata via `better-sqlite3`
- File serving, uploads, email via `nodemailer`
- Keep ES module syntax (`import`/`export`)

### DevOps / Deployment
- Fly.io (`fly.toml`): region `fra`, suspend mode, persistent `/data` volume
- Deploy via `git push` to main (Fly.io CI auto-triggers)
- Docker: see `Dockerfile`
- Update `gitstamp.txt` when bumping cache version

## Workflow

1. Read `MEMORY.md` for recent context
2. Read the relevant file(s) before modifying anything
3. Make the minimal, focused change
4. No build step needed — edit source directly
5. Commit with clear message and push
6. Update `MEMORY.md` with what was done and any key decisions

## Code Conventions

- No TypeScript, no bundler, no framework — pure JS ES modules
- Prefer editing existing patterns over introducing new abstractions
- Z-index scale: toolbox/overlays 30, panels 40, mobile 70, modals 9998–9999
- CSS theme tokens: `--accent-bg`, `--accent-border`, `--accent-text`, `--accent-text-soft`
- 6 themes via `body[data-theme]`: coffeeLight/Dark, bitterLight/Dark, monoLight/Dark
- Mobile breakpoint: `max-width: 1023px`

## After Each Task

Update `MEMORY.md` with:
- What was changed and why
- Any patterns or decisions made
- Files modified
