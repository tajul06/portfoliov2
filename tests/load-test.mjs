import http from "node:http";
import { performance } from "node:perf_hooks";

const BASE_URL = process.env.TARGET_URL || "http://localhost:3000";
const CONCURRENCY = 15;
const TOTAL_REQUESTS = 120;

const ENDPOINTS = [
  "/",
  "/projects",
  "/beyond",
  "/mascots/exode-mascot.js",
  "/mascots/ip-2016.bexode",
];

function fetchEndpoint(urlPath) {
  return new Promise((resolve) => {
    const start = performance.now();
    const url = new URL(urlPath, BASE_URL);

    const req = http.get(url, (res) => {
      let bytes = 0;
      res.on("data", (chunk) => {
        bytes += chunk.length;
      });
      res.on("end", () => {
        const duration = performance.now() - start;
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          duration,
          bytes,
          success: res.statusCode >= 200 && res.statusCode < 400,
        });
      });
    });

    req.on("error", (err) => {
      const duration = performance.now() - start;
      resolve({
        path: urlPath,
        statusCode: 0,
        error: err.message,
        duration,
        bytes: 0,
        success: false,
      });
    });
  });
}

async function runLoadTest() {
  console.log("=================================================");
  console.log(`🚀 STARTING PRODUCTION LOAD TEST`);
  console.log(`Target:       ${BASE_URL}`);
  console.log(`Requests:     ${TOTAL_REQUESTS} total`);
  console.log(`Concurrency:  ${CONCURRENCY} parallel workers`);
  console.log(`Endpoints:    ${ENDPOINTS.join(", ")}`);
  console.log("=================================================\n");

  const results = [];
  const startGlobal = performance.now();

  let nextIndex = 0;
  async function worker() {
    while (nextIndex < TOTAL_REQUESTS) {
      const current = nextIndex++;
      const endpoint = ENDPOINTS[current % ENDPOINTS.length];
      const res = await fetchEndpoint(endpoint);
      results.push(res);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const totalTime = performance.now() - startGlobal;
  const durations = results.map((r) => r.duration).sort((a, b) => a - b);
  const successes = results.filter((r) => r.success).length;
  const failures = results.length - successes;

  const min = durations[0];
  const max = durations[durations.length - 1];
  const sum = durations.reduce((acc, d) => acc + d, 0);
  const mean = sum / durations.length;
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p90 = durations[Math.floor(durations.length * 0.9)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];
  const rps = (results.length / (totalTime / 1000)).toFixed(1);

  console.log("-------------------------------------------------");
  console.log("📊 LOAD TEST RESULTS SUMMARY");
  console.log("-------------------------------------------------");
  console.log(`Total Requests:    ${results.length}`);
  console.log(`Successful (200):  ${successes} (${((successes / results.length) * 100).toFixed(1)}%)`);
  console.log(`Failed / Errors:   ${failures}`);
  console.log(`Total Test Time:   ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`Throughput:        ${rps} requests/sec`);
  console.log("-------------------------------------------------");
  console.log("⚡ LATENCY BENCHMARKS (Time to Complete)");
  console.log("-------------------------------------------------");
  console.log(`Min:               ${min.toFixed(2)} ms`);
  console.log(`Mean (Average):    ${mean.toFixed(2)} ms`);
  console.log(`Median (p50):      ${p50.toFixed(2)} ms`);
  console.log(`p90:               ${p90.toFixed(2)} ms`);
  console.log(`p95:               ${p95.toFixed(2)} ms`);
  console.log(`p99:               ${p99.toFixed(2)} ms`);
  console.log(`Max:               ${max.toFixed(2)} ms`);
  console.log("=================================================\n");

  if (failures > 0) {
    process.exit(1);
  }
}

runLoadTest();
