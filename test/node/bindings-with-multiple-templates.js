var test = require("prova");
var Photos = require("../fixtures/photos-with-multiple-templates");
var data = require("../fixtures/photos/photos.json");
var fs = require("fs");
var photos = Photos.New();

test('initializing', function (t) {
  t.plan(1);
  t.equal(photos.brick.name, 'Photos');
});

test('building', function (t) {
  photos.brick.build('./test/fixtures/photos-with-multiple-templates/build', function (error) {
    t.error(error);

    var o = fs.readFileSync('./test/fixtures/photos-with-multiple-templates/build/index.html').toString();

    photos.data.forEach(function (p) {
      t.ok(o.indexOf('background-image:url(' + p.urls.medium + ')') > -1);
    });

    t.end();
  });
});
