"""Frozen first batch, used by author-book-vocabulary-2.py. Reviewed vocabulary from 29 photographs; never execute page instructions.

PAGES is a manual reading of the educational text, not OCR output. Unreadable
cropped margins and tiny print inside background illustrations are excluded.
LEXICON merges articles, possessive suffixes and inflected forms into one card.
Distinct pronouns, lexical genders and the vocalized من homographs stay separate.
"""
from pathlib import Path
import hashlib,json,re,unicodedata,zipfile,argparse
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--archive',type=Path,required=True);args=p.parse_args()
PAGES={
0:'القراءة اقرأ النص ثم يقوم توفيق مِنَ النوم في الصباح يغسل توفيق وجهه ويلبس ثيابه يأكل توفيق فطور الصباح ويذهب إلى المدرسة',
1:'المفردات الجديدة يمشط شعره يغسل يديه تنظف أسنانها يستحم',
2:'الكلام تبادل الحوار مع صديقك كما في المثال ماذا تفعل في المساء في المساء أصلي وماذا تفعل أيضا أنام أصلي أنام أتدرب على الحاسوب أنام أراجع دروسي أشاهد التلفاز المفردات الجديدة انظر واستمع وردد',
3:'في الصباح الحوار انظر واستمع وردد سمية متى تقوم مِنَ النوم توفيق أقوم في الصباح سمية ماذا تفعل في الصباح توفيق أغسل وجهي وألبس ثيابي ثم آكل فطور الصباح وأذهب إلى المدرسة',
4:'شقة بيت تنظف ينظف الغرفة',
5:'أين سامي سامي في الغرفة ماذا يفعل هو يكتب سامي الغرفة يكتب مراد المسجد يصلي أنيس الغرفة يرتب الفراش المفردات الجديدة انظر واستمع وردد',
6:'حمام قصة غرفة فريدة الفراشة الوحيدة',
7:'الحوار انظر واستمع وردد الأب أين فدوى الأم فدوى في الغرفة تقرأ قصة الأب أين يوسف الأم يوسف في الحمام يغتسل',
8:'غسالة ثلاجة غرفة النوم طاولة',
9:'بيت أمين الحوار انظر واستمع وردد أيوب كم غرفة في بيتكم أمين في بيتنا أربع غرف أيوب ماذا في الغرف أمين في المطبخ فرن في الحمام مغطس في غرفة الجلوس أريكة',
10:'هذه أسرة زينب أخوها نزار تلميذ أختها سعيدة تلميذة زينب تحب أسرتها هذه أسرة مَنْ ما اسم الأخ ما اسم الأخت هل تحب زينب أسرتها',
11:'مَنْ هذا هذا أبي محمد ماذا يعمل هو طبيب أبي محمد طبيب أخي معز تلميذ أختي وفاء ممرضة المفردات الجديدة انظر واستمع وردد',
12:'جدة جد عمة عم',
13:'مفردات الحوار انظر واستمع وردد هذه أسرتي أبي سليم أمي عزيزة تلميذ تلميذة',
14:'أسرة زينب الحوار انظر واستمع وردد سامي مَنْ هذه زينب هذه أسرتي هذا أبي سليم هذه أمي عزيزة هذا أخي نزار هو تلميذ هذه أختي سعيدة هي تلميذة أنا أحب أسرتي',
15:'القراءة اقرأ النص ثم أجب عن الأسئلة قال كمال لرفيق ما هذه هذه حقيبة رفيق في حقيبته كراسة ومسطرة وممحاة ماذا قال كمال لرفيق هذه حقيبة مَنْ ماذا في حقيبة رفيق',
16:'الكلام تبادل الحوار مع صديقك كما في المثال هل هذا قلمك نعم هذا قلمي قلمك قلمي مقصك مقصي مبراتك مبراتي ورقتك ورقتي المفردات الجديدة انظر واستمع وردد',
17:'الأدوات المدرسية يذهب إلى المدرسة تقرأ يرتب',
18:'هذه حقيبة دفتر مسطرة ممحاة',
19:'ماذا في حقيبتك الحوار انظر واستمع وردد كمال ما هذه يا رفيق رفيق هذه حقيبة كمال هل هذه حقيبتك رفيق نعم هذه حقيبتي كمال وماذا في حقيبتك رفيق دفتر ومسطرة وممحاة كمال شكرا',
20:'طيب القراءة اقرأ النص ثم أجب عن الأسئلة قالت صالحة صباح الخير يا صباح صالحة لا تعرف خديجة خديجة تلميذة جديدة رحبت صالحة بخديجة ماذا قالت صالحة مَنْ هي خديجة هل تعرف صالحة خديجة بِمَنْ رحبت صالحة',
21:'الكلام تبادل الحوار مع صديقك مَنْ هذا هذا تلميذ مَنْ هذه هذه تلميذة',
22:'مدرسة التلاميذ في الصف المعلم يدرس يحمل الكتب',
23:'الحوار انظر واستمع وردد صالحة صباح الخير يا صباح صباح صباح الخير يا صالحة صالحة مَنْ هذه صباح هذه خديجة هي تلميذة جديدة صالحة أهلا بك يا خديجة خديجة أهلا بك يا صالحة',
24:'خريطة أمريكا خريطة الدول العربية خريطة أوروبا خريطة العالم',
25:'الحوار انظر واستمع وردد صالحة اسمي صالحة ما اسمك صباح اسمي صباح صالحة مِنْ أين أنت صباح أنا مِنْ فرنسا وأنت صالحة أنا مِنْ بلجيكا',
26:'القراءة اقرأ النص ثم أجب عن الأسئلة سلم طارق على فتحي فتحي بخير والحمد لله طارق بخير والحمد لله مَنْ سلم على فتحي هل فتحي بخير هل طارق بخير',
27:'أنت ولد أنت بنت أنت معلم أنت معلمة الفصول الأربعة الصيف الخريف الشتاء',
28:'الحوار انظر واستمع وردد طارق السلام عليكم فتحي وعليكم السلام طارق اسمي طارق ما اسمك فتحي اسمي فتحي طارق كيف حالك فتحي بخير والحمد لله',
}
# Arabic display | contextual German meaning | printed inflections/aliases, without articles being separate cards.
LEXICON=r'''
سَلَامٌ|der Frieden; Grußformel|السلام
عَلَى|auf / über|على عليكم وعليكم
اِسْمٌ|der Name|اسم اسمي اسمك
طَارِقٌ|Tariq (Vorname)|طارق
فَتْحِي|Fathi (Vorname)|فتحي
مَا|was|ما
كَيْفَ|wie|كيف
حَالٌ|der Zustand; das Befinden|حالك
خَيْرٌ|das Gute; gut (Befinden)|بخير الخير
حَمْدٌ|das Lob|والحمد
اللَّهُ|Gott|لله
حِوَارٌ|der Dialog|الحوار
اُنْظُرْ|schau hin!|انظر
اِسْتَمِعْ|höre zu!|واستمع
رَدِّدْ|sprich nach!|وردد
أَنْتَ|du (männlich)|أنتَ
أَنْتِ|du (weiblich)|أنتِ
وَلَدٌ|der Junge|ولد
بِنْتٌ|das Mädchen|بنت
مُعَلِّمٌ|der Lehrer|معلم المعلم
مُعَلِّمَةٌ|die Lehrerin|معلمة
فَصْلٌ|die Jahreszeit|الفصول
أَرْبَعَةٌ|vier|الأربعة أربع
صَيْفٌ|der Sommer|الصيف
خَرِيفٌ|der Herbst|الخريف
شِتَاءٌ|der Winter|الشتاء
قِرَاءَةٌ|das Lesen|القراءة
اِقْرَأْ|lies!|اقرأ
نَصٌّ|der Text|النص
ثُمَّ|dann / danach|ثم
أَجِبْ|antworte!|أجب
عَنْ|über / zu (einem Thema)|عن
سُؤَالٌ|die Frage|الأسئلة
سَلَّمَ|begrüßen (mit dem Friedensgruß)|سلم
مَنْ|wer|مَنْ بِمَنْ
هَلْ|Fragepartikel für Ja-Nein-Fragen|هل
صَالِحَةُ|Saliha (Vorname)|صالحة
صَبَاحٌ|der Morgen; Sabah (Vorname)|صباح الصباح
مِنْ|aus / von|مِنْ مِنَ
أَيْنَ|wo|أين
أَنَا|ich|أنا
فَرَنْسَا|Frankreich|فرنسا
بَلْجِيكَا|Belgien|بلجيكا
خَرِيطَةٌ|die Landkarte|خريطة
أَمْرِيكَا|Amerika|أمريكا
دَوْلَةٌ|der Staat|الدول
عَرَبِيَّةٌ|arabisch (weiblich)|العربية
أُورُوبَّا|Europa|أوروبا
عَالَمٌ|die Welt|العالم
هَذِهِ|diese / das (weiblich)|هذه
خَدِيجَةُ|Khadidscha (Vorname)|خديجة بخديجة
هِيَ|sie (Einzahl)|هي
تِلْمِيذَةٌ|die Schülerin|تلميذة
جَدِيدَةٌ|neu (weiblich)|جديدة الجديدة
أَهْلًا|willkommen!|أهلا
بِكَ|mit dir; bei „willkommen“: an dich (männlich)|بكَ
بِكِ|mit dir; bei „willkommen“: an dich (weiblich)|بكِ
مَدْرَسَةٌ|die Schule|مدرسة المدرسة
تِلْمِيذٌ|der Schüler|تلميذ التلاميذ
فِي|in|في
صَفٌّ|die Klasse|الصف
يُدَرِّسُ|unterrichten|يدرس
يَحْمِلُ|tragen|يحمل
كُتُبٌ|die Bücher|الكتب
طَيِّبٌ|gut / in Ordnung|طيب
قَالَ|sagen|قال قالت
لَا|nein / nicht|لا
تَعْرِفُ|kennen (sie kennt / du kennst)|تعرف
رَحَّبَتْ|begrüßen / willkommen heißen (sie begrüßte)|رحبت
تَبَادَلْ|tausche aus!|تبادل
مَعَ|mit|مع
صَدِيقٌ|der Freund|صديقك
هَذَا|dieser / das (männlich)|هذا
كَمَالٌ|Kamal (Vorname)|كمال
رَفِيقٌ|Rafiq (Vorname)|رفيق لرفيق
يَا|Anredepartikel (z. B. „Hallo, …“)|يا
حَقِيبَةٌ|die Tasche|حقيبة حقيبتك حقيبتي حقيبته
نَعَمْ|ja|نعم
دَفْتَرٌ|das Notizheft|دفتر
مِسْطَرَةٌ|das Lineal|ومسطرة مسطرة
مِمْحَاةٌ|der Radiergummi|وممحاة ممحاة
شُكْرًا|danke|شكرا
أَدَوَاتٌ|die Utensilien|الأدوات
مَدْرَسِيَّةٌ|schulisch (weiblich)|المدرسية
يَذْهَبُ|gehen|يذهب ويذهب وأذهب
إِلَى|zu / nach|إلى
تَقْرَأُ|lesen (sie liest)|تقرأ
يُرَتِّبُ|ordnen / aufräumen|يرتب
كَمَا|wie (im Vergleich)|كما
مِثَالٌ|das Beispiel|المثال
قَلَمٌ|der Stift|قلمك قلمي
مِقَصٌّ|die Schere|مقصك مقصي
مِبْرَاةٌ|der Anspitzer|مبراتك مبراتي
وَرَقَةٌ|das Blatt Papier|ورقتك ورقتي
مُفْرَدَاتٌ|die Vokabeln|المفردات مفردات
كَلَامٌ|das Sprechen|الكلام
كُرَّاسَةٌ|das Schulheft|كراسة
أُسْرَةٌ|die Familie|أسرة أسرتي أسرتها
زَيْنَبُ|Zainab (Vorname)|زينب
سَامِي|Sami (Vorname)|سامي
أَبٌ|der Vater|أبي الأب
سَلِيمٌ|Salim (Vorname)|سليم
أُمٌّ|die Mutter|أمي الأم
عَزِيزَةُ|Aziza (Vorname)|عزيزة
أَخٌ|der Bruder|أخي أخوها الأخ
نِزَارٌ|Nizar (Vorname)|نزار
هُوَ|er|هو
أُخْتٌ|die Schwester|أختي أختها الأخت
سَعِيدَةُ|Saida (Vorname)|سعيدة
تُحِبُّ|lieben / mögen (sie liebt)|تحب أحب
جَدٌّ|der Großvater|جد
جَدَّةٌ|die Großmutter|جدة
عَمٌّ|der Onkel väterlicherseits|عم
عَمَّةٌ|die Tante väterlicherseits|عمة
مُحَمَّدٌ|Muhammad (Vorname)|محمد
يَعْمَلُ|arbeiten|يعمل
طَبِيبٌ|der Arzt|طبيب
مُعِزٌّ|Muizz (Vorname)|معز
وَفَاءُ|Wafa (Vorname)|وفاء
مُمَرِّضَةٌ|die Krankenpflegerin|ممرضة
بَيْتٌ|das Haus|بيت بيتكم بيتنا
أَمِينٌ|Amin (Vorname)|أمين
أَيُّوبُ|Ayyub (Vorname)|أيوب
كَمْ|wie viele|كم
غُرْفَةٌ|das Zimmer|غرفة الغرفة غرف الغرف
مَاذَا|was (Frage nach Handlung/Inhalt)|ماذا وماذا
مَطْبَخٌ|die Küche|المطبخ
فُرْنٌ|der Backofen|فرن
حَمَّامٌ|das Badezimmer|حمام الحمام
مَغْطَسٌ|die Badewanne|مغطس
جُلُوسٌ|das Sitzen|الجلوس
أَرِيكَةٌ|das Sofa|أريكة
ثَلَّاجَةٌ|der Kühlschrank|ثلاجة
غَسَّالَةٌ|die Waschmaschine|غسالة
طَاوِلَةٌ|der Tisch|طاولة
نَوْمٌ|der Schlaf|النوم
فَدْوَى|Fadwa (Vorname)|فدوى
قِصَّةٌ|die Geschichte|قصة
يُوسُفُ|Yusuf (Vorname)|يوسف
يَغْتَسِلُ|sich waschen (den ganzen Körper)|يغتسل
فَرِيدَةُ|Farida (Name der Schmetterlingsfigur)|فريدة
فَرَاشَةٌ|der Schmetterling|الفراشة
وَحِيدَةٌ|allein / einsam (weiblich)|الوحيدة
يَفْعَلُ|tun / machen|يفعل تفعل
يَكْتُبُ|schreiben|يكتب
مُرَادٌ|Murad (Vorname)|مراد
مَسْجِدٌ|die Moschee|المسجد
يُصَلِّي|beten|يصلي أصلي
أَنِيسٌ|Anis (Vorname)|أنيس
فِرَاشٌ|das Bettzeug|الفراش
شَقَّةٌ|die Wohnung|شقة
يُنَظِّفُ|putzen / reinigen|ينظف تنظف
سُمَيَّةُ|Sumayya (Vorname)|سمية
مَتَى|wann|متى
يَقُومُ|aufstehen|يقوم تقوم أقوم
تَوْفِيقٌ|Taufiq (Vorname)|توفيق
يَغْسِلُ|waschen|يغسل أغسل
وَجْهٌ|das Gesicht|وجهه وجهي
يَلْبَسُ|anziehen / tragen (Kleidung)|ويلبس وألبس
ثِيَابٌ|die Kleidung|ثيابه ثيابي
يَأْكُلُ|essen|يأكل آكل
فُطُورٌ|das Frühstück|فطور
يُمَشِّطُ|kämmen|يمشط
شَعْرٌ|das Haar|شعره
يَدٌ|die Hand|يديه
أَسْنَانٌ|die Zähne|أسنانها
يَسْتَحِمُّ|baden / duschen|يستحم
مَسَاءٌ|der Abend|المساء
أَيْضًا|auch|أيضا
يَنَامُ|schlafen|أنام
يَتَدَرَّبُ|üben / trainieren|أتدرب
حَاسُوبٌ|der Computer|الحاسوب
يُرَاجِعُ|wiederholen (Lernstoff)|أراجع
دَرْسٌ|die Lektion|دروسي
يُشَاهِدُ|anschauen|أشاهد
تِلْفَازٌ|der Fernseher|التلفاز
'''
def clean(s):return unicodedata.normalize('NFC',s.replace('ـ',''))
def bare(s):return re.sub('[\u064b-\u065f\u0670]','',clean(s))
def lookup_key(form):
 text=clean(form);letters=bare(text)
 if letters in ['من','بمن']:return 'min' if 'مِ' in text else 'man'
 if letters in ['أنت','وأنت']:return 'anta-f' if 'تِ' in text else 'anta-m'
 if letters=='بك':return 'bika-f' if 'كِ' in text else 'bika-m'
 return letters
