from playwright.sync_api import sync_playwright
import argparse
parser = argparse.ArgumentParser(description='Browser smoke test for Jisr')
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--xlsx-js', help='Optional XLSX 0.18.5 file downloaded with TLS verification')
args = parser.parse_args()
base_url = args.base_url.rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    page = browser.new_page()
    if args.xlsx_js:
        page.route('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', lambda route: route.fulfill(path=args.xlsx_js, content_type='application/javascript'))
    errors=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    response=page.goto(base_url + '/index.html')
    assert response.status == 200
    page.locator('#language-welcome button').filter(has_text='Deutsch').click()
    assert page.locator('html').get_attribute('lang')=='de'
    page.wait_for_function('typeof XLSX !== "undefined"')
    page.locator('#hero-start').click()
    page.wait_for_selector('.ready-list-button')
    assert page.locator('.cefr-level-card').count()==2
    catalog=page.evaluate('VocabApp.loadCatalog()')
    print('Catalog:', len(catalog['lists']), 'lists')
    page.locator('.ready-list-button').first.click()
    page.wait_for_url('**/lernseite.html')
    vocab=page.evaluate('VocabApp.getCurrentVocabList()')
    assert len(vocab)>0
    assert page.locator('#front').inner_text()==vocab[0][0]
    page.locator('#flashcard').click()
    assert 'flipped' in page.locator('#flashcard').get_attribute('class')
    page.locator('#next-button').click()
    assert page.locator('#front').inner_text()==vocab[1][0]
    page.goto(base_url + '/test2.html')
    questions=page.locator('.question')
    count=questions.count()
    assert count>0
    for i in range(count):
        question=questions.nth(i)
        arabic=question.locator('.arabic-text').inner_text()
        answer=next(de for ar,de in vocab if ar==arabic)
        radios=question.locator('input[type=radio]')
        for j in range(radios.count()):
            if radios.nth(j).input_value()==answer:
                radios.nth(j).check()
                break
        else: raise AssertionError('Correct option missing')
    page.locator('#submit-test').click()
    page.wait_for_url('**/ergebnis.html')
    assert page.locator('.result-correct').count()==count
    assert page.evaluate('VocabApp.getStats().totalTests')==1
    page.reload()
    assert page.locator('.result-correct').count()==count
    page.locator('#show-stats').click()
    page.wait_for_url('**/stats.html')
    assert page.evaluate('VocabApp.getStats().correctAnswers')==count
    print('Learning cards + multiple choice + persisted results/stats:',count,'correct answers')
    page.goto(base_url + '/huruf.html')
    assert page.locator('svg, img').count()>0
    print('Alphabet page loaded')
    page.goto(base_url + '/index.html')
    page.wait_for_function('typeof XLSX !== "undefined"')
    workbook=page.evaluate('''() => {
        const book=XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([['Arabisch','Deutsch'],['بيت','Haus'],['كتاب','Buch']]),'Words');
        return Array.from(new Uint8Array(XLSX.write(book,{bookType:'xlsx',type:'array'})));
    }''')
    page.locator('#show-excel-button').click()
    page.locator('#file-upload').set_input_files({'name':'smoke.xlsx','mimeType':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','buffer':bytes(workbook)})
    page.wait_for_selector('#learn-button:visible')
    assert page.evaluate('VocabApp.getCurrentVocabList()')==[['بيت','Haus'],['كتاب','Buch']]
    print('Excel import: 2 word pairs')
    assert not errors, errors
    page.locator('#app-language-select').select_option('ar')
    assert page.locator('html').get_attribute('dir') == 'rtl'
    page.wait_for_function("document.querySelector('.ready-list-button strong').textContent.includes('التحيات')")
    page.locator('#app-language-select').select_option('de')
    page.wait_for_function("document.querySelector('.ready-list-button strong').textContent.includes('Begrüßung')")
    for width in [390, 768, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        page.wait_for_timeout(300)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Horizontal overflow at {width}px'
    page.set_viewport_size({'width': 390, 'height': 844})
    page.locator('.menu-toggle').click()
    assert page.locator('.menu-toggle').get_attribute('aria-expanded') == 'true'
    page.keyboard.press('Escape')
    assert page.locator('.menu-toggle').get_attribute('aria-expanded') == 'false'
    for target in ['lernseite.html','test.html','test1.html','test2.html','test3.html','test4.html','test5.html','test6.html','review.html','stats.html','huruf.html','verbs.html','ergebnis.html']:
        page.goto(base_url + '/' + target)
        assert page.locator('.app-sidebar').count() == 1
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), target
    assert not errors, errors
    print('PASS; DE/AR round trip, responsive layouts, mobile navigation, all learning/test pages; no browser JavaScript errors')
    browser.close()
