(function () {
  'use strict';

  var S = window.spotDifferenceShared;
  var G = window.SpotDifferenceGame;
  if (!S || !G) return;

  var levelSelect = document.getElementById('spotDiffLevelSelect');
  var progressEl = document.getElementById('spotDiffProgress');
  var statusEl = document.getElementById('spotDiffStatus');
  var imgLeft = document.getElementById('spotDiffImageLeft');
  var imgRight = document.getElementById('spotDiffImageRight');
  var hitLayer = document.getElementById('spotDiffHitLayer');
  var rightWrap = document.getElementById('spotDiffImageRightWrap');
  var btnReplay = document.getElementById('spotDiffBtnReplay');
  var btnAnother = document.getElementById('spotDiffBtnAnother');

  var currentLevelId = null;

  function getLevelIdFromSelect() {
    if (levelSelect && levelSelect.value) return levelSelect.value;
    var levels = S.getLevels();
    return levels[0] ? levels[0].id : null;
  }

  function setSelectValue(id) {
    if (!levelSelect) return;
    levelSelect.value = id;
  }

  function startLevel(levelId) {
    var level = S.getLevel(levelId);
    if (!level) return;
    currentLevelId = level.id;
    setSelectValue(level.id);

    G.initLevel(level, {
      imgLeft: imgLeft,
      imgRight: imgRight,
      hitLayer: hitLayer,
      progressEl: progressEl,
      statusEl: statusEl,
      rightWrap: rightWrap,
      btnReplay: btnReplay
    });
    G.bindMissHandler();
  }

  function renderLevelSelect() {
    if (!levelSelect) return;
    var levels = S.getLevels();
    levelSelect.innerHTML = '';
    for (var i = 0; i < levels.length; i++) {
      var opt = document.createElement('option');
      opt.value = levels[i].id;
      opt.textContent = levels[i].name || ('Cặp ' + (i + 1));
      levelSelect.appendChild(opt);
    }
  }

  function onReplay() {
    if (S.removeCelebration) S.removeCelebration();
    if (S.removeWrongEffect) S.removeWrongEffect();
    G.resetGame();
  }

  function onAnother() {
    var nextId = S.getNextLevelId(currentLevelId || getLevelIdFromSelect());
    startLevel(nextId);
  }

  if (levelSelect) {
    levelSelect.addEventListener('change', function () {
      startLevel(getLevelIdFromSelect());
    });
  }
  if (btnReplay) btnReplay.addEventListener('click', onReplay);
  if (btnAnother) btnAnother.addEventListener('click', onAnother);

  renderLevelSelect();
  startLevel(getLevelIdFromSelect());
})();

