# Huroof – Die ausführliche App-Tour auf Deutsch

Ein neuer, ausführlicher Einführungsfilm mit deutscher synthetischer Sprecherstimme,
eingeblendeten deutschen Untertiteln und 25 Kapiteln. Der Film führt von der Auswahl
des Einstiegs bis zu einer sinnvollen eigenen Lerneinheit. Er ergänzt die früheren,
kürzeren Werbefilme und zeigt den aktuellen Funktionsstand der Anwendung.

## Fertige Dateien

- [Video als Full-HD-MP4](../../downloads/Huroof-Rundgang-DE.mp4)
- [Begleitmaterial als ZIP](../../downloads/Huroof-Rundgang-DE-Begleitmaterial.zip): SRT-Untertitel, Sprechertext, YouTube-Kapitel, Beschreibung, Vorschaubild und eine kleine Excel-Beispielliste. Das Video wird separat heruntergeladen.
- [Zeitmarken für YouTube](YouTube-Kapitel-DE.txt)
- [Untertitel](Huroof-Rundgang-DE.srt)
- [Vorschaubild](Huroof-Rundgang-DE-Vorschaubild.png)

`release.json` enthält die geprüfte Laufzeit, Dateigröße, Auflösung und SHA-256-Prüfsumme.
Das MP4 besitzt zusätzlich eingebettete Kapitel und ist für Wiedergabe im Browser vorbereitet.

## Inhalt und Grenzen

Die vier Bücher sind auf Wunsch aus der Filmführung ausgenommen.
Der Film behandelt die gewünschten Lernbereiche und die zusätzlichen Werkzeuge: Einstiegschecks,
Alphabetkarten, Schreibformen und Sonderzeichen, Vokalzeichen und Schreibfläche,
buchstabenbezogene Übungen, Buchstabentests, ähnliche Laute, Lesen und Buchstabieren,
A1–B2-Wortschatz, Lernkarten, alle sechs Vokabeltestarten, Satzbau, integrierte A1/A2-Einheiten,
Hörverstehen, Gespräche, Schreiben, Wortverbindungen, Kurzgeschichten, Grammatikpfad und Verbformen, Unterrichtsprüfungen, Fehlerwiederholung,
Fortschritt, Excel-Import, Sprach- und Hintergrundwahl, Konto, Synchronisierung, PWA,
Offline-Nutzung und private Verwaltung.

77 visuelle Schritte verbinden echte, nacheinander aufgenommene Bedienzustände mit
beschrifteten Erklärgrafiken. Es handelt sich nicht um eine durchgehende Echtzeitaufnahme.
Beispielaufgaben wurden tatsächlich bearbeitet; der Wortschatztest enthält absichtlich
einen Fehler für die anschließende Wiederholung. Ein realer lokaler Excel-Import und
ein Offline-Aufruf werden ebenfalls geprüft. Zwei kurze Audios stammen aus der App.
Die Bildschirmansichten verwenden einen eigenen temporären Browser; Produktionskonten
und Lernstände werden nicht berührt.

Konto und Synchronisierung setzen eine korrekt eingerichtete Online-Ausgabe voraus.
Die private Verwaltung wird als Beispiel mit Testdaten gezeigt. Die Gerätebegrenzung
der kostenlosen Spark-Ausgabe ist ausdrücklich als kooperativ beschrieben; sie ist
keine sichere Sperre gegen technisch geteilte Kontozugänge. Freie Sprech- und Schreibaufgaben
werden nicht als automatisch benotet dargestellt. Einstiegschecks und interne Listenregeln
sind keine amtlichen Sprachnachweise. Der Umfang einer veröffentlichten Website hängt
davon ab, welche Version dort tatsächlich bereitgestellt wurde.

## Quellen und erneutes Erstellen

`storyboard.json` enthält den bearbeitbaren deutschen Sprechertext und die Reihenfolge
der Ansichten. `VOICE-CREDITS.txt` nennt das lokale Sprachmodell und dessen Quelle.
Die Anwendung und ihre Lerninhalte werden für die Filmproduktion nicht verändert.

Benötigt werden Python mit Playwright und piper-tts, Chromium, FFmpeg und FFprobe.
Das Thorsten-medium-Modell wird aus der in den Credits genannten öffentlichen Quelle
entpackt. Die TTS-Modelle, Sprach-WAVs und Bildschirmbilder bleiben im temporären
Arbeitsordner; die Modellgewichte werden nicht mit dem Film weitergegeben.

```sh
python -m http.server 8044 --bind 127.0.0.1
python tools/capture-tour.py
python tools/build-tour-audio.py --model /PFAD/ZU/de_DE-thorsten-medium.onnx
python tools/render-tour.py --preview-only
python tools/render-tour.py
python tools/package-tour.py
```

Der Capture-Schritt lädt bei Bedarf genau die vom Projekt bereits verwendete
SheetJS-Version 0.18.5 in den temporären Ordner, um die vorhandene Excel-Funktion
auch ohne den externen CDN-Aufruf zeigen zu können. Es wird keine Bibliothek im
Produktionsprojekt ausgetauscht. Die Synthese arbeitet lokal und benötigt keine
kostenpflichtige Sprach-API.
