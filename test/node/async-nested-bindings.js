var test = require("prova");
var Photos = require("../fixtures/async-nested-photos");
var fs = require("fs");
var photos = Photos.New();

test('initializing', function (t) {
  t.plan(1);
  t.equal(photos.brick.name, 'AsyncNestedPhotos');
});

test('building', function (t) {
  photos.brick.build('./test/fixtures/async-nested-photos/build', function (error) {
    t.error(error);

    var o = fs.readFileSync('./test/fixtures/async-nested-photos/build/index.html').toString();

    photos.data.forEach(function (p) {
      t.ok(o.indexOf('background-image:url(' + p.urls.medium + ')') > -1);
    });

    t.end();

  });
});
