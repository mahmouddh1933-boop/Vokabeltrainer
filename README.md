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

## كتاب الشباب2 ج1 / Jugendbuch 2 · Teil 1

Der unabhängige Bereich `youth-book-two-part-one.html` ist über Startseite und Seitenleiste erreichbar. **Alle 37 Fotos** des zweiten ZIP-Pakets sind im Bildverzeichnis zugeordnet: 36 Unterrichtsseiten (6–41) und das Inhaltsverzeichnis. Sechs Einheiten folgen dessen Titeln, Grammatikthemen und Lautpaaren:

| Einheit | Titel | Grammatik | Lautpaar |
| --- | --- | --- | --- |
| 1 | من أين أنت؟ | حروف الجر | ع / أ |
| 2 | أين تسكن؟ | أدوات الاستفهام | س / ث |
| 3 | كم الساعة الآن؟ | أقسام الكلمة | س / ش |
| 4 | ماذا تفعل في الصباح؟ | الفعل | د / ض |
| 5 | ماذا ستعمل بعد الدراسة؟ | الفاعل | ض / ظ |
| 6 | إلى السوق | المفعول به | ذ / ظ |

**49 neue Aufgabenblöcke mit 418 Teilaufgaben** decken Dialogverständnis, Wortschatz, ergänzte Gesprächswechsel, Lautunterscheidung, Grammatik und angewandte Strukturen, Wort-/Satzbau, freies Schreiben und Lesen ab. Einheit 3 enthält zusätzlich sechs bedienbare Analoguhren. Pro Einheit führen sechs Bereichsfilter zu Dialog, Wortschatz, Lauten, Grammatik/Strukturen, Schreiben und Lesen; passende Sprechaufgaben stehen im Dialogbereich. Inhalte und Aufgaben sind neu verfasst und orientieren sich an den Vorlagen, ohne die Originalfotos im Download zu verteilen.

Geschlossene Aufgaben erhalten Korrektur und Erklärung. Freie Gespräche und Texte haben ausformulierte Vergleichsmodelle und eine getrennte Selbstkontrolle. Antworten, Schreibentwürfe, die ausgewählte Einheit und der Fortschritt bleiben unter dem eigenen Speicherschlüssel `jisrPracticeV1:youth-book-two-part-one` erhalten. Bei gesperrtem Speicher funktioniert die Oberfläche vorübergehend ohne dauerhafte Speicherung. Verknüpfungen wie `#unit-3` und `#u6-grammar` öffnen direkt die gewünschte Einheit beziehungsweise Aufgabe.

Dialogzeilen, Wörter, Leseabschnitte und Lautaufgaben besitzen lokal mitgeliefertes Audio. 134 neue synthetische MP3s ergänzen vorhandene Aufnahmen; siehe `audio/book-youth-two-part-one-manifest.json` und `audio/README.md`. Lerntexte und leere Aufgaben lassen sich als Einzelaktivität, nach Bildvorlage oder als vollständige Einheit drucken. Gespeicherte Antworten und Entwürfe werden dabei nicht ausgedruckt.

Bearbeitbare Inhalte: `data/book-youth-two-part-one/unit-{1..6}.json`; Zuordnung: [37 Bilder und Unterrichtsthemen](docs/YOUTH-BOOK-TWO-PART-ONE-COVERAGE.md). `node tools/build-youth-book-two-part-one.js` erzeugt deterministisch Daten, Audioeingaben und Zuordnungsdokumentation aus diesen Quelldateien; die hochgeladenen Fotos sind dafür nicht erforderlich. Der gemeinsame Aufgabenrenderer bleibt mit „تدريبات الشباب 2“ kompatibel, verwendet jedoch getrennte Inhaltsdaten und Speicherstände.

