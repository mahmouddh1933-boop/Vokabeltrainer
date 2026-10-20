"""All eight youth units: 256 tasks, real local audio, drafts, navigation and print."""
from playwright.sync_api import sync_playwright
import argparse, re
parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8000')
base=parser.parse_args().base_url.rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':950},is_mobile=True,has_touch=True)
    page=context.new_page();errors=[];external=[];failed=[];played=set()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
    def route_request(route):
        if route.request.url.startswith(base):route.continue_()
        else:external.append(route.request.url);route.abort()
    page.route('**/*',route_request)
    page.add_init_script('''window.__plays=0;window.__calls=[];window.__printCalls=0;
      window.print=()=>window.__printCalls++;
      const play=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){__calls.push({src:this.src,gesture:navigator.userActivation.isActive});this.addEventListener('playing',()=>__plays++,{once:true});return play.call(this);};''')
    assert page.goto(base+'/arabic-youth.html').status==200
    page.locator('#app-language-select').select_option('ar')
    assert page.locator('#lesson-loading').count()==0
    assert page.locator('.app-sidebar a[aria-current="page"]').get_attribute('href')=='arabic-youth.html'
    assert page.locator('#youth-library button').count()==8
    stats=page.evaluate('VocabApp.getStats()')
    units=page.evaluate('ArabicYouthData.units')
    def tab(name):page.locator(f'[data-youth-tab="{name}"]').tap()
    def play_all():
        for control in page.locator('#youth-content [data-audio]').all():
            text=control.get_attribute('data-audio')
            expected=page.evaluate('text=>ArabicYouthData.audio[text.normalize("NFC")]',text)
            before=page.evaluate('__plays');control.tap();page.wait_for_function('n=>__plays>n',arg=before)
            actual=page.evaluate('__calls.at(-1)')
            assert actual['gesture'] and actual['src'].endswith(expected),(actual,expected)
            played.add(expected)
    def answer(q,wrong=False):
        card=page.locator('#youth-q-'+q['id'])
        if q['section']=='order':
            for token in range(len(q['words'])):card.locator(f'[data-token="{token}"]').tap()
            card.locator('.primary-action').tap()
        else:
            value=next(o for o in q['options'] if o!=q['answer']) if wrong else q['answer']
            card.locator('.youth-option').filter(has_text=re.compile('^'+re.escape(value)+'$')).tap()
        assert ('راجع الإجابة' if wrong else 'أحسنت') in card.locator('.youth-task-feedback').inner_text(),q
    for index,unit in enumerate(units):
        assert page.locator('#youth-title').inner_text()==unit['title']
        assert page.locator('#youth-position').inner_text()==f'{index+1} / 8'
        tab('dialogue');assert page.locator('.youth-turn').count()==12
        play_all()
        page.locator('#youth-draft-role').fill('مرحبا. كيف أستفيد من هذا الدرس؟')
        for name in ['vocabulary','reading','grammar','free']:
            tab(name)
            if name=='vocabulary':
                assert page.locator('.youth-word-card').count()==8
                assert page.locator('.youth-response').count()==6
                page.locator('#youth-draft-s0').fill('إجابة شخصية للوحدة '+str(index+1))
                page.wait_for_function('Array.from(document.querySelectorAll("#youth-content img")).every(n=>n.complete && n.naturalWidth>0)')
            play_all()
            if name=='free':
                assert unit['freeTitle'] in page.locator('.youth-text-title').inner_text()
                if index==1:assert 'قراءة إضافية' in page.locator('#youth-content h3').first.inner_text()
                page.locator('#youth-draft-summary').fill('أفهم الفكرة وأربطها بموقفي الشخصي.')
            for q in unit['questions']:
                if q['section']!=name and not (name=='grammar' and q['section']=='order'):continue
                if index==0 and q['id']=='reading1':
                    answer(q,True);page.reload()
                    assert 'راجع الإجابة' in page.locator('#youth-q-reading1 .youth-task-feedback').inner_text()
                    page.locator('#youth-q-reading1 .practice-actions button').tap()
                answer(q)
        assert page.locator('#youth-progress').get_attribute('value')=='32'
        assert '32 صحيحة' in page.locator('#youth-score').inner_text()
        assert page.locator('#youth-complete').is_visible()
        page.reload();assert page.locator('#youth-progress').get_attribute('value')=='32'
        assert page.locator('#youth-draft-summary').input_value()=='أفهم الفكرة وأربطها بموقفي الشخصي.'
        print(f'PASS youth unit {index+1}/8: all 32 answers, audio, drafts and reload',flush=True)
        if index<7:page.locator('#youth-next').tap()
    assert len(played)==221,len(played)
    assert page.locator('#youth-next').is_disabled()
    assert page.locator('#youth-total').inner_text().startswith('256 ')
    # DE/AR controls preserve all Arabic learning text and progress.
    for language in ['de','ar']:
        page.locator('#app-language-select').select_option(language)
        assert page.locator('#youth-title').inner_text()=='أفكر في السفر'
        for name in ['dialogue','vocabulary','reading','grammar','free']:
            tab(name)
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':950});page.wait_for_timeout(50)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,name,width)
            assert page.locator('#youth-progress').get_attribute('value')=='32'
    page.set_viewport_size({'width':390,'height':950})
    page.locator('#youth-select').select_option('2');assert page.locator('#youth-title').inner_text()=='في الفندق'
    tab('vocabulary');assert page.locator('#youth-draft-s0').input_value()=='إجابة شخصية للوحدة 3'
    tab('dialogue');assert page.locator('#youth-draft-role').input_value().startswith('مرحبا')
    page.locator('.youth-index summary').tap();page.locator('[data-youth-unit="0"]').tap()
    assert page.locator('#youth-title').inner_text()=='في القطار'
    assert page.locator('#youth-previous').is_disabled()
    tab('grammar')
    # Accept a second valid word order; tokens remain reversible before checking.
    card=page.locator('#youth-q-o4');card.locator('.practice-actions button').tap()
    for token in [2,3,0,1]:card.locator(f'[data-token="{token}"]').tap()
    card.locator('.primary-action').tap()
    assert 'أحسنت' in card.locator('.youth-task-feedback').inner_text()
    page.locator('#youth-print-button').tap();assert page.evaluate('__printCalls')==1
    # Print contains every task, actual SVG images and blank lines; no saved corrections.
    page.emulate_media(media='print')
    assert page.locator('#youth-print').is_visible()
    assert page.locator('#youth-print .youth-print-task').count()==32
    assert not page.locator('#youth-content').is_visible()
    assert page.locator('#youth-print img').count()==9
    assert page.locator('#youth-print .is-correct').count()==0
    page.pdf(path='/tmp/jisr-youth-unit-1.pdf',format='A4',print_background=False)
    page.emulate_media(media='screen')
    page.locator('.youth-reset summary').tap();page.locator('#youth-reset').tap()
    assert page.locator('#youth-progress').get_attribute('value')=='0'
    assert page.locator('#youth-total').inner_text().startswith('224 ')
    tab('vocabulary');assert page.locator('#youth-draft-s0').input_value()=='إجابة شخصية للوحدة 1'
    page.locator('#youth-next').tap();assert page.locator('#youth-progress').get_attribute('value')=='32'
    page.evaluate('location.hash="unit-8"');page.wait_for_function('document.getElementById("youth-position").textContent==="8 / 8"')
    assert page.evaluate('VocabApp.getStats()')==stats
    page.locator('#youth-select').select_option('0');tab('dialogue')
    page.evaluate('scrollTo(0,0)');page.screenshot(path='/tmp/jisr-youth-mobile-viewport.png')
    page.set_viewport_size({'width':1440,'height':1000});page.wait_for_timeout(300);page.screenshot(path='/tmp/jisr-youth-desktop.png')
    assert not errors,errors
    assert not external,external
    assert not failed,failed
    browser.close()
    print('PASS: all 256 youth tasks, 221 distinct local recordings, eight unit bindings, persistent drafts, reset isolation, responsive DE/AR, unfilled print sheet; no external requests',flush=True)
