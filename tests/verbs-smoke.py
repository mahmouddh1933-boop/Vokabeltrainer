from playwright.sync_api import sync_playwright
import argparse
parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8000')
args=parser.parse_args()
base=args.base_url.rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1050})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    assert page.goto(base+'/verbs.html').status==200
    assert page.locator('#verb-select option').count()==30
    assert page.locator('#verb-select optgroup').count()==3
    assert page.locator('#conjugation-body tr').count()==14
    assert page.locator('#conjugation-body tr').first.locator('.verb-form').text_content()=='كَتَبْتُ'
    assert page.locator('.app-sidebar a[aria-current="page"]').get_attribute('href')=='verbs.html'
    def correct_option():
        pronoun=page.locator('#verb-question strong').inner_text()
        description=page.locator('#verb-question small').inner_text()
        for row in page.locator('#conjugation-body tr').all():
            if row.locator('th').text_content()==pronoun and row.locator('td').first.text_content()==description:
                return row.locator('.verb-form').text_content()
        raise AssertionError('Question has no matching table row')
    page.locator('#verb-answers').get_by_role('button',name=correct_option(),exact=True).click()
    assert 'is-correct' in page.locator('#verb-feedback').get_attribute('class')
    assert page.locator('#verb-score').inner_text()=='1 من 1 إجابات صحيحة'
    assert page.locator('#verb-answers button:disabled').count()==4
    page.locator('#verb-next').click()
    correct=correct_option()
    for button in page.locator('#verb-answers button').all():
        if button.text_content()!=correct:
            button.click()
            break
    assert 'is-wrong' in page.locator('#verb-feedback').get_attribute('class')
    assert page.locator('#verb-score').inner_text()=='1 من 2 إجابات صحيحة'
    assert correct in page.locator('#verb-feedback').inner_text()
    page.locator('[data-tense="present"]').click()
    page.locator('#verb-select').select_option('drink')
    assert page.locator('#verb-feature-form').inner_text()=='يَشْرَبُ'
    assert page.locator('#conjugation-body tr').first.locator('.verb-form').text_content()=='أَشْرَبُ'
    page.locator('[data-tense="imperative"]').click()
    assert page.locator('#conjugation-body tr').count()==5
    assert page.locator('#verb-feature-form').inner_text()=='اِشْرَبْ'
    assert page.locator('#verb-imperative-note').is_visible()
    assert page.locator('#conjugation-body th').all_text_contents()==['أَنْتَ','أَنْتِ','أَنْتُمَا','أَنْتُمْ','أَنْتُنَّ']
    # Verify UI binding for every tense and every verb, independently of the golden data tests.
    ids=page.evaluate('VerbLessonData.verbs.map(v=>v.id)')
    for verb_id in ids:
        page.locator('#verb-select').select_option(verb_id)
        for tense in ['past','present','imperative']:
            page.locator(f'[data-tense="{tense}"]').click()
            expected=page.evaluate('''([id,tense])=>{
                const d=VerbLessonData,v=d.verbs.find(v=>v.id===id);
                return d.pronounsFor(tense).map(p=>d.conjugate(v,tense,p));
            }''',[verb_id,tense])
            assert page.locator('.verb-form').all_text_contents()==expected,(verb_id,tense)
            options=page.locator('#verb-answers button').all_text_contents()
            assert len(options)==len(set(options))==4
            assert set(options)<=set(expected),(verb_id,tense,options)
            assert correct_option() in options
    assert page.locator('#verb-specific-note').inner_text()
    # Arabic search ignores vowels and alif/hamza differences; German search also works.
    for query,expected_id in [('كَتَبَ','write'),('اِقْرَئِي','read'),('schlafen','sleep'),('nehmen','take')]:
        page.locator('#verb-search').fill(query)
        assert page.locator('#verb-select').input_value()==expected_id
        assert page.locator('#verb-select option').count()==1
    page.locator('#app-language-select').select_option('de')
    assert page.locator('#verb-select').input_value()=='take'
    assert page.locator('#verb-search').input_value()=='nehmen'
    assert page.locator('#verb-score').inner_text()=='1 von 2 richtig'
    assert page.locator('#verb-meaning').inner_text()=='nehmen'
    page.locator('#verb-search').fill('no-such-verb-xyz')
    assert page.locator('#verb-empty').is_visible()
    assert page.locator('#verb-select').is_disabled()
    assert page.locator('#verb-content').is_hidden()
    assert page.locator('#verb-practice').is_hidden()
    # Changing tense while the results are empty must not restore a stale quiz.
    page.locator('[data-tense="past"]').click()
    page.locator('#verb-clear-search').click()
    assert page.locator('#verb-select option').count()==30
    assert page.locator('#conjugation-body tr').count()==14
    assert page.locator('#verb-content').is_visible()
    assert correct_option() in page.locator('#verb-answers button').all_text_contents()
    assert 'Perfekt' in page.locator('#verb-question').inner_text()
    page.locator('#verb-select').select_option('read')
    page.locator('[data-tense="imperative"]').click()
    assert page.locator('.verb-form').all_text_contents()==['اِقْرَأْ','اِقْرَئِي','اِقْرَآ','اِقْرَؤُوا','اِقْرَأْنَ']
    page.locator('#app-language-select').select_option('ar')
    assert page.locator('#verb-score').inner_text()=='1 من 2 إجابات صحيحة'
    assert page.locator('#verb-select').input_value()=='read'
    assert page.locator('#verb-feature-form').inner_text()=='اِقْرَأْ'
    page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(350)
    page.screenshot(path='/tmp/jisr-expanded-verbs.png')
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for tense in ['past','present','imperative']:
            page.locator(f'[data-tense="{tense}"]').click()
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(300)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,tense,width)
    page.set_viewport_size({'width':390,'height':844})
    page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(350)
    page.screenshot(path='/tmp/jisr-expanded-verbs-mobile.png')
    page.route('https://cdn.jsdelivr.net/**',lambda route:route.abort())
    page.goto(base+'/index.html')
    page.locator('.grammar-home-card').click();page.wait_for_url('**/verbs.html')
    assert not errors,errors
    print('PASS: 30 verbs / 90 tables, imperative-only addressees, Arabic/German search, empty-result recovery, quiz feedback, DE/AR state preservation and responsive layouts; no JavaScript errors')
    browser.close()
