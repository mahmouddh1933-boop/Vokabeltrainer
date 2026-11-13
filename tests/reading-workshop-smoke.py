"""Exercise all 64 tasks, real colouring/drawing, progress and mobile layout."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8090');args=p.parse_args();base=args.base_url.rstrip('/')
D=json.loads((ROOT/'data/reading-exercises.json').read_text())
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1280,'height':900},service_workers='block')
 ctx.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');")
 ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort())
 page=ctx.new_page();errors=[];missing=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:missing.append(r.url) if r.status==404 else None)
 url=base+'/start/reading-exercises.html';page.goto(url);page.wait_for_selector('.rx-card');assert page.locator('.rx-card').count()==8
 def open_task(a):
  page.goto(url+'#'+a['chapter']+'/'+a['id']);page.wait_for_selector('[data-activity="'+a['id']+'"]')
 first=D['activities'][0];open_task(first);page.get_by_role('button',name='تحقّق من إجاباتي',exact=True).click();assert 'أكمل الإجابات' in page.locator('#rx-feedback').inner_text()
 for i,q in enumerate(first['questions']):page.locator('[data-question="'+str(i)+'"] input[value="'+str((q['answer']+1)%len(q['options']))+'"]').check()
 page.get_by_role('button',name='تحقّق من إجاباتي',exact=True).click();assert '٠' in page.locator('#rx-feedback').inner_text() or '0 من' in page.locator('#rx-feedback').inner_text()
 for a in D['activities']:
  open_task(a)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),a['id']
  if a['type']=='color':
   page.wait_for_selector('#rx-color-art svg')
   for part in a['parts']:
    page.locator('[data-color="'+part['answer']+'"]').click()
    node=page.locator('#rx-color-art [data-part="'+part['id']+'"]');node.focus();node.press('Enter')
    assert node.get_attribute('fill')==next(c['hex'] for c in D['colors'] if c['id']==part['answer'])
  if a['type']=='story':
   assert page.locator('.rx-story-card').evaluate_all('(cards)=>cards.every(card=>{const r=card.getBoundingClientRect();return [...card.children].every(n=>{const c=n.getBoundingClientRect();return c.left>=r.left&&c.right<=r.right+1&&c.top>=r.top&&c.bottom<=r.bottom+1})})'),a['id']
   for i in [0,1,2]:page.locator('[data-frame="'+str(i)+'"]').click()
  for i,q in enumerate(a.get('questions',[])):page.locator('[data-question="'+str(i)+'"] input[value="'+str(q['answer'])+'"]').check()
  if a['type']=='draw':
   if a['id']=='draw-1':
    canvas=page.locator('.rx-canvas');canvas.scroll_into_view_if_needed();box=canvas.bounding_box();page.mouse.move(box['x']+50,box['y']+50);page.mouse.down();page.mouse.move(box['x']+120,box['y']+100,steps=8);page.mouse.up()
    page.locator('.rx-writing textarea').fill('هَذَا بَيْتٌ جَمِيلٌ.')
   for checkbox in page.locator('.rx-review input').all():checkbox.check()
   page.get_by_role('button',name='راجعت عملي وأنهيت النشاط',exact=True).click()
  else:page.get_by_role('button',name='تحقّق من إجاباتي',exact=True).click()
  state=page.evaluate('VocabApp.getStats().readingExercisesV1')[a['id']]
  if a['type']=='draw':assert state['reviewed']
  else:assert not page.locator('.rx-wrong').count(),a['id']
  print('ACTIVITY OK',a['id'],flush=True)
 page.reload();page.wait_for_selector('.rx-activity');assert '64 من 64' in page.locator('#rx-total-progress').inner_text()
 open_task(next(a for a in D['activities'] if a['id']=='draw-1'));assert page.locator('.rx-writing textarea').input_value()=='هَذَا بَيْتٌ جَمِيلٌ.'
 assert page.evaluate('JSON.parse(JisrStorage.local.getItem("readingExercisesDrawingV1:draw-1")).strokes.length')==1
 # The print edition contains every activity, not screenshots of the answers.
 page.goto(url);page.wait_for_selector('.rx-card');page.evaluate('window.print=()=>{window.printCalled=true}')
 page.locator('#rx-print').click();assert page.evaluate('window.printCalled');assert page.locator('.rx-print-activity').count()==64
 for language in ['ar','de']:
  page.locator('#app-language-select').select_option(language)
  for width in [320,390,768,1280]:
   page.set_viewport_size({'width':width,'height':844})
   for a in [D['activities'][0],next(x for x in D['activities'] if x['id']=='colors-3'),next(x for x in D['activities'] if x['id']=='stories-1'),next(x for x in D['activities'] if x['id']=='draw-1')]:
    open_task(a);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,width,a['id'])
 page.set_viewport_size({'width':390,'height':844});open_task(next(x for x in D['activities'] if x['id']=='colors-2'));page.screenshot(path='/tmp/huroof-reading-flag-mobile.png',full_page=True)
 assert not errors,errors;assert not missing,missing
 b.close();print('PASS 64 activities, wrong-answer feedback, colouring by keyboard, story order, drawing, reload, print, both languages and mobile widths.')
