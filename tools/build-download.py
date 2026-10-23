"""Build the ZIP with self-contained HTML scripts/styles for local browser use."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import argparse
import json
import hashlib
import posixpath
import re

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=ROOT/'downloads/Vokabeltrainer-modern.zip')
args = parser.parse_args()

def local_path(reference):
    if re.match(r'^[a-z][a-z0-9+.-]*:|^//|^#', reference, re.I):
        return None
    path = (ROOT/reference.split('?')[0]).resolve()
    if not path.is_relative_to(ROOT) or not path.is_file():
        raise ValueError(f'Missing local asset: {reference}')
    return path

def version(match):
    reference = match.group(2)
    path = local_path(reference)
    if path is None:
        return match.group()
    digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
    return match.group(1) + reference.split('?')[0] + '?v=' + digest + match.group(3)

# The source website also requests a fresh asset when its contents change.
for page in ROOT.glob('*.html'):
    source = page.read_text()
    source = re.sub(r'((?:src|href)=["\'])([^"\']+\.(?:js|css)(?:\?[^"\']*)?)(["\'])', version, source)
    page.write_text(source)

def portable_html(page):
    source = page.read_text()
    scripts = []
    def script(match):
        path = local_path(match.group(2))
        if path is None:
            return match.group()
        code = path.read_text().replace('</script', '<\\/script')
        scripts.append(f'<script data-source="{path.relative_to(ROOT).as_posix()}">\n{code}\n</script>')
        return ''
    source = re.sub(r'<script\b([^>]*?)\bsrc=["\']([^"\']+)["\'][^>]*>\s*</script>', script, source)
    def stylesheet(match):
        path = local_path(match.group(1))
        if path is None:
            return match.group()
        css = path.read_text()
        def rebase(url):
            ref = url.group(1).strip('"\' ')
            if re.match(r'^[a-z][a-z0-9+.-]*:|^//|^/|^#', ref, re.I):
                return url.group()
            rebased = posixpath.normpath(str(path.relative_to(ROOT).parent / ref))
            return f'url("{rebased}")'
        css = re.sub(r'url\(([^)]+)\)', rebase, css)
        return f'<style data-source="{path.relative_to(ROOT).as_posix()}">\n{css}\n</style>'
    source = re.sub(r'<link\b[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>', stylesheet, source)
    # defer on inline scripts is ignored by browsers. Running them after the body
    # preserves the original order and keeps DOMContentLoaded handlers intact.
    assert '</body>' in source, page.name
    source = source.replace('</body>', '\n'.join(scripts)+'\n</body>')
    return source.encode()

files = {}
for path in sorted(ROOT.rglob('*')):
    rel = path.relative_to(ROOT)
    if not path.is_file() or any(part.startswith('.') or part in {'downloads','__pycache__','firebase-public','node_modules'} for part in rel.parts) or path.suffix in {'.zip','.pyc','.log'}:
        continue
    files['Vokabeltrainer/'+rel.as_posix()] = portable_html(path) if path.suffix == '.html' else path.read_bytes()
args.output.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(args.output, 'w', ZIP_DEFLATED) as archive:
    for name, payload in files.items(): archive.writestr(name, payload)
with ZipFile(args.output) as archive:
    assert archive.testzip() is None
    for name, payload in files.items(): assert archive.read(name) == payload, name
    youth_clips = len(json.loads((ROOT/'audio/youth-manifest.json').read_text())['clips'])
    book_clips = len(json.loads((ROOT/'audio/book-youth-two-part-one-manifest.json').read_text())['clips'])
    related_clips = len(json.loads((ROOT/'audio/letter-related-manifest.json').read_text())['clips'])
    audio_count = 439 + youth_clips + book_clips + related_clips + sum(len(json.loads((ROOT/"audio"/name).read_text())["clips"]) for name in ["phonics-manifest.json","sentence-expanded-manifest.json"])
    assert len([name for name in files if name.endswith('.mp3')]) == audio_count
    for name in ['huruf','lernseite','sounds','sentences','stories','book-level-two','arabic-youth','youth-training-two','youth-book-two-part-one']:
        html = archive.read('Vokabeltrainer/'+name+'.html').decode()
        assert '<script data-source="js/storage.js">' in html
        assert not re.search(r'<script\b[^>]*\bsrc=["\'](?:js/|\./js/)', html)
print(f'ZIP verified: {len(files)} files, self-contained HTML scripts/styles, {audio_count} MP3 clips; {args.output.stat().st_size} bytes.')
