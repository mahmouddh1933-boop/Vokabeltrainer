(() => {
  window.JisrStorage.ready(() => {
    "use strict";
    const P = window.Practice,
      D = window.ArabicPhonicsData,
      { $, choose: t, el, button } = P;
    const modes = {
      segment: ["تقطيع الكلمات", "Wörter gliedern"],
      blend: ["دمج الحروف", "Buchstaben verbinden"],
      missing: ["الحرف الناقص", "Fehlender Buchstabe"],
      family: ["عائلات الكلمات", "Wortfamilien"],
    };
    let state = window.VocabApp.getStats().phonicsV1 || {};
    if (!modes[state.mode]) state.mode = "segment";
    if (
      !state.answers ||
      typeof state.answers !== "object" ||
      Array.isArray(state.answers)
    )
      state.answers = {};
    if (!state.positions || typeof state.positions !== "object")
      state.positions = {};
    const normalize = (v) =>
      String(v)
        .normalize("NFC")
        .replace(/[\u064b-\u0652\u0670ـ\s]/g, "");
    function save() {
      const stats = window.VocabApp.getStats();
      window.VocabApp.setJSON("learningStats", { ...stats, phonicsV1: state });
    }
    const bank = () => D[state.mode];
    const index = () =>
      Math.max(
        0,
        Math.min(Number(state.positions[state.mode]) || 0, bank().length - 1),
      );
    const current = () => bank()[index()];
    function entry() {
      const q = current();
      if (!state.answers[q.id] || typeof state.answers[q.id] !== "object")
        state.answers[q.id] = {
          solved: false,
          first: null,
          assisted: false,
          attempts: 0,
        };
      return state.answers[q.id];
    }
    let orderKey = "",
      order = [];
    function check(value) {
      const q = current(),
        e = entry();
      if (e.solved) return;
      const correct =
        state.mode === "blend"
          ? normalize(value) === normalize(q.word)
          : value === q.options[q.correct];
      e.attempts++;
      if (e.first === null) e.first = correct && !e.assisted;
      e.solved = correct;
      e.feedback = true;
      save();
      render();
    }
    function render() {
      const q = current(),
        e = entry(),
        i = index(),
        done = bank().filter((q) => state.answers[q.id]?.solved).length;
      $("phonics-modes").replaceChildren(
        ...Object.entries(modes).map(([key, names]) => {
          const b = button(
            t(...names),
            () => {
              P.stop();
              state.mode = key;
              save();
              render();
            },
            "practice-button",
          );
          b.dataset.mode = key;
          b.setAttribute("aria-pressed", String(state.mode === key));
          return b;
        }),
      );
      $("phonics-heading").textContent = t(...modes[state.mode]);
      const notes = {
        segment: [
          "نقسّم الكلمة إلى وحدات نطق مبسّطة: كَتَبَ ← كَ - تَ - بَ. الحرف الساكن يلتحق بما قبله، وحرف المد يبقى مع حركته: كِتَابْ ← كِ - تَابْ. الأسماء هنا مكتوبة بالسكون عند الوقف.",
          "Wir gliedern in einfache Sprecheinheiten: kataba → ka-ta-ba. Ein Konsonant mit Sukūn gehört zur vorigen Einheit; lange Vokale bleiben zusammen: kitāb → ki-tāb. Nomen stehen hier in der Pausenform.",
        ],
        blend: [
          "نجمع الحروف المكتوبة بالترتيب لنكوّن الكلمة. هذه حروف هجاء وليست مقاطع صوتية. يمكنك الكتابة دون تشكيل؛ تبقى الهمزة والتاء المربوطة والألف المقصورة مهمة.",
          "Verbinde die geschriebenen Buchstaben zu einem Wort. Das sind Buchstaben, keine Silben. Vokalzeichen sind bei der Eingabe freiwillig; Hamza, Tāʾ marbūṭa und Alif maqṣūra bleiben wichtig.",
        ],
        missing: [
          "استمع إلى الكلمة المألوفة، ثم أكمل الحرف الناقص. إذا تعذّر الاستماع، تعرض المساعدة الكلمة وتُحسب الإجابة بمساعدة.",
          "Höre das bekannte Wort und ergänze den Buchstaben. Bei Audioproblemen zeigt die Hilfe das Wort; die Lösung zählt dann als unterstützt.",
        ],
        family: [
          "ميّز بين تشابه الوزن وتشابه النهاية الصوتية. اقرأ المجموعة، ثم اختر الكلمة التي تنتمي إليها.",
          "Unterscheide Wortbildungsmuster und gleichen Auslaut. Lies die Gruppe und wähle das passende Wort.",
        ],
      };
      $("phonics-lesson").textContent = t(...notes[state.mode]);
      $("phonics-counter").textContent = `${i + 1} / ${bank().length}`;
      $("phonics-score").textContent = t(
        `${done} / ${bank().length} مكتملة · ${bank().filter((q) => state.answers[q.id]?.first === true).length} صحيحة أول مرة دون مساعدة`,
        `${done} / ${bank().length} gelöst · ${bank().filter((q) => state.answers[q.id]?.first === true).length} beim ersten Versuch ohne Hilfe`,
      );
      $("phonics-progress").value = done;
      const prompts = {
        segment: ["اختر التقطيع الصحيح.", "Wähle die richtige Gliederung."],
        blend: [
          "اكتب الكلمة الناتجة من دمج هذه الحروف.",
          "Schreibe das Wort aus diesen Buchstaben.",
        ],
        missing: [
          "ما الحرف الناقص؟ استمع أولًا.",
          "Welcher Buchstabe fehlt? Höre zuerst.",
        ],
        family: [
          "أي كلمة تُكمل هذه العائلة؟",
          "Welches Wort ergänzt die Gruppe?",
        ],
      };
      $("phonics-prompt").textContent = t(...prompts[state.mode]);
      $("phonics-family").textContent = q.family ? P.bilingual(q.family) : "";
      $("phonics-display").textContent =
        state.mode === "segment"
          ? q.word
          : state.mode === "blend"
            ? q.parts.join(" - ")
            : q.display;
      $("phonics-form").hidden = state.mode !== "blend";
      $("phonics-input-label").textContent = t("الكلمة:", "Wort:");
      $("phonics-input").value = e.typed || "";
      $("phonics-input").disabled = !!e.solved;
      $("phonics-check").textContent = t("تحقق", "Prüfen");
      $("phonics-check").disabled = !!e.solved;
      $("phonics-listen").textContent = t("◖ استمع للكلمة", "◖ Wort anhören");
      $("phonics-help").textContent = t("اعرض المساعدة", "Hilfe anzeigen");
      $("phonics-help").disabled = !!e.solved;
      $("phonics-options").replaceChildren();
      if (state.mode !== "blend" || e.assisted) {
        if (orderKey !== q.id) {
          order = P.shuffle(q.options.map((_, i) => i));
          orderKey = q.id;
        }
        for (const k of order) {
          const b = button(q.options[k], () => check(q.options[k]));
          b.lang = "ar";
          b.dir = "rtl";
          b.disabled = !!e.solved;
          $("phonics-options").append(b);
        }
      }
      const feedback = $("phonics-feedback");
      feedback.replaceChildren();
      if (e.assisted) {
        feedback.append(
          el(
            "p",
            t("بمساعدة: ", "Mit Hilfe: ") +
              (state.mode === "segment" ? q.parts.join(" - ") : q.word),
          ),
        );
      }
      if (e.feedback || e.solved) {
        feedback.append(
          el(
            "strong",
            e.solved
              ? t("أحسنت، إجابة صحيحة!", "Richtig, gut gemacht!")
              : t(
                  "حاول مرة أخرى. استمع واقرأ بهدوء.",
                  "Versuche es erneut. Höre und lies in Ruhe.",
                ),
          ),
        );
        if (e.solved) {
          feedback.append(
            el("p", state.mode === "segment" ? q.parts.join(" - ") : q.word),
          );
          if (q.de) feedback.append(el("p", q.de));
          if (q.explanation)
            feedback.append(el("p", P.bilingual(q.explanation)));
        }
      }
      $("phonics-prev").textContent = t("السابق", "Zurück");
      $("phonics-next").textContent = t("التالي", "Weiter");
      P.navigation($("phonics-prev"), $("phonics-next"), i, bank().length);
      $("phonics-reset").textContent = t(
        "أعد هذا النوع",
        "Diese Übungsart zurücksetzen",
      );
      save();
    }
    $("phonics-form").onsubmit = (ev) => {
      ev.preventDefault();
      entry().typed = $("phonics-input").value;
      check(entry().typed);
    };
    $("phonics-input").oninput = (ev) => {
      entry().typed = ev.target.value;
      save();
    };
    $("phonics-listen").onclick = () => P.speak(current().word);
    $("phonics-help").onclick = () => {
      entry().assisted = true;
      if (entry().first === null) entry().first = false;
      save();
      render();
    };
    function move(n) {
      P.stop();
      state.positions[state.mode] = index() + n;
      save();
      render();
      $("phonics-heading").focus({ preventScroll: true });
    }
    $("phonics-prev").onclick = () => move(-1);
    $("phonics-next").onclick = () => move(1);
    $("phonics-reset").onclick = () => {
      for (const q of bank()) delete state.answers[q.id];
      state.positions[state.mode] = 0;
      P.stop();
      save();
      render();
    };
    P.onLanguage(render);
  });
})();
