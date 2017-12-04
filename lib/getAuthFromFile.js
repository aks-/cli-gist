const { promisify, debuglog } = require("util");
const debug = debuglog("cli-gist");
const readFile = promisify(require("fs").readFile);
const ini = require("ini");
const authFile = require("./authFile");

module.exports = async function() {
  debug("try to get creds from auth file");
  const file = await readFile(authFile, "utf8");
  const data = await ini.parse(file);

  if (!data.gist || !data.gist.user || !data.gist.token) {
    throw new Error(`no login data in ${authFile}`);
  }
  return data.gist;
};
