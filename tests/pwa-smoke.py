"""Real service worker, range audio, cached lessons, repair, privacy and responsive UI."""
import argparse,json,tempfile
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8070');args=parser.parse_args();BASE=args.base_url.rstrip('/')
with sync_playwright() as p:
 ctx=p.chromium.launch_persistent_context(tempfile.mkdtemp(prefix='olive-pwa-browser-',dir='/tmp'),executable_path='/usr/bin/chromium',args=['--no-sandbox'],viewport={'width':390,'height':900},is_mobile=True,has_touch=True);b=ctx.browser
 ctx.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral')")
 page=ctx.new_page();errors=[];missing_core=[];page.on('requestfailed',lambda r:missing_core.append(r.url) if r.url.startswith(BASE+'/') and r.resource_type in ['script','stylesheet','font'] else None);page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE+'/index.html');page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=60000)
 page.locator('#olive-pwa summary').tap();page.wait_for_function('document.getElementById("pwa-status").textContent.includes("جاهزة")')
 def request(kind):return page.evaluate('''kind=>new Promise(resolve=>{const c=new MessageChannel();c.port1.onmessage=e=>resolve(e.data);navigator.serviceWorker.controller.postMessage({type:kind},[c.port2]);})''',kind)
 state=request('PWA_STATUS');assert state['ready'];assert state['mediaCount']<10
 session=ctx.new_cdp_session(page);manifest=session.send('Page.getAppManifest');assert manifest['url'].endswith('/manifest.webmanifest');assert not manifest['errors'],manifest['errors']
 try:
  issues=session.send('Page.getInstallabilityErrors')['installabilityErrors'];assert not issues,issues
 except Exception as exc:
  if 'wasn\'t found' not in str(exc) and 'not found' not in str(exc):raise
 # A first Range request must save the entire file, not just the requested fragment.
 clip='audio/skills/a1-01-listening.mp3'
 response=page.evaluate('''async path=>{const r=await fetch(path,{headers:{Range:'bytes=0-127'}});return{status:r.status,range:r.headers.get('Content-Range'),bytes:(await r.arrayBuffer()).byteLength}}''',clip)
 assert response['status']==206 and response['bytes']==128 and response['range'].startswith('bytes 0-127/')
 page.wait_for_function('''()=>new Promise(resolve=>{const c=new MessageChannel();c.port1.onmessage=e=>resolve(e.data.mediaCount>0);navigator.serviceWorker.controller.postMessage({type:'PWA_STATUS'},[c.port2]);})''')
 page.evaluate('VocabApp.setJSON("learningStats",{...VocabApp.getStats(),pwaSentinel:"preserve-progress"})')
 # Non-allowlisted same-origin API-like responses and POSTs never enter the caches.
 page.route('**/private-test.json',lambda r:r.fulfill(status=200,content_type='application/json',body='{"private":"account data"}'))
 assert page.evaluate("fetch('private-test.json').then(r=>r.json()).then(x=>x.private)")=='account data';page.unroute('**/private-test.json')
 assert not page.evaluate("async()=>{for(const n of await caches.keys())for(const r of await(await caches.open(n)).keys())if(r.url.includes('private-test'))return true;return false}")
 ctx.set_offline(True)
 tail=page.evaluate('''async path=>{const r=await fetch(path,{headers:{Range:'bytes=-64'}});return{status:r.status,bytes:(await r.arrayBuffer()).byteLength}}''',clip);assert tail=={'status':206,'bytes':64}
 assert page.evaluate("p=>fetch(p,{headers:{Range:'bytes=99999999-'}}).then(r=>r.status)",clip)==416
 for name in ['letters.html','reading.html','vocabulary.html','skills.html#a1-01/writing','grammar.html','verbs.html','placement.html','exams.html','stories.html','books.html']:
  page.goto(BASE+'/'+name);page.wait_for_selector('main');assert page.evaluate('typeof VocabApp')=='object',name
 page.goto(BASE+'/skills.html#a1-01/listening');page.get_by_role('button',name='◖ استمع: تسجيل فهم المسموع',exact=True).tap();page.wait_for_function('!document.getElementById("skills-audio").paused');page.evaluate('document.getElementById("skills-audio").pause()')
 page.goto(BASE+'/skills.html#a1-01/writing');page.locator('[data-draft=writing]').fill('أَتَدَرَّبُ دُونَ اتِّصَالٍ.');page.get_by_role('button',name='احفظ إجابتي',exact=True).tap();page.reload();expect(page.locator('[data-draft=writing]')).to_have_value('أَتَدَرَّبُ دُونَ اتِّصَالٍ.')
 page.goto(BASE+'/missing-lesson.html');expect(page.locator('h1')).to_have_text('أنت دون اتصال')
 page.goto(BASE+'/index.html');page.locator('#olive-pwa summary').tap();page.wait_for_function('document.getElementById("pwa-status").textContent.includes("جاهزة")');assert page.evaluate("fetch('uncached-offline-probe.json',{cache:'no-store'}).then(()=>false).catch(()=>true)");page.locator('#pwa-clear-media').tap();page.wait_for_function('document.getElementById("pwa-clear-media").disabled');assert request('PWA_STATUS')['mediaCount']==0;assert page.evaluate('VocabApp.getStats().pwaSentinel')=='preserve-progress'
 # Existing text caches survive media removal, and evicted text caches can be repaired.
 ctx.set_offline(False);page.evaluate("async()=>{for(const n of await caches.keys())if(n.includes(':core:'))await caches.delete(n)}")
 assert not request('PWA_STATUS')['ready'];repair=request('PREPARE_CORE');assert repair['ready']
 for lang in ['ar','de']:
  page.locator('#app-language-select').select_option(lang)
  for width in [320,390,768,1440]:
   page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(180);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(lang,width)
   boxes=page.locator('#olive-pwa button:visible').evaluate_all('nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON())')
   for i,a in enumerate(boxes):
    assert a['height']>=44
    for c in boxes[i+1:]:assert min(a['right'],c['right'])-max(a['left'],c['left'])<=1 or min(a['bottom'],c['bottom'])-max(a['top'],c['top'])<=1
 page.set_viewport_size({'width':390,'height':900});page.locator('#app-language-select').select_option('ar');page.locator('#olive-pwa').scroll_into_view_if_needed();page.screenshot(path='/tmp/olive-pwa-mobile.png')
 assert not errors,errors;assert not missing_core,missing_core;b.close();print('PASS installability, real offline lessons/audio Range+seek, drafts, API exclusion, media removal, cache repair and AR/DE mobile layout')
