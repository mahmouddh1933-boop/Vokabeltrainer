"""Build a curated, Firebase-free static demo without changing the full app.

Python 3.10+ and Node.js are needed only to build; the output needs no server code.
"""
import argparse
import json
from pathlib import Path
import re
import shutil
import subprocess
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--directory', type=Path, default=Path('/tmp/huroof-demo'))
parser.add_argument('--output', type=Path, default=ROOT / 'downloads/Huroof-Demo.zip')
args = parser.parse_args()
DEST = args.directory.resolve()
if DEST == ROOT or DEST in ROOT.parents or DEST.exists() and any(DEST.iterdir()):
    raise SystemExit('Use an empty output directory outside the source repository.')
DEST.mkdir(parents=True, exist_ok=True)


def write(name, content):
    path = DEST / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


def dump(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))


# Evaluate our own source modules, then serialize ONLY the selected content.
# Function bodies are retained separately where lessons need generators.
extract = r'''
const fs = require('fs'), vm = require('vm');
function capture(path, name) {
  const source = fs.readFileSync(path, 'utf8').replace(
    'if (typeof module !== "undefined" && module.exports)',
    'globalThis.captured = ' + name + '; if (typeof module !== "undefined" && module.exports)');
  const context = {module: {exports:{}}, require: p=>require(require('path').resolve('js',p))};
  vm.runInNewContext(source, context);
  return context.captured;
}
const letters = require('./js/letter-data.js');
letters.letters = letters.letters.slice(0,6);
const grammar = require('./js/grammar-data.js');
grammar.lessons = ["sun-moon","pronouns","gender"].map(id=>grammar.lessons.find(l=>l.id===id)).map(l=>({...l, questions:l.questions.slice(0,8)}));
delete grammar.basicVerbs;
delete grammar.stages;
const practice = require('./js/practice-data.js');
practice.sounds = practice.sounds.slice(0,2);
practice.sentences = [...practice.sentences.filter(s=>s.level==='A1').slice(0,3),
  ...practice.sentences.filter(s=>s.level==='A2').slice(0,3)];
practice.stories = practice.stories.slice(0,1);
const vocabulary = require('./js/verb-data.js');
vocabulary.verbs = vocabulary.verbs.filter(v=>['write','study','open','drink','play','hear'].includes(v.id));
const rows = capture('js/letter-examples.js', 'rows').slice(0,6);
const extras = capture('js/letter-focused-data.js', 'extras');
const chosenExtras = Object.fromEntries(letters.letters.map(l=>[l.char, extras[l.char]]));
console.log(JSON.stringify({letters,grammar,practice,verbs:vocabulary.verbs,rows,extras:chosenExtras,pictures:require("./js/vocab-pictures.js").mappings}));
'''
data = json.loads(subprocess.check_output(['node', '-e', extract], cwd=ROOT, text=True))

# Recordings are copied only when their spoken text belongs to selected content.
def strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from strings(item)
    elif isinstance(value, dict):
        for item in value.values():
            yield from strings(item)


import unicodedata
def normalize(text):
    return unicodedata.normalize('NFC', text)


letters = data['letters']
texts = {normalize(text) for text in strings(letters['letters'])}
for letter in letters['letters']:
    texts.update(normalize(letter['char'] + vowel) for vowel in ['َ', 'ِ', 'ُ', 'ْ'])
letters['audio'] = {key: path for key, path in letters['audio'].items() if normalize(key) in texts}
practice = data['practice']
texts = {normalize(text) for text in strings({key: practice[key] for key in ['sounds', 'sentences', 'stories']})}
practice['audio'] = {key: path for key, path in practice['audio'].items() if normalize(key) in texts}

catalog = json.loads((ROOT / 'data/vocab_catalog.json').read_text())
selected_ids = {'a1_01', 'a1_04', 'a1_11', 'a2_01', 'a2_10', 'a2_16'}
catalog['lists'] = [item for item in catalog['lists'] if item['id'] in selected_ids]
catalog['levels'] = [item for item in catalog['levels'] if item['id'] in ['A1', 'A2']]
for level in catalog['levels']:
    level['listIds'] = [key for key in level['listIds'] if key in selected_ids]
