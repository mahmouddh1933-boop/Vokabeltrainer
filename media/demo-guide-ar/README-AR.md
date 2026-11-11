# دليل استخدام الديمو والاختبارات — بالعربية

نسخة شرح موسّعة مستقلة عن الإعلان القصير، بصوت عربي اصطناعي ونصوص مشكّلة،
بدقة 1920 × 1080. تعرض طريقة الدخول من الحاسوب والهاتف إلى كل فقرة متاحة
في الديمو، واختيار مستوى وقائمة مفردات قبل الاختبار، وحل الأنواع الستة،
والفرق بين الحروف الناقصة والمتصلة، وعرض النتائج والرجوع ومراجعة الأخطاء.
تشمل أيضًا تدريبات الحروف الأربعة، والأصوات المتشابهة، والجمل والقصص والقواعد
والأفعال والتقدم. لا تعرض كتبًا أو مفردات كتب أو مزامنة سحابية.

الإطار الذهبي يحدد الزر أو الحقل المقصود. جميع اللقطات مأخوذة من الديمو
الفعلي، باستخدام تخزين متصفح جديد. إجابة واحدة خاطئة مقصودة في مثال الكتابة
لإظهار التصحيح وقائمة المراجعة؛ يصرّح التعليق الصوتي بذلك. الأرقام الظاهرة
نتائج هذه التجربة المحلية، وليست بيانات طالب حقيقي.

الصوت: Piper / Kareem medium؛ ليس تسجيلًا للأستاذ محمود بركات. حركات النص
مراجعة، والتشكيل التلقائي للمحرك معطل، مع مراعاة الوقف في نهاية الجمل.
النموذج: https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-ar_JO-kareem-medium.tar.bz2
Piper: https://github.com/OHF-Voice/piper1-gpl
الموسيقى مولدة من نغمات جيبية، والخطوط وزخارف الزيتون من التطبيق.
مصادرها ورخصها في `fonts` و`images/brand/CREDITS.md`.

تضم الحزمة MP4، وملف SRT عربي مشكّل، ونص التعليق، وصورة المعاينة، وفهرس
المشاهد المناسب لـ YouTube. النصوص مدمجة في الفيديو أيضًا.

لإعادة الإنشاء، فكّ `downloads/Huroof-Demo.zip` خارج المستودع وشغّله على
خادم محلي على المنفذ 8086، وشغّل المستودع على المنفذ 8077. استخدم متطلبات
الصوت والفيديو الموضحة في `../demo-video/README-AR.md`، ثم نفّذ:

```sh
python tools/build-demo-video.py --language ar --media-directory media/demo-guide-ar \
  --output-stem Huroof-Demo-Anleitung --bundle-stem Huroof-Demo-Anleitung \
  --directory /tmp/huroof-demo-guide-ar --model /PATH/ar_JO-kareem-medium.onnx --step audio
python tools/capture-demo-guide-ar.py --directory /tmp/huroof-demo-guide-ar
python tools/build-demo-video.py --language ar --media-directory media/demo-guide-ar \
  --output-stem Huroof-Demo-Anleitung --bundle-stem Huroof-Demo-Anleitung \
  --directory /tmp/huroof-demo-guide-ar --step render
```

استخدم مجلد إخراج جديدًا عند تغيير النص أو الصور، لتجنب إعادة استعمال مقاطع
قديمـة من التخزين المؤقت. لا يتغير التطبيق الرئيسي عند إنشاء هذا الدليل.
