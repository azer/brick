var methodify = require("methodify");
var isNode = require('is-node');
var nodeRequire = require;
var methods;

if (isNode) {
  methods = nodeRequire('./brick-node');
} else {
  methods = require("./brick-dom");
}

module.exports = Brick;

function Brick () {
  var args = Array.prototype.slice.call(arguments);

  if (typeof args[args.length - 1] == 'string') {
    args.push({});
  }

  var resources = constructor.resources =  args.slice(0, args.length - 1);
  var options = args[args.length - 1];

  return constructor;

  function constructor (struct) {
    struct || (struct = {});
    struct.resources = resources;
    methodify(struct, options, methods);
    struct.constructor && struct.constructor();
    return struct;
  }
}
