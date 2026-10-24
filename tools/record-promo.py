"""Record genuine app interactions inside the bilingual Full-HD promotional stage.

Start the app locally first. Uses disposable browser storage, never real accounts.
"""
import argparse
import json
from pathlib import Path
import re
import subprocess
import time
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--directory',type=Path,default=Path('/tmp/olive-promo-build'))
parser.add_argument('--base-url',default='http://127.0.0.1:8040')
parser.add_argument('--language',choices=['de','ar'],required=True)
parser.add_argument('--preview',action='store_true')
parser.add_argument('--scenes',default='')
args = parser.parse_args()
out=args.directory.resolve();lang=args.language;base=args.base_url.rstrip('/')
data=json.loads((out/f'timeline-{lang}.json').read_text())
(out/'frames').mkdir(exist_ok=True)
(out/f'capture-{lang}').mkdir(exist_ok=True)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'],headless=True)
    context=browser.new_context(viewport={'width':1920,'height':1080},device_scale_factor=1,
        **({} if args.preview else dict(record_video_dir=str(out/f'capture-{lang}'),record_video_size={'width':1920,'height':1080})))
    context.add_init_script("localStorage.setItem('vocabInterfaceLanguage',"+json.dumps(lang)+");localStorage.setItem('lettersLanguage',"+json.dumps(lang)+");localStorage.setItem('oliveLearnerThemeV1','neutral');")
    # A visible touch halo makes real clicks easy to follow. No application source is changed.
    context.add_init_script('''document.addEventListener('pointerdown',e=>{
      const n=document.createElement('i');n.style.cssText=`position:fixed;left:${e.clientX-18}px;top:${e.clientY-18}px;width:36px;height:36px;border:3px solid #bc9849;border-radius:50%;background:#d3c78333;pointer-events:none;z-index:99999`;document.body.append(n);n.animate([{transform:'scale(.7)',opacity:1},{transform:'scale(1.6)',opacity:0}],{duration:650,fill:'forwards'});setTimeout(()=>n.remove(),700);
    },true);''')
    context.route('**/media/promo/timeline-*.json',lambda r:r.fulfill(path=str(out/f'timeline-{lang}.json'),content_type='application/json'))
    # Complete a real sample check once; its saved report can then be shown without
    # speeding through unheard listening questions during the advertisement.
    seed_path=out/'placement-sample.json'
    seed_page=context.new_page()
    if not seed_path.exists():
        seed_page.goto(base+'/placement.html')
        seed_page.locator('[data-start-test=quick][data-form=A]').click()
        tasks=seed_page.evaluate('''()=>{const id=new URLSearchParams(location.hash.slice(1)).get('attempt');return Placement.questions(VocabApp.getStats().placementV1.attempts[id]);}''')
        for i,q in enumerate(tasks):
            if q['domain']=='listening':
                seed_page.locator('#placement-listen').click()
                seed_page.locator('#placement-options button').first.wait_for(state='visible')
                seed_page.wait_for_function('!document.querySelector("#placement-options button").disabled',timeout=30000)
            seed_page.locator('#placement-options button').nth((q['correct']+1)%len(q['options']) if i in [0,8] else q['correct']).click()
            if i<len(tasks)-1:seed_page.locator('#placement-next').click()
        seed_page.locator('#placement-submit').click()
        seed_path.write_text(json.dumps(seed_page.evaluate('VocabApp.getStats()'),ensure_ascii=False)+'\n')
    else:
        seed_page.goto(base+'/index.html')
        seed_page.evaluate('s=>VocabApp.setJSON("learningStats",s)',json.loads(seed_path.read_text()))
    seed_page.close()
    page=context.new_page();page.set_default_timeout(2200);errors=[];warnings=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(base+f'/media/promo/stage.html?lang={lang}')
    page.wait_for_function('typeof startPresentation==="function"')
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(300)

    def frame():
        return page.locator('#app').element_handle().content_frame()
    def scroll(selector,block='center'):
        f=frame();f.locator(selector).first.wait_for(state='visible')
        f.locator(selector).first.evaluate('(n,b)=>n.scrollIntoView({block:b,behavior:"smooth"})',block)
    def click(selector):
        frame().locator(selector).first.click()
    def go(name):
        page.locator('#window').evaluate('n=>n.dataset.ready="false"')
        frame().goto(base+'/'+name+'.html')
    def select_list():
        frame().evaluate('''()=>VocabApp.saveVocabList([
          ['رُمَّانٌ','der Granatapfel'],['عِنَبٌ','die Trauben'],['تُفَّاحٌ','der Apfel'],['مَوْزٌ','die Banane']
        ],{type:'ready-list',id:'a1_12',title:'الفواكه والخضروات',levelTitle:'A1'})''')
    def show_card():
        select_list();go('lernseite');scroll('#flashcard')
    def letter_forms():
        click('#letter-next');scroll('#letter-card');click('#letter-card')
    def writing():
        scroll('#writing-canvas');canvas=frame().locator('#writing-canvas')
        page.wait_for_timeout(350);box=canvas.bounding_box()
        import math
        page.mouse.move(box['x']+box['width']*.65,box['y']+box['height']*.44);page.mouse.down()
        for i in range(1,20):page.mouse.move(box['x']+box['width']*(.65-.34*i/19),box['y']+box['height']*(.44+.20*math.sin(i/19*math.pi)))
        page.mouse.up()
    def focus_exercise():
        scroll('#letter-focused-practice');buttons=frame().locator('#focused-options button')
        if buttons.count():buttons.first.click()
    def circle_mode():
        click('[data-focused-mode=circle]');scroll('#focused-options')
        frame().locator('#focused-options button').first.click()
    def sound_page():
        go('sounds');scroll('#sound-question') if frame().locator('#sound-question').count() else scroll('#sound-options')
    def reading_mode(mode):
        click('[data-mode='+mode+']');scroll('#phonics-display')
    def answer_reading():
        f=frame();q=f.evaluate('ArabicPhonicsData.segment[0]')
        f.locator('#phonics-options button').filter(has_text=re.compile('^'+re.escape(q['options'][q['correct']] if isinstance(q['correct'],int) else q['correct'])+'$')).first.click() if 'correct' in q else f.locator('#phonics-options button').first.click()
    def test_demo():
        f=frame();f.evaluate("VocabApp.saveVocabList([['صَبَاحُ الْخَيْرِ','Guten Morgen']],{type:'custom',id:'promo-demo'})")
        go('test5');scroll('.scramble-answer')
    def solve_scramble():
        f=frame();word=f.evaluate('VocabApp.stripArabicDiacritics(VocabApp.getCurrentVocabList()[0][0])')
        for char in word.replace(' ',''):
            f.locator('.scramble-tile:enabled').filter(has_text=re.compile('^'+re.escape(char)+'$')).first.click();page.wait_for_timeout(120 if not args.preview else 20)
        click('#submit-test')
    def sentence_answer():
        f=frame()
        for _ in range(12):
            if f.locator('#sentence-check').is_enabled():break
            click('#sentence-hint');page.wait_for_timeout(160 if not args.preview else 30)
        click('#sentence-check');scroll('#sentence-answer')
    def story_view():
        scroll('#story-lines');click('#story-translation')
    def open_book():
        go('youth-book-two-part-one');scroll('#yt-title')
    def grammar_sample():
        f=frame();q=f.evaluate('ArabicGrammarData.lessons[0].questions[0]')
        scroll('#grammar-question');f.locator('#grammar-answers button').nth(q['correct']).click()
    def verbs_view():
        go('verbs');scroll('#verb-select');click('[data-tense=present]')
    def imperative():
        click('[data-tense=imperative]');scroll('#conjugation-body')
    def placement_start():
        click('[data-start-test=quick][data-form=A]');scroll('#placement-question')
    def placement_result():
        # A previously completed sample check is opened through the app's actual history.
        click('#placement-close')
        frame().locator('#placement-history [data-attempt]').last.click()
        scroll('#placement-results','start')
    def start_exam():
        click('[data-start-exam=model-01]');scroll('.exam-task')
    def exam_answer():
        f=frame();q=f.evaluate('TeacherExams.tasks(TeacherExamData.exams.find(e=>e.id==="model-01"))[0]')
        f.evaluate('''q=>{const n=[...document.querySelector(`[data-question="${q.id}"]`).querySelectorAll('input')].find(n=>n.value===q.answer);n.click();}''',q)
        click('#exam-back')
    def prepare_review():
        f=frame();f.evaluate("VocabApp.addWrongWord('رُمَّانٌ','der Granatapfel','writing')")
        go('review');scroll('#review-card');click('#review-card')
    def stats():
        go('stats');scroll('.stats-grid' if frame().locator('.stats-grid').count() else '.stat-card')
    def excel():
        click('#show-excel-button');scroll('#excel-panel','start')
    def theme():
        click('.olive-theme-open')

    actions={
      'path':[(.12,lambda:scroll('#overall-learning-path','start')),(.58,lambda:frame().locator('#overall-learning-path li').nth(4).evaluate('n=>n.scrollIntoView({block:"center",behavior:"smooth"})'))],
      'letters':[(.12,lambda:scroll('#letter-card')),(.36,letter_forms),(.64,lambda:scroll('#harakat-row')),(.82,writing)],
      'sounds':[(.12,focus_exercise),(.32,circle_mode),(.60,sound_page)],
      'reading':[(.12,lambda:scroll('#phonics-display')),(.38,answer_reading),(.61,lambda:reading_mode('blend')),(.82,lambda:reading_mode('family'))],
      'vocab':[(.10,lambda:scroll('#ready-lists-panel','start')),(.32,lambda:click('[data-level-id=A2]')),(.49,show_card),(.69,lambda:click('#flashcard')),(.85,lambda:click('#next-button'))],
      'tests':[(.12,lambda:scroll('.test-button-group')),(.40,test_demo),(.65,solve_scramble)],
      'sentences':[(.12,lambda:scroll('#sentence-answer')),(.38,sentence_answer)],
      'stories':[(.13,lambda:scroll('#story-title')),(.40,story_view),(.75,lambda:scroll('#story-question'))],
      'books':[(.13,lambda:scroll('.route-grid')),(.50,open_book)],
      'grammar':[(.08,lambda:scroll('#grammar-stages')),(.27,grammar_sample),(.49,verbs_view),(.76,imperative)],
      'placement':[(.10,lambda:scroll('#placement-catalog')),(.35,placement_start),(.65,placement_result)],
      'exams':[(.10,lambda:scroll('#exam-catalog')),(.37,start_exam),(.74,exam_answer)],
      'progress':[(.12,prepare_review),(.55,stats)],
      'flexible':[(.12,excel),(.45,theme),(.63,lambda:click('[data-learner-choice=boy]')),(.80,lambda:go('index'))]
    }

    if not args.preview:
        page.evaluate('startPresentation()')
    for scene in data['scenes']:
        if args.scenes and scene['id'] not in args.scenes.split(','):continue
        if args.preview:
            page.evaluate('i=>showSceneForPreview(i)',scene['index']);page.wait_for_timeout(300)
        else:
            page.wait_for_function('i=>presentation.current===i',arg=scene['index'],timeout=30000)
        page.wait_for_timeout(200)
        if scene['id'] not in ['intro','outro']:
            frame().wait_for_load_state('domcontentloaded')
        for fraction,action in actions.get(scene['id'],[]):
            if not args.preview:
                now=page.evaluate('presentation.time');target=scene['start']+(scene['end']-scene['start'])*fraction
                page.wait_for_timeout(max(0,(target-now)*1000))
                if page.evaluate('presentation.current') != scene['index']:break
            try:
                action()
            except Exception as error:
                warnings.append(f'{scene["id"]} at {fraction}: {str(error).splitlines()[0]}')
                print('WARNING',warnings[-1],flush=True)
        if args.preview:
            page.wait_for_timeout(500);page.screenshot(path=str(out/'frames'/f'{lang}-{scene["index"]:02}-{scene["id"]}.png'))
        print(lang,scene['id'],'preview' if args.preview else 'recorded',flush=True)
    result=dict(language=lang,errors=errors,warnings=warnings)
    if not args.preview:
        page.wait_for_function('presentation.finished',timeout=30000);page.wait_for_timeout(300)
        elapsed=page.evaluate('presentation.time');video=page.video;context.close();path=video.path()
        duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(path)]))
        result.update(video=str(path),offset=max(0,duration-elapsed),duration=data['duration'])
    else:context.close()
    browser.close()
    (out/f'{"preview" if args.preview else "capture"}-{lang}.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    if errors or warnings:raise SystemExit('Inspect the recorded warnings/errors before rendering a release.')
