(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("./teacher-exams-data.js")
      : root.TeacherExamData,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TeacherExams = api;
})(globalThis, function (data) {
  "use strict";
  // Keep hamza seats, tāʾ marbūṭa and alif maqṣūra meaningful. Omitted vowels
  // are allowed; an explicitly written, conflicting vowel is not ignored.
  function graphemes(value) {
    const result = [];
    for (const char of String(value ?? "")
      .normalize("NFC")
      .replace(/([اى])ً/g, "ً$1")
      .replace(/ـ/g, "")
      .replace(/[.,،؛؟!?«»“”"'():]/g, " ")
      .replace(/\s+/g, " ")
      .trim()) {
      if (/[\u064b-\u0652\u0670]/u.test(char) && result.length)
        result.at(-1).marks.add(char);
      else result.push({ char, marks: new Set() });
    }
    return result;
  }
  function matches(value, expected) {
    const a = graphemes(value),
      b = graphemes(expected);
    return (
      a.length === b.length &&
      a.every(
        (g, i) =>
          g.char === b[i].char &&
          [...g.marks].every((m) => m === "ٰ" || b[i].marks.has(m)),
      )
    );
  }
  function tasks(exam) {
    return exam.sections.flatMap((s) => s.tasks);
  }
  function correct(task, value) {
    if (task.kind === "manual") return false;
    if (task.kind === "order") {
      if (
        !Array.isArray(value) ||
        value.length !== task.tokens.length ||
        new Set(value).size !== value.length ||
        value.some(
          (i) => !Number.isInteger(i) || i < 0 || i >= task.tokens.length,
        )
      )
        return false;
      return (
        value.map((i) => task.tokens[i]).join(task.join) === task.answer ||
        (task.acceptedOrders || []).some((order) =>
          order.every((id, i) => id === value[i]),
        )
      );
    }
    if (task.kind === "choice")
      return [task.answer, ...(task.accepted || [])].includes(value);
    return [task.answer, ...(task.accepted || [])].some((a) =>
      matches(value, a),
    );
  }
  function result(exam, attempt) {
    const all = tasks(exam),
      manual = all.filter((q) => q.kind === "manual"),
      closed = all.filter((q) => q.kind !== "manual"),
      skipped = closed.filter(
        (q) => q.kind === "dictation" && attempt.unavailable?.[q.id],
      );
    const valid = closed.filter((q) => !skipped.includes(q));
    const answered = (q) =>
      Array.isArray(attempt.answers?.[q.id])
        ? attempt.answers[q.id].length === q.tokens.length
        : String(attempt.answers?.[q.id] ?? "").trim().length > 0;
    const right = valid.filter((q) =>
      correct(q, attempt.answers?.[q.id]),
    ).length;
    return {
      right,
      total: valid.length,
      skipped: skipped.length,
      unanswered: valid.filter((q) => !answered(q)).length,
      manual: manual.length,
      manualAnswered: manual.filter(answered).length,
      percent: valid.length ? Math.round((right / valid.length) * 100) : null,
    };
  }
  function saveAttempt(stats, attempt) {
    const prior = stats.teacherExamsV1 || {},
      entries = { ...prior.attempts, [attempt.id]: attempt };
    const recent = Object.values(entries)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10);
    return {
      ...stats,
      teacherExamsV1: {
        ...prior,
        attempts: Object.fromEntries(recent.map((a) => [a.id, a])),
      },
    };
  }
  return { data, tasks, matches, correct, result, saveAttempt };
});
