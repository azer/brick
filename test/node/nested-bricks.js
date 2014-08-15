var test = require("prova");
var request = require("request");
var fs = require("fs");
var concat = require("concat-stream");
var Article = require("../fixtures/article");
var article = Article.New();

test('objects', function (t) {
  t.plan(5);

  t.equal(article.brick.name, 'Article');

  article.brick.onReady(function () {
    t.equal(article.brick.attachments.title.length, 1);
    t.equal(article.brick.attachments.title[0].name, 'Title');
    t.equal(article.brick.attachments.content.length, 1);
    t.equal(article.brick.attachments.content[0].name, 'Content');
  });
});

test('serving', function (t) {
  var server = article.brick.serve(9001);

  request('http://localhost:9001', function (error, response, body) {
    t.error(error);
    t.ok(body.indexOf('<h1>On the Genealogy of Morals</h1>') > -1);
    t.ok(body.indexOf('At this point') > -1);
    t.ok(body.indexOf('as it were, subterranean gratifications') > -1);

    t.ok(body.indexOf('<div class="paintings">') > -1);

    request('http://localhost:9001/assets/article/bundle.css', function (error, response, body) {
      t.error(error);
      t.ok(body.indexOf('url(../paintings/tortoise.jpg)') > -1);
      t.ok(body.indexOf('../content/gentium.woff') > -1);

      request('http://localhost:9001/assets/paintings/tortoise.jpg', function (error, response, body) {
        t.error(error);
        server.close();
        t.end();
      });

    });
  });
});

test('building', function (t) {
  article.brick.build('./test/fixtures/article/build', function (error) {
    t.error(error);
    var files = fs.readdirSync('./test/fixtures/article/build');
    var assetFiles = fs.readdirSync('./test/fixtures/article/build/assets');

    t.deepEqual(assetFiles, ['article', 'content', 'paintings', 'title']);

    article.brick.js().pipe(concat(function (expectedJS) {
      t.error(error);

      article.brick.css().pipe(concat(function (expectedCSS) {

        expectedJS = expectedJS.toString();
        expectedCSS = expectedCSS.toString();

        var body = fs.readFileSync('./test/fixtures/article/build/index.html').toString();
        var js = fs.readFileSync('./test/fixtures/article/build/assets/article/bundle.js').toString();

        t.ok(fs.readFileSync('./test/fixtures/article/build/index.html').toString().indexOf('<title>Article</title>') > -1);
        t.ok(body.indexOf('<h1>On the Genealogy of Morals</h1>') > -1);
        t.ok(body.indexOf('<h2>Friedrich Nietzsche</h2>') > -1);
        t.ok(body.indexOf('<div class="content">') > -1);
        t.ok(body.indexOf('<img src="assets/paintings/fo.jpeg" />') > -1);
        t.equal(js, expectedJS);
        t.end();

        /*process.nextTick(function () {
          //t.ok(fs.readFileSync('./test/fixtures/article/build/assets/article/bundle.css').toString().indexOf(expectedCSS.toString()) > -1);
          t.end();
        });*/

      }));
    }));
  });
});
