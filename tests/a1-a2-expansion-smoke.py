"""Check only the rebuilt beginner app; external services are blocked."""
import os,json,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
BASE=os.environ.get('HUROOF_TEST_BASE','http://127.0.0.1:8092')
URL=BASE+'/a1-a2/'
links=json.loads((ROOT/'data/a1-a2-unit-links.json').read_text())
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
    ctx=b.new_context(viewport={'width':1440,'height':1000},service_workers='block')
    ctx.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar');")
    ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE+'/') else r.abort())
    page=ctx.new_page();errors=[];missing=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('response',lambda r:missing.append(r.url) if r.status==404 else None)
    def go(name):
        page.goto(URL+name);page.wait_for_function('!!window.VocabApp&&!!document.querySelector(".brand-name")')
    def labels_clean():page.wait_for_function('HuroofEdition.id==="a1-a2"&&HuroofEdition.levels.join(",")==="A1,A2"')
    go('index.html');labels_clean()
    assert page.locator('#app-sidebar nav a').all_inner_texts()==['نظرة عامة','مفردات A1 وA2','تكوين جمل','قصص قصيرة','المهارات والوحدات','القواعد والإملاء','مراجعة المفردات','تقدّمي','التطبيقات الأخرى']
    assert page.locator('#app-sidebar a[href="verbs.html"],#app-sidebar a[href="test.html"]').count()==0
    go('sentences.html');page.wait_for_selector('#sentence-feedback');labels_clean()
    assert page.locator('.practice-links').count()==0
    assert page.locator('#sentence-level option[value="A1"]').inner_text()=='A1'
    page.screenshot(path='/tmp/huroof-levels-sentences.png')
    go('stories.html');page.wait_for_selector('.story-library-card');labels_clean()
    stories=page.evaluate('ArabicPracticeData.stories')
    assert len(stories)==24
    for level in ['A1','A2']:
        page.locator('#story-level').select_option(level)
        bank=[s for s in stories if s['level']==level]
        assert len(bank)==page.locator('.story-library-card').count()==12
        for index,story in enumerate(bank):
            page.locator('.story-library-card').nth(index).click()
            expect(page.locator('#story-title')).to_have_text(story['title']['ar'])
            assert page.locator('.story-line').count()==6
            if story.get('illustration'):
                art=page.locator('#story-art')
                assert story['illustration'] in art.evaluate('e=>getComputedStyle(e).backgroundImage')
                assert art.evaluate('e=>getComputedStyle(e).backgroundPosition')==f"{(story['art']%3)*50}% {(story['art']//3)*100}%"
            for i,q in enumerate(story['questions']):
                page.locator('#story-options').get_by_role('button',name=q['options'][q['correct']]['ar'],exact=True).click()
                assert 'أحسنت' in page.locator('#story-feedback').inner_text()
                assert page.locator('.story-line.is-evidence').count()==1
                if i<3:page.locator('#story-question-next').click()
            assert page.locator('#story-summary').is_visible()
        print('PASS',level,'12 stories, 48 correct answers and evidence highlights',flush=True)
    page.locator('#story-translation').click()
    assert page.locator('.story-german').count()==6
    page.locator('#story-restart').click();assert not page.locator('#story-options button:disabled').count()
    for unit,ids in links.items():
        go('skills.html#'+unit+'/reading');page.wait_for_selector('.skills-module-nav')
        a=page.get_by_role('link',name='شرح القاعدة كاملًا',exact=True)
        assert a.get_attribute('href')=='grammar.html?unit='+unit+'#'+ids[0]
        a.click();page.wait_for_selector('.unit-grammar-context')
        assert '/a1-a2/grammar.html' in page.url
        expect(page.locator('#grammar-lesson-select')).to_have_value(ids[0])
        assert page.locator('.unit-grammar-context a[href^="#"]').count()==len(ids)
        page.wait_for_function('document.querySelector(".unit-grammar-context").getBoundingClientRect().top>=0&&document.querySelector(".unit-grammar-context").getBoundingClientRect().top<250')
        for id in ids:
            page.locator('.unit-grammar-context a[href="#'+id+'"]').click()
            expect(page.locator('#grammar-lesson-select')).to_have_value(id)
        page.locator('.unit-grammar-context a[href^="skills.html"]').click();page.wait_for_selector('.skills-module-nav')
        assert page.url.endswith('#'+unit+'/reading')
    print('PASS 12 unit links: local specific lessons, paired first-unit rules, immediate scrolling and return to unit',flush=True)
    go('grammar.html');page.wait_for_selector('#grammar-lesson')
    assert page.locator('a[href="verbs.html"]').count()>=1
    go('verbs.html');page.wait_for_selector('#conjugation-body tr')
    assert page.locator('#verb-select option').count()==300
    assert page.locator('#verb-select optgroup').count()==6
    assert page.locator('#app-sidebar a[href="grammar.html"]').get_attribute('aria-current')=='page'
    # Exercise all 300 real selection change handlers and rendered past tables.
    page.evaluate('''() => {
      const D=VerbLessonData, select=document.getElementById('verb-select');
      for (const v of D.verbs) {
        select.value=v.id;select.dispatchEvent(new Event('change',{bubbles:true}));
        const rows=document.querySelectorAll('#conjugation-body tr');
        if(rows.length!==14||rows[8].querySelector('.verb-form').textContent!==D.conjugate(v,'past',D.pronouns[8]))throw Error(v.id);
      }
    }''')
    for family in ['sound','hamzated','doubled','example','hollow','defective']:
        page.locator('#verb-family').select_option(family)
        assert page.locator('#verb-select option').count()>0
        assert page.locator('#verb-select optgroup').count()==1
    page.locator('#verb-family').select_option('all')
    for length in ['3','4','5','6']:
        page.locator('#verb-length').select_option(length)
        assert page.locator('#verb-select option').count()>0
    page.locator('#verb-length').select_option('all')
    for tense,rows in [('present',14),('imperative',5),('past',14)]:
        page.locator('[data-tense="'+tense+'"]').click();assert page.locator('#conjugation-body tr').count()==rows
    for mode in ['past','present','past-lam','future','prohibition']:
        page.locator('#verb-negative-mode').select_option(mode)
        assert page.locator('#verb-negative-body tr').count()==(5 if mode=='prohibition' else 14)
    print('PASS 300 verb selections, six family filters, four form lengths, three tenses and five negation modes',flush=True)
    for name,selector in [('vocabulary.html','#learning-path'),('sentences.html','#sentence-level'),('stories.html','#story-title'),('verbs.html','#verb-select'),('skills.html','#skills-sections'),('grammar.html','#grammar-stages'),('grammar.html?unit=a1-01#pronouns','.unit-grammar-context')]:
        go(name);page.wait_for_selector(selector)
        for lang in ['ar','de']:
            page.locator('#app-language-select').select_option(lang);labels_clean()
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':900})
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(name,lang,width)
                if name=='grammar.html':
                    assert page.locator('.placement-context a').evaluate('e=>getComputedStyle(e).display')=='inline-flex'
                    assert page.locator('.placement-context a').bounding_box()['height']>=48
                    for sel in ['.grammar-path-panel','#grammar-stages button']:
                        assert page.locator(sel).evaluate_all('nodes=>nodes.every(e=>{const r=e.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1})'),(lang,width,sel)
        assert 'undefined' not in page.locator('main').inner_text(),name
    # Capture the first-unit pair at a real mobile viewport, with the menu closed.
    page.set_viewport_size({'width':390,'height':844});page.locator('#app-language-select').select_option('ar')
    if page.locator('body').evaluate('e=>e.classList.contains("nav-open")'):page.locator('.menu-toggle').click()
    page.wait_for_function('''()=>{const r=document.querySelector('.app-sidebar').getBoundingClientRect();return r.left>=innerWidth||r.right<=0}''')
    page.locator('.unit-grammar-context').scroll_into_view_if_needed();page.screenshot(path='/tmp/huroof-unit-rules-mobile.png')
    assert page.locator('.unit-grammar-tab[aria-current="page"]').count()==1
    for a in page.locator('.unit-grammar-context a').all(): assert a.bounding_box()['height']>=48
    assert not errors,errors
    assert not missing,missing
    print('PASS exact sidebar, removed strip, A1/A2 level labels, responsive AR/DE layouts and no missing assets',flush=True)
    ctx.close();b.close()
