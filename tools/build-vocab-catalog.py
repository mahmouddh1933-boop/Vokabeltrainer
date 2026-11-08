"""Compile the reviewed CEFR sources for both HTTP and extracted offline use."""
from pathlib import Path
import json
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
LEVELS = [
    ('A1', 'المبتدئ', 'Einstieg',
     'كلمات وتعبيرات للحاجات المباشرة والتعارف والبيت والصف والتنقل البسيط.',
     'Wörter und Wendungen für unmittelbare Bedürfnisse, Kennenlernen, Zuhause, Unterricht und einfache Wege.'),
    ('A2', 'المبتدئ المتقدم', 'Grundlegende Kenntnisse',
     'مفردات للتعامل مع المواعيد والسكن والسفر والعمل والصحة ووصف تجارب قصيرة.',
     'Wortschatz für Termine, Wohnen, Reisen, Arbeit, Gesundheit und kurze Berichte über Erlebnisse.'),
    ('B1', 'المتوسط', 'Selbstständige Sprachverwendung',
     'مفردات لشرح التجارب والمشكلات والخطط وتبرير الرأي في موضوعات مألوفة.',
     'Wortschatz zum Erklären von Erfahrungen, Problemen und Plänen sowie zum Begründen von Meinungen zu vertrauten Themen.'),
    ('B2', 'المتوسط المتقدم', 'Fortgeschrittene Sprachverwendung',
     'مفردات وتراكيب دقيقة لتحليل الأفكار ومناقشة القضايا وتقييم الأدلة وعرض المواقف.',
     'Präziser Wortschatz und Wendungen zum Analysieren von Ideen, Erörtern von Themen, Bewerten von Belegen und differenzierten Argumentieren.'),
]

catalog = dict(version=15, sourceLanguage='ar', translationLanguage='de',
               maxWordsPerBuiltInList=25, excelUploadWordLimit=None,
               wordsPerList=20, levels=[], lists=[], cefrLevels=[l[0] for l in LEVELS])
labels = {}
for level, subtitle, subtitle_de, description, description_de in LEVELS:
    title = 'المستوى '+level
    labels[title] = 'Niveau '+level
    labels[subtitle] = subtitle_de
    labels[description] = description_de
    labels[title+' · '+subtitle] = 'Niveau '+level+' · '+subtitle_de
    ids = []
    source = ROOT/'data/cefr'/f'{level}.txt'
    for order, section in enumerate(source.read_text().split('@')[1:], 1):
        lines = section.strip().splitlines()
        ar_title, de_title, goal = lines[0].split('|')
        words = []
        for line in lines[1:]:
            ar, de = line.split('|')
            ar = unicodedata.normalize('NFC', ar.strip())
            de = de.strip()
            assert ar and de and re.search(r'[\u064b-\u0652]', ar), (source.name, order, ar)
            assert not re.search(r'[A-Za-z]', ar), ar
            words.append(dict(ar=ar, de=de))
        assert len(words) == 20, (level, order, len(words))
        assert len({w['ar'] for w in words}) == 20, (level, order, 'Arabic duplicates')
        assert len({w['de'] for w in words}) == 20, (level, order, 'German duplicates')
        list_id = f'{level.lower()}_{order:02}'
        ids.append(list_id)
        labels[ar_title] = de_title
        catalog['lists'].append(dict(id=list_id, title=ar_title, titleDe=de_title,
                                     goal=goal, count=20, words=words, level=level,
                                     levelOrder=order))
    assert len(ids) == 30, (level, len(ids))
    catalog['levels'].append(dict(id=level, cefr=level, title=title, subtitle=subtitle,
                                  description=description, recommended=level=='A1',
                                  listIds=ids))
