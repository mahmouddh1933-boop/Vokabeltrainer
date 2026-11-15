"""Record live section-by-section app operation, without promotional stills.
Preview first, then record each app and render H.264/AAC, always below six minutes.
"""
import argparse,hashlib,json,math,mimetypes,re,subprocess,time,wave,zipfile
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];MEDIA=ROOT/'media/app-walkthroughs'
p=argparse.ArgumentParser();p.add_argument('--app',choices=['start','a1-a2'],required=True);p.add_argument('--step',choices=['preview','record','render'],required=True);p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-live-walkthroughs'));p.add_argument('--base-url',default='http://127.0.0.1:8093');a=p.parse_args();base=a.base_url.rstrip('/');out=a.directory/a.app;out.mkdir(parents=True,exist_ok=True);media=MEDIA/a.app;media.mkdir(exist_ok=True)
def run(*args):subprocess.run([str(x) for x in args],check=True)
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
def load_subs(path,source):
 rows={}
 def seconds(t):
  h,m,s=t.replace(',','.').split(':');return int(h)*3600+int(m)*60+float(s)
 for block in path.read_text().strip().split('\n\n'):
  ls=block.splitlines();lo,hi=ls[1].split(' --> ');rows[int(ls[0])]=dict(source=source,start=seconds(lo),end=seconds(hi),text=' '.join(ls[2:]))
 return rows
voice=load_subs(ROOT/'media/demo-guide-ar/Huroof-Demo-Anleitung-AR.srt','Huroof-Demo-Anleitung-AR.mp4')
promo=load_subs(ROOT/'media/promo/Huroof-Werbung-AR.srt','Huroof-Werbung-AR.mp4')
S=lambda hint,op,*args,v=None:dict(hint=hint,op=op,args=list(args),voice=voice[v] if isinstance(v,int) else v)
scenes=[]
def section(title,*steps):scenes.append(dict(title=title,steps=list(steps)))
section('ابدأ من القائمة',S('اختر القسم الذي تريد تعلّمه من القائمة الجانبية.','nav','index.html',v=3),S('تعرّف إلى أقسام التطبيق وخطوتك التالية.','focus','.edition-grid'))
if a.app=='start':
 section('الحروف: النطق والأشكال',S('افتح بطاقات الحروف من القائمة.','nav','huruf.html',v=9),S('انتقل بين الحروف بالسابق والتالي.','click','#letter-next',v=10),S('اضغط البطاقة لترى أشكال الحرف في الكلمة.','click','#letter-card',v=11),S('جرّب زر الاستماع إلى نطق الحرف.','click','#letter-speak'))
 section('الكتابة بيدك',S('انزل إلى لوحة الكتابة في الصفحة نفسها.','focus','#writing-canvas',v=12),S('تتبّع الحرف على اللوحة بإصبعك أو بالفأرة.','draw',v=13),S('امسح اللوحة وأعد التدريب متى أردت.','click','#clear-canvas'))
 section('تدريبات أشكال الحروف',S('جرّب أشكال الحرف والحرف الناقص ثم اقرأ التصحيح.','focus','#letter-focused-practice',v=14),S('اختر إجابة لتظهر لك التغذية الراجعة.','click','#focused-options button'),S('انتقل إلى سؤال جديد لمواصلة التدريب.','click','#focused-next'))
 section('اختبارات الحروف',S('افتح تدريبات الحروف لرؤية أنواع الاختبارات.','nav','letter-tests.html',v=15),S('اختر نوع التدريب ثم أجب عن السؤال.','click','#training-modes button',v=17),S('اقرأ اسم الحرف واختر الحرف الصحيح.','click','#training-options button',v=18),S('اضغط التالي لتجربة سؤال آخر.','click','#training-next'))
 section('تمييز الأصوات المتشابهة',S('افتح قسم الأصوات المتشابهة.','nav','sounds.html',v=22),S('اضغط الاستماع ثم اختر ما سمعته.','click','#sound-listen',v=23),S('اختر إجابة واقرأ الفرق بين الصوتين.','click','#sound-options button',v=24),S('انتقل إلى السؤال التالي.','click','#sound-next'))
 section('القراءة والهجاء',S('افتح القراءة والهجاء: تقطيع ودمج وحرف ناقص وعائلات كلمات.','nav','reading.html',v=promo[5]),S('في التقطيع، اختر تقسيم الكلمة إلى مقاطع صوتية.','click','#phonics-options button'),S('بدّل إلى دمج الحروف لتكوين كلمة.','click','[data-mode=blend]'),S('اعرض المساعدة ثم تحقق من إجابتك.','click','#phonics-help'),S('جرّب عائلات الكلمات ولاحظ النمط المشترك.','click','[data-mode=family]'))
 section('مدرّب القراءة',S('افتح مدرّب القراءة واختر كلمة من المستوى.','nav','reading-trainer.html'),S('انتقل إلى الكلمة التالية ولاحظ معناها.','click','#rt-next'),S('استمع إلى التدرّج كاملًا ثم أوقف التشغيل.','trainer-audio'),S('بدّل إلى القراءة بنفسك لإخفاء المساعدة الصوتية.','click','#rt-self-read'),S('انزل إلى الجمل لتقرأ الكلمة في سياقها.','focus','#rt-sentences'))
 section('تدريبات القراءة: افهم وطبّق',S('افتح تدريبات القراءة واختر نشاطًا.','nav','reading-exercises.html'),S('مثال: اقرأ التعليمات ولوّن أجزاء العلم.','nav','reading-exercises.html#colors/colors-2'),S('اختر اللون ثم اضغط الجزء المطلوب.','color','green','top'),S('أكمل الجزء الثاني والثالث بحسب التعليمات.','color','white','middle'),S('استخدم الأسود للشريط الأخير.','color','black','bottom'))
 section('التقدّم والإعدادات',S('افتح تقدّمي لمتابعة التدريب الذي أجريته.','nav','progress.html',v=8),S('يمكنك تبديل لغة الواجهة إلى الألمانية.','language','de'),S('أعد الواجهة إلى العربية.','language','ar'))
