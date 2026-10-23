"""Exercise the built, curated demo with no external network dependencies."""
import argparse
import json
from pathlib import Path
import re
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--directory', type=Path, required=True)
parser.add_argument('--base-url', default='http://127.0.0.1:8012')
args = parser.parse_args()
base = args.base_url.rstrip('/')
root = args.directory.resolve()
manifest = json.loads((root / 'demo-manifest.json').read_text())
catalog = json.loads((root / 'data/vocab_catalog.json').read_text())
assert len(catalog['lists']) == 6
assert len(catalog['levels']) == 2
assert sum(len(item['words']) for item in catalog['lists']) == 120
for path in root.rglob('*'):
    assert not re.search(r'firebase|auth-session|cloud-sync|youth.*data|book-two-data', path.name)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    for mode in ['hosted', 'offline-assets', 'storage-denied']:
        context = browser.new_context(viewport={'width':390, 'height':900}, is_mobile=True, has_touch=True)
        page = context.new_page()
        errors, external, failed = [], [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: failed.append(response.url) if response.status >= 400 else None)
        def route_request(route):
            parsed = urlsplit(route.request.url)
            if mode == 'offline-assets' and (route.request.resource_type in ['script','stylesheet'] or route.request.url.endswith('vocab_catalog.json')):
                route.abort()
            elif parsed.scheme in ['http','https'] and not route.request.url.startswith(base + '/'):
                external.append(route.request.url)
                route.abort()
            else:
                route.continue_()
        page.route('**/*', route_request)
        if mode == 'storage-denied':
            page.add_init_script('''for (const name of ['localStorage','sessionStorage'])
              Object.defineProperty(window,name,{get(){throw new DOMException('Denied','SecurityError')}});''')
        page.add_init_script('''window.__plays=0;
          const play=HTMLMediaElement.prototype.play;
          HTMLMediaElement.prototype.play=function(){this.addEventListener('playing',()=>__plays++,{once:true});return play.call(this)};''')
        def open_page(name):
            url = base + '/' + name + '.html'
            page.goto(url)
            page.wait_for_function('!!window.AppLanguage && !!document.querySelector(".demo-notice")')
            if page.locator('[data-learner-choice="neutral"]').is_visible():
                page.locator('[data-learner-choice="neutral"]').tap()
            assert page.locator('#auth-blocker, #olive-account').count() == 0
            assert page.evaluate('typeof firebase === "undefined"')
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (mode,name)
        open_page('index')
        assert page.locator('.cefr-level-card').count() == 2
        assert page.locator('.ready-list-button').count() == 3
        assert len(page.evaluate('VocabApp.loadCatalog()')['lists']) == 6
        assert page.locator('.app-sidebar a[href*=youth], .app-sidebar a[href*=book-level]').count() == 0
        page.locator('[data-level-id="A2"]').tap()
        assert page.locator('.ready-list-button').count() == 3
        page.locator('[data-level-id="A1"]').tap()
        page.locator('.ready-list-button').first.tap()
        page.wait_for_url('**/lernseite.html')
        vocab = page.evaluate('VocabApp.getCurrentVocabList()')
        assert len(vocab) == 20
        assert page.locator('#front').inner_text() == vocab[0][0]
        page.locator('#flashcard').tap()
        assert 'flipped' in page.locator('#flashcard').get_attribute('class')
        page.locator('#next-button').tap()
        assert page.locator('#front').inner_text() == vocab[1][0]

        if mode != 'storage-denied':
            open_page('test2')
            for question in page.locator('.question').all():
                arabic = question.locator('.arabic-text').inner_text()
                answer = next(de for ar,de in vocab if ar==arabic)
                for radio in question.locator('input[type=radio]').all():
                    if radio.input_value() == answer:
                        radio.check()
                        break
            page.locator('#submit-test').tap()
            page.wait_for_url('**/ergebnis.html')
            assert page.evaluate('VocabApp.getStats().totalTests') == 1

        open_page('huruf')
        page.locator('#app-language-select').select_option('ar')
        assert page.locator('#letters-grid button').count() == 6
        assert len(page.evaluate('ArabicLetterData.letters')) == 6
        page.locator('#letter-card').tap()
        assert 'flipped' in page.locator('#letter-card').get_attribute('class')
        page.locator('#letter-next').tap()
        assert page.locator('#letter-name').inner_text() == 'الباء'
        assert page.locator('#focused-badge').inner_text() == 'ب'
        plays = page.evaluate('__plays')
        page.locator('#letter-speak').tap()
        page.wait_for_function('n=>__plays>n', arg=plays)
        open_page('letter-tests')
        for mode_name in ['names','forms','missing','listening']:
            page.locator('[data-training-mode="' + mode_name + '"]').tap()
            page.wait_for_function('mode=>document.querySelector(`[data-training-mode="${mode}"]`).getAttribute("aria-pressed")==="true"', arg=mode_name)
            assert page.locator('#training-options button').count() == 4
            assert page.locator('#training-progress').get_attribute('max') == '6'
            page.locator('#training-options button').first.tap()
        open_page('grammar')
        assert page.locator('#grammar-lesson-select option').count() == 3
        assert page.evaluate('ArabicGrammarData.lessons.reduce((n,l)=>n+l.questions.length,0)') == 24
        for option in ['sun-moon','pronouns','gender']:
            page.locator('#grammar-lesson-select').select_option(option)
            page.locator('#grammar-answers button').first.tap()
            assert page.locator('#grammar-next').is_enabled()
            page.locator('#grammar-next').tap()
        open_page('verbs')
        assert page.evaluate('VerbLessonData.verbs.length') == 6
        for tense in ['past','present','imperative']:
            page.locator('[data-tense="' + tense + '"]').tap()
            assert page.locator('#conjugation-body tr').count() == (5 if tense == 'imperative' else 14)
            page.locator('#verb-answers button').first.tap()
        open_page('sounds')
        assert page.evaluate('ArabicPracticeData.soundQuestions().length') == 12
        plays = page.evaluate('__plays')
        page.locator('#sound-listen').tap()
        page.wait_for_function('n=>__plays>n', arg=plays)
        page.locator('#sound-options button').first.tap()
        assert page.locator('#sound-options .is-correct').count() == 1
        open_page('sentences')
        assert page.evaluate('ArabicPracticeData.sentences.length') == 6
        page.locator('#app-language-select').select_option('ar')
        for word in ['أَنَا','طَالِبٌ']:
            page.locator('#sentence-bank button').filter(has_text=re.compile('^'+re.escape(word)+'$')).tap()
        page.locator('#sentence-check').tap()
        assert 'الجملة صحيحة' in page.locator('#sentence-feedback').inner_text()
        if mode != 'storage-denied':
            page.reload()
            assert 'الجملة صحيحة' in page.locator('#sentence-feedback').inner_text()
        open_page('stories')
        assert page.locator('#story-library button').count() == 1
        assert page.locator('#story-level option[value=A2]').count() == 0
        page.locator('#story-options button').first.tap()
        assert page.locator('#story-options .is-correct').count() == 1
        page.locator('#story-translation').tap()
        assert page.locator('.story-german').count() == 6

        if mode == 'hosted':
            for filename in manifest['pages']:
                open_page(filename[:-5])
                for language in ['de','ar']:
                    page.locator('#app-language-select').select_option(language)
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (filename,language)
            open_page('index')
            for width in [320,768,1440]:
                page.set_viewport_size({'width':width,'height':1000})
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            page.screenshot(path='/tmp/huroof-demo-desktop.png',full_page=True)
            page.set_viewport_size({'width':390,'height':900})
            page.wait_for_timeout(400)  # Let the desktop sidebar's exit transition finish.
            page.screenshot(path='/tmp/huroof-demo-mobile.png',full_page=True)
        assert not errors, (mode, errors)
        assert not external, (mode, external)
        assert not failed, (mode, failed)
        print(mode + ': demo content, learning, audio, browser storage, no external requests: passed')
        context.close()
    browser.close()
