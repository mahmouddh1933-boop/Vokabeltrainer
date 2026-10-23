(() => {
  "use strict";
  const data = {
    sounds: [
      {
        id: "ta-ta",
        letters: ["ت", "ط"],
        tip: {
          ar: "التاء خفيفة، والطاء مفخّمة. قارن بين تِين وطِين.",
          de: "Tā klingt hell, Ṭā emphatisch und dunkel. Vergleiche Feigen und Lehm.",
        },
        pairs: [
          [
            {
              ar: "تِين",
              de: "Feigen",
            },
            {
              ar: "طِين",
              de: "Lehm",
            },
          ],
          [
            {
              ar: "تَابَ",
              de: "er bereute",
            },
            {
              ar: "طَابَ",
              de: "er wurde angenehm",
            },
          ],
          [
            {
              ar: "تَاج",
              de: "Krone",
            },
            {
              ar: "طَائِر",
              de: "Vogel",
            },
          ],
        ],
      },
      {
        id: "sin-sad",
        letters: ["س", "ص"],
        tip: {
          ar: "السين خفيفة، والصاد مفخّمة. انتبه إلى سَيْف وصَيْف.",
          de: "Sīn klingt hell, Ṣād emphatisch. Achte auf Schwert und Sommer.",
        },
        pairs: [
          [
            {
              ar: "سَيْف",
              de: "Schwert",
            },
            {
              ar: "صَيْف",
              de: "Sommer",
            },
          ],
          [
            {
              ar: "سَارَ",
              de: "er ging",
            },
            {
              ar: "صَارَ",
              de: "er wurde",
            },
          ],
          [
            {
              ar: "سَمَك",
              de: "Fisch",
            },
            {
              ar: "صَبْر",
              de: "Geduld",
            },
          ],
        ],
      },
      {
        id: "dal-dad",
        letters: ["د", "ض"],
        tip: {
          ar: "الدال خفيفة، والضاد مفخّمة. اسمع الفرق بين دَرْب وضَرْب.",
          de: "Dāl klingt hell, Ḍād emphatisch. Höre den Unterschied zwischen Weg und Schlagen.",
        },
        pairs: [
          [
            {
              ar: "دَرْب",
              de: "Weg",
            },
            {
              ar: "ضَرْب",
              de: "Schlagen",
            },
          ],
          [
            {
              ar: "دَلَّ",
              de: "er zeigte",
            },
            {
              ar: "ضَلَّ",
              de: "er verirrte sich",
            },
          ],
          [
            {
              ar: "دُبّ",
              de: "Bär",
            },
            {
              ar: "ضَوْء",
              de: "Licht",
            },
          ],
        ],
      },
      {
        id: "dhal-zha",
        letters: ["ذ", "ظ"],
        tip: {
          ar: "في الذال والظاء يكون طرف اللسان عند الأسنان، والظاء مفخّمة.",
          de: "Bei Ḏāl und Ẓā liegt die Zungenspitze an den Zähnen. Ẓā ist emphatisch.",
        },
        pairs: [
          [
            {
              ar: "ذَهَب",
              de: "Gold",
            },
            {
              ar: "ظَهْر",
              de: "Rücken",
            },
          ],
          [
            {
              ar: "ذُرَة",
              de: "Mais",
            },
            {
              ar: "ظَرْف",
              de: "Briefumschlag",
            },
          ],
          [
            {
              ar: "ذَكِيّ",
              de: "klug",
            },
            {
              ar: "ظِلّ",
              de: "Schatten",
            },
          ],
        ],
      },
      {
        id: "ha-ha",
        letters: ["ح", "ه"],
        tip: {
          ar: "الحاء من وسط الحلق، والهاء نفسٌ أخفّ. قارن حَرَم وهَرَم.",
          de: "Ḥā entsteht tiefer im Rachen, Hā klingt wie ein leichter Hauch. Vergleiche Heiligtum und Pyramide.",
        },
        pairs: [
          [
            {
              ar: "حَرَم",
              de: "Heiligtum",
            },
            {
              ar: "هَرَم",
              de: "Pyramide",
            },
          ],
          [
            {
              ar: "حَال",
              de: "Zustand",
            },
            {
              ar: "هَال",
              de: "Kardamom",
            },
          ],
          [
            {
              ar: "حَبْل",
              de: "Seil",
            },
            {
              ar: "هِلَال",
              de: "Mondsichel",
            },
          ],
        ],
      },
      {
        id: "qaf-kaf",
        letters: ["ق", "ك"],
        tip: {
          ar: "القاف أعمق في الفم من الكاف. قَلْب وكَلْب كلمتان مختلفتان.",
          de: "Qāf entsteht weiter hinten im Mund als Kāf. Herz und Hund sind verschiedene Wörter.",
        },
        pairs: [
          [
            {
              ar: "قَلْب",
              de: "Herz",
            },
            {
              ar: "كَلْب",
              de: "Hund",
            },
          ],
          [
            {
              ar: "قَالَ",
              de: "er sagte",
            },
            {
              ar: "كَالَ",
              de: "er maß ab",
            },
          ],
          [
            {
              ar: "قَمَر",
              de: "Mond",
            },
            {
              ar: "كِتَاب",
              de: "Buch",
            },
          ],
        ],
      },
    ],
    sentences: [
      {
        id: "s01",
        level: "A1",
        topic: "nominal",
        words: ["أَنَا", "طَالِبٌ"],
        de: "Ich bin Schüler.",
        explanation: {
          ar: "جملة اسمية: أَنَا مبتدأ، وطَالِبٌ خبر.",
          de: "Nominalsatz: anā ist das Subjekt, ṭālibun das Prädikat.",
        },
      },
      {
        id: "s02",
        level: "A1",
        topic: "nominal",
        words: ["هِيَ", "طَبِيبَةٌ"],
        de: "Sie ist Ärztin.",
        explanation: {
          ar: "هِيَ ضمير للمؤنث، والخبر طَبِيبَةٌ مؤنث.",
          de: "Hiya ist feminin; die Berufsbezeichnung ṭabībatun ebenfalls.",
        },
      },
      {
        id: "s03",
        level: "A1",
        topic: "nominal",
        words: ["الْبَيْتُ", "كَبِيرٌ"],
        de: "Das Haus ist groß.",
        explanation: {
          ar: "الْبَيْتُ مبتدأ، وكَبِيرٌ خبر يصفه.",
          de: "Al-baytu ist das Subjekt, kabīrun das Prädikat.",
        },
      },
      {
        id: "s04",
        level: "A1",
        topic: "agreement",
        words: ["الْبِنْتُ", "صَغِيرَةٌ"],
        de: "Das Mädchen ist klein.",
        explanation: {
          ar: "الخبر صَغِيرَةٌ مؤنث لأنه يصف الْبِنْتُ.",
          de: "Das Prädikat ṣaġīratun ist passend zu al-bintu feminin.",
        },
      },
      {
        id: "s05",
        level: "A1",
        topic: "verbal",
        words: ["يَقْرَأُ", "الْوَلَدُ", "كِتَابًا"],
        de: "Der Junge liest ein Buch.",
        explanation: {
          ar: "يَقْرَأُ فعل، والْوَلَدُ فاعل، وكِتَابًا مفعول به.",
          de: "Yaqraʾu ist das Verb, der Junge das Subjekt und ein Buch das Objekt.",
        },
      },
      {
        id: "s06",
        level: "A1",
        topic: "verbal",
        words: ["تَشْرَبُ", "الْبِنْتُ", "حَلِيبًا"],
        de: "Das Mädchen trinkt Milch.",
        explanation: {
          ar: "تَشْرَبُ فعل للمؤنث، والْبِنْتُ فاعل، وحَلِيبًا مفعول به.",
          de: "Tašrabu passt zum Mädchen; ḥalīban ist das Objekt.",
        },
      },
      {
        id: "s07",
        level: "A1",
        topic: "verbal",
        words: ["يَأْكُلُ", "الطِّفْلُ", "تُفَّاحَةً"],
        de: "Das Kind isst einen Apfel.",
        explanation: {
          ar: "تُفَّاحَةً مفعول به منصوب، وتظهر عليه فتحتا التنوين.",
          de: "Tuffāḥatan ist das Objekt und trägt den Akkusativ.",
        },
      },
      {
        id: "s08",
        level: "A1",
        topic: "preposition",
        words: ["الْكِتَابُ", "عَلَى", "الطَّاوِلَةِ"],
        de: "Das Buch liegt auf dem Tisch.",
        explanation: {
          ar: "عَلَى حرف جر، والطَّاوِلَةِ اسم مجرور بعده.",
          de: "Nach der Präposition ʿalā steht aṭ-ṭāwilati im Genitiv.",
        },
      },
      {
        id: "s09",
        level: "A1",
        topic: "preposition",
        words: ["الْقَلَمُ", "فِي", "الْحَقِيبَةِ"],
        de: "Der Stift ist in der Tasche.",
        explanation: {
          ar: "فِي حرف جر، والْحَقِيبَةِ اسم مجرور.",
          de: "Fī bedeutet in; al-ḥaqībati steht danach im Genitiv.",
        },
      },
      {
        id: "s10",
        level: "A1",
        topic: "agreement",
        words: ["هَذِهِ", "سَيَّارَةٌ", "جَدِيدَةٌ"],
        de: "Das ist ein neues Auto.",
        explanation: {
          ar: "هَذِهِ للمؤنث، وجَدِيدَةٌ نعت مؤنث يوافق سَيَّارَةٌ.",
          de: "Hāḏihi und das Adjektiv ǧadīdatun passen zum femininen Wort Auto.",
        },
      },
      {
        id: "s11",
        level: "A1",
        topic: "agreement",
        words: ["هَذَا", "قَلَمٌ", "أَزْرَقُ"],
        de: "Das ist ein blauer Stift.",
        explanation: {
          ar: "هَذَا للمذكر، وأَزْرَقُ نعت يوافق قَلَمٌ في التذكير.",
          de: "Hāḏā und azraqu sind passend zu qalamun maskulin.",
        },
      },
      {
        id: "s12",
        level: "A1",
        topic: "preposition",
        words: ["أَذْهَبُ", "إِلَى", "الْمَدْرَسَةِ"],
        de: "Ich gehe zur Schule.",
        explanation: {
          ar: "إِلَى تدل على الاتجاه، والْمَدْرَسَةِ اسم مجرور بعدها.",
          de: "Ilā bezeichnet das Ziel; al-madrasati steht im Genitiv.",
        },
      },
      {
        id: "s13",
        level: "A2",
        topic: "verbal",
        words: ["كَتَبَتْ", "مَرْيَمُ", "رِسَالَةً", "قَصِيرَةً"],
        de: "Maryam schrieb einen kurzen Brief.",
        explanation: {
          ar: "كَتَبَتْ فعل ماضٍ مؤنث، وقَصِيرَةً نعت يوافق رِسَالَةً.",
          de: "Das Verb ist Vergangenheit; qaṣīratan stimmt mit dem Objekt Brief überein.",
        },
      },
      {
        id: "s14",
        level: "A2",
        topic: "verbal",
        words: ["اشْتَرَى", "أَحْمَدُ", "خُبْزًا", "طَازَجًا"],
        de: "Ahmad kaufte frisches Brot.",
        explanation: {
          ar: "خُبْزًا مفعول به، وطَازَجًا نعت منصوب يصفه.",
          de: "Ḫubzan ist das Objekt; ṭāzaǧan beschreibt es im selben Fall.",
        },
      },
      {
        id: "s15",
        level: "A2",
        topic: "agreement",
        words: ["هَؤُلَاءِ", "طُلَّابٌ", "مُجْتَهِدُونَ"],
        de: "Das sind fleißige Schüler.",
        explanation: {
          ar: "هَؤُلَاءِ لجمع العاقل، ومُجْتَهِدُونَ نعت جمع مذكر سالم مرفوع.",
          de: "Hāʾulāʾi verweist auf mehrere Personen; das Adjektiv steht im Plural.",
        },
        transformation: {
          source: "هَذَا طَالِبٌ مُجْتَهِدٌ",
          prompt: {
            ar: "حوّل من المفرد إلى الجمع:",
            de: "Vom Singular in den Plural umformen:",
          },
        },
      },
      {
        id: "s16",
        level: "A2",
        topic: "agreement",
        words: ["الْكُتُبُ", "الْجَدِيدَةُ", "مُفِيدَةٌ"],
        de: "Die neuen Bücher sind nützlich.",
        explanation: {
          ar: "جمع غير العاقل يُعامل معاملة المفرد المؤنث: الْجَدِيدَةُ ومُفِيدَةٌ.",
          de: "Der nichtmenschliche Plural Bücher erhält feminine Adjektive im Singular.",
        },
        transformation: {
          source: "الْكِتَابُ الْجَدِيدُ مُفِيدٌ",
          prompt: {
            ar: "حوّل من المفرد إلى الجمع:",
            de: "Vom Singular in den Plural umformen:",
          },
        },
      },
      {
        id: "s17",
        level: "A2",
        topic: "nominal",
        words: ["كَانَ", "الْجَوُّ", "بَارِدًا"],
        de: "Das Wetter war kalt.",
        explanation: {
          ar: "كَانَ ترفع اسمها الْجَوُّ، وتنصب خبرها بَارِدًا.",
          de: "Nach kāna ist al-ǧawwu der Nominativ und bāridan das Prädikat im Akkusativ.",
        },
      },
      {
        id: "s18",
        level: "A2",
        topic: "nominal",
        words: ["إِنَّ", "الْعِلْمَ", "نَافِعٌ"],
        de: "Wissen ist gewiss nützlich.",
        explanation: {
          ar: "إِنَّ تنصب اسمها الْعِلْمَ، وترفع خبرها نَافِعٌ.",
          de: "Inna setzt sein Nomen in den Akkusativ, das Prädikat bleibt im Nominativ.",
        },
      },
      {
        id: "s19",
        level: "A2",
        topic: "verbal",
        words: ["لَنْ", "أَتَأَخَّرَ", "عَنِ", "الدَّرْسِ"],
        de: "Ich werde nicht zu spät zum Unterricht kommen.",
        explanation: {
          ar: "لَنْ تنصب المضارع أَتَأَخَّرَ بالفتحة، وعَنِ حرف جر.",
          de: "Lan setzt das folgende Verb in den Subjunktiv mit Fatḥa.",
        },
      },
      {
        id: "s20",
        level: "A2",
        topic: "verbal",
        words: ["لَمْ", "يَذْهَبْ", "خَالِدٌ", "إِلَى", "السُّوقِ"],
        de: "Khalid ging nicht zum Markt.",
        explanation: {
          ar: "لَمْ تجزم المضارع يَذْهَبْ بالسكون، وتنفي وقوعه في الماضي.",
          de: "Lam verneint die Vergangenheit und setzt yaḏhab in den Jussiv mit Sukun.",
        },
      },
      {
        id: "s21",
        level: "A2",
        topic: "preposition",
        words: ["جَلَسَ", "الطِّفْلُ", "بِجَانِبِ", "أُمِّهِ"],
        de: "Das Kind saß neben seiner Mutter.",
        explanation: {
          ar: "بِجَانِبِ تدل على المكان، وأُمِّهِ مضاف إليه مجرور.",
          de: "Bi-ǧānibi bezeichnet den Ort; ummihi ist das Genitivattribut.",
        },
      },
      {
        id: "s22",
        level: "A2",
        topic: "preposition",
        words: ["وَضَعْتُ", "الْمِفْتَاحَ", "تَحْتَ", "الْكِتَابِ"],
        de: "Ich legte den Schlüssel unter das Buch.",
        explanation: {
          ar: "تَحْتَ ظرف مكان منصوب، والْكِتَابِ مضاف إليه مجرور.",
          de: "Taḥta ist eine Ortsangabe; al-kitābi ist das zugehörige Genitivattribut.",
        },
      },
      {
        id: "s23",
        level: "A2",
        topic: "verbal",
        words: ["نَقْرَأُ", "الْقِصَصَ", "لِنَتَعَلَّمَ", "الْعَرَبِيَّةَ"],
        de: "Wir lesen Geschichten, um Arabisch zu lernen.",
        explanation: {
          ar: "اللام في لِنَتَعَلَّمَ للتعليل، والمضارع بعدها منصوب بأن مضمرة.",
          de: "Die Zweckangabe li-nataʿallama bedeutet damit wir lernen; das Verb steht im Subjunktiv.",
        },
      },
      {
        id: "s24",
        level: "A2",
        topic: "agreement",
        words: ["فِي", "الْحَدِيقَةِ", "شَجَرَتَانِ", "كَبِيرَتَانِ"],
        de: "Im Park stehen zwei große Bäume.",
        explanation: {
          ar: "شَجَرَتَانِ مثنى مرفوع بالألف، وكَبِيرَتَانِ نعت يوافقه.",
          de: "Šaǧaratāni ist der Dual im Nominativ; kabīratāni stimmt damit überein.",
        },
        transformation: {
          source: "فِي الْحَدِيقَةِ شَجَرَةٌ كَبِيرَةٌ",
          prompt: {
            ar: "حوّل من المفرد إلى المثنى:",
            de: "Vom Singular in den Dual umformen:",
          },
        },
      },
    ],
    stories: [
      {
        id: "breakfast",
        level: "A1",
        title: {
          ar: "فَطُورٌ مَعَ أُسْرَتِي",
          de: "Frühstück mit meiner Familie",
        },
        art: 0,
        lines: [
          {
            ar: "أَنَا لَيْلَى.",
            de: "Ich bin Layla.",
          },
          {
            ar: "أَجْلِسُ مَعَ أُسْرَتِي فِي الْمَطْبَخِ.",
            de: "Ich sitze mit meiner Familie in der Küche.",
          },
          {
            ar: "عَلَى الطَّاوِلَةِ خُبْزٌ وَجُبْنٌ.",
            de: "Auf dem Tisch liegen Brot und Käse.",
          },
          {
            ar: "أَشْرَبُ الْحَلِيبَ، وَيَشْرَبُ أَبِي الشَّايَ.",
            de: "Ich trinke Milch und mein Vater trinkt Tee.",
          },
          {
            ar: "تَأْكُلُ أُخْتِي تُفَّاحَةً.",
            de: "Meine Schwester isst einen Apfel.",
          },
          {
            ar: "بَعْدَ الْفَطُورِ أَذْهَبُ إِلَى الْمَدْرَسَةِ.",
            de: "Nach dem Frühstück gehe ich zur Schule.",
          },
        ],
        vocabulary: [
          {
            ar: "أُسْرَة",
            de: "Familie",
          },
          {
            ar: "مَطْبَخ",
            de: "Küche",
          },
          {
            ar: "خُبْز",
            de: "Brot",
          },
          {
            ar: "حَلِيب",
            de: "Milch",
          },
        ],
        questions: [
          {
            prompt: {
              ar: "أَيْنَ تَجْلِسُ لَيْلَى؟",
              de: "Wo sitzt Layla?",
            },
            options: [
              {
                ar: "فِي الْمَطْبَخِ",
                de: "In der Küche",
              },
              {
                ar: "فِي الْحَدِيقَةِ",
                de: "Im Park",
              },
              {
                ar: "فِي الْمَكْتَبَةِ",
                de: "In der Bibliothek",
              },
            ],
            correct: 0,
            evidence: 1,
          },
          {
            prompt: {
              ar: "مَاذَا تَشْرَبُ لَيْلَى؟",
              de: "Was trinkt Layla?",
            },
            options: [
              {
                ar: "الشَّايَ",
                de: "Tee",
              },
              {
                ar: "الْحَلِيبَ",
                de: "Milch",
              },
              {
                ar: "الْعَصِيرَ",
                de: "Saft",
              },
            ],
            correct: 1,
            evidence: 3,
          },
          {
            prompt: {
              ar: "مَنْ يَأْكُلُ تُفَّاحَةً؟",
              de: "Wer isst einen Apfel?",
            },
            options: [
              {
                ar: "الْأَبُ",
                de: "Der Vater",
              },
              {
                ar: "لَيْلَى",
                de: "Layla",
              },
              {
                ar: "الْأُخْتُ",
                de: "Die Schwester",
              },
            ],
            correct: 2,
            evidence: 4,
          },
          {
            prompt: {
              ar: "إِلَى أَيْنَ تَذْهَبُ بَعْدَ الْفَطُورِ؟",
              de: "Wohin geht sie nach dem Frühstück?",
            },
            options: [
              {
                ar: "إِلَى الْمَدْرَسَةِ",
                de: "Zur Schule",
              },
              {
                ar: "إِلَى السُّوقِ",
                de: "Zum Markt",
              },
              {
                ar: "إِلَى الْبَحْرِ",
                de: "Zum Meer",
              },
            ],
            correct: 0,
            evidence: 5,
          },
        ],
      },
      {
        id: "classroom",
        level: "A1",
        title: {
          ar: "فِي الصَّفِّ",
          de: "Im Klassenzimmer",
        },
        art: 1,
        lines: [
          {
            ar: "هَذَا صَفِّي.",
            de: "Das ist meine Klasse.",
          },
          {
            ar: "أَجْلِسُ بِجَانِبِ صَدِيقِي سَامِي.",
            de: "Ich sitze neben meinem Freund Sami.",
          },
          {
            ar: "تَكْتُبُ الْمُعَلِّمَةُ حَرْفَ الْبَاءِ عَلَى السَّبُّورَةِ.",
            de: "Die Lehrerin schreibt den Buchstaben Bā an die Tafel.",
          },
          {
            ar: "يَقْرَأُ سَامِي كَلِمَةَ بَيْتٍ.",
            de: "Sami liest das Wort Haus.",
          },
          {
            ar: "أَكْتُبُ الْكَلِمَةَ فِي دَفْتَرِي.",
            de: "Ich schreibe das Wort in mein Heft.",
          },
          {
            ar: "تَقُولُ الْمُعَلِّمَةُ: أَحْسَنْتُمْ!",
            de: "Die Lehrerin sagt: Gut gemacht!",
          },
        ],
        vocabulary: [
          {
            ar: "صَفّ",
            de: "Klasse",
          },
          {
            ar: "مُعَلِّمَة",
            de: "Lehrerin",
          },
          {
            ar: "سَبُّورَة",
            de: "Tafel",
          },
          {
            ar: "دَفْتَر",
            de: "Heft",
          },
        ],
        questions: [
          {
            prompt: {
              ar: "بِجَانِبِ مَنْ يَجْلِسُ الرَّاوِي؟",
              de: "Neben wem sitzt die erzählende Person?",
            },
            options: [
              {
                ar: "الْأَبِ",
                de: "Dem Vater",
              },
              {
                ar: "سَامِي",
                de: "Sami",
              },
              {
                ar: "الطَّبِيبِ",
                de: "Dem Arzt",
              },
            ],
            correct: 1,
            evidence: 1,
          },
          {
            prompt: {
              ar: "أَيَّ حَرْفٍ تَكْتُبُ الْمُعَلِّمَةُ؟",
              de: "Welchen Buchstaben schreibt die Lehrerin?",
            },
            options: [
              {
                ar: "الْمِيمَ",
                de: "Mīm",
              },
              {
                ar: "التَّاءَ",
                de: "Tā",
              },
              {
                ar: "الْبَاءَ",
                de: "Bā",
              },
            ],
            correct: 2,
            evidence: 2,
          },
          {
            prompt: {
              ar: "مَا الْكَلِمَةُ الَّتِي يَقْرَؤُهَا سَامِي؟",
              de: "Welches Wort liest Sami?",
            },
            options: [
              {
                ar: "بَيْت",
                de: "Haus",
              },
              {
                ar: "قَمَر",
                de: "Mond",
              },
              {
                ar: "بَحْر",
                de: "Meer",
              },
            ],
            correct: 0,
            evidence: 3,
          },
          {
            prompt: {
              ar: "أَيْنَ يَكْتُبُ الرَّاوِي الْكَلِمَةَ؟",
              de: "Wohin schreibt die erzählende Person das Wort?",
            },
            options: [
              {
                ar: "عَلَى الْبَابِ",
                de: "An die Tür",
              },
              {
                ar: "فِي الدَّفْتَرِ",
                de: "Ins Heft",
              },
              {
                ar: "عَلَى الْحَائِطِ",
                de: "An die Wand",
              },
            ],
            correct: 1,
            evidence: 4,
          },
        ],
      },
      {
        id: "market",
        level: "A1",
        title: {
          ar: "فِي سُوقِ الْفَاكِهَةِ",
          de: "Auf dem Obstmarkt",
        },
        art: 2,
        lines: [
          {
            ar: "أَذْهَبُ مَعَ أُمِّي إِلَى السُّوقِ.",
            de: "Ich gehe mit meiner Mutter zum Markt.",
          },
          {
            ar: "نَرَى تُفَّاحًا وَعِنَبًا وَمَوْزًا.",
            de: "Wir sehen Äpfel, Trauben und Bananen.",
          },
          {
            ar: "تَخْتَارُ أُمِّي عِنَبًا.",
            de: "Meine Mutter wählt Trauben aus.",
          },
          {
            ar: "أَخْتَارُ أَنَا تُفَّاحَةً حَمْرَاءَ.",
            de: "Ich wähle einen roten Apfel aus.",
          },
          {
            ar: "نَدْفَعُ الثَّمَنَ وَنَشْكُرُ الْبَائِعَ.",
            de: "Wir bezahlen und danken dem Verkäufer.",
          },
          {
            ar: "نَعُودُ إِلَى الْبَيْتِ مَعَ الْفَاكِهَةِ.",
            de: "Wir kehren mit dem Obst nach Hause zurück.",
          },
        ],
        vocabulary: [
          {
            ar: "سُوق",
            de: "Markt",
          },
          {
            ar: "عِنَب",
            de: "Trauben",
          },
          {
            ar: "بَائِع",
            de: "Verkäufer",
          },
          {
            ar: "فَاكِهَة",
            de: "Obst",
          },
        ],
        questions: [
          {
            prompt: {
              ar: "مَعَ مَنْ يَذْهَبُ الرَّاوِي؟",
              de: "Mit wem geht die erzählende Person?",
            },
            options: [
              {
                ar: "الْمُعَلِّمِ",
                de: "Dem Lehrer",
              },
              {
                ar: "الصَّدِيقِ",
                de: "Dem Freund",
              },
              {
                ar: "الْأُمِّ",
                de: "Der Mutter",
              },
            ],
            correct: 2,
            evidence: 0,
          },
          {
            prompt: {
              ar: "مَاذَا تَخْتَارُ الْأُمُّ؟",
              de: "Was wählt die Mutter?",
            },
            options: [
              {
                ar: "عِنَبًا",
                de: "Trauben",
              },
              {
                ar: "خُبْزًا",
                de: "Brot",
              },
              {
                ar: "حَلِيبًا",
                de: "Milch",
              },
            ],
            correct: 0,
            evidence: 2,
          },
          {
            prompt: {
              ar: "مَا لَوْنُ التُّفَّاحَةِ؟",
              de: "Welche Farbe hat der Apfel?",
            },
            options: [
              {
                ar: "أَخْضَرُ",
                de: "Grün",
              },
              {
                ar: "أَحْمَرُ",
                de: "Rot",
              },
              {
                ar: "أَصْفَرُ",
                de: "Gelb",
              },
            ],
            correct: 1,
            evidence: 3,
          },
          {
            prompt: {
              ar: "إِلَى أَيْنَ يَعُودَانِ؟",
              de: "Wohin kehren die beiden zurück?",
            },
            options: [
              {
                ar: "إِلَى الصَّفِّ",
                de: "In die Klasse",
              },
              {
                ar: "إِلَى الْحَدِيقَةِ",
                de: "In den Park",
              },
              {
                ar: "إِلَى الْبَيْتِ",
                de: "Nach Hause",
              },
            ],
            correct: 2,
            evidence: 5,
          },
        ],
      },
      {
        id: "park",
        level: "A2",
        title: {
          ar: "يَوْمٌ فِي الْحَدِيقَةِ",
          de: "Ein Tag im Park",
        },
        art: 3,
        lines: [
          {
            ar: "ذَهَبَ عُمَرُ وَأُخْتُهُ إِلَى الْحَدِيقَةِ صَبَاحًا.",
            de: "Omar und seine Schwester gingen morgens in den Park.",
          },
          {
            ar: "حَمَلَ عُمَرُ كُرَةً.",
            de: "Omar trug einen Ball.",
          },
          {
            ar: "لَعِبَا قُرْبَ شَجَرَةٍ كَبِيرَةٍ.",
            de: "Die beiden spielten in der Nähe eines großen Baumes.",
          },
          {
            ar: "ثُمَّ جَلَسَا لِيَشْرَبَا الْمَاءَ.",
            de: "Dann setzten sie sich hin, um Wasser zu trinken.",
          },
          {
            ar: "رَأَيَا عُصْفُورًا صَغِيرًا عَلَى غُصْنٍ.",
            de: "Sie sahen einen kleinen Vogel auf einem Ast.",
          },
          {
            ar: "عَادَا سَعِيدَيْنِ قَبْلَ الظُّهْرِ.",
            de: "Vor Mittag kehrten sie glücklich zurück.",
          },
        ],
        vocabulary: [
          {
            ar: "حَدِيقَة",
            de: "Park",
          },
          {
            ar: "كُرَة",
            de: "Ball",
          },
          {
            ar: "عُصْفُور",
            de: "Vogel",
          },
          {
            ar: "غُصْن",
            de: "Ast",
          },
        ],
        questions: [
          {
            prompt: {
              ar: "مَتَى ذَهَبَا إِلَى الْحَدِيقَةِ؟",
              de: "Wann gingen die beiden in den Park?",
            },
            options: [
              {
                ar: "صَبَاحًا",
                de: "Morgens",
              },
              {
                ar: "لَيْلًا",
                de: "Nachts",
              },
              {
                ar: "مَسَاءً",
                de: "Abends",
              },
            ],
            correct: 0,
            evidence: 0,
          },
          {
            prompt: {
              ar: "مَاذَا حَمَلَ عُمَرُ؟",
              de: "Was trug Omar?",
            },
            options: [
              {
                ar: "كِتَابًا",
                de: "Ein Buch",
              },
              {
                ar: "حَقِيبَةً",
                de: "Eine Tasche",
              },
              {
                ar: "كُرَةً",
                de: "Einen Ball",
              },
            ],
            correct: 2,
            evidence: 1,
          },
          {
            prompt: {
              ar: "لِمَاذَا جَلَسَا؟",
              de: "Warum setzten sie sich hin?",
            },
            options: [
              {
                ar: "لِيَنَامَا",
                de: "Um zu schlafen",
              },
              {
                ar: "لِيَشْرَبَا الْمَاءَ",
                de: "Um Wasser zu trinken",
              },
              {
                ar: "لِيَكْتُبَا",
                de: "Um zu schreiben",
              },
            ],
            correct: 1,
            evidence: 3,
          },
          {
            prompt: {
              ar: "أَيْنَ رَأَيَا الْعُصْفُورَ؟",
              de: "Wo sahen sie den Vogel?",
            },
            options: [
              {
                ar: "عَلَى غُصْنٍ",
                de: "Auf einem Ast",
              },
              {
                ar: "فِي الْمَاءِ",
                de: "Im Wasser",
              },
              {
                ar: "فِي حَقِيبَةٍ",
                de: "In einer Tasche",
              },
            ],
            correct: 0,
            evidence: 4,
          },
        ],
      },
      {
        id: "library",
        level: "A2",
        title: {
          ar: "كِتَابٌ جَدِيدٌ",
          de: "Ein neues Buch",
        },
        art: 4,
        lines: [
          {
            ar: "زَارَتْ نُورُ الْمَكْتَبَةَ بَعْدَ الْمَدْرَسَةِ.",
            de: "Nur besuchte nach der Schule die Bibliothek.",
          },
          {
            ar: "أَرَادَتْ كِتَابًا عَنِ الْحَيَوَانَاتِ.",
            de: "Sie wollte ein Buch über Tiere.",
          },
          {
            ar: "سَاعَدَتْهَا أَمِينَةُ الْمَكْتَبَةِ فِي الْبَحْثِ.",
            de: "Die Bibliothekarin half ihr bei der Suche.",
          },
          {
            ar: "اخْتَارَتْ نُورُ كِتَابًا فِيهِ صُوَرٌ كَثِيرَةٌ.",
            de: "Nur wählte ein Buch mit vielen Bildern aus.",
          },
          {
            ar: "اسْتَعَارَتِ الْكِتَابَ لِأُسْبُوعٍ.",
            de: "Sie lieh das Buch für eine Woche aus.",
          },
          {
            ar: "وَعَدَتْ أَنْ تُعِيدَهُ فِي الْمَوْعِدِ.",
            de: "Sie versprach, es rechtzeitig zurückzugeben.",
          },
        ],
        vocabulary: [
          {
            ar: "مَكْتَبَة",
            de: "Bibliothek",
          },
          {
            ar: "حَيَوَانَات",
            de: "Tiere",
          },
          {
            ar: "أُسْبُوع",
            de: "Woche",
          },
          {
            ar: "مَوْعِد",
            de: "Termin",
          },
        ],
        questions: [
          {
            prompt: {
              ar: "مَتَى زَارَتْ نُورُ الْمَكْتَبَةَ؟",
              de: "Wann besuchte Nur die Bibliothek?",
            },
            options: [
              {
                ar: "قَبْلَ الْفَطُورِ",
                de: "Vor dem Frühstück",
              },
              {
                ar: "بَعْدَ الْمَدْرَسَةِ",
                de: "Nach der Schule",
              },
              {
                ar: "فِي اللَّيْلِ",
                de: "Nachts",
              },
            ],
            correct: 1,
            evidence: 0,
          },
          {
            prompt: {
              ar: "عَنْ مَاذَا يَتَحَدَّثُ الْكِتَابُ؟",
              de: "Wovon handelt das Buch?",
            },
            options: [
              {
                ar: "السَّيَّارَاتِ",
                de: "Autos",
              },
              {
                ar: "الطَّعَامِ",
                de: "Essen",
              },
              {
                ar: "الْحَيَوَانَاتِ",
                de: "Tieren",
              },
            ],
            correct: 2,
            evidence: 1,
          },
          {
            prompt: {
              ar: "مَنْ سَاعَدَ نُورَ؟",
              de: "Wer half Nur?",
            },
            options: [
              {
                ar: "أَمِينَةُ الْمَكْتَبَةِ",
                de: "Die Bibliothekarin",
              },
              {
                ar: "السَّائِقُ",
                de: "Der Fahrer",
              },
              {
                ar: "الْبَائِعُ",
                de: "Der Verkäufer",
              },
            ],
            correct: 0,
            evidence: 2,
          },
          {
            prompt: {
              ar: "كَمْ مُدَّةُ اسْتِعَارَةِ الْكِتَابِ؟",
              de: "Wie lange darf sie das Buch ausleihen?",
            },
            options: [
              {
                ar: "يَوْمٌ",
                de: "Ein Tag",
              },
              {
                ar: "أُسْبُوعٌ",
                de: "Eine Woche",
              },
              {
                ar: "شَهْرٌ",
                de: "Ein Monat",
              },
            ],
            correct: 1,
            evidence: 4,
          },
        ],
      },
      {
        id: "bus",
        level: "A2",
        title: {
          ar: "رِحْلَةٌ بِالْحَافِلَةِ",
          de: "Eine Fahrt mit dem Bus",
        },
        art: 5,
        lines: [
          {
            ar: "خَرَجَ سَامِي مُبَكِّرًا لِيَزُورَ جَدَّهُ.",
            de: "Sami ging früh los, um seinen Großvater zu besuchen.",
          },
          {
            ar: "وَقَفَ عِنْدَ مَحَطَّةِ الْحَافِلَاتِ وَمَعَهُ حَقِيبَةٌ زَرْقَاءُ.",
            de: "Er wartete mit einer blauen Tasche an der Bushaltestelle.",
          },
          {
            ar: "وَصَلَتِ الْحَافِلَةُ بَعْدَ عَشْرِ دَقَائِقَ.",
            de: "Nach zehn Minuten kam der Bus.",
          },
          {
            ar: "اشْتَرَى تَذْكِرَةً وَجَلَسَ بِجَانِبِ النَّافِذَةِ.",
            de: "Er kaufte eine Fahrkarte und setzte sich ans Fenster.",
          },
          {
            ar: "رَأَى مِنَ النَّافِذَةِ حَدِيقَةً وَمَدْرَسَةً.",
            de: "Vom Fenster aus sah er einen Park und eine Schule.",
          },
          {
            ar: "عِنْدَمَا وَصَلَ، اسْتَقْبَلَهُ جَدُّهُ بِابْتِسَامَةٍ.",
            de: "Als er ankam, begrüßte ihn sein Großvater mit einem Lächeln.",
          },
        ],
        vocabulary: [
          {
            ar: "حَافِلَة",
            de: "Bus",
          },
          {
            ar: "مَحَطَّة",
            de: "Haltestelle",
          },
          {
            ar: "تَذْكِرَة",
            de: "Fahrkarte",
          },
          {
            ar: "نَافِذَة",
            de: "Fenster",
          },
        ],
        questions: [
          {
            prompt: {
              ar: "مَنْ يُرِيدُ سَامِي أَنْ يَزُورَ؟",
              de: "Wen möchte Sami besuchen?",
            },
            options: [
              {
                ar: "مُعَلِّمَهُ",
                de: "Seinen Lehrer",
              },
              {
                ar: "صَدِيقَهُ",
                de: "Seinen Freund",
              },
              {
                ar: "جَدَّهُ",
                de: "Seinen Großvater",
              },
            ],
            correct: 2,
            evidence: 0,
          },
          {
            prompt: {
              ar: "مَتَى وَصَلَتِ الْحَافِلَةُ؟",
              de: "Wann kam der Bus?",
            },
            options: [
              {
                ar: "بَعْدَ عَشْرِ دَقَائِقَ",
                de: "Nach zehn Minuten",
              },
              {
                ar: "بَعْدَ سَاعَةٍ",
                de: "Nach einer Stunde",
              },
              {
                ar: "بَعْدَ يَوْمٍ",
                de: "Nach einem Tag",
              },
            ],
            correct: 0,
            evidence: 2,
          },
          {
            prompt: {
              ar: "أَيْنَ جَلَسَ سَامِي؟",
              de: "Wo saß Sami?",
            },
            options: [
              {
                ar: "بِجَانِبِ الْبَابِ",
                de: "An der Tür",
              },
              {
                ar: "بِجَانِبِ النَّافِذَةِ",
                de: "Am Fenster",
              },
              {
                ar: "خَلْفَ السَّائِقِ",
                de: "Hinter dem Fahrer",
              },
            ],
            correct: 1,
            evidence: 3,
          },
          {
            prompt: {
              ar: "كَيْفَ اسْتَقْبَلَهُ جَدُّهُ؟",
              de: "Wie begrüßte ihn sein Großvater?",
            },
            options: [
              {
                ar: "بِغَضَبٍ",
                de: "Wütend",
              },
              {
                ar: "بِصَمْتٍ",
                de: "Schweigend",
              },
              {
                ar: "بِابْتِسَامَةٍ",
                de: "Mit einem Lächeln",
              },
            ],
            correct: 2,
            evidence: 5,
          },
        ],
      },
    ],
    audio: {
      تِين: "audio/practice/001.mp3",
      طِين: "audio/practice/002.mp3",
      تَابَ: "audio/practice/003.mp3",
      طَابَ: "audio/practice/004.mp3",
      تَاج: "audio/practice/005.mp3",
      طَائِر: "audio/practice/006.mp3",
      سَيْف: "audio/practice/007.mp3",
      صَيْف: "audio/practice/008.mp3",
      سَارَ: "audio/practice/009.mp3",
      صَارَ: "audio/practice/010.mp3",
      سَمَك: "audio/practice/011.mp3",
      صَبْر: "audio/practice/012.mp3",
      دَرْب: "audio/practice/013.mp3",
      ضَرْب: "audio/practice/014.mp3",
      دَلَّ: "audio/practice/015.mp3",
      ضَلَّ: "audio/practice/016.mp3",
      دُبّ: "audio/practice/017.mp3",
      ضَوْء: "audio/practice/018.mp3",
      ذَهَب: "audio/practice/019.mp3",
      ظَهْر: "audio/practice/020.mp3",
      ذُرَة: "audio/practice/021.mp3",
      ظَرْف: "audio/practice/022.mp3",
      ذَكِيّ: "audio/practice/023.mp3",
      ظِلّ: "audio/practice/024.mp3",
      حَرَم: "audio/practice/025.mp3",
      هَرَم: "audio/practice/026.mp3",
      حَال: "audio/practice/027.mp3",
      هَال: "audio/practice/028.mp3",
      حَبْل: "audio/practice/029.mp3",
      هِلَال: "audio/practice/030.mp3",
      قَلْب: "audio/practice/031.mp3",
      كَلْب: "audio/practice/032.mp3",
      قَالَ: "audio/practice/033.mp3",
      كَالَ: "audio/practice/034.mp3",
      قَمَر: "audio/practice/035.mp3",
      كِتَاب: "audio/practice/036.mp3",
      "أَنَا طَالِبٌ": "audio/practice/037.mp3",
      "هِيَ طَبِيبَةٌ": "audio/practice/038.mp3",
      "الْبَيْتُ كَبِيرٌ": "audio/practice/039.mp3",
      "الْبِنْتُ صَغِيرَةٌ": "audio/practice/040.mp3",
      "يَقْرَأُ الْوَلَدُ كِتَابًا": "audio/practice/041.mp3",
      "تَشْرَبُ الْبِنْتُ حَلِيبًا": "audio/practice/042.mp3",
      "يَأْكُلُ الطِّفْلُ تُفَّاحَةً": "audio/practice/043.mp3",
      "الْكِتَابُ عَلَى الطَّاوِلَةِ": "audio/practice/044.mp3",
      "الْقَلَمُ فِي الْحَقِيبَةِ": "audio/practice/045.mp3",
      "هَذِهِ سَيَّارَةٌ جَدِيدَةٌ": "audio/practice/046.mp3",
      "هَذَا قَلَمٌ أَزْرَقُ": "audio/practice/047.mp3",
      "أَذْهَبُ إِلَى الْمَدْرَسَةِ": "audio/practice/048.mp3",
      "كَتَبَتْ مَرْيَمُ رِسَالَةً قَصِيرَةً": "audio/practice/049.mp3",
      "اشْتَرَى أَحْمَدُ خُبْزًا طَازَجًا": "audio/practice/050.mp3",
      "هَؤُلَاءِ طُلَّابٌ مُجْتَهِدُونَ": "audio/practice/051.mp3",
      "الْكُتُبُ الْجَدِيدَةُ مُفِيدَةٌ": "audio/practice/052.mp3",
      "كَانَ الْجَوُّ بَارِدًا": "audio/practice/053.mp3",
      "إِنَّ الْعِلْمَ نَافِعٌ": "audio/practice/054.mp3",
      "لَنْ أَتَأَخَّرَ عَنِ الدَّرْسِ": "audio/practice/055.mp3",
      "لَمْ يَذْهَبْ خَالِدٌ إِلَى السُّوقِ": "audio/practice/056.mp3",
      "جَلَسَ الطِّفْلُ بِجَانِبِ أُمِّهِ": "audio/practice/057.mp3",
      "وَضَعْتُ الْمِفْتَاحَ تَحْتَ الْكِتَابِ": "audio/practice/058.mp3",
      "نَقْرَأُ الْقِصَصَ لِنَتَعَلَّمَ الْعَرَبِيَّةَ":
        "audio/practice/059.mp3",
      "فِي الْحَدِيقَةِ شَجَرَتَانِ كَبِيرَتَانِ": "audio/practice/060.mp3",
      "أَنَا لَيْلَى.": "audio/practice/061.mp3",
      "أَجْلِسُ مَعَ أُسْرَتِي فِي الْمَطْبَخِ.": "audio/practice/062.mp3",
      "عَلَى الطَّاوِلَةِ خُبْزٌ وَجُبْنٌ.": "audio/practice/063.mp3",
      "أَشْرَبُ الْحَلِيبَ، وَيَشْرَبُ أَبِي الشَّايَ.":
        "audio/practice/064.mp3",
      "تَأْكُلُ أُخْتِي تُفَّاحَةً.": "audio/practice/065.mp3",
      "بَعْدَ الْفَطُورِ أَذْهَبُ إِلَى الْمَدْرَسَةِ.":
        "audio/practice/066.mp3",
      أُسْرَة: "audio/practice/067.mp3",
      مَطْبَخ: "audio/practice/068.mp3",
      خُبْز: "audio/practice/069.mp3",
      حَلِيب: "audio/practice/070.mp3",
      "هَذَا صَفِّي.": "audio/practice/071.mp3",
      "أَجْلِسُ بِجَانِبِ صَدِيقِي سَامِي.": "audio/practice/072.mp3",
      "تَكْتُبُ الْمُعَلِّمَةُ حَرْفَ الْبَاءِ عَلَى السَّبُّورَةِ.":
        "audio/practice/073.mp3",
      "يَقْرَأُ سَامِي كَلِمَةَ بَيْتٍ.": "audio/practice/074.mp3",
      "أَكْتُبُ الْكَلِمَةَ فِي دَفْتَرِي.": "audio/practice/075.mp3",
      "تَقُولُ الْمُعَلِّمَةُ: أَحْسَنْتُمْ!": "audio/practice/076.mp3",
      صَفّ: "audio/practice/077.mp3",
      مُعَلِّمَة: "audio/practice/078.mp3",
      سَبُّورَة: "audio/practice/079.mp3",
      دَفْتَر: "audio/practice/080.mp3",
      "أَذْهَبُ مَعَ أُمِّي إِلَى السُّوقِ.": "audio/practice/081.mp3",
      "نَرَى تُفَّاحًا وَعِنَبًا وَمَوْزًا.": "audio/practice/082.mp3",
      "تَخْتَارُ أُمِّي عِنَبًا.": "audio/practice/083.mp3",
      "أَخْتَارُ أَنَا تُفَّاحَةً حَمْرَاءَ.": "audio/practice/084.mp3",
      "نَدْفَعُ الثَّمَنَ وَنَشْكُرُ الْبَائِعَ.": "audio/practice/085.mp3",
      "نَعُودُ إِلَى الْبَيْتِ مَعَ الْفَاكِهَةِ.": "audio/practice/086.mp3",
      سُوق: "audio/practice/087.mp3",
      عِنَب: "audio/practice/088.mp3",
      بَائِع: "audio/practice/089.mp3",
      فَاكِهَة: "audio/practice/090.mp3",
      "ذَهَبَ عُمَرُ وَأُخْتُهُ إِلَى الْحَدِيقَةِ صَبَاحًا.":
        "audio/practice/091.mp3",
      "حَمَلَ عُمَرُ كُرَةً.": "audio/practice/092.mp3",
      "لَعِبَا قُرْبَ شَجَرَةٍ كَبِيرَةٍ.": "audio/practice/093.mp3",
      "ثُمَّ جَلَسَا لِيَشْرَبَا الْمَاءَ.": "audio/practice/094.mp3",
      "رَأَيَا عُصْفُورًا صَغِيرًا عَلَى غُصْنٍ.": "audio/practice/095.mp3",
      "عَادَا سَعِيدَيْنِ قَبْلَ الظُّهْرِ.": "audio/practice/096.mp3",
      حَدِيقَة: "audio/practice/097.mp3",
      كُرَة: "audio/practice/098.mp3",
      عُصْفُور: "audio/practice/099.mp3",
      غُصْن: "audio/practice/100.mp3",
      "زَارَتْ نُورُ الْمَكْتَبَةَ بَعْدَ الْمَدْرَسَةِ.":
        "audio/practice/101.mp3",
      "أَرَادَتْ كِتَابًا عَنِ الْحَيَوَانَاتِ.": "audio/practice/102.mp3",
      "سَاعَدَتْهَا أَمِينَةُ الْمَكْتَبَةِ فِي الْبَحْثِ.":
        "audio/practice/103.mp3",
      "اخْتَارَتْ نُورُ كِتَابًا فِيهِ صُوَرٌ كَثِيرَةٌ.":
        "audio/practice/104.mp3",
      "اسْتَعَارَتِ الْكِتَابَ لِأُسْبُوعٍ.": "audio/practice/105.mp3",
      "وَعَدَتْ أَنْ تُعِيدَهُ فِي الْمَوْعِدِ.": "audio/practice/106.mp3",
      مَكْتَبَة: "audio/practice/107.mp3",
      حَيَوَانَات: "audio/practice/108.mp3",
      أُسْبُوع: "audio/practice/109.mp3",
      مَوْعِد: "audio/practice/110.mp3",
      "خَرَجَ سَامِي مُبَكِّرًا لِيَزُورَ جَدَّهُ.": "audio/practice/111.mp3",
      "وَقَفَ عِنْدَ مَحَطَّةِ الْحَافِلَاتِ وَمَعَهُ حَقِيبَةٌ زَرْقَاءُ.":
        "audio/practice/112.mp3",
      "وَصَلَتِ الْحَافِلَةُ بَعْدَ عَشْرِ دَقَائِقَ.":
        "audio/practice/113.mp3",
      "اشْتَرَى تَذْكِرَةً وَجَلَسَ بِجَانِبِ النَّافِذَةِ.":
        "audio/practice/114.mp3",
      "رَأَى مِنَ النَّافِذَةِ حَدِيقَةً وَمَدْرَسَةً.":
        "audio/practice/115.mp3",
      "عِنْدَمَا وَصَلَ، اسْتَقْبَلَهُ جَدُّهُ بِابْتِسَامَةٍ.":
        "audio/practice/116.mp3",
      حَافِلَة: "audio/practice/117.mp3",
      مَحَطَّة: "audio/practice/118.mp3",
      تَذْكِرَة: "audio/practice/119.mp3",
      نَافِذَة: "audio/practice/120.mp3",
    },
  };
  const expansion = typeof module !== "undefined" && module.exports ? require("./sentence-expanded-data.js") : window.ArabicSentenceExpansion;
  if (expansion) { data.sentences.push(...expansion.sentences); Object.assign(data.audio, expansion.audio); }
  for (const q of data.sentences) q.kind ||= q.words.join(" ").endsWith("؟") ? "question" : "statement";
  // Canonical Unicode spelling also matches the shared playback API.
  data.audio = Object.fromEntries(
    Object.entries(data.audio).map(([text, file]) => [
      text.normalize("NFC"),
      file,
    ]),
  );
  function soundQuestions(groupId = "all") {
    return data.sounds
      .filter((g) => groupId === "all" || g.id === groupId)
      .flatMap((g) =>
        g.pairs.flatMap((pair, pairIndex) =>
          pair.map((word, side) => ({
            id: `${g.id}-${pairIndex}-${side}`,
            group: g.id,
            word: word.ar,
            options: pair,
            correct: side,
          })),
        ),
      );
  }
  const variants = {
    s05: [0, 2, 1],
    s06: [0, 2, 1],
    s07: [0, 2, 1],
    s13: [0, 2, 3, 1],
    s14: [0, 2, 3, 1],
    s20: [0, 1, 3, 4, 2],
    s21: [0, 2, 3, 1],
    s22: [0, 2, 3, 1],
  };
  for (const sentence of data.sentences) {
    sentence.accepted = [sentence.words.join(" ")];
    if (variants[sentence.id])
      sentence.accepted.push(
        variants[sentence.id].map((i) => sentence.words[i]).join(" "),
      );
  }
  data.soundQuestions = soundQuestions;
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else window.ArabicPracticeData = data;
})();
