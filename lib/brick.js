var Struct = require("new-struct");
var isNode = require('is-node');
var nodeRequire = require;
var methods;

if (isNode) {
  methods = nodeRequire('./brick-node');
} else {
  methods = require("./brick-dom");
}

var Brick = Struct(methods);

module.exports = Brick;
