/**
 * UI game Đếm và chọn số: chế độ, render câu hỏi (N emoji) + choices, gắn event, Chơi lại.
 */
(function () {
  'use strict';

  var S = window.countMatchShared;
  var G = window.CountMatchGame;
  if (!S || !G) return;

  var objectsEl = document.getElementById('countMatchObjects');
  var choicesEl = document.getElementById('countMatchChoices');
  var scoreWrap = document.getElementById('countMatchScoreWrap');
  var scoreEl = document.getElementById('countMatchScore');
  var summaryWrap = document.getElementById('countMatchSummary');
  var summaryText = document.getElementById('countMatchSummaryText');
  var btnReplay = document.getElementById('countMatchBtnReplay');
  var btnReplaySecondary = document.getElementById('countMatchBtnReplaySecondary');

  function renderQuestion() {
    var st = G.getState();
    if (!objectsEl || !st.currentQuestion) return;
    var q = st.currentQuestion;
    objectsEl.innerHTML = '';
    objectsEl.setAttribute('aria-label', 'Có bao nhiêu đồ vật?');
    for (var i = 0; i < q.count; i++) {
      var span = document.createElement('span');
      span.className = 'count-match-emoji';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = q.objectDisplay;
      objectsEl.appendChild(span);
    }
  }

  function renderChoices() {
    var st = G.getState();
    if (!choicesEl) return;
    choicesEl.innerHTML = '';
    for (var i = 0; i < st.choices.length; i++) {
      var value = st.choices[i];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'count-match-btn';
      btn.dataset.value = String(value);
      btn.setAttribute('aria-label', 'Số ' + value);
      btn.textContent = value;
      btn.addEventListener('click', function () {
        var val = parseInt(this.dataset.value, 10);
        onChoiceClick(val);
      });
      choicesEl.appendChild(btn);
    }
  }

  function onChoiceClick(value) {
    var result = G.onChoiceClick(value);
    var buttons = choicesEl ? choicesEl.querySelectorAll('.count-match-btn') : [];
    var targetBtn = null;
    for (var i = 0; i < buttons.length; i++) {
      if (parseInt(buttons[i].dataset.value, 10) === value) {
        targetBtn = buttons[i];
        break;
      }
    }
    if (result.correct) {
      if (targetBtn) targetBtn.classList.add('correct');
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      setTimeout(function () {
        if (result.roundOver || G.isRoundOver()) {
          showSummary();
          return;
        }
        G.nextQuestion();
        renderQuestion();
        renderChoices();
        updateScoreDisplay();
      }, 1500);
    } else {
      if (targetBtn) targetBtn.classList.add('wrong');
      if (window.webGameSfx) window.webGameSfx.playWrong();
      if (result.roundOver) {
        setTimeout(function () {
          showSummary();
        }, 800);
      } else {
        setTimeout(function () {
          if (targetBtn) targetBtn.classList.remove('wrong');
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
    if (summaryText) summaryText.textContent = 'Đúng ' + st.score + ' / ' + limit + '!';
    if (btnReplay) btnReplay.focus();
  }

  function hideSummary() {
    if (summaryWrap) summaryWrap.hidden = true;
  }

  function startGame() {
    hideSummary();
    G.resetGame();
    renderQuestion();
    renderChoices();
    updateScoreDisplay();
  }

  function onReplay() {
    startGame();
  }

  function setActiveMode(mode) {
    var modeBtns = document.querySelectorAll('.count-match-mode-btn');
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

  var modeBtns = document.querySelectorAll('.count-match-mode-btn');
  for (var m = 0; m < modeBtns.length; m++) {
    modeBtns[m].addEventListener('click', function () {
      var mode = this.dataset.mode;
      if (mode === undefined) return;
      setActiveMode(mode);
      G.setMode(mode);
      startGame();
    });
  }

  if (btnReplay) btnReplay.addEventListener('click', onReplay);
  if (btnReplaySecondary) btnReplaySecondary.addEventListener('click', onReplay);

  startGame();
})();
