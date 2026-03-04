/**
 * Logic game Nối chấm theo số: vẽ chấm + số, vẽ đường khi click đúng thứ tự, check hoàn thành.
 * Dùng canvas: tọa độ % từ shape được quy đổi sang pixel theo kích thước canvas.
 */
(function () {
  'use strict';

  var S = window.connectDotsShared;
  if (!S) {
    console.error('connectDotsShared chưa được load.');
    return;
  }

  var HIT_RADIUS = 18;
  var DOT_RADIUS = 14;
  var LINE_WIDTH = 4;
  var LINE_COLOR = '#5b21b6';
  var DOT_FILL = '#fff';
  var DOT_STROKE = '#8b5cf6';
  var TEXT_COLOR = '#1e1b4b';
  var DOT_FILL_CORRECT = '#dcfce7';
  var DOT_STROKE_CORRECT = '#22c55e';
  var TEXT_COLOR_CORRECT = '#166534';

  var state = {
    shape: null,
    pixelPoints: [],
    currentStep: 0,
    completed: false,
    canvas: null,
    width: 0,
    height: 0
  };

  /**
   * Chuyển điểm % (0–100) sang pixel.
   * @param {number} w - width canvas
   * @param {number} h - height canvas
   * @param {Array<{x: number, y: number}>} points - tọa độ %
   * @returns {Array<{x: number, y: number}>}
   */
  function toPixelPoints(w, h, points) {
    var padding = 8;
    var min = padding;
    var maxX = w - padding;
    var maxY = h - padding;
    var rangeX = maxX - min;
    var rangeY = maxY - min;
    return points.map(function (p) {
      return {
        x: min + (p.x / 100) * rangeX,
        y: min + (p.y / 100) * rangeY
      };
    });
  }

  /**
   * Vẽ toàn bộ: đường đã nối + chấm + số.
   */
  function draw() {
    var c = state.canvas;
    if (!c || !state.shape) return;
    var ctx = c.getContext('2d');
    var pts = state.pixelPoints;
    var step = state.currentStep;
    var n = pts.length;

    ctx.clearRect(0, 0, state.width, state.height);

    // Đường đã nối (1→2, 2→3, ... step-1→step); hoàn thành thì nối thêm đoạn cuối → 1
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (var i = 0; i < step && i < n; i++) {
      if (i === 0) {
        ctx.moveTo(pts[0].x, pts[0].y);
      } else {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
    }
    if (step >= n && n > 1) {
      ctx.lineTo(pts[0].x, pts[0].y);
    }
    ctx.stroke();

    // Chấm + số (chấm đã click đúng: highlight xanh)
    var fontSize = Math.max(12, Math.min(20, state.width / 25));
    ctx.font = 'bold ' + fontSize + 'px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var j = 0; j < n; j++) {
      var px = pts[j].x;
      var py = pts[j].y;
      var isCorrect = j < step;
      ctx.fillStyle = isCorrect ? DOT_FILL_CORRECT : DOT_FILL;
      ctx.strokeStyle = isCorrect ? DOT_STROKE_CORRECT : DOT_STROKE;
      ctx.lineWidth = isCorrect ? 3 : 2;
      ctx.beginPath();
      ctx.arc(px, py, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = isCorrect ? TEXT_COLOR_CORRECT : TEXT_COLOR;
      ctx.fillText(String(j + 1), px, py);
    }
  }

  /**
   * Khởi tạo hình trên canvas: vẽ lại chấm + số, chưa vẽ đường; currentStep = 0.
   * @param {{id: string, name: string, points: Array<{x: number, y: number}>}} shape
   * @param {HTMLCanvasElement} canvas
   */
  function initShape(shape, canvas) {
    if (!shape || !shape.points || !canvas) return;
    state.shape = shape;
    state.canvas = canvas;
    state.width = canvas.width;
    state.height = canvas.height;
    state.currentStep = 0;
    state.completed = false;
    state.pixelPoints = toPixelPoints(state.width, state.height, shape.points);
    draw();
  }

  /**
   * Hit test: (x, y) tọa độ trong canvas thuộc chấm nào (index 0..n-1)?
   * @param {number} x - tọa độ trong canvas
   * @param {number} y
   * @returns {number} index chấm hoặc -1
   */
  function getPointAt(x, y) {
    var pts = state.pixelPoints;
    for (var i = 0; i < pts.length; i++) {
      var dx = x - pts[i].x;
      var dy = y - pts[i].y;
      if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) return i;
    }
    return -1;
  }

  /**
   * Xử lý khi click vào chấm.
   * @param {number} index - index chấm (0..n-1)
   * @returns {{ correct: boolean, completed: boolean }}
   */
  function onPointClick(index) {
    if (state.completed || !state.shape) return { correct: false, completed: false };
    var step = state.currentStep;
    var n = state.pixelPoints.length;
    if (index < 0 || index >= n) return { correct: false, completed: false };

    if (index !== step) {
      return { correct: false, completed: false };
    }

    state.currentStep = step + 1;
    draw();
    var completed = state.currentStep >= n;
    if (completed) {
      state.completed = true;
    }
    return { correct: true, completed: completed };
  }

  /**
   * Reset: currentStep = 0, vẽ lại chỉ chấm.
   */
  function resetGame() {
    state.currentStep = 0;
    state.completed = false;
    draw();
  }

  function getState() {
    return {
      shape: state.shape,
      currentStep: state.currentStep,
      completed: state.completed,
      totalPoints: state.pixelPoints.length
    };
  }

  /**
   * Gọi khi resize canvas để vẽ lại đúng tỉ lệ (main sẽ set canvas width/height rồi gọi redraw).
   */
  function redraw() {
    if (state.canvas && state.shape) {
      state.width = state.canvas.width;
      state.height = state.canvas.height;
      state.pixelPoints = toPixelPoints(state.width, state.height, state.shape.points);
      draw();
    }
  }

  window.ConnectDotsGame = {
    initShape: initShape,
    getPointAt: getPointAt,
    onPointClick: onPointClick,
    resetGame: resetGame,
    getState: getState,
    redraw: redraw
  };
})();
