"""Prepare bundled Arabic speech for the reading trainer's application sentences.

Run where Google Translate TTS is reachable; playback needs no speech service.
An incomplete generation report cannot be consumed by the data builder.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import hashlib,json,subprocess,urllib.request,urllib.parse,time,re
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'data/reading-trainer-sentences.json'
texts=list(dict.fromkeys(s['ar'] for w in json.loads(source.read_text())['words'] for s in w['sentences']))
folder=ROOT/'audio/reading-sentences';folder.mkdir(parents=True,exist_ok=True)
def make(text):
 path=folder/(hashlib.sha256(('reading-sentence-v1|'+text).encode()).hexdigest()[:20]+'.mp3')
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
   assert .4<duration<20 and peak>-30,(text,duration,peak)
   print('RECORDED',text,flush=True)
   return dict(text=text,path=path.relative_to(ROOT).as_posix(),seconds=duration,sha256=hashlib.sha256(path.read_bytes()).hexdigest())
  except Exception as error:
   if attempt==3:return dict(text=text,error=str(error))
   time.sleep(1+attempt)
with ThreadPoolExecutor(max_workers=2) as pool:clips=list(pool.map(make,texts))
report={'version':1,'date':datetime.now(timezone.utc).isoformat(),'provider':'Google Translate TTS (ar), normal rate, complete vocalized sentences; synthetic voice, not a human recording',
 'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'complete':all('path' in c for c in clips),'clips':clips}
(ROOT/'audio/reading-sentences-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
assert report['complete'],[c for c in clips if 'error' in c]
print('Prepared',len(clips),'decoded sentence recordings',flush=True)
