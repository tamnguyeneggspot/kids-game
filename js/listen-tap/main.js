/**
 * UI game Nghe và chọn: chọn chủ đề/mode, nút Nghe lại, render choices, gắn event.
 */
(function () {
  'use strict';

  var S = window.listenTapShared;
  var G = window.ListenTapGame;
  if (!S || !G) return;

  var choicesEl = document.getElementById('listenTapChoices');
  var btnHear = document.getElementById('listenTapBtnHear');
  var instructionEl = document.getElementById('listenTapInstruction');
  var scoreWrap = document.getElementById('listenTapScoreWrap');
  var scoreEl = document.getElementById('listenTapScore');
  var summaryWrap = document.getElementById('listenTapSummary');
  var summaryText = document.getElementById('listenTapSummaryText');
  var btnReplay = document.getElementById('listenTapBtnReplay');
  var btnReplaySecondary = document.getElementById('listenTapBtnReplaySecondary');

  var currentAudio = null;

  /**
   * Phát âm văn bản bằng Web Speech API (tiếng Việt nếu có).
   */
  function speak(text) {
    if (!text || typeof text !== 'string') return;
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio = null;
      } catch (e) {}
    }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN';
    u.rate = 0.9;
    var voices = window.speechSynthesis.getVoices();
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang.indexOf('vi') !== -1) {
        u.voice = voices[i];
        break;
      }
    }
    window.speechSynthesis.speak(u);
  }

  /**
   * Phát âm item hiện tại (value: chữ, số, hoặc tên màu).
   */
  function playCurrentItem() {
    var st = G.getState();
    if (st.currentItem && st.currentItem.value) {
      speak(st.currentItem.value);
    }
  }

  function renderChoices() {
    var st = G.getState();
    if (!choicesEl) return;
    choicesEl.innerHTML = '';
    var topic = st.topic;
    var prefix = S.getLabelPrefix(topic);
    for (var i = 0; i < st.choices.length; i++) {
      var item = st.choices[i];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'listen-tap-card';
      btn.dataset.index = String(i);
      btn.setAttribute('aria-label', prefix + item.label);
      if (topic === 'color') {
        btn.classList.add('listen-tap-card-color');
        var swatch = document.createElement('span');
        swatch.className = 'listen-tap-swatch';
        swatch.style.backgroundColor = item.hex || '#ccc';
        if (item.hex && item.hex.toLowerCase() === '#f5f5f5') {
          swatch.style.border = '2px solid #ddd';
        }
        var label = document.createElement('span');
        label.className = 'listen-tap-label';
        label.textContent = item.label;
        btn.appendChild(swatch);
        btn.appendChild(label);
      } else {
        btn.textContent = item.label;
      }
      btn.addEventListener('click', function (e) {
        var idx = parseInt(this.dataset.index, 10);
        onChoiceClick(idx);
      });
      choicesEl.appendChild(btn);
    }
  }

  function onChoiceClick(index) {
    var result = G.onChoiceClick(index);
    var cards = choicesEl ? choicesEl.querySelectorAll('.listen-tap-card') : [];
    var card = cards[index];
    if (result.correct) {
      if (card) card.classList.add('correct');
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      if (instructionEl) instructionEl.textContent = 'Đúng rồi!';
      setTimeout(function () {
        if (result.roundOver || G.isRoundOver()) {
          showSummary();
          return;
        }
        G.nextQuestion();
        renderChoices();
        updateScoreDisplay();
        if (instructionEl) instructionEl.textContent = 'Nghe và chọn đáp án đúng.';
        playCurrentItem();
        if (btnHear) btnHear.focus();
      }, 1500);
    } else {
      if (card) card.classList.add('wrong');
      if (window.webGameSfx) window.webGameSfx.playWrong();
      if (instructionEl) instructionEl.textContent = 'Chọn lại nhé!';
      if (result.roundOver) {
        setTimeout(function () {
          showSummary();
        }, 800);
      } else {
        setTimeout(function () {
          if (card) card.classList.remove('wrong');
          if (instructionEl) instructionEl.textContent = 'Nghe và chọn đáp án đúng.';
        }, 800);
      }
    }
  }

  function updateScoreDisplay() {
    var st = G.getState();
    if (st.mode === 'continuous') {
      if (scoreWrap) scoreWrap.hidden = true;
      return;
    }
    if (scoreWrap) scoreWrap.hidden = false;
    var limit = st.mode === '5' ? 5 : 10;
    if (scoreEl) scoreEl.textContent = 'Đúng: ' + st.score + ' / ' + limit;
  }

  function showSummary() {
    var st = G.getState();
    if (summaryWrap) summaryWrap.hidden = false;
    var limit = st.mode === '5' ? 5 : 10;
    if (summaryText) summaryText.textContent = 'Bé đúng ' + st.score + ' / ' + limit + '!';
    if (btnReplay) btnReplay.focus();
  }

  function hideSummary() {
    if (summaryWrap) summaryWrap.hidden = true;
  }

  function startGame() {
    hideSummary();
    G.resetGame();
    renderChoices();
    updateScoreDisplay();
    if (instructionEl) instructionEl.textContent = 'Nghe và chọn đáp án đúng.';
    playCurrentItem();
  }

  function onReplay() {
    startGame();
  }

  function setActiveTopic(topic) {
    var topicBtns = document.querySelectorAll('.listen-tap-topic-btn');
    for (var t = 0; t < topicBtns.length; t++) {
      var b = topicBtns[t];
      if (b.dataset.topic === topic) {
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      }
    }
  }

  function setActiveMode(mode) {
    var modeBtns = document.querySelectorAll('.listen-tap-mode-btn');
    for (var m = 0; m < modeBtns.length; m++) {
      var b = modeBtns[m];
      if (b.dataset.mode === mode) {
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      }
    }
  }

  // Chủ đề
  var topicBtns = document.querySelectorAll('.listen-tap-topic-btn');
  for (var t = 0; t < topicBtns.length; t++) {
    topicBtns[t].addEventListener('click', function () {
      var topic = this.dataset.topic;
      if (!topic) return;
      setActiveTopic(topic);
      G.setTopic(topic);
      startGame();
    });
  }

  // Chế độ
  var modeBtns = document.querySelectorAll('.listen-tap-mode-btn');
  for (var m = 0; m < modeBtns.length; m++) {
    modeBtns[m].addEventListener('click', function () {
      var mode = this.dataset.mode;
      if (mode === undefined) return;
      setActiveMode(mode);
      G.setMode(mode);
      startGame();
    });
  }

  if (btnHear) {
    btnHear.addEventListener('click', function () {
      playCurrentItem();
    });
  }

  if (btnReplay) btnReplay.addEventListener('click', onReplay);
  if (btnReplaySecondary) btnReplaySecondary.addEventListener('click', onReplay);

  // Load voices (một số browser cần user tương tác mới có danh sách voice)
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.getVoices();
      };
    }
  }

  startGame();
})();
