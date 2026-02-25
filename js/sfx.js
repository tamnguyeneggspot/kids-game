/**
 * Hiệu ứng âm thanh dùng chung (ting đúng, buzz sai).
 * Dùng Web Audio API (GainNode) để volume theo Settings, hoạt động trên Safari iOS.
 * API: window.webGameSfx.playCorrect(), window.webGameSfx.playWrong()
 */
(function () {
  'use strict';

  let ctx = null;
  const SFX_VOLUME_DEFAULT = 1;

  function getCtx() {
    if (ctx) return ctx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    return ctx;
  }

  /** Volume từ Settings (Volume giọng đọc); fallback 1 nếu chưa load settings. */
  function getSfxVolume() {
    if (window.WebGameSettings && typeof window.WebGameSettings.getVoiceVolume === 'function') {
      var v = window.WebGameSettings.getVoiceVolume();
      if (typeof v === 'number' && v >= 0 && v <= 1) return v;
    }
    return SFX_VOLUME_DEFAULT;
  }

  /** Tiếng "ting" khi chọn đúng. */
  function playCorrect() {
    const c = getCtx();
    if (!c) return;
    try {
      var vol = getSfxVolume();
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.setValueAtTime(vol, c.currentTime);
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
      var vol = getSfxVolume() * 0.9;
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.type = 'sawtooth';
      o.frequency.value = 120;
      g.gain.setValueAtTime(vol, c.currentTime);
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
