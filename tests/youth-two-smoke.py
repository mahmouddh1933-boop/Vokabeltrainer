"""Exercise all photo-derived tasks through the real UI, with network-independent audio."""
from playwright.sync_api import sync_playwright, expect
import argparse
import math
from collections import Counter

parser = argparse.ArgumentParser(description='All activities in تدريبات الشباب 2')
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
base = parser.parse_args().base_url.rstrip('/')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width':390,'height':950}, is_mobile=True, has_touch=True)
    page = context.new_page()
    errors, external, failed, played = [], [], [], set()
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('response', lambda r: failed.append(r.url) if r.status >= 400 else None)
    def route_request(route):
        if route.request.url.startswith(base + '/'):
            route.continue_()
        else:
            external.append(route.request.url)
            route.abort()
    page.route('**/*', route_request)
    page.add_init_script('''window.__ytPlays=0;window.__ytAudioCalls=[];window.__ytPrints=0;
      window.print=()=>window.__ytPrints++;
      const play=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){
        __ytAudioCalls.push({src:this.src,gesture:navigator.userActivation.isActive});
        this.addEventListener('playing',()=>__ytPlays++,{once:true});
        return play.call(this);
      };''')
    assert page.goto(base+'/youth-training-two.html').status == 200
    page.locator('#app-language-select').select_option('ar')
    expect(page.locator('#lesson-loading')).to_have_count(0)
    assert page.locator('.app-sidebar a[aria-current="page"]').get_attribute('href') == 'youth-training-two.html'
    activities = page.evaluate('ArabicYouthTwoData.activities')
    sources = page.evaluate('ArabicYouthTwoData.sources')
    assert len(sources) == 31
    assert page.locator('#yt-sources [data-photo]').count() == 31
    assert set(page.locator('#yt-sources [data-photo]').evaluate_all('ns=>ns.map(n=>n.dataset.photo)')) == {s['photo'] for s in sources}
    assert page.locator('#yt-select option').count() == len(activities)
    vocab_stats = page.evaluate('VocabApp.getStats()')
    kinds = Counter(q['kind'] for a in activities for q in a['tasks'])
    fixed_total = sum(n for kind,n in kinds.items() if kind != 'open')
    open_total = kinds['open']
    wrong_tested, tested_kinds = set(), set()
    fixed_done = open_done = 0
    first_open = first_fixed = first_order = first_clock = None
    def pick(activity):
        page.locator('#yt-select').select_option(activity['id'])
        expect(page.locator('#yt-title')).to_have_text(activity['title'])
    def result(card, correct=True):
        feedback = card.locator('.yt-feedback')
        expect(feedback).not_to_be_empty()
        assert feedback.evaluate('(n,correct)=>n.classList.contains(correct?"is-correct":"is-wrong")', correct), feedback.inner_text()
    def checked_answer(task, value):
        return page.evaluate('([task,value])=>ArabicYouthTwoData.isCorrect(task,value)', [task,value])
    def play_control(control):
        text=control.get_attribute('data-audio')
        expected=page.evaluate('text=>ArabicYouthTwoData.audio[text.normalize("NFC")]',text)
        assert expected,text
        before=page.evaluate('__ytPlays')
        control.tap()
        page.wait_for_function('before=>__ytPlays>before',arg=before)
        call=page.evaluate('__ytAudioCalls.at(-1)')
        assert call['gesture'] and call['src'].endswith(expected),(call,expected)
        played.add(expected)
    def answer(task, wrong=False):
        card = page.locator('#yt-q-'+task['id'])
        kind = task['kind']
        if task.get('audioText'):
            play_control(card.locator('[data-audio]').first)
        if kind == 'choice':
            value = next(v for v in task['options'] if not checked_answer(task,v)) if wrong else task['answer']
            choices = card.locator('.yt-option')
            for choice in choices.all():
                if choice.get_attribute('data-value') == value:
                    choice.tap()
                    break
            else:
                raise AssertionError(('Missing exact choice',task,value))
        elif kind == 'input':
            value = 'إجابة تجريبية لا تطابق المطلوب' if wrong else task['answer']
            card.locator('.yt-input').fill(value)
            card.locator('.yt-check').tap()
        elif kind == 'order':
            while card.locator('.yt-selected button').count():
                card.locator('.yt-selected button').first.tap()
            order = list(range(len(task['tokens'])))
            if wrong:
                candidates = [order[::-1], order[1:]+order[:1]]
                for index in range(len(order)-1):
                    changed=order[:];changed[index],changed[index+1]=changed[index+1],changed[index]
                    candidates.append(changed)
                joiner = task.get('join',task.get('joiner',' '))
                order = next(candidate for candidate in candidates if not checked_answer(task,joiner.join(task['tokens'][i] for i in candidate)))
            for index in order:
                card.locator(f'[data-token-index="{index}"]').tap()
            card.locator('.yt-check').tap()
        elif kind == 'mark':
            for pressed in card.locator('.yt-mark[aria-pressed="true"]').all():
                pressed.tap()
            indices = task['targets']
            if wrong:
                buttons=card.locator('.yt-mark')
                outside=[int(button.get_attribute('data-word-index')) for button in buttons.all() if int(button.get_attribute('data-word-index')) not in indices]
                indices=[outside[0]] if outside else indices[:-1]
            for index in indices:
                card.locator(f'.yt-mark[data-word-index="{index}"]').tap()
            card.locator('.yt-check').tap()
        elif kind == 'clock':
            hour = task['hour'] % 12 + 1 if wrong else task['hour']
            card.locator('select.yt-clock-hour').select_option(str(hour))
            card.locator('select.yt-clock-minute').select_option(str(task['minute']))
            card.locator('.yt-check').tap()
        else:
            raise AssertionError(('Unsupported fixed task kind',kind))
        result(card,not wrong)
        return card
    # Traverse the complete unfiltered catalog; every displayed answer is submitted through the UI.
    for index,activity in enumerate(activities):
        pick(activity)
        assert page.locator('#yt-tasks > .yt-task[data-kind][data-task]').count() == len(activity['tasks'])
        fixed=[q for q in activity['tasks'] if q['kind']!='open']
        opens=[q for q in activity['tasks'] if q['kind']=='open']
        for task in activity['tasks']:
            tested_kinds.add(task['kind'])
            if task['kind']=='open':
                card=page.locator('#yt-q-'+task['id'])
                draft=f'مسودة اختبار مستقلة {activity["id"]} {task["id"]}'
                before=page.locator('#yt-progress').get_attribute('value')
                card.locator('textarea.yt-draft').fill(draft)
                model=card.locator('details.yt-model')
                model.locator('summary').tap()
                assert task['model'] in model.inner_text()
                card.locator('input.yt-self-review').check()
                expect(card.locator('input.yt-self-review')).to_be_checked()
                assert page.locator('#yt-progress').get_attribute('value')==before,'Open review must not become a fixed correct answer'
                assert card.locator('.yt-feedback.is-correct').count()==0
                if first_open is None:first_open=(activity,task,draft)
                open_done+=1
            else:
                if first_fixed is None:first_fixed=(activity,task)
                if first_order is None and task['kind']=='order':first_order=(activity,task)
                if first_clock is None and task['kind']=='clock':first_clock=(activity,task)
                if task['kind'] not in wrong_tested:
                    card=answer(task,True)
                    page.locator('#yt-review').check()
                    expect(card).to_be_visible()
                    assert page.locator('#yt-tasks > .yt-task').count() >= 1
                    if not wrong_tested:
                        page.reload()
                        expect(page.locator('#yt-title')).to_have_text(activity['title'])
                        result(page.locator('#yt-q-'+task['id']),False)
                    page.locator('#yt-review').uncheck()
                    page.locator('#yt-q-'+task['id']).locator('.yt-retry').tap()
                    wrong_tested.add(task['kind'])
                answer(task)
                fixed_done+=1
        assert int(page.locator('#yt-progress').get_attribute('value'))==len(fixed),(activity['id'],page.locator('#yt-score').inner_text())
        if opens:
            assert page.locator('#yt-open-score').is_visible()
            assert page.locator('#yt-tasks input.yt-self-review:checked').count()==len(opens)
        page.locator('#yt-review').check()
        assert page.locator('#yt-tasks > .yt-task').count()==0,'Review should omit correct and open tasks'
        expect(page.locator('#yt-review-empty')).to_be_visible()
        page.locator('#yt-review').uncheck()
        if index % 10 == 0 or index==len(activities)-1:
            page.reload()
            expect(page.locator('#yt-title')).to_have_text(activity['title'])
            assert int(page.locator('#yt-progress').get_attribute('value'))==len(fixed)
            print(f'PASS {index+1}/{len(activities)} activities; {fixed_done} fixed answers and {open_done} open drafts/self-reviews',flush=True)
    assert fixed_done==fixed_total and open_done==open_total
    assert tested_kinds==set(kinds)
    assert wrong_tested==set(kinds)-{'open'}
    assert page.evaluate('VocabApp.getStats()')==vocab_stats
    # Playback uses an actual local file, initiated within the tap's activation window.
    for activity in activities:
        if not any(q.get('audioText') for q in activity['tasks']):continue
        pick(activity)
        for control in page.locator('#yt-workspace [data-audio]').all():
            text=control.get_attribute('data-audio')
            expected=page.evaluate('text=>ArabicYouthTwoData.audio[text.normalize("NFC")]',text)
            assert expected,text
            if expected in played:continue
            play_control(control)
    expected_audio=page.evaluate('Object.values(ArabicYouthTwoData.audio)')
    assert played==set(expected_audio),(played,set(expected_audio))
    # A completed task, an open draft and its self-review survive full reloads and language changes.
    if first_open:
        activity,task,draft=first_open;pick(activity);page.reload()
        card=page.locator('#yt-q-'+task['id'])
        expect(card.locator('textarea.yt-draft')).to_have_value(draft)
        expect(card.locator('input.yt-self-review')).to_be_checked()
        before=page.locator('#yt-progress').get_attribute('value')
        card.locator('input.yt-self-review').uncheck()
        assert page.locator('#yt-progress').get_attribute('value')==before
        card.locator('input.yt-self-review').check()
    # Search and categories genuinely narrow the catalog; all-state reset recovers it.
    page.locator('#yt-search').fill('لايوجدنشاطبهذاالاسم12345')
    expect(page.locator('#yt-empty')).to_be_visible()
    assert page.locator('#yt-select option').count()==0
    page.locator('#yt-clear-filters').tap()
    assert page.locator('#yt-select option').count()==len(activities)
    for category in sorted({a['category'] for a in activities}):
        page.locator(f'[data-category="{category}"]').tap()
        values=page.locator('#yt-select option').evaluate_all('ns=>ns.map(n=>n.value)')
        assert set(values)=={a['id'] for a in activities if a['category']==category},category
    page.locator('#yt-clear-filters').tap()
    term=activities[0]['title'].split()[0]
    page.locator('#yt-search').fill(term)
    assert 0<page.locator('#yt-select option').count()<=len(activities)
    page.locator('#yt-clear-filters').tap()
    pick(activities[0]);expect(page.locator('#yt-previous')).to_be_disabled()
    page.locator('#yt-next').tap();expect(page.locator('#yt-title')).to_have_text(activities[1]['title'])
    page.locator('#yt-previous').tap();expect(page.locator('#yt-title')).to_have_text(activities[0]['title'])
    pick(activities[-1]);expect(page.locator('#yt-next')).to_be_disabled()
    # Cover each renderer in both interface languages and at narrow phone through desktop widths.
    representatives={}
    for activity in activities:
        for task in activity['tasks']:representatives.setdefault(task['kind'],activity)
    for language in ['de','ar']:
        page.locator('#app-language-select').select_option(language)
        for kind,activity in representatives.items():
            pick(activity)
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':950})
                page.wait_for_timeout(50)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,kind,width)
            assert page.locator('#yt-title').inner_text()==activity['title'],'Arabic exercise text must remain Arabic'
    page.set_viewport_size({'width':390,'height':950})
    page.locator('#app-language-select').select_option('ar')
    if first_order:
        activity,task=first_order;pick(activity)
        card=page.locator('#yt-q-'+task['id']);card.locator('.yt-retry').tap()
        card.locator('[data-token-index="0"]').tap()
        # A selected token is reversible before checking; retrying does not require a reset of the entire catalog.
        selected=card.locator('.yt-selected button')
        if selected.count():
            selected.first.tap()
            expect(card.locator('[data-token-index="0"]')).to_be_enabled()
        else:
            raise AssertionError('Selected order token must be removable with a button')
        answer(task)
    if first_clock:
        activity,task=first_clock;pick(activity)
        card=page.locator('#yt-q-'+task['id']);card.locator('.yt-retry').tap()
        face=card.locator('.yt-clock-holder');face.scroll_into_view_if_needed()
        # The clock is genuinely operable by touch, in addition to its accessible select fields.
        for mode,angle in [('hour',(task['hour']%12)*30),('minute',task['minute']*6)]:
            card.locator('.yt-clock-modes button').nth(0 if mode=='hour' else 1).tap()
            rect=face.bounding_box();radius=min(rect['width'],rect['height'])*.30
            page.touchscreen.tap(rect['x']+rect['width']/2+math.sin(math.radians(angle))*radius,rect['y']+rect['height']/2-math.cos(math.radians(angle))*radius)
        expect(card.locator('select.yt-clock-hour')).to_have_value(str(task['hour']))
        expect(card.locator('select.yt-clock-minute')).to_have_value(str(task['minute']))
        card.locator('.yt-check').tap();result(card)
    # Both print scopes contain blank tasks, not stored corrections, drafts or checked state.
    activity,task=first_fixed;pick(activity)
    page.locator('#yt-print-activity').tap()
    assert page.evaluate('__ytPrints')==1
    page.emulate_media(media='print')
    expect(page.locator('#yt-print')).to_be_visible()
    assert page.locator('#yt-print .yt-print-task').count()==len(activity['tasks'])
    assert page.locator('#yt-print .is-correct, #yt-print .is-wrong').count()==0
    assert 'مسودة اختبار مستقلة' not in page.locator('#yt-print').inner_text()
    expect(page.locator('#yt-workspace')).to_be_hidden()
    page.pdf(path='/tmp/jisr-youth-two-activity.pdf',format='A4',print_background=False)
    page.emulate_media(media='screen')
    source_activity=max(activities,key=lambda a:sum(len(b['tasks']) for b in activities if b['source']==a['source']))
    pick(source_activity)
    source_count=sum(len(a['tasks']) for a in activities if a['source']==source_activity['source'])
    page.locator('#yt-print-source').tap()
    assert page.evaluate('__ytPrints')==2
    page.emulate_media(media='print')
    assert page.locator('#yt-print .yt-print-task').count()==source_count
    assert page.locator('#yt-print .is-correct, #yt-print .is-wrong').count()==0
    assert 'مسودة اختبار مستقلة' not in page.locator('#yt-print').inner_text()
    page.pdf(path='/tmp/jisr-youth-two-source.pdf',format='A4',print_background=False)
    page.emulate_media(media='screen')
    # Reset removes only this activity's checked answers. Other activities and open drafts stay intact.
    activity,task=first_fixed;pick(activity)
    reset=page.locator('#yt-reset');reset.evaluate('n=>n.closest("details").open=true');reset.tap()
    assert page.locator('#yt-progress').get_attribute('value')=='0'
    other=next(a for a in activities if a['id']!=activity['id'] and any(q['kind']!='open' for q in a['tasks']))
    pick(other)
    assert int(page.locator('#yt-progress').get_attribute('value'))==sum(q['kind']!='open' for q in other['tasks'])
    if first_open:
        open_activity,open_task,draft=first_open;pick(open_activity)
        expect(page.locator('#yt-q-'+open_task['id']+' textarea.yt-draft')).to_have_value(draft)
    assert page.evaluate('VocabApp.getStats()')==vocab_stats
    page.evaluate('scrollTo(0,0)')
    page.screenshot(path='/tmp/jisr-youth-two-mobile.png')
    page.set_viewport_size({'width':1440,'height':1000});page.wait_for_timeout(200)
    page.screenshot(path='/tmp/jisr-youth-two-desktop.png')
    assert not errors,errors
    assert not external,external
    assert not failed,failed
    browser.close()
    print(f'PASS: all {len(activities)} activities, {fixed_total} checked answers, {open_total} open drafts/self-reviews, 31 source bindings, {len(played)} actual local audio plays; wrong/retry, persistent state, search/categories, responsive DE/AR, blank print scopes and reset isolation',flush=True)
