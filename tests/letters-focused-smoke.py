from playwright.sync_api import sync_playwright,expect
import argparse,unicodedata
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8000');args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    page.add_init_script('Math.random=()=>.37')
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.route('**/*',lambda route:route.continue_() if route.request.url.startswith(base) else route.abort())
    assert page.goto(base+'/huruf.html').status==200
    page.locator('#app-language-select').select_option('ar')
    assert page.locator('.letters-controls').first.locator('button').evaluate_all('(buttons)=>buttons.map(b=>b.id)')==['letter-previous','letter-speak','card-say-word','letter-next']
    assert page.locator('[data-focused-mode]').count()==3
    assert page.locator('.quiz-panel').count()==0
    assert page.evaluate('''()=>{const ids=['letter-card','letter-speak','harakat-row','writing-canvas','letter-focused-practice'];return ids.slice(1).every((id,i)=>document.getElementById(ids[i]).compareDocumentPosition(document.getElementById(id))&Node.DOCUMENT_POSITION_FOLLOWING);}''')
    letters=page.evaluate('ArabicLetterData.letters')
    def select_letter(char):
        index=next(i for i,l in enumerate(letters) if l['char']==char)
        page.locator('#letters-grid button').nth(index).click()
        expect(page.locator('#focused-badge')).to_have_text(char)
        assert page.locator('#letter-big').inner_text()==char
        assert next(l for l in letters if l['char']==char)['name'] in page.locator('#focused-heading').inner_text()
    def select_mode(mode):
        page.locator(f'[data-focused-mode="{mode}"]').click()
        expect(page.locator(f'[data-focused-mode="{mode}"]')).to_have_attribute('aria-pressed','true')
    def questions(char,mode):return page.evaluate('([char,mode])=>ArabicLetterFocused.createLetterQuestions(char,mode,()=>.37)',[char,mode])
    def answer_question(q,wrong=False):
        assert page.locator('#focused-next').is_disabled()
        if q['kind']=='circle':
            cells=page.locator('.focused-letter-cell');assert cells.count()==16
            correct=[i for i,glyph in enumerate(cells.all_text_contents()) if unicodedata.normalize('NFKC',glyph)==q['letter']]
            assert correct==q['correct']
            assert page.locator('#focused-check').is_disabled()
            # Circles toggle by touch; selecting them does not submit an answer.
            cells.nth(correct[0]).tap();expect(cells.nth(correct[0])).to_have_attribute('aria-pressed','true')
            cells.nth(correct[0]).tap();expect(cells.nth(correct[0])).to_have_attribute('aria-pressed','false')
            if wrong:
                selected=[correct[0],next(i for i in range(16) if i not in correct)]
            else:selected=correct
            for i in selected:cells.nth(i).tap()
            assert page.locator('#focused-next').is_disabled()
            page.locator('#app-language-select').select_option('de')
            assert page.locator('.focused-letter-cell[aria-pressed="true"]').count()==len(selected)
            page.locator('#app-language-select').select_option('ar')
            page.locator('#focused-check').tap()
            assert page.locator('.focused-letter-cell:disabled').count()==16
            assert page.locator('.focused-letter-cell.is-correct').count()==len(correct)
            if wrong:
                assert page.locator('.focused-letter-cell.is-wrong').count()==1
                assert page.locator('.focused-letter-cell.was-missed').count()==len(correct)-1
        else:
            options=page.locator('#focused-options button');assert options.count()==len(q['options'])
            selected=next(i for i,o in enumerate(q['options']) if o!=q['correct']) if wrong else q['options'].index(q['correct'])
            options.nth(selected).tap()
            assert page.locator('#focused-options button:disabled').count()==len(q['options'])
            assert page.locator('#focused-options .is-correct').count()==1
            assert page.locator('#focused-feedback .letter-target').inner_text()==q['letter']
        assert ('is-wrong' if wrong else 'is-correct') in page.locator('#focused-feedback').get_attribute('class')
        assert page.locator('#focused-next').is_enabled()
    # Every letter changes the question bank, title, example and all three exercise types.
    for l in letters:
        char=l['char'];select_letter(char)
        for mode in ['forms','missing','circle']:
            select_mode(mode);q=questions(char,mode)[0]
            answer_question(q)
            assert page.locator('#focused-score').inner_text()=='1 من 1 إجابات صحيحة'
            assert page.locator('#focused-progress').get_attribute('value')=='1'
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    # All prior progress belongs to that exact letter and mode, including unfinished circles.
    select_letter('ب');select_mode('missing')
    assert page.locator('#focused-score').inner_text()=='1 من 1 إجابات صحيحة'
    select_letter('ت');assert page.locator('#focused-score').inner_text()=='1 من 1 إجابات صحيحة'
    select_letter('ب');assert page.locator('#focused-options button:disabled').count()==4
    page.locator('#app-language-select').select_option('de');assert page.locator('#focused-score').inner_text()=='1 von 1 richtig'
    page.locator('#app-language-select').select_option('ar')
    # Fresh sessions: full rounds for both joining and nonjoining letters.
    page.reload();page.locator('#app-language-select').select_option('ar')
    for char in ['ب','د']:
        select_letter(char)
        for mode in ['forms','missing','circle']:
            select_mode(mode);bank=questions(char,mode)
            for index,q in enumerate(bank):
                answer_question(q,wrong=index==0)
                assert page.locator('#focused-progress').get_attribute('value')==str(index+1)
                if index==1:
                    page.locator('#focused-previous').tap()
                    assert page.locator('#focused-next').is_enabled()
                    assert page.locator('#focused-progress').get_attribute('value')=='2'
                    page.locator('#focused-next').tap()
                page.locator('#focused-next').tap()
            expected=f'{len(bank)-1} من {len(bank)}'
            assert page.locator('#focused-result').is_visible()
            assert expected in page.locator('#focused-result-score').inner_text()
            other='ت' if char=='ب' else 'ذ'
            select_letter(other);assert page.locator('#focused-run').is_visible()
            select_letter(char);assert page.locator('#focused-result').is_visible()
            page.locator('#focused-review').tap();assert page.locator('#focused-next').is_enabled()
            assert page.locator('#focused-progress').get_attribute('value')==str(len(bank))
            for _ in bank:page.locator('#focused-next').tap()
            page.locator('#focused-restart').tap();assert page.locator('#focused-score').inner_text()=='0 من 0 إجابات صحيحة'
            assert page.locator('#focused-progress').get_attribute('value')=='0'
            assert page.locator('#focused-next').is_disabled()
            print('PASS full focused round:',char,mode,len(bank),'questions, correction, review, restart and letter-specific state',flush=True)
    select_letter('ب')
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for mode in ['forms','missing','circle']:
            select_mode(mode)
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(200)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,mode,width)
    page.locator('#app-language-select').select_option('ar');page.set_viewport_size({'width':390,'height':844});select_mode('circle')
    page.locator('#letter-focused-practice').scroll_into_view_if_needed();page.wait_for_timeout(500);page.screenshot(path='/tmp/jisr-focused-mobile.png')
    page.set_viewport_size({'width':1440,'height':1050});page.locator('#letter-focused-practice').scroll_into_view_if_needed();page.wait_for_timeout(350);page.screenshot(path='/tmp/jisr-focused-desktop.png')
    assert not errors,errors
    print('PASS: all 28 cards bind to their own 3 exercises, requested order, 96 fully answered questions, touch circles, per-letter/per-mode state, Arabic/German and responsive layout; no JavaScript errors',flush=True)
    browser.close()
