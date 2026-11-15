"""Regression checks for Arabic spacing, construction marks and answer contrast."""
import argparse
from playwright.sync_api import sync_playwright

p = argparse.ArgumentParser()
p.add_argument('--base-url', default='http://127.0.0.1:8093')
base = p.parse_args().base_url.rstrip('/')
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    context = browser.new_context(service_workers='block')
    context.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar')")
    context.route('**/*', lambda r: r.continue_() if r.request.url.startswith(base + '/') else r.abort())
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(base + '/b1-b2/index.html')
    assert '·' not in page.locator('a[href="verbs.html"] h2').inner_text()
    page.goto(base + '/b1-b2/grammar.html#past-construction')
    page.wait_for_function('document.querySelector("#grammar-lesson-select").value === "past-construction"')
    assert page.locator('#lesson-sections .lesson-section').nth(0).locator('mark').all_text_contents() == ['بَ', 'بَ', 'بَ', 'ا', 'ى']
    assert page.locator('#lesson-sections .lesson-section').nth(1).locator('mark').all_text_contents() == ['بْ', 'بْ', 'بْ']
    assert page.locator('#lesson-sections .lesson-section').nth(2).locator('mark').all_text_contents() == ['بُ']
    for app in ['a1-a2', 'b1-b2']:
        page.goto(f'{base}/{app}/grammar.html')
        page.wait_for_selector('.grammar-answer')
        lesson = page.evaluate('ArabicGrammarData.lessons.find(l=>l.id===document.querySelector("#grammar-lesson-select").value)')
        correct = lesson['questions'][0]['correct']
        page.locator('.grammar-answer').nth((correct + 1) % len(lesson['questions'][0]['options'])).click()
        right = page.locator('.grammar-answer.is-correct').evaluate('(n)=>({bg:getComputedStyle(n).backgroundColor,color:getComputedStyle(n).color,opacity:getComputedStyle(n).opacity})')
        wrong = page.locator('.grammar-answer.is-wrong').evaluate('(n)=>getComputedStyle(n).backgroundColor')
        neutral = page.locator('.grammar-answer:not(.is-correct):not(.is-wrong)').first.evaluate('(n)=>getComputedStyle(n).backgroundColor')
        assert right == dict(bg='rgb(29, 99, 62)', color='rgb(255, 255, 255)', opacity='1'), right
        assert len({right['bg'], wrong, neutral}) == 3
    for width in [320, 390, 768, 1440]:
        page.set_viewport_size(dict(width=width, height=1000))
        for language in ['ar', 'de']:
            for app in ['a1-a2', 'b1-b2']:
                page.goto(f'{base}/{app}/grammar.html')
                page.locator('#app-language-select').select_option(language)
                page.evaluate('document.fonts.ready')
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (width, app, language)
                assert page.locator('.page-back-nav').evaluate('(n)=>n.getBoundingClientRect().bottom+20 <= document.querySelector(".page-heading").getBoundingClientRect().top'), (width, app, language)
                assert page.locator('main').evaluate('(n)=>parseFloat(getComputedStyle(n).paddingInlineStart)>=18')
            page.goto(base + '/b1-b2/texts.html#B11/reading')
            page.locator('#app-language-select').select_option(language)
            assert page.locator('#advanced-content>.practice-button').evaluate('(n)=>n.getBoundingClientRect().bottom+20<=n.nextElementSibling.getBoundingClientRect().top'), (width, language)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.set_viewport_size(dict(width=1280, height=1000))
    page.goto(base + '/b1-b2/grammar.html#past-construction')
    page.locator('#app-language-select').select_option('ar')
    page.locator('#lesson-sections').screenshot(path='/tmp/huroof-construction-corrected.png')
    page.goto(base + '/b1-b2/texts.html#B11/reading')
    form = page.locator('.advanced-quiz')
    answers = page.evaluate('HuroofAdvancedUnits.units[0].readingQuiz.map(q=>q.a)')
    form.evaluate('(form,answers)=>answers.forEach((a,i)=>form.querySelectorAll("fieldset")[i].querySelectorAll("input")[a].click())', answers)
    form.locator('button[type=submit]').click()
    assert form.locator('label.is-correct').count() == len(answers)
    page.reload()
    page.wait_for_selector('.advanced-quiz label.is-correct')
    assert page.locator('.advanced-quiz label.is-correct').count() == len(answers)
    assert not errors, errors
    browser.close()
print('PASS construction marks, connected endings, estimated alif, correct/wrong/neutral contrast, saved unit feedback, AR/DE spacing at 320–1440px')
