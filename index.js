var lib = require("brick-node");
var struct = require("new-struct");

module.exports = define;

function define () {
  var mixing, methods;

  if (arguments.length < 2) {
    methods = arguments[0];
  } else {
    mixing = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    methods = arguments[arguments.length - 1];
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
