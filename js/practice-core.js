(() => {
  "use strict";
  const localStorage = window.JisrStorage.local;
  const $ = (id) => document.getElementById(id);
  let lang =
    localStorage.getItem("vocabInterfaceLanguage") === "de" ? "de" : "ar";
  const choose = (ar, de) => (lang === "de" ? de : ar);
  const bilingual = (value) => value[lang];
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function button(text, action, className = "practice-button") {
    const node = el("button", text, className);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
  }
  function arabic(node) {
    node.lang = "ar";
    node.dir = "rtl";
    return node;
  }
  function load(key, fallback) {
    try {
      const saved = JSON.parse(localStorage.getItem("jisrPracticeV1:" + key));
      return saved && typeof saved === "object" && !Array.isArray(saved)
        ? saved
        : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem("jisrPracticeV1:" + key, JSON.stringify(value));
    } catch (_) {}
  }
  function shuffle(items) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function speak(text) {
    window.VocabApp.speakArabic(text, (message, error) => {
      $("practice-audio-status").textContent = message;
      $("practice-audio-status").classList.toggle("is-error", error);
    });
  }
  function stop() {
    window.VocabApp.stopSpeech();
    $("practice-audio-status").textContent = "";
  }
  function onLanguage(render) {
    window.addEventListener("app-language-change", (event) => {
      lang = event.detail.lang === "de" ? "de" : "ar";
      stop();
      render();
    });
    window.addEventListener("pagehide", stop);
    render();
    $("lesson-loading")?.remove();
  }
  function navigation(previous, next, index, total) {
    previous.disabled = index <= 0;
    next.disabled = index >= total - 1;
  }
  function score(correct, done, total) {
    return choose(
      `${correct} صحيحة من ${done} إجابات · ${total} سؤالًا`,
      `${correct} von ${done} Antworten richtig · ${total} Fragen`,
    );
  }
  window.Practice = {
    $,
    choose,
    bilingual,
    el,
    button,
    arabic,
    load,
    save,
    shuffle,
    speak,
    stop,
    onLanguage,
    navigation,
    score,
  };
})();
