"use strict";
// Disposable test users only. Refuse to run against any production endpoint.
if (
  process.env.FIREBASE_AUTH_EMULATOR_HOST !== "127.0.0.1:9099" ||
  process.env.FIRESTORE_EMULATOR_HOST !== "127.0.0.1:8080"
)
  throw Error("Local Auth and Firestore emulator endpoints are required.");
const { initializeApp } = require("firebase-admin/app"),
  { getAuth } = require("firebase-admin/auth"),
  { getFirestore } = require("firebase-admin/firestore"),
  P = require("../lib/policy");
(async () => {
  initializeApp({ projectId: "letters-from-olive" });
  const db = getFirestore(),
    auth = getAuth(),
    id =
      Date.now() + "-" + require("node:crypto").randomBytes(3).toString("hex"),
    output = {};
  for (const role of ["admin", "student", "studentB"]) {
    const email = `olive-${role.toLowerCase()}-${id}@example.test`;
    await db
      .collection("oliveAllowedEmails")
      .doc(P.emailKey(email))
      .set({
        email,
        enabled: true,
        role: role === "admin" ? "admin" : "student",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    const user = await auth.createUser({
      email,
      password: "Olive-Admin-Test-123!",
      emailVerified: true,
    });
    await db
      .collection("oliveAllowedEmails")
      .doc(P.emailKey(email))
      .update({ uid: user.uid });
    if (role === "admin")
      await auth.setCustomUserClaims(user.uid, { oliveAdmin: true });
    output[role] = { email, uid: user.uid };
  }
  output.unverifiedEmail = `olive-verify-${id}@example.test`;
  await db
    .collection("oliveAllowedEmails")
    .doc(P.emailKey(output.unverifiedEmail))
    .set({
      email: output.unverifiedEmail,
      enabled: true,
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  console.log(JSON.stringify(output));
})().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
