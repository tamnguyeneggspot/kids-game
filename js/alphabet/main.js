(function () {
  'use strict';

  var S = window.alphabetShared;
  var modes = window.alphabetModes;
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
  var modeMatch = S.modeMatch;
  var modeSort = S.modeSort;
  var sortPanel = document.getElementById('sortPanel');

  window.alphabetGameMode = 'listen';

  function setMode(mode) {
    if (modes[window.alphabetGameMode] && modes[window.alphabetGameMode].cleanup) {
      modes[window.alphabetGameMode].cleanup();
    }
    window.alphabetGameMode = mode;

    var isTraining = mode === 'training';
    var isListen = mode === 'listen';
    var isMatch = mode === 'match';
    var isSort = mode === 'sort';

    if (modeTraining) {
      modeTraining.classList.toggle('active', mode === 'training');
      modeTraining.setAttribute('aria-selected', mode === 'training' ? 'true' : 'false');
    }
    if (modeListen) {
      modeListen.classList.toggle('active', mode === 'listen');
      modeListen.setAttribute('aria-selected', mode === 'listen' ? 'true' : 'false');
    }
    if (modeMatch) {
      modeMatch.classList.toggle('active', mode === 'match');
      modeMatch.setAttribute('aria-selected', mode === 'match' ? 'true' : 'false');
    }
    if (modeSort) {
      modeSort.classList.toggle('active', mode === 'sort');
      modeSort.setAttribute('aria-selected', mode === 'sort' ? 'true' : 'false');
    }

    if (sortPanel) sortPanel.hidden = !isSort;
    if (scoreEl) scoreEl.style.display = isTraining ? 'none' : '';
    if (isSort) {
      if (S.questionText && S.letterDisplayWrap) {
        S.questionText.hidden = true;
        S.letterDisplayWrap.hidden = true;
      }
      choicesEl.style.display = 'none';
    } else {
      if (S.questionText && S.letterDisplayWrap) {
        S.questionText.hidden = false;
        S.letterDisplayWrap.hidden = false;
      }
      scoreEl.style.display = isTraining ? 'none' : '';
      choicesEl.style.display = isTraining ? 'none' : '';
    }
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
    document.body.classList.toggle('mode-match', isMatch);
    document.body.classList.toggle('mode-sort', isSort);
    choicesEl.classList.toggle('choices-match', isMatch);

    if (modes[mode] && modes[mode].show) {
      modes[mode].show();
    }
  }

  var ALPHABET_MODE_KEY = 'alphabetMode';
  var VALID_MODES = ['training', 'listen', 'match', 'sort'];

  function saveMode(mode) {
    try {
      localStorage.setItem(ALPHABET_MODE_KEY, mode);
    } catch (e) {}
  }

  function getSavedMode() {
    try {
      var saved = localStorage.getItem(ALPHABET_MODE_KEY);
      return saved && VALID_MODES.indexOf(saved) !== -1 ? saved : 'listen';
    } catch (e) {
      return 'listen';
    }
  }

  function setModeAndSave(mode) {
    setMode(mode);
    saveMode(mode);
  }

  window.alphabetSetMode = setModeAndSave;

  btnNext.addEventListener('click', function () {
    var mode = window.alphabetGameMode;
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
