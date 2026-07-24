const { test, describe, before } = require("node:test");
const assert = require("node:assert");

const BASE_URL = "http://localhost:3000";

describe("Auth API - Registration & Login", () => {
  const uniqueId = Date.now();
  const testUser = {
    userName: `Test User ${uniqueId}`,
    userPhone: `999${uniqueId.toString().slice(-6)}`,
    email: `test_${uniqueId}@sushimania.com`,
    password: "Password123!",
  };

  test("1. POST /register - Should register a new user successfully", async () => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    assert.strictEqual(data.mensagem, "Usuario criado com sucesso");
    assert.strictEqual(data.email, testUser.email);
  });

  test("2. POST /register - Should fail when registering duplicate email", async () => {
    const duplicateEmailUser = {
      ...testUser,
      userPhone: `888${Date.now().toString().slice(-6)}`,
    };

    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(duplicateEmailUser),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.erro, "Este E-mail já está cadastrado");
  });

  test("3. POST /register - Should fail when registering duplicate phone", async () => {
    const duplicatePhoneUser = {
      ...testUser,
      email: `another_${Date.now()}@sushimania.com`,
    };

    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(duplicatePhoneUser),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.erro, "Este telefone já está cadastrado");
  });

  test("4. POST /login - Should login successfully with valid credentials", async () => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.ok(data.token, "Response should include a JWT token");
    assert.strictEqual(data.mensagem, "Login realizado com sucesso");
  });

  test("5. POST /login - Should fail with wrong password", async () => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: "WrongPassword123",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.erro, "Email ou senha incorretos");
  });

  test("6. POST /login - Should fail with non-existent email", async () => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nonexistent_email_99999@sushimania.com",
        password: "Password123!",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.erro, "Email ou senha incorretos");
  });
});