else:
 section('المفردات: اختيار المستوى والقائمة',S('افتح مفردات A1 وA2 من القائمة الجانبية.','nav','vocabulary.html'),S('اختر المستوى ثم اضغط قائمة التعلّم المطلوبة.','focus','#ready-lists-panel',v=26),S('افتح أول قائمة مفردات متاحة.','click','.ready-list-button'))
 section('البطاقات: الكلمة والمعنى والصوت',S('تظهر الكلمة العربية بالحركات على وجه البطاقة.','focus','#flashcard',v=28),S('اضغط البطاقة لرؤية معناها الألماني.','click','#flashcard',v=29),S('استمع ثم انتقل إلى البطاقة التالية.','card-audio',v=30))
 section('الاختبارات: اختيار النوع والمدة',S('افتح الاختبارات بعد دراسة البطاقات.','click','#test-button',v=31),S('حدد مدة الاختبار ثم اختر نوعه.','click','[data-duration="120"]',v=32))
 section('الكتابة والاختيار من متعدد',S('في اختبار الكتابة يظهر المعنى بالألمانية.','click','#test1-button',v=34),S('اكتب إجابتك في الحقل العربي.','fill','.question input[type=text]','كِتَابٌ',v=35),S('عد إلى قائمة الاختبارات لتجربة نوع آخر.','click','#back-to-test'),S('في الاختيار من متعدد اختر معنى الكلمة.','click','#test2-button',v=38),S('اختر إجابة ثم تابع بقية الأسئلة.','radio'))
 section('الحروف الناقصة والاستماع',S('عد لاختيار اختبار الحروف الناقصة.','nav','test.html'),S('تظهر بعض حروف الكلمة لتساعدك على إكمالها.','click','#test3-button',v=40),S('اكتب حرفًا مناسبًا في الفراغ.','fill','.question input','ب',v=41),S('افتح اختبار الاستماع من قائمة الاختبارات.','nav','test.html'),S('اضغط تشغيل الكلمة في سؤال الاستماع.','click','#test4-button',v=42),S('استمع ثم اختر معناها الألماني.','test-audio',v=43))
 section('الحروف المبعثرة والمتصلة',S('افتح ترتيب الحروف المبعثرة.','nav','test5.html',v=45),S('اضغط الحروف لتكوين إجابتك فوقها.','tiles',v=46),S('افتح اختبار الحروف المتصلة.','nav','test6.html',v=48),S('اكتب الحرف داخل فراغ الكلمة.','fill','.question input','ب',v=49))
 section('عرض النتيجة والتصحيح',S('نجيب عن اختبار قصير، مع خطأ مقصود لشرح المراجعة.','sample-test',v=53),S('اضغط عرض النتيجة بعد الإجابة.','click','#submit-test',v=51),S('اقرأ درجتك والإجابات الصحيحة.','focus','#results',v=52))
 section('تكوين الجمل',S('افتح تكوين الجمل من القائمة.','nav','sentences.html',v=55),S('اضغط الكلمات بالترتيب ثم تحقق من الجملة.','sentence',v=56),S('استعن بالتلميح واستمع بعد الحل.','sentence-audio',v=57))
 section('القصص القصيرة',S('افتح قصصًا قصيرة واختر القصة.','nav','stories.html',v=58),S('اقرأ الفقرات واعرض الترجمة عند الحاجة.','click','#story-translation'),S('انزل إلى أسئلة الفهم واختر إجابتك.','story-answer',v=60))
 section('المهارات والوحدات: A1 وA2',S('افتح المهارات والوحدات: 12 وحدة مترابطة.','nav','skills.html'),S('اختر وحدة لفتح موضوعها ومفرداتها.','click','.skills-card a'),S('انتقل إلى الاستماع داخل الوحدة.','click','a[href$="/listening"]'),S('اختر إجابة عن سؤال الفهم.','skills-answer'),S('انتقل إلى المحادثة لمراجعة الأسئلة والنماذج.','click','a[href$="/conversation"]'),S('افتح الكتابة واكتب مسودة إجابتك.','skills-writing'))
 section('القواعد والإملاء',S('افتح القواعد ثم اختر الدرس من القائمة.','nav','grammar.html',v=61),S('اختر درس الضمائر واقرأ الأمثلة الملوّنة.','select','#grammar-lesson-select','pronouns',v=62),S('أجب عن سؤال الدرس واقرأ التوضيح.','grammar-answer',v=63))
 section('تصريف الأفعال: فقرة مستقلة',S('افتح الأفعال واختر الفعل الذي تريده.','nav','verbs.html',v=64),S('قارن المضارع بالماضي والأمر.','click','[data-tense=present]',v=65),S('بدّل إلى الأمر ولاحظ الصيغ مع الضمائر.','click','[data-tense=imperative]'),S('انزل إلى التمرين واختر الصيغة المناسبة.','verb-answer',v=66))
 section('المراجعة وتقدّمي',S('افتح المراجعة لتجد الكلمات التي أخطأت فيها.','nav','review.html',v=67),S('اقلب بطاقة المراجعة وكرر الكلمة.','review-flip',v=68),S('افتح تقدّمي لمتابعة النتائج.','nav','stats.html',v=70))
