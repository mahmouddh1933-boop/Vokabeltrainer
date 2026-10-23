(() => {
  const data = {
    sentences: [
      {
        id: "s25",
        level: "A1",
        words: ["أَنَا", "أَسْكُنُ", "فِي", "بَيْتٍ", "صَغِيرٍ"],
        de: "Ich wohne in einem kleinen Haus.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s26",
        level: "A1",
        words: ["أُمِّي", "مُعَلِّمَةٌ", "فِي", "الْمَدْرَسَةِ"],
        de: "Meine Mutter ist Lehrerin in der Schule.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s27",
        level: "A1",
        words: ["أَبِي", "يَعْمَلُ", "فِي", "مَكْتَبٍ"],
        de: "Mein Vater arbeitet in einem Büro.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s28",
        level: "A1",
        words: ["أُخْتِي", "تَقْرَأُ", "كِتَابًا", "جَدِيدًا"],
        de: "Meine Schwester liest ein neues Buch.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s29",
        level: "A1",
        words: ["أَخِي", "يَلْعَبُ", "فِي", "الْحَدِيقَةِ"],
        de: "Mein Bruder spielt im Garten.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s30",
        level: "A1",
        words: ["نَحْنُ", "نَشْرَبُ", "الْمَاءَ"],
        de: "Wir trinken Wasser.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s31",
        level: "A1",
        words: ["الْقِطَّةُ", "تَحْتَ", "الْكُرْسِيِّ"],
        de: "Die Katze ist unter dem Stuhl.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s32",
        level: "A1",
        words: ["الْكَلْبُ", "أَمَامَ", "الْبَابِ"],
        de: "Der Hund ist vor der Tür.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s33",
        level: "A1",
        words: ["هَذَا", "قَلَمٌ", "أَخْضَرُ"],
        de: "Das ist ein grüner Stift.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s34",
        level: "A1",
        words: ["هَذِهِ", "حَقِيبَةٌ", "حَمْرَاءُ"],
        de: "Das ist eine rote Tasche.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s35",
        level: "A1",
        words: ["الْمَاءُ", "بَارِدٌ"],
        de: "Das Wasser ist kalt.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s36",
        level: "A1",
        words: ["الْخُبْزُ", "طَازَجٌ"],
        de: "Das Brot ist frisch.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s37",
        level: "A1",
        words: ["التُّفَّاحُ", "عَلَى", "الطَّاوِلَةِ"],
        de: "Die Äpfel liegen auf dem Tisch.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s38",
        level: "A1",
        words: ["أَنَا", "أُحِبُّ", "الْمَوْزَ"],
        de: "Ich mag Bananen.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s39",
        level: "A1",
        words: ["الْوَلَدُ", "يَأْكُلُ", "خُبْزًا"],
        de: "Der Junge isst Brot.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s40",
        level: "A1",
        words: ["الْبِنْتُ", "تَشْرَبُ", "حَلِيبًا"],
        de: "Das Mädchen trinkt Milch.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s41",
        level: "A1",
        words: ["الْمُعَلِّمُ", "يَكْتُبُ", "كَلِمَةً"],
        de: "Der Lehrer schreibt ein Wort.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s42",
        level: "A1",
        words: ["الطَّالِبَةُ", "تَفْتَحُ", "الْكِتَابَ"],
        de: "Die Schülerin öffnet das Buch.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s43",
        level: "A1",
        words: ["نَحْنُ", "نَذْهَبُ", "إِلَى", "الْمَدْرَسَةِ"],
        de: "Wir gehen zur Schule.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s44",
        level: "A1",
        words: ["أَنَا", "أَرْكَبُ", "الْحَافِلَةَ"],
        de: "Ich fahre mit dem Bus.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s45",
        level: "A1",
        words: ["السَّيَّارَةُ", "سَرِيعَةٌ"],
        de: "Das Auto ist schnell.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s46",
        level: "A1",
        words: ["الشَّمْسُ", "فِي", "السَّمَاءِ"],
        de: "Die Sonne ist am Himmel.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s47",
        level: "A1",
        words: ["الْجَوُّ", "جَمِيلٌ", "الْيَوْمَ"],
        de: "Das Wetter ist heute schön.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s48",
        level: "A1",
        words: ["السَّاعَةُ", "فَوْقَ", "الْبَابِ"],
        de: "Die Uhr ist über der Tür.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s49",
        level: "A1",
        words: ["أَيْنَ", "الْمَدْرَسَةُ؟"],
        de: "Wo ist die Schule?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s50",
        level: "A1",
        words: ["أَيْنَ", "تَسْكُنُ؟"],
        de: "Wo wohnst du?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s51",
        level: "A1",
        words: ["مَا", "اسْمُكَ؟"],
        de: "Wie heißt du?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s52",
        level: "A1",
        words: ["مَنْ", "هَذَا", "الرَّجُلُ؟"],
        de: "Wer ist dieser Mann?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s53",
        level: "A1",
        words: ["هَلْ", "أَنْتَ", "طَالِبٌ؟"],
        de: "Bist du Schüler?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s54",
        level: "A1",
        words: ["هَلْ", "هَذِهِ", "أُخْتُكَ؟"],
        de: "Ist das deine Schwester?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s55",
        level: "A1",
        words: ["مَاذَا", "تَأْكُلُ؟"],
        de: "Was isst du?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s56",
        level: "A1",
        words: ["مَاذَا", "تَشْرَبُ؟"],
        de: "Was trinkst du?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s57",
        level: "A1",
        words: ["كَيْفَ", "حَالُكَ", "الْيَوْمَ؟"],
        de: "Wie geht es dir heute?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s58",
        level: "A1",
        words: ["مَتَى", "تَذْهَبُ", "إِلَى", "الْمَدْرَسَةِ؟"],
        de: "Wann gehst du zur Schule?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s59",
        level: "A1",
        words: ["كَمْ", "كِتَابًا", "عِنْدَكَ؟"],
        de: "Wie viele Bücher hast du?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s60",
        level: "A1",
        words: ["أَيَّ", "لَوْنٍ", "تُحِبُّ؟"],
        de: "Welche Farbe magst du?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s61",
        level: "A1",
        words: ["هَلْ", "تُحِبُّ", "التُّفَّاحَ؟"],
        de: "Magst du Äpfel?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s62",
        level: "A1",
        words: ["أَيْنَ", "قَلَمِي", "الْأَزْرَقُ؟"],
        de: "Wo ist mein blauer Stift?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s63",
        level: "A1",
        words: ["هَلِ", "الْبَابُ", "مَفْتُوحٌ؟"],
        de: "Ist die Tür offen?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s64",
        level: "A1",
        words: ["مَنْ", "يَقْرَأُ", "الْكِتَابَ؟"],
        de: "Wer liest das Buch?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s65",
        level: "A1",
        words: ["اِفْتَحِ", "الْبَابَ", "مِنْ", "فَضْلِكَ"],
        de: "Öffne bitte die Tür.",
        kind: "command",
        explanation: {
          ar: "هذه جملة طلب. ابدأ بفعل الأمر أو النهي الظاهر، ثم أكمل المطلوب ومكانه أو زمانه.",
          de: "Das ist eine Aufforderung. Beginne mit der angegebenen Befehls- oder Verbotsform und ergänze die Handlung und ihre Angaben.",
        },
      },
      {
        id: "s66",
        level: "A1",
        words: ["اُكْتُبِ", "اسْمَكَ", "هُنَا"],
        de: "Schreibe hier deinen Namen.",
        kind: "command",
        explanation: {
          ar: "هذه جملة طلب. ابدأ بفعل الأمر أو النهي الظاهر، ثم أكمل المطلوب ومكانه أو زمانه.",
          de: "Das ist eine Aufforderung. Beginne mit der angegebenen Befehls- oder Verbotsform und ergänze die Handlung und ihre Angaben.",
        },
      },
      {
        id: "s67",
        level: "A1",
        words: ["اِقْرَأْ", "هَذِهِ", "الْكَلِمَةَ"],
        de: "Lies dieses Wort.",
        kind: "command",
        explanation: {
          ar: "هذه جملة طلب. ابدأ بفعل الأمر أو النهي الظاهر، ثم أكمل المطلوب ومكانه أو زمانه.",
          de: "Das ist eine Aufforderung. Beginne mit der angegebenen Befehls- oder Verbotsform und ergänze die Handlung und ihre Angaben.",
        },
      },
      {
        id: "s68",
        level: "A1",
        words: ["اِجْلِسْ", "عَلَى", "الْكُرْسِيِّ"],
        de: "Setze dich auf den Stuhl.",
        kind: "command",
        explanation: {
          ar: "هذه جملة طلب. ابدأ بفعل الأمر أو النهي الظاهر، ثم أكمل المطلوب ومكانه أو زمانه.",
          de: "Das ist eine Aufforderung. Beginne mit der angegebenen Befehls- oder Verbotsform und ergänze die Handlung und ihre Angaben.",
        },
      },
      {
        id: "s69",
        level: "A1",
        words: ["أَنَا", "لَا", "أَشْرَبُ", "الْقَهْوَةَ"],
        de: "Ich trinke keinen Kaffee.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s70",
        level: "A1",
        words: ["هِيَ", "لَا", "تَأْكُلُ", "السَّمَكَ"],
        de: "Sie isst keinen Fisch.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s71",
        level: "A1",
        words: ["عِنْدِي", "أَخٌ", "وَأُخْتٌ"],
        de: "Ich habe einen Bruder und eine Schwester.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s72",
        level: "A1",
        words: ["غُرْفَتِي", "كَبِيرَةٌ", "وَنَظِيفَةٌ"],
        de: "Mein Zimmer ist groß und sauber.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s73",
        level: "A2",
        words: ["سَافَرَتِ", "الْأُسْرَةُ", "بِالْقِطَارِ", "أَمْسِ"],
        de: "Die Familie ist gestern mit dem Zug gereist.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s74",
        level: "A2",
        words: ["اشْتَرَيْتُ", "تَذْكِرَةً", "مِنَ", "الْمَحَطَّةِ"],
        de: "Ich habe am Bahnhof eine Fahrkarte gekauft.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s75",
        level: "A2",
        words: ["حَجَزَ", "أَحْمَدُ", "غُرْفَةً", "فِي", "الْفُنْدُقِ"],
        de: "Ahmed hat ein Zimmer im Hotel gebucht.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s76",
        level: "A2",
        words: [
          "تَنْتَظِرُ",
          "مَرْيَمُ",
          "الْحَافِلَةَ",
          "أَمَامَ",
          "الْمَحَطَّةِ",
        ],
        de: "Maryam wartet vor der Haltestelle auf den Bus.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s77",
        level: "A2",
        words: ["سَأَزُورُ", "صَدِيقِي", "فِي", "الْمَسَاءِ"],
        de: "Ich werde meinen Freund am Abend besuchen.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s78",
        level: "A2",
        words: ["سَنَذْهَبُ", "إِلَى", "الْمَطْعَمِ", "بَعْدَ", "الدَّرْسِ"],
        de: "Wir werden nach dem Unterricht ins Restaurant gehen.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s79",
        level: "A2",
        words: ["أُرِيدُ", "طَبَقًا", "مِنَ", "الْأَرُزِّ"],
        de: "Ich möchte einen Teller Reis.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s80",
        level: "A2",
        words: ["طَلَبَتْ", "سَارَةُ", "سَلَطَةً", "وَعَصِيرًا"],
        de: "Sara bestellte einen Salat und einen Saft.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s81",
        level: "A2",
        words: ["هَذَا", "الْقَمِيصُ", "أَرْخَصُ", "مِنْ", "ذَلِكَ"],
        de: "Dieses Hemd ist billiger als jenes.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s82",
        level: "A2",
        words: ["الْحَقِيبَةُ", "الْجَدِيدَةُ", "خَفِيفَةٌ"],
        de: "Die neue Tasche ist leicht.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s83",
        level: "A2",
        words: ["الطَّرِيقُ", "إِلَى", "الْمُسْتَشْفَى", "طَوِيلٌ"],
        de: "Der Weg zum Krankenhaus ist lang.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s84",
        level: "A2",
        words: ["ذَهَبْتُ", "إِلَى", "الطَّبِيبِ", "لِأَنِّي", "مَرِيضٌ"],
        de: "Ich bin zum Arzt gegangen, weil ich krank bin.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s85",
        level: "A2",
        words: ["أَخَذْتُ", "الدَّوَاءَ", "بَعْدَ", "الطَّعَامِ"],
        de: "Ich habe das Medikament nach dem Essen genommen.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s86",
        level: "A2",
        words: ["يَجِبُ", "أَنْ", "تَشْرَبَ", "مَاءً", "كَثِيرًا"],
        de: "Du musst viel Wasser trinken.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s87",
        level: "A2",
        words: ["يَسْتَيْقِظُ", "أَخِي", "مُبَكِّرًا", "كُلَّ", "يَوْمٍ"],
        de: "Mein Bruder steht jeden Tag früh auf.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s88",
        level: "A2",
        words: ["أَغْسِلُ", "يَدَيَّ", "قَبْلَ", "الطَّعَامِ"],
        de: "Ich wasche mir vor dem Essen die Hände.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s89",
        level: "A2",
        words: ["نُرَتِّبُ", "الْبَيْتَ", "فِي", "نِهَايَةِ", "الْأُسْبُوعِ"],
        de: "Wir räumen am Wochenende das Haus auf.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s90",
        level: "A2",
        words: ["تَطْبُخُ", "أُمِّي", "وَجْبَةً", "لَذِيذَةً"],
        de: "Meine Mutter kocht eine leckere Mahlzeit.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s91",
        level: "A2",
        words: ["لَبِسْتُ", "مِعْطَفًا", "لِأَنَّ", "الْجَوَّ", "بَارِدٌ"],
        de: "Ich habe einen Mantel angezogen, weil es kalt ist.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s92",
        level: "A2",
        words: ["الْجَوُّ", "مَشْمِسٌ", "وَلَكِنَّ", "الرِّيحَ", "قَوِيَّةٌ"],
        de: "Es ist sonnig, aber der Wind ist stark.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالاسم أو الضمير المحدد، ثم أكمل خبره. راعِ تذكير الصفة أو تأنيثها، وموقع شبه الجملة.",
          de: "Beginne mit dem angegebenen Nomen oder Pronomen und ergänze die Aussage. Achte auf das Geschlecht des Adjektivs und die Ortsangabe.",
        },
      },
      {
        id: "s93",
        level: "A2",
        words: ["كَانَ", "الْمَتْجَرُ", "مُغْلَقًا", "أَمْسِ"],
        de: "Das Geschäft war gestern geschlossen.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s94",
        level: "A2",
        words: ["أَصْبَحَتِ", "الْحَدِيقَةُ", "جَمِيلَةً", "فِي", "الرَّبِيعِ"],
        de: "Der Garten ist im Frühling schön geworden.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s95",
        level: "A2",
        words: ["لَمْ", "أَشْتَرِ", "الْحِذَاءَ", "لِأَنَّهُ", "غَالٍ"],
        de: "Ich habe die Schuhe nicht gekauft, weil sie teuer sind.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s96",
        level: "A2",
        words: ["لَنْ", "نَتَأَخَّرَ", "عَنِ", "الْمَوْعِدِ"],
        de: "Wir werden uns zum Termin nicht verspäten.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s97",
        level: "A2",
        words: ["أَيْنَ", "يُمْكِنُنِي", "شِرَاءُ", "تَذْكِرَةٍ؟"],
        de: "Wo kann ich eine Fahrkarte kaufen?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s98",
        level: "A2",
        words: ["مَتَى", "يَصِلُ", "الْقِطَارُ", "إِلَى", "الْمَحَطَّةِ؟"],
        de: "Wann kommt der Zug am Bahnhof an?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s99",
        level: "A2",
        words: ["كَمْ", "تَسْتَغْرِقُ", "الرِّحْلَةُ", "بِالْحَافِلَةِ؟"],
        de: "Wie lange dauert die Fahrt mit dem Bus?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s100",
        level: "A2",
        words: ["بِكَمْ", "هَذَا", "الْقَمِيصُ", "الْأَزْرَقُ؟"],
        de: "Wie viel kostet dieses blaue Hemd?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s101",
        level: "A2",
        words: ["هَلْ", "عِنْدَكَ", "مَقَاسٌ", "أَصْغَرُ؟"],
        de: "Hast du eine kleinere Größe?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s102",
        level: "A2",
        words: ["مَاذَا", "تُفَضِّلُ", "لِوَجْبَةِ", "الْإِفْطَارِ؟"],
        de: "Was bevorzugst du zum Frühstück?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s103",
        level: "A2",
        words: ["لِمَاذَا", "ذَهَبْتَ", "إِلَى", "الطَّبِيبِ؟"],
        de: "Warum bist du zum Arzt gegangen?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s104",
        level: "A2",
        words: ["كَيْفَ", "أَصِلُ", "إِلَى", "الْمُسْتَشْفَى؟"],
        de: "Wie komme ich zum Krankenhaus?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s105",
        level: "A2",
        words: ["أَيُّ", "حَافِلَةٍ", "تَذْهَبُ", "إِلَى", "الْمَطَارِ؟"],
        de: "Welcher Bus fährt zum Flughafen?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s106",
        level: "A2",
        words: ["هَلْ", "تَسْتَطِيعُ", "مُسَاعَدَتِي؟"],
        de: "Kannst du mir helfen?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s107",
        level: "A2",
        words: ["مَعَ", "مَنْ", "سَافَرْتَ", "أَمْسِ؟"],
        de: "Mit wem bist du gestern gereist?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s108",
        level: "A2",
        words: ["مَاذَا", "فَعَلْتَ", "فِي", "نِهَايَةِ", "الْأُسْبُوعِ؟"],
        de: "Was hast du am Wochenende gemacht?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s109",
        level: "A2",
        words: [
          "كَمْ",
          "مَرَّةً",
          "تُمَارِسُ",
          "الرِّيَاضَةَ",
          "فِي",
          "الْأُسْبُوعِ؟",
        ],
        de: "Wie oft pro Woche machst du Sport?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s110",
        level: "A2",
        words: ["هَلْ", "يُوجَدُ", "مَطْعَمٌ", "قَرِيبٌ", "مِنْ", "هُنَا؟"],
        de: "Gibt es hier in der Nähe ein Restaurant?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s111",
        level: "A2",
        words: ["مَتَى", "يَبْدَأُ", "الْعَمَلُ؟"],
        de: "Wann beginnt die Arbeit?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s112",
        level: "A2",
        words: ["لِمَاذَا", "لَمْ", "تَحْضُرِ", "الدَّرْسَ", "أَمْسِ؟"],
        de: "Warum hast du gestern nicht am Unterricht teilgenommen?",
        kind: "question",
        explanation: {
          ar: "ابدأ بأداة الاستفهام الظاهرة. ثم رتّب بقية الكلمات لتوافق المعنى الألماني، واختم بعلامة السؤال.",
          de: "Beginne mit dem angegebenen Fragewort. Ordne den Rest passend zur deutschen Bedeutung; das Fragezeichen steht am Ende.",
        },
      },
      {
        id: "s113",
        level: "A2",
        words: ["اِنْعَطِفْ", "يَمِينًا", "عِنْدَ", "الْإِشَارَةِ"],
        de: "Biege an der Ampel rechts ab.",
        kind: "command",
        explanation: {
          ar: "هذه جملة طلب. ابدأ بفعل الأمر أو النهي الظاهر، ثم أكمل المطلوب ومكانه أو زمانه.",
          de: "Das ist eine Aufforderung. Beginne mit der angegebenen Befehls- oder Verbotsform und ergänze die Handlung und ihre Angaben.",
        },
      },
      {
        id: "s114",
        level: "A2",
        words: ["اِمْشِ", "مُسْتَقِيمًا", "حَتَّى", "الْمَحَطَّةِ"],
        de: "Gehe bis zum Bahnhof geradeaus.",
        kind: "command",
        explanation: {
          ar: "هذه جملة طلب. ابدأ بفعل الأمر أو النهي الظاهر، ثم أكمل المطلوب ومكانه أو زمانه.",
          de: "Das ist eine Aufforderung. Beginne mit der angegebenen Befehls- oder Verbotsform und ergänze die Handlung und ihre Angaben.",
        },
      },
      {
        id: "s115",
        level: "A2",
        words: ["لَا", "تَعْبُرِ", "الشَّارِعَ", "الْآنَ"],
        de: "Überquere jetzt nicht die Straße.",
        kind: "command",
        explanation: {
          ar: "هذه جملة طلب. ابدأ بفعل الأمر أو النهي الظاهر، ثم أكمل المطلوب ومكانه أو زمانه.",
          de: "Das ist eine Aufforderung. Beginne mit der angegebenen Befehls- oder Verbotsform und ergänze die Handlung und ihre Angaben.",
        },
      },
      {
        id: "s116",
        level: "A2",
        words: ["خُذْ", "هَذَا", "الدَّوَاءَ", "بَعْدَ", "الطَّعَامِ"],
        de: "Nimm dieses Medikament nach dem Essen.",
        kind: "command",
        explanation: {
          ar: "هذه جملة طلب. ابدأ بفعل الأمر أو النهي الظاهر، ثم أكمل المطلوب ومكانه أو زمانه.",
          de: "Das ist eine Aufforderung. Beginne mit der angegebenen Befehls- oder Verbotsform und ergänze die Handlung und ihre Angaben.",
        },
      },
      {
        id: "s117",
        level: "A2",
        words: [
          "عِنْدَمَا",
          "يَنْتَهِي",
          "الدَّرْسُ",
          "نَذْهَبُ",
          "إِلَى",
          "الْمَكْتَبَةِ",
        ],
        de: "Wenn der Unterricht endet, gehen wir in die Bibliothek.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s118",
        level: "A2",
        words: ["أَدْرُسُ", "الْعَرَبِيَّةَ", "كَيْ", "أَقْرَأَ", "الْقِصَصَ"],
        de: "Ich lerne Arabisch, um Geschichten zu lesen.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s119",
        level: "A2",
        words: [
          "قَرَأْتُ",
          "قِصَّةً",
          "قَصِيرَةً",
          "ثُمَّ",
          "كَتَبْتُ",
          "رِسَالَةً",
        ],
        de: "Ich habe eine kurze Geschichte gelesen und danach einen Brief geschrieben.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
      {
        id: "s120",
        level: "A2",
        words: ["أُحِبُّ", "السَّفَرَ", "لَكِنِّي", "أُفَضِّلُ", "الْقِطَارَ"],
        de: "Ich reise gern, bevorzuge aber den Zug.",
        kind: "statement",
        explanation: {
          ar: "ابدأ بالكلمة المحددة، ثم رتّب الفعل والفاعل والمفعول أو بقية الجملة بحسب المعنى. انتبه إلى حروف الجر وأدوات الربط.",
          de: "Beginne mit dem angegebenen Wort. Ordne Verb, Subjekt, Objekt und Ergänzungen passend zur Bedeutung. Beachte Präpositionen und Bindewörter.",
        },
      },
    ],
    audio: {
      "أَنَا أَسْكُنُ فِي بَيْتٍ صَغِيرٍ":
        "audio/sentence-expanded/b0d2979720ee2ab8.mp3",
      "أُمِّي مُعَلِّمَةٌ فِي الْمَدْرَسَةِ":
        "audio/sentence-expanded/5aee72fcfc741fbe.mp3",
      "أَبِي يَعْمَلُ فِي مَكْتَبٍ":
        "audio/sentence-expanded/44edc9884076470b.mp3",
      "أُخْتِي تَقْرَأُ كِتَابًا جَدِيدًا":
        "audio/sentence-expanded/d5396b3b17ccf761.mp3",
      "أَخِي يَلْعَبُ فِي الْحَدِيقَةِ":
        "audio/sentence-expanded/e72a3b5f723adc2e.mp3",
      "نَحْنُ نَشْرَبُ الْمَاءَ":
        "audio/sentence-expanded/20133a8cb8dfc02d.mp3",
      "الْقِطَّةُ تَحْتَ الْكُرْسِيِّ":
        "audio/sentence-expanded/336df2b43c362632.mp3",
      "الْكَلْبُ أَمَامَ الْبَابِ":
        "audio/sentence-expanded/6e350951e72124b3.mp3",
      "هَذَا قَلَمٌ أَخْضَرُ": "audio/sentence-expanded/f81da9c5ae4ed593.mp3",
      "هَذِهِ حَقِيبَةٌ حَمْرَاءُ":
        "audio/sentence-expanded/a804c3d8bb63b7fc.mp3",
      "الْمَاءُ بَارِدٌ": "audio/sentence-expanded/59277b9ae28811cf.mp3",
      "الْخُبْزُ طَازَجٌ": "audio/sentence-expanded/1d7e1736fe66cc49.mp3",
      "التُّفَّاحُ عَلَى الطَّاوِلَةِ":
        "audio/sentence-expanded/77a0b76159624a71.mp3",
      "أَنَا أُحِبُّ الْمَوْزَ": "audio/sentence-expanded/d894187db4082f65.mp3",
      "الْوَلَدُ يَأْكُلُ خُبْزًا":
        "audio/sentence-expanded/24ba786587ebe452.mp3",
      "الْبِنْتُ تَشْرَبُ حَلِيبًا":
        "audio/sentence-expanded/cba3149ce4b95cc2.mp3",
      "الْمُعَلِّمُ يَكْتُبُ كَلِمَةً":
        "audio/sentence-expanded/2f17e47f606be563.mp3",
      "الطَّالِبَةُ تَفْتَحُ الْكِتَابَ":
        "audio/sentence-expanded/08a855b7c7ea8cd0.mp3",
      "نَحْنُ نَذْهَبُ إِلَى الْمَدْرَسَةِ":
        "audio/sentence-expanded/3c58680a9e77d99a.mp3",
      "أَنَا أَرْكَبُ الْحَافِلَةَ":
        "audio/sentence-expanded/b004ba79e0fc73e9.mp3",
      "السَّيَّارَةُ سَرِيعَةٌ": "audio/sentence-expanded/23a2b2c477f1404c.mp3",
      "الشَّمْسُ فِي السَّمَاءِ":
        "audio/sentence-expanded/7a1730516337be12.mp3",
      "الْجَوُّ جَمِيلٌ الْيَوْمَ":
        "audio/sentence-expanded/772e65129bfe64d2.mp3",
      "السَّاعَةُ فَوْقَ الْبَابِ":
        "audio/sentence-expanded/eb1e2ffcd7cd7f70.mp3",
      "أَيْنَ الْمَدْرَسَةُ؟": "audio/sentence-expanded/40e615b4d1431b05.mp3",
      "أَيْنَ تَسْكُنُ؟": "audio/sentence-expanded/751bd6e4b5851662.mp3",
      "مَا اسْمُكَ؟": "audio/sentence-expanded/3fc85f0dc4a3bd19.mp3",
      "مَنْ هَذَا الرَّجُلُ؟": "audio/sentence-expanded/db3b2feea1551f38.mp3",
      "هَلْ أَنْتَ طَالِبٌ؟": "audio/sentence-expanded/9f54629cc87a7446.mp3",
      "هَلْ هَذِهِ أُخْتُكَ؟": "audio/sentence-expanded/a98b6f8dd915429f.mp3",
      "مَاذَا تَأْكُلُ؟": "audio/sentence-expanded/3cff3ac1cba61ac7.mp3",
      "مَاذَا تَشْرَبُ؟": "audio/sentence-expanded/39fda0bf9f9f3419.mp3",
      "كَيْفَ حَالُكَ الْيَوْمَ؟":
        "audio/sentence-expanded/29129bee4df31b73.mp3",
      "مَتَى تَذْهَبُ إِلَى الْمَدْرَسَةِ؟":
        "audio/sentence-expanded/30dd11d581729b89.mp3",
      "كَمْ كِتَابًا عِنْدَكَ؟": "audio/sentence-expanded/18e806637208a2aa.mp3",
      "أَيَّ لَوْنٍ تُحِبُّ؟": "audio/sentence-expanded/5f95e5b32a92fb94.mp3",
      "هَلْ تُحِبُّ التُّفَّاحَ؟":
        "audio/sentence-expanded/996a1c83b05884c8.mp3",
      "أَيْنَ قَلَمِي الْأَزْرَقُ؟":
        "audio/sentence-expanded/4c59c3ddcb5b1ea2.mp3",
      "هَلِ الْبَابُ مَفْتُوحٌ؟":
        "audio/sentence-expanded/00f8ba90ad9c125a.mp3",
      "مَنْ يَقْرَأُ الْكِتَابَ؟":
        "audio/sentence-expanded/bf4c5bf2f4a4cf1c.mp3",
      "اِفْتَحِ الْبَابَ مِنْ فَضْلِكَ":
        "audio/sentence-expanded/1a9e97831b712077.mp3",
      "اُكْتُبِ اسْمَكَ هُنَا": "audio/sentence-expanded/f2762d8d13006c03.mp3",
      "اِقْرَأْ هَذِهِ الْكَلِمَةَ":
        "audio/sentence-expanded/ecc375c635b38079.mp3",
      "اِجْلِسْ عَلَى الْكُرْسِيِّ":
        "audio/sentence-expanded/3fc25d6bc087fa3f.mp3",
      "أَنَا لَا أَشْرَبُ الْقَهْوَةَ":
        "audio/sentence-expanded/6c189ed60b36b6fd.mp3",
      "هِيَ لَا تَأْكُلُ السَّمَكَ":
        "audio/sentence-expanded/cbaa33ff135439af.mp3",
      "عِنْدِي أَخٌ وَأُخْتٌ": "audio/sentence-expanded/727fc1745e9d3e43.mp3",
      "غُرْفَتِي كَبِيرَةٌ وَنَظِيفَةٌ":
        "audio/sentence-expanded/4ab0f46b1e48bf4a.mp3",
      "سَافَرَتِ الْأُسْرَةُ بِالْقِطَارِ أَمْسِ":
        "audio/sentence-expanded/f8b3b9baa5e3a9d2.mp3",
      "اشْتَرَيْتُ تَذْكِرَةً مِنَ الْمَحَطَّةِ":
        "audio/sentence-expanded/b55a6e6f0764a7ea.mp3",
      "حَجَزَ أَحْمَدُ غُرْفَةً فِي الْفُنْدُقِ":
        "audio/sentence-expanded/eb2dff5088f295a0.mp3",
      "تَنْتَظِرُ مَرْيَمُ الْحَافِلَةَ أَمَامَ الْمَحَطَّةِ":
        "audio/sentence-expanded/83b2e6b0eaa9dd5a.mp3",
      "سَأَزُورُ صَدِيقِي فِي الْمَسَاءِ":
        "audio/sentence-expanded/a042cc268dc87610.mp3",
      "سَنَذْهَبُ إِلَى الْمَطْعَمِ بَعْدَ الدَّرْسِ":
        "audio/sentence-expanded/5ac27380ed7d8c6e.mp3",
      "أُرِيدُ طَبَقًا مِنَ الْأَرُزِّ":
        "audio/sentence-expanded/5dfdcf41aa732a8e.mp3",
      "طَلَبَتْ سَارَةُ سَلَطَةً وَعَصِيرًا":
        "audio/sentence-expanded/1ed91b72b13c201a.mp3",
      "هَذَا الْقَمِيصُ أَرْخَصُ مِنْ ذَلِكَ":
        "audio/sentence-expanded/0cf0a05b34fc76e5.mp3",
      "الْحَقِيبَةُ الْجَدِيدَةُ خَفِيفَةٌ":
        "audio/sentence-expanded/df7242c7f790627d.mp3",
      "الطَّرِيقُ إِلَى الْمُسْتَشْفَى طَوِيلٌ":
        "audio/sentence-expanded/25c43e2077e996bc.mp3",
      "ذَهَبْتُ إِلَى الطَّبِيبِ لِأَنِّي مَرِيضٌ":
        "audio/sentence-expanded/a713d111f9683f98.mp3",
      "أَخَذْتُ الدَّوَاءَ بَعْدَ الطَّعَامِ":
        "audio/sentence-expanded/e306c63cd37b5353.mp3",
      "يَجِبُ أَنْ تَشْرَبَ مَاءً كَثِيرًا":
        "audio/sentence-expanded/4d0e53609fbe4fe0.mp3",
      "يَسْتَيْقِظُ أَخِي مُبَكِّرًا كُلَّ يَوْمٍ":
        "audio/sentence-expanded/3716a98e9d90e46f.mp3",
      "أَغْسِلُ يَدَيَّ قَبْلَ الطَّعَامِ":
        "audio/sentence-expanded/4b752d41c52b9e5e.mp3",
      "نُرَتِّبُ الْبَيْتَ فِي نِهَايَةِ الْأُسْبُوعِ":
        "audio/sentence-expanded/0e7ce2704c56d2a5.mp3",
      "تَطْبُخُ أُمِّي وَجْبَةً لَذِيذَةً":
        "audio/sentence-expanded/61efda553aee5222.mp3",
      "لَبِسْتُ مِعْطَفًا لِأَنَّ الْجَوَّ بَارِدٌ":
        "audio/sentence-expanded/ac1b4b50d8912c87.mp3",
      "الْجَوُّ مَشْمِسٌ وَلَكِنَّ الرِّيحَ قَوِيَّةٌ":
        "audio/sentence-expanded/29bbc89e9e5b9af6.mp3",
      "كَانَ الْمَتْجَرُ مُغْلَقًا أَمْسِ":
        "audio/sentence-expanded/d81f6e30b14a76d3.mp3",
      "أَصْبَحَتِ الْحَدِيقَةُ جَمِيلَةً فِي الرَّبِيعِ":
        "audio/sentence-expanded/8a68ce621d24cf3d.mp3",
      "لَمْ أَشْتَرِ الْحِذَاءَ لِأَنَّهُ غَالٍ":
        "audio/sentence-expanded/36577816103aef11.mp3",
      "لَنْ نَتَأَخَّرَ عَنِ الْمَوْعِدِ":
        "audio/sentence-expanded/0f5257a0fe986c17.mp3",
      "أَيْنَ يُمْكِنُنِي شِرَاءُ تَذْكِرَةٍ؟":
        "audio/sentence-expanded/e9b2fad634ea6e9f.mp3",
      "مَتَى يَصِلُ الْقِطَارُ إِلَى الْمَحَطَّةِ؟":
        "audio/sentence-expanded/47f39e2898ab1ec3.mp3",
      "كَمْ تَسْتَغْرِقُ الرِّحْلَةُ بِالْحَافِلَةِ؟":
        "audio/sentence-expanded/f2f2c7395cf0947d.mp3",
      "بِكَمْ هَذَا الْقَمِيصُ الْأَزْرَقُ؟":
        "audio/sentence-expanded/f1b96ad6c877e900.mp3",
      "هَلْ عِنْدَكَ مَقَاسٌ أَصْغَرُ؟":
        "audio/sentence-expanded/74b01435a4616da1.mp3",
      "مَاذَا تُفَضِّلُ لِوَجْبَةِ الْإِفْطَارِ؟":
        "audio/sentence-expanded/acaab12f9edcf662.mp3",
      "لِمَاذَا ذَهَبْتَ إِلَى الطَّبِيبِ؟":
        "audio/sentence-expanded/1e78b2e33de60587.mp3",
      "كَيْفَ أَصِلُ إِلَى الْمُسْتَشْفَى؟":
        "audio/sentence-expanded/511514aaa5ad3452.mp3",
      "أَيُّ حَافِلَةٍ تَذْهَبُ إِلَى الْمَطَارِ؟":
        "audio/sentence-expanded/b466479f13844f1b.mp3",
      "هَلْ تَسْتَطِيعُ مُسَاعَدَتِي؟":
        "audio/sentence-expanded/ffb8472b4dc4064b.mp3",
      "مَعَ مَنْ سَافَرْتَ أَمْسِ؟":
        "audio/sentence-expanded/d68a5792e3b6d6b8.mp3",
      "مَاذَا فَعَلْتَ فِي نِهَايَةِ الْأُسْبُوعِ؟":
        "audio/sentence-expanded/f249f3350b9c3c28.mp3",
      "كَمْ مَرَّةً تُمَارِسُ الرِّيَاضَةَ فِي الْأُسْبُوعِ؟":
        "audio/sentence-expanded/5d751b424750ec20.mp3",
      "هَلْ يُوجَدُ مَطْعَمٌ قَرِيبٌ مِنْ هُنَا؟":
        "audio/sentence-expanded/46496511eab9714d.mp3",
      "مَتَى يَبْدَأُ الْعَمَلُ؟":
        "audio/sentence-expanded/595850fc2a309ad1.mp3",
      "لِمَاذَا لَمْ تَحْضُرِ الدَّرْسَ أَمْسِ؟":
        "audio/sentence-expanded/13e22d2220871934.mp3",
      "اِنْعَطِفْ يَمِينًا عِنْدَ الْإِشَارَةِ":
        "audio/sentence-expanded/3cc408fbd6ad8bc1.mp3",
      "اِمْشِ مُسْتَقِيمًا حَتَّى الْمَحَطَّةِ":
        "audio/sentence-expanded/8540fda596eefbd0.mp3",
      "لَا تَعْبُرِ الشَّارِعَ الْآنَ":
        "audio/sentence-expanded/71d3dcb908c85847.mp3",
      "خُذْ هَذَا الدَّوَاءَ بَعْدَ الطَّعَامِ":
        "audio/sentence-expanded/265e1259347519ad.mp3",
      "عِنْدَمَا يَنْتَهِي الدَّرْسُ نَذْهَبُ إِلَى الْمَكْتَبَةِ":
        "audio/sentence-expanded/8e24729356fd1ef9.mp3",
      "أَدْرُسُ الْعَرَبِيَّةَ كَيْ أَقْرَأَ الْقِصَصَ":
        "audio/sentence-expanded/a74bc7ac23cec9a4.mp3",
      "قَرَأْتُ قِصَّةً قَصِيرَةً ثُمَّ كَتَبْتُ رِسَالَةً":
        "audio/sentence-expanded/aa92ab993306f43c.mp3",
      "أُحِبُّ السَّفَرَ لَكِنِّي أُفَضِّلُ الْقِطَارَ":
        "audio/sentence-expanded/da47665fa69f2b33.mp3",
    },
  };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else window.ArabicSentenceExpansion = data;
})();
