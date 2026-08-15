#!/usr/bin/env bash
# Prüft die Größenbudgets der Dateien, die eine KI bei JEDER Session liest.
#
# Hintergrund: Dokumentation, die unbegrenzt wächst, wird irgendwann von keinem
# Modell mehr vollständig gelesen — und veraltet dann unbemerkt. Diese Dateien
# haben deshalb ein hartes Budget. Reißt eines: auslagern, nicht kürzen.
#
# Nutzung:  scripts/check-doc-budgets.sh          (prüfen)
#           scripts/check-doc-budgets.sh --list   (nur Größen zeigen)

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

# "Pfad:Budget in KB". Bei Glob-Mustern gilt das Budget je Einzeldatei.
BUDGETS=(
	"CLAUDE.md:5"
	".github/Documentation/ARCHITECTURE.md:15"
	".claude/memory/MEMORY.md:17"
	".claude/memory/*.md:6"
)

# MEMORY.md hat sein eigenes, größeres Budget und ist vom Topic-Muster ausgenommen.
TOPIC_EXCLUDE=".claude/memory/MEMORY.md"

LIST_ONLY=0
[ "${1:-}" = "--list" ] && LIST_ONLY=1

fail=0
checked=0

check_one() {
	local file="$1" limit_kb="$2"
	[ -f "$file" ] || return 0
	local bytes limit_bytes pct
	bytes=$(wc -c <"$file" | tr -d ' ')
	limit_bytes=$((limit_kb * 1024))
	pct=$((bytes * 100 / limit_bytes))
	checked=$((checked + 1))

	if [ "$bytes" -gt "$limit_bytes" ]; then
		printf '  ✗ %-46s %6s KB / %2s KB  (%s%%)\n' \
			"$file" "$((bytes / 1024))" "$limit_kb" "$pct"
		[ "$LIST_ONLY" -eq 1 ] || fail=1
	elif [ "$pct" -ge 85 ]; then
		printf '  ! %-46s %6s KB / %2s KB  (%s%% — bald auslagern)\n' \
			"$file" "$((bytes / 1024))" "$limit_kb" "$pct"
	else
		printf '  ✓ %-46s %6s KB / %2s KB  (%s%%)\n' \
			"$file" "$((bytes / 1024))" "$limit_kb" "$pct"
	fi
}

echo "Doku-Budgets:"
for entry in "${BUDGETS[@]}"; do
	path="${entry%:*}"
	limit="${entry##*:}"
	case "$path" in
	*'*'*)
		for f in $path; do
			[ "$f" = "$TOPIC_EXCLUDE" ] && continue
			check_one "$f" "$limit"
		done
		;;
	*) check_one "$path" "$limit" ;;
	esac
done

echo
if [ "$checked" -eq 0 ]; then
	echo "Keine der budgetierten Dateien gefunden — läuft das Skript im Repo-Root?"
	exit 1
fi

if [ "$fail" -eq 1 ]; then
	cat <<'EOF'
Budget überschritten.

Diese Dateien werden bei jeder Session gelesen — sie müssen klein bleiben.
Der Fix ist AUSLAGERN, nicht kürzen:

  MEMORY.md      → Details in .claude/memory/<datum>-<thema>.md,
                   Einträge älter als ~6 Monate nach ARCHIVE-<jahr>.md
  ARCHITECTURE.md→ Detailtabellen nach .github/Documentation/FUNCTIONS.md,
                   Historisches nach DOCUMENTATION.md
  CLAUDE.md      → alles außer Regeln gehört woanders hin
EOF
	exit 1
fi

echo "Alle Budgets eingehalten."