catalog['cefrLevels'] = ['A1', 'A2']
catalog['demo'] = True
write('data/vocab_catalog.json', dump(catalog))
write('data/vocab_catalog_fallback.js', 'window.VOCAB_CATALOG_META={lists:6};\nwindow.VOCAB_CATALOG_FALLBACK=' + dump(catalog) + ';')
labels = {}
for level in catalog['levels']:
    labels[level['title']] = 'Niveau ' + level['id']
    labels[level['subtitle']] = 'Einstieg' if level['id'] == 'A1' else 'Grundlegende Kenntnisse'
    labels[level['title'] + ' · ' + level['subtitle']] = labels[level['title']] + ' · ' + labels[level['subtitle']]
    labels[level['description']] = ('Wörter für Begrüßung, Familie und Essen.' if level['id'] == 'A1'
                                    else 'Wörter für Termine, Arztbesuche und Reisen.')
for item in catalog['lists']:
    labels[item['title']] = item['titleDe']
write('data/vocab_catalog_labels.js', 'window.VOCAB_CATALOG_LABELS=' + dump(labels) + ';')

write('js/letter-data.js', 'window.ArabicLetterData=' + dump(letters) + ';')
write('js/grammar-data.js', 'window.ArabicGrammarData=' + dump(data['grammar']) + ';')
source = (ROOT / 'js/verb-data.js').read_text()
start = source.index('  const verbs = ')
end = source.index('  const pronouns = ')
write('js/verb-data.js', source[:start] + '  const verbs = ' + dump(data['verbs']) + ';\n' + source[end:])
for filename, variable, value, end in [
    ('letter-examples.js', 'rows', data['rows'], '  const examples = '),
    ('letter-focused-data.js', 'extras', data['extras'], '  const modes = '),
]:
    source = (ROOT / 'js' / filename).read_text()
    start = source.index('  const ' + variable + ' = ')
    stop = source.index(end)
    write('js/' + filename, source[:start] + '  const ' + variable + ' = ' + dump(value) + ';\n' + source[stop:])
sound_function = (ROOT / 'js/practice-data.js').read_text().split('  function soundQuestions(')[1].split('  const variants = ')[0]
write('js/practice-data.js', '(() => { const data=' + dump(practice) + ';\nfunction soundQuestions(' + sound_function + '\ndata.soundQuestions=soundQuestions; window.ArabicPracticeData=data; })();')

PAGES = ['index', 'lernseite', 'test', 'test1', 'test2', 'test3', 'test4', 'test5', 'test6',
         'ergebnis', 'review', 'stats', 'huruf', 'letter-tests', 'grammar', 'verbs',
         'sounds', 'sentences', 'stories']
