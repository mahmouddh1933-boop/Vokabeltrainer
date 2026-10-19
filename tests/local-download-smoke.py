"""Run against an extracted ZIP: no separate JS/CSS, restricted storage and cards."""
from playwright.sync_api import sync_playwright
import argparse, re

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:8001')
base = parser.parse_args().base_url.rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    for mode in ['normal', 'storage-denied', 'older-dom']:
        denied = mode == 'storage-denied'
        context = browser.new_context(viewport={'width':390,'height':900}, is_mobile=True, has_touch=True)
        page = context.new_page(); errors, separate_assets = [], []
        page.on('pageerror', lambda e: errors.append(str(e)))
        if denied:
            page.add_init_script('''for(const key of ['localStorage','sessionStorage'])
                Object.defineProperty(window,key,{configurable:true,get(){throw new DOMException('Denied','SecurityError')}});''')
            page.add_init_script('History.prototype.replaceState=function(){throw new DOMException("Denied","SecurityError")};')
        if mode == 'older-dom':
            page.add_init_script('delete Element.prototype.replaceChildren; String.prototype.replaceAll=undefined;')
        page.add_init_script('''window.__plays=0;const play=HTMLMediaElement.prototype.play;
            HTMLMediaElement.prototype.play=function(){this.addEventListener('playing',()=>__plays++,{once:true});return play.call(this);};''')
        def route_request(route):
            if route.request.resource_type in ['script','stylesheet']:
                separate_assets.append(route.request.url); route.abort()
            elif route.request.url.startswith(base): route.continue_()
            else: route.abort()
        page.route('**/*', route_request)
        def open_page(name):
            assert page.goto(base+'/'+name+'.html').status == 200
            page.locator('#app-language-select').select_option('ar')
            assert page.locator('#lesson-loading').count() == 0
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        open_page('sounds')
        assert page.locator('#sound-options button').count() == 2
        before = page.evaluate('__plays'); page.locator('#sound-listen').tap()
        page.wait_for_function('n=>__plays>n', arg=before)
        page.locator('#sound-options button').first.tap()
        assert page.locator('#sound-options .is-correct').count() == 1
        page.locator('#sound-next').tap(); assert page.locator('#sound-counter').inner_text().startswith('2 /')
        open_page('sentences')
        for word in ['أَنَا','طَالِبٌ']:
            page.locator('#sentence-bank button').filter(has_text=re.compile('^'+re.escape(word)+'$')).tap()
        page.locator('#sentence-check').tap()
        assert 'الجملة صحيحة' in page.locator('#sentence-feedback').inner_text()
        page.locator('#sentence-next').tap(); assert page.locator('#sentence-counter').inner_text().startswith('2 /')
        open_page('stories')
        assert page.locator('#story-library button').count() == 6
        page.locator('#story-translation').tap(); assert page.locator('.story-german').count() == 6
        page.locator('#story-options button').first.tap()
        assert page.locator('#story-options .is-correct').count() == 1
        page.locator('#story-question-next').tap()
        page.locator('#story-next').tap(); assert page.locator('#story-counter').inner_text() == '2 / 6'
        open_page('book-level-two')
        assert page.locator('#book-vocabulary .book-word-card').count() == 3
        assert page.locator('#book-exercises .book-task').count() == 18
        page.locator('#book-next').tap(); assert page.locator('#book-letter').inner_text() == 'ب'
        page.locator('#book-previous').tap(); assert page.locator('#book-letter').inner_text() == 'أ'
        page.evaluate('location.hash="letter-23"')
        page.wait_for_function('document.getElementById("book-letter").textContent==="ل"')
        page.locator('[data-book-tab="practice"]').tap()
        page.locator('#book-q-g0 input').fill('لا أشرب القهوة')
        page.locator('#book-q-g0 input').press('Enter')
        assert 'أحسنت' in page.locator('#book-q-g0 .book-task-feedback').inner_text()
        page.locator('[data-book-tab="write"]').tap()
        assert page.locator('#book-canvas').is_visible()
        page.emulate_media(media='print')
        assert page.locator('#book-print').is_visible()
        assert page.locator('#book-print .book-print-page').count() == 2
        page.emulate_media(media='screen')
        open_page('huruf')
        page.locator('#letter-card').tap(); assert 'flipped' in page.locator('#letter-card').get_attribute('class')
        page.locator('#letter-card').tap(); assert 'flipped' not in page.locator('#letter-card').get_attribute('class')
        page.locator('#letter-next').tap(); assert page.locator('#letter-big').inner_text() == 'ب'
        page.locator('#letter-previous').tap(); assert page.locator('#letter-big').inner_text() == 'أ'
        page.locator('#app-language-select').select_option('de')
        assert 'Weiter' in page.locator('#letter-next').inner_text()
        if denied: assert page.locator('.storage-notice').count() == 1
        assert not errors, errors
        assert not separate_assets, separate_assets
        context.close()
        print(f'PASS extracted ZIP: three activities + second-level book, real audio, card flip/navigation, language; mode={mode}; no separate scripts or styles required',flush=True)
    browser.close()
