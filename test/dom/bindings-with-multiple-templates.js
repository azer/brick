var test = require("prova");

test('initializing on dom', function (t) {
  var el = document.querySelector('#brick-photos-1');

  t.equal(photos.brick.name, 'Photos');
  t.equal(photos.brick.title, 'Photos');
  t.ok(photos.brick.element[0] == el);
  t.equal(photos.brick.key, 'photos');

  t.equal(photos.brick.select('.title').html(), 'my photos');

  var els = photos.brick.select('ul.photos li');

  t.equal(els.length, 50);

  els.forEach(function (el) {
    t.ok(el.getAttribute('data-title'));
    t.ok(/^https:\/\/farm\d\.staticflickr\.com/.test(el.getAttribute('href')));
    t.ok(/^https:\/\/farm\d\.staticflickr\.com/.test(el.getAttribute('data-url')));
    t.ok(/\.jpg$/.test(el.getAttribute('data-url')));
    t.equal(el.getAttribute('data-url'), el.style.backgroundImage.slice(4, -1));
  });

  t.end();
});
