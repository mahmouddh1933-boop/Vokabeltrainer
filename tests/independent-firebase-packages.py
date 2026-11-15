"""Check independent project setup, inlined SDK config, cache invalidation and guardrails.
Uses synthetic public WEB metadata; never creates projects or contacts Firebase.
"""
import hashlib,json,os,re,subprocess,tempfile,mimetypes
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright
from pathlib import Path
from zipfile import ZipFile
ROOT=Path(__file__).resolve().parents[1]
apps={'start':'Start','a1-a2':'A1-A2','b1-b2':'B1-B2','books':'Books'}
def execute(folder,*args,ok=True,env=None):
 p=subprocess.run(['node',str(folder/'configure-firebase.cjs'),*args],capture_output=True,text=True,env=env)
 assert (p.returncode==0)==ok,(folder.name,p.stdout,p.stderr)
 return p
def browser_check(public,project):
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for signed_in in [False,True]:
   context=browser.new_context(service_workers='block');context.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('huroofSuiteBaseV1',new URL('../',location.href).href)")
   def route(r):
    url=urlparse(r.request.url);name=url.path.lstrip('/')
    if url.hostname!=project+'.web.app':return r.abort()
    if name.endswith('firebase-app-compat.js'):
     user='{uid:"test-learner",email:"learner@example.test",emailVerified:true}' if signed_in else 'null'
     stub='window.OliveAccess={enabled:false,isAdmin:()=>false};window.firebase={initializeApp:c=>{window.boundFirebaseProject=c.projectId;return {auth:()=>({onAuthStateChanged:cb=>cb('+user+'),currentUser:'+user+'})}}};'
     return r.fulfill(content_type='text/javascript',body=stub)
    if name.endswith('firebase-auth-compat.js') or name.endswith('cloud-sync.js'):return r.fulfill(content_type='text/javascript',body='/* offline Firebase test stub */')
    target=public/name
    if not target.is_file():return r.fulfill(status=404,body='Missing '+name)
    r.fulfill(body=target.read_bytes(),content_type=mimetypes.guess_type(name)[0] or 'application/octet-stream')
   context.route('**/*',route);page=context.new_page();errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
   page.goto('https://'+project+'.web.app/index.html')
   if signed_in:
    page.wait_for_selector('.brand-name');page.wait_for_function('window.VocabApp && window.JisrStorage.local.scope === "test-learner"')
    assert page.evaluate('HuroofEdition.suite') is False
   else:
    page.wait_for_url('**/login.html?**');page.wait_for_function('window.boundFirebaseProject')
    assert parse_qs(urlparse(page.url).query)['next']==['/index.html']
   assert page.evaluate('OliveFirebaseConfig.firebase.projectId')==project
   assert page.evaluate('boundFirebaseProject')==project
   assert not errors,errors
   context.close()
  browser.close()

with tempfile.TemporaryDirectory(prefix='huroof-independent-check-') as tmp:
 folders=[]
 for app,label in apps.items():
  with ZipFile(ROOT/f'downloads/Huroof-{label}-Firebase-Independent.zip') as archive:
   assert archive.testzip() is None
   assert all(n.startswith(f'Huroof-{app}-Firebase/') and '..' not in Path(n).parts for n in archive.namelist());archive.extractall(tmp)
  folder=Path(tmp)/f'Huroof-{app}-Firebase';public=folder/'public';folders.append(folder)
  execute(folder,'--check',ok=False)
  assert 'letters-from-olive' not in (public/'js/firebase-config.js').read_text()
  edition=json.loads((public/'edition-manifest.json').read_text());assert edition['id']==app and not edition['suite'] and edition['independentProject']
  hosting=json.loads((folder/'firebase.json').read_text())['hosting'];assert hosting['public']=='public' and not hosting.get('redirects')
  assert hosting['predeploy']==['node configure-firebase.cjs --check']
  project='huroof-test-'+app;config={'projectId':project,'authDomain':project+'.firebaseapp.com','apiKey':'AIzaSy'+'a'*33,'appId':'1:123456:web:abcdef','messagingSenderId':'123456'}
  # Console JavaScript and CLI --json output must both work on Windows.
  text='const firebaseConfig = '+json.dumps(config)+';'
  if app=='start':payload=json.dumps({'status':'success','result':{'fileContents':text}})
  elif app=='a1-a2':payload=text
  else:payload=json.dumps(config)
  filename=folder/'firebase-web-config.json';filename.write_text(payload,encoding='utf-16' if app=='b1-b2' else 'utf-8-sig')
  before=(public/'pwa-worker.js').read_text();execute(folder)
  assert json.loads((folder/'.firebaserc').read_text())['projects']['default']==project
  execute(folder,'--check');browser_check(public,project);execute(folder,'--check',ok=False,env={**os.environ,'GCLOUD_PROJECT':'another-project'})
  after=(public/'pwa-worker.js').read_text();assert before!=after
  assets=json.loads(re.search(r'const ASSETS = (.*);\nconst BASE',after)[1])
  release=re.search(r'const RELEASE = "([^"]+)"',after)[1]
  assert release==hashlib.sha256(json.dumps(assets,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()[:16]
  for name,meta in assets.items():
   data=(public/name).read_bytes();assert meta['rev']==hashlib.sha256(data).hexdigest()[:16] and meta['bytes']==len(data),(app,name)
  for page in public.glob('*.html'):
   source=page.read_text()
   if page.name!='offline.html':
    assert project in source and 'HUROOF_INDEPENDENT_FIREBASE_BEGIN' in source
    assert 'AIzaSyCwWZ3SKc5jjby5oHqS-CAhwC5XQt6JqDQ' not in source
  # A new configuration cannot keep serving the prior project's cached metadata.
  config['projectId']=project+'-new';config['authDomain']=config['projectId']+'.firebaseapp.com';filename.write_text(json.dumps(config));execute(folder);execute(folder,'--check')
  assert re.search(r'const RELEASE = "([^"]+)"',(public/'pwa-worker.js').read_text())[1]!=release
  filename.write_text(json.dumps({'type':'service_account','private_key':'private-value'}));execute(folder,ok=False)
  print('PASS',app,'ZIP; root hosting; public config; project guard; all PWA hashes; project switch; private-key rejection',flush=True)
print('PASS four independent Firebase deployment packages. No production services contacted.')
