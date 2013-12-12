var fs = require("fs");
var path = require("path");
var format = require("new-format");

module.exports = {};

template('main.html');
template('stylesheet.html');
template('entry.js');

function template (name) {
  var content = fs.readFileSync(path.join(__filename, '../../templates/' + name));

  module.exports[name] = function (vars) {
    return format(content, vars);
  };
}
