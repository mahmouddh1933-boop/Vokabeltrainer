"""Real mouse/touch/keyboard interaction, persistence and every converted activity."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright
p=argparse.ArgumentParser();p.add_argument('--base-url',default='http://127.0.0.1:8098/books');args=p.parse_args();base=args.base_url.rstrip('/');site=base.rsplit('/',1)[0]+'/'
root=Path(__file__).resolve().parents[1];catalog=json.loads((root/'data/smart-activities.json').read_text());errors=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 def context(touch=False):
  c=browser.new_context(viewport={'width':390 if touch else 1280,'height':844 if touch else 1000},has_touch=touch,is_mobile=touch,service_workers='block',reduced_motion='reduce')
  c.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');window.print=()=>window.__smartPrinted=true")
  c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(site) else r.abort());return c
 c=context();page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 def open_activity(id,page_name='youth-training-two.html'):
  page.goto(base+'/'+page_name+'#'+id);page.wait_for_selector('.smart-activity');page.evaluate('document.fonts.ready')
 def board_position(pg):
  pg.locator('.smart-board').first.evaluate('(n)=>{n.scrollIntoView({block:"start"});window.scrollBy(0,-110)}')
 def drag(pg,source,target,preview=False):
  board_position(pg);a=source.bounding_box();b=target.bounding_box();assert a and b
  pg.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);pg.mouse.down();pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=12)
  if preview:assert pg.locator('[data-smart-preview]').count()==1
  pg.mouse.up()
 open_activity('c-p24-b2');assert page.locator('.smart-bin').count()==3
 source=page.locator('[data-smart-item]').first;id=source.get_attribute('data-smart-item');target=page.locator('button[data-smart-target]').first;value=target.get_attribute('data-smart-target');drag(page,source,target)
 assert page.locator('[data-smart-row="'+id+'"] td').first.text_content()==value
 # Moving an assigned word must leave exactly one chip, with the same identity.
 other=page.locator('button[data-smart-target]').nth(1);value=other.get_attribute('data-smart-target');drag(page,page.locator('[data-smart-item="'+id+'"]'),other);assert page.locator('[data-smart-item="'+id+'"]').count()==1
 assert page.locator('[data-smart-row="'+id+'"] td').first.text_content()==value
 page.reload();page.wait_for_selector('.smart-activity');assert page.locator('[data-smart-row="'+id+'"] td').first.text_content()==value
 # Keyboard movement and returning to the word bank.
 page.locator('[data-smart-item="'+id+'"]').focus();page.keyboard.press('Enter');page.keyboard.press('Delete');assert page.locator('.smart-bank [data-smart-item="'+id+'"]').count()==1
 page.locator('[data-smart-item="'+id+'"]').focus();page.keyboard.press('Enter');page.locator('button[data-smart-target]').first.focus();page.keyboard.press('Enter');assert page.locator('[data-smart-row="'+id+'"] td').first.text_content()!='—'
 open_activity('c-p20-b1');drag(page,page.locator('[data-smart-item]').first,page.locator('button[data-smart-target]').first,True);assert page.locator('.smart-lines path').count()==1
 drag(page,page.locator('[data-smart-item]').nth(1),page.locator('button[data-smart-target]').nth(1),True);assert page.locator('.smart-lines path').count()==2
 assert len(set(page.locator('.smart-lines path').evaluate_all('ns=>ns.map(n=>n.getAttribute("stroke"))')))==2
 page.reload();page.wait_for_selector('.smart-match');page.wait_for_function('document.querySelectorAll(".smart-lines path").length===2')
 for width in [320,768,1280]:
  page.set_viewport_size({'width':width,'height':1000});page.wait_for_function('Math.abs(document.querySelector(".smart-lines").viewBox.baseVal.width-document.querySelector(".smart-board").getBoundingClientRect().width)<2')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 # Batch selection uses actual button activation and checks every original question ID.
 def fill(spec,tasks,wrong=False):
  answers={q['id']:q['answer'] for q in tasks};items=spec['items'];targets=[t['value'] for t in spec['targets']]
  if wrong:
   if spec['kind']=='match':
    for i in range(1,len(items)):answers[items[i]['id']]=tasks[1+(i%(len(items)-1))]['answer']
   else:
    for item in items[1:]:answers[item['id']]=targets[(targets.index(answers[item['id']])+1)%len(targets)]
  page.locator('.smart-activity').evaluate('''(root,answers)=>{for(const [id,value]of Object.entries(answers)){const item=[...root.querySelectorAll('[data-smart-item]')].find(n=>n.dataset.smartItem===id);if(item.disabled)continue;item.click();[...root.querySelectorAll('button[data-smart-target]')].find(n=>n.dataset.smartTarget===value).click();}}''',answers)
  page.locator('.smart-check').click()
 for book,key in [('youth-training-two.html','youth-two'),('youth-book-two-part-one.html','youth-book-two-part-one')]:
  for id,spec in catalog['workbooks'][key].items():
   open_activity(id,book);data_name='ArabicYouthTwoData' if key=='youth-two' else 'ArabicYouthBookTwoPartOneData';tasks=page.evaluate('(name)=>window[name].activities.find(a=>a.id===location.hash.slice(1)).tasks',data_name)
   # Reset only this activity's saved data so previous gesture checks cannot affect scoring.
   page.evaluate('''([key,id])=>{const state=Practice.load(key,{});state.answers[id]={};state.drafts[id]={};Practice.save(key,state)}''',[key,id]);page.reload();page.wait_for_selector('.smart-activity')
   fill(spec,tasks,True);assert page.locator('.smart-summary tbody tr.is-correct').count()==1,(id,'wrong-fixture')
   page.locator('.smart-retry').click();assert page.locator('.smart-summary tbody tr.is-correct').count()==1;assert page.locator('[data-smart-item]:disabled').count()==1
   fill(spec,tasks);assert page.locator('.smart-summary tbody tr.is-correct').count()==len(tasks),(id,'correct')
   assert int(page.locator('#yt-progress').get_attribute('value'))==len(tasks)
   page.reload();page.wait_for_selector('.smart-activity');assert page.locator('.smart-summary tbody tr.is-correct').count()==len(tasks)
   page.locator('#app-language-select').select_option('de');assert 'Zuordnungen' in page.locator('.smart-summary caption').text_content()
   page.set_viewport_size({'width':320,'height':900});page.wait_for_function('getComputedStyle(document.body).paddingInlineStart==="0px"');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   print('PASS workbook interaction, error-only retry, scoring and reload:',key,id,flush=True)
 # Book 1: all 28 initial-letter classification lessons.
 for number in range(1,29):
  page.set_viewport_size({'width':1280,'height':1000});page.goto(base+'/book-level-two.html#letter-'+str(number).zfill(2));page.wait_for_selector('[data-book-tab="practice"]');page.locator('[data-book-tab="practice"]').click();page.wait_for_selector('.smart-activity')
  tasks=page.evaluate('ArabicBookData.questions(ArabicBookData.lessons[Number(location.hash.slice(-2))-1]).filter(q=>q.kind==="classify")')
  spec={'kind':'classify','items':[{'id':q['id']}for q in tasks],'targets':[{'value':v}for v in tasks[0]['options']]};fill(spec,tasks)
  assert page.locator('.smart-summary tr.is-correct').count()==len(tasks)
 print('PASS 28 letter classification lessons',flush=True)
 # Real touch gestures and cancellation, using the browser's actual touch input.
 tc=context(True);tp=tc.new_page();tp.on('pageerror',lambda e:errors.append(str(e)));tp.goto(base+'/youth-training-two.html#c-p20-b1');tp.wait_for_selector('.smart-match');board_position(tp)
 session=tc.new_cdp_session(tp);s=tp.locator('[data-smart-item]').first;t=tp.locator('button[data-smart-target]').first;a=s.bounding_box();z=t.bounding_box();x=a['x']+a['width']/2;y=a['y']+a['height']/2;ex=z['x']+z['width']/2;ey=z['y']+z['height']/2
 session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
 for step in range(1,11):session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+(ex-x)*step/10,'y':y+(ey-y)*step/10}]})
 assert tp.locator('[data-smart-preview]').count()==1
 session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});tp.wait_for_function('document.querySelectorAll(".smart-lines path").length===1')
 id=s.get_attribute('data-smart-item');expected=t.get_attribute('data-smart-target');assert tp.locator('[data-smart-row="'+id+'"] td').first.text_content()==expected
 a=tp.locator('[data-smart-item]').nth(1).bounding_box();x=a['x']+a['width']/2;y=a['y']+a['height']/2
 session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]});session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x-30,'y':y+20}]});assert tp.locator('[data-smart-preview]').count()==1;session.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]});assert tp.locator('[data-smart-preview]').count()==0;assert tp.locator('.smart-lines path').count()==1
 tc.close();print('PASS live colored mouse/touch lines, keyboard, resize and cancellation',flush=True)
 # Each converted exam section must save drafts without revealing feedback until submission.
 for exam,sections in catalog['exams'].items():
  if not sections:continue
  ec=context();ep=ec.new_page();ep.on('pageerror',lambda e:errors.append(str(e)));ep.goto(base+'/exams.html#exam='+exam);ep.wait_for_selector('.smart-activity')
  total=0
  for index,spec in sections.items():
   questions=ep.evaluate('([id,index])=>TeacherExamData.exams.find(e=>e.id===id).sections[Number(index)].tasks',[exam,index]);answers={q['id']:q['answer']for q in questions};total+=len(questions)
   ep.locator('[data-smart-id="'+exam+'-'+index+'"]').evaluate('''(root,answers)=>{for(const [id,value]of Object.entries(answers)){[...root.querySelectorAll('[data-smart-item]')].find(n=>n.dataset.smartItem===id).click();[...root.querySelectorAll('button[data-smart-target]')].find(n=>n.dataset.smartTarget===value).click();}}''',answers)
  assert ep.locator('.smart-check').count()==0;assert ep.locator('.smart-summary tr.is-correct').count()==0
  ep.locator('#exam-submit').click();ep.wait_for_selector('#exam-result:not([hidden])');assert ep.locator('.smart-summary tr.is-correct').count()==total
  result=ep.evaluate('''()=>{const stats=VocabApp.getStats(),attempt=Object.values(stats.teacherExamsV1.attempts).find(a=>a.status==='finished');return TeacherExams.result(TeacherExamData.exams.find(e=>e.id===attempt.examId),attempt)}''');assert result['right']==total,(exam,result,total)
  assert ep.locator('.smart-item:not(:disabled)').count()==0
  ec.close();print('PASS exam draft, hidden grading and final score:',exam,flush=True)
 assert not errors,errors
 browser.close()
print('PASS all 69 converted activity blocks, canonical scoring, persistence, AR/DE and real pointer input')
