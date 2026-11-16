"""Verify both limited previews work without auth, external services or production storage."""
import hashlib,json,mimetypes,re,tempfile
from pathlib import Path
from urllib.parse import urlparse
from zipfile import ZipFile
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='huroof-two-demos-test-') as tmp:
 folders={}
 for app,label in [('start','Start'),('a1-a2','A1-A2')]:
  with ZipFile(ROOT/f'downloads/Huroof-{label}-Demo.zip') as z:
   assert z.testzip() is None;z.extractall(tmp)
  folder=Path(tmp)/f'Huroof-{label}-Demo';folders[app]=folder
  assert not any('firebase' in p.name or p.name in ['login.html','admin.html','auth-session.js','access-client.js','cloud-sync.js','cloud-sync-core.js'] for p in folder.rglob('*') if p.is_file())
  worker=(folder/'pwa-worker.js').read_text();assets=json.loads(re.search(r'const ASSETS = (.*);\nconst BASE',worker)[1])
  for name,meta in assets.items():assert hashlib.sha256((folder/name).read_bytes()).hexdigest()[:16]==meta['rev'],(app,name)
  assert json.loads((folder/'demo-manifest.json').read_text())['authentication'] is False
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for mode in ['normal','inline-only','storage-denied']:
   context=browser.new_context(viewport={'width':1280,'height':900},service_workers='block',reduced_motion='reduce')
   context.add_init_script("try{localStorage.setItem('oliveLearnerThemeV1','neutral');for(const id of ['start','a1-a2'])if(!localStorage.getItem('huroofSuiteV1:'+id+':learningStats'))localStorage.setItem('huroofSuiteV1:'+id+':learningStats','PRODUCTION-UNTOUCHED')}catch(_){}")
   if mode=='storage-denied':context.add_init_script("for(const name of ['localStorage','sessionStorage'])Object.defineProperty(window,name,{get(){throw new DOMException('Denied','SecurityError')}})")
   context.add_init_script("window.__plays=0;const orig=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.addEventListener('playing',()=>__plays++,{once:true});return orig.call(this)}")
   external=[];missing=[];errors=[]
   def route(r):
    u=urlparse(r.request.url)
    if u.hostname!='demos.example.test':external.append(r.request.url);return r.abort()
    if mode=='inline-only' and r.request.resource_type in ['script','stylesheet']:return r.abort()
    parts=u.path.strip('/').split('/',1)
    if len(parts)!=2 or parts[0] not in folders:return r.fulfill(status=404,body='unknown demo')
    target=folders[parts[0]]/parts[1]
    if not target.is_file():missing.append(r.request.url);return r.fulfill(status=404,body='missing')
    r.fulfill(body=target.read_bytes(),content_type=mimetypes.guess_type(target)[0] or 'application/octet-stream')
   context.route('**/*',route);page=context.new_page();page.on('pageerror',lambda ex:errors.append(page.url+' '+str(ex)))
   def open_page(app,name):
    page.goto(f'https://demos.example.test/{app}/{name}.html')
    if name=='offline':return
    page.wait_for_selector('.demo-notice');page.wait_for_function('window.VocabApp && window.AppLanguage')
    # Inline data contains Unicode line separators: these must not shift the head insertion.
    assert not page.evaluate('Array.from(document.body.childNodes).some(n=>n.nodeType===3 && n.textContent.trim())'), (app,name,'Unexpected text outside page elements')
    assert '.grammar-path-panel' not in page.locator('body').inner_text(), (app,name,'CSS rendered as text')
    if page.locator('[data-learner-choice=neutral]').is_visible():page.locator('[data-learner-choice=neutral]').click()
    counts=page.evaluate('''() => {
      const paths=['ArabicLetterData.letters','ArabicReadingTrainer.words','ArabicReadingExercises.activities','ArabicSkillsData.units','ArabicGrammarData.lessons','VerbLessonData.verbs','ArabicPracticeData.sentences','ArabicPracticeData.stories','ArabicPracticeData.sounds'];
      return paths.flatMap(path=>{const [name,key]=path.split('.');const rows=window[name]?.[key];return rows?.length?[[path,rows.length]]:[]});
    }''')
    assert all(count==3 for _,count in counts),counts
    assert page.evaluate('typeof firebase')=='undefined'
    assert page.evaluate('typeof OliveFirebaseConfig')=='undefined'
    assert page.locator('#olive-account, #auth-blocker').count()==0
    assert not page.locator('.app-sidebar a[href="admin.html"],.app-sidebar a[href="login.html"]').count()
   for app in ['start','a1-a2']:
    meta=json.loads((folders[app]/'demo-manifest.json').read_text())
    for name in meta['pages'] if mode=='normal' else ['index.html','huruf.html' if app=='start' else 'grammar.html']:
     open_page(app,name.removesuffix('.html'))
    open_page(app,'index')
    for lang in ['ar','de']:
     page.locator('#app-language-select').select_option(lang)
     for width in [320,390,1280]:
      page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(350);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(app,mode,lang,width)
    page.set_viewport_size({'width':1280,'height':900})
    if mode=='storage-denied':assert 'Browser-Speicher gesperrt' in page.locator('.demo-notice').inner_text()
    if mode!='storage-denied':
     page.evaluate('JisrStorage.local.setItem("demo-marker","'+app+'")');page.reload();page.wait_for_selector('.demo-notice')
     assert page.evaluate('JisrStorage.local.getItem("demo-marker")')==app
     assert page.evaluate('localStorage.getItem("huroofSuiteV1:'+app+':learningStats")')=='PRODUCTION-UNTOUCHED'
     assert page.evaluate('localStorage.getItem("huroofDemoV1:'+app+':demo-marker")')==app
    if app=='start':
     open_page(app,'huruf');assert page.evaluate('ArabicLetterData.letters.length')==3
     page.locator('#letter-next').click();page.locator('#letter-card').click();assert 'flipped' in page.locator('#letter-card').get_attribute('class')
     page.locator('#letter-speak').click();page.wait_for_function('__plays>0')
     page.locator('#focused-options button').first.click();assert page.locator('#focused-feedback').inner_text()
     open_page(app,'reading-trainer');assert page.locator('#rt-word-select option').count()>0;page.locator('#rt-next').click()
    else:
     open_page(app,'vocabulary');catalog=page.evaluate('VocabApp.loadCatalog()');assert len(catalog['lists'])==3
     page.locator('.ready-list-button').first.click();page.wait_for_url('**/lernseite.html');page.locator('#flashcard').click();assert 'flipped' in page.locator('#flashcard').get_attribute('class')
     open_page(app,'test2');page.locator('.question input[type=radio]').first.check();page.locator('#submit-test').click();page.wait_for_url('**/ergebnis.html')
     if mode!='storage-denied':assert page.evaluate('VocabApp.getStats().totalTests')==1
     open_page(app,'grammar');assert page.evaluate('ArabicGrammarData.lessons.length')==3;page.locator('#grammar-answers button').first.click();assert page.locator('#grammar-feedback').inner_text()
     open_page(app,'skills');page.locator('.skills-card a').first.click();page.wait_for_selector('#skills-unit-score')
    open_page(app,'index');page.once('dialog',lambda d:d.accept());page.locator('#demo-reset').click();page.wait_for_url('**/index.html');page.wait_for_selector('.demo-notice')
    assert page.evaluate('JisrStorage.local.getItem("demo-marker")') is None
    if mode!='storage-denied':assert page.evaluate('localStorage.getItem("huroofSuiteV1:'+app+':learningStats")')=='PRODUCTION-UNTOUCHED'
    print('PASS',mode,app,'pages; languages; responsive; live exercises; local audio; isolated learning; reset',flush=True)
   assert not external,external;assert not missing,missing;assert not errors,errors
   context.close()
  browser.close()
print('PASS two current interactive demos; no Firebase, login or external services; ZIP and PWA integrity.')
