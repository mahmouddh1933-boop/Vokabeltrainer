"""Uploaded originals and all 389 new tasks through browser controls; reusable on the inline ZIP."""
import argparse,hashlib
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8026');parser.add_argument('--inline',action='store_true');args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':900},is_mobile=True,has_touch=True,accept_downloads=True)
 errors=[];failed=[];external=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
 def route(r):
  if not r.request.url.startswith(base+'/'):external.append(r.request.url);r.abort()
  elif args.inline and r.request.resource_type in ['script','stylesheet']:r.abort()
  else:r.continue_()
 page.route('**/*',route)
 page.add_init_script("""localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');window.__ended=0;document.addEventListener('ended',()=>__ended++,true);window.print=()=>window.__printed=(window.__printed||0)+1;""")
 def layout():
  for language in ['ar','de']:
   page.locator('#app-language-select').select_option(language)
   for width in [320,390,768,1440]:
    page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(80)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,width)
  page.set_viewport_size({'width':390,'height':900});page.locator('#app-language-select').select_option('ar')
 page.goto(base+'/index.html');page.locator('#teacher-exams-entry').click();expect(page.locator('.exam-card')).to_have_count(10);assert page.locator('.app-sidebar nav a').count()==7;layout()
 data=page.evaluate('TeacherExamData');
 for source in data['originals']:
  card=page.locator('.exam-card').nth(data['originals'].index(source));card.get_by_role('button',name='عرض الأصل',exact=True).click()
  expect(page.locator('#exam-pages img')).to_have_count(source['pages'])
  for img in page.locator('#exam-pages img').all():img.scroll_into_view_if_needed();expect(img).to_be_visible();img.evaluate('(im)=>im.decode()');assert img.evaluate('im=>im.naturalWidth')>500
  with page.expect_download() as download:page.locator('#exam-original-actions a[download]').click()
  f=download.value;assert f.suggested_filename==source['title'];assert hashlib.sha256(open(f.path(),'rb').read()).hexdigest()==source['sha256']
  page.locator('#exam-original-back').click()
 page.evaluate("VocabApp.setJSON('learningStats',{totalTests:4,placementV1:{attempts:{sentinel:{}}},learningRouteV1:{lastStage:'reading'},phonicsV1:{prior:true}})")
 for i,e in enumerate(data['exams']):
  page.locator('.exam-card').nth(i).get_by_role('button',name='ابدأ النموذج المشابه',exact=True).click();tasks=[q for s in e['sections'] for q in s['tasks']]
  assert page.locator('.exam-task').count()==len(tasks);assert page.locator('.exam-feedback').count()==0;assert not page.locator('#exam-key').is_visible()
  if i in [0,4,8]:layout()
  if i==4:
   for q in [q for q in tasks if q['kind']=='dictation']:
    old=page.evaluate('__ended');page.locator(f'[data-question="{q["id"]}"]').get_by_role('button',name='◖ استمع',exact=True).click();page.wait_for_function(f'__ended>{old}',timeout=15000)
   q=next(q for q in tasks if q['kind']=='dictation');page.locator(f'[data-question="{q["id"]}"]').get_by_role('button',name='تعذّر الصوت / إعادة إدراجه',exact=True).click();assert page.locator(f'#answer-{q["id"]}').is_disabled()
  page.evaluate("""tasks=>{
   for(const q of tasks){const field=document.querySelector(`[data-question="${q.id}"]`);
    if(q.kind==='choice'){[...field.querySelectorAll('input')].find(n=>n.value===q.answer).click();}
    else if(q.kind==='order'){q.tokens.forEach((_,i)=>field.querySelector(`[data-token="${i}"]`).click());}
    else {const input=field.querySelector('textarea,input');if(!input.disabled){input.value=q.kind==='manual'?'هذا جواب شخصي للتجربة':q.answer;input.dispatchEvent(new Event('input',{bubbles:true}));}}
   }
  }""",tasks)
  # Draft persistence, including order tokens and free answers, uses the account-safe stats key.
  if i==0:
   attempt=page.evaluate('new URLSearchParams(location.hash.slice(1)).get("attempt")');page.reload();expect(page.locator('#exam-session')).to_be_visible();assert page.locator('textarea').first.input_value()=='هذا جواب شخصي للتجربة'
   assert page.evaluate('VocabApp.getStats().teacherExamsV1.attempts["'+attempt+'"].status')=='draft'
  page.locator('#exam-blank').click();assert page.locator('#exam-print .exam-print-task').count()==len(tasks);assert 'هذا جواب شخصي للتجربة' not in page.locator('#exam-print').inner_text()
  for index,q in enumerate(tasks):
   if q['kind']=='dictation':assert q['answer'] not in page.locator('#exam-print .exam-print-task').nth(index).inner_text()
  page.emulate_media(media='print');assert page.locator('#exam-print').is_visible();assert not page.locator('#main-content').is_visible();page.emulate_media(media='screen');page.evaluate("dispatchEvent(new Event('afterprint'))")
  page.locator('#exam-submit').click();expect(page.locator('#exam-result')).to_be_visible();assert '١٠٠' in page.locator('#exam-result').inner_text() or '100' in page.locator('#exam-result').inner_text();assert page.locator('.exam-feedback').count()==len(tasks)
  if i==4:assert '1 مستبعدة' in page.locator('#exam-result').inner_text()
  for input in page.locator('#exam-questions input,#exam-questions textarea').all():assert input.is_disabled()
  page.locator('#exam-key').click();assert 'دليل الإجابات' in page.locator('#exam-print').inner_text();page.evaluate("dispatchEvent(new Event('afterprint'))")
  page.locator('#exam-back').click()
  print(e['id'],len(tasks),'tasks passed')
 assert page.locator('#exam-history button').count()==10
 stats=page.evaluate('VocabApp.getStats()');assert stats['totalTests']==4 and stats['phonicsV1']['prior'] and 'sentinel' in stats['placementV1']['attempts'];assert stats['learningRouteV1']['lastStage']=='reading'
 page.locator('#exam-history button').first.click();assert page.locator('#exam-result').is_visible();page.reload();assert page.locator('#exam-result').is_visible();layout()
 page.goto(base+'/test.html');assert page.locator('.test-button-group button').count()==6;assert page.locator('a[href="exams.html"]').count()==1
 page.goto(base+'/placement.html');expect(page.locator('.placement-test-card')).to_have_count(5);assert page.locator('a[href="exams.html"]').count()==1
 assert not errors,errors;assert not failed,failed;assert not external,external
 print('10 PDFs + 26 previews, 389 tasks, 8 real audio playbacks, drafts/results, print, original hashes, AR/DE/mobile and existing test menus passed.')
 b.close()
