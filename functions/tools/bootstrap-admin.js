"use strict";
// Run as project owner with Application Default Credentials. No private key file is shipped.
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const P = require("../lib/policy");
(async () => {
  const email = P.email(process.argv[2]),
    projectId = process.argv[3];
  if (!projectId)
    throw Error("Usage: npm run bootstrap-admin -- ADMIN_EMAIL PROJECT_ID");
  initializeApp({
    projectId,
    ...(process.env.FIREBASE_AUTH_EMULATOR_HOST
      ? {}
      : { credential: applicationDefault() }),
  });
  const auth = getAuth(),
    db = getFirestore();
  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch (e) {
    if (e.code !== "auth/user-not-found") throw e;
  }
  // Seed invitation before creating the first account; the owner then verifies their email normally.
  await db
    .collection("oliveAllowedEmails")
    .doc(P.emailKey(email))
    .set(
      {
        email,
        enabled: true,
        role: "admin",
        ...(user ? { uid: user.uid } : {}),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true },
    );
  if (user) {
    await auth.setCustomUserClaims(user.uid, {
      ...(user.customClaims || {}),
      oliveAdmin: true,
    });
    console.log(
      "Administrator initialized. Sign out, sign in, and verify your email if required.",
    );
  } else
    console.log(
      "Administrator email invited. Create and verify this account on the site, then run this command again to grant the admin claim.",
    );
})().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
