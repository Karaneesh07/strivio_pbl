const app = require('./app');
const cronJobs = require('./utils/cronJobs');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

// Start Cron Jobs
cronJobs.init();

app.listen(PORT, () => {
  console.log(`🚀 DSA Backend running on http://localhost:${PORT}`);
});
