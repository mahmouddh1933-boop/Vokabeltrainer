"""Create an allowlisted static Firebase Hosting directory; no repository internals."""
from pathlib import Path
import shutil
import re
import argparse
import json
from zipfile import ZipFile, ZIP_DEFLATED

parser = argparse.ArgumentParser()
parser.add_argument('--archive', action='store_true', help='Also create the ready-to-deploy download')
args = parser.parse_args()

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'firebase-public'

if OUTPUT.is_symlink():
    raise ValueError('Hosting output must not be a symbolic link')
if OUTPUT.exists():
    shutil.rmtree(OUTPUT)
OUTPUT.mkdir()
for source in [*ROOT.glob('*.html'), ROOT / 'styles.css']:
    if source.suffix != '.html' or source.name == 'login.html':
        shutil.copy2(source, OUTPUT / source.name)
        continue
    # The shared gate starts these scripts in their original order only once
    # Firebase has restored the account and storage is scoped to its UID.
    def gated_script(match):
        reference = match.group(1)
        if reference.split('?')[0] in ['js/storage.js', 'js/firebase-config.js', 'js/auth-session.js']:
            return match.group(0)
        return f'<script type="application/x-olive-app" data-auth-src="{reference}"></script>'
    content = re.sub(r'<script\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>\s*</script>', gated_script, source.read_text())
    (OUTPUT / source.name).write_text(content)
for name in ['css', 'js', 'data', 'images', 'fonts', 'audio']:
    shutil.copytree(ROOT / name, OUTPUT / name)
assert (OUTPUT / 'index.html').is_file()
assert (OUTPUT / 'login.html').is_file()
assert not (OUTPUT / 'downloads').exists()
print(f'Hosting prepared: {sum(p.is_file() for p in OUTPUT.rglob("*"))} public files in {OUTPUT}')

if args.archive:
    target = ROOT / 'downloads' / 'Huroof-Firebase.zip'
    target.parent.mkdir(exist_ok=True)
    config = json.loads((ROOT / 'firebase.json').read_text())
    # The release already contains the built public directory. Its recipient
    # only needs Node/Firebase CLI, without a Python build step.
    config['hosting'].pop('predeploy', None)
    prefix = 'Huroof-Firebase/'
    with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
        archive.writestr(prefix + 'firebase.json', json.dumps(config, indent=2) + '\n')
        archive.write(ROOT / '.firebaserc', prefix + '.firebaserc')
        archive.write(ROOT / 'firestore.rules', prefix + 'firestore.rules')
        archive.write(ROOT / 'FIREBASE-START-DE.md', prefix + 'FIREBASE-START-DE.md')
        for path in sorted(OUTPUT.rglob('*')):
            if path.is_file(): archive.write(path, prefix + 'firebase-public/' + path.relative_to(OUTPUT).as_posix())
    with ZipFile(target) as archive:
        assert archive.testzip() is None
        assert prefix + 'firebase-public/login.html' in archive.namelist()
        assert not any('/downloads/' in name or '/tests/' in name or '/.git/' in name for name in archive.namelist())
    print(f'Firebase download verified: {target.stat().st_size} bytes; {target}')
