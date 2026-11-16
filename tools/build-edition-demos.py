"""Build two limited interactive previews from current editions, without Firebase.
Demo learning storage has its own namespace; the full applications are untouched.
"""
import argparse,json,re,runpy,shutil
from pathlib import Path
from html.parser import HTMLParser
from zipfile import ZipFile,ZIP_DEFLATED
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--source',type=Path,default=ROOT/'firebase-public');p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-edition-demos'));p.add_argument('--archives',action='store_true');a=p.parse_args();dest=a.directory.resolve()
if dest==ROOT or dest in ROOT.parents or dest==a.source.resolve() or dest.is_symlink():raise SystemExit('Choose a separate build directory.')
if dest.exists() and any(dest.iterdir()):
 if not (dest/'demo-build.json').exists():raise SystemExit('Refusing to replace unrelated files.')
 shutil.rmtree(dest)
dest.mkdir(parents=True,exist_ok=True)
pwa=runpy.run_path(str(ROOT/'tools/build-pwa.py'))
excluded={'js/firebase-config.js','js/auth-session.js','js/access-client.js','js/cloud-sync.js','js/cloud-sync-core.js','css/auth.css'}
demo_js='''(()=>{const S=window.JisrStorage;if(!S)return;if(!S.local.getItem('vocabInterfaceLanguage'))S.local.setItem('vocabInterfaceLanguage','de');
S.ready(()=>{const main=document.querySelector('main');if(!main)return;const box=document.createElement('aside');box.className='demo-notice';const text=document.createElement('span'),reset=document.createElement('button');reset.type='button';reset.className='practice-button';reset.id='demo-reset';box.append(text,reset);main.prepend(box);
function render(){const de=(window.AppLanguage?.get()||S.local.getItem('vocabInterfaceLanguage'))==='de';text.textContent=S.local.persistent?(de?'Demo · 3 Lektionen je Bereich · Ohne Anmeldung · Lernstand nur auf diesem Gerät':'نسخة تجريبية · ٣ دروس لكل قسم · دون تسجيل دخول · التقدّم محفوظ على هذا الجهاز فقط'):(de?'Demo · Browser-Speicher gesperrt · Lernstand nur bis zum Seitenwechsel':'نسخة تجريبية · التخزين محجوب · التقدّم متاح حتى مغادرة الصفحة فقط');reset.textContent=de?'Demo neu starten':'إعادة بدء النسخة التجريبية'}
reset.addEventListener('click',()=>{const de=(window.AppLanguage?.get()||S.local.getItem('vocabInterfaceLanguage'))==='de';if(!confirm(de?'Nur den Lernstand dieser Demo zurücksetzen?':'هل تريد مسح تقدّم هذه النسخة التجريبية فقط؟'))return;for(const storage of [S.local,S.session])for(const key of storage.keys())storage.removeItem(key);location.href='index.html'});window.addEventListener('app-language-change',render);render()});})();'''
css='''.demo-notice{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;padding:14px 18px;margin-block:0 24px;background:#edf1df;border:1px solid #9bb17f;border-radius:16px;font-size:16px;line-height:1.8;color:#244b36}.demo-notice .practice-button{font-size:14px;min-height:44px}@media(max-width:480px){.demo-notice{padding:12px;gap:10px}.demo-notice .practice-button{width:100%}}'''
def add_to_head(text,extra):
 class LocateHead(HTMLParser):
  end=None
  def handle_endtag(self,tag):
   if tag=='head' and self.end is None:
    # HTMLParser counts LF only; splitlines also splits Unicode separators in inline JS.
    line,column=self.getpos();self.end=sum(len(x)+1 for x in text.split('\n')[:line-1])+column
 parser=LocateHead(convert_charrefs=False);parser.feed(text)
 if parser.end is None:raise ValueError('No real closing head tag found')
 return text[:parser.end]+extra+text[parser.end:]
