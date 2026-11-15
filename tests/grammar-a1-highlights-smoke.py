"""Verify the exact highlighted substrings, body text and colors in the shipped UI."""
from playwright.sync_api import sync_playwright
base='http://127.0.0.1:8093/a1-a2/'
ids=['word-classes','gender','definiteness','pronouns','demonstratives','prepositions','possession-basics','sequence-conjunctions','number','idafa','comparison-basic','case-basics','ta-endings','alif-endings','hamza-initial']
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page();page.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar')")
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for id in ids:
  page.goto(base+'grammar.html#'+id);page.wait_for_function('(id)=>document.querySelector("#grammar-lesson-select").value===id',arg=id)
  lesson=page.evaluate('(id)=>ArabicGrammarData.lessons.find(l=>l.id===id)',id)
  figures=page.locator('.grammar-example');i=0
  for section in lesson['sections']:
   for e in section.get('examples',[]):
    f=figures.nth(i);i+=1
    assert f.locator('p[lang=ar]').first.inner_text()==e['ar']
    if 'annotations' in e:
     assert f.locator('mark').all_text_contents()==[e['ar'][a['start']:a['end']] for a in sorted(e['annotations'],key=lambda a:a['start'])],(id,e['ar'])
    assert f.locator('figcaption').inner_text()==e['de']
  for j,section in enumerate(lesson['sections']):
   text=section['body']['ar'];ranges=section.get('bodyAnnotations',{}).get('ar',[])
   assert page.locator('.lesson-body').nth(j).locator('mark').all_text_contents()==[text[a['start']:a['end']] for a in ranges]
  if id=='prepositions':
   e=page.locator('.grammar-example').filter(has_text='هَذَا الْكِتَابُ').locator('mark');assert e.inner_text()=='لِ'
   assert e.evaluate('(n)=>n.previousSibling.textContent.endsWith("الْكِتَابُ ")')
  if id=='possession-basics':
   ta=page.locator('.grammar-mark-ta').first.evaluate('(n)=>getComputedStyle(n).backgroundColor');y=page.locator('.grammar-mark-suffix').first.evaluate('(n)=>getComputedStyle(n).backgroundColor');assert ta!=y
  if id=='case-basics':assert len(set(page.locator('.grammar-example').first.locator('mark').evaluate_all('(ns)=>ns.map(n=>getComputedStyle(n).backgroundColor)')))==3
  for lang,width in [('ar',320),('de',390),('ar',1440)]:
   page.set_viewport_size({'width':width,'height':1000});page.locator('#app-language-select').select_option(lang);page.evaluate('document.fonts.ready');page.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(id,lang,width)
 assert not errors,errors;b.close()
print('PASS 15 lessons: exact example/body targets, first prepositional lam, distinct Ta/Yaa and case colors, translations and AR/DE layouts at 320–1440px')
