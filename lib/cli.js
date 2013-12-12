var debug = require("local-debug")("cli");
var entry = require("./entry");
var options = require("./options");
var path = require("path");
var fs = require("fs");

module.exports = cli;

function cli (params) {
  if (params.out) return bundle(params.out);

  serve();
}

function get () {
  var manifest = require(path.join(options.dir(), 'package.json'));
  var name = manifest.name;

  return entry(options.dir())({
    name: name,
    entry: manifest.main || 'index.js',
    dir: options.dir()
  });
}


function serve () {
  get().serve(options.port(), options.hostname());
}

function bundle (target) {
  get().bundle().pipe(fs.createWriteStream(target));
}
