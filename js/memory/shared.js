/**
 * Memory Match - Dữ liệu dùng chung (chữ, số, màu) và getDeck, shuffle
 */
(function (global) {
  'use strict';

  var GAME_KEY = 'memory';

  // 8 chữ cái dùng cho 8 cặp (16 thẻ)
  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'G', 'M', 'T'];

  // Số 1–8 cho 8 cặp
  var NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

  // Màu: tên + hex (8 cặp)
  var COLORS = [
    { name: 'Đỏ', hex: '#e74c3c' },
    { name: 'Xanh lá', hex: '#27ae60' },
    { name: 'Xanh dương', hex: '#3498db' },
    { name: 'Vàng', hex: '#f1c40f' },
    { name: 'Cam', hex: '#e67e22' },
    { name: 'Tím', hex: '#9b59b6' },
    { name: 'Hồng', hex: '#fd79a8' },
    { name: 'Nâu', hex: '#795548' }
  ];

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

  /**
   * Tạo bộ thẻ đã xáo cho memory.
   * Mỗi item: { pairId, content, type }
   * - pairId: id cặp (để so khớp)
   * - content: chuỗi hoặc object hiển thị (chữ/số/tên màu + hex)
   * - type: 'letters' | 'numbers' | 'colors'
   */
  function getDeck(type) {
    var pairs = [];
    var i, pairId, content;

    if (type === 'letters') {
      for (i = 0; i < LETTERS.length; i++) {
        pairId = 'L' + i;
        content = LETTERS[i];
        pairs.push({ pairId: pairId, content: content, type: 'letters' });
        pairs.push({ pairId: pairId, content: content, type: 'letters' });
      }
    } else if (type === 'numbers') {
      for (i = 0; i < NUMBERS.length; i++) {
        pairId = 'N' + i;
        content = NUMBERS[i];
        pairs.push({ pairId: pairId, content: content, type: 'numbers' });
        pairs.push({ pairId: pairId, content: content, type: 'numbers' });
      }
    } else if (type === 'colors') {
      for (i = 0; i < COLORS.length; i++) {
        pairId = 'C' + i;
        content = COLORS[i];
        pairs.push({ pairId: pairId, content: content, type: 'colors' });
        pairs.push({ pairId: pairId, content: content, type: 'colors' });
      }
    } else {
      return getDeck('letters');
    }

    return shuffle(pairs.slice());
  }

  global.MemoryShared = {
    GAME_KEY: GAME_KEY,
    getDeck: getDeck,
    shuffle: shuffle
  };
})(this);
