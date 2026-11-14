"""Validate the portable B1/B2 ZIP, including inline scripts and local listening audio."""
from pathlib import Path
from zipfile import ZipFile
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
import tempfile,json,hashlib,re
from html.parser import HTMLParser
class InlineAssets(HTMLParser):
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=="script":assert "src" not in attrs,attrs
  if tag=="link":assert attrs.get("rel")!="stylesheet",attrs
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
class QuietHandler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
with tempfile.TemporaryDirectory(prefix='huroof-advanced-zip-') as tmp:
 with ZipFile(root/'downloads/Huroof-B1-B2.zip') as archive:
  assert archive.testzip() is None
  assert all(name.startswith('b1-b2/') and '..' not in Path(name).parts for name in archive.namelist())
  archive.extractall(tmp)
 app=Path(tmp)/'b1-b2';manifest=json.loads((app/'edition-manifest.json').read_text());assert manifest['id']=='b1-b2' and not manifest['suite']
 worker=(app/'pwa-worker.js').read_text();assets=json.loads(re.search(r'const ASSETS = (.*);\nconst BASE',worker)[1])
 for name,meta in assets.items():assert hashlib.sha256((app/name).read_bytes()).hexdigest()[:16]==meta['rev'],name
 for name in manifest['pages']:
  InlineAssets().feed((app/name).read_text())
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=tmp));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/b1-b2/'
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
   context=browser.new_context(service_workers='block',viewport={'width':390,'height':844});context.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar')")
   context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) and not r.request.url.split('?')[0].endswith(('.js','.css')) else r.abort())
   page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(base+'texts.html');page.wait_for_selector('.advanced-unit-card');assert page.locator('.advanced-unit-card').count()==20
   for level,unit in [('B1','B11'),('B2','B21')]:
    for section in ['reading','vocabulary','grammar','listening','speaking','writing']:
     page.goto(base+'texts.html#'+unit+'/'+section);page.wait_for_selector('#advanced-module');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
     if section=='listening':
      page.locator('#advanced-audio').evaluate('(a)=>a.play()');page.wait_for_function('document.querySelector("#advanced-audio").currentTime>.05')
     if section=='writing':
      page.locator('#advanced-essay').fill(level+' كتابة في النسخة المحمولة');page.reload();page.wait_for_selector('#advanced-essay');assert page.locator('#advanced-essay').input_value().startswith(level)
   page.goto(base+'verbs.html');page.wait_for_selector('#verb-select option',state='attached');assert page.locator('#verb-select option').count()==300
   page.goto(base+'grammar.html#passive-voice');page.wait_for_function('document.querySelector("#grammar-lesson-select").value==="passive-voice"')
   assert not errors,errors
   browser.close()
 finally:server.shutdown();server.server_close()
 print('PASS portable ZIP: all PWA hashes, inline assets, both levels/six sections, local audio, retained drafts, passive grammar and 300 verbs')
