/* Display names only: stable level IDs remain compatible with saved progress. */
(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const label = (text, german) => text.replace(/\bA([12])\b/g, (_, n) =>
      german ? "Stufe " + n : n === "1" ? "المستوى الأول" : "المستوى الثاني");
    let pending = false;
    function apply() {
      pending = false;
      const german = window.AppLanguage?.get() === "de";
      const walk = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
      while (walk.nextNode()) {
        const node = walk.currentNode;
        if (node.parentElement?.closest("script,style,textarea,[contenteditable]")) continue;
        const next = label(node.nodeValue, german);
        if (next !== node.nodeValue) node.nodeValue = next;
      }
      for (const node of document.querySelectorAll("[data-ar],[data-de],[aria-label],[title]")) {
        for (const attr of ["data-ar", "data-de", "aria-label", "title"]) {
          const value = node.getAttribute(attr);
          if (value === null) continue;
          const next = label(value, attr === "data-de" || (attr !== "data-ar" && german));
          if (next !== value) node.setAttribute(attr, next);
        }
      }
    }
    function schedule() { if (!pending) { pending = true; requestAnimationFrame(apply); } }
    new MutationObserver(schedule).observe(document.documentElement, {childList:true,subtree:true,characterData:true});
    window.addEventListener("app-language-change", schedule);
    apply();
  });
})();
