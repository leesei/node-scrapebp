// scrape function
// res: `node-fetch` `Response` object (https://github.com/bitinn/node-fetch#interface-body)
// $:   `cheerio` object for the parsed HTML page
// return: Promise of scraped result
//
module.exports = (res, $) => {
  console.info('processing ...');

  // show off your cheerio-fu here
  return Promise.resolve({
    title: $('title').text(),
    links: $('a')
      .toArray()
      .map(el => $(el).attr('href'))
      .slice(0, 10),
    imgs: $('img')
      .toArray()
      .map(el => $(el).attr('src'))
      .slice(0, 10),
    scripts: $('script')
      .toArray()
      .map(el => $(el).attr('src'))
      .slice(0, 10),
  });
};
