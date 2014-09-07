var task = require("bud");
var rmrf = require("rm-rf");
var parallelly = require("parallelly");
var build = task;
var once = task.once;
var watch = task.watch;

task('test', once('test node', 'test frontend'));

task('test node', once('clean'), function (t) {
  t.exec('node test/node/simple -q')
    .then('node test/node/multiple-templates -q')
    .then('node test/node/nested-bricks -q')
    .then('node test/node/bindings -q')
    .then('node test/node/async-bindings -q')
    .then('node test/node/async-nested-bindings -q')
    .then('node test/node/bindings-with-multiple-templates -q')
    .then('node test/node/clock -q')
    .then('node test/node/mixing -q')
    .then(t.done);
});

task('test frontend', once('clean', 'fixtures'), function (t) {
  t.exec('node test/dom/simple -f test/fixtures/hello-world/build/index.html -b -l phantom -q')
    .then('node test/dom/multiple-templates -f test/fixtures/fruits/build/index.html -b -l phantom -q')
    .then('node test/dom/nested-bricks -f test/fixtures/article/build/index.html -b -l phantom -q')
    .then('node test/dom/bindings -f test/fixtures/photos/build/index.html -b -l phantom -q')
    .then('node test/dom/async-bindings -f test/fixtures/async-photos/build/index.html -b -l phantom -q')
    .then('node test/dom/async-nested-bindings -f test/fixtures/async-nested-photos/build/index.html -b -l phantom -q')
    .then('node test/dom/bindings-with-multiple-templates -f test/fixtures/photos-with-multiple-templates/build/index.html -b -l phantom -q')
    .then('node test/dom/clock -f test/fixtures/clock/build/index.html -b -l phantom -q')
    .then('node test/dom/mixing -f test/fixtures/mixing/build/index.html -b -l phantom -q')
    .then(t.done);
});

task('test simple dom', once('fixtures/hello-world'), function (t) {
  t.exec('node test/dom/simple -f test/fixtures/hello-world/build/index.html -b').then(t.done);
});

task('test multiple templates in dom', once('fixtures/fruits'), function (t) {
  t.exec('node test/dom/multiple-templates -f test/fixtures/fruits/build/index.html -b')
    .then('curl localhost:7559/restart -s')
    .then(t.done);
});

task('test nested bricks in dom', once('fixtures/article'), function (t) {
  t.exec('node test/dom/nested-bricks -f test/fixtures/article/build/index.html -b')
    .then('curl localhost:7559/restart -s')
    .then(t.done);
});

task('test bindings in dom', once('fixtures/photos'), function (t) {
  t.exec('node test/dom/bindings -f test/fixtures/photos/build/index.html -b')
    .then('curl localhost:7559/restart -s')
    .then(t.done);
});

task('test async bindings in dom', once('fixtures/async-photos'), function (t) {
  t.exec('node test/dom/async-bindings -f test/fixtures/async-photos/build/index.html -b')
    .then('curl localhost:7559/restart -s')
    .then(t.done);
});

task('test async nested bindings in dom', once('fixtures/async-nested-photos'), function (t) {
  t.exec('node test/dom/async-nested-bindings -f test/fixtures/async-nested-photos/build/index.html -b')
    .then('curl localhost:7559/restart -s')
    .then(t.done);
});

task('test bindings with multiple templates in dom', once('fixtures/photos-with-multiple-templates'), function (t) {
  t.exec('node test/dom/bindings-with-multiple-templates -f test/fixtures/photos-with-multiple-templates/build/index.html -b')
    .then('curl localhost:7559/restart -s')
    .then(t.done);
});

task('test clock in dom', once('fixtures/clock'), function (t) {
  t.exec('node test/dom/clock -f test/fixtures/clock/build/index.html -b')
    .then('curl localhost:7559/restart -s')
 .then(t.done);
});

task('test mixing in dom', once('fixtures/mixing'), function (t) {
  t.exec('node test/dom/mixing -f test/fixtures/mixing/build/index.html -b')
    .then('curl localhost:7559/restart -s')
 .then(t.done);
});

