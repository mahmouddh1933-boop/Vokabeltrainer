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

## الحروف وأساسيات العربية · Alphabet und Grundlagen

Die Rückseite jeder Buchstabenkarte enthält vier echte Beispielwörter für Anfang, Mitte, getrenntes und verbundenes Wortende. Insgesamt gibt es 112 Beispiele. Der Zielbuchstabe ist innerhalb des unveränderten Wortes farbig markiert; dasselbe gilt für das Wort auf der Vorderseite. Vor jedem getrennten Endbuchstaben steht ein Buchstabe aus ا، د، ذ، ر، ز، و (einschließlich Alif mit Hamza). Bei den sechs Buchstaben, die sich nicht nach links verbinden, erklärt die Karte die tatsächliche mittlere Schreibform.

`grammar.html` bietet fünf Lektionen mit deutsch-arabischem Sprachwechsel und insgesamt 20 Übungsfragen:

- `#sun-moon`: Sonnen- und Mondbuchstaben, vollständige Buchstabenlisten und Aussprachebeispiele.
- `#pronouns`: selbstständige Personalpronomen, Dualformen und angehängte Possessivpronomen.
- `#gender`: maskuline/feminine Nomen, Adjektive, Demonstrativpronomen und wichtige Ausnahmen.
- `#number`: Singular, Dual, regelmäßige und gebrochene Plurale sowie nichtmenschliche Plurale.
- `#basic-verbs`: zwölf Alltagsverben mit Perfekt, Präsens, Bedeutung und Beispielsätzen.

Richtige und falsche Antworten erhalten eine Erklärung. Der Fortschritt jeder Übung bleibt beim Wechsel zwischen Themen und Sprachen innerhalb derselben geöffneten Seite erhalten. Nach dem letzten der vier Fragen kann die jeweilige Übung neu begonnen werden. Die Vokabeltest-Statistik bleibt davon unabhängig.

Inhalte: `js/letter-examples.js`, `js/grammar-data.js`. Oberflächen: `js/pages/letters-learning.js`, `js/pages/grammar.js`, `css/grammar.css`.

## تصريف الأفعال · Verben lernen

`verbs.html` ist über das Dashboard und die Navigation erreichbar. Die Lektion erklärt Vergangenheit und Gegenwart (Indikativ) anhand von sechs regelmäßigen dreiradikaligen Verben: كتب، درس، فتح، شرب، لعب، سمع. Ein interaktiver Konjugationstisch zeigt alle 14 Personen-/Geschlechtsformen mit markierten Vorsilben und Endungen, Beispielsätzen und deutschen Übersetzungen. Ein Quiz zum gewählten Verb und Tempus liefert sofortige Rückmeldung. Der Übungszähler gilt für die aktuelle Sitzung und ist unabhängig von den Vokabeltests.

Daten und Konjugationsregeln: `js/verb-data.js`. Oberfläche: `js/pages/verbs.js`, `css/verbs.css`.

## Funktionstest

Voraussetzungen: Python, Playwright für Python und Chromium unter `/usr/bin/chromium`. Bei laufendem Server:

```sh
python3 tests/smoke.py
node --test tests/*.test.js
python3 tests/verbs-smoke.py
python3 tests/foundations-smoke.py
```

Der Test prüft Sprachwahl, Wortlisten, Lernkarten, einen vollständig beantworteten Multiple-Choice-Test, persistierte Ergebnisse, Statistiken, Excel-Import, den Sprachwechsel in beide Richtungen, mobile Navigation und die Lernseiten bei unterschiedlichen Bildschirmbreiten.

Excel-Import lädt XLSX 0.18.5 über `cdn.jsdelivr.net`. Wenn der Testbrowser den Cloud-HTTPS-Proxy nicht kennt, kann ausschließlich für den Funktionstest dieselbe Bibliothek mit aktiver TLS-Prüfung heruntergeladen und lokal bereitgestellt werden:

```sh
curl --fail --location --show-error https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js -o /tmp/jisr-xlsx.js
python3 tests/smoke.py --xlsx-js /tmp/jisr-xlsx.js
```

Die Option ersetzt im Test nur den Abruf der angegebenen Bibliothek und ändert keine Zertifikatsprüfung oder Anwendungseinstellungen. Online-Aussprache benötigt Zugriff auf `translate.google.com` bzw. `translate.googleapis.com`; ihre Verfügbarkeit hängt vom externen Dienst ab.
