const httpProxy = require('http-proxy');
const port = process.env.PORT || 3000;
const target = process.env.TARGET;
const logRequests = process.env.LOG_REQUESTS === "true";

if (!target) {
  console.error("No TARGET url found in environment settings.  Aborting!");
  process.exit(1);
}

console.log(`Creating proxy server to ${target}`)
const proxy = httpProxy.createProxyServer({
  target,              // url to proxy requests to
  changeOrigin: true,  // change hostname to target hostname on request
  secure: false        // don't validate target's ssl cert
});

console.log(`${logRequests ? "Setting up" : "Skipping setting up"} request logger`);
if (logRequests) {
  proxy.on("proxyReq", (proxyReq) => console.log("Request:", (new Date()).toString(), proxyReq.method, proxyReq.path));
}

console.log("Setting error handler")
proxy.on("error", (err) => console.error(err.toString()));

console.log(`Listening on port ${port}`);
proxy.listen(port);
