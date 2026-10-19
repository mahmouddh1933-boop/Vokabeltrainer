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
    return {
      get persistent() {
        return persistent;
      },
      getItem(key) {
        key = String(key);
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
        key = String(key);
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
        key = String(key);
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
  const api = {
    local: createStorage("localStorage"),
    session: createStorage("sessionStorage"),
  };
  if (typeof module !== "undefined" && module.exports)
    module.exports = { createStorage };
  else window.JisrStorage = api;
})();
