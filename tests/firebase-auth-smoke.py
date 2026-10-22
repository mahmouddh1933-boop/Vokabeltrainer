"""Real Firebase SDK against local Hosting/Auth emulators; no production accounts."""
from playwright.sync_api import sync_playwright, expect
from urllib.request import urlopen, Request
from urllib.parse import quote
import json, time

BASE = 'http://127.0.0.1:5000'
EMULATOR = 'http://127.0.0.1:9099'
PROJECT = 'letters-from-olive'
PASSWORD = 'Test-Olive-123!'
email_a = f'olive-a-{time.time_ns()}@example.test'
email_b = f'olive-b-{time.time_ns()}@example.test'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    context = browser.new_context(viewport={'width':390, 'height':950}, is_mobile=True, has_touch=True)
    context.add_init_script("if(location.origin==='http://127.0.0.1:5000'){localStorage.setItem('vocabInterfaceLanguage','de');localStorage.setItem('oliveLearnerThemeV1','neutral')}")
    errors, external = [], []
    context.on('page', lambda page: page.on('pageerror', lambda error: errors.append(str(error))))
    def route(request):
        url = request.request.url
        if url.startswith(BASE + '/') or url.startswith(EMULATOR + '/'):
            request.continue_()
        elif url.startswith('https://cdn.jsdelivr.net/npm/xlsx@'):
            request.abort()
        else:
            external.append(url); request.abort()
    context.route('**/*', route)
    page = context.new_page()
    def ready(page):
        page.wait_for_selector('#olive-account')
        page.wait_for_function('!document.documentElement.classList.contains("auth-pending")')
    def login_ready(page):
        page.wait_for_url('**/login.html**')
        expect(page.locator('#auth-submit')).to_be_enabled()
    def form(email, password=PASSWORD, register=False, remember=False):
        if register: page.locator('[data-auth-mode="register"]').click()
        page.locator('#auth-email').fill(email)
        page.locator('#auth-password').fill(password)
        if register: page.locator('#auth-confirm').fill(password)
        page.locator('#auth-remember').set_checked(remember)
        page.locator('#auth-submit').click()
    def logout(page):
        page.locator('#olive-account summary').click()
        page.locator('#auth-signout').click()
        login_ready(page)
    def responsive(selector):
        for lang in ['de', 'ar']:
            if page.locator('[data-auth-language]').count():
                page.locator(f'[data-auth-language="{lang}"]').click()
            else: page.locator('#app-language-select').select_option(lang)
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':950})
                page.wait_for_timeout(80)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(page.url,lang,width)
                if page.locator('#olive-account').count():
                    page.locator('#olive-account summary').click()
                    page.wait_for_timeout(350)
                    panel=page.locator('.olive-account-panel').bounding_box()
                    assert panel['x'] >= 0 and panel['x']+panel['width'] <= width,(lang,width,panel)
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                    page.keyboard.press('Escape')
        page.set_viewport_size({'width':390,'height':950})
        page.wait_for_timeout(400)

    # A direct book link waits for auth before initializing any learning state.
    page.goto(BASE + '/youth-book-two-part-one.html#unit-6')
    login_ready(page)
    assert 'unit-6' in page.url
    assert page.evaluate('typeof VocabApp') == 'undefined'
    page.locator('[data-auth-mode="register"]').click()
    page.locator('#auth-email').fill(email_a)
    page.locator('#auth-password').fill(PASSWORD)
    page.locator('#auth-confirm').fill('A different password')
    page.locator('#auth-submit').click()
    expect(page.locator('#auth-message')).to_contain_text('stimmen nicht')
    page.locator('[data-auth-language="ar"]').click()
    expect(page.locator('#auth-message')).to_contain_text('غير متطابقتين')
    page.locator('[data-auth-language="de"]').click()
    page.locator('#auth-confirm').fill(PASSWORD)
    page.locator('#auth-remember').check()
    page.locator('#auth-submit').click()
    page.wait_for_url('**/youth-book-two-part-one.html#unit-6')
    ready(page)
    expect(page.locator('#book-unit-title')).to_have_text('إلى السوق')
    uid_a = page.evaluate('OliveAuth.getUser().uid')
    page.evaluate("JisrStorage.local.setItem('learningStats',JSON.stringify({totalTests:7}));JisrStorage.local.setItem('jisrPracticeV1:sentences','{\"marker\":\"student A\"}')")
    # Stored lesson state is loaded after account restoration, across full navigation.
    page.goto(BASE + '/stats.html'); ready(page)
    assert page.evaluate('VocabApp.getStats().totalTests') == 7
    assert page.evaluate("JisrStorage.local.getItem('jisrPracticeV1:sentences')") == '{"marker":"student A"}'
    assert page.evaluate("localStorage.getItem('learningStats')") is None
    assert not any(PASSWORD in v for v in page.evaluate('Object.values(localStorage)'))
    responsive('#olive-account')
    page.locator('#olive-account summary').click()
    expect(page.locator('#olive-account-panel')).to_have_count(0)
    expect(page.locator('.olive-account-panel')).to_be_visible()
    page.screenshot(path='/tmp/olive-auth-account-mobile.png')
    page.keyboard.press('Escape')
    expect(page.locator('#olive-account summary')).to_be_focused()
    # Remembered identity survives a fresh tab; sign-out reaches other open tabs.
    second = context.new_page(); second.goto(BASE+'/huruf.html'); ready(second)
    assert second.evaluate('OliveAuth.getUser().uid') == uid_a
    second.locator('#letter-next').click()
    expect(second.locator('#letter-big')).to_have_text('ب')
    second.locator('#letter-card').click()
    assert 'flipped' in second.locator('#letter-card').get_attribute('class')
    logout(page); login_ready(second); second.close()
    form(email_b, register=True)
    ready(page)
    assert page.evaluate('OliveAuth.getUser().uid') != uid_a
    assert page.evaluate('VocabApp.getStats().totalTests') == 0
    assert page.evaluate("JisrStorage.local.getItem('jisrPracticeV1:sentences')") is None
    page.evaluate("JisrStorage.local.setItem('learningStats',JSON.stringify({totalTests:2}))")
    page.reload(); ready(page)
    assert page.evaluate('VocabApp.getStats().totalTests') == 2
    page.close()
    page = context.new_page(); page.goto(BASE+'/grammar.html'); login_ready(page)
    # Default session-only login ends when the tab closes.
    form(email_a, password='Clearly-wrong-password')
    expect(page.locator('#auth-message')).to_have_class('auth-message is-error')
    page.locator('[data-auth-language="de"]').click()
    expect(page.locator('#auth-message')).to_contain_text('nicht richtig')
    form(email_a, remember=True); ready(page)
    assert page.evaluate('VocabApp.getStats().totalTests') == 7
    page.goto(BASE+'/huruf.html'); ready(page)
    # Wrong/right feedback, letter navigation and keyboard input still work.
    page.locator('#focused-options button').first.click()
    assert page.locator('#focused-options .is-correct').count() == 1
    page.locator('#focused-next').click()
    responsive('#focused-run')
    logout(page)
    # Password-reset request produces a real emulator action code, not a fake success.
    page.locator('[data-auth-mode="reset"]').click()
    page.locator('#auth-email').fill(email_a)
    page.locator('#auth-submit').click()
    expect(page.locator('#auth-message')).to_contain_text('Link zum Zurücksetzen')
    with urlopen(EMULATOR + '/emulator/v1/projects/'+PROJECT+'/oobCodes') as response:
        codes=json.load(response)['oobCodes']
    code=next(c['oobCode'] for c in codes if c['email']==email_a and c['requestType']=='PASSWORD_RESET')
    payload=json.dumps({'oobCode':code,'newPassword':PASSWORD+'new'}).encode()
    request=Request(EMULATOR+'/identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=test-key',data=payload,headers={'Content-Type':'application/json'})
    with urlopen(request) as response: assert response.status==200
    page.locator('[data-auth-mode="login"]').click()
    form(email_a, PASSWORD+'new'); ready(page)
    logout(page)
    # A supplied external return URL is ignored.
    page.goto(BASE + '/login.html?next=' + quote('https://example.com/steal',safe=''))
    login_ready(page); form(email_a, PASSWORD+'new'); ready(page)
    assert page.url == BASE+'/index.html'
    page.locator('#hero-start').click()
    page.wait_for_selector('.ready-list-button')
    page.locator('.ready-list-button').first.click()
    page.wait_for_url('**/lernseite.html');ready(page)
    vocab=page.evaluate('VocabApp.getCurrentVocabList()')
    assert len(vocab)==20
    expect(page.locator('#front')).to_have_text(vocab[0][0])
    page.locator('#flashcard').click()
    assert 'flipped' in page.locator('#flashcard').get_attribute('class')
    page.locator('#next-button').click()
    expect(page.locator('#front')).to_have_text(vocab[1][0])
    page.goto(BASE+'/test2.html');ready(page)
    questions=page.locator('.question')
    assert questions.count()>0
    for question in questions.all():
        arabic=question.locator('.arabic-text').inner_text()
        answer=next(de for ar,de in vocab if ar==arabic)
        radios=question.locator('input[type=radio]')
        for radio in radios.all():
            if radio.input_value()==answer:radio.check();break
        else:raise AssertionError('Correct choice missing')
    count=questions.count()
    page.locator('#submit-test').click()
    page.wait_for_url('**/ergebnis.html');ready(page)
    assert page.locator('.result-correct').count()==count
    assert page.evaluate('VocabApp.getStats().totalTests')==8
    logout(page)
    # Known setup/network errors leave usable form controls and translated feedback.
    page.route('**/accounts:signInWithPassword?**',lambda r:r.fulfill(status=400,content_type='application/json',body='{"error":{"message":"OPERATION_NOT_ALLOWED"}}'))
    form(email_a, PASSWORD+'new')
    expect(page.locator('#auth-message')).to_contain_text('nicht aktiviert')
    expect(page.locator('#auth-submit')).to_be_enabled()
    page.unroute('**/accounts:signInWithPassword?**')
    page.route('**/accounts:signInWithPassword?**',lambda r:r.abort())
    form(email_a, PASSWORD+'new')
    expect(page.locator('#auth-message')).to_contain_text('Verbindung',timeout=45000)
    expect(page.locator('#auth-submit')).to_be_enabled()
    page.unroute('**/accounts:signInWithPassword?**')
    responsive('#auth-form')
    for lang in ['ar','de']:
        page.locator(f'[data-auth-language="{lang}"]').click()
        page.screenshot(path='/tmp/olive-auth-login-'+lang+'.png')
    assert not external,external
    # An unavailable SDK shows a retry action and keeps hosted lessons gated.
    failed_context=browser.new_context(viewport={'width':390,'height':950})
    failed_page=failed_context.new_page()
    failed_page.on('pageerror',lambda e:errors.append(str(e)))
    def unavailable(r):
        if 'firebase-app-compat.js' in r.request.url:r.abort()
        elif r.request.url.startswith(BASE+'/'):r.continue_()
        else:r.abort()
    failed_page.route('**/*',unavailable)
    failed_page.goto(BASE+'/login.html')
    expect(failed_page.locator('#auth-retry')).to_be_visible()
    expect(failed_page.locator('#auth-submit')).to_be_disabled()
    failed_page.goto(BASE+'/huruf.html')
    expect(failed_page.locator('#auth-blocker button')).to_be_visible()
    assert failed_page.evaluate('typeof VocabApp')=='undefined'
    assert failed_page.locator('html').evaluate('n=>n.classList.contains("auth-pending")')
    failed_context.close()
    assert not errors,errors
    browser.close()
    print('PASS real Firebase SDK/emulators: registration, validation, sign-in/errors, session/local persistence, password reset, logout across tabs, account-isolated lessons and graded vocabulary test, direct links, safe return URL, SDK failure, AR/DE 320–1440px; no production requests')
