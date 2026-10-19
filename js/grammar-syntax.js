(() => {
  "use strict";
  const data = {
    lessons: [
      {
        id: "numerals",
        glyph: "١٢",
        title: {
          ar: "العدد والمعدود",
          de: "Zahlwort und gezähltes Nomen",
        },
        summary: {
          ar: "الموافقة والمخالفة، والتمييز، وإعراب العدد.",
          de: "Genus, Tamyīz und Flexion der Zahlwörter.",
        },
        intro: {
          ar: "نحدّد أولًا جنس مفرد المعدود، ثم مجموعة العدد، ثم موقعه الإعرابي. ويتغيّر تمييز العدد بين جمع مجرور ومفرد منصوب ومفرد مجرور.",
          de: "Bestimme das Genus des gezählten Nomens im Singular, die Zahlengruppe und die Satzfunktion. Der Tamyīz wechselt zwischen Genitivplural, Akkusativsingular und Genitivsingular.",
        },
        sections: [
          {
            title: {
              ar: "واحد واثنان، وثلاثة إلى عشرة",
              de: "Eins, zwei und drei bis zehn",
            },
            body: {
              ar: "واحد واثنان يوافقان المعدود، ويأتيان غالبًا بعده نعتًا: كتاب واحد وامرأتان اثنتان. ومن 3 إلى 10 يخالف العدد جنس مفرد المعدود، ويكون المعدود جمعًا مجرورًا.",
              de: "Eins und zwei stimmen überein und stehen oft als Attribut nach dem Nomen. Drei bis zehn zeigen Gegenpolung zum Genus des Singulars; das gezählte Nomen ist ein Genitivplural.",
            },
            examples: [
              {
                ar: "كِتَابٌ وَاحِدٌ · طَالِبَتَانِ اثْنَتَانِ",
                de: "ein Buch · zwei Schülerinnen",
                focus: "وَاحِدٌ",
              },
              {
                ar: "ثَلَاثَةُ كُتُبٍ · ثَلَاثُ سَيَّارَاتٍ",
                de: "drei Bücher · drei Autos",
                focus: "ثَلَاثُ",
              },
            ],
          },
          {
            title: {
              ar: "الأعداد من 11 إلى 19",
              de: "Elf bis neunzehn",
            },
            body: {
              ar: "جزآ 11 و12 يوافقان المعدود. وفي 13 إلى 19 يخالف الجزء الأول المعدود ويوافقه عشر أو عشرة. تمييز هذه الأعداد مفرد منصوب. العدد 10 المفرد يخالف، أما جزء العشرة في المركّب فيوافق.",
              de: "Beide Teile von elf und zwölf stimmen mit dem Nomen überein. Bei dreizehn bis neunzehn zeigt der erste Teil Gegenpolung, der zweite stimmt überein. Der Tamyīz ist Akkusativsingular. Die einfache Zehn zeigt dagegen Gegenpolung.",
            },
            examples: [
              {
                ar: "أَحَدَ عَشَرَ طَالِبًا · إِحْدَى عَشْرَةَ طَالِبَةً",
                de: "elf Schüler · elf Schülerinnen",
                focus: "إِحْدَى عَشْرَةَ",
              },
              {
                ar: "ثَلَاثَةَ عَشَرَ قَلَمًا",
                de: "dreizehn Stifte",
                focus: "ثَلَاثَةَ عَشَرَ",
              },
            ],
          },
          {
            title: {
              ar: "العقود والأعداد المعطوفة",
              de: "Zehner und zusammengesetzte Zahlen mit wa-",
            },
            body: {
              ar: "العقود 20 إلى 90 ثابتة للجنسين، وتمييزها مفرد منصوب. في 21 و22 يوافق جزء الآحاد، ومن 23 إلى 29 يخالف، وينطبق ذلك على سائر العقود المعطوفة.",
              de: "Zwanzig bis neunzig bleiben für beide Genera gleich; ihr Tamyīz ist Akkusativsingular. In einundzwanzig und zweiundzwanzig stimmt der Einer überein, bei dreiundzwanzig bis neunundzwanzig zeigt er Gegenpolung; entsprechend in den weiteren Zehnern.",
            },
            examples: [
              {
                ar: "وَاحِدٌ وَعِشْرُونَ طَالِبًا · إِحْدَى وَعِشْرُونَ طَالِبَةً",
                de: "einundzwanzig Schüler · Schülerinnen",
                focus: "إِحْدَى",
              },
              {
                ar: "ثَلَاثٌ وَعِشْرُونَ طَالِبَةً",
                de: "dreiundzwanzig Schülerinnen",
                focus: "ثَلَاثٌ",
              },
            ],
          },
          {
            title: {
              ar: "مئة وألف وإعراب العدد",
              de: "Hundert, tausend und Kasus",
            },
            body: {
              ar: "تمييز مئة وألف ومضاعفاتهما مفرد مجرور. تعرب الأعداد بحسب الموقع؛ 11 و13 إلى 19 مبنية على فتح الجزأين في محل رفع أو نصب أو جر. صدر 12 يعرب كالمثنّى، وعجزه مبني على الفتح. والعقود ملحقة بجمع المذكّر السالم: الواو رفعًا والياء نصبًا وجرًّا.",
              de: "Nach hundert und tausend sowie deren Vielfachen steht ein Genitivsingular. Die Zahl folgt ihrer Satzfunktion. Elf und dreizehn bis neunzehn sind auf Fatḥa beider Teile gebaut; der erste Teil von zwölf wird wie der Dual flektiert. Zehner werden mit Wāw im Nominativ und Yā im Akkusativ und Genitiv flektiert.",
            },
            examples: [
              {
                ar: "مِئَةُ كِتَابٍ · أَلْفُ كِتَابٍ",
                de: "hundert Bücher · tausend Bücher",
                focus: "كِتَابٍ",
              },
              {
                ar: "حَضَرَ اثْنَا عَشَرَ طَالِبًا. رَأَيْتُ اثْنَيْ عَشَرَ طَالِبًا.",
                de: "zwölf als Subjekt und als Objekt",
                focus: "اثْنَيْ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "انظر إلى مفرد المعدود، ولا تجعل جنس صيغة الجمع أساس الحكم.",
          de: "Bestimme das Genus am Singular, nicht an der Pluralform.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل: قرأتُ ___ كتبٍ. والمقصود 3.",
              de: "Ergänze für drei Bücher.",
            },
            options: ["ثَلَاثَةَ", "ثَلَاثَ", "ثَلَاثُونَ", "ثَلَاثَةُ"],
            correct: 0,
            explanation: {
              ar: "كتاب مذكّر؛ العدد من 3 إلى 10 يخالف مفرده. والعدد هنا مفعول به منصوب.",
              de: "Kitāb ist maskulin. Drei bis zehn zeigen Gegenpolung; das Zahlwort steht hier als Objekt im Akkusativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: في الشارع ___ سياراتٍ. والمقصود 3.",
              de: "Ergänze für drei Autos.",
            },
            options: ["ثَلَاثَةُ", "ثَلَاثَةَ", "ثَلَاثِينَ", "ثَلَاثُ"],
            correct: 3,
            explanation: {
              ar: "سيارة مؤنّث، فنقول ثلاث سيارات. العدد هنا مبتدأ مؤخّر مرفوع.",
              de: "Sayyāra ist feminin: ṯalāṯu. Das nachgestellte Subjekt steht im Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: حضر ___ طالبًا. والمقصود 11.",
              de: "Ergänze für elf Schüler.",
            },
            options: [
              "أَحَدَ عَشْرَةَ",
              "إِحْدَى عَشَرَ",
              "أَحَدَ عَشَرَ",
              "إِحْدَى عَشْرَةَ",
            ],
            correct: 2,
            explanation: {
              ar: "جزآ أحد عشر يوافقان المذكّر، والتمييز طالبًا مفرد منصوب.",
              de: "Beide Teile von elf stimmen hier mit dem maskulinen Nomen überein; der Singular-Tamyīz ist Akkusativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: حضرت ___ طالبةً. والمقصود 11.",
              de: "Ergänze für elf Schülerinnen.",
            },
            options: [
              "أَحَدَ عَشْرَةَ",
              "إِحْدَى عَشْرَةَ",
              "أَحَدَ عَشَرَ",
              "إِحْدَى عَشَرَ",
            ],
            correct: 1,
            explanation: {
              ar: "إحدى عشرة توافق المؤنّث في الجزأين.",
              de: "Iḥdā ʿašrata stimmt in beiden Teilen mit dem Femininum überein.",
            },
          },
          {
            prompt: {
              ar: "أكمل: حضر ___ طالبًا. والمقصود 12.",
              de: "Ergänze zwölf Schüler als Subjekt.",
            },
            options: [
              "اثْنَا عَشَرَ",
              "اثْنَيْ عَشَرَ",
              "اثْنَتَا عَشْرَةَ",
              "اثْنَتَيْ عَشْرَةَ",
            ],
            correct: 0,
            explanation: {
              ar: "صدر اثني عشر يعرب كالمثنّى؛ في الرفع اثنا، ويوافق المذكّر.",
              de: "Der erste Teil von zwölf wird wie der Dual flektiert: iṯnā im Nominativ, hier maskulin.",
            },
          },
          {
            prompt: {
              ar: "أكمل: رأيتُ ___ طالبًا. والمقصود 12.",
              de: "Ergänze zwölf Schüler als Objekt.",
            },
            options: [
              "اثْنَا عَشَرَ",
              "اثْنَتَا عَشْرَةَ",
              "اثْنَتَيْ عَشْرَةَ",
              "اثْنَيْ عَشَرَ",
            ],
            correct: 3,
            explanation: {
              ar: "صدر العدد منصوب بالياء: اثني، وعشر مبني على الفتح.",
              de: "Im Akkusativ hat der erste Teil Yā: iṯnai; der zweite Teil bleibt auf Fatḥa gebaut.",
            },
          },
          {
            prompt: {
              ar: "أكمل: عندي ___ قلمًا. والمقصود 13.",
              de: "Ergänze für dreizehn Stifte.",
            },
            options: [
              "ثَلَاثَةَ عَشْرَةَ",
              "ثَلَاثَ عَشْرَةَ",
              "ثَلَاثَةَ عَشَرَ",
              "ثَلَاثَ عَشَرَ",
            ],
            correct: 2,
            explanation: {
              ar: "في 13 إلى 19 يخالف الجزء الأول مفرد المعدود ويوافقه الجزء الثاني.",
              de: "Bei dreizehn bis neunzehn zeigt der Einer Gegenpolung; der Zehnerteil stimmt überein.",
            },
          },
          {
            prompt: {
              ar: "أكمل: حضرت ___ طالبةً. والمقصود 20.",
              de: "Ergänze für zwanzig Schülerinnen.",
            },
            options: ["عِشْرَتَانِ", "عِشْرُونَ", "عِشْرِينَ", "عِشْرَةُ"],
            correct: 1,
            explanation: {
              ar: "العقود لا تتغيّر للمذكّر والمؤنّث؛ عشرون مرفوعة بالواو.",
              de: "Die Zehner wechseln nicht nach Genus; ʿišrūna steht hier im Nominativ mit Wāw.",
            },
          },
          {
            prompt: {
              ar: "أكمل: حضرت ___ طالبةً. والمقصود 23.",
              de: "Ergänze für dreiundzwanzig Schülerinnen.",
            },
            options: [
              "ثَلَاثٌ وَعِشْرُونَ",
              "ثَلَاثَةٌ وَعِشْرُونَ",
              "ثَلَاثٌ وَعِشْرِينَ",
              "ثَلَاثَةٌ وَعِشْرِينَ",
            ],
            correct: 0,
            explanation: {
              ar: "الآحاد 3 إلى 9 تخالف مفرد المعدود، والعقد ثابت للجنسين.",
              de: "Der Einer drei bis neun zeigt Gegenpolung, der Zehner ist für beide Genera gleich.",
            },
          },
          {
            prompt: {
              ar: "اختر تمييز المئة: قرأتُ مئةَ ___.",
              de: "Wähle den Tamyīz nach hundert.",
            },
            options: ["كِتَابًا", "كُتُبٍ", "كِتَابٌ", "كِتَابٍ"],
            correct: 3,
            explanation: {
              ar: "تمييز مئة مفرد مجرور بالإضافة.",
              de: "Nach hundert steht ein Singular im Genitiv als Genitivverbindung.",
            },
          },
          {
            prompt: {
              ar: "اختر تمييز الألف: في المكتبة ألفُ ___.",
              de: "Wähle den Tamyīz nach tausend.",
            },
            options: ["كُتُبٌ", "كِتَابَانِ", "كِتَابٍ", "كِتَابًا"],
            correct: 2,
            explanation: {
              ar: "تمييز ألف مفرد مجرور.",
              de: "Nach tausend steht ein Singular im Genitiv.",
            },
          },
          {
            prompt: {
              ar: "أكمل تمييز العدد: اشتريتُ ثلاثةَ ___.",
              de: "Ergänze das gezählte Nomen nach drei.",
            },
            options: ["كُتُبًا", "كُتُبٍ", "كِتَابًا", "كِتَابٍ"],
            correct: 1,
            explanation: {
              ar: "تمييز الأعداد من 3 إلى 10 جمع مجرور بالإضافة.",
              de: "Nach drei bis zehn steht ein Plural im Genitiv.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "present-inflection",
        glyph: "يفعل",
        title: {
          ar: "إعراب الفعل المضارع وبناؤه",
          de: "Präsens: Modus und Bau",
        },
        summary: {
          ar: "الرفع والنصب والجزم، والمعتلّ والأفعال الخمسة ونونا النسوة والتوكيد.",
          de: "Indikativ, Subjunktiv, Jussiv sowie schwache und gebaute Formen.",
        },
        intro: {
          ar: "المضارع معرب في الأصل: مرفوع أو منصوب أو مجزوم. ويبنى مع نون النسوة، أو نون التوكيد المتصلة به مباشرة. نفرّق بين حركة الإعراب وعلامة البناء وبين المحل الإعرابي للفعل المبني.",
          de: "Das Präsens ist grundsätzlich nach Modus flektierbar: Indikativ, Subjunktiv oder Jussiv. Mit femininem Plural-Nūn oder direkt angehängtem Bekräftigungs-Nūn ist es gebaut. Endungszeichen, Bau und syntaktischer Modusplatz sind zu unterscheiden.",
        },
        sections: [
          {
            title: {
              ar: "الرفع وعلاماته",
              de: "Indikativ und seine Zeichen",
            },
            body: {
              ar: "يرفع إذا لم يسبقه ناصب أو جازم. العلامة ضمة ظاهرة في الصحيح، ومقدّرة على الواو والياء للثقل وعلى الألف للتعذّر. وترفع الأفعال الخمسة بثبوت النون، لا بالواو أو الألف أو الياء التي هي ضمائر فاعل.",
              de: "Ohne Auslöser für Subjunktiv oder Jussiv steht der Indikativ: sichtbare Ḍamma beim starken Ende, nicht sichtbare Ḍamma an Wāw und Yā wegen Schwere und an Alif wegen Unaussprechbarkeit. Die fünf Formen erhalten Nūn; ihre Wāw-, Alif- und Yā-Endungen sind Subjektpronomen.",
            },
            examples: [
              {
                ar: "يَكْتُبُ · يَدْعُو · يَرْمِي · يَسْعَى",
                de: "sichtbare und nicht sichtbare Indikativzeichen",
                focus: "يَسْعَى",
              },
              {
                ar: "الطُّلَّابُ يَكْتُبُونَ.",
                de: "Das Nūn bleibt erhalten.",
                focus: "يَكْتُبُونَ",
              },
            ],
          },
          {
            title: {
              ar: "النصب وعلاماته وأدواته",
              de: "Subjunktiv: Zeichen und Auslöser",
            },
            body: {
              ar: "من أدواته أن ولن وكي، وإذن بشروط منها صدر الجواب والاستقبال وعدم الفصل المانع. العلامة فتحة ظاهرة في الصحيح وعلى الواو والياء، ومقدّرة على الألف؛ والأفعال الخمسة تنصب بحذف النون.",
              de: "Auslöser sind an, lan, kai und unter Bedingungen iḏan (am Anfang einer Antwort, Zukunftsbezug und kein unzulässiger Einschub). Die Fatḥa ist am starken Ende, Wāw und Yā sichtbar, am Alif nicht sichtbar; die fünf Formen verlieren Nūn.",
            },
            examples: [
              {
                ar: "لَنْ يَدْعُوَ · لَنْ يَرْمِيَ · لَنْ يَسْعَى",
                de: "Fatḥa am Wāw/Yā sichtbar, am Alif geschätzt.",
                focus: "يَدْعُوَ",
              },
              {
                ar: "أَنْتِ لَنْ تَكْتُبِي.",
                de: "Die weibliche Du-Form verliert Nūn.",
                focus: "تَكْتُبِي",
              },
            ],
          },
          {
            title: {
              ar: "أن المضمرة",
              de: "Verborgenes an",
            },
            body: {
              ar: "ينصب بأن مضمرة بعد لام التعليل، وتضمر وجوبًا بعد لام الجحود المسبوقة بكون منفي، وبعد حتى للاستقبال النسبي، وفاء السببية وواو المعية المسبوقتين بنفي أو طلب. وكذلك بعد أو بمعنى إلى أن أو إلا أن. ولا تجعل كل فاء أو واو ناصبة؛ الحكم مرتبط بالمعنى والشروط.",
              de: "Verborgenes an wirkt nach Zweck-lām; obligatorisch unter anderem nach lām al-ǧuḥūd mit verneintem kāna, nach zukunftsbezogenem ḥattā sowie kausalem fa- und begleitendem wa- nach Negation oder Aufforderung. Auch nach au im Sinn „bis dass“ oder „es sei denn“. Entscheidend sind Bedeutung und Bedingungen, nicht das bloße Vorhandensein von fa- oder wa-.",
            },
            examples: [
              {
                ar: "أَدْرُسُ لِأَنْجَحَ. مَا كَانَ لِيَكْذِبَ.",
                de: "Zweck-lām und lām al-ǧuḥūd.",
                focus: "لِيَكْذِبَ",
              },
              {
                ar: "لَا تُهْمِلْ فَتَنْدَمَ.",
                de: "Kausales fa- nach einem Verbot.",
                focus: "فَتَنْدَمَ",
              },
              {
                ar: "لَا تَنْهَ عَنْ خُلُقٍ وَتَأْتِيَ مِثْلَهُ.",
                de: "Verbietendes lā, dann wa- im Sinn gleichzeitigen Handelns.",
                focus: "وَتَأْتِيَ",
              },
            ],
          },
          {
            title: {
              ar: "الجزم وعلاماته",
              de: "Jussiv und seine Zeichen",
            },
            body: {
              ar: "لم ولمّا ولام الأمر ولا الناهية تجزم فعلًا واحدًا. وأدوات الشرط الجازمة مثل إن ومن ومهما تجزم فعل الشرط وجوابه. الصحيح يجزم بالسكون، والمعتل الآخر بحذف حرف العلة، والأفعال الخمسة بحذف النون. ولا النافية لا تجزم.",
              de: "Lam, lammā, Befehls-lām und verbietendes lā verlangen einen Jussiv. Jussive Konditionalwörter wie in, man und mahmā regieren Bedingung und Folge. Zeichen sind Sukūn, Wegfall des schwachen Endradikals oder Wegfall des Nūn bei den fünf Formen. Das bloß verneinende lā löst keinen Jussiv aus.",
            },
            examples: [
              {
                ar: "لَمْ يَكْتُبْ · لَمْ يَدْعُ · لَمْ يَرْمِ · لَمْ يَسْعَ",
                de: "Sukūn oder Wegfall des schwachen Endradikals.",
                focus: "يَدْعُ",
              },
              {
                ar: "إِنْ تَدْرُسْ تَنْجَحْ.",
                de: "Bedingung und Folge stehen hier im Jussiv.",
                focus: "تَنْجَحْ",
              },
            ],
          },
          {
            title: {
              ar: "البناء والمحل الإعرابي",
              de: "Bau und Modusplatz",
            },
            body: {
              ar: "يبنى على السكون مع نون النسوة، وعلى الفتح مع نون التوكيد المباشرة، خفيفة أو ثقيلة. ويكون المبني في محل رفع أو نصب أو جزم بحسب الأداة قبله. أمّا نون التوكيد غير المباشرة فلا توجب البناء؛ مثلما يفصل بينها وبين الفعل ألف الاثنين.",
              de: "Mit femininem Plural-Nūn ist das Verb auf Sukūn gebaut, mit direkt angehängtem leichtem oder schwerem Bekräftigungs-Nūn auf Fatḥa. Je nach vorausgehender Partikel nimmt die gebaute Form einen Indikativ-, Subjunktiv- oder Jussivplatz ein. Ein nicht direkter Anschluss, etwa über Dual-Alif, löst diesen Bau nicht aus.",
            },
            examples: [
              {
                ar: "الطَّالِبَاتُ لَنْ يَكْتُبْنَ.",
                de: "Auf Sukūn gebaut am Subjunktivplatz.",
                focus: "يَكْتُبْنَ",
              },
              {
                ar: "لَا تُهْمِلَنَّ وَاجِبَكَ.",
                de: "Auf Fatḥa gebaut am Jussivplatz.",
                focus: "تُهْمِلَنَّ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "حدّد أولًا: معرب أم مبني؟ ثم الأداة، ثم علامة الإعراب أو البناء والمحل.",
          de: "Bestimme zuerst Flektierbarkeit oder Bau, dann Partikel, Endungszeichen und Modusplatz.",
        },
        questions: [
          {
            prompt: {
              ar: "ما علامة رفع «يكتب»؟ المثال: «يَكْتُبُ».",
              de: "Welches Indikativzeichen hat yaktubu? Beispiel: „يَكْتُبُ“.",
            },
            options: [
              {
                ar: "الضمة الظاهرة",
                de: "sichtbare Ḍamma",
              },
              {
                ar: "الضمة المقدّرة",
                de: "nicht sichtbare Ḍamma",
              },
              {
                ar: "ثبوت النون",
                de: "Erhalt des Nūn",
              },
              {
                ar: "الفتحة",
                de: "Fatḥa",
              },
            ],
            correct: 0,
            explanation: {
              ar: "يكتب صحيح الآخر، فتظهر ضمة الرفع.",
              de: "Das Verb endet auf einem starken Konsonanten; die Ḍamma ist sichtbar.",
            },
          },
          {
            prompt: {
              ar: "ما علامة رفع «يدعو»؟ المثال: «يَدْعُو».",
              de: "Welches Indikativzeichen hat yadʿū? Beispiel: „يَدْعُو“.",
            },
            options: [
              {
                ar: "ضمة ظاهرة",
                de: "sichtbare Ḍamma",
              },
              {
                ar: "حذف الواو",
                de: "Wegfall des Wāw",
              },
              {
                ar: "ثبوت النون",
                de: "Erhalt des Nūn",
              },
              {
                ar: "ضمة مقدّرة للثقل",
                de: "nicht sichtbare Ḍamma wegen Schwere",
              },
            ],
            correct: 3,
            explanation: {
              ar: "على الواو ضمة مقدّرة منع من ظهورها الثقل.",
              de: "Die Ḍamma am Wāw wird wegen der Ausspracheerschwernis nicht sichtbar.",
            },
          },
          {
            prompt: {
              ar: "ما علامة رفع «يرمي»؟ المثال: «يَرْمِي».",
              de: "Welches Indikativzeichen hat yarmī? Beispiel: „يَرْمِي“.",
            },
            options: [
              {
                ar: "ضمة ظاهرة",
                de: "sichtbare Ḍamma",
              },
              {
                ar: "حذف النون",
                de: "Wegfall des Nūn",
              },
              {
                ar: "ضمة مقدّرة للثقل",
                de: "nicht sichtbare Ḍamma wegen Schwere",
              },
              {
                ar: "حذف الياء",
                de: "Wegfall des Yā",
              },
            ],
            correct: 2,
            explanation: {
              ar: "يرمي مرفوع بضمة مقدّرة على الياء للثقل.",
              de: "Die Indikativ-Ḍamma am Yā ist nicht sichtbar.",
            },
          },
          {
            prompt: {
              ar: "لماذا لا تظهر ضمة الرفع على «يسعى»؟ المثال: «يَسْعَى».",
              de: "Warum ist die Indikativ-Ḍamma in yasʿā nicht sichtbar? Beispiel: „يَسْعَى“.",
            },
            options: [
              {
                ar: "لاتصاله بنون النسوة",
                de: "wegen femininem Plural-Nūn",
              },
              {
                ar: "للتعذّر على الألف",
                de: "am Alif nicht aussprechbar",
              },
              {
                ar: "لأنه مجزوم",
                de: "weil es Jussiv ist",
              },
              {
                ar: "لحذف النون",
                de: "wegen Nūn-Wegfall",
              },
            ],
            correct: 1,
            explanation: {
              ar: "الضمة مقدّرة على الألف للتعذّر.",
              de: "Am Alif kann die Kasus-/Modusendung nicht ausgesprochen werden.",
            },
          },
          {
            prompt: {
              ar: "ما علامة رفع «يدرسون»؟ المثال: «يَدْرُسُونَ».",
              de: "Welches Indikativzeichen hat yadrusūna? Beispiel: „يَدْرُسُونَ“.",
            },
            options: [
              {
                ar: "ثبوت النون",
                de: "Erhalt des Nūn",
              },
              {
                ar: "الواو",
                de: "Wāw",
              },
              {
                ar: "الضمة الظاهرة",
                de: "sichtbare Ḍamma",
              },
              {
                ar: "حذف النون",
                de: "Wegfall des Nūn",
              },
            ],
            correct: 0,
            explanation: {
              ar: "من الأفعال الخمسة؛ الواو فاعل، وثبوت النون علامة الرفع.",
              de: "Es gehört zu den fünf Formen. Wāw ist Subjektpronomen; das erhaltene Nūn zeigt den Indikativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: أريدُ أنْ ___ الدرسَ.",
              de: "Ergänze nach an.",
            },
            options: ["أَكْتُبُ", "أَكْتُبْ", "كَتَبْتُ", "أَكْتُبَ"],
            correct: 3,
            explanation: {
              ar: "أن تنصب المضارع، وصحيح الآخر ينصب بالفتحة الظاهرة.",
              de: "An verlangt den Subjunktiv mit sichtbarer Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لن ___ إلى الشرّ.",
              de: "Ergänze das Verb yadʿū nach lan.",
            },
            options: ["يَدْعُ", "دَعَا", "يَدْعُوَ", "يَدْعُو"],
            correct: 2,
            explanation: {
              ar: "المعتل بالواو ينصب بفتحة ظاهرة على الواو.",
              de: "Nach lan ist die Subjunktiv-Fatḥa am Wāw sichtbar.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لن ___ الكرةَ.",
              de: "Ergänze das Verb yarmī nach lan.",
            },
            options: ["رَمَى", "يَرْمِيَ", "يَرْمِي", "يَرْمِ"],
            correct: 1,
            explanation: {
              ar: "المعتل بالياء ينصب بفتحة ظاهرة.",
              de: "Die Subjunktiv-Fatḥa am Yā ist sichtbar.",
            },
          },
          {
            prompt: {
              ar: "ما علامة نصب «يسعى» في «لن يسعى»؟",
              de: "Was markiert den Subjunktiv in lan yasʿā?",
            },
            options: [
              {
                ar: "فتحة مقدّرة على الألف",
                de: "nicht sichtbare Fatḥa am Alif",
              },
              {
                ar: "حذف الألف",
                de: "Wegfall des Alif",
              },
              {
                ar: "فتحة ظاهرة",
                de: "sichtbare Fatḥa",
              },
              {
                ar: "حذف النون",
                de: "Wegfall des Nūn",
              },
            ],
            correct: 0,
            explanation: {
              ar: "الألف تمنع ظهور الفتحة للتعذّر.",
              de: "Am Alif ist auch die Subjunktiv-Fatḥa nicht aussprechbar.",
            },
          },
          {
            prompt: {
              ar: "أكمل للمخاطبة: أنتِ لن ___ الرسالةَ.",
              de: "Ergänze nach lan für eine weibliche Angesprochene.",
            },
            options: ["تَكْتُبِينَ", "تَكْتُبُ", "تَكْتُبْنَ", "تَكْتُبِي"],
            correct: 3,
            explanation: {
              ar: "من الأفعال الخمسة؛ علامة النصب حذف النون.",
              de: "Eine der fünf Formen: Das Nūn entfällt im Subjunktiv.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لم ___ الدرسَ.",
              de: "Ergänze yaktubu nach lam.",
            },
            options: ["يَكْتُبَ", "كَتَبَ", "يَكْتُبْ", "يَكْتُبُ"],
            correct: 2,
            explanation: {
              ar: "صحيح الآخر يجزم بالسكون.",
              de: "Ein stark endendes Verb hat Sukūn im Jussiv.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لم ___ إلى الشرّ.",
              de: "Ergänze yadʿū nach lam.",
            },
            options: ["دَعَا", "يَدْعُ", "يَدْعُو", "يَدْعُوَ"],
            correct: 1,
            explanation: {
              ar: "حذفت الواو للجزم، والضمة قبلها ليست علامة رفع.",
              de: "Das Wāw entfällt im Jussiv. Die verbleibende Ḍamma ist kein Indikativzeichen.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لم ___ الكرةَ.",
              de: "Ergänze yarmī nach lam.",
            },
            options: ["يَرْمِ", "يَرْمِي", "يَرْمِيَ", "رَمَى"],
            correct: 0,
            explanation: {
              ar: "حذفت الياء للجزم، وبقيت الكسرة دليلًا عليها.",
              de: "Das Yā entfällt im Jussiv; die Kasra bleibt.",
            },
          },
          {
            prompt: {
              ar: "أكمل: لم ___ إلى الشرّ. والفعل سعى.",
              de: "Ergänze yasʿā nach lam.",
            },
            options: ["يَسْعَى", "يَسْعَيَ", "سَعَى", "يَسْعَ"],
            correct: 3,
            explanation: {
              ar: "يجزم المعتل الآخر بحذف حرف العلّة؛ هنا الألف.",
              de: "Das schwache Endradikal, hier Alif, entfällt im Jussiv.",
            },
          },
          {
            prompt: {
              ar: "أكمل للمثنّى: هما لم ___ الدرسَ.",
              de: "Ergänze nach lam für zwei männliche Dritte.",
            },
            options: ["يَكْتُبُونَ", "يَكْتُبُ", "يَكْتُبَا", "يَكْتُبَانِ"],
            correct: 2,
            explanation: {
              ar: "الفعل من الأفعال الخمسة، فيجزم بحذف النون.",
              de: "Die Dualform verliert im Jussiv das Nūn.",
            },
          },
          {
            prompt: {
              ar: "ما بناء «يكتبْنَ» في «الطالبات يكتبْنَ»؟",
              de: "Wie ist yaktubna konstruiert?",
            },
            options: [
              {
                ar: "مجزوم بحذف النون",
                de: "Jussiv durch Nūn-Wegfall",
              },
              {
                ar: "مبني على السكون في محل رفع",
                de: "auf Sukūn gebaut am Indikativplatz",
              },
              {
                ar: "مرفوع بثبوت النون",
                de: "Indikativ durch erhaltenes Nūn",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
            ],
            correct: 1,
            explanation: {
              ar: "اتصلت به نون النسوة مباشرة، والنون ضمير فاعل.",
              de: "Das feminine Plural-Nūn führt zum Bau auf Sukūn; Nūn ist hier Subjektpronomen.",
            },
          },
          {
            prompt: {
              ar: "ما بناء «يكتبَنَّ» في «والله ليكتبَنَّ» مع هو؟",
              de: "Wie ist yaktubanna mit direktem Bekräftigungs-Nūn gebaut?",
            },
            options: [
              {
                ar: "مبني على الفتح في محل رفع",
                de: "auf Fatḥa gebaut am Indikativplatz",
              },
              {
                ar: "مرفوع بالضمة الظاهرة",
                de: "Indikativ mit sichtbarer Ḍamma",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مجزوم بحذف النون",
                de: "Jussiv mit Nūn-Wegfall",
              },
            ],
            correct: 0,
            explanation: {
              ar: "نون التوكيد المباشرة تبني المضارع على الفتح.",
              de: "Direkt angehängtes Bekräftigungs-Nūn führt zum Bau auf Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "ما محل «يكتبْنَ» في «الطالبات لن يكتبْنَ»؟",
              de: "Welchen Modusplatz hat yaktubna nach lan?",
            },
            options: [
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مجزوم بالسكون",
                de: "Jussiv mit Sukūn",
              },
              {
                ar: "مرفوع بثبوت النون",
                de: "Indikativ mit erhaltenem Nūn",
              },
              {
                ar: "مبني على السكون في محل نصب",
                de: "auf Sukūn gebaut am Subjunktivplatz",
              },
            ],
            correct: 3,
            explanation: {
              ar: "الفعل مبني لاتصاله بنون النسوة، وأداة «لن» تجعله في محل نصب.",
              de: "Das Verb bleibt gebaut; lan setzt es an den Subjunktivplatz.",
            },
          },
          {
            prompt: {
              ar: "أعرب «تُهْمِلَنَّ» في «لا تُهْمِلَنَّ واجبَك» مع أنتَ.",
              de: "Analysiere tuhmilanna nach verbietendem lā mit Bekräftigungs-Nūn.",
            },
            options: [
              {
                ar: "مجزوم بحذف النون",
                de: "Jussiv mit Nūn-Wegfall",
              },
              {
                ar: "مرفوع بالضمة",
                de: "Indikativ mit Ḍamma",
              },
              {
                ar: "مبني على الفتح في محل جزم",
                de: "auf Fatḥa gebaut am Jussivplatz",
              },
              {
                ar: "منصوب بفتحة ظاهرة",
                de: "Subjunktiv mit sichtbarer Fatḥa",
              },
            ],
            correct: 2,
            explanation: {
              ar: "لا الناهية جازمة، والفعل يبقى مبنيًا لاتصال نون التوكيد المباشرة.",
              de: "Das verbietende lā verlangt den Jussivplatz, obwohl das Verb auf Fatḥa gebaut bleibt.",
            },
          },
          {
            prompt: {
              ar: "أكمل بمعنى أنه لم يخرج حتى الآن: لمّا ___.",
              de: "Ergänze nach lammā „noch nicht“.",
            },
            options: ["خَرَجَ", "يَخْرُجْ", "يَخْرُجُ", "يَخْرُجَ"],
            correct: 1,
            explanation: {
              ar: "لمّا تجزم المضارع، وصحيح الآخر يجزم بالسكون.",
              de: "Lammā verlangt den Jussiv, hier mit Sukūn.",
            },
          },
          {
            prompt: {
              ar: "أكمل على إرادة السببية: لا تُهملْ ___ .",
              de: "Ergänze mit kausalem fa- nach einem Verbot.",
            },
            options: ["فَتَنْدَمَ", "فَتَنْدَمُ", "فَتَنْدَمْ", "فَنَدِمَ"],
            correct: 0,
            explanation: {
              ar: "ينصب المضارع بأن مضمرة وجوبًا بعد فاء السببية المسبوقة بطلب.",
              de: "Nach kausalem fa- mit vorausgehendem Verbot wirkt ein obligatorisch verborgenes an.",
            },
          },
          {
            prompt: {
              ar: "أكمل لهدف مستقبل: أجتهدُ حتى ___.",
              de: "Ergänze für ein zukünftiges Ziel nach ḥattā.",
            },
            options: ["أَنْجَحُ", "أَنْجَحْ", "نَجَحْتُ", "أَنْجَحَ"],
            correct: 3,
            explanation: {
              ar: "المضارع المستقبل بالنسبة لما قبله ينصب هنا بأن مضمرة بعد حتى.",
              de: "Das relativ zur vorherigen Handlung zukünftige Verb steht hier nach verborgenem an im Subjunktiv.",
            },
          },
          {
            prompt: {
              ar: "أكمل الشرط والجواب: إنْ ___ ___.",
              de: "Ergänze Bedingung und Folge nach in.",
            },
            options: [
              "تَدْرُسَ تَنْجَحَ",
              "تَدْرُسْ تَنْجَحُ",
              "تَدْرُسْ تَنْجَحْ",
              "تَدْرُسُ تَنْجَحُ",
            ],
            correct: 2,
            explanation: {
              ar: "إن الشرطية تجزم فعل الشرط وجوابه عند كونهما مضارعين هنا.",
              de: "Das konditionale in setzt hier beide Präsensverben in den Jussiv.",
            },
          },
          {
            prompt: {
              ar: "هل يكفي وجود نون التوكيد لبناء المضارع على الفتح؟",
              de: "Führt jedes Bekräftigungs-Nūn zum Bau des Präsens auf Fatḥa?",
            },
            options: [
              {
                ar: "تجعله ماضيًا",
                de: "es wird dadurch Perfekt",
              },
              {
                ar: "لا؛ يشترط اتصالها المباشر بالفعل",
                de: "Nein, es muss direkt am Verbstamm stehen",
              },
              {
                ar: "نعم، بلا شرط",
                de: "ja, ohne Bedingung",
              },
              {
                ar: "تبنيه دائمًا على السكون",
                de: "immer Bau auf Sukūn",
              },
            ],
            correct: 1,
            explanation: {
              ar: "الاتصال غير المباشر، مع فاصل كألف الاثنين، لا يوجب هذا البناء.",
              de: "Ein indirekter Anschluss, etwa mit Dual-Alif dazwischen, löst diesen Bau nicht aus.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "past-construction",
        glyph: "فَعَلَ",
        title: {
          ar: "بناء الفعل الماضي وإعرابه",
          de: "Perfekt: Bau und Analyse",
        },
        summary: {
          ar: "الفتح والسكون والضم، والضمائر والمحل الإعرابي.",
          de: "Fatḥa, Sukūn, Ḍamma und Subjektendungen.",
        },
        intro: {
          ar: "الفعل الماضي مبني دائمًا. تختلف علامة بنائه بحسب ما يتصل به، وقد يظهر الفتح أو يقدّر، وقد يقع الماضي في محل إعرابي دون أن يصبح معربًا.",
          de: "Das Perfekt ist immer gebaut. Sein Bauzeichen hängt von den angehängten Endungen ab. Die Fatḥa kann sichtbar oder nicht sichtbar sein; ein syntaktischer Modusplatz macht es nicht flektierbar.",
        },
        sections: [
          {
            title: {
              ar: "البناء على الفتح",
              de: "Bau auf Fatḥa",
            },
            body: {
              ar: "الأصل الفتح إذا لم يتصل به شيء، أو اتصلت به تاء التأنيث الساكنة أو ألف الاثنين. وتقدّر الفتحة على الألف، مثل دعا وسعى.",
              de: "Grundfall ist Fatḥa ohne Endung sowie mit femininem vokallosem Tā oder Dual-Alif. Am Alif ist sie nicht sichtbar, etwa in daʿā und saʿā.",
            },
            examples: [
              {
                ar: "كَتَبَ · كَتَبَتْ · كَتَبَا",
                de: "Fatḥa ohne Endung, mit femininem Tā und mit Dual-Alif.",
                focus: "كَتَبَا",
              },
              {
                ar: "دَعَا · سَعَى",
                de: "nicht sichtbare Fatḥa am Alif",
                focus: "سَعَى",
              },
            ],
          },
          {
            title: {
              ar: "البناء على السكون",
              de: "Bau auf Sukūn",
            },
            body: {
              ar: "مع تاء الفاعل المتحركة، ونا الفاعلين، ونون النسوة. لا تخلط بين تاء كتبتُ وهي ضمير، وتاء كتبتْ وهي حرف تأنيث.",
              de: "Mit vokalisiertem Subjekt-Tā, Subjekt-nā oder femininem Plural-Nūn. Das Tā in katabtu ist ein Pronomen; das in katabat ein Femininmarker.",
            },
            examples: [
              {
                ar: "كَتَبْتُ · كَتَبْنَا · كَتَبْنَ",
                de: "Sukūn vor diesen Subjektendungen.",
                focus: "كَتَبْنَا",
              },
            ],
          },
          {
            title: {
              ar: "البناء على الضم",
              de: "Bau auf Ḍamma",
            },
            body: {
              ar: "مع واو الجماعة، مثل كتبوا. الواو ضمير في محل رفع فاعل، والألف بعدها فارقة لا محل لها. وفي بعض الأفعال المعتلّة تحدث تغييرات إعلال، وتقدّر علامة البناء بحسب الصورة الأصلية، مثل سعوا.",
              de: "Mit Plural-Wāw, etwa katabū. Wāw ist Subjektpronomen, das folgende Alif ein stummes Unterscheidungszeichen. Bei manchen schwachen Verben treten Stammänderungen und nicht sichtbare Bauzeichen auf, etwa in saʿau.",
            },
            examples: [
              {
                ar: "كَتَبُوا الدَّرْسَ.",
                de: "Das Verb ist auf Ḍamma gebaut.",
                focus: "كَتَبُوا",
              },
            ],
          },
          {
            title: {
              ar: "المحل الإعرابي لا يغيّر البناء",
              de: "Ein Modusplatz ändert den Bau nicht",
            },
            body: {
              ar: "قد يأتي الماضي فعل شرط أو جواب شرط جازم في محل جزم، مع بقائه مبنيًا. وقد يكون مبنيًا للمجهول، فيرفع نائب فاعل بدل الفاعل. لا يدخل الماضي في حالات رفع المضارع ونصبه وجزمه.",
              de: "Ein Perfekt kann den Jussivplatz einer Bedingung oder Folge einnehmen und bleibt dennoch gebaut. Im Passiv regiert es ein Passivsubjekt. Die Modusflexion des Präsens ist nicht auf die Perfektendung übertragbar.",
            },
            examples: [
              {
                ar: "إِنْ جَاءَ زَيْدٌ أَكْرَمْتُهُ.",
                de: "Gebautes Perfekt in einem jussiven Bedingungssatz.",
                focus: "جَاءَ",
              },
              {
                ar: "كُتِبَ الدَّرْسُ.",
                de: "Passiv: ad-darsu ist Passivsubjekt.",
                focus: "كُتِبَ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "اسأل عمّا اتصل بالفعل: تاء تأنيث، أم ضمير فاعل؟ ثم حدّد علامة البناء.",
          de: "Unterscheide Femininmarker und Subjektpronomen und bestimme dann das Bauzeichen.",
        },
        questions: [
          {
            prompt: {
              ar: "ما علامة بناء الفعل «كَتَبَ»؟",
              de: "Wie ist „كَتَبَ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على الضم",
                de: "auf Ḍamma gebaut",
              },
              {
                ar: "معرب مرفوع",
                de: "flektiert im Indikativ",
              },
            ],
            correct: 0,
            explanation: {
              ar: "لم يتصل به ما يغيّر بناءه، فهو مبني على الفتح الظاهر.",
              de: "Ohne entsprechende Endung ist es auf sichtbare Fatḥa gebaut.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الفعل «كَتَبَتْ»؟",
              de: "Wie ist „كَتَبَتْ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على الضم",
                de: "auf Ḍamma gebaut",
              },
              {
                ar: "معرب مرفوع",
                de: "flektiert im Indikativ",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
            ],
            correct: 3,
            explanation: {
              ar: "تاء التأنيث الساكنة لا تغيّر بناء الماضي على الفتح.",
              de: "Das vokallose feminine Tā ändert den Bau auf Fatḥa nicht.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الفعل «كَتَبَا»؟",
              de: "Wie ist „كَتَبَا“ gebaut?",
            },
            options: [
              {
                ar: "مبني على الضم",
                de: "auf Ḍamma gebaut",
              },
              {
                ar: "معرب مرفوع",
                de: "flektiert im Indikativ",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
            ],
            correct: 2,
            explanation: {
              ar: "الماضي المتصل بألف الاثنين مبني على الفتح.",
              de: "Mit Dual-Alif bleibt der Bau auf Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الفعل «كَتَبْتُ»؟",
              de: "Wie ist „كَتَبْتُ“ gebaut?",
            },
            options: [
              {
                ar: "معرب مرفوع",
                de: "flektiert im Indikativ",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على الضم",
                de: "auf Ḍamma gebaut",
              },
            ],
            correct: 2,
            explanation: {
              ar: "لاتصاله بتاء الفاعل المتحرّكة.",
              de: "Die vokalisierte Subjekt-Tā-Endung führt zum Bau auf Sukūn.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الفعل «كَتَبْتَ»؟",
              de: "Wie ist „كَتَبْتَ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على الضم",
                de: "auf Ḍamma gebaut",
              },
              {
                ar: "معرب مرفوع",
                de: "flektiert im Indikativ",
              },
            ],
            correct: 1,
            explanation: {
              ar: "تاء المخاطب من تاء الفاعل المتحرّكة.",
              de: "Auch die männliche Du-Endung ist ein vokalisiertes Subjekt-Tā.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الفعل «كَتَبْنَا»؟",
              de: "Wie ist „كَتَبْنَا“ gebaut?",
            },
            options: [
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على الضم",
                de: "auf Ḍamma gebaut",
              },
              {
                ar: "معرب مرفوع",
                de: "flektiert im Indikativ",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
            ],
            correct: 0,
            explanation: {
              ar: "نا الفاعلين تجعل الماضي مبنيًا على السكون.",
              de: "Das Subjekt-nā führt zum Bau auf Sukūn.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الفعل «كَتَبْنَ»؟",
              de: "Wie ist „كَتَبْنَ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على الضم",
                de: "auf Ḍamma gebaut",
              },
              {
                ar: "معرب مرفوع",
                de: "flektiert im Indikativ",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
            ],
            correct: 3,
            explanation: {
              ar: "نون النسوة ضمير فاعل، والماضي معها مبني على السكون.",
              de: "Mit femininem Plural-Nūn ist das Perfekt auf Sukūn gebaut.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الفعل «كَتَبُوا»؟",
              de: "Wie ist „كَتَبُوا“ gebaut?",
            },
            options: [
              {
                ar: "معرب مرفوع",
                de: "flektiert im Indikativ",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على الضم",
                de: "auf Ḍamma gebaut",
              },
            ],
            correct: 3,
            explanation: {
              ar: "لاتصاله بواو الجماعة؛ والواو نفسها ضمير فاعل.",
              de: "Mit Plural-Wāw ist das Verb auf Ḍamma gebaut; Wāw selbst ist Subjektpronomen.",
            },
          },
          {
            prompt: {
              ar: "كيف يعرب «سعى» في «سعى الطالبُ»؟",
              de: "Analysiere saʿā im Satz „Der Schüler bemühte sich“.",
            },
            options: [
              {
                ar: "ماضٍ مبني على فتح مقدّر على الألف",
                de: "Perfekt, auf nicht sichtbare Fatḥa am Alif gebaut",
              },
              {
                ar: "مجزوم بحذف حرف العلة",
                de: "Jussiv mit Radikalwegfall",
              },
              {
                ar: "مرفوع بضمة ظاهرة",
                de: "Indikativ mit sichtbarer Ḍamma",
              },
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
            ],
            correct: 0,
            explanation: {
              ar: "الألف تمنع ظهور فتحة البناء للتعذّر.",
              de: "Am Alif ist die Fatḥa des Baus nicht aussprechbar.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء «دعا» في «دعا المؤمنُ»؟",
              de: "Wie ist daʿā in diesem Satz gebaut?",
            },
            options: [
              {
                ar: "سكون ظاهر",
                de: "sichtbares Sukūn",
              },
              {
                ar: "حذف الألف",
                de: "Wegfall des Alif",
              },
              {
                ar: "حذف النون",
                de: "Wegfall des Nūn",
              },
              {
                ar: "فتح مقدّر على الألف",
                de: "nicht sichtbare Fatḥa am Alif",
              },
            ],
            correct: 3,
            explanation: {
              ar: "دعا ماضٍ مبني على الفتح المقدّر، لا مجزوم.",
              de: "Daʿā ist ein Perfekt auf nicht sichtbare Fatḥa gebaut.",
            },
          },
          {
            prompt: {
              ar: "ما التاء في «كَتَبَتْ سارةُ»؟",
              de: "Welche Funktion hat Tā in katabat Sāra?",
            },
            options: [
              {
                ar: "مفعول به",
                de: "Objekt",
              },
              {
                ar: "علامة نصب",
                de: "Akkusativzeichen",
              },
              {
                ar: "حرف تأنيث لا محل له",
                de: "Femininmarker ohne Kasusplatz",
              },
              {
                ar: "ضمير فاعل",
                de: "Subjektpronomen",
              },
            ],
            correct: 2,
            explanation: {
              ar: "التاء الساكنة للتأنيث، وسارة هي الفاعل.",
              de: "Das vokallose Tā markiert Femininum; Sāra ist das Subjekt.",
            },
          },
          {
            prompt: {
              ar: "ما إعراب «نا» في «كتبْنا الدرسَ»؟",
              de: "Welche Funktion hat nā in katabnā?",
            },
            options: [
              {
                ar: "تاء تأنيث",
                de: "Feminin-Tā",
              },
              {
                ar: "ضمير في محل رفع فاعل",
                de: "Pronomen am Nominativplatz als Subjekt",
              },
              {
                ar: "حرف جر",
                de: "Präposition",
              },
              {
                ar: "علامة جزم",
                de: "Jussivzeichen",
              },
            ],
            correct: 1,
            explanation: {
              ar: "نا هنا للفاعلين، وبناء الفعل على السكون.",
              de: "Nā ist hier das Subjekt; das Verb ist auf Sukūn gebaut.",
            },
          },
          {
            prompt: {
              ar: "هل «لم» تجزم الفعل الماضي؟",
              de: "Setzt lam ein Perfekt in den Jussiv?",
            },
            options: [
              {
                ar: "لا؛ تدخل على المضارع فتجزم لفظه وتنفي حدثه في الماضي",
                de: "Nein; es regiert ein Präsens und verneint dessen Ereignis in der Vergangenheit",
              },
              {
                ar: "نعم، فتجزم كتبَ",
                de: "ja, es regiert kataba",
              },
              {
                ar: "تنصب الماضي دائمًا",
                de: "es setzt Perfekt stets in den Subjunktiv",
              },
              {
                ar: "تحوّل الماضي إلى اسم",
                de: "es macht ein Nomen daraus",
              },
            ],
            correct: 0,
            explanation: {
              ar: "لم تدخل على المضارع؛ الدلالة الزمنية الماضية لا تجعل الصيغة ماضيًا.",
              de: "Lam regiert eine Präsensform, auch wenn die Bedeutung vergangen ist.",
            },
          },
          {
            prompt: {
              ar: "أعرب «جاء» في «إنْ جاءَ زيدٌ أكرمتُهُ».",
              de: "Analysiere ǧāʾa nach konditionalem in.",
            },
            options: [
              {
                ar: "مجزوم بسكون ظاهر",
                de: "Jussiv mit sichtbarem Sukūn",
              },
              {
                ar: "منصوب بالفتحة",
                de: "Subjunktiv mit Fatḥa",
              },
              {
                ar: "مرفوع بالضمة",
                de: "Indikativ mit Ḍamma",
              },
              {
                ar: "ماضٍ مبني على الفتح في محل جزم فعل الشرط",
                de: "Perfekt auf Fatḥa gebaut am Jussivplatz der Bedingung",
              },
            ],
            correct: 3,
            explanation: {
              ar: "الفعل يبقى مبنيًا، ويأخذ محلّ الجزم بأداة الشرط الجازمة.",
              de: "Das Perfekt bleibt gebaut und nimmt hier den Jussivplatz des Bedingungsverbs ein.",
            },
          },
          {
            prompt: {
              ar: "ما بناء «كُتِبَ» في «كُتِبَ الدرسُ»؟",
              de: "Wie ist das passive Perfekt kutiba gebaut?",
            },
            options: [
              {
                ar: "مبني على الضم",
                de: "auf Ḍamma gebaut",
              },
              {
                ar: "معرب مرفوع",
                de: "flektiert im Indikativ",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
            ],
            correct: 2,
            explanation: {
              ar: "البناء للمجهول لا يغيّر حكمه هنا: مبني على الفتح.",
              de: "Das Passiv ändert hier nichts am Bau auf Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "أي عبارة صحيحة عن الفعل الماضي؟",
              de: "Welche Aussage über das Perfekt stimmt?",
            },
            options: [
              {
                ar: "منصوب بعد لن",
                de: "nach lan Subjunktiv",
              },
              {
                ar: "مبني دائمًا وقد يكون له محل إعرابي",
                de: "immer gebaut, gegebenenfalls mit syntaktischem Modusplatz",
              },
              {
                ar: "مرفوع دائمًا",
                de: "immer Indikativ",
              },
              {
                ar: "مجزوم دائمًا",
                de: "immer Jussiv",
              },
            ],
            correct: 1,
            explanation: {
              ar: "نصف حركة آخره بعلامة البناء، ولا نسمّيها رفعًا أو نصبًا.",
              de: "Seine Endung ist ein Bauzeichen, keine Indikativ- oder Subjunktivflexion.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "imperative-construction",
        glyph: "اِفْعَلْ",
        title: {
          ar: "بناء فعل الأمر وإعرابه",
          de: "Imperativ: Bau und Analyse",
        },
        summary: {
          ar: "السكون وحذف حرف العلة وحذف النون والفتح.",
          de: "Vier Bauzeichen und die Abgrenzung zum Jussiv.",
        },
        intro: {
          ar: "فعل الأمر مبني دائمًا، وله أربع علامات بناء بحسب آخره وما اتصل به. نميّز صيغة الأمر من المضارع المجزوم بلام الأمر أو بلا الناهية، ولو اشتركت في معنى الطلب.",
          de: "Der Imperativ ist immer gebaut und hat vier Bauzeichen. Er ist von einem Präsens im Jussiv nach Befehls-lām oder verbietendem lā zu unterscheiden, auch wenn alle eine Aufforderung ausdrücken.",
        },
        sections: [
          {
            title: {
              ar: "البناء على السكون",
              de: "Bau auf Sukūn",
            },
            body: {
              ar: "في صحيح الآخر غير المتصل بضمير يغيّر الحكم، وكذلك مع نون النسوة. وقد تحرّك السكون حركة عارضة للتخلص من التقاء الساكنين، مثل افتحِ الباب.",
              de: "Bei starkem Endkonsonanten ohne andere maßgebliche Endung sowie mit femininem Plural-Nūn. Eine zusätzliche Hilfsbewegung beim Anschluss ändert diesen Bau nicht, etwa iftaḥi al-bāba.",
            },
            examples: [
              {
                ar: "اُكْتُبْ · اُكْتُبْنَ",
                de: "Sukūn ohne Endung und mit femininem Plural-Nūn.",
                focus: "اُكْتُبْنَ",
              },
              {
                ar: "اِفْتَحِ الْبَابَ.",
                de: "Zusätzliche Kasra beim Anschluss, ursprünglicher Bau auf Sukūn.",
                focus: "اِفْتَحِ",
              },
            ],
          },
          {
            title: {
              ar: "حذف حرف العلة",
              de: "Wegfall des schwachen Endradikals",
            },
            body: {
              ar: "إذا كان معتل الآخر غير المتصل بما يغيّر الحكم: اسعَ من يسعى، وادعُ من يدعو، وارمِ من يرمي. الفتحة أو الضمة أو الكسرة الباقية ليست علامة بناء مستقلة، بل دليل على الحرف المحذوف.",
              de: "Beim schwachen Endradikal: isʿa aus yasʿā, udʿu aus yadʿū, irmi aus yarmī. Der verbleibende Vokal weist auf den weggefallenen Radikal hin und ist kein eigenes Bauzeichen.",
            },
            examples: [
              {
                ar: "اِسْعَ · اُدْعُ · اِرْمِ",
                de: "Alif, Wāw und Yā fallen jeweils weg.",
                focus: "اُدْعُ",
              },
            ],
          },
          {
            title: {
              ar: "حذف النون",
              de: "Wegfall des Nūn",
            },
            body: {
              ar: "مع ألف الاثنين أو واو الجماعة أو ياء المخاطبة، قياسًا على جزم المضارع الموافق من الأفعال الخمسة. الضمائر المتصلة فاعل، وليست هي علامة البناء.",
              de: "Mit Dual-Alif, Plural-Wāw oder weiblichem Du-Yā, entsprechend dem Jussiv der fünf Präsensformen. Die angehängten Elemente sind Subjektpronomen, nicht selbst das Bauzeichen.",
            },
            examples: [
              {
                ar: "اُكْتُبَا · اُكْتُبُوا · اُكْتُبِي",
                de: "Drei Endungstypen mit Nūn-Wegfall.",
                focus: "اُكْتُبِي",
              },
            ],
          },
          {
            title: {
              ar: "الفتح ونون التوكيد",
              de: "Fatḥa und Bekräftigungs-Nūn",
            },
            body: {
              ar: "يبنى على الفتح إذا اتصلت به نون التوكيد مباشرة، خفيفة أو ثقيلة. نون التوكيد حرف لا محل له، ونون النسوة ضمير فاعل ولا تبني الأمر على الفتح.",
              de: "Direktes leichtes oder schweres Bekräftigungs-Nūn führt zum Bau auf Fatḥa. Dieses Nūn ist eine Partikel, das feminine Plural-Nūn hingegen ein Subjektpronomen und kein Auslöser dieses Fatḥa-Baus.",
            },
            examples: [
              {
                ar: "اُكْتُبَنَّ · اُكْتُبَنْ",
                de: "Schweres und leichtes Bekräftigungs-Nūn.",
                focus: "اُكْتُبَنَّ",
              },
            ],
          },
          {
            title: {
              ar: "الطلب لا يحدّد نوع الفعل وحده",
              de: "Die Bedeutung bestimmt nicht allein die Verbform",
            },
            body: {
              ar: "اكتب فعل أمر؛ ليكتب مضارع مجزوم بلام الأمر؛ لا تكتب مضارع مجزوم بلا الناهية. ننظر إلى الصيغة والأداة معًا.",
              de: "Uktub ist Imperativ, li-yaktub Präsens im Jussiv nach Befehls-lām und lā taktub Präsens im Jussiv nach verbietendem lā.",
            },
            examples: [
              {
                ar: "اُكْتُبْ · لِيَكْتُبْ · لَا تَكْتُبْ",
                de: "Imperativ · Befehls-lām · Verbot",
                focus: "لِيَكْتُبْ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "للأمر أربع علامات بناء؛ لا نسمّيه منصوبًا أو مجزومًا لمجرّد شكل آخره.",
          de: "Der Imperativ hat vier Bauzeichen; die äußere Endung macht ihn nicht zu Subjunktiv oder Jussiv.",
        },
        questions: [
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اُكْتُبْ»؟",
              de: "Wie ist der Imperativ „اُكْتُبْ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
            ],
            correct: 0,
            explanation: {
              ar: "أمر صحيح الآخر لم يتصل به ما يغيّر بناءه.",
              de: "Stark endender Imperativ ohne entsprechende Endung: Sukūn.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اِجْلِسْ»؟",
              de: "Wie ist der Imperativ „اِجْلِسْ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
            ],
            correct: 3,
            explanation: {
              ar: "يبنى الأمر الصحيح الآخر هنا على السكون.",
              de: "Auch dieser stark endende Imperativ ist auf Sukūn gebaut.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اُكْتُبْنَ»؟",
              de: "Wie ist der Imperativ „اُكْتُبْنَ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
            ],
            correct: 2,
            explanation: {
              ar: "مع نون النسوة يبنى على السكون، والنون ضمير فاعل.",
              de: "Mit femininem Plural-Nūn gilt Sukūn; Nūn ist Subjektpronomen.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اِسْعَ»؟",
              de: "Wie ist der Imperativ „اِسْعَ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
            ],
            correct: 2,
            explanation: {
              ar: "حذفت ألف الفعل المعتل، والفتحة قبلها دليل عليها.",
              de: "Das schwache Alif entfällt; die vorherige Fatḥa bleibt als Hinweis.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اُدْعُ»؟",
              de: "Wie ist der Imperativ „اُدْعُ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
            ],
            correct: 1,
            explanation: {
              ar: "حذفت الواو، والضمة ليست علامة بناء على الضم.",
              de: "Das Wāw entfällt. Die verbleibende Ḍamma ist kein Bau auf Ḍamma.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اِرْمِ»؟",
              de: "Wie ist der Imperativ „اِرْمِ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
            ],
            correct: 0,
            explanation: {
              ar: "حذفت الياء وبقيت الكسرة قبلها.",
              de: "Das Yā entfällt; die vorherige Kasra bleibt.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اُكْتُبَا»؟",
              de: "Wie ist der Imperativ „اُكْتُبَا“ gebaut?",
            },
            options: [
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
            ],
            correct: 0,
            explanation: {
              ar: "الأمر المتصل بألف الاثنين يبنى على حذف النون.",
              de: "Mit Dual-Alif wird der Imperativ auf Nūn-Wegfall gebaut.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اُكْتُبُوا»؟",
              de: "Wie ist der Imperativ „اُكْتُبُوا“ gebaut?",
            },
            options: [
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
            ],
            correct: 3,
            explanation: {
              ar: "مع واو الجماعة تكون علامة البناء حذف النون.",
              de: "Mit Plural-Wāw ist Nūn-Wegfall das Bauzeichen.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اُكْتُبِي»؟",
              de: "Wie ist der Imperativ „اُكْتُبِي“ gebaut?",
            },
            options: [
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
            ],
            correct: 2,
            explanation: {
              ar: "مع ياء المخاطبة يبنى على حذف النون.",
              de: "Mit weiblichem Du-Yā gilt Nūn-Wegfall.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اُكْتُبَنَّ»؟",
              de: "Wie ist der Imperativ „اُكْتُبَنَّ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
            ],
            correct: 2,
            explanation: {
              ar: "نون التوكيد الثقيلة المتصلة مباشرة تبنيه على الفتح.",
              de: "Direktes schweres Bekräftigungs-Nūn führt zum Bau auf Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "ما علامة بناء الأمر «اُكْتُبَنْ»؟",
              de: "Wie ist der Imperativ „اُكْتُبَنْ“ gebaut?",
            },
            options: [
              {
                ar: "مبني على حذف النون",
                de: "auf Nūn-Wegfall gebaut",
              },
              {
                ar: "مبني على الفتح",
                de: "auf Fatḥa gebaut",
              },
              {
                ar: "مبني على السكون",
                de: "auf Sukūn gebaut",
              },
              {
                ar: "مبني على حذف حرف العلة",
                de: "auf Wegfall des schwachen Endradikals gebaut",
              },
            ],
            correct: 1,
            explanation: {
              ar: "نون التوكيد الخفيفة المباشرة تبنيه على الفتح أيضًا.",
              de: "Auch direktes leichtes Bekräftigungs-Nūn führt zum Bau auf Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "ما نوع الفعل في «لِيَكْتُبْ الطالبُ»؟",
              de: "Welche Verbform steht nach Befehls-lām?",
            },
            options: [
              {
                ar: "اسم فعل هنا",
                de: "hier erstarrter Verbausdruck",
              },
              {
                ar: "مضارع مجزوم بلام الأمر",
                de: "Präsens im Jussiv nach Befehls-lām",
              },
              {
                ar: "أمر مبني على السكون",
                de: "Imperativ auf Sukūn",
              },
              {
                ar: "ماضٍ مبني على الفتح",
                de: "Perfekt auf Fatḥa",
              },
            ],
            correct: 1,
            explanation: {
              ar: "معنى الطلب لا يجعل كل صيغة فعل أمر؛ ليكتب مضارع مجزوم.",
              de: "Eine Aufforderungsbedeutung macht die Form nicht zum Imperativ: li-yaktub ist Präsens im Jussiv.",
            },
          },
          {
            prompt: {
              ar: "ما النون في «اُكْتُبْنَ»؟",
              de: "Was ist Nūn in uktubna?",
            },
            options: [
              {
                ar: "نون النسوة: ضمير في محل رفع فاعل",
                de: "feminines Subjektpronomen am Nominativplatz",
              },
              {
                ar: "نون التوكيد",
                de: "Bekräftigungs-Nūn",
              },
              {
                ar: "علامة رفع",
                de: "Indikativzeichen",
              },
              {
                ar: "حرف جر",
                de: "Präposition",
              },
            ],
            correct: 0,
            explanation: {
              ar: "نون النسوة ضمير، بخلاف نون التوكيد التي هي حرف لا محل له.",
              de: "Das feminine Nūn ist ein Pronomen, das Bekräftigungs-Nūn hingegen eine Partikel.",
            },
          },
          {
            prompt: {
              ar: "ما الواو في «اُكْتُبُوا»؟",
              de: "Was ist Wāw in uktubū?",
            },
            options: [
              {
                ar: "علامة البناء وحدها",
                de: "alleiniges Bauzeichen",
              },
              {
                ar: "حرف عطف",
                de: "Konjunktion",
              },
              {
                ar: "نون محذوفة",
                de: "entferntes Nūn",
              },
              {
                ar: "ضمير في محل رفع فاعل",
                de: "Subjektpronomen am Nominativplatz",
              },
            ],
            correct: 3,
            explanation: {
              ar: "الواو فاعل، وعلامة البناء حذف النون.",
              de: "Wāw ist Subjektpronomen; das Bauzeichen ist der Wegfall des Nūn.",
            },
          },
          {
            prompt: {
              ar: "أعرب «اِفْتَحِ» في «اِفْتَحِ البابَ».",
              de: "Analysiere iftaḥi vor dem bestimmten Nomen al-bāb.",
            },
            options: [
              {
                ar: "ماضٍ مبني على الفتح",
                de: "Perfekt auf Fatḥa",
              },
              {
                ar: "مضارع مجزوم",
                de: "Präsens im Jussiv",
              },
              {
                ar: "أمر مبني على السكون وحُرّك بالكسر للتخلص من التقاء الساكنين",
                de: "Imperativ auf Sukūn, mit Hilfskasra zur Vermeidung zweier vokalloser Laute",
              },
              {
                ar: "مبني على الكسر أصلًا",
                de: "grundsätzlich auf Kasra gebaut",
              },
            ],
            correct: 2,
            explanation: {
              ar: "الكسر العارض في الوصل لا يغيّر علامة البناء الأصلية.",
              de: "Die zusätzliche Kasra beim Anschluss ändert das ursprüngliche Bauzeichen nicht.",
            },
          },
          {
            prompt: {
              ar: "ما نوع «تكتبْ» في «لا تكتبْ على الجدار»؟",
              de: "Welche Form ist taktub nach verbietendem lā?",
            },
            options: [
              {
                ar: "اسم",
                de: "Nomen",
              },
              {
                ar: "مضارع مجزوم بلا الناهية",
                de: "Präsens im Jussiv nach verbietendem lā",
              },
              {
                ar: "فعل أمر مبني",
                de: "gebauter Imperativ",
              },
              {
                ar: "ماضٍ",
                de: "Perfekt",
              },
            ],
            correct: 1,
            explanation: {
              ar: "النهي يصاغ هنا بلا الناهية والمضارع المجزوم، لا بصيغة فعل الأمر.",
              de: "Das Verbot besteht hier aus lā und Präsens im Jussiv, nicht aus einer Imperativform.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "adjectival-attribute",
        glyph: "نعت",
        title: {
          ar: "النعت",
          de: "Das Attribut: Naʿt",
        },
        summary: {
          ar: "التطابق، والنعت الحقيقي والسببي، والجملة وشبه الجملة.",
          de: "Kongruenz sowie direkte, indirekte und satzförmige Attribute.",
        },
        intro: {
          ar: "النعت تابع يصف اسمًا قبله يسمى المنعوت، ويتبعه في الإعراب. والنعت الحقيقي يصف المنعوت نفسه، والسببي يصف شيئًا مرتبطًا به.",
          de: "Naʿt beschreibt ein vorausgehendes Nomen und folgt dessen Kasus. Ein echtes Attribut beschreibt das Nomen selbst, ein indirektes etwas mit ihm Verbundenes.",
        },
        sections: [
          {
            title: {
              ar: "النعت الحقيقي والتطابق",
              de: "Echtes Attribut und Kongruenz",
            },
            body: {
              ar: "النعت الحقيقي المفرد يوافق منعوته في الإعراب والتعريف والتنكير والجنس والعدد. وجمع غير العاقل يعامل غالبًا معاملة المفرد المؤنّث. والمفرد هنا مقابل الجملة وشبه الجملة، لا مقابل المثنّى والجمع.",
              de: "Ein einzelwortiges echtes Attribut stimmt in Kasus, Bestimmtheit, Genus und Numerus überein. Nichtmenschliche Plurale werden meist wie feminine Singulare behandelt. „Einzelwortig“ grenzt hier Satz und Präpositionalgruppe ab, nicht Dual und Plural.",
            },
            examples: [
              {
                ar: "رَأَيْتُ طَالِبًا مُجْتَهِدًا.",
                de: "Ich sah einen fleißigen Schüler.",
                focus: "مُجْتَهِدًا",
              },
              {
                ar: "قَرَأْتُ كُتُبًا مُفِيدَةً.",
                de: "Ich las nützliche Bücher.",
                focus: "مُفِيدَةً",
              },
            ],
          },
          {
            title: {
              ar: "النعت السببي",
              de: "Indirektes Attribut",
            },
            body: {
              ar: "يتبع المنعوت في الإعراب والتعريف والتنكير، ويأتي مفردًا، ويوافق الاسم الظاهر المرفوع بعده في التذكير والتأنيث. ويتصل الاسم اللاحق بضمير يعود على المنعوت.",
              de: "Es folgt dem Bezugsnomen in Kasus und Bestimmtheit, steht im Singular und stimmt im Genus mit dem folgenden ausdrücklich genannten Nominativnomen überein. Dieses enthält ein rückverweisendes Pronomen.",
            },
            examples: [
              {
                ar: "مَرَرْتُ بِرَجُلٍ كَرِيمَةٍ أُمُّهُ.",
                de: "Ich ging an einem Mann vorbei, dessen Mutter großzügig ist.",
                focus: "كَرِيمَةٍ",
              },
            ],
          },
          {
            title: {
              ar: "جملة وشبه جملة، وتمييز الخبر",
              de: "Attributsatz, Präpositionalgruppe und Prädikat",
            },
            body: {
              ar: "قد يكون النعت جملة بعد نكرة مع رابط، أو شبه جملة متعلقة بمحذوف صفة، بحسب السياق. أمّا الطالب مجتهد فمجتهد خبر، بينما الطالب المجتهد حضر فيها المجتهد نعت. لا نحكم من صفة الكلمة المعجمية وحدها.",
              de: "Ein Attribut kann als Satz mit Rückverweis nach einem unbestimmten Nomen oder als entsprechende Präpositionalgruppe auftreten. In „Der Schüler ist fleißig“ ist muǧtahidun Prädikat, in „Der fleißige Schüler kam“ Attribut. Die Wörterbuchbedeutung allein bestimmt die Funktion nicht.",
            },
            examples: [
              {
                ar: "رَأَيْتُ طِفْلًا يَضْحَكُ.",
                de: "Ich sah ein Kind, das lacht.",
                focus: "يَضْحَكُ",
              },
              {
                ar: "الطَّالِبُ مُجْتَهِدٌ. الطَّالِبُ الْمُجْتَهِدُ حَضَرَ.",
                de: "Prädikat gegenüber Attribut.",
                focus: "الْمُجْتَهِدُ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "حدّد المنعوت ثم نوع النعت؛ فشروط الحقيقي ليست كلها شروط السببي.",
          de: "Bestimme Bezugsnomen und Attributtyp; direktes und indirektes Attribut haben unterschiedliche Kongruenzregeln.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل النعت: جاء طالبٌ ___.",
              de: "Ergänze das Attribut im Nominativ.",
            },
            options: [
              "مُجْتَهِدٌ",
              "مُجْتَهِدًا",
              "مُجْتَهِدٍ",
              "الْمُجْتَهِدُ",
            ],
            correct: 0,
            explanation: {
              ar: "النعت يتبع المنعوت في الرفع والتنكير.",
              de: "Das Attribut stimmt in Nominativ und Unbestimmtheit überein.",
            },
          },
          {
            prompt: {
              ar: "أكمل: رأيتُ طالبًا ___.",
              de: "Ergänze das Attribut im Akkusativ.",
            },
            options: [
              "مُجْتَهِدٌ",
              "مُجْتَهِدٍ",
              "الْمُجْتَهِدَ",
              "مُجْتَهِدًا",
            ],
            correct: 3,
            explanation: {
              ar: "طالبًا منصوب، فيتبعه نعته.",
              de: "Das Attribut folgt dem Akkusativ des Nomens.",
            },
          },
          {
            prompt: {
              ar: "أكمل: مررتُ بطالبٍ ___.",
              de: "Ergänze das Attribut im Genitiv.",
            },
            options: [
              "مُجْتَهِدًا",
              "الْمُجْتَهِدِ",
              "مُجْتَهِدٍ",
              "مُجْتَهِدٌ",
            ],
            correct: 2,
            explanation: {
              ar: "النعت مجرور بالكسرة مثل المنعوت.",
              de: "Das Attribut folgt dem Genitiv.",
            },
          },
          {
            prompt: {
              ar: "أكمل النعت: جاءت الطالبةُ ___.",
              de: "Ergänze das definite feminine Attribut.",
            },
            options: [
              "الْمُجْتَهِدَةَ",
              "الْمُجْتَهِدَةُ",
              "مُجْتَهِدَةٌ",
              "الْمُجْتَهِدُ",
            ],
            correct: 1,
            explanation: {
              ar: "يطابقها في التعريف والتأنيث والإفراد والرفع.",
              de: "Übereinstimmung in Bestimmtheit, Genus, Numerus und Kasus.",
            },
          },
          {
            prompt: {
              ar: "أكمل: حضر الطالبان ___.",
              de: "Ergänze das Attribut im Dual Nominativ.",
            },
            options: [
              "الْمُجْتَهِدَانِ",
              "الْمُجْتَهِدَيْنِ",
              "الْمُجْتَهِدُونَ",
              "مُجْتَهِدَانِ",
            ],
            correct: 0,
            explanation: {
              ar: "النعت الحقيقي يوافق المثنّى وتعريفه ورفعه.",
              de: "Das echte Attribut stimmt im bestimmten Dual Nominativ überein.",
            },
          },
          {
            prompt: {
              ar: "أكمل: رأيتُ الطالبَيْن ___.",
              de: "Ergänze das Attribut im Dual Akkusativ.",
            },
            options: [
              "الْمُجْتَهِدَانِ",
              "الْمُجْتَهِدُونَ",
              "الْمُجْتَهِدُ",
              "الْمُجْتَهِدَيْنِ",
            ],
            correct: 3,
            explanation: {
              ar: "المثنّى ينصب بالياء، وكذلك نعته هنا.",
              de: "Sowohl Nomen als auch Attribut stehen im Dual Akkusativ mit Yā.",
            },
          },
          {
            prompt: {
              ar: "أكمل: حضر المعلمون ___.",
              de: "Ergänze das Attribut zum menschlichen maskulinen Plural.",
            },
            options: [
              "مَاهِرُونَ",
              "الْمَاهِرَاتُ",
              "الْمَاهِرُونَ",
              "الْمَاهِرِينَ",
            ],
            correct: 2,
            explanation: {
              ar: "يوافقهم في جمع المذكّر والتعريف والرفع.",
              de: "Übereinstimmung im bestimmten maskulinen Plural Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: قرأتُ كتبًا ___.",
              de: "Ergänze das Attribut zu nichtmenschlichen Pluralnomen.",
            },
            options: ["الْمُفِيدَةَ", "مُفِيدَةً", "مُفِيدًا", "مُفِيدُونَ"],
            correct: 1,
            explanation: {
              ar: "جمع غير العاقل ينعت هنا بالمفرد المؤنّث.",
              de: "Nichtmenschlicher Plural erhält hier ein feminines Singularattribut.",
            },
          },
          {
            prompt: {
              ar: "أكمل النعت السببي: مررتُ برجلٍ ___ أمُّهُ.",
              de: "Ergänze das indirekte Attribut mit ummuhu als folgendem Subjekt.",
            },
            options: ["كَرِيمَةٍ", "كَرِيمٍ", "كَرِيمَةٌ", "كَرِيمَاتٍ"],
            correct: 0,
            explanation: {
              ar: "كريمة تتبع رجل في الجرّ والتنكير، وتؤنّث لموافقة أمّه.",
              de: "Karīmatin folgt raǧulin in Kasus und Unbestimmtheit, aber dem folgenden ummuhu im Genus.",
            },
          },
          {
            prompt: {
              ar: "ما موقع جملة «يضحك» في «رأيتُ طفلًا يضحك»؟",
              de: "Welche Funktion hat yaḍḥaku nach ṭiflan?",
            },
            options: [
              {
                ar: "خبر مرفوع هنا",
                de: "hier Nominativprädikat",
              },
              {
                ar: "مضاف إليه",
                de: "zweites Glied einer Genitivverbindung",
              },
              {
                ar: "حرف جر",
                de: "Präposition",
              },
              {
                ar: "في محل نصب نعت",
                de: "Attributsatz am Akkusativplatz",
              },
            ],
            correct: 3,
            explanation: {
              ar: "الجملة تصف طفلًا النكرة وتشتمل على ضمير فاعل مستتر يعود عليه.",
              de: "Der Satz beschreibt das unbestimmte ṭiflan und enthält ein rückverweisendes implizites Subjekt.",
            },
          },
          {
            prompt: {
              ar: "هل «مجتهدٌ» نعت في «الطالبُ مجتهدٌ»؟",
              de: "Ist muǧtahidun in aṭ-ṭālibu muǧtahidun ein Attribut?",
            },
            options: [
              {
                ar: "مضاف إليه",
                de: "Genitivglied",
              },
              {
                ar: "حرف توكيد",
                de: "Bekräftigungspartikel",
              },
              {
                ar: "لا؛ خبر للمبتدأ",
                de: "Nein, Prädikat zum Subjekt",
              },
              {
                ar: "نعم؛ نعت معرف",
                de: "ja, bestimmtes Attribut",
              },
            ],
            correct: 2,
            explanation: {
              ar: "مجتهد يتمّم معنى الجملة خبرًا، ولا يطابق الطالب في التعريف.",
              de: "Muǧtahidun vervollständigt den Satz als Prädikat und stimmt nicht in der Bestimmtheit überein.",
            },
          },
          {
            prompt: {
              ar: "أي عبارة تجمع شروط النعت الحقيقي المفرد؟",
              de: "Was sind die Übereinstimmungsmerkmale des echten Einzelwortattributs?",
            },
            options: [
              {
                ar: "التنكير دائمًا",
                de: "immer unbestimmt",
              },
              {
                ar: "الإعراب والتعريف والجنس والعدد",
                de: "Kasus, Bestimmtheit, Genus und Numerus",
              },
              {
                ar: "الجنس فقط",
                de: "nur Genus",
              },
              {
                ar: "الجرّ دائمًا",
                de: "immer Genitiv",
              },
            ],
            correct: 1,
            explanation: {
              ar: "يراعى أيضًا حكم جمع غير العاقل والاستعمالات المقررة له.",
              de: "Die Regel ist zusammen mit den Konventionen zum nichtmenschlichen Plural anzuwenden.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "idafa",
        glyph: "كتابُ",
        title: {
          ar: "المضاف والمضاف إليه",
          de: "Die Genitivverbindung: Iḍāfa",
        },
        summary: {
          ar: "إعراب الجزأين، وحذف التنوين والنون، والضمائر والنعت.",
          de: "Kasus beider Glieder, Endungswegfall und angehängte Pronomen.",
        },
        intro: {
          ar: "الإضافة نسبة اسم إلى اسم بعده. الأول مضاف يعرب بحسب موقعه، والثاني مضاف إليه مجرور دائمًا أو في محل جرّ إن كان مبنيًا. ندرس أساسًا الإضافة المعنوية.",
          de: "Iḍāfa verbindet zwei Nomen. Das erste erhält seinen Kasus aus der Satzfunktion, das zweite steht im Genitiv oder bei gebauter Form am Genitivplatz. Im Mittelpunkt steht die Bedeutungs-Genitivverbindung.",
        },
        sections: [
          {
            title: {
              ar: "المضاف لا يجرّ لمجرّد الإضافة",
              de: "Nicht beide Glieder sind automatisch Genitiv",
            },
            body: {
              ar: "كتاب الطالب قد يأتي مبتدأً مرفوعًا أو مفعولًا به منصوبًا أو اسمًا مجرورًا. أمّا الطالب فمضاف إليه مجرور في الحالات الثلاث.",
              de: "Kitāb kann Subjekt, Objekt oder Präpositionalergänzung sein. Aṭ-ṭālib bleibt in allen drei Fällen das zweite Glied im Genitiv.",
            },
            examples: [
              {
                ar: "كِتَابُ الطَّالِبِ مُفِيدٌ.",
                de: "Das Buch des Schülers ist nützlich.",
                focus: "كِتَابُ",
              },
              {
                ar: "قَرَأْتُ كِتَابَ الطَّالِبِ.",
                de: "Ich las das Buch des Schülers.",
                focus: "كِتَابَ",
              },
            ],
          },
          {
            title: {
              ar: "التنوين وأل ونونا المثنّى والجمع",
              de: "Tanwīn, Artikel und Dual-/Plural-Nūn",
            },
            body: {
              ar: "في الإضافة المعنوية لا ينوّن المضاف ولا تدخل عليه أل، وتحذف نون المثنّى وجمع المذكّر السالم عند الإضافة. وللإضافة اللفظية أحكام أخرى قد تجيز أل بشروط؛ فلا نعمّم حكم المعنوية عليها.",
              de: "In der Bedeutungs-Genitivverbindung erhält das erste Glied weder Tanwīn noch al-. Dual- und regelmäßiges maskulines Plural-Nūn fallen weg. Für rein formale Genitivverbindungen gelten weitere Regeln, die unter Bedingungen einen Artikel zulassen.",
            },
            examples: [
              {
                ar: "كِتَابَا الطَّالِبِ · مُعَلِّمُو الْمَدْرَسَةِ",
                de: "Dual und Plural ohne Nūn.",
                focus: "مُعَلِّمُو",
              },
            ],
          },
          {
            title: {
              ar: "الضمير والتعريف والنعت",
              de: "Pronomen, Bestimmtheit und Attribut",
            },
            body: {
              ar: "قد يكون المضاف إليه ضميرًا مثل الهاء في كتابه. والإضافة المعنوية إلى معرفة تعرّف المضاف، وإلى نكرة تخصّصه. النعت بعد التركيب قد يصف أي الجزأين، فيحدّد الإعراب والمطابقة المقصود.",
              de: "Ein angehängtes Pronomen kann das zweite Glied bilden. Ein bestimmtes zweites Glied macht das erste bestimmt; ein unbestimmtes spezifiziert es. Ein folgendes Attribut kann sich auf eines der beiden Glieder beziehen, erkennbar an Kasus und Kongruenz.",
            },
            examples: [
              {
                ar: "كِتَابُ الطَّالِبَةِ الْجَدِيدُ",
                de: "das neue Buch der Schülerin",
                focus: "الْجَدِيدُ",
              },
              {
                ar: "كِتَابُ الطَّالِبَةِ الْجَدِيدَةِ",
                de: "das Buch der neuen Schülerin",
                focus: "الْجَدِيدَةِ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "أعرب المضاف من موقعه أولًا، ثم اجعل الاسم بعده مضافًا إليه مجرورًا.",
          de: "Bestimme zuerst die Satzfunktion des ersten Glieds; das zweite hat Genitivfunktion.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل: هذا كتابُ ___.",
              de: "Ergänze das zweite Glied der Genitivverbindung.",
            },
            options: ["الطَّالِبِ", "الطَّالِبُ", "الطَّالِبَ", "طَالِبَانِ"],
            correct: 0,
            explanation: {
              ar: "الطالب مضاف إليه مجرور.",
              de: "Das zweite Glied steht im Genitiv.",
            },
          },
          {
            prompt: {
              ar: "ما إعراب «كتابُ» في «كتابُ الطالبِ مفيدٌ»؟",
              de: "Welche Funktion hat kitābu in diesem Satz?",
            },
            options: [
              {
                ar: "مضاف إليه مجرور",
                de: "zweites Genitivglied",
              },
              {
                ar: "مفعول به منصوب",
                de: "Akkusativobjekt",
              },
              {
                ar: "نعت مجرور",
                de: "Genitivattribut",
              },
              {
                ar: "مبتدأ مرفوع وهو مضاف",
                de: "Nominativsubjekt und erstes Genitivglied",
              },
            ],
            correct: 3,
            explanation: {
              ar: "المضاف يعرب حسب موقعه؛ الإضافة لا تجرّه.",
              de: "Der Kasus des ersten Glieds folgt seiner Satzfunktion, nicht automatisch dem Genitiv.",
            },
          },
          {
            prompt: {
              ar: "أكمل: قرأتُ ___ الطالبِ.",
              de: "Ergänze das erste Glied als Objekt.",
            },
            options: ["كِتَابِ", "كِتَابٌ", "كِتَابَ", "كِتَابُ"],
            correct: 2,
            explanation: {
              ar: "كتاب مفعول به منصوب، وهو مضاف بلا تنوين.",
              de: "Das erste Glied steht als Objekt im Akkusativ ohne Tanwīn.",
            },
          },
          {
            prompt: {
              ar: "أكمل: نظرتُ إلى ___ الطالبِ.",
              de: "Ergänze das erste Glied nach ilā.",
            },
            options: ["كِتَابٌ", "كِتَابِ", "كِتَابُ", "كِتَابَ"],
            correct: 1,
            explanation: {
              ar: "كتاب مجرور بإلى، والطالب مجرور بالإضافة.",
              de: "Kitāb ist durch ilā im Genitiv; aṭ-ṭālib durch die Genitivverbindung.",
            },
          },
          {
            prompt: {
              ar: "أي تركيب إضافة معنوية صحيح؟",
              de: "Welche Bedeutungs-Genitivverbindung ist richtig?",
            },
            options: [
              "كِتَابُ الطَّالِبِ",
              "كِتَابٌ الطَّالِبِ",
              "الْكِتَابُ الطَّالِبِ",
              "كِتَابُ الطَّالِبَ",
            ],
            correct: 0,
            explanation: {
              ar: "المضاف هنا بلا أل وبلا تنوين، والمضاف إليه مجرور.",
              de: "Das erste Glied hat hier weder Artikel noch Tanwīn, das zweite steht im Genitiv.",
            },
          },
          {
            prompt: {
              ar: "أكمل للمثنّى: هذان ___ الطالبِ.",
              de: "Ergänze im Dual als erstes Genitivglied.",
            },
            options: ["كِتَابَانِ", "كِتَابَيْنِ", "كِتَابٌ", "كِتَابَا"],
            correct: 3,
            explanation: {
              ar: "تحذف نون المثنّى للإضافة، والرفع بالألف باقٍ.",
              de: "Das Dual-Nūn entfällt; das Nominativ-Alif bleibt.",
            },
          },
          {
            prompt: {
              ar: "أكمل: حضر ___ المدرسةِ. والمقصود جمع معلّم.",
              de: "Ergänze den maskulinen Plural als Subjekt und erstes Genitivglied.",
            },
            options: [
              "مُعَلِّمِينَ",
              "مُعَلِّمٌ",
              "مُعَلِّمُو",
              "مُعَلِّمُونَ",
            ],
            correct: 2,
            explanation: {
              ar: "تحذف نون جمع المذكّر السالم للإضافة، والرفع بالواو.",
              de: "Das Plural-Nūn entfällt in der Genitivverbindung; Wāw markiert den Nominativ.",
            },
          },
          {
            prompt: {
              ar: "الهاء في «كتابُهُ» هي:",
              de: "Welche Funktion hat -hu in kitābuhu?",
            },
            options: [
              {
                ar: "حرف جر",
                de: "Präposition",
              },
              {
                ar: "ضمير في محل جرّ مضاف إليه",
                de: "Pronomen am Genitivplatz als zweites Glied",
              },
              {
                ar: "فاعل مرفوع",
                de: "Nominativsubjekt",
              },
              {
                ar: "نعت منصوب",
                de: "Akkusativattribut",
              },
            ],
            correct: 1,
            explanation: {
              ar: "الضمير متصل بالاسم على جهة الإضافة.",
              de: "Das angehängte Pronomen ist das zweite Glied der Genitivverbindung.",
            },
          },
          {
            prompt: {
              ar: "هل «كتابُ الطالبِ» معرفة؟",
              de: "Ist kitābu aṭ-ṭālibi bestimmt?",
            },
            options: [
              {
                ar: "نعم؛ اكتسب التعريف من المضاف إليه",
                de: "ja, durch das bestimmte zweite Glied",
              },
              {
                ar: "لا؛ يجب أن يبدأ المضاف بأل",
                de: "nein, das erste Glied benötigt al-",
              },
              {
                ar: "هو فعل",
                de: "es ist ein Verb",
              },
              {
                ar: "هو مثنّى",
                de: "es ist Dual",
              },
            ],
            correct: 0,
            explanation: {
              ar: "الإضافة المعنوية إلى معرفة تعرّف المضاف.",
              de: "Eine Bedeutungs-Genitivverbindung mit bestimmtem zweiten Glied macht das erste bestimmt.",
            },
          },
          {
            prompt: {
              ar: "اختر نعت الكتاب: هذا كتابُ الطالبةِ ___.",
              de: "Ergänze ein Attribut, das das Buch beschreibt.",
            },
            options: ["الْجَدِيدَةِ", "الْجَدِيدِ", "جَدِيدٌ", "الْجَدِيدُ"],
            correct: 3,
            explanation: {
              ar: "النعت يتبع كتاب المرفوع المذكّر المعرّف بالإضافة.",
              de: "Das Attribut folgt dem bestimmten maskulinen Nominativ kitābu.",
            },
          },
          {
            prompt: {
              ar: "اختر نعت الطالبة: هذا كتابُ الطالبةِ ___.",
              de: "Ergänze ein Attribut, das die Schülerin beschreibt.",
            },
            options: [
              "الْجَدِيدَةُ",
              "جَدِيدَةٌ",
              "الْجَدِيدَةِ",
              "الْجَدِيدُ",
            ],
            correct: 2,
            explanation: {
              ar: "النعت يتبع الطالبة في الجرّ والتعريف والتأنيث.",
              de: "Das Attribut folgt der bestimmten femininen Genitivform aṭ-ṭālibati.",
            },
          },
          {
            prompt: {
              ar: "هل يجب أن يكون المضاف إليه معرفة دائمًا؟",
              de: "Muss das zweite Glied immer bestimmt sein?",
            },
            options: [
              {
                ar: "يكون منصوبًا دائمًا",
                de: "immer Akkusativ",
              },
              {
                ar: "لا؛ قد يكون نكرة مثل كتابُ طالبٍ",
                de: "nein, etwa kitābu ṭālibin",
              },
              {
                ar: "نعم، دائمًا",
                de: "ja, immer",
              },
              {
                ar: "يكون فعلًا فقط",
                de: "nur ein Verb",
              },
            ],
            correct: 1,
            explanation: {
              ar: "الإضافة إلى نكرة تفيد التخصيص، وإلى معرفة تفيد التعريف في المعنوية.",
              de: "Mit unbestimmtem zweitem Glied wird die Bedeutung spezifiziert, nicht unbedingt bestimmt.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "purpose-object",
        glyph: "رغبةً",
        title: {
          ar: "المفعول لأجله",
          de: "Der Grund-Akkusativ",
        },
        summary: {
          ar: "مصدر يبيّن سبب الحدث، وشروط نصبه والجرّ للتعليل.",
          de: "Handlungsgrund, Akkusativbedingungen und kausale Präpositionen.",
        },
        intro: {
          ar: "المفعول لأجله مصدر يبيّن علّة وقوع الفعل. في نصبه مباشرة تشترط القاعدة المدرسية أن يكون مصدرًا قلبيًا متحدًا مع الفعل في الزمن والفاعل، مع دلالته على السبب.",
          de: "Der Grund-Akkusativ nennt den Grund einer Handlung. Für den direkten Akkusativ verlangt die Schulregel ein Verbalnomen für einen inneren Beweggrund, denselben Handelnden und dieselbe Zeit.",
        },
        sections: [
          {
            title: {
              ar: "اسأل: لماذا؟",
              de: "Frage: Warum?",
            },
            body: {
              ar: "رغبة وخوف وحزن واحترام وشوق أمثلة على مصادر قلبية تصلح للتعليل إذا تحققت بقية الشروط. لا يكفي كون الاسم منصوبًا للحكم عليه بأنه مفعول لأجله.",
              de: "Wunsch, Angst, Trauer, Respekt und Sehnsucht sind innere Beweggründe. Sie können unter den weiteren Bedingungen den Grund-Akkusativ bilden; die Akkusativendung allein genügt nicht zur Bestimmung.",
            },
            examples: [
              {
                ar: "اجْتَهَدْتُ رَغْبَةً فِي النَّجَاحِ.",
                de: "Ich strengte mich aus dem Wunsch nach Erfolg an.",
                focus: "رَغْبَةً",
              },
              {
                ar: "وَقَفْتُ احْتِرَامًا لِلْمُعَلِّمِ.",
                de: "Ich stand aus Respekt vor dem Lehrer auf.",
                focus: "احْتِرَامًا",
              },
            ],
          },
          {
            title: {
              ar: "الشروط والجرّ بحرف تعليل",
              de: "Bedingungen und kausale Präposition",
            },
            body: {
              ar: "إذا اختلف الفاعل أو الزمن، أو لم يصلح المصدر للنصب المباشر، يستعمل حرف تعليل مناسب. في جلست للكتابة، الكتابة اسم مجرور باللام؛ لا نعربه مفعولًا لأجله منصوبًا لفظًا.",
              de: "Bei abweichendem Handelnden, abweichender Zeit oder fehlender Eignung zum direkten Akkusativ verwendet man eine kausale Präposition. In ǧalastu li-l-kitābati steht das Verbalnomen im Genitiv nach lām.",
            },
            examples: [
              {
                ar: "جَلَسْتُ لِلْكِتَابَةِ.",
                de: "Ich setzte mich zum Schreiben.",
                focus: "لِلْكِتَابَةِ",
              },
              {
                ar: "حَضَرْتُ لِرَغْبَةِ وَالِدِي.",
                de: "Ich kam auf Wunsch meines Vaters.",
                focus: "لِرَغْبَةِ",
              },
            ],
          },
          {
            title: {
              ar: "المقارنة بالمفعول المطلق",
              de: "Vergleich mit dem absoluten Akkusativ",
            },
            body: {
              ar: "بكيت حزنًا: الحزن سبب البكاء. بكيت بكاءً: المصدر يؤكّد نفس الحدث. نختار الإعراب من علاقة المصدر بالفعل ومعناه في السياق.",
              de: "Ḥuznan nennt den Grund des Weinens; bukāʾan bekräftigt das Weinen selbst. Entscheidend ist die Beziehung des Verbalnomens zur Handlung.",
            },
            examples: [
              {
                ar: "بَكَيْتُ حُزْنًا. بَكَيْتُ بُكَاءً.",
                de: "Grund gegenüber Bekräftigung.",
                focus: "حُزْنًا",
              },
            ],
          },
        ],
        takeaway: {
          ar: "السبب يجيب عن لماذا، والمصدر المجرور بحرف تعليل يبقى مجرورًا.",
          de: "Der Grund beantwortet „Warum?“. Nach einer kausalen Präposition bleibt das Verbalnomen Genitiv.",
        },
        questions: [
          {
            prompt: {
              ar: "ما المفعول لأجله في «اجتهدتُ رغبةً في النجاح»؟",
              de: "Was ist der Grund-Akkusativ in diesem Satz?",
            },
            options: ["رَغْبَةً", "اجْتَهَدْتُ", "النَّجَاحِ", "فِي"],
            correct: 0,
            explanation: {
              ar: "رغبة مصدر قلبي يبيّن سبب الاجتهاد.",
              de: "Raġbatan ist ein innerer Beweggrund als Verbalnomen und nennt den Grund der Anstrengung.",
            },
          },
          {
            prompt: {
              ar: "أكمل سبب الوقوف: وقفتُ ___ للمعلم.",
              de: "Ergänze den inneren Grund des Aufstehens.",
            },
            options: ["احْتِرَامٌ", "احْتِرَامٍ", "مُحْتَرَمٌ", "احْتِرَامًا"],
            correct: 3,
            explanation: {
              ar: "احترامًا مصدر منصوب يبيّن العلّة.",
              de: "Iḥtirāman nennt als Verbalnomen im Akkusativ den Grund.",
            },
          },
          {
            prompt: {
              ar: "ما وظيفة «خوفًا» في «ابتعدتُ خوفًا من الخطر»؟",
              de: "Welche Funktion hat ḫaufan hier?",
            },
            options: [
              {
                ar: "مضاف إليه",
                de: "Genitivglied",
              },
              {
                ar: "نعت مجرور",
                de: "Genitivattribut",
              },
              {
                ar: "مفعول لأجله منصوب",
                de: "Grund-Akkusativ",
              },
              {
                ar: "فاعل مرفوع",
                de: "Nominativsubjekt",
              },
            ],
            correct: 2,
            explanation: {
              ar: "الخوف سبب الابتعاد لا عدد مراته.",
              de: "Die Angst ist der Grund des Sichentfernens, nicht dessen Häufigkeit.",
            },
          },
          {
            prompt: {
              ar: "بأي سؤال نعرف المفعول لأجله غالبًا؟",
              de: "Welche Frage erschließt meist den Grund-Akkusativ?",
            },
            options: [
              {
                ar: "أي حرف؟",
                de: "Welcher Buchstabe?",
              },
              {
                ar: "لماذا وقع الفعل؟",
                de: "Warum geschah die Handlung?",
              },
              {
                ar: "كم مرة؟",
                de: "Wie oft?",
              },
              {
                ar: "أين؟",
                de: "Wo?",
              },
            ],
            correct: 1,
            explanation: {
              ar: "وظيفته بيان علّة وقوع الفعل.",
              de: "Seine Funktion ist die Angabe des Handlungsgrundes.",
            },
          },
          {
            prompt: {
              ar: "أي مجموعة تذكر شروط نصبه مباشرة في القاعدة المدرسية؟",
              de: "Welche Bedingungen erlauben hier den direkten Akkusativ?",
            },
            options: [
              {
                ar: "مصدر قلبي متحد مع الفعل في الزمن والفاعل يبيّن السبب",
                de: "innerer Grund als Verbalnomen, gleiche Zeit und gleicher Handelnder",
              },
              {
                ar: "اسم مكان فقط",
                de: "nur ein Ortsnomen",
              },
              {
                ar: "فاعل مختلف وزمن مختلف دائمًا",
                de: "stets verschiedene Handelnde und Zeiten",
              },
              {
                ar: "صفة معرفة دائمًا",
                de: "stets ein bestimmtes Adjektiv",
              },
            ],
            correct: 0,
            explanation: {
              ar: "مع اختلال شرط من شروط النصب نلجأ إلى حرف تعليل مناسب.",
              de: "Fehlt eine Bedingung, verwendet man eine passende kausale Präposition.",
            },
          },
          {
            prompt: {
              ar: "أي مصدر قلبي صالح للتعليل في «بكيتُ ___»؟",
              de: "Welches innere Gefühl nennt hier den Grund des Weinens?",
            },
            options: ["بُكَاءً", "بُكَاءَيْنِ", "بَاكِيًا", "حُزْنًا"],
            correct: 3,
            explanation: {
              ar: "حزنًا سبب البكاء؛ بكاءً مصدر يؤكّد الفعل لا يبيّن سببه هنا.",
              de: "Ḥuznan ist der Grund; bukāʾan würde die Handlung selbst bekräftigen.",
            },
          },
          {
            prompt: {
              ar: "ما إعراب «الكتابةِ» في «جلستُ للكتابةِ»؟",
              de: "Wie ist al-kitābati nach Zweck-lām analysiert?",
            },
            options: [
              {
                ar: "فاعل",
                de: "Subjekt",
              },
              {
                ar: "مفعول مطلق",
                de: "absoluter Akkusativ",
              },
              {
                ar: "اسم مجرور باللام",
                de: "Nomen im Genitiv nach lām",
              },
              {
                ar: "مفعول لأجله منصوب لفظًا",
                de: "sichtbarer Grund-Akkusativ",
              },
            ],
            correct: 2,
            explanation: {
              ar: "اللام حرف تعليل وجرّ؛ المصدر بعدها مجرور لا منصوب.",
              de: "Lām ist hier kausale Präposition; das folgende Verbalnomen steht im Genitiv.",
            },
          },
          {
            prompt: {
              ar: "لماذا نستعمل حرف التعليل في «حضرتُ لرغبةِ والدي»؟",
              de: "Warum steht hier eine kausale Präposition?",
            },
            options: [
              {
                ar: "لأن الحضور غير ممكن",
                de: "weil Kommen unmöglich ist",
              },
              {
                ar: "فاعل الرغبة غير فاعل الحضور",
                de: "Wunsch und Kommen haben verschiedene Handelnde",
              },
              {
                ar: "لأن والدي فعل",
                de: "weil wālidī ein Verb ist",
              },
              {
                ar: "لأن كل مصدر يجب جرّه",
                de: "weil jedes Verbalnomen Genitiv sein muss",
              },
            ],
            correct: 1,
            explanation: {
              ar: "الحاضر هو المتكلّم، وصاحب الرغبة الوالد، فلم يتحد الفاعل.",
              de: "Die sprechende Person kommt, der Vater wünscht; die Handelnden stimmen nicht überein.",
            },
          },
          {
            prompt: {
              ar: "ميّز «فرحًا» في «قفز الطفلُ فرحًا» على إرادة بيان السبب.",
              de: "Bestimme faraḥan, wenn es den Grund des Springens nennt.",
            },
            options: [
              {
                ar: "مفعول لأجله",
                de: "Grund-Akkusativ",
              },
              {
                ar: "مفعول مطلق من لفظ قفز",
                de: "absoluter Akkusativ zum Wort qafaza",
              },
              {
                ar: "مضاف إليه",
                de: "Genitivglied",
              },
              {
                ar: "عدد",
                de: "Zahlwort",
              },
            ],
            correct: 0,
            explanation: {
              ar: "الفرح هو سبب القفز، وليس مصدرًا من لفظ قفز.",
              de: "Die Freude ist der Grund, nicht das Verbalnomen zur Handlung des Springens.",
            },
          },
          {
            prompt: {
              ar: "أي تعبير يبيّن السبب بمصدر منصوب؟",
              de: "Welcher Ausdruck nennt den Grund als Verbalnomen im Akkusativ?",
            },
            options: [
              "سَافَرْتُ سَفَرًا طَوِيلًا.",
              "سَافَرْتُ صَبَاحًا.",
              "سَافَرْتُ بِالْقِطَارِ.",
              "سَافَرْتُ شَوْقًا إِلَى أَهْلِي.",
            ],
            correct: 3,
            explanation: {
              ar: "شوقًا مصدر قلبي يعلّل السفر، وبقية العبارات للنوع أو الزمن أو الوسيلة.",
              de: "Šauqan nennt Sehnsucht als Grund; die anderen Ausdrücke nennen Art, Zeit oder Mittel.",
            },
          },
          {
            prompt: {
              ar: "ما علامة نصب «رغبةً» في «ساعدتُه رغبةً في الخير»؟",
              de: "Welches Akkusativzeichen hat raġbatan?",
            },
            options: [
              {
                ar: "الياء للمثنّى",
                de: "Dual-Yā",
              },
              {
                ar: "الواو",
                de: "Wāw",
              },
              {
                ar: "الفتحة الظاهرة",
                de: "sichtbare Fatḥa",
              },
              {
                ar: "الضمة",
                de: "Ḍamma",
              },
            ],
            correct: 2,
            explanation: {
              ar: "رغبة اسم مفرد منصوب بالفتحة.",
              de: "Raġba ist ein Singular mit sichtbarer Akkusativ-Fatḥa.",
            },
          },
          {
            prompt: {
              ar: "ما الفرق هنا: «بكيتُ حزنًا» و«بكيتُ بكاءً»؟",
              de: "Welcher Unterschied besteht zwischen ḥuznan und bukāʾan?",
            },
            options: [
              {
                ar: "بكاءً حرف جر",
                de: "bukāʾan ist Präposition",
              },
              {
                ar: "حزنًا لأجله، وبكاءً مطلق",
                de: "ḥuznan nennt den Grund, bukāʾan bekräftigt die Handlung",
              },
              {
                ar: "كلاهما فاعل",
                de: "beides Subjekt",
              },
              {
                ar: "حزنًا ظرف مكان",
                de: "ḥuznan ist Ortsangabe",
              },
            ],
            correct: 1,
            explanation: {
              ar: "المعنى هو الذي يفرّق بين بيان السبب وتوكيد الحدث.",
              de: "Die Bedeutung unterscheidet den Handlungsgrund von der Bekräftigung des Ereignisses.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "absolute-object",
        glyph: "سيرًا",
        title: {
          ar: "المفعول المطلق",
          de: "Der absolute Akkusativ",
        },
        summary: {
          ar: "توكيد الحدث وبيان نوعه وعدده، وما ينوب عن المصدر.",
          de: "Bekräftigung, Art, Häufigkeit und Stellvertreter des Verbalnomens.",
        },
        intro: {
          ar: "المفعول المطلق مصدر منصوب يذكر لتوكيد فعله أو بيان نوعه أو عدده. يكون أصله من لفظ الفعل أو معناه، وقد ينوب عنه لفظ يدلّ عليه.",
          de: "Der absolute Akkusativ ist ein Verbalnomen im Akkusativ zur Bekräftigung der Handlung oder Angabe ihrer Art oder Häufigkeit. Er entspricht dem Wort oder Sinn des Verbs und kann durch passende Ausdrücke vertreten werden.",
        },
        sections: [
          {
            title: {
              ar: "الأنواع الثلاثة",
              de: "Drei Hauptfunktionen",
            },
            body: {
              ar: "المؤكّد مثل ركضت ركضًا. المبيّن للنوع يوصف أو يضاف مثل سرت سيرًا سريعًا. والمبيّن للعدد مثل قفزت قفزتين.",
              de: "Bekräftigend: rakḍan. Die Art wird etwa durch ein beschriebenes Verbalnomen bestimmt: sairan sarīʿan. Häufigkeit: qafzataini, zwei Sprünge.",
            },
            examples: [
              {
                ar: "رَكَضْتُ رَكْضًا.",
                de: "Ich lief tatsächlich.",
                focus: "رَكْضًا",
              },
              {
                ar: "سِرْتُ سَيْرًا سَرِيعًا.",
                de: "Ich ging schnell.",
                focus: "سَيْرًا سَرِيعًا",
              },
              {
                ar: "قَفَزْتُ قَفْزَتَيْنِ.",
                de: "Ich sprang zweimal.",
                focus: "قَفْزَتَيْنِ",
              },
            ],
          },
          {
            title: {
              ar: "ما ينوب عن المصدر",
              de: "Stellvertreter des Verbalnomens",
            },
            body: {
              ar: "من نوابه كل وبعض إذا أضيفتا إلى المصدر، وعدده، وصفته عند حذف المصدر، ومرادفه، واسم الإشارة إليه بحسب التركيب. يعرب النائب منصوبًا، ولا نجعل كل اسم يدلّ على السبب مفعولًا مطلقًا.",
              de: "Stellvertreter sind je nach Konstruktion etwa kull oder baʿḍ mit Verbalnomen, eine Anzahl, ein Attribut bei ausgelassenem Verbalnomen, ein Synonym oder ein darauf verweisendes Demonstrativum. Auch der Stellvertreter steht im Akkusativ. Ein Handlungsgrund ist nicht automatisch absoluter Akkusativ.",
            },
            examples: [
              {
                ar: "اجْتَهَدْتُ كُلَّ الاجْتِهَادِ.",
                de: "Ich strengte mich mit aller Kraft an.",
                focus: "كُلَّ",
              },
              {
                ar: "فَهِمْتُ بَعْضَ الْفَهْمِ.",
                de: "Ich verstand teilweise.",
                focus: "بَعْضَ",
              },
            ],
          },
          {
            title: {
              ar: "الإعراب وتمييز السبب",
              de: "Kasus und Abgrenzung zum Grund",
            },
            body: {
              ar: "ينصب المفرد بالفتحة والمثنّى بالياء في أمثلتنا. في سرت سيرًا سريعًا يكون سيرًا مفعولًا مطلقًا وسريعًا نعتًا. وفي سافرت شوقًا، الشوق سبب السفر لا مصدر السفر نفسه.",
              de: "In unseren Beispielen stehen Singular mit Fatḥa und Dual mit Yā. In sairan sarīʿan ist nur sairan der absolute Akkusativ; sarīʿan ist Attribut. Sehnsucht als Reisegrund ist dagegen kein Verbalnomen des Reisens.",
            },
            examples: [
              {
                ar: "دَقَّ الْجَرَسُ دَقَّتَيْنِ.",
                de: "Die Glocke läutete zweimal.",
                focus: "دَقَّتَيْنِ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "فرّق بين المصدر نفسه، وصفته، وسبب الحدث.",
          de: "Unterscheide Verbalnomen, dessen Attribut und den Grund des Ereignisses.",
        },
        questions: [
          {
            prompt: {
              ar: "ما المفعول المطلق في «ركضتُ ركضًا»؟",
              de: "Was ist der absolute Akkusativ in rakaḍtu rakḍan?",
            },
            options: ["رَكْضًا", "رَكَضْتُ", "التَّاءُ", "لَا شَيْءَ"],
            correct: 0,
            explanation: {
              ar: "ركضًا مصدر من لفظ الفعل يؤكّد حدوثه.",
              de: "Rakḍan ist das Verbalnomen zur Handlung und bekräftigt sie.",
            },
          },
          {
            prompt: {
              ar: "ما نوع المفعول المطلق في «سرتُ سيرًا سريعًا»؟",
              de: "Welche Funktion hat sairan sarīʿan?",
            },
            options: [
              {
                ar: "مبيّن للعدد",
                de: "Angabe der Häufigkeit",
              },
              {
                ar: "مؤكّد فقط بلا وصف",
                de: "nur Bekräftigung ohne nähere Bestimmung",
              },
              {
                ar: "سبب للفعل",
                de: "Handlungsgrund",
              },
              {
                ar: "مبيّن للنوع",
                de: "Angabe der Art",
              },
            ],
            correct: 3,
            explanation: {
              ar: "الصفة سريعًا بيّنت نوع السير.",
              de: "Das Attribut sarīʿan bestimmt die Art des Gehens.",
            },
          },
          {
            prompt: {
              ar: "ما نوع «قفزتين» في «قفزتُ قفزتين»؟",
              de: "Was bezeichnet qafzataini?",
            },
            options: [
              {
                ar: "اسم فاعل",
                de: "aktives Partizip",
              },
              {
                ar: "نعت مرفوع",
                de: "Nominativattribut",
              },
              {
                ar: "مبيّن للعدد",
                de: "Angabe der Häufigkeit",
              },
              {
                ar: "سبب القفز",
                de: "Grund des Springens",
              },
            ],
            correct: 2,
            explanation: {
              ar: "يدلّ على وقوع القفز مرتين.",
              de: "Es bezeichnet zwei Sprünge.",
            },
          },
          {
            prompt: {
              ar: "أكمل توكيد الفعل: نجحَ الطالبُ ___.",
              de: "Ergänze ein bekräftigendes Verbalnomen.",
            },
            options: ["نَجَاحٌ", "نَجَاحًا", "نَاجِحًا", "نَجَاحٍ"],
            correct: 1,
            explanation: {
              ar: "نجاحًا مصدر منصوب من لفظ نجح.",
              de: "Naǧāḥan ist das passende Verbalnomen im Akkusativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: دقَّ الجرسُ ___. والمقصود مرتان.",
              de: "Ergänze für zweimaliges Läuten.",
            },
            options: ["دَقَّتَيْنِ", "دَقَّتَانِ", "دَقَّةٌ", "دَقَّاتٌ"],
            correct: 0,
            explanation: {
              ar: "المفعول المطلق المثنّى ينصب بالياء.",
              de: "Der Dual steht als absoluter Akkusativ auf Yā.",
            },
          },
          {
            prompt: {
              ar: "أي عبارة فيها مفعول مطلق مبيّن للنوع؟",
              de: "Welcher Ausdruck beschreibt die Art der Handlung?",
            },
            options: [
              "قَرَأْتُ صَبَاحًا.",
              "قَرَأْتُ لِلتَّعَلُّمِ.",
              "قَرَأْتُ الْكِتَابَ.",
              "قَرَأْتُ قِرَاءَةً مُتَأَنِّيَةً.",
            ],
            correct: 3,
            explanation: {
              ar: "قراءة مصدر وصف بمتأنية فبيّن نوع القراءة.",
              de: "Das beschriebene Verbalnomen nennt die Art des Lesens.",
            },
          },
          {
            prompt: {
              ar: "أعرب «كلَّ» في «اجتهدتُ كلَّ الاجتهادِ».",
              de: "Analysiere kulla in diesem Satz.",
            },
            options: [
              {
                ar: "حرف جر",
                de: "Präposition",
              },
              {
                ar: "مضاف إليه",
                de: "zweites Genitivglied",
              },
              {
                ar: "نائب عن المفعول المطلق منصوب",
                de: "Stellvertreter des absoluten Akkusativs",
              },
              {
                ar: "فاعل مرفوع",
                de: "Nominativsubjekt",
              },
            ],
            correct: 2,
            explanation: {
              ar: "كل أضيفت إلى مصدر الفعل فنابت عنه، والاجتهاد مضاف إليه.",
              de: "Kull wird durch die Verbindung mit dem Verbalnomen zu dessen Stellvertreter.",
            },
          },
          {
            prompt: {
              ar: "أعرب «بعضَ» في «فهمتُ الدرسَ بعضَ الفهمِ».",
              de: "Analysiere baʿḍa in diesem Satz.",
            },
            options: [
              {
                ar: "ظرف مكان",
                de: "Ortsangabe",
              },
              {
                ar: "نائب عن المفعول المطلق منصوب",
                de: "Stellvertreter des absoluten Akkusativs",
              },
              {
                ar: "مفعول لأجله",
                de: "Grund-Akkusativ",
              },
              {
                ar: "مبتدأ مرفوع",
                de: "Nominativsubjekt",
              },
            ],
            correct: 1,
            explanation: {
              ar: "بعض المضافة إلى المصدر تنوب عن المفعول المطلق.",
              de: "Baʿḍ in Verbindung mit dem Verbalnomen vertritt den absoluten Akkusativ.",
            },
          },
          {
            prompt: {
              ar: "ما وظيفة «احترامًا» في «احترمتُ المعلمَ احترامًا»؟",
              de: "Welche Funktion hat iḥtirāman zum Verb iḥtaramtu?",
            },
            options: [
              {
                ar: "مفعول مطلق مؤكّد",
                de: "bekräftigender absoluter Akkusativ",
              },
              {
                ar: "مفعول لأجله هنا",
                de: "hier Grund-Akkusativ",
              },
              {
                ar: "فاعل",
                de: "Subjekt",
              },
              {
                ar: "مضاف إليه",
                de: "Genitivglied",
              },
            ],
            correct: 0,
            explanation: {
              ar: "هو مصدر نفس الفعل، والمقصود توكيد الاحترام.",
              de: "Es ist das Verbalnomen derselben Handlung und bekräftigt sie.",
            },
          },
          {
            prompt: {
              ar: "أي سؤال يناسب المفعول المطلق المبيّن للعدد؟",
              de: "Welche Frage passt zur Häufigkeitsangabe?",
            },
            options: [
              {
                ar: "لماذا؟",
                de: "Warum?",
              },
              {
                ar: "من صاحب الكتاب؟",
                de: "Wem gehört das Buch?",
              },
              {
                ar: "أين المضاف إليه؟",
                de: "Wo ist das Genitivglied?",
              },
              {
                ar: "كم مرة وقع الفعل؟",
                de: "Wie oft geschah die Handlung?",
              },
            ],
            correct: 3,
            explanation: {
              ar: "المبيّن للعدد يحدّد مرات الحدث.",
              de: "Dieser Typ zählt die Ereignisse.",
            },
          },
          {
            prompt: {
              ar: "ما إعراب «سريعًا» في «سرتُ سيرًا سريعًا»؟",
              de: "Welche Funktion hat sarīʿan?",
            },
            options: [
              {
                ar: "مضاف إليه",
                de: "Genitivglied",
              },
              {
                ar: "حرف توكيد",
                de: "Bekräftigungspartikel",
              },
              {
                ar: "نعت منصوب للمصدر",
                de: "Akkusativattribut zum Verbalnomen",
              },
              {
                ar: "فاعل",
                de: "Subjekt",
              },
            ],
            correct: 2,
            explanation: {
              ar: "سيرًا مفعول مطلق، وسريعًا نعت له.",
              de: "Sairan ist der absolute Akkusativ, sarīʿan sein Attribut.",
            },
          },
          {
            prompt: {
              ar: "أي عبارة تجمع وظائف المفعول المطلق الأساسية؟",
              de: "Welche Funktionen hat der absolute Akkusativ?",
            },
            options: [
              {
                ar: "تعريف الاسم فقط",
                de: "nur Bestimmtheit",
              },
              {
                ar: "توكيد الفعل أو بيان نوعه أو عدده",
                de: "Bekräftigung, Art oder Häufigkeit",
              },
              {
                ar: "السبب فقط",
                de: "nur der Grund",
              },
              {
                ar: "الجرّ دائمًا",
                de: "immer Genitiv",
              },
            ],
            correct: 1,
            explanation: {
              ar: "هذه أنواعه الثلاثة الرئيسة، وقد ينوب عن المصدر ما يدلّ عليه.",
              de: "Das sind die drei Hauptfunktionen; ein entsprechender Ausdruck kann das Verbalnomen vertreten.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "apposition",
        glyph: "بدل",
        title: {
          ar: "البدل",
          de: "Apposition: Badal",
        },
        summary: {
          ar: "المطابق وبعض من كل والاشتمال والمباين، والإعراب والرابط.",
          de: "Typen der Apposition, Kasus und rückverweisende Pronomen.",
        },
        intro: {
          ar: "البدل تابع مقصود بالحكم دون واسطة، ويتبع المبدل منه في الإعراب. لا يلزم أن يطابقه في التعريف أو الجنس والعدد كما يطابق النعت الحقيقي منعوته.",
          de: "Badal ist eine auf den eigentlichen Aussagegegenstand zielende Apposition und folgt dem Kasus ihres Bezugsnomens. Sie erfordert nicht dieselbe Kongruenz in Bestimmtheit, Genus und Numerus wie ein echtes Attribut.",
        },
        sections: [
          {
            title: {
              ar: "المطابق وبعض من كل",
              de: "Identische und Teil-Ganzes-Apposition",
            },
            body: {
              ar: "المطابق يدلّ على عين المبدل منه، ويسمى بدل كل من كل. وبعض من كل يدلّ على جزء حقيقي منه، ويشتمل عادة على ضمير عائد يربطه به.",
              de: "Der identische Badal bezeichnet denselben Gegenstand. Teil-Ganzes-Badal nennt einen tatsächlichen Teil und enthält gewöhnlich ein rückverweisendes Pronomen.",
            },
            examples: [
              {
                ar: "جَاءَ أَخُوكَ خَالِدٌ.",
                de: "Dein Bruder Ḫālid kam.",
                focus: "خَالِدٌ",
                note: {
                  ar: "على تحليل خالد بدلًا مطابقًا؛ ويصح أيضًا عطف البيان هنا.",
                  de: "Bei Analyse als identischer Badal; auch erklärende Apposition ist hier möglich.",
                },
              },
              {
                ar: "أَكَلْتُ الرَّغِيفَ نِصْفَهُ.",
                de: "Ich aß die Hälfte des Brotes.",
                focus: "نِصْفَهُ",
              },
            ],
          },
          {
            title: {
              ar: "بدل الاشتمال والرابط",
              de: "Zugehörige Eigenschaft und Rückverweis",
            },
            body: {
              ar: "يدلّ بدل الاشتمال على معنى أو صفة تتعلق بالمبدل منه، لا على جزء مادي منه. ويذكر معه رابط يعود على المبدل منه في أمثلتنا، مثل الهاء في خلقه وعلمه.",
              de: "Dieser Typ nennt eine zugehörige Eigenschaft oder einen Sachverhalt, keinen materiellen Teil. In unseren Beispielen verbindet ein Pronomen wie -hu in ḫuluquhu die Glieder.",
            },
            examples: [
              {
                ar: "أَعْجَبَنِي الطَّالِبُ خُلُقُهُ.",
                de: "Der Charakter des Schülers gefiel mir.",
                focus: "خُلُقُهُ",
              },
            ],
          },
          {
            title: {
              ar: "المباين والإعراب",
              de: "Korrektur/Wechsel und Kasus",
            },
            body: {
              ar: "يذكر في التوسّع بدل المباين، ومنه الغلط والنسيان والإضراب بحسب قصد المتكلّم. والبدل في جميع الأنواع يتبع الإعراب؛ فيكون مرفوعًا أو منصوبًا أو مجرورًا. بعض التراكيب تحتمل أيضًا عطف البيان، فلا نجعل التحليل الوحيد لازمًا دون سياق.",
              de: "Fortgeschritten unterscheidet man korrigierende oder wechselnde Appositionen nach Versprecher, Erinnerung oder bewusstem Wechsel. Alle Typen folgen dem Kasus: Nominativ, Akkusativ oder Genitiv. Manche Konstruktionen erlauben außerdem eine erklärende Apposition.",
            },
            examples: [
              {
                ar: "مَرَرْتُ بِأَخِيكَ زَيْدٍ.",
                de: "Ich ging an deinem Bruder Zaid vorbei.",
                focus: "زَيْدٍ",
              },
            ],
          },
        ],
        takeaway: {
          ar: "حدّد العلاقة: الشخص نفسه، جزء حقيقي، معنى متعلق، أم تصحيح؟ ثم اتبع الإعراب.",
          de: "Bestimme die Beziehung und übernimm dann den Kasus des Bezugsnomens.",
        },
        questions: [
          {
            prompt: {
              ar: "إذا أعربنا «خالد» بدلًا في «جاء أخوك خالدٌ»، فما نوعه؟",
              de: "Wenn Ḫālidun als Badal analysiert wird: welcher Typ?",
            },
            options: [
              {
                ar: "بدل مطابق",
                de: "identische Apposition",
              },
              {
                ar: "بدل بعض من كل",
                de: "Teil-Ganzes-Apposition",
              },
              {
                ar: "بدل اشتمال",
                de: "Apposition einer zugehörigen Eigenschaft",
              },
              {
                ar: "بدل مباين",
                de: "korrigierende/wechselnde Apposition",
              },
            ],
            correct: 0,
            explanation: {
              ar: "خالد وأخوك يدلان على الشخص نفسه؛ ويصح في مثل هذا التركيب أيضًا تحليل عطف البيان.",
              de: "Beide bezeichnen dieselbe Person. In dieser Konstruktion ist auch eine Analyse als erklärende Apposition möglich.",
            },
          },
          {
            prompt: {
              ar: "ما نوع «نصفَه» في «أكلتُ الرغيفَ نصفَه»؟",
              de: "Welcher Badal-Typ ist niṣfahu?",
            },
            options: [
              {
                ar: "بدل مطابق",
                de: "identische Apposition",
              },
              {
                ar: "بدل اشتمال",
                de: "Eigenschaftsapposition",
              },
              {
                ar: "حال",
                de: "Zustandsangabe",
              },
              {
                ar: "بدل بعض من كل",
                de: "Teil-Ganzes-Apposition",
              },
            ],
            correct: 3,
            explanation: {
              ar: "النصف جزء حقيقي من الرغيف، والهاء رابط يعود عليه.",
              de: "Die Hälfte ist ein echter Teil des Brotes; -hu verweist darauf zurück.",
            },
          },
          {
            prompt: {
              ar: "ما نوع «خُلُقُه» في «أعجبني الطالبُ خُلُقُه»؟",
              de: "Welcher Badal-Typ ist ḫuluquhu?",
            },
            options: [
              {
                ar: "بدل مطابق",
                de: "identische Apposition",
              },
              {
                ar: "ظرف",
                de: "Adverbialnomen",
              },
              {
                ar: "بدل اشتمال",
                de: "Apposition einer zugehörigen Eigenschaft",
              },
              {
                ar: "بدل بعض من كل",
                de: "Teil-Ganzes-Apposition",
              },
            ],
            correct: 2,
            explanation: {
              ar: "الخلق معنى متعلق بالطالب لا جزء مادي منه، والهاء عائدة عليه.",
              de: "Der Charakter ist eine zugehörige Eigenschaft, kein materieller Teil; -hu ist der Rückverweis.",
            },
          },
          {
            prompt: {
              ar: "أكمل بدل بعض من كل: أكلتُ التفاحةَ ___.",
              de: "Ergänze eine Teil-Ganzes-Apposition im Akkusativ.",
            },
            options: ["نِصْفَانِ", "نِصْفَهَا", "نِصْفُهَا", "نِصْفِهَا"],
            correct: 1,
            explanation: {
              ar: "البدل يتبع المبدل منه المنصوب، والضمير يعود إلى التفاحة.",
              de: "Die Apposition folgt dem Akkusativ und enthält den Rückverweis auf den Apfel.",
            },
          },
          {
            prompt: {
              ar: "أكمل بدل الاشتمال: أعجبني الكتابُ ___. والمقصود أسلوبه.",
              de: "Ergänze eine Eigenschaftsapposition als Nominativ.",
            },
            options: [
              "أُسْلُوبُهُ",
              "أُسْلُوبَهُ",
              "أُسْلُوبِهِ",
              "أَسَالِيبَ",
            ],
            correct: 0,
            explanation: {
              ar: "البدل يتبع الكتاب المرفوع.",
              de: "Die Apposition folgt dem Nominativ al-kitābu.",
            },
          },
          {
            prompt: {
              ar: "أكمل على إعراب زيد بدلًا: مررتُ بأخيكَ ___.",
              de: "Ergänze Zaid als Badal im Genitiv.",
            },
            options: ["زَيْدٌ", "زَيْدًا", "زَيْدَانِ", "زَيْدٍ"],
            correct: 3,
            explanation: {
              ar: "زيد بدل مجرور من أخيك المجرور.",
              de: "Zaid steht als Apposition zum Genitiv ebenfalls im Genitiv.",
            },
          },
          {
            prompt: {
              ar: "ما المبدل منه في «أكلتُ الرغيفَ نصفَه»؟",
              de: "Welches Nomen ist der Bezug der Apposition?",
            },
            options: ["أَكَلْتُ", "الْهَاءُ", "الرَّغِيفَ", "نِصْفَهُ"],
            correct: 2,
            explanation: {
              ar: "الرغيف متبوع، ونصفه بدل منه.",
              de: "Ar-raġīfa ist das Bezugsnomen, niṣfahu die Apposition.",
            },
          },
          {
            prompt: {
              ar: "ما الرابط في بدل الاشتمال «أعجبني الطالبُ علمُه»؟",
              de: "Was stellt den Rückverweis in ʿilmuhu her?",
            },
            options: [
              {
                ar: "لا رابط في المثال",
                de: "kein Rückverweis vorhanden",
              },
              {
                ar: "الهاء في علمه",
                de: "das Pronomen -hu",
              },
              {
                ar: "أل في الطالب",
                de: "der Artikel al-",
              },
              {
                ar: "الياء في أعجبني",
                de: "das Objektpronomen -nī",
              },
            ],
            correct: 1,
            explanation: {
              ar: "الهاء تعود على الطالب وتربط البدل بالمبدل منه.",
              de: "-Hu verweist auf den Schüler zurück.",
            },
          },
          {
            prompt: {
              ar: "هل يطابق البدل المبدل منه في التعريف والتنكير كالنعت الحقيقي؟",
              de: "Muss Badal wie ein echtes Attribut in der Bestimmtheit übereinstimmen?",
            },
            options: [
              {
                ar: "لا؛ يتبعه في الإعراب ولا يشترط هذا التطابق",
                de: "Nein; Kasusübereinstimmung ist entscheidend",
              },
              {
                ar: "نعم، بلا استثناء",
                de: "ja, ausnahmslos",
              },
              {
                ar: "البدل فعل دائمًا",
                de: "Badal ist immer ein Verb",
              },
              {
                ar: "البدل مجرور دائمًا",
                de: "Badal ist immer Genitiv",
              },
            ],
            correct: 0,
            explanation: {
              ar: "قد يأتي بدل معرفة من نكرة أو العكس وفق السياق والضوابط.",
              de: "Je nach Kontext kann die Bestimmtheit der beiden Glieder verschieden sein.",
            },
          },
          {
            prompt: {
              ar: "قال متكلم «ركبتُ سيارةً قطارًا» مصحّحًا كلمة سيارة إلى قطار. ما نوع البدل؟",
              de: "Der Sprecher korrigiert „Auto“ zu „Zug“. Welche Art ist das?",
            },
            options: [
              {
                ar: "بدل بعض من كل",
                de: "Teil-Ganzes-Apposition",
              },
              {
                ar: "بدل اشتمال",
                de: "Eigenschaftsapposition",
              },
              {
                ar: "بدل مطابق",
                de: "identische Apposition",
              },
              {
                ar: "بدل مباين من الغلط",
                de: "korrigierende Apposition nach einem Versprecher",
              },
            ],
            correct: 3,
            explanation: {
              ar: "القطار ليس السيارة نفسها ولا جزءًا منها؛ المقصود تصحيح اللفظ السابق.",
              de: "Der Zug ist weder dasselbe noch ein Teil des Autos; der Sprecher korrigiert den ersten Ausdruck.",
            },
          },
          {
            prompt: {
              ar: "ما علامة نصب «نصفَ» في بدل «أكلتُ الرغيفَ نصفَه»؟",
              de: "Welches Akkusativzeichen hat niṣfa?",
            },
            options: [
              {
                ar: "الكسرة",
                de: "Kasra",
              },
              {
                ar: "ثبوت النون",
                de: "Erhalt des Nūn",
              },
              {
                ar: "الفتحة الظاهرة",
                de: "sichtbare Fatḥa",
              },
              {
                ar: "الواو",
                de: "Wāw",
              },
            ],
            correct: 2,
            explanation: {
              ar: "هو اسم مفرد منصوب بالفتحة، والهاء مضاف إليه.",
              de: "Das Singularnomen hat Akkusativ-Fatḥa; -hu ist Genitivglied.",
            },
          },
          {
            prompt: {
              ar: "أي مثال يشتمل على بدل بعض من كل؟",
              de: "Welcher Satz enthält eine Teil-Ganzes-Apposition?",
            },
            options: [
              "مَرَرْتُ بِطَالِبٍ مُجْتَهِدٍ.",
              "قَرَأْتُ الْكِتَابَ نِصْفَهُ.",
              "أَعْجَبَنِي الطَّالِبُ عِلْمُهُ.",
              "الطَّالِبُ مُجْتَهِدٌ.",
            ],
            correct: 1,
            explanation: {
              ar: "نصف الكتاب جزء منه؛ علم الطالب بدل اشتمال لا جزء مادي.",
              de: "Die Buchhälfte ist ein tatsächlicher Teil; Wissen ist eine zugehörige Eigenschaft.",
            },
          },
        ],
        category: "syntax",
      },
      {
        id: "demonstratives",
        glyph: "هذا",
        title: {
          ar: "أسماء الإشارة",
          de: "Demonstrativpronomen",
        },
        summary: {
          ar: "القريب والبعيد، والمفرد والمثنّى والجمع، والإعراب.",
          de: "Nähe und Ferne, Genus, Numerus und Kasus.",
        },
        intro: {
          ar: "اسم الإشارة اسم يدلّ على معيّن بالإشارة إليه. نختاره بحسب القرب والبعد والجنس والعدد، مع مراعاة جمع غير العاقل، ونعربه بحسب موقعه.",
          de: "Demonstrativa verweisen auf Bestimmtes. Ihre Wahl richtet sich nach Nähe/Ferne, Genus und Numerus sowie den Regeln für nichtmenschliche Plurale. Die Analyse folgt ihrer Satzfunktion.",
        },
        sections: [
          {
            title: {
              ar: "المفرد والجمع، قريبًا وبعيدًا",
              de: "Singular und Plural, nah und fern",
            },
            body: {
              ar: "للقريب هذا للمذكّر وهذه للمؤنّث وهؤلاء لجمع العاقل. وللبعيد من الأسماء الشائعة ذلك وتلك وأولئك. جمع غير العاقل يشار إليه غالبًا بالمفرد المؤنّث: هذه كتب وتلك أشجار.",
              de: "Nah: hāḏā maskulin, hāḏihi feminin und hāʾulāʾi für menschliche Mehrzahl. Fern: ḏālika, tilka und ulāʾika. Nichtmenschliche Mehrzahl erhält meist ein feminines Singular-Demonstrativum.",
            },
            examples: [
              {
                ar: "هَذَا طَالِبٌ · هَذِهِ طَالِبَةٌ · هَؤُلَاءِ طُلَّابٌ",
                de: "nahe Personen",
                focus: "هَؤُلَاءِ",
              },
              {
                ar: "تِلْكَ أَشْجَارٌ عَالِيَةٌ.",
                de: "Jene Bäume sind hoch.",
                focus: "تِلْكَ",
              },
            ],
          },
          {
            title: {
              ar: "المثنّى والإعراب",
              de: "Dual und Kasus",
            },
            body: {
              ar: "هذان وهاتان في الرفع، وهذين وهاتين في النصب والجرّ. أسماء الإشارة مبنية، ما عدا صيغ المثنّى المعربة إعراب المثنّى في القاعدة المدرسية. وقد تتغيّر وظيفة المبني بين رفع ونصب وجرّ دون تغيّر لفظه.",
              de: "Hāḏāni und hātāni stehen im Nominativ, hāḏaini und hātaini im Akkusativ/Genitiv. Demonstrativa sind gebaut, außer den nach Schulregel wie Dual flektierten Formen. Bei gebauten Formen ändert sich der Kasusplatz, nicht die Form.",
            },
            examples: [
              {
                ar: "هَذَانِ طَالِبَانِ. رَأَيْتُ هَذَيْنِ الطَّالِبَيْنِ.",
                de: "Dual Nominativ gegenüber Akkusativ.",
                focus: "هَذَيْنِ",
              },
            ],
          },
          {
            title: {
              ar: "المكان والاسم بعد الإشارة",
              de: "Ort und folgendes Nomen",
            },
            body: {
              ar: "هنا للقريب المكاني، وهناك وهنالك للبعيد. وفي هذا كتابٌ يكون كتاب خبرًا، أما الاسم المعرف بأل في مثل هذا الطالبُ مجتهدٌ فيصح إعرابه بدلًا أو عطف بيان بحسب التحليل، ومجتهد هو الخبر. وهاء التنبيه وكاف الخطاب ولام البعد حروف في المواضع التي ترد فيها، لا ضمائر مضافة إليه.",
              de: "Hunā bezeichnet einen nahen, hunāka/hunālika einen entfernten Ort. In hāḏā kitābun ist kitābun Prädikat. Ein folgendes definites Nomen wie aṭ-ṭālibu kann als Badal oder erklärende Apposition analysiert werden. Aufmerksamkeits-hā, Anrede-kāf und Ferne-lām sind gegebenenfalls Partikeln, keine Genitivpronomen.",
            },
            examples: [
              {
                ar: "هَذَا كِتَابٌ. هَذَا الطَّالِبُ مُجْتَهِدٌ.",
                de: "Prädikat nach dem Demonstrativum gegenüber einem näher bestimmten Subjekt.",
                focus: "الطَّالِبُ",
              },
              {
                ar: "جَلَسْتُ هُنَا.",
                de: "Ich setzte mich hierhin.",
                focus: "هُنَا",
              },
            ],
          },
        ],
        takeaway: {
          ar: "طابق الجنس والعدد، ثم حدّد القرب والبعد والمحل الإعرابي.",
          de: "Wähle Genus und Numerus, dann Nähe/Ferne und die syntaktische Position.",
        },
        questions: [
          {
            prompt: {
              ar: "أكمل للقريب: ___ ولدٌ مهذّبٌ.",
              de: "Ergänze für einen nahen Jungen.",
            },
            options: ["هَذَا", "هَذِهِ", "هَؤُلَاءِ", "هَاتَانِ"],
            correct: 0,
            explanation: {
              ar: "هذا للمفرد المذكّر القريب.",
              de: "Hāḏā bezeichnet den nahen maskulinen Singular.",
            },
          },
          {
            prompt: {
              ar: "أكمل للقريبة: ___ بنتٌ مهذّبةٌ.",
              de: "Ergänze für ein nahes Mädchen.",
            },
            options: ["هَذَا", "هَذَانِ", "هَؤُلَاءِ", "هَذِهِ"],
            correct: 3,
            explanation: {
              ar: "هذه للمفرد المؤنّث القريب.",
              de: "Hāḏihi bezeichnet den nahen femininen Singular.",
            },
          },
          {
            prompt: {
              ar: "أكمل: ___ طالبانِ مجتهدانِ.",
              de: "Ergänze im maskulinen Dual Nominativ.",
            },
            options: ["هَاتَانِ", "هَؤُلَاءِ", "هَذَانِ", "هَذَيْنِ"],
            correct: 2,
            explanation: {
              ar: "هذان للمثنّى المذكّر المرفوع.",
              de: "Hāḏāni ist der maskuline Dual Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: رأيتُ ___ الطالبينِ.",
              de: "Ergänze im maskulinen Dual Akkusativ.",
            },
            options: ["هَؤُلَاءِ", "هَذَيْنِ", "هَذَانِ", "هَاتَانِ"],
            correct: 1,
            explanation: {
              ar: "اسم الإشارة المثنّى ينصب بالياء.",
              de: "Der demonstrative Dual hat im Akkusativ Yā.",
            },
          },
          {
            prompt: {
              ar: "أكمل: ___ طالبتانِ مجتهدتانِ.",
              de: "Ergänze im femininen Dual Nominativ.",
            },
            options: ["هَاتَانِ", "هَاتَيْنِ", "هَذَانِ", "هَذِهِ"],
            correct: 0,
            explanation: {
              ar: "هاتان للمثنّى المؤنّث المرفوع.",
              de: "Hātāni ist der feminine Dual Nominativ.",
            },
          },
          {
            prompt: {
              ar: "أكمل: مررتُ بـ ___ الطالبتينِ.",
              de: "Ergänze im femininen Dual Genitiv.",
            },
            options: ["هَاتَانِ", "هَذَيْنِ", "هَؤُلَاءِ", "هَاتَيْنِ"],
            correct: 3,
            explanation: {
              ar: "المثنّى يجرّ بالياء، وهاتين توافق الطالبتين.",
              de: "Der Dual hat im Genitiv Yā; das Genus stimmt mit den Schülerinnen überein.",
            },
          },
          {
            prompt: {
              ar: "أكمل: ___ معلّمونَ ماهرونَ قريبون.",
              de: "Ergänze für mehrere nahe Lehrer.",
            },
            options: ["هَاتَانِ", "هَذَا", "هَؤُلَاءِ", "هَذَانِ"],
            correct: 2,
            explanation: {
              ar: "هؤلاء لجمع العاقل القريب، للمذكّر والمؤنّث.",
              de: "Hāʾulāʾi bezeichnet nahe menschliche Mehrzahl beider Genera.",
            },
          },
          {
            prompt: {
              ar: "أكمل للبُعد: ___ شجرةٌ عاليةٌ.",
              de: "Ergänze für einen entfernten Baum.",
            },
            options: ["هَذَانِ", "تِلْكَ", "ذَلِكَ", "هَؤُلَاءِ"],
            correct: 1,
            explanation: {
              ar: "شجرة مؤنّث مفرد، وتلك للبعيد المؤنّث.",
              de: "Šaǧara ist feminin; tilka bezeichnet das entfernte Femininum.",
            },
          },
          {
            prompt: {
              ar: "أكمل للبعيدين: ___ طلابٌ مجتهدونَ.",
              de: "Ergänze für entfernte Schüler.",
            },
            options: ["أُولَئِكَ", "ذَلِكَ", "تِلْكَ", "هَذَا"],
            correct: 0,
            explanation: {
              ar: "أولئك لجمع العاقل البعيد.",
              de: "Ulāʾika bezeichnet entfernte menschliche Mehrzahl.",
            },
          },
          {
            prompt: {
              ar: "أكمل للقريب: ___ كتبٌ مفيدةٌ.",
              de: "Ergänze für nahe Bücher.",
            },
            options: ["هَذَا", "هَؤُلَاءِ", "هَذَانِ", "هَذِهِ"],
            correct: 3,
            explanation: {
              ar: "جمع غير العاقل يشار إليه هنا بالمفرد المؤنّث.",
              de: "Nichtmenschliche Mehrzahl erhält hier das feminine Singular-Demonstrativum.",
            },
          },
          {
            prompt: {
              ar: "ما إعراب «هذا» في «رأيتُ هذا» على الإعراب الإجمالي؟",
              de: "Analysiere hāḏā als Ganzes nach raʾaitu.",
            },
            options: [
              {
                ar: "اسم مجرور",
                de: "Genitivnomen",
              },
              {
                ar: "فعل أمر",
                de: "Imperativ",
              },
              {
                ar: "اسم إشارة مبني في محل نصب مفعول به",
                de: "gebautes Demonstrativum am Akkusativplatz als Objekt",
              },
              {
                ar: "فاعل مرفوع بالضمة",
                de: "Subjekt mit Nominativ-Ḍamma",
              },
            ],
            correct: 2,
            explanation: {
              ar: "يتغيّر المحل ولا تتغيّر صيغة اسم الإشارة المبني.",
              de: "Die syntaktische Position ändert sich, die gebaute Form bleibt gleich.",
            },
          },
          {
            prompt: {
              ar: "ما «هنا» في «جلستُ هنا»؟",
              de: "Was bedeutet hunā grammatisch in diesem Satz?",
            },
            options: [
              {
                ar: "فعل ماضٍ",
                de: "Perfekt",
              },
              {
                ar: "اسم إشارة للمكان مبني في محل نصب ظرف مكان",
                de: "Ortsdemonstrativum, gebaut am Akkusativplatz einer Ortsangabe",
              },
              {
                ar: "اسم إشارة للمثنّى",
                de: "demonstrativer Dual",
              },
              {
                ar: "حرف جر",
                de: "Präposition",
              },
            ],
            correct: 1,
            explanation: {
              ar: "هنا للقريب المكاني، وهناك وهنالك للبعيد في الاستعمال المعتاد.",
              de: "Hunā bezeichnet einen nahen Ort; hunāka und hunālika gewöhnlich einen entfernten.",
            },
          },
        ],
        category: "syntax",
      },
    ],
  };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else window.ArabicGrammarSyntax = data;
})();
