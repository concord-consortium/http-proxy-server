# http-proxy-server

A simple configurable http proxy server

[![Build Status](https://travis-ci.com/concord-consortium/http-proxy-server.svg?branch=master)](https://travis-ci.com/concord-consortium/http-proxy-server)

## Setup

Run `npm i` to install dependencies.

Create `.env` file with the following values defined:

```
TARGET=<url for target server>
PORT=<port for proxy server>
LOG_REQUESTS=<true|false> (optional, defaults to false)
```

Example:

```
TARGET=https://concord.org
PORT=5000
LOG_REQUESTS=true
```

## Running

### Locally

Run `npm start` to start the app under `foreman`.

### Heroku

There is a `Procfile` defined so a normal push to Heroku should work with no additional work after the `TARGET` is defined in the Heroku app (Heroku creates the `PORT` environment variable automatically).

## Testing

Run `npm test` to run the `jest` tests.

## License

Copyright 2020 (c) by the Concord Consortium and is distributed under the MIT license.

See LICENSE file for the complete license text.