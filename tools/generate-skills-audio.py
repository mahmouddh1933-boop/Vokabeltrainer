"""Bundle synthetic Arabic listening/dialogue/reading; no runtime network dependency."""
from pathlib import Path
import json, hashlib, urllib.request, urllib.parse, time, subprocess, concurrent.futures, re
ROOT=Path(__file__).resolve().parents[1];CACHE=Path('/tmp/olive-skills-audio-cache');CACHE.mkdir(exist_ok=True)
OUT=ROOT/'audio/skills';OUT.mkdir(exist_ok=True)
data=json.loads((ROOT/'data/skills/units.json').read_text())
def run(cmd):return subprocess.run(cmd,check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE).stdout

def clip(job):
    text,path=job;digest=hashlib.sha256(text.encode()).hexdigest();base=CACHE/digest
    if not base.with_suffix('.mp3').exists():
        # Split on word boundaries; retain every word and all punctuation.
        words=text.split();chunks=[];part=''
        for word in words:
            if part and len(part+' '+word)>170:chunks.append(part);part=''
            part=(part+' '+word).strip()
        if part:chunks.append(part)
        assert ' '.join(chunks)==' '.join(words)
        segments=[]
        for i,chunk in enumerate(chunks):
            target=CACHE/f'{digest}-{i}.mp3'
            if not target.exists():
                url='https://translate.google.com/translate_tts?'+urllib.parse.urlencode(dict(ie='UTF-8',client='tw-ob',tl='ar',q=chunk))
                for attempt in range(6):
                    try:
                        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
                        payload=urllib.request.urlopen(req,timeout=45).read()
                        if len(payload)<300:raise ValueError('Audio response too small')
                        target.write_bytes(payload);break
                    except Exception:
                        if attempt==5:raise
                        time.sleep(min(8,attempt+1))
            segments.append(target)
        listing=base.with_suffix('.txt');listing.write_text('\n'.join("file '"+str(p)+"'" for p in segments))
        run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(listing),'-af','atempo=0.92,loudnorm=I=-18:TP=-3:LRA=9','-ac','1','-ar','22050','-b:a','48k',str(base.with_suffix('.mp3'))])
    target=ROOT/path;target.write_bytes(base.with_suffix('.mp3').read_bytes())
    duration=float(run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(target)]))
    print(path,round(duration,1),flush=True)
    return dict(text=text,path=path,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),duration=duration)
jobs=[]
for u in data['units']:
    jobs += [(' '.join(row['speaker']+': '+row['text'] for row in u['secondDialogue']),f"audio/skills/{u['id']}-dialogue-2.mp3")]
    jobs += [(u['listening']['script'],u['listening']['audio']), (u['reading'],f"audio/skills/{u['id']}-reading.mp3"), (' '.join(row['speaker']+': '+row['text'] for row in u['dialogue']),f"audio/skills/{u['id']}-dialogue.mp3")]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:clips=list(pool.map(clip,jobs))
(ROOT/'audio/skills-manifest.json').write_text(json.dumps(dict(provider='Google Translate TTS',voice='ar',synthetic=True,clips=clips),ensure_ascii=False,indent=2)+'\n')
print('Verified',len(clips),'local clips')
