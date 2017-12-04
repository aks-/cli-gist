const readFromPrompt = require("./readFromPrompt");

module.exports = function() {
  return readFromPrompt("password", true);
};
