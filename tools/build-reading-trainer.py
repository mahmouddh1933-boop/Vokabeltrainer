"""Compile local reading tracks from checked, downloaded Arabic recordings.

Audio: python tools/build-reading-trainer.py --recordings /path/to/report.json
Data only: python tools/build-reading-trainer.py
No neural model or live speech service is used while the learner runs the app.
"""
import argparse,array,functools,hashlib,json,subprocess,sys,unicodedata,wave,shutil
from pathlib import Path
from reading_trainer_phonetics import graphemes,reading_sounds,reading_prefixes,whole_ipa

ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser()
p.add_argument('--recordings',type=Path,help='Complete Google Arabic speech-cache report')
args=p.parse_args()
source=json.loads((ROOT/'data/reading-trainer-source.json').read_text())
manifest_path=ROOT/'audio/reading-trainer-manifest.json'
words=[]
for level in source['levels']:
    assert len(level['words'])==50
    for n,(segmented,meaning) in enumerate(level['words']):
        word=unicodedata.normalize('NFC',level.get('spellings',{}).get(segmented,segmented.replace('|','')))
        ipa=whole_ipa(segmented.split('|'))
        words.append({'id':f'rt-{level["id"]}-{n+1:02}','level':level['id'],'word':word,'de':meaning,
            'letters':[{'text':g} for g in graphemes(word)],'sounds':reading_sounds(word),
            'prefixes':reading_prefixes(word,ipa),'wordPhonemes':ipa})
assert len({w['word'] for w in words})==150

if args.recordings:
    report_path=args.recordings.resolve()
    report=json.loads(report_path.read_text())
    # Optional diagnostic prompts may fail; every required learning fragment
    # must have a verified recording before any replacement track is produced.
    recordings={c['text']:c for c in report['clips'] if 'path' in c}
    needed={w['word'] for w in words}|{s['spokenText'] for w in words for s in w['sounds']}|{s['text'] for w in words for s in w['prefixes']}
    assert not (needed-recordings.keys()),'Missing source recordings: '+repr(sorted(needed-recordings.keys()))
    rate=22050
    @functools.lru_cache(maxsize=None)
    def pcm(text):
        c=recordings[text]
        source_file=report_path.parent/Path(c['path']).name
        assert source_file.resolve().is_relative_to(report_path.parent)
        assert hashlib.sha256(source_file.read_bytes()).hexdigest()==c['sha256'],text
        raw=subprocess.check_output(['ffmpeg','-nostdin','-v','error','-i',str(source_file),'-ac','1','-ar',str(rate),'-f','s16le','-'])
        a=array.array('h',raw)
        if sys.byteorder!='little':a.byteswap()
        peak=max(abs(s) for s in a)
        assert peak>1200,(text,'No audible source signal')
        active=[i for i,s in enumerate(a) if abs(s)>max(32,peak*.002)]
        # Preserve low-energy fricatives and vowel tails, rather than clipping
        # the first/last phoneme with an aggressive silence threshold.
        first=max(0,active[0]-round(.08*rate));last=min(len(a),active[-1]+round(.1*rate))
        a=array.array('h',(round(s*.78*32767/peak) for s in a[first:last]))
        if sys.byteorder!='little':a.byteswap()
        raw=a.tobytes()
        assert .12<len(raw)/(2*rate)<12,(text,'Unexpected speech duration')
        return raw

    class Track:
        def __init__(self):self.chunks=[];self.events=[];self.cursor=0
        def pause(self,seconds):
            raw=b'\0\0'*round(seconds*rate);self.chunks.append(raw);self.cursor+=len(raw)/(rate*2)
        def add(self,stage,index,text,reference_ipa):
            raw=pcm(text);start=self.cursor;self.chunks.append(raw);self.cursor+=len(raw)/(rate*2)
            self.events.append({'stage':stage,'index':index,'spokenText':text,'phonemes':reference_ipa,
                'sourceSha256':recordings[text]['sha256'],'start':round(start,4),'end':round(self.cursor,4)})

    audio_dir=ROOT/'audio/reading-trainer';audio_dir.mkdir(exist_ok=True)
    previous=json.loads(manifest_path.read_text())['clips'] if manifest_path.exists() else []
    output=[]
    import tempfile
    with tempfile.TemporaryDirectory(prefix='olive-reading-build-',dir='/tmp') as tmp:
        for w in words:
            t=Track();t.pause(.15)
            for i,s in enumerate(w['sounds']):t.add('letters',i,s['spokenText'],s['phonemes']);t.pause(.32)
            t.pause(.55)
            for i,s in enumerate(w['prefixes']):t.add('prefixes',i,s['text'],s['phonemes']);t.pause(.25)
            t.pause(.55);t.add('word',0,w['word'],w['wordPhonemes']);t.pause(.25)
            wavpath=Path(tmp)/'track.wav'
            with wave.open(str(wavpath),'wb') as f:
                f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(t.chunks))
            relative=f'audio/reading-trainer/{w["id"]}-voice-v3.mp3'
            staged=Path(tmp)/Path(relative).name
            subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-i',str(wavpath),'-c:a','libmp3lame','-b:a','64k','-write_xing','1',str(staged)],check=True)
            duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(staged)]))
            assert abs(duration-t.cursor)<.15
            output.append({'id':w['id'],'text':w['word'],'path':relative,'seconds':round(duration,4),
                'sha256':hashlib.sha256(staged.read_bytes()).hexdigest(),'wordPhonemes':w['wordPhonemes'],'events':t.events})
            print(w['id'],w['word'],round(duration,2),'seconds',flush=True)
        # Keep the last complete edition intact if any source is silent or absent.
        for clip in output:shutil.copyfile(Path(tmp)/Path(clip['path']).name,ROOT/clip['path'])
    source_commit=subprocess.check_output(['git','-C',str(report_path.parent),'rev-parse','HEAD'],text=True).strip()
    manifest_path.write_text(json.dumps({'version':3,'provider':report['provider']+'; downloaded and compiled locally',
        'sampleRate':rate,'sourceCommit':source_commit,'sourceReportSha256':hashlib.sha256(report_path.read_bytes()).hexdigest(),
        'pronunciationReference':'IPA fields document the intended reading; synthesis uses the exact vocalized Arabic text in spokenText, not IPA.',
        'letterStage':'Vocalized sounds only. Long vowels, codas and shadda use their actual preceding context; no bare letter names.',
        'prefixStage':'First 2, 3, 4... written letters up to the whole word.','clips':output},ensure_ascii=False,indent=2)+'\n')
    used={c['path'] for c in output}
    for old in previous:
        path=ROOT/old['path']
        if old['path'] not in used and path.resolve().is_relative_to(audio_dir.resolve()):path.unlink(missing_ok=True)

