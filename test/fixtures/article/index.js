var Brick = require('../../../');
var Title = require('title');
var Content = require('content');

module.exports = Brick(function (article) {
  article.brick.bind({
    '.title': Title.New(),
    '.content': Content.New()
  });
});
