# Die Demo und ihre Tests — ausführliche Anleitung auf Deutsch

Deutsche Fassung der erweiterten Demo-Anleitung: Full HD, Querformat, deutsche
synthetische Sprecherstimme, deutsche App-Oberfläche und eingeblendete Untertitel.
26 Kapitel erklären die Wege zu allen verfügbaren Demo-Bereichen, die Auswahl
einer Wortliste vor einem Test, alle sechs Vokabeltestarten mit echten Beispielen,
die vier Buchstabenübungen, die Testauswertung und die Fehlerwiederholung.
Die Menübedienung wird am Laptop und auf dem Handy gezeigt. Einzelne in diesem
Demo-Stand noch arabische Beschriftungen bleiben in den echten Ansichten erhalten;
die deutschen Erläuterungen und goldenen Markierungen erklären die Bedienung.

Ein goldener Rahmen markiert die jeweilige Schaltfläche oder Eingabe. Die Bilder
stammen aus der tatsächlichen, unveränderten Demo mit frischem Browser-Speicher.
Eine Antwort im Schreibtest ist absichtlich falsch, damit die Auswertung und die
Wiederholungsliste erklärt werden können. Der Sprecher benennt dieses Beispiel
ausdrücklich. Es werden keine echten Schülerdaten verwendet.

Die Demo enthält eine Auswahl von Lerninhalten. Bücher und Buchvokabeln sind
ausgeschlossen. Es gibt keine Anmeldung oder Gerätesynchronisierung; Lernstände
werden lokal im jeweiligen Browser gespeichert. Die Haupt-App bleibt unverändert.

Die ZIP enthält MP4, SRT-Untertitel, Sprechertext, ein Vorschaubild und eine Liste
der YouTube-Kapitel. Bei einer Veröffentlichung auf YouTube die Kapitel mit ihren
Zeitangaben in die Beschreibung übernehmen und die SRT-Datei als deutsche Untertitel
hochladen. Die Untertitel sind zusätzlich bereits im Video eingeblendet.

Stimme: lokal erzeugte synthetische Sprache mit Piper / Thorsten medium, keine
Aufnahme von Mahmoud Barakat. Das MODEL_CARD nennt CC0 für den Thorsten-Datensatz.
Modell: https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-thorsten-medium.tar.bz2
Datensatz: https://github.com/thorstenMueller/Thorsten-Voice
Piper: https://github.com/OHF-Voice/piper1-gpl
Die leise Musik wird aus Sinustönen erzeugt. Grafiken und Schriftdateien stammen
aus der App; Quellen und Lizenzen stehen in `images/brand/CREDITS.md` und `fonts`.

## Erneut erstellen

Die Demo-ZIP außerhalb des Repositorys entpacken und auf Port 8086 bereitstellen;
das Repository selbst auf Port 8077 bereitstellen. Weitere Voraussetzungen stehen
in `../demo-video/README.md`. Für diese Fassung einen eigenen Buildordner verwenden:

```sh
python tools/build-demo-video.py --language de --media-directory media/demo-guide-de \
  --output-stem Huroof-Demo-Anleitung --bundle-stem Huroof-Demo-Anleitung \
  --directory /tmp/huroof-demo-guide-de --model /PATH/de_DE-thorsten-medium.onnx --step audio
python tools/capture-demo-guide-ar.py --language de --media-directory media/demo-guide-de \
  --directory /tmp/huroof-demo-guide-de
python tools/build-demo-video.py --language de --media-directory media/demo-guide-de \
  --output-stem Huroof-Demo-Anleitung --bundle-stem Huroof-Demo-Anleitung \
  --directory /tmp/huroof-demo-guide-de --step render
```

Bei Änderungen an Text oder Bildern einen frischen Buildordner verwenden.
