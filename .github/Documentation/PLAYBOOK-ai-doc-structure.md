# Playbook: KI-lesbare Doku-Struktur für große Projekte

> **Projektunabhängig.** Diese Datei beschreibt ein Muster, das in jedes größere Repo
> übertragbar ist. Sie liegt hier, weil Mirror 2026-08-15 der erste Anwendungsfall war
> — sie enthält aber bewusst nichts Mirror-Spezifisches.
>
> Zum Adaptieren: kopieren, die Budgets an die Projektgröße anpassen, Schritt 1–6 abarbeiten.

---

## Das Problem, das dieses Muster löst

Projektdokumentation für KI-Assistenten scheitert fast immer auf dieselbe Weise:

1. Jemand legt eine `project-overview.md` an — Architektur, Änderungen, Funktionsliste.
2. Jede erledigte Aufgabe hängt einen Abschnitt an. Die Datei wächst.
3. Ab einer gewissen Größe liest kein Modell sie mehr vollständig.
4. Sie veraltet, **ohne dass es jemand merkt** — sie sieht ja weiter gepflegt aus.
5. Parallel entstehen Zweit- und Drittkopien derselben Fakten (`CLAUDE.md`,
   `.cursorrules`, `copilot-instructions.md`, ein Memory-Ordner). Die driften.

Der Endzustand: viel Dokumentation, wenig Wirkung. Im Ausgangsfall waren es 221 KB in
einer Datei — das ~9-fache dessen, was ein Assistent zuverlässig am Stück liest.

**Der Fehler ist nicht die Größe. Der Fehler ist, dass Inhalte mit verschiedener
Lebensdauer in derselben Datei liegen.**

## Der Grundsatz

> **Eine Datei darf entweder wachsen oder gelesen werden — nie beides.**

Ein Changelog *muss* wachsen. Eine Zustandsbeschreibung *muss ersetzt werden*. Wo
beides zusammenliegt, gewinnt immer das Wachstum. Also: **nach Lebensdauer trennen,
nicht nach Thema.**

## Die Zielstruktur

| Schicht | Typische Datei | Verhalten | Budget | Wird gelesen |
|---|---|---|---|---|
| **Regeln** | `CLAUDE.md` / `AGENTS.md` (Root) | wird ersetzt | 5 KB | jede Session |
| **Zustand** | `docs/ARCHITECTURE.md` | **wird ersetzt** | 15 KB | jede Session |
| **Index** | `.claude/memory/MEMORY.md` | 1 Zeile je Aufgabe | 17 KB | jede Session |
| **Detail** | `.claude/memory/<datum>-<thema>.md` | neue Datei je Thema | 6 KB je | auf Abruf |
| **Archiv** | `CHANGELOG.md`, `FUNCTIONS.md` | append-only | – | nur gegrept |

Budgets sind Startwerte für ein mittelgroßes Repo. Kleiner ist besser; entscheidend ist,
dass sie **existieren und geprüft werden**.

### Warum genau diese fünf

- **Regeln** und **Zustand** getrennt, weil Regeln selten und Architektur oft wechselt.
- **Index** getrennt vom **Detail**, weil man 40 Aufgaben überblicken will, ohne 40
  Detailberichte zu lesen. Der Index kostet eine Zeile pro Aufgabe, das Detail liegt
  einen Klick entfernt.
- **Archiv** darf beliebig wachsen, weil es nie am Stück gelesen, sondern **gegrept**
  wird. Ein Funktionskatalog mit `#tags` ist dafür ideal — er soll gar nicht lesbar sein.

## Umsetzung in sechs Schritten

### 1. Bestand messen, nicht schätzen

```bash
find . -name "*.md" -not -path "./node_modules/*" -exec du -h {} + | sort -rh | head -20
```

Alles über ~20 KB, das bei jeder Session gelesen werden soll, ist ein Kandidat.
Prüfe bei jeder großen Datei: **wie viele Lebensdauern stecken darin?**