Prüfen: `node --test tests/*.test.js`, `python tests/youth-book-two-part-one-smoke.py` und `python tests/letter-audio-check.py`. Der Browsertest bearbeitet jede Teilaufgabe über die Oberfläche und prüft Audio, Einheitenwechsel, gespeicherte Antworten, deutsche/arabische Oberfläche und die Druckansichten. Der Test der entpackten ZIP enthält auch diesen Bereich.

## تدريبات الشباب 2 / Jugendübungen 2

`youth-training-two.html` ist ein eigener Bereich auf der Startseite und in der Navigation. **Alle 31 hochgeladenen Buchfotos wurden einzeln geprüft**. Daraus entstanden **53 neue Aufgabenblöcke mit 402 Teilaufgaben**, jeweils nach den erkennbaren Übungsformen. [Die vollständige Zuordnung](docs/YOUTH-TWO-COVERAGE.md) verbindet jeden Originaldateinamen und jede sichtbare Buchseite mit den passenden Aktivitäten. Nicht erkennbare Seitenzahlen sind nicht geraten; abgeschnittene Randstreifen wiederholen andere Seiten oder zeigen keinen vollständigen zusätzlichen Auftrag. Die Originalfotos werden nicht mitverteilt.

Die Inhalte decken Jahreszeiten, Singular/Dual/Plural, Pronomen und Besitzendungen, Nominal-/Verbalsätze, Subjekt und Objekt, Körperorgane, Sport-/Reiseausdrücke, Berufe, Genusumformungen, Vergangenheit/Gegenwart/Zukunft, Gegensätze, Uhrzeiten, Wochentage, Wortarten, Fragewörter, Präpositionen und Ländernisba ab. Bildgestützte Aufgaben verwenden passende lokale Illustrationen; Produkt-/Werkzeugsymbole sind ausdrücklich als symbolische Schreibhilfen bezeichnet. Ein neuer nummerierter Körperriss ermöglicht die Benennung der acht inneren Organe mit korrekter Patientenorientierung.

Die **378 automatisch prüfbaren Teilaufgaben** bestehen aus 190 Auswahl-/Zuordnungs-/Klassifizierungsfragen, 120 schreibbaren Ergänzungen und Umformungen, 42 Buchstaben-/Satzbauaufgaben, 18 Wortmarkierungen und acht interaktiven Uhren. Die Uhren lassen sich durch Bewegen des ausgewählten Zeigers oder über zugängliche Stunden-/Minutenfelder bedienen. Buchstabenaufgaben verbinden Zeichen ohne Leerzeichen; Satzaufgaben akzeptieren zusätzlich die ausgewiesenen gültigen Alternativen. Sechs س/ش-Höraufgaben nutzen bereits vorhandene lokale MP3-Dateien ohne externe Dienste.

Die weiteren **24 freien Schreib-/Ausdrucksaufgaben** bieten persönliche Entwürfe, einblendbare Musterantworten und getrennte Selbstprüfung. Sie erhalten keine automatisch richtige/falsche Wertung. Der Fortschritt für geschlossene Antworten und die Anzahl selbst geprüfter offener Aufgaben werden separat dargestellt. Beim Schreiben bleiben Hamza, Tāʾ marbūṭa und andere bedeutungstragende Buchstaben erhalten. كَ/كِ verlangen die ausdrücklich geforderte unterscheidende Endvokalisation, während übrige optionale Vokalzeichen entfallen dürfen; ausdrücklich falsche Vokale bei أنتَ/أنتِ oder den markierten Akkusativaufgaben werden nicht übergangen.

Suche, Kategorien und ein Fotoindex erschließen alle Aktivitäten. Antworten, unfertige Eingaben, zusammengesetzte Wörter, Markierungen, Uhrwerte und offene Entwürfe werden separat unter `jisrPracticeV1:youth-two` gespeichert. Die Wiederholung eines Builder-Tasks beginnt frisch; ein Aktivitätsreset entfernt nur die geschlossenen Antworten/Entwürfe dieser Aktivität und erhält die freie Schreibarbeit. Eingeschränkter Browserspeicher führt weiterhin zu einem nutzbaren vorübergehenden Zustand. Filter sowie gültige direkte Aktivitätslinks bleiben handhabbar, auch wenn die History-API verweigert wird.

