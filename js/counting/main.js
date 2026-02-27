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
  var modeCompare = S.modeCompare;
  var modeFill = S.modeFill;

  window.countingGameMode = 'listen';

  function setMode(mode) {
    if (modes[window.countingGameMode] && modes[window.countingGameMode].cleanup) {
      modes[window.countingGameMode].cleanup();
    }
    window.countingGameMode = mode;

    var isTraining = mode === 'training';
    var isListen = mode === 'listen';
    var isPlay = mode === 'play';
    var isCompare = mode === 'compare';
    var isFill = mode === 'fill';

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
    if (modeCompare) {
      modeCompare.classList.toggle('active', mode === 'compare');
      modeCompare.setAttribute('aria-selected', mode === 'compare' ? 'true' : 'false');
    }
    if (modeFill) {
      modeFill.classList.toggle('active', mode === 'fill');
      modeFill.setAttribute('aria-selected', mode === 'fill' ? 'true' : 'false');
    }

    document.body.classList.toggle('mode-listen', isListen);
    document.body.classList.toggle('mode-compare', isCompare);
    document.body.classList.toggle('mode-fill', isFill);

    if (scoreEl) scoreEl.style.display = (isTraining ? 'none' : '');
    choicesEl.style.display = (isTraining ? 'none' : '');
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

  var COUNTING_MODE_KEY = 'countingMode';
  var VALID_MODES = ['training', 'listen', 'play', 'compare', 'fill'];

  function saveMode(mode) {
    try {
      localStorage.setItem(COUNTING_MODE_KEY, mode);
    } catch (e) {}
  }

  function getSavedMode() {
    try {
      var saved = localStorage.getItem(COUNTING_MODE_KEY);
      return saved && VALID_MODES.indexOf(saved) !== -1 ? saved : 'listen';
    } catch (e) {
      return 'listen';
    }
  }

  function setModeAndSave(mode) {
    setMode(mode);
    saveMode(mode);
  }

  window.countingSetMode = setModeAndSave;

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

  setMode(getSavedMode());
})();
