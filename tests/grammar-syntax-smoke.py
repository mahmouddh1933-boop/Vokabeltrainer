from playwright.sync_api import sync_playwright,expect
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8000');args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 assert page.goto(base+'/grammar.html#present-inflection').status==200
 page.locator('#app-language-select').select_option('ar')
 assert page.locator('#grammar-lesson-select option').count()==37
 assert '464' in page.locator('#grammar-catalog-count').inner_text()
 assert page.locator('#grammar-progress').get_attribute('max')=='24'
 assert page.locator('#grammar-question-number').inner_text()=='السؤال 1 من 24'
 assert '24 سؤالًا' in page.locator('#grammar-lesson-select option:checked').inner_text()
 page.locator('#grammar-category').select_option('syntax')
 assert page.locator('#grammar-lesson-select option').count()==21
 assert '272' in page.locator('#grammar-catalog-count').inner_text()
 page.locator('#grammar-search').fill('المفعول')
 assert set(page.locator('#grammar-lesson-select option').evaluate_all('(options)=>options.map(o=>o.value)'))=={'purpose-object','absolute-object','subject-object'}
 assert '36' in page.locator('#grammar-catalog-count').inner_text()
 page.locator('#grammar-search').fill('')
 page.locator('#grammar-lesson-select').select_option('past-construction')
 expect(page.locator('#lesson-title')).to_have_text('بناء الفعل الماضي وإعرابه')
 assert page.locator('#grammar-progress').get_attribute('max')=='16'
 page.locator('#app-language-select').select_option('de')
 assert '16 Fragen' in page.locator('#grammar-lesson-select option:checked').inner_text()
 page.locator('#grammar-search').fill('Subjunktiv')
 assert page.locator('#grammar-lesson-select').input_value()=='present-inflection'
 assert page.locator('#grammar-progress').get_attribute('max')=='24'
 page.goto(base+'/grammar.html#relative-pronouns');page.locator('#app-language-select').select_option('ar')
 last=page.locator('.lesson-section').last
 assert last.locator('.grammar-example').count()==3
 assert last.locator('mark').all_text_contents()==['قَرَأْتُهُ','مَنْ','هُ']
 assert 'العائد: الهاء' in last.locator('.grammar-example-note').first.inner_text()
 assert 'الضمير المستتر' in last.locator('.grammar-example-note').nth(1).inner_text()
 for language in ['ar','de']:
  page.locator('#app-language-select').select_option(language)
  assert last.locator('.grammar-example-note').count()==3
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.locator('#app-language-select').select_option('ar');last.scroll_into_view_if_needed();page.wait_for_timeout(400)
 page.screenshot(path='/tmp/jisr-relative-corrected-mobile.png')
 page.goto(base+'/grammar.html#present-inflection');page.set_viewport_size({'width':1440,'height':1050});page.wait_for_timeout(400);page.screenshot(path='/tmp/jisr-present-grammar.png')
 page.route('https://cdn.jsdelivr.net/**',lambda route:route.abort());page.goto(base+'/index.html')
 assert '464' in page.locator('.foundation-home-section .path-label').inner_text()
 assert not errors,errors
 print('PASS: 37 lessons / 464 questions; filtered totals, 24/16-question progress, DE/AR search, explicit sila/return-pronoun examples, homepage totals and mobile layout; no JS errors')
 b.close()
