const url = require("url");

// scrape function
// res: `node-fetch` `Response` object (https://github.com/bitinn/node-fetch#interface-body)
// $:   `cheerio` object with page loaded (https://github.com/cheeriojs/cheerio#api)
// return: Promise of scraped result
module.exports = (res, $) => {
  // console.info("processing [%s] ...", res.url);

  // show off your cheerio-fu here
  return Promise.resolve({
    imgs: $("img")
      .toArray()
      .map(el => url.resolve(res.url, $(el).attr("src")))
  });
};
