const { spawnSync } = require("node:child_process");
const result = spawnSync(
  process.execPath,
  ["--test", ...["rules.test.js", "suite-rules.test.js"].map(name => require("node:path").join(__dirname, name))],
  { stdio: "inherit", env: { ...process.env, RUN_OFFICIAL_ACCESS_RULES: "1" } },
);
process.exitCode = result.status ?? 1;
