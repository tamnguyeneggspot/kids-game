(function () {
  'use strict';

  // Màu sắc tiếng Việt: tên và mã hex
  var COLORS = [
    { name: 'Đỏ', hex: '#e53935' },
    { name: 'Xanh lá', hex: '#43a047' },
    { name: 'Xanh dương', hex: '#1e88e5' },
    { name: 'Vàng', hex: '#fdd835' },
    { name: 'Cam', hex: '#fb8c00' },
    { name: 'Tím', hex: '#8e24aa' },
    { name: 'Hồng', hex: '#ec407a' },
    { name: 'Nâu', hex: '#6d4c41' },
    { name: 'Đen', hex: '#212121' },
    { name: 'Trắng', hex: '#fafafa' },
    { name: 'Xám', hex: '#757575' }
  ];
  var CHOICES_COUNT = 2;
  var GAME_KEY = 'color';

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

  function getWrongColors(correct, count) {
    var wrong = [];
    var others = COLORS.filter(function (c) { return c.name !== correct.name; });
    for (var i = 0; i < count; i++) {
      var idx = randomInt(0, others.length - 1);
      wrong.push(others[idx]);
      others.splice(idx, 1);
    }
    return wrong;
  }

  function createSwatchEl(hex, label) {
    var wrap = document.createElement('div');
    wrap.className = 'color-swatch-wrap';
    var swatch = document.createElement('span');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = hex;
    if (hex === '#fafafa' || hex.toLowerCase() === '#ffffff') {
      swatch.style.border = '2px solid #ddd';
    }
    wrap.appendChild(swatch);
    if (label) {
      var span = document.createElement('span');
      span.className = 'color-swatch-label';
      span.textContent = label;
      wrap.appendChild(span);
    }
    return wrap;
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

  window.colorShared = {
    COLORS: COLORS,
    CHOICES_COUNT: CHOICES_COUNT,
    GAME_KEY: GAME_KEY,
    getScore: getScore,
    setScore: setScore,
    addScore: addScore,
    scoreEl: scoreEl,
    questionText: document.getElementById('questionText'),
    readingText: document.getElementById('readingText'),
    colorDisplayWrap: document.getElementById('colorDisplayWrap'),
    choicesEl: document.getElementById('choices'),
    feedbackEl: document.getElementById('feedback'),
    btnNext: document.getElementById('btnNext'),
    trainingActions: document.getElementById('trainingActions'),
    btnListen: document.getElementById('btnListen'),
    btnNextTraining: document.getElementById('btnNextTraining'),
    modeTraining: document.getElementById('modeTraining'),
    modeListen: document.getElementById('modeListen'),
    modeTest: document.getElementById('modeTest'),
    playListenWrap: document.getElementById('playListenWrap'),
    btnListenPlay: document.getElementById('btnListenPlay'),
    randomInt: randomInt,
    shuffle: shuffle,
    speak: speak,
    getWrongColors: getWrongColors,
    createSwatchEl: createSwatchEl,
    showCelebration: showCelebration,
    showWrongEffect: showWrongEffect,
    removeWrongEffect: removeWrongEffect,
    removeCelebration: removeCelebration
  };
})();
