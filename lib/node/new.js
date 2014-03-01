var debug = require("local-debug")('node/new');
var path = require("path");
var variableName = require("variable-name");
var slugToTitle = require("slug-to-title");
var pubsub = require("pubsub");
var filenameId = require("filename-id");

var loadAssets = require("./load");
var listBrickFiles = require('./list-brick-files');
var expandFilenames = require("./expand");

module.exports = New;

function New (options) {
  var Brick = require('../brick');

  options || (options = {});

  var entry = options.entry || module.parent.parent.parent.filename;
  var dir = path.dirname(entry);
  var manifest = require(path.join(dir, 'package.json'));
  var key = manifest.name;
  var name = variableName(key);
  name = name[0].toUpperCase() + name.slice(1);

  var filenames = listBrickFiles(entry);
  var defaultTemplateName = options.defaultTemplateName || (brick.assets.html.length ? brick.assets.html[0] : '');

  debug('Creating a new Brick from %s', entry);

  var brick = Brick({
    dir: dir,
    entry: path.basename(entry),
    manifest: manifest,
    key: key,
    name: name,
    title: slugToTitle(manifest.name),
    templates: {},
    onError: pubsub(),
    onReady: pubsub()
  });

  brick.parent = options.parent;
  brick.index = brick.parent ? brick.parent.index : {};
  brick.index[brick.key] = brick;
  brick.assets = expandFilenames(dir, filenames);
  brick.assetsDir = '/assets/' + brick.key;
  brick.embed = createChildren(brick, options.embed);
  brick.context = createContext(brick);
  brick.defaultTemplateName = filenameId(defaultTemplateName);
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
    'assets-dir': brick.assetsDir,
    title: brick.title
  };

  var child;
  for (child in brick.embed) {
    context['embed.' + child] = brick.embed[child].render(brick.embed[child].defaultTemplateName);
  }

  return context;
}
