"use strict";
const crypto = require("node:crypto");
const P = require("./policy");
function createService({
  db,
  auth,
  now = () => Date.now(),
  adminEmail = () => "",
}) {
  const allowRef = (e) =>
    db.collection("oliveAllowedEmails").doc(P.emailKey(e));
  const userRef = (uid) => db.collection("oliveAccessUsers").doc(uid);
  const deviceRef = (uid, id) => userRef(uid).collection("devices").doc(id);
  const challengeRef = (id) => db.collection("oliveAccessChallenges").doc(id);
  const auditRef = () => db.collection("oliveAccessAudit").doc();
  const stamp = () => new Date(now());
  function tokenDevice(a) {
    const id = a?.token?.oliveDevice;
    if (!/^[a-f0-9]{64}$/.test(id || ""))
      P.fail("permission-denied", "REGISTER_DEVICE");
    return id;
  }
  async function eligibility(a) {
    const e = P.verified(a);
    let snap = await allowRef(e).get();
    if (
      e ===
        String(adminEmail() || "")
          .trim()
          .toLowerCase() &&
      (!snap.exists || snap.data().role !== "admin")
    ) {
      await db.runTransaction(async (tx) => {
        const current = await tx.get(allowRef(e));
        if (current.data()?.uid && current.data().uid !== a.uid)
          P.fail("permission-denied", "EMAIL_ACCOUNT_MISMATCH");
        tx.set(
          allowRef(e),
          {
            email: e,
            uid: a.uid,
            enabled: true,
            role: "admin",
            createdAt: current.data()?.createdAt || stamp(),
            updatedAt: stamp(),
          },
          { merge: true },
        );
      });
      snap = await allowRef(e).get();
    }
    P.allowed(snap.data(), a.uid);
    return { email: e, entry: snap.data() };
  }
  async function session(a, admin = false) {
    const { email, entry } = await eligibility(a),
      id = tokenDevice(a),
      [profile, device] = await Promise.all([
        userRef(a.uid).get(),
        deviceRef(a.uid, id).get(),
      ]);
    P.activeSession(profile.data(), device.data(), a, now());
    if (admin && (a.token.oliveAdmin !== true || entry.role !== "admin"))
      P.fail("permission-denied", "ADMIN_ONLY");
    return { email, entry, profile: profile.data(), device: device.data() };
  }
  async function registrationAllowed(value) {
    const e = P.email(value);
    if (
      e ===
      String(adminEmail() || "")
        .trim()
        .toLowerCase()
    )
      return true;
    const snap = await allowRef(e).get();
    if (!snap.exists || snap.data().enabled !== true)
      P.fail("permission-denied", "EMAIL_NOT_ALLOWED");
    return true;
  }
  async function challenge(a, data) {
    await eligibility(a);
    if (!["begin", "heartbeat"].includes(data.purpose))
      P.fail("invalid-argument", "INVALID_PURPOSE");
    const doc = challengeRef(crypto.randomBytes(24).toString("hex")),
      nonce = crypto.randomBytes(32).toString("base64url");
    await doc.set({
      uid: a.uid,
      purpose: data.purpose,
      nonce,
      expiresAtMs: now() + P.CHALLENGE_MS,
      expiresAt: new Date(now() + P.CHALLENGE_MS),
    });
    return { id: doc.id, nonce };
  }
  async function begin(a, data) {
    const { email: e } = await eligibility(a),
      jwk = P.publicKey(data.publicKey),
      id = P.deviceId(jwk);
    if (data.deviceId !== id || !/^[a-f0-9]{48}$/.test(data.challengeId || ""))
      P.fail("invalid-argument", "INVALID_DEVICE");
    const result = await db.runTransaction(async (tx) => {
      const [allow, profile, device, c] = await Promise.all([
        tx.get(allowRef(e)),
        tx.get(userRef(a.uid)),
        tx.get(deviceRef(a.uid, id)),
        tx.get(challengeRef(data.challengeId)),
      ]);
      P.allowed(allow.data(), a.uid);
      const ch = c.data();
      if (
        !ch ||
        ch.uid !== a.uid ||
        ch.purpose !== "begin" ||
        ch.expiresAtMs <= now()
      )
        P.fail("failed-precondition", "CHALLENGE_EXPIRED");
      if (!P.proof(jwk, P.message(a.uid, c.id, ch.nonce, id), data.signature))
        P.fail("permission-denied", "INVALID_PROOF");
      const old = device.data();
      if (old?.status === "revoked")
        P.fail("permission-denied", "DEVICE_REVOKED");
      const sessionId =
        old?.active && profile.data()?.devices?.[id] === old.sessionId
          ? old.sessionId
          : crypto.randomBytes(32).toString("hex");
      const devices = P.nextDevices(profile.data(), id, sessionId),
        expiresAtMs = now() + P.LEASE_MS;
      tx.set(
        userRef(a.uid),
        {
          email: e,
          emailKey: P.emailKey(e),
          enabled: true,
          devices,
          lastSeenAt: stamp(),
          updatedAt: stamp(),
        },
        { merge: true },
      );
      tx.set(allowRef(e), { uid: a.uid, lastSeenAt: stamp() }, { merge: true });
      tx.set(
        deviceRef(a.uid, id),
        {
          id,
          publicKey: jwk,
          sessionId,
          active: true,
          status: "active",
          label: P.label(data.label) || "متصفح",
          agent: P.label(data.agent, 240),
          createdAt: old?.createdAt || stamp(),
          lastSeenAt: stamp(),
          expiresAtMs,
        },
        { merge: true },
      );
      tx.delete(c.ref);
      return {
        id,
        sessionId,
        expiresAtMs,
        isAdmin: allow.data().role === "admin",
      };
    });
    // Callable clients cannot choose these claims. Ordinary email/password tokens lack them.
    const customToken = await auth.createCustomToken(a.uid, {
      oliveDevice: result.id,
      oliveSession: result.sessionId,
      oliveAdmin: result.isAdmin,
    });
    return {
      customToken,
      deviceId: result.id,
      sessionId: result.sessionId,
      leaseExpiresAt: result.expiresAtMs,
      isAdmin: result.isAdmin,
    };
  }
  async function heartbeat(a, data) {
    const e = P.verified(a),
      id = tokenDevice(a);
    if (!/^[a-f0-9]{48}$/.test(data.challengeId || ""))
      P.fail("invalid-argument", "INVALID_CHALLENGE");
    return db.runTransaction(async (tx) => {
      const [allow, profile, device, c] = await Promise.all([
        tx.get(allowRef(e)),
        tx.get(userRef(a.uid)),
        tx.get(deviceRef(a.uid, id)),
        tx.get(challengeRef(data.challengeId)),
      ]);
      P.allowed(allow.data(), a.uid);
      P.activeSession(profile.data(), device.data(), a, now());
      const ch = c.data();
      if (
        !ch ||
        ch.uid !== a.uid ||
        ch.purpose !== "heartbeat" ||
        ch.expiresAtMs <= now()
      )
        P.fail("failed-precondition", "CHALLENGE_EXPIRED");
      if (
        !P.proof(
          device.data().publicKey,
          P.message(a.uid, c.id, ch.nonce, id),
          data.signature,
        )
      )
        P.fail("permission-denied", "INVALID_PROOF");
      const leaseExpiresAt = now() + P.LEASE_MS;
      tx.update(device.ref, {
        lastSeenAt: stamp(),
        expiresAtMs: leaseExpiresAt,
      });
      tx.update(profile.ref, { lastSeenAt: stamp() });
      tx.delete(c.ref);
      return {
        deviceId: id,
        sessionId: device.data().sessionId,
        leaseExpiresAt,
        isAdmin: allow.data().role === "admin",
      };
    });
  }
  async function adminList(a, data = {}) {
    await session(a, true);
    const count = Math.min(50, Math.max(1, Number(data.limit) || 30));
    let query = db
      .collection("oliveAllowedEmails")
      .orderBy("email")
      .limit(count + 1);
    if (data.query) {
      const q = P.label(data.query, 254).toLowerCase();
      query = query.where("email", ">=", q).where("email", "<=", q + "\uf8ff");
    }
    if (data.after) query = query.startAfter(P.email(data.after));
    const snap = await query.get(),
      docs = snap.docs.slice(0, count);
    const rows = await Promise.all(
      docs.map(async (d) => {
        const row = d.data(),
          profile = row.uid ? (await userRef(row.uid).get()).data() : null;
        return {
          email: row.email,
          enabled: row.enabled,
          role: row.role,
          uid: row.uid || null,
          registeredDevices: Object.keys(profile?.devices || {}).length,
          lastSeenAt: ms(profile?.lastSeenAt),
          createdAt: ms(row.createdAt),
        };
      }),
    );
    return {
      rows,
      next: snap.docs.length > count ? rows.at(-1).email : null,
      maxDevices: P.MAX_DEVICES,
    };
  }
  async function adminSet(a, data) {
    const actor = await session(a, true),
      e = P.email(data.email);
    if (typeof data.enabled !== "boolean")
      P.fail("invalid-argument", "INVALID_STATUS");
    await db.runTransaction(async (tx) => {
      const doc = await tx.get(allowRef(e)),
        old = doc.data();
      if (old?.role === "admin")
        P.fail("failed-precondition", "PROTECTED_ADMIN");
      const profile = old?.uid ? await tx.get(userRef(old.uid)) : null;
      const ids = Object.keys(profile?.data()?.devices || {}),
        deviceDocs = await Promise.all(
          ids.map((id) => tx.get(deviceRef(old.uid, id))),
        );
      tx.set(
        allowRef(e),
        {
          email: e,
          enabled: data.enabled,
          role: "student",
          createdAt: old?.createdAt || stamp(),
          updatedAt: stamp(),
          updatedBy: a.uid,
        },
        { merge: true },
      );
      if (profile?.exists && old?.enabled !== data.enabled) {
        tx.update(profile.ref, {
          enabled: data.enabled,
          devices: {},
          updatedAt: stamp(),
        });
        for (const d of deviceDocs)
          if (d.exists)
            tx.update(d.ref, {
              active: false,
              status: "released",
              revokedAt: stamp(),
            });
      }
      tx.set(auditRef(), {
        actor: a.uid,
        action: data.enabled ? "allow-email" : "disable-email",
        email: e,
        at: stamp(),
      });
    });
    return { email: e, enabled: data.enabled };
  }
  async function adminDevices(a, data) {
    await session(a, true);
    if (typeof data.uid !== "string" || data.uid.length > 128)
      P.fail("invalid-argument", "INVALID_USER");
    const profile = await userRef(data.uid).get();
    if (!profile.exists) return { devices: [] };
    const list = await userRef(data.uid)
      .collection("devices")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
    const map = new Map(list.docs.map((d) => [d.id, d.data()]));
    for (const id of Object.keys(profile.data().devices || {}))
      if (!map.has(id)) {
        const d = await deviceRef(data.uid, id).get();
        if (d.exists) map.set(id, d.data());
      }
    return {
      devices: [...map.values()]
        .map((d) => ({
          id: d.id,
          label: d.label,
          agent: d.agent,
          active: d.active === true,
          status: d.status,
          createdAt: ms(d.createdAt),
          lastSeenAt: ms(d.lastSeenAt),
          recent: d.active && now() - ms(d.lastSeenAt) < 5 * 60 * 1000,
        }))
        .sort(
          (a, b) =>
            Number(b.active) - Number(a.active) || b.lastSeenAt - a.lastSeenAt,
        ),
    };
  }
  async function adminDevice(a, data) {
    await session(a, true);
    if (
      typeof data.uid !== "string" ||
      data.uid.length > 128 ||
      !/^[a-f0-9]{64}$/.test(data.deviceId || "") ||
      !["revoke", "release"].includes(data.action)
    )
      P.fail("invalid-argument", "INVALID_DEVICE");
    if (data.uid === a.uid && data.deviceId === a.token.oliveDevice)
      P.fail("failed-precondition", "CURRENT_ADMIN_DEVICE");
    await db.runTransaction(async (tx) => {
      const profile = await tx.get(userRef(data.uid)),
        device = await tx.get(deviceRef(data.uid, data.deviceId));
      if (!device.exists) P.fail("not-found", "DEVICE_NOT_FOUND");
      const devices = { ...(profile.data()?.devices || {}) };
      delete devices[data.deviceId];
      tx.update(profile.ref, { devices, updatedAt: stamp() });
      tx.update(device.ref, {
        active: false,
        status: data.action === "revoke" ? "revoked" : "released",
        revokedAt: stamp(),
      });
      tx.set(auditRef(), {
        actor: a.uid,
        action: data.action + "-device",
        uid: data.uid,
        deviceId: data.deviceId,
        at: stamp(),
      });
    });
    return { ok: true };
  }
  return {
    registrationAllowed,
    challenge,
    begin,
    heartbeat,
    adminList,
    adminSet,
    adminDevices,
    adminDevice,
    session,
  };
}
function ms(value) {
  return typeof value?.toMillis === "function"
    ? value.toMillis()
    : value instanceof Date
      ? value.getTime()
      : Number(value || 0);
}
module.exports = { createService };
