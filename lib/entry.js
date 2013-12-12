var debug = require("local-debug")("entry");
var path = require("path");

module.exports = entry;

function entry (dir) {
  var manifest = require(path.join(dir, 'package.json'));
  return require(path.join(dir, manifest.main || 'index.js'));
}
