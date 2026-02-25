(function () {
  'use strict';

  var S = window.alphabetShared;
  if (!S) return;

  var LETTERS = S.LETTERS;
  var LETTER_READINGS = S.LETTER_READINGS;
  var CHOICES_COUNT = S.CHOICES_COUNT;
  var questionText = S.questionText;
  var readingText = S.readingText;
  var letterDisplayWrap = S.letterDisplayWrap;
  var choicesEl = S.choicesEl;
  var feedbackEl = S.feedbackEl;
  var btnNext = S.btnNext;
  var speak = S.speak;
  var getWrongLetters = S.getWrongLetters;
  var shuffle = S.shuffle;
  var randomInt = S.randomInt;
  var addScore = S.addScore;
  var setScore = S.setScore;
  var showCelebration = S.showCelebration;
  var showWrongEffect = S.showWrongEffect;
  var removeCelebration = S.removeCelebration;
  var removeWrongEffect = S.removeWrongEffect;

  var correctLetter = 'A';
  var correctReading = 'a';
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
    questionText.classList.remove('training-letter');
    if (readingText) readingText.hidden = true;
    answered = false;
    var letterIdx = randomInt(0, LETTERS.length - 1);
    correctLetter = LETTERS[letterIdx];
    correctReading = LETTER_READINGS[correctLetter];

    questionText.textContent = 'Nghe và chọn chữ đúng';
    if (letterDisplayWrap) {
      letterDisplayWrap.innerHTML = '';
      letterDisplayWrap.setAttribute('aria-label', 'Nghe tên chữ rồi chọn đáp án.');
    }

    var wrongLetters = getWrongLetters(correctLetter, CHOICES_COUNT - 1);
    var options = shuffle([correctLetter].concat(wrongLetters));
    choicesEl.innerHTML = '';
    options.forEach(function (letter) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn choice-btn-letter';
      btn.textContent = letter;
      btn.setAttribute('aria-label', 'Chữ ' + letter);
      btn.addEventListener('click', function () { onChoiceLetter(letter, btn); });
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
      speak('Đâu là chữ ' + correctReading + '?', 'vi-VN');
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

  function onChoiceLetter(letter, btn) {
    if (answered) return;
    answered = true;
    stopAllReplay();
    var allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(function (b) { b.disabled = true; });

    if (letter === correctLetter) {
      addScore();
      btn.classList.add('correct');
      feedbackEl.textContent = 'Đúng rồi! 🎉';
      feedbackEl.className = 'feedback success';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      speak('Đúng rồi! Chữ ' + correctReading, 'vi-VN');
      showCelebration();
      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(function () {
        autoNextTimer = null;
        showQuestion();
      }, 3000);
    } else {
      var scoreBeforeReset = S.getScore();
      btn.classList.add('wrong');
      feedbackEl.textContent = 'Bạn được ' + scoreBeforeReset + ' điểm.';
      feedbackEl.className = 'feedback error';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playWrong();
      speak('Chữ ' + correctReading + '.', 'vi-VN');
      showWrongEffect();
      setTimeout(function () { setScore(0); }, 2500);
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
      if (window.alphabetSetMode) window.alphabetSetMode('listen');
    });
  }
  if (S.btnListenPlay) {
    S.btnListenPlay.addEventListener('click', function () {
      if (window.alphabetGameMode !== 'listen') return;
      speak('Đâu là chữ ' + correctReading + '?', 'vi-VN');
    });
  }

  if (!window.alphabetModes) window.alphabetModes = {};
  window.alphabetModes.listen = { show: showQuestion, cleanup: stopAllReplay };
})();
