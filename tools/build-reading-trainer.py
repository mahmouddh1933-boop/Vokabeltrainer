"""Compile the curated 150-word bank and local, audio-clock-aligned practice tracks.

Audio build: PYTHONPATH=<piper install> python tools/build-reading-trainer.py
  --audio --model /path/to/ar_JO-kareem-medium.onnx
Data-only rebuilds require only Python and the already generated manifest.
No account, network TTS service, runtime speech engine or paid API is used.
"""
import argparse
import array
import hashlib
import json
import re
import subprocess
import sys
import unicodedata
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--audio', action='store_true')
parser.add_argument('--model', type=Path)
parser.add_argument('--cache', type=Path, default=Path('/tmp/olive-reading-trainer/clips'))
args = parser.parse_args()
source = json.loads((ROOT/'data/reading-trainer-source.json').read_text())
manifest_path = ROOT/'audio/reading-trainer-manifest.json'
graphemes = lambda s: re.findall(r'[^\u064b-\u065f\u0670][\u064b-\u065f\u0670]*', unicodedata.normalize('NFC', s))
consonants = dict(zip('بتثجحخدذرزسشصضطظعغفقكلمنهوي',
    ['b','t','θ','dʒ','ħ','x','d','ð','r','z','s','ʃ','sˤ','dˤ','tˤ','ðˤ','ʕ','ɣ','f','q','k','l','m','n','h','w','j']))
consonants.update({'أ':'ʔ','إ':'ʔ','ء':'ʔ','ؤ':'ʔ','ئ':'ʔ','ا':'ʔ','ة':'h'})
vowels = {'َ':'a','ِ':'i','ُ':'u'}


def expanded_letters(text):
    result = []
    for i, g in enumerate(graphemes(text)):
        if 'ّ' in g:
            result.append((g[0], i))
        result.append((g[0], i))
    return result


def phonemes(text):
    """Explicit MSA segment spelling: bypass G2P letter-name/diacritic mistakes.

    Long vowels remain one nucleus; sukūn adds no vowel; final tāʾ marbūṭa is
    /h/ at pause. The handwritten syllable bank determines every boundary.
    """
    gs = graphemes(text)
    result = ''
    i = 0
    while i < len(gs):
        g = gs[i]
        c = g[0]
        if c == 'ى':
            raise ValueError('Alif maqṣūra must follow fatḥa: '+text)
        result += consonants[c] * (2 if 'ّ' in g else 1)
        vowel = next((vowels[m] for m in g[1:] if m in vowels), '')
        if vowel:
            following = gs[i+1] if i+1 < len(gs) else ''
            is_long = following and ((vowel == 'a' and following[0] in 'اى') or
                (vowel == 'i' and following[0] == 'ي') or (vowel == 'u' and following[0] == 'و'))
            # A written sukūn on yāʾ/wāw makes it a consonant, e.g. هَدِيْ / يَة.
            if is_long and not any(mark in following for mark in 'َُِّْ'):
                result += vowel+'ː'
                i += 1
            else:
                result += vowel
        i += 1
    assert sum(result.count(v) for v in 'aiu') == 1, (text, result)
    return result


def stressed(ipa):
    return re.sub(r'([aiu])', r'ˈ\1', ipa, count=1)


def whole_ipa(parts):
    ps = [phonemes(p) for p in parts]
    # MSA stress: final superheavy, otherwise heavy penult, otherwise antepenult.
    def weight(p):
        tail = re.split('[aiu]',p)[-1]
        return (2 if 'ː' in tail else 1) + len(tail.replace('ː','').replace('ˤ','').replace('ʒ',''))
    at = len(ps)-1 if weight(ps[-1]) >= 3 else max(0,len(ps)-2) if len(ps)>1 and weight(ps[-2])>=2 else max(0,len(ps)-3)
    return ''.join(stressed(p) if i==at else p for i,p in enumerate(ps))


names = {
    'ا': ('أَلِفْ','ˈalif'), 'أ':('هَمْزَةْ','hˈamzah'), 'إ':('هَمْزَةْ','hˈamzah'),
    'ء':('هَمْزَةْ','hˈamzah'), 'ؤ':('هَمْزَة عَلَى وَاوْ','hˈamzah ʕalˈaː wˈaːw'),
    'ئ':('هَمْزَة عَلَى نَبْرَة','hˈamzah ʕalˈaː nˈabrah'),
    'ى':('أَلِفْ مَقْصُورَة','ˈalif maqsˤˈuːrah'), 'ة':('تَاءْ مَرْبُوطَة','tˈaːʔ marbˈuːtˤah'),
    'ب':('بَاءْ','bˈaːʔ'), 'ت':('تَاءْ','tˈaːʔ'), 'ث':('ثَاءْ','θˈaːʔ'),
    'ج':('جِيمْ','dʒˈiːm'), 'ح':('حَاءْ','ħˈaːʔ'), 'خ':('خَاءْ','xˈaːʔ'),
    'د':('دَالْ','dˈaːl'), 'ذ':('ذَالْ','ðˈaːl'), 'ر':('رَاءْ','rˈaːʔ'),
    'ز':('زَايْ','zˈaːj'), 'س':('سِينْ','sˈiːn'), 'ش':('شِينْ','ʃˈiːn'),
    'ص':('صَادْ','sˤˈaːd'), 'ض':('ضَادْ','dˤˈaːd'), 'ط':('طَاءْ','tˤˈaːʔ'),
    'ظ':('ظَاءْ','ðˤˈaːʔ'), 'ع':('عَيْنْ','ʕˈajn'), 'غ':('غَيْنْ','ɣˈajn'),
    'ف':('فَاءْ','fˈaːʔ'), 'ق':('قَافْ','qˈaːf'), 'ك':('كَافْ','kˈaːf'),
    'ل':('لَامْ','lˈaːm'), 'م':('مِيمْ','mˈiːm'), 'ن':('نُونْ','nˈuːn'),
    'ه':('هَاءْ','hˈaːʔ'), 'و':('وَاوْ','wˈaːw'), 'ي':('يَاءْ','jˈaːʔ')
}
words=[]
for level in source['levels']:
    assert len(level['words'])==50
    for n,(segmented,meaning) in enumerate(level['words']):
        parts=segmented.split('|')
        word=unicodedata.normalize('NFC', level.get('spellings',{}).get(segmented,''.join(parts)))
        expanded=expanded_letters(word)
        assert ''.join(c for c,_ in expanded)==''.join(c for c,_ in expanded_letters(''.join(parts))),word
        syllables=[];offset=0
        for part in parts:
            length=len(expanded_letters(part))
            syllables.append({'text':part,'letters':sorted(set(i for _,i in expanded[offset:offset+length]))})
            offset+=length
        letters=[{'text':g,'name':names[g[0]][0]} for g in graphemes(word)]
        words.append({'id':f'rt-{level["id"]}-{n+1:02}','level':level['id'],'word':word,'de':meaning,
            'letters':letters,'syllables':syllables})
