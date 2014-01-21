var debug = require("local-debug")('options');
var attrs = require("attrs");

module.exports = attrs({
  dir: process.cwd(),
  hostname: '0.0.0.0',
  port: 3000,
  out: undefined
});

/*module.exports.dir.setter(function (value) {
  if (value.slice(0, 2) != '.') {
    value = './' + value;
  }

  debug('Brick directory is set to %s', value);

  return value;
});*/
