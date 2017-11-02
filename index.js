#!/usr/bin/env node

const chalk = require('chalk');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const package = require('./package.json');

const scraper = require('./DemoScraper');

var argv = require('nomnom')
  .script(package.name)
  .option('url', {
    position: 0,
    help: 'URL to scrape',
    list: false,
    required: true,
  })
  .option('dumpHeader', {
    abbr: 'H',
    flag: true,
    default: false,
    help: 'Dump HTTP response header',
  })
  .option('dumpBody', {
    abbr: 'B',
    flag: true,
    default: false,
    help: 'Dump HTTP response body',
  })
  .help(
    chalk.bold('Author: ') +
      chalk.underline('leesei@gmail.com') +
      '       ' +
      chalk.bold('Licence: ') +
      package.licence +
      '\n'
  )
  .parse();

// console.log(argv);
// normalize argv
if (!/^https?:\/\//.test(argv.url)) {
  argv.url = 'http://' + argv.url;
}

(async () => {
  const fetchOpts = {};
  const cheerioOpts = {
    xmlMode: false,
    decodeEntities: true,
    lowerCaseTags: true,
  };

  // https://github.com/bitinn/node-fetch#fetchurl-options
  const res = await fetch(argv.url, fetchOpts);
  if (argv.dumpHeader) {
    console.log('headers:');
    console.log(res.headers.raw());
  }

  // use `res.textConverted()` if the page is not UTF8
  // requires `encoding` package
  const html = await res.text();
  $ = cheerio.load(html, cheerioOpts);
  if (argv.dumpBody) {
    console.log('body:');
    console.log($.html());
  }

  const result = await scraper(res, $);
  console.log(result);
})();
