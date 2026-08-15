# Doku + Memory nach Lebensdauer getrennt (2026-08-15)

PRs #27 (`e5c90e5`) und #28.

## Warum

`Project-overview.md` war **221 KB** — das ~9-fache dessen, was als Leselimit für
`MEMORY.md` gilt. Kein Modell liest das vollständig, also veraltete sie unbemerkt.
Innen steckten drei Dinge mit unvereinbaren Lebensdauern: Ist-Zustand (muss *ersetzt*
werden), Änderungsarchiv (muss *wachsen*), Nachschlagewerk.

Dazu drei Folgeprobleme:

- Die Memory lag **außerhalb des Repos** → für andere KIs, andere Rechner und als
  Backup nicht existent.
- `CLAUDE.md` verwies auf `.claude/memory/MEMORY.md` — **den Pfad gab es nicht**.
- Stack und Architektur standen **dreifach** und drifteten belegbar auseinander
  („app.js ~31k Zeilen" bei real 34k; „Tailwind utilities", obwohl seit Juli
  vorkompiliert ausgeliefert wird).

## Der Grundsatz

**Eine Datei darf entweder wachsen oder gelesen werden — nie beides.**
Getrennt wird nach **Lebensdauer**, nicht nach Thema.

| Schicht | Datei | Verhalten | Budget |
|---|---|---|---|
| Regeln | `CLAUDE.md` | wird ersetzt | 5 KB |
| Zustand | `.github/Documentation/ARCHITECTURE.md` | wird ersetzt | 15 KB |
| Index | `.claude/memory/MEMORY.md` | 1 Zeile je Aufgabe | 17 KB |
| Detail | `.claude/memory/<datum>-<thema>.md` | neue Datei je Thema | 6 KB |
| Archiv | `FUNCTIONS.md`, `DOCUMENTATION.md`, `CHANGELOG-ARCHIVE.md` | append-only | – |

## Was konkret passiert ist

- **221 KB → 12 KB lesbar.** `ARCHITECTURE.md` ist **destilliert, nicht kopiert**;
  die Detailtabellen (Notiz-Graph-Funktionen, Availability-WS-Formate) wurden an
  `FUNCTIONS.md` angehängt, damit nichts verloren geht.
- **Memory ins Repo.** `~/.claude/projects/…/memory` ist jetzt ein **Symlink** auf
  `/Users/steffen/Documents/GitHub/mirror/.claude/memory`. Das Original liegt als
  `memory.pre-symlink-backup` daneben und kann gelöscht werden.
- **Öffentliches Repo:** konkrete Konten/Adressen stehen in `local.md`
  (gitignoriert), `MEMORY.md` beschreibt sie nur abstrakt.
- **Wächter:** `scripts/check-doc-budgets.sh` + Action `Doc Budgets`. Warnt ab 85 %,
  bricht ab 100 % ab und schlägt konkretes Auslagern vor.

## MERKE

- **Der Symlink zeigt auf den Haupt-Checkout.** Memory-Änderungen aus einem Worktree
  sind dort erst nach dem Merge sichtbar. Kein Fehler, aber erklärt Verzögerungen.
- **Backlog gehört nicht in die Memory.** „Possible follow-ups" aus einer Topic-Datei
  sind nach `FEATURES.md` gewandert — Planung ist kein Erfahrungswissen.
- **Rotation:** Log-Einträge älter als ~6 Monate gesammelt nach `ARCHIVE-<jahr>.md`
  verschieben, nicht löschen. Nächste Fälligkeit ca. 2026-09 (ältester Eintrag
  2026-03-07).
- Vor jedem Verschieben von Memory-Inhalten prüfen, ob die Zieldatei die „MERKE"-Punkte
  wirklich schon enthält — beim Note-Graph fehlten sie und mussten erst ergänzt werden.
