/**
 * Cài đặt dùng chung cho mọi trang.
 * Nút cài đặt góc phải trên; click mở panel dạng dropdown (giống doc).
 * Trong panel: bật/tắt nhạc nền, giọng đọc (TTS), v.v.
 */
(function () {
  'use strict';

  const ROOT_ID = 'webgame-settings-root';
  const PANEL_ID = 'webgame-settings-panel';
  const BTN_ID = 'webgame-settings-btn';
  const VOICE_SELECT_ID = 'webgame-settings-voice-select';
  const VOICE_TEST_ID = 'webgame-settings-voice-test';
  const STORAGE_KEY_VOICE = 'webgame-voice';
  const STORAGE_KEY_MUSIC_VOLUME = 'webgame-music-volume';
  const STORAGE_KEY_VOICE_VOLUME = 'webgame-voice-volume';
  const DEFAULT_MUSIC_VOLUME = 0.2;
  const DEFAULT_VOICE_VOLUME = 1;

  /** Giọng ưu tiên: nữ, tiếng Việt (cute cho bé). */
  let preferredVoice = null;
  /** Danh sách giọng (để chọn theo index từ dropdown). */
  let allVoices = [];

  function getRoot() {
    return document.getElementById(ROOT_ID);
  }

  function getVoiceSelect() {
    return document.getElementById(VOICE_SELECT_ID);
  }

  function getVoiceTestBtn() {
    return document.getElementById(VOICE_TEST_ID);
  }

  /**
   * Chọn giọng nữ, ưu tiên tiếng Việt. Loại bỏ giọng nam.
   */
  function pickFemaleVoice() {
    const voices = window.speechSynthesis.getVoices();
    const maleKeywords = ['nam ', 'namminh', 'male', 'david', 'mark', 'paul', 'daniel', 'james', 'george', 'nam minh'];
    function isLikelyMale(voice) {
      const n = (voice.name || '').toLowerCase();
      return maleKeywords.some(function (k) { return n.includes(k); });
    }
    const femaleKeywords = ['female', 'nữ', 'hoaimy', 'hồng', 'lan', 'zira', 'samantha', 'linh', 'mai'];
    function isLikelyFemale(voice) {
      const n = (voice.name || '').toLowerCase();
      return femaleKeywords.some(function (k) { return n.includes(k); });
    }
    const viVoices = voices.filter(function (v) { return v.lang.startsWith('vi'); });
    const viFemale = viVoices.filter(function (v) { return isLikelyFemale(v) && !isLikelyMale(v); });
    const viNotMale = viVoices.filter(function (v) { return !isLikelyMale(v); });
    const chosen = viFemale[0] || viNotMale[0] || voices.filter(function (v) { return isLikelyFemale(v) && !isLikelyMale(v); })[0] || null;
    preferredVoice = chosen;
  }

  /** Điền dropdown: chỉ giọng tiếng Việt, hiển thị icon + số (🎤 1, 🎤 2, ...). */
  function fillVoiceSelect() {
    const voices = window.speechSynthesis.getVoices();
    const sel = getVoiceSelect();
    if (!voices.length || !sel) return;
    allVoices = voices.filter(function (v) { return v.lang.startsWith('vi'); });
    sel.innerHTML = '';
    allVoices.forEach(function (voice, index) {
      const opt = document.createElement('option');
      opt.value = index;
      opt.textContent = '🎤 ' + (index + 1);
      opt.setAttribute('title', voice.name);
      sel.appendChild(opt);
    });
    if (preferredVoice) {
      const idx = allVoices.indexOf(preferredVoice);
      if (idx !== -1) sel.value = idx;
      else if (allVoices.length) { sel.value = 0; preferredVoice = allVoices[0]; }
    } else if (allVoices.length) { sel.value = 0; preferredVoice = allVoices[0]; }
  }

  /** Lưu giọng đã chọn vào localStorage (name + lang). */
  function saveVoiceToStorage() {
    if (!preferredVoice || !window.localStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY_VOICE, JSON.stringify({
        name: preferredVoice.name,
        lang: preferredVoice.lang
      }));
    } catch (e) { /* ignore */ }
  }

  /** Khôi phục giọng từ localStorage. */
  function loadVoiceFromStorage() {
    if (!window.localStorage) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_VOICE);
      if (!raw) return null;
      const data = JSON.parse(raw);
      const voices = window.speechSynthesis.getVoices();
      return voices.find(function (v) {
        return v.lang === data.lang && (v.name === data.name || !data.name);
      }) || voices.find(function (v) { return v.lang === data.lang; }) || null;
    } catch (e) { return null; }
  }

  function getMusicVolume() {
    if (!window.localStorage) return DEFAULT_MUSIC_VOLUME;
    try {
      const v = parseFloat(window.localStorage.getItem(STORAGE_KEY_MUSIC_VOLUME), 10);
      if (!isNaN(v) && v >= 0 && v <= 1) return v;
    } catch (e) {}
    return DEFAULT_MUSIC_VOLUME;
  }

  function getVoiceVolume() {
    if (!window.localStorage) return DEFAULT_VOICE_VOLUME;
    try {
      const v = parseFloat(window.localStorage.getItem(STORAGE_KEY_VOICE_VOLUME), 10);
      if (!isNaN(v) && v >= 0 && v <= 1) return v;
    } catch (e) {}
    return DEFAULT_VOICE_VOLUME;
  }

  function setMusicVolume(value) {
    const v = Math.max(0, Math.min(1, value));
    try {
      if (window.localStorage) window.localStorage.setItem(STORAGE_KEY_MUSIC_VOLUME, String(v));
    } catch (e) {}
    if (window.WebGameMusic && window.WebGameMusic.setVolume) window.WebGameMusic.setVolume(v);
  }

  function setVoiceVolume(value) {
    const v = Math.max(0, Math.min(1, value));
    try {
      if (window.localStorage) window.localStorage.setItem(STORAGE_KEY_VOICE_VOLUME, String(v));
    } catch (e) {}
  }

  function onVoiceSelectChange() {
    const sel = getVoiceSelect();
    if (!sel) return;
    const idx = parseInt(sel.value, 10);
    if (!isNaN(idx) && allVoices[idx]) {
      preferredVoice = allVoices[idx];
      saveVoiceToStorage();
      /* Áp dụng ngay vào game: lần speak tiếp theo sẽ dùng giọng mới. */
    }
  }

  /**
   * TTS dùng chung cho mọi trang (all pages).
   * Dùng volume giọng đọc từ Settings (slider "Volume giọng đọc" / webgame-voice-volume).
   * Cách gọi: window.webGameSpeak('Đúng rồi!') hoặc window.WebGameVoice.speak('Đúng rồi!', 'vi-VN').
   */
  function speak(text, lang) {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || 'vi-VN';
    u.rate = 0.9;
    u.volume = getVoiceVolume();
    if (preferredVoice) u.voice = preferredVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  window.WebGameVoice = {
    speak: speak,
    getVoiceVolume: getVoiceVolume
  };
  /** Alias dùng chung cho mọi trang: luôn dùng volume từ settings.js */
  window.webGameSpeak = speak;
  window.WebGameSettings = {
    getMusicVolume: getMusicVolume,
    getVoiceVolume: getVoiceVolume,
    setMusicVolume: setMusicVolume,
    setVoiceVolume: setVoiceVolume
  };

  function createWidget() {
    if (getRoot()) return getRoot();

    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'webgame-settings';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = BTN_ID;
    btn.className = 'webgame-settings-btn';
    btn.setAttribute('aria-label', 'Cài đặt');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'true');
    btn.innerHTML = '⚙️';
    btn.title = 'Cài đặt';

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.className = 'webgame-settings-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Cài đặt');
    panel.hidden = true;

    panel.innerHTML =
      '<div class="webgame-settings-panel-header">Cài đặt</div>' +
      '<div class="webgame-settings-panel-body">' +
        '<div class="webgame-settings-row">' +
          '<span class="webgame-settings-label">🔊 Nhạc nền</span>' +
          '<button type="button" class="webgame-settings-toggle" id="webgame-settings-music-toggle" aria-pressed="true" title="Bật/tắt nhạc nền">' +
            '<span class="webgame-settings-toggle-inner"></span>' +
          '</button>' +
        '</div>' +
        '<div class="webgame-settings-row webgame-settings-row-volume">' +
          '<span class="webgame-settings-label">Volume nhạc nền</span>' +
          '<input type="range" id="webgame-settings-music-volume" class="webgame-settings-volume" min="0" max="100" value="50" aria-label="Volume nhạc nền">' +
        '</div>' +
        '<div class="webgame-settings-row webgame-settings-row-voice">' +
          '<span class="webgame-settings-label">🎤 Giọng đọc</span>' +
          '<select id="' + VOICE_SELECT_ID + '" class="webgame-settings-voice-select" aria-label="Chọn giọng đọc"></select>' +
          '<button type="button" class="webgame-settings-voice-test" id="' + VOICE_TEST_ID + '" title="Nghe thử">Nghe thử</button>' +
        '</div>' +
        '<div class="webgame-settings-row webgame-settings-row-volume">' +
          '<span class="webgame-settings-label">Volume giọng đọc</span>' +
          '<input type="range" id="webgame-settings-voice-volume" class="webgame-settings-volume" min="0" max="100" value="100" aria-label="Volume giọng đọc">' +
        '</div>' +
      '</div>';

    root.appendChild(btn);
    root.appendChild(panel);
    document.body.appendChild(root);

    return root;
  }

  function isPanelOpen() {
    const panel = document.getElementById(PANEL_ID);
    return panel && !panel.hidden;
  }

  function openPanel() {
    const panel = document.getElementById(PANEL_ID);
    const btn = document.getElementById(BTN_ID);
    if (!panel || !btn) return;
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    updateMusicToggleUI();
    syncVolumeSliders();
    fillVoiceSelect();
  }

  function closePanel() {
    const panel = document.getElementById(PANEL_ID);
    const btn = document.getElementById(BTN_ID);
    if (!panel || !btn) return;
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  function togglePanel() {
    if (isPanelOpen()) closePanel();
    else openPanel();
  }

  function updateMusicToggleUI() {
    const toggle = document.getElementById('webgame-settings-music-toggle');
    if (!toggle) return;
    const on = window.WebGameMusic && window.WebGameMusic.isOn();
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    toggle.classList.toggle('webgame-settings-toggle-on', on);
    toggle.title = on ? 'Tắt nhạc nền' : 'Bật nhạc nền';
  }

  function initMusicToggle() {
    const toggle = document.getElementById('webgame-settings-music-toggle');
    if (!toggle || !window.WebGameMusic) return;

    toggle.addEventListener('click', function () {
      window.WebGameMusic.toggle();
      updateMusicToggleUI();
      if (window.WebGameMusic.updateUI) window.WebGameMusic.updateUI();
    });
  }

  function syncVolumeSliders() {
    const musicSlider = document.getElementById('webgame-settings-music-volume');
    const voiceSlider = document.getElementById('webgame-settings-voice-volume');
    if (musicSlider) musicSlider.value = Math.round(getMusicVolume() * 100);
    if (voiceSlider) voiceSlider.value = Math.round(getVoiceVolume() * 100);
  }

  function initVolumeSliders() {
    const musicSlider = document.getElementById('webgame-settings-music-volume');
    const voiceSlider = document.getElementById('webgame-settings-voice-volume');
    if (musicSlider) {
      musicSlider.value = Math.round(getMusicVolume() * 100);
      musicSlider.addEventListener('input', function () {
        setMusicVolume(parseInt(musicSlider.value, 10) / 100);
      });
    }
    if (voiceSlider) {
      voiceSlider.value = Math.round(getVoiceVolume() * 100);
      voiceSlider.addEventListener('input', function () {
        setVoiceVolume(parseInt(voiceSlider.value, 10) / 100);
      });
    }
  }

  function initVoice() {
    if (!window.speechSynthesis) return;
    var saved = loadVoiceFromStorage();
    if (saved) preferredVoice = saved;
    else pickFemaleVoice();
    window.speechSynthesis.onvoiceschanged = function () {
      if (!preferredVoice) pickFemaleVoice();
      var again = loadVoiceFromStorage();
      if (again) preferredVoice = again;
      fillVoiceSelect();
    };
    fillVoiceSelect();
    const sel = getVoiceSelect();
    if (sel) sel.addEventListener('change', onVoiceSelectChange);
    const testBtn = getVoiceTestBtn();
    if (testBtn) {
      testBtn.addEventListener('click', function () {
        speak('Đúng rồi! Số ba.', 'vi-VN');
      });
    }
  }

  function handleClickOutside(e) {
    const root = getRoot();
    const panel = document.getElementById(PANEL_ID);
    const btn = document.getElementById(BTN_ID);
    if (!root || !panel || !btn) return;
    if (panel.hidden) return;
    if (root.contains(e.target)) return;
    closePanel();
  }

  function init() {
    createWidget();
    initMusicToggle();
    initVolumeSliders();
    initVoice();
    updateMusicToggleUI();

    const btn = document.getElementById(BTN_ID);
    const panel = document.getElementById(PANEL_ID);
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePanel();
      });
    }
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isPanelOpen()) closePanel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
