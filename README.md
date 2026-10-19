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

Mehrdeutige Bildwörter besitzen ausdrücklich vokalisierte Aussprachen, etwa **جَمَل** (Kamel) und **ذُرَة** (Mais). Sukun wird mit einem vorausgehenden Laut vorgespielt, beispielsweise **أَبْ**; das jeweilige Hörbeispiel steht unter den Vokalzeichen. Die Rumman-Karte zeigt einen Granatapfel mit sichtbaren Kernen.

## Hören, Sätze bilden und Kurzgeschichten

Die Startseite und die Seitenleiste führen zu drei zusätzlichen Lernbereichen mit arabischer und deutscher Oberfläche:

- `sounds.html`: sechs Lautkontraste (ت/ط، س/ص، د/ض، ذ/ظ، ح/ه، ق/ك), 36 Hörfragen, einzeln auswählbare Lautpaare und Vergleichsbeispiele. Antworten werden nach dem Antippen von „Anhören“ freigegeben; anschließend erscheinen richtige Antwort, Bedeutung und Aussprachehinweis.
- `sentences.html`: 24 Satzbauaufgaben, jeweils zwölf auf A1 und A2. Wörter werden durch Antippen eingesetzt und wieder entfernt. Erste Wortvorgabe, Korrektur, Grammatikhinweise und Hörlösung helfen beim Lernen. Drei Aufgaben formen Singularsätze in Plural beziehungsweise Dual um. Häufige korrekte Varianten mit vorangestelltem Objekt werden ebenfalls akzeptiert. Tipps zählen nicht als Erfolg beim ersten Versuch.
- `stories.html`: sechs illustrierte Alltagsgeschichten mit je sechs gesprochenen Sätzen, vier Worterklärungen und vier Verständnisfragen. Deutsche Übersetzungen sind einblendbar. Die Rückmeldung markiert den passenden Beleg im Text. Geschichten lassen sich nach A1/A2 filtern.

Die 120 zusätzlichen MP3-Dateien in `audio/practice/` funktionieren ohne externe Sprachdienste. Zusammen mit den Buchstabenclips sind 288 MP3-Dateien enthalten. Alle Stimmen sind synthetisch; eine menschliche phonetische Abnahme ist nicht erfolgt. Herkunft und verwendete Texte stehen in `audio/practice-manifest.json`. Die sechs Illustrationen werden als Bildraster in `images/stories/scenes.png` mitgeliefert.

Antworten, aktuelle Aufgaben und Einstellungen dieser Bereiche werden lokal im Browser unter `jisrPracticeV1:*` gespeichert. Ein Neustart setzt nur die ausgewählte Übung beziehungsweise Geschichte zurück. Die vorhandenen Vokabeltestergebnisse bleiben unabhängig davon. Daten: `js/practice-data.js`; gemeinsames Verhalten: `js/practice-core.js`; Oberfläche: `css/practice.css` und `js/pages/{sounds,sentences,stories}.js`.

Vokabel- und Buchstabenkarten besitzen direkt unter der Karte eine eigene Navigation mit großen Vor-/Zurück-Schaltflächen, Richtungszeichen und aktuellem Kartenstand. Die vorhandenen Bedienelemente behalten ihre IDs und funktionieren mit Tastatur und Touch.

Gemeinsame Buchstabendaten und Audiodateizuordnung: `js/letter-data.js`. Aufgaben: `js/letter-training-data.js`. Oberfläche: `js/pages/letter-training.js`, `css/letter-training.css`. Die Wortbeispiele bleiben in `js/letter-examples.js`.

### قواعد العربية · Grammatik

`grammar.html` bietet 30 Lektionen mit deutsch-arabischem Sprachwechsel und insgesamt 380 Übungsfragen. Die bisherigen 20 Lektionen enthalten je 12 Fragen; die neuen Themen haben je 12, das Präsens 24 sowie Perfekt und Imperativ je 16 Fragen. Fünf Grundlagenthemen sind:

- `#sun-moon`: Sonnen- und Mondbuchstaben, vollständige Buchstabenlisten und Aussprachebeispiele.
- `#pronouns`: selbstständige Personalpronomen, Dualformen und angehängte Possessivpronomen.
- `#gender`: maskuline/feminine Nomen, Adjektive, Demonstrativpronomen und wichtige Ausnahmen.
- `#number`: Singular, Dual, regelmäßige und gebrochene Plurale sowie nichtmenschliche Plurale.
- `#basic-verbs`: zwölf Alltagsverben mit Perfekt, Präsens, Bedeutung und Beispielsätzen.

Weitere 15 Themen:

- Rechtschreibung: `#hamza-initial` (Qaṭʿ und Waṣl), `#hamza-medial` und `#hamza-final`.
- Wortbildung: `#active-participle`, `#passive-participle`, `#instrument-noun` und `#intensive-participle`.
- Grundlagen und Satzbau: `#word-classes`, `#sentence-types`, `#five-verbs`, `#five-nouns`, `#relative-pronouns`, `#prepositions`, `#defective-verbs` (Kāna) und `#inna-particles`.

Zehn weitere Lektionen behandeln:

- `#numerals`: Genusübereinstimmung und Gegenpolung, elf bis neunzehn, Zehner, zusammengesetzte Zahlen, hundert/tausend, Tamyīz und Zahlenflexion.
- `#present-inflection`: Indikativ, Subjunktiv, Jussiv, sichtbare und geschätzte Endungen, schwache Verben, die fünf Formen, verborgenes an, feminine und bekräftigende Nūn-Endungen sowie der Modusplatz gebauter Formen (24 Fragen).
- `#past-construction`: Bau des Perfekts auf Fatḥa, Sukūn oder Ḍamma; Subjektpronomen und Femininmarker, schwache Endungen und syntaktischer Modusplatz (16 Fragen).
- `#imperative-construction`: Bau auf Sukūn, Wegfall des schwachen Endradikals oder Nūn sowie Fatḥa; Abgrenzung zu Befehls-lām und verbietendem lā (16 Fragen).
- `#adjectival-attribute`: echte und indirekte Attribute, Kongruenz, Attributsätze und Abgrenzung zum Prädikat.
- `#idafa`: Kasus beider Glieder, Bestimmtheit, Wegfall von Tanwīn und Nūn, Pronomen und nachgestellte Attribute.
- `#purpose-object` und `#absolute-object`: Grund-Akkusativ und seine Bedingungen gegenüber Bekräftigung, Art, Häufigkeit und Stellvertretern des Verbalnomens.
- `#apposition`: identischer Badal, Teil-Ganzes, zugehörige Eigenschaft und korrigierende Apposition mit Kasus und Rückverweis.
- `#demonstratives`: Nähe/Ferne, Singular/Dual/Plural, nichtmenschliche Plurale, Kasus und Ortsdemonstrativa.

Der letzte Abschnitt von `#relative-pronouns` erklärt die Ṣila und den Rückverweis nun ausdrücklich. Drei Beispiele zeigen allaḏī, man und mā mit vollständiger Erläuterung: Ṣila **qaraʾtuhu**, angehängtes Objektpronomen **-hu** oder implizites Subjekt als Rückverweis. Zwei Übungsfragen prüfen die Unterscheidung zwischen Relativpronomen, ganzem Relativsatz und rückverweisendem Pronomen.

Die Lektionen erklären Regeln, Bedingungen und wichtige Ausnahmen mit farbig markierten Beispielen. Eine Suche auf Arabisch oder Deutsch und die Bereiche Grundlagen, Rechtschreibung, Wortbildung und Satzbau filtern den Katalog. Über die Lektionsauswahl oder den aufklappbaren Index sind alle Themen erreichbar; direkte Links mit Themen-ID bleiben möglich.

Richtige und falsche Antworten erhalten eine Erklärung. Ein Fortschrittsbalken zeigt die beantworteten Fragen; die vorherige Frage kann zur Wiederholung aufgerufen werden. Antworten und Ergebnis bleiben beim Wechsel zwischen Themen und Sprachen innerhalb derselben geöffneten Seite erhalten. Nach der letzten Frage kann die jeweilige Übung neu begonnen werden. Die Vokabeltest-Statistik bleibt davon unabhängig.

