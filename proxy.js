const httpProxy = require("http-proxy");

const proxy = (options) => {
  return new Promise((resolve, reject) => {
    const {port, target, logRequests, log, newPath} = options;

    if (!target) {
      reject(new Error("No target url specified. Aborting!"));
    }
    if (!port) {
      reject(new Error("No port specified. Aborting!"));
    }
    if (!log) {
      reject(new Error("No log specified. Aborting!"));
    }

    // newPath is optional

    log(`Creating proxy server to ${target}`)
    const proxy = httpProxy.createProxyServer({
      target,              // url to proxy requests to
      changeOrigin: true,  // change hostname to target hostname on request
      secure: false        // don't validate target's ssl cert
    });

    log(`${logRequests ? "Setting up" : "Skipping setting up"} request logger`);
    proxy.on("proxyReq", (proxyReq) => {
      if (logRequests) {
        log("Request:", (new Date()).toString(), proxyReq.method, proxyReq.path)
      }
      if (newPath) {
        proxyReq.path = newPath;
      }
    });

    log("Setting error handler")
    proxy.on("error", (err) => log(err.toString()));

    log(`Listening on port ${port}`);
    proxy.listen(port);

    resolve(proxy);
  });
};

module.exports = proxy;