const { test } = require("node:test");
const assert = require("node:assert/strict");
const { verbs, pronouns, conjugate } = require("../js/verb-data.js");

test("كتب: complete past paradigm, including dual and feminine plural", () => {
  assert.deepEqual(
    pronouns.map((person) => conjugate(verbs[0], "past", person)),
    [
      "كَتَبْتُ",
      "كَتَبْنَا",
      "كَتَبْتَ",
      "كَتَبْتِ",
      "كَتَبْتُمَا",
      "كَتَبْتُمَا",
      "كَتَبْتُمْ",
      "كَتَبْتُنَّ",
      "كَتَبَ",
      "كَتَبَتْ",
      "كَتَبَا",
      "كَتَبَتَا",
      "كَتَبُوا",
      "كَتَبْنَ",
    ],
  );
});
test("كتب: complete indicative present paradigm", () => {
  assert.deepEqual(
    pronouns.map((person) => conjugate(verbs[0], "present", person)),
    [
      "أَكْتُبُ",
      "نَكْتُبُ",
      "تَكْتُبُ",
      "تَكْتُبِينَ",
      "تَكْتُبَانِ",
      "تَكْتُبَانِ",
      "تَكْتُبُونَ",
      "تَكْتُبْنَ",
      "يَكْتُبُ",
      "تَكْتُبُ",
      "يَكْتُبَانِ",
      "تَكْتُبَانِ",
      "يَكْتُبُونَ",
      "يَكْتُبْنَ",
    ],
  );
});
test("Different Form I vowel patterns remain correct in past and present", () => {
  const cases = [
    ["study", "دَرَسَ", "دَرَسْتُ", "أَدْرُسُ", "يَدْرُسْنَ"],
    ["open", "فَتَحَ", "فَتَحْتُ", "أَفْتَحُ", "يَفْتَحْنَ"],
    ["drink", "شَرِبَ", "شَرِبْتُ", "أَشْرَبُ", "يَشْرَبْنَ"],
    ["play", "لَعِبَ", "لَعِبْتُ", "أَلْعَبُ", "يَلْعَبْنَ"],
    ["hear", "سَمِعَ", "سَمِعْتُ", "أَسْمَعُ", "يَسْمَعْنَ"],
  ];
  for (const [id, past, pastI, presentI, presentThey] of cases) {
    const verb = verbs.find((item) => item.id === id);
    assert.equal(conjugate(verb, "past", pronouns[8]), past);
    assert.equal(conjugate(verb, "past", pronouns[0]), pastI);
    assert.equal(conjugate(verb, "present", pronouns[0]), presentI);
    assert.equal(conjugate(verb, "present", pronouns[13]), presentThey);
  }
});
