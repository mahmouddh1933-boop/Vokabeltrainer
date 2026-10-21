const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path");
const D = require("../js/youth-book-two-part-one-data.js");
const root = path.resolve(__dirname, "..");
const task = (id, n) =>
  D.activities.find((a) => a.id === id).tasks.find((q) => q.id === String(n));
const asset = (p) => {
  assert.ok(p && !p.startsWith("/") && !p.includes(".."), p);
  assert.ok(fs.statSync(path.join(root, p)).size > 100, p);
};

test("Book 2 part 1 preserves all six contents titles, page ranges, grammar and sound contrasts", () => {
  assert.deepEqual(
    D.units.map((u) => [u.title, u.pages, u.grammar, u.sounds]),
    [
      ["من أين أنت؟", [6, 11], "حروف الجر", ["ع", "أ"]],
      ["أين تسكن؟", [12, 17], "أدوات الاستفهام", ["س", "ث"]],
      ["كم الساعة الآن؟", [18, 23], "أقسام الكلمة", ["س", "ش"]],
      ["ماذا تفعل في الصباح؟", [24, 29], "الفعل", ["د", "ض"]],
      ["ماذا ستعمل بعد الدراسة؟", [30, 35], "الفاعل", ["ض", "ظ"]],
      ["إلى السوق", [36, 41], "المفعول به", ["ذ", "ظ"]],
    ],
  );
  for (const u of D.units) {
    const activities = D.activities.filter((a) => a.unit === u.number);
    assert.deepEqual([...new Set(activities.map((a) => a.section))].sort(), [
      "dialogue",
      "grammar",
      "reading",
      "sounds",
      "vocabulary",
      "writing",
    ]);
    assert.ok(activities.every((a) => a.id.startsWith("u" + u.number + "-")));
    assert.ok(u.goal && u.summary);
  }
});

test("All 37 source photographs map to real activities in the correct numbered unit", () => {
  assert.equal(D.sources.length, 37);
  assert.equal(new Set(D.sources.map((s) => s.file)).size, 37);
  assert.equal(new Set(D.activities.map((a) => a.id)).size, 49);
  const covered = [];
  for (let i = 0; i < 37; i++) {
    const s = D.sources[i];
    assert.equal(s.photo, "photo-" + String(i + 1).padStart(2, "0"));
    assert.ok(
      s.file.endsWith(".jpeg") && s.topics.length && s.blocks.length,
      s.photo,
    );
    if (i < 36) {
      assert.equal(Number(s.page), i + 6);
      assert.equal(s.unit, Math.floor(i / 6) + 1);
    }
    for (const b of s.blocks) {
      const a = D.activities.find((a) => a.id === b.activity);
      assert.ok(a, b.activity);
      assert.equal(a.source, s.photo);
      assert.equal(a.sourcePage, s.page);
      if (s.unit) assert.equal(a.unit, s.unit);
      covered.push(a.id);
    }
  }
  assert.deepEqual(
    covered.slice().sort(),
    D.activities.map((a) => a.id).sort(),
  );
});

test("All 418 tasks have usable prompts, real grading keys, alternatives and ungraded open models", () => {
  let total = 0;
  const kinds = new Set();
  for (const a of D.activities) {
    assert.ok(a.title && a.instructions && a.tasks.length >= 6, a.id);
    assert.equal(new Set(a.tasks.map((q) => q.id)).size, a.tasks.length, a.id);
    for (const q of a.tasks) {
      total++;
      kinds.add(q.kind);
      const label = a.id + "/" + q.id;
      assert.ok(q.prompt, label);
      if (q.image) asset(q.image);
      if (q.kind === "open") {
        assert.ok(q.model && !q.answer, label);
        assert.equal(D.isCorrect(q, q.model), false, label);
        continue;
      }
      assert.ok(q.explanation, label);
      if (q.kind === "choice") {
        assert.equal(new Set(q.options).size, q.options.length, label);
        assert.ok(q.options.includes(q.answer), label);
        for (const o of q.options)
          assert.equal(D.isCorrect(q, o), o === q.answer, label + " " + o);
      } else if (q.kind === "input" || q.kind === "order") {
        assert.ok(q.answer, label);
        assert.equal(D.isCorrect(q, q.answer), true, label);
        assert.equal(D.isCorrect(q, "إجابة خاطئة"), false, label);
        for (const v of q.accepted || [])
          assert.equal(D.isCorrect(q, v), true, label);
        if (q.kind === "order") {
          const bag = (v) =>
            (q.join === ""
              ? Array.from(D.normalize(v))
              : D.normalize(v).split(" ")
            ).sort();
          const tokens = q.tokens.map(D.normalize).sort();
          for (const v of [q.answer, ...(q.accepted || [])])
            assert.deepEqual(bag(v), tokens, label + " conserves every token");
        }
      } else if (q.kind === "mark") {
        assert.ok(
          q.targets.length &&
            q.targets.every(
              (i) =>
                Number.isInteger(i) && i >= 0 && i < q.text.split(/\s+/).length,
            ),
          label,
        );
        assert.equal(new Set(q.targets).size, q.targets.length, label);
        assert.equal(D.isCorrect(q, q.targets), true, label);
        assert.equal(D.isCorrect(q, []), false, label);
      } else if (q.kind === "clock") {
        assert.ok(
          q.hour >= 1 && q.hour <= 12 && q.minute >= 0 && q.minute < 60,
          label,
        );
        assert.equal(
          D.isCorrect(q, { hour: q.hour, minute: q.minute }),
          true,
          label,
        );
        assert.equal(
          D.isCorrect(q, { hour: (q.hour % 12) + 1, minute: q.minute }),
          false,
          label,
        );
      } else assert.fail("Unsupported task " + label);
    }
  }
  assert.equal(total, 418);
  assert.deepEqual([...kinds].sort(), [
    "choice",
    "clock",
    "input",
    "mark",
    "open",
    "order",
  ]);
});

