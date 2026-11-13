"""Build four full, independent learning apps, retaining the existing Firebase account.

No source lessons are deleted and nothing is deployed. --archives produces four
portable ZIPs and a small Firebase assembly kit; the regular hosting build is a
single gallery with four independently installable PWA paths.
"""
import argparse,hashlib,json,posixpath,re,shutil,subprocess,runpy,unicodedata
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED

ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--directory',type=Path,default=ROOT/'firebase-public')
p.add_argument('--hosting',action='store_true')
p.add_argument('--archives',action='store_true')
a=p.parse_args();OUT=a.directory.resolve()
if OUT==ROOT or OUT in ROOT.parents or OUT.is_symlink():raise SystemExit('Choose a separate build directory.')
if OUT.exists() and any(OUT.iterdir()):
 if OUT==ROOT/'firebase-public' or (OUT/'edition-build.json').exists():shutil.rmtree(OUT)
 else:raise SystemExit('Output directory must be empty or an earlier suite build.')
OUT.mkdir(parents=True,exist_ok=True)
def dump(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'))
def write(base,name,data):
 path=base/name;path.parent.mkdir(parents=True,exist_ok=True)
 if isinstance(data,bytes):path.write_bytes(data)
 else:path.write_text(data)

DEFINITIONS=[
 {'id':'start','ar':'حروف – البداية والقراءة','de':'Huroof – Lesen lernen','archive':'Huroof-Start.zip',
  'description':'الحروف وأشكالها، الحركات، الكتابة، الأصوات المتشابهة، الهجاء ومدرّب القراءة.','descriptionDe':'Alphabet, Schreibformen, Vokale, Schreiben, ähnliche Laute, Lautübungen und Lesetrainer.',
  'routes':[['letters.html','الحروف وتدريباتها','Alphabet und Übungen'],['reading.html','القراءة والهجاء','Lesen und Buchstabieren'],['reading-trainer.html','مدرّب القراءة','Lesetrainer'],['progress.html','تقدّمي','Mein Lernstand']],
  'levels':[],'statFields':['readingTrainerV1','phonicsV1'],'practiceKeys':['jisrPracticeV1:sounds']},
 {'id':'a1-a2','ar':'حروف – العربية للمبتدئين A1 وA2','de':'Huroof – Arabisch A1 und A2','archive':'Huroof-A1-A2.zip',
  'description':'مفردات المستويين، القواعد الأساسية، الجمل، القصص والمهارات ضمن وحدات مترابطة.','descriptionDe':'Wortschatz, Grundlagen, Sätze, Geschichten und Fertigkeiten in zusammenhängenden Einheiten.',
  'routes':[['vocabulary.html','المفردات A1 وA2','Wortschatz A1 und A2'],['skills.html','المهارات والوحدات','Fertigkeiten und Einheiten'],['sentences.html','تكوين الجمل','Sätze bilden'],['stories.html','قصص قصيرة','Kurzgeschichten'],['grammar.html','القواعد والإملاء','Grammatik und Rechtschreibung'],['verbs.html','تصريف الأفعال الشائعة','Häufige Verben'],['review.html','مراجعة المفردات','Wörter wiederholen'],['stats.html','تقدّمي','Mein Lernstand']],
  'levels':['A1','A2'],'statFields':['skillsV1'],'practiceKeys':['jisrPracticeV1:sentences','jisrPracticeV1:stories']},
 {'id':'b1-b2','ar':'حروف – تطوير العربية B1 وB2','de':'Huroof – Arabisch B1 und B2','archive':'Huroof-B1-B2.zip',
  'description':'مفردات B1 وB2، ودروس القواعد والتصريف المتقدّم المتاحة في التطبيق.','descriptionDe':'Wortschatz B1 und B2 sowie die vorhandenen weiterführenden Grammatik- und Verbübungen.',
  'routes':[['vocabulary.html','المفردات B1 وB2','Wortschatz B1 und B2'],['grammar.html','القواعد والإملاء المتقدّم','Weiterführende Grammatik'],['verbs.html','تصريف الأفعال المتقدّم','Weiterführende Verbformen'],['review.html','مراجعة المفردات','Wörter wiederholen'],['stats.html','تقدّمي','Mein Lernstand']],
  'levels':['B1','B2'],'statFields':[],'practiceKeys':[]},
 {'id':'books','ar':'حروف – الكتب والاختبارات','de':'Huroof – Bücher und Prüfungen','archive':'Huroof-Books.zip',
  'description':'الكتب الأربعة، مفردات الكتابين ببطاقاتها واختباراتها، واختبارات الأستاذ محمود بركات وتحديد المستوى.','descriptionDe':'Vier Bücher, beide Buchwortschätze mit Lernkarten und Tests, Lehrerprüfungen und Einstufungschecks.',
  'routes':[['books.html','الكتب الأربعة','Vier Bücher'],['vocabulary.html','مفردات الكتب','Buchwortschatz'],['exams.html','اختبارات الأستاذ محمود بركات','Lehrerprüfungen'],['placement.html','تحديد المستوى','Einstufung'],['review.html','مراجعة مفردات الكتب','Buchwörter wiederholen'],['stats.html','تقدّمي','Mein Lernstand']],
  'levels':[],'statFields':['teacherExamsV1','placementV1'],'practiceKeys':['jisrPracticeV1:book-two','jisrPracticeV1:arabic-youth','jisrPracticeV1:youth-two','jisrPracticeV1:youth-book-two-part-one']}
]
extract=r'''const g=require('./js/grammar-data.js'),v=require('./js/verb-data.js'),p=require('./js/practice-data.js');console.log(JSON.stringify({grammar:g,verbs:v.verbs,practice:{...p,sounds:p.sounds}}));'''
data=json.loads(subprocess.check_output(['node','-e',extract],cwd=ROOT,text=True))
catalog=json.loads((ROOT/'data/vocab_catalog.json').read_text())
basic_ids=[x['id'] for x in data['grammar']['lessons'] if x['stage'] in ['start','build']]
advanced_ids=[x['id'] for x in data['grammar']['lessons'] if x['id'] not in basic_ids]
VOCAB_PAGES=['vocabulary','lernseite','test','test1','test2','test3','test4','test5','test6','ergebnis','review','stats']
FOUNDATION=['letters','huruf','letter-tests','sounds','reading','reading-trainer']
BOOKS=['books','book-level-two','youth-book-two-part-one','youth-training-two','arabic-youth','exams','placement']
owners={**{n+'.html':'start' for n in FOUNDATION},**{n+'.html':'books' for n in BOOKS},**{n+'.html':'a1-a2' for n in ['skills','sentences','stories',*VOCAB_PAGES,'grammar','verbs']}}
all_details=[{k:d[k] for k in ['id','ar','de','archive','description','descriptionDe']} for d in DEFINITIONS]
def strings(v):
 if isinstance(v,str):yield v
 elif isinstance(v,list):
  for x in v:yield from strings(x)
 elif isinstance(v,dict):
  for x in v.values():yield from strings(x)
def norm(s):return unicodedata.normalize('NFC',s)
def audio_subset(mapping,values):
 wanted={norm(x) for x in strings(values)}
 return {k:v for k,v in mapping.items() if norm(k) in wanted}

PWA=runpy.run_path(str(ROOT/'tools/build-pwa.py'),run_name='suite_pwa_builder')
summaries=[]
for definition in DEFINITIONS:
 d=json.loads(json.dumps(definition));ident=d['id'];base=OUT/ident;base.mkdir()
 pages=['index','apps','login','admin','offline']
 if ident=='start':pages+=FOUNDATION+['progress']
 elif ident=='a1-a2':pages+=VOCAB_PAGES+['skills','sentences','stories','grammar','verbs']
 elif ident=='b1-b2':pages+=VOCAB_PAGES+['grammar','verbs']
 else:pages+=VOCAB_PAGES+BOOKS
 pages=list(dict.fromkeys(pages));d['pages']=[n+'.html' for n in pages]
 ids=basic_ids if ident=='a1-a2' else advanced_ids if ident=='b1-b2' else []
 d.update(grammarIds=ids,basicLessons=basic_ids,advancedLessons=advanced_ids,owners=owners,editions=all_details,suite=True)
 d['routes']=[{'href':href,'ar':ar,'de':de,'description':'افتح الدروس والتدريبات وتابع من حيث توقفت.','descriptionDe':'Lektionen und Übungen öffnen und weiterlernen.'} for href,ar,de in d['routes']]
 scoped={k:v for k,v in catalog.items() if k not in ['bookVocabulary','bookVocabulary2']}
 scoped['lists']=[l for l in catalog['lists'] if l['level'] in d['levels']] if catalog['lists'] and 'level' in catalog['lists'][0] else [l for l in catalog['lists'] if any(l['id'] in lev['listIds'] for lev in catalog['levels'] if lev['id'] in d['levels'])]
 scoped['levels']=[l for l in catalog['levels'] if l['id'] in d['levels']];scoped['cefrLevels']=d['levels']
 if ident=='books':
  for key in ['bookVocabulary','bookVocabulary2']:scoped[key]=catalog[key]
 all_lists=[*scoped['lists'],*(scoped.get('bookVocabulary',{}).get('lists',[])),*(scoped.get('bookVocabulary2',{}).get('lists',[]))]
 d['listIds']=[l['id'] for l in all_lists]
 if all_lists:
  first=all_lists[0];d['initialList']=[[w['ar'],w['de']] for w in first['words']];d['initialSource']={'id':first['id'],'type':'ready-list','title':first['title']}
 else:d['initialList']=[];d['initialSource']={}
 lessons=[json.loads(json.dumps(l)) for l in data['grammar']['lessons'] if l['id'] in ids]
 for l in lessons:l['prerequisites']=[i for i in l.get('prerequisites',[]) if i in ids]
 stages=[{**s,'ids':[i for i in s['ids'] if i in ids]} for s in data['grammar']['stages'] if any(i in ids for i in s['ids'])]
 grammar={**data['grammar'],'lessons':lessons,'stages':stages,'basicVerbs':data['grammar']['basicVerbs'] if ident=='a1-a2' else []}
 verbs=data['verbs'][:30] if ident=='a1-a2' else data['verbs'][30:] if ident=='b1-b2' else []
 practice={**data['practice'],'sentences':data['practice']['sentences'] if ident=='a1-a2' else [],'stories':data['practice']['stories'] if ident=='a1-a2' else [],'sounds':data['practice']['sounds'] if ident=='start' else []}
 practice['audio']=audio_subset(practice['audio'],[practice['sentences'],practice['stories'],practice['sounds']])
 counts={'vocabularyLists':len(scoped['lists']),'vocabularyWords':sum(len(l['words']) for l in scoped['lists']),'bookVocabularyLists':len(all_lists)-len(scoped['lists']),'bookVocabularyWords':sum(len(l['words']) for l in all_lists)-sum(len(l['words']) for l in scoped['lists']),'grammarLessons':len(lessons),'grammarQuestions':sum(len(l['questions']) for l in lessons),'verbs':len(verbs),'skillsUnits':12 if ident=='a1-a2' else 0,'stories':len(practice['stories']),'sentences':len(practice['sentences']),'letters':28 if ident=='start' else 0,'readingWords':150 if ident=='start' else 0,'books':4 if ident=='books' else 0}
 d['counts']=counts;d['summary']=d['description'];d['summaryDe']=d['descriptionDe']
 overrides={
  'data/vocab_catalog.json':dump(scoped),'data/vocab_catalog_fallback.js':'window.VOCAB_CATALOG_META='+dump({'lists':len(all_lists)})+';window.VOCAB_CATALOG_FALLBACK='+dump(scoped)+';',
  'js/edition-config.js':'window.HuroofEditionConfig='+dump(d)+';',
  'js/grammar-data.js':'window.ArabicGrammarData='+dump(grammar)+';',
 }
 overrides['js/app.js']=(ROOT/'js/app.js').read_text()+'''\n(()=>{const E=window.HuroofEdition;if(E?.initialList.length&&!window.JisrStorage.local.getItem('vocabList'))window.VocabApp.saveVocabList(E.initialList,E.initialSource)})();'''
 source=(ROOT/'js/verb-data.js').read_text();start=source.index('  const verbs = ');end=source.index('  const pronouns = ')
 overrides['js/verb-data.js']=source[:start]+'  const verbs = '+dump(verbs)+';\n'+source[end:]
 sound_function=(ROOT/'js/practice-data.js').read_text().split('  function soundQuestions(')[1].split('  const variants = ')[0]
 overrides['js/practice-data.js']='(()=>{const data='+dump(practice)+';function soundQuestions('+sound_function+'\ndata.soundQuestions=soundQuestions;window.ArabicPracticeData=data})();'
 for filename,variable in [('vocab-audio-data.js','ArabicVocabularyAudio'),('book-vocabulary-audio.js','ArabicBookVocabularyAudio')]:
  capture="console.log(JSON.stringify(require('./js/"+filename+"')))" if filename=='book-vocabulary-audio.js' else "const vm=require('vm'),fs=require('fs'),c={window:{}};vm.runInNewContext(fs.readFileSync('./js/vocab-audio-data.js','utf8'),c);console.log(JSON.stringify(c.window.ArabicVocabularyAudio))"
  audio=json.loads(subprocess.check_output(['node','-e',capture],cwd=ROOT,text=True));audio['audio']=audio_subset(audio['audio'],all_lists)
  overrides['js/'+filename]='window.'+variable+'='+dump(audio)+';'
 design=(ROOT/'js/design.js').read_text();nav=[['index.html','home','Übersicht','نظرة عامة']]+[[r['href'],'book',r['de'],r['ar']] for r in d['routes']]
 if ident!='start':nav.insert(-1,['test.html','check','Vokabeltests','اختبارات المفردات'])
 nav.append(['apps.html','home','Weitere Apps','التطبيقات الأخرى'])
 design=re.sub(r'    const nav =.*?    const activeHref =.*?;\n','    const nav = '+dump(nav)+'.concat(window.OliveAccess?.isAdmin() ? [["admin.html","check","Verwaltung","لوحة الإدارة"]] : []);\n    const activeHref = page;\n',design,count=1,flags=re.S)
 overrides['js/design.js']=design
 route_source=(ROOT/'js/learning-path.js').read_text();first=route_source.index('  const stages = ');last=route_source.index('  const groups = ')
 overrides['js/learning-path.js']=route_source[:first]+'  const stages = '+dump([{'id':r['href'].split('.')[0],**r} for r in d['routes']])+';\n'+route_source[last:]
 if ident=='books':
  source=(ROOT/'js/pages/home.js').read_text();source=source.replace('    const levels =\n','    if (!catalog.levels.length) { document.getElementById("ready-lists-panel").hidden=true; return; }\n    const levels =\n');source=source.replace('listsPanel.hidden = false;','listsPanel.hidden = true;');overrides['js/pages/home.js']=source
 config=(ROOT/'js/firebase-config.js').read_text();config=re.sub(r'    enabled:.*?\n    emulator,','    enabled: location.protocol !== "file:" && ((!['+'"localhost","127.0.0.1","[::1]"'+'].includes(hostname)) || emulator || document.documentElement.dataset.oliveHosted === "true"),\n    emulator,',config,count=1,flags=re.S);overrides['js/firebase-config.js']=config
 removed={'js/grammar-expanded.js','js/grammar-syntax.js','js/grammar-path-data.js','js/sentence-expanded-data.js','js/pages/route-home.js'}
 def get(name):return overrides[name] if name in overrides else (ROOT/name).read_text()
 def html_body(kind):
  if kind=='index':body='<p class="edition-intro" id="edition-summary"></p><div class="edition-grid" id="edition-routes"></div><section class="edition-migration"><h2 data-ar="تقدّمك في النسخة السابقة" data-de="Dein bisheriger Lernstand">تقدّمك في النسخة السابقة</h2><p data-ar="استورد الإنجازات المناسبة لهذا التطبيق دون تغيير سجلك القديم. الإحصاءات العامة المختلطة تبقى في النسخة السابقة." data-de="Passende Lernstände übernehmen; bisherige Daten und frühere Gesamtstatistiken bleiben erhalten.">استورد الإنجازات المناسبة لهذا التطبيق دون تغيير سجلك القديم.</p><button class="practice-button" id="edition-import" data-ar="استيراد تقدّمي السابق" data-de="Bisherigen Lernstand übernehmen">استيراد تقدّمي السابق</button><p id="edition-import-status" role="status"></p></section>'
  elif kind=='apps':body='<p data-ar="كل تطبيق مستقل بمحتواه وتقدّمه. اختر التطبيق المناسب لك." data-de="Jede App hat eigene Inhalte und Lernstände. Wähle deinen Einstieg.">كل تطبيق مستقل بمحتواه وتقدّمه.</p><div class="edition-grid" id="edition-directory"></div>'
  else:body='<div class="home-panel" id="edition-progress"></div><a class="practice-button" href="reading-trainer.html" data-ar="تابع مدرّب القراءة" data-de="Mit dem Lesetrainer weiterlernen">تابع مدرّب القراءة</a>'
  return '<main class="container edition-page"><header class="edition-heading"><img src="images/brand/olive-symbol.svg" alt=""><div><span class="edition-badge" data-ar="تطبيق مستقل · حروف من الزيتون" data-de="Eigenständige App · Huroof">تطبيق مستقل · حروف من الزيتون</span><h1 data-ar="'+d['ar']+'" data-de="'+d['de']+'">'+d['ar']+'</h1></div></header>'+body+'</main><footer class="teacher-credit">إعداد الأستاذ محمود بركات</footer>'
 def page_source(name):
  template='index.html' if name in ['index','apps','progress'] else name+'.html';source=(ROOT/template).read_text()
  if name=='offline':return source.replace('</title>',' · '+d['ar']+'</title>')
  if name in ['index','apps','progress']:
   first=source.index('<main ');last=source.index('<footer ',first);end=source.index('</footer>',last)+len('</footer>');source=source[:first]+html_body(name)+source[end:]
  source=re.sub(r'<script\b[^>]*src=["\']([^"\']+)["\'][^>]*>\s*</script>',lambda m:'' if m[1].split('?')[0] in removed else m[0],source)
  if name in ['index','apps','progress']:source=re.sub(r'<p[^>]*class="teacher-exams-context".*?</p>','',source,flags=re.S)
  if ident!='a1-a2':source=re.sub(r'<section class="home-panel"><h2 data-ar="استعمل مفرداتك.*?</section>','',source,flags=re.S)
  source=source.replace('</title>',' · '+d['ar']+'</title>')
  if a.hosting:source=source.replace('<html ','<html data-olive-hosted="true" ',1)
  source=source.replace('</head>','<link rel="stylesheet" href="css/editions.css"><script src="js/edition-ui.js" defer></script></head>')
  source=source.replace('<head>','<head><script src="js/edition-config.js"></script><script src="js/edition.js"></script>',1)
  return source
 included={}
 refs=re.compile(r'''(?:["'(=\s])((?:js|css|data|images|fonts|audio)/[\w./-]+\.(?:js|css|json|svg|png|jpg|jpeg|webp|woff2?|ttf|mp3))''',re.UNICODE)
 def include(name):
  name=name.split('?')[0]
  if name in included:return
  path=ROOT/name
  if name not in overrides and not path.is_file():raise ValueError('Missing asset '+name)
  payload=get(name).encode() if name in overrides or path.suffix in ['.js','.css','.json','.svg'] else path.read_bytes();included[name]=payload
  if Path(name).suffix in ['.js','.css','.json','.svg']:
   text=payload.decode()
   for ref in refs.findall(text):include(ref)
   if name.endswith('.css'):
    for ref in re.findall(r'url\(["\']?([^\)"\']+)',text):
     if not re.match(r'^(?:data:|https?:|#|/)',ref):include(posixpath.normpath(str(Path(name).parent/ref)))
 def portable(source,name):
  def script(m):
   reference=m[1].split('?')[0]
   if reference.startswith('https://cdn.jsdelivr.net/npm/xlsx@'):reference='js/vendor/xlsx.full.min.js'
   if reference.startswith('http'):
    return '<script type="application/x-olive-app" data-auth-src="'+m[1]+'"></script>'
   include(reference);code=included[reference].decode().replace('</script','<\\/script')
   core=reference in ['js/edition-config.js','js/edition.js','js/storage.js','js/firebase-config.js','js/access-client.js','js/auth-session.js','js/pwa.js'] or name=='login'
   return '<script '+('data-source="'+reference+'"' if core else 'type="application/x-olive-app" data-auth-src="'+reference+'"')+'>'+code+'</script>'
  source=re.sub(r'<script\b[^>]*src=["\']([^"\']+)["\'][^>]*>\s*</script>',script,source)
  def style(m):
   reference=m[1].split('?')[0];include(reference);css=included[reference].decode()
   css=re.sub(r'url\(([^)]+)\)',lambda u:u[0] if re.match(r'^[a-z][a-z0-9+.-]*:|^/|^#',u[1].strip('"\' '),re.I) else 'url("'+posixpath.normpath(str(Path(reference).parent/u[1].strip('"\' ')))+'")',css)
   return '<style data-source="'+reference+'">'+css+'</style>'
  source=re.sub(r'<link\b[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>',style,source)
  for ref in refs.findall(source):include(ref)
  return source
 for name in pages:write(base,name+'.html',portable(page_source(name),name))
 # Runtime-created paths and the on-demand authentication/synchronisation SDK.
 include('data/vocab_catalog.json')
 for name in ['js/cloud-sync-core.js','js/cloud-sync.js','js/vendor/firebase/firebase-app-compat.js','js/vendor/firebase/firebase-auth-compat.js','js/vendor/firebase/firebase-firestore-compat.js']:include(name)
 for group in ['images/pwa','images/brand']+(['images/book-two','images/youth','images/youth-two','images/exams'] if ident=='books' else []):
  for path in (ROOT/group).rglob('*'):
   if path.is_file() and path.suffix.lower() in ['.svg','.png','.jpg','.webp']:include(path.relative_to(ROOT).as_posix())
 for name,payload in included.items():write(base,name,payload)
 for license_name in ['fonts/OFL.txt','fonts/NotoNaskhArabic-OFL.txt']+(['js/vendor/xlsx-LICENSE.txt'] if 'js/vendor/xlsx.full.min.js' in included else []):
  write(base,license_name,(ROOT/license_name).read_bytes())
 manifest=json.loads((ROOT/'manifest.webmanifest').read_text());manifest.update(id='./',name=d['ar'],short_name=d['ar'].replace('حروف – ',''),description=d['description'],start_url='./index.html?source=pwa',scope='./',shortcuts=[{'name':r['ar'],'url':'./'+r['href']} for r in d['routes'][:4]])
 write(base,'manifest.webmanifest',dump(manifest));write(base,'edition-manifest.json',dump({**d,'hosted':a.hosting}))
 write(base,'README-APP.txt',d['ar']+'\n'+d['de']+'\n\n'+d['description']+'\n\n'+
  'فك الضغط أولًا، ثم افتح index.html على الحاسوب أو ارفع ملفات المجلد إلى استضافة ثابتة.\n'+
  'Entpacke zuerst die ZIP. Öffne index.html am Computer oder lade den Ordner auf ein statisches Hosting.\n\n'+
  'عند النشر تستخدم النسخة إعدادات Firebase الحالية وقائمة الإيميلات المسموحة.\n'+
  'لتجميع التطبيقات الأربعة على الموقع نفسه استخدم Huroof-Suite-Setup.zip ودليل README-AR.md داخله.\n'+
  'Beim Online-Hosting gelten die bisherigen Firebase-Zugangsdaten und E-Mail-Freigaben.\n'+
  'Für alle vier Apps auf derselben Website verwende Huroof-Suite-Setup.zip.\n\n'+
  'التقدم منفصل لكل تطبيق؛ اللغة والمظهر مشتركان عند الاستضافة على النطاق نفسه.\n'+
  'Lernstände werden je App getrennt gespeichert; Sprache und Design sind auf derselben Domain gemeinsam.\n')
 files={p.relative_to(base).as_posix():p.read_bytes() for p in base.rglob('*') if p.is_file()};write(base,'pwa-worker.js',PWA['render_worker'](files))
 summaries.append({'id':ident,**counts,'files':len(files)+1,'bytes':sum(len(x) for x in files.values())})
 print('EDITION',ident,counts,'assets',len(included),flush=True)
 if a.archives:
  archive_files={path.relative_to(base).as_posix():path.read_bytes() for path in sorted(base.rglob('*')) if path.is_file()}
  for name,payload in list(archive_files.items()):
   if Path(name).suffix in ['.html','.js','.json']:archive_files[name]=payload.replace(b'"suite":true',b'"suite":false')
  archive_files['pwa-worker.js']=PWA['render_worker'](archive_files).encode()
  with ZipFile(ROOT/'downloads'/d['archive'],'w',ZIP_DEFLATED) as z:
   for name,payload in archive_files.items():z.writestr(ident+'/'+name,payload)

cards=''.join('<a class="card" href="'+d['id']+'/index.html"><span>'+str(i+1)+'</span><h2>'+d['ar']+'</h2><p>'+d['description']+'</p><b>افتح التطبيق ←</b></a>' for i,d in enumerate(DEFINITIONS))
hub='''<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>حروف من الزيتون · التطبيقات الأربعة</title><style>@font-face{font-family:Olive;src:url('start/fonts/noto-naskh-arabic.woff')}*{box-sizing:border-box}body{margin:0;background:#f6f4e9 url('start/images/brand/olive-pattern.svg');color:#224737;font-family:Olive,Tahoma,sans-serif}main{max-width:1100px;margin:auto;padding:40px 20px}header{text-align:center;margin-bottom:30px}header img{width:100px}h1{font-size:clamp(30px,5vw,47px);margin:8px}header p{font-size:23px}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,430px),1fr));gap:22px}.card{padding:30px;background:#fffef6ed;border:1px solid #c1d0ae;border-radius:26px;text-decoration:none;color:inherit;box-shadow:0 10px 35px #3553390a}.card:hover,.card:focus{outline:3px solid #7c9959}.card span{display:inline-grid;place-items:center;width:45px;height:45px;border-radius:50%;background:#dce8c6;font:700 24px Tahoma}.card h2{font-size:29px;margin:14px 0}.card p{font-size:22px;line-height:1.8}.card b{display:inline-block;background:#365f43;color:white;border-radius:13px;padding:10px 24px;font-size:21px}footer{text-align:center;font-size:21px;margin-top:30px}</style><main><header><img src="start/images/brand/olive-symbol.svg" alt=""><h1>حروف من الزيتون</h1><p>اختر التطبيق المناسب لمرحلتك. لكل تطبيق محتواه وتقدّمه المستقل.</p></header><div class="cards">'''+cards+'''</div><footer>إعداد الأستاذ محمود بركات</footer></main></html>'''
hub=hub.replace('</html>',"<script>try{localStorage.setItem('huroofSuiteBaseV1',new URL('.',location.href).href)}catch(_){};if('serviceWorker'in navigator)navigator.serviceWorker.getRegistrations().then(rs=>rs.filter(r=>r.scope===new URL('.',location.href).href).forEach(r=>r.update())).catch(()=>{});</script></html>")
hub=hub.replace('<title>','<link rel="manifest" href="manifest.webmanifest"><title>',1)
write(OUT,'index.html',hub);write(OUT,'edition-build.json',dump({'schema':1,'editions':summaries}))
gallery_manifest=json.loads((ROOT/'manifest.webmanifest').read_text());gallery_manifest.update(name='حروف من الزيتون · التطبيقات الأربعة',short_name='حروف من الزيتون',start_url='./index.html',scope='./',shortcuts=[{'name':d['ar'],'url':'./'+d['id']+'/index.html'} for d in DEFINITIONS])
for icon in gallery_manifest['icons']:icon['src']='start/'+icon['src'].lstrip('./')
write(OUT,'manifest.webmanifest',dump(gallery_manifest))
retire='''/* Retire only the former monolithic root worker; never remove learner storage. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const base=new URL(self.registration.scope),prefix='huroof-pwa:'+base.pathname+':';
 for(const name of await caches.keys())if(name.startsWith(prefix))await caches.delete(name);
 await self.registration.unregister();
 for(const client of await self.clients.matchAll({type:'window'})){
  const url=new URL(client.url);if(url.origin===base.origin&&[base.pathname,base.pathname+'index.html'].includes(url.pathname))await client.navigate(base.href);
 }
})()));
'''
write(OUT,'pwa-worker.js',retire)
if a.archives:
 config=json.loads((ROOT/'firebase.json').read_text());config['hosting']['public']='.';config['hosting'].pop('predeploy',None);config['hosting']['ignore']=['firebase.json','firestore*','.firebaserc','**/.*','**/*.zip','**/*.md','**/*.txt','**/node_modules/**']
 # The assembly kit is deliberately small; unzip the four named app folders next to its index.html.
 with ZipFile(ROOT/'downloads/Huroof-Suite-Setup.zip','w',ZIP_DEFLATED) as z:
  z.writestr('Huroof-Four-Apps/index.html',hub);z.writestr('Huroof-Four-Apps/firebase.json',json.dumps(config,indent=2)+'\n')
  z.writestr('Huroof-Four-Apps/manifest.webmanifest',dump(gallery_manifest));z.writestr('Huroof-Four-Apps/pwa-worker.js',retire)
  for name in ['.firebaserc','firestore.rules','firestore.indexes.json','suite/README-AR.md']:z.write(ROOT/name,'Huroof-Four-Apps/'+Path(name).name)
  z.writestr('Huroof-Four-Apps/edition-build.json',dump({'schema':1,'editions':summaries}))
 print('ARCHIVES ready: four apps and Huroof-Suite-Setup.zip',flush=True)
