from playwright.sync_api import sync_playwright, expect
import argparse
parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8000')
args=parser.parse_args()
base=args.base_url.rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1100})
    page.add_init_script('localStorage.setItem("oliveLearnerThemeV1","neutral")')
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(base+'/huruf.html')
    for letter_index in range(28):
        page.locator('#letters-grid button').nth(letter_index).click()
        page.locator('#letter-card').click()
        assert page.locator('.letters-form').count()==4
        assert page.locator('.letter-example-word .letter-target').count()==4
        assert page.locator('#letter-card-word .letter-target').count()==1
        target=page.locator('#letter-big').inner_text()
        assert page.locator('.letter-example-word .letter-target').all_text_contents()==[target]*4
        examples=page.evaluate('letter => ArabicLetterExamples.examples[letter]',target)
        assert page.locator('.letter-example-word').all_text_contents()==[e['word'] for e in examples]
        assert page.locator('.letter-connection-note').count()==1
    page.locator('#letters-grid button').nth(1).click()
    page.locator('#letter-card').click()
    assert page.locator('.letter-example-word').all_text_contents()==['بطة','جبل','باب','كلب']
    assert 'ا' in page.locator('.letter-connection-note').inner_text()
    page.locator('#app-language-select').select_option('de')
    assert page.locator('#letter-card').get_attribute('aria-pressed')=='true'
    assert page.locator('.letters-form-label').first.inner_text()=='Am Wortanfang'
    assert page.locator('.letter-example-meaning').all_text_contents()==['Ente','Berg','Tür','Hund']
    page.locator('#app-language-select').select_option('ar')
    assert page.locator('#letter-card').get_attribute('aria-pressed')=='true'
    page.locator('.letters-card-wrap').screenshot(path='/tmp/jisr-letter-examples.png')
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for width in [320,390,768,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            page.wait_for_timeout(300)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('letters',language,width)
    page.goto(base+'/grammar.html#sun-moon')
    page.locator('#app-language-select').select_option('ar')
    assert page.locator('#grammar-topics a').count()==37
    assert page.locator('#grammar-lesson-select option').count()==37
    assert page.locator('.app-sidebar a[aria-current="page"]').get_attribute('href')=='grammar.html'
    lessons=page.evaluate('ArabicGrammarData.lessons')
    assert len(lessons)==37
    # Filters, empty results, recovery, diacritic-insensitive and German search.
    page.locator('#grammar-category').select_option('spelling')
    assert page.locator('#grammar-lesson-select option').count()==6
    page.locator('#grammar-search').fill('مُتَوَسِّطَة')
    assert page.locator('#grammar-lesson-select').input_value()=='hamza-medial'
    assert page.locator('#grammar-lesson-select option').count()==2
    page.locator('#app-language-select').select_option('de')
    assert page.locator('#grammar-category').input_value()=='spelling'
    assert page.locator('#grammar-search').input_value()=='مُتَوَسِّطَة'
    page.locator('#grammar-search').fill('nothing-xyz')
    assert page.locator('#grammar-catalog-empty').is_visible()
    assert page.locator('#grammar-lesson').is_hidden()
    assert page.locator('#grammar-lesson-select').is_disabled()
    page.locator('#grammar-clear-search').click()
    assert page.locator('#grammar-lesson-select option').count()==37
    page.locator('#grammar-search').fill('Partizip')
    assert page.locator('#grammar-lesson-select option').count()==3
    assert set(page.locator('#grammar-lesson-select option').evaluate_all('(options)=>options.map(o=>o.value)'))=={'active-participle','passive-participle','intensive-participle'}
    page.locator('#grammar-search').fill('')
    page.locator('#app-language-select').select_option('ar')
    # Deep links to a lesson outside an active filter reset the filter.
    page.locator('#grammar-category').select_option('spelling')
    page.evaluate('location.hash="five-nouns"')
    expect(page.locator('#grammar-category')).to_have_value('all')
    page.locator('#grammar-index summary').click()
    page.locator('#grammar-topics a[href="#sun-moon"]').click()
    expect(page.locator('#lesson-title')).to_have_text(next(l for l in lessons if l['id']=='sun-moon')['title']['ar'])
    for lesson in lessons:
        page.locator('#grammar-lesson-select').select_option(lesson['id'])
        expect(page.locator('#lesson-title')).to_have_text(lesson['title']['ar'])
        for language in ['ar','de','ar']:
            page.locator('#app-language-select').select_option(language)
            assert page.locator('#lesson-title').inner_text()==lesson['title'][language]
            assert page.locator('#lesson-intro').inner_text()==lesson['intro'][language]
        assert page.locator('#grammar-previous').is_disabled()
        for index,question in enumerate(lesson['questions']):
            assert page.locator('#grammar-next').is_disabled()
            correct=question['correct']
            selected=(correct+1)%4 if index==0 else correct
            page.locator('#grammar-answers button').nth(selected).click()
            assert page.locator('#grammar-answers button:disabled').count()==4
            expected=question['options'][correct]
            assert page.locator('#grammar-answers .is-correct').inner_text()==(expected if isinstance(expected,str) else expected['ar'])
            assert question['explanation']['ar'] in page.locator('#grammar-feedback').inner_text()
            assert page.locator('#grammar-progress').get_attribute('value')==str(index+1)
            assert page.locator('#grammar-next').is_enabled()
            if index==0:
                page.locator('#app-language-select').select_option('de')
                assert question['explanation']['de'] in page.locator('#grammar-feedback').inner_text()
                page.locator('#app-language-select').select_option('ar')
            if index==1:
                page.locator('#grammar-previous').click()
                assert page.locator('#grammar-answers button:disabled').count()==4
                assert page.locator('#grammar-progress').get_attribute('value')=='2'
                page.locator('#grammar-next').click()
                assert question['explanation']['ar'] in page.locator('#grammar-feedback').inner_text()
            if index<len(lesson['questions'])-1:page.locator('#grammar-next').click()
        assert page.locator('#grammar-score').inner_text()==f'{len(lesson["questions"])-1} من {len(lesson["questions"])} إجابات صحيحة',lesson['id']
        other='pronouns' if lesson['id']=='sun-moon' else 'sun-moon'
        page.locator('#grammar-lesson-select').select_option(other)
        other_lesson=next(item for item in lessons if item['id']==other)
        expect(page.locator('#lesson-title')).to_have_text(other_lesson['title']['ar'])
        page.locator('#grammar-lesson-select').select_option(lesson['id'])
        expect(page.locator('#lesson-title')).to_have_text(lesson['title']['ar'])
        assert page.locator('#grammar-score').inner_text()==f'{len(lesson["questions"])-1} من {len(lesson["questions"])} إجابات صحيحة',lesson['id']
        page.locator('#grammar-next').click()
        assert page.locator('#grammar-score').inner_text()=='0 من 0 إجابات صحيحة'
        assert page.locator('#grammar-progress').get_attribute('value')=='0'
        for language in ['ar','de']:
            page.locator('#app-language-select').select_option(language)
            for width in [320,768,1440]:
                page.set_viewport_size({'width':width,'height':1000})
                page.wait_for_timeout(150)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(lesson['id'],language,width)
                if width<=640:
                    assert page.locator('.topbar-left').bounding_box()['height']<=65
                    assert page.locator('.menu-toggle').bounding_box()['width']<=44
                assert page.locator('.grammar-table [lang=ar]').evaluate_all('(cells)=>cells.every(cell=>cell.scrollWidth<=cell.clientWidth+1)'),('Clipped Arabic text',lesson['id'],language,width)
        page.locator('#app-language-select').select_option('ar')
    page.goto(base+'/grammar.html#hamza-medial')
    page.locator('#app-language-select').select_option('ar')
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(350)
    page.screenshot(path='/tmp/jisr-foundations.png')
    page.set_viewport_size({'width':390,'height':844})
    page.wait_for_timeout(350)
    page.screenshot(path='/tmp/jisr-foundations-mobile.png')
    page.route('https://cdn.jsdelivr.net/**',lambda route:route.abort())
    page.goto(base+'/index.html')
    assert page.locator('.foundation-home-link').count()==6
    page.locator('.foundation-home-link[href="grammar.html#number"]').click()
    page.wait_for_url('**/grammar.html#number')
    assert page.locator('#lesson-title').inner_text()=='المفرد والمثنّى والجمع'
    assert not errors,errors
    print('PASS: 112 highlighted letter examples, language switching, 37 lessons, 464 questions with feedback and reset, search/category filters, previous-question review, navigation and responsive DE/AR layouts; no JavaScript errors')
    browser.close()