„Aufgabe drucken“ und „Aufgaben dieser Vorlage drucken“ erzeugen unausgefüllte Arbeitsblätter für einen Block oder sämtliche Blöcke derselben Vorlage. Gespeicherte Antworten, Musterlösungen und persönliche Entwürfe erscheinen nicht darin. Uhren werden als leere Zifferblätter und die Organdiagramme mit unbenannten Nummern gedruckt; Bilder benötigen keine gedruckten Hintergrundfarben.

Quellinhalte: `data/youth-two/part-{a,b,c,d}.json`; deterministischer Katalog und Fotodeckung: `node tools/build-youth-two.js`; Laufzeitkatalog: `js/youth-two-data.js`; Oberfläche: `js/pages/youth-two.js`, `css/youth-two.css`. Die HTML-Datei benötigt weder `fetch` noch andere Datenanfragen. Der portable Download bettet alle benötigten Skripte und Styles ein; Bilder, Schrift und die bereits vorhandenen 660 MP3s bleiben beigefügt. Neue Bildquelle: `images/youth-two/CREDITS.md`.

## العربية للشباب / Arabisch für Jugendliche

`arabic-youth.html` ist ein unabhängiger Bereich in Startseite und Navigation mit **acht vollständigen Einheiten**. Die folgenden Dialog-, Lese- und Freilesetitel entsprechen dem vom Nutzer gelieferten Inhaltsverzeichnis. Alle Texte und Aufgaben sind neu für die App geschrieben und folgen dem Aufbau der gezeigten ersten Einheit; sie sind keine Abschrift nicht vorliegender Buchseiten.

| Einheit / Dialog | Lesetext | Freies Lesen |
| --- | --- | --- |
| في القطار | النقل والمواصلات | وصلت الطائرة |
| كيف أستخدم القاموس العربي | أستخدم القاموس العربي | kein Titel im gelieferten Verzeichnis |
| في الفندق | الفنادق | بناء البيت |
| ماذا نفعل اليوم؟ | يوم في حياة فاطمة | تنظيم الوقت |
| كيف نذهب إلى السوق؟ | شرطي المرور | الإشارات المرورية |
| في سوق الصناعات التقليدية | سعاد تتسوق | في المتجر العام |
| الأصدقاء في المطعم | العم الأكول | طعام الإفطار |
| أفكر في السفر | المرشد السياحي | أسبوع في بكين |

Einheit 2 erhält zusätzlich den ausdrücklich als App-Zusatz markierten Lesetext **كلمة فتحت بابًا**. Jede Einheit bietet zwölf Dialogbeiträge, acht Bildwörter mit deutscher Bedeutung, arabischer Erklärung und Beispielsatz, sechs offene Gesprächsfragen mit Musterantworten, vier Absätze Hauptlektüre, eigene Sprachstrukturen mit Beispielen und vier Absätze freier Lektüre.

Pro Einheit gibt es **32 bewertete Aufgaben**: acht Wort-Definition-Zuordnungen, sechs Fragen zum Haupttext, acht Struktur-/Ergänzungsfragen, vier Satzbauaufgaben durch Antippen und sechs Freilesefragen. Insgesamt sind es **256 Aufgaben**, mit Korrektur, Erklärung und einzelnem Wiederholen. 24 häufige alternative Satzstellungen werden ebenfalls akzeptiert. Die Wortstellung orientiert sich am angegebenen Modell. Gespräch, Rollenspiel und freie Zusammenfassung bleiben offen und werden nicht automatisch benotet; persönliche Entwürfe werden separat gespeichert.

