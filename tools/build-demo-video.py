"""Build a German, landscape demo advert from real demo views and offline speech.

Requires FFmpeg, Chromium, Playwright, NumPy and piper-tts. Keep model/build files
outside the repository. No accounts, Firebase or production data are accessed.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import re
import shutil
import subprocess
import textwrap
import wave
import zipfile

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / 'media/demo-video'
p = argparse.ArgumentParser()
p.add_argument('--directory', type=Path, default=Path('/tmp/huroof-demo-video'))
p.add_argument('--model', type=Path)
p.add_argument('--demo-url', default='http://127.0.0.1:8086')
p.add_argument('--stage-url', default='http://127.0.0.1:8077')
p.add_argument('--step', choices=['all','audio','capture','render'], default='all')
a = p.parse_args()
OUT = a.directory.resolve()
OUT.mkdir(parents=True, exist_ok=True)
story = json.loads((MEDIA / 'storyboard.json').read_text())

def run(*cmd):
    subprocess.run([str(x) for x in cmd], check=True)

def stamp(t, ass=False):
    if ass:
        n = round(t*100)
        return f'{n//360000:01}:{n//6000%60:02}:{n//100%60:02}.{n%100:02}'
    n = round(t*1000)
    return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'

def audio():
    import onnxruntime as ort
    ort.disable_telemetry_events()
    from piper import PiperVoice, SynthesisConfig
    voice = PiperVoice.load(a.model)
    cfg = SynthesisConfig(length_scale=1.00, noise_scale=.6, noise_w_scale=.8)
    rate = voice.config.sample_rate
    chunks, subs, scenes = [], [], []
    position = 0
    (OUT/'voice').mkdir(exist_ok=True)
    def pause(t):
        nonlocal position
        n = round(t*rate)
        chunks.append(b'\0\0'*n)
        position += n/rate
    for scene in story['scenes']:
        start = position
        pause(.4)
        for sentence in re.split(r'(?<=[.!?])\s+',scene['text']):
            for text in textwrap.wrap(sentence,width=150,break_long_words=False,break_on_hyphens=False):
                key = hashlib.sha256(('thorsten-demo-1.0|'+text).encode()).hexdigest()[:24]
                dest = OUT/'voice'/f'{key}.wav'
                if not dest.exists():
                    with wave.open(str(dest),'wb') as f: voice.synthesize_wav(text,f,syn_config=cfg)
                with wave.open(str(dest),'rb') as f:
                    assert f.getframerate()==rate and f.getnchannels()==1
                    raw=f.readframes(f.getnframes())
                duration=len(raw)/(rate*2)
                assert duration>.2 and any(raw)
                subs.append(dict(start=position,end=position+duration,text=text))
                chunks.append(raw)
                position += duration
                pause(.15)
        pause(.6)
        scenes.append(dict(scene,start=start,end=position))
        print('VOICE',scene['id'],round(position-start,1),'seconds',flush=True)
    with wave.open(str(OUT/'narration-de.wav'),'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(rate); f.writeframes(b''.join(chunks))
    (OUT/'timeline.json').write_text(json.dumps(dict(duration=position,scenes=scenes,subtitles=subs),ensure_ascii=False,indent=2))
    (MEDIA/'Huroof-Demo-Werbung-DE.srt').write_text('\n\n'.join(f'{i+1}\n{stamp(s["start"])} --> {stamp(s["end"])}\n'+ '\n'.join(textwrap.wrap(s['text'],width=80,break_long_words=False)) for i,s in enumerate(subs))+'\n')
    (MEDIA/'Sprechertext-DE.txt').write_text('\n\n'.join(s['title'].replace('\n',' ')+'\n'+s['text'] for s in scenes)+'\n')
    (MEDIA/'YouTube-Kapitel-DE.txt').write_text('\n'.join(f'{int(s["start"])//60:02}:{int(s["start"])%60:02} '+s['title'].replace('\n',' ') for s in scenes)+'\n')

def capture():
    from playwright.sync_api import sync_playwright
    frames=OUT/'frames'; frames.mkdir(exist_ok=True)
    timeline=json.loads((OUT/'timeline.json').read_text())
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        context=browser.new_context(viewport={'width':1180,'height':728},device_scale_factor=1)
        context.add_init_script("localStorage.setItem('vocabInterfaceLanguage','de');localStorage.setItem('lettersLanguage','de');localStorage.setItem('oliveLearnerThemeV1','neutral');")
        page=context.new_page(); errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        def go(name):
            page.goto(a.demo_url+'/'+name+'.html')
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(220)
        def scroll(selector):
            page.locator(selector).first.evaluate('(n)=>window.scrollTo(0,Math.max(0,n.getBoundingClientRect().top+scrollY-35))')
            page.wait_for_timeout(450)
        def shot(name):
            path=frames/(name+'.png');page.screenshot(path=str(path));return a.stage_url+'/__demo_video_frames__/'+path.name
        sources={}
        go('index');scroll('#demo-journey');sources['goals']=[shot('goals')]
        go('huruf');page.locator('#letter-next').click();scroll('#letter-card');sources['letters']=[shot('letters')]
        page.locator('#letter-card').click();page.wait_for_timeout(700);sources['letters'].append(shot('letter-forms'))
        scroll('#writing-canvas');canvas=page.locator('#writing-canvas');box=canvas.bounding_box()
        page.mouse.move(box['x']+.70*box['width'],box['y']+.48*box['height']);page.mouse.down()
        for i in range(25):
            page.mouse.move(box['x']+box['width']*(.70-.4*i/24),box['y']+box['height']*(.48+.12*math.sin(i/24*math.pi)))
        page.mouse.up()
        page.mouse.click(box['x']+.50*box['width'],box['y']+.72*box['height'])
        sources['letters'].append(shot('writing'))
        go('index');page.locator('.ready-list-button').first.click();page.wait_for_url('**/lernseite.html');scroll('#flashcard')
        sources['vocab']=[shot('vocab-ar')];page.locator('#flashcard').click();page.wait_for_timeout(700);sources['vocab'].append(shot('vocab-de'))
        go('test2');scroll('.question');sources['quizzes']=[shot('quiz')]
        q=page.locator('.question').first;word=q.locator('.arabic-text').inner_text();pairs=page.evaluate('VocabApp.getCurrentVocabList()');correct=next(de for ar,de in pairs if ar==word)
        for radio in q.locator('input[type=radio]').all():
            if radio.input_value()==correct:radio.check();break
        sources['quizzes'].append(shot('quiz-selected'))
        go('sentences');scroll('#sentence-answer');sources['sentences']=[shot('sentence-start')]
        for word in ['أَنَا','طَالِبٌ']:
            page.locator('#sentence-bank button').filter(has_text=re.compile('^'+re.escape(word)+'$')).click()
        page.locator('#sentence-check').click();sources['sentences'].append(shot('sentence-success'))
        go('grammar');scroll('#grammar-lesson-select');sources['grammar']=[shot('grammar')]
        go('verbs');page.locator('[data-tense=imperative]').click();scroll('#conjugation-body');sources['grammar'].append(shot('verbs'))
        go('stories');scroll('#story-title');sources['story']=[shot('story')]
        page.locator('#story-translation').click();scroll('#story-lines');sources['story'].append(shot('story-translation'))
        go('index');scroll('#demo-journey');sources['devices']=[shot('desktop')]
        page.set_viewport_size({'width':390,'height':825});go('lernseite');scroll('#flashcard');mobile=shot('mobile')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert not errors,errors
        stage=browser.new_page(viewport={'width':1920,'height':1080},device_scale_factor=1)
        stage.route('**/__demo_video_frames__/*',lambda route:route.fulfill(path=str(frames/route.request.url.rsplit('/',1)[1]),content_type='image/png'))
        stage.goto(a.stage_url+'/media/demo-video/stage.html')
        shots=[]
        for scene in timeline['scenes']:
            images=sources.get(scene['id'],[None])
            for i,source in enumerate(images):
                render=dict(scene,image=source,mobile=mobile if scene['id']=='devices' else None)
                stage.evaluate('s=>render(s)',render)
                path=frames/f'stage-{scene["id"]}-{i}.png';stage.screenshot(path=str(path))
                shots.append(dict(path=str(path),scene=scene['id'],start=scene['start']+(scene['end']-scene['start'])*i/len(images),end=scene['start']+(scene['end']-scene['start'])*(i+1)/len(images)))
            print('VIEW',scene['id'],len(images),flush=True)
        shutil.copyfile(frames/'stage-intro-0.png',MEDIA/'Huroof-Demo-Vorschaubild-DE.png')
        (OUT/'shots.json').write_text(json.dumps(shots,indent=2))
        browser.close()

def render():
    import numpy as np
    timeline=json.loads((OUT/'timeline.json').read_text());duration=timeline['duration'];rate=48000
    music=np.zeros((round(duration*rate),2),dtype=np.float32)
    beat=60/80;chords=[(48,55,60,64),(45,52,57,60),(41,48,53,57),(43,50,55,59)]
    for bar in range(int(duration/(beat*4))+1):
        chord=chords[bar%4]
        for step,note in enumerate([chord[0],chord[2]+12,chord[1]+12,chord[3]+12]):
            start=round((bar*4+step)*beat*rate)
            if start>=len(music):continue
            length=min(round(2.5*rate),len(music)-start);t=np.arange(length,dtype=np.float32)/rate;freq=440*2**((note-69)/12)
            sound=(np.sin(2*np.pi*freq*t)+.25*np.sin(2*np.pi*freq*2*t)+.08*np.sin(2*np.pi*freq*3*t))*(1-np.exp(-t*38))*np.exp(-t*2.1)*.045
            pan=.35 if step%2 else .65
            music[start:start+length,0]+=sound*pan;music[start:start+length,1]+=sound*(1-pan)
    fade=min(round(2.5*rate),len(music));music[:fade]*=np.linspace(0,1,fade)[:,None];music[-fade:]*=np.linspace(1,0,fade)[:,None]
    with wave.open(str(OUT/'music.wav'),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(rate);f.writeframes((np.clip(music,-1,1)*32767).astype('<i2').tobytes())
    header='''[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,DejaVu Sans,34,&H00FFFFFF,&H00FFFFFF,&H002A3F26,&H002A3F26,0,0,0,0,100,100,0,0,3,17,0,2,90,90,62,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
    lines=[]
    for s in timeline['subtitles']:
        text='\\N'.join(textwrap.wrap(s['text'],width=88,break_long_words=False))
        lines.append(f'Dialogue: 0,{stamp(s["start"],True)},{stamp(s["end"],True)},Default,,0,0,0,,{text}')
    ass=OUT/'subtitles.ass';ass.write_text(header+'\n'.join(lines)+'\n')
    shots=json.loads((OUT/'shots.json').read_text());clips=[]
    # Per-shot slow motion keeps the presentation calm and visually alive.
    for i,s in enumerate(shots):
        clip=OUT/f'clip-{i:02}.mp4';frames=round(s['end']*25)-round(s['start']*25)
        vf=f"zoompan=z='1+0.008*on/{frames}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={frames}:s=1920x1080:fps=25,format=yuv420p"
        if i==0:vf+=',fade=t=in:st=0:d=0.4:color=0xf5f1e5'
        if not clip.exists():run('ffmpeg','-y','-v','error','-i',s['path'],'-vf',vf,'-frames:v',frames,'-c:v','libx264','-preset','veryfast','-crf','20','-threads','3',clip)
        clips.append(clip)
        print('RENDER',i+1,'/',len(shots),flush=True)
    concat=OUT/'clips.txt';concat.write_text(''.join(f"file '{x}'\n" for x in clips))
    dest=ROOT/'downloads/Huroof-Demo-Werbung-DE.mp4'
    run('ffmpeg','-y','-v','warning','-f','concat','-safe','0','-i',concat,'-i',OUT/'narration-de.wav','-i',OUT/'music.wav','-filter_complex',
        f'[0:v]ass={ass},fade=t=out:st={duration-.6}:d=0.6:color=0xf5f1e5[v];[1:a]aformat=channel_layouts=stereo,asplit=2[voice][side];[2:a][side]sidechaincompress=threshold=0.02:ratio=4:attack=35:release=450[bed];[voice][bed]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=9[a]',
        '-map','[v]','-map','[a]','-t',duration,'-c:v','libx264','-preset','veryfast','-crf','21','-threads','3','-pix_fmt','yuv420p','-profile:v','high','-level','4.1','-c:a','aac','-b:a','160k','-ar','48000','-movflags','+faststart','-metadata','title=Huroof – Dein erster Schritt ins Arabische','-metadata:s:a:0','language=deu','-metadata','comment=Real demo views; synthetic German narration; original instrumental music.',dest)
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(dest)]))
    v=next(s for s in info['streams'] if s['codec_type']=='video');au=next(s for s in info['streams'] if s['codec_type']=='audio')
    assert (v['width'],v['height'],v['codec_name'],au['codec_name'])==(1920,1080,'h264','aac')
    assert abs(float(info['format']['duration'])-duration)<.15 and dest.stat().st_size<95_000_000
    with zipfile.ZipFile(ROOT/'downloads/Huroof-Demo-Video-DE.zip','w',compression=zipfile.ZIP_STORED) as z:
        z.write(dest,dest.name)
        for name in ['Huroof-Demo-Werbung-DE.srt','Huroof-Demo-Vorschaubild-DE.png','Sprechertext-DE.txt','YouTube-Kapitel-DE.txt','README.md']:
            z.write(MEDIA/name,name)
    print('DONE',round(duration,2),'seconds;',dest.stat().st_size,'bytes',flush=True)

if a.step in ['all','audio']:audio()
if a.step in ['all','capture']:capture()
if a.step in ['all','render']:render()
