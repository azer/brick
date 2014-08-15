var test = require("prova");

test('initializing on dom', function (t) {
  var el = document.querySelector('#brick-clock-1');

  t.plan(4);

  t.equal(clock.brick.name, 'Clock');
  t.equal(clock.brick.title, 'Clock');
  t.ok(clock.brick.element[0] == el);
  t.equal(clock.brick.key, 'clock');
});

test('loop', function (t) {
  t.plan(3);

  var last = document.querySelector('.content').innerHTML;

  setTimeout(verify, 1000);
  setTimeout(verify, 2000);
  setTimeout(verify, 3000);

  function verify () {
    var now = document.querySelector('.content').innerHTML;
    t.notEqual(now, last);
  }

});
