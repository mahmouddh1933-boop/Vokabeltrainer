"""Corrected words, sukun context and touch playback without external services."""
from playwright.sync_api import sync_playwright
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
base = parser.parse_args().base_url.rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    page = context.new_page()
    errors, external = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    def route_request(route):
        if route.request.url.startswith(base):
            route.continue_()
        else:
            external.append(route.request.url)
            route.abort()
    page.route('**/*', route_request)
    page.add_init_script('''window.__playing=0;window.__lastAudio=null;
      const play=HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play=function(){
        window.__lastAudio={src:this.src,gesture:navigator.userActivation.isActive};
        this.addEventListener('playing',()=>window.__playing++,{once:true});
        return play.call(this);
      };''')
    assert page.goto(base+'/huruf.html').status == 200
    page.locator('#app-language-select').select_option('ar')
    letters = page.evaluate('ArabicLetterData.letters')
    page.evaluate('''() => {
      window.__spokenText = null;
      const speak = VocabApp.speakArabic;
      VocabApp.speakArabic = (text, status) => {
        window.__spokenText = text;
        return speak(text, status);
      };
    }''')
    def play(selector, expected):
        before = page.evaluate('__playing')
        page.locator(selector).tap()
        page.wait_for_function('before=>__playing>before', arg=before)
        actual = page.evaluate('__lastAudio')
        assert actual['gesture'] and actual['src'].endswith(expected), actual
    for index, letter in enumerate(letters):
        page.locator('#letters-grid button').nth(index).tap()
        play('#letter-speak', f'{index+1:02}-name-waqf.mp3')
        assert page.evaluate('__spokenText') == letter['spokenName']
        assert letter['spokenName'].endswith('ْ')
        assert page.locator('#sukun-sample').inner_text() == letter['sukunSample']
        play('#harakat-row button:nth-child(4)', f'{index+1:02}-vowel-3.mp3')
        if letter.get('spokenWord'):
            assert page.locator('#letter-card-word').inner_text() == letter['spokenWord']
            play('#card-say-word', f'{index+1:02}-word.mp3')
        if letter['char'] == 'ت':
            for mark in range(3):
                play(f'#harakat-row button:nth-child({mark+1})', f'03-vowel-{mark}.mp3')
    page.locator('#letters-grid button').nth(9).tap()
    page.wait_for_function('document.getElementById("letter-card-image").complete && document.getElementById("letter-card-image").naturalWidth>0')
    assert page.locator('#letter-card-image').get_attribute('src') == 'images/letters/10.png'
    for language in ['ar', 'de']:
        page.locator('#app-language-select').select_option(language)
        assert ('الحرف الساكن' if language == 'ar' else 'Sukun') in page.locator('#sukun-help-text').inner_text()
        for width in [320, 390, 1440]:
            page.set_viewport_size({'width': width, 'height': 900})
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (language, width)
    page.locator('#app-language-select').select_option('ar')
    page.set_viewport_size({'width': 390, 'height': 1000})
    # Let the sidebar's desktop-to-mobile closing animation finish before capture.
    page.wait_for_timeout(400)
    page.locator('#letter-card').scroll_into_view_if_needed()
    page.screenshot(path='/tmp/jisr-pronunciation-mobile.png')
    assert not errors, errors
    assert not external, external
    browser.close()
    print('PASS: all 28 final-sukun names and contextual sukun clips, six vocalized words, Ta vowels, pomegranate image, Arabic/German mobile layout and offline touch playback')
