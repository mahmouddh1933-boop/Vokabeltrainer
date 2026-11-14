"""Check the real Books ZIP offline, including touch drag and saved corrections."""
from pathlib import Path
from zipfile import ZipFile
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
import tempfile,json,re,hashlib
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def copyfile(self,source,outputfile):
  try:super().copyfile(source,outputfile)
  except (BrokenPipeError,ConnectionResetError):pass
with tempfile.TemporaryDirectory(prefix='huroof-smart-zip-') as tmp:
 with ZipFile(root/'downloads/Huroof-Books.zip') as z:
  assert z.testzip() is None;assert all(n.startswith('books/') and '..' not in Path(n).parts for n in z.namelist());z.extractall(tmp)
 app=Path(tmp)/'books';assets=json.loads(re.search(r'const ASSETS = (.*);\nconst BASE',(app/'pwa-worker.js').read_text())[1])
 for name,entry in assets.items():assert hashlib.sha256((app/name).read_bytes()).hexdigest()[:16]==entry['rev'],name
 for path in ['js/smart-activities.js','js/smart-activities-data.js','css/smart-activities.css']:assert path in assets
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=tmp));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/books/'
 try:
  with sync_playwright() as p:
   b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block',reduced_motion='reduce');c.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar')")
   c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) and r.request.resource_type not in ['script','stylesheet'] else r.abort());page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));session=c.new_cdp_session(page)
   for id in ['c-p24-b2','c-p20-b1']:
    page.goto(base+'youth-training-two.html#'+id);page.wait_for_selector('.smart-activity');page.evaluate('document.fonts.ready');page.locator('.smart-board').evaluate('(n)=>{n.scrollIntoView({block:"start"});window.scrollBy(0,-105)}')
    s=page.locator('[data-smart-item]').first;t=page.locator('button[data-smart-target]').first;item=s.get_attribute('data-smart-item');value=t.get_attribute('data-smart-target');a=s.bounding_box();z=t.bounding_box();x=a['x']+a['width']/2;y=a['y']+a['height']/2;ex=z['x']+z['width']/2;ey=z['y']+z['height']/2
    assert 0<y<844 and 0<ey<844,(id,y,ey)
    session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
    for step in range(1,11):session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+(ex-x)*step/10,'y':y+(ey-y)*step/10}]})
    if id=='c-p20-b1':assert page.locator('[data-smart-preview]').count()==1
    else:assert page.locator('.smart-drag-ghost').count()==1
    session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_function('([id,v])=>Array.from(document.querySelectorAll("[data-smart-row]")).find(n=>n.dataset.smartRow===id).querySelector("td").textContent===v',arg=[item,value]);assert page.locator('.smart-drag-ghost').count()==0
    page.reload();page.wait_for_selector('.smart-activity');assert page.locator('[data-smart-row="'+item+'"] td').first.text_content()==value
    tasks=page.evaluate('ArabicYouthTwoData.activities.find(a=>a.id===location.hash.slice(1)).tasks')
    page.locator('.smart-activity').evaluate('''(root,tasks)=>{for(const q of tasks){root.querySelector(`[data-smart-item="${q.id}"]`).click();[...root.querySelectorAll('button[data-smart-target]')].find(n=>n.dataset.smartTarget===q.answer).click()}root.querySelector('.smart-check').click()}''',tasks)
    assert page.locator('.smart-summary tr.is-correct').count()==len(tasks)
   assert not errors,errors;b.close()
 finally:server.shutdown();server.server_close()
print('PASS actual portable ZIP: verified PWA inventory, blocked external JS/CSS, touch classification and live lines, grading and reload')
