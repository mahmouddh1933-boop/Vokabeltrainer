const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require("@firebase/rules-unit-testing");
const { doc, setDoc, getDoc, serverTimestamp } = require("firebase/firestore");
test(
  "Official Firestore Rules: allowed device claims, atomic count, revocation and forbidden administration",
  { skip: process.env.RUN_OFFICIAL_ACCESS_RULES !== "1" },
  async () => {
    const env = await initializeTestEnvironment({
      projectId: "demo-huroof-access",
      firestore: {
        host: "127.0.0.1",
        port: 8080,
        rules: fs.readFileSync(
          path.join(__dirname, "../../firestore.rules"),
          "utf8",
        ),
      },
    });
    const uid = "student-one",
      device = "a".repeat(64),
      email = "student@example.test",
      key = require("../lib/policy").emailKey(email),
      session = "session-secret";
    async function seed({
      enabled = true,
      active = true,
      expiresAtMs = Date.now() + 86400000,
      devices = { [device]: session },
    } = {}) {
      await env.withSecurityRulesDisabled(async (ctx) => {
        const db = ctx.firestore();
        await setDoc(doc(db, "oliveAllowedEmails", key), {
          email,
          uid,
          enabled,
          role: "student",
        });
        await setDoc(doc(db, "oliveAccessUsers", uid), {
          email,
          emailKey: key,
          enabled,
          devices,
        });
        await setDoc(doc(db, "oliveAccessUsers", uid, "devices", device), {
          id: device,
          active,
          status: active ? "active" : "revoked",
          sessionId: session,
          expiresAtMs,
        });
      });
    }
    const token = {
      email,
      email_verified: true,
      oliveDevice: device,
      oliveSession: session,
    };
    try {
      await seed();
      const db = env.authenticatedContext(uid, token).firestore(),
        target = doc(db, "users", uid, "learning", "learningStats");
      await assertSucceeds(
        setDoc(target, {
          schema: 1,
          revision: 1,
          value: '{"totalTests":1}',
          applied: {},
          updatedAt: serverTimestamp(),
        }),
      );
      await assertSucceeds(getDoc(target));
      for (const claims of [
        { email, email_verified: true },
        { ...token, oliveSession: "copied-id-only" },
        { ...token, email_verified: false },
        { ...token, email: "different@example.test" },
      ])
        await assertFails(
          getDoc(
            doc(
              env.authenticatedContext(uid, claims).firestore(),
              "users",
              uid,
              "learning",
              "learningStats",
            ),
          ),
        );
      await assertFails(
        getDoc(
          doc(
            env.authenticatedContext("other", token).firestore(),
            "users",
            uid,
            "learning",
            "learningStats",
          ),
        ),
      );
      await assertFails(
        setDoc(doc(db, "oliveAccessUsers", uid), {
          devices: { third: "self-approved" },
        }),
      );
      await assertFails(getDoc(doc(db, "oliveAllowedEmails", key)));
      await assertFails(
        setDoc(doc(db, "oliveAllowedEmails", "new"), {
          enabled: true,
          role: "admin",
        }),
      );
      await seed({ active: false });
      await assertFails(getDoc(target));
      await seed({ enabled: false });
      await assertFails(getDoc(target));
      await seed({ expiresAtMs: 1 });
      await assertFails(getDoc(target));
      await seed({ devices: { [device]: session, second: "s2", third: "s3" } });
      await assertFails(getDoc(target));
    } finally {
      await env.cleanup();
    }
  },
);
