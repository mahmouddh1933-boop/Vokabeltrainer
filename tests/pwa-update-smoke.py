"""Update lifecycle under a subdirectory, with two tabs and an incomplete release."""
from pathlib import Path
import tempfile,subprocess,shutil,hashlib
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1];directory=Path(tempfile.mkdtemp(prefix='olive-pwa-update-',dir='/tmp'));app=directory/'app';app.mkdir()
for folder in ['images/pwa','images/brand']:shutil.copytree(ROOT/folder,app/folder)
(app/'css').mkdir();(app/'js').mkdir()
for name in ['js/pwa.js','css/pwa.css','manifest.webmanifest','offline.html']:shutil.copy2(ROOT/name,app/name)
def release(n):
 (app/'js/version.js').write_text('window.oliveVersion='+str(n)+';')
 rev=hashlib.sha256((app/'js/version.js').read_bytes()).hexdigest()[:12]
 (app/'index.html').write_text(f'''<!doctype html><html lang="ar" dir="rtl"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="css/pwa.css"><script src="js/version.js?v={rev}" defer></script><script src="js/pwa.js" defer></script></head><body><main><h1>اختبار التحديث</h1><textarea id="draft"></textarea></main></body></html>''')
 subprocess.run(['python',str(ROOT/'tools/build-pwa.py'),'--directory',str(app)],check=True,stdout=subprocess.DEVNULL)
 return rev
old=release(1)
server=subprocess.Popen(['python','-m','http.server','8071','--bind','127.0.0.1','--directory',str(directory)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context();page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('http://127.0.0.1:8071/app/index.html');page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=30000);page.locator('#olive-pwa summary').click();assert page.evaluate('oliveVersion')==1
  assert page.evaluate('navigator.serviceWorker.getRegistration().then(r=>r.scope)')=='http://127.0.0.1:8071/app/'
  other=ctx.new_page();other.goto(page.url);other.wait_for_function('oliveVersion===1');other.locator('#draft').fill('لا تقاطع التمرين')
  page.evaluate('localStorage.setItem("pwa-progress-test","saved")');release(2);page.locator('#pwa-check-update').click();expect(page.locator('#pwa-update')).to_be_visible(timeout=30000)
  assert page.evaluate('oliveVersion')==1;expect(other.locator('#draft')).to_have_value('لا تقاطع التمرين')
  page.locator('#pwa-update').click();page.wait_for_function('window.oliveVersion===2',timeout=30000);assert page.evaluate('localStorage.getItem("pwa-progress-test")')=='saved'
  # Accepting in one tab does not force another tab to reload an unfinished task.
  expect(other.locator('#draft')).to_have_value('لا تقاطع التمرين');assert other.evaluate('oliveVersion')==1
  assert other.evaluate("rev=>fetch('js/version.js?v='+rev).then(r=>r.text())",old)=='window.oliveVersion=1;'
  ctx.set_offline(True);page.reload();page.wait_for_function('oliveVersion===2');ctx.set_offline(False)
  # A mismatched asset cannot replace the complete working release.
  release(3);(app/'js/version.js').write_text('window.oliveVersion=999;')
  page.evaluate('navigator.serviceWorker.getRegistration().then(r=>r.update())')
  page.wait_for_function('navigator.serviceWorker.getRegistration().then(r=>!r.installing)',timeout=30000)
  page.reload();page.wait_for_function('oliveVersion===2');assert page.evaluate('oliveVersion')==2
  assert not errors,errors;b.close();print('PASS scoped subdirectory, waiting update, explicit activation, saved progress, unrefreshed second tab, previous assets and failed-release rollback')
finally:server.terminate();server.wait()
