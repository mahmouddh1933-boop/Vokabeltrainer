const { test } = require("node:test");
const assert = require("node:assert/strict");
const { lessons } = require("../js/grammar-data.js");
const get = (id) => lessons.find((l) => l.id === id);
const answer = (id, index) => {
  const q = get(id).questions[index],
    a = q.options[q.correct];
  return typeof a === "string" ? a : a.ar;
};
test("New curriculum has ten bilingual lessons with examples and 140 questions", () => {
  const ids = [
    "numerals",
    "present-inflection",
    "past-construction",
    "imperative-construction",
    "adjectival-attribute",
    "idafa",
    "purpose-object",
    "absolute-object",
    "apposition",
    "demonstratives",
  ];
  assert.deepEqual(
    lessons.slice(20).map((l) => l.id),
    ids,
  );
  assert.equal(
    ids.reduce((s, id) => s + get(id).questions.length, 0),
    140,
  );
  for (const id of ids) {
    const l = get(id);
    assert.equal(l.category, "syntax");
    assert.ok(l.sections.length >= 3, id);
    for (const s of l.sections) {
      assert.ok(s.body.ar && s.body.de);
      assert.ok(s.examples.length >= 1);
      for (const e of s.examples) {
        assert.ok(e.ar.includes(e.focus), `${id} ${e.ar}`);
        assert.ok(e.de);
      }
    }
  }
});
test("Number agreement, compound twelve and the three tamyiz categories have independent answer keys", () => {
  const expected = [
    "ثَلَاثَةَ",
    "ثَلَاثُ",
    "أَحَدَ عَشَرَ",
    "إِحْدَى عَشْرَةَ",
    "اثْنَا عَشَرَ",
    "اثْنَيْ عَشَرَ",
    "ثَلَاثَةَ عَشَرَ",
    "عِشْرُونَ",
    "ثَلَاثٌ وَعِشْرُونَ",
    "كِتَابٍ",
    "كِتَابٍ",
    "كُتُبٍ",
  ];
  expected.forEach((a, i) =>
    assert.equal(answer("numerals", i), a, `number ${i}`),
  );
});
test("Present covers apparent/estimated endings, five verbs, all jussive deletions and both built forms", () => {
  const expected = [
    "الضمة الظاهرة",
    "ضمة مقدّرة للثقل",
    "ضمة مقدّرة للثقل",
    "للتعذّر على الألف",
    "ثبوت النون",
    "أَكْتُبَ",
    "يَدْعُوَ",
    "يَرْمِيَ",
    "فتحة مقدّرة على الألف",
    "تَكْتُبِي",
    "يَكْتُبْ",
    "يَدْعُ",
    "يَرْمِ",
    "يَسْعَ",
    "يَكْتُبَا",
    "مبني على السكون في محل رفع",
    "مبني على الفتح في محل رفع",
    "مبني على السكون في محل نصب",
    "مبني على الفتح في محل جزم",
    "يَخْرُجْ",
    "فَتَنْدَمَ",
    "أَنْجَحَ",
    "تَدْرُسْ تَنْجَحْ",
    "لا؛ يشترط اتصالها المباشر بالفعل",
  ];
  expected.forEach((a, i) =>
    assert.equal(answer("present-inflection", i), a, `present ${i}`),
  );
  const body = get("present-inflection")
    .sections.map((s) => s.body.ar)
    .join(" ");
  for (const concept of [
    "إذن",
    "لام التعليل",
    "لام الجحود",
    "حتى",
    "فاء السببية",
    "واو المعية",
    "أو بمعنى",
    "لا النافية",
    "المباشرة",
  ])
    assert.ok(body.includes(concept), concept);
});
test("Past construction and imperative distinguish endings, pronouns and request meanings", () => {
  [
    "مبني على الفتح",
    "مبني على الفتح",
    "مبني على الفتح",
    "مبني على السكون",
    "مبني على السكون",
    "مبني على السكون",
    "مبني على السكون",
    "مبني على الضم",
  ].forEach((a, i) => assert.equal(answer("past-construction", i), a));
  assert.equal(
    answer("past-construction", 8),
    "ماضٍ مبني على فتح مقدّر على الألف",
  );
  assert.equal(answer("past-construction", 10), "حرف تأنيث لا محل له");
  assert.equal(answer("past-construction", 11), "ضمير في محل رفع فاعل");
  assert.equal(
    answer("past-construction", 13),
    "ماضٍ مبني على الفتح في محل جزم فعل الشرط",
  );
  const command = [
    "مبني على السكون",
    "مبني على السكون",
    "مبني على السكون",
    "مبني على حذف حرف العلة",
    "مبني على حذف حرف العلة",
    "مبني على حذف حرف العلة",
    "مبني على حذف النون",
    "مبني على حذف النون",
    "مبني على حذف النون",
    "مبني على الفتح",
    "مبني على الفتح",
    "مضارع مجزوم بلام الأمر",
    "نون النسوة: ضمير في محل رفع فاعل",
    "ضمير في محل رفع فاعل",
    "أمر مبني على السكون وحُرّك بالكسر للتخلص من التقاء الساكنين",
    "مضارع مجزوم بلا الناهية",
  ];
  command.forEach((a, i) =>
    assert.equal(answer("imperative-construction", i), a, `imperative ${i}`),
  );
});
test("Noun syntax keys distinguish agreement, genitive links, reason, absolute object and apposition", () => {
  const keys = {
    "adjectival-attribute": [
      [0, "مُجْتَهِدٌ"],
      [1, "مُجْتَهِدًا"],
      [2, "مُجْتَهِدٍ"],
      [3, "الْمُجْتَهِدَةُ"],
      [7, "مُفِيدَةً"],
      [8, "كَرِيمَةٍ"],
      [9, "في محل نصب نعت"],
      [10, "لا؛ خبر للمبتدأ"],
    ],
    idafa: [
      [0, "الطَّالِبِ"],
      [1, "مبتدأ مرفوع وهو مضاف"],
      [5, "كِتَابَا"],
      [6, "مُعَلِّمُو"],
      [7, "ضمير في محل جرّ مضاف إليه"],
      [9, "الْجَدِيدُ"],
      [10, "الْجَدِيدَةِ"],
    ],
    "purpose-object": [
      [0, "رَغْبَةً"],
      [2, "مفعول لأجله منصوب"],
      [5, "حُزْنًا"],
      [6, "اسم مجرور باللام"],
      [7, "فاعل الرغبة غير فاعل الحضور"],
      [11, "حزنًا لأجله، وبكاءً مطلق"],
    ],
    "absolute-object": [
      [0, "رَكْضًا"],
      [1, "مبيّن للنوع"],
      [2, "مبيّن للعدد"],
      [4, "دَقَّتَيْنِ"],
      [6, "نائب عن المفعول المطلق منصوب"],
      [7, "نائب عن المفعول المطلق منصوب"],
      [10, "نعت منصوب للمصدر"],
    ],
    apposition: [
      [0, "بدل مطابق"],
      [1, "بدل بعض من كل"],
      [2, "بدل اشتمال"],
      [3, "نِصْفَهَا"],
      [4, "أُسْلُوبُهُ"],
      [5, "زَيْدٍ"],
      [9, "بدل مباين من الغلط"],
    ],
    demonstratives: [
      [0, "هَذَا"],
      [1, "هَذِهِ"],
      [2, "هَذَانِ"],
      [3, "هَذَيْنِ"],
      [4, "هَاتَانِ"],
      [5, "هَاتَيْنِ"],
      [6, "هَؤُلَاءِ"],
      [7, "تِلْكَ"],
      [8, "أُولَئِكَ"],
      [9, "هَذِهِ"],
      [10, "اسم إشارة مبني في محل نصب مفعول به"],
    ],
  };
  for (const [id, items] of Object.entries(keys))
    for (const [i, a] of items) assert.equal(answer(id, i), a, `${id} ${i}`);
});
test("Revised relative clause examples explicitly identify the sila and overt/implicit return pronouns", () => {
  const section = get("relative-pronouns").sections.at(-1);
  assert.equal(section.title.ar, "صلة الموصول والعائد");
  assert.equal(section.examples.length, 3);
  assert.equal(section.examples[0].ar, "هَذَا الْكِتَابُ الَّذِي قَرَأْتُهُ.");
  assert.equal(section.examples[0].focus, "قَرَأْتُهُ");
  assert.ok(section.examples[0].note.ar.includes("العائد: الهاء"));
  assert.ok(section.examples[1].ar.includes("مَنْ"));
  assert.ok(section.examples[1].note.ar.includes("الضمير المستتر"));
  assert.ok(section.examples[2].ar.includes("مَا"));
  for (const e of section.examples) assert.ok(e.note.ar && e.note.de);
  assert.equal(answer("relative-pronouns", 8), "الهاء في قرأتُهُ");
  assert.equal(answer("relative-pronouns", 9), "جملة قرأتُهُ");
});