EXCLUDED_SCRIPTS = {'js/firebase-config.js', 'js/auth-session.js', 'js/grammar-expanded.js', 'js/grammar-syntax.js', 'js/learning-path.js', 'js/pages/route-home.js', 'js/sentence-expanded-data.js'}
references = set()
for name in PAGES:
    source = (ROOT / (name + '.html')).read_text()
    source = re.sub(r'<script\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>\s*</script>',
        lambda match: '' if match[1].split('?')[0] in EXCLUDED_SCRIPTS or match[1].startswith('https:') else match[0], source)
    source = re.sub(r'<p\b[^>]*class=["\'](?:placement-context|teacher-exams-context)["\'][^>]*>.*?</p>', '', source, flags=re.S)
    if name == 'grammar':
        source = re.sub(r'<script[^>]*src=[\"\']js/grammar-path-data.js[^\"\']*[\"\'][^>]*>\s*</script>', '', source)
    source = re.sub(r'<link\b[^>]*href=["\']css/auth.css[^"\']*["\'][^>]*>', '', source)
    source = re.sub(r'((?:src|href)=["\'])([^"\']+\.(?:js|css))\?[^"\']*(["\'])', r'\1\2\3', source)
    source = source.replace('</title>', ' · Demo</title>')
    source = source.replace('</head>', '<link rel="stylesheet" href="css/demo.css" />\n<script src="js/demo.js" defer></script>\n</head>')
    if name == 'index':
        source = source.replace('</head>', '<script src="js/pages/home.js" defer></script></head>')
        # Keep the existing renderer but omit import and full-edition promotional sections.
        start = source.index('<main ')
        end = source.index('<footer ')
        source = source[:start] + '''
    <main class="container home-container" id="main-content">
      <header class="page-heading"><div><p class="eyebrow" data-de="DEMO · ARABISCH ENTDECKEN" data-ar="نسخة تجريبية · اكتشف العربية">DEMO · ARABISCH ENTDECKEN</p><h1 lang="ar">حروف من الزيتون</h1><p data-de="Ausgewählte Lektionen zum Ausprobieren. In deinem Tempo." data-ar="دروس مختارة للتجربة، بالسرعة التي تناسبك.">Ausgewählte Lektionen zum Ausprobieren. In deinem Tempo.</p></div></header>
      <section class="hero-card"><div class="hero-copy"><span class="hero-tag">DEMO</span><h2 data-de="Ein erster Schritt.\nMit festen Wurzeln." data-ar="خطوة أولى.\nوجذور راسخة.">Ein erster Schritt.<br>Mit festen Wurzeln.</h2><p data-de="Entdecke arabische Buchstaben, vokalisierte Wörter und interaktive Übungen – mit ruhigen Olivenzweigen im Hintergrund." data-ar="اكتشف الحروف والكلمات المشكولة والتدريبات التفاعلية، مع أغصان زيتون هادئة في الخلفية.">Entdecke arabische Buchstaben, vokalisierte Wörter und interaktive Übungen – mit ruhigen Olivenzweigen im Hintergrund.</p><button class="hero-cta" id="hero-start" type="button" data-de="Demo ausprobieren ↗" data-ar="جرّب الآن ↖">Demo ausprobieren ↗</button><div class="hero-meta"><span data-de="6 Listen · 120 Wörter" data-ar="٦ قوائم · ١٢٠ مفردة">6 Listen · 120 Wörter</span><i></i><span>A1 · A2</span></div></div><div class="hero-art olive-hero-art" aria-hidden="true"><div class="olive-hero-illustration"></div></div></section>
      <div class="home-status-grid"><a class="status-card" href="stats.html"><span class="stat-icon" data-icon="check"></span><div><strong id="mastered-lists-total">0</strong><span data-de="Gemeisterte Listen" data-ar="قوائم أتقنتها">Gemeisterte Listen</span></div></a><a class="status-card" href="stats.html"><span class="stat-icon" data-icon="chart"></span><div><strong id="tests-total">0</strong><span data-de="Abgeschlossene Tests" data-ar="اختبارات أكملتها">Abgeschlossene Tests</span></div></a><a class="status-card" href="review.html"><span class="stat-icon" data-icon="repeat"></span><div><strong id="wrong-total">0</strong><span data-de="Wörter zum Wiederholen" data-ar="كلمات للمراجعة">Wörter zum Wiederholen</span></div></a></div>
      <section id="ready-lists-panel" class="home-panel learning-section"><div class="section-heading"><h2 data-de="Dein Demo-Lernpfad" data-ar="مسار التعلّم التجريبي">Dein Demo-Lernpfad</h2><span class="path-label">A1 · A2</span></div><p class="section-description" data-de="Drei Listen pro Niveau, je 20 vokalisierte Wörter und Wendungen mit deutscher Übersetzung. Anschließend kannst du alle sechs Vokabeltests ausprobieren." data-ar="ثلاث قوائم لكل مستوى، في كل قائمة ٢٠ كلمة وتعبيرًا مع التشكيل والترجمة الألمانية. ثم جرّب اختبارات المفردات الستة.">Drei Listen pro Niveau, je 20 vokalisierte Wörter und Wendungen mit deutscher Übersetzung. Anschließend kannst du alle sechs Vokabeltests ausprobieren.</p><div id="learning-path"></div></section>
      <section><div class="section-heading"><h2 data-de="Noch mehr ausprobieren" data-ar="جرّب أيضًا">Noch mehr ausprobieren</h2></div><div class="foundation-home-grid">
''' + ''.join(f'<a class="foundation-home-link" href="{href}.html"><span class="foundation-glyph" lang="ar">{glyph}</span><h3 data-de="{de}" data-ar="{ar}">{de}</h3><p data-de="{detail}" data-ar="{detail_ar}">{detail}</p></a>' for href,glyph,de,ar,detail,detail_ar in [
            ('huruf','أ ب','Sechs Buchstaben','ستة حروف','Alif bis Ḥā: Karten, Aussprache, Schreibfläche und Übungen.','من الألف إلى الحاء: بطاقات ونطق وكتابة وتدريبات.'),
            ('grammar','الـ','Drei Grammatiklektionen','ثلاثة دروس قواعد','Sonnen- und Mondbuchstaben, Pronomen und Genus. 24 Fragen.','اللام الشمسية والقمرية والضمائر والمذكر والمؤنث. ٢٤ سؤالًا.'),
            ('verbs','فَعَلَ','Sechs Verben','ستة أفعال','Perfekt, Präsens und Imperativ mit Übungen.','الماضي والمضارع والأمر، مع تمارين.'),
            ('sounds','ت / ط','Laute unterscheiden','تمييز الأصوات','Zwei Lautpaare mit 12 Hörfragen und Aufnahmen.','مجموعتان و١٢ سؤال استماع مع تسجيلات.'),
            ('sentences','أنا','Sätze bilden','تكوين الجمل','Sechs Aufgaben zum Ordnen von Wörtern.','ستة تدريبات على ترتيب الكلمات.'),
            ('stories','▤','Eine Kurzgeschichte','قصة قصيرة','Frühstück mit meiner Familie: Audio und vier Verständnisfragen.','فطور مع أسرتي: صوت وأربعة أسئلة فهم.'),
        ]) + '''</div></section>
      <p class="demo-footer-note" data-de="Diese Demo enthält nur eine Auswahl. Weitere Bücher und die vollständigen Lernniveaus gehören zur Vollversion." data-ar="تحتوي هذه النسخة التجريبية على مختارات فقط. الكتب والمستويات الكاملة متاحة في النسخة الكاملة.">Diese Demo enthält nur eine Auswahl. Weitere Bücher und die vollständigen Lernniveaus gehören zur Vollversion.</p>
    </main>
''' + source[end:]
    if name in ['huruf', 'letter-tests']:
        source = re.sub(r'\b28\b', '6', source)
    if name == 'grammar':
        source = re.sub(r'<section class="grammar-path-panel" aria-labelledby="verbs-entry-title">.*?</section>', '<section class="grammar-path-panel"><h2 data-ar="تصريف الأفعال" data-de="Verbkonjugation">تصريف الأفعال</h2><p data-ar="ستة أفعال صحيحة مع الماضي والمضارع والأمر والنفي والنهي." data-de="Sechs regelmäßige Verben mit Perfekt, Präsens, Imperativ, Verneinung und Verbot.">ستة أفعال صحيحة.</p><a class="practice-button" href="verbs.html" data-ar="افتح تصريف الأفعال" data-de="Verbformen öffnen">افتح تصريف الأفعال</a></section>', source, flags=re.S)
        source = source.replace('30 درسًا في القواعد والإملاء · 380 سؤالًا مع شرح الإجابات.', '٣ دروس في القواعد · ٢٤ سؤالًا مع شرح الإجابات.').replace('30 Lektionen zu Grammatik und Rechtschreibung · 380 Fragen mit Erklärungen.', '3 Grammatiklektionen · 24 Fragen mit Erklärungen.')
        source = re.sub(r'<option\s+value="(?:spelling|morphology|syntax)"[^>]*>.*?</option>', '', source, flags=re.S)
        source = source.replace('همزة / Hamza · ضمائر / Pronomen', 'ضمائر / Pronomen')
    if name == 'verbs':
        source = source.replace('51', '6').replace('٥١', '٦')
        source = source.replace('Entdecke regelmäßige, hamzierte und schwache Verben', 'Entdecke sechs regelmäßige Verben')
        source = re.sub('ستجد أفعالاً صحيحة ومهموزة ومعتلّة،', 'ستجد ستة أفعال صحيحة،', source)
    if name == 'sounds':
        source = source.replace('ست مجموعات', 'مجموعتين').replace('٣٦', '١٢').replace('sechs Lautpaare', 'zwei Lautpaare').replace('36', '12')
    if name == 'sentences':
        source = source.replace('١٢٠ تدريبًا: ٦٠ في A1 و٦٠ في A2، منها ٣٢ سؤالًا جديدًا.', '٦ تدريبات في مستويين.').replace('120 Übungen: 60 in A1 und 60 in A2, darunter 32 neue Fragen.', '6 Übungen in zwei Niveaus.').replace('١٢٠ تدريبًا في مستويين.', '٦ تدريبات في مستويين.')
        source = re.sub(r'<option value="(?:question|command)"[^>]*>.*?</option>', '', source)
        source = source.replace('٢٤', '٦').replace('24 Übungen', '6 Übungen')
    if name == 'stories':
        source = source.replace('ست قصص مصوّرة للحياة اليومية.', 'قصة مصوّرة للحياة اليومية.').replace('Sechs illustrierte Alltagsgeschichten.', 'Eine illustrierte Alltagsgeschichte.')
        source = source.replace('<option value="A2">A2</option>', '')
    write(name + '.html', source)
    references.update(re.findall(r'(?:src|href)=["\']([^"\']+\.(?:js|css))["\']', source))

