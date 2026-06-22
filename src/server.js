require("dotenv").config();

const app = require("./app");
const healthCron = require("./jobs/healthCron");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Start the cron job
  healthCron.start();
  console.log("✅ Health cron job started.");
});