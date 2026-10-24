"""Build cached DE/AR narration, timed subtitles and a reproducible scene timeline.

No application learning data or audio is modified. Requires FFmpeg/FFprobe.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import re
import subprocess
import time
import urllib.parse
import urllib.request
import wave

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--directory', type=Path, default=Path('/tmp/olive-promo-build'))
args = parser.parse_args()
out = args.directory.resolve()
(out/'voice').mkdir(parents=True, exist_ok=True)
storyboard = json.loads((ROOT/'media/promo/storyboard.json').read_text())

def split(text, limit=155):
    pieces = []
    current = ''
    for sentence in re.split(r'(?<=[.!?؟])\s+', text):
        for word in sentence.split():
            if len(current)+len(word)+1 > limit:
                pieces.append(current)
                current = word
            else:
                current = (current+' '+word).strip()
        if len(current) >= 65:
            pieces.append(current)
            current = ''
    if current: pieces.append(current)
    return pieces

def make_clip(task):
    lang, text = task
    key = lang+'-'+hashlib.sha256(text.encode()).hexdigest()[:16]
    raw, target = out/'voice'/f'{key}.mp3', out/'voice'/f'{key}-paced.wav'
    if not raw.exists():
        query = urllib.parse.urlencode(dict(ie='UTF-8',client='gtx',tl=lang,q=text))
        for attempt in range(4):
            try:
                with urllib.request.urlopen('https://translate.google.com/translate_tts?'+query, timeout=25) as response:
                    data = response.read()
                    assert response.headers.get('Content-Type','').startswith('audio/') and len(data)>500
                raw.write_bytes(data)
                break
            except Exception:
                if attempt==3: raise
                time.sleep(1+attempt)
    if not target.exists():
        pace = '1.13' if lang == 'de' else '1.18'
        subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af',
                        'silenceremove=start_periods=1:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_threshold=-48dB,areverse,atempo='+pace+',loudnorm=I=-17:TP=-2:LRA=9',
                        '-ar','48000','-ac','1','-c:a','pcm_s16le',str(target)],check=True)
    with wave.open(str(target)) as audio:
        assert audio.getframerate()==48000 and audio.getsampwidth()==2
        pcm = audio.readframes(audio.getnframes())
    return dict(text=text, file=str(target), pcm=pcm, duration=len(pcm)/96000)

tasks = [(lang, text) for lang in ['de','ar'] for scene in storyboard['scenes'] for text in split(scene[lang]['speech'])]
with ThreadPoolExecutor(max_workers=4) as pool:
    clips = dict(zip(tasks,pool.map(make_clip,tasks)))

def stamp(seconds):
    ms = round(seconds*1000)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'

for lang in ['de','ar']:
    timeline = []
    subtitles = []
    chunks = []
    position = 0
    def silence(seconds):
        global position
        frames = round(seconds*48000)
        chunks.append(b'\0\0'*frames)
        position += frames/48000
    for index, scene in enumerate(storyboard['scenes']):
        start = position
        silence(.42)
        for text in split(scene[lang]['speech']):
            clip = clips[(lang,text)]
            subtitles.append(dict(start=position,end=position+clip['duration'],text=text))
            chunks.append(clip['pcm'])
            position += clip['duration']
            silence(.12)
        silence(max(.9,6.8-(position-start)))
        timeline.append(dict(id=scene['id'],index=index,start=start,end=position,**scene[lang]))
    with wave.open(str(out/f'narration-{lang}.wav'),'wb') as audio:
        audio.setnchannels(1);audio.setsampwidth(2);audio.setframerate(48000)
        audio.writeframes(b''.join(chunks))
    data = dict(language=lang,duration=position,provider='Google Translate TTS',meta=storyboard['languages'][lang],scenes=timeline,subtitles=subtitles)
    (out/f'timeline-{lang}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    srt = '\n\n'.join(f'{i+1}\n{stamp(s["start"])} --> {stamp(s["end"])}\n{s["text"]}' for i,s in enumerate(subtitles))+'\n'
    (out/f'Huroof-Werbung-{lang.upper()}.srt').write_text(srt)
    print(f'{lang}: {len(timeline)} scenes, {len(subtitles)} timed narration clips, {position:.2f} seconds',flush=True)
