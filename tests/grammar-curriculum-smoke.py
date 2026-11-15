"""Exercise the complete level path, highlights, grading and retained progress."""
import argparse
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8096');base=p.parse_args().base_url.rstrip('/')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block',reduced_motion='reduce')
 c.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar')")
 c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort());page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 total=0
 for app,levels in [('a1-a2',['A1','A2','spelling-a']),('b1-b2',['B1','B2','spelling-b'])]:
  page.goto(f'{base}/{app}/grammar.html');page.wait_for_selector('#grammar-lesson-select option',state='attached');lessons=page.evaluate('ArabicGrammarData.lessons')
  assert page.locator('#grammar-stages [data-grammar-stage]').evaluate_all('(ns)=>ns.map(n=>n.dataset.grammarStage)')==levels
  for stage in levels:
   page.locator('[data-grammar-stage="'+stage+'"]').click();expected=[l['id'] for l in lessons if l['stage']==stage]
   assert page.locator('#grammar-lesson-select option').evaluate_all('(ns)=>ns.map(n=>n.value)')==expected
  if app=='a1-a2':
   page.evaluate("VocabApp.setJSON('learningStats',{...VocabApp.getStats(),grammarPathV1:{lastLesson:'pronouns',lessons:{pronouns:{index:2,answers:[0,1]},gender:{index:1,answers:[0]}}}})")
   page.goto(f'{base}/{app}/grammar.html#pronouns');page.wait_for_function('document.querySelector("#grammar-lesson-select").value==="pronouns"')
   assert page.locator('#grammar-progress').get_attribute('value')=='0'
   assert page.evaluate('VocabApp.getStats().grammarPathV1.lessons.pronouns.previousVersions["0"].answers')==[0,1]
   page.goto(f'{base}/{app}/grammar.html#gender');page.wait_for_function('document.querySelector("#grammar-lesson-select").value==="gender"')
   assert page.locator('#grammar-progress').get_attribute('value')=='1'
   # Start a fresh record for the complete answer run, leaving legacy storage semantics separately checked.
   page.evaluate("VocabApp.setJSON('learningStats',{...VocabApp.getStats(),grammarPathV1:{}})")
   page.reload();page.wait_for_selector('#grammar-lesson-select option',state='attached')
  for lesson in lessons:
   page.evaluate('(id)=>location.hash=id',lesson['id']);page.wait_for_function('(id)=>document.querySelector("#grammar-lesson-select").value===id',arg=lesson['id'])
   texts=page.locator('.grammar-example>p[lang=ar]').all_text_contents();expected=[e['ar'] for s in lesson['sections'] for e in s.get('examples',[])]
   assert texts==expected,(app,lesson['id'])
   for section in lesson['sections']:
    for e in section.get('examples',[]):
     for a in e.get('annotations',[]):assert e['ar'][a['start']:a['end']]
   # Run real click handlers and assert grading after every answer.
   answered=page.evaluate('''(lesson)=>{for(let i=0;i<lesson.questions.length;i++){
    const q=lesson.questions[i];const options=document.querySelectorAll('#grammar-answers button');
    if(options[q.correct].disabled)throw new Error('Unexpected saved answer '+lesson.id);
    options[q.correct].click();if(!document.querySelector('#grammar-feedback.is-correct'))throw new Error('Wrong grade '+lesson.id+' '+i);
    if(i<lesson.questions.length-1)document.querySelector('#grammar-next').click();
   }return document.querySelector('#grammar-progress').value;}''',lesson)
   assert int(answered)==len(lesson['questions']);total+=len(lesson['questions'])
   for lang,width in [('ar',320),('de',390),('ar',1440)]:
    page.set_viewport_size({'width':width,'height':1000});page.locator('#app-language-select').select_option(lang)
    page.evaluate('document.fonts.ready');page.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(app,lesson['id'],lang,width)
   print('LESSON OK',app,lesson['id'],len(lesson['questions']),flush=True)
  page.reload();page.wait_for_selector('#grammar-stages progress');assert all(int(n.get_attribute('value'))==int(n.get_attribute('max')) for n in page.locator('#grammar-stages progress').all())
  if app=='a1-a2':
   page.goto(f'{base}/{app}/skills.html#a1-02/reading');page.wait_for_selector('.skills-module-nav')
   page.locator('.skills-block a[href="verbs.html"]').click();page.wait_for_url('**/verbs.html');page.wait_for_selector('#verb-select option',state='attached')
   assert page.locator('#verb-select option').count()==300
  for old,new in [('sun-moon','definiteness')] if app=='a1-a2' else []:
   page.goto(f'{base}/{app}/grammar.html#{old}');page.wait_for_function('(id)=>document.querySelector("#grammar-lesson-select").value===id',arg=new)
  page.goto(f'{base}/{app}/grammar.html#basic-verbs',wait_until='commit');page.wait_for_url('**/verbs.html');
  page.goto(f'{base}/{app}/verbs.html');page.wait_for_selector('#verb-select option',state='attached');assert page.locator('#verb-select option').count()==300
 assert not errors,errors;b.close()
 print('PASS',total,'answers; level order, all example text/highlights, retained unchanged results, revised-content reset, saved mastery, legacy bookmarks, AR/DE mobile layouts and separate 300-verb section')
