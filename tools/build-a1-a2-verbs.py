"""Build explicit paradigms from editorially specified stems, only for A1–A2."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PAST=['ْتُ','ْنَا','ْتَ','ْتِ','ْتُمَا','ْتُمَا','ْتُمْ','ْتُنَّ','َ','َتْ','َا','َتَا','ُوا','ْنَ']
PREFIX=['أ','ن','ت','ت','ت','ت','ت','ت','ي','ت','ي','ت','ي','ي']
ENDING=['ُ','ُ','ُ','ِينَ','َانِ','َانِ','ُونَ','ْنَ','ُ','ُ','َانِ','َانِ','ُونَ','ْنَ']
COMMAND=['ْ','ِي','َا','ُوا','ْنَ']
FIVE={3,4,5,6,10,11,12}
SINGULAR={0,1,2,8,9}
verbs=[]
def join(stem,ending):
 return stem[:-1]+stem[-1]+'ّ'+ending[2:] if ((stem.endswith('ن') and ending.startswith('ْن')) or (stem.endswith('ت') and ending.startswith('ْت'))) else stem+ending
def regular(past,present,command,de,root,kind='sound',family=None,length=3,pattern='فَعَلَ',vowel='َ'):
 forms={'past':[join(past,e) for e in PAST], 'present':[p+vowel+join(present,e) for p,e in zip(PREFIX,ENDING)],'imperative':[join(command,e) for e in COMMAND]}
 # Two hamzas coalesce with the first-person prefix; final hamza + dual alif gives madd.
 for tense in forms:
  forms[tense]=[s.replace('أَأْ','آ').replace('أَا','آ') for s in forms[tense]]
 moods={}
 for mood,last in [('jussive','ْ'),('subjunctive','َ')]:
  rows=[]
  for i,f in enumerate(forms['present']):
   if i in SINGULAR:f=f[:-1]+last
   elif i in FIVE:
    f=f.replace('ُونَ','ُوا').replace('ِينَ','ِي').replace('َانِ','َا').replace('آنِ','آ')
   rows.append(f)
  moods[mood]=rows
 entry={'id':f'added-{len(verbs)+1:03d}','kind':kind,'family':family or kind,'root':root,'formLength':length,'pattern':pattern,
  'structure':'ثلاثي مجرد' if length==3 else 'ثلاثي مزيد','meaning':{'ar':forms['past'][8],'de':de},'forms':forms,'moods':moods,
  'example':{k:[forms[k][0 if k=='imperative' else 8]+' مَعَ صَدِيقٍ.','Mit einem Freund: '+de+'.'] for k in ['past','present','imperative']}}
 # Neutral complete examples: do not impose an unsuitable object on an intransitive verb.
 entry['example']={k:[('هُوَ ' if k!='imperative' else '')+forms[k][0 if k=='imperative' else 8]+'.',{'past':'Perfekt, er: ','present':'Präsens, er: ','imperative':'Imperativ, du: '}[k]+de+'.'] for k in forms}
 verbs.append(entry);return entry

sound='''نَصَر|نْصُر|اُنْصُر|helfen / unterstützen|ن ص ر
ضَرَب|ضْرِب|اِضْرِب|schlagen|ض ر ب
حَضَر|حْضُر|اُحْضُر|anwesend sein|ح ض ر
خَلَق|خْلُق|اُخْلُق|erschaffen|خ ل ق
سَجَد|سْجُد|اُسْجُد|sich niederwerfen|س ج د
رَكَع|رْكَع|اِرْكَع|sich verbeugen|ر ك ع
صَبَر|صْبِر|اِصْبِر|geduldig sein|ص ب ر
شَكَر|شْكُر|اُشْكُر|danken|ش ك ر
سَبَح|سْبَح|اِسْبَح|schwimmen|س ب ح
قَفَز|قْفِز|اِقْفِز|springen|ق ف ز
نَظَر|نْظُر|اُنْظُر|schauen|ن ظ ر
بَحَث|بْحَث|اِبْحَث|suchen / forschen|ب ح ث
جَمَع|جْمَع|اِجْمَع|sammeln|ج م ع
زَرَع|زْرَع|اِزْرَع|pflanzen|ز ر ع
قَطَع|قْطَع|اِقْطَع|schneiden|ق ط ع
رَفَع|رْفَع|اِرْفَع|heben|ر ف ع
تَرَك|تْرُك|اُتْرُك|verlassen / zurücklassen|ت ر ك
سَحَب|سْحَب|اِسْحَب|ziehen|س ح ب
كَسَر|كْسِر|اِكْسِر|zerbrechen|ك س ر
رَبَط|رْبِط|اِرْبِط|verbinden / binden|ر ب ط
مَسَح|مْسَح|اِمْسَح|abwischen|م س ح
نَشَر|نْشُر|اُنْشُر|veröffentlichen|ن ش ر
بَلَغ|بْلُغ|اُبْلُغ|erreichen|ب ل غ
كَشَف|كْشِف|اِكْشِف|aufdecken|ك ش ف
نَجَح|نْجَح|اِنْجَح|Erfolg haben|ن ج ح
رَبِح|رْبَح|اِرْبَح|gewinnen|ر ب ح
خَسِر|خْسَر|اِخْسَر|verlieren|خ س ر
فَرِح|فْرَح|اِفْرَح|sich freuen|ف ر ح
مَرِض|مْرَض|اِمْرَض|krank werden|م ر ض
تَعِب|تْعَب|اِتْعَب|müde werden|ت ع ب'''
for line in sound.splitlines():
 p,s,c,de,r=line.split('|');regular(p,s,c,de,r,pattern='فَعِلَ' if 'ِ' in p else 'فَعَلَ')

for p,s,c,de,r in [
 ('أَمَر','أْمُر','مُر','befehlen','أ م ر'),('أَذِن','أْذَن','اِئْذَن','erlauben','أ ذ ن'),
 ('بَدَأ','بْدَأ','اِبْدَأ','beginnen','ب د أ'),('مَلَأ','مْلَأ','اِمْلَأ','füllen','م ل أ'),
 ('لَجَأ','لْجَأ','اِلْجَأ','Zuflucht suchen','ل ج أ'),('سَئِم','سْأَم','اِسْأَم','überdrüssig sein','س أ م')]:
 v=regular(p,s,c,de,r,kind='hamzated',pattern='فَعِلَ' if 'ِ' in p else 'فَعَلَ')
 if p.endswith('أ'):v['forms']['past'][12]=p[:-1]+'ؤُوا'

def doubled(a,b,vowel,de):
 p=a+'َ'+b+'ّ';long=a+'َ'+b+'َ'+b;pr=a+vowel+b+'ّ';short=a+'ْ'+b+vowel+b
 v=regular(p,pr,pr,de,f'{a} {b} {b}',kind='doubled')
 v['forms']['past']=[join(long if i in {0,1,2,3,4,5,6,7,13} else p,e) for i,e in enumerate(PAST)]
 for i in [7,13]:v['forms']['present'][i]=PREFIX[i]+'َ'+join(short,'ْنَ')
 v['forms']['imperative']=[pr+'َ',pr+'ِي',pr+'َا',pr+'ُوا',('اُ' if vowel=='ُ' else 'اِ')+join(short,'ْنَ')]
 for mood in v['moods']:
  for i in SINGULAR:v['moods'][mood][i]=PREFIX[i]+'َ'+pr+'َ'
  for i in [7,13]:v['moods'][mood][i]=v['forms']['present'][i]

for a,b,vowel,de in [('ر','د','ُ','zurückgeben / antworten'),('ش','د','ُ','festziehen'),('ع','د','ُ','zählen'),('ظ','ن','ُ','vermuten'),('ف','ر','ِ','fliehen'),('م','ر','ُ','vorbeigehen')]:
 doubled(a,b,vowel,de)

for p,s,c,de,r in [
 ('وَصَل','صِل','صِل','ankommen','و ص ل'),('وَجَد','جِد','جِد','finden','و ج د'),
 ('وَعَد','عِد','عِد','versprechen','و ع د'),('وَزَن','زِن','زِن','wiegen','و ز ن'),
 ('وَصَف','صِف','صِف','beschreiben','و ص ف'),('وَثِق','ثِق','ثِق','vertrauen','و ث ق'),
 ('وَهَب','هَب','هَب','schenken','و ه ب'),('وَضَع','ضَع','ضَع','legen','و ض ع')]:
 regular(p,s,c,de,r,kind='weak',family='example',pattern='فَعِلَ' if 'ِ' in p else 'فَعَلَ')

def hollow(past,short,pr,juss,cmd,de,root):
 v=regular(past,pr,cmd,de,root,kind='weak',family='hollow')
 v['forms']['past']=[join(short if i in {0,1,2,3,4,5,6,7,13} else past,e) for i,e in enumerate(PAST)]
 for i in [7,13]:v['forms']['present'][i]=PREFIX[i]+'َ'+join(juss,'ْنَ')
 v['forms']['imperative']=[cmd+'ْ',pr+'ِي',pr+'َا',pr+'ُوا',juss+'ْنَ']
 for mood in v['moods']:
  for i in [7,13]:v['moods'][mood][i]=v['forms']['present'][i]
  if mood=='jussive':
   for i in SINGULAR:v['moods'][mood][i]=PREFIX[i]+'َ'+juss+'ْ'

for past,short,pr,juss,cmd,de,root in [
 ('بَاع','بِع','بِيع','بِع','بِع','verkaufen','ب ي ع'),('زَار','زُر','زُور','زُر','زُر','besuchen','ز و ر'),
 ('عَاد','عُد','عُود','عُد','عُد','zurückkehren','ع و د'),('صَام','صُم','صُوم','صُم','صُم','fasten','ص و م'),
 ('خَاف','خِف','خَاف','خَف','خَف','Angst haben','خ و ف'),('طَار','طِر','طِير','طِر','طِر','fliegen','ط ي ر')]:
 hollow(past,short,pr,juss,cmd,de,root)

def defective(past,connected,pr,cmd,last,de,root,past_ya=False):
 v=regular(past,pr,cmd,de,root,kind='weak',family='defective')
 base=past[:-1];connecting=connected[:-1] # remove final sukun before adding a suffix
 v['forms']['past']=[connecting+e for e in PAST]
 v['forms']['past'][8]=past
 v['forms']['past'][9]=base+'تْ';v['forms']['past'][10]=connecting+'َا';v['forms']['past'][11]=base+'تَا';v['forms']['past'][12]=base+'وْا'
 if past_ya:
  v['pattern']='فَعِلَ'
  v['forms']['past']=[past+e.removeprefix('ْ') for e in PAST]
  v['forms']['past'][12]=past[:-2]+'ُوا'
 sing={'i':'ِي','u':'ُو','a':'َى'}[last];fem={'i':'ِينَ','u':'ِينَ','a':'َيْنَ'}[last]
 dual={'i':'ِيَانِ','u':'ُوَانِ','a':'َيَانِ'}[last];plural={'i':'ُونَ','u':'ُونَ','a':'َوْنَ'}[last]
 women={'i':'ِينَ','u':'ُونَ','a':'َيْنَ'}[last]
 endings=[sing,sing,sing,fem,dual,dual,plural,women,sing,sing,dual,dual,plural,women]
 v['forms']['present']=[p+'َ'+pr+e for p,e in zip(PREFIX,endings)]
 v['forms']['imperative']=[cmd+{'i':'ِ','u':'ُ','a':'َ'}[last],cmd+fem[:-2],cmd+dual[:-2],cmd+({'a':'َوْا'}.get(last,'ُوا')),cmd+women]
 for mood in ['jussive','subjunctive']:
  rows=[]
  for i,f in enumerate(v['forms']['present']):
   if i in SINGULAR:
    if mood=='jussive':f=f[:-1]
    elif last!='a':f+='َ'
   elif i in FIVE:f=f[:-2]+('ا' if i in {6,12} else '') if last=='a' else f.replace('ُونَ','ُوا').replace('ِينَ','ِي').replace('َانِ','َا')
   rows.append(f)
  v['moods'][mood]=rows

for past,connected,pr,cmd,last,de,root in [
 ('رَمَى','رَمَيْ','رْم','اِرْم','i','werfen','ر م ي'),('بَنَى','بَنَيْ','بْن','اِبْن','i','bauen','ب ن ي'),
 ('جَرَى','جَرَيْ','جْر','اِجْر','i','laufen','ج ر ي'),('بَكَى','بَكَيْ','بْك','اِبْك','i','weinen','ب ك ي'),
 ('رَجَا','رَجَوْ','رْج','اُرْج','u','hoffen','ر ج و'),('سَعَى','سَعَيْ','سْع','اِسْع','a','sich bemühen','س ع ي')]:
 defective(past,connected,pr,cmd,last,de,root)


derived=[
 ('II','د ر ب','trainieren'),('II','ر ت ب','ordnen'),('II','ن ظ ف','reinigen'),('II','ج ه ز','vorbereiten'),('II','ف س ر','erklären'),('II','س ج ل','registrieren / aufnehmen'),('II','ق س م','aufteilen'),('II','ك ر ر','wiederholen'),('II','ح ض ر','vorbereiten'),('II','ب د ل','austauschen'),
 ('III','ش ر ك','teilnehmen'),('III','ن ق ش','besprechen'),('III','ق ب ل','treffen'),('III','ج ل س','Gesellschaft leisten'),('III','ر س ل','korrespondieren'),('III','ط ل ب','fordern'),
 ('IV','خ ر ج','hinausbringen'),('IV','د خ ل','hineinbringen'),('IV','س ل م','sich ergeben / den Islam annehmen'),('IV','ن ج ز','erledigen'),('IV','ع ل ن','bekanntgeben'),('IV','ح ض ر','herbeibringen'),('IV','ك م ل','vervollständigen'),('IV','ق ب ل','herankommen'),
 ('V','د ر ب','sich trainieren'),('V','ح د ث','sprechen'),('V','ق د م','voranschreiten'),('V','ذ ك ر','sich erinnern'),('V','ف ك ر','nachdenken'),
 ('VI','ن ق ش','miteinander diskutieren'),('VI','ق ب ل','einander treffen'),('VI','ب د ل','austauschen'),
 ('VII','ك س ر','zerbrechen (intransitiv)'),('VII','ف ت ح','sich öffnen'),
 ('VIII','ح ر م','respektieren'),('VIII','ش ر ك','teilnehmen / abonnieren'),
 ('X','ف س ر','nachfragen'),('X','ك ش ف','erkunden')]
def derived_verb(form,root,de):
 a,b,c=root.split()
 templates={
 'II':(a+'َ'+b+'َّ'+c,a+'َ'+b+'ِّ'+c,a+'َ'+b+'ِّ'+c,'ُ',4,'فَعَّلَ'),
 'III':(a+'َا'+b+'َ'+c,a+'َا'+b+'ِ'+c,a+'َا'+b+'ِ'+c,'ُ',4,'فَاعَلَ'),
 'IV':('أَ'+a+'ْ'+b+'َ'+c,a+'ْ'+b+'ِ'+c,'أَ'+a+'ْ'+b+'ِ'+c,'ُ',4,'أَفْعَلَ'),
 'V':('تَ'+a+'َ'+b+'َّ'+c,'تَ'+a+'َ'+b+'َّ'+c,'تَ'+a+'َ'+b+'َّ'+c,'َ',5,'تَفَعَّلَ'),
 'VI':('تَ'+a+'َا'+b+'َ'+c,'تَ'+a+'َا'+b+'َ'+c,'تَ'+a+'َا'+b+'َ'+c,'َ',5,'تَفَاعَلَ'),
 'VII':('اِنْ'+a+'َ'+b+'َ'+c,'نْ'+a+'َ'+b+'ِ'+c,'اِنْ'+a+'َ'+b+'ِ'+c,'َ',5,'اِنْفَعَلَ'),
 'VIII':('اِ'+a+'ْتَ'+b+'َ'+c,a+'ْتَ'+b+'ِ'+c,'اِ'+a+'ْتَ'+b+'ِ'+c,'َ',5,'اِفْتَعَلَ'),
 'X':('اِسْتَ'+a+'ْ'+b+'َ'+c,'سْتَ'+a+'ْ'+b+'ِ'+c,'اِسْتَ'+a+'ْ'+b+'ِ'+c,'َ',6,'اِسْتَفْعَلَ')}
 p,s,c,vowel,length,pattern=templates[form];regular(p,s,c,de,root,length=length,pattern=pattern,vowel=vowel)

 return verbs[-1]

for form,root,de in derived:derived_verb(form,root,de)

meanings='''النُّصْرَةُ|الضَّرْبُ|الْحُضُورُ|الْخَلْقُ|السُّجُودُ|الرُّكُوعُ|الصَّبْرُ|الشُّكْرُ|السِّبَاحَةُ|الْقَفْزُ|النَّظَرُ|الْبَحْثُ|الْجَمْعُ|الزِّرَاعَةُ|الْقَطْعُ|الرَّفْعُ|التَّرْكُ|السَّحْبُ|الْكَسْرُ|الرَّبْطُ|الْمَسْحُ|النَّشْرُ|الْبُلُوغُ|الْكَشْفُ|النَّجَاحُ|الرِّبْحُ|الْخَسَارَةُ|الْفَرَحُ|الْمَرَضُ|التَّعَبُ|الْأَمْرُ|الْإِذْنُ|الْبَدْءُ|الْمَلْءُ|اللُّجُوءُ|السَّأَمُ|الرَّدُّ|الشَّدُّ|الْعَدُّ|الظَّنُّ|الْفِرَارُ|الْمُرُورُ|الْوُصُولُ|الْعُثُورُ|الْوَعْدُ|الْوَزْنُ|الْوَصْفُ|الثِّقَةُ|الْهِبَةُ|الْوَضْعُ|الْبَيْعُ|الزِّيَارَةُ|الْعَوْدَةُ|الصَّوْمُ|الْخَوْفُ|الطَّيَرَانُ|الرَّمْيُ|الْبِنَاءُ|الْجَرْيُ|الْبُكَاءُ|الرَّجَاءُ|السَّعْيُ|التَّدْرِيبُ|التَّرْتِيبُ|التَّنْظِيفُ|التَّجْهِيزُ|التَّفْسِيرُ|التَّسْجِيلُ|التَّقْسِيمُ|التَّكْرَارُ|التَّحْضِيرُ|التَّبْدِيلُ|الْمُشَارَكَةُ|الْمُنَاقَشَةُ|الْمُقَابَلَةُ|الْمُجَالَسَةُ|الْمُرَاسَلَةُ|الْمُطَالَبَةُ|الْإِخْرَاجُ|الْإِدْخَالُ|الْإِسْلَامُ|الْإِنْجَازُ|الْإِعْلَانُ|الْإِحْضَارُ|الْإِكْمَالُ|الْإِقْبَالُ|التَّدَرُّبُ|التَّحَدُّثُ|التَّقَدُّمُ|التَّذَكُّرُ|التَّفَكُّرُ|التَّنَاقُشُ|التَّقَابُلُ|التَّبَادُلُ|الِانْكِسَارُ|الِانْفِتَاحُ|الِاحْتِرَامُ|الِاشْتِرَاكُ|الِاسْتِفْسَارُ|الِاسْتِكْشَافُ'''.split('|')
assert len(meanings)==len(verbs)
# Keep examples aligned with overridden irregular paradigms.
for v,meaning in zip(verbs,meanings):
 v['meaning']['ar']=meaning
 for tense in v['forms']:
  f=v['forms'][tense][0 if tense=='imperative' else 8]
  v['example'][tense][0]=('هُوَ ' if tense!='imperative' else '')+f+'.'
second_sound='''نَزَل|نْزِل|اِنْزِل|hinuntergehen|ن ز ل|النُّزُولُ
رَقَص|رْقُص|اُرْقُص|tanzen|ر ق ص|الرَّقْصُ
ضَحِك|ضْحَك|اِضْحَك|lachen|ض ح ك|الضَّحْكُ
سَكَت|سْكُت|اُسْكُت|schweigen|س ك ت|السُّكُوتُ
سَجَن|سْجُن|اُسْجُن|inhaftieren|س ج ن|السَّجْنُ
نَقَل|نْقُل|اُنْقُل|transportieren|ن ق ل|النَّقْلُ
نَقَص|نْقُص|اُنْقُص|verringern / abnehmen|ن ق ص|النَّقْصُ
حَكَم|حْكُم|اُحْكُم|urteilen|ح ك م|الْحُكْمُ
حَلَم|حْلُم|اُحْلُم|träumen|ح ل م|الْحُلْمُ
حَسَب|حْسُب|اُحْسُب|rechnen / zählen|ح س ب|الْحِسَابُ
قَسَم|قْسِم|اِقْسِم|teilen|ق س م|الْقَسْمُ
رَحَل|رْحَل|اِرْحَل|aufbrechen|ر ح ل|الرَّحِيلُ
سَبَق|سْبِق|اِسْبِق|vorausgehen|س ب ق|السَّبْقُ
هَرَب|هْرُب|اُهْرُب|fliehen|ه ر ب|الْهَرَبُ
بَرَد|بْرُد|اُبْرُد|kalt werden|ب ر د|الْبُرُودَةُ
سَخُن|سْخُن|اُسْخُن|heiß werden|س خ ن|السُّخُونَةُ
حَزِن|حْزَن|اِحْزَن|traurig sein|ح ز ن|الْحُزْنُ
حَسُن|حْسُن|اُحْسُن|schön / gut sein|ح س ن|الْحُسْنُ
كَبُر|كْبُر|اُكْبُر|größer werden|ك ب ر|الْكِبَرُ
صَغُر|صْغُر|اُصْغُر|kleiner werden|ص غ ر|الصِّغَرُ
قَرُب|قْرُب|اُقْرُب|nahe sein|ق ر ب|الْقُرْبُ
بَعُد|بْعُد|اُبْعُد|fern sein|ب ع د|الْبُعْدُ
ثَقُل|ثْقُل|اُثْقُل|schwer sein|ث ق ل|الثِّقَلُ
سَهُل|سْهُل|اُسْهُل|leicht / einfach sein|س ه ل|السُّهُولَةُ
سَلِم|سْلَم|اِسْلَم|unversehrt bleiben|س ل م|السَّلَامَةُ
مَنَع|مْنَع|اِمْنَع|verhindern|م ن ع|الْمَنْعُ
حَمَد|حْمَد|اِحْمَد|loben|ح م د|الْحَمْدُ
مَلَك|مْلِك|اِمْلِك|besitzen|م ل ك|الْمِلْكُ
نَدِم|نْدَم|اِنْدَم|bereuen|ن د م|النَّدَمُ
رَغِب|رْغَب|اِرْغَب|wünschen / begehren|ر غ ب|الرَّغْبَةُ'''
for line in second_sound.splitlines():
 p,s,c,de,r,meaning=line.split('|')
 regular(p,s,c,de,r,pattern={'ِ':'فَعِلَ','ُ':'فَعُلَ'}.get(p[3],'فَعَلَ'))['meaning']['ar']=meaning
for p,s,c,de,r,meaning in [
 ('أَمِن','أْمَن','اِئْمَن','sicher sein','أ م ن','الْأَمَانُ'),('أَمِل','أْمَل','اِئْمَل','hoffen','أ م ل','الْأَمَلُ'),
 ('أَسَر','أْسِر','اِئْسِر','gefangen nehmen','أ س ر','الْأَسْرُ'),('رَأَف','رْأَف','اِرْأَف','erbarmen','ر أ ف','الرَّأْفَةُ'),
 ('دَأَب','دْأَب','اِدْأَب','beharrlich arbeiten','د أ ب','الدَّأْبُ'),('بَرِئ','بْرَأ','اِبْرَأ','genesen / frei sein','ب ر أ','الْبَرَاءَةُ')]:
 regular(p,s,c,de,r,kind='hamzated',pattern={'ِ':'فَعِلَ'}.get(p[3],'فَعَلَ'))['meaning']['ar']=meaning
for a,b,vowel,de,meaning in [
 ('د','ل','ُ','hinweisen','الدَّلَالَةُ'),('ع','ض','َ','beißen','الْعَضُّ'),('ش','م','ُ','riechen','الشَّمُّ'),
 ('ع','م','ُ','umfassen / sich verbreiten','الْعُمُومُ'),('ض','م','ُ','zusammenfügen / umarmen','الضَّمُّ'),('ح','ل','ُ','lösen','الْحَلُّ')]:
 doubled(a,b,vowel,de);verbs[-1]['meaning']['ar']=meaning
for p,s,c,de,r,meaning in [
 ('وَلَد','لِد','لِد','gebären','و ل د','الْوِلَادَةُ'),('وَرَد','رِد','رِد','eintreffen / vorkommen','و ر د','الْوُرُودُ'),
 ('وَرِث','رِث','رِث','erben','و ر ث','الْوِرَاثَةُ'),('وَسِع','سَع','سَع','Platz bieten / umfassen','و س ع','السَّعَةُ'),
 ('وَقَع','قَع','قَع','fallen / geschehen','و ق ع','الْوُقُوعُ'),('وَثَب','ثِب','ثِب','springen','و ث ب','الْوُثُوبُ')]:
 regular(p,s,c,de,r,kind='weak',family='example',pattern='فَعِلَ' if 'ِ' in p else 'فَعَلَ')['meaning']['ar']=meaning
for p,short,pr,juss,cmd,de,r,meaning in [
 ('سَار','سِر','سِير','سِر','سِر','gehen / fahren','س ي ر','السَّيْرُ'),('عَاش','عِش','عِيش','عِش','عِش','leben','ع ي ش','الْعَيْشُ'),
 ('حَاز','حُز','حُوز','حُز','حُز','erlangen','ح و ز','الْحِيَازَةُ'),('فَاز','فُز','فُوز','فُز','فُز','gewinnen / siegen','ف و ز','الْفَوْزُ'),
 ('مَات','مُت','مُوت','مُت','مُت','sterben','م و ت','الْمَوْتُ'),('طَال','طُل','طُول','طُل','طُل','lang werden','ط و ل','الطُّولُ')]:
 hollow(p,short,pr,juss,cmd,de,r);verbs[-1]['meaning']['ar']=meaning
for p,connected,pr,cmd,last,de,r,meaning,ya in [
 ('نَسِي','نَسِيْ','نْس','اِنْس','a','vergessen','ن س ي','النِّسْيَانُ',True),('بَقِي','بَقِيْ','بْق','اِبْق','a','bleiben','ب ق ي','الْبَقَاءُ',True),
 ('رَضِي','رَضِيْ','رْض','اِرْض','a','zufrieden sein','ر ض ي','الرِّضَا',True),('لَقِي','لَقِيْ','لْق','اِلْق','a','begegnen','ل ق ي','اللِّقَاءُ',True),
 ('هَدَى','هَدَيْ','هْد','اِهْد','i','leiten / führen','ه د ي','الْهِدَايَةُ',False),('قَضَى','قَضَيْ','قْض','اِقْض','i','entscheiden / erledigen','ق ض ي','الْقَضَاءُ',False)]:
 defective(p,connected,pr,cmd,last,de,r,past_ya=ya);verbs[-1]['meaning']['ar']=meaning
for form,r,de,meaning in [
 ('II','ف ك ر','nachdenken','التَّفْكِيرُ'),('II','ص د ق','glauben / bestätigen','التَّصْدِيقُ'),('II','ك ذ ب','für falsch erklären','التَّكْذِيبُ'),('II','س ل م','übergeben / grüßen','التَّسْلِيمُ'),
 ('II','ق د م','präsentieren / anbieten','التَّقْدِيمُ'),('II','س ه ل','erleichtern','التَّسْهِيلُ'),('II','ص ع ب','erschweren','التَّصْعِيبُ'),('II','ج م ع','zusammentragen','التَّجْمِيعُ'),
 ('II','ح س ن','verbessern','التَّحْسِينُ'),('II','ج م ل','verschönern','التَّجْمِيلُ'),('II','ك ب ر','vergrößern','التَّكْبِيرُ'),('II','ص غ ر','verkleinern','التَّصْغِيرُ'),
 ('III','ع م ل','behandeln / umgehen mit','الْمُعَامَلَةُ'),('III','ر ق ب','beobachten','الْمُرَاقَبَةُ'),('III','ح ف ظ','bewahren','الْمُحَافَظَةُ'),('III','س ب ق','um die Wette laufen','الْمُسَابَقَةُ'),('III','ش ه د','anschauen','الْمُشَاهَدَةُ'),('III','ص د ق','Freundschaft schließen','الْمُصَادَقَةُ'),
 ('IV','س ر ع','sich beeilen','الْإِسْرَاعُ'),('IV','ص ب ح','werden / am Morgen sein','الْإِصْبَاحُ'),('IV','ظ ه ر','zeigen','الْإِظْهَارُ'),('IV','خ ب ر','mitteilen','الْإِخْبَارُ'),('IV','ف ه م','verständlich machen','الْإِفْهَامُ'),('IV','ن ق ذ','retten','الْإِنْقَاذُ'),
 ('V','ج م ع','sich versammeln','التَّجَمُّعُ'),('V','ح س ن','sich verbessern','التَّحَسُّنُ'),('V','ع د ل','angepasst werden','التَّعَدُّلُ'),('V','ق ر ب','sich nähern','التَّقَرُّبُ'),('V','س ل م','entgegennehmen','التَّسَلُّمُ'),('V','خ ل ص','loswerden / sich befreien','التَّخَلُّصُ'),
 ('VI','س ع د','einander helfen','التَّسَاعُدُ'),('VI','ف ه م','sich verständigen','التَّفَاهُمُ'),('VI','س ب ق','um die Wette laufen','التَّسَابُقُ'),('VI','ص ف ح','einander die Hand geben','التَّصَافُحُ'),
 ('VII','ق ط ع','abbrechen / unterbrochen werden','الِانْقِطَاعُ'),('VII','ق ل ب','sich umdrehen / umkippen','الِانْقِلَابُ'),
 ('VIII','ن ظ ر','warten','الِانْتِظَارُ'),('VIII','ف ق د','vermissen','الِافْتِقَادُ'),
 ('X','ح س ن','gutheißen','الِاسْتِحْسَانُ'),('X','س ل م','sich ergeben','الِاسْتِسْلَامُ')]:
 derived_verb(form,r,de)['meaning']['ar']=meaning
# Refresh irregular examples after their explicit paradigms have been assigned.
for v in verbs[100:]:
 for tense in v['forms']:
  v['example'][tense][0]=('هُوَ ' if tense!='imperative' else '')+v['forms'][tense][0 if tense=='imperative' else 8]+'.'
assert len(verbs)==200,len(verbs)
assert len({v['forms']['past'][8] for v in verbs})==200
(ROOT/'data/a1-a2-extra-verbs.json').write_text(json.dumps(verbs,ensure_ascii=False,indent=2)+'\n')
print('Built 200 additional verbs with complete paradigms and moods.')
