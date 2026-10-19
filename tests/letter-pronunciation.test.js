const { test } = require("node:test");
const assert = require("node:assert/strict");
const { letters, audio } = require("../js/letter-data.js");
const { clips } = require("../audio/pronunciation-corrections.json");

test("Ambiguous picture words have explicit, matching vocalized recordings", () => {
  for (const [char, expected] of Object.entries({
    ج: "جَمَل", ذ: "ذُرَة", ض: "ضِفْدَع", ظ: "ظَرْف", ع: "عِنَب", ر: "رُمَّان",
  })) {
    const letter = letters.find((l) => l.char === char);
    assert.equal(letter.spokenWord, expected);
    const file = audio[expected.normalize("NFC")];
    assert.equal(file, audio[letter.word]);
    assert.ok(clips.some((c) => c.path === file && c.text === expected));
  }
  assert.ok(clips.some((c) => c.path === audio["التاء"] && c.text === "تَاء"));
  assert.equal(letters.find((l) => l.char === "ر").img, "images/letters/10.png");
});

test("All sukun recordings use a pronounceable context, including hamza, waw and ya", () => {
  for (const letter of letters) {
    const expected = letter.char === "أ" ? "اِقْرَأْ" : `أَ${letter.char}ْ`;
    assert.equal(letter.sukunSample, expected);
    const file = audio[expected.normalize("NFC")];
    assert.ok(file);
    assert.equal(file, audio[(letter.char + "ْ").normalize("NFC")]);
    assert.ok(clips.some((c) => c.path === file && c.text === expected));
  }
  assert.equal(new Set(clips.map((c) => c.path)).size, clips.length);
});
