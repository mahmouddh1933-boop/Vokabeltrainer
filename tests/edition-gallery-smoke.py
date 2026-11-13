"""Other-app previews contain six real local images per other app, no ZIP links."""
import argparse
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8090');args=p.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1280,'height':900},service_workers='block')
 ctx.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');")
 ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort())
 page=ctx.new_page();errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
 for ident in ['start','a1-a2','b1-b2','books']:
  page.goto(base+'/'+ident+'/apps.html');page.wait_for_selector('.edition-showcase')
  assert page.locator('.edition-showcase').count()==3
  assert page.locator('.edition-preview-grid figure').count()==18
  assert not page.locator('#preview-'+ident).count()
  assert not page.locator('a[href*=".zip"]').count()
  for section in page.locator('.edition-showcase').all():assert section.locator('figure').count()==6
  for img in page.locator('.edition-preview-grid img').all():
   img.scroll_into_view_if_needed();img.evaluate('(image)=>image.decode()');assert img.evaluate('(image)=>image.naturalWidth')==1000
  page.locator('.edition-preview-button').first.click();assert page.locator('#edition-image-dialog').is_visible();page.keyboard.press('Escape');assert not page.locator('#edition-image-dialog').is_visible()
  for language in ['de','ar']:
   page.locator('#app-language-select').select_option(language)
   for width in [320,390,768,1280]:
    page.set_viewport_size({'width':width,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(ident,language,width)
  print('GALLERY OK',ident,flush=True)
 page.set_viewport_size({'width':1280,'height':900});page.goto(base+'/a1-a2/apps.html');page.wait_for_selector('.edition-showcase');page.screenshot(path='/tmp/huroof-app-gallery.png',full_page=True)
 assert not errors,errors;b.close();print('PASS four galleries, 18 local images each, exclusions, no ZIP links, zoom dialog, both languages and responsive layout.')
