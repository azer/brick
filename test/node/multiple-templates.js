var test = require("prova");
var request = require("request");
var concat = require("concat-stream");
var Fruits = require("../fixtures/fruits");
var fruits = Fruits.New();
var fs = require("fs");
var expectedCSS = fs.readFileSync('./test/fixtures/fruits/style.css').toString();

test('the defaultTemplate as given', function (t) {
  t.plan(1);
  t.equal(fruits.brick.defaultTemplateName, 'index');
});

/*test('serves the default template on index page', function (t) {
  var server = fruits.brick.serve(9001);

  request('http://localhost:9001', function (error, response, body) {
    t.error(error);

    t.ok(body.indexOf('<title>Fruits</title>') > -1);
    t.ok(body.indexOf('<h1>Fruits</h1>') > -1);
    t.ok(body.indexOf('<h1>green apple template</h1>') > -1);
    t.ok(body.indexOf('<h1>orange template</h1>') > -1);
    t.ok(body.indexOf('<h1>red carrot template</h1>') > -1);

    request('http://localhost:9001/assets/fruits/bundle.css', function (error, response, body) {
      t.error(error);

      t.ok(body.indexOf(expectedCSS) > -1);

      server.close();
      t.end();
    });
  });
});*/

test('builds into specified directory', function (t) {
  fruits.brick.build('./test/fixtures/fruits/build', function (error) {
    t.error(error);

    var files = fs.readdirSync('./test/fixtures/fruits/build');
    var assetFiles = fs.readdirSync('./test/fixtures/fruits/build/assets');

    fruits.brick.js().pipe(concat(function (expectedJS) {
      t.error(error);

      expectedJS = expectedJS.toString();

      var body = fs.readFileSync('./test/fixtures/fruits/build/index.html').toString();
      var js = fs.readFileSync('./test/fixtures/fruits/build/assets/fruits/bundle.js').toString();

      t.ok(fs.readFileSync('./test/fixtures/fruits/build/index.html').toString().indexOf('<title>Fruits</title>') > -1);
      t.ok(body.indexOf('<h1>Fruits</h1>') > -1);
      t.ok(body.indexOf('<h1>green apple template</h1>') > -1);
      t.ok(body.indexOf('<h1>orange template</h1>') > -1);
      t.ok(body.indexOf('<h1>red carrot template</h1>') > -1);
      t.ok(body.indexOf('<img src="assets/fruits/images/cat1.jpg" />') > -1);

      t.ok(fs.readFileSync('./test/fixtures/fruits/build/assets/fruits/bundle.css').toString().indexOf(expectedCSS) > -1);

      t.equal(js, expectedJS);
      t.ok(js.indexOf('<h1>green apple template</h1>') > -1);
      t.ok(js.indexOf('<h1>orange template</h1>') > -1);
      t.ok(js.indexOf('<h1>red carrot template</h1>') > -1);

      t.end();
    }));

  });
});
