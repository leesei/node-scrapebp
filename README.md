# node-scrapebp

> the npm package `node-scrapebp` is DEPRECATED, source of package can be found in `deprecated` branch  
> with modern library, there's not need for any wrapper library  
> this repo now serves as boilerplate for a Node.js scraper

## Usage

```sh
git clone https://github.com/leesei/node-scrapebp/
npm install
# OR
yarn install

./index.js $URL
```

`index.js` is the boilerplate code for setting up `fetch()` and `cheerio`.  
You should implement a new Scraper to scrape your site and modify this line:

```js
const scraper = require('./DemoScraper');
```

### Note on Character Encoding

`node-fetch@2`'s `Body.text()` API no longer do character conversion.

You have to :
1. `npm install --save encoding`
2. use `Body.textConverted()` to detect encoding and convert to UTF8

## References

- [cheeriojs/cheerio](https://github.com/cheeriojs/cheerio)
- [bitinn/node-fetch](https://github.com/bitinn/node-fetch)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
