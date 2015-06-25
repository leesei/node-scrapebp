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
  body: null,
  needle_opts: {
    compressed: true,
    follow: 5,
    headers: null,
    json: true,
    parse: false
  },
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
  var _opts = deepDefaults(clone(opts), DEFAULT_OPTS);

  debug(_opts);
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
    _opts.needle_opts,
    done
  );

  function done(err, resp, body) {
    debug('on done');
    if (err) {
      me.emit('error', err);
      return;
    }
    else {
      var $ = cheerio.load(body, _opts.cheerio_opts);
      me.emit('$ready', _opts.url, $);
    }
  }

  me.emit('request', req);

  req.on('headers', function (headers) {
    debug('on headers');
    me.emit('headers', headers);
  });

  req.on('redirect', function (location) {
    debug('on redirect');
    _opts.needle_opts.follow--;
    me.emit('redirect', location, _opts.needle_opts.follow);
  });

  req.on('end', function() {
    debug('on end');
    // this has no param, handle body in `done()`
  });
}

// inherits EventEmitter prototype
util.inherits(ScrapeBp, events.EventEmitter);

module.exports = ScrapeBp;
