(function () {
  'use strict';

  var S = window.countingShared;
  var modes = window.countingModes;
  if (!S || !modes) return;

  var scoreEl = S.scoreEl;
  var choicesEl = S.choicesEl;
  var feedbackEl = S.feedbackEl;
  var btnNext = S.btnNext;
  var trainingActions = S.trainingActions;
  var readingText = S.readingText;
  var playListenWrap = S.playListenWrap;
  var modeTraining = S.modeTraining;
  var modePlay = S.modePlay;
  var modeListen = S.modeListen;

  window.countingGameMode = 'training';

  function setMode(mode) {
    if (modes[window.countingGameMode] && modes[window.countingGameMode].cleanup) {
      modes[window.countingGameMode].cleanup();
    }
    window.countingGameMode = mode;

    var isTraining = mode === 'training';
    var isListen = mode === 'listen';
    var isPlay = mode === 'play';

    if (modeTraining) {
      modeTraining.classList.toggle('active', mode === 'training');
      modeTraining.setAttribute('aria-selected', mode === 'training' ? 'true' : 'false');
    }
    if (modePlay) {
      modePlay.classList.toggle('active', mode === 'play');
      modePlay.setAttribute('aria-selected', mode === 'play' ? 'true' : 'false');
    }
    if (modeListen) {
      modeListen.classList.toggle('active', mode === 'listen');
      modeListen.setAttribute('aria-selected', mode === 'listen' ? 'true' : 'false');
    }

    document.body.classList.toggle('mode-listen', isListen);

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

    if (modes[mode] && modes[mode].show) {
      modes[mode].show();
    }
  }

  window.countingSetMode = setMode;

  btnNext.addEventListener('click', function () {
    var mode = window.countingGameMode;
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
