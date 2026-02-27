(function () {
  'use strict';

  var S = window.countingShared;
  if (!S) return;

  var OBJECTS = S.OBJECTS;
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
  var speak = S.speak;
  var addScore = S.addScore;
  var setScore = S.setScore;
  var getScore = S.getScore;
  var showCelebration = S.showCelebration;
  var showWrongEffect = S.showWrongEffect;
  var removeCelebration = S.removeCelebration;
  var removeWrongEffect = S.removeWrongEffect;

  var leftCount = 0;
  var rightCount = 0;
  var askMore = true;  /* true = "Bên nào nhiều hơn?", false = "Bên nào ít hơn?" */
  var correctSide = 'left';  /* 'left' | 'right' */
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

    do {
      leftCount = randomInt(MIN_COUNT, MAX_COUNT);
      rightCount = randomInt(MIN_COUNT, MAX_COUNT);
    } while (leftCount === rightCount);

    askMore = Math.random() < 0.5;
    var questionStr = askMore ? 'Bên nào nhiều hơn?' : 'Bên nào ít hơn?';
    if (askMore) {
      correctSide = leftCount > rightCount ? 'left' : 'right';
    } else {
      correctSide = leftCount < rightCount ? 'left' : 'right';
    }

    questionText.textContent = questionStr;
    objectsWrap.innerHTML = '';
    objectsWrap.className = 'objects-wrap objects-wrap-compare';
    objectsWrap.setAttribute('aria-label', 'Bên trái có ' + leftCount + ' cái, bên phải có ' + rightCount + ' cái. ' + questionStr);

    var emoji = OBJECTS[randomInt(0, OBJECTS.length - 1)];

    var leftGroup = document.createElement('div');
    leftGroup.className = 'compare-group compare-group-left';
    leftGroup.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < leftCount; i++) {
      var span = document.createElement('span');
      span.className = 'object-item';
      span.textContent = emoji;
      leftGroup.appendChild(span);
    }
    objectsWrap.appendChild(leftGroup);

    var vsDiv = document.createElement('div');
    vsDiv.className = 'compare-vs';
    vsDiv.setAttribute('aria-hidden', 'true');
    vsDiv.textContent = '⚖️';
    objectsWrap.appendChild(vsDiv);

    var rightGroup = document.createElement('div');
    rightGroup.className = 'compare-group compare-group-right';
    rightGroup.setAttribute('aria-hidden', 'true');
    for (var j = 0; j < rightCount; j++) {
      var span2 = document.createElement('span');
      span2.className = 'object-item';
      span2.textContent = emoji;
      rightGroup.appendChild(span2);
    }
    objectsWrap.appendChild(rightGroup);

    choicesEl.innerHTML = '';
    choicesEl.className = 'choices choices-compare';

    var leftBtn = document.createElement('button');
    leftBtn.type = 'button';
    leftBtn.className = 'choice-btn choice-btn-side';
    leftBtn.textContent = '👈 Bên trái';
    leftBtn.setAttribute('aria-label', 'Chọn bên trái');
    leftBtn.addEventListener('click', function () { onChoice('left', leftBtn); });
    choicesEl.appendChild(leftBtn);

    var rightBtn = document.createElement('button');
    rightBtn.type = 'button';
    rightBtn.className = 'choice-btn choice-btn-side';
    rightBtn.textContent = 'Bên phải 👉';
    rightBtn.setAttribute('aria-label', 'Chọn bên phải');
    rightBtn.addEventListener('click', function () { onChoice('right', rightBtn); });
    choicesEl.appendChild(rightBtn);

    feedbackEl.hidden = true;
    feedbackEl.className = 'feedback';
    feedbackEl.textContent = '';
    btnNext.hidden = true;
    removeCelebration();
    removeWrongEffect();

    speak(questionStr, 'vi-VN');
  }

  function onChoice(side, btn) {
    if (answered) return;
    answered = true;

    var allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(function (b) { b.disabled = true; });

    if (side === correctSide) {
      addScore();
      if (scoreEl) scoreEl.textContent = 'Điểm: ' + getScore();
      btn.classList.add('correct');
      feedbackEl.textContent = 'Đúng rồi! 🎉';
      feedbackEl.className = 'feedback success';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      speak('Đúng rồi!', 'vi-VN');
      showCelebration();
      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(function () {
        autoNextTimer = null;
        showQuestion();
      }, 3000);
    } else {
      var scoreBeforeReset = getScore();
      btn.classList.add('wrong');
      var correctLabel = correctSide === 'left' ? 'Bên trái' : 'Bên phải';
      feedbackEl.textContent = 'Bên đúng là ' + correctLabel + '. Bạn được ' + scoreBeforeReset + ' điểm.';
      feedbackEl.className = 'feedback error';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playWrong();
      speak('Bên đúng là ' + correctLabel + '.', 'vi-VN');
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

  if (S.modeCompare) {
    S.modeCompare.addEventListener('click', function () {
      if (window.countingSetMode) window.countingSetMode('compare');
    });
  }

  if (!window.countingModes) window.countingModes = {};
  window.countingModes.compare = { show: showQuestion, cleanup: cleanup };
})();
