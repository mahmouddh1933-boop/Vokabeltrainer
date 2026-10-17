(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const { verbs, pronouns, parts, conjugate } = window.VerbLessonData;
    const $ = (id) => document.getElementById(id);
    const escape = window.VocabApp.escapeHTML;
    let verb = verbs[0],
      tense = "past",
      question = null;
    let answered = false,
      selected = null,
      attempts = 0,
      correctCount = 0;
    const lang = () => (window.AppLanguage?.get() === "de" ? "de" : "ar");
    const text = (ar, de) => (lang() === "ar" ? ar : de);
    const shuffle = (list) => window.VocabApp.shuffle(list);
    function formHTML(person) {
      const [prefix, stem, suffix] = parts(verb, tense, person);
      return `${prefix ? `<mark>${escape(prefix)}</mark>` : ""}${escape(stem)}<mark>${escape(suffix)}</mark>`;
    }
    function renderLesson() {
      $("verb-select").replaceChildren(
        ...verbs.map((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = `${item.pastStem}َ — ${item.meaning[lang()]}`;
          return option;
        }),
      );
      $("verb-select").value = verb.id;
      document
        .querySelectorAll("[data-tense]")
        .forEach((button) =>
          button.setAttribute(
            "aria-pressed",
            String(button.dataset.tense === tense),
          ),
        );
      $("verb-meaning").textContent = verb.meaning[lang()];
      $("verb-feature-form").textContent = conjugate(verb, tense, pronouns[8]);
      $("verb-pattern").textContent = text(
        tense === "past" ? "الماضي · هُوَ" : "المضارع المرفوع · هُوَ",
        tense === "past" ? "Perfekt · er" : "Präsens (Indikativ) · er",
      );
      $("verb-example").textContent = verb.example[tense][0];
      $("verb-example-translation").textContent = verb.example[tense][1];
      $("conjugation-caption").textContent = text(
        `تصريف ${verb.pastStem}َ في ${tense === "past" ? "الماضي" : "المضارع المرفوع"}`,
        `${verb.meaning.de} · ${tense === "past" ? "Perfekt" : "Präsens"}`,
      );
      $("conjugation-body").innerHTML = pronouns
        .map(
          (person, index) =>
            `<tr${[2, 8].includes(index) ? ' class="person-group-start"' : ""}><th scope="row" lang="ar">${escape(person.ar)}</th><td>${escape(lang() === "ar" ? person.description : person.de)}</td><td class="verb-form" lang="ar">${formHTML(person)}</td></tr>`,
        )
        .join("");
    }
    function renderPractice() {
      const person = pronouns[question.personIndex];
      const tenseName = text(
        tense === "past" ? "الماضي" : "المضارع",
        tense === "past" ? "Perfekt" : "Präsens",
      );
      $("verb-question").innerHTML =
        `<span>${escape(text(`اختر تصريف الفعل «${verb.pastStem}َ» في ${tenseName} مع:`, `Konjugiere „${verb.meaning.de}“ im ${tenseName} für:`))}</span><strong lang="ar">${escape(person.ar)}</strong><small>${escape(lang() === "ar" ? person.description : person.de)}</small>`;
      $("verb-score").textContent = text(
        `${correctCount} من ${attempts} إجابات صحيحة`,
        `${correctCount} von ${attempts} richtig`,
      );
      $("verb-answers").replaceChildren(
        ...question.options.map((form) => {
          const button = document.createElement("button");
          button.type = "button";
          button.lang = "ar";
          button.textContent = form;
          button.className = "verb-answer";
          button.disabled = answered;
          if (answered && form === question.correct)
            button.classList.add("is-correct");
          else if (answered && form === selected)
            button.classList.add("is-wrong");
          button.addEventListener("click", () => {
            if (answered) return;
            answered = true;
            selected = form;
            attempts += 1;
            if (form === question.correct) correctCount += 1;
            renderPractice();
          });
          return button;
        }),
      );
      const feedback = $("verb-feedback");
      feedback.className = `verb-feedback${answered ? (selected === question.correct ? " is-correct" : " is-wrong") : ""}`;
      feedback.replaceChildren();
      if (answered) {
        const message = document.createElement("span");
        message.textContent =
          selected === question.correct
            ? text(
                "أحسنت! التصريف الصحيح هو: ",
                "Richtig! Die passende Form ist: ",
              )
            : text(
                "لنحاول التعلّم من الإجابة. التصريف الصحيح هو: ",
                "Lerne aus der Antwort. Die richtige Form ist: ",
              );
        const form = document.createElement("bdi");
        form.lang = "ar";
        form.textContent = `${person.ar} ${question.correct}`;
        const explanation = document.createElement("span");
        explanation.textContent = text(
          ` — هذه صيغة ${tenseName} مع ${person.description}. قارنها بالسطر الموافق في الجدول.`,
          ` — ${tenseName} für „${person.de}“. Vergleiche die passende Zeile in der Tabelle.`,
        );
        feedback.append(message, form, explanation);
      }
    }
    function newQuestion() {
      const previous = question?.personIndex;
      const candidates = pronouns
        .map((_, index) => index)
        .filter((index) => index !== previous);
      const personIndex = shuffle(candidates)[0];
      const correct = conjugate(verb, tense, pronouns[personIndex]);
      const distractors = shuffle(
        [
          ...new Set(pronouns.map((person) => conjugate(verb, tense, person))),
        ].filter((form) => form !== correct),
      ).slice(0, 3);
      question = {
        personIndex,
        correct,
        options: shuffle([correct, ...distractors]),
      };
      answered = false;
      selected = null;
      renderPractice();
    }
    $("verb-select").addEventListener("change", (event) => {
      verb = verbs.find((item) => item.id === event.target.value);
      renderLesson();
      newQuestion();
    });
    document.querySelectorAll("[data-tense]").forEach((button) =>
      button.addEventListener("click", () => {
        if (tense === button.dataset.tense) return;
        tense = button.dataset.tense;
        renderLesson();
        newQuestion();
      }),
    );
    $("verb-next").addEventListener("click", newQuestion);
    window.addEventListener("app-language-change", () => {
      renderLesson();
      renderPractice();
    });
    renderLesson();
    newQuestion();
  });
})();
