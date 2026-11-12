import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Static Assets & Mascots Verification", () => {
  test("Mascot runtime script exists in public/mascots", () => {
    const scriptPath = path.resolve("public/mascots/exode-mascot.js");
    assert.equal(fs.existsSync(scriptPath), true, "exode-mascot.js must exist");
    const stat = fs.statSync(scriptPath);
    assert.ok(stat.size > 100000, "exode-mascot.js should be around 450KB");
  });

  test("Waddle Duck (ip-2016) bexode asset exists", () => {
    const file = path.resolve("public/mascots/ip-2016.bexode");
    assert.equal(fs.existsSync(file), true, "ip-2016.bexode must exist");
    assert.ok(fs.statSync(file).size > 10000, "ip-2016.bexode must have valid byte content");
  });

  test("Brave Duck (ip-0119) bexode asset exists", () => {
    const file = path.resolve("public/mascots/ip-0119.bexode");
    assert.equal(fs.existsSync(file), true, "ip-0119.bexode must exist");
    assert.ok(fs.statSync(file).size > 10000, "ip-0119.bexode must have valid byte content");
  });
});

describe("Configuration & Security Files Verification", () => {
  test(".env.example contains essential environment variable keys", () => {
    const envExample = fs.readFileSync(path.resolve(".env.example"), "utf8");
    assert.ok(envExample.includes("DATABASE_URL"), "Missing DATABASE_URL in .env.example");
    assert.ok(envExample.includes("GOOGLE_API_KEY"), "Missing GOOGLE_API_KEY in .env.example");
    assert.ok(envExample.includes("NEXT_PUBLIC_SUPABASE_URL"), "Missing NEXT_PUBLIC_SUPABASE_URL in .env.example");
  });

  test(".gitignore excludes secrets and build artifacts", () => {
    const gitignore = fs.readFileSync(path.resolve(".gitignore"), "utf8");
    assert.ok(gitignore.includes(".env"), ".gitignore must exclude .env");
    assert.ok(gitignore.includes(".next/"), ".gitignore must exclude .next/");
    assert.ok(gitignore.includes("node_modules/"), ".gitignore must exclude node_modules/");
  });
});

