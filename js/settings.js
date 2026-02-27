/**
 * Cài đặt game (âm lượng, tắt/bật nhạc...). Lưu trong localStorage.
 */
(function () {
  'use strict';
  var KEY = 'webGameSettings';
  var defaults = {
    musicOn: true,
    sfxOn: true,
    volume: 0.1,
    voiceIndex: 0,
    voiceVolume: 1
  };

  function load() {
    try {
      var s = localStorage.getItem(KEY);
      if (s) return Object.assign({}, defaults, JSON.parse(s));
    } catch (e) {}
    return Object.assign({}, defaults);
  }

  function save(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  }

  var settings = load();
  window.webGameSettings = {
    get: function (k) { return settings[k]; },
    set: function (k, v) { settings[k] = v; save(settings); },
    getAll: function () { return Object.assign({}, settings); }
  };

  /** Lấy danh sách giọng tiếng Việt (vi-VN) */
  function getVietnameseVoices() {
    if (!window.speechSynthesis) return [];
    var all = window.speechSynthesis.getVoices();
    return all.filter(function (v) { return v.lang === 'vi-VN' || v.lang.indexOf('vi') === 0; });
  }

  window.webGameGetVietnameseVoices = getVietnameseVoices;

  /** Đọc text bằng giọng đã chọn (vi-VN), dùng voiceIndex và voiceVolume từ settings */
  window.webGameSpeak = function (text, lang) {
    try {
      if (!window.speechSynthesis) return;
      var voices = getVietnameseVoices();
      var s = window.webGameSettings ? window.webGameSettings.getAll() : {};
      var idx = Math.max(0, Math.min(s.voiceIndex || 0, voices.length - 1));
      var vol = typeof s.voiceVolume === 'number' ? s.voiceVolume : 1;
      vol = Math.max(0, Math.min(1, vol));
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'vi-VN';
      u.rate = 0.9;
      u.volume = vol;
      if (voices[idx]) u.voice = voices[idx];
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };
})();
