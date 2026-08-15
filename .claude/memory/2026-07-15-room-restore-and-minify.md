# Raum-Restore (Fix A + B) + app.js-Minifizierung (2026-07-14/15)

PR #21 (`1a2da08`, Fix B + Minify, v41) und PR #22 (`feb3f90`, Fix A + SW-Auto-Reload, v42).

## Der Bug

**Mobil ständig neue Räume trotz Login.** Die Raumwahl war: URL-Hash → Startup-Favorit
→ sonst **neuer Zufallsraum** (`randomRoom()`) — **nicht ans Login gekoppelt**. Die PWA
hat `start_url: "/"` (kein Hash); bei jedem iOS-PWA-Kaltstart also neuer Raum + Key.
Diese Wegwerf-Räume syncen sogar zum Server und stapeln sich dort. Desktop hält den
Hash im Tab → das Problem war nur mobil sichtbar.

## Fix B (account-autoritativ, PR #21) — allein NICHT ausreichend

In `maybeApplyStartupFavoriteFromPs` (läuft nach `/api/personal-space/me`, wenn
`psState.roomTabs` gefüllt ist): neuer Helfer `getMostRecentServerRoom(exclRoom, exclKey)`
(max `lastUsed`/`addedAt`, Auto-Raum ausgeschlossen). Wenn nur ein Wegwerf-Auto-Raum
erzeugt wurde, der Account aber Räume hat → dorthin per `location.hash` navigieren
(der hashchange-Handler schaltet um) + Wegwerf-Raum aus lokalen Tabs und vom Server
(`DELETE /api/room-tabs`) entfernen.

**Half mobil nicht**, weil es an PWA-Auth + echten Server-Räumen hängt — beides ist
auf iOS-PWA unzuverlässig.

## Fix A (lokal, robust, PR #22) — der wirksame

`readLastLocalRoomSync()` stellt bei der Raum-Initialisierung (**vor** `randomRoom`)
den zuletzt genutzten Raum aus `localStorage` wieder her (`mirror_room_tabs_v1` →
`mirror_recent_rooms`, max `lastUsed`). Synchron, ohne Login und ohne Server —
localStorage überlebt den PWA-Neustart. Zufallsraum nur noch bei leerem Speicher.

## Fallen

- **TDZ:** Die Raum-Init läuft top-level **vor** den `*_KEY`-consts → dort keine
  localStorage-Logik einbauen, und die Keys als **String-Literal** lesen, nicht über
  die Konstanten. `maybeApplyStartupFavoriteFromPs` ist der sichere Ort für alles,
  was die Konstanten braucht.
- Server `listRoomTabs` mappt `last_used` → `lastUsed` und `added_at` → `addedAt`
  (camelCase) — beim Vergleichen beachten.

## SW-Auto-Reload (PR #22, index.html)

`controllerchange` → `location.reload()`, mit Guard: nur wenn `controller` vorher
schon existierte, sonst Endlos-Loop. Damit greifen neue Deploys ohne manuelles
Nachladen — **aber erst ab v42**; wer eine ältere SW-Cache-Version hat, muss die PWA
neu installieren bzw. Website-Daten löschen.

## app.js-Minifizierung (PR #21)

esbuild als devDep, `build:js` = `esbuild app.js --minify --outfile=app.min.js &&
mv app.min.js app.js` (in-place), `npm run build` = css + js. Nur der Docker-Build
minifiziert, die Quelle bleibt unminifiziert.

**1.16 MB → 640 KB roh (−45 % Parse), 266 → 180 KB gzip.**

**MERKE:** Minified sind lokale Funktionsnamen gemangelt → im Prod-`app.js` **nicht
nach Original-Funktionsnamen grepen**. Prüfen stattdessen über **String-Literale**
(z.B. `mirror_room_tabs_v1`, CSS-Klassennamen), Zeilenzahl (~1500 = minified) und
fehlerfreien Boot ohne Konsolenfehler.
