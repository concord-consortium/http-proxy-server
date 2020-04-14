const httpProxy = require('http-proxy');

const proxy = (options) => {
  return new Promise((resolve, reject) => {
    const {port, target, logRequests, log} = options;

    if (!target) {
      reject(new Error("No target url specified.  Aborting!"));
    }

    log(`Creating proxy server to ${target}`)
    const proxy = httpProxy.createProxyServer({
      target,              // url to proxy requests to
      changeOrigin: true,  // change hostname to target hostname on request
      secure: false        // don't validate target's ssl cert
    });

    log(`${logRequests ? "Setting up" : "Skipping setting up"} request logger`);
    if (logRequests) {
      proxy.on("proxyReq", (proxyReq) => log("Request:", (new Date()).toString(), proxyReq.method, proxyReq.path));
    }

    log("Setting error handler")
    proxy.on("error", (err) => error(err.toString()));

    log(`Listening on port ${port}`);
    proxy.listen(port);

    resolve(proxy);
  });
};

module.exports = proxy;