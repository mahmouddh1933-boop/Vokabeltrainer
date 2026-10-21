(() => {
  "use strict";
  const localStorage = window.JisrStorage.local;
  const KEY = "vocabInterfaceLanguage";
  const oldTranslations = {
    "اختر الاختبار": {
      en: "Choose a test",
      de: "Test auswählen",
      ru: "Выберите тест",
      fa: "انتخاب آزمون",
      tr: "Test seçin",
    },
    "اختر مدة الاختبار": {
      en: "Choose test duration",
      de: "Testdauer auswählen",
      ru: "Выберите длительность",
      fa: "انتخاب مدت آزمون",
      tr: "Test süresini seçin",
    },
    "حدد الوقت الذي تريده لكل اختبار:": {
      en: "Choose how long each test lasts:",
      de: "Wähle die Zeit für jeden Test:",
      ru: "Выберите время теста:",
      fa: "زمان هر آزمون را انتخاب کنید:",
      tr: "Her testin süresini seçin:",
    },
    "60 ثانية": {
      en: "60 seconds",
      de: "60 Sekunden",
      ru: "60 секунд",
      fa: "۶۰ ثانیه",
      tr: "60 saniye",
    },
    "90 ثانية": {
      en: "90 seconds",
      de: "90 Sekunden",
      ru: "90 секунд",
      fa: "۹۰ ثانیه",
      tr: "90 saniye",
    },
    "120 ثانية": {
      en: "120 seconds",
      de: "120 Sekunden",
      ru: "120 секунд",
      fa: "۱۲۰ ثانیه",
      tr: "120 saniye",
    },
    "عرض النتيجة": {
      en: "Show results",
      de: "Ergebnis anzeigen",
      ru: "Показать результат",
      fa: "نمایش نتیجه",
      tr: "Sonuçları göster",
    },
    "اختيار اختبار آخر": {
      en: "Choose another test",
      de: "Anderen Test wählen",
      ru: "Выбрать другой тест",
      fa: "انتخاب آزمون دیگر",
      tr: "Başka test seç",
    },
    "العودة إلى التعلّم": {
      en: "Back to learning",
      de: "Zurück zum Lernen",
      ru: "Назад к обучению",
      fa: "بازگشت به یادگیری",
      tr: "Öğrenmeye dön",
    },
    "العودة إلى بطاقات التعلّم": {
      en: "Back to flashcards",
      de: "Zurück zu Lernkarten",
      ru: "Назад к карточкам",
      fa: "بازگشت به کارت‌های آموزشی",
      tr: "Kartlara dön",
    },
    "مراجعة الأخطاء": {
      en: "Review mistakes",
      de: "Fehler wiederholen",
      ru: "Повторить ошибки",
      fa: "مرور اشتباهات",
      tr: "Hataları gözden geçir",
    },
    "التقدّم والإحصائيات": {
      en: "Progress and statistics",
      de: "Fortschritt und Statistik",
      ru: "Прогресс и статистика",
      fa: "پیشرفت و آمار",
      tr: "İlerleme ve istatistikler",
    },
    "✍️ اكتب الكلمة العربية": {
      en: "✍️ Write the Arabic word",
      de: "✍️ Arabisches Wort schreiben",
      ru: "✍️ Напишите слово",
      fa: "✍️ نوشتن واژه عربی",
      tr: "✍️ Arapça kelimeyi yaz",
    },
    "✅ اختيار من متعدد": {
      en: "✅ Multiple choice",
      de: "✅ Multiple Choice",
      ru: "✅ Выбор ответа",
      fa: "✅ چندگزینه‌ای",
      tr: "✅ Çoktan seçmeli",
    },
    "🔤 إكمال الحروف الناقصة": {
      en: "🔤 Fill missing letters",
      de: "🔤 Fehlende Buchstaben",
      ru: "🔤 Вставить буквы",
      fa: "🔤 حروف جاافتاده",
      tr: "🔤 Eksik harfleri tamamla",
    },
    "🔊 اختبار الاستماع": {
      en: "🔊 Listening test",
      de: "🔊 Hörtest",
      ru: "🔊 Аудирование",
      fa: "🔊 آزمون شنیداری",
      tr: "🔊 Dinleme testi",
    },
    "🧩 ترتيب الحروف المبعثرة": {
      en: "🧩 Unscramble letters",
      de: "🧩 Buchstaben ordnen",
      ru: "🧩 Соберите слово",
      fa: "🧩 مرتب کردن حروف",
      tr: "🧩 Harfleri sırala",
    },
    "🔗 إكمال الحروف المتصلة": {
      en: "🔗 Connected missing letters",
      de: "🔗 Verbundene Buchstaben ergänzen",
      ru: "🔗 Пропущенная буква в слове",
      fa: "🔗 تکمیل حروف پیوسته",
      tr: "🔗 Bitişik harfleri tamamla",
    },
    "جسر الترحيب": {
      en: "Welcome Bridge",
      de: "Willkommensbrücke",
      ru: "Мост приветствия",
      fa: "پل خوشامدگویی",
      tr: "Hoş Geldin Köprüsü",
    },
    "تعلّم العربية بطريقة منظّمة": {
      en: "Learn Arabic step by step",
      de: "Arabisch Schritt für Schritt",
      ru: "Изучайте арабский поэтапно",
      fa: "یادگیری گام‌به‌گام عربی",
      tr: "Adım adım Arapça öğren",
    },
    "رفع ملف Excel": {
      en: "Upload Excel file",
      de: "Excel-Datei hochladen",
      ru: "Загрузить Excel",
      fa: "بارگذاری فایل اکسل",
      tr: "Excel dosyası yükle",
    },
    "قوائم جاهزة للتعلّم": {
      en: "Ready-made word lists",
      de: "Fertige Wortlisten",
      ru: "Готовые списки слов",
      fa: "فهرست‌های آماده",
      tr: "Hazır kelime listeleri",
    },
    "المستوى التمهيدي: تعلّم الحروف": {
      en: "Beginner level: Learn letters",
      de: "Einstieg: Buchstaben lernen",
      ru: "Начальный уровень: Буквы",
      fa: "سطح مقدماتی: آموزش حروف",
      tr: "Başlangıç: Harfleri öğren",
    },
    النتيجة: {
      en: "Results",
      de: "Ergebnis",
      ru: "Результаты",
      fa: "نتیجه",
      tr: "Sonuç",
    },
    "نتيجة الاختبار": {
      en: "Test results",
      de: "Testergebnisse",
      ru: "Результаты теста",
      fa: "نتیجه آزمون",
      tr: "Test sonuçları",
    },
    "ابدأ التعلّم من ملف Excel": {
      en: "Start learning from Excel",
      de: "Mit Excel lernen",
      ru: "Учиться по Excel",
      fa: "شروع یادگیری از اکسل",
      tr: "Excel ile öğren",
    },
    "اختيار ملف Excel": {
      en: "Select Excel file",
      de: "Excel-Datei wählen",
      ru: "Выбрать Excel",
      fa: "انتخاب فایل اکسل",
      tr: "Excel dosyası seç",
    },
    "مسار التعلّم": {
      en: "Learning path",
      de: "Lernpfad",
      ru: "Путь обучения",
      fa: "مسیر یادگیری",
      tr: "Öğrenme yolu",
    },
    "تعلّم الحروف العربية - جسر الترحيب": {
      en: "Arabic letters",
      de: "Arabische Buchstaben",
      ru: "Арабские буквы",
      fa: "حروف عربی",
      tr: "Arap harfleri",
    },
    "اختبر نفسك": {
      en: "Test yourself",
      de: "Teste dich",
      ru: "Проверьте себя",
      fa: "خودآزمایی",
      tr: "Kendini test et",
    },
    السابق: {
      en: "Previous",
      de: "Zurück",
      ru: "Назад",
      fa: "قبلی",
      tr: "Önceki",
    },
    التالي: {
      en: "Next",
      de: "Weiter",
      ru: "Далее",
      fa: "بعدی",
      tr: "Sonraki",
    },
    "الصفحة الرئيسية": {
      en: "Home",
      de: "Startseite",
      ru: "Главная",
      fa: "صفحه اصلی",
      tr: "Ana sayfa",
    },
    "إكمال الحروف المتصلة": {
      en: "Complete connected letters",
      de: "Verbundene Buchstaben ergänzen",
      ru: "Вставьте букву в слово",
      fa: "تکمیل حروف پیوسته",
      tr: "Bitişik harfleri tamamla",
    },
    "اختر الحرف المناسب مكان الخط داخل الكلمة:": {
      en: "Choose the missing letter in the joined word:",
      de: "Wähle den fehlenden Buchstaben im Wort:",
      ru: "Выберите пропущенную букву:",
      fa: "حرف مناسب را انتخاب کنید:",
      tr: "Kelimedeki eksik harfi seç:",
    },
    "لا توجد كلمات عربية مناسبة. اختر قائمة أولاً.": {
      en: "No suitable Arabic words. Choose a list first.",
      de: "Keine passenden Wörter. Wähle zuerst eine Liste.",
      ru: "Нет подходящих слов. Выберите список.",
      fa: "واژه مناسبی نیست. نخست فهرست انتخاب کنید.",
      tr: "Uygun kelime yok. Önce liste seçin.",
    },
    "إظهار / إخفاء الدليل": {
      en: "Show / hide guide",
      de: "Hilfe anzeigen / verbergen",
      ru: "Показать / скрыть подсказку",
      fa: "نمایش / پنهان‌کردن راهنما",
      tr: "Kılavuzu göster / gizle",
    },
    "امسح اللوحة": {
      en: "Clear canvas",
      de: "Zeichenfläche leeren",
      ru: "Очистить поле",
      fa: "پاک‌کردن صفحه",
      tr: "Çizimi temizle",
    },
    "سؤال جديد": {
      en: "New question",
      de: "Neue Frage",
      ru: "Новый вопрос",
      fa: "سؤال جدید",
      tr: "Yeni soru",
    },
    "اختر حرفاً": {
      en: "Choose a letter",
      de: "Buchstaben wählen",
      ru: "Выберите букву",
      fa: "یک حرف انتخاب کنید",
      tr: "Harf seç",
    },
    "اختبار الحروف": {
      en: "Letter quiz",
      de: "Buchstabenquiz",
      ru: "Тест по буквам",
      fa: "آزمون حروف",
      tr: "Harf testi",
    },
    "الحركات والنطق": {
      en: "Vowels and pronunciation",
      de: "Vokalzeichen und Aussprache",
      ru: "Огласовки и произношение",
      fa: "حرکات و تلفظ",
      tr: "Harekeler ve telaffuz",
    },
    "تدرّب على كتابة الحرف": {
      en: "Practice writing the letter",
      de: "Buchstaben schreiben üben",
      ru: "Практика письма",
      fa: "تمرین نوشتن حرف",
      tr: "Harf yazma alıştırması",
    },
    "مثال مصوّر لكل حرف": {
      en: "Illustrated example for each letter",
      de: "Bildbeispiel zu jedem Buchstaben",
      ru: "Пример с картинкой",
      fa: "نمونه تصویری هر حرف",
      tr: "Her harf için görsel örnek",
    },
    "🔊 استمع للكلمة": {
      en: "🔊 Hear the word",
      de: "🔊 Wort anhören",
      ru: "🔊 Слушать слово",
      fa: "🔊 شنیدن کلمه",
      tr: "🔊 Kelimeyi dinle",
    },
    "🔊 استمع للحرف": {
      en: "🔊 Hear the letter",
      de: "🔊 Buchstabe anhören",
      ru: "🔊 Слушать букву",
      fa: "🔊 شنیدن حرف",
      tr: "🔊 Harfi dinle",
    },
  };
  const extra = {
    "اختر لغة التطبيق": "Sprache der App wählen",
    "يمكنك تغيير اللغة لاحقاً": "Du kannst die Sprache später ändern",
    "المعنى بالألمانية:": "Deutsche Bedeutung:",
    "أكمل الحروف الناقصة:": "Ergänze die fehlenden Buchstaben:",
    "الحرف الناقص": "Fehlender Buchstabe",
    "الوقت المتبقي:": "Verbleibende Zeit:",
    ثانية: "Sekunden",
    نجاحات: "Erfolge",
    "عرض النتيجة": "Ergebnis anzeigen",
    "إكمال الحروف الناقصة": "Fehlende Buchstaben ergänzen",
    "أكمل الكلمة العربية:": "Ergänze das arabische Wort:",
    "أكمل الحروف الناقصة تماماً كما في الاختبار الثالث. تظهر الكلمة متصلة وتُحفظ المسافات تلقائياً.":
      "Ergänze die fehlenden Buchstaben genau wie im dritten Test. Das Wort wird in verbundener arabischer Schrift angezeigt; Leerzeichen bleiben erhalten.",
    "الحركات مثل َ ِ ُ ْ ّ لا تُحسب حروفاً ناقصة ولا تحصل على مربع مستقل. اكتب الحرف فقط.":
      "Vokalzeichen zählen nicht als fehlende Buchstaben. Gib nur die Buchstaben ein.",
    "الوقت المتبقي: -- ثانية": "Verbleibende Zeit: -- Sekunden",
    "اختر قائمة جاهزة ضمن مسار التعلّم أو ارفع ملف Excel الخاص بك.":
      "Wähle eine fertige Wortliste oder lade deine eigene Excel-Datei hoch.",
    "كلمات في مراجعة الأخطاء": "Wörter zur Fehlerwiederholung",
    "قوائم متقنة": "Beherrschte Listen",
    "اختبارات مكتملة": "Abgeschlossene Tests",
    "قائمتك الخاصة بدون حد لعدد المفردات": "Eigene Liste ohne Begrenzung",
    "28 حرفاً · صور وأمثلة ونطق وحركات وكتابة واختبار · عربي / Deutsch":
      "28 Buchstaben · Bilder, Beispiele, Aussprache, Vokalzeichen, Schreiben und Quiz · Arabisch / Deutsch",
    "20 قائمة موزعة على المستويين A1 وA2": "20 Listen für A1 und A2",
    "ضع العربية والألمانية في أول عمودين بأي ترتيب. لا يوجد حد لعدد المفردات.":
      "Arabisch und Deutsch in den ersten beiden Spalten, in beliebiger Reihenfolge. Keine Wortbegrenzung.",
    "اختر المستوى ثم الموضوع. تُتقن القائمة عند تحقيق 80٪ أو أكثر مرتين في كل اختبار.":
      "Wähle ein Niveau und ein Thema. Eine Liste gilt als beherrscht, wenn du in jedem Test zweimal mindestens 80 % erreichst.",
    "V12: الإتقان يعتمد على الاختبارات فقط: 80٪ أو أكثر مرتين في كل اختبار، بدون تكرار متباعد.":
      "Beherrschung: zweimal mindestens 80 % in jedem Test.",
    "لا توجد مفردات. اختر قائمة أو ارفع ملف Excel أولاً.":
      "Keine Vokabeln vorhanden. Wähle zuerst eine Liste oder lade eine Excel-Datei hoch.",
    "لم تتم الإجابة": "Keine Antwort",
    "إجابتك:": "Deine Antwort:",
    "الإجابة الصحيحة:": "Richtige Antwort:",
    "صحيح!": "Richtig!",
    "خطأ!": "Falsch!",
    "السؤال:": "Frage:",
    "لا توجد نتيجة محفوظة.": "Keine gespeicherten Ergebnisse.",
    النتيجة: "Ergebnis",
    "مراجعة الأخطاء": "Fehler wiederholen",
    "العودة إلى الصفحة الرئيسية": "Zurück zur Startseite",
    الاستماع: "Hören",
    "ابدأ الاختبار": "Test starten",
    "اختبار الحروف المبعثرة": "Buchstaben sortieren",
    "اختبار الحروف المتصلة": "Verbundene Buchstaben ergänzen",
    "اختر الحرف المناسب مكان الخط داخل الكلمة:":
      "Ergänze die fehlenden Buchstaben im verbundenen Wort:",
    "استمع مرة أخرى": "Noch einmal anhören",
    "استمع إلى الكلمة": "Wort anhören",
    "تقدم الإتقان": "Lernfortschritt",
    "إتقان القائمة": "Liste beherrschen",
    "اختبار كتابة الكلمات": "Wörter schreiben",
    "اكتب الكلمة العربية": "Schreibe das arabische Wort",
    "يمكنك الكتابة بالحركات أو بدونها.":
      "Du kannst mit oder ohne Vokalzeichen schreiben.",
    "اختر الحرف الناقص": "Fehlenden Buchstaben auswählen",
    "أعد المحاولة": "Erneut versuchen",
    تحقق: "Prüfen",
    "الوجه الأول": "Vorderseite",
    "الوجه الثاني": "Rückseite",
    "تغيير اللغة": "Sprache ändern",
    العربية: "Arabisch",
    الألمانية: "Deutsch",
    حرف: "Buchstabe",
    "الكلمة العربية": "Arabisches Wort",
    "الكلمة الألمانية": "Deutsches Wort",
    الوقت: "Zeit",
    الاختبار: "Test",
    "حروف ناقصة": "Fehlende Buchstaben",
    "جميع الحقوق محفوظة": "Alle Rechte vorbehalten",
    "إعادة الامتحان بأسئلة مختلفة": "Test mit anderen Fragen wiederholen",
  };
  const catalogAndScreenTranslations = {
    "التحيات والتعارف": "Begrüßung und Kennenlernen",
    الأسرة: "Familie",
    الأرقام: "Zahlen",
    "الوقت والأيام": "Zeit und Wochentage",
    "الألوان والأشكال": "Farben und Formen",
    البيت: "Haus und Wohnen",
    "الطعام 1": "Essen 1",
    "الطعام 2": "Essen 2",
    "المشروبات والمطعم": "Getränke und Restaurant",
    "الجسم والصحة": "Körper und Gesundheit",
    "المدرسة والتعلّم": "Schule und Lernen",
    "المدينة والأماكن": "Stadt und Orte",
    المواصلات: "Verkehrsmittel",
    "التسوّق والمال": "Einkaufen und Geld",
    "الطقس والطبيعة": "Wetter und Natur",
    "الهوايات والأنشطة": "Hobbys und Aktivitäten",
    "الأفعال الأساسية 1": "Grundverben 1",
    "الأفعال الأساسية 2": "Grundverben 2",
    "الصفات الأساسية": "Grundlegende Adjektive",
    "عبارات يومية مهمة": "Wichtige Alltagsausdrücke",
    "المستوى A1": "Niveau A1",
    "المستوى A2": "Niveau A2",
    المبتدئ: "Anfänger",
    "المبتدئ المتقدم": "Fortgeschrittene Anfänger",
    "أساسيات التواصل والمفردات اليومية الضرورية للبدء باللغة العربية.":
      "Grundlagen der Kommunikation und wichtige Alltagsvokabeln für den Einstieg ins Arabische.",
    "توسيع المفردات للحياة اليومية والدراسة والصحة والأنشطة واستخدام الأفعال والصفات.":
      "Erweiterung des Wortschatzes für Alltag, Lernen, Gesundheit und Aktivitäten sowie Verben und Adjektive.",
    "شرط إتقان هذه القائمة": "Voraussetzungen für den Abschluss dieser Liste",
    "احصل على": "Erreiche",
    "80٪ أو أكثر مرتين": "mindestens zweimal 80 %",
    "في كل اختبار من الاختبارات الستة. لا توجد تقييمات «صعب/جيد/سهل» ولا مواعيد مراجعة.":
      "in jedem der sechs Tests. Es gibt keine Bewertungen „schwer/gut/leicht“ und keine festen Wiederholungstermine.",
    الكتابة: "Schreiben",
    "اختيار من متعدد": "Multiple Choice",
    الاستماع: "Hörtest",
    "الحروف الناقصة": "Fehlende Buchstaben",
    "ترتيب الحروف المبعثرة": "Buchstaben sortieren",
    "إكمال الحروف المتصلة": "Verbundene Buchstaben ergänzen",
    "ابدأ من هنا": "Hier beginnen",
    "متقنة 100٪": "100 % beherrscht",
    "قائمة جاهزة": "Fertige Liste",
    مفردة: "Vokabeln",
    "قوائم متقنة": "Beherrschte Listen",
    مواضيع: "Themen",
    "محاولات إتقان ناجحة": "erfolgreiche Tests",
    "تقدّم نحو الإتقان": "Fortschritt zur Beherrschung",
    إتقان: "Beherrschung",
    "أفضل نتيجة:": "Bestes Ergebnis:",
    "المحاولات:": "Versuche:",
    "لا توجد تقييمات «صعب/جيد/سهل» ولا مواعيد مراجعة.":
      "Keine Einstufungen „schwer/gut/leicht“ und keine festen Wiederholungstermine.",
  };
  Object.assign(extra, {
    "بطاقات التعلّم": "Deine Lernkarten",
    "ابدأ اختباراً": "Wissen testen",
    الإحصائيات: "Mein Fortschritt",
    "استمع إلى النطق": "Aussprache anhören",
    "إذا لم يتوفر صوت عربي على الجهاز، يحاول التطبيق استخدام النطق عبر الإنترنت.":
      "Die Aussprache wird über einen Online-Dienst wiedergegeben.",
    الكتابة: "Schreiben",
    "الاختيار من متعدد": "Multiple Choice",
    "الحروف الناقصة": "Fehlende Buchstaben",
    الاستماع: "Hören",
    "إعداد المعلم:": "Erstellt von",
    "لا توجد مفردات": "Noch keine Wörter ausgewählt",
    "اختر قائمة من الصفحة الرئيسية": "Wähle eine Liste auf der Startseite",
    "السؤال:": "Frage:",
    "إجابتك:": "Deine Antwort:",
    "الإجابة الصحيحة:": "Richtige Antwort:",
    "صحيح!": "Richtig!",
    "خطأ!": "Leider falsch!",
    "قوائم متقنة": "Gemeisterte Listen",
    "إجابات صحيحة": "Richtige Antworten",
    "اختبارات مكتملة": "Abgeschlossene Tests",
    "دقة الإجابات": "Trefferquote",
    "أفضل نتيجة": "Bestes Ergebnis",
    "مفردات تمت دراستها": "Gelernte Wörter",
    "مفردات القائمة الحالية": "Wörter in der aktuellen Liste",
    "كلمات في قائمة الأخطاء": "Wörter zum Wiederholen",
    "نتائج 80٪ أو أكثر": "Tests mit mindestens 80 %",
    "لا توجد نتيجة محفوظة.": "Noch kein Testergebnis gespeichert.",
    إجابتك: "Deine Antwort",
  });
  const locale = { ar: "العربية", de: "Deutsch" };
  const originalTitle = document.title;
  const original = new WeakMap();
  let lang = localStorage.getItem(KEY) === "de" ? "de" : "ar";
  let translating = false;
  function translated(text) {
    if (lang === "ar") return text;
    const exact =
      window.VOCAB_CATALOG_LABELS?.[text] ||
      catalogAndScreenTranslations[text] ||
      extra[text] ||
      (oldTranslations[text] && oldTranslations[text].de);
    if (exact) return exact;
    let m = text.match(/^الوقت المتبقي:\s*(\d+)\s*ثانية$/);
    if (m) return `Verbleibende Zeit: ${m[1]} Sekunden`;
    m = text.match(/^الحرف الناقص\s*(\d+)$/);
    if (m) return `Fehlender Buchstabe ${m[1]}`;
    m = text.match(/^(\d+)\. المعنى بالألمانية:$/);
    if (m) return `${m[1]}. Deutsche Bedeutung:`;
    m = text.match(/^(\d+)\. السؤال:$/);
    if (m) return `${m[1]}. Frage:`;
    m = text.match(/^تقدّم الإتقان:\s*(.*)$/);
    if (m) return `Lernfortschritt: ${m[1]}`;
    m = text.match(/^أجبت بشكل صحيح عن (\d+) من أصل (\d+)\.\s*(.*)$/);
    if (m) return `${m[1]} von ${m[2]} richtig. ${m[3]}`;
    m = text.match(
      /^تمت إضافة (\d+) (?:كلمة|كلمات) إلى قائمة مراجعة الأخطاء\.$/,
    );
    if (m) return `${m[1]} Wörter wurden zur Fehlerwiederholung hinzugefügt.`;
    m = text.match(/^(\d+)\/(\d+) نجاحات$/);
    if (m) return `${m[1]}/${m[2]} Erfolge`;
    m = text.match(/^تم تحميل (\d+) مفردة من الملف بنجاح\.$/);
    if (m) return `${m[1]} Vokabeln erfolgreich geladen.`;

    // Dynamic labels and mastery counters, including all six tests.
    m = text.match(
      /^أكملت (\d+) من أصل (\d+) محاولات (?:إتقان )?ناجحة(?: مطلوبة)?\.?$/,
    );
    if (m)
      return `Du hast ${m[1]} von ${m[2]} erforderlichen erfolgreichen Tests abgeschlossen.`;
    m = text.match(
      /^أكملت (\d+) من أصل (\d+) محاولات إتقان ناجحة\. تمت دراسة (\d+) من أصل (\d+) مفردة\.$/,
    );
    if (m)
      return `${m[1]} von ${m[2]} erfolgreichen Tests abgeschlossen. ${m[3]} von ${m[4]} Vokabeln gelernt.`;
    m = text.match(
      /^القائمة متقنة ✓ — تم اجتياز الشروط الثمانية\. تمت دراسة (\d+) من أصل (\d+) مفردة\.$/,
    );
    if (m) return `Liste beherrscht ✓. ${m[1]} von ${m[2]} Vokabeln gelernt.`;
    m = text.match(
      /^([^\d]+?)\s*(\d+)\s*مفردة\s*·\s*(\d+)\/(\d+)\s*محاولات إتقان ناجحة$/,
    );
    if (m)
      return `${translated(m[1].trim())} ${m[2]} Vokabeln · ${m[3]}/${m[4]} erfolgreiche Tests`;
    m = text.match(/^(\d+) مفردة · (\d+)\/(\d+) محاولات إتقان ناجحة$/);
    if (m) return `${m[1]} Vokabeln · ${m[2]}/${m[3]} erfolgreiche Tests`;
    m = text.match(/^(\d+) مواضيع · (\d+) مفردة · (\d+)\/(\d+) قوائم متقنة$/);
    if (m)
      return `${m[1]} Themen · ${m[2]} Vokabeln · ${m[3]}/${m[4]} beherrschte Listen`;
    m = text.match(/^(\d+)[٪%] تقدّم نحو الإتقان$/);
    if (m) return `${m[1]} % Fortschritt zur Beherrschung`;
    m = text.match(/^(\d+)[٪%] تقدّم$/);
    if (m) return `${m[1]} % Fortschritt`;
    m = text.match(/^(\d+)[٪%] إتقان$/);
    if (m) return `${m[1]} % beherrscht`;
    m = text.match(/^أفضل نتيجة: (\d+)[٪%] · المحاولات: (\d+)$/);
    if (m) return `Bestes Ergebnis: ${m[1]} % · Versuche: ${m[2]}`;
    m = text.match(/^تقدّم الإتقان: (\d+)\/(\d+) \((\d+)[٪%]\)$/);
    if (m) return `Lernfortschritt: ${m[1]}/${m[2]} (${m[3]} %)`;
    m = text.match(
      /^🎉 تم إتقان هذه القائمة: حققت شرط 80٪ مرتين في جميع الاختبارات الستة\.$/,
    );
    if (m)
      return "🎉 Liste beherrscht: In allen sechs Tests zweimal mindestens 80 % erreicht.";
    m = text.match(/^هذه القائمة متقنة 100[٪%]$/);
    if (m) return "Diese Liste ist zu 100 % beherrscht";
    m = text.match(/^(\d+)\/(\d+) نجاحات$/);
    if (m) return `${m[1]}/${m[2]} Erfolge`;
    m = text.match(/^(\d+) مفردة$/);
    if (m) return `${m[1]} Vokabeln`;
    m = text.match(/^(.+?) · (\d+) مفردة$/);
    if (m) return `${translated(m[1])} · ${m[2]} Vokabeln`;
    m = text.match(/^(.+?) · (المبتدئ|المبتدئ المتقدم)$/);
    if (m) return `${translated(m[1])} · ${translated(m[2])}`;
    return text;
  }
  function translate() {
    if (translating) return;
    translating = true;
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const parent = node.parentElement;
        if (
          !parent ||
          parent.closest(
            'script,style,textarea,option,.arabic-word-box,#front,.front,.arabic-text,.scramble-answer,.scramble-tiles,.connected-word,.connected-choices,.german-text,.letter-forms,.letters-big,.letter-card-image,#letter-card-word,#example-word,#quiz-options,[lang="ar"]:not(html)',
          )
        )
          return;
        let record = original.get(node);
        if (!record) {
          record = { source: node.nodeValue, shown: node.nodeValue };
          original.set(node, record);
        } else if (node.nodeValue !== record.shown) {
          record = { source: node.nodeValue, shown: node.nodeValue };
          original.set(node, record);
        }
        const source = record.source;
        const match = source.match(/^(\s*)([\s\S]*?)(\s*)$/);
        if (!match) return;
        const core = match[2];
        if (!core) return;
        // Patterns with dynamic prefixes in one node.
        let value = translated(core);
        if (value === core && lang === "de") {
          value = core
            .replace(/المعنى بالألمانية:/g, "Deutsche Bedeutung:")
            .replace(/الوقت المتبقي:/g, "Verbleibende Zeit:");
        }
        const expected = match[1] + value + match[3];
        if (node.nodeValue !== expected) node.nodeValue = expected;
        record.shown = expected;
      });
      for (const el of document.querySelectorAll(
        "input[placeholder],button[title],input[aria-label]",
      )) {
        for (const attr of ["placeholder", "title", "aria-label"]) {
          if (!el.hasAttribute(attr)) continue;
          const key =
            "localeOriginal" +
            attr.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          if (!el.dataset[key]) el.dataset[key] = el.getAttribute(attr);
          el.setAttribute(attr, translated(el.dataset[key]));
        }
      }
      document.title = translated(originalTitle);
    } finally {
      translating = false;
    }
  }
  function setLang(newLang) {
    lang = newLang === "de" ? "de" : "ar";
    localStorage.setItem(KEY, lang);
    document
      .querySelectorAll("[data-language-picker]")
      .forEach((e) => (e.value = lang));
    translate();
    window.dispatchEvent(
      new CustomEvent("app-language-change", { detail: { lang } }),
    );
    document.getElementById("language-welcome")?.remove();
  }
  function setup() {
    const bar = document.createElement("aside");
    bar.className = "app-language-bar";
    const label = document.createElement("label");
    label.textContent = "🌐";
    label.htmlFor = "app-language-select";
    const select = document.createElement("select");
    select.id = "app-language-select";
    select.dataset.languagePicker = "1";
    select.setAttribute("aria-label", "Sprache / اللغة");
    Object.entries(locale).forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      select.append(option);
    });
    select.value = lang;
    select.addEventListener("change", (e) => setLang(e.target.value));
    bar.append(label, select);
    document.body.prepend(bar);
    if (!localStorage.persistent) {
      const notice = document.createElement("p");
      notice.className = "storage-notice";
      notice.setAttribute("role", "status");
      notice.dataset.ar =
        "يمكنك متابعة التدرّب، لكن التقدّم مؤقت لأن المتصفح لا يسمح بحفظه. افتح التطبيق مباشرة في Chrome للسماح بالحفظ.";
      notice.dataset.de =
        "Du kannst weiterüben. Dein Fortschritt ist vorübergehend, weil der Browser das Speichern blockiert. Öffne die App direkt in Chrome, um das Speichern zu erlauben.";
      notice.textContent = notice.dataset[lang];
      document.querySelector("main")?.prepend(notice);
    }
    if (
      ["", "index.html"].includes(location.pathname.split("/").pop()) &&
      !localStorage.getItem(KEY)
    ) {
      const cover = document.createElement("div");
      cover.id = "language-welcome";
      cover.className = "language-welcome";
      const panel = document.createElement("div");
      panel.className = "language-welcome-panel";
      const title = document.createElement("h2");
      title.textContent = "اختر لغة التطبيق / Sprache wählen";
      const help = document.createElement("p");
      help.textContent =
        "يمكنك تغيير اللغة لاحقاً / Du kannst die Sprache später ändern";
      const actions = document.createElement("div");
      actions.className = "language-start-grid";
      Object.entries(locale).forEach(([code, name]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = name;
        button.addEventListener("click", () => setLang(code));
        actions.append(button);
      });
      panel.append(title, help, actions);
      cover.append(panel);
      document.body.append(cover);
    }
    translate();
    new MutationObserver((events) => {
      if (
        !translating &&
        events.some(
          (e) =>
            (e.type === "childList" && e.addedNodes.length) ||
            e.type === "characterData",
        )
      )
        translate();
    }).observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    window.addEventListener("pageshow", () => {
      translate();
      window.dispatchEvent(
        new CustomEvent("app-language-change", { detail: { lang } }),
      );
    });
  }
  document.addEventListener("DOMContentLoaded", setup);
  window.AppLanguage = { translate, get: () => lang, t: translated };
})();
// Additional dynamic text for the retake action is registered through the existing translation engine.
