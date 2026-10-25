"""Interactive mobile checks: every unit/task, actual local playback, drafts and layout."""
import argparse,json,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8060');parser.add_argument('--inline',action='store_true');parser.add_argument('--unit',action='append');args=parser.parse_args();base=args.base_url.rstrip('/')
data=json.loads((Path(__file__).resolve().parents[1]/'data/skills/units.json').read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':900},is_mobile=True,has_touch=True);errors=[];failed=[];external=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
 def route(r):
  if not r.request.url.startswith(base+'/'):external.append(r.request.url);r.abort()
  elif args.inline and r.request.resource_type in ['script','stylesheet']:r.abort()
  else:r.continue_()
 page.route('**/*',route)
 page.add_init_script("""localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');window.__plays=0;const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.addEventListener('playing',()=>window.__plays++,{once:true});return play.call(this);};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],cancel:()=>{},speak:()=>{throw Error('Native TTS should not be needed')}}});""")
 def go(hash):
  page.goto(base+'/skills.html#'+hash);page.wait_for_selector('#skills-content article')
 def module(unit,name):
  page.locator('.skills-module-nav a[href="#'+unit+'/'+name+'"]').tap()
  expect(page.locator('.skills-module-nav a[aria-current=page]')).to_have_attribute('href','#'+unit+'/'+name)
 def answer(q,key,wrong=False):
  box=page.locator('[data-question="'+key+'"]');choice=q['options'][(q['correct']+1)%3] if wrong else q['options'][q['correct']]
  box.get_by_role('button',name=choice,exact=True).tap()
  expect(box.locator('button.skills-choice:disabled')).to_have_count(3)
  assert box.locator('.skills-choice.is-correct').inner_text()==q['options'][q['correct']]
  assert q['explanation'] in box.locator('.skills-feedback').inner_text()
 def audio(label):
  before=page.evaluate('__plays');page.get_by_role('button',name=label,exact=True).tap();page.wait_for_function('n=>__plays>n',arg=before)
  assert '/audio/skills/' in page.locator('#skills-audio').get_attribute('src') or page.locator('#skills-audio').get_attribute('src').startswith('audio/skills/')
  page.evaluate('document.getElementById("skills-audio").pause()')
 count=0
 for u in [u for u in data['units'] if not args.unit or u['id'] in args.unit]:
  go(u['id']+'/vocabulary');assert page.locator('.skills-dialogue').count()==len(u['dialogue'])+len(u['secondDialogue']);assert page.locator('#skills-content details').count()==5
  audio('◖ استمع: الحوار');audio('◖ استمع: الحوار الثاني')
  module(u['id'],'reading');audio('◖ استمع: نص القراءة');answer(u['readingQuestions'][0],'reading-0');count+=1
  module(u['id'],'listening');audio('◖ استمع: تسجيل فهم المسموع')
  for i,q in enumerate(u['listening']['questions']):
   if u['id']=='a1-01' and i==0:
    answer(q,'listening-0',True);page.locator('[data-question="listening-0"]').get_by_role('button',name='أعد المحاولة',exact=True).tap()
   answer(q,'listening-'+str(i));count+=1
  order=page.locator('[data-question=order]')
  for item in u['listening']['order']:order.get_by_role('button',name=item,exact=True).tap()
  order.get_by_role('button',name='تحقق من الترتيب',exact=True).tap();assert u['listening']['order'][0] in page.locator('[data-question=order] .skills-feedback').inner_text();count+=1
  module(u['id'],'conversation')
  for i,q in enumerate(u['conversation']['gaps']):answer(q,'conversation-'+str(i));count+=1
  for i in range(2):page.locator('[data-draft="speaking-'+str(i)+'"]').fill('إِجَابَتِي الْخَاصَّةُ عَنِ الْمَوْقِفِ '+str(i))
  page.locator('#skills-content input[type=checkbox]').check()
  module(u['id'],'writing');draft='هَذَا نَصِّي الْخَاصُّ لِوَحْدَةِ '+u['id'];page.locator('[data-draft=writing]').fill(draft)
  for r in data['rubric']:page.locator('[data-rubric='+r['id']+']').select_option('1')
  page.get_by_role('button',name='احفظ إجابتي',exact=True).tap();page.reload();expect(page.locator('[data-draft=writing]')).to_have_value(draft);assert page.locator('[data-rubric=meaning]').input_value()=='1'
  if u['writing']['image']:assert page.locator('.skills-picture').evaluate('e=>e.complete&&e.naturalWidth>0')
  module(u['id'],'collocations')
  for i,c in enumerate(u['collocations']):answer(c['question'],'collocations-'+str(i));count+=1
  module(u['id'],'review')
  for i,q in enumerate(u['review']):answer(q,'review-'+str(i));count+=1
  saved=page.evaluate('id=>VocabApp.getStats().skillsV1[id]',u['id']);assert len(saved['answers'])==17 and all(a['correct'] for a in saved['answers'].values());assert saved['heard'];assert saved['drafts']['writing']==draft
  page.get_by_role('button',name='أنجزت الوحدة وراجعت مهامي',exact=True).tap()
  print('PASS',u['id'],'17 tasks, 4 actual local recordings, open drafts/rubric',flush=True)
 assert count==17*(len(args.unit) if args.unit else 12)
 # Reopen saved work without clearing previous vocabulary/grammar/letter records.
 page.evaluate('VocabApp.setJSON("learningStats",{...VocabApp.getStats(),retainedSentinel:{value:42}})')
 go('a1-01/writing');page.locator('[data-draft=writing]').fill('تَعْدِيلٌ يُحْفَظُ عِنْدَ الرُّجُوعِ');module('a1-01','reading');assert page.evaluate('VocabApp.getStats().retainedSentinel.value')==42
 module('a1-01','writing');expect(page.locator('[data-draft=writing]')).to_have_value('تَعْدِيلٌ يُحْفَظُ عِنْدَ الرُّجُوعِ')
 for lang in ['ar','de']:
  page.locator('#app-language-select').select_option(lang)
  for part in ['vocabulary','listening','conversation','writing','collocations','review']:
   module('a1-01',part)
   for width in [320,390,768,1440]:
    page.set_viewport_size({'width':width,'height':1000});page.wait_for_timeout(160)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(lang,part,width)
    assert page.locator('.skills-module-nav a').evaluate_all('nodes=>nodes.every(e=>e.getBoundingClientRect().height>=44)')
 page.set_viewport_size({'width':390,'height':900});page.locator('#app-language-select').select_option('ar')
 module('a1-01','listening');page.locator('[data-question="listening-0"]').scroll_into_view_if_needed();page.screenshot(path='/tmp/olive-skills-mobile-listening.png')
 page.goto(base+'/grammar.html');page.locator('#verbs-entry-title').scroll_into_view_if_needed();assert page.locator('a[href="verbs.html"]').first.is_visible()
 page.goto(base+'/verbs.html');page.locator('#verb-family').select_option('defective');assert page.locator('#verb-select option').count()==2
 page.locator('#verb-select').select_option('walk');page.locator('#verb-negative-mode').select_option('past-lam');assert 'لَمْ يَمْشِ' in page.locator('#verb-negative-body').inner_text()
 for mode in ['past','present','past-lam','future','prohibition']:
  page.locator('#verb-negative-mode').select_option(mode);assert page.locator('#verb-negative-body tr').count()==(5 if mode=='prohibition' else 14)
 page.locator('#verb-family').select_option('doubled');page.locator('#verb-select').select_option('extend');assert 'لَا تَمُدَّ' in page.locator('#verb-negative-body').inner_text()
 page.locator('#verb-negative-answers button').first.tap();assert page.locator('#verb-negative-answers button:disabled').count()==4
 page.goto(base+'/index.html');assert page.locator('#overall-learning-path li').count()==8;assert page.locator('.app-sidebar a[href="skills.html"]').count()==1
 assert not errors,errors;assert not failed,failed
 # Only app scripts/CSS/media are local: no external runtime service was needed.
 assert not external,external
 print(f'PASS {count} tasks; {4*(len(args.unit) if args.unit else 12)} actual MP3 starts; responsive AR/DE; saved open work; verb classification and negation; inline='+str(args.inline),flush=True)
 b.close()
