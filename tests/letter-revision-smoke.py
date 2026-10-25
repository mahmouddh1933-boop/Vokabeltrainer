"""Corrected label/audio selection and pixel-centred handwriting guides on mobile."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8050');parser.add_argument('--inline',action='store_true');parser.add_argument('--demo',action='store_true');args=parser.parse_args();base=args.base_url.rstrip('/')
clips=json.loads((Path(__file__).resolve().parents[1]/'audio/letter-pronunciation-revision.json').read_text())['clips']
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[];external=[];failed=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
 def route(r):
  if not r.request.url.startswith(base+'/'):external.append(r.request.url);r.abort()
  elif args.inline and r.request.resource_type in ['script','stylesheet']:r.abort()
  else:r.continue_()
 page.route('**/*',route)
 page.add_init_script('''localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');
 window.__plays=[];window.__ended=0;const play=HTMLMediaElement.prototype.play;
 HTMLMediaElement.prototype.play=function(){__plays.push({src:this.src,gesture:navigator.userActivation.isActive});this.addEventListener('ended',()=>__ended++,{once:true});return play.call(this)};''')
 page.goto(base+'/huruf.html');letters=page.evaluate('ArabicLetterData.letters')
 def select(char):page.locator('#letters-grid button').nth(next(i for i,l in enumerate(letters) if l['char']==char)).tap()
 def play(selector,clip):
  before=page.evaluate('__ended');page.locator(selector).tap();page.wait_for_function('n=>__ended>n',arg=before,timeout=10000)
  actual=page.evaluate('__plays.at(-1)');assert actual['gesture'] and actual['src'].endswith(clip['path']),(clip,actual)
 for clip in clips:
  if args.demo and clip['kind']!='related' and clip['letter'] not in [l['char'] for l in letters]:continue
  if clip['kind']=='related':
   select('أ');tile=page.locator('.letter-related-card').filter(has=page.locator('.related-glyph').filter(has_text='ى'))
   expect(tile.locator('.related-word')).to_have_text('فَتَى');assert 'ً' not in tile.locator('.related-word').inner_text()
   before=page.evaluate('__ended');tile.locator('button').tap();page.wait_for_function('n=>__ended>n',arg=before);assert page.evaluate('__plays.at(-1).src').endswith(clip['path'])
  else:
   select(clip['letter'])
   if clip['kind']=='name':play('#letter-speak',clip)
   elif clip['kind']=='vowel':
    expect(page.locator('#harakat-row button').nth(1).locator('.marked')).to_have_text('إِ');play('#harakat-row button:nth-child(2)',clip)
   else:
    rendered=page.locator('#letter-card-word').inner_text();assert rendered==clip['text'] or page.evaluate('t=>t.normalize("NFC")',rendered)==clip['text'];play('#card-say-word',clip)
 # Inspect the actual painted pixels, including the hamza, not CSS box alignment.
 for language in ['ar','de']:
  page.locator('#app-language-select').select_option(language)
  for i,letter in enumerate(letters):
   page.locator('#letters-grid button').nth(i).tap()
   box=page.locator('#writing-canvas').evaluate('''c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let l=c.width,r=-1,t=c.height,b=-1;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>0){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y)}return {l,r,t,b,w:c.width,h:c.height};}''')
   assert box['l']>=30 and box['t']>=30 and box['r']<=box['w']-30 and box['b']<=box['h']-30,(letter['char'],box)
   assert abs((box['l']+box['r'])/2-box['w']/2)<=2,(letter['char'],box)
   assert abs((box['t']+box['b'])/2-box['h']/2)<=2,(letter['char'],box)
  select('أ')
  for width in [320,390,768,1440]:
   page.set_viewport_size({'width':width,'height':900});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.set_viewport_size({'width':390,'height':844});page.locator('#writing-canvas').scroll_into_view_if_needed();page.wait_for_timeout(250);page.screenshot(path='/tmp/olive-centred-alif-'+language+'.png')
 assert not errors,errors;assert not failed,failed;assert not external,external;b.close()
 print('PASS corrected local recordings, إِ, final long ā in فَتَى, all '+str(len(letters))+' pixel-centred writing guides, both languages and phone widths; inline='+str(args.inline))
