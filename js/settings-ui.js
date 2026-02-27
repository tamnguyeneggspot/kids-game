/**
 * Shared settings button + panel cho mọi trang.
 * Tự inject widget vào body: nhạc nền (toggle + volume 0.1), SFX toggle,
 * dropdown giọng Việt (icon + số), volume giọng.
 */
(function () {
  'use strict';

  var wrap, btn, panel, musicToggle, musicVolumeInput, sfxToggle, voiceSelect, voiceVolumeInput;

  function getSettings() {
    return window.webGameSettings ? window.webGameSettings.getAll() : {};
  }

  function updateToggle(el, on) {
    if (!el) return;
    el.classList.toggle('webgame-settings-toggle-on', !!on);
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function fillVoiceSelect() {
    if (!voiceSelect || !window.webGameGetVietnameseVoices) return;
    var voices = window.webGameGetVietnameseVoices();
    var savedIndex = (window.webGameSettings && window.webGameSettings.get('voiceIndex')) || 0;
    voiceSelect.innerHTML = '';
    for (var i = 0; i < voices.length; i++) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = '\uD83D\uDD0A ' + (i + 1);
      if (i === savedIndex) opt.selected = true;
      voiceSelect.appendChild(opt);
    }
    if (voices.length === 0) {
      var fallback = document.createElement('option');
      fallback.value = '0';
      fallback.textContent = '\uD83D\uDD0A 1 (mặc định)';
      voiceSelect.appendChild(fallback);
    }
  }

  function syncPanelFromSettings() {
    var s = getSettings();
    updateToggle(musicToggle, s.musicOn !== false);
    updateToggle(sfxToggle, s.sfxOn !== false);
    if (musicVolumeInput) {
      var v = s.volume != null ? Number(s.volume) : 0.1;
      musicVolumeInput.value = Math.max(0, Math.min(1, v));
    }
    if (voiceVolumeInput) {
      var vv = s.voiceVolume != null ? Number(s.voiceVolume) : 1;
      voiceVolumeInput.value = Math.max(0, Math.min(1, vv));
    }
    fillVoiceSelect();
  }

  function openPanel() {
    if (panel) {
      panel.hidden = false;
      if (btn) btn.setAttribute('aria-expanded', 'true');
      syncPanelFromSettings();
    }
  }

  function closePanel() {
    if (panel) {
      panel.hidden = true;
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }

  function togglePanel() {
    if (panel.hidden) openPanel(); else closePanel();
  }

  function buildWidget() {
    wrap = document.createElement('div');
    wrap.className = 'webgame-settings';
    wrap.id = 'webgameSettingsWrap';
    wrap.setAttribute('aria-label', 'Cài đặt');

    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'webgame-settings-btn';
    btn.id = 'webgameSettingsBtn';
    btn.setAttribute('aria-label', 'Mở cài đặt');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'true');
    btn.textContent = '\u2699\uFE0F';

    panel = document.createElement('div');
    panel.className = 'webgame-settings-panel';
    panel.id = 'webgameSettingsPanel';
    panel.hidden = true;

    var header = document.createElement('div');
    header.className = 'webgame-settings-panel-header';
    header.textContent = 'Cài đặt';
    panel.appendChild(header);

    var body = document.createElement('div');
    body.className = 'webgame-settings-panel-body';

    var rowMusic = document.createElement('div');
    rowMusic.className = 'webgame-settings-row';
    rowMusic.innerHTML = '<span class="webgame-settings-label">\uD83C\uDFB5 Nhạc nền</span>';
    musicToggle = document.createElement('button');
    musicToggle.type = 'button';
    musicToggle.className = 'webgame-settings-toggle webgame-settings-toggle-on';
    musicToggle.id = 'settingsMusicToggle';
    musicToggle.setAttribute('aria-pressed', 'true');
    musicToggle.innerHTML = '<span class="webgame-settings-toggle-inner"></span>';
    rowMusic.appendChild(musicToggle);
    body.appendChild(rowMusic);

    var rowMusicVol = document.createElement('div');
    rowMusicVol.className = 'webgame-settings-row webgame-settings-row-volume';
    rowMusicVol.innerHTML = '<span class="webgame-settings-label">Âm lượng nhạc</span>';
    musicVolumeInput = document.createElement('input');
    musicVolumeInput.type = 'range';
    musicVolumeInput.className = 'webgame-settings-volume';
    musicVolumeInput.id = 'settingsMusicVolume';
    musicVolumeInput.min = '0';
    musicVolumeInput.max = '1';
    musicVolumeInput.step = '0.05';
    musicVolumeInput.value = '0.1';
    rowMusicVol.appendChild(musicVolumeInput);
    body.appendChild(rowMusicVol);

    var rowSfx = document.createElement('div');
    rowSfx.className = 'webgame-settings-row';
    rowSfx.innerHTML = '<span class="webgame-settings-label">\uD83D\uDD0A Âm hiệu ứng</span>';
    sfxToggle = document.createElement('button');
    sfxToggle.type = 'button';
    sfxToggle.className = 'webgame-settings-toggle webgame-settings-toggle-on';
    sfxToggle.id = 'settingsSfxToggle';
    sfxToggle.setAttribute('aria-pressed', 'true');
    sfxToggle.innerHTML = '<span class="webgame-settings-toggle-inner"></span>';
    rowSfx.appendChild(sfxToggle);
    body.appendChild(rowSfx);

    var rowVoice = document.createElement('div');
    rowVoice.className = 'webgame-settings-row webgame-settings-row-voice';
    rowVoice.innerHTML = '<span class="webgame-settings-label">\uD83D\uDD0A Giọng đọc</span>';
    voiceSelect = document.createElement('select');
    voiceSelect.className = 'webgame-settings-voice-select';
    voiceSelect.id = 'settingsVoiceSelect';
    voiceSelect.setAttribute('aria-label', 'Chọn giọng đọc tiếng Việt');
    rowVoice.appendChild(voiceSelect);
    body.appendChild(rowVoice);

    var rowVoiceVol = document.createElement('div');
    rowVoiceVol.className = 'webgame-settings-row webgame-settings-row-volume';
    rowVoiceVol.innerHTML = '<span class="webgame-settings-label">Âm lượng giọng</span>';
    voiceVolumeInput = document.createElement('input');
    voiceVolumeInput.type = 'range';
    voiceVolumeInput.className = 'webgame-settings-volume';
    voiceVolumeInput.id = 'settingsVoiceVolume';
    voiceVolumeInput.min = '0';
    voiceVolumeInput.max = '1';
    voiceVolumeInput.step = '0.1';
    voiceVolumeInput.value = '1';
    rowVoiceVol.appendChild(voiceVolumeInput);
    body.appendChild(rowVoiceVol);

    panel.appendChild(body);
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    document.body.appendChild(wrap);
  }

  function bindEvents() {
    if (btn && panel) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePanel();
      });
      document.addEventListener('click', function (e) {
        if (panel && !panel.hidden && !panel.contains(e.target) && e.target !== btn) {
          closePanel();
        }
      });
    }

    if (musicToggle) {
      musicToggle.addEventListener('click', function () {
        var s = getSettings();
        var next = !s.musicOn;
        if (window.webGameSettings) window.webGameSettings.set('musicOn', next);
        updateToggle(musicToggle, next);
        if (window.webGameMusic) {
          if (next) window.webGameMusic.play();
          else window.webGameMusic.pause();
        }
      });
    }

    if (musicVolumeInput) {
      musicVolumeInput.addEventListener('input', function () {
        var v = parseFloat(musicVolumeInput.value, 10);
        if (window.webGameSettings) window.webGameSettings.set('volume', v);
        if (window.webGameMusic) window.webGameMusic.setVolume(v);
      });
    }

    if (sfxToggle) {
      sfxToggle.addEventListener('click', function () {
        var s = getSettings();
        var next = !s.sfxOn;
        if (window.webGameSettings) window.webGameSettings.set('sfxOn', next);
        updateToggle(sfxToggle, next);
      });
    }

    if (voiceSelect) {
      voiceSelect.addEventListener('change', function () {
        var idx = parseInt(voiceSelect.value, 10);
        if (!isNaN(idx) && window.webGameSettings) window.webGameSettings.set('voiceIndex', idx);
      });
    }

    if (voiceVolumeInput) {
      voiceVolumeInput.addEventListener('input', function () {
        var v = parseFloat(voiceVolumeInput.value, 10);
        if (window.webGameSettings) window.webGameSettings.set('voiceVolume', v);
      });
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = function () {
        fillVoiceSelect();
      };
    }
  }

  function init() {
    var existing = document.getElementById('webgameSettingsWrap');
    if (existing) {
      wrap = existing;
      btn = document.getElementById('webgameSettingsBtn');
      panel = document.getElementById('webgameSettingsPanel');
      musicToggle = document.getElementById('settingsMusicToggle');
      sfxToggle = document.getElementById('settingsSfxToggle');
      musicVolumeInput = document.getElementById('settingsMusicVolume');
      voiceSelect = document.getElementById('settingsVoiceSelect');
      voiceVolumeInput = document.getElementById('settingsVoiceVolume');
      if (!musicVolumeInput && panel) {
        var body = panel.querySelector('.webgame-settings-panel-body');
        if (body) {
          var rowMusicVol = document.createElement('div');
          rowMusicVol.className = 'webgame-settings-row webgame-settings-row-volume';
          rowMusicVol.innerHTML = '<span class="webgame-settings-label">Âm lượng nhạc</span>';
          musicVolumeInput = document.createElement('input');
          musicVolumeInput.type = 'range';
          musicVolumeInput.className = 'webgame-settings-volume';
          musicVolumeInput.id = 'settingsMusicVolume';
          musicVolumeInput.min = '0';
          musicVolumeInput.max = '1';
          musicVolumeInput.step = '0.05';
          musicVolumeInput.value = '0.1';
          rowMusicVol.appendChild(musicVolumeInput);
          body.insertBefore(rowMusicVol, body.querySelector('.webgame-settings-row:nth-child(2)') || body.firstChild);
        }
      }
      if (!voiceSelect && panel) {
        var body = panel.querySelector('.webgame-settings-panel-body');
        if (body) {
          var rowVoice = document.createElement('div');
          rowVoice.className = 'webgame-settings-row webgame-settings-row-voice';
          rowVoice.innerHTML = '<span class="webgame-settings-label">\uD83D\uDD0A Giọng đọc</span>';
          voiceSelect = document.createElement('select');
          voiceSelect.className = 'webgame-settings-voice-select';
          voiceSelect.id = 'settingsVoiceSelect';
          rowVoice.appendChild(voiceSelect);
          body.appendChild(rowVoice);
          var rowVoiceVol = document.createElement('div');
          rowVoiceVol.className = 'webgame-settings-row webgame-settings-row-volume';
          rowVoiceVol.innerHTML = '<span class="webgame-settings-label">Âm lượng giọng</span>';
          voiceVolumeInput = document.createElement('input');
          voiceVolumeInput.type = 'range';
          voiceVolumeInput.className = 'webgame-settings-volume';
          voiceVolumeInput.id = 'settingsVoiceVolume';
          voiceVolumeInput.min = '0';
          voiceVolumeInput.max = '1';
          voiceVolumeInput.step = '0.1';
          voiceVolumeInput.value = '1';
          rowVoiceVol.appendChild(voiceVolumeInput);
          body.appendChild(rowVoiceVol);
        }
      }
    } else {
      buildWidget();
    }
    bindEvents();
    syncPanelFromSettings();
    fillVoiceSelect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
