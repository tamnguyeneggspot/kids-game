/**
 * Lưu điểm (và high score) theo từng game qua localStorage.
 */
(function () {
  'use strict';
  var PREFIX = 'webGameDiem_';
  var HIGH_PREFIX = 'webGameHigh_';

  function loadDiem(gameKey) {
    try {
      var s = localStorage.getItem(PREFIX + gameKey);
      return s ? parseInt(s, 10) : 0;
    } catch (e) { return 0; }
  }

  function saveDiem(gameKey, value) {
    try {
      localStorage.setItem(PREFIX + gameKey, String(value));
    } catch (e) {}
  }

  function saveHighScore(gameKey, value) {
    try {
      var key = HIGH_PREFIX + gameKey;
      var cur = parseInt(localStorage.getItem(key), 10) || 0;
      if (value > cur) localStorage.setItem(key, String(value));
    } catch (e) {}
  }

  window.webGameDiem = {
    loadDiem: loadDiem,
    saveDiem: saveDiem,
    saveHighScore: saveHighScore
  };
})();
