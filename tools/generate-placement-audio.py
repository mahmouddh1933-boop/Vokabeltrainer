"""Generate and validate the ten local listening texts used only by placement tests."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib,json,subprocess,urllib.parse,urllib.request,time,unicodedata,re
ROOT=Path(__file__).resolve().parents[1]
for filename,globalname,folder,manifestname in [('js/placement-data.js','ArabicPlacementData','placement','placement-manifest.json')]:
    data=json.loads(subprocess.check_output(['node','-e', 'process.stdout.write(JSON.stringify(require(process.argv[1])))', str(ROOT/filename)],text=True))
    texts=[unicodedata.normalize('NFC',p['text']) for p in data['passages'].values() if p['kind']=='audio']
    dest=ROOT/'audio'/folder;dest.mkdir(exist_ok=True)
    def make(text):
        relative=f'audio/{folder}/{hashlib.sha256(text.encode()).hexdigest()[:16]}.mp3';target=ROOT/relative
        if not target.exists():
            for attempt in range(4):
                try:
                    query=urllib.parse.urlencode(dict(ie='UTF-8',client='gtx',tl='ar',ttsslow='1',q=text))
                    with urllib.request.urlopen('https://translate.google.com/translate_tts?'+query,timeout=30) as response:
                        payload=response.read();assert 'audio' in response.headers.get('Content-Type','') and len(payload)>500
                    target.write_bytes(payload);break
                except Exception:
                    if attempt==3:raise
                    time.sleep(1+attempt)
        duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(target)]))
        decoded=subprocess.run(['ffmpeg','-v','info','-i',str(target),'-af','silencedetect=noise=-40dB:d=0.05,volumedetect','-f','null','-'],capture_output=True,text=True,check=True).stderr
        peak=float(re.search(r'max_volume: ([\-\d.]+) dB',decoded).group(1));silent=sum(float(v) for v in re.findall(r'silence_duration: ([\d.]+)',decoded));assert peak>-30 and duration-silent>=.15,(relative,peak,duration,silent)
        return dict(text=text,path=relative,sha256=hashlib.sha256(target.read_bytes()).hexdigest())
    with ThreadPoolExecutor(max_workers=3) as pool: clips=list(pool.map(make,texts))
    data['audio']={c['text']:c['path'] for c in clips}
    (ROOT/filename).write_text('(() => {const data='+json.dumps(data,ensure_ascii=False,indent=2)+';\nif(typeof module!=="undefined"&&module.exports)module.exports=data;else window.'+globalname+'=data;})();\n')
    (ROOT/'audio'/manifestname).write_text(json.dumps(dict(date=datetime.now(timezone.utc).date().isoformat(),provider='Google Translate TTS (ar)',slow=True,clips=clips),ensure_ascii=False,indent=2)+'\n')
    print(f'{folder}: {len(clips)} recordings downloaded, fully decoded and checked.',flush=True)
