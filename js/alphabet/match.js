(function () {
  'use strict';

  var S = window.alphabetShared;
  if (!S) return;

  var LETTERS = S.LETTERS;
  var LETTER_READINGS = S.LETTER_READINGS;
  var LETTER_IMAGES = S.LETTER_IMAGES;
  var CHOICES_COUNT_MATCH = S.CHOICES_COUNT_MATCH;
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
  var MATCH_REPLAY_MS = 60 * 1000;
  var matchReplayInterval = null;
  var matchAutoPlayTimer = null;

  function stopMatchReplay() {
    if (matchReplayInterval) {
      clearInterval(matchReplayInterval);
      matchReplayInterval = null;
    }
    if (matchAutoPlayTimer) {
      clearTimeout(matchAutoPlayTimer);
      matchAutoPlayTimer = null;
    }
  }

  function showMatchQuestion() {
    questionText.classList.remove('training-letter');
    if (readingText) readingText.hidden = true;
    answered = false;
    var lettersWithImages = LETTERS.filter(function (c) { return LETTER_IMAGES[c]; });
    if (lettersWithImages.length === 0) return;
    var letterIdx = randomInt(0, lettersWithImages.length - 1);
    correctLetter = lettersWithImages[letterIdx];
    correctReading = LETTER_READINGS[correctLetter];

    questionText.textContent = 'Chọn hình đúng với chữ:';
    if (letterDisplayWrap) {
      letterDisplayWrap.innerHTML = '';
      var letterSpan = document.createElement('span');
      letterSpan.className = 'letter-display letter-display-match';
      letterSpan.textContent = correctLetter;
      letterSpan.setAttribute('aria-label', 'Chữ ' + correctLetter);
      letterDisplayWrap.appendChild(letterSpan);
      letterDisplayWrap.setAttribute('aria-label', 'Chữ ' + correctLetter);
    }

    var wrongLetters = getWrongLetters(correctLetter, CHOICES_COUNT_MATCH - 1);
    var options = shuffle([correctLetter].concat(wrongLetters));
    choicesEl.innerHTML = '';
    choicesEl.classList.add('choices-match');
    options.forEach(function (letter) {
      var info = LETTER_IMAGES[letter];
      if (!info) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn choice-btn-match';
      btn.setAttribute('aria-label', info.label + ' – chữ ' + letter);
      var emojiSpan = document.createElement('span');
      emojiSpan.className = 'choice-btn-match-emoji';
      emojiSpan.textContent = info.emoji;
      var labelSpan = document.createElement('span');
      labelSpan.className = 'choice-btn-match-label';
      labelSpan.textContent = info.label;
      btn.appendChild(emojiSpan);
      btn.appendChild(labelSpan);
      btn.addEventListener('click', function () { onChoiceMatch(letter, btn); });
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
    stopMatchReplay();
    removeCelebration();
    removeWrongEffect();

    function playMatchQuestion() {
      speak('Chọn hình đúng với chữ: ' + correctLetter, 'vi-VN');
    }
    matchAutoPlayTimer = setTimeout(function () {
      matchAutoPlayTimer = null;
      playMatchQuestion();
      matchReplayInterval = setInterval(function () {
        if (answered) {
          if (matchReplayInterval) clearInterval(matchReplayInterval);
          matchReplayInterval = null;
          return;
        }
        playMatchQuestion();
      }, MATCH_REPLAY_MS);
    }, 500);
  }

  function onChoiceMatch(letter, btn) {
    if (answered) return;
    answered = true;
    stopMatchReplay();
    var allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(function (b) { b.disabled = true; });

    if (letter === correctLetter) {
      addScore();
      btn.classList.add('correct');
      feedbackEl.textContent = 'Đúng rồi! 🎉';
      feedbackEl.className = 'feedback success';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      var info = LETTER_IMAGES[correctLetter];
      speak('Đúng rồi! Chữ ' + correctLetter + ' – ' + (info ? info.label : ''), 'vi-VN');
      showCelebration();
      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(function () {
        autoNextTimer = null;
        showMatchQuestion();
      }, 6000);
    } else {
      var scoreBeforeReset = S.getScore();
      btn.classList.add('wrong');
      feedbackEl.textContent = 'Bạn được ' + scoreBeforeReset + ' điểm.';
      feedbackEl.className = 'feedback error';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playWrong();
      var info = LETTER_IMAGES[correctLetter];
      speak('Chữ ' + correctLetter + ' – ' + (info ? info.label : correctReading) + '.', 'vi-VN');
      showWrongEffect();
      setTimeout(function () { setScore(0); }, 2500);
      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(function () {
        autoNextTimer = null;
        showMatchQuestion();
      }, 6000);
    }
    btnNext.hidden = false;
    btnNext.focus();
  }

  if (S.modeMatch) {
    S.modeMatch.addEventListener('click', function () {
      if (window.alphabetSetMode) window.alphabetSetMode('match');
    });
  }

  if (!window.alphabetModes) window.alphabetModes = {};
  window.alphabetModes.match = { show: showMatchQuestion, cleanup: stopMatchReplay };
})();
