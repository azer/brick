var test = require("prova");
var request = require("request");
var fs = require("fs");
var concat = require("concat-stream");
var Clock = require("../fixtures/clock");
var clock = Clock.New();

test('objects', function (t) {
  t.plan(1);
  t.equal(clock.brick.name, 'Clock');
});

test('build', function (t) {
  t.plan(9);

  clock.brick.build('./test/fixtures/clock/build', function (error) {
    t.error(error);

    var html = fs.readFileSync('./test/fixtures/clock/build/index.html').toString();

    t.ok(html.indexOf('<span class="hours">') > -1);
    t.ok(html.indexOf('<span class="minutes">') > -1);
    t.ok(html.indexOf('<span class="seconds">') > -1);

    t.ok(/hours">\d+/.test(html));
    t.ok(/minutes">/.test(html));
    t.ok(/seconds">\d+/.test(html));

    var css = fs.readFileSync('./test/fixtures/clock/build/assets/clock/bundle.css').toString();
    var fonts = fs.readFileSync('./test/fixtures/clock/fonts.css').toString();
    var style = fs.readFileSync('./test/fixtures/clock/style.css').toString();

    t.ok(css.indexOf(fonts) > -1);
    t.ok(css.indexOf(style) > -1);
  });
});
