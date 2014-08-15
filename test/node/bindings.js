var test = require("prova");
var Photos = require("../fixtures/photos");
var fs = require("fs");
var photos = Photos.New();

var expectedHTML = [
  { title: 'crater lake', url: 'https://farm3.staticflickr.com/2907/14080917237_50ecd26669_b.jpg' },
  { title: 'kaputas', url: 'http://farm4.staticflickr.com/3768/9733101437_9ea50823b4.jpg' },
  { title: 'kids', url: 'http://farm4.staticflickr.com/3767/12186285805_0578a0db1f.jpg' },
  { title: 'me swimming', url: 'http://farm7.staticflickr.com/6087/6119944694_f87f38c438.jpg' },
  { title: 'hasankeyf', url: 'http://farm8.staticflickr.com/7323/11687458044_67afcdf51c_c.jpg' }
].map(function (o) {
  return '<img class="photo" alt="'+o.title+'" src="'+o.url+'" />';
}).join('');

test('initializing', function (t) {
  t.plan(1);
  t.equal(photos.brick.name, 'Photos');
});

test('building', function (t) {
  t.plan(2);

  photos.brick.build('./test/fixtures/photos/build', function (error) {
    t.error(error);
    t.ok(fs.readFileSync('./test/fixtures/photos/build/index.html').toString().indexOf(expectedHTML));
  });
});
