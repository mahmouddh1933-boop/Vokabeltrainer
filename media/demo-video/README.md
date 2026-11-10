# Huroof · Demo-Werbung auf Deutsch

Motivierendes Werbevideo zur kleinen, eigenständigen Demo von **حروف من الزيتون**.
Querformat 1920 × 1080, H.264/AAC, deutsche synthetische Sprecherstimme und fest
eingeblendete Untertitel. Separate SRT-Untertitel und ein Vorschaubild liegen bei.
Für YouTube die SRT-Datei als deutsche Untertitel hochladen. Das MP4 kann auf einer
Website mit einem normalen HTML-Videoelement eingebunden werden.

Das Video zeigt echte Ansichten der Demo und stellt ihre Auswahl an Buchstaben,
Vokabeln, Übungen, Grammatik, Verben und einer Geschichte vor. Eine eigene Szene
zeigt die Nutzung am **Laptop und auf dem Handy**. Die drei Ziele werden von den
Lernenden selbst abgehakt. Lernstände bleiben lokal im jeweiligen Browser; die
Demo benötigt keine Anmeldung. Bücher und Buchvokabeln sind nicht enthalten.

Sprecher: lokal erzeugte synthetische deutsche Stimme **Piper / Thorsten medium**;
keine Aufnahme von Mahmoud Barakat. Modellquelle:
https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-thorsten-medium.tar.bz2
Das MODEL_CARD nennt CC0 für den Thorsten-Datensatz. Datensatz:
https://github.com/thorstenMueller/Thorsten-Voice
Piper: https://github.com/OHF-Voice/piper1-gpl

Die dezente Instrumentalmusik wird vom Buildskript aus Sinustönen erzeugt; es
werden keine fremden Musikaufnahmen verwendet. Grafiken und Schriftdateien
stammen aus der App; zugehörige Angaben stehen in `images/brand/CREDITS.md` und
im Ordner `fonts`.

## Erneut erstellen

Zunächst die Demo mit `tools/build-demo.py` erstellen. Den entpackten Demoordner
auf Port 8086 und das Repository für die Präsentationsvorlage auf Port 8077 lokal
bereitstellen, jeweils in einem eigenen Terminal:

```sh
python -m http.server 8086 --directory /PFAD/ZUR/DEMO --bind 127.0.0.1
python -m http.server 8077 --directory /PFAD/ZUM/REPOSITORY --bind 127.0.0.1
```

FFmpeg, Chromium, Python mit Playwright, NumPy und piper-tts installieren; das
oben genannte Sprachmodell außerhalb des Repositorys entpacken. Beispiel:

```sh
python tools/build-demo-video.py \
  --model /PFAD/de_DE-thorsten-medium.onnx \
  --demo-url http://127.0.0.1:8086 \
  --stage-url http://127.0.0.1:8077 \
  --directory /tmp/huroof-demo-video
```

`--step audio`, `--step capture` und `--step render` erlauben einzelne Schritte.
Bei Änderungen an Text, Stimme oder Bildern einen frischen Buildordner verwenden.
Die Erstellung greift auf keine Nutzerkonten oder Firebase-Daten zu.
