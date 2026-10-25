"""Spark Auth/Firestore SDK flow with a disposable Firestore protocol server.
The alternative protocol server does not validate Firestore Security Rules.
"""
from playwright.sync_api import sync_playwright,expect
from pathlib import Path
import subprocess,json,time,tempfile,os
ROOT=Path(__file__).resolve().parents[1];BASE='http://127.0.0.1:5000'
env={**os.environ,'FIREBASE_AUTH_EMULATOR_HOST':'127.0.0.1:9099','FIRESTORE_EMULATOR_HOST':'127.0.0.1:8080'}
seed=json.loads(subprocess.check_output(['node','verification/seed.cjs'],cwd=ROOT,text=True,env=env))
admin_email=seed['admin']['email'];student_email=seed['student']['email'];student_uid=seed['student']['uid'];password='Olive-Admin-Test-123!'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);contexts=[];errors=[]
 def context():
  ctx=b.new_context(viewport={'width':390,'height':900},is_mobile=True,has_touch=True);contexts.append(ctx);ctx.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral')");page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  def route(r):
   if r.request.url.startswith(tuple('http://127.0.0.1:'+str(port)+'/' for port in [5000,9099,8080])):r.continue_()
   else:r.abort()
  ctx.route('**/*',route);return ctx,page
 def login(page,email):
  page.goto(BASE+'/login.html');expect(page.locator('#auth-submit')).to_be_enabled(timeout=20000);page.locator('#auth-email').fill(email);page.locator('#auth-password').fill(password);page.locator('#auth-remember').check();page.locator('#auth-submit').click()
 admin_context,owner=context();login(owner,admin_email);owner.wait_for_selector('#auth-admin-link',state='attached',timeout=30000);owner.goto(BASE+'/admin.html');owner.wait_for_selector('#admin-members .admin-member',timeout=30000)
 assert owner.locator('.app-sidebar a[aria-current=page]').get_attribute('href')=='admin.html'
 # Free Spark permits an Auth record; an unapproved verified account cannot open app content.
 outsider_context,outsider=context();login(outsider,seed['outsider']['email']);expect(outsider.locator('#auth-blocker')).to_contain_text('غير مضاف',timeout=30000);assert outsider.evaluate('typeof VocabApp')=='undefined'
 first_context,first=context();login(first,student_email);first.wait_for_selector('#olive-account',timeout=30000);assert first.locator('#auth-admin-link').count()==0
 first.evaluate('VocabApp.setJSON("learningStats",{...VocabApp.getStats(),adminTestSentinel:"student-progress"})')
 first.goto(BASE+'/skills.html#a1-01/writing');first.wait_for_selector('[data-draft=writing]');first.locator('[data-draft=writing]').fill('هَذِهِ كِتَابَتِي.');first.get_by_role('button',name='احفظ إجابتي',exact=True).tap()
 denied=first.evaluate('''async()=>{try{await OliveAccess.admin('adminListMembers');return 'unexpected'}catch(e){return e.code}}''');assert denied=='ADMIN_ONLY'
 second_context,second=context();login(second,student_email);second.wait_for_selector('#olive-account',timeout=30000)
 third_context,third=context();login(third,student_email);expect(third.locator('#auth-blocker')).to_contain_text('جهازين',timeout=30000);assert third.evaluate('typeof VocabApp')=='undefined'
 # Same browser on reload and a second tab still occupies a single registered slot.
 first.reload();first.wait_for_selector('#olive-account',timeout=30000);expect(first.locator('[data-draft=writing]')).to_have_value('هَذِهِ كِتَابَتِي.')
 tab=first_context.new_page();tab.goto(BASE+'/index.html');tab.wait_for_selector('#olive-account',timeout=30000)
 owner.locator('#admin-search').fill(student_email);expect(owner.locator('#admin-members .admin-member')).to_have_count(1);owner.wait_for_function("document.getElementById('admin-status').textContent.includes('1')");expect(owner.locator('#admin-members')).to_contain_text('٢ من ٢')
 owner.get_by_role('button',name='عرض الأجهزة',exact=True).click();expect(owner.locator('#admin-devices .admin-member')).to_have_count(2)
 second_id=second.evaluate('OliveAccess.deviceId()')
 device=owner.locator('#admin-devices .admin-member').filter(has_text=second_id[:12]);device.get_by_role('button',name='إلغاء تسجيل الجهاز',exact=True).click();expect(device).to_contain_text('أُلغي تسجيله')
 second.evaluate('OliveAccess.heartbeat()');expect(second.locator('#auth-blocker')).to_contain_text('أُلغي',timeout=30000)
 third.reload();third.wait_for_selector('#olive-account',timeout=30000)
 # Disabling an email cuts off new protected calls; re-enabling preserves the learning records.
 owner.get_by_role('button',name='تعطيل السماح',exact=True).click();expect(owner.get_by_role('button',name='إعادة السماح',exact=True)).to_be_visible()
 first.evaluate('OliveAccess.heartbeat()');expect(first.locator('#auth-blocker')).to_contain_text('غير مضاف',timeout=30000)
 owner.get_by_role('button',name='إعادة السماح',exact=True).click();expect(owner.get_by_role('button',name='تعطيل السماح',exact=True)).to_be_visible();first.reload();first.wait_for_selector('#olive-account',timeout=30000);assert first.evaluate('VocabApp.getStats().adminTestSentinel')=='student-progress'
 # Dialogs and the administrator page fit both interface languages and phone/desktop sizes.
 for lang in ['ar','de']:
  owner.locator('#app-language-select').select_option(lang)
  for width in [320,390,768,1440]:
   owner.set_viewport_size({'width':width,'height':1000});owner.wait_for_timeout(240);assert owner.evaluate('document.documentElement.scrollWidth<=innerWidth'),(lang,width)
 owner.set_viewport_size({'width':390,'height':900});owner.locator('#app-language-select').select_option('ar');owner.keyboard.press('Escape');owner.wait_for_timeout(400);owner.locator('#admin-members').scroll_into_view_if_needed();owner.screenshot(path='/tmp/olive-admin-mobile.png')
 assert not errors,errors;b.close();print('PASS Spark browser flow: approved email gate, unapproved account blocked in UI, private admin UI, cooperative two-browser limit, shared tabs, device reporting/block, email disable/re-enable, preserved progress and AR/DE layout. Official Firestore Rules validation is separate.')
