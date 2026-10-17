(() => {
  "use strict";
  // Regular, sound Form I verbs. Stems omit the final inflectional vowel.
  const verbs = [
    {
      id: "write",
      pastStem: "كَتَب",
      presentStem: "كْتُب",
      meaning: { ar: "الكتابة", de: "schreiben" },
      example: {
        past: [
          "كَتَبَ الطَّالِبُ رِسَالَةً.",
          "Der Schüler schrieb einen Brief.",
        ],
        present: [
          "يَكْتُبُ الطَّالِبُ رِسَالَةً.",
          "Der Schüler schreibt einen Brief.",
        ],
      },
    },
    {
      id: "study",
      pastStem: "دَرَس",
      presentStem: "دْرُس",
      meaning: { ar: "الدراسة", de: "lernen / studieren" },
      example: {
        past: [
          "دَرَسَ الطَّالِبُ اللُّغَةَ الْعَرَبِيَّةَ.",
          "Der Schüler lernte Arabisch.",
        ],
        present: [
          "يَدْرُسُ الطَّالِبُ اللُّغَةَ الْعَرَبِيَّةَ.",
          "Der Schüler lernt Arabisch.",
        ],
      },
    },
    {
      id: "open",
      pastStem: "فَتَح",
      presentStem: "فْتَح",
      meaning: { ar: "الفَتْح", de: "öffnen" },
      example: {
        past: ["فَتَحَ الْمُعَلِّمُ الْبَابَ.", "Der Lehrer öffnete die Tür."],
        present: [
          "يَفْتَحُ الْمُعَلِّمُ الْبَابَ.",
          "Der Lehrer öffnet die Tür.",
        ],
      },
    },
    {
      id: "drink",
      pastStem: "شَرِب",
      presentStem: "شْرَب",
      meaning: { ar: "الشُّرْب", de: "trinken" },
      example: {
        past: ["شَرِبَ الطِّفْلُ الْمَاءَ.", "Das Kind trank Wasser."],
        present: ["يَشْرَبُ الطِّفْلُ الْمَاءَ.", "Das Kind trinkt Wasser."],
      },
    },
    {
      id: "play",
      pastStem: "لَعِب",
      presentStem: "لْعَب",
      meaning: { ar: "اللَّعِب", de: "spielen" },
      example: {
        past: [
          "لَعِبَ الْوَلَدُ بِالْكُرَةِ.",
          "Der Junge spielte mit dem Ball.",
        ],
        present: [
          "يَلْعَبُ الْوَلَدُ بِالْكُرَةِ.",
          "Der Junge spielt mit dem Ball.",
        ],
      },
    },
    {
      id: "hear",
      pastStem: "سَمِع",
      presentStem: "سْمَع",
      meaning: { ar: "السَّماع", de: "hören" },
      example: {
        past: [
          "سَمِعَ الطَّالِبُ الصَّوْتَ.",
          "Der Schüler hörte das Geräusch.",
        ],
        present: [
          "يَسْمَعُ الطَّالِبُ الصَّوْتَ.",
          "Der Schüler hört das Geräusch.",
        ],
      },
    },
  ];
  // Two rows each for أنتما and هما make gender distinctions explicit.
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
  function parts(verb, tense, person) {
    if (tense === "past") return ["", verb.pastStem, person.past];
    return [person.present[0], verb.presentStem, person.present[1]];
  }
  function conjugate(verb, tense, person) {
    return parts(verb, tense, person).join("");
  }
  const data = { verbs, pronouns, parts, conjugate };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else window.VerbLessonData = data;
})();
