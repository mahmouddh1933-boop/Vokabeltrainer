"""Validate and package the German tutorial extras without duplicating the video."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import json,subprocess,hashlib,re
ROOT=Path(__file__).resolve().parents[1];folder=ROOT/'media/tutorial-de'
report=json.loads((folder/'release.json').read_text());video=ROOT/'downloads/Huroof-Rundgang-DE.mp4'
assert hashlib.sha256(video.read_bytes()).hexdigest()==report['sha256']
chapter_text=(folder/'YouTube-Kapitel-DE.txt').read_text();assert len(chapter_text.strip().splitlines())==report['chapters']
srt=(folder/'Huroof-Rundgang-DE.srt').read_text();assert srt.count(' --> ')==report['subtitles']
intro='''Huroof – Arabisch lernen mit starken Wurzeln.

Diese ausführliche Tour zeigt die Funktionen der deutsch-arabischen Lernanwendung
von Lehrer Mahmoud Barakat: vom Alphabet und dem Lesen über Wortschatz und Satzbau
bis zu Hörverstehen, Gesprächen, Schreiben, Grammatik und Verbformen.
Du erfährst auch, wie du passende Aufgaben auswählst, Fehler wiederholst und deinen
Lernstand sinnvoll nutzt.

Mit echten Beispielen aus der Anwendung, deutschen Untertiteln und synthetischer
Sprecherstimme. Konto- und Synchronisationsfunktionen gelten für die entsprechend
eingerichtete Online-Ausgabe. Freie Antworten benötigen eigene Kontrolle oder eine
Lehrkraft; Einstiegschecks ersetzen kein offizielles Sprachzertifikat.

Website: https://letters-from-olive.web.app/

KAPITEL
'''
(folder/'YouTube-Beschreibung-DE.txt').write_text(intro+chapter_text+'\nStimme und Bildquellen: siehe VOICE-CREDITS.txt.\n')
(folder/'LIESMICH.txt').write_text('''Huroof – Ausführliche App-Tour auf Deutsch

Das Video Huroof-Rundgang-DE.mp4 separat herunterladen. Dieses Paket enthält die
Untertitel, Kapitel, Beschreibung, Sprechertext, das Vorschaubild und eine kleine
Excel-Beispielliste für die Funktion Eigene Wörter importieren.

Die Untertitel sind im Film bereits sichtbar. Die SRT-Datei kann zusätzlich bei
YouTube als Untertiteldatei hochgeladen oder zur Bearbeitung genutzt werden.
Die Kapitel sind außerdem im MP4 eingebettet. Für YouTube die Kapitel aus der
Textdatei in die Videobeschreibung übernehmen.

Die Excel-Datei ist ein kleines, neues Unterrichtsbeispiel mit drei Wortpaaren.
Stimme und Ansichten sind in VOICE-CREDITS.txt erläutert.
''')
files=['Huroof-Rundgang-DE.srt','Sprechertext-DE.txt','YouTube-Kapitel-DE.txt','YouTube-Beschreibung-DE.txt','Huroof-Rundgang-DE-Vorschaubild.png','Eigene-Wortliste.xlsx','VOICE-CREDITS.txt','LIESMICH.txt','release.json']
target=ROOT/'downloads/Huroof-Rundgang-DE-Begleitmaterial.zip'
with ZipFile(target,'w',ZIP_DEFLATED) as z:
 for file in files:z.write(folder/file,'Huroof-Rundgang-DE/'+file)
 z.write(ROOT/'fonts/OFL.txt','Huroof-Rundgang-DE/fonts/Manrope-OFL.txt')
 z.write(ROOT/'fonts/NotoNaskhArabic-OFL.txt','Huroof-Rundgang-DE/fonts/NotoNaskhArabic-OFL.txt')
with ZipFile(target) as z:assert z.testzip() is None
print('Verified tutorial extras:',target.stat().st_size,'bytes; video separate; chapters',report['chapters'],'subtitles',report['subtitles'])
