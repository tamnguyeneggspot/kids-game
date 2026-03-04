/**
 * Puzzle - Logic: 1 ô trống, chỉ kéo mảnh cạnh ô trống vào ô trống (sliding puzzle).
 */
(function (global) {
  'use strict';

  var state = {
    imageKey: null,
    imageItem: null,
    difficulty: 4,
    cols: 2,
    rows: 2,
    slots: [],
    emptySlot: 0,
    total: 0,
    locked: false,
    slotPositions: [],  // {c, r} cho mỗi slot (layout bảng, ô trống N+1 nằm riêng)
    gridCols: 2,
    gridRows: 2
  };

  var boardEl = null;
  var completeEl = null;
  var btnReplayEl = null;
  var btnAnotherEl = null;

  function playSfx(name) {
    if (name === 'correct' && window.webGameSfx && typeof window.webGameSfx.playCorrect === 'function') {
      window.webGameSfx.playCorrect();
    } else if ((name === 'wrong' || name === 'win') && window.webGameSfx && typeof window.webGameSfx.playWrong === 'function') {
      if (name === 'win') window.webGameSfx.playCorrect();
      else window.webGameSfx.playWrong();
    }
  }

  /** Cỡ ảnh (số mảnh theo chiều): 4→2×2, 6→2×3, 9→3×3. */
  function getColsRows(pieces) {
    if (pieces === 4) return { cols: 2, rows: 2 };
    if (pieces === 6) return { cols: 2, rows: 3 };
    if (pieces === 9) return { cols: 3, rows: 3 };
    return { cols: 2, rows: 2 };
  }

  /**
   * Layout bảng: total = pieces+1 (thêm 1 ô trống item N+1).
   * 4 mảnh: 5 ô, lưới 2×3, ô trống ở dưới bên phải.
   * 6 mảnh: 7 ô; 9 mảnh: 10 ô.
   */
  function getSlotLayout(pieces) {
    if (pieces === 4) {
      return {
        total: 5,
        gridCols: 2,
        gridRows: 3,
        positions: [{ c: 0, r: 0 }, { c: 1, r: 0 }, { c: 0, r: 1 }, { c: 1, r: 1 }, { c: 1, r: 2 }]
      };
    }
    if (pieces === 6) {
      return {
        total: 7,
        gridCols: 3,
        gridRows: 3,
        positions: [{ c: 0, r: 0 }, { c: 1, r: 0 }, { c: 0, r: 1 }, { c: 1, r: 1 }, { c: 0, r: 2 }, { c: 1, r: 2 }, { c: 2, r: 2 }]
      };
    }
    if (pieces === 9) {
      return {
        total: 10,
        gridCols: 3,
        gridRows: 4,
        positions: [
          { c: 0, r: 0 }, { c: 1, r: 0 }, { c: 2, r: 0 },
          { c: 0, r: 1 }, { c: 1, r: 1 }, { c: 2, r: 1 },
          { c: 0, r: 2 }, { c: 1, r: 2 }, { c: 2, r: 2 },
          { c: 1, r: 3 }
        ]
      };
    }
    return { total: 5, gridCols: 2, gridRows: 3, positions: [{ c: 0, r: 0 }, { c: 1, r: 0 }, { c: 0, r: 1 }, { c: 1, r: 1 }, { c: 1, r: 2 }] };
  }

  function getBackgroundPosition(col, row, cols, rows) {
    var x = cols > 1 ? (col / (cols - 1)) * 100 : 0;
    var y = rows > 1 ? (row / (rows - 1)) * 100 : 0;
    return x + '% ' + y + '%';
  }

  function getBackgroundSize(cols, rows) {
    return (cols * 100) + '% ' + (rows * 100) + '%';
  }

  /** Nhãn ô trống: luôn là item N+1 (vd. 4 mảnh → 5 ô, ô trống là Mảnh 5). */
  function getEmptyItemLabel() {
    return 'Mảnh ' + state.total + ' (ô trống)';
  }

  /**
   * Hai ô có cạnh nhau không (theo layout slotPositions).
   */
  function isAdjacent(slotA, slotB) {
    var pA = state.slotPositions[slotA];
    var pB = state.slotPositions[slotB];
    if (!pA || !pB) return false;
    return (Math.abs(pA.c - pB.c) + Math.abs(pA.r - pB.r)) === 1;
  }

  /**
   * Sau shuffle: đưa ô trống về hàng cuối (khi start game empty luôn ở row cuối).
   */
  function moveEmptyToLastRow() {
    var lastRow = state.gridRows - 1;
    var targetSlot = -1;
    for (var s = 0; s < state.total; s++) {
      if (state.slotPositions[s] && state.slotPositions[s].r === lastRow) {
        targetSlot = s;
      }
    }
    if (targetSlot < 0 || state.emptySlot === targetSlot) return;
    var t = state.slots[state.emptySlot];
    state.slots[state.emptySlot] = state.slots[targetSlot];
    state.slots[targetSlot] = t;
    state.emptySlot = targetSlot;
  }

  /**
   * Shuffle: bắt đầu từ trạng thái giải xong, đổi ngẫu nhiên với ô trống (chỉ ô kề cạnh).
   */
  function shuffleSlots() {
    var total = state.total;
    var empty = state.emptySlot;
    var moves = total * 25;
    for (var i = 0; i < moves; i++) {
      var neighbors = [];
      for (var s = 0; s < total; s++) {
        if (s !== empty && isAdjacent(s, empty)) neighbors.push(s);
      }
      if (neighbors.length === 0) continue;
      var idx = Math.floor(Math.random() * neighbors.length);
      var next = neighbors[idx];
      var t = state.slots[empty];
      state.slots[empty] = state.slots[next];
      state.slots[next] = t;
      state.emptySlot = next;
      empty = next;
    }
  }

  /**
   * Khởi tạo bảng: total = pieces+1 (ô trống = item N+1), layout từ getSlotLayout.
   */
  function initPuzzle(imageItem, pieces, opts) {
    opts = opts || {};
    boardEl = opts.boardEl || document.getElementById('puzzleBoard');
    completeEl = opts.completeEl || document.getElementById('puzzleComplete');
    btnReplayEl = opts.btnReplayEl || document.getElementById('puzzleBtnReplay');
    btnAnotherEl = opts.btnAnotherEl || document.getElementById('puzzleBtnAnother');

    if (!imageItem || !boardEl) return;

    var cr = getColsRows(pieces);
    var layout = getSlotLayout(pieces);
    state.imageKey = imageItem.id;
    state.imageItem = imageItem;
    state.difficulty = pieces;
    state.cols = cr.cols;
    state.rows = cr.rows;
    state.locked = false;
    state.total = layout.total;
    state.slotPositions = layout.positions;
    state.gridCols = layout.gridCols;
    state.gridRows = layout.gridRows;

    state.slots = [];
    for (var i = 0; i < state.total - 1; i++) state.slots.push(i);
    state.slots.push(null);
    state.emptySlot = state.total - 1;
    shuffleSlots();
    moveEmptyToLastRow();

    if (completeEl) completeEl.hidden = true;

    boardEl.innerHTML = '';
    boardEl.className = 'puzzle-board puzzle-cols-' + state.gridCols + ' puzzle-rows-' + state.gridRows;

    var bgImage = '';
    var bgSize = getBackgroundSize(state.cols, state.rows);
    if (imageItem.type === 'gradient' && imageItem.css) {
      bgImage = imageItem.css;
    } else if (imageItem.type === 'url' && imageItem.url) {
      bgImage = 'url(' + imageItem.url + ')';
    } else {
      bgImage = imageItem.css || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    for (var slot = 0; slot < state.total; slot++) {
      var div = document.createElement('div');
      div.dataset.slot = slot;
      var pos = state.slotPositions[slot];
      if (pos) {
        div.style.gridColumn = String(pos.c + 1);
        div.style.gridRow = String(pos.r + 1);
      }
      div.setAttribute('aria-label', slot === state.emptySlot ? getEmptyItemLabel() : 'Mảnh ' + (state.slots[slot] + 1));
      if (state.slots[slot] === null) {
        div.className = 'puzzle-empty';
        div.dataset.emptyItem = String(state.total);
        div.setAttribute('role', 'group');
      } else {
        var pieceId = state.slots[slot];
        var row = Math.floor(pieceId / state.cols);
        var col = pieceId % state.cols;
        var bp = getBackgroundPosition(col, row, state.cols, state.rows);
        div.className = 'puzzle-piece';
        div.draggable = true;
        div.dataset.pieceId = pieceId;
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        div.style.backgroundImage = bgImage;
        div.style.backgroundSize = bgSize;
        div.style.backgroundPosition = bp;
      }
      boardEl.appendChild(div);
    }
    updateCorrectClasses();
  }

  /**
   * Cập nhật nội dung một ô trên DOM (sau khi move).
   */
  function updateCell(slot, bgImage, bgSize) {
    if (!boardEl) return;
    var cell = boardEl.querySelector('[data-slot="' + slot + '"]');
    if (!cell) return;
    var pieceId = state.slots[slot];
    if (pieceId === null) {
      cell.className = 'puzzle-empty';
      cell.dataset.emptyItem = String(state.total);
      cell.removeAttribute('draggable');
      cell.removeAttribute('data-piece-id');
      cell.style.backgroundImage = '';
      cell.style.backgroundSize = '';
      cell.style.backgroundPosition = '';
      cell.setAttribute('aria-label', getEmptyItemLabel());
      cell.setAttribute('role', 'group');
    } else {
      cell.removeAttribute('data-empty-item');
      var row = Math.floor(pieceId / state.cols);
      var col = pieceId % state.cols;
      var pos = getBackgroundPosition(col, row, state.cols, state.rows);
      cell.className = 'puzzle-piece';
      cell.draggable = true;
      cell.dataset.pieceId = pieceId;
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');
      cell.style.backgroundImage = bgImage;
      cell.style.backgroundSize = bgSize;
      cell.style.backgroundPosition = pos;
      cell.setAttribute('aria-label', 'Mảnh ' + (pieceId + 1));
    }
  }

  function getBgImage() {
    if (!state.imageItem) return { bgImage: '', bgSize: '100% 100%' };
    var bgImage = '';
    var bgSize = getBackgroundSize(state.cols, state.rows);
    if (state.imageItem.type === 'gradient' && state.imageItem.css) {
      bgImage = state.imageItem.css;
    } else if (state.imageItem.type === 'url' && state.imageItem.url) {
      bgImage = 'url(' + state.imageItem.url + ')';
    } else {
      bgImage = state.imageItem.css || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    return { bgImage: bgImage, bgSize: bgSize };
  }

  /**
   * Di chuyển mảnh từ sourceSlot vào ô trống (chỉ hợp lệ khi source kề ô trống).
   */
  function movePieceToEmpty(sourceSlot) {
    if (state.locked || state.slots[sourceSlot] === null) return false;
    if (!isAdjacent(sourceSlot, state.emptySlot)) return false;

    var emptySlot = state.emptySlot;
    state.slots[emptySlot] = state.slots[sourceSlot];
    state.slots[sourceSlot] = null;
    state.emptySlot = sourceSlot;

    var bg = getBgImage();
    updateCell(emptySlot, bg.bgImage, bg.bgSize);
    updateCell(sourceSlot, bg.bgImage, bg.bgSize);
    updateCorrectClasses();
    playSfx('correct');
    checkComplete();
    return true;
  }

  /**
   * Mảnh tại slot đã đúng vị trí chưa (pieceId === slot, trừ ô trống).
   */
  function isPieceCorrect(slot) {
    if (state.slots[slot] === null) return true;
    return state.slots[slot] === slot;
  }

  function countCorrect() {
    var n = 0;
    for (var i = 0; i < state.total; i++) {
      if (state.slots[i] === null) n++;
      else if (state.slots[i] === i) n++;
    }
    return n;
  }

  function updateCorrectClasses() {
    if (!boardEl) return;
    var cells = boardEl.querySelectorAll('.puzzle-piece');
    cells.forEach(function (cell) {
      var slot = parseInt(cell.dataset.slot, 10);
      if (isNaN(slot)) return;
      if (state.slots[slot] === slot) {
        cell.classList.add('correct');
        cell.setAttribute('aria-label', 'Mảnh ' + (slot + 1) + ', đã đúng vị trí');
      } else {
        cell.classList.remove('correct');
        cell.setAttribute('aria-label', 'Mảnh ' + (state.slots[slot] + 1));
      }
      if (isAdjacent(slot, state.emptySlot)) {
        cell.classList.add('puzzle-piece-movable');
      } else {
        cell.classList.remove('puzzle-piece-movable');
      }
    });
  }

  /**
   * Click: nếu click mảnh kề ô trống thì di chuyển mảnh vào ô trống.
   */
  function onPieceClick(slot) {
    if (state.locked) return;
    if (state.slots[slot] === null) return;
    movePieceToEmpty(slot);
  }

  /**
   * Chỉ cho phép kéo mảnh nếu mảnh đó kề ô trống.
   */
  function canDrag(slot) {
    if (state.slots[slot] === null) return false;
    return isAdjacent(slot, state.emptySlot);
  }

  /**
   * Chỉ cho phép thả vào ô trống. Trả về true nếu move thành công.
   */
  function movePieceToEmptySlot(sourceSlot) {
    return movePieceToEmpty(sourceSlot);
  }

  function checkComplete() {
    for (var i = 0; i < state.total; i++) {
      if (state.slots[i] !== null && state.slots[i] !== i) return;
      if (state.slots[i] === null && i !== state.total - 1) return;
    }
    state.locked = true;
    if (completeEl) {
      completeEl.hidden = false;
      var msg = completeEl.querySelector('.puzzle-complete-msg');
      if (msg) msg.textContent = 'Bé đã ghép xong! 🎉';
      if (btnReplayEl) btnReplayEl.focus();
    }
    playSfx('win');
  }

  function resetGame() {
    if (!state.imageItem) return;
    initPuzzle(state.imageItem, state.difficulty, {
      boardEl: boardEl,
      completeEl: completeEl,
      btnReplayEl: btnReplayEl,
      btnAnotherEl: btnAnotherEl
    });
    updateCorrectClasses();
  }

  global.PuzzleGame = {
    initPuzzle: initPuzzle,
    onPieceClick: onPieceClick,
    canDrag: canDrag,
    movePieceToEmptySlot: movePieceToEmptySlot,
    getEmptySlot: function () { return state.emptySlot; },
    resetGame: resetGame,
    getState: function () { return state; }
  };
})(this);
