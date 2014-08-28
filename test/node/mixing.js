var test = require("prova");
var Yo = require("../fixtures/mixing");
var fs = require("fs");
var yo = Yo.New();

var expected = [
  '<div id="brick-yo-1" class="brick-body brick-yo brick-cover-background brick-centered">',
  '<div class="cover-background" style="background-image:url(https://farm4.staticflickr.com/3918/14722880989_35326344ae_b.jpg)"></div>',
  '<div class="cover-container centered">',
  '<div class="cover-content">yo</div>'
];

test('initializing', function (t) {
  t.plan(6);
  t.equal(yo.brick.name, 'Yo');
  t.equal(yo.brick.mixings.length, 2);
  t.equal(yo.brick.mixings[0].name, 'CoverBackground');
  t.equal(yo.brick.mixings[1].name, 'Centered');
  t.equal(yo.brick.mixings[0].bindings, yo.brick.bindings);
  t.equal(yo.brick.mixings[1].bindings, yo.brick.bindings);
});

test('building', function (t) {
  t.plan(5);

  yo.brick.build('./test/fixtures/async-photos/build', function (error) {
    t.error(error);

    var o = fs.readFileSync('./test/fixtures/async-photos/build/index.html').toString();

    expected.forEach(function (line) {
      t.ok(o.indexOf(line) > -1);
    });
  });
});
