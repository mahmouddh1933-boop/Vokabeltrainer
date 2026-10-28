"""Capture actual learner interactions in a fresh, local browser; no production accounts."""
import argparse,json,re,time,math,urllib.request,tarfile,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-tour-build'));p.add_argument('--base-url',default='http://127.0.0.1:8044');a=p.parse_args();out=a.directory;base=a.base_url.rstrip('/');(out/'app-shots').mkdir(exist_ok=True,parents=True)
if not (out/'xlsx.full.min.js').exists():
 with urllib.request.urlopen('https://registry.npmjs.org/xlsx/-/xlsx-0.18.5.tgz',timeout=40) as response:
  package=out/'xlsx.tgz';package.write_bytes(response.read())
 with tarfile.open(package) as archive:
  (out/'xlsx.full.min.js').write_bytes(archive.extractfile('package/dist/xlsx.full.min.js').read())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);ctx=b.new_context(viewport={'width':1440,'height':810},device_scale_factor=1)
 ctx.add_init_script("localStorage.setItem('vocabInterfaceLanguage','de');localStorage.setItem('lettersLanguage','de');localStorage.setItem('oliveLearnerThemeV1','neutral')")
 ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort())

 if (out/'xlsx.full.min.js').exists():ctx.route('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',lambda r:r.fulfill(path=str(out/'xlsx.full.min.js'),content_type='application/javascript'))
 page=ctx.new_page();page.set_default_timeout(9000);errors=[];audio_requests=[];shots={}
 page.on('pageerror',lambda ex:errors.append(str(ex)))
 page.on('request',lambda r:audio_requests.append(r.url.split('?')[0].replace(base+'/','')) if '.mp3' in r.url else None)
 def go(name):
  page.goto(base+'/'+name+'.html');page.wait_for_function('!!window.VocabApp&&!!window.AppLanguage');page.wait_for_timeout(300)
 def focus(selector,block='center'):
  n=page.locator(selector).first;n.wait_for(state='visible');n.evaluate('(el,block)=>el.scrollIntoView({block,behavior:"instant"})',block);return n
 def click(selector):page.locator(selector).first.click();page.wait_for_timeout(200)
 def snap(id,selector=None,block='center'):
  page.evaluate('document.fonts.ready')
  if selector:focus(selector,block)
  if id=='route-lower':
   box=page.locator('#overall-learning-path li').filter(has=page.locator('a[href="books.html"]')).bounding_box()
   if box and box['y']<810:page.evaluate('d=>window.scrollBy(0,-d)',810-box['y']+12)
  page.evaluate("document.querySelectorAll('[data-tour-mark]').forEach(n=>{n.style.outline='';n.style.outlineOffset='';n.removeAttribute('data-tour-mark')})")
  if selector:
   page.locator(selector).first.evaluate("n=>{n.dataset.tourMark='';n.style.outline='3px solid #b68c38';n.style.outlineOffset='4px'}")
  page.wait_for_timeout(260);path=out/'app-shots'/f'{id}.png';page.screenshot(path=str(path));shots[id]={'file':str(path),'page':page.url.split(base)[-1],'focus':selector};print('CAPTURE',id,flush=True)
 def unit(module):
  go('skills');page.goto(base+'/skills.html#a1-01/'+module);page.wait_for_timeout(350)
 go('index');snap('route-top','.route-home-intro' if page.locator('.route-home-intro').count() else '#route-resume')
 snap('route-overview','#overall-learning-path','start');snap('route-lower','#overall-learning-path li:nth-child(5)')
 page.locator('#overall-learning-path li').first.locator('button').click();snap('route-mark','#route-summary')
 go('placement');snap('placement-catalog','#placement-catalog','start');click('[data-start-test=quick][data-form=A]');snap('placement-question','#placement-question')
 tasks=page.evaluate('''()=>{const id=new URLSearchParams(location.hash.slice(1)).get('attempt');return Placement.questions(VocabApp.getStats().placementV1.attempts[id]);}''')
 for i,q in enumerate(tasks):
  if q['domain']=='listening':
   click('#placement-listen');page.wait_for_function('!document.querySelector("#placement-options button").disabled',timeout=30000)
  page.locator('#placement-options button').nth((q['correct']+1)%len(q['options']) if i in [2,7] else q['correct']).click()
  if i<len(tasks)-1:click('#placement-next')
 click('#placement-submit');snap('placement-results','#placement-results','start')
 go('huruf');click('#letter-next');snap('letters-front','#letter-card');click('#letter-card');snap('letters-forms','#letter-forms')
 click('#letter-previous');snap('letters-related','#letter-related','start');click('#letter-next');snap('letters-harakat','#harakat-row');click('#letter-speak');page.wait_for_timeout(300);snap('letters-audio','#letter-speak');letter_audio=next((x for x in reversed(audio_requests) if 'letter' in x),None)
 focus('#writing-canvas');canvas=page.locator('#writing-canvas');box=canvas.bounding_box();page.mouse.move(box['x']+box['width']*.7,box['y']+box['height']*.48);page.mouse.down()
 for i in range(30):page.mouse.move(box['x']+box['width']*(.7-.4*i/29),box['y']+box['height']*(.48+.2*math.sin(i/29*math.pi)))
 page.mouse.up();snap('letters-writing','#writing-canvas');snap('letters-focused','#focused-run','start')
 go('letter-tests');click('[data-training-mode=forms]');snap('letter-tests','#training-options')
 go('sounds');snap('similar-sounds','#sound-options')
 go('reading');snap('phonics-segment','#phonics-display');click('[data-mode=blend]');snap('phonics-blend','#phonics-display');click('[data-mode=family]');snap('phonics-family','#phonics-display')
 go('vocabulary');page.wait_for_selector('[data-level-id=A1]');snap('vocab-a1','#ready-lists-panel','start');click('[data-level-id=A2]');snap('vocab-a2','#ready-lists-panel','start');page.locator('[data-level-id=B2]').evaluate('n=>n.closest("details").querySelector("summary").click()');click('[data-level-id=B2]');snap('vocab-b2','#ready-lists-panel','start')
 page.evaluate('''async()=>{const d=await VocabApp.loadCatalog();const l=d.lists.find(x=>x.id==='a1_11');VocabApp.saveVocabList(l.words.map(x=>[x.ar,x.de]),{type:'ready-list',id:l.id,title:l.title,levelTitle:'A1'});}''')
 go('lernseite');snap('card-front','#flashcard');click('#flashcard');snap('card-back','#flashcard');click('#next-button');click('#pronounce-button');page.wait_for_timeout(400);word_audio=next((x for x in reversed(audio_requests) if 'vocabulary' in x or 'vocab' in x),None);snap('card-next','#flashcard')
 go('test');snap('tests-menu','.test-button-group');click('[data-duration="120"]');snap('tests-duration','.test-duration-panel')
 page.evaluate("VocabApp.saveVocabList([['كِتَابٌ','das Buch'],['قَلَمٌ','der Stift'],['بَابٌ','die Tür']],{type:'custom',id:'tour-example',title:'Beispielwörter'})")
 go('test5');snap('test-scramble','.question:first-child')
 cards=page.locator('.question');lookup={'das Buch':'كتاب','der Stift':'قلم','die Tür':'باب'}
 for i,card in enumerate(cards.all()):
  word=lookup[card.locator('.german-text').inner_text()]
  if i==1:word=word[1:]+word[:1]
  for char in word:card.locator('.scramble-tile:enabled').filter(has_text=re.compile('^'+re.escape(char)+'$')).first.click()
 click('#submit-test');page.wait_for_url('**/ergebnis.html');snap('test-result','main','start')
 go('sentences');snap('sentence-start','#sentence-answer')
 for i in range(20):
  if page.locator('#sentence-check').is_enabled():break
  click('#sentence-hint')
 snap('sentence-built','#sentence-answer');click('#sentence-check');snap('sentence-checked','#sentence-answer')
 go('skills');snap('skills-overview','#skills-content','start');unit('vocabulary');snap('skills-dialog','.skills-block','start');unit('reading');snap('skills-reading','.skills-block','start')
 unit('listening');snap('skills-listening','.skills-block','start')
 questions=page.locator('.skills-question');questions.first.locator('button').first.click();snap('skills-listening-answer','.skills-question');page.locator('#skills-speed').select_option('.8' if page.locator('#skills-speed option[value=".8"]').count() else '0.8');snap('skills-speed','.skills-player')
 unit('conversation');snap('conversation-model','.skills-block','start');draft=page.locator('[data-draft]').first;draft.fill('أَنَا طَالِبٌ. اِسْمِي سَامِي.');snap('conversation-draft','[data-draft]');snap('conversation-criteria','.skills-block:last-child')
 unit('writing');snap('writing-task','.skills-block','start');buttons=page.get_by_role('button',name=re.compile('Modell|Muster|Beispiel',re.I))
 if page.locator('.skills-block details summary').count():page.locator('.skills-block details summary').first.click()
 snap('writing-model','.skills-block','start');page.locator('[data-draft]').first.fill('أَنَا سَامِي. أَسْكُنُ فِي بَرْلِين. أَتَعَلَّمُ الْعَرَبِيَّةَ.');snap('writing-rubric','.skills-rubric')
 unit('collocations');snap('collocations','.skills-block','start');page.locator('.skills-question button').first.click();snap('collocations-answer','.skills-question')
 go('stories');snap('story-text','#story-lines');click('#story-translation');snap('story-translation','#story-lines');snap('story-question','#story-question')
 go('grammar');snap('grammar-stages','#grammar-stages');page.locator('#grammar-lesson-select').select_option('sun-moon');snap('grammar-easy','#lesson-sections','start');page.locator('#grammar-lesson-select').select_option('hamza-exceptions');snap('grammar-hamza','#lesson-sections','start')
 go('verbs');snap('verbs-past','#conjugation-body');click('[data-tense=present]');page.locator('#verb-family').select_option('hollow' if page.locator('#verb-family option[value=hollow]').count() else 'sound');snap('verbs-present','#verb-family');click('[data-tense=imperative]');snap('verbs-imperative','#conjugation-body');snap('verbs-negative','#verb-negation','start')
 go('exams');snap('exams-catalog','#exam-catalog','start');click('[data-start-exam=model-01]');snap('exam-task','.exam-task','start');page.locator('.exam-task input[type=radio]').first.check();snap('exam-feedback','.exam-task','start')
 go('review');click('#review-card');snap('review-card','#review-card');go('stats');snap('stats','.stats-grid' if page.locator('.stats-grid').count() else '.stat-card','start');snap('stats-details','main','end')
 go('vocabulary');click('#show-excel-button');snap('excel-panel','#excel-panel','start')
 # Show the genuine importer with a small, locally generated workbook when available.
 xlsx=ROOT/'media/tutorial-de/Eigene-Wortliste.xlsx'
 if xlsx.exists():
  page.locator('#file-upload').set_input_files(str(xlsx));page.wait_for_function('!document.querySelector("#learn-button").hidden');snap('excel-imported','#excel-panel','start')
 else:snap('excel-imported','#excel-panel','start')
 click('.olive-theme-open');snap('theme-language','.olive-learner-dialog' if page.locator('.olive-learner-dialog').count() else '[role=dialog]')
 go('index');page.locator('#olive-pwa summary').click();snap('pwa-panel','#olive-pwa','start');snap('pwa-tools','#pwa-clear-media')
 try:
  page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=30000)
  ctx.set_offline(True);page.goto(base+'/reading.html');page.wait_for_selector('#phonics-display');snap('offline-reading','#phonics-display')
 finally:ctx.set_offline(False)
 # Final routine returns to the actual navigation and integrated unit overview.
 go('index');snap('routine','#overall-learning-path','start');go('skills');snap('routine-units','#skills-content','start')
 (out/'capture.json').write_text(json.dumps({'shots':shots,'errors':errors,'audio':{'letter':letter_audio,'word':word_audio}},ensure_ascii=False,indent=2)+'\n')
 b.close()
 if errors:raise RuntimeError(errors)
 print('DONE',len(shots),'genuine app views; audio sources:',letter_audio,word_audio,flush=True)
