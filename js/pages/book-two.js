(() => {
  "use strict";
  const P = window.Practice,
    D = window.ArabicBookData;
  const { $, el, button, arabic, choose: t } = P;
  const letters = window.ArabicLetterData.letters;
  const state = P.load("book-two", {
    index: 0,
    tab: "learn",
    answers: {},
    writing: {},
    guide: true,
  });
  if (!state.answers || typeof state.answers !== "object") state.answers = {};
  if (!state.writing || typeof state.writing !== "object") state.writing = {};
  if (!["learn", "practice", "write"].includes(state.tab)) state.tab = "learn";
  let index = Math.max(0, Math.min(Number(state.index) || 0, 27));
  const lesson = () => D.lessons[index];
  const bank = () => D.questions(lesson());
  const answers = () =>
    state.answers[lesson().id] || (state.answers[lesson().id] = {});
  const persist = () => {
    state.index = index;
    P.save("book-two", state);
  };
  function highlight(node, text, char = lesson().char) {
    const clusters = window.ArabicLetterExamples.graphemes(text);
    node.replaceChildren();
    for (const cluster of clusters) {
      const base = cluster.replace(/[\u064B-\u065F\u0670]/g, "");
      node.append(
        base === char
          ? el("mark", cluster, "book-target")
          : document.createTextNode(cluster),
      );
    }
    return arabic(node);
  }
  function image(spec, description, className = "book-picture") {
    if (Number.isInteger(spec.sheet)) {
      const node = el("div", undefined, className + " book-special");
      const art = el("img");
      art.src = "images/book-two/special-words.png";
      art.alt = "";
      art.setAttribute("aria-hidden", "true");
      art.style.left = `${-(spec.sheet % 3) * 100}%`;
      art.style.top = `${-Math.floor(spec.sheet / 3) * 100}%`;
      node.append(art);
      node.setAttribute("role", "img");
      node.setAttribute("aria-label", description);
      return node;
    }
    const node = el("img", undefined, className);
    node.src = spec.file;
    node.alt = description;
    node.width = 180;
    node.height = 180;
    return node;
  }
  function totalProgress() {
    return D.lessons.reduce(
      (sum, l) =>
        sum + D.questions(l).filter((q) => state.answers[l.id]?.[q.id]).length,
      0,
    );
  }
  function stats() {
    const qs = bank(),
      records = answers(),
      done = qs.filter((q) => records[q.id]);
    const correct = done.filter((q) => records[q.id].correct);
    $("book-score").textContent = t(
      `${done.length} من ${qs.length} منجزة · ${correct.length} صحيحة`,
      `${done.length} / ${qs.length} bearbeitet · ${correct.length} richtig`,
    );
    $("book-progress").max = qs.length;
    $("book-progress").value = done.length;
    $("book-total").textContent = t(
      `${totalProgress()} من ٥٠٤ تمارين منجزة في الكتاب`,
      `${totalProgress()} von 504 Aufgaben im Buch bearbeitet`,
    );
    $("book-complete").hidden = done.length !== qs.length;
  }
  function showTab(tab) {
    state.tab = tab;
    P.stop();
    for (const name of ["learn", "practice", "write"]) {
      $("book-" + name).hidden = name !== tab;
      const control = document.querySelector(`[data-book-tab="${name}"]`);
      control.setAttribute("aria-pressed", String(name === tab));
    }
    if (tab === "write") draw();
    persist();
  }
  function renderStudy() {
    const l = lesson();
    $("book-vocabulary").replaceChildren();
    for (const word of l.vocabulary) {
      const card = el("article", undefined, "book-word-card");
      const speak = button(
        t("◖ استمع", "◖ Anhören"),
        () => P.speak(word.ar),
        "practice-button book-word-speak",
      );
      card.append(
        image(word.image, word.de),
        highlight(el("h3"), word.ar),
        el("p", word.de, "book-translation"),
        speak,
      );
      $("book-vocabulary").append(card);
    }
    $("book-forms").replaceChildren();
    const labels = [
      t("أول الكلمة", "Wortanfang"),
      t("وسط الكلمة", "Wortmitte"),
      t("آخرها منفصل", "Wortende, unverbunden"),
      t("آخرها متصل", "Wortende, verbunden"),
    ];
    const examples = window.ArabicLetterExamples.examples[l.char];
    examples.forEach((example, position) => {
      const card = el("div", undefined, "book-form");
      const word = arabic(el("strong"));
      window.ArabicLetterExamples.highlight(word, example.word, example.index);
      card.append(
        el("small", labels[position]),
        arabic(el("span", letters[index].forms[position], "book-form-glyph")),
        word,
      );
      if (position === 2) {
        const units = window.ArabicLetterExamples.graphemes(example.word);
        card.append(
          el(
            "small",
            t(
              `قبله «${units[example.index - 1]}» لا يتصل بما بعده.`,
              `Nach „${units[example.index - 1]}“ folgt keine Verbindung.`,
            ),
          ),
        );
      }
      $("book-forms").append(card);
    });
    $("book-reading").replaceChildren();
    l.reading.forEach((line, i) => {
      const row = el("div", undefined, "book-reading-row");
      const play = button("◖", () => P.speak(line.ar), "line-listen");
      play.dataset.bookLine = i;
      play.setAttribute(
        "aria-label",
        t(`استمع إلى الجملة ${i + 1}`, `Satz ${i + 1} anhören`),
      );
      const text = el("div");
      text.append(highlight(el("p", undefined, "book-reading-ar"), line.ar));
      if (state.translated) {
        const de = el("p", line.de, "book-translation");
        de.lang = "de";
        de.dir = "ltr";
        text.append(de);
      }
      row.append(play, text);
      $("book-reading").append(row);
    });
    $("book-translate").textContent = state.translated
      ? t("إخفاء ترجمة النص", "Übersetzung ausblenden")
      : t("إظهار ترجمة النص", "Übersetzung anzeigen");
    $("book-translate").setAttribute(
      "aria-pressed",
      String(!!state.translated),
    );
    $("book-grammar-title").textContent = P.bilingual(l.grammar.title);
    $("book-grammar-rule").textContent = P.bilingual(l.grammar.rule);
    $("book-grammar-examples").replaceChildren();
    for (const q of l.grammar.questions.slice(0, 2)) {
      const row = el("div", undefined, "book-language-example");
      row.append(
        arabic(el("p", q.prompt.ar)),
        highlight(el("strong"), q.answer),
      );
      $("book-grammar-examples").append(row);
    }
  }
  function record(q, value) {
    if (answers()[q.id]) return;
    answers()[q.id] = {
      value,
      correct: D.isCorrectAnswer(q, value),
    };
    persist();
    $("book-q-" + q.id).replaceWith(questionCard(q));
    stats();
  }
  function questionCard(q) {
    const result = answers()[q.id];
    const card = el("article", undefined, "book-task");
    card.id = "book-q-" + q.id;
    card.dataset.questionId = q.id;
    if (q.kind === "picture") {
      const word = lesson().vocabulary.find((w) => w.ar === q.answer);
      card.append(image(q.image, word.de));
    } else if (q.kind === "spelling")
      card.append(arabic(el("p", q.masked, "book-task-word")));
    else if (q.kind === "classify")
      card.append(arabic(el("p", q.word, "book-task-word")));
    else {
      card.append(arabic(el("p", q.prompt.ar, "book-task-prompt")));
      if (window.AppLanguage?.get() === "de")
        card.append(el("p", q.prompt.de, "book-translation"));
    }
    const options = el("div", undefined, "book-task-options");
    // Rotate options by question ID; the first answer isn't always in one place.
    const shift = (index + Number(q.id.slice(1))) % q.options.length;
    const ordered = [...q.options.slice(shift), ...q.options.slice(0, shift)];
    if (q.kind === "grammar") {
      const input = el("input");
      input.type = "text";
      input.dir = "rtl";
      input.lang = "ar";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.setAttribute("aria-label", t("اكتب الإجابة", "Antwort schreiben"));
      input.placeholder = t("اكتب إجابتك…", "Schreibe deine Antwort…");
      input.value = result?.value || "";
      input.disabled = !!result;
      const check = button(
        t("تحقق", "Prüfen"),
        () => {
          if (input.value.trim()) record(q, input.value);
        },
        "practice-button primary-action",
      );
      check.disabled = !!result;
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          check.click();
        }
      });
      const field = el("div", undefined, "book-answer-field");
      field.append(input, check);
      card.append(field);
      const help = el("details", undefined, "book-answer-help");
      help.append(el("summary", t("كلمات مساعدة", "Wörter als Hilfe")));
      for (const option of ordered) {
        const b = arabic(
          button(
            option,
            () => {
              input.value = option;
              input.focus({ preventScroll: true });
            },
            "practice-button",
          ),
        );
        b.disabled = !!result;
        options.append(b);
      }
      help.append(options);
      card.append(help);
    } else {
      for (const option of ordered) {
        const b = arabic(
          button(option, () => record(q, option), "practice-button"),
        );
        b.disabled = !!result;
        if (result && D.normalizeAnswer(option) === D.normalizeAnswer(q.answer))
          b.classList.add("is-correct");
        else if (result?.value === option) b.classList.add("is-wrong");
        options.append(b);
      }
      card.append(options);
    }
    if (result) {
      const feedback = el("div", undefined, "book-task-feedback");
      feedback.setAttribute("role", "status");
      feedback.append(
        el(
          "strong",
          result.correct
            ? t("أحسنت!", "Richtig!")
            : t("الإجابة الصحيحة:", "Richtige Antwort:"),
        ),
        highlight(el("span"), q.answer),
      );
      if (q.kind === "reading")
        feedback.append(highlight(el("p"), lesson().reading[q.evidence].ar));
      if (q.kind === "classify")
        feedback.append(
          el(
            "p",
            t(
              `نصنّف هذه الكلمة حسب أول حرف فيها: ${q.answer}.`,
              `Wir ordnen nach dem ersten Buchstaben: ${q.answer}.`,
            ),
          ),
        );
      if (q.kind === "spelling") feedback.append(highlight(el("p"), q.word));
      if (q.kind === "grammar")
        feedback.append(el("p", P.bilingual(lesson().grammar.rule)));
      card.append(feedback);
    }
    return card;
  }
  function renderPractice() {
    $("book-exercises").replaceChildren();
    const groups = [
      ["picture", "اختر الكلمة المناسبة للصورة", "Wähle das passende Bildwort"],
      ["spelling", "أكمل الحرف الناقص", "Ergänze den fehlenden Buchstaben"],
      [
        "classify",
        "صنّف الكلمات حسب الحرف الأول",
        "Ordne nach dem Anfangsbuchstaben",
      ],
      ["reading", "اقرأ النص وأكمل", "Lies den Text und ergänze"],
      [
        "grammar",
        "تدريب اللغة: اقرأ واكتب",
        "Sprachübung: lesen und schreiben",
      ],
    ];
    for (const [kind, ar, de] of groups) {
      const section = el("section", undefined, "book-exercise-section");
      section.append(el("h3", t(ar, de)));
      if (kind === "classify")
        section.append(
          el(
            "p",
            t(
              `اختر «${lesson().char}» أو «${lesson().contrast}» حسب أول حرف، حتى لو احتوت الكلمة على الحرفين.`,
              `Wähle „${lesson().char}“ oder „${lesson().contrast}“ anhand des ersten Buchstabens, auch wenn beide im Wort stehen.`,
            ),
          ),
        );
      const grid = el(
        "div",
        undefined,
        "book-task-grid book-task-grid-" + kind,
      );
      for (const q of bank().filter((q) => q.kind === kind))
        grid.append(questionCard(q));
      section.append(grid);
      $("book-exercises").append(section);
    }
  }
  const canvas = $("book-canvas"),
    ctx = canvas.getContext("2d");
  let guideIndex = 0,
    currentStroke = null;
  function writing() {
    const l = lesson();
    const stored = state.writing[l.id] || (state.writing[l.id] = {});
    if (!Array.isArray(stored[guideIndex])) stored[guideIndex] = [];
    return stored[guideIndex];
  }
  function guideText() {
    return guideIndex === 0
      ? lesson().char
      : lesson().vocabulary[guideIndex - 1].ar;
  }
  function stroke(points) {
    if (!points?.length) return;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const [x, y] of points.slice(1)) ctx.lineTo(x, y);
    if (points.length === 1) ctx.lineTo(points[0][0] + 0.1, points[0][1] + 0.1);
    ctx.strokeStyle = "#244f43";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#d7e0d5";
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    if (state.guide !== false) {
      ctx.save();
      ctx.direction = "rtl";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${guideIndex === 0 ? 190 : 125}px "Noto Naskh Arabic", "Traditional Arabic", serif`;
      ctx.fillStyle = "rgba(63,90,64,.17)";
      ctx.fillText(guideText(), canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
    for (const points of writing()) stroke(points);
    if (currentStroke) stroke(currentStroke);
  }
  function point(event) {
    const r = canvas.getBoundingClientRect();
    return [
      Math.round(((event.clientX - r.left) * canvas.width) / r.width),
      Math.round(((event.clientY - r.top) * canvas.height) / r.height),
    ];
  }
  canvas.addEventListener("pointerdown", (event) => {
    currentStroke = [point(event)];
    canvas.setPointerCapture(event.pointerId);
    draw();
  });
  canvas.addEventListener("pointermove", (event) => {
    if (currentStroke && currentStroke.length < 2000) {
      currentStroke.push(point(event));
      draw();
    }
  });
  function finishStroke() {
    if (currentStroke) {
      writing().push(currentStroke);
      currentStroke = null;
      persist();
      draw();
    }
  }
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    canvas.addEventListener(event, finishStroke);
  function renderWriting() {
    $("book-write-choices").replaceChildren();
    [lesson().char, ...lesson().vocabulary.map((w) => w.ar)].forEach(
      (word, i) => {
        const b = arabic(
          button(
            word,
            () => {
              finishStroke();
              guideIndex = i;
              renderWriting();
              draw();
            },
            "filter-chip",
          ),
        );
        b.setAttribute("aria-pressed", String(i === guideIndex));
        $("book-write-choices").append(b);
      },
    );
    $("book-guide").setAttribute("aria-pressed", String(state.guide !== false));
    $("book-guide").textContent =
      state.guide === false
        ? t("إظهار الدليل", "Vorlage anzeigen")
        : t("إخفاء الدليل", "Vorlage ausblenden");
    draw();
  }
  function renderPrint() {
    const l = lesson(),
      out = $("book-print");
    out.replaceChildren();
    const first = el("section", undefined, "book-print-page");
    arabic(first);
    first.append(
      el("p", "الكتاب المستوى الثاني · الدرس " + (index + 1)),
      el("h1", "حرف " + letters[index].name + " — " + l.char),
    );
    first.append(
      el(
        "p",
        "الاسم: ................................     التاريخ: ........................",
      ),
    );
    first.append(el("h2", "أضع الكلمة المناسبة تحت الصورة"));
    first.append(
      arabic(
        el("p", l.vocabulary.map((w) => w.ar).join("  ·  "), "book-print-bank"),
      ),
    );
    const pictures = el("div", undefined, "book-print-pictures");
    for (const w of l.vocabulary) {
      const box = el("div");
      box.append(image(w.image, w.de), el("p", "........................"));
      pictures.append(box);
    }
    first.append(pictures);
    first.append(el("h2", "أقرأ وألاحظ الحرف الملوّن"));
    for (const line of l.reading)
      first.append(
        highlight(el("p", undefined, "book-print-reading"), line.ar),
      );
    for (const q of l.comprehension)
      first.append(el("p", q.prompt.ar + " ........................"));
    first.append(el("h2", "أكمل الحرف الناقص"));
    first.append(
      el(
        "p",
        D.questions(l)
          .filter((q) => q.kind === "spelling")
          .map((q) => q.masked)
          .join("     ·     "),
        "book-print-bank",
      ),
    );
    const forms = el("div", undefined, "book-print-forms");
    for (const example of window.ArabicLetterExamples.examples[l.char])
      forms.append(highlight(el("span"), example.word));
    first.append(forms);
    const second = el("section", undefined, "book-print-page");
    arabic(second);
    second.append(el("h2", l.grammar.title.ar), el("p", l.grammar.rule.ar));
    for (const q of l.grammar.questions)
      second.append(
        el(
          "p",
          q.prompt.ar +
            "\n.......................................................................",
          "book-print-question",
        ),
      );
    second.append(el("h2", "أصنّف الكلمات حسب الحرف الأول"));
    second.append(
      el(
        "p",
        D.questions(l)
          .filter((q) => q.kind === "classify")
          .map((q) => q.word)
          .join(" · "),
        "book-print-bank",
      ),
    );
    const table = el("table", undefined, "book-print-sort");
    const head = el("tr");
    head.append(el("th", l.char), el("th", l.contrast));
    table.append(head);
    for (let i = 0; i < 3; i++) {
      const tr = el("tr");
      tr.append(el("td", " "), el("td", " "));
      table.append(tr);
    }
    second.append(table);
    second.append(el("h2", "أقرأ وأنسخ"));
    for (const w of l.vocabulary) {
      const row = el("div", undefined, "book-copy-row");
      row.append(highlight(el("strong"), w.ar), el("span", ""));
      second.append(row);
    }
    second.append(
      el(
        "small",
        "إعداد المعلم محمود بركات · تمارين الكتاب المستوى الثاني · الرسوم: Twemoji / CC BY 4.0",
      ),
    );
    out.append(first, second);
  }
  function render() {
    const l = lesson();
    $("book-letter").textContent = l.char;
    $("book-lesson-title").textContent = t(
      "درس حرف " + letters[index].name,
      "Buchstabe " + letters[index].de,
    );
    $("book-topic").textContent = P.bilingual(l.grammar.title);
    $("book-position").textContent = `${index + 1} / 28`;
    $("book-previous").disabled = index === 0;
    $("book-next").disabled = index === 27;
    $("book-index-grid").replaceChildren();
    D.lessons.forEach((item, i) => {
      const b = arabic(button(item.char, () => select(i), "book-index-letter"));
      b.setAttribute(
        "aria-label",
        t("درس " + letters[i].name, "Lektion " + letters[i].de),
      );
      b.setAttribute("aria-current", i === index ? "true" : "false");
      $("book-index-grid").append(b);
    });
    renderStudy();
    renderPractice();
    renderWriting();
    renderPrint();
    stats();
    showTab(state.tab);
  }
  function select(i) {
    finishStroke();
    P.stop();
    index = Math.max(0, Math.min(i, 27));
    guideIndex = 0;
    try {
      history.replaceState(null, "", "#" + lesson().id);
    } catch (_) {}
    render();
    $("book-lesson-title").focus({ preventScroll: true });
    $("book-lesson-title").scrollIntoView({
      block: "start",
      behavior: "instant",
    });
  }
  for (const b of document.querySelectorAll("[data-book-tab]"))
    b.onclick = () => showTab(b.dataset.bookTab);
  $("book-previous").onclick = () => select(index - 1);
  $("book-next").onclick = () => select(index + 1);
  $("book-translate").onclick = () => {
    state.translated = !state.translated;
    persist();
    renderStudy();
  };
  $("book-reset").onclick = () => {
    state.answers[lesson().id] = {};
    persist();
    renderPractice();
    stats();
  };
  $("book-clear").onclick = () => {
    currentStroke = null;
    state.writing[lesson().id][guideIndex] = [];
    persist();
    draw();
  };
  $("book-undo").onclick = () => {
    writing().pop();
    persist();
    draw();
  };
  $("book-guide").onclick = () => {
    state.guide = state.guide === false;
    persist();
    renderWriting();
  };
  $("book-print-button").onclick = () => {
    renderPrint();
    window.print();
  };
  window.addEventListener("hashchange", () => {
    const i = D.lessons.findIndex((l) => "#" + l.id === location.hash);
    if (i >= 0 && i !== index) {
      index = i;
      guideIndex = 0;
      render();
    }
  });
  const linked = D.lessons.findIndex((l) => "#" + l.id === location.hash);
  if (linked >= 0) index = linked;
  P.onLanguage(render);
})();
