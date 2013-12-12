var children = require("dom-children");
var newElement = require("new-element");
var format = require("new-format");
var instanceCounter = 1;

module.exports = {
  constructor: constructor,
  insert: insert,
  insertAfter: insertAfter,
  insertBefore: insertBefore,
  remove: remove
};

function constructor (brick) {
  brick.id = instanceCounter++;
  brick.element = newElement('<div id="brick-{id}">\n{stylesheet}\n{content}</div>', {
    id: brick.id,
    stylesheet: '<style type="text/css">' + brick.resources.css + '</style>',
    content: format(brick.resources.template, brick)
  });
}

function remove (brick) {
  children.remove(brick.element);
}

function insert (brick, target) {
  children.add(target, brick.element);
}

function insertAfter (brick, target, reference) {
  children.addAfter(target, brick.element, reference);
}

function insertBefore (brick, target, reference) {
  children.addBefore(target, brick.element, reference);
}
