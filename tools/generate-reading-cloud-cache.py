"""Download Arabic speech for the public reading bank; run on a network-enabled CI runner.

No Firebase credentials, billing API, learner data or private keys are used.
Generated sources stay on the dedicated audio-recovery branch until reviewed.
"""
from pathlib import Path
import json,hashlib,time,urllib.request,urllib.parse,unicodedata,subprocess,re
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
from reading_trainer_phonetics import reading_sounds,reading_prefixes,whole_ipa
ROOT=Path(__file__).resolve().parents[1];out=ROOT/'audio/reading-cloud-cache';out.mkdir(exist_ok=True)
source=json.loads((ROOT/'data/reading-trainer-source.json').read_text())
words=[unicodedata.normalize('NFC',l.get('spellings',{}).get(s,s.replace('|',''))) for l in source['levels'] for s,_ in l['words']]
samples=['ذَ','هَ','بَ','كَ','كِ','كُ','ذَهَ','كَتَ','مَدْ','مَدْرَ','مَدْرَسَ','كِتَ','كِتَا', 'ذَـ','هَـ','بَـ','كَـ','كِـ','كُـ']
fragments=[]
for level in source['levels']:
 for segmented,_ in level['words']:
  word=unicodedata.normalize('NFC',level.get('spellings',{}).get(segmented,segmented.replace('|','')))
  fragments.extend(s['spokenText'] for s in reading_sounds(word))
  fragments.extend(p['text'] for p in reading_prefixes(word,whole_ipa(segmented.split('|'))))
texts=list(dict.fromkeys(samples+words+fragments))
def make(text):
 target=out/(hashlib.sha256(('normal-context-v1|'+text).encode()).hexdigest()[:20]+'.mp3')
 raw_dir=out/'raw';raw_dir.mkdir(exist_ok=True)
 raw=raw_dir/target.name
 prompt='اِسْتَمِعْ. '+text+'.'
 for attempt in range(3):
  try:
   if not target.exists():
    if not raw.exists():
     url='https://translate.google.com/translate_tts?'+urllib.parse.urlencode(dict(ie='UTF-8',client='gtx',tl='ar',q=prompt))
     request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
     with urllib.request.urlopen(request,timeout=30) as r:
      data=r.read();assert r.headers.get('Content-Type','').startswith('audio/') and len(data)>500
     raw.write_bytes(data);time.sleep(.7)
    duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(raw)]))
    scan=subprocess.run(['ffmpeg','-v','info','-i',str(raw),'-af','silencedetect=noise=-42dB:d=0.14','-f','null','-'],capture_output=True,text=True,check=True).stderr
    intervals=[(float(a),float(b)) for a,b in re.findall(r'silence_start: ([0-9.]+).*?silence_end: ([0-9.]+)',scan,re.S)]
    internal=[(a,b) for a,b in intervals if a>.25 and b<duration-.10]
    assert internal,('no separable carrier pause',text,intervals)
    pause=max(internal,key=lambda ab:ab[1]-ab[0])
    start=max(0,pause[1]-.06)
    trailing=[a for a,b in intervals if b>duration-.08 and a>start+.1]
    end=min(duration,trailing[-1]+.1) if trailing else duration
    assert end-start>.12,(text,start,end)
    subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',str(raw),'-ss',str(start),'-t',str(end-start),'-ar','22050','-ac','1','-c:a','libmp3lame','-b:a','80k',str(target)],check=True)
    info={'inputText':prompt,'trimStart':round(start,4),'trimEnd':round(end,4),'sourceSha256':hashlib.sha256(raw.read_bytes()).hexdigest()}
    target.with_suffix('.json').write_text(json.dumps(info,ensure_ascii=False))
   info=json.loads(target.with_suffix('.json').read_text())
   return dict(text=text,path=target.relative_to(ROOT).as_posix(),sha256=hashlib.sha256(target.read_bytes()).hexdigest(),**info)
  except Exception as e:
   if attempt==2:return dict(text=text,error=str(e))
   time.sleep(2+attempt*3)
with ThreadPoolExecutor(max_workers=2) as pool:clips=list(pool.map(make,texts))
report={'date':datetime.now(timezone.utc).isoformat(),'provider':'Google Translate TTS (ar), normal rate inside a spoken carrier; target extracted after sentence pause','words':len(words),'complete':all('path' in c for c in clips),'clips':clips}
(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Downloaded',sum('path' in c for c in clips),'of',len(clips),'public synthesis prompts')
