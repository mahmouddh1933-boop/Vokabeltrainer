"""Focused browser checks for Start and A1–A2 only; no live Firebase calls."""
import json, os, re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('HUROOF_TEST_BASE', 'http://127.0.0.1:8090')
D = json.loads((ROOT/'data/reading-exercises.json').read_text())
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox', '--autoplay-policy=no-user-gesture-required'])
    ctx = browser.new_context(viewport={'width':390,'height':844}, service_workers='block')
    ctx.add_init_script("""
      localStorage.setItem('oliveLearnerThemeV1','neutral');
      localStorage.setItem('vocabInterfaceLanguage','ar');
      window.__spoken=[];window.__utterances=[];
      window.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
      Object.defineProperty(window,'speechSynthesis',{value:{
        getVoices:()=>[{lang:'ar-SA',name:'Test Arabic'}],addEventListener(){},cancel(){},resume(){},paused:false,
        speak(u){window.__utterances.push(u);window.__spoken.push(u.text);u.onstart?.()}
      }});
    """)
    ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(BASE+'/') else r.abort())
    page = ctx.new_page(); errors=[]; missing=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('response', lambda r: missing.append(r.url) if r.status==404 else None)
    start = BASE+'/start/reading-exercises.html'
    def open_task(fragment):
        page.goto(start+'#'+fragment)
        page.wait_for_selector('.rx-activity')
    def checked(): return page.locator('.rx-questions input:checked').count()
    def blank(): assert checked()==0 and page.locator('#rx-feedback').inner_text()==''
    task=next(a for a in D['activities'] if a['id']=='meaning-1')
    open_task('meaning/meaning-1')
    for i,q in enumerate(task['questions']): page.locator(f'[data-question="{i}"] input[value="{q["answer"]}"]').check()
    page.get_by_role('button',name='تحقّق من إجاباتي',exact=True).click()
    assert 'عمل ممتاز' in page.locator('#rx-feedback').inner_text()
    page.locator('#rx-back').click();page.wait_for_selector('.rx-grid')
    assert '✓' in page.locator('.rx-card').first.inner_text()
    page.locator('.rx-card').first.click();page.wait_for_selector('.rx-activity');blank()
    page.locator('.rx-questions input').first.check()
    page.locator('#app-language-select').select_option('de');assert checked()==1
    page.locator('#app-language-select').select_option('ar');assert checked()==1
    page.reload();page.wait_for_selector('.rx-activity');blank()
    assert page.evaluate('VocabApp.getStats().readingExercisesV1["meaning-1"].completed') is True
    # A browser cache restoration must also start a fresh attempt.
    page.locator('.rx-questions input').first.check()
    page.evaluate('window.dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');blank()
    for fragment,id in [('colors/colors-1','colors-1'),('stories/stories-1','stories-1'),('draw/draw-1','draw-1')]:
        open_task(fragment)
        page.evaluate('id=>VocabApp.setJSON("learningStats",{...VocabApp.getStats(),readingExercisesV1:{...VocabApp.getStats().readingExercisesV1,[id]:{answers:{q0:0},colors:{top:"red"},order:[0,1],criteria:{0:true},completed:true}}})',id)
        if id=='draw-1': page.locator('.rx-writing textarea').fill('نَصٌّ تَجْرِيبِيٌّ')
        page.reload();page.wait_for_selector('.rx-activity')
        saved=page.evaluate('id=>VocabApp.getStats().readingExercisesV1[id]',id)
        assert saved['answers']=={} and saved['colors']=={} and saved['order']==[] and saved['criteria']=={} and saved['completed']
        if id=='draw-1': expect(page.locator('.rx-writing textarea')).to_have_value('')
    page.goto(start+'#meaning');page.wait_for_selector('.rx-card')
    assert page.locator('.rx-card').count()==9
    page.get_by_role('button',name='اختبر نفسك',exact=False).click();page.wait_for_selector('[data-activity="meaning-self-check"]')
    assert page.locator('.rx-question').count()==5
    def prompts(): return page.locator('.rx-question legend').all_text_contents()
    previous=prompts()
    all_questions=[q for a in D['activities'] if a['chapter']=='meaning' for q in a['questions']]
    for i,prompt in enumerate(previous):
        q=next(q for q in all_questions if prompt==f'{i+1}. '+q['prompt'])
        page.locator(f'[data-question="{i}"] input[value="{q["answer"]}"]').check()
    page.get_by_role('button',name='تحقّق من إجاباتي',exact=True).click()
    assert '5 من 5' in page.locator('#rx-feedback').inner_text()
    page.get_by_role('button',name='إعادة الاختبار بأسئلة مختلفة',exact=True).click()
    assert not {s.split('. ',1)[1] for s in previous} & {s.split('. ',1)[1] for s in prompts()}
    blank()
    for width in [320,390,768,1440]:
        page.set_viewport_size({'width':width,'height':900})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.get_by_role('button',name='العودة إلى مفاتيح الكلمات',exact=True).click();page.wait_for_selector('.rx-grid')
    assert page.locator('.rx-card').count()==9
    print('PASS Start: fresh answers, colour/order/drawing reset, completion retained, mixed quiz/retry/back, mobile layout',flush=True)
    a1=BASE+'/a1-a2/'
    page.goto(a1+'skills.html');page.wait_for_selector('.skills-card')
    expect(page.locator('#skills-sections a')).to_have_count(2)
    assert page.locator('#skills-sections a').all_text_contents()==['وحدات المستوى الأول','وحدات المستوى الثاني']
    assert page.locator('.skills-card').count()==6
    page.locator('#skills-sections a[href="#A2"]').click()
    expect(page.locator('.skills-card small').first).to_have_text(re.compile('^A2'))
    assert page.locator('.skills-module-nav').count()==0
    page.locator('.skills-card a').first.click();page.wait_for_selector('.skills-module-nav')
    assert page.locator('.skills-module-nav a').count()==7
    assert page.locator('#skills-sections').is_hidden()
    def media(button, suffix):
        page.get_by_role('button',name=button,exact=True).click()
        page.wait_for_function('document.getElementById("skills-audio").currentTime>0')
        assert page.locator('#skills-audio').get_attribute('src').endswith(suffix)
        assert page.locator('#skills-audio').evaluate('a=>!a.muted&&a.volume===1&&!a.error')
        page.evaluate('document.getElementById("skills-audio").pause()')
    for unit in ['a1-01','a2-01']:
        page.goto(a1+'skills.html#'+unit+'/vocabulary');page.wait_for_selector('.skills-dialogue')
        media('◖ استمع: الحوار',unit+'-dialogue.mp3')
        media('◖ استمع: الحوار الثاني',unit+'-dialogue-2.mp3')
        page.locator('#skills-content details summary').first.click()
        word=page.locator('.skills-vocab-list li').first
        path=page.evaluate('word=>ArabicVocabularyAudio.audio[word.normalize("NFC")]',word.locator('bdi').first.inner_text())
        word.get_by_role('button',name='استمع',exact=True).click()
        page.wait_for_function('document.getElementById("skills-audio").currentTime>0')
        assert page.locator('#skills-audio').get_attribute('src')==path
        page.locator(f'.skills-module-nav a[href="#{unit}/reading"]').click()
        media('◖ استمع: نص القراءة',unit+'-reading.mp3')
        before=page.evaluate('__spoken.length')
        page.get_by_role('button',name='استمع إلى شرح القاعدة',exact=True).click()
        page.wait_for_function('n=>__spoken.length>n',arg=before)
        page.evaluate('__utterances.at(-1).onend()')
        assert page.evaluate('__spoken.length')>before+1
        page.evaluate('window.__lateEnd=__utterances.at(-1).onend')
        page.get_by_role('button',name='إيقاف الصوت',exact=True).click()
        count=page.evaluate('__spoken.length');page.evaluate('__lateEnd()')
        assert page.evaluate('__spoken.length')==count
    # Real route trail: return from lesson to the unit module it came from.
    page.goto(a1+'skills.html#a1-01/reading');page.wait_for_selector('.skills-module-nav')
    page.locator('#skills-content a[href^="grammar.html"]').click();page.wait_for_selector('#grammar-lesson')
    page.locator('.page-back-link').first.click();page.wait_for_selector('.skills-module-nav')
    assert page.url.endswith('skills.html#a1-01/reading')
    for ident in ['interrogative-nouns','time-place-adverbials']:
        page.goto(a1+'grammar.html#'+ident);page.wait_for_selector('#grammar-question')
        assert page.locator('#grammar-lesson-select').input_value()==ident
        lesson=json.loads((ROOT/'data'/('a1-a2-interrogatives.json' if ident=='interrogative-nouns' else 'a1-a2-time-place.json')).read_text())
        for i,q in enumerate(lesson['questions']):
            page.locator('#grammar-answers').get_by_role('button',name=q['options'][q['correct']],exact=True).click()
            assert 'أحسنت' in page.locator('#grammar-feedback').inner_text()
            if i<19:page.locator('#grammar-next').click()
    for name in ['index','vocabulary','sentences','stories','grammar','verbs','review','stats','test','lernseite']:
        page.goto(a1+name+'.html');page.wait_for_selector('.page-back-link',state='attached')
        if name!='index':assert page.locator('.page-back-link').first.is_visible(),name
        assert page.locator('.page-back-link').first.get_attribute('href')
    page.goto(a1+'skills.html#a1-01/reading');page.wait_for_selector('.skills-module-nav')
    for lang in ['ar','de']:
        page.locator('#app-language-select').select_option(lang)
        for width in [320,390,768,1440]:
            page.set_viewport_size({'width':width,'height':900})
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(lang,width)
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path='/tmp/huroof-a1-updated-mobile.png')
    assert not errors,errors
    assert not missing,missing
    print('PASS A1–A2: two level choices, nested modules, actual dialogue/reading/vocabulary audio, controlled grammar speech, 40 grammar answers, back links and AR/DE mobile layout',flush=True)
    ctx.close();browser.close()
