"""Exercise all 28 workbook lessons, 504 tasks, local audio, handwriting and printing."""
from playwright.sync_api import sync_playwright
import argparse, re, json

parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8000')
args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':950},is_mobile=True,has_touch=True)
    page=context.new_page();errors=[];external=[];failed=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('response',lambda response:failed.append(response.url) if response.status>=400 else None)
    def route_request(route):
        if route.request.url.startswith(base):route.continue_()
        else:external.append(route.request.url);route.abort()
    page.route('**/*',route_request)
    page.add_init_script('''window.__plays=0;window.__calls=[];window.__printCalls=0;
      window.print=()=>window.__printCalls++;
      const play=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){__calls.push({src:this.src,gesture:navigator.userActivation.isActive});this.addEventListener('playing',()=>__plays++,{once:true});return play.call(this);};''')
    assert page.goto(base+'/book-level-two.html').status==200
    page.locator('#app-language-select').select_option('ar')
    assert page.locator('#lesson-loading').count()==0
    assert page.locator('.app-sidebar a[aria-current="page"]').get_attribute('href')=='book-level-two.html'
    lessons=page.evaluate('ArabicBookData.lessons')
    assert len(lessons)==28
    def play(selector,text):
        expected=page.evaluate('text=>{const key=text.normalize("NFC");return ArabicLetterData.audio[key]||ArabicBookData.audio[key]}',text)
        before=page.evaluate('__plays');page.locator(selector).tap();page.wait_for_function('n=>__plays>n',arg=before)
        actual=page.evaluate('__calls.at(-1)')
        assert actual['gesture'] and actual['src'].endswith(expected),(actual,expected)
    def answer(q,wrong=False):
        card=page.locator('#book-q-'+q['id'])
        if q['kind']=='grammar':
            card.locator('input').fill('لا يشرب القهوة' if wrong else q['answer'])
            card.locator('.book-answer-field button').tap()
        else:
            option=next(o for o in q['options'] if o!=q['answer']) if wrong else q['answer']
            card.locator('.book-task-options button').filter(has_text=re.compile('^'+re.escape(option)+'$')).first.tap()
        feedback=page.locator('#book-q-'+q['id']).locator('.book-task-feedback')
        assert ('الإجابة الصحيحة' if wrong else 'أحسنت') in feedback.inner_text(),(q,feedback.inner_text())
    for index,lesson in enumerate(lessons):
        assert page.locator('#book-letter').inner_text()==lesson['char']
        assert page.locator('#book-position').inner_text()==f'{index+1} / 28'
        assert page.locator('#book-exercises .book-task').count()==18
        page.locator('[data-book-tab="learn"]').tap()
        assert page.locator('#book-vocabulary .book-word-card').count()==3
        page.wait_for_function('Array.from(document.querySelectorAll("#book-vocabulary img")).every(n=>n.complete && n.naturalWidth>0)')
        assert page.locator('#book-forms .book-form').count()==4
        assert page.locator('#book-reading .book-reading-row').count()==3
        for vi,w in enumerate(lesson['vocabulary']):
            assert w['ar']==page.locator('#book-vocabulary h3').nth(vi).inner_text()
            play(f'#book-vocabulary article:nth-child({vi+1}) button',w['ar'])
        for li,line in enumerate(lesson['reading']):play(f'[data-book-line="{li}"]',line['ar'])
        page.locator('[data-book-tab="practice"]').tap()
        questions=page.evaluate('(id)=>ArabicBookData.questions(ArabicBookData.lessons.find(l=>l.id===id))',lesson['id'])
        if lesson['char']=='ل':
            q=next(q for q in questions if q['id']=='g0');answer(q,wrong=True)
            page.reload();assert page.locator('#book-q-g0 input').input_value()=='لا يشرب القهوة'
            page.locator('#book-reset').tap()
        for q in questions:answer(q)
        assert page.locator('#book-progress').get_attribute('value')=='18'
        assert '18 صحيحة' in page.locator('#book-score').inner_text()
        assert page.locator('#book-complete').is_visible()
        if index<27:page.locator('#book-next').tap()
        if (index+1)%7==0:print(f'PASS {index+1}/28 lessons: local audio, images, all 18 answers and navigation',flush=True)
    assert page.locator('#book-next').is_disabled()
    assert page.locator('#book-total').inner_text().startswith('504 ')
    page.reload();assert page.locator('#book-total').inner_text().startswith('504 ')
    # Each letter and writing template keeps its own ink; it survives reload.
    page.locator('[data-book-tab="write"]').tap()
    canvas=page.locator('#book-canvas');canvas.scroll_into_view_if_needed()
    rect=canvas.bounding_box();page.mouse.move(rect['x']+20,rect['y']+40);page.mouse.down();page.mouse.move(rect['x']+90,rect['y']+70,steps=5);page.mouse.up()
    saved=page.evaluate('JSON.parse(localStorage.getItem("jisrPracticeV1:book-two"))')
    assert len(saved['writing']['letter-28']['0'])==1
    page.locator('#book-write-choices button').nth(1).tap()
    before=canvas.evaluate('n=>n.toDataURL()')
    page.locator('#book-write-choices button').first.tap()
    ink=canvas.evaluate('n=>n.toDataURL()');assert ink!=before
    page.reload();assert canvas.evaluate('n=>n.toDataURL()')==ink
    page.locator('#book-undo').tap()
    assert not page.evaluate('JSON.parse(localStorage.getItem("jisrPracticeV1:book-two")).writing["letter-28"][0]').__len__()
    page.locator('#book-guide').tap();assert page.locator('#book-guide').get_attribute('aria-pressed')=='false'
    page.locator('#book-clear').tap()
    # Both languages retain completed answers and have no horizontal overflow.
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for tab in ['learn','practice','write']:
            page.locator(f'[data-book-tab="{tab}"]').tap()
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':950});page.wait_for_timeout(60)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,tab,width)
    page.locator('#app-language-select').select_option('ar')
    page.set_viewport_size({'width':390,'height':950});page.wait_for_timeout(350)
    page.locator('.book-index summary').tap();page.locator('#book-index-grid button').nth(22).tap()
    page.locator('[data-book-tab="learn"]').tap();page.locator('#book-translate').tap()
    assert page.locator('#book-reading .book-translation').count()==3
    page.locator('#book-print-button').tap();assert page.evaluate('__printCalls')==1
    page.locator('#book-lesson-title').scroll_into_view_if_needed();page.screenshot(path='/tmp/jisr-book-two-mobile.png',full_page=True)
    page.set_viewport_size({'width':1440,'height':1000});page.wait_for_timeout(350);page.screenshot(path='/tmp/jisr-book-two-desktop.png',full_page=True)
    page.emulate_media(media='print')
    assert page.locator('#book-print').is_visible()
    assert page.locator('#book-print .book-print-page').count()==2
    assert not page.locator('#book-learn').is_visible()
    page.pdf(path='/tmp/jisr-book-two-lam.pdf',format='A4',print_background=True)
    assert not errors,errors
    assert not external,external
    assert not failed,failed
    browser.close()
    print('PASS: 504 workbook questions, 168 offline audio plays, 28 lesson bindings, handwriting/persistence, Arabic/German, responsive layout and print sheet',flush=True)
