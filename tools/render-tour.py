"""Compose reviewed genuine app screenshots into the German Full-HD video.
The screenshot sequences show actual before/after states; explanatory diagrams are labelled.
"""
import argparse,json,subprocess,textwrap,hashlib,shutil,os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-tour-build'));p.add_argument('--base-url',default='http://127.0.0.1:8044');p.add_argument('--preview-only',action='store_true');a=p.parse_args();out=a.directory;base=a.base_url.rstrip('/');(out/'frames').mkdir(exist_ok=True)
data=json.loads((out/'timeline.json').read_text());capture=json.loads((out/'capture.json').read_text());assert not capture['errors']
diagrams={'intro','intro-map','outro','account-diagram','sync-diagram','admin-demo','admin-limits','routine'}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1920,'height':1080},device_scale_factor=1)
 ctx.route('**/__tourshots/*',lambda r:r.fulfill(path=str(out/'app-shots'/r.request.url.split('/')[-1]),content_type='image/png'))
 page=ctx.new_page();errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)));page.goto(base+'/media/tutorial-de/stage.html');page.evaluate('document.fonts.ready')
 for part in data['parts']:
  chapter=data['chapters'][part['chapter']]
  assert part['id'] in capture['shots'] or part['id'] in diagrams,part['id']
  img=base+'/__tourshots/'+part['id']+'.png' if part['id'] in capture['shots'] and part['id'] not in diagrams else None
  page.evaluate('x=>renderTour(...x)',[part,chapter,img,data['duration'],len(data['chapters'])])
  page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
  overflow=page.evaluate('''()=>{const el=document.querySelector('.copy');return !document.body.classList.contains('hero-mode')&&el.getBoundingClientRect().bottom>930}''');assert not overflow,part['id']
  page.screenshot(path=str(out/'frames'/f'{part["index"]:03d}-{part["id"]}.png'))
 assert not errors,errors
 page.evaluate('x=>renderTour(...x)',[data['parts'][0],data['chapters'][0],None,data['duration'],len(data['chapters'])])
 page.evaluate('''()=>{document.querySelector('.subtitle-bg').style.display='none';document.getElementById('hero-title').textContent='Dein Lernweg. Schritt für Schritt.';document.getElementById('hero-text').textContent='Die ausführliche Einführung für Lernende, Eltern und Lehrkräfte';const badge=document.createElement('div');badge.textContent='DEUTSCH';badge.style.cssText='position:absolute;left:430px;right:430px;bottom:130px;text-align:center;background:#244d3d;color:#fffbe9;padding:24px;border-radius:20px;font-size:31px;letter-spacing:2px;font-weight:700';document.body.append(badge)}''')
 page.evaluate('t=>document.body.lastElementChild.textContent=t',f'DEUTSCH · {len(data["chapters"])} KAPITEL · {int(data["duration"])//60:02d}:{int(data["duration"])%60:02d} MIN')
 page.screenshot(path=str(ROOT/'media/tutorial-de/Huroof-Rundgang-DE-Vorschaubild.png'))
 b.close()
print('Reviewed',len(data['parts']),'Full-HD frames: no missing images or copy-panel overlap',flush=True)
if a.preview_only:raise SystemExit(0)

def ass_time(sec):
 cs=round(sec*100);return f'{cs//360000}:{cs//6000%60:02}:{cs//100%60:02}.{cs%100:02}'
ass=['[Script Info]','ScriptType: v4.00+','PlayResX: 1920','PlayResY: 1080','WrapStyle: 0','ScaledBorderAndShadow: yes','[V4+ Styles]','Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding','Style: Default,DejaVu Sans,30,&H00F7FFF6,&H000000FF,&H001C392C,&H00000000,0,0,0,0,100,100,0,0,1,0,0,5,100,100,30,1','[Events]','Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
for sub in data['subtitles']:
 text='\\N'.join(textwrap.wrap(sub['text'].replace('{','').replace('}',''),width=88,break_long_words=False))
 ass.append('Dialogue: 0,'+ass_time(sub['start'])+','+ass_time(sub['end'])+',Default,,0,0,0,,{\\an5\\pos(960,1003)}'+text)
(out/'captions.ass').write_text('\n'.join(ass)+'\n')
concat=[]
for part in data['parts']:
 file=out/'frames'/f'{part["index"]:03d}-{part["id"]}.png';concat.extend(["file '"+str(file)+"'",'option framerate 1000',f'duration {part["end"]-part["start"]:.6f}'])
concat.extend(["file '"+str(file)+"'",'option framerate 1000'])
(out/'frames.txt').write_text('\n'.join(concat)+'\n')
metadata=[';FFMETADATA1']
for ch in data['chapters']:
 metadata.extend(['[CHAPTER]','TIMEBASE=1/1000','START='+str(round(ch['start']*1000)),'END='+str(round(ch['end']*1000)),'title='+ch['title']])
(out/'chapters.ffmeta').write_text('\n'.join(metadata)+'\n')
target=ROOT/'downloads/Huroof-Rundgang-DE.mp4'
cmd=['ffmpeg','-y','-hide_banner','-loglevel','warning','-f','concat','-safe','0','-i',str(out/'frames.txt'),'-i',str(out/'narration-de.wav'),'-f','ffmetadata','-i',str(out/'chapters.ffmeta'),'-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-vf','fps=25,ass='+str(out/'captions.ass')+',format=yuv420p','-af','aformat=channel_layouts=stereo,loudnorm=I=-16:TP=-1.5:LRA=9','-t',str(data['duration']),'-c:v','libx264','-preset','veryfast','-crf','23','-threads','3','-pix_fmt','yuv420p','-c:a','aac','-b:a','112k','-ar','48000','-movflags','+faststart','-metadata','title=Huroof – Die ausführliche App-Tour','-metadata','comment=German tutorial; actual local app views with example data; labelled explanatory diagrams; synthetic Piper/Thorsten narration.','-metadata:s:a:0','language=deu','-progress',str(out/'encode-progress.txt'),str(target)]
print('Encoding',round(data['duration'],2),'seconds to',target,flush=True);subprocess.run(cmd,check=True,env={**os.environ,'XDG_CACHE_HOME':str(out/'cache')})
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-show_chapters','-of','json',str(target)]));v=next(x for x in probe['streams'] if x['codec_type']=='video');au=next(x for x in probe['streams'] if x['codec_type']=='audio')
assert len(probe.get('chapters',[]))==len(data['chapters'])
assert (v['width'],v['height'],v['pix_fmt'])==(1920,1080,'yuv420p');assert v['codec_name']=='h264' and au['codec_name']=='aac';assert abs(float(v['duration'])-data['duration'])<.15;assert abs(float(au['duration'])-data['duration'])<.15;assert abs(float(probe['format']['duration'])-data['duration'])<.2;assert target.stat().st_size<95_000_000
report={'title':data['title'],'language':'de','seconds':float(probe['format']['duration']),'chapters':len(data['chapters']),'visualSteps':len(data['parts']),'subtitles':len(data['subtitles']),'format':'1920x1080, H.264/AAC, 25fps, fast-start','bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
(ROOT/'media/tutorial-de/release.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('DONE',json.dumps(report),flush=True)
