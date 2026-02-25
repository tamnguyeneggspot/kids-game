(function () {
  'use strict';

  var S = window.colorShared;
  var modes = window.colorModes;
  if (!S || !modes) return;

  var scoreEl = S.scoreEl;
  var choicesEl = S.choicesEl;
  var feedbackEl = S.feedbackEl;
  var btnNext = S.btnNext;
  var trainingActions = S.trainingActions;
  var readingText = S.readingText;
  var playListenWrap = S.playListenWrap;
  var modeTraining = S.modeTraining;
  var modeListen = S.modeListen;

  window.colorGameMode = 'training';

  function setMode(mode) {
    if (modes[window.colorGameMode] && modes[window.colorGameMode].cleanup) {
      modes[window.colorGameMode].cleanup();
    }
    window.colorGameMode = mode;

    var isTraining = mode === 'training';
    var isListen = mode === 'listen';

    if (modeTraining) {
      modeTraining.classList.toggle('active', mode === 'training');
      modeTraining.setAttribute('aria-selected', mode === 'training' ? 'true' : 'false');
    }
    if (modeListen) {
      modeListen.classList.toggle('active', mode === 'listen');
      modeListen.setAttribute('aria-selected', mode === 'listen' ? 'true' : 'false');
    }

    if (scoreEl) scoreEl.style.display = isTraining ? 'none' : '';
    choicesEl.style.display = isTraining ? 'none' : '';
    feedbackEl.hidden = true;
    btnNext.hidden = true;

    if (trainingActions) {
      trainingActions.hidden = !isTraining;
      trainingActions.style.display = isTraining ? '' : 'none';
    }
    if (readingText) readingText.hidden = !isTraining;
    if (playListenWrap) {
      playListenWrap.hidden = !isListen;
      playListenWrap.style.display = isListen ? '' : 'none';
    }

    document.body.classList.toggle('mode-listen', isListen);

    if (modes[mode] && modes[mode].show) {
      modes[mode].show();
    }
  }

  window.colorSetMode = setMode;

  btnNext.addEventListener('click', function () {
    var mode = window.colorGameMode;
    if (modes[mode] && modes[mode].show) {
      modes[mode].show();
    }
    if (mode === 'listen' && S.btnListenPlay) {
      if (document.activeElement && document.activeElement !== S.btnListenPlay) document.activeElement.blur();
      setTimeout(function () { S.btnListenPlay.focus(); }, 0);
    }
  });

  setMode('training');
})();
