const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const P = require("../lib/policy");
test("Invitation normalization is case-insensitive but does not merge plus/dot aliases", () => {
  assert.equal(P.email("  Student@Example.COM "), "student@example.com");
  assert.equal(P.emailKey("A@Example.com"), P.emailKey("a@example.COM"));
  assert.notEqual(P.emailKey("a+x@example.com"), P.emailKey("a@example.com"));
  assert.throws(() => P.email("missing-at"), { code: "invalid-argument" });
});
test("Device proof binds the account, nonce and installation key and rejects changed/replayed payloads", () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
      namedCurve: "prime256v1",
    }),
    jwk = publicKey.export({ format: "jwk" }),
    id = P.deviceId(jwk),
    message = P.message("user-a", "challenge-a", "nonce-a", id);
  const signature = crypto
    .sign("sha256", Buffer.from(message), {
      key: privateKey,
      dsaEncoding: "ieee-p1363",
    })
    .toString("base64url");
  assert.ok(P.proof(jwk, message, signature));
  assert.ok(
    !P.proof(jwk, P.message("user-b", "challenge-a", "nonce-a", id), signature),
  );
  assert.ok(
    !P.proof(jwk, P.message("user-a", "challenge-a", "nonce-b", id), signature),
  );
  assert.throws(() => P.publicKey(privateKey.export({ format: "jwk" })), {
    code: "invalid-argument",
  });
  assert.throws(() => P.publicKey({ ...jwk, crv: "P-384" }), {
    code: "invalid-argument",
  });
});
test("Two existing slots can be resumed; a third distinct slot is refused", () => {
  const profile = { devices: { one: "session-one", two: "session-two" } };
  assert.deepEqual(
    P.nextDevices(profile, "one", "session-one"),
    profile.devices,
  );
  assert.throws(() => P.nextDevices(profile, "three", "session-three"), {
    code: "resource-exhausted",
  });
  assert.equal(P.MAX_DEVICES, 2);
});
test("Missing verification, disabled invitations, other-account invitations and revoked sessions fail closed", () => {
  assert.throws(
    () =>
      P.verified({
        uid: "a",
        token: { email: "a@example.test", email_verified: false },
      }),
    { code: "failed-precondition" },
  );
  assert.throws(() => P.allowed({ enabled: false }, "a"), {
    code: "permission-denied",
  });
  assert.throws(() => P.allowed({ enabled: true, uid: "other" }, "a"), {
    code: "permission-denied",
  });
  const token = { token: { oliveDevice: "one", oliveSession: "s" } },
    profile = { enabled: true, devices: { one: "s" } },
    device = {
      id: "one",
      active: true,
      status: "active",
      sessionId: "s",
      expiresAtMs: 200,
    };
  P.activeSession(profile, device, token, 100);
  for (const changed of [
    { ...device, active: false },
    { ...device, status: "revoked" },
    { ...device, sessionId: "copied" },
    { ...device, expiresAtMs: 99 },
  ])
    assert.throws(() => P.activeSession(profile, changed, token, 100), {
      code: "permission-denied",
    });
});
