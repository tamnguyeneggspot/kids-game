/**
 * Puzzle - UI: chọn độ khó, hình, gắn event (click = move vào ô trống, drag chỉ mảnh cạnh ô trống, drop chỉ vào ô trống).
 */
(function () {
  'use strict';

  var boardEl = document.getElementById('puzzleBoard');
  var completeEl = document.getElementById('puzzleComplete');
  var btnReplayEl = document.getElementById('puzzleBtnReplay');
  var btnAnotherEl = document.getElementById('puzzleBtnAnother');
  var imageGridEl = document.getElementById('puzzleImageGrid');
  var diffBtns = document.querySelectorAll('.puzzle-diff-btn');

  var currentImageId = null;
  var currentPieces = 4;

  function getCurrentImageId() {
    return currentImageId || (PuzzleShared.getImageList()[0] && PuzzleShared.getImageList()[0].id);
  }

  function getCurrentPieces() {
    var active = document.querySelector('.puzzle-diff-btn.active');
    if (active && active.dataset.pieces) {
      return parseInt(active.dataset.pieces, 10);
    }
    return 4;
  }

  function startGame(imageId, pieces) {
    imageId = imageId || getCurrentImageId();
    pieces = pieces || getCurrentPieces();
    currentImageId = imageId;
    currentPieces = pieces;
    var imageItem = PuzzleShared.getImageById(imageId);
    PuzzleGame.initPuzzle(imageItem, pieces, {
      boardEl: boardEl,
      completeEl: completeEl,
      btnReplayEl: btnReplayEl,
      btnAnotherEl: btnAnotherEl
    });
    setActiveImageButton(imageId);
    var hintEl = document.getElementById('puzzleBoardHint');
    if (hintEl) {
      var totalSlots = pieces + 1;
      hintEl.textContent = 'Bảng hiện tại: ' + totalSlots + ' ô (gồm 1 ô trống). Chọn nút trên để đổi.';
    }
  }

  function setActiveImageButton(imageId) {
    if (!imageGridEl) return;
    var btns = imageGridEl.querySelectorAll('.puzzle-image-btn');
    btns.forEach(function (btn) {
      if (btn.dataset.imageId === imageId) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  var boardEventsBound = false;

  function bindBoardClicks() {
    if (!boardEl) return;
    if (boardEventsBound) return;
    boardEventsBound = true;

    /* Delegation: gắn một lần lên board, vẫn đúng sau mỗi move (DOM thay đổi nội dung ô) */
    boardEl.addEventListener('click', function (e) {
      var piece = e.target.closest('.puzzle-piece');
      if (!piece) return;
      var slot = parseInt(piece.dataset.slot, 10);
      if (!isNaN(slot)) PuzzleGame.onPieceClick(slot);
    });
    boardEl.addEventListener('keydown', function (e) {
      var piece = e.target.closest('.puzzle-piece');
      if (!piece || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      var slot = parseInt(piece.dataset.slot, 10);
      if (!isNaN(slot)) PuzzleGame.onPieceClick(slot);
    });
    boardEl.addEventListener('dragstart', function (e) {
      var piece = e.target.closest('.puzzle-piece');
      if (!piece) return;
      var slot = parseInt(piece.dataset.slot, 10);
      if (isNaN(slot) || !PuzzleGame.canDrag(slot)) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('text/plain', String(slot));
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setDragImage(piece, 0, 0);
      piece.classList.add('puzzle-piece-dragging');
    });
    boardEl.addEventListener('dragend', function (e) {
      var piece = e.target.closest('.puzzle-piece');
      if (piece) piece.classList.remove('puzzle-piece-dragging');
      boardEl.querySelectorAll('.puzzle-empty').forEach(function (el) {
        el.classList.remove('puzzle-empty-drag-over');
      });
    });
    boardEl.addEventListener('dragover', function (e) {
      var empty = e.target.closest('.puzzle-empty');
      if (!empty) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      empty.classList.add('puzzle-empty-drag-over');
    });
    boardEl.addEventListener('dragleave', function (e) {
      var empty = e.target.closest('.puzzle-empty');
      if (empty && !empty.contains(e.relatedTarget)) empty.classList.remove('puzzle-empty-drag-over');
    });
    boardEl.addEventListener('drop', function (e) {
      var empty = e.target.closest('.puzzle-empty');
      if (!empty) return;
      e.preventDefault();
      empty.classList.remove('puzzle-empty-drag-over');
      var sourceSlot = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (isNaN(sourceSlot)) return;
      PuzzleGame.movePieceToEmptySlot(sourceSlot);
    });
  }

  function renderImageSelect() {
    if (!imageGridEl) return;
    imageGridEl.innerHTML = '';
    var list = PuzzleShared.getImageList();
    list.forEach(function (img, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'puzzle-image-btn' + (index === 0 ? ' active' : '');
      btn.dataset.imageId = img.id;
      btn.setAttribute('aria-label', 'Chọn hình: ' + (img.name || img.id));
      btn.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      if (img.type === 'gradient' && img.css) {
        btn.style.backgroundImage = img.css;
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundPosition = 'center';
      } else if (img.type === 'url' && img.url) {
        btn.style.backgroundImage = 'url(' + img.url + ')';
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundPosition = 'center';
      } else {
        btn.style.background = img.css || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
      btn.addEventListener('click', function () {
        startGame(img.id, getCurrentPieces());
        bindBoardClicks();
      });
      imageGridEl.appendChild(btn);
    });
  }

  function onDifficultyChange(e) {
    var btn = e.target;
    if (!btn.classList.contains('puzzle-diff-btn')) return;
    diffBtns.forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    var pieces = parseInt(btn.dataset.pieces, 10);
    currentPieces = pieces;
    startGame(getCurrentImageId(), pieces);
    bindBoardClicks();
  }

  function onReplay() {
    if (completeEl) completeEl.hidden = true;
    PuzzleGame.resetGame();
    bindBoardClicks();
  }

  function onAnother() {
    if (completeEl) completeEl.hidden = true;
    var list = PuzzleShared.getImageList();
    var current = getCurrentImageId();
    var idx = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === current) { idx = i; break; }
    }
    var nextIdx = (idx + 1) % list.length;
    var nextId = list[nextIdx] ? list[nextIdx].id : (list[0] ? list[0].id : '');
    startGame(nextId, getCurrentPieces());
    bindBoardClicks();
  }

  if (diffBtns.length) {
    diffBtns.forEach(function (btn) {
      btn.addEventListener('click', onDifficultyChange);
    });
  }

  if (btnReplayEl) {
    btnReplayEl.addEventListener('click', onReplay);
  }
  if (btnAnotherEl) {
    btnAnotherEl.addEventListener('click', onAnother);
  }

  renderImageSelect();
  startGame(getCurrentImageId(), 4);
  bindBoardClicks();
})();
