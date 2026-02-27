/**
 * Nhạc nền cho game.
 * Trình duyệt yêu cầu tương tác người dùng (click/touch) trước khi play.
 */
(function () {
  'use strict';

  var audio = null;
  var started = false;
  var MUSIC_SRC = 'audio/bg-music.mp3';

  function init() {
    if (audio) return;
    try {
      audio = new Audio(MUSIC_SRC);
      audio.loop = true;
      var savedVol = (window.webGameSettings && window.webGameSettings.get('volume')) != null
        ? window.webGameSettings.get('volume') : 0.1;
      audio.volume = Math.max(0, Math.min(1, Number(savedVol) || 0.1));
      audio.addEventListener('error', function () {
        console.warn('Không tải được nhạc nền:', MUSIC_SRC);
      });
    } catch (e) {
      console.warn('Music init error', e);
    }
  }

  function play() {
    if (window.webGameSettings && !window.webGameSettings.get('musicOn')) return;
    init();
    if (audio && !started) {
      var p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(function () { started = true; }).catch(function () {});
      } else {
        started = true;
      }
    }
  }

  function pause() {
    if (audio) {
      audio.pause();
      started = false;
    }
  }

  function setVolume(v) {
    if (audio && v >= 0 && v <= 1) audio.volume = v;
  }

  // Bắt sự kiện click/touch lần đầu để bật nhạc (chính sách autoplay của trình duyệt)
  function startOnFirstInteraction() {
    if (started) return;
    var once = function () {
      play();
      document.removeEventListener('click', once);
      document.removeEventListener('touchstart', once);
      document.removeEventListener('keydown', once);
    };
    document.addEventListener('click', once, { passive: true });
    document.addEventListener('touchstart', once, { passive: true });
    document.addEventListener('keydown', once, { passive: true });
  }

  init();
  startOnFirstInteraction();

  window.webGameMusic = {
    play: play,
    pause: pause,
    setVolume: setVolume,
    init: init
  };
})();
