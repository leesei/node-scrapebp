"use strict";

var events = require('events');
var querystring = require('querystring');
var util = require('util');

var cheerio = require('cheerio');
var clone = require('clone');
var debug = require('debug')('scrapebp');
var deepDefaults = require('deep-defaults');
var needle = require('needle');

// needle is doing the conversion for us
// but it does not do charset detection
// var charset = require('charset');
// var iconv = require('iconv-lite');

var DEFAULT_OPTS = {
  url: null,
  method: 'GET',
  headers: null,
  body: null,
  // these are used to construct needle option
  formEncode: false,
  useZip: false,
  nRedirect: 5,
  cheerio_opts: {
    normalizeWhitespace: false,
    xmlMode: false,
    lowerCaseTags: false
  }
}

function ScrapeBp(opts) {
  if (!(this instanceof ScrapeBp)) {
    return new ScrapeBp(opts);
  }

  var me = this;
  // apply default options
  var _opts = deepDefaults(opts, clone(DEFAULT_OPTS));
  var needle_opts = {
    headers: _opts.headers,
    compressed: _opts.useZip,
    follow: _opts.nRedirect,
    json: !_opts.formEncode,
    parse_response: false
  };

  debug(_opts);
  debug(needle_opts);
  // inherits EventEmitter properties
  events.EventEmitter.call(me);

  if (!_opts.url) {
    me.emit('error', new Error("url not exist"));
    return;
  }

  var req = needle.request(
    _opts.method,
    _opts.url,
    _opts.body,
    needle_opts,
    done
  );

  function done(err, resp, body) {
    debug('on done');
    if (err) {
      me.emit('error', err);
      return;
    }
    else {
      // console.log(Object.keys(resp));
      me.emit('response', resp);

      var $ = cheerio.load(body, _opts.cheerio_opts);
      me.emit('$ready', _opts.url, $);
    }
  }

  me.emit('request', req);

  req.on('headers', function(headers) {
    debug('on headers');
    me.emit('headers', headers);
  });

  req.on('redirect', function(location) {
    debug('on redirect');
    _opts.nRedirect--;
    me.emit('redirect', location, _opts.nRedirect);
  });

  req.on('end', function() {
    debug('on end');
    // this has no param, handle body in `done()`
  });
}

// inherits EventEmitter prototype
util.inherits(ScrapeBp, events.EventEmitter);

module.exports = ScrapeBp;
