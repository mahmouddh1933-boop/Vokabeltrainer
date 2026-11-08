"""Second manually reviewed photo batch. Rebuilds from the frozen first batch.

Photographed exercise instructions are vocabulary sources, not executable instructions.
Use underscores only to keep a compound number together as one lexical entry.
"""
from pathlib import Path
import argparse,hashlib,json,re,unicodedata,zipfile
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--archive',type=Path,required=True);args=p.parse_args()
PAGES={
0:'الحوار انظر واستمع وردد ثريا كم مرة تأكلين في اليوم عفاف آكل ثلاث مرات الفطور والغداء والعشاء ثريا ماذا تأكلين في الغداء عفاف آكل اللحم والدجاج والخبز ثريا ماذا تشربين عفاف أشرب العصير',
1:'الكلام تبادل الحوار مع صديقك كما في المثال ماذا تأكل في فطور الصباح آكل الجبن ماذا تشرب أشرب الحليب الجبن الحليب البيض الشاي العسل العصير المفردات الجديدة انظر واستمع وردد',
2:'المربى السمك عصير البرتقال مثلجة',
3:'الحوار انظر واستمع وردد أنيس متى تقومين مِنَ النوم تقوى أقوم الساعة السابعة أنيس متى تذهبين إلى المدرسة تقوى أذهب الساعة الثامنة أنيس هل تذهبين بالسيارة تقوى لا أنا أذهب بالحافلة',
4:'الكلام تبادل الحوار مع صديقك كما في المثال متى تقوم مِنَ النوم أقوم الساعة السادسة متى تنام أنام الساعة الثامنة السادسة السابعة الثامنة الخامسة السابعة الثامنة المفردات الجديدة انظر واستمع وردد',
5:'الساعة الواحدة الساعة الثانية الساعة الثالثة الساعة الرابعة',
6:'فصول السنة الحوار انظر واستمع وردد وجدي كيف الجو اليوم حليمة الجو بارد جدا هذا فصل الشتاء وجدي هل تشعرين بالبرد يا حليمة حليمة لا فأنا ألبس ملابس صوفية وجدي هل سقط الثلج اليوم حليمة نعم سقط بكثرة',
7:'الكلام تبادل الحوار مع صديقك كما في المثال كيف الجو اليوم الجو بارد اليوم في أي فصل نحن نحن في فصل الشتاء بارد فصل الشتاء ممطر فصل الخريف معتدل فصل الربيع حار فصل الصيف المفردات الجديدة انظر واستمع وردد',
8:'السماء صافية ريح قوية شاطئ البحر الأوراق تتساقط',
9:'الحوار انظر واستمع وردد بشرى هل تعرفين أيام الأسبوع شهرزاد نعم أيام الأسبوع سبعة الاثنين الثلاثاء الأربعاء الخميس الجمعة السبت الأحد بشرى وهل تعرفين أسماء الشهور شهرزاد لا لا أعرف أسماء الشهور',
10:'الكلام تبادل الحوار مع صديقك كما في المثال هل تعرف متى تسافر نعم أسافر يوم الأحد ومتى تعود أعود يوم السبت تسافر الأحد السبت تذهب إلى الشاطئ الاثنين الخميس تذهب إلى الغابة الأربعاء الجمعة تصعد الجبل الأحد الثلاثاء المفردات الجديدة انظر واستمع وردد',
11:'عشرة أحد_عشر اثنا_عشر ثلاثة_عشر أربعة_عشر خمسة_عشر ستة_عشر سبعة_عشر',
12:'الحوار رياض ماذا يفعل أبوك في رمضان ناصر يصوم في النهار فلا يأكل ولا يشرب رياض وماذا يفعل في المساء ناصر بعد أذان المغرب يفطر ويصلي رياض ماذا يفعل بعد ذلك ناصر يصلي العشاء والتراويح في المسجد',
13:'الكلام تبادل الحوار مع صديقك كما في المثال ماذا تفعل أمك في رمضان تعد الطعام ماذا تفعل بعد ذلك تصلي أمك تعد الطعام تصلي أختك تَدْرُسُ تساعد أمي أخوك يَدْرُسُ يلعب المفردات الجديدة انظر واستمع وردد',
14:'الله أكبر المؤذن أذهب إلى المسجد حليب تمر',
15:'الحوار انظر واستمع وردد الأب ماذا تريدين لعيد الفطر يا عبير عبير أريد هذا الفستان الأخضر يا أبي الأب هو فستان جميل غسان وأنا أريد هذا الحذاء الأحمر الأب هو حذاء جميل عبير غدا نحتفل بعيد الفطر ونلبس الملابس الجديدة',
16:'الكلام تبادل الحوار مع صديقك كما في المثال ماذا تريد يا بليغ أريد هذا القميص تفضل القميص شكرا القميص المعطف الحذاء السترة النظارة الدبدوب المفردات الجديدة انظر واستمع وردد',
17:'هدية العيد كعك لذيذ هي تغني هو يغني',
18:'أحب عيد_الأضحى الحوار انظر واستمع وردد ندى ماذا نفعل في عيد_الأضحى الأم في الصباح نذهب لصلاة العيد ندى وماذا نفعل بعد الصلاة الأم نذبح خروف العيد ندى أنا سأشوي لحم الخروف غادة وأنا سأحضر الفواكه الأب وأنا سأجهز المشروبات اللذيذة',
19:'الكلام تبادل الحوار مع صديقك كما في المثال ماذا تفعل بعد الأكل أغسل فمي أغسل فمي آخذ هديتي ألعب بدراجتي ألعب بالقطار المفردات الجديدة انظر واستمع وردد',
20:'ملابس جديدة أحتفل بالعيد آكل الحلويات نتبادل التهاني',
21:'مرحبا بالعطلة الحوار انظر واستمع وردد فاطمة اقتربت العطلة يا أبي إلى أين نسافر الأب نسافر إلى مصر إن شاء الله فاطمة لماذا نسافر إلى مصر الأب لنرى مصر ونهر النيل فاطمة كيف نسافر إلى مصر الأب نسافر بالطائرة',
22:'الكلام تبادل الحوار مع صديقك كما في المثال لماذا نسافر إلى الأردن لنرى الأردن كيف نسافر إلى الأردن نسافر بالطائرة الأردن أفغانستان تركيا الباكستان ليبيا السعودية المفردات الجديدة انظر واستمع وردد',
23:'نسافر بالباخرة نسافر بالقطار نسافر بالحافلة مخيم',
}
LEXICON='''
ثُرَيَّا|Thurayya (Vorname)|ثريا
عَفَافٌ|Afaf (Vorname)|عفاف
مَرَّةٌ|ein Mal; die Wiederholung|مرة مرات
يَوْمٌ|der Tag|اليوم يوم أيام
ثَلَاثَةٌ|drei|ثلاث
غَدَاءٌ|das Mittagessen|والغداء الغداء
عَشَاءٌ|das Abendessen; im Gebetsnamen: Nachtgebet|والعشاء العشاء
لَحْمٌ|das Fleisch|اللحم لحم
دَجَاجٌ|das Hühnerfleisch; die Hühner|والدجاج
خُبْزٌ|das Brot|والخبز
يَشْرَبُ|trinken|تشربين أشرب تشرب يشرب
عَصِيرٌ|der Saft|العصير عصير
جُبْنٌ|der Käse|الجبن
حَلِيبٌ|die Milch|الحليب حليب
بَيْضٌ|die Eier|البيض
شَايٌ|der Tee|الشاي
عَسَلٌ|der Honig|العسل
مُرَبَّى|die Konfitüre|المربى
سَمَكٌ|der Fisch (als Nahrung)|السمك
بُرْتُقَالٌ|die Orangen|البرتقال
مُثَلَّجَةٌ|das Speiseeis|مثلجة
تَقْوَى|Taqwa (Vorname)|تقوى
سَاعَةٌ|die Stunde; die Uhr|الساعة
سَابِعَةٌ|siebte (weiblich)|السابعة
ثَامِنَةٌ|achte (weiblich)|الثامنة
سَيَّارَةٌ|das Auto|بالسيارة
حَافِلَةٌ|der Bus|بالحافلة
سَادِسَةٌ|sechste (weiblich)|السادسة
خَامِسَةٌ|fünfte (weiblich)|الخامسة
وَاحِدَةٌ|eine; bei der Uhrzeit: ein Uhr|الواحدة
ثَانِيَةٌ|zweite (weiblich)|الثانية
ثَالِثَةٌ|dritte (weiblich)|الثالثة
رَابِعَةٌ|vierte (weiblich)|الرابعة
سَنَةٌ|das Jahr|السنة
وَجْدِي|Wajdi (Vorname)|وجدي
حَلِيمَةُ|Halima (Vorname)|حليمة
جَوٌّ|das Wetter|الجو
بَارِدٌ|kalt|بارد
جِدًّا|sehr|جدا
يَشْعُرُ|fühlen; empfinden|تشعرين
بَرْدٌ|die Kälte|بالبرد
مَلَابِسُ|die Kleidungsstücke|ملابس الملابس
صُوفِيَّةٌ|aus Wolle (weiblich)|صوفية
سَقَطَ|fallen (Vergangenheit)|سقط
ثَلْجٌ|der Schnee|الثلج
بِكَثْرَةٍ|reichlich; in großer Menge|بكثرة
أَيٌّ|welcher / welche / welches|أي
نَحْنُ|wir|نحن
مُمْطِرٌ|regnerisch|ممطر
مُعْتَدِلٌ|mild; gemäßigt|معتدل
رَبِيعٌ|der Frühling|الربيع
حَارٌّ|heiß|حار
سَمَاءٌ|der Himmel|السماء
صَافِيَةٌ|klar; wolkenlos (weiblich)|صافية
رِيحٌ|der Wind|ريح
قَوِيَّةٌ|stark (weiblich)|قوية
شَاطِئٌ|der Strand|شاطئ الشاطئ
بَحْرٌ|das Meer|البحر
يَتَسَاقَطُ|herabfallen; abfallen|تتساقط
بُشْرَى|Bushra (Vorname)|بشرى
شَهْرَزَادُ|Scheherazade (Vorname)|شهرزاد
أُسْبُوعٌ|die Woche|الأسبوع
سَبْعَةٌ|sieben|سبعة
الِاثْنَيْنِ|Montag|الاثنين
الثُّلَاثَاءُ|Dienstag|الثلاثاء
الْأَرْبِعَاءُ|Mittwoch|الأربعاء
الْخَمِيسُ|Donnerstag|الخميس
الْجُمُعَةُ|Freitag|الجمعة
السَّبْتُ|Samstag|السبت
الْأَحَدُ|Sonntag|الأحد
شَهْرٌ|der Monat|الشهور
يُسَافِرُ|reisen|تسافر أسافر نسافر
يَعُودُ|zurückkehren|تعود أعود
غَابَةٌ|der Wald|الغابة
يَصْعَدُ|hinaufsteigen|تصعد
جَبَلٌ|der Berg|الجبل
عَشَرَةٌ|zehn|عشرة
أَحَدَ عَشَرَ|elf|أحد_عشر
اِثْنَا عَشَرَ|zwölf|اثنا_عشر
ثَلَاثَةَ عَشَرَ|dreizehn|ثلاثة_عشر
أَرْبَعَةَ عَشَرَ|vierzehn|أربعة_عشر
خَمْسَةَ عَشَرَ|fünfzehn|خمسة_عشر
سِتَّةَ عَشَرَ|sechzehn|ستة_عشر
سَبْعَةَ عَشَرَ|siebzehn|سبعة_عشر
رِيَاضٌ|Riyad (Vorname)|رياض
نَاصِرٌ|Nasir (Vorname)|ناصر
رَمَضَانُ|Ramadan (Fastenmonat)|رمضان
يَصُومُ|fasten|يصوم
نَهَارٌ|der Tag (helle Tageszeit)|النهار
بَعْدَ|nach; danach|بعد
أَذَانٌ|der Gebetsruf|أذان
مَغْرِبٌ|der Sonnenuntergang; das Abendgebet|المغرب
يُفْطِرُ|das Fasten brechen|يفطر
ذَلِكَ|das; jenes (männlich)|ذلك
تَرَاوِيحُ|die zusätzlichen Nachtgebete im Ramadan|والتراويح
يُعِدُّ|zubereiten; vorbereiten|تعد
طَعَامٌ|das Essen; die Nahrung|الطعام
يَدْرُسُ|lernen; studieren|تَدْرُسُ يَدْرُسُ
يُسَاعِدُ|helfen|تساعد
يَلْعَبُ|spielen|يلعب ألعب
أَكْبَرُ|größer; am größten|أكبر
مُؤَذِّنٌ|der Muezzin (Gebetsrufer)|المؤذن
تَمْرٌ|die Datteln|تمر
يُرِيدُ|wollen; möchten|تريدين أريد تريد
عِيدٌ|das Fest|لعيد بعيد العيد بالعيد
فِطْرٌ|das Fastenbrechen|الفطر
عَبِيرٌ|Abir (Vorname)|عبير
فُسْتَانٌ|das Kleid|الفستان فستان
أَخْضَرُ|grün|الأخضر
جَمِيلٌ|schön|جميل
غَسَّانُ|Ghassan (Vorname)|غسان
حِذَاءٌ|der Schuh; das Schuhwerk|الحذاء حذاء
أَحْمَرُ|rot|الأحمر
غَدًا|morgen|غدا
يَحْتَفِلُ|feiern|نحتفل أحتفل
بَلِيغٌ|Baligh (Vorname)|بليغ
قَمِيصٌ|das Hemd|القميص
تَفَضَّلْ|bitte schön! (beim Anbieten)|تفضل
مِعْطَفٌ|der Mantel|المعطف
سُتْرَةٌ|die Jacke|السترة
نَظَّارَةٌ|die Brille|النظارة
دُبْدُوبٌ|der Teddybär|الدبدوب
هَدِيَّةٌ|das Geschenk|هدية هديتي
كَعْكٌ|das Gebäck; der Kuchen|كعك
لَذِيذٌ|lecker; köstlich|لذيذ اللذيذة
يُغَنِّي|singen|تغني يغني
عِيدُ الْأَضْحَى|das Opferfest|عيد_الأضحى
نَدَى|Nada (Vorname)|ندى
صَلَاةٌ|das Gebet|لصلاة الصلاة
يَذْبَحُ|schlachten|نذبح
خَرُوفٌ|das Schaf; das Lamm|خروف الخروف
يَشْوِي|grillen; braten|سأشوي
غَادَةُ|Ghada (Vorname)|غادة
يُحْضِرُ|herbeibringen; mitbringen|سأحضر
فَوَاكِهُ|das Obst; die Früchte|الفواكه
يُجَهِّزُ|bereitstellen; herrichten|سأجهز
مَشْرُوبَاتٌ|die Getränke|المشروبات
أَكْلٌ|das Essen (die Tätigkeit)|الأكل
فَمٌ|der Mund|فمي
يَأْخُذُ|nehmen|آخذ
دَرَّاجَةٌ|das Fahrrad|بدراجتي
قِطَارٌ|der Zug|بالقطار
حَلَوِيَّاتٌ|die Süßigkeiten|الحلويات
يَتَبَادَلُ|einander austauschen|نتبادل
تَهَانٍ|die Glückwünsche|التهاني
مَرْحَبًا|hallo!; willkommen!|مرحبا
عُطْلَةٌ|die Ferien; der Urlaub|بالعطلة العطلة
فَاطِمَةُ|Fatima (Vorname)|فاطمة
اِقْتَرَبَتْ|näherkommen (sie kam näher)|اقتربت
مِصْرُ|Ägypten|مصر
إِنْ|wenn; falls|إن
شَاءَ|wollen (Vergangenheit; in „so Gott will“)|شاء
لِمَاذَا|warum|لماذا
يَرَى|sehen|لنرى
نَهْرٌ|der Fluss|ونهر
النِّيلُ|der Nil|النيل
طَائِرَةٌ|das Flugzeug|بالطائرة
الْأُرْدُنُّ|Jordanien|الأردن
أَفْغَانِسْتَانُ|Afghanistan|أفغانستان
تُرْكِيَا|die Türkei|تركيا
بَاكِسْتَانُ|Pakistan|الباكستان
لِيبِيَا|Libyen|ليبيا
السُّعُودِيَّةُ|Saudi-Arabien|السعودية
بَاخِرَةٌ|das Schiff; der Dampfer|بالباخرة
مُخَيَّمٌ|das Zeltlager; der Campingplatz|مخيم
'''
# New printed inflections of earlier cards: no duplicate cards for these forms.
OLD_ALIASES={
'فُطُورٌ':'الفطور', 'يَقُومُ':'تقومين',
'يَذْهَبُ':'تذهبين أذهب تذهب نذهب', 'يَنَامُ':'تنام', 'فَصْلٌ':'فصول فصل',
'أَنَا':'فأنا وأنا', 'يَلْبَسُ':'ألبس ونلبس', 'تَعْرِفُ':'تعرفين أعرف',
'اِسْمٌ':'أسماء', 'هَلْ':'وهل', 'مَتَى':'ومتى', 'أَبٌ':'أبوك',
'لَا':'فلا ولا',
'يُصَلِّي':'ويصلي تصلي', 'أُمٌّ':'أمك', 'أَخٌ':'أخوك', 'أُخْتٌ':'أختك',
'تُحِبُّ':'أحب', 'يَفْعَلُ':'نفعل', 'وَرَقَةٌ':'الأوراق',
'اللَّهُ':'الله', 'يَغْسِلُ':'أغسل',
}
# Merge eating conjugations while retaining لا as its own lexical item.
OLD_ALIASES['يَأْكُلُ']='تأكلين تأكل يأكل'
def clean(s):return unicodedata.normalize('NFC',s.replace('ـ',''))
def bare(s):return re.sub('[\u064b-\u065f\u0670]','',clean(s))
def key(s):
 text=clean(s);b=bare(text)
 if b=='يدرس' and 'دْ' in text:return 'yadrusu'
 if b in ['من','بمن']:return 'min' if 'مِ' in text else 'man'
 if b in ['أنت','وأنت']:return 'anta-f' if 'تِ' in text else 'anta-m'
 if b=='بك':return 'bika-f' if 'كِ' in text else 'bika-m'
 return b