assert len(catalog['lists']) == 120
# Keep book vocabulary outside CEFR so the existing level IDs and mastery stay stable.
book_source=json.loads((ROOT/'data/book-vocabulary-source.json').read_text())
book_entries=book_source['entries']
assert len({w['id'] for w in book_entries})==len(book_entries)
assert len({w['ar'] for w in book_entries})==len(book_entries)
ordinals=['الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة','السابعة','الثامنة','التاسعة','العاشرة',
          'الحادية عشرة','الثانية عشرة','الثالثة عشرة','الرابعة عشرة','الخامسة عشرة',
          'السادسة عشرة','السابعة عشرة','الثامنة عشرة','التاسعة عشرة','العشرون',
          'الحادية والعشرون','الثانية والعشرون','الثالثة والعشرون','الرابعة والعشرون','الخامسة والعشرون',
          'السادسة والعشرون','السابعة والعشرون','الثامنة والعشرون','التاسعة والعشرون','الثلاثون',
          'الحادية والثلاثون','الثانية والثلاثون','الثالثة والثلاثون','الرابعة والثلاثون','الخامسة والثلاثون']
book_lists=[]
for offset in range(0,len(book_entries),20):
    order=offset//20+1
    title='القائمة '+ordinals[order-1] if order<=len(ordinals) else 'القائمة '+str(order)
    title_de='Liste '+str(order)
    labels[title]=title_de
    words=[dict(ar=w['ar'],de=w['de'],entryId=w['id']) for w in book_entries[offset:offset+20]]
    assert 1<=len(words)<=20
    assert len({w['de'] for w in words})==len(words),'Ambiguous German choices in '+title
    # The previously partial ninth list has new words and needs a fresh mastery record.
    list_id=f'books_20261107_{order:02}'+('_v2' if order==9 and len(words)>15 else '')
    book_lists.append(dict(id=list_id,title=title,titleDe=title_de,
        count=len(words),words=words,collection='book-vocabulary',order=order))
catalog['bookVocabulary']=dict(version=2,id='book-vocabulary',title='مفردات الكتاب 1',titleDe='Buchwortschatz 1',
    sourceImageCount=book_source['sourceImageCount'],count=len(book_entries),wordsPerList=20,lists=book_lists)
labels['مفردات الكتاب 1']='Buchwortschatz 1'
labels['مفردات الكتب']='Buchwortschatz 1' # previously saved source labels
book2_source=json.loads((ROOT/'data/book-vocabulary-2-source.json').read_text())
book2_entries=book2_source['entries'];book2_lists=[]
for offset in range(0,len(book2_entries),20):
    order=offset//20+1
    title='القائمة '+ordinals[order-1] if order<=len(ordinals) else 'القائمة '+str(order)
    title_de='Liste '+str(order);labels[title]=title_de
    words=[dict(ar=w['ar'],de=w['de'],entryId=w['id']) for w in book2_entries[offset:offset+20]]
    assert len({w['ar'] for w in words})==len(words)
    assert len({w['de'] for w in words})==len(words),'Ambiguous German choices in Book 2 '+title
    book2_lists.append(dict(id=f'book2_20261108_{order:02}',title=title,titleDe=title_de,
        count=len(words),words=words,collection='book-vocabulary',order=order,bookId='book-vocabulary-2'))
catalog['bookVocabulary2']=dict(version=1,id='book-vocabulary-2',title='مفردات الكتاب 2',titleDe='Buchwortschatz 2',
    sourceImageCount=book2_source['sourceImageCount'],count=len(book2_entries),wordsPerList=20,lists=book2_lists)
labels['مفردات الكتاب 2']='Buchwortschatz 2'
payload = json.dumps(catalog, ensure_ascii=False, indent=2)+'\n'
(ROOT/'data/vocab_catalog.json').write_text(payload)
(ROOT/'data/vocab_catalog_fallback.js').write_text(
    '// Generated by tools/build-vocab-catalog.py; required for offline use.\n'
    'window.VOCAB_CATALOG_FALLBACK = '+json.dumps(catalog, ensure_ascii=False, separators=(',', ':'))+';\n')
