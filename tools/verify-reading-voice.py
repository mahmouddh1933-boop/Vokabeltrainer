"""Optional independent acoustic diagnostic for compiled reading audio.

Requires sherpa-onnx/numpy and Whisper-small encoder, decoder and tokens.
No expected word is supplied to the recognizer. Orthographic agreement is not
proof of every vowel or articulation; retain raw transcripts for human review.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import argparse,threading,json,re,unicodedata,subprocess,hashlib
p=argparse.ArgumentParser()
p.add_argument('--model',type=Path,required=True)
p.add_argument('--output',type=Path,required=True)
p.add_argument('--id',action='append')
p.add_argument('--workers',type=int,default=3)
a=p.parse_args()
import sherpa_onnx,numpy as np
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'audio/reading-trainer-manifest.json').read_text())
items=[c for c in manifest['clips'] if not a.id or c['id'] in a.id]
local=threading.local()
def normalize(text):return re.sub('[^\u0621-\u063a\u0641-\u064a]','',unicodedata.normalize('NFC',text))
def distance(x,y):
 row=list(range(len(y)+1))
 for i,u in enumerate(x,1):
  new=[i]
  for j,v in enumerate(y,1):new.append(min(new[-1]+1,row[j]+1,row[j-1]+(u!=v)))
  row=new
 return row[-1]
def check(c):
 if not hasattr(local,'asr'):
  local.asr=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=str(a.model/'small-encoder.int8.onnx'),decoder=str(a.model/'small-decoder.int8.onnx'),tokens=str(a.model/'small-tokens.txt'),language='ar',task='transcribe',num_threads=2)
 event=c['events'][-1];assert event['stage']=='word'
 data=subprocess.check_output(['ffmpeg','-nostdin','-v','error','-i',str(ROOT/c['path']),'-ss',str(event['start']),'-t',str(event['end']-event['start']),'-ac','1','-ar','16000','-f','f32le','-'])
 s=np.frombuffer(data,dtype=np.float32);s=s*.8/max(.001,np.max(np.abs(s)))
 samples=np.concatenate([np.zeros(4000,dtype=np.float32),s,np.zeros(8000,dtype=np.float32),s,np.zeros(8000,dtype=np.float32),s,np.zeros(8000,dtype=np.float32)])
 stream=local.asr.create_stream();stream.accept_waveform(16000,samples);local.asr.decode_stream(stream)
 text=stream.result.text;expected=normalize(c['text']);hypotheses=[normalize(x) for x in text.split() if normalize(x)]
 result={'id':c['id'],'word':c['text'],'recognized':text,'exactWordFound':expected in hypotheses,
  'minimumCharacterErrorRate':round(min((distance(expected,x)/len(expected) for x in hypotheses),default=1),3),
  'trackSha256':hashlib.sha256((ROOT/c['path']).read_bytes()).hexdigest(),'sourceSha256':event.get('sourceSha256')}
 print(json.dumps(result,ensure_ascii=False),flush=True)
 return result
with ThreadPoolExecutor(max_workers=a.workers) as pool:results=list(pool.map(check,items))
report={'provider':manifest['provider'],'method':'Whisper-small int8, Arabic transcription, three audio repetitions, no expected-text prompt.',
 'limitations':'Single-word transcription can differ in spelling and inflection. This is not a human phonetic review or validation of every vowel.',
 'humanPhoneticReview':False,'count':len(results),'exactWordFound':sum(c['exactWordFound'] for c in results),
 'meanMinimumCharacterErrorRate':round(sum(c['minimumCharacterErrorRate'] for c in results)/len(results),3),'results':results}
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('AUDITED',report['count'],'words; strict orthographic matches:',report['exactWordFound'],flush=True)
