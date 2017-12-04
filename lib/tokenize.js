const { promisify, debuglog } = require("util");
const debug = debuglog("cli-gist");
const fetch = require("node-fetch");
const ini = require("ini");
const writeFile = promisify(require("fs").writeFile);
const userAgent = require("./ua");
const authFile = require("./authFile");
const getOTP = require("./getOTP");

module.exports = async function tokenize(user, pass, otp = null) {
  const token = await getToken(user, pass, otp);

  saveToken(user, token);
  return {
    user,
    token
  };
};

const getToken = async (user, pass, otp) => {
  const fetchParameters = buildFetchParameters(user, pass, otp);
  const response = await fetch(
    "https://api.github.com/authorizations",
    fetchParameters
  );
  const json = await response.json();
  const status = parseInt(response.status);

  if (status >= 400) {
    return await handleFailure(user, pass, response);
  }

  debug("ok", status, json);

  return json.token;
};

const handleFailure = async (user, pass, response) => {
  const json = await response.json();
  const status = parseInt(response.status);

  const otpFromResponse = await response.headers.get("x-github-otp");

  debug("failed", status, json);

  if (
    status === 401 &&
    !otp &&
    otpFromResponse &&
    otpFromResponse.match(/^required; /)
  ) {
    const type = otpFromResponse.replace(/^required; /, "");

    const otpFromPrompt = await getOTP(user, pass, type);
    return await tokenize(user, pass, otpFromPrompt);
  }

  throw new Error(response.message || JSON.stringify(response));
};

const buildFetchParameters = (user, pass, otp = null) => {
  const body = JSON.stringify({
    scopes: ["gist"],
    note: "gist cli access"
  });

  const headers = {
    "content-type": "application/json",
    "content-length": body.length,
    "user-agent": userAgent,
    authorization: `Basic ${new Buffer(user + ":" + pass).toString("base64")}`
  };

  if (otp) {
    headers["X-GitHub-OTP"] = otp;
  }

  return {
    method: "POST",
    body,
    headers
  };
};

const saveToken = async (user, token) => {
  const d = {
    gist: { user, token }
  };

  return await writeFile(authFile, ini.stringify(d));
};