test("Independent language fixtures distinguish origin, question words, word classes, tense, subject and object", () => {
  for (const [a, n, yes, no] of [
    ["u1-grammar", 8, "من", "إلى"],
    ["u1-patterns", 4, "أنا طالبة جديدة", "أنا طالب جديد"],
    ["u2-grammar", 7, "كم", "أين"],
    ["u2-patterns", 4, "الشقة الخامسة", "الشقة الخامس"],
    ["u3-grammar", 7, "القطار", "وصل"],
    ["u3-patterns", 5, "سأكون مهندسة", "سأكون مهندس"],
    ["u4-grammar", 5, "غسلت", "غسل"],
    ["u4-grammar", 6, "سأدرس", "أدرس"],
    ["u5-grammar", 7, "المحاسب", "التقرير"],
    ["u5-patterns", 4, "هي مهندسة ماهرة", "هي مهندس ماهر"],
    ["u6-grammar", 7, "الماء", "المسافر"],
    ["u6-patterns", 6, "انعطفي يمينًا", "انعطف يمينا"],
  ]) {
    assert.equal(D.isCorrect(task(a, n), yes), true, a + "/" + n);
    assert.equal(D.isCorrect(task(a, n), no), false, a + "/" + n);
  }
  assert.deepEqual(task("u3-grammar", 9).targets, [0, 2, 5]);
  assert.deepEqual(task("u5-grammar", 11).targets, [1, 3]);
  assert.deepEqual(task("u6-grammar", 11).targets, [2, 5]);
  assert.equal(task("u5-grammar", 5).answer, "مبتدأ");
  assert.deepEqual(
    D.activities
      .find((a) => a.id === "u3-clock")
      .tasks.map((q) => [q.hour, q.minute]),
    [
      [7, 0],
      [8, 15],
      [9, 30],
      [10, 45],
      [12, 0],
      [1, 20],
    ],
  );
});

test("Every dialogue, word, reading segment and listening contrast resolves to bundled audio", () => {
  const voiced = new Set();
  for (const a of D.activities) {
    for (const turn of a.dialogue || []) {
      assert.ok(turn.speaker && turn.text);
      voiced.add(turn.text.normalize("NFC"));
    }
    for (const word of a.vocabulary || []) {
      assert.ok(word.ar && word.de && word.meaning);
      if (word.image) asset(word.image);
      voiced.add(word.ar.normalize("NFC"));
    }
    if (a.passage) {
      assert.ok(a.passage.split(/\s+/).length >= 90);
      assert.equal(a.passageLines.join(" "), a.passage.replace(/\s+/g, " "));
      a.passageLines.forEach((s) => voiced.add(s.normalize("NFC")));
    }
    for (const q of a.tasks)
      if (q.audioText) voiced.add(q.audioText.normalize("NFC"));
  }
  assert.deepEqual([...voiced].sort(), Object.keys(D.audio).sort());
  for (const text of voiced) asset(D.audio[text]);
  const m = require("../audio/book-youth-two-part-one-manifest.json");
  assert.equal(m.clips.length, 134);
  for (const clip of m.clips) {
    assert.equal(D.audio[clip.text], clip.path);
    asset(clip.path);
  }
});

test("Optional vocalization does not accept explicitly wrong person or case endings", () => {
  for (const [id, n, yes, no] of [
    ["u4-grammar", 4, "ذَهَبَ", "ذَهَبُ"],
    ["u4-grammar", 5, "غَسَلْتُ", "غَسَلْتَ"],
    ["u5-grammar", 7, "المحاسبُ", "المحاسبَ"],
    ["u6-grammar", 7, "الماءَ", "الماءُ"],
  ]) {
    assert.equal(D.isCorrect(task(id, n), yes), true);
    assert.equal(D.isCorrect(task(id, n), D.normalize(yes)), true);
    assert.equal(D.isCorrect(task(id, n), no), false);
  }
});
