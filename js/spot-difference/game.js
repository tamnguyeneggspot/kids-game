(function () {
  'use strict';

  var S = window.spotDifferenceShared;
  if (!S) {
    console.error('spotDifferenceShared chưa được load.');
    return;
  }

  var state = {
    level: null,
    found: [],
    total: 0,
    completed: false,
    els: null
  };

  function setStatus(text, type) {
    if (!state.els || !state.els.statusEl) return;
    state.els.statusEl.textContent = text || '';
    state.els.statusEl.classList.remove('is-success', 'is-error');
    if (type === 'success') state.els.statusEl.classList.add('is-success');
    if (type === 'error') state.els.statusEl.classList.add('is-error');
  }

  function updateProgress() {
    if (!state.els || !state.els.progressEl) return;
    var count = 0;
    for (var i = 0; i < state.found.length; i++) if (state.found[i]) count++;
    state.els.progressEl.textContent = 'Đã tìm: ' + count + ' / ' + state.total;
  }

  function clearHitZones() {
    if (state.els && state.els.hitLayer) state.els.hitLayer.innerHTML = '';
  }

  function renderHitZones() {
    clearHitZones();
    if (!state.level || !state.els || !state.els.hitLayer) return;
    var diffs = state.level.differences || [];
    for (var i = 0; i < diffs.length; i++) {
      (function (idx) {
        var d = diffs[idx];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'spot-diff-hit-zone';
        btn.dataset.index = String(idx);

        var left = Math.max(0, Math.min(100, d.x - d.r));
        var top = Math.max(0, Math.min(100, d.y - d.r));
        var size = Math.max(2, Math.min(60, d.r * 2));

        btn.style.left = left + '%';
        btn.style.top = top + '%';
        btn.style.width = size + '%';
        btn.style.height = size + '%';

        btn.setAttribute('aria-label', 'Điểm khác biệt ' + (idx + 1));
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          onHitZoneClick(idx, btn);
        });

        state.els.hitLayer.appendChild(btn);
      })(i);
    }
  }

  function markFound(index, zoneEl) {
    if (!zoneEl) return;
    zoneEl.classList.add('found');
    zoneEl.setAttribute('aria-label', 'Đã tìm - Điểm khác biệt ' + (index + 1));
  }

  function checkComplete() {
    for (var i = 0; i < state.found.length; i++) {
      if (!state.found[i]) return false;
    }
    return true;
  }

  function onHitZoneClick(index, zoneEl) {
    if (state.completed) return;
    if (state.found[index]) return;
    state.found[index] = true;
    markFound(index, zoneEl);
    updateProgress();
    setStatus('Đúng rồi!', 'success');
    if (window.webGameSfx) window.webGameSfx.playCorrect();

    if (checkComplete()) {
      state.completed = true;
      setStatus('Hoàn thành! Bé đã tìm hết điểm khác biệt! 🎉', 'success');
      S.showCelebration();
      if (state.els && state.els.btnReplay) {
        setTimeout(function () {
          try { state.els.btnReplay.focus(); } catch (e) {}
        }, 50);
      }
      try {
        if (window.webGameDiem) {
          var cur = window.webGameDiem.loadDiem(S.GAME_KEY) || 0;
          window.webGameDiem.saveDiem(S.GAME_KEY, cur + 1);
          window.webGameDiem.saveHighScore(S.GAME_KEY, cur + 1);
        }
      } catch (e) {}
    }
  }

  function onMissClick() {
    if (state.completed) return;
    setStatus('Chưa đúng rồi, con thử lại nhé!', 'error');
    if (window.webGameSfx) window.webGameSfx.playWrong();
    S.showWrongEffect();
    if (state.els && state.els.rightWrap) {
      state.els.rightWrap.classList.remove('spot-diff-miss');
      // force reflow để restart animation
      void state.els.rightWrap.offsetWidth;
      state.els.rightWrap.classList.add('spot-diff-miss');
    }
  }

  function initLevel(levelData, els) {
    state.els = els || state.els;
    state.level = levelData;
    state.total = (levelData && levelData.differences) ? levelData.differences.length : 0;
    state.found = [];
    for (var i = 0; i < state.total; i++) state.found.push(false);
    state.completed = false;

    if (S.removeCelebration) S.removeCelebration();
    if (S.removeWrongEffect) S.removeWrongEffect();

    // Đường dẫn ảnh luôn tính từ thư mục chứa trang HTML (tránh lỗi khi mở file:// hoặc từ thư mục khác)
    var href = window.location.href || '';
    var lastSlash = href.lastIndexOf('/');
    var basePath = (lastSlash >= 0) ? href.substring(0, lastSlash + 1) : '';

    if (state.els && state.els.imgLeft && levelData && levelData.imageLeft) {
      state.els.imgLeft.src = basePath + levelData.imageLeft;
    }
    if (state.els && state.els.imgRight && levelData && levelData.imageRight) {
      state.els.imgRight.src = basePath + levelData.imageRight;
    }

    renderHitZones();
    updateProgress();
    setStatus('Hãy bấm vào hình bên phải để tìm điểm khác biệt.', null);
  }

  function resetGame() {
    if (!state.level) return;
    initLevel(state.level, state.els);
  }

  function bindMissHandler() {
    if (!state.els || !state.els.rightWrap) return;
    if (state.els.rightWrap.dataset.missBound === '1') return;
    state.els.rightWrap.dataset.missBound = '1';
    state.els.rightWrap.addEventListener('click', function (e) {
      var isZone = e.target && e.target.classList && e.target.classList.contains('spot-diff-hit-zone');
      if (isZone) return;
      onMissClick();
    });
  }

  window.SpotDifferenceGame = {
    initLevel: initLevel,
    resetGame: resetGame,
    bindMissHandler: bindMissHandler
  };
})();

