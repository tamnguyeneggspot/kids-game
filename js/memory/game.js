/**
 * Memory Match - Logic game: init board, flip, check pair, turn, game over
 */
(function (global) {
  'use strict';

  var PAIR_CHECK_DELAY_MS = 1200;

  var state = {
    deck: [],
    flippedCards: [],
    currentTurn: 'kid',
    scores: { kid: 0, adult: 0 },
    locked: false,
    matchedCount: 0
  };

  var boardEl = null;
  var turnEl = null;
  var scoresEl = null;
  var gameOverEl = null;
  var btnReplayEl = null;

  function setTurn(turn) {
    state.currentTurn = turn;
    if (turnEl) {
      turnEl.textContent = turn === 'kid'
        ? 'Lượt của: Bé 🧒'
        : 'Lượt của: Người lớn 👩';
    }
    updateScoresUI();
  }

  function updateScoresUI() {
    if (scoresEl) {
      scoresEl.textContent = 'Bé: ' + state.scores.kid + ' — Người lớn: ' + state.scores.adult;
    }
  }

  function playSfx(name) {
    if (typeof window.playSfx === 'function') {
      window.playSfx(name);
    }
  }

  function renderCardContent(content, type) {
    if (type === 'colors' && content && typeof content === 'object') {
      var div = document.createElement('div');
      div.className = 'memory-card-color';
      div.style.backgroundColor = content.hex || '#ccc';
      div.setAttribute('aria-hidden', 'true');
      var span = document.createElement('span');
      span.className = 'memory-card-color-name';
      span.textContent = content.name || '';
      div.appendChild(span);
      return div;
    }
    return document.createTextNode(String(content));
  }

  function createCard(item, index) {
    var type = item.type || 'letters';
    var content = item.content;
    var pairId = item.pairId;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'memory-card';
    btn.dataset.index = index;
    btn.dataset.pairId = pairId;
    btn.setAttribute('aria-label', 'Thẻ ' + (index + 1) + ', chưa lật');

    var front = document.createElement('span');
    front.className = 'memory-card-front';
    front.setAttribute('aria-hidden', 'true');
    front.textContent = '?'; /* CSS dùng ::before để hiển thị, giữ text cho a11y */

    var back = document.createElement('span');
    back.className = 'memory-card-back';
    back.setAttribute('aria-hidden', 'true');
    if (type === 'colors' && content && typeof content === 'object') {
      var colorBlock = renderCardContent(content, type);
      back.appendChild(colorBlock);
    } else {
      back.textContent = typeof content === 'object' ? (content.name || '') : String(content);
    }

    btn.appendChild(front);
    btn.appendChild(back);
    return btn;
  }

  function initBoard(deck, opts) {
    opts = opts || {};
    boardEl = opts.boardEl || document.getElementById('memoryBoard');
    turnEl = opts.turnEl || document.getElementById('memoryTurn');
    scoresEl = opts.scoresEl || document.getElementById('memoryScores');
    gameOverEl = opts.gameOverEl || document.getElementById('memoryGameOver');
    btnReplayEl = opts.btnReplayEl || document.getElementById('memoryBtnReplay');

    state.deck = deck;
    state.flippedCards = [];
    state.currentTurn = 'kid';
    state.scores = { kid: 0, adult: 0 };
    state.locked = false;
    state.matchedCount = 0;

    setTurn('kid');
    updateScoresUI();

    if (gameOverEl) gameOverEl.hidden = true;
    if (!boardEl) return;

    boardEl.innerHTML = '';
    deck.forEach(function (item, index) {
      var card = createCard(item, index);
      boardEl.appendChild(card);
    });
  }

  function allMatched() {
    var totalPairs = state.deck.length / 2;
    return state.matchedCount >= totalPairs;
  }

  function onCardClick(index, cardEl) {
    if (state.locked) return;
    if (!cardEl || cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    state.flippedCards.push({ index: index, el: cardEl, pairId: state.deck[index].pairId });
    cardEl.classList.add('flipped');
    cardEl.setAttribute('aria-label', 'Thẻ đã lật: ' + (state.deck[index].type === 'colors'
      ? (state.deck[index].content.name || '')
      : String(state.deck[index].content)));

    if (state.flippedCards.length < 2) return;

    state.locked = true;
    var first = state.flippedCards[0];
    var second = state.flippedCards[1];

    if (first.pairId === second.pairId) {
      first.el.classList.add('matched');
      second.el.classList.add('matched');
      first.el.setAttribute('aria-disabled', 'true');
      second.el.setAttribute('aria-disabled', 'true');
      state.scores[state.currentTurn] += 1;
      state.matchedCount += 1;
      updateScoresUI();
      playSfx('correct');
      state.flippedCards = [];
      state.locked = false;

      if (allMatched()) {
        if (gameOverEl) {
          gameOverEl.hidden = false;
          playSfx('win');
        }
        return;
      }
      return;
    }

    setTimeout(function () {
      first.el.classList.remove('flipped');
      second.el.classList.remove('flipped');
      first.el.setAttribute('aria-label', 'Thẻ ' + (first.index + 1) + ', chưa lật');
      second.el.setAttribute('aria-label', 'Thẻ ' + (second.index + 1) + ', chưa lật');
      playSfx('wrong');
      state.flippedCards = [];
      state.currentTurn = state.currentTurn === 'kid' ? 'adult' : 'kid';
      setTurn(state.currentTurn);
      state.locked = false;
    }, PAIR_CHECK_DELAY_MS);
  }

  function resetGame(deck) {
    if (!deck) deck = state.deck;
    if (deck.length === 0) return;
    initBoard(deck, {
      boardEl: boardEl,
      turnEl: turnEl,
      scoresEl: scoresEl,
      gameOverEl: gameOverEl,
      btnReplayEl: btnReplayEl
    });
  }

  global.MemoryGame = {
    initBoard: initBoard,
    onCardClick: onCardClick,
    setTurn: setTurn,
    resetGame: resetGame,
    getState: function () { return state; }
  };
})(this);
