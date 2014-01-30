var prova = require("prova");
var request = require("request");
var fs = require("fs");
var describe = prova.describe;
var it = prova.it;
var beforeEach = prova.beforeEach;
var expect = prova.expect;


describe('a simple brick: ./fixtures/hello-world', function(){
  var brick;

  var HelloWorld = require("./fixtures/hello-world");

  var expectedCSS = fs.readFileSync('./test/fixtures/hello-world/style.css').toString();

  beforeEach(function () {
    brick = HelloWorld.New();
  });

  it('has name, entry, dir and manifest properties', function(){
    expect(brick.name).to.equal('HelloWorld');
    expect(brick.title).to.equal('Hello World');
    expect(brick.entry).to.equal('index.js');
    expect(brick.dir).to.match(/test\/fixtures\/hello-world$/);
    expect(brick.manifest.name).to.equal('hello-world');
  });

  it('sets the default template as first html filename', function(){
    expect(brick.defaultTemplateName).to.equal('index');
  });

  it('has the assets sources under source property', function(){
    expect(brick.source.css['style.css']).to.equal(expectedCSS);
    expect(brick.source.html['index.html']).to.equal(fs.readFileSync('./test/fixtures/hello-world/index.html').toString());
  });

  it('keeps HTML sources under templates property, with IDs', function(){
    expect(brick.source.css['style.css']).to.equal(expectedCSS);
  });

  /*it('publishes from onError when an error occurs', function(done){
    var failing = require('./fixtures/failing').New();

    failing.onError(function (error) {
      expect(error).to.exist;
      done();
    });
  });*/

  it('has a method to get browserify bundle', function(done){
    brick.js(function (error, js) {
      if (error) return done(error);
      done();
    });
  });

  it('has a method to get CSS bundle', function(done){
    brick.css(function (error, css) {
      if (error) return done(error);

      expect(css).to.contain(expectedCSS);
      done();
    });
  });

  it('can serve the brick to given hostname and port', function(done){
    var server = brick.serve(9001);

    request('http://localhost:9001', function (error, response, body) {
      if (error) return done(error);

      expect(body).to.contain('<title>Hello World</title>');
      expect(body).to.contain('<h1>Hello world!</h1>');

      request('http://localhost:9001/assets/bundle.css', function (error, response, body) {
        if (error) return done(error);

        expect(body).to.contain(expectedCSS);

        server.close();
        done();
      });
    });
  });

  it('can output the brick into given directory', function(done){
    brick.build('./test/fixtures/hello-world/build', function (error) {
      if (error) return done(error);

      var files = fs.readdirSync('./test/fixtures/hello-world/build');
      var assetFiles = fs.readdirSync('./test/fixtures/hello-world/build/assets');
      var imageFiles = fs.readdirSync('./test/fixtures/hello-world/build/assets/images');

      brick.js(function (error, expectedJS) {
        if (error) return done(error);

        expect(fs.readFileSync('./test/fixtures/hello-world/build/index.html').toString()).to.contain('<title>Hello World</title>');
        expect(fs.readFileSync('./test/fixtures/hello-world/build/index.html').toString()).to.contain('<h1>Hello world!</h1>');
        expect(fs.readFileSync('./test/fixtures/hello-world/build/assets/bundle.css').toString()).to.contain(expectedCSS);
        expect(fs.readFileSync('./test/fixtures/hello-world/build/assets/bundle.js').toString()).to.equal(expectedJS);
        expect(files).to.deep.equal(['assets', 'index.html']);
        expect(assetFiles).to.deep.equal(['bundle.css', 'bundle.js', 'images']);
        expect(imageFiles).to.deep.equal(['bear.jpg', 'neko.jpg']);

        done();
      });
    });
  });

});

describe('a brick with multiple templates: fruits', function () {
  var brick;

  var Fruits = require("./fixtures/fruits");
  var expectedCSS = fs.readFileSync('./test/fixtures/fruits/style.css').toString();

  beforeEach(function () {
    brick = Fruits.New();
  });

  it('sets the defaultTemplate as given', function(){
    expect(brick.defaultTemplateName).to.equal('templates/default');
  });

  it('renders the specified template by default', function (done) {
    var server = brick.serve(9001);

    request('http://localhost:9001', function (error, response, body) {
      if (error) return done(error);

      expect(body).to.contain('<title>Fruits</title>');
      expect(body).to.contain('<h1>Fruits</h1>');
      expect(body).to.contain('<h1>green apple template</h1>');
      expect(body).to.contain('<h1>orange template</h1>');
      expect(body).to.contain('<h1>red carrot template</h1>');

      request('http://localhost:9001/assets/bundle.css', function (error, response, body) {
        if (error) return done(error);

        expect(body).to.contain(expectedCSS);

        server.close();
        done();
      });
    });
  });

  it('builds into specified directory', function(done){
    brick.build('./test/fixtures/fruits/build', function (error) {
      if (error) return done(error);

      var files = fs.readdirSync('./test/fixtures/fruits/build');
      var assetFiles = fs.readdirSync('./test/fixtures/fruits/build/assets');

      brick.js(function (error, expectedJS) {
        if (error) return done(error);

        expectedJS = expectedJS.toString();

        var body = fs.readFileSync('./test/fixtures/fruits/build/index.html').toString();
        var js = fs.readFileSync('./test/fixtures/fruits/build/assets/bundle.js').toString();

        expect(fs.readFileSync('./test/fixtures/fruits/build/index.html').toString()).to.contain('<title>Fruits</title>');
        expect(body).to.contain('<h1>Fruits</h1>');
        expect(body).to.contain('<h1>green apple template</h1>');
        expect(body).to.contain('<h1>orange template</h1>');
        expect(body).to.contain('<h1>red carrot template</h1>');
        expect(fs.readFileSync('./test/fixtures/fruits/build/assets/bundle.css').toString()).to.contain(expectedCSS);
        expect(js).to.equal(expectedJS);
        expect(js).to.contain('<h1>green apple template</h1>');
        expect(js).to.contain('<h1>orange template</h1>');
        expect(js).to.contain('<h1>red carrot template</h1>');

        done();
      });

    });
  });

});

describe('a brick can embed other bricks: article', function(){

  var brick;

  var Article = require('./fixtures/article');

  beforeEach(function(){
    brick = Article.New();
  });

  it('creates instances of the embeded bricks automatically', function(){
    expect(brick.name).to.equal('Article');
    expect(brick.embed.title.name).to.equal('Title');
    expect(brick.embed.content.name).to.equal('Content');
  });

  it('serves', function(done){
    brick.serve(9001);
  });

});
