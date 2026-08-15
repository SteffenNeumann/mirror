# Geräte-Anzeige in Presence + Präsenz auf Mobil wieder sichtbar (2026-08-11)

PR #25, `c2a6f2f`, SW v43, `app.js?v` `2026-08-11-01`.

## Ausgangslage

User meinte, eine „auf welchem Gerät bin ich aktiv"-Anzeige sei entfernt worden.
**Git-Historie über alle Branches, dangling Commits und PRs #1–24 geprüft: hat es
NIE gegeben.** Der Eindruck entstand durch zwei unabhängige Regressionen.

## Ursachen

1. **Presence auf Mobil seit Januar unsichtbar.** `035b333` (2026-01-20) setzte
   `headerCollapsed = isMobileViewport()`. `setHeaderCollapsed()` versteckt alle
   `[data-header-detail="true"]` — und `#presenceSummary` / `#presenceList` liegen
   genau darin. Dazu hatte `#toggleHeader` `opacity-0` + `group-hover` ohne
   Touch-Fallback → auf Mobil praktisch unauffindbar, Zustand nicht persistiert.
2. **Alle Geräte sahen gleich aus.** `earlyIdentitySync` (`3bdfec7`) lädt die
   kontobezogene Identität → identische Chips auf jedem Gerät.

## Fix

- `detectDeviceKind()` (mobile / tablet / desktop) + neues Feld `device`
- `#presenceCompact` **außerhalb** des Detail-Containers platziert
- `mirror_header_collapsed_v1` in localStorage, `@media (hover:none)` für den Toggle
- Inline-SVG-Icons pro Gerätetyp

## MERKE

1. **Presence-Objekte werden ZWEIMAL feldweise neu gebaut** (einmal Server, einmal
   Client) → ein neues Feld muss durch **4 Whitelists**: hello-Payload (3 Sendestellen)
   → `server.js` hello-Handler → `presence_state`-Handler → `updatePresenceUI`.
   Wird eine vergessen, verschwindet das Feld still.
2. **Tablet-Erkennung MUSS vor `userAgentData.mobile` laufen** — iPadOS 13+ meldet
   `Macintosh` und verrät sich nur über `maxTouchPoints > 1`.
3. **Touch + schmaler Viewport als Fallback braucht Desktop-OS-Ausschluss**
   (`windows nt|x11|cros`), sonst gilt ein Windows-Touch-Notebook in Firefox als Handy.
4. **`applyUiLanguage()` erfasst imperativ gebaute UI nicht** → `updatePresenceUI()`
   dort explizit aufrufen.
