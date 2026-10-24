"""Mix original quiet music and narration into the captured Full-HD MP4 releases.

Requires NumPy, FFmpeg and a successful tools/record-promo.py recording.
"""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import wave
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--directory',type=Path,default=Path('/tmp/olive-promo-build'))
parser.add_argument('--language',choices=['de','ar'],required=True)
args=parser.parse_args();out=args.directory.resolve();lang=args.language
capture=json.loads((out/f'capture-{lang}.json').read_text())
timeline=json.loads((out/f'timeline-{lang}.json').read_text())
assert not capture['errors'] and not capture['warnings'],'Review the recording before release'
duration=timeline['duration'];rate=48000

# An original, deliberately understated plucked-key motif: no sampled music.
music_path=out/f'music-{lang}.wav'
if not music_path.exists():
    music=np.zeros((round(duration*rate),2),dtype=np.float32)
    chords=[(48,55,60,64),(45,52,57,60),(41,48,53,57),(43,50,55,59)]
    beat=60/76
    for bar in range(int(duration/(beat*4))+1):
        chord=chords[bar%len(chords)]
        for step,note in enumerate([chord[0],chord[2]+12,chord[1]+12,chord[3]+12]):
            start=round((bar*4+step)*beat*rate)
            if start>=len(music):continue
            length=min(round(2.5*rate),len(music)-start)
            t=np.arange(length,dtype=np.float32)/rate
            frequency=440*2**((note-69)/12)
            envelope=(1-np.exp(-t*38))*np.exp(-t*2.1)
            sound=(np.sin(2*np.pi*frequency*t)+.25*np.sin(2*np.pi*frequency*2*t)+.08*np.sin(2*np.pi*frequency*3*t))*envelope*.044
            pan=.35 if step%2 else .65
            music[start:start+length,0]+=sound*pan
            music[start:start+length,1]+=sound*(1-pan)
    fade=min(round(2.5*rate),len(music))
    music[:fade]*=np.linspace(0,1,fade)[:,None]
    music[-fade:]*=np.linspace(1,0,fade)[:,None]
    with wave.open(str(music_path),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(rate)
        f.writeframes((np.clip(music,-1,1)*32767).astype('<i2').tobytes())

dest=ROOT/'downloads'/f'Huroof-Werbung-{lang.upper()}.mp4'
cmd=['ffmpeg','-y','-v','warning','-ss',str(capture['offset']),'-i',capture['video'],
     '-i',str(out/f'narration-{lang}.wav'),'-i',str(music_path),'-filter_complex',
     f'[0:v]fps=25,fade=t=in:st=0:d=0.45:color=0xf5f1e5,fade=t=out:st={duration-.7}:d=0.7:color=0xf5f1e5,format=yuv420p[v];'
     '[1:a]aformat=channel_layouts=stereo,asplit=2[voice][side];'
     '[2:a][side]sidechaincompress=threshold=0.02:ratio=4:attack=35:release=450[bed];'
     '[voice][bed]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=9[a]',
     '-map','[v]','-map','[a]','-t',str(duration),'-c:v','libx264','-preset','veryfast',
     '-crf','21','-threads','3','-pix_fmt','yuv420p','-profile:v','high','-level','4.1','-c:a','aac','-b:a','160k',
     '-ar','48000','-movflags','+faststart','-metadata','title=Huroof – '+('Werbefilm auf Deutsch' if lang=='de' else 'حروف من الزيتون – فيلم تعريفي'),
     '-metadata','comment=Real app demonstrations; synthetic narration; original generated background music.',
     '-metadata:s:a:0','language='+('deu' if lang=='de' else 'ara'),str(dest)]
subprocess.run(cmd,check=True)
shutil.copyfile(out/f'Huroof-Werbung-{lang.upper()}.srt',ROOT/'media/promo'/f'Huroof-Werbung-{lang.upper()}.srt')
shutil.copyfile(out/'frames'/f'{lang}-00-intro.png',ROOT/'media/promo'/f'Huroof-Vorschaubild-{lang.upper()}.png')
selected=['intro','letters','reading','tests','stories','grammar','placement','exams','progress','flexible','outro']
chapters=[]
for scene in timeline['scenes']:
    if scene['id'] not in selected:continue
    seconds=int(scene['start']);chapters.append(f'{seconds//60:02}:{seconds%60:02} '+scene['title'].replace('\n',' '))
(ROOT/'media/promo'/f'YouTube-Kapitel-{lang.upper()}.txt').write_text('\n'.join(chapters)+'\n')
report=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(dest)]))
video=next(s for s in report['streams'] if s['codec_type']=='video')
audio=next(s for s in report['streams'] if s['codec_type']=='audio')
assert (video['width'],video['height'],video['pix_fmt'])==(1920,1080,'yuv420p')
assert video['codec_name']=='h264' and audio['codec_name']=='aac'
assert abs(float(report['format']['duration'])-duration)<.15
assert dest.stat().st_size<95_000_000
print(lang,dest.stat().st_size,'bytes;',round(duration,2),'seconds; H.264 / AAC / Full HD / fast-start',flush=True)
