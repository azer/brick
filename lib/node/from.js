delete require.cache[require.resolve('./from')];

var path = require("path");
var info = require("../info");

module.exports = From;

function From () {
  var Brick = require('../brick');
  var Child = Brick.Extend({
    New: New
  });

  var defaultTemplateName = arguments[arguments.length - 1];
  var entry = module.parent.parent.parent.parent.filename;
  var embed = filterBricks(arguments);

  Child.entry = entry;

  return Child;

  function New (options) {
    var brick = Brick.New({
      entry: Child.entry,
      defaultTemplateName: defaultTemplateName,
      embed: embed,
      parent: options && options.parent
    });

    return Child.With(brick, {});
  };
}

function filterBricks (arr) {
  var result = {};

  var i = arr.length;
  var name;

  while (i--) {
    if (!arr[i].isBrick) continue;
    if (!result) result = {};
    name = require(path.join(path.dirname(arr[i].entry), 'package.json')).name;

    info('Embedding %s', name);

    result[name] = arr[i];
  }

  return result;
}
