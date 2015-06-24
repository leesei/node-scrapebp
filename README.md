# node-scrapebp

[![npm version](https://img.shields.io/npm/v/scrapebp.svg?style=flat-square)](https://www.npmjs.com/scrapebp)
[![npm downloads](https://img.shields.io/npm/l/scrapebp.svg?style=flat-square)](https://www.npmjs.com/scrapebp)
[![dependency status](https://img.shields.io/david/leesei/node-scrapebp.svg?style=flat-square)](https://david-dm.org/leesei/node-scrapebp)

Boilerplate code for a Node.js based scraper.

## Installation

```bash
npm install scrapebp
```

This module can be forked or depended upon for future scraping projects.  
Caller only need to specify `opts` and implement the custom scraper and scrape callback function.

## Usage

See [bin/scrapebp](bin/scrapebp).

```javascript
var ScrapeBp = require('scrapebp');

// DemoScraper and scrapeCallback are defined

var opts = {};
// url to scrape
opts.url = argv.url;
// [optional] HTTP method (default = 'GET')
opts.method = argv.method;
// [optional] custom header for request
opts.headers = {
  foo: "bar",
  "x-foo": "x-bar"
};
// [optional] body for request
// ScrapeBp will set the HTTP 'Content' header according to `formEncode`
// NOTE: server is not required to handle body of GET requests
// http://stackoverflow.com/questions/978061/http-get-with-request-body
opts.body = {
  foo: "bar",
  message: "dummy payload from scrapebp"
};
// [optional] apply form encoding to request body instead of JSON data (default = false)
opts.formEncode = argv.form;
// [optional] whether to accept gzipped response (default = false)
opts.useZip = argv.zip;
// [optional] number of redirects (default = 5)
opts.nRedirect = 10;
// [optional] cheerio option object
opts.cheerio_opts = null;

var scrapebp = ScrapeBp(opts);

scrapebp.on('headers', function (headers) {
  console.log("- %s headers ready", opts.method);
  if (argv.dumpHeader) {
    console.log(headers);
  }
});

scrapebp.on('redirect', function (url, remaining) {
  console.log("- redirects to: %s (%d remaining)", url, remaining);
});

scrapebp.on('error', function (err) {
  console.error(err);
});

scrapebp.on('response', function (resp) {
  console.log("- response ready");
});

scrapebp.on('$ready', function(url, $) {
  console.log("- $ ready");
  // $ is the cheerio object
  // use $.html() to get the response body
  // useful if the response is not html/xml

  if (argv.dumpBody) {
    console.log("body:");
    console.log($.html());
  }

  // invoke our scraper
  DemoScraper.scrape(url, $, scrapeCallback);
});
```

## Debug

Following `needle`, `scrapebp` uses [visionmedia/debug](https://github.com/visionmedia/debug).

```sh
DEBUG=scrapebp bin/scrapebp www.yahoo.com
```

## Design choice

Originally [hyperquest](https://github.com/hyperquest/hyperquest), [hyperdirect](https://github.com/hyperquest/hyperdirect) and [hyperzip](https://github.com/hyperquest/hyperzip) is used as the HTTP stack.
Then I switched to [tomas/needle](https://github.com/tomas/needle), which supports all of the above and `iconv` conversion.

## Reference for dependencies 

[cheeriojs/cheerio](https://github.com/cheeriojs/cheerio)

[tomas/needle](https://github.com/tomas/needle)

## TODO

write tests that covers:
- GET with query string
- POST with payload
- redirects
- non UTF-8 page
- cheerio `.html()` are unicode literals (e.g.: &#x5229;)?
- use of compression (`-z` and check response header and decoded body)
- error handling

features:
- character set detection
- promisify?
- browserify

