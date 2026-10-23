const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const D = require("../js/practice-data.js");
const manifest = require("../audio/practice-manifest.json");

test("Six sound contrasts cover 36 listening questions, both sides and real local audio", () => {
  assert.deepEqual(
    D.sounds.map((g) => g.letters),
    [
      ["ت", "ط"],
      ["س", "ص"],
      ["د", "ض"],
      ["ذ", "ظ"],
      ["ح", "ه"],
      ["ق", "ك"],
    ],
  );
  assert.equal(D.soundQuestions().length, 36);
  assert.equal(new Set(D.soundQuestions().map((q) => q.id)).size, 36);
  for (const group of D.sounds) {
    assert.ok(group.tip.ar && group.tip.de);
    const questions = D.soundQuestions(group.id);
    assert.equal(questions.length, 6);
    assert.equal(questions.filter((q) => q.correct === 0).length, 3);
    assert.equal(questions.filter((q) => q.correct === 1).length, 3);
    for (const q of questions) {
      assert.equal(q.word, q.options[q.correct].ar);
      assert.equal(q.options.length, 2);
      assert.notEqual(q.options[0].ar, q.options[1].ar);
      assert.ok(D.audio[q.word.normalize("NFC")]);
    }
  }
  assert.deepEqual(
    D.sounds[0].pairs[0].map((w) => w.ar),
    ["تِين", "طِين"],
  );
  assert.deepEqual(
    D.sounds[1].pairs[0].map((w) => w.ar),
    ["سَيْف", "صَيْف"],
  );
  assert.deepEqual(
    D.sounds[5].pairs[0].map((w) => w.ar),
    ["قَلْب", "كَلْب"],
  );
});

test("120 sentence activities cover both levels with case-sensitive independent grammatical keys", () => {
  assert.equal(D.sentences.length, 120);
  assert.equal(D.sentences.filter((q) => q.level === "A1").length, 60);
  assert.equal(D.sentences.filter((q) => q.level === "A2").length, 60);
  const canonical = Object.fromEntries(
    D.sentences.map((q) => [q.id, q.words.join(" ")]),
  );
  assert.equal(canonical.s16, "الْكُتُبُ الْجَدِيدَةُ مُفِيدَةٌ");
  assert.equal(canonical.s17, "كَانَ الْجَوُّ بَارِدًا");
  assert.equal(canonical.s18, "إِنَّ الْعِلْمَ نَافِعٌ");
  assert.equal(canonical.s19, "لَنْ أَتَأَخَّرَ عَنِ الدَّرْسِ");
  assert.equal(canonical.s20, "لَمْ يَذْهَبْ خَالِدٌ إِلَى السُّوقِ");
  assert.equal(canonical.s24, "فِي الْحَدِيقَةِ شَجَرَتَانِ كَبِيرَتَانِ");
  assert.equal(
    D.sentences.find((q) => q.id === "s15").transformation.source,
    "هَذَا طَالِبٌ مُجْتَهِدٌ",
  );
  assert.equal(
    D.sentences.find((q) => q.id === "s16").transformation.source,
    "الْكِتَابُ الْجَدِيدُ مُفِيدٌ",
  );
  assert.equal(
    D.sentences.find((q) => q.id === "s24").transformation.source,
    "فِي الْحَدِيقَةِ شَجَرَةٌ كَبِيرَةٌ",
  );
  assert.ok(
    D.sentences
      .find((q) => q.id === "s05")
      .accepted.includes("يَقْرَأُ كِتَابًا الْوَلَدُ"),
  );
  for (const q of D.sentences) {
    assert.ok(q.de && q.explanation.ar && q.explanation.de);
    assert.ok(q.accepted.includes(q.words.join(" ")));
    for (const alternative of q.accepted) {
      assert.equal(alternative.split(" ")[0], q.words[0]);
      assert.deepEqual(alternative.split(" ").sort(), [...q.words].sort());
    }
    assert.ok(D.audio[q.words.join(" ").normalize("NFC")]);
  }
});

test("Six illustrated stories have 36 voiced lines, 24 vocabulary items and independent comprehension keys", () => {
  assert.equal(D.stories.length, 6);
  assert.deepEqual(
    D.stories.map((s) => s.art),
    [0, 1, 2, 3, 4, 5],
  );
  assert.deepEqual(
    D.stories.map((s) => s.questions.map((q) => q.correct)),
    [
      [0, 1, 2, 0],
      [1, 2, 0, 1],
      [2, 0, 1, 2],
      [0, 2, 1, 0],
      [1, 2, 0, 1],
      [2, 0, 1, 2],
    ],
  );
  assert.deepEqual(D.stories[3].questions[1].options[2], {
    ar: "كُرَةً",
    de: "Einen Ball",
  });
  assert.equal(D.stories[3].lines[1].ar, "حَمَلَ عُمَرُ كُرَةً.");
  assert.ok(
    fs.statSync(path.join(__dirname, "../images/stories/scenes.png")).size >
      1000,
  );
  for (const story of D.stories) {
    assert.ok(story.title.ar && story.title.de);
    assert.equal(story.lines.length, 6);
    assert.equal(story.vocabulary.length, 4);
    assert.equal(story.questions.length, 4);
    for (const word of [...story.lines, ...story.vocabulary]) {
      assert.ok(word.ar && word.de);
      assert.ok(D.audio[word.ar.normalize("NFC")]);
    }
    for (const q of story.questions) {
      assert.ok(q.prompt.ar && q.prompt.de);
      assert.equal(q.options.length, 3);
      assert.equal(new Set(q.options.map((o) => o.ar)).size, 3);
      assert.ok(q.correct >= 0 && q.correct < 3);
      assert.ok(story.lines[q.evidence]);
    }
  }
});

test("Every new audio file is represented by exactly one reproducible synthesis input", () => {
  assert.equal(Object.keys(D.audio).length, 216);
  assert.equal(manifest.clips.length, 120);
  assert.equal(new Set(manifest.clips.map((c) => c.path)).size, 120);
  for (const clip of manifest.clips) {
    assert.equal(D.audio[clip.text.normalize("NFC")], clip.path);
    assert.ok(fs.statSync(path.join(__dirname, "..", clip.path)).size > 500);
  }
});
