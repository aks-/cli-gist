const { promisify } = require("util");
const prompt = require("prompt");
const promptGet = promisify(prompt.get);

module.exports = async function(type, hidden = false, promptOptions = null) {
  prompt.start(promptOptions);

  const o = getSchema(type, hidden);
  const result = await promptGet(o);

  return result[type];
};

const getSchema = (type, hidden) => {
  const o = {
    properties: {}
  };
  o.properties[type] = {
    description: `github.com ${type}`,
    required: true,
    hidden
  };

  return o;
};
