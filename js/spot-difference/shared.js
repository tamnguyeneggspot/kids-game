(function () {
  'use strict';

  var GAME_KEY = 'spotDifference';

  /**
   * differences: { x, y, r } theo % trên ảnh bên phải.
   * x,y: % từ trái/trên; r: bán kính (đơn vị % cạnh ngắn).
   */
  var SPOT_DIFF_LEVELS = [
    {
      id: 'level-1',
      name: 'Cảnh 1',
      imageLeft: 'img/spot-difference/level-1-left.svg',
      imageRight: 'img/spot-difference/level-1-right.svg',
      differences: [
        { x: 18, y: 22, r: 6 }, // mặt trời
        { x: 66, y: 56, r: 6 }, // tán cây
        { x: 78, y: 78, r: 7 }  // bông hoa
      ]
    },
    {
      id: 'level-2',
      name: 'Cảnh 2',
      imageLeft: 'img/spot-difference/level-2-left.svg',
      imageRight: 'img/spot-difference/level-2-right.svg',
      differences: [
        { x: 22, y: 70, r: 7 }, // bóng bay
        { x: 52, y: 62, r: 7 }, // cửa sổ (giữa toà nhà, khác số ô kính)
        { x: 82, y: 51, r: 6 }  // chim
      ]
    },
    {
      id: 'level-3',
      name: 'Cảnh 3 (Bãi biển)',
      imageLeft: 'img/spot-difference/level-3-left.svg',
      imageRight: 'img/spot-difference/level-3-right.svg',
      differences: [
        { x: 20, y: 23, r: 6 },  // mặt trời
        { x: 50, y: 35, r: 6 }, // ô (tán dù, cao hơn)
        { x: 78, y: 73, r: 6 }  // bóng
      ]
    },
    {
      id: 'level-4',
      name: 'Cảnh 4 (Phòng)',
      imageLeft: 'img/spot-difference/level-4-left.svg',
      imageRight: 'img/spot-difference/level-4-right.svg',
      differences: [
        { x: 47, y: 25, r: 6 },  // đèn
        { x: 63, y: 35, r: 6 }, // tranh
        { x: 25, y: 60, r: 7 }  // cây (bông)
      ]
    },
    {
      id: 'level-5',
      name: 'Cảnh 5 (Rừng)',
      imageLeft: 'img/spot-difference/level-5-left.svg',
      imageRight: 'img/spot-difference/level-5-right.svg',
      differences: [
        { x: 23, y: 25, r: 6 },  // chim
        { x: 63, y: 45, r: 6 }, // bướm
        { x: 80, y: 75, r: 6 }  // nấm
      ]
    },
    {
      id: 'level-6',
      name: 'Cảnh 6 (Dưới biển)',
      imageLeft: 'img/spot-difference/level-6-left.svg',
      imageRight: 'img/spot-difference/level-6-right.svg',
      differences: [
        { x: 30, y: 40, r: 6 },  // cá
        { x: 70, y: 70, r: 6 }, // sao biển
        { x: 53, y: 30, r: 6 }  // bong bóng
      ]
    },
    {
      id: 'level-7',
      name: 'Cảnh 7 (Bầu trời)',
      imageLeft: 'img/spot-difference/level-7-left.svg',
      imageRight: 'img/spot-difference/level-7-right.svg',
      differences: [
        { x: 87, y: 20, r: 6 },  // mặt trời
        { x: 28, y: 22, r: 7 }, // mây
        { x: 50, y: 50, r: 7 }, // khinh khí cầu
        { x: 75, y: 35, r: 6 }  // máy bay
      ]
    },
    {
      id: 'level-8',
      name: 'Cảnh 8 (Nông trại)',
      imageLeft: 'img/spot-difference/level-8-left.svg',
      imageRight: 'img/spot-difference/level-8-right.svg',
      differences: [
        { x: 52, y: 61, r: 6 },  // cửa sổ
        { x: 70, y: 65, r: 7 }, // bò
        { x: 53, y: 85, r: 6 }  // hàng rào (cột thiếu)
      ]
    },
    {
      id: 'level-9',
      name: 'Cảnh 9 (Thành phố)',
      imageLeft: 'img/spot-difference/level-9-left.svg',
      imageRight: 'img/spot-difference/level-9-right.svg',
      differences: [
        { x: 58, y: 34, r: 6 },  // cửa sổ tòa nhà
        { x: 28, y: 83, r: 6 }, // ô tô
        { x: 80, y: 63, r: 6 }  // đèn giao thông
      ]
    },
    {
      id: 'level-10',
      name: 'Cảnh 10 (Tiệc sinh nhật)',
      imageLeft: 'img/spot-difference/level-10-left.svg',
      imageRight: 'img/spot-difference/level-10-right.svg',
      differences: [
        { x: 50, y: 45, r: 7 },  // bánh (nến)
        { x: 23, y: 30, r: 6 }, // bóng bay
        { x: 75, y: 50, r: 6 }  // hộp quà
      ]
    }
  ];

  function getLevels() {
    return SPOT_DIFF_LEVELS.slice();
  }

  function getLevel(id) {
    for (var i = 0; i < SPOT_DIFF_LEVELS.length; i++) {
      if (SPOT_DIFF_LEVELS[i].id === id) return SPOT_DIFF_LEVELS[i];
    }
    return SPOT_DIFF_LEVELS[0] || null;
  }

  function getNextLevelId(currentId) {
    if (!SPOT_DIFF_LEVELS.length) return null;
    var idx = 0;
    for (var i = 0; i < SPOT_DIFF_LEVELS.length; i++) {
      if (SPOT_DIFF_LEVELS[i].id === currentId) { idx = i; break; }
    }
    var next = (idx + 1) % SPOT_DIFF_LEVELS.length;
    return SPOT_DIFF_LEVELS[next].id;
  }

  function showCelebration() {
    removeCelebration();
    var container = document.createElement('div');
    container.className = 'celebration-wrap';
    container.setAttribute('aria-hidden', 'true');
    var colors = ['#6b4ce6', '#22c55e', '#fbbf24', '#f59e0b', '#ec4899', '#06b6d4'];
    var emojis = ['🎉', '⭐', '🌟', '✨', '🎈', '🌸'];
    for (var i = 0; i < 24; i++) {
      var p = document.createElement('span');
      p.className = 'celebration-piece';
      p.textContent = emojis[i % emojis.length];
      p.style.setProperty('--i', i);
      p.style.setProperty('--color', colors[i % colors.length]);
      container.appendChild(p);
    }
    document.body.appendChild(container);
  }

  function showWrongEffect() {
    removeWrongEffect();
    var container = document.createElement('div');
    container.className = 'wrong-effect-wrap';
    container.setAttribute('aria-hidden', 'true');
    var emojis = ['😅', '🙈', '💫', '😢', '✨', '💔'];
    for (var i = 0; i < 18; i++) {
      var p = document.createElement('span');
      p.className = 'wrong-effect-piece';
      p.textContent = emojis[i % emojis.length];
      p.style.setProperty('--i', i);
      container.appendChild(p);
    }
    document.body.appendChild(container);
    setTimeout(removeWrongEffect, 1200);
  }

  function removeWrongEffect() {
    var wrap = document.querySelector('.wrong-effect-wrap');
    if (wrap) wrap.remove();
  }

  function removeCelebration() {
    var wrap = document.querySelector('.celebration-wrap');
    if (wrap) wrap.remove();
  }

  window.spotDifferenceShared = {
    GAME_KEY: GAME_KEY,
    getLevels: getLevels,
    getLevel: getLevel,
    getNextLevelId: getNextLevelId,
    showCelebration: showCelebration,
    showWrongEffect: showWrongEffect,
    removeWrongEffect: removeWrongEffect,
    removeCelebration: removeCelebration
  };
})();