# Copy executable dependencies recursively from the allowlisted demo pages.
for reference in references:
    if reference not in {'css/demo.css', 'js/demo.js'} and not (DEST / reference).exists():
        write(reference, (ROOT / reference).read_text())
related_page = DEST / 'js/pages/letters-related.js'
if related_page.exists():
    # Keep supplementary links inside the demo's three selected grammar lessons.
    ids = dump([lesson['id'] for lesson in data['grammar']['lessons']])
    related_page.write_text(related_page.read_text().replace('...links.map(', '...links.filter(([id]) => '+ids+'.includes(id)).map('))
home = (ROOT / 'js/pages/home.js').read_text()
home = '(function(){ "use strict"; window.JisrStorage.ready(async()=>{ const app=window.VocabApp; document.getElementById("wrong-total").textContent=app.getWrongWords().length; document.getElementById("mastered-lists-total").textContent=app.getMasterySummary().masteredLists; document.getElementById("tests-total").textContent=app.getStats().totalTests||0; renderLearningPath(await app.loadCatalog(),document.getElementById("learning-path")); });\n' + home[home.index('  function listSource('):]
write('js/pages/home.js', home)
design = (DEST / 'js/design.js').read_text()
demo_nav = [["index.html","home","Übersicht","نظرة عامة"],["huruf.html","letters","Alphabet","الحروف"],["letter-tests.html","check","Buchstaben üben","تدريبات الحروف"],["sounds.html","letters","Ähnliche Laute","الأصوات المتشابهة"],["sentences.html","check","Sätze bilden","تكوين الجمل"],["stories.html","book","Kurzgeschichten","قصص قصيرة"],["grammar.html","book","Grammatik","القواعد"],["verbs.html","book","Verben","الأفعال"],["test.html","check","Tests","الاختبارات"],["review.html","repeat","Wiederholen","المراجعة"],["stats.html","chart","Fortschritt","تقدمي"]]
design = re.sub(r'    const nav =.*?    const activeHref =.*?;\n', '    const nav = '+dump(demo_nav)+';\n    const activeHref = page;\n', design, count=1, flags=re.S)

