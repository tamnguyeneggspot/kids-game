(function () {
  'use strict';

  var S = window.countingShared;
  if (!S) return;

  var MIN_COUNT = S.MIN_COUNT;
  var MAX_COUNT = S.MAX_COUNT;
  var CHOICES_COUNT = S.CHOICES_COUNT;
  var NUMBER_READINGS = S.NUMBER_READINGS;
  var questionText = S.questionText;
  var readingText = S.readingText;
  var objectsWrap = S.objectsWrap;
  var choicesEl = S.choicesEl;
  var feedbackEl = S.feedbackEl;
  var btnNext = S.btnNext;
  var scoreEl = S.scoreEl;
  var randomInt = S.randomInt;
  var shuffle = S.shuffle;
  var getWrongChoices = S.getWrongChoices;
  var speak = S.speak;
  var addScore = S.addScore;
  var setScore = S.setScore;
  var getScore = S.getScore;
  var showCelebration = S.showCelebration;
  var showWrongEffect = S.showWrongEffect;
  var removeCelebration = S.removeCelebration;
  var removeWrongEffect = S.removeWrongEffect;

  var correctAnswer = MIN_COUNT;
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
  window.countingStopListenReplay = stopAllReplay;

  function showQuestion() {
    questionText.classList.remove('training-number');
    if (readingText) readingText.hidden = true;
    answered = false;
    correctAnswer = randomInt(MIN_COUNT, MAX_COUNT);

    questionText.textContent = 'Nghe và chọn số đúng';
    objectsWrap.innerHTML = '';
    objectsWrap.setAttribute('aria-label', 'Nghe số rồi chọn đáp án.');

    var wrongChoices = getWrongChoices(correctAnswer, CHOICES_COUNT - 1);
    var options = shuffle([correctAnswer].concat(wrongChoices));
    choicesEl.innerHTML = '';
    options.forEach(function (num) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = num;
      btn.setAttribute('aria-label', 'Số ' + num);
      btn.addEventListener('click', function () { onChoice(num, btn); });
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
    if (window.countingStopPlayReplay) window.countingStopPlayReplay();
    removeCelebration();
    removeWrongEffect();

    function playListenQuestion() {
      var reading = NUMBER_READINGS[correctAnswer];
      speak('Đâu là số ' + reading + '?', 'vi-VN');
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

  function onChoice(num, btn) {
    if (answered) return;
    answered = true;
    stopAllReplay();
    if (window.countingStopPlayReplay) window.countingStopPlayReplay();

    var allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(function (b) { b.disabled = true; });

    if (num === correctAnswer) {
      addScore();
      if (scoreEl) scoreEl.textContent = 'Điểm: ' + getScore();
      btn.classList.add('correct');
      feedbackEl.textContent = 'Đúng rồi! 🎉';
      feedbackEl.className = 'feedback success';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      speak('Đúng rồi! Số ' + correctAnswer, 'vi-VN');
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
      speak('Số ' + NUMBER_READINGS[correctAnswer] + '.', 'vi-VN');
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
      if (window.countingSetMode) window.countingSetMode('listen');
    });
  }
  if (S.btnListenPlay) {
    S.btnListenPlay.addEventListener('click', function () {
      if (window.countingGameMode !== 'listen') return;
      var reading = NUMBER_READINGS[correctAnswer];
      speak('Đâu là số ' + reading + '?', 'vi-VN');
    });
  }

  if (!window.countingModes) window.countingModes = {};
  window.countingModes.listen = { show: showQuestion, cleanup: stopAllReplay };
})();