section('خطوتك التالية',S('ابدأ بخطوة صغيرة، وكرّر ما تعلّمته بانتظام.','hold',v=73))
# Keep the walkthrough readable while fitting comfortably under six minutes.
for scene in scenes:
 for step in scene['steps']:
  clip=step['voice'];step['duration']=max(3.6,(clip['end']-clip['start']+.8) if clip else 4.5)
expected=sum(step['duration'] for s in scenes for step in s['steps']);assert expected<348,expected
(media/'storyboard.json').write_text(json.dumps({'app':a.app,'type':'live browser recording','expectedDuration':expected,'sections':scenes},ensure_ascii=False,indent=2)+'\n')
label='البداية والحروف' if a.app=='start' else 'العربية A1 / A2';stem='Huroof-'+('Start' if a.app=='start' else 'A1-A2')+'-Walkthrough-AR'
if a.step in ['preview','record']:
 import os
 ffroot=Path('/tmp/huroof-walkthrough-browser');(ffroot/'ffmpeg-1011').mkdir(parents=True,exist_ok=True)
 ff=ffroot/'ffmpeg-1011/ffmpeg-linux'
 if not ff.exists():ff.symlink_to('/usr/bin/ffmpeg')
 os.environ['PLAYWRIGHT_BROWSERS_PATH']=str(ffroot)
 events=[];audio_events=[];errors=[];start_clock=None
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  options=dict(viewport={'width':1280,'height':720},device_scale_factor=1,service_workers='block')
  if a.step=='record':options.update(record_video_dir=str(out/'capture'),record_video_size={'width':1280,'height':720})
  ctx=browser.new_context(**options)
  ctx.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('lettersLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');")
  def heard(source,data):
   if start_clock is not None:audio_events.append({**data,'time':time.monotonic()-start_clock})
  ctx.expose_binding('walkthroughAudio',heard)
  ctx.add_init_script("""(()=>{const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(...args){this.addEventListener('playing',()=>window.walkthroughAudio({url:this.currentSrc||this.src,rate:this.playbackRate}),{once:true});return play.apply(this,args)}})();""")
  def route(r):
   url=r.request.url
   if '/images/editions/' in url:raise AssertionError('Promotional screenshots must not be used')
   if url==base+'/__walkthrough-stage__':return r.fulfill(path=str(MEDIA/'stage.html'),content_type='text/html')
   for prefix in ['/fonts/','/images/brand/']:
    if url.startswith(base+prefix):return r.fulfill(path=str(ROOT/url.removeprefix(base+'/')),content_type=mimetypes.guess_type(url)[0] or 'application/octet-stream')
   if url.startswith(base+'/'):return r.continue_()
   return r.abort()
  ctx.route('**/*',route)
  page=ctx.new_page();page.on('pageerror',lambda error:errors.append(str(error)));page.set_default_timeout(6000)
  page.goto(base+'/__walkthrough-stage__');page.evaluate('(url)=>document.querySelector("#app").src=url',base+'/'+a.app+'/index.html')
  def frame():return page.locator('#app').element_handle().content_frame()
  frame().wait_for_selector('.brand-name');page.evaluate('document.fonts.ready')
  def focus(selector):
   el=frame().locator(selector).first;el.wait_for(state='visible');el.evaluate('(n)=>n.scrollIntoView({block:"center",behavior:"instant"})');return el
  def click(selector):
   el=focus(selector);box=el.bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
   page.mouse.move(x,y,steps=15);page.evaluate('p=>cursor(p)',{'x':x,'y':y,'click':False});page.wait_for_timeout(160)
   page.evaluate('p=>cursor(p)',{'x':x,'y':y,'click':True});el.click();page.wait_for_timeout(160);page.evaluate('p=>cursor(p)',{'x':x,'y':y,'click':False})
  def nav(name):
   current=frame().url;link=frame().locator('.app-sidebar a[href="'+name+'"]')
   if link.count():click('.app-sidebar a[href="'+name+'"]')
   else:frame().goto(base+'/'+a.app+'/'+name)
   frame().wait_for_selector('.brand-name');frame().evaluate('document.fonts.ready')
  def select(selector,value):focus(selector).select_option(value)
  def do(op,args):
   f=frame()
   if op=='nav':nav(*args)
   elif op=='focus':focus(*args)
   elif op=='click':click(*args)
   elif op=='select':select(*args)
   elif op=='fill':focus(args[0]).fill(args[1])
   elif op=='hold':pass
   elif op=='language':select('#app-language-select',args[0])
   elif op=='draw':
    canvas=focus('#writing-canvas');box=canvas.bounding_box();x,y,w,h=[box[k] for k in ['x','y','width','height']]
    page.mouse.move(x+w*.72,y+h*.42);page.mouse.down()
    for i in range(32):
     px=x+w*(.72-.45*i/31);py=y+h*(.42+.16*math.sin(i*math.pi/31));page.evaluate('p=>cursor(p)',{'x':px,'y':py,'click':True});page.mouse.move(px,py);page.wait_for_timeout(20 if a.step=='record' else 1)
    page.mouse.up();page.mouse.click(x+w*.5,y+h*.72)
   elif op=='trainer-audio':click('#rt-listen');page.wait_for_timeout(1300);click('#rt-stop')
   elif op=='color':click('[data-color="'+args[0]+'"]');click('[data-color-label="'+args[1]+'"]')
   elif op=='card-audio':click('#flashcard');click('#pronounce-button');page.wait_for_timeout(600);click('#next-button')
   elif op=='radio':f.locator('.question input[type=radio]').first.check()
   elif op=='test-audio':
    click('.question button');page.wait_for_timeout(600);f.locator('.question input[type=radio]').first.check()
   elif op=='tiles':
    click('.scramble-tile:enabled');click('.scramble-tile:enabled')
   elif op=='sample-test':
    nav('test2.html');words=f.evaluate('VocabApp.getCurrentVocabList()')
    import unicodedata
    def normalized(s):return unicodedata.normalize('NFC',s.replace('\u064bا','ا\u064b'))
    for i,q in enumerate(f.locator('.question').all()):
     word=q.locator('.arabic-text').inner_text();correct=next(de for ar,de in words if normalized(ar)==normalized(word))
     for radio in q.locator('input[type=radio]').all():
      if (radio.input_value()!=correct if i==0 else radio.input_value()==correct):radio.check();break
    focus('.question')
   elif op=='sentence':
    focus('#sentence-answer')
    for _ in range(12):
     if f.locator('#sentence-check').is_enabled():break
     click('#sentence-hint')
    click('#sentence-check')
   elif op=='sentence-audio':click('#sentence-listen')
   elif op=='story-answer':click('#story-options button')
   elif op=='skills-answer':click('.skills-choice')
   elif op=='skills-writing':
    click('a[href$="/writing"]');focus('[data-draft=writing]').fill('أَنَا أَتَعَلَّمُ الْعَرَبِيَّةَ كُلَّ يَوْمٍ.')
   elif op=='grammar-answer':click('#grammar-answers button')
   elif op=='verb-answer':click('#verb-answers button')
   elif op=='review-flip':click('#review-card')
   else:raise ValueError(op)
  start_clock=time.monotonic();timeline=[];chapter_starts=[]
  for section_index,scene in enumerate(scenes):
   chapter_starts.append({'title':scene['title'],'start':time.monotonic()-start_clock})
   for step_index,step in enumerate(scene['steps']):
    at=time.monotonic()-start_clock
    page.evaluate('s=>instruction(s)',dict(label=label,title=f'القسم {section_index+1} من {len(scenes)} — '+scene['title'],hint=step['hint']))
    do(step['op'],step['args']);page.wait_for_timeout(100)
    row={**step,'section':scene['title'],'start':at,'actionEnd':time.monotonic()-start_clock,'url':frame().url};timeline.append(row)
    if a.step=='record':
     remaining=step['duration']-(time.monotonic()-start_clock-at)
     assert remaining>-.8,(scene['title'],step['op'],'operation exceeded timing budget',remaining)
     if remaining>0:page.wait_for_timeout(remaining*1000)
    if step_index==len(scene['steps'])-1:page.screenshot(path=str(out/f'section-{section_index:02}.png'))
   print(a.step.upper(),a.app,section_index+1,scene['title'],round(time.monotonic()-start_clock,1),flush=True)
  duration=time.monotonic()-start_clock;assert not errors,errors
  video=page.video
  ctx.close();video_path=str(video.path()) if video else None;browser.close()
  result={'app':a.app,'type':'continuous live browser operation','duration':duration,'expectedDuration':expected,'video':video_path,'errors':errors,'events':timeline,'chapters':chapter_starts,'appAudio':audio_events,'promotionalImagesUsed':False}
  (out/('recording.json' if a.step=='record' else 'preview.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
  (media/(a.step+'-evidence.json')).write_text(json.dumps({k:v for k,v in result.items() if k!='video'},ensure_ascii=False,indent=2)+'\n')
  if a.step=='record':assert duration<355,duration
if a.step=='render':
 import numpy as np
 from urllib.parse import urlsplit,unquote
 recording=json.loads((out/'recording.json').read_text());assert not recording['errors'] and not recording['promotionalImagesUsed']
 duration=recording['duration'];assert duration<355
 rate=48000;samples=np.zeros(round(duration*rate),dtype=np.float32);subtitles=[]
 for i,event in enumerate(recording['events']):
  clip=event.get('voice')
  if not clip:continue
  dest=out/f'voice-{i:02}.wav'
  run('ffmpeg','-y','-v','error','-ss',clip['start'],'-i',ROOT/'downloads'/clip['source'],'-t',clip['end']-clip['start'],'-vn','-ac',1,'-ar',rate,'-c:a','pcm_s16le',dest)
  with wave.open(str(dest)) as f:raw=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').astype(np.float32)/32768
  at=round((event['start']+.25)*rate);length=min(len(raw),len(samples)-at);samples[at:at+length]+=raw[:length]
  subtitles.append({'start':event['start']+.25,'end':event['start']+.25+length/rate,'text':clip['text']})
 heard=[]
 for i,event in enumerate(recording['appAudio']):
  # Retain only successful local audio playback, not synthesis requests or remote URLs.
  if not event['url'].startswith(base+'/'):continue
  path=(Path('/tmp/huroof-four-apps')/unquote(urlsplit(event['url']).path).lstrip('/')).resolve()
  if not path.is_file() or not str(path).startswith('/tmp/huroof-four-apps/'):continue
  dest=out/f'app-audio-{i}.wav';pace=float(event.get('rate',1))
  run('ffmpeg','-y','-v','error','-i',path,'-t',6,'-af',f'atempo={pace}','-ac',1,'-ar',rate,'-c:a','pcm_s16le',dest)
  with wave.open(str(dest)) as f:raw=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').astype(np.float32)/32768
  at=round(event['time']*rate);length=min(len(raw),len(samples)-at)
  if length<=0:continue
  samples[at:at+length]+=.34*raw[:length];heard.append({'time':event['time'],'path':str(path.relative_to('/tmp/huroof-four-apps'))})
 audio=out/'soundtrack.wav'
 with wave.open(str(audio),'wb') as f:
  f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes((np.clip(samples,-1,1)*32767).astype('<i2').tobytes())
 (media/f'{stem}.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(s["start"])} --> {stamp(s["end"])}\n{s["text"]}' for i,s in enumerate(subtitles))+'\n')
 (media/'chapters.txt').write_text('\n'.join(f'{int(s["start"])//60:02}:{int(s["start"])%60:02} '+s['title'] for s in recording['chapters'])+'\n')
 source_info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-of','json',recording['video']]))
 offset=max(0,float(source_info['format']['duration'])-duration);dest=ROOT/'downloads'/f'{stem}.mp4'
 run('ffmpeg','-y','-v','warning','-ss',offset,'-i',recording['video'],'-i',audio,'-t',duration,'-map','0:v:0','-map','1:a:0','-vf','scale=1920:1080:flags=lanczos,fps=25,format=yuv420p','-af','loudnorm=I=-16:TP=-1.5:LRA=9','-c:v','libx264','-preset','veryfast','-crf',21,'-threads',3,'-pix_fmt','yuv420p','-profile:v','high','-level','4.1','-c:a','aac','-b:a','160k','-ar',48000,'-movflags','+faststart','-metadata','title=حروف من الزيتون — شرح عملي: '+label,'-metadata','comment=Continuous live browser recording of actual app operation; no promotional stills.','-metadata:s:a:0','language=ara',dest)
 # Decode the whole output before publication and check the requested maximum duration.
 run('ffmpeg','-v','error','-i',dest,'-f','null','-')
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(dest)]));v=next(s for s in info['streams'] if s['codec_type']=='video');au=next(s for s in info['streams'] if s['codec_type']=='audio')
 assert (v['codec_name'],v['width'],v['height'],au['codec_name'])==('h264',1920,1080,'aac')
 assert 60<float(info['format']['duration'])<=360
 for s in subtitles:assert 0<=s['start']<s['end']<=float(info['format']['duration'])
 import shutil
 shutil.copyfile(out/'section-00.png',media/'cover.png')
 report={'file':dest.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'bytes':dest.stat().st_size,'duration':float(info['format']['duration']),'type':'live browser operation','sourceApp':'f7ba50b','promotionalImagesUsed':False,'sections':len(recording['chapters']),'actualInteractions':len(recording['events']),'capturedLocalAudioEvents':heard,'dimensions':[1920,1080],'codec':'H.264 / AAC','decodedEveryFrame':True,'errors':recording['errors']}
 (media/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 (media/'README-AR.md').write_text('# شرح عملي — '+label+'\n\nتسجيل مباشر لفتح أقسام التطبيق وتجربة أدواته. لا تُستخدم صور المعارض التشجيعية. تظهر التعليمات العربية في الشريط السفلي، مع تعليق صوتي عربي حيث تتوفر مقاطع مطابقة من دليل المشروع، وأمثلة صوتية محلية ناجحة من التطبيق. توجد بعض الخطوات بشرح نصي دون تعليق. تسجيل مؤقت دون حسابات حقيقية.\n\nالمدة: '+str(round(duration))+' ثانية، أقل من ست دقائق.\n\nإعادة الإنتاج: `python3 tools/build-app-walkthroughs.py --app '+a.app+' --step preview` ثم `--step record` ثم `--step render`، بعد تشغيل حزمة التطبيقات محليًا على عنوان `--base-url`.\n')
 with zipfile.ZipFile(ROOT/'downloads'/f'{stem}.zip','w',compression=zipfile.ZIP_STORED) as z:
  z.write(dest,dest.name)
  for name in [f'{stem}.srt','cover.png','chapters.txt','README-AR.md']:z.write(media/name,name)
 print('VERIFIED',a.app,report['duration'],'seconds',report['actualInteractions'],'actual interactions',flush=True)