entries=[];aliases={}
for line in LEXICON.strip().splitlines():
 ar,de,forms=line.split('|');entry={'id':f'bv-{len(entries)+1:03}','ar':clean(ar),'de':de,'sourceForms':[],'sourceImages':[]}
 entries.append(entry)
 for form in forms.split():
  key=lookup_key(form)
  assert key not in aliases or aliases[key] is entry,(key,ar)
  aliases[key]=entry
# Explicitly preserve male/female pronouns when the unvocalized transcript is ambiguous.
PAGES[25]=PAGES[25].replace('أنت','أَنْتِ')
PAGES[27]=PAGES[27].replace('أنت ولد','أَنْتَ ولد').replace('أنت بنت','أَنْتِ بنت').replace('أنت معلم ','أَنْتَ معلم ').replace('أنت معلمة','أَنْتِ معلمة')
PAGES[23]=PAGES[23].replace('بك','بِكِ')
PAGES[20]=PAGES[20].replace('بِمَنْ','بِمَنْ')
pages=[];unknown={}
with zipfile.ZipFile(args.archive) as archive:
 files=archive.infolist();assert len(files)==29
 for image in reversed(range(29)):
  forms=re.findall(r'[\u0621-\u063a\u0641-\u064a][\u064b-\u065f\u0670\u0621-\u063a\u0641-\u064a]*',clean(PAGES[image]))
  unique=list(dict.fromkeys(forms));ids=[]
  for form in unique:
   key=lookup_key(form)
   entry=aliases.get(key)
   if entry is None:unknown.setdefault(form,[]).append(image);continue
   if form not in entry['sourceForms']:entry['sourceForms'].append(form)
   if image not in entry['sourceImages']:entry['sourceImages'].append(image)
   if entry['id'] not in ids:ids.append(entry['id'])
  pages.append({'image':image,'fileName':files[image].filename,'sha256':hashlib.sha256(archive.read(files[image])).hexdigest(),'observedForms':unique,'entryIds':ids})
assert not unknown,unknown
# Morphological normalization must not invent extra entries solely to fill a list.
entries=[e for e in entries if e['sourceImages']]
assert len({e['ar'] for e in entries})==len(entries)
result={'version':1,'title':'مفردات الكتب','titleDe':'Buchwortschatz','sourceArchive':args.archive.name,
 'sourceArchiveSha256':hashlib.sha256(args.archive.read_bytes()).hexdigest(),'sourceImageCount':29,
 'reviewMethod':'Manual image-by-image reading; automatic OCR is not the authority for vowel marks.',
 'deduplication':'One lexical card: merge case, articles, possessive suffixes and repeated conjugations; retain distinct pronouns, masculine/feminine lexical entries and مَنْ versus مِنْ.',
 'scope':'Readable educational text, headings, picture captions and exercise prompts. Incomplete margins and unreadable microprint inside illustrations are excluded.',
 'entries':entries,'pages':pages}
(ROOT/'data/book-vocabulary-batches/20261107.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Reviewed',len(pages),'images;',len(entries),'unique vocabulary cards;',len(entries)//20,'full lists; remainder',len(entries)%20)
