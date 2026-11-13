"""Capture six real learning screens per edition as small local WebP previews.
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
 for ident in ['start','a1-a2','b1-b2','books']:
  if a.app and ident!=a.app:continue
  definition=json.loads((a.directory/ident/'edition-manifest.json').read_text())
  target=ROOT/'images/editions'/ident;target.mkdir(parents=True,exist_ok=True)
  for i,frame in enumerate(definition['previews'],1):
   if a.frame and i!=a.frame:continue
   page.goto(base+'/'+ident+'/'+frame['page']);page.wait_for_selector('.edition-brand');page.evaluate('document.fonts.ready');page.wait_for_timeout(200)
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
   page.wait_for_timeout(150)
   image=Image.open(io.BytesIO(page.screenshot())).convert('RGB');image.resize((1000,750),Image.Resampling.LANCZOS).save(target/(str(i)+'.webp'),quality=82,method=6)
   print('PREVIEW',ident,i,frame['page'],flush=True)
 assert not errors,errors
 browser.close()
