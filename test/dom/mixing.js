var test = require("prova");

test('initializing on dom', function (t) {
  var el = document.querySelector('#brick-yo-1');

  t.plan(8);
  t.equal(yo.brick.name, 'Yo');
  t.equal(yo.brick.title, 'Yo');

  yo.brick.onReady(function () {
    t.ok(yo.brick.element[0] == el);
    t.equal(yo.brick.mixings.length, 2);
    t.ok(yo.brick.mixings[0].element[0] == el);
    t.ok(yo.brick.mixings[1].element[0] == el);
    t.equal(yo.brick.key, 'yo');
    t.equal(yo.brick.select('.cover-content').html(), 'yo');
  });
});
