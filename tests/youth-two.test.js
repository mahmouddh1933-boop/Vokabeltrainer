const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const D = require("../js/youth-two-data.js");
const root = path.resolve(__dirname, "..");
const activity = (id) => {
  const result = D.activities.find((a) => a.id === id);
  assert.ok(result, `Missing activity ${id}`);
  return result;
};
const task = (activityId, taskId) => {
  const result = activity(activityId).tasks.find(
    (t) => t.id === String(taskId),
  );
  assert.ok(result, `Missing task ${activityId}/${taskId}`);
  return result;
};
const asset = (relative) => {
  assert.equal(typeof relative, "string");
  assert.ok(
    !path.isAbsolute(relative) && !relative.split("/").includes(".."),
    relative,
  );
  const file = path.join(root, relative);
  assert.ok(fs.statSync(file).isFile(), relative);
  assert.ok(fs.statSync(file).size > 100, relative);
};

test("Youth 2 covers each of the 31 uploaded photos and every declared source block exactly once", () => {
  assert.deepEqual(
    D.sources.map((s) => s.photo),
    Array.from(
      { length: 31 },
      (_, i) => `photo-${String(i + 1).padStart(2, "0")}`,
    ),
  );
  assert.equal(new Set(D.sources.map((s) => s.file)).size, 31);
  assert.equal(
    new Set(D.activities.map((a) => a.id)).size,
    D.activities.length,
  );
  const listed = [];
  for (const source of D.sources) {
    assert.ok(source.file.endsWith(".jpeg"));
    assert.ok(
      Array.isArray(source.topics) && source.topics.length > 0,
      source.photo,
    );
    assert.ok(source.blocks.length > 0, source.photo);
    assert.equal(
      new Set(source.blocks.map((b) => b.id)).size,
      source.blocks.length,
    );
    for (const block of source.blocks) {
      assert.ok(block.title && block.id);
      const a = activity(block.activity);
      assert.equal(a.source, source.photo, block.id);
      assert.equal(a.sourcePage, source.page, block.id);
      listed.push(a.id);
    }
  }
  assert.equal(
    new Set(listed).size,
    listed.length,
    "Source blocks may not silently share one replacement activity",
  );
  assert.deepEqual(listed.slice().sort(), D.activities.map((a) => a.id).sort());
});

test("All new activities have usable instructions, sufficient tasks, distinct IDs, valid choices and checked-answer data", () => {
  const categories = new Set([
    "vocabulary",
    "grammar",
    "reading",
    "writing",
    "speaking",
  ]);
  const kinds = new Set(["choice", "input", "order", "open", "mark", "clock"]);
  const seenKinds = new Set();
  let checked = 0,
    open = 0;
  for (const a of D.activities) {
    assert.ok(categories.has(a.category), a.id);
    assert.ok(a.title && a.instructions && a.rule && a.sourceExercise, a.id);
    assert.ok(
      a.examples.length > 0 &&
        a.examples.every((e) => typeof e === "string" && e.trim()),
      a.id,
    );
    assert.ok(
      a.tasks.length >= 6,
      `${a.id}: every block needs a real set of new tasks`,
    );
    assert.equal(new Set(a.tasks.map((t) => t.id)).size, a.tasks.length, a.id);
    if (a.diagram) asset(a.diagram.file);
    for (const t of a.tasks) {
      const label = `${a.id}/${t.id}`;
      assert.ok(kinds.has(t.kind), label);
      seenKinds.add(t.kind);
      assert.ok(t.prompt && t.explanation, label);
      if (t.image) asset(t.image);
      if (t.kind === "open") {
        open++;
        assert.ok(t.model && !t.answer, label);
        assert.equal(D.isCorrect(t, t.model), false, label);
        assert.equal(D.isCorrect(t, ""), false, label);
        continue;
      }
      checked++;
      if (t.kind === "choice") {
        assert.ok(t.options.length >= 2, label);
        assert.equal(new Set(t.options).size, t.options.length, label);
        assert.ok(t.options.includes(t.answer), label);
        assert.equal(D.isCorrect(t, t.answer), true, label);
        for (const other of t.options.filter((o) => o !== t.answer))
          assert.equal(D.isCorrect(t, other), false, `${label}: ${other}`);
      } else if (t.kind === "input" || t.kind === "order") {
        assert.equal(typeof t.answer, "string", label);
        assert.ok(t.answer.trim(), label);
        assert.equal(D.isCorrect(t, t.answer), true, label);
        assert.equal(D.isCorrect(t, "إجابة لا تناسب هذا السؤال"), false, label);
        for (const accepted of t.accepted || [])
          assert.equal(D.isCorrect(t, accepted), true, `${label}: ${accepted}`);
      } else if (t.kind === "mark") {
        const words = t.text.trim().split(/\s+/);
        assert.ok(words.length > 1, label);
        assert.ok(t.targets.length > 0, label);
        assert.equal(new Set(t.targets).size, t.targets.length, label);
        assert.ok(
          t.targets.every(
            (i) => Number.isInteger(i) && i >= 0 && i < words.length,
          ),
          label,
        );
        assert.equal(D.isCorrect(t, t.targets), true, label);
      } else {
        assert.ok(
          Number.isInteger(t.hour) && t.hour >= 1 && t.hour <= 12,
          label,
        );
        assert.ok(
          Number.isInteger(t.minute) && t.minute >= 0 && t.minute < 60,
          label,
        );
        assert.equal(
          D.isCorrect(t, { hour: t.hour, minute: t.minute }),
          true,
          label,
        );
      }
    }
  }
  assert.deepEqual([...seenKinds].sort(), [...kinds].sort());
  assert.ok(checked > 300 && open >= 20, { checked, open });
});