assert len({w['word'] for w in words})==150

if args.audio:
    if not args.model:parser.error('--model is required with --audio')
    import onnxruntime as ort
    from piper import PiperVoice, SynthesisConfig
    ort.disable_telemetry_events()
    voice=PiperVoice.load(args.model)
    config=SynthesisConfig(length_scale=1.45,noise_scale=.5,noise_w_scale=.65)
    rate=voice.config.sample_rate
    args.cache.mkdir(parents=True,exist_ok=True)
    audio_dir=ROOT/'audio/reading-trainer';audio_dir.mkdir(exist_ok=True)
    clips=[]
    def synth(ipa):
        assert all(p in voice.config.phoneme_id_map for p in ipa),ipa
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
        # Very short isolated CVs need extra articulation time for a beginner.
        if len(raw)/(rate*2)<.3:
            short=args.cache/'short.wav';slow=args.cache/'slow.wav'
            with wave.open(str(short),'wb') as f:
                f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(raw)
            factor=max(.5,len(raw)/(rate*2)/.3)
            subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',str(short),'-af',f'atempo={factor}',str(slow)],check=True)
            with wave.open(str(slow),'rb') as f:raw=f.readframes(f.getnframes())
        return raw
    for w in words:
        chunks=[];events=[];cursor=0
        def pause(seconds):
            global cursor
            raw=b'\0\0'*round(seconds*rate);chunks.append(raw);cursor+=len(raw)/(rate*2)
        def add(stage,index,ipa):
            global cursor
            raw=synth(ipa);start=cursor
            chunks.append(raw);cursor+=len(raw)/(rate*2)
            events.append({'stage':stage,'index':index,'start':round(start,4),'end':round(cursor,4)})
        pause(.15)
        for i,g in enumerate(w['letters']):
            add('letters',i,names[g['text'][0]][1]);pause(.28)
        pause(.6)
        for i,s in enumerate(w['syllables']):
            add('syllables',i,stressed(phonemes(s['text'])));pause(.32)
        pause(.6)
        ipa=whole_ipa([s['text'] for s in w['syllables']])
        add('word',0,ipa);pause(.25)
        wavpath=args.cache/'track.wav'
        with wave.open(str(wavpath),'wb') as f:
            f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(chunks))
        relative=f'audio/reading-trainer/{w["id"]}.mp3'
        subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',str(wavpath),'-ac','1','-ar',str(rate),
            '-af','volume=0.78','-c:a','libmp3lame','-b:a','64k','-write_xing','1',str(ROOT/relative)],check=True)
        duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(ROOT/relative)]))
        assert abs(duration-cursor)<.15,(w['word'],duration,cursor)
        clips.append({'id':w['id'],'text':w['word'],'path':relative,'seconds':round(duration,4),
            'sha256':hashlib.sha256((ROOT/relative).read_bytes()).hexdigest(),'wordPhonemes':ipa,'events':events})
        print(w['id'],w['word'],round(cursor,2),'seconds',flush=True)
    manifest_path.write_text(json.dumps({'version':1,'provider':'Piper / ar_JO-kareem-medium; explicit MSA phonemes',
        'sampleRate':rate,'letterStage':'Written letter names, not isolated consonant sounds.',
        'syllableStage':'Curated syllables. Shadda unfolds across syllables; tāʾ marbūṭa is /h/ at pause.',
        'clips':clips},ensure_ascii=False,indent=2)+'\n')

manifest=json.loads(manifest_path.read_text())
byid={c['id']:c for c in manifest['clips']}
for w in words:
    clip=byid[w['id']]
    assert clip['text']==w['word']
    w.update({k:clip[k] for k in ['path','seconds','events']})
data={'version':1,'levels':[{k:v for k,v in l.items() if k not in ['words','spellings']} for l in source['levels']], 'words':words}
(ROOT/'js/reading-trainer-data.js').write_text('/* Generated from the curated reading-trainer-source.json and local audio manifest. */\n'
    +'(() => { "use strict"; const data = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))
    +'; if (typeof module !== "undefined" && module.exports) module.exports = data; else window.ArabicReadingTrainer = data; })();\n')
print('Built 150 words, 3 levels, with local audio and speech-clock highlight ranges.')