task('clean', function (t) {
  parallelly()
    .then(rmrf, ['test/fixtures/hello-world/build'])
    .then(rmrf, ['test/fixtures/fruits/build'])
    .then(rmrf, ['test/fixtures/article/build'])
    .then(rmrf, ['test/fixtures/photos/build'])
    .then(rmrf, ['test/fixtures/async-photos/build'])
    .then(rmrf, ['test/fixtures/async-nested-photos/build'])
    .then(rmrf, ['test/fixtures/photos-with-multiple-templates/build'])
    .then(rmrf, ['test/fixtures/clock/build'])
    .then(rmrf, ['test/fixtures/mixing/build'])
    .done(t.done);
});

build('fixtures', once('fixtures/hello-world', 'fixtures/fruits', 'fixtures/article', 'fixtures/photos', 'fixtures/async-photos', 'fixtures/async-nested-photos', 'fixtures/clock', 'fixtures/mixing', 'fixtures/photos-with-multiple-templates'));

build('fixtures/hello-world', watch('lib', 'node_modules', 'test/fixtures/hello-world/*.{js,css,json,html}').ignore('test/fixtures/hello-world/build/**/*'), function (b) {
  b.exec('brick build test/fixtures/hello-world test/fixtures/hello-world/build -s')
    .then('curl localhost:7559/restart -s')
    .then(b.done);
});

build('fixtures/fruits', watch('lib', 'node_modules', 'test/fixtures/fruits/index.js', 'test/fixtures/fruits/templates').ignore('test/fixtures/fruits/build/**/*'), function (b) {
  b.exec('brick build test/fixtures/fruits test/fixtures/fruits/build -s')
    .then('curl localhost:7559/restart -s')
    .then(b.done);
});

build('fixtures/article', watch('lib', 'node_modules', 'test/fixtures/article/*.*', 'test/fixtures/article/node_modules/**/*').ignore('test/fixtures/article/build/**/*'), function (b) {
  b.exec('brick build test/fixtures/article test/fixtures/article/build -s')
    .then('curl localhost:7559/restart -s')
    .then(b.done);
});

build('fixtures/photos', watch('lib', 'node_modules', 'test/fixtures/photos/*.*').ignore('test/fixtures/photos/build/**/*'), function (b) {
  rmrf('test/fixtures/photos/build', function () {
    b.exec('brick build test/fixtures/photos test/fixtures/photos/build -s')
      .then('curl localhost:7559/restart -s')
      .then(b.done);
  });
});

build('fixtures/async-photos', watch('lib', 'test/fixtures/async-photos/*.*').ignore('test/fixtures/async-photos/build/**/*'), function (b) {
  rmrf('test/fixtures/async-photos/build', function () {
    b.exec('brick build test/fixtures/async-photos test/fixtures/async-photos/build -s')
      .then('curl localhost:7559/restart -s')
      .then(b.done);
  });
});

build('fixtures/async-nested-photos', watch('lib', 'test/fixtures/async-nested-photos/*.*').ignore('test/fixtures/async-nested-photos/build/**/*'), function (b) {
  rmrf('test/fixtures/async-nested-photos/build', function () {
    b.exec('brick build test/fixtures/async-nested-photos test/fixtures/async-nested-photos/build -s')
      .then('curl localhost:7559/restart -s')
      .then(b.done);
  });
});

build('fixtures/clock', watch('lib', 'test/fixtures/clock/*.*').ignore('test/fixtures/clock/build/**/*'), function (b) {
  rmrf('test/fixtures/clock/build', function () {
    b.exec('brick build test/fixtures/clock test/fixtures/clock/build -s')
      .then('curl localhost:7559/restart -s')
      .then(b.done);
  });
});

build('fixtures/mixing', watch('lib', 'test/fixtures/mixing/*.*').ignore('test/fixtures/mixing/build/**/*'), function (b) {
  rmrf('test/fixtures/mixing/build', function () {
    b.exec('brick build test/fixtures/mixing test/fixtures/mixing/build -s')
      .then('curl localhost:7559/restart -s')
      .then(b.done);
  });
});

build('fixtures/photos-with-multiple-templates', watch('lib', 'test/fixtures/photos-with-multiple-templates/*.*').ignore('test/fixtures/photos-with-multiple-templates/build/**/*'), function (b) {
  rmrf('test/fixtures/photos-with-multiple-templates/build', function () {
    b.exec('brick build test/fixtures/photos-with-multiple-templates test/fixtures/photos-with-multiple-templates/build -s')
      .then('curl localhost:7559/restart -s')
      .then(b.done);
  });
});