### 2. Die große Datei zerlegen

Nach Zweck aufteilen, typischerweise dreiteilig:

- **Ist-Zustand** → neue `ARCHITECTURE.md`. **Destillieren, nicht kopieren.** Das ist
  echte Arbeit und der eigentliche Wert des Vorgangs.
- **Datierte Änderungen** → `CHANGELOG-ARCHIVE.md`, aus dem Sichtfeld.
- **Nachschlagewerk** (Funktions-/API-Listen) → eigene Datei, darf groß bleiben.

Mechanisch geht das mit `awk 'NR>=x && NR<=y' alt.md > neu.md`.

> ⚠️ **Beim Destillieren gehen Details verloren.** Prüfe vorher, was in der Kurzfassung
> keinen Platz findet, und hänge es ans Nachschlagewerk an, statt es zu streichen.
> Danach gegenprüfen, ob jeder Schlüsselbegriff noch irgendwo existiert:
> ```bash
> for s in "BegriffA" "BegriffB"; do printf "%-20s %s\n" "$s" "$(grep -rl "$s" *.md | tr '\n' ' ')"; done
> ```

### 3. Die alte Datei als Wegweiser stehen lassen

Nicht löschen. Ersetze den Inhalt durch eine Tabelle „du suchst X → Datei Y" plus den
Satz **„Hier nichts Neues eintragen."** Alte Links und ältere KI-Kontexte laufen sonst
ins Leere und die Datei wächst wieder zu.

### 4. Memory ins Repo holen

Assistenten-Memory liegt oft außerhalb des Projekts (z. B. `~/.claude/projects/…`).
Damit ist sie: nicht versioniert, nicht gesichert, an einen Rechner und ein Werkzeug
gebunden, und für jede andere KI unsichtbar.

```bash
# Memory ins Repo verschieben und den Werkzeug-Ordner darauf zeigen lassen
mv ~/.claude/projects/<projekt>/memory ~/.claude/projects/<projekt>/memory.backup
ln -s /pfad/zum/repo/.claude/memory ~/.claude/projects/<projekt>/memory
```