(ROOT/'data/vocab_catalog_labels.js').write_text(
    '// Generated by tools/build-vocab-catalog.py; display labels only.\n'
    'window.VOCAB_CATALOG_LABELS = '+json.dumps(labels, ensure_ascii=False, indent=2)+';\n'
    'window.VOCAB_CATALOG_META = {lists:120, words:2400, levels:4};\n')
print('Built CEFR catalog: A1/A2/B1/B2, 30 lists and 600 entries per level; 120 lists / 2400 vocalized entries.')
print(f'Book vocabulary: {len(book_entries)} entries from {book_source["sourceImageCount"]} photographs; {len(book_lists)} lists.')
archives=book_source.get('archives',[dict(fileName=book_source['sourceArchive'],imageCount=book_source['sourceImageCount'])])
book_doc=['# مفردات الكتاب 1 · مراجعة الصور والكلمات','',
    'المصادر: '+'؛ '.join(a['fileName']+' ('+str(a['imageCount'])+' صورة)' for a in archives)+'. تمت قراءة الصور واحدة واحدة ومراجعة الكلمات وترجماتها، ولا يُعتمد على OCR في ضبط الحركات.','',
    f"{len(book_entries)} مدخلًا دون تكرار داخل المجموعة، موزعة على {len(book_lists)} قائمة، بحد أقصى ٢٠ كلمة للقائمة. لا تُضاف حشوات من خارج الصور لإكمال القائمة الأخيرة. تبقى قوائم A1–B2 الـ١٢٠ مستقلة وبمعرفاتها ومحتوياتها السابقة.",'',
    'تُدمج أداة التعريف وصيغ الإعراب والملكية وتكرار تصريف الفعل في بطاقة واحدة. مثل: الغرفة/غرف، حقيبتي/حقيبتك/حقيبته. يُحفظ المدخل بتشكيل واضح، مع فصل أَنْتَ عن أَنْتِ، ومَنْ عن مِنْ، والمذكر المعجمي عن مؤنثه مثل تلميذ/تلميذة. تبقى معاني الكلمات في سياق الصور؛ صَبَاح يجمع معنى الصباح واسم الشخصية في بطاقة واحدة.','',
    'تُستخرج الكلمات المقروءة من النصوص والحوارات والعناوين والتعليقات والأسئلة. لا تُخمّن الكلمات المبتورة في حواف الصور ولا الكتابة الدقيقة غير المقروءة داخل الرسومات. تُحفظ بصمات الصور وألفاظها المرجعية وربطها بالبطاقات في `data/book-vocabulary-source.json`. أرقام الصور أدناه تبدأ من ١: الصور ١–٢٩ من الملف الأول، و٣٠–٥٣ من الملف الثاني، حسب ترتيب كل ZIP.','',
    'تحديث الملف الثاني: دُمجت لَذِيذ/اللذيذة في بطاقة واحدة للصفة؛ يُدَرِّسُ (يعلّم) مستقل عن يَدْرُسُ (يتعلّم). الأعداد ١١–١٧ عبارات كاملة، وعِيدُ الْأَضْحَى تركيب كامل. معنى وَرَقَة توسّع ليشمل ورق الشجر. تحتفظ القوائم الثماني الأولى بمعرفاتها؛ التاسعة أصبحت ٢٠ كلمة بدل ١٥، ولها سجل إتقان جديد كي لا تُعد الكلمات المضافة مُتقنة مسبقًا.','',
    'التشغيل: المفردات ← مفردات الكتاب 1، أعلى مستويات CEFR. تستخدم القوائم البطاقات والاختبارات الستة والمراجعة والإتقان نفسها؛ مصدرها مجموعة مستقلة دون نسبتها إلى مستوى CEFR. ملف JSON ونسخة JavaScript المحلية متكافئان. النطق ملفات محلية مصنّعة بخدمة Google العربية، وتُعاد الاستفادة من التسجيل السابق عند تطابق الكلمة وتشكيلها تمامًا.','',
    '| القائمة | عدد الكلمات |','| --- | --- |']
