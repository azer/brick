var debug = require("local-debug")('list-brick-files');
var info = require("../info");
var lsr = require("lsr").sync;
var path = require('path');
var fs = require("fs");
var exists = fs.existsSync;
var newIgnoreFilter = require("ignore-doc");
var ignoreDocLookup = require("./ignore-doc-lookup");
var ignoreByDefault = [
  '.brignore',
  '.brickignore',
  '.npmignore',
  'node_modules',
  'package.json'
];

module.exports = listBrickFiles;

function readIgnoreDocument (dir) {
  var i = -1;
  var len = ignoreDocLookup.length;
  var filename;

  while (++i < len) {
    filename = path.join(dir, ignoreDocLookup[i]);

    if (exists(filename)) {
      info('Reading %s', filename);
      return fs.readFileSync(filename);
    }
  }
}

function listBrickFiles (entry) {
  var dir = path.dirname(entry);
  var all = lsr(dir);
  var ignoreDoc = readIgnoreDocument(dir);
  var filter = ignoreDoc ? newIgnoreFilter(ignoreDoc, ignoreByDefault) : undefined;

  debug('Creating a list of the files at %s', dir);

  var result = all.filter(function (file) {
    if (filter && !filter(file.path.slice(2))) return false;
    if (file.fullPath != entry) return true;
  });

  result = result.map(function (file) {
    return file.path.slice(2);
  });

  return result;
}
