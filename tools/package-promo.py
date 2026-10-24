"""Package the finished bilingual promotional films and their editable text assets."""
import hashlib
import json
from pathlib import Path
import subprocess
from zipfile import ZipFile, ZIP_DEFLATED

ROOT=Path(__file__).resolve().parents[1]
media=ROOT/'media/promo'
storyboard=json.loads((media/'storyboard.json').read_text())
files=[]
manifest={'brand':storyboard['brand'],'format':'1920×1080 / 16:9 / H.264 + AAC', 'videos':[]}
for lang in ['de','ar']:
    suffix=lang.upper();video=ROOT/'downloads'/f'Huroof-Werbung-{suffix}.mp4'
    report=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
    stream=next(s for s in report['streams'] if s['codec_type']=='video')
    assert (stream['width'],stream['height'])==(1920,1080)
    manifest['videos'].append({'language':lang,'file':video.name,'seconds':float(report['format']['duration']),
                               'bytes':video.stat().st_size,'sha256':hashlib.sha256(video.read_bytes()).hexdigest()})
    text='\n\n'.join(s[lang]['title'].replace('\n',' ')+'\n'+s[lang]['speech'] for s in storyboard['scenes'])+'\n'
    (media/f'Sprechertext-{suffix}.txt').write_text(text)
    files += [video]+[media/name for name in [f'Huroof-Werbung-{suffix}.srt',f'Huroof-Vorschaubild-{suffix}.png',f'YouTube-Kapitel-{suffix}.txt',f'Sprechertext-{suffix}.txt']]
(media/'release.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
readme='''حروف من الزيتون · Huroof
Werbevideos auf Deutsch und Arabisch / فيديوهان تعريفيان بالألمانية والعربية

DEUTSCH
Zwei eigenständige MP4-Filme im Querformat für Website und YouTube.
Full HD (1920 × 1080), 25 Bilder/Sekunde, H.264-Video und AAC-Stereoton.
Die Untertitel sind bereits eingeblendet. Separate SRT-Dateien sind für die
Bearbeitung beigefügt; zusätzliche YouTube-Untertitel sind daher optional.
Außerdem enthalten: Vorschaubilder, Sprechertexte und YouTube-Kapitelmarken.

Die Aufnahmen zeigen echte Bedienabläufe der App mit einem Beispiel-Lernstand.
Die Konto- und Synchronisierungsfunktion bezieht sich auf die Online-Version.
Die Offline-Version speichert Lernstände im jeweiligen Browser.
Sprecherstimmen: synthetische deutsche und arabische Vertonung (Google Translate TTS).
Musik: eigens generiertes leises Instrumentalmotiv.
App-Konzept und Unterrichtsinhalte: Lehrer Mahmoud Barakat.

العربية
فيديوهان مستقلان بصيغة MP4 وبالعرض الأفقي، للموقع ويوتيوب، بدقة Full HD.
الترجمة النصية مدمجة في الصورة. أُرفقت ملفات SRT اختيارية للتحرير، وصور
معاينة، ونصوص التعليق الصوتي، وعلامات فصول يوتيوب.
تعرض اللقطات استخدامًا حقيقيًا للتطبيق، مع تقدّم تعليمي تجريبي.
تتعلّق الحسابات والمزامنة بالنسخة الإلكترونية؛ وتحفظ النسخة المحلية
التقدّم في المتصفح. التعليق الصوتي مولّد آليًا، والموسيقى الهادئة مولّدة خصيصًا.
إعداد التطبيق والمحتوى التعليمي: الأستاذ محمود بركات.
'''
(media/'LIESMICH-README.txt').write_text(readme)
files += [media/'release.json',media/'LIESMICH-README.txt']
dest=ROOT/'downloads/Huroof-Werbevideos-DE-AR.zip'
with ZipFile(dest,'w',ZIP_DEFLATED) as archive:
    for path in files:archive.write(path,'Huroof-Werbevideos/'+path.name)
with ZipFile(dest) as archive:
    assert archive.testzip() is None
    for path in files:assert archive.read('Huroof-Werbevideos/'+path.name)==path.read_bytes()
assert dest.stat().st_size<95_000_000
print(json.dumps(manifest,ensure_ascii=False));print('Verified package:',dest.stat().st_size,'bytes;',len(files),'files')
