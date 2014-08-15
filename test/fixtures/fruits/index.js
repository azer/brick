var Brick = require('../../../');

module.exports = Brick(function (fruits) {
  fruits.brick.bind({
    '.apple':  fruits.brick.templates['templates/apple'],
    '.carrot': fruits.brick.templates['templates/carrot'],
    '.orange': fruits.brick.templates['templates/orange'],
    '.cats': fruits.brick.templates['templates/cats']
  });
});
