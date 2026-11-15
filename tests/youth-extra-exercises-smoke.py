"""All 360 new questions, independent scopes, navigation, original answers and print."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8101/books');args=p.parse_args();base=args.base_url.rstrip('/');site=base.rsplit('/',1)[0]+'/'
bank=json.loads((Path(__file__).resolve().parents[1]/'data/youth-two/extra-exercises.json').read_text())['activities']
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);context=browser.new_context(viewport={'width':1280,'height':1000},service_workers='block',reduced_motion='reduce');context.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');window.print=()=>window.__extraPrinted=true")
 context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(site) else r.abort());page=context.new_page();errors=[];missing=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
 count=0
 for id,exercises in bank.items():
  page.goto(base+'/youth-training-two.html#'+id);page.wait_for_selector('#yt-extra-picker');assert page.locator('.yt-exercise-card').count()==5
  # Seed a valid original answer and a separate sentinel, before answering the extra sets.
  page.evaluate('''id=>{const data=ArabicYouthTwoData.activities.find(a=>a.id===id),q=data.tasks[0],state=Practice.load('youth-two',{});state.answers[id]={[q.id]:{value:q.kind==='mark'?q.targets:q.answer}};state.__extraSentinel='preserved';Practice.save('youth-two',state)}''',id)
  page.reload();page.wait_for_selector('#yt-extra-picker')
  for n,ex in enumerate(exercises):
   page.locator('[data-exercise-choice="'+ex['id']+'"]').click();page.wait_for_function('hash=>location.hash===hash',arg='#'+id+'/'+ex['id']);assert page.locator('#yt-progress').get_attribute('max')=='6';assert page.locator('#yt-progress').get_attribute('value')=='0',(id,ex['id'],'scope leaked')
   assert page.locator('[data-extra-previous]').is_disabled()==(n==0);assert page.locator('[data-extra-next]').is_disabled()==(n==4)
   if page.locator('.smart-activity').count():
    assert page.locator('.smart-summary tbody tr').count()==6
    page.locator('.smart-activity').evaluate('''(root,tasks)=>{for(const q of tasks){root.querySelector(`[data-smart-item="${q.id}"]`).click();[...root.querySelectorAll('button[data-smart-target]')].find(n=>n.dataset.smartTarget===q.answer).click();}root.querySelector('.smart-check').click()}''',ex['tasks'])
    assert page.locator('.smart-summary tr.is-correct').count()==6
   else:
    assert page.locator('#yt-tasks > .yt-task').count()==6
    for q in ex['tasks']:
     card=page.locator('#yt-q-'+q['id'])
     if q['kind']=='input':card.locator('.yt-input').fill(q['answer']);card.locator('.yt-check').click()
     elif q['kind']=='choice':card.locator('.yt-option').evaluate_all('(ns,answer)=>ns.find(n=>n.dataset.value===answer).click()',q['answer'])
     elif q['kind']=='mark':
      for i in q['targets']:card.locator('[data-word-index="'+str(i)+'"]').click()
      card.locator('.yt-check').click()
     else:raise AssertionError(q['kind'])
     assert card.locator('.yt-feedback.is-correct').count()==1,(id,ex['id'],q['id'])
   assert page.locator('#yt-progress').get_attribute('value')=='6';assert page.locator('.yt-exercise-card[aria-pressed=true] small').count()==1
   page.reload();page.wait_for_selector('#yt-extra-picker');assert page.locator('[data-exercise-choice="'+ex['id']+'"]').get_attribute('aria-pressed')=='true';assert page.locator('#yt-progress').get_attribute('value')=='6'
   count+=6
  # Reset only exercise 5. Exercise 1 and the original must retain their answers.
  page.locator('#yt-reset').evaluate('(n)=>n.closest("details").open=true');page.locator('#yt-reset').click();assert page.locator('#yt-progress').get_attribute('value')=='0'
  state=page.evaluate('Practice.load("youth-two",{})');assert state['__extraSentinel']=='preserved';assert len(state['answers'][id])==1;assert len(state['answers'][id+'::exercise-1'])==6;assert state['answers'][id+'::exercise-5']=={}
  page.locator('[data-exercise-choice="exercise-1"]').click();assert page.locator('#yt-progress').get_attribute('value')=='6';page.locator('[data-extra-next]').click();assert page.locator('[data-exercise-choice="exercise-2"]').get_attribute('aria-pressed')=='true'
  page.locator('#yt-print-activity').click();assert page.locator('#yt-print .yt-print-task').count()==6;assert 'التمرين 2' in page.locator('#yt-print').text_content()
  page.locator('#app-language-select').select_option('de');page.set_viewport_size({'width':320,'height':900});page.wait_for_function('getComputedStyle(document.body).paddingInlineStart==="0px"');page.evaluate('document.fonts.ready');page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),id
  page.locator('[data-exercise-choice="original"]').click();assert page.locator('#yt-progress').get_attribute('value')=='1';page.set_viewport_size({'width':1280,'height':1000})
  print('PASS five sets / 30 questions, reload, original preservation, isolated reset, next, print, mobile:',id,flush=True)
 assert count==360;assert not errors,errors;assert not missing,missing
 # A new browser context must be able to open an exercise directly without prior saved selection.
 fresh=browser.new_context(service_workers='block');fp=fresh.new_page();fp.goto(base+'/youth-training-two.html#b-p11-b2/exercise-3');fp.wait_for_selector('#yt-extra-picker');assert fp.locator('[data-exercise-choice="exercise-3"]').get_attribute('aria-pressed')=='true';assert fp.locator('#yt-tasks > .yt-task').count()==6;fresh.close();browser.close()
 print('PASS 12 activities × 5 selectable exercises × 6 questions = 360; all grading and storage scopes verified')
