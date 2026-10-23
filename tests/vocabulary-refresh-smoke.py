"""Check learner-facing changes, phone geometry, localized number cues and all new illustrations."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:8026')
parser.add_argument('--inline', action='store_true')
args = parser.parse_args()
base = args.base_url.rstrip('/')
catalog = json.loads((Path(__file__).resolve().parents[1]/'data/vocab_catalog.json').read_text())
lists = {item['id']: item for item in catalog['lists']}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':390, 'height':844}, is_mobile=True, has_touch=True)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');")
    def route(r):
        if not r.request.url.startswith(base+'/'): r.abort()
        elif args.inline and r.request.resource_type in ['script','stylesheet']: r.abort()
        else: r.continue_()
    page.route('**/*', route)
    page.goto(base+'/index.html')
    assert page.locator('main > section').evaluate_all('ns=>ns.map(n=>n.querySelector("h2").dataset.ar)') == [
        'مسار تعلّمك، خطوة بعد خطوة', 'لست متأكدًا من أين تبدأ؟', 'الاختبارات الخاصة بالأستاذ محمود بركات']
    assert page.locator('#overall-learning-path').evaluate('n=>n.compareDocumentPosition(document.querySelector(".placement-entry")) & Node.DOCUMENT_POSITION_FOLLOWING')
    expect(page.locator('#overall-learning-path > li')).to_have_count(7)
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for width in [320,390,768,1440]:
            page.set_viewport_size({'width':width,'height':844})
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.goto(base+'/exams.html')
    for dest in ['placement.html','test.html','letter-tests.html']:
        expect(page.locator('#exam-catalog-panel a[href="'+dest+'"]')).to_have_count(0)
    expect(page.locator('[data-start-exam]')).to_have_count(20)

    def select(words, ident):
        page.evaluate('(v)=>VocabApp.saveVocabList(v.words,{type:"ready-list",id:v.id})', {'words':words,'id':ident})
        page.goto(base+'/lernseite.html')
        expect(page.locator('#lesson-loading')).to_have_count(0)

    numbers = [[w['ar'],w['de']] for w in lists['a1_05']['words']]
    select(numbers, 'a1_05')
    expected = list(range(14))+[20,30,40,50,100,1000]
    digits = str.maketrans('0123456789','٠١٢٣٤٥٦٧٨٩')
    page.set_viewport_size({'width':390,'height':844})
    for number in expected:
        expect(page.locator('#front .vocab-number')).to_have_text(str(number).translate(digits))
        expect(page.locator('#back .vocab-number')).to_have_text(str(number))
        # The card still flips and can be navigated without changing the learning words.
        page.locator('#flashcard').tap()
        expect(page.locator('#flashcard')).to_have_class('flashcard flipped')
        page.locator('#next-button').tap()
    assert page.evaluate('VocabApp.getCurrentVocabList()')[0] == numbers[0]
    page.locator('#flashcard').focus();page.keyboard.press('Enter')
    expect(page.locator('#flashcard')).to_have_class('flashcard flipped')

    words = [[w['ar'],w['de']] for ident in ['a1_09','a1_10','a1_14','a1_15','a1_20'] for w in lists[ident]['words']]
    select(words, 'picture-check')
    for word in words:
        expect(page.locator('#front')).to_have_text(word[0])
        expect(page.locator('#back')).to_have_text(word[1])
        expect(page.locator('.vocab-number')).to_have_count(0)
        page.wait_for_function('document.querySelector(".vocab-picture")?.naturalWidth>0')
        page.locator('#next-button').tap()
    select([['مُعَلِّمٌ','der Lehrer']], 'no-picture')
    expect(page.locator('.vocab-picture,.vocab-number')).to_have_count(0)
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for width in [320,390,768,1440]:
            page.set_viewport_size({'width':width,'height':844})
            page.mouse.move(0, 0)
            page.wait_for_timeout(300)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            palette = page.locator('#prev-button,#review-button,#pronounce-button').evaluate_all('ns=>ns.map(n=>getComputedStyle(n).backgroundColor)')
            assert len(set(palette)) == 1, palette
            expect(page.locator('#back')).to_have_css('background-color','rgb(228, 236, 214)')
            expect(page.locator('#back')).to_have_css('color','rgb(35, 73, 54)')
    assert not errors, errors
    browser.close()
print('PASS: home order, removed shortcuts, 20 localized number cards, 100 matching tiny pictures, mobile layout and shared button palette')
