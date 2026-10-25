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
  verbs.push(
    ...[
      {
        id: "teach",
        pastStem: "عَلَّم",
        presentStem: "عَلِّم",
        imperativeStem: "عَلِّم",
        presentVowel: "ُ",
        meaning: {
          ar: "التعليم",
          de: "unterrichten",
        },
        kind: "sound",
        formLength: 4,
        pattern: "فَعَّلَ",
        root: "ع ل م",
        structure: "ثلاثي مزيد",
        example: {
          past: ["عَلَّمَ طِفْلًا.", "Er unterrichtete ein Kind."],
          present: ["يُعَلِّمُ طِفْلًا.", "Er unterrichtet ein Kind."],
          imperative: ["عَلِّمْ طِفْلًا.", "Unterrichte ein Kind."],
        },
      },
      {
        id: "help",
        pastStem: "سَاعَد",
        presentStem: "سَاعِد",
        imperativeStem: "سَاعِد",
        presentVowel: "ُ",
        meaning: {
          ar: "المساعدة",
          de: "helfen",
        },
        kind: "sound",
        formLength: 4,
        pattern: "فَاعَلَ",
        root: "س ع د",
        structure: "ثلاثي مزيد",
        example: {
          past: ["سَاعَدَ صَدِيقًا.", "Er half einem Freund."],
          present: ["يُسَاعِدُ صَدِيقًا.", "Er hilft einem Freund."],
          imperative: ["سَاعِدْ صَدِيقًا.", "Hilf einem Freund."],
        },
      },
      {
        id: "honor",
        pastStem: "أَكْرَم",
        presentStem: "كْرِم",
        imperativeStem: "أَكْرِم",
        presentVowel: "ُ",
        meaning: {
          ar: "الإكرام",
          de: "ehren",
        },
        kind: "sound",
        formLength: 4,
        pattern: "أَفْعَلَ",
        root: "ك ر م",
        structure: "ثلاثي مزيد",
        example: {
          past: ["أَكْرَمَ ضَيْفًا.", "Er ehrte einen Gast."],
          present: ["يُكْرِمُ ضَيْفًا.", "Er ehrt einen Gast."],
          imperative: ["أَكْرِمْ ضَيْفًا.", "Ehre einen Gast."],
        },
      },
      {
        id: "send",
        pastStem: "أَرْسَل",
        presentStem: "رْسِل",
        imperativeStem: "أَرْسِل",
        presentVowel: "ُ",
        meaning: {
          ar: "الإرسال",
          de: "senden",
        },
        kind: "sound",
        formLength: 4,
        pattern: "أَفْعَلَ",
        root: "ر س ل",
        structure: "ثلاثي مزيد",
        example: {
          past: ["أَرْسَلَ رِسَالَةً.", "Er sandte einen Brief."],
          present: ["يُرْسِلُ رِسَالَةً.", "Er sendet einen Brief."],
          imperative: ["أَرْسِلْ رِسَالَةً.", "Sende einen Brief."],
        },
      },
      {
        id: "travel",
        pastStem: "سَافَر",
        presentStem: "سَافِر",
        imperativeStem: "سَافِر",
        presentVowel: "ُ",
        meaning: {
          ar: "السفر",
          de: "reisen",
        },
        kind: "sound",
        formLength: 4,
        pattern: "فَاعَلَ",
        root: "س ف ر",
        structure: "ثلاثي مزيد",
        example: {
          past: ["سَافَرَ إِلَى مَدِينَةٍ.", "Er reiste in eine Stadt."],
          present: ["يُسَافِرُ إِلَى مَدِينَةٍ.", "Er reist in eine Stadt."],
          imperative: ["سَافِرْ إِلَى مَدِينَةٍ.", "Reise in eine Stadt."],
        },
      },
      {
        id: "roll",
        pastStem: "دَحْرَج",
        presentStem: "دَحْرِج",
        imperativeStem: "دَحْرِج",
        presentVowel: "ُ",
        meaning: {
          ar: "الدحرجة",
          de: "rollen",
        },
        kind: "sound",
        formLength: 4,
        pattern: "فَعْلَلَ",
        root: "د ح ر ج",
        structure: "رباعي مجرد",
        example: {
          past: ["دَحْرَجَ كُرَةً.", "Er rollte einen Ball."],
          present: ["يُدَحْرِجُ كُرَةً.", "Er rollt einen Ball."],
          imperative: ["دَحْرِجْ كُرَةً.", "Rolle einen Ball."],
        },
      },
      {
        id: "learn",
        pastStem: "تَعَلَّم",
        presentStem: "تَعَلَّم",
        imperativeStem: "تَعَلَّم",
        presentVowel: "َ",
        meaning: {
          ar: "التعلّم",
          de: "lernen",
        },
        kind: "sound",
        formLength: 5,
        pattern: "تَفَعَّلَ",
        root: "ع ل م",
        structure: "ثلاثي مزيد",
        example: {
          past: ["تَعَلَّمَ لُغَةً.", "Er lernte eine Sprache."],
          present: ["يَتَعَلَّمُ لُغَةً.", "Er lernt eine Sprache."],
          imperative: ["تَعَلَّمْ لُغَةً.", "Lerne eine Sprache."],
        },
      },
      {
        id: "share",
        pastStem: "تَشَارَك",
        presentStem: "تَشَارَك",
        imperativeStem: "تَشَارَك",
        presentVowel: "َ",
        meaning: {
          ar: "التشارك",
          de: "teilen / gemeinsam nutzen",
        },
        kind: "sound",
        formLength: 5,
        pattern: "تَفَاعَلَ",
        root: "ش ر ك",
        structure: "ثلاثي مزيد",
        example: {
          past: ["تَشَارَكَ مَعَ صَدِيقٍ.", "Er teilte mit einem Freund."],
          present: ["يَتَشَارَكُ مَعَ صَدِيقٍ.", "Er teilt mit einem Freund."],
          imperative: ["تَشَارَكْ مَعَ صَدِيقٍ.", "Teile mit einem Freund."],
        },
      },
      {
        id: "depart",
        pastStem: "اِنْطَلَق",
        presentStem: "نْطَلِق",
        imperativeStem: "اِنْطَلِق",
        presentVowel: "َ",
        meaning: {
          ar: "الانطلاق",
          de: "aufbrechen",
        },
        kind: "sound",
        formLength: 5,
        pattern: "اِنْفَعَلَ",
        root: "ط ل ق",
        structure: "ثلاثي مزيد",
        example: {
          past: ["اِنْطَلَقَ بِسُرْعَةٍ.", "Er brach schnell auf."],
          present: ["يَنْطَلِقُ بِسُرْعَةٍ.", "Er bricht schnell auf."],
          imperative: ["اِنْطَلِقْ بِسُرْعَةٍ.", "Brich schnell auf."],
        },
      },
      {
        id: "meet",
        pastStem: "اِجْتَمَع",
        presentStem: "جْتَمِع",
        imperativeStem: "اِجْتَمِع",
        presentVowel: "َ",
        meaning: {
          ar: "الاجتماع",
          de: "sich treffen",
        },
        kind: "sound",
        formLength: 5,
        pattern: "اِفْتَعَلَ",
        root: "ج م ع",
        structure: "ثلاثي مزيد",
        example: {
          past: ["اِجْتَمَعَ مَعَ صَدِيقٍ.", "Er traf sich mit einem Freund."],
          present: [
            "يَجْتَمِعُ مَعَ صَدِيقٍ.",
            "Er trifft sich mit einem Freund.",
          ],
          imperative: [
            "اِجْتَمِعْ مَعَ صَدِيقٍ.",
            "Triff dich mit einem Freund.",
          ],
        },
      },
      {
        id: "approach",
        pastStem: "اِقْتَرَب",
        presentStem: "قْتَرِب",
        imperativeStem: "اِقْتَرِب",
        presentVowel: "َ",
        meaning: {
          ar: "الاقتراب",
          de: "sich nähern",
        },
        kind: "sound",
        formLength: 5,
        pattern: "اِفْتَعَلَ",
        root: "ق ر ب",
        structure: "ثلاثي مزيد",
        example: {
          past: ["اِقْتَرَبَ مِنَ الْبَابِ.", "Er näherte sich der Tür."],
          present: ["يَقْتَرِبُ مِنَ الْبَابِ.", "Er nähert sich der Tür."],
          imperative: ["اِقْتَرِبْ مِنَ الْبَابِ.", "Nähere dich der Tür."],
        },
      },
      {
        id: "roll-self",
        pastStem: "تَدَحْرَج",
        presentStem: "تَدَحْرَج",
        imperativeStem: "تَدَحْرَج",
        presentVowel: "َ",
        meaning: {
          ar: "التدحرج",
          de: "sich rollen",
        },
        kind: "sound",
        formLength: 5,
        pattern: "تَفَعْلَلَ",
        root: "د ح ر ج",
        structure: "رباعي مزيد",
        example: {
          past: ["تَدَحْرَجَ بِبُطْءٍ.", "Er rollte sich langsam."],
          present: ["يَتَدَحْرَجُ بِبُطْءٍ.", "Er rollt sich langsam."],
          imperative: ["تَدَحْرَجْ بِبُطْءٍ.", "Rolle dich langsam."],
        },
      },
      {
        id: "use",
        pastStem: "اِسْتَخْدَم",
        presentStem: "سْتَخْدِم",
        imperativeStem: "اِسْتَخْدِم",
        presentVowel: "َ",
        meaning: {
          ar: "الاستخدام",
          de: "benutzen",
        },
        kind: "sound",
        formLength: 6,
        pattern: "اِسْتَفْعَلَ",
        root: "خ د م",
        structure: "ثلاثي مزيد",
        example: {
          past: ["اِسْتَخْدَمَ قَلَمًا.", "Er benutzte einen Stift."],
          present: ["يَسْتَخْدِمُ قَلَمًا.", "Er benutzt einen Stift."],
          imperative: ["اِسْتَخْدِمْ قَلَمًا.", "Benutze einen Stift."],
        },
      },
      {
        id: "receive",
        pastStem: "اِسْتَقْبَل",
        presentStem: "سْتَقْبِل",
        imperativeStem: "اِسْتَقْبِل",
        presentVowel: "َ",
        meaning: {
          ar: "الاستقبال",
          de: "empfangen",
        },
        kind: "sound",
        formLength: 6,
        pattern: "اِسْتَفْعَلَ",
        root: "ق ب ل",
        structure: "ثلاثي مزيد",
        example: {
          past: ["اِسْتَقْبَلَ ضَيْفًا.", "Er empfing einen Gast."],
          present: ["يَسْتَقْبِلُ ضَيْفًا.", "Er empfängt einen Gast."],
          imperative: ["اِسْتَقْبِلْ ضَيْفًا.", "Empfange einen Gast."],
        },
      },
      {
        id: "extract",
        pastStem: "اِسْتَخْرَج",
        presentStem: "سْتَخْرِج",
        imperativeStem: "اِسْتَخْرِج",
        presentVowel: "َ",
        meaning: {
          ar: "الاستخراج",
          de: "entnehmen / extrahieren",
        },
        kind: "sound",
        formLength: 6,
        pattern: "اِسْتَفْعَلَ",
        root: "خ ر ج",
        structure: "ثلاثي مزيد",
        example: {
          past: ["اِسْتَخْرَجَ مَعْلُومَةً.", "Er entnahm eine Information."],
          present: [
            "يَسْتَخْرِجُ مَعْلُومَةً.",
            "Er entnimmt eine Information.",
          ],
          imperative: [
            "اِسْتَخْرِجْ مَعْلُومَةً.",
            "Entnimm eine Information.",
          ],
        },
      },
      {
        id: "seek-forgiveness",
        pastStem: "اِسْتَغْفَر",
        presentStem: "سْتَغْفِر",
        imperativeStem: "اِسْتَغْفِر",
        presentVowel: "َ",
        meaning: {
          ar: "الاستغفار",
          de: "um Vergebung bitten",
        },
        kind: "sound",
        formLength: 6,
        pattern: "اِسْتَفْعَلَ",
        root: "غ ف ر",
        structure: "ثلاثي مزيد",
        example: {
          past: ["اِسْتَغْفَرَ رَبَّهُ.", "Er bat seinen Herrn um Vergebung."],
          present: [
            "يَسْتَغْفِرُ رَبَّهُ.",
            "Er bittet seinen Herrn um Vergebung.",
          ],
          imperative: [
            "اِسْتَغْفِرْ رَبَّكَ.",
            "Bitte deinen Herrn um Vergebung.",
          ],
        },
      },
      {
        id: "enjoy",
        pastStem: "اِسْتَمْتَع",
        presentStem: "سْتَمْتِع",
        imperativeStem: "اِسْتَمْتِع",
        presentVowel: "َ",
        meaning: {
          ar: "الاستمتاع",
          de: "genießen",
        },
        kind: "sound",
        formLength: 6,
        pattern: "اِسْتَفْعَلَ",
        root: "م ت ع",
        structure: "ثلاثي مزيد",
        example: {
          past: ["اِسْتَمْتَعَ بِالْوَقْتِ.", "Er genoss die Zeit."],
          present: ["يَسْتَمْتِعُ بِالْوَقْتِ.", "Er genießt die Zeit."],
          imperative: ["اِسْتَمْتِعْ بِالْوَقْتِ.", "Genieße die Zeit."],
        },
      },
      {
        id: "utilize",
        pastStem: "اِسْتَعْمَل",
        presentStem: "سْتَعْمِل",
        imperativeStem: "اِسْتَعْمِل",
        presentVowel: "َ",
        meaning: {
          ar: "الاستعمال",
          de: "verwenden",
        },
        kind: "sound",
        formLength: 6,
        pattern: "اِسْتَفْعَلَ",
        root: "ع م ل",
        structure: "ثلاثي مزيد",
        example: {
          past: ["اِسْتَعْمَلَ مِفْتَاحًا.", "Er verwendete einen Schlüssel."],
          present: [
            "يَسْتَعْمِلُ مِفْتَاحًا.",
            "Er verwendet einen Schlüssel.",
          ],
          imperative: ["اِسْتَعْمِلْ مِفْتَاحًا.", "Verwende einen Schlüssel."],
        },
      },
    ],
  );
  verbs.push(...[
  {
    "id": "walk",
    "meaning": {
      "ar": "المشي",
      "de": "zu Fuß gehen"
    },
    "kind": "weak",
    "forms": {
      "past": [
        "مَشَيْتُ",
        "مَشَيْنَا",
        "مَشَيْتَ",
        "مَشَيْتِ",
        "مَشَيْتُمَا",
        "مَشَيْتُمَا",
        "مَشَيْتُمْ",
        "مَشَيْتُنَّ",
        "مَشَى",
        "مَشَتْ",
        "مَشَيَا",
        "مَشَتَا",
        "مَشَوْا",
        "مَشَيْنَ"
      ],
      "present": [
        "أَمْشِي",
        "نَمْشِي",
        "تَمْشِي",
        "تَمْشِينَ",
        "تَمْشِيَانِ",
        "تَمْشِيَانِ",
        "تَمْشُونَ",
        "تَمْشِينَ",
        "يَمْشِي",
        "تَمْشِي",
        "يَمْشِيَانِ",
        "تَمْشِيَانِ",
        "يَمْشُونَ",
        "يَمْشِينَ"
      ],
      "imperative": [
        "اِمْشِ",
        "اِمْشِي",
        "اِمْشِيَا",
        "اِمْشُوا",
        "اِمْشِينَ"
      ]
    },
    "example": {
      "past": [
        "مَشَى إِلَى الْمَدْرَسَةِ.",
        "Er ging zu Fuß zur Schule."
      ],
      "present": [
        "يَمْشِي إِلَى الْمَدْرَسَةِ.",
        "Er geht zu Fuß zur Schule."
      ],
      "imperative": [
        "اِمْشِ بِهُدُوءٍ.",
        "Geh ruhig."
      ]
    },
    "note": {
      "ar": "فعل ناقص يائي: تُحذف الياء في اِمْشِ ولَمْ يَمْشِ. ومع واو الجماعة نقول: مَشَوْا، يَمْشُونَ.",
      "de": "Beachte die Stammänderungen in der Tabelle; die Formen sind vollständig ausgeschrieben."
    }
  },
  {
    "id": "call",
    "meaning": {
      "ar": "الدعاء",
      "de": "rufen / bitten"
    },
    "kind": "weak",
    "forms": {
      "past": [
        "دَعَوْتُ",
        "دَعَوْنَا",
        "دَعَوْتَ",
        "دَعَوْتِ",
        "دَعَوْتُمَا",
        "دَعَوْتُمَا",
        "دَعَوْتُمْ",
        "دَعَوْتُنَّ",
        "دَعَا",
        "دَعَتْ",
        "دَعَوَا",
        "دَعَتَا",
        "دَعَوْا",
        "دَعَوْنَ"
      ],
      "present": [
        "أَدْعُو",
        "نَدْعُو",
        "تَدْعُو",
        "تَدْعِينَ",
        "تَدْعُوَانِ",
        "تَدْعُوَانِ",
        "تَدْعُونَ",
        "تَدْعُونَ",
        "يَدْعُو",
        "تَدْعُو",
        "يَدْعُوَانِ",
        "تَدْعُوَانِ",
        "يَدْعُونَ",
        "يَدْعُونَ"
      ],
      "imperative": [
        "اُدْعُ",
        "اُدْعِي",
        "اُدْعُوَا",
        "اُدْعُوا",
        "اُدْعُونَ"
      ]
    },
    "example": {
      "past": [
        "دَعَا صَدِيقَهُ.",
        "Er rief seinen Freund."
      ],
      "present": [
        "يَدْعُو صَدِيقَهُ.",
        "Er ruft seinen Freund."
      ],
      "imperative": [
        "اُدْعُ صَدِيقَكَ.",
        "Ruf deinen Freund."
      ]
    },
    "note": {
      "ar": "فعل ناقص واوي: دَعَا، دَعَوْتُ؛ تُحذف الواو في اُدْعُ ولَمْ يَدْعُ. نون النسوة ثابتة في لَمْ يَدْعُونَ.",
      "de": "Beachte die Stammänderungen in der Tabelle; die Formen sind vollständig ausgeschrieben."
    }
  },
  {
    "id": "extend",
    "meaning": {
      "ar": "المدّ",
      "de": "ausstrecken"
    },
    "kind": "doubled",
    "forms": {
      "past": [
        "مَدَدْتُ",
        "مَدَدْنَا",
        "مَدَدْتَ",
        "مَدَدْتِ",
        "مَدَدْتُمَا",
        "مَدَدْتُمَا",
        "مَدَدْتُمْ",
        "مَدَدْتُنَّ",
        "مَدَّ",
        "مَدَّتْ",
        "مَدَّا",
        "مَدَّتَا",
        "مَدُّوا",
        "مَدَدْنَ"
      ],
      "present": [
        "أَمُدُّ",
        "نَمُدُّ",
        "تَمُدُّ",
        "تَمُدِّينَ",
        "تَمُدَّانِ",
        "تَمُدَّانِ",
        "تَمُدُّونَ",
        "تَمْدُدْنَ",
        "يَمُدُّ",
        "تَمُدُّ",
        "يَمُدَّانِ",
        "تَمُدَّانِ",
        "يَمُدُّونَ",
        "يَمْدُدْنَ"
      ],
      "imperative": [
        "مُدَّ",
        "مُدِّي",
        "مُدَّا",
        "مُدُّوا",
        "اُمْدُدْنَ"
      ]
    },
    "example": {
      "past": [
        "مَدَّ يَدَهُ.",
        "Er streckte seine Hand aus."
      ],
      "present": [
        "يَمُدُّ يَدَهُ.",
        "Er streckt seine Hand aus."
      ],
      "imperative": [
        "مُدَّ يَدَكَ.",
        "Streck deine Hand aus."
      ]
    },
    "note": {
      "ar": "صحيح مضاعف: نفكّ الإدغام مع تاء الفاعل ونون النسوة: مَدَدْتُ، يَمْدُدْنَ. في الأمر مُدَّ، ويجوز اُمْدُدْ. نعرض في الجزم للمفرد الوجه المدغم بالفتح: لَمْ يَمُدَّ.",
      "de": "Beachte die Stammänderungen in der Tabelle; die Formen sind vollständig ausgeschrieben."
    }
  }
]);
  verbs.forEach((verb) => {
    verb.formLength ??= 3;
  });
  verbs.forEach(verb => {
    verb.family = verb.kind === 'weak'
      ? (verb.id === 'stand' ? 'example' : ['say','sleep'].includes(verb.id) ? 'hollow' : 'defective')
      : verb.kind;
  });
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
    const combine = (prefix, stem, suffix) =>
      stem.endsWith("ن") && suffix === "ْنَ"
        ? [prefix, stem.slice(0, -1) + "نَّ", ""]
        : [prefix, stem, suffix];
    if (tense === "past") return combine("", verb.pastStem, person.past);
    if (tense === "present")
      return combine(
        person.present[0][0] + (verb.presentVowel || "َ"),
        verb.presentStem,
        person.present[1],
      );
    const prefix = /^[اأإ]/u.test(verb.imperativeStem)
      ? verb.imperativeStem.slice(0, 2)
      : "";
    return combine(
      prefix,
      verb.imperativeStem.slice(prefix.length),
      commandEndings[commandIndex],
    );
  }
  function conjugate(verb, tense, person) {
    const segments = parts(verb, tense, person);
    return segments ? segments.join("") : null;
  }
  // Person-sensitive mood changes: the feminine-plural Nūn is never removed.
  function inflectedPresent(verb, person, mood) {
    let form = conjugate(verb, 'present', person);
    if ([7,13].includes(person.index)) return form;
    if ([3,4,5,6,10,11,12].includes(person.index))
      return form.replace(/ُونَ$/u, 'ُوا').replace(/ِينَ$/u, 'ِي').replace(/َانِ$/u, 'َا').replace(/آنِ$/u,'آ');
    if (mood === 'subjunctive') {
      if (['walk','call'].includes(verb.id)) return form + 'َ';
      return form.replace(/ُ$/u, 'َ');
    }
    if (verb.id === 'say') return form.replace(/قُولُ$/u,'قُلْ');
    if (verb.id === 'sleep') return form.replace(/نَامُ$/u,'نَمْ');
    if (['walk','call'].includes(verb.id)) return form.slice(0,-1);
    if (verb.id === 'extend') return form.replace(/ُ$/u,'َ');
    return form.replace(/ُ$/u,'ْ');
  }
  function negativeForm(verb, mode, person) {
    if (mode === 'past') return 'مَا ' + conjugate(verb,'past',person);
    if (mode === 'present') return 'لَا ' + conjugate(verb,'present',person);
    if (mode === 'past-lam') return 'لَمْ ' + inflectedPresent(verb,person,'jussive');
    if (mode === 'future') return 'لَنْ ' + inflectedPresent(verb,person,'subjunctive');
    if (mode === 'prohibition') return commandIndices[person.index] === undefined ? null : 'لَا ' + inflectedPresent(verb,person,'jussive');
    return null;
  }
  const data = {
    negativeForm,
    inflectedPresent,
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
