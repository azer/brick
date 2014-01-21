var debug = require("local-debug")('build');
var mkdirp = require("mkdirp");
var path = require("path");
var cpr = require("cpr");
var iter = require("iter");
var fs = require("fs");

module.exports = build;

function build (brick, target, callback) {
  debug('Building into %s', target);

  brick.onReady(function () {
    makeDirs(target, function (error) {
      if(error) return callback(error);

      copyAssets(brick, target, function (error) {
        if(error) return callback(error);

        saveBundles(brick, target, callback);
      });
    });
  });
}

function copyAssets (brick, target, callback) {
  debug('Copying assets to %s', target);

  iter(brick.assets.other.length)
    .done(callback)
    .run(function (next, i) {
      var filename = brick.assets.other[i];
      var from = path.join(brick.dir, filename);
      var to = path.join(target, 'assets', filename);

      copyFile(from, to, function (error) {
        if (error) return callback(error);
        next();
      });
    });
}

function copyFile (from, to, callback) {
  debug('Copying %s to %s', from, to);

  fs.lstat(from, function (error, stat) {
    if (error) return callback(error);

    if (!stat.isDirectory()) {
      fs.readFile(from, function (error, buffer) {
        if (error) return callback(error);
        fs.writeFile(to, buffer.toString(), callback);
      });
      return;
    };

    debug('%s will be recursively copied', from);

    cpr(from, to, function (errors, files) {
      if (errors && errors.length) return callback(errors[0]);
      callback();
    });
  });
}

function makeDirs (target, callback) {
  debug('mkdir -p %s', target);
  mkdirp(path.join(target, 'assets'), callback);
}

function saveBundles (brick, target, callback) {
  debug('Saving all bundles into %s', target);

  saveHTML(brick, target);
  saveCSS(brick, target, function (error) {
    if (error) return callback(error);

    saveJS(brick, target, callback);
  });
}

function saveCSS (brick, target, callback) {
  var filename = path.join(target, 'assets/bundle.css');

  brick.css(function (error, css) {
    if (error) return callback(error);

    debug('Saving %s', filename);

    fs.writeFile(filename, css, callback);
  });
}

function saveJS (brick, target, callback) {
  var filename = path.join(target, 'assets/bundle.js');

  brick.js(function (error, js) {
    if (error) return callback(error);

    debug('Saving %s', filename);

    fs.writeFile(filename, js, callback);
  });
}

function saveHTML (brick, target) {
  var filename = path.join(target, 'index.html');

  debug('Saving HTML into %s', filename);

  fs.writeFile(filename, brick.html());
}
