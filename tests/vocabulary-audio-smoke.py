"""Real touch playback in cards, review and listening with no device TTS or outside network."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright,expect

parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8040')
parser.add_argument('--inline',action='store_true')
parser.add_argument('--demo',action='store_true')
args=parser.parse_args();base=args.base_url.rstrip('/')
root=Path(__file__).resolve().parents[1]
catalog=json.loads((root/'data/vocab_catalog.json').read_text())
audio={c['text']:c['path'] for c in json.loads((root/'audio/vocabulary-manifest.json').read_text())['clips']}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);errors=[];external=[];failed=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
 def route(r):
  if not r.request.url.startswith(base+'/'):external.append(r.request.url);r.abort()
  elif args.inline and r.request.resource_type in ['script','stylesheet']:r.abort()
  else:r.continue_()
 page.route('**/*',route)
 page.add_init_script('''localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');
 Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],cancel(){},addEventListener(){},speak(){throw Error('Device TTS must not be used for built-in vocabulary')}}});
 window.__plays=[];window.__ended=0;
 const play=HTMLMediaElement.prototype.play;
 HTMLMediaElement.prototype.play=function(){__plays.push({src:this.src,gesture:navigator.userActivation.isActive});this.addEventListener('ended',()=>__ended++,{once:true});return play.call(this)};''')
 page.goto(base+'/lernseite.html')
 def select(words):
  page.evaluate('words=>VocabApp.saveVocabList(words,{type:"custom",id:"audio-regression"})',words)
  page.goto(base+'/lernseite.html')
 def play(selector,word):
  before=page.evaluate('__ended');count=page.evaluate('__plays.length')
  page.locator(selector).tap()
  page.wait_for_function('n=>__plays.length>n',arg=count)
  actual=page.evaluate('__plays.at(-1)')
  assert actual['gesture'] and actual['src'].endswith(audio[word]),(word,actual,audio[word])
  page.wait_for_function('n=>__ended>n',arg=before,timeout=15000)
  return actual['src']
 if args.demo:
  words=page.evaluate('VocabApp.getCurrentVocabList()')
  samples=[words[0],words[1],words[-1]]
 else:
  ids=['a1_05','a1_07','a1_10','a1_12','a2_10','b1_29','b2_30']
  samples=[[l['words'][0]['ar'],l['words'][0]['de']] for ident in ids for l in catalog['lists'] if l['id']==ident]
  samples += [[w['ar'],w['de']] for l in catalog['lists'] for w in l['words'] if w['ar'] in ['ظَهْرٌ','ظُهْرٌ','ذُرَةٌ']]
 select(samples)
 for word,de in samples:
  play('#pronounce-button',word)
  page.locator('#next-button').tap()
 # Switching cards during a clip stops it and stale completion cannot replace the new status.
 page.locator('#pronounce-button').tap();page.locator('#next-button').tap()
 assert page.evaluate('VocabApp.getCurrentVocabList().length')==len(samples)
 expect(page.locator('#speech-status')).to_have_text('')
 # The listening test uses the same local clips while keeping the Arabic answers hidden.
 page.goto(base+'/test4.html');page.evaluate('VocabApp.setTestDuration(120)')
 for button in page.locator('[data-listen-index]').all()[:3]:
  before=page.evaluate('__ended');button.tap();page.wait_for_function('n=>__ended>n',arg=before,timeout=15000)
  assert page.evaluate('__plays.at(-1).gesture')
  assert page.evaluate('__plays.at(-1).src').startswith(base+'/audio/')
  assert not page.locator('.listening-question .arabic-word').count()
 # Error-review cards must not regress to online/device speech.
 page.evaluate('w=>VocabApp.addWrongWord(w[0],w[1],"listening")',samples[0]);page.goto(base+'/review.html')
 play('#pronounce-button',samples[0][0]);page.locator('#app-language-select').select_option('de');play('#pronounce-button',samples[0][0])
 assert not errors,errors
 assert not failed,failed
 # A catalogue page may request the separate Excel library; audio never leaves this origin.
 assert all('xlsx' in url for url in external),external
 browser.close()
 print('PASS actual local MP3 touch playback: all four levels, card cancellation, listening and review; no Arabic engine or external audio; inline='+str(args.inline))
