var test = require("prova");
var Photos = require("../fixtures/photos");
var data = require("../fixtures/photos/photos.json");
var fs = require("fs");
var photos = Photos.New();

var expectedHTML = data.map(function (o) {
  var cls = 'photo';

  if (o.panoramic) cls += ' panoramic';

  return '<li class="' + cls + '" alt="'+o.title+'" style="background-image:url('+o.url+')" data-url="' + o.url + '" data-title="' + o.title + '"></li>';
}).join('');

test('initializing', function (t) {
  t.plan(1);
  t.equal(photos.brick.name, 'Photos');
});

test('building', function (t) {
  t.plan(2);

  photos.brick.build('./test/fixtures/photos/build', function (error) {
    t.error(error);
    t.ok(fs.readFileSync('./test/fixtures/photos/build/index.html').toString().indexOf(expectedHTML) > -1);
  });
});
