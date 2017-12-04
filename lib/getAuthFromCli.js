const { debuglog } = require("util");
const debug = debuglog("cli-gist");
const getUserFromCli = require("./getUserFromCli");
const getPassFromCli = require("./getPassFromCli");

module.exports = async function() {
  const user = await getUserFromCli();
  const pass = await getPassFromCli();

  return {
    user,
    pass
  };
};
