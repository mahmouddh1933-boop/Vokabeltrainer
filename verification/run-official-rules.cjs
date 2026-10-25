const { spawnSync } = require("node:child_process");
const result = spawnSync(
  process.execPath,
  ["--test", require("node:path").join(__dirname, "rules.test.js")],
  { stdio: "inherit", env: { ...process.env, RUN_OFFICIAL_ACCESS_RULES: "1" } },
);
process.exitCode = result.status ?? 1;
