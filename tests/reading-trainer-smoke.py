"""Real vowel sounds, cumulative prefixes, clock highlights, persistence and AR/DE layouts."""
import argparse, unicodedata
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

p = argparse.ArgumentParser()
p.add_argument('--base-url', default='http://127.0.0.1:8044')
p.add_argument('--file', type=Path)
p.add_argument('--inline', action='store_true', help='Test extracted ZIP over HTTP with all separate scripts/styles blocked')
args = p.parse_args()
base = args.base_url.rstrip('/')
url = (args.file/'reading-trainer.html').as_uri() if args.file else base+'/reading-trainer.html'
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    ctx = browser.new_context(viewport={'width':390,'height':900}, is_mobile=True, has_touch=True, service_workers='block')
    ctx.add_init_script("""
        localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral');
        const original=HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play=function(){window.__rtAudio=this;return original.call(this)};
        window.__seen=[];window.__mismatches=[];
        setInterval(()=>{
          const a=window.__rtAudio,D=window.ArabicReadingTrainer;
          if(!a||a.paused||!D)return;
          const w=D.words.find(w=>w.id===a.dataset.readingWord);if(!w)return;
          const e=w.events.find(e=>a.currentTime>e.start+.09&&a.currentTime<e.end-.09);if(!e)return;
          const li=document.querySelector('#rt-stages [aria-current="step"]');
          if(!li)return;
          const actual=[...document.querySelector('#rt-word').children].flatMap((n,i)=>n.classList.contains('rt-active')?[i]:[]);
          const expected=e.stage==='letters'?w.sounds[e.index].letters:e.stage==='prefixes'?w.prefixes[e.index].letters:w.letters.map((_,i)=>i);
          window.__seen.push(e.stage+':'+e.index);
          if(li.dataset.stage!==e.stage||JSON.stringify(actual)!==JSON.stringify(expected))window.__mismatches.push({time:a.currentTime,e,actual,expected});
        },35);
    """)
    page = ctx.new_page()
    if args.inline:
        page.route('**/*',lambda r:r.abort() if r.request.resource_type in ['script','stylesheet'] else r.continue_())
    errors=[];bad=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('response',lambda r:bad.append(r.url) if r.status>=400 else None)
    page.goto(url)
    page.wait_for_selector('#rt-word span')
    page.evaluate('document.fonts.ready')
    assert page.locator('.app-sidebar a[aria-current=page]').get_attribute('href') == 'reading.html'
    assert page.locator('#rt-word-select option').count()==50
    expect(page.locator('#rt-word')).to_have_text('كَتَبَ')
    # A completed real track must light every vowel sound, growing prefix and word.
    page.locator('#rt-listen').tap()
    page.wait_for_function("VocabApp.getStats().readingTrainerV1?.heard.includes('rt-1-01')",timeout=25000)
    assert set(page.evaluate('__seen')) == {'letters:0','letters:1','letters:2','prefixes:0','prefixes:1','word:0'}
    assert not page.evaluate('__mismatches'),page.evaluate('__mismatches')
    assert page.locator('#rt-word .rt-active').count()==0
    page.locator('#rt-self-read').tap();page.reload()
    expect(page.locator('#rt-self-read')).to_have_attribute('aria-pressed','true')
    assert page.evaluate("VocabApp.getStats().readingTrainerV1.heard")==['rt-1-01']
    # Pause, speed and resume follow the media clock, without adding completion.
    page.locator('#rt-next').tap();page.locator('#rt-listen').tap()
    page.wait_for_function('window.__rtAudio&&!__rtAudio.paused&&__rtAudio.currentTime>.2')
    page.locator('#rt-pause').tap()
    paused=page.evaluate('__rtAudio.currentTime');page.wait_for_timeout(450)
    assert abs(page.evaluate('__rtAudio.currentTime')-paused)<.04
    page.locator('#rt-speed').select_option('0.8')
    page.locator('#rt-pause').tap();page.wait_for_function('!__rtAudio.paused')
    assert page.evaluate('__rtAudio.playbackRate')==.8
    page.locator('#rt-stop').tap();assert page.evaluate('__rtAudio.paused')
    assert not page.evaluate("VocabApp.getStats().readingTrainerV1.heard.includes('rt-1-02')")
    # A stage-only/individual replay cannot count as hearing the complete track.
    for selector in ['[data-play=word]','#rt-letter-strip button:first-child','#rt-prefixes button:first-child']:
        page.locator(selector).tap()
        page.wait_for_function('!document.querySelector("#rt-status").textContent.includes("جارٍ")')
        page.wait_for_function('document.querySelector("#rt-stop").disabled',timeout=12000)
        assert not page.evaluate("VocabApp.getStats().readingTrainerV1.heard.includes('rt-1-02')")
    page.locator('[data-level="3"]').tap()
    assert page.locator('[data-level="3"]').evaluate('n=>getComputedStyle(n).backgroundColor')=='rgb(40, 91, 70)'
    data=page.evaluate('ArabicReadingTrainer')
    # Canonical Unicode mark order can differ in source strings.
    teacher=next(w for w in data['words'] if unicodedata.normalize('NFC',w['word'])==unicodedata.normalize('NFC','مُعَلِّمْ'))
    teacher_index=[w['id'] for w in data['words'] if w['level']=='3'].index(teacher['id'])
    page.locator('#rt-word-select').select_option(str(teacher_index))
    page.evaluate('__seen=[];__mismatches=[]')
    page.locator('#rt-listen').tap()
    page.wait_for_function("id=>VocabApp.getStats().readingTrainerV1.heard.includes(id)",arg=teacher['id'],timeout=25000)
    assert not page.evaluate('__mismatches'),page.evaluate('__mismatches')
    assert 'prefixes:1' in page.evaluate('__seen') and 'prefixes:2' in page.evaluate('__seen')
    # المدرسة-style reading is cumulative, not disjoint syllables.
    page.locator('[data-level="2"]').tap()
    school=next(w for w in data['words'] if w['word']==unicodedata.normalize('NFC','مَدْرَسَة'))
    school_index=[w['id'] for w in data['words'] if w['level']=='2'].index(school['id'])
    page.locator('#rt-word-select').select_option(str(school_index))
    assert page.locator('#rt-prefixes button').all_text_contents()==['مَدْ','مَدْرَ','مَدْرَسَ','مَدْرَسَة']
    assert page.locator('#rt-prefixes button').evaluate_all('nodes=>nodes.map(n=>n.dataset.count)')==['2','3','4','5']
    page.evaluate('__seen=[];__mismatches=[]')
    page.locator('[data-play=prefixes]').tap()
    page.wait_for_function('document.querySelector("#rt-stop").disabled',timeout=16000)
    assert set(page.evaluate('__seen'))=={'prefixes:0','prefixes:1','prefixes:2','prefixes:3'},page.evaluate('({seen:[...new Set(__seen)],mismatches:__mismatches})')
    assert not page.evaluate('__mismatches'),page.evaluate('__mismatches')
    assert not page.evaluate("id=>VocabApp.getStats().readingTrainerV1.heard.includes(id)",school['id'])
    # Every word fits a 320px phone, including the longest words with diacritics.
    page.set_viewport_size({'width':320,'height':900})
    for level in ['1','2','3']:
        page.locator('[data-level="'+level+'"]').tap()
        page.locator('#rt-word-select').select_option('0')
        assert page.locator('#rt-word-select option').count()==50
        assert page.locator('#rt-prev').is_disabled()
        for i in range(50):
            page.locator('#rt-word-select').select_option(str(i))
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(level,i)
            assert page.locator('#rt-word').evaluate('n=>n.scrollWidth<=n.clientWidth'),(level,i)
        assert page.locator('#rt-next').is_disabled()
    for language in ['ar','de']:
        page.locator('#app-language-select').select_option(language)
        for width in [320,390,768,1440]:
            page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(100)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,width)
            boxes=page.locator('.rt-transport button,.rt-stages button,.rt-navigation button').evaluate_all('nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON())')
            for i,a in enumerate(boxes):
                assert a['height']>=44
                for c in boxes[i+1:]:
                    assert min(a['right'],c['right'])-max(a['left'],c['left'])<=1 or min(a['bottom'],c['bottom'])-max(a['top'],c['top'])<=1
    page.set_viewport_size({'width':390,'height':900});page.locator('#app-language-select').select_option('ar')
    page.wait_for_timeout(400)  # Let the responsive sidebar finish its closing transition.
    page.locator('#rt-word-select').select_option('10')
    page.locator('#rt-word').scroll_into_view_if_needed()
    page.screenshot(path='/tmp/olive-reading-trainer/verified-mobile.png')
    # Navigation cancels both audio and highlight, without stale end callbacks.
    page.locator('#rt-listen').tap();page.wait_for_function('!__rtAudio.paused')
    page.locator('#rt-next').tap();page.wait_for_timeout(500)
    assert page.evaluate('__rtAudio.paused') and page.locator('#rt-word .rt-active').count()==0
    if not args.file:
        page.route('**/audio/reading-trainer/rt-2-01-sounds-v2.mp3', lambda r:r.abort())
        page.locator('[data-level="2"]').tap()
        page.locator('#rt-word-select').select_option('0')
        page.locator('#rt-listen').tap()
        page.wait_for_selector('#rt-status.is-error',timeout=18000)
        assert not page.evaluate("VocabApp.getStats().readingTrainerV1.heard.includes('rt-2-01')")
        assert page.locator('#rt-stop').is_disabled()
        page.unroute('**/audio/reading-trainer/rt-2-01-sounds-v2.mp3')
        page.goto(base+'/reading.html')
        assert page.locator('a[href="reading-trainer.html"]').count()==1
        assert page.locator('#phonics-modes button').count()==4
    assert not errors,errors
    assert not bad,bad
    browser.close()
    print('PASS vowel sounds, cumulative 2/3/4/5-letter prefixes and clock highlights, pause/resume/speed, cancellation, progress, all 150 words at 320px and AR/DE layouts',flush=True)
