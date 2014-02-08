var charset = require('charset');
var cheerio = require('cheerio');
var concat = require('concat-stream');
var events = require('events');
var hyperquest = require('hyperquest');
var hyperzip = require('./hyperzip'); // this is local
var iconv = require('iconv-lite');
var querystring = require('querystring');
var util = require('util');

// HACK: alias to support 'Big5-HKSCS'
// https://github.com/ashtuchkin/iconv-lite/pull/46
iconv.encodings['big5hkscs'] = 'big5';

function ScrapeBp(opts) {
  if (!(this instanceof ScrapeBp)) {
    return new ScrapeBp(opts);
  }

  var me = this;

  // apply default options
  var default_opts = {
    url: null,
    method: 'GET',
    data: null,
    formEncode: false,
    useZip: false,
    nRedirect: 5,
    cheerio_opts: {
      normalizeWhitespace: false,
      xmlMode: false,
      lowerCaseTags: false
    }
  };
  opts = util._extend(default_opts, opts);

  // inherits EventEmitter properties
  events.EventEmitter.call(me);

  var remainingRedirect = opts.nRedirect;
  var request = (opts.useZip)? hyperzip.request:hyperquest;

  // privileged method
  function doRequest(url) {
    var req = request({
      uri: url,  /* !not! opts.url */
      method: opts.method
    });

    // set headers for request body (if applicable)
    if (req.request.duplex && opts.body) {
      var reqBody;
      // need Content header for request with body
      if (opts.formEncode) {
        reqBody = querystring.stringify(opts.body);
      }
      else {
        reqBody = JSON.stringify(opts.body);
      }
      req.setHeader('Content-Length', reqBody.length);
      req.setHeader('Content-Type', ((opts.formEncode)?
          'application/x-www-form-urlencoded; charset=utf-8':
          'application/json; charset=utf-8'));
      req.write(reqBody);
      req.end();
    }

    me.emit('request', req);

    req.on('response', function(res) {
      // console.log(req);
      // console.log(res);
      me.emit('response', res);

      // handle redirects
      // see https://github.com/hyperquest/hyperdirect
      if (me.isRedirect(res.statusCode)) {
        if (remainingRedirect <= 0) {
          me.emit('error', new Error("Max redirect count reached: " + opts.nRedirect));
        }

        --remainingRedirect;
        me.emit('redirect', res.headers.location, remainingRedirect);
        return doRequest(res.headers.location);
      }

      // pipe to concated stream
      res.pipe(concat(function(body) {
        // CHECK: do we get correct body from hyperzip?

        var encoding = 'utf8';  // defaults to 'utf8'
        if (opts.encoding) {
          encoding = opts.encoding;
          if (opts.verbose) {
            console.info("Using encoding from options: " + encoding);
          }
        }
        else {
          // detect charset from header or body (the first 1Kb)
          var cs = charset(res.headers, body.toString('utf8', 0, 1024));
          if (cs) {
            encoding = cs;
            if (opts.verbose) {
              console.info("Detected encoding: " + encoding);
            }
          }
        }
        var str = iconv.decode(body, encoding);
        // console.log(str);
        var $ = cheerio.load(str, opts.cheerio_opts);
        me.emit('$ready', opts.url, $);
      }));
    });

    req.on('error', function(err) {
      me.emit('error', err);
    });
  }

  process.nextTick(function () {
    doRequest(opts.url);
  });
}

// inherits EventEmitter prototype
util.inherits(ScrapeBp, events.EventEmitter);

ScrapeBp.prototype.isRedirect = function(statusCode) {
  return statusCode === 301 || statusCode === 302 ||
         statusCode === 307 || statusCode === 308;
};

module.exports = ScrapeBp;