results=[]
for ident,label in [('start','Start'),('a1-a2','A1-A2')]:
 base=dest/ident;shutil.copytree(a.source/ident,base)
 old_config=(base/'js/edition-config.js').read_text();config=json.loads(old_config.split('=',1)[1].strip().rstrip(';'));config.update(suite=False,demo=True,hosted=False)
 config['pages']=[name for name in config['pages'] if name not in ['login.html','admin.html']]
 new_config='window.HuroofEditionConfig='+json.dumps(config,ensure_ascii=False,separators=(',',':'))+';'
 old_runtime=(base/'js/edition.js').read_text();new_runtime=old_runtime.replace('    if(config.suite)return true;','    if(config.demo)return false;\n    if(config.suite)return true;')
 old_storage=(base/'js/storage.js').read_text();new_storage=old_storage.replace('"huroofSuiteV1:"','"huroofDemoV1:"')
 old_app=(base/'js/app.js').read_text();new_app=re.sub(r'    function getOnlineTTSUrls\(text\) \{.*?\n    \}','    function getOnlineTTSUrls() { return []; }',old_app,flags=re.S).replace('onlineFallback: typeof Audio !== "undefined"','onlineFallback: false')
 overrides={'js/edition-config.js':new_config,'js/edition.js':new_runtime,'js/storage.js':new_storage,'js/app.js':new_app}
 # Limit the actual data used by both standalone and embedded scripts.
 limits={
  'letter-data.js':"ArabicLetterData.letters.splice(3);",
  'phonics-data.js':"for(const k of ['segment','blend','missing','family'])ArabicPhonicsData[k].splice(3);",
  'reading-trainer-data.js':"ArabicReadingTrainer.words.splice(3);ArabicReadingTrainer.levels=ArabicReadingTrainer.levels.filter(l=>ArabicReadingTrainer.words.some(w=>w.level===l.id));",
  'reading-exercises-data.js':"ArabicReadingExercises.activities.splice(3);ArabicReadingExercises.chapters=ArabicReadingExercises.chapters.filter(c=>ArabicReadingExercises.activities.some(a=>a.chapter===c.id));",
  'practice-data.js':"for(const k of ['sounds','sentences','stories'])ArabicPracticeData[k].splice(3);",
  'skills-data.js':"ArabicSkillsData.units.splice(3);",
  'grammar-data.js':"ArabicGrammarData.lessons.splice(3);for(const s of ArabicGrammarData.stages)s.ids=s.ids.filter(id=>ArabicGrammarData.lessons.some(l=>l.id===id));ArabicGrammarData.stages=ArabicGrammarData.stages.filter(s=>s.ids.length);",
  'verb-data.js':"VerbLessonData.verbs.splice(3);",
 }
 for filename,code in limits.items():
  file=base/'js'/filename
  if file.exists():
   overrides['js/'+filename]=file.read_text()+'\n/* Demo: three lessons per area. */\n'+code+'\n'
 catalog_path=base/'data/vocab_catalog.json'
 catalog=json.loads(catalog_path.read_text());catalog['lists']=catalog['lists'][:3]
 catalog['levels']=[l for l in catalog['levels'] if any(row['level']==l['id'] for row in catalog['lists'])]
 catalog_path.write_text(json.dumps(catalog,ensure_ascii=False,separators=(',',':')))
 for level in catalog['levels']:
  if 'listIds' in level:level['listIds']=[i for i in level['listIds'] if any(row['id']==i for row in catalog['lists'])]
 overrides['data/vocab_catalog_fallback.js']='window.VOCAB_CATALOG_META='+json.dumps({'lists':len(catalog['lists'])})+';window.VOCAB_CATALOG_FALLBACK='+json.dumps(catalog,ensure_ascii=False,separators=(',',':'))+';'
 catalog_path.write_text(json.dumps(catalog,ensure_ascii=False,separators=(',',':')))
 def strip_script(m):
  attrs=m[1]
  match=re.search(r'(?:data-source|data-auth-src|src)=["\']([^"\']+)',attrs)
  name=match[1].split('?')[0] if match else ''
  return '' if name in excluded or 'vendor/firebase/' in name else m[0]
 for page in base.glob('*.html'):
  if page.name in ['login.html','admin.html']:page.unlink();continue
  text=page.read_text();text=re.sub(r'<script\b([^>]*)>[\s\S]*?</script>',strip_script,text)
  for name,new in overrides.items():text=text.replace((base/name).read_text(),new)
  text=re.sub(r'\sdata-olive-hosted=["\']true["\']','',text)
  text=re.sub(r'<section class="edition-migration">.*?</section>','',text,flags=re.S)
  text=text.replace('</title>',' · Demo</title>',1)
  text=add_to_head(text,'<style>'+css+'</style><script data-source="js/edition-demo.js">'+demo_js+'</script>')
  page.write_text(text)
 for name,new in overrides.items():(base/name).write_text(new)
 (base/'js/edition-demo.js').write_text(demo_js)
 for name in excluded:
  file=base/name
  if file.exists():file.unlink()
 shutil.rmtree(base/'js/vendor/firebase',ignore_errors=True)
 manifest=json.loads((base/'manifest.webmanifest').read_text());manifest.update(id='./',name=manifest['name']+' · Demo',short_name='Huroof '+label+' Demo');(base/'manifest.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 meta=json.loads((base/'edition-manifest.json').read_text());meta.update(suite=False,demo=True,hosted=False,pages=config['pages'],storageNamespace='huroofDemoV1:'+ident);(base/'edition-manifest.json').write_text(json.dumps(meta,ensure_ascii=False,separators=(',',':')))
 demo={'app':ident,'type':'limited interactive preview','lessonLimit':3,'authentication':False,'cloudSynchronization':False,'learningStorage':'huroofDemoV1:'+ident,'pages':config['pages']};(base/'demo-manifest.json').write_text(json.dumps(demo,indent=2)+'\n')
 (base/'README-APP.txt').write_text('HUROOF '+label+' — DEMO / نسخة تجريبية\n\nBegrenzte interaktive Vorschau: drei Lektionen bzw. Beispiele je Lernbereich. Keine Anmeldung, keine Firebase-Verbindung, keine Cloud-Synchronisierung. Lernstände dieser Demo werden getrennt von der Vollversion auf diesem Gerät gespeichert. Die Sprache ist Deutsch/Arabisch umschaltbar.\n\nZuerst entpacken, dann index.html öffnen oder den Ordner auf einem statischen Hosting bereitstellen.\n\nAuf dem bestehenden Firebase-Hosting: Lege den Inhalt dieser Demo in den Unterordner public/demo/ DEINES passenden vollständigen Firebase-Ready-Pakets. Führe anschließend im vollständigen Paket node deploy-firebase.cjs aus. Die Demo erscheint danach unter /demo/. Die bestehenden Dateien der Vollversion bleiben im public-Hauptordner. Diese Demo selbst enthält keine Firebase-Deploy-Konfiguration.\n\nنسخة للمعاينة بثلاثة دروس أو أمثلة لكل قسم، دون تسجيل دخول أو مزامنة سحابية. التقدّم محلي ومنفصل عن النسخة الكاملة. للاستضافة مع التطبيق الكامل، ضع ملفات هذه النسخة داخل public/demo في حزمته ثم انشر الحزمة الكاملة.\n')
 payload={path.relative_to(base).as_posix():path.read_bytes() for path in base.rglob('*') if path.is_file()};(base/'pwa-worker.js').write_text(pwa['render_worker'](payload))
 assert not any('firebase' in path.name or path.name in ['auth-session.js','access-client.js','cloud-sync.js','cloud-sync-core.js'] for path in base.rglob('*') if path.is_file())
 archive=ROOT/'downloads'/f'Huroof-{label}-Demo.zip'
 if a.archives:
  with ZipFile(archive,'w',ZIP_DEFLATED) as z:
   for path in sorted(base.rglob('*')):
    if path.is_file():z.write(path,'Huroof-'+label+'-Demo/'+path.relative_to(base).as_posix())
 results.append(demo);print('DEMO READY',ident,flush=True)
(dest/'demo-build.json').write_text(json.dumps(results,indent=2)+'\n')