Einheitenindex, Auswahlfeld, Navigation direkt unter der Einheit und fünf Inhaltsbereiche ermöglichen direkten Zugriff. `#unit-1` bis `#unit-8` sind als Links verwendbar. Antworten und Entwürfe liegen unter `jisrPracticeV1:arabic-youth`; Zurücksetzen löscht nur bewertete Antworten der aktuellen Einheit. Bei verweigertem Browserspeicher läuft die Übung vorübergehend weiter, mit entsprechendem Hinweis. Ein Sprachwechsel übersetzt die Bedienung, während die arabischen Lerntexte erhalten bleiben.

**221 neue synthetische MP3s** in `audio/youth/` decken alle Dialogbeiträge, Bildwörter und Leseabsätze ab und funktionieren ohne Internet oder installierte arabische Stimme. Insgesamt enthält die ZIP **660 MP3-Dateien**. Es gibt acht neue Themenillustrationen, eine gesonderte Teppichillustration und 59 Twemoji-SVGs (CC BY 4.0); Quellen stehen in `images/youth/CREDITS.md`, Sprachinputs in `audio/youth-manifest.json`. Eine menschliche phonetische Abnahme der synthetischen Stimme ist nicht erfolgt.

„Einheit drucken“ erzeugt ein Arbeitsblatt mit beiden Lesetexten, Dialog, Wortbildern, allen 32 Aufgaben und offenen Schreibzeilen. Gespeicherte Lösungen werden nicht gedruckt; die Illustrationen funktionieren auch ohne gedruckte Hintergrundfarben. Daten: `js/youth-data.js`; Oberfläche: `js/pages/youth.js`, `css/youth.css`. Ein lokaler Server ist zum Entwickeln ausreichend; die Downloadversion enthält alle Skripte und Stile inline.

## Das Buch · Stufe zwei / الكتاب المستوى الثاني

`book-level-two.html` ist ein eigener Bereich neben den bisherigen Lernseiten. Startseite und Seitenleiste verlinken alle 28 Buchstabenlektionen. Die Bezeichnung „Stufe zwei“ gehört zu diesem Arbeitsbuch und bezeichnet keine CEFR-Einstufung.

Jede Lektion enthält drei vokalisierte Bildwörter, die vier Buchstabenformen mit realen Beispielen, drei kurze Lesesätze und einen eigenen Sprachbaustein. Darauf folgen 18 überprüfbare Aufgaben: drei Bild-Wort-Zuordnungen, drei fehlende Buchstaben, sechs Sortieraufgaben nach dem **Anfangsbuchstaben**, zwei Textfragen und vier schreibbare Sprachaufgaben. Das sind insgesamt **504 Aufgaben**. Die Lām-Lektion übt unter anderem Antworten in der ersten Person mit **لا النافية**, im Unterschied zum verbietenden **لا الناهية**.

Vorlesen, optionale deutsche Textübersetzung, direkte Antworten mit Rückmeldung, ein alphabetisches Inhaltsverzeichnis und Vor-/Zurück-Navigation unterstützen das Lernen. Die Übungen speichern ihre Antworten unabhängig von anderen Bereichen. Zum Schreiben besitzt jeder Buchstabe und jedes Bildwort eine eigene linierte Zeichenfläche mit Vorlage, Rückgängig- und Löschfunktion. Handschrift wird gespeichert, aber nicht automatisch bewertet. „Arbeitsblatt drucken“ erstellt zwei A4-Seiten für den aktuellen Buchstaben mit freien Antwortzeilen und Schreibrastern. Die Printansicht zeigt die Aufgaben ohne gespeicherte Lösungen.

Die 168 Wort-/Textausschnitte verwenden 17 bereits vorhandene und **151 zusätzliche synthetische MP3s** in `audio/book-two/`. Die übrigen Lernbereiche kommen damit auf **439 MP3-Dateien**, ohne die zusätzlichen 221 Clips des Jugendbuchs. Syntheseeingaben: `audio/book-two-manifest.json`; Daten: `js/book-two-data.js`; Oberfläche: `js/pages/book-two.js`, `css/book-two.css`. Die 76 Twemoji-SVGs stehen unter CC BY 4.0; Quellen und die sechs neu erstellten Sonderillustrationen sind in `images/book-two/CREDITS.md` dokumentiert. Bilder und Audiodateien werden mitgeliefert und benötigen zur Wiedergabe kein Internet.

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

