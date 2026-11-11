"""Capture real navigation, answers and correction examples for the Arabic demo guide.

Uses only the extracted standalone demo and fresh, disposable browser storage.
Gold outlines indicate controls to click; the demo itself is never modified.
"""
import argparse,json,re,shutil,math
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
MEDIA=ROOT/'media/demo-guide-ar'
p=argparse.ArgumentParser()
p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-demo-guide-ar'))
p.add_argument('--demo-url',default='http://127.0.0.1:8086')
p.add_argument('--stage-url',default='http://127.0.0.1:8077')
p.add_argument('--step',choices=['all','capture','stage'],default='all')
a=p.parse_args();out=a.directory.resolve();frames=out/'frames';frames.mkdir(parents=True,exist_ok=True)
sources={};evidence=[]

def capture():
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  ctx=b.new_context(viewport={'width':1180,'height':728},device_scale_factor=1)
  ctx.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('lettersLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');")
  ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(a.demo_url+'/') else r.abort())
  page=ctx.new_page();page.set_default_timeout(7000);errors=[];audio=[]
  page.on('pageerror',lambda ex:errors.append(str(ex)))
  page.on('request',lambda r:audio.append(r.url) if '.mp3' in r.url else None)
  def ready():page.wait_for_function('!!window.VocabApp&&!!window.AppLanguage');page.evaluate('document.fonts.ready');page.wait_for_timeout(180)
  def go(name):page.goto(a.demo_url+'/'+name+'.html');ready()
  def clear():page.evaluate("document.querySelectorAll('[data-guide-mark]').forEach(n=>{n.style.outline='';n.style.outlineOffset='';n.removeAttribute('data-guide-mark')})")
  def snap(id,selector=None,focus=True):
   clear()
   if selector:
    n=page.locator(selector).first;n.wait_for(state='visible')
    if focus:n.evaluate('(n)=>n.scrollIntoView({block:"center",behavior:"instant"})')
    n.evaluate("n=>{n.dataset.guideMark='';n.style.outline='4px solid #c48d27';n.style.outlineOffset='3px'}")
   page.wait_for_timeout(250);path=frames/(id+'.png');page.screenshot(path=str(path));evidence.append({'id':id,'page':page.url,'control':selector});return a.stage_url+'/__demo_guide_frames__/'+path.name
  def click(selector):page.locator(selector).first.click();page.wait_for_timeout(180)
  def nav(name,id):
   selector='.app-sidebar a[href="'+name+'.html"]';before=snap(id+'-entry',selector)
   click(selector);page.wait_for_url('**/'+name+'.html');ready();return before
  def save(id,*images):sources[id]=[x if isinstance(x,dict) else {'image':x} for x in images];(out/'sources.json').write_text(json.dumps(sources,indent=2));print('CAPTURE',id,flush=True)

  go('index');desktop=snap('menu-desktop','.app-sidebar nav')
  page.set_viewport_size({'width':390,'height':825});page.wait_for_timeout(250)
  phone_closed=snap('menu-mobile-closed','.menu-toggle');click('.menu-toggle');phone_open=snap('menu-mobile-open','.app-sidebar nav')
  assert page.locator('.menu-toggle').get_attribute('aria-expanded')=='true'
  save('navigation',{'image':desktop,'mobile':phone_closed},{'image':desktop,'mobile':phone_open})
  page.set_viewport_size({'width':1180,'height':728});go('index')
  goal=snap('goals','#demo-journey');page.locator('[data-demo-goal]').first.click();save('goals',goal,snap('goals-marked','#demo-journey-status'))
  entry=nav('huruf','letters');click('#letter-next');front=snap('letter-front','#letter-card');click('#letter-card');page.wait_for_timeout(500);forms=snap('letter-forms','#letter-card');click('#letter-speak')
  assert audio,'Letter audio must be requested'
  save('letters',entry,front,forms)
  canvas=page.locator('#writing-canvas');writing=snap('writing-guide','#writing-canvas');box=canvas.bounding_box();page.mouse.move(box['x']+.7*box['width'],box['y']+.48*box['height']);page.mouse.down()
  for i in range(25):page.mouse.move(box['x']+box['width']*(.7-.4*i/24),box['y']+box['height']*(.48+.12*math.sin(i/24*math.pi)))
  page.mouse.up();save('writing-letter',writing,snap('writing-practice','#letter-focused-practice'))
  entry=nav('letter-tests','letter-tests');save('letter-menu',entry,snap('letter-modes','#training-modes'))
  click('[data-training-mode=names]');names=snap('letter-names','#training-run');click('[data-training-mode=forms]');forms=snap('letter-forms-quiz','#training-run');save('letter-recognition',names,forms)
  click('[data-training-mode=missing]');missing=snap('letter-missing','#training-run');click('[data-training-mode=listening]');listen=snap('letter-listening','#training-run');click('#training-listen');save('letter-listening',missing,listen)
  entry=nav('sounds','sounds');sound=snap('sounds-question','#sound-options');click('#sound-listen');save('sounds',entry,sound,snap('sound-button','#sound-listen'))
  entry=nav('index','vocabulary');levels=snap('vocab-levels','#ready-lists-panel');click('[data-level-id=A1]')
  buttons=page.locator('.ready-list-button');food=buttons.filter(has_text='الطعام').first;assert food.count()==1
  food.evaluate("n=>{n.id='guide-food-list'}");lists=snap('vocab-food','#guide-food-list');click('#guide-food-list');page.wait_for_url('**/lernseite.html');ready()
  assert len(page.evaluate('VocabApp.getCurrentVocabList()'))==20
  save('vocab-select',entry,levels,lists)
  front=snap('card-ar','#flashcard');click('#flashcard');page.wait_for_timeout(500);back=snap('card-de','#flashcard');click('#pronounce-button');save('cards',front,back,snap('card-audio','#pronounce-button'))
  start=snap('start-test','#test-button');click('#test-button');page.wait_for_url('**/test.html');ready();duration=snap('test-duration','.test-duration-panel');click('[data-duration="120"]');menu=snap('test-menu','.test-button-group');save('test-menu',start,duration,menu)
  pairs=page.evaluate('VocabApp.getCurrentVocabList()');byde={de:ar for ar,de in pairs};byar={ar:de for ar,de in pairs}
  def start_test(number):
   if not page.url.endswith('/test.html'):
    if page.locator('#back-to-test').count():click('#back-to-test');page.wait_for_url('**/test.html');ready()
    else:go('test')
   before=snap('test-'+str(number)+'-entry','#test'+str(number)+'-button');click('#test'+str(number)+'-button');page.wait_for_url('**/test'+str(number)+'.html');ready();return before
  def question():return page.locator('.question').first
  def radio_answer(q,answer):
   for radio in q.locator('input[type=radio]').all():
    if radio.input_value()==answer:radio.check();return
   raise AssertionError('Correct option not found')
  entry=start_test(1);blank=snap('writing-question','.question');q=question();q.locator('input').fill(byde[q.locator('.german-text').inner_text()]);filled=snap('writing-answer','.question');save('test-writing',entry,blank,filled)
  qs=page.locator('.question').all()
  for i,q in enumerate(qs):q.locator('input').fill('خَطَأٌ' if i==len(qs)-1 else byde[q.locator('.german-text').inner_text()])
  submit=snap('result-button','#submit-test');click('#submit-test');page.wait_for_url('**/ergebnis.html');ready();result=snap('result-page','#results');summary=snap('result-summary','.summary');back=snap('result-review','#review-errors')
  assert len(page.evaluate('VocabApp.getWrongWords()'))==1
  save('results',submit,result,summary,back)
  entry=start_test(2);blank=snap('choice-question','.question');q=question();radio_answer(q,byar[q.locator('.arabic-text').inner_text()]);save('test-choice',entry,blank,snap('choice-answer','.question'))
  entry=start_test(3);blank=snap('missing-question','.question');q=question();word=byde[q.locator('.german-text').inner_text()]
  bare=page.evaluate('w=>VocabApp.stripArabicDiacritics(w)',word)
  for i,child in enumerate(q.locator('.arabic-word-box').locator(':scope > *').all()):
   if child.evaluate('n=>n.tagName==="INPUT"'):child.fill(bare[i])
  save('test-missing',entry,blank,snap('missing-answer','.question'))
  entry=start_test(4);blank=snap('listening-question','.question');before=len(audio);click('.listen-button');page.wait_for_timeout(600);assert len(audio)>before
  filename=audio[-1].split(a.demo_url+'/')[-1];spoken=page.evaluate('p=>Object.entries(ArabicVocabularyAudio.audio).find(([t,f])=>f===p)?.[0]',filename)
  assert spoken in byar,(filename,spoken)
  radio_answer(question(),byar[spoken]);save('test-listening',entry,blank,snap('listening-answer','.question'))
  entry=start_test(5);blank=snap('scramble-question','.question');q=question();bare=page.evaluate('w=>VocabApp.stripArabicDiacritics(w)',byde[q.locator('.german-text').inner_text()])
  for char in bare.replace(' ',''):q.locator('.scramble-tile:enabled').filter(has_text=re.compile('^'+re.escape(char)+'$')).first.click()
  save('test-scramble',entry,blank,snap('scramble-answer','.question'))
  entry=start_test(6);blank=snap('connected-question','.question');q=question();word=byde[q.locator('.german-text').inner_text()]
  letters=q.locator('.connected-word').evaluate('''(n,w)=>{const plain=VocabApp.stripArabicDiacritics(w);let i=0,a=[];for(const c of n.childNodes){if(c.nodeType===1&&c.querySelector('input')){a.push(plain[i]);i++}else i+=VocabApp.stripArabicDiacritics(c.textContent).length}return a}''',word)
  for char in letters:q.locator('.letter-input').first.fill(char)
  save('test-connected',entry,blank,snap('connected-answer','.question'))
  entry=nav('sentences','sentences');blank=snap('sentence-start','#sentence-answer')
  for word in ['أَنَا','طَالِبٌ']:page.locator('#sentence-bank button').filter(has_text=re.compile('^'+re.escape(word)+'$')).click()
  click('#sentence-check');assert 'صحيحة' in page.locator('#sentence-feedback').inner_text();save('sentences',entry,blank,snap('sentence-done','#sentence-feedback'))
  entry=nav('stories','stories');library=snap('story-library','#story-library');click('#story-library button');text=snap('story-text','#story-lines');click('#story-translation');translation=snap('story-translated','#story-lines');save('stories',entry,library,text,translation,snap('story-questions','#story-question'))
  entry=nav('grammar','grammar');dropdown=snap('grammar-lesson','#grammar-lesson-select');page.locator('#grammar-lesson-select').select_option('pronouns');explanation=snap('grammar-explanation','#lesson-sections');practice=snap('grammar-practice','#grammar-question');click('#grammar-answers button');save('grammar',entry,dropdown,explanation,practice)
  entry=nav('verbs','verbs');dropdown=snap('verb-select','#verb-select');click('[data-tense=present]');present=snap('verbs-present','#conjugation-body');click('[data-tense=imperative]');imperative=snap('verbs-imperative','#conjugation-body');save('verbs',entry,dropdown,present,imperative,snap('verbs-practice','#verb-question'))
  entry=nav('review','review');card=snap('review-card','#review-card');click('#review-card');save('review',entry,card,snap('review-flipped','#review-card'))
  entry=nav('stats','stats');save('stats',entry,snap('stats-page','.stats-grid' if page.locator('.stats-grid').count() else 'main'))
  assert not errors,errors
  (out/'capture-evidence.json').write_text(json.dumps({'errors':errors,'steps':evidence,'localAudioRequests':len(audio),'wrongWords':len(page.evaluate('VocabApp.getWrongWords()')),'totalTests':page.evaluate('VocabApp.getStats().totalTests')},ensure_ascii=False,indent=2)+'\n')
  b.close()

