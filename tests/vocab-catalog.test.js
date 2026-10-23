const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const C = JSON.parse(
  fs.readFileSync(path.join(root, "data/vocab_catalog.json"), "utf8"),
);
const list = (id) => C.lists.find((l) => l.id === id);
const word = (id, ar) =>
  list(id).words.find((w) => w.ar === ar.normalize("NFC"));

test("CEFR curriculum contains exactly 30 complete 20-entry lists at each of four levels", () => {
  assert.deepEqual(C.cefrLevels, ["A1", "A2", "B1", "B2"]);
  assert.deepEqual(
    C.levels.map((l) => l.id),
    C.cefrLevels,
  );
  assert.equal(C.lists.length, 120);
  assert.equal(
    C.lists.reduce((n, l) => n + l.count, 0),
    2400,
  );
  const assigned = [];
  for (const level of C.levels) {
    assert.equal(level.listIds.length, 30);
    assert.equal(new Set(level.listIds).size, 30);
    assert.deepEqual(
      level.listIds,
      Array.from(
        { length: 30 },
        (_, i) => level.id.toLowerCase() + "_" + String(i + 1).padStart(2, "0"),
      ),
    );
    let total = 0;
    for (const [index, id] of level.listIds.entries()) {
      const l = list(id);
      assert.ok(l, id);
      assert.equal(l.level, level.id);
      assert.equal(l.levelOrder, index + 1);
      assert.ok(l.goal && l.title && l.titleDe, id);
      assert.equal(l.count, 20);
      assert.equal(l.words.length, 20);
      total += l.count;
      assigned.push(id);
      assert.equal(new Set(l.words.map((w) => w.ar)).size, 20, id);
      assert.equal(new Set(l.words.map((w) => w.de)).size, 20, id);
      for (const w of l.words) {
        assert.ok(w.de && /[a-zäöüß]/i.test(w.de), id);
        assert.ok(!/[a-z]/i.test(w.ar), w.ar);
        assert.equal(w.ar, w.ar.normalize("NFC"));
      }
    }
    assert.equal(total, 600);
  }
  assert.equal(new Set(assigned).size, 120);
  assert.deepEqual(assigned.slice().sort(), C.lists.map((l) => l.id).sort());
  assert.equal(C.excelUploadWordLimit, null);
});

test("All entries carry vocalization, including consonants, with valid long-vowel and sun-letter exceptions", () => {
  for (const l of C.lists)
    for (const { ar } of l.words) {
      assert.match(ar, /[\u064b-\u0652]/u, l.id + " " + ar);
      for (const token of ar.split(/\s+/)) {
        const gs =
          token.match(/[^\u064b-\u065f\u0670][\u064b-\u065f\u0670]*/gu) || [];
        gs.forEach((g, i) => {
          const b = g[0];
          if (!/[ء-ي]/u.test(b) || "اويىآـ".includes(b) || g.length > 1) return;
          const sunLam =
            b === "ل" &&
            i > 0 &&
            "ال".includes(gs[i - 1][0]) &&
            gs[i + 1]?.includes("ّ");
          assert.ok(
            sunLam || gs[i + 1] === "اً",
            `${l.id}: unvocalized consonant ${g} in ${ar}`,
          );
        });
      }
    }
});

test("HTTP JSON, offline catalog and shared German titles stay identical", () => {
  const context = { window: {} };
  for (const name of ["vocab_catalog_fallback.js", "vocab_catalog_labels.js"])
    vm.runInNewContext(
      fs.readFileSync(path.join(root, "data", name), "utf8"),
      context,
    );
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.window.VOCAB_CATALOG_FALLBACK)),
    C,
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(context.window.VOCAB_CATALOG_META)),
    { lists: 120, words: 2400, levels: 4 },
  );
  for (const l of C.lists)
    assert.equal(context.window.VOCAB_CATALOG_LABELS[l.title], l.titleDe);
  for (const l of C.levels) {
    assert.ok(context.window.VOCAB_CATALOG_LABELS[l.title]);
    assert.ok(context.window.VOCAB_CATALOG_LABELS[l.description]);
  }
});

test("Basic everyday words are in A1 and advanced topics introduce distinct discourse and subject vocabulary", () => {
  assert.equal(word("a1_15", "عَيْنٌ").de, "das Auge");
  assert.equal(word("a1_23", "يَذْهَبُ").de, "gehen");
  assert.equal(word("a1_26", "سَهْلٌ").de, "einfach");
  assert.equal(word("a1_12", "ذُرَةٌ").de, "der Mais");
  assert.equal(word("a2_10", "وَصْفَةٌ طِبِّيَّةٌ").de, "das ärztliche Rezept");
  assert.equal(word("b1_02", "سِيرَةٌ ذَاتِيَّةٌ").de, "der Lebenslauf");
  assert.equal(word("b1_29", "وِجْهَةُ نَظَرٍ").de, "der Standpunkt");
  assert.equal(word("b2_01", "اِنْحِيَازٌ").de, "die Voreingenommenheit");
  assert.equal(word("b2_08", "تَضَخُّمٌ").de, "die Inflation");
  assert.equal(word("b2_30", "مَا لَمْ").de, "sofern nicht");
});

