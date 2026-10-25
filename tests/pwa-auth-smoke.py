"""Real Firebase Auth emulator: remembered offline launch, sign-out, and account isolation."""
from playwright.sync_api import sync_playwright,expect
import time,tempfile
BASE='http://127.0.0.1:5000';EMULATOR='http://127.0.0.1:9099'
with sync_playwright() as p:
 profile=tempfile.mkdtemp(prefix='olive-pwa-auth-',dir='/tmp');ctx=p.chromium.launch_persistent_context(profile,executable_path='/usr/bin/chromium',args=['--no-sandbox'],viewport={'width':390,'height':900},is_mobile=True,has_touch=True);b=ctx.browser
 ctx.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral')")
 errors=[];page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 # Any non-emulator endpoint is blocked; no real account or production database.
 def route(r):
  if r.request.url.startswith(BASE+'/') or r.request.url.startswith(EMULATOR+'/'):r.continue_()
  else:r.abort()
 ctx.route('**/*',route)
 page.goto(BASE+'/index.html');page.wait_for_url('**/login.html**');page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=60000)
 def register(email):
  expect(page.locator('#auth-submit')).to_be_enabled();page.locator('[data-auth-mode=register]').click();page.locator('#auth-email').fill(email);page.locator('#auth-password').fill('Olive-PWA-Test-123!');page.locator('#auth-confirm').fill('Olive-PWA-Test-123!');page.locator('#auth-remember').check();page.locator('#auth-submit').click();page.wait_for_selector('#olive-account',timeout=30000)
 email_a=f'olive-pwa-a-{time.time_ns()}@example.test';register(email_a)
 page.evaluate('VocabApp.setJSON("learningStats",{...VocabApp.getStats(),pwaOfflineSentinel:"only-account-a"})')
 uid=page.evaluate('OliveAuth.getUser().uid');assert uid
 ctx.set_offline(True);start=time.monotonic();page.goto(BASE+'/skills.html#a1-01/writing');page.wait_for_selector('#olive-account',timeout=20000);page.wait_for_selector('[data-draft=writing]');assert time.monotonic()-start<15
 assert page.evaluate('OliveAuth.getUser().uid')==uid;assert page.evaluate('VocabApp.getStats().pwaOfflineSentinel')=='only-account-a'
 page.locator('[data-draft=writing]').fill('كِتَابَةٌ دُونَ اتِّصَالٍ.');page.get_by_role('button',name='احفظ إجابتي',exact=True).click();page.reload();expect(page.locator('[data-draft=writing]')).to_have_value('كِتَابَةٌ دُونَ اتِّصَالٍ.')
 # Cold start: browser closed and reopened offline, using the SDK's own persisted session.
 ctx.close();ctx=p.chromium.launch_persistent_context(profile,executable_path='/usr/bin/chromium',args=['--no-sandbox'],viewport={'width':390,'height':900},is_mobile=True,has_touch=True,offline=True);b=ctx.browser;ctx.route('**/*',route);page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.goto(BASE+'/skills.html#a1-01/writing');page.wait_for_selector('#olive-account',timeout=20000);expect(page.locator('[data-draft=writing]')).to_have_value('كِتَابَةٌ دُونَ اتِّصَالٍ.');assert page.evaluate('OliveAuth.getUser().uid')==uid
 page.locator('#olive-account summary').click();page.locator('#auth-signout').click();page.wait_for_url('**/login.html**');expect(page.locator('#auth-submit')).to_be_enabled()
 page.goto(BASE+'/skills.html');page.wait_for_url('**/login.html**');assert page.evaluate('typeof VocabApp')=='undefined','Cached HTML must not bypass the auth gate'
 ctx.set_offline(False);page.reload();register(f'olive-pwa-b-{time.time_ns()}@example.test');assert page.evaluate('OliveAuth.getUser().uid')!=uid;assert page.evaluate('VocabApp.getStats().pwaOfflineSentinel') is None
 assert page.evaluate('Object.keys(VocabApp.getStats().skillsV1||{}).length')==0
 for name in page.evaluate('caches.keys()'):
  urls=page.evaluate('async n=>(await(await caches.open(n)).keys()).map(r=>r.url)',name)
  assert not any('googleapis.com' in u or '/users/' in u or 'securetoken' in u or 'identitytoolkit' in u for u in urls)
 assert not errors,errors;b.close();print('PASS real Firebase remembered cold offline launch, offline drafts, offline sign-out, protected cached pages and two-account isolation; no production endpoints')
