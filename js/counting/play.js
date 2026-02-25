(function () {
  'use strict';

  var S = window.countingShared;
  if (!S) return;

  var OBJECTS = S.OBJECTS;
  var OBJECT_NAMES = S.OBJECT_NAMES;
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
  var PLAY_REPLAY_MS = 1000 * 60;
  var playReplayInterval = null;
  var playAutoPlayTimer = null;

  function stopAllReplay() {
    if (playReplayInterval) {
      clearInterval(playReplayInterval);
      playReplayInterval = null;
    }
    if (playAutoPlayTimer) {
      clearTimeout(playAutoPlayTimer);
      playAutoPlayTimer = null;
    }
  }
  window.countingStopPlayReplay = stopAllReplay;

  function showQuestion() {
    questionText.classList.remove('training-number');
    if (readingText) readingText.hidden = true;
    answered = false;
    correctAnswer = randomInt(MIN_COUNT, MAX_COUNT);

    var emojiIdx = randomInt(0, OBJECTS.length - 1);
    var emoji = OBJECTS[emojiIdx];
    var objectName = OBJECT_NAMES[emojiIdx];
    var howManyText = 'Có bao nhiêu ' + objectName + '?';

    questionText.textContent = howManyText;
    objectsWrap.innerHTML = '';
    objectsWrap.setAttribute('aria-label', 'Có ' + correctAnswer + ' ' + objectName + '.');
    for (var i = 0; i < correctAnswer; i++) {
      var span = document.createElement('span');
      span.className = 'object-item';
      span.setAttribute('role', 'img');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = emoji;
      objectsWrap.appendChild(span);
    }

    function playHowMany() { speak(howManyText, 'vi-VN'); }
    playHowMany();
    playAutoPlayTimer = setTimeout(function () {
      playAutoPlayTimer = null;
      playHowMany();
      playReplayInterval = setInterval(function () {
        if (answered) {
          if (playReplayInterval) clearInterval(playReplayInterval);
          playReplayInterval = null;
          return;
        }
        playHowMany();
      }, PLAY_REPLAY_MS);
    }, PLAY_REPLAY_MS);

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
    if (window.countingStopListenReplay) window.countingStopListenReplay();
    removeCelebration();
    removeWrongEffect();
  }

  function onChoice(num, btn) {
    if (answered) return;
    answered = true;
    stopAllReplay();
    if (window.countingStopListenReplay) window.countingStopListenReplay();

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
      speak('Có ' + correctAnswer + ' cái.', 'vi-VN');
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

  if (S.modePlay) {
    S.modePlay.addEventListener('click', function () {
      if (window.countingSetMode) window.countingSetMode('play');
    });
  }

  if (!window.countingModes) window.countingModes = {};
  window.countingModes.play = { show: showQuestion, cleanup: stopAllReplay };
})();