> ⚠️ **Vor dem Verschieben auf private Daten prüfen** — besonders bei öffentlichen Repos:
> ```bash
> grep -rIn "@\|token\|password\|secret\|api[-_]key" .claude/memory/
> ```
> Konkrete Konten, Adressen und Zugangsdaten in eine **gitignorierte** `local.md`
> auslagern; die versionierte Datei beschreibt sie nur abstrakt („Konto A / Konto B").
>
> ⚠️ **Bei git-Worktrees:** Der Symlink zeigt auf den Haupt-Checkout. Memory-Änderungen
> aus einem Worktree erscheinen dort erst nach dem Merge.

### 5. Duplikate auflösen

Jede Regel und jedes Faktum genau **einmal**. Die anderen Dateien verlinken nur.
Typische Dubletten: Tech-Stack, Verzeichnisstruktur, Commit-Workflow, Coding-Regeln.

Für weitere Assistenten (`copilot-instructions.md`, `.cursorrules`, `AGENTS.md`): kurz
halten und auf die Hauptdatei verweisen. **Diese Dateien nicht gitignorieren** — sonst
driften sie unbemerkt, und genau sie steuern die anderen KIs.

> Prüfe solche Dateien auf **widersprüchliche Anweisungen**. Im Ausgangsfall wies eine
> ungenutzte Vorlage die KI an, „eine umfassende project-overview.md zu erstellen" und
> „immer auf main zu committen" — beides gegen die tatsächlichen Regeln.

### 6. Größen-Wächter in die CI

Ohne automatische Prüfung kippt die Struktur binnen Monaten zurück. Ein Shell-Skript
plus CI-Job genügt:

```bash
#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

BUDGETS=( "CLAUDE.md:5" "docs/ARCHITECTURE.md:15" ".claude/memory/MEMORY.md:17" )

fail=0
for entry in "${BUDGETS[@]}"; do
    file="${entry%:*}"; limit=$(( ${entry##*:} * 1024 ))
    [ -f "$file" ] || continue
    bytes=$(wc -c <"$file" | tr -d ' ')
    pct=$(( bytes * 100 / limit ))
    if [ "$bytes" -gt "$limit" ]; then
        printf '  ✗ %-40s %s%% des Budgets\n' "$file" "$pct"; fail=1
    elif [ "$pct" -ge 85 ]; then
        printf '  ! %-40s %s%% — bald auslagern\n' "$file" "$pct"
    fi
done
[ "$fail" -eq 1 ] && { echo "Budget überschritten — AUSLAGERN, nicht kürzen."; exit 1; }
echo "Alle Budgets eingehalten."
```

Zwei Details, die den Unterschied machen:

- **Warnschwelle bei 85 %**, nicht erst beim Bruch — dann bleibt Zeit zum Auslagern.
- **Die Fehlermeldung muss sagen, wohin ausgelagert wird.** Sonst kürzt der Nächste
  einfach Inhalte weg, und der Wächter hat das Gegenteil bewirkt.

> Budgets so setzen, dass am ersten Tag **nichts** warnt. Eine Datei, die ab Beginn
> gelb leuchtet, trainiert alle darauf, Warnungen zu ignorieren.

## Betrieb: die zwei Regeln danach

**Nach jeder erledigten Aufgabe:**
1. **Eine Zeile** in den Index, Details in eine datierte Topic-Datei.
2. `ARCHITECTURE.md` anpassen — **nur wenn sich der Ist-Zustand geändert hat.**

**Rotation:** Index-Einträge älter als ~6 Monate gesammelt nach `ARCHIVE-<jahr>.md`
verschieben. **Verschieben, nicht löschen.** So bleibt der Index dauerhaft klein,
ohne dass Wissen verschwindet.

## Was in welche Datei gehört — die häufigsten Fehlgriffe

| Inhalt | Gehört nach | Nicht nach |
|---|---|---|
| „So ist es gebaut" | `ARCHITECTURE.md` | Changelog |
| „Das haben wir geändert" | `CHANGELOG.md` | `ARCHITECTURE.md` |
| „Das wollen wir mal bauen" | `FEATURES.md` / Backlog | Memory |
| „Diese Falle kostete zwei Stunden" | Memory (Index + Topic) | Changelog |
| „So committen wir hier" | Regeldatei | überall sonst |
| Konten, Keys, Adressen | gitignorierte `local.md` | irgendetwas Versioniertes |

Der häufigste Fehlgriff ist die dritte Zeile: **Backlog wandert in die Memory.**
Planung ist kein Erfahrungswissen — sie veraltet anders und bläht den Index auf.

## Checkliste

- [ ] Größen gemessen, Dateien > 20 KB identifiziert
- [ ] Jede große Datei auf gemischte Lebensdauern geprüft
- [ ] `ARCHITECTURE.md` **destilliert** (nicht kopiert), Details ins Nachschlagewerk gerettet
- [ ] Gegenprüfung: jeder Schlüsselbegriff existiert noch irgendwo
- [ ] Alte Datei = Wegweiser mit „hier nichts Neues eintragen"
- [ ] Memory im Repo, Werkzeug-Ordner als Symlink
- [ ] Privates in gitignorierter `local.md`, Leak-Scan gelaufen
- [ ] Instruktionsdateien anderer KIs kurz, verweisend, **nicht gitignoriert**, widerspruchsfrei
- [ ] Wächter-Skript + CI-Job, Fehlermeldung nennt das Auslagerungsziel
- [ ] Budgets so gesetzt, dass am ersten Tag nichts warnt
- [ ] Rotationsregel dokumentiert, nächste Fälligkeit notiert
