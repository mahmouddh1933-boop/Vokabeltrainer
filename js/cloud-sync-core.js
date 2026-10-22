/* Durable per-tab outbox, three-way merges and an explicit cloud-key allowlist. */
(() => {
  "use strict";
  const KEYS = [
    "learningStats",
    "wrongWords",
    "studiedWords",
    "listMasteryV12",
    "vocabList",
    "arabicList",
    "currentVocabSource",
    "testResults",
    "lastTestOutcomeV12",
    "vocabTestDurationSeconds",
    "vocabInterfaceLanguage",
    "lettersLanguage",
    "oliveLearnerThemeV1",
    "jisrPracticeV1:sounds",
    "jisrPracticeV1:sentences",
    "jisrPracticeV1:stories",
    "jisrPracticeV1:book-two",
    "jisrPracticeV1:arabic-youth",
    "jisrPracticeV1:youth-two",
    "jisrPracticeV1:youth-book-two-part-one",
  ];
  const allowed = new Set(KEYS);
  const CACHE = "__oliveCloudCacheV1";
  const JOURNAL = "__oliveSyncJournalV1:";
  const counters = new Set([
    "totalTests",
    "totalQuestions",
    "correctAnswers",
    "wrongAnswers",
    "perfectTests",
    "qualifyingTests",
    "attempts",
    "mistakes",
    "qualifyingPasses",
  ]);
  const object = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value);
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const unsafe = (key) =>
    ["__proto__", "prototype", "constructor"].includes(key);
  function merge(base, local, remote, field = "", importing = false) {
    if (equal(local, base)) return remote;
    if (equal(remote, base)) return local;
    if (local === undefined) return undefined;
    if (remote === undefined) return local;
    if (typeof local === "number" && typeof remote === "number") {
      if (field === "bestScore") return Math.max(local, remote);
      if (counters.has(field)) {
        const before = typeof base === "number" ? base : 0;
        if (importing) return Math.max(local, remote);
        if (local >= before) {
          const count = remote + local - before;
          return field === "qualifyingPasses" ? Math.min(2, count) : count;
        }
      }
    }
    if (
      Array.isArray(local) &&
      Array.isArray(remote) &&
      ["studiedWords", "wrongWords"].includes(field)
    ) {
      const indexed = (list) =>
        Object.fromEntries(
          (Array.isArray(list) ? list : [])
            .filter(
              (item) =>
                object(item) &&
                typeof item.key === "string" &&
                !unsafe(item.key),
            )
            .map((item) => [item.key, item]),
        );
      return Object.values(
        merge(indexed(base), indexed(local), indexed(remote), "", importing),
      );
    }
    if (object(local) && object(remote)) {
      // Clearing a whole map is an intentional reset, rather than an additive update.
      if (
        !importing &&
        object(base) &&
        Object.keys(base).length &&
        !Object.keys(local).length
      )
        return {};
      const result = {};
      const before = object(base) ? base : {};
      for (const key of new Set([
        ...Object.keys(before),
        ...Object.keys(local),
        ...Object.keys(remote),
      ])) {
        if (unsafe(key)) continue;
        const value = merge(
          before[key],
          local[key],
          remote[key],
          key,
          importing,
        );
        if (value !== undefined) result[key] = value;
      }
      return result;
    }
    return importing ? remote : local;
  }
  function valueOf(raw) {
    if (raw === null || raw === undefined) return undefined;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return raw;
    }
  }
  function mergeValue(key, entry, remote) {
    if (entry.value === null) return null;
    const value = merge(
      valueOf(entry.base),
      valueOf(entry.value),
      valueOf(remote),
      key,
      !!entry.importing,
    );
    // UI preference strings are stored directly, whereas learning objects use JSON.
    return typeof value === "string" &&
      !["vocabList", "arabicList"].includes(key)
      ? value
      : JSON.stringify(value);
  }
  function readJSON(storage, key, fallback) {
    try {
      const value = JSON.parse(storage.getItem(key));
      return object(value) ? value : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function createSync({ storage, clientId, onChange = () => {} }) {
    const journalKey = JOURNAL + clientId,
      ownerScope = storage.scope;
    const saved = readJSON(storage, journalKey, {});
    const valid = (records) =>
      Object.fromEntries(
        Object.entries(object(records) ? records : {}).filter(
          ([key, entry]) =>
            allowed.has(key) &&
            object(entry) &&
            (entry.base === null || typeof entry.base === "string") &&
            (entry.value === null || typeof entry.value === "string") &&
            Number.isSafeInteger(entry.seq),
        ),
      );
    let pending = valid(saved.pending),
      outbox = valid(saved.outbox);
    let seq = Math.max(
      Number.isSafeInteger(saved.seq) ? saved.seq : 0,
      ...Object.values(pending).map((e) => e.seq),
      ...Object.values(outbox).map((e) => e.seq),
    );
    let cache = readJSON(storage, CACHE, {});
    const view = Object.fromEntries(
      KEYS.map((key) => [key, storage.getItem(key)]),
    );
    let transport,
      flushing,
      stopped = false,
      active = false;
    let status = "connecting",
      remoteChanged = false;
    const persist = () =>
      storage.setItem(
        journalKey,
        JSON.stringify({ schema: 1, seq, pending, outbox }),
        { silent: true },
      );
    const state = () => ({
      status,
      pending: Object.keys(pending).length + Object.keys(outbox).length,
      remoteChanged,
      persistent: storage.persistent,
    });
    const update = (value) => {
      status = value;
      onChange(state());
    };
    if (!saved.schema) {
      for (const key of KEYS) {
        // Only the first cloud-enabled page imports a previously unsynced value.
        const old = view[key];
        if (old !== null && !cache[key])
          pending[key] = {
            base: null,
            value: old,
            seq: ++seq,
            importing: true,
          };
      }
    }
    const fallback = readJSON(storage, "__oliveSyncFallbackV1", {});
    for (const [key, entry] of Object.entries(fallback)) {
      if (
        !allowed.has(key) ||
        !object(entry) ||
        !(entry.base === null || typeof entry.base === "string") ||
        !(entry.value === null || typeof entry.value === "string")
      )
        continue;
      pending[key] = {
        base: pending[key] ? pending[key].base : entry.base,
        value: entry.value,
        seq: ++seq,
        importing: pending[key]?.importing || false,
      };
    }
    persist();
    if (Object.keys(fallback).length)
      storage.removeItem("__oliveSyncFallbackV1", { silent: true });
    const unsubscribe = storage.subscribe(({ key, value, scope }) => {
      if (
        stopped ||
        !allowed.has(key) ||
        scope !== ownerScope ||
        value === view[key]
      )
        return;
      const previous = pending[key];
      pending[key] = {
        base: previous ? previous.base : view[key],
        value,
        seq: ++seq,
        importing: previous?.importing || false,
      };
      view[key] = value;
      persist();
      update("pending");
    });
    function setLocal(key, value) {
      if (value === null) storage.removeItem(key, { silent: true });
      else storage.setItem(key, value, { silent: true });
      view[key] = value;
    }
    function remember(records) {
      const latest = readJSON(storage, CACHE, {});
      for (const [key, record] of Object.entries(records)) {
        if (
          !allowed.has(key) ||
          !object(record) ||
          !Number.isSafeInteger(record.revision) ||
          !(record.value === null || typeof record.value === "string")
        )
          continue;
        if (!latest[key] || latest[key].revision <= record.revision)
          latest[key] = { revision: record.revision, value: record.value };
        cache[key] = { revision: record.revision, value: record.value };
        if (!active) {
          if (!pending[key] && !outbox[key]) setLocal(key, record.value);
        } else if (!pending[key] && !outbox[key] && record.value !== view[key])
          remoteChanged = true;
      }
      storage.setItem(CACHE, JSON.stringify(latest), { silent: true });
    }
    async function pull(head) {
      if (!transport || stopped) return;
      const revisions = head?.records || {};
      const changed = Object.keys(revisions).filter(
        (key) =>
          allowed.has(key) &&
          Number.isSafeInteger(revisions[key]) &&
          (!cache[key] || cache[key].revision < revisions[key]),
      );
      if (changed.length) remember(await transport.readRecords(changed, cache));
      // Shared cache avoids re-reading unchanged records on each page navigation.
      if (!active) {
        for (const [key, record] of Object.entries(cache))
          if (allowed.has(key) && !pending[key] && !outbox[key])
            setLocal(key, record.value);
      }
      update(
        Object.keys(pending).length || Object.keys(outbox).length
          ? "pending"
          : "saved",
      );
    }
    async function flush() {
      if (flushing) return flushing;
      if (!transport || stopped) return false;
      flushing = Promise.resolve().then(async () => {
        try {
          for (let round = 0; round < 5 && !stopped; round++) {
            if (!Object.keys(outbox).length) {
              if (!Object.keys(pending).length) {
                if (["offline", "setup", "too-large"].includes(status))
                  return false;
                update("saved");
                return true;
              }
              outbox = pending;
              pending = {};
              persist();
            }
            update("saving");
            const result = await transport.commit(outbox, clientId);
            if (stopped) return false;
            // The immutable outbox is acknowledged before handling newer changes.
            outbox = {};
            persist();
            remember(result);
            if (!active) {
              for (const [key, record] of Object.entries(result))
                if (!pending[key]) setLocal(key, record.value);
            }
          }
          update(
            Object.keys(pending).length || Object.keys(outbox).length
              ? "pending"
              : "saved",
          );
          return !Object.keys(pending).length && !Object.keys(outbox).length;
        } catch (error) {
          update(
            ["permission-denied", "failed-precondition", "not-found"].includes(
              error?.code,
            )
              ? "setup"
              : error?.code === "too-large"
                ? "too-large"
                : "offline",
          );
          return false;
        } finally {
          flushing = null;
        }
      });
      return flushing;
    }
    return {
      clientId,
      state,
      pull,
      flush,
      connect(value) {
        transport = value;
      },
      activate() {
        active = true;
      },
      stop() {
        stopped = true;
        unsubscribe();
      },
      fail(code) {
        update(code);
      },
    };
  }
  const api = { KEYS, CACHE, JOURNAL, merge, mergeValue, createSync };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.OliveSyncCore = api;
})();
