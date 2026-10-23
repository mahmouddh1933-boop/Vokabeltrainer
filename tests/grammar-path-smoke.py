"""Exercise learning stages, saved grammar answers, letter supplements and tiny picture cards."""
import argparse, re
from playwright.sync_api import sync_playwright, expect

parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8017')
parser.add_argument('--quick',action='store_true')
args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':390,'height':900},is_mobile=True,has_touch=True)
    errors,external,failed=[],[],[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
    page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else (external.append(r.request.url),r.abort())[-1])
    page.add_init_script('''localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');
      window.__plays=0;window.__lastAudio=null;const play=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){window.__lastAudio=this.src;this.addEventListener('playing',()=>__plays++,{once:true});return play.call(this)};''')
    page.goto(base+'/grammar.html')
    assert page.locator('#grammar-stages button').count()==4
    assert page.locator('#grammar-lesson-select option').count()==37
    assert page.locator('#grammar-lesson-select').input_value()=='word-classes'
    lessons=page.evaluate('ArabicGrammarData.lessons')
    for stage,total in [('start',9),('build',8),('develop',9),('advance',11)]:
        page.locator('[data-grammar-stage='+stage+']').tap()
        assert page.locator('#grammar-lesson-select option').count()==total
    page.locator('#grammar-stage').select_option('all')
    page.locator('#grammar-category').select_option('spelling')
    assert page.locator('#grammar-lesson-select option').count()==6
    page.locator('#grammar-search').fill('متوسطة')
    assert page.locator('#grammar-lesson-select option').count()==2
    page.locator('#grammar-search').fill('لا توجد نتيجة xyz')
    assert page.locator('#grammar-catalog-empty').is_visible()
    page.locator('#grammar-clear-search').tap()
    assert page.locator('#grammar-lesson-select option').count()==37
    start_tests=page.evaluate('VocabApp.getStats().totalTests')
    new_ids=['ta-endings','alif-endings','case-basics','subject-object','circumstantial','tamyiz','hamza-exceptions']
    if args.quick:new_ids=['circumstantial']
    for lesson_id in new_ids:
        lesson=next(l for l in lessons if l['id']==lesson_id)
        page.locator('#grammar-lesson-select').select_option(lesson_id)
        expect(page.locator('#lesson-title')).to_have_text(lesson['title']['ar'])
        for index,q in enumerate(lesson['questions']):
            page.locator('#grammar-answers button').nth(q['correct']).tap()
            assert page.locator('#grammar-answers .is-correct').count()==1
            if index<len(lesson['questions'])-1:page.locator('#grammar-next').tap()
        assert page.locator('#grammar-score').inner_text()=='12 من 12 إجابات صحيحة'
    assert page.evaluate('VocabApp.getStats().totalTests')==start_tests
    page.reload()
    assert page.locator('#grammar-score').inner_text()=='12 من 12 إجابات صحيحة'
    assert f'{len(new_ids)} من 37' in page.locator('#grammar-path-progress').inner_text()
    page.locator('#grammar-lesson-select').select_option('sun-moon')
    expect(page.locator('#lesson-title')).to_have_text('اللام الشمسية والقمرية')
    correct=next(l for l in lessons if l['id']=='sun-moon')['questions'][0]['correct']
    page.locator('#grammar-answers button').nth(correct).tap();page.locator('#grammar-next').tap()
    page.goto(base+'/grammar.html')
    assert page.locator('#grammar-lesson-select').input_value()=='sun-moon'
    assert page.locator('#grammar-question-number').inner_text()=='السؤال 2 من 12'
    page.locator('#grammar-stage').select_option('advance')
    page.locator('#grammar-lesson-select').select_option('circumstantial')
    expect(page.locator('#grammar-prerequisites a').first).to_have_attribute('href','#subject-object')
    page.locator('#grammar-prerequisites a').first.tap()
    expect(page.locator('#grammar-lesson-select')).to_have_value('subject-object')
    assert page.locator('#grammar-stage').input_value()=='all'
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for width in [320,768,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('grammar',language,width)
    page.set_viewport_size({'width':390,'height':900})
    page.goto(base+'/huruf.html')
    for index in range(28):
        page.locator('#letters-grid button').nth(index).tap()
        if index in [0,2]:
            expected=8 if index==0 else 3
            assert page.locator('.letter-related-card').count()==expected
            assert page.locator('#letter-related').is_visible()
            for card in page.locator('.letter-related-card').all():
                assert card.locator('.letter-target').count()==1
                before=page.evaluate('__plays');card.locator('button').tap()
                page.wait_for_function('n=>__plays>n',arg=before)
                assert '/audio/letter-related/' in page.evaluate('__lastAudio')
        else:assert page.locator('#letter-related').is_hidden()
    page.locator('#letters-grid button').nth(0).tap()
    page.locator('#app-language-select').select_option('de')
    assert 'Hamza' in page.locator('#letter-related-title').inner_text()
    page.wait_for_timeout(400)  # Finish the existing RTL/LTR sidebar transition.
    page.locator('#letter-related').scroll_into_view_if_needed()
    page.screenshot(path='/tmp/olive-related-mobile.png')
    page.goto(base+'/index.html')
    # The optional Excel CDN is blocked; the bundled catalogue must still work.
    page.evaluate('''async()=>{const catalog=await VocabApp.loadCatalog();const list=catalog.lists.find(l=>l.id==='a1_12');VocabApp.saveVocabList(list.words.map(w=>[w.ar,w.de]),{type:'ready-list',id:list.id})}''')
    page.goto(base+'/lernseite.html')
    assert page.locator('.vocab-picture').count()==1
    page.locator('#flashcard').tap()
    assert page.locator('#back').inner_text()=='die Äpfel'
    for _ in range(7):page.locator('#next-button').tap()
    page.locator('#flashcard').tap()
    assert page.locator('#back').inner_text()=='der Granatapfel'
    assert page.locator('.vocab-picture').get_attribute('src')=='images/vocab/a1_12-08.svg'
    page.wait_for_function('document.querySelector(".vocab-picture").naturalWidth>0')
    page.locator('#flashcard').screenshot(path='/tmp/olive-picture-card.png')
    assert page.evaluate('''async()=>{const files=[...new Set(Object.values(VocabPictures.mappings))];const result=await Promise.all(files.map(src=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image.naturalWidth>0);image.onerror=()=>resolve(false);image.src=src})));return result.every(Boolean)}''')
    page.evaluate("VocabApp.saveVocabList([['مَسْؤُولِيَّةٌ','die Verantwortung']],{type:'excel'})")
    page.reload();assert page.locator('.vocab-picture').count()==0
    assert page.locator('#back').inner_text()=='die Verantwortung'
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for width in [320,390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('cards',language,width)
    assert not errors,errors
    assert not failed,failed
    assert all('xlsx' in url for url in external),external
    print('PASS: 4 stages, 37 lessons, new question banks, saved answers/resume, prerequisites, 11 local sample audios, 112 decoded SVGs, German card images, unknown-word fallback and AR/DE responsive layouts.')
    browser.close()
