(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const $ = (id) => document.getElementById(id);
    const { modes, createQuestions } = window.ArabicLetterTraining;
    const sessions = new Map();
    const titles = {
      names: ["الحرف واسمه", "Buchstabe und Name"],
      forms: ["أشكال الحرف", "Schreibformen erkennen"],
      missing: ["الحرف الناقص", "Fehlender Buchstabe"],
      listening: ["اسمع واختر", "Hören und zuordnen"],
    };
    const positions = [
      ["أول الكلمة", "Wortanfang"],
      ["وسط الكلمة", "Wortmitte"],
      ["آخر الكلمة منفصلًا", "Wortende ohne Verbindung"],
      ["آخر الكلمة متصلًا", "Wortende mit Verbindung"],
    ];
    let mode = null;
    const de = () => window.AppLanguage?.get() === "de";
    const text = (ar, german) => (de() ? german : ar);
    const pair = (value) => text(...value);
    function session() {
      if (!sessions.has(mode))
        sessions.set(mode, {
          questions: createQuestions(mode),
          index: 0,
          answers: [],
          finished: false,
        });
      return sessions.get(mode);
    }
    function render() {
      document
        .querySelectorAll("[data-training-mode]")
        .forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(b.dataset.trainingMode === mode),
          ),
        );
      if (!mode) {
        $("training-run").hidden = true;
        $("training-result").hidden = true;
        return;
      }
      const s = session(),
        q = s.questions[s.index];
      const answered = s.answers[s.index] !== undefined;
      const count = s.answers.filter((a) => a !== undefined).length;
      const correct = s.answers.filter(
        (a, i) => a === s.questions[i].correct,
      ).length;
      $("training-run").hidden = s.finished;
      $("training-result").hidden = !s.finished;
      $("training-title").textContent = pair(titles[mode]);
      $("training-counter").textContent = text(
        `السؤال ${s.index + 1} من ${s.questions.length}`,
        `Frage ${s.index + 1} von ${s.questions.length}`,
      );
      $("training-score").textContent = text(
        `${correct} من ${count} إجابات صحيحة`,
        `${correct} von ${count} richtig`,
      );
      $("training-progress").max = s.questions.length;
      $("training-progress").value = count;
      $("training-progress-label").textContent = text(
        `أجبت عن ${count} من ${s.questions.length}`,
        `${count} von ${s.questions.length} beantwortet`,
      );
      const prompts = {
        names: [
          "أي حرف يحمل هذا الاسم؟",
          "Welcher Buchstabe trägt diesen Namen?",
        ],
        forms: [
          "أي حرف يمثّله هذا الشكل؟",
          "Welchen Buchstaben zeigt diese Form?",
        ],
        missing: [
          "اختر الحرف الناقص لإكمال الكلمة.",
          "Ergänze den fehlenden Buchstaben.",
        ],
        listening: [
          "استمع إلى اسم الحرف، ثم اختر الحرف الصحيح.",
          "Höre den Buchstabennamen und wähle das richtige Zeichen.",
        ],
      };
      $("training-prompt").textContent = pair(prompts[mode]);
      const stimulus = $("training-stimulus");
      stimulus.replaceChildren();
      if (mode !== "listening") {
        const shown = document.createElement("p");
        shown.className =
          mode === "names" ? "training-letter-name" : "training-arabic";
        shown.textContent =
          mode === "names"
            ? text(q.letter.name, q.letter.de)
            : mode === "forms"
              ? q.shape
              : q.masked;
        shown.lang = mode === "names" && de() ? "de" : "ar";
        stimulus.append(shown);
        if (mode === "missing") {
          const meaning = document.createElement("p");
          meaning.lang = "de";
          meaning.className = "training-word-meaning";
          meaning.textContent = q.example.de;
          stimulus.append(meaning);
        }
      }
      $("training-listen").hidden = mode !== "listening";
      $("training-options").replaceChildren(
        ...q.options.map((option) => {
          const b = document.createElement("button");
          b.type = "button";
          b.lang = "ar";
          b.className = "training-option";
          b.textContent = option;
          b.disabled = answered;
          if (answered && option === q.correct) b.classList.add("is-correct");
          if (answered && option === s.answers[s.index] && option !== q.correct)
            b.classList.add("is-wrong");
          b.addEventListener("click", () => {
            if (s.answers[s.index] !== undefined) return;
            s.answers[s.index] = option;
            render();
          });
          return b;
        }),
      );
      const feedback = $("training-feedback");
      feedback.replaceChildren();
      feedback.className = "training-feedback";
      if (answered) {
        feedback.classList.add(
          s.answers[s.index] === q.correct ? "is-correct" : "is-wrong",
        );
        const heading = document.createElement("strong");
        heading.textContent =
          s.answers[s.index] === q.correct
            ? text("أحسنت!", "Richtig!")
            : text("لنتعلّم من الإجابة.", "Lerne aus der Antwort.");
        const explanation = document.createElement("p");
        explanation.textContent =
          mode === "names" || mode === "listening"
            ? text(
                `الحرف الصحيح «${q.correct}»، واسمه «${q.letter.name}».`,
                `Das Zeichen „${q.correct}“ heißt ${q.letter.de}.`,
              )
            : text(
                `الحرف «${q.correct}» في ${pair(positions[q.position])}، كما في «${q.example.word}».`,
                `„${q.correct}“ steht hier an der Position: ${pair(positions[q.position])}, wie in „${q.example.word}“.`,
              );
        const example = document.createElement("p");
        example.className = "training-example";
        example.lang = "ar";
        window.ArabicLetterExamples.highlight(
          example,
          q.example.word,
          q.example.index,
        );
        const meaning = document.createElement("p");
        meaning.lang = "de";
        meaning.textContent = q.example.de;
        feedback.append(heading, explanation, example, meaning);
        if (q.letter.nonjoining && mode === "forms") {
          const note = document.createElement("p");
          note.textContent = text(
            "هذا الحرف لا يتصل بالحرف الذي يليه؛ قد يتكرر شكله في أكثر من موضع.",
            "Dieser Buchstabe verbindet sich nicht mit dem folgenden Zeichen. Seine Form kann an mehreren Positionen gleich sein.",
          );
          feedback.append(note);
        }
      }
      $("training-previous").disabled = s.index === 0;
      $("training-next").disabled = !answered;
      $("training-next").textContent =
        s.index === s.questions.length - 1
          ? text("عرض النتيجة", "Ergebnis ansehen")
          : text("السؤال التالي", "Nächste Frage");
      $("training-result-score").textContent = text(
        `${correct} من ${s.questions.length} إجابة صحيحة · ${Math.round((correct / s.questions.length) * 100)}٪`,
        `${correct} von ${s.questions.length} richtig · ${Math.round((correct / s.questions.length) * 100)} %`,
      );
      $("training-result-message").textContent =
        correct === s.questions.length
          ? text(
              "أحسنت! تعرّفت على جميع الحروف في هذه الجولة.",
              "Sehr gut! Du hast in dieser Runde alle Buchstaben erkannt.",
            )
          : text(
              "راجع إجاباتك والشرح، ثم جرّب جولة جديدة بترتيب مختلف.",
              "Sieh dir deine Antworten und die Erklärungen an. Starte danach eine neue, anders gemischte Runde.",
            );
    }
    function clearAudio() {
      window.VocabApp.stopSpeech();
      $("training-audio-status").textContent = "";
      $("training-audio-status").classList.remove("speech-error");
    }
    function focusQuestion() {
      $("training-run").scrollIntoView({ block: "start" });
      $("training-prompt").focus({ preventScroll: true });
    }
    function selectFromHash() {
      clearAudio();
      const slug = location.hash.slice(1);
      mode = modes.includes(slug) ? slug : null;
      render();
      if (mode)
        $(
          session().finished ? "training-result" : "training-run",
        ).scrollIntoView({ block: "start" });
    }
    document.querySelectorAll("[data-training-mode]").forEach((b) =>
      b.addEventListener("click", () => {
        if (location.hash === `#${b.dataset.trainingMode}`) selectFromHash();
        else location.hash = b.dataset.trainingMode;
      }),
    );
    $("training-listen").addEventListener("click", () => {
      const q = session().questions[session().index];
      window.VocabApp.speakArabic(q.letter.name, (message, error) => {
        $("training-audio-status").textContent = message;
        $("training-audio-status").classList.toggle(
          "speech-error",
          Boolean(error),
        );
      });
    });
    $("training-previous").addEventListener("click", () => {
      const s = session();
      if (s.index === 0) return;
      clearAudio();
      s.index--;
      render();
      focusQuestion();
    });
    $("training-next").addEventListener("click", () => {
      const s = session();
      if (s.answers[s.index] === undefined) return;
      clearAudio();
      if (s.index === s.questions.length - 1) s.finished = true;
      else s.index++;
      render();
      if (s.finished) $("training-result").scrollIntoView({ block: "start" });
      else focusQuestion();
    });
    $("training-review").addEventListener("click", () => {
      const s = session();
      s.index = 0;
      s.finished = false;
      render();
      focusQuestion();
    });
    $("training-restart").addEventListener("click", () => {
      clearAudio();
      sessions.delete(mode);
      render();
      focusQuestion();
    });
    window.addEventListener("hashchange", selectFromHash);
    window.addEventListener("app-language-change", () => {
      clearAudio();
      render();
    });
    window.addEventListener("pagehide", () => window.VocabApp.stopSpeech());
    selectFromHash();
  });
})();
