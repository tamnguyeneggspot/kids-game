/**
 * UI game Tìm cái giống / khác: chọn chế độ, chủ đề, render mẫu + thẻ, gắn event.
 */
(function () {
  'use strict';

  var S = window.sameDifferentShared;
  var G = window.SameDifferentGame;
  if (!S || !G) return;

  var questionEl = document.getElementById('sameDiffQuestion');
  var promptEl = document.getElementById('sameDiffPrompt');
  var sampleWrap = document.getElementById('sameDiffSampleWrap');
  var sampleEl = document.getElementById('sameDiffSample');
  var cardsEl = document.getElementById('sameDiffCards');
  var scoreWrap = document.getElementById('sameDiffScoreWrap');
  var scoreEl = document.getElementById('sameDiffScore');
  var summaryWrap = document.getElementById('sameDiffSummary');
  var summaryText = document.getElementById('sameDiffSummaryText');
  var btnReplay = document.getElementById('sameDiffBtnReplay');
  var btnReplaySecondary = document.getElementById('sameDiffBtnReplaySecondary');

  function renderSample() {
    if (!sampleWrap || !sampleEl) return;
    var st = G.getState();
    if (st.mode !== 'same' || !st.sample) {
      sampleWrap.hidden = true;
      sampleEl.innerHTML = '';
      return;
    }
    sampleWrap.hidden = false;
    sampleEl.innerHTML = '';
    sampleEl.className = 'same-diff-sample';
    var item = st.sample;
    var topic = st.topic;
    var prefix = S.getLabelPrefix(topic);
    if (topic === 'color') {
      sampleEl.classList.add('same-diff-sample-color');
      var swatch = document.createElement('span');
      swatch.className = 'same-diff-swatch';
      swatch.style.backgroundColor = item.hex || '#ccc';
      if (item.hex && item.hex.toLowerCase() === '#f5f5f5') {
        swatch.style.border = '2px solid #ddd';
      }
      var label = document.createElement('span');
      label.className = 'same-diff-label';
      label.textContent = item.label;
      sampleEl.appendChild(swatch);
      sampleEl.appendChild(label);
    } else {
      sampleEl.textContent = item.label;
    }
    questionEl.setAttribute('aria-label', 'Tìm cái giống với ' + prefix + item.label);
  }

  function renderCards() {
    if (!cardsEl) return;
    cardsEl.innerHTML = '';
    var st = G.getState();
    var topic = st.topic;
    var prefix = S.getLabelPrefix(topic);
    if (st.mode === 'different') {
      questionEl.setAttribute('aria-label', 'Tìm cái khác với các cái còn lại');
    }
    for (var i = 0; i < st.choices.length; i++) {
      var item = st.choices[i];
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'same-diff-card';
      card.dataset.index = String(i);
      card.setAttribute('aria-label', prefix + item.label);
      if (topic === 'color') {
        card.classList.add('same-diff-card-color');
        var swatch = document.createElement('span');
        swatch.className = 'same-diff-swatch';
        swatch.style.backgroundColor = item.hex || '#ccc';
        if (item.hex && item.hex.toLowerCase() === '#f5f5f5') {
          swatch.style.border = '2px solid #ddd';
        }
        var label = document.createElement('span');
        label.className = 'same-diff-label';
        label.textContent = item.label;
        card.appendChild(swatch);
        card.appendChild(label);
      } else {
        card.textContent = item.label;
      }
      card.addEventListener('click', function () {
        var idx = parseInt(this.dataset.index, 10);
        onCardClick(idx);
      });
      cardsEl.appendChild(card);
    }
  }

  function updatePrompt() {
    if (!promptEl) return;
    var st = G.getState();
    if (st.mode === 'same') {
      promptEl.textContent = 'Tìm cái giống với đây:';
    } else {
      promptEl.textContent = 'Tìm cái khác với các cái còn lại:';
    }
  }

  function onCardClick(index) {
    var result = G.onCardClick(index);
    var cards = cardsEl ? cardsEl.querySelectorAll('.same-diff-card') : [];
    var card = cards[index];
    if (result.correct) {
      if (card) card.classList.add('correct');
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      if (promptEl) promptEl.textContent = 'Đúng rồi!';
      setTimeout(function () {
        if (result.roundOver || G.isRoundOver()) {
          showSummary();
          return;
        }
        G.nextQuestion();
        updatePrompt();
        renderSample();
        renderCards();
        updateScoreDisplay();
      }, 1500);
    } else {
      if (card) card.classList.add('wrong');
      if (window.webGameSfx) window.webGameSfx.playWrong();
      if (result.roundOver) {
        setTimeout(function () {
          showSummary();
        }, 800);
      } else {
        setTimeout(function () {
          if (card) card.classList.remove('wrong');
        }, 800);
      }
    }
  }

  function updateScoreDisplay() {
    var st = G.getState();
    if (st.roundsMode === 'continuous') {
      if (scoreWrap) scoreWrap.hidden = true;
      return;
    }
    if (scoreWrap) scoreWrap.hidden = false;
    var limit = st.roundsMode === '5' ? 5 : 10;
    if (scoreEl) scoreEl.textContent = 'Đúng: ' + st.score + ' / ' + limit;
  }

  function showSummary() {
    var st = G.getState();
    if (summaryWrap) summaryWrap.hidden = false;
    var limit = st.roundsMode === '5' ? 5 : 10;
    if (summaryText) summaryText.textContent = 'Bé đúng ' + st.score + ' / ' + limit + '!';
    if (btnReplay) btnReplay.focus();
  }

  function hideSummary() {
    if (summaryWrap) summaryWrap.hidden = true;
  }

  function startGame() {
    hideSummary();
    G.resetGame();
    updatePrompt();
    renderSample();
    renderCards();
    updateScoreDisplay();
  }

  function setActiveMode(mode) {
    var btns = document.querySelectorAll('.same-diff-mode-btn');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (b.dataset.mode === mode) {
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      }
    }
  }

  function setActiveTopic(topic) {
    var btns = document.querySelectorAll('.same-diff-topic-btn');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (b.dataset.topic === topic) {
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      }
    }
  }

  function setActiveRounds(rounds) {
    var btns = document.querySelectorAll('.same-diff-rounds-btn');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (b.dataset.rounds === rounds) {
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      }
    }
  }

  // Chế độ: Tìm giống / Tìm khác
  var modeBtns = document.querySelectorAll('.same-diff-mode-btn');
  for (var m = 0; m < modeBtns.length; m++) {
    modeBtns[m].addEventListener('click', function () {
      var mode = this.dataset.mode;
      if (!mode) return;
      setActiveMode(mode);
      G.setMode(mode);
      startGame();
    });
  }

  // Chủ đề: Chữ / Số / Màu
  var topicBtns = document.querySelectorAll('.same-diff-topic-btn');
  for (var t = 0; t < topicBtns.length; t++) {
    topicBtns[t].addEventListener('click', function () {
      var topic = this.dataset.topic;
      if (!topic) return;
      setActiveTopic(topic);
      G.setTopic(topic);
      startGame();
    });
  }

  // Chơi: Liên tục / 5 câu / 10 câu
  var roundsBtns = document.querySelectorAll('.same-diff-rounds-btn');
  for (var r = 0; r < roundsBtns.length; r++) {
    roundsBtns[r].addEventListener('click', function () {
      var rounds = this.dataset.rounds;
      if (rounds === undefined) return;
      setActiveRounds(rounds);
      G.setRoundsMode(rounds);
      startGame();
    });
  }

  if (btnReplay) btnReplay.addEventListener('click', startGame);
  if (btnReplaySecondary) btnReplaySecondary.addEventListener('click', startGame);

  startGame();
})();
