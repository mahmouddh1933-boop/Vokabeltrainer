(() => {
  "use strict";
  const stages = [
    {
      id: "letters",
      href: "letters.html",
      ar: "الحروف وتدريباتها",
      de: "Alphabet und Übungen",
      description: {
        ar: "الحروف وأشكالها وحركاتها، ثم الاختبارات والأصوات المتشابهة.",
        de: "Buchstaben, Formen, Vokale, Tests und ähnliche Laute.",
      },
    },
    {
      id: "reading",
      href: "reading.html",
      ar: "القراءة والهجاء",
      de: "Lesen und Buchstabieren",
      description: {
        ar: "حلّل وحدات النطق، وادمج الحروف، وأكمل الكلمات، واكتشف عائلاتها.",
        de: "Laute gliedern, Buchstaben verbinden, Wörter ergänzen und Wortfamilien entdecken.",
      },
    },
    {
      id: "vocabulary",
      href: "vocabulary.html",
      ar: "المفردات",
      de: "Wortschatz",
      description: {
        ar: "ابدأ بقوائم A1، ثم انتقل إلى A2 وراجع كلماتك بالاختبارات.",
        de: "Beginne mit A1, dann A2. Festige die Wörter mit Tests.",
      },
    },
    {
      id: "skills", href: "skills.html", ar: "المهارات والوحدات A1–A2", de: "Fertigkeiten und Einheiten A1–A2",
      description: {ar: "فهم المسموع والمحادثة والكتابة والتراكيب في ١٢ وحدة مرتبطة بمفرداتك.", de: "Hören, Gespräche, Schreiben und Wortverbindungen in 12 Einheiten mit deinem Wortschatz."},
    },
    {
      id: "sentences",
      href: "sentences.html",
      ar: "تكوين الجمل",
      de: "Sätze bilden",
      description: {
        ar: "١٢٠ تدريبًا على الجمل والأسئلة بمفردات الحياة اليومية في A1 وA2.",
        de: "120 Aufgaben zu Sätzen und Fragen mit Alltagswortschatz in A1 und A2.",
      },
    },
    {
      id: "stories",
      href: "stories.html",
      ar: "قصص قصيرة",
      de: "Kurzgeschichten",
      description: {
        ar: "اقرأ القصص، واستمع إليها، ثم أجب عن أسئلة الفهم.",
        de: "Lies und höre Geschichten und beantworte Verständnisfragen.",
      },
    },
    {
      id: "books",
      href: "books.html",
      ar: "كتب ونصوص وتمارين",
      de: "Bücher, Texte und Übungen",
      description: {
        ar: "أربعة كتب مستقلة للتدرّب على النصوص والمحادثة والكتابة.",
        de: "Vier eigenständige Bücher für Texte, Gespräche und Schreiben.",
      },
    },
    {
      id: "grammar",
      href: "grammar.html",
      ar: "القواعد والإملاء",
      de: "Grammatik und Rechtschreibung",
      description: {
        ar: "اتبع تدرّج دروس القواعد والإملاء، وتدرّب على تصريف الأفعال.",
        de: "Folge dem Grammatikpfad und übe Rechtschreibung und Verbformen.",
      },
    },
  ];
  const groups = {
    "huruf.html": "letters",
    "letter-tests.html": "letters",
    "sounds.html": "letters",
    "lernseite.html": "vocabulary",
    "review.html": "vocabulary",
    "stats.html": "vocabulary",
    "test.html": "vocabulary",
    "verbs.html": "grammar",
    "book-level-two.html": "books",
    "arabic-youth.html": "books",
    "youth-training-two.html": "books",
    "youth-book-two-part-one.html": "books",
  };
  const page = location.pathname.split("/").pop() || "index.html";
  const stage =
    stages.find((s) => s.href === page) ||
    stages.find(
      (s) => s.id === (page.startsWith("test") ? "vocabulary" : groups[page]),
    );
  const state = () => window.VocabApp.getStats().learningRouteV1 || {};
  const update = (patch) => {
    const stats = window.VocabApp.getStats();
    window.VocabApp.setJSON("learningStats", {
      ...stats,
      learningRouteV1: { ...state(), ...patch },
    });
  };
  window.LearningRoute = { stages, stage, state, update };
  function redirectLegacyVocabularyLink() {
    if (page === "index.html" && ["#ready-lists-panel", "#excel-panel"].includes(location.hash)) {
      location.replace("vocabulary.html" + location.hash);
      return true;
    }
    return false;
  }
  window.addEventListener("hashchange", redirectLegacyVocabularyLink);
  window.JisrStorage.ready(() => {
    if (redirectLegacyVocabularyLink()) return;
    if (stage) {
      update({ lastStage: stage.id });
      const bar = document.createElement("nav");
      bar.className = "route-stage-nav";
      bar.setAttribute("aria-label", "مسار التعلم / Lernpfad");
      const i = stages.indexOf(stage);
      for (const [href, ar, de] of [
        [
          i ? stages[i - 1].href : "index.html",
          i ? "الخطوة السابقة" : "مسار التعلم",
          i ? "Voriger Schritt" : "Lernpfad",
        ],
        ["index.html", "المسار الكامل", "Gesamter Lernpfad"],
        [
          i < stages.length - 1 ? stages[i + 1].href : "index.html",
          i < stages.length - 1 ? "الخطوة التالية" : "العودة للمسار",
          i < stages.length - 1 ? "Nächster Schritt" : "Zum Lernpfad",
        ],
      ]) {
        const a = document.createElement("a");
        a.href = href;
        a.dataset.ar = ar;
        a.dataset.de = de;
        a.textContent = ar;
        bar.append(a);
      }
      document.querySelector("main")?.append(bar);
    }
  });
})();