design = re.sub(r'      \[\n        "(?:book-level-two|arabic-youth|youth-training-two|youth-book-two-part-one)\.html",.*?\n      \],\n', '', design, flags=re.S)
design = design.replace('window.VOCAB_CATALOG_META?.lists || 120', 'window.VOCAB_CATALOG_META?.lists || 6')
write('js/design.js', design)
app = (DEST / 'js/app.js').read_text()
app = re.sub(r'    function getOnlineTTSUrls\(text\) \{.*?\n    \}', '    function getOnlineTTSUrls() { return []; }', app, flags=re.S)
app = app.replace('onlineFallback: typeof Audio !== "undefined"', 'onlineFallback: false')
app = app.replace('Audio nicht verfügbar. Prüfe die Verbindung oder aktiviere eine arabische Stimme in den Spracheinstellungen des Geräts.', 'Aktiviere für diese Wörter eine arabische Stimme in den Spracheinstellungen deines Geräts. Die Demo nutzt Aufnahmen und die Sprachausgabe des Geräts.')
app = app.replace('تعذّر تشغيل الصوت. تحقق من الاتصال أو فعّل صوتًا عربيًا في إعدادات النطق بالجهاز.', 'فعّل صوتًا عربيًا في إعدادات النطق بالجهاز لهذه الكلمات. تستخدم النسخة التجريبية التسجيلات وصوت الجهاز.')
write('js/app.js', app)

