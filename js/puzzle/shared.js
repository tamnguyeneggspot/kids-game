/**
 * Puzzle - Danh sách ảnh (gradient hoặc URL), getImageList, GAME_KEY
 * Tái dùng ý tưởng từ plan: chữ cái, số, con vật, trái cây. Hiện dùng gradient CSS để không phụ thuộc file ảnh.
 */
(function (global) {
  'use strict';

  var GAME_KEY = 'puzzle';

  /**
   * Danh sách "ảnh" cho puzzle. Mỗi item: { id, name, type: 'gradient'|'url', css | url }
   * type 'gradient': dùng css làm background-image (mỗi mảnh dùng background-position để cắt).
   * type 'url': dùng ảnh thật — đặt file vào folder img/puzzle/ (vd: img/puzzle/meo.jpg).
   * Thêm hình con vật: thêm object { id: 'ten', name: 'Tên hiển thị', type: 'url', url: 'img/puzzle/ten.jpg' }.
   */
  var PUZZLE_IMAGES = [
    /* Hình con vật — đặt file ảnh vào KidsGame/img/puzzle/ */
    { id: 'meo', name: 'Mèo', type: 'url', url: 'img/puzzle/meo.jpg' },
    { id: 'cho', name: 'Chó', type: 'url', url: 'img/puzzle/cho.jpg' },
    { id: 'chim', name: 'Chim', type: 'url', url: 'img/puzzle/chim.jpg' },
    { id: 'tho', name: 'Thỏ', type: 'url', url: 'img/puzzle/tho.jpg' },
    { id: 'voi', name: 'Voi', type: 'url', url: 'img/puzzle/voi.jpg' }
  ];

  function getImageList() {
    return PUZZLE_IMAGES.slice();
  }

  function getImageById(id) {
    for (var i = 0; i < PUZZLE_IMAGES.length; i++) {
      if (PUZZLE_IMAGES[i].id === id) return PUZZLE_IMAGES[i];
    }
    return PUZZLE_IMAGES[0];
  }

  function getImageUrl(item) {
    if (!item) return '';
    if (item.type === 'url' && item.url) return item.url;
    return '';
  }

  /**
   * Shuffle mảng (Fisher–Yates).
   */
  function shuffle(array) {
    var i, j, t;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
    return array;
  }

  global.PuzzleShared = {
    GAME_KEY: GAME_KEY,
    PUZZLE_IMAGES: PUZZLE_IMAGES,
    getImageList: getImageList,
    getImageById: getImageById,
    getImageUrl: getImageUrl,
    shuffle: shuffle
  };
})(this);
