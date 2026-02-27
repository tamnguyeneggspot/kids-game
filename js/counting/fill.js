(function () {
  'use strict';

  var S = window.countingShared;
  if (!S) return;

  var MIN_COUNT = S.MIN_COUNT;
  var MAX_COUNT = S.MAX_COUNT;
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

  var SEQUENCE_LENGTH = 4;
  var correctAnswer = 0;
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
    questionText.classList.remove('training-number');
    if (readingText) readingText.hidden = true;
    answered = false;

    var start = randomInt(MIN_COUNT, Math.max(MIN_COUNT, MAX_COUNT - SEQUENCE_LENGTH));
    var gapIndex = randomInt(0, SEQUENCE_LENGTH - 1);
    correctAnswer = start + gapIndex;

    questionText.textContent = 'Điền số còn thiếu:';
    objectsWrap.innerHTML = '';
    objectsWrap.className = 'objects-wrap objects-wrap-sequence';
    objectsWrap.setAttribute('aria-label', 'Dãy số có một ô trống. Số cần điền là ' + correctAnswer);

    for (var i = 0; i < SEQUENCE_LENGTH; i++) {
      var cell = document.createElement('span');
      cell.className = 'sequence-cell' + (i === gapIndex ? ' sequence-gap' : '');
      cell.textContent = i === gapIndex ? '?' : (start + i);
      cell.setAttribute('aria-hidden', 'true');
      objectsWrap.appendChild(cell);
    }

    var wrongChoices = getWrongChoices(correctAnswer, 1);
    var options = shuffle([correctAnswer].concat(wrongChoices));
    choicesEl.innerHTML = '';
    choicesEl.className = 'choices';
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
    removeCelebration();
    removeWrongEffect();

    speak('Điền số còn thiếu. Số đúng là số mấy?', 'vi-VN');
  }

  function onChoice(num, btn) {
    if (answered) return;
    answered = true;

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
      feedbackEl.textContent = 'Số đúng là ' + correctAnswer + '. Bạn được ' + scoreBeforeReset + ' điểm.';
      feedbackEl.className = 'feedback error';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playWrong();
      speak('Số đúng là ' + correctAnswer + '.', 'vi-VN');
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

  if (S.modeFill) {
    S.modeFill.addEventListener('click', function () {
      if (window.countingSetMode) window.countingSetMode('fill');
    });
  }

  if (!window.countingModes) window.countingModes = {};
  window.countingModes.fill = { show: showQuestion, cleanup: cleanup };
})();
