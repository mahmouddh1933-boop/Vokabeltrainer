/* Criterion-referenced routing within this app. These are provisional teaching rules, not CEFR cut scores. */
(() => {
  "use strict";
  const D =
    typeof module !== "undefined" && module.exports
      ? require("./placement-data.js")
      : window.ArabicPlacementData;
  const byId = new Map(D.questions.map((q) => [q.id, q]));
  const bi = (ar, de) => ({ ar, de });
  const defaults = {
    letters: {
      stage: "letters",
      href: "huruf.html",
      label: bi("بطاقات الحروف وأشكالها", "Buchstabenkarten und Formen"),
    },
    phonics: {
      stage: "reading",
      href: "reading.html?mode=segment",
      label: bi("تقطيع الكلمات وفك الرموز", "Wörter gliedern und dekodieren"),
    },
    vocabulary: {
      stage: "vocabulary",
      href: "vocabulary.html?level=A1",
      label: bi("المفردات الأساسية A1", "Grundwortschatz A1"),
    },
    sentences: {
      stage: "sentences",
      href: "sentences.html?level=A1",
      label: bi("تكوين الجمل الأساسية", "Grundlegender Satzbau"),
    },
    reading: {
      stage: "stories",
      href: "stories.html?level=A1",
      label: bi(
        "قصص قصيرة مع أسئلة الفهم",
        "Kurzgeschichten mit Verständnisfragen",
      ),
    },
    listening: {
      stage: "books",
      href: "arabic-youth.html#unit-1",
      label: bi(
        "كتاب 4: استماع وحوار الوحدة الأولى",
        "Buch 4: Hören und Dialog in Einheit 1",
      ),
    },
    grammar: {
      stage: "grammar",
      href: "grammar.html#word-classes",
      label: bi("مسار القواعد من الأساسيات", "Grammatikpfad ab den Grundlagen"),
    },
    spelling: {
      stage: "grammar",
      href: "grammar.html#ta-endings",
      label: bi(
        "التاء والهمزات والألف اللينة",
        "Tāʾ, Hamza und Alif am Wortende",
      ),
    },
  };
  const grammarIds = [
    "word-classes",
    "sentence-types",
    "pronouns",
    "gender",
    "prepositions",
    "subject-object",
    "number",
    "idafa",
    "adjectival-attribute",
    "defective-verbs",
    "inna-particles",
    "present-inflection",
    "circumstantial",
    "tamyiz",
    "purpose-object",
    "absolute-object",
    "ta-endings",
    "alif-endings",
    "hamza-initial",
    "hamza-medial",
    "hamza-final",
    "hamza-exceptions",
  ];
  const lessons = {
    ...Object.fromEntries(
      grammarIds.map((id) => [
        id,
        {
          stage: "grammar",
          href: "grammar.html#" + id,
          label: bi("راجع الدرس: " + id, "Lektion: " + id),
        },
      ]),
    ),
    letters: defaults.letters,
    "letter-forms": {
      stage: "letters",
      href: "letter-tests.html",
      label: bi("اختبارات أشكال الحروف", "Übungen zu Buchstabenformen"),
    },
    vowels: {
      stage: "letters",
      href: "huruf.html",
      label: bi("الحركات والمدود والشدة", "Vokale, Länge und Verdopplung"),
    },
    ...Object.fromEntries(
      ["segment", "blend", "family"].map((mode, i) => [
        mode,
        {
          stage: "reading",
          href: "reading.html?mode=" + mode,
          label: [
            bi("تقطيع الكلمات", "Wörter gliedern"),
            bi("دمج الحروف", "Buchstaben verbinden"),
            bi("عائلات الكلمات", "Wortfamilien"),
          ][i],
        },
      ]),
    ),
    question: {
      stage: "sentences",
      href: "sentences.html?level=A1&kind=question",
      label: bi("تكوين الأسئلة", "Fragen bilden"),
    },
    negation: {
      stage: "sentences",
      href: "sentences.html?level=A2",
      label: bi("النفي في الجمل", "Verneinung in Sätzen"),
    },
    connectors: {
      stage: "sentences",
      href: "sentences.html?level=A2",
      label: bi("الربط وترتيب الأحداث", "Verknüpfen und Ereignisse ordnen"),
    },
  };
  const names = {
    "word-classes": ["أقسام الكلمة", "Wortarten"],
    "sentence-types": ["الجملة الاسمية والفعلية", "Nominal- und Verbalsätze"],
    pronouns: ["الضمائر", "Pronomen"],
    gender: ["المذكر والمؤنث", "Genus"],
    prepositions: ["حروف الجر", "Präpositionen"],
    "subject-object": ["الفاعل والمفعول به", "Subjekt und Objekt"],
    number: ["المفرد والمثنى والجمع", "Singular, Dual und Plural"],
    idafa: ["الإضافة", "Genitivverbindung"],
    "adjectival-attribute": ["النعت", "Attribut"],
    "defective-verbs": ["كان وأخواتها", "Kāna und ähnliche Verben"],
    "inna-particles": ["إن وأخواتها", "Inna und ähnliche Partikeln"],
    "present-inflection": ["إعراب المضارع", "Präsensflexion"],
    circumstantial: ["الحال", "Zustandsangabe"],
    tamyiz: ["التمييز", "Spezifizierung"],
    "purpose-object": ["المفعول لأجله", "Beweggrund"],
    "absolute-object": ["المفعول المطلق", "Inneres Objekt"],
    "ta-endings": ["التاء المربوطة والمبسوطة", "Tāʾ-Endungen"],
    "alif-endings": ["الألف اللينة", "Alif am Wortende"],
    "hamza-initial": ["همزة القطع والوصل", "Anfangshamza"],
    "hamza-medial": ["الهمزة المتوسطة", "Mittlere Hamza"],
    "hamza-final": ["الهمزة المتطرفة", "Endhamza"],
    "hamza-exceptions": ["حالات الهمزة الخاصة", "Hamza-Sonderfälle"],
  };
  for (const [id, labels] of Object.entries(names))
    lessons[id].label = bi(...labels);
  const vocab = {
    school: ["A1", "a1_16", "المدرسة وأدوات التعلم", "Schule und Lernmittel"],
    adjectives: ["A1", "a1_26", "الصفات الأساسية", "Grundlegende Adjektive"],
    food: ["A1", "a1_11", "الطعام والمطبخ", "Essen und Küche"],
    "family-vocab": ["A1", "a1_04", "الأسرة والأقارب", "Familie und Verwandte"],
    "verbs-vocab": ["A1", "a1_23", "الأفعال الشائعة", "Häufige Verben"],
    health: ["A2", "a2_10", "الطبيب والصيدلية", "Arzt und Apotheke"],
    travel: ["A2", "a2_16", "السفر والحجز", "Reisen und Buchen"],
    shopping: ["A2", "a2_08", "التسوق", "Einkaufen"],
  };
  for (const [tag, [level, list, ar, de]] of Object.entries(vocab))
    lessons[tag] = {
      stage: "vocabulary",
      href: `vocabulary.html?level=${level}&list=${list}`,
      label: bi(ar, de),
    };
  for (const tag of [
    "listen-detail",
    "listen-time",
    "listen-infer",
    "listen-sequence",
    "listen-cause",
  ])
    lessons[tag] = defaults.listening;
  for (const tag of [
    "read-detail",
    "read-reference",
    "read-sequence",
    "read-infer",
  ])
    lessons[tag] = {
      ...defaults.reading,
      href:
        "stories.html?level=" +
        (tag === "read-infer" || tag === "read-sequence" ? "A2" : "A1"),
    };
  function getTest(id) {
    return D.tests.find((t) => t.id === id);
  }
  function questions(attempt) {
    const test = getTest(attempt?.testId);
    return test?.forms[attempt?.form]?.map((id) => byId.get(id)) || [];
  }
  function response(q, a) {
    if (a === "unavailable" && q.domain === "listening") return "unavailable";
    if (a === "unknown") return "unknown";
    if (Number.isInteger(a) && a >= 0 && a < q.options.length)
      return a === q.correct ? "correct" : "wrong";
    return "pending";
  }
  function createAttempt(testId, form, now = Date.now(), id) {
    const t = getTest(testId);
    if (!t?.forms[form]) throw new Error("Unknown test/form");
    return {
      id:
        id ||
        "p-" +
          (globalThis.crypto?.randomUUID?.() ||
            now.toString(36) + "-" + Math.random().toString(36).slice(2)),
      testId,
      form,
      bankVersion: D.bankVersion,
      startedAt: now,
      index: 0,
      answers: {},
      heard: {},
      replays: {},
      status: "draft",
    };
  }
  function score(attempt) {
    const bank = questions(attempt);
    const result = {
      total: bank.length,
      correct: 0,
      valid: 0,
      unavailable: 0,
      pending: 0,
      domains: {},
      lessons: [],
    };
    const tags = new Map();
    for (const q of bank) {
      const a = attempt.answers?.[q.id],
        kind = response(q, a);
      const d = (result.domains[q.domain] ||= {
        id: q.domain,
        total: 0,
        valid: 0,
        correct: 0,
        unknown: 0,
        unavailable: 0,
        pending: 0,
        bands: {},
      });
      d.total++;
      if (kind === "pending") {
        d.pending++;
        result.pending++;
        continue;
      }
      if (kind === "unavailable") {
        d.unavailable++;
        result.unavailable++;
        continue;
      }
      d.valid++;
      result.valid++;
      const band = (d.bands[q.band] ||= { valid: 0, correct: 0 });
      band.valid++;
      if (kind === "correct") {
        d.correct++;
        result.correct++;
        band.correct++;
      } else {
        if (kind === "unknown") d.unknown++;
        tags.set(q.lesson, (tags.get(q.lesson) || 0) + 1);
      }
    }
    for (const d of Object.values(result.domains)) {
      d.ratio = d.valid ? d.correct / d.valid : null;
      d.status =
        d.valid < Math.min(d.total, attempt.testId === "quick" ? 2 : 6)
          ? "insufficient"
          : attempt.testId === "quick"
            ? d.correct === 2
              ? "initial-ready"
              : "initial-gap"
            : d.ratio >= 0.75
              ? "ready"
              : d.ratio >= 0.5
                ? "developing"
                : "practice";
    }
    result.lessons = [...tags]
      .sort((a, b) => b[1] - a[1])
      .map(([tag, errors]) => ({ ...lessons[tag], tag, errors }));
    const order = [
      "letters",
      "phonics",
      "vocabulary",
      "sentences",
      "reading",
      "listening",
      "grammar",
      "spelling",
    ];
    const weak = order
      .map((id) => result.domains[id])
      .find(
        (d) =>
          d && ["initial-gap", "practice", "developing"].includes(d.status),
      );
    const valid = Object.values(result.domains).filter(
      (d) => d.status !== "insufficient",
    );
    result.primary = weak
      ? { ...defaults[weak.id], domain: weak.id }
      : valid.length
        ? {
            stage: "books",
            href: "books.html",
            label: bi("نصوص الكتب وتطبيق اللغة", "Buchtexte und Sprachpraxis"),
            domain: null,
          }
        : null;
    if (weak) {
      const firstGap = bank.find(
        (q) =>
          q.domain === weak.id &&
          ["wrong", "unknown"].includes(response(q, attempt.answers?.[q.id])),
      );
      const target = firstGap && lessons[firstGap.lesson];
      if (target && target.stage === defaults[weak.id].stage)
        result.primary = { ...target, domain: weak.id };
    }
    // A focused test only diagnoses its sampled skills; it never certifies earlier stages.
    if (!weak && valid.length && attempt.testId !== "quick") {
      result.primary =
        attempt.testId === "foundations"
          ? { ...defaults.vocabulary }
          : attempt.testId === "language"
            ? { ...defaults.reading, href: "stories.html?level=A2" }
            : attempt.testId === "comprehension"
              ? {
                  stage: "books",
                  href: "books.html",
                  label: bi("قراءة نصوص الكتب", "Buchtexte lesen"),
                }
              : {
                  stage: "grammar",
                  href: "grammar.html",
                  label: bi(
                    "توسيع القواعد مع النصوص",
                    "Grammatik im Text vertiefen",
                  ),
                };
    }
    result.confirmTest =
      attempt.testId === "quick"
        ? weak
          ? {
              letters: "foundations",
              phonics: "foundations",
              vocabulary: "language",
              sentences: "language",
              listening: "comprehension",
              reading: "comprehension",
              grammar: "structures",
              spelling: "structures",
            }[weak.id]
          : "comprehension"
        : null;
    result.insufficient = Object.values(result.domains)
      .filter((d) => d.status === "insufficient")
      .map((d) => d.id);
    result.unmeasured = Object.keys(D.domains).filter(
      (id) => !result.domains[id],
    );
    return result;
  }
  function finish(attempt, now = Date.now()) {
    if (attempt.status === "finished") return attempt;
    if (attempt.bankVersion !== D.bankVersion)
      throw new Error("Bank version mismatch");
    const result = score(attempt);
    if (result.pending) throw new Error("Answer or explicitly skip every item");
    return { ...attempt, status: "finished", finishedAt: now, result };
  }
  const api = {
    data: D,
    byId,
    lessons,
    defaults,
    getTest,
    questions,
    response,
    createAttempt,
    score,
    finish,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.Placement = api;
})();
