(function () {
  'use strict';

  var S = window.colorShared;
  if (!S) return;

  var COLORS = S.COLORS;
  var CHOICES_COUNT = S.CHOICES_COUNT;
  var questionText = S.questionText;
  var readingText = S.readingText;
  var colorDisplayWrap = S.colorDisplayWrap;
  var choicesEl = S.choicesEl;
  var feedbackEl = S.feedbackEl;
  var btnNext = S.btnNext;
  var scoreEl = S.scoreEl;
  var speak = S.speak;
  var getWrongColors = S.getWrongColors;
  var shuffle = S.shuffle;
  var randomInt = S.randomInt;
  var createSwatchEl = S.createSwatchEl;
  var addScore = S.addScore;
  var setScore = S.setScore;
  var getScore = S.getScore;
  var showCelebration = S.showCelebration;
  var showWrongEffect = S.showWrongEffect;
  var removeCelebration = S.removeCelebration;
  var removeWrongEffect = S.removeWrongEffect;

  var correctColor = COLORS[0];
  var answered = false;
  var autoNextTimer = null;
  var LISTEN_REPLAY_MS = 1000 * 60;
  var listenReplayInterval = null;
  var listenAutoPlayTimer = null;

  function stopAllReplay() {
    if (listenReplayInterval) {
      clearInterval(listenReplayInterval);
      listenReplayInterval = null;
    }
    if (listenAutoPlayTimer) {
      clearTimeout(listenAutoPlayTimer);
      listenAutoPlayTimer = null;
    }
  }

  function showQuestion() {
    questionText.classList.remove('training-color');
    if (readingText) readingText.hidden = true;
    answered = false;
    var colorIdx = randomInt(0, COLORS.length - 1);
    correctColor = COLORS[colorIdx];

    questionText.textContent = 'Nghe và chọn màu đúng';
    if (colorDisplayWrap) {
      colorDisplayWrap.innerHTML = '';
      colorDisplayWrap.setAttribute('aria-label', 'Nghe tên màu rồi chọn đáp án.');
    }

    var wrongColors = getWrongColors(correctColor, CHOICES_COUNT - 1);
    var options = shuffle([correctColor].concat(wrongColors));
    choicesEl.innerHTML = '';
    options.forEach(function (color) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn choice-btn-color';
      var swatchWrap = createSwatchEl(color.hex, color.name);
      btn.appendChild(swatchWrap);
      btn.setAttribute('aria-label', 'Màu ' + color.name);
      btn.addEventListener('click', function () { onChoiceColor(color, btn); });
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
    stopAllReplay();
    removeCelebration();
    removeWrongEffect();

    function playListenQuestion() {
      speak('Đâu là màu ' + correctColor.name + '?', 'vi-VN');
    }
    listenAutoPlayTimer = setTimeout(function () {
      listenAutoPlayTimer = null;
      playListenQuestion();
      listenReplayInterval = setInterval(function () {
        if (answered) {
          if (listenReplayInterval) clearInterval(listenReplayInterval);
          listenReplayInterval = null;
          return;
        }
        playListenQuestion();
      }, LISTEN_REPLAY_MS);
    }, 500);
    if (S.btnListenPlay) {
      if (document.activeElement && document.activeElement !== S.btnListenPlay) document.activeElement.blur();
      setTimeout(function () { S.btnListenPlay.focus(); }, 0);
    }
  }

  function onChoiceColor(color, btn) {
    if (answered) return;
    answered = true;
    stopAllReplay();
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

  if (S.modeListen) {
    S.modeListen.addEventListener('click', function () {
      if (window.colorSetMode) window.colorSetMode('listen');
    });
  }
  if (S.btnListenPlay) {
    S.btnListenPlay.addEventListener('click', function () {
      if (window.colorGameMode !== 'listen') return;
      speak('Đâu là màu ' + correctColor.name + '?', 'vi-VN');
    });
  }

  if (!window.colorModes) window.colorModes = {};
  window.colorModes.listen = { show: showQuestion, cleanup: stopAllReplay };
})();
