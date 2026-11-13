/* Open the requested rule immediately and keep all rules of its unit together. */
(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const host = document.getElementById("grammar-lesson");
    const unit = new URLSearchParams(location.search).get("unit");
    const lessons = window.ArabicGrammarData.lessons;
    const ids = window.HuroofEdition.unitGrammarLinks?.[unit] || [];
    const de = () => window.AppLanguage?.get() === "de";
    let nav;
    if (ids.length) {
      nav = document.createElement("nav");
      nav.className = "unit-grammar-context";
      nav.setAttribute("aria-label", "قواعد هذه الوحدة / Grammatik dieser Einheit");
      host.prepend(nav);
    }
    function render() {
      if (!nav) return;
      nav.replaceChildren();
      const title = document.createElement("strong");
      title.textContent = de() ? "Grammatik dieser Einheit" : "قواعد هذه الوحدة";
      nav.append(title);
      for (const id of ids) {
        const lesson = lessons.find(l => l.id === id);
        if (!lesson) continue;
        const a = document.createElement("a");
        a.className = "practice-button";
        a.href = "#" + id;
        a.textContent = lesson.title[de() ? "de" : "ar"];
        if (location.hash === a.hash) a.setAttribute("aria-current", "page");
        a.addEventListener("click", () => requestAnimationFrame(scroll));
        nav.append(a);
      }
      const back = document.createElement("a");
      back.className = "practice-button";
      back.href = "skills.html#" + unit + "/reading";
      back.textContent = de() ? "Zurück zur Einheit" : "رجوع إلى الوحدة";
      nav.append(back);
    }
    function scroll() {
      if (!lessons.some(l => "#" + l.id === location.hash)) return;
      const target = nav || document.getElementById("lesson-title");
      document.getElementById("grammar-index").open = false;
      const topbar = document.querySelector(".app-topbar");
      const offset = (topbar?.getBoundingClientRect().height || 64) + 16;
      window.scrollTo({top:Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset), behavior:"instant"});
    }
    window.addEventListener("hashchange", () => { render(); requestAnimationFrame(scroll); });
    window.addEventListener("app-language-change", render);
    render();
    if (location.hash) {
      requestAnimationFrame(scroll);
      document.fonts?.ready.then(scroll);
      window.addEventListener("load", scroll, {once:true});
    }
  });
})();
