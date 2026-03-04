/**
 * Data và helper cho game Tìm cái giống / khác (Same / Different).
 * Chữ cái, số, màu; getSameQuestion(), getDifferentQuestion().
 */
(function () {
  'use strict';

  var GAME_KEY = 'sameDifferent';

  // Chữ cái tiếng Việt (29 chữ)
  var LETTERS = [
    'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M',
    'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'
  ].map(function (letter) {
    return { value: letter, label: letter };
  });

  // Số 1–10
  var NUMBERS = [];
  for (var n = 1; n <= 10; n++) {
    NUMBERS.push({ value: String(n), label: String(n) });
  }

  // Màu: tên + hex
  var COLORS = [
    { value: 'Đỏ', label: 'Đỏ', hex: '#e53935' },
    { value: 'Xanh lá', label: 'Xanh lá', hex: '#43a047' },
    { value: 'Xanh dương', label: 'Xanh dương', hex: '#1e88e5' },
    { value: 'Vàng', label: 'Vàng', hex: '#fdd835' },
    { value: 'Cam', label: 'Cam', hex: '#fb8c00' },
    { value: 'Tím', label: 'Tím', hex: '#8e24aa' },
    { value: 'Hồng', label: 'Hồng', hex: '#ec407a' },
    { value: 'Nâu', label: 'Nâu', hex: '#6d4c41' },
    { value: 'Đen', label: 'Đen', hex: '#212121' },
    { value: 'Trắng', label: 'Trắng', hex: '#f5f5f5' }
  ];

  var TOPICS = {
    alphabet: { key: 'alphabet', data: LETTERS, labelPrefix: 'Chữ ' },
    counting: { key: 'counting', data: NUMBERS, labelPrefix: 'Số ' },
    color: { key: 'color', data: COLORS, labelPrefix: 'Màu ' }
  };

  function getTopicData(topic) {
    var t = TOPICS[topic];
    return t ? t.data.slice() : [];
  }

  function getLabelPrefix(topic) {
    var t = TOPICS[topic];
    return t ? t.labelPrefix : '';
  }

  /**
   * Lấy 1 phần tử ngẫu nhiên từ mảng, có thể loại trừ theo value.
   */
  function getRandomItem(arr, excludeValue) {
    if (!arr || arr.length === 0) return null;
    var pool = arr.filter(function (item) {
      return item.value !== excludeValue;
    });
    if (pool.length === 0) return arr[Math.floor(Math.random() * arr.length)];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Trộn mảng (Fisher–Yates).
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
   * Tìm cái giống: 1 mẫu + choices (1 giống mẫu, 2–3 khác).
   * @param {string} topic - 'alphabet' | 'counting' | 'color'
   * @returns {{ sample: object, choices: object[] }}
   */
  function getSameQuestion(topic) {
    var data = getTopicData(topic);
    if (!data.length) return { sample: null, choices: [] };
    var idx = Math.floor(Math.random() * data.length);
    var sample = data[idx];
    var others = [];
    var used = {};
    used[sample.value] = true;
    var count = Math.min(3, data.length - 1);
    while (others.length < count) {
      var other = getRandomItem(data, sample.value);
      if (!other || used[other.value]) continue;
      used[other.value] = true;
      others.push(other);
    }
    var choices = [sample].concat(others);
    return { sample: sample, choices: shuffle(choices) };
  }

  /**
   * Tìm cái khác: 3 thẻ giống nhau + 1 thẻ khác; đáp án là index của thẻ khác.
   * @param {string} topic - 'alphabet' | 'counting' | 'color'
   * @returns {{ choices: object[], correctIndex: number }}
   */
  function getDifferentQuestion(topic) {
    var data = getTopicData(topic);
    if (!data.length) return { choices: [], correctIndex: 0 };
    var sameItem = data[Math.floor(Math.random() * data.length)];
    var differentItem = getRandomItem(data, sameItem.value);
    if (!differentItem) differentItem = data[0].value === sameItem.value ? data[1] : data[0];
    // [same, same, same, different] rồi shuffle → lưu correctIndex sau khi shuffle
    var raw = [sameItem, sameItem, sameItem, differentItem];
    var shuffled = shuffle(raw);
    var correctIndex = -1;
    for (var i = 0; i < shuffled.length; i++) {
      if (shuffled[i].value !== sameItem.value) {
        correctIndex = i;
        break;
      }
    }
    if (correctIndex === -1) correctIndex = 0;
    return { choices: shuffled, correctIndex: correctIndex };
  }

  window.sameDifferentShared = {
    GAME_KEY: GAME_KEY,
    TOPICS: TOPICS,
    getTopicData: getTopicData,
    getLabelPrefix: getLabelPrefix,
    getSameQuestion: getSameQuestion,
    getDifferentQuestion: getDifferentQuestion,
    shuffle: shuffle
  };
})();
