/**
 * Data và helper cho game Nối chấm theo số (Connect the dots).
 * Mỗi hình = array points [{x, y}, ...] tọa độ % (0–100) để scale vào canvas.
 */
(function () {
  'use strict';

  var GAME_KEY = 'connectDots';

  // Tọa độ % (0–100). Thứ tự nối: 1 → 2 → … → N (có thể nối N→1 khi hoàn thành).
  var CONNECT_DOTS_SHAPES = [
    {
      id: 'triangle',
      name: 'Tam giác',
      points: [
        { x: 50, y: 12 },
        { x: 88, y: 88 },
        { x: 12, y: 88 }
      ]
    },
    {
      id: 'square',
      name: 'Hình vuông',
      points: [
        { x: 18, y: 18 },
        { x: 82, y: 18 },
        { x: 82, y: 82 },
        { x: 18, y: 82 }
      ]
    },
    {
      id: 'star',
      name: 'Ngôi sao',
      points: [
        { x: 50, y: 8 },
        { x: 59, y: 35 },
        { x: 88, y: 38 },
        { x: 65, y: 58 },
        { x: 72, y: 88 },
        { x: 50, y: 72 },
        { x: 28, y: 88 },
        { x: 35, y: 58 },
        { x: 12, y: 38 },
        { x: 41, y: 35 }
      ]
    },
    {
      id: 'house',
      name: 'Ngôi nhà',
      points: [
        { x: 50, y: 10 },
        { x: 18, y: 48 },
        { x: 18, y: 90 },
        { x: 82, y: 90 },
        { x: 82, y: 48 }
      ]
    }
  ];

  /**
   * Lấy danh sách tất cả hình.
   * @returns {Array<{id: string, name: string, points: Array<{x: number, y: number}>}>}
   */
  function getShapes() {
    return CONNECT_DOTS_SHAPES;
  }

  /**
   * Lấy một hình theo id.
   * @param {string} id
   * @returns {{id: string, name: string, points: Array<{x: number, y: number}>}|null}
   */
  function getShape(id) {
    for (var i = 0; i < CONNECT_DOTS_SHAPES.length; i++) {
      if (CONNECT_DOTS_SHAPES[i].id === id) return CONNECT_DOTS_SHAPES[i];
    }
    return null;
  }

  /**
   * Lấy hình ngẫu nhiên.
   * @returns {{id: string, name: string, points: Array<{x: number, y: number}>}}
   */
  function getRandomShape() {
    var list = CONNECT_DOTS_SHAPES;
    return list[Math.floor(Math.random() * list.length)];
  }

  window.connectDotsShared = {
    GAME_KEY: GAME_KEY,
    getShapes: getShapes,
    getShape: getShape,
    getRandomShape: getRandomShape,
    CONNECT_DOTS_SHAPES: CONNECT_DOTS_SHAPES
  };
})();
