"""Real UI + speech adapter integration with a controlled native voice engine."""
from playwright.sync_api import sync_playwright
from unicodedata import normalize
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(service_workers='block')
 ctx.add_init_script('''
 localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');
 window.__spoken=[];window.__utterances=[];
 window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
 Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'ar-SA',name:'Test Arabic'}],addEventListener(){},cancel(){},resume(){},paused:false,speak(u){window.__utterances.push(u);window.__spoken.push({text:u.text,time:performance.now()});u.onstart?.()}}});
 ''')
 ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://127.0.0.1:8090/') else r.abort())
 page=ctx.new_page();errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
 url='http://127.0.0.1:8090/start/reading-exercises.html'
 page.goto(url+'#count/count-1');page.wait_for_selector('[data-activity="count-1"]')
 page.get_by_role('button',name='استمع للنص',exact=True).click()
 spoken=page.evaluate('__spoken');assert len(spoken)==1 and spoken[0]['text'].startswith(normalize('NFC','عُنْوَانُ النَّشَاطِ: تُفَّاحٌ فِي السُّوقِ')),spoken
 page.evaluate('window.__endedAt=performance.now();__utterances.at(-1).onend()')
 page.wait_for_timeout(1750);assert len(page.evaluate('__spoken'))==1
 page.wait_for_function('__spoken.length===2');spoken=page.evaluate('__spoken');assert spoken[1]['text'].startswith(normalize('NFC','السُّؤَالُ الْأَوَّلُ: كَمْ تُفَّاحَةً حَمْرَاءَ')),spoken
 assert spoken[1]['time']-page.evaluate('__endedAt')>=1990
 page.evaluate('__utterances.at(-1).onend()');page.wait_for_function('__spoken.length===3');assert normalize('NFC','السُّؤَالُ الثَّانِي') in page.evaluate('__spoken.at(-1).text')
 page.get_by_role('button',name='إيقاف الصوت',exact=True).click()
 page.get_by_role('button',name='استمع للنص',exact=True).click();page.evaluate('__utterances.at(-1).onend()');page.get_by_role('button',name='إيقاف الصوت',exact=True).click();count=len(page.evaluate('__spoken'));page.wait_for_timeout(2100);assert len(page.evaluate('__spoken'))==count
 page.goto(url+'#meaning/meaning-1');page.wait_for_selector('[data-activity="meaning-1"]');page.evaluate('__spoken=[];__utterances=[]')
 page.get_by_role('button',name='استمع للنص',exact=True).click();page.evaluate('__utterances.at(-1).onend()');page.wait_for_function('__spoken.length===2');assert '_' not in page.evaluate('__spoken.at(-1).text')
 page.get_by_role('button',name='استمع للنص',exact=True).click();page.evaluate('__utterances.at(-1).onend()');count=len(page.evaluate('__spoken'));page.evaluate('location.hash="stories/stories-3"');page.wait_for_selector('[data-activity="stories-3"]');page.wait_for_timeout(2100);assert len(page.evaluate('__spoken'))==count
 assert page.locator('.rx-activity h2').inner_text()=='خُبْزٌ لِلْجَارَةِ'
 assert not errors,errors;b.close();print('PASS actual speech completion, 2-second title pause, numbered questions, underscore removal, stop and route cancellation, female-neighbour story.')
