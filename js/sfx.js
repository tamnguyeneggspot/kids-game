/**
 * Hiệu ứng âm thanh (đúng/sai). Có thể dùng Web Audio hoặc Audio element.
 */
(function () {
  'use strict';

  function playCorrect() {
    if (window.webGameSettings && !window.webGameSettings.get('sfxOn')) return;
    try {
      var ctx = window.webGameAudioContext;
      if (ctx) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 523;
        o.type = 'sine';
        g.gain.setValueAtTime(0.15, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {}
  }

  function playWrong() {
    if (window.webGameSettings && !window.webGameSettings.get('sfxOn')) return;
    try {
      var ctx = window.webGameAudioContext;
      if (ctx) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 200;
        o.type = 'sawtooth';
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {}
  }

  // Khởi tạo AudioContext trên lần tương tác đầu (click/touch)
  function initContext() {
    if (window.webGameAudioContext) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) window.webGameAudioContext = new Ctx();
    } catch (e) {}
  }
  document.addEventListener('click', initContext, { once: true });
  document.addEventListener('touchstart', initContext, { once: true });

  window.webGameSfx = { playCorrect: playCorrect, playWrong: playWrong };
})();
