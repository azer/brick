var test = require("prova");

test('initializing on dom', function (t) {
  var el = document.querySelector('#brick-async-photos-1');

  t.equal(asyncPhotos.brick.name, 'AsyncPhotos');
  t.equal(asyncPhotos.brick.title, 'Async Photos');
  t.ok(asyncPhotos.brick.element[0] == el);
  t.equal(asyncPhotos.brick.key, 'async-photos');

  t.equal(asyncPhotos.brick.select('.title').html(), 'my photos');

  var els = asyncPhotos.brick.select('ul.photos li a');

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
