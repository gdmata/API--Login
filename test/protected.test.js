const { test, describe, before } = require("node:test");
const assert = require("node:assert");

const BASE_URL = "http://localhost:3000";

describe("Protected Route - GET /user", () => {
  let authToken = "";
  const uniqueId = Date.now();
  const testUser = {
    userName: `Protected User ${uniqueId}`,
    userPhone: `777${uniqueId.toString().slice(-6)}`,
    email: `protected_${uniqueId}@sushimania.com`,
    password: "Password123!",
  };

  before(async () => {
    // 1. Register user
    await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    // 2. Login to obtain valid JWT token
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const loginData = await loginRes.json();
    authToken = loginData.token;
  });

  test("1. GET /user - Should fail with 400 when Authorization header is missing", async () => {
    const res = await fetch(`${BASE_URL}/user`);
    assert.strictEqual(res.status, 400, "Missing auth header should yield 400");
  });

  test("2. GET /user - Should fail with 401 when JWT token is invalid", async () => {
    const res = await fetch(`${BASE_URL}/user`, {
      headers: { Authorization: "Bearer invalid.jwt.token" },
    });
    assert.strictEqual(res.status, 401, "Invalid JWT token should yield 401");
  });

  test("3. GET /user - Should return user profile data when valid JWT token is provided", async () => {
    const res = await fetch(`${BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    assert.strictEqual(res.status, 200, "Valid token should return 200 OK");
    const data = await res.json();
    assert.strictEqual(data.email, testUser.email);
    assert.strictEqual(data.name, testUser.userName);
  });
});
