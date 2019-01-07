// scrape function
// res: `node-fetch` `Response` object (https://github.com/bitinn/node-fetch#interface-body)
// $:   `cheerio` object with page loaded (https://github.com/cheeriojs/cheerio#api)
// return: Promise of scraped result
module.exports = (res, $) => {
  console.info("processing [%s] ...", res.url);

  // show off your cheerio-fu here
  return Promise.resolve({
    title: $("title")
      .text()
      .trim(),
    links: $("a")
      .toArray()
      .map(el => $(el).attr("href"))
      .slice(0, 10),
    imgs: $("img")
      .toArray()
      .map(el => $(el).attr("src"))
      .slice(0, 10),
    scripts: $("script")
      .toArray()
      .map(el => $(el).attr("src"))
      .filter(src => !!src)
      .slice(0, 10)
  });
};
