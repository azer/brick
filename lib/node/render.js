var debug = require("local-debug")('node/render');
var format = require("new-format");
var path = require("path");
var templates = require("./templates");

module.exports = {
  template: template,
  container: container
};

function template (brick, name) {
  var template = brick.templates[name];
  if (!template) return;

  debug('Rendering %s', name);

  return format(template, brick.context);
}

function container (brick, content) {
  var vars = {
    title: brick.title,
    name: brick.name,
    html: content || '',
    js: templates['js.html'](path.join(brick.assetsDir, 'bundle.js')),
    css: templates['stylesheet.html'](path.join(brick.assetsDir, 'bundle.css')),
    after: ''
  };

  return templates['main.html'](vars);
}
