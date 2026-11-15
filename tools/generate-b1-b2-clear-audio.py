"""Replace robotic B1/B2 reports with bundled Arabic Google Translate TTS.

Requires ffmpeg/ffprobe and HTTPS access to translate.google.com. All 40 reports
are staged and decoded before replacing any existing recording. No runtime TTS
service is needed. Run from any directory with Python 3.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import json
import re
import subprocess
import tempfile
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]


def chunks(text, limit=170):
    """Keep words and punctuation intact, preferring sentence boundaries."""
    parts, current = [], ''
    for word in text.split():
        if len(word) > limit:
            raise ValueError('A word exceeds the speech service limit')
        if current and len(current + ' ' + word) > limit:
            parts.append(current)
            current = ''
        current = (current + ' ' + word).strip()
        if re.search(r'[.!?؟؛]$', word):
            parts.append(current)
            current = ''
    if current:
        parts.append(current)
    assert ' '.join(parts) == ' '.join(text.split())
    return parts


def run(*args):
    return subprocess.check_output(args, stderr=subprocess.PIPE)


def main():
    source = ROOT / 'data/b1-b2-units.json'
    units = json.loads(source.read_text())['units']
    with tempfile.TemporaryDirectory(prefix='huroof-clear-audio-') as temp:
        staging = Path(temp)

        def record(unit):
            folder = staging / unit['id']
            folder.mkdir()
            segments = []
            for i, text in enumerate(chunks(unit['listening']['script'])):
                query = urllib.parse.urlencode(dict(ie='UTF-8', client='tw-ob', tl='ar', q=text))
                req = urllib.request.Request('https://translate.google.com/translate_tts?' + query,
                                             headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=45) as response:
                    payload = response.read()
                    if not response.headers.get('Content-Type', '').startswith('audio/') or len(payload) < 500:
                        raise ValueError('Speech service did not return an audio recording')
                path = folder / f'{i}.mp3'
                path.write_bytes(payload)
                run('ffmpeg', '-v', 'error', '-i', str(path), '-f', 'null', '-')
                segments.append(path)
            listing = folder / 'segments.txt'
            listing.write_text('\n'.join(f"file '{p}'" for p in segments))
            target = folder / 'report.mp3'
            run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(listing),
                '-af', 'loudnorm=I=-18:TP=-3:LRA=9', '-ar', '24000', '-ac', '1', '-b:a', '64k', str(target))
            run('ffmpeg', '-v', 'error', '-i', str(target), '-f', 'null', '-')
            duration = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                 '-of', 'csv=p=0', str(target)))
            if duration < 5:
                raise ValueError('Recording is unexpectedly short: ' + unit['id'])
            print(unit['id'], f'{duration:.1f}s', flush=True)
            return dict(unit=unit['id'], path=unit['listening']['audio'], text=unit['listening']['script'],
                        duration=duration, sha256=hashlib.sha256(target.read_bytes()).hexdigest())

        with ThreadPoolExecutor(max_workers=2) as pool:
            clips = list(pool.map(record, units))
        # A failed download/decoding step above leaves all shipped files intact.
        for clip in clips:
            target = ROOT / clip['path']
            target.write_bytes((staging / clip['unit'] / 'report.mp3').read_bytes())
        manifest = dict(provider='Google Translate TTS (ar), sentence-aware chunks, normal rate',
                        voice='ar', synthetic=True, complete=True,
                        sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(), clips=clips)
        (ROOT / 'audio/b1-b2-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
        print('Prepared and decoded all', len(clips), 'reports. Rebuild the B1/B2 ZIP next.')


if __name__ == '__main__':
    main()
