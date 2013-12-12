var serve = require("./serve");
var browserify = require('browserify');
var path = require("path");
var fs = require("fs");
var variableName = require("variable-name");
var templates = require("./templates");

module.exports = {
  bundle: bundle,
  serve: serve
};

function bundle (brick) {
  var entry = path.join(brick.dir, '_brick_entry.js');
  var b = browserify();
  var name = variableName(brick.name);
  var stream;

  fs.writeFileSync(entry, templates['entry.js']({
    name: name[0].toUpperCase() + name.slice(1),
    filename: brick.entry,
    template: JSON.stringify(fs.readFileSync(brick.resources[0]).toString()),
    css: JSON.stringify(fs.readFileSync(brick.resources[1]).toString())
  }));

  b.add(entry);
  stream = b.bundle();

  stream.on('end', function () {
    fs.unlink(entry);
  });

  return stream;
}
