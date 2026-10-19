(() => {
  "use strict";
  const P = window.Practice,
    D = window.ArabicPracticeData;
  const { $, choose: t, el, button, arabic } = P;
  const state = P.load("stories", {
    level: "all",
    current: D.stories[0].id,
    question: 0,
    translations: {},
    answers: {},
  });
  state.answers ||= {};
  state.translations ||= {};
  if (!["all", "A1", "A2"].includes(state.level)) state.level = "all";
  const items = () =>
    D.stories.filter((s) => state.level === "all" || s.level === state.level);
  const persist = () => P.save("stories", state);
  function select(id) {
    P.stop();
    state.current = id;
    state.question = 0;
    render();
    $("story-title").focus({ preventScroll: true });
    $("story-title").scrollIntoView({ block: "start", behavior: "instant" });
  }
  function render() {
    const bank = items();
    if (!bank.some((s) => s.id === state.current)) state.current = bank[0].id;
    const story = bank.find((s) => s.id === state.current);
    state.question = Math.max(
      0,
      Math.min(Number(state.question) || 0, story.questions.length - 1),
    );
    const answers = (state.answers[story.id] ||= {});
    const translated = !!state.translations[story.id];
    $("story-level").value = state.level;
    $("story-library").replaceChildren();
    bank.forEach((s) => {
      const b = button("", () => select(s.id), "story-library-card");
      const art = el("span", undefined, "story-art story-thumb");
      art.style.backgroundPosition = `${(s.art % 3) * 50}% ${Math.floor(s.art / 3) * 100}%`;
      art.setAttribute("aria-hidden", "true");
      b.append(art, el("small", s.level), el("strong", P.bilingual(s.title)));
      b.setAttribute("aria-pressed", String(s.id === story.id));
      $("story-library").append(b);
    });
    $("story-title").textContent = P.bilingual(story.title);
    $("story-art").style.backgroundPosition =
      `${(story.art % 3) * 50}% ${Math.floor(story.art / 3) * 100}%`;
    $("story-art").setAttribute("aria-label", P.bilingual(story.title));
    $("story-badge").textContent =
      `${story.level} · ${t("٦ جمل · ٤ أسئلة", "6 Sätze · 4 Fragen")}`;
    $("story-translation").removeAttribute("data-ar");
    $("story-translation").removeAttribute("data-de");
    $("story-translation").textContent = translated
      ? t("إخفاء الترجمة الألمانية", "Deutsche Übersetzung ausblenden")
      : t("إظهار الترجمة الألمانية", "Deutsche Übersetzung anzeigen");
    $("story-translation").setAttribute("aria-pressed", String(translated));
    $("story-lines").replaceChildren();
    story.lines.forEach((line, index) => {
      const row = el("div", undefined, "story-line");
      row.id = `story-line-${index}`;
      const listen = button("◖", () => P.speak(line.ar), "line-listen");
      listen.setAttribute(
        "aria-label",
        t(`استمع إلى الجملة ${index + 1}`, `Satz ${index + 1} anhören`),
      );
      listen.dataset.line = index;
      const text = el("div");
      text.append(arabic(el("p", line.ar, "story-arabic")));
      if (translated) {
        const translation = el("p", line.de, "story-german");
        translation.lang = "de";
        translation.dir = "ltr";
        text.append(translation);
      }
      row.append(listen, text);
      $("story-lines").append(row);
    });
    $("story-vocabulary").replaceChildren();
    story.vocabulary.forEach((word) => {
      const b = button("", () => P.speak(word.ar), "word-listen");
      b.append(arabic(el("strong", "◖ " + word.ar)), el("small", word.de));
      $("story-vocabulary").append(b);
    });
    const q = story.questions[state.question],
      answer = answers[state.question];
    // Questions and their answers remain Arabic; German support is optional.
    $("story-question").textContent = q.prompt.ar;
    $("story-question-de").textContent = q.prompt.de;
    $("story-question-de").hidden = !translated;
    $("story-options").replaceChildren();
    q.options.forEach((option, index) => {
      const b = button(
        "",
        () => {
          answers[state.question] = index;
          render();
        },
        "story-option",
      );
      b.append(arabic(el("strong", option.ar)));
      if (translated) b.append(el("small", option.de));
      b.disabled = Number.isInteger(answer);
      if (Number.isInteger(answer)) {
        if (index === q.correct) b.classList.add("is-correct");
        else if (index === answer) b.classList.add("is-wrong");
      }
      $("story-options").append(b);
    });
    $("story-feedback").replaceChildren();
    if (Number.isInteger(answer)) {
      const evidence = story.lines[q.evidence];
      $("story-feedback").append(
        el(
          "strong",
          answer === q.correct
            ? t("أحسنت! الدليل من القصة:", "Richtig! Der Beleg im Text:")
            : t(
                "راجع الإجابة الصحيحة والدليل:",
                "Sieh dir die richtige Antwort und den Beleg an:",
              ),
        ),
        arabic(el("p", evidence.ar)),
      );
      $("story-lines").children[q.evidence].classList.add("is-evidence");
    }
    const answered = story.questions
      .map((_, i) => i)
      .filter((i) => Number.isInteger(answers[i]));
    $("story-score").textContent = P.score(
      answered.filter((i) => answers[i] === story.questions[i].correct).length,
      answered.length,
      story.questions.length,
    );
    $("story-progress").max = story.questions.length;
    $("story-progress").value = answered.length;
    $("story-question-counter").textContent =
      `${state.question + 1} / ${story.questions.length}`;
    $("story-summary").hidden = answered.length !== story.questions.length;
    P.navigation(
      $("story-question-previous"),
      $("story-question-next"),
      state.question,
      story.questions.length,
    );
    $("story-question-next").disabled ||= !Number.isInteger(answer);
    P.navigation(
      $("story-previous"),
      $("story-next"),
      bank.indexOf(story),
      bank.length,
    );
    $("story-counter").textContent =
      `${bank.indexOf(story) + 1} / ${bank.length}`;
    persist();
  }
  $("story-level").onchange = (event) => {
    state.level = event.target.value;
    select(items()[0].id);
  };
  $("story-translation").onclick = () => {
    state.translations[state.current] = !state.translations[state.current];
    render();
  };
  $("story-question-previous").onclick = () => {
    state.question = Math.max(0, state.question - 1);
    render();
  };
  $("story-question-next").onclick = () => {
    state.question = Math.min(
      D.stories.find((s) => s.id === state.current).questions.length - 1,
      state.question + 1,
    );
    render();
  };
  $("story-previous").onclick = () => {
    const bank = items();
    select(
      bank[Math.max(0, bank.findIndex((s) => s.id === state.current) - 1)].id,
    );
  };
  $("story-next").onclick = () => {
    const bank = items();
    select(
      bank[
        Math.min(
          bank.length - 1,
          bank.findIndex((s) => s.id === state.current) + 1,
        )
      ].id,
    );
  };
  $("story-restart").onclick = () => {
    state.answers[state.current] = {};
    state.question = 0;
    render();
  };
  P.onLanguage(render);
})();
