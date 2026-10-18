(() => {
  "use strict";
  window.lettersSpeak = (text) =>
    window.VocabApp.speakArabic(text, (message, error) => {
      for (const id of ["letters-speech-status", "enhanced-speech"]) {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = message;
          el.classList.toggle("speech-error", Boolean(error));
        }
      }
    });
  window.addEventListener("letterchange", clearLetterSpeech);
  window.addEventListener("app-language-change", clearLetterSpeech);
  window.addEventListener("pagehide", clearLetterSpeech);
  function clearLetterSpeech() {
    window.VocabApp.stopSpeech();
    for (const id of ["letters-speech-status", "enhanced-speech"]) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = "";
        el.classList.remove("speech-error");
      }
    }
  }
})();
