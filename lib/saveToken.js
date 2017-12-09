const { promisify } = require("util");
const ini = require("ini");
const writeFile = promisify(require("fs").writeFile);
const authFile = require("./authFile");

module.exports = async function(user, token) {
  const d = {
    gist: { user, token }
  };

  return await writeFile(authFile, ini.stringify(d));
};
