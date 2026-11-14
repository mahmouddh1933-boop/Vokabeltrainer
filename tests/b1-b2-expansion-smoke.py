"""Exercise all 40 advanced units offline, saved drafts, quizzes, audio and navigation."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8090');args=p.parse_args();base=args.base_url.rstrip('/')+'/b1-b2/'
root=Path(__file__).resolve().parents[1];units=json.loads((root/'data/b1-b2-units.json').read_text())['units']
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
 c=b.new_context(viewport={'width':390,'height':844},service_workers='block');c.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar')")
 c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort());page=c.new_page();errors=[];missing=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status==404 else None)
 page.goto(base+'texts.html');page.wait_for_selector('.advanced-unit-card');assert page.locator('.advanced-unit-card').count()==20
 assert page.locator('.app-sidebar nav a[href="test.html"]').count()==0
 assert page.locator('.app-sidebar nav a[href="texts.html"]').count()==1
 def go(u,section):
  page.evaluate('(hash)=>location.hash=hash',u['id']+'/'+section);page.wait_for_function('(s)=>Array.from(document.querySelectorAll("[data-module]")).some(n=>n.dataset.module===s&&n.getAttribute("aria-current")==="page")',arg=section)
 for u in units:
  for section in ['reading','vocabulary','grammar','listening','speaking','writing']:
   go(u,section)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(u['id'],section)
   if section in ['reading','vocabulary','grammar','listening']:
    bank={'reading':u['readingQuiz'],'vocabulary':u['vocabularyQuiz'],'grammar':u['grammar']['quiz'],'listening':u['listening']['quiz']}[section]
    # A wrong answer must fail before a correction succeeds.
    page.locator('.advanced-quiz').evaluate('(form,answers)=>answers.forEach((a,i)=>form.querySelectorAll("fieldset")[i].querySelectorAll("input")[a].click())',[(q['a']+1)%len(q['opts']) for q in bank])
    page.locator('.advanced-quiz button[type=submit]').click();assert page.locator('.advanced-feedback strong').inner_text()==f'0 / {len(bank)}'
    page.locator('.advanced-quiz').evaluate('(form,answers)=>answers.forEach((a,i)=>form.querySelectorAll("fieldset")[i].querySelectorAll("input")[a].click())',[q['a'] for q in bank])
    page.locator('.advanced-quiz button[type=submit]').click();assert page.locator('.advanced-feedback strong').inner_text()==f'{len(bank)} / {len(bank)}'
    if section=='listening':
     page.locator('#advanced-audio').evaluate('(a)=>a.play()');page.wait_for_function('document.querySelector("#advanced-audio").currentTime>.05');assert page.locator('#advanced-audio').evaluate('(a)=>a.duration')>5
   else:
    key='essay' if section=='writing' else 'speakingNotes';page.locator('#advanced-'+key).fill(u['id']+' مسودة خاصة بهذه الوحدة.');page.locator('.advanced-self-check input').check()
  assert '6 / 6' in page.locator('#advanced-progress').inner_text()
  print('PASS six sections, correction, local audio and drafts:',u['id'],flush=True)
 # Reload and switch levels: drafts and completed quizzes must remain independent.
 page.reload();page.wait_for_selector('#advanced-essay');assert page.locator('#advanced-essay').input_value().startswith(units[-1]['id'])
 go(units[0],'writing');assert page.locator('#advanced-essay').input_value().startswith(units[0]['id'])
 go(units[0],'reading');assert page.locator('.advanced-feedback strong').inner_text()=='3 / 3'
 for language in ['de','ar']:
  page.locator('#app-language-select').select_option(language)
  for width in [320,768,1440]:
   page.set_viewport_size({'width':width,'height':960});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.goto(base+'grammar.html#passive-voice');page.wait_for_function('document.querySelector("#grammar-lesson-select").value==="passive-voice"');assert 'للمجهول' in page.locator('#grammar-lesson-select option:checked').inner_text()
 page.goto(base+'verbs.html');page.wait_for_selector('#verb-select option',state='attached');assert page.locator('#verb-select option').count()==251
 assert not errors,errors;assert not missing,missing
 print('PASS 40 units, 240 sections, persisted isolation, AR/DE, mobile, passive lesson, 251 verbs; no missing assets or JS errors')
 b.close()