manifest=json.loads(manifest_path.read_text())
assert manifest['version']==3,'Compile the replacement voice recordings first.'
byid={c['id']:c for c in manifest['clips']}
for w in words:
    clip=byid[w['id']];assert clip['text']==w['word']
    w.update({k:clip[k] for k in ['path','seconds','events']})
sentence_source=ROOT/'data/reading-trainer-sentences.json'
sentence_bank=json.loads(sentence_source.read_text())
sentence_manifest=json.loads((ROOT/'audio/reading-sentences-manifest.json').read_text())
assert sentence_manifest['complete']
assert sentence_manifest['sourceSha256']==hashlib.sha256(sentence_source.read_bytes()).hexdigest(),'Sentence text changed: regenerate recordings.'
sentence_audio={c['text']:c for c in sentence_manifest['clips']}
sentence_words={w['id']:w['sentences'] for w in sentence_bank['words']}
assert set(sentence_words)==set(byid)
for w in words:
    sentences=sentence_words[w['id']]
    assert len(sentences)==2
    w['sentences']=[]
    for sentence in sentences:
        assert sentence['ar'].count(sentence['focus'])==1
        recording=sentence_audio[sentence['ar']]
        path=ROOT/recording['path']
        assert path.resolve().is_relative_to((ROOT/'audio/reading-sentences').resolve())
        assert hashlib.sha256(path.read_bytes()).hexdigest()==recording['sha256']
        w['sentences'].append({**sentence,'path':recording['path'],'seconds':recording['seconds']})
data={'version':4,'levels':[{k:v for k,v in l.items() if k not in ['words','spellings']} for l in source['levels']],'words':words}
(ROOT/'js/reading-trainer-data.js').write_text('/* Generated from the vocalized bank and replacement Arabic voice recordings. */\n'
    +'(() => { "use strict"; const data = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))
    +'; if (typeof module !== "undefined" && module.exports) module.exports = data; else window.ArabicReadingTrainer = data; })();\n')
print('Built 150 reading entries: sounds, cumulative word beginnings, whole words and 300 application sentences.')
