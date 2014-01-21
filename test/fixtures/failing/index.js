delete require.cache;
var Brick = require('../../../');

var brick = Brick.From('index.html',
                       'style.css',
                       'images');

module.exports = brick;
