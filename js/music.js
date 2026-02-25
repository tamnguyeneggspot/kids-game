/**
 * Nhạc nền dùng chung cho mọi trang WebGame.
 * - Tự tạo thẻ <audio> nếu chưa có (mọi trang chỉ cần load script).
 * - Lưu trạng thái bật/tắt vào localStorage (key: webgame-bgmusic).
 * - Trên Safari iOS (Private mode / Block cookies) localStorage có thể throw → dùng fallback in-memory.
 * - API: window.WebGameMusic (toggle, isOn, setOn, play, pause, updateUI).
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'webgame-bgmusic';
  const STORAGE_KEY_VOLUME = 'webgame-music-volume';
  const DEFAULT_ON = true;
  const DEFAULT_VOLUME = 0.1;
  const AUDIO_ID = 'bgMusic';
  const AUDIO_SRC = 'audio/bg-music.mp3';

  /** Storage dùng được hay không (Safari Private / Block cookies → false). Fallback in-memory. */
  var storage = (function () {
    var fallback = {};
    try {
      if (typeof window.localStorage === 'undefined') return { get: function (k) { return fallback[k] ?? null; }, set: function (k, v) { fallback[k] = v; } };
      window.localStorage.setItem('_', '_');
      window.localStorage.removeItem('_');
      return { get: function (k) { return window.localStorage.getItem(k); }, set: function (k, v) { window.localStorage.setItem(k, v); } };
    } catch (e) {
      return { get: function (k) { return fallback[k] ?? null; }, set: function (k, v) { fallback[k] = v; } };
    }
  })();

  function getStored() {
    const v = storage.get(STORAGE_KEY);
    if (v === '0' || v === 'false') return false;
    if (v === '1' || v === 'true') return true;
    return DEFAULT_ON;
  }

  function getStoredVolume() {
    const v = parseFloat(storage.get(STORAGE_KEY_VOLUME), 10);
    if (!isNaN(v) && v >= 0 && v <= 1) return v;
    return DEFAULT_VOLUME;
  }

  function setStored(on) {
    storage.set(STORAGE_KEY, on ? '1' : '0');
  }

  /** Tạo hoặc lấy thẻ audio nhạc nền (dùng chung cho all page). */
  function getOrCreateAudio() {
    let el = document.getElementById(AUDIO_ID);
    if (el) return el;
    el = document.createElement('audio');
    el.id = AUDIO_ID;
    el.setAttribute('aria-label', 'Nhạc nền');
    el.hidden = true;
    el.loop = true;
    el.preload = 'auto';
    el.src = AUDIO_SRC;
    document.body.appendChild(el);
    return el;
  }

  /** Web Audio API: dùng GainNode để điều khiển volume (Safari iOS bỏ qua audio.volume). */
  var audioCtx = null;
  var gainNode = null;

  function ensureWebAudioChain() {
    if (gainNode) return gainNode;
    var el = getOrCreateAudio();
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor || !el) return null;
    try {
      audioCtx = audioCtx || new Ctor();
      var source = audioCtx.createMediaElementSource(el);
      gainNode = audioCtx.createGain();
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      gainNode.gain.value = getStoredVolume();
      return gainNode;
    } catch (e) {
      return null;
    }
  }

  const audio = getOrCreateAudio();
  const btn = document.getElementById('btnMusicToggle');
  let userStarted = false;

  function isOn() {
    return getStored();
  }

  function updateButton() {
    if (!btn) return;
    const on = isOn();
    btn.textContent = on ? '🔊 Tắt nhạc nền' : '🔇 Bật nhạc nền';
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function playMusic() {
    if (!audio || !isOn()) return;
    var vol = getStoredVolume();
    var g = ensureWebAudioChain();
    if (g) {
      g.gain.value = vol;
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
    } else if (audio) {
      audio.volume = vol;
    }
    audio.play().catch(function () {});
  }

  function setVolume(value) {
    const v = Math.max(0, Math.min(1, value));
    storage.set(STORAGE_KEY_VOLUME, String(v));
    var g = ensureWebAudioChain();
    if (g) g.gain.value = v;
    else if (audio) audio.volume = v;
  }

  function pauseMusic() {
    if (audio) audio.pause();
  }

  function setOn(on) {
    userStarted = true;
    setStored(on);
    updateButton();
    if (on) playMusic();
    else pauseMusic();
    return isOn();
  }

  function toggle() {
    userStarted = true;
    const next = !isOn();
    setStored(next);
    updateButton();
    if (next) playMusic();
    else pauseMusic();
    return isOn();
  }

  if (audio) {
    audio.addEventListener('canplaythrough', function () {
      if (isOn() && userStarted) playMusic();
    });
    audio.addEventListener('error', function () {
      if (btn) btn.title = 'Chưa có file nhạc. Đặt file audio/bg-music.mp3 vào thư mục audio.';
    });
  }

  if (btn) {
    btn.addEventListener('click', function () {
      userStarted = true;
      toggle();
    });
  }

  document.body.addEventListener('click', function allowPlay() {
    if (!userStarted) {
      userStarted = true;
      if (isOn()) playMusic();
    }
  }, { once: true });
  document.body.addEventListener('keydown', function allowPlay() {
    if (!userStarted) {
      userStarted = true;
      if (isOn()) playMusic();
    }
  }, { once: true });

  updateButton();
  if (isOn()) playMusic();

  window.WebGameMusic = {
    isOn: isOn,
    toggle: toggle,
    setOn: setOn,
    play: playMusic,
    pause: pauseMusic,
    setVolume: setVolume,
    updateUI: updateButton
  };
})();
