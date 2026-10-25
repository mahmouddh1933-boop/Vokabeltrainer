"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const {
  beforeUserCreated,
  beforeUserSignedIn,
} = require("firebase-functions/v2/identity");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineString } = require("firebase-functions/params");
const ownerEmail = defineString("OLIVE_ADMIN_EMAIL", {
  description:
    "The verified email address of the application owner (required).",
});
const { createService } = require("./lib/service");
const P = require("./lib/policy");
const logger = require("firebase-functions/logger");
initializeApp();
setGlobalOptions({
  region: "europe-west1",
  maxInstances: 2,
  memory: "256MiB",
  timeoutSeconds: 30,
});
const service = createService({
  db: getFirestore(),
  auth: getAuth(),
  adminEmail: () => ownerEmail.value(),
});
function error(e) {
  if (e instanceof P.AccessError) return new HttpsError(e.code, e.message);
  logger.error("Access service failure", {code:String(e?.code||"unknown"),type:String(e?.name||"Error")});
  return new HttpsError("unavailable", "ACCESS_SERVICE_UNAVAILABLE");
}
function callable(method) {
  return onCall({ cors: true }, async (request) => {
    try {
      return await service[method](request.auth, request.data || {});
    } catch (e) {
      throw error(e);
    }
  });
}
exports.accessChallenge = callable("challenge");
exports.accessBegin = callable("begin");
exports.accessHeartbeat = callable("heartbeat");
exports.adminListMembers = callable("adminList");
exports.adminSetEmail = callable("adminSet");
exports.adminListDevices = callable("adminDevices");
exports.adminChangeDevice = callable("adminDevice");
async function check(event) {
  try {
    await service.registrationAllowed(event.data.email);
  } catch (e) {
    throw error(e);
  }
}
exports.approvedEmailBeforeCreate = beforeUserCreated(check);
exports.approvedEmailBeforeSignIn = beforeUserSignedIn(check);
