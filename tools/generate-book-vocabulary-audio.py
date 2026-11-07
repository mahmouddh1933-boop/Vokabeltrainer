"""Exact, bundled audio for the manually reviewed book vocabulary.

Reuses exact NFC recordings from the main vocabulary bank. Only missing words
are synthesized, with no learner data or runtime speech-service dependency.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import hashlib,json,subprocess,urllib.request,urllib.parse,time,unicodedata,re
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'data/book-vocabulary-source.json';entries=json.loads(source.read_text())['entries']
existing={unicodedata.normalize('NFC',c['text']):c for c in json.loads((ROOT/'audio/vocabulary-manifest.json').read_text())['clips']}
folder=ROOT/'audio/book-vocabulary';folder.mkdir(exist_ok=True)
def make(entry):
 text=entry['ar'];old=existing.get(text)
 if old and (ROOT/old['path']).is_file():
  assert hashlib.sha256((ROOT/old['path']).read_bytes()).hexdigest()==old['sha256']
  return old
 path=folder/(hashlib.sha256(text.encode()).hexdigest()[:16]+'.mp3')
 for attempt in range(4):
  try:
   if not path.exists():
    query=urllib.parse.urlencode(dict(ie='UTF-8',client='gtx',tl='ar',q=text))
    request=urllib.request.Request('https://translate.google.com/translate_tts?'+query,headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(request,timeout=30) as response:
     payload=response.read();assert response.headers.get('Content-Type','').startswith('audio/') and len(payload)>500
    path.write_bytes(payload);time.sleep(.5)
   duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(path)]))
   scan=subprocess.run(['ffmpeg','-nostdin','-v','info','-i',str(path),'-af','volumedetect','-f','null','-'],capture_output=True,text=True,check=True).stderr
   peak=float(re.search(r'max_volume: ([\-\d.]+) dB',scan).group(1))
   assert .2<duration<20 and peak>-30,(text,duration,peak)
   return dict(text=text,path=path.relative_to(ROOT).as_posix(),seconds=duration,sha256=hashlib.sha256(path.read_bytes()).hexdigest())
  except Exception as error:
   if attempt==3:return dict(text=text,error=str(error))
   time.sleep(1+attempt)
with ThreadPoolExecutor(max_workers=2) as pool:clips=list(pool.map(make,entries))
report={'version':1,'date':datetime.now(timezone.utc).isoformat(),'provider':'Google Translate TTS (ar); exact existing vocabulary recordings reused. Synthetic speech, not human recordings.',
 'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'complete':all('path' in c for c in clips),'clips':clips}
(ROOT/'audio/book-vocabulary-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
assert report['complete'],[c for c in clips if 'error' in c]
mapping={c['text']:c['path'] for c in clips}
(ROOT/'js/book-vocabulary-audio.js').write_text('/* Generated exact NFC audio for book vocabulary. */\n(() => { "use strict"; const data = '+json.dumps({'audio':mapping},ensure_ascii=False,separators=(',',':'))+'; if(typeof module!=="undefined"&&module.exports)module.exports=data;else window.ArabicBookVocabularyAudio=data;})();\n')
print('Prepared',len(clips),'book vocabulary recordings;',sum(c['path'].startswith('audio/book-vocabulary/') for c in clips),'new files',flush=True)
