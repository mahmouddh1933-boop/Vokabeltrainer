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
test("Five complete bilingual lessons, valid highlighted examples, and 20 complete quiz questions", () => {
  assert.deepEqual(
    lessons.map((l) => l.id),
    ["sun-moon", "pronouns", "gender", "number", "basic-verbs"],
  );
  let questionCount = 0;
  for (const lesson of lessons) {
    for (const field of ["title", "summary", "intro", "takeaway"]) {
      assert.ok(lesson[field].ar.length > 0, `${lesson.id} ${field} ar`);
      assert.ok(lesson[field].de.length > 0, `${lesson.id} ${field} de`);
    }
    assert.equal(lesson.questions.length, 4);
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
      assert.equal(
        new Set(question.options.map((o) => (typeof o === "string" ? o : o.ar)))
          .size,
        4,
      );
    }
  }
  assert.equal(questionCount, 20);
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
