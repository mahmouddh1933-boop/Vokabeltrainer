(() => {
  "use strict";
  if (typeof Element !== "undefined" && !Element.prototype.replaceChildren) {
    Object.defineProperty(Element.prototype, "replaceChildren", {
      configurable: true,
      writable: true,
      value: function (...nodes) {
        while (this.firstChild) this.removeChild(this.firstChild);
        this.append(...nodes);
      },
    });
  }
  // File viewers, browser privacy settings and full storage can reject access.
  // A failed save must not prevent a lesson or its controls from starting.
  function createStorage(name, root = globalThis) {
    const memory = new Map();
    const pending = new Set();
    let persistent = true;
    let scope = "";
    // UI preferences stay shared; learning records are separated by Firebase UID.
    const sharedKeys = new Set([
      "vocabInterfaceLanguage",
      "lettersLanguage",
      "oliveLearnerThemeV1",
    ]);
    const storageKey = (key) =>
      scope && !sharedKeys.has(key)
        ? "oliveAccountV1:" + encodeURIComponent(scope) + ":" + key
        : key;
    return {
      setScope(value) {
        scope = typeof value === "string" ? value : "";
      },
      get persistent() {
        return persistent;
      },
      getItem(key) {
        key = storageKey(String(key));
        if (pending.has(key)) return memory.get(key) ?? null;
        try {
          const value = root[name].getItem(key);
          if (value !== null) memory.set(key, value);
          else memory.delete(key);
          return value;
        } catch (_) {
          persistent = false;
          return memory.get(key) ?? null;
        }
      },
      setItem(key, value) {
        key = storageKey(String(key));
        value = String(value);
        memory.set(key, value);
        try {
          root[name].setItem(key, value);
          pending.delete(key);
        } catch (_) {
          persistent = false;
          pending.add(key);
        }
      },
      removeItem(key) {
        key = storageKey(String(key));
        memory.delete(key);
        try {
          root[name].removeItem(key);
          pending.delete(key);
        } catch (_) {
          persistent = false;
          pending.add(key);
        }
      },
    };
  }
  let deferReady = false;
  let domReady =
    typeof document !== "undefined" && document.readyState === "complete";
  if (typeof document !== "undefined" && !domReady)
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        domReady = true;
      },
      { once: true },
    );
  const readyQueue = [];
  const api = {
    local: createStorage("localStorage"),
    session: createStorage("sessionStorage"),
    // Hosted pages load application scripts only after Firebase has restored
    // the user. Offline pages retain their normal DOMContentLoaded ordering.
    ready(callback) {
      if (deferReady) readyQueue.push(callback);
      else if (!domReady)
        document.addEventListener("DOMContentLoaded", callback, { once: true });
      else callback();
    },
    deferReady() {
      deferReady = true;
    },
    finishReady() {
      deferReady = false;
      for (const callback of readyQueue.splice(0)) callback();
    },
  };
  if (typeof module !== "undefined" && module.exports)
    module.exports = { createStorage };
  else window.JisrStorage = api;
})();
