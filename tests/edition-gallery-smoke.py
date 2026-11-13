"""Twelve screenshots per other app, navigable galleries and sidebar icons."""
import argparse
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8090');args=p.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1280,'height':900},service_workers='block')
 ctx.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');")
 ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort())
 page=ctx.new_page();errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
 for ident in ['start','a1-a2','b1-b2','books']:
  page.goto(base+'/'+ident+'/apps.html');page.wait_for_selector('.edition-carousel')
  assert page.locator('.edition-showcase').count()==3
  assert page.locator('.edition-carousel figure').count()==3
  assert not page.locator('#preview-'+ident).count()
  assert not page.locator('a[href*=".zip"]').count()
  icons=page.locator('.app-sidebar .nav-link svg').evaluate_all('(nodes)=>nodes.map(n=>n.innerHTML)')
  assert len(icons)==len(set(icons)),ident
  for gallery in page.locator('.edition-carousel').all():
   assert gallery.locator('.edition-carousel-dot').count()==12
   for i in range(12):
    img=gallery.locator('figure img');img.evaluate('(image)=>image.decode()');assert img.evaluate('(image)=>image.naturalWidth')==1000
    assert img.get_attribute('src').endswith('/'+str(i+1)+'.webp')
    assert str(i+1)+' من 12' in gallery.locator('[data-gallery-count]').inner_text()
    gallery.locator('[data-gallery-next]').click()
   assert gallery.locator('figure img').get_attribute('src').endswith('/1.webp')
   gallery.focus();gallery.press('End');assert gallery.locator('figure img').get_attribute('src').endswith('/12.webp')
   gallery.press('Home');gallery.press('ArrowLeft');assert gallery.locator('figure img').get_attribute('src').endswith('/2.webp')
  gallery=page.locator('.edition-carousel').first
  gallery.locator('.edition-preview-button').click();dialog=page.locator('#edition-image-dialog');assert dialog.is_visible()
  dialog.locator('[data-gallery-next]').click();assert dialog.locator('img').get_attribute('src').endswith('/3.webp')
  page.keyboard.press('ArrowRight');assert dialog.locator('img').get_attribute('src').endswith('/2.webp')
  page.keyboard.press('Escape');assert not dialog.is_visible()
  for language in ['de','ar']:
   page.locator('#app-language-select').select_option(language)
   assert page.locator('.edition-carousel').first.locator('figure img').get_attribute('src').endswith('/2.webp')
   for width in [320,390,768,1280]:
    page.set_viewport_size({'width':width,'height':844});page.wait_for_timeout(300);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(ident,language,width)
    assert page.locator('.edition-carousel-dot').evaluate_all('(nodes)=>nodes.every(n=>n.getBoundingClientRect().width<=44)'),(ident,language,width,'dot widths')
    if width<=768:assert page.locator('.app-sidebar').evaluate('(n)=>{const r=n.getBoundingClientRect();return r.right<=0||r.left>=innerWidth}'),(ident,language,width,'sidebar closed')
  print('GALLERY AND ICONS OK',ident,flush=True)
 page.set_viewport_size({'width':1280,'height':900});page.goto(base+'/a1-a2/apps.html');page.wait_for_selector('.edition-showcase');page.screenshot(path='/tmp/huroof-carousel-desktop.png')
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(350);page.locator('.edition-carousel').first.scroll_into_view_if_needed();page.screenshot(path='/tmp/huroof-carousel-mobile.png')
 assert not errors,errors;b.close();print('PASS twelve-frame galleries, local images, controls, wrap, keyboard, modal navigation, languages, responsive layout and unique sidebar icons.')
