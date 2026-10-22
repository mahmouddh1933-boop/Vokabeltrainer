const { test } = require("node:test");
const assert = require("node:assert/strict");
const C = require("../js/cloud-sync-core.js");
const { createStorage } = require("../js/storage.js");
const object = (value) => JSON.stringify(value);
function store() {
  const data = new Map();
  const backend = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
    key: (index) => Array.from(data.keys())[index],
    get length() {
      return data.size;
    },
  };
  const storage = createStorage("localStorage", { localStorage: backend });
  storage.setScope("student");
  return storage;
}
function server() {
  const records = {},
    calls = [];
  return {
    records,
    calls,
    readRecords: async (keys) =>
      Object.fromEntries(keys.map((key) => [key, records[key]])),
    async commit(batch, client) {
      const result = {};
      for (const [key, entry] of Object.entries(batch)) {
        const old = records[key] || { revision: 0, value: null, applied: {} };
        if ((old.applied[client] || 0) >= entry.seq) {
          result[key] = old;
          continue;
        }
        result[key] = records[key] = {
          schema: 1,
          revision: old.revision + 1,
          value: C.mergeValue(key, entry, old.value),
          applied: { ...old.applied, [client]: entry.seq },
        };
        calls.push([key, client, entry.seq]);
      }
      return result;
    },
    head() {
      return {
        records: Object.fromEntries(
          Object.entries(records).map(([key, value]) => [key, value.revision]),
        ),
      };
    },
  };
}
async function device(backend, id, storage = store()) {
  const engine = C.createSync({ storage, clientId: id });
  engine.connect(backend);
  await engine.pull(backend.head());
  engine.activate();
  return { storage, engine };
}
test("Only explicitly allowlisted learning data is queued; tokens and session state stay out", async () => {
  const cloud = server(),
    a = await device(cloud, "a");
  await a.engine.flush(); // A previously empty flush must not block future writes.
  a.storage.setItem("firebase:authUser", "never upload");
  a.storage.setItem("__secret", "private");
  assert.equal(a.engine.state().pending, 0);
  a.storage.setItem("learningStats", object({ totalTests: 1 }));
  await a.engine.flush();
  assert.deepEqual(Object.keys(cloud.records), ["learningStats"]);
  a.engine.stop();
});
test("Separate devices merge different questions and independent counters without overwriting either", async () => {
  const cloud = server(),
    a = await device(cloud, "a"),
    b = await device(cloud, "b");
  a.storage.setItem(
    "jisrPracticeV1:sentences",
    object({ answers: { q1: { solved: true } }, index: 0 }),
  );
  b.storage.setItem(
    "jisrPracticeV1:sentences",
    object({ answers: { q2: { solved: true } }, index: 1 }),
  );
  a.storage.setItem("learningStats", object({ totalTests: 1, bestScore: 100 }));
  b.storage.setItem("learningStats", object({ totalTests: 1, bestScore: 80 }));
  await a.engine.flush();
  await b.engine.flush();
  assert.deepEqual(
    Object.keys(
      JSON.parse(cloud.records["jisrPracticeV1:sentences"].value).answers,
    ).sort(),
    ["q1", "q2"],
  );
  assert.deepEqual(JSON.parse(cloud.records.learningStats.value), {
    totalTests: 2,
    bestScore: 100,
  });
  a.engine.stop();
  b.engine.stop();
});
test("A page keeps its active draft, offers remote updates and imports them before next startup", async () => {
  const cloud = server(),
    a = await device(cloud, "a"),
    b = await device(cloud, "b");
  a.storage.setItem(
    "jisrPracticeV1:book-two",
    object({ answers: { alif: { one: "أ" } } }),
  );
  await a.engine.flush();
  await b.engine.pull(cloud.head());
  assert.equal(b.storage.getItem("jisrPracticeV1:book-two"), null);
  assert.equal(b.engine.state().remoteChanged, true);
  b.engine.stop();
  const next = C.createSync({ storage: b.storage, clientId: "b" });
  next.connect(cloud);
  await next.pull(cloud.head());
  assert.equal(
    JSON.parse(b.storage.getItem("jisrPracticeV1:book-two")).answers.alif.one,
    "أ",
  );
  a.engine.stop();
  next.stop();
});
test("A lost acknowledgement is replayed once, even after another device updates the record", async () => {
  const cloud = server(),
    local = store();
  let lose = true;
  const flaky = {
    ...cloud,
    commit: async (...args) => {
      const result = await cloud.commit(...args);
      if (lose) {
        lose = false;
        throw Error("Connection lost after commit");
      }
      return result;
    },
  };
  const a = await device(flaky, "a", local);
  a.storage.setItem("learningStats", object({ totalTests: 1 }));
  assert.equal(await a.engine.flush(), false);
  a.engine.stop();
  const b = await device(cloud, "b");
  b.storage.setItem("learningStats", object({ totalTests: 2 }));
  await b.engine.flush();
  const reload = C.createSync({ storage: local, clientId: "a" });
  reload.connect(cloud);
  await reload.flush();
  assert.equal(JSON.parse(cloud.records.learningStats.value).totalTests, 2);
  assert.equal(cloud.calls.filter(([, client]) => client === "a").length, 1);
  reload.stop();
  b.engine.stop();
});
test("Changes during an in-flight write survive a crash without counting the acknowledged prefix twice", async () => {
  const cloud = server(),
    storage = store();
  let release,
    first = true;
  const paused = {
    ...cloud,
    commit: async (...args) => {
      if (first) {
        first = false;
        await new Promise((resolve) => {
          release = resolve;
        });
        await cloud.commit(...args);
        throw Error("Ack lost");
      }
      return cloud.commit(...args);
    },
  };
  const a = await device(paused, "a", storage);
  storage.setItem("learningStats", object({ totalTests: 1 }));
  const sending = a.engine.flush();
  await new Promise((resolve) => setImmediate(resolve));
  storage.setItem("learningStats", object({ totalTests: 2 }));
  release();
  await sending;
  a.engine.stop();
  const reload = C.createSync({ storage, clientId: "a" });
  reload.connect(cloud);
  await reload.flush();
  assert.equal(JSON.parse(cloud.records.learningStats.value).totalTests, 2);
  assert.equal(cloud.calls.length, 2);
  reload.stop();
});
test("Word lists merge by identity; wrong-word removals preserve newly added remote entries", () => {
  const base = [
    { key: "a", mistakes: 1 },
    { key: "b", mistakes: 1 },
  ];
  const local = [{ key: "b", mistakes: 2 }];
  const remote = [
    { key: "a", mistakes: 1 },
    { key: "b", mistakes: 2 },
    { key: "c", mistakes: 1 },
  ];
  assert.deepEqual(C.merge(base, local, remote, "wrongWords"), [
    { key: "b", mistakes: 3 },
    { key: "c", mistakes: 1 },
  ]);
});
test("Deliberate resets and removals are tombstones, not resurrected default values", async () => {
  const cloud = server(),
    a = await device(cloud, "a");
  a.storage.setItem(
    "jisrPracticeV1:sounds",
    object({ answers: { one: true } }),
  );
  await a.engine.flush();
  a.storage.setItem("jisrPracticeV1:sounds", object({ answers: {} }));
  await a.engine.flush();
  assert.deepEqual(JSON.parse(cloud.records["jisrPracticeV1:sounds"].value), {
    answers: {},
  });
  a.storage.removeItem("jisrPracticeV1:sounds");
  await a.engine.flush();
  assert.equal(cloud.records["jisrPracticeV1:sounds"].value, null);
  const b = await device(cloud, "b");
  assert.equal(b.storage.getItem("jisrPracticeV1:sounds"), null);
  a.engine.stop();
  b.engine.stop();
});
test("Legacy local migration unions distinct answers while conservatively avoiding doubled historical statistics", async () => {
  const cloud = server(),
    a = await device(cloud, "a");
  a.storage.setItem("learningStats", object({ totalTests: 7 }));
  await a.engine.flush();
  const local = store();
  local.setItem("learningStats", object({ totalTests: 7 }));
  const imported = C.createSync({ storage: local, clientId: "legacy" });
  imported.connect(cloud);
  await imported.flush();
  assert.equal(JSON.parse(cloud.records.learningStats.value).totalTests, 7);
  assert.equal(local.getItem("learningStats"), object({ totalTests: 7 }));
  imported.stop();
  a.engine.stop();
});
test("Pending journals remain available after a rejected write; stopping prevents account crossover", async () => {
  const storage = store(),
    cloud = server();
  const a = await device(
    {
      ...cloud,
      commit: async () => {
        throw Object.assign(Error(), { code: "permission-denied" });
      },
    },
    "a",
    storage,
  );
  storage.setItem("learningStats", '{"totalTests":1}');
  assert.equal(await a.engine.flush(), false);
  assert.equal(a.engine.state().status, "setup");
  assert.equal(a.engine.state().pending, 1);
  a.engine.stop();
  storage.setScope("another student");
  storage.setItem("learningStats", '{"totalTests":5}');
  storage.setScope("student");
  assert.equal(
    JSON.parse(storage.getItem(C.JOURNAL + "a")).outbox.learningStats.value,
    '{"totalTests":1}',
  );
});

