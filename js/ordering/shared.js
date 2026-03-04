/**
 * Data và helper cho game Sắp xếp theo thứ tự (Ordering).
 * Số 1–10, Chữ A–Z (29 chữ tiếng Việt). getTopicData, shuffle, isOrderCorrect.
 */
(function () {
  'use strict';

  var GAME_KEY = 'ordering';

  // Số 1–10 (mỗi item: { value, label })
  var NUMBERS_1_10 = [];
  for (var n = 1; n <= 10; n++) {
    var s = String(n);
    NUMBERS_1_10.push({ value: s, label: s });
  }

  // Chữ cái tiếng Việt (29 chữ) A→Z
  var LETTERS_A_Z = [
    'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M',
    'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'
  ].map(function (letter) {
    return { value: letter, label: letter };
  });

  var TOPICS = {
    numbers: { key: 'numbers', data: NUMBERS_1_10, labelPrefix: 'Số ' },
    letters: { key: 'letters', data: LETTERS_A_Z, labelPrefix: 'Chữ ' }
  };

  /**
   * Lấy mảng item theo chủ đề (bản copy để không sửa gốc).
   * @param {string} topic - 'numbers' | 'letters'
   * @returns {Array<{value: string, label: string}>}
   */
  function getTopicData(topic) {
    var t = TOPICS[topic];
    return t ? t.data.slice() : [];
  }

  /**
   * Lấy prefix cho aria-label (Số 1, Chữ A).
   */
  function getLabelPrefix(topic) {
    var t = TOPICS[topic];
    return t ? t.labelPrefix : '';
  }

  /**
   * Trộn mảng (Fisher–Yates).
   * @param {Array} arr
   * @returns {Array}
   */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  /**
   * Kiểm tra dãy đã đặt có đúng thứ tự chuẩn không.
   * @param {Array<{value: string}>} placed - mảng item đã đặt theo thứ tự
   * @param {string} topic - 'numbers' | 'letters'
   * @returns {boolean}
   */
  function isOrderCorrect(placed, topic) {
    var standard = getTopicData(topic);
    if (placed.length !== standard.length) return false;
    for (var i = 0; i < placed.length; i++) {
      if (placed[i].value !== standard[i].value) return false;
    }
    return true;
  }

  window.orderingShared = {
    GAME_KEY: GAME_KEY,
    getTopicData: getTopicData,
    getLabelPrefix: getLabelPrefix,
    shuffle: shuffle,
    isOrderCorrect: isOrderCorrect,
    TOPICS: TOPICS
  };
})();
