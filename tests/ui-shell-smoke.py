"""Audit shared navigation on every page of each generated edition, in AR/DE."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8093');a=p.parse_args();base=a.base_url.rstrip('/');root=Path('/tmp/huroof-four-apps');issues=[];errors=[];count=0
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce',service_workers='block')
 c.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar')")
 c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort());page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 for app in ['start','a1-a2','b1-b2','books']:
  manifest=json.loads((root/app/'edition-manifest.json').read_text())
  for name in manifest['pages']:
   page.set_viewport_size({'width':1440,'height':1000});page.goto(f'{base}/{app}/{name}',wait_until='domcontentloaded')
   if name in ['login.html','offline.html']:
    page.wait_for_selector('main');page.evaluate('document.fonts.ready');assert page.locator('main').evaluate('(n)=>getComputedStyle(n).fontFamily.includes("Noto Sans Arabic")');page.set_viewport_size({'width':320,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(app,name);count+=1;continue
   page.wait_for_selector('.brand-name',state='attached');page.evaluate('document.fonts.ready')
   # Skip the private admin application state; its shared navigation is still audited.
   for lang,width in [('ar',1440),('de',1440),('de',390),('ar',320)]:
    page.set_viewport_size({'width':width,'height':900});page.locator('#app-language-select').select_option(lang)
    if width<=960:
     page.locator('.menu-toggle').click();page.wait_for_function('document.body.classList.contains("nav-open")')
    info=page.evaluate('''()=>{const brand=document.querySelector('.brand-name'),side=document.querySelector('.app-sidebar'),r=brand.getBoundingClientRect(),s=side.getBoundingClientRect(),nameStyle=getComputedStyle(brand),nav=[...side.querySelectorAll('.nav-link')];return {overflow:document.documentElement.scrollWidth>innerWidth,nameClipped:brand.scrollWidth>brand.clientWidth+1,nameWrap:r.height>parseFloat(nameStyle.lineHeight)*1.2,brandOutside:r.left<s.left||r.right>s.right,wrongFont:!getComputedStyle(brand).fontFamily.includes('Noto Sans Arabic')||!document.fonts.check('20px "Noto Sans Arabic"'),smallLinks:nav.some(n=>n.getBoundingClientRect().height<44),unreachable:side.scrollHeight>side.clientHeight&&getComputedStyle(side).overflowY!=='auto'}}''')
    if any(info.values()):issues.append(dict(app=app,page=name,lang=lang,width=width,**info))
    if width<=960:
     page.keyboard.press('Escape');assert page.locator('.menu-toggle').get_attribute('aria-expanded')=='false';assert page.locator('.menu-toggle').evaluate('(e)=>e===document.activeElement')
    count+=1
   print('AUDITED',app,name,flush=True)
 b.close()
Path('/tmp/huroof-ui-audit.json').write_text(json.dumps(dict(views=count,issues=issues,errors=errors),ensure_ascii=False,indent=2))
assert not issues,json.dumps(issues[:10],ensure_ascii=False)
assert not errors,errors[:10]
print('PASS',count,'page/language/viewport views; no clipped branding, overflow, small navigation targets, inaccessible sidebar or JS errors')
