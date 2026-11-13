"""Audit every beginner page and unit area with the locally embedded Noto Sans Arabic font."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
BASE=os.environ.get('HUROOF_TEST_BASE','http://127.0.0.1:8092').rstrip('/')+'/a1-a2/'
manifest=json.loads((Path(os.environ.get('HUROOF_BUILD_DIR','/tmp/huroof-four-apps/a1-a2'))/'edition-manifest.json').read_text())
routes=[p for p in manifest['pages'] if p!='offline.html']+['offline.html']
routes += ['skills.html#a1-01/'+m for m in ['vocabulary','reading','listening','conversation','writing','collocations','review']]
routes += ['skills.html#a2-06/'+m for m in ['vocabulary','reading','listening','conversation','writing','collocations','review']]
routes += ['grammar.html?unit=a1-01#pronouns','grammar.html#time-place-adverbials']
issues=[];errors=[];missing=[];fontfail=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);c=b.new_context(viewport={'width':390,'height':900},service_workers='block')
 c.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');")
 c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
 page=c.new_page();page.on('pageerror',lambda e:errors.append({'route':page.url,'error':str(e)}));page.on('response',lambda r:missing.append(r.url) if r.status==404 else None)
 page.goto(BASE+'index.html');page.wait_for_function('!!window.VocabApp');page.evaluate('''()=>{const list=VocabApp.getCurrentVocabList();VocabApp.setJSON('wrongWords',list.slice(0,4));VocabApp.setJSON('testResults',list.slice(0,4).map((w,i)=>({question:w[0],correct:w[1],answer:i%2?w[1]:'…',arabic:w[0],german:w[1]})));VocabApp.setTestDuration(7200);}''')
 page.goto(BASE+'verbs.html');page.wait_for_selector('#verb-select');page.locator('#verb-select').select_option('walk');page.locator('[data-tense=present]').click();page.evaluate('document.fonts.ready')
 for index,word,marks in [(9,'تَمْشِي',['تَ']),(3,'تَمْشِينَ',['تَ','ِينَ']),(5,'تَمْشِيَانِ',['تَ','َانِ'])]:
  cell=page.locator('#conjugation-body tr').nth(index).locator('.verb-form')
  assert cell.inner_text()==word
  assert cell.locator('mark').all_text_contents()==marks
  assert 'Noto Sans Arabic' in cell.evaluate('e=>getComputedStyle(e).fontFamily')
  assert all('م' not in text for text in cell.locator('mark').all_text_contents())
 page.locator('#conjugation-body').screenshot(path='/tmp/huroof-noto-verb-table.png')
 for n,route in enumerate(routes):
  try:
   page.goto(BASE+route);page.wait_for_selector('main');
   if route=='login.html':page.locator('#auth-form').evaluate('e=>e.hidden=false') # visual fixture; no real sign-in
   page.evaluate('document.fonts.ready');page.wait_for_timeout(100)
   for lang in ['ar','de']:
    if page.locator('#app-language-select').count():page.locator('#app-language-select').select_option(lang)
    page.wait_for_timeout(60)
    for width in [320,360,390,498,768,1024,1440]:
     page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(80)
     info=page.evaluate('''()=>{
      const visible=e=>{if(e.checkVisibility&&!e.checkVisibility({visibilityProperty:true,opacityProperty:true}))return false;const s=getComputedStyle(e),r=e.getBoundingClientRect();return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
      const inScroll=e=>{for(let x=e.parentElement;x&&x.tagName!=='MAIN';x=x.parentElement)if(['auto','scroll'].includes(getComputedStyle(x).overflowX))return true;return false};
      const main=document.querySelector('main'),r=main.getBoundingClientRect();
      const outside=[...main.querySelectorAll('button,input,select,textarea,a.practice-button,a.page-back-link')].filter(visible).filter(e=>!inScroll(e)).filter(e=>{const r=e.getBoundingClientRect();return r.left < -2||r.right > innerWidth+2}).slice(0,8).map(e=>({tag:e.tagName,id:e.id,cls:e.className,text:e.textContent.trim().slice(0,50),rect:e.getBoundingClientRect().toJSON()}));
      const clipped=[...main.querySelectorAll('button,a.practice-button,a.page-back-link')].filter(visible).filter(e=>!inScroll(e)).filter(e=>e.scrollWidth>e.clientWidth+4).slice(0,8).map(e=>({id:e.id,cls:e.className,text:e.textContent.trim().slice(0,60),w:e.clientWidth,content:e.scrollWidth}));
      const controls=[...main.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea')].filter(visible).filter(e=>!inScroll(e)&&!e.closest('.flashcard,.language-welcome')).map(e=>({e,r:e.getBoundingClientRect()})).filter(x=>x.r.top>=64&&x.r.bottom<=innerHeight);
      const overlaps=[];for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){const a=controls[i],b=controls[j];if(a.e.contains(b.e)||b.e.contains(a.e))continue;const w=Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left),h=Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top);if(w>4&&h>4)overlaps.push([a.e.id||a.e.className,b.e.id||b.e.className]);}
      const samples=[main,main.querySelector('h1'),main.querySelector('button'),main.querySelector('p'),main.querySelector('[lang=ar]')].filter(Boolean);
      return {overflow:document.documentElement.scrollWidth>innerWidth,mainOutside:r.left < -2||r.right>innerWidth+2,outside,clipped,overlaps,font:samples.map(e=>getComputedStyle(e).fontFamily),fontLoaded:document.fonts.check('20px "Noto Sans Arabic"')};
     }''')
     if info['overflow'] or info['mainOutside'] or info['outside'] or info['clipped'] or info['overlaps']:issues.append({'route':route,'lang':lang,'width':width,**info})
     if not info['fontLoaded'] or any('Noto Sans Arabic' not in f for f in info['font']):fontfail.append({'route':route,'lang':lang,'width':width,'fonts':info['font']})
   if n%6==0:print('AUDITED',n+1,'/',len(routes),route,flush=True)
  except Exception as e:issues.append({'route':route,'exception':str(e)})
 b.close()
report={'routes':routes,'views':len(routes)*14,'issues':issues,'fontfail':fontfail,'errors':errors,'missing':missing}
Path('/tmp/huroof-a1-interface-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('RESULT',len(routes),'routes',len(issues),'layout issues',len(fontfail),'font failures',len(errors),'JS errors',len(missing),'missing files')
print(json.dumps(issues[:5],ensure_ascii=False)[:6000])

assert not issues,issues[:3]
assert not fontfail,fontfail[:3]
assert not errors,errors[:3]
assert not missing,missing[:3]
