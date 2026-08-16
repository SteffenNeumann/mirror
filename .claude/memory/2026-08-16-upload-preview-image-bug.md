# 2026-08-16 — Hochgeladenes Bild erscheint in der Vorschau nur als Link

**Symptom:** Ein per Upload-Modal eingefügtes PNG wurde in der Markdown-Vorschau als
Link-Text angezeigt statt als Bild. Kein Code-Fix nötig — reine Analyse.

## Ursache

Im Notiztext stand `[name](/uploads/…)` statt `![name](/uploads/…)` — **Markdown-Link-
Syntax ohne führendes `!`**. Die Vorschau hat also exakt das Richtige gerendert.
Das `!` war beim Einfügen um drei Zeichen nach links verrutscht und klebte am Ende
der vorigen Zeile. Einmaliger Ausrutscher: alle anderen Bild-Uploads desselben Kontos
(3 von 3) haben korrektes `![`, PDFs korrekt `[`. Fix = das `!` an die richtige Stelle.

## Entlastet (wichtig — hier NICHT nochmal suchen)

Diese drei Verdächtigen wurden empirisch ausgeschlossen, nicht nur code-gelesen:

- **blob:-URL der Vorschau.** `updatePreview()` rendert über eine `blob:`-URL, wo
  relative Pfade normalerweise scheitern — aber es gibt ein
  `<base href="${location.origin}">` (`app.js` ~14732/14762, Commit `4c4dfaf`).
  Direktvergleich im echten iframe: mit `<base>` lädt das Bild (1680×1680), ohne
  `<base>` bleibt `src` unaufgelöst → Fehler.
- **Service Worker.** `sw.js:62` lässt `/uploads/` als network-only durch.
- **markdown-it.** Kein `image`-Rule-Override, kein Sanitizer, keine CSP,
  `sandbox` blockiert keine Bilder, `validateLink` erlaubt führende `/`.
  Die Custom-Regel `textWithPipe` (`app.js:13804`) hat `0x21` (`!`) korrekt in der
  Terminator-Liste — verschluckt `![…]` also nicht.

## Merke (Fallen für das nächste Mal)

- **Upload-URLs haben immer ein Präfix**: `server.js:3763` baut
  `${Date.now().toString(36)}-${randomHex}-${name}`. `/uploads/<originalname>` gibt
  es nie → 404. Der Uploads-Manager strippt das Präfix nur für die Anzeige.
- **`Content-Type: image/png` beweist nichts.** `mimeTypeForPath` (`server.js:1165`)
  leitet den Typ allein aus der Dateiendung ab — auch eine als
  `application/octet-stream` hochgeladene `x.png` kommt als `image/png` zurück.
- **Bild-vs-Link hängt allein an `File.type`** (`buildUploadMarkdown`, `app.js:1979`).
  Seit `05ba933` gibt `isAllowedUploadType` immer `true` zurück, ein leerer MIME
  käme also durch → Fallback `[name](url)`. Verifiziert: leerer `File.type` ergibt
  per FileReader `data:application/octet-stream;base64,…` und passiert die
  Server-Regex. Aktuell nicht die Ursache, aber eine offene Flanke.
- **Vorsicht bei Server-Antworten als „Gegenprüfung":** `res.mime` stammt aus der
  Data-URL des Clients (kein Content-Sniffing) — es ist *nicht* unabhängiger als
  `File.type`. Robuster wäre: Dateiendung schlägt generischen MIME.

## Offene Härtungspunkte (nicht umgesetzt, Stand 2026-08-16)

1. `buildUploadMarkdown`: Endung soll generischen MIME überschreiben; Alt-Text
   escapen (`]`/`[`/`\` brechen sonst das Markdown); `.pdf`/`.heic` bewusst
   ausnehmen; Video (Zeile 1986) erzeugt heute `<img src="…mp4">` — kaputt.
2. `insertTextAtCursor` (`app.js:3053`) liest `selectionStart` erst **nach** zwei
   `await`s (Datei lesen + Upload-Request) — Caret kann veraltet sein.
3. **Upload-Endpunkte: Auth + Typprüfung.** Details bewusst nicht hier, sondern in
   `local.md` — das Repo ist öffentlich.

## Vorgehen

Drei parallele Agenten (Einfüge-Pfad / Render-Pfad / Prod-Verifikation) plus ein
vierter, der die Diagnose adversarisch widerlegen sollte. Der Gegenprüfer hat den
entscheidenden Detailbefund geliefert (verirrtes `!` drei Zeichen davor) und einen
Fehler in meiner ersten Fix-Idee korrigiert. Hat sich gelohnt.
