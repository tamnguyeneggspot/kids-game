(function () {
  'use strict';

  // Màu sắc tiếng Việt: tên và mã hex
  const COLORS = [
    { name: 'Đỏ', hex: '#e53935' },
    { name: 'Xanh lá', hex: '#43a047' },
    { name: 'Xanh dương', hex: '#1e88e5' },
    { name: 'Vàng', hex: '#fdd835' },
    { name: 'Cam', hex: '#fb8c00' },
    { name: 'Tím', hex: '#8e24aa' },
    { name: 'Hồng', hex: '#ec407a' },
    { name: 'Nâu', hex: '#6d4c41' },
    { name: 'Đen', hex: '#212121' },
    { name: 'Trắng', hex: '#fafafa' },
    { name: 'Xám', hex: '#757575' }
  ];
  const CHOICES_COUNT = 2;

  const GAME_KEY = 'color';
  let score = window.webGameDiem ? window.webGameDiem.loadDiem(GAME_KEY) : 0;
  let correctColor = COLORS[0];
  let answered = false;
  /** 'training' | 'listen' */
  let gameMode = 'training';
  let trainingIndex = 0;

  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = 'Điểm: ' + score;
  const questionText = document.getElementById('questionText');
  const readingText = document.getElementById('readingText');
  const colorDisplayWrap = document.getElementById('colorDisplayWrap');
  const choicesEl = document.getElementById('choices');
  const feedbackEl = document.getElementById('feedback');
  const btnNext = document.getElementById('btnNext');
  const trainingActions = document.getElementById('trainingActions');
  const btnListen = document.getElementById('btnListen');
  const btnNextTraining = document.getElementById('btnNextTraining');
  const modeTraining = document.getElementById('modeTraining');
  const modeListen = document.getElementById('modeListen');
  const playListenWrap = document.getElementById('playListenWrap');
  const btnListenPlay = document.getElementById('btnListenPlay');
  let autoNextTimer = null;
  const LISTEN_REPLAY_MS = 1000 * 60;
  let listenReplayInterval = null;
  let listenAutoPlayTimer = null;

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function speak(text, lang) {
    if (window.webGameSpeak) window.webGameSpeak(text, lang || 'vi-VN');
  }

  function getWrongColors(correct, count) {
    const wrong = [];
    const others = COLORS.filter(function (c) { return c.name !== correct.name; });
    for (let i = 0; i < count; i++) {
      const idx = randomInt(0, others.length - 1);
      wrong.push(others[idx]);
      others.splice(idx, 1);
    }
    return wrong;
  }

  function setMode(mode) {
    gameMode = mode;
    if (listenReplayInterval) {
      clearInterval(listenReplayInterval);
      listenReplayInterval = null;
    }
    if (listenAutoPlayTimer) {
      clearTimeout(listenAutoPlayTimer);
      listenAutoPlayTimer = null;
    }
    const isTraining = mode === 'training';
    const isListen = mode === 'listen';
    if (modeTraining) {
      modeTraining.classList.toggle('active', mode === 'training');
      modeTraining.setAttribute('aria-selected', mode === 'training' ? 'true' : 'false');
    }
    if (modeListen) {
      modeListen.classList.toggle('active', mode === 'listen');
      modeListen.setAttribute('aria-selected', mode === 'listen' ? 'true' : 'false');
    }
    if (scoreEl) scoreEl.style.display = isTraining ? 'none' : '';
    choicesEl.style.display = isTraining ? 'none' : '';
    feedbackEl.hidden = true;
    btnNext.hidden = true;
    if (trainingActions) {
      trainingActions.hidden = !isTraining;
      trainingActions.style.display = isTraining ? '' : 'none';
    }
    if (readingText) readingText.hidden = !isTraining;
    if (playListenWrap) {
      playListenWrap.hidden = !isListen;
      playListenWrap.style.display = isListen ? '' : 'none';
    }
    document.body.classList.toggle('mode-listen', isListen);
    if (isTraining) {
      showTrainingScreen();
    } else {
      showQuestion();
    }
  }

  function createSwatchEl(hex, label) {
    const wrap = document.createElement('div');
    wrap.className = 'color-swatch-wrap';
    const swatch = document.createElement('span');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = hex;
    if (hex === '#fafafa' || hex.toLowerCase() === '#ffffff') {
      swatch.style.border = '2px solid #ddd';
    }
    wrap.appendChild(swatch);
    if (label) {
      const span = document.createElement('span');
      span.className = 'color-swatch-label';
      span.textContent = label;
      wrap.appendChild(span);
    }
    return wrap;
  }

  function showTrainingScreen() {
    const color = COLORS[trainingIndex];

    questionText.textContent = 'Màu này gọi là gì?';
    questionText.classList.remove('training-color');
    if (readingText) {
      readingText.textContent = color.name;
      readingText.hidden = false;
    }
    if (colorDisplayWrap) {
      colorDisplayWrap.innerHTML = '';
      const swatchWrap = createSwatchEl(color.hex, null);
      colorDisplayWrap.appendChild(swatchWrap);
      colorDisplayWrap.setAttribute('aria-label', 'Màu ' + color.name);
    }
    speak(color.name, 'vi-VN');
  }

  function nextTrainingColor() {
    trainingIndex = (trainingIndex + 1) % COLORS.length;
    showTrainingScreen();
  }

  function showQuestion() {
    questionText.classList.remove('training-color');
    if (readingText) readingText.hidden = true;
    answered = false;
    const colorIdx = randomInt(0, COLORS.length - 1);
    correctColor = COLORS[colorIdx];

    questionText.textContent = 'Nghe và chọn màu đúng';
    if (colorDisplayWrap) {
      colorDisplayWrap.innerHTML = '';
      colorDisplayWrap.setAttribute('aria-label', 'Nghe tên màu rồi chọn đáp án.');
    }

    var wrongColors = getWrongColors(correctColor, CHOICES_COUNT - 1);
    var options = shuffle([correctColor].concat(wrongColors));
    choicesEl.innerHTML = '';
    options.forEach(function (color) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn choice-btn-color';
      var swatchWrap = createSwatchEl(color.hex, color.name);
      btn.appendChild(swatchWrap);
      btn.setAttribute('aria-label', 'Màu ' + color.name);
      btn.addEventListener('click', function () { onChoiceColor(color, btn); });
      choicesEl.appendChild(btn);
    });

    feedbackEl.hidden = true;
    feedbackEl.className = 'feedback';
    feedbackEl.textContent = '';
    btnNext.hidden = true;
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      autoNextTimer = null;
    }
    if (listenReplayInterval) { clearInterval(listenReplayInterval); listenReplayInterval = null; }
    if (listenAutoPlayTimer) { clearTimeout(listenAutoPlayTimer); listenAutoPlayTimer = null; }
    removeCelebration();
    removeWrongEffect();

    function playListenQuestion() {
      speak('Đâu là màu ' + correctColor.name + '?', 'vi-VN');
    }
    listenAutoPlayTimer = setTimeout(function () {
      listenAutoPlayTimer = null;
      playListenQuestion();
      listenReplayInterval = setInterval(function () {
        if (answered) {
          if (listenReplayInterval) clearInterval(listenReplayInterval);
          listenReplayInterval = null;
          return;
        }
        playListenQuestion();
      }, LISTEN_REPLAY_MS);
    }, 500);
    if (btnListenPlay) {
      if (document.activeElement && document.activeElement !== btnListenPlay) document.activeElement.blur();
      setTimeout(function () { btnListenPlay.focus(); }, 0);
    }
  }

  function stopAllReplay() {
    if (listenReplayInterval) { clearInterval(listenReplayInterval); listenReplayInterval = null; }
    if (listenAutoPlayTimer) { clearTimeout(listenAutoPlayTimer); listenAutoPlayTimer = null; }
  }

  function onChoiceColor(color, btn) {
    if (answered) return;
    answered = true;
    stopAllReplay();
    var allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(function (b) { b.disabled = true; });

    if (color.name === correctColor.name) {
      score += 1;
      scoreEl.textContent = 'Điểm: ' + score;
      if (window.webGameDiem) {
        window.webGameDiem.saveDiem(GAME_KEY, score);
        window.webGameDiem.saveHighScore(GAME_KEY, score);
      }
      btn.classList.add('correct');
      feedbackEl.textContent = 'Đúng rồi! 🎉';
      feedbackEl.className = 'feedback success';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      speak('Đúng rồi! Màu ' + correctColor.name, 'vi-VN');
      showCelebration();
      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(function () {
        autoNextTimer = null;
        showQuestion();
      }, 3000);
    } else {
      var scoreBeforeReset = score;
      btn.classList.add('wrong');
      feedbackEl.textContent = 'Bạn được ' + scoreBeforeReset + ' điểm.';
      feedbackEl.className = 'feedback error';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playWrong();
      speak('Màu ' + correctColor.name + '.', 'vi-VN');
      showWrongEffect();
      setTimeout(function () {
        score = 0;
        scoreEl.textContent = 'Điểm: 0';
        if (window.webGameDiem) window.webGameDiem.saveDiem(GAME_KEY, 0);
      }, 2500);
      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(function () {
        autoNextTimer = null;
        showQuestion();
      }, 3500);
    }
    btnNext.hidden = false;
    btnNext.focus();
  }

  function showCelebration() {
    removeCelebration();
    var container = document.createElement('div');
    container.className = 'celebration-wrap';
    container.setAttribute('aria-hidden', 'true');
    var colors = ['#6b4ce6', '#22c55e', '#fbbf24', '#f59e0b', '#ec4899', '#06b6d4'];
    var emojis = ['🎉', '⭐', '🌟', '✨', '🎈', '🌸'];
    for (var i = 0; i < 24; i++) {
      var p = document.createElement('span');
      p.className = 'celebration-piece';
      p.textContent = emojis[i % emojis.length];
      p.style.setProperty('--i', i);
      p.style.setProperty('--color', colors[i % colors.length]);
      container.appendChild(p);
    }
    document.body.appendChild(container);
  }

  function showWrongEffect() {
    removeWrongEffect();
    var container = document.createElement('div');
    container.className = 'wrong-effect-wrap';
    container.setAttribute('aria-hidden', 'true');
    var emojis = ['😢', '💔', '😅', '🙈', '✨', '💫'];
    for (var i = 0; i < 18; i++) {
      var p = document.createElement('span');
      p.className = 'wrong-effect-piece';
      p.textContent = emojis[i % emojis.length];
      p.style.setProperty('--i', i);
      container.appendChild(p);
    }
    document.body.appendChild(container);
    setTimeout(removeWrongEffect, 1200);
  }

  function removeWrongEffect() {
    var wrap = document.querySelector('.wrong-effect-wrap');
    if (wrap) wrap.remove();
  }

  function removeCelebration() {
    var wrap = document.querySelector('.celebration-wrap');
    if (wrap) wrap.remove();
  }

  btnNext.addEventListener('click', function () {
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      autoNextTimer = null;
    }
    showQuestion();
    if (gameMode === 'listen' && btnListenPlay) {
      if (document.activeElement && document.activeElement !== btnListenPlay) document.activeElement.blur();
      setTimeout(function () { btnListenPlay.focus(); }, 0);
    }
  });

  if (modeTraining) modeTraining.addEventListener('click', function () { setMode('training'); });
  if (modeListen) modeListen.addEventListener('click', function () { setMode('listen'); });
  if (btnListen) {
    btnListen.addEventListener('click', function () {
      if (gameMode !== 'training') return;
      var color = COLORS[trainingIndex];
      speak(color.name, 'vi-VN');
    });
  }
  if (btnListenPlay) {
    btnListenPlay.addEventListener('click', function () {
      if (gameMode !== 'listen') return;
      speak('Đâu là màu ' + correctColor.name + '?', 'vi-VN');
    });
  }
  if (btnNextTraining) btnNextTraining.addEventListener('click', nextTrainingColor);

  document.body.addEventListener('click', function (ev) {
    if (gameMode !== 'training') return;
    if (ev.target.closest('#btnNextTraining')) return;
    var color = COLORS[trainingIndex];
    speak(color.name, 'vi-VN');
  });

  setMode('training');
})();