for item in book_lists:book_doc.append(f'| {item["title"]} | {item["count"]} |')
book_doc+=['','| الكلمة | المعنى بالألمانية | الصور |','| --- | --- | --- |']
for entry in book_entries:book_doc.append('| '+entry['ar']+' | '+entry['de'].replace('|','/')+' | '+', '.join(str(n+1) for n in sorted(entry['sourceImages']))+' |')
(ROOT/'docs/BOOK-VOCABULARY.md').write_text('\n'.join(book_doc)+'\n')
book2_doc=['# مفردات الكتاب 2 · مراجعة الصور والكلمات','',
    f"{len(book2_entries)} بطاقة من {book2_source['sourceImageCount']} صورة، موزعة على {len(book2_lists)} قائمة؛ ٢٠ كلمة للقائمة، والأخيرة للكلمات المتبقية.",'',
    'المصادر: '+'؛ '.join(a['fileName']+' ('+str(a['imageCount'])+' صورة)' for a in book2_source['archives']), '',
    'تمت قراءة الصور الـ٤٦ يدويًا: ٢٤ من الملف الأول و٢٢ من الثاني. ترقيم الصور أدناه متصل من ١ إلى ٤٦. تتضمن المراجعة العناوين والحوارات والمفردات والقصص وأسئلة الفهم، وتستبعد الحواف المبتورة والطباعة الدقيقة غير المقروءة داخل الرسومات.','',
    'تُدمج صيغ الإعراب والملكية وتصريفات الفعل المتكرر في بطاقة واحدة. تُراعى الفروق ذات المعنى: مَنْ/مِنْ، جَدّ/جِدّ، رَجُل/رِجْل، مَالِي/مَالِيّ. الأعداد المركبة من ٢١ إلى ٢٥ بطاقات كاملة. تترجم سَلِيم في سياق صحة القلب، وسَلَّمَ بمعنيي التحية والتسليم بحسب النص.','',
    'لكل كتاب قوائمه ومصدره وسجل إتقانه المستقل. يجوز تكرار الكلمة المشتركة في كتابين؛ لا تتكرر داخل الكتاب نفسه. تبقى بطاقات الكتاب الأول الـ٣٤٠ ومعرفاتها وترتيبها محفوظة. تُستخدم ملفات صوتية محلية مصنّعة، ويعاد استخدام التسجيل المطابق تمامًا عندما تكون الكلمة مشتركة.','',
    'المراجعة اليدوية: `data/book-vocabulary-2-review.json`. البناء القابل للتكرار: `python tools/build-book-vocabulary-2.py` ثم `python tools/build-vocab-catalog.py`. مرجع الصور والبطاقات: `data/book-vocabulary-2-source.json`.','',
    '| القائمة | عدد الكلمات |','| --- | --- |']
for item in book2_lists:book2_doc.append(f"| {item['title']} | {item['count']} |")
book2_doc+=['','| الكلمة | المعنى بالألمانية | الصور |','| --- | --- | --- |']
for entry in book2_entries:book2_doc.append('| '+entry['ar']+' | '+entry['de'].replace('|','/')+' | '+', '.join(str(n+1) for n in sorted(entry['sourceImages']))+' |')
(ROOT/'docs/BOOK-VOCABULARY-2.md').write_text('\n'.join(book2_doc)+'\n')
print(f'Book 2: {len(book2_entries)} entries; {len(book2_lists)} lists.')