Inhalte: `js/letter-examples.js`, `js/grammar-data.js`, `js/grammar-expanded.js` und `js/grammar-syntax.js`. Oberflächen: `js/pages/letters-learning.js`, `js/pages/grammar.js`, `css/grammar.css`. In der Grammatikseite müssen `grammar-expanded.js` und `grammar-syntax.js` vor `grammar-data.js` geladen werden.

## تصريف الأفعال · Verben lernen

`verbs.html` ist über das Dashboard und die Navigation erreichbar. Der Kurs enthält 48 Verben mit Perfekt, Präsens (Indikativ) und Imperativ, Beispielsätzen, deutschen Übersetzungen und Quiz. Im Perfekt und Präsens werden jeweils 14 Personen-/Geschlechtsformen gezeigt. Der Imperativ hat fünf unterschiedliche Formen für die angesprochenen Personen: أنتَ، أنتِ، أنتما، أنتم، أنتنّ. Es werden keine Imperativformen für „ich“ oder „er/sie“ erzeugt.

Eine Suche auf Arabisch oder Deutsch ignoriert Vokalzeichen sowie Alif-/Hamza-Varianten. Die Auswahl gruppiert regelmäßige Verben, Verben mit Hamza und schwache Verben. Zusätzlich lässt sich nach drei, vier, fünf oder sechs Buchstaben der Perfektform filtern. Suche und Längenfilter sind kombinierbar. Ohne Treffer werden eine Meldung und eine Schaltfläche zum Zurücksetzen angezeigt. Sprachwechsel erhält Auswahl, Suchbegriff und Übungsstand.

Der Katalog enthält neben regelmäßigen Verben unter anderem أكل، أخذ، قال، نام، قرأ und وقف. Diese sechs Verben haben ausdrücklich hinterlegte vollständige Paradigmen, einschließlich Änderungen des Stamms und der Hamza-Schreibung. Beispiele: آكل، قلتُ، نمتُ، يقرؤون، كُلْ، خُذْ، قُلْ، نَمْ، قِفْ. Farbige Vorsilben und Endungen werden nur getrennt, wenn das Schriftbild dies zulässt. Die fünf Imperativformen werden auch bei der Erzeugung der Quizantworten berücksichtigt. Der Übungszähler gilt für die aktuelle Sitzung und bleibt unabhängig von den Vokabeltests.

Die 18 neuen Verben umfassen je sechs vier-, fünf- und sechsbuchstabige Perfektformen, etwa علّم، أكرم، دحرج، تعلّم، اجتمع، تدحرج، استخدم und استخرج. Die Einordnung zählt Schadda als zwei Konsonanten und unterscheidet ausdrücklich Formlänge und Wurzellänge: علّم ist ein erweitertes dreiradikaliges Verb, دحرج ein vierwurzeliges Grundverb. Muster und Wurzel werden bei diesen Verben angezeigt. Präsensvorsilben erhalten je nach Stamm Fatḥa oder Ḍamma; alle drei Zeit-/Befehlsformen besitzen die passenden Personenendungen.

Daten und Konjugationsregeln: `js/verb-data.js`. Oberfläche: `js/pages/verbs.js`, `css/verbs.css`.

## Funktionstest

Die Download-ZIP enthält JavaScript und CSS direkt in den HTML-Seiten. Dadurch benötigen die Übungen beim lokalen Öffnen keine separat geladenen Skripte oder Stylesheets. Bilder, Schrift und Audio bleiben als Dateien im Ordner; deshalb die ZIP weiterhin vollständig in einen neuen Ordner entpacken und dort `index.html` in Chrome öffnen.

`js/storage.js` fängt verweigerten Speicherzugriff und fehlgeschlagene Schreibvorgänge ab. Die Übungen laufen in diesem Fall mit vorübergehendem Zustand weiter; die Oberfläche weist auf fehlende Speicherung hin. Die Navigation hängt nicht vom zusätzlichen Karten-Zähler ab. Geänderte JS-/CSS-Dateien der Website erhalten Inhaltsversionen in ihren URLs, um gemischte Cache-Versionen zu vermeiden.

