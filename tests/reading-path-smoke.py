"""Full new reading bank, expanded sentence types, seven-stage navigation and persisted state."""
import argparse,re
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8021');parser.add_argument('--inline',action='store_true');args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':900},is_mobile=True,has_touch=True);errors=[];failed=[];external=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
 def request(r):
  if not r.request.url.startswith(base+'/'):external.append(r.request.url);r.abort()
  elif args.inline and r.request.resource_type in ['script','stylesheet']:r.abort()
  else:r.continue_()
 page.route('**/*',request)
 page.add_init_script("""localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');window.__plays=0;window.__src='';const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__src=this.src;this.addEventListener('playing',()=>__plays++,{once:true});return play.call(this)};""")
 def go(name):page.goto(base+'/'+name+'.html');page.wait_for_timeout(100)
 def language(v):page.locator('#app-language-select').select_option(v)
 def audio(selector):
  before=page.evaluate('__plays');page.locator(selector).tap();page.wait_for_function('n=>__plays>n',arg=before);assert '/audio/' in page.evaluate('__src');page.evaluate('VocabApp.stopSpeech()')
 def layout():
  for lang in ['ar','de']:
   language(lang)
   for width in [320,390,768,1440]:
    page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(220);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(page.url,lang,width)
  page.set_viewport_size({'width':390,'height':900});language('ar');page.wait_for_timeout(300)
 expected=['الحروف وتدريباتها','القراءة والهجاء','المفردات','تكوين الجمل','قصص قصيرة','كتب ونصوص وتمارين','القواعد والإملاء']
 go('index');assert page.locator('.app-sidebar nav a').all_text_contents()==expected
 assert page.locator('.sidebar-credit').inner_text()=='إعداد الأستاذ محمود بركات';assert page.locator('#overall-learning-path li').count()==7
 page.locator('.route-step>button').nth(0).tap();page.reload();assert page.locator('.route-step>button').nth(0).get_attribute('aria-pressed')=='true';layout()
 go('letters');assert page.locator('.route-grid a').count()==3
 go('reading');assert page.locator('.app-sidebar a[aria-current=page]').get_attribute('href')=='reading.html'
 data=page.evaluate('ArabicPhonicsData')
 for mode in ['segment','blend','missing','family']:
  page.locator('[data-mode='+mode+']').tap()
  for i,q in enumerate(data[mode]):
   if i==0:
    audio('#phonics-listen')
    if mode=='segment':
     wrong=q['options'][1];page.locator('#phonics-options button').filter(has_text=re.compile('^'+re.escape(wrong)+'$')).tap();assert 'حاول مرة أخرى' in page.locator('#phonics-feedback').inner_text()
    if mode=='blend':
     page.locator('#phonics-input').fill('wrong');page.locator('#phonics-check').tap();assert 'حاول مرة أخرى' in page.locator('#phonics-feedback').inner_text()
   if mode=='blend':
    page.locator('#phonics-input').fill(re.sub('[\u064b-\u0652]','',q['word']));page.locator('#phonics-check').tap()
   else:page.locator('#phonics-options button').filter(has_text=re.compile('^'+re.escape(q['options'][q['correct']])+'$')).tap()
   assert 'إجابة صحيحة' in page.locator('#phonics-feedback').inner_text(),(mode,i)
   if i<23:page.locator('#phonics-next').tap()
  assert '24 / 24' in page.locator('#phonics-score').inner_text();page.reload();assert '24 / 24' in page.locator('#phonics-score').inner_text()
 print('PASS all 96 reading tasks, incorrect answers, typing, local audio and reload',flush=True)
 page.locator('[data-mode=blend]').tap();page.locator('#phonics-reset').tap();page.locator('#phonics-input').fill('مَدْرَسَت');page.locator('#phonics-check').tap();assert 'حاول مرة أخرى' in page.locator('#phonics-feedback').inner_text();page.locator('#phonics-help').tap();assert 'بمساعدة' in page.locator('#phonics-feedback').inner_text();page.locator('#phonics-options button').filter(has_text='مَدْرَسَة').tap();assert '0 صحيحة أول مرة' in page.locator('#phonics-score').inner_text();layout()
 go('sentences');qs=page.evaluate('ArabicPracticeData.sentences');assert len(qs)==120
 for level in ['A1','A2']:
  page.locator('#sentence-level').select_option(level)
  for kind in ['statement','question','command']:
   page.locator('#sentence-kind').select_option(kind);bank=[q for q in qs if q['level']==level and q['kind']==kind]
   for i,q in enumerate(bank):
    for word in q['words']:page.locator('#sentence-bank button:enabled').filter(has_text=re.compile('^'+re.escape(word)+'$')).first.tap()
    page.locator('#sentence-check').tap();assert 'الجملة صحيحة' in page.locator('#sentence-feedback').inner_text(),q['id']
    if i==0:audio('#sentence-listen')
    if i<len(bank)-1:page.locator('#sentence-next').tap()
   assert page.locator('#sentence-summary').is_visible()
 page.reload();assert page.locator('#sentence-summary').is_visible();layout()
 print('PASS all 120 sentence solutions, all level/type combinations and local audio',flush=True)
 go('books');assert page.locator('.route-grid h2').all_text_contents()==['كتاب 1','كتاب 2','كتاب 3','كتاب 4']
 for name in ['book-level-two','youth-book-two-part-one','youth-training-two','arabic-youth']:
  go(name);assert page.locator('.app-sidebar a[aria-current=page]').get_attribute('href')=='books.html'
 go('vocabulary');assert page.locator('.cefr-level-card').count()==4;assert page.locator('.cefr-level-card:visible').count()==2
 page.locator('.cefr-level-card[data-level-id=A2]').tap();assert page.locator('.ready-list-button').count()==30
 page.locator('.ready-list-button').first.tap();page.wait_for_url('**/lernseite.html');assert page.locator('.app-sidebar a[aria-current=page]').get_attribute('href')=='vocabulary.html'
 page.locator('#flashcard').tap();assert 'flipped' in page.locator('#flashcard').get_attribute('class');page.locator('#next-button').tap()
 go('grammar');assert page.locator('.app-sidebar a[aria-current=page]').get_attribute('href')=='grammar.html'
 go('index');assert page.locator('#route-resume').get_attribute('href')=='grammar.html';assert page.locator('.route-step>button').nth(0).get_attribute('aria-pressed')=='true'
 go('index#ready-lists-panel') if False else None
 page.goto(base+'/index.html#ready-lists-panel');page.wait_for_url('**/vocabulary.html#ready-lists-panel')
 # Sidebar is the same seven destinations on mobile and closes on Escape.
 page.locator('.menu-toggle').tap();assert page.locator('.menu-toggle').get_attribute('aria-expanded')=='true';page.keyboard.press('Escape');assert page.locator('.menu-toggle').get_attribute('aria-expanded')=='false'
 assert not errors,errors;assert not failed,failed
 # Excel library remains optional; it is the only external request allowed in vocabulary.
 assert all('xlsx' in url for url in external),external
 print('PASS seven-stage path, books, old vocabulary controls, saved progress and responsive Arabic/German layouts',flush=True)
 b.close()