# Run immediately after storage.js, before any lesson reads progress.
write('js/demo.js', '''(() => {
  "use strict";
  window.JisrStorage.local.setScope("huroof-demo-v1");
  window.JisrStorage.session.setScope("huroof-demo-v1");
  if (!window.JisrStorage.local.getItem("vocabInterfaceLanguage"))
    window.JisrStorage.local.setItem("vocabInterfaceLanguage", "de");
  // Direct links to cards/tests also have a useful starting list. This keeps
  // the demo interactive when a file viewer blocks persistent browser storage.
  if (!window.JisrStorage.local.getItem("vocabList")) {
    const first = __DEMO_INITIAL_LIST__;
    window.JisrStorage.local.setItem("vocabList", JSON.stringify(first.words.map(w=>[w.ar,w.de])));
    window.JisrStorage.local.setItem("currentVocabSource", JSON.stringify({type:"ready-list",id:first.id,cefr:first.level,title:first.title,count:first.words.length}));
  }
  window.JisrStorage.ready(() => {
    const main = document.querySelector("main");
    const note = document.createElement("aside");
    note.className = "demo-notice";
    note.setAttribute("aria-label", "Demo / نسخة تجريبية");
    note.innerHTML = '<strong data-de="DEMO · حروف من الزيتون" data-ar="نسخة تجريبية · حروف من الزيتون">DEMO · حروف من الزيتون</strong><span data-de="Ohne Anmeldung. Dein Fortschritt bleibt in diesem Browser. Eine Auswahl der Lerninhalte ist enthalten." data-ar="بلا تسجيل دخول. يُحفظ التقدّم في هذا المتصفح فقط. تتضمن النسخة مختارات من المحتوى.">Ohne Anmeldung. Dein Fortschritt bleibt in diesem Browser. Eine Auswahl der Lerninhalte ist enthalten.</span>';
    main.prepend(note);
    window.AppLanguage?.translate();
  });
})();
'''.replace('__DEMO_INITIAL_LIST__', dump(catalog['lists'][0])))
write('css/demo.css', '''.demo-notice{display:flex;flex-wrap:wrap;gap:.4rem 1rem;align-items:center;margin:0 0 1.5rem;padding:1rem 1.2rem;border:1px solid #c7d6b5;border-radius:18px;background:#eef3e6;color:#254b3e;line-height:1.7;font-size:.9rem}.demo-notice strong{font-size:.85rem}.demo-notice span{flex:1 1 280px}.demo-footer-note{margin-block:2rem;line-height:1.9;color:#3a5c49}.hero-copy h2{white-space:pre-line}@media print{.demo-notice{display:none}}
''')
for name in PAGES:
    path = DEST / (name + '.html')
    html = path.read_text().replace('<script src="js/demo.js" defer></script>', '')
    html, count = re.subn(r'(<script src="js/storage.js"[^>]*></script>)', r'\1\n<script src="js/demo.js" defer></script>', html)
    assert count == 1, name
    path.write_text(html)

picture_keys = set()
for item in catalog['lists']:
    for word in item['words']:
        ar = ''.join(c for c in normalize(word['ar']) if not unicodedata.category(c).startswith('M') and c != 'ـ').strip()
        picture_keys.add(dump([ar, normalize(word['de']).strip().lower()]))
