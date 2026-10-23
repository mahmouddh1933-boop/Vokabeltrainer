"""Reproduce the reported home and placement overlaps with saved diagnostic results."""
import argparse
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8026');args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page();errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');")
 page.goto(base+'/placement.html')
 id=page.evaluate('''()=>{let a=Placement.createAttempt('quick','A');for(const q of Placement.questions(a))a.answers[q.id]=q.correct;a=Placement.finish(a);VocabApp.setJSON('learningStats',{learningRouteV1:{lastStage:'vocabulary'},placementV1:{attempts:{[a.id]:a}}});return a.id;}''')
 def geometry(selector,against=None):
  boxes=page.locator(selector).evaluate_all('els=>els.filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim(),r:e.getBoundingClientRect().toJSON()}))')
  if against:other=page.locator(against).evaluate_all('els=>els.filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim(),r:e.getBoundingClientRect().toJSON()}))')
  else:other=boxes
  for i,a in enumerate(boxes):
   for j,c in enumerate(other):
    if not against and j<=i:continue
    x=min(a['r']['right'],c['r']['right'])-max(a['r']['left'],c['r']['left']);y=min(a['r']['bottom'],c['r']['bottom'])-max(a['r']['top'],c['r']['top'])
    assert x<=1 or y<=1,(page.url,a['text'],c['text'],x,y)
 for name in ['index','placement','exams']:
  for language in ['ar','de']:
   page.goto(base+'/'+name+'.html'+('#attempt='+id if name=='placement' else ''));page.locator('#app-language-select').select_option(language)
   if name=='placement':expect(page.locator('#placement-results')).to_be_visible()
   for width,height in [(320,740),(390,844),(768,900),(1133,781),(1440,900)]:
    page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(120)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    geometry('main a.practice-button, main button.practice-button')
    geometry('main a.practice-button, main button.practice-button','main h2,main h3,main p:not(:has(.practice-button))')
    links=page.locator('.app-sidebar nav a');assert links.count()==9
    if width>960:
     assert page.locator('.app-sidebar').bounding_box()['x']>page.locator('main').bounding_box()['x'] if language=='ar' else True
     geometry('.app-sidebar nav a');links.last.scroll_into_view_if_needed();expect(links.last).to_be_in_viewport()
    else:
     page.locator('.menu-toggle').click();links.last.scroll_into_view_if_needed();expect(links.last).to_be_visible();page.keyboard.press('Escape')
   if language=='ar' and name in ['index','placement']:
    page.set_viewport_size({'width':1133,'height':900});page.screenshot(path='/tmp/olive-exam-review/fixed-'+name+'.png',full_page=True)
   active=page.locator('.app-sidebar nav a[aria-current=page]')
   if name in ['placement','exams']:assert active.get_attribute('href')==name+'.html'
 # Deep link from the old PDF-view route now starts an actual transcribed exam.
 page.goto(base+'/exams.html#original=original-01');expect(page.locator('[data-question^=paper-01]')).to_have_count(21);assert page.locator('#lesson-loading').count()==0
 assert not errors,errors;b.close()
 print('Home and placement: no button/button, button/text or sidebar overlaps in AR/DE at 320–1440 px; nine accessible navigation links and original-exam deep links passed.')
