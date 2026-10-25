(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const D = window.ArabicSkillsData,
      A = window.VocabApp,
      host = document.getElementById("skills-content"),
      audio = document.getElementById("skills-audio");
    const de = () => window.AppLanguage?.get() === "de",
      t = (ar, german) => (de() ? german : ar);
    const modules = [
      ["vocabulary", "المفردات والحوار", "Wortschatz und Dialog"],
      ["reading", "القراءة والقاعدة", "Lesen und Grammatik"],
      ["listening", "فهم المسموع", "Hörverstehen"],
      ["conversation", "المحادثة والتواصل", "Gespräche"],
      ["writing", "الكتابة المتدرجة", "Schreiben"],
      ["collocations", "المفردات داخل تراكيب", "Wörter im Kontext"],
      ["review", "المراجعة", "Wiederholung"],
    ];
    const sections = [
      ["A1", "وحدات A1", "A1-Einheiten"],
      ["A2", "وحدات A2", "A2-Einheiten"],
      ...modules.slice(2, 6),
    ];
    let filter = "A1",
      unit = null,
      module = "vocabulary",
      saveTimer;
    const records = () => A.getStats().skillsV1 || {};
    const state = () => records()[unit.id] || {};
    function patch(changes) {
      const all = records();
      A.setJSON("learningStats", {
        ...A.getStats(),
        skillsV1: {
          ...all,
          [unit.id]: { ...state(), ...changes, updatedAt: Date.now() },
        },
      });
    }
    function node(tag, text, cls) {
      const e = document.createElement(tag);
      if (text !== undefined) e.textContent = text;
      if (cls) e.className = cls;
      return e;
    }
    function button(label, fn, cls = "practice-button") {
      const b = node("button", label, cls);
      b.type = "button";
      b.addEventListener("click", fn);
      return b;
    }
    function link(label, href) {
      const a = node("a", label, "practice-button");
      a.href = href;
      return a;
    }
    function stop() {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      A.stopSpeech();
    }
    function play(path, label) {
      A.stopSpeech();
      audio.pause();
      audio.src = path;
      audio.playbackRate = Number(
        document.getElementById("skills-speed").value,
      );
      document.getElementById("skills-audio-label").textContent = label;
      const promise = audio.play();
      promise?.catch(() => {
        document.getElementById("skills-audio-label").textContent = t(
          "تعذّر تشغيل التسجيل. اضغط الاستماع مجددًا وتحقق من وجود مجلد الصوت.",
          "Audio konnte nicht starten. Erneut tippen und den Audioordner prüfen.",
        );
      });
    }
    audio.addEventListener("error", () => {
      if (audio.getAttribute("src"))
        document.getElementById("skills-audio-label").textContent = t(
          "التسجيل غير متاح. تحقق من اكتمال ملفات التطبيق.",
          "Aufnahme fehlt. Prüfe die Vollständigkeit der App-Dateien.",
        );
    });
    audio.addEventListener("playing", () => {
      if (unit && audio.getAttribute("src") === unit.listening.audio)
        patch({ heard: true });
    });
    document
      .getElementById("skills-speed")
      .addEventListener(
        "change",
        (event) => (audio.playbackRate = Number(event.target.value)),
      );
    function playButton(path, label) {
      return button(t("◖ استمع: ", "◖ Anhören: ") + label, () =>
        play(path, label),
      );
    }
    function block(title) {
      const b = node("section", undefined, "skills-block");
      b.append(node("h3", title));
      return b;
    }
    const answerCount = (s) => Object.keys(s.answers || {}).length;
    function overview() {
      host.replaceChildren();
      const note = node(
        "p",
        t(
          D.method,
          "Redaktionelle Übungseinheiten, kein zertifizierter Niveauabschluss. Geschlossene Aufgaben: automatische Rückmeldung. Schreiben und Sprechen: Selbsteinschätzung und Lehrkraft.",
        ),
        "skills-note",
      );
      host.append(note);
      const rows = D.units.filter(
          (u) => !["A1", "A2"].includes(filter) || u.level === filter,
        ),
        grid = node("div", undefined, "skills-grid");
      for (const u of rows) {
        const s = records()[u.id] || {},
          card = node("article", undefined, "skills-card");
        card.append(
          node(
            "small",
            u.level +
              " · " +
              (D.units.filter((x) => x.level === u.level).indexOf(u) + 1),
          ),
          node("h2", de() ? u.titleDe : u.title),
          node("p", u.goal, "skills-lesson"),
          node(
            "p",
            `${answerCount(s)} / 17 ` +
              t("إجابة محفوظة", "gespeicherte Antworten") +
              (s.completed
                ? t(" · علّمتها كمكتملة", " · selbst abgeschlossen")
                : ""),
            "skills-score",
          ),
          link(
            t("افتح الوحدة", "Einheit öffnen"),
            "#" +
              u.id +
              "/" +
              (["A1", "A2"].includes(filter) ? "vocabulary" : filter),
          ),
        );
        grid.append(card);
      }
      host.append(grid);
    }
    function question(q, key, target) {
      const saved = state().answers?.[key],
        box = node("fieldset", undefined, "skills-question");
      box.dataset.question = key;
      box.append(node("legend", q.prompt));
      const opts = node("div", undefined, "skills-answers");
      // Stable per-session option order, with unique answer text and diacritics retained.
      const order = A.shuffle(q.options.map((_, i) => i));
      for (const i of order) {
        const b = button(
          q.options[i],
          () => {
            const answers = {
              ...(state().answers || {}),
              [key]: { selected: i, correct: i === q.correct },
            };
            patch({ answers });
            const replacement = node("div");
            question(q, key, replacement);
            box.replaceWith(replacement.firstElementChild);
            updateScore();
          },
          "skills-choice",
        );
        b.lang = /[\u0600-\u06ff]/.test(q.options[i]) ? "ar" : "de";
        if (b.lang === "de") b.dir = "ltr";
        b.disabled = !!saved;
        if (saved && (i === q.correct || i === saved.selected))
          b.classList.add(i === q.correct ? "is-correct" : "is-wrong");
        opts.append(b);
      }
      const feedback = node(
        "p",
        saved
          ? A.encouragement(saved.correct) +
              " " +
              t("الإجابة الصحيحة: ", "Richtige Antwort: ") +
              q.options[q.correct] +
              " — " +
              q.explanation
          : "",
        "skills-feedback",
      );
      feedback.setAttribute("role", "status");
      box.append(opts, feedback);
      if (saved)
        box.append(
          button(t("أعد المحاولة", "Erneut versuchen"), () => {
            const answers = { ...(state().answers || {}) };
            delete answers[key];
            patch({ answers });
            const replacement = node("div");
            question(q, key, replacement);
            box.replaceWith(replacement.firstElementChild);
            updateScore();
          }),
        );
      target.append(box);
    }
    function questions(rows, prefix, target) {
      rows.forEach((q, i) => question(q, prefix + "-" + i, target));
    }
    function orderTask(target) {
      const key = "order",
        saved = state().answers?.[key],
        items = unit.listening.order,
        box = block(
          t("رتّب الأحداث بحسب ما سمعت", "Ordne die gehörten Ereignisse"),
        );
      box.dataset.question = key;
      let picked = [...(state().orderDraft || [])];
      if (saved) picked = saved.selected;
      const result = node("ol", undefined, "skills-order-result"),
        choices = node("div", undefined, "skills-answers skills-order-choices"),
        feedback = node("p", "", "skills-feedback");
      feedback.setAttribute("role", "status");
      function draw() {
        result.replaceChildren(...picked.map((i) => node("li", items[i])));
        choices.replaceChildren();
        for (const i of [2, 0, 1]) {
          const b = button(
            items[i],
            () => {
              picked.push(i);
              patch({ orderDraft: picked });
              draw();
            },
            "skills-choice",
          );
          b.disabled = !!saved || picked.includes(i);
          choices.append(b);
        }
        check.disabled = !!saved || picked.length !== items.length;
        undo.disabled = !!saved || !picked.length;
      }
      const check = button(t("تحقق من الترتيب", "Reihenfolge prüfen"), () => {
        const correct = picked.every((v, i) => v === i);
        patch({
          answers: {
            ...(state().answers || {}),
            [key]: { selected: picked, correct },
          },
        });
        renderModule();
      });
      const undo = button(
        t("تراجع عن آخر اختيار", "Letzte Auswahl zurück"),
        () => {
          picked.pop();
          patch({ orderDraft: picked });
          draw();
        },
      );
      box.append(result, choices, check, undo, feedback);
      if (saved) {
        feedback.textContent =
          A.encouragement(saved.correct) +
          " " +
          t("الترتيب الصحيح: ", "Richtige Reihenfolge: ") +
          items.join(" ← ");
        box.append(
          button(t("أعد المحاولة", "Erneut versuchen"), () => {
            const answers = { ...(state().answers || {}) };
            delete answers[key];
            patch({ answers, orderDraft: [] });
            renderModule();
          }),
        );
      }
      draw();
      target.append(box);
    }
    function draftInput(key, label, rows = 5) {
      const wrap = node("label", undefined, "skills-prompt-label");
      wrap.append(node("span", label));
      const input = node("textarea", undefined, "skills-draft");
      input.lang = "ar";
      input.rows = rows;
      input.value = state().drafts?.[key] || "";
      input.dataset.draft = key;
      input.maxLength = key === "writing" ? 2000 : 1000;
      input.addEventListener("input", () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(flushDrafts, 750);
        updateWordCount();
      });
      wrap.append(input);
      return wrap;
    }
    function flushDrafts() {
      clearTimeout(saveTimer);
      if (!unit) return;
      const fields = [...host.querySelectorAll("[data-draft]")];
      if (!fields.length) return;
      const drafts = { ...(state().drafts || {}) };
      fields.forEach((input) => (drafts[input.dataset.draft] = input.value));
      patch({ drafts });
      document.getElementById("skills-save-status").textContent = t(
        "تم حفظ إجاباتك.",
        "Deine Antworten sind gespeichert.",
      );
    }
    function updateWordCount() {
      const input = host.querySelector("[data-draft=writing]"),
        count = host.querySelector("#skills-word-count");
      if (input && count)
        count.textContent =
          t("عدد الكلمات: ", "Wörter: ") +
          (input.value.trim().match(/\S+/g) || []).length +
          t(
            " · العدد المقترح إرشادي، ولا يقيّم صحة الكتابة.",
            " · Die empfohlene Länge bewertet nicht die sprachliche Qualität.",
          );
    }
    function modelDetails(title, text) {
      const d = node("details");
      d.append(node("summary", title), node("p", text, "skills-model"));
      return d;
    }
    function renderModule() {
      host.replaceChildren();
      const heading = node("header", undefined, "skills-unit-heading");
      heading.append(
        node("h2", unit.level + " · " + (de() ? unit.titleDe : unit.title)),
        link(t("رجوع إلى الوحدات", "Zurück zur Übersicht"), "#" + filter),
      );
      host.append(heading, node("p", unit.goal, "skills-lesson"));
      const nav = node("nav", undefined, "skills-module-nav");
      nav.setAttribute("aria-label", t("أجزاء الوحدة", "Teile der Einheit"));
      for (const [id, ar, german] of modules) {
        const a = link(t(ar, german), "#" + unit.id + "/" + id);
        if (id === module) a.setAttribute("aria-current", "page");
        nav.append(a);
      }
      host.append(nav);
      const score = node("p", "", "skills-score");
      score.id = "skills-unit-score";
      score.setAttribute("role", "status");
      host.append(score);
      const content = node("article", undefined, "skills-lesson");
      content.lang = "ar";
      content.dir = "rtl";
      host.append(content);
      if (module === "vocabulary") {
        const b = block(t("حوار الوحدة", "Dialog"));
        b.append(
          playButton(
            "audio/skills/" + unit.id + "-dialogue.mp3",
            t("الحوار", "Dialog"),
          ),
        );
        for (const row of unit.dialogue) {
          const p = node("p", undefined, "skills-dialogue");
          p.append(
            node("strong", row.speaker + ": "),
            document.createTextNode(row.text),
          );
          b.append(p);
        }
        content.append(b);
        const second = block(t("حوار ثانٍ للتطبيق", "Zweiter Dialog"));
        second.append(
          playButton(
            "audio/skills/" + unit.id + "-dialogue-2.mp3",
            t("الحوار الثاني", "Zweiter Dialog"),
          ),
        );
        for (const row of unit.secondDialogue) {
          const p = node("p", undefined, "skills-dialogue");
          p.append(
            node("strong", row.speaker + ": "),
            document.createTextNode(row.text),
          );
          second.append(p);
        }
        content.append(second);
        content.append(
          node(
            "p",
            t(
              "راجع قوائمك الخمس. ستجد في النصوص والحوار كلمات منها بصيغ تناسب الجملة.",
              "Wiederhole die fünf Listen. Wörter daraus begegnen dir im Dialog und Text, mit passenden Formen.",
            ),
            "skills-note",
          ),
        );
        for (const list of unit.vocabulary) {
          const details = node("details");
          details.append(node("summary", de() ? list.titleDe : list.title));
          const words = node("ul", undefined, "skills-vocab-list");
          for (const word of list.words) {
            const li = node("li"),
              ar = node("bdi", word.ar),
              german = node("bdi", word.de);
            ar.lang = "ar";
            german.lang = "de";
            german.dir = "ltr";
            li.append(
              ar,
              german,
              button(t("استمع", "Anhören"), () => {
                audio.pause();
                A.speakArabic(
                  word.ar,
                  (message) =>
                    (document.getElementById("skills-audio-label").textContent =
                      message),
                );
              }),
            );
            words.append(li);
          }
          details.append(
            words,
            button(
              t(
                "افتح هذه القائمة في بطاقات المفردات",
                "Diese Liste als Lernkarten öffnen",
              ),
              () => {
                flushDrafts();
                stop();
                A.saveVocabList(
                  list.words.map((w) => [w.ar, w.de]),
                  {
                    type: "ready-list",
                    id: list.id,
                    title: list.title,
                    cefr: unit.level,
                    levelId: unit.level,
                    levelTitle: unit.level,
                    count: list.words.length,
                  },
                );
                location.href = "lernseite.html";
              },
            ),
          );
          content.append(details);
        }
      } else if (module === "reading") {
        const b = block(t("اقرأ وافهم", "Lies und verstehe"));
        b.append(
          node("p", unit.reading),
          playButton(
            "audio/skills/" + unit.id + "-reading.mp3",
            t("نص القراءة", "Lesetext"),
          ),
        );
        questions(unit.readingQuestions, "reading", b);
        content.append(b);
        const grammar = block(unit.grammar.title);
        grammar.append(
          node("p", unit.grammar.body),
          node("p", unit.grammar.example, "skills-model"),
          link(
            t("شرح القاعدة كاملًا", "Zur Grammatiklektion"),
            unit.grammar.href,
          ),
        );
        content.append(grammar);
      } else if (module === "listening") {
        const b = block(
          t("استمع أولًا، ثم أجب", "Höre zuerst und beantworte die Fragen"),
        );
        b.append(
          node("p", unit.listening.kind),
          playButton(
            unit.listening.audio,
            t("تسجيل فهم المسموع", "Hörverstehen"),
          ),
          node(
            "p",
            t(
              "استمع مرة للفكرة العامة، ثم مرة للتفاصيل. يمكنك تكرار التسجيل.",
              "Höre einmal für die Hauptidee und nochmals für Details. Wiederholen ist erlaubt.",
            ),
            "skills-note",
          ),
        );
        questions(unit.listening.questions, "listening", b);
        content.append(b);
        orderTask(content);
        content.append(
          modelDetails(
            t(
              "أظهر نص التسجيل بعد المحاولة",
              "Transkript nach dem Versuch anzeigen",
            ),
            unit.listening.script,
          ),
        );
      } else if (module === "conversation") {
        const b = block(t("أكمل الحوار", "Ergänze den Dialog"));
        questions(unit.conversation.gaps, "conversation", b);
        content.append(b);
        const open = block(
          t("أنشئ إجابتك وتحدّث", "Formuliere eine eigene Antwort und sprich"),
        );
        unit.conversation.prompts.forEach((p, i) =>
          open.append(draftInput("speaking-" + i, p, 3)),
        );
        open.append(
          node(
            "p",
            t(
              "تدرّب شفهيًا مع زميل، ثم اكتب نقاط إجابتك هنا. راجع: وضوح المعنى، مناسبة الرد، واستمرار الحوار. لا يوجد تقييم آلي للنطق.",
              "Übe mündlich mit einer Partnerperson und notiere Stichpunkte. Prüfe Verständlichkeit, Angemessenheit und Gesprächsfluss. Keine automatische Aussprachebewertung.",
            ),
            "skills-note",
          ),
        );
        const label = node("label"),
          check = node("input");
        check.type = "checkbox";
        check.checked = !!state().speakingReviewed;
        check.addEventListener("change", () => {
          flushDrafts();
          patch({ speakingReviewed: check.checked });
        });
        label.append(
          check,
          document.createTextNode(
            t(
              "تدرّبت شفهيًا وراجعت إجابتي",
              "Mündlich geübt und meine Antwort geprüft",
            ),
          ),
        );
        open.append(label);
        content.append(open);
      } else if (module === "writing") {
        const w = unit.writing,
          b = block(w.kind);
        b.append(node("p", w.prompt));
        if (w.image) {
          const img = node("img", undefined, "skills-picture");
          img.src = w.image;
          img.alt =
            w.kind === "وَصْفُ صُورَةٍ"
              ? unit.level === "A1"
                ? "صباح مشمس، ساعة تشير إلى السابعة وطالب يقرأ كتابًا."
                : "بائع وزبونة تحمل إيصالًا وصندوقًا عند منضدة متجر."
              : "صورة المهمة";
          b.append(img);
        }
        const steps = node("ol");
        w.steps.forEach((s) => steps.append(node("li", s)));
        b.append(
          steps,
          node(
            "p",
            t("طول مقترح: ", "Empfohlene Länge: ") +
              w.minWords +
              t(" كلمة أو أكثر.", " Wörter oder mehr."),
            "skills-note",
          ),
          draftInput("writing", t("إجابتك", "Deine Antwort")),
          node("p", "", "skills-note"),
        );
        b.lastChild.id = "skills-word-count";
        b.append(
          button(t("احفظ إجابتي", "Antwort speichern"), flushDrafts),
          modelDetails(
            t(
              "نموذج استرشادي — توجد إجابات صحيحة أخرى",
              "Beispiel — andere passende Antworten sind möglich",
            ),
            w.model,
          ),
        );
        const rubric = node("div", undefined, "skills-rubric");
        rubric.append(
          node("h3", t("راجع كتابتك", "Überprüfe deinen Text")),
          node(
            "p",
            t(
              "هذا تقييم ذاتي، ويمكن للأستاذ مراجعته. اختيار الدرجة لا يعني تصحيح النص آليًا.",
              "Selbsteinschätzung zur Besprechung mit einer Lehrkraft. Die Auswahl korrigiert deinen Text nicht automatisch.",
            ),
            "skills-note",
          ),
        );
        for (const r of D.rubric) {
          const label = node("label"),
            select = node("select");
          label.append(node("strong", r.title), node("small", r.description));
          for (const [value, name] of [
            ["", t("اختر بعد المراجعة", "Nach dem Prüfen wählen")],
            ["0", t("أحتاج إلى مساعدة", "Ich brauche Hilfe")],
            ["1", t("حققت بعض المطلوب", "Teilweise erfüllt")],
            ["2", t("حققت المطلوب", "Erfüllt")],
          ]) {
            const option = node("option", name);
            option.value = value;
            select.append(option);
          }
          select.value = state().rubric?.[r.id] ?? "";
          select.dataset.rubric = r.id;
          select.addEventListener("change", () => {
            flushDrafts();
            patch({
              rubric: { ...(state().rubric || {}), [r.id]: select.value },
            });
          });
          label.append(select);
          rubric.append(label);
        }
        b.append(rubric);
        content.append(b);
        updateWordCount();
      } else if (module === "collocations") {
        for (const [i, c] of unit.collocations.entries()) {
          const b = block(c.expression);
          const meaning = node("p", c.meaning, "skills-note");
          meaning.lang = "de";
          meaning.dir = "ltr";
          b.append(meaning, node("p", c.example));
          question(c.question, "collocations-" + i, b);
          content.append(b);
        }
      } else if (module === "review") {
        const b = block(t("مراجعة الوحدة", "Einheit wiederholen"));
        questions(unit.review, "review", b);
        content.append(b);
        const complete = block(
          t("مراجعة المهام المفتوحة", "Offene Aufgaben prüfen"),
        );
        complete.append(
          node(
            "p",
            t(
              "راجع الكتابة والتحدث مع النموذج أو مع أستاذك، ثم علّم الوحدة كمكتملة. هذه علامة إنجاز شخصية، وليست شهادة مستوى.",
              "Prüfe Schreiben und Sprechen anhand des Beispiels oder mit deiner Lehrkraft. Der Abschluss ist eine persönliche Markierung, kein Niveauzertifikat.",
            ),
            "skills-note",
          ),
        );
        complete.append(
          button(
            state().completed
              ? t("إلغاء علامة الإتمام", "Abschlussmarkierung entfernen")
              : t(
                  "أنجزت الوحدة وراجعت مهامي",
                  "Einheit bearbeitet und Aufgaben geprüft",
                ),
            () => {
              flushDrafts();
              patch({ completed: !state().completed });
              renderModule();
            },
          ),
        );
        content.append(complete);
      }
      const index = D.units.indexOf(unit),
        actions = node("nav", undefined, "skills-actions");
      actions.setAttribute(
        "aria-label",
        t("التنقل بين الوحدات", "Einheiten wechseln"),
      );
      if (index > 0)
        actions.append(
          link(
            t("الوحدة السابقة", "Vorige Einheit"),
            "#" + D.units[index - 1].id + "/" + module,
          ),
        );
      actions.append(
        link(t("رجوع إلى الوحدات", "Zurück zur Übersicht"), "#" + filter),
      );
      if (index < D.units.length - 1)
        actions.append(
          link(
            t("الوحدة التالية", "Nächste Einheit"),
            "#" + D.units[index + 1].id + "/" + module,
          ),
        );
      host.append(actions);
      updateScore();
    }
    function updateScore() {
      const e = document.getElementById("skills-unit-score");
      if (!e || !unit) return;
      const a = Object.values(state().answers || {});
      e.textContent =
        `${a.filter((x) => x.correct).length} / ${a.length} ` +
        t(
          "إجابات صحيحة من المحاولات المحفوظة",
          "richtige gespeicherte Antworten",
        ) +
        ` · ${a.length} / 17 ` +
        t("تدريبًا مغلقًا", "geschlossene Aufgaben");
    }
    function render() {
      flushDrafts();
      stop();
      let fragment = location.hash.slice(1);
      try {
        fragment = decodeURIComponent(fragment);
      } catch (_) {}
      const parts = fragment.split("/"),
        next = D.units.find((u) => u.id === parts[0]);
      if (next) {
        unit = next;
        if (["A1", "A2"].includes(filter)) filter = unit.level;
        module = modules.some((m) => m[0] === parts[1])
          ? parts[1]
          : "vocabulary";
      } else {
        unit = null;
        if (sections.some((s) => s[0] === parts[0])) filter = parts[0];
      }
      const tabs = document.getElementById("skills-sections");
      tabs.replaceChildren();
      for (const [id, ar, german] of sections) {
        const a = link(t(ar, german), "#" + id);
        if (id === filter) a.setAttribute("aria-current", "page");
        tabs.append(a);
      }
      if (unit) renderModule();
      else overview();
    }
    window.addEventListener("hashchange", () => {
      render();
      host.scrollIntoView({ block: "start" });
    });
    window.addEventListener("app-language-change", render);
    window.addEventListener("pagehide", () => {
      flushDrafts();
      stop();
    });
    render();
  });
})();
