"""Download Arabic speech for the public reading bank; run on a network-enabled CI runner.

No Firebase credentials, billing API, learner data or private keys are used.
Generated sources stay on the dedicated audio-recovery branch until reviewed.
"""
from pathlib import Path
import json,hashlib,time,urllib.request,urllib.parse,unicodedata
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
ROOT=Path(__file__).resolve().parents[1];out=ROOT/'audio/reading-cloud-cache';out.mkdir(exist_ok=True)
source=json.loads((ROOT/'data/reading-trainer-source.json').read_text())
words=[unicodedata.normalize('NFC',l.get('spellings',{}).get(s,s.replace('|',''))) for l in source['levels'] for s,_ in l['words']]
samples=['ذَ','هَ','بَ','كَ','كِ','كُ','ذَهَ','كَتَ','مَدْ','مَدْرَ','مَدْرَسَ','كِتَ','كِتَا', 'ذَـ','هَـ','بَـ','كَـ','كِـ','كُـ']
texts=list(dict.fromkeys(samples+words))
def make(text):
 target=out/(hashlib.sha256(text.encode()).hexdigest()[:20]+'.mp3')
 for attempt in range(3):
  try:
   if not target.exists():
    url='https://translate.google.com/translate_tts?'+urllib.parse.urlencode(dict(ie='UTF-8',client='gtx',tl='ar',ttsslow='1',q=text))
    request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(request,timeout=30) as r:
     data=r.read();assert r.headers.get('Content-Type','').startswith('audio/') and len(data)>500
    target.write_bytes(data)
    time.sleep(.7)
   return dict(text=text,path=target.relative_to(ROOT).as_posix(),sha256=hashlib.sha256(target.read_bytes()).hexdigest())
  except Exception as e:
   if attempt==2:return dict(text=text,error=str(e))
   time.sleep(2+attempt*3)
with ThreadPoolExecutor(max_workers=2) as pool:clips=list(pool.map(make,texts))
report={'date':datetime.now(timezone.utc).isoformat(),'provider':'Google Translate TTS (ar), slow','words':len(words),'complete':all('path' in c for c in clips),'clips':clips}
(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Downloaded',sum('path' in c for c in clips),'of',len(clips),'public synthesis prompts')
