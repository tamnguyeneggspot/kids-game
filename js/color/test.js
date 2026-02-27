(function () {
  'use strict';

  var S = window.colorShared;
  if (!S) return;

  var COLORS = S.COLORS;
  var TEST_CHOICES_COUNT = 2;
  var questionText = S.questionText;
  var readingText = S.readingText;
  var colorDisplayWrap = S.colorDisplayWrap;
  var choicesEl = S.choicesEl;
  var feedbackEl = S.feedbackEl;
  var btnNext = S.btnNext;
  var scoreEl = S.scoreEl;
  var getWrongColors = S.getWrongColors;
  var shuffle = S.shuffle;
  var randomInt = S.randomInt;
  var createSwatchEl = S.createSwatchEl;
  var addScore = S.addScore;
  var setScore = S.setScore;
  var getScore = S.getScore;
  var speak = S.speak;
  var showCelebration = S.showCelebration;
  var showWrongEffect = S.showWrongEffect;
  var removeCelebration = S.removeCelebration;
  var removeWrongEffect = S.removeWrongEffect;

  var correctColor = COLORS[0];
  var answered = false;
  var autoNextTimer = null;

  function cleanup() {
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      autoNextTimer = null;
    }
    removeCelebration();
    removeWrongEffect();
  }

  function showQuestion() {
    questionText.classList.remove('training-color');
    if (readingText) readingText.hidden = true;
    answered = false;
    var colorIdx = randomInt(0, COLORS.length - 1);
    correctColor = COLORS[colorIdx];

    questionText.textContent = 'Màu này gọi là gì?';
    speak('Màu này gọi là gì?', 'vi-VN');
    if (colorDisplayWrap) {
      colorDisplayWrap.innerHTML = '';
      var swatchWrap = createSwatchEl(correctColor.hex, null);
      colorDisplayWrap.appendChild(swatchWrap);
      colorDisplayWrap.setAttribute('aria-label', 'Màu ' + correctColor.name);
    }

    var wrongColors = getWrongColors(correctColor, TEST_CHOICES_COUNT - 1);
    var options = shuffle([correctColor].concat(wrongColors));
    choicesEl.innerHTML = '';
    options.forEach(function (color) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = color.name;
      btn.setAttribute('aria-label', 'Màu ' + color.name);
      btn.addEventListener('click', function () { onChoice(color, btn); });
      choicesEl.appendChild(btn);
    });

    feedbackEl.hidden = true;
    feedbackEl.className = 'feedback';
    feedbackEl.textContent = '';
    btnNext.hidden = true;
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      autoNextTimer = null;
    }
    if (window.colorStopListenReplay) window.colorStopListenReplay();
    removeCelebration();
    removeWrongEffect();
  }

  function onChoice(color, btn) {
    if (answered) return;
    answered = true;

    var allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(function (b) { b.disabled = true; });

    if (color.name === correctColor.name) {
      addScore();
      if (scoreEl) scoreEl.textContent = 'Điểm: ' + getScore();
      btn.classList.add('correct');
      feedbackEl.textContent = 'Đúng rồi! 🎉';
      feedbackEl.className = 'feedback success';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      speak('Đúng rồi! Màu ' + correctColor.name, 'vi-VN');
      showCelebration();
      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(function () {
        autoNextTimer = null;
        showQuestion();
      }, 3000);
    } else {
      var scoreBeforeReset = getScore();
      btn.classList.add('wrong');
      feedbackEl.textContent = 'Bạn được ' + scoreBeforeReset + ' điểm.';
      feedbackEl.className = 'feedback error';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playWrong();
      speak('Màu ' + correctColor.name + '.', 'vi-VN');
      showWrongEffect();
      setTimeout(function () {
        setScore(0);
        if (scoreEl) scoreEl.textContent = 'Điểm: 0';
      }, 2500);
      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(function () {
        autoNextTimer = null;
        showQuestion();
      }, 3500);
    }
    btnNext.hidden = false;
    btnNext.focus();
  }

  if (S.modeTest) {
    S.modeTest.addEventListener('click', function () {
      if (window.colorSetMode) window.colorSetMode('test');
    });
  }

  if (!window.colorModes) window.colorModes = {};
  window.colorModes.test = { show: showQuestion, cleanup: cleanup };
})();