test("Independent morphology keys distinguish dual/plural and changes to gender and person", () => {
  const fixtures = [
    ["a-p05-b2", "1", "معلمان", "معلمون"],
    ["a-p05-b2", "2", "معلمون", "معلمان"],
    ["a-p05-b2", "3", "طالبتان", "طالبات"],
    ["a-p05-b2", "4", "طالبات", "طالبتان"],
    ["a-p05-b2", "6", "عمال", "عاملان"],
    ["a-p05-b2", "8", "مدن", "مدينتان"],
    ["a-p05-b2", "12", "أشجار", "شجرتان"],
    ["a-p03-b2", "2", "نحن", "هم"],
    ["a-p03-b2", "5", "أنتما", "هما"],
    ["a-p03-b2", "7", "أنتن", "هن"],
    ["a-p03-b2", "9", "هما", "أنتما"],
    ["a-p03-b2", "10", "هن", "هم"],
    ["b-p11-b2", "1", "يسمع", "سمع"],
    ["b-p11-b2", "2", "اسمع", "يسمع"],
    ["b-p11-b2", "3", "يرسم", "يرسمون"],
    ["b-p11-b2", "4", "ارسم", "رسم"],
    ["b-p11-b2", "5", "يحمل", "حمل"],
    ["b-p16-b1", "3", "هي مهندسة", "هو مهندس"],
    ["b-p16-b1", "6", "هي رسامة", "هو رسام"],
    ["c-p18-b2", "2", "أنت ترتب غرفتك", "أنت ترتب غرفتي"],
    ["c-p18-b2", "4", "أنت تنظف حذاءك", "أنا أنظف حذائي"],
    ["d-p27-b1", "4", "ليلى طبيبة مجتهدة", "ليلى طبيب مجتهد"],
  ];
  for (const [a, id, correct, wrong] of fixtures) {
    assert.equal(
      D.isCorrect(task(a, id), correct),
      true,
      `${a}/${id}: ${correct}`,
    );
    assert.equal(
      D.isCorrect(task(a, id), wrong),
      false,
      `${a}/${id}: ${wrong}`,
    );
  }
});

