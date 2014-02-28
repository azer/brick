delete require.cache[require.resolve('../../')];
delete require.cache[require.resolve('../brick')];
delete require.cache[require.resolve('./index')];

var debug = require('local-debug')('node');
var info = require("../info");

var New = require('./new');
var From = require('./from');
var Struct = require("new-struct");

var serve = require("./serve");
var render = require("./render");
var build = require('./build');
var templates = require("./templates");
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
