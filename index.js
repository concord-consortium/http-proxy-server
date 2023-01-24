const proxy = require("./proxy");
const port = process.env.PORT || 3000;
const target = process.env.TARGET;
const logRequests = process.env.LOG_REQUESTS === "true";
const newPath = process.env.NEW_PATH;

if (!target) {
  console.error("No TARGET url found in environment settings. Aborting!");
  process.exit(1);
}

const log = (...args) => console.log.apply(null, args);

proxy({target, port, logRequests, log, newPath})
  .then(() => log("Waiting for requests ..."));
