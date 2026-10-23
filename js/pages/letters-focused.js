(() => {
  "use strict";
  const sessionStorage = window.JisrStorage.session;
  window.JisrStorage.ready(() => {
    const $ = (id) => document.getElementById(id);
    const { letters } = window.ArabicLetterData;
    const { createLetterQuestions, isCorrectAnswer } =
      window.ArabicLetterFocused;
    const saved = Number(sessionStorage.getItem("lettersLastIndex"));
    let letter = letters[saved] || letters[0],
      mode = "forms";
    const sessions = new Map();
    const text = (ar, de) => (window.AppLanguage?.get() === "de" ? de : ar);
    const name = () => text(letter.name, letter.de);
    const positions = {
      start: ["أول الكلمة", "Wortanfang"],
      middle: ["وسط الكلمة", "Wortmitte"],
      end: ["آخر الكلمة", "Wortende"],
    };
    const shapes = {
      initial: ["متصل بما بعده فقط", "nur mit dem folgenden Zeichen verbunden"],
      medial: ["متصل بما قبله وما بعده", "auf beiden Seiten verbunden"],
      isolated: ["غير متصل", "ohne Verbindung"],
      final: ["متصل بما قبله فقط", "nur mit dem vorherigen Zeichen verbunden"],
    };
    const shapeIndices = { initial: 0, medial: 1, isolated: 2, final: 3 };
    const localized = (pair) => text(...pair);
    const key = () => `${letter.char}:${mode}`;
    function session() {
      if (!sessions.has(key()))
        sessions.set(key(), {
          questions: createLetterQuestions(letter.char, mode),
          index: 0,
          answers: [],
          drafts: new Map(),
          finished: false,
        });
      return sessions.get(key());
    }
    function labelOption(q, option) {
      return q.kind === "shape"
        ? localized(shapes[option])
        : q.kind === "position"
          ? localized(positions[option])
          : option;
    }
    function render() {
      const state = session(),
        q = state.questions[state.index],
        answer = state.answers[state.index],
        answered = answer !== undefined;
      const count = state.answers.filter((a) => a !== undefined).length;
      const correct = state.answers.filter((a, i) =>
        isCorrectAnswer(state.questions[i], a),
      ).length;
      $("focused-heading").textContent = text(
        `تدريبات حرف ${name()}`,
        `Übungen für ${name()}`,
      );
      $("focused-intro").textContent = text(
        `تدرّب على «${letter.char}» في 48 سؤالًا ولوحة. تتبدّل التدريبات مع البطاقة أعلاه.`,
        `48 Fragen und Suchfelder für „${letter.char}“. Die Übungen folgen der Karte oben.`,
      );
      $("focused-badge").textContent = letter.char;
      document
        .querySelectorAll("[data-focused-mode]")
        .forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(b.dataset.focusedMode === mode),
          ),
        );
      const titles = {
        forms: text(`أشكال حرف ${name()}`, `Formen von ${name()}`),
        missing: text(
          `الحرف الناقص: ${name()}`,
          `Fehlender Buchstabe: ${name()}`,
        ),
        circle: text(`ضع دائرة حول حرف ${name()}`, `Kreise ${name()} ein`),
      };
      $("focused-mode-title").textContent = titles[mode];
      $("focused-run").hidden = state.finished;
      $("focused-result").hidden = !state.finished;
      $("focused-score").textContent = text(
        `${correct} من ${count} إجابات صحيحة`,
        `${correct} von ${count} richtig`,
      );
      $("focused-counter").textContent = text(
        `${mode === "circle" ? "اللوحة" : "السؤال"} ${state.index + 1} من ${state.questions.length}`,
        `${mode === "circle" ? "Feld" : "Frage"} ${state.index + 1} von ${state.questions.length}`,
      );
      $("focused-progress").max = state.questions.length;
      $("focused-progress").value = count;
      $("focused-progress-label").textContent = text(
        `أجبت عن ${count} من ${state.questions.length}`,
        `${count} von ${state.questions.length} beantwortet`,
      );
      const prompts = {
        shape: text(
          `اختر شكل «${letter.char}» المناسب للمربع في الكلمة.`,
          `Welche Form von „${letter.char}“ passt in die Lücke?`,
        ),
        position: text(
          `أين يقع حرف «${letter.char}» الملوّن في هذه الكلمة؟`,
          `Wo steht das markierte „${letter.char}“ in diesem Wort?`,
        ),
        missing: text(
          `أكمل الكلمة باختيار حرف ${name()}.`,
          `Ergänze das Wort mit ${name()}.`,
        ),
        circle: text(
          `ضع دائرة حول كل أشكال حرف «${letter.char}». اضغط الحرف لتحديده، واضغطه مرة أخرى لإلغاء الدائرة.`,
          `Kreise alle Formen von „${letter.char}“ ein. Tippe zum Markieren und erneut zum Entfernen des Kreises.`,
        ),
      };
      $("focused-prompt").textContent = prompts[q.kind];
      const stimulus = $("focused-stimulus");
      stimulus.replaceChildren();
      if (q.example) {
        const word = document.createElement("p");
        word.className = "focused-word";
        word.lang = "ar";
        if (q.kind === "position")
          window.ArabicLetterExamples.highlight(
            word,
            q.example.word,
            q.example.index,
          );
        else word.textContent = q.masked;
        const meaning = document.createElement("p");
        meaning.className = "focused-meaning";
        meaning.lang = "de";
        meaning.textContent = q.example.de;
        stimulus.append(word, meaning);
      }
      const options = $("focused-options");
      options.replaceChildren();
      options.className = `focused-options focused-${q.kind}`;
      $("focused-check").hidden = q.kind !== "circle";
      if (q.kind === "circle") {
        if (!state.drafts.has(state.index))
          state.drafts.set(state.index, new Set());
        const selected = answered
          ? new Set(answer)
          : state.drafts.get(state.index);
        q.cells.forEach((cell, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "focused-letter-cell";
          button.lang = "ar";
          button.textContent = cell.glyph;
          button.disabled = answered;
          button.setAttribute(
            "aria-label",
            text(
              `الخانة ${index + 1}: ${cell.letter}`,
              `Feld ${index + 1}: ${cell.letter}`,
            ),
          );
          button.setAttribute("aria-pressed", String(selected.has(index)));
          if (answered && q.correct.includes(index))
            button.classList.add("is-correct");
          if (answered && selected.has(index) && !q.correct.includes(index))
            button.classList.add("is-wrong");
          if (answered && !selected.has(index) && q.correct.includes(index))
            button.classList.add("was-missed");
          button.addEventListener("click", () => {
            if (state.answers[state.index] !== undefined) return;
            if (selected.has(index)) selected.delete(index);
            else selected.add(index);
            button.setAttribute("aria-pressed", String(selected.has(index)));
            $("focused-check").disabled = selected.size === 0;
          });
          options.append(button);
        });
        $("focused-check").disabled = answered || !selected.size;
      } else
        q.options.forEach((option) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "focused-answer";
          button.disabled = answered;
          if (q.kind === "shape") {
            const glyph = document.createElement("span");
            glyph.lang = "ar";
            glyph.className = "focused-shape";
            glyph.textContent = letter.forms[shapeIndices[option]];
            const label = document.createElement("span");
            label.textContent = labelOption(q, option);
            button.append(glyph, label);
          } else {
            button.textContent = labelOption(q, option);
            if (q.kind === "missing") button.lang = "ar";
          }
          if (answered && option === q.correct)
            button.classList.add("is-correct");
          if (answered && option === answer && option !== q.correct)
            button.classList.add("is-wrong");
          button.addEventListener("click", () => {
            if (state.answers[state.index] !== undefined) return;
            state.answers[state.index] = option;
            render();
          });
          options.append(button);
        });
      const feedback = $("focused-feedback");
      feedback.replaceChildren();
      feedback.className = "focused-feedback";
      if (answered) {
        const right = isCorrectAnswer(q, answer);
        feedback.classList.add(right ? "is-correct" : "is-wrong");
        const heading = document.createElement("strong");
        heading.textContent = right
          ? text("أحسنت! إجابة صحيحة.", "Richtig! Sehr gut.")
          : text("لنتعلّم من الإجابة.", "Lerne aus der Antwort.");
        heading.textContent += " " + VocabApp.encouragement(right);
        const explanation = document.createElement("p");
        if (q.kind === "circle") {
          const found = answer.filter((i) => q.correct.includes(i)).length;
          const extra = answer.length - found;
          explanation.textContent = text(
            `تحتوي اللوحة على ${q.correct.length} أشكال للحرف «${letter.char}». حدّدت ${found} منها، وحدّدت ${extra} من الحروف الأخرى. الدوائر الخضراء تبيّن الإجابة الصحيحة.`,
            `Es gibt ${q.correct.length} Formen von „${letter.char}“. Du hast ${found} davon und ${extra} andere Zeichen markiert. Grüne Kreise zeigen die richtigen Zeichen.`,
          );
        } else
          explanation.textContent = text(
            `الحرف «${letter.char}» في ${localized(positions[q.position])} في «${q.example.word}»، وشكله هنا ${localized(shapes[q.shape])}.`,
            `„${letter.char}“ steht in „${q.example.word}“ an der Position ${localized(positions[q.position])}; seine Form ist ${localized(shapes[q.shape])}.`,
          );
        feedback.append(heading, explanation);
        if (q.example) {
          const example = document.createElement("p");
          example.className = "focused-feedback-word";
          example.lang = "ar";
          window.ArabicLetterExamples.highlight(
            example,
            q.example.word,
            q.example.index,
          );
          feedback.append(example);
        }
        if (letter.nonjoining && q.kind === "shape") {
          const note = document.createElement("p");
          note.textContent = text(
            "هذا الحرف لا يتصل بما بعده؛ نختار شكله بحسب اتصاله بالحرف السابق.",
            "Dieser Buchstabe verbindet sich nicht mit dem folgenden Zeichen. Seine Form hängt von der Verbindung mit dem vorherigen Zeichen ab.",
          );
          feedback.append(note);
        }
      }
      $("focused-previous").disabled = state.index === 0;
      $("focused-next").disabled = !answered;
      $("focused-next").textContent =
        state.index === state.questions.length - 1
          ? text("عرض النتيجة", "Ergebnis ansehen")
          : text("السؤال التالي", "Nächste Frage");
      $("focused-result-title").textContent = text(
        `أكملت تدريب ${name()}!`,
        `Übung für ${name()} abgeschlossen!`,
      );
      $("focused-result-score").textContent = text(
        `${correct} من ${state.questions.length} إجابة صحيحة · ${Math.round((correct / state.questions.length) * 100)}٪`,
        `${correct} von ${state.questions.length} richtig · ${Math.round((correct / state.questions.length) * 100)} %`,
      );
    }
    function focusQuestion() {
      $("focused-run").scrollIntoView({ block: "start", behavior: "instant" });
      $("focused-prompt").focus({ preventScroll: true });
    }
    document.querySelectorAll("[data-focused-mode]").forEach((b) =>
      b.addEventListener("click", () => {
        mode = b.dataset.focusedMode;
        render();
      }),
    );
    $("focused-check").addEventListener("click", () => {
      const s = session();
      if (s.answers[s.index] !== undefined) return;
      s.answers[s.index] = [...(s.drafts.get(s.index) || [])];
      render();
    });
    $("focused-previous").addEventListener("click", () => {
      const s = session();
      if (!s.index) return;
      s.index--;
      render();
      focusQuestion();
    });
    $("focused-next").addEventListener("click", () => {
      const s = session();
      if (s.answers[s.index] === undefined) return;
      if (s.index === s.questions.length - 1) s.finished = true;
      else s.index++;
      render();
      if (s.finished)
        $("focused-result").scrollIntoView({
          block: "start",
          behavior: "instant",
        });
      else focusQuestion();
    });
    $("focused-review").addEventListener("click", () => {
      const s = session();
      s.finished = false;
      s.index = 0;
      render();
      focusQuestion();
    });
    $("focused-restart").addEventListener("click", () => {
      sessions.delete(key());
      render();
      focusQuestion();
    });
    window.addEventListener("letterchange", (e) => {
      letter = letters[e.detail.index] || letters[0];
      render();
    });
    window.addEventListener("app-language-change", render);
    render();
  });
})();
