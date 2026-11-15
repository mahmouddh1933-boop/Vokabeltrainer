"""Verify the two exported films, source screenshots, timing and companion ZIPs."""
import hashlib,json,subprocess,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
for ident,label in [('start','Start'),('a1-a2','A1-A2')]:
 media=ROOT/'media/app-videos'/ident;name=f'Huroof-{label}-Video-AR';video=ROOT/'downloads'/f'{name}.mp4'
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
 visual=next(s for s in info['streams'] if s['codec_type']=='video');audio=next(s for s in info['streams'] if s['codec_type']=='audio')
 assert (visual['codec_name'],visual['width'],visual['height'],visual['r_frame_rate'])==('h264',1920,1080,'25/1')
 assert audio['codec_name']=='aac' and int(audio['sample_rate'])==48000
 duration=float(info['format']['duration']);assert 45<duration<150
 # Decode every video and audio frame, rather than just checking the container.
 subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],check=True)
 evidence=json.loads((media/'capture-evidence.json').read_text())
 for frame in evidence['screenshots']:
  assert hashlib.sha256((ROOT/frame['image']).read_bytes()).hexdigest()==frame['sha256']
 import re
 times=re.findall(r'(\d\d:\d\d:\d\d,\d{3}) --> (\d\d:\d\d:\d\d,\d{3})',(media/f'{name}.srt').read_text())
 def seconds(t):
  h,m,s=t.replace(',','.').split(':');return 3600*int(h)+60*int(m)+float(s)
 previous=0
 for start,end in times:
  lo,hi=seconds(start),seconds(end);assert previous<=lo<hi<=duration;previous=hi
 with zipfile.ZipFile(ROOT/'downloads'/f'{name}.zip') as z:
  assert z.testzip() is None
  assert z.read(video.name)==video.read_bytes()
  assert f'{name}.srt' in z.namelist() and 'README-AR.md' in z.namelist()
 report={'file':video.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'bytes':video.stat().st_size,'duration':duration,'screenshots':len(evidence['screenshots']),'codec':'H.264 / AAC','dimensions':[1920,1080],'fps':25,'decodedAllFrames':True,'checkedSubtitleCues':len(times),'sourceScreenshotHashesVerified':True,'companionZipVerified':True}
 (media/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
 print('PASS',ident,f'{duration:.2f}s',report['bytes'],'bytes',flush=True)
