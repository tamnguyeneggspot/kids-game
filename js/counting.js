(function () {
  'use strict';

  // Đồ vật hàng ngày, dễ nhận biết (emoji) — thứ tự trùng với OBJECT_NAMES
  const OBJECTS = ['☕', '📖', '🔑', '👓', '✏️', '💡', '📱', '🍎', '🥄', '🎒'];
  const OBJECT_NAMES = ['cốc', 'sách', 'chìa khóa', 'kính', 'bút chì', 'bóng đèn', 'điện thoại', 'quả táo', 'thìa', 'cặp sách'];
  const MIN_COUNT = 1;
  const MAX_COUNT = 10;
  const CHOICES_COUNT = 2; // Số lựa chọn (1 đáp án đúng + 3 sai)
  /** Cách đọc số bằng tiếng Việt (1–10) */
  const NUMBER_READINGS = {
    1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 5: 'năm',
    6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín', 10: 'mười'
  };

  const GAME_KEY = 'counting';
  let score = window.webGameDiem ? window.webGameDiem.loadDiem(GAME_KEY) : 0;
  let correctAnswer = 0;
  let answered = false;
  /** 'training' | 'play' | 'listen' */
  let gameMode = 'training';
  let trainingNumber = 1;

  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = 'Điểm: ' + score;
  const questionText = document.getElementById('questionText');
  const readingText = document.getElementById('readingText');
  const objectsWrap = document.getElementById('objectsWrap');
  const choicesEl = document.getElementById('choices');
  const feedbackEl = document.getElementById('feedback');
  const btnNext = document.getElementById('btnNext');
  const trainingActions = document.getElementById('trainingActions');
  const btnListen = document.getElementById('btnListen');
  const btnNextTraining = document.getElementById('btnNextTraining');
  const modePlay = document.getElementById('modePlay');
  const modeTraining = document.getElementById('modeTraining');
  const modeListen = document.getElementById('modeListen');
  const playListenWrap = document.getElementById('playListenWrap');
  const btnListenPlay = document.getElementById('btnListenPlay');
  let autoNextTimer = null;
  /** Trong mode Nghe: interval tự lặp lại câu "Đâu là số xxx?" (ms). */
  const LISTEN_REPLAY_MS = 1000*60;
  let listenReplayInterval = null;
  let listenAutoPlayTimer = null;
  /** Trong mode Chơi: interval tự lặp lại "Có bao nhiêu [đồ vật]?" (ms). */
  const PLAY_REPLAY_MS = 1000*60;
  let playReplayInterval = null;
  let playAutoPlayTimer = null;

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

  /** Dùng hàm speak dùng chung (volume từ settings.js). */
  function speak(text, lang) {
    if (window.webGameSpeak) window.webGameSpeak(text, lang || 'vi-VN');
  }

  function getWrongChoices(correct, count) {
    const wrong = new Set();
    while (wrong.size < count) {
      const n = randomInt(MIN_COUNT, MAX_COUNT);
      if (n !== correct) wrong.add(n);
    }
    return [...wrong];
  }

  function setMode(mode) {
    gameMode = mode;
    // Dừng audio auto replay khi chuyển sang mode khác
    if (listenReplayInterval) {
      clearInterval(listenReplayInterval);
      listenReplayInterval = null;
    }
    if (listenAutoPlayTimer) {
      clearTimeout(listenAutoPlayTimer);
      listenAutoPlayTimer = null;
    }
    if (playReplayInterval) {
      clearInterval(playReplayInterval);
      playReplayInterval = null;
    }
    if (playAutoPlayTimer) {
      clearTimeout(playAutoPlayTimer);
      playAutoPlayTimer = null;
    }
    const isTraining = mode === 'training';
    const isListen = mode === 'listen';
    if (modeTraining) {
      modeTraining.classList.toggle('active', mode === 'training');
      modeTraining.setAttribute('aria-selected', mode === 'training' ? 'true' : 'false');
    }
    if (modePlay) {
      modePlay.classList.toggle('active', mode === 'play');
      modePlay.setAttribute('aria-selected', mode === 'play' ? 'true' : 'false');
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
    if (isTraining) {
      showTrainingScreen();
    } else {
      showQuestion();
    }
  }

  function showTrainingScreen() {
    const num = trainingNumber;
    const reading = NUMBER_READINGS[num];
    const emoji = OBJECTS[randomInt(0, OBJECTS.length - 1)];

    questionText.textContent = num;
    questionText.classList.add('training-number');
    if (readingText) {
      readingText.hidden = true;
    }
    objectsWrap.innerHTML = '';
    objectsWrap.setAttribute('aria-label', 'Số ' + num + ', đọc là ' + reading);
    for (let i = 0; i < num; i++) {
      const span = document.createElement('span');
      span.className = 'object-item';
      span.setAttribute('role', 'img');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = emoji;
      objectsWrap.appendChild(span);
    }
    speak('Số : ' + reading, 'vi-VN');
  }

  function nextTrainingNumber() {
    trainingNumber = trainingNumber >= MAX_COUNT ? MIN_COUNT : trainingNumber + 1;
    showTrainingScreen();
  }

  function showQuestion() {
    questionText.classList.remove('training-number');
    answered = false;
    correctAnswer = randomInt(MIN_COUNT, MAX_COUNT);
    if (readingText) readingText.hidden = true;

    const isListenMode = gameMode === 'listen';
    if (isListenMode) {
      questionText.textContent = 'Nghe và chọn số đúng';
      objectsWrap.innerHTML = '';
      objectsWrap.setAttribute('aria-label', 'Nghe số rồi chọn đáp án.');
    } else {
      const emojiIdx = randomInt(0, OBJECTS.length - 1);
      const emoji = OBJECTS[emojiIdx];
      const objectName = OBJECT_NAMES[emojiIdx];
      const howManyText = 'Có bao nhiêu ' + objectName + '?';
      questionText.textContent = howManyText;
      objectsWrap.innerHTML = '';
      objectsWrap.setAttribute('aria-label', 'Có ' + correctAnswer + ' ' + objectName + '.');
      for (let i = 0; i < correctAnswer; i++) {
        const span = document.createElement('span');
        span.className = 'object-item';
        span.setAttribute('role', 'img');
        span.setAttribute('aria-hidden', 'true');
        span.textContent = emoji;
        objectsWrap.appendChild(span);
      }
      // Auto play + auto replay "Có bao nhiêu [đồ vật]?" trong mode Chơi (mỗi 6s)
      function playHowMany() { speak(howManyText, 'vi-VN'); }
      playHowMany();
      playAutoPlayTimer = setTimeout(function () {
        playAutoPlayTimer = null;
        playHowMany();
        playReplayInterval = setInterval(function () {
          if (answered) {
            if (playReplayInterval) clearInterval(playReplayInterval);
            playReplayInterval = null;
            return;
          }
          playHowMany();
        }, PLAY_REPLAY_MS);
      }, PLAY_REPLAY_MS);
    }

    const wrongChoices = getWrongChoices(correctAnswer, CHOICES_COUNT - 1);
    const options = shuffle([correctAnswer, ...wrongChoices]);

    choicesEl.innerHTML = '';
    options.forEach(function (num) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = num;
      btn.setAttribute('aria-label', 'Số ' + num);
      btn.addEventListener('click', function () { onChoice(num, btn); });
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
    // Chỉ clear timer của mode khác (tránh xóa timer vừa set cho mode hiện tại)
    if (isListenMode) {
      if (playReplayInterval) {
        clearInterval(playReplayInterval);
        playReplayInterval = null;
      }
      if (playAutoPlayTimer) {
        clearTimeout(playAutoPlayTimer);
        playAutoPlayTimer = null;
      }
    } else {
      if (listenReplayInterval) {
        clearInterval(listenReplayInterval);
        listenReplayInterval = null;
      }
      if (listenAutoPlayTimer) {
        clearTimeout(listenAutoPlayTimer);
        listenAutoPlayTimer = null;
      }
    }
    removeCelebration();
    removeWrongEffect();

    // Auto play + auto replay trong mode Nghe
    if (isListenMode) {
      function playListenQuestion() {
        const reading = NUMBER_READINGS[correctAnswer];
        speak('Đâu là số ' + reading + '?', 'vi-VN');
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
  }

  function onChoice(num, btn) {
    if (answered) return;
    answered = true;

    if (listenReplayInterval) {
      clearInterval(listenReplayInterval);
      listenReplayInterval = null;
    }
    if (listenAutoPlayTimer) {
      clearTimeout(listenAutoPlayTimer);
      listenAutoPlayTimer = null;
    }
    if (playReplayInterval) {
      clearInterval(playReplayInterval);
      playReplayInterval = null;
    }
    if (playAutoPlayTimer) {
      clearTimeout(playAutoPlayTimer);
      playAutoPlayTimer = null;
    }

    const allBtns = choicesEl.querySelectorAll('.choice-btn');
    allBtns.forEach(function (b) { b.disabled = true; });

    if (num === correctAnswer) {
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
      speak('Đúng rồi! Số ' + correctAnswer, 'vi-VN');
      showCelebration();
      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(function () {
        autoNextTimer = null;
        showQuestion();
      }, 3000);
    } else {
      const scoreBeforeReset = score;
      btn.classList.add('wrong');
      feedbackEl.textContent = 'Bạn được ' + scoreBeforeReset + ' điểm.';
      feedbackEl.className = 'feedback error';
      feedbackEl.hidden = false;
      if (window.webGameSfx) window.webGameSfx.playWrong();
      if (gameMode === 'play') speak('Có ' + correctAnswer + ' cái.', 'vi-VN');
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
    const container = document.createElement('div');
    container.className = 'celebration-wrap';
    container.setAttribute('aria-hidden', 'true');
    const colors = ['#6b4ce6', '#22c55e', '#fbbf24', '#f59e0b', '#ec4899', '#06b6d4'];
    const emojis = ['🎉', '⭐', '🌟', '✨', '🎈', '🌸'];
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('span');
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
    const container = document.createElement('div');
    container.className = 'wrong-effect-wrap';
    container.setAttribute('aria-hidden', 'true');
    const emojis = ['😢', '💔', '😅', '🙈', '✨', '💫'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = 'wrong-effect-piece';
      p.textContent = emojis[i % emojis.length];
      p.style.setProperty('--i', i);
      container.appendChild(p);
    }
    document.body.appendChild(container);
    setTimeout(removeWrongEffect, 1200);
  }

  function removeWrongEffect() {
    const wrap = document.querySelector('.wrong-effect-wrap');
    if (wrap) wrap.remove();
  }

  function removeCelebration() {
    const wrap = document.querySelector('.celebration-wrap');
    if (wrap) wrap.remove();
  }

  btnNext.addEventListener('click', function () {
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      autoNextTimer = null;
    }
    showQuestion();
  });

  if (modePlay) modePlay.addEventListener('click', function () { setMode('play'); });
  if (modeTraining) modeTraining.addEventListener('click', function () { setMode('training'); });
  if (modeListen) modeListen.addEventListener('click', function () { setMode('listen'); });
  if (btnListen) {
    btnListen.addEventListener('click', function () {
      if (gameMode !== 'training') return;
      const reading = NUMBER_READINGS[trainingNumber];
      speak('Số : ' + reading, 'vi-VN');
    });
  }
  if (btnListenPlay) {
    btnListenPlay.addEventListener('click', function () {
      if (gameMode !== 'listen') return;
      const reading = NUMBER_READINGS[correctAnswer];
      speak('Đâu là số ' + reading + '?', 'vi-VN');
    });
  }
  if (btnNextTraining) btnNextTraining.addEventListener('click', nextTrainingNumber);

  // modeTraining: click bất kỳ trên body → replay audio, trừ nút "Số tiếp theo"
  document.body.addEventListener('click', function (ev) {
    if (gameMode !== 'training') return;
    if (ev.target.closest('#btnNextTraining')) return;
    const reading = NUMBER_READINGS[trainingNumber];
    speak('Số : ' + reading, 'vi-VN');
  });

  setMode('training');
})();
