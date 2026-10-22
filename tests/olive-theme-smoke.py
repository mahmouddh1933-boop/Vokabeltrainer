"""Brand, optional learner backgrounds, focus, persistence and offline rendering."""
from playwright.sync_api import sync_playwright, expect
import argparse
parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8000')
parser.add_argument('--portable',action='store_true')
args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for mode in ['normal','storage-denied','older-dom']:
  context=browser.new_context(viewport={'width':390,'height':950},is_mobile=True,has_touch=True)
  if mode=='storage-denied':context.add_init_script('''for(const key of ['localStorage','sessionStorage'])Object.defineProperty(window,key,{configurable:true,get(){throw new DOMException('Denied','SecurityError')}});''')
  if mode=='older-dom':context.add_init_script('delete Element.prototype.replaceChildren;String.prototype.replaceAll=undefined;')
  page=context.new_page();errors=[];failed=[];separate=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
  def route(r):
   url=r.request.url
   if args.portable and r.request.resource_type in ['script','stylesheet'] and url.startswith(base+'/'):
    separate.append(url);r.abort()
   elif url.startswith(base+'/'):r.continue_()
   else:r.abort()
  page.route('**/*',route)
  assert page.goto(base+'/index.html').status==200
  assert 'حروف من الزيتون' in page.title()
  expect(page.locator('.brand')).to_have_attribute('aria-label','حروف من الزيتون')
  expect(page.locator('#language-welcome')).to_be_visible()
  assert 'حروف من الزيتون' in page.locator('#language-welcome').inner_text()
  page.locator('#language-welcome button').filter(has_text='العربية').tap()
  modal=page.locator('#olive-learner-setup')
  expect(modal).to_be_visible()
  expect(modal.locator('[role="dialog"]')).to_be_focused()
  assert page.locator('main').evaluate('n=>n.inert')
  assert modal.locator('[data-learner-choice]').count()==3
  for width in [320,390,768,1440]:
   page.set_viewport_size({'width':width,'height':950});page.wait_for_timeout(100)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('dialog',mode,width)
  page.keyboard.press('Shift+Tab');expect(modal.locator('[data-learner-choice="neutral"]')).to_be_focused()
  page.keyboard.press('Tab');expect(modal.locator('[data-learner-choice="boy"]')).to_be_focused()
  await_image='''async()=>{const i=new Image();i.src='images/brand/learner-scenes.png';await i.decode();return [i.naturalWidth,i.naturalHeight]}'''
  assert page.evaluate(await_image)==[1536,1024]
  if mode=='normal':page.screenshot(path='/tmp/olive-profile-desktop.png')
  modal.locator('[data-learner-choice="girl"]').tap()
  expect(modal).to_be_hidden()
  assert not page.locator('main').evaluate('n=>n.inert')
  assert not page.locator('.app-sidebar').evaluate('n=>n.inert'),'Desktop sidebar must recover after resizing an open chooser'
  assert page.evaluate('OliveTheme.get()')=='girl'
  expect(page.locator('html')).to_have_attribute('data-learner-theme','girl')
  assert page.locator('.olive-drawing-field').evaluate('n=>getComputedStyle(n).backgroundPositionX')=='100%'
  assert page.locator('.olive-backdrop').evaluate('n=>getComputedStyle(n).pointerEvents')=='none'
  stats=page.evaluate('VocabApp.getStats()')
  catalog=page.evaluate('VocabApp.loadCatalog()')
  assert len(catalog['lists'])==120
  page.locator('#olive-theme-open').tap();expect(modal).to_be_visible()
  modal.locator('[data-learner-choice="boy"]').tap()
  expect(page.locator('#olive-theme-open')).to_be_focused()
  assert page.evaluate('OliveTheme.get()')=='boy'
  assert page.locator('.olive-drawing-field').evaluate('n=>getComputedStyle(n).backgroundPositionX')=='0%'
  assert page.evaluate('VocabApp.getStats()')==stats
  assert page.evaluate('VocabApp.loadCatalog()')==catalog
  page.locator('#olive-theme-open').tap();page.keyboard.press('Escape');expect(modal).to_be_hidden()
  assert page.evaluate('OliveTheme.get()')=='boy'
  if mode!='storage-denied':
   page.reload();expect(modal).to_be_hidden()
   expect(page.locator('#language-welcome')).to_have_count(0)
   assert page.evaluate('OliveTheme.get()')=='boy'
  else:expect(page.locator('.storage-notice')).to_have_count(1)
  page.set_viewport_size({'width':390,'height':950});page.wait_for_timeout(250)
  if mode=='normal':
   page.evaluate('scrollTo(0,0)');page.screenshot(path='/tmp/olive-home-mobile.png')
   page.locator('#olive-theme-open').tap();page.screenshot(path='/tmp/olive-profile-mobile.png');page.keyboard.press('Escape')
  page.goto(base+'/huruf.html')
  page.locator('#app-language-select').select_option('ar')
  assert 'حروف من الزيتون' in page.title()
  assert page.locator('#olive-learner-setup').is_hidden()
  page.locator('#letter-next').tap();expect(page.locator('#letter-big')).to_have_text('ب')
  page.locator('#letter-card').tap();assert 'flipped' in page.locator('#letter-card').get_attribute('class')
  page.locator('#olive-theme-open').tap();page.locator('[data-learner-choice="girl"]').tap()
  expect(page.locator('#letter-big')).to_have_text('ب')
  assert 'flipped' in page.locator('#letter-card').get_attribute('class')
  for language in ['de','ar']:
   page.locator('#app-language-select').select_option(language)
   assert page.evaluate('OliveTheme.get()')=='girl'
   for width in [320,390,768,1440]:
    page.set_viewport_size({'width':width,'height':950});page.wait_for_timeout(80)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('letters',mode,language,width)
  page.goto(base+'/youth-book-two-part-one.html#unit-6')
  expect(page.locator('#book-unit-title')).to_have_text('إلى السوق')
  page.locator('#olive-theme-open').click();page.locator('[data-learner-choice="boy"]').click()
  expect(page.locator('#book-unit-title')).to_have_text('إلى السوق')
  page.evaluate('window.print=()=>{}')
  page.locator('#book-print-unit').click();page.emulate_media(media='print')
  expect(page.locator('#yt-print')).to_be_visible()
  expect(page.locator('#olive-backdrop')).to_be_hidden();expect(page.locator('#olive-theme-open')).to_be_hidden()
  assert page.locator('#yt-print .yt-print-task').count()==68
  assert page.locator('body').evaluate('n=>getComputedStyle(n).backgroundColor')=='rgb(255, 255, 255)'
  page.emulate_media(media='screen')
  page.locator('#olive-theme-open').click();page.locator('[data-learner-choice="neutral"]').click()
  expect(page.locator('.olive-drawing-field')).to_be_hidden()
  expect(page.locator('#book-unit-title')).to_have_text('إلى السوق')
  assert not errors,errors
  assert not failed,failed
  assert not separate,separate
  context.close()
  print('PASS olive identity, three backgrounds, focus, responsive DE/AR, cards and units unchanged, blank print; mode='+mode+'; portable='+str(args.portable),flush=True)
 browser.close()
