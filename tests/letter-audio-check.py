"""Decode the bundled speech and reject silent or broken MP3 clips (requires FFmpeg)."""
from pathlib import Path
import re
import json
import subprocess

root = Path(__file__).resolve().parents[1]
letter_clips = sorted((root/'audio/letters').glob('*.mp3'))
practice_clips = sorted((root/'audio/practice').glob('*.mp3'))
assert len(letter_clips) == 168, len(letter_clips)
assert len(practice_clips) == 120, len(practice_clips)
book_clips = sorted((root/'audio/book-two').glob('*.mp3'))
assert len(book_clips) == 151, len(book_clips)
youth_clips = sorted((root/'audio/youth').glob('*.mp3'))
assert len(youth_clips) == len(json.loads((root/'audio/youth-manifest.json').read_text())['clips'])
part_one_clips = sorted((root/'audio/book-youth-two-part-one').glob('*.mp3'))
assert len(part_one_clips) == len(json.loads((root/'audio/book-youth-two-part-one-manifest.json').read_text())['clips'])
clips = letter_clips + practice_clips + book_clips + youth_clips + part_one_clips
for clip in clips:
    duration = float(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'csv=p=0', str(clip),
    ]))
    result = subprocess.run([
        'ffmpeg', '-v', 'info', '-i', str(clip), '-af',
        'silencedetect=noise=-40dB:d=0.05,volumedetect', '-f', 'null', '-',
    ], capture_output=True, text=True, check=True)
    assert 'Error' not in result.stderr, (clip.name, result.stderr)
    peak = float(re.search(r'max_volume: ([\-\d.]+) dB', result.stderr).group(1))
    silent = sum(float(v) for v in re.findall(r'silence_duration: ([\d.]+)', result.stderr))
    assert peak > -30 and duration-silent >= 0.15, (clip.name, peak, duration, silent)
print(f'PASS: {len(clips)} MP3s fully decoded; each has at least 150ms of non-silent audio and peak above -30dBFS')
