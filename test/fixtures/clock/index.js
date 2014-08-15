var Brick = require('../../../');
var leftPad = require("left-pad");
var randomColor = require("random-color");

module.exports = Brick({
  update: update,
  show: show,
  loop: loop
});

function update (clock, done) {
  var now = new Date();
  clock.hours = now.getHours();
  clock.minutes = now.getMinutes();
  clock.seconds = now.getSeconds();
  clock.color = randomColor(220, 160);
  done();
}

function loop (clock, next) {
  setTimeout(next, 1000);
}

function show (clock) {
  clock.brick.bind('.hours', leftPad(clock.hours, 2, '0'));
  clock.brick.bind('.minutes', leftPad(clock.minutes, 2, '0'));
  clock.brick.bind('.seconds', leftPad(clock.seconds, 2, '0'));
  clock.brick.bind('.clock', {
    'style': 'background-color:' + clock.color
  });
}
