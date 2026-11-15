"""Validate the user's two public WEB configs and actual Firebase SDK initialization.
All browser networking is local-fixtured; no production users or writes are created.
"""
import hashlib,json,mimetypes,os,re,subprocess,tempfile
from pathlib import Path
from urllib.parse import urlparse
from zipfile import ZipFile
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='huroof-ready-test-') as tmp:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for app,label in [('start','Start'),('a1-a2','A1-A2')]:
   expected=json.loads((ROOT/'suite/firebase-projects'/f'{app}.json').read_text());project=expected['projectId']
   with ZipFile(ROOT/f'downloads/Huroof-{label}-Firebase-Ready.zip') as archive:
    assert archive.testzip() is None;archive.extractall(tmp)
   folder=Path(tmp)/f'Huroof-{app}-Firebase';public=folder/'public'
   assert json.loads((folder/'firebase-web-config.json').read_text())==expected
   assert json.loads((folder/'.firebaserc').read_text())['projects']['default']==project
   assert json.loads((folder/'firebase.json').read_text())['hosting']['public']=='public'
   for target,success in [(project,True),('wrong-project-id',False)]:
    result=subprocess.run(['node',str(folder/'configure-firebase.cjs'),'--check'],capture_output=True,text=True,env={**os.environ,'GCLOUD_PROJECT':target});assert (result.returncode==0)==success,result.stderr
   worker=(public/'pwa-worker.js').read_text();assets=json.loads(re.search(r'const ASSETS = (.*);\nconst BASE',worker)[1])
   for name,meta in assets.items():
    data=(public/name).read_bytes();assert meta['rev']==hashlib.sha256(data).hexdigest()[:16] and meta['bytes']==len(data),(app,name)
   for filename in public.glob('*.html'):
    if filename.name=='offline.html':continue
    text=filename.read_text();assert json.dumps(expected,separators=(',',':')) in text
    assert 'AIzaSyCwWZ3SKc5jjby5oHqS-CAhwC5XQt6JqDQ' not in text
   context=browser.new_context(service_workers='block')
   context.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral')")
   def route(r):
    url=urlparse(r.request.url)
    if url.hostname!=project+'.web.app':return r.abort()
    path=public/url.path.lstrip('/')
    if not path.is_file():return r.fulfill(status=404,body='Missing fixture')
    r.fulfill(body=path.read_bytes(),content_type=mimetypes.guess_type(path)[0] or 'application/octet-stream')
   context.route('**/*',route);page=context.new_page();errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
   page.goto('https://'+project+'.web.app/index.html');page.wait_for_url('**/login.html?**')
   page.wait_for_function('window.firebase && firebase.apps.length===1')
   assert page.evaluate('firebase.app().options.projectId')==project
   assert page.evaluate('firebase.app().options.appId')==expected['appId']
   assert page.evaluate('firebase.app().options.apiKey')==expected['apiKey']
   page.wait_for_function('!document.getElementById("auth-submit").disabled')
   assert page.evaluate('firebase.auth().currentUser') is None
   assert not errors,errors
   context.close()
   print('PASS',app,project,'actual Firebase SDK; login redirect; exact public config; project guard; PWA hashes; ZIP',flush=True)
  browser.close()
print('PASS two configured packages; no real Firebase accounts or database writes.')
