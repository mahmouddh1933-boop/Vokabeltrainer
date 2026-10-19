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
