const readFromPrompt = require("./readFromPrompt");

module.exports = function() {
  return readFromPrompt("username", true);
};
