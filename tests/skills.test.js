const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { createHash } = require("node:crypto");
const D = require("../js/skills-data.js");
const catalog = require("../data/vocab_catalog.json");
const grammar = require("../js/grammar-data.js");
const audio = require("../audio/skills-manifest.json");
test("Integrated units cover every existing A1/A2 list once, without changing words or translations", () => {
  assert.equal(D.units.length, 12);
  for (const level of ["A1", "A2"]) {
    const units = D.units.filter((u) => u.level === level);
    assert.equal(units.length, 6);
    assert.deepEqual(
      units.flatMap((u) => u.listIds).sort(),
      catalog.lists
        .filter((l) => l.level === level)
        .map((l) => l.id)
        .sort(),
    );
    for (const u of units) {
      assert.equal(u.vocabulary.length, 5);
      for (const list of u.vocabulary)
        assert.deepEqual(
          list.words,
          catalog.lists.find((l) => l.id === list.id).words,
        );
    }
  }
  assert.deepEqual(
    D,
    JSON.parse(fs.readFileSync("data/skills/units.json", "utf8")),
  );
});
test("Every unit has a complete learning cycle; questions and grammar targets are valid", () => {
  let tasks = 0;
  const kinds = new Set();
  for (const u of D.units) {
    assert.ok(u.secondDialogue.length >= 4);
    assert.ok(u.dialogue.length >= 4);
    assert.ok(u.dialogue.every((r) => r.speaker && r.text));
    assert.ok(u.reading.length > 150);
    assert.ok(
      grammar.lessons.some((l) => "grammar.html#" + l.id === u.grammar.href),
      u.grammar.href,
    );
    kinds.add(u.listening.kind);
    assert.equal(u.listening.questions.length, 3);
    assert.equal(new Set(u.listening.order).size, 3);
    assert.equal(u.conversation.gaps.length, 3);
    assert.equal(u.conversation.prompts.length, 2);
    assert.ok(
      u.writing.model &&
        u.writing.steps.length === 3 &&
        u.writing.minWords >= 10,
    );
    if (u.writing.image) assert.ok(fs.existsSync(u.writing.image));
    const questions = [
      ...u.listening.questions,
      ...u.readingQuestions,
      ...u.conversation.gaps,
      ...u.collocations.map((c) => c.question),
      ...u.review,
    ];
    for (const q of questions) {
      assert.equal(q.options.length, 3);
      assert.equal(new Set(q.options).size, 3);
      assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 3);
      assert.ok(q.explanation && q.prompt);
    }
    tasks += questions.length + 1;
  }
  assert.equal(tasks, 204);
  assert.equal(kinds.size, 4);
  assert.equal(D.rubric.length, 4);
  assert.deepEqual(
    D.units.filter((u) => u.level === "A1").map((u) => u.writing.kind),
    [
      "جُمْلَةٌ",
      "وَصْفُ صُورَةٍ",
      "فِقْرَةٌ",
      "رِسَالَةٌ شَخْصِيَّةٌ",
      "بَرِيدٌ إِلِكْتُرُونِيٌّ",
      "تَلْخِيصٌ",
    ],
  );
});
test("Independent comprehension and spelling fixtures retain intended answers after build and shuffling", () => {
  const cases = [
    ["a1-01", "listening", 1, "مِنْ لُبْنَانَ"],
    ["a1-03", "listening", 1, "فِي الْخِزَانَةِ"],
    ["a1-04", "listening", 2, "لِأَنَّهُ مَوْجُودٌ فِي بَيْتِهِ"],
    ["a2-01", "listening", 1, "الْخَامِسَةُ"],
    ["a2-04", "listening", 0, "تَغْيِيرُ الرَّصِيفِ فَقَطْ"],
    ["a2-05", "listening", 1, "فِي الثَّامِنَةِ"],
    ["a2-06", "listening", 2, "طَلَبَتِ الْإِعَادَةَ"],
  ];
  for (const [id, section, index, want] of cases) {
    const q = D.units.find((u) => u.id === id)[section].questions[index];
    assert.equal(q.options[q.correct], want);
  }
  const get = (id) => D.units.find((u) => u.id === id);
  assert.equal(
    get("a1-06").readingQuestions[0].options[
      get("a1-06").readingQuestions[0].correct
    ],
    "شَجَرَةً",
  );
  const command = get("a2-04").review.at(-1);
  assert.equal(command.options[command.correct], "أَنْزِلْ حَقِيبَتَكَ.");
  for (const u of D.units) {
    assert.notStrictEqual(u.review[1].options, u.conversation.gaps[0].options);
    assert.notStrictEqual(
      u.review[4].options,
      u.collocations[0].question.options,
    );
  }
});
test("48 local recordings match every complete script and their release hashes", () => {
  assert.equal(audio.clips.length, 48);
  const paths = new Set();
  for (const c of audio.clips) {
    assert.ok(c.duration > 10 && c.duration < 65);
    assert.equal(
      createHash("sha256").update(fs.readFileSync(c.path)).digest("hex"),
      c.sha256,
    );
    paths.add(c.path);
  }
  assert.equal(paths.size, 48);
  for (const u of D.units) {
    assert.equal(
      audio.clips.find((c) => c.path === u.listening.audio).text,
      u.listening.script,
    );
    assert.equal(
      audio.clips.find((c) => c.path === `audio/skills/${u.id}-reading.mp3`)
        .text,
      u.reading,
    );
    assert.equal(
      audio.clips.find((c) => c.path === `audio/skills/${u.id}-dialogue.mp3`)
        .text,
      u.dialogue.map((r) => r.speaker + ": " + r.text).join(" "),
    );
    assert.equal(
      audio.clips.find((c) => c.path === `audio/skills/${u.id}-dialogue-2.mp3`)
        .text,
      u.secondDialogue.map((r) => r.speaker + ": " + r.text).join(" "),
    );
  }
});