test("A nominal sentence with a verbal predicate remains nominal; verbs and subjects are marked independently", () => {
  assert.equal(
    D.isCorrect(task("a-p08-b2", "3"), "اسمية"),
    true,
    "هو يساعد جاره",
  );
  assert.equal(D.isCorrect(task("a-p08-b2", "3"), "فعلية"), false);
  assert.equal(
    D.isCorrect(task("a-p08-b2", "5"), "اسمية"),
    true,
    "الحديقة تمتلئ بالزوار",
  );
  assert.equal(D.isCorrect(task("a-p08-b2", "5"), "فعلية"), false);
  assert.equal(
    D.isCorrect(task("a-p08-b2", "4"), "فعلية"),
    true,
    "ساعد الجار صديقه",
  );
  const twoVerbs = task("a-p08-b1", "3");
  assert.deepEqual(twoVerbs.targets, [0, 2]);
  assert.deepEqual(
    twoVerbs.text
      .split(/\s+/)
      .filter((_, i) => twoVerbs.targets.includes(i))
      .map(D.normalize),
    ["وصل", "وغادر"],
  );
  assert.equal(D.isCorrect(twoVerbs, [2, 0]), true);
  assert.equal(D.isCorrect(twoVerbs, [0]), false, "All verbs are required");
  assert.equal(
    D.isCorrect(twoVerbs, [0, 2, 3]),
    false,
    "Extra selections are wrong",
  );
  assert.equal(
    D.isCorrect(twoVerbs, [0, 2, 2]),
    false,
    "Duplicate selections are rejected",
  );
  assert.equal(
    D.isCorrect(twoVerbs, ["0", "2"]),
    false,
    "Word indices must be integers",
  );
  const subject = task("b-p13-b2", "3");
  assert.deepEqual(subject.targets, [3]);
  assert.equal(D.normalize(subject.text.split(/\s+/)[3]), "المدير");
  assert.equal(D.isCorrect(subject, [3]), true);
  assert.equal(D.isCorrect(subject, [2]), false, "The verb is not the subject");
});

test("The final distinguishing vowel in كَ/كِ is required while other vocalization remains optional", () => {
  const male = task("b-p11-b1", "2"),
    female = task("b-p11-b1", "3");
  assert.equal(male.preserveDiacritics, true);
  assert.equal(female.preserveDiacritics, true);
  assert.equal(D.isCorrect(male, "حقيبتكَ"), true);
  assert.equal(D.isCorrect(male, "حَقِيبَتُكَ"), true);
  assert.equal(D.isCorrect(male, "«حَقِيبَتُكَ.»"), true);
  assert.equal(D.isCorrect(male, "حقيبتكِ"), false);
  assert.equal(D.isCorrect(male, "حقيبتك"), false);
  assert.equal(D.isCorrect(female, "حقيبتكِ"), true);
  assert.equal(D.isCorrect(female, "حَقِيبَتُكِ"), true);
  assert.equal(D.isCorrect(female, "حقيبتكَ"), false);
  assert.equal(D.isCorrect(female, "حقيبتك"), false);
  assert.equal(D.ending("«مِفْتَاحُكِ.»"), "ِ");
  assert.equal(D.ending("مفتاحكَ،"), "َ");
  assert.equal(D.ending("مفتاحك"), "");
});

test("Word and letter assembly conserve the supplied tokens, including valid alternative word orders", () => {
  let wordOrders = 0,
    letterOrders = 0;
  for (const a of D.activities)
    for (const t of a.tasks.filter((t) => t.kind === "order")) {
      const label = `${a.id}/${t.id}`;
      assert.ok(t.tokens.length >= 2, label);
      assert.equal(
        D.normalize(t.tokens.join(D.joiner(t))),
        D.normalize(t.answer),
        label,
      );
      const isLetters = D.joiner(t) === "";
      if (isLetters) letterOrders++;
      else wordOrders++;
      const bag = (value) =>
        isLetters
          ? Array.from(D.normalize(value).replace(/\s+/g, "")).sort()
          : D.normalize(value).split(/\s+/).sort();
      assert.deepEqual(bag(t.answer), bag(t.tokens.join(D.joiner(t))), label);
      for (const alternative of t.accepted || [])
        assert.deepEqual(
          bag(alternative),
          bag(t.answer),
          `${label}: ${alternative}`,
        );
    }
  assert.ok(wordOrders >= 12 && letterOrders >= 18, {
    wordOrders,
    letterOrders,
  });
  const letters = task("c-p23-b1", "1");
  assert.equal(D.joiner(letters), "");
  assert.equal(D.isCorrect(letters, "كتاب"), true);
  assert.equal(
    D.isCorrect(letters, "ك ت ا ب"),
    false,
    "Letters must also be joined into a word",
  );
  assert.equal(
    D.joiner(task("d-p26-b1", "1")),
    "",
    "The join property and joiner property are both supported",
  );
  assert.equal(
    D.isCorrect(task("c-p22-b3", "1"), "في الساعة الثامنة صباحا تبدأ الدراسة"),
    true,
  );
});

