const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const C = require("../js/placement-core");
const D = C.data;
function attempt(test = "quick", form = "A") {
  return C.createAttempt(test, form, 1000, "test-id");
}
function filled(test = "quick", form = "A", correct = true) {
  const a = attempt(test, form);
  for (const q of C.questions(a)) {
    a.answers[q.id] = correct ? q.correct : (q.correct + 1) % 4;
    if (q.passage) a.heard[q.passage] = true;
  }
  return a;
}
test("Five short checks each have two exclusive forms, balanced domain blueprints and four distinct choices", () => {
  assert.equal(D.tests.length, 5);
  assert.equal(D.questions.length, 160);
  const all = [];
  for (const t of D.tests) {
    for (const form of ["A", "B"]) {
      const ids = t.forms[form];
      assert.equal(ids.length, 16);
      assert.equal(new Set(ids).size, 16);
      all.push(...ids);
      for (let pos = 0; pos < 4; pos++)
        assert.equal(
          ids.filter((id) => C.byId.get(id).correct === pos).length,
          4,
        );
      for (const d of t.domains)
        assert.equal(
          ids.filter((id) => C.byId.get(id).domain === d).length,
          t.id === "quick" ? 2 : 8,
        );
      for (const id of ids) {
        const q = C.byId.get(id);
        assert.equal(q.options.length, 4);
        assert.equal(new Set(q.options).size, 4);
        assert(
          q.prompt.ar && q.prompt.de && q.explanation.ar && q.explanation.de,
        );
        assert(q.correct >= 0 && q.correct < 4);
        assert(C.lessons[q.lesson]);
      }
    }
  }
  assert.equal(new Set(all).size, 160);
  assert.equal(new Set(D.questions.map((q) => q.domain)).size, 8);
});
test("Independent Arabic fixtures distinguish actual subjects, vowel units, pronouns and exceptional hamza", () => {
  const correct = (id) => {
    const q = C.byId.get(id);
    return q.options[q.correct];
  };
  assert.equal(correct("phonics-07"), "بَحْرْ");
  assert.equal(correct("phonics-19"), "عُصْ - فُورْ");
  assert.equal(correct("sentences-11"), "فَتَحَ الْوَلَدُ الْبَابَ.");
  assert.equal(correct("sentences-17"), "لَمْ أَذْهَبْ.");
  assert.equal(correct("grammar-12"), "تَمْيِيز");
  assert.equal(correct("grammar-20"), "فَرَحًا");
  assert.equal(correct("spelling-09"), "اُكْتُبْ");
  assert.equal(correct("spelling-12"), "عَبَاءَة");
  assert.equal(correct("spelling-20"), "قِرَاءَة");
  assert.equal(correct("reading-08"), "الرِّسَالَةِ");
  assert.equal(correct("reading-18"), "٩:٤٥ صَبَاحًا");
  assert.equal(correct("listening-09"), "أَبْيَض");
  assert.equal(D.passages.r09.kind, "text");
  assert(D.passages.r09.text.includes("بِرُبْعِ سَاعَةٍ"));
});
test("No unanswered test can finish; unknown answers count as learning gaps without exposing early solutions", () => {
  const a = attempt("language");
  assert.throws(() => C.finish(a), /Answer/);
  for (const q of C.questions(a)) a.answers[q.id] = "unknown";
  const f = C.finish(a, 2000);
  assert.equal(f.result.valid, 16);
  assert.equal(f.result.correct, 0);
  assert.equal(f.result.domains.vocabulary.unknown, 8);
  assert.equal(f.result.primary.stage, "vocabulary");
  assert.equal(a.status, "draft");
  assert.strictEqual(C.finish(f), f);
  const corrupt = filled("language");
  corrupt.answers[C.questions(corrupt)[0].id] = 99;
  assert.throws(() => C.finish(corrupt), /Answer/);
});
test("Technical listening exclusions never become language mistakes, while unmeasured skills are not classified", () => {
  const a = filled("comprehension");
  for (const q of C.questions(a).filter((q) => q.domain === "listening"))
    a.answers[q.id] = "unavailable";
  const r = C.finish(a).result;
  assert.equal(r.valid, 8);
  assert.equal(r.correct, 8);
  assert.equal(r.unavailable, 8);
  assert.equal(r.domains.listening.ratio, null);
  assert.equal(r.domains.listening.status, "insufficient");
  assert.deepEqual(r.insufficient, ["listening"]);
  assert(r.unmeasured.includes("grammar"));
  assert(!r.domains.letters);
  const b = filled("language");
  b.answers[C.questions(b)[0].id] = "unavailable";
  assert.throws(() => C.finish(b), /Answer/);
});
test("Strong advanced results cannot compensate for a failed foundation, and quick results stay provisional", () => {
  const a = filled();
  for (const q of C.questions(a).filter((q) => q.domain === "letters"))
    a.answers[q.id] = "unknown";
  const r = C.finish(a).result;
  assert.equal(r.correct, 14);
  assert.equal(r.primary.stage, "letters");
  assert.equal(r.confirmTest, "foundations");
  assert.equal(r.domains.letters.status, "initial-gap");
  assert.equal(r.domains.grammar.status, "initial-ready");
  assert(!("cefr" in r));
  assert(!("level" in r));
});
test("Focused teaching thresholds use a minimum sample and target the actual error, including hamza lessons", () => {
  for (const [n, status] of [
    [3, "practice"],
    [4, "developing"],
    [5, "developing"],
    [6, "ready"],
    [8, "ready"],
  ]) {
    const a = filled("structures");
    C.questions(a)
      .filter((q) => q.domain === "spelling")
      .forEach((q, i) => (a.answers[q.id] = i < n ? q.correct : "unknown"));
    assert.equal(C.score(a).domains.spelling.status, status);
  }
  const a = filled("structures");
  const qs = C.questions(a).filter((q) => q.domain === "spelling");
  for (const q of qs.filter((q) =>
    ["hamza-medial", "hamza-final", "hamza-exceptions"].includes(q.lesson),
  ))
    a.answers[q.id] = "unknown";
  const r = C.finish(a).result;
  assert.equal(r.primary.href, "grammar.html#hamza-medial");
  assert(r.lessons.some((l) => l.href === "grammar.html#hamza-exceptions"));
  const b = filled("comprehension");
  const listening = C.questions(b).filter((q) => q.domain === "listening");
  listening.slice(0, 3).forEach((q) => (b.answers[q.id] = "unavailable"));
  assert.equal(C.score(b).domains.listening.status, "insufficient");
});
test("Every lesson recommendation resolves to an actual page, grammar lesson, vocabulary list or supported filter", () => {
  const G = require("../js/grammar-data");
  const V = require("../data/vocab_catalog.json");
  for (const rec of Object.values(C.lessons)) {
    const [file, tail = ""] = rec.href.split(/[?#]/);
    assert(fs.existsSync(path.join(__dirname, "..", file)), rec.href);
    if (file === "grammar.html")
      assert(
        G.lessons.some((l) => l.id === tail),
        rec.href,
      );
    if (file === "vocabulary.html") {
      const params = new URLSearchParams(tail);
      assert(
        V.lists.some((l) => l.id === params.get("list")),
        rec.href,
      );
      assert(
        V.levels.some((l) => l.id === params.get("level")),
        rec.href,
      );
    }
  }
});
test("Listening stimuli have authentic distinct scripts, two linked tasks and fully checksummed local recordings", () => {
  const M = require("../audio/placement-manifest.json");
  assert.equal(M.clips.length, 10);
  assert.equal(new Set(M.clips.map((c) => c.text)).size, 10);
  for (const p of Object.values(D.passages)) {
    assert.equal(D.questions.filter((q) => q.passage === p.id).length, 2);
    if (p.kind === "audio") {
      const clip = M.clips.find(
        (c) => c.text.normalize("NFC") === p.text.normalize("NFC"),
      );
      assert(clip, p.id);
      assert.equal(D.audio[p.text.normalize("NFC")], clip.path);
      const bytes = fs.readFileSync(path.join(__dirname, "..", clip.path));
      assert(bytes.length > 500);
      assert.equal(
        crypto.createHash("sha256").update(bytes).digest("hex"),
        clip.sha256,
      );
    }
  }
});
test("Placement drafts from two devices merge independently without changing course completion or vocabulary scores", () => {
  const S = require("../js/cloud-sync-core");
  const base = {
    totalTests: 7,
    learningRouteV1: { completed: { letters: true } },
  };
  const a = {
      ...base,
      placementV1: { attempts: { a: filled("foundations") } },
    },
    b = { ...base, placementV1: { attempts: { b: filled("structures") } } };
  const merged = S.merge(base, a, b);
  assert(merged.placementV1.attempts.a && merged.placementV1.attempts.b);
  assert.equal(merged.totalTests, 7);
  assert.equal(merged.learningRouteV1.completed.letters, true);
});
