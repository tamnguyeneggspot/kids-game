/**
 * Data và helper cho game Đếm và chọn số (Count & match).
 * Đồ vật (emoji) + số 1–10; getRandomQuestion, getWrongOptions.
 */
(function () {
  'use strict';

  var GAME_KEY = 'countMatch';

  // Đồ vật: emoji + tên (tái dùng kiểu counting)
  var OBJECTS = [
    { name: 'táo', emoji: '🍎' },
    { name: 'sao', emoji: '⭐' },
    { name: 'bóng', emoji: '⚽' },
    { name: 'hoa', emoji: '🌸' },
    { name: 'cá', emoji: '🐟' },
    { name: 'mèo', emoji: '🐱' },
    { name: 'chó', emoji: '🐕' },
    { name: 'bướm', emoji: '🦋' },
    { name: 'xe', emoji: '🚗' },
    { name: 'quả chuối', emoji: '🍌' }
  ];

  var NUMBERS = [];
  for (var n = 1; n <= 10; n++) {
    NUMBERS.push(n);
  }

  /**
   * Lấy câu hỏi ngẫu nhiên: count 1–10, object ngẫu nhiên.
   * @returns {{ count: number, object: string, objectDisplay: string }}
   */
  function getRandomQuestion() {
    var count = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    var obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
    return {
      count: count,
      object: obj.name,
      objectDisplay: obj.emoji
    };
  }

  /**
   * Lấy 2–3 số sai gần với correctCount (để khó hơn).
   * @param {number} correctCount - số đúng
   * @param {number} count - số lựa chọn sai cần (2 hoặc 3)
   * @returns {number[]}
   */
  function getWrongOptions(correctCount, count) {
    var wrong = [];
    var used = {};
    used[correctCount] = true;
    var candidates = [];
    for (var i = 1; i <= 10; i++) {
      if (i !== correctCount) candidates.push(i);
    }
    while (wrong.length < count && candidates.length > 0) {
      var idx = Math.floor(Math.random() * candidates.length);
      var num = candidates[idx];
      candidates.splice(idx, 1);
      wrong.push(num);
    }
    return wrong;
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

  window.countMatchShared = {
    GAME_KEY: GAME_KEY,
    OBJECTS: OBJECTS,
    NUMBERS: NUMBERS,
    getRandomQuestion: getRandomQuestion,
    getWrongOptions: getWrongOptions,
    shuffle: shuffle
  };
})();
