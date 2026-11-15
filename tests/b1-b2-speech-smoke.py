"""Exercise the actual shared speech adapter with a controlled Arabic device voice."""
from playwright.sync_api import sync_playwright
import unicodedata
base='http://127.0.0.1:8093/b1-b2/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 c=b.new_context(service_workers='block');c.add_init_script('''
 localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');
 window.__spoken=[];window.__cancelled=0;window.__pending=null;
 window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
 Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'ar-SA',name:'Arabic',default:true}],addEventListener:()=>{},cancel(){__cancelled++;__pending=null},resume(){},speak(u){__spoken.push(u.text);__pending=u;u.onstart?.()}}});
 ''');c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
 page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base+'texts.html');page.wait_for_selector('.advanced-unit-card');units=page.evaluate('HuroofAdvancedUnits.units')
 for u in units:
  for section,text in [('reading',u['reading']),('listening',u['listening']['script'])]:
   page.goto(base+'texts.html#'+u['id']+'/'+section);page.wait_for_selector('#advanced-speech-play');page.evaluate('__spoken=[]');page.locator('#advanced-speech-play').click()
   for _ in range(100):
    if not page.evaluate('!!__pending'):break
    page.evaluate('()=>{const u=__pending;__pending=null;u.onend?.()}')
   actual=page.evaluate('__spoken');assert actual and max(map(len,actual))<=160
   assert unicodedata.normalize('NFC',''.join(''.join(actual).split()))==unicodedata.normalize('NFC',''.join(text.split())),u['id']
   assert 'اكتمل' in page.locator('#advanced-speech-status').inner_text()
 page.locator('#advanced-speech-play').click();before=page.evaluate('__spoken.length');page.locator('#advanced-speech-stop').click();assert page.evaluate('__pending===null&&__spoken.length=== '+str(before))
 assert page.locator('#advanced-audio').get_attribute('src')
 page.locator('#advanced-speech-play').click();page.goto(base+'texts.html#B11/writing');page.wait_for_selector('#advanced-essay');assert page.evaluate('__pending===null')
 assert not errors,errors;b.close()
print('PASS 40 units / 80 complete text queues through actual shared adapter; Arabic voice, cancellation, navigation, retained local fallback; external requests blocked. Device pronunciation not acoustically evaluated.')
