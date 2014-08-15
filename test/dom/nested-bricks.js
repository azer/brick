var test = require("prova");

test('initializing on dom', function (t) {
  var container = document.querySelector('#brick-article-1');
  var title = document.querySelector('#brick-title-4');
  var content = document.querySelector('#brick-content-2');
  var paintings = document.querySelector('#brick-paintings-3');

  t.plan(4);

  t.equal(article.brick.name, 'Article');
  t.equal(article.brick.title, 'Article');
  t.ok(article.brick.element[0] == container);
  t.equal(article.brick.key, 'article');
  /*t.equal(article.brick.dom.id, 'brick-article-1');
  t.equal(article.brick.dom.key, 'article');*/
  /*t.equal(article.brick.embed.title.name, 'Title');
  t.equal(article.brick.embed.content.name, 'Content');
  t.equal(article.brick.embed.content.embed.paintings.name, 'Paintings');

  t.ok(article.brick.embed.title.element[0] == title);
  t.ok(article.brick.embed.content.element[0] == content);
  t.ok(article.brick.embed.content.embed.paintings.element[0] == paintings);*/
});
