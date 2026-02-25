(function () {
  'use strict';

  var S = window.colorShared;
  if (!S) return;

  var COLORS = S.COLORS;
  var questionText = S.questionText;
  var readingText = S.readingText;
  var colorDisplayWrap = S.colorDisplayWrap;
  var speak = S.speak;
  var createSwatchEl = S.createSwatchEl;

  var trainingIndex = 0;

  function showTrainingScreen() {
    var color = COLORS[trainingIndex];

    questionText.textContent = 'Màu này gọi là gì?';
    questionText.classList.remove('training-color');
    if (readingText) {
      readingText.textContent = color.name;
      readingText.hidden = false;
    }
    if (colorDisplayWrap) {
      colorDisplayWrap.innerHTML = '';
      var swatchWrap = createSwatchEl(color.hex, null);
      colorDisplayWrap.appendChild(swatchWrap);
      colorDisplayWrap.setAttribute('aria-label', 'Màu ' + color.name);
    }
    speak(color.name, 'vi-VN');
  }

  function nextTrainingColor() {
    trainingIndex = (trainingIndex + 1) % COLORS.length;
    showTrainingScreen();
  }

  function cleanup() {
    // nothing to clear for training
  }

  if (S.modeTraining) {
    S.modeTraining.addEventListener('click', function () {
      if (window.colorSetMode) window.colorSetMode('training');
    });
  }
  if (S.btnListen) {
    S.btnListen.addEventListener('click', function () {
      if (window.colorGameMode !== 'training') return;
      var color = COLORS[trainingIndex];
      speak(color.name, 'vi-VN');
    });
  }
  if (S.btnNextTraining) {
    S.btnNextTraining.addEventListener('click', nextTrainingColor);
  }
  document.body.addEventListener('click', function (ev) {
    if (window.colorGameMode !== 'training') return;
    if (ev.target.closest('#btnNextTraining')) return;
    var color = COLORS[trainingIndex];
    speak(color.name, 'vi-VN');
  });

  if (!window.colorModes) window.colorModes = {};
  window.colorModes.training = { show: showTrainingScreen, cleanup: cleanup };
})();
