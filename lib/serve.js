var debug = require("local-debug")('serve');
var http = require('http');
var fs = require("fs");
var mimeOf = require("mime-of");
var parseUrl = require("url").parse;
var path = require("path");
var templates = require("./templates");

module.exports = serve;

function serve (brick, port, hostname) {
  debug('Publishing the %s brick on %s:%s', brick.name, hostname || '', port);

  http.createServer(function (req, res) {
    var pathname = parseUrl(req.url).pathname;

    if (pathname == '/') return main(brick, req, res);

    var index = brick.resources.indexOf(pathname);
    index == -1 && (index = brick.resources.indexOf(pathname.slice(1)));

    if (index == -1) {
      res.writeHead(404, { 'Content-type': 'text/html' });
      res.end('404 - Page Not Found.');
      return;
    }

    var filename = path.join(brick.dir, brick.resources[index]);
    var stat = fs.statSync(filename);

    res.writeHead(200, {
      'Content-Type': mimeOf(filename),
      'Content-Length': stat.size
    });

    fs.createReadStream(filename).pipe(res);

  }).listen(port, hostname);
}

function main (brick, req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  var css = brick.resources.filter(isCSS).map(function (filename) {
    return templates['stylesheet.html'](filename);
  });

  fs.readFile('index.html', function (error, buffer) {
    if (error) onError(req, res, error);

    var html = buffer.toString();

    var out = templates['main.html']({
      name: brick.name,
      html: html,
      js: 'brick-bundle.js',
      css: css
    });

    res.end(out);
  });
}

function onError (req, res, error) {
  debug('Error: %s', error);
  res.writeHead(500, { 'Content-type': 'text/html' });
  res.end('500 - Internal server eror.');
}

function isCSS (filename) {
  return /\.css$/.test(filename);
}