demo_pictures = {key:path for key,path in data['pictures'].items() if key in picture_keys}
picture_source = (ROOT/'js/vocab-pictures.js').read_text()
write('js/vocab-pictures.js', picture_source.replace('const mappings = '+dump(data['pictures']), 'const mappings = '+dump(demo_pictures)))
for picture in demo_pictures.values():
    (DEST/picture).parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(ROOT/picture,DEST/picture)
for folder in ['images/brand', 'fonts']:
    shutil.copytree(ROOT / folder, DEST / folder, dirs_exist_ok=True)
for image in [letter['img'] for letter in letters['letters']]:
    path = DEST / image
    path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / image, path)
# The existing CSS uses one local illustration sheet for story art.
shutil.copytree(ROOT / 'images/stories', DEST / 'images/stories', dirs_exist_ok=True)
related_audio = {clip['path'] for clip in json.loads((ROOT/'audio/letter-related-manifest.json').read_text())['clips']}
vocab_words = {normalize(w['ar']) for item in catalog['lists'] for w in item['words']}
vocab_audio = {clip['text']:clip['path'] for clip in json.loads((ROOT/'audio/vocabulary-manifest.json').read_text())['clips'] if normalize(clip['text']) in vocab_words}
assert len(vocab_audio) == len(vocab_words)
write('js/vocab-audio-data.js', 'window.ArabicVocabularyAudio = {audio:'+dump(vocab_audio)+'};\n')
for audio in set(letters['audio'].values()) | set(practice['audio'].values()) | related_audio | set(vocab_audio.values()):
    path = DEST / audio
    path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / audio, path)

write('README-DEMO.txt', '''HUROOF DEMO · حروف من الزيتون

Diese eigenständige Demo benötigt weder Firebase noch Anmeldung, Datenbank,
Node.js, Python oder einen Build-Schritt. Es gibt keine Verbindung zu deinem
Firebase-Projekt. Die vollständige App wird nicht verändert.

INHALT
- 6 Wortschatzlisten: 3 auf A1 und 3 auf A2, insgesamt 120 vokalisierte Einträge.
- Lernkarten, sechs Vokabeltestarten, Fehlerwiederholung und lokale Statistik.
- Die ersten 6 Buchstaben (Alif bis Ḥā), vier Testarten, Schreibfläche und
  buchstabenspezifische Aufgaben.
- 3 Grammatiklektionen mit insgesamt 24 Fragen.
- 6 Verben: Perfekt, Präsens und Imperativ mit Übungen.
- 2 Lautpaare mit 12 Hörfragen, 6 Satzbauaufgaben und 1 Kurzgeschichte
  mit 4 Verständnisfragen.
- Deutsche und arabische Oberfläche, Olivenzweige und auswählbarer Hintergrund.

KOSTENLOS HOSTEN: NETLIFY DROP
1. Huroof-Demo.zip vollständig in einen neuen Ordner entpacken.
2. https://app.netlify.com/drop im Browser öffnen. Bei Bedarf ein kostenloses
   Netlify-Konto erstellen und den Free-Tarif verwenden.
3. Den entpackten Ordner auf die Upload-Fläche ziehen. Direkt in diesem Ordner
   müssen index.html, styles.css sowie css, js, data, images, fonts und audio liegen.
4. Nach dem Upload die angezeigte HTTPS-Adresse öffnen und weitergeben.
   Kostenlos innerhalb der jeweiligen Anbieterlimits.

ALTERNATIVE: CLOUDFLARE PAGES
1. Im Cloudflare-Dashboard unter Workers & Pages eine Pages-Seite erstellen.
2. Direct Upload / Upload assets wählen (die Oberfläche kann abweichen).
3. Diese ZIP hochladen oder den entpackten Ordner auswählen und veröffentlichen.
   index.html liegt bereits im Stammverzeichnis der ZIP. Kein Build-Befehl nötig.

AUF DEM COMPUTER AUSPROBIEREN
ZIP vollständig entpacken und index.html im Browser öffnen.
Für Android Chrome und zum Weitergeben empfiehlt sich die gehostete HTTPS-Seite.

DATEN UND AUDIO
Fortschritte werden nur im Browser dieses Geräts gespeichert. Es gibt keine
Konten und keine Synchronisierung zwischen Geräten. Ein anderer Browser oder
das Löschen der Websitedaten setzt den lokalen Fortschritt zurück.
Die Demo hat einen eigenen Namensraum für Lernstände. Sprache und Hintergrund
können mit einer am gleichen Ursprung geöffneten Vollversion geteilt werden.
Alle Wörter der sechs Demo-Wortlisten haben mitgelieferte Tonaufnahmen.
Für zusätzlich importierte Wörter verwendet die Demo die Sprachausgabe des Geräts; hierfür muss eine
arabische Stimme verfügbar sein. Je nach Betriebssystem benötigt diese Internet.
Keine Analytics- oder Werbeskripte werden eingebunden.

Erstellt für Mahmoud Barakat · حروف من الزيتون
''')

