# Jisr · Arabisch lernen

Ein deutsch-arabischer Vokabeltrainer mit einem neuen responsiven Design: Lern-Dashboard, A1/A2-Lernpfad, Lernkarten, Alphabet, sechs Testarten, einen interaktiven Kurs zur Verbkonjugation, Fehlerwiederholung und persönlicher Fortschritt. Die Oberfläche unterstützt Deutsch und Arabisch einschließlich Rechts-nach-links-Darstellung.

## Fertige Version herunterladen

[Modernisierten Vokabeltrainer als ZIP herunterladen](https://github.com/mahmouddh1933-boop/Vokabeltrainer/raw/refs/heads/main/downloads/Vokabeltrainer-modern.zip). Entpacken und `index.html` im Browser öffnen oder den lokalen Server wie unten starten.

## Lokal starten

Im Repository-Verzeichnis:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

`index.html` ist der Einstieg. Die App verwendet HTML, CSS und JavaScript ohne Build-Schritt, Paketinstallation, Datenbank oder Zugangsdaten. Lernstände werden im Browser in `localStorage` gespeichert.

- `css/modern.css`: Farben, Typografie, Seitenlayouts und responsive Darstellung.
- `js/design.js`: gemeinsame Navigation, mobiles Menü und neue zweisprachige Oberfläche.
- `js/pages/`: Lern- und Testfunktionen.
- `data/`: 20 vorgefertigte Wortlisten.
- `fonts/`: lokal eingebundene Manrope-Schrift unter der SIL Open Font License.

Die Original-ZIP-Datei bleibt als unveränderte Ausgangsversion erhalten. Die aktuelle, bearbeitbare Anwendung besteht aus den direkt im Repository liegenden Quelldateien. Hinweise der ursprünglichen Version stehen in `docs/ORIGINAL.md`.

## الحروف والقواعد · Alphabet und Grammatik

Die Rückseite jeder Buchstabenkarte enthält vier echte Beispielwörter für Anfang, Mitte, getrenntes und verbundenes Wortende. Insgesamt gibt es 112 Beispiele. Der Zielbuchstabe ist innerhalb des unveränderten Wortes farbig markiert; dasselbe gilt für das Wort auf der Vorderseite. Vor jedem getrennten Endbuchstaben steht ein Buchstabe aus ا، د، ذ، ر، ز، و (einschließlich Alif mit Hamza). Bei den sechs Buchstaben, die sich nicht nach links verbinden, erklärt die Karte die tatsächliche mittlere Schreibform.

### تدريبات الحروف والصوت · Buchstabenübungen und Audio

`huruf.html` zeigt zuerst die Lernkarte, direkt darunter die vier Schaltflächen (zurück, Buchstaben anhören, Wort anhören, weiter), danach Vokalzeichen und Aussprache sowie die Schreibfläche. Anschließend folgen drei Übungen für genau den Buchstaben auf der Karte:

- **Formen und Positionen:** 24 Fragen zu 12 echten Wörtern. Die Form wird nach der Verbindung mit den Nachbarbuchstaben bestimmt; die Position (Anfang, Mitte, Ende) wird separat geübt. Nicht verbindende Buchstaben haben nur zwei mögliche Verbindungsformen.
- **Fehlender Buchstabe:** 12 Wörter mit einer Lücke an der Stelle des ausgewählten Buchstabens.
- **Buchstaben einkreisen:** 12 Suchfelder mit je 16 Zeichen. Alle Vorkommen des Zielbuchstabens werden durch Antippen eingekreist; erneutes Antippen entfernt den Kreis. Eine eigene Prüftaste wertet die Auswahl aus. Grüne Kreise markieren die richtigen Zeichen, gestrichelte Kreise übersehene Treffer und rote Kreise falsch ausgewählte Zeichen.

Damit stehen 48 Fragen/Suchfelder pro Buchstabe und insgesamt 1.344 Aufgaben für die 28 Karten bereit. Ein Buchstabenwechsel aktualisiert Überschrift, Beispiele und Aufgaben. Für jede Kombination aus Buchstabe und Übungsart bleiben Antworten, noch nicht geprüfte Kreise und Fortschritt innerhalb derselben geöffneten Seite erhalten, auch beim Sprachwechsel. Ergebnis, Antwortdurchsicht und neue Runden sind verfügbar.

Wörter und Aufgaben: `js/letter-focused-data.js`. Oberfläche: `js/pages/letters-focused.js`, `css/letters-focused.css`. Die 12 Wortbeispiele pro Buchstabe enthalten die vier bisherigen Kartenbeispiele und acht zusätzliche Wörter.

Der Link **„تدريبات عامة لجميع الحروف / Gemischte Übungen für alle Buchstaben“** darunter führt weiterhin zu `letter-tests.html`. Diese Seite ist außerdem über die Navigation erreichbar. Vier gemischte Übungsarten decken jeweils alle 28 Buchstaben ab:

1. `#names`: den Buchstaben zu seinem Namen auswählen.
2. `#forms`: Anfangs-, Mittel- und Endformen erkennen, einschließlich nicht verbindender Buchstaben.
3. `#missing`: den fehlenden Buchstaben in einem echten Wort ergänzen; die Bedeutung hilft bei der Zuordnung.
4. `#listening`: den arabischen Buchstabennamen anhören und das Zeichen auswählen.

Jede Runde hat 28 Fragen mit vier Antworten, sofortiger Erklärung und einem farbig markierten Wortbeispiel. Fortschrittsbalken, Rücknavigation, Ergebnis, Antwortdurchsicht und neue Runden sind verfügbar. Der Übungsstand bleibt beim Wechsel der Sprache oder Übungsart innerhalb derselben geöffneten Seite erhalten. Alle vier Übungen funktionieren unabhängig von den Vokabellisten und deren Statistik.

Die App enthält 168 synthetisierte MP3-Dateien in `audio/letters/`: Buchstabennamen, Beispielwörter und vier Vokal-/Sukunformen pro Buchstabe. Diese Audiodateien funktionieren ohne Internet oder installierte arabische Stimme und werden direkt durch Antippen abgespielt. Deshalb immer die **gesamte ZIP-Datei entpacken**, einschließlich des Audioordners. Bei anderem Text versucht die App zuerst die arabische Gerätestimme und danach Online-TTS. Eine Wiedergabesicherung des Browsers wird mit einer Aufforderung zum erneuten Antippen angezeigt. Details zur Herkunft stehen in `audio/README.md`.

Gemeinsame Buchstabendaten und Audiodateizuordnung: `js/letter-data.js`. Aufgaben: `js/letter-training-data.js`. Oberfläche: `js/pages/letter-training.js`, `css/letter-training.css`. Die Wortbeispiele bleiben in `js/letter-examples.js`.

### قواعد العربية · Grammatik

`grammar.html` bietet 20 Lektionen mit deutsch-arabischem Sprachwechsel und insgesamt 240 Übungsfragen (12 pro Lektion). Die fünf bisherigen Lektionen haben jeweils acht zusätzliche Fragen erhalten:

- `#sun-moon`: Sonnen- und Mondbuchstaben, vollständige Buchstabenlisten und Aussprachebeispiele.
- `#pronouns`: selbstständige Personalpronomen, Dualformen und angehängte Possessivpronomen.
- `#gender`: maskuline/feminine Nomen, Adjektive, Demonstrativpronomen und wichtige Ausnahmen.
- `#number`: Singular, Dual, regelmäßige und gebrochene Plurale sowie nichtmenschliche Plurale.
- `#basic-verbs`: zwölf Alltagsverben mit Perfekt, Präsens, Bedeutung und Beispielsätzen.

Neu hinzugekommen sind 15 Themen:

- Rechtschreibung: `#hamza-initial` (Qaṭʿ und Waṣl), `#hamza-medial` und `#hamza-final`.
- Wortbildung: `#active-participle`, `#passive-participle`, `#instrument-noun` und `#intensive-participle`.
- Grundlagen und Satzbau: `#word-classes`, `#sentence-types`, `#five-verbs`, `#five-nouns`, `#relative-pronouns`, `#prepositions`, `#defective-verbs` (Kāna) und `#inna-particles`.

Die Lektionen erklären Regeln, Bedingungen und wichtige Ausnahmen mit farbig markierten Beispielen. Eine Suche auf Arabisch oder Deutsch und die Bereiche Grundlagen, Rechtschreibung, Wortbildung und Satzbau filtern den Katalog. Über die Lektionsauswahl oder den aufklappbaren Index sind alle Themen erreichbar; direkte Links mit Themen-ID bleiben möglich.

Richtige und falsche Antworten erhalten eine Erklärung. Ein Fortschrittsbalken zeigt die beantworteten Fragen; die vorherige Frage kann zur Wiederholung aufgerufen werden. Antworten und Ergebnis bleiben beim Wechsel zwischen Themen und Sprachen innerhalb derselben geöffneten Seite erhalten. Nach der zwölften Frage kann die jeweilige Übung neu begonnen werden. Die Vokabeltest-Statistik bleibt davon unabhängig.

Inhalte: `js/letter-examples.js`, `js/grammar-data.js` und `js/grammar-expanded.js`. Oberflächen: `js/pages/letters-learning.js`, `js/pages/grammar.js`, `css/grammar.css`. In der Grammatikseite muss `grammar-expanded.js` vor `grammar-data.js` geladen werden.

## تصريف الأفعال · Verben lernen

`verbs.html` ist über das Dashboard und die Navigation erreichbar. Der Kurs enthält 48 Verben mit Perfekt, Präsens (Indikativ) und Imperativ, Beispielsätzen, deutschen Übersetzungen und Quiz. Im Perfekt und Präsens werden jeweils 14 Personen-/Geschlechtsformen gezeigt. Der Imperativ hat fünf unterschiedliche Formen für die angesprochenen Personen: أنتَ، أنتِ، أنتما، أنتم، أنتنّ. Es werden keine Imperativformen für „ich“ oder „er/sie“ erzeugt.

Eine Suche auf Arabisch oder Deutsch ignoriert Vokalzeichen sowie Alif-/Hamza-Varianten. Die Auswahl gruppiert regelmäßige Verben, Verben mit Hamza und schwache Verben. Zusätzlich lässt sich nach drei, vier, fünf oder sechs Buchstaben der Perfektform filtern. Suche und Längenfilter sind kombinierbar. Ohne Treffer werden eine Meldung und eine Schaltfläche zum Zurücksetzen angezeigt. Sprachwechsel erhält Auswahl, Suchbegriff und Übungsstand.

Der Katalog enthält neben regelmäßigen Verben unter anderem أكل، أخذ، قال، نام، قرأ und وقف. Diese sechs Verben haben ausdrücklich hinterlegte vollständige Paradigmen, einschließlich Änderungen des Stamms und der Hamza-Schreibung. Beispiele: آكل، قلتُ، نمتُ، يقرؤون، كُلْ، خُذْ، قُلْ، نَمْ، قِفْ. Farbige Vorsilben und Endungen werden nur getrennt, wenn das Schriftbild dies zulässt. Die fünf Imperativformen werden auch bei der Erzeugung der Quizantworten berücksichtigt. Der Übungszähler gilt für die aktuelle Sitzung und bleibt unabhängig von den Vokabeltests.

Die 18 neuen Verben umfassen je sechs vier-, fünf- und sechsbuchstabige Perfektformen, etwa علّم، أكرم، دحرج، تعلّم، اجتمع، تدحرج، استخدم und استخرج. Die Einordnung zählt Schadda als zwei Konsonanten und unterscheidet ausdrücklich Formlänge und Wurzellänge: علّم ist ein erweitertes dreiradikaliges Verb, دحرج ein vierwurzeliges Grundverb. Muster und Wurzel werden bei diesen Verben angezeigt. Präsensvorsilben erhalten je nach Stamm Fatḥa oder Ḍamma; alle drei Zeit-/Befehlsformen besitzen die passenden Personenendungen.

Daten und Konjugationsregeln: `js/verb-data.js`. Oberfläche: `js/pages/verbs.js`, `css/verbs.css`.

## Funktionstest

Voraussetzungen: Python, Playwright für Python und Chromium unter `/usr/bin/chromium`. Bei laufendem Server:

```sh
python3 tests/smoke.py
node --test tests/*.test.js
python3 tests/verbs-smoke.py
python3 tests/foundations-smoke.py
python3 tests/letter-training-smoke.py
python3 tests/letters-focused-smoke.py
```

Die Tests prüfen alle 144 Konjugationstabellen der 48 Verben, Suche, Längenfilter und Imperativübungen sowie alle 240 Grammatikfragen, Themenfilter, Antworterklärungen, Rücknavigation, Zurücksetzen und Sprachwahl, Wortlisten, Lernkarten, einen vollständig beantworteten Multiple-Choice-Test, persistierte Ergebnisse, Statistiken, Excel-Import, den Sprachwechsel in beide Richtungen, mobile Navigation und die Lernseiten bei unterschiedlichen Bildschirmbreiten.

Excel-Import lädt XLSX 0.18.5 über `cdn.jsdelivr.net`. Wenn der Testbrowser den Cloud-HTTPS-Proxy nicht kennt, kann ausschließlich für den Funktionstest dieselbe Bibliothek mit aktiver TLS-Prüfung heruntergeladen und lokal bereitgestellt werden:

```sh
curl --fail --location --show-error https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js -o /tmp/jisr-xlsx.js
python3 tests/smoke.py --xlsx-js /tmp/jisr-xlsx.js
```

Die Option ersetzt im Test nur den Abruf der angegebenen Bibliothek und ändert keine Zertifikatsprüfung oder Anwendungseinstellungen. Der Test `letters-focused-smoke.py` prüft die Bindung aller 28 Karten an ihre drei Übungen, die Seitenreihenfolge, vollständige Runden für Bā und Dāl, Auswahl und Korrektur der Kreise, Ergebnisse, Wiederholung, pro Buchstabe getrennte Lernstände, Sprachwechsel und Bildschirmgrößen. Die Unit-Tests validieren alle 1.344 Aufgaben sowie die Verbindungen und Wortpositionen.

Der zusätzliche gemischte Buchstabentest prüft alle 112 Fragen, Korrekturen, Sprachwechsel, Ergebnis, Durchsicht und Neustart in einer mobilen Chrome-Emulation. Er prüft außerdem die tatsächliche MP3-Wiedergabe durch Touch-Eingaben bei blockierten externen Anfragen. Die Unit-Tests prüfen unter anderem den direkten Gerätestimmen-Aufruf, verzögert verfügbare Stimmen, gesperrte Wiedergabe, Fallbacks und den Abbruch veralteter Anfragen. Ein Test auf einem physischen Android-Gerät wurde in der Cloud nicht durchgeführt.

Online-Aussprache für sonstigen Text benötigt Zugriff auf `translate.google.com` bzw. `translate.googleapis.com`; ihre Verfügbarkeit hängt vom externen Dienst ab.
