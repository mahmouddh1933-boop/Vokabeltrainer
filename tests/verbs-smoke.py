from playwright.sync_api import sync_playwright
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
args = parser.parse_args()
base = args.base_url.rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1050})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    response = page.goto(base + '/verbs.html')
    assert response.status == 200
    assert page.locator('#verb-select option').count() == 6
    assert page.locator('#conjugation-body tr').count() == 14
    assert page.locator('#conjugation-body tr').first.locator('.verb-form').text_content() == 'كَتَبْتُ'
    assert page.locator('.app-sidebar a[aria-current="page"]').get_attribute('href') == 'verbs.html'
    assert 'كتب' in page.locator('#conjugation-caption').inner_text().translate(str.maketrans('', '', 'ًٌٍَُِّْ'))
    def correct_option():
        pronoun = page.locator('#verb-question strong').inner_text()
        description = page.locator('#verb-question small').inner_text()
        for row in page.locator('#conjugation-body tr').all():
            if row.locator('th').text_content() == pronoun and row.locator('td').first.text_content() == description:
                return row.locator('.verb-form').text_content()
        raise AssertionError('Question has no matching table row')
    correct = correct_option()
    page.locator('#verb-answers').get_by_role('button', name=correct, exact=True).click()
    assert page.locator('#verb-feedback').get_attribute('class') == 'verb-feedback is-correct'
    assert '1 من 1' in page.locator('#verb-score').inner_text()
    assert page.locator('#verb-answers button:disabled').count() == 4
    page.locator('#verb-next').click()
    correct = correct_option()
    for button in page.locator('#verb-answers button').all():
        if button.text_content() != correct:
            button.click()
            break
    assert page.locator('#verb-feedback').get_attribute('class') == 'verb-feedback is-wrong'
    assert '1 من 2' in page.locator('#verb-score').inner_text()
    assert correct in page.locator('#verb-feedback').inner_text()
    page.locator('[data-tense="present"]').click()
    assert page.locator('[data-tense="present"]').get_attribute('aria-pressed') == 'true'
    assert page.locator('#conjugation-body tr').first.locator('.verb-form').text_content() == 'أَكْتُبُ'
    assert page.locator('#verb-feedback').inner_text() == ''
    page.locator('#verb-select').select_option('drink')
    assert page.locator('#verb-feature-form').inner_text() == 'يَشْرَبُ'
    assert page.locator('#conjugation-body tr').first.locator('.verb-form').text_content() == 'أَشْرَبُ'
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(350)
    page.screenshot(path='/tmp/jisr-verbs-ar.png', full_page=True)
    page.locator('#app-language-select').select_option('de')
    assert page.locator('html').get_attribute('dir') == 'ltr'
    assert page.locator('#verb-meaning').inner_text() == 'trinken'
    assert page.locator('#verb-score').inner_text() == '1 von 2 richtig'
    assert page.locator('#verb-select').input_value() == 'drink'
    assert page.locator('#conjugation-body tr td').first.inner_text() == 'ich'
    assert page.locator('#verb-feature-form').inner_text() == 'يَشْرَبُ'
    page.locator('#app-language-select').select_option('ar')
    assert page.locator('#verb-meaning').inner_text() == 'الشُّرْب'
    assert page.locator('#verb-score').inner_text() == '1 من 2 إجابات صحيحة'
    for language in ['ar', 'de']:
        page.locator('#app-language-select').select_option(language)
        for width in [320, 390, 768, 1440]:
            page.set_viewport_size({'width': width, 'height': 900})
            page.wait_for_timeout(300)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (language, width)
    page.set_viewport_size({'width': 390, 'height': 844})
    page.evaluate('window.scrollTo(0,0)')
    page.wait_for_timeout(350)
    page.screenshot(path='/tmp/jisr-verbs-mobile.png', full_page=True)
    page.route('https://cdn.jsdelivr.net/**', lambda route: route.abort())
    page.goto(base + '/index.html')
    page.locator('.grammar-home-card').click()
    page.wait_for_url('**/verbs.html')
    assert not errors, errors
    print('PASS: 6 verbs, 14 pronoun rows, tense and verb selection, correct/wrong answers, DE/AR round trip, home navigation, responsive widths; no JS errors')
    browser.close()
