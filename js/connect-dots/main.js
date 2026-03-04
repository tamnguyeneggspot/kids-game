/**
 * UI game Nối chấm theo số: chọn hình, gắn click/touch lên canvas, Chơi lại / Hình khác.
 */
(function () {
  'use strict';

  var S = window.connectDotsShared;
  var G = window.ConnectDotsGame;
  if (!S || !G) return;

  var canvasEl = document.getElementById('connectDotsCanvas');
  var statusEl = document.getElementById('connectDotsStatus');
  var shapeSelect = document.getElementById('connectDotsShape');
  var btnReplay = document.getElementById('connectDotsBtnReplay');
  var btnOtherShape = document.getElementById('connectDotsBtnOtherShape');

  function setStatus(text, isSuccess) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.toggle('is-success', !!isSuccess);
  }

  function getCanvasCoords(e) {
    if (!canvasEl) return { x: 0, y: 0 };
    var rect = canvasEl.getBoundingClientRect();
    var scaleX = canvasEl.width / rect.width;
    var scaleY = canvasEl.height / rect.height;
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function handlePointClick(px, py) {
    var index = G.getPointAt(px, py);
    if (index < 0) return;
    var result = G.onPointClick(index);
    if (result.correct) {
      if (window.webGameSfx) window.webGameSfx.playCorrect();
      if (result.completed) {
        setStatus('Bé đã nối xong!', true);
        if (window.webGameSfx) window.webGameSfx.playCorrect();
        if (btnReplay) btnReplay.focus();
      } else {
        setStatus('Tiếp tục click đúng thứ tự nhé!', false);
      }
    } else {
      if (window.webGameSfx) window.webGameSfx.playWrong();
      setStatus('Chưa đúng thứ tự. Click theo số 1 → 2 → 3 → … nhé!', false);
    }
  }

  function startWithShape(shape) {
    if (!shape || !canvasEl) return;
    G.initShape(shape, canvasEl);
    setStatus('Click theo thứ tự 1 → 2 → 3 → … để nối thành hình.', false);
    if (shapeSelect && shapeSelect.value !== shape.id) {
      shapeSelect.value = shape.id;
    }
  }

  function fillShapeSelector() {
    if (!shapeSelect) return;
    var shapes = S.getShapes();
    shapeSelect.innerHTML = '';
    for (var i = 0; i < shapes.length; i++) {
      var opt = document.createElement('option');
      opt.value = shapes[i].id;
      opt.textContent = shapes[i].name;
      shapeSelect.appendChild(opt);
    }
  }

  if (canvasEl) {
    canvasEl.addEventListener('click', function (e) {
      if (G.getState().completed) return;
      var coords = getCanvasCoords(e);
      handlePointClick(coords.x, coords.y);
    });
    canvasEl.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      if (G.getState().completed) return;
      var coords = getCanvasCoords(e);
      handlePointClick(coords.x, coords.y);
    }, { passive: false });
  }

  if (shapeSelect) {
    shapeSelect.addEventListener('change', function () {
      var shape = S.getShape(shapeSelect.value);
      if (shape) startWithShape(shape);
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', function () {
      G.resetGame();
      setStatus('Click theo thứ tự 1 → 2 → 3 → … để nối thành hình.', false);
      var st = G.getState();
      if (st.shape) startWithShape(st.shape);
    });
  }

  if (btnOtherShape) {
    btnOtherShape.addEventListener('click', function () {
      var shape = S.getRandomShape();
      startWithShape(shape);
    });
  }

  // Responsive: giữ tỉ lệ canvas
  function setupCanvasSize() {
    if (!canvasEl) return;
    var wrap = canvasEl.closest('.connect-dots-canvas-wrap');
    var w = wrap ? wrap.clientWidth : 400;
    var dpr = window.devicePixelRatio || 1;
    var size = Math.min(w, 420);
    canvasEl.width = size * dpr;
    canvasEl.height = size * dpr;
    canvasEl.style.width = size + 'px';
    canvasEl.style.height = size + 'px';
    G.redraw();
  }

  if (canvasEl) {
    window.addEventListener('resize', setupCanvasSize);
  }

  setupCanvasSize();
  fillShapeSelector();
  var initialShape = S.getShape(shapeSelect ? shapeSelect.value : 'star') || S.getRandomShape();
  startWithShape(initialShape);
})();