# Keep the editorial rationale and every topic's learning goal reviewable.
lines = [
    '# مفردات A1–B2 · دليل المراجعة والتدرج', '',
    '١٢٠ قائمة، ٢٠ مدخلًا مشكلًا لكل قائمة، ٦٠٠ مدخل لكل مستوى، ٢٤٠٠ مدخل إجمالًا.', '',
    'هذه مواءمة تعليمية تحريرية مع وظائف التواصل في CEFR، وليست قائمة مفردات عربية رسمية معتمدة. التصنيف يراعي شيوع المفردة والموقف والوظيفة التواصلية؛ وقد يختلف مستوى المفردة بحسب معناها وسياقها.', '',
    '## ما تغير في القوائم السابقة', '',
    '- نُقلت الأفعال اليومية والصفات الأساسية وأجزاء الجسم وأدوات الصف والطعام الشائع إلى A1 بدل إبقائها في A2.',
    '- فُصلت موضوعات البيت عن الأثاث، والطعام عن الفواكه والخضروات، والحركة عن الروتين والتواصل، لمنع ازدحام القائمة بموضوعات مختلفة.',
    '- أضيفت شهور السنة الاثنا عشر وأيام الأسبوع السبعة والفصول الأربعة في قوائمها المناسبة.',
    '- خُصص A2 للمعاملات اليومية الموسعة، وB1 للشرح والرأي والتجربة، وB2 للتحليل والمقارنة والتفاوض واللغة الدقيقة.',
    '- روجع التشكيل والإعراب في المداخل والتراكيب، مع الحفاظ على طريقة التطبيق في عرض تنوين الفتح على الألف المكتوبة.',
    '- روجعت الترجمات الألمانية، وأضيفت أدوات التعريف للأسماء حيث تناسب المدخل، وقُيدت المعاني المتعددة بالسياق.',
    '- القوائم الجديدة لها معرفات مستقلة؛ تبقى النتائج القديمة محفوظة، ولا تُنسب درجات إتقان المحتوى القديم إلى القوائم المعاد تأليفها.', '',
    '## التكرار المقصود', '',
    'لا يوجد مدخل عربي مطابق مكرر داخل القائمة نفسها. وتُحفظ الفروق الضرورية مثل أَنْتَ/أَنْتِ، ظُهْرٌ/ظَهْرٌ، دُوَارٌ/دَوَّارٌ. هناك ثلاث صيغ متطابقة بين مستويات مختلفة ذات معان سياقية مختلفة: خَطٌّ (شكل/خط مواصلات)، خِيَارٌ (خضار/اختيار)، ويُسَدِّدُ (في الرياضة/سداد المال). هذه فروق معجمية مقصودة وليست تكرار قوائم لزيادة العدد.', '',
]
for level in catalog['levels']:
    lines += ['## '+level['id']+' · '+level['subtitle'], '', level['description'], '',
              '| القائمة | الموضوع | العنوان بالألمانية | الهدف التعليمي |',
              '| --- | --- | --- | --- |']
    for item in catalog['lists']:
        if item['level'] == level['id']:
            lines.append(f"| {item['levelOrder']} | {item['title']} | {item['titleDe']} | {item['goal']} |")
    lines += ['']
lines += ['## التحقق', '',
          '`python tools/build-vocab-catalog.py` يعيد توليد الكتالوج ونسخته المحلية وعناوين العرض وهذا الدليل من الملفات الأربعة في `data/cefr/`.', '',
          '`node --test tests/vocab-catalog.test.js` يتحقق من توزيع القوائم والأعداد والتشكيل وتكافؤ JSON ونسخة التشغيل المحلي والفروق المعجمية والأشهر والفصول.', '',
          '`python tests/vocab-catalog-smoke.py` يراجع القوائم الـ١٢٠ في الواجهتين، ويفتح قوائم من بداية كل مستوى ونهايته، ويختبر البطاقات ونتائج الاختبارات. يقبل `--portable` لاختبار النسخة المستخرجة من ZIP مع حظر بيانات JSON وملفات JavaScript وCSS المنفصلة.', '']
(ROOT/'docs/CEFR-VOCABULARY.md').write_text('\n'.join(lines))
