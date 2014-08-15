var test = require("prova");

test('initializing on dom', function (t) {
  var el = document.querySelector('#brick-fruits-1');

  var apple = '<div class="apple green">\n  <h1>green apple template</h1>\n</div>\n';

  t.plan(12);
  t.equal(fruits.brick.name, 'Fruits');
  t.equal(fruits.brick.title, 'Fruits');
  t.ok(fruits.brick.element[0] == el);
  t.equal(fruits.brick.key, 'fruits');
  t.ok(fruits.brick.source.html['templates/orange.html']);
  t.ok(fruits.brick.source.html['templates/carrot.html']);
  t.ok(fruits.brick.source.html['templates/cats.html']);
  t.equal(fruits.brick.source.html['templates/apple.html'], apple);

  t.ok(fruits.brick.templates['templates/orange']);
  t.ok(fruits.brick.templates['templates/carrot']);
  t.ok(fruits.brick.templates['templates/cats']);

  t.equal(fruits.brick.templates['templates/apple'](), apple);
});
