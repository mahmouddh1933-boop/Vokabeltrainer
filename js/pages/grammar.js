(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const { lessons, stages = [] } = window.ArabicGrammarData;
    const $ = (id) => document.getElementById(id);
    const escape = window.VocabApp.escapeHTML;
    const language = () => (window.AppLanguage?.get() === "de" ? "de" : "ar");
    const localized = (value) =>
      typeof value === "string" ? value : value[language()];
    const text = (ar, de) => (language() === "ar" ? ar : de);
    const sessions = new Map();
    let current = lessons[0];
    const pathState = () => window.VocabApp.getStats().grammarPathV1 || {};
    function session() {
      if (!sessions.has(current.id)) {
        const saved = pathState().lessons?.[current.id] || {};
        const answers = Array.isArray(saved.answers) ? saved.answers.slice(0, current.questions.length).map((a, i) =>
          Number.isInteger(a) && a >= 0 && a < current.questions[i].options.length ? a : undefined) : [];
        sessions.set(current.id, { index: Number.isInteger(saved.index) && saved.index >= 0 && saved.index < current.questions.length ? saved.index : 0, answers });
      }
      return sessions.get(current.id);
    }
    function persist() {
      const stats = window.VocabApp.getStats();
      const prior = stats.grammarPathV1 || {};
      window.VocabApp.setJSON("learningStats", { ...stats, grammarPathV1: {
        lastLesson: current.id, lessons: { ...prior.lessons, [current.id]: session() },
      }});
    }
    function mastered(lesson) {
      const answers = (sessions.get(lesson.id) || pathState().lessons?.[lesson.id] || {}).answers || [];
      return lesson.questions.every((q, i) => Number.isInteger(answers[i])) &&
        lesson.questions.filter((q, i) => q.correct === answers[i]).length / lesson.questions.length >= .8;
    }
    function resumeTarget() {
      const last = lessons.find(l => l.id === pathState().lastLesson);
      return last && !mastered(last) ? last : lessons.find(l => !mastered(l)) || lessons[0];
    }
    function renderPath() {
      const stageValue = $("grammar-stage").value || "all";
      $("grammar-stage").replaceChildren(new Option(text("كل المراحل", "Alle Stufen"), "all"), ...stages.map(s => new Option(localized(s.title), s.id)));
      $("grammar-stage").value = stageValue;
      $("grammar-stages").innerHTML = stages.map(s => {
        const bank = lessons.filter(l => l.stage === s.id);
        const done = bank.filter(mastered).length;
        return `<button type="button" data-grammar-stage="${s.id}" aria-pressed="${stageValue === s.id}"><strong>${escape(localized(s.title))}</strong><span>${escape(localized(s.description))}</span><small>${done} / ${bank.length} ${text("دروس متقنة", "Lektionen beherrscht")}</small><progress value="${done}" max="${bank.length}"></progress></button>`;
      }).join("");
      $("grammar-stages").querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
        $("grammar-stage").value = b.dataset.grammarStage;
        filterCatalog();
      }));
      $("grammar-path-progress").textContent = text(`${lessons.filter(mastered).length} من ${lessons.length} درسًا متقنًا · يُحفظ موضعك وإجاباتك تلقائيًّا.`, `${lessons.filter(mastered).length} von ${lessons.length} Lektionen beherrscht · Position und Antworten werden automatisch gespeichert.`);
      $("grammar-resume").textContent = text("تابع: ", "Weiter: ") + localized(resumeTarget().title);
      $("grammar-total-summary").textContent = text(`${lessons.length} درسًا · ${lessons.reduce((n,l)=>n+l.questions.length,0)} سؤالًا مع شرح الإجابات.`, `${lessons.length} Lektionen · ${lessons.reduce((n,l)=>n+l.questions.length,0)} Fragen mit Erklärungen.`);
    }
    const normalize = (value) =>
      value
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .replace(/[أإآ]/g, "ا")
        .toLocaleLowerCase()
        .trim();
    const searchIndex = new Map(
      lessons.map((lesson) => [
        lesson.id,
        normalize(
          [
            lesson.title.ar,
            lesson.title.de,
            lesson.summary.ar,
            lesson.summary.de,
            lesson.intro.ar,
            lesson.intro.de,
          ].join(" "),
        ),
      ]),
    );
    function matches() {
      const query = normalize($("grammar-search").value);
      const category = $("grammar-category").value;
      return lessons.filter(
        (lesson) =>
          (category === "all" || lesson.category === category) &&
          ($("grammar-stage").value === "all" || lesson.stage === $("grammar-stage").value) &&
          searchIndex.get(lesson.id).includes(query),
      );
    }
    function renderTopics() {
      const filtered = matches();
      $("grammar-topics").innerHTML = filtered
        .map(
          (lesson) =>
            `<a href="#${lesson.id}" class="grammar-topic ${lesson.id === current.id ? "is-active" : ""}" ${lesson.id === current.id ? 'aria-current="true"' : ""}><span class="grammar-topic-number">${String(lessons.indexOf(lesson) + 1).padStart(2, "0")}</span><span class="grammar-topic-glyph" lang="ar" aria-hidden="true">${escape(lesson.glyph)}</span><strong>${escape(localized(lesson.title))}</strong><small>${escape(localized(lesson.summary))}</small></a>`,
        )
        .join("");
      $("grammar-lesson-select").replaceChildren(
        ...filtered.map((lesson) => {
          const option = document.createElement("option");
          option.value = lesson.id;
          option.textContent = `${String(lessons.indexOf(lesson) + 1).padStart(2, "0")} · ${localized(lesson.title)} · ${lesson.questions.length} ${text("سؤالًا", "Fragen")}`;
          return option;
        }),
      );
      $("grammar-lesson-select").value = current.id;
      $("grammar-lesson-select").disabled = !filtered.length;
      $("grammar-catalog-count").textContent = text(
        `${filtered.length} من ${lessons.length} درسًا · ${filtered.reduce((sum, l) => sum + l.questions.length, 0)} سؤالًا في النتائج`,
        `${filtered.length} von ${lessons.length} Lektionen · ${filtered.reduce((sum, l) => sum + l.questions.length, 0)} Fragen in der Auswahl`,
      );
      $("grammar-catalog-empty").hidden = !!filtered.length;
      $("grammar-lesson").hidden = !filtered.length;
      $("grammar-index").hidden = !filtered.length;
    }
    function exampleHTML(example) {
      const index = example.focus ? example.ar.indexOf(example.focus) : -1;
      const word =
        index < 0
          ? escape(example.ar)
          : `${escape(example.ar.slice(0, index))}<mark>${escape(example.focus)}</mark>${escape(example.ar.slice(index + example.focus.length))}`;
      return `<figure class="grammar-example"><p lang="ar">${word}</p><figcaption lang="de">${escape(example.de)}</figcaption>${example.note ? `<p class="grammar-example-note">${escape(localized(example.note))}</p>` : ""}</figure>`;
    }
    function tableHTML(table) {
      return `<div class="grammar-table-wrap" tabindex="0" role="region" aria-label="${escape(localized(current.title))}"><table class="grammar-table grammar-columns-${table.headers.length}"><caption class="sr-only">${escape(localized(current.title))}</caption><thead><tr>${table.headers.map((h) => `<th scope="col">${escape(localized(h))}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell, index) => `<${index === 0 ? 'th scope="row"' : "td"}${cell.lang ? ` lang="${cell.lang}"` : ""}>${escape(cell.text || localized(cell))}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    function renderLesson() {
      persist();
      renderTopics();
      $("lesson-counter").textContent = text(
        `الدرس ${lessons.indexOf(current) + 1} من ${lessons.length}`,
        `LEKTION ${lessons.indexOf(current) + 1} VON ${lessons.length}`,
      );
      $("lesson-title").textContent = localized(current.title);
      $("lesson-intro").textContent = localized(current.intro);
      $("lesson-glyph").textContent = current.glyph;
      $("lesson-sections").innerHTML = current.sections
        .map(
          (section, index) =>
            `<section class="lesson-section" aria-labelledby="lesson-section-${index}"><div class="lesson-section-heading"><span>0${index + 1}</span><h3 id="lesson-section-${index}">${escape(localized(section.title))}</h3></div><p class="lesson-body">${escape(localized(section.body))}</p>${section.letters ? `<div class="grammar-letter-set" aria-label="${escape(localized(section.title))}">${section.letters.map((letter) => `<span lang="ar">${letter}</span>`).join("")}</div>` : ""}${section.table ? tableHTML(section.table) : ""}${section.examples ? `<div class="grammar-examples">${section.examples.map(exampleHTML).join("")}</div>` : ""}</section>`,
        )
        .join("");
      $("lesson-takeaway").textContent = localized(current.takeaway);
      const stage = stages.find(s => s.id === current.stage);
      $("grammar-lesson-stage").textContent = stage ? localized(stage.title) : "";
      $("grammar-prerequisites").innerHTML = (current.prerequisites || []).filter(id => lessons.some(l => l.id === id)).length
        ? `<span>${text("قبل هذا الدرس راجع: ", "Vorher wiederholen: ")}</span>` + current.prerequisites.map(id => lessons.find(l => l.id === id)).filter(Boolean).map(l => `<a href="#${l.id}">${escape(localized(l.title))}</a>`).join(" · ") : "";
      const position = lessons.indexOf(current);
      $("grammar-lesson-route").innerHTML = [position > 0 ? `<a href="#${lessons[position-1].id}">${text("الدرس السابق: ", "Vorherige Lektion: ")}${escape(localized(lessons[position-1].title))}</a>` : "", position < lessons.length-1 ? `<a href="#${lessons[position+1].id}">${text("الدرس التالي: ", "Nächste Lektion: ")}${escape(localized(lessons[position+1].title))}</a>` : ""].join("");
      $("lesson-verb-link").hidden = !["pronouns", "basic-verbs"].includes(
        current.id,
      );
      renderPractice();
    }
    function renderPractice() {
      const state = session(),
        question = current.questions[state.index];
      const selected = state.answers[state.index];
      const answered = selected !== undefined;
      const answeredCount = state.answers.filter(
        (answer) => answer !== undefined,
      ).length;
      $("grammar-progress").max = current.questions.length;
      $("grammar-progress").value = answeredCount;
      $("grammar-progress-label").textContent = text(
        `أجبت عن ${answeredCount} من ${current.questions.length} سؤالًا`,
        `${answeredCount} von ${current.questions.length} Fragen beantwortet`,
      );
      $("grammar-previous").disabled = state.index === 0;
      const correctCount = state.answers.filter(
        (answer, index) => answer === current.questions[index].correct,
      ).length;
      $("grammar-score").textContent = text(
        `${correctCount} من ${answeredCount} إجابات صحيحة`,
        `${correctCount} von ${answeredCount} richtig`,
      );
      $("grammar-question-number").textContent = text(
        `السؤال ${state.index + 1} من ${current.questions.length}`,
        `Frage ${state.index + 1} von ${current.questions.length}`,
      );
      $("grammar-question").textContent = localized(question.prompt);
      $("grammar-answers").replaceChildren(
        ...question.options.map((option, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "grammar-answer";
          if (typeof option === "string") button.lang = "ar";
          button.textContent = localized(option);
          button.disabled = answered;
          if (answered && index === question.correct)
            button.classList.add("is-correct");
          if (answered && index === selected && selected !== question.correct)
            button.classList.add("is-wrong");
          button.addEventListener("click", () => {
            if (state.answers[state.index] !== undefined) return;
            state.answers[state.index] = index;
            persist();
            renderPractice();
          });
          return button;
        }),
      );
      const feedback = $("grammar-feedback");
      feedback.replaceChildren();
      feedback.className = "grammar-feedback";
      if (answered) {
        feedback.classList.add(
          selected === question.correct ? "is-correct" : "is-wrong",
        );
        const heading = document.createElement("strong");
        heading.textContent =
          selected === question.correct
            ? text("أحسنت!", "Richtig!")
            : text("لنتعلّم من الإجابة.", "Lerne aus der Antwort.");
        heading.textContent += " " + VocabApp.encouragement(selected === question.correct);
        const answer = document.createElement("p");
        const prefix = document.createElement("span");
        prefix.textContent = text("الإجابة الصحيحة: ", "Richtige Antwort: ");
        const choice = document.createElement("bdi");
        choice.textContent = localized(question.options[question.correct]);
        if (typeof question.options[question.correct] === "string")
          choice.lang = "ar";
        answer.append(prefix, choice);
        const explanation = document.createElement("p");
        explanation.textContent = localized(question.explanation);
        feedback.append(heading, answer, explanation);
      }
      $("grammar-next").disabled = !answered;
      $("grammar-next").textContent =
        state.index === current.questions.length - 1
          ? text("إعادة التمرين", "Übung wiederholen")
          : text("السؤال التالي", "Nächste Frage");
      renderPath();
    }
    $("grammar-next").addEventListener("click", () => {
      const state = session();
      if (state.answers[state.index] === undefined) return;
      if (state.index === current.questions.length - 1) {
        state.index = 0;
        state.answers = [];
      } else state.index++;
      persist();
      renderPractice();
      $("grammar-question").tabIndex = -1;
      $("grammar-question").focus({ preventScroll: true });
    });
    $("grammar-previous").addEventListener("click", () => {
      const state = session();
      if (state.index === 0) return;
      state.index--;
      persist();
      renderPractice();
      $("grammar-question").tabIndex = -1;
      $("grammar-question").focus({ preventScroll: true });
    });
    function resetFilters() {
      $("grammar-search").value = "";
      $("grammar-category").value = "all";
      $("grammar-stage").value = "all";
    }
    function filterCatalog() {
      const filtered = matches();
      if (filtered.length && !filtered.includes(current)) {
        current = filtered[0];
        try { history.replaceState(null, "", `#${current.id}`); } catch (_) {}
      }
      renderLesson();
    }
    $("grammar-search").addEventListener("input", filterCatalog);
    $("grammar-category").addEventListener("change", filterCatalog);
    $("grammar-stage").addEventListener("change", filterCatalog);
    $("grammar-resume").addEventListener("click", () => {
      const id = resumeTarget().id;
      if (location.hash === `#${id}`) { resetFilters(); renderLesson(); }
      else location.hash = id;
      $("grammar-lesson").scrollIntoView({ block: "start", behavior: "smooth" });
    });
    $("grammar-clear-search").addEventListener("click", () => {
      resetFilters();
      filterCatalog();
      $("grammar-search").focus();
    });
    $("grammar-lesson-select").addEventListener("change", (event) => {
      location.hash = event.target.value;
      $("grammar-index").open = false;
      $("grammar-lesson").scrollIntoView({ block: "start" });
    });
    for (const id of ["grammar-lesson-route", "grammar-prerequisites"])
      $(id).addEventListener("click", event => {
        if (event.target.closest("a")) $("grammar-lesson").scrollIntoView({ block: "start" });
      });
    function selectTopic() {
      const slug = location.hash.slice(1);
      current = lessons.find((lesson) => lesson.id === slug) || resumeTarget();
      if (!matches().includes(current)) resetFilters();
      renderLesson();
    }
    window.addEventListener("hashchange", selectTopic);
    window.addEventListener("app-language-change", renderLesson);
    selectTopic();
  });
})();
