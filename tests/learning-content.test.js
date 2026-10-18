const { test } = require("node:test");
const assert = require("node:assert/strict");
const { examples, nonJoining, graphemes } = require("../js/letter-examples.js");
const {
  lessons,
  sunLetters,
  moonLetters,
  basicVerbs,
} = require("../js/grammar-data.js");

test("All 28 letters have four real examples with the target in the correct position", () => {
  assert.equal(Object.keys(examples).length, 28);
  for (const [letter, forms] of Object.entries(examples)) {
    assert.equal(forms.length, 4, letter);
    for (const [position, example] of forms.entries()) {
      const chars = graphemes(example.word);
      assert.equal(chars[example.index], letter, `${letter}: ${example.word}`);
      assert.ok(example.de.length > 0);
      if (position === 0) assert.equal(example.index, 0);
      if (position === 1) {
        assert.ok(example.index > 0 && example.index < chars.length - 1);
        assert.ok(
          !nonJoining.has(chars[example.index - 1]),
          `Medial target needs a joining predecessor: ${example.word}`,
        );
      }
      if (position === 2) {
        assert.equal(example.index, chars.length - 1);
        assert.ok(
          nonJoining.has(chars[example.index - 1]),
          `Separated final needs a non-joining predecessor: ${example.word}`,
        );
      }
      if (position === 3) {
        assert.equal(example.index, chars.length - 1);
        assert.ok(
          !nonJoining.has(chars[example.index - 1]),
          `Connected final needs a joining predecessor: ${example.word}`,
        );
      }
    }
  }
});
test("Known final-form corrections and diacritic-safe targeting", () => {
  assert.equal(examples["ب"][2].word, "باب");
  assert.equal(examples["ب"][3].word, "كلب");
  assert.equal(examples["و"][2].word, "جرو");
  assert.equal(examples["و"][3].word, "دلو");
  assert.deepEqual(graphemes("كَتَبَ"), ["كَ", "تَ", "بَ"]);
});
test("Sun and moon lists partition the Arabic alphabet correctly", () => {
  assert.equal(sunLetters.length, 14);
  assert.equal(moonLetters.length, 14);
  assert.equal(new Set([...sunLetters, ...moonLetters]).size, 28);
  assert.deepEqual(sunLetters, Array.from("تثدذرزسشصضطظلن"));
  assert.deepEqual(moonLetters, Array.from("أبجحخعغفقكمهوي"));
});
test("20 bilingual lessons, valid highlights, and 240 distinct questions", () => {
  assert.deepEqual(
    lessons.map((l) => l.id),
    [
      "sun-moon",
      "pronouns",
      "gender",
      "number",
      "basic-verbs",
      "hamza-initial",
      "hamza-medial",
      "hamza-final",
      "five-verbs",
      "five-nouns",
      "active-participle",
      "passive-participle",
      "instrument-noun",
      "intensive-participle",
      "word-classes",
      "sentence-types",
      "relative-pronouns",
      "prepositions",
      "defective-verbs",
      "inna-particles",
    ],
  );
  let questionCount = 0;
  for (const lesson of lessons) {
    for (const field of ["title", "summary", "intro", "takeaway"]) {
      assert.ok(lesson[field].ar.length > 0, `${lesson.id} ${field} ar`);
      assert.ok(lesson[field].de.length > 0, `${lesson.id} ${field} de`);
    }
    assert.equal(lesson.questions.length, 12);
    assert.equal(new Set(lesson.questions.map((q) => q.prompt.ar)).size, 12);
    assert.ok(
      ["basics", "spelling", "morphology", "syntax"].includes(lesson.category),
    );
    for (const section of lesson.sections) {
      assert.ok(
        section.title.ar &&
          section.title.de &&
          section.body.ar &&
          section.body.de,
      );
      for (const example of section.examples || [])
        assert.ok(
          example.ar.includes(example.focus),
          `${lesson.id}: ${example.ar}`,
        );
      if (section.table)
        for (const row of section.table.rows)
          assert.equal(row.length, section.table.headers.length);
    }
    for (const question of lesson.questions) {
      questionCount++;
      assert.equal(question.options.length, 4);
      assert.ok(
        Number.isInteger(question.correct) &&
          question.correct >= 0 &&
          question.correct < 4,
      );
      assert.ok(
        question.prompt.ar &&
          question.prompt.de &&
          question.explanation.ar &&
          question.explanation.de,
      );
      for (const lang of ["ar", "de"]) {
        const options = question.options.map((o) =>
          typeof o === "string" ? o : o[lang],
        );
        assert.ok(options.every((o) => typeof o === "string" && o.trim()));
        assert.equal(
          new Set(options).size,
          4,
          `${lesson.id} ${question.prompt.ar} ${lang}`,
        );
      }
    }
  }
  assert.equal(questionCount, 240);
});
test("Key grammar answers and irregular basic verbs are accurate", () => {
  const correct = (lesson, index) =>
    lessons.find((l) => l.id === lesson).questions[index].options[
      lessons.find((l) => l.id === lesson).questions[index].correct
    ];
  assert.equal(correct("sun-moon", 0), "الشَّمْسُ");
  assert.equal(correct("pronouns", 0), "أَنْتُنَّ");
  assert.equal(correct("gender", 0), "هَذِهِ");
  assert.equal(correct("number", 3), "جَدِيدَةٌ");
  assert.equal(correct("basic-verbs", 1), "يَقِفُ");
  assert.equal(correct("basic-verbs", 3), "آكُلُ");
  assert.equal(basicVerbs.length, 12);
  assert.equal(basicVerbs.find((v) => v.past === "وَقَفَ").present, "يَقِفُ");
  assert.equal(basicVerbs.find((v) => v.past === "نَامَ").present, "يَنَامُ");
});

