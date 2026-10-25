"""All ten diagnostic forms: answer privacy, real audio, exclusions, routing and saved results."""
import argparse,re
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8024');parser.add_argument('--inline',action='store_true');args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':900},is_mobile=True,has_touch=True);errors=[];failed=[];external=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
 def request(r):
  if not r.request.url.startswith(base+'/'):external.append(r.request.url);r.abort()
  elif args.inline and r.request.resource_type in ['script','stylesheet']:r.abort()
  else:r.continue_()
 page.route('**/*',request)
 page.add_init_script("""localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');window.__plays=0;window.__src='';const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__src=this.src;this.addEventListener('playing',()=>__plays++,{once:true});return play.call(this)};""")
 def go(name):page.goto(base+'/'+name+'.html');page.wait_for_timeout(120)
 def lang(v):page.locator('#app-language-select').select_option(v)
 def layout():
  for language in ['ar','de']:
   lang(language)
   for width in [320,390,768,1440]:
    page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(180);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(page.url,language,width)
  page.set_viewport_size({'width':390,'height':900});lang('ar');page.wait_for_timeout(300)
 go('placement');assert page.locator('.placement-test-card').count()==5;assert page.locator('.app-sidebar nav a').count()==10;layout()
 page.evaluate("VocabApp.setJSON('learningStats',{totalTests:4,learningRouteV1:{completed:{letters:true},lastStage:'vocabulary'},phonicsV1:{mode:'blend',answers:{prior:{solved:true}}}})")
 tests=page.evaluate('ArabicPlacementData.tests');bank={q['id']:q for q in page.evaluate('ArabicPlacementData.questions')}
 for test in tests:
  for form in ['A','B']:
   page.locator(f'[data-start-test={test["id"]}][data-form={form}]').click();assert page.locator('#placement-submit').is_disabled();assert page.locator('#placement-catalog').is_hidden();ids=test['forms'][form];attempt_id=page.evaluate('new URLSearchParams(location.hash.slice(1)).get("attempt")');heard=set()
   for index,id in enumerate(ids):
    q=bank[id];technical=test['id']=='comprehension' and form=='A' and q['domain']=='listening'
    if q['domain']=='listening' and not technical:
     if q['passage'] not in heard:
      assert page.locator('#placement-options button:disabled').count()==4
      assert page.locator('#placement-unknown').is_disabled()
      assert page.locator('#placement-stimulus').is_hidden()
      before=page.evaluate('__plays');page.locator('#placement-listen').click();page.wait_for_function('n=>__plays>n',arg=before);assert '/audio/placement/' in page.evaluate('__src')
      page.wait_for_function('Number.isFinite(document.querySelector("audio").duration)&&document.querySelector("audio").duration>0')
      # Let the complete local recording end naturally, as on a learner's phone.
      expect(page.locator('#placement-options button').first).to_be_enabled(timeout=45000);heard.add(q['passage'])
    if technical:page.locator('#placement-unavailable').click()
    elif test['id']=='quick' and form=='A' and q['domain']=='letters':page.locator('#placement-unknown').click()
    elif test['id']=='structures' and form=='A' and q['domain']=='spelling' and q['lesson'] in ['hamza-medial','hamza-final','hamza-exceptions']:page.locator('#placement-options button').nth((q['correct']+1)%4).click()
    else:
     if test['id']=='foundations' and form=='B' and index==0:
      page.locator('#placement-options button').nth((q['correct']+1)%4).click()
     page.locator('#placement-options button').nth(q['correct']).click()
    assert not page.locator('.is-correct,.is-wrong').count();assert page.locator('#placement-review').is_hidden()
    if test['id']=='quick' and form=='A' and index==2:
     page.reload();assert 'السؤال 3 من 16' in page.locator('#placement-position').inner_text();assert page.locator('#placement-options [aria-pressed=true]').count()==1
     lang('de');assert page.locator('#placement-options [aria-pressed=true]').count()==1;lang('ar')
     page.locator('#placement-close').click();assert page.locator('#placement-catalog').is_visible();page.locator(f'[data-attempt="{attempt_id}"]').click();assert 'السؤال 3 من 16' in page.locator('#placement-position').inner_text()
    if index<15:page.locator('#placement-next').click()
   expect(page.locator('#placement-submit')).to_be_enabled();page.locator('#placement-submit').click();assert page.locator('#placement-results').is_visible();assert page.locator('#placement-question').is_hidden()
   result=page.evaluate('''id=>VocabApp.getStats().placementV1.attempts[id].result''',attempt_id)
   assert page.evaluate('VocabApp.getStats().totalTests')==4;assert page.evaluate('VocabApp.getStats().learningRouteV1.completed.letters')
   assert page.evaluate('VocabApp.getStats().phonicsV1.answers.prior.solved')
   if test['id']=='quick' and form=='A':assert result['primary']['stage']=='letters' and result['correct']==14
   if test['id']=='comprehension' and form=='A':
    assert result['valid']==8 and result['correct']==8 and result['unavailable']==8
    assert result['domains']['listening']['status']=='insufficient';assert page.locator('[data-domain=listening]').get_attribute('data-status')=='insufficient'
   if test['id']=='structures' and form=='A':
    assert result['primary']['href']=='grammar.html#hamza-medial';assert page.evaluate('VocabApp.getStats().learningRouteV1.lastStage')=='vocabulary'
    page.locator('#placement-apply').click();assert page.evaluate('VocabApp.getStats().learningRouteV1.lastStage')=='grammar'
   if form=='B':assert result['correct']==16
   page.reload();assert page.locator('#placement-results').is_visible();page.locator('#placement-review-toggle').click();assert page.locator('.placement-review-item').count()==16
   if test['id']=='structures' and form=='A':
    layout();page.emulate_media(media='print');assert page.locator('#placement-results').is_visible();assert page.locator('.app-sidebar').is_hidden();page.emulate_media(media='screen')
   page.locator('#placement-close').click();print('PASS',test['id'],form,flush=True)
 assert page.locator('#placement-history button').count()==10
 go('index');assert page.locator('#placement-entry').is_visible();assert page.locator('#placement-home-report').is_visible();assert page.locator('#overall-learning-path li').count()==7
 page.locator('#placement-home-report').click();expect(page.locator('#placement-results')).to_be_visible()
 # Recommendation deep links select the appropriate existing training, preserving earlier answers.
 page.goto(base+'/reading.html?mode=family');assert page.locator('[data-mode=family]').get_attribute('aria-pressed')=='true'
 page.locator('[data-mode=segment]').click();page.reload();expect(page.locator('[data-mode=segment]')).to_have_attribute('aria-pressed','true')
 page.goto(base+'/sentences.html?level=A1&kind=question');assert page.locator('#sentence-level').input_value()=='A1';assert page.locator('#sentence-kind').input_value()=='question'
 page.locator('#sentence-kind').select_option('statement');page.reload();expect(page.locator('#sentence-kind')).to_have_value('statement')
 page.goto(base+'/stories.html?level=A2');assert page.locator('#story-level').input_value()=='A2'
 page.locator('#story-level').select_option('A1');page.reload();expect(page.locator('#story-level')).to_have_value('A1')
 page.goto(base+'/vocabulary.html?level=A2&list=a2_10');assert page.locator('[data-level-id=A2]').get_attribute('aria-pressed')=='true';expect(page.locator('.placement-target-list')).to_have_attribute('data-list-id','a2_10')
 page.locator('[data-level-id=A1]').click();page.reload();expect(page.locator('[data-level-id=A1]')).to_have_attribute('aria-pressed','true')
 # Only the existing optional Excel dependency is permitted outside this origin.
 assert all('xlsx' in url for url in external),external
 assert not failed,failed;assert not errors,errors
 print('PASS all ten placement forms, real local audio, no early corrections, editable drafts, technical exclusions, scoped diagnostics, persistence, explicit routing, print and AR/DE 320–1440px',flush=True)
 b.close()
