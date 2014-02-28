var debug = require("local-debug")('options');
var propertify = require("propertify");

module.exports = propertify({
  dir: process.cwd(),
  hostname: '0.0.0.0',
  port: 3000,
  out: undefined
});
