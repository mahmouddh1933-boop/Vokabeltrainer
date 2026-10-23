"""Mobile letter banks stay compact and tappable; ordering, undo/reset and scoring still work."""
import argparse,re
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8026');parser.add_argument('--inline',action='store_true');args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 if args.inline:page.route('**/*',lambda r:r.abort() if r.request.resource_type in ['script','stylesheet'] else r.continue_())
 page.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');")
 page.goto(base+'/test.html')
 for word in ['صَبَاحُ الْخَيْرِ','مُعَلِّمٌ','الْجَامِعَةُ الْعَرَبِيَّةُ']:
  page.evaluate('(word)=>{VocabApp.saveVocabList([[word,"Guten Morgen"]],{type:"custom",id:"mobile-scramble"});VocabApp.setTestDuration(120);}',word)
  page.goto(base+'/test5.html');expect(page.locator('.question')).to_have_count(1)
  for language in ['ar','de']:
   page.locator('#app-language-select').select_option(language)
   for width in [320,360,390,430,640,768,1440]:
    page.set_viewport_size({'width':width,'height':844});page.wait_for_timeout(70)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(word,width,language)
    boxes=page.locator('.scramble-tile').evaluate_all('els=>els.map(e=>e.getBoundingClientRect().toJSON())')
    assert all(44<=x['width']<=54 and 44<=x['height']<=54 for x in boxes),(width,boxes)
    assert abs(boxes[0]['top']-boxes[1]['top'])<1,(word,width,'letters stacked')
    for a in boxes:
     for c in boxes:
      if a is c:continue
      assert min(a['right'],c['right'])-max(a['left'],c['left'])<=1 or min(a['bottom'],c['bottom'])-max(a['top'],c['top'])<=1
    if width<=430:
     bank=page.locator('.scramble-tiles').bounding_box();assert bank['height']<=306,(word,width,bank)
     if word=='صَبَاحُ الْخَيْرِ':assert page.locator('.scramble-answer').bounding_box()['height']<=100
  page.set_viewport_size({'width':390,'height':844});page.locator('#app-language-select').select_option('ar')
  page.locator('.question').scroll_into_view_if_needed();page.locator('.scramble-tile').first.tap();assert page.locator('.scramble-tile:disabled').count()==1
  page.locator('[data-undo]').tap();assert page.locator('.scramble-tile:disabled').count()==0
  page.locator('.scramble-tile').first.tap();page.locator('[data-reset]').tap();assert page.locator('.scramble-tile:disabled').count()==0
  plain=page.evaluate('w=>VocabApp.stripArabicDiacritics(w)',word)
  page.locator('.question').scroll_into_view_if_needed();top=page.evaluate('scrollY')
  for char in plain.replace(' ',''):page.locator('.scramble-tile:enabled').filter(has_text=re.compile('^'+re.escape(char)+'$')).first.tap()
  assert page.locator('.scramble-answer').inner_text()==plain
  assert abs(page.evaluate('scrollY')-top)<5,'Had to scroll to pick letters'
  if word=='صَبَاحُ الْخَيْرِ':
   page.screenshot(path='/tmp/olive-exam-review/scramble-mobile-fixed.png')
  page.locator('#submit-test').tap();page.wait_for_url('**/ergebnis.html');results=page.evaluate('VocabApp.getJSON("testResults",[])');assert results[0]['answer']==plain
  print('PASS',word,'mobile grid, repeated letters, undo/reset, word spacing and submission')
 assert not errors,errors;b.close()
