/**
 * Memory Match - Khởi tạo UI, chọn bộ thẻ, gắn event
 */
(function () {
  'use strict';

  var boardEl = document.getElementById('memoryBoard');
  var turnEl = document.getElementById('memoryTurn');
  var scoresEl = document.getElementById('memoryScores');
  var gameOverEl = document.getElementById('memoryGameOver');
  var btnReplayEl = document.getElementById('memoryBtnReplay');
  var deckBtns = document.querySelectorAll('.deck-btn');

  function getCurrentDeckType() {
    var active = document.querySelector('.deck-btn.active');
    return (active && active.dataset.deck) ? active.dataset.deck : 'letters';
  }

  function startGame(deckType) {
    deckType = deckType || getCurrentDeckType();
    var deck = MemoryShared.getDeck(deckType);
    MemoryGame.initBoard(deck, {
      boardEl: boardEl,
      turnEl: turnEl,
      scoresEl: scoresEl,
      gameOverEl: gameOverEl,
      btnReplayEl: btnReplayEl
    });
    bindCardClicks();
  }

  function bindCardClicks() {
    if (!boardEl) return;
    var cards = boardEl.querySelectorAll('.memory-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var index = parseInt(card.dataset.index, 10);
        MemoryGame.onCardClick(index, card);
      });
    });
  }

  function onDeckChange(e) {
    var btn = e.target;
    if (!btn.classList.contains('deck-btn')) return;
    deckBtns.forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    startGame(btn.dataset.deck);
  }

  function onReplay() {
    if (gameOverEl) gameOverEl.hidden = true;
    startGame();
  }

  if (deckBtns.length) {
    deckBtns.forEach(function (btn) {
      btn.addEventListener('click', onDeckChange);
    });
  }

  if (btnReplayEl) {
    btnReplayEl.addEventListener('click', onReplay);
  }

  startGame('letters');
})();
