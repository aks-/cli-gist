const { debuglog } = require("util");
const debug = debuglog("cli-gist");
const tokenize = require("./tokenize");
const getAuthFromFile = require("./getAuthFromFile");
const getAuthFromGit = require("./getAuthFromGit");
const getPassFromCli = require("./getPassFromCli");
const getAuthFromCli = require("./getAuthFromCli");

module.exports = async function getAuth(user = null, pass = null) {
  if (user && pass) {
    debug("creds provided on arguments");
    return await tokenize(user, pass);
  }

  if (user && !pass) {
    debug("user on argv, password required");
    pass = (await getPassFromCli()).trim();
    return await tokenize(user, pass);
  }

  try {
    return await getAuthFromFile();
  } catch (er) {
    return await getAuthFromGit().catch(er => {
      return getAuthFromCli().then(auth => {
        const user = auth.user.trim();
        const pass = auth.pass.trim();
        return tokenize(user, pass);
      });
    });
  }
};
