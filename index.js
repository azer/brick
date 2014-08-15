var lib = require("brick-node");
var struct = require("new-struct");

module.exports = create;

function create (methods) {
  if (typeof methods == 'function') {
    methods = {
      show: methods
    };
  }

  methods || (methods = {});

  var customNew = methods.New;
  methods.New = New;

  var Embedding = struct(methods);
  Embedding.embedsBrick = true;

  var Brick = lib.create(Embedding);
  Embedding.entry = Brick.entry;

  return Embedding;

  function New (attrs) {
    attrs || (attrs = {});

    var parent;

    if (customNew) {
      parent = customNew(attrs);
    } else {
      parent = Embedding(attrs);
    }

    parent.embedsBrick = true;

    var brickAttrs = attrs.brick || {};
    attrs.parent && (brickAttrs.parent = attrs.parent.brick);

    var brick = Brick.New(brickAttrs);
    parent.brick = brick;

    lib.setup(brick, parent);

    return parent;
  };
}
