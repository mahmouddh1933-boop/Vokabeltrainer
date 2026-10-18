const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { letters, audio } = require("../js/letter-data.js");
const { modes, createQuestions } = require("../js/letter-training-data.js");
const { examples, graphemes } = require("../js/letter-examples.js");
test("Every letter has four presentation forms and six real, nonempty audio files", () => {
  assert.equal(letters.length, 28);
  assert.equal(new Set(letters.map((l) => l.char)).size, 28);
  assert.equal(Object.keys(audio).length, 168);
  for (const l of letters) {
    assert.equal(l.forms.length, 4);
    for (const form of l.forms) assert.equal(form.normalize("NFKC"), l.char);
    assert.equal(l.nonjoining, ["أ", "د", "ذ", "ر", "ز", "و"].includes(l.char));
    assert.ok(l.name && l.de && l.word && l.meaning);
    for (const text of [
      l.name,
      l.word,
      ...["َ", "ِ", "ُ", "ْ"].map((m) => l.char + m),
    ]) {
      const rel = audio[text.normalize("NFC")];
      assert.ok(rel, text);
      assert.ok(rel.startsWith("audio/letters/"));
      assert.ok(fs.statSync(path.join(__dirname, "..", rel)).size > 500, rel);
    }
  }
  assert.deepEqual(letters.find((l) => l.char === "ب").forms, [
    "ﺑ",
    "ﺒ",
    "ﺏ",
    "ﺐ",
  ]);
  assert.deepEqual(letters.find((l) => l.char === "د").forms, [
    "ﺩ",
    "ﺪ",
    "ﺩ",
    "ﺪ",
  ]);
});
test("Four exercise banks cover all 28 letters, four unique options and balanced positions", () => {
  assert.deepEqual(modes, ["names", "forms", "missing", "listening"]);
  for (const mode of modes)
    for (const fixed of [0.01, 0.31, 0.68, 0.99]) {
      const questions = createQuestions(mode, () => fixed);
      assert.equal(questions.length, 28);
      assert.equal(new Set(questions.map((q) => q.correct)).size, 28);
      for (let position = 0; position < 4; position++)
        assert.equal(
          questions.filter((q) => q.position === position).length,
          7,
        );
      for (const q of questions) {
        assert.equal(new Set(q.options).size, 4);
        assert.ok(q.options.includes(q.correct));
        assert.equal(q.shape.normalize("NFKC"), q.correct);
        const example = examples[q.correct][q.position];
        assert.deepEqual(q.example, example);
        const units = graphemes(example.word);
        assert.equal(units[example.index], q.correct);
        const masked = graphemes(q.masked);
        assert.equal(masked[example.index], "□");
        masked[example.index] = q.correct;
        assert.equal(masked.join(""), example.word);
        assert.ok(
          q.options.every((char) => letters.some((l) => l.char === char)),
        );
      }
    }
  assert.throws(() => createQuestions("vocab"));
});
