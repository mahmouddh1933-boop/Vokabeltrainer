(() => {
  "use strict";
  const P = window.Practice,
    D = window.ArabicPracticeData;
  const { $, choose: t, el, button, arabic } = P;
  const state = P.load("sounds", {
    group: "all",
    index: 0,
    answers: {},
    orders: {},
  });
  state.answers = state.answers || {};
  state.orders = state.orders || {};
  if (!D.sounds.some((g) => g.id === state.group)) state.group = "all";
  let heard = new Set();
  const persist = () => P.save("sounds", state);
  function questions() {
    const items = D.soundQuestions(state.group);
    let order = state.orders[state.group];
    if (
      !Array.isArray(order) ||
      order.length !== items.length ||
      new Set(order).size !== items.length ||
      order.some((id) => !items.some((q) => q.id === id))
    ) {
      order = P.shuffle(items.map((q) => q.id));
      state.orders[state.group] = order;
    }
    return order.map((id) => items.find((q) => q.id === id));
  }
  function change(index) {
    P.stop();
    state.index = index;
    persist();
    render();
    $("sound-question").focus({ preventScroll: true });
  }
  function render() {
    const items = questions();
    state.index = Math.max(
      0,
      Math.min(Number(state.index) || 0, items.length - 1),
    );
    const q = items[state.index],
      answer = state.answers[q.id];
    const answered = items.filter((item) =>
      Number.isInteger(state.answers[item.id]),
    );
    $("sound-score").textContent = P.score(
      answered.filter((item) => state.answers[item.id] === item.correct).length,
      answered.length,
      items.length,
    );
    $("sound-counter").textContent = `${state.index + 1} / ${items.length}`;
    $("sound-progress").value = answered.length;
    $("sound-progress").max = items.length;
    $("sound-groups").replaceChildren();
    for (const group of [{ id: "all", letters: [] }, ...D.sounds]) {
      const b = button(
        group.id === "all"
          ? t("جميع الأصوات", "Alle Laute")
          : group.letters.join(" / "),
        () => {
          state.group = group.id;
          change(0);
        },
        "filter-chip",
      );
      b.setAttribute("aria-pressed", String(group.id === state.group));
      if (group.id !== "all") arabic(b);
      $("sound-groups").append(b);
    }
    $("sound-question").textContent = t(
      "استمع، ثم اختر الكلمة التي سمعتها",
      "Höre zu und wähle das gehörte Wort",
    );
    $("sound-listen").textContent = t("◖ استمع إلى الكلمة", "◖ Wort anhören");
    $("sound-listen").onclick = () => {
      heard.add(q.id);
      P.speak(q.word);
      renderOptions();
    };
    function renderOptions() {
      $("sound-options").replaceChildren();
      q.options.forEach((word, index) => {
        const b = button(
          "",
          () => {
            state.answers[q.id] = index;
            persist();
            render();
          },
          "sound-option",
        );
        b.append(arabic(el("strong", word.ar)));
        b.disabled = Number.isInteger(answer) || !heard.has(q.id);
        if (Number.isInteger(answer)) {
          b.append(el("small", word.de));
          if (index === q.correct) b.classList.add("is-correct");
          else if (index === answer) b.classList.add("is-wrong");
        }
        $("sound-options").append(b);
      });
    }
    renderOptions();
    const feedback = $("sound-feedback");
    feedback.replaceChildren();
    if (Number.isInteger(answer)) {
      feedback.append(
        el(
          "strong",
          answer === q.correct
            ? t("أحسنت!", "Richtig!")
            : t("الإجابة الصحيحة:", "Richtige Antwort:"),
        ),
        el("p", VocabApp.encouragement(answer === q.correct)),
        arabic(el("span", q.word)),
        el("p", P.bilingual(D.sounds.find((g) => g.id === q.group).tip)),
      );
    } else
      feedback.append(
        el(
          "p",
          t(
            "اضغط الاستماع لفتح الإجابات. يمكنك تكرار الصوت.",
            "Tippe auf Anhören, um die Antworten freizugeben. Du kannst den Ton wiederholen.",
          ),
        ),
      );
    $("sound-summary").hidden = answered.length !== items.length;
    $("sound-previous").textContent = t("السابق", "Zurück");
    $("sound-next").textContent = t("التالي", "Weiter");
    P.navigation(
      $("sound-previous"),
      $("sound-next"),
      state.index,
      items.length,
    );
    $("sound-next").disabled =
      $("sound-next").disabled || !Number.isInteger(answer);
    $("sound-examples").replaceChildren();
    for (const group of D.sounds.filter(
      (g) => state.group === "all" || g.id === state.group,
    )) {
      const section = el("section", undefined, "sound-example-card");
      section.append(
        arabic(el("h3", group.letters.join(" / "))),
        el("p", P.bilingual(group.tip)),
      );
      const grid = el("div", undefined, "sound-example-grid");
      for (const pair of group.pairs)
        for (const word of pair) {
          const b = button("", () => P.speak(word.ar), "word-listen");
          b.append(arabic(el("strong", "◖ " + word.ar)), el("small", word.de));
          grid.append(b);
        }
      section.append(grid);
      $("sound-examples").append(section);
    }
    persist();
  }
  $("sound-previous").onclick = () => change(Math.max(0, state.index - 1));
  $("sound-next").onclick = () =>
    change(Math.min(questions().length - 1, state.index + 1));
  $("sound-restart").onclick = () => {
    for (const q of questions()) {
      delete state.answers[q.id];
      heard.delete(q.id);
    }
    delete state.orders[state.group];
    change(0);
  };
  P.onLanguage(render);
})();