shutil.copytree(ROOT/'images/pwa',DEST/'images/pwa',dirs_exist_ok=True)
shutil.copy2(ROOT/'offline.html',DEST/'offline.html')
pwa=json.loads((ROOT/'manifest.webmanifest').read_text())
pwa['name']='حروف من الزيتون · Demo'
pwa['short_name']='حروف · Demo'
pwa['shortcuts']=[{'name':'Lernpfad · مسار التعلم','url':'./index.html'},{'name':'Alphabet · الحروف','url':'./huruf.html'}]
write('manifest.webmanifest',json.dumps(pwa,ensure_ascii=False,indent=2)+'\n')

# Inline local scripts and CSS for reliable file:// opening as in the full ZIP.
def portable(path):
    source = path.read_text()
    scripts = []
    def script(match):
        ref = match[1]
        code = (DEST / ref).read_text().replace('</script', '<\\/script')
        scripts.append('<script data-source="' + ref + '">\n' + code + '\n</script>')
        return ''
    source = re.sub(r'<script\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>\s*</script>', script, source)
    def style(match):
        ref = match[1]
        css = (DEST / ref).read_text()
        def rebase(url):
            from posixpath import normpath
            target = url[1].strip('"\' ')
            if re.match(r'^[a-z][a-z0-9+.-]*:|^//|^/|^#', target, re.I):
                return url[0]
            return 'url("' + normpath(str(Path(ref).parent / target)) + '")'
        css = re.sub(r'url\(([^)]+)\)', rebase, css)
        return '<style data-source="' + ref + '">\n' + css + '\n</style>'
    source = re.sub(r'<link\b[^>]*rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>', style, source)
    return source.replace('</body>', '\n'.join(scripts) + '\n</body>')

for name in PAGES:
    path = DEST / (name + '.html')
    path.write_text(portable(path))

manifest = {'edition': 'demo', 'vocabularyLists': 6, 'vocabularyEntries': 120,
            'letters': 6, 'grammarLessons': 3, 'grammarQuestions': 24,
            'verbs': 6, 'soundGroups': 2, 'soundQuestions': 12,
            'sentences': 6, 'stories': 1, 'pages': [page + '.html' for page in PAGES],
            'recordings': len(list(DEST.rglob('*.mp3')))}
write('demo-manifest.json', dump(manifest))
subprocess.run(['python3',str(ROOT/'tools/build-pwa.py'),'--directory',str(DEST)],check=True)
files = sorted(path for path in DEST.rglob('*') if path.is_file())
assert not any('firebase' in path.name or 'cloud-sync' in path.name or 'auth-session' in path.name for path in files)
assert len(catalog['lists']) == 6
assert sum(len(item['words']) for item in catalog['lists']) == 120
args.output.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(args.output, 'w', ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, path.relative_to(DEST).as_posix())
with ZipFile(args.output) as archive:
    assert archive.testzip() is None
    assert 'index.html' in archive.namelist()
print(f'Demo verified: {len(files)} files, {manifest["recordings"]} recordings, {args.output.stat().st_size:,} bytes. {args.output}')
