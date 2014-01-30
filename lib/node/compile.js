var debug = require("local-debug")('node/compile');
var path = require("path");
var fs = require("fs");
var browserify = require("browserify");
var render = require("./render");
var templates = require("./templates");

module.exports = {
  css: css,
  html: html,
  js: js
};

function css (brick, callback) {
  var buffer = '';
  var filename;

  for (filename in brick.source.css) {
    buffer += '\n/* @' + filename + ' */\n\n';
    buffer += brick.source.css[filename];
    buffer += '\n\n';
  }

  callback(undefined, buffer);
}

function html (brick, callback) {
  return callback(undefined, render.container(brick, brick.render(brick.defaultTemplateName)));
}

function js (brick, callback) {
  var buffer = '';
  var index = path.join(brick.dir, '_brick_index.js');
  var b = browserify();
  var stream;

  fs.writeFileSync(index, templates['index.js']({
    name: brick.name,
    filename: brick.entry,
    templates: JSON.stringify(brick.templates),
    css: '""',
    setup: ""
  }));

  b.add(index);
  stream = b.bundle();

  stream.on('error', callback);

  stream.on('data', function (chunk) {
    buffer += chunk;
  });

  stream.on('end', function () {
    fs.unlink(index);
    callback(undefined, buffer);
  });
}
