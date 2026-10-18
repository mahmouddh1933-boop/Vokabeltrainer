(() => {
  "use strict";
  const bi = (ar, de) => ({ ar, de });
  const ex = (ar, de, focus = "", note = null) => ({ ar, de, focus, note });
  const ar = (text) => ({ text, lang: "ar" });
  const verbData =
    typeof module !== "undefined" && module.exports
      ? require("./verb-data.js")
      : window.VerbLessonData;
  const sunLetters = Array.from("تثدذرزسشصضطظلن");
  const moonLetters = Array.from("أبجحخعغفقكمهوي");
  const basicVerbs = [
    ...verbData.verbs
      .filter((v) =>
        ["write", "study", "open", "drink", "play", "hear"].includes(v.id),
      )
      .map((v) => ({
        past: verbData.conjugate(v, "past", verbData.pronouns[8]),
        present: verbData.conjugate(v, "present", verbData.pronouns[8]),
        meaning: v.meaning,
      })),
    { past: "ذَهَبَ", present: "يَذْهَبُ", meaning: bi("الذهاب", "gehen") },
    { past: "قَرَأَ", present: "يَقْرَأُ", meaning: bi("القراءة", "lesen") },
    { past: "أَكَلَ", present: "يَأْكُلُ", meaning: bi("الأكل", "essen") },
    { past: "نَامَ", present: "يَنَامُ", meaning: bi("النوم", "schlafen") },
    {
      past: "جَلَسَ",
      present: "يَجْلِسُ",
      meaning: bi("الجلوس", "sitzen / sich setzen"),
    },
    {
      past: "وَقَفَ",
      present: "يَقِفُ",
      meaning: bi("الوقوف", "stehen / stehen bleiben"),
    },
  ];
  const lessons = [
    {
      id: "sun-moon",
      glyph: "الـ",
      title: bi("اللام الشمسية والقمرية", "Sonnen- und Mondbuchstaben"),
      summary: bi(
        "نتعلّم متى ننطق اللام في «الـ» ومتى ندغمها.",
        "Wann wird das Lām in „al-“ gesprochen und wann angeglichen?",
      ),
      intro: bi(
        "نضيف «الـ» إلى الاسم لنجعله معرّفاً، مثل «قمر ← القمر». تُكتب اللام دائماً، لكن نطقها يتغيّر بحسب الحرف الذي يأتي بعدها.",
        "Der Artikel „al-“ macht ein Nomen bestimmt: „Mond“ wird zu „der Mond“. Das Lām wird immer geschrieben. Ob es gesprochen wird, hängt vom nächsten Buchstaben ab.",
      ),
      sections: [
        {
          title: bi(
            "اللام القمرية: نكتبها وننطقها",
            "Mondbuchstaben: Das Lām wird gesprochen",
          ),
          body: bi(
            "نُنطق اللام الساكنة بوضوح قبل الحرف القمري، ولا نضع شدة على الحرف التالي بسبب «الـ».",
            "Vor einem Mondbuchstaben wird das Lām mit Sukūn deutlich gesprochen. Der Artikel verursacht keine Schadda auf dem nächsten Buchstaben.",
          ),
          letters: moonLetters,
          examples: [
            ex("الْقَمَرُ", "der Mond", "لْ"),
            ex("الْكِتَابُ", "das Buch", "لْ"),
            ex("الْبَيْتُ", "das Haus", "لْ"),
          ],
        },
        {
          title: bi(
            "اللام الشمسية: نكتبها ولا ننطقها",
            "Sonnenbuchstaben: Das Lām wird angeglichen",
          ),
          body: bi(
            "تُدغم اللام في الحرف الشمسي بعدها، فيُشدَّد ذلك الحرف. تبقى اللام مكتوبة، لكننا لا ننطقها صوتاً مستقلاً.",
            "Das Lām wird dem folgenden Sonnenbuchstaben angeglichen. Dieser erhält eine Schadda und wird doppelt gesprochen; das geschriebene Lām hat keinen eigenen Laut.",
          ),
          letters: sunLetters,
          examples: [
            ex("الشَّمْسُ", "die Sonne", "شَّ"),
            ex("الطَّالِبُ", "der Schüler", "طَّ"),
            ex("النَّجْمُ", "der Stern", "نَّ"),
            ex("اللَّيْلُ", "die Nacht", "لَّ"),
          ],
        },
      ],
      takeaway: bi(
        "الحروف الشمسية ١٤، والقمرية ١٤. الاختلاف في النطق، أمّا «الـ» فتبقى مكتوبة في الحالتين.",
        "Es gibt 14 Sonnen- und 14 Mondbuchstaben. Die Aussprache unterscheidet sich, geschrieben wird „al-“ in beiden Fällen.",
      ),
      questions: [
        {
          prompt: bi(
            "أي كلمة فيها لام شمسية؟",
            "Welches Wort hat ein angeglichenes Lām?",
          ),
          options: ["الشَّمْسُ", "الْقَمَرُ", "الْكِتَابُ", "الْبَابُ"],
          correct: 0,
          explanation: bi(
            "الشين حرف شمسي؛ لا ننطق اللام مستقلة، ونشدّد الشين.",
            "Schīn ist ein Sonnenbuchstabe: Das Lām wird angeglichen, das Schīn verdoppelt.",
          ),
        },
        {
          prompt: bi(
            "في أي كلمة ننطق اللام بوضوح؟",
            "In welchem Wort wird das Lām deutlich gesprochen?",
          ),
          options: ["النَّجْمُ", "الشَّارِعُ", "الْبَيْتُ", "الطَّالِبُ"],
          correct: 2,
          explanation: bi(
            "الباء حرف قمري؛ لذلك ننطق لام «الْبَيْت».",
            "Bā ist ein Mondbuchstabe. Deshalb wird das Lām in „al-bait“ gesprochen.",
          ),
        },
        {
          prompt: bi(
            "أي مجموعة كل حروفها شمسية؟",
            "Welche Gruppe besteht nur aus Sonnenbuchstaben?",
          ),
          options: ["ب ج ح", "ت س ن", "ق ك م", "ع غ ف"],
          correct: 1,
          explanation: bi(
            "التاء والسين والنون حروف شمسية.",
            "Tā, Sīn und Nūn sind Sonnenbuchstaben.",
          ),
        },
        {
          prompt: bi(
            "ما العلامة التي نضعها على الحرف الشمسي بعد اللام؟",
            "Welches Zeichen steht auf dem Sonnenbuchstaben nach dem Lām?",
          ),
          options: [
            bi("السكون", "Sukūn"),
            bi("التنوين", "Tanwīn"),
            bi("الشدة", "Schadda"),
            bi("المدّة", "Madda"),
          ],
          correct: 2,
          explanation: bi(
            "الشدة تدلّ على تضعيف الحرف الشمسي، مثل الشين في «الشَّمْس».",
            "Die Schadda zeigt die Verdoppelung an, etwa beim Schīn in „aš-šams“.",
          ),
        },
      ],
    },
    {
      id: "pronouns",
      glyph: "أنا",
      title: bi("الضمائر", "Pronomen"),
      summary: bi(
        "من يتكلّم؟ ومن نخاطب؟ وعمّن نتحدّث؟",
        "Wer spricht, wer wird angesprochen und über wen sprechen wir?",
      ),
      intro: bi(
        "الضمير كلمة نستخدمها بدلاً من الاسم، مثل «سارة طالبة ← هي طالبة». نبدأ هنا بضمائر الرفع المنفصلة، ثم نتعرّف على بعض الضمائر المتصلة الدالّة على الملكية.",
        "Ein Pronomen steht anstelle eines Namens: „Sara ist Schülerin“ wird zu „Sie ist Schülerin“. Hier lernst du selbstständige Personalpronomen und einige angehängte Possessivpronomen.",
      ),
      sections: [
        {
          title: bi("ضمائر الرفع المنفصلة", "Selbstständige Personalpronomen"),
          body: bi(
            "أنا ونحن للمتكلّم، وأنتَ وأنتِ وما يتفرّع عنهما للمخاطب، وهو وهي وما يتفرّع عنهما للغائب.",
            "„Ich“ und „wir“ bezeichnen die Sprechenden, die Formen von „du/ihr“ die Angesprochenen und „er/sie“ die Personen, über die gesprochen wird.",
          ),
          table: {
            headers: [bi("الضمير", "Pronomen"), bi("الاستخدام", "Verwendung")],
            rows: verbData.pronouns.map((p) => [
              ar(p.ar),
              bi(p.description, p.de),
            ]),
          },
        },
        {
          title: bi("الضمير داخل الجملة", "Pronomen im Satz"),
          body: bi(
            "نختار الضمير بحسب الشخص والعدد والجنس. «أنتما» للمثنّى المذكّر والمؤنّث، و«هما» للغائبين أو الغائبتين.",
            "Die Wahl hängt von Person, Anzahl und Geschlecht ab. „Antumā“ gilt für zwei Angesprochene beider Geschlechter; „humā“ für zwei Personen, über die gesprochen wird.",
          ),
          examples: [
            ex("أَنَا طَالِبٌ.", "Ich bin Schüler.", "أَنَا"),
            ex("هِيَ طَالِبَةٌ.", "Sie ist Schülerin.", "هِيَ"),
            ex(
              "نَحْنُ نَتَعَلَّمُ الْعَرَبِيَّةَ.",
              "Wir lernen Arabisch.",
              "نَحْنُ",
            ),
            ex("أَنْتُنَّ مُعَلِّمَاتٌ.", "Ihr seid Lehrerinnen.", "أَنْتُنَّ"),
          ],
        },
        {
          title: bi(
            "ضمائر متصلة تدلّ على الملكية",
            "Angehängte Possessivpronomen",
          ),
          body: bi(
            "قد يتصل الضمير بالاسم ليبيّن صاحبه. لاحظ الفرق بين كِتَابُكَ للمخاطب المذكّر وكِتَابُكِ للمخاطبة المؤنّثة.",
            "Angehängte Pronomen zeigen, wem etwas gehört. Beachte den Unterschied zwischen „kitābuka“ für einen männlichen und „kitābuki“ für einen weiblichen Angesprochenen.",
          ),
          examples: [
            ex("كِتَابِي", "mein Buch", "ي"),
            ex("كِتَابُكَ", "dein Buch · männlich", "كَ"),
            ex("كِتَابُكِ", "dein Buch · weiblich", "كِ"),
            ex("كِتَابُنَا", "unser Buch", "نَا"),
            ex("كِتَابُهُ", "sein Buch", "هُ"),
            ex("كِتَابُهَا", "ihr Buch", "هَا"),
          ],
        },
      ],
      takeaway: bi(
        "الضمير والفعل يتوافقان: أنا أكتب، نحن نكتب، هي تكتب. يمكنك متابعة ذلك في درس تصريف الأفعال.",
        "Pronomen und Verb passen zusammen: anā aktubu, naḥnu naktubu, hiya taktubu. Übe das im Konjugationskurs.",
      ),
      questions: [
        {
          prompt: bi(
            "أي ضمير نخاطب به جماعة من الإناث؟",
            "Mit welchem Pronomen sprichst du eine Gruppe von Frauen an?",
          ),
          options: ["أَنْتُمْ", "هُنَّ", "أَنْتُنَّ", "هِيَ"],
          correct: 2,
          explanation: bi(
            "أنتنّ للمخاطبات، أمّا هنّ فللغائبات.",
            "„Antunna“ spricht die Gruppe direkt an; „hunna“ bezeichnet eine abwesende Gruppe.",
          ),
        },
        {
          prompt: bi(
            "أي ضمير يدلّ على شخصين نتحدّث عنهما؟",
            "Welches Pronomen bezeichnet zwei Personen, über die wir sprechen?",
          ),
          options: ["هُمَا", "هُمْ", "أَنْتَ", "أَنَا"],
          correct: 0,
          explanation: bi(
            "هما ضمير الغائب المثنّى، للمذكّر والمؤنّث.",
            "„Humā“ bezeichnet genau zwei Personen in der dritten Person.",
          ),
        },
        {
          prompt: bi("ما معنى «كِتَابِي»؟", "Was bedeutet „kitābī“?"),
          options: [
            bi("كتابه", "sein Buch"),
            bi("كتابك", "dein Buch"),
            bi("كتابنا", "unser Buch"),
            bi("الكتاب الذي أملكه", "mein Buch"),
          ],
          correct: 3,
          explanation: bi(
            "الياء في آخر «كتابي» تدلّ على ملكية المتكلّم.",
            "Das angehängte Yā in „kitābī“ bedeutet „mein“.",
          ),
        },
        {
          prompt: bi(
            "اختر الضمير المناسب: ___ نتعلّم العربية.",
            "Wähle das passende Pronomen: ___ lernen Arabisch (nataʿallamu).",
          ),
          options: ["هُوَ", "نَحْنُ", "أَنْتِ", "أَنَا"],
          correct: 1,
          explanation: bi(
            "نحن نتعلّم: الضمير نحن يتوافق مع الفعل نتعلّم.",
            "„Naḥnu nataʿallamu“ bedeutet „wir lernen“.",
          ),
        },
      ],
    },
    {
      id: "gender",
      glyph: "ة",
      title: bi("المذكّر والمؤنّث", "Maskulin und feminin"),
      summary: bi(
        "تمييز جنس الاسم ومطابقة الصفة واسم الإشارة.",
        "Das grammatische Geschlecht erkennen und Wörter passend verwenden.",
      ),
      intro: bi(
        "الأسماء في العربية مذكّرة أو مؤنّثة. يظهر ذلك في اسم الإشارة والصفة: «هذا كتاب جديد» و«هذه سيارة جديدة». وقد يكون الجنس طبيعياً أو لغوياً.",
        "Arabische Nomen sind maskulin oder feminin. Das zeigt sich bei Demonstrativpronomen und Adjektiven: „dieses neue Buch“ und „dieses neue Auto“. Das Geschlecht kann natürlich oder rein grammatisch sein.",
      ),
      sections: [
        {
          title: bi(
            "علامة شائعة: التاء المربوطة",
            "Ein häufiges Zeichen: Tā marbūṭa",
          ),
          body: bi(
            "تنتهي أسماء مؤنّثة كثيرة بالتاء المربوطة «ة»، مثل مدرسة وسيارة. ونحوّل صفات كثيرة من المذكّر إلى المؤنّث بإضافة «ة»: جديد ← جديدة.",
            "Viele feminine Nomen enden auf „ة“, etwa Schule und Auto. Auch viele Adjektive bilden die feminine Form mit „ة“: ǧadīd → ǧadīda.",
          ),
          examples: [
            ex("مُعَلِّمٌ ← مُعَلِّمَةٌ", "Lehrer → Lehrerin", "ةٌ"),
            ex("طَالِبٌ ← طَالِبَةٌ", "Schüler → Schülerin", "ةٌ"),
            ex("مَدْرَسَةٌ", "Schule", "ةٌ"),
            ex("سَيَّارَةٌ", "Auto", "ةٌ"),
          ],
        },
        {
          title: bi("اسم الإشارة والصفة", "Demonstrativpronomen und Adjektiv"),
          body: bi(
            "نستخدم «هذا» مع المفرد المذكّر و«هذه» مع المفرد المؤنّث. وتوافق الصفة الاسم في التذكير والتأنيث.",
            "Für ein maskulines Nomen im Singular verwenden wir „hāḏā“, für ein feminines „hāḏihi“. Das Adjektiv stimmt im Geschlecht mit dem Nomen überein.",
          ),
          examples: [
            ex("هَذَا كِتَابٌ جَدِيدٌ.", "Das ist ein neues Buch.", "هَذَا"),
            ex(
              "هَذِهِ سَيَّارَةٌ جَدِيدَةٌ.",
              "Das ist ein neues Auto.",
              "هَذِهِ",
            ),
            ex(
              "هَذَا طَالِبٌ مُجْتَهِدٌ.",
              "Das ist ein fleißiger Schüler.",
              "مُجْتَهِدٌ",
            ),
            ex(
              "هَذِهِ طَالِبَةٌ مُجْتَهِدَةٌ.",
              "Das ist eine fleißige Schülerin.",
              "مُجْتَهِدَةٌ",
            ),
          ],
        },
        {
          title: bi(
            "انتبه: ليست التاء المربوطة قاعدة مطلقة",
            "Wichtig: Die Endung ist keine ausnahmslose Regel",
          ),
          body: bi(
            "بعض الأسماء مؤنّثة من دون «ة»، مثل شمس وأرض وبنت. وبعض أسماء الذكور تنتهي بـ«ة»، مثل حمزة وأسامة. والهاء «ه» ليست تاء مربوطة: «وجه» اسم مذكّر.",
            "Einige feminine Wörter haben kein „ة“, z. B. Sonne, Erde und Mädchen. Männliche Namen wie Ḥamza und Usāma können auf „ة“ enden. „ه“ ist kein Tā marbūṭa: „Gesicht“ ist maskulin.",
          ),
          examples: [
            ex("هَذِهِ شَمْسٌ.", "Das ist eine Sonne.", "شَمْسٌ"),
            ex("هَذَا وَجْهٌ.", "Das ist ein Gesicht.", "هٌ"),
            ex("حَمْزَةُ طَالِبٌ.", "Hamza ist Schüler.", "حَمْزَةُ"),
          ],
        },
      ],
      takeaway: bi(
        "احفظ الاسم مع جنسه ومثال قصير، ولا تعتمد على شكل النهاية وحده.",
        "Lerne Nomen zusammen mit ihrem Geschlecht und einem kurzen Beispiel; die Endung allein reicht nicht immer.",
      ),
      questions: [
        {
          prompt: bi(
            "أكمل: ___ طالبة مجتهدة.",
            "Ergänze: ___ ist eine fleißige Schülerin.",
          ),
          options: ["هَذَا", "هَذِهِ", "هَؤُلَاءِ", "هَذَانِ"],
          correct: 1,
          explanation: bi(
            "طالبة مفرد مؤنّث، لذلك نستخدم هذه.",
            "„Ṭāliba“ ist feminin und Singular: „hāḏihi“.",
          ),
        },
        {
          prompt: bi(
            "كلمة «شمس» في العربية هي:",
            "Welches grammatische Geschlecht hat „Sonne“ im Arabischen?",
          ),
          options: [
            bi("مذكّر", "maskulin"),
            bi("مثنّى", "Dual"),
            bi("مؤنّث", "feminin"),
            bi("جمع", "Plural"),
          ],
          correct: 2,
          explanation: bi(
            "شمس مؤنّث رغم عدم وجود التاء المربوطة.",
            "„Šams“ ist feminin, obwohl es nicht auf Tā marbūṭa endet.",
          ),
        },
        {
          prompt: bi("أي جملة صحيحة؟", "Welcher Satz ist richtig?"),
          options: [
            "هَذَا سَيَّارَةٌ.",
            "هَذِهِ كِتَابٌ.",
            "هَذَا وَجْهٌ.",
            "هَذَا طَالِبَةٌ.",
          ],
          correct: 2,
          explanation: bi(
            "وجه مذكّر وينتهي بهاء، وليس بتاء مربوطة.",
            "„Waǧh“ ist maskulin. Sein letzter Buchstabe ist Hā, kein Tā marbūṭa.",
          ),
        },
        {
          prompt: bi(
            "اسم «حمزة» يدلّ هنا على:",
            "Der Vorname „Hamza“ bezeichnet hier:",
          ),
          options: [
            bi("شخص مذكّر", "eine männliche Person"),
            bi("شخص مؤنّث", "eine weibliche Person"),
            bi("مثنّى", "zwei Personen"),
            bi("جمع", "eine Mehrzahl"),
          ],
          correct: 0,
          explanation: bi(
            "حمزة اسم مذكّر، مع أنه ينتهي بتاء مربوطة.",
            "Hamza ist ein männlicher Name trotz der Endung „ة“.",
          ),
        },
      ],
    },
    {
      id: "number",
      glyph: "١ ٢ ٣",
      title: bi("المفرد والمثنّى والجمع", "Singular, Dual und Plural"),
      summary: bi(
        "واحد، اثنان، ثلاثة فأكثر: كيف يتغيّر الاسم؟",
        "Eins, zwei, drei oder mehr: Wie verändert sich das Nomen?",
      ),
      intro: bi(
        "للاسم في العربية ثلاث حالات من حيث العدد: المفرد لواحد، والمثنّى لاثنين، والجمع لثلاثة فأكثر. تعرّف أولاً على الفرق، ثم لاحظ علامات كل صيغة.",
        "Arabisch unterscheidet drei Numeri: Singular für eins, Dual für genau zwei und Plural für drei oder mehr. Lerne zuerst den Unterschied und dann die typischen Formen.",
      ),
      sections: [
        {
          title: bi(
            "من واحد إلى اثنين إلى أكثر",
            "Von einem zu zweien und mehreren",
          ),
          body: bi(
            "قلم اسم مفرد، وقلمان مثنّى، وأقلام جمع. ليست كل صيغ الجمع مشتقّة بإضافة نهاية واحدة.",
            "Qalam ist Singular, qalamān Dual und aqlām Plural. Nicht jeder Plural entsteht durch dieselbe Endung.",
          ),
          table: {
            headers: [
              bi("مفرد", "Singular"),
              bi("مثنّى مرفوع", "Dual · Nominativ"),
              bi("جمع", "Plural"),
            ],
            rows: [
              [ar("قَلَمٌ"), ar("قَلَمَانِ"), ar("أَقْلَامٌ")],
              [ar("كِتَابٌ"), ar("كِتَابَانِ"), ar("كُتُبٌ")],
              [ar("مُعَلِّمَةٌ"), ar("مُعَلِّمَتَانِ"), ar("مُعَلِّمَاتٌ")],
              [ar("مُعَلِّمٌ"), ar("مُعَلِّمَانِ"), ar("مُعَلِّمُونَ")],
            ],
          },
        },
        {
          title: bi("المثنّى: ـانِ أو ـيْنِ", "Dual: -āni oder -aini"),
          body: bi(
            "نضيف «انِ» في الرفع و«يْنِ» في النصب والجرّ. تتحوّل التاء المربوطة إلى تاء عند التثنية: مدرسة ← مدرستان.",
            "Der Dual erhält „-āni“ im Nominativ und „-aini“ im Akkusativ und Genitiv. Tā marbūṭa wird vor der Endung zu Tā: madrasa → madrasatān.",
          ),
          examples: [
            ex("هَذَانِ كِتَابَانِ.", "Das sind zwei Bücher.", "انِ"),
            ex("قَرَأْتُ كِتَابَيْنِ.", "Ich las zwei Bücher.", "يْنِ"),
            ex(
              "فِي الْحَيِّ مَدْرَسَتَانِ.",
              "Im Viertel gibt es zwei Schulen.",
              "تَانِ",
            ),
          ],
        },
        {
          title: bi("ثلاثة أنواع شائعة للجمع", "Drei häufige Pluraltypen"),
          body: bi(
            "جمع المذكّر السالم: معلّمون في الرفع ومعلّمين في النصب والجرّ. جمع المؤنّث السالم ينتهي بـ«ات»، مثل معلّمات. جمع التكسير يغيّر بناء الكلمة، مثل كتاب ← كتب.",
            "Der regelmäßige maskuline Plural endet im Nominativ auf „-ūna“, sonst auf „-īna“. Der regelmäßige feminine Plural hat „-āt“, z. B. muʿallimāt. Der gebrochene Plural verändert den Wortstamm: kitāb → kutub.",
          ),
          examples: [
            ex(
              "مُعَلِّمُونَ / مُعَلِّمِينَ",
              "Lehrer · regelmäßiger maskuliner Plural",
              "ونَ",
            ),
            ex(
              "مُعَلِّمَاتٌ",
              "Lehrerinnen · regelmäßiger femininer Plural",
              "اتٌ",
            ),
            ex(
              "كِتَابٌ ← كُتُبٌ",
              "Buch → Bücher · gebrochener Plural",
              "كُتُبٌ",
            ),
          ],
        },
        {
          title: bi("جمع غير العاقل", "Nichtmenschliche Plurale"),
          body: bi(
            "نعامل جمع غير العاقل غالباً معاملة المفرد المؤنّث في الصفة واسم الإشارة: فنقول: «هذه كتب جديدة».",
            "Nichtmenschliche Plurale werden bei Adjektiven und Demonstrativpronomen meist wie ein feminines Singular behandelt: hāḏihi kutubun ǧadīdatun.",
          ),
          examples: [
            ex(
              "هَذِهِ كُتُبٌ جَدِيدَةٌ.",
              "Das sind neue Bücher.",
              "جَدِيدَةٌ",
            ),
          ],
        },
      ],
      takeaway: bi(
        "احفظ جمع الاسم معه، ولا تفترض أن كل جمع ينتهي بـ«ون» أو «ات».",
        "Lerne die Pluralform zusammen mit dem Nomen. Nicht jeder Plural endet auf „-ūn“ oder „-āt“.",
      ),
      questions: [
        {
          prompt: bi(
            "على كم كتاب تدلّ كلمة «كتابان»؟",
            "Wie viele Bücher bezeichnet „kitābān“?",
          ),
          options: [
            bi("واحد", "eins"),
            bi("اثنان", "zwei"),
            bi("ثلاثة", "drei"),
            bi("أربعة", "vier"),
          ],
          correct: 1,
          explanation: bi(
            "كتابان صيغة المثنّى، وهي لاثنين.",
            "„Kitābān“ ist Dual und bezeichnet genau zwei Bücher.",
          ),
        },
        {
          prompt: bi("ما جمع «كتاب»؟", "Wie lautet der Plural von „kitāb“?"),
          options: ["كِتَابَانِ", "كِتَابَيْنِ", "كُتُبٌ", "كِتَابٌ"],
          correct: 2,
          explanation: bi(
            "كتب جمع تكسير؛ أما كتابان وكتابين فمثنّى.",
            "„Kutub“ ist ein gebrochener Plural. „Kitābān“ und „kitābain“ sind Dualformen.",
          ),
        },
        {
          prompt: bi(
            "اختر جمع المذكّر السالم المرفوع لكلمة «معلّم».",
            "Wähle den regelmäßigen maskulinen Plural im Nominativ von „Lehrer“.",
          ),
          options: [
            "مُعَلِّمَاتٌ",
            "مُعَلِّمَانِ",
            "مُعَلِّمِينَ",
            "مُعَلِّمُونَ",
          ],
          correct: 3,
          explanation: bi(
            "معلّمون بالواو والنون في الرفع؛ ومعلّمين بالياء والنون في النصب والجرّ.",
            "Im Nominativ steht „muʿallimūna“, im Akkusativ und Genitiv „muʿallimīna“.",
          ),
        },
        {
          prompt: bi("أكمل: هذه كتب ___.", "Ergänze: Das sind ___ Bücher."),
          options: ["جَدِيدَةٌ", "جَدِيدٌ", "جَدِيدَانِ", "جُدُدٌ"],
          correct: 0,
          explanation: bi(
            "كتب جمع غير عاقل، فتأتي صفته مفردة مؤنّثة: جديدة.",
            "„Bücher“ ist ein nichtmenschlicher Plural. Das Adjektiv steht feminin Singular: ǧadīda.",
          ),
        },
      ],
    },
    {
      id: "basic-verbs",
      glyph: "فَعَلَ",
      title: bi("الأفعال الأساسية", "Grundlegende Verben"),
      summary: bi(
        "١٢ فعلاً للقراءة والأكل والذهاب وأنشطة يومك.",
        "12 Verben für Lesen, Essen, Unterwegssein und deinen Alltag.",
      ),
      intro: bi(
        "الفعل يعبّر عن حدث. احفظ كل فعل بصيغتي الماضي والمضارع ومعناه، ثم استخدمه في جملة قصيرة. الصيغتان في الجدول مع الضمير «هو».",
        "Ein Verb beschreibt eine Handlung oder ein Geschehen. Lerne jedes Verb mit Perfekt, Präsens und Bedeutung und verwende es in einem kurzen Satz. Die Grundformen in der Tabelle gehören zum Pronomen „er“.",
      ),
      sections: [
        {
          title: bi("أفعال تحتاجها كل يوم", "Verben für jeden Tag"),
          body: bi(
            "اقرأ الماضي والمضارع معاً. انتبه إلى تغيّر الحركات، وإلى حذف الواو في «وقف ← يقف».",
            "Lies Perfekt und Präsens zusammen. Achte auf die Stammvokale und darauf, dass bei waqafa → yaqifu das Wāw entfällt.",
          ),
          table: {
            headers: [
              bi("الماضي · هو", "Perfekt · er"),
              bi("المضارع · هو", "Präsens · er"),
              bi("المعنى", "Bedeutung"),
            ],
            rows: basicVerbs.map((v) => [ar(v.past), ar(v.present), v.meaning]),
          },
        },
        {
          title: bi("استخدم الفعل في جملة", "Verwende das Verb in einem Satz"),
          body: bi(
            "مع «أنا» تتغيّر بداية المضارع، وقد يتغيّر بناء الفعل أيضاً: أنا أكتب، أنا آكل، أنا أقف.",
            "Mit „ich“ verändert sich die Vorsilbe, manchmal auch der Stamm: anā aktubu, anā ākulu, anā aqifu.",
          ),
          examples: [
            ex(
              "أَنَا أَكْتُبُ رِسَالَةً.",
              "Ich schreibe einen Brief.",
              "أَكْتُبُ",
            ),
            ex("أَنَا أَشْرَبُ الْمَاءَ.", "Ich trinke Wasser.", "أَشْرَبُ"),
            ex(
              "أَنَا أَذْهَبُ إِلَى الْمَدْرَسَةِ.",
              "Ich gehe zur Schule.",
              "أَذْهَبُ",
            ),
            ex("أَنَا آكُلُ التُّفَّاحَ.", "Ich esse Äpfel.", "آكُلُ"),
            ex("أَنَا أَنَامُ لَيْلًا.", "Ich schlafe nachts.", "أَنَامُ"),
            ex(
              "أَنَا أَقِفُ أَمَامَ الْبَابِ.",
              "Ich stehe vor der Tür.",
              "أَقِفُ",
            ),
          ],
        },
      ],
      takeaway: bi(
        "لا تتبع جميع الأفعال نموذجاً واحداً؛ مثل نام ← ينام ووقف ← يقف. احفظ الصيغتين في سياق، وتدرّب على الضمائر في درس التصريف.",
        "Nicht alle Verben folgen demselben Muster: nāma → yanāmu, waqafa → yaqifu. Lerne beide Formen im Kontext und übe die Personen im Konjugationskurs.",
      ),
      questions: [
        {
          prompt: bi("أي فعل يعني «lesen»؟", "Welches Verb bedeutet „lesen“?"),
          options: ["شَرِبَ", "قَرَأَ", "لَعِبَ", "نَامَ"],
          correct: 1,
          explanation: bi(
            "قرأ يقرأ: نقرأ كتاباً أو رسالة.",
            "Qaraʾa – yaqraʾu: ein Buch oder einen Brief lesen.",
          ),
        },
        {
          prompt: bi(
            "اختر المضارع الصحيح للفعل «وقف».",
            "Wähle das richtige Präsens von „waqafa“.",
          ),
          options: ["يَوْقِفُ", "يَقِفُ", "يَنَامُ", "يَكْتُبُ"],
          correct: 1,
          explanation: bi(
            "وقف ← يقف؛ تُحذف الواو في هذه الصيغة.",
            "Waqafa → yaqifu: Das Wāw entfällt in dieser Form.",
          ),
        },
        {
          prompt: bi("أكمل: أنا ___ الماء.", "Ergänze: Ich ___ Wasser."),
          options: ["أَنَامُ", "أَلْعَبُ", "أَشْرَبُ", "أَقْرَأُ"],
          correct: 2,
          explanation: bi(
            "نقول: أنا أشرب الماء.",
            "Anā ašrabu al-māʾa: Ich trinke Wasser.",
          ),
        },
        {
          prompt: bi("كيف نقول «ich esse»؟", "Wie lautet „ich esse“?"),
          options: ["آكُلُ", "يَأْكُلُ", "أَنَامُ", "أَسْمَعُ"],
          correct: 0,
          explanation: bi(
            "مع أنا نقول آكل، ومع هو نقول يأكل.",
            "Mit anā heißt es ākulu, mit huwa yaʾkulu.",
          ),
        },
      ],
    },
  ];
  const api = { lessons, sunLetters, moonLetters, basicVerbs };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.ArabicGrammarData = api;
})();
