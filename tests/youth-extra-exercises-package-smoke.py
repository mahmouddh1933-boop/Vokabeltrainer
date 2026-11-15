"""Verify new exercise sets in the real offline Books ZIP."""
from pathlib import Path
from zipfile import ZipFile
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
import tempfile,json,re,hashlib
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def copyfile(self,a,b):
  try:super().copyfile(a,b)
  except (BrokenPipeError,ConnectionResetError):pass
with tempfile.TemporaryDirectory(prefix='huroof-extra-zip-') as folder:
 with ZipFile(R/'downloads/Huroof-Books.zip') as z:assert z.testzip() is None;z.extractall(folder)
 app=Path(folder)/'books';assets=json.loads(re.search(r'const ASSETS = (.*);\nconst BASE',(app/'pwa-worker.js').read_text())[1])
 for name,meta in assets.items():assert hashlib.sha256((app/name).read_bytes()).hexdigest()[:16]==meta['rev'],name
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=folder));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/books/'
 try:
  with sync_playwright() as p:
   b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block');c.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');window.print=()=>{}")
   c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) and r.request.resource_type not in ['script','stylesheet'] else r.abort());pg=c.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
   for id in ['c-p24-b2','b-p16-b1','a-p08-b1']:
    pg.goto(base+'youth-training-two.html#'+id+'/exercise-4');pg.wait_for_selector('#yt-extra-picker');assert pg.locator('.yt-exercise-card').count()==5
    assert pg.locator('[data-exercise-choice="exercise-4"]').get_attribute('aria-pressed')=='true'
    qs=pg.evaluate('id=>ArabicYouthTwoData.activities.find(a=>a.id===id).exercises[3].tasks',id);assert len(qs)==6
    if pg.locator('.smart-activity').count():
     pg.locator('.smart-activity').evaluate('''(root,qs)=>{for(const q of qs){root.querySelector(`[data-smart-item="${q.id}"]`).click();[...root.querySelectorAll('button[data-smart-target]')].find(n=>n.dataset.smartTarget===q.answer).click()}root.querySelector('.smart-check').click()}''',qs)
    else:
     for q in qs:
      card=pg.locator('#yt-q-'+q['id'])
      if q['kind']=='input':card.locator('.yt-input').fill(q['answer'])
      else:
       for index in q['targets']:card.locator('[data-word-index="'+str(index)+'"]').click()
      card.locator('.yt-check').click();assert card.locator('.yt-feedback.is-correct').count()==1
    assert pg.locator('#yt-progress').get_attribute('value')=='6';pg.reload();pg.wait_for_selector('#yt-extra-picker');assert pg.locator('#yt-progress').get_attribute('value')=='6';pg.locator('#yt-print-activity').click();assert pg.locator('#yt-print .yt-print-task').count()==6
   count=pg.evaluate('ArabicYouthTwoData.activities.flatMap(a=>a.exercises||[]).reduce((n,e)=>n+e.tasks.length,0)');assert count==360
   assert not errors,errors;b.close()
 finally:server.shutdown();server.server_close()
print('PASS actual ZIP: 360 questions present; classification, writing and marked words; blocked JS/CSS; selected exercise, persistence, print and PWA hashes')
