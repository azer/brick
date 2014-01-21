delete require.cache[require.resolve('../')];
delete require.cache[require.resolve('./brick')];
delete require.cache[require.resolve('./brick-node')];

var debug = require('local-debug')('node');
var info = require("./info");
var browserify = require('browserify');
var path = require("path");
var fs = require("fs");
var variableName = require("variable-name");
var categorizeFiles = require("categorize-files");
var Struct = require("new-struct");
var iter = require("iter");
var slugToTitle = require("slug-to-title");
var format = require("new-format");
var pubsub = require("pubsub");
var filenameId = require("filename-id");
var glob = require("flat-glob").sync;

var serve = require("./serve");
var build = require('./build');
var templates = require("./templates");

module.exports = {
  Extend: Extend,
  From: From,
  New: New,
  build: build,
  css: css,
  html: html,
  js: js,
  render: render,
  renderContainerHTML: renderContainerHTML,
  serve: serve
};

function Extend (object) {
  var Brick = require('./brick');
  var Child = Struct(Brick, object);
  Child.entry = module.parent.parent.parent.filename;
  Child.isBrick = true;
  return Child;
}

function From () {
  var Brick = require('./brick');
  var Child = Brick.Extend({
    New: New
  });

  var files = arguments;
  var embed;

  var i = files.length;
  var name;
  while (i--) {
    if (!files[i].isBrick) continue;
    if (!embed) embed = {};
    name = require(path.join(path.dirname(files[i].entry), 'package.json')).name;

    info('Embedding %s', name);

    embed[name] = files[i];
  }

  Child.entry = module.parent.parent.parent.filename;

  return Child;

  function New () {
    var brick = Brick.New(files, {
      entry: Child.entry
    });

    return Child.With(brick, {});
  };
}

function New (filenames, options) {
  var Brick = require('./brick');

  options || (options = {});

  var entry = options.entry || module.parent.parent.parent.filename;
  var dir = path.dirname(entry);
  var manifest = require(path.join(dir, 'package.json'));
  var name = variableName(manifest.name);
  name = name[0].toUpperCase() + name.slice(1);

  debug('Creating a new Brick from %s', entry);

  var brick = Brick({
    dir: dir,
    entry: path.basename(entry),
    manifest: manifest,
    name: name,
    title: slugToTitle(manifest.name),
    templates: {},
    onError: pubsub(),
    onReady: pubsub()
  });

  brick.assets = expandFilenames(dir, filenames);
  brick.defaultTemplateName = options.defaultTemplateName || filenameId(brick.assets.html[0]);
  brick.context = createContext(brick);

  loadTemplates(brick, function (error) {
    if (error) {
      debug('Failed to load templates. Error: %s', error);
      return brick.onError.publish(error);
    }

    var key;
    for (key in brick.templates) {
      brick.context[key] = brick.templates[key];
    }

    brick.onReady.publish();
  });

  return brick;
}

function createContext (brick) {
  var context = {
    title: brick.title
  };

  return context;
}

function css (brick, callback) {
  var buffer = '';

  iter(brick.assets.css.length)
    .done(function () {
      callback(undefined, buffer);
    })
    .run(function (next, i) {
      fs.readFile(path.join(brick.dir, brick.assets.css[i]), function (error, chunk) {
        if (error) return callback(error);
        buffer += chunk.toString();
        next();
      });
    });
}

function html (brick, callback) {
  return brick.renderContainerHTML(brick.render(brick.defaultTemplateName));
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

function loadTemplates (brick, callback) {
  var id;

  iter(brick.assets.html.length)
    .run(function (next, i) {
      fs.readFile(path.join(brick.dir, brick.assets.html[i]), function (error, buffer) {
        if (error) return callback(error);

        brick.templates[filenameId(brick.assets.html[i])] = buffer.toString();
        next();
      });
    })
    .done(function () {
      callback();
    });
}

function render (brick, name, callback) {
  var template = brick.templates[name];

  if (!template) return;

  return format(template, brick.context);
}

function renderContainerHTML (brick, content) {
  return templates['main.html']({
    title: brick.title,
    name: brick.name,
    html: content || '',
    js: templates['js.html']('/assets/bundle.js'),
    css: templates['stylesheet.html']('/assets/bundle.css'),
    after: ''
  });
}

function expandFilenames (dir, filenames) {
  filenames = Array.prototype.filter.call(filenames, function (filename) {
    return typeof filename == 'string';
  });

  filenames = filenames.map(function (filename) {
    if (filename.charAt(0) == '/') return filename;
    return path.join(dir, filename);
  });

  filenames = glob(filenames);

  filenames = filenames.map(function (filename) {
    return filename.slice(dir.length + 1);
  });

  filenames = categorizeFiles(filenames, {
    js: [], css: [], html: [], other: []
  });

  return filenames;
}
