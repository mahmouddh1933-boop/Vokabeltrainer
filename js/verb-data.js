(() => {
  "use strict";
  // Stems are explicit. Exceptional verbs use complete, separately reviewed paradigms.
  const verbs = [
    {
      id: "write",
      pastStem: "كَتَب",
      presentStem: "كْتُب",
      imperativeStem: "اُكْتُب",
      meaning: {
        ar: "الكتابة",
        de: "schreiben",
      },
      kind: "sound",
      example: {
        past: ["كَتَبَ رِسَالَةً.", "Er schrieb einen Brief."],
        present: ["يَكْتُبُ رِسَالَةً.", "Er schreibt einen Brief."],
        imperative: ["اُكْتُبْ رِسَالَةً.", "Schreib einen Brief."],
      },
    },
    {
      id: "study",
      pastStem: "دَرَس",
      presentStem: "دْرُس",
      imperativeStem: "اُدْرُس",
      meaning: {
        ar: "الدراسة",
        de: "lernen / studieren",
      },
      kind: "sound",
      example: {
        past: ["دَرَسَ جَيِّدًا.", "Er lernte gründlich."],
        present: ["يَدْرُسُ جَيِّدًا.", "Er lernt gründlich."],
        imperative: ["اُدْرُسْ جَيِّدًا.", "Lerne gründlich."],
      },
    },
    {
      id: "open",
      pastStem: "فَتَح",
      presentStem: "فْتَح",
      imperativeStem: "اِفْتَح",
      meaning: {
        ar: "الفَتْح",
        de: "öffnen",
      },
      kind: "sound",
      example: {
        past: ["فَتَحَ بَابًا.", "Er öffnete eine Tür."],
        present: ["يَفْتَحُ بَابًا.", "Er öffnet eine Tür."],
        imperative: ["اِفْتَحْ بَابًا.", "Öffne eine Tür."],
      },
    },
    {
      id: "drink",
      pastStem: "شَرِب",
      presentStem: "شْرَب",
      imperativeStem: "اِشْرَب",
      meaning: {
        ar: "الشُّرْب",
        de: "trinken",
      },
      kind: "sound",
      example: {
        past: ["شَرِبَ مَاءً.", "Er trank Wasser."],
        present: ["يَشْرَبُ مَاءً.", "Er trinkt Wasser."],
        imperative: ["اِشْرَبْ مَاءً.", "Trink Wasser."],
      },
    },
    {
      id: "play",
      pastStem: "لَعِب",
      presentStem: "لْعَب",
      imperativeStem: "اِلْعَب",
      meaning: {
        ar: "اللَّعِب",
        de: "spielen",
      },
      kind: "sound",
      example: {
        past: ["لَعِبَ بِالْكُرَةِ.", "Er spielte mit dem Ball."],
        present: ["يَلْعَبُ بِالْكُرَةِ.", "Er spielt mit dem Ball."],
        imperative: ["اِلْعَبْ بِالْكُرَةِ.", "Spiel mit dem Ball."],
      },
    },
    {
      id: "hear",
      pastStem: "سَمِع",
      presentStem: "سْمَع",
      imperativeStem: "اِسْمَع",
      meaning: {
        ar: "السَّماع",
        de: "hören",
      },
      kind: "sound",
      example: {
        past: ["سَمِعَ جَيِّدًا.", "Er hörte gut zu."],
        present: ["يَسْمَعُ جَيِّدًا.", "Er hört gut zu."],
        imperative: ["اِسْمَعْ جَيِّدًا.", "Hör gut zu."],
      },
    },
    {
      id: "work",
      pastStem: "عَمِل",
      presentStem: "عْمَل",
      imperativeStem: "اِعْمَل",
      meaning: {
        ar: "العمل",
        de: "arbeiten",
      },
      kind: "sound",
      example: {
        past: ["عَمِلَ فِي الْمَدْرَسَةِ.", "Er arbeitete in der Schule."],
        present: ["يَعْمَلُ فِي الْمَدْرَسَةِ.", "Er arbeitet in der Schule."],
        imperative: ["اِعْمَلْ فِي الْمَدْرَسَةِ.", "Arbeite in der Schule."],
      },
    },
    {
      id: "understand",
      pastStem: "فَهِم",
      presentStem: "فْهَم",
      imperativeStem: "اِفْهَم",
      meaning: {
        ar: "الفهم",
        de: "verstehen",
      },
      kind: "sound",
      example: {
        past: ["فَهِمَ فِكْرَةً.", "Er verstand eine Idee."],
        present: ["يَفْهَمُ فِكْرَةً.", "Er versteht eine Idee."],
        imperative: ["اِفْهَمْ فِكْرَةً.", "Verstehe eine Idee."],
      },
    },
    {
      id: "sit",
      pastStem: "جَلَس",
      presentStem: "جْلِس",
      imperativeStem: "اِجْلِس",
      meaning: {
        ar: "الجلوس",
        de: "sitzen / sich setzen",
      },
      kind: "sound",
      example: {
        past: ["جَلَسَ عَلَى الْكُرْسِيِّ.", "Er saß auf dem Stuhl."],
        present: ["يَجْلِسُ عَلَى الْكُرْسِيِّ.", "Er sitzt auf dem Stuhl."],
        imperative: [
          "اِجْلِسْ عَلَى الْكُرْسِيِّ.",
          "Setz dich auf den Stuhl.",
        ],
      },
    },
    {
      id: "exit",
      pastStem: "خَرَج",
      presentStem: "خْرُج",
      imperativeStem: "اُخْرُج",
      meaning: {
        ar: "الخروج",
        de: "hinausgehen",
      },
      kind: "sound",
      example: {
        past: ["خَرَجَ مِنَ الْبَيْتِ.", "Er ging aus dem Haus."],
        present: ["يَخْرُجُ مِنَ الْبَيْتِ.", "Er geht aus dem Haus."],
        imperative: ["اُخْرُجْ مِنَ الْبَيْتِ.", "Geh aus dem Haus."],
      },
    },
    {
      id: "enter",
      pastStem: "دَخَل",
      presentStem: "دْخُل",
      imperativeStem: "اُدْخُل",
      meaning: {
        ar: "الدخول",
        de: "hineingehen",
      },
      kind: "sound",
      example: {
        past: ["دَخَلَ إِلَى الْبَيْتِ.", "Er ging ins Haus."],
        present: ["يَدْخُلُ إِلَى الْبَيْتِ.", "Er geht ins Haus."],
        imperative: ["اُدْخُلْ إِلَى الْبَيْتِ.", "Geh ins Haus."],
      },
    },
    {
      id: "go",
      pastStem: "ذَهَب",
      presentStem: "ذْهَب",
      imperativeStem: "اِذْهَب",
      meaning: {
        ar: "الذهاب",
        de: "gehen",
      },
      kind: "sound",
      example: {
        past: ["ذَهَبَ إِلَى الْمَدْرَسَةِ.", "Er ging zur Schule."],
        present: ["يَذْهَبُ إِلَى الْمَدْرَسَةِ.", "Er geht zur Schule."],
        imperative: ["اِذْهَبْ إِلَى الْمَدْرَسَةِ.", "Geh zur Schule."],
      },
    },
    {
      id: "return",
      pastStem: "رَجَع",
      presentStem: "رْجِع",
      imperativeStem: "اِرْجِع",
      meaning: {
        ar: "الرجوع",
        de: "zurückkehren",
      },
      kind: "sound",
      example: {
        past: ["رَجَعَ إِلَى الْبَيْتِ.", "Er kehrte nach Hause zurück."],
        present: ["يَرْجِعُ إِلَى الْبَيْتِ.", "Er kehrt nach Hause zurück."],
        imperative: ["اِرْجِعْ إِلَى الْبَيْتِ.", "Kehre nach Hause zurück."],
      },
    },
    {
      id: "live",
      pastStem: "سَكَن",
      presentStem: "سْكُن",
      imperativeStem: "اُسْكُن",
      meaning: {
        ar: "السكن",
        de: "wohnen",
      },
      kind: "sound",
      example: {
        past: ["سَكَنَ فِي الْمَدِينَةِ.", "Er wohnte in der Stadt."],
        present: ["يَسْكُنُ فِي الْمَدِينَةِ.", "Er wohnt in der Stadt."],
        imperative: ["اُسْكُنْ فِي الْمَدِينَةِ.", "Wohne in der Stadt."],
      },
    },
    {
      id: "cook",
      pastStem: "طَبَخ",
      presentStem: "طْبُخ",
      imperativeStem: "اُطْبُخ",
      meaning: {
        ar: "الطبخ",
        de: "kochen",
      },
      kind: "sound",
      example: {
        past: ["طَبَخَ وَجْبَةً.", "Er kochte eine Mahlzeit."],
        present: ["يَطْبُخُ وَجْبَةً.", "Er kocht eine Mahlzeit."],
        imperative: ["اُطْبُخْ وَجْبَةً.", "Koch eine Mahlzeit."],
      },
    },
    {
      id: "wash",
      pastStem: "غَسَل",
      presentStem: "غْسِل",
      imperativeStem: "اِغْسِل",
      meaning: {
        ar: "الغسل",
        de: "waschen",
      },
      kind: "sound",
      example: {
        past: ["غَسَلَ يَدَيْهِ.", "Er wusch seine Hände."],
        present: ["يَغْسِلُ يَدَيْهِ.", "Er wäscht seine Hände."],
        imperative: ["اِغْسِلْ يَدَيْكَ.", "Wasch deine Hände."],
      },
    },
    {
      id: "wear",
      pastStem: "لَبِس",
      presentStem: "لْبَس",
      imperativeStem: "اِلْبَس",
      meaning: {
        ar: "اللُّبس",
        de: "anziehen / tragen",
      },
      kind: "sound",
      example: {
        past: ["لَبِسَ مِعْطَفًا.", "Er zog einen Mantel an."],
        present: ["يَلْبَسُ مِعْطَفًا.", "Er zieht einen Mantel an."],
        imperative: ["اِلْبَسْ مِعْطَفًا.", "Zieh einen Mantel an."],
      },
    },
    {
      id: "carry",
      pastStem: "حَمَل",
      presentStem: "حْمِل",
      imperativeStem: "اِحْمِل",
      meaning: {
        ar: "الحمل",
        de: "tragen",
      },
      kind: "sound",
      example: {
        past: ["حَمَلَ حَقِيبَةً.", "Er trug eine Tasche."],
        present: ["يَحْمِلُ حَقِيبَةً.", "Er trägt eine Tasche."],
        imperative: ["اِحْمِلْ حَقِيبَةً.", "Trag eine Tasche."],
      },
    },
    {
      id: "ride",
      pastStem: "رَكِب",
      presentStem: "رْكَب",
      imperativeStem: "اِرْكَب",
      meaning: {
        ar: "الركوب",
        de: "fahren / reiten",
      },
      kind: "sound",
      example: {
        past: ["رَكِبَ دَرَّاجَةً.", "Er fuhr Fahrrad."],
        present: ["يَرْكَبُ دَرَّاجَةً.", "Er fährt Fahrrad."],
        imperative: ["اِرْكَبْ دَرَّاجَةً.", "Fahr Fahrrad."],
      },
    },
    {
      id: "request",
      pastStem: "طَلَب",
      presentStem: "طْلُب",
      imperativeStem: "اُطْلُب",
      meaning: {
        ar: "الطلب",
        de: "bitten / anfordern",
      },
      kind: "sound",
      example: {
        past: ["طَلَبَ مُسَاعَدَةً.", "Er bat um Hilfe."],
        present: ["يَطْلُبُ مُسَاعَدَةً.", "Er bittet um Hilfe."],
        imperative: ["اُطْلُبْ مُسَاعَدَةً.", "Bitte um Hilfe."],
      },
    },
    {
      id: "memorize",
      pastStem: "حَفِظ",
      presentStem: "حْفَظ",
      imperativeStem: "اِحْفَظ",
      meaning: {
        ar: "الحفظ",
        de: "auswendig lernen",
      },
      kind: "sound",
      example: {
        past: ["حَفِظَ قَصِيدَةً.", "Er lernte ein Gedicht auswendig."],
        present: ["يَحْفَظُ قَصِيدَةً.", "Er lernt ein Gedicht auswendig."],
        imperative: ["اِحْفَظْ قَصِيدَةً.", "Lerne ein Gedicht auswendig."],
      },
    },
    {
      id: "draw",
      pastStem: "رَسَم",
      presentStem: "رْسُم",
      imperativeStem: "اُرْسُم",
      meaning: {
        ar: "الرسم",
        de: "zeichnen",
      },
      kind: "sound",
      example: {
        past: ["رَسَمَ شَجَرَةً.", "Er zeichnete einen Baum."],
        present: ["يَرْسُمُ شَجَرَةً.", "Er zeichnet einen Baum."],
        imperative: ["اُرْسُمْ شَجَرَةً.", "Zeichne einen Baum."],
      },
    },
    {
      id: "ask",
      pastStem: "سَأَل",
      presentStem: "سْأَل",
      imperativeStem: "اِسْأَل",
      meaning: {
        ar: "السؤال",
        de: "fragen",
      },
      kind: "hamzated",
      example: {
        past: ["سَأَلَ سُؤَالًا.", "Er stellte eine Frage."],
        present: ["يَسْأَلُ سُؤَالًا.", "Er stellt eine Frage."],
        imperative: ["اِسْأَلْ سُؤَالًا.", "Stell eine Frage."],
      },
    },
    {
      id: "pay",
      pastStem: "دَفَع",
      presentStem: "دْفَع",
      imperativeStem: "اِدْفَع",
      meaning: {
        ar: "الدفع",
        de: "bezahlen",
      },
      kind: "sound",
      example: {
        past: ["دَفَعَ ثَمَنَ الْكِتَابِ.", "Er bezahlte das Buch."],
        present: ["يَدْفَعُ ثَمَنَ الْكِتَابِ.", "Er bezahlt das Buch."],
        imperative: ["اِدْفَعْ ثَمَنَ الْكِتَابِ.", "Bezahl das Buch."],
      },
    },
    {
      id: "eat",
      kind: "hamzated",
      meaning: {
        ar: "الأكل",
        de: "essen",
      },
      forms: {
        past: [
          "أَكَلْتُ",
          "أَكَلْنَا",
          "أَكَلْتَ",
          "أَكَلْتِ",
          "أَكَلْتُمَا",
          "أَكَلْتُمَا",
          "أَكَلْتُمْ",
          "أَكَلْتُنَّ",
          "أَكَلَ",
          "أَكَلَتْ",
          "أَكَلَا",
          "أَكَلَتَا",
          "أَكَلُوا",
          "أَكَلْنَ",
        ],
        present: [
          "آكُلُ",
          "نَأْكُلُ",
          "تَأْكُلُ",
          "تَأْكُلِينَ",
          "تَأْكُلَانِ",
          "تَأْكُلَانِ",
          "تَأْكُلُونَ",
          "تَأْكُلْنَ",
          "يَأْكُلُ",
          "تَأْكُلُ",
          "يَأْكُلَانِ",
          "تَأْكُلَانِ",
          "يَأْكُلُونَ",
          "يَأْكُلْنَ",
        ],
        imperative: ["كُلْ", "كُلِي", "كُلَا", "كُلُوا", "كُلْنَ"],
      },
      note: {
        ar: "الفعل مهموز الأوّل. نقول: أنا آكُلُ، والأمر كُلْ؛ لا نضيف همزة وصل إلى صيغة الأمر.",
        de: "Das Verb beginnt mit Hamza. Mit „ich“ heißt es ākulu, der Imperativ ist kul. Er erhält kein zusätzliches Verbindungs-Alif.",
      },
      example: {
        past: ["أَكَلَ تُفَّاحَةً.", "Er aß einen Apfel."],
        present: ["يَأْكُلُ تُفَّاحَةً.", "Er isst einen Apfel."],
        imperative: ["كُلْ تُفَّاحَةً.", "Iss einen Apfel."],
      },
    },
    {
      id: "take",
      kind: "hamzated",
      meaning: {
        ar: "الأخذ",
        de: "nehmen",
      },
      forms: {
        past: [
          "أَخَذْتُ",
          "أَخَذْنَا",
          "أَخَذْتَ",
          "أَخَذْتِ",
          "أَخَذْتُمَا",
          "أَخَذْتُمَا",
          "أَخَذْتُمْ",
          "أَخَذْتُنَّ",
          "أَخَذَ",
          "أَخَذَتْ",
          "أَخَذَا",
          "أَخَذَتَا",
          "أَخَذُوا",
          "أَخَذْنَ",
        ],
        present: [
          "آخُذُ",
          "نَأْخُذُ",
          "تَأْخُذُ",
          "تَأْخُذِينَ",
          "تَأْخُذَانِ",
          "تَأْخُذَانِ",
          "تَأْخُذُونَ",
          "تَأْخُذْنَ",
          "يَأْخُذُ",
          "تَأْخُذُ",
          "يَأْخُذَانِ",
          "تَأْخُذَانِ",
          "يَأْخُذُونَ",
          "يَأْخُذْنَ",
        ],
        imperative: ["خُذْ", "خُذِي", "خُذَا", "خُذُوا", "خُذْنَ"],
      },
      note: {
        ar: "تسقط الهمزة في الأمر: خُذْ، خُذِي، خُذُوا. ومع أنا في المضارع نقول: آخُذُ.",
        de: "Im Imperativ entfällt die Hamza: ḫuḏ, ḫuḏī, ḫuḏū. Das Präsens mit „ich“ lautet āḫuḏu.",
      },
      example: {
        past: ["أَخَذَ حَقِيبَةً.", "Er nahm eine Tasche."],
        present: ["يَأْخُذُ حَقِيبَةً.", "Er nimmt eine Tasche."],
        imperative: ["خُذْ حَقِيبَةً.", "Nimm eine Tasche."],
      },
    },
    {
      id: "say",
      kind: "weak",
      meaning: {
        ar: "القول",
        de: "sagen",
      },
      forms: {
        past: [
          "قُلْتُ",
          "قُلْنَا",
          "قُلْتَ",
          "قُلْتِ",
          "قُلْتُمَا",
          "قُلْتُمَا",
          "قُلْتُمْ",
          "قُلْتُنَّ",
          "قَالَ",
          "قَالَتْ",
          "قَالَا",
          "قَالَتَا",
          "قَالُوا",
          "قُلْنَ",
        ],
        present: [
          "أَقُولُ",
          "نَقُولُ",
          "تَقُولُ",
          "تَقُولِينَ",
          "تَقُولَانِ",
          "تَقُولَانِ",
          "تَقُولُونَ",
          "تَقُلْنَ",
          "يَقُولُ",
          "تَقُولُ",
          "يَقُولَانِ",
          "تَقُولَانِ",
          "يَقُولُونَ",
          "يَقُلْنَ",
        ],
        imperative: ["قُلْ", "قُولِي", "قُولَا", "قُولُوا", "قُلْنَ"],
      },
      note: {
        ar: "فعل أجوف. لاحظ: قَالَ ← قُلْتُ، والأمر قُلْ؛ وتعود الواو في قُولِي وقُولُوا.",
        de: "Ein hohles Verb: qāla wird zu qultu. Der Imperativ heißt qul; vor Endungen erscheint das Wāw wieder: qūlī, qūlū.",
      },
      example: {
        past: ["قَالَ كَلَامًا طَيِّبًا.", "Er sagte freundliche Worte."],
        present: ["يَقُولُ كَلَامًا طَيِّبًا.", "Er sagt freundliche Worte."],
        imperative: ["قُلْ كَلَامًا طَيِّبًا.", "Sag freundliche Worte."],
      },
    },
    {
      id: "sleep",
      kind: "weak",
      meaning: {
        ar: "النوم",
        de: "schlafen",
      },
      forms: {
        past: [
          "نِمْتُ",
          "نِمْنَا",
          "نِمْتَ",
          "نِمْتِ",
          "نِمْتُمَا",
          "نِمْتُمَا",
          "نِمْتُمْ",
          "نِمْتُنَّ",
          "نَامَ",
          "نَامَتْ",
          "نَامَا",
          "نَامَتَا",
          "نَامُوا",
          "نِمْنَ",
        ],
        present: [
          "أَنَامُ",
          "نَنَامُ",
          "تَنَامُ",
          "تَنَامِينَ",
          "تَنَامَانِ",
          "تَنَامَانِ",
          "تَنَامُونَ",
          "تَنَمْنَ",
          "يَنَامُ",
          "تَنَامُ",
          "يَنَامَانِ",
          "تَنَامَانِ",
          "يَنَامُونَ",
          "يَنَمْنَ",
        ],
        imperative: ["نَمْ", "نَامِي", "نَامَا", "نَامُوا", "نَمْنَ"],
      },
      note: {
        ar: "فعل أجوف. نقول: نَامَ، أنا نِمْتُ، والأمر نَمْ. أمّا للمؤنّث المفرد فنقول نَامِي.",
        de: "Ein hohles Verb: nāma, aber „ich schlief“ heißt nimtu. Der Imperativ ist nam, für eine Frau nāmī.",
      },
      example: {
        past: ["نَامَ مُبَكِّرًا.", "Er schlief früh."],
        present: ["يَنَامُ مُبَكِّرًا.", "Er schläft früh."],
        imperative: ["نَمْ مُبَكِّرًا.", "Schlaf früh."],
      },
    },
    {
      id: "read",
      kind: "hamzated",
      meaning: {
        ar: "القراءة",
        de: "lesen",
      },
      forms: {
        past: [
          "قَرَأْتُ",
          "قَرَأْنَا",
          "قَرَأْتَ",
          "قَرَأْتِ",
          "قَرَأْتُمَا",
          "قَرَأْتُمَا",
          "قَرَأْتُمْ",
          "قَرَأْتُنَّ",
          "قَرَأَ",
          "قَرَأَتْ",
          "قَرَآ",
          "قَرَأَتَا",
          "قَرَؤُوا",
          "قَرَأْنَ",
        ],
        present: [
          "أَقْرَأُ",
          "نَقْرَأُ",
          "تَقْرَأُ",
          "تَقْرَئِينَ",
          "تَقْرَآنِ",
          "تَقْرَآنِ",
          "تَقْرَؤُونَ",
          "تَقْرَأْنَ",
          "يَقْرَأُ",
          "تَقْرَأُ",
          "يَقْرَآنِ",
          "تَقْرَآنِ",
          "يَقْرَؤُونَ",
          "يَقْرَأْنَ",
        ],
        imperative: [
          "اِقْرَأْ",
          "اِقْرَئِي",
          "اِقْرَآ",
          "اِقْرَؤُوا",
          "اِقْرَأْنَ",
        ],
      },
      note: {
        ar: "الفعل مهموز الآخر. قد يتغيّر رسم الهمزة عند الاتصال: يَقْرَأُ، تَقْرَئِينَ، يَقْرَؤُونَ، اِقْرَآ.",
        de: "Das Verb endet auf Hamza. Ihr Schriftbild verändert sich mit den Endungen: yaqraʾu, taqraʾīna, yaqraʾūna, iqraʾā.",
      },
      example: {
        past: ["قَرَأَ كِتَابًا.", "Er las ein Buch."],
        present: ["يَقْرَأُ كِتَابًا.", "Er liest ein Buch."],
        imperative: ["اِقْرَأْ كِتَابًا.", "Lies ein Buch."],
      },
    },
    {
      id: "stand",
      kind: "weak",
      meaning: {
        ar: "الوقوف",
        de: "stehen / stehen bleiben",
      },
      forms: {
        past: [
          "وَقَفْتُ",
          "وَقَفْنَا",
          "وَقَفْتَ",
          "وَقَفْتِ",
          "وَقَفْتُمَا",
          "وَقَفْتُمَا",
          "وَقَفْتُمْ",
          "وَقَفْتُنَّ",
          "وَقَفَ",
          "وَقَفَتْ",
          "وَقَفَا",
          "وَقَفَتَا",
          "وَقَفُوا",
          "وَقَفْنَ",
        ],
        present: [
          "أَقِفُ",
          "نَقِفُ",
          "تَقِفُ",
          "تَقِفِينَ",
          "تَقِفَانِ",
          "تَقِفَانِ",
          "تَقِفُونَ",
          "تَقِفْنَ",
          "يَقِفُ",
          "تَقِفُ",
          "يَقِفَانِ",
          "تَقِفَانِ",
          "يَقِفُونَ",
          "يَقِفْنَ",
        ],
        imperative: ["قِفْ", "قِفِي", "قِفَا", "قِفُوا", "قِفْنَ"],
      },
      note: {
        ar: "فعل معتلّ الأوّل بالواو. تُحذف الواو في المضارع والأمر: وَقَفَ ← يَقِفُ ← قِفْ.",
        de: "Ein schwaches Verb mit anfänglichem Wāw. Dieses entfällt in Präsens und Imperativ: waqafa → yaqifu → qif.",
      },
      example: {
        past: ["وَقَفَ أَمَامَ الْبَابِ.", "Er stand vor der Tür."],
        present: ["يَقِفُ أَمَامَ الْبَابِ.", "Er steht vor der Tür."],
        imperative: ["قِفْ أَمَامَ الْبَابِ.", "Bleib vor der Tür stehen."],
      },
    },
  ];
  const pronouns = [
    {
      ar: "أَنَا",
      de: "ich",
      description: "المتكلّم المفرد",
      past: "ْتُ",
      present: ["أَ", "ُ"],
    },
    {
      ar: "نَحْنُ",
      de: "wir",
      description: "المتكلّم الجمع أو المثنّى",
      past: "ْنَا",
      present: ["نَ", "ُ"],
    },
    {
      ar: "أَنْتَ",
      de: "du · männlich",
      description: "المخاطب المفرد المذكّر",
      past: "ْتَ",
      present: ["تَ", "ُ"],
    },
    {
      ar: "أَنْتِ",
      de: "du · weiblich",
      description: "المخاطب المفرد المؤنّث",
      past: "ْتِ",
      present: ["تَ", "ِينَ"],
    },
    {
      ar: "أَنْتُمَا",
      de: "ihr zwei · männlich / gemischt",
      description: "المخاطب المثنّى المذكّر",
      past: "ْتُمَا",
      present: ["تَ", "َانِ"],
    },
    {
      ar: "أَنْتُمَا",
      de: "ihr zwei · weiblich",
      description: "المخاطب المثنّى المؤنّث",
      past: "ْتُمَا",
      present: ["تَ", "َانِ"],
    },
    {
      ar: "أَنْتُمْ",
      de: "ihr · männlich / gemischt",
      description: "المخاطب الجمع المذكّر",
      past: "ْتُمْ",
      present: ["تَ", "ُونَ"],
    },
    {
      ar: "أَنْتُنَّ",
      de: "ihr · weiblich",
      description: "المخاطب الجمع المؤنّث",
      past: "ْتُنَّ",
      present: ["تَ", "ْنَ"],
    },
    {
      ar: "هُوَ",
      de: "er",
      description: "الغائب المفرد المذكّر",
      past: "َ",
      present: ["يَ", "ُ"],
    },
    {
      ar: "هِيَ",
      de: "sie · Einzahl",
      description: "الغائب المفرد المؤنّث",
      past: "َتْ",
      present: ["تَ", "ُ"],
    },
    {
      ar: "هُمَا",
      de: "sie zwei · männlich / gemischt",
      description: "الغائب المثنّى المذكّر",
      past: "َا",
      present: ["يَ", "َانِ"],
    },
    {
      ar: "هُمَا",
      de: "sie zwei · weiblich",
      description: "الغائب المثنّى المؤنّث",
      past: "َتَا",
      present: ["تَ", "َانِ"],
    },
    {
      ar: "هُمْ",
      de: "sie · männlich / gemischt",
      description: "الغائب الجمع المذكّر",
      past: "ُوا",
      present: ["يَ", "ُونَ"],
    },
    {
      ar: "هُنَّ",
      de: "sie · weiblich",
      description: "الغائب الجمع المؤنّث",
      past: "ْنَ",
      present: ["يَ", "ْنَ"],
    },
  ];

  pronouns.forEach((person, index) => {
    person.index = index;
  });
  const commandIndices = { 2: 0, 3: 1, 4: 2, 5: 2, 6: 3, 7: 4 };
  const imperativePronouns = [
    pronouns[2],
    pronouns[3],
    {
      ...pronouns[4],
      description: "المخاطب المثنّى المذكّر والمؤنّث",
      de: "ihr zwei · beide Geschlechter",
    },
    pronouns[6],
    pronouns[7],
  ];
  const commandEndings = ["ْ", "ِي", "َا", "ُوا", "ْنَ"];
  function pronounsFor(tense) {
    return tense === "imperative" ? imperativePronouns : pronouns;
  }
  function parts(verb, tense, person) {
    if (!["past", "present", "imperative"].includes(tense)) return null;
    const commandIndex = commandIndices[person.index];
    if (tense === "imperative" && commandIndex === undefined) return null;
    if (verb.forms) {
      const form =
        verb.forms[tense][tense === "imperative" ? commandIndex : person.index];
      let prefix =
        tense === "present" && form.startsWith(person.present[0])
          ? person.present[0]
          : "";
      let suffix =
        tense === "past"
          ? person.past
          : tense === "present"
            ? person.present[1]
            : commandEndings[commandIndex];
      // Contracted hamza spellings (e.g. قَرَآ) cannot be split at a suffix boundary.
      if (!form.endsWith(suffix)) suffix = "";
      return [
        prefix,
        form.slice(prefix.length, suffix ? -suffix.length : undefined),
        suffix,
      ];
    }
    if (tense === "past") return ["", verb.pastStem, person.past];
    if (tense === "present")
      return [person.present[0], verb.presentStem, person.present[1]];
    return [
      verb.imperativeStem.slice(0, 2),
      verb.imperativeStem.slice(2),
      commandEndings[commandIndex],
    ];
  }
  function conjugate(verb, tense, person) {
    const segments = parts(verb, tense, person);
    return segments ? segments.join("") : null;
  }
  const data = {
    verbs,
    pronouns,
    imperativePronouns,
    pronounsFor,
    parts,
    conjugate,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else window.VerbLessonData = data;
})();
