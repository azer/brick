var debug = require("local-debug")("cli");
var path = require("path");
var fs = require("fs");
var readJSON = require("read-json");
var options = require("./options");
var templates = require("./templates");

module.exports = cli;

function cli (params) {
  if (params.out) return bundle(params.out);

  var dir = params._[0];

  if (dir) {
    if (dir[0] != '/') {
      dir = path.join(process.cwd(), dir);
    }

    options.dir(dir);
  }

  serve();
}

function get (callback) {
  var filename = path.join(options.dir(), 'package.json');

  debug('Reading %s', filename);

  readJSON(filename, function (error, manifest) {
    if (error) throw error;

    var modulePath = path.join(options.dir(), manifest.main || 'index');
    debug('Requiring a brick from %s', modulePath);
    var Factory = require(modulePath);

    callback(Factory.New());
  });
}

function serve () {
  get(function (brick) {
    brick.serve(options.port(), options.hostname());
  });
}

function bundle (target) {
  if (/\.html$/.test(target)) return bundleInToHTML(target);
  bundleInToJS(target);
}

function bundleInToHTML (target) {
  var filename = target.replace(/\.html$/, '');

  var template = templates['main.html']({
    js: filename + '.js',
    css: filename + '.css'
  });
}

function bundleInToJS (target, setup) {
  get(function (brick) {
    brick.bundle(setup).pipe(fs.createWriteStream(target));
  });
}