Der Download lässt sich mit `python3 tools/build-download.py` neu bauen. Das Skript aktualisiert die Asset-Versionen in den Quell-HTML-Dateien und prüft anschließend die ZIP-Dateien sowie die eingebetteten Skripte. `tests/local-download-smoke.py --base-url http://127.0.0.1:8001` prüft eine separat entpackte und auf Port 8001 bereitgestellte ZIP: alle drei Lernbereiche, Audio, Kartenklick, Navigation und Sprachwechsel bei blockierten separaten Skript-/Stylesheet-Anfragen, verweigertem Speicher und fehlenden neueren DOM-Methoden. Dies ist ein Browsertest der entpackten Dateien; ein physisches Android-Gerät wurde nicht getestet.

Voraussetzungen: Python, Playwright für Python und Chromium unter `/usr/bin/chromium`. Bei laufendem Server:

```sh
python3 tests/smoke.py
node --test tests/*.test.js
python3 tests/verbs-smoke.py
python3 tests/foundations-smoke.py
python3 tests/grammar-syntax-smoke.py
python3 tests/letter-training-smoke.py
python3 tests/letters-focused-smoke.py
python3 tests/letter-pronunciation-smoke.py
python3 tests/practice-smoke.py
python3 tests/letter-audio-check.py
```

Die Tests prüfen alle 144 Konjugationstabellen der 48 Verben, Suche, Längenfilter und Imperativübungen sowie alle 380 Grammatikfragen, Themenfilter, Antworterklärungen, Rücknavigation, Zurücksetzen und Sprachwahl, Wortlisten, Lernkarten, einen vollständig beantworteten Multiple-Choice-Test, persistierte Ergebnisse, Statistiken, Excel-Import, den Sprachwechsel in beide Richtungen, mobile Navigation und die Lernseiten bei unterschiedlichen Bildschirmbreiten.

Excel-Import lädt XLSX 0.18.5 über `cdn.jsdelivr.net`. Wenn der Testbrowser den Cloud-HTTPS-Proxy nicht kennt, kann ausschließlich für den Funktionstest dieselbe Bibliothek mit aktiver TLS-Prüfung heruntergeladen und lokal bereitgestellt werden:

```sh
curl --fail --location --show-error https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js -o /tmp/jisr-xlsx.js
python3 tests/smoke.py --xlsx-js /tmp/jisr-xlsx.js
```

Die Option ersetzt im Test nur den Abruf der angegebenen Bibliothek und ändert keine Zertifikatsprüfung oder Anwendungseinstellungen. Der Test `letters-focused-smoke.py` prüft die Bindung aller 28 Karten an ihre drei Übungen, die Seitenreihenfolge, vollständige Runden für Bā und Dāl, Auswahl und Korrektur der Kreise, Ergebnisse, Wiederholung, pro Buchstabe getrennte Lernstände, Sprachwechsel und Bildschirmgrößen. Die Unit-Tests validieren alle 1.344 Aufgaben sowie die Verbindungen und Wortpositionen.

Der zusätzliche gemischte Buchstabentest prüft alle 112 Fragen, Korrekturen, Sprachwechsel, Ergebnis, Durchsicht und Neustart in einer mobilen Chrome-Emulation. Er prüft außerdem die tatsächliche MP3-Wiedergabe durch Touch-Eingaben bei blockierten externen Anfragen. Die Unit-Tests prüfen unter anderem den direkten Gerätestimmen-Aufruf, verzögert verfügbare Stimmen, gesperrte Wiedergabe, Fallbacks und den Abbruch veralteter Anfragen. Ein Test auf einem physischen Android-Gerät wurde in der Cloud nicht durchgeführt.

`letter-pronunciation-smoke.py` prüft die 28 Sukun-Hörbeispiele, die korrigierten Bildwörter, Tā, das Granatapfelbild und beide Oberflächensprachen mit gesperrtem externem Netzwerk. `practice-smoke.py` beantwortet alle 36 Hörfragen, 24 Satzbauaufgaben und 24 Verständnisfragen, prüft Wiedergabe der 120 neuen Clips, Korrekturen, Tipps, Persistenz, Filter und Tastatur-/Touch-Navigation. `letter-audio-check.py` benötigt zusätzlich FFmpeg/FFprobe und prüft alle 288 MP3-Dateien auf Dekodierfehler und Stille.

Online-Aussprache für sonstigen Text benötigt Zugriff auf `translate.google.com` bzw. `translate.googleapis.com`; ihre Verfügbarkeit hängt vom externen Dienst ab.
