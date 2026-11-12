import { test, describe } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const url = new URL(path, BASE_URL);
    const req = http.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch {
            parsed = body;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function getUrl(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    http.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on("error", reject);
  });
}

let serverAvailable = false;
try {
  await new Promise((resolve, reject) => {
    const testReq = http.get(BASE_URL, { timeout: 1000 }, (res) => {
      res.resume();
      serverAvailable = true;
      resolve();
    });
    testReq.on("error", () => resolve());
    testReq.on("timeout", () => {
      testReq.destroy();
      resolve();
    });
  });
} catch {
  serverAvailable = false;
}

describe("API Route: /api/chat", { skip: !serverAvailable && "Live Next.js server not reachable in current process environment" }, () => {
  test("Rejects empty or missing message with 400 Bad Request", async () => {
    const res = await postJson("/api/chat", {});
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: "Invalid message" });
  });

  test("Rejects non-string message with 400 Bad Request", async () => {
    const res = await postJson("/api/chat", { message: 12345 });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: "Invalid message" });
  });

  test("Rejects message exceeding 500 characters with 400 Bad Request", async () => {
    const longMessage = "a".repeat(501);
    const res = await postJson("/api/chat", { message: longMessage });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.includes("Message too long"));
  });

  test("Valid message returns 200 with text stream and nosniff header", async () => {
    const res = await postJson("/api/chat", { message: "Hello" });
    assert.equal(res.status, 200);
    assert.equal(res.headers["x-content-type-options"], "nosniff");
    assert.ok(typeof res.body === "string" && res.body.length > 0);
  });
});

describe("Public Route Health & Status", { skip: !serverAvailable && "Live Next.js server not reachable in current process environment" }, () => {
  test("GET / (Homepage) returns 200 OK", async () => {
    const res = await getUrl("/");
    assert.equal(res.status, 200);
    assert.ok(res.body.includes("<!DOCTYPE html>"));
  });

  test("GET /projects returns 200 OK", async () => {
    const res = await getUrl("/projects");
    assert.equal(res.status, 200);
  });

  test("GET /mascots/exode-mascot.js returns 200 with javascript content-type", async () => {
    const res = await getUrl("/mascots/exode-mascot.js");
    assert.equal(res.status, 200);
    assert.ok(res.headers["content-type"].includes("javascript"));
  });

  test("GET /mascots/ip-2016.bexode returns 200 OK", async () => {
    const res = await getUrl("/mascots/ip-2016.bexode");
    assert.equal(res.status, 200);
  });

  test("GET /api/keep-alive returns 200 with status alive and database heartbeat", async () => {
    const res = await getUrl("/api/keep-alive");
    assert.equal(res.status, 200);
    assert.equal(res.headers["x-keep-alive"], "healthy");
    const json = JSON.parse(res.body);
    assert.equal(json.status, "alive");
    assert.ok(json.timestamp);
    assert.ok(json.database);
  });
});