Der Download lässt sich mit `python3 tools/build-download.py` neu bauen. Das Skript aktualisiert die Asset-Versionen in den Quell-HTML-Dateien und prüft anschließend die ZIP-Dateien sowie die eingebetteten Skripte. `tests/local-download-smoke.py --base-url http://127.0.0.1:8001` prüft eine separat entpackte und auf Port 8001 bereitgestellte ZIP: die drei Lernbereiche, das zweite Buch, das Jugendbuch, Jugendübungen 2, Audio, Kartenklick, Navigation und Sprachwechsel bei blockierten separaten Skript-/Stylesheet-Anfragen, verweigertem Speicher und fehlenden neueren DOM-Methoden. Dies ist ein Browsertest der entpackten Dateien; ein physisches Android-Gerät wurde nicht getestet.

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
python3 tests/book-two-smoke.py
python3 tests/youth-smoke.py
python3 tests/youth-two-smoke.py
python3 tests/book-print-smoke.py
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

`letter-pronunciation-smoke.py` prüft die 28 Sukun-Hörbeispiele, die korrigierten Bildwörter, Tā, das Granatapfelbild und beide Oberflächensprachen mit gesperrtem externem Netzwerk. `practice-smoke.py` beantwortet alle 36 Hörfragen, 24 Satzbauaufgaben und 24 Verständnisfragen, prüft Wiedergabe der 120 neuen Clips, Korrekturen, Tipps, Persistenz, Filter und Tastatur-/Touch-Navigation. `book-two-smoke.py` prüft alle 28 Lektionen mit 504 beantworteten Aufgaben, 168 Audioausgaben, Bildzuordnungen, Handschrift, Speicherung, Sprache und Druckansicht. `letter-audio-check.py` benötigt zusätzlich FFmpeg/FFprobe und prüft alle 660 MP3-Dateien auf Dekodierfehler und Stille.

Online-Aussprache für sonstigen Text benötigt Zugriff auf `translate.google.com` bzw. `translate.googleapis.com`; ihre Verfügbarkeit hängt vom externen Dienst ab.

`youth-smoke.py` prüft alle 256 Aufgaben in acht Einheiten, 221 unterschiedliche lokal abgespielte Aufnahmen, Bilder, offene Entwürfe, Speicherung, isoliertes Zurücksetzen, 24 alternative Satzstellungen (Datenprüfung), Sprachwechsel, Bildschirmbreiten von 320 bis 1440 Pixeln und die Druckfassung ohne gespeicherte Antworten. Externe Anfragen sind dabei blockiert. Die entpackte ZIP wird zusätzlich mit verweigertem Speicher, verweigerter History-API, fehlender `replaceChildren`-Methode und blockierten separaten JS-/CSS-Dateien geprüft.

`youth-two-smoke.py` prüft alle 402 Teilaufgaben der 53 Aktivitäten: 378 geprüfte Antworten und 24 offene Entwürfe/Selbstprüfungen. Es deckt die 31 Vorlagen, falsche Antworten und Wiederholung jeder Aufgabenart, Speicherung, getrennte Bewertung, Kategorien/Suche, Navigation, echtes lokales Hörspiel, Zeigerbedienung per Touch, arabische/deutsche Bedienung von 320 bis 1440 Pixeln, beide leeren Druckvarianten und isoliertes Zurücksetzen ab. Der Downloadtest prüft diesen neuen Bereich zusätzlich bei verweigertem Speicher/History, ohne `replaceChildren`/`replaceAll` sowie mit blockierten separaten JS-/CSS-Anfragen. Ein physisches Android-Gerät wurde in der Cloud nicht getestet.
