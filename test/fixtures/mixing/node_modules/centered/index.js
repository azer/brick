var Brick = require("../../../../../");

module.exports = Brick({
  show: show
});

function show (cover, url) {
  cover.brick.defaultTemplateName = 'cover';

  if (!url) return;

  cover.brick.bind('.cover-background', {
    'style': 'background-image:url(' + url + ')'
  });
}
