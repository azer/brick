var Brick = require("../../../");
var Cover = require("cover-background");
var Centered = require("centered");

module.exports = Brick(Cover, Centered, {
  show: show,
  loop: loop
});

function loop (yo, next) {
  setTimeout(next, 1000);
}

function show (yo) {
  yo.brick.defaultTemplateName = 'cover';
  yo.brick.bind('.cover-content', 'YO');
}
