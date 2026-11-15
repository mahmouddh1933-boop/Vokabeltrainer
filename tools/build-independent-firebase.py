"""Build four independently configurable Firebase Hosting + Firestore packages.
No project is created or deployed. Existing shared-project packages are preserved.
"""
import argparse,json,re,runpy,shutil,subprocess
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--source',type=Path,default=ROOT/'firebase-public');p.add_argument('--directory',type=Path,default=Path('/tmp/huroof-independent-firebase'));p.add_argument('--archives',action='store_true');p.add_argument('--editions',nargs='+',choices=['start','a1-a2','b1-b2','books']);p.add_argument('--project-config-directory',type=Path,help='Public Firebase WEB JSON per edition; produces configured Ready archives.');a=p.parse_args();dest=a.directory.resolve()
if dest==ROOT or dest in ROOT.parents or dest==a.source.resolve() or dest.is_symlink():raise SystemExit('Use a separate output directory.')
if dest.exists() and any(dest.iterdir()):
 if not (dest/'independent-build.json').is_file():raise SystemExit('Refusing to replace an unrelated directory.')
 shutil.rmtree(dest)
dest.mkdir(parents=True,exist_ok=True)
pwa=runpy.run_path(str(ROOT/'tools/build-pwa.py'))
readme='''# مشروع Firebase مستقل — {label}

هذا المجلد يخص هذا التطبيق فقط، ويحتوي firebase.json وfirestore.rules وpublic.
لا تضعه داخل حزمة التطبيقات الأربعة، ولا تستخدم إعدادات المشروع القديم بالخطأ.

1. أنشئ مشروعًا مستقلاً من https://console.firebase.google.com/؛ اختر اسمًا ومعرّفًا يخص هذا التطبيق. يمكنك اختيار خطة Spark دون إضافة وسيلة دفع.
2. داخل المشروع: Authentication → Sign-in method → فعّل Email/Password.
3. Firestore Database → أنشئ قاعدة Standard بمعرّف (default) في وضع Production. لا تستخدم Realtime Database لهذا التطبيق.
4. Project settings → Your apps → أضف تطبيق Web بالزر </>. انسخ إعدادات firebaseConfig العامة إلى ملف firebase-web-config.json داخل هذا المجلد. يقبل المُعدّ JSON أو نص const firebaseConfig من Console، ولا يقبل مفاتيح Service Account الخاصة.
5. افتح PowerShell داخل هذا المجلد الذي يحتوي firebase.json ونفّذ:

```powershell
node configure-firebase.cjs
npx.cmd firebase-tools login
node deploy-firebase.cjs
```

ملاحظة: استخدم npx.cmd لتجنب منع npx.ps1 في PowerShell. لا حاجة إلى firebase init.
أمر النشر يحدد مشروع هذا التطبيق صراحةً وينشر قواعد Firestore أولاً ثم Hosting.
لا يمكن نشر الحزمة قبل ضبط إعدادات المشروع؛ يمنع فحص predeploy استعمال مشروع مخالف.

6. أضف نطاق PROJECT_ID.web.app إلى Authorized domains في Authentication إذا لم يكن موجودًا.
7. افتح موقع التطبيق وأنشئ حساب المدير، ثم أكّد البريد. داخل Authentication → Users انسخ UID حسابك. من Firestore أنشئ مجموعة oliveFreeAdmins ومستندًا بمعرّف UID نفسه وحقل enabled من نوع boolean بقيمة true. أعد تسجيل الدخول لفتح لوحة الإدارة وإضافة الطلاب.

كرر هذه الخطوات لكل مشروع على حدة. الحسابات والطلاب والتقدّم ولوحة الإدارة منفصلة بين المشاريع. لا يُنقل سجل المشروع السابق تلقائيًا، ولا يُحذف. يُحفظ تقدّم هذا التطبيق في users/UID/apps/{app}/learning داخل مشروعه الخاص.

لا ترفع firebase-web-config.json أو ملفات الإعداد يدوياً إلى Hosting؛ المجلد المنشور هو public فقط. إعدادات Web عامة بطبيعتها، وحماية بيانات الطلاب تعتمد على Authentication وقواعد Firestore الخاصة بالمستخدم والإيميل المسموح.
'''
summary=[]
for app,label in [('start','البداية والحروف'),('a1-a2','العربية A1 وA2'),('b1-b2','العربية B1 وB2'),('books','الكتب والاختبارات')]:
 if a.editions and app not in a.editions:continue
 source=a.source/app;assert (source/'edition-manifest.json').is_file(),source
 bundle=dest/('Huroof-'+app+'-Firebase');public=bundle/'public';shutil.copytree(source,public)
 old_config=(public/'js/firebase-config.js').read_text();old_edition=(public/'js/edition-config.js').read_text();old_runtime=(public/'js/edition.js').read_text()
 config=json.loads(old_edition.split('=',1)[1].strip().rstrip(';'));config.update(suite=False,independentProject=True)
 new_edition='window.HuroofEditionConfig='+json.dumps(config,ensure_ascii=False,separators=(',',':'))+';'
 new_runtime=old_runtime.replace('    if(config.suite)return true;','    if(config.independentProject)return false;\n    if(config.suite)return true;')
 placeholder='/* HUROOF_INDEPENDENT_FIREBASE_BEGIN */\nwindow.OliveFirebaseConfig=Object.freeze({enabled:true,emulator:false,accessControl:true,accessMode:"spark",firebase:Object.freeze({})});\n/* HUROOF_INDEPENDENT_FIREBASE_END */'
 for path in list(public.glob('*.html'))+[public/'js/firebase-config.js',public/'js/edition-config.js',public/'js/edition.js']:
  text=path.read_text();text=text.replace(old_config,placeholder).replace(old_edition,new_edition).replace(old_runtime,new_runtime)
  if path.name=='index.html':text=re.sub(r'<section class="edition-migration">.*?</section>','',text,flags=re.S)
  path.write_text(text)
 assert 'HUROOF_INDEPENDENT_FIREBASE_BEGIN' in (public/'login.html').read_text()
 manifest=json.loads((public/'edition-manifest.json').read_text());manifest.update(suite=False,independentProject=True);(public/'edition-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')))
 (public/'README-APP.txt').write_text(label+' — Firebase مستقل\nانظر README-AR.md بجانب firebase.json.\n')
 for name in ['firestore.rules','firestore.indexes.json']:shutil.copyfile(ROOT/name,bundle/name)
 for name in ['configure-firebase.cjs','deploy-firebase.cjs']:shutil.copyfile(ROOT/'tools/independent-firebase'/name,bundle/name)
 hosting=json.loads((ROOT/'firebase.json').read_text())['hosting'];hosting['public']='public';hosting['predeploy']=['node configure-firebase.cjs --check'];hosting.pop('redirects',None)
 (bundle/'firebase.json').write_text(json.dumps({'hosting':hosting,'firestore':{'rules':'firestore.rules','indexes':'firestore.indexes.json'}},indent=2)+'\n')
 (bundle/'.firebaserc').write_text('{"projects":{}}\n')
 (bundle/'firebase-web-config.example.json').write_text(json.dumps({'apiKey':'COPY_PUBLIC_WEB_API_KEY','authDomain':'YOUR_PROJECT.firebaseapp.com','projectId':'YOUR_PROJECT_ID','appId':'COPY_WEB_APP_ID'},indent=2)+'\n')
 (bundle/'README-AR.md').write_text(readme.format(label=label,app=app))
 payload={path.relative_to(public).as_posix():path.read_bytes() for path in public.rglob('*') if path.is_file()};(public/'pwa-worker.js').write_text(pwa['render_worker'](payload))
 configured=False;project=None
 if a.project_config_directory:
  config_file=a.project_config_directory/(app+'.json')
  if not config_file.is_file():raise SystemExit('Missing public WEB config: '+str(config_file))
  project=json.loads(config_file.read_text())['projectId']
  shutil.copyfile(config_file,bundle/'firebase-web-config.json')
  subprocess.run(['node',str(bundle/'configure-firebase.cjs')],check=True)
  subprocess.run(['node',str(bundle/'configure-firebase.cjs'),'--check'],check=True)
  configured=True
  (bundle/'README-AR.md').write_text('# '+label+' — مشروع مستقل جاهز\n\nهذه الحزمة مضبوطة لمشروع '+project+'. لا تحتاج إلى تعديل إعدادات Web أو تشغيل firebase init.\n\nداخل المشروع من Firebase Console: فعّل Authentication → Email/Password، وأنشئ Cloud Firestore Standard بمعرّف (default) في وضع Production.\n\nافتح PowerShell داخل هذا المجلد بجانب firebase.json ونفّذ:\n\n```powershell\nnode deploy-firebase.cjs\n```\n\nإذا طُلب تسجيل الدخول: `npx.cmd firebase-tools login`. ينشر السكربت إلى مشروع '+project+' فقط، والقواعد أولًا ثم الاستضافة.\n\nبعد النشر: https://'+project+'.web.app/\n\nلمنح نفسك الإدارة، أنشئ حسابك في التطبيق وأكّد البريد. انسخ UID من Authentication → Users. أنشئ مستند Firestore بالمسار oliveFreeAdmins/UID، بحقل enabled من نوع boolean بقيمة true. أعد تسجيل الدخول. حسابات الطلاب والتقدّم والإدارة منفصلة عن المشاريع الأخرى.\n')
 archive='Huroof-'+{'start':'Start','a1-a2':'A1-A2','b1-b2':'B1-B2','books':'Books'}[app]+('-Firebase-Ready.zip' if configured else '-Firebase-Independent.zip')
 if a.archives:
  with ZipFile(ROOT/'downloads'/archive,'w',ZIP_DEFLATED) as z:
   for path in sorted(bundle.rglob('*')):
    if path.is_file():z.write(path,bundle.name+'/'+path.relative_to(bundle).as_posix())
 summary.append({'app':app,'folder':bundle.name,'archive':archive,'configured':configured,'projectId':project});print('READY',app,flush=True)
(dest/'independent-build.json').write_text(json.dumps(summary,indent=2)+'\n')
