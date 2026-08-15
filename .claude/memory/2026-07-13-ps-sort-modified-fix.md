# 2026-07-13 — PS-Sortierung „Geändert" bumpte updatedAt beim bloßen Anwählen

## Symptom
Sort „Geändert" (`psSortMode==="updated"`, data-sort="updated", sortiert nach `note.updatedAt`): durchgeklickte Notizen sprangen grundlos nach oben, wurden als „geändert" markiert — obwohl nie editiert.

## Zwei Ursachen, zwei Guards
1. **Nebenschauplatz** — `updateLocalNoteText` (app.js ~20103) setzte `updatedAt = Date.now()` bedingungslos beim Room-Sync-Echo (`applyRemoteText`→`applySyncedText`→`updateLocalNoteText`, identischer Text). Guard: `if (String(base.text ?? "") === text) return;`. (PR #16)
2. **HAUPTURSACHE** — `flushPendingPsAutoSave` (app.js ~11802) läuft bei JEDEM Notiz-Listen-Klick (app.js ~17671, vor dem Öffnen). Ohne Guard fiel `queuedText = psAutoSaveQueuedText || currentText` auf `currentText` zurück, auch wenn NICHTS anstand → PUT via `savePersonalSpaceNoteSnapshot` → `saved.updatedAt = Date.now()`. So wurde die zuvor geöffnete Notiz beim Wegklicken ungeändert neu gespeichert. Guard:
   ```js
   const hasQueued = Boolean(psAutoSaveQueuedText);
   if (!hasQueued && psAutoSaveLastSavedNoteId === currentNoteId && currentText === psAutoSaveLastSavedText) return;
   ```
   (PR #18, `c175791`)

**MERKE:** `savePersonalSpaceNoteSnapshot` + `savePersonalSpaceNote` stempeln `saved.updatedAt = Date.now()` bei jedem PUT → jeder unnötige Save bumpt „Geändert". No-Op-Saves VOR dem PUT abfangen.

## Endstand
Cache v39 / `app.js?v=2026-07-13-05` / gitstamp `e380fca`. Prod verifiziert (beide Guards live). PRs #16, #17 (Cache-Bust), #18 (echter app.js-Guard).

## ⚠️ Worktree-Edit/Git-Falle (ZWEIMAL passiert)
`app.js`-Edits gingen an den **Haupt-Repo-Pfad** `/Users/steffen/Documents/GitHub/mirror/app.js`, während `git add/commit` im **Worktree** liefen → Commit enthielt app.js NICHT, Fix ging „verloren", war nicht in Prod, obwohl gitstamp/Version stimmten.
- **SYMPTOM:** Version/gitstamp in Prod korrekt, aber Code-Guard fehlt: `curl <prod>/app.js?v=… | grep -c "<guard-string>"` = 0.
- **REGEL:** In Worktree-Sessions ALLE Edits + git mit absoluten Worktree-Pfaden (`…/.claude/worktrees/<name>/…`) ODER ganz ohne `cd` (cwd = Worktree). Nie in Haupt-Repo-Pfad `cd`en, nie Haupt-Repo-Pfad als Edit `file_path`.
- **IMMER nach Commit verifizieren:** `git show --stat HEAD` listet erwartete Dateien; nach Deploy `curl <prod>/app.js?v=… | grep -c "<neue-code-zeile>"`.

## Permissions dauerhaft gesetzt
User trug in `~/.claude/settings.json` → `permissions.allow` ein: `Bash(git push:*)`, `Bash(gh pr create:*)`, `Bash(gh pr merge:*)`, `Bash(gh pr edit:*)`. Seitdem Push+PR+Selbst-Merge nach `main` OHNE Classifier-Block (PR #18 komplett automatisch).
- **ABER:** `git reset --hard` / `--force` bleiben blockiert → für Worktree/Main-Cleanup nicht-destruktiv: `git stash push <file>` + `git merge --ff-only origin/main` + `git stash drop` statt `reset --hard`.
- Ich darf `settings.json` weiterhin NICHT selbst ändern (Self-Modification-Block) — User macht es manuell.
