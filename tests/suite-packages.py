"""Verify shipped ZIP integrity, PWA hashes, content boundaries and auth bootstrapping.

Firebase is stubbed for the bootstrap checks; no real project is contacted.
"""
import hashlib,json,mimetypes,re,tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse,parse_qs
from zipfile import ZipFile
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
APPS={'start':'Start','a1-a2':'A1-A2','b1-b2':'B1-B2','books':'Books'}
catalog=json.loads((ROOT/'data/vocab_catalog.json').read_text())
class Scripts(HTMLParser):
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='script':assert 'src' not in attrs,attrs
  if tag=='link':assert attrs.get('rel')!='stylesheet',attrs

with tempfile.TemporaryDirectory(prefix='huroof-package-check-') as tmp:
 folder=Path(tmp)
 for ident,label in APPS.items():
  with ZipFile(ROOT/f'downloads/Huroof-{label}.zip') as archive:
   assert archive.testzip() is None
   assert all(name.startswith(ident+'/') and '..' not in Path(name).parts for name in archive.namelist())
   archive.extractall(folder)
  base=folder/ident
  config=json.loads((base/'edition-manifest.json').read_text())
  assert config['id']==ident and not config['suite']
  assert (base/'README-APP.txt').is_file()
  for name in config['pages']:
   if name=='offline.html':continue
   source=(base/name).read_text();Scripts().feed(source)
   assert 'window.HuroofEditionConfig=' in source
  worker=(base/'pwa-worker.js').read_text()
  assets=json.loads(re.search(r'const ASSETS = (.*);\nconst BASE',worker)[1])
  for name,meta in assets.items():
   payload=(base/name).read_bytes()
   assert meta['rev']==hashlib.sha256(payload).hexdigest()[:16],(ident,name)
  c=json.loads((base/'data/vocab_catalog.json').read_text())
  if ident in ['a1-a2','b1-b2']:
   levels=['A1','A2'] if ident=='a1-a2' else ['B1','B2']
   assert [l['id'] for l in c['levels']]==levels
   assert c['lists']==[l for l in catalog['lists'] if l['level'] in levels]
   assert not c.get('bookVocabulary') and not c.get('bookVocabulary2')
  elif ident=='books':
   assert not c['lists'] and not c['levels']
   for key in ['bookVocabulary','bookVocabulary2']:assert c[key]==catalog[key]
  else:assert not c['lists'] and not c.get('bookVocabulary')
  print('ZIP OK',ident,'verified PWA assets',len(assets),flush=True)
 with ZipFile(ROOT/'downloads/Huroof-Suite-Setup.zip') as archive:
  assert archive.testzip() is None
  conf=json.loads(archive.read('Huroof-Four-Apps/firebase.json'))
  assert conf['hosting']['public']=='.' and 'predeploy' not in conf['hosting']
  assert archive.read('Huroof-Four-Apps/firestore.rules')==(ROOT/'firestore.rules').read_bytes()
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for signed_in in [False,True]:
   context=browser.new_context(service_workers='block')
   def route(request):
    url=urlparse(request.request.url);path=url.path.lstrip('/')
    if url.hostname!='suite.example.test':return request.abort()
    if path.endswith('firebase-app-compat.js'):
     user='{uid:"test-student",email:"student@example.test",emailVerified:true}' if signed_in else 'null'
     stub='window.OliveAccess={enabled:false,isAdmin:()=>false};window.firebase={initializeApp:()=>({auth:()=>({onAuthStateChanged:cb=>cb('+user+'),currentUser:'+user+'})})};'
     return request.fulfill(content_type='text/javascript',body=stub)
    if path.endswith('firebase-auth-compat.js'):return request.fulfill(content_type='text/javascript',body='/* stub */')
    if path.endswith('cloud-sync.js'):return request.fulfill(content_type='text/javascript',body='/* deliberate offline sync fallback */')
    target=folder/path
    if not target.is_file():return request.fulfill(status=404,body='Missing fixture '+path)
    return request.fulfill(content_type=mimetypes.guess_type(path)[0] or 'application/octet-stream',body=target.read_bytes())
   context.route('**/*',route)
   page=context.new_page();errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
   for ident in APPS:
    page.goto(f'https://suite.example.test/{ident}/index.html')
    if not signed_in:
     page.wait_for_url('**/login.html?**')
     assert parse_qs(urlparse(page.url).query)['next']==['/'+ident+'/index.html']
     assert page.evaluate('typeof window.VocabApp')=='undefined'
    else:
     page.wait_for_selector('.edition-brand')
     assert page.evaluate('JisrStorage.local.scope')=='test-student'
     assert not page.locator('html').get_attribute('class') or 'auth-pending' not in page.locator('html').get_attribute('class')
    print('AUTH BOOTSTRAP OK',ident,'signed in' if signed_in else 'signed out',flush=True)
   assert not errors,errors
   context.close()
  browser.close()
print('PASS ZIP integrity, original vocabulary preserved, offline script packaging, PWA hashes, assembly kit and mocked authentication bootstrap.')
