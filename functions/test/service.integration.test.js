"use strict";
// RUN_ACCESS_INTEGRATION=1 uses a disposable Firestore protocol emulator, never production.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { initializeApp, deleteApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { createService } = require("../lib/service");
const P = require("../lib/policy");
test(
  "Access transactions: racing devices, replay, revocation, administrator checks and invitation lifecycle",
  { skip: process.env.RUN_ACCESS_INTEGRATION !== "1" },
  async () => {
    assert.equal(process.env.FIRESTORE_EMULATOR_HOST, "127.0.0.1:8080");
    const app = initializeApp(
        { projectId: "olive-access-test" },
        "access-" + Date.now(),
      ),
      db = getFirestore(app);
    const prefix = crypto.randomBytes(8).toString("hex");
    let clock = Date.now();
    const ownerEmail = prefix + "-owner@example.test";
    const service = createService({
      db,
      auth: {
        createCustomToken: async (uid, claims) =>
          JSON.stringify({ uid, claims }),
      },
      now: () => clock,
      adminEmail: () => ownerEmail,
    });
    const actor = (uid, email, claims = {}) => ({
      uid,
      token: { email, email_verified: true, ...claims },
    });
    const owner = actor(prefix + "-owner", ownerEmail),
      student = actor(prefix + "-student", prefix + "-student@example.test");
    function key() {
      const pair = crypto.generateKeyPairSync("ec", {
        namedCurve: "prime256v1",
      });
      return { ...pair, publicKey: pair.publicKey.export({ format: "jwk" }) };
    }
    async function signed(a, purpose, k) {
      const c = await service.challenge(a, { purpose });
      return {
        deviceId: P.deviceId(k.publicKey),
        publicKey: k.publicKey,
        challengeId: c.id,
        signature: crypto
          .sign(
            "sha256",
            Buffer.from(
              P.message(a.uid, c.id, c.nonce, P.deviceId(k.publicKey)),
            ),
            { key: k.privateKey, dsaEncoding: "ieee-p1363" },
          )
          .toString("base64url"),
      };
    }
    async function begin(a, k) {
      const result = await service.begin(a, await signed(a, "begin", k));
      return {
        result,
        auth: actor(
          a.uid,
          a.token.email,
          JSON.parse(result.customToken).claims,
        ),
      };
    }
    await service.registrationAllowed(ownerEmail);
    await assert.rejects(
      () =>
        service.challenge(
          { ...owner, token: { ...owner.token, email_verified: false } },
          { purpose: "begin" },
        ),
      { message: "VERIFY_EMAIL" },
    );
    const ok = key(),
      admin = await begin(owner, ok);
    assert.equal(
      admin.result.isAdmin,
      true,
      "Only configured, verified owner is auto-bootstrapped",
    );
    await assert.rejects(() => service.adminList(student), {
      message: "EMAIL_NOT_ALLOWED",
    });
    await service.adminSet(admin.auth, {
      email: student.token.email,
      enabled: true,
    });
    const keys = [key(), key(), key()],
      proofs = await Promise.all(keys.map((k) => signed(student, "begin", k)));
    const results = await Promise.allSettled(
      proofs.map((proof) => service.begin(student, proof)),
    );
    assert.equal(results.filter((x) => x.status === "fulfilled").length, 2);
    assert.equal(
      results.find((x) => x.status === "rejected").reason.message,
      "DEVICE_LIMIT",
    );
    const firstIndex = results.findIndex((x) => x.status === "fulfilled"),
      firstResult = results[firstIndex].value,
      firstActor = actor(
        student.uid,
        student.token.email,
        JSON.parse(firstResult.customToken).claims,
      ),
      firstKey = keys[firstIndex];
    assert.equal(firstResult.isAdmin, false);
    await assert.rejects(() => service.adminList(firstActor), {
      message: "ADMIN_ONLY",
    });
    await assert.rejects(() => service.begin(student, proofs[firstIndex]), {
      message: "CHALLENGE_EXPIRED",
    });
    const repeat = await begin(student, firstKey);
    assert.equal(
      repeat.result.sessionId,
      firstResult.sessionId,
      "Same installation does not consume a new slot or invalidate another tab",
    );
    await service.adminSet(admin.auth, {
      email: student.token.email,
      enabled: true,
    });
    assert.equal(
      (
        await service.adminDevices(admin.auth, { uid: student.uid })
      ).devices.filter((d) => d.active).length,
      2,
      "Re-adding an allowed email is idempotent",
    );
    const heartbeat = await signed(firstActor, "heartbeat", firstKey);
    await service.heartbeat(firstActor, heartbeat);
    await assert.rejects(() => service.heartbeat(firstActor, heartbeat), {
      message: "CHALLENGE_EXPIRED",
    });
    await assert.rejects(
      () => service.adminSet(admin.auth, { email: ownerEmail, enabled: false }),
      { message: "PROTECTED_ADMIN" },
    );
    await assert.rejects(
      () =>
        service.adminDevice(admin.auth, {
          uid: owner.uid,
          deviceId: admin.result.deviceId,
          action: "revoke",
        }),
      { message: "CURRENT_ADMIN_DEVICE" },
    );
    await service.adminDevice(admin.auth, {
      uid: student.uid,
      deviceId: firstResult.deviceId,
      action: "revoke",
    });
    await assert.rejects(() => service.session(firstActor), {
      message: "DEVICE_REVOKED",
    });
    await assert.rejects(() => begin(student, firstKey), {
      message: "DEVICE_REVOKED",
    });
    await service.adminDevice(admin.auth, {
      uid: student.uid,
      deviceId: firstResult.deviceId,
      action: "release",
    });
    const resumed = await begin(student, firstKey);
    assert.notEqual(resumed.result.sessionId, firstResult.sessionId);
    await assert.rejects(() => service.session(firstActor), {
      message: "DEVICE_REVOKED",
    });
    await service.adminSet(admin.auth, {
      email: student.token.email,
      enabled: false,
    });
    await assert.rejects(
      () => service.registrationAllowed(student.token.email),
      { message: "EMAIL_NOT_ALLOWED" },
    );
    await assert.rejects(() => service.session(resumed.auth), {
      message: "EMAIL_NOT_ALLOWED",
    });
    await service.adminSet(admin.auth, {
      email: student.token.email,
      enabled: true,
    });
    const again = await begin(student, firstKey);
    const list = await service.adminList(admin.auth, {
      query: prefix + "-student",
    });
    assert.equal(list.rows.length, 1);
    assert.equal(list.rows[0].registeredDevices, 1);
    clock += P.LEASE_MS + 1;
    await assert.rejects(() => service.session(again.auth), {
      message: "SESSION_EXPIRED",
    });
    await db.terminate();
    await deleteApp(app);
  },
);
