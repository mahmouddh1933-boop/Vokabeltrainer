(() => {
  "use strict";
  const localStorage = window.JisrStorage.local;
  const sessionStorage = window.JisrStorage.session;
  const data = window.ArabicLetterData.letters;
  const $ = (id) => document.getElementById(id);
  const langs = {
    ar: {
      home: "→ الصفحة الرئيسية",
      heading: "المستوى التمهيدي: تعلّم الحروف",
      intro:
        "اختر حرفاً واقلب البطاقة لرؤية أشكاله الأربعة داخل كلمات حقيقية. الحرف الملوّن هو الحرف الذي تتعلّمه.",
      choose: "اختر حرفاً",
      prev: "السابق",
      next: "التالي",
      listen: "🔊 استمع للحرف",
      example: "مثال مصوّر لكل حرف",
      sayWord: "🔊 استمع للكلمة",
      harakat: "الحركات والنطق",
      write: "تدرّب على كتابة الحرف",
      writeHelp: "تتبّع الحرف على اللوحة بإصبعك أو بالفأرة.",
      clear: "امسح اللوحة",
      guide: "إظهار / إخفاء الدليل",
      quiz: "اختبار الحروف",
      quizHelp: "اختر اسم الحرف الصحيح. الاختبار مستقل عن اختبارات المفردات.",
      newQuestion: "سؤال جديد",
      correct: "أحسنت! إجابة صحيحة",
      wrong: "حاول مرة أخرى في السؤال التالي",
      score: "النتيجة",
      speech: "الصوت غير متوفر في هذا المتصفح أو الجهاز",
      names: ["فتحة", "كسرة", "ضمة", "سكون"],
      sukunHelp: "الحرف الساكن لا يُنطق وحده؛ استمع إليه مع صوت قبله:",
    },
    de: {
      home: "← Zur Startseite",
      heading: "Einstieg: Arabische Buchstaben",
      intro:
        "Wähle einen Buchstaben und drehe die Karte um: Vier echte Wörter zeigen seine Schreibformen. Der Zielbuchstabe ist farbig markiert.",
      choose: "Buchstaben auswählen",
      prev: "Zurück",
      next: "Weiter",
      listen: "🔊 Buchstaben anhören",
      example: "Bild und Beispielwort",
      sayWord: "🔊 Wort anhören",
      harakat: "Vokalzeichen und Aussprache",
      write: "Buchstaben schreiben üben",
      writeHelp: "Fahre den Buchstaben mit Finger oder Maus nach.",
      clear: "Zeichenfläche leeren",
      guide: "Vorlage ein-/ausblenden",
      quiz: "Buchstaben-Quiz",
      quizHelp:
        "Wähle den richtigen Buchstabennamen. Unabhängig von den Vokabeltests.",
      newQuestion: "Neue Frage",
      correct: "Richtig! Sehr gut!",
      wrong: "Leider falsch. Versuche die nächste Frage.",
      score: "Punkte",
      speech: "Sprachausgabe auf diesem Gerät nicht verfügbar",
      names: ["Fatha", "Kasra", "Damma", "Sukun"],
      sukunHelp: "Ein Buchstabe mit Sukun braucht einen vorausgehenden Laut. Hörbeispiel:",
    },
  };
  let lang =
      localStorage.getItem("vocabInterfaceLanguage") === "de" ? "de" : "ar",
    index = 0,
    guide = true;
  function tr(k) {
    return langs[lang][k];
  }
  function speak(s) {
    window.lettersSpeak(s);
  }
  function sync() {
    const d = data[index];
    $("letter-card-image").src = d.img;
    $("letter-card-image").alt = d.word + " / " + d.meaning;
    window.ArabicLetterExamples.highlight(
      $("letter-card-word"),
      d.spokenWord || d.word,
      0,
    );
    $("letter-card-translation").textContent = d.meaning;
    const signs = ["َ", "ِ", "ُ", "ْ"];
    $("harakat-row").replaceChildren();
    signs.forEach((mark, i) => {
      let b = document.createElement("button");
      b.type = "button";
      const shown = d.char + mark;
      b.innerHTML =
        '<span class="marked" lang="ar">' +
        shown +
        "</span><span>" +
        tr("names")[i] +
        "</span>";
      b.onclick = () => speak(i === 3 ? d.sukunSample : shown);
      $("harakat-row").append(b);
    });
    $("sukun-help-text").textContent = tr("sukunHelp");
    $("sukun-sample").textContent = d.sukunSample;
    drawGuide();
  }
  function setLanguage(l) {
    lang = l;
    localStorage.setItem("lettersLanguage", l);
    localStorage.setItem("vocabInterfaceLanguage", l);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = tr(el.dataset.i18n);
    });
    $("letter-name").textContent =
      l === "ar" ? data[index].name : data[index].de;
    $("letter-front-name").textContent =
      l === "ar" ? data[index].name : data[index].de;
    sync();
    window.renderLetterFormsForLanguage?.();
  }
  window.addEventListener("app-language-change", (e) => {
    setLanguage(e.detail.lang);
    requestAnimationFrame(() => window.AppLanguage?.translate());
  });
  $("card-say-word").addEventListener("click", (e) => {
    e.stopPropagation();
    speak(data[index].spokenWord || data[index].word);
  });
  $("card-say-word").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      speak(data[index].spokenWord || data[index].word);
    }
  });
  window.addEventListener("letterchange", (e) => {
    index = e.detail.index;
    sync();
    $("letter-name").textContent =
      lang === "ar" ? data[index].name : data[index].de;
    $("letter-front-name").textContent =
      lang === "ar" ? data[index].name : data[index].de;
  });
  const canvas = $("writing-canvas"),
    ctx = canvas.getContext("2d");
  let drawing = false;
  function drawGuide() {
    ctx.clearRect(0, 0, 620, 290);
    if (guide) {
      ctx.save();
      ctx.fillStyle = "rgba(31,93,125,.14)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "210px Tahoma,Arial";
      ctx.fillText(data[index].char, 310, 145);
      ctx.restore();
    }
  }
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * canvas.width) / r.width,
      y: ((e.clientY - r.top) * canvas.height) / r.height,
    };
  }
  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    let p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    let p = pos(e);
    ctx.strokeStyle = "#125c86";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });
  for (let name of ["pointerup", "pointercancel", "lostpointercapture"])
    canvas.addEventListener(name, () => (drawing = false));
  $("clear-canvas").onclick = drawGuide;
  $("show-guide").onclick = () => {
    guide = !guide;
    drawGuide();
  };
  // Keep the original vocabulary tests and timers untouched.
  const saved = Number(sessionStorage.getItem("lettersLastIndex"));
  index =
    Number.isInteger(saved) && saved >= 0 && saved < data.length ? saved : 0;
  setLanguage(lang);
})();