test("Independent spelling keys cover all seats and the long-vowel exceptions", () => {
  const answers = (id) =>
    lessons.find((l) => l.id === id).questions.map((q) => q.options[q.correct]);
  assert.deepEqual(answers("hamza-medial"), [
    "سُئِلَ",
    "رَئِيسٌ",
    "بِئْرٌ",
    "فِئَةٌ",
    "مُؤْمِنٌ",
    "سُؤَالٌ",
    "تَأْكُلُ",
    "سَأَلَ",
    "قِرَاءَةٌ",
    "مُرُوءَةٌ",
    "هَيْئَةٌ",
    "بِيئَةٌ",
  ]);
  assert.deepEqual(answers("hamza-final"), [
    "مَلْجَأ",
    "نَبَأ",
    "بَدَأ",
    "شَاطِئ",
    "قَارِئ",
    "دَافِئ",
    "تَبَاطُؤ",
    "تَكَافُؤ",
    "لُؤْلُؤ",
    "جُزْء",
    "سَمَاء",
    "هُدُوء",
  ]);
  assert.deepEqual(
    answers("hamza-initial").map((a) => a.ar),
    [...Array(6).fill("همزة وصل"), ...Array(6).fill("همزة قطع")],
  );
});
test("New morphology and syntax keys preserve case, voice, and pronoun distinctions", () => {
  const answer = (id, index) => {
    const q = lessons.find((l) => l.id === id).questions[index];
    const a = q.options[q.correct];
    return typeof a === "string" ? a : a.ar;
  };
  const keys = {
    "five-verbs": [
      [1, "يَكْتُبْنَ"],
      [3, "يَكْتُبُوا"],
      [4, "تَكْتُبِي"],
      [5, "يَكْتُبَا"],
      [8, "واو الجماعة: ضمير فاعل"],
    ],
    "five-nouns": [
      [0, "أَبُوكَ"],
      [1, "أَبَاكَ"],
      [2, "أَبِيكَ"],
      [5, "فِيكَ"],
      [8, "ذِي"],
    ],
    "active-participle": [
      [5, "سَامِعٌ"],
      [6, "مُعَلِّمٌ"],
      [9, "مُسْتَخْرِجٌ"],
      [11, "مُدَحْرِجٌ"],
    ],
    "passive-participle": [
      [6, "مُعَلَّمٌ"],
      [9, "مُسْتَخْرَجٌ"],
      [11, "مُدَحْرَجٌ"],
    ],
    "instrument-noun": [
      [0, "مِفْتَاحٌ"],
      [4, "مِقَصٌّ"],
      [10, "غَسَّالَةٌ"],
      [11, "حَاسُوبٌ"],
    ],
    "intensive-participle": [
      [0, "صَبُورٌ"],
      [6, "فَعِلٌ"],
      [8, "كَاتِبٌ"],
    ],
    "word-classes": [
      [2, "اسم"],
      [4, "اسم"],
      [7, "فعل"],
      [10, "حرف"],
    ],
    "sentence-types": [
      [2, "اسمية"],
      [4, "اسمية"],
      [8, "فعلية"],
    ],
    "relative-pronouns": [
      [2, "اللَّذَانِ"],
      [3, "اللَّذَيْنِ"],
      [5, "اللَّتَيْنِ"],
      [7, "اللَّاتِي"],
    ],
    prepositions: [
      [0, "إِلَى"],
      [1, "مِنَ"],
      [9, "الياء"],
      [11, "ضمير متصل في محل جرّ بالباء"],
    ],
    "defective-verbs": [
      [0, "جَمِيلًا"],
      [1, "الطَّالِبُ"],
      [8, "مصدرية ظرفية"],
      [9, "جملة يدرس في محل نصب"],
    ],
    "inna-particles": [
      [0, "الطَّالِبَ"],
      [1, "مُجْتَهِدٌ"],
      [9, "جملة يدرس في محل رفع"],
      [10, "الطَّالِبُ"],
    ],
  };
  for (const [id, items] of Object.entries(keys))
    for (const [index, expected] of items)
      assert.equal(answer(id, index), expected, `${id} ${index}`);
});
