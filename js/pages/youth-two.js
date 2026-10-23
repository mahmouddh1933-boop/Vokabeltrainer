(() => {
  "use strict";
  const C = window.JisrWorkbookConfig || {};
  const P = window.Practice,
    D = C.data || window.ArabicYouthTwoData;
  const storageKey = C.storageKey || "youth-two";
  const { $, el, button, arabic, choose: t } = P;
  const categories = D.units
    ? [
        ["all", "كل أقسام الوحدة", "Alle Bereiche"],
        ["dialogue", "الحوار", "Dialog"],
        ["vocabulary", "المفردات", "Wörter"],
        ["sounds", "الأصوات", "Laute"],
        ["grammar", "القواعد والتراكيب", "Grammatik"],
        ["writing", "الكتابة", "Schreiben"],
        ["reading", "القراءة", "Lesen"],
      ]
    : [
        ["all", "جميع الأنشطة", "Alle Aufgaben"],
        ["vocabulary", "المفردات", "Wortschatz"],
        ["grammar", "القواعد والتراكيب", "Grammatik"],
        ["reading", "القراءة", "Lesen"],
        ["writing", "الكتابة", "Schreiben"],
        ["speaking", "الكلام", "Sprechen"],
      ];
  const state = P.load(storageKey, {
    unit: D.units ? 1 : null,
    active: D.activities[0].id,
    category: "all",
    search: "",
    answers: {},
    drafts: {},
    reviewed: {},
  });
  for (const key of ["answers", "drafts", "reviewed"])
    if (
      !state[key] ||
      typeof state[key] !== "object" ||
      Array.isArray(state[key])
    )
      state[key] = {};
  if (!categories.some(([id]) => id === state.category)) state.category = "all";
  if (typeof state.search !== "string") state.search = "";
  const searchKey = (value) =>
    D.normalize(value).replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").toLowerCase();
  const source = (a) => D.sources.find((s) => s.photo === a.source);
  const activity = () =>
    D.activities.find((a) => a.id === state.active) || D.activities[0];
  const map = (key) =>
    state[key][activity().id] || (state[key][activity().id] = {});
  if (D.units) {
    if (!D.units.some((u) => u.number === state.unit))
      state.unit = activity().unit;
    if (activity().unit !== state.unit)
      state.active = D.activities.find((a) => a.unit === state.unit).id;
  }
  const persist = () => P.save(storageKey, state);
  function renderUnits() {
    if (!D.units) return;
    const unit = D.units.find((u) => u.number === state.unit);
    $("book-unit-title").textContent = unit.title;
    $("book-unit-goal").textContent = unit.goal;
    $("book-unit-details").textContent = t(
      `الوحدة ${unit.number} · ص ${unit.pages.join("–")} · ${unit.grammar} · ${unit.sounds.join(" / ")}`,
      `Einheit ${unit.number} · S. ${unit.pages.join("–")} · ${unit.grammar} · ${unit.sounds.join(" / ")}`,
    );
    $("book-unit-position").textContent = `${unit.number} / ${D.units.length}`;
    $("book-unit-previous").disabled = unit.number === 1;
    $("book-unit-next").disabled = unit.number === D.units.length;
    $("book-unit-library").replaceChildren();
    D.units.forEach((u) => {
      const b = button("", () => chooseUnit(u.number, true), "book-unit-card");
      b.dataset.unit = u.number;
      b.setAttribute("aria-pressed", String(u.number === state.unit));
      let done = 0,
        total = 0;
      for (const a of D.activities.filter((a) => a.unit === u.number))
        for (const q of a.tasks) {
          total++;
          if (
            q.kind === "open"
              ? state.reviewed[a.id]?.[q.id]
              : state.answers[a.id]?.[q.id]
          )
            done++;
        }
      b.append(
        el("small", t("الوحدة ", "Einheit ") + u.number),
        arabic(el("strong", u.title)),
        arabic(el("span", u.grammar)),
        el(
          "small",
          t(`${done} من ${total} مهمة منجزة`, `${done} / ${total} bearbeitet`),
        ),
      );
      $("book-unit-library").append(b);
    });
  }
  function chooseUnit(number, focus = false) {
    if (!D.units.some((u) => u.number === number)) return;
    state.unit = number;
    state.category = "all";
    state.search = "";
    $("yt-search").value = "";
    $("yt-review").checked = false;
    navigate(D.activities.find((a) => a.unit === number).id, focus);
  }
  function filtered() {
    const needle = searchKey(state.search);
    return D.activities.filter(
      (a) =>
        (!D.units || a.unit === state.unit) &&
        (state.category === "all" ||
          (D.units ? a.section : a.category) === state.category) &&
        (!needle ||
          searchKey(
            [
              a.title,
              a.instructions,
              a.rule,
              a.sourcePage,
              ...(source(a)?.topics || []),
            ].join(" "),
          ).includes(needle)),
    );
  }
  function categoryName(id) {
    const found = categories.find((c) => c[0] === id);
    return found ? t(found[1], found[2]) : id;
  }
  function stats() {
    const a = activity(),
      records = map("answers"),
      tasks = a.tasks.filter((q) => q.kind !== "open");
    const done = tasks.filter((q) => records[q.id]);
    const correct = done.filter((q) => D.isCorrect(q, records[q.id].value));
    const open = a.tasks.filter((q) => q.kind === "open");
    const reviewed = open.filter((q) => map("reviewed")[q.id]);
    $("yt-score").textContent = t(
      `${done.length} من ${tasks.length} إجابات مصحّحة · ${correct.length} صحيحة`,
      `${done.length} / ${tasks.length} geprüft · ${correct.length} richtig`,
    );
    $("yt-open-score").textContent = t(
      `${reviewed.length} من ${open.length} مهام مفتوحة راجعتها بنفسي`,
      `${reviewed.length} / ${open.length} offene Aufgaben selbst geprüft`,
    );
    $("yt-open-score").hidden = !open.length;
    $("yt-score").hidden = !tasks.length;
    $("yt-progress").max = Math.max(1, tasks.length);
    $("yt-progress").value = done.length;
    $("yt-progress").hidden = !tasks.length;
    let allDone = 0,
      allReviewed = 0;
    for (const item of D.activities)
      for (const q of item.tasks) {
        if (q.kind === "open") {
          if (state.reviewed[item.id]?.[q.id]) allReviewed++;
        } else if (state.answers[item.id]?.[q.id]) allDone++;
      }
    renderUnits();
    const total = D.activities.reduce((n, item) => n + item.tasks.length, 0);
    $("yt-total").textContent = t(
      `${D.units ? D.units.length + " وحدات · " : ""}${D.sources.length} صورة · ${D.activities.length} نشاطًا · ${total} سؤالًا ومهمة · أنجزت ${allDone} إجابة مصحّحة وراجعت ${allReviewed} مهمة مفتوحة`,
      `${D.sources.length} Vorlagen · ${D.activities.length} Aufgabenblöcke · ${total} Teilaufgaben · ${allDone} beantwortet und ${allReviewed} selbst geprüft`,
    );
  }
  function renderSources() {
    $("yt-sources").replaceChildren();
    D.sources.forEach((s, i) => {
      const section = el("details", undefined, "yt-source");
      section.dataset.photo = s.photo;
      section.append(
        el(
          "summary",
          t(
            `الصورة ${i + 1}${s.page ? " · ص " + s.page : ""} · ${s.topics.join("، ")}`,
            `Vorlage ${i + 1}${s.page ? " · S. " + s.page : ""} · ${s.topics.join("، ")}`,
          ),
        ),
      );
      s.blocks.forEach((block) => {
        const b = button(
          block.title,
          () => {
            state.category = "all";
            state.search = "";
            $("yt-search").value = "";
            navigate(block.activity, true);
          },
          "practice-button yt-source-link",
        );
        arabic(b);
        b.dataset.activityId = block.activity;
        section.append(b);
      });
      $("yt-sources").append(section);
    });
  }
  function renderCatalog() {
    $("yt-search").placeholder = t(
      "المثنى، الضمائر، الساعة…",
      "Dual, Pronomen, Uhrzeit …",
    );
    $("yt-categories").replaceChildren();
    for (const [id, ar, de] of categories) {
      if (
        id !== "all" &&
        !D.activities.some(
          (a) =>
            (!D.units || a.unit === state.unit) &&
            (D.units ? a.section : a.category) === id,
        )
      )
        continue;
      const b = button(
        t(ar, de),
        () => {
          state.category = id;
          applyFilters();
        },
        "filter-chip",
      );
      b.dataset.category = id;
      b.setAttribute("aria-pressed", String(id === state.category));
      $("yt-categories").append(b);
    }
    const visible = filtered();
    $("yt-select").replaceChildren();
    visible.forEach((a) => {
      const option = arabic(el("option", a.title));
      option.value = a.id;
      $("yt-select").append(option);
    });
    $("yt-select").value = state.active;
    $("yt-select").disabled = !visible.length;
    $("yt-results").textContent = t(
      `${visible.length} نشاطًا من ${D.activities.length}`,
      `${visible.length} von ${D.activities.length} Aufgaben`,
    );
    $("yt-empty").hidden = !!visible.length;
    $("yt-workspace").hidden = !visible.length;
    $("yt-clear-filters").hidden = state.category === "all" && !state.search;
    return visible;
  }
  function asset(file, alt, className = "yt-image") {
    const img = el("img", undefined, className);
    img.src = file;
    img.alt = alt || t("رسم توضيحي للتدريب", "Illustration zur Aufgabe");
    return img;
  }
  function diagram(a, print = false) {
    const wrap = el("div", undefined, "yt-diagram");
    wrap.append(asset(a.diagram.file, a.diagram.alt));
    for (const pin of a.diagram.pins || []) {
      const node = print
        ? el("span", String(pin.number), "yt-pin")
        : button(
            String(pin.number),
            () => {
              const q = a.tasks.find((q) => q.organ === pin.organ);
              if (q) {
                const card = $("yt-q-" + q.id);
                card?.scrollIntoView({ block: "center" });
                card
                  ?.querySelector("input,textarea,button")
                  ?.focus({ preventScroll: true });
              }
            },
            "yt-pin",
          );
      node.style.left = pin.x + "%";
      node.style.top = pin.y + "%";
      if (!print)
        node.setAttribute(
          "aria-label",
          t("العضو رقم ", "Organ Nummer ") + pin.number,
        );
      wrap.append(node);
    }
    return wrap;
  }
  function voiceButton(text) {
    const b = button(
      t("◖ استمع", "◖ Anhören"),
      () => P.speak(text),
      "practice-button book-listen",
    );
    b.dataset.audio = text;
    return b;
  }
  function context() {
    const a = activity(),
      block = $("yt-context");
    block.replaceChildren();
    if (a.dialogue) {
      const list = el("div", undefined, "book-dialogue");
      a.dialogue.forEach((turn) => {
        const row = el("article", undefined, "book-turn"),
          copy = arabic(el("div"));
        copy.append(el("strong", turn.speaker), el("p", turn.text));
        row.append(copy, voiceButton(turn.text));
        list.append(row);
      });
      block.append(list);
    }
    if (a.vocabulary) {
      const grid = el("div", undefined, "book-word-grid");
      a.vocabulary.forEach((word) => {
        const card = el("article", undefined, "book-word-card");
        if (word.image) card.append(asset(word.image, word.meaning));
        card.append(
          arabic(el("h3", word.ar)),
          el("p", word.de),
          arabic(el("p", word.meaning)),
          voiceButton(word.ar),
        );
        grid.append(card);
      });
      block.append(grid);
    }
    if (a.rule) {
      const rule = arabic(el("aside", a.rule, "yt-rule"));
      block.append(rule);
    }
    if (a.examples?.length) {
      const details = el("details", undefined, "yt-examples");
      details.append(el("summary", t("ألاحظ المثال", "Beispiel ansehen")));
      a.examples.forEach((text) => details.append(arabic(el("p", text))));
      block.append(details);
    }
    if (a.passage) {
      const passage = arabic(el("div", undefined, "yt-passage"));
      passage.append(el("h3", t("أقرأ أولًا", "Zuerst lesen")));
      if (a.passageLines) {
        for (const text of a.passageLines) {
          const row = el("div", undefined, "book-reading-line");
          row.append(arabic(el("p", text)), voiceButton(text));
          passage.append(row);
        }
      } else passage.append(el("p", a.passage));
      block.append(passage);
    }
    if (a.diagram)
      block.append(
        diagram(a),
        arabic(
          el(
            "p",
            a.diagram.note ||
              "انظر إلى الرقم في الرسم، ثم اكتب اسم العضو في التدريب الموافق. الجهة اليمنى واليسرى هما جهتا صاحب الجسم.",
            "yt-note",
          ),
        ),
      );
  }
  const svgEl = (tag, attrs = {}) => {
    const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    return n;
  };
  function clockFace(value, print = false) {
    const svg = svgEl("svg", {
      viewBox: "0 0 220 220",
      class: "yt-clock-face",
      role: "img",
      "aria-label": t(
        "قرص ساعة بعقربين قابلين للضبط",
        "Analoge Uhr mit einstellbaren Zeigern",
      ),
    });
    svg.append(
      svgEl("circle", {
        cx: 110,
        cy: 110,
        r: 102,
        fill: "#fffef7",
        stroke: "#698573",
        "stroke-width": 3,
      }),
    );
    for (let i = 0; i < 60; i++) {
      const angle = ((i * 6 - 90) * Math.PI) / 180,
        r = i % 5 === 0 ? 89 : 95;
      svg.append(
        svgEl("line", {
          x1: 110 + Math.cos(angle) * r,
          y1: 110 + Math.sin(angle) * r,
          x2: 110 + Math.cos(angle) * 99,
          y2: 110 + Math.sin(angle) * 99,
          stroke: "#63806d",
          "stroke-width": i % 5 === 0 ? 2 : 1,
        }),
      );
    }
    for (let n = 1; n <= 12; n++) {
      const angle = ((n * 30 - 90) * Math.PI) / 180,
        label = svgEl("text", {
          x: 110 + Math.cos(angle) * 76,
          y: 116 + Math.sin(angle) * 76,
          "text-anchor": "middle",
          fill: "#244b39",
          "font-size": 17,
        });
      label.textContent = String(n);
      svg.append(label);
    }
    if (!print && value.hour !== null && value.minute !== null) {
      for (const [mode, angle, length, width] of [
        ["hour", (value.hour % 12) * 30 + value.minute / 2, 47, 7],
        ["minute", value.minute * 6, 66, 4],
      ]) {
        const rad = ((angle - 90) * Math.PI) / 180;
        svg.append(
          svgEl("line", {
            x1: 110,
            y1: 110,
            x2: 110 + Math.cos(rad) * length,
            y2: 110 + Math.sin(rad) * length,
            stroke: mode === "hour" ? "#194e40" : "#a66339",
            "stroke-width": width,
            "stroke-linecap": "round",
          }),
        );
      }
      svg.append(svgEl("circle", { cx: 110, cy: 110, r: 5, fill: "#194e40" }));
    }
    return svg;
  }
  function taskCard(q) {
    const card = el("article", undefined, "practice-panel yt-task");
    card.id = "yt-q-" + q.id;
    card.dataset.task = q.id;
    card.dataset.kind = q.kind;
    const prompt = arabic(el("h3", q.prompt));
    prompt.id = card.id + "-prompt";
    card.append(prompt);
    if (q.image) card.append(asset(q.image, q.imageAlt));
    if (q.audioText) {
      const b = button(
        t("◖ استمع إلى الكلمة", "◖ Wort anhören"),
        () => P.speak(q.audioText),
        "practice-button yt-listen",
      );
      b.dataset.audio = q.audioText;
      card.append(b);
    }
    if (q.hint) {
      const hint = el("details", undefined, "yt-hint");
      hint.append(el("summary", t("تلميح", "Tipp")), arabic(el("p", q.hint)));
      card.append(hint);
    }
    if (q.kind === "open") {
      const input = arabic(el("textarea", undefined, "yt-draft"));
      input.rows = 4;
      input.maxLength = 6000;
      input.value =
        typeof map("drafts")[q.id] === "string" ? map("drafts")[q.id] : "";
      input.setAttribute("aria-labelledby", prompt.id);
      input.addEventListener("input", () => {
        map("drafts")[q.id] = input.value;
        persist();
      });
      const model = el("details", undefined, "yt-model");
      model.append(
        el(
          "summary",
          t(
            "إجابة نموذجية للمقارنة · صيغ أخرى ممكنة",
            "Muster zum Vergleichen · andere Formulierungen sind möglich",
          ),
        ),
        arabic(el("p", q.model)),
      );
      const label = el("label", undefined, "yt-self-label"),
        check = el("input", undefined, "yt-self-review");
      check.type = "checkbox";
      check.checked = !!map("reviewed")[q.id];
      check.addEventListener("change", () => {
        map("reviewed")[q.id] = check.checked;
        persist();
        stats();
      });
      label.append(
        check,
        el("span", t("تدرّبت وراجعت إجابتي بنفسي", "Geübt und selbst geprüft")),
      );
      card.append(
        input,
        model,
        label,
        el(
          "p",
          t(
            "مهمة مفتوحة، لا تُصحَّح آليًا.",
            "Offene Aufgabe, ohne automatische Bewertung.",
          ),
          "yt-note",
        ),
      );
      return card;
    }
    const answerArea = el("div", undefined, "yt-answer-area"),
      feedback = arabic(el("div", undefined, "yt-feedback"));
    feedback.setAttribute("role", "status");
    const actions = el("div", undefined, "practice-actions");
    let controls = [],
      getValue = () => "",
      lock = () => {},
      checkButton = null;
    const record = map("answers")[q.id];
    function displayResult() {
      const saved = map("answers")[q.id];
      if (!saved) return;
      const good = D.isCorrect(q, saved.value);
      lock();
      for (const control of controls) {
        if (q.kind === "choice") {
          control.classList.toggle(
            "is-correct",
            D.isCorrect(q, control.dataset.value),
          );
          control.classList.toggle(
            "is-wrong",
            !good && control.dataset.value === saved.value,
          );
        }
      }
      feedback.className = "yt-feedback " + (good ? "is-correct" : "is-wrong");
      let answer = q.answer;
      if (q.kind === "clock")
        answer = `${q.hour}:${String(q.minute).padStart(2, "0")}`;
      if (q.kind === "mark")
        answer = q.targets.map((i) => q.text.split(/\s+/)[i]).join("، ");
      feedback.append(
        el(
          "strong",
          good
            ? t("أحسنت.", "Richtig.")
            : t("قارن بالتصحيح: ", "Vergleiche mit der Lösung: ") + answer,
        ),
        el("p", q.explanation || ""),
      );
      actions.replaceChildren(
        button(
          t("أحاول مجددًا", "Noch einmal"),
          () => {
            delete map("answers")[q.id];
            if (["order", "mark", "clock"].includes(q.kind))
              delete map("drafts")[q.id];
            persist();
            const next = taskCard(q);
            card.replaceWith(next);
            next
              .querySelector("input,select,textarea,button")
              ?.focus({ preventScroll: true });
            stats();
          },
          "practice-button yt-retry",
        ),
      );
    }
    function submit() {
      const value = getValue();
      map("answers")[q.id] = { value };
      persist();
      displayResult();
      stats();
    }
    if (q.kind === "choice") {
      answerArea.classList.add("yt-options");
      answerArea.setAttribute("role", "group");
      answerArea.setAttribute("aria-labelledby", prompt.id);
      for (const value of P.shuffle(q.options)) {
        const b = arabic(
          button(
            value,
            () => {
              map("answers")[q.id] = { value };
              persist();
              displayResult();
              stats();
            },
            "practice-button yt-option",
          ),
        );
        b.dataset.value = value;
        answerArea.append(b);
        controls.push(b);
      }
      lock = () => controls.forEach((b) => (b.disabled = true));
    } else if (q.kind === "input") {
      const input = arabic(
        el(q.answer.length > 45 ? "textarea" : "input", undefined, "yt-input"),
      );
      if (input.tagName === "INPUT") input.type = "text";
      else input.rows = 2;
      input.value =
        record?.value ??
        (typeof map("drafts")[q.id] === "string" ? map("drafts")[q.id] : "");
      input.maxLength = 2000;
      input.setAttribute("aria-labelledby", prompt.id);
      input.autocomplete = "off";
      input.addEventListener("input", () => {
        map("drafts")[q.id] = input.value;
        persist();
        if (checkButton) checkButton.disabled = !input.value.trim();
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          if (input.value.trim() && !record && !map("answers")[q.id]) submit();
        }
      });
      answerArea.append(input);
      getValue = () => input.value;
      lock = () => (input.disabled = true);
      checkButton = button(
        t("تحقق", "Prüfen"),
        submit,
        "practice-button primary-action yt-check",
      );
      checkButton.disabled = !input.value.trim();
      actions.append(checkButton);
    } else if (q.kind === "order") {
      let value = Array.isArray(map("drafts")[q.id])
        ? map("drafts")[q.id].filter(
            (i, j, all) =>
              Number.isInteger(i) &&
              i >= 0 &&
              i < q.tokens.length &&
              all.indexOf(i) === j,
          )
        : [];
      const selected = arabic(el("div", undefined, "yt-selected")),
        preview = arabic(el("p", undefined, "yt-order-preview")),
        bank = arabic(el("div", undefined, "yt-token-bank"));
      preview.setAttribute("aria-live", "polite");
      selected.setAttribute(
        "aria-label",
        t(
          "ترتيبك · انقر كلمة لإعادتها",
          "Deine Reihenfolge · Wort antippen zum Entfernen",
        ),
      );
      const tokens = new Array(q.tokens.length);
      function refresh() {
        selected.replaceChildren();
        for (const i of value) {
          const b = button(
            q.tokens[i],
            () => {
              value = value.filter((n) => n !== i);
              refresh();
              tokens[i].focus({ preventScroll: true });
            },
            "practice-button yt-selected-token",
          );
          b.dataset.selectedIndex = i;
          selected.append(b);
        }
        tokens.forEach((b, i) => (b.disabled = value.includes(i)));
        preview.textContent = value.map((i) => q.tokens[i]).join(D.joiner(q));
        map("drafts")[q.id] = value;
        persist();
        if (checkButton)
          checkButton.disabled = value.length !== q.tokens.length;
      }
      for (const item of P.shuffle(q.tokens.map((word, i) => ({ word, i })))) {
        const b = button(
          item.word,
          () => {
            value.push(item.i);
            refresh();
          },
          "practice-button yt-token",
        );
        b.dataset.tokenIndex = item.i;
        tokens[item.i] = b;
        bank.append(b);
      }
      getValue = () => value.map((i) => q.tokens[i]).join(D.joiner(q));
      lock = () => {
        tokens.forEach((b) => (b.disabled = true));
        selected.replaceChildren(
          arabic(el("span", map("answers")[q.id].value)),
        );
        preview.textContent = "";
      };
      checkButton = button(
        t("تحقق من الترتيب", "Reihenfolge prüfen"),
        submit,
        "practice-button primary-action yt-check",
      );
      actions.append(checkButton);
      answerArea.append(selected, preview, bank);
      refresh();
    } else if (q.kind === "mark") {
      let value = Array.isArray(map("drafts")[q.id])
        ? map("drafts")[q.id].filter(
            (i) =>
              Number.isInteger(i) && i >= 0 && i < q.text.split(/\s+/).length,
          )
        : [];
      const words = arabic(el("div", undefined, "yt-mark-words"));
      words.setAttribute("role", "group");
      words.setAttribute("aria-labelledby", prompt.id);
      q.text.split(/\s+/).forEach((word, i) => {
        const b = button(
          word,
          () => {
            value = value.includes(i)
              ? value.filter((n) => n !== i)
              : value.concat(i);
            updateMark();
            map("drafts")[q.id] = value;
            persist();
          },
          "practice-button yt-mark",
        );
        b.dataset.wordIndex = i;
        controls.push(b);
        words.append(b);
      });
      function updateMark() {
        controls.forEach((b, i) =>
          b.setAttribute("aria-pressed", String(value.includes(i))),
        );
      }
      getValue = () => value;
      lock = () => {
        value = map("answers")[q.id].value;
        controls.forEach((b, i) => {
          b.disabled = true;
          b.setAttribute("aria-pressed", String(value.includes(i)));
          b.classList.toggle("is-correct", q.targets.includes(i));
          b.classList.toggle(
            "is-wrong",
            value.includes(i) && !q.targets.includes(i),
          );
        });
      };
      updateMark();
      checkButton = button(
        t("تحقق من التحديد", "Auswahl prüfen"),
        submit,
        "practice-button primary-action yt-check",
      );
      actions.append(checkButton);
      answerArea.append(words);
    } else if (q.kind === "clock") {
      let value = record?.value || map("drafts")[q.id];
      if (
        !value ||
        !Number.isInteger(value.hour) ||
        !Number.isInteger(value.minute)
      )
        value = { hour: null, minute: null };
      else value = { ...value };
      let mode = "hour",
        locked = false;
      const face = el("div", undefined, "yt-clock-holder"),
        fields = el("div", undefined, "yt-clock-fields"),
        modes = el("div", undefined, "practice-actions yt-clock-modes");
      const hour = el("select", undefined, "yt-clock-hour"),
        minute = el("select", undefined, "yt-clock-minute");
      for (const [control, key, max, start] of [
        [hour, "hour", 12, 1],
        [minute, "minute", 59, 0],
      ]) {
        const empty = el("option", t("اختر", "Wählen"));
        empty.value = "";
        control.append(empty);
        for (let n = start; n <= max; n++) {
          const o = el(
            "option",
            key === "minute" ? String(n).padStart(2, "0") : String(n),
          );
          o.value = n;
          control.append(o);
        }
        control.value = value[key] ?? "";
        const label = el(
          "label",
          t(
            key === "hour" ? "الساعة" : "الدقيقة",
            key === "hour" ? "Stunde" : "Minute",
          ),
        );
        label.append(control);
        fields.append(label);
        control.addEventListener("change", () => {
          value[key] = control.value === "" ? null : Number(control.value);
          refreshClock();
        });
      }
      const hourMode = button(
          t("عقرب الساعات", "Stundenzeiger"),
          () => {
            mode = "hour";
            updateModes();
          },
          "filter-chip",
        ),
        minuteMode = button(
          t("عقرب الدقائق", "Minutenzeiger"),
          () => {
            mode = "minute";
            updateModes();
          },
          "filter-chip",
        );
      modes.append(hourMode, minuteMode);
      function updateModes() {
        hourMode.setAttribute("aria-pressed", String(mode === "hour"));
        minuteMode.setAttribute("aria-pressed", String(mode === "minute"));
      }
      function refreshClock() {
        face.replaceChildren(clockFace(value));
        hour.value = value.hour ?? "";
        minute.value = value.minute ?? "";
        map("drafts")[q.id] = { ...value };
        persist();
        if (checkButton)
          checkButton.disabled = value.hour === null || value.minute === null;
      }
      function point(event) {
        const rect = face.getBoundingClientRect(),
          x = event.clientX - rect.left - rect.width / 2,
          y = event.clientY - rect.top - rect.height / 2;
        const degrees = ((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360;
        if (mode === "hour") value.hour = Math.round(degrees / 30) % 12 || 12;
        else value.minute = Math.round(degrees / 6) % 60;
        refreshClock();
      }
      face.addEventListener("pointerdown", (event) => {
        if (locked) return;
        event.preventDefault();
        face.setPointerCapture(event.pointerId);
        point(event);
      });
      face.addEventListener("pointermove", (event) => {
        if (!locked && face.hasPointerCapture(event.pointerId)) point(event);
      });
      face.addEventListener("pointerup", (event) => {
        if (face.hasPointerCapture(event.pointerId))
          face.releasePointerCapture(event.pointerId);
      });
      getValue = () => ({ ...value });
      lock = () => {
        locked = true;
        hour.disabled = true;
        minute.disabled = true;
        hourMode.disabled = true;
        minuteMode.disabled = true;
      };
      checkButton = button(
        t("تحقق من الوقت", "Uhrzeit prüfen"),
        submit,
        "practice-button primary-action yt-check",
      );
      actions.append(checkButton);
      answerArea.append(
        face,
        modes,
        fields,
        el(
          "p",
          t(
            "اختر العقرب ثم حرّكه على القرص، أو استخدم حقلي الساعة والدقيقة.",
            "Zeiger auswählen und auf dem Zifferblatt bewegen oder Stunde und Minute auswählen.",
          ),
          "yt-note",
        ),
      );
      updateModes();
      refreshClock();
    }
    card.append(answerArea, actions, feedback);
    displayResult();
    return card;
  }
  function renderTasks() {
    $("yt-tasks").replaceChildren();
    const tasks = activity().tasks.filter(
      (q) =>
        !$("yt-review").checked ||
        (q.kind !== "open" &&
          map("answers")[q.id] &&
          !D.isCorrect(q, map("answers")[q.id].value)),
    );
    tasks.forEach((q) => $("yt-tasks").append(taskCard(q)));
    $("yt-review-empty").hidden = !$("yt-review").checked || !!tasks.length;
  }
  function renderActivity() {
    const a = activity(),
      visible = filtered(),
      position = visible.findIndex((x) => x.id === a.id);
    $("yt-title").textContent = a.title;
    $("yt-directions").textContent = a.instructions;
    $("yt-meta").textContent =
      categoryName(D.units ? a.section : a.category) +
      (a.sourcePage ? t(" · ص ", " · S. ") + a.sourcePage : "") +
      t(" · الصورة ", " · Vorlage ") +
      (D.sources.findIndex((s) => s.photo === a.source) + 1);
    $("yt-position").textContent = `${position + 1} / ${visible.length}`;
    P.navigation($("yt-previous"), $("yt-next"), position, visible.length);
    context();
    renderTasks();
    stats();
    buildPrint([a]);
  }
  function buildPrint(items) {
    const doc = arabic($("yt-print"));
    doc.replaceChildren();
    doc.append(
      el("h1", C.title || "كتاب 3"),
      el(
        "p",
        "الاسم: .................................... التاريخ: ..............................",
      ),
    );
    for (const a of items) {
      const section = el("section", undefined, "yt-print-activity");
      section.append(el("h2", a.title), el("p", a.instructions));
      if (a.unit && D.units)
        section.append(
          el(
            "p",
            `الوحدة ${a.unit}: ${D.units.find((u) => u.number === a.unit).title}`,
          ),
        );
      if (a.dialogue)
        a.dialogue.forEach((turn) =>
          section.append(el("p", turn.speaker + ": " + turn.text)),
        );
      if (a.vocabulary)
        for (const word of a.vocabulary) {
          const row = el("p");
          if (word.image)
            row.append(asset(word.image, "", "book-print-word-image"));
          row.append(el("strong", word.ar + " — "), el("span", word.meaning));
          section.append(row);
        }
      if (a.rule) section.append(el("p", a.rule));
      if (a.passage) section.append(el("p", a.passage));
      if (a.diagram) section.append(diagram(a, true));
      for (const q of a.tasks) {
        const block = el("article", undefined, "yt-print-task");
        block.append(el("h3", q.prompt));
        if (q.image) block.append(asset(q.image, q.imageAlt, "yt-print-image"));
        if (q.kind === "choice")
          block.append(el("p", P.shuffle(q.options).join(" / ")));
        if (q.kind === "order")
          block.append(el("p", P.shuffle(q.tokens).join(" / ")));
        if (q.kind === "mark") block.append(el("p", q.text));
        if (q.kind === "clock")
          block.append(clockFace({ hour: null, minute: null }, true));
        if (q.audioText)
          block.append(
            el(
              "p",
              "تدريب استماع: يقرأ المعلّم الكلمة أو يُشغّل الصوت من التطبيق.",
            ),
          );
        block.append(
          el(
            "p",
            "................................................................................................",
          ),
        );
        if (q.kind === "open")
          block.append(
            el(
              "p",
              "................................................................................................",
            ),
            el(
              "p",
              "................................................................................................",
            ),
          );
        section.append(block);
      }
      doc.append(section);
    }
  }
  function applyFilters() {
    let visible = filtered();
    if (!visible.some((a) => a.id === state.active) && visible.length) {
      state.active = visible[0].id;
      try {
        history.replaceState(null, "", "#" + state.active);
      } catch (_) {}
    }
    persist();
    renderCatalog();
    if (visible.length) renderActivity();
    else {
      P.stop();
      stats();
    }
  }
  function navigate(id, focus = false) {
    if (!D.activities.some((a) => a.id === id)) return;
    P.stop();
    if (D.units && D.activities.find((a) => a.id === id).unit !== state.unit) {
      state.unit = D.activities.find((a) => a.id === id).unit;
      state.category = "all";
      state.search = "";
      $("yt-search").value = "";
    }
    state.active = id;
    persist();
    try {
      history.replaceState(null, "", "#" + id);
    } catch (_) {}
    renderCatalog();
    renderActivity();
    if (focus) {
      $("yt-title").scrollIntoView({ block: "start" });
      $("yt-title").focus({ preventScroll: true });
    }
  }
  function fromHash() {
    const id = location.hash.slice(1);
    if (D.units?.some((u) => u.id === id)) {
      state.unit = D.units.find((u) => u.id === id).number;
      state.active = D.activities.find((a) => a.unit === state.unit).id;
      state.category = "all";
      state.search = "";
      return;
    }
    if (D.activities.some((a) => a.id === id)) {
      const changed = state.active !== id;
      state.active = id;
      if (D.units) state.unit = D.activities.find((a) => a.id === id).unit;
      if (changed && !filtered().some((a) => a.id === id)) {
        state.category = "all";
        state.search = "";
      }
    }
  }
  if (D.units) {
    $("book-unit-previous").addEventListener("click", () =>
      chooseUnit(state.unit - 1, true),
    );
    $("book-unit-next").addEventListener("click", () =>
      chooseUnit(state.unit + 1, true),
    );
    $("book-print-unit").addEventListener("click", () => {
      P.stop();
      buildPrint(D.activities.filter((a) => a.unit === state.unit));
      window.print();
    });
  }
  fromHash();
  $("yt-search").value = state.search;
  $("yt-search").addEventListener("input", (event) => {
    state.search = event.target.value;
    applyFilters();
  });
  $("yt-select").addEventListener("change", (event) =>
    navigate(event.target.value),
  );
  $("yt-clear-filters").addEventListener("click", () => {
    state.category = "all";
    state.search = "";
    $("yt-search").value = "";
    applyFilters();
  });
  $("yt-previous").addEventListener("click", () => {
    const items = filtered(),
      i = items.findIndex((a) => a.id === state.active);
    if (i > 0) navigate(items[i - 1].id);
  });
  $("yt-next").addEventListener("click", () => {
    const items = filtered(),
      i = items.findIndex((a) => a.id === state.active);
    if (i < items.length - 1) navigate(items[i + 1].id);
  });
  $("yt-review").addEventListener("change", renderTasks);
  $("yt-reset").addEventListener("click", () => {
    state.answers[activity().id] = {};
    for (const q of activity().tasks)
      if (q.kind !== "open") delete map("drafts")[q.id];
    persist();
    renderActivity();
  });
  $("yt-print-activity").addEventListener("click", () => {
    P.stop();
    buildPrint([activity()]);
    window.print();
  });
  $("yt-print-source").addEventListener("click", () => {
    P.stop();
    buildPrint(
      D.activities.filter(
        (a) =>
          a.source === activity().source && (!D.units || a.unit === state.unit),
      ),
    );
    window.print();
  });
  window.addEventListener("hashchange", () => {
    P.stop();
    fromHash();
    $("yt-search").value = state.search;
    persist();
    renderCatalog();
    renderActivity();
  });
  P.onLanguage(() => {
    renderSources();
    applyFilters();
  });
})();
