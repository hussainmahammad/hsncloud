import app from "./app.js";
import { startSESPolling } from "./jobs/sesPollingJob.js";

const PORT = 5000;

// 🔥 Start SES polling job
startSESPolling();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});