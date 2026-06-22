const { CronJob } = require("cron");
const http = require("node:http");
const https = require("node:https");

const job = new CronJob("*/14 * * * *", () => {
  const base = process.env.BACKEND_URL;
  if (!base) {
    console.log("BACKEND_URL is not set.");
    return;
  }

  const url = new URL("/api/health", base).href;
  const client = url.startsWith("https:") ? https : http;

  client
    .get(url, (res) => {
      if (res.statusCode === 200) {
        console.log("✅ Health check successful");
      } else {
        console.log(`❌ Health check failed: ${res.statusCode}`);
      }
    })
    .on("error", (err) => {
      console.error("❌ Error:", err.message);
    });
});

module.exports = job;