var debug = require("local-debug")('node/compile');
var path = require("path");
var fs = require("fs");
var browserify = require("browserify");
var concat = require("concat-stream");
var format = require("new-format");
var iter = require("iter");
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
    buffer += '\n/* @' + path.join(brick.dir, filename) + ' */\n\n';
    buffer += format(brick.source.css[filename], {
      'assets-dir': brick.assetsDir
    });
    buffer += '\n\n';
  }

  var embed = Object.keys(brick.embed);

  if (embed.length == 0) return callback(undefined, buffer);

  buffer += '/* Embedded stylesheets of ' + brick.name + ' */';

  iter(embed.length)
    .done(function () {
      callback(undefined, buffer);
    })
    .run(function (next, i) {
      brick.embed[embed[i]].css(function (error, chunk) {
        if (error) {
          debug('Failed to compile CSS document of %s', embed[i]);
          return next();
        }

        buffer += '\n' + chunk;
        next();
      });
    });
}

function html (brick, callback) {
  return callback(undefined, render.container(brick,brick.render(brick.defaultTemplateName)));
}

function js (brick, callback) {
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

  b.bundle().pipe(concat(function (bundle) {
    fs.unlink(index);
    callback(undefined, bundle);
  }));
}
