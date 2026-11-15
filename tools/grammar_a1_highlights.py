"""Precise A1/A2 annotations and examples, applied to the edition bank only."""
import re

def bi(ar,de):return {'ar':ar,'de':de}

def marked(source):
    text='';ranges=[];cursor=0
    for match in re.finditer(r'\[([a-z-]+):([^\]]+)\]',source):
        text+=source[cursor:match.start()];start=len(text);text+=match[2]
        ranges.append({'start':start,'end':len(text),'role':match[1]});cursor=match.end()
    return text+source[cursor:],ranges

def E(source,de,note=None):
    ar,ranges=marked(source);e={'ar':ar,'de':de,'annotations':ranges}
    if note:e['note']=bi(*note)
    return e

def body(section,source):
    section['body']['ar'],ranges=marked(source);section['bodyAnnotations']={'ar':ranges}

def letters(example,pattern,role):
    example['annotations']=[{'start':m.start(),'end':m.end(),'role':role} for m in re.finditer(pattern,example['ar'])]

def apply_a1_highlights(bank):
    sections=bank['word-classes']['sections']
    sections[0]['examples']=[E('[noun:كِتَابٌ] · [noun:أَنَا] · [noun:هَذَا]','Buch · ich · dies')]
    sections[1]['examples']=[E('[verb:كَتَبْتُ] · [particle:لَمْ] [verb:يَكْتُبْ] · [verb:اُكْتُبِي]','Ich schrieb · er schrieb nicht · schreibe! (weiblich)')]
    sections[2]['examples']=[E('[particle:فِي] · [particle:لَمْ] · [particle:هَلْ]','in · nicht (mit Jussiv) · Fragepartikel')]
    bank['word-classes']['intro']['ar']+=' الزيتي للأسماء، والبني للأفعال، والذهبي للحروف.'
    bank['word-classes']['intro']['de']+=' Oliv markiert Nomen und Pronomen, Braun Verben und Gold Partikeln.'
    bank['gender']['sections'][1]['examples']=[
        E('[masculine:هَذَا] كِتَابٌ [masculine:جَدِيدٌ].','Das ist ein neues Buch.'),
        E('[feminine:هَذِهِ] سَيَّارَةٌ [feminine:جَدِيدَةٌ].','Das ist ein neues Auto.'),
        E('[masculine:هَذَا] طَالِبٌ [masculine:مُجْتَهِدٌ].','Das ist ein fleißiger Schüler.'),
        E('[feminine:هَذِهِ] طَالِبَةٌ [feminine:مُجْتَهِدَةٌ].','Das ist eine fleißige Schülerin.')]
    for e in bank['definiteness']['sections'][1]['examples']:
        # Keep the article's moon Lām and identify the following moon letter separately.
        e['annotations']=[{'start':1,'end':3,'role':'particle'},{'start':3,'end':4,'role':'moon-letter'}]
    pronouns=bank['pronouns']
    groups=[('ضمائر المتكلم','Sprecherpronomen','أنا للمتكلم المفرد مذكرًا أو مؤنثًا، ونحن للمتكلمين.','Anā bezeichnet eine sprechende Person beider Geschlechter; naḥnu mehrere.',[
        ('أَنَا','طَالِبٌ','Ich bin Schüler.','للمتكلم المفرد','Eine sprechende Person'),('نَحْنُ','طُلَّابٌ','Wir sind Schüler.','للمتكلمين','Mehrere Sprecher')]),
        ('ضمائر المخاطب','Pronomen der angesprochenen Personen','أنتَ للمفرد المذكر، وأنتِ للمفرد المؤنث. أنتما للمثنى المذكر وللمثنى المؤنث بالصورة نفسها. أنتم للجمع المذكر، وأنتن للجمع المؤنث.','Anta/anti stehen für eine männliche/weibliche Person. Antumā gilt für beide Geschlechter im Dual, antum/antunna für den maskulinen/femininen Plural.',[
        ('أَنْتَ','طَالِبٌ','Du bist Schüler.','للمفرد المذكر','Eine männliche Person'),('أَنْتِ','طَالِبَةٌ','Du bist Schülerin.','للمفرد المؤنث','Eine weibliche Person'),('أَنْتُمَا','طَالِبَانِ','Ihr beide seid Schüler.','للمثنى المذكر','Zwei männliche Personen'),('أَنْتُمَا','طَالِبَتَانِ','Ihr beide seid Schülerinnen.','للمثنى المؤنث','Zwei weibliche Personen'),('أَنْتُمْ','طُلَّابٌ','Ihr seid Schüler.','للجمع المذكر','Maskuliner Plural'),('أَنْتُنَّ','طَالِبَاتٌ','Ihr seid Schülerinnen.','للجمع المؤنث','Femininer Plural')]),
        ('ضمائر الغائب','Pronomen der dritten Person','هو للمفرد المذكر، وهي للمفرد المؤنث. هما للمثنى المذكر وللمثنى المؤنث بالصورة نفسها. هم للجمع المذكر، وهن للجمع المؤنث.','Huwa/hiya stehen für er/sie. Humā gilt für beide Geschlechter im Dual, hum/hunna für den maskulinen/femininen Plural.',[
        ('هُوَ','طَالِبٌ','Er ist Schüler.','للمفرد المذكر','Eine männliche Person'),('هِيَ','طَالِبَةٌ','Sie ist Schülerin.','للمفرد المؤنث','Eine weibliche Person'),('هُمَا','طَالِبَانِ','Die beiden sind Schüler.','للمثنى المذكر','Zwei männliche Personen'),('هُمَا','طَالِبَتَانِ','Die beiden sind Schülerinnen.','للمثنى المؤنث','Zwei weibliche Personen'),('هُمْ','طُلَّابٌ','Sie sind Schüler.','للجمع المذكر','Maskuliner Plural'),('هُنَّ','طَالِبَاتٌ','Sie sind Schülerinnen.','للجمع المؤنث','Femininer Plural')])]
    pronouns['sections']=[{'title':bi(ar,de),'body':bi(b,g),'examples':[E(f'[noun:{p}] {rest}.',tr,(note,gnote)) for p,rest,tr,note,gnote in items]} for ar,de,b,g,items in groups]
    pronouns['intro']=bi('الضمير المنفصل كلمة مستقلة. نرتب الضمائر إلى متكلم ومخاطب وغائب، ونميز المفرد والمثنى والجمع والمذكر والمؤنث.','Selbständige Pronomen werden nach Sprecher, angesprochener und dritter Person sowie Zahl und Genus geordnet.')
    demos=bank['demonstratives']['sections']
    demos[0]['examples']=[E('[sign:هَذَا] طَالِبٌ.','Das ist ein Schüler.'),E('[sign:هَذِهِ] طَالِبَةٌ.','Das ist eine Schülerin.'),E('[sign:هَؤُلَاءِ] طُلَّابٌ.','Das sind Schüler.'),E('[sign:ذَلِكَ] طَالِبٌ.','Jener ist ein Schüler.'),E('[sign:تِلْكَ] طَالِبَةٌ.','Jene ist eine Schülerin.'),E('[sign:أُولَئِكَ] طُلَّابٌ.','Jene sind Schüler.'),E('[sign:هَذِهِ] كُتُبٌ.','Das sind Bücher.'),E('[sign:تِلْكَ] أَشْجَارٌ عَالِيَةٌ.','Jene Bäume sind hoch.')]
    demos[1]['examples']=[E('[sign:هَذَانِ] طَالِبَانِ.','Das sind zwei Schüler.'),E('رَأَيْتُ [sign:هَذَيْنِ] الطَّالِبَيْنِ.','Ich sah diese beiden Schüler.'),E('[sign:هَاتَانِ] طَالِبَتَانِ.','Das sind zwei Schülerinnen.'),E('رَأَيْتُ [sign:هَاتَيْنِ] الطَّالِبَتَيْنِ.','Ich sah diese beiden Schülerinnen.')]
    demos[2]['examples']=[E('[sign:هَذَا] كِتَابٌ.','Das ist ein Buch.'),E('[sign:هَذَا] الطَّالِبُ مُجْتَهِدٌ.','Dieser Schüler ist fleißig.'),E('جَلَسْتُ [sign:هُنَا].','Ich saß hier.'),E('جَلَسْتُ [sign:هُنَاكَ].','Ich saß dort.'),E('جَلَسْتُ [sign:هُنَالِكَ].','Ich saß dort in der Ferne.')]
    pre=bank['prepositions']['sections']
    pre[0]['examples']=[E('خَرَجْتُ [particle:مِنَ] الْبَيْتِ [particle:إِلَى] الْمَدْرَسَةِ.','Ich ging vom Haus zur Schule.'),E('الْكِتَابُ [particle:عَلَى] الطَّاوِلَةِ.','Das Buch liegt auf dem Tisch.')]
    pre[1]['body']=bi('الباء للاستعانة في كتبت بالقلم، والكاف للتشبيه في كالقمر، واللام للملكية أو الاختصاص في الكتاب للطالب. تتصل هذه الحروف كتابة بالاسم، ويكون الاسم بعدها مجرورًا. في للطالب اللام الأولى حرف الجر، والثانية من أل التعريف.','Bi- bezeichnet hier das Mittel, ka- einen Vergleich und li- Besitz oder Zuordnung. Sie werden an das folgende Nomen angehängt, das im Genitiv steht. In li-ṭ-ṭālibi ist das erste Lām die Präposition, das zweite gehört zum Artikel.')
    pre[1]['examples']=[E('كَتَبْتُ [particle:بِ]الْقَلَمِ.','Ich schrieb mit dem Stift.'),E('هَذَا الْكِتَابُ [particle:لِ]لطَّالِبِ.','Dieses Buch gehört dem Schüler.'),E('الْوَجْهُ [particle:كَ]الْقَمَرِ.','Das Gesicht ist wie der Mond.')]
    bank['possession-basics']['sections'][0]['examples']=[E('كِتَابِ[suffix:ي] · كِتَابُ[suffix:كَ] · كِتَابُ[suffix:هُ]','Mein Buch · dein Buch · sein Buch')]
    own=bank['possession-basics']['sections'][1]
    own['examples']=[E('مَدْرَسَ[ta:ةٌ] ← مَدْرَسَ[ta:تِ][suffix:ي]','Eine Schule → meine Schule')]
    own['body']['de']='Vor dem Possessivsuffix wird ة zu ت: madrasa → madrasatī. Beide Tā-Formen tragen dieselbe Farbe, das Sprecher-Yā eine andere. Huwa steht selbständig; -hu in kitābuhu ist angehängt.'
    body(own,'تتحول التاء المربوطة إلى تاء مبسوطة قبل الضمير: مدرس[ta:ة] ← مدرس[ta:ت][suffix:ي]. لون التاء واحد في الصورتين، ولون ياء المتكلم مختلف. نميز بين هو وكتابه: الأول ضمير مستقل، والثاني ضمير ملكية متصل.')
    conjunctions=bank['sequence-conjunctions']['sections']
    conjunctions[0]['examples']=[E('اشْتَرَيْتُ خُبْزًا [particle:وَ]جُبْنًا.','Ich kaufte Brot und Käse.')]
    conjunctions[1]['examples']=[E('فَتَحْتُ الْبَابَ [particle:فَ]دَخَلْتُ.','Ich öffnete die Tür und ging sogleich hinein.'),E('تَنَاوَلْتُ الْفُطُورَ، [particle:ثُمَّ] ذَهَبْتُ إِلَى الْعَمَلِ.','Ich frühstückte und ging später zur Arbeit.')]
    num=bank['number']['sections']
    body(num[1],'نضيف «انِ» في الرفع و«يْنِ» في النصب والجر. تتحول التاء المربوطة إلى تاء عند التثنية: مدرس[ta:ة] ← مدرس[ta:ت]ان في الرفع، ومدرس[ta:ت]ين في النصب والجر.')
    num[1]['body']['de']='Der Dual hat -āni im Nominativ und -aini im Akkusativ/Genitiv. Tā marbūṭa wird zu Tā: madrasa → madrasatān bzw. madrasatain. Beide Tā-Schreibungen sind gleichfarbig markiert.'
    num[1]['examples']=[E('هَذَانِ كِتَابَ[sign:انِ].','Das sind zwei Bücher.'),E('قَرَأْتُ كِتَابَ[sign:يْنِ].','Ich las zwei Bücher.'),E('فِي الْحَيِّ مَدْرَسَ[ta:تَ][sign:انِ].','Im Viertel gibt es zwei Schulen.')]
    num[2]['examples'][0]=E('مُعَلِّمُ[sign:ونَ] / مُعَلِّمِ[sign:ينَ]','Lehrer · regelmäßiger maskuliner Plural')
    bank['idafa']['sections'][1]['examples']=[E('[sign:كِتَابَا] الطَّالِبِ · [sign:مُعَلِّمُو] الْمَدْرَسَةِ','Die beiden Bücher des Schülers · die Lehrer der Schule (ohne Nūn)')]
    for sec in bank['comparison-basic']['sections']:
        for e in sec.get('examples',[]):
            e['annotations']=[{'start':m.start(),'end':m.end(),'role':'sign'} for m in re.finditer(r'أَكْبَرُ|أَقْرَبُ|أَسْهَلُ',e['ar'])]
    case=bank['case-basics']['sections']
    case[0]['examples']=[E('[nominative:الطَّالِبُ] [nominative:نَشِيطٌ]. رَأَيْتُ [accusative:الطَّالِبَ]. سَلَّمْتُ عَلَى [genitive:الطَّالِبِ].','Der Schüler ist aktiv. Ich sah den Schüler. Ich grüßte den Schüler.')]
    case[1]['examples']=[E('جَاءَ الطَّالِبَ[nominative:ا]نِ.','Die beiden Schüler kamen.'),E('رَأَيْتُ الطَّالِبَ[accusative:يْ]نِ.','Ich sah die beiden Schüler.')]
    ta=bank['ta-endings']['sections']
    for e in ta[0]['examples']:letters(e,'ت','ta')
    for e in ta[1]['examples']:letters(e,'ة','ta')
    ta[2]['examples']=[E('وَجْ[sign:هٌ] · مَدْرَسَ[ta:تِ][suffix:ي]','Gesicht · meine Schule')]
    body(ta[2],'الهاء ه / ـه لا نقطتين عليها وتبقى هاء في الوصل والوقف: وجه. عند إضافة ضمير إلى اسم ينتهي بتاء مربوطة تظهر التاء المبسوطة: مدرس[ta:ة] ← مدرس[ta:ت][suffix:ي].')
    for sec in bank['alif-endings']['sections']:
        for e in sec.get('examples',[]):
            e['annotations']=[]
            for m in re.finditer(r'[اى](?=[\u064b-\u065f]*(?:\s|[.،/·←]|$))',e['ar']):e['annotations'].append({'start':m.start(),'end':m.end(),'role':'straight-alif' if m[0]=='ا' else 'maqsurah'})
    for sec in bank['hamza-initial']['sections']:
        for e in sec.get('examples',[]):
            e['annotations']=[]
            for m in re.finditer(r'(?<![\u0621-\u064a\u064b-\u065f])(?:[وف][\u064b-\u065f]*)?([أإآا])',e['ar']):e['annotations'].append({'start':m.start(1),'end':m.end(1),'role':'sign'})
