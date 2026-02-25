(function () {
  'use strict';

  // Bảng chữ cái tiếng Việt (29 chữ) và cách đọc tên chữ
  var LETTERS = ['A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'];
  var LETTER_READINGS = {
    'A': 'a', 'Ă': 'á', 'Â': 'â', 'B': 'bê', 'C': 'xê', 'D': 'dê', 'Đ': 'đờ', 'E': 'e', 'Ê': 'ê',
    'G': 'gờ', 'H': 'hát', 'I': 'i', 'K': 'ca', 'L': 'lờ', 'M': 'mờ', 'N': 'nờ', 'O': 'o', 'Ô': 'ô', 'Ơ': 'ơ',
    'P': 'pê', 'Q': 'cu', 'R': 'rờ', 'S': 'sờ', 'T': 'tê', 'U': 'u', 'Ư': 'ư', 'V': 'vê', 'X': 'xờ', 'Y': 'i-dài'
  };
  /** Ghép chữ với hình: chữ -> { emoji, label }; label phải bắt đầu đúng chữ cái */
  var LETTER_IMAGES = {
    'A': { emoji: '👕', label: 'Áo' },
    'Ă': { emoji: '🍽️', label: 'Ăn' },
    'Â': { emoji: '🦆', label: 'Ấp' },
    'B': { emoji: '⚽', label: 'Bóng' },
    'C': { emoji: '🐟', label: 'Cá' },
    'D': { emoji: '🐐', label: 'Dê' },
    'Đ': { emoji: '💡', label: 'Đèn' },
    'E': { emoji: '👧', label: 'Em' },
    'Ê': { emoji: '🐸', label: 'Ếch' },
    'G': { emoji: '🐔', label: 'Gà' },
    'H': { emoji: '🌸', label: 'Hoa' },
    'I': { emoji: '🤫', label: 'Im' },
    'K': { emoji: '🍬', label: 'Kẹo' },
    'L': { emoji: '🍐', label: 'Lê' },
    'M': { emoji: '🐱', label: 'Mèo' },
    'N': { emoji: '🦌', label: 'Nai' },
    'O': { emoji: '🐝', label: 'Ong' },
    'Ô': { emoji: '🚗', label: 'Ô tô' },
    'Ơ': { emoji: '🙏', label: 'Ơn' },
    'P': { emoji: '🎹', label: 'Piano' },
    'Q': { emoji: '🍎', label: 'Quả' },
    'R': { emoji: '🐢', label: 'Rùa' },
    'S': { emoji: '🐿️', label: 'Sóc' },
    'T': { emoji: '🐰', label: 'Thỏ' },
    'U': { emoji: '🥤', label: 'Uống' },
    'Ư': { emoji: '☔', label: 'Ướt' },
    'V': { emoji: '🎻', label: 'Vĩ cầm' },
    'X': { emoji: '🎲', label: 'Xúc xắc' },
    'Y': { emoji: '❤️', label: 'Yêu' }
  };
  var CHOICES_COUNT = 2;
  var CHOICES_COUNT_MATCH = 4;
  var GAME_KEY = 'alphabet';

  var score = window.webGameDiem ? window.webGameDiem.loadDiem(GAME_KEY) : 0;
  var scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = 'Điểm: ' + score;

  function setScore(n) {
    score = n;
    if (scoreEl) scoreEl.textContent = 'Điểm: ' + score;
    if (window.webGameDiem) window.webGameDiem.saveDiem(GAME_KEY, score);
  }

  function getScore() { return score; }

  function addScore() {
    score += 1;
    if (scoreEl) scoreEl.textContent = 'Điểm: ' + score;
    if (window.webGameDiem) {
      window.webGameDiem.saveDiem(GAME_KEY, score);
      window.webGameDiem.saveHighScore(GAME_KEY, score);
    }
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function speak(text, lang) {
    if (window.webGameSpeak) window.webGameSpeak(text, lang || 'vi-VN');
  }

  /** Lấy các chữ sai (mode Nghe: chọn chữ; mode Ghép chữ: chọn hình). */
  function getWrongLetters(correct, count) {
    var wrong = [];
    var others = LETTERS.filter(function (c) { return c !== correct && LETTER_IMAGES[c]; });
    for (var i = 0; i < count && others.length > 0; i++) {
      var idx = randomInt(0, others.length - 1);
      wrong.push(others[idx]);
      others.splice(idx, 1);
    }
    return wrong;
  }

  function showCelebration() {
    removeCelebration();
    var container = document.createElement('div');
    container.className = 'celebration-wrap';
    container.setAttribute('aria-hidden', 'true');
    var colors = ['#6b4ce6', '#22c55e', '#fbbf24', '#f59e0b', '#ec4899', '#06b6d4'];
    var emojis = ['🎉', '⭐', '🌟', '✨', '🎈', '🌸'];
    for (var i = 0; i < 24; i++) {
      var p = document.createElement('span');
      p.className = 'celebration-piece';
      p.textContent = emojis[i % emojis.length];
      p.style.setProperty('--i', i);
      p.style.setProperty('--color', colors[i % colors.length]);
      container.appendChild(p);
    }
    document.body.appendChild(container);
  }

  function showWrongEffect() {
    removeWrongEffect();
    var container = document.createElement('div');
    container.className = 'wrong-effect-wrap';
    container.setAttribute('aria-hidden', 'true');
    var emojis = ['😢', '💔', '😅', '🙈', '✨', '💫'];
    for (var i = 0; i < 18; i++) {
      var p = document.createElement('span');
      p.className = 'wrong-effect-piece';
      p.textContent = emojis[i % emojis.length];
      p.style.setProperty('--i', i);
      container.appendChild(p);
    }
    document.body.appendChild(container);
    setTimeout(removeWrongEffect, 1200);
  }

  function removeWrongEffect() {
    var wrap = document.querySelector('.wrong-effect-wrap');
    if (wrap) wrap.remove();
  }

  function removeCelebration() {
    var wrap = document.querySelector('.celebration-wrap');
    if (wrap) wrap.remove();
  }

  window.alphabetShared = {
    LETTERS: LETTERS,
    LETTER_READINGS: LETTER_READINGS,
    LETTER_IMAGES: LETTER_IMAGES,
    CHOICES_COUNT: CHOICES_COUNT,
    CHOICES_COUNT_MATCH: CHOICES_COUNT_MATCH,
    GAME_KEY: GAME_KEY,
    getScore: getScore,
    setScore: setScore,
    addScore: addScore,
    scoreEl: scoreEl,
    questionText: document.getElementById('questionText'),
    readingText: document.getElementById('readingText'),
    letterDisplayWrap: document.getElementById('letterDisplayWrap'),
    choicesEl: document.getElementById('choices'),
    feedbackEl: document.getElementById('feedback'),
    btnNext: document.getElementById('btnNext'),
    trainingActions: document.getElementById('trainingActions'),
    btnListen: document.getElementById('btnListen'),
    btnNextTraining: document.getElementById('btnNextTraining'),
    modeTraining: document.getElementById('modeTraining'),
    modeListen: document.getElementById('modeListen'),
    modeMatch: document.getElementById('modeMatch'),
    playListenWrap: document.getElementById('playListenWrap'),
    btnListenPlay: document.getElementById('btnListenPlay'),
    randomInt: randomInt,
    shuffle: shuffle,
    speak: speak,
    getWrongLetters: getWrongLetters,
    showCelebration: showCelebration,
    showWrongEffect: showWrongEffect,
    removeWrongEffect: removeWrongEffect,
    removeCelebration: removeCelebration
  };
})();
