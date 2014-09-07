var lib = require("brick-node");
var struct = require("new-struct");

module.exports = define;

function define () {
  var mixing, methods, sliceIndex;

  if (arguments.length) {
    sliceIndex = arguments[arguments.length - 1].embedsBrick ? 0 : 1;
    mixing = Array.prototype.slice.call(arguments, 0, arguments.length - sliceIndex);
    methods = arguments[arguments.length - sliceIndex];
  }

  if (typeof methods == 'function') {
    methods = {
      show: methods
    };
  }

  methods || (methods = {});

  var FactoryFn = methods.New;
  methods.New = New;

  var Embedding;

  if (mixing && mixing.length) {
    Embedding = struct.apply(undefined, mixing.concat(methods));
  } else {
    Embedding = struct(methods);
  }

  Embedding.embedsBrick = true;

  var Brick = lib.create(Embedding, mixing);
  Embedding.entry = Brick.entry;

  return Embedding;

  function New (attrs) {
    attrs || (attrs = {});

    var parent;

    if (FactoryFn) {
      parent = FactoryFn(attrs);
    } else {
      parent = Embedding(attrs);
    }

    parent.embedsBrick = true;

    var brickAttrs = attrs.brick || {};

    attrs.parent && (brickAttrs.parent = attrs.parent.brick);
    mixing && (brickAttrs.mixing = mixing);

    brickAttrs.wrapper = parent;

    var brick = Brick.New(brickAttrs);
    parent.brick = brick;

    lib.setup(brick, parent);

    return parent;
  };
}
