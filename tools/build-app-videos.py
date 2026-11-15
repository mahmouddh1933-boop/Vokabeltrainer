"""Create separate Arabic app feature videos from verified real screenshots.
Reuses precisely indexed, locally shipped narration; never requests external TTS.
Requires FFmpeg, Playwright/Chromium, Pillow, NumPy, fontTools.
"""
import argparse, hashlib, json, mimetypes, shutil, subprocess, wave
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
MEDIA=ROOT/'media/app-videos'
p=argparse.ArgumentParser();p.add_argument('--app',choices=['start','a1-a2']);p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-app-videos'));p.add_argument('--prepare-only',action='store_true');a=p.parse_args()
def run(*args):subprocess.run([str(x) for x in args],check=True)
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
for ident in [a.app] if a.app else ['start','a1-a2']:
 story=json.loads((MEDIA/f'storyboard-{ident}.json').read_text());out=a.directory/ident;out.mkdir(parents=True,exist_ok=True)
 media=MEDIA/ident;media.mkdir(exist_ok=True)
 (media/'storyboard-ar.json').write_text(json.dumps(story,ensure_ascii=False,indent=2)+'\n')
 timeline={'duration':0,'scenes':[],'subtitles':[]};chunks=[];rate=48000
 def pause(t):
  chunks.append(b'\0\0'*round(t*rate));timeline['duration']+=round(t*rate)/rate
 for index,s in enumerate(story['scenes']):
  start=timeline['duration'];pause(.35)
  for n,clip in enumerate(s['clips']):
   dest=out/f'voice-{index}-{n}.wav'
   run('ffmpeg','-y','-v','error','-ss',clip['start'],'-i',ROOT/'downloads'/clip['source'],'-t',clip['end']-clip['start'],'-vn','-ac','1','-ar',rate,'-c:a','pcm_s16le',dest)
   with wave.open(str(dest)) as f:raw=f.readframes(f.getnframes())
   position=timeline['duration'];chunks.append(raw);timeline['duration']+=len(raw)/(rate*2)
   timeline['subtitles'].append({'start':position,'end':timeline['duration'],'text':clip['text']})
   pause(.18)
  if not s['clips']:pause(max(7,len(s['frames'])*3.2))
  pause(.55);timeline['scenes'].append({**s,'start':start,'end':timeline['duration']})
 with wave.open(str(out/'narration-ar.wav'),'wb') as f:
  f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(chunks))
 (out/'timeline.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2)+'\n')
 stem='Huroof-'+('Start' if ident=='start' else 'A1-A2')+'-Video'
 (media/f'{stem}-AR.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(s["start"])} --> {stamp(s["end"])}\n{s["text"]}' for i,s in enumerate(timeline['subtitles']))+'\n')
 (media/'Sprechertext-AR.txt').write_text('\n\n'.join(s['title'].replace('\n',' ')+'\n'+'\n'.join(c['text'] for c in s['clips']) for s in story['scenes'])+'\n')
 (media/'YouTube-Kapitel-AR.txt').write_text('\n'.join(f'{int(s["start"])//60:02}:{int(s["start"])%60:02} '+s['title'].replace('\n',' ') for s in timeline['scenes'])+'\n')
 (media/'README-AR.md').write_text('# '+story['title']+'\n\nفيديو مستقل بلقطات حقيقية من النسخة الحالية، وتعليق عربي صناعي مستخرج من التسجيلات الموجودة في المشروع، ونصوص توضيحية وموسيقى آلية. بعض فقرات عرض المزايا تستخدم نصوصًا على الشاشة مع الموسيقى دون تعليق صوتي. لا تُعرض حسابات حقيقية.\n\nالمصدر: `../storyboard-'+ident+'.json`، وإعادة الإنتاج: `python3 tools/build-app-videos.py --app '+ident+'`.\n')
 shots=[];evidence=[]
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1920,'height':1080},service_workers='block',reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
  def route(r):
   name=r.request.url.removeprefix('https://video.huroof.test/');path=ROOT/name
   if not str(path.resolve()).startswith(str(ROOT)+'/') or not path.is_file():return r.abort()
   r.fulfill(body=path.read_bytes(),content_type=mimetypes.guess_type(path)[0] or 'application/octet-stream')
  page.route('**/*',route);page.goto('https://video.huroof.test/media/app-videos/stage.html')
  for scene in timeline['scenes']:
   for n,frame in enumerate(scene['frames']):
    image=ROOT/f'images/editions/{ident}/{frame}.webp';assert image.is_file()
    page.evaluate('s=>render(s)',{**scene,'language':'ar','appLabel':story['label'],'image':f'https://video.huroof.test/images/editions/{ident}/{frame}.webp'})
    path=out/f'frame-{scene["id"]}-{n}.png';page.screenshot(path=str(path))
    duration=scene['end']-scene['start'];shots.append({'path':str(path),'scene':scene['id'],'start':scene['start']+duration*n/len(scene['frames']),'end':scene['start']+duration*(n+1)/len(scene['frames'])})
    evidence.append({'scene':scene['id'],'image':image.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(image.read_bytes()).hexdigest()})
  assert not errors,errors
  browser.close()
 shutil.copyfile(shots[0]['path'],media/'Huroof-Demo-Vorschaubild-AR.png')
 (out/'shots.json').write_text(json.dumps(shots,indent=2)+'\n')
 (media/'capture-evidence.json').write_text(json.dumps({'app':ident,'sourceCommit':'f7ba50b30d68aeab9b2a2cd8cedcb3bede6cbb53','screenshots':evidence},indent=2)+'\n')
 print('PREPARED',ident,round(timeline['duration'],2),len(shots),'shots',flush=True)
 if not a.prepare_only:
  # Source screenshots or scene durations may have changed since the last build.
  for cached in out.glob('clip-*.mp4'):cached.unlink()
  run('python3',ROOT/'tools/build-demo-video.py','--directory',out,'--language','ar','--media-directory',media,'--output-stem',stem,'--bundle-stem',stem,'--step','render')
  dest=ROOT/'downloads'/f'{stem}-AR.mp4'
  info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(dest)]))
  report={'file':dest.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'bytes':dest.stat().st_size,'duration':float(info['format']['duration']),'screenshots':len(evidence),'video':[{k:s[k] for k in ['codec_name','width','height','r_frame_rate']} for s in info['streams'] if s['codec_type']=='video'],'audio':[s['codec_name'] for s in info['streams'] if s['codec_type']=='audio']}
  (media/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
