const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  verbs,
  pronouns,
  imperativePronouns,
  conjugate,
  negativeForm,
} = require("../js/verb-data.js");
const v = (id) => verbs.find((v) => v.id === id);
test("Weak-final and geminate full paradigms preserve independent singular and plural fixtures", () => {
  const examples = {
    walk: ["مَشَى", "مَشَيْتُ", "يَمْشِي", "اِمْشِ"],
    call: ["دَعَا", "دَعَوْتُ", "يَدْعُو", "اُدْعُ"],
    extend: ["مَدَّ", "مَدَدْتُ", "يَمُدُّ", "مُدَّ"],
  };
  for (const [id, want] of Object.entries(examples))
    assert.deepEqual(
      [
        conjugate(v(id), "past", pronouns[8]),
        conjugate(v(id), "past", pronouns[0]),
        conjugate(v(id), "present", pronouns[8]),
        conjugate(v(id), "imperative", pronouns[2]),
      ],
      want,
    );
  assert.equal(conjugate(v("walk"), "past", pronouns[12]), "مَشَوْا");
  assert.equal(conjugate(v("call"), "past", pronouns[12]), "دَعَوْا");
  assert.equal(conjugate(v("extend"), "present", pronouns[13]), "يَمْدُدْنَ");
  assert.equal(conjugate(v("extend"), "imperative", pronouns[7]), "اُمْدُدْنَ");
});
test("Jussive and subjunctive handle hollow shortening, final weak loss and the five verbs", () => {
  const golden = [
    ["write", "past-lam", 8, "لَمْ يَكْتُبْ"],
    ["write", "future", 3, "لَنْ تَكْتُبِي"],
    ["write", "past-lam", 12, "لَمْ يَكْتُبُوا"],
    ["write", "future", 10, "لَنْ يَكْتُبَا"],
    ["say", "past-lam", 0, "لَمْ أَقُلْ"],
    ["sleep", "past-lam", 8, "لَمْ يَنَمْ"],
    ["stand", "past-lam", 8, "لَمْ يَقِفْ"],
    ["walk", "past-lam", 8, "لَمْ يَمْشِ"],
    ["walk", "future", 8, "لَنْ يَمْشِيَ"],
    ["call", "past-lam", 8, "لَمْ يَدْعُ"],
    ["call", "future", 8, "لَنْ يَدْعُوَ"],
    ["call", "past-lam", 12, "لَمْ يَدْعُوا"],
    ["call", "past-lam", 13, "لَمْ يَدْعُونَ"],
    ["walk", "past-lam", 13, "لَمْ يَمْشِينَ"],
    ["extend", "past-lam", 8, "لَمْ يَمُدَّ"],
    ["extend", "past-lam", 13, "لَمْ يَمْدُدْنَ"],
    ["read", "future", 10, "لَنْ يَقْرَآ"],
    ["read", "past-lam", 12, "لَمْ يَقْرَؤُوا"],
  ];
  for (const [id, mode, index, want] of golden)
    assert.equal(
      negativeForm(v(id), mode, pronouns[index]),
      want,
      `${id} ${mode} ${index}`,
    );
});
test("Prohibitions are jussive present with addressed people only, not negated imperative", () => {
  assert.equal(
    negativeForm(v("write"), "prohibition", pronouns[2]),
    "لَا تَكْتُبْ",
  );
  assert.equal(
    negativeForm(v("say"), "prohibition", pronouns[2]),
    "لَا تَقُلْ",
  );
  assert.equal(
    negativeForm(v("walk"), "prohibition", pronouns[2]),
    "لَا تَمْشِ",
  );
  for (const verb of verbs) {
    for (const mode of ["past", "present", "past-lam", "future"])
      for (const person of pronouns)
        assert.ok(
          negativeForm(verb, mode, person) &&
            !negativeForm(verb, mode, person).includes("undefined"),
        );
    for (const person of imperativePronouns)
      assert.ok(negativeForm(verb, "prohibition", person));
    for (const person of [pronouns[0], pronouns[1], ...pronouns.slice(8)])
      assert.equal(negativeForm(verb, "prohibition", person), null);
  }
  assert.deepEqual(
    [...new Set(verbs.map((v) => v.family))].sort(),
    ["sound", "hamzated", "doubled", "example", "hollow", "defective"].sort(),
  );
});
