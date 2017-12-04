const { promisify, debuglog } = require("util");
const debug = debuglog("cli-gist");
const readFromPrompt = require("./readFromPrompt");

module.exports = async function(type) {
  debug("read otp from argv");
  return await readFromPrompt(type, true);
};
