/**
 * Data và helper cho game Nghe và chọn (Listen & tap).
 * Chữ cái, số, màu — dùng chung cấu trúc { value, label } (màu thêm hex).
 * Audio: phát bằng Speech Synthesis trong main.js (không cần audioUrl).
 */
(function () {
  'use strict';

  var GAME_KEY = 'listenTap';

  // Chữ cái tiếng Việt (29 chữ)
  var ALPHABET = [
    'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M',
    'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'
  ].map(function (letter) {
    return { value: letter, label: letter };
  });

  // Số 1–10
  var COUNTING = [];
  for (var n = 1; n <= 10; n++) {
    COUNTING.push({ value: String(n), label: String(n) });
  }

  // Màu: tên (để phát âm) + hex (để hiện ô màu)
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
    alphabet: { key: 'alphabet', data: ALPHABET, labelPrefix: 'Chữ ' },
    counting: { key: 'counting', data: COUNTING, labelPrefix: 'Số ' },
    color: { key: 'color', data: COLORS, labelPrefix: 'Màu ' }
  };

  /**
   * Lấy mảng item theo chủ đề. Mỗi item: { value, label } hoặc { value, label, hex }.
   * @param {string} topic - 'alphabet' | 'counting' | 'color'
   * @returns {Array<{value: string, label: string, hex?: string}>}
   */
  function getTopicData(topic) {
    var t = TOPICS[topic];
    return t ? t.data.slice() : [];
  }

  /**
   * Lấy prefix để đọc cho screen reader (Chữ A, Số 5, Màu đỏ).
   */
  function getLabelPrefix(topic) {
    var t = TOPICS[topic];
    return t ? t.labelPrefix : '';
  }

  /**
   * Lấy 1 phần tử ngẫu nhiên từ mảng, có thể loại trừ 1 phần tử.
   * @param {Array} arr
   * @param {*} exclude - item cần loại (so sánh theo value)
   * @returns {*}
   */
  function getRandomItem(arr, exclude) {
    if (!arr || arr.length === 0) return null;
    var excludeValue = exclude && exclude.value !== undefined ? exclude.value : exclude;
    var pool = arr.filter(function (item) {
      return item.value !== excludeValue;
    });
    if (pool.length === 0) return arr[Math.floor(Math.random() * arr.length)];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Lấy N lựa chọn sai (khác correctItem), không trùng nhau.
   * @param {Object} correctItem - item đúng
   * @param {string} topic
   * @param {number} count - số lựa chọn sai cần lấy
   * @returns {Array}
   */
  function getWrongChoices(correctItem, topic, count) {
    var data = getTopicData(topic);
    if (!data.length || count <= 0) return [];
    var wrongs = [];
    var used = { };
    if (correctItem && correctItem.value !== undefined) used[correctItem.value] = true;
    while (wrongs.length < count && wrongs.length < data.length - 1) {
      var item = getRandomItem(data, correctItem);
      if (!item || used[item.value]) continue;
      used[item.value] = true;
      wrongs.push(item);
    }
    return wrongs;
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

  window.listenTapShared = {
    GAME_KEY: GAME_KEY,
    getTopicData: getTopicData,
    getLabelPrefix: getLabelPrefix,
    getRandomItem: getRandomItem,
    getWrongChoices: getWrongChoices,
    shuffle: shuffle,
    TOPICS: TOPICS
  };
})();
