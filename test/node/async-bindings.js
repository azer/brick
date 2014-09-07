var test = require("prova");
var Photos = require("../fixtures/async-photos");
var fs = require("fs");
var favs = require("flickr-favorites")({
  key: '8974b9cf7bf473e056125874ad44ce0a'
});
var photos = Photos.New();

test('initializing', function (t) {
  t.plan(1);
  t.equal(photos.brick.name, 'AsyncPhotos');
});

test('building', function (t) {
  photos.brick.build('./test/fixtures/async-photos/build', function (error) {
    t.error(error);

    var o = fs.readFileSync('./test/fixtures/async-photos/build/index.html').toString();

    photos.data.forEach(function (p) {
      t.ok(o.indexOf('background-image:url(' + p.urls.medium + ')') > -1);
    });

    t.end();
  });
});
