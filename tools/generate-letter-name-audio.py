"""Regenerate bundled Arabic letter names with an explicit final sukun.

Uses the same public Arabic TTS endpoint as the existing audio collection.
Requires Node.js, FFmpeg and FFprobe for the generation step only.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import subprocess
import time
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
data = json.loads(subprocess.check_output(
    ['node', '-e', 'console.log(JSON.stringify(require("./js/letter-data.js")))'],
    cwd=ROOT, text=True))
letters = data['letters']
revision = ROOT/'audio/letter-pronunciation-revision.json'
revised = {c['path']:c for c in json.loads(revision.read_text())['clips'] if c['kind']=='name'} if revision.exists() else {}


def generate(item):
    index, letter = item
    text = letter['spokenName']
    assert text.endswith('ْ')
    relative = data['audio'][letter['name']]
    target = ROOT / relative
    if relative in revised:
        clip = revised[relative]
        assert target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == clip['sha256'], 'Run generate-letter-pronunciation-revision.py first'
        return {'name':letter['name'],**{k:v for k,v in clip.items() if k!='kind'}}
    for attempt in range(3):
        try:
            query = urllib.parse.urlencode(dict(ie='UTF-8', client='gtx', tl='ar', ttsslow='1', q=text))
            with urllib.request.urlopen('https://translate.google.com/translate_tts?' + query, timeout=25) as response:
                assert response.headers.get('Content-Type', '').startswith('audio/')
                payload = response.read()
            assert len(payload) > 500
            temporary = target.with_suffix('.tmp.mp3')
            temporary.write_bytes(payload)
            duration = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
                'format=duration', '-of', 'csv=p=0', str(temporary)], text=True))
            decoded = subprocess.run(['ffmpeg', '-v', 'info', '-i', str(temporary), '-af',
                'silencedetect=noise=-40dB:d=0.05,volumedetect', '-f', 'null', '-'],
                capture_output=True, text=True, check=True)
            peak = float(re.search(r'max_volume: ([\-\d.]+) dB', decoded.stderr)[1])
            silent = sum(float(value) for value in re.findall(r'silence_duration: ([\d.]+)', decoded.stderr))
            assert peak > -30 and duration - silent >= .15, (relative, peak, duration, silent)
            temporary.replace(target)
            return {'letter': letter['char'], 'name': letter['name'], 'text': text,
                    'path': relative, 'sha256': hashlib.sha256(payload).hexdigest()}
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1 + attempt)


with ThreadPoolExecutor(max_workers=3) as pool:
    clips = list(pool.map(generate, enumerate(letters, 1)))
assert len(clips) == 28
manifest = {'date': datetime.now(timezone.utc).date().isoformat(),
            'provider': 'Google Translate TTS (ar)', 'slow': True,
            'pronunciation': 'Letter names with final sukun (waqf); no final case vowel.',
            'clips': clips}
(ROOT / 'audio/letter-name-waqf.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
for index in range(1, 29):
    (ROOT / f'audio/letters/{index:02d}-name.mp3').unlink(missing_ok=True)
print('Generated and decoded 28 letter-name recordings with final sukun; manifest saved.')
