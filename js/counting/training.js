(function () {
  'use strict';

  var S = window.countingShared;
  if (!S) return;

  var OBJECTS = S.OBJECTS;
  var NUMBER_READINGS = S.NUMBER_READINGS;
  var questionText = S.questionText;
  var readingText = S.readingText;
  var objectsWrap = S.objectsWrap;
  var speak = S.speak;
  var randomInt = S.randomInt;

  var trainingNumber = 1;

  function showTrainingScreen() {
    var num = trainingNumber;
    var reading = NUMBER_READINGS[num];
    var emoji = OBJECTS[randomInt(0, OBJECTS.length - 1)];

    questionText.textContent = num;
    questionText.classList.add('training-number');
    if (readingText) readingText.hidden = true;
    objectsWrap.innerHTML = '';
    objectsWrap.setAttribute('aria-label', 'Số ' + num + ', đọc là ' + reading);
    for (var i = 0; i < num; i++) {
      var span = document.createElement('span');
      span.className = 'object-item';
      span.setAttribute('role', 'img');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = emoji;
      objectsWrap.appendChild(span);
    }
    speak('Số : ' + reading, 'vi-VN');
  }

  function nextTrainingNumber() {
    trainingNumber = trainingNumber >= S.MAX_COUNT ? S.MIN_COUNT : trainingNumber + 1;
    showTrainingScreen();
  }

  function cleanup() {}

  if (S.modeTraining) {
    S.modeTraining.addEventListener('click', function () {
      if (window.countingSetMode) window.countingSetMode('training');
    });
  }
  if (S.btnListen) {
    S.btnListen.addEventListener('click', function () {
      if (window.countingGameMode !== 'training') return;
      var reading = NUMBER_READINGS[trainingNumber];
      speak('Số : ' + reading, 'vi-VN');
    });
  }
  if (S.btnNextTraining) {
    S.btnNextTraining.addEventListener('click', nextTrainingNumber);
  }
  document.body.addEventListener('click', function (ev) {
    if (window.countingGameMode !== 'training') return;
    if (ev.target.closest('#btnNextTraining')) return;
    var reading = NUMBER_READINGS[trainingNumber];
    speak('Số : ' + reading, 'vi-VN');
  });

  if (!window.countingModes) window.countingModes = {};
  window.countingModes.training = { show: showTrainingScreen, cleanup: cleanup };
})();
