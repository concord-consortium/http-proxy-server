const http = require("http");
const proxy = require("./proxy");
const request = require("request-promise");

const proxyPort = 10000;
const log = () => undefined;

describe("setup", () => {
  test("aborts with no target", () => {
    return proxy({})
      .catch(e => expect(e.toString()).toEqual("Error: No target url specified. Aborting!"))
  });

  test("aborts with no port", () => {
    return proxy({target: "http://localhost"})
      .catch(e => expect(e.toString()).toEqual("Error: No port specified. Aborting!"))
  });

  test("aborts with no log", () => {
    return proxy({target: "http://localhost", port: proxyPort})
      .catch(e => expect(e.toString()).toEqual("Error: No log specified. Aborting!"))
  });

  test("creates a proxy server with the default options", () => {
    return proxy({target: "http://localhost", port: proxyPort, log})
      .then((server) => {
        const {target, changeOrigin, secure} = server.options;
        server.close();
        expect(target).toEqual("http://localhost");
        expect(changeOrigin).toEqual(true);
        expect(secure).toEqual(false);
      });
  });
})

describe("with target server", () => {
  let targetServer;
  const targetPort = proxyPort + 1;
  const targetHostAndPort = `localhost:${targetPort}`;
  const target = `http://${targetHostAndPort}`;
  const proxyServerUrl = (path) => `http://localhost:${proxyPort}${path}`;

  beforeAll(done => {
    targetServer = http.createServer(function(req, res) {
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.write(`${req.method} ${req.headers.host}: ${req.url}`);
      if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
          res.write(` - ${body}`);
          res.end();
        });
      } else {
        res.end();
      }
    });
    targetServer.listen(targetPort, done);
  });

  afterAll(done => {
    targetServer.close(done);
  });

  test("proxies GET and POST requests", async () => {
    const proxyServer = await proxy({target, port: proxyPort, log});
    const promises = [
      request(proxyServerUrl("/")),
      request(proxyServerUrl("/foo/bar/?baz=bam")),
      request({method: "POST", uri: proxyServerUrl("/form-data"), body: "foo=bar"}),
      request({method: "POST", uri: proxyServerUrl("/json"), body: {foo: "bar"}, json: true}),
    ];
    return Promise.all(promises).then((results) => {
      proxyServer.close();
      expect(results).toEqual([
        `GET ${targetHostAndPort}: /`,
        `GET ${targetHostAndPort}: /foo/bar/?baz=bam`,
        `POST ${targetHostAndPort}: /form-data - foo=bar`,
        `POST ${targetHostAndPort}: /json - {\"foo\":\"bar\"}`,
      ]);
    });
  });
});