(function () {
  'use strict';

  var S = window.alphabetShared;
  if (!S) return;

  var LETTERS = S.LETTERS;
  var LETTER_READINGS = S.LETTER_READINGS;
  var questionText = S.questionText;
  var readingText = S.readingText;
  var letterDisplayWrap = S.letterDisplayWrap;
  var speak = S.speak;

  var trainingIndex = 0;

  function showTrainingScreen() {
    var letter = LETTERS[trainingIndex];
    var reading = LETTER_READINGS[letter];

    questionText.textContent = letter;
    questionText.classList.add('training-letter');
    if (readingText) {
      readingText.textContent = reading;
      readingText.hidden = false;
    }
    if (letterDisplayWrap) {
      letterDisplayWrap.innerHTML = '';
      letterDisplayWrap.setAttribute('aria-label', reading);
    }
    speak(reading, 'vi-VN');
  }

  function nextTrainingLetter() {
    trainingIndex = (trainingIndex + 1) % LETTERS.length;
    showTrainingScreen();
  }

  function cleanup() {
    // nothing to clear for training
  }

  if (S.modeTraining) {
    S.modeTraining.addEventListener('click', function () {
      if (window.alphabetSetMode) window.alphabetSetMode('training');
    });
  }
  if (S.btnListen) {
    S.btnListen.addEventListener('click', function () {
      if (window.alphabetGameMode !== 'training') return;
      var letter = LETTERS[trainingIndex];
      var reading = LETTER_READINGS[letter];
      speak(reading, 'vi-VN');
    });
  }
  if (S.btnNextTraining) {
    S.btnNextTraining.addEventListener('click', nextTrainingLetter);
  }
  document.body.addEventListener('click', function (ev) {
    if (window.alphabetGameMode !== 'training') return;
    if (ev.target.closest('#btnNextTraining')) return;
    var letter = LETTERS[trainingIndex];
    var reading = LETTER_READINGS[letter];
    speak(reading, 'vi-VN');
  });

  if (!window.alphabetModes) window.alphabetModes = {};
  window.alphabetModes.training = { show: showTrainingScreen, cleanup: cleanup };
})();
