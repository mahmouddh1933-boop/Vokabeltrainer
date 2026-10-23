"""Readable local Arabic exam typography and accessible back controls with preserved drafts."""
import argparse
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8026');parser.add_argument('--inline',action='store_true');args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[];failed=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
 page.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');")
 def route(r):
  if not r.request.url.startswith(base+'/'):r.abort()
  elif args.inline and r.request.resource_type in ['script','stylesheet']:r.abort()
  else:r.continue_()
 page.route('**/*',route)
 page.goto(base+'/exams.html');page.locator('[data-start-exam=model-01]').click();page.evaluate('document.fonts.ready')
 assert page.evaluate('document.fonts.check(\'600 26px "Olive Exam Arabic"\')')
 first=page.locator('.exam-options input').first;value=first.input_value();first.check();page.locator('input[type=text]').first.fill('هذا مكتبي');page.locator('textarea').first.fill('اسمي نور')
 ident=page.evaluate('new URLSearchParams(location.hash.slice(1)).get("attempt")')
 for language in ['ar','de']:
  page.locator('#app-language-select').select_option(language)
  for width in [320,390,768,1133,1440]:
   page.set_viewport_size({'width':width,'height':844});page.wait_for_timeout(100)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,width)
   for sel in ['.exam-task legend','.exam-options label','.exam-passage','input[type=text]','textarea']:
    info=page.locator(sel).first.evaluate('n=>{const s=getComputedStyle(n);return {size:parseFloat(s.fontSize),font:s.fontFamily,line:parseFloat(s.lineHeight),color:s.color}}')
    assert info['size']>=24,(sel,info);assert 'Olive Exam Arabic' in info['font'],info;assert info['line']>=info['size']*1.8,info
   page.locator('.exam-task').last.scroll_into_view_if_needed();rect=page.locator('#exam-back').bounding_box();assert rect and rect['y']>=0 and rect['y']+rect['height']<844
   if width<=960:assert rect['y']>=page.locator('.app-topbar').bounding_box()['height']
  page.set_viewport_size({'width':390,'height':844})
 page.locator('#app-language-select').select_option('ar');page.locator('#exam-back').click();expect(page.locator('#exam-catalog')).to_be_visible()
 page.locator('#exam-history button').first.click();assert page.locator('input[type=text]').first.input_value()=='هذا مكتبي';assert page.locator('textarea').first.input_value()=='اسمي نور';assert page.locator(f'.exam-options input[value="{value}"]').first.is_checked()
 page.locator('.exam-task').last.scroll_into_view_if_needed();page.locator('#exam-back-bottom').click();expect(page.locator('#exam-catalog')).to_be_visible()
 page.locator('[data-start-exam=model-02]').click();page.evaluate('document.fonts.ready');glyph=page.locator('.exam-letter-options').first;glyph.scroll_into_view_if_needed();assert glyph.locator('label').first.evaluate('n=>parseFloat(getComputedStyle(n).fontSize)')>=30
 rects=glyph.locator('label').evaluate_all('els=>els.map(e=>e.getBoundingClientRect().toJSON())');assert abs(rects[0]['top']-rects[1]['top'])<1
 for width in [390,1133]:
  page.set_viewport_size({'width':width,'height':900});glyph.scroll_into_view_if_needed();page.screenshot(path=f'/tmp/olive-exam-review/readable-exams-{width}.png')
 page.locator('#exam-back').click();page.locator('.page-back-nav a').click();page.wait_for_url('**/index.html')
 page.evaluate('VocabApp.saveVocabList([["كَتَبَ","schrieb"]],{type:"custom",id:"back-test"})')
 for name,dest in [('test','exams'),('test1','test'),('test2','test'),('test3','test'),('test4','test'),('test5','test'),('test6','test'),('placement','exams'),('huruf','letters'),('stories','index'),('arabic-youth','books')]:
  page.goto(base+'/'+name+'.html');link=page.locator('.page-back-nav a');expect(link).to_have_count(1);assert link.get_attribute('href')==dest+'.html';link.click();page.wait_for_url('**/'+dest+'.html')
 page.goto(base+'/placement.html');page.locator('[data-start-test=quick][data-form=A]').click();page.locator('#placement-options button').first.click();page.locator('#placement-close').click();expect(page.locator('#placement-catalog')).to_be_visible()
 assert not errors,errors;assert not failed,failed;b.close()
 print('PASS local Arabic font, 24+ px readable text in both languages, mobile letter choices, sticky/top/bottom back buttons, preserved answers, and back links across tests and lessons.')
