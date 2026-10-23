from playwright.sync_api import sync_playwright, expect
import argparse,unicodedata,re
parser=argparse.ArgumentParser();parser.add_argument('--base-url',default='http://127.0.0.1:8000');args=parser.parse_args();base=args.base_url.rstrip('/')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36')
    page=context.new_page();errors=[];external=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    def route_request(route):
        if route.request.url.startswith(base):route.continue_()
        else:external.append(route.request.url);route.abort()
    page.route('**/*',route_request)
    page.add_init_script('''window.__audioCalls=[];window.__audioPlaying=0;
      const original=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){window.__audioCalls.push({src:this.src,gesture:navigator.userActivation.isActive});this.addEventListener('playing',()=>window.__audioPlaying++,{once:true});return original.call(this);};''')
    assert page.goto(base+'/huruf.html').status==200
    page.locator('#app-language-select').select_option('ar')
    # Real MP3 decoding/playback, without Internet or an Arabic system voice, from touch clicks.
    for index in [0,1,12,24,27]:
        page.locator('#letters-grid button').nth(index).click()
        for selector in ['#letter-speak','#card-say-word',*[f'#harakat-row button:nth-child({i})' for i in range(1,5)]]:
            before=page.evaluate('__audioPlaying')
            page.locator(selector).tap()
            page.wait_for_function('before=>__audioPlaying>before',arg=before)
            call=page.evaluate('__audioCalls.at(-1)')
            assert '/audio/letters/' in call['src'],call
            assert call['gesture'],call
            assert not page.locator('#letters-speech-status').evaluate('e=>e.classList.contains("speech-error")')
    page.locator('#letter-tests-link').tap();page.wait_for_url('**/letter-tests.html')
    assert page.locator('[data-training-mode]').count()==4
    assert page.locator('#training-run').is_hidden()
    assert page.locator('.app-sidebar a[aria-current="page"]').get_attribute('href')=='letters.html'
    letters=page.evaluate('ArabicLetterData.letters')
    examples=page.evaluate('ArabicLetterExamples.examples')
    def choose_mode(mode):
        button=page.locator(f'[data-training-mode="{mode}"]')
        button.tap()
        expect(button).to_have_attribute('aria-pressed','true')
    for mode in ['names','forms','missing','listening']:
        choose_mode(mode)
        expect(page.locator('#training-run')).to_be_visible()
        seen=[]
        for index in range(28):
            assert page.locator('#training-next').is_disabled()
            if mode=='names':
                name=page.locator('.training-letter-name').inner_text();correct=next(l['char'] for l in letters if l['name']==name)
            elif mode=='forms':correct=unicodedata.normalize('NFKC',page.locator('.training-arabic').inner_text())
            elif mode=='missing':
                masked=page.locator('.training-arabic').inner_text();meaning=page.locator('.training-word-meaning').inner_text()
                found=[char for char,forms in examples.items() for e in forms if e['de']==meaning and masked.replace('□',char)==e['word']]
                assert len(set(found))==1,(masked,meaning,found);correct=found[0]
            else:
                assert page.locator('#training-stimulus').inner_text()==''
                before=page.evaluate('__audioPlaying');page.locator('#training-listen').tap();page.wait_for_function('before=>__audioPlaying>before',arg=before)
                src=page.evaluate('__audioCalls.at(-1).src');letter_index=int(re.search(r'/(\d+)-name-waqf.mp3',src).group(1))-1;correct=letters[letter_index]['char']
                assert page.evaluate('__audioCalls.at(-1).gesture')
                if index==0:
                    page.locator('#training-listen').tap()
                    assert page.evaluate('__audioCalls.at(-1).src')==src
            seen.append(correct)
            options=page.locator('#training-options button').all_text_contents();assert len(options)==len(set(options))==4;assert correct in options
            selected=next(o for o in options if o!=correct) if index==0 else correct
            page.locator('#training-options button').filter(has_text=re.compile('^'+re.escape(selected)+'$')).tap()
            assert page.locator('#training-options button:disabled').count()==4
            assert page.locator('#training-options .is-correct').inner_text()==correct
            assert page.locator('#training-feedback .letter-target').count()==1
            assert page.locator('#training-progress').get_attribute('value')==str(index+1)
            if index==0:
                feedback=page.locator('#training-feedback').inner_text()
                page.locator('#app-language-select').select_option('de')
                assert page.locator('#training-options .is-wrong').inner_text()==selected
                assert page.locator('#training-score').inner_text()=='0 von 1 richtig'
                page.locator('#app-language-select').select_option('ar')
                assert page.locator('#training-feedback').inner_text()==feedback
            if index==1:
                page.locator('#training-previous').tap()
                assert page.locator('#training-options button:disabled').count()==4
                assert page.locator('#training-progress').get_attribute('value')=='2'
                page.locator('#training-next').tap()
            page.locator('#training-next').tap()
        assert len(set(seen))==28,(mode,seen)
        assert page.locator('#training-result').is_visible()
        assert '27 من 28' in page.locator('#training-result-score').inner_text()
        page.locator('#training-review').tap()
        assert page.locator('#training-options button:disabled').count()==4
        assert page.locator('#training-score').inner_text()=='27 من 28 إجابات صحيحة'
        # Changing the mode and returning preserves answers and current question.
        other='forms' if mode=='names' else 'names'
        choose_mode(other)
        choose_mode(mode)
        assert page.locator('#training-options button:disabled').count()==4
        assert page.locator('#training-score').inner_text()=='27 من 28 إجابات صحيحة'
        # Navigate the already-answered round to its summary and start over.
        for _ in range(28):page.locator('#training-next').tap()
        page.locator('#training-restart').tap()
        assert page.locator('#training-score').inner_text()=='0 من 0 إجابات صحيحة'
        assert page.locator('#training-next').is_disabled()
        # Drop the restarted round before next mode; the browser remains the same session.
        page.reload();page.locator('#app-language-select').select_option('ar')
        print('PASS exercise:',mode,'28 letters, feedback, review, language switch, session state and restart',flush=True)
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for width in [320,390,768,1440]:
            page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(200)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,width)
            assert page.locator('#training-run').bounding_box()['width']<=width
    page.locator('#app-language-select').select_option('ar');page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path='/tmp/jisr-letter-training-mobile.png')
    page.set_viewport_size({'width':1440,'height':1000});page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(250);page.screenshot(path='/tmp/jisr-letter-training-desktop.png')
    assert not errors,errors
    assert not external,external
    print('PASS: touch playback of bundled Arabic MP3s with all external requests blocked, 112 questions across four modes, mobile Chrome layout and no JS errors',flush=True)
    browser.close()
