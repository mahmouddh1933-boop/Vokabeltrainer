"""Create offline German narration and timed subtitles for the detailed app tour.
Requires piper-tts and the CC0 Thorsten medium model; never contacts user accounts.
"""
import argparse,hashlib,json,re,wave,textwrap,time,subprocess
from pathlib import Path
from piper import PiperVoice,SynthesisConfig
import onnxruntime as ort
ort.disable_telemetry_events()
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-tour-build'));p.add_argument('--model',type=Path,required=True);a=p.parse_args();out=a.directory
(out/'voice').mkdir(parents=True,exist_ok=True)
data=json.loads((ROOT/'media/tutorial-de/storyboard.json').read_text())
voice=PiperVoice.load(a.model)
config=SynthesisConfig(length_scale=1.06,noise_scale=.6,noise_w_scale=.8)

def pieces(text):
 result=[]
 for sentence in re.split(r'(?<=[.!?])\s+',text):
  result.extend(textwrap.wrap(sentence,width=155,break_long_words=False,break_on_hyphens=False))
 return result

def stamp(value):
 ms=round(value*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'

rate=voice.config.sample_rate
position=0;chunks=[];subtitles=[];chapters=[];parts=[]
def pause(seconds):
 global position
 n=round(seconds*rate);chunks.append(b'\0\0'*n);position+=n/rate
for i,c in enumerate(data['chapters']):
 start=position;pause(.4)
 for j,part in enumerate(c['parts']):
  first=position
  for text in pieces(part['text']):
   key=hashlib.sha256(('thorsten-medium-1.06-0.6-0.8|'+text).encode()).hexdigest()[:24]
   path=out/'voice'/f'{key}.wav'
   if not path.exists():
    with wave.open(str(path),'wb') as audio:voice.synthesize_wav(text,audio,syn_config=config)
   with wave.open(str(path),'rb') as audio:
    assert audio.getnchannels()==1 and audio.getsampwidth()==2 and audio.getframerate()==rate
    raw=audio.readframes(audio.getnframes());duration=len(raw)/(rate*2)
   assert duration>.2 and any(raw)
   subtitles.append({'start':position,'end':position+duration,'text':text})
   chunks.append(raw);position+=duration;pause(.13)
  if part.get('demoAudio'):
   source=(ROOT/part['demoAudio']).resolve();assert source.is_relative_to(ROOT/'audio') and source.is_file()
   sample=out/'voice'/('demo-'+hashlib.sha256(source.read_bytes()).hexdigest()[:16]+'.wav')
   if not sample.exists():subprocess.run(['ffmpeg','-y','-v','error','-i',str(source),'-af','loudnorm=I=-18:TP=-2:LRA=8','-ar',str(rate),'-ac','1','-c:a','pcm_s16le',str(sample)],check=True)
   with wave.open(str(sample),'rb') as f:raw=f.readframes(f.getnframes())
   pause(.3);duration=len(raw)/(rate*2)
   subtitles.append({'start':position,'end':position+duration+.3,'text':part['demoCaption']})
   chunks.append(raw);position+=duration;pause(.3)
  pause(.55)
  parts.append({'chapter':i,'index':len(parts),'id':part['shot'],'start':first,'end':position,'text':part['text']})
 pause(.45)
 chapters.append({'index':i,'id':c['id'],'title':c['title'],'bullets':c['bullets'],'start':start,'end':position})
 print(f'{i+1:02d}/{len(data["chapters"])} {c["id"]}: {position-start:.1f}s',flush=True)
parts[0]['start']=0
for i in range(len(parts)-1):parts[i]['end']=parts[i+1]['start']
parts[-1]['end']=position
with wave.open(str(out/'narration-de.wav'),'wb') as audio:
 audio.setnchannels(1);audio.setsampwidth(2);audio.setframerate(rate);audio.writeframes(b''.join(chunks))
timeline={'title':data['title'],'language':'de','duration':position,'sampleRate':rate,'provider':'Piper / Thorsten medium / CC0 dataset','chapters':chapters,'parts':parts,'subtitles':subtitles}
(out/'timeline.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+'\n')
srt='\n\n'.join(f'{i+1}\n{stamp(s["start"])} --> {stamp(s["end"])}\n'+ '\n'.join(textwrap.wrap(s['text'],width=84,break_long_words=False)) for i,s in enumerate(subtitles))+'\n'
(ROOT/'media/tutorial-de/Huroof-Rundgang-DE.srt').write_text(srt)
(ROOT/'media/tutorial-de/Sprechertext-DE.txt').write_text('\n\n'.join(c['title']+'\n'+'\n'.join(x['text'] for x in src['parts']) for c,src in zip(chapters,data['chapters']))+'\n')
(ROOT/'media/tutorial-de/YouTube-Kapitel-DE.txt').write_text('\n'.join(f'{int(c["start"])//60:02d}:{int(c["start"])%60:02d} {c["title"]}' for c in chapters)+'\n')
print('DONE',round(position,2),'seconds;',len(parts),'visual steps;',len(subtitles),'subtitles',flush=True)
