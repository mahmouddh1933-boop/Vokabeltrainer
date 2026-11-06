"""Bundled sentence audio, word/sentence exclusivity, cancellation and mobile layout."""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
p=argparse.ArgumentParser()
p.add_argument('--base-url',default='http://127.0.0.1:8052')
p.add_argument('--inline',action='store_true')
a=p.parse_args()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 ctx=browser.new_context(viewport={'width':390,'height':900},is_mobile=True,has_touch=True,service_workers='block')
 ctx.add_init_script("""localStorage.setItem('vocabInterfaceLanguage','de');localStorage.setItem('oliveLearnerThemeV1','neutral');
 const original=HTMLMediaElement.prototype.play;
 HTMLMediaElement.prototype.play=function(){if(this.dataset.readingWord)window.__word=this;return original.call(this)};""")
 page=ctx.new_page();errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 if a.inline:page.route('**/*',lambda r:r.abort() if r.request.resource_type in ['script','stylesheet'] else r.continue_())
 page.goto(a.base_url+'/reading-trainer.html');page.wait_for_selector('.rt-sentence-card audio')
 expect(page.locator('.rt-sentence-text').nth(0)).to_have_text('كَتَبَ سَامِرٌ.')
 expect(page.locator('.rt-sentence-text').nth(1)).to_have_text('كَتَبَ سَامِرٌ كَلِمَةً.')
 assert page.locator('.rt-sentence-text mark').all_text_contents()==['كَتَبَ','كَتَبَ']
 assert page.locator('.rt-sentence-translation').nth(0).is_hidden()
 page.locator('.rt-sentence-card summary').nth(0).tap()
 expect(page.locator('.rt-sentence-translation').nth(0)).to_be_visible()
 expect(page.locator('.rt-sentence-translation').nth(0)).to_have_text('Samer schrieb.')
 # Native controls request a real local recording, without TTS or an API.
 page.locator('.rt-sentence-card audio').nth(0).evaluate('a=>a.play()')
 page.wait_for_function('document.querySelector(".rt-sentence-card audio").currentTime>.15')
 expect(page.locator('.rt-sentence-card').nth(0)).to_have_class('rt-sentence-card is-playing')
 page.locator('#rt-compare-word').tap();page.wait_for_function('window.__word&&!__word.paused')
 assert page.locator('.rt-sentence-card audio').nth(0).evaluate('a=>a.paused')
 page.locator('.rt-sentence-card audio').nth(1).evaluate('a=>a.play()')
 page.wait_for_function('!document.querySelectorAll(".rt-sentence-card audio")[1].paused')
 assert page.evaluate('__word.paused')
 assert not page.evaluate("VocabApp.getStats().readingTrainerV1?.heard.includes('rt-1-01')")
 page.locator('#rt-speed').select_option('0.8')
 assert page.locator('.rt-sentence-card audio').nth(1).evaluate('a=>a.playbackRate')==.8
 page.locator('#rt-stop').tap()
 assert page.locator('.rt-sentence-card audio').nth(1).evaluate('a=>a.paused')
 # A detached recording must stop and lose its resource when navigating away.
 page.locator('.rt-sentence-card audio').nth(0).evaluate('a=>{window.__old=a;return a.play()}')
 page.locator('#rt-next').tap()
 assert page.evaluate('__old.paused&&!__old.getAttribute("src")')
 expect(page.locator('.rt-sentence-text').nth(0)).to_have_text('قَرَأَ عُمَرُ.')
 # An unavailable recording reports a local error instead of silently switching voices.
 broken=page.locator('.rt-sentence-card audio').nth(0).get_attribute('src')
 page.route('**/'+broken,lambda r:r.abort())
 page.locator('.rt-sentence-card audio').nth(0).evaluate('a=>{a.load();a.play().catch(()=>{})}')
 expect(page.locator('.rt-sentence-error').nth(0)).not_to_be_empty()
 page.unroute('**/'+broken)
 page.locator('.rt-sentence-card audio').nth(0).evaluate('a=>{a.load();return a.play()}')
 page.wait_for_function('document.querySelector(".rt-sentence-card audio").currentTime>.1')
 expect(page.locator('.rt-sentence-error').nth(0)).to_be_empty()
 page.locator('[data-level="2"]').tap();page.locator('#rt-word-select').select_option('30')
 assert page.locator('#rt-letter-strip button').all_text_contents()==['مَ','مَدْ','رَ','سَ','سَة']
 assert page.locator('.rt-sentence-text mark').all_text_contents()==['مَدْرَسَةٌ','مَدْرَسَةٌ']
 # Long vowels, shadda and contextual coda sounds expose what is actually heard.
 page.locator('#rt-word-select').select_option('18')
 assert page.locator('#rt-letter-strip button').all_text_contents()==['كِ','تَ','تَا','تَابْ']
 for language in ['de','ar']:
  page.locator('#app-language-select').select_option(language)
  for width in [320,390,768,1440]:
   page.set_viewport_size({'width':width,'height':900})
   for level in ['1','2','3']:
    page.locator('[data-level="'+level+'"]').tap()
    for index in ['0','10','30','49']:
     page.locator('#rt-word-select').select_option(index)
     assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(language,width,level,index)
     assert page.locator('.rt-sentence-card audio').count()==2
     for audio in page.locator('.rt-sentence-card audio').all():
      assert audio.evaluate('a=>a.getBoundingClientRect().width<=a.parentElement.clientWidth')
 page.set_viewport_size({'width':390,'height':900})
 page.locator('[data-level="1"]').tap();page.locator('#rt-word-select').select_option('0')
 page.locator('#rt-sentences').scroll_into_view_if_needed()
 Path('/tmp/olive-reading-sentences').mkdir(exist_ok=True)
 page.screenshot(path='/tmp/olive-reading-sentences/mobile-sentences.png')
 assert not errors,errors
 browser.close()
 print('PASS 300 sentence data, real local playback, exclusive audio, navigation cleanup, speed, honest progress, contextual decomposition and AR/DE mobile layout')
