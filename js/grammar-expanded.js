(() => {
  "use strict";
  const data = {
    lessons: [
      {
        id: "hamza-initial",
        glyph: "أ إ",
        title: {
          ar: "همزة القطع والوصل",
          de: "Qaṭʿ und Waṣl",
        },
        summary: {
          ar: "نكتب الهمزة وننطقها بحسب موضعها وصيغة الكلمة.",
          de: "Anfangshamza erkennen und richtig schreiben.",
        },
        intro: {
          ar: "همزة القطع تُنطق في الابتداء والوصل، وتُكتب أ أو إ. همزة الوصل تُنطق عند الابتداء وتسقط في درج الكلام، وتُكتب ألفاً بلا رأس همزة.",
          de: "Qaṭʿ wird am Satzanfang und nach einem vorangehenden Wort gesprochen und als أ oder إ geschrieben. Waṣl wird nur beim Ansetzen gesprochen und als einfaches Alif geschrieben.",
        },
        sections: [
          {
            title: {
              ar: "همزة القطع",
              de: "Qaṭʿ",
            },
            body: {
              ar: "تأتي في معظم الأسماء والحروف، وفي ماضي «أفعل» الرباعي وأمره ومصدره، وفي همزة المضارعة للمتكلّم. تُكتب إ تحت الألف عند الكسر، وأ فوقها عند الفتح أو الضمّ.",
              de: "Qaṭʿ steht bei den meisten Nomen und Partikeln, beim vierbuchstabigen Muster afʿala samt Imperativ und Verbalnomen sowie bei der Ich-Vorsilbe des Präsens. Bei i steht إ, bei a oder u أ.",
            },
            examples: [
              {
                ar: "أَكْرَمَ ← أَكْرِمْ ← إِكْرَامٌ",
                de: "Perfekt → Imperativ → Verbalnomen",
                focus: "أَكْرِمْ",
              },
              {
                ar: "أَسْتَخْدِمُ قَلَمًا.",
                de: "Ich benutze einen Stift.",
                focus: "أَ",
              },
            ],
          },
          {
            title: {
              ar: "همزة الوصل",
              de: "Waṣl",
            },
            body: {
              ar: "تأتي في «الـ»، وفي أسماء سماعية مثل اسم وابن وابنة وامرؤ وامرأة واثنان واثنتان. وتأتي في أمر الثلاثي الذي يحتاج إلى همزة في أوله، وفي ماضي الخماسي والسداسي وأمرهما ومصدرهما إذا ابتدأت الصيغة بهمزة.",
              de: "Waṣl steht im Artikel al-, bei überlieferten Nomen wie ism und ibn, im Imperativ von Grundverben mit Anfangs-Alif und bei fünf- und sechsbuchstabigen Perfekt-, Imperativ- und Verbalnomenformen, sofern diese mit Hamza beginnen.",
            },
            examples: [
              {
                ar: "اُكْتُبْ ← وَاكْتُبْ",
                de: "Beim Ansetzen hörbar, nach wa- nicht gesprochen.",
                focus: "اُكْتُبْ",
              },
              {
                ar: "اِسْتَخْرَجَ ← اِسْتَخْرِجْ ← اِسْتِخْرَاجٌ",
                de: "Perfekt, Imperativ und Verbalnomen mit Waṣl.",
                focus: "اِسْتِخْرَاجٌ",
              },
            ],
          },
          {
            title: {
              ar: "لا تخلط بين الصيغ",
              de: "Formen auseinanderhalten",
            },
            body: {
              ar: "استخدم يبدأ بهمزة وصل، لكن أستخدم يبدأ بهمزة قطع لأنه مضارع مع أنا. والفعل تعلّم خماسي ولا يبدأ بهمزة أصلاً.",
              de: "Istaḫdama hat Waṣl, aber astaḫdimu mit „ich“ hat Qaṭʿ. Taʿallama ist fünfbuchstabig und beginnt überhaupt nicht mit Hamza.",
            },
            examples: [
              {
                ar: "اِسْتَخْدَمَ / أَسْتَخْدِمُ",
                de: "Er benutzte / ich benutze.",
                focus: "أَسْتَخْدِمُ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "احكم على الصيغة كاملة، لا على طول الكلمة وحده.",
          de: "Entscheidend ist die ganze Wortform, nicht nur ihre Länge.",
        },
        questions: [
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «اِسْمٌ»؟",
              de: "Welche Anfangshamza hat „اِسْمٌ“?",
            },
            options: [
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
            ],
            correct: 0,
            explanation: {
              ar: "اسم من الأسماء السماعية التي تبدأ بهمزة وصل.",
              de: "Ism gehört zu den überlieferten Nomen mit Waṣl.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «اِبْنٌ»؟",
              de: "Welche Anfangshamza hat „اِبْنٌ“?",
            },
            options: [
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
            ],
            correct: 3,
            explanation: {
              ar: "ابن من الأسماء السماعية ذات همزة الوصل.",
              de: "Ibn beginnt mit einer überlieferten Waṣl-Hamza.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «اِمْرَأَةٌ»؟",
              de: "Welche Anfangshamza hat „اِمْرَأَةٌ“?",
            },
            options: [
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
            ],
            correct: 2,
            explanation: {
              ar: "الهمزة الأولى في امرأة همزة وصل؛ والسؤال هنا عن أول الكلمة.",
              de: "Die erste Hamza in imraʾa ist Waṣl; hier geht es nur um den Anfang.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «اِثْنَانِ»؟",
              de: "Welche Anfangshamza hat „اِثْنَانِ“?",
            },
            options: [
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
            ],
            correct: 1,
            explanation: {
              ar: "اثنان من الأسماء المبدوءة بهمزة وصل.",
              de: "Iṯnān gehört zu den Nomen mit Waṣl.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «اُكْتُبْ»؟",
              de: "Welche Anfangshamza hat „اُكْتُبْ“?",
            },
            options: [
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
            ],
            correct: 0,
            explanation: {
              ar: "همزة الأمر من كتب همزة وصل.",
              de: "Der Imperativ uktub beginnt mit Waṣl.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «اِسْتِخْرَاجٌ»؟",
              de: "Welche Anfangshamza hat „اِسْتِخْرَاجٌ“?",
            },
            options: [
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
            ],
            correct: 3,
            explanation: {
              ar: "مصدر استخرج يبدأ بهمزة وصل.",
              de: "Der Verbalnomen istiḫrāǧ beginnt mit Waṣl.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «أَحْمَدُ»؟",
              de: "Welche Anfangshamza hat „أَحْمَدُ“?",
            },
            options: [
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
            ],
            correct: 3,
            explanation: {
              ar: "أحمد اسم ليس من أسماء الوصل السماعية.",
              de: "Der Name Aḥmad beginnt mit Qaṭʿ.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «إِيمَانٌ»؟",
              de: "Welche Anfangshamza hat „إِيمَانٌ“?",
            },
            options: [
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
            ],
            correct: 2,
            explanation: {
              ar: "إيمان مصدر آمن الرباعي، وهمزته قطع.",
              de: "Īmān ist der Verbalnomen eines vierbuchstabigen Verbs mit Qaṭʿ.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «أَكْرَمَ»؟",
              de: "Welche Anfangshamza hat „أَكْرَمَ“?",
            },
            options: [
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
            ],
            correct: 1,
            explanation: {
              ar: "همزة الماضي الرباعي أكرم همزة قطع.",
              de: "Das vierbuchstabige Perfekt akrama beginnt mit Qaṭʿ.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «أَكْرِمْ»؟",
              de: "Welche Anfangshamza hat „أَكْرِمْ“?",
            },
            options: [
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
            ],
            correct: 0,
            explanation: {
              ar: "همزة أمر أكرم تبقى همزة قطع.",
              de: "Auch der Imperativ akrim behält Qaṭʿ.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «إِكْرَامٌ»؟",
              de: "Welche Anfangshamza hat „إِكْرَامٌ“?",
            },
            options: [
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
            ],
            correct: 3,
            explanation: {
              ar: "مصدر أكرم يبدأ بهمزة قطع.",
              de: "Der Verbalnomen ikrām beginnt mit Qaṭʿ.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الهمزة في أول «أَسْتَخْدِمُ»؟",
              de: "Welche Anfangshamza hat „أَسْتَخْدِمُ“?",
            },
            options: [
              {
                ar: "همزة متطرفة",
                de: "finale Hamza",
              },
              {
                ar: "همزة وصل",
                de: "Waṣl",
              },
              {
                ar: "همزة قطع",
                de: "Qaṭʿ",
              },
              {
                ar: "همزة متوسطة",
                de: "mediale Hamza",
              },
            ],
            correct: 2,
            explanation: {
              ar: "همزة المضارعة للمتكلّم قطع، رغم أن استخدم يبدأ بوصل.",
              de: "Die Ich-Vorsilbe im Präsens ist Qaṭʿ, auch bei istaḫdama.",
            },
          },
        ],
        category: "spelling",
      },
      {
        id: "hamza-medial",
        glyph: "ئ ؤ",
        title: {
          ar: "كتابة الهمزة المتوسطة",
          de: "Mediale Hamza",
        },
        summary: {
          ar: "نقارن الحركات، ثم نراعي حالات المدّ الخاصة.",
          de: "Vokalstärke vergleichen und Sonderfälle beachten.",
        },
        intro: {
          ar: "نقارن حركة الهمزة بحركة الحرف السابق، ونكتبها على ما يناسب الحركة الأقوى: الكسرة ثم الضمة ثم الفتحة ثم السكون. وهناك حالات خاصة بعد حروف المدّ.",
          de: "Vergleiche den Vokal der Hamza mit dem des vorangehenden Buchstabens: Kasra ist stärker als Ḍamma, dann folgen Fatḥa und Sukūn. Nach Langvokalen gibt es Sonderfälle.",
        },
        sections: [
          {
            title: {
              ar: "ترتيب قوة الحركات",
              de: "Die Vokalstärke",
            },
            body: {
              ar: "الكسرة تناسبها النبرة ئ، والضمة الواو ؤ، والفتحة الألف أ. السكون أضعف الحركات في هذه المقارنة.",
              de: "Kasra entspricht ئ, Ḍamma entspricht ؤ und Fatḥa entspricht أ. Sukūn ist in diesem Vergleich am schwächsten.",
            },
            examples: [
              {
                ar: "سُئِلَ · مُؤْمِنٌ · سَأَلَ",
                de: "Kasra → ئ; Ḍamma → ؤ; Fatḥa → أ.",
                focus: "سُئِلَ",
              },
            ],
          },
          {
            title: {
              ar: "بعد حروف المدّ",
              de: "Nach Langvokalen",
            },
            body: {
              ar: "الهمزة المفتوحة بعد ألف المدّ أو واو المدّ تكتب على السطر: قراءة، مروءة. وبعد ياء ساكنة أو ياء مدّ تكتب على نبرة: هيئة، بيئة.",
              de: "Eine Hamza mit Fatḥa nach langem ā oder ū steht hier auf der Zeile: qirāʾa, murūʾa. Nach ruhendem Yā bzw. langem ī steht sie auf einem Yā-Träger.",
            },
            examples: [
              {
                ar: "قِرَاءَةٌ · مُرُوءَةٌ",
                de: "Hamza nach langem ā oder ū.",
                focus: "اءَ",
              },
              {
                ar: "هَيْئَةٌ · بِيئَةٌ",
                de: "Hamza nach Yā.",
                focus: "ئَ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "افحص الحركتين أولاً، ثم تحقّق من وجود حرف مدّ قبل الهمزة.",
          de: "Prüfe zuerst beide Vokale, dann einen möglichen Langvokal vor der Hamza.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «سُ…ِلَ».",
              de: "Ergänze die Hamza in „سُ…ِلَ“.",
            },
            options: ["سُئِلَ", "سُأِلَ", "سُؤِلَ", "سُءِلَ"],
            correct: 0,
            explanation: {
              ar: "الهمزة مكسورة والكسرة أقوى من الضمة، فتكتب على نبرة.",
              de: "Die Hamza hat Kasra; diese ist stärker als die vorherige Ḍamma: ئ.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «رَ…ِيسٌ».",
              de: "Ergänze die Hamza in „رَ…ِيسٌ“.",
            },
            options: ["رَأِيسٌ", "رَؤِيسٌ", "رَءِيسٌ", "رَئِيسٌ"],
            correct: 3,
            explanation: {
              ar: "الهمزة مكسورة وما قبلها مفتوح؛ الكسرة أقوى.",
              de: "Kasra an der Hamza ist stärker als die vorherige Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «بِ…ْرٌ».",
              de: "Ergänze die Hamza in „بِ…ْرٌ“.",
            },
            options: ["بِؤْرٌ", "بِءْرٌ", "بِئْرٌ", "بِأْرٌ"],
            correct: 2,
            explanation: {
              ar: "الهمزة ساكنة وما قبلها مكسور، فتكتب على نبرة.",
              de: "Die Hamza ist vokallos, davor steht Kasra: ئ.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «فِ…َةٌ».",
              de: "Ergänze die Hamza in „فِ…َةٌ“.",
            },
            options: ["فِءَةٌ", "فِئَةٌ", "فِأَةٌ", "فِؤَةٌ"],
            correct: 1,
            explanation: {
              ar: "الكسرة قبل الهمزة أقوى من فتحتها.",
              de: "Die vorherige Kasra ist stärker als die Fatḥa der Hamza.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «مُ…ْمِنٌ».",
              de: "Ergänze die Hamza in „مُ…ْمِنٌ“.",
            },
            options: ["مُؤْمِنٌ", "مُأْمِنٌ", "مُئْمِنٌ", "مُءْمِنٌ"],
            correct: 0,
            explanation: {
              ar: "الهمزة ساكنة وما قبلها مضموم، فتكتب على واو.",
              de: "Die vokallose Hamza folgt auf Ḍamma: ؤ.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «سُ…َالٌ».",
              de: "Ergänze die Hamza in „سُ…َالٌ“.",
            },
            options: ["سُأَالٌ", "سُئَالٌ", "سُءَالٌ", "سُؤَالٌ"],
            correct: 3,
            explanation: {
              ar: "الضمة قبل الهمزة أقوى من فتحتها.",
              de: "Die vorherige Ḍamma ist stärker als die Fatḥa der Hamza.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «تَ…ْكُلُ».",
              de: "Ergänze die Hamza in „تَ…ْكُلُ“.",
            },
            options: ["تَئْكُلُ", "تَءْكُلُ", "تَأْكُلُ", "تَؤْكُلُ"],
            correct: 2,
            explanation: {
              ar: "الهمزة ساكنة وما قبلها مفتوح، فتكتب على ألف.",
              de: "Die vokallose Hamza folgt auf Fatḥa: أ.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «سَ…َلَ».",
              de: "Ergänze die Hamza in „سَ…َلَ“.",
            },
            options: ["سَءَلَ", "سَأَلَ", "سَؤَلَ", "سَئَلَ"],
            correct: 1,
            explanation: {
              ar: "الهمزة وما قبلها مفتوحان، فتكتب على ألف.",
              de: "Hamza und vorheriger Buchstabe haben Fatḥa: أ.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «قِرَا…َةٌ».",
              de: "Ergänze die Hamza in „قِرَا…َةٌ“.",
            },
            options: ["قِرَاءَةٌ", "قِرَاأَةٌ", "قِرَاؤَةٌ", "قِرَائَةٌ"],
            correct: 0,
            explanation: {
              ar: "الهمزة المفتوحة بعد ألف المدّ تكتب مفردة على السطر.",
              de: "Eine Hamza mit Fatḥa nach langem ā steht auf der Zeile.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «مُرُو…َةٌ».",
              de: "Ergänze die Hamza in „مُرُو…َةٌ“.",
            },
            options: ["مُرُوأَةٌ", "مُرُوؤَةٌ", "مُرُوئَةٌ", "مُرُوءَةٌ"],
            correct: 3,
            explanation: {
              ar: "الهمزة المفتوحة بعد واو المدّ تكتب على السطر.",
              de: "Eine Hamza mit Fatḥa nach langem ū steht hier auf der Zeile.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «هَيْ…َةٌ».",
              de: "Ergänze die Hamza in „هَيْ…َةٌ“.",
            },
            options: ["هَيْؤَةٌ", "هَيْءَةٌ", "هَيْئَةٌ", "هَيْأَةٌ"],
            correct: 2,
            explanation: {
              ar: "الهمزة المفتوحة بعد ياء ساكنة تكتب على نبرة.",
              de: "Nach vokallosem Yā steht die Hamza hier auf einem Yā-Träger.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الناقصة في «بِي…َةٌ».",
              de: "Ergänze die Hamza in „بِي…َةٌ“.",
            },
            options: ["بِيءَةٌ", "بِيئَةٌ", "بِيأَةٌ", "بِيؤَةٌ"],
            correct: 1,
            explanation: {
              ar: "الهمزة المفتوحة بعد ياء المدّ تكتب على نبرة.",
              de: "Nach langem ī wird die Hamza hier auf einem Yā-Träger geschrieben.",
            },
          },
        ],
        category: "spelling",
      },
      {
        id: "hamza-final",
        glyph: "ء",
        title: {
          ar: "كتابة الهمزة المتطرفة",
          de: "Finale Hamza",
        },
        summary: {
          ar: "حركة ما قبل الهمزة تحدّد كرسيّها.",
          de: "Der vorausgehende Vokal bestimmt den Hamzaträger.",
        },
        intro: {
          ar: "في الهمزة المتطرفة ننظر إلى حركة الحرف السابق وحده، لا إلى حركة الهمزة نفسها. نتعلّم هنا الكلمة في صورتها الأساسية قبل أحكام اتصال الضمائر والتنوين.",
          de: "Bei der finalen Hamza zählt nur der Vokal des vorherigen Buchstabens. Hier geht es um die Grundform vor zusätzlichen Regeln zu Suffixen und Tanwīn.",
        },
        sections: [
          {
            title: {
              ar: "على ألف أو واو أو نبرة",
              de: "Alif, Wāw oder Yā-Träger",
            },
            body: {
              ar: "بعد الفتحة تكتب أ، وبعد الضمة ؤ، وبعد الكسرة ئ.",
              de: "Nach Fatḥa steht أ, nach Ḍamma ؤ und nach Kasra ئ.",
            },
            examples: [
              {
                ar: "مَلْجَأ · تَبَاطُؤ · شَاطِئ",
                de: "Fatḥa, Ḍamma und Kasra bestimmen den Träger.",
                focus: "شَاطِئ",
              },
            ],
          },
          {
            title: {
              ar: "على السطر",
              de: "Auf der Zeile",
            },
            body: {
              ar: "إذا سبقها حرف ساكن، بما فيه حروف المدّ، كتبت على السطر: جزء، شيء، سماء، هدوء.",
              de: "Nach einem vokallosen Buchstaben oder einem Langvokal steht die Hamza auf der Zeile.",
            },
            examples: [
              {
                ar: "جُزْء · شَيْء · سَمَاء · هُدُوء",
                de: "Nach Sukūn bzw. einem Langvokal.",
                focus: "جُزْء",
              },
            ],
          },
        ],
        takeaway: {
          ar: "المتوسطة تقارن حركتين؛ المتطرفة تعتمد على حركة ما قبلها.",
          de: "Die mediale Hamza vergleicht zwei Vokale; die finale richtet sich nach dem vorherigen.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «مَلْجَ…».",
              de: "Ergänze die letzte Hamza: „مَلْجَ…“.",
            },
            options: ["مَلْجَأ", "مَلْجَؤ", "مَلْجَئ", "مَلْجَء"],
            correct: 0,
            explanation: {
              ar: "ما قبل الهمزة مفتوح، فتكتب على ألف.",
              de: "Der vorherige Buchstabe hat Fatḥa: أ.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «نَبَ…».",
              de: "Ergänze die letzte Hamza: „نَبَ…“.",
            },
            options: ["نَبَؤ", "نَبَئ", "نَبَء", "نَبَأ"],
            correct: 3,
            explanation: {
              ar: "الباء قبل الهمزة مفتوحة.",
              de: "Bā vor der Hamza hat Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «بَدَ…».",
              de: "Ergänze die letzte Hamza: „بَدَ…“.",
            },
            options: ["بَدَئ", "بَدَء", "بَدَأ", "بَدَؤ"],
            correct: 2,
            explanation: {
              ar: "الدال قبل الهمزة مفتوحة.",
              de: "Dāl vor der Hamza hat Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «شَاطِ…».",
              de: "Ergänze die letzte Hamza: „شَاطِ…“.",
            },
            options: ["شَاطِء", "شَاطِئ", "شَاطِأ", "شَاطِؤ"],
            correct: 1,
            explanation: {
              ar: "الطاء قبل الهمزة مكسورة، فتكتب على نبرة.",
              de: "Der vorherige Buchstabe hat Kasra: ئ.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «قَارِ…».",
              de: "Ergänze die letzte Hamza: „قَارِ…“.",
            },
            options: ["قَارِئ", "قَارِأ", "قَارِؤ", "قَارِء"],
            correct: 0,
            explanation: {
              ar: "الراء قبل الهمزة مكسورة.",
              de: "Rā vor der Hamza hat Kasra.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «دَافِ…».",
              de: "Ergänze die letzte Hamza: „دَافِ…“.",
            },
            options: ["دَافِأ", "دَافِؤ", "دَافِء", "دَافِئ"],
            correct: 3,
            explanation: {
              ar: "الفاء قبل الهمزة مكسورة.",
              de: "Fā vor der Hamza hat Kasra.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «تَبَاطُ…».",
              de: "Ergänze die letzte Hamza: „تَبَاطُ…“.",
            },
            options: ["تَبَاطُئ", "تَبَاطُء", "تَبَاطُؤ", "تَبَاطُأ"],
            correct: 2,
            explanation: {
              ar: "الطاء قبل الهمزة مضمومة، فتكتب على واو.",
              de: "Der vorherige Buchstabe hat Ḍamma: ؤ.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «تَكَافُ…».",
              de: "Ergänze die letzte Hamza: „تَكَافُ…“.",
            },
            options: ["تَكَافُء", "تَكَافُؤ", "تَكَافُأ", "تَكَافُئ"],
            correct: 1,
            explanation: {
              ar: "الفاء قبل الهمزة مضمومة.",
              de: "Fā vor der Hamza hat Ḍamma.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «لُؤْلُ…».",
              de: "Ergänze die letzte Hamza: „لُؤْلُ…“.",
            },
            options: ["لُؤْلُؤ", "لُؤْلُأ", "لُؤْلُئ", "لُؤْلُء"],
            correct: 0,
            explanation: {
              ar: "اللام السابقة للهمزة الأخيرة مضمومة.",
              de: "Lām vor der letzten Hamza hat Ḍamma.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «جُزْ…».",
              de: "Ergänze die letzte Hamza: „جُزْ…“.",
            },
            options: ["جُزْأ", "جُزْؤ", "جُزْئ", "جُزْء"],
            correct: 3,
            explanation: {
              ar: "الزاي ساكنة، فتكتب الهمزة على السطر.",
              de: "Der vorherige Buchstabe ist vokallos: ء.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «سَمَا…».",
              de: "Ergänze die letzte Hamza: „سَمَا…“.",
            },
            options: ["سَمَاؤ", "سَمَائ", "سَمَاء", "سَمَاأ"],
            correct: 2,
            explanation: {
              ar: "قبل الهمزة ألف مدّ ساكنة، فتكتب على السطر.",
              de: "Die Hamza folgt auf langes ā und steht auf der Zeile.",
            },
          },
          {
            prompt: {
              ar: "أكمل الهمزة الأخيرة: «هُدُو…».",
              de: "Ergänze die letzte Hamza: „هُدُو…“.",
            },
            options: ["هُدُوئ", "هُدُوء", "هُدُوأ", "هُدُوؤ"],
            correct: 1,
            explanation: {
              ar: "قبل الهمزة واو مدّ ساكنة، فتكتب على السطر.",
              de: "Die Hamza folgt auf langes ū und steht auf der Zeile.",
            },
          },
        ],
        category: "spelling",
      },
      {
        id: "five-verbs",
        glyph: "يفعلان",
        title: {
          ar: "الأفعال الخمسة",
          de: "Die fünf Verbformen",
        },
        summary: {
          ar: "خمس صور للمضارع، وليست خمسة أفعال بعينها.",
          de: "Fünf Präsensmuster, keine Liste von fünf Einzelverben.",
        },
        intro: {
          ar: "الأفعال الخمسة هي كل مضارع اتصلت به ألف الاثنين أو واو الجماعة أو ياء المخاطبة: يفعلان، تفعلان، يفعلون، تفعلون، تفعلين.",
          de: "Gemeint sind Präsensformen mit Dualendung, maskuliner Pluralendung oder weiblicher Du-Endung: yafʿalāni, tafʿalāni, yafʿalūna, tafʿalūna, tafʿalīna.",
        },
        sections: [
          {
            title: {
              ar: "ثبوت النون في الرفع",
              de: "Nūn bleibt im Indikativ",
            },
            body: {
              ar: "إذا لم يسبقها ناصب أو جازم تُرفع بثبوت النون. الألف والواو والياء ضمائر في محل رفع فاعل، وليست علامات إعراب الفعل.",
              de: "Ohne Auslöser für Subjunktiv oder Jussiv bleibt das Nūn. Alif, Wāw und Yā sind Subjektpronomen, nicht die Moduszeichen.",
            },
            examples: [
              {
                ar: "هُمَا يَكْتُبَانِ.",
                de: "Sie zwei schreiben.",
                focus: "انِ",
              },
              {
                ar: "أَنْتِ تَكْتُبِينَ.",
                de: "Du schreibst · weiblich.",
                focus: "ينَ",
              },
            ],
          },
          {
            title: {
              ar: "حذف النون في النصب والجزم",
              de: "Nūn entfällt im Subjunktiv und Jussiv",
            },
            body: {
              ar: "بعد لن وأن الناصبة تُنصب بحذف النون، وبعد لم ولا الناهية تُجزم بحذف النون.",
              de: "Nach lan oder dem Subjunktiv-an sowie nach lam oder dem verbietenden lā entfällt das Nūn.",
            },
            examples: [
              {
                ar: "لَنْ يَكْتُبُوا.",
                de: "Sie werden nicht schreiben.",
                focus: "يَكْتُبُوا",
              },
              {
                ar: "لَمْ تَكْتُبِي.",
                de: "Du hast nicht geschrieben · weiblich.",
                focus: "تَكْتُبِي",
              },
            ],
          },
          {
            title: {
              ar: "ما لا يدخل في الأفعال الخمسة",
              de: "Was nicht dazugehört",
            },
            body: {
              ar: "يكتبن المتصل بنون النسوة ليس من الأفعال الخمسة، وكذلك فعل الأمر اكتبوا. المقصود بهذه القاعدة المضارع وحده.",
              de: "Yaktubna mit femininem Plural-Nūn gehört nicht dazu, ebenso wenig der Imperativ uktubū. Die Regel betrifft nur das Präsens.",
            },
            examples: [
              {
                ar: "يَكْتُبْنَ ≠ يَكْتُبُونَ",
                de: "Femininer und maskuliner Plural unterscheiden sich.",
                focus: "يَكْتُبْنَ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "فرّق بين الضمير المتصل وعلامة الإعراب: النون تثبت أو تحذف.",
          de: "Unterscheide Subjektpronomen und Moduszeichen: Das Nūn bleibt oder entfällt.",
        },
        questions: [
          {
            prompt: {
              ar: "أي صيغة من الأفعال الخمسة؟",
              de: "Welche Form gehört zu den fünf Verbformen?",
            },
            options: ["يَكْتُبَانِ", "يَكْتُبُ", "يَكْتُبْنَ", "اُكْتُبْ"],
            correct: 0,
            explanation: {
              ar: "يكتبان مضارع اتصلت به ألف الاثنين.",
              de: "Yaktubāni ist Präsens mit der Dualendung.",
            },
          },
          {
            prompt: {
              ar: "أي صيغة ليست من الأفعال الخمسة؟",
              de: "Welche Form gehört nicht dazu?",
            },
            options: [
              "يَكْتُبُونَ",
              "تَكْتُبِينَ",
              "تَكْتُبَانِ",
              "يَكْتُبْنَ",
            ],
            correct: 3,
            explanation: {
              ar: "نون النسوة ليست نون الرفع في الأفعال الخمسة.",
              de: "Die feminine Pluralendung ist nicht das Nūn dieser fünf Formen.",
            },
          },
          {
            prompt: {
              ar: "أكمل: الطالبان ___ الدرس.",
              de: "Ergänze für zwei männliche Schüler.",
            },
            options: ["يَكْتُبُ", "تَكْتُبِينَ", "يَكْتُبَانِ", "يَكْتُبُونَ"],
            correct: 2,
            explanation: {
              ar: "ألف الاثنين تناسب الطالبين، والنون ثابتة في الرفع.",
              de: "Dual passt zu zwei Schülern; im Indikativ bleibt Nūn.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لن ___ الرسالةَ. والمقصود هم.",
              de: "Ergänze nach lan für „sie“ männlich Plural.",
            },
            options: ["يَكْتُبُ", "يَكْتُبُوا", "يَكْتُبُونَ", "يَكْتُبَانِ"],
            correct: 1,
            explanation: {
              ar: "لن تنصب الفعل، وعلامة النصب حذف النون.",
              de: "Lan verlangt den Subjunktiv: Das Nūn entfällt.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لم ___ الدرسَ. والمقصود أنتِ.",
              de: "Ergänze nach lam für eine weibliche Angesprochene.",
            },
            options: ["تَكْتُبِي", "تَكْتُبِينَ", "تَكْتُبُونَ", "تَكْتُبُ"],
            correct: 0,
            explanation: {
              ar: "لم تجزم الفعل، فتُحذف نون تكتبين.",
              de: "Lam verlangt den Jussiv; das Nūn von taktubīna entfällt.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لم ___ الدرسَ. والمقصود هما المذكّران.",
              de: "Ergänze nach lam für zwei männliche Dritte.",
            },
            options: ["يَكْتُبَانِ", "يَكْتُبُونَ", "يَكْتُبُ", "يَكْتُبَا"],
            correct: 3,
            explanation: {
              ar: "يجزم يكتبان بحذف النون: لم يكتبا.",
              de: "Die Dualform verliert im Jussiv das Nūn.",
            },
          },
          {
            prompt: {
              ar: "علامة رفع الأفعال الخمسة هي:",
              de: "Welches Zeichen markiert den Indikativ?",
            },
            options: [
              {
                ar: "الكسرة",
                de: "Kasra",
              },
              {
                ar: "الواو وحدها",
                de: "nur Wāw",
              },
              {
                ar: "ثبوت النون",
                de: "Erhalt des Nūn",
              },
              {
                ar: "حذف النون",
                de: "Wegfall des Nūn",
              },
            ],
            correct: 2,
            explanation: {
              ar: "ترفع الأفعال الخمسة بثبوت النون.",
              de: "Im Indikativ bleibt das Nūn erhalten.",
            },
          },
          {
            prompt: {
              ar: "علامة نصب الأفعال الخمسة هي:",
              de: "Wie wird der Subjunktiv markiert?",
            },
            options: [
              {
                ar: "الألف",
                de: "Alif",
              },
              {
                ar: "حذف النون",
                de: "Wegfall des Nūn",
              },
              {
                ar: "ثبوت النون",
                de: "Erhalt des Nūn",
              },
              {
                ar: "الكسرة",
                de: "Kasra",
              },
            ],
            correct: 1,
            explanation: {
              ar: "النصب والجزم كلاهما بحذف النون.",
              de: "Sowohl Subjunktiv als auch Jussiv verlieren das Nūn.",
            },
          },
          {
            prompt: {
              ar: "الواو في «يكتبون» هي:",
              de: "Was ist das Wāw in yaktubūna?",
            },
            options: [
              {
                ar: "واو الجماعة: ضمير فاعل",
                de: "Subjektpronomen im Plural",
              },
              {
                ar: "علامة رفع الفعل",
                de: "Moduszeichen des Verbs",
              },
              {
                ar: "حرف جر",
                de: "Präposition",
              },
              {
                ar: "نون النسوة",
                de: "feminines Plural-Nūn",
              },
            ],
            correct: 0,
            explanation: {
              ar: "الواو فاعل، أمّا علامة الرفع فهي ثبوت النون.",
              de: "Wāw ist das Subjektpronomen; das Moduszeichen ist das Nūn.",
            },
          },
          {
            prompt: {
              ar: "أي كتابة صحيحة بعد «لن» مع هم؟",
              de: "Welche Schreibung ist nach lan für „sie“ korrekt?",
            },
            options: [
              "لَنْ يَدْرُسُونَ",
              "لَنْ يَدْرُسُ",
              "لَنْ دَرَسُوا",
              "لَنْ يَدْرُسُوا",
            ],
            correct: 3,
            explanation: {
              ar: "تُحذف النون وتكتب الألف الفارقة بعد واو الجماعة.",
              de: "Das Nūn entfällt; nach dem Plural-Wāw steht das stumme Alif.",
            },
          },
          {
            prompt: {
              ar: "الياء في «تدرسين» تدلّ على:",
              de: "Was bezeichnet das Yā in tadrusīna?",
            },
            options: [
              {
                ar: "الغائب المذكّر",
                de: "er",
              },
              {
                ar: "المثنّى",
                de: "Dual",
              },
              {
                ar: "المخاطبة المفردة",
                de: "eine weibliche Angesprochene",
              },
              {
                ar: "المتكلّم",
                de: "ich",
              },
            ],
            correct: 2,
            explanation: {
              ar: "هذه ياء المخاطبة، وليست ياء المتكلّم.",
              de: "Dies ist das Yā der weiblichen Angesprochenen.",
            },
          },
          {
            prompt: {
              ar: "أكمل: أنتما لن ___ مبكّراً.",
              de: "Ergänze nach lan für „ihr zwei“.",
            },
            options: ["يَخْرُجُوا", "تَخْرُجَا", "تَخْرُجَانِ", "تَخْرُجُونَ"],
            correct: 1,
            explanation: {
              ar: "تخرجان تنصب بحذف النون: تخرجا.",
              de: "Taḫruǧāni verliert nach lan das Nūn.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "five-nouns",
        glyph: "أبوك",
        title: {
          ar: "الأسماء الخمسة",
          de: "Die fünf besonderen Nomen",
        },
        summary: {
          ar: "الرفع بالواو، والنصب بالألف، والجرّ بالياء بشروط.",
          de: "Kasus durch Wāw, Alif und Yā – unter Bedingungen.",
        },
        intro: {
          ar: "الأسماء الخمسة: أب، أخ، حم، فو، ذو. تُعرب بالحروف إذا كانت مفردة غير مصغّرة، مضافة إلى غير ياء المتكلّم. ويشترط في فو خلوّها من الميم، وفي ذو معنى صاحب.",
          de: "Die fünf Nomen sind ab, aḫ, ḥam, fū und ḏū. Ihre Sonderflexion gilt im nicht verkleinerten Singular in einer Genitivverbindung ohne das Mein-Yā. Fū darf kein Mīm haben, ḏū muss „Besitzer von“ bedeuten.",
        },
        sections: [
          {
            title: {
              ar: "ثلاث حالات إعرابية",
              de: "Drei Kasusformen",
            },
            body: {
              ar: "ترفع بالواو وتنصب بالألف وتجرّ بالياء. انظر إلى وظيفة الاسم في الجملة.",
              de: "Nominativ mit Wāw, Akkusativ mit Alif und Genitiv mit Yā. Entscheidend ist die Satzfunktion.",
            },
            examples: [
              {
                ar: "جَاءَ أَبُوكَ.",
                de: "Dein Vater kam.",
                focus: "أَبُوكَ",
              },
              {
                ar: "رَأَيْتُ أَبَاكَ.",
                de: "Ich sah deinen Vater.",
                focus: "أَبَاكَ",
              },
              {
                ar: "سَلَّمْتُ عَلَى أَبِيكَ.",
                de: "Ich begrüßte deinen Vater.",
                focus: "أَبِيكَ",
              },
            ],
          },
          {
            title: {
              ar: "الاستثناءات والشروط",
              de: "Bedingungen und Abgrenzungen",
            },
            body: {
              ar: "أبي المضاف إلى ياء المتكلّم لا يعرب بهذه الحروف. وفم بالميم يعرب بالحركات المعتادة. وذو يجب أن تأتي بمعنى صاحب، مثل ذو علم.",
              de: "Abī „mein Vater“ hat nicht diese Sonderflexion. Fam mit Mīm hat normale Kasusvokale. Ḏū bedeutet hier „Besitzer von“, etwa ḏū ʿilmin.",
            },
            examples: [
              {
                ar: "هَذَا رَجُلٌ ذُو عِلْمٍ.",
                de: "Dies ist ein Mann mit Wissen.",
                focus: "ذُو",
              },
              {
                ar: "هَذَا فَمٌ.",
                de: "Dies ist ein Mund · normale Kasusvokale.",
                focus: "فَمٌ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "افحص الشروط قبل تطبيق علامة الواو أو الألف أو الياء.",
          de: "Prüfe die Bedingungen, bevor du die Sonderflexion anwendest.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل: جاء ___. والمقصود أبوك.",
              de: "Ergänze das Subjekt nach „kam“.",
            },
            options: ["أَبُوكَ", "أَبَاكَ", "أَبِيكَ", "أَبَيْكَ"],
            correct: 0,
            explanation: {
              ar: "أبوك فاعل مرفوع بالواو.",
              de: "Abūka steht als Subjekt im Nominativ mit Wāw.",
            },
          },
          {
            prompt: {
              ar: "أكمل: رأيتُ ___. والمقصود أبوك.",
              de: "Ergänze das Objekt nach „ich sah“.",
            },
            options: ["أَبُوكَ", "أَبِيكَ", "أَبَوَاكَ", "أَبَاكَ"],
            correct: 3,
            explanation: {
              ar: "أباك مفعول به منصوب بالألف.",
              de: "Abāka steht im Akkusativ mit Alif.",
            },
          },
          {
            prompt: {
              ar: "أكمل: سلّمتُ على ___. والمقصود أبوك.",
              de: "Ergänze nach der Präposition ʿalā.",
            },
            options: ["أَبَاكَ", "أَبَوَاكَ", "أَبِيكَ", "أَبُوكَ"],
            correct: 2,
            explanation: {
              ar: "أبيك اسم مجرور بالياء.",
              de: "Abīka steht nach der Präposition im Genitiv mit Yā.",
            },
          },
          {
            prompt: {
              ar: "أكمل: ___ كريمٌ. والمقصود أخوك.",
              de: "Ergänze das Subjekt zu „ist großzügig“.",
            },
            options: ["إِخْوَتُكَ", "أَخُوكَ", "أَخَاكَ", "أَخِيكَ"],
            correct: 1,
            explanation: {
              ar: "أخوك مبتدأ مرفوع بالواو.",
              de: "Aḫūka ist das Subjekt im Nominativ mit Wāw.",
            },
          },
          {
            prompt: {
              ar: "أكمل: احترمتُ ___. والمقصود حموك.",
              de: "Ergänze das Objekt „deinen Schwiegervater“.",
            },
            options: ["حَمَاكَ", "حَمُوكَ", "حَمِيكَ", "حَمَوَاكَ"],
            correct: 0,
            explanation: {
              ar: "حماك منصوب بالألف عند تحقق الشروط.",
              de: "Ḥamāka hat im Akkusativ Alif.",
            },
          },
          {
            prompt: {
              ar: "أكمل: نظرتُ إلى ___. والمقصود فوك.",
              de: "Ergänze „deinem Mund“ nach ilā.",
            },
            options: ["فُوكَ", "فَاكَ", "فَمُكَ", "فِيكَ"],
            correct: 3,
            explanation: {
              ar: "فو الخالي من الميم يجرّ بالياء: فيك.",
              de: "Fū ohne Mīm hat im Genitiv Yā: fīka.",
            },
          },
          {
            prompt: {
              ar: "أكمل: جاء رجلٌ ___ علمٍ.",
              de: "Ergänze: ein Mann mit Wissen.",
            },
            options: ["ذِي", "ذَوِي", "ذُو", "ذَا"],
            correct: 2,
            explanation: {
              ar: "ذو بمعنى صاحب، وهي هنا نعت مرفوع بالواو.",
              de: "Ḏū bedeutet „Besitzer von“ und steht hier im Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: رأيتُ رجلاً ___ علمٍ.",
              de: "Ergänze im Akkusativ: einen Mann mit Wissen.",
            },
            options: ["ذَوُو", "ذَا", "ذُو", "ذِي"],
            correct: 1,
            explanation: {
              ar: "ذا منصوب بالألف؛ لأنه وصف لرجل المنصوب.",
              de: "Ḏā steht passend zu raǧulan im Akkusativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: مررتُ برجلٍ ___ علمٍ.",
              de: "Ergänze im Genitiv: einem Mann mit Wissen.",
            },
            options: ["ذِي", "ذُو", "ذَا", "ذَاتُ"],
            correct: 0,
            explanation: {
              ar: "ذي مجرور بالياء.",
              de: "Ḏī steht im Genitiv mit Yā.",
            },
          },
          {
            prompt: {
              ar: "أي شرط لازم للإعراب بالحروف هنا؟",
              de: "Welche Bedingung ist hier nötig?",
            },
            options: [
              {
                ar: "أن تكون جمعاً دائماً",
                de: "immer Plural",
              },
              {
                ar: "ألا تكون مضافة",
                de: "keine Genitivverbindung",
              },
              {
                ar: "أن تبدأ بالـ",
                de: "immer mit Artikel",
              },
              {
                ar: "أن تكون مفردة مضافة لغير ياء المتكلّم",
                de: "Singular und Genitivverbindung ohne mein-Yā",
              },
            ],
            correct: 3,
            explanation: {
              ar: "يشترط الإفراد والإضافة لغير ياء المتكلّم وعدم التصغير.",
              de: "Nötig sind Singular, keine Verkleinerung und eine entsprechende Genitivverbindung.",
            },
          },
          {
            prompt: {
              ar: "هل «أبي» المضاف إلى ياء المتكلّم يعرب بالواو والألف والياء بهذه القاعدة؟",
              de: "Gilt die Buchstabenflexion dieser Regel für abī „mein Vater“?",
            },
            options: [
              {
                ar: "نعم، دائماً بالألف",
                de: "ja, immer Alif",
              },
              {
                ar: "هو جمع",
                de: "es ist Plural",
              },
              {
                ar: "لا؛ له حركات مقدّرة",
                de: "Nein, es hat nicht sichtbare Kasusvokale",
              },
              {
                ar: "نعم، دائماً بالواو",
                de: "ja, immer Wāw",
              },
            ],
            correct: 2,
            explanation: {
              ar: "الإضافة إلى ياء المتكلّم تمنع الإعراب بهذه الحروف.",
              de: "Die Verbindung mit dem Mein-Yā schließt diese Buchstabenflexion aus.",
            },
          },
          {
            prompt: {
              ar: "أي كلمة ليست من الأسماء الخمسة؟",
              de: "Welches Wort gehört nicht zu den fünf Nomen?",
            },
            options: ["ذُو", "يَدٌ", "أَبٌ", "أَخٌ"],
            correct: 1,
            explanation: {
              ar: "يد ليست من أب وأخ وحم وفو وذو.",
              de: "Yad gehört nicht zur Gruppe ab, aḫ, ḥam, fū, ḏū.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "active-participle",
        glyph: "كاتب",
        title: {
          ar: "اسم الفاعل",
          de: "Aktives Partizip",
        },
        summary: {
          ar: "اسم يدلّ على من قام بالفعل.",
          de: "Die handelnde Person oder Sache benennen.",
        },
        intro: {
          ar: "اسم الفاعل اسم مشتقّ يدلّ على من قام بالفعل أو اتصف به. نفرّق بين اسم الفاعل واسم المفعول والمصدر.",
          de: "Das aktive Partizip bezeichnet den Handelnden oder Träger einer Handlung. Es unterscheidet sich vom passiven Partizip und vom Verbalnomen.",
        },
        sections: [
          {
            title: {
              ar: "من الفعل الثلاثي",
              de: "Vom dreiradikaligen Grundverb",
            },
            body: {
              ar: "يُصاغ غالباً على وزن فاعل: كتب كاتب، فتح فاتح. للأفعال المعتلّة تغييرات، مثل قال قائل ودعا داعٍ في حالتي الرفع والجرّ عند التنكير.",
              de: "Meist gilt das Muster fāʿil. Schwache Verben verändern sich, etwa qāla → qāʾil und daʿā → dāʿin im unbestimmten Nominativ und Genitiv.",
            },
            examples: [
              {
                ar: "كَتَبَ ← كَاتِبٌ",
                de: "schreiben → schreibende Person",
                focus: "كَاتِبٌ",
              },
              {
                ar: "قَالَ ← قَائِلٌ",
                de: "sagen → sprechende Person",
                focus: "قَائِلٌ",
              },
            ],
          },
          {
            title: {
              ar: "من غير الثلاثي",
              de: "Von anderen Verbstämmen",
            },
            body: {
              ar: "نأتي بالمضارع ونبدل حرف المضارعة ميماً مضمومة ونكسر ما قبل الآخر: يعلّم ← معلِّم. تشمل القاعدة الأفعال الرباعية والمزيدة مع مراعاة الإعلال.",
              de: "Nimm das Präsens, ersetze dessen Vorsilbe durch mu- und setze Kasra vor den letzten Konsonanten; mögliche Stammänderungen sind zu beachten.",
            },
            examples: [
              {
                ar: "يُعَلِّمُ ← مُعَلِّمٌ",
                de: "unterrichten → Lehrender",
                focus: "مُعَلِّمٌ",
              },
              {
                ar: "يَسْتَخْرِجُ ← مُسْتَخْرِجٌ",
                de: "extrahieren → Extrahierender",
                focus: "مُسْتَخْرِجٌ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "كاتب فاعل، ومكتوب مفعول، وكتابة مصدر.",
          de: "Kātib ist aktiv, maktūb passiv und kitāba ein Verbalnomen.",
        },
        questions: [
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «كَتَبَ».",
              de: "Bilde das aktive Partizip von „كَتَبَ“.",
            },
            options: ["كَاتِبٌ", "مَكْتُوبٌ", "كِتَابَةٌ", "كُتُبٌ"],
            correct: 0,
            explanation: {
              ar: "من الثلاثي على وزن فاعل: كاتب.",
              de: "Dreiradikaliges Grundverb: Muster fāʿil.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «فَتَحَ».",
              de: "Bilde das aktive Partizip von „فَتَحَ“.",
            },
            options: ["مَفْتُوحٌ", "فَتْحٌ", "مِفْتَاحٌ", "فَاتِحٌ"],
            correct: 3,
            explanation: {
              ar: "اسم الفاعل فاتح على وزن فاعل.",
              de: "Fātiḥ hat das Muster fāʿil.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «حَفِظَ».",
              de: "Bilde das aktive Partizip von „حَفِظَ“.",
            },
            options: ["حِفْظٌ", "حُفَّاظٌ", "حَافِظٌ", "مَحْفُوظٌ"],
            correct: 2,
            explanation: {
              ar: "حافظ يدلّ على من قام بالحفظ.",
              de: "Ḥāfiẓ bezeichnet die handelnde Person.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «رَسَمَ».",
              de: "Bilde das aktive Partizip von „رَسَمَ“.",
            },
            options: ["رُسُومٌ", "رَاسِمٌ", "مَرْسُومٌ", "رَسْمٌ"],
            correct: 1,
            explanation: {
              ar: "نزيد ألفاً بعد الراء ونكسر السين: راسم.",
              de: "Rāsim folgt dem Muster fāʿil.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «شَرِبَ».",
              de: "Bilde das aktive Partizip von „شَرِبَ“.",
            },
            options: ["شَارِبٌ", "مَشْرُوبٌ", "شُرْبٌ", "شَرَابٌ"],
            correct: 0,
            explanation: {
              ar: "شارب اسم فاعل، ومشروب اسم مفعول.",
              de: "Šārib ist aktiv; mašrūb ist passiv.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «سَمِعَ».",
              de: "Bilde das aktive Partizip von „سَمِعَ“.",
            },
            options: ["مَسْمُوعٌ", "سَمَاعٌ", "سَمِيعٌ", "سَامِعٌ"],
            correct: 3,
            explanation: {
              ar: "اسم الفاعل القياسي سامع، وسميع صيغة أخرى للمبالغة في سياقها.",
              de: "Das reguläre aktive Partizip ist sāmiʿ; samīʿ ist eine Intensivform im passenden Kontext.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «عَلَّمَ».",
              de: "Bilde das aktive Partizip von „عَلَّمَ“.",
            },
            options: ["تَعْلِيمٌ", "عِلْمٌ", "مُعَلِّمٌ", "مُعَلَّمٌ"],
            correct: 2,
            explanation: {
              ar: "من يعلّم: نبدل حرف المضارعة ميماً مضمومة ونكسر ما قبل الآخر.",
              de: "Von yuʿallimu: Vorsilbe mu-, vorletzter Konsonant mit Kasra.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «أَكْرَمَ».",
              de: "Bilde das aktive Partizip von „أَكْرَمَ“.",
            },
            options: ["كَرِيمٌ", "مُكْرِمٌ", "مُكْرَمٌ", "إِكْرَامٌ"],
            correct: 1,
            explanation: {
              ar: "يكرم ← مُكرِم، بكسر الراء.",
              de: "Yukrimu → mukrim mit Kasra am Rā.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «أَرْسَلَ».",
              de: "Bilde das aktive Partizip von „أَرْسَلَ“.",
            },
            options: ["مُرْسِلٌ", "مُرْسَلٌ", "إِرْسَالٌ", "رَسُولٌ"],
            correct: 0,
            explanation: {
              ar: "يرسل ← مُرسِل، بكسر السين.",
              de: "Yursilu → mursil mit Kasra am Sīn.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «اِسْتَخْرَجَ».",
              de: "Bilde das aktive Partizip von „اِسْتَخْرَجَ“.",
            },
            options: [
              "مُسْتَخْرَجٌ",
              "اِسْتِخْرَاجٌ",
              "خُرُوجٌ",
              "مُسْتَخْرِجٌ",
            ],
            correct: 3,
            explanation: {
              ar: "اسم الفاعل من غير الثلاثي بكسر ما قبل الآخر.",
              de: "Bei diesem erweiterten Verb steht vor dem letzten Konsonanten Kasra.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «اِسْتَخْدَمَ».",
              de: "Bilde das aktive Partizip von „اِسْتَخْدَمَ“.",
            },
            options: [
              "اِسْتِخْدَامٌ",
              "خِدْمَةٌ",
              "مُسْتَخْدِمٌ",
              "مُسْتَخْدَمٌ",
            ],
            correct: 2,
            explanation: {
              ar: "مستخدِم هو من يستخدم الشيء.",
              de: "Mustaḫdim bezeichnet die benutzende Person.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الفاعل القياسي من «دَحْرَجَ».",
              de: "Bilde das aktive Partizip von „دَحْرَجَ“.",
            },
            options: ["تَدَحْرُجٌ", "مُدَحْرِجٌ", "مُدَحْرَجٌ", "دَحْرَجَةٌ"],
            correct: 1,
            explanation: {
              ar: "الرباعي أيضاً يؤخذ من المضارع: يدحرج ← مُدحرِج.",
              de: "Auch beim vierwurzeligen Verb: yudaḥriǧu → mudaḥriǧ.",
            },
          },
        ],
        category: "morphology",
      },
      {
        id: "passive-participle",
        glyph: "مكتوب",
        title: {
          ar: "اسم المفعول",
          de: "Passives Partizip",
        },
        summary: {
          ar: "اسم يدلّ على ما وقع عليه الفعل.",
          de: "Die von einer Handlung betroffene Person oder Sache.",
        },
        intro: {
          ar: "اسم المفعول اسم مشتقّ يدلّ على من وقع عليه الفعل. نتعلّم هنا صوغه من الأفعال المتعدّية؛ وقد يحتاج اللازم إلى جار ومجرور معه.",
          de: "Das passive Partizip bezeichnet den Betroffenen einer Handlung. Hier üben wir transitive Verben; bei intransitiven Verben wird oft eine Präpositionalergänzung benötigt.",
        },
        sections: [
          {
            title: {
              ar: "مفعول من الثلاثي",
              de: "Mafʿūl beim Grundverb",
            },
            body: {
              ar: "يأتي غالباً على وزن مفعول: كتب مكتوب، حفظ محفوظ. وتحدث تغييرات في المعتلّ، مثل قال مقول وباع مبيع.",
              de: "Meist gilt mafʿūl: kataba → maktūb. Bei schwachen Verben verändert sich der Stamm: qāla → maqūl, bāʿa → mabīʿ.",
            },
            examples: [
              {
                ar: "كَتَبَ ← مَكْتُوبٌ",
                de: "schreiben → geschrieben",
                focus: "مَكْتُوبٌ",
              },
            ],
          },
          {
            title: {
              ar: "فتح ما قبل الآخر في غير الثلاثي",
              de: "Fatḥa vor dem letzten Konsonanten",
            },
            body: {
              ar: "نأتي بالمضارع ونبدل أوله ميماً مضمومة ونفتح ما قبل الآخر. الفرق بين معلِّم ومعلَّم في الكسرة والفتحة.",
              de: "Ersetze die Präsensvorsilbe durch mu- und setze Fatḥa vor den letzten Konsonanten. Muʿallim ist aktiv, muʿallam passiv.",
            },
            examples: [
              {
                ar: "مُعَلِّمٌ / مُعَلَّمٌ",
                de: "Lehrender / unterrichtete Person",
                focus: "مُعَلَّمٌ",
              },
              {
                ar: "مُرْسِلٌ / مُرْسَلٌ",
                de: "Sender / Gesandter",
                focus: "مُرْسَلٌ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "اسأل: من قام بالفعل؟ ومن وقع عليه؟ ثم اضبط الحركة.",
          de: "Frage nach Handelndem und Betroffenem und beachte die Vokalzeichen.",
        },
        questions: [
          {
            prompt: {
              ar: "اختر اسم المفعول من «كَتَبَ».",
              de: "Bilde das passive Partizip von „كَتَبَ“.",
            },
            options: ["مَكْتُوبٌ", "كَاتِبٌ", "كِتَابَةٌ", "كُتُبٌ"],
            correct: 0,
            explanation: {
              ar: "الثلاثي المتعدّي على وزن مفعول: مكتوب.",
              de: "Beim transitiven Grundverb gilt das Muster mafʿūl.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «فَتَحَ».",
              de: "Bilde das passive Partizip von „فَتَحَ“.",
            },
            options: ["فَاتِحٌ", "فَتْحٌ", "مِفْتَاحٌ", "مَفْتُوحٌ"],
            correct: 3,
            explanation: {
              ar: "مفتوح يدلّ على ما وقع عليه الفتح.",
              de: "Maftūḥ bezeichnet das Geöffnete.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «حَفِظَ».",
              de: "Bilde das passive Partizip von „حَفِظَ“.",
            },
            options: ["حِفْظٌ", "حَفِيظٌ", "مَحْفُوظٌ", "حَافِظٌ"],
            correct: 2,
            explanation: {
              ar: "محفوظ اسم مفعول على وزن مفعول.",
              de: "Maḥfūẓ ist ein passives Partizip auf mafʿūl.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «رَسَمَ».",
              de: "Bilde das passive Partizip von „رَسَمَ“.",
            },
            options: ["رُسُومٌ", "مَرْسُومٌ", "رَاسِمٌ", "رَسْمٌ"],
            correct: 1,
            explanation: {
              ar: "مرسوم هو ما وقع عليه الرسم.",
              de: "Marsūm bezeichnet das Gezeichnete.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «شَرِبَ».",
              de: "Bilde das passive Partizip von „شَرِبَ“.",
            },
            options: ["مَشْرُوبٌ", "شَارِبٌ", "شَرَابٌ", "شُرْبٌ"],
            correct: 0,
            explanation: {
              ar: "مشروب يقع عليه الشرب، وشارب يقوم به.",
              de: "Mašrūb wird getrunken; šārib trinkt.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «سَمِعَ».",
              de: "Bilde das passive Partizip von „سَمِعَ“.",
            },
            options: ["سَامِعٌ", "سَمَاعٌ", "سَمِيعٌ", "مَسْمُوعٌ"],
            correct: 3,
            explanation: {
              ar: "مسموع على وزن مفعول.",
              de: "Masmūʿ folgt dem Muster mafʿūl.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «عَلَّمَ».",
              de: "Bilde das passive Partizip von „عَلَّمَ“.",
            },
            options: ["تَعْلِيمٌ", "عَالِمٌ", "مُعَلَّمٌ", "مُعَلِّمٌ"],
            correct: 2,
            explanation: {
              ar: "نفتح ما قبل الآخر: مُعلَّم، لا مُعلِّم.",
              de: "Das passive Partizip hat Fatḥa vor dem letzten Konsonanten.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «أَكْرَمَ».",
              de: "Bilde das passive Partizip von „أَكْرَمَ“.",
            },
            options: ["كَرِيمٌ", "مُكْرَمٌ", "مُكْرِمٌ", "إِكْرَامٌ"],
            correct: 1,
            explanation: {
              ar: "مُكرَم بفتح الراء.",
              de: "Mukram hat Fatḥa am Rā.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «أَرْسَلَ».",
              de: "Bilde das passive Partizip von „أَرْسَلَ“.",
            },
            options: ["مُرْسَلٌ", "مُرْسِلٌ", "إِرْسَالٌ", "رَسُولٌ"],
            correct: 0,
            explanation: {
              ar: "مُرسَل بفتح السين يدلّ على ما أُرسل.",
              de: "Mursal mit Fatḥa am Sīn bezeichnet das Gesandte.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «اِسْتَخْرَجَ».",
              de: "Bilde das passive Partizip von „اِسْتَخْرَجَ“.",
            },
            options: [
              "مُسْتَخْرِجٌ",
              "اِسْتِخْرَاجٌ",
              "خَارِجٌ",
              "مُسْتَخْرَجٌ",
            ],
            correct: 3,
            explanation: {
              ar: "في غير الثلاثي نضم الميم ونفتح ما قبل الآخر.",
              de: "Bei diesem erweiterten Verb: mu- und Fatḥa vor dem letzten Konsonanten.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «اِسْتَخْدَمَ».",
              de: "Bilde das passive Partizip von „اِسْتَخْدَمَ“.",
            },
            options: [
              "اِسْتِخْدَامٌ",
              "خَادِمٌ",
              "مُسْتَخْدَمٌ",
              "مُسْتَخْدِمٌ",
            ],
            correct: 2,
            explanation: {
              ar: "مُستخدَم هو الشيء الذي يُستخدم.",
              de: "Mustaḫdam bezeichnet das Benutzte.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم المفعول من «دَحْرَجَ».",
              de: "Bilde das passive Partizip von „دَحْرَجَ“.",
            },
            options: ["تَدَحْرُجٌ", "مُدَحْرَجٌ", "مُدَحْرِجٌ", "دَحْرَجَةٌ"],
            correct: 1,
            explanation: {
              ar: "مُدحرَج بفتح ما قبل الآخر.",
              de: "Mudaḥraǧ hat Fatḥa vor dem letzten Konsonanten.",
            },
          },
        ],
        category: "morphology",
      },
      {
        id: "instrument-noun",
        glyph: "مفتاح",
        title: {
          ar: "اسم الآلة",
          de: "Instrumentennomen",
        },
        summary: {
          ar: "نسمّي الأداة التي نؤدّي بها عملاً.",
          de: "Werkzeuge und Geräte passend benennen.",
        },
        intro: {
          ar: "اسم الآلة اسم يدلّ على الأداة التي يُنجز بها الفعل. منه مشتقّ قياسي ومنه سماعي، فلا يصحّ توليد اسم لكل جهاز من وزن واحد.",
          de: "Instrumentennomen bezeichnen Werkzeuge oder Geräte. Einige sind regelmäßig abgeleitet, andere lexikalisch überliefert; nicht jeder Gerätename folgt demselben Muster.",
        },
        sections: [
          {
            title: {
              ar: "الأوزان التقليدية",
              de: "Traditionelle Muster",
            },
            body: {
              ar: "من أشهر الأوزان مِفْعَل ومِفْعَال ومِفْعَلَة: مِبرد، مفتاح، مطرقة.",
              de: "Häufig sind mifʿal, mifʿāl und mifʿala.",
            },
            examples: [
              {
                ar: "مِبْرَدٌ · مِفْتَاحٌ · مِطْرَقَةٌ",
                de: "Feile · Schlüssel · Hammer",
                focus: "مِفْتَاحٌ",
              },
            ],
          },
          {
            title: {
              ar: "أوزان واستعمالات أخرى",
              de: "Weitere gebräuchliche Muster",
            },
            body: {
              ar: "تستعمل أوزان مثل فعّالة وفاعول في أسماء الآلات الحديثة: غسّالة وحاسوب. واحفظ الأسماء السماعية مثل سكّين مع معناها.",
              de: "Moderne Geräte nutzen auch faʿʿāla und fāʿūl: Waschmaschine und Computer. Lexikalische Namen wie sikkīn „Messer“ werden als Wortschatz gelernt.",
            },
            examples: [
              {
                ar: "غَسَّالَةٌ · حَاسُوبٌ",
                de: "Waschmaschine · Computer",
                focus: "غَسَّالَةٌ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "ميّز الأداة من الفاعل والمفعول والمصدر: مفتاح، فاتح، مفتوح، فتح.",
          de: "Unterscheide Werkzeug, Handelnden, Betroffenen und Verbalnomen.",
        },
        questions: [
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«فتح الباب».",
              de: "Wähle das Instrument für „Türöffnen“.",
            },
            options: ["مِفْتَاحٌ", "فَاتِحٌ", "مَفْتُوحٌ", "فَتْحٌ"],
            correct: 0,
            explanation: {
              ar: "مفتاح آلة الفتح على وزن مفعال.",
              de: "Miftāḥ ist ein Werkzeug auf mifʿāl.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«نشر الخشب».",
              de: "Wähle das Instrument für „Holzsägen“.",
            },
            options: ["نَاشِرٌ", "مَنْشُورٌ", "نَشْرٌ", "مِنْشَارٌ"],
            correct: 3,
            explanation: {
              ar: "منشار على وزن مفعال.",
              de: "Minšār folgt mifʿāl.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«طرق المسمار».",
              de: "Wähle das Instrument für „Nägeleinschlagen“.",
            },
            options: ["مَطْرُوقٌ", "طَرْقٌ", "مِطْرَقَةٌ", "طَارِقٌ"],
            correct: 2,
            explanation: {
              ar: "مطرقة على وزن مفعلة.",
              de: "Miṭraqa folgt mifʿala.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«كنس الأرض».",
              de: "Wähle das Instrument für „Bodenfegen“.",
            },
            options: ["كَنْسٌ", "مِكْنَسَةٌ", "كَانِسٌ", "مَكْنُوسٌ"],
            correct: 1,
            explanation: {
              ar: "مكنسة آلة الكنس.",
              de: "Miknasa ist das Werkzeug zum Fegen.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«قص الورق».",
              de: "Wähle das Instrument für „Papierschneiden“.",
            },
            options: ["مِقَصٌّ", "قَاصٌّ", "مَقْصُوصٌ", "قَصٌّ"],
            correct: 0,
            explanation: {
              ar: "المقص آلة للقصّ.",
              de: "Miqaṣṣ ist die Schere zum Schneiden.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«ثقب الخشب».",
              de: "Wähle das Instrument für „Holzbohren“.",
            },
            options: ["ثَاقِبٌ", "مَثْقُوبٌ", "ثَقْبٌ", "مِثْقَابٌ"],
            correct: 3,
            explanation: {
              ar: "مثقاب على وزن مفعال.",
              de: "Miṯqāb folgt mifʿāl.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«برد المعدن».",
              de: "Wähle das Instrument für „Metallfeilen“.",
            },
            options: ["مَبْرُودٌ", "بَرْدٌ", "مِبْرَدٌ", "بَارِدٌ"],
            correct: 2,
            explanation: {
              ar: "المبرد أداة لبرد المعدن، على وزن مفعل.",
              de: "Mibrad ist eine Feile auf mifʿal.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«وزن الأشياء».",
              de: "Wähle das Instrument für „Wiegen“.",
            },
            options: ["وَزْنٌ", "مِيزَانٌ", "وَازِنٌ", "مَوْزُونٌ"],
            correct: 1,
            explanation: {
              ar: "ميزان اسم آلة، وفي بنائه إعلال.",
              de: "Mīzān ist ein Instrumentenname mit schwachem Stamm.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«كيل الحبوب».",
              de: "Wähle das Instrument für „Getreidemessen“.",
            },
            options: ["مِكْيَالٌ", "كَائِلٌ", "مَكِيلٌ", "كَيْلٌ"],
            correct: 0,
            explanation: {
              ar: "المكيال أداة للكيل.",
              de: "Mikyāl ist ein Messgefäß.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«حرث الأرض».",
              de: "Wähle das Instrument für „Pflügen“.",
            },
            options: ["حَارِثٌ", "مَحْرُوثٌ", "حَرْثٌ", "مِحْرَاثٌ"],
            correct: 3,
            explanation: {
              ar: "المحراث آلة الحرث على وزن مفعال.",
              de: "Miḥrāṯ ist der Pflug auf mifʿāl.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«غسل الثياب آلياً».",
              de: "Wähle das Instrument für „automatisches Wäschewaschen“.",
            },
            options: ["مَغْسُولٌ", "غَسْلٌ", "غَسَّالَةٌ", "غَاسِلٌ"],
            correct: 2,
            explanation: {
              ar: "غسّالة اسم آلة حديث على وزن فعّالة.",
              de: "Ġassāla ist ein moderner Instrumentenname auf faʿʿāla.",
            },
          },
          {
            prompt: {
              ar: "اختر اسم الآلة المناسب لـ«إجراء الحسابات إلكترونياً».",
              de: "Wähle das Instrument für „elektronische Berechnungen“.",
            },
            options: ["حِسَابٌ", "حَاسُوبٌ", "حَاسِبٌ", "مَحْسُوبٌ"],
            correct: 1,
            explanation: {
              ar: "حاسوب اسم آلة مستعمل حديثاً على وزن فاعول.",
              de: "Ḥāsūb ist ein moderner Instrumentenname auf fāʿūl.",
            },
          },
        ],
        category: "morphology",
      },
      {
        id: "intensive-participle",
        glyph: "صبور",
        title: {
          ar: "مبالغة اسم الفاعل",
          de: "Intensivformen des aktiven Partizips",
        },
        summary: {
          ar: "كثرة الفعل وقوّة الصفة بأوزان معروفة.",
          de: "Häufigkeit und Intensität ausdrücken.",
        },
        intro: {
          ar: "صيغ المبالغة أسماء مشتقّة تدلّ على كثرة الفعل أو قوّة الاتصاف بمعناه. من أشهر أوزانها فعّال ومفعال وفعول وفعيل وفعِل.",
          de: "Intensivformen bezeichnen häufiges Handeln oder eine starke Eigenschaft. Bekannte Muster sind faʿʿāl, mifʿāl, faʿūl, faʿīl und faʿil.",
        },
        sections: [
          {
            title: {
              ar: "الأوزان المشهورة",
              de: "Bekannte Muster",
            },
            body: {
              ar: "غفّار: فعّال؛ معطاء: مفعال؛ صبور: فعول؛ عليم: فعيل؛ حذِر: فعِل.",
              de: "Ġaffār, miʿṭāʾ, ṣabūr, ʿalīm und ḥaḏir zeigen die fünf bekannten Muster.",
            },
            examples: [
              {
                ar: "غَفَّارٌ · مِعْطَاءٌ · صَبُورٌ",
                de: "häufig vergebend · freigebig · sehr geduldig",
                focus: "صَبُورٌ",
              },
              {
                ar: "عَلِيمٌ · حَذِرٌ",
                de: "sehr wissend · sehr vorsichtig",
                focus: "عَلِيمٌ",
              },
            ],
          },
          {
            title: {
              ar: "المعنى والسياق",
              de: "Bedeutung und Kontext",
            },
            body: {
              ar: "ليست كل كلمة توافق وزناً ما صيغة مبالغة بالضرورة؛ فقد تشترك أوزان مع الصفة المشبّهة أو أسماء المهن. ننظر إلى الاشتقاق والمعنى والسياق.",
              de: "Nicht jedes Wort mit einem solchen Muster ist automatisch eine Intensivform. Muster überschneiden sich mit Eigenschaftswörtern oder Berufen; Ableitung und Kontext zählen.",
            },
            examples: [
              {
                ar: "صَابِرٌ ← صَبُورٌ",
                de: "geduldig → besonders geduldig",
                focus: "صَبُورٌ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "اعرف الوزن والمعنى معاً، ولا تحكم من عدد الحروف وحده.",
          de: "Lerne Form und Bedeutung zusammen; die Wortlänge allein genügt nicht.",
        },
        questions: [
          {
            prompt: {
              ar: "اختر صيغة تدلّ على كثرة الصبر.",
              de: "Welche Form bedeutet „sehr geduldig“?",
            },
            options: ["صَبُورٌ", "صَابِرٌ", "صَبْرٌ", "مَصْبُورٌ"],
            correct: 0,
            explanation: {
              ar: "صبور على وزن فعول تدلّ على المبالغة.",
              de: "Ṣabūr auf faʿūl drückt eine intensive Eigenschaft aus.",
            },
          },
          {
            prompt: {
              ar: "اختر صيغة تدلّ على كثرة العطاء.",
              de: "Welche Form bedeutet „sehr freigebig“?",
            },
            options: ["عَطَاءٌ", "إِعْطَاءٌ", "مُعْطًى", "مِعْطَاءٌ"],
            correct: 3,
            explanation: {
              ar: "معطاء من صيغ المبالغة على وزن مفعال.",
              de: "Miʿṭāʾ folgt dem Intensivmuster mifʿāl.",
            },
          },
          {
            prompt: {
              ar: "اختر صيغة تدلّ على كثرة الأكل.",
              de: "Welche Form bedeutet „viel essend“?",
            },
            options: ["أَكْلٌ", "مَأْكُولٌ", "أَكُولٌ", "آكِلٌ"],
            correct: 2,
            explanation: {
              ar: "أكول على وزن فعول.",
              de: "Akūl folgt faʿūl.",
            },
          },
          {
            prompt: {
              ar: "ما وزن «غفّار»؟",
              de: "Welches Muster hat ġaffār?",
            },
            options: ["فَعُولٌ", "فَعَّالٌ", "فَاعِلٌ", "مَفْعُولٌ"],
            correct: 1,
            explanation: {
              ar: "غفّار على وزن فعّال، مع تشديد العين.",
              de: "Ġaffār folgt faʿʿāl mit verdoppeltem mittleren Radikal.",
            },
          },
          {
            prompt: {
              ar: "ما وزن «شكور»؟",
              de: "Welches Muster hat šakūr?",
            },
            options: ["فَعُولٌ", "فَعَّالٌ", "فَاعِلٌ", "مِفْعَالٌ"],
            correct: 0,
            explanation: {
              ar: "شكور على وزن فعول.",
              de: "Šakūr folgt faʿūl.",
            },
          },
          {
            prompt: {
              ar: "ما وزن «عليم»؟",
              de: "Welches Muster hat ʿalīm?",
            },
            options: ["فَعُولٌ", "فَاعِلٌ", "مَفْعُولٌ", "فَعِيلٌ"],
            correct: 3,
            explanation: {
              ar: "عليم على وزن فعيل.",
              de: "ʿAlīm folgt faʿīl.",
            },
          },
          {
            prompt: {
              ar: "ما وزن «حَذِر»؟",
              de: "Welches Muster hat ḥaḏir?",
            },
            options: ["فَعَّالٌ", "فَاعِلٌ", "فَعِلٌ", "فَعُولٌ"],
            correct: 2,
            explanation: {
              ar: "حذِر على وزن فعِل، وهو من الأوزان المشهورة في هذا الباب.",
              de: "Ḥaḏir folgt faʿil, einem der traditionellen Muster.",
            },
          },
          {
            prompt: {
              ar: "ما وزن «مِقدام»؟",
              de: "Welches Muster hat miqdām?",
            },
            options: ["فَاعِلٌ", "مِفْعَالٌ", "فَعَّالٌ", "مَفْعُولٌ"],
            correct: 1,
            explanation: {
              ar: "مقدام على وزن مفعال.",
              de: "Miqdām folgt mifʿāl.",
            },
          },
          {
            prompt: {
              ar: "أي كلمة اسم فاعل قياسي، لا صيغة مبالغة من المعروض؟",
              de: "Welches Wort ist hier das reguläre aktive Partizip?",
            },
            options: ["كَاتِبٌ", "غَفَّارٌ", "صَبُورٌ", "مِعْطَاءٌ"],
            correct: 0,
            explanation: {
              ar: "كاتب على وزن فاعل، بخلاف صيغ المبالغة الثلاث الأخرى.",
              de: "Kātib folgt fāʿil; die anderen drei sind Intensivformen.",
            },
          },
          {
            prompt: {
              ar: "اختر المبالغة من «غافر».",
              de: "Wähle eine Intensivform zu ġāfir.",
            },
            options: ["مَغْفُورٌ", "غُفْرَانٌ", "مَغْفِرَةٌ", "غَفُورٌ"],
            correct: 3,
            explanation: {
              ar: "غفور مبالغة، ومغفور اسم مفعول.",
              de: "Ġafūr ist intensiv; maġfūr ist passiv.",
            },
          },
          {
            prompt: {
              ar: "اختر صيغة المبالغة الدالّة على كثرة الكذب.",
              de: "Wähle die Form für „häufig lügend“.",
            },
            options: ["كَذِبٌ", "تَكْذِيبٌ", "كَذَّابٌ", "كَاذِبٌ"],
            correct: 2,
            explanation: {
              ar: "كذّاب على وزن فعّال.",
              de: "Kaḏḏāb folgt faʿʿāl.",
            },
          },
          {
            prompt: {
              ar: "ما المعنى الذي تضيفه صيغة المبالغة غالباً؟",
              de: "Welche Bedeutung fügen Intensivformen häufig hinzu?",
            },
            options: [
              {
                ar: "اسم مكان فقط",
                de: "nur Ortsbezeichnung",
              },
              {
                ar: "كثرة الفعل أو قوّة الاتصاف به",
                de: "Häufigkeit oder Intensität",
              },
              {
                ar: "المثنّى فقط",
                de: "nur Dual",
              },
              {
                ar: "المجهول دائماً",
                de: "immer Passiv",
              },
            ],
            correct: 1,
            explanation: {
              ar: "تدلّ على كثرة وقوع الفعل أو قوّة الصفة بحسب السياق.",
              de: "Sie verstärken Häufigkeit oder Eigenschaft je nach Kontext.",
            },
          },
        ],
        category: "morphology",
      },
      {
        id: "word-classes",
        glyph: "اسم",
        title: {
          ar: "أقسام الكلمة",
          de: "Die drei Wortarten",
        },
        summary: {
          ar: "اسم وفعل وحرف، مع علامات كل قسم.",
          de: "Nomen, Verb und Partikel unterscheiden.",
        },
        intro: {
          ar: "تنقسم الكلمة في العربية إلى اسم وفعل وحرف. يدخل في الاسم الضمير واسم الإشارة واسم الاستفهام والاسم الموصول، ولا نحصره في أسماء الأشياء المحسوسة.",
          de: "Arabische Wörter werden als Nomen, Verb oder Partikel eingeordnet. Zu den Nomen zählen auch Pronomen, Demonstrativa, Interrogativa und Relativpronomen.",
        },
        sections: [
          {
            title: {
              ar: "الاسم",
              de: "Das Nomen",
            },
            body: {
              ar: "يدلّ على معنى في نفسه غير مقترن بزمن. من علاماته قبول الجرّ أو التنوين أو الـ، ولا يلزم أن يقبل كل اسم جميع العلامات.",
              de: "Ein Nomen ist nicht an eine Zeit gebunden. Typische Merkmale sind Genitiv, Tanwīn oder Artikel; nicht jedes Nomen erlaubt alle Merkmale.",
            },
            examples: [
              {
                ar: "كِتَابٌ · أَنَا · هَذَا",
                de: "Buch · ich · dies",
                focus: "أَنَا",
              },
            ],
          },
          {
            title: {
              ar: "الفعل",
              de: "Das Verb",
            },
            body: {
              ar: "يدلّ على حدث مقترن بزمن أو طلب. الماضي يقبل تاء الفاعل، والمضارع يقبل لم، والأمر يدلّ على الطلب ويقبل ياء المخاطبة في صور مناسبة.",
              de: "Verben bezeichnen ein Geschehen oder eine Aufforderung. Das Perfekt erlaubt das Subjekt-Tā, das Präsens kann auf lam folgen, und der Imperativ drückt eine Aufforderung aus.",
            },
            examples: [
              {
                ar: "كَتَبْتُ · لَمْ يَكْتُبْ · اُكْتُبِي",
                de: "Perfekt · negiertes Präsens · Imperativ",
                focus: "اُكْتُبِي",
              },
            ],
          },
          {
            title: {
              ar: "الحرف",
              de: "Die Partikel",
            },
            body: {
              ar: "يدلّ على معنى مع غيره، مثل حروف الجرّ والنفي والاستفهام. لا يقبل علامات الاسم ولا علامات الفعل.",
              de: "Partikeln erhalten ihre Funktion im Zusammenhang, etwa als Präposition, Negation oder Fragepartikel.",
            },
            examples: [
              {
                ar: "فِي · لَمْ · هَلْ",
                de: "in · nicht (mit Jussiv) · Fragepartikel",
                focus: "فِي",
              },
            ],
          },
        ],
        takeaway: {
          ar: "الضمير اسم، والأمر فعل، وليس كل استفهام حرفاً.",
          de: "Ein Pronomen ist ein Nomen, der Imperativ ein Verb; nicht jedes Fragewort ist eine Partikel.",
        },
        questions: [
          {
            prompt: {
              ar: "ما قسم كلمة «كِتَابٌ»؟",
              de: "Welche Wortart hat „كِتَابٌ“?",
            },
            options: [
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "حرف",
                de: "Partikel",
              },
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
            ],
            correct: 0,
            explanation: {
              ar: "كتاب اسم يقبل التنوين والتعريف بالـ.",
              de: "Kitāb ist ein Nomen und kann Tanwīn oder einen Artikel tragen.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «الطَّالِبُ»؟",
              de: "Welche Wortart hat „الطَّالِبُ“?",
            },
            options: [
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "حرف",
                de: "Partikel",
              },
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
              {
                ar: "اسم",
                de: "Nomen",
              },
            ],
            correct: 3,
            explanation: {
              ar: "الطالب اسم معرّف بالـ.",
              de: "Aṭ-ṭālib ist ein Nomen mit Artikel.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «أَنَا»؟",
              de: "Welche Wortart hat „أَنَا“?",
            },
            options: [
              {
                ar: "حرف",
                de: "Partikel",
              },
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "فعل",
                de: "Verb",
              },
            ],
            correct: 2,
            explanation: {
              ar: "الضمير من الأسماء، وليس قسماً رابعاً.",
              de: "Pronomen gehören zu den Nomen; sie sind keine vierte Wortart.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «هَذَا»؟",
              de: "Welche Wortart hat „هَذَا“?",
            },
            options: [
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "حرف",
                de: "Partikel",
              },
            ],
            correct: 1,
            explanation: {
              ar: "اسم الإشارة من الأسماء.",
              de: "Demonstrativpronomen gehören zu den Nomen.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «كَيْفَ»؟",
              de: "Welche Wortart hat „كَيْفَ“?",
            },
            options: [
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "حرف",
                de: "Partikel",
              },
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
            ],
            correct: 0,
            explanation: {
              ar: "كيف اسم استفهام، وليست حرفاً.",
              de: "Kaifa ist ein interrogatives Nomen, keine Partikel.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «كَتَبَ»؟",
              de: "Welche Wortart hat „كَتَبَ“?",
            },
            options: [
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "حرف",
                de: "Partikel",
              },
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
              {
                ar: "اسم",
                de: "Nomen",
              },
            ],
            correct: 0,
            explanation: {
              ar: "كتب فعل ماضٍ يدلّ على حدث وزمن.",
              de: "Kataba ist ein Verb im Perfekt.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «يَكْتُبُ»؟",
              de: "Welche Wortart hat „يَكْتُبُ“?",
            },
            options: [
              {
                ar: "حرف",
                de: "Partikel",
              },
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "فعل",
                de: "Verb",
              },
            ],
            correct: 3,
            explanation: {
              ar: "يكتب فعل مضارع.",
              de: "Yaktubu ist ein Präsensverb.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «اُكْتُبْ»؟",
              de: "Welche Wortart hat „اُكْتُبْ“?",
            },
            options: [
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "حرف",
                de: "Partikel",
              },
            ],
            correct: 2,
            explanation: {
              ar: "اكتب فعل أمر، والفعل ليس ماضياً فقط.",
              de: "Uktub ist ein Imperativ; auch dieser ist ein Verb.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «فِي»؟",
              de: "Welche Wortart hat „فِي“?",
            },
            options: [
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "حرف",
                de: "Partikel",
              },
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
            ],
            correct: 2,
            explanation: {
              ar: "في حرف جرّ لا يستقلّ معناه عن التركيب.",
              de: "Fī ist eine Präposition.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «إِلَى»؟",
              de: "Welche Wortart hat „إِلَى“?",
            },
            options: [
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "حرف",
                de: "Partikel",
              },
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
              {
                ar: "اسم",
                de: "Nomen",
              },
            ],
            correct: 1,
            explanation: {
              ar: "إلى حرف جرّ.",
              de: "Ilā ist eine Präposition.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «لَمْ»؟",
              de: "Welche Wortart hat „لَمْ“?",
            },
            options: [
              {
                ar: "حرف",
                de: "Partikel",
              },
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "فعل",
                de: "Verb",
              },
            ],
            correct: 0,
            explanation: {
              ar: "لم حرف نفي وجزم وقلب.",
              de: "Lam ist eine Negations- und Jussivpartikel.",
            },
          },
          {
            prompt: {
              ar: "ما قسم كلمة «هَلْ»؟",
              de: "Welche Wortart hat „هَلْ“?",
            },
            options: [
              {
                ar: "جملة",
                de: "ganzer Satz",
              },
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "حرف",
                de: "Partikel",
              },
            ],
            correct: 3,
            explanation: {
              ar: "هل حرف استفهام.",
              de: "Hal ist eine Fragepartikel.",
            },
          },
        ],
        category: "basics",
      },
      {
        id: "sentence-types",
        glyph: "جملة",
        title: {
          ar: "أنواع الجمل: اسمية وفعلية",
          de: "Nominal- und Verbalsätze",
        },
        summary: {
          ar: "نعرف بنية الجملة، لا نوع كلمتها الأولى فقط.",
          de: "Die Satzstruktur erkennen, nicht nur das erste Wort.",
        },
        intro: {
          ar: "الجملة الاسمية أصلها مبتدأ وخبر، والجملة الفعلية أساسها فعل وفاعل أو نائب فاعل. قد يأتي خبر الاسمية جملة فعلية أو شبه جملة، وقد يتقدّم الخبر.",
          de: "Der Nominalsatz hat Subjekt und Prädikat, der Verbalsatz Verb und Subjekt oder Passivsubjekt. Das Prädikat eines Nominalsatzes kann selbst ein Verbalsatz oder eine Präpositionalgruppe sein.",
        },
        sections: [
          {
            title: {
              ar: "الجملة الاسمية",
              de: "Der Nominalsatz",
            },
            body: {
              ar: "الطالب مجتهد مبتدأ وخبر. وفي الطالب يكتب، يكتب مع فاعله المستتر جملة في محل رفع خبر.",
              de: "Aṭ-ṭālibu muǧtahidun hat ein nominales Prädikat. In aṭ-ṭālibu yaktubu bildet das Verb mit seinem impliziten Subjekt das Prädikat.",
            },
            examples: [
              {
                ar: "الطَّالِبُ مُجْتَهِدٌ.",
                de: "Der Schüler ist fleißig.",
                focus: "مُجْتَهِدٌ",
              },
              {
                ar: "الطَّالِبُ يَكْتُبُ.",
                de: "Der Schüler schreibt · nominaler Gesamtsatz.",
                focus: "الطَّالِبُ",
              },
            ],
          },
          {
            title: {
              ar: "الجملة الفعلية",
              de: "Der Verbalsatz",
            },
            body: {
              ar: "قد تبدأ بماضٍ أو مضارع أو أمر: كتب الطالب، يكتب الطالب، اكتب. في الأمر يكون الفاعل غالباً ضميراً مستتراً.",
              de: "Ein Verbalsatz kann mit Perfekt, Präsens oder Imperativ beginnen. Beim Imperativ ist das Subjekt meist implizit.",
            },
            examples: [
              {
                ar: "كَتَبَ الطَّالِبُ رِسَالَةً.",
                de: "Der Schüler schrieb einen Brief.",
                focus: "كَتَبَ",
              },
            ],
          },
          {
            title: {
              ar: "تقديم الخبر",
              de: "Vorangestelltes Prädikat",
            },
            body: {
              ar: "في البيت رجل جملة اسمية رغم بدايتها بحرف جرّ؛ الجار والمجرور خبر مقدّم، ورجل مبتدأ مؤخّر.",
              de: "Fī l-baiti raǧulun bleibt ein Nominalsatz trotz Präposition am Anfang: vorangestelltes Prädikat und nachgestelltes Subjekt.",
            },
            examples: [
              {
                ar: "فِي الْبَيْتِ رَجُلٌ.",
                de: "Im Haus ist ein Mann.",
                focus: "رَجُلٌ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "ميّز الجملة الكبرى من الجملة التي تقع خبراً داخلها.",
          de: "Unterscheide den Gesamtsatz vom eingebetteten Prädikatsatz.",
        },
        questions: [
          {
            prompt: {
              ar: "ما نوع الجملة: «الْجَوُّ جَمِيلٌ.»؟",
              de: "Welcher Satztyp ist „الْجَوُّ جَمِيلٌ.“?",
            },
            options: [
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
            ],
            correct: 0,
            explanation: {
              ar: "المبتدأ الجوّ، والخبر جميل.",
              de: "Al-ǧawwu ist Subjekt, ǧamīlun Prädikat.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «الطَّالِبُ مُجْتَهِدٌ.»؟",
              de: "Welcher Satztyp ist „الطَّالِبُ مُجْتَهِدٌ.“?",
            },
            options: [
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
            ],
            correct: 3,
            explanation: {
              ar: "تتركّب من مبتدأ وخبر.",
              de: "Der Satz besteht aus Subjekt und Prädikat.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «الطَّالِبُ يَكْتُبُ.»؟",
              de: "Welcher Satztyp ist „الطَّالِبُ يَكْتُبُ.“?",
            },
            options: [
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
            ],
            correct: 2,
            explanation: {
              ar: "بدأت باسم مسند إليه، والجملة الفعلية بعده خبر.",
              de: "Das Nomen ist das Subjekt; der folgende Verbalsatz ist sein Prädikat.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «الْبِنْتُ تَقْرَأُ.»؟",
              de: "Welcher Satztyp ist „الْبِنْتُ تَقْرَأُ.“?",
            },
            options: [
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
            ],
            correct: 1,
            explanation: {
              ar: "جملة تقرأ خبر عن البنت؛ فالجملة الكبرى اسمية.",
              de: "Der Verbalsatz taqraʾu ist Prädikat zum Nomen; der Gesamtsatz ist nominal.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «فِي الْبَيْتِ رَجُلٌ.»؟",
              de: "Welcher Satztyp ist „فِي الْبَيْتِ رَجُلٌ.“?",
            },
            options: [
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
            ],
            correct: 0,
            explanation: {
              ar: "في البيت خبر مقدّم، ورجل مبتدأ مؤخّر.",
              de: "Die Präpositionalgruppe ist vorangestelltes Prädikat, raǧulun nachgestelltes Subjekt.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «عَلَى الطَّاوِلَةِ كِتَابٌ.»؟",
              de: "Welcher Satztyp ist „عَلَى الطَّاوِلَةِ كِتَابٌ.“?",
            },
            options: [
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
            ],
            correct: 3,
            explanation: {
              ar: "خبر شبه جملة مقدّم ومبتدأ مؤخّر.",
              de: "Präpositionalgruppe als vorangestelltes Prädikat, danach das Subjekt.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «كَتَبَ الطَّالِبُ.»؟",
              de: "Welcher Satztyp ist „كَتَبَ الطَّالِبُ.“?",
            },
            options: [
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
            ],
            correct: 3,
            explanation: {
              ar: "فعل ماضٍ ثم فاعل.",
              de: "Perfektverb und danach das Subjekt.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «يَقْرَأُ الطِّفْلُ.»؟",
              de: "Welcher Satztyp ist „يَقْرَأُ الطِّفْلُ.“?",
            },
            options: [
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
            ],
            correct: 2,
            explanation: {
              ar: "فعل مضارع ثم فاعل.",
              de: "Präsensverb und danach das Subjekt.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «اِفْتَحِ الْبَابَ.»؟",
              de: "Welcher Satztyp ist „اِفْتَحِ الْبَابَ.“?",
            },
            options: [
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
            ],
            correct: 1,
            explanation: {
              ar: "فعل أمر وفاعله ضمير مستتر.",
              de: "Imperativ mit einem impliziten Subjekt.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «سَافَرَ أَخِي.»؟",
              de: "Welcher Satztyp ist „سَافَرَ أَخِي.“?",
            },
            options: [
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
            ],
            correct: 0,
            explanation: {
              ar: "سافر فعل، وأخي فاعل.",
              de: "Sāfara ist das Verb, aḫī sein Subjekt.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «يَلْعَبُ الْوَلَدُ.»؟",
              de: "Welcher Satztyp ist „يَلْعَبُ الْوَلَدُ.“?",
            },
            options: [
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
            ],
            correct: 3,
            explanation: {
              ar: "فعل مضارع وفاعل ظاهر.",
              de: "Präsensverb mit ausdrücklich genanntem Subjekt.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الجملة: «دَخَلَ الْمُعَلِّمُ.»؟",
              de: "Welcher Satztyp ist „دَخَلَ الْمُعَلِّمُ.“?",
            },
            options: [
              {
                ar: "حرف جرّ فقط",
                de: "nur eine Präposition",
              },
              {
                ar: "اسمية",
                de: "Nominalsatz",
              },
              {
                ar: "فعلية",
                de: "Verbalsatz",
              },
              {
                ar: "كلمة مفردة",
                de: "einzelnes Wort",
              },
            ],
            correct: 2,
            explanation: {
              ar: "دخل فعل، والمعلّم فاعله.",
              de: "Daḫala ist das Verb, al-muʿallimu sein Subjekt.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "relative-pronouns",
        glyph: "الذي",
        title: {
          ar: "الأسماء الموصولة",
          de: "Relativpronomen",
        },
        summary: {
          ar: "نربط الاسم بجملة توضّحه، مع صلة وعائد.",
          de: "Ein Nomen durch einen Relativsatz näher bestimmen.",
        },
        intro: {
          ar: "الاسم الموصول يحتاج إلى صلة بعده توضّح معناه، وتشتمل الصلة على عائد يربطها به، ظاهر أو مستتر. مثل جاء الذي أكرمتُه.",
          de: "Ein Relativpronomen wird durch einen Relativsatz ergänzt. Dieser enthält einen ausgesprochenen oder impliziten Rückverweis, etwa das -hu in „derjenige, den ich ehrte“.",
        },
        sections: [
          {
            title: {
              ar: "المفرد والجمع",
              de: "Singular und Plural",
            },
            body: {
              ar: "الذي للمذكّر المفرد، والتي للمؤنّث المفرد، والذين لجمع المذكّر العاقل، واللاتي واللائي واللواتي لجمع المؤنّث.",
              de: "Allaḏī ist maskulin Singular, allatī feminin Singular, allaḏīna menschlicher maskuliner Plural; allātī, allāʾī und allawātī sind feminine Pluralformen.",
            },
            examples: [
              {
                ar: "الطَّالِبُ الَّذِي نَجَحَ",
                de: "der Schüler, der bestand",
                focus: "الَّذِي",
              },
              {
                ar: "الطَّالِبَةُ الَّتِي نَجَحَتْ",
                de: "die Schülerin, die bestand",
                focus: "الَّتِي",
              },
            ],
          },
          {
            title: {
              ar: "المثنّى والإعراب",
              de: "Dual und Kasus",
            },
            body: {
              ar: "اللذان واللتان في الرفع، واللذين واللتين في النصب والجرّ. هذه المثنّيات معربة، بخلاف الأسماء الموصولة المبنية الأخرى.",
              de: "Allaḏāni und allatāni stehen im Nominativ, allaḏaini und allataini im Akkusativ und Genitiv. Diese Dualformen sind deklinierbar.",
            },
            examples: [
              {
                ar: "جَاءَ اللَّذَانِ نَجَحَا.",
                de: "Die beiden, die bestanden, kamen.",
                focus: "اللَّذَانِ",
              },
              {
                ar: "رَأَيْتُ اللَّذَيْنِ نَجَحَا.",
                de: "Ich sah die beiden, die bestanden.",
                focus: "اللَّذَيْنِ",
              },
            ],
          },
          {
            title: {
              ar: "صلة الموصول والعائد",
              de: "Relativsatz und Rückverweis",
            },
            body: {
              ar: "صلة الموصول جملة أو شبه جملة توضّح معناه ولا محلّ لها من الإعراب. والعائد ضمير ظاهر أو مستتر داخل الصلة يعود على الاسم الموصول. في «هذا الكتاب الذي قرأته» الصلة «قرأته»، والعائد الهاء، وليست الصلة كلمة «الذي». ومن وما موصولان مشتركان؛ من للعاقل وما لغير العاقل غالبًا.",
              de: "Die Ṣila erläutert das Relativpronomen und hat selbst keinen Kasusplatz. Ein ausdrückliches oder implizites Pronomen innerhalb der Ṣila verweist auf das Relativpronomen zurück. In „Dieses Buch, das ich las“ ist qaraʾtuhu die Ṣila und -hu der Rückverweis; allaḏī selbst gehört nicht zur Ṣila. Man bezieht sich meist auf Personen, mā meist auf Dinge.",
            },
            examples: [
              {
                ar: "هَذَا الْكِتَابُ الَّذِي قَرَأْتُهُ.",
                de: "Dies ist das Buch, das ich gelesen habe.",
                focus: "قَرَأْتُهُ",
                note: {
                  ar: "الاسم الموصول: الذي. الصلة: جملة قرأتُهُ. العائد: الهاء في قرأتُهُ، ضمير مفعول به يعود على الذي، ومرجعه الكتاب.",
                  de: "Relativpronomen: allaḏī. Ṣila: qaraʾtuhu. Rückverweis: -hu als Objektpronomen mit Bezug auf das Buch.",
                },
              },
              {
                ar: "أَحْتَرِمُ مَنْ يُسَاعِدُ النَّاسَ.",
                de: "Ich respektiere, wer den Menschen hilft.",
                focus: "مَنْ",
                note: {
                  ar: "من موصول للعاقل. الصلة: يساعد الناس. العائد: الضمير المستتر هو، فاعل يساعد، يعود على من.",
                  de: "Man bezieht sich hier auf eine Person. Ṣila: yusāʿidu an-nāsa. Rückverweis: das implizite Subjekt „er“ im Verb.",
                },
              },
              {
                ar: "قَرَأْتُ مَا كَتَبْتَهُ.",
                de: "Ich las, was du geschrieben hast.",
                focus: "هُ",
                note: {
                  ar: "ما موصول لغير العاقل هنا. الصلة: كتبتَه. العائد: الهاء المتصلة بالفعل، في محل نصب مفعول به.",
                  de: "Mā bezieht sich hier auf Geschriebenes. Ṣila: katabtahu. Rückverweis: das angehängte Objektpronomen -hu.",
                },
              },
            ],
          },
        ],
        takeaway: {
          ar: "طابق الموصول مع مرجعه، وابحث عن الصلة والعائد.",
          de: "Stimme das Relativpronomen mit seinem Bezug ab und finde Satz und Rückverweis.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل: هذا الطالب ___ نجح.",
              de: "Wähle das Relativpronomen für einen Schüler.",
            },
            options: ["الَّذِي", "الَّتِي", "الَّذِينَ", "اللَّتَانِ"],
            correct: 0,
            explanation: {
              ar: "الذي للمفرد المذكّر.",
              de: "Allaḏī gehört zum maskulinen Singular.",
            },
          },
          {
            prompt: {
              ar: "أكمل: هذه الطالبة ___ نجحت.",
              de: "Wähle das Relativpronomen für eine Schülerin.",
            },
            options: ["الَّذِي", "الَّذِينَ", "اللَّذَانِ", "الَّتِي"],
            correct: 3,
            explanation: {
              ar: "التي للمفرد المؤنّث.",
              de: "Allatī gehört zum femininen Singular.",
            },
          },
          {
            prompt: {
              ar: "أكمل: جاء الطالبان ___ نجحا.",
              de: "Wähle für zwei Schüler als Subjekt.",
            },
            options: ["الَّذِينَ", "الَّذِي", "اللَّذَانِ", "اللَّذَيْنِ"],
            correct: 2,
            explanation: {
              ar: "اللذان مثنّى مرفوع بالألف.",
              de: "Allaḏāni steht im Dual Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: رأيت الطالبين ___ نجحا.",
              de: "Wähle für zwei Schüler als Objekt.",
            },
            options: ["الَّتِي", "اللَّذَيْنِ", "اللَّذَانِ", "الَّذِينَ"],
            correct: 1,
            explanation: {
              ar: "اللذين مثنّى منصوب بالياء.",
              de: "Allaḏaini steht im Dual Akkusativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: جاءت الطالبتان ___ نجحتا.",
              de: "Wähle für zwei Schülerinnen als Subjekt.",
            },
            options: ["اللَّتَانِ", "اللَّتَيْنِ", "الَّتِي", "الَّذِينَ"],
            correct: 0,
            explanation: {
              ar: "اللتان للمثنّى المؤنّث المرفوع.",
              de: "Allatāni steht im femininen Dual Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: مررت بالطالبتين ___ تفوّقتا.",
              de: "Wähle für zwei Schülerinnen nach einer Präposition.",
            },
            options: ["اللَّتَانِ", "الَّتِي", "الَّذَانِ", "اللَّتَيْنِ"],
            correct: 3,
            explanation: {
              ar: "اللتين للمثنّى المؤنّث المجرور.",
              de: "Allataini steht im femininen Dual Genitiv.",
            },
          },
          {
            prompt: {
              ar: "أكمل: هؤلاء الطلاب ___ نجحوا.",
              de: "Wähle für mehrere männliche Schüler.",
            },
            options: ["الَّتِي", "اللَّذَانِ", "الَّذِينَ", "الَّذِي"],
            correct: 2,
            explanation: {
              ar: "الذين لجمع المذكّر العاقل.",
              de: "Allaḏīna gehört zum menschlichen maskulinen Plural.",
            },
          },
          {
            prompt: {
              ar: "أكمل: هؤلاء الطالبات ___ نجحن.",
              de: "Wähle für mehrere Schülerinnen.",
            },
            options: ["اللَّذَانِ", "اللَّاتِي", "الَّذِي", "الَّذِينَ"],
            correct: 1,
            explanation: {
              ar: "اللاتي لجمع المؤنّث، وتصحّ أيضاً اللائي واللواتي.",
              de: "Allātī gehört zum femininen Plural; allāʾī und allawātī sind ebenfalls gebräuchlich.",
            },
          },
          {
            prompt: {
              ar: "ما العائد في «هذا الكتاب الذي قرأتُهُ»؟",
              de: "Was ist der Rückverweis in „Dieses Buch, das ich gelesen habe“?",
            },
            options: [
              {
                ar: "الهاء في قرأتُهُ",
                de: "das Objektpronomen -hu in qaraʾtuhu",
              },
              {
                ar: "اسم الإشارة هذا",
                de: "das Demonstrativum hāḏā",
              },
              {
                ar: "كلمة الكتاب",
                de: "das Wort al-kitāb",
              },
              {
                ar: "الاسم الموصول الذي نفسه",
                de: "das Relativpronomen allaḏī selbst",
              },
            ],
            correct: 0,
            explanation: {
              ar: "الهاء ضمير مفعول به داخل الصلة، يعود على الذي، ومرجعه الكتاب.",
              de: "-Hu ist das Objektpronomen innerhalb der Ṣila und verweist über allaḏī auf das Buch zurück.",
            },
          },
          {
            prompt: {
              ar: "ما صلة الموصول في «هذا الكتاب الذي قرأتُهُ»؟",
              de: "Welche Wörter bilden die Ṣila in diesem Satz?",
            },
            options: [
              {
                ar: "الاسم الموصول الذي",
                de: "das Relativpronomen allaḏī",
              },
              {
                ar: "جملة قرأتُهُ",
                de: "der Satz qaraʾtuhu",
              },
              {
                ar: "هذا الكتاب",
                de: "hāḏā al-kitāb",
              },
              {
                ar: "الهاء وحدها",
                de: "nur das Pronomen -hu",
              },
            ],
            correct: 1,
            explanation: {
              ar: "الصلة جملة قرأتُهُ، ولا محل لها من الإعراب. الهاء داخلها هي العائد، والاسم الموصول نفسه خارج الصلة.",
              de: "Die Ṣila ist qaraʾtuhu und hat keinen eigenen Kasusplatz. -Hu ist darin der Rückverweis; das Relativpronomen selbst gehört nicht zur Ṣila.",
            },
          },
          {
            prompt: {
              ar: "أكمل: أحترمُ ___ يساعد الناس.",
              de: "Ergänze: Ich achte denjenigen, der Menschen hilft.",
            },
            options: ["فِي", "لَنْ", "مَنْ", "مَا"],
            correct: 2,
            explanation: {
              ar: "من اسم موصول يستعمل للعاقل غالباً.",
              de: "Man ist hier ein Relativpronomen für Personen.",
            },
          },
          {
            prompt: {
              ar: "أكمل: قرأتُ ___ كتبتَه.",
              de: "Ergänze: Ich las, was du geschrieben hast.",
            },
            options: ["إِلَى", "مَا", "مَنْ", "فِي"],
            correct: 1,
            explanation: {
              ar: "ما اسم موصول يستعمل لغير العاقل غالباً.",
              de: "Mā bezieht sich hier auf eine Sache.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "prepositions",
        glyph: "في",
        title: {
          ar: "حروف الجرّ",
          de: "Präpositionen",
        },
        summary: {
          ar: "المعنى والاسم المجرور وعلاماته.",
          de: "Bedeutung und Genitiv richtig verbinden.",
        },
        intro: {
          ar: "من حروف الجرّ الشائعة: من، إلى، عن، على، في، الباء، الكاف، اللام. تدخل على الاسم فتجرّه، وقد تتصل بضمير مثل به ولها.",
          de: "Häufige Präpositionen sind min, ilā, ʿan, ʿalā, fī, bi-, ka- und li-. Sie verlangen ein Nomen oder Pronomen im Genitiv.",
        },
        sections: [
          {
            title: {
              ar: "معانٍ في السياق",
              de: "Bedeutung im Kontext",
            },
            body: {
              ar: "من للابتداء وإلى للانتهاء وفي للظرفية وعلى للاستعلاء في أمثلة مألوفة. وقد يختلف معنى الحرف باختلاف السياق.",
              de: "Typisch sind min für Ausgang, ilā für Ziel, fī für Inneres und ʿalā für Oberfläche. Die genaue Bedeutung hängt vom Kontext ab.",
            },
            examples: [
              {
                ar: "خَرَجْتُ مِنَ الْبَيْتِ إِلَى الْمَدْرَسَةِ.",
                de: "Ich ging vom Haus zur Schule.",
                focus: "إِلَى",
              },
              {
                ar: "الْكِتَابُ عَلَى الطَّاوِلَةِ.",
                de: "Das Buch liegt auf dem Tisch.",
                focus: "عَلَى",
              },
            ],
          },
          {
            title: {
              ar: "الجرّ لا يكون بالكسرة دائماً",
              de: "Genitiv heißt nicht immer Kasra",
            },
            body: {
              ar: "الكسرة علامة أصلية، والياء علامة جرّ المثنّى وجمع المذكّر السالم والأسماء الخمسة بشروطها. وقد تكون الفتحة نيابة عن الكسرة في الممنوع من الصرف بشروطه.",
              de: "Kasra ist das Grundzeichen; Dual, regelmäßiger maskuliner Plural und die fünf besonderen Nomen verwenden Yā. Bestimmte Diptota verwenden unter ihren Bedingungen Fatḥa.",
            },
            examples: [
              {
                ar: "فِي الْمَدْرَسَةِ · إِلَى مُعَلِّمَيْنِ · إِلَى أَبِيكَ",
                de: "Kasra · Dual-Yā · Yā bei den fünf Nomen",
                focus: "أَبِيكَ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "حدّد معنى الحرف في الجملة، ثم اختر علامة الجرّ المناسبة للاسم.",
          de: "Bestimme zuerst die Bedeutung der Präposition, dann das richtige Genitivzeichen.",
        },
        questions: [
          {
            prompt: {
              ar: "اختر حرف الجرّ الذي يدلّ هنا على وجهة السفر: سافرتُ ___ القاهرة.",
              de: "Wähle die Präposition für das Reiseziel.",
            },
            options: ["إِلَى", "مِنْ", "عَنْ", "فِي"],
            correct: 0,
            explanation: {
              ar: "إلى تدلّ هنا على انتهاء الغاية.",
              de: "Ilā bezeichnet hier das Ziel.",
            },
          },
          {
            prompt: {
              ar: "اختر حرف الجرّ الذي يبيّن مكان الانطلاق: خرجتُ ___ البيت.",
              de: "Wähle für den Ausgangsort.",
            },
            options: ["إِلَى", "عَنْ", "لِـ", "مِنَ"],
            correct: 3,
            explanation: {
              ar: "من تدلّ على ابتداء الغاية المكانية.",
              de: "Min bezeichnet den räumlichen Ausgangspunkt.",
            },
          },
          {
            prompt: {
              ar: "أكمل بمعنى داخل: الكتاب ___ الحقيبة.",
              de: "Ergänze im Sinn von „innerhalb“.",
            },
            options: ["مِنْ", "إِلَى", "فِي", "عَلَى"],
            correct: 2,
            explanation: {
              ar: "في للظرفية هنا.",
              de: "Fī bezeichnet hier das Innere.",
            },
          },
          {
            prompt: {
              ar: "أكمل بمعنى فوق: الكتاب ___ الطاولة.",
              de: "Ergänze im Sinn von „auf der Oberfläche“.",
            },
            options: ["إِلَى", "عَلَى", "مِنْ", "عَنْ"],
            correct: 1,
            explanation: {
              ar: "على للاستعلاء في هذا المثال.",
              de: "ʿAlā bezeichnet hier die Oberfläche.",
            },
          },
          {
            prompt: {
              ar: "أكمل بحرف الاستعانة: كتبتُ ___ القلم.",
              de: "Wähle die Präposition für das verwendete Werkzeug.",
            },
            options: ["بِـ", "إِلَى", "عَنْ", "مِنْ"],
            correct: 0,
            explanation: {
              ar: "الباء تدلّ هنا على الاستعانة بالقلم.",
              de: "Bi- bezeichnet hier das Hilfsmittel.",
            },
          },
          {
            prompt: {
              ar: "أكمل بحرف الملكية: هذا كتاب ___ سارة.",
              de: "Wähle die Präposition für den Besitz.",
            },
            options: ["إِلَى", "عَلَى", "مِنْ", "لِـ"],
            correct: 3,
            explanation: {
              ar: "اللام تدلّ هنا على الملكية.",
              de: "Li- bezeichnet hier Besitz.",
            },
          },
          {
            prompt: {
              ar: "اختر حرف التشبيه: وجهه ___ القمر.",
              de: "Wähle die Vergleichspräposition.",
            },
            options: ["إِلَى", "عَنْ", "كَـ", "مِنْ"],
            correct: 2,
            explanation: {
              ar: "الكاف للتشبيه.",
              de: "Ka- bedeutet hier „wie“.",
            },
          },
          {
            prompt: {
              ar: "أكمل بمعنى الاستفسار بشأنه: سألتُ ___ الصديق.",
              de: "Ergänze im Sinn von „nach dem Freund fragen“.",
            },
            options: ["كَـ", "عَنِ", "فِي", "عَلَى"],
            correct: 1,
            explanation: {
              ar: "عن تدلّ هنا على موضوع السؤال.",
              de: "ʿAn bezeichnet hier das Thema der Nachfrage.",
            },
          },
          {
            prompt: {
              ar: "ما إعراب «المدرسةِ» في «في المدرسةِ»؟",
              de: "Welchen Kasus hat al-madrasa nach fī?",
            },
            options: [
              {
                ar: "اسم مجرور بالكسرة",
                de: "Genitiv mit Kasra",
              },
              {
                ar: "فاعل مرفوع",
                de: "Subjekt im Nominativ",
              },
              {
                ar: "مفعول منصوب",
                de: "Objekt im Akkusativ",
              },
              {
                ar: "فعل مضارع",
                de: "Präsensverb",
              },
            ],
            correct: 0,
            explanation: {
              ar: "حرف الجرّ يجرّ الاسم بعده.",
              de: "Die Präposition verlangt den Genitiv.",
            },
          },
          {
            prompt: {
              ar: "علامة الجرّ في «إلى معلّمَيْنِ» هي:",
              de: "Welches Genitivzeichen steht im Dual?",
            },
            options: [
              {
                ar: "الألف",
                de: "Alif",
              },
              {
                ar: "الواو",
                de: "Wāw",
              },
              {
                ar: "الضمة",
                de: "Ḍamma",
              },
              {
                ar: "الياء",
                de: "Yā",
              },
            ],
            correct: 3,
            explanation: {
              ar: "المثنّى يجرّ بالياء.",
              de: "Der Dual hat im Genitiv Yā.",
            },
          },
          {
            prompt: {
              ar: "علامة الجرّ في «بالمعلِّمينَ» هي:",
              de: "Welches Genitivzeichen hat der regelmäßige maskuline Plural?",
            },
            options: [
              {
                ar: "الألف",
                de: "Alif",
              },
              {
                ar: "ثبوت النون",
                de: "Nūn-Erhalt",
              },
              {
                ar: "الياء",
                de: "Yā",
              },
              {
                ar: "الواو",
                de: "Wāw",
              },
            ],
            correct: 2,
            explanation: {
              ar: "جمع المذكّر السالم يجرّ بالياء، لا بالكسرة.",
              de: "Der regelmäßige maskuline Plural verwendet im Genitiv Yā.",
            },
          },
          {
            prompt: {
              ar: "الهاء في «به» هي:",
              de: "Was ist das -hi in bihi?",
            },
            options: [
              {
                ar: "فعل",
                de: "Verb",
              },
              {
                ar: "ضمير متصل في محل جرّ بالباء",
                de: "Pronomen im Genitiv nach bi-",
              },
              {
                ar: "فاعل مرفوع",
                de: "Subjekt im Nominativ",
              },
              {
                ar: "حرف جرّ آخر",
                de: "weitere Präposition",
              },
            ],
            correct: 1,
            explanation: {
              ar: "الضمير متصل بحرف الجرّ في محل جرّ.",
              de: "Das an die Präposition angehängte Pronomen steht im Genitiv.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "defective-verbs",
        glyph: "كان",
        title: {
          ar: "الأفعال الناقصة: كان وأخواتها",
          de: "Kāna und seine Schwestern",
        },
        summary: {
          ar: "ترفع الاسم وتنصب الخبر.",
          de: "Subjekt im Nominativ, Prädikat im Akkusativ.",
        },
        intro: {
          ar: "المقصود هنا الأفعال الناسخة الناقصة، مثل كان وأصبح وأمسى وأضحى وظلّ وبات وصار وليس. تدخل على الجملة الاسمية فترفع المبتدأ اسماً لها وتنصب الخبر خبراً لها.",
          de: "Hier sind die unvollständigen Satzverben wie kāna, aṣbaḥa, amsā, aḍḥā, ẓalla, bāta, ṣāra und laisa gemeint. Sie verlangen ein Nominativsubjekt und ein Akkusativprädikat.",
        },
        sections: [
          {
            title: {
              ar: "الاسم والخبر",
              de: "Subjekt und Prädikat",
            },
            body: {
              ar: "كان الطالب مجتهداً: الطالب اسمها المرفوع، ومجتهداً خبرها المنصوب. وقد يكون الخبر مفرداً أو جملة أو شبه جملة.",
              de: "In kāna aṭ-ṭālibu muǧtahidan ist aṭ-ṭālibu das Subjekt und muǧtahidan das Prädikat. Das Prädikat kann auch ein Satz oder eine Präpositionalgruppe sein.",
            },
            examples: [
              {
                ar: "كَانَ الطَّالِبُ مُجْتَهِدًا.",
                de: "Der Schüler war fleißig.",
                focus: "مُجْتَهِدًا",
              },
              {
                ar: "صَارَ الْمَاءُ بَارِدًا.",
                de: "Das Wasser wurde kalt.",
                focus: "بَارِدًا",
              },
            ],
          },
          {
            title: {
              ar: "شروط بعض الأخوات",
              de: "Bedingungen einzelner Verben",
            },
            body: {
              ar: "زال وبرح وفتئ وانفك تفيد الاستمرار بهذا العمل إذا سبقها نفي أو شبهه. ودام يشترط معها ما المصدرية الظرفية.",
              de: "Zāla, bariḥa, fatiʾa und infakka benötigen für diese Fortdauer-Bedeutung eine Negation oder Vergleichbares. Dāma benötigt temporales mā.",
            },
            examples: [
              {
                ar: "مَا زَالَ الطَّالِبُ مُجْتَهِدًا.",
                de: "Der Schüler ist weiterhin fleißig.",
                focus: "مَا زَالَ",
              },
              {
                ar: "سَأَبْقَى مَا دُمْتَ هُنَا.",
                de: "Ich bleibe, solange du hier bist.",
                focus: "مَا دُمْتَ",
              },
            ],
          },
          {
            title: {
              ar: "تمييز المصطلح",
              de: "Den Begriff unterscheiden",
            },
            body: {
              ar: "ناقص هنا مصطلح نحوي؛ أمّا الفعل الناقص في الصرف فهو المعتلّ الآخر، مثل دعا. وبعض أخوات كان قد تستعمل تامّة في سياقات أخرى.",
              de: "„Unvollständig“ ist hier ein Syntaxbegriff. Morphologisch bezeichnet „defektiv“ ein Verb mit schwachem Endradikal. Einige kāna-Verben haben in anderem Kontext auch eine vollständige Verwendung.",
            },
            examples: [
              {
                ar: "كَانَ الطَّالِبُ يَقْرَأُ.",
                de: "Der Schüler las gerade · Verbalsatz als Prädikat.",
                focus: "يَقْرَأُ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "اسم كان مرفوع وخبرها منصوب، ولو كان الخبر جملة في محل نصب.",
          de: "Das Subjekt steht im Nominativ und das Prädikat im Akkusativ bzw. an dessen Satzplatz.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل: كان الجوُّ ___.",
              de: "Ergänze das Prädikat nach kāna.",
            },
            options: ["جَمِيلًا", "جَمِيلٌ", "جَمِيلٍ", "جَمِيلَانِ"],
            correct: 0,
            explanation: {
              ar: "خبر كان منصوب: جميلاً.",
              de: "Das Prädikat von kāna steht im Akkusativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: كان ___ مجتهداً.",
              de: "Ergänze das Nomen nach kāna.",
            },
            options: [
              "الطَّالِبَ",
              "الطَّالِبِ",
              "الطَّالِبَيْنِ",
              "الطَّالِبُ",
            ],
            correct: 3,
            explanation: {
              ar: "اسم كان مرفوع.",
              de: "Das Subjekt von kāna steht im Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: ليس الماءُ ___.",
              de: "Ergänze das Prädikat nach laisa.",
            },
            options: ["بَارِدٍ", "بَارِدُونَ", "بَارِدًا", "بَارِدٌ"],
            correct: 2,
            explanation: {
              ar: "ليس من أخوات كان، فتنصب خبرها.",
              de: "Laisa gehört zur kāna-Gruppe und verlangt ein Akkusativprädikat.",
            },
          },
          {
            prompt: {
              ar: "أكمل: صارت الفتاةُ ___.",
              de: "Ergänze: Das Mädchen wurde Ärztin.",
            },
            options: ["طَبِيبٌ", "طَبِيبَةً", "طَبِيبَةٌ", "طَبِيبَةٍ"],
            correct: 1,
            explanation: {
              ar: "صار تفيد التحوّل، وطبيبة خبرها منصوب.",
              de: "Ṣāra bezeichnet Veränderung; ṭabībatan ist ihr Akkusativprädikat.",
            },
          },
          {
            prompt: {
              ar: "أكمل: ظلّ العاملُ ___.",
              de: "Ergänze das Prädikat von ẓalla.",
            },
            options: ["نَشِيطًا", "نَشِيطٌ", "نَشِيطٍ", "نَشِيطَانِ"],
            correct: 0,
            explanation: {
              ar: "خبر ظلّ منصوب، واسمها العامل مرفوع.",
              de: "Das Prädikat von ẓalla steht im Akkusativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: بات المسافرُ ___.",
              de: "Ergänze das Prädikat von bāta.",
            },
            options: ["مُتْعَبٌ", "مُتْعَبٍ", "مُتْعَبُونَ", "مُتْعَبًا"],
            correct: 3,
            explanation: {
              ar: "بات فعل ناقص يرفع الاسم وينصب الخبر.",
              de: "Bāta hat ein Nominativsubjekt und Akkusativprädikat.",
            },
          },
          {
            prompt: {
              ar: "ما إعراب «الطالبُ» في «ما زال الطالبُ مجتهداً»؟",
              de: "Welche Funktion hat aṭ-ṭālibu nach mā zāla?",
            },
            options: [
              {
                ar: "مفعول به",
                de: "Objekt",
              },
              {
                ar: "اسم مجرور",
                de: "Genitivnomen",
              },
              {
                ar: "اسم ما زال مرفوع",
                de: "Nominativsubjekt von mā zāla",
              },
              {
                ar: "خبر منصوب",
                de: "Akkusativprädikat",
              },
            ],
            correct: 2,
            explanation: {
              ar: "ما زال ترفع اسمها وتنصب خبرها.",
              de: "Mā zāla hat ein Nominativsubjekt.",
            },
          },
          {
            prompt: {
              ar: "ما الشرط الشائع لعمل زال وبرح وفتئ وانفك هذا العمل؟",
              de: "Welche Bedingung gilt für zāla und die entsprechenden Verben?",
            },
            options: [
              {
                ar: "أن يتصل بها مثنّى دائماً",
                de: "immer Dual",
              },
              {
                ar: "أن يسبقها نفي أو شبهه",
                de: "vorherige Negation oder Vergleichbares",
              },
              {
                ar: "أن تسبقها الـ",
                de: "vorheriger Artikel",
              },
              {
                ar: "أن يكون خبرها مجروراً",
                de: "Genitivprädikat",
              },
            ],
            correct: 1,
            explanation: {
              ar: "تعمل هذه الأفعال عمل كان مع النفي أو شبهه كالنهي.",
              de: "Diese Verben benötigen Negation oder Vergleichbares, etwa ein Verbot.",
            },
          },
          {
            prompt: {
              ar: "ما نوع «ما» في «سأبقى ما دمتَ هنا»؟",
              de: "Was ist mā vor dumta in diesem Satz?",
            },
            options: [
              {
                ar: "مصدرية ظرفية",
                de: "temporale maṣdar-Partikel",
              },
              {
                ar: "نافية",
                de: "Negation",
              },
              {
                ar: "اسم موصول هنا",
                de: "hier Relativpronomen",
              },
              {
                ar: "حرف جرّ",
                de: "Präposition",
              },
            ],
            correct: 0,
            explanation: {
              ar: "ما دام تعمل بشرط ما المصدرية الظرفية: مدة دوامك.",
              de: "Mā dāma benötigt temporales mā: „solange du bleibst“.",
            },
          },
          {
            prompt: {
              ar: "خبر كان في «كان الطالبُ يدرسُ» هو:",
              de: "Was ist das Prädikat in kāna aṭ-ṭālibu yadrusu?",
            },
            options: [
              {
                ar: "الطالب",
                de: "aṭ-ṭālib",
              },
              {
                ar: "كان",
                de: "kāna",
              },
              {
                ar: "اسم مجرور",
                de: "Genitivnomen",
              },
              {
                ar: "جملة يدرس في محل نصب",
                de: "Verbalsatz im Akkusativplatz",
              },
            ],
            correct: 3,
            explanation: {
              ar: "قد يأتي خبر كان جملة فعلية في محل نصب.",
              de: "Das Prädikat kann ein Verbalsatz mit Akkusativfunktion sein.",
            },
          },
          {
            prompt: {
              ar: "خبر كان في «كان الطالبُ في البيت» هو:",
              de: "Was ist das Prädikat in kāna aṭ-ṭālibu fī l-bait?",
            },
            options: [
              {
                ar: "البيت وحده فاعل",
                de: "al-bait als Subjekt",
              },
              {
                ar: "لا خبر لها",
                de: "kein Prädikat",
              },
              {
                ar: "شبه الجملة في البيت في محل نصب",
                de: "Präpositionalgruppe im Akkusativplatz",
              },
              {
                ar: "الطالب",
                de: "aṭ-ṭālib",
              },
            ],
            correct: 2,
            explanation: {
              ar: "الجار والمجرور هنا في محل نصب خبر كان.",
              de: "Die Präpositionalgruppe bildet hier das Prädikat von kāna.",
            },
          },
          {
            prompt: {
              ar: "ماذا تفعل كان الناقصة بالجملة الاسمية؟",
              de: "Wie wirkt das unvollständige kāna?",
            },
            options: [
              {
                ar: "لا تحتاج خبراً",
                de: "benötigt kein Prädikat",
              },
              {
                ar: "ترفع الاسم وتنصب الخبر",
                de: "Subjekt Nominativ, Prädikat Akkusativ",
              },
              {
                ar: "تنصب الاسم وترفع الخبر",
                de: "Subjekt Akkusativ, Prädikat Nominativ",
              },
              {
                ar: "تجرّ الاسم والخبر",
                de: "beides Genitiv",
              },
            ],
            correct: 1,
            explanation: {
              ar: "كان الناقصة تحتاج اسماً وخبراً.",
              de: "Das unvollständige kāna benötigt Subjekt und Prädikat.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "inna-particles",
        glyph: "إنّ",
        title: {
          ar: "الحروف المشبّهة بالفعل",
          de: "Inna und seine Schwestern",
        },
        summary: {
          ar: "تنصب الاسم وترفع الخبر، بعكس كان.",
          de: "Subjekt im Akkusativ, Prädikat im Nominativ.",
        },
        intro: {
          ar: "إنّ وأنّ وكأنّ ولكنّ وليت ولعلّ حروف ناسخة مشبّهة بالفعل. تدخل على الجملة الاسمية فتنصب المبتدأ اسماً لها وترفع الخبر خبراً لها.",
          de: "Inna, anna, kaʾanna, lākinna, laita und laʿalla verlangen ein Akkusativsubjekt und ein Nominativprädikat.",
        },
        sections: [
          {
            title: {
              ar: "العمل الإعرابي",
              de: "Die Kasuswirkung",
            },
            body: {
              ar: "إنّ الطالبَ مجتهدٌ: الطالب اسم إنّ منصوب، ومجتهد خبرها مرفوع. لا تخلط هذه القاعدة بكان التي ترفع الاسم وتنصب الخبر.",
              de: "Inna aṭ-ṭāliba muǧtahidun hat ein Akkusativsubjekt und Nominativprädikat. Das ist die umgekehrte Kasuswirkung von kāna.",
            },
            examples: [
              {
                ar: "إِنَّ الطَّالِبَ مُجْتَهِدٌ.",
                de: "Der Schüler ist wirklich fleißig.",
                focus: "الطَّالِبَ",
              },
              {
                ar: "كَانَ الطَّالِبُ مُجْتَهِدًا.",
                de: "Der Schüler war fleißig.",
                focus: "مُجْتَهِدًا",
              },
            ],
          },
          {
            title: {
              ar: "المعاني",
              de: "Die Bedeutungen",
            },
            body: {
              ar: "إنّ وأنّ للتوكيد، وكأنّ للتشبيه، ولكنّ للاستدراك، وليت للتمنّي، ولعلّ للترجّي أو الإشفاق بحسب السياق.",
              de: "Inna und anna bekräftigen, kaʾanna vergleicht, lākinna ergänzt einen Gegensatz, laita wünscht und laʿalla drückt je nach Kontext Hoffnung oder Besorgnis aus.",
            },
            examples: [
              {
                ar: "لَيْتَ السَّلَامَ دَائِمٌ.",
                de: "Möge der Frieden dauerhaft sein.",
                focus: "لَيْتَ",
              },
              {
                ar: "كَأَنَّ الْقَمَرَ مِصْبَاحٌ.",
                de: "Der Mond ist wie eine Lampe.",
                focus: "كَأَنَّ",
              },
            ],
          },
          {
            title: {
              ar: "الجملة خبراً وما الكافّة",
              de: "Satzprädikat und aufhebendes mā",
            },
            body: {
              ar: "قد يكون الخبر جملة أو شبه جملة في محل رفع. وإذا اتصلت ما الكافّة بإنّ منعتها من العمل: إنّما الطالبُ مجتهدٌ.",
              de: "Das Prädikat kann ein Satz oder eine Präpositionalgruppe am Nominativplatz sein. Das angehängte aufhebende mā verhindert die Kasuswirkung von inna.",
            },
            examples: [
              {
                ar: "إِنَّ الطَّالِبَ يَدْرُسُ.",
                de: "Der Schüler lernt wirklich.",
                focus: "يَدْرُسُ",
              },
              {
                ar: "إِنَّمَا الطَّالِبُ مُجْتَهِدٌ.",
                de: "Mit innamā bleibt aṭ-ṭālibu im Nominativ.",
                focus: "الطَّالِبُ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "إنّ تنصب الاسم وترفع الخبر؛ كان ترفع الاسم وتنصب الخبر.",
          de: "Inna: Akkusativ + Nominativ. Kāna: Nominativ + Akkusativ.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل: إنّ ___ مجتهدٌ.",
              de: "Ergänze das Nomen nach inna.",
            },
            options: [
              "الطَّالِبَ",
              "الطَّالِبُ",
              "الطَّالِبِ",
              "الطَّالِبَانِ",
            ],
            correct: 0,
            explanation: {
              ar: "اسم إنّ منصوب.",
              de: "Das Subjekt von inna steht im Akkusativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: إنّ الطالبَ ___.",
              de: "Ergänze das Prädikat von inna.",
            },
            options: [
              "مُجْتَهِدًا",
              "مُجْتَهِدٍ",
              "مُجْتَهِدِينَ",
              "مُجْتَهِدٌ",
            ],
            correct: 3,
            explanation: {
              ar: "خبر إنّ مرفوع.",
              de: "Das Prädikat von inna steht im Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: علمتُ أنّ ___ منجاةٌ.",
              de: "Ergänze nach anna.",
            },
            options: ["الصِّدْقِ", "صَادِقُونَ", "الصِّدْقَ", "الصِّدْقُ"],
            correct: 2,
            explanation: {
              ar: "اسم أنّ منصوب: الصدقَ.",
              de: "Aṣ-ṣidqa ist das Akkusativsubjekt von anna.",
            },
          },
          {
            prompt: {
              ar: "أكمل: كأنّ القمرَ ___.",
              de: "Ergänze das Prädikat nach kaʾanna.",
            },
            options: ["مَصَابِيحَ", "مِصْبَاحٌ", "مِصْبَاحًا", "مِصْبَاحٍ"],
            correct: 1,
            explanation: {
              ar: "كأنّ تنصب الاسم وترفع الخبر.",
              de: "Kaʾanna hat ein Akkusativsubjekt und Nominativprädikat.",
            },
          },
          {
            prompt: {
              ar: "أكمل: الطريق جميل، لكنّ الرحلةَ ___.",
              de: "Ergänze das Prädikat nach lākinna.",
            },
            options: ["طَوِيلَةٌ", "طَوِيلَةً", "طَوِيلَةٍ", "طَوِيلٌ"],
            correct: 0,
            explanation: {
              ar: "خبر لكنّ مرفوع ويوافق الرحلة في التأنيث.",
              de: "Das Prädikat steht im Nominativ und stimmt mit ar-riḥla überein.",
            },
          },
          {
            prompt: {
              ar: "أكمل: ليت السلامَ ___.",
              de: "Ergänze das Prädikat nach laita.",
            },
            options: ["دَائِمًا", "دَائِمٍ", "دَائِمِينَ", "دَائِمٌ"],
            correct: 3,
            explanation: {
              ar: "خبر ليت مرفوع.",
              de: "Das Prädikat von laita steht im Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لعلّ المسافرَ ___.",
              de: "Ergänze das Prädikat nach laʿalla.",
            },
            options: ["عَائِدٍ", "عَائِدِينَ", "عَائِدٌ", "عَائِدًا"],
            correct: 2,
            explanation: {
              ar: "خبر لعلّ مرفوع.",
              de: "Das Prädikat von laʿalla steht im Nominativ.",
            },
          },
          {
            prompt: {
              ar: "ما معنى ليت؟",
              de: "Welche Bedeutung hat laita?",
            },
            options: [
              {
                ar: "حرف جرّ",
                de: "Präposition",
              },
              {
                ar: "التمنّي",
                de: "Wunsch",
              },
              {
                ar: "التشبيه",
                de: "Vergleich",
              },
              {
                ar: "الاستدراك",
                de: "Gegensatzergänzung",
              },
            ],
            correct: 1,
            explanation: {
              ar: "ليت للتمنّي.",
              de: "Laita drückt einen Wunsch aus.",
            },
          },
          {
            prompt: {
              ar: "ما معنى كأنّ؟",
              de: "Welche Bedeutung hat kaʾanna?",
            },
            options: [
              {
                ar: "التشبيه",
                de: "Vergleich",
              },
              {
                ar: "التمنّي",
                de: "Wunsch",
              },
              {
                ar: "النهي",
                de: "Verbot",
              },
              {
                ar: "الاستفهام",
                de: "Frage",
              },
            ],
            correct: 0,
            explanation: {
              ar: "كأنّ تفيد التشبيه.",
              de: "Kaʾanna bedeutet „als ob / wie“.",
            },
          },
          {
            prompt: {
              ar: "خبر إنّ في «إنّ الطالبَ يدرسُ» هو:",
              de: "Was ist das Prädikat in inna aṭ-ṭāliba yadrusu?",
            },
            options: [
              {
                ar: "الطالب",
                de: "aṭ-ṭālib",
              },
              {
                ar: "إنّ",
                de: "inna",
              },
              {
                ar: "مفعول به",
                de: "Akkusativobjekt",
              },
              {
                ar: "جملة يدرس في محل رفع",
                de: "Verbalsatz im Nominativplatz",
              },
            ],
            correct: 3,
            explanation: {
              ar: "قد يأتي خبر إنّ جملة في محل رفع.",
              de: "Das Prädikat von inna kann ein Satz mit Nominativfunktion sein.",
            },
          },
          {
            prompt: {
              ar: "أكمل بعد «إنّما» الكافّة: إنّما ___ مجتهدٌ.",
              de: "Ergänze nach innamā, das die Kasuswirkung aufhebt.",
            },
            options: [
              "الطَّالِبِ",
              "الطَّالِبَيْنِ",
              "الطَّالِبُ",
              "الطَّالِبَ",
            ],
            correct: 2,
            explanation: {
              ar: "ما الكافّة تمنع عمل إنّ، فيرفع المبتدأ هنا.",
              de: "Das angehängte mā hebt hier die Wirkung von inna auf; das Nomen bleibt im Nominativ.",
            },
          },
          {
            prompt: {
              ar: "علامة نصب اسم إنّ في «إنّ الطالبَيْنِ مجتهدان» هي:",
              de: "Welches Akkusativzeichen hat der Dual nach inna?",
            },
            options: [
              {
                ar: "الكسرة",
                de: "Kasra",
              },
              {
                ar: "الياء",
                de: "Yā",
              },
              {
                ar: "الألف",
                de: "Alif",
              },
              {
                ar: "الواو",
                de: "Wāw",
              },
            ],
            correct: 1,
            explanation: {
              ar: "المثنّى ينصب بالياء.",
              de: "Der Dual hat im Akkusativ Yā.",
            },
          },
        ],
        category: "syntax",
      },
    ],
    extraQuestions: {
      "sun-moon": [
        {
          prompt: {
            ar: "ما نوع اللام في «التُّفَّاح»؟",
            de: "Welche Artikelart hat „at-tuffāḥ“?",
          },
          options: [
            {
              ar: "قمرية",
              de: "Mond-Lām",
            },
            {
              ar: "حرف جر",
              de: "Präposition",
            },
            {
              ar: "فعل",
              de: "Verb",
            },
            {
              ar: "شمسية",
              de: "Sonnen-Lām",
            },
          ],
          correct: 3,
          explanation: {
            ar: "التاء حرف شمسي؛ تُدغم اللام وتشدّد التاء.",
            de: "Tā ist ein Sonnenbuchstabe: Das Lām wird angeglichen.",
          },
        },
        {
          prompt: {
            ar: "أي كلمة فيها لام قمرية؟",
            de: "Welches Wort hat ein gesprochenes Artikel-Lām?",
          },
          options: ["النُّورُ", "الزَّهْرُ", "الْفِيلُ", "السَّمَكُ"],
          correct: 2,
          explanation: {
            ar: "الفاء حرف قمري، فننطق اللام الساكنة.",
            de: "Fā ist ein Mondbuchstabe; das Lām wird gesprochen.",
          },
        },
        {
          prompt: {
            ar: "اختر الضبط الصحيح لكلمة المدرسة.",
            de: "Wähle die richtige Vokalisierung von „die Schule“.",
          },
          options: [
            "الَمَدْرَسَةُ",
            "الْمَدْرَسَةُ",
            "المَّدْرَسَةُ",
            "الْمَّدْرَسَةُ",
          ],
          correct: 1,
          explanation: {
            ar: "الميم حرف قمري؛ اللام ساكنة والميم غير مشدّدة بسبب التعريف.",
            de: "Mīm ist ein Mondbuchstabe: Lām mit Sukūn, keine zusätzliche Schadda.",
          },
        },
        {
          prompt: {
            ar: "اختر الضبط الصحيح لكلمة السيارة.",
            de: "Wähle die richtige Vokalisierung von „das Auto“.",
          },
          options: [
            "السَّيَّارَةُ",
            "الْسَيَّارَةُ",
            "الَسَيَّارَةُ",
            "الْسَّيَّارَةُ",
          ],
          correct: 0,
          explanation: {
            ar: "السين شمسية وتشدّد بعد لام التعريف المدغمة.",
            de: "Sīn ist ein Sonnenbuchstabe und wird verdoppelt.",
          },
        },
        {
          prompt: {
            ar: "هل الحاء حرف شمسي أم قمري؟",
            de: "Zu welcher Gruppe gehört Ḥā?",
          },
          options: [
            {
              ar: "شمسي",
              de: "Sonnenbuchstabe",
            },
            {
              ar: "ليس حرفاً عربياً",
              de: "kein arabischer Buchstabe",
            },
            {
              ar: "ضمير",
              de: "Pronomen",
            },
            {
              ar: "قمري",
              de: "Mondbuchstabe",
            },
          ],
          correct: 3,
          explanation: {
            ar: "الحاء من الحروف القمرية، مثل الْحَصَان.",
            de: "Ḥā ist ein Mondbuchstabe, etwa in al-ḥiṣān.",
          },
        },
        {
          prompt: {
            ar: "أي كلمة تبدأ بحرف شمسي بعد «الـ»؟",
            de: "Welches Wort hat nach dem Artikel einen Sonnenbuchstaben?",
          },
          options: ["الْمَاءُ", "الْوَرْدُ", "الرَّجُلُ", "الْعَيْنُ"],
          correct: 2,
          explanation: {
            ar: "الراء حرف شمسي؛ ننطقها مشدّدة ولا ننطق اللام منفردة.",
            de: "Rā ist ein Sonnenbuchstabe; es wird verdoppelt.",
          },
        },
        {
          prompt: {
            ar: "ماذا يحدث للام التعريف قبل النون؟",
            de: "Was geschieht mit dem Artikel-Lām vor Nūn?",
          },
          options: [
            {
              ar: "تصبح حرف مدّ",
              de: "es wird zum Langvokal",
            },
            {
              ar: "تُدغم وتشدّد النون",
              de: "Angleichung; Nūn wird verdoppelt",
            },
            {
              ar: "تُحذف كتابة",
              de: "es entfällt in der Schrift",
            },
            {
              ar: "تتحوّل إلى ميم",
              de: "es wird zu Mīm",
            },
          ],
          correct: 1,
          explanation: {
            ar: "النون شمسية؛ اللام تبقى مكتوبة ويُدغم صوتها.",
            de: "Nūn ist ein Sonnenbuchstabe. Das Lām bleibt geschrieben.",
          },
        },
        {
          prompt: {
            ar: "اختر المجموعة التي كل حروفها قمرية.",
            de: "Welche Gruppe besteht nur aus Mondbuchstaben?",
          },
          options: ["ج خ غ", "د ذ ر", "س ش ص", "ط ظ ن"],
          correct: 0,
          explanation: {
            ar: "الجيم والخاء والغين حروف قمرية.",
            de: "Ǧīm, Ḫā und Ġain sind Mondbuchstaben.",
          },
        },
      ],
      pronouns: [
        {
          prompt: {
            ar: "أكمل: ___ تكتبين الدرس.",
            de: "Ergänze das Pronomen zu taktubīna.",
          },
          options: ["أَنْتَ", "هُوَ", "نَحْنُ", "أَنْتِ"],
          correct: 3,
          explanation: {
            ar: "تكتبين للمخاطبة المفردة: أنتِ.",
            de: "Taktubīna richtet sich an eine einzelne Frau.",
          },
        },
        {
          prompt: {
            ar: "أي ضمير للغائبات؟",
            de: "Welches Pronomen bezeichnet mehrere weibliche Dritte?",
          },
          options: ["أَنْتُمْ", "هُوَ", "هُنَّ", "أَنْتُنَّ"],
          correct: 2,
          explanation: {
            ar: "هنّ لجمع الإناث الغائبات، وأنتنّ للمخاطبات.",
            de: "Hunna bezeichnet weibliche Dritte, antunna spricht sie an.",
          },
        },
        {
          prompt: {
            ar: "أكمل: ___ طالب مجتهد. والمقصود شخص غائب مذكّر.",
            de: "Ergänze für einen männlichen Dritten.",
          },
          options: ["أَنْتِ", "هُوَ", "هِيَ", "أَنَا"],
          correct: 1,
          explanation: {
            ar: "هو للغائب المفرد المذكّر.",
            de: "Huwa bezeichnet eine einzelne männliche dritte Person.",
          },
        },
        {
          prompt: {
            ar: "ما معنى «كتابُهَا»؟",
            de: "Was bedeutet kitābuhā?",
          },
          options: [
            {
              ar: "الكتاب الذي تملكه هي",
              de: "ihr Buch",
            },
            {
              ar: "كتابي",
              de: "mein Buch",
            },
            {
              ar: "كتابك",
              de: "dein Buch",
            },
            {
              ar: "كتابنا",
              de: "unser Buch",
            },
          ],
          correct: 0,
          explanation: {
            ar: "الهاء والألف ضمير متصل يدلّ على ملكية الغائبة.",
            de: "Die Endung -hā bedeutet hier „ihr“ im Singular.",
          },
        },
        {
          prompt: {
            ar: "ما معنى «كتابُنَا»؟",
            de: "Was bedeutet kitābunā?",
          },
          options: [
            {
              ar: "كتابه",
              de: "sein Buch",
            },
            {
              ar: "كتابها",
              de: "ihr Buch",
            },
            {
              ar: "كتابك",
              de: "dein Buch",
            },
            {
              ar: "الكتاب الذي نملكه",
              de: "unser Buch",
            },
          ],
          correct: 3,
          explanation: {
            ar: "نا ضمير المتكلّمين المتصل.",
            de: "-nā ist ein angehängtes Pronomen der ersten Person Plural.",
          },
        },
        {
          prompt: {
            ar: "أي ضمير نخاطب به شخصين؟",
            de: "Mit welchem Pronomen sprichst du genau zwei Personen an?",
          },
          options: ["نَحْنُ", "هُمْ", "أَنْتُمَا", "هُمَا"],
          correct: 2,
          explanation: {
            ar: "أنتما للمخاطب المثنّى في الجنسين.",
            de: "Antumā gilt für zwei Angesprochene beider Geschlechter.",
          },
        },
        {
          prompt: {
            ar: "من المخاطب في «كِتَابُكِ»؟",
            de: "An wen richtet sich kitābuki?",
          },
          options: [
            {
              ar: "متكلّم",
              de: "die sprechende Person",
            },
            {
              ar: "مفرد مؤنّث",
              de: "eine Frau",
            },
            {
              ar: "مفرد مذكّر",
              de: "ein Mann",
            },
            {
              ar: "جمع مذكّر",
              de: "mehrere Männer",
            },
          ],
          correct: 1,
          explanation: {
            ar: "كسرة الكاف تدلّ على المخاطبة المفردة.",
            de: "Die Kasra am Kāf kennzeichnet eine weibliche Angesprochene.",
          },
        },
        {
          prompt: {
            ar: "أي كلمة ضمير وليست اسماً ظاهراً؟",
            de: "Welches Wort ist ein Personalpronomen?",
          },
          options: ["نَحْنُ", "سَارَةُ", "كِتَابٌ", "مَدْرَسَةٌ"],
          correct: 0,
          explanation: {
            ar: "نحن ضمير منفصل للمتكلّمين.",
            de: "Naḥnu ist ein selbstständiges Personalpronomen.",
          },
        },
      ],
      gender: [
        {
          prompt: {
            ar: "أكمل: هذا قلم ___.",
            de: "Ergänze: Dies ist ein neuer Stift.",
          },
          options: ["جَدِيدَةٌ", "جَدِيدَانِ", "جَدِيدَاتٌ", "جَدِيدٌ"],
          correct: 3,
          explanation: {
            ar: "قلم مفرد مذكّر، فتكون صفته مفردة مذكّرة.",
            de: "Qalam ist maskulin Singular; das Adjektiv stimmt damit überein.",
          },
        },
        {
          prompt: {
            ar: "أكمل: هذه مدرسة ___.",
            de: "Ergänze: Dies ist eine große Schule.",
          },
          options: ["كَبِيرَانِ", "كَبِيرُونَ", "كَبِيرَةٌ", "كَبِيرٌ"],
          correct: 2,
          explanation: {
            ar: "مدرسة مؤنّثة، والصفة كبيرة مؤنّثة أيضاً.",
            de: "Madrasa ist feminin; die passende Form ist kabīra.",
          },
        },
        {
          prompt: {
            ar: "أي اسم مؤنّث من دون تاء مربوطة؟",
            de: "Welches feminine Nomen hat kein Tā marbūṭa?",
          },
          options: ["وَلَدٌ", "أَرْضٌ", "قَلَمٌ", "بَيْتٌ"],
          correct: 1,
          explanation: {
            ar: "أرض مؤنّث لغوي بلا تاء مربوطة.",
            de: "Arḍ ist grammatisch feminin ohne die Endung ة.",
          },
        },
        {
          prompt: {
            ar: "أي اسم شخص مذكّر رغم انتهاء اسمه بـ«ة»؟",
            de: "Welcher männliche Vorname endet auf ة?",
          },
          options: ["أُسَامَةُ", "فَاطِمَةُ", "عَائِشَةُ", "خَدِيجَةُ"],
          correct: 0,
          explanation: {
            ar: "أسامة اسم مذكّر، فلا تكفي النهاية وحدها للحكم.",
            de: "Usāma ist ein männlicher Name; die Endung allein reicht nicht.",
          },
        },
        {
          prompt: {
            ar: "ما مؤنّث «معلّم»؟",
            de: "Wie lautet die weibliche Form von muʿallim?",
          },
          options: [
            "مُعَلِّمُونَ",
            "مُعَلِّمَانِ",
            "مُعَلِّمِينَ",
            "مُعَلِّمَةٌ",
          ],
          correct: 3,
          explanation: {
            ar: "نضيف التاء المربوطة: معلّم ← معلّمة.",
            de: "Die weibliche Form erhält Tā marbūṭa.",
          },
        },
        {
          prompt: {
            ar: "أكمل: ___ بنت صغيرة.",
            de: "Ergänze: Das ist ein kleines Mädchen.",
          },
          options: ["هَذَانِ", "هَؤُلَاءِ", "هَذِهِ", "هَذَا"],
          correct: 2,
          explanation: {
            ar: "بنت مفرد مؤنّث، فنستخدم هذه.",
            de: "Bint ist feminin Singular; dazu passt hāḏihi.",
          },
        },
        {
          prompt: {
            ar: "ما الحرف الأخير في «وجه»؟",
            de: "Welcher Buchstabe steht am Ende von waǧh?",
          },
          options: [
            {
              ar: "ألف",
              de: "Alif",
            },
            {
              ar: "هاء",
              de: "Hā",
            },
            {
              ar: "تاء مربوطة",
              de: "Tā marbūṭa",
            },
            {
              ar: "تاء مفتوحة",
              de: "Tā",
            },
          ],
          correct: 1,
          explanation: {
            ar: "الهاء في وجه ليست علامة التأنيث «ة».",
            de: "Das Hā in waǧh ist kein feminines ة.",
          },
        },
        {
          prompt: {
            ar: "اختر الجملة الصحيحة.",
            de: "Wähle den richtigen Satz.",
          },
          options: [
            "هَذِهِ بِنْتٌ مُجْتَهِدَةٌ.",
            "هَذَا بِنْتٌ مُجْتَهِدَةٌ.",
            "هَذِهِ بِنْتٌ مُجْتَهِدٌ.",
            "هَذَا بِنْتٌ مُجْتَهِدٌ.",
          ],
          correct: 0,
          explanation: {
            ar: "اسم الإشارة والصفة يوافقان بنت في التأنيث.",
            de: "Demonstrativpronomen und Adjektiv stimmen mit bint überein.",
          },
        },
      ],
      number: [
        {
          prompt: {
            ar: "ما مثنّى «قلم» في الرفع؟",
            de: "Wie lautet qalam im Dual Nominativ?",
          },
          options: ["أَقْلَامٌ", "قَلَمٌ", "قَلَمَيْنِ", "قَلَمَانِ"],
          correct: 3,
          explanation: {
            ar: "المثنّى يرفع بالألف: قلمان.",
            de: "Der Dual wird im Nominativ mit Alif gebildet.",
          },
        },
        {
          prompt: {
            ar: "أكمل: قرأتُ ___. والمقصود كتابان.",
            de: "Ergänze nach „ich las“ für zwei Bücher.",
          },
          options: ["كُتُبٌ", "كِتَابٌ", "كِتَابَيْنِ", "كِتَابَانِ"],
          correct: 2,
          explanation: {
            ar: "كتابين مفعول به مثنّى منصوب بالياء.",
            de: "Der Dual steht als Objekt im Akkusativ auf -aini.",
          },
        },
        {
          prompt: {
            ar: "ما جمع المؤنّث السالم لكلمة «معلّمة»؟",
            de: "Bilde den regelmäßigen femininen Plural von Lehrerin.",
          },
          options: [
            "مُعَلِّمٌ",
            "مُعَلِّمَاتٌ",
            "مُعَلِّمُونَ",
            "مُعَلِّمَتَانِ",
          ],
          correct: 1,
          explanation: {
            ar: "تُستبدل التاء المربوطة بألف وتاء.",
            de: "Tā marbūṭa wird durch -āt ersetzt.",
          },
        },
        {
          prompt: {
            ar: "أي كلمة جمع تكسير؟",
            de: "Welches Wort ist ein gebrochener Plural?",
          },
          options: ["أَقْلَامٌ", "مُعَلِّمُونَ", "مُعَلِّمَاتٌ", "قَلَمَانِ"],
          correct: 0,
          explanation: {
            ar: "أقلام غيّرت بناء المفرد قلم.",
            de: "Aqlām verändert den Stamm von qalam.",
          },
        },
        {
          prompt: {
            ar: "كم شخصاً تدلّ عليه «معلّمتان»؟",
            de: "Wie viele Personen bezeichnet muʿallimatān?",
          },
          options: [
            {
              ar: "واحدة",
              de: "eine",
            },
            {
              ar: "ثلاث",
              de: "drei",
            },
            {
              ar: "أربع",
              de: "vier",
            },
            {
              ar: "اثنتان",
              de: "zwei",
            },
          ],
          correct: 3,
          explanation: {
            ar: "الألف والنون هنا علامة المثنّى.",
            de: "Die Endung -ān bezeichnet hier genau zwei Personen.",
          },
        },
        {
          prompt: {
            ar: "أكمل: مررتُ بـ ___. والمقصود معلّمون.",
            de: "Ergänze nach der Präposition bi- im Plural.",
          },
          options: [
            "مُعَلِّمَانِ",
            "مُعَلِّمٌ",
            "مُعَلِّمِينَ",
            "مُعَلِّمُونَ",
          ],
          correct: 2,
          explanation: {
            ar: "جمع المذكّر السالم يجرّ بالياء.",
            de: "Der regelmäßige maskuline Plural hat im Genitiv -īna.",
          },
        },
        {
          prompt: {
            ar: "ما مثنّى «مدرسة» المرفوع؟",
            de: "Bilde den Dual Nominativ von madrasa.",
          },
          options: [
            "مَدْرَسَاتٌ",
            "مَدْرَسَتَانِ",
            "مَدْرَسَةَانِ",
            "مَدَارِسُ",
          ],
          correct: 1,
          explanation: {
            ar: "تظهر التاء قبل علامة التثنية: مدرستان.",
            de: "Vor der Dualendung wird ة als Tā geschrieben.",
          },
        },
        {
          prompt: {
            ar: "أكمل: هذه أقلام ___.",
            de: "Ergänze das Adjektiv zu diesen neuen Stiften.",
          },
          options: ["جَدِيدَةٌ", "جَدِيدٌ", "جَدِيدَانِ", "جَدِيدُونَ"],
          correct: 0,
          explanation: {
            ar: "جمع غير العاقل يوصف هنا بالمفرد المؤنّث.",
            de: "Nichtmenschliche Plurale erhalten hier ein feminines Adjektiv im Singular.",
          },
        },
      ],
      "basic-verbs": [
        {
          prompt: {
            ar: "ما مضارع «نام» مع هو؟",
            de: "Bilde das Präsens von nāma mit „er“.",
          },
          options: ["نَامَ", "نَمْ", "نِمْتُ", "يَنَامُ"],
          correct: 3,
          explanation: {
            ar: "هو ينام، أمّا نم فصيغة أمر.",
            de: "Yanāmu ist Präsens; nam ist Imperativ.",
          },
        },
        {
          prompt: {
            ar: "أي فعل يعني «schreiben»؟",
            de: "Welches Verb bedeutet schreiben?",
          },
          options: ["جَلَسَ", "لَعِبَ", "كَتَبَ", "شَرِبَ"],
          correct: 2,
          explanation: {
            ar: "كتب يكتب يعني الكتابة.",
            de: "Kataba – yaktubu bedeutet schreiben.",
          },
        },
        {
          prompt: {
            ar: "أكمل: أنا ___ على الكرسي.",
            de: "Ergänze: Ich sitze auf dem Stuhl.",
          },
          options: ["اِجْلِسْ", "أَجْلِسُ", "يَجْلِسُ", "جَلَسَ"],
          correct: 1,
          explanation: {
            ar: "أجلس مضارع مع أنا، واجلس أمر للمخاطب.",
            de: "Aǧlisu gehört zu „ich“; iǧlis ist Imperativ.",
          },
        },
        {
          prompt: {
            ar: "ما ماضي «يذهب» مع هو؟",
            de: "Bilde das Perfekt von yaḏhabu mit „er“.",
          },
          options: ["ذَهَبَ", "اِذْهَبْ", "أَذْهَبُ", "نَذْهَبُ"],
          correct: 0,
          explanation: {
            ar: "ذهب ماضٍ، ويذهب مضارع.",
            de: "Ḏahaba ist Perfekt, yaḏhabu Präsens.",
          },
        },
        {
          prompt: {
            ar: "أي فعل يرتبط بالكرة في الجملة المعتادة؟",
            de: "Welches Verb passt zu „mit dem Ball“?",
          },
          options: ["شَرِبَ", "قَرَأَ", "نَامَ", "لَعِبَ"],
          correct: 3,
          explanation: {
            ar: "نقول لعب بالكرة.",
            de: "Laʿiba bi-l-kura bedeutet mit dem Ball spielen.",
          },
        },
        {
          prompt: {
            ar: "ما معنى «سمع»؟",
            de: "Was bedeutet samiʿa?",
          },
          options: [
            {
              ar: "شرب",
              de: "trinken",
            },
            {
              ar: "أكل",
              de: "essen",
            },
            {
              ar: "أدرك صوتاً",
              de: "hören",
            },
            {
              ar: "نام",
              de: "schlafen",
            },
          ],
          correct: 2,
          explanation: {
            ar: "سمع يسمع يدلّ على إدراك الصوت.",
            de: "Samiʿa – yasmaʿu bezeichnet das Hören.",
          },
        },
        {
          prompt: {
            ar: "ما الأمر من «فتح» للمفرد المذكّر؟",
            de: "Bilde den Imperativ von fataḥa für einen Mann.",
          },
          options: ["أَفْتَحُ", "اِفْتَحْ", "فَتَحَ", "يَفْتَحُ"],
          correct: 1,
          explanation: {
            ar: "افتح أمر، وفتح ماضٍ، ويفتح مضارع.",
            de: "Iftaḥ ist Imperativ, fataḥa Perfekt und yaftaḥu Präsens.",
          },
        },
        {
          prompt: {
            ar: "ما مضارع «درس» مع نحن؟",
            de: "Bilde das Präsens von darasa mit „wir“.",
          },
          options: ["نَدْرُسُ", "يَدْرُسُ", "أَدْرُسُ", "اُدْرُسْ"],
          correct: 0,
          explanation: {
            ar: "نحن ندرس؛ النون هنا للمتكلّمين.",
            de: "Naḥnu nadrusu: Nūn kennzeichnet hier „wir“.",
          },
        },
      ],
    },
  };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else window.ArabicGrammarExpansion = data;
})();
