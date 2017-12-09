const { test } = require("tap");
const nock = require("nock");
const proxyquire = require("proxyquire");
const userAgent = require("../lib/ua");

const tokenize = proxyquire("../lib/tokenize", {
  "./saveToken.js": (x, y) => {
    return true;
  }
});

test("should return token when otp is not required", async t => {
  const body = {
    scopes: ["gist"],
    note: "gist cli access"
  };

  const _user = "foo",
    pass = "bar";

  nock("https://api.github.com")
    .matchHeader("content-type", "application/json")
    .matchHeader("content-length", JSON.stringify(body).length)
    .matchHeader("user-agent", userAgent)
    .matchHeader(
      "authorization",
      `Basic ${new Buffer(_user + ":" + pass).toString("base64")}`
    )
    .post("/authorizations")
    .reply(201, {
      token: "this_iz_token"
    });

  const { user, token } = await tokenize(_user, pass);

  t.is(token, "this_iz_token");
  t.is(user, "foo");
});
