# Zwei eigenständige App-Demos

- [Huroof Start Demo herunterladen](../downloads/Huroof-Start-Demo.zip)
- [Huroof A1/A2 Demo herunterladen](../downloads/Huroof-A1-A2-Demo.zip)

Die Demos sind vollständige interaktive Vorschauen der aktuellen Lernbereiche. Start enthält die 28 Buchstaben, Schreib- und Lautübungen, Lesen, Lesetrainer und Leseaktivitäten. A1/A2 enthält den aktuellen Wortschatz, die sechs Testarten, Sätze, Geschichten, Einheiten, Grammatik und den eigenen Bereich für Verbformen. Die vorhandenen arabischen und deutschen Oberflächen und lokalen Aufnahmen bleiben erhalten.

Es gibt keine Anmeldung, Schülerverwaltung oder Cloud-Synchronisierung. Die Firebase-Konfiguration und SDK-Dateien sind entfernt. Jede Demo speichert ihre Lernstände unter einem eigenen Namensraum `huroofDemoV1:<app>` auf dem Gerät. „Demo neu starten“ löscht nur die Lernstände dieser Demo; Produktionsdaten bleiben erhalten. Auf derselben Domain können Sprache und Gestaltung gemeinsam genutzt werden. Wenn der Browser lokalen Speicher verweigert, zeigt die Demo das an: Lernstände bleiben dann nur bis zum Seitenwechsel verfügbar.

## Auf dem Computer ausprobieren

ZIP vollständig entpacken und `index.html` im enthaltenen Demo-Ordner öffnen. Für die Installation als PWA und eine zuverlässig auf dem Smartphone erreichbare Adresse die Demo auf einem HTTPS-Hosting bereitstellen.

## Neben der vollständigen Firebase-App veröffentlichen

Die Demo-Dateien werden in das **passende vollständige Firebase-Ready-Paket** eingefügt:

1. Im `public`-Ordner des vollständigen Pakets einen Unterordner `demo` anlegen.
2. Alle Dateien und Unterordner der passenden entpackten Demo dort hineinkopieren. Danach muss `public/demo/index.html` existieren.
3. Im vollständigen Paket neben `firebase.json` ausführen:

```powershell
node deploy-firebase.cjs
```

Danach ist die Start-Demo unter `https://huroof-start-e3250.web.app/demo/` und die A1/A2-Demo unter `https://huroof-a1-a2.web.app/demo/` erreichbar. Diese Adressen funktionieren erst nach diesem Upload. Die Demo selbst enthält bewusst keine eigenständige Firebase-Deploy-Konfiguration. Die vorhandene Vollversion bleibt im `public`-Hauptordner.

## Reproduzierbar bauen und prüfen

```sh
python3 tools/build-suite.py --directory firebase-public --hosting
python3 tools/build-edition-demos.py --archives
python3 tests/edition-demos-smoke.py
```

Der Browser-Test prüft beide ZIPs und PWA-Prüfsummen, die Seiten, Übungen, lokale Audiowiedergabe, Deutsch/Arabisch, Bildschirmbreiten von 320 bis 1280 Pixeln, Speichertrennung und Zurücksetzen. Zusätzliche Durchläufe prüfen eingebettete Skripte bei blockierten externen JS/CSS-Anfragen und verweigerten Browser-Speicher. Es werden keine echten Konten angelegt oder Produktionsdaten geschrieben.
