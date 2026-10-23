"""Check all CEFR topics, representative cards/tests and equivalent offline catalog."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
import argparse, json, re

parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8000')
parser.add_argument('--portable',action='store_true',help='Block separate local scripts/styles and catalog JSON')
parser.add_argument('--older-dom',action='store_true')
args=parser.parse_args();base=args.base_url.rstrip('/')
C=json.loads((Path(__file__).resolve().parents[1]/'data/vocab_catalog.json').read_text())
by_id={l['id']:l for l in C['lists']}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':950},is_mobile=True,has_touch=True)
 page=context.new_page();errors=[];blocked=[]
 page.add_init_script('localStorage.setItem("oliveLearnerThemeV1","neutral")')
 page.on('pageerror',lambda error:errors.append(str(error)))
 if args.older_dom:page.add_init_script('delete Element.prototype.replaceChildren;String.prototype.replaceAll=undefined;')
 def route(r):
  url=r.request.url
  if args.portable and (r.request.resource_type in ['script','stylesheet'] or '/data/vocab_catalog.json' in url):
   blocked.append(url);r.abort()
  elif url.startswith(base+'/'):r.continue_()
  elif not args.portable and url.startswith('https://cdn.jsdelivr.net/npm/xlsx@'):
   r.fulfill(path='/workspace/vokabeltrainer-setup/xlsx-0.18.5.js',content_type='application/javascript')
  else:r.abort()
 page.route('**/*',route)
 def home(language='ar'):
  assert page.goto(base+'/vocabulary.html').status==200
  page.locator('#app-language-select').select_option(language)
  expect(page.locator('.cefr-level-card')).to_have_count(4)
 def select_level(level):
  card=page.locator('[data-level-id="'+level+'"]')
  if level in ['B1','B2']:page.locator('#learning-path>details').evaluate('n=>n.open=true')
  card.tap()
  expect(card).to_have_attribute('aria-pressed','true')
  assert page.locator('.cefr-level-card[aria-pressed="true"]').count()==1
  expect(page.locator('.ready-list-button')).to_have_count(30)
 home()
 assert page.evaluate('VocabApp.loadCatalog()')==C
 assert page.locator('.app-sidebar nav a').count()==7
 # Existing history stays intact, while newly curated list IDs have independent mastery.
 page.evaluate('''()=>{const tests=Object.fromEntries(Object.keys(VocabApp.TEST_CONFIG).map(k=>[k,{qualifyingPasses:2,attempts:2,bestScore:100}]));localStorage.setItem('listMasteryV12',JSON.stringify({'ready-list:list_01':{sourceId:'list_01',type:'ready-list',mastered:true,tests}}));}''')
 for language in ['ar','de']:
  page.locator('#app-language-select').select_option(language)
  for level in C['levels']:
   select_level(level['id'])
   ids=page.locator('.ready-list-button').evaluate_all('ns=>ns.map(n=>n.dataset.listId)')
   assert ids==level['listIds']
   titles=page.locator('.ready-list-button strong').all_inner_texts()
   assert titles==[by_id[i]['title' if language=='ar' else 'titleDe'] for i in ids],(language,level['id'],titles)
   assert '600' in page.locator('[data-level-id="'+level['id']+'"] .cefr-level-meta').inner_text()
   for width in [320,390,768,1440]:
    page.set_viewport_size({'width':width,'height':950})
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,level['id'],width)
 page.set_viewport_size({'width':390,'height':950})
 for level in C['levels']:
  for list_id in [level['listIds'][0],level['listIds'][-1]]:
   home();select_level(level['id']);l=by_id[list_id]
   page.locator('[data-list-id="'+list_id+'"]').tap();page.wait_for_url('**/lernseite.html')
   expect(page.locator('#lesson-loading')).to_have_count(0)
   expected=[[w['ar'],w['de']] for w in l['words']]
   assert page.evaluate('VocabApp.getCurrentVocabList()')==expected
   source=page.evaluate('VocabApp.getCurrentSource()')
   assert source['id']==list_id and source['cefr']==level['id'] and source['count']==20
   assert page.evaluate('VocabApp.getCurrentListMasteryProgress().completedPasses')==0
   expect(page.locator('#front')).to_have_text(expected[0][0])
   page.locator('#flashcard').tap();expect(page.locator('#back')).to_have_text(expected[0][1])
   page.locator('#next-button').tap();expect(page.locator('#front')).to_have_text(expected[1][0])
   page.locator('#prev-button').tap();page.locator('#prev-button').tap();expect(page.locator('#front')).to_have_text(expected[-1][0])
   for language in ['de','ar']:
    page.locator('#app-language-select').select_option(language)
    expect(page.locator('#front')).to_have_text(expected[-1][0])
    meta=page.locator('#source-meta').inner_text()
    assert (l['titleDe'] if language=='de' else l['title']) in meta,meta
    assert ('Niveau '+level['id'] if language=='de' else 'المستوى '+level['id']) in meta,meta
  # Score a real multiple-choice test in each level using the selected list.
  page.goto(base+'/test2.html');questions=page.locator('.question');assert questions.count()>0
  for q in questions.all():
   ar=q.locator('.arabic-text').inner_text();de=next(w['de'] for w in l['words'] if w['ar']==ar)
   option=q.locator('input[type=radio]')
   for radio in option.all():
    if radio.input_value()==de:radio.check();break
   else:raise AssertionError('Missing correct option')
  count=questions.count();page.locator('#submit-test').tap();page.wait_for_url('**/ergebnis.html')
  assert page.locator('.result-correct').count()==count
  assert page.evaluate('VocabApp.getCurrentListMasteryProgress().completedPasses')==1
  assert page.evaluate('JSON.parse(localStorage.getItem("listMasteryV12"))["ready-list:list_01"].mastered')
  print('PASS',level['id'],'30 topics / 600 entries, first and last lists, vocalized cards, source labels and scored test',flush=True)
 # Long, fully vocalized B2 phrases work in all six existing test renderers.
 for test_number in range(1,7):
  page.goto(base+'/test'+str(test_number)+'.html')
  assert page.locator('.question').count()>0,test_number
  assert page.locator('#submit-test').is_enabled()
  for language in ['ar','de']:
   page.locator('#app-language-select').select_option(language)
   for width in [320,390,768,1440]:
    page.set_viewport_size({'width':width,'height':950})
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(test_number,language,width)
 home('ar');select_level('B2');page.evaluate('scrollTo(0,document.getElementById("ready-lists-panel").offsetTop)')
 page.set_viewport_size({'width':390,'height':950});page.screenshot(path='/tmp/jisr-cefr-mobile.png')
 page.set_viewport_size({'width':1440,'height':1000});page.screenshot(path='/tmp/jisr-cefr-desktop.png')
 assert not errors,errors
 if args.portable:
  assert any('vocab_catalog.json' in url for url in blocked)
  assert not any(url.startswith(base+'/') and not url.endswith('vocab_catalog.json') for url in blocked),blocked
 browser.close()
 print('PASS 4 levels, 120 topic bindings, 2400-entry catalog, existing history, all six test renderers, DE/AR 320–1440px; portable='+str(args.portable),flush=True)
