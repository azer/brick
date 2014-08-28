var Brick = require("../../../");
var Cover = require("cover-background");
var Centered = require("centered");

module.exports = Brick(Cover, Centered, {
  show: show
});

function show (yo) {
  Cover.methods.show(yo, 'https://farm4.staticflickr.com/3918/14722880989_35326344ae_b.jpg');

  yo.brick.bind('.cover-content', 'yo');
  yo.brick.bind('.cover-container', {
    'class': 'cover-container centered'
  });
}
