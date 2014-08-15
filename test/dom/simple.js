var test = require("prova");

test('inserting to dom', function (t) {
  t.plan(5);
  var el = document.querySelector('#brick-hello-world-1');
  t.equal(helloWorld.brick.name, 'HelloWorld');
  t.equal(helloWorld.brick.title, 'Hello World');
  t.ok(helloWorld.brick.element[0] == el);
  t.equal(helloWorld.brick.key, 'hello-world');

  var img = document.querySelector('img');
  t.ok(img.src.indexOf('assets/hello-world/images/bear.jpg') > -1);
});
