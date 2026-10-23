(() => {
  "use strict";
  const P = window.Practice,
    D = window.ArabicPracticeData;
  const { $, choose: t, el, button, arabic } = P;
  const state = P.load("sentences", { level: "all", index: 0, answers: {} });
  state.answers = state.answers || {};
  if (!["all", "A1", "A2"].includes(state.level)) state.level = "all";
  if (!["all", "statement", "question", "command"].includes(state.kind))
    state.kind = "all";
  const query = new URLSearchParams(location.search);
  if (["A1", "A2"].includes(query.get("level")))
    state.level = query.get("level");
  if (["statement", "question", "command"].includes(query.get("kind")))
    state.kind = query.get("kind");
  const items = () =>
    D.sentences.filter(
      (q) =>
        (state.level === "all" || q.level === state.level) &&
        (state.kind === "all" || q.kind === state.kind),
    );
  const persist = () => P.save("sentences", state);
  const current = () => items()[state.index];
  function entry(q) {
    let e = state.answers[q.id];
    if (
      !e ||
      !Array.isArray(e.selected) ||
      new Set(e.selected).size !== e.selected.length ||
      e.selected.some(
        (i) => !Number.isInteger(i) || i < 0 || i >= q.words.length,
      )
    ) {
      e = state.answers[q.id] = {
        selected: [],
        order: P.shuffle(q.words.map((_, i) => i)),
        first: null,
        solved: false,
        feedback: false,
      };
    }
    if (
      !Array.isArray(e.order) ||
      e.order.length !== q.words.length ||
      new Set(e.order).size !== q.words.length ||
      e.order.some((i) => !Number.isInteger(i) || i < 0 || i >= q.words.length)
    )
      e.order = P.shuffle(q.words.map((_, i) => i));
    return e;
  }
  function render() {
    const bank = items();
    state.index = Math.max(
      0,
      Math.min(Number(state.index) || 0, bank.length - 1),
    );
    const q = current(),
      e = entry(q);
    $("sentence-level").value = state.level;
    $("sentence-kind").value = state.kind;
    $("sentence-counter").textContent =
      `${state.index + 1} / ${bank.length} · ${q.level}`;
    const done = bank.filter((item) => state.answers[item.id]?.solved);
    $("sentence-score").textContent = t(
      `${done.length} من ${bank.length} مكتملة · ${bank.filter((item) => state.answers[item.id]?.first === true).length} صحيحة من المحاولة الأولى`,
      `${done.length} von ${bank.length} gelöst · ${bank.filter((item) => state.answers[item.id]?.first === true).length} im ersten Versuch richtig`,
    );
    $("sentence-progress").max = bank.length;
    $("sentence-progress").value = done.length;
    $("sentence-meaning").textContent = q.de;
    $("sentence-transformation").replaceChildren();
    $("sentence-transformation").hidden = !q.transformation;
    if (q.transformation) {
      $("sentence-transformation").append(
        el("p", P.bilingual(q.transformation.prompt)),
        arabic(el("strong", q.transformation.source)),
      );
    }
    $("sentence-start-label").textContent = t(
      "ابدأ بهذه الكلمة:",
      "Beginne mit diesem Wort:",
    );
    $("sentence-start").textContent = q.words[0];
    $("sentence-answer").replaceChildren();
    if (!e.selected.length)
      $("sentence-answer").append(
        el(
          "span",
          t(
            "اختر الكلمات بالترتيب…",
            "Wähle die Wörter in der richtigen Reihenfolge…",
          ),
          "answer-placeholder",
        ),
      );
    for (const [position, index] of e.selected.entries()) {
      const b = button(
        q.words[index],
        () => {
          e.selected.splice(position, 1);
          e.feedback = false;
          persist();
          render();
        },
        "word-token selected-token",
      );
      arabic(b);
      b.disabled = e.solved;
      b.setAttribute(
        "aria-label",
        t(`إزالة ${q.words[index]}`, `${q.words[index]} entfernen`),
      );
      $("sentence-answer").append(b);
    }
    $("sentence-bank").replaceChildren();
    for (const index of e.order) {
      const b = button(
        q.words[index],
        () => {
          e.selected.push(index);
          e.feedback = false;
          persist();
          render();
        },
        "word-token",
      );
      arabic(b);
      b.disabled = e.solved || e.selected.includes(index);
      $("sentence-bank").append(b);
    }
    $("sentence-check").disabled =
      e.selected.length !== q.words.length || e.solved;
    $("sentence-clear").disabled = !e.selected.length || e.solved;
    $("sentence-hint").disabled = e.solved;
    $("sentence-listen").disabled = !e.solved;
    $("sentence-feedback").replaceChildren();
    if (e.feedback || e.solved) {
      $("sentence-feedback").append(
        el(
          "strong",
          e.solved
            ? t("أحسنت! الجملة صحيحة.", "Richtig! Der Satz stimmt.")
            : t(
                "راجع الترتيب وحاول مجددًا.",
                "Prüfe die Reihenfolge und versuche es noch einmal.",
              ),
        ),
        el("p", P.bilingual(q.explanation)),
      );
    }
    if (e.feedback || e.solved) $("sentence-feedback").append(el("p", VocabApp.encouragement(!!e.solved)));
    $("sentence-summary").hidden = done.length !== bank.length;
    P.navigation(
      $("sentence-previous"),
      $("sentence-next"),
      state.index,
      bank.length,
    );
    persist();
  }
  function change(index) {
    P.stop();
    state.index = index;
    render();
    $("sentence-heading").focus({ preventScroll: true });
  }
  function updateFilterLink() {
    const url = new URL(location.href);
    if (url.searchParams.has("level") || url.searchParams.has("kind")) {
      url.searchParams.set("level", state.level);
      url.searchParams.set("kind", state.kind);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }
  $("sentence-level").onchange = (e) => {
    state.level = e.target.value;
    updateFilterLink();
    change(0);
  };
  $("sentence-kind").onchange = (e) => {
    state.kind = e.target.value;
    updateFilterLink();
    change(0);
  };
  $("sentence-check").onclick = () => {
    const q = current(),
      e = entry(q);
    if (e.solved || e.selected.length !== q.words.length) return;
    const correct = q.accepted.includes(
      e.selected.map((i) => q.words[i]).join(" "),
    );
    if (e.first === null) e.first = correct;
    e.solved = correct;
    e.feedback = true;
    render();
  };
  $("sentence-clear").onclick = () => {
    const e = entry(current());
    e.selected = [];
    e.feedback = false;
    render();
  };
  $("sentence-hint").onclick = () => {
    const q = current(),
      e = entry(q);
    // Reveal only the next correct word. Hinted solutions aren't first-try successes.
    let position = 0;
    while (
      position < e.selected.length &&
      q.words[e.selected[position]] === q.words[position]
    )
      position++;
    e.selected = Array.from(
      { length: Math.min(position + 1, q.words.length) },
      (_, i) => i,
    );
    e.first = false;
    e.feedback = false;
    render();
  };
  $("sentence-listen").onclick = () => P.speak(current().words.join(" "));
  $("sentence-previous").onclick = () => change(Math.max(0, state.index - 1));
  $("sentence-next").onclick = () =>
    change(Math.min(items().length - 1, state.index + 1));
  $("sentence-restart").onclick = () => {
    for (const q of items()) delete state.answers[q.id];
    change(0);
  };
  P.onLanguage(render);
})();
