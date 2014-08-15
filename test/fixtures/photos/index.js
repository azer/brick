var Brick = require("../../../");
var content = require('./photos.json');

module.exports = Brick({
  show: show,
  pick: pick
});

function show (photos) {
  var title = 'my photos';

  photos.brick.bind('.title', title);
  photos.brick.bind('.photo', content.map(function (photo) {
    return {
      ':first': {
        'alt': photo.title,
        'style': 'background-image:url(' + photo.url + ')',
        'class': 'photo' + (photo.panoramic ? ' panoramic' : ''),
        'data-url': photo.url,
        'data-title': photo.title
      }
    };
  }));

  photos.brick.on('mouseover', '.photo', photos.pick);
}

function pick (photos, event) {
  photos.brick.select('.title').html(event.target.getAttribute('data-title'));
}
