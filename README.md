# node-scrapebp

[![npm](https://img.shields.io/npm/v/scrapebp.svg)](https://www.npmjs.com/scrapebp)
[![npm](https://img.shields.io/npm/l/scrapebp.svg)]()
[![David](https://img.shields.io/david/leesei/node-scrapebp.svg)]()

Boilerplate code for a Node.js based scraper.

## Installation

```bash
npm install scrapebp
```

This module can be forked or depended upon for future scraping projects.  
Caller only need to specify `opts` and implement the custom scraper.

## Usage

See [bin/scrapebp](bin/scrapebp).

```javascript
var ScrapeBp = require('scrapebp');

var opts = {};
// url to scrape
opts.url = argv.url;
// [optional] HTTP method (default = 'GET')
opts.method = argv.method;
// [optional] body for request that can carry payload (duplex HTTP methods)
// ScrapeBp will set the HTTP 'Content' header, caller should not write to request stream
// OR caller could leave this empty and do a customized request in 'request' event listener
opts.body = {
  foo: "bar",
  message: "dummy payload from scrapebp"
};
// [optional] apply form encoding to request body instead of JSON data (default = false)
opts.formEncode = argv.form;
// [optional] whether to accept gzipped response (default = false)
opts.useZip = argv.zip;
// [optional] encoding for reponse content (default = auto detect)
opts.encoding = argv.encoding;
// [optional] number of redirects (default = 5)
opts.nRedirect = 10;
// [optional] cheerio option object
opts.cheerio_opts = null;

var scrapebp = ScrapeBp(opts);

scrapebp.on('request', function(req) {
  console.log("- %s request ready", opts.method);
  // can set header here
  // should not call req.write() as we've set opts.data
  // check source for how to send request body with req
});

scrapebp.on('request', function(res) {
  console.log("- response ready");
});

scrapebp.on('redirect', function(url, remaining) {
  console.log("- redirects to: %s (%d remaining)", url, remaining);
});

scrapebp.on('$ready', function(url, $) {
  console.log("- $ ready");
  // $ is the cheerio object
  // use $.html() to get the response body
  // useful if the response is not html/xml

  // invoke our scraper
  DemoScraper.scrape(url, $, callback);
});
```

## Design choice

[hyperzip](https://github.com/hyperquest/hyperzip) is bundled rather than being depended on. This saves the need to wait for hyperzip to update when hyperquest is updated.
> Note: this is not working correctly for all sites (hyperquest/hyperzip#1)

The logic of [hyperdirect](https://github.com/hyperquest/hyperdirect) is also integrated here. We don't need the full capbility of hyperdirect. Reducing dependencies is another reason for the integration.

## Reference for dependencies 

cheerio:     https://github.com/MatthewMueller/cheerio

htmlparser2: https://github.com/fb55/htmlparser2

hyperquest:  https://github.com/substack/hyperquest
