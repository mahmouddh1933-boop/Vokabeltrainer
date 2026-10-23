(() => {
  window.JisrStorage.ready(() => {
    "use strict";
    const C = window.Placement,
      D = C.data,
      { $, el, button } = window.Practice;
    const lang = () => (window.AppLanguage?.get() === "de" ? "de" : "ar");
    const t = (ar, de) => (lang() === "de" ? de : ar);
    const l = (v) => v[lang()];
    const audio = $("placement-player");
    let attempt = null,
      reviewOpen = false;
    function attempts() {
      const value = window.VocabApp.getStats().placementV1?.attempts;
      return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {};
    }
    function save() {
      const stats = window.VocabApp.getStats(),
        prior = stats.placementV1 || {};
      window.VocabApp.setJSON("learningStats", {
        ...stats,
        placementV1: {
          ...prior,
          attempts: { ...prior.attempts, [attempt.id]: attempt },
        },
      });
    }
    function stop() {
      audio.onended = audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    function open(id) {
      const saved = attempts()[id];
      if (!saved || !C.getTest(saved.testId)) return;
      if (saved.bankVersion !== D.bankVersion) {
        $("placement-notice").textContent = t(
          "هذه محاولة من بنك أسئلة أقدم. ابدأ اختبارًا جديدًا؛ لم تُحذف المحاولة.",
          "Dieser Versuch gehört zu einer älteren Fragenbank. Starte einen neuen Test; der alte Versuch bleibt gespeichert.",
        );
        return;
      }
      attempt = structuredClone(saved);
      attempt.answers ||= {};
      attempt.heard ||= {};
      attempt.replays ||= {};
      reviewOpen = false;
      render();
      $("placement-heading").focus({ preventScroll: true });
      $("placement-session").scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    }
    function start(testId, form) {
      attempt = C.createAttempt(testId, form);
      reviewOpen = false;
      save();
      location.hash = "attempt=" + encodeURIComponent(attempt.id);
      render();
      $("placement-heading").focus({ preventScroll: true });
      $("placement-session").scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    }
    function catalog() {
      const host = $("placement-catalog");
      host.replaceChildren();
      for (const test of D.tests) {
        const card = el("article", undefined, "placement-test-card");
        card.append(
          el("h2", l(test.title)),
          el("p", l(test.description)),
          el(
            "p",
            t(
              `١٦ سؤالًا · نحو ${test.minutes} دقائق · بلا حد زمني`,
              `16 Aufgaben · etwa ${test.minutes} Minuten · ohne Zeitlimit`,
            ),
          ),
        );
        const prior = Object.values(attempts())
          .filter((a) => a.testId === test.id && a.status === "finished")
          .sort((a, b) => b.finishedAt - a.finishedAt);
        const preferred = prior[0]?.form === "A" ? "B" : "A";
        card.append(
          el(
            "small",
            t("النموذج المقترح الآن: ", "Empfohlene Form: ") + preferred,
          ),
        );
        const actions = el("div", undefined, "practice-actions");
        for (const f of ["A", "B"]) {
          const b = button(
            t("ابدأ النموذج ", "Form starten ") + f,
            () => start(test.id, f),
            "practice-button" + (f === preferred ? " primary-action" : ""),
          );
          b.dataset.startTest = test.id;
          b.dataset.form = f;
          actions.append(b);
        }
        card.append(actions);
        host.append(card);
      }
      const history = $("placement-history");
      history.replaceChildren();
      const saved = Object.values(attempts())
        .filter((a) => C.getTest(a.testId))
        .sort(
          (a, b) =>
            (b.finishedAt || b.startedAt) - (a.finishedAt || a.startedAt),
        )
        .slice(0, 10);
      for (const a of saved) {
        const b = button(
          l(C.getTest(a.testId).title) +
            " · " +
            a.form +
            " · " +
            (a.status === "finished"
              ? t("عرض النتيجة", "Ergebnis ansehen")
              : t("متابعة المحاولة", "Versuch fortsetzen")) +
            " · " +
            new Date(a.finishedAt || a.startedAt).toLocaleDateString(
              lang() === "ar" ? "ar" : "de",
            ),
          () => {
            location.hash = "attempt=" + encodeURIComponent(a.id);
            open(a.id);
          },
        );
        b.dataset.attempt = a.id;
        history.append(b);
      }
      if (!saved.length)
        history.append(
          el("p", t("لم تبدأ اختبارًا بعد.", "Noch kein Test begonnen.")),
        );
    }
    function answer(value) {
      if (!attempt || attempt.status !== "draft") return;
      const q = C.questions(attempt)[attempt.index];
      if (
        value !== "unavailable" &&
        q.domain === "listening" &&
        !attempt.heard[q.passage]
      )
        return;
      attempt.answers[q.id] = value;
      save();
      renderQuestion();
    }
    function move(i) {
      stop();
      attempt.index = i;
      save();
      renderQuestion();
      $("placement-heading").focus({ preventScroll: true });
      $("placement-session").scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    }
    function renderQuestion() {
      stop();
      const bank = C.questions(attempt);
      attempt.index = Math.max(
        0,
        Math.min(Number(attempt.index) || 0, bank.length - 1),
      );
      const q = bank[attempt.index],
        passage = D.passages[q.passage];
      const heard = !!attempt.heard[q.passage],
        needsAudio = passage?.kind === "audio";
      const current = attempt.answers[q.id];
      $("placement-heading").textContent =
        l(C.getTest(attempt.testId).title) + " · " + attempt.form;
      $("placement-position").textContent =
        t(
          `السؤال ${attempt.index + 1} من ${bank.length} · `,
          `Aufgabe ${attempt.index + 1} von ${bank.length} · `,
        ) + l(D.domains[q.domain]);
      const s = C.score(attempt);
      $("placement-progress").max = bank.length;
      $("placement-progress").value = bank.length - s.pending;
      $("placement-answered").textContent = t(
        `${bank.length - s.pending} من ${bank.length} أُجيب عنها أو تُخطّيت صراحةً.`,
        `Bei ${bank.length - s.pending} von ${bank.length} Aufgaben wurde eine Antwort oder ein ausdrückliches Überspringen gespeichert.`,
      );
      $("placement-stimulus").textContent = needsAudio
        ? ""
        : passage?.text || q.stimulus || "";
      $("placement-stimulus").hidden = !$("placement-stimulus").textContent;
      $("placement-prompt").textContent = l(q.prompt);
      $("placement-audio").hidden = !needsAudio;
      $("placement-audio-status").textContent = needsAudio
        ? heard
          ? t(
              "استمعت إلى النص. يمكنك إعادته دون خصم.",
              "Text angehört. Wiederholen kostet keine Punkte.",
            )
          : t(
              "استمع إلى التسجيل حتى نهايته قبل الإجابة.",
              "Höre die Aufnahme bis zum Ende, bevor du antwortest.",
            )
        : "";
      if (needsAudio) {
        audio.src = D.audio[passage.text.normalize("NFC")];
        audio.onended = () => {
          if (attempt.status !== "draft") return;
          attempt.heard[q.passage] = true;
          save();
          renderQuestion();
        };
        audio.onerror = () => {
          $("placement-audio-status").textContent = t(
            "تعذّر تشغيل التسجيل. أعد المحاولة أو اختر «تعذّر الصوت»؛ لن يُحسب خطأً لغويًّا.",
            "Audio konnte nicht abgespielt werden. Erneut versuchen oder „Audio nicht verfügbar“ wählen; das zählt nicht als Sprachfehler.",
          );
        };
      }
      $("placement-listen").textContent = t("◖ استمع للنص", "◖ Text anhören");
      $("placement-listen").onclick = () => {
        attempt.replays[q.passage] = (attempt.replays[q.passage] || 0) + 1;
        save();
        audio.play().catch(() => {
          $("placement-audio-status").textContent = t(
            "اضغط الاستماع مجددًا وتحقق من صوت الجهاز، أو اختر تعذّر الصوت.",
            "Tippe erneut auf Anhören und prüfe die Lautstärke, oder wähle Audio nicht verfügbar.",
          );
        });
      };
      const options = $("placement-options");
      options.replaceChildren();
      q.options.forEach((value, index) => {
        const b = button(value, () => answer(index), "placement-option");
        b.lang = "ar";
        b.dir = "rtl";
        b.disabled = needsAudio && !heard;
        b.setAttribute("aria-pressed", String(current === index));
        options.append(b);
      });
      $("placement-unknown").textContent = t(
        "لا أعرف الإجابة",
        "Ich weiß es nicht",
      );
      $("placement-unknown").disabled = needsAudio && !heard;
      $("placement-unknown").setAttribute(
        "aria-pressed",
        String(current === "unknown"),
      );
      $("placement-unavailable").hidden = !needsAudio;
      $("placement-unavailable").textContent = t(
        "تعذّر الصوت — استبعد هذا السؤال",
        "Audio nicht verfügbar — Aufgabe ausschließen",
      );
      $("placement-unavailable").setAttribute(
        "aria-pressed",
        String(current === "unavailable"),
      );
      $("placement-previous").textContent = t("السابق", "Zurück");
      $("placement-next").textContent = t("التالي", "Weiter");
      $("placement-previous").disabled = attempt.index === 0;
      $("placement-next").disabled = attempt.index === bank.length - 1;
      $("placement-submit").textContent = t(
        "إنهاء الاختبار وعرض النتيجة",
        "Test beenden und Ergebnis anzeigen",
      );
      $("placement-submit").disabled = s.pending > 0;
      const nav = $("placement-question-nav");
      nav.replaceChildren(
        ...bank.map((item, i) => {
          const answered =
            C.response(item, attempt.answers[item.id]) !== "pending";
          const b = button(
            String(i + 1),
            () => move(i),
            "placement-question-number",
          );
          b.setAttribute(
            "aria-label",
            t(
              `السؤال ${i + 1} ${answered ? "مجاب عنه" : "غير مجاب عنه"}`,
              `Aufgabe ${i + 1} ${answered ? "bearbeitet" : "offen"}`,
            ),
          );
          b.setAttribute("aria-current", String(i === attempt.index));
          b.dataset.answered = String(answered);
          return b;
        }),
      );
      $("placement-selection-status").textContent =
        typeof current === "number"
          ? t(
              "حُفظ اختيارك. يمكنك تغييره قبل الإنهاء.",
              "Auswahl gespeichert. Du kannst sie bis zum Abschluss ändern.",
            )
          : current === "unknown"
            ? t(
                "سُجّلت «لا أعرف»؛ تُحسب ضمن ما يحتاج إلى تعلم.",
                "„Ich weiß es nicht“ gespeichert; dieser Inhalt benötigt Übung.",
              )
            : current === "unavailable"
              ? t(
                  "سُجّل تعذّر الصوت؛ سيُستبعد من الدرجة.",
                  "Audioproblem gespeichert; diese Aufgabe wird nicht bewertet.",
                )
              : "";
    }
    function link(rec) {
      const a = el("a", l(rec.label), "practice-button");
      a.href = rec.href;
      return a;
    }
    function renderResult() {
      stop();
      const result = attempt.result || C.score(attempt);
      $("placement-heading").textContent = t(
        "نتيجتك التشخيصية",
        "Dein diagnostisches Ergebnis",
      );
      $("placement-result-title").textContent =
        l(C.getTest(attempt.testId).title) + " · " + attempt.form;
      $("placement-result-summary").textContent = result.valid
        ? t(
            `${result.correct} صحيحة من ${result.valid} سؤالًا صالحًا للتقييم. ${result.unavailable} استُبعدت لتعذّر الصوت.`,
            `${result.correct} von ${result.valid} bewertbaren Aufgaben richtig. ${result.unavailable} wegen Audioproblemen ausgeschlossen.`,
          )
        : t(
            "لا توجد إجابات صالحة تكفي للتوصية.",
            "Keine ausreichenden bewertbaren Antworten für eine Empfehlung.",
          );
      const skills = $("placement-skills");
      skills.replaceChildren();
      const labels = {
        insufficient: ["دليل غير كافٍ", "Zu wenig Daten"],
        "initial-ready": ["مؤشر أولي إيجابي", "Erster positiver Hinweis"],
        "initial-gap": ["يحتاج اختبارًا أدق", "Genauer prüfen"],
        ready: [
          "جاهزية مبدئية في العينة",
          "Vorläufig bereit in dieser Stichprobe",
        ],
        developing: ["تثبيت وتدريب", "Festigen und üben"],
        practice: ["ابدأ بالتدريب الأساسي", "Mit Grundübungen beginnen"],
      };
      for (const [id, d] of Object.entries(result.domains)) {
        const card = el("article", undefined, "placement-skill");
        card.dataset.domain = id;
        card.dataset.status = d.status;
        card.append(
          el("h3", l(D.domains[id])),
          el(
            "p",
            d.valid
              ? t(
                  `${d.correct} صحيحة من ${d.valid} صالحة`,
                  `${d.correct} von ${d.valid} richtig`,
                )
              : t("لا توجد بنود صالحة", "Keine bewertbaren Aufgaben"),
          ),
          el("strong", t(...labels[d.status])),
        );
        if (d.unknown)
          card.append(
            el("p", t(`لا أعرف: ${d.unknown}`, `Weiß nicht: ${d.unknown}`)),
          );
        if (d.unavailable)
          card.append(
            el(
              "p",
              t(
                `مستبعدة تقنيًّا: ${d.unavailable}`,
                `Technisch ausgeschlossen: ${d.unavailable}`,
              ),
            ),
          );
        skills.append(card);
      }
      $("placement-unmeasured").textContent =
        t("مهارات لم يقسها هذا الاختبار: ", "Nicht gemessene Fertigkeiten: ") +
        (result.unmeasured.length
          ? result.unmeasured.map((id) => l(D.domains[id])).join("، ")
          : t(
              "لا توجد ضمن المهارات الثماني؛ النطق الشفهي والكتابة الحرة خارج التقييم الآلي.",
              "Alle acht Bereiche wurden angesprochen; mündliche Produktion und freies Schreiben werden nicht automatisch bewertet.",
            ));
      $("placement-insufficient").textContent = result.insufficient.length
        ? t(
            "تحتاج بيانات إضافية في: ",
            "Zusätzliche Daten erforderlich für: ",
          ) + result.insufficient.map((id) => l(D.domains[id])).join("، ")
        : "";
      const rec = $("placement-recommendations");
      rec.replaceChildren();
      if (result.primary) {
        const h = el(
          "h3",
          t(
            "نقطة البداية المقترحة داخل التطبيق",
            "Empfohlener Einstieg in dieser App",
          ),
        );
        rec.append(h, link(result.primary));
      }
      $("placement-apply").hidden = !result.primary;
      $("placement-apply").textContent = t(
        "اجعل هذه المحطة نقطة بدايتي في المسار",
        "Diesen Schritt als meinen Einstieg festlegen",
      );
      $("placement-apply").onclick = () => {
        if (!result.primary) return;
        window.LearningRoute.update({ lastStage: result.primary.stage });
        $("placement-applied").textContent = t(
          "حُفظت نقطة البداية. يمكنك فتح الدرس الآن أو العودة إلى المسار.",
          "Einstieg gespeichert. Du kannst die Lektion jetzt öffnen oder zum Lernpfad zurückkehren.",
        );
      };
      const lessonHost = $("placement-lessons");
      lessonHost.replaceChildren();
      const seen = new Set(result.primary ? [result.primary.href] : []);
      for (const item of result.lessons) {
        if (seen.has(item.href)) continue;
        seen.add(item.href);
        lessonHost.append(link(item));
        if (lessonHost.childElementCount >= 5) break;
      }
      if (!lessonHost.childElementCount)
        lessonHost.append(
          el(
            "p",
            t(
              "لم تظهر أخطاء في البنود المقاسة. جرّب تطبيق المهارة في نص جديد.",
              "In den gemessenen Aufgaben traten keine Fehler auf. Wende die Fertigkeit auf einen neuen Text an.",
            ),
          ),
        );
      const confirmation = $("placement-confirm");
      confirmation.replaceChildren();
      if (result.confirmTest) {
        const test = C.getTest(result.confirmTest);
        const recent = Object.values(attempts())
          .filter((a) => a.testId === test.id && a.status === "finished")
          .sort((a, b) => b.finishedAt - a.finishedAt)[0];
        const form = recent?.form === "A" ? "B" : "A";
        const a = button(
          t("أكّد التوصية باختبار: ", "Empfehlung prüfen mit: ") +
            l(test.title),
          () => start(test.id, form),
          "practice-button primary-action",
        );
        confirmation.append(a);
      } else
        confirmation.append(
          el(
            "p",
            t(
              "استخدم زر العودة إلى الاختبارات أعلاه لإكمال الفحص العام أو اختيار مهارة أخرى.",
              "Kehre über die Schaltfläche oben zur Testauswahl zurück, um den Gesamtcheck oder einen anderen Bereich zu bearbeiten.",
            ),
          ),
        );
      $("placement-review-toggle").textContent = t(
        "مراجعة الإجابات بعد انتهاء الاختبار",
        "Antworten nach Testabschluss ansehen",
      );
      $("placement-review").hidden = !reviewOpen;
      if (reviewOpen) {
        const host = $("placement-review");
        host.replaceChildren();
        for (const q of C.questions(attempt)) {
          const item = el("article", undefined, "placement-review-item");
          const kind = C.response(q, attempt.answers[q.id]);
          const text = D.passages[q.passage]?.text || q.stimulus;
          if (text) item.append(el("p", text, "placement-passage"));
          item.append(
            el("h4", l(q.prompt)),
            el(
              "p",
              t("إجابتك: ", "Deine Antwort: ") +
                (typeof attempt.answers[q.id] === "number"
                  ? q.options[attempt.answers[q.id]]
                  : kind === "unavailable"
                    ? t("تعذّر الصوت", "Audio nicht verfügbar")
                    : t("لا أعرف", "Ich weiß es nicht")),
            ),
            el("p", t("الحل: ", "Lösung: ") + q.options[q.correct]),
            el("p", l(q.explanation)),
          );
          if (lang() === "de") item.append(el("p", q.explanation.ar));
          host.append(item);
        }
      }
    }
    function render() {
      catalog();
      $("placement-catalog").hidden = !!attempt;
      $("placement-history-panel").hidden = !!attempt;
      document.querySelector(".placement-intro").hidden = !!attempt;
      $("placement-applied").textContent = "";
      const finished = attempt?.status === "finished";
      $("placement-session").hidden = !attempt;
      $("placement-question").hidden = !attempt || finished;
      $("placement-results").hidden = !finished;
      if (!attempt) return;
      if (finished) renderResult();
      else renderQuestion();
    }
    $("placement-unknown").onclick = () => answer("unknown");
    $("placement-unavailable").onclick = () => answer("unavailable");
    $("placement-previous").onclick = () => move(attempt.index - 1);
    $("placement-next").onclick = () => move(attempt.index + 1);
    $("placement-submit").onclick = () => {
      if (attempt.status !== "draft") return;
      attempt = C.finish(attempt);
      save();
      render();
      $("placement-heading").focus({ preventScroll: true });
      $("placement-session").scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    };
    $("placement-close").onclick = () => {
      stop();
      attempt = null;
      location.hash = "";
      render();
    };
    $("placement-review-toggle").onclick = () => {
      reviewOpen = !reviewOpen;
      renderResult();
    };
    $("placement-print").onclick = () => window.print();
    function hashId() {
      return new URLSearchParams(location.hash.slice(1)).get("attempt");
    }
    window.addEventListener("hashchange", () => {
      const id = hashId();
      if (id === attempt?.id) return;
      if (id && attempts()[id]) open(id);
      else if (!id) {
        stop();
        attempt = null;
        render();
      }
    });
    window.addEventListener("app-language-change", render);
    window.addEventListener("pagehide", stop);
    const id = hashId();
    if (id && attempts()[id]) open(id);
    else render();
    $("lesson-loading")?.remove();
  });
})();
