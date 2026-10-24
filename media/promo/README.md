# Huroof · Werbevideos / فيديوهات تعريفية

Zwei eigenständige Werbefilme auf Deutsch und Arabisch, jeweils als Full-HD-MP4 im Querformat. Die Videos verbinden echte App-Bedienabläufe mit eingeblendeten Funktionsbeschreibungen, zeitlich passenden Untertiteln, synthetischer Sprecherstimme und einem eigens generierten leisen Musikmotiv.

Die Filme stellen alle Hauptbereiche vor: Lernpfad, Buchstaben und Schreibfläche, Buchstabenübungen und ähnliche Laute, Lesen und Buchstabieren, A1–B2-Wortschatz, sechs Vokabeltestarten, Satzbau, Geschichten, vier Bücher, Grammatik und Verbformen, Einstiegschecks, Unterrichtstests, Fehlerwiederholung und Fortschritt. Sprachwahl, Hintergrundgestaltung, Excel-Import sowie die unterschiedlichen Speichermöglichkeiten der Online- und Offline-Version werden ebenfalls erläutert.

Die Einführungstests liefern Lernempfehlungen. Im Film werden keine amtlichen Sprachzertifikate oder garantierten Lernergebnisse versprochen. Für die Aufnahmen wird ein eigener temporärer Browser mit einem tatsächlich bearbeiteten Beispieltest verwendet.

## Fertige Dateien

- [Deutsches Video](../../downloads/Huroof-Werbung-DE.mp4)
- [Arabisches Video](../../downloads/Huroof-Werbung-AR.mp4)
- [Komplettpaket: Videos, SRT-Untertitel, Vorschaubilder, Sprechertexte und Kapitel](../../downloads/Huroof-Werbevideos-DE-AR.zip)

Die Untertitel sind bereits in den MP4-Filmen eingeblendet; die zusätzlichen SRT-Dateien dienen zur Bearbeitung. `release.json` enthält Laufzeiten, Größen und SHA-256-Prüfsummen der Filme.

## Bearbeiten und erneut erstellen

`storyboard.json` enthält alle Titel, Merkmale und Sprechertexte. Die App selbst wird durch die Produktion nicht verändert. Die Bildwelt verwendet die vorhandenen Olivenmotive und Schriftdateien der App. Die verwendeten Schriftlizenzen liegen in `fonts/`.

Erforderlich: Python mit Playwright und NumPy, Chromium, FFmpeg/FFprobe. Playwright benötigt außerdem einen verfügbaren FFmpeg-Recorder (`python -m playwright install ffmpeg`). Die Sprachdateien werden zum Erstellen über Google Translate TTS bezogen und unter `/tmp/olive-promo-build/voice/` zwischengespeichert.

```sh
python3 -m http.server 8040 --bind 127.0.0.1
python3 tools/build-promo-audio.py
python3 tools/record-promo.py --language de --preview
python3 tools/record-promo.py --language ar --preview
python3 tools/record-promo.py --language de
python3 tools/record-promo.py --language ar
python3 tools/render-promo.py --language de
python3 tools/render-promo.py --language ar
python3 tools/package-promo.py
```

Die Aufnahmen werden nur nach einer fehlerfreien Vorschau für die Veröffentlichung gerendert. Zusätzlich werden Format, Laufzeit, Decoder-Kompatibilität, Tonpegel, Untertitel-Grenzen und Archivinhalt geprüft. Konten und Synchronisierung werden als Funktionen der Online-Version beschrieben; die Lernaufnahmen benötigen keine Anmeldung.
