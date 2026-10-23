"""Mobile, keyboard-accessible learning flows with real, offline audio playback."""
from playwright.sync_api import sync_playwright, expect
import argparse, re, unicodedata

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
base = parser.parse_args().base_url.rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width':390,'height':900}, is_mobile=True, has_touch=True)
    page = context.new_page()
    errors, external = [], []
    page.on('pageerror', lambda e: errors.append(str(e)))
    def route_request(route):
        if route.request.url.startswith(base): route.continue_()
        else:
            external.append(route.request.url)
            route.abort()
    page.route('**/*', route_request)
    page.add_init_script('''window.__playing=0;window.__audio=[];
      const play=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){
        window.__audio.push({src:this.src,gesture:navigator.userActivation.isActive});
        this.addEventListener('playing',()=>window.__playing++,{once:true});return play.call(this);
      };''')
    def play(selector, expected=None):
        before = page.evaluate('__playing')
        page.locator(selector).tap()
        page.wait_for_function('before=>__playing>before', arg=before)
        actual = page.evaluate('__audio.at(-1)')
        assert actual['gesture'] and '/audio/' in actual['src'], actual
        if expected: assert actual['src'].endswith(expected), (actual, expected)
        return actual['src']
    def language(lang): page.locator('#app-language-select').select_option(lang)
    def layout():
        for lang in ['ar','de']:
            language(lang)
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':900})
                page.wait_for_timeout(70)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (page.url,lang,width)
        page.set_viewport_size({'width':390,'height':900}); language('ar')
        page.wait_for_timeout(350)

    assert page.goto(base+'/sounds.html').status == 200
    language('ar')
    assert page.locator('.app-sidebar a[aria-current="page"]').get_attribute('href') == 'letters.html'
    assert page.locator('#sound-groups button').count() == 7
    assert page.locator('#sound-options button:disabled').count() == 2
    data = page.evaluate('({questions:ArabicPracticeData.soundQuestions(),audio:ArabicPracticeData.audio})')
    for index in range(36):
        src = play('#sound-listen')
        text = next(text for text,file in data['audio'].items() if src.endswith(file))
        q = next(q for q in data['questions'] if unicodedata.normalize('NFC', q['word']) == text)
        options = page.locator('#sound-options button')
        options.nth(1-q['correct'] if index == 0 else q['correct']).tap()
        assert page.locator('#sound-options .is-correct strong').inner_text() == q['word']
        assert options.locator(':scope:disabled').count() == 2
        if index == 0:
            feedback = page.locator('#sound-feedback').inner_text()
            language('de'); assert 'Richtige Antwort' in page.locator('#sound-feedback').inner_text()
            language('ar'); assert page.locator('#sound-feedback').inner_text() == feedback
            page.reload(); assert page.locator('#sound-options button:disabled').count() == 2
        if index < 35: page.locator('#sound-next').tap()
    assert page.locator('#sound-summary').is_visible()
    assert page.locator('#sound-score').inner_text().startswith('35 صحيحة من 36')
    page.locator('#sound-groups button').nth(1).tap()
    assert page.locator('#sound-counter').inner_text().endswith('/ 6')
    page.locator('#sound-restart').tap()
    assert page.locator('#sound-score').inner_text().startswith('0 صحيحة من 0')
    page.locator('summary').tap()
    assert page.locator('#sound-examples .word-listen').count() == 6
    play('#sound-examples .word-listen:first-child')
    layout(); page.screenshot(path='/tmp/jisr-sounds-mobile.png',full_page=True)
    print('PASS sounds: 36 real-audio answers, wrong feedback, language, reload, filters, reset and examples',flush=True)

    page.goto(base+'/sentences.html'); language('ar')
    sentences = page.evaluate('ArabicPracticeData.sentences')
    for index,q in enumerate(sentences):
        if index == 0:
            # An incorrect full answer is editable; the first-attempt score cannot be inflated.
            for word in reversed(q['words']): page.locator('#sentence-bank button').filter(has_text=re.compile('^'+re.escape(word)+'$')).tap()
            page.locator('#sentence-check').tap()
            assert 'حاول مجددًا' in page.locator('#sentence-feedback').inner_text()
            page.reload(); assert page.locator('#sentence-answer button').count() == len(q['words'])
            page.locator('#sentence-answer button').first.tap()
            assert page.locator('#sentence-answer button').count() == len(q['words'])-1
            page.locator('#sentence-clear').tap()
        for word in q['words']:
            page.locator('#sentence-bank button:enabled').filter(has_text=re.compile('^'+re.escape(word)+'$')).first.tap()
        page.locator('#sentence-check').tap()
        assert 'الجملة صحيحة' in page.locator('#sentence-feedback').inner_text()
        assert page.locator('#sentence-answer button:disabled').count() == len(q['words'])
        play('#sentence-listen')
        if index == 0:
            language('de'); assert 'Der Satz stimmt' in page.locator('#sentence-feedback').inner_text()
            language('ar')
        if index < len(sentences)-1: page.locator('#sentence-next').tap()
    assert page.locator('#sentence-summary').is_visible()
    assert '119 صحيحة من المحاولة الأولى' in page.locator('#sentence-score').inner_text()
    page.locator('#sentence-level').select_option('A1'); page.locator('#sentence-restart').tap()
    page.locator('#sentence-hint').tap()
    assert page.locator('#sentence-answer button').count() == 1
    page.locator('#sentence-bank button:enabled').first.tap(); page.locator('#sentence-check').tap()
    assert '0 صحيحة من المحاولة الأولى' in page.locator('#sentence-score').inner_text()
    page.locator('#sentence-next').tap()
    page.reload(); assert page.locator('#sentence-counter').inner_text() == '2 / 60 · A1'
    page.locator('#sentence-level').select_option('A2')
    assert page.locator('#sentence-counter').inner_text() == '1 / 60 · A2'
    layout(); page.screenshot(path='/tmp/jisr-sentences-mobile.png',full_page=True)
    print('PASS sentences: 120 solutions and audio clips, wrong attempt/editing, hint scoring, persistence, level filters',flush=True)

    page.goto(base+'/stories.html'); language('ar')
    stories = page.evaluate('ArabicPracticeData.stories')
    assert page.locator('#story-library button').count() == 6
    for index,story in enumerate(stories):
        page.locator('#story-library button').nth(index).tap()
        assert page.locator('#story-lines .story-line').count() == 6
        assert page.locator('#story-vocabulary button').count() == 4
        assert page.locator('.story-german').count() == 0
        page.locator('#story-translation').tap()
        assert page.locator('.story-german').count() == 6
        language('de'); assert 'ausblenden' in page.locator('#story-translation').inner_text()
        language('ar'); assert 'إخفاء' in page.locator('#story-translation').inner_text()
        for line in range(6): play(f'#story-lines button[data-line="{line}"]')
        for word in range(4): play(f'#story-vocabulary button:nth-child({word+1})')
        for qi,q in enumerate(story['questions']):
            page.locator('#story-options button').nth((q['correct']+1)%3 if qi == 0 else q['correct']).tap()
            assert page.locator('#story-options .is-correct strong').inner_text() == q['options'][q['correct']]['ar']
            assert page.locator('#story-lines .is-evidence').get_attribute('id') == f'story-line-{q["evidence"]}'
            if qi < 3: page.locator('#story-question-next').tap()
        assert page.locator('#story-summary').is_visible()
        assert page.locator('#story-score').inner_text().startswith('3 صحيحة من 4')
        page.reload()
        assert page.locator('#story-summary').is_visible() and page.locator('.story-german').count() == 6
    page.locator('#story-level').select_option('A2')
    assert page.locator('#story-library button').count() == 3
    page.locator('#story-restart').tap()
    assert page.locator('#story-score').inner_text().startswith('0 صحيحة من 0')
    assert page.locator('#story-question-next').is_disabled()
    layout(); page.screenshot(path='/tmp/jisr-stories-mobile.png',full_page=True)
    page.set_viewport_size({'width':1440,'height':1000}); page.wait_for_timeout(350)
    page.screenshot(path='/tmp/jisr-stories-desktop.png',full_page=True)
    print('PASS stories: 36 sentence clips, 24 vocabulary clips, all 24 questions, translation, evidence, persistence, filters/reset',flush=True)

    for path,card,prev,nxt,counter in [('huruf.html','#letter-card','#letter-previous','#letter-next','#letter-nav-position'),('lernseite.html','#flashcard','#prev-button','#next-button','#card-nav-position')]:
        page.goto(base+'/'+path); page.set_viewport_size({'width':390,'height':900}); language('ar')
        if path == 'lernseite.html':
            page.evaluate('VocabApp.saveVocabList([["بيت","Haus"],["كتاب","Buch"]],{type:"excel",title:"Navigation test"})'); page.reload()
        card_box = page.locator(card).bounding_box(); nav_box = page.locator(nxt).bounding_box()
        assert 0 <= nav_box['y'] - (card_box['y']+card_box['height']) <= 35, (path,card_box,nav_box)
        assert nav_box['height'] >= 48
        before = page.locator(counter).inner_text(); page.locator(nxt).tap()
        assert page.locator(counter).inner_text() != before
        page.locator(prev).focus(); page.keyboard.press('Enter')
        assert page.locator(counter).inner_text() == before
        language('de'); assert 'Weiter' in page.locator(nxt).inner_text()
        language('ar'); assert 'التالي' in page.locator(nxt).inner_text()
    assert not errors, errors
    assert not external, external
    print('PASS: close card navigation, keyboard/touch actions, Arabic/German layouts at 320/390/768/1440px; no JS errors or external requests',flush=True)
    browser.close()
