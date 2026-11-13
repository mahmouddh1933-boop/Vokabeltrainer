"""Exercise all four full editions, their boundaries, storage and local imports.

Serve tools/build-suite.py output first. Uses no live Firebase accounts.
"""
import argparse,json,re
from pathlib import Path
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-four-apps'));p.add_argument('--base-url',default='http://127.0.0.1:8090');a=p.parse_args();base=a.base_url.rstrip('/')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
 ctx=b.new_context(viewport={'width':1280,'height':960});ctx.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');")
 ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort())
 pg=ctx.new_page();errors=[];missing=[]
 pg.on('pageerror',lambda x:errors.append(str(x)));pg.on('response',lambda r:missing.append(r.url) if r.status==404 else None)
 def open_app(app,page='index'):
  pg.goto(base+'/'+app+'/'+page+'.html');pg.wait_for_function('!!window.HuroofEdition&&!!window.VocabApp&&!!document.querySelector(".edition-brand")');pg.wait_for_timeout(70)
 pg.goto(base+'/index.html');assert pg.locator('.card').count()==4
 for ident in ['start','a1-a2','b1-b2','books']:
  manifest=json.loads((a.directory/ident/'edition-manifest.json').read_text())
  for filename in manifest['pages']:
   if filename in ['offline.html','login.html','admin.html']:continue
   open_app(ident,filename[:-5])
   assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),(ident,filename,'desktop')
  open_app(ident)
  assert pg.locator('#edition-routes a').count()==len(manifest['routes'])
  pg.evaluate('JisrStorage.local.setItem("suite-test-marker",HuroofEdition.id)')
  for language in ['de','ar']:
   pg.locator('#app-language-select').select_option(language)
   for width in [320,390,768,1280]:
    pg.set_viewport_size({'width':width,'height':960});pg.wait_for_timeout(90)
    assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),(ident,language,width)
  pg.set_viewport_size({'width':1280,'height':960})
  if ident=='start':
   open_app(ident,'huruf');assert pg.evaluate('ArabicLetterData.letters.length')==28;pg.locator('#letter-next').click();pg.locator('#letter-card').click();assert 'flipped' in pg.locator('#letter-card').get_attribute('class')
   open_app(ident,'reading-trainer');assert pg.evaluate('ArabicReadingTrainer.words.length')==150
  else:
   open_app(ident,'vocabulary')
   if ident=='books':
    assert pg.locator('#book-vocabulary-lists .ready-list-button').count()==17
    assert pg.locator('#book-vocabulary-2-lists .ready-list-button').count()==33
    assert pg.locator('.cefr-level-card').count()==0
    pg.locator('#book-vocabulary-2-lists .ready-list-button').first.click()
   else:
    assert pg.locator('.cefr-level-card').count()==2
    assert pg.locator('.ready-list-button').count()==30
    assert pg.locator('#book-vocabulary-panel').is_hidden()
    pg.locator('.ready-list-button').first.click()
   pg.wait_for_url('**/lernseite.html');pg.locator('#flashcard').click()
   assert 'flipped' in pg.locator('#flashcard').get_attribute('class')
   vocab=pg.evaluate('VocabApp.getCurrentVocabList()')
   open_app(ident,'test2')
   for q in pg.locator('.question').all():
    word=q.locator('.arabic-text').inner_text();answer=next(de for ar,de in vocab if ar==word)
    for radio in q.locator('input[type=radio]').all():
     if radio.input_value()==answer:radio.check();break
   pg.locator('#submit-test').click();pg.wait_for_url('**/ergebnis.html');assert pg.evaluate('VocabApp.getStats().totalTests')==1
  if ident in ['a1-a2','b1-b2']:
   open_app(ident,'grammar');assert pg.locator('#grammar-lesson-select option').count()==(17 if ident=='a1-a2' else 20)
   pg.locator('#grammar-answers button').first.click();assert pg.locator('#grammar-feedback').inner_text().strip()
   open_app(ident,'verbs');assert pg.locator('#verb-select option').count()==(30 if ident=='a1-a2' else 21)
   pg.locator('[data-tense=imperative]').click();assert pg.locator('#conjugation-body tr').count()>0
  print('EDITION OK',ident,flush=True)
 for ident in ['start','a1-a2','b1-b2','books']:
  open_app(ident);assert pg.evaluate('JisrStorage.local.getItem("suite-test-marker")')==ident
 # A legacy import copies only matching lists/words and preserves the source.
 ca=json.loads((a.directory/'a1-a2/data/vocab_catalog.json').read_text())['lists'][0]
 cb=json.loads((a.directory/'b1-b2/data/vocab_catalog.json').read_text())['lists'][0]
 fixtures={'wrongWords':[{'key':l['id'],'arabic':l['words'][0]['ar'],'german':l['words'][0]['de'],'mistakes':1} for l in [ca,cb]],
  'learningStats':{'readingTrainerV1':{'read':['rt-1-01'],'heard':['rt-1-01']},'grammarPathV1':{'lessons':{'word-classes':{'index':0,'answers':[0]},'circumstantial':{'index':0,'answers':[1]}}}}}
 pg.evaluate('v=>{for(const [k,x]of Object.entries(v))localStorage.setItem(k,JSON.stringify(x))}',fixtures)
 for ident,lesson in [('a1-a2','word-classes'),('b1-b2','circumstantial')]:
  open_app(ident);pg.locator('#edition-import').click();pg.wait_for_function('!document.getElementById("edition-import").disabled')
  stats=pg.evaluate('VocabApp.getStats()');assert lesson in stats['grammarPathV1']['lessons']
  allowed=pg.evaluate('HuroofEdition.grammarIds');assert all(x in allowed for x in stats['grammarPathV1']['lessons'])
  assert pg.evaluate('VocabApp.getStats().totalTests')==1
 open_app('start');pg.locator('#edition-import').click();pg.wait_for_function('!document.getElementById("edition-import").disabled')
 assert 'rt-1-01' in pg.evaluate('VocabApp.getStats().readingTrainerV1.read')
 assert pg.evaluate('JSON.parse(localStorage.getItem("learningStats")).readingTrainerV1.read')==['rt-1-01']
 open_app('books','placement');pg.locator('[data-start-test=quick][data-form=A]').click();assert pg.locator('#placement-options button').count()>0
 # Direct file navigation still initializes each independent, unpacked ZIP layout.
 filectx=b.new_context();filectx.add_init_script("try{localStorage.setItem('oliveLearnerThemeV1','neutral')}catch(_){}");fp=filectx.new_page();fp.on('pageerror',lambda x:errors.append(str(x)))
 file_available=True
 for ident in ['start','a1-a2','b1-b2','books']:
  try:fp.goto((a.directory/ident/'index.html').as_uri())
  except Exception as ex:
   if 'ERR_BLOCKED_BY_ADMINISTRATOR' in str(ex):file_available=False;print('LIMITATION: this environment blocks browser file:// navigation; inline packaging checked separately.',flush=True);break
   raise
  fp.wait_for_selector('.edition-brand');assert fp.locator('#edition-routes a').count()>0
 # Representative final screenshots.
 open_app('a1-a2');pg.screenshot(path='/tmp/huroof-suite-home-desktop.png',full_page=True)
 pg.set_viewport_size({'width':390,'height':960});pg.wait_for_timeout(300);pg.screenshot(path='/tmp/huroof-suite-home-mobile.png',full_page=True)
 assert not errors,errors
 assert not missing,missing[:20]
 b.close();print('PASS all four editions, both languages, responsive navigation, independent storage, legacy import, vocabulary tests, grammar, verbs and placement; file navigation available:',file_available,flush=True)
