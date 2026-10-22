const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createStorage } = require("../js/storage.js");

test("Denied storage getters and methods preserve in-page interactions", () => {
  for (const root of [
    Object.defineProperty({}, "localStorage", {
      get() {
        throw new Error("denied");
      },
    }),
    {
      localStorage: {
        getItem() {
          throw new Error("denied");
        },
        setItem() {
          throw new Error("denied");
        },
        removeItem() {
          throw new Error("denied");
        },
      },
    },
  ]) {
    const storage = createStorage("localStorage", root);
    assert.equal(storage.getItem("language"), null);
    storage.setItem("language", "de");
    assert.equal(storage.getItem("language"), "de");
    storage.removeItem("language");
    assert.equal(storage.getItem("language"), null);
    assert.equal(storage.persistent, false);
  }
});

test("A failed write remains available even when reads are allowed", () => {
  const storage = createStorage("localStorage", {
    localStorage: {
      getItem: () => null,
      setItem() {
        throw new Error("quota");
      },
      removeItem() {
        throw new Error("denied");
      },
    },
  });
  storage.setItem("answer", JSON.stringify({ correct: true }));
  assert.deepEqual(JSON.parse(storage.getItem("answer")), { correct: true });
  assert.equal(storage.persistent, false);
});

test("Available storage remains persistent and reflects changes from other pages", () => {
  const data = new Map();
  const backend = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
  const storage = createStorage("localStorage", { localStorage: backend });
  storage.setItem("answer", 1);
  assert.equal(data.get("answer"), "1");
  data.set("answer", "2");
  assert.equal(storage.getItem("answer"), "2");
  storage.removeItem("answer");
  assert.equal(storage.getItem("answer"), null);
  assert.equal(storage.persistent, true);
});

test("Account scopes isolate learning data, including fallback memory, and retain UI preferences", () => {
  for (const denied of [false, true]) {
    const data = new Map();
    const storage = createStorage("localStorage", {
      localStorage: {
        getItem: (key) => {
          if (denied) throw Error("denied");
          return data.get(key) ?? null;
        },
        setItem: (key, value) => {
          if (denied) throw Error("denied");
          data.set(key, value);
        },
        removeItem: (key) => {
          if (denied) throw Error("denied");
          data.delete(key);
        },
      },
    });
    storage.setItem("learningStats", "offline");
    storage.setItem("vocabInterfaceLanguage", "de");
    storage.setScope("student:a");
    assert.equal(storage.getItem("learningStats"), null);
    storage.setItem("learningStats", "student A");
    storage.setItem("jisrPracticeV1:sentences", "A answers");
    storage.setScope("student:b");
    assert.equal(storage.getItem("learningStats"), null);
    assert.equal(storage.getItem("jisrPracticeV1:sentences"), null);
    assert.equal(storage.getItem("vocabInterfaceLanguage"), "de");
    storage.setItem("learningStats", "student B");
    storage.setScope("student:a");
    assert.equal(storage.getItem("learningStats"), "student A");
    assert.equal(storage.getItem("jisrPracticeV1:sentences"), "A answers");
    storage.removeItem("learningStats");
    storage.setScope("student:b");
    assert.equal(storage.getItem("learningStats"), "student B");
    storage.setScope("");
    assert.equal(storage.getItem("learningStats"), "offline");
  }
});

test("Deferred application callbacks wait for DOMContentLoaded and the complete authenticated script queue", () => {
  const vm = require("node:vm");
  const fs = require("node:fs");
  const listeners = [];
  const context = {
    window: {},
    document: {
      readyState: "interactive",
      addEventListener: (name, callback) => {
        assert.equal(name, "DOMContentLoaded");
        listeners.push(callback);
      },
    },
  };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(require.resolve("../js/storage.js"), "utf8"),
    context,
  );
  const api = context.window.JisrStorage,
    calls = [];
  api.ready(() => calls.push("offline"));
  assert.deepEqual(calls, []);
  listeners.forEach((callback) => callback());
  assert.deepEqual(calls, ["offline"]);
  api.deferReady();
  api.ready(() => calls.push("account app"));
  api.ready(() => calls.push("account language"));
  assert.deepEqual(calls, ["offline"]);
  api.finishReady();
  assert.deepEqual(calls, ["offline", "account app", "account language"]);
  api.ready(() => calls.push("late"));
  assert.equal(calls.at(-1), "late");
});
