var debug = require("local-debug")('node/load');
var fs = require("fs");
var path = require("path");

module.exports = loadAssets;

function loadAssets (brick) {
  return {
    html: loadAssetSet(brick, brick.assets.html),
    css: loadAssetSet(brick, brick.assets.css)
  };
}

function loadAssetSet (brick, set) {
  var result = {};

  var i = set.length;
  var filename;

  while (i--) {
    filename = set[i];
    debug('Reading %s', filename);
    result[filename] = fs.readFileSync(path.join(brick.dir, filename)).toString();
  }

  return result;
}
