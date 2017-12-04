const { promisify, debuglog } = require("util");
const debug = debuglog("cli-gist");
const execFile = promisify(require("child_process").execFile);

module.exports = async function getConfFromGit(key) {
  debug("getConfFromGit", "git", ["config", "--get", key].join(" "));

  var env = { env: process.env };

  const { stdout, stderr } = await execFile(
    "git",
    ["config", "--get", key],
    env
  );

  return stdout;
};
