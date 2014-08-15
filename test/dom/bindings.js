var test = require("prova");
var content = require('../fixtures/photos/photos.json');

test('initializing on dom', function (t) {
  var el = document.querySelector('#brick-photos-1');

  t.plan(24);
  t.equal(photos.brick.name, 'Photos');
  t.equal(photos.brick.title, 'Photos');

  photos.brick.onReady(function () {
    t.ok(photos.brick.element[0] == el);
    t.equal(photos.brick.key, 'photos');

    t.equal(photos.brick.select('.title').html(), 'my photos');

    var els = photos.brick.select('li');
    t.equal(els.length, 6);

    content.forEach(function (row, ind) {
      var el = els[ind];
      t.equal(el.style.backgroundImage, 'url(' + row.url + ')');
      t.equal(el.getAttribute('alt'), row.title);
      t.equal(el.getAttribute('data-url'), row.url);
    });
  });
});
