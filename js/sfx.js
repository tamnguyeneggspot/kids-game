/**
 * Hiệu ứng âm thanh dùng chung (ting đúng, buzz sai).
 * Dùng Web Audio API, không cần file âm thanh.
 * API: window.webGameSfx.playCorrect(), window.webGameSfx.playWrong()
 */
(function () {
  'use strict';

  let ctx = null;
  const SFX_VOLUME = 1;

  function getCtx() {
    if (ctx) return ctx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    return ctx;
  }

  /** Tiếng "ting" khi chọn đúng. */
  function playCorrect() {
    const c = getCtx();
    if (!c) return;
    try {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.setValueAtTime(SFX_VOLUME, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.18);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.18);
    } catch (e) {}
  }

  /** Tiếng "buzz" khi chọn sai. */
  function playWrong() {
    const c = getCtx();
    if (!c) return;
    try {
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.type = 'sawtooth';
      o.frequency.value = 120;
      g.gain.setValueAtTime(SFX_VOLUME * 0.9, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.25);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.25);
    } catch (e) {}
  }

  window.webGameSfx = {
    playCorrect: playCorrect,
    playWrong: playWrong
  };
})();
