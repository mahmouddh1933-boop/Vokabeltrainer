"""Build the Oct-2026 letter pronunciation revision from fully vocalized prompts.

Synthesize at normal speed inside a labelled prompt, then extract the target
after its sentence pause. Save only the target, with a gentle constant slowdown.
New filenames prevent previously cached recordings from surviving the revision.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import hashlib,json,re,subprocess,time,unicodedata,urllib.parse,urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
cache=Path('/tmp/olive-letter-pronunciation-revision');cache.mkdir(exist_ok=True)
jobs=[
 ('name','ج','الْجِيمْ','اَلْجِيمْ','audio/letters/05-name-waqf.mp3','audio/letters/05-clear-name-waqf.mp3'),
 ('name','و','الْوَاوْ','اَلْوَاوْ','audio/letters/27-name-waqf.mp3','audio/letters/27-clear-name-waqf.mp3'),
 ('word','د','دُبٌّ','دُبٌّ','audio/letters/08-word.mp3','audio/letters/08-clear-word.mp3'),
 ('word','ظ','ظَرْفٌ','ظَرْفٌ','audio/letters/17-word.mp3','audio/letters/17-clear-word.mp3'),
 ('word','ع','عِنَبٌ','عِنَبٌ','audio/letters/18-word.mp3','audio/letters/18-clear-word.mp3'),
 ('word','ف','فِيلٌ','فِيلٌ','audio/letters/20-word.mp3','audio/letters/20-clear-word.mp3'),
 ('word','ل','لَيْمُونٌ','لَيْمُونٌ','audio/letters/23-word.mp3','audio/letters/23-clear-word.mp3'),
 ('word','ه','هِلَالٌ','هِلَالٌ','audio/letters/26-word.mp3','audio/letters/26-clear-word.mp3'),
 ('word','ي','يَدٌ','يَدٌ','audio/letters/28-word.mp3','audio/letters/28-clear-word.mp3'),
 ('vowel','أ','إِ','إِ','audio/letters/01-vowel-1.mp3','audio/letters/01-clear-vowel-1.mp3'),
 ('related','ى','فَتَى','فَتَى','audio/letter-related/08.mp3','audio/letter-related/08-waqf.mp3'),
]
def make(job):
 kind,letter,text,target,old,relative=job
 text=unicodedata.normalize('NFC',text)
 carrier='اِسْمُ الْحَرْفِ' if kind=='name' else 'الصَّوْتُ' if kind=='vowel' else 'الْكَلِمَةُ'
 prompt=f'{carrier}. {target}.'
 raw=cache/(hashlib.sha256(prompt.encode()).hexdigest()[:16]+'.mp3')
 if not raw.exists():
  for attempt in range(4):
   try:
    url='https://translate.google.com/translate_tts?'+urllib.parse.urlencode(dict(ie='UTF-8',client='gtx',tl='ar',q=prompt))
    with urllib.request.urlopen(url,timeout=25) as r:
     payload=r.read();assert r.headers.get('Content-Type','').startswith('audio/') and len(payload)>500
    raw.write_bytes(payload);break
   except Exception:
    if attempt==3:raise
    time.sleep(1+attempt)
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(raw)]))
 scan=subprocess.run(['ffmpeg','-v','info','-i',str(raw),'-af','silencedetect=noise=-43dB:d=0.18','-f','null','-'],capture_output=True,text=True,check=True).stderr
 intervals=[(float(a),float(b)) for a,b in re.findall(r'silence_start: ([\d.]+).*?silence_end: ([\d.]+)',scan,re.S)]
 pauses=[(a,b) for a,b in intervals if a>.25 and b<duration-.35]
 assert pauses, (text,duration,intervals)
 start=pauses[-1][1]-.035
 trailing=[a for a,b in intervals if b>=duration-.08 and a>start+.2]
 end=trailing[-1]+.08 if trailing else duration
 assert end-start>.3,(text,start,end)
 dest=ROOT/relative
 subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',str(raw),'-ss',str(start),'-t',str(end-start),
                 '-af','atempo=0.9,loudnorm=I=-18:TP=-2:LRA=9,apad=pad_dur=0.12','-ar','22050','-ac','1',
                 '-c:a','libmp3lame','-b:a','64k',str(dest)],check=True)
 check=subprocess.run(['ffmpeg','-v','info','-i',str(dest),'-af','volumedetect','-f','null','-'],capture_output=True,text=True,check=True).stderr
 assert float(re.search(r'max_volume: ([\-\d.]+)',check)[1])>-25
 seconds=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(dest)]))
 clip=dict(kind=kind,letter=letter,text=text,path=relative,synthesisText=prompt,trimStart=round(start,4),trimEnd=round(end,4),
           sourceSha256=hashlib.sha256(raw.read_bytes()).hexdigest(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),seconds=round(seconds,4))
 print(text,relative,'target seconds',round(seconds,2),'pause',pauses[-1],flush=True)
 return old,clip

with ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(make,jobs))
replacements={old:clip for old,clip in results}
replacements.update({clip['path']:clip for _,clip in results})
name_path=ROOT/'audio/letter-name-waqf.json';names=json.loads(name_path.read_text())
for clip in names['clips']:
 if clip['path'] in replacements:
  revised=replacements[clip['path']];clip.update({k:v for k,v in revised.items() if k not in ['kind','letter']})
names['date']=datetime.now(timezone.utc).date().isoformat()
name_path.write_text(json.dumps(names,ensure_ascii=False,indent=2)+'\n')
correction_path=ROOT/'audio/pronunciation-corrections.json';corrections=json.loads(correction_path.read_text())
for clip in corrections['clips']:
 if clip['path'] in replacements:clip.update(replacements[clip['path']])
for _,clip in results:
 if clip['kind'] in ['word','vowel'] and not any(c['path']==clip['path'] for c in corrections['clips']):corrections['clips'].append(clip)
correction_path.write_text(json.dumps(corrections,ensure_ascii=False,indent=2)+'\n')
related_path=ROOT/'audio/letter-related-manifest.json';related=json.loads(related_path.read_text())
for clip in related['clips']:
 if clip['path'] in replacements:clip.update(replacements[clip['path']])
related['date']=datetime.now(timezone.utc).date().isoformat()
related_path.write_text(json.dumps(related,ensure_ascii=False,indent=2)+'\n')

# Share the corrected examples with vocabulary playback wherever those exact
# vocalized words occur, retaining one source for the same pronunciation.
vocab_path=ROOT/'audio/vocabulary-manifest.json';vocab=json.loads(vocab_path.read_text());obsolete=set()
by_text={clip['text']:clip for _,clip in results if clip['kind']=='word'}
for clip in vocab['clips']:
 if clip['text'] in by_text:
  obsolete.add(clip['path']);r=by_text[clip['text']];clip.update({k:r[k] for k in ['path','sha256','seconds']})
vocab['date']=datetime.now(timezone.utc).date().isoformat()
vocab_path.write_text(json.dumps(vocab,ensure_ascii=False,indent=2)+'\n')
index=ROOT/'js/vocab-audio-data.js';source=index.read_text();a=source.index('const audio = ')+len('const audio = ');b=source.index(';\nconst api',a)
index.write_text(source[:a]+json.dumps({c['text']:c['path'] for c in vocab['clips']},ensure_ascii=False,separators=(',',':'))+source[b:])
used={c['path'] for c in vocab['clips']}
for old in obsolete:
 if old.startswith('audio/vocabulary/') and old not in used:(ROOT/old).unlink()
for old,_ in results:(ROOT/old).unlink(missing_ok=True)
(ROOT/'audio/letter-pronunciation-revision.json').write_text(json.dumps(dict(date=datetime.now(timezone.utc).date().isoformat(),
 provider='Google Translate TTS (ar), normal-rate contextual synthesis; extracted target only',clips=[c for _,c in results]),ensure_ascii=False,indent=2)+'\n')
print('Updated 11 target recordings, manifests and exact vocabulary aliases; obsolete recordings removed.',flush=True)
sample=['ffmpeg','-nostdin','-y','-v','error']
for _,clip in results:sample += ['-i',str(ROOT/clip['path'])]
filters=';'.join(f'[{i}:a]apad=pad_dur=0.4[a{i}]' for i in range(len(results)))
filters+=';'+''.join(f'[a{i}]' for i in range(len(results)))+f'concat=n={len(results)}:v=0:a=1,loudnorm=I=-17:TP=-2:LRA=9[out]'
sample += ['-filter_complex',filters,'-map','[out]','-c:a','libmp3lame','-b:a','96k','-ar','44100','-ac','1',
           '-metadata','title=حروف من الزيتون · عينة تصحيحات النطق',str(ROOT/'downloads/Huroof-Pronunciation-Corrections.mp3')]
subprocess.run(sample,check=True)
