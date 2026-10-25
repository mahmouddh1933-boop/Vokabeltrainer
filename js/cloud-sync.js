/* Firebase adapter. No credentials, auth tokens or session-only exam data are synced. */
(() => {
  "use strict";
  const C = window.OliveSyncCore;
  const storage = window.JisrStorage.local;
  const session = window.JisrStorage.session;
  const allowed = new Set(C.KEYS);
  let engine,
    database,
    transport,
    unsubscribe,
    stopped = false,
    connecting;
  let timer, retryTimer, releaseOwner, uid;
  let current = { status: "connecting", pending: 0, remoteChanged: false };
  let serial = Promise.resolve();
  const listeners = new Set();
  const emit = (value) => {
    current = value;
    listeners.forEach((listener) => listener(value));
    window.dispatchEvent(
      new CustomEvent("olive-sync-change", { detail: value }),
    );
    if (
      value.pending &&
      !stopped &&
      !["setup", "too-large"].includes(value.status)
    ) {
      clearTimeout(timer);
      timer = setTimeout(
        () => flush(),
        value.status === "offline" ? 15000 : 1500,
      );
    }
  };
  const deadline = (promise, ms) =>
    new Promise((resolve, reject) => {
      const id = setTimeout(
        () =>
          reject(Object.assign(new Error("Timeout"), { code: "unavailable" })),
        ms,
      );
      promise.then(
        (value) => {
          clearTimeout(id);
          resolve(value);
        },
        (error) => {
          clearTimeout(id);
          reject(error);
        },
      );
    });
  function failure(error) {
    engine?.fail(
      ["permission-denied", "failed-precondition", "not-found"].includes(
        error?.code,
      )
        ? "setup"
        : "offline",
    );
  }
  async function reserve(clientId) {
    if (!navigator.locks) return { held: true, release() {} };
    let resolveHeld, release;
    const acquired = new Promise((resolve) => {
      resolveHeld = resolve;
    });
    const lifetime = new Promise((resolve) => {
      release = resolve;
    });
    navigator.locks
      .request(
        "olive-sync:" + uid + ":" + clientId,
        { ifAvailable: true },
        async (lock) => {
          resolveHeld(!!lock);
          if (lock) await lifetime;
        },
      )
      .catch(() => resolveHeld(false));
    return { held: await acquired, release };
  }
  function validRecord(record) {
    return (
      record &&
      record.schema === 1 &&
      Number.isSafeInteger(record.revision) &&
      (record.value === null || typeof record.value === "string") &&
      typeof record.applied === "object"
    );
  }
  function firebaseTransport(userId) {
    const head = database.doc("users/" + userId + "/sync/state");
    const records = database.collection("users/" + userId + "/learning");
    const timestamp = () =>
      window.firebase.firestore.FieldValue.serverTimestamp();
    function readHead(snapshot) {
      const value = snapshot.exists
        ? snapshot.data()
        : { version: 0, records: {} };
      if (
        !value.records ||
        typeof value.records !== "object" ||
        !Number.isSafeInteger(value.version)
      )
        throw Object.assign(new Error("Invalid cloud metadata"), {
          code: "failed-precondition",
        });
      return value;
    }
    return {
      head,
      readHead,
      async readRecords(keys, cache = {}) {
        // Read the current manifest and its changed records from one snapshot,
        // so a vocabulary list and its source cannot come from different devices.
        return database.runTransaction(
          async (transaction) => {
            const meta = readHead(await transaction.get(head));
            const changed = Array.from(
              new Set([
                ...keys,
                ...Object.keys(meta.records).filter(
                  (key) =>
                    allowed.has(key) &&
                    (!cache[key] || cache[key].revision < meta.records[key]),
                ),
              ]),
            );
            const snapshots = await Promise.all(
              changed.map((key) => transaction.get(records.doc(key))),
            );
            const result = {};
            changed.forEach((key, index) => {
              if (!validRecord(snapshots[index].data()))
                throw Object.assign(new Error("Invalid cloud record"), {
                  code: "failed-precondition",
                });
              result[key] = snapshots[index].data();
            });
            return result;
          },
          { maxAttempts: 3 },
        );
      },
      commit(batch, clientId) {
        if (stopped) throw new Error("Stopped");
        if (!navigator.onLine)
          throw Object.assign(new Error("Offline"), { code: "unavailable" });
        return database.runTransaction(
          async (transaction) => {
            if (stopped) throw new Error("Stopped");
            const headSnapshot = await transaction.get(head);
            const meta = readHead(headSnapshot);
            const keys = Object.keys(batch).filter((key) => allowed.has(key));
            const snapshots = await Promise.all(
              keys.map((key) => transaction.get(records.doc(key))),
            );
            const revisions = { ...meta.records },
              result = {};
            let modified = false;
            keys.forEach((key, index) => {
              const snapshot = snapshots[index];
              const old = snapshot.exists
                ? snapshot.data()
                : { revision: 0, value: null, applied: {} };
              if (snapshot.exists && !validRecord(old))
                throw Object.assign(new Error("Invalid cloud record"), {
                  code: "failed-precondition",
                });
              if ((old.applied[clientId] || 0) >= batch[key].seq) {
                result[key] = old;
                return;
              }
              const value = C.mergeValue(key, batch[key], old.value);
              if (
                value !== null &&
                new TextEncoder().encode(value).length > 600000
              )
                throw Object.assign(new Error("Record too large"), {
                  code: "too-large",
                });
              const next = {
                schema: 1,
                revision: old.revision + 1,
                value,
                applied: { ...old.applied, [clientId]: batch[key].seq },
                updatedAt: timestamp(),
              };
              transaction.set(records.doc(key), next);
              revisions[key] = next.revision;
              result[key] = next;
              modified = true;
            });
            if (modified)
              transaction.set(head, {
                schema: 1,
                version: meta.version + 1,
                records: revisions,
                updatedAt: timestamp(),
              });
            return result;
          },
          { maxAttempts: 3 },
        );
      },
    };
  }
  async function recover() {
    if (!navigator.locks || stopped) return true;
    let complete = true;
    for (const key of storage.keys()) {
      if (!key.startsWith(C.JOURNAL) || key === C.JOURNAL + engine.clientId)
        continue;
      let data;
      try {
        data = JSON.parse(storage.getItem(key));
      } catch (_) {
        continue;
      }
      if (
        !Object.keys(data?.pending || {}).length &&
        !Object.keys(data?.outbox || {}).length
      )
        continue;
      const client = key.slice(C.JOURNAL.length),
        owner = await reserve(client);
      if (!owner.held) continue;
      const recovery = C.createSync({ storage, clientId: client });
      recovery.connect(transport);
      try {
        if (!(await recovery.flush())) complete = false;
      } finally {
        recovery.stop();
        owner.release();
      }
    }
    return complete;
  }
  async function connect(loadScript) {
    if (connecting) return connecting;
    connecting = (async () => {
      if (!window.firebase.firestore)
        await loadScript("js/vendor/firebase/firebase-firestore-compat.js");
      if (stopped) return;
      database ||= window.firebase.firestore();
      if (!transport) {
        if (window.OliveFirebaseConfig.emulator)
          database.useEmulator("127.0.0.1", 8080);
        transport = firebaseTransport(uid);
        engine.connect(transport);
      }
      if (!(await recover())) engine.activate();
      // Replay immutable outboxes before loading remote state into the page.
      await engine.flush();
      const snapshot = await transport.head.get({ source: "server" });
      if (stopped) return;
      await engine.pull(transport.readHead(snapshot));
      unsubscribe?.();
      unsubscribe = transport.head.onSnapshot(
        { includeMetadataChanges: true },
        (snapshot) => {
          if (
            stopped ||
            snapshot.metadata.hasPendingWrites ||
            snapshot.metadata.fromCache
          )
            return;
          serial = serial
            .then(() => engine.pull(transport.readHead(snapshot)))
            .catch(failure);
        },
        failure,
      );
    })()
      .catch((error) => {
        failure(error);
      })
      .finally(() => {
        connecting = null;
      });
    return connecting;
  }
  async function flush() {
    if (stopped || !engine) return false;
    clearTimeout(timer);
    if (navigator.onLine === false) { engine.fail("offline"); return false; }
    if (!transport) {
      await connect(loadFirestore);
    }
    return engine.flush();
  }
  let loadFirestore;
  async function start({ user, loadScript }) {
    uid = user.uid;
    loadFirestore = loadScript;
    // Reuse durable device slots after a tab closes, keeping the server's
    // idempotency ledger bounded by devices/tabs rather than page visits.
    const deviceId =
      storage.getItem("__oliveSyncDeviceV1") || crypto.randomUUID();
    storage.setItem("__oliveSyncDeviceV1", deviceId);
    let clientId = session.getItem("__oliveSyncClientV1") || deviceId + "-0";
    let owner = await reserve(clientId);
    for (let slot = 1; !owner.held && slot < 64; slot++) {
      clientId = deviceId + "-" + slot;
      owner = await reserve(clientId);
    }
    if (!owner.held) throw new Error("No free sync slot");
    session.setItem("__oliveSyncClientV1", clientId);
    releaseOwner = owner.release;
    engine = C.createSync({ storage, clientId, onChange: emit });
    if (navigator.onLine !== false) {
      const task = connect(loadScript);
      try {
        await deadline(task, 5000);
      } catch (_) {
        engine.fail("offline");
      }
    } else {
      engine.fail("offline");
    }
    engine.activate();
    window.addEventListener("online", reconnect);
    window.addEventListener("offline", () => engine.fail("offline"));
    window.addEventListener("pagehide", () => stop());
    retryTimer = setInterval(() => {
      if (
        !stopped &&
        navigator.onLine &&
        ["offline", "connecting"].includes(current.status)
      )
        reconnect();
    }, 30000);
  }
  async function reconnect() {
    if (stopped || !navigator.onLine) return;
    await connect(loadFirestore);
    await flush();
  }
  function stop() {
    stopped = true;
    clearTimeout(timer);
    clearInterval(retryTimer);
    unsubscribe?.();
    engine?.stop();
    releaseOwner?.();
    window.removeEventListener("online", reconnect);
  }
  async function refresh() {
    if (stopped || !engine) return false;
    await connect(loadFirestore);
    const saved = await deadline(flush(), 6000).catch(() => false);
    if (
      saved &&
      current.remoteChanged &&
      !["setup", "offline", "too-large"].includes(current.status)
    )
      location.reload();
    return saved;
  }
  window.OliveSync = {
    start,
    stop,
    flush,
    refresh,
    state: () => ({ ...current }),
    subscribe(listener) {
      listeners.add(listener);
      listener(current);
      return () => listeners.delete(listener);
    },
  };
})();
