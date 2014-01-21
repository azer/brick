var debug = require("local-debug")('serve');
var http = require('http');
var fs = require("fs");
var mimeOf = require("mime-of");
var parseUrl = require("url").parse;
var path = require("path");
var templates = require("./templates");

module.exports = serve;

function serve (brick, port, hostname) {
  hostname || (hostname = '');
  port || (port = 8010);

  debug('Publishing the %s brick on %s:%s', brick.name, hostname, port);

  var server = http.createServer(wait).listen(port, hostname);
  var isReady = false;

  brick.onReady(function () {
    isReady = true;
  });

  return server;

  function wait (req, res) {
    if (isReady) return onRequest(req, res);

    brick.onReady(function () {
      onRequest(req, res);
    });
  };

  function onRequest (req, res) {
    var pathname = parseUrl(req.url).pathname;

    route(brick, pathname, function (resource) {
      if (!resource) {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('404 - Page Not Found.');
        return;
      }

      resource(function (error, content) {
        if (error) return onError(req, res, error);

        res.writeHead(200, {
          'Content-Type': mimeOf(pathname),
          'Content-Length': content.length
        });

        res.end(content);
      });
    });
  }
}

function route (brick, pathname, callback) {
  var resource;
  var assetFilename;
  var assetFullPath;

  if (pathname == '/') return callback(function (callback) { callback(undefined, brick.html()); });
  if (pathname == '/assets/bundle.js') return callback(brick.js);
  if (pathname == '/assets/bundle.css') return callback(brick.css);
  if (!resource && pathname.slice(0, 8) != '/assets/') return callback();

  assetFilename = pathname.slice(8);
  assetFullPath = path.join(brick.dir, assetFilename);

  fs.exists(assetFullPath, function (exists) {
    if (!exists) return callback();

    return callback(asset(assetFullPath));
  });
}

function onError (req, res, error) {
  debug('Error: %s', error);
  res.writeHead(500, { 'Content-type': 'text/html' });
  res.end('500 - Internal server error.');
}

function asset (filename) {
  return function (callback) {
    fs.readFile(filename, function (error, buffer) {
      if (error) return callback(error);
      callback(undefined, buffer);
    });
  };
}
