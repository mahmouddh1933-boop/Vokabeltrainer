"""Two independent browsers with real Auth/Firestore SDKs and private emulator rules."""
from playwright.sync_api import sync_playwright, expect
from urllib.request import urlopen
from urllib.error import HTTPError
import time,json
BASE='http://127.0.0.1:5000'
PROJECT='letters-from-olive'
PASSWORD='Test-Olive-123!'
EMAIL=f'olive-sync-{time.time_ns()}@example.test'
errors=[];external=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 def device():
  context=browser.new_context(viewport={'width':390,'height':950},is_mobile=True,has_touch=True)
  context.add_init_script("if(location.origin==='http://127.0.0.1:5000'){if(!localStorage.getItem('vocabInterfaceLanguage'))localStorage.setItem('vocabInterfaceLanguage','de');if(!localStorage.getItem('oliveLearnerThemeV1'))localStorage.setItem('oliveLearnerThemeV1','neutral')}")
  context.on('page',lambda page:page.on('pageerror',lambda error:errors.append(str(error))))
  def route(r):
   if any(r.request.url.startswith(origin+'/') for origin in [BASE,'http://127.0.0.1:8080','http://127.0.0.1:9099']):r.continue_()
   elif r.request.url.startswith('https://cdn.jsdelivr.net/npm/xlsx@'):r.abort()
   else:external.append(r.request.url);r.abort()
  context.route('**/*',route)
  return context
 def ready(page):
  page.wait_for_selector('#olive-account',timeout=45000)
  page.wait_for_function('!document.documentElement.classList.contains("auth-pending")')
 def login(context,email=EMAIL,register=False,target='index.html'):
  page=context.new_page();page.goto(BASE+'/'+target)
  page.wait_for_url('**/login.html**')
  expect(page.locator('#auth-submit')).to_be_enabled()
  if register:page.locator('[data-auth-mode="register"]').click()
  page.locator('#auth-email').fill(email);page.locator('#auth-password').fill(PASSWORD)
  if register:page.locator('#auth-confirm').fill(PASSWORD)
  page.locator('#auth-remember').check();page.locator('#auth-submit').click()
  ready(page)
  return page
 def synced(page):
  assert page.evaluate('async()=>await OliveSync.flush()')
  page.wait_for_function('OliveSync.state().status==="saved" && OliveSync.state().pending===0')
 def remote(page):page.wait_for_function('OliveSync.state().remoteChanged===true')
 def accept(page):
  page.locator('#olive-account summary').click()
  page.locator('#auth-sync-now').click()
  page.wait_for_event('load');ready(page)
 def write(page,key,value):page.evaluate('([key,value])=>JisrStorage.local.setItem(key,JSON.stringify(value))',[key,value])
 def read(page,key):return page.evaluate('key=>JSON.parse(JisrStorage.local.getItem(key))',key)
 a_context=device();a=login(a_context,register=True);synced(a)
 uid=a.evaluate('OliveAuth.getUser().uid')
 # Real UI exercise, not just a hand-written test state.
 a.goto(BASE+'/sentences.html');ready(a)
 for word in ['أَنَا','طَالِبٌ']:
  a.locator('#sentence-bank button').filter(has_text=word).click()
 a.locator('#sentence-check').click();expect(a.locator('#sentence-feedback')).to_contain_text('Richtig')
 synced(a)
 b_context=device();b=login(b_context,target='sentences.html');synced(b)
 assert read(b,'jisrPracticeV1:sentences')['answers']['s01']['solved']
 expect(b.locator('#sentence-feedback')).to_contain_text('Richtig')
 print('PASS second browser restores a genuinely completed sentence exercise',flush=True)
 # Background preferences travel with the account as well.
 a.locator('#olive-theme-open').click();a.locator('[data-learner-choice="girl"]').click();synced(a)
 remote(b);accept(b);expect(b.locator('html')).to_have_attribute('data-learner-theme','girl')
 # Concurrent work on different book activities is merged, keeping a draft active.
 write(a,'jisrPracticeV1:youth-two',{'answers':{'activity-a':{'one':'أَنَا'}},'drafts':{'activity-a':{'writing':'نَصِّي الأَوَّلُ'}}})
 write(b,'jisrPracticeV1:youth-two',{'answers':{'activity-b':{'two':'هُوَ'}},'drafts':{'activity-b':{'writing':'نَصِّي الثَّانِي'}}})
 synced(a);synced(b);remote(a)
 # Neither open page is reloaded automatically.
 assert 'activity-b' not in read(a,'jisrPracticeV1:youth-two')['answers']
 accept(a)
 merged=read(a,'jisrPracticeV1:youth-two')
 assert set(merged['answers'])=={'activity-a','activity-b'}
 assert set(merged['drafts'])=={'activity-a','activity-b'}
 # Two equal-looking test increments still count as two independent tests.
 write(a,'learningStats',{'totalTests':1,'correctAnswers':3,'bestScore':100})
 write(b,'learningStats',{'totalTests':1,'correctAnswers':2,'bestScore':80})
 synced(a);synced(b)
 b.goto(BASE+'/stats.html');ready(b)
 assert read(b,'learningStats')['totalTests']==2
 assert read(b,'learningStats')['correctAnswers']==5
 assert read(b,'learningStats')['bestScore']==100
 print('PASS concurrent questions, independent test counters, drafts, preferences and safe update action',flush=True)
 # Offline writes are durably journaled before any network request.
 a.evaluate('async()=>{await firebase.firestore().disableNetwork();Object.defineProperty(navigator,"onLine",{configurable:true,get:()=>false});window.dispatchEvent(new Event("offline"));}')
 write(a,'wrongWords',[{'key':'word-a','arabic':'كِتَابٌ','german':'Buch','mistakes':1}])
 assert a.evaluate('async()=>await OliveSync.flush()') is False
 assert a.evaluate('OliveSync.state().pending')>0
 old_journal=a.evaluate('()=>{const key=JisrStorage.local.keys().find(k=>k.startsWith("__oliveSyncJournalV1:") && JSON.parse(JisrStorage.local.getItem(k)).outbox.wrongWords);return [key,JisrStorage.local.getItem(key)]}')
 assert old_journal[0]
 a.evaluate('async()=>{delete navigator.onLine;await firebase.firestore().enableNetwork();window.dispatchEvent(new Event("online"));}')
 synced(a)
 # Restore a lost acknowledgement: retry must not increment a word twice.
 a.evaluate('([key,value])=>JisrStorage.local.setItem(key,value,{silent:true})',old_journal)
 a.reload();ready(a);synced(a)
 b.goto(BASE+'/review.html');ready(b)
 assert read(b,'wrongWords')[0]['mistakes']==1
 print('PASS offline/reconnect, durable outbox and duplicate-acknowledgement protection',flush=True)
 # A tab closed while offline is recovered by a new tab on the same device.
 a.evaluate('async()=>{await firebase.firestore().disableNetwork();Object.defineProperty(navigator,"onLine",{configurable:true,get:()=>false});}')
 write(a,'studiedWords',[{'key':'known-a','arabic':'بَيْتٌ','german':'Haus','firstSeen':'2026-10-22T00:00:00Z'}])
 assert a.evaluate('async()=>await OliveSync.flush()') is False
 a.close()
 a=a_context.new_page();a.goto(BASE+'/stats.html');ready(a);synced(a)
 b.reload();ready(b)
 assert read(b,'studiedWords')[0]['key']=='known-a'
 # Explicit removal is propagated as a tombstone instead of reappearing.
 a.evaluate('JisrStorage.local.removeItem("wrongWords")');synced(a)
 b.reload();ready(b);assert read(b,'wrongWords') is None
 print('PASS closed offline tab recovery and deletion propagation',flush=True)
 # A fresh profile for another account cannot load, change, list or delete this user's data.
 other_context=device();other=login(other_context,email=f'other-{time.time_ns()}@example.test',register=True);synced(other)
 assert other.evaluate('VocabApp.getStats().totalTests')==0
 assert read(other,'studiedWords') is None
 code=other.evaluate('''async uid=>{try{await firebase.firestore().doc('users/'+uid+'/learning/learningStats').get({source:'server'});return 'allowed';}catch(e){return e.code;}}''',uid)
 assert code=='permission-denied',code
 for operation in ['set','delete']:
  code=other.evaluate('''async([uid,operation])=>{try{const ref=firebase.firestore().doc('users/'+uid+'/learning/learningStats');if(operation==='set')await ref.set({value:'steal'});else await ref.delete();return 'allowed';}catch(e){return e.code;}}''',[uid,operation])
  assert code=='permission-denied',(operation,code)
 invalid=other.evaluate('''async()=>{try{const uid=OliveAuth.getUser().uid;await firebase.firestore().doc('users/'+uid+'/learning/password').set({schema:1,revision:1,value:'secret',applied:{},updatedAt:firebase.firestore.FieldValue.serverTimestamp()});return 'allowed';}catch(e){return e.code;}}''')
 assert invalid=='permission-denied'
 malformed=other.evaluate('''async()=>{try{const uid=OliveAuth.getUser().uid;await firebase.firestore().doc('users/'+uid+'/learning/learningStats').set({schema:1,revision:1,value:'bad',applied:{},updatedAt:'not-a-server-time'});return 'allowed';}catch(e){return e.code;}}''')
 assert malformed=='permission-denied'
 try:
  urlopen('http://127.0.0.1:8080/v1/projects/'+PROJECT+'/databases/(default)/documents/users/'+uid+'/learning/learningStats')
  raise AssertionError('Anonymous access must fail')
 except HTTPError as error:assert error.code in [401,403],error.code
 print('PASS real Firestore rules deny anonymous and cross-account access, unsupported fields and malformed writes',flush=True)
 # A missing sync module still journals changes for the next successful load.
 a.route('**/cloud-sync-core.js',lambda r:r.abort())
 a.goto(BASE+'/stats.html');ready(a)
 assert a.evaluate('typeof OliveSync')=='undefined'
 write(a,'learningStats',{'totalTests':3,'correctAnswers':6,'bestScore':100})
 assert a.evaluate('!!JisrStorage.local.getItem("__oliveSyncFallbackV1")')
 a.unroute('**/cloud-sync-core.js');a.reload();ready(a);synced(a)
 b.reload();ready(b);assert read(b,'learningStats')['totalTests']==3
 print('PASS fallback journaling when a sync module cannot load',flush=True)
 # Online lesson state is usable on small screens and both UI languages.
 a.locator('#olive-account summary').click()
 for lang in ['de','ar']:
  a.locator('#app-language-select').select_option(lang)
  for width in [320,390,768,1440]:
   a.set_viewport_size({'width':width,'height':950});a.wait_for_timeout(400)
   assert a.evaluate('document.documentElement.scrollWidth<=innerWidth'),(lang,width)
 a.set_viewport_size({'width':390,'height':950});a.wait_for_timeout(400)
 a.screenshot(path='/tmp/olive-cloud-sync-mobile.png')
 assert not errors,errors
 assert not external,external
 browser.close()
 print('PASS full Firebase sync with separate devices, real SDK/emulators, private rules and no production requests',flush=True)
