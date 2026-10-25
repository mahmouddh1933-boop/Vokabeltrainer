"""Build a release-specific worker from the actual static edition being shipped."""
from pathlib import Path
import argparse,hashlib,json
ROOT=Path(__file__).resolve().parents[1]
def asset_kind(rel):
    path=Path(rel);parts=path.parts
    include=(len(parts)==1 and path.suffix=='.html') or rel in ['manifest.webmanifest','styles.css'] or (parts[0] in ['css','js','fonts'] and path.suffix in ['.css','.js','.woff','.woff2','.ttf']) or (parts[0]=='data' and path.suffix in ['.json','.js']) or (parts[0]=='images' and path.suffix in ['.svg','.png','.jpg','.jpeg','.webp']) or (parts[0]=='audio' and path.suffix=='.mp3')
    if not include:return None
    return parts[0]=='audio' or (parts[0]=='images' and path.suffix!='.svg' and not rel.startswith('images/pwa/'))
def render_worker(files):
    assets={}
    for rel,payload in sorted(files.items()):
        kind=asset_kind(rel)
        if kind is not None:assets[rel]={'rev':hashlib.sha256(payload).hexdigest()[:16],'bytes':len(payload),'media':kind}
    assert all(name in assets for name in ['index.html','offline.html','manifest.webmanifest','js/pwa.js','css/pwa.css','images/pwa/icon-192.png','images/pwa/icon-512.png'])
    payload=json.dumps(assets,ensure_ascii=False,separators=(',',':'));version=hashlib.sha256(payload.encode()).hexdigest()[:16]
    template=(ROOT/'tools/pwa-worker.template.js').read_text();worker=template.replace('__OLIVE_RELEASE__',version).replace('__OLIVE_ASSETS__',payload)
    core=[v for v in assets.values() if not v['media']]
    print('PWA worker:',version,';',len(core),'core assets,',sum(v['bytes'] for v in core),'bytes;',sum(v['media'] for v in assets.values()),'on-demand media')
    return worker
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=ROOT);a=p.parse_args();base=a.directory.resolve()
    files={path.relative_to(base).as_posix():path.read_bytes() for path in sorted(base.rglob('*')) if path.is_file() and asset_kind(path.relative_to(base).as_posix()) is not None}
    (base/'pwa-worker.js').write_text(render_worker(files))