def stage():
 timeline=json.loads((out/'timeline.json').read_text());sources=json.loads((out/'sources.json').read_text());shots=[]
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
  page.route('**/__demo_guide_frames__/*',lambda r:r.fulfill(path=str(frames/r.request.url.rsplit('/',1)[1]),content_type='image/png'))
  page.goto(a.stage_url+'/media/demo-guide-ar/stage.html')
  for index,scene in enumerate(timeline['scenes']):
   assert scene['id'] in sources or scene['id'] in ['intro','outro'];views=sources.get(scene['id'],[{}])
   for i,view in enumerate(views):
    data=dict(scene,language='ar',**view,stepLabel=f'{index+1} / {len(timeline["scenes"])} · '+scene['title'].replace('\n',' '));page.evaluate('s=>render(s)',data)
    dest=frames/f'stage-{scene["id"]}-{i}.png';page.screenshot(path=str(dest));shots.append({'path':str(dest),'scene':scene['id'],'start':scene['start']+(scene['end']-scene['start'])*i/len(views),'end':scene['start']+(scene['end']-scene['start'])*(i+1)/len(views)})
   print('STAGE',scene['id'],len(views),flush=True)
  b.close()
 (out/'shots.json').write_text(json.dumps(shots,indent=2)+'\n');shutil.copyfile(frames/'stage-intro-0.png',MEDIA/'Huroof-Demo-Vorschaubild-AR.png')

if a.step in ['all','capture']:capture()
if a.step in ['all','stage']:stage()
