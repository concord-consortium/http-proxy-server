const proxy = require("./proxy");
const port = process.env.PORT || 3000;
const target = process.env.TARGET;
const logRequests = process.env.LOG_REQUESTS === "true";

if (!target) {
  console.error("No TARGET url found in environment settings.  Aborting!");
  process.exit(1);
}

const log = (...args) => console.log.apply(null, args);

proxy({target, port, logRequests, log})
  .then(() => log("Waiting for requests ..."));
