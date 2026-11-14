"""Check the shared 300-verb chooser, Arabic order and filters in source and both editions."""
import argparse,unicodedata
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8096');p.add_argument('--source-url',default='http://127.0.0.1:8097');args=p.parse_args()
def key(word):return ''.join(c for c in unicodedata.normalize('NFD',word) if not unicodedata.category(c).startswith('M')).replace('ى','ي')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);context=b.new_context(service_workers='block');context.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar')")
 context.route('**/*',lambda r:r.continue_() if r.request.url.startswith((args.base_url+'/',args.source_url+'/')) else r.abort())
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for url in [args.source_url+'/verbs.html',args.base_url+'/a1-a2/verbs.html',args.base_url+'/b1-b2/verbs.html']:
  page.goto(url);page.wait_for_selector('#verb-select option',state='attached');page.evaluate('document.fonts.ready')
  for lang in ['ar','de']:
   page.locator('#app-language-select').select_option(lang)
   assert page.locator('#verb-select option').count()==300
   groups=page.locator('#verb-select optgroup').evaluate_all('(groups)=>groups.map(g=>({ids:[...g.children].map(o=>o.value),forms:[...g.children].map(o=>o.textContent.split(" — ")[0])}))')
   assert len(groups)==6
   families=page.evaluate('Object.fromEntries(VerbLessonData.verbs.map(v=>[v.id,v.family]))')
   for group,family in zip(groups,['sound','hamzated','doubled','example','hollow','defective']):
    assert all(families[id]==family for id in group['ids'])
    keys=[key(form) for form in group['forms']];assert keys==sorted(keys),(url,family,keys)
   for family in ['sound','hamzated','doubled','example','hollow','defective']:
    page.locator('#verb-family').select_option(family);assert page.locator('#verb-select optgroup').count()==1
   page.locator('#verb-family').select_option('all')
   page.locator('#verb-search').fill('نَمَا');assert page.locator('#verb-select option').count()==1;page.locator('#verb-select').select_option('added-235');page.locator('[data-tense=present]').click();assert page.locator('#verb-feature-form').text_content()=='يَنْمُو'
   page.locator('#verb-search').fill('')
   for width in [320,390,1440]:
    page.set_viewport_size({'width':width,'height':900});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('.verb-form').first.evaluate('(n)=>getComputedStyle(n).fontFamily.includes("Noto Sans Arabic")')
  print('PASS 300 verbs, family order, Arabic alphabetical order, search, fonts and AR/DE:',url,flush=True)
 assert not errors,errors
 b.close()
