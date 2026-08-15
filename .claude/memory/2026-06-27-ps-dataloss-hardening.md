# 2026-06-27 — PS-Datenverlust: Härtung gegen stillen Notizverlust

**Auslöser**: User verlor eine PS-Notiz (Developer-Link-Sammlung), ohne sie zu löschen. Analyse ergab mehrere stille Verlust-Pfade. User-Auftrag: suchen, Ursachen, Prävention.

## Fixes (alle `app.js`, außer Trash-TTL in `server.js`)

- **A — Offline-Replay 404**: `replayOfflineOps` verwarf Offline-Edits bei 404 kommentarlos (`offlineDeleteSingleOp`). Jetzt: bei 404 auf `update`-Op mit Inhalt → Notiz via POST neu anlegen (Recreate), lokale ID neu mappen, Toast `offline.note_recreated`. 409 weiterhin droppen (Inhalt existiert woanders).
- **B — `offlinePutNotes` clear()-Wipe**: dirty-Erhalt war an `pendingOps.length>0` gekoppelt → `store.clear()` löschte ungesyncte Notiz, wenn Op schon konsumiert. Jetzt: dirtyNotes IMMER berechnen/erhalten.
- **C — Stille Fehler**: neuer Helper `notifyPsSaveFailed()` (gedrosselter Error-Toast, 15s, `psSaveFailToastAt`). Ersetzt stille `setPsAutoSaveStatus("Speichern fehlgeschlagen")` in Auto-Save-Timer, Snapshot-Catch, Offline-Save-Catches. i18n `ps.save_failed`.
- **D — Netzwerk-Fallback**: war vorhanden (Online-Catch → `offlineSaveNote`). Verstärkt: Snapshot-404 rettet Inhalt jetzt AUCH bei `wasEditing===false` (gequeueter Save nach Notizwechsel) → neue Notiz via POST, sonst offline-enqueue.
- **E — Black Box** (always-on Sicherheitsnetz): localStorage-Ringpuffer `mirror_ps_local_backup_v1` (40 Einträge, dedupe aufeinanderfolgender gleicher Notiz, Quota-Fallback). Funktionen: `commitPsLocalBackup`, `schedulePsLocalBackup` (1,2s debounce). Hook in `#mirror` input-Listener. Läuft auf allen Plattformen inkl. mobil. Recovery-API: `window.mirrorLocalBackups()` (Liste) + `window.mirrorRestoreBackup(i)` (als neue Notiz wiederherstellen).
- **F — Mehrgeräte-Konflikt**: nicht-destruktive Warnung in `refreshPersonalSpace`: wenn aktuell editierte Notiz remote geändert + lokale unsaved Edits (editorText≠baseline≠serverText) → Black-Box-Snapshot + Toast `ps.remote_conflict` (30s throttle, `psConflictToastAt`). Editor-Textarea wird NICHT überschrieben.

## Punkt 3 — Trash 365 Tage
`TRASH_RETENTION_DAYS` 30 → **365** (`server.js:209`). i18n `settings.trash.desc` (DE+EN) auf 365 angepasst. Trash hat `/restore`-Endpoint + Settings → Papierkorb UI.

## Punkt 4 — Local Backup immer aktiv + Hinweis + Mobile-Skip
- Es existiert bereits ein Ordner-Autobackup (File System Access API, `pickAutoBackupFolder`, `initAutoBackup`, `runAutoBackup`, daily/weekly/monthly, Handle in IndexedDB `mirror_fs_handles_v1`).
- **Mobile-Skip**: `isMobileViewport()`-Guard in `scheduleAutoBackup` (Ordner-Backup desktop-only; Black Box bleibt mobil aktiv).
- **Startup-Hinweis**: `maybeShowBackupFolderHint()` (aufgerufen in `initAutoBackup`) → JS-erzeugter Banner `#backupFolderHint` wenn Desktop + `supportsDirectoryAccess` + authed + kein `psAutoBackupHandle` + nicht dismissed (`mirror_ps_backup_hint_dismissed`). Buttons: „Ordner wählen" → `pickAutoBackupFolder`, „✕" → `dismissBackupFolderHint`. i18n `backup.hint_no_folder`, `backup.hint_choose`, `common.dismiss`.

## Offen / Follow-ups
1. **Prod-Notizsuche ausstehend**: `FLY_API_TOKEN` ist nur GitHub-Actions-Secret (`.github/workflows/fly-deploy.yml`), lokal kein fly-Login. User muss selbst `fly ssh console -a mirror-snowy-sound-8093 -C "sqlite3 /data/mirror.sqlite ..."` (notes + notes_trash nach `developer`/`http` durchsuchen) ODER Token bereitstellen.
2. Black-Box-Recovery hat noch keine Settings-UI (nur Konsole-API).
3. Lokaler Server-Boot scheitert an `better-sqlite3` ABI-Mismatch (Node 147 vs 131) — nur lokal, Prod via Docker ok. `node --check` beider Dateien grün.

**Status**: Deployed. Code-Commit `18dc7df`, gitstamp-Commit `7b24844`, nach `main` gepusht → Fly-Deploy `completed/success`. Live-gitstamp bestätigt `18dc7df`.
