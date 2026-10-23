(() => {
  window.JisrStorage.ready(() => {
    "use strict";
    const C = window.TeacherExams,
      D = C.data,
      { el, button } = window.Practice;
    const $ = (id) => document.getElementById(id);
    const t = (ar, de) => (window.AppLanguage?.get() === "de" ? de : ar);
    let attempt = null;
    const audio = $("exam-player");
    function stop() {
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    function attempts() {
      return window.VocabApp.getStats().teacherExamsV1?.attempts || {};
    }
    function save() {
      attempt.updatedAt = Date.now();
      window.VocabApp.setJSON(
        "learningStats",
        C.saveAttempt(window.VocabApp.getStats(), attempt),
      );
      $("exam-save-status").textContent = t(
        "حُفظت المحاولة. تظهر هنا آخر ١٠ محاولات.",
        "Versuch gespeichert. Die letzten 10 Versuche bleiben verfügbar.",
      );
    }
    function link(text, href, download) {
      const a = el("a", text, "practice-button");
      a.href = href;
      if (download) a.download = download;
      return a;
    }
    function selectExam(id, saved) {
      if (!D.exams.some((e) => e.id === id)) return;
      stop();
      attempt = saved
        ? structuredClone(saved)
        : {
            id: `exam-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            examId: id,
            version: D.version,
            answers: {},
            unavailable: {},
            status: "draft",
            createdAt: Date.now(),
          };
      save();
      history.replaceState(
        null,
        "",
        `#attempt=${encodeURIComponent(attempt.id)}`,
      );
      render();
      $("exam-title").focus();
      $("exam-session").scrollIntoView({ block: "start" });
    }
    function catalog() {
      const host = $("exam-catalog");
      host.replaceChildren();
      for (const source of D.originals) {
        const exam = D.exams.find(
            (e) => e.source === source.id && e.category === "original",
          ),
          similar = D.exams.find(
            (e) => e.source === source.id && e.category === "similar",
          ),
          card = el("article", undefined, "home-panel exam-card");
        card.append(
          el("h2", exam.title),
          el("p", source.topic, "exam-topic"),
          el(
            "p",
            t(
              `${C.tasks(exam).length} تمرينًا في الاختبار الأصلي · ${C.tasks(similar).length} في النموذج المشابه`,
              `${C.tasks(exam).length} Aufgaben im Originaltest · ${C.tasks(similar).length} im ähnlichen Test`,
            ),
          ),
        );
        const actions = el("div", undefined, "practice-actions");
        const originalButton = button(
          t("حل الاختبار الأصلي", "Originaltest lösen"),
          () => selectExam(exam.id),
          "practice-button primary-action",
        );
        originalButton.dataset.startExam = exam.id;
        const similarButton = button(
          t("تدرب على نموذج مشابه", "Ähnlichen Test üben"),
          () => selectExam(similar.id),
        );
        similarButton.dataset.startExam = similar.id;
        actions.append(originalButton, similarButton);
        card.append(actions);
        host.append(card);
      }
      const h = $("exam-history");
      h.replaceChildren();
      const recent = Object.values(attempts())
        .filter(
          (a) =>
            a.version === D.version && D.exams.some((e) => e.id === a.examId),
        )
        .sort((a, b) => b.updatedAt - a.updatedAt);
      if (!recent.length)
        h.append(
          el(
            "p",
            t(
              "ستظهر محاولاتك هنا بعد بدء نموذج.",
              "Deine Versuche erscheinen hier, sobald du einen Test beginnst.",
            ),
          ),
        );
      for (const a of recent) {
        const e = D.exams.find((e) => e.id === a.examId),
          date = new Date(a.updatedAt).toLocaleString(
            window.AppLanguage?.get() === "de" ? "de-DE" : "ar",
          );
        h.append(
          button(
            `${a.status === "finished" ? t("النتيجة", "Ergebnis") : t("متابعة", "Fortsetzen")} · ${e.title} · ${date}`,
            () => selectExam(e.id, a),
          ),
        );
      }
    }
    function feedback(task, node) {
      if (attempt.status !== "finished") return;
      const p = el("div", undefined, "exam-feedback");
      if (task.kind === "manual") {
        p.append(
          el(
            "strong",
            t(
              "بانتظار مراجعة المعلم · مثال استرشادي:",
              "Lehrkraft bewertet · Beispielantwort:",
            ),
          ),
          el("p", task.answer),
        );
        const ul = el("ul");
        for (const criterion of task.rubric) ul.append(el("li", criterion));
        p.append(ul);
      } else if (attempt.unavailable[task.id])
        p.append(
          el(
            "p",
            t(
              "تعذّر الصوت: مستبعد من الدرجة.",
              "Audio nicht verfügbar: nicht gewertet.",
            ),
          ),
        );
      else {
        const good = C.correct(task, attempt.answers[task.id]);
        p.classList.add(good ? "exam-correct" : "exam-incorrect");
        p.append(
          el(
            "strong",
            t(
              good ? "إجابة صحيحة" : "تحتاج إلى مراجعة",
              good ? "Richtig" : "Bitte nacharbeiten",
            ),
          ),
          el("p", VocabApp.encouragement(good)),
          el("p", `${t("الإجابة:", "Lösung:")} ${task.answer}`),
        );
        if (task.explanation) p.append(el("p", task.explanation));
      }
      node.append(p);
    }
    function renderTask(q, index) {
      const field = el("fieldset", undefined, "exam-task");
      field.dataset.question = q.id;
      field.lang = "ar";
      field.dir = "rtl";
      const legend = el("legend", `${index + 1}. ${q.prompt}`);
      field.append(legend);
      if (q.kind === "manual")
        field.append(
          el(
            "p",
            t(
              "كتابة حرة · يراجعها المعلم، خارج الدرجة الآلية.",
              "Freies Schreiben · Bewertung durch die Lehrkraft, außerhalb der automatischen Punktzahl.",
            ),
            "exam-manual-note",
          ),
        );
      if (q.images) {
        const images = el("div", undefined, "exam-illustrations");
        q.images.forEach((path, i) => {
          const img = el("img");
          img.src = path;
          img.alt = t(
            `صورة الوصف ${i + 1}`,
            `Bild ${i + 1} für die Beschreibung`,
          );
          images.append(img);
        });
        field.append(images);
      }
      const finished = attempt.status === "finished";
      if (q.kind === "choice") {
        const options = el("div", undefined, "exam-options");
        if (q.options.every((value) => [...value].length === 1))
          options.classList.add("exam-letter-options");
        q.options.forEach((option) => {
          const label = el("label"),
            input = el("input");
          input.type = "radio";
          input.name = q.id;
          input.value = option;
          input.checked = attempt.answers[q.id] === option;
          input.disabled = finished;
          input.onchange = () => {
            attempt.answers[q.id] = option;
            save();
          };
          label.append(input, el("span", option));
          options.append(label);
        });
        field.append(options);
      } else if (q.kind === "order") {
        const selected = el("div", undefined, "exam-ordered"),
          options = el("div", undefined, "practice-actions"),
          status = el("p");
        status.setAttribute("aria-live", "polite");
        function update() {
          const ids = attempt.answers[q.id] || [];
          selected.replaceChildren();
          options.replaceChildren();
          ids.forEach((id, i) =>
            selected.append(
              button(q.tokens[id], () => {
                ids.splice(i, 1);
                attempt.answers[q.id] = ids;
                save();
                update();
              }),
            ),
          );
          q.displayOrder.forEach((id) => {
            const b = button(q.tokens[id], () => {
              attempt.answers[q.id] = [...ids, id];
              save();
              update();
            });
            b.disabled = finished || ids.includes(id);
            b.dataset.token = id;
            options.append(b);
          });
          selected
            .querySelectorAll("button")
            .forEach((b) => (b.disabled = finished));
          status.textContent = ids.length
            ? ids.map((i) => q.tokens[i]).join(q.join)
            : t(
                "اختر بالترتيب. اضغط كلمة مختارة لإعادتها.",
                "In der richtigen Reihenfolge wählen; gewähltes Wort zum Zurücklegen anklicken.",
              );
        }
        update();
        field.append(selected, status, options);
      } else {
        if (q.kind === "dictation") {
          const play = button(t("◖ استمع", "◖ Anhören"), () => {
            stop();
            audio.src = q.audio;
            const failed = () => {
              status.textContent = t(
                "تعذر التشغيل. حاول مجددًا أو استبعد السؤال.",
                "Wiedergabe fehlgeschlagen. Erneut versuchen oder Aufgabe ausschließen.",
              );
            };
            audio.onerror = failed;
            audio.play().catch(failed);
          });
          const status = el("p");
          status.setAttribute("role", "status");
          const skip = button(
            t(
              "تعذّر الصوت / إعادة إدراجه",
              "Audio nicht verfügbar / wieder einbeziehen",
            ),
            () => {
              stop();
              attempt.unavailable[q.id] = !attempt.unavailable[q.id];
              save();
              renderSession();
            },
          );
          skip.disabled = finished;
          field.append(play, skip, status);
          if (attempt.unavailable[q.id])
            status.textContent = t(
              "مستبعد من الدرجة. يمكنك إعادة إدراجه بعد إصلاح الصوت.",
              "Nicht gewertet. Nach Beheben des Audioproblems wieder einbeziehen.",
            );
        }
        const input = el(q.kind === "manual" ? "textarea" : "input");
        input.id = `answer-${q.id}`;
        input.setAttribute("aria-labelledby", `label-${q.id}`);
        legend.id = `label-${q.id}`;
        if (q.kind !== "manual") input.type = "text";
        else input.rows = 4;
        input.autocomplete = "off";
        input.spellcheck = false;
        input.value = attempt.answers[q.id] || "";
        input.disabled = finished || !!attempt.unavailable[q.id];
        input.maxLength = q.kind === "manual" ? 1000 : 180;
        input.oninput = () => {
          attempt.answers[q.id] = input.value;
          save();
        };
        field.append(input);
      }
      feedback(q, field);
      return field;
    }
    function renderSession() {
      const e = D.exams.find((e) => e.id === attempt.examId),
        finished = attempt.status === "finished";
      $("exam-title").textContent = e.title;
      $("exam-title").append(
        el(
          "small",
          e.category === "original"
            ? t(
                "الاختبار الأصلي — حل داخل الموقع",
                "Originaltest · direkt auf der Seite lösen",
              )
            : t("نموذج مشابه للتدريب", "Ähnlicher Übungstest"),
          "exam-kind",
        ),
      );
      $("exam-submit").hidden = finished;
      $("exam-key").hidden = !finished;
      const host = $("exam-questions");
      host.replaceChildren();
      let index = 0;
      const nav = $("exam-section-nav");
      nav.replaceChildren();
      e.sections.forEach((section, i) => {
        const panel = el("section", undefined, "home-panel exam-section");
        panel.id = `exam-section-${i}`;
        nav.append(link(`${i + 1}. ${section.title}`, `#${panel.id}`));
        panel.append(el("h3", section.title));
        if (section.note)
          panel.append(el("p", section.note, "exam-source-note"));
        if (section.passage) {
          const passage = el("p", section.passage, "exam-passage");
          passage.lang = "ar";
          passage.dir = "rtl";
          panel.append(passage);
        }
        for (const q of section.tasks) panel.append(renderTask(q, index++));
        host.append(panel);
      });
      const result = $("exam-result");
      result.replaceChildren();
      result.hidden = !finished;
      if (finished) {
        const score = C.result(e, attempt);
        result.append(
          el(
            "h3",
            t("نتيجة الأسئلة المحددة", "Ergebnis der geschlossenen Aufgaben"),
          ),
          el(
            "p",
            t(
              `${score.right} صحيحة من ${score.total} · ${score.percent ?? "—"}٪`,
              `${score.right} von ${score.total} richtig · ${score.percent ?? "—"} %`,
            ),
          ),
          el(
            "p",
            t(
              `${score.unanswered} دون إجابة محسوبة صفرًا · ${score.skipped} مستبعدة لتعذّر الصوت.`,
              `${score.unanswered} unbeantwortet (0 Punkte) · ${score.skipped} wegen Audioproblemen ausgeschlossen.`,
            ),
          ),
          el(
            "p",
            t(
              `${score.manualAnswered} مهمة مفتوحة أُجيب عنها من ${score.manual}؛ يراجعها المعلم منفصلة عن الدرجة الآلية.`,
              `${score.manualAnswered} von ${score.manual} offenen Aufgaben beantwortet; separate Bewertung durch die Lehrkraft.`,
            ),
          ),
        );
      }
      $("exam-submit").onclick = () => {
        stop();
        attempt.status = "finished";
        attempt.finishedAt = Date.now();
        save();
        renderSession();
        $("exam-result").focus();
        $("exam-result").scrollIntoView({ block: "start" });
      };
    }
    function printExam(key) {
      const e = D.exams.find((e) => e.id === attempt.examId),
        paper = $("exam-print");
      paper.replaceChildren();
      paper.dir = "rtl";
      paper.lang = "ar";
      paper.append(
        el("h1", e.title),
        el(
          "p",
          key
            ? "دليل الإجابات ومراجعة المعلم"
            : "الاسم: .................................... التاريخ: ........................",
        ),
        el("p", "إعداد الأستاذ محمود بركات"),
      );
      let index = 0;
      for (const s of e.sections) {
        paper.append(el("h2", s.title));
        if (s.note) paper.append(el("p", s.note));
        if (s.passage) paper.append(el("p", s.passage, "exam-passage"));
        for (const q of s.tasks) {
          const item = el("div", undefined, "exam-print-task");
          item.append(el("p", `${++index}. ${q.prompt}`));
          if (q.images)
            for (const path of q.images) {
              const img = el("img");
              img.src = path;
              img.alt = "صورة الوصف";
              item.append(img);
            }
          if (key) {
            item.append(el("p", q.answer));
            if (q.kind === "manual")
              item.append(el("p", `مثال استرشادي. ${q.rubric.join(" ")}`));
          } else if (q.kind === "choice")
            item.append(el("p", q.options.map((o) => `□ ${o}`).join("     ")));
          else {
            if (q.kind === "order")
              item.append(
                el("p", q.displayOrder.map((i) => q.tokens[i]).join(" — ")),
              );
            item.append(
              el(
                "p",
                "........................................................................................",
              ),
            );
            if (q.kind === "manual")
              item.append(
                el(
                  "p",
                  "........................................................................................",
                ),
              );
          }
          paper.append(item);
        }
      }
      document.body.classList.add("exam-printing");
      window.print();
    }
    function render() {
      const pageBack = document.querySelector(".page-back-nav");
      if (pageBack) pageBack.hidden = !!attempt;
      $("exam-catalog-panel").hidden = !!attempt;
      $("exam-session").hidden = !attempt;
      if (attempt) renderSession();
      else catalog();
    }
    function back() {
      stop();
      if (attempt) save();
      attempt = null;
      history.replaceState(null, "", location.pathname + location.search);
      render();
      $("exam-home-title").focus();
      window.scrollTo(0, 0);
    }
    $("exam-back").onclick = back;
    $("exam-back-bottom").onclick = back;
    $("exam-blank").onclick = () => printExam(false);
    $("exam-key").onclick = () => printExam(true);
    window.addEventListener("afterprint", () =>
      document.body.classList.remove("exam-printing"),
    );
    window.addEventListener("app-language-change", () => {
      stop();
      render();
    });
    window.addEventListener("pagehide", stop);
    const hash = new URLSearchParams(location.hash.slice(1)),
      prior = attempts()[hash.get("attempt")];
    if (
      prior?.version === D.version &&
      D.exams.some((e) => e.id === prior.examId)
    )
      attempt = structuredClone(prior);
    function openDirectLink() {
      const query = new URLSearchParams(location.hash.slice(1));
      const originalId = query.get("original"),
        directId = query.get("exam");
      const requested = D.exams.find(
        (e) =>
          e.id === directId ||
          (originalId && e.source === originalId && e.category === "original"),
      );
      if (!requested) return false;
      selectExam(requested.id);
      return true;
    }
    window.addEventListener("hashchange", openDirectLink);
    if (!attempt) openDirectLink();
    render();
    $("lesson-loading")?.remove();
  });
})();
