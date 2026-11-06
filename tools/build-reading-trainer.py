"""Compile 150 words: vocalized letter sounds, cumulative prefixes, whole word.

PYTHONPATH=<piper install> python tools/build-reading-trainer.py --audio --model <onnx>
A data-only rebuild uses the checked-in audio manifest; no network API is used.
"""
import argparse
import array
import hashlib
import json
import subprocess
import sys
import unicodedata
import wave
from pathlib import Path
from reading_trainer_phonetics import graphemes, reading_sounds, reading_prefixes, whole_ipa

ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser()
p.add_argument('--audio',action='store_true')
p.add_argument('--model',type=Path)
p.add_argument('--cache',type=Path,default=Path('/tmp/olive-reading-trainer/clips'))
args=p.parse_args()
source=json.loads((ROOT/'data/reading-trainer-source.json').read_text())
manifest_path=ROOT/'audio/reading-trainer-manifest.json'
words=[]
for level in source['levels']:
    assert len(level['words'])==50
    for n,(segmented,meaning) in enumerate(level['words']):
        parts=segmented.split('|')
        word=unicodedata.normalize('NFC',level.get('spellings',{}).get(segmented,''.join(parts)))
        ipa=whole_ipa(parts)
        words.append({'id':f'rt-{level["id"]}-{n+1:02}','level':level['id'],'word':word,'de':meaning,
            'letters':[{'text':g} for g in graphemes(word)],'sounds':reading_sounds(word),
            'prefixes':reading_prefixes(word,ipa),'wordPhonemes':ipa})
assert len({w['word'] for w in words})==150

if args.audio:
    if not args.model:p.error('--model is required with --audio')
    import onnxruntime as ort
    from piper import PiperVoice,SynthesisConfig
    ort.disable_telemetry_events()
    voice=PiperVoice.load(args.model)
    config=SynthesisConfig(length_scale=1.45,noise_scale=.5,noise_w_scale=.65)
    rate=voice.config.sample_rate
    args.cache.mkdir(parents=True,exist_ok=True)
    audio_dir=ROOT/'audio/reading-trainer';audio_dir.mkdir(exist_ok=True)
    previous=json.loads(manifest_path.read_text())['clips'] if manifest_path.exists() else []
    clips=[]

    def synth(ipa):
        assert all(c in voice.config.phoneme_id_map for c in ipa),ipa
        key=hashlib.sha256(('kareem-medium-explicit-msa-v2-1.45-0.5-0.65|'+ipa).encode()).hexdigest()
        path=args.cache/(key+'.wav')
        if not path.exists():
            with wave.open(str(path),'wb') as wav:voice.synthesize_wav('[['+ipa+'.]]',wav,syn_config=config)
        with wave.open(str(path),'rb') as wav:
            assert wav.getframerate()==rate and wav.getnchannels()==1 and wav.getsampwidth()==2
            raw=wav.readframes(wav.getnframes())
        samples=array.array('h',raw)
        if sys.byteorder!='little':samples.byteswap()
        active=[i for i,v in enumerate(samples) if abs(v)>180]
        assert active and max(abs(v) for v in samples)>1200,(ipa,'quiet')
        start=max(0,active[0]-int(.045*rate));end=min(len(samples),active[-1]+int(.08*rate))
        raw=raw[start*2:end*2]
        assert .09<len(raw)/(rate*2)<10,(ipa,len(raw)/(rate*2))
        if len(raw)/(rate*2)<.3:
            short=args.cache/'short.wav';slow=args.cache/'slow.wav'
            with wave.open(str(short),'wb') as f:
                f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(raw)
            factor=max(.5,len(raw)/(rate*2)/.3)
            subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',str(short),'-af',f'atempo={factor}',str(slow)],check=True)
            with wave.open(str(slow),'rb') as f:raw=f.readframes(f.getnframes())
        return raw

    class Track:
        def __init__(self):self.chunks=[];self.events=[];self.cursor=0
        def pause(self,seconds):
            raw=b'\0\0'*round(seconds*rate);self.chunks.append(raw);self.cursor+=len(raw)/(rate*2)
        def add(self,stage,index,text,ipa):
            raw=synth(ipa);start=self.cursor
            self.chunks.append(raw);self.cursor+=len(raw)/(rate*2)
            self.events.append({'stage':stage,'index':index,'spokenText':text,'phonemes':ipa,
                'start':round(start,4),'end':round(self.cursor,4)})

    for w in words:
        track=Track();track.pause(.15)
        for i,sound in enumerate(w['sounds']):
            track.add('letters',i,sound['spokenText'],sound['phonemes']);track.pause(.4)
        track.pause(.6)
        for i,prefix in enumerate(w['prefixes']):
            track.add('prefixes',i,prefix['text'],prefix['phonemes']);track.pause(.28)
        track.pause(.6)
        track.add('word',0,w['word'],w['wordPhonemes']);track.pause(.25)
        wavpath=args.cache/'track.wav'
        with wave.open(str(wavpath),'wb') as f:
            f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(track.chunks))
        # Distinct URLs prevent an installed PWA replaying the old letter names.
        relative=f'audio/reading-trainer/{w["id"]}-sounds-v2.mp3'
        subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',str(wavpath),'-ac','1','-ar',str(rate),
            '-af','volume=0.78','-c:a','libmp3lame','-b:a','64k','-write_xing','1',str(ROOT/relative)],check=True)
        duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(ROOT/relative)]))
        assert abs(duration-track.cursor)<.15,(w['word'],duration,track.cursor)
        clips.append({'id':w['id'],'text':w['word'],'path':relative,'seconds':round(duration,4),
            'sha256':hashlib.sha256((ROOT/relative).read_bytes()).hexdigest(),'wordPhonemes':w['wordPhonemes'],
            'events':track.events})
        print(w['id'],w['word'],round(track.cursor,2),'seconds',flush=True)
    manifest_path.write_text(json.dumps({'version':2,'provider':'Piper / ar_JO-kareem-medium; explicit MSA phonemes',
        'sampleRate':rate,'letterStage':'Vocalized letter sounds only. Codas/shadda use their actual preceding context; no letter names.',
        'prefixStage':'Cumulative word beginnings: first 2 written letters, then 3, then 4, up to the full word.',
        'clips':clips},ensure_ascii=False,indent=2)+'\n')
    used={c['path'] for c in clips}
    for old in previous:
        path=ROOT/old['path']
        if old['path'] not in used and path.resolve().is_relative_to(audio_dir.resolve()):path.unlink(missing_ok=True)

manifest=json.loads(manifest_path.read_text())
assert manifest['version']==2,'Rebuild audio for the corrected sound/prefix stages first.'
byid={c['id']:c for c in manifest['clips']}
for w in words:
    clip=byid[w['id']]
    assert clip['text']==w['word'] and clip['wordPhonemes']==w['wordPhonemes']
    w.update({k:clip[k] for k in ['path','seconds','events']})
data={'version':2,'levels':[{k:v for k,v in l.items() if k not in ['words','spellings']} for l in source['levels']],'words':words}
(ROOT/'js/reading-trainer-data.js').write_text('/* Generated from reading-trainer-source.json and the corrected sounds/prefix audio manifest. */\n'
    +'(() => { "use strict"; const data = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))
    +'; if (typeof module !== "undefined" && module.exports) module.exports = data; else window.ArabicReadingTrainer = data; })();\n')
print('Built 150 words: vocalized sounds, cumulative prefixes from 2 letters, whole word.')
