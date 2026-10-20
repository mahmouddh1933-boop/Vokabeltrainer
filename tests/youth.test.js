const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const D = require("../js/youth-data.js");
const manifest = require("../audio/youth-manifest.json");
const root = path.resolve(__dirname, "..");
test("Youth units preserve the supplied contents titles, including the absent free-reading title in unit 2", () => {
  assert.deepEqual(
    D.units.map((u) => [
      u.title,
      u.readingTitle,
      u.supplement ? null : u.freeTitle,
    ]),
    [
      ["في القطار", "النقل والمواصلات", "وصلت الطائرة"],
      ["كيف أستخدم القاموس العربي", "أستخدم القاموس العربي", null],
      ["في الفندق", "الفنادق", "بناء البيت"],
      ["ماذا نفعل اليوم؟", "يوم في حياة فاطمة", "تنظيم الوقت"],
      ["كيف نذهب إلى السوق؟", "شرطي المرور", "الإشارات المرورية"],
      ["في سوق الصناعات التقليدية", "سعاد تتسوق", "في المتجر العام"],
      ["الأصدقاء في المطعم", "العم الأكول", "طعام الإفطار"],
      ["أفكر في السفر", "المرشد السياحي", "أسبوع في بكين"],
    ],
  );
  assert.equal(D.units.filter((u) => u.supplement).length, 1);
  assert.equal(D.units[1].freeTitle, "كلمة فتحت بابًا");
});
test("All eight units have real topic-specific content, speaking models, vocabulary and 32 valid scored tasks", () => {
  assert.equal(new Set(D.units.map((u) => u.id)).size, 8);
  for (const unit of D.units) {
    assert.equal(unit.dialogue.length, 12);
    assert.equal(unit.vocabulary.length, 8);
    assert.equal(unit.speaking.length, 6);
    assert.equal(unit.reading.length, 4);
    assert.equal(unit.freeReading.length, 4);
    assert.ok(
      unit.goal && unit.rule && unit.scene && unit.examples.length >= 4,
    );
    unit.speaking.forEach((q) => assert.ok(q.prompt && q.model));
    assert.equal(unit.questions.length, 32);
    assert.equal(new Set(unit.questions.map((q) => q.id)).size, 32);
    assert.deepEqual(
      Object.fromEntries(
        ["vocabulary", "reading", "grammar", "order", "free"].map((s) => [
          s,
          unit.questions.filter((q) => q.section === s).length,
        ]),
      ),
      { vocabulary: 8, reading: 6, grammar: 8, order: 4, free: 6 },
    );
    for (const q of unit.questions) {
      assert.ok(q.prompt && q.explanation);
      assert.ok(D.isCorrect(q, q.answer));
      assert.ok(!D.isCorrect(q, "غير ذلك"));
      if (q.section === "order") assert.equal(q.words.join(" "), q.answer);
      else {
        assert.equal(q.options.length, 3);
        assert.equal(
          new Set(q.options.map(D.normalize)).size,
          3,
          unit.id + ": " + q.id,
        );
        assert.ok(q.options.includes(q.answer));
        q.options
          .filter((o) => o !== q.answer)
          .forEach((o) => assert.ok(!D.isCorrect(q, o), q.id));
      }
    }
    for (const word of unit.vocabulary) {
      assert.ok(word.ar && word.de && word.meaning && word.example);
      if (word.file)
        assert.ok(fs.statSync(path.join(root, word.file)).size > 1000);
      const file = path.join(root, `images/youth/twemoji/${word.icon}.svg`);
      assert.ok(fs.readFileSync(file, "utf8").includes("<svg"));
    }
  }
});
test("Every playable dialogue turn, word and paragraph has a bundled MP3 and matching manifest text", () => {
  const seen = new Set();
  for (const unit of D.units) {
    for (const text of [
      ...unit.dialogue.map((t) => t.text),
      ...unit.vocabulary.map((w) => w.ar),
      ...unit.reading,
      ...unit.freeReading,
    ]) {
      const recording = D.audio[text.normalize("NFC")];
      assert.ok(recording, text);
      assert.ok(fs.statSync(path.join(root, recording)).size > 500, text);
      assert.ok(
        manifest.clips.some((c) => c.text === text && c.path === recording),
      );
      seen.add(text);
    }
  }
  assert.equal(seen.size, 221);
  assert.equal(manifest.clips.length, 221);
  assert.equal(new Set(manifest.clips.map((c) => c.path)).size, 221);
});
test("Sentence comparison accepts optional vocalization and punctuation without changing hamza letters", () => {
  const q = D.units[0].questions.find((q) => q.id === "o1");
  assert.ok(D.isCorrect(q, "أفضل القطار لأنه مريح"));
  assert.ok(!D.isCorrect(q, "افضل القطار لانه مريح"));
});

test("Common valid sentence orders are accepted and use the original word tokens", () => {
  let count = 0;
  for (const unit of D.units)
    for (const q of unit.questions.filter((q) => q.section === "order")) {
      for (const alternative of q.alternatives) {
        assert.ok(D.isCorrect(q, alternative));
        assert.deepEqual(
          D.normalize(alternative).split(" ").sort(),
          D.normalize(q.answer).split(" ").sort(),
          alternative,
        );
        count++;
      }
    }
  assert.equal(count, 24);
});

test("The carpet picture is an actual woven carpet illustration, not the yarn icon", () => {
  const carpet = D.units[5].vocabulary.find((w) => w.ar === "سَجَّادَةٌ");
  assert.equal(carpet.file, "images/youth/carpet.png");
  assert.ok(fs.statSync(path.join(root, carpet.file)).size > 1000);
});
