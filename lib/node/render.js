var debug = require("local-debug")('node/render');
var format = require("new-format");
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
  return templates['main.html']({
    title: brick.title,
    name: brick.name,
    html: content || '',
    js: templates['js.html']('/assets/bundle.js'),
    css: templates['stylesheet.html']('/assets/bundle.css'),
    after: ''
  });
}