test("Clock answers distinguish hour, half, quarter and quarter-to and reject malformed values", () => {
  const expected = [
    [2, 0],
    [5, 0],
    [8, 0],
    [10, 0],
    [3, 30],
    [6, 15],
    [9, 45],
    [12, 0],
  ];
  const clocks = activity("c-p21-b1").tasks;
  assert.equal(clocks.length, expected.length);
  expected.forEach(([hour, minute], i) => {
    const q = clocks[i];
    assert.equal(q.hour, hour);
    assert.equal(q.minute, minute);
    assert.equal(D.isCorrect(q, { hour, minute }), true);
    assert.equal(D.isCorrect(q, { hour, minute: (minute + 5) % 60 }), false);
    assert.equal(
      D.isCorrect(q, { hour: hour === 12 ? 1 : hour + 1, minute }),
      false,
    );
    for (const invalid of [
      null,
      {},
      "3:30",
      { hour: String(hour), minute },
      { hour, minute: String(minute) },
      { hour: 0, minute },
      { hour: 13, minute },
      { hour, minute: 60 },
    ])
      assert.equal(D.isCorrect(q, invalid), false, JSON.stringify(invalid));
  });
});

test("Every listening item maps the requested Arabic sound to an existing bundled MP3", () => {
  const expected = [
    ["سَمَكَة", "س"],
    ["شَمْس", "ش"],
    ["سَيَّارَة", "س"],
    ["شَجَرَة", "ش"],
    ["سَاعَة", "س"],
    ["شَمْعَة", "ش"],
  ];
  const listening = activity("c-p23-b2").tasks;
  assert.equal(listening.length, expected.length);
  expected.forEach(([text, letter], i) => {
    const q = listening[i];
    assert.equal(q.audioText, text);
    assert.equal(q.answer, letter);
    assert.equal(D.isCorrect(q, letter), true);
    assert.equal(D.isCorrect(q, letter === "س" ? "ش" : "س"), false);
    const file = D.audio[q.audioText.normalize("NFC")];
    assert.ok(file.endsWith(".mp3"));
    assert.equal(file, q.audio);
    asset(file);
  });
  for (const a of D.activities)
    for (const q of a.tasks.filter((q) => q.audioText)) {
      assert.ok(D.audio[q.audioText.normalize("NFC")], `${a.id}/${q.id}`);
      asset(D.audio[q.audioText.normalize("NFC")]);
    }
});

test("The anatomy exercise retains all eight organs, correct patient-side labels and its bundled diagram", () => {
  const anatomy = activity("a-p06-b1");
  const organs = {
    heart: "القلب",
    "right-lung": "الرئة اليمنى",
    "left-lung": "الرئة اليسرى",
    liver: "الكبد",
    stomach: "المعدة",
    "small-intestine": "الأمعاء الدقيقة",
    "large-intestine": "الأمعاء الغليظة",
    larynx: "الحنجرة",
  };
  assert.equal(anatomy.tasks.length, 8);
  assert.equal(new Set(anatomy.tasks.map((q) => q.organ)).size, 8);
  assert.ok(anatomy.diagram.alt);
  asset(anatomy.diagram.file);
  for (const [organ, answer] of Object.entries(organs)) {
    const q = anatomy.tasks.find((q) => q.organ === organ);
    assert.ok(q, organ);
    assert.equal(q.answer, answer);
    assert.equal(D.isCorrect(q, answer), true);
  }
});

test("Optional vowel marks and punctuation normalize while meaningful hamza and ta marbuta are retained", () => {
  assert.equal(D.normalize(" أَقْرَأُ، دَرْسِي! "), "أقرأ درسي");
  assert.equal(D.normalize("أقرأ".normalize("NFD")), "أقرأ");
  assert.notEqual(D.normalize("أقرأ"), D.normalize("اقرا"));
  assert.notEqual(D.normalize("فتاة"), D.normalize("فتاه"));
});

test("Explicitly wrong pronoun and case vowels are rejected while omitted optional vowels remain valid", () => {
  const pronouns = D.activities.find((a) => a.id === "a-p03-b2");
  const male = pronouns.tasks.find((q) => q.id === "3"),
    female = pronouns.tasks.find((q) => q.id === "4");
  assert.ok(D.isCorrect(male, "أنت"));
  assert.ok(D.isCorrect(female, "أنت"));
  assert.ok(!D.isCorrect(male, "أنتِ"));
  assert.ok(!D.isCorrect(female, "أنتَ"));
  const object = D.activities.find((a) => a.id === "b-p10-b2").tasks[0];
  assert.ok(D.isCorrect(object, "الغرفة"));
  assert.ok(D.isCorrect(object, "الْغُرْفَةَ"));
  assert.ok(!D.isCorrect(object, "الْغُرْفَةُ"));
});
