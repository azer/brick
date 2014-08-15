var test = require("prova");

test('initializing on dom', function (t) {
  var el = document.querySelector('#brick-async-nested-photos-1');

  t.equal(asyncNestedPhotos.brick.name, 'AsyncNestedPhotos');
  t.equal(asyncNestedPhotos.brick.title, 'Async Nested Photos');
  t.equal(asyncNestedPhotos.brick.key, 'async-nested-photos');

  asyncNestedPhotos.brick.onReady(function () {
    t.equal(asyncNestedPhotos.brick.select('.title').html(), 'my favorite photos');

    var els = asyncNestedPhotos.brick.select('ul.photos li a');

    t.equal(els.length, 50);

    t.ok(asyncNestedPhotos.brick.element[0] == el);

    els.forEach(function (el, i) {
      t.ok(el.getAttribute('data-title'));
      t.ok(/^https:\/\/farm\d\.staticflickr\.com/.test(el.getAttribute('href')));
      t.ok(/^https:\/\/farm\d\.staticflickr\.com/.test(el.getAttribute('data-url')));
      t.ok(/\.jpg$/.test(el.getAttribute('data-url')));

      t.equal(el.querySelector('label').innerHTML, el.getAttribute('data-title'));
    });

    t.end();
  });
});
