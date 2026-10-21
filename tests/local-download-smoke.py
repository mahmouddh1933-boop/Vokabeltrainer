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
        open_page('arabic-youth')
        assert page.locator('#youth-library button').count() == 8
        assert page.locator('.youth-turn').count() == 12
        before = page.evaluate('__plays'); page.locator('#youth-content [data-audio]').first.tap()
        page.wait_for_function('n=>__plays>n', arg=before)
        page.locator('#youth-next').tap(); assert page.locator('#youth-title').inner_text() == 'كيف أستخدم القاموس العربي'
        page.locator('#youth-previous').tap(); assert page.locator('#youth-title').inner_text() == 'في القطار'
        page.locator('[data-youth-tab="reading"]').tap()
        page.locator('#youth-q-reading1 .youth-option').filter(has_text=re.compile('^الناس والبضائع$')).tap()
        assert 'أحسنت' in page.locator('#youth-q-reading1 .youth-task-feedback').inner_text()
        page.locator('[data-youth-tab="vocabulary"]').tap()
        page.locator('#youth-draft-s0').fill('أفضل القطار لأنه مريح.')
        page.locator('#app-language-select').select_option('de')
        assert page.locator('#youth-title').inner_text() == 'في القطار'
        page.locator('#app-language-select').select_option('ar')
        assert page.locator('#youth-draft-s0').input_value() == 'أفضل القطار لأنه مريح.'
        page.emulate_media(media='print')
        assert page.locator('#youth-print').is_visible()
        assert page.locator('#youth-print .youth-print-task').count() == 32
        page.emulate_media(media='screen')
        open_page('youth-training-two')
        assert page.locator('#yt-select option').count() == 53
        assert page.locator('#yt-sources [data-photo]').count() == 31
        page.locator('#yt-select').select_option('a-p03-b2')
        page.locator('#yt-q-1 .yt-input').fill('أنا')
        page.locator('#yt-q-1 .yt-input').press('Enter')
        assert 'أحسنت' in page.locator('#yt-q-1 .yt-feedback').inner_text()
        listening = page.evaluate('ArabicYouthTwoData.activities.find(a=>a.tasks.some(q=>q.audioText)).id')
        page.locator('#yt-select').select_option(listening)
        before = page.evaluate('__plays'); page.locator('#yt-tasks [data-audio]').first.tap()
        page.wait_for_function('n=>__plays>n', arg=before)
        clock = page.evaluate('''()=>{const a=ArabicYouthTwoData.activities.find(a=>a.tasks.some(q=>q.kind==='clock'));const q=a.tasks.find(q=>q.kind==='clock');return {id:a.id,q:q.id,hour:q.hour,minute:q.minute}}''')
        page.locator('#yt-select').select_option(clock['id'])
        card = page.locator('#yt-q-'+clock['q'])
        card.locator('.yt-clock-hour').select_option(str(clock['hour']))
        card.locator('.yt-clock-minute').select_option(str(clock['minute']))
        card.locator('.yt-check').tap()
        assert 'أحسنت' in card.locator('.yt-feedback').inner_text()
        writing = page.evaluate('ArabicYouthTwoData.activities.find(a=>a.tasks.some(q=>q.kind==="open")).id')
        page.locator('#yt-select').select_option(writing)
        page.locator('.yt-draft').first.fill('مسودة محفوظة داخل التدريبات.')
        page.locator('.yt-self-review').first.check()
        page.locator('#app-language-select').select_option('de')
        assert page.locator('.yt-draft').first.input_value() == 'مسودة محفوظة داخل التدريبات.'
        page.locator('#app-language-select').select_option('ar')
        page.locator('#yt-select').select_option('a-p06-b1')
        page.wait_for_function('document.querySelector(".yt-diagram img").naturalWidth>0')
        assert page.locator('.yt-diagram .yt-pin').count() == 16
        page.emulate_media(media='print')
        assert page.locator('#yt-print').is_visible()
        assert page.locator('#yt-print .yt-print-task').count() == 8
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
        print(f'PASS extracted ZIP: three activities + both books + Youth 2, real audio, card flip/navigation, language; mode={mode}; no separate scripts or styles required',flush=True)
    browser.close()
