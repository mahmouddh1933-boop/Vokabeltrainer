"use strict";
// Recovery command for the project owner; never called by the browser.
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const P = require("../lib/policy");
(async () => {
  const email = P.email(process.argv[2]),
    projectId = process.argv[3];
  if (!projectId)
    throw Error(
      "Usage: node tools/reset-admin-devices.js ADMIN_EMAIL PROJECT_ID",
    );
  initializeApp({
    projectId,
    ...(process.env.FIREBASE_AUTH_EMULATOR_HOST
      ? {}
      : { credential: applicationDefault() }),
  });
  const user = await getAuth().getUserByEmail(email);
  const db = getFirestore(),
    invitation = await db
      .collection("oliveAllowedEmails")
      .doc(P.emailKey(email))
      .get();
  if (
    invitation.data()?.role !== "admin" ||
    invitation.data()?.uid !== user.uid
  )
    throw Error("This is not a configured administrator account.");
  const ref = db.collection("oliveAccessUsers").doc(user.uid);
  await db.runTransaction(async (tx) => {
    const profile = await tx.get(ref);
    if (!profile.exists) return;
    const docs = await Promise.all(
      Object.keys(profile.data().devices || {}).map((id) =>
        tx.get(ref.collection("devices").doc(id)),
      ),
    );
    tx.update(ref, { devices: {}, updatedAt: new Date() });
    for (const d of docs)
      if (d.exists)
        tx.update(d.ref, {
          active: false,
          status: "released",
          revokedAt: new Date(),
        });
  });
  await getAuth().revokeRefreshTokens(user.uid);
  console.log(
    "Administrator device slots released. Sign in again. Learning records were preserved.",
  );
})().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
