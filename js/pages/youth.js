(() => {
  "use strict";
  const P = window.Practice,
    D = window.ArabicYouthData;
  const { $, el, button, arabic, choose: t } = P;
  const tabs = [
    ["dialogue", "١ · الحوار", "1 · Dialog"],
    ["vocabulary", "٢ · المفردات والكلام", "2 · Wörter und Sprechen"],
    ["reading", "٣ · القراءة", "3 · Lesen"],
    ["grammar", "٤ · التراكيب والتدريبات", "4 · Strukturen und Übungen"],
    ["free", "٥ · القراءة الحرة", "5 · Freies Lesen"],
  ];
  const state = P.load("arabic-youth", {
    index: 0,
    tab: "dialogue",
    answers: {},
    drafts: {},
  });
  for (const key of ["answers", "drafts"])
    if (
      !state[key] ||
      typeof state[key] !== "object" ||
      Array.isArray(state[key])
    )
      state[key] = {};
  if (!tabs.some(([id]) => id === state.tab)) state.tab = "dialogue";
  let index = Math.max(0, Math.min(Math.trunc(Number(state.index) || 0), 7));
  const lesson = () => D.units[index];
  const records = () =>
    state.answers[lesson().id] || (state.answers[lesson().id] = {});
  const drafts = () =>
    state.drafts[lesson().id] || (state.drafts[lesson().id] = {});
  const persist = () => {
    state.index = index;
    P.save("arabic-youth", state);
  };
  const heading = (ar, de) => el("h3", t(ar, de));
  function scene(unit, mini = false) {
    const wrap = el(
      "div",
      undefined,
      "youth-scene" + (mini ? " youth-scene-mini" : ""),
    );
    const art = el("img");
    art.src = "images/youth/scenes.png";
    art.alt = "";
    art.setAttribute("aria-hidden", "true");
    art.style.left = `${-((unit.number - 1) % 4) * 100}%`;
    art.style.top = `${-Math.floor((unit.number - 1) / 4) * 100}%`;
    wrap.append(art);
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", unit.scene);
    wrap.lang = "ar";
    return wrap;
  }
  function sound(text, label) {
    const control = button(
      t("◖ استمع", "◖ Anhören"),
      () => P.speak(text),
      "practice-button youth-sound",
    );
    control.setAttribute(
      "aria-label",
      t("استمع إلى: ", "Anhören: ") + (label || text),
    );
    control.dataset.audio = text;
    return control;
  }
  function panel(ar, de) {
    const node = el("section", undefined, "practice-panel");
    node.append(heading(ar, de));
    return node;
  }
  function stats() {
    let total = 0;
    for (const unit of D.units)
      total += unit.questions.filter(
        (q) => state.answers[unit.id]?.[q.id],
      ).length;
    const done = lesson().questions.filter((q) => records()[q.id]);
    const correct = done.filter((q) => D.isCorrect(q, records()[q.id].value));
    $("youth-score").textContent = P.score(correct.length, done.length, 32);
    $("youth-progress").value = done.length;
    $("youth-total").textContent = t(
      `${total} من ٢٥٦ تمرينًا منجزًا · ٨ وحدات`,
      `${total} / 256 Aufgaben bearbeitet · 8 Einheiten`,
    );
    $("youth-complete").hidden = done.length !== 32;
    document.querySelectorAll("[data-youth-unit]").forEach((node) => {
      const unit = D.units[Number(node.dataset.youthUnit)];
      const count = unit.questions.filter(
        (q) => state.answers[unit.id]?.[q.id],
      ).length;
      node.querySelector(".youth-unit-progress").textContent = `${count} / 32`;
    });
  }
  function indexView() {
    $("youth-library").replaceChildren();
    $("youth-select").replaceChildren();
    for (const unit of D.units) {
      const option = el("option", `${unit.number} · ${unit.title}`);
      option.value = unit.number - 1;
      $("youth-select").append(option);
      const card = button(
        "",
        () => navigate(unit.number - 1, true),
        "youth-unit-card",
      );
      card.dataset.youthUnit = unit.number - 1;
      card.setAttribute("aria-pressed", String(unit.number - 1 === index));
      const copy = el("span", undefined, "youth-unit-copy");
      copy.append(
        el(
          "small",
          t(`الوحدة ${unit.number}`, `EINHEIT ${unit.number}`),
          "eyebrow",
        ),
        arabic(el("strong", unit.title)),
        arabic(el("span", unit.readingTitle)),
        arabic(
          el(
            "span",
            (unit.supplement ? t("إضافية: ", "Zusatz: ") : "") + unit.freeTitle,
          ),
        ),
        el("small", "", "youth-unit-progress"),
      );
      card.append(scene(unit, true), copy);
      $("youth-library").append(card);
    }
    $("youth-select").value = index;
  }
  function response(key, prompt, model) {
    const block = el("article", undefined, "youth-response");
    const id = "youth-draft-" + key;
    const label = arabic(el("label", prompt));
    label.htmlFor = id;
    const input = el("textarea");
    input.id = id;
    input.rows = 3;
    input.maxLength = 3000;
    input.lang = "ar";
    input.dir = "rtl";
    input.value = typeof drafts()[key] === "string" ? drafts()[key] : "";
    const status = el(
      "small",
      t(
        "مسودة شخصية · لا تدخل في النتيجة",
        "Persönlicher Entwurf · ohne Bewertung",
      ),
      "youth-note",
    );
    input.addEventListener("input", () => {
      drafts()[key] = input.value;
      persist();
    });
    const example = el("details", undefined, "youth-model");
    example.append(
      el(
        "summary",
        t(
          "مثال للإجابة · إجابات أخرى ممكنة",
          "Musterantwort · andere Antworten sind möglich",
        ),
      ),
      arabic(el("p", model)),
    );
    block.append(label, input, status, example);
    return block;
  }
  function question(q) {
    const card = el("article", undefined, "youth-task");
    card.id = "youth-q-" + q.id;
    card.dataset.question = q.id;
    const title = arabic(el("h4", q.prompt));
    const options = el("div", undefined, "youth-options");
    const feedback = el("p", undefined, "youth-task-feedback");
    feedback.setAttribute("role", "status");
    feedback.lang = "ar";
    feedback.dir = "rtl";
    const actions = el("div", undefined, "practice-actions");
    let optionButtons = [],
      orderValue = [],
      tokens = [],
      selected,
      bank,
      check;
    function update() {
      const record = records()[q.id];
      if (!record) {
        feedback.textContent = "";
        feedback.className = "youth-task-feedback";
        return;
      }
      const correct = D.isCorrect(q, record.value);
      feedback.textContent =
        (correct
          ? t("أحسنت. ", "Richtig. ")
          : t(
              q.section === "order" ? "قارن بالنموذج: " : "راجع الإجابة: ",
              "Lösung: ",
            ) +
            q.answer +
            " — ") + q.explanation;
      feedback.className =
        "youth-task-feedback " + (correct ? "is-correct" : "is-wrong");
      for (const control of optionButtons) {
        control.disabled = true;
        control.classList.toggle(
          "is-correct",
          D.isCorrect(q, control.dataset.value),
        );
        control.classList.toggle(
          "is-wrong",
          !correct && control.dataset.value === record.value,
        );
      }
      if (check) {
        check.disabled = true;
        tokens.forEach((b) => (b.disabled = true));
        selected.replaceChildren(arabic(el("span", record.value)));
      }
      actions.replaceChildren(
        button(t("أحاول مجددًا", "Noch einmal"), () => {
          delete records()[q.id];
          persist();
          card.replaceWith(question(q));
          stats();
        }),
      );
    }
    function submit(value) {
      records()[q.id] = { value };
      persist();
      update();
      stats();
    }
    card.append(title);
    if (q.section === "order") {
      selected = arabic(el("div", undefined, "youth-selected"));
      selected.setAttribute("aria-label", t("الجملة التي رتبتها", "Dein Satz"));
      selected.setAttribute("aria-live", "polite");
      bank = arabic(el("div", undefined, "youth-word-bank"));
      function refreshOrder() {
        selected.replaceChildren();
        for (const tokenIndex of orderValue)
          selected.append(
            button(
              q.words[tokenIndex],
              () => {
                orderValue = orderValue.filter((i) => i !== tokenIndex);
                refreshOrder();
              },
              "practice-button selected-token",
            ),
          );
        tokens.forEach((b, i) => (b.disabled = orderValue.includes(i)));
        check.disabled = !orderValue.length;
      }
      const shuffled = P.shuffle(q.words.map((word, i) => ({ word, i })));
      tokens = new Array(q.words.length);
      for (const item of shuffled) {
        const b = button(
          item.word,
          () => {
            orderValue.push(item.i);
            refreshOrder();
          },
          "practice-button youth-token",
        );
        b.dataset.token = item.i;
        tokens[item.i] = b;
        bank.append(b);
      }
      check = button(
        t("تحقق من الجملة", "Satz prüfen"),
        () => submit(orderValue.map((i) => q.words[i]).join(" ")),
        "practice-button primary-action",
      );
      check.disabled = true;
      actions.append(check);
      options.append(selected, bank);
    } else {
      for (const value of P.shuffle(q.options)) {
        const control = button(
          value,
          () => submit(value),
          "practice-button youth-option",
        );
        arabic(control);
        control.dataset.value = value;
        optionButtons.push(control);
        options.append(control);
      }
      options.setAttribute("role", "group");
      options.setAttribute("aria-labelledby", card.id + "-prompt");
      title.id = card.id + "-prompt";
    }
    card.append(options, actions, feedback);
    update();
    return card;
  }
  function exercises(section, ar, de) {
    const part = panel(ar, de);
    const stack = el("div", undefined, "youth-task-list");
    for (const q of lesson().questions.filter((q) => q.section === section))
      stack.append(question(q));
    part.append(stack);
    return part;
  }
  function paragraphs(texts) {
    const block = el("div", undefined, "youth-reading");
    for (const text of texts) {
      const row = el("div", undefined, "youth-reading-row");
      row.append(arabic(el("p", text)), sound(text));
      block.append(row);
    }
    return block;
  }
  function renderContent() {
    const u = lesson(),
      body = $("youth-content");
    body.replaceChildren();
    if (state.tab === "dialogue") {
      const part = panel("الحوار · أستمع وأقرأ", "Dialog · Hören und lesen");
      part.append(arabic(el("p", u.goal, "youth-context")));
      const dialogue = el("div", undefined, "youth-dialogue");
      u.dialogue.forEach((turn, i) => {
        const row = el(
          "div",
          undefined,
          "youth-turn" + (i % 2 ? " youth-turn-alt" : ""),
        );
        const copy = arabic(el("div"));
        copy.append(
          el("strong", turn.speaker, "youth-speaker"),
          el("p", turn.text),
        );
        row.append(copy, sound(turn.text));
        dialogue.append(row);
      });
      part.append(dialogue);
      body.append(part);
      const role = panel("أمثّل الحوار", "Rollenspiel");
      role.append(
        arabic(
          el(
            "p",
            "اختر دورًا مع زميلك، واقرآ الحوار. بدّلا الدورين، ثم غيّرا بعض التفاصيل مثل الموعد أو الثمن أو المكان.",
          ),
        ),
        response(
          "role",
          "اكتب حوارًا قصيرًا من سطرين مستفيدًا من النموذج.",
          u.dialogue
            .slice(0, 2)
            .map((x) => x.speaker + ": " + x.text)
            .join("\n"),
        ),
      );
      body.append(role);
    } else if (state.tab === "vocabulary") {
      const part = panel(
        "مفردات جديدة · ألاحظ وأدرس",
        "Neue Wörter · Entdecken und lernen",
      );
      const grid = el("div", undefined, "youth-word-grid");
      for (const word of u.vocabulary) {
        const card = el("article", undefined, "youth-word-card");
        const img = el("img");
        img.src = word.file || `images/youth/twemoji/${word.icon}.svg`;
        img.alt = "";
        img.width = 68;
        img.height = 68;
        card.append(
          img,
          arabic(el("h4", word.ar)),
          el("p", word.de, "youth-gloss"),
          arabic(el("p", word.meaning)),
          arabic(el("p", word.example, "youth-word-example")),
          sound(word.ar),
        );
        grid.append(card);
      }
      part.append(grid);
      body.append(
        part,
        exercises(
          "vocabulary",
          "أختار الكلمة المناسبة للتعريف",
          "Das passende Wort zur Bedeutung",
        ),
      );
      const speak = panel(
        "الكلام · أتبادل السؤال والجواب",
        "Sprechen · Fragen und Antworten",
      );
      speak.append(
        scene(u),
        arabic(
          el(
            "p",
            "ابدأ بوصف الصورة، ثم ناقش الأسئلة مع زميلك. اكتب أفكارك إن أحببت؛ النموذج مثال واحد وليس الإجابة الوحيدة.",
          ),
        ),
      );
      u.speaking.forEach((item, i) =>
        speak.append(response("s" + i, item.prompt, item.model)),
      );
      body.append(speak);
    } else if (state.tab === "reading") {
      const part = panel("القراءة", "Lesen");
      part.append(
        arabic(el("h3", u.readingTitle, "youth-text-title")),
        paragraphs(u.reading),
      );
      body.append(
        part,
        exercises("reading", "أسئلة في فهم النص", "Textverständnis"),
      );
    } else if (state.tab === "grammar") {
      const part = panel(
        "تراكيب جديدة · ألاحظ وأدرس",
        "Neue Strukturen · Entdecken und lernen",
      );
      part.append(arabic(el("p", u.rule, "youth-rule")));
      const list = arabic(el("ul", undefined, "youth-examples"));
      u.examples.forEach((text) => list.append(el("li", text)));
      part.append(list);
      body.append(
        part,
        exercises(
          "grammar",
          "أختار وأكمل · تطبيق التراكيب",
          "Auswählen und ergänzen",
        ),
        exercises(
          "order",
          "أكوّن جملًا · أنقر الكلمات لترتيبها",
          "Sätze bilden · Wörter antippen",
        ),
      );
    } else {
      const part = panel(
        u.supplement ? "قراءة إضافية للتطبيق" : "القراءة الحرة",
        u.supplement ? "Zusätzlicher Lesetext für die App" : "Freies Lesen",
      );
      part.append(
        arabic(el("h3", u.freeTitle, "youth-text-title")),
        paragraphs(u.freeReading),
      );
      if (u.supplement)
        part.append(
          el(
            "p",
            t(
              "هذا عنوان إضافي؛ لا يرد عنوان قراءة حرة للوحدة الثانية في الفهرس المرفق.",
              "Dieser Zusatztitel steht nicht im Buchverzeichnis; dort ist für Einheit 2 kein freier Lesetext angegeben.",
            ),
            "youth-note",
          ),
        );
      body.append(
        part,
        exercises(
          "free",
          "أفهم وأستوعب · اختر الإجابة أو التكملة",
          "Verstehen · Antwort oder Fortsetzung wählen",
        ),
      );
      const write = panel("أكتب وأتحدث", "Schreiben und erzählen");
      write.append(
        response(
          "summary",
          "لخّص فكرة النص في جملتين، ثم اربطها بموقف من حياتك.",
          u.freeReading[0] + "\n" + u.freeReading[u.freeReading.length - 1],
        ),
      );
      body.append(write);
    }
    const position = tabs.findIndex(([id]) => id === state.tab);
    const actions = el(
      "div",
      undefined,
      "practice-actions youth-section-navigation",
    );
    if (position > 0)
      actions.append(
        button(t("القسم السابق", "Voriger Bereich"), () =>
          showTab(tabs[position - 1][0], true),
        ),
      );
    if (position < tabs.length - 1)
      actions.append(
        button(
          t("القسم التالي", "Nächster Bereich"),
          () => showTab(tabs[position + 1][0], true),
          "practice-button primary-action",
        ),
      );
    body.append(actions);
  }
  function showTab(tab, focus = false) {
    P.stop();
    state.tab = tab;
    persist();
    document
      .querySelectorAll("[data-youth-tab]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.youthTab === tab)),
      );
    renderContent();
    if (focus) {
      $("youth-tabs").scrollIntoView({ block: "start" });
      document
        .querySelector(`[data-youth-tab="${tab}"]`)
        .focus({ preventScroll: true });
    }
  }
  function printView() {
    const u = lesson(),
      doc = $("youth-print");
    doc.replaceChildren();
    arabic(doc);
    doc.append(
      el("h1", `كتاب 4 · الوحدة ${u.number}: ${u.title}`),
      el(
        "p",
        "الاسم: ....................................... التاريخ: ........................",
      ),
      el("p", "نصوص وتدريبات جديدة للتطبيق وفق عناوين الفهرس."),
    );
    const study = el("div", undefined, "youth-print-study");
    study.append(el("h2", "الحوار"));
    u.dialogue.forEach((turn) =>
      study.append(el("p", turn.speaker + ": " + turn.text)),
    );
    study.append(el("h2", "القراءة: " + u.readingTitle));
    u.reading.forEach((text) => study.append(el("p", text)));
    study.append(
      el(
        "h2",
        (u.supplement ? "قراءة إضافية: " : "القراءة الحرة: ") + u.freeTitle,
      ),
    );
    u.freeReading.forEach((text) => study.append(el("p", text)));
    doc.append(study);
    const words = el("section", undefined, "youth-print-words");
    words.append(el("h2", "مفردات جديدة"));
    for (const word of u.vocabulary) {
      const row = el("p");
      const img = el("img");
      img.src = word.file || `images/youth/twemoji/${word.icon}.svg`;
      img.alt = "";
      row.append(img, el("strong", word.ar + " — "), el("span", word.meaning));
      words.append(row);
    }
    doc.append(words);
    doc.append(el("h2", "تراكيب جديدة"), el("p", u.rule));
    const labels = {
      vocabulary: "المفردات",
      reading: "فهم القراءة",
      grammar: "التراكيب",
      order: "تكوين الجمل",
      free: "استيعاب القراءة الحرة",
    };
    for (const section of [
      "vocabulary",
      "reading",
      "grammar",
      "order",
      "free",
    ]) {
      const part = el("section", undefined, "youth-print-tasks");
      part.append(el("h2", labels[section]));
      u.questions
        .filter((q) => q.section === section)
        .forEach((q, i) => {
          const block = el("div", undefined, "youth-print-task");
          block.append(el("p", `${i + 1}. ${q.prompt}`));
          // Always unfilled and shuffled independently of the learner's saved answer.
          block.append(
            el(
              "p",
              q.section === "order"
                ? P.shuffle(q.words).join(" / ")
                : P.shuffle(q.options).join(" / "),
            ),
            el(
              "p",
              "الإجابة: ................................................................................................",
            ),
          );
          part.append(block);
        });
      doc.append(part);
    }
    const talk = el("section", undefined, "youth-print-speaking");
    talk.append(el("h2", "الكلام والكتابة الحرة · إجابات مفتوحة"), scene(u));
    u.speaking.forEach((item) =>
      talk.append(
        el("p", item.prompt),
        el(
          "p",
          "........................................................................................................",
        ),
      ),
    );
    doc.append(talk);
  }
  function render() {
    const u = lesson();
    indexView();
    $("youth-title").textContent = u.title;
    $("youth-goal").textContent = u.goal;
    $("youth-unit-label").textContent = t(
      `الوحدة ${u.number} · حوار · قراءة · تطبيق`,
      `EINHEIT ${u.number} · ${u.de}`,
    );
    $("youth-art").replaceChildren(scene(u));
    $("youth-position").textContent = `${index + 1} / 8`;
    P.navigation($("youth-previous"), $("youth-next"), index, 8);
    $("youth-tabs").replaceChildren();
    tabs.forEach(([id, ar, de]) => {
      const b = button(t(ar, de), () => showTab(id), "filter-chip");
      b.dataset.youthTab = id;
      b.setAttribute("aria-pressed", String(id === state.tab));
      $("youth-tabs").append(b);
    });
    renderContent();
    printView();
    stats();
  }
  function navigate(next, focus = false) {
    P.stop();
    index = Math.max(0, Math.min(Math.trunc(next), 7));
    persist();
    try {
      history.replaceState(null, "", "#" + lesson().id);
    } catch (_) {}
    render();
    if (focus) {
      $("youth-title").scrollIntoView({ block: "start" });
      $("youth-title").focus({ preventScroll: true });
    }
  }
  function fromHash() {
    const match = /^#unit-([1-8])$/.exec(location.hash);
    if (match) index = Number(match[1]) - 1;
  }
  fromHash();
  $("youth-select").addEventListener("change", (event) =>
    navigate(Number(event.target.value)),
  );
  $("youth-previous").addEventListener("click", () => navigate(index - 1));
  $("youth-next").addEventListener("click", () => navigate(index + 1));
  $("youth-print-button").addEventListener("click", () => {
    P.stop();
    printView();
    window.print();
  });
  $("youth-reset").addEventListener("click", () => {
    state.answers[lesson().id] = {};
    persist();
    render();
  });
  window.addEventListener("hashchange", () => {
    P.stop();
    fromHash();
    persist();
    render();
  });
  P.onLanguage(render);
})();
