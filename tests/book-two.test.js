const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const D = require("../js/book-two-data.js");
const { letters } = require("../js/letter-data.js");
const manifest = require("../audio/book-two-manifest.json");

test("The independent second-level book covers every letter with 504 distinct exercises", () => {
  assert.deepEqual(
    D.lessons.map((l) => l.char),
    letters.map((l) => l.char),
  );
  assert.equal(new Set(D.lessons.map((l) => l.id)).size, 28);
  let count = 0;
  for (const lesson of D.lessons) {
    assert.equal(lesson.vocabulary.length, 3);
    assert.equal(lesson.reading.length, 3);
    assert.ok(lesson.grammar.title.ar && lesson.grammar.title.de);
    assert.ok(lesson.grammar.rule.ar && lesson.grammar.rule.de);
    const questions = D.questions(lesson);
    count += questions.length;
    assert.equal(questions.length, 18);
    assert.equal(new Set(questions.map((q) => q.id)).size, 18);
    assert.deepEqual(
      Object.fromEntries(
        ["picture", "spelling", "classify", "reading", "grammar"].map(
          (kind) => [kind, questions.filter((q) => q.kind === kind).length],
        ),
      ),
      { picture: 3, spelling: 3, classify: 6, reading: 2, grammar: 4 },
    );
    for (const q of questions) {
      assert.ok(q.options.includes(q.answer));
      assert.equal(new Set(q.options).size, q.options.length);
      assert.ok(D.isCorrectAnswer(q, q.answer));
      for (const other of q.options.filter((o) => o !== q.answer))
        assert.equal(
          D.isCorrectAnswer(q, other),
          false,
          `${lesson.char}: ${other}`,
        );
      if (q.kind === "classify")
        assert.equal(q.answer, D.letterAtStart(q.word));
      if (q.kind === "spelling")
        assert.equal(q.masked.replace("□", q.answer), q.word);
      if (q.kind === "reading")
        assert.ok(lesson.reading[q.evidence].ar.includes(q.answer));
    }
    for (const word of lesson.vocabulary) {
      assert.equal(D.letterAtStart(word.ar), lesson.char);
      assert.ok(word.de);
      if (word.image.file)
        assert.ok(
          fs.statSync(path.join(__dirname, "..", word.image.file)).size > 100,
        );
      else assert.ok(word.image.sheet >= 0 && word.image.sheet < 6);
    }
  }
  assert.equal(count, 504);
});

test("Lam uses its own vocabulary, Kaf contrast and first-person negation rather than prohibitions", () => {
  const lam = D.lessons.find((l) => l.char === "ل");
  assert.deepEqual(
    lam.vocabulary.map((w) => w.ar),
    ["لَيْمُون", "لِسَان", "لَوْز"],
  );
  assert.equal(lam.contrast, "ك");
  assert.deepEqual(
    lam.grammar.questions.map((q) => q.answer),
    [
      "لَا أَشْرَبُ الْقَهْوَةَ",
      "لَا أَلْعَبُ فِي الشَّارِعِ",
      "لَا أَقْطِفُ الْأَزْهَارَ",
      "لَا أُكْثِرُ مِنَ الْحَلْوَى",
    ],
  );
  assert.ok(D.isCorrectAnswer(lam.grammar.questions[0], "لا أشرب القهوة."));
  assert.equal(
    D.isCorrectAnswer(lam.grammar.questions[0], "لا يشرب القهوة"),
    false,
  );
  const malik = D.lessons.find((l) => l.char === "خ").grammar.questions;
  assert.ok(D.isCorrectAnswer(malik[1], "لَكَ"));
  assert.equal(D.isCorrectAnswer(malik[1], "لَكِ"), false);
  assert.ok(D.isCorrectAnswer(malik[2], "لَكِ"));
  assert.equal(D.isCorrectAnswer(malik[2], "لَكَ"), false);
  assert.ok(
    D.isCorrectAnswer(
      D.lessons.find((l) => l.char === "ق").grammar.questions[0],
      "نعم،أقرأ",
    ),
  );
});

test("168 vocabulary/text clips resolve locally, with 151 new reproducible synthesis inputs", () => {
  assert.equal(Object.keys(D.audio).length, 168);
  assert.equal(manifest.clips.length, 151);
  for (const lesson of D.lessons)
    for (const word of [...lesson.vocabulary, ...lesson.reading]) {
      const file = D.audio[word.ar.normalize("NFC")];
      assert.ok(file, word.ar);
      assert.ok(fs.statSync(path.join(__dirname, "..", file)).size > 500, file);
    }
  for (const clip of manifest.clips)
    assert.equal(D.audio[clip.text.normalize("NFC")], clip.path);
  const zha = D.lessons.find((l) => l.char === "ظ");
  assert.deepEqual(
    zha.vocabulary.map((w) => w.image),
    [{ file: "images/book-two/twemoji/2709.svg" }, { sheet: 0 }, { sheet: 1 }],
  );
  assert.equal(
    D.lessons.find((l) => l.char === "ر").vocabulary[0].image.file,
    "images/letters/10.png",
  );
});
