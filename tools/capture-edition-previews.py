"""Capture twelve real learning screens per edition as small local WebP previews.
Serve a suite build before running; no real accounts are used or photographed.
"""
import argparse,json,io
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-four-apps'));p.add_argument('--base-url',default='http://127.0.0.1:8090');p.add_argument('--app',choices=['start','a1-a2','b1-b2','books']);p.add_argument('--frame',type=int);a=p.parse_args()
base=a.base_url.rstrip('/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1200,'height':900},device_scale_factor=1,service_workers='block')
 context.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');")
 context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort())
 page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 def sample_test(ident):
  page.goto(base+'/'+ident+'/test2.html');page.wait_for_selector('.question')
  words=page.evaluate('VocabApp.getCurrentVocabList()')
  for i,question in enumerate(page.locator('.question').all()):
   ar=question.locator('.arabic-text').inner_text();correct=next(de for word,de in words if word==ar)
   for radio in question.locator('input[type=radio]').all():
    if (radio.input_value()!=correct if i==0 else radio.input_value()==correct):radio.check();break
  page.locator('#submit-test').click();page.wait_for_url('**/ergebnis.html')
 for ident in ['start','a1-a2','b1-b2','books']:
  if a.app and ident!=a.app:continue
  definition=json.loads((a.directory/ident/'edition-manifest.json').read_text())
  target=ROOT/'images/editions'/ident;target.mkdir(parents=True,exist_ok=True)
  for i,frame in enumerate(definition['previews'],1):
   if a.frame and i!=a.frame:continue
   page.goto(base+'/'+ident+'/'+frame['page']);page.wait_for_selector('.edition-brand');page.evaluate('document.fonts.ready');page.wait_for_timeout(200)
   action=frame.get('action')
   if action=='sample-test':sample_test(ident)
   elif action=='imperative':page.locator('[data-tense=imperative]').click()
   elif action=='letters-writing':page.locator('#letter-next').click()
   elif action=='book2-cards':
    page.goto(base+'/'+ident+'/vocabulary.html');page.wait_for_selector('#book-vocabulary-2-lists .ready-list-button');page.locator('#book-vocabulary-2-lists .ready-list-button').first.click();page.wait_for_url('**/lernseite.html');page.locator('#flashcard').click()
   elif action=='placement-test':page.locator('[data-start-test=quick][data-form=A]').click()
   elif action=='teacher-exam':page.locator('#exam-catalog button').first.click()
   elif action=='skills-unit':page.locator('.skills-card a').first.click();page.wait_for_selector('#skills-unit-score')
   elif action=='draw-example':
    canvas=page.locator('.rx-canvas');canvas.scroll_into_view_if_needed();bounds=canvas.bounding_box()
    x=bounds['x'];y=bounds['y'];w=bounds['width'];h=bounds['height']
    for points in [[(.2,.7),(.2,.4),(.5,.15),(.8,.4),(.8,.7),(.2,.7)],[(.2,.4),(.8,.4)],[(.45,.7),(.45,.5),(.58,.5),(.58,.7)]]:
     page.mouse.move(x+w*points[0][0],y+h*points[0][1]);page.mouse.down()
     for px,py in points[1:]:page.mouse.move(x+w*px,y+h*py,steps=8)
     page.mouse.up()
    page.locator('.rx-writing textarea').fill('هَذَا بَيْتٌ جَمِيلٌ.')
   if 'colors/colors-2' in frame['page']:
    page.wait_for_selector('#rx-color-art svg')
    for part,color in [('top','green'),('middle','white'),('bottom','black'),('star1','red'),('star2','red'),('star3','red')]:
     page.locator('[data-color="'+color+'"]').click();page.locator('[data-color-label="'+part+'"]').click()
    page.locator('#rx-color-art').scroll_into_view_if_needed()
   elif '#stories/' in frame['page']:page.locator('.rx-story-grid').scroll_into_view_if_needed()
   elif frame['page']=='huruf.html':page.locator('#letter-card').scroll_into_view_if_needed()
   elif frame['page']=='reading-trainer.html':
    if page.locator('#reading-trainer-card').count():page.locator('#reading-trainer-card').scroll_into_view_if_needed()
   elif frame['page']=='lernseite.html':page.locator('#flashcard').scroll_into_view_if_needed()
   if frame.get('focus'):page.locator(frame['focus']).first.scroll_into_view_if_needed()
   page.wait_for_timeout(150)
   image=Image.open(io.BytesIO(page.screenshot())).convert('RGB');image.resize((1000,750),Image.Resampling.LANCZOS).save(target/(str(i)+'.webp'),quality=82,method=6)
   print('PREVIEW',ident,i,frame['page'],flush=True)
 assert not errors,errors
 browser.close()
