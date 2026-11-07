"""Book collection order, exact cards/audio, six quizzes, results and portable release."""
from pathlib import Path
import argparse,json,unicodedata
from playwright.sync_api import sync_playwright,expect
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8058');p.add_argument('--portable',action='store_true');a=p.parse_args();base=a.base_url.rstrip('/')
root=Path(__file__).resolve().parents[1];C=json.loads((root/'data/vocab_catalog.json').read_text());B=C['bookVocabulary']
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 ctx=browser.new_context(viewport={'width':390,'height':950},is_mobile=True,has_touch=True,service_workers='block')
 ctx.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__bookAudio=this;return play.call(this)}")
 page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 def route(r):
  if not r.request.url.startswith(base+'/'):r.abort()
  elif a.portable and (r.request.resource_type in ['script','stylesheet'] or '/data/vocab_catalog.json' in r.request.url):r.abort()
  else:r.continue_()
 page.route('**/*',route)
 def home():
  page.goto(base+'/vocabulary.html');page.wait_for_selector('#book-vocabulary-lists button')
 home()
 assert page.locator('#book-vocabulary-lists button').count()==9
 assert page.locator('#learning-path .ready-list-button').count()==30
 assert page.evaluate('document.getElementById("book-vocabulary-panel").compareDocumentPosition(document.getElementById("ready-lists-panel"))&Node.DOCUMENT_POSITION_FOLLOWING')
 assert page.evaluate('VocabApp.loadCatalog()')==C
 for lang in ['ar','de']:
  page.locator('#app-language-select').select_option(lang)
  expect(page.locator('#book-vocabulary-title')).to_have_text('Buchwortschatz' if lang=='de' else 'مفردات الكتب')
  assert page.locator('#book-vocabulary-lists strong').all_text_contents()==[l['titleDe' if lang=='de' else 'title'] for l in B['lists']]
  for width in [320,390,768,1440]:
   page.set_viewport_size({'width':width,'height':950});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(lang,width)
 page.set_viewport_size({'width':390,'height':950})
 # All lists transfer their exact, non-truncated data into the existing card system.
 for l in B['lists']:
  home();page.locator('[data-list-id="'+l['id']+'"]').tap();page.wait_for_url('**/lernseite.html');page.wait_for_selector('#front')
  pairs=[[w['ar'],w['de']] for w in l['words']]
  assert page.evaluate('VocabApp.getCurrentVocabList()')==pairs
  s=page.evaluate('VocabApp.getCurrentSource()');assert s['id']==l['id'] and s['collection']=='book-vocabulary' and s['cefr'] is None and s['count']==len(pairs)
  meta=page.locator('#source-meta').inner_text()
  assert ('Buchwortschatz' if page.locator('html').get_attribute('lang')=='de' else 'مفردات الكتب') in meta,meta
  expect(page.locator('#front')).to_contain_text(pairs[0][0].replace('ًا','اً'));page.locator('#flashcard').tap();expect(page.locator('#back')).to_have_text(pairs[0][1]);page.locator('#next-button').tap();expect(page.locator('#front')).to_contain_text(pairs[1][0].replace('ًا','اً'))
  page.locator('#prev-button').tap();page.locator('#prev-button').tap();expect(page.locator('#front')).to_contain_text(pairs[-1][0].replace('ًا','اً'))
 # A book-only proper name uses its bundled MP3, rather than remote/device TTS.
 home();page.locator('[data-list-id="'+B['lists'][0]['id']+'"]').tap();page.wait_for_url('**/lernseite.html')
 for _ in range(4):page.locator('#next-button').tap()
 expect(page.locator('#front')).to_have_text('فَتْحِي')
 page.locator('#pronounce-button').tap();page.wait_for_function('window.__bookAudio&&!__bookAudio.paused')
 assert '/audio/book-vocabulary/' in page.evaluate('__bookAudio.currentSrc')
 page.evaluate('VocabApp.stopSpeech()')
 # Every existing test type must work with the smaller final list, too.
 home();last=B['lists'][-1];page.locator('[data-list-id="'+last['id']+'"]').tap();page.wait_for_url('**/lernseite.html')
 for n in range(1,7):
  page.goto(base+'/test'+str(n)+'.html');page.wait_for_selector('.question');assert page.locator('.question').count()>0
  assert page.locator('#submit-test').is_enabled()
  for lang in ['ar','de']:
   page.locator('#app-language-select').select_option(lang)
   page.set_viewport_size({'width':320,'height':950});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(n,lang)
 # Score a real quiz; mastery belongs to this book list and survives reload.
 page.goto(base+'/test2.html');page.wait_for_selector('.question')
 for q in page.locator('.question').all():
  ar=q.locator('.arabic-text').inner_text();answer=next(w['de'] for w in last['words'] if w['ar'].replace('ًا','اً')==ar)
  for radio in q.locator('input[type=radio]').all():
   if radio.input_value()==answer:radio.check();break
  else:raise AssertionError('Correct option missing')
 count=page.locator('.question').count();page.locator('#submit-test').tap();page.wait_for_url('**/ergebnis.html')
 assert page.locator('.result-correct').count()==count
 page.reload();assert page.locator('.result-correct').count()==count
 assert page.evaluate('VocabApp.getCurrentListMasteryProgress().completedPasses')==1
 home();page.set_viewport_size({'width':390,'height':950});page.locator('#app-language-select').select_option('ar');page.wait_for_timeout(350)
 page.locator('#book-vocabulary-panel').scroll_into_view_if_needed();page.screenshot(path='/tmp/olive-book-vocabulary/mobile.png')
 assert not errors,errors
 browser.close();print('PASS nine book lists above CEFR, all 175 cards, bundled book-only audio, all six quizzes, scored mastery, AR/DE mobile and portable catalog')