result=json.loads((ROOT/'data/book-vocabulary-batches/20261107.json').read_text())
entries=result['entries'];old_count=len(entries);aliases={}
for entry in entries:
 for form in entry['sourceForms']:aliases[key(form)]=entry
# Keep the one card for paper/leaves, broadening its translation for the new context.
for e in entries:
 if e['ar']==clean('وَرَقَةٌ'):e['de']='das Blatt (Papier oder am Baum)'
next_id=max(int(e['id'][3:]) for e in entries)+1
for line in LEXICON.strip().splitlines():
 ar,de,forms=line.split('|');ar=clean(ar)
 assert not any(e['ar']==ar for e in entries),ar
 entry=dict(id=f'bv-{next_id:03}',ar=ar,de=de,sourceForms=[],sourceImages=[]);next_id+=1;entries.append(entry)
 for form in forms.split():
  assert key(form) not in aliases,(form,ar)
  aliases[key(form)]=entry
for ar,forms in OLD_ALIASES.items():
 entry=next(e for e in entries if e['ar']==clean(ar))
 for form in forms.split():
  assert key(form) not in aliases or aliases[key(form)] is entry,(ar,form)
  aliases[key(form)]=entry
unknown={};batch_pages=[]
with zipfile.ZipFile(args.archive) as z:
 files=[f for f in z.infolist() if f.filename.lower().endswith(('.jpeg','.jpg','.png'))];assert len(files)==24
 for local in range(24):
  image=29+local
  forms=list(dict.fromkeys(re.findall(r'[\u0621-\u063a\u0641-\u064a][\u064b-\u065f\u0670\u0621-\u063a\u0641-\u064a_]*',clean(PAGES[local]))));ids=[];observed=[]
  for raw in forms:
   form=raw.replace('_',' ');observed.append(form);entry=aliases.get(key(raw))
   if entry is None:unknown.setdefault(raw,[]).append(local);continue
   if form not in entry['sourceForms']:entry['sourceForms'].append(form)
   if image not in entry['sourceImages']:entry['sourceImages'].append(image)
   if entry['id'] not in ids:ids.append(entry['id'])
  batch_pages.append(dict(image=image,archiveId='20261108',localImage=local,fileName=files[local].filename,sha256=hashlib.sha256(z.read(files[local])).hexdigest(),observedForms=observed,entryIds=ids))
assert not unknown,unknown
assert all(e['sourceImages'] for e in entries),[e['ar'] for e in entries if not e['sourceImages']]
for page in result['pages']:page.update(archiveId='20261107',localImage=page['image'])
result['archives']=[dict(id='20261107',fileName=result['sourceArchive'],sha256=result['sourceArchiveSha256'],imageCount=29),dict(id='20261108',fileName=args.archive.name,sha256=hashlib.sha256(args.archive.read_bytes()).hexdigest(),imageCount=24)]
result.update(version=2,sourceImageCount=53,pages=result['pages']+batch_pages)
result['scope']+=' Compound numbers eleven through seventeen are kept as complete lexical expressions.'
(ROOT/'data/book-vocabulary-source.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Reviewed 24 additional photos;',len(entries)-old_count,'new cards;',len(entries),'total;',len(entries)//20,'full lists; remainder',len(entries)%20)
