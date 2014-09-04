var test = require("prova");
var fs = require("fs");
var request = require("request");
var glob = require("glob");
var concat = require("concat-stream");
var HelloWorld = require("../fixtures/hello-world");
var hw = HelloWorld.New();

var expectedCSS = fs.readFileSync('./test/fixtures/hello-world/style.css').toString();
var expectedHTML = fs.readFileSync('./test/fixtures/hello-world/index.html').toString().replace('images', 'assets/hello-world/images');

test('name, entry, dir and manifest properties', function (t) {
  t.plan(5);
  t.equal(hw.brick.name, 'HelloWorld');
  t.equal(hw.brick.title, 'Hello World');
  t.equal(hw.brick.entry, 'index.js');
  t.ok(/test\/fixtures\/hello-world$/.test(hw.brick.dir));
  t.equal(hw.brick.manifest.name, 'hello-world');
});

test('the default template as first html filename', function (t) {
  t.plan(1);
  t.equal(hw.brick.defaultTemplate(), 'index');
});

test('the assets sources under source property (html)', function (t) {
  t.plan(1);
  hw.brick.source.html['index.html']().pipe(concat(function (html) {
    t.equal(html.toString(), expectedHTML);
  }));
});

test('the assets sources under source property (css)', function (t) {
  t.plan(1);
  hw.brick.source.css['style.css']().pipe(concat(function (css) {
    t.equal(css.toString(), expectedCSS + "\n");
  }));
});

//test('publishes from onError when an error occurs', function (t) {
//  var failing = require('./fixtures/failing').New();

//  failing.onError(function (error) {
//    t.ok(error);
//    t.end();
//  });
//});

test('rendering html', function (t) {
  t.plan(3);

  hw.brick.html().pipe(concat(function (html) {
    t.ok(html.indexOf('div class="hello-world"') > -1);
    t.ok(html.indexOf('This is an example brick') > -1);
    t.ok(html.indexOf('assets/hello-world/images/bear.jpg') > -1);
  }));
});

/*test('can serve the brick to given hostname and port', function (t) {
  var server = hw.brick.serve(9001);

  request('http://localhost:9001', function (error, response, body) {
    t.error(error);

    t.ok(body.indexOf('<title>Hello World</title>') > -1);
    t.ok(body.indexOf('<h1>Hello world!</h1>') > -1);

    request('http://localhost:9001/assets/hello-world/bundle.css', function (error, response, body) {
      t.error(error);

      t.ok(body.indexOf(expectedCSS) > -1);

      server.close();
      t.end();
    });
  });
});*/

test('can output the brick into given directory', function (t) {
  hw.brick.build('./test/fixtures/hello-world/build', function (error) {
    t.error(error);

    var files = fs.readdirSync('./test/fixtures/hello-world/build');
    var assetFiles = glob.sync('./test/fixtures/hello-world/build/assets/**/*');
    var initJS = 'var helloWorld = HelloWorld.New({ brick: { dom: {"key":"hello-world","id":["'+hw.brick.id+'"]} } });';

    hw.brick.js().pipe(concat(function (expectedJS) {
      t.error(error);

      t.ok(fs.readFileSync('./test/fixtures/hello-world/build/index.html').toString().indexOf('<title>Hello World</title>') > -1);
      t.ok(fs.readFileSync('./test/fixtures/hello-world/build/index.html').toString().indexOf('<h1>Hello world!</h1>') > -1);
      t.ok(fs.readFileSync('./test/fixtures/hello-world/build/index.html').toString().indexOf(initJS) > -1);
      t.ok(fs.readFileSync('./test/fixtures/hello-world/build/assets/hello-world/bundle.css').toString().indexOf(expectedCSS) > -1);

      var js = fs.readFileSync('./test/fixtures/hello-world/build/assets/hello-world/bundle.js').toString();
      t.equal(js, expectedJS.toString());
      t.ok(js.indexOf('var Brick = require') > -1);
      t.ok(js.indexOf('var domquery = require("domquery");') > -1);

      t.deepEqual(files, ['assets', 'index.html']);
      t.deepEqual(assetFiles, ["./test/fixtures/hello-world/build/assets/hello-world", "./test/fixtures/hello-world/build/assets/hello-world/bundle.css", "./test/fixtures/hello-world/build/assets/hello-world/bundle.js", "./test/fixtures/hello-world/build/assets/hello-world/images", "./test/fixtures/hello-world/build/assets/hello-world/images/bear.jpg","./test/fixtures/hello-world/build/assets/hello-world/images/neko.jpg"]);

      t.end();
    }));
  });
});
