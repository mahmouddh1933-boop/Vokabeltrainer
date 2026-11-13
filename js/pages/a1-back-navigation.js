/* Loaded only in the A1–A2 edition. Keep a local trail, including unit tabs. */
(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const main = document.querySelector("main");
    if (!main || /\/(login|offline)\.html$/.test(location.pathname)) return;
    const storage = window.JisrStorage.session;
    const key = "a1NavigationTrailV1";
    const root = new URL("./", location.href);
    const safe = (value) => {
      if (typeof value !== "string") return false;
      try {
        const url = new URL(value, root);
        return url.origin === root.origin && url.pathname.startsWith(root.pathname) &&
          /^[\w-]+\.html$/.test(url.pathname.slice(root.pathname.length));
      } catch (_) { return false; }
    };
    let trail;
    try { trail = JSON.parse(storage.getItem(key) || "[]"); } catch (_) {}
    trail = Array.isArray(trail) ? trail.filter(safe).slice(-20) : [];
    let back = main.querySelector(".page-back-link");
    if (!back) {
      const bar = document.createElement("nav");
      bar.className = "page-back-nav";
      bar.setAttribute("aria-label", "الرجوع / Zurück");
      back = document.createElement("a");
      back.className = "page-back-link";
      bar.append(back);
      main.prepend(bar);
    }
    function fallback() {
      const page = location.pathname.split("/").pop();
      if (page === "skills.html") {
        const [id, module] = location.hash.slice(1).split("/");
        if (/^a[12]-/.test(id)) {
          return module && module !== "vocabulary"
            ? "skills.html#" + id + "/vocabulary"
            : "skills.html#" + (id.startsWith("a2-") ? "A2" : "A1");
        }
      }
      if (page === "grammar.html" && location.hash) return "grammar.html";
      if (/^(test[1-6]|ergebnis)\.html$/.test(page)) return "test.html";
      if (["lernseite.html", "test.html", "review.html"].includes(page)) return "vocabulary.html";
      return "index.html";
    }
    function update() {
      const current = location.pathname.slice(root.pathname.length) + location.search + location.hash;
      if (safe(current) && trail.at(-1) !== current) {
        if (trail.at(-2) === current) trail.pop();
        else trail.push(current);
        trail = trail.slice(-20);
        storage.setItem(key, JSON.stringify(trail));
      }
      back.href = trail.length > 1 ? trail.at(-2) : fallback();
      back.dataset.ar = "رجوع إلى الخلف";
      back.dataset.de = "Zurück";
      back.textContent = window.AppLanguage?.get() === "de" ? "Zurück" : "رجوع إلى الخلف";
      back.parentElement.hidden = current === "index.html" && trail.length < 2;
    }
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    window.addEventListener("app-language-change", update);
    window.addEventListener("pageshow", update);
    update();
  });
})();
