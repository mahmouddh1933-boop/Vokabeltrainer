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

const {
  imperativePronouns,
  pronounsFor,
  parts,
} = require("../js/verb-data.js");
test("30 verbs provide 14 past, 14 present and 5 addressed imperative forms", () => {
  assert.equal(verbs.length, 30);
  assert.equal(new Set(verbs.map((v) => v.id)).size, 30);
  assert.equal(pronounsFor("imperative").length, 5);
  assert.deepEqual(
    imperativePronouns.map((p) => p.ar),
    ["أَنْتَ", "أَنْتِ", "أَنْتُمَا", "أَنْتُمْ", "أَنْتُنَّ"],
  );
  let count = 0;
  for (const verb of verbs) {
    for (const tense of ["past", "present", "imperative"]) {
      for (const person of pronounsFor(tense)) {
        const form = conjugate(verb, tense, person);
        assert.ok(
          typeof form === "string" && form.length > 1,
          `${verb.id} ${tense} ${person.ar}`,
        );
        assert.equal(parts(verb, tense, person).join(""), form);
        assert.ok(!form.includes("undefined"));
        count++;
      }
      assert.equal(verb.example[tense].length, 2);
      assert.ok(
        verb.example[tense].every((s) => typeof s === "string" && s.length),
      );
    }
  }
  assert.equal(count, 990);
  for (const person of [pronouns[0], pronouns[1], ...pronouns.slice(8)]) {
    assert.equal(conjugate(verbs[0], "imperative", person), null);
  }
});
test("Independently specified singular commands preserve correct stem and hamzat al-wasl vowel", () => {
  const expected = {
    write: "اُكْتُبْ",
    study: "اُدْرُسْ",
    open: "اِفْتَحْ",
    drink: "اِشْرَبْ",
    play: "اِلْعَبْ",
    hear: "اِسْمَعْ",
    work: "اِعْمَلْ",
    understand: "اِفْهَمْ",
    sit: "اِجْلِسْ",
    exit: "اُخْرُجْ",
    enter: "اُدْخُلْ",
    go: "اِذْهَبْ",
    return: "اِرْجِعْ",
    live: "اُسْكُنْ",
    cook: "اُطْبُخْ",
    wash: "اِغْسِلْ",
    wear: "اِلْبَسْ",
    carry: "اِحْمِلْ",
    ride: "اِرْكَبْ",
    request: "اُطْلُبْ",
    memorize: "اِحْفَظْ",
    draw: "اُرْسُمْ",
    ask: "اِسْأَلْ",
    pay: "اِدْفَعْ",
    eat: "كُلْ",
    take: "خُذْ",
    say: "قُلْ",
    sleep: "نَمْ",
    read: "اِقْرَأْ",
    stand: "قِفْ",
  };
  for (const [id, command] of Object.entries(expected))
    assert.equal(
      conjugate(
        verbs.find((v) => v.id === id),
        "imperative",
        imperativePronouns[0],
      ),
      command,
      id,
    );
});
test("All imperative person/gender forms for sound, hamzated, and weak verbs", () => {
  const expected = {
    write: ["اُكْتُبْ", "اُكْتُبِي", "اُكْتُبَا", "اُكْتُبُوا", "اُكْتُبْنَ"],
    eat: ["كُلْ", "كُلِي", "كُلَا", "كُلُوا", "كُلْنَ"],
    take: ["خُذْ", "خُذِي", "خُذَا", "خُذُوا", "خُذْنَ"],
    say: ["قُلْ", "قُولِي", "قُولَا", "قُولُوا", "قُلْنَ"],
    sleep: ["نَمْ", "نَامِي", "نَامَا", "نَامُوا", "نَمْنَ"],
    read: ["اِقْرَأْ", "اِقْرَئِي", "اِقْرَآ", "اِقْرَؤُوا", "اِقْرَأْنَ"],
    stand: ["قِفْ", "قِفِي", "قِفَا", "قِفُوا", "قِفْنَ"],
  };
  for (const [id, forms] of Object.entries(expected))
    assert.deepEqual(
      imperativePronouns.map((p) =>
        conjugate(
          verbs.find((v) => v.id === id),
          "imperative",
          p,
        ),
      ),
      forms,
      id,
    );
});
test("Hollow past stems and feminine present plural are not generated as sound verbs", () => {
  const say = verbs.find((v) => v.id === "say"),
    sleep = verbs.find((v) => v.id === "sleep");
  assert.deepEqual(
    pronouns.map((p) => conjugate(say, "past", p)),
    [
      "قُلْتُ",
      "قُلْنَا",
      "قُلْتَ",
      "قُلْتِ",
      "قُلْتُمَا",
      "قُلْتُمَا",
      "قُلْتُمْ",
      "قُلْتُنَّ",
      "قَالَ",
      "قَالَتْ",
      "قَالَا",
      "قَالَتَا",
      "قَالُوا",
      "قُلْنَ",
    ],
  );
  assert.deepEqual(
    pronouns.map((p) => conjugate(sleep, "past", p)),
    [
      "نِمْتُ",
      "نِمْنَا",
      "نِمْتَ",
      "نِمْتِ",
      "نِمْتُمَا",
      "نِمْتُمَا",
      "نِمْتُمْ",
      "نِمْتُنَّ",
      "نَامَ",
      "نَامَتْ",
      "نَامَا",
      "نَامَتَا",
      "نَامُوا",
      "نِمْنَ",
    ],
  );
  assert.equal(conjugate(say, "present", pronouns[7]), "تَقُلْنَ");
  assert.equal(conjugate(say, "present", pronouns[13]), "يَقُلْنَ");
  assert.equal(conjugate(sleep, "present", pronouns[7]), "تَنَمْنَ");
  assert.equal(conjugate(sleep, "present", pronouns[13]), "يَنَمْنَ");
});
test("Hamza contractions and final hamza seats survive suffix changes", () => {
  assert.equal(
    conjugate(
      verbs.find((v) => v.id === "eat"),
      "present",
      pronouns[0],
    ),
    "آكُلُ",
  );
  assert.equal(
    conjugate(
      verbs.find((v) => v.id === "take"),
      "present",
      pronouns[0],
    ),
    "آخُذُ",
  );
  const read = verbs.find((v) => v.id === "read");
  assert.deepEqual(
    pronouns.map((p) => conjugate(read, "present", p)),
    [
      "أَقْرَأُ",
      "نَقْرَأُ",
      "تَقْرَأُ",
      "تَقْرَئِينَ",
      "تَقْرَآنِ",
      "تَقْرَآنِ",
      "تَقْرَؤُونَ",
      "تَقْرَأْنَ",
      "يَقْرَأُ",
      "تَقْرَأُ",
      "يَقْرَآنِ",
      "تَقْرَآنِ",
      "يَقْرَؤُونَ",
      "يَقْرَأْنَ",
    ],
  );
  assert.equal(conjugate(read, "past", pronouns[10]), "قَرَآ");
  assert.equal(conjugate(read, "past", pronouns[12]), "قَرَؤُوا");
});