test("Changes made while the sync scripts were unavailable are recovered without uploading unknown keys", async () => {
  const cloud = server(),
    a = await device(cloud, "a");
  a.storage.setItem("learningStats", '{"totalTests":1}');
  await a.engine.flush();
  a.engine.stop();
  a.storage.setItem("learningStats", '{"totalTests":2}');
  a.storage.setItem(
    "__oliveSyncFallbackV1",
    JSON.stringify({
      learningStats: { base: '{"totalTests":1}', value: '{"totalTests":2}' },
      "firebase:authUser": { base: null, value: "never upload" },
    }),
  );
  const restored = C.createSync({ storage: a.storage, clientId: "a" });
  restored.connect(cloud);
  await restored.flush();
  assert.equal(JSON.parse(cloud.records.learningStats.value).totalTests, 2);
  assert.equal(a.storage.getItem("__oliveSyncFallbackV1"), null);
  assert.equal(cloud.records["firebase:authUser"], undefined);
  restored.stop();
});

test("An empty flush does not turn a connection or setup error into a successful sync", async () => {
  const cloud = server(),
    a = await device(cloud, "a");
  for (const status of ["offline", "setup", "too-large"]) {
    a.engine.fail(status);
    assert.equal(await a.engine.flush(), false);
    assert.equal(a.engine.state().status, status);
  }
  await a.engine.pull(cloud.head());
  assert.equal(await a.engine.flush(), true);
  a.engine.stop();
});
