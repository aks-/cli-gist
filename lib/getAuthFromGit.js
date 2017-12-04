const getConfFromGit = require("./getConfFromGit");

module.exports = async function() {
  const user = (await getConfFromGit("gist.user")).trim();
  const token = (await getConfFromGit("gist.token")).trim();

  return {
    user,
    token
  };
};
