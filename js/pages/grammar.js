(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const { lessons } = window.ArabicGrammarData;
    const $ = (id) => document.getElementById(id);
    const escape = window.VocabApp.escapeHTML;
    const language = () => (window.AppLanguage?.get() === "de" ? "de" : "ar");
    const localized = (value) =>
      typeof value === "string" ? value : value[language()];
    const text = (ar, de) => (language() === "ar" ? ar : de);
    const sessions = new Map();
    let current = lessons[0];
    function session() {
      if (!sessions.has(current.id))
        sessions.set(current.id, { index: 0, answers: [] });
      return sessions.get(current.id);
    }
    function renderTopics() {
      $("grammar-topics").innerHTML = lessons
        .map(
          (lesson, index) =>
            `<a href="#${lesson.id}" class="grammar-topic ${lesson.id === current.id ? "is-active" : ""}" ${lesson.id === current.id ? 'aria-current="true"' : ""}><span class="grammar-topic-number">0${index + 1}</span><span class="grammar-topic-glyph" lang="ar" aria-hidden="true">${escape(lesson.glyph)}</span><strong>${escape(localized(lesson.title))}</strong><small>${escape(localized(lesson.summary))}</small></a>`,
        )
        .join("");
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
      const correctCount = state.answers.filter(
        (answer, index) => answer === current.questions[index].correct,
      ).length;
      $("grammar-score").textContent = text(
        `${correctCount} من ${state.answers.length} إجابات صحيحة`,
        `${correctCount} von ${state.answers.length} richtig`,
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
    }
    $("grammar-next").addEventListener("click", () => {
      const state = session();
      if (state.answers[state.index] === undefined) return;
      if (state.index === current.questions.length - 1) {
        state.index = 0;
        state.answers = [];
      } else state.index++;
      renderPractice();
      $("grammar-question").tabIndex = -1;
      $("grammar-question").focus({ preventScroll: true });
    });
    function selectTopic() {
      const slug = location.hash.slice(1);
      current = lessons.find((lesson) => lesson.id === slug) || lessons[0];
      renderLesson();
    }
    window.addEventListener("hashchange", selectTopic);
    window.addEventListener("app-language-change", renderLesson);
    selectTopic();
  });
})();
