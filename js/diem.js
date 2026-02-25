/**
 * Module dùng chung: lưu / đọc Điểm (Diem) cho mọi game.
 * Mỗi game dùng 1 key riêng (vd: "counting", "alphabet").
 * Lưu trong localStorage với prefix webgame_diem_
 */
(function () {
  'use strict';

  const PREFIX = 'webgame_diem_';
  const PREFIX_HIGH = 'webgame_diem_high_';

  /**
   * Lưu điểm cho một game.
   * @param {string} gameKey - Key riêng của game (vd: "counting", "alphabet")
   * @param {number} diem - Số điểm cần lưu
   */
  function saveDiem(gameKey, diem) {
    if (!gameKey || typeof gameKey !== 'string') return;
    const key = PREFIX + gameKey;
    try {
      localStorage.setItem(key, String(Math.max(0, Number(diem) || 0)));
    } catch (e) {
      console.warn('saveDiem failed:', e);
    }
  }

  /**
   * Đọc điểm đã lưu của một game.
   * @param {string} gameKey - Key riêng của game
   * @returns {number} Điểm (mặc định 0 nếu chưa có)
   */
  function loadDiem(gameKey) {
    if (!gameKey || typeof gameKey !== 'string') return 0;
    const key = PREFIX + gameKey;
    try {
      const val = localStorage.getItem(key);
      return Math.max(0, parseInt(val, 10) || 0);
    } catch (e) {
      return 0;
    }
  }

  /**
   * Lưu điểm cao nhất (chỉ cập nhật khi điểm mới > điểm cao hiện tại).
   * @param {string} gameKey - Key riêng của game
   * @param {number} diem - Điểm hiện tại (chỉ lưu nếu cao hơn kỷ lục)
   */
  function saveHighScore(gameKey, diem) {
    if (!gameKey || typeof gameKey !== 'string') return;
    const num = Math.max(0, Number(diem) || 0);
    if (num <= loadHighScore(gameKey)) return;
    const key = PREFIX_HIGH + gameKey;
    try {
      localStorage.setItem(key, String(num));
    } catch (e) {
      console.warn('saveHighScore failed:', e);
    }
  }

  /**
   * Đọc điểm cao nhất của một game.
   * @param {string} gameKey - Key riêng của game
   * @returns {number} Điểm cao nhất (mặc định 0 nếu chưa có)
   */
  function loadHighScore(gameKey) {
    if (!gameKey || typeof gameKey !== 'string') return 0;
    const key = PREFIX_HIGH + gameKey;
    try {
      const val = localStorage.getItem(key);
      return Math.max(0, parseInt(val, 10) || 0);
    } catch (e) {
      return 0;
    }
  }

  /** Gắn lên window để mọi page đều dùng được */
  window.webGameDiem = {
    saveDiem: saveDiem,
    loadDiem: loadDiem,
    saveHighScore: saveHighScore,
    loadHighScore: loadHighScore
  };
})();
