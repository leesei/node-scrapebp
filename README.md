# node-scrapebp

[![npm version](https://img.shields.io/npm/v/scrapebp.svg?style=flat-square)](https://www.npmjs.com/scrapebp)
[![npm downloads](https://img.shields.io/npm/l/scrapebp.svg?style=flat-square)](https://www.npmjs.com/scrapebp)
[![dependency status](https://img.shields.io/david/leesei/node-scrapebp.svg?style=flat-square)](https://david-dm.org/leesei/node-scrapebp)

## Installation

```bash
npm install scrapebp
```

This module can be forked or depended upon for future scraping projects.  
Caller only need to specify `opts` and implement the custom scraper and scrape callback function.

## Usage

See [bin/scrapebp](bin/scrapebp) for details.

```javascript
var ScrapeBp = require('scrapebp');

// DemoScraper and scrapeCallback are defined
// opts for ScrapeBp is prepared

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
- use of compression (`-z` and check response header and decoded body)
- error handling

features:
- character set detection with [aadsm/jschardet](https://github.com/aadsm/jschardet)? (in case HTTP header and HTML meta did not signals charset)
- promisify?
- browserify

bug:
- multi-byte cut-off (https://github.com/tomas/needle/issues/88)