test("Vowel distinctions and contextual polysemy are deliberate rather than duplicate filler", () => {
  assert.ok(word("a1_02", "أَنْتَ"));
  assert.ok(word("a1_02", "أَنْتِ"));
  assert.equal(word("a1_06", "ظُهْرٌ").de, "der Mittag");
  assert.equal(word("a1_15", "ظَهْرٌ").de, "der Rücken");
  assert.equal(word("a2_10", "دُوَارٌ").de, "der Schwindel");
  assert.equal(word("a2_19", "دَوَّارٌ").de, "der Kreisverkehr");
  assert.equal(word("a1_12", "خِيَارٌ").de, "die Gurken");
  assert.equal(word("a2_29", "خِيَارٌ").de, "die Wahlmöglichkeit");
  assert.equal(word("a1_08", "خَطٌّ").de, "die Linie");
  assert.equal(word("a2_18", "خَطٌّ").de, "die Verkehrslinie");
  assert.equal(word("a2_23", "يُسَدِّدُ").de, "auf das Tor schießen");
  assert.equal(word("b1_10", "يُسَدِّدُ").de, "zurückzahlen / begleichen");
  const titles = C.lists.map((l) => l.title);
  assert.equal(new Set(titles).size, 120);
  assert.ok(
    C.lists.every((l) => !/^list_/.test(l.id)),
    "Revised curriculum must not inherit mastery from different legacy list contents",
  );
});

test("The beginner calendar includes all seven weekdays and all twelve months; weather includes all four seasons", () => {
  const months = [
    "كَانُونُ الثَّانِي",
    "شُبَاطُ",
    "آذَارُ",
    "نَيْسَانُ",
    "أَيَّارُ",
    "حَزِيرَانُ",
    "تَمُّوزُ",
    "آبُ",
    "أَيْلُولُ",
    "تِشْرِينُ الْأَوَّلُ",
    "تِشْرِينُ الثَّانِي",
    "كَانُونُ الْأَوَّلُ",
  ];
  assert.deepEqual(
    list("a1_07")
      .words.slice(7, 19)
      .map((w) => w.ar),
    months.map((s) => s.normalize("NFC")),
  );
  assert.equal(word("a1_07", "الِاثْنَيْنِ").de, "Montag");
  const translations = new Set(list("a1_07").words.map((w) => w.de));
  for (const de of [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ])
    assert.ok(translations.has(de), de);
  for (const ar of ["الرَّبِيعُ", "الصَّيْفُ", "الْخَرِيفُ", "الشِّتَاءُ"])
    assert.ok(word("a1_20", ar));
  assert.equal(
    word("b2_23", "يَرْمُزُ إِلَى").de,
    "symbolisieren / stehen für",
  );
});

test("Calendar updates selected built-in words while preserving imported lists and learning records; digits are display aids only", () => {
  const saved = new Map();
  const storage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
  };
  const context = {
    window: { JisrStorage: { local: storage, session: storage } },
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(root, "js/app.js"), "utf8"),
    context,
  );
  const app = context.window.VocabApp;
  const records = {
    totalTests: 27,
    correctAnswers: 99,
    teacherExamsV1: { keep: true },
  };
  app.setJSON("learningStats", records);
  app.saveVocabList(
    [
      ["يَنَايِرُ", "Januar"],
      ["يَوْمُ الِاثْنَيْنِ", "Montag"],
    ],
    { type: "ready-list", id: "a1_07" },
  );
  assert.deepEqual(JSON.parse(JSON.stringify(app.getCurrentVocabList())), [
    ["كَانُونُ الثَّانِي", "Januar"],
    ["الِاثْنَيْنِ", "Montag"],
  ]);
  assert.deepEqual(
    JSON.parse(JSON.stringify(app.getJSON("learningStats"))),
    records,
  );
  app.saveVocabList([["يَنَايِرُ", "Januar"]], { type: "excel", id: "a1_07" });
  assert.equal(app.getCurrentVocabList()[0][0], "يَنَايِرُ");
  const expected = [...Array(14).keys(), 20, 30, 40, 50, 100, 1000];
  list("a1_05").words.forEach((w, i) =>
    assert.equal(app.numberCue(w.ar, w.de), expected[i]),
  );
  assert.equal(app.numberCue("عَيْنٌ", "eins"), null);
  assert.equal(app.numberCue("وَاحِدٌ", "die Einsamkeit"), null);
  assert.ok(
    !app.isCorrect("١", "وَاحِدٌ"),
    "Digits must not replace the word the learner is practising",
  );
  for (const correct of [true, false]) {
    const phrases = Array.from({ length: 8 }, () =>
      app.encouragement(correct, "ar"),
    );
    assert.equal(new Set(phrases).size, 8);
    assert.ok(phrases.every((s) => /[ء-ي]/.test(s)));
    assert.match(app.encouragement(correct, "de"), /[a-z]/i);
  }
});
