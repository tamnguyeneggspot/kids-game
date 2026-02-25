(function () {
  'use strict';

  var OBJECTS = ['☕', '📖', '🔑', '👓', '✏️', '💡', '📱', '🍎', '🥄', '🎒'];
  var OBJECT_NAMES = ['cốc', 'sách', 'chìa khóa', 'kính', 'bút chì', 'bóng đèn', 'điện thoại', 'quả táo', 'thìa', 'cặp sách'];
  var MIN_COUNT = 1;
  var MAX_COUNT = 10;
  var CHOICES_COUNT = 2;
  var NUMBER_READINGS = {
    1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 5: 'năm',
    6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín', 10: 'mười'
  };
  var GAME_KEY = 'counting';

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

  function getWrongChoices(correct, count) {
    var wrong = [];
    var set = {};
    while (wrong.length < count) {
      var n = randomInt(MIN_COUNT, MAX_COUNT);
      if (n !== correct && !set[n]) {
        set[n] = true;
        wrong.push(n);
      }
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

  window.countingShared = {
    OBJECTS: OBJECTS,
    OBJECT_NAMES: OBJECT_NAMES,
    MIN_COUNT: MIN_COUNT,
    MAX_COUNT: MAX_COUNT,
    CHOICES_COUNT: CHOICES_COUNT,
    NUMBER_READINGS: NUMBER_READINGS,
    GAME_KEY: GAME_KEY,
    getScore: getScore,
    setScore: setScore,
    addScore: addScore,
    scoreEl: scoreEl,
    questionText: document.getElementById('questionText'),
    readingText: document.getElementById('readingText'),
    objectsWrap: document.getElementById('objectsWrap'),
    choicesEl: document.getElementById('choices'),
    feedbackEl: document.getElementById('feedback'),
    btnNext: document.getElementById('btnNext'),
    trainingActions: document.getElementById('trainingActions'),
    btnListen: document.getElementById('btnListen'),
    btnNextTraining: document.getElementById('btnNextTraining'),
    modeTraining: document.getElementById('modeTraining'),
    modePlay: document.getElementById('modePlay'),
    modeListen: document.getElementById('modeListen'),
    playListenWrap: document.getElementById('playListenWrap'),
    btnListenPlay: document.getElementById('btnListenPlay'),
    randomInt: randomInt,
    shuffle: shuffle,
    speak: speak,
    getWrongChoices: getWrongChoices,
    showCelebration: showCelebration,
    showWrongEffect: showWrongEffect,
    removeWrongEffect: removeWrongEffect,
    removeCelebration: removeCelebration
  };
})();
