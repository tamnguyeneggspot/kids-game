(function () {
  'use strict';

  // Bảng chữ cái tiếng Việt (29 chữ) và cách đọc tên chữ
  const LETTERS = ['A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'];
  const LETTER_READINGS = {
    'A': 'a', 'Ă': 'á', 'Â': 'â', 'B': 'bê', 'C': 'xê', 'D': 'dê', 'Đ': 'đờ', 'E': 'e', 'Ê': 'ê',
    'G': 'gờ', 'H': 'hát', 'I': 'i', 'K': 'ca', 'L': 'lờ', 'M': 'mờ', 'N': 'nờ', 'O': 'o', 'Ô': 'ô', 'Ơ': 'ơ',
    'P': 'pê', 'Q': 'cu', 'R': 'rờ', 'S': 'sờ', 'T': 'tê', 'U': 'u', 'Ư': 'ư', 'V': 'vê', 'X': 'xờ', 'Y': 'i-dài'
  };
  const CHOICES_COUNT = 2; // 1 đúng + 3 sai

  const GAME_KEY = 'alphabet';
  let score = window.webGameDiem ? window.webGameDiem.loadDiem(GAME_KEY) : 0;
  let correctLetter = 'A';
  let correctReading = 'a';
  let answered = false;
  /** 'training' | 'listen' */
  let gameMode = 'training';
  let trainingIndex = 0;

  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = 'Điểm: ' + score;
  const questionText = document.getElementById('questionText');
  const readingText = document.getElementById('readingText');
  const letterDisplayWrap = document.getElementById('letterDisplayWrap');
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

  /** Lấy các chữ sai (mode Nghe: chọn chữ). */
  function getWrongLetters(correct, count) {
    const wrong = [];
    const others = LETTERS.filter(function (c) { return c !== correct; });
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

  function showTrainingScreen() {
    const letter = LETTERS[trainingIndex];
    const reading = LETTER_READINGS[letter];

    questionText.textContent = letter;
    questionText.classList.add('training-letter');
    if (readingText) {
      readingText.textContent = reading;
      readingText.hidden = false;
    }
    if (letterDisplayWrap) { letterDisplayWrap.innerHTML = ''; letterDisplayWrap.setAttribute('aria-label', reading); }
    speak(reading, 'vi-VN');
  }

  function nextTrainingLetter() {
    trainingIndex = (trainingIndex + 1) % LETTERS.length;
    showTrainingScreen();
  }

  function showQuestion() {
    questionText.classList.remove('training-letter');
    if (readingText) readingText.hidden = true;
    answered = false;
    const letterIdx = randomInt(0, LETTERS.length - 1);
    correctLetter = LETTERS[letterIdx];
    correctReading = LETTER_READINGS[correctLetter];

    questionText.textContent = 'Nghe và chọn chữ đúng';
    if (letterDisplayWrap) { letterDisplayWrap.innerHTML = ''; letterDisplayWrap.setAttribute('aria-label', 'Nghe tên chữ rồi chọn đáp án.'); }

    var wrongLetters = getWrongLetters(correctLetter, CHOICES_COUNT - 1);
    var options = shuffle([correctLetter].concat(wrongLetters));
    choicesEl.innerHTML = '';
    options.forEach(function (letter) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn choice-btn-letter';
      btn.textContent = letter;
      btn.setAttribute('aria-label', 'Chữ ' + letter);
      btn.addEventListener('click', function () { onChoiceLetter(letter, btn); });
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
      speak('Đâu là chữ ' + correctReading + '?', 'vi-VN');
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
  }

  function stopAllReplay() {
    if (listenReplayInterval) { clearInterval(listenReplayInterval); listenReplayInterval = null; }
    if (listenAutoPlayTimer) { clearTimeout(listenAutoPlayTimer); listenAutoPlayTimer = null; }
  }

  function onChoiceLetter(letter, btn) {
    if (answered) return;
    answered = true;
    stopAllReplay();
    var allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(function (b) { b.disabled = true; });

    if (letter === correctLetter) {
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
      speak('Đúng rồi! Chữ ' + correctReading, 'vi-VN');
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
      speak('Chữ ' + correctReading + '.', 'vi-VN');
      showWrongEffect();
      setTimeout(function () {
        score = 0;
        scoreEl.textContent = 'Điểm: 0';
        if (window.webGameDiem) window.webGameDiem.saveDiem(GAME_KEY, 0);
      }, 2500);
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
  });

  if (modeTraining) modeTraining.addEventListener('click', function () { setMode('training'); });
  if (modeListen) modeListen.addEventListener('click', function () { setMode('listen'); });
  if (btnListen) {
    btnListen.addEventListener('click', function () {
      if (gameMode !== 'training') return;
      var letter = LETTERS[trainingIndex];
      var reading = LETTER_READINGS[letter];
      speak(reading, 'vi-VN');
    });
  }
  if (btnListenPlay) {
    btnListenPlay.addEventListener('click', function () {
      if (gameMode !== 'listen') return;
      speak('Đâu là chữ ' + correctReading + '?', 'vi-VN');
    });
  }
  if (btnNextTraining) btnNextTraining.addEventListener('click', nextTrainingLetter);

  document.body.addEventListener('click', function (ev) {
    if (gameMode !== 'training') return;
    if (ev.target.closest('#btnNextTraining')) return;
    var letter = LETTERS[trainingIndex];
    var reading = LETTER_READINGS[letter];
    speak(reading, 'vi-VN');
  });

  setMode('training');
})();
