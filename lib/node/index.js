delete require.cache[require.resolve('../../')];
delete require.cache[require.resolve('../brick')];
delete require.cache[require.resolve('./index')];

var debug = require('local-debug')('node');
var info = require("../info");

var From = require('./from');

var path = require("path");
var variableName = require("variable-name");
var Struct = require("new-struct");
var slugToTitle = require("slug-to-title");
var pubsub = require("pubsub");
var filenameId = require("filename-id");

var expandFilenames = require("./expand");
var loadAssets = require("./load");

var serve = require("./serve");
var render = require("./render");
var build = require('./build');
var templates = require("./templates");
var listBrickFiles = require('./list-brick-files');
var compile = require("./compile");

module.exports = {
  Extend: Extend,
  From: From,
  New: New,
  build: build,
  css: compile.css,
  html: compile.html,
  js: compile.js,
  serve: serve,
  render: render.template
};

function Extend (object) {
  var Brick = require('../brick');
  var Child = Struct(Brick, object);
  Child.entry = module.parent.parent.parent.filename;
  Child.isBrick = true;
  return Child;
}

function New (options) {
  var Brick = require('../brick');

  options || (options = {});

  var entry = options.entry || module.parent.parent.parent.filename;
  var dir = path.dirname(entry);
  var manifest = require(path.join(dir, 'package.json'));
  var name = variableName(manifest.name);
  name = name[0].toUpperCase() + name.slice(1);

  var filenames = listBrickFiles(entry);
  var defaultTemplateName = options.defaultTemplateName || (brick.assets.html.length ? brick.assets.html[0] : '');

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
  brick.context = createContext(brick);
  brick.defaultTemplateName = filenameId(defaultTemplateName);
  brick.embed = createChildren(brick, options.embed);
  brick.source = loadAssets(brick);
  brick.templates = {};

  var key, id;
  for (key in brick.source.html) {
    id = filenameId(key);
    brick.context[id] = brick.templates[id] = brick.source.html[key];
  }

  for (key in brick.embed) {
    brick.context[key] = brick.embed[key].render;
  }

  brick.onReady.publish();

  return brick;
}

function createChildren (brick, constructors) {
  var result = {};
  var name;

  for (name in constructors) {
    debug('Creating new %s to embed in %s', name, brick.name);

    result[name.toLowerCase()] = constructors[name].New({
      parent: brick
    });
  }

  return result;
}

function createContext (brick) {
  var context = {
    title: brick.title
  };

  return context;
}
