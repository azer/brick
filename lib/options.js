var attrs = require("attrs");

module.exports = attrs({
  dir: process.cwd(),
  hostname: '0.0.0.0',
  port: 3000,
  out: undefined
});
