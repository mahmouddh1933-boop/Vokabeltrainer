"use strict";
const crypto = require("node:crypto");
const MAX_DEVICES = 2,
  LEASE_MS = 24 * 60 * 60 * 1000,
  CHALLENGE_MS = 2 * 60 * 1000;
class AccessError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
const fail = (code, message) => {
  throw new AccessError(code, message);
};
function email(value) {
  const s = String(value || "")
    .trim()
    .toLowerCase();
  if (s.length > 254 || !/^\S+@[^\s@]+\.[^\s@]+$/.test(s))
    fail("invalid-argument", "INVALID_EMAIL");
  return s;
}
function emailKey(value) {
  return crypto.createHash("sha256").update(email(value)).digest("hex");
}
function publicKey(value) {
  if (
    !value ||
    value.kty !== "EC" ||
    value.crv !== "P-256" ||
    typeof value.x !== "string" ||
    typeof value.y !== "string" ||
    !/^[-\w]{43}$/.test(value.x) ||
    !/^[-\w]{43}$/.test(value.y) ||
    value.d
  )
    fail("invalid-argument", "INVALID_DEVICE_KEY");
  const key = { kty: "EC", crv: "P-256", x: value.x, y: value.y };
  try {
    crypto.createPublicKey({ key, format: "jwk" });
  } catch (_) {
    fail("invalid-argument", "INVALID_DEVICE_KEY");
  }
  return key;
}
function deviceId(key) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(publicKey(key)))
    .digest("hex");
}
function message(uid, id, nonce, device) {
  return ["olive-device-v1", uid, id, nonce, device].join("|");
}
function proof(key, payload, signature) {
  try {
    const bytes = Buffer.from(signature || "", "base64url");
    return (
      bytes.length === 64 &&
      crypto.verify(
        "sha256",
        Buffer.from(payload),
        {
          key: crypto.createPublicKey({ key: publicKey(key), format: "jwk" }),
          dsaEncoding: "ieee-p1363",
        },
        bytes,
      )
    );
  } catch (_) {
    return false;
  }
}
function verified(auth) {
  if (!auth?.uid) fail("unauthenticated", "SIGN_IN_REQUIRED");
  if (auth.token?.email_verified !== true)
    fail("failed-precondition", "VERIFY_EMAIL");
  return email(auth.token.email);
}
function allowed(entry, uid) {
  if (!entry || entry.enabled !== true)
    fail("permission-denied", "EMAIL_NOT_ALLOWED");
  if (entry.uid && entry.uid !== uid)
    fail("permission-denied", "EMAIL_ACCOUNT_MISMATCH");
}
function activeSession(profile, device, auth, now) {
  if (
    !profile?.enabled ||
    !device?.active ||
    device.status === "revoked" ||
    auth.token?.oliveDevice !== device.id ||
    auth.token?.oliveSession !== device.sessionId ||
    profile.devices?.[device.id] !== device.sessionId
  )
    fail("permission-denied", "DEVICE_REVOKED");
  if (Number(device.expiresAtMs || 0) <= now)
    fail("permission-denied", "SESSION_EXPIRED");
}
function nextDevices(profile, id, session) {
  const devices = { ...(profile?.devices || {}) };
  if (!Object.hasOwn(devices, id) && Object.keys(devices).length >= MAX_DEVICES)
    fail("resource-exhausted", "DEVICE_LIMIT");
  devices[id] = session;
  return devices;
}
function label(value, max = 120) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}
module.exports = {
  MAX_DEVICES,
  LEASE_MS,
  CHALLENGE_MS,
  AccessError,
  fail,
  email,
  emailKey,
  publicKey,
  deviceId,
  message,
  proof,
  verified,
  allowed,
  activeSession,
  nextDevices,
  label,
};
