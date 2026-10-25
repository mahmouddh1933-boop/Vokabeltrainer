"use strict";
const fs = require("node:fs"),
  path = require("node:path"),
  P = require("../lib/policy");
try {
  const email = P.email(process.argv[2]),
    project = String(process.argv[3] || "");
  if (!/^[a-z][a-z0-9-]{4,50}$/.test(project))
    throw Error(
      "Usage: node functions/tools/configure-admin.js ADMIN_EMAIL PROJECT_ID",
    );
  const target = path.resolve(__dirname, "..", ".env." + project);
  let text = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  const line = "OLIVE_ADMIN_EMAIL=" + email;
  if (/^OLIVE_ADMIN_EMAIL=.*$/m.test(text))
    text = text.replace(/^OLIVE_ADMIN_EMAIL=.*$/m, line);
  else text = text.trimEnd() + "\n" + line + "\n";
  fs.writeFileSync(target, text.trimStart(), { mode: 0o600 });
  console.log(
    "Private administrator configuration written. Deploy functions, Firestore and hosting next. Do not publish this .env file.",
  );
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
