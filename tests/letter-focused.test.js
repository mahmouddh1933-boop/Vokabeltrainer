const { test } = require("node:test");
const assert = require("node:assert/strict");
const { letters } = require("../js/letter-data.js");
const { graphemes } = require("../js/letter-examples.js");
const {
  banks,
  createLetterQuestions,
  wordInfo,
  isCorrectAnswer,
} = require("../js/letter-focused-data.js");
test("All 28 focused banks contain 12 distinct words/targets and 48 exercises each", () => {
  let count = 0;
  for (const l of letters) {
    const bank = banks[l.char];
    assert.equal(bank.length, 12, l.char);
    assert.equal(
      new Set(bank.map((e) => `${e.word}:${e.index}`)).size,
      12,
      l.char,
    );
    for (const e of bank) {
      assert.equal(graphemes(e.word)[e.index], l.char, `${l.char} ${e.word}`);
      assert.ok(e.de);
    }
    for (const [mode, n] of [
      ["forms", 24],
      ["missing", 12],
      ["circle", 12],
    ]) {
      const questions = createLetterQuestions(l.char, mode, () => 0.37);
      count += questions.length;
      assert.equal(questions.length, n);
      assert.equal(new Set(questions.map((q) => q.id)).size, n);
      assert.ok(questions.every((q) => q.letter === l.char));
      if (mode === "forms") {
        assert.equal(questions.filter((q) => q.kind === "shape").length, 12);
        assert.equal(questions.filter((q) => q.kind === "position").length, 12);
        assert.deepEqual(
          new Set(
            questions.filter((q) => q.kind === "shape").map((q) => q.correct),
          ),
          new Set(
            l.nonjoining
              ? ["isolated", "final"]
              : ["initial", "medial", "isolated", "final"],
          ),
        );
      }
      for (const q of questions) {
        if (q.kind === "circle") continue;
        assert.ok(q.options.includes(q.correct));
        assert.equal(new Set(q.options).size, q.options.length);
        assert.ok(isCorrectAnswer(q, q.correct));
        assert.ok(
          !isCorrectAnswer(
            q,
            q.options.find((o) => o !== q.correct),
          ),
        );
        const chars = graphemes(q.masked);
        chars[q.example.index] = l.char;
        assert.equal(chars.join(""), q.example.word);
      }
    }
  }
  assert.equal(count, 1344);
});
test("Written position and connection shape remain distinct, including nonjoining letters", () => {
  const cases = [
    ["ب", "بطة", 0, "start", "initial"],
    ["ب", "جبل", 1, "middle", "medial"],
    ["ب", "باب", 2, "end", "isolated"],
    ["ب", "كلب", 2, "end", "final"],
    ["د", "مدرسة", 1, "middle", "final"],
    ["د", "ورد", 2, "end", "isolated"],
    ["ر", "كرسي", 1, "middle", "final"],
    ["أ", "رأس", 1, "middle", "isolated"],
    ["أ", "نبأ", 2, "end", "final"],
    ["و", "فول", 1, "middle", "final"],
  ];
  for (const [char, word, index, position, shape] of cases) {
    const info = wordInfo(char, { word, index });
    assert.equal(info.position, position, word);
    assert.equal(info.shape, shape, word);
  }
});
test("Circle boards contain 16 independently selectable cells and require exactly all targets", () => {
  for (const char of letters.map((l) => l.char))
    for (const random of [() => 0.01, () => 0.5, () => 0.99]) {
      const questions = createLetterQuestions(char, "circle", random);
      assert.equal(
        new Set(questions.map((q) => q.cells.map((c) => c.glyph).join("")))
          .size,
        12,
      );
      for (const q of questions) {
        assert.equal(q.cells.length, 16);
        assert.ok(q.correct.length >= 4 && q.correct.length <= 6);
        const actual = q.cells.flatMap((c, i) =>
          c.glyph.normalize("NFKC") === char ? [i] : [],
        );
        assert.deepEqual(q.correct, actual);
        assert.ok(isCorrectAnswer(q, [...actual].reverse()));
        assert.ok(!isCorrectAnswer(q, []));
        assert.ok(!isCorrectAnswer(q, actual.slice(1)));
        const other = q.cells.findIndex((c) => c.letter !== char);
        assert.ok(!isCorrectAnswer(q, [...actual, other]));
        assert.ok(!isCorrectAnswer(q, [actual[0], ...actual.slice(0, -1)]));
      }
    }
  assert.throws(() => createLetterQuestions("ب", "names"));
  assert.throws(() => createLetterQuestions("invalid", "forms"));
});
