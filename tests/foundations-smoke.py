from playwright.sync_api import sync_playwright, expect
import argparse
parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8000')
args=parser.parse_args()
base=args.base_url.rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1100})
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
    assert page.locator('#grammar-topics a').count()==5
    assert page.locator('.app-sidebar a[aria-current="page"]').get_attribute('href')=='grammar.html'
    lessons=page.evaluate('ArabicGrammarData.lessons')
    for lesson in lessons:
        page.locator(f'#grammar-topics a[href="#{lesson["id"]}"]').click()
        page.wait_for_function('id => location.hash === "#"+id',arg=lesson['id'])
        for language in ['ar','de','ar']:
            page.locator('#app-language-select').select_option(language)
            assert page.locator('#lesson-title').inner_text()==lesson['title'][language]
            assert page.locator('#lesson-intro').inner_text()==lesson['intro'][language]
        for index,question in enumerate(lesson['questions']):
            assert page.locator('#grammar-next').is_disabled()
            correct=question['correct']
            # Deliberately answer the first question incorrectly to exercise feedback.
            selected=(correct+1)%4 if index==0 else correct
            page.locator('#grammar-answers button').nth(selected).click()
            assert page.locator('#grammar-answers button:disabled').count()==4
            assert page.locator('#grammar-answers .is-correct').inner_text()==(question['options'][correct] if isinstance(question['options'][correct],str) else question['options'][correct]['ar'])
            assert question['explanation']['ar'] in page.locator('#grammar-feedback').inner_text()
            assert page.locator('#grammar-next').is_enabled()
            page.locator('#app-language-select').select_option('de')
            assert question['explanation']['de'] in page.locator('#grammar-feedback').inner_text()
            page.locator('#app-language-select').select_option('ar')
            if index<3:page.locator('#grammar-next').click()
        assert page.locator('#grammar-score').inner_text()=='3 من 4 إجابات صحيحة', (lesson['id'], page.locator('#grammar-score').inner_text(),page.locator('#grammar-question-number').inner_text())
        # A round trip to another topic preserves this topic's exercise result.
        other='pronouns' if lesson['id']=='sun-moon' else 'sun-moon'
        page.locator(f'#grammar-topics a[href="#{other}"]').click()
        other_lesson=next(item for item in lessons if item['id']==other)
        expect(page.locator('#lesson-title')).to_have_text(other_lesson['title']['ar'])
        page.locator(f'#grammar-topics a[href="#{lesson["id"]}"]').click()
        expect(page.locator('#lesson-title')).to_have_text(lesson['title']['ar'])
        assert page.locator('#grammar-score').inner_text()=='3 من 4 إجابات صحيحة', (lesson['id'], page.locator('#grammar-score').inner_text(),page.locator('#grammar-question-number').inner_text())
        page.locator('#grammar-next').click()
        assert page.locator('#grammar-score').inner_text()=='0 من 0 إجابات صحيحة'
        for language in ['ar','de']:
            page.locator('#app-language-select').select_option(language)
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':1000})
                page.wait_for_timeout(300)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(lesson['id'],language,width)
                assert page.locator('.grammar-table [lang=ar]').evaluate_all('(cells)=>cells.every(cell=>cell.scrollWidth<=cell.clientWidth+1)'), ('Clipped Arabic table text',lesson['id'],language,width)
    page.goto(base+'/grammar.html#sun-moon')
    page.locator('#app-language-select').select_option('ar')
    assert page.locator('.grammar-letter-set span').count()==28
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(350)
    page.screenshot(path='/tmp/jisr-foundations.png')
    page.route('https://cdn.jsdelivr.net/**',lambda route:route.abort())
    page.goto(base+'/index.html')
    assert page.locator('.foundation-home-link').count()==5
    page.locator('.foundation-home-link[href="grammar.html#number"]').click()
    page.wait_for_url('**/grammar.html#number')
    assert page.locator('#lesson-title').inner_text()=='المفرد والمثنّى والجمع'
    assert not errors,errors
    print('PASS: 112 highlighted letter examples, language switching, five lessons, 20 questions with feedback and reset, navigation and responsive DE/AR layouts; no JavaScript errors')
    browser.close()
