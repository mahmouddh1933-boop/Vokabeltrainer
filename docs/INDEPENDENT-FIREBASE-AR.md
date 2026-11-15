# مشروع Firebase منفصل لكل تطبيق

هذه طريقة إضافية للنشر: كل تطبيق له مشروع وقاعدة Firestore وحسابات Authentication ولوحة إدارة مستقلة. ملفات المشروع السابق وحساباته وتقدّمه تبقى كما هي. لا تنتقل الحسابات أو إنجازات الطلاب تلقائيًا بين المشاريع.

## الحزمتان المضبوطتان على المشروعين الجديدين

- [الحروف — huroof-start-e3250](../downloads/Huroof-Start-Firebase-Ready.zip)
- [A1/A2 — huroof-a1-a2](../downloads/Huroof-A1-A2-Firebase-Ready.zip)

تحتوي هاتان الحزمتان إعدادات Web التي زوّد بها المستخدم، ولا تحتاجان تعديل الإعدادات. في كل مشروع تأكد من تفعيل Authentication → Email/Password ووجود قاعدة Cloud Firestore Standard بمعرّف `(default)` في وضع Production. فك الحزمة وافتح المجلد الذي يحتوي `firebase.json`، ثم نفّذ من PowerShell:

```powershell
node deploy-firebase.cjs
```

يتحقق السكربت من تطابق المشروع وينشر القواعد ثم الموقع إلى ذلك المشروع فقط. إذا طلب تسجيل الدخول استخدم `npx.cmd firebase-tools login`. تعليمات تفعيل حساب المدير موجودة في الخطوة 7 أدناه وفي README-AR.md داخل كل حزمة. هذه الحزم جاهزة للنشر؛ تجهيزها لا يعني أن النشر أو كتابة بيانات حقيقية على Firestore قد تمت.

## حزم الإعداد العامة

حمّل الحزمة المطابقة للتطبيق:

- [البداية والحروف](../downloads/Huroof-Start-Firebase-Independent.zip)
- [العربية A1/A2](../downloads/Huroof-A1-A2-Firebase-Independent.zip)
- [العربية B1/B2](../downloads/Huroof-B1-B2-Firebase-Independent.zip)
- [الكتب والاختبارات](../downloads/Huroof-Books-Firebase-Independent.zip)

الحزم جاهزة للإعداد، وليست مرتبطة بمشاريع جديدة بعد. لا ترث مفاتيح المشروع المشترك. تتضمن كل حزمة firebase.json والقواعد ومجلد public وسكربتي الإعداد والنشر.

## إعداد كل مشروع

1. من https://console.firebase.google.com/ أنشئ مشروعًا لهذا التطبيق؛ استخدم Project ID مختلفًا لكل واحد من التطبيقات الأربعة. اسم العرض يمكن أن يكون بالعربية، أما Project ID فانسخه كما يظهر في الإعدادات.
2. اختر Spark إذا أردت استخدام الحصة المجانية، وفعّل Email/Password من Authentication.
3. أنشئ قاعدة Cloud Firestore Standard بمعرّف `(default)` في وضع Production.
4. من Project settings → Your apps سجّل تطبيق Web بالزر `</>`. انسخ إعدادات `firebaseConfig` العامة لهذا المشروع في ملف باسم `firebase-web-config.json` داخل حزمته. يقبل المُعدّ كائن JSON أو نص `const firebaseConfig = {...}` المنسوخ من Console.
5. افتح المجلد الذي يحتوي firebase.json في PowerShell، ونفّذ:

```powershell
node configure-firebase.cjs
npx.cmd firebase-tools login
node deploy-firebase.cjs
```

يكتب سكربت الإعداد إعدادات المشروع في جميع صفحات التطبيق، ويضبط `.firebaserc` ويحدّث نسخة التخزين دون اتصال. يفحص سكربت النشر تطابق المشروع وينشر القواعد أولًا ثم الاستضافة. لا تحتاج إلى `firebase init` أو Python على جهازك.

6. افتح الرابط الذي يظهر بعد النشر: `https://PROJECT_ID.web.app/`. تحقق من إضافة النطاق إلى Authorized domains في Authentication.
7. أنشئ حسابك في التطبيق وأكّد البريد. انسخ UID حسابك من Authentication → Users. أنشئ في Firestore مجموعة `oliveFreeAdmins`، ومستندًا بمعرّف UID نفسه، وحقل `enabled` من نوع boolean بقيمة true. أعد تسجيل الدخول لتفتح لوحة الإدارة وتضيف إيميلات الطلاب.

كرر الإعداد في كل مشروع؛ مستند المدير وقائمة الطلاب يخصان مشروعهما. لا تنسخ إعدادات Web نفسها إلى التطبيقات الأربعة. لا يحتاج هذا الإعداد إلى ملف Service Account أو مفتاح خاص.

## إعادة بناء الحزم وفحصها

```sh
python3 tools/build-suite.py --directory firebase-public --hosting
python3 tools/build-independent-firebase.py --archives
python3 tests/independent-firebase-packages.py
```

الاختبارات تستخدم إعدادات Web تجريبية ومحاكاة تسجيل الدخول داخل المتصفح للتحقق من اختيار المشروع، ومسارات الصفحات، وحاجز النشر، وتجديد ملفات PWA. لا تنشئ مشاريع ولا تتصل ببيانات إنتاج، ولا تعني أن تسجيل الدخول وقواعد Firestore اختُبرا على حساب Firebase حقيقي. قواعد الوصول المنسوخة هي قواعد المشروع القائمة نفسها.
