var Brick = require('../../../');

var Fruits = Brick.Extend({
  New: New
});

module.exports = Fruits;

function New () {
  var brick = Brick.New(['templates/default.html', 'templates/*.html','style.css', 'images'], {
    defaultTemplate: 'templates/default'
  });

  return Fruits.With(brick, {});
}
